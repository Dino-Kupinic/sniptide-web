# Analytics

Set `NEXT_PUBLIC_POSTHOG_KEY` (and `NEXT_PUBLIC_POSTHOG_HOST`, which defaults to EU cloud) as build variables to
send events to PostHog. Requests go through `/_site/ph` on this site so ad blockers don't drop them.
The app reports to the same project; filter on the `surface` property (`marketing` or `app`).
Pull request previews at `<number>.sniptide.com` report to the same project too, so every marketing
event carries `environment`: `production` on `sniptide.com`, `preview` on a numbered preview host
and `development` anywhere else. Filter marketing reports on `environment` = `production`. Events
from before this property existed have none; filter them on `$host` = `sniptide.com`.
Without a key nothing loads and the cookie banner stays hidden.

A cookie banner (`components/consent-banner.tsx`) asks whether PostHog may use cookies, with
Reject all, Accept all and a settings dialog that has one switch per category: essential (always
on), analytics and session replay. Until the visitor allows analytics, and after they refuse it,
PostHog runs cookieless, which needs **Cookieless server hash mode** turned on in the PostHog
project settings. With analytics, PostHog keeps a visitor ID in a cookie on `.sniptide.com` and
draws heatmaps. With session replay as well, it records sessions. Turn on session replay and
heatmaps in the project. The answer is stored in the `sniptide_consent` cookie for six months, and
the Cookies link in the footer opens the settings. `lib/tracking.ts` lists the named funnel events,
and every event carries `consent` (`pending`, `denied`, `analytics` or `analytics_replay`).
PostHog removes the IP from cookieless events before its GeoIP lookup, so those events would have
no country. The site asks `/_site/country` for the country Cloudflare reports in `CF-IPCountry`
before PostHog starts, and adds it to cookieless events as `$geoip_country_code` and
`$geoip_country_name`. Only the country is sent, never the IP or a city. Events with consent keep
PostHog's own lookup. Cloudflare's IP Geolocation setting must stay on for this.
Re-check the privacy policy before adding another tracker or an `identify()` call.

To exclude your own browser, open `/_site/analytics` and select **Exclude this browser**. Use the
link there to repeat the choice for the app, and repeat in each browser you use. The choice
survives reloads and network changes. **Include this browser** removes the exclusion flag.
Clearing site data also removes it. Reload other open tabs after a change. The preference page
always skips analytics. This does not remove past events or change paste view counts.

Button and link clicks are also sent as `cta_clicked` with `location` (the section: `header`, `hero`,
`features`, `analytics`, `raw-links`, `cta` or `footer`, set with `data-cta-location`) and `target`
(`sign_up`, `sign_in`, `new_paste`, `dashboard`, `import_gist` or `anchor`). Funnels should use this
event rather than autocapture selectors. On the blog, links inside a post report as `blog-post` and the inline call to
action as `blog-inline`, and sharing, copying, opening with AI and subscribing send `blog_action`
with `action` and `slug`.
