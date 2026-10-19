"use client"

import { cn } from "@sniptide/ui/lib/utils"
import { ChevronDownIcon, ChevronRightIcon, MenuIcon, XIcon } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { LogoMark, Wordmark } from "@/components/brand"
import { links } from "@/lib/links"
import {
  type NavItem,
  productColumns,
  productLinks,
  resourceGroups,
  resourceLinks,
  topLinks,
} from "@/lib/nav"
import { imageUrl } from "@/lib/site"

type Menu = "product" | "resources"

function ItemIcon({ item }: { item: NavItem }) {
  return (
    <svg
      viewBox="0 0 18 18"
      aria-hidden="true"
      className="size-4.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d={item.icon} />
      {item.circles?.map(([cx, cy, r]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={r} />
      ))}
    </svg>
  )
}

// One row in a menu: an outlined icon tile that fills with blue on hover, a title and a line.
function MenuItem({ item, compact }: { item: NavItem; compact?: boolean }) {
  return (
    <a
      href={item.href}
      className={cn(
        "group/item flex items-center gap-3 hover:bg-[#f3f3fe] dark:hover:bg-[#1f1e2e]",
        compact ? "px-3 py-2.5" : "px-3.5 py-3",
      )}
    >
      <span className="flex size-10 shrink-0 items-center justify-center border border-[#e8e8e8] text-[#0a0a0a] group-hover/item:border-[#2a26ec] group-hover/item:bg-[#2a26ec] group-hover/item:text-white dark:border-[#2e2e2e] dark:text-white">
        <ItemIcon item={item} />
      </span>
      <span className="flex flex-col gap-0.5">
        <span className="text-sm leading-5 font-semibold text-[#0a0a0a] dark:text-white">
          {item.title}
        </span>
        <span className="text-[13px] leading-4.5 text-[#6b6b6b] dark:text-[#9a9a9a]">
          {item.description}
        </span>
      </span>
    </a>
  )
}

const panel =
  "border border-[#e8e8e8] bg-white shadow-[0_20px_48px_rgb(0_0_0/0.12)] animate-in fade-in slide-in-from-top-1 duration-150 dark:border-[#2a2a2a] dark:bg-[#121212] dark:shadow-[0_20px_48px_rgb(0_0_0/0.5)]"
const strip =
  "flex items-center justify-between border-t border-[#eeeeee] bg-[#fafafa] dark:border-[#222222] dark:bg-[#0f0f0f]"

function ProductPanel() {
  return (
    <div
      className={cn(
        panel,
        "absolute top-[calc(100%+8px)] left-1/2 flex w-250 max-w-[calc(100%-80px)] -translate-x-1/2 flex-col",
      )}
    >
      <div className="flex gap-2 p-2">
        {productColumns.map((column) => (
          <div key={column[0]?.title} className="flex flex-1 basis-0 flex-col">
            {column.map((item) => (
              <MenuItem key={item.title} item={item} />
            ))}
          </div>
        ))}
        <div className="flex w-75 shrink-0 flex-col gap-2">
          <a
            href={productLinks.terminal}
            className="flex flex-1 flex-col justify-between gap-4 bg-[#2a26ec] p-5 hover:bg-[#3a36ff]"
          >
            <span className="flex flex-col gap-1.5">
              <span className="font-heading text-[22px] leading-6.5 font-medium tracking-[-0.01em] text-white">
                Share from your terminal
              </span>
              <span className="text-[13px] leading-4.5 text-[#c9c7ff]">
                Pipe any output into a link. No browser needed.
              </span>
            </span>
            <span className="flex flex-col gap-1 bg-[#0a0a0a] px-3 py-2.5 font-mono text-xs leading-4.5">
              <span className="text-[#8f8cff]">$ cat error.log | snip</span>
              <span className="text-white">✓ snip.td/8fk2 copied</span>
            </span>
          </a>
          <a
            href={productLinks.forks}
            className="flex flex-col gap-1.5 bg-[#fbd3ea] p-5 text-[#1b1919]"
          >
            <span className="flex justify-between">
              <span className="text-sm leading-5 font-semibold">Forks</span>
              <span className="font-mono text-[11px] leading-4">Oct 9</span>
            </span>
            <span className="text-[13px] leading-4.5">
              Copy any public paste and make it yours.
            </span>
          </a>
        </div>
      </div>
      <div className={cn(strip, "px-5.5 py-3 text-[13px] leading-4.5 font-medium")}>
        <a href={productLinks.allFeatures} className="hover:underline">
          All features
        </a>
        <a
          href={productLinks.changelog}
          className="text-[#2a26ec] hover:underline dark:text-[#8f8cff]"
        >
          Changelog →
        </a>
      </div>
    </div>
  )
}

function ResourcesPanel() {
  return (
    <div className={cn(panel, "absolute inset-x-0 top-full flex flex-col border-x-0 border-t-0")}>
      <div className="flex gap-8 px-10 py-8">
        <div className="flex flex-1 gap-6">
          {resourceGroups.map((group) => (
            <div key={group.title} className="flex flex-1 basis-0 flex-col gap-1">
              <p className="px-3 pb-2 font-heading text-lg leading-6 font-medium text-[#0a0a0a] dark:text-white">
                {group.title}
              </p>
              {group.items.map((item) => (
                <MenuItem key={item.title} item={item} compact />
              ))}
            </div>
          ))}
        </div>
        <a
          href={resourceLinks.selfHost}
          className="flex w-85 shrink-0 flex-col justify-between gap-6 bg-[#2a26ec] p-6 hover:bg-[#3a36ff]"
        >
          <span className="flex flex-col gap-2">
            <span className="font-heading text-[26px] leading-7.5 font-medium tracking-[-0.01em] text-white">
              Run it on your own server
            </span>
            <span className="text-sm leading-5 text-[#c9c7ff]">
              One container, your data, your rules.
            </span>
          </span>
          <span className="flex flex-col gap-1 bg-[#0a0a0a] p-3.5 font-mono text-xs leading-4.5">
            <span className="truncate text-[#8f8cff]">$ docker run {imageUrl}</span>
            <span className="text-white">✓ ready on :3000</span>
          </span>
          <span className="text-sm leading-4.5 font-semibold text-white">Self-host guide →</span>
        </a>
      </div>
      <a href={resourceLinks.blogPost} className={cn(strip, "px-10 py-3.5 text-sm leading-4.5")}>
        <span className="flex items-center gap-3">
          <span className="bg-[#2a26ec] px-2 py-0.5 font-mono text-[11px] leading-4 text-white">
            BLOG
          </span>
          How we ship a release every two days
        </span>
        <span className="font-medium text-[#2a26ec] dark:text-[#8f8cff]">Read →</span>
      </a>
    </div>
  )
}

function MobileMenu() {
  return (
    <div className="absolute inset-x-0 top-full flex max-h-[calc(100dvh-56px)] flex-col gap-6 overflow-y-auto border-b border-[#e8e8e8] bg-white px-2 pt-4 pb-6 lg:hidden dark:border-[#222222] dark:bg-[#0a0a0a]">
      <div className="flex flex-col">
        <p className="px-3 pb-1 font-mono text-[11px] tracking-[0.08em] text-[#8a8a8a] uppercase">
          Product
        </p>
        {productColumns.flat().map((item) => (
          <MenuItem key={item.title} item={item} compact />
        ))}
      </div>
      {resourceGroups.map((group) => (
        <div key={group.title} className="flex flex-col">
          <p className="px-3 pb-1 font-mono text-[11px] tracking-[0.08em] text-[#8a8a8a] uppercase">
            {group.title}
          </p>
          {group.items.map((item) => (
            <MenuItem key={item.title} item={item} compact />
          ))}
        </div>
      ))}
      <div className="flex flex-col gap-2 px-3 text-[15px] font-medium">
        <a href={topLinks.pricing} className="py-2">
          Pricing
        </a>
        <a href={topLinks.docs} className="py-2">
          Docs
        </a>
        <a href={links.signIn} className="py-2">
          Sign in
        </a>
      </div>
    </div>
  )
}

const trigger =
  "flex h-9 items-center gap-1.5 px-3 text-[15px] leading-4.5 font-medium hover:bg-[#f3f3fe] dark:hover:bg-[#1f1e2e]"

export function SiteHeader() {
  const [open, setOpen] = useState<Menu | null>(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const ref = useRef<HTMLElement>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => {
    function close() {
      setOpen(null)
      setMobileOpen(false)
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") close()
    }
    function onPointer(event: PointerEvent) {
      if (!ref.current?.contains(event.target as Node)) close()
    }
    // Following a link inside a menu (often to a section on this page) closes it.
    function onClick(event: MouseEvent) {
      if ((event.target as HTMLElement).closest("header a")) close()
    }
    document.addEventListener("keydown", onKey)
    document.addEventListener("pointerdown", onPointer)
    document.addEventListener("click", onClick)
    return () => {
      document.removeEventListener("keydown", onKey)
      document.removeEventListener("pointerdown", onPointer)
      document.removeEventListener("click", onClick)
    }
  }, [])

  // Menus open on hover with a short grace period, so moving the pointer down into a panel
  // doesn't close it. Clicking a trigger toggles it for touch and keyboard users.
  function hover(menu: Menu | null) {
    clearTimeout(closeTimer.current)
    if (menu) setOpen(menu)
    else closeTimer.current = setTimeout(() => setOpen(null), 120)
  }

  function menuTrigger(menu: Menu, label: string) {
    const active = open === menu
    return (
      <button
        type="button"
        aria-expanded={active}
        onPointerEnter={(event) => event.pointerType === "mouse" && hover(menu)}
        onClick={() => setOpen(active ? null : menu)}
        className={cn(trigger, active && "bg-[#f3f3fe] dark:bg-[#1f1e2e]")}
      >
        {label}
        <ChevronDownIcon
          className={cn("size-3 text-[#6b6b6b] transition-transform", active && "rotate-180")}
          strokeWidth={2.5}
        />
      </button>
    )
  }

  return (
    <header
      ref={ref}
      data-cta-location="header"
      onPointerLeave={(event) => event.pointerType === "mouse" && hover(null)}
      onPointerEnter={(event) => event.pointerType === "mouse" && open && hover(open)}
      className="relative z-30 border-b border-[#e8e8e8] bg-white text-[#0a0a0a] dark:border-[#222222] dark:bg-[#0a0a0a] dark:text-white"
    >
      <div className="flex h-14 items-center justify-between px-5 md:h-18 md:px-10">
        <a href="/home" className="shrink-0 lg:w-60">
          <span className="flex items-center gap-1.75">
            <LogoMark className="h-6 w-[25px] text-[#2a26ec] dark:text-white" />
            <Wordmark className="mt-px h-[18px] w-[111px]" />
            <span className="sr-only">Sniptide</span>
          </span>
        </a>

        <nav className="hidden items-center gap-2 whitespace-nowrap lg:flex">
          {menuTrigger("product", "Product")}
          {menuTrigger("resources", "Resources")}
          <a href={topLinks.pricing} onPointerEnter={() => hover(null)} className={trigger}>
            Pricing
          </a>
          <a href={topLinks.docs} onPointerEnter={() => hover(null)} className={trigger}>
            Docs
          </a>
        </nav>

        <div className="flex shrink-0 items-center justify-end gap-2 lg:w-60">
          <a
            href={links.signIn}
            className="hidden px-3.5 text-[15px] leading-4.5 font-medium hover:opacity-70 md:block"
          >
            Sign in
          </a>
          <a
            href={links.signUp}
            className="flex h-9 items-center gap-2 bg-[#2a26ec] px-3.5 text-[15px] leading-4.5 font-semibold text-white hover:bg-[#3a36ff] md:h-10 md:px-4"
          >
            Get started
            <ChevronRightIcon className="hidden size-2.5 md:block" strokeWidth={3} />
          </a>
          <button
            type="button"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex size-9 items-center justify-center bg-[#f2f2f2] lg:hidden dark:bg-[#1c1c1c]"
          >
            {mobileOpen ? (
              <XIcon className="size-4.5" strokeWidth={2} />
            ) : (
              <MenuIcon className="size-4.5" strokeWidth={2} />
            )}
            <span className="sr-only">Menu</span>
          </button>
        </div>
      </div>

      <div className="hidden lg:block">
        {open === "product" && <ProductPanel />}
        {open === "resources" && <ResourcesPanel />}
      </div>
      {mobileOpen && <MobileMenu />}
    </header>
  )
}
