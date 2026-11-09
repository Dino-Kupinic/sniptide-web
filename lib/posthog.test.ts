import { describe, expect, test } from "bun:test"
import { GET as countryRoute } from "@/app/%5Fsite/country/route"
import { deploymentEnvironment, visitorCountry, withCountry } from "./posthog"

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
