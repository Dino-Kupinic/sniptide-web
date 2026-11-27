import { getStatusReport } from "@/lib/app-status"

// The footer's status line reads this. The home page is cached for an hour, so the status comes
// from here instead of being rendered into the page.
export async function GET() {
  const report = await getStatusReport()
  return Response.json(report, {
    headers: { "Cache-Control": "public, max-age=60, stale-while-revalidate=60" },
  })
}
