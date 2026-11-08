import { readdirSync, readFileSync } from "node:fs"
import { join } from "node:path"
import { siteUrl } from "@/lib/site"

// IndexNow tells Bing, Yandex, Naver, Seznam and Yep that a URL changed, so they recrawl it
// without waiting for the next sitemap fetch. Google doesn't take part. The key isn't a secret:
// search engines verify it by fetching public/<key>.txt, which holds the same value. The file is
// the only copy of the key, so secret scanners don't flag a key-shaped string in the source.
export function indexNowKey(publicDir = "public") {
  const files = readdirSync(publicDir).filter((name) => /^[a-f0-9]{32}\.txt$/.test(name))
  const [file] = files
  if (!file || files.length > 1)
    throw new Error(`Expected one IndexNow key file in ${publicDir}, found ${files.length}.`)
  const key = file.slice(0, -4)
  if (readFileSync(join(publicDir, file), "utf8").trim() !== key)
    throw new Error(`${file} must contain its own name without .txt.`)
  return key
}

export function indexNowKeyLocation(key = indexNowKey()) {
  return `${siteUrl}/${key}.txt`
}

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

export function submission(urls: string[], key = indexNowKey()) {
  const urlList = [...new Set(urls)]
  const host = new URL(siteUrl).host
  for (const url of urlList)
    if (new URL(url).host !== host) throw new Error(`${url} isn't on ${host}.`)
  if (urlList.length > maxUrls)
    throw new Error(`IndexNow takes at most ${maxUrls} URLs, not ${urlList.length}.`)
  return { host, key, keyLocation: indexNowKeyLocation(key), urlList }
}
