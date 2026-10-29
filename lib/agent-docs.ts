import { operator } from "./legal"
import { appBase, features, repoUrl, siteDescription, siteUrl } from "./site"

export const documentation = {
  home: { title: "Documentation", url: "https://docs.sniptide.com" },
  mcp: { title: "MCP", url: "https://docs.sniptide.com/mcp" },
  oauth: { title: "OAuth", url: "https://docs.sniptide.com/oauth" },
  apiTokens: { title: "API tokens", url: "https://docs.sniptide.com/api-tokens" },
  cli: { title: "CLI", url: "https://docs.sniptide.com/cli" },
  selfHosting: { title: "Self-hosting", url: "https://docs.sniptide.com/self-hosting" },
} as const

export const mcpEndpoint = `${appBase}/api/mcp`
// How the product MCP server authenticates, for the server card and the discovery manifest.
const mcpAuthentication = {
  type: "oauth2",
  protectedResourceMetadata: `${appBase}/.well-known/oauth-protected-resource/api/mcp`,
  alternatives: ["bearer"],
  documentation: documentation.oauth.url,
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
  websiteUrl: documentation.mcp.url,
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
  websiteUrl: documentation.home.url,
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
      documentation: documentation.mcp.url,
      authentication: mcpAuthentication,
    },
    {
      name: "Sniptide documentation",
      description: docsServerCard.description,
      url: `${siteUrl}/api/mcp`,
      transport: "streamable-http",
      card: `${siteUrl}/.well-known/mcp/docs-server-card.json`,
      documentation: documentation.home.url,
      authentication: { type: "none" },
    },
  ],
}

export type AgentDocument = {
  path: string
  canonicalUrl: string
  title: string
  description: string
  searchTerms?: readonly string[]
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
  canonicalUrl: documentation.oauth.url,
  title: "Sniptide agent authentication",
  description: "Canonical OAuth and personal API token documentation for Sniptide agents.",
  searchTerms: [
    "PKCE",
    "refresh token",
    "access token",
    "registration",
    "revocation",
    "consent",
    "scope",
  ],
  sections: [
    {
      title: "Authentication guides",
      links: [documentation.oauth, documentation.apiTokens, documentation.mcp].map(
        ({ title, url }) => ({ label: title, href: url }),
      ),
    },
  ],
}

export const mcpDocument: AgentDocument = {
  path: "/docs/mcp",
  canonicalUrl: documentation.mcp.url,
  title: "Sniptide MCP server",
  description: "Canonical MCP setup and client integration documentation for Sniptide.",
  searchTerms: [
    "Claude Code",
    "Cursor",
    "Streamable HTTP",
    "stdio",
    "search snippets",
    "read snippets",
    "save snippets",
    "collections",
  ],
  sections: [
    {
      title: "MCP guide",
      links: [{ label: documentation.mcp.title, href: documentation.mcp.url }],
    },
  ],
}

export const docsDocument: AgentDocument = {
  path: "/docs",
  canonicalUrl: documentation.home.url,
  title: "Sniptide developer docs",
  description: "Canonical documentation for MCP, OAuth, API tokens, the CLI and self-hosting.",
  sections: [
    {
      title: "Documentation",
      links: Object.values(documentation).map(({ title, url }) => ({ label: title, href: url })),
    },
    {
      title: "Instance API reference",
      links: [
        { label: "HTTP API reference", href: `${appBase}/docs/api` },
        { label: "OpenAPI specification", href: `${appBase}/api/openapi.json` },
      ],
    },
    {
      title: "Public discovery",
      links: [
        { label: "Agent index", href: `${siteUrl}/llms.txt` },
        { label: "MCP manifest", href: `${siteUrl}/.well-known/mcp.json` },
        { label: "Public documentation MCP", href: `${siteUrl}/api/mcp` },
        { label: "A2A documentation agent", href: `${siteUrl}/.well-known/agent-card.json` },
      ],
    },
  ],
}

export const homeDocument: AgentDocument = {
  path: "/",
  canonicalUrl: siteUrl,
  title: "Sniptide",
  description: siteDescription,
  sections: [
    { title: "Features", items: features },
    {
      title: "Agent access",
      paragraphs: [
        `The REST API is ${appBase}/api/v1 and the product MCP endpoint is ${mcpEndpoint}. See the canonical documentation for authentication and client setup.`,
        `Public documentation is available without credentials through ${siteUrl}/api/mcp. It searches and reads this site's documentation, without accessing account data.`,
      ],
      links: [
        { label: "OpenAPI specification", href: `${appBase}/api/openapi.json` },
        { label: "Authentication and token setup", href: documentation.oauth.url },
        { label: "Agent skills", href: `${siteUrl}/.well-known/agent-skills/index.json` },
      ],
    },
    {
      title: "Get started",
      links: [
        { label: "Developer docs", href: documentation.home.url },
        { label: "Create a paste", href: `${appBase}/new` },
        { label: "Source code", href: repoUrl },
      ],
    },
  ],
}

export const aboutDocument: AgentDocument = {
  path: "/about",
  canonicalUrl: `${siteUrl}/about`,
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
  canonicalUrl: `${siteUrl}/contact`,
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
          `---\ntitle: ${JSON.stringify(doc.title)}\ndescription: ${JSON.stringify(doc.description)}\ncanonical: ${doc.canonicalUrl}\n---`,
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
