// The "Sniptide vs X" pages. Every claim comes from docs/competitors.md in Dino-Kupinic/sniptide,
// which lists the sources and the date each competitor column was checked. Re-check a row there
// before changing it here, and change the date below when you do.
export const comparisonsChecked = "16 October 2026"

export type Comparison = {
  slug: string
  name: string
  // The <title> and Open Graph title. Kept to 60 characters so search results don't cut it.
  title: string
  description: string
  // The one-sentence summary on the landing page.
  summary: string
  // The line under the headline on the link-preview image.
  imageSummary: string
  lead: string
  rows: { label: string; sniptide: string; other: string }[]
  sections: { heading: string; paragraphs: string[] }[]
  sources: { label: string; href: string }[]
}

export const comparisons: Comparison[] = [
  {
    slug: "github-gist",
    name: "GitHub Gist",
    title: "Sniptide vs GitHub Gist: a self-hosted alternative",
    description:
      "How Sniptide and GitHub Gist differ on privacy, self-hosting, expiry, collections and agent access, and when a gist is still the better choice.",
    summary: "The same quick link on your own server, with passwords, expiry and burn-after-read.",
    imageSummary:
      "Privacy, self-hosting and agent access, and when a gist is still the better fit.",
    lead: "GitHub Gist is where most developers already share a snippet, and every gist is a git repository you can clone and fork. Sniptide gives you the same quick link on a server you run, with sharing rules for each paste and an MCP endpoint for your coding agents.",
    rows: [
      {
        label: "Hosting",
        sniptide: "Hosted at sniptide.com, or self-hosted with one Docker image and Postgres",
        other: "Hosted on github.com",
      },
      {
        label: "Visibility",
        sniptide: "Private, unlisted or public",
        other:
          "Public or secret. Anyone with the link can open a secret gist, and GitHub says secret gists are not private",
      },
      {
        label: "Link rules",
        sniptide:
          "A password, an expiry of one hour to one month (or never) and burn after reading",
        other: "Not documented",
      },
      {
        label: "Sharing",
        sniptide: "A link, or view and edit access for specific people",
        other: "A link, fork and clone",
      },
      {
        label: "History",
        sniptide: "Revisions with rollback",
        other: "The full git history, with diffs",
      },
      {
        label: "Organization",
        sniptide: "Collections, tags, search, stars and a trash",
        other: "Stars, and each gist is its own repository",
      },
      {
        label: "API",
        sniptide: "A token API under /api/v1 with an OpenAPI document",
        other: "A REST API",
      },
      {
        label: "Coding agents",
        sniptide: "A built-in MCP endpoint and a CLI",
        other: "No first-party MCP server found, though community servers exist",
      },
      {
        label: "Analytics",
        sniptide:
          "Views, unique visitors, copies, referrers and countries, without cookies, stored in your own database",
        other: "Not documented",
      },
      {
        label: "Price",
        sniptide: "Free during early access, with no paid plan yet",
        other: "Free",
      },
    ],
    sections: [
      {
        heading: "When Gist is the better choice",
        paragraphs: [
          "Gist is a git repository, so you can clone it, fork it and diff any two versions. Sniptide keeps revisions and lets you roll back, but it has no fork and no git remote.",
          "Gist is also where developers already are. It has discovery, comments and embeds, and a link to a gist is familiar to whoever opens it. Sniptide has no network of its own yet.",
        ],
      },
      {
        heading: "When Sniptide is the better choice",
        paragraphs: [
          "Choose Sniptide when the snippet should live on a server you control, or when a link needs a password, an expiry or burn-after-read. A private Sniptide paste opens only for you, and you can give specific people view or edit access.",
          "Sniptide stores paste text unencrypted in Postgres, so whoever runs the server can read it, and its protection is access control.",
          "Your coding agents can search, read and save snippets through the MCP endpoint, which also works on a self-hosted instance. Setup is a clone and a build for now, because the CLI and the MCP package are not on npm yet.",
        ],
      },
      {
        heading: "Moving a gist to Sniptide",
        paragraphs: [
          "Give Sniptide the link to a public gist and it copies the files into a new paste. The paste starts from the gist's current files and has none of its commit history, so keep the gist if you still need the history.",
        ],
      },
    ],
    sources: [
      {
        label: "GitHub's gist documentation",
        href: "https://docs.github.com/en/get-started/writing-on-github/editing-and-sharing-content-with-gists/creating-gists",
      },
      { label: "its REST API", href: "https://docs.github.com/en/rest/gists/gists" },
    ],
  },
  {
    slug: "pastebin",
    name: "Pastebin",
    title: "Sniptide vs Pastebin: an open-source alternative",
    description:
      "How Sniptide and Pastebin differ on limits, private pastes, accounts, self-hosting and agent access, and where Pastebin still has the edge.",
    summary: "Open source, with accounts, revisions and tools for your coding agents.",
    imageSummary: "Limits, private pastes and self-hosting, and where Pastebin still has the edge.",
    lead: "Pastebin is a hosted service that people have used for years to share a block of text, and its free plan shows ads and limits how many pastes you can keep private. Sniptide is open source, so you can use it at sniptide.com or run it yourself.",
    rows: [
      {
        label: "Hosting",
        sniptide: "Hosted at sniptide.com, or self-hosted with one Docker image and Postgres",
        other: "Hosted at pastebin.com",
      },
      { label: "License", sniptide: "AGPL-3.0", other: "Not documented" },
      {
        label: "Private pastes",
        sniptide:
          "Visible only to you, and limited only by the account's 10,000 pastes (the default)",
        other: "Free accounts hold 10 private and 10 unlisted pastes, and Pro accounts hold more",
      },
      {
        label: "Paste size",
        sniptide: "1 MiB and 10 files per paste (the defaults)",
        other: "500 KB on free accounts and 10 MB on Pro",
      },
      {
        label: "Account limits",
        sniptide: "10,000 pastes and 1 GiB per account (the defaults)",
        other: "20 new pastes a day on free accounts and 250 on Pro",
      },
      {
        label: "Expiry",
        sniptide: "One hour, one day, one week, one month or never",
        other: "From 10 minutes up to one year, or never",
      },
      {
        label: "Link rules",
        sniptide: "A password and burn after reading",
        other: "Not documented",
      },
      {
        label: "History",
        sniptide: "Revisions with rollback",
        other: "Not documented",
      },
      {
        label: "Organization",
        sniptide: "Collections, tags, search, stars and a trash",
        other: "Folders, for accounts",
      },
      {
        label: "API",
        sniptide: "A token API under /api/v1 with an OpenAPI document",
        other: "An HTTP API that needs a developer key",
      },
      {
        label: "Coding agents",
        sniptide: "A built-in MCP endpoint and a CLI",
        other: "No first-party MCP server found",
      },
      {
        label: "Price",
        sniptide: "Free during early access, with no ads and no paid plan yet",
        other:
          "Free with ads. Pro removes the ads and raises the limits, and its page said it was sold out",
      },
    ],
    sections: [
      {
        heading: "Where Pastebin is the better choice",
        paragraphs: [
          "Pastebin offers shorter expiry times than Sniptide. Its options start at 10 minutes, while Sniptide's shortest expiry is one hour. Pastebin also reaches further, with years of search traffic and a name that most developers recognize.",
        ],
      },
      {
        heading: "What the free plans allow",
        paragraphs: [
          "A free Pastebin account can create 20 pastes a day, each up to 500 KB, and keep 10 private and 10 unlisted pastes. Sniptide's defaults are 1 MiB and 10 files per paste, with 10,000 pastes and 1 GiB per account, and a self-hosted instance can raise the per-paste size.",
          "Sniptide is free during early access, and a paid plan may come later.",
        ],
      },
      {
        heading: "What you get beyond a single paste",
        paragraphs: [
          "Sniptide groups pastes into collections, keeps revisions you can roll back to, and shows how often each link was opened, without cookies. Your coding agents can search and read the same snippets through the MCP endpoint and the CLI.",
          "Sniptide stores paste text unencrypted in Postgres, so whoever runs the server can read it. A private paste opens only for its owner and the people you share it with.",
        ],
      },
    ],
    sources: [
      { label: "its Pro page", href: "https://pastebin.com/pro" },
      { label: "its API documentation", href: "https://pastebin.com/doc_api" },
    ],
  },
  {
    slug: "privatebin",
    name: "PrivateBin",
    title: "Sniptide vs PrivateBin: which self-hosted pastebin?",
    description:
      "Both are self-hostable pastebins. See how Sniptide and PrivateBin differ on encryption, accounts, collections, the API and agent access.",
    summary:
      "Both self-host. PrivateBin encrypts in the browser, and Sniptide adds accounts, collections and agent tools.",
    imageSummary: "Browser-side encryption on one side, accounts and agent tools on the other.",
    lead: "PrivateBin and Sniptide are both open-source pastebins that you run on your own server, and they make different trade-offs. PrivateBin encrypts every paste in the browser so the server never sees it, and Sniptide offers accounts, collections and an API on top of paste text that the server can read.",
    rows: [
      {
        label: "Self-hosting",
        sniptide:
          "A Docker image for amd64 and arm64, a Compose file and a Coolify template, with Postgres",
        other: "PHP, with files or a database",
      },
      { label: "License", sniptide: "AGPL-3.0", other: "zlib/libpng" },
      {
        label: "Encryption",
        sniptide:
          "Passwords are hashed and traffic uses HTTPS. Paste text is stored unencrypted in Postgres, so the operator can read it",
        other:
          "AES-256-GCM in the browser, with the key in the part of the link after the #. The server cannot read a paste",
      },
      {
        label: "Accounts",
        sniptide:
          "Email and password, with optional GitHub and Google sign-in. Sign-up can be closed or limited to an invite list",
        other: "No accounts",
      },
      {
        label: "Organization",
        sniptide: "Collections, tags, search, stars and a trash",
        other: "None documented",
      },
      {
        label: "Sharing",
        sniptide: "Private, unlisted or public, and view or edit access for specific people",
        other: "A link that carries the key",
      },
      {
        label: "Expiry",
        sniptide: "One hour, one day, one week, one month or never",
        other: "Set by the admin, including never",
      },
      {
        label: "Password and burn after reading",
        sniptide: "Both",
        other: "Both",
      },
      {
        label: "History",
        sniptide: "Revisions with rollback",
        other: "Not documented",
      },
      {
        label: "API",
        sniptide: "A token API under /api/v1 with an OpenAPI document",
        other:
          "Plain curl does not work because encryption happens in the client. Community command-line clients exist",
      },
      {
        label: "Coding agents",
        sniptide: "A built-in MCP endpoint and a CLI",
        other: "No first-party MCP server found",
      },
      {
        label: "Price",
        sniptide: "Free during early access, with no paid plan yet",
        other: "Free when self-hosted",
      },
    ],
    sections: [
      {
        heading: "Who can read a paste",
        paragraphs: [
          "PrivateBin encrypts a paste in the browser with AES-256-GCM and puts the key in the part of the link after the #, which browsers do not send to the server. The server only stores ciphertext, so even the person who runs it cannot read a paste.",
          "Sniptide protects a paste with access control. A private paste opens only for its owner, passwords are hashed and links can expire or burn after reading, but the server stores the text unencrypted in Postgres and whoever runs it can read everything. Environment values are encrypted at rest with a key that sits on the same server.",
          "Choose PrivateBin when the people reading a paste should not have to trust the server. This is the strongest reason to pick it over Sniptide.",
        ],
      },
      {
        heading: "Why teams still pick Sniptide",
        paragraphs: [
          "Because PrivateBin has no accounts, it has no list of your pastes, no collections and no search. Browser-side encryption also keeps plain curl from working, so scripts need a community client. Sniptide gives each person a library with collections, tags, stars and revisions, a token API, and raw links that a shell can fetch.",
          "Sniptide also serves your snippets to coding agents through an MCP endpoint that works on a self-hosted instance too. Setup is a clone and a build for now, because the CLI and the MCP package are not on npm yet.",
        ],
      },
    ],
    sources: [
      { label: "its README", href: "https://github.com/PrivateBin/PrivateBin" },
      { label: "its FAQ", href: "https://github.com/PrivateBin/PrivateBin/wiki/FAQ" },
    ],
  },
]

export function comparisonPath(slug: string) {
  return `/vs/${slug}`
}

export function getComparison(slug: string) {
  return comparisons.find((comparison) => comparison.slug === slug)
}
