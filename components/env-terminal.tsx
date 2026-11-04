"use client"

import { cn } from "@sniptide/ui/lib/utils"
import * as React from "react"

// An agent session that pulls the checkout env group, runs the tests and starts the app with the
// keys set. Commands type out, their output follows, and the session clears and starts over. Every
// line keeps its place while hidden, so the window never changes height. It runs only while on
// screen, and under reduced motion it shows the finished session. The output matches what the CLI
// prints: `env pull` reports a count, and `env run` passes the command's own output through.

type Line =
  | { kind: "prompt"; text: string }
  | { kind: "command"; text: string }
  | { kind: "output"; text: string; tone?: "success" }
  | { kind: "reply"; text: string }

const lines: Line[] = [
  { kind: "prompt", text: "Run the checkout tests with the real keys, then start the app." },
  { kind: "command", text: "sniptide env pull checkout" },
  { kind: "output", text: "Wrote 4 variables to .env." },
  { kind: "command", text: "sniptide env run checkout -- bun test" },
  { kind: "output", text: "42 pass · 0 fail", tone: "success" },
  { kind: "command", text: "sniptide env run checkout -- bun dev" },
  { kind: "output", text: "Ready on http://localhost:3000" },
  { kind: "reply", text: "Tests pass and the app runs on port 3000. No value was printed." },
]

const typeSpeed = 28 // ms per character of a command
const outputDelay = 550 // ms between a command finishing and its output
const lineGap = 380 // ms before the next line starts
const hold = 3200 // ms the finished session stays before it starts over

// When each line starts and how long it takes to appear.
const timeline = (() => {
  let at = 400
  return lines.map((line) => {
    const start = line.kind === "output" ? at + outputDelay - lineGap : at
    const duration = line.kind === "command" ? line.text.length * typeSpeed : 0
    at = start + duration + lineGap
    return { start, duration }
  })
})()
const loop = (timeline.at(-1)?.start ?? 0) + hold

export function EnvTerminal({ className }: { className?: string }) {
  const ref = React.useRef<HTMLDivElement>(null)
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
  }, [])

  const active = timeline.filter(({ start }) => time >= start).length - 1

  return (
    <div
      ref={ref}
      className={cn(
        "min-w-0 overflow-hidden rounded-lg border border-[#2c2a2a] bg-[#1b1919] font-mono text-xs leading-5 text-[#d4d4d4] lg:shadow-[0_24px_48px_-12px_rgb(0_0_0/0.7)]",
        className,
      )}
    >
      <div className="flex h-9 items-center justify-between border-b border-[#2c2a2a] px-3.5 text-[11px] text-[#a3a3a3]">
        <span>claude</span>
        <span>~/acme/checkout</span>
      </div>
      {/* Screen readers get the whole session at once. */}
      <div aria-hidden="true" className="flex flex-col gap-2 overflow-x-auto px-3.5 py-3.5">
        {lines.map((line, i) => {
          const { start, duration } = timeline[i] ?? { start: 0, duration: 0 }
          const shown = time >= start
          const typed =
            line.kind === "command" && duration > 0
              ? line.text.slice(0, Math.ceil(((time - start) / duration) * line.text.length))
              : line.text
          const caret = i === active && line.kind === "command" && time < start + duration
          return (
            <div
              key={line.text}
              className={cn(
                "whitespace-pre",
                !shown && "invisible",
                line.kind === "output" && "-mt-2",
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
                  <span className="text-[#8f8cff]">● </span>
                  <span className="text-white">{typed}</span>
                  {caret && (
                    <span className="ml-px inline-block h-3.5 w-1.5 translate-y-0.5 bg-white" />
                  )}
                </>
              )}
              {line.kind === "output" && (
                <span className={line.tone === "success" ? "text-[#5fd3a8]" : "text-[#a3a3a3]"}>
                  {"  ⎿ "}
                  {line.text}
                </span>
              )}
              {line.kind === "reply" && (
                <span className="whitespace-normal">
                  <span className="text-[#f6a9d3]">● </span>
                  {line.text}
                </span>
              )}
            </div>
          )
        })}
      </div>
      <p className="sr-only">{lines.map((line) => line.text).join(" ")}</p>
    </div>
  )
}
