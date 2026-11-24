import type { MetadataRoute } from "next"
import { postPath } from "@/lib/blog"
import { getPosts } from "@/lib/blog-source"
import { getChangelog } from "@/lib/changelog-source"
import { comparePagePath, comparePages, comparison } from "@/lib/compare"
import { sitemapPaths, siteUrl } from "@/lib/site"
import { pageEntries } from "@/lib/sitemap"
import { getTemplates } from "@/lib/template-source"
import { templatePath } from "@/lib/templates"

// Rebuilt hourly, like the changelog, so /changelog's date follows the newest release.
export const revalidate = 3600

// The home page is listed without a trailing slash, matching its canonical link.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = getPosts()
  const templates = getTemplates()
  // A comparison page changes when one of its facts is checked again.
  const compareEntries = comparePages.map((page) => ({
    url: `${siteUrl}${comparePagePath(page.slug)}`,
    lastModified: comparison(page).newest,
  }))
  const releases = await getChangelog()
  const pages = pageEntries(sitemapPaths, {
    blog: posts
      .map((post) => post.updated ?? post.date)
      .sort()
      .at(-1),
    // The directory changes whenever one of its templates does.
    templates: templates
      .map((template) => template.updated)
      .sort()
      .at(-1),
    // Releases are sorted newest first. Null when GitHub can't be reached.
    changelog: releases?.[0]?.date,
    compare: compareEntries
      .map((entry) => entry.lastModified)
      .sort()
      .at(-1),
  })
  // Posts and templates follow the pages, each dated by its last update.
  const postEntries = posts.map((post) => ({
    url: `${siteUrl}${postPath(post.slug)}`,
    lastModified: post.updated ?? post.date,
  }))
  const templateEntries = templates.map((template) => ({
    url: `${siteUrl}${templatePath(template.name)}`,
    lastModified: template.updated,
  }))
  return [...pages, ...compareEntries, ...postEntries, ...templateEntries]
}
