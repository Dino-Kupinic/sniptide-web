import { agentSkills } from "@/lib/skills"

export function GET() {
  return Response.json({ skills: agentSkills })
}
