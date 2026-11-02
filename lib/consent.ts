// The visitor's answer to the cookie banner, per category. Nothing here talks to PostHog:
// lib/tracking.ts listens for changes and applies them.
//
// The choice lives in a first-party cookie on .sniptide.com, so the app at app.sniptide.com can
// read the same answer and join a visit on this site to the sign-up that follows.

// Essential storage (this cookie) needs no consent, so only these two are asked about. Session
// replay needs analytics: PostHog drops recordings while it runs cookieless.
export const consentCategories = ["analytics", "replay"] as const
export type ConsentCategory = (typeof consentCategories)[number]
export type Consent = Record<ConsentCategory, boolean>
// null until the visitor answers.
export type ConsentState = Consent | null

export const noConsent: Consent = { analytics: false, replay: false }
export const fullConsent: Consent = { analytics: true, replay: true }

export const consentCookie = "sniptide_consent"

// Six months, then the banner asks again.
export const consentMaxAge = 60 * 60 * 24 * 182

const changeEvent = "sniptide:consent-change"
const openEvent = "sniptide:consent-open"

// Replay without analytics can't record, so it is switched off with it.
export function normalizeConsent(consent: Consent): Consent {
  return { analytics: consent.analytics, replay: consent.analytics && consent.replay }
}

// "none", "analytics" or "analytics.replay". The first version stored "granted" or "denied".
export function encodeConsent(consent: Consent) {
  const granted = consentCategories.filter((category) => normalizeConsent(consent)[category])
  return granted.length ? granted.join(".") : "none"
}

export function decodeConsent(value: string | undefined): ConsentState {
  if (value === "granted") return fullConsent
  if (value === "denied" || value === "none") return noConsent
  if (!value) return null
  const parts = value.split(".")
  if (!parts.every((part) => (consentCategories as readonly string[]).includes(part))) return null
  return normalizeConsent({
    analytics: parts.includes("analytics"),
    replay: parts.includes("replay"),
  })
}

export function parseConsent(cookies: string): ConsentState {
  for (const part of cookies.split(";")) {
    const [name, value] = part.trim().split("=")
    if (name === consentCookie) return decodeConsent(value)
  }
  return null
}

// The value every event carries as `consent`.
export function consentLabel(consent: ConsentState) {
  if (!consent) return "pending"
  if (!consent.analytics) return "denied"
  return consent.replay ? "analytics_replay" : "analytics"
}

// sniptide.com and its subdomains share the cookie. Any other host, such as localhost or a
// preview deployment, keeps it to itself.
export function consentCookieDomain(hostname: string) {
  return hostname === "sniptide.com" || hostname.endsWith(".sniptide.com")
    ? ".sniptide.com"
    : undefined
}

export function serializeConsent(consent: Consent, hostname: string, secure: boolean) {
  const domain = consentCookieDomain(hostname)
  return [
    `${consentCookie}=${encodeConsent(consent)}`,
    "Path=/",
    `Max-Age=${consentMaxAge}`,
    "SameSite=Lax",
    domain && `Domain=${domain}`,
    secure && "Secure",
  ]
    .filter(Boolean)
    .join("; ")
}

export function readConsent(): ConsentState {
  try {
    return parseConsent(document.cookie)
  } catch {
    return null
  }
}

export function writeConsent(consent: Consent) {
  const next = normalizeConsent(consent)
  try {
    // biome-ignore lint/suspicious/noDocumentCookie: the Cookie Store API is missing in older Safari and Firefox.
    document.cookie = serializeConsent(
      next,
      window.location.hostname,
      window.location.protocol === "https:",
    )
  } catch {
    // Cookies are blocked: the choice still applies to this page.
  }
  window.dispatchEvent(new CustomEvent<Consent>(changeEvent, { detail: next }))
}

export function onConsentChange(listener: (consent: Consent) => void) {
  const handle = (event: Event) => listener((event as CustomEvent<Consent>).detail)
  window.addEventListener(changeEvent, handle)
  return () => window.removeEventListener(changeEvent, handle)
}

// The footer's Cookies link and the privacy policy open the cookie settings.
export function openConsentSettings() {
  window.dispatchEvent(new Event(openEvent))
}

export function onConsentSettingsOpen(listener: () => void) {
  window.addEventListener(openEvent, listener)
  return () => window.removeEventListener(openEvent, listener)
}
