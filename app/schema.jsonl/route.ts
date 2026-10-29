import demoPreviewLight from "@/assets/landing/demo-preview-light.webp"
import { homeGraph, jsonLdDocuments } from "@/lib/structured-data"
export function GET() {
  return new Response(
    `${jsonLdDocuments(homeGraph(demoPreviewLight.src))
      .map((document) => JSON.stringify(document))
      .join("\n")}\n`,
    { headers: { "Content-Type": "application/x-jsonlines; charset=utf-8" } },
  )
}
