import { describe, expect, test } from "bun:test"
import { existsSync, statSync } from "node:fs"
import { join } from "node:path"
import robots from "@/app/robots"
import sitemap from "@/app/sitemap"
import { ogVideo, siteDescription, siteTitle, siteUrl } from "@/lib/site"

describe("search engine basics", () => {
  test("the home page title and description fit in search results", () => {
    expect(siteTitle.length).toBeLessThanOrEqual(60)
    expect(siteDescription.length).toBeGreaterThanOrEqual(70)
    expect(siteDescription.length).toBeLessThanOrEqual(160)
  })

  test("robots.txt allows crawling and points at the sitemap", () => {
    expect(robots()).toEqual({
      rules: { userAgent: "*", allow: "/" },
      sitemap: `${siteUrl}/sitemap.xml`,
    })
  })

  test("the sitemap lists absolute URLs on the site, each once", () => {
    const urls = sitemap().map((entry) => entry.url)
    expect(urls).toContain(siteUrl)
    expect(urls).toEqual(
      expect.arrayContaining([`${siteUrl}/privacy`, `${siteUrl}/terms`, `${siteUrl}/impressum`]),
    )
    expect(new Set(urls).size).toBe(urls.length)
    for (const url of urls) expect(url.startsWith(siteUrl)).toBe(true)
  })
})

describe("link preview video", () => {
  test("og:video is an MP4 in public/ the size of the Open Graph card", () => {
    expect(ogVideo.url.startsWith(siteUrl)).toBe(true)
    expect(ogVideo.secureUrl.startsWith("https://")).toBe(true)
    expect({ width: ogVideo.width, height: ogVideo.height }).toEqual({ width: 1200, height: 630 })
    const file = join(process.cwd(), "public", new URL(ogVideo.url).pathname)
    expect(existsSync(file)).toBe(true)
    // Preview bots give up on large files, so the loop stays small.
    expect(statSync(file).size).toBeLessThan(5 * 1024 * 1024)
  })
})
