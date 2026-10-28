import { siteUrl } from "@/lib/site"
export function GET() {
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:sf="http://schema.org/schemas/schemafeed/0.1"><url><loc>${siteUrl}/schema.jsonl</loc><lastmod>2026-10-28</lastmod><sf:contentType>structuredData/schema.org</sf:contentType></url></urlset>`,
    { headers: { "Content-Type": "application/xml; charset=utf-8" } },
  )
}
