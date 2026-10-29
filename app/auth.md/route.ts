import { authDocument, authMarkdown } from "@/lib/agent-docs"

export const dynamic = "force-static"
export function GET() {
  return new Response(authMarkdown, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
      Link: `<${authDocument.canonicalUrl}>; rel="canonical"`,
    },
  })
}
