import { StarIcon } from "lucide-react"
import { documentation } from "@/lib/agent-docs"
import { links } from "@/lib/links"

const outline =
  "raised-button flex h-11 items-center justify-center gap-2 border border-[#e8e8e8] bg-white [--button-depth:#d0d0d0] px-3 text-sm leading-5 font-medium whitespace-nowrap hover:border-[#1b1919] sm:px-4.5 sm:text-[15px] dark:border-[#262626] dark:bg-[#121216] dark:[--button-depth:#2a2a33] dark:hover:border-[#f5f5f5]"

// The closing section offers both ways in, the hosted app and your own server, and sits on the
// footer's surface so the footer grid rises straight out of it.
export function Cta({ stars }: { stars: number | null }) {
  const formattedStars =
    stars === null
      ? null
      : new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(
          stars,
        )

  return (
    <section
      id="self-host"
      data-cta-location="cta"
      className="flex scroll-mt-4 flex-col gap-10 border-t border-[#e8e8e8] bg-white section-frame pt-16 pb-8 text-[#1b1919] md:gap-14 md:pt-24 xl:pt-30 dark:border-[#1f1f1f] dark:bg-[#08080b] dark:text-[#f5f5f5]"
    >
      <h2 className="max-w-240 font-heading text-4xl leading-10 font-medium tracking-[-0.03em] text-balance md:text-6xl md:leading-16">
        Pick where your library lives.
      </h2>

      <div className="grid border-t border-[#e8e8e8] md:grid-cols-2 dark:border-[#262626]">
        <div className="flex flex-col gap-5 py-8 md:border-r md:border-[#e8e8e8] md:py-10 md:pr-12 dark:md:border-[#262626]">
          <div className="flex flex-col gap-2">
            <h3 className="text-xl leading-7 font-semibold">Use sniptide.com</h3>
            <p className="max-w-120 text-base leading-6.5 text-[#6b6b6b] dark:text-[#a3a3a3]">
              Save your first pattern in the app, then connect Claude Code, Cursor or Codex with one
              sign-in in the browser.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2.5 sm:flex">
            <a
              href={links.newPaste}
              className="raised-button flex h-11 items-center justify-center gap-2 bg-[#2a26ec] px-3 text-sm leading-5 font-medium whitespace-nowrap text-white hover:bg-[#3a36ff] sm:px-4.5 sm:text-[15px]"
            >
              <span className="size-2.25 bg-white" />
              Create a paste
            </a>
            <a href={documentation.mcp.url} className={outline}>
              Connect over MCP
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-5 border-t border-[#e8e8e8] py-8 md:border-t-0 md:py-10 md:pl-12 dark:border-[#262626]">
          <div className="flex flex-col gap-2">
            <h3 className="text-xl leading-7 font-semibold">Run it on your own server</h3>
            <p className="max-w-120 text-base leading-6.5 text-[#6b6b6b] dark:text-[#a3a3a3]">
              One image and a database give you the app, the API and the MCP endpoint. Sniptide is
              open source under AGPL-3.0.
            </p>
          </div>
          <code className="flex h-14 w-full items-center gap-3 rounded-lg border border-[#e8e8e8] bg-[#fafafa] px-5 font-mono text-base dark:border-[#262626] dark:bg-[#121216]">
            <span className="text-[#6b6b6b] dark:text-[#a3a3a3]">$</span>
            docker compose up -d
          </code>
          <div className="grid grid-cols-2 gap-2.5 sm:flex">
            <a href={links.selfHost} className={outline}>
              Self-host guide
            </a>
            <a
              href={links.github}
              aria-label={
                formattedStars ? `Star Sniptide on GitHub, ${formattedStars} stars` : undefined
              }
              className={outline}
            >
              Star on GitHub
              <span className="flex items-center gap-1 text-[#6b6b6b] tabular-nums dark:text-[#a3a3a3]">
                {formattedStars}
                <StarIcon
                  aria-hidden="true"
                  className="size-3.5 fill-[#e353ac] text-[#e353ac] dark:fill-[#f6a9d3] dark:text-[#f6a9d3]"
                  strokeWidth={1.5}
                />
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
