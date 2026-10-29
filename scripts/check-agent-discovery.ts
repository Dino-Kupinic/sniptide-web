import assert from "node:assert/strict"
import { documentation, mcpEndpoint } from "../lib/agent-docs"
import { siteUrl } from "../lib/site"

const origin = new URL(process.argv[2] ?? "http://127.0.0.1:3193")

async function read(path: string, contentType: string, canonicalUrl?: string) {
  const response = await fetch(new URL(path, origin), { signal: AbortSignal.timeout(30_000) })
  assert.equal(response.status, 200, `${path} status`)
  assert.ok(response.headers.get("content-type")?.includes(contentType), `${path} content type`)
  if (canonicalUrl)
    assert.ok(
      response.headers.get("link")?.includes(`<${canonicalUrl}>; rel="canonical"`),
      `${path} canonical header`,
    )
  return response.text()
}

for (const [path, destination] of [
  ["/docs", documentation.home.url],
  ["/docs/mcp", documentation.mcp.url],
  ["/docs/auth", documentation.oauth.url],
]) {
  for (const suffix of ["", "/", "?from=agent"]) {
    const response = await fetch(new URL(`${path}${suffix}`, origin), {
      redirect: "manual",
      signal: AbortSignal.timeout(30_000),
    })
    assert.equal(response.status, 308, `${path}${suffix} status`)
    assert.equal(
      response.headers.get("location"),
      new URL(`${destination}${suffix === "?from=agent" ? suffix : ""}`).href,
    )
  }
}
const auth = await read("/auth.md", "text/markdown", documentation.oauth.url)
for (const link of [documentation.oauth, documentation.apiTokens, documentation.mcp])
  assert.ok(auth.includes(link.url))
for (const [path, canonicalUrl] of [
  ["/docs.md", documentation.home.url],
  ["/docs/mcp.md", documentation.mcp.url],
  ["/docs/auth.md", documentation.oauth.url],
] as const) {
  const body = await read(path, "text/markdown", canonicalUrl)
  assert.ok(body.includes(`canonical: ${canonicalUrl}`), `${path} canonical frontmatter`)
  assert.ok(body.includes(canonicalUrl), `${path} canonical guide link`)
  assert.ok(!body.includes("code_challenge_method"), `${path} contains no copied auth instructions`)
}
for (const path of ["/about", "/contact"]) {
  const html = await read(path, "text/html", `${siteUrl}${path}`)
  assert.ok(html.includes("<h1"), `${path} heading`)
  assert.ok(html.includes(documentation.home.url), `${path} canonical documentation navigation`)
}
const manifest = JSON.parse(await read("/.well-known/mcp.json", "application/json"))
const server = manifest.servers[0]
assert.equal(server.url, mcpEndpoint)
assert.equal(server.transport, "streamable-http")
assert.equal(server.authentication.type, "oauth2")
assert.deepEqual(server.authentication.alternatives, ["bearer"])
assert.equal(server.authentication.documentation, documentation.oauth.url)
const card = JSON.parse(await read(new URL(server.card).pathname, "application/json"))
assert.equal(card.remotes[0].url, server.url)
assert.equal(card.remotes[0].headers[0].isRequired, false)
const docsServer = manifest.servers.find(
  (entry: { url: string }) => entry.url === `${siteUrl}/api/mcp`,
)
assert.ok(docsServer, "public documentation MCP remains discoverable")
assert.equal(docsServer.documentation, documentation.home.url)
assert.equal(docsServer.authentication.type, "none")
const docsCard = JSON.parse(
  await read("/.well-known/mcp/docs-server-card.json", "application/json"),
)
assert.equal(docsCard.websiteUrl, documentation.home.url)
const agentCard = JSON.parse(await read("/.well-known/agent-card.json", "application/json"))
assert.equal(agentCard.documentationUrl, documentation.home.url)
const ard = JSON.parse(await read("/.well-known/ard.json", "application/json"))
assert.ok(
  ard.entries.some(
    (entry: { url: string }) => entry.url === `${siteUrl}/.well-known/mcp/docs-server-card.json`,
  ),
)
const catalog = JSON.parse(await read("/.well-known/api-catalog", "application/linkset+json"))
assert.equal(catalog.linkset[1]["service-doc"][0].href, "https://app.sniptide.com/docs/api")
for (const path of ["/docs/llms.txt", "/skills/llms.txt"])
  assert.ok(
    (await read(path, "text/plain")).includes(documentation.mcp.url),
    `${path} canonical setup link`,
  )

async function post(path: string, body: unknown, accept = "application/json") {
  const response = await fetch(new URL(path, origin), {
    method: "POST",
    headers: { "Content-Type": "application/json", accept },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(30_000),
  })
  assert.equal(response.status, 200, `${path} status`)
  return response
}
const answer = await (await post("/ask", { query: { text: "OAuth" } })).json()
assert.ok(answer.results.some((item: { url: string }) => item.url === documentation.oauth.url))
const events = await (await post("/ask", { query: { text: "OAuth" } }, "text/event-stream")).text()
assert.ok(events.includes("event: result"))
assert.ok(events.includes("event: complete"))
const a2a = await (
  await post("/api/a2a", {
    jsonrpc: "2.0",
    id: 1,
    method: "message/send",
    params: {
      message: { role: "user", messageId: "smoke", parts: [{ kind: "text", text: "OAuth" }] },
    },
  })
).json()
assert.ok(a2a.result.parts[0].text.includes(documentation.oauth.url))
const mcp = await (
  await post(
    "/api/mcp",
    {
      jsonrpc: "2.0",
      id: 1,
      method: "tools/call",
      params: { name: "read_doc", arguments: { path: "/auth.md" } },
    },
    "application/json, text/event-stream",
  )
).json()
assert.ok(mcp.result.content[0].text.includes(documentation.oauth.url))

const robots = await read("/robots.txt", "text/plain")
assert.ok(robots.includes(documentation.home.url))
const sitemap = await read("/sitemap.xml", "xml")
for (const path of ["/docs", "/docs/mcp", "/docs/auth"])
  assert.ok(!sitemap.includes(`<loc>${siteUrl}${path}</loc>`))
for (const path of ["/llms.txt", "/llms-full.txt"]) {
  const text = await read(path, "text/plain")
  assert.ok(text.includes(documentation.mcp.url))
  assert.ok(text.includes(`${siteUrl}/.well-known/mcp.json`))
}
console.log(
  "PASS redirects, canonical Markdown indexes, public agent protocols, discovery, robots, sitemap, and llms indexes",
)
