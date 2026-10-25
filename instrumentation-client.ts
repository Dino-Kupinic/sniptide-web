import posthog from "posthog-js"
import { isAnalyticsExcluded } from "@/lib/analytics-preference"
import { ctaEvent } from "@/lib/cta"
import { posthogHost, posthogKey, posthogProxyPath } from "@/lib/posthog"

// Cookieless: no cookies or browser storage, so no consent banner. PostHog counts visitors with a
// daily server-side hash instead. Cookieless mode must be turned on in the PostHog project.
// Autocapture stays on for pageviews and clicks; this site shows no user content. Button clicks
// are also sent as cta_clicked with a stable location and target (lib/cta.ts), so funnels don't
// depend on selectors.
if (posthogKey && !isAnalyticsExcluded()) {
  posthog.init(posthogKey, {
    api_host: posthogProxyPath,
    ui_host: posthogHost.replace(".i.posthog.com", ".posthog.com"),
    defaults: "2026-08-30",
    cookieless_mode: "always",
    disable_session_recording: true,
    before_send: (event) => (isAnalyticsExcluded() ? null : event),
  })
  posthog.register({ surface: "marketing" })

  document.addEventListener("click", (event) => {
    const link = event.target instanceof Element ? event.target.closest("a") : null
    const cta = link && ctaEvent(link)
    if (cta) posthog.capture("cta_clicked", cta)
  })
}
