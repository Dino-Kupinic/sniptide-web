"use client"

import { PauseIcon, PlayIcon } from "lucide-react"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import demoPreviewDark from "@/assets/landing/demo-preview-dark.webp"
import demoPreviewLight from "@/assets/landing/demo-preview-light.webp"
import walkthroughDark from "@/assets/landing/demo-walkthrough-dark.gif"
import walkthroughLight from "@/assets/landing/demo-walkthrough-light.gif"
import { links } from "@/lib/links"

export function ProductPreview() {
  const frame = useRef<HTMLDivElement>(null)
  const [playing, setPlaying] = useState(false)
  const [visible, setVisible] = useState(false)
  const [dark, setDark] = useState(false)

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)")
    const updateMotion = () => setPlaying(!motion.matches)
    const updateTheme = () => setDark(document.documentElement.classList.contains("dark"))
    updateMotion()
    updateTheme()
    motion.addEventListener("change", updateMotion)
    const theme = new MutationObserver(updateTheme)
    theme.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })
    const viewport = new IntersectionObserver(([entry]) =>
      setVisible(entry?.isIntersecting ?? false),
    )
    if (frame.current) viewport.observe(frame.current)
    return () => {
      motion.removeEventListener("change", updateMotion)
      theme.disconnect()
      viewport.disconnect()
    }
  }, [])

  return (
    <div ref={frame} className="relative">
      <figure
        className="relative"
        aria-label="Sniptide walkthrough: browse the dashboard, create a TypeScript paste, and view analytics."
      >
        <Image src={demoPreviewLight} alt="" unoptimized className="h-auto w-full dark:hidden" />
        <Image
          src={demoPreviewDark}
          alt=""
          unoptimized
          className="hidden h-auto w-full dark:block"
        />
        {playing && visible ? (
          <Image
            src={dark ? walkthroughDark : walkthroughLight}
            alt=""
            unoptimized
            className="absolute inset-0 h-auto w-full"
          />
        ) : null}
      </figure>
      <div className="flex items-center justify-between gap-3 border-t border-border bg-background px-3 py-3">
        <button
          type="button"
          onClick={() => setPlaying(!playing)}
          className="flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2 text-xs font-medium text-foreground shadow-sm hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          aria-label={playing ? "Pause walkthrough" : "Play walkthrough"}
        >
          {playing ? <PauseIcon className="size-3.5" /> : <PlayIcon className="size-3.5" />}
          <span>{playing ? "Pause" : "Play"}</span>
        </button>
        <a
          href={links.demo}
          className="raised-button flex h-10 items-center gap-2.5 bg-white [--button-depth:#b6b4ff] [--button-focus:#2a26ec] px-4 text-sm font-semibold text-[#2a26ec]"
        >
          <span className="size-2 bg-[#2a26ec]" />
          Try the demo
        </a>
      </div>
    </div>
  )
}
