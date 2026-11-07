import { CheckIcon, MinusIcon } from "lucide-react"
import type { ReactNode } from "react"
import { primaryButton, secondaryButton } from "@/components/blog/buttons"

// A feature-by-product comparison for posts that compare tools. The post writes it as a plain
// Markdown table inside <Comparison>, so the Markdown twin and agents read an ordinary table:
//
//   <Comparison highlight={1} caption="…">
//
//   |                  | Sniptide | PrivateBin |
//   | ---------------- | -------- | ---------- |
//   | **Sharing**      |          |            |
//   | Password         | ✓        | ✓          |
//   | Several files    | Up to 10 | ~Off by default |
//
//   </Comparison>
//
// A row whose first cell is bold and whose other cells are empty becomes a group heading. Cells of
// "✓" and "–" turn into markers (see ComparisonCell), and a note starting with "~" marks partial
// support. `highlight` is the product column to tint, counted from 1, such as the publisher's own.
// The styles live under .blog-comparison in app/globals.css. On wide screens the table breaks out
// of the text column so six products fit, and on phones it scrolls with the first column pinned.
export function Comparison({
  highlight,
  caption,
  children,
}: {
  highlight?: number
  caption?: ReactNode
  children: ReactNode
}) {
  return (
    <figure
      className="blog-comparison lg:-mr-12 lg:-ml-16"
      data-highlight={highlight ? highlight + 1 : undefined}
    >
      {children}
      {caption && (
        <figcaption className="mx-auto mt-3 max-w-[30rem] text-center text-[0.8125rem] leading-5 text-pretty text-muted-foreground">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}

// The content of a table cell, with "✓" and "–" (or "—") drawn as markers and a leading "~" drawn as
// a half-filled dot for partial support. Any other content passes through unchanged.
export function ComparisonCell({ children }: { children: ReactNode }) {
  if (children === "✓") {
    return (
      <span className="blog-mark-yes">
        <CheckIcon aria-hidden="true" className="size-4" strokeWidth={2.5} />
        <span className="sr-only">Yes</span>
      </span>
    )
  }
  if (children === "–" || children === "—") {
    return (
      <span className="blog-mark-no">
        <MinusIcon aria-hidden="true" className="size-4" />
        <span className="sr-only">No or not documented</span>
      </span>
    )
  }
  if (typeof children === "string" && children.startsWith("~")) {
    return (
      <span className="blog-mark-partial">
        <span aria-hidden="true" className="blog-mark-dot" />
        <span>
          <span className="sr-only">Partly: </span>
          {children.slice(1)}
        </span>
      </span>
    )
  }
  return children
}

// A grid of feature cards in the style of the Open Graph card: black panels, white text and blue
// checks. The post writes it as Markdown, a bold line followed by a list for each card, so the
// Markdown twin and agents read plain lists:
//
//   <FeatureGrid>
//
//   **Share**
//
//   - Up to 10 files per paste
//
//   </FeatureGrid>
//
// The styles live under .blog-feature-grid in app/globals.css.
export function FeatureGrid({ children }: { children: ReactNode }) {
  return <div className="blog-feature-grid lg:-mr-12 lg:-ml-16">{children}</div>
}

// A call to action inside a post, placed where the reader has enough context to act: a title, one
// line on what to try, a primary link and an optional secondary one. Its props are plain strings,
// so the Markdown twin still reads as a sentence and two links.
export function InlineCta({
  title,
  description,
  href,
  label,
  secondaryHref,
  secondaryLabel,
}: {
  title: string
  description: string
  href: string
  label: string
  secondaryHref?: string
  secondaryLabel?: string
}) {
  return (
    <aside className="not-prose relative my-8 overflow-hidden rounded-lg border bg-card px-5 py-5 md:px-6">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,color-mix(in_oklab,var(--link)_14%,transparent),transparent_55%)]"
      />
      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <div className="flex min-w-0 flex-col gap-1">
          <p className="font-heading text-lg leading-6 font-medium tracking-[-0.02em]">{title}</p>
          <p className="text-[0.9375rem] leading-6 text-pretty text-muted-foreground">
            {description}
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <a href={href} className={primaryButton}>
            {label}
          </a>
          {secondaryHref && secondaryLabel && (
            <a href={secondaryHref} className={secondaryButton}>
              {secondaryLabel}
            </a>
          )}
        </div>
      </div>
    </aside>
  )
}
