import { operator } from "@/lib/legal"
import { appBase, features, repoUrl, siteDescription, siteUrl } from "@/lib/site"

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

// How the product MCP server authenticates, for the server card and the discovery manifest.
const mcpAuthentication = {
  type: "oauth2",
  protectedResourceMetadata: `${appBase}/.well-known/oauth-protected-resource/api/mcp`,
  alternatives: ["bearer"],
  documentation: `${siteUrl}/auth.md`,
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
          // OAuth clients get their token from the flow the 401 points to and set this themselves.
          isRequired: false,
          value: "Bearer {token}",
          variables: {
            token: {
              description: "Sniptide personal API token, for clients without OAuth",
              isRequired: true,
              isSecret: true,
            },
          },
        },
      ],
    },
  ],
  _meta: { "com.sniptide/auth": mcpAuthentication },
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
      authentication: mcpAuthentication,
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

export const oauthMetadata = {
  protectedResource: `${appBase}/.well-known/oauth-protected-resource`,
  mcpProtectedResource: `${appBase}/.well-known/oauth-protected-resource/api/mcp`,
  authorizationServer: `${appBase}/.well-known/oauth-authorization-server`,
  registration: `${appBase}/api/oauth/register`,
  authorization: `${appBase}/oauth/authorize`,
  token: `${appBase}/api/oauth/token`,
  revocation: `${appBase}/api/oauth/revoke`,
}

// /auth.md follows the WorkOS auth.md outline (github.com/workos/auth.md): discover, pick a
// method, register, authorize, exchange, use the access token, errors and revocation.
export const authDocument: AgentDocument = {
  path: "/docs/auth",
  title: "Sniptide agent authentication",
  description:
    "Connect an agent to the Sniptide API and MCP server with OAuth 2.1 or a scoped personal API token, then handle errors and revoke access.",
  sections: [
    {
      title: "Discover",
      paragraphs: [
        `Send any request to the API or the MCP server without credentials. The 401 response carries a WWW-Authenticate header whose resource_metadata parameter is the RFC 9728 protected resource metadata URL. For the MCP server at ${mcpEndpoint} it is ${oauthMetadata.mcpProtectedResource}, and for the REST API under ${appBase}/api/v1 it is ${oauthMetadata.protectedResource}.`,
        `The oauth-protected-resource document lists ${appBase} in authorization_servers, with scopes_supported read and write. Fetch the RFC 8414 oauth-authorization-server document at ${oauthMetadata.authorizationServer} for the registration, authorization, token and revocation endpoints. The issuer, the resource and every endpoint share the origin ${appBase}.`,
      ],
      code: `curl -i -X POST '${mcpEndpoint}'\n# HTTP/1.1 401 Unauthorized\n# WWW-Authenticate: Bearer resource_metadata="${oauthMetadata.mcpProtectedResource}"\n\ncurl '${oauthMetadata.authorizationServer}'`,
      links: [
        { label: "Protected resource metadata", href: oauthMetadata.protectedResource },
        { label: "Authorization server metadata", href: oauthMetadata.authorizationServer },
      ],
    },
    {
      title: "Pick a method",
      items: [
        "OAuth 2.1 authorization code with PKCE: for an agent or MCP client that acts for a person who can approve it in a browser. MCP clients that support OAuth, such as Claude Code, do this on their own from the MCP URL.",
        "Personal API token: for scripts, CI jobs and headless agents. The account owner creates the token in Settings and gives it to the agent through private configuration.",
        "Sniptide does not implement agent_auth identity flows. The authorization server metadata has no agent_auth block or identity_endpoint, and it accepts none of the identity types anonymous, identity_assertion (including the ID-JAG token type urn:ietf:params:oauth:token-type:id-jag) or service_auth. OpenID Connect, client secrets and the device flow are not supported either.",
      ],
    },
    {
      title: "Register",
      paragraphs: [
        `Register a public client with dynamic client registration (RFC 7591) at ${oauthMetadata.registration}. Use token_endpoint_auth_method none. Redirect URIs use https, http on localhost or 127.0.0.1 with any port, or your app's own scheme. The response contains the client_id.`,
      ],
      code: `curl '${oauthMetadata.registration}' \\\n  --header 'Content-Type: application/json' \\\n  --data '{"client_name":"My agent","redirect_uris":["http://127.0.0.1:8976/callback"],"token_endpoint_auth_method":"none"}'`,
    },
    {
      title: "Authorize",
      paragraphs: [
        `Create a PKCE code verifier and its S256 code challenge, then open ${oauthMetadata.authorization} in the user's browser with response_type=code, client_id, redirect_uri, code_challenge, code_challenge_method=S256, state, scope (read, or read write) and resource (${mcpEndpoint} for MCP). The user signs in if needed and sees which client asks, which access it wants and where Sniptide sends them back.`,
        "After approval, the redirect carries code, state and iss. Check that state matches and iss is the issuer. A denial returns error=access_denied.",
      ],
    },
    {
      title: "Exchange",
      paragraphs: [
        `POST the code to ${oauthMetadata.token} as application/x-www-form-urlencoded with grant_type=authorization_code, code, client_id, redirect_uri and code_verifier. A code works once and for ten minutes. The response contains access_token, token_type Bearer, expires_in 3600, refresh_token and scope.`,
        "Renew with grant_type=refresh_token, refresh_token and client_id before the hour ends. Each refresh returns a new refresh token and ends the old pair. A refresh may narrow the scope and never widen it. A refresh token lapses after 30 days without use.",
      ],
      code: `curl '${oauthMetadata.token}' \\\n  --data-urlencode grant_type=authorization_code \\\n  --data-urlencode code="$CODE" \\\n  --data-urlencode client_id="$CLIENT_ID" \\\n  --data-urlencode redirect_uri=http://127.0.0.1:8976/callback \\\n  --data-urlencode code_verifier="$VERIFIER"`,
    },
    {
      title: "Use the access_token",
      paragraphs: [
        "Send the access token, or a personal API token, in the Authorization: Bearer header over HTTPS. GET /api/v1/me returns the account and the scopes. Use Streamable HTTP for MCP. Browser session cookies never authenticate the API or MCP.",
        "To use a personal API token instead, sign in, open Settings, then API tokens, and create a named token. The full token is shown once. Choose read access for retrieval and enable write only when the agent saves or edits snippets. Tokens can expire after 30, 90 or 365 days, or never.",
      ],
      code: `curl --fail-with-body '${appBase}/api/v1/me' \\\n  --header "Authorization: Bearer $SNIPTIDE_TOKEN"`,
      links: [
        { label: "Create and revoke API tokens", href: tokenSettings },
        { label: "HTTP API reference", href: `${appBase}/docs/api` },
        { label: "OpenAPI document", href: `${appBase}/api/openapi.json` },
        { label: "MCP setup and supported tools", href: `${siteUrl}/docs/mcp` },
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
        "write always includes read. A client that asks for no scope gets read. The OpenAPI document declares both scopes in its oauth2 security scheme.",
        "New snippets are private unless you explicitly choose another visibility. Confirm writes with the owner before changing data or sharing settings.",
        "MCP only accesses the account owner's live snippets. It excludes other accounts' snippets, shared-with-you items, trash, and expired pastes. It does not expose environment secrets or execute code.",
      ],
    },
    {
      title: "Errors",
      items: [
        "OAuth endpoints answer with a JSON error and error_description (RFC 6749): invalid_request, invalid_grant for a spent, expired or mismatched code or refresh token, invalid_scope, invalid_target for a resource on another origin, unsupported_grant_type, and invalid_redirect_uri or invalid_client_metadata at registration.",
        '401 from the API or MCP means the token is missing, invalid, expired or revoked. The WWW-Authenticate header names the resource metadata, with error="invalid_token" when a token was sent. Refresh, or authorize again.',
        '403 on the REST API means the token lacks a scope. WWW-Authenticate carries error="insufficient_scope" and the scope it needs. MCP can also return 403 when an Origin header differs from the app origin. A missing scope during an MCP tool call returns a tool result with isError: true.',
        "429 means a rate limit. Wait for Retry-After. API and MCP requests share 3,600 requests per hour per token, requests without a valid token get 60 per 10 minutes per address, registration 20 per hour and the token endpoint 60 per minute. RateLimit and RateLimit-Policy headers report each quota.",
      ],
    },
    {
      title: "Revocation",
      paragraphs: [
        `POST token=<access or refresh token> to ${oauthMetadata.revocation} (RFC 7009) to end an OAuth grant. Either token ends the whole grant, and an unknown token also gets 200. The account owner can disconnect an app or revoke a personal token in Settings, then API tokens. The next request with a revoked token returns 401.`,
        "To rotate a personal token, create a replacement, update the client's private configuration, verify access, and revoke the old token. Never send a token to another origin.",
      ],
    },
    {
      title: "Self-hosted instances",
      paragraphs: [
        "Replace https://app.sniptide.com with your instance URL in every example, keeping any path prefix. Each instance is its own authorization server, and a token works only on the instance that issued it.",
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
        `The endpoint is ${mcpEndpoint}. It uses stateless Streamable HTTP with JSON responses. Clients that support OAuth, such as Claude Code, need only this URL and sign you in through the browser: run claude mcp add --transport http sniptide ${mcpEndpoint}. The server ships with the app and needs no separate service or port.`,
        "For a client without OAuth, create a personal API token, export SNIPTIDE_TOKEN before starting the client and save this configuration in .mcp.json. Use read access unless the agent needs to save or edit snippets.",
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
        "The public manifest describes the remote endpoint and its authentication. Clients that support OAuth discover it from the first 401. For a self-hosted app, use your instance URL followed by /api/mcp.",
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
        "Sniptide gives coding agents a library of snippets and collections to search and reuse. Connect through the MCP server with OAuth or a scoped personal API token. Read access retrieves patterns. Write access can save and edit snippets.",
      ],
      links: [
        { label: "Set up the Sniptide MCP server", href: `${siteUrl}/docs/mcp` },
        { label: "Agent authentication and API tokens", href: `${siteUrl}/docs/auth` },
      ],
    },
    {
      title: "Integrate with the API or CLI",
      paragraphs: [
        "The token API runs under /api/v1 on your app instance. Use the same OAuth access token or personal API token as MCP. The CLI captures files or folders as pastes, restores their relative paths, and syncs encrypted environment groups. Install the published @sniptide/cli package from npm.",
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
        `The REST API is ${appBase}/api/v1 and the product MCP endpoint is ${mcpEndpoint}. Both take an OAuth 2.1 access token or a personal API token in the Authorization: Bearer header, and a 401 points to the OAuth metadata. Choose read scope for retrieval and enable write scope only for mutations.`,
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
// /auth.md starts with its heading, because auth.md readers expect the document to open with one.
export function renderMarkdown(doc: AgentDocument, { frontmatter = true } = {}) {
  return [
    ...(frontmatter
      ? [
          `---\ntitle: ${JSON.stringify(doc.title)}\ndescription: ${JSON.stringify(doc.description)}\ncanonical: ${siteUrl}${doc.path === "/" ? "" : doc.path}\n---`,
        ]
      : []),
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
export const authMarkdown = renderMarkdown(authDocument, { frontmatter: false })
