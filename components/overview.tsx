import { cn } from "@sniptide/ui/lib/utils"
import { ChevronRightIcon } from "lucide-react"
import { LifeField } from "@/components/life-field"
import { SectionHeading } from "@/components/section-heading"
import { type SessionLine, TypedSession } from "@/components/typed-session"
import { documentation } from "@/lib/agent-docs"

// The capability map: every core feature in one view. The small tiles link down to their
// sections, and the agents tile links to the MCP guide, since agents have no section of their own.
// What the large tile shows: an agent finding and reusing a snippet instead of writing it again.
const transcript: SessionLine[] = [
  { kind: "prompt", text: "Add a confirm dialog to the delete button. Use our usual pattern." },
  { kind: "command", text: "sniptide · search_snippets", detail: '("confirm dialog")' },
  { kind: "output", text: "1 match in components" },
  { kind: "command", text: "sniptide · read_snippet", detail: '("k7Qe2x")' },
  { kind: "output", text: "3 files, 84 lines" },
  { kind: "reply", text: "Updated src/components/delete-button.tsx with your confirm dialog." },
]

const tiles = [
  {
    href: "#recipes",
    title: "Folders become recipes",
    text: "Push a folder with its paths, order it in a collection and pull it into the next project.",
    code: "sniptide pull collection:components",
  },
  {
    href: "#secrets",
    title: "Env files stay in sync",
    text: "Encrypted env groups run your app on any machine without printing a value.",
    code: "sniptide env run checkout",
  },
  {
    href: "#sharing",
    title: "Links carry their own rules",
    text: "Expiry, passwords, invites, raw links, revisions and view counts come with every paste.",
    code: "sniptide.com/xhz57h",
  },
  {
    href: "#self-host",
    title: "Self-host with one command",
    text: "One image and a database run the app, the API and the MCP endpoint on your server.",
    code: "docker compose up -d",
  },
]

const cellClass = "min-w-0 border-r border-b border-[#e8e8e8] dark:border-[#262626]"
const tileClass =
  "group relative flex h-full flex-col gap-2 p-6 hover:bg-[#fafafa] md:p-8 dark:hover:bg-[#0f0f0f]"

function Chevron() {
  return (
    <ChevronRightIcon
      aria-hidden="true"
      className="absolute top-7 right-6 size-4 text-[#6b6b6b] transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none md:top-9 md:right-8 dark:text-[#a3a3a3]"
      strokeWidth={2}
    />
  )
}

export function Overview() {
  return (
    <section
      id="features"
      data-cta-location="features"
      className="relative flex scroll-mt-4 flex-col gap-10 overflow-clip section-frame *:relative py-16 text-[#1b1919] md:gap-14 md:py-20 xl:py-30 dark:text-[#f5f5f5]"
    >
      {/* The Game of Life shows only in dark mode, where this section is pitch black. */}
      <LifeField
        live="#f6a9d3"
        trail="#2a26ec"
        density={0.06}
        className="!absolute hidden opacity-20 dark:block"
      />
      <SectionHeading
        claim="Keep your best code in one library."
        reason="Agents, the CLI and your team all pull from it."
      />

      <ul className="grid border-t border-l border-[#e8e8e8] md:grid-cols-2 lg:grid-cols-4 dark:border-[#262626]">
        <li className={cn(cellClass, "md:col-span-2 lg:row-span-2")}>
          <a
            href={documentation.mcp.url}
            className={cn(
              tileClass,
              "justify-between gap-10 bg-[#fafafa] dark:bg-[#0f0f0f] dark:hover:bg-[#151515]",
            )}
          >
            <span className="flex flex-col gap-3 pr-8">
              <span className="font-heading text-[28px] leading-8.5 font-medium tracking-[-0.025em] md:text-4xl md:leading-11">
                Agents reuse your snippets over MCP
              </span>
              <span className="max-w-120 text-base leading-6.5 text-[#6b6b6b] dark:text-[#a3a3a3]">
                Claude Code, Cursor and Codex search your library and read the files before they
                write new code. One sign-in in the browser connects them.
              </span>
            </span>
            {/* The link names the tile, so the transcript stays out of the accessible name. */}
            <span aria-hidden="true" className="flex min-w-0 flex-col">
              <TypedSession lines={transcript} title={["claude", "~/acme/web"]} />
            </span>
            <Chevron />
          </a>
        </li>
        {tiles.map((tile) => (
          <li key={tile.href} className={cellClass}>
            <a href={tile.href} className={tileClass}>
              <span className="pr-8 text-base leading-5.5 font-semibold">{tile.title}</span>
              <span className="grow text-base leading-6 text-[#6b6b6b] dark:text-[#a3a3a3]">
                {tile.text}
              </span>
              <code className="mt-4 truncate font-mono text-[13px] leading-4.5 text-[#1b1919] dark:text-[#f5f5f5]">
                {tile.code}
              </code>
              <Chevron />
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}
