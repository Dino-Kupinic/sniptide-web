import { type NextRequest, NextResponse } from "next/server"
import { isAiAgent, prefersMarkdown } from "@/lib/accept"
import { agentDocuments, markdownPath, renderMarkdown } from "@/lib/agent-docs"
import { headersForUpstream, type RevealBlock, revealBlock } from "@/lib/share-proxy"
import { appBase, siteUrl } from "@/lib/site"

export function proxy(request: NextRequest) {
  const doc = agentDocuments.find((item) => item.path === request.nextUrl.pathname)
  if (doc && (request.method === "GET" || request.method === "HEAD")) {
    const acceptsMarkdown =
      prefersMarkdown(request.headers.get("accept")) || isAiAgent(request.headers.get("user-agent"))
    const links = `<${doc.canonicalUrl}>; rel="canonical", <${siteUrl}${markdownPath(doc.path)}>; rel="alternate"; type="text/markdown", <${siteUrl}/.well-known/ard.json>; rel="ard", <${siteUrl}/.well-known/api-catalog>; rel="api-catalog", <${siteUrl}/sitemap.xml>; rel="sitemap", <${appBase}/api/openapi.json>; rel="service-desc"; type="application/json"`
    const response =
      acceptsMarkdown || request.nextUrl.searchParams.get("mode") === "agent"
        ? new NextResponse(request.method === "HEAD" ? null : renderMarkdown(doc), {
            headers: {
              "Content-Type": "text/markdown; charset=utf-8",
              "Cache-Control": "public, max-age=3600",
            },
          })
        : NextResponse.next({ request: { headers: headersForUpstream(request.headers) } })
    if (!acceptsMarkdown && request.nextUrl.searchParams.get("mode") !== "agent")
      response.headers.set("Cache-Control", "private, no-store")
    response.headers.set("Vary", "Accept, User-Agent")
    response.headers.set("Link", links)
    return response
  }
  // POST /<slug>/reveal is the only request that burns a paste, and the rewrite proxies it.
  // Preview bots and cross-site posts are answered here so they never reach the app.
  const blocked = revealBlock(request.nextUrl.pathname, request.method, request.headers)
  if (blocked) return revealResponse(blocked)

  // Every other unknown path is proxied by the fallback rewrite. Attach the visitor address when
  // SHARE_PROXY_SECRET is set, and drop any copy of these headers the visitor sent.
  return NextResponse.next({
    request: { headers: headersForUpstream(request.headers) },
  })
}

function revealResponse(blocked: RevealBlock) {
  const headers = new Headers({ "cache-control": "private, no-store" })
  if (blocked.status === 405) headers.set("allow", "POST")
  return new NextResponse(null, { status: blocked.status, headers })
}

export const config = {
  // Own assets live under /_site. Everything else may be proxied, including the app's /_next files.
  matcher: ["/((?!_site/).*)"],
}
