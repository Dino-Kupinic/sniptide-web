import type { MetadataRoute } from "next"
import { comparisonPath, comparisons } from "@/lib/comparisons"
import { sitemapPaths, siteUrl } from "@/lib/site"

// The home page is listed without a trailing slash, matching its canonical link.
export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [...sitemapPaths, ...comparisons.map(({ slug }) => comparisonPath(slug))]
  return paths.map((path) => ({ url: path === "/" ? siteUrl : `${siteUrl}${path}` }))
}
