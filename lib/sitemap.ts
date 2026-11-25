import type { MetadataRoute } from "next"
import { siteUrl } from "./site"

// When each page in sitemapPaths last changed in a way a reader would notice, as YYYY-MM-DD. Bump a
// date when its page's text or layout changes. /blog, /templates, /changelog and /compare are left
// out, because their dates come from their posts, templates, releases and comparison facts. The seo tests check that every
// other path has a date here.
export const pageUpdated: Record<string, string> = {
  "/": "2026-11-24",
  "/about": "2026-10-28",
  "/acceptable-use": "2026-11-24",
  "/brand": "2026-11-05",
  "/contact": "2026-10-28",
  "/impressum": "2026-11-15",
  "/pricing": "2026-11-25",
  "/privacy": "2026-11-15",
  "/terms": "2026-11-24",
  "/vision": "2026-11-24",
}

type SitemapDates = {
  // The newest post's date or update, the newest template's update and the newest release.
  blog?: string
  templates?: string
  changelog?: string
  // The newest check date behind the comparison pages.
  compare?: string
}

// Every page with the date it last changed. Only /changelog can go without one, while GitHub
// can't be reached: the sitemap is rebuilt hourly, and a guessed date would be worse than none.
export function pageEntries(paths: string[], dates: SitemapDates): MetadataRoute.Sitemap {
  const known: Record<string, string | undefined> = {
    ...pageUpdated,
    "/blog": dates.blog,
    "/templates": dates.templates,
    "/changelog": dates.changelog,
    "/compare": dates.compare,
  }
  return paths.map((path) => ({
    url: path === "/" ? siteUrl : `${siteUrl}${path}`,
    lastModified: known[path],
  }))
}
