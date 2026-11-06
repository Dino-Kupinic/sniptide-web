import { z } from "zod"
import { type Author, authorKeys, authors } from "@/lib/authors"
import { siteName, siteUrl } from "@/lib/site"

// The categories the index filters by. Every post has exactly one; tags stay finer-grained.
export const categories = {
  product: "Product",
  engineering: "Engineering",
  agents: "Agents",
  "self-hosting": "Self-hosting",
  company: "Company",
} as const

export type Category = keyof typeof categories

const categoryKeys = Object.keys(categories) as [Category, ...Category[]]

// Frontmatter of a post in content/blog. The file name (without .mdx) is the slug.
export const postSchema = z.object({
  title: z.string().min(1).max(70),
  // One sentence. It is the search snippet, the feed summary and the line on the index.
  description: z.string().min(50).max(160),
  date: z.iso.date(),
  updated: z.iso.date().optional(),
  author: z.enum(authorKeys),
  category: z.enum(categoryKeys),
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
export const atomPath = "/blog/atom.xml"
export const jsonFeedPath = "/blog/feed.json"

// The feeds the index offers, in the order its subscribe menu lists them.
export const feeds = [
  { label: "RSS", path: feedPath, type: "application/rss+xml" },
  { label: "Atom", path: atomPath, type: "application/atom+xml" },
  { label: "JSON Feed", path: jsonFeedPath, type: "application/feed+json" },
] as const

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
        `      <category>${escapeXml(categories[post.category])}</category>`,
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

function feedUpdated(posts: PostMeta[]) {
  const latest = posts[0]
  return new Date(`${latest ? (latest.updated ?? latest.date) : "2026-11-06"}T00:00:00Z`)
}

// Atom 1.0 with the same 20 posts as the RSS feed.
export function renderAtomFeed(posts: PostMeta[]) {
  const latest = sortPosts(posts).slice(0, 20)
  const entries = latest
    .map((post) => {
      const url = `${siteUrl}${postPath(post.slug)}`
      return [
        "  <entry>",
        `    <title>${escapeXml(post.title)}</title>`,
        `    <link href="${url}"/>`,
        `    <id>${url}</id>`,
        `    <published>${post.date}T00:00:00Z</published>`,
        `    <updated>${post.updated ?? post.date}T00:00:00Z</updated>`,
        `    <summary>${escapeXml(post.description)}</summary>`,
        `    <author><name>${escapeXml(postAuthor(post).name)}</name></author>`,
        `    <category term="${post.category}" label="${escapeXml(categories[post.category])}"/>`,
        "  </entry>",
      ].join("\n")
    })
    .join("\n")

  return `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${escapeXml(`${siteName} blog`)}</title>
  <subtitle>Product news and notes on building Sniptide.</subtitle>
  <link href="${siteUrl}${blogPath}"/>
  <link rel="self" href="${siteUrl}${atomPath}"/>
  <id>${siteUrl}${blogPath}</id>
  <updated>${feedUpdated(latest).toISOString()}</updated>
${entries}
</feed>
`
}

// JSON Feed 1.1 (jsonfeed.org) with the same 20 posts.
export function renderJsonFeed(posts: PostMeta[]) {
  const latest = sortPosts(posts).slice(0, 20)
  return {
    version: "https://jsonfeed.org/version/1.1",
    title: `${siteName} blog`,
    home_page_url: `${siteUrl}${blogPath}`,
    feed_url: `${siteUrl}${jsonFeedPath}`,
    description: "Product news and notes on building Sniptide.",
    language: "en",
    items: latest.map((post) => ({
      id: `${siteUrl}${postPath(post.slug)}`,
      url: `${siteUrl}${postPath(post.slug)}`,
      title: post.title,
      summary: post.description,
      content_text: post.description,
      date_published: `${post.date}T00:00:00Z`,
      date_modified: `${post.updated ?? post.date}T00:00:00Z`,
      authors: [{ name: postAuthor(post).name, url: postAuthor(post).url }],
      tags: [categories[post.category], ...post.tags],
    })),
  }
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
    articleSection: categories[post.category],
    keywords: post.tags,
    inLanguage: "en",
    author: { "@type": "Person", name: author.name, url: author.url },
    publisher: { "@id": `${siteUrl}/#organization` },
    isPartOf: { "@type": "Blog", "@id": `${siteUrl}${blogPath}#blog`, name: `${siteName} blog` },
  }
}
