import { type NextRequest, NextResponse } from "next/server"
import { headersForUpstream, type RevealBlock, revealBlock } from "@/lib/share-proxy"

export function proxy(request: NextRequest) {
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
