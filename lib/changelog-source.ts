import { unstable_cache } from "next/cache"
import {
  type Announcement,
  type ChangelogEntry,
  type GithubRelease,
  pickAnnouncement,
  releasesRepo,
  toEntries,
} from "./changelog"

const perPage = 100
// A guard against a runaway loop: 50 pages is 5,000 releases.
const maxPages = 50

async function fetchReleases(): Promise<GithubRelease[]> {
  const headers: Record<string, string> = { Accept: "application/vnd.github+json" }
  // Optional. Without a token GitHub allows 60 requests an hour per IP address, which a shared
  // host can exhaust. Read when the page revalidates.
  const token = process.env.GITHUB_TOKEN
  if (token) headers.Authorization = `Bearer ${token}`

  const releases: GithubRelease[] = []
  for (let page = 1; page <= maxPages; page++) {
    const response = await fetch(
      `https://api.github.com/repos/${releasesRepo}/releases?per_page=${perPage}&page=${page}`,
      { cache: "no-store", headers, signal: AbortSignal.timeout(5000) },
    )
    if (!response.ok) throw new Error(`GitHub returned ${response.status}`)
    const data: unknown = await response.json()
    if (!Array.isArray(data)) throw new Error("Invalid GitHub releases response")
    releases.push(...(data as GithubRelease[]))
    if (data.length < perPage) break
  }
  return releases
}

// Parsed entries are cached rather than raw releases, which keeps the cache entry small.
const cachedEntries = unstable_cache(async () => toEntries(await fetchReleases()), ["changelog"], {
  revalidate: 3600,
})

// Null when GitHub cannot be reached, so the page can say so instead of showing an empty list.
export async function getChangelog(): Promise<ChangelogEntry[] | null> {
  try {
    return await cachedEntries()
  } catch (error) {
    // Usually GitHub's limit of 60 unauthenticated requests an hour; GITHUB_TOKEN raises it.
    console.error("Could not load the changelog from GitHub:", error)
    return null
  }
}

// The bar above the header. Read through the same hourly cache as the changelog.
export async function getAnnouncement(): Promise<Announcement | null> {
  const entries = await getChangelog()
  return entries ? pickAnnouncement(entries) : null
}
