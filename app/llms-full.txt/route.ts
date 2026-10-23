import { llmsFullTxt } from "@/lib/llms"

export const dynamic = "force-static"

export function GET() {
  return new Response(llmsFullTxt, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      // Static routes default to a one-year s-maxage, which Cloudflare would keep after a deploy.
      "Cache-Control": "public, max-age=3600",
    },
  })
}
