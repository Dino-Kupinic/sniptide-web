"use client"

import { cn } from "@sniptide/ui/lib/utils"
import * as React from "react"

// A short silent screen recording of the real app that loops like a GIF. With both clips the
// frame follows the color scheme. A clip plays only while on screen, and under reduced motion it
// stays on its first frame, the poster. `crop` keeps the left part readable on phones, like
// Screenshot does.
export function LoopVideo({
  light,
  dark,
  label,
  width,
  height,
  className,
  crop,
}: {
  light: { src: string; poster: string }
  dark?: { src: string; poster: string }
  label: string
  width: number
  height: number
  className?: string
  crop?: boolean
}) {
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const host = ref.current
    if (!host || matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const videos = [...host.querySelectorAll("video")]
    const observer = new IntersectionObserver(([entry]) => {
      for (const video of videos) {
        if (entry?.isIntersecting && video.offsetParent !== null) video.play().catch(() => {})
        else video.pause()
      }
    })
    observer.observe(host)
    return () => observer.disconnect()
  }, [])

  const size = crop ? "max-md:w-160 max-md:max-w-none" : ""
  const video = (clip: { src: string; poster: string }, visibility?: string) => (
    <video
      src={clip.src}
      poster={clip.poster}
      width={width}
      height={height}
      muted
      loop
      playsInline
      preload="metadata"
      aria-label={label}
      className={cn("block h-auto w-full", size, visibility)}
    />
  )

  return (
    <div
      ref={ref}
      className={cn(
        "min-w-0 overflow-hidden rounded-lg border border-[#e8e8e8] bg-white dark:border-[#262626] dark:bg-[#121111]",
        className,
      )}
    >
      {video(light, dark && "dark:hidden")}
      {dark && video(dark, "hidden dark:block")}
    </div>
  )
}
