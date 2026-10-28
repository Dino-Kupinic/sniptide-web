import { authDocument, docsDocument, markdownPath, mcpDocument } from "@/lib/agent-docs"
import { appBase, siteUrl } from "@/lib/site"

export function GET() {
  const text = [
    "# Sniptide developer documentation",
    "> Connect coding agents to Sniptide using scoped personal API tokens.",
    "## Guides",
    ...[docsDocument, authDocument, mcpDocument].map(
      (doc) => `- [${doc.title}](${siteUrl}${markdownPath(doc.path)}): ${doc.description}`,
    ),
    `- [OpenAPI specification](${appBase}/api/openapi.json): REST endpoints and required scopes.`,
    `- [Public documentation MCP](${siteUrl}/api/mcp): Search and read these public guides.`,
    `- [Agent skills](${siteUrl}/.well-known/agent-skills/index.json): Reusable procedures.`,
    "",
  ].join("\n\n")
  return new Response(text, { headers: { "Content-Type": "text/plain; charset=utf-8" } })
}
