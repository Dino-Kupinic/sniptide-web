import posthog from "posthog-js"
import { posthogHost, posthogKey, posthogProxyPath } from "@/lib/posthog"

// Cookieless: no cookies or browser storage, so no consent banner. PostHog counts visitors with a
// daily server-side hash instead. Cookieless mode must be turned on in the PostHog project.
// Autocapture records clicks on the sign-up and paste buttons; this site shows no user content.
if (posthogKey) {
  posthog.init(posthogKey, {
    api_host: posthogProxyPath,
    ui_host: posthogHost.replace(".i.posthog.com", ".posthog.com"),
    defaults: "2026-08-30",
    cookieless_mode: "always",
    disable_session_recording: true,
  })
  posthog.register({ surface: "marketing" })
}
