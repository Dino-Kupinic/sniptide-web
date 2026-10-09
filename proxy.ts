import { type NextRequest, NextResponse } from "next/server"
import { links } from "@/lib/links"

// Signed-in visitors skip the landing page and go straight to the app. The app sets its session
// cookie for the whole domain (COOKIE_DOMAIN), so sniptide.com sees it too. Only its presence is
// checked here; the app validates the session, and a stale cookie just lands on its sign-in page.
// Share links (sniptide.com/<slug>) are not touched, only the landing page at "/".
const SESSION_COOKIES = ["better-auth.session_token", "__Secure-better-auth.session_token"]

export function proxy(request: NextRequest) {
  if (SESSION_COOKIES.some((name) => request.cookies.has(name))) {
    return NextResponse.redirect(links.dashboard)
  }

  return NextResponse.next()
}

export const config = { matcher: "/" }
