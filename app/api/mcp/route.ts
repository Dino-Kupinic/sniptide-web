import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js"
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js"
import { z } from "zod"
import { agentDocuments, markdownPath, renderMarkdown } from "@/lib/agent-docs"
import { searchDocuments } from "@/lib/public-doc-search"
import { siteUrl } from "@/lib/site"

const MAX_BODY_BYTES = 16 * 1024

const inputs = {
  search_docs: { query: z.string().min(1).max(500) },
  read_doc: { path: z.string().min(1).max(100) },
}
// The guides only describe Sniptide. Nothing here reads account data or changes anything.
const annotations = { readOnlyHint: true, destructiveHint: false, openWorldHint: false }

const instructions =
  "Public Sniptide documentation: setup, authentication, the HTTP API and the product MCP server. Call search_docs with keywords, then read_doc with a returned path. This server reads no account data and changes nothing. To search or save a user's snippets, connect the product MCP server at https://app.sniptide.com/api/mcp with the user's personal API token."

function rpcError(id: unknown, code: number, message: string, data?: unknown, status = 200) {
  return Response.json(
    { jsonrpc: "2.0", id: id ?? null, error: { code, message, ...(data ? { data } : {}) } },
    { status },
  )
}

// The SDK answers an unknown tool or bad arguments with a tool result, which agents can mistake
// for a normal answer. Those calls get a JSON-RPC Invalid params error (-32602) instead.
function checkToolCall(message: unknown): Response | null {
  if (!message || typeof message !== "object") return null
  const { id, method, params } = message as { id?: unknown; method?: unknown; params?: unknown }
  if (method !== "tools/call") return null
  const { name, arguments: args } = (params ?? {}) as { name?: unknown; arguments?: unknown }
  if (typeof name !== "string" || !(name in inputs))
    return rpcError(id, -32602, `Unknown tool: ${String(name).slice(0, 100)}.`, {
      tools: Object.keys(inputs),
    })
  const parsed = z.object(inputs[name as keyof typeof inputs]).safeParse(args ?? {})
  if (!parsed.success)
    return rpcError(id, -32602, `Invalid arguments for ${name}.`, {
      issues: parsed.error.issues.map(({ path, message }) => ({ path, message })),
    })
  return null
}

export async function POST(request: Request) {
  const body = new Uint8Array(await request.arrayBuffer())
  if (body.byteLength > MAX_BODY_BYTES)
    return rpcError(null, -32600, "Use at most 16 KiB per request.", undefined, 413)
  let message: unknown
  try {
    message = JSON.parse(new TextDecoder().decode(body))
  } catch {
    return rpcError(null, -32700, "The request body isn't valid JSON.", undefined, 400)
  }
  const invalid = Array.isArray(message) ? null : checkToolCall(message)
  if (invalid) return invalid

  const server = new McpServer(
    { name: "sniptide-public-docs", title: "Sniptide documentation", version: "1.1.0" },
    { instructions },
  )
  server.registerTool(
    "search_docs",
    {
      title: "Search documentation",
      description:
        "Search public Sniptide documentation by keywords. Returns titles, descriptions and Markdown URLs, best match first.",
      inputSchema: inputs.search_docs,
      annotations,
    },
    async ({ query }) => ({
      content: [
        {
          type: "text",
          text: JSON.stringify(
            searchDocuments(query).map(({ title, description, path }) => ({
              title,
              description,
              path,
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
      title: "Read a document",
      description:
        "Read a public document as Markdown by the path search_docs returned, such as /docs/mcp or /auth.md.",
      inputSchema: inputs.read_doc,
      annotations,
    },
    async ({ path }) => {
      const doc = agentDocuments.find(
        (item) => item.path === path || markdownPath(item.path) === path,
      )
      return doc
        ? { content: [{ type: "text", text: renderMarkdown(doc) }] }
        : {
            isError: true,
            content: [
              {
                type: "text",
                text: `Unknown public document path. Use one of: ${agentDocuments.map(({ path }) => path).join(", ")}.`,
              },
            ],
          }
    },
  )
  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true,
  })
  await server.connect(transport)
  return transport.handleRequest(
    new Request(request.url, { method: "POST", headers: request.headers, body }),
  )
}
