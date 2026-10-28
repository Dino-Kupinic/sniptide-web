import { expect, test } from "bun:test"
import { GET as getCard } from "@/app/.well-known/mcp/server-card.json/route"
import { GET as getManifest } from "@/app/.well-known/mcp.json/route"
import { GET as getAuth } from "@/app/auth.md/route"
import robots from "@/app/robots"
import sitemap from "@/app/sitemap"
import { llmsFullTxt, llmsTxt } from "@/lib/llms"
import { siteUrl } from "@/lib/site"

test("agents discover the same authenticated HTTP server documented for clients", async () => {
  const response = getManifest()
  expect(response.headers.get("content-type")).toContain("application/json")
  const manifest = await response.json()
  expect(manifest.servers[0]).toMatchObject({
    url: "https://app.sniptide.com/api/mcp",
    transport: "streamable-http",
    authentication: { type: "bearer", documentation: `${siteUrl}/auth.md` },
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
  expect(card.remotes[0].headers[0].isRequired).toBe(true)
})

test("auth.md gives a token walkthrough without promising agent OAuth", async () => {
  const response = getAuth()
  expect(response.headers.get("content-type")).toBe("text/markdown; charset=utf-8")
  const body = await response.text()
  expect(body).toContain("# Sniptide agent authentication\n")
  for (const value of [
    "https://app.sniptide.com/settings?tab=api",
    "Authorization: Bearer",
    "/api/v1/me",
    "read",
    "write",
    "401",
    "403",
    "429",
    "revok",
    "does not support OAuth",
  ])
    expect(body).toContain(value)
})

test("crawler indexes link the public docs and machine-readable entry points", () => {
  const sitemapUrls = sitemap().map(({ url }) => url)
  const robotHints = JSON.stringify(robots())
  for (const path of ["/docs", "/docs/mcp", "/docs/auth"]) {
    expect(sitemapUrls).toContain(`${siteUrl}${path}`)
  }
  for (const path of ["/docs", "/llms.txt", "/.well-known/mcp.json", "/auth.md"]) {
    expect(robotHints).toContain(`${siteUrl}${path}`)
    if (path !== "/llms.txt") expect(llmsTxt).toContain(`${siteUrl}${path}`)
    expect(llmsFullTxt).toContain(`${siteUrl}${path}`)
  }
  expect(llmsFullTxt).not.toContain("no OAuth login or discovery yet")
})
