import { siteUrl } from "@/lib/site"

// IndexNow tells Bing, Yandex, Naver, Seznam and Yep that a URL changed, so they recrawl it
// without waiting for the next sitemap fetch. Google doesn't take part. The key isn't a secret:
// search engines verify it by fetching public/<key>.txt, which holds the same value.
export const indexNowKey = "9df9f25906dcbfea4183f5be5a17b8f8"
export const indexNowKeyLocation = `${siteUrl}/${indexNowKey}.txt`
export const indexNowEndpoint = "https://api.indexnow.org/indexnow"

// IndexNow accepts at most 10,000 URLs in one request.
const maxUrls = 10_000

export type SitemapEntry = { url: string; lastModified?: string }

export type Changes = {
  // Entries the deploy adds or re-dates. The live sitemap must list each with this date.
  updated: SitemapEntry[]
  // URLs the deploy drops. The live sitemap must no longer list them.
  removed: string[]
}

// Sitemap dates compare by day, since the sitemap states some as dates and others as timestamps.
function day(value: string | Date | undefined) {
  if (!value) return undefined
  return (value instanceof Date ? value.toISOString() : value).slice(0, 10)
}

export function toEntries(
  sitemap: { url: string; lastModified?: string | Date }[],
): SitemapEntry[] {
  return sitemap.map((entry) => ({ url: entry.url, lastModified: day(entry.lastModified) }))
}

export function parseSitemap(xml: string): SitemapEntry[] {
  return [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].flatMap(([, body = ""]) => {
    const url = body.match(/<loc>\s*([^<]+?)\s*<\/loc>/)?.[1]
    if (!url) return []
    return [{ url, lastModified: day(body.match(/<lastmod>\s*([^<]+?)\s*<\/lastmod>/)?.[1]) }]
  })
}

// What the checkout changes compared with the live site. An entry dated today or yesterday (UTC)
// counts as updated even when the live sitemap already lists it, so a run that starts after the
// deploy finished still submits the new post.
export function findChanges(local: SitemapEntry[], live: SitemapEntry[], now: Date): Changes {
  const liveDates = new Map(live.map((entry) => [entry.url, entry.lastModified]))
  const localUrls = new Set(local.map((entry) => entry.url))
  const recent = new Set([day(now), day(new Date(now.getTime() - 86_400_000))])
  return {
    updated: local.filter(
      (entry) =>
        !liveDates.has(entry.url) ||
        liveDates.get(entry.url) !== entry.lastModified ||
        recent.has(entry.lastModified),
    ),
    removed: live.filter((entry) => !localUrls.has(entry.url)).map((entry) => entry.url),
  }
}

// True once the live sitemap reflects every change, which means the deploy is serving them.
export function isLive(changes: Changes, live: SitemapEntry[]) {
  const liveDates = new Map(live.map((entry) => [entry.url, entry.lastModified]))
  return (
    changes.updated.every((entry) => liveDates.get(entry.url) === entry.lastModified) &&
    changes.removed.every((url) => !liveDates.has(url))
  )
}

export function submission(urls: string[]) {
  const urlList = [...new Set(urls)]
  const host = new URL(siteUrl).host
  for (const url of urlList)
    if (new URL(url).host !== host) throw new Error(`${url} isn't on ${host}.`)
  if (urlList.length > maxUrls)
    throw new Error(`IndexNow takes at most ${maxUrls} URLs, not ${urlList.length}.`)
  return { host, key: indexNowKey, keyLocation: indexNowKeyLocation, urlList }
}
