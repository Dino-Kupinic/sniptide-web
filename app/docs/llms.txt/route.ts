import { authDocument, docsDocument, documentation, mcpDocument } from "@/lib/agent-docs"
import { appBase, siteUrl } from "@/lib/site"

export function GET() {
  const text = [
    "# Sniptide developer documentation",
    "> Canonical guides for connecting coding agents to Sniptide.",
    "## Guides",
    ...[docsDocument, authDocument, mcpDocument].map(
      (doc) => `- [${doc.title}](${doc.canonicalUrl}): ${doc.description}`,
    ),
    ...[documentation.apiTokens, documentation.cli, documentation.selfHosting].map(
      ({ title, url }) => `- [${title}](${url})`,
    ),
    `- [Authentication index](${siteUrl}/auth.md): Canonical authentication guide links.`,
    `- [OpenAPI specification](${appBase}/api/openapi.json): REST endpoints and required scopes.`,
    `- [Public documentation MCP](${siteUrl}/api/mcp): Search and read these public guides.`,
    `- [A2A agent card](${siteUrl}/.well-known/agent-card.json): Documentation search agent.`,
    `- [Conversational search](${siteUrl}/ask): Search documentation indexes.`,
    `- [API catalog](${siteUrl}/.well-known/api-catalog): Instance API discovery.`,
    `- [Agent skills](${siteUrl}/.well-known/agent-skills/index.json): Reusable procedures.`,
    "",
  ].join("\n\n")
  return new Response(text, { headers: { "Content-Type": "text/plain; charset=utf-8" } })
}
