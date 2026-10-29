import { expect, test } from "bun:test"
import { createHash } from "node:crypto"
import { NextRequest } from "next/server"
import { GET as agentCard } from "@/app/.well-known/agent-card.json/route"
import { GET as skillIndex } from "@/app/.well-known/agent-skills/index.json/route"
import { GET as ard } from "@/app/.well-known/ard.json/route"
import { POST as a2a } from "@/app/api/a2a/route"
import { POST as mcp } from "@/app/api/mcp/route"
import { GET as auth } from "@/app/auth.md/route"
import { GET as skillsLlms } from "@/app/skills/llms.txt/route"
import { proxy } from "@/proxy"
import { isAiAgent } from "./accept"
import { llmsTxt } from "./llms"

const post = (url: string, body: unknown) =>
  new Request(url, {
    method: "POST",
    headers: { "content-type": "application/json", accept: "application/json, text/event-stream" },
    body: JSON.stringify(body),
  })

test("auth.md opens with its heading", async () => {
  expect((await auth().text()).startsWith("# ")).toBe(true)
})

test("the skills index follows schema v0.2.0 with digests of the served files", async () => {
  const index = await skillIndex().json()
  expect(index.$schema).toBe("https://schemas.agentskills.io/discovery/0.2.0/schema.json")
  for (const skill of index.skills) {
    expect(skill.type).toBe("skill-md")
    const bytes = await Bun.file(`public/skills/${skill.name}/SKILL.md`).arrayBuffer()
    const hex = createHash("sha256").update(new Uint8Array(bytes)).digest("hex")
    expect(skill.digest).toBe(`sha256:${hex}`)
  }
})

test("the root llms.txt links the skills section index", async () => {
  expect(llmsTxt).toContain("https://sniptide.com/skills/llms.txt")
  expect(await skillsLlms().text()).toContain("https://sniptide.com/skills/reuse-snippets/SKILL.md")
})

test("every ARD entry names its publisher", async () => {
  const { entries } = await ard().json()
  for (const entry of entries) expect(entry.trustManifest.identity.domain).toBe("sniptide.com")
})

test("the A2A agent answers message/send with guide links", async () => {
  const card = await agentCard().json()
  expect(card.url).toBe("https://sniptide.com/api/a2a")
  const response = await a2a(
    post(card.url, {
      jsonrpc: "2.0",
      id: 7,
      method: "message/send",
      params: {
        message: {
          kind: "message",
          role: "user",
          messageId: "m1",
          parts: [{ kind: "text", text: "How do I authenticate?" }],
        },
      },
    }),
  )
  const body = await response.json()
  expect(body.id).toBe(7)
  expect(body.result.role).toBe("agent")
  expect(body.result.parts[0].text).toContain("https://sniptide.com/auth.md")
  const unknown = await (
    await a2a(post(card.url, { jsonrpc: "2.0", id: 8, method: "tasks/resubscribe" }))
  ).json()
  expect(unknown.error.code).toBe(-32601)
})

test("the documentation MCP states instructions, annotations and JSON-RPC errors", async () => {
  const call = (method: string, params: unknown) =>
    mcp(post("https://sniptide.com/api/mcp", { jsonrpc: "2.0", id: 1, method, params }))
  const init = await (
    await call("initialize", {
      protocolVersion: "2025-06-18",
      capabilities: {},
      clientInfo: { name: "test", version: "1" },
    })
  ).json()
  expect(init.result.instructions).toContain("search_docs")
  const { result } = await (await call("tools/list", {})).json()
  for (const tool of result.tools) expect(tool.annotations.readOnlyHint).toBe(true)
  const unknown = await (await call("tools/call", { name: "nope", arguments: {} })).json()
  expect(unknown.error).toMatchObject({ code: -32602, message: "Unknown tool: nope." })
  const invalid = await (await call("tools/call", { name: "search_docs", arguments: {} })).json()
  expect(invalid.error.code).toBe(-32602)
  expect(invalid.error.data.issues[0].path).toEqual(["query"])
})

test("AI user agents get Markdown and search crawlers get HTML", async () => {
  expect(isAiAgent("Mozilla/5.0 (compatible; ClaudeBot/1.0; +claudebot@anthropic.com)")).toBe(true)
  expect(isAiAgent("Mozilla/5.0 AppleWebKit/537.36; compatible; ChatGPT-User/1.0")).toBe(true)
  expect(isAiAgent("Mozilla/5.0 (compatible; Googlebot/2.1)")).toBe(false)
  const response = proxy(
    new NextRequest("https://sniptide.com/docs", {
      headers: { accept: "text/html", "user-agent": "ClaudeBot/1.0" },
    }),
  )
  expect(response.headers.get("content-type")).toContain("text/markdown")
  expect(response.headers.get("vary")).toContain("User-Agent")
  expect(await response.text()).toContain("# Sniptide developer docs")
})
