import type { MetadataRoute } from "next"
import { postPath } from "@/lib/blog"
import { getPosts } from "@/lib/blog-source"
import { sitemapPaths, siteUrl } from "@/lib/site"

// The home page is listed without a trailing slash, matching its canonical link.
export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getPosts()
  const pages = sitemapPaths.map((path) => ({
    url: path === "/" ? siteUrl : `${siteUrl}${path}`,
    lastModified:
      path === "/blog"
        ? (posts[0]?.date ?? "2026-11-06")
        : path === "/brand" || path === "/vision"
          ? "2026-11-05"
          : path === "/about" || path === "/contact" || path.startsWith("/docs")
            ? "2026-10-28"
            : path === "/privacy"
              ? "2026-10-25"
              : "2026-10-23",
  }))
  // Posts follow their index, each dated by its last update.
  const postEntries = posts.map((post) => ({
    url: `${siteUrl}${postPath(post.slug)}`,
    lastModified: post.updated ?? post.date,
  }))
  return [...pages, ...postEntries]
}
