import { unstable_cache } from "next/cache"
import { app } from "./links"

export type AppStatus = "operational" | "degraded" | "outage" | "maintenance"

export type StatusReport = {
  status: AppStatus | null
  // The public status page the footer links to, or null when none is configured.
  url: string | null
}

// The public Better Stack status page, such as https://status.sniptide.com. Read at runtime, so a
// deployment can add it without a rebuild.
export function statusPageUrl(): string | null {
  const value = process.env.STATUS_PAGE_URL?.trim()
  if (!value) return null
  try {
    const url = new URL(value)
    if (url.protocol !== "https:" && url.protocol !== "http:") return null
    return url.href.replace(/\/+$/, "")
  } catch {
    return null
  }
}

// Better Stack names the page's overall state in data.attributes.aggregate_state of its public
// index.json. Any other value returns null, so the footer never shows a state it can't name.
export function parseBetterStackState(data: unknown): AppStatus | null {
  if (typeof data !== "object" || data === null || !("data" in data)) return null
  const page = data.data
  if (typeof page !== "object" || page === null || !("attributes" in page)) return null
  const attributes = page.attributes
  if (typeof attributes !== "object" || attributes === null) return null
  const state = "aggregate_state" in attributes ? attributes.aggregate_state : undefined
  switch (state) {
    case "operational":
      return "operational"
    case "degraded":
      return "degraded"
    case "downtime":
      return "outage"
    case "maintenance":
      return "maintenance"
    default:
      return null
  }
}

async function fetchJson(url: string): Promise<{ ok: boolean; data: unknown }> {
  const response = await fetch(url, {
    cache: "no-store",
    signal: AbortSignal.timeout(3000),
    headers: { Accept: "application/json" },
  })
  const data: unknown = await response.json().catch(() => null)
  return { ok: response.ok, data }
}

// The app's /api/health answers {"ok":true} while its server and database respond. It covers
// sites without a status page, and a status page that doesn't answer.
async function healthStatus(): Promise<AppStatus> {
  const { ok, data } = await fetchJson(app("/api/health"))
  const healthy = typeof data === "object" && data !== null && "ok" in data && data.ok === true
  return ok && healthy ? "operational" : "outage"
}

// The status page reads the same monitors that alert the maintainer, from several regions, so
// the footer agrees with the page it links to.
async function betterStackStatus(pageUrl: string): Promise<AppStatus | null> {
  try {
    const { ok, data } = await fetchJson(`${pageUrl}/index.json`)
    return ok ? parseBetterStackState(data) : null
  } catch {
    return null
  }
}

// A minute of caching keeps the footer from calling either source on every request.
const cachedStatus = unstable_cache(
  async (pageUrl: string | null): Promise<AppStatus> => {
    const fromPage = pageUrl ? await betterStackStatus(pageUrl) : null
    return fromPage ?? (await healthStatus())
  },
  ["app-status"],
  { revalidate: 60 },
)

// The status is null when every check fails, such as a timeout, so the footer shows nothing rather
// than guess.
export async function getStatusReport(): Promise<StatusReport> {
  const url = statusPageUrl()
  try {
    return { status: await cachedStatus(url), url }
  } catch {
    return { status: null, url }
  }
}
