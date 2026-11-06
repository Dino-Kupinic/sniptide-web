"use client"

import { Menu } from "@base-ui/react/menu"
import { CheckIcon, ChevronDownIcon, CopyIcon, RssIcon } from "lucide-react"
import { useState } from "react"
import { feedPath, feeds } from "@/lib/blog"
import { siteUrl } from "@/lib/site"

const row =
  "flex h-8 cursor-default items-center gap-2.5 rounded-md px-3 text-sm leading-5 outline-none select-none data-highlighted:bg-muted"

// The feeds a reader can follow, as a menu: each format opens its feed, and the last row copies the
// RSS address for pasting into a reader.
export function SubscribeMenu() {
  const [copied, setCopied] = useState(false)

  async function copy() {
    try {
      await navigator.clipboard.writeText(`${siteUrl}${feedPath}`)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      setCopied(false)
    }
  }

  return (
    <Menu.Root>
      <Menu.Trigger className="inline-flex h-8 items-center gap-1.5 rounded-lg border bg-background px-3 text-sm leading-5 font-medium transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-link data-popup-open:bg-muted">
        <RssIcon aria-hidden="true" className="size-4 text-muted-foreground" />
        Subscribe
        <ChevronDownIcon aria-hidden="true" className="size-3.5 text-muted-foreground" />
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner sideOffset={6} align="end" className="z-40 outline-none">
          <Menu.Popup className="blog min-w-48 origin-(--transform-origin) rounded-lg border bg-popover p-1 text-foreground shadow-(--float-shadow) transition-[opacity,scale] duration-100 data-ending-style:scale-98 data-ending-style:opacity-0 data-starting-style:scale-98 data-starting-style:opacity-0 motion-reduce:transition-none">
            {feeds.map((feed) => (
              <Menu.LinkItem key={feed.path} href={feed.path} className={row}>
                <RssIcon aria-hidden="true" className="size-4 text-muted-foreground" />
                {feed.label}
              </Menu.LinkItem>
            ))}
            <Menu.Separator className="my-1 h-px bg-border" />
            <Menu.Item className={row} closeOnClick={false} onClick={copy}>
              {copied ? (
                <CheckIcon aria-hidden="true" className="size-4 text-highlight" />
              ) : (
                <CopyIcon aria-hidden="true" className="size-4 text-muted-foreground" />
              )}
              {copied ? "RSS link copied" : "Copy RSS link"}
            </Menu.Item>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  )
}
