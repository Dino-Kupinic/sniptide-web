import type { MetadataRoute } from "next"
import { siteUrl } from "@/lib/site"

// Everything on sniptide.com may be crawled. Public pastes are meant to be found, and the app marks
// unlisted and private ones noindex itself, so there is nothing to block here.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      other: {
        schemamap: `${siteUrl}/schemamap.xml`,
        Agentmap: `${siteUrl}/.well-known/ard.json`,
        "# Agent index": `${siteUrl}/llms.txt`,
        "# Documentation": `${siteUrl}/docs`,
        "# MCP manifest": `${siteUrl}/.well-known/mcp.json`,
        "# Authentication": `${siteUrl}/auth.md`,
      },
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
