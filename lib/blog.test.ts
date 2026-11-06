import { describe, expect, test } from "bun:test"
import { readdirSync } from "node:fs"
import { join } from "node:path"
import sitemap from "@/app/sitemap"
import { matchesQuery } from "@/components/blog/blog-index"
import {
  type PostMeta,
  postSchema,
  postStructuredData,
  publishedPosts,
  readingMinutes,
  renderAtomFeed,
  renderFeed,
  renderJsonFeed,
  slugFromPath,
} from "@/lib/blog"
import { getPosts } from "@/lib/blog-source"
import { resolveNavMenus, sectionHref } from "@/lib/nav"
import { siteUrl } from "@/lib/site"

const post = (overrides: Partial<PostMeta> = {}): PostMeta => ({
  slug: "first",
  title: "First post",
  description: "A description long enough to pass the fifty character minimum of the schema.",
  date: "2026-11-01",
  author: "dino",
  category: "product",
  tags: ["product"],
  draft: false,
  ...overrides,
})

describe("blog posts", () => {
  test("every file in content/blog is a post with a kebab-case slug", () => {
    const files = readdirSync(join(import.meta.dir, "..", "content", "blog"))
    expect(files.length).toBeGreaterThan(0)
    for (const file of files) expect(file).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*\.mdx$/)
    // /blog/md serves the Markdown twins, so no post can take that slug.
    expect(files).not.toContain("md.mdx")
    expect(getPosts().map((entry) => entry.slug)).toEqual(
      expect.arrayContaining(files.map((file) => slugFromPath(file))),
    )
  })

  test("the schema rejects an unknown author and a short description", () => {
    expect(postSchema.safeParse({ ...post(), author: "nobody" }).success).toBe(false)
    expect(postSchema.safeParse({ ...post(), description: "Too short." }).success).toBe(false)
    expect(postSchema.safeParse(post()).success).toBe(true)
  })

  test("drafts are left out unless asked for, and posts sort newest first", () => {
    const posts = [
      post({ slug: "old", date: "2026-01-01" }),
      post({ slug: "new", date: "2026-11-01" }),
      post({ slug: "draft", date: "2026-12-01", draft: true }),
    ]
    expect(publishedPosts(posts, false).map((p) => p.slug)).toEqual(["new", "old"])
    expect(publishedPosts(posts, true).map((p) => p.slug)).toEqual(["draft", "new", "old"])
  })

  test("reading time ignores code and never drops below a minute", () => {
    expect(readingMinutes("word ".repeat(460))).toBe(2)
    expect(readingMinutes(`hi\n\`\`\`ts\n${"code ".repeat(1000)}\n\`\`\``)).toBe(1)
  })

  test("the sitemap lists every published post", () => {
    const urls = sitemap().map((entry) => entry.url)
    for (const entry of getPosts()) expect(urls).toContain(`${siteUrl}/blog/${entry.slug}`)
  })
})

describe("feed and structured data", () => {
  test("the feed escapes text and links each post", () => {
    const xml = renderFeed([post({ title: "Pipes & <tags>" })])
    expect(xml).toContain("<title>Pipes &amp; &lt;tags&gt;</title>")
    expect(xml).toContain(`<guid isPermaLink="true">${siteUrl}/blog/first</guid>`)
    expect(xml).toContain("<dc:creator>Dino Kupinic</dc:creator>")
  })

  test("a post's JSON-LD names its author, dates and card", () => {
    const data = postStructuredData(post({ updated: "2026-11-03" }))
    expect(data).toMatchObject({
      "@type": "BlogPosting",
      datePublished: "2026-11-01",
      dateModified: "2026-11-03",
      image: `${siteUrl}/blog/first/opengraph-image`,
      author: { name: "Dino Kupinic" },
    })
  })
})

describe("index search", () => {
  const indexed = { ...post({ tags: ["mcp"] }), searchText: "Collections act as recipes." }

  test("every word has to match the title, description, tags or text", () => {
    expect(matchesQuery(indexed, "")).toBe(true)
    expect(matchesQuery(indexed, "FIRST recipes")).toBe(true)
    expect(matchesQuery(indexed, "mcp")).toBe(true)
    expect(matchesQuery(indexed, "first gist")).toBe(false)
  })
})

describe("other feeds", () => {
  test("Atom and JSON Feed list the same posts with their category", () => {
    const posts = [post({ title: "A & B" })]
    const atom = renderAtomFeed(posts)
    expect(atom).toContain("<title>A &amp; B</title>")
    expect(atom).toContain('<category term="product" label="Product"/>')
    const json = renderJsonFeed(posts)
    expect(json.version).toBe("https://jsonfeed.org/version/1.1")
    expect(json.items[0]).toMatchObject({
      id: `${siteUrl}/blog/first`,
      tags: ["Product", "product"],
    })
  })
})

describe("navigation on blog pages", () => {
  test("section links point back at the landing page off it", () => {
    expect(sectionHref("#recipes", "/home")).toBe("/home#recipes")
    expect(sectionHref("#recipes", "")).toBe("#recipes")
    expect(sectionHref("/blog", "/home")).toBe("/blog")
  })

  test("the blog strip shows the newest post when there is one", () => {
    const latest = { title: "Newest", href: "/blog/newest" }
    const strip = resolveNavMenus({ latestPost: latest }).find(
      (menu) => menu.strip.kind === "link",
    )?.strip
    expect(strip).toMatchObject({ kind: "link", title: "Newest", href: "/blog/newest" })
    expect(strip && "note" in strip ? strip.note : undefined).toBeUndefined()
  })
})
