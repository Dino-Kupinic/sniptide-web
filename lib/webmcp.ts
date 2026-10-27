import { authDocument, docsDocument, mcpDocument, mcpTools } from "@/lib/agent-docs"

type PublicTool = {
  name: string
  description: string
  inputSchema: { type: "object"; properties: Record<string, never> }
  annotations: { readOnlyHint: true }
  execute: () => Promise<string>
}

type ModelContext = {
  registerTool: (tool: PublicTool, options: { signal: AbortSignal }) => Promise<void> | void
  unregisterTool?: (name: string) => Promise<void> | void
}

type Capability = { modelContext?: ModelContext }

const tools: PublicTool[] = [
  {
    name: "sniptide_setup_guides",
    description: "Get public Sniptide setup, authentication, CLI, and API documentation.",
    inputSchema: { type: "object", properties: {} },
    annotations: { readOnlyHint: true },
    execute: async () => JSON.stringify({ docs: docsDocument, authentication: authDocument }),
  },
  {
    name: "sniptide_mcp_guide",
    description: "Get the public Sniptide MCP setup guide and supported tools.",
    inputSchema: { type: "object", properties: {} },
    annotations: { readOnlyHint: true },
    execute: async () => JSON.stringify({ guide: mcpDocument, tools: mcpTools }),
  },
]

// A later mount waits for the previous mount's legacy cleanup before reusing tool names.
const lifetimes = new WeakMap<ModelContext, Promise<void>>()

export function registerPublicTools(documentHost: unknown, navigatorHost: unknown): () => void {
  const document = documentHost as Capability
  const navigator = navigatorHost as Capability
  const context =
    typeof document.modelContext?.registerTool === "function"
      ? document.modelContext
      : typeof navigator.modelContext?.registerTool === "function"
        ? navigator.modelContext
        : undefined
  if (!context) return () => {}

  const legacy = context === navigator.modelContext && context !== document.modelContext
  const controller = new AbortController()
  let release: () => void = () => {}
  const stopped = new Promise<void>((resolve) => {
    release = resolve
  })
  const previous = lifetimes.get(context) ?? Promise.resolve()
  const lifetime = previous.then(async () => {
    const registered: string[] = []
    for (const tool of tools) {
      if (controller.signal.aborted) break
      try {
        await context.registerTool(tool, { signal: controller.signal })
        registered.push(tool.name)
      } catch {}
    }
    await stopped
    if (legacy && context.unregisterTool) {
      for (const name of registered) {
        try {
          await context.unregisterTool(name)
        } catch {
          // A host may already have removed the tool on abort.
        }
      }
    }
  })
  lifetimes.set(context, lifetime)
  void lifetime.then(() => {
    if (lifetimes.get(context) === lifetime) lifetimes.delete(context)
  })
  return () => {
    controller.abort()
    release()
  }
}
