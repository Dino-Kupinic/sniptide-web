import { describe, expect, test } from "bun:test"
import robots from "@/app/robots"
import sitemap from "@/app/sitemap"
import { pageEntries, pageUpdated } from "@/lib/sitemap"
import { siteDescription, siteTitle, sitemapPaths, siteUrl } from "@/lib/site"

describe("search engine basics", () => {
  test("the home page title and description fit in search results", () => {
    expect(siteTitle.length).toBeLessThanOrEqual(60)
    expect(siteDescription.length).toBeGreaterThanOrEqual(70)
    expect(siteDescription.length).toBeLessThanOrEqual(160)
  })

  test("robots.txt allows crawling and points at the sitemap", () => {
    expect(robots()).toMatchObject({
      rules: { userAgent: "*", allow: "/", disallow: "/cdn-cgi/l/email-protection" },
      sitemap: `${siteUrl}/sitemap.xml`,
    })
  })

  test("the sitemap lists absolute URLs on the site, each once", async () => {
    const urls = (await sitemap()).map((entry) => entry.url)
    expect(urls).toContain(siteUrl)
    expect(urls).toEqual(
      expect.arrayContaining([`${siteUrl}/privacy`, `${siteUrl}/terms`, `${siteUrl}/impressum`]),
    )
    expect(new Set(urls).size).toBe(urls.length)
    for (const url of urls) expect(url.startsWith(siteUrl)).toBe(true)
  })

  test("every sitemap entry has a last-modified date", async () => {
    const entries = await sitemap()
    for (const entry of entries) expect(entry.lastModified).toBeTruthy()
    expect(entries.find((entry) => entry.url === `${siteUrl}/changelog`)?.lastModified).toBe(
      "2026-11-20T09:00:00Z",
    )
  })

  test("every page in the sitemap has a date of its own or one from its content", () => {
    const fromContent = ["/blog", "/templates", "/changelog"]
    for (const path of sitemapPaths) {
      if (!fromContent.includes(path)) expect(pageUpdated[path]).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    }
    expect(Object.keys(pageUpdated).filter((path) => !sitemapPaths.includes(path))).toEqual([])
  })

  test("the changelog goes without a date only while GitHub can't be reached", () => {
    const [changelog] = pageEntries(["/changelog"], {})
    expect(changelog?.lastModified).toBeUndefined()
  })
})
