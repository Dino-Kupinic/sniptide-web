import { expect, test } from "bun:test"
import { readdirSync } from "node:fs"
import path from "node:path"
import nextConfig from "@/next.config"

// Paths without a page here fall through to the app, which serves them as share links. The app
// keeps its slugs out of the site's way by their shape instead of a blocklist: a generated slug is
// exactly 8 characters from the alphabet below (randomSlug in the app's lib/pastes/links.ts), and a
// custom link always starts with "@". So a page is safe from being taken by a paste as long as its
// first path segment can't have that shape, which this test checks for every route and redirect.
const generatedSlug = /^[ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789]{8}$/

function firstSegments() {
  const appDir = path.join(import.meta.dir, "..", "app")
  return readdirSync(appDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => decodeURIComponent(entry.name))
    .filter((name) => !name.startsWith("(") && !name.startsWith("["))
}

test("no page path can be taken by a generated paste slug or a custom link", () => {
  const segments = firstSegments()
  expect(segments).toEqual(expect.arrayContaining(["about", "acceptable-use", "vision", "blog"]))
  for (const segment of segments) {
    expect(generatedSlug.test(segment)).toBe(false)
    expect(segment.startsWith("@")).toBe(false)
  }
})

test("no redirect source can be taken by a generated paste slug", async () => {
  const redirects = (await nextConfig.redirects?.()) ?? []
  for (const { source } of redirects) {
    const segment = source.split("/")[1] ?? ""
    expect(generatedSlug.test(segment)).toBe(false)
  }
})
