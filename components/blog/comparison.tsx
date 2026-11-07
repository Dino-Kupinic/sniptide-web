import { cn } from "@sniptide/ui/lib/utils"
import { CheckIcon, MinusIcon } from "lucide-react"
import type { ReactNode } from "react"

// A cell is a yes (true), a no or undocumented (false), or a short note. A note starting with "~"
// marks partial support: the note shows with a half-filled marker, without the tilde.
export type ComparisonValue = boolean | string

export type ComparisonRow = {
  label: ReactNode
  values: ComparisonValue[]
}

export type ComparisonGroup = {
  title: string
  rows: ComparisonRow[]
}

type ComparisonProps = {
  // The products, left to right. The first column is the feature names.
  columns: string[]
  groups: ComparisonGroup[]
  // The column to tint, such as the publisher's own product. It is disclosed in the caption.
  highlight?: string
  caption?: ReactNode
}

function Cell({ value }: { value: ComparisonValue }) {
  if (value === true) {
    return (
      <span className="inline-flex size-6 items-center justify-center rounded-md bg-link/12 text-link">
        <CheckIcon aria-hidden="true" className="size-4" strokeWidth={2.5} />
        <span className="sr-only">Yes</span>
      </span>
    )
  }
  if (value === false) {
    return (
      <span className="inline-flex size-6 items-center justify-center text-muted-foreground/60">
        <MinusIcon aria-hidden="true" className="size-4" />
        <span className="sr-only">No or not documented</span>
      </span>
    )
  }
  const partial = value.startsWith("~")
  return (
    <span className="inline-flex items-start gap-1.5 text-xs leading-[1.125rem] text-pretty text-muted-foreground">
      {partial && (
        <span
          aria-hidden="true"
          className="mt-[0.3125rem] size-2 shrink-0 rounded-full border border-link bg-[linear-gradient(90deg,var(--link)_50%,transparent_50%)]"
        />
      )}
      <span>{partial ? value.slice(1) : value}</span>
    </span>
  )
}

// A feature-by-product comparison for posts that compare tools. Rows sit in titled groups, the
// feature column stays pinned while the products scroll sideways on narrow screens, and one column
// can be tinted. It breaks out of the text column on wide screens so six products fit without
// scrolling. The caption sits centered below, like a Figure's.
export function Comparison({ columns, groups, highlight, caption }: ComparisonProps) {
  const highlighted = highlight ? columns.indexOf(highlight) : -1

  return (
    <figure className="blog-comparison not-prose lg:-mx-16">
      <div className="overflow-x-auto overscroll-x-contain rounded-lg border [scrollbar-width:thin]">
        <table className="table-fixed">
          <thead>
            <tr className="border-b">
              <th scope="col" className="w-[9.5rem]">
                <span className="sr-only">Feature</span>
              </th>
              {columns.map((column, index) => (
                <th
                  key={column}
                  scope="col"
                  data-highlight={index === highlighted || undefined}
                  className={cn("text-[0.8125rem] leading-5", index === highlighted && "text-link")}
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          {groups.map((group) => (
            <tbody key={group.title}>
              <tr>
                <th
                  scope="colgroup"
                  colSpan={columns.length + 1}
                  className="text-xs leading-4 tracking-wide text-muted-foreground uppercase"
                >
                  {group.title}
                </th>
              </tr>
              {group.rows.map((row, rowIndex) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: rows are static content in a post.
                <tr key={`${group.title}-${rowIndex}`}>
                  <th scope="row" className="text-sm leading-5">
                    {row.label}
                  </th>
                  {row.values.map((value, index) => (
                    <td
                      // biome-ignore lint/suspicious/noArrayIndexKey: cells line up with the fixed columns.
                      key={index}
                      data-highlight={index === highlighted || undefined}
                    >
                      <Cell value={value} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          ))}
        </table>
      </div>
      {caption && (
        <figcaption className="mx-auto mt-3 max-w-[30rem] text-center text-[0.8125rem] leading-5 text-pretty text-muted-foreground">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
