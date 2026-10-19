"use client"

import { cn } from "@sniptide/ui/lib/utils"
import { ChevronRightIcon, MenuIcon, XIcon } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { LogoMark, Wordmark } from "@/components/brand"
import { links } from "@/lib/links"
import { navLinks } from "@/lib/nav"

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2a26ec] dark:focus-visible:outline-[#8f8cff]"
const navLink =
  "flex h-9 items-center px-3 text-[15px] leading-4.5 font-medium hover:bg-[#f3f3fe] dark:hover:bg-[#1f1e2e]"

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const headerRef = useRef<HTMLElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)

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
      className="relative z-30 border-b border-[#e8e8e8] bg-white text-[#0a0a0a] dark:border-[#222222] dark:bg-[#0a0a0a] dark:text-white"
    >
      <div className="flex h-14 items-center justify-between px-5 md:h-18 md:px-10">
        <a href="/home" className={cn("shrink-0 lg:w-60", focusRing)}>
          <span className="flex items-center gap-1.75">
            <LogoMark className="h-6 w-[25px] text-[#2a26ec] dark:text-white" />
            <Wordmark className="mt-px h-[18px] w-[111px]" />
            <span className="sr-only">Sniptide</span>
          </span>
        </a>

        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-2 whitespace-nowrap lg:flex"
        >
          {navLinks.map((link) => (
            <a key={link.label} href={link.href} className={cn(navLink, focusRing)}>
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex shrink-0 items-center justify-end gap-2 lg:w-60">
          <a
            href={links.signIn}
            className={cn(
              "hidden px-3.5 text-[15px] leading-4.5 font-medium hover:opacity-70 md:block",
              focusRing,
            )}
          >
            Sign in
          </a>
          <a
            href={links.signUp}
            className={cn(
              "flex h-9 items-center gap-2 bg-[#2a26ec] px-3.5 text-[15px] leading-4.5 font-semibold text-white hover:bg-[#3a36ff] md:h-10 md:px-4",
              focusRing,
            )}
          >
            Get started
            <ChevronRightIcon className="hidden size-2.5 md:block" strokeWidth={3} />
          </a>
          <button
            ref={toggleRef}
            type="button"
            aria-controls="mobile-navigation"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen(!mobileOpen)}
            className={cn(
              "flex size-9 items-center justify-center bg-[#f2f2f2] lg:hidden dark:bg-[#1c1c1c]",
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
          className="absolute inset-x-0 top-full flex max-h-[calc(100dvh-56px)] flex-col gap-1 overflow-y-auto border-b border-[#e8e8e8] bg-white px-5 pt-3 pb-4 md:max-h-[calc(100dvh-72px)] md:px-10 lg:hidden dark:border-[#222222] dark:bg-[#0a0a0a]"
        >
          {navLinks.map((link) => (
            <a key={link.label} href={link.href} className={cn(navLink, "h-11", focusRing)}>
              {link.label}
            </a>
          ))}
          <a href={links.signIn} className={cn(navLink, "h-11", focusRing)}>
            Sign in
          </a>
        </nav>
      )}
    </header>
  )
}
