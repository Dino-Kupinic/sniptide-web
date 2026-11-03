import { cn } from "@sniptide/ui/lib/utils"
import { ChevronRightIcon, SearchIcon } from "lucide-react"
import { SectionHeading } from "@/components/section-heading"
import { documentation } from "@/lib/agent-docs"

const tools = [
  { name: "search_snippets", text: "Finds a match by words, tags, language or collection." },
  { name: "read_snippet", text: "Returns the files with their paths and where they came from." },
  { name: "fetch_collection", text: "Follows a recipe one step at a time, in order." },
  { name: "create_snippet", text: "Saves a new pattern, private unless you say otherwise." },
  { name: "update_snippet", text: "Edits one, and only with a token that allows writes." },
]

const library = [
  { file: "use-debounce.ts", collection: "hooks", language: "TypeScript" },
  { file: "confirm-dialog.tsx", collection: "ui · step 4", language: "React", match: true },
  { file: "nginx.conf", collection: "infra", language: "Nginx" },
  { file: "toast.tsx", collection: "ui · step 3", language: "React" },
  { file: "deployment.yaml", collection: "infra", language: "YAML" },
]

function Terminal() {
  return (
    <div className="min-w-0 overflow-hidden rounded-lg border border-[#2c2a2a] bg-[#1b1919] font-mono text-xs leading-5 text-[#d4d4d4]">
      <div className="flex h-9 items-center justify-between border-b border-[#2c2a2a] px-3.5 text-[11px] text-[#6b6b6b]">
        <span>claude</span>
        <span>~/acme/web</span>
      </div>
      <div className="flex flex-col gap-3 px-4 pt-4 pb-5">
        <p className="text-white">
          <span className="text-[#6b6b6b]">&gt; </span>Add a confirm dialog to the delete button.
          Use our usual pattern.
        </p>
        <div className="flex flex-col gap-1">
          <p>
            <span className="text-[#8f8cff]">● </span>sniptide · search_snippets
            <span className="text-[#8a8a8a]">("confirm dialog")</span>
          </p>
          <p className="pl-3.5 text-[#8a8a8a]">⎿ 1 match in ui</p>
          <p>
            <span className="text-[#8f8cff]">● </span>sniptide · read_snippet
            <span className="text-[#8a8a8a]">("k7Qe2x")</span>
          </p>
          <p className="pl-3.5 text-[#8a8a8a]">⎿ 2 files, 84 lines</p>
          <p>
            <span className="text-[#f6a9d3]">● </span>Update src/components/delete-button.tsx
          </p>
        </div>
        <p className="flex items-center gap-1 text-[#6b6b6b]">
          &gt;
          <span className="h-3.5 w-1.75 bg-[#d4d4d4] motion-safe:animate-pulse" />
        </p>
      </div>
    </div>
  )
}

// The MCP connection between the agent and the library: the query goes out, the match comes back.
function Pipe() {
  return (
    <div className="flex items-center justify-center py-1 font-mono text-[11px] leading-4 text-[#6b6b6b] md:py-0 dark:text-[#8a8a8a]">
      <div className="flex flex-row items-center gap-4 md:w-full md:flex-col md:gap-2">
        <span className="hidden md:block">query →</span>
        <div className="relative h-12 w-px border-l border-dashed border-[#2a26ec] md:h-px md:w-full md:border-t md:border-l-0 dark:border-[#8f8cff]">
          <span className="absolute -top-1 -left-1 size-2 bg-[#2a26ec] md:top-[-4.5px] md:left-1/3 dark:bg-[#8f8cff]" />
        </div>
        <span className="rounded-sm border border-[#2a26ec] px-1.5 text-[#2a26ec] dark:border-[#8f8cff] dark:text-[#8f8cff]">
          MCP
        </span>
        <span className="hidden md:block">← best match</span>
      </div>
    </div>
  )
}

function Library() {
  return (
    <div className="min-w-0 overflow-hidden rounded-lg border border-[#e8e8e8] bg-white text-xs leading-4 dark:border-[#262626] dark:bg-[#141414]">
      <div className="flex h-9 items-center justify-between border-b border-[#e8e8e8] px-3.5 dark:border-[#262626]">
        <span className="font-medium">Your library</span>
        <span className="font-mono text-[11px] text-[#6b6b6b] dark:text-[#8a8a8a]">
          148 snippets
        </span>
      </div>
      <div className="flex h-10 items-center gap-2 border-b border-[#e8e8e8] px-3.5 font-mono dark:border-[#262626]">
        <SearchIcon className="size-3.5 text-[#6b6b6b]" strokeWidth={2} />
        confirm dialog
      </div>
      <ul>
        {library.map((row) => (
          <li
            key={row.file}
            className={cn(
              "flex h-10 items-center gap-3 border-b border-[#f0f0f0] px-3.5 font-mono last:border-b-0 dark:border-[#1f1f1f]",
              row.match
                ? "bg-[#f6a9d3] text-[#2b0a1f] dark:border-transparent"
                : "text-[#b4b4b4] dark:text-[#4a4747]",
            )}
          >
            <span className="min-w-0 grow truncate">{row.file}</span>
            <span className="w-20 shrink-0">{row.collection}</span>
            <span className="hidden w-18 shrink-0 text-right sm:block">{row.language}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function Agents() {
  return (
    <section
      id="features"
      data-cta-location="agents"
      className="flex scroll-mt-4 flex-col gap-8 border-t border-[#e8e8e8] px-5 py-16 text-[#1b1919] md:gap-12 md:p-10 xl:p-30 dark:border-[#1f1f1f] dark:text-[#f5f5f5]"
    >
      <div className="flex flex-col items-start gap-6 lg:flex-row lg:items-end lg:justify-between">
        <SectionHeading
          claim="Your coding agent reuses the code you already wrote."
          reason="It checks your library over MCP before it writes a line."
        />
        <a
          href={documentation.mcp.url}
          className="raised-button flex h-10 shrink-0 items-center gap-1.5 bg-[#2a26ec] px-4 text-sm leading-5 font-medium text-white hover:bg-[#3a36ff]"
        >
          Connect your agent
          <ChevronRightIcon className="size-3" strokeWidth={2.5} />
        </a>
      </div>

      <div className="grid items-center gap-3 rounded-lg border border-[#e8e8e8] bg-[#fafafa] p-4 md:grid-cols-[minmax(0,1fr)_96px_minmax(0,1fr)] md:gap-0 md:p-8 lg:p-12 dark:border-[#1f1f1f] dark:bg-[#0f0f0f]">
        <Terminal />
        <Pipe />
        <Library />
      </div>

      <div className="flex flex-col gap-6">
        <ul className="grid gap-x-5 gap-y-6 sm:grid-cols-2 lg:grid-cols-5">
          {tools.map((tool) => (
            <li
              key={tool.name}
              className="flex min-w-0 flex-col gap-1.5 border-t border-[#e8e8e8] pt-4 dark:border-[#262626]"
            >
              <code className="font-mono text-[13px] leading-4.5 text-[#2a26ec] dark:text-[#8f8cff]">
                {tool.name}
              </code>
              <p className="text-sm leading-5.5 text-[#6b6b6b] dark:text-[#9a9a9a]">{tool.text}</p>
            </li>
          ))}
        </ul>
        <p className="max-w-170 text-base leading-6.5 text-[#6b6b6b] dark:text-[#9a9a9a]">
          The server has nine tools in all. Claude Code and Cursor need only its URL and one sign-in
          in the browser, and any other client connects with a personal token. Snippets an agent
          saves stay private.
        </p>
      </div>
    </section>
  )
}
