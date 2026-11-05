"use client"

import { CheckIcon, CopyIcon, StarIcon } from "lucide-react"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import demoDark from "@/assets/landing/demo-preview-dark.webp"
import demoLight from "@/assets/landing/demo-preview-light.webp"
import { GitHubMark } from "@/components/github-mark"
import { LifeField } from "@/components/life-field"
import type { NavFeature } from "@/lib/nav"

// The pictures at the top of each menu's featured card. Each one shows the real thing: the demo
// dashboard, the CLI output from the recipes section, and the repository with its stars.

function DemoVisual() {
  // A crop of the guest dashboard's top left: the sidebar and the greeting.
  return (
    <>
      <Image
        src={demoLight}
        alt=""
        unoptimized
        className="absolute top-0 left-0 w-[640px] max-w-none dark:hidden"
      />
      <Image
        src={demoDark}
        alt=""
        unoptimized
        className="absolute top-0 left-0 hidden w-[640px] max-w-none dark:block"
      />
    </>
  )
}

// The same session the recipes section types out, as it reads when it has finished.
const session = [
  { prompt: true, text: "sniptide pull collection:components" },
  { tone: "success", text: "Wrote 6 files in ~/acme/shop." },
  { text: "src/components/confirm-dialog.tsx" },
  { text: "src/components/toaster.tsx" },
] as const

function TerminalVisual() {
  return (
    <div className="absolute inset-0 flex flex-col justify-center gap-1 bg-[#0c0b0b] px-5 font-mono text-xs leading-4 text-[#f4f4f4]">
      {session.map((line) => (
        <p
          key={line.text}
          className={
            "tone" in line ? "text-[#5fd3a8]" : "prompt" in line ? "text-white" : "text-[#a3a3a3]"
          }
        >
          {"prompt" in line && <span className="text-[#8a8a8a]">$ </span>}
          {line.text}
        </p>
      ))}
    </div>
  )
}

function GitHubVisual({ stars }: { stars: string | null }) {
  return (
    <>
      <LifeField
        live="#2a26ec"
        trail="#8f8cff"
        density={0.14}
        className="opacity-50 dark:opacity-60"
      />
      <div className="absolute inset-0 flex items-center justify-center gap-3">
        <span className="flex size-12 items-center justify-center rounded-lg border border-[#e8e8e8] bg-white text-[#0a0a0a] dark:border-[#2f2c2c] dark:bg-[#121111] dark:text-white">
          <GitHubMark className="size-6" />
        </span>
        {stars && (
          <span className="flex h-8 items-center gap-1.5 rounded-md border border-[#e8e8e8] bg-white px-2.5 font-mono text-xs text-[#0a0a0a] tabular-nums dark:border-[#2f2c2c] dark:bg-[#121111] dark:text-white">
            <StarIcon
              aria-hidden="true"
              className="size-3.5 fill-[#e353ac] text-[#e353ac] dark:fill-[#f6a9d3] dark:text-[#f6a9d3]"
              strokeWidth={1.5}
            />
            {stars}
          </span>
        )}
      </div>
    </>
  )
}

export function FeatureVisual({
  visual,
  stars,
}: {
  visual: NavFeature["visual"]
  stars: string | null
}) {
  return (
    <div
      aria-hidden="true"
      className="relative h-40 overflow-hidden border-b border-[#e8e8e8] bg-[#fafafa] dark:border-[#262626] dark:bg-[#0c0b0b]"
    >
      {visual === "demo" && <DemoVisual />}
      {visual === "terminal" && <TerminalVisual />}
      {visual === "github" && <GitHubVisual stars={stars} />}
    </div>
  )
}

export function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)
  useEffect(() => () => clearTimeout(timer.current), [])

  return (
    <button
      type="button"
      aria-label={copied ? "Copied" : `Copy ${label}`}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(value)
          setCopied(true)
          clearTimeout(timer.current)
          timer.current = setTimeout(() => setCopied(false), 1500)
        } catch {
          setCopied(false)
        }
      }}
      className="flex size-7 shrink-0 items-center justify-center rounded-md text-[#6b6b6b] transition-colors hover:bg-[#f4f4f4] hover:text-[#0a0a0a] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2a26ec] dark:text-[#a3a3a3] dark:hover:bg-[#1c1c1c] dark:hover:text-white dark:focus-visible:outline-[#8f8cff]"
    >
      {copied ? (
        <CheckIcon aria-hidden="true" className="size-3.5 text-[#e353ac] dark:text-[#f6a9d3]" />
      ) : (
        <CopyIcon aria-hidden="true" className="size-3.5" />
      )}
    </button>
  )
}
