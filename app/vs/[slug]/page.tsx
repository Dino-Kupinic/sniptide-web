import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ComparisonPage } from "@/components/comparison-page"
import { comparisonPath, comparisons, getComparison } from "@/lib/comparisons"
import { pageMetadata } from "@/lib/seo"

type Props = { params: Promise<{ slug: string }> }

// Only the listed comparisons exist, so any other /vs/<slug> is a 404 here instead of going to the
// app as a paste link.
export const dynamicParams = false

export function generateStaticParams() {
  return comparisons.map(({ slug }) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const comparison = getComparison((await params).slug)
  if (!comparison) return {}
  return pageMetadata({
    title: comparison.title,
    description: comparison.description,
    path: comparisonPath(comparison.slug),
  })
}

export default async function Comparison({ params }: Props) {
  const comparison = getComparison((await params).slug)
  if (!comparison) notFound()
  return <ComparisonPage comparison={comparison} />
}
