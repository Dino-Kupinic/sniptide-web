"use client"

import { cn } from "@sniptide/ui/lib/utils"
import { ChevronRightIcon, MenuIcon, StarIcon, XIcon } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { LogoMark, Wordmark } from "@/components/brand"
import { links } from "@/lib/links"
import { navLinks } from "@/lib/nav"

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2a26ec] dark:focus-visible:outline-[#8f8cff]"
const navLink =
  "flex h-8 items-center rounded-md px-3 text-sm leading-5 font-medium text-[#4a4747] transition-colors hover:bg-[#f4f4f4] hover:text-[#0a0a0a] dark:text-[#b0b0b0] dark:hover:bg-[#1c1c1c] dark:hover:text-white"
// The two calls to action share one slim size: 32px including the raised edge.
const headerButton =
  "raised-button h-[30px] shrink-0 items-center whitespace-nowrap border px-3 text-sm leading-5 font-medium"

function GitHubMark({ className }: { className: string }) {
  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 .297a12 12 0 0 0-3.793 23.4c.6.111.82-.258.82-.577 0-.285-.011-1.04-.016-2.04-3.338.726-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.73.083-.73 1.205.085 1.84 1.236 1.84 1.236 1.07 1.834 2.807 1.304 3.492.997.108-.776.418-1.305.762-1.604-2.665-.304-5.466-1.333-5.466-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.536-1.523.117-3.176 0 0 1.008-.322 3.301 1.23a11.5 11.5 0 0 1 6.006 0c2.291-1.552 3.297-1.23 3.297-1.23.655 1.653.243 2.873.12 3.176.77.84 1.233 1.91 1.233 3.221 0 4.61-2.806 5.624-5.479 5.921.43.372.823 1.102.823 2.221 0 1.604-.014 2.898-.014 3.293 0 .322.216.694.825.576A12.002 12.002 0 0 0 12 .297z" />
    </svg>
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
    function onPointer(event: PointerEvent) {
      if (event.target instanceof Node && !headerRef.current?.contains(event.target)) {
        setMobileOpen(false)
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

    const desktop = window.matchMedia("(min-width: 1024px)")
    document.addEventListener("keydown", onKey)
    document.addEventListener("pointerdown", onPointer)
    document.addEventListener("click", onClick)
    desktop.addEventListener("change", onDesktop)
    return () => {
      document.removeEventListener("keydown", onKey)
      document.removeEventListener("pointerdown", onPointer)
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

          <nav
            aria-label="Main navigation"
            className="-ml-3 hidden items-center gap-1 whitespace-nowrap lg:flex"
          >
            {navLinks.map((link) => (
              <a key={link.label} href={link.href} className={cn(navLink, focusRing)}>
                {link.label}
              </a>
            ))}
          </nav>
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
            className={cn(
              headerButton,
              "hidden border-[#d8d8d8] bg-white text-[#0a0a0a] [--button-depth:#d0d0d0] hover:bg-[#f7f7f7] md:flex dark:border-[#333333] dark:bg-[#111111] dark:text-white dark:[--button-depth:#383838] dark:hover:bg-[#1c1c1c]",
              focusRing,
            )}
          >
            Sign in
          </a>
          <a
            href={links.signUp}
            className={cn(
              headerButton,
              "flex gap-1.5 border-[#2a26ec] bg-[#2a26ec] text-white hover:border-[#3a36ff] hover:bg-[#3a36ff]",
              focusRing,
            )}
          >
            Get started
            <ChevronRightIcon className="hidden size-3 md:block" strokeWidth={2.5} />
          </a>
          <button
            ref={toggleRef}
            type="button"
            aria-controls="mobile-navigation"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(!mobileOpen)}
            className={cn(
              "flex size-8 items-center justify-center rounded-lg transition-colors hover:bg-[#f4f4f4] lg:hidden dark:hover:bg-[#1c1c1c]",
              focusRing,
            )}
          >
            {mobileOpen ? (
              <XIcon className="size-4.5" strokeWidth={2} />
            ) : (
              <MenuIcon className="size-4.5" strokeWidth={2} />
            )}
            <span className="sr-only">{mobileOpen ? "Close menu" : "Open menu"}</span>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav
          id="mobile-navigation"
          aria-label="Mobile navigation"
          className="absolute inset-x-0 top-full flex max-h-[calc(100dvh-56px)] flex-col gap-1 overflow-y-auto border-b border-[#e8e8e8] bg-white px-5 pt-3 pb-4 md:max-h-[calc(100dvh-64px)] md:px-10 lg:hidden dark:border-[#222222] dark:bg-[#0a0a0a]"
        >
          {navLinks.map((link) => (
            <a key={link.label} href={link.href} className={cn(navLink, "h-11", focusRing)}>
              {link.label}
            </a>
          ))}
          <a href={links.github} className={cn(navLink, "h-11 gap-2", focusRing)}>
            <GitHubMark className="size-4" />
            <span>Star on GitHub</span>
            <StarCount formattedStars={formattedStars} showUnit />
          </a>
          <a href={links.signIn} className={cn(navLink, "h-11", focusRing)}>
            Sign in
          </a>
        </nav>
      )}
    </header>
  )
}
