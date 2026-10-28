import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js"
import { z } from "zod"
import { agentDocuments, markdownPath, renderMarkdown } from "@/lib/agent-docs"
import { searchDocuments } from "@/lib/public-doc-search"
import { siteUrl } from "@/lib/site"

export async function POST(request: Request) {
  const server = new McpServer({ name: "sniptide-public-docs", version: "1.0.0" })
  server.registerTool(
    "search_docs",
    {
      description: "Search public Sniptide documentation by keywords.",
      inputSchema: { query: z.string().min(1).max(500) },
    },
    async ({ query }) => ({
      content: [
        {
          type: "text",
          text: JSON.stringify(
            searchDocuments(query).map(({ title, description, path }) => ({
              title,
              description,
              url: `${siteUrl}${markdownPath(path)}`,
            })),
          ),
        },
      ],
    }),
  )
  server.registerTool(
    "read_doc",
    {
      description: "Read a public document by its listed path.",
      inputSchema: { path: z.string().max(100) },
    },
    async ({ path }) => {
      const doc = agentDocuments.find(
        (item) => item.path === path || markdownPath(item.path) === path,
      )
      return doc
        ? { content: [{ type: "text", text: renderMarkdown(doc) }] }
        : { isError: true, content: [{ type: "text", text: "Unknown public document path." }] }
    },
  )
  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true,
  })
  await server.connect(transport)
  return transport.handleRequest(request)
}
