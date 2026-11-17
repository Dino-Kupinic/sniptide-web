import {
  AppWindowIcon,
  ChevronRightIcon,
  CommandIcon,
  type LucideIcon,
  PlugIcon,
  SquareCodeIcon,
} from "lucide-react"
import { SectionHeading } from "@/components/section-heading"
import { docsPages } from "@/lib/links"

// One tile per place Sniptide runs outside the app, each linking to its guide.
const tools: { icon: LucideIcon; title: string; text: string; href: string }[] = [
  {
    icon: SquareCodeIcon,
    title: "VS Code",
    text: "Share a selection as a link and insert your snippets from the sidebar, in VS Code, Cursor or Windsurf.",
    href: docsPages.vscodeExtension,
  },
  {
    icon: AppWindowIcon,
    title: "Chrome",
    text: "Save the code you select on any page as a paste and copy its link in one keystroke.",
    href: docsPages.browserExtension,
  },
  {
    icon: CommandIcon,
    title: "Raycast",
    text: "Search your pastes and collections from the launcher and paste the code into the app you're in.",
    href: docsPages.raycastExtension,
  },
  {
    icon: PlugIcon,
    title: "Claude Code plugin",
    text: "One install adds the MCP server and five Sniptide skills, and Gemini CLI gets the same as an extension.",
    href: docsPages.agentPlugin,
  },
]

const cellClass = "min-w-0 border-r border-b border-[#e8e8e8] dark:border-[#262626]"

export function Extensions() {
  return (
    <section
      id="extensions"
      data-cta-location="extensions"
      className="flex scroll-mt-4 flex-col gap-10 border-t border-[#e8e8e8] bg-[#fafafa] section-frame py-16 text-[#1b1919] md:gap-14 md:py-20 xl:py-30 dark:border-[#1f1f1f] dark:bg-[#0f0f0f] dark:text-[#f5f5f5]"
    >
      <SectionHeading
        claim="Sniptide comes along wherever you work."
        reason="Save and reuse snippets from your editor, browser, Raycast and Claude Code."
      />

      <ul className="grid border-t border-l border-[#e8e8e8] sm:grid-cols-2 lg:grid-cols-4 dark:border-[#262626]">
        {tools.map((tool) => (
          <li key={tool.title} className={cellClass}>
            <a
              href={tool.href}
              className="group relative flex h-full flex-col gap-2 bg-white p-6 hover:bg-[#f4f4f4] md:p-8 dark:bg-[#0a0a0a] dark:hover:bg-[#151515]"
            >
              <tool.icon
                aria-hidden="true"
                className="mb-2 size-5 text-[#2a26ec] dark:text-[#8f8cff]"
                strokeWidth={1.75}
              />
              <span className="pr-8 text-base leading-5.5 font-semibold">{tool.title}</span>
              <span className="grow text-base leading-6 text-[#6b6b6b] dark:text-[#a3a3a3]">
                {tool.text}
              </span>
              <ChevronRightIcon
                aria-hidden="true"
                className="absolute top-7 right-6 size-4 text-[#6b6b6b] transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none md:top-9 md:right-8 dark:text-[#a3a3a3]"
                strokeWidth={2}
              />
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}
