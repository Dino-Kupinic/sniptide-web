import demoPreviewLight from "@/assets/landing/demo-preview-light.webp"
import { homeGraph, jsonLdDocuments, serializeJsonLd } from "@/lib/structured-data"

export function JsonLd() {
  return jsonLdDocuments(homeGraph(demoPreviewLight.src)).map((document, index) => (
    <script
      // biome-ignore lint/suspicious/noArrayIndexKey: the list is static and never reorders.
      key={index}
      type="application/ld+json"
      // Static data from lib/structured-data.ts, escaped by serializeJsonLd.
      // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD must be raw script text.
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(document) }}
    />
  ))
}
