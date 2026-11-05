import { describe, expect, test } from "bun:test"
import { ogSize } from "@/lib/og"
import { lifeCell, lifeCells, lifePaths } from "@/lib/og-life"

describe("Open Graph Game of Life", () => {
  test("is the same on every render", () => {
    expect(JSON.stringify(lifePaths())).toBe(JSON.stringify(lifePaths()))
  })

  test("stays on the card and keeps clear of the logo", () => {
    const cells = lifeCells()
    expect(cells.length).toBeGreaterThan(500)
    for (const { x, y } of cells) {
      expect(x >= 0 && x + lifeCell <= ogSize.width).toBe(true)
      expect(y >= 0 && y + lifeCell <= ogSize.height).toBe(true)
      // The logo lockup with a margin around it, centred on the card.
      const overLogo = x + lifeCell > 380 && x < 820 && y + lifeCell > 255 && y < 375
      expect(overLogo).toBe(false)
    }
  })
})
