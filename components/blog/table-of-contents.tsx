"use client"

import { ChevronDownIcon } from "lucide-react"
import { type ReactNode, useEffect, useMemo, useState } from "react"

export type TocItem = { title: ReactNode; url: string; depth: number }

// The heading the reader is in: the last one whose top has passed a band below the sticky header.
function useActiveHeading(ids: string[]) {
  const [active, setActive] = useState<string | undefined>(ids[0])

  useEffect(() => {
    const headings = ids
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null)
    if (headings.length === 0) return

    function update() {
      // A heading reached from the list lands about 144px down (scroll padding for the header plus
      // its own scroll margin), so the band reaches a little past that.
      const offset = 160
      let current = headings[0]?.id
      for (const heading of headings) {
        if (heading.getBoundingClientRect().top - offset <= 0) current = heading.id
      }
      // At the end of the page the last heading may never reach the band, so it wins there.
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
        current = headings[headings.length - 1]?.id
      }
      setActive(current)
    }

    update()
    window.addEventListener("scroll", update, { passive: true })
    window.addEventListener("resize", update)
    return () => {
      window.removeEventListener("scroll", update)
      window.removeEventListener("resize", update)
    }
  }, [ids])

  return active
}

function TocList({ items, active }: { items: TocItem[]; active?: string }) {
  return (
    <ol className="flex flex-col border-l">
      {items.map((item) => {
        const id = item.url.slice(1)
        const current = id === active
        return (
          <li key={item.url}>
            <a
              href={item.url}
              aria-current={current ? "location" : undefined}
              className={`-ml-px block border-l py-1.5 text-sm leading-5 text-pretty transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-link ${
                item.depth > 2 ? "pl-7" : "pl-4"
              } ${
                current
                  ? "border-link font-medium text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {item.title}
            </a>
          </li>
        )
      })}
    </ol>
  )
}

// The post's h2 and h3 headings. Wide screens keep the list beside the text and mark the section
// being read; narrower screens fold it into a plain disclosure above the text.
export function TableOfContents({ items }: { items: TocItem[] }) {
  const shown = useMemo(() => items.filter((item) => item.depth >= 2 && item.depth <= 3), [items])
  const ids = useMemo(() => shown.map((item) => item.url.slice(1)), [shown])
  const active = useActiveHeading(ids)
  if (shown.length < 2) return null

  return (
    <>
      <nav aria-label="On this page" className="hidden xl:block">
        <h2 className="mb-3 text-sm leading-5 font-medium">On this page</h2>
        <TocList items={shown} active={active} />
      </nav>
      <details className="group xl:hidden">
        <summary className="flex h-10 cursor-pointer list-none items-center justify-between text-sm leading-5 font-medium select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-link [&::-webkit-details-marker]:hidden">
          On this page
          <ChevronDownIcon
            aria-hidden="true"
            className="size-4 text-muted-foreground transition-transform group-open:rotate-180 motion-reduce:transition-none"
          />
        </summary>
        <nav aria-label="On this page" className="pt-1 pb-2">
          <TocList items={shown} />
        </nav>
      </details>
    </>
  )
}
