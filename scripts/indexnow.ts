import sitemap from "../app/sitemap"
import {
  type Changes,
  findChanges,
  indexNowEndpoint,
  isLive,
  parseSitemap,
  type SitemapEntry,
  submission,
  toEntries,
} from "../lib/indexnow"
import { siteUrl } from "../lib/site"

// Submits the URLs this checkout changes to IndexNow once sniptide.com serves them.
//   bun run indexnow          wait for the deploy of this checkout, then submit what changed
//   bun run indexnow --all    submit every sitemap URL now
//   bun run indexnow --dry    print what would be submitted without waiting or sending

const all = process.argv.includes("--all")
const dry = process.argv.includes("--dry")
const pollMs = 30_000
const timeoutMs = 30 * 60_000

async function liveSitemap(): Promise<SitemapEntry[]> {
  const response = await fetch(`${siteUrl}/sitemap.xml`, {
    headers: { "cache-control": "no-cache" },
    signal: AbortSignal.timeout(30_000),
  })
  if (!response.ok) throw new Error(`${siteUrl}/sitemap.xml returned ${response.status}.`)
  return parseSitemap(await response.text())
}

const local = toEntries(sitemap())
const changes: Changes = all
  ? { updated: local, removed: [] }
  : findChanges(local, await liveSitemap(), new Date())
const urls = [...changes.updated.map((entry) => entry.url), ...changes.removed]

if (urls.length === 0) {
  console.log("Nothing changed in the sitemap, so there is nothing to submit.")
  process.exit(0)
}
console.log(`URLs to submit:\n${urls.map((url) => `  ${url}`).join("\n")}`)
if (dry) process.exit(0)

if (!all) {
  const deadline = Date.now() + timeoutMs
  while (!isLive(changes, await liveSitemap())) {
    if (Date.now() > deadline)
      throw new Error("The live sitemap didn't show these changes within 30 minutes.")
    console.log("Waiting for the deploy to serve these changes…")
    await Bun.sleep(pollMs)
  }
}

const response = await fetch(indexNowEndpoint, {
  method: "POST",
  headers: { "content-type": "application/json; charset=utf-8" },
  body: JSON.stringify(submission(urls)),
  signal: AbortSignal.timeout(30_000),
})
// 200 means the URLs were received and 202 means the key is still being verified.
if (response.status !== 200 && response.status !== 202)
  throw new Error(`IndexNow returned ${response.status}: ${await response.text()}`)
console.log(`IndexNow accepted ${urls.length} URLs (${response.status}).`)
