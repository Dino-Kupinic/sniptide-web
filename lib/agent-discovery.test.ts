import { expect, test } from "bun:test"
import { GET as getCard } from "@/app/.well-known/mcp/server-card.json/route"
import { GET as getManifest } from "@/app/.well-known/mcp.json/route"
import { GET as getAuth } from "@/app/auth.md/route"
import { GET as getAuthMarkdown } from "@/app/docs/auth.md/route"
import { GET as getMcpMarkdown } from "@/app/docs/mcp.md/route"
import { GET as getDocsMarkdown } from "@/app/docs.md/route"
import robots from "@/app/robots"
import sitemap from "@/app/sitemap"
import { documentation } from "@/lib/agent-docs"
import { llmsFullTxt, llmsTxt } from "@/lib/llms"
import { siteUrl } from "@/lib/site"

test("agents discover the same authenticated HTTP server documented for clients", async () => {
  const response = getManifest()
  expect(response.headers.get("content-type")).toContain("application/json")
  const manifest = await response.json()
  expect(manifest.servers[0]).toMatchObject({
    url: "https://app.sniptide.com/api/mcp",
    transport: "streamable-http",
    authentication: {
      type: "oauth2",
      protectedResourceMetadata:
        "https://app.sniptide.com/.well-known/oauth-protected-resource/api/mcp",
      documentation: documentation.oauth.url,
    },
  })
  expect(JSON.stringify(manifest)).not.toContain("YOUR_PERSONAL_API_TOKEN")
  expect(manifest.servers[0].card).toBe(`${siteUrl}/.well-known/mcp/server-card.json`)
  const card = await getCard().json()
  expect(card.remotes[0]).toMatchObject({ type: "streamable-http", url: manifest.servers[0].url })
  expect(card._meta["com.sniptide/auth"]).toEqual(manifest.servers[0].authentication)
  expect(card.$schema).toBe(
    "https://static.modelcontextprotocol.io/schemas/v1/server-card.schema.json",
  )
  expect(card.remotes[0].headers[0].variables.token.isSecret).toBe(true)
  expect(card.remotes[0].headers[0].isRequired).toBe(false)
})

test("auth.md links canonical authentication guides", async () => {
  const response = getAuth()
  expect(response.headers.get("content-type")).toBe("text/markdown; charset=utf-8")
  expect(response.headers.get("link")).toContain(`<${documentation.oauth.url}>; rel="canonical"`)
  const body = await response.text()
  expect(body.startsWith("# Sniptide agent authentication\n")).toBe(true)
  for (const link of [documentation.oauth, documentation.apiTokens, documentation.mcp])
    expect(body).toContain(link.url)
  expect(body).not.toContain("Authorization: Bearer")
  expect(body).not.toContain("code_challenge_method")
})

test("crawler indexes link canonical docs and omit redirected pages", () => {
  const sitemapUrls = sitemap().map(({ url }) => url)
  const robotHints = JSON.stringify(robots())
  for (const path of ["/docs", "/docs/mcp", "/docs/auth"])
    expect(sitemapUrls).not.toContain(`${siteUrl}${path}`)
  expect(robotHints).toContain(documentation.home.url)
  for (const text of [llmsTxt, llmsFullTxt]) {
    expect(text).toContain(documentation.mcp.url)
    expect(text).toContain(documentation.oauth.url)
    expect(text).toContain(`${siteUrl}/.well-known/mcp.json`)
    expect(text).not.toContain("does not support OAuth")
  }
})

test("legacy Markdown routes remain small indexes with canonical headers and frontmatter", async () => {
  for (const [get, canonical] of [
    [getDocsMarkdown, "https://docs.sniptide.com"],
    [getMcpMarkdown, "https://docs.sniptide.com/mcp"],
    [getAuthMarkdown, "https://docs.sniptide.com/oauth"],
  ] as const) {
    const response = get()
    expect(response.headers.get("content-type")).toBe("text/markdown; charset=utf-8")
    expect(response.headers.get("link")).toBe(`<${canonical}>; rel="canonical"`)
    const body = await response.text()
    expect(body).toContain(`canonical: ${canonical}\n`)
    expect(body.length).toBeLessThan(2000)
    expect(body).not.toContain("mcpServers")
    expect(body).not.toContain("code_challenge_method")
    expect(body).not.toContain("search_snippets")
  }
})
