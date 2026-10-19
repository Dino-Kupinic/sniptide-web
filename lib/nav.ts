import { links } from "./links"
import { repoUrl } from "./site"

// The header's mega menus, from "Nav · Final" in the Landing v2 Paper page. Icons are 18×18
// stroke paths. Items whose page doesn't exist yet point at "#", which CTA tracking ignores.

export type NavItem = {
  title: string
  description: string
  href: string
  icon: string
  circles?: [cx: number, cy: number, r: number][]
}

export type NavGroup = { title: string; items: NavItem[] }

const placeholder = "#"
const releases = `${repoUrl}/releases`
const cliGuide = `${repoUrl}/blob/main/packages/cli/README.md`

export const productColumns: NavItem[][] = [
  [
    {
      title: "Pastes",
      description: "Code, logs, notes, any text",
      href: links.newPaste,
      icon: "M4 2h7l3 3v11H4z M7 8h5 M7 11h5",
    },
    {
      title: "Collections",
      description: "Many files under one link",
      href: links.collections,
      icon: "M2 6h10v10H2z M5 3h11v10",
    },
    {
      title: "Expiry and burn",
      description: "Links that end on your terms",
      href: "#features",
      icon: "M9 5v4l3 2",
      circles: [[9, 9, 7]],
    },
    {
      title: "Passwords",
      description: "Lock any link",
      href: "#features",
      icon: "M3 8h12v8H3z M6 8V5a3 3 0 0 1 6 0v3",
    },
    {
      title: "Teams",
      description: "Roles and shared spaces",
      href: placeholder,
      icon: "M2 3h6v6H2z M10 9h6v6h-6z M8 6h5v3",
    },
  ],
  [
    {
      title: "Analytics",
      description: "Every open, live",
      href: "#analytics",
      icon: "M3 16V10 M7 16V5 M11 16V8 M15 16V3",
    },
    {
      title: "Secret scanning",
      description: "Keys flagged before sharing",
      href: "#features",
      icon: "M9 2l6 2v5c0 4-3 6-6 7-3-1-6-3-6-7V4z M6 9l2 2 4-4",
    },
    {
      title: "Audit log",
      description: "Who did what, when",
      href: placeholder,
      icon: "M3 4h12 M3 9h12 M3 14h8",
    },
    {
      title: "Embeds",
      description: "Pastes inside docs",
      href: placeholder,
      icon: "M6 5l-4 4 4 4 M12 5l4 4-4 4",
    },
    {
      title: "Integrations",
      description: "CLI, VS Code, Slack, GitHub",
      href: cliGuide,
      icon: "M2 2h6v6H2z M10 2h6v6h-6z M2 10h6v6H2z M13 10v6 M10 13h6",
    },
  ],
]

export const productLinks = {
  terminal: cliGuide,
  forks: placeholder,
  allFeatures: "#features",
  changelog: releases,
}

export const resourceGroups: NavGroup[] = [
  {
    title: "Learn",
    items: [
      {
        title: "Blog",
        description: "Notes from the team",
        href: placeholder,
        icon: "M3 3h12v12H3z M6 7h6 M6 10h6 M6 13h3",
      },
      {
        title: "Guides",
        description: "Step by step how-tos",
        href: links.docs,
        icon: "M2 4h6v11H2z M10 4h6v11h-6z",
      },
      {
        title: "Changelog",
        description: "Everything we shipped",
        href: releases,
        icon: "M9 2v14 M4 5h5 M9 9h5 M4 13h5",
      },
      {
        title: "Templates",
        description: "Ready-made pastes",
        href: placeholder,
        icon: "M2 2h14v4H2z M2 8h6v8H2z M10 8h6v8h-6z",
      },
    ],
  },
  {
    title: "Community",
    items: [
      {
        title: "GitHub",
        description: "Star, fork, contribute",
        href: links.github,
        icon: "M5 6v6 M13 8c0 3-8 2-8 4",
        circles: [
          [5, 4, 2],
          [5, 14, 2],
          [13, 6, 2],
        ],
      },
      {
        title: "Discord",
        description: "Chat with other users",
        href: placeholder,
        icon: "M2 3h14v9H8l-4 3v-3H2z",
      },
      {
        title: "Showcase",
        description: "What people built",
        href: placeholder,
        icon: "M2 4h14v10H2z M2 11l4-3 3 2 3-3 4 3",
      },
      {
        title: "Roadmap",
        description: "What we build next",
        href: placeholder,
        icon: "M2 9h14 M5 6v6 M10 6v6 M14 6v6",
      },
    ],
  },
  {
    title: "Company",
    items: [
      {
        title: "About",
        description: "Who makes Sniptide",
        href: placeholder,
        icon: "M9 8v5 M9 5v1.5",
        circles: [[9, 9, 7]],
      },
      {
        title: "Careers",
        description: "Join the team",
        href: placeholder,
        icon: "M2 6h14v9H2z M6 6V3h6v3",
      },
      {
        title: "Brand kit",
        description: "Logos and colours",
        href: placeholder,
        icon: "M2 3h14 M2 7h14 M2 11h14 M2 15h14",
      },
      {
        title: "Contact",
        description: "Talk to a human",
        href: placeholder,
        icon: "M2 4h14v10H2z M2 4l7 6 7-6",
      },
    ],
  },
]

export const resourceLinks = {
  selfHost: links.selfHost,
  blogPost: placeholder,
}

export const topLinks = {
  pricing: placeholder,
  docs: links.docs,
}
