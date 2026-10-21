// Facts about Sniptide that llms.txt and the JSON-LD both state. Wording follows
// docs/positioning.md in Dino-Kupinic/sniptide; change it there first.
export const siteUrl = "https://sniptide.com"
export const appBase = "https://app.sniptide.com"
export const repoUrl = "https://github.com/Dino-Kupinic/sniptide"
export const imageUrl = "ghcr.io/dino-kupinic/sniptide"

export const siteName = "Sniptide"

// What the browser tab, search results and link previews show for the home page.
export const siteTitle = "Sniptide: the pastebin for modern teams"
export const heroSummary = "Beautiful by default, self-hostable by design, and open to all."

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
  "Sync .env files as encrypted env groups",
  "Self-host with one Docker image and Postgres (AGPL-3.0)",
]

export const logoUrl = `${appBase}/web-app-manifest-512x512.png`
// The 1200 by 630 card from app/opengraph-image.tsx, the same one link previews show.
export const ogImageUrl = `${siteUrl}/opengraph-image`

// Every page that belongs in sitemap.xml, as a path on siteUrl. Add a page here when it ships.
export const sitemapPaths = ["/"]
