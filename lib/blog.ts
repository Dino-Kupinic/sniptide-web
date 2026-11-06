import { z } from "zod"
import { type Author, authorKeys, authors } from "@/lib/authors"
import { siteName, siteUrl } from "@/lib/site"

// Frontmatter of a post in content/blog. The file name (without .mdx) is the slug.
export const postSchema = z.object({
  title: z.string().min(1).max(70),
  // One sentence. It is the search snippet, the feed summary and the line on the index.
  description: z.string().min(50).max(160),
  date: z.iso.date(),
  updated: z.iso.date().optional(),
  author: z.enum(authorKeys),
  tags: z.array(z.string().regex(/^[a-z0-9-]+$/)).default([]),
  // A replacement for the generated Open Graph card, as a path under public/.
  image: z.string().startsWith("/").optional(),
  // Drafts render in development and are left out of production builds, the sitemap and the feed.
  draft: z.boolean().default(false),
})

export type PostFrontmatter = z.infer<typeof postSchema>

export type PostMeta = PostFrontmatter & { slug: string }

export const blogPath = "/blog"
export const feedPath = "/blog/rss.xml"

export function postPath(slug: string) {
  return `${blogPath}/${slug}`
}

export function postMarkdownPath(slug: string) {
  return `${postPath(slug)}.md`
}

export function postAuthor(post: Pick<PostMeta, "author">): Author {
  return authors[post.author]
}

// A post's slug from its file path in the collection (welcome.mdx is "welcome").
export function slugFromPath(path: string) {
  return path.replace(/^.*\//, "").replace(/\.mdx?$/, "")
}

// Newest first; posts from the same day keep a stable order by slug.
export function sortPosts<T extends PostMeta>(posts: T[]): T[] {
  return [...posts].sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug))
}

export function publishedPosts<T extends PostMeta>(
  posts: T[],
  includeDrafts = process.env.NODE_ENV === "development",
): T[] {
  return sortPosts(includeDrafts ? posts : posts.filter((post) => !post.draft))
}

// Minutes at 230 words a minute, rounded up, from the post's Markdown.
export function readingMinutes(markdown: string) {
  const words = markdown
    .replace(/```[\s\S]*?```/g, " ")
    .split(/\s+/)
    .filter(Boolean).length
  return Math.max(1, Math.ceil(words / 230))
}

// Dates are calendar days with no time zone, so they format in UTC to keep the day.
export function formatPostDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`))
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
}

// RSS 2.0 with the latest 20 posts. Each item carries the summary; the full post is one click away
// and its Markdown is linked for readers that prefer it.
export function renderFeed(posts: PostMeta[]) {
  const latest = sortPosts(posts).slice(0, 20)
  const updated = latest[0] ? new Date(`${latest[0].updated ?? latest[0].date}T00:00:00Z`) : null
  const items = latest
    .map((post) => {
      const url = `${siteUrl}${postPath(post.slug)}`
      return [
        "    <item>",
        `      <title>${escapeXml(post.title)}</title>`,
        `      <link>${url}</link>`,
        `      <guid isPermaLink="true">${url}</guid>`,
        `      <description>${escapeXml(post.description)}</description>`,
        `      <pubDate>${new Date(`${post.date}T00:00:00Z`).toUTCString()}</pubDate>`,
        `      <dc:creator>${escapeXml(postAuthor(post).name)}</dc:creator>`,
        ...post.tags.map((tag) => `      <category>${escapeXml(tag)}</category>`),
        "    </item>",
      ].join("\n")
    })
    .join("\n")

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${escapeXml(`${siteName} blog`)}</title>
    <link>${siteUrl}${blogPath}</link>
    <description>Product news and notes on building Sniptide.</description>
    <language>en</language>
    <atom:link href="${siteUrl}${feedPath}" rel="self" type="application/rss+xml"/>${
      updated ? `\n    <lastBuildDate>${updated.toUTCString()}</lastBuildDate>` : ""
    }
${items}
  </channel>
</rss>
`
}

// BlogPosting JSON-LD for a post page, tied to the organization graph on the home page.
export function postStructuredData(post: PostMeta) {
  const url = `${siteUrl}${postPath(post.slug)}`
  const author = postAuthor(post)
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    headline: post.title,
    description: post.description,
    url,
    mainEntityOfPage: url,
    datePublished: post.date,
    dateModified: post.updated ?? post.date,
    image: `${siteUrl}${post.image ?? `${postPath(post.slug)}/opengraph-image`}`,
    keywords: post.tags,
    inLanguage: "en",
    author: { "@type": "Person", name: author.name, url: author.url },
    publisher: { "@id": `${siteUrl}/#organization` },
    isPartOf: { "@type": "Blog", "@id": `${siteUrl}${blogPath}#blog`, name: `${siteName} blog` },
  }
}
