import { describe, expect, test } from "bun:test"
import sitemap from "@/app/sitemap"
import { comparisonPath, comparisons, getComparison } from "@/lib/comparisons"
import { llmsTxt } from "@/lib/llms"
import { pageMetadata } from "@/lib/seo"
import { comparisonStructuredData } from "@/lib/structured-data"

// Every string a reader sees on a comparison page.
function copy(comparison: (typeof comparisons)[number]) {
  return [
    comparison.title,
    comparison.description,
    comparison.summary,
    comparison.imageSummary,
    comparison.lead,
    ...comparison.rows.flatMap((row) => [row.label, row.sniptide, row.other]),
    ...comparison.sections.flatMap((section) => [section.heading, ...section.paragraphs]),
  ]
}

describe("comparison pages", () => {
  test("there are at least three, each with its own slug", () => {
    expect(comparisons.length).toBeGreaterThanOrEqual(3)
    expect(new Set(comparisons.map((comparison) => comparison.slug)).size).toBe(comparisons.length)
  })

  test("titles and descriptions fit in search results", () => {
    for (const comparison of comparisons) {
      expect(comparison.title.length).toBeLessThanOrEqual(60)
      expect(comparison.description.length).toBeGreaterThanOrEqual(70)
      expect(comparison.description.length).toBeLessThanOrEqual(160)
    }
  })

  test("every page compares something and cites where it looked", () => {
    for (const comparison of comparisons) {
      expect(comparison.rows.length).toBeGreaterThanOrEqual(8)
      expect(comparison.sources.length).toBeGreaterThan(0)
      for (const source of comparison.sources) expect(source.href.startsWith("https://")).toBe(true)
      for (const row of comparison.rows) {
        expect(row.sniptide.trim()).not.toBe("")
        expect(row.other.trim()).not.toBe("")
      }
    }
  })

  test("every page names a case for the other tool", () => {
    for (const comparison of comparisons) {
      const headings = comparison.sections.map((section) => section.heading)
      expect(headings.some((heading) => /better choice|Who can read/.test(heading))).toBe(true)
    }
  })

  test("the copy follows DESIGN.md", () => {
    for (const comparison of comparisons) {
      for (const text of copy(comparison)) {
        expect(text).not.toContain("—")
        expect(text).not.toMatch(/\bSnipTide\b/)
        expect(text).not.toMatch(/revolutionary|seamless|supercharge|AI-powered/i)
        expect(text).not.toMatch(/\bnot just\b|\bit's [^.]*, not\b/i)
      }
    }
  })

  test("looks a comparison up by slug", () => {
    expect(getComparison("pastebin")?.name).toBe("Pastebin")
    expect(getComparison("nope")).toBeUndefined()
  })

  test("the sitemap lists every page", () => {
    const urls = sitemap().map((entry) => entry.url)
    for (const { slug } of comparisons) {
      expect(urls).toContain(`https://sniptide.com${comparisonPath(slug)}`)
    }
  })

  test("llms.txt links every page", () => {
    for (const { slug } of comparisons) {
      expect(llmsTxt).toContain(`(https://sniptide.com${comparisonPath(slug)})`)
    }
  })

  test("metadata sets its own title, canonical link and cards", () => {
    const comparison = comparisons[0]
    if (!comparison) throw new Error("no comparisons")
    const metadata = pageMetadata({
      title: comparison.title,
      description: comparison.description,
      path: comparisonPath(comparison.slug),
    })
    expect(metadata.title).toEqual({ absolute: comparison.title })
    expect(metadata.alternates?.canonical).toBe(comparisonPath(comparison.slug))
    expect(metadata.openGraph).toMatchObject({ siteName: "Sniptide", type: "website" })
    expect(metadata.twitter).toMatchObject({ card: "summary_large_image" })
  })

  test("structured data points at the home page graph and the check date", () => {
    const comparison = comparisons[0]
    if (!comparison) throw new Error("no comparisons")
    expect(comparisonStructuredData(comparison)).toMatchObject({
      "@type": "WebPage",
      url: `https://sniptide.com${comparisonPath(comparison.slug)}`,
      dateModified: "2026-10-16",
      isPartOf: { "@id": "https://sniptide.com/#website" },
      about: { "@id": "https://sniptide.com/#software" },
    })
  })
})
