import { competitorData } from "@/lib/compare"

// The public competitor data file at /compare/competitors.json (rewritten here in next.config.ts),
// so anyone can check a comparison page's facts, sources and check dates.
export const dynamic = "force-static"

export function GET() {
  return Response.json(competitorData, {
    headers: { "Cache-Control": "public, max-age=3600", "Access-Control-Allow-Origin": "*" },
  })
}
