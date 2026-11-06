import { jsonFeedPath, renderJsonFeed } from "@/lib/blog"
import { getPosts } from "@/lib/blog-source"
import { siteUrl } from "@/lib/site"

export const dynamic = "force-static"

export function GET() {
  return new Response(JSON.stringify(renderJsonFeed(getPosts()), null, 2), {
    headers: {
      "Content-Type": "application/feed+json; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
      Link: `<${siteUrl}${jsonFeedPath}>; rel="self"`,
    },
  })
}
