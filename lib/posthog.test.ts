import { afterEach, describe, expect, test } from "bun:test"
import { NextRequest } from "next/server"
import { GET as countryRoute } from "@/app/%5Fsite/country/route"
import { proxy } from "@/proxy"
import { deploymentEnvironment, headersForPostHog, visitorCountry, withCountry } from "./posthog"

describe("deployment environment", () => {
  test("labels the live site as production", () => {
    expect(deploymentEnvironment("sniptide.com")).toBe("production")
  })

  test("labels numbered pull request hosts as previews", () => {
    expect(deploymentEnvironment("33.sniptide.com")).toBe("preview")
    expect(deploymentEnvironment("150.sniptide.com")).toBe("preview")
  })

  test("labels every other host as development", () => {
    expect(deploymentEnvironment("localhost")).toBe("development")
    expect(deploymentEnvironment("app.sniptide.com")).toBe("development")
    expect(deploymentEnvironment("33.sniptide.com.example.org")).toBe("development")
  })
})

describe("visitor country", () => {
  test("reads the CDN's country header", () => {
    expect(visitorCountry(new Headers({ "cf-ipcountry": "at" }))).toBe("AT")
    expect(visitorCountry(new Headers({ "x-vercel-ip-country": "DE" }))).toBe("DE")
    expect(visitorCountry(new Headers())).toBeNull()
  })

  test("ignores Cloudflare's unknown and Tor codes", () => {
    expect(visitorCountry(new Headers({ "cf-ipcountry": "XX" }))).toBeNull()
    expect(visitorCountry(new Headers({ "cf-ipcountry": "T1" }))).toBeNull()
  })

  test("the route answers per visitor and is never cached", async () => {
    const response = countryRoute(
      new Request("https://sniptide.com/_site/country", { headers: { "cf-ipcountry": "AT" } }),
    )
    expect(response.headers.get("cache-control")).toBe("private, no-store")
    expect(await response.json()).toEqual({ country: "AT" })
  })

  test("adds the country to cookieless events only", () => {
    const cookieless: Record<string, unknown> = { $cookieless_mode: true }
    withCountry(cookieless, "AT")
    expect(cookieless).toMatchObject({ $geoip_country_code: "AT", $geoip_country_name: "Austria" })

    const consented: Record<string, unknown> = {}
    withCountry(consented, "AT")
    expect(consented.$geoip_country_code).toBeUndefined()
  })

  test("keeps a country PostHog already set and skips a missing one", () => {
    const located: Record<string, unknown> = { $cookieless_mode: true, $geoip_country_code: "DE" }
    withCountry(located, "AT")
    expect(located.$geoip_country_code).toBe("DE")

    const unknown: Record<string, unknown> = { $cookieless_mode: true }
    withCountry(unknown, null)
    expect(unknown.$geoip_country_code).toBeUndefined()
  })
})

describe("visitor address for PostHog", () => {
  const configured = process.env.CLIENT_IP_HEADER
  afterEach(() => {
    if (configured === undefined) delete process.env.CLIENT_IP_HEADER
    else process.env.CLIENT_IP_HEADER = configured
  })

  test("replaces the Cloudflare edge with the visitor", () => {
    delete process.env.CLIENT_IP_HEADER
    const headers = headersForPostHog(
      new Headers({ "x-forwarded-for": "172.68.50.73", "cf-connecting-ip": "203.0.113.9" }),
    )
    expect(headers.get("x-forwarded-for")).toBe("203.0.113.9")
  })

  test("uses the last X-Forwarded-For hop without Cloudflare", () => {
    delete process.env.CLIENT_IP_HEADER
    const headers = headersForPostHog(
      new Headers({ "x-forwarded-for": "198.51.100.1, 203.0.113.9" }),
    )
    expect(headers.get("x-forwarded-for")).toBe("203.0.113.9")
  })

  test("follows CLIENT_IP_HEADER when it is set", () => {
    process.env.CLIENT_IP_HEADER = "x-real-ip"
    const headers = headersForPostHog(
      new Headers({ "x-real-ip": "203.0.113.7", "cf-connecting-ip": "198.51.100.2" }),
    )
    expect(headers.get("x-forwarded-for")).toBe("203.0.113.7")
  })

  test("keeps the request as it is without an address", () => {
    process.env.CLIENT_IP_HEADER = "x-real-ip"
    const headers = headersForPostHog(new Headers({ "x-forwarded-for": "172.68.50.73" }))
    expect(headers.get("x-forwarded-for")).toBe("172.68.50.73")
  })

  test("the proxy sends the visitor address on PostHog requests only", () => {
    delete process.env.CLIENT_IP_HEADER
    const headers = { "x-forwarded-for": "172.68.50.73", "cf-connecting-ip": "203.0.113.9" }
    const forwarded = (path: string) => {
      const response = proxy(new NextRequest(`https://sniptide.com${path}`, { headers }))
      const overridden = response.headers.get("x-middleware-override-headers")?.split(",") ?? []
      return overridden.includes("x-forwarded-for")
        ? response.headers.get("x-middleware-request-x-forwarded-for")
        : headers["x-forwarded-for"]
    }
    expect(forwarded("/_site/ph/e/")).toBe("203.0.113.9")
    expect(forwarded("/k7Qe2x")).toBe("172.68.50.73")
  })
})
