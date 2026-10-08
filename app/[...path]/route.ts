import { appUrl } from "@/lib/links"

// Anything this site doesn't have a page for belongs to the app: share links (sniptide.com/k7Qe2x),
// raw files, /sign-in bookmarks. Send them to the same path on the app's domain. Real pages always
// win over this catch-all, so new pages need no changes here.
function toApp(request: Request) {
  const { pathname, search } = new URL(request.url)
  return Response.redirect(`${appUrl}${pathname}${search}`, 308)
}

export const GET = toApp
export const HEAD = toApp
