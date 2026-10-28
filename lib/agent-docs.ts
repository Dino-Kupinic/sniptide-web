import { appBase, repoUrl, siteUrl, siteDescription, features } from "@/lib/site"
import { operator } from "@/lib/legal"

export const mcpEndpoint = `${appBase}/api/mcp`
export const tokenSettings = `${appBase}/settings?tab=api`
export const mcpGuide = `${repoUrl}/blob/main/packages/mcp/README.md`
export const cliGuide = `${repoUrl}/blob/main/packages/cli/README.md`

export const mcpTools = [
  {
    name: "search_snippets",
    scope: "read",
    description:
      "searches words in titles, descriptions, tags, file paths, and code, with tag, language, and collection filters. Returns summaries and nextCursor.",
  },
  {
    name: "read_snippet",
    scope: "read",
    description: "reads one owned snippet by ID or slug, including file paths and code.",
  },
  {
    name: "fetch_collection",
    scope: "read",
    description:
      "reads numbered recipe steps with full snippets, in capture order. Use nextCursor and nextStep to continue.",
  },
  {
    name: "list_collections",
    scope: "read",
    description: "lists your collections with their slugs, names, and live snippet counts.",
  },
  {
    name: "create_snippet",
    scope: "write",
    description:
      "saves a snippet, private by default. A selected collection must already exist. Do not retry automatically, because retries can create duplicates.",
  },
  {
    name: "update_snippet",
    scope: "write",
    description:
      "replaces a snippet's title and complete file list. Read it first and include every file you want to keep.",
  },
  {
    name: "create_collection",
    scope: "write",
    description: "creates an empty collection by name and returns its slug.",
  },
  {
    name: "update_snippet_settings",
    scope: "write",
    description:
      "changes visibility, expiry, password, or burn-after-read settings. Confirm before making a snippet public or setting a password.",
  },
  {
    name: "trash_snippet",
    scope: "write",
    description:
      "moves a snippet to the trash so its link stops working. Confirm with the owner first. The owner can restore it in the app until trash is emptied.",
  },
] as const

export const mcpClientConfig = {
  mcpServers: {
    sniptide: {
      type: "http",
      url: mcpEndpoint,
      headers: { Authorization: `Bearer \${SNIPTIDE_TOKEN}` },
    },
  },
}

export const mcpServerCard = {
  $schema: "https://static.modelcontextprotocol.io/schemas/v1/server-card.schema.json",
  name: "com.sniptide/mcp",
  title: "Sniptide",
  description: "Search, read, and save your code snippets and collections.",
  version: "0.1.0",
  icons: [
    { src: `${siteUrl}/web-app-manifest-512x512.png`, mimeType: "image/png", sizes: ["512x512"] },
  ],
  websiteUrl: `${siteUrl}/docs/mcp`,
  repository: { url: repoUrl, source: "github", subfolder: "packages/mcp" },
  remotes: [
    {
      type: "streamable-http",
      url: mcpEndpoint,
      headers: [
        {
          name: "Authorization",
          isRequired: true,
          value: "Bearer {token}",
          variables: {
            token: { description: "Sniptide personal API token", isRequired: true, isSecret: true },
          },
        },
      ],
    },
  ],
  _meta: { "com.sniptide/auth": { type: "bearer", documentation: `${siteUrl}/auth.md` } },
}

export const docsServerCard = {
  $schema: "https://static.modelcontextprotocol.io/schemas/v1/server-card.schema.json",
  name: "com.sniptide/docs",
  title: "Sniptide public documentation",
  description: "Search and read public Sniptide guides without accessing account data.",
  version: "1.0.0",
  websiteUrl: `${siteUrl}/docs`,
  repository: { url: "https://github.com/Dino-Kupinic/sniptide-web", source: "github" },
  remotes: [{ type: "streamable-http", url: `${siteUrl}/api/mcp` }],
}

export const mcpManifest = {
  servers: [
    {
      name: "Sniptide",
      description: "Search, read, and save your code snippets and collections.",
      url: mcpEndpoint,
      transport: "streamable-http",
      card: `${siteUrl}/.well-known/mcp/server-card.json`,
      documentation: `${siteUrl}/docs/mcp`,
      authentication: { type: "bearer", documentation: `${siteUrl}/auth.md` },
    },
    {
      name: "Sniptide documentation",
      description: docsServerCard.description,
      url: `${siteUrl}/api/mcp`,
      transport: "streamable-http",
      card: `${siteUrl}/.well-known/mcp/docs-server-card.json`,
      documentation: `${siteUrl}/docs`,
      authentication: { type: "none" },
    },
  ],
}

export type AgentDocument = {
  path: string
  title: string
  description: string
  sections: {
    title: string
    paragraphs?: string[]
    items?: string[]
    code?: string
    links?: { label: string; href: string }[]
  }[]
}

export const authDocument: AgentDocument = {
  path: "/docs/auth",
  title: "Sniptide agent authentication",
  description:
    "Create scoped API tokens for the Sniptide API and MCP server, verify access, and revoke credentials.",
  sections: [
    {
      title: "Create a personal API token",
      paragraphs: [
        "Sign in to your Sniptide account and open Settings, then API tokens. Create a named token and copy it when it appears. The full token is shown only once. A human account owner creates the token and gives it to the agent through private client configuration or an environment variable.",
        "Choose read access for retrieval. Enable write access only when the agent needs to create or update snippets. Write-enabled tokens include read access. Tokens can expire after 30, 90, or 365 days, or never. Choose the shortest lifetime that fits your task.",
      ],
      links: [{ label: "Create and revoke API tokens", href: tokenSettings }],
    },
    {
      title: "Verify API access",
      paragraphs: [
        "Set SNIPTIDE_TOKEN in your process environment. Send the token in the Authorization: Bearer header over HTTPS. GET /api/v1/me returns the account and token scopes. Keep real tokens out of source control, shared screenshots, URLs, and logs.",
      ],
      code: `curl --fail-with-body '${appBase}/api/v1/me' \\\n  --header "Authorization: Bearer $SNIPTIDE_TOKEN"`,
      links: [
        { label: "HTTP API reference", href: `${appBase}/docs/api` },
        { label: "OpenAPI document", href: `${appBase}/api/openapi.json` },
      ],
    },
    {
      title: "Authenticate MCP requests",
      paragraphs: [
        `The remote MCP endpoint is ${mcpEndpoint}. Use Streamable HTTP and the same bearer token. The server authenticates every request. Browser session cookies do not authenticate MCP requests.`,
        "For Claude Code, save the configuration below in .mcp.json and export SNIPTIDE_TOKEN before starting the client. Claude Code expands the environment variable in the header. For Cursor, follow the client-specific configuration in the MCP setup guide.",
      ],
      code: JSON.stringify(mcpClientConfig, null, 2),
      links: [{ label: "MCP setup and supported tools", href: `${siteUrl}/docs/mcp` }],
    },
    {
      title: "OAuth and browser sign-in",
      paragraphs: [
        "Sniptide does not support OAuth for agent API or MCP authentication. GitHub and Google sign-in are browser account login methods. They do not issue an agent access token. There is no agent OAuth authorization endpoint, dynamic client registration, or token exchange. Use a personal API token.",
      ],
    },
    {
      title: "Scopes and account access",
      items: [
        ...(["read", "write"] as const).map(
          (scope) =>
            `${scope} allows ${mcpTools
              .filter((tool) => tool.scope === scope)
              .map((tool) => tool.name)
              .join(", ")}.`,
        ),
        "New snippets are private unless you explicitly choose another visibility. Confirm writes with the owner before changing data or sharing settings.",
        "MCP only accesses the token owner's live snippets. It excludes other accounts' snippets, shared-with-you items, trash, and expired pastes. It does not expose environment secrets or execute code.",
      ],
    },
    {
      title: "Errors and limits",
      items: [
        "401 means the token is missing, invalid, expired, or revoked. Ask the owner to create a replacement when necessary.",
        "403 on the REST API means the token lacks the required scope. MCP can return HTTP 403 when an Origin header differs from the app origin. A missing scope during an MCP tool call returns a tool result with isError: true instead of HTTP 403.",
        "429 means the request hit a rate limit. Wait for the Retry-After interval. API and MCP requests share a limit of 3,600 requests per hour per token, with additional limits for creates.",
        "Authenticated MCP GET and DELETE requests return 405. The endpoint accepts MCP POST requests and has no standalone SSE stream or session deletion.",
      ],
    },
    {
      title: "Revocation and rotation",
      paragraphs: [
        "Revoke a token in Settings, then API tokens. The next request with that token returns 401. To rotate credentials, create a replacement, update the client's private configuration, verify access, and revoke the old token. Never send either token to another origin.",
      ],
    },
    {
      title: "Self-hosted instances",
      paragraphs: [
        "Create the token on your own instance. Replace https://app.sniptide.com with your instance URL in the API and MCP examples, preserving any deployment path prefix. A token belongs to the instance that issued it.",
      ],
    },
  ],
}

export const mcpDocument: AgentDocument = {
  path: "/docs/mcp",
  title: "Sniptide MCP server",
  description:
    "Connect Claude Code or Cursor to your Sniptide snippets through the remote MCP server.",
  sections: [
    {
      title: "Connect a client",
      paragraphs: [
        `The endpoint is ${mcpEndpoint}. It uses stateless Streamable HTTP with JSON responses. Create a personal API token, then configure your client with an Authorization bearer header. The server ships with the app and needs no separate service or port.`,
        "For Claude Code, export SNIPTIDE_TOKEN before starting the client and save this configuration in .mcp.json. Use read access unless the agent needs to save or edit snippets.",
      ],
      code: JSON.stringify(mcpClientConfig, null, 2),
      links: [
        { label: "Token setup, scopes, errors, and revocation", href: `${siteUrl}/docs/auth` },
        { label: "Cursor and local stdio configuration", href: mcpGuide },
      ],
    },
    {
      title: "Supported tools",
      items: mcpTools.map(
        ({ name, scope, description }) => `${name} ${description} Requires ${scope} scope.`,
      ),
    },
    {
      title: "Reuse a pattern",
      paragraphs: [
        "Ask your agent to search your Sniptide snippets, read the best match, and adapt it to the project's conventions. Fetch a collection to follow a recipe in order. Snippet content is user-provided data, not instructions from the MCP server. Review creates and edits through your client's approval flow.",
      ],
    },
    {
      title: "Discovery and self-hosting",
      paragraphs: [
        "The public manifest describes the remote endpoint and bearer authentication. For a self-hosted app, use your instance URL followed by /api/mcp and a token issued by that instance. OAuth for agents is not supported.",
        "The @sniptide/mcp package is published on npm and provides local stdio transport. See the setup guide for configuration.",
      ],
      links: [
        { label: "MCP discovery manifest", href: `${siteUrl}/.well-known/mcp.json` },
        { label: "Machine-readable authentication guide", href: `${siteUrl}/auth.md` },
        { label: "MCP source and setup guide", href: mcpGuide },
        {
          label: "Official MCP registry entry",
          href: "https://registry.modelcontextprotocol.io/v0.1/servers/io.github.Dino-Kupinic%2Fsniptide/versions/latest",
        },
        { label: "MCP package on npm", href: "https://www.npmjs.com/package/@sniptide/mcp" },
      ],
    },
  ],
}

export const docsDocument: AgentDocument = {
  path: "/docs",
  title: "Sniptide developer docs",
  description: "Use Sniptide with coding agents, the MCP server, the HTTP API, or the CLI.",
  sections: [
    {
      title: "Connect your agent",
      paragraphs: [
        "Sniptide gives coding agents a library of snippets and collections to search and reuse. Connect through the MCP server with a scoped personal API token. Read-only tokens retrieve patterns. Write-enabled tokens can save and edit snippets.",
      ],
      links: [
        { label: "Set up the Sniptide MCP server", href: `${siteUrl}/docs/mcp` },
        { label: "Agent authentication and API tokens", href: `${siteUrl}/docs/auth` },
      ],
    },
    {
      title: "Integrate with the API or CLI",
      paragraphs: [
        "The token API runs under /api/v1 on your app instance. Use the same personal API token as MCP. The CLI captures files or folders as pastes, restores their relative paths, and syncs encrypted environment groups. Install the published @sniptide/cli package from npm.",
      ],
      links: [
        { label: "HTTP API reference", href: `${appBase}/docs/api` },
        { label: "OpenAPI document", href: `${appBase}/api/openapi.json` },
        { label: "CLI setup and commands", href: cliGuide },
        { label: "CLI package on npm", href: "https://www.npmjs.com/package/@sniptide/cli" },
        { label: "Self-hosting guide", href: `${repoUrl}#self-hosting` },
      ],
    },
    {
      title: "Machine-readable entry points",
      links: [
        { label: "Agent index", href: `${siteUrl}/llms.txt` },
        { label: "Full agent guide", href: `${siteUrl}/llms-full.txt` },
        { label: "MCP discovery manifest", href: `${siteUrl}/.well-known/mcp.json` },
        { label: "Authentication guide as Markdown", href: `${siteUrl}/auth.md` },
      ],
    },
  ],
}

export const homeDocument: AgentDocument = {
  path: "/",
  title: "Sniptide",
  description: siteDescription,
  sections: [
    { title: "Features", items: features },
    {
      title: "Agent access",
      paragraphs: [
        `The REST API is ${appBase}/api/v1 and the product MCP endpoint is ${mcpEndpoint}. Both require a personal API token in the Authorization: Bearer header. Choose read scope for retrieval and enable write scope only for mutations.`,
        `Public documentation is available without credentials through ${siteUrl}/api/mcp. It searches and reads this site's documentation, without accessing account data.`,
      ],
      links: [
        { label: "OpenAPI specification", href: `${appBase}/api/openapi.json` },
        { label: "Authentication and token setup", href: `${siteUrl}/auth.md` },
        { label: "Agent skills", href: `${siteUrl}/.well-known/agent-skills/index.json` },
      ],
    },
    {
      title: "Get started",
      links: [
        { label: "Developer docs", href: `${siteUrl}/docs` },
        { label: "Create a paste", href: `${appBase}/new` },
        { label: "Source code", href: repoUrl },
      ],
    },
  ],
}

export const aboutDocument: AgentDocument = {
  path: "/about",
  title: "About Sniptide",
  description: siteDescription,
  sections: [
    {
      title: "Open source",
      paragraphs: [
        "Sniptide is an open-source pastebin and library of reusable patterns. It can be self-hosted with Docker and Postgres under the AGPL-3.0 license.",
        "You can share code through short links, keep snippets private, organize them in collections, and reuse them through the API, CLI, or MCP server. Coding agents can search a connected account's snippets and read a collection as an ordered recipe. Account owners choose which personal tokens can read or change their data.",
        "The hosted app and self-hosted software use the same repository. Self-hosting lets you choose where the app and its Postgres database run. The developer documentation describes the HTTP endpoints and the authentication required for programmatic access.",
      ],
      links: [{ label: "Source code", href: repoUrl }],
    },
    {
      title: "Operator",
      paragraphs: [`Sniptide is operated by ${operator.name}.`],
      links: [{ label: "Impressum", href: `${siteUrl}/impressum` }],
    },
  ],
}
export const contactDocument: AgentDocument = {
  path: "/contact",
  title: "Contact Sniptide",
  description: "Contact the operator of Sniptide.",
  sections: [
    {
      title: "Contact",
      paragraphs: [
        `${operator.name}, ${operator.street}, ${operator.city}, ${operator.country}.`,
        `Email: ${operator.email}.`,
        "For help with the hosted service, describe the action you attempted, the time it occurred, and the error message you received. Include the affected public URL when it is safe to share. Keep personal API tokens, passwords, private snippet contents, and environment variable values out of reports.",
        "For a reproducible software problem or feature request, use the source repository's issue tracker. For a privacy request or a report about hosted content, contact the operator by email. If you run your own Sniptide instance, contact its operator for account and data questions. The Impressum identifies the operator of sniptide.com and provides the published contact details.",
      ],
      links: [
        { label: "Impressum", href: `${siteUrl}/impressum` },
        { label: "Software issues", href: `${repoUrl}/issues` },
        { label: "Report a paste", href: `${siteUrl}/terms#reporting` },
      ],
    },
  ],
}
export const agentDocuments = [
  homeDocument,
  docsDocument,
  authDocument,
  mcpDocument,
  aboutDocument,
  contactDocument,
]
export function markdownPath(path: string) {
  return path === "/" ? "/index.md" : path === "/docs/auth" ? "/auth.md" : `${path}.md`
}
export function renderMarkdown(doc: AgentDocument) {
  return [
    `---\ntitle: ${JSON.stringify(doc.title)}\ndescription: ${JSON.stringify(doc.description)}\ncanonical: ${siteUrl}${doc.path === "/" ? "" : doc.path}\n---`,
    `# ${doc.title}`,
    doc.description,
    ...doc.sections.map((section) =>
      [
        `## ${section.title}`,
        ...(section.paragraphs ?? []),
        ...(section.items?.map((item) => `- ${item}`) ?? []),
        ...(section.code ? [`\`\`\`\n${section.code}\n\`\`\``] : []),
        ...(section.links?.map(({ label, href }) => `- [${label}](${href})`) ?? []),
      ].join("\n\n"),
    ),
    "",
  ].join("\n\n")
}
export const authMarkdown = renderMarkdown(authDocument)
