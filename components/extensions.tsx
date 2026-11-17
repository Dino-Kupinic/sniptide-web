"use client"

import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react"
import { type ComponentType, useCallback, useEffect, useRef, useState } from "react"
import {
  ChromeReplica,
  PluginReplica,
  RaycastReplica,
  VSCodeReplica,
} from "@/components/extension-replicas"
import { SectionHeading } from "@/components/section-heading"
import { docsPages } from "@/lib/links"

// One card per place Sniptide runs outside the app, each with a drawing of it and a link to its
// guide.
const tools: { replica: ComponentType; title: string; text: string; href: string }[] = [
  {
    replica: VSCodeReplica,
    title: "VS Code",
    text: "Share a selection as a link and insert your snippets from the sidebar, in VS Code, Cursor or Windsurf.",
    href: docsPages.vscodeExtension,
  },
  {
    replica: ChromeReplica,
    title: "Chrome",
    text: "Save the code you select on any page as a paste and copy its link in one keystroke.",
    href: docsPages.browserExtension,
  },
  {
    replica: RaycastReplica,
    title: "Raycast",
    text: "Search your pastes and collections from the launcher and paste the code into the app you're in.",
    href: docsPages.raycastExtension,
  },
  {
    replica: PluginReplica,
    title: "Claude Code plugin",
    text: "One install adds the MCP server and five Sniptide skills, and Gemini CLI gets the same as an extension.",
    href: docsPages.agentPlugin,
  },
]

const arrowButton =
  "flex size-10 items-center justify-center rounded-full border border-[#e8e8e8] bg-white text-[#1b1919] transition-colors hover:bg-[#f4f4f4] focus-visible:ring-3 focus-visible:ring-[#2a26ec]/30 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-40 motion-reduce:transition-none dark:border-[#2f2c2c] dark:bg-[#121111] dark:text-[#f4f4f4] dark:hover:bg-[#242222] dark:focus-visible:ring-[#8f8cff]/40"

// The track scrolls natively, so touch, trackpad and keyboard scrolling all work, and the buttons
// move it one card at a time. Each button turns off at its end of the track.
function useTrack() {
  const ref = useRef<HTMLUListElement>(null)
  const [edges, setEdges] = useState({ start: true, end: false })

  const update = useCallback(() => {
    const track = ref.current
    if (!track) return
    setEdges({
      start: track.scrollLeft <= 1,
      end: track.scrollLeft + track.clientWidth >= track.scrollWidth - 1,
    })
  }, [])

  useEffect(() => {
    const track = ref.current
    if (!track) return
    update()
    track.addEventListener("scroll", update, { passive: true })
    const observer = new ResizeObserver(update)
    observer.observe(track)
    return () => {
      track.removeEventListener("scroll", update)
      observer.disconnect()
    }
  }, [update])

  const step = useCallback((direction: 1 | -1) => {
    const track = ref.current
    const card = track?.firstElementChild
    if (!track || !(card instanceof HTMLElement)) return
    const gap = Number.parseFloat(getComputedStyle(track).columnGap) || 0
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    track.scrollBy({
      left: direction * (card.offsetWidth + gap),
      behavior: reduce ? "auto" : "smooth",
    })
  }, [])

  return { ref, edges, step }
}

export function Extensions() {
  const { ref, edges, step } = useTrack()

  return (
    <section
      id="extensions"
      data-cta-location="extensions"
      aria-roledescription="carousel"
      aria-label="Extensions"
      className="flex scroll-mt-4 flex-col gap-10 border-t border-[#e8e8e8] bg-[#fafafa] py-16 text-[#1b1919] md:gap-14 md:py-20 xl:py-30 dark:border-[#1f1f1f] dark:bg-[#0f0f0f] dark:text-[#f5f5f5]"
    >
      <div className="flex flex-col gap-6 section-frame md:flex-row md:items-end md:justify-between">
        <SectionHeading
          claim="Sniptide comes along wherever you work."
          reason="Save and reuse snippets from your editor, browser, Raycast and Claude Code."
        />
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            aria-label="Previous extension"
            aria-controls="extensions-track"
            disabled={edges.start}
            onClick={() => step(-1)}
            className={arrowButton}
          >
            <ArrowLeftIcon aria-hidden="true" className="size-4" strokeWidth={2} />
          </button>
          <button
            type="button"
            aria-label="Next extension"
            aria-controls="extensions-track"
            disabled={edges.end}
            onClick={() => step(1)}
            className={arrowButton}
          >
            <ArrowRightIcon aria-hidden="true" className="size-4" strokeWidth={2} />
          </button>
        </div>
      </div>

      <ul
        ref={ref}
        id="extensions-track"
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto section-frame section-frame-scroll pb-1 [scrollbar-width:none] md:gap-6 [&::-webkit-scrollbar]:hidden"
      >
        {tools.map((tool, i) => (
          <li
            key={tool.title}
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${tools.length}`}
            className="w-[85%] shrink-0 snap-start sm:w-[420px] lg:w-[520px]"
          >
            <a
              href={tool.href}
              className="group flex h-full flex-col overflow-hidden rounded-lg border border-[#e8e8e8] bg-white focus-visible:ring-3 focus-visible:ring-[#2a26ec]/30 focus-visible:outline-none dark:border-[#262626] dark:bg-[#0a0a0a] dark:focus-visible:ring-[#8f8cff]/40"
            >
              <div className="relative h-60 overflow-hidden border-b border-[#e8e8e8] bg-[#f4f4f4] md:h-72 dark:border-[#262626] dark:bg-[#151414]">
                <tool.replica />
              </div>
              <div className="flex grow flex-col gap-2 p-6 md:p-8">
                <span className="font-heading text-xl leading-7 font-bold tracking-[-0.02em] group-hover:text-[#2a26ec] dark:group-hover:text-[#8f8cff]">
                  {tool.title}
                </span>
                <span className="text-base leading-6 text-[#6b6b6b] dark:text-[#a3a3a3]">
                  {tool.text}
                </span>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}
