import { mcpServerCard } from "@/lib/agent-docs"

export const dynamic = "force-static"

export function GET() {
  return Response.json(mcpServerCard, {
    headers: { "Cache-Control": "public, max-age=3600" },
  })
}
