import { documentation } from "@/lib/agent-docs"
import { siteUrl } from "@/lib/site"
import { agentSkills } from "@/lib/skills"

export const dynamic = "force-static"

// The focused index for /skills, linked from the root llms.txt like /docs/llms.txt.
export function GET() {
  const text = [
    "# Sniptide agent skills",
    "> Procedures that teach a coding agent to reuse, save and apply Sniptide snippets through the Sniptide MCP server.",
    "Each skill is a SKILL.md file. Install one into your agent's skills folder, and connect the MCP server with a personal API token before using it.",
    "## Skills",
    ...agentSkills.map(({ name, description, url }) => `- [${name}](${url}): ${description}`),
    "## Discovery",
    `- [Skills index](${siteUrl}/.well-known/agent-skills/index.json): every skill with its sha256 digest`,
    `- [MCP setup](${documentation.mcp.url}): connect the server these skills call`,
    "",
  ].join("\n\n")
  return new Response(text, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  })
}
