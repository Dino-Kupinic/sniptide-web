import { envValue, visitorAddress } from "./share-proxy"

// PostHog, shared with the app in one project. Events from this site carry surface=marketing.
// Without NEXT_PUBLIC_POSTHOG_KEY nothing is loaded or sent.
export const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY

// PostHog cloud region: https://eu.i.posthog.com or https://us.i.posthog.com. The privacy policy
// says where events are stored based on this value.
export const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://eu.i.posthog.com"

// Events go through this site (see next.config.ts) so ad blockers don't drop them. It sits under
// /_site because every other unknown path is a share link proxied to the app.
export const posthogProxyPath = "/_site/ph"

// The rewrite passes on the X-Forwarded-For it receives, which here holds the Cloudflare edge in
// front of this server. PostHog would then hash and locate the edge, not the visitor, so a
// cookieless visitor here never matched the same visitor on app.sniptide.com, which reports
// straight from the browser. proxy.ts sends PostHog the visitor address instead: CLIENT_IP_HEADER
// when set, otherwise Cloudflare's CF-Connecting-IP, otherwise the last X-Forwarded-For hop. A
// visitor who fakes CF-Connecting-IP only changes how their own events are counted.
export function headersForPostHog(headers: Headers) {
  const upstream = new Headers(headers)
  const address = envValue("CLIENT_IP_HEADER")
    ? visitorAddress(headers)
    : headers.get("cf-connecting-ip")?.trim() || visitorAddress(headers)
  if (address) upstream.set("x-forwarded-for", address)
  return upstream
}

// Pull request previews are served at <number>.sniptide.com and report to the same project, so
// every event says where it came from. Reports about real visitors filter on
// environment=production.
export type DeploymentEnvironment = "production" | "preview" | "development"

export function deploymentEnvironment(hostname: string): DeploymentEnvironment {
  if (hostname === "sniptide.com") return "production"
  if (/^\d+\.sniptide\.com$/.test(hostname)) return "preview"
  return "development"
}

// The region's static assets host: eu.i.posthog.com -> eu-assets.i.posthog.com.
export function posthogAssetsHost(host: string) {
  return host.replace(/^(https?:\/\/)(\w+)\.i\.posthog\.com/, "$1$2-assets.i.posthog.com")
}

// PostHog removes the IP from cookieless events before its GeoIP lookup runs, so those events
// would have no location. app/_site/country returns the country Cloudflare reports for the
// visitor, and withCountry adds it under PostHog's own GeoIP property names so web analytics and
// breakdowns use it. Only the country is sent, never an address or a city. Events with consent
// keep PostHog's own lookup.
export const countryPath = "/_site/country"

// The visitor's country as a CDN reports it, uppercase ISO 3166-1 alpha-2, or null. Cloudflare's
// XX (unknown) and T1 (Tor) aren't countries.
export function visitorCountry(headers: Headers) {
  const value =
    headers.get("cf-ipcountry") ??
    headers.get("x-vercel-ip-country") ??
    headers.get("cloudfront-viewer-country")
  const code = value?.trim().toUpperCase()
  return code && /^[A-Z]{2}$/.test(code) && code !== "XX" ? code : null
}

export function withCountry(properties: Record<string, unknown>, country: string | null) {
  if (!country || properties.$cookieless_mode !== true || properties.$geoip_country_code) return
  properties.$geoip_country_code = country
  try {
    const name = new Intl.DisplayNames(["en"], { type: "region" }).of(country)
    if (name && name !== country) properties.$geoip_country_name = name
  } catch {
    // An unknown region code still records the code.
  }
}
