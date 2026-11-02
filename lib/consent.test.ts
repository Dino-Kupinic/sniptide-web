import { describe, expect, test } from "bun:test"
import {
  consentCookieDomain,
  consentLabel,
  decodeConsent,
  encodeConsent,
  fullConsent,
  noConsent,
  parseConsent,
  serializeConsent,
} from "./consent"

describe("consent cookie", () => {
  test("reads a saved choice among other cookies", () => {
    expect(parseConsent("a=1; sniptide_consent=analytics; b=2")).toEqual({
      analytics: true,
      replay: false,
    })
    expect(parseConsent("sniptide_consent=analytics.replay")).toEqual(fullConsent)
    expect(parseConsent("sniptide_consent=none")).toEqual(noConsent)
  })

  test("reads the first version's all-or-nothing values", () => {
    expect(decodeConsent("granted")).toEqual(fullConsent)
    expect(decodeConsent("denied")).toEqual(noConsent)
  })

  test("treats a missing or unknown value as no choice yet", () => {
    expect(parseConsent("")).toBeNull()
    expect(parseConsent("sniptide_consent=maybe")).toBeNull()
    expect(parseConsent("sniptide_consent=analytics.ads")).toBeNull()
    expect(parseConsent("other_sniptide_consent=analytics")).toBeNull()
  })

  test("never stores replay without analytics", () => {
    expect(encodeConsent({ analytics: false, replay: true })).toBe("none")
    expect(decodeConsent("replay")).toEqual(noConsent)
  })

  test("labels the choice for events", () => {
    expect(consentLabel(null)).toBe("pending")
    expect(consentLabel(noConsent)).toBe("denied")
    expect(consentLabel({ analytics: true, replay: false })).toBe("analytics")
    expect(consentLabel(fullConsent)).toBe("analytics_replay")
  })

  test("shares the cookie across sniptide.com and its subdomains only", () => {
    expect(consentCookieDomain("sniptide.com")).toBe(".sniptide.com")
    expect(consentCookieDomain("app.sniptide.com")).toBe(".sniptide.com")
    expect(consentCookieDomain("localhost")).toBeUndefined()
    expect(consentCookieDomain("notsniptide.com")).toBeUndefined()
  })

  test("writes a six-month, first-party cookie", () => {
    expect(serializeConsent(fullConsent, "sniptide.com", true)).toBe(
      "sniptide_consent=analytics.replay; Path=/; Max-Age=15724800; SameSite=Lax; Domain=.sniptide.com; Secure",
    )
    expect(serializeConsent(noConsent, "localhost", false)).toBe(
      "sniptide_consent=none; Path=/; Max-Age=15724800; SameSite=Lax",
    )
  })
})
