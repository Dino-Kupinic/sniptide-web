import { structuredData } from "@/lib/structured-data"
export function GET() {
  return new Response(
    `${structuredData["@graph"].map((item) => JSON.stringify({ "@context": "https://schema.org", ...item })).join("\n")}\n`,
    { headers: { "Content-Type": "application/x-jsonlines; charset=utf-8" } },
  )
}
