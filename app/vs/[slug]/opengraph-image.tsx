import { notFound } from "next/navigation"
import { comparisons, getComparison } from "@/lib/comparisons"
import { ogContentType, ogSize, renderOgImage } from "@/lib/og"

export const alt = "Sniptide compared with another pastebin"
export const size = ogSize
export const contentType = ogContentType

export function generateStaticParams() {
  return comparisons.map(({ slug }) => ({ slug }))
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const comparison = getComparison((await params).slug)
  if (!comparison) notFound()
  return renderOgImage({
    title: `Sniptide vs ${comparison.name}`,
    summary: comparison.imageSummary,
    // Long enough for "Sniptide vs GitHub Gist" to stay on one line.
    titleSize: 88,
  })
}
