import { serializeJsonLd, structuredData } from "@/lib/structured-data"

export function JsonLd() {
  return (
    <script
      type="application/ld+json"
      // Static data from lib/structured-data.ts, escaped by serializeJsonLd.
      // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD must be raw script text.
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(structuredData) }}
    />
  )
}
