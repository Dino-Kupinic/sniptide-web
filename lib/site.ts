// Facts about Sniptide that llms.txt and the JSON-LD both state.
export const siteUrl = "https://sniptide.com"
export const appBase = "https://app.sniptide.com"
export const repoUrl = "https://github.com/Dino-Kupinic/sniptide"
export const xUrl = "https://x.com/sniptide"
export const imageUrl = "ghcr.io/dino-kupinic/sniptide"

export const siteName = "Sniptide"

// The hero's headline and the line under it. The browser tab, search results and link previews for
// the home page say the same thing, so they read them from here.
export const heroTitle = "The pastebin for your agents."
export const heroSummary =
  "Let your coding agents search, read and save snippets. Open source and self-hostable."
export const siteTitle = "Sniptide: the pastebin for your agents"

export const siteTagline =
  "The self-hostable pastebin for snippets, configs and secrets, and a library of clean patterns your coding agents can reuse."

export const siteDescription =
  "Paste and share code, sync .env files and give your coding agents a library of clean patterns. Open source and self-hostable."

export const features = [
  "Paste code or a whole folder and share it with a short link",
  "Private, unlisted or public pastes",
  "Password, expiry and burn-after-read links",
  "Every paste shows how often it was opened",
  "Editor warns when you paste something that looks like a key",
  "MCP server and CLI so coding agents can search, read and save snippets",
  "Agents connect over MCP with an OAuth sign-in or a personal token",
  "Collections that agents and the CLI follow as ordered recipes",
  "Invite people to a private paste with view or edit access",
  "Sync .env files as encrypted env groups",
  "Self-host with one Docker image and a database (AGPL-3.0)",
]

export const logoUrl = `${appBase}/web-app-manifest-512x512.png`
// The 1200 by 630 card from app/opengraph-image.tsx, the same one link previews show.
export const ogImageUrl = `${siteUrl}/opengraph-image`

// Every page that belongs in sitemap.xml, as a path on siteUrl. Add a page here when it ships.
export const sitemapPaths = [
  "/",
  "/about",
  "/blog",
  "/brand",
  "/contact",
  "/privacy",
  "/terms",
  "/impressum",
  "/vision",
]
