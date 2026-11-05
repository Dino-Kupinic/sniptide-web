"use client"

import { cn } from "@sniptide/ui/lib/utils"
import { ChevronRightIcon, StarIcon } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { LogoMark, Wordmark } from "@/components/brand"
import { GitHubMark } from "@/components/github-mark"
import {
  DesktopNav,
  focusRing,
  MobileNavMenus,
  menuItem,
  menuRow,
  staggerStyle,
} from "@/components/site-nav"
import { links } from "@/lib/links"
import { navLinks, navMenus } from "@/lib/nav"

// The two calls to action share one slim size: 32px including the raised edge.
const headerButton =
  "raised-button h-[30px] shrink-0 items-center whitespace-nowrap border px-3 text-sm leading-5 font-medium"
const secondaryButton =
  "border-[#d8d8d8] bg-white text-[#0a0a0a] [--button-depth:#d0d0d0] hover:bg-[#f7f7f7] dark:border-[#333333] dark:bg-[#111111] dark:text-white dark:[--button-depth:#383838] dark:hover:bg-[#1c1c1c]"
const primaryButton =
  "border-[#2a26ec] bg-[#2a26ec] text-white hover:border-[#3a36ff] hover:bg-[#3a36ff]"
// Two bars that cross into an X, so the toggle changes state in place.
function MenuToggleIcon({ open }: { open: boolean }) {
  const bar =
    "absolute top-[calc(50%-0.75px)] left-0 h-[1.5px] w-4 rounded-full bg-current transition-transform duration-200 ease-out motion-reduce:transition-none"
  return (
    <span aria-hidden="true" className="relative block size-4">
      <span className={cn(bar, open ? "rotate-45" : "-translate-y-[3.5px]")} />
      <span className={cn(bar, open ? "-rotate-45" : "translate-y-[3.5px]")} />
    </span>
  )
}

function StarCount({
  formattedStars,
  showUnit = false,
}: {
  formattedStars: string | null
  showUnit?: boolean
}) {
  if (!formattedStars) return null

  return (
    <span className="inline-flex items-center gap-1">
      <span>{formattedStars}</span>
      <StarIcon
        aria-hidden="true"
        className="size-3.5 fill-[#e353ac] text-[#e353ac] dark:fill-[#f6a9d3] dark:text-[#f6a9d3]"
        strokeWidth={1.5}
      />
      {showUnit && <span>stars</span>}
    </span>
  )
}

export function SiteHeader({ stars }: { stars: number | null }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const headerRef = useRef<HTMLElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)
  const formattedStars =
    stars === null
      ? null
      : new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 }).format(
          stars,
        )

  useEffect(() => {
    if (!mobileOpen) return

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMobileOpen(false)
        toggleRef.current?.focus()
      }
    }
    function onClick(event: MouseEvent) {
      if (
        event.target instanceof Element &&
        headerRef.current?.contains(event.target) &&
        event.target.closest("a")
      ) {
        setMobileOpen(false)
      }
    }
    function onDesktop(event: MediaQueryListEvent) {
      if (event.matches) setMobileOpen(false)
    }

    // The menu covers the page below the header, so the page stops scrolling and leaves the
    // tab order until the menu closes.
    const root = document.documentElement
    const previousOverflow = root.style.overflow
    root.style.overflow = "hidden"
    const covered = Array.from(headerRef.current?.parentElement?.children ?? []).filter(
      (element): element is HTMLElement =>
        element instanceof HTMLElement &&
        element !== headerRef.current &&
        (element.tagName === "MAIN" || element.tagName === "FOOTER"),
    )
    for (const element of covered) element.inert = true

    const desktop = window.matchMedia("(min-width: 1024px)")
    document.addEventListener("keydown", onKey)
    document.addEventListener("click", onClick)
    desktop.addEventListener("change", onDesktop)
    return () => {
      root.style.overflow = previousOverflow
      for (const element of covered) element.inert = false
      document.removeEventListener("keydown", onKey)
      document.removeEventListener("click", onClick)
      desktop.removeEventListener("change", onDesktop)
    }
  }, [mobileOpen])

  return (
    <header
      ref={headerRef}
      data-cta-location="header"
      className="sticky top-0 z-30 border-b border-[#e8e8e8] bg-white text-[#0a0a0a] dark:border-[#222222] dark:bg-[#0a0a0a] dark:text-white"
    >
      <div className="mx-auto flex h-14 max-w-[1440px] items-center justify-between px-5 md:h-16 md:px-10">
        <div className="flex min-w-0 items-center gap-8">
          <a href="/home" className={cn("shrink-0", focusRing)}>
            <span className="flex items-center gap-1.75">
              <LogoMark className="h-6 w-[25px] text-[#2a26ec] dark:text-white" />
              <Wordmark className="mt-px h-[18px] w-[111px]" />
              <span className="sr-only">Sniptide</span>
            </span>
          </a>

          <DesktopNav anchor={headerRef} />
        </div>

        <div className="flex shrink-0 items-center justify-end gap-2">
          <a
            href={links.github}
            aria-label={
              formattedStars
                ? `Star Sniptide on GitHub, ${formattedStars} stars`
                : "Star Sniptide on GitHub"
            }
            className={cn(
              "hidden h-8 shrink-0 items-center gap-2 rounded-md px-2.5 text-sm leading-5 font-medium text-[#4a4747] tabular-nums transition-colors hover:bg-[#f4f4f4] hover:text-[#0a0a0a] lg:flex dark:text-[#b0b0b0] dark:hover:bg-[#1c1c1c] dark:hover:text-white",
              focusRing,
            )}
          >
            <GitHubMark className="size-4" />
            <StarCount formattedStars={formattedStars} />
          </a>
          <span
            aria-hidden="true"
            className="mx-1 hidden h-5 border-r border-[#e8e8e8] lg:block dark:border-[#2f2c2c]"
          />
          <a
            href={links.signIn}
            className={cn(headerButton, secondaryButton, "hidden md:flex", focusRing)}
          >
            Sign in
          </a>
          <a
            href={links.signUp}
            className={cn(
              headerButton,
              primaryButton,
              "flex gap-1.5",
              // The open menu repeats this action next to Sign in, so the header copy steps aside.
              mobileOpen && "invisible opacity-0 lg:visible lg:opacity-100",
              focusRing,
            )}
          >
            Get started
            <ChevronRightIcon className="hidden size-3 md:block" strokeWidth={2.5} />
          </a>
          {/* A 40px touch target whose icon lines up with the gutter. */}
          <button
            ref={toggleRef}
            type="button"
            aria-controls="mobile-navigation"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(!mobileOpen)}
            className={cn(
              "-mr-3 flex size-10 items-center justify-center rounded-lg transition-colors hover:bg-[#f4f4f4] lg:hidden dark:hover:bg-[#1c1c1c]",
              focusRing,
            )}
          >
            <MenuToggleIcon open={mobileOpen} />
            <span className="sr-only">{mobileOpen ? "Close menu" : "Open menu"}</span>
          </button>
        </div>
      </div>

      <div
        id="mobile-navigation"
        data-open={mobileOpen ? "" : undefined}
        inert={!mobileOpen}
        className="group invisible fixed inset-x-0 top-[57px] bottom-0 flex flex-col bg-white opacity-0 transition-[opacity,visibility] duration-200 ease-out data-open:visible data-open:opacity-100 motion-reduce:transition-none md:top-[65px] lg:hidden dark:bg-[#0a0a0a]"
      >
        <nav
          aria-label="Mobile navigation"
          className="mx-auto w-full max-w-[1440px] flex-1 overflow-y-auto px-5 pt-2 md:px-10"
        >
          <MobileNavMenus open={mobileOpen} />
          <ul>
            {navLinks.map((link, index) => (
              <li
                key={link.label}
                className={menuItem}
                style={staggerStyle(mobileOpen, navMenus.length + index)}
              >
                <a href={link.href} className={cn(menuRow, focusRing)}>
                  {link.label}
                </a>
              </li>
            ))}
            <li
              className={menuItem}
              style={staggerStyle(mobileOpen, navMenus.length + navLinks.length)}
            >
              <a
                href={links.github}
                aria-label={
                  formattedStars
                    ? `Star Sniptide on GitHub, ${formattedStars} stars`
                    : "Star Sniptide on GitHub"
                }
                className={cn(menuRow, focusRing)}
              >
                <GitHubMark className="size-4" />
                <span>GitHub</span>
                <span className="ml-auto text-sm leading-5 font-medium text-[#6b6b6b] tabular-nums dark:text-[#a3a3a3]">
                  <StarCount formattedStars={formattedStars} />
                </span>
              </a>
            </li>
          </ul>
        </nav>

        <div
          className={cn(
            menuItem,
            "mx-auto grid w-full max-w-[1440px] grid-cols-2 gap-3 px-5 pt-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] md:px-10",
          )}
          style={staggerStyle(mobileOpen, navMenus.length + navLinks.length + 1)}
        >
          <a
            href={links.signIn}
            className={cn(headerButton, secondaryButton, "flex h-[38px] justify-center", focusRing)}
          >
            Sign in
          </a>
          <a
            href={links.signUp}
            className={cn(headerButton, primaryButton, "flex h-[38px] justify-center", focusRing)}
          >
            Get started
          </a>
        </div>
      </div>
    </header>
  )
}
