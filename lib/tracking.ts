import posthog from "posthog-js"
import { isAnalyticsExcluded } from "@/lib/analytics-preference"
import {
  type ConsentState,
  consentCookieDomain,
  consentLabel,
  onConsentChange,
  readConsent,
} from "@/lib/consent"
import { ctaEvent } from "@/lib/cta"
import { isSectionSeen, newMilestones, outboundHost, scrollPercent } from "@/lib/funnel"
import { posthogHost, posthogKey, posthogProxyPath } from "@/lib/posthog"

// PostHog on sniptide.com, gated by the cookie banner (components/consent-banner.tsx).
//
// Until the visitor allows analytics, and after they refuse it, PostHog runs in cookieless mode: no
// cookies or browser storage, and visitors are counted with a daily server-side hash, as before the
// banner. Cookieless mode must be turned on in the PostHog project. With analytics allowed, PostHog
// keeps a visitor ID in a cookie on .sniptide.com, so a visit can be followed across days and into
// the app, and heatmaps start. Session replay is its own category and needs analytics.
//
// This site shows no user content, so autocapture stays on. Funnel steps are also sent as named
// events with stable properties, so funnels don't depend on selectors:
//   cta_clicked            { location, target }   a call to action (lib/cta.ts)
//   outbound_link_clicked  { location, host }     any other link that leaves Sniptide
//   section_viewed         { section, position }  a landing section came into view
//   scroll_depth_reached   { percent, path }      25, 50, 75 and 100% of a page
//   blog_action            { action, slug }       share, copy, open with AI or subscribe on the blog
//   consent_banner_shown   { trigger }            the banner or the settings appeared
//   consent_updated        { action, analytics, replay, source }  the visitor answered
// Every event carries surface=marketing and consent=pending|denied|analytics|analytics_replay.

let started = false
let consent: ConsentState = null

export function startTracking() {
  if (started || !posthogKey || isAnalyticsExcluded()) return
  started = true
  consent = readConsent()
  const analytics = consent?.analytics ?? false

  posthog.init(posthogKey, {
    api_host: posthogProxyPath,
    ui_host: posthogHost.replace(".i.posthog.com", ".posthog.com"),
    defaults: "2026-08-30",
    // Nothing is stored until the visitor accepts; until then PostHog captures cookieless.
    cookieless_mode: "on_reject",
    opt_out_capturing_by_default: true,
    // One visitor ID for sniptide.com and app.sniptide.com.
    cross_subdomain_cookie: true,
    capture_performance: { web_vitals: true },
    capture_exceptions: true,
    capture_heatmaps: analytics,
    capture_dead_clicks: analytics,
    disable_session_recording: !consent?.replay,
    disable_surveys: true,
    before_send: (event) => {
      if (!event || isAnalyticsExcluded()) return null
      event.properties.surface = "marketing"
      event.properties.consent = consentLabel(consent)
      return event
    },
  })
  applyConsent(consent)
  onConsentChange(applyConsent)
  listen()
}

export function track(event: string, properties?: Record<string, string | number | boolean>) {
  if (started && !isAnalyticsExcluded()) posthog.capture(event, properties)
}

function applyConsent(next: ConsentState) {
  const previous = posthog.get_explicit_consent_status()
  consent = next

  if (next?.replay) {
    posthog.set_config({ disable_session_recording: false })
    posthog.startSessionRecording()
  } else if (posthog.sessionRecordingStarted()) {
    posthog.stopSessionRecording()
  }

  if (next?.analytics) {
    if (previous !== "granted") posthog.opt_in_capturing({ captureEventName: false })
    posthog.set_config({ capture_heatmaps: true, capture_dead_clicks: true })
    return
  }
  // A visitor who refuses analytics, or whose choice expired, goes back to cookieless counting,
  // and what PostHog stored while analytics was allowed is removed.
  if (previous === "granted") {
    posthog.set_config({ capture_heatmaps: false, capture_dead_clicks: false })
  }
  if (next) {
    if (previous !== "denied") posthog.opt_out_capturing()
  } else if (previous !== "pending") {
    posthog.clear_opt_in_out_capturing()
  }
  if (previous === "granted") clearPostHogStorage()
}

function clearPostHogStorage() {
  try {
    for (const part of document.cookie.split(";")) {
      const name = part.split("=")[0]?.trim()
      if (!name?.startsWith("ph_")) continue
      const expired = `${name}=; Path=/; Max-Age=0`
      const domain = consentCookieDomain(window.location.hostname)
      // biome-ignore lint/suspicious/noDocumentCookie: the Cookie Store API is missing in older Safari and Firefox.
      document.cookie = expired
      // biome-ignore lint/suspicious/noDocumentCookie: as above.
      if (domain) document.cookie = `${expired}; Domain=${domain}`
    }
    for (const storage of [window.localStorage, window.sessionStorage]) {
      for (const key of Object.keys(storage)) {
        if (key.startsWith("ph_") || key.startsWith("__ph")) storage.removeItem(key)
      }
    }
  } catch {
    // Storage is blocked, so PostHog couldn't have written to it either.
  }
}

function listen() {
  document.addEventListener("click", (event) => {
    const link = event.target instanceof Element ? event.target.closest("a") : null
    if (!link) return
    const cta = ctaEvent(link)
    if (cta) {
      track("cta_clicked", cta)
      return
    }
    const host = outboundHost(link.getAttribute("href") ?? "", window.location.host)
    if (host) {
      const location =
        link.closest("[data-cta-location]")?.getAttribute("data-cta-location") ?? "page"
      track("outbound_link_clicked", { location, host })
    }
  })
}

// Section views and scroll depth for one page. Returns a cleanup for client-side navigation.
export function watchPage() {
  if (!started) return () => {}
  const path = window.location.pathname
  const reported = new Set<number>()
  const seen = new Set<Element>()
  const sections = [...document.querySelectorAll("main [data-cta-location]")]

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (seen.has(entry.target)) continue
        const visible = entry.intersectionRect.height
        if (!isSectionSeen(visible, entry.boundingClientRect.height, window.innerHeight)) continue
        seen.add(entry.target)
        observer.unobserve(entry.target)
        track("section_viewed", {
          section: entry.target.getAttribute("data-cta-location") ?? "unknown",
          position: sections.indexOf(entry.target) + 1,
        })
      }
    },
    { threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.8, 1] },
  )
  for (const section of sections) observer.observe(section)

  let frame = 0
  const measure = () => {
    frame = 0
    const percent = scrollPercent(
      window.scrollY,
      window.innerHeight,
      document.documentElement.scrollHeight,
    )
    for (const milestone of newMilestones(percent, reported)) {
      reported.add(milestone)
      track("scroll_depth_reached", { percent: milestone, path })
    }
  }
  const onScroll = () => {
    if (!frame) frame = window.requestAnimationFrame(measure)
  }
  window.addEventListener("scroll", onScroll, { passive: true })

  return () => {
    observer.disconnect()
    window.removeEventListener("scroll", onScroll)
    if (frame) window.cancelAnimationFrame(frame)
  }
}
