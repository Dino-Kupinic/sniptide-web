import { agentSkillsIndex } from "@/lib/skills"

export const dynamic = "force-static"

export function GET() {
  return Response.json(agentSkillsIndex, {
    headers: { "Cache-Control": "public, max-age=3600" },
  })
}
