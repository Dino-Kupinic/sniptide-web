import { describe, expect, test } from "bun:test"
import sitemap from "@/app/sitemap"
import {
  findChanges,
  indexNowKey,
  indexNowKeyLocation,
  isLive,
  parseSitemap,
  submission,
  toEntries,
} from "@/lib/indexnow"
import { siteUrl } from "@/lib/site"

const now = new Date("2026-11-08T10:00:00Z")
const post = `${siteUrl}/blog/introducing-sniptide`

describe("IndexNow", () => {
  test("public/ holds one key file that contains its own name", () => {
    const key = indexNowKey()
    expect(key).toMatch(/^[a-f0-9]{32}$/)
    expect(indexNowKeyLocation(key)).toBe(`${siteUrl}/${key}.txt`)
  })

  test("reads the URLs and days from a sitemap", () => {
    const xml = `<?xml version="1.0"?><urlset>
      <url><loc>${siteUrl}</loc><lastmod>2026-10-23</lastmod></url>
      <url><loc>${post}</loc><lastmod>2026-11-07T00:00:00.000Z</lastmod></url>
      <url><loc>${siteUrl}/about</loc></url>
    </urlset>`
    expect(parseSitemap(xml)).toEqual([
      { url: siteUrl, lastModified: "2026-10-23" },
      { url: post, lastModified: "2026-11-07" },
      { url: `${siteUrl}/about`, lastModified: undefined },
    ])
  })

  test("finds new, re-dated and removed URLs and leaves old unchanged ones out", () => {
    const live = [
      { url: siteUrl, lastModified: "2026-10-23" },
      { url: `${siteUrl}/about`, lastModified: "2026-10-01" },
      { url: `${siteUrl}/blog/old`, lastModified: "2026-10-01" },
    ]
    const local = [
      { url: siteUrl, lastModified: "2026-10-23" },
      { url: `${siteUrl}/about`, lastModified: "2026-10-28" },
      { url: post, lastModified: "2026-10-30" },
    ]
    const changes = findChanges(local, live, now)
    expect(changes.updated.map((entry) => entry.url)).toEqual([`${siteUrl}/about`, post])
    expect(changes.removed).toEqual([`${siteUrl}/blog/old`])
    expect(isLive(changes, live)).toBe(false)
    expect(isLive(changes, local)).toBe(true)
  })

  test("still submits a post dated today or yesterday after the deploy is live", () => {
    const local = [
      { url: post, lastModified: "2026-11-07" },
      { url: siteUrl, lastModified: "2026-10-23" },
    ]
    const changes = findChanges(local, local, now)
    expect(changes.updated.map((entry) => entry.url)).toEqual([post])
    expect(isLive(changes, local)).toBe(true)
  })

  test("submits only URLs on the site, each once", () => {
    const key = indexNowKey()
    expect(submission([post, post])).toEqual({
      host: "sniptide.com",
      key,
      keyLocation: indexNowKeyLocation(key),
      urlList: [post],
    })
    expect(() => submission(["https://example.com/page"])).toThrow()
  })

  test("every URL in the built sitemap can be submitted", () => {
    const urls = toEntries(sitemap()).map((entry) => entry.url)
    expect(submission(urls).urlList).toHaveLength(urls.length)
  })
})
