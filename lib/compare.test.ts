import { describe, expect, test } from "bun:test"
import {
  cellText,
  compareGroups,
  comparePages,
  comparison,
  competitorData,
  product,
  renderCompareMarkdown,
} from "@/lib/compare"

const today = new Date().toISOString().slice(0, 10)

describe("competitor data file", () => {
  test("every product states every feature with a known source and a past check date", () => {
    for (const item of competitorData.products) {
      for (const feature of competitorData.features) {
        const fact = item.facts[feature.id]
        if (!fact) throw new Error(`${item.id} has no fact for ${feature.id}`)
        expect(item.sources[fact.source], `${item.id}.${feature.id} source`).toBeDefined()
        expect(fact.verified <= today, `${item.id}.${feature.id} date`).toBe(true)
      }
      for (const key of Object.keys(item.facts)) {
        expect(competitorData.features.some((feature) => feature.id === key)).toBe(true)
      }
    }
  })

  test("every source is an https link", () => {
    for (const item of competitorData.products) {
      for (const source of Object.values(item.sources)) {
        expect(source.url.startsWith("https://")).toBe(true)
      }
    }
  })

  test("cell values use the comparison notation or a short note", () => {
    for (const item of competitorData.products) {
      for (const fact of Object.values(item.facts)) {
        expect(fact.value.length).toBeLessThanOrEqual(32)
      }
    }
  })
})

describe("comparison pages", () => {
  test("there are at least three, each for a product in the data file", () => {
    expect(comparePages.length).toBeGreaterThanOrEqual(3)
    for (const page of comparePages) expect(() => product(page.competitor)).not.toThrow()
    expect(new Set(comparePages.map((page) => page.slug)).size).toBe(comparePages.length)
  })

  test("each page says when the other tool fits better", () => {
    for (const page of comparePages) {
      expect(page.chooseThem.length).toBeGreaterThanOrEqual(2)
      expect(page.chooseSniptide.length).toBeGreaterThanOrEqual(2)
    }
  })

  test("descriptions fit in search results", () => {
    for (const page of comparePages) {
      expect(page.description.length).toBeLessThanOrEqual(160)
      expect(page.title.length).toBeLessThanOrEqual(60)
    }
  })

  test("the table drops rows where both products say no", () => {
    const groups = compareGroups([product("sniptide"), product("gist")])
    const ids = groups.flatMap((group) => group.rows.map((row) => row.id))
    expect(ids).not.toContain("uploads")
    expect(ids).toContain("password")
  })

  test("the Markdown twin carries the table and every source", () => {
    for (const page of comparePages) {
      const markdown = renderCompareMarkdown(page)
      const { sources } = comparison(page)
      expect(markdown).toStartWith(`# ${page.title}\n`)
      for (const { sources: list } of sources) {
        for (const source of list) expect(markdown).toContain(source.url)
      }
    }
  })

  test("cells read as plain words", () => {
    expect(cellText("✓")).toBe("Yes")
    expect(cellText("–")).toBe("No")
    expect(cellText("?")).toBe("Not documented")
    expect(cellText("~Folders")).toBe("Partly: Folders")
    expect(cellText("AGPL-3.0")).toBe("AGPL-3.0")
  })
})
