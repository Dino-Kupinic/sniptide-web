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
`SHARE_PROXY_SECRET`, `CLIENT_IP_HEADER` and `GITHUB_TOKEN` are read at runtime. `GITHUB_TOKEN` is
optional and raises the GitHub rate limit for the changelog, described under
[Changelog](#changelog).

### Search engines and link previews

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
- **Structured data.** See the next section.

A route here shadows a paste link with the same name, because this site answers first and only
unknown paths go to the app. Generated links are eight random characters and custom links start
with `@` (`/@dino/notes`), so a new top-level route (such as `/opengraph-image`) needs no
reservation in the app.

### Legal pages

`/impressum`, `/privacy` and `/terms` are linked from the footer. They are templates, not legal
advice. The operator's name, address, register entries, hosting provider and similar details live
in `lib/legal.ts`; anything in [square brackets] on the live pages is still a placeholder. Whether
the privacy policy says PostHog stores events in the EU or the US follows
`NEXT_PUBLIC_POSTHOG_HOST`, which defaults to EU cloud. These paths are real pages, and custom links
start with `@`, so no new paste link can take `terms`, `privacy` or `impressum`.

### Blog

Posts are MDX files in `content/blog`, and the file name is the address (`content/blog/foo.mdx` is
`/blog/foo`). fumadocs-mdx compiles them when the site builds (`lib/blog-source.ts`), and the
frontmatter schema in `lib/blog.ts` fails the build on a missing field or an author that isn't in
`lib/authors.ts`. Every post has one `category` from `categories` in `lib/blog.ts`. `draft: true`
keeps a post out of production builds, the sitemap and the feeds.

```yaml
---
title: Teach your agent a recipe # at most 70 characters
description: Collections give a coding agent an ordered set of snippets to follow. # 50 to 160
date: 2026-11-20
updated: 2026-11-24 # optional
author: dino # a key in lib/authors.ts
category: agents # product, engineering, agents, self-hosting or company
tags: [collections, mcp] # optional
cover: /blog/agent-recipes/cover-light.webp # the main picture, at the top of the post and the index
coverDark: /blog/agent-recipes/cover-dark.webp # optional
coverAlt: The collection page with three snippets. # describes the cover for screen readers
image: /blog/agent-recipes/share.png # the 1200 by 630 share card
featured: true # optional, pins the post to the top of the index
draft: true # optional
---
```

- **Index.** `/blog` opens with one big featured post: the newest, or the newest with
  `featured: true`, shown with its `cover` picture or its share picture. A faint Game of Life
  (`components/blog/life-background.tsx`) runs behind the title and the featured post, pauses off
  screen and stays still under reduced motion. Below it, a category filter
  and a search over titles, descriptions, tags and post text sit above a grid of cards, each with the
  post's share picture (`image`, or the generated Open Graph card), a category badge, the date, the
  title and the description. The grid shows nine cards and adds nine more as the reader scrolls
  (`components/blog/blog-index.tsx`). The filters live in the URL
  (`/blog?category=engineering&q=mcp`), so a filtered list can be shared.

- **Style.** `docs/blog-style-guide.md` covers choosing a topic, titles, openings, article
  structures, visuals and the next step a post asks for. Read it before drafting.
- **Writing.** Posts use the docs' prose components (`components/blog/prose.tsx`, `tabs.tsx` and
  `code-block.tsx`): `Callout`, `Steps`, `Tabs`, `Params`, `Files`, `Figure` and `Kbd`, plus fenced
  code with a `title`. `Comparison` (`components/blog/comparison.tsx`) wraps a plain Markdown table
  and draws it as a feature-by-product comparison: bold rows become groups, `✓` and `–` cells become
  markers, `~note` marks partial support and `highlight` tints one column. `FeatureGrid` lays out
  bold lines with lists as feature cards, and `InlineCta` places a call to action inside a post. Both stay plain Markdown in the `.md` twin, so agents
  read them. Text sets at 17px on a 27px line (16px on 26px on phones) in a 35rem
  column, about 68 characters to a line (`.blog-prose` in `app/globals.css`). Inter loads its
  optical size axis for the whole site. Table cells grow with their text up to 18rem, and wide tables scroll
  sideways inside their frame, with the first column pinned.
- **Post page.** From 1280px the text sits between two sticky rails. The left one holds an "All
  posts" link, the author and two groups of actions (`components/blog/post-actions.tsx`): sharing
  (copy link, X, LinkedIn) and reading with AI (copy the post's Markdown, open it in ChatGPT or
  Claude, or view the `.md` twin). The right one lists the post's h2 and h3 headings and marks the
  section being read (`components/blog/table-of-contents.tsx`); it shows once a post has two
  headings. On narrower screens the back link sits above the title, the actions become a Share
  menu and a Read with AI menu under the byline, and the contents sit in a disclosure that starts open. A fainter
  copy of the index's Game of Life runs behind the top of the post, and every post ends with the
  landing page's closing call to action above the footer (`BlogShell` with `cta`).
- **Images.** `app/opengraph-image.tsx` and `app/twitter-image.tsx` render the 1200 by 630 card
  with the large white logo in the middle of a black field (`lib/og.tsx`).
  They are generated once at build time, and Next adds the tags to every page.
- **Crawling.** `app/robots.ts` allows everything and links the sitemap, and `app/sitemap.ts` lists
  the paths in `sitemapPaths` (`lib/site.ts`). Add a page's path there when it ships.
- **Structured data.** See the next section.

A route here shadows a paste link with the same name, because this site answers first and only
unknown paths go to the app. Generated links are eight random characters and custom links start
with `@` (`/@dino/notes`), so a new top-level route (such as `/opengraph-image`) needs no
reservation in the app.

### Legal pages

`/impressum`, `/privacy` and `/terms` are linked from the footer. They are templates, not legal
advice. The operator's name, address, register entries, hosting provider and similar details live
in `lib/legal.ts`; anything in [square brackets] on the live pages is still a placeholder. Whether
the privacy policy says PostHog stores events in the EU or the US follows
`NEXT_PUBLIC_POSTHOG_HOST`, which defaults to EU cloud. These paths are real pages, and custom links
start with `@`, so no new paste link can take `terms`, `privacy` or `impressum`.

### Blog

Posts are MDX files in `content/blog`, and the file name is the address (`content/blog/foo.mdx` is
`/blog/foo`). fumadocs-mdx compiles them when the site builds (`lib/blog-source.ts`), and the
frontmatter schema in `lib/blog.ts` fails the build on a missing field or an author that isn't in
`lib/authors.ts`. Every post has one `category` from `categories` in `lib/blog.ts`. `draft: true`
keeps a post out of production builds, the sitemap and the feeds.

```yaml
---
title: Teach your agent a recipe # at most 70 characters
description: Collections give a coding agent an ordered set of snippets to follow. # 50 to 160
date: 2026-11-20
updated: 2026-11-24 # optional
author: dino # a key in lib/authors.ts
category: agents # product, engineering, agents, self-hosting or company
tags: [collections, mcp] # optional
cover: /blog/agent-recipes/cover-light.webp # the main picture, at the top of the post and the index
coverDark: /blog/agent-recipes/cover-dark.webp # optional
coverAlt: The collection page with three snippets. # describes the cover for screen readers
image: /blog/agent-recipes/share.png # the 1200 by 630 share card
featured: true # optional, pins the post to the top of the index
draft: true # optional
---
```

- **Index.** `/blog` opens with one big featured post: the newest, or the newest with
  `featured: true`, shown with its `cover` picture or its share picture. A faint Game of Life
  (`components/blog/life-background.tsx`) runs behind the title and the featured post, pauses off
  screen and stays still under reduced motion. Below it, a category filter
  and a search over titles, descriptions, tags and post text sit above a grid of cards, each with the
  post's share picture (`image`, or the generated Open Graph card), a category badge, the date, the
  title and the description. The grid shows nine cards and adds nine more as the reader scrolls
  (`components/blog/blog-index.tsx`). The filters live in the URL
  (`/blog?category=engineering&q=mcp`), so a filtered list can be shared.

- **Style.** `docs/blog-style-guide.md` covers choosing a topic, titles, openings, article
  structures, visuals and the next step a post asks for. Read it before drafting.
- **Writing.** Posts use the docs' prose components (`components/blog/prose.tsx`, `tabs.tsx` and
  `code-block.tsx`): `Callout`, `Steps`, `Tabs`, `Params`, `Files`, `Figure` and `Kbd`, plus fenced
  code with a `title`. `Comparison` (`components/blog/comparison.tsx`) wraps a plain Markdown table
  and draws it as a feature-by-product comparison: bold rows become groups, `✓` and `–` cells become
  markers, `~note` marks partial support and `highlight` tints one column. `FeatureGrid` lays out
  bold lines with lists as feature cards, and `InlineCta` places a call to action inside a post. Both stay plain Markdown in the `.md` twin, so agents
  read them. Text sets at 17px on a 27px line (16px on 26px on phones) in a 35rem
  column, about 68 characters to a line (`.blog-prose` in `app/globals.css`). Inter loads its
  optical size axis for the whole site. Table cells grow with their text up to 18rem, and wide tables scroll
  sideways inside their frame, with the first column pinned.
- **Post page.** The post's h2 and h3 headings form a table of contents
  (`components/blog/table-of-contents.tsx`) beside the text from 1280px, where it marks the section
  being read, and in a disclosure above the text on narrower screens, which starts open. It shows once a post has two
  headings. The byline holds share buttons for copying the link, X and LinkedIn
  (`components/blog/share.tsx`), and every post ends with the landing page's closing call to
  action above the footer (`BlogShell` with `cta`).
- **Images.** Pictures go in `public/blog/<slug>/`, and author avatars in `public/blog/authors/`.
  Every post needs a `cover`, a `coverAlt` and an `image` (the blog tests check), so the post, the
  index and link previews always show a picture. The cover sits at the top of the post under the
  description. Every picture, from `<Figure src darkSrc>` or a Markdown image, opens a full-screen
  viewer with zoom up to 4x, panning and pinch (`components/blog/zoom-image.tsx`), and shows its
  caption centered below in smaller text. A Markdown image uses its title, or its alt text, as the
  caption.
- **Feeds and previews.** `/blog/rss.xml`, `/blog/atom.xml` and `/blog/feed.json` (JSON Feed 1.1)
  list the latest 20 posts, and the Subscribe menu on the index offers all three. Each post gets an Open Graph
  card with its title (`renderPostOgImage` in `lib/og.tsx`), `BlogPosting` JSON-LD, a sitemap entry
  and a Markdown twin at its address plus `.md`. The newest post also fills the "From the blog" line
  in the Resources menu.

### Changelog

`/changelog` lists every release of the app repo, newest first, read from the GitHub API
(`lib/changelog-source.ts`) and refreshed hourly, so a release appears without a deploy. The list
shows 20 rows and loads 20 more as the reader scrolls. Each release has an anchor such as
`/changelog#v0.77.0`, and a link to an older one loads the page that holds it.

The app repo's release workflow asks Claude to turn the merged pull request into a short post and
writes it to the top of the release body between `<!-- sniptide-notes:start kind="…" -->` and
`<!-- sniptide-notes:end -->`. `kind` is `feature`, `fix` or `internal`. The first heading inside
the markers is the title, and the rest renders as Markdown without raw HTML. To correct a post, edit
the release on GitHub. Releases without the markers fall back to the semantic-release list: the
first feature or fix is the title, and releases with only CI, test or maintenance commits count as
internal. Consecutive internal releases collapse into one row.

The newest feature release from the last 14 days also fills a blue bar above the header on the
landing page and every blog and changelog page (`components/announcement-bar.tsx`). It links to
that release in the changelog and scrolls away with the page. The bar is a pane of blue glass
over the Game of Life, like the window on the pink sharing section; its colors keep white text
above 4.5:1 even over a lit cell. Closing it stores the version in
`localStorage`, and a small inline script hides it before the page paints, so it stays closed until
a newer feature ships. Fixes and maintenance releases never take the bar.

Set `GITHUB_TOKEN` to raise GitHub's rate limit from 60 requests an hour per address. The token
needs no scopes. When GitHub cannot be reached, the page links to the releases on GitHub instead.

### For agents and search engines

`/llms.txt` and `/llms-full.txt` ([llmstxt.org](https://llmstxt.org)) describe Sniptide for AI
agents. Both are built from `lib/llms.ts`, so edit that file; they are real routes here, so the
share-link fallback never proxies them to the app. The home page also carries JSON-LD
(`Organization`, `WebSite`, `SoftwareApplication`) from `lib/structured-data.ts`. Shared product
facts live in `lib/site.ts`.

Documentation lives at https://docs.sniptide.com. Legacy `/docs`, `/docs/mcp`, and
`/docs/auth` paths redirect to the canonical guides. `lib/agent-docs.ts` owns discovery links
and MCP metadata; `/auth.md` is a short authentication index.

`/.well-known/mcp.json` advertises the remote server and links its server card at
`/.well-known/mcp/server-card.json`. The discovery records describe OAuth with a personal bearer token alternative and
link to the canonical guides. The public documentation MCP at `/api/mcp`, A2A agent at
`/api/a2a`, and conversational search at `/ask` return lightweight documentation indexes.
The llms files and robots.txt point to canonical documentation. About and contact pages
remain in the sitemap; redirected documentation pages do not.

`/api/status` reports whether the app's `/api/health` answers, cached for a minute, and the
footer's status line reads it.

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

### Product walkthrough

The product preview loops through the demo dashboard, creating a TypeScript paste, the saved paste,
and account analytics, then returns to the dashboard. Light and dark GIFs live in
`assets/landing/demo-walkthrough-{light,dark}.gif`. They replace the screenshots inside the existing
preview, with the same dimensions, phone cropping, dimming, and centered **Try the demo** link.
The recording follows the theme selected in the footer. The WebP dashboard stills supply the
homepage screenshot metadata.

To refresh the media, record the same flow at 1266 × 793 in each theme using the shared demo's
example data. Use only sample code, discard restored drafts before recording, and remove any
pastes created for the recording afterwards. Until the companion banner removal in
[sniptide#233](https://github.com/Dino-Kupinic/sniptide/pull/233) deploys, hide only the workspace's
`p[role=note]` banner in the recording browser. Export an infinitely looping GIF and a WebP of the
opening dashboard frame for each theme. Keep the dimensions and dashboard caption in
`lib/structured-data.ts` in sync with the stills. Check both themes, the footer theme switch,
the centered demo link, and phone cropping after replacing the files.

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

This website repository is licensed under [AGPL-3.0-only](LICENSE). See the core repository's
[licensing guide](https://github.com/Dino-Kupinic/sniptide/blob/main/LICENSING.md) for the
open-source core and hosted services.

## Browser agent tools

When a browser exposes WebMCP, the site registers two read-only tools with canonical setup guide links and the product MCP endpoint. It prefers `document.modelContext` and falls back to `navigator.modelContext` for older hosts. Unsupported browsers and rejected registrations continue to render the site normally. These tools do not access account data or accept credentials. Registration ends when the site component unmounts; the navigator fallback also supports legacy `unregisterTool` hosts.

## Compatible tool marquee

`components/works-with.tsx` follows the [first dithercn example](https://dithercn.dev/docs/images/logo-marquee):
a looping row with a gradient fill that keeps 60% of its ink at the bottom (the example's default is 30%, which reads pale on white), solid outlines, one-pixel cells,
28-pixel logo height, 64-pixel gaps, 32-pixel-per-second speed and soft edge fades.
The scan effect passes through each logo in turn. Hover or keyboard focus coasts
the row to a stop at its current position; leaving resumes from there. Reduced
motion shows one still, wrapping row without the scan animation.

Official artwork supplies the lettering, and tool names remain accessible link
labels. Logo links open in a new tab with `noopener noreferrer`; accessible labels
announce this behavior. There is no pause button. Keep the local artwork and its sources in
`public/logos` together when changing the list.

Below 640 pixels of row width, logos shrink to 21 pixels tall, gaps halve to 32
pixels, soft fades narrow to 48 pixels, and scroll speed increases by 25% to 40
pixels per second, so about three logos stay in view on a phone. Logo size and
gaps come from container queries, so they apply on first paint before the page
hydrates. A tap that focuses a logo link does not hold the row; only keyboard
focus does. Desktop
uses the reference defaults. OpenAI's export padding is trimmed so its wordmark
has comparable visible height to the other logos.
