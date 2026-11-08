import type { MetadataRoute } from "next"
import { postPath } from "@/lib/blog"
import { getPosts } from "@/lib/blog-source"
import { sitemapPaths, siteUrl } from "@/lib/site"
import { getTemplates } from "@/lib/template-source"
import { templatePath } from "@/lib/templates"

// The home page is listed without a trailing slash, matching its canonical link.
export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getPosts()
  const templates = getTemplates()
  // The directory changes whenever one of its templates does.
  const templatesUpdated = templates
    .map((template) => template.updated)
    .sort()
    .at(-1)
  const pages = sitemapPaths.map((path) => ({
    url: path === "/" ? siteUrl : `${siteUrl}${path}`,
    lastModified:
      path === "/blog"
        ? (posts[0]?.date ?? "2026-11-06")
        : path === "/templates"
          ? (templatesUpdated ?? "2026-11-08")
          : // The changelog changes with every release, which the sitemap cannot know in advance.
            path === "/changelog"
            ? undefined
            : path === "/brand" || path === "/vision"
              ? "2026-11-05"
              : path === "/about" || path === "/contact" || path.startsWith("/docs")
                ? "2026-10-28"
                : path === "/privacy"
                  ? "2026-10-25"
                  : "2026-10-23",
  }))
  // Posts and templates follow the pages, each dated by its last update.
  const postEntries = posts.map((post) => ({
    url: `${siteUrl}${postPath(post.slug)}`,
    lastModified: post.updated ?? post.date,
  }))
  const templateEntries = templates.map((template) => ({
    url: `${siteUrl}${templatePath(template.name)}`,
    lastModified: template.updated,
  }))
  return [...pages, ...postEntries, ...templateEntries]
}
