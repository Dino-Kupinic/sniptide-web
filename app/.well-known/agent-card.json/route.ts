import { agentCard } from "@/lib/a2a"

export const dynamic = "force-static"

export function GET() {
  return Response.json(agentCard, { headers: { "Cache-Control": "public, max-age=3600" } })
}
