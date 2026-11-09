import type { MetadataRoute } from "next"
import { documentation } from "@/lib/agent-docs"
import { siteUrl } from "@/lib/site"

// Everything on sniptide.com may be crawled. Public pastes are meant to be found, and the app marks
// unlisted and private ones noindex itself. /_site/_next and the app's /_next stay open because
// search engines load their scripts, styles and fonts to render pages. Only /cdn-cgi is closed:
// Cloudflare writes /cdn-cgi/l/email-protection links into pages when its email obfuscation is on,
// and they answer 404 when followed.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/cdn-cgi/",
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
