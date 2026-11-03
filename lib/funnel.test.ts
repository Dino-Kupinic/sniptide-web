import { describe, expect, test } from "bun:test"
import { isSectionSeen, newMilestones, outboundHost, scrollPercent } from "./funnel"

describe("scroll depth", () => {
  test("measures against the scrollable height", () => {
    expect(scrollPercent(0, 800, 4000)).toBe(0)
    expect(scrollPercent(1600, 800, 4000)).toBe(50)
    expect(scrollPercent(3200, 800, 4000)).toBe(100)
  })

  test("treats a page that fits the screen as fully seen", () => {
    expect(scrollPercent(0, 800, 600)).toBe(100)
  })

  test("reports each milestone once", () => {
    expect(newMilestones(60, new Set())).toEqual([25, 50])
    expect(newMilestones(80, new Set([25, 50]))).toEqual([75])
    expect(newMilestones(80, new Set([25, 50, 75]))).toEqual([])
  })
})

describe("section views", () => {
  test("counts a short section once 40% of it shows", () => {
    expect(isSectionSeen(150, 400, 900)).toBe(false)
    expect(isSectionSeen(160, 400, 900)).toBe(true)
  })

  test("counts a tall section once it fills half the screen", () => {
    expect(isSectionSeen(400, 2400, 900)).toBe(false)
    expect(isSectionSeen(450, 2400, 900)).toBe(true)
  })
})

describe("outbound links", () => {
  test("names the host of a link that leaves Sniptide", () => {
    expect(outboundHost("https://github.com/Dino-Kupinic/sniptide", "sniptide.com")).toBe(
      "github.com",
    )
  })

  test("ignores Sniptide's own pages, anchors and other schemes", () => {
    expect(outboundHost("/privacy", "sniptide.com")).toBeNull()
    expect(outboundHost("#features", "sniptide.com")).toBeNull()
    expect(outboundHost("https://app.sniptide.com/sign-up", "sniptide.com")).toBeNull()
    expect(outboundHost("mailto:office@sniptide.com", "sniptide.com")).toBeNull()
    expect(outboundHost("http://localhost:3001/terms", "localhost:3001")).toBeNull()
  })
})
