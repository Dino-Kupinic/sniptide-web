// The visitor's answer to the cookie banner. Nothing here talks to PostHog: lib/tracking.ts
// listens for changes and applies them.
//
// The choice lives in a first-party cookie on .sniptide.com, so the app at app.sniptide.com can
// read the same answer and join a visit on this site to the sign-up that follows.

export type ConsentChoice = "granted" | "denied"
export type ConsentStatus = ConsentChoice | "pending"

export const consentCookie = "sniptide_consent"

// Six months, then the banner asks again.
export const consentMaxAge = 60 * 60 * 24 * 182

const changeEvent = "sniptide:consent-change"
const openEvent = "sniptide:consent-open"

export function parseConsent(cookies: string): ConsentStatus {
  for (const part of cookies.split(";")) {
    const [name, value] = part.trim().split("=")
    if (name === consentCookie && (value === "granted" || value === "denied")) return value
  }
  return "pending"
}

// sniptide.com and its subdomains share the cookie. Any other host, such as localhost or a
// preview deployment, keeps it to itself.
export function consentCookieDomain(hostname: string) {
  return hostname === "sniptide.com" || hostname.endsWith(".sniptide.com")
    ? ".sniptide.com"
    : undefined
}

export function serializeConsent(choice: ConsentChoice, hostname: string, secure: boolean) {
  const domain = consentCookieDomain(hostname)
  return [
    `${consentCookie}=${choice}`,
    "Path=/",
    `Max-Age=${consentMaxAge}`,
    "SameSite=Lax",
    domain && `Domain=${domain}`,
    secure && "Secure",
  ]
    .filter(Boolean)
    .join("; ")
}

export function readConsent(): ConsentStatus {
  try {
    return parseConsent(document.cookie)
  } catch {
    return "pending"
  }
}

export function writeConsent(choice: ConsentChoice) {
  try {
    // biome-ignore lint/suspicious/noDocumentCookie: the Cookie Store API is missing in older Safari and Firefox.
    document.cookie = serializeConsent(
      choice,
      window.location.hostname,
      window.location.protocol === "https:",
    )
  } catch {
    // Cookies are blocked: the choice still applies to this page.
  }
  window.dispatchEvent(new CustomEvent<ConsentChoice>(changeEvent, { detail: choice }))
}

export function onConsentChange(listener: (choice: ConsentChoice) => void) {
  const handle = (event: Event) => listener((event as CustomEvent<ConsentChoice>).detail)
  window.addEventListener(changeEvent, handle)
  return () => window.removeEventListener(changeEvent, handle)
}

// The footer's Cookies link and the privacy policy reopen the banner.
export function openConsentSettings() {
  window.dispatchEvent(new Event(openEvent))
}

export function onConsentSettingsOpen(listener: () => void) {
  window.addEventListener(openEvent, listener)
  return () => window.removeEventListener(openEvent, listener)
}
