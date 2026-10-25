import { mcpManifest } from "@/lib/agent-docs"

export const dynamic = "force-static"

export function GET() {
  return Response.json(mcpManifest, {
    headers: { "Cache-Control": "public, max-age=3600" },
  })
}
