import { visitorCountry } from "@/lib/posthog"

// The visitor's country for cookieless PostHog events (lib/tracking.ts). The answer differs per
// visitor, so nothing may cache it.
export const dynamic = "force-dynamic"

export function GET(request: Request) {
  return Response.json(
    { country: visitorCountry(request.headers) },
    { headers: { "cache-control": "private, no-store" } },
  )
}
