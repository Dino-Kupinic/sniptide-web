import { describe, expect, test } from "bun:test"
import robots from "@/app/robots"
import sitemap from "@/app/sitemap"
import { siteDescription, siteTitle, siteUrl } from "@/lib/site"

describe("search engine basics", () => {
  test("the home page title and description fit in search results", () => {
    expect(siteTitle.length).toBeLessThanOrEqual(60)
    expect(siteDescription.length).toBeGreaterThanOrEqual(70)
    expect(siteDescription.length).toBeLessThanOrEqual(160)
  })

  test("robots.txt allows crawling except /cdn-cgi and points at the sitemap", () => {
    expect(robots()).toMatchObject({
      // /_next and /_site/_next stay open so search engines can render the pages.
      rules: { userAgent: "*", allow: "/", disallow: "/cdn-cgi/" },
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
