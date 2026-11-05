import {
  BookOpenIcon,
  BracesIcon,
  ChartColumnIcon,
  DownloadIcon,
  FolderSyncIcon,
  HistoryIcon,
  KeyRoundIcon,
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
import { operator } from "./legal"
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

// The line under a menu's columns: one identifier worth copying, such as a command or an address.
export type NavStrip = { label: string; value: string; href?: string }

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
    strip: { label: "MCP endpoint", value: mcpEndpoint },
  },
  {
    label: "Resources",
    groups: [
      {
        label: "Company",
        items: [
          {
            label: "Vision",
            description: "Why Sniptide exists and where it is going.",
            href: "/vision",
            icon: TelescopeIcon,
          },
          {
            label: "Blog",
            description: "Product news and notes from the team.",
            href: "/blog",
            icon: NewspaperIcon,
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
        label: "Press and releases",
        items: [
          {
            label: "Brand guidelines",
            description: "Logos, colors and type for press and partners.",
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
    strip: {
      label: "Press and partnerships",
      value: operator.email,
      href: `mailto:${operator.email}`,
    },
  },
]

// Every link in a menu, in the order the mobile menu and the footer list them.
export function menuItems(menu: NavMenu): NavItem[] {
  return [...menu.groups.flatMap((group) => group.items), menu.feature]
}

// Plain links that sit after the menus.
export const navLinks = [{ label: "Docs", href: links.docs }]
