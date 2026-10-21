import { serializeJsonLd, structuredData } from "@/lib/structured-data"

// The home page graph by default; a page with its own structured data passes it in.
export function JsonLd({ data = structuredData }: { data?: object }) {
  return (
    <script
      type="application/ld+json"
      // Static data from lib/structured-data.ts, escaped by serializeJsonLd.
      // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD must be raw script text.
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  )
}
