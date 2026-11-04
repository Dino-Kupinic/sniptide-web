"use client"

import { cn } from "@sniptide/ui/lib/utils"
import * as React from "react"

// A terminal that plays a session on a loop: commands type out, their output follows, and the
// session clears and starts over. Every line keeps its place while hidden, so the block never
// changes height. It runs only while on screen, and under reduced motion it shows the finished
// session. It renders spans only, so it can sit inside a link, and screen readers get the whole
// session at once.

export type SessionLine =
  // What the person asked the agent.
  | { kind: "prompt"; text: string }
  // A command or tool call. `detail` follows in the muted color, such as a tool's arguments.
  | { kind: "command"; text: string; detail?: string }
  | { kind: "output"; text: string; tone?: "success" }
  // The agent's closing line.
  | { kind: "reply"; text: string }

const typeSpeed = 28 // ms per character of a command
const outputDelay = 550 // ms between a command finishing and its output
const lineGap = 380 // ms before the next line starts

function useTimeline(lines: SessionLine[], hold: number) {
  return React.useMemo(() => {
    let at = 400
    const timeline = lines.map((line) => {
      const start = line.kind === "output" ? at + outputDelay - lineGap : at
      const duration =
        line.kind === "command" ? (line.text.length + (line.detail?.length ?? 0)) * typeSpeed : 0
      at = start + duration + lineGap
      return { start, duration }
    })
    return { timeline, loop: (timeline.at(-1)?.start ?? 0) + hold }
  }, [lines, hold])
}

export function TypedSession({
  lines,
  title,
  variant = "agent",
  hold = 3200,
  className,
  bodyClassName,
}: {
  lines: SessionLine[]
  // The window bar: the tool on the left and the working directory on the right.
  title?: [string, string]
  // `agent` marks commands with a dot and output with ⎿, `shell` uses $ and plain output.
  variant?: "agent" | "shell"
  hold?: number
  className?: string
  bodyClassName?: string
}) {
  const ref = React.useRef<HTMLSpanElement>(null)
  const { timeline, loop } = useTimeline(lines, hold)
  const [time, setTime] = React.useState(loop)

  React.useEffect(() => {
    const element = ref.current
    if (!element || matchMedia("(prefers-reduced-motion: reduce)").matches) return
    let frame = 0
    let origin = 0
    let running = false
    const step = (now: number) => {
      if (!origin) origin = now
      setTime((now - origin) % loop)
      frame = requestAnimationFrame(step)
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting && !running) {
        running = true
        origin = 0
        frame = requestAnimationFrame(step)
      } else if (!entry?.isIntersecting && running) {
        running = false
        cancelAnimationFrame(frame)
      }
    })
    observer.observe(element)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [loop])

  const active = timeline.filter(({ start }) => time >= start).length - 1
  const agent = variant === "agent"

  return (
    <span
      ref={ref}
      className={cn(
        "flex min-w-0 flex-col overflow-hidden rounded-lg border border-[#2c2a2a] bg-[#1b1919] font-mono text-xs leading-5 text-[#d4d4d4]",
        className,
      )}
    >
      {title && (
        <span className="flex h-9 items-center justify-between border-b border-[#2c2a2a] px-3.5 text-[11px] text-[#a3a3a3]">
          <span>{title[0]}</span>
          <span>{title[1]}</span>
        </span>
      )}
      <span
        aria-hidden="true"
        className={cn(
          "flex flex-col overflow-x-auto",
          agent ? "gap-2 px-3.5 py-3.5" : "px-3.5 py-3",
          bodyClassName,
        )}
      >
        {lines.map((line, i) => {
          const { start, duration } = timeline[i] ?? { start: 0, duration: 0 }
          const shown = time >= start
          const full = line.kind === "command" ? line.text + (line.detail ?? "") : line.text
          const typed =
            line.kind === "command" && duration > 0 && time < start + duration
              ? full.slice(0, Math.max(0, Math.ceil(((time - start) / duration) * full.length)))
              : full
          const caret = i === active && line.kind === "command" && time < start + duration
          return (
            <span
              key={`${line.kind}-${line.text}`}
              className={cn(
                "block whitespace-pre",
                !shown && "invisible",
                agent && line.kind === "output" && "-mt-2",
              )}
            >
              {line.kind === "prompt" && (
                <span className="whitespace-normal text-white">
                  <span className="text-[#a3a3a3]">&gt; </span>
                  {line.text}
                </span>
              )}
              {line.kind === "command" && (
                <>
                  <span className={agent ? "text-[#8f8cff]" : "text-white"}>
                    {agent ? "● " : "$ "}
                  </span>
                  <span className="text-white">{typed.slice(0, line.text.length)}</span>
                  <span className="text-[#a3a3a3]">{typed.slice(line.text.length)}</span>
                  {caret && (
                    <span className="ml-px inline-block h-3.5 w-1.5 translate-y-0.5 bg-white" />
                  )}
                </>
              )}
              {line.kind === "output" && (
                <span className={line.tone === "success" ? "text-[#5fd3a8]" : "text-[#a3a3a3]"}>
                  {agent ? "  ⎿ " : ""}
                  {line.text}
                </span>
              )}
              {line.kind === "reply" && (
                <span className="whitespace-normal">
                  <span className="text-[#f6a9d3]">● </span>
                  {line.text}
                </span>
              )}
            </span>
          )
        })}
      </span>
      <span className="sr-only">
        {lines
          .map((line) => line.text + (line.kind === "command" ? (line.detail ?? "") : ""))
          .join(" ")}
      </span>
    </span>
  )
}
