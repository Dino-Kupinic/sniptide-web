import { describe, expect, test } from "bun:test"
import { registerPublicTools } from "./webmcp"

type Tool = { name: string; execute: () => Promise<string> }
const tick = () => new Promise<void>((resolve) => setTimeout(resolve, 0))

describe("public WebMCP tools", () => {
  test("prefers document, returns public guidance, and aborts on cleanup", async () => {
    const tools: Tool[] = []
    const signals: AbortSignal[] = []
    let fallbackCalls = 0
    const cleanup = registerPublicTools(
      {
        modelContext: {
          registerTool: (tool: Tool, { signal }: { signal: AbortSignal }) => {
            tools.push(tool)
            signals.push(signal)
          },
        },
      },
      {
        modelContext: {
          registerTool: () => {
            fallbackCalls++
          },
        },
      },
    )
    await tick()
    expect(fallbackCalls).toBe(0)
    expect(tools.map((tool) => tool.name)).toEqual(["sniptide_setup_guides", "sniptide_mcp_guide"])
    const setup = JSON.parse((await tools[0]?.execute()) ?? "null")
    expect(JSON.stringify(setup)).toContain("https://app.sniptide.com/docs/api")
    expect(JSON.stringify(setup)).toContain("oauth-authorization-server")
    const guide = JSON.parse((await tools[1]?.execute()) ?? "null")
    expect(guide.tools.map((tool: Tool) => tool.name)).toContain("search_snippets")
    expect(guide.tools.map((tool: Tool) => tool.name)).toContain("fetch_collection")
    cleanup()
    expect(signals.every((signal) => signal.aborted)).toBe(true)
  })

  test("falls back to navigator and serializes delayed legacy cleanup across remounts", async () => {
    const active = new Set<string>()
    let finishFirst: () => void = () => {}
    let first = true
    const context = {
      registerTool: async (tool: Tool) => {
        if (first) {
          first = false
          await new Promise<void>((resolve) => {
            finishFirst = resolve
          })
        }
        active.add(tool.name)
      },
      unregisterTool: (name: string) => {
        active.delete(name)
      },
    }
    const stopFirst = registerPublicTools({}, { modelContext: context })
    await tick()
    stopFirst()
    const stopSecond = registerPublicTools({}, { modelContext: context })
    finishFirst()
    await tick()
    expect([...active].sort()).toEqual(["sniptide_mcp_guide", "sniptide_setup_guides"])
    stopSecond()
    await tick()
    expect(active.size).toBe(0)
  })

  test("unsupported hosts and rejected registrations are harmless", async () => {
    registerPublicTools({}, {})()
    let calls = 0
    const cleanup = registerPublicTools(
      {
        modelContext: {
          registerTool: async () => {
            calls++
            throw new Error("unsupported")
          },
        },
      },
      {},
    )
    await tick()
    expect(calls).toBe(2)
    cleanup()
    await tick()
  })
})
