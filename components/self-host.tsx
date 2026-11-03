import { cn } from "@sniptide/ui/lib/utils"
import { SectionHeading } from "@/components/section-heading"
import { links } from "@/lib/links"
import { imageUrl } from "@/lib/site"

const endpoints = [
  { name: "App", url: "pastes.acme.dev", text: "For people in a browser." },
  { name: "Token API", url: "pastes.acme.dev/api/v1", text: "For scripts, CI and the SDKs." },
  {
    name: "MCP endpoint",
    url: "pastes.acme.dev/api/mcp",
    text: "For Claude Code, Cursor and Codex.",
    accent: true,
  },
]

// The live star count sits on the GitHub button as the proof next to the open-source claim.
export function SelfHost({ stars }: { stars: number | null }) {
  const formattedStars =
    stars === null
      ? null
      : new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(
          stars,
        )

  return (
    <section
      id="self-host"
      data-cta-location="self-host"
      className="flex scroll-mt-4 flex-col gap-10 section-frame py-16 text-[#1b1919] md:gap-14 md:py-20 xl:py-30 dark:text-[#f5f5f5]"
    >
      <SectionHeading
        claim="Self-host it with one command."
        reason="Then your agents talk to your server."
      />

      <div className="flex flex-col">
        <p className="flex items-center gap-[0.35em] font-mono text-[22px] leading-none whitespace-nowrap tracking-[-0.02em] sm:text-5xl lg:text-[88px]">
          <span className="text-[#6b6b6b] dark:text-[#a3a3a3]">$</span>
          docker compose up -d
          <span aria-hidden="true" className="h-[0.9em] w-[0.5em] bg-[#2a26ec] dark:bg-[#8f8cff]" />
        </p>

        {/* The command fans out to the three ways in. */}
        <div
          aria-hidden="true"
          className="mx-[16.66%] mt-8 hidden h-6 border-x border-t border-[#c8c8c8] md:block dark:border-[#3a3a3a]"
        >
          <div className="mx-auto h-full w-px bg-[#c8c8c8] dark:bg-[#3a3a3a]" />
        </div>

        <ul className="mt-6 grid border-t border-l border-[#e8e8e8] md:mt-0 md:grid-cols-3 dark:border-[#262626]">
          {endpoints.map((endpoint) => (
            <li
              key={endpoint.name}
              className={cn(
                "flex flex-col gap-1 border-r border-b border-[#e8e8e8] px-5 py-5 md:items-center md:text-center dark:border-[#262626]",
                endpoint.accent &&
                  "bg-[#f3f3fe] outline -outline-offset-1 outline-[#2a26ec] dark:bg-[#141228] dark:outline-[#8f8cff]",
              )}
            >
              <span
                className={cn(
                  "text-base leading-5.5 font-semibold",
                  endpoint.accent && "text-[#2a26ec] dark:text-[#8f8cff]",
                )}
              >
                {endpoint.name}
              </span>
              <code className="font-mono text-xs leading-4.5 text-[#6b6b6b] dark:text-[#9a9a9a]">
                {endpoint.url}
              </code>
              <span className="text-base leading-6 text-[#6b6b6b] dark:text-[#9a9a9a]">
                {endpoint.text}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <p className="max-w-170 text-base leading-6.5 text-[#6b6b6b] dark:text-[#9a9a9a]">
        One image at <code className="font-mono text-[15px]">{imageUrl}</code> runs on AMD64 and
        ARM64, and Postgres is the only other service it needs. Sniptide is open source under
        AGPL-3.0, and an update is one{" "}
        <code className="font-mono text-[15px]">docker compose pull</code> away. Next on the roadmap
        is the Sniptide Registry, where agents install and version shared snippets.
      </p>

      <div className="flex flex-wrap gap-2.5">
        <a
          href={links.selfHost}
          className="raised-button flex h-10 items-center border border-[#e8e8e8] bg-white [--button-depth:#d0d0d0] px-4 text-sm leading-5 font-medium hover:border-[#1b1919] dark:border-[#262626] dark:bg-[#141414] dark:[--button-depth:#383838] dark:hover:border-[#f5f5f5]"
        >
          Read the self-host guide
        </a>
        <a
          href={links.github}
          aria-label={
            formattedStars ? `Star Sniptide on GitHub, ${formattedStars} stars` : undefined
          }
          className="raised-button flex h-10 items-center gap-2 border border-[#e8e8e8] bg-white [--button-depth:#d0d0d0] px-4 text-sm leading-5 font-medium hover:border-[#1b1919] dark:border-[#262626] dark:bg-[#141414] dark:[--button-depth:#383838] dark:hover:border-[#f5f5f5]"
        >
          Star on GitHub
          {formattedStars && (
            <span className="text-[#6b6b6b] tabular-nums dark:text-[#a3a3a3]">
              {formattedStars} stars
            </span>
          )}
        </a>
      </div>
    </section>
  )
}
