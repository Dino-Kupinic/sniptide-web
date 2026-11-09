# Deployment

Coolify builds the `Dockerfile` from `main` (port `3000`, health check `GET /`) and serves it at
`https://sniptide.com`. The app runs separately at `https://app.sniptide.com`.

sniptide.com is shared with the app in two ways (`next.config.ts`):

- **Share links stay on sniptide.com.** Any path without a page here (`/k7Qe2x`, `/k7Qe2x/raw`,
  `POST /k7Qe2x/reveal`, the app's `/_next/*` assets those pages load) is proxied to the app, so
  the address bar keeps sniptide.com. This site's own assets live under `/_site` so they never
  collide with the app's. A burn-after-read paste is consumed only by that POST. Every other
  method on `/<slug>/reveal` is `405` with `Allow: POST`. Known preview bots, and posts whose
  `Sec-Fetch-Site` is `cross-site`, are `403`. None of those are forwarded.
- **App pages redirect.** `/sign-in`, `/dashboard`, `/new`, `/settings`, … and `/api/auth/*` get a
  308 to the same path on app.sniptide.com. Add new app sections to `appPages` there.

The app needs `SHARE_URL=https://sniptide.com` so its dashboard copies sniptide.com links.

The root page (`/`) sends visitors to the app dashboard only after the app validates their session.
Logged-out visitors, stale cookies, and failed session checks show marketing instead. Session
checks are uncached and time out after three seconds. `/home` always shows marketing, even when
signed in, and never contacts the app. The marketing logo links there so browsing the site doesn't
send signed-in visitors back to the dashboard.

On a proxied request the app would otherwise see this site's address. Set `SHARE_PROXY_SECRET` to
the same value on both apps and each proxied request includes `X-Sniptide-Client-IP` and
`X-Sniptide-Proxy-Secret`. The app checks the secret and trusts that address. When the secret is
unset, or no visitor address is available, neither header is sent. A visitor cannot supply them.

`CLIENT_IP_HEADER` names the incoming header the address is read from. Leave it unset to use the
last hop of `X-Forwarded-For`, which is what a single reverse proxy appends, so a self-hosted site
needs nothing else. If the chosen header is missing, no address is forwarded.

Build-time settings: `NEXT_PUBLIC_APP_URL`, where buttons, redirects and the proxy point, defaults
to `https://app.sniptide.com`. `NEXT_PUBLIC_DEMO_URL`, where "Try the demo" points, defaults to
`https://demo.sniptide.com/demo` (an app instance running with `DEMO_MODE=true`).
`SHARE_PROXY_SECRET`, `CLIENT_IP_HEADER` and `GITHUB_TOKEN` are read at runtime. `GITHUB_TOKEN` is
optional and raises the GitHub rate limit for the changelog, described under
[the changelog guide](changelog.md).

## Search engines and link previews

- **Metadata.** `app/layout.tsx` sets the base URL, the title template, the description and the
  Open Graph and Twitter tags that every page inherits. A page sets its own `title`, `description`
  and `alternates.canonical` in its `metadata` export, and its link previews reuse them. `/home`
  repeats `/`, so its canonical link points at `/`.
- **Images.** `app/opengraph-image.tsx` and `app/twitter-image.tsx` render the 1200 by 630 card
  with the large white logo in the middle of a black field (`lib/og.tsx`).
  They are generated once at build time, and Next adds the tags to every page.
- **Crawling.** `app/robots.ts` allows everything and links the sitemap, and `app/sitemap.ts` lists
  the paths in `sitemapPaths` (`lib/site.ts`). Add a page's path there when it ships.
- **IndexNow.** After a push to `main`, `.github/workflows/indexnow.yml` runs `bun run indexnow`.
  It compares this checkout's sitemap with the live one, waits until sniptide.com serves the new
  build, and submits the new, re-dated and removed URLs to IndexNow, which Bing, Yandex, Naver,
  Seznam and Yep read. Google doesn't, so Search Console still covers Google. A page counts as
  changed when its `lastModified` in `app/sitemap.ts` changes, so bump that date when you edit a
  page. To submit every URL, run the workflow by hand with **all** checked, or run
  `bun run indexnow --all`. `--dry` prints the list without sending it. The key lives
  only in `public/<key>.txt`, which contains its own name, and `lib/indexnow.ts` reads it from
  there so secret scanners don't flag a key in the source.
- **Structured data.** [Agents and search engines](agents.md) describes the JSON-LD and the files for agents.

A route here shadows a paste link with the same name, because this site answers first and only
unknown paths go to the app. Generated links are eight random characters and custom links start
with `@` (`/@dino/notes`), so a new top-level route (such as `/opengraph-image`) needs no
reservation in the app.

## Legal pages

`/impressum`, `/privacy` and `/terms` are linked from the footer. They are templates, not legal
advice. The operator's name, address, register entries, hosting provider and similar details live
in `lib/legal.ts`; anything in [square brackets] on the live pages is still a placeholder. Whether
the privacy policy says PostHog stores events in the EU or the US follows
`NEXT_PUBLIC_POSTHOG_HOST`, which defaults to EU cloud. These paths are real pages, and custom links
start with `@`, so no new paste link can take `terms`, `privacy` or `impressum`.
