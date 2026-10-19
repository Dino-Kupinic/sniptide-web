import { ChevronRightIcon, MenuIcon } from "lucide-react"
import { LogoMark, Wordmark } from "@/components/brand"
import { links } from "@/lib/links"

const nav = [
  { label: "Product", href: "#features" },
  { label: "Self-host", href: "#self-host" },
  { label: "Developers", href: "#raw-links" },
]

export function SiteHeader() {
  return (
    <header
      data-cta-location="header"
      className="relative z-20 flex h-14 items-center justify-between px-5 text-[#0a0a0a] md:h-18 md:px-10 dark:text-white"
    >
      <a href="/home" className="shrink-0 md:w-60">
        <span className="flex items-center gap-1.75 md:gap-2.25">
          <LogoMark className="h-6.5 w-[27px] md:h-8 md:w-[33.2px]" />
          <Wordmark className="mt-px h-[19px] w-[121px] md:h-[23.3px] md:w-[148.4px]" />
          <span className="sr-only">Sniptide</span>
        </span>
      </a>

      <nav className="hidden items-center gap-8 text-[15px] leading-4.5 font-medium whitespace-nowrap lg:flex">
        {nav.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="hover:text-[#2a26ec] dark:hover:text-[#8f8cff]"
          >
            {item.label}
          </a>
        ))}
      </nav>

      <div className="flex shrink-0 items-center justify-end gap-2 md:w-60">
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

        <details className="group relative md:hidden">
          <summary className="flex size-9 cursor-pointer list-none items-center justify-center bg-[#f2f2f2] dark:bg-[#1c1c1c] [&::-webkit-details-marker]:hidden">
            <MenuIcon className="size-4.5" strokeWidth={2} />
            <span className="sr-only">Menu</span>
          </summary>
          <div className="absolute top-11 right-0 flex w-56 flex-col border border-[#e8e8e8] bg-white py-2 text-[15px] font-medium shadow-[6px_6px_0_#0a0a0a] dark:border-[#262626] dark:bg-[#111111] dark:shadow-[6px_6px_0_#2a26ec]">
            {[...nav, { label: "Sign in", href: links.signIn }].map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="px-4 py-2.5 hover:bg-[#f4f4f4] dark:hover:bg-[#1c1c1c]"
              >
                {item.label}
              </a>
            ))}
          </div>
        </details>
      </div>
    </header>
  )
}
