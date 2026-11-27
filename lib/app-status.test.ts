/// <reference types="bun-types" />
import { afterEach, describe, expect, test } from "bun:test"
import { parseBetterStackState, statusPageUrl } from "@/lib/app-status"

function page(state: unknown) {
  return { data: { id: "1", type: "status_page", attributes: { aggregate_state: state } } }
}

describe("parseBetterStackState", () => {
  test("maps each Better Stack state to a footer status", () => {
    expect(parseBetterStackState(page("operational"))).toBe("operational")
    expect(parseBetterStackState(page("degraded"))).toBe("degraded")
    expect(parseBetterStackState(page("downtime"))).toBe("outage")
    expect(parseBetterStackState(page("maintenance"))).toBe("maintenance")
  })

  test("returns null for an unknown state or an unexpected body", () => {
    expect(parseBetterStackState(page("exploded"))).toBeNull()
    expect(parseBetterStackState(page(undefined))).toBeNull()
    expect(parseBetterStackState({ data: null })).toBeNull()
    expect(parseBetterStackState("<html>")).toBeNull()
    expect(parseBetterStackState(null)).toBeNull()
  })
})

describe("statusPageUrl", () => {
  const previous = process.env.STATUS_PAGE_URL
  afterEach(() => {
    if (previous === undefined) delete process.env.STATUS_PAGE_URL
    else process.env.STATUS_PAGE_URL = previous
  })

  test("is null when unset or blank", () => {
    delete process.env.STATUS_PAGE_URL
    expect(statusPageUrl()).toBeNull()
    process.env.STATUS_PAGE_URL = "  "
    expect(statusPageUrl()).toBeNull()
  })

  test("drops a trailing slash so index.json joins cleanly", () => {
    process.env.STATUS_PAGE_URL = "https://status.sniptide.com/"
    expect(statusPageUrl()).toBe("https://status.sniptide.com")
  })

  test("rejects values that are not http or https URLs", () => {
    process.env.STATUS_PAGE_URL = "javascript:alert(1)"
    expect(statusPageUrl()).toBeNull()
    process.env.STATUS_PAGE_URL = "status.sniptide.com"
    expect(statusPageUrl()).toBeNull()
  })
})
