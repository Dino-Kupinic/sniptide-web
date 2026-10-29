import { expect, test } from "bun:test"
import { NextRequest } from "next/server"
import { GET as skillIndex } from "@/app/.well-known/agent-skills/index.json/route"
import { GET as catalog } from "@/app/.well-known/api-catalog/route"
import { POST as mcp } from "@/app/api/mcp/route"
import { POST as ask } from "@/app/ask/route"
import { GET as sectionIndex } from "@/app/docs/llms.txt/route"
import { prefersMarkdown } from "@/lib/accept"
import { agentDocuments, renderMarkdown } from "@/lib/agent-docs"
import { agentSkills } from "@/lib/skills"
import { proxy } from "@/proxy"

test("public documents have canonical Markdown and negotiation preserves share paths", () => {
  for (const doc of agentDocuments) {
    expect(renderMarkdown(doc)).toContain(
      `canonical: https://sniptide.com${doc.path === "/" ? "" : doc.path}`,
    )
    const response = proxy(
      new NextRequest(`https://sniptide.com${doc.path}`, { headers: { accept: "text/markdown" } }),
    )
    expect(response.headers.get("content-type")).toContain("text/markdown")
    expect(response.headers.get("vary")).toContain("Accept")
  }
  expect(
    proxy(
      new NextRequest("https://sniptide.com/a-paste", { headers: { accept: "text/markdown" } }),
    ).headers.get("x-middleware-rewrite"),
  ).toBeNull()
  expect(
    proxy(
      new NextRequest("https://sniptide.com/", { headers: { accept: "text/markdown;q=0" } }),
    ).headers.get("x-middleware-rewrite"),
  ).toBeNull()
})

test("NLWeb returns matching public documents in JSON and SSE", async () => {
  const request = (accept: string) =>
    new Request("https://sniptide.com/ask", {
      method: "POST",
      headers: { "content-type": "application/json", accept },
      body: JSON.stringify({ query: { text: "authentication token" } }),
    })
  const json = await (await ask(request("application/json"))).json()
  expect(json._meta.version).toBe("0.55")
  expect(json.results.some((result: { url: string }) => result.url.endsWith("/auth.md"))).toBe(true)
  const stream = await (await ask(request("text/event-stream"))).text()
  expect(stream).toContain("event: start")
  expect(stream).toContain("event: result")
  expect(stream).toContain("event: complete")
})

test("public MCP initializes and lists tools", async () => {
  const call = (method: string, params: object) =>
    mcp(
      new Request("https://sniptide.com/api/mcp", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          accept: "application/json, text/event-stream",
        },
        body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
      }),
    )
  const init = await (
    await call("initialize", {
      protocolVersion: "2025-06-18",
      capabilities: {},
      clientInfo: { name: "test", version: "1" },
    })
  ).json()
  expect(init.result.serverInfo.name).toBe("sniptide-public-docs")
  const list = await (await call("tools/list", {})).json()
  expect(list.result.tools.map((tool: { name: string }) => tool.name)).toContain("read_doc")
  const read = await (
    await call("tools/call", { name: "read_doc", arguments: { path: "/auth.md" } })
  ).json()
  expect(read.result.content[0].text).toContain("## Discover")
})

test("portable skill and published skill have identical contents", async () => {
  for (const skill of agentSkills) {
    const source = await Bun.file(`skills/${skill.name}/SKILL.md`).text()
    expect(await Bun.file(`public/skills/${skill.name}/SKILL.md`).text()).toBe(source)
    expect(source).toContain(`name: ${skill.name}\n`)
    expect(source).toContain(`description: ${skill.description}\n`)
  }
})

test("Markdown negotiation respects preferences, exclusions and HEAD", async () => {
  expect(prefersMarkdown("text/markdown;q=0.2, text/html;q=1")).toBe(false)
  expect(prefersMarkdown("text/html;q=0.5, text/markdown")).toBe(true)
  expect(prefersMarkdown("text/markdown;q=0")).toBe(false)
  expect(prefersMarkdown("text/markdown;q=invalid")).toBe(false)
  expect(prefersMarkdown("text/markdown;q=2")).toBe(false)
  const response = proxy(new NextRequest("https://sniptide.com/?mode=agent", { method: "HEAD" }))
  expect(response.headers.get("content-type")).toContain("text/markdown")
  expect(response.headers.get("link")).toContain('rel="service-desc"')
  expect(response.headers.get("link")).toContain('rel="sitemap"')
  expect(await response.text()).toBe("")
})

test("discovery indexes point to real capabilities", async () => {
  const response = catalog()
  expect(response.headers.get("link")).toContain('rel="api-catalog"')
  expect(response.headers.get("content-type")).toContain("application/linkset+json")
  expect((await response.json()).linkset[0].item[0].href).toBe("https://app.sniptide.com/api/v1/me")
  expect((await skillIndex().json()).skills).toEqual(agentSkills)
  expect(await sectionIndex().text()).toContain("https://sniptide.com/auth.md")
  for (const path of ["/about", "/contact"]) {
    const document = agentDocuments.find((doc) => doc.path === path)
    expect(document).toBeDefined()
    expect(
      document?.sections.flatMap((section) => section.paragraphs ?? []).join(" ").length,
    ).toBeGreaterThan(500)
  }
})

test("NLWeb validates malformed preferences and streams failures on request", async () => {
  const call = (body: unknown) =>
    ask(new Request("https://sniptide.com/ask", { method: "POST", body: JSON.stringify(body) }))
  for (const input of [
    null,
    [],
    { query: { text: "token" }, prefer: { streaming: "false" } },
    { query: { text: "token" }, prefer: { mode: 0 } },
  ]) {
    const response = await call(input)
    expect(response.status).toBe(400)
    expect((await response.json()).error.code).toBe("INVALID_QUERY")
  }
  const response = await call({ query: { text: "authentication" }, prefer: { streaming: true } })
  expect(response.headers.get("content-type")).toContain("text/event-stream")
  expect(await response.text()).toContain("event: result")
  const none = await call({ query: { text: "zzzzunmatchedquery" }, prefer: { streaming: true } })
  const events = await none.text()
  expect(events).toContain("event: error")
  expect(events).toContain('"code":"NO_RESULTS"')
  expect(events).toContain("event: complete")
  const oversized = await call({ query: { text: "token" }, padding: "x".repeat(17000) })
  expect(oversized.status).toBe(413)
})
