import { authDocument, renderMarkdown } from "@/lib/agent-docs"

export const dynamic = "force-static"
export function GET() {
  return new Response(renderMarkdown(authDocument), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
      Link: `<${authDocument.canonicalUrl}>; rel="canonical"`,
    },
  })
}
