import { feedPath, renderFeed } from "@/lib/blog"
import { getPosts } from "@/lib/blog-source"
import { siteUrl } from "@/lib/site"

export const dynamic = "force-static"

export function GET() {
  return new Response(renderFeed(getPosts()), {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
      Link: `<${siteUrl}${feedPath}>; rel="self"`,
    },
  })
}
