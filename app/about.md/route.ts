import { aboutDocument, renderMarkdown } from "@/lib/agent-docs"

export const dynamic = "force-static"
export function GET() {
  return new Response(renderMarkdown(aboutDocument), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
      Link: `<${aboutDocument.canonicalUrl}>; rel="canonical"`,
    },
  })
}
