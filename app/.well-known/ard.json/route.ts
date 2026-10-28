import { appBase, siteUrl } from "@/lib/site"
import { agentSkills } from "@/lib/skills"

export function GET() {
  return Response.json({
    entries: [
      {
        identifier: "urn:air:sniptide.com:server:snippets",
        displayName: "Sniptide snippet MCP server",
        type: "application/mcp-server-card+json",
        url: `${siteUrl}/.well-known/mcp/server-card.json`,
        representativeQueries: ["Find a reusable code snippet", "Read my snippet collection"],
      },
      {
        identifier: "urn:air:sniptide.com:server:documentation",
        displayName: "Sniptide documentation MCP server",
        type: "application/mcp-server-card+json",
        url: `${siteUrl}/.well-known/mcp/docs-server-card.json`,
        representativeQueries: [
          "How do I authenticate with Sniptide?",
          "How do I connect the Sniptide MCP server?",
        ],
      },
      {
        identifier: "urn:air:sniptide.com:api:token-api",
        displayName: "Sniptide REST API",
        type: "application/vnd.oai.openapi+json",
        url: `${appBase}/api/openapi.json`,
        representativeQueries: [
          "Integrate Sniptide with my application",
          "Create a snippet with the HTTP API",
        ],
      },
      ...agentSkills.map((skill) => ({
        identifier: `urn:air:sniptide.com:skill:${skill.name}`,
        displayName: skill.name,
        description: skill.description,
        type: "application/agent-skills+md",
        url: skill.url,
        representativeQueries: [skill.description, `Use the Sniptide ${skill.name} workflow`],
      })),
    ],
  })
}
