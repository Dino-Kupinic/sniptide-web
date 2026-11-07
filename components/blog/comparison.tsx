import { CheckIcon, MinusIcon } from "lucide-react"
import type { ReactNode } from "react"

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
      className="blog-comparison lg:-mx-16"
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
  return <div className="blog-feature-grid lg:-mx-16">{children}</div>
}
