import type { MetadataRoute } from "next"
import { documentation } from "@/lib/agent-docs"
import { siteUrl } from "@/lib/site"

// Public pastes remain crawlable. Cloudflare’s email protection endpoint is edge infrastructure.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/cdn-cgi/l/email-protection",
      other: {
        schemamap: `${siteUrl}/schemamap.xml`,
        Agentmap: `${siteUrl}/.well-known/ard.json`,
        "# Agent index": `${siteUrl}/llms.txt`,
        "# Documentation": documentation.home.url,
        "# MCP manifest": `${siteUrl}/.well-known/mcp.json`,
        "# Authentication": documentation.apiTokens.url,
      },
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
