import { expect, test } from "bun:test"
import { ditherCoverage } from "@/lib/dither/logo"

test("subtle dithering preserves the artwork and its antialiased edges", () => {
  expect(ditherCoverage(1, true, 0.12)).toBe(1)
  expect(ditherCoverage(1, false, 0.12)).toBe(0.88)
  expect(ditherCoverage(0.5, false, 0.12)).toBe(0.44)
  expect(ditherCoverage(0, true, 0.12)).toBe(0)
})

test("texture contrast stays between smooth artwork and fully cut-out gaps", () => {
  expect(ditherCoverage(0.5, false, -1)).toBe(0.5)
  expect(ditherCoverage(0.5, false, 2)).toBe(0)
})
