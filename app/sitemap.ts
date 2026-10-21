import type { MetadataRoute } from "next"
import { sitemapPaths, siteUrl } from "@/lib/site"

// The home page is listed without a trailing slash, matching its canonical link.
export default function sitemap(): MetadataRoute.Sitemap {
  return sitemapPaths.map((path) => ({ url: path === "/" ? siteUrl : `${siteUrl}${path}` }))
}
