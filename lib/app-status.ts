import { unstable_cache } from "next/cache"
import { app } from "./links"

export type AppStatus = "operational" | "degraded"

// The app's /api/health answers {"ok":true} while its server and database respond. A minute of
// caching keeps the footer from calling it on every request.
const cachedStatus = unstable_cache(
  async (): Promise<AppStatus> => {
    const response = await fetch(app("/api/health"), {
      cache: "no-store",
      signal: AbortSignal.timeout(3000),
    })
    const data: unknown = await response.json().catch(() => null)
    const ok = typeof data === "object" && data !== null && "ok" in data && data.ok === true
    return response.ok && ok ? "operational" : "degraded"
  },
  ["app-status"],
  { revalidate: 60 },
)

// Null when the check itself fails, such as a timeout, so the footer shows nothing rather than
// guess.
export async function getAppStatus(): Promise<AppStatus | null> {
  try {
    return await cachedStatus()
  } catch {
    return null
  }
}
