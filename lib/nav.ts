import {
  BookOpenIcon,
  BracesIcon,
  FolderSyncIcon,
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
import { documentation } from "./agent-docs"
import { docsPages, links } from "./links"

export type NavItem = {
  label: string
  description: string
  href: string
  icon: ComponentType<{ className?: string }>
  // Leaves Sniptide's own sites, so the row shows an arrow and opens in a new tab.
  external?: boolean
}

export type NavGroup = { label?: string; items: NavItem[] }

export type NavMenu = { label: string; groups: NavGroup[] }

// The header's menus. Section links point at the landing page, which is the only page with this
// header. The mobile menu shows the same items, grouped the same way.
export const navMenus: NavMenu[] = [
  {
    label: "Product",
    groups: [
      {
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
            label: "Env sync",
            description: "Share .env files without printing the keys.",
            href: "#secrets",
            icon: KeyRoundIcon,
          },
          {
            label: "Sharing",
            description: "Send any paste as a link with a password or expiry.",
            href: "#sharing",
            icon: Link2Icon,
          },
          {
            label: "Live demo",
            description: "Try the app as a guest without an account.",
            href: links.demo,
            icon: MonitorPlayIcon,
          },
        ],
      },
    ],
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
  },
  {
    label: "Resources",
    groups: [
      {
        items: [
          {
            label: "Vision",
            description: "Why Sniptide exists and where it is going.",
            href: "/about",
            icon: TelescopeIcon,
          },
          {
            label: "Blog",
            description: "Product news and notes from the team.",
            href: "/blog",
            icon: NewspaperIcon,
          },
          {
            label: "Brand guidelines",
            description: "Logos, colors and type for press and partners.",
            href: "/brand",
            icon: PaletteIcon,
          },
          {
            label: "Contact",
            description: "Reach us with a question or a bug.",
            href: "/contact",
            icon: MailIcon,
          },
          {
            label: "Releases",
            description: "See what changed in each version.",
            href: `${links.github}/releases`,
            icon: TagIcon,
            external: true,
          },
          {
            label: "GitHub",
            description: "Read the code, open an issue or star the repo.",
            href: links.github,
            icon: GitHubMark,
            external: true,
          },
        ],
      },
    ],
  },
]

// Plain links that sit after the menus.
export const navLinks = [{ label: "Docs", href: links.docs, icon: BookOpenIcon }]
