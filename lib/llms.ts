import { authMarkdown, cliGuide, mcpGuide, mcpTools } from "@/lib/agent-docs"
import { appBase, imageUrl, repoUrl, siteName, siteTagline, siteUrl } from "@/lib/site"

// https://llmstxt.org: an H1, a one-line summary, then sections of annotated links.
export const llmsTxt = `# ${siteName}

> ${siteTagline} Open source (AGPL-3.0), hosted at sniptide.com or run on your own server with Docker.

Paste code or a whole folder, choose who can open it and for how long, and share one short link (${siteUrl}/<slug>). Pastes are private, unlisted or public, with an optional password, expiry or burn-after-read. Coding agents such as Claude Code and Cursor can search, read and save snippets through an MCP server or the CLI. \`.env\` files sync as encrypted env groups.

${siteName} is not a full secrets manager: it has no key rotation, audit trail or per-environment access policies. The MCP server uses a personal API token and has no OAuth login yet.

## Use ${siteName}

- [Home page](${siteUrl}): what ${siteName} is and what it does
- [Create a paste](${appBase}/new): paste code and get a short link
- [Sign up](${appBase}/sign-up): free account on the hosted app

## For agents and developers

- [Developer docs](${siteUrl}/docs): MCP setup, agent authentication, API and CLI guides
- [MCP setup](${siteUrl}/docs/mcp): connect a client using Streamable HTTP and a bearer token
- [MCP discovery manifest](${siteUrl}/.well-known/mcp.json): remote server address and authentication documentation
- [Agent authentication](${siteUrl}/auth.md): create scoped API tokens, verify access, handle errors, and revoke credentials
- [MCP server](${mcpGuide}): ${mcpTools.length} tools (${mcpTools.map(({ name }) => name).join(", ")}) at ${appBase}/api/mcp, authenticated with a personal API token
- [CLI](${cliGuide}): capture files or folders as pastes, restore them in another project, and sync \`.env\` files
- [HTTP API reference](${appBase}/docs/api): raw files, the token API under /api/v1 and more
- [OpenAPI document](${appBase}/api/openapi.json): machine-readable API description

## Self-hosting

- [Self-hosting guide](${repoUrl}#self-hosting): one Docker image (${imageUrl}, AMD64 and ARM64) plus Postgres
- [Source code](${repoUrl}): GitHub repository, AGPL-3.0

## Optional

- [Full version of this file](${siteUrl}/llms-full.txt): the same information in one document
- [Positioning](${repoUrl}/blob/main/docs/positioning.md): who ${siteName} is for and how it differs from gists, pastebins and Infisical
`

export const llmsFullTxt = `# ${siteName}

> ${siteTagline} Open source (AGPL-3.0), hosted at sniptide.com or run on your own server with Docker.

This is the long version of ${siteUrl}/llms.txt. Everything below describes what ${siteName} does today.

## What ${siteName} is

${siteName} is a pastebin with rules: who can open a paste, for how long, and how often. You paste a snippet, a config or a whole folder, get a short link such as ${siteUrl}/k7Qe2x, and share it. The raw text is at ${siteUrl}/<slug>/raw.

- Visibility: private, unlisted or public.
- Link rules: an optional password, an expiry (one hour, a day, a week, a month or never) and burn-after-read, where the first person to open the paste is the last.
- Insight: every paste shows how often it was opened.
- Safety: the editor warns when you paste something that looks like an API key or token.
- Previews: public pastes unfurl in Slack, Discord and social cards. Preview requests don't count as views and don't consume one-time pastes.
- Editing: the editor auto-saves, undoes and rolls back to earlier revisions.

## Who it is for

- **Developers** who paste code, logs and configs into chat all day and want a fast, private link instead of a public wall of text.
- **Teams and homelabbers** who keep data on their own servers: one Docker image plus Postgres, AGPL-3.0, your data in your database.
- **People working with coding agents** (Claude Code, Cursor) who want agents to reuse their patterns instead of inventing new ones.

${siteName} is not for teams that need a full secrets manager with rotation, audit trails and per-environment RBAC.

## Agents

Your best snippets become a pattern library. A coding agent searches summaries, reads the match and follows a collection's steps in order.

### MCP server

Endpoint: ${appBase}/api/mcp (or <your-instance-url>/api/mcp when self-hosted). Create a personal API token in Settings, then API tokens, and send it as a bearer token. Use read-only access for retrieval, or enable write access to save and edit snippets. Agent OAuth is not supported. Discovery manifest: ${siteUrl}/.well-known/mcp.json. Setup guide: ${siteUrl}/docs/mcp.

Tools:

${mcpTools.map(({ name, scope, description }) => `- ${name}: ${description} Requires ${scope} scope.`).join("\n")}

Only the token owner's snippets are available. The server doesn't run code, expose env secrets or accept browser session cookies. Snippets an agent creates are private by default.

Claude Code \`.mcp.json\`:

\`\`\`json
{
  "mcpServers": {
    "sniptide": {
      "type": "http",
      "url": "${appBase}/api/mcp",
      "headers": { "Authorization": "Bearer \${SNIPTIDE_TOKEN}" }
    }
  }
}
\`\`\`

Guide: ${mcpGuide}

### CLI

The ${siteName} CLI captures files, folders or globs as pastes, restores their relative paths in another project, and syncs \`.env\` files. It authenticates with a personal API token. Bundle export and import work offline without an account. It isn't published to npm yet; build it from the repository.

Guide: ${cliGuide}

## Secrets

Sync a project's \`.env\` as an env group that is encrypted at rest. Pull it with \`sniptide env pull\` or run a command with the values set using \`sniptide env run\`. Values are never printed in tool output. Password and one-time links cover the one-off handoff of a secret.

## Self-hosting

\`\`\`sh
git clone ${repoUrl}.git && cd sniptide
printf 'BETTER_AUTH_SECRET=%s\\nBETTER_AUTH_URL=http://<your-server-ip>:3000\\n' "$(openssl rand -hex 32)" > .env
docker compose up -d
\`\`\`

The official image is ${imageUrl} for Linux AMD64 and ARM64. The app applies database migrations on start. Update with \`docker compose pull\` and \`docker compose up -d\`.

Guide: ${repoUrl}#self-hosting

## How it compares

- **Instead of a gist:** the same quick link, on your server, with passwords, expiry and burn-after-read.
- **Instead of a pastebin:** open source, with accounts, revisions and tools for your agents.
- **Next to Infisical:** Infisical is a full secrets platform. Reach for it when you need rotation, audit and access policies. ${siteName} covers the everyday case: a project's \`.env\` next to the snippets you actually reuse.

## Links

- Website: ${siteUrl}
- Developer docs: ${siteUrl}/docs
- Authentication guide: ${siteUrl}/auth.md
- App: ${appBase}
- HTTP API reference: ${appBase}/docs/api
- OpenAPI document: ${appBase}/api/openapi.json
- Source code and license (AGPL-3.0): ${repoUrl}

${authMarkdown.replace(/^# /, "## ").replace(/^## (?!Sniptide agent authentication)/gm, "### ")}
`
