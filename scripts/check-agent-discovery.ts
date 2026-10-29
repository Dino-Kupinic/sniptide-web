import assert from "node:assert/strict"
import { authDocument, docsDocument, mcpDocument, mcpEndpoint, mcpTools } from "../lib/agent-docs"
import { siteUrl } from "../lib/site"

const origin = new URL(process.argv[2] ?? "http://127.0.0.1:3193")

async function read(path: string, contentType: string) {
  const response = await fetch(new URL(path, origin), { signal: AbortSignal.timeout(30_000) })
  assert.equal(response.status, 200, `${path} status`)
  assert.ok(response.headers.get("content-type")?.includes(contentType), `${path} content type`)
  return response.text()
}

for (const document of [docsDocument, mcpDocument, authDocument]) {
  const html = await read(document.path, "text/html")
  assert.ok(html.includes(`<h1`), `${document.path} heading`)
  assert.ok(html.includes(document.title), `${document.path} title`)
  assert.ok(html.includes(`href="${siteUrl}${document.path}"`), `${document.path} canonical`)
  for (const section of document.sections) {
    assert.ok(html.includes(section.title), `${document.path} section ${section.title}`)
    for (const { href } of section.links ?? []) {
      if (href.startsWith(`${siteUrl}/`)) {
        const linked = await fetch(new URL(new URL(href).pathname, origin), {
          signal: AbortSignal.timeout(30_000),
        })
        assert.equal(linked.status, 200, `${document.path} links to ${href}`)
      }
    }
  }
  console.log(
    `PASS ${document.path} has server-rendered content, canonical, and working local links`,
  )
}

const auth = await read("/auth.md", "text/markdown")
assert.ok(auth.startsWith(`# ${authDocument.title}\n`))
assert.ok(auth.includes("Authorization: Bearer"))
assert.ok(auth.includes("oauth-protected-resource"))
for (const { title, paragraphs, items, code } of authDocument.sections) {
  assert.ok(auth.includes(`## ${title}`))
  for (const value of [...(paragraphs ?? []), ...(items ?? []), ...(code ? [code] : [])]) {
    assert.ok(auth.includes(value), `${title} content matches HTML source`)
  }
}
const manifest = JSON.parse(await read("/.well-known/mcp.json", "application/json"))
const server = manifest.servers[0]
assert.equal(server.url, mcpEndpoint)
assert.equal(server.transport, "streamable-http")
assert.equal(server.authentication.type, "oauth2")
assert.equal(server.authentication.documentation, `${siteUrl}/auth.md`)
const card = JSON.parse(await read(new URL(server.card).pathname, "application/json"))
assert.ok(card.remotes.some((remote: { url: string }) => remote.url === server.url))
assert.ok(
  card.remotes[0].headers.some(
    (header: { name: string; isRequired: boolean }) =>
      header.name === "Authorization" && !header.isRequired,
  ),
)

const robots = await read("/robots.txt", "text/plain")
assert.ok(robots.includes("User-Agent: *\nAllow: /"))
assert.ok(robots.includes(`Sitemap: ${siteUrl}/sitemap.xml`))
const sitemap = await read("/sitemap.xml", "xml")
for (const document of [docsDocument, mcpDocument, authDocument]) {
  assert.ok(sitemap.includes(`<loc>${siteUrl}${document.path}</loc>`))
}
for (const path of ["/llms.txt", "/llms-full.txt"]) {
  const text = await read(path, "text/plain")
  for (const discovery of ["/docs", "/auth.md", "/.well-known/mcp.json"]) {
    assert.ok(text.includes(`${siteUrl}${discovery}`))
    assert.ok(robots.includes(`${siteUrl}${discovery}`))
  }
  for (const { name } of mcpTools) assert.ok(text.includes(name), `${path} includes ${name}`)
}
console.log("PASS auth.md, MCP manifest/card, robots, sitemap, and both llms files")
