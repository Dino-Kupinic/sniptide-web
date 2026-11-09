export const changelogPath = "/changelog"
export const releasesRepo = "Dino-Kupinic/sniptide"

// What a release means for someone using Sniptide. Internal releases (CI, tests, refactors and
// other maintenance) stay listed but collapse into short rows.
export type ReleaseKind = "feature" | "fix" | "internal"

export type ChangelogEntry = {
  version: string
  tag: string
  date: string
  url: string
  kind: ReleaseKind
  title: string
  // Markdown below the title. Empty when the title says everything.
  body: string
  pulls: number[]
  // True when the release-notes workflow wrote the post; false for the commit-list fallback.
  written: boolean
  // Set by featured="true" on the notes marker. Only featured releases take the announcement bar.
  featured: boolean
}

export type GithubRelease = {
  tag_name: string
  name: string | null
  body: string | null
  html_url: string
  published_at: string | null
  draft: boolean
  prerelease: boolean
}

// The release-notes workflow in the app repo wraps its post in these markers and keeps the
// semantic-release list below them, so the site can tell the post from the commit list.
const notesBlock =
  /<!--\s*sniptide-notes:start((?:\s+[a-z]+="?[a-z-]+"?)*)\s*-->([\s\S]*?)<!--\s*sniptide-notes:end\s*-->/

const sectionKinds: Record<string, ReleaseKind> = {
  features: "feature",
  "bug fixes": "fix",
  performance: "fix",
  reverts: "fix",
}

export function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

// A semantic-release item reduced to its subject: no scope, Linear ID, PR or commit links. The
// generator turns "@handle" into a link to a GitHub user, which is undone here.
export function cleanSubject(line: string) {
  return line
    .replace(/^\s*[*-]\s+/, "")
    .replace(/^\*\*[^*]+:\*\*\s*/, "")
    .replace(/\s*\(\[[^\]]+\]\(https:\/\/github\.com\/[^)]+\)\)/g, "")
    .replace(/\[@([\w-]+)\]\(https:\/\/github\.com\/[\w-]+\)/g, "@$1")
    .replace(/\s*\((?:[A-Z]+-\d+(?:,\s*)?)+\)/g, "")
    .replace(/\s+/g, " ")
    .trim()
}

function pullNumbers(body: string) {
  const numbers = new Set<number>()
  for (const match of body.matchAll(/github\.com\/[\w.-]+\/[\w.-]+\/(?:issues|pull)\/(\d+)/g)) {
    numbers.add(Number(match[1]))
  }
  return [...numbers]
}

function parseAttributes(source: string) {
  const attributes: Record<string, string> = {}
  for (const [, key = "", value = ""] of source.matchAll(/([a-z]+)="?([a-z-]+)"?/g)) {
    attributes[key] = value
  }
  return attributes
}

function isKind(value: string | undefined): value is ReleaseKind {
  return value === "feature" || value === "fix" || value === "internal"
}

// A post from the release-notes workflow: the first heading is the title, the rest the body.
function parseWritten(attributes: string, content: string) {
  const kindAttribute = parseAttributes(attributes).kind
  const lines = content.trim().split("\n")
  const headingIndex = lines.findIndex((line) => /^#{1,3}\s+\S/.test(line))
  let title = ""
  if (headingIndex !== -1) {
    title = (lines[headingIndex] ?? "").replace(/^#{1,3}\s+/, "").trim()
    lines.splice(headingIndex, 1)
  }
  let body = lines.join("\n").trim()
  // An internal note is often one sentence with no heading; that sentence becomes the title.
  if (!title) {
    const [first = "", ...rest] = body.split(/\n\s*\n/)
    title = first.replace(/\s+/g, " ").trim()
    body = rest.join("\n\n").trim()
  }
  return { kind: isKind(kindAttribute) ? kindAttribute : "feature", title, body }
}

function isFeatured(attributes: string) {
  return parseAttributes(attributes).featured === "true"
}

// The semantic-release list, for releases the workflow has not rewritten: the most user-facing
// section names the kind, its first item the title, and any other user-facing items the body.
function parseCommitList(body: string) {
  const items: { kind: ReleaseKind; subject: string }[] = []
  let kind: ReleaseKind = "internal"
  for (const line of body.split("\n")) {
    const heading = line.match(/^#{3}\s+(.+?)\s*$/)?.[1]
    if (heading) {
      kind = sectionKinds[heading.toLowerCase()] ?? "internal"
      continue
    }
    if (/^\s*[*-]\s+/.test(line)) {
      const subject = cleanSubject(line)
      if (subject) items.push({ kind, subject: capitalize(subject) })
    }
  }
  const rank: ReleaseKind[] = ["feature", "fix", "internal"]
  items.sort((a, b) => rank.indexOf(a.kind) - rank.indexOf(b.kind))
  const [first, ...rest] = items
  if (!first) return { kind: "internal" as const, title: "Maintenance release", body: "" }
  const extra = rest.filter((item) => item.kind !== "internal" || first.kind === "internal")
  return {
    kind: first.kind,
    title: first.subject,
    body: extra.map((item) => `- ${item.subject}`).join("\n"),
  }
}

export function parseRelease(release: GithubRelease): ChangelogEntry {
  const raw = (release.body ?? "").replace(/\r\n/g, "\n")
  const block = raw.match(notesBlock)
  const parsed = block ? parseWritten(block[1] ?? "", block[2] ?? "") : parseCommitList(raw)
  return {
    version: release.tag_name.replace(/^v/, ""),
    tag: release.tag_name,
    date: release.published_at ?? "",
    url: release.html_url,
    ...parsed,
    pulls: pullNumbers(raw),
    written: Boolean(block),
    featured: block ? isFeatured(block[1] ?? "") : false,
  }
}

// Published releases only, newest first.
export function toEntries(releases: GithubRelease[]) {
  return releases
    .filter((release) => !release.draft && !release.prerelease && release.published_at)
    .map(parseRelease)
    .sort((a, b) => b.date.localeCompare(a.date))
}

// Consecutive internal releases share one collapsed row so maintenance does not bury the features.
export type ChangelogUnit =
  | { type: "entry"; entry: ChangelogEntry }
  | { type: "maintenance"; entries: [ChangelogEntry, ...ChangelogEntry[]] }

export function groupEntries(entries: ChangelogEntry[]): ChangelogUnit[] {
  const units: ChangelogUnit[] = []
  for (const entry of entries) {
    const last = units.at(-1)
    if (entry.kind !== "internal") units.push({ type: "entry", entry })
    else if (last?.type === "maintenance") last.entries.push(entry)
    else units.push({ type: "maintenance", entries: [entry] })
  }
  return units
}

export function releaseAnchor(version: string) {
  return `v${version}`
}

export function formatReleaseDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(date))
}

export type Announcement = { version: string; title: string; href: string }

// Where the bar remembers the release a reader closed.
export const announcementStorageKey = "sniptide-announcement-dismissed"

// How long a feature release stays in the bar above the header.
export const announcementDays = 14

// The newest featured release from the last two weeks, or nothing. A release is featured only when
// its notes marker says so (the app repo's release-notes workflow sets it from a `featured` PR
// label), so the bar speaks up for launches and stays quiet for routine releases.
export function pickAnnouncement(entries: ChangelogEntry[], now = Date.now()): Announcement | null {
  const cutoff = now - announcementDays * 24 * 60 * 60 * 1000
  const entry = entries.find((item) => item.kind === "feature" && item.featured)
  if (!entry || Date.parse(entry.date) < cutoff) return null
  return {
    version: entry.version,
    title: entry.title,
    href: `${changelogPath}#${releaseAnchor(entry.version)}`,
  }
}
