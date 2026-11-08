import {
  BookOpenIcon,
  BracesIcon,
  ChartColumnIcon,
  DownloadIcon,
  FolderSyncIcon,
  HistoryIcon,
  KeyRoundIcon,
  LayoutTemplateIcon,
  LibraryBigIcon,
  Link2Icon,
  MailIcon,
  MonitorPlayIcon,
  NewspaperIcon,
  PackageIcon,
  PaletteIcon,
  PlugIcon,
  ServerIcon,
  ShieldCheckIcon,
  SquareTerminalIcon,
  TagIcon,
  TelescopeIcon,
} from "lucide-react"
import type { ComponentType } from "react"
import { GitHubMark } from "@/components/github-mark"
import { documentation, mcpEndpoint } from "./agent-docs"
import { docsPages, links } from "./links"

export type NavItem = {
  label: string
  description: string
  href: string
  icon: ComponentType<{ className?: string }>
  // Leaves Sniptide's own sites, so the row shows an arrow and opens in a new tab.
  external?: boolean
}

export type NavGroup = { label: string; items: NavItem[] }

// The last column of a menu: one link with a picture, a sentence and a call to action.
export type NavFeature = NavItem & { action: string; visual: "demo" | "terminal" | "github" }

// The line under a menu's columns: an identifier worth copying, such as a command, or one link
// worth reading next, such as the latest blog post.
export type NavStrip =
  | { kind: "copy"; label: string; value: string }
  | { kind: "link"; label: string; title: string; href: string; note?: string }

export type NavMenu = { label: string; groups: NavGroup[]; feature: NavFeature; strip: NavStrip }

// The header's menus. Section links point at the landing page, which is the only page with this
// header. The mobile menu and the footer list the same items in the same order.
export const navMenus: NavMenu[] = [
  {
    label: "Product",
    groups: [
      {
        label: "Save and reuse",
        items: [
          {
            label: "Snippet library",
            description: "Keep the code you reuse where agents can find it.",
            href: "#features",
            icon: LibraryBigIcon,
          },
          {
            label: "Folder sync",
            description: "Save a folder once and pull it anywhere.",
            href: "#recipes",
            icon: FolderSyncIcon,
          },
          {
            label: "Revisions",
            description: "Every edit is kept, so you can compare and go back.",
            href: docsPages.revisions,
            icon: HistoryIcon,
          },
          {
            label: "Gist import",
            description: "Bring your GitHub gists over in one step.",
            href: docsPages.importGist,
            icon: DownloadIcon,
          },
        ],
      },
      {
        label: "Share and sync",
        items: [
          {
            label: "Sharing",
            description: "Send any paste as a link with a password or expiry.",
            href: "#sharing",
            icon: Link2Icon,
          },
          {
            label: "Env sync",
            description: "Share .env files without printing the keys.",
            href: "#secrets",
            icon: KeyRoundIcon,
          },
          {
            label: "Analytics",
            description: "See how often each paste is opened.",
            href: docsPages.analytics,
            icon: ChartColumnIcon,
          },
        ],
      },
    ],
    feature: {
      label: "Live demo",
      description: "Try the app as a guest, with nothing to install and no account to create.",
      action: "Open the demo",
      href: links.demo,
      icon: MonitorPlayIcon,
      visual: "demo",
    },
    strip: {
      kind: "copy",
      label: "Run it on your own server",
      value: "curl -fsSL https://sniptide.com/install.sh | sh",
    },
  },
  {
    label: "Developers",
    groups: [
      {
        label: "Connect an agent",
        items: [
          {
            label: "MCP server",
            description: "Let agents search, read and save snippets.",
            href: documentation.mcp.url,
            icon: PlugIcon,
          },
          {
            label: "CLI",
            description: "Push and pull pastes from your terminal.",
            href: documentation.cli.url,
            icon: SquareTerminalIcon,
          },
          {
            label: "OAuth sign-in",
            description: "Connect an agent without pasting a token.",
            href: documentation.oauth.url,
            icon: ShieldCheckIcon,
          },
        ],
      },
      {
        label: "Build and run",
        items: [
          {
            label: "REST API",
            description: "Read and write pastes over HTTP.",
            href: links.apiDocs,
            icon: BracesIcon,
          },
          {
            label: "SDKs",
            description: "Call Sniptide from your own code.",
            href: docsPages.sdks,
            icon: PackageIcon,
          },
          {
            label: "Self-hosting",
            description: "Run it on your own server with Docker.",
            href: links.selfHost,
            icon: ServerIcon,
          },
        ],
      },
    ],
    feature: {
      label: "Documentation",
      description: "Guides for every feature, from your first paste to running your own server.",
      action: "Read the docs",
      href: links.docs,
      icon: BookOpenIcon,
      visual: "terminal",
    },
    strip: { kind: "copy", label: "MCP endpoint", value: mcpEndpoint },
  },
  {
    label: "Resources",
    groups: [
      {
        label: "About",
        items: [
          {
            label: "Vision",
            description: "Why Sniptide exists and where it is going.",
            href: "/vision",
            icon: TelescopeIcon,
          },
          {
            label: "Blog",
            description: "Product news and notes on building Sniptide.",
            href: "/blog",
            icon: NewspaperIcon,
          },
          {
            label: "Templates",
            description: "Copy agent files and config, from CLAUDE.md to Compose.",
            href: "/templates",
            icon: LayoutTemplateIcon,
          },
          {
            label: "Contact",
            description: "Reach us with a question or a bug.",
            href: "/contact",
            icon: MailIcon,
          },
        ],
      },
      {
        label: "Brand and releases",
        items: [
          {
            label: "Brand guidelines",
            description: "The logo, colors and type, and how to use them.",
            href: "/brand",
            icon: PaletteIcon,
          },
          {
            label: "Releases",
            description: "See what changed in each version.",
            href: `${links.github}/releases`,
            icon: TagIcon,
            external: true,
          },
        ],
      },
    ],
    feature: {
      label: "Open source",
      description:
        "Sniptide is open source under the AGPL. Read the code, open an issue or star it.",
      action: "View on GitHub",
      href: links.github,
      icon: GitHubMark,
      external: true,
      visual: "github",
    },
    // Shown until the first post ships. Pages that know the newest post pass it to the header,
    // which puts it here in place of this one (resolveNavMenus).
    strip: {
      kind: "link",
      label: "From the blog",
      title: "Why we built a pastebin for agents",
      href: "/blog",
      note: "Coming soon",
    },
  },
]

export type LatestPost = { title: string; href: string }

// Section links ("#recipes") point at the landing page. On any other page they need the landing
// page's path in front, and /home serves it to every visitor, signed in or not.
export function sectionHref(href: string, sectionBase: string) {
  return href.startsWith("#") ? `${sectionBase}${href}` : href
}

// The menus as a page shows them: section links prefixed for pages other than the landing page, and
// the newest blog post in the strip that links to the blog.
export function resolveNavMenus({
  sectionBase = "",
  latestPost,
}: {
  sectionBase?: string
  latestPost?: LatestPost | null
}): NavMenu[] {
  return navMenus.map((menu) => ({
    ...menu,
    groups: menu.groups.map((group) => ({
      ...group,
      items: group.items.map((item) => ({ ...item, href: sectionHref(item.href, sectionBase) })),
    })),
    strip:
      latestPost && menu.strip.kind === "link" && menu.strip.href === "/blog"
        ? { kind: "link", label: menu.strip.label, title: latestPost.title, href: latestPost.href }
        : menu.strip,
  }))
}

// Every link in a menu, in the order the mobile menu and the footer list them.
export function menuItems(menu: NavMenu): NavItem[] {
  return [...menu.groups.flatMap((group) => group.items), menu.feature]
}

// Plain links that sit after the menus.
// Docs lives on its own site, so it carries an arrow like the other links that leave this one.
export const navLinks = [{ label: "Docs", href: links.docs }]
