"use client"

import { CheckIcon, LinkIcon } from "lucide-react"
import { useState } from "react"

const button =
  "flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-link active:translate-y-px"

function XMark({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function LinkedInMark({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13M7.12 20.45H3.56V9h3.56zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0" />
    </svg>
  )
}

// Ways to pass a post on: copy its address, or open a prefilled post on X or LinkedIn.
export function ShareButtons({ title, url }: { title: string; url: string }) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      setCopied(false)
    }
  }

  const encoded = encodeURIComponent(url)
  return (
    <div className="flex items-center gap-1">
      <button
        type="button"
        onClick={copy}
        className={button}
        aria-label={copied ? "Link copied" : "Copy link"}
        title={copied ? "Link copied" : "Copy link"}
      >
        {copied ? (
          <CheckIcon aria-hidden="true" className="size-4 text-highlight" />
        ) : (
          <LinkIcon aria-hidden="true" className="size-4" />
        )}
      </button>
      <a
        href={`https://x.com/intent/post?text=${encodeURIComponent(title)}&url=${encoded}`}
        target="_blank"
        rel="noopener noreferrer"
        className={button}
        aria-label="Share on X"
        title="Share on X"
      >
        <XMark className="size-3.5" />
      </a>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encoded}`}
        target="_blank"
        rel="noopener noreferrer"
        className={button}
        aria-label="Share on LinkedIn"
        title="Share on LinkedIn"
      >
        <LinkedInMark className="size-3.5" />
      </a>
      <span aria-live="polite" className="sr-only">
        {copied ? "Link copied" : ""}
      </span>
    </div>
  )
}
