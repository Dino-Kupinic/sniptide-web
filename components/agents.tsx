import { ChevronRightIcon } from "lucide-react"
import oauthDark from "@/assets/landing/oauth-dark.webp"
import oauthLight from "@/assets/landing/oauth-light.webp"
import { Screenshot } from "@/components/screenshot"
import { SectionHeading } from "@/components/section-heading"
import { documentation } from "@/lib/agent-docs"

const tools = [
  { name: "search_snippets", text: "Finds a match by words, tags, language or collection." },
  { name: "read_snippet", text: "Returns the files with their paths and where they came from." },
  { name: "fetch_collection", text: "Follows a recipe one step at a time, in order." },
  { name: "create_snippet", text: "Saves a new pattern, private unless you say otherwise." },
  { name: "update_snippet", text: "Edits one, and only with access that allows writes." },
]

export function Agents() {
  return (
    <section
      id="features"
      data-cta-location="agents"
      className="flex scroll-mt-4 flex-col gap-10 border-t border-[#e8e8e8] section-frame py-16 text-[#1b1919] md:gap-14 md:py-20 xl:py-30 dark:border-[#1f1f1f] dark:text-[#f5f5f5]"
    >
      <SectionHeading
        claim="Your coding agent reuses the code you already wrote."
        reason="It checks your library over MCP before it writes a line."
      />

      <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16">
        <div className="flex flex-col gap-8">
          <ul className="flex flex-col border-t border-[#e8e8e8] dark:border-[#262626]">
            {tools.map((tool) => (
              <li
                key={tool.name}
                className="flex flex-col gap-1 border-b border-[#e8e8e8] py-4 dark:border-[#262626]"
              >
                <code className="font-mono text-[13px] leading-4.5 text-[#2a26ec] dark:text-[#8f8cff]">
                  {tool.name}
                </code>
                <p className="text-base leading-6 text-[#6b6b6b] dark:text-[#a3a3a3]">
                  {tool.text}
                </p>
              </li>
            ))}
          </ul>
          <p className="text-base leading-6.5 text-[#6b6b6b] dark:text-[#a3a3a3]">
            The server has nine tools in all. Claude Code and Cursor need only its URL and one
            sign-in in the browser, and any other client connects with a personal token.
          </p>
          <a
            href={documentation.mcp.url}
            className="raised-button flex h-10 items-center gap-1.5 self-start border border-[#e8e8e8] bg-white [--button-depth:#d0d0d0] px-4 text-sm leading-5 font-medium hover:border-[#1b1919] dark:border-[#262626] dark:bg-[#141414] dark:[--button-depth:#383838] dark:hover:border-[#f5f5f5]"
          >
            Read the MCP setup guide
            <ChevronRightIcon className="size-3" strokeWidth={2.5} />
          </a>
        </div>

        <figure className="flex flex-col gap-4 lg:sticky lg:top-8">
          <Screenshot
            light={oauthLight}
            dark={oauthDark}
            alt="The Sniptide consent screen where Claude Code asks to search, read and edit your snippets, collections and env groups."
          />
          <figcaption className="text-base leading-6 text-[#6b6b6b] dark:text-[#a3a3a3]">
            Claude Code asks once in the browser for the access it needs, and you can disconnect it
            in Settings at any time.
          </figcaption>
        </figure>
      </div>
    </section>
  )
}
