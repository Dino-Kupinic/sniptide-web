import { describe, expect, test } from "bun:test"
import { consentCookieDomain, parseConsent, serializeConsent } from "./consent"

describe("consent cookie", () => {
  test("reads a saved choice among other cookies", () => {
    expect(parseConsent("a=1; sniptide_consent=granted; b=2")).toBe("granted")
    expect(parseConsent("sniptide_consent=denied")).toBe("denied")
  })

  test("treats a missing or unknown value as no choice yet", () => {
    expect(parseConsent("")).toBe("pending")
    expect(parseConsent("sniptide_consent=maybe")).toBe("pending")
    expect(parseConsent("other_sniptide_consent=granted")).toBe("pending")
  })

  test("shares the cookie across sniptide.com and its subdomains only", () => {
    expect(consentCookieDomain("sniptide.com")).toBe(".sniptide.com")
    expect(consentCookieDomain("app.sniptide.com")).toBe(".sniptide.com")
    expect(consentCookieDomain("localhost")).toBeUndefined()
    expect(consentCookieDomain("notsniptide.com")).toBeUndefined()
  })

  test("writes a six-month, first-party cookie", () => {
    expect(serializeConsent("granted", "sniptide.com", true)).toBe(
      "sniptide_consent=granted; Path=/; Max-Age=15724800; SameSite=Lax; Domain=.sniptide.com; Secure",
    )
    expect(serializeConsent("denied", "localhost", false)).toBe(
      "sniptide_consent=denied; Path=/; Max-Age=15724800; SameSite=Lax",
    )
  })
})
