"use client"

import { ChevronRightIcon } from "lucide-react"
import { type ReactNode, useEffect, useRef, useState } from "react"
import {
  type ChangelogEntry,
  formatReleaseDate,
  releaseAnchor,
  releasesRepo,
} from "@/lib/changelog"

// An entry with its body already rendered on the server.
export type RenderedEntry = ChangelogEntry & { content: ReactNode }

export type RenderedUnit =
  | { type: "entry"; entry: RenderedEntry }
  | { type: "maintenance"; entries: [RenderedEntry, ...RenderedEntry[]] }

// How many rows the list shows at first and adds each time the reader reaches its end. A run of
// maintenance releases counts as one row.
export const pageSize = 20

const kindLabels = { feature: "Feature", fix: "Fix", internal: "Maintenance" } as const

const row = "grid gap-x-10 gap-y-2 md:grid-cols-[11rem_minmax(0,1fr)]"
const textLink = "font-medium text-link underline-offset-4 hover:underline"

function anchorsOf(unit: RenderedUnit) {
  return unit.type === "entry"
    ? [releaseAnchor(unit.entry.version)]
    : unit.entries.map((entry) => releaseAnchor(entry.version))
}

function VersionLink({ entry, muted }: { entry: ChangelogEntry; muted?: boolean }) {
  return (
    <a
      href={`#${releaseAnchor(entry.version)}`}
      className={`font-mono text-sm leading-5 tabular-nums hover:text-link ${muted ? "text-muted-foreground" : "text-foreground"}`}
    >
      v{entry.version}
    </a>
  )
}

function ReleaseLinks({ entry }: { entry: ChangelogEntry }) {
  return (
    <p className="flex flex-wrap gap-x-5 gap-y-1 text-sm leading-5">
      {entry.pulls.map((number) => (
        <a
          key={number}
          href={`https://github.com/${releasesRepo}/pull/${number}`}
          className={textLink}
        >
          Pull request #{number}
        </a>
      ))}
      <a href={entry.url} className={textLink}>
        Release on GitHub
      </a>
    </p>
  )
}

function Release({ entry }: { entry: RenderedEntry }) {
  const id = releaseAnchor(entry.version)
  return (
    <li id={id} className={`${row} scroll-mt-24 border-t py-8 md:py-12`}>
      <div className="flex flex-wrap items-baseline gap-x-3 self-start md:sticky md:top-24 md:flex-col md:gap-1">
        <VersionLink entry={entry} />
        <time dateTime={entry.date} className="text-sm leading-5 text-muted-foreground">
          {formatReleaseDate(entry.date)}
        </time>
        <span className="text-sm leading-5 text-muted-foreground">{kindLabels[entry.kind]}</span>
      </div>
      <div className="flex min-w-0 flex-col gap-5">
        <h2 className="font-heading text-2xl leading-8 font-medium tracking-[-0.02em] text-balance md:text-[28px] md:leading-9">
          {entry.title}
        </h2>
        {entry.content}
        <ReleaseLinks entry={entry} />
      </div>
    </li>
  )
}

function MaintenanceRow({ entry, nested }: { entry: RenderedEntry; nested?: boolean }) {
  return (
    <div
      id={releaseAnchor(entry.version)}
      className={`${row} scroll-mt-24 ${nested ? "py-3" : "border-t py-5"}`}
    >
      <div className="flex flex-wrap items-baseline gap-x-3 md:flex-col md:gap-1">
        <VersionLink entry={entry} muted />
        {!nested && (
          <time dateTime={entry.date} className="text-sm leading-5 text-muted-foreground">
            {formatReleaseDate(entry.date)}
          </time>
        )}
      </div>
      <p className="min-w-0 text-[15px] leading-6 text-muted-foreground">
        {entry.title}
        {entry.pulls.map((number) => (
          <a
            key={number}
            href={`https://github.com/${releasesRepo}/pull/${number}`}
            className="ml-2 font-mono text-[13px] whitespace-nowrap hover:text-link"
          >
            #{number}
          </a>
        ))}
      </p>
    </div>
  )
}

function MaintenanceGroup({
  entries,
  open,
  onToggle,
}: {
  entries: [RenderedEntry, ...RenderedEntry[]]
  open: boolean
  onToggle: (open: boolean) => void
}) {
  const [newest] = entries
  const oldest = entries.at(-1) ?? newest
  return (
    <li className="border-t">
      <details open={open} onToggle={(event) => onToggle(event.currentTarget.open)}>
        <summary
          className={`${row} group cursor-pointer list-none py-5 [&::-webkit-details-marker]:hidden`}
        >
          <span className="flex flex-wrap items-baseline gap-x-3 md:flex-col md:gap-1">
            <span className="font-mono text-sm leading-5 text-muted-foreground tabular-nums">
              v{oldest.version} to v{newest.version}
            </span>
            <time dateTime={newest.date} className="text-sm leading-5 text-muted-foreground">
              {formatReleaseDate(newest.date)}
            </time>
          </span>
          <span className="flex items-center gap-1.5 text-[15px] leading-6 text-muted-foreground group-hover:text-foreground">
            <ChevronRightIcon
              aria-hidden
              className={`size-4 transition-transform duration-150 motion-reduce:transition-none ${open ? "rotate-90" : ""}`}
            />
            {entries.length} maintenance releases
          </span>
        </summary>
        <div className="pb-4">
          {entries.map((entry) => (
            <MaintenanceRow key={entry.tag} entry={entry} nested />
          ))}
        </div>
      </details>
    </li>
  )
}

export function ChangelogList({ units }: { units: RenderedUnit[] }) {
  const [count, setCount] = useState(pageSize)
  const [open, setOpen] = useState<ReadonlySet<number>>(new Set())
  const [target, setTarget] = useState<string | null>(null)
  const sentinel = useRef<HTMLButtonElement>(null)
  const shown = units.slice(0, count)
  const hasMore = units.length > shown.length

  // A link to an older release (#v0.12.0) reveals the page that holds it and opens its group,
  // then scrolls to it once it is in the document.
  useEffect(() => {
    function reveal() {
      const id = decodeURIComponent(window.location.hash.slice(1))
      const index = id ? units.findIndex((unit) => anchorsOf(unit).includes(id)) : -1
      if (index === -1) return
      setCount((value) => Math.max(value, Math.ceil((index + 1) / pageSize) * pageSize))
      const unit = units[index]
      if (unit?.type === "maintenance" && unit.entries.length > 1) {
        setOpen((value) => new Set(value).add(index))
      }
      setTarget(id)
    }
    reveal()
    window.addEventListener("hashchange", reveal)
    return () => window.removeEventListener("hashchange", reveal)
  }, [units])

  useEffect(() => {
    if (!target) return
    document.getElementById(target)?.scrollIntoView()
    setTarget(null)
  }, [target])

  // An observer only reports changes, so it is rebuilt after each page: a sentinel that is still in
  // view after a page loads triggers the next one.
  // biome-ignore lint/correctness/useExhaustiveDependencies: shown.length rebuilds it after each page.
  useEffect(() => {
    const node = sentinel.current
    if (!hasMore || !node) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) setCount((value) => value + pageSize)
      },
      { rootMargin: "400px 0px" },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [hasMore, shown.length])

  return (
    <div className="flex flex-col gap-10">
      <ol className="border-b">
        {shown.map((unit, index) => {
          if (unit.type === "entry") return <Release key={unit.entry.tag} entry={unit.entry} />
          if (unit.entries.length === 1) {
            const [entry] = unit.entries
            return (
              <li key={entry.tag}>
                <MaintenanceRow entry={entry} />
              </li>
            )
          }
          return (
            <MaintenanceGroup
              key={unit.entries[0].tag}
              entries={unit.entries}
              open={open.has(index)}
              onToggle={(isOpen) =>
                setOpen((value) => {
                  if (isOpen === value.has(index)) return value
                  const next = new Set(value)
                  if (isOpen) next.add(index)
                  else next.delete(index)
                  return next
                })
              }
            />
          )
        })}
      </ol>
      {hasMore && (
        // Scrolling near it loads the next page; it is a button so keyboards can do the same.
        <button
          ref={sentinel}
          type="button"
          onClick={() => setCount((value) => value + pageSize)}
          className={`self-center text-sm leading-5 ${textLink}`}
        >
          Show older releases
        </button>
      )}
    </div>
  )
}
