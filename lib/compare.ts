import { z } from "zod"
import data from "@/content/compare/competitors.json"
import { siteUrl } from "./site"

// The facts behind the comparison pages at /compare. They live in one public file,
// content/compare/competitors.json, which the site also serves at /compare/competitors.json, so
// every cell on a page traces back to a source URL and the day someone last checked it.
// docs/compare.md explains how to update a fact.

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/)

// A cell value uses the same notation as the blog's Comparison component: "✓" for yes, "–" for no
// or not documented, "?" when the docs don't say, a leading "~" for partial support, and any other
// text as a short note.
const factSchema = z.object({ value: z.string().min(1), source: z.string(), verified: isoDate })

const productSchema = z.object({
  id: z.string(),
  name: z.string(),
  url: z.url(),
  sources: z.record(z.string(), z.object({ title: z.string(), url: z.url() })),
  facts: z.record(z.string(), factSchema),
})

export const competitorDataSchema = z.object({
  features: z.array(z.object({ id: z.string(), group: z.string(), label: z.string() })),
  products: z.array(productSchema),
})

export type CompetitorData = z.infer<typeof competitorDataSchema>
export type Product = z.infer<typeof productSchema>
export type Fact = z.infer<typeof factSchema>

export const competitorData: CompetitorData = competitorDataSchema.parse(data)

export const comparePath = "/compare"
export const competitorDataPath = "/compare/competitors.json"

export function product(id: string): Product {
  const found = competitorData.products.find((item) => item.id === id)
  if (!found) throw new Error(`No product "${id}" in content/compare/competitors.json`)
  return found
}

// One comparison page. The copy states who each tool fits and when to pick the other one, and it
// only makes claims the data file backs, so a changed fact means checking this copy too.
export type ComparePage = {
  slug: string
  competitor: string
  title: string
  description: string
  // The answer in one or two sentences, under the heading.
  summary: string
  forThem: string
  forSniptide: string
  chooseThem: string[]
  chooseSniptide: string[]
  moving: string
}

const forSniptideBase =
  "Sniptide is for developers who give their coding agents a snippet library, and for teams that want to run it on their own server."

export const comparePages: ComparePage[] = [
  {
    slug: "github-gist",
    competitor: "gist",
    title: "Sniptide vs GitHub Gist",
    description:
      "Sniptide and GitHub Gist compared on sharing controls, revisions, agent access and self-hosting, with a source for every fact and when Gist fits better.",
    summary:
      "Gist is the better home for snippets you want in Git, next to your GitHub account. Sniptide fits when a snippet needs sharing controls, a library your coding agents search, or your own server.",
    forThem:
      "GitHub Gist is for developers who already live on GitHub. Every gist is a Git repository with its full history, it needs nothing beyond your GitHub account, and GitHub's own MCP server lets agents list, read, create and update gists.",
    forSniptide: `${forSniptideBase} A paste holds up to 10 files with a password, expiry, burn after reading or invited people, collections install as agent skills, and the whole app installs on your server with one command.`,
    chooseThem: [
      "You want to clone, push and fork snippets with Git. Sniptide pastes don't work over Git.",
      "Your snippets belong next to your GitHub profile and repositories, and you don't want another account.",
      "Your snippets are public examples that people should fork and star on GitHub.",
    ],
    chooseSniptide: [
      "A link needs a password, an expiry date or burn after reading. Gist has none of them, and GitHub's documentation says that secret gists aren't private.",
      "You want to invite named people to view or edit a private paste.",
      "Your coding agents should search one library and install a collection as a skill, from the hosted app or your own server.",
      "You need to run it yourself. Gist only runs on GitHub.",
    ],
    moving:
      "Sniptide's Import gist copies the files of a public gist into a new paste, from its link or from a list of your own gists.",
  },
  {
    slug: "pastebin",
    competitor: "pastebin",
    title: "Sniptide vs Pastebin",
    description:
      "Sniptide and Pastebin compared on multi-file pastes, privacy, search, agents and self-hosting, with a source for every fact and when Pastebin fits better.",
    summary:
      "Pastebin.com is still the quickest way to post a short public text without an account. Sniptide fits when the code spans several files, has to be found again, or has to stay on your own server.",
    forThem:
      "Pastebin.com is for quick single-file pastes. You can paste without signing up, add a password, an expiry or burn after reading, and get a link right away. It also has folders, a view count and an API.",
    forSniptide: `${forSniptideBase} A paste holds up to 10 files, stays findable through collections, search and revisions, and reaches your agents through an MCP server and a CLI.`,
    chooseThem: [
      "You want to paste without creating an account. Sniptide lets you write a paste first, but it needs an account to share one.",
      "The paste is one short public file and you won't need it again.",
      "Your old pastes already live on Pastebin and you only post a new one now and then.",
    ],
    chooseSniptide: [
      "The code is more than one file. A Sniptide paste holds up to 10, and a Pastebin paste holds one.",
      "You need to find it again, through collections, stars, search across file contents and revisions you can compare and restore.",
      "You want to invite named people, or encrypt a paste in your browser so the server can't read it.",
      "Your coding agents should read and save snippets through an MCP server. Pastebin has an API and no MCP server.",
      "You want to run it yourself. Pastebin is a hosted service and isn't open source.",
    ],
    moving:
      "Copy the raw text of each paste you still use into a new Sniptide paste. Sniptide has no Pastebin importer, so this step is manual.",
  },
  {
    slug: "privatebin",
    competitor: "privatebin",
    title: "Sniptide vs PrivateBin",
    description:
      "Sniptide and PrivateBin compared on encryption, accounts, search, agents and self-hosting, with a source for every fact and when PrivateBin fits better.",
    summary:
      "PrivateBin is the better choice when nobody, including whoever runs the server, should read a paste and nobody should need an account. Sniptide fits when you need to find snippets again, share them with named people or hand them to coding agents.",
    forThem:
      "PrivateBin is for one-time handoffs of sensitive text. Every paste is encrypted in the browser and the server stores only ciphertext, with the key in the part of the link the server never receives. It needs no account, supports passwords, expiry and burn after reading, and runs on your own server under the zlib license.",
    forSniptide: `${forSniptideBase} Most pastes use access rules on the server, so they can be searched, revised and read by agents. A paste you mark as end-to-end encrypted works like a PrivateBin paste.`,
    chooseThem: [
      "Every paste must be end-to-end encrypted. In Sniptide encryption is a choice you make per paste.",
      "Nobody should need an account to create a paste.",
      "You want file or image attachments, which a PrivateBin instance can turn on.",
      "You prefer a permissive license. PrivateBin uses zlib, and Sniptide uses AGPL-3.0.",
    ],
    chooseSniptide: [
      "You'll need the code again. Collections, stars, search and revisions need a server that can read the paste, so PrivateBin has none of them.",
      "You want to invite named people with view or edit access, instead of sending a link that anyone who holds it can open.",
      "Coding agents should search and save snippets through an MCP server or a CLI.",
      "You still want encryption for the odd secret. An end-to-end encrypted Sniptide paste is read in the web app only and can't be edited, and the rest of your library stays searchable.",
    ],
    moving:
      "PrivateBin has no list of your pastes to export. Open each link you still need and copy its text into a new Sniptide paste.",
  },
  {
    slug: "opengist",
    competitor: "opengist",
    title: "Sniptide vs Opengist",
    description:
      "Sniptide and Opengist compared as self-hosted snippet tools, on Git, sharing controls and agent access, with a source for every fact and when Opengist fits.",
    summary:
      "Opengist is the better self-hosted choice when snippets should live in Git, with clone, push and revision history. Sniptide fits when a paste needs a password, burn after reading or invited people, or when your agents need a first-party MCP server on your own server.",
    forThem:
      "Opengist is for developers who think in Git and want a Gist of their own. Every snippet clones and pushes like a repository and keeps its revision history, and snippets carry topics, likes and forks. You sign in with GitHub, GitLab or Gitea, recent releases add expiry and a token REST API with an OpenAPI spec, and the community opengist-mcp server connects it to coding agents.",
    forSniptide: `${forSniptideBase} Both run on your own server under AGPL-3.0. Sniptide adds passwords, burn after reading and invites per paste, warns before you share a key, and ships its own MCP server, which runs on your server too.`,
    chooseThem: [
      "You want to clone, pull and push snippets with Git. Sniptide pastes don't work over Git.",
      "You want a self-hosted copy of the Gist workflow, with forks, likes and topics.",
    ],
    chooseSniptide: [
      "A link needs a password or burn after reading. Opengist has neither.",
      "You want to invite named people to view or edit a private paste.",
      "Your agents should use a first-party MCP server and install a collection as an agent skill. Opengist's MCP server is a community project.",
      "You want a hosted service as well as self-hosting. Opengist has no hosted service.",
    ],
    moving:
      "Clone each Opengist snippet you still use with Git and copy its files into a new Sniptide paste. Sniptide has no Opengist importer, so this step is manual.",
  },
  {
    slug: "microbin",
    competitor: "microbin",
    title: "Sniptide vs MicroBin",
    description:
      "Sniptide and MicroBin compared as self-hosted pastebins, on uploads, privacy, search and agent access, with a source for every fact and when MicroBin fits.",
    summary:
      "MicroBin is the better choice for the smallest self-hosted pastebin, with file uploads and pastes without an account. Sniptide fits when you'll need the code again, share it with named people, or want your coding agents to reach it.",
    forThem:
      "MicroBin is the lightest self-hosted option: one small app for text, file uploads and raw links. Visitors paste without an account and can set a password, an expiry or burn after reading. Its README lists a server-side and a client-side encryption mode, so check which one an instance uses. It is open source under BSD-3-Clause.",
    forSniptide: `${forSniptideBase} It keeps pastes findable through collections, stars, search and revisions, and reaches agents through an MCP server and a CLI, hosted or on your own server.`,
    chooseThem: [
      "You want the smallest app to run and maintain, and nobody needs an account.",
      "Visitors should paste text or upload files without signing up. Sniptide needs an account to share a paste and holds code and text only.",
      "You prefer a permissive license. MicroBin uses BSD-3-Clause, and Sniptide uses AGPL-3.0.",
    ],
    chooseSniptide: [
      "You'll need a paste again, through collections, stars, search or revisions. MicroBin has none of them.",
      "You want to invite named people to a private paste, or give a paste a custom link.",
      "Your coding agents should read and save snippets through an MCP server or a CLI. MicroBin has neither.",
      "You want a hosted service as well as self-hosting. MicroBin has no hosted service.",
    ],
    moving:
      "Sniptide has no MicroBin importer, so copy the raw text of each paste you still need into a new Sniptide paste.",
  },
  {
    slug: "hastebin",
    competitor: "hastebin",
    title: "Sniptide vs Hastebin",
    description:
      "Sniptide and Hastebin compared on expiry, privacy, multi-file pastes, agents and self-hosting, with a source for every fact and when Hastebin fits better.",
    summary:
      "Hastebin is the quicker choice for a throwaway text link with no account and no options. Sniptide fits when a paste has to last longer than a month, stay private, or be found again.",
    forThem:
      "Hastebin is a blank page that turns text into a link, with no account and no options. Toptal runs it now. Pastes expire after 7 days, or 30 when the API is used with a token, and there are no passwords or private pastes, so the link is the secret. The original haste-server repository is no longer on GitHub, and self-hosting means a community fork whose last npm release dates from 2022.",
    forSniptide: `${forSniptideBase} A paste holds up to 10 files with a password, expiry, burn after reading or invited people, and stays findable through collections, search and revisions.`,
    chooseThem: [
      "You want a link in seconds, without an account or a single setting.",
      "The text only matters for a few days, so a paste that expires after 7 days is fine.",
      "You already post from scripts through its API.",
    ],
    chooseSniptide: [
      "The paste has to stay up for longer than 30 days.",
      "It should be private, behind a password or shared with named people. Anyone who holds a Hastebin link can open it.",
      "The code spans several files, or you'll need to find it again through collections, search and revisions.",
      "Your coding agents should reach your snippets through an MCP server or a CLI.",
      "You want to self-host. Hastebin's self-hosted version is a community fork whose last npm release dates from 2022.",
    ],
    moving:
      "Hastebin deletes pastes after 7 or 30 days, so copy the text of any paste you still need into a new Sniptide paste before it expires.",
  },
  {
    slug: "pastes-io",
    competitor: "pastesio",
    title: "Sniptide vs Pastes.io",
    description:
      "Sniptide and Pastes.io compared on screenshots, multi-file pastes, privacy, agents and self-hosting, with a source for every fact and when Pastes.io fits.",
    summary:
      "Pastes.io is the better pick when the problem is visual: a screenshot, a screen recording or a file, shared without an account. Sniptide fits when the code spans several files, has to be found again, or has to run on your own server.",
    forThem:
      "Pastes.io is for visual problems. It captures and annotates a screenshot or records your screen, attaches files and needs no account. It has a CLI, an API and a first-party MCP server. Passwords, burn after reading, raw links and longer expiry need the Pro plan, a paste holds one text body plus files, and it only runs as a hosted service.",
    forSniptide: `${forSniptideBase} A paste holds up to 10 files with a password, expiry, burn after reading or invited people, and Sniptide's MCP server also runs on your own server.`,
    chooseThem: [
      "You need to share a screenshot, a screen recording or a file. Sniptide holds code and text only.",
      "Nobody should need an account. Sniptide needs one to share a paste.",
    ],
    chooseSniptide: [
      "The code is more than one file. A Pastes.io paste holds one text body.",
      "You want to invite named people to view or edit a private paste.",
      "You need to find code again through revisions, stars and search across file contents. Pastes.io's Free plan searches titles.",
      "You want to run it yourself. Pastes.io is a hosted service only.",
    ],
    moving:
      "Copy the text of each paste you still use into a new Sniptide paste. Sniptide has no Pastes.io importer, and screenshots and recordings stay on Pastes.io.",
  },
]

export function comparePage(slug: string) {
  return comparePages.find((page) => page.slug === slug)
}

export function comparePagePath(slug: string) {
  return `${comparePath}/${slug}`
}

export function compareMarkdownPath(slug: string) {
  return `${comparePagePath(slug)}.md`
}

export type CompareCell = Fact & { sourceTitle: string; sourceUrl: string }
export type CompareRow = { id: string; label: string; cells: CompareCell[] }
export type CompareGroup = { label: string; rows: CompareRow[] }

function cell(item: Product, featureId: string): CompareCell {
  const fact = item.facts[featureId]
  if (!fact) throw new Error(`${item.name} has no fact for "${featureId}"`)
  const source = item.sources[fact.source]
  if (!source) throw new Error(`${item.name} cites unknown source "${fact.source}"`)
  return { ...fact, sourceTitle: source.title, sourceUrl: source.url }
}

// The table for a set of products, in the data file's feature order. A row where every product
// says no tells the reader nothing about the choice, so it is left out.
export function compareGroups(products: Product[]): CompareGroup[] {
  const groups: CompareGroup[] = []
  for (const feature of competitorData.features) {
    const cells = products.map((item) => cell(item, feature.id))
    if (cells.every((item) => item.value === "–")) continue
    let group = groups.at(-1)
    if (group?.label !== feature.group) {
      group = { label: feature.group, rows: [] }
      groups.push(group)
    }
    group.rows.push({ id: feature.id, label: feature.label, cells })
  }
  return groups
}

// The sources a table cites, per product, each with the most recent day one of its facts was
// checked.
export function compareSources(products: Product[], groups: CompareGroup[]) {
  return products.map((item, column) => {
    const byUrl = new Map<string, { title: string; url: string; verified: string }>()
    for (const row of groups.flatMap((group) => group.rows)) {
      const fact = row.cells[column]
      if (!fact) continue
      const known = byUrl.get(fact.sourceUrl)
      if (!known || known.verified < fact.verified) {
        byUrl.set(fact.sourceUrl, {
          title: fact.sourceTitle,
          url: fact.sourceUrl,
          verified: fact.verified,
        })
      }
    }
    return { product: item, sources: [...byUrl.values()] }
  })
}

// The oldest check behind a table, which is what the caption promises.
function verifiedDates(groups: CompareGroup[]) {
  const dates = groups
    .flatMap((group) => group.rows.flatMap((row) => row.cells.map((item) => item.verified)))
    .sort()
  if (dates.length === 0) throw new Error("A comparison needs at least one row")
  return dates as [string, ...string[]]
}

export function oldestVerified(groups: CompareGroup[]) {
  return verifiedDates(groups)[0]
}

export function newestVerified(groups: CompareGroup[]) {
  const dates = verifiedDates(groups)
  return dates[dates.length - 1] ?? dates[0]
}

export function formatVerified(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`))
}

export function comparison(page: ComparePage) {
  const products: [Product, Product] = [product("sniptide"), product(page.competitor)]
  const groups = compareGroups(products)
  return {
    products,
    groups,
    sources: compareSources(products, groups),
    oldest: oldestVerified(groups),
    newest: newestVerified(groups),
  }
}

// Plain text for a cell, for the Markdown twin and screen readers.
export function cellText(value: string) {
  if (value === "✓") return "Yes"
  if (value === "–") return "No"
  if (value === "?") return "Not documented"
  if (value.startsWith("~")) return `Partly: ${value.slice(1)}`
  return value
}

export function renderCompareMarkdown(page: ComparePage) {
  const { products, groups, sources, oldest, newest } = comparison(page)
  const them = products[1].name
  const header = `| | ${products.map((item) => item.name).join(" | ")} |`
  const divider = `| --- | ${products.map(() => "---").join(" | ")} |`
  const rows = groups.flatMap((group) => [
    `| **${group.label}** | ${products.map(() => "").join(" | ")} |`,
    ...group.rows.map(
      (row) => `| ${row.label} | ${row.cells.map((item) => cellText(item.value)).join(" | ")} |`,
    ),
  ])
  const sourceLines = sources.flatMap(({ product: item, sources: list }) =>
    list.map(
      (source) =>
        `- ${item.name}: [${source.title}](${source.url}), verified ${formatVerified(source.verified)}`,
    ),
  )
  return `# ${page.title}

${page.summary}

Sniptide publishes this comparison. Every fact comes from the source listed below, and the data is public at ${siteUrl}${competitorDataPath}.

## Who each tool is for

${page.forThem}

${page.forSniptide}

## Side by side

${[header, divider, ...rows].join("\n")}

From each tool's own documentation, checked between ${formatVerified(oldest)} and ${formatVerified(newest)}. "No" also covers features the docs don't mention.

## Choose ${them} if

${page.chooseThem.map((item) => `- ${item}`).join("\n")}

## Choose Sniptide if

${page.chooseSniptide.map((item) => `- ${item}`).join("\n")}

## Moving from ${them}

${page.moving}

## Sources

${sourceLines.join("\n")}
`
}

// WebPage and breadcrumb structured data for a comparison page.
export function compareStructuredData(page: ComparePage) {
  const { newest } = comparison(page)
  const url = `${siteUrl}${comparePagePath(page.slug)}`
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": url,
        url,
        name: page.title,
        description: page.description,
        dateModified: newest,
        isPartOf: { "@id": `${siteUrl}/#website` },
        publisher: { "@id": `${siteUrl}/#organization` },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Compare", item: `${siteUrl}${comparePath}` },
          { "@type": "ListItem", position: 2, name: page.title, item: url },
        ],
      },
    ],
  }
}

export const compareDescription =
  "How Sniptide compares to Gist, Pastebin, PrivateBin, Opengist, MicroBin, Hastebin and Pastes.io, with a source for every fact and when each tool fits better."
