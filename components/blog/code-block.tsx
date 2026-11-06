"use client"

import { cn } from "@sniptide/ui/lib/utils"
import { CheckIcon, CopyIcon } from "lucide-react"
import { type ComponentProps, useRef, useState } from "react"

// A code block from a fenced block in a post: a hairline panel on the card surface, an optional
// file name in a 36px mono title row (```ts title="sniptide.config.ts"), and a copy button. Shiki
// colours the tokens with the --syntax-* variables, so light and dark switch with the page.
// Fumadocs adds a language icon as an `icon` attribute, which this block doesn't show.
export function CodeBlock({
  title,
  className,
  children,
  style,
  icon: _icon,
  ...props
}: ComponentProps<"pre"> & { icon?: unknown }) {
  const ref = useRef<HTMLPreElement>(null)
  const [copied, setCopied] = useState(false)

  async function copy() {
    const text = ref.current?.textContent ?? ""
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      setCopied(false)
    }
  }

  const button = (
    <button
      type="button"
      onClick={copy}
      aria-label={copied ? "Copied" : "Copy code"}
      className="inline-flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-link"
    >
      {copied ? <CheckIcon className="size-4" /> : <CopyIcon className="size-4" />}
    </button>
  )

  return (
    <figure
      data-code-block
      className="not-prose group relative overflow-hidden rounded-lg border bg-card text-foreground"
    >
      {title ? (
        <figcaption className="flex h-9 items-center justify-between gap-3 border-b pr-1.5 pl-4 font-mono text-xs text-muted-foreground">
          <span className="truncate">{title}</span>
          {button}
        </figcaption>
      ) : (
        <div className="absolute top-1.5 right-1.5 opacity-100 transition-opacity md:opacity-0 md:group-focus-within:opacity-100 md:group-hover:opacity-100">
          {button}
        </div>
      )}
      <pre
        ref={ref}
        {...props}
        style={style}
        className={cn(
          "scrollbar-subtle overflow-x-auto px-4 py-3.5 font-mono text-[0.8125rem] leading-[1.375rem]",
          className,
        )}
      >
        {children}
      </pre>
    </figure>
  )
}
