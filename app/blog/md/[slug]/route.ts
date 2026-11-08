import { formatPostDate, postAuthor, postPath, stripMdxComments } from "@/lib/blog"
import { getPost, getPosts } from "@/lib/blog-source"
import { siteUrl } from "@/lib/site"

// A post as Markdown at /blog/<slug>.md (rewritten here in next.config.ts), like the .md twins of
// the other pages, for agents and readers that prefer plain text.
export const dynamic = "force-static"
export const dynamicParams = false

export function generateStaticParams() {
  return getPosts().map((post) => ({ slug: post.slug }))
}

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const post = getPost((await params).slug)
  if (!post) return new Response("Not found", { status: 404 })
  const canonical = `${siteUrl}${postPath(post.slug)}`
  const body = stripMdxComments(await post.entry.getText("processed"))
  const markdown = `# ${post.title}\n\n> ${post.description}\n\nBy ${postAuthor(post).name}, ${formatPostDate(post.date)}. Canonical: ${canonical}\n\n${body.trim()}\n`
  return new Response(markdown, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
      Link: `<${canonical}>; rel="canonical"`,
    },
  })
}
