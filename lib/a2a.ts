import { randomUUID } from "node:crypto"
import { documentation } from "@/lib/agent-docs"
import { searchDocuments } from "@/lib/public-doc-search"
import { siteName, siteUrl } from "@/lib/site"

// An Agent2Agent (A2A, protocol 0.3) agent that answers questions about Sniptide with links to
// the public guides. It runs the same keyword search as the documentation MCP and /ask, so it
// reads no account data and never generates text with a model.
export const a2aEndpoint = `${siteUrl}/api/a2a`

export const agentCard = {
  protocolVersion: "0.3.0",
  name: `${siteName} documentation agent`,
  description:
    "Finds the public Sniptide guide that answers a question about setup, authentication, the HTTP API, the CLI or the MCP server, and links its canonical documentation. It reads no account data.",
  url: a2aEndpoint,
  preferredTransport: "JSONRPC",
  additionalInterfaces: [{ url: a2aEndpoint, transport: "JSONRPC" }],
  provider: { organization: siteName, url: siteUrl },
  version: "1.0.0",
  documentationUrl: documentation.home.url,
  iconUrl: `${siteUrl}/web-app-manifest-512x512.png`,
  capabilities: { streaming: false, pushNotifications: false, stateTransitionHistory: false },
  defaultInputModes: ["text/plain"],
  defaultOutputModes: ["text/plain", "application/json"],
  skills: [
    {
      id: "search-docs",
      name: "Search documentation",
      description:
        "Returns the public Sniptide guides that match the words in a question, best match first, with their canonical URLs.",
      tags: ["documentation", "search", "mcp", "authentication"],
      examples: ["How do I authenticate with the Sniptide API?", "Connect the Sniptide MCP server"],
      inputModes: ["text/plain"],
      outputModes: ["text/plain", "application/json"],
    },
  ],
  supportsAuthenticatedExtendedCard: false,
}

type Part = { kind?: string; text?: unknown }
type IncomingMessage = { role?: unknown; parts?: unknown; messageId?: unknown; contextId?: unknown }

function rpc(id: unknown, body: { result: unknown } | { error: unknown }, status = 200) {
  return Response.json({ jsonrpc: "2.0", id: id ?? null, ...body }, { status })
}
function rpcError(id: unknown, code: number, message: string, status = 200) {
  return rpc(id, { error: { code, message } }, status)
}

// Answers one JSON-RPC 2.0 request. Only message/send is implemented: every answer is immediate,
// so there are no tasks to get, cancel or stream.
export function handleA2a(payload: unknown) {
  if (!payload || typeof payload !== "object" || Array.isArray(payload))
    return rpcError(null, -32600, "Send one JSON-RPC 2.0 request object.")
  const { jsonrpc, id, method, params } = payload as {
    jsonrpc?: unknown
    id?: unknown
    method?: unknown
    params?: { message?: IncomingMessage }
  }
  if (jsonrpc !== "2.0" || typeof method !== "string")
    return rpcError(id, -32600, "Send a JSON-RPC 2.0 request with a method.")
  if (method === "tasks/get" || method === "tasks/cancel")
    return rpcError(
      id,
      -32001,
      "Task not found. This agent answers immediately and keeps no tasks.",
    )
  if (method !== "message/send")
    return rpcError(id, -32601, "Method not found. This agent supports message/send.")

  const message = params?.message
  const text = Array.isArray(message?.parts)
    ? (message.parts as Part[])
        .filter((part) => part?.kind === "text" && typeof part.text === "string")
        .map((part) => part.text as string)
        .join(" ")
        .trim()
    : ""
  if (!text) return rpcError(id, -32602, "Send a message with at least one text part.")
  if (text.length > 500) return rpcError(id, -32602, "Use at most 500 characters per question.")

  const results = searchDocuments(text)
    .slice(0, 5)
    .map(({ title, description, canonicalUrl }) => ({
      title,
      description,
      url: canonicalUrl,
    }))
  const summary = results.length
    ? results.map(({ title, url }) => `- ${title}: ${url}`).join("\n")
    : `No public guide matches that question. Start at ${documentation.home.url}.`
  return rpc(id, {
    result: {
      kind: "message",
      role: "agent",
      messageId: randomUUID(),
      ...(typeof message?.contextId === "string" ? { contextId: message.contextId } : {}),
      parts: [
        { kind: "text", text: summary },
        { kind: "data", data: { results } },
      ],
    },
  })
}
