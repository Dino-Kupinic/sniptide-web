import { comparePage, comparePagePath, comparePages, renderCompareMarkdown } from "@/lib/compare"
import { siteUrl } from "@/lib/site"

// A comparison page as Markdown at /compare/<slug>.md (rewritten here in next.config.ts), like a
// blog post's twin, for agents and readers that prefer plain text.
export const dynamic = "force-static"
export const dynamicParams = false

export function generateStaticParams() {
  return comparePages.map((page) => ({ slug: page.slug }))
}

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const page = comparePage((await params).slug)
  if (!page) return new Response("Not found", { status: 404 })
  return new Response(renderCompareMarkdown(page), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
      Link: `<${siteUrl}${comparePagePath(page.slug)}>; rel="canonical"`,
    },
  })
}
