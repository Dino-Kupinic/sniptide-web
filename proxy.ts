import { type NextRequest, NextResponse } from "next/server"
import { links } from "@/lib/links"
import { headersForUpstream, type RevealBlock, revealBlock } from "@/lib/share-proxy"

// Signed-in visitors skip the landing page and go straight to the app. The app sets its session
// cookie for the whole domain (COOKIE_DOMAIN), so sniptide.com sees it too. Only its presence is
// checked here; the app validates the session, and a stale cookie just lands on its sign-in page.
// Share links (sniptide.com/<slug>) are not touched, only the landing page at "/".
const SESSION_COOKIES = ["better-auth.session_token", "__Secure-better-auth.session_token"]

export function proxy(request: NextRequest) {
  if (
    request.nextUrl.pathname === "/" &&
    SESSION_COOKIES.some((name) => request.cookies.has(name))
  ) {
    return NextResponse.redirect(links.dashboard)
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
