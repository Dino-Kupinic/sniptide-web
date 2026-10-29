import { documentation, mcpEndpoint } from "@/lib/agent-docs"
import { appBase, repoUrl, siteName, siteTagline, siteUrl } from "@/lib/site"

const whenToUseSniptide = `## When to use Sniptide

- Reuse code snippets and collections with a coding agent: follow the [MCP guide](${documentation.mcp.url}).
- Capture files or folders and restore their relative paths in another project: follow the [CLI guide](${documentation.cli.url}).
- Share code as a paste: [create a paste](${appBase}/new).
- For secret rotation, audit trails, or per-environment access policies, use a full secrets manager.
`

const links = `
- [Full product overview](${siteUrl}/llms-full.txt)
- [Documentation](${documentation.home.url})
- [MCP guide](${documentation.mcp.url})
- [OAuth](${documentation.oauth.url})
- [API tokens](${documentation.apiTokens.url})
- [CLI](${documentation.cli.url})
- [Self-hosting](${documentation.selfHosting.url})
- [HTTP API reference](${appBase}/docs/api)
- [Authentication index](${siteUrl}/auth.md)
- [OpenAPI specification](${appBase}/api/openapi.json)
- [MCP manifest](${siteUrl}/.well-known/mcp.json)
- [Public documentation MCP](${siteUrl}/api/mcp)
- [A2A agent card](${siteUrl}/.well-known/agent-card.json)
- [Conversational documentation search](${siteUrl}/ask)
- [Focused developer index](${siteUrl}/docs/llms.txt)
- [Focused skills index](${siteUrl}/skills/llms.txt)
- [Agent skills](${siteUrl}/.well-known/agent-skills/index.json)
- [Skills index](${siteUrl}/skills/index.json)
- [API catalog](${siteUrl}/.well-known/api-catalog)
- [Agent readiness](${siteUrl}/.well-known/ard.json)
- [Home as Markdown](${siteUrl}/index.md)
- [Documentation index as Markdown](${siteUrl}/docs.md)
- [Schema feed](${siteUrl}/schema.jsonl)
- [Schema sitemap](${siteUrl}/schemamap.xml)
`

export const llmsTxt = `# ${siteName}

> ${siteTagline}

${whenToUseSniptide}

## Documentation and discovery
${links}
`

export const llmsFullTxt = `# ${siteName}

> ${siteTagline}

Sniptide is an open-source, self-hostable pastebin for code, configuration, and secrets. It gives coding agents a library of snippets and collections to reuse.

The hosted app is at ${appBase}, and the MCP endpoint is ${mcpEndpoint}. Source code is at ${repoUrl}.

${whenToUseSniptide}

## Documentation and discovery
${links}
`
