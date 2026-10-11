// PostHog, shared with the app in one project. Events from this site carry surface=marketing.
// Without NEXT_PUBLIC_POSTHOG_KEY nothing is loaded or sent.
export const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY

// PostHog cloud region: https://us.i.posthog.com or https://eu.i.posthog.com.
export const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com"

// Events go through this site (see next.config.ts) so ad blockers don't drop them. It sits under
// /_site because every other unknown path is a share link proxied to the app.
export const posthogProxyPath = "/_site/ph"

// The region's static assets host: us.i.posthog.com -> us-assets.i.posthog.com.
export function posthogAssetsHost(host: string) {
  return host.replace(/^(https?:\/\/)(\w+)\.i\.posthog\.com/, "$1$2-assets.i.posthog.com")
}
