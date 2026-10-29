import { agentCard } from "@/lib/a2a"
import { operator } from "@/lib/legal"
import { appBase, repoUrl, siteName, siteUrl } from "@/lib/site"
import { agentSkills } from "@/lib/skills"

// Who publishes every entry. The domain matches the sniptide.com segment of each identifier, and
// the operator and source repository are the ones the Impressum and About page name. No
// attestation or signature is claimed, because none has been issued.
const trustManifest = {
  identity: {
    domain: "sniptide.com",
    publisher: siteName,
    operator: operator.name,
    url: siteUrl,
    contact: operator.email,
    sourceRepository: repoUrl,
  },
}

export function GET() {
  const entries = [
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
    {
      identifier: "urn:air:sniptide.com:agent:documentation",
      displayName: agentCard.name,
      description: agentCard.description,
      type: "application/a2a-agent-card+json",
      url: `${siteUrl}/.well-known/agent-card.json`,
      representativeQueries: agentCard.skills.flatMap((skill) => skill.examples),
    },
    ...agentSkills.map((skill) => ({
      identifier: `urn:air:sniptide.com:skill:${skill.name}`,
      displayName: skill.name,
      description: skill.description,
      type: "application/agent-skills+md",
      url: skill.url,
      digest: skill.digest,
      representativeQueries: [skill.description, `Use the Sniptide ${skill.name} workflow`],
    })),
  ]
  return Response.json({ entries: entries.map((entry) => ({ ...entry, trustManifest })) })
}
