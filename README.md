# Sniptide website

The marketing site for [Sniptide](https://github.com/Dino-Kupinic/sniptide), served at
sniptide.com. It's a small Next.js 16 app that shares its components and theme with the app through
the [`@sniptide/ui`](https://www.npmjs.com/package/@sniptide/ui) package.

Self-hosted Sniptide instances don't need this repo: the app works on its own.

## Setup

```bash
bun install
cp .env.example .env.local   # points the sign-in and paste links at a local app
bun dev                      # http://localhost:3001
```

## Shared UI

Components (`Button`, `Logo`, `Stripes`, …) and the theme come from `@sniptide/ui`, which lives in
`packages/ui` of the app repo and is published to npm. To use a new component or style change,
release a new version there, then bump it here:

```bash
bun update @sniptide/ui
```

## Deploy

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
`SHARE_PROXY_SECRET` and `CLIENT_IP_HEADER` are read at runtime.

### Search engines and link previews

- **Metadata.** `app/layout.tsx` sets the base URL, the title template, the description and the
  Open Graph and Twitter tags that every page inherits. A page sets its own `title`, `description`
  and `alternates.canonical` in its `metadata` export, and its link previews reuse them. `/home`
  repeats `/`, so its canonical link points at `/`.
- **Images.** `app/opengraph-image.tsx` and `app/twitter-image.tsx` render the 1200 by 630 card
  with the logo, the headline and a pink pixel sun on the Tide blue (`lib/og.tsx`, with the pixel
  art in `lib/og-sun.ts` and the font in `assets/fonts`).
  They are generated once at build time, and Next adds the tags to every page.
- **Crawling.** `app/robots.ts` allows everything and links the sitemap, and `app/sitemap.ts` lists
  the paths in `sitemapPaths` (`lib/site.ts`). Add a page's path there when it ships.
- **Structured data.** See the next section.

A route here shadows a paste link with the same name, because this site answers first and only
unknown paths go to the app. When you add a route whose name could be a paste link (such as
`/opengraph-image`), add it to `RESERVED` in `apps/web/lib/pastes/store.ts` in the app repo too.

### Legal pages

`/impressum`, `/privacy` and `/terms` are linked from the footer. They are templates, not legal
advice. The operator's name, address, register entries, hosting provider and similar details live
in `lib/legal.ts`; anything in [square brackets] on the live pages is still a placeholder. Whether
the privacy policy says PostHog stores events in the EU or the US follows
`NEXT_PUBLIC_POSTHOG_HOST`, which defaults to EU cloud. These paths are real pages, so a paste with the custom link `terms`,
`privacy` or `impressum` is shadowed here; the app should reserve them.

### For agents and search engines

`/llms.txt` and `/llms-full.txt` ([llmstxt.org](https://llmstxt.org)) describe Sniptide for AI
agents. Both are built from `lib/llms.ts`, so edit that file; they are real routes here, so the
share-link fallback never proxies them to the app. The home page also carries JSON-LD
(`Organization`, `WebSite`, `SoftwareApplication`) from `lib/structured-data.ts`. Wording comes from
`docs/positioning.md` in the app repo: change claims there first, then here.

`/docs` links the agent setup guides and API reference. `/docs/mcp` describes the remote MCP
endpoint, and `/docs/auth` shares its content with `/auth.md`. The document model, tool list,
client configuration, and discovery metadata live in `lib/agent-docs.ts`. Verify tool names and
scopes against `packages/mcp/src/server.ts` in the app repo when they change.

`/.well-known/mcp.json` advertises the remote server and links its server card at
`/.well-known/mcp/server-card.json`. Authentication uses personal bearer tokens. Agent OAuth is
not supported. The docs, manifest, and auth guide are linked from the llms files and robots.txt;
the docs pages also appear in the sitemap.

The server card follows the [experimental MCP Server Card schema](https://github.com/modelcontextprotocol/ext-server-card).
Its required `$schema` URL currently returns 404, so validate against that repository's generated
`schema.json`, using `$defs.ServerCard`. The extension may change before it becomes part of MCP.

With a local server running on port 3193, check the rendered routes and discovery chain:

```bash
bun run check:agents
```

After deployment, run `bun run check:agents https://sniptide.com` before requesting a fresh Ora
scan. The script checks response bodies, content types, canonical URLs, and local cross-links.

### Analytics

Set `NEXT_PUBLIC_POSTHOG_KEY` (and `NEXT_PUBLIC_POSTHOG_HOST`, which defaults to EU cloud) as build variables to
send pageviews and button clicks to PostHog. It runs cookieless, so there is no consent banner,
which needs **Cookieless server hash mode** turned on in the PostHog project settings. Requests go
through `/_site/ph` on this site so ad blockers don't drop them. The app reports to the same
project; filter on the `surface` property (`marketing` or `app`). Without a key nothing loads.

Analytics stores no visitor identifiers on the device and sets no cookies. An optional exclusion
preference uses local storage only after an explicit request. See the privacy policy for how
analytics data is processed. Re-check the policy before adding another tracker, session replay,
or an `identify()` call.

To exclude your own browser, open `/_site/analytics` and select **Exclude this browser**. Use the
link there to repeat the choice for the app, and repeat in each browser you use. The choice
survives reloads and network changes. **Include this browser** removes the exclusion flag.
Clearing site data also removes it. Reload other open tabs after a change. The preference page
always skips analytics. This does not remove past events or change paste view counts.

Button and link clicks are also sent as `cta_clicked` with `location` (the section: `header`, `hero`,
`features`, `analytics`, `raw-links`, `cta` or `footer`, set with `data-cta-location`) and `target`
(`sign_up`, `sign_in`, `new_paste`, `dashboard`, `import_gist` or `anchor`). Funnels should use this
event rather than autocapture selectors.

## Checks

```bash
bunx biome ci .
bun run typecheck
bun run test
bun run build
```

## Contributing

Commits and PR titles follow [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`,
`fix:`, `docs:`, …), enforced by a git hook and a CI check. See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

[AGPL-3.0](LICENSE), like Sniptide itself.

## Browser agent tools

When a browser exposes WebMCP, the site registers two read-only tools with public setup guides and the MCP tool list. It prefers `document.modelContext` and falls back to `navigator.modelContext` for older hosts. Unsupported browsers and rejected registrations continue to render the site normally. These tools do not access account data or accept credentials. Registration ends when the site component unmounts; the navigator fallback also supports legacy `unregisterTool` hosts.
