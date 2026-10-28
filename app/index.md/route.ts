import { homeDocument, renderMarkdown } from "@/lib/agent-docs"
import { siteUrl } from "@/lib/site"

export const dynamic = "force-static"
export function GET() {
  return new Response(renderMarkdown(homeDocument), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
      Link: `<${siteUrl}${homeDocument.path === "/" ? "" : homeDocument.path}>; rel="canonical"`,
    },
  })
}
