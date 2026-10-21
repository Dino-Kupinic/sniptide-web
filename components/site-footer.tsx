import Image from "next/image"
import grid from "@/assets/landing/footer-grid.png"
import { LogoMark, Wordmark } from "@/components/brand"
import { legalLinks } from "@/lib/legal"
import { links } from "@/lib/links"
import { navHref } from "@/lib/nav"

const nav = [
  { label: "Features", href: "#features" },
  { label: "Self-host", href: "#self-host" },
  { label: "Docs", href: links.docs },
  { label: "API", href: links.apiDocs },
  { label: "GitHub", href: links.github },
]

// Moonlit in dark mode; light mode inverts the grid and sets the logo in blue and black.
const markStops: [number, string][] = [
  [0, "#E4E3FF"],
  [0.5, "#8F8CFF"],
  [1, "#3A36FF"],
]
const wordmarkStops: [number, string][] = [
  [0, "#FFFFFF"],
  [0.45, "#E6E6F2"],
  [0.55, "#C9C7FF"],
  [1, "#8F8CFF"],
]

// `home` is the address of the home page when the footer sits on another page.
export function SiteFooter({ home }: { home?: string }) {
  return (
    <footer
      data-cta-location="footer"
      className="relative h-145 overflow-clip bg-white text-black md:h-210 dark:bg-[#08080b] dark:text-[#d4d4dc]"
    >
      {/* Dithered glow grid, cropped so its lower rows meet the tagline. */}
      <Image
        src={grid}
        alt=""
        aria-hidden="true"
        unoptimized
        className="pointer-events-none absolute top-[-440px] left-[-60px] h-205 w-360 max-w-none invert hue-rotate-180 md:top-[-231px] md:left-1/2 md:-translate-x-1/2 dark:invert-0 dark:hue-rotate-0"
      />
      <div className="pointer-events-none absolute top-95 left-[-100px] hidden h-60 w-147.5 bg-[radial-gradient(ellipse_50%_50%_at_50%_50%,rgb(42_38_236/0.35),transparent)] md:top-145 md:left-30 md:h-80 md:w-300 dark:block" />

      <p className="absolute top-72 right-5 left-5 text-[15px] leading-5.5 md:top-112 md:right-auto md:left-6 md:w-120 md:text-base md:leading-5.75">
        The pastebin for modern teams. Share code on the open web, or run Sniptide on your own
        servers.
      </p>

      <nav className="absolute top-93 right-5 left-5 flex flex-wrap gap-x-3 gap-y-2.5 font-mono text-[13px] leading-4 tracking-[0.5px] uppercase md:top-113 md:right-6 md:left-auto md:gap-6">
        {nav.map((item) => (
          <a
            key={item.label}
            href={navHref(item.href, home)}
            className="hover:text-[#2a26ec] dark:hover:text-white"
          >
            {item.label}
          </a>
        ))}
      </nav>

      <div className="absolute right-5 bottom-21.5 left-5 flex max-w-348 items-center gap-4 md:right-6 md:bottom-18.5 md:left-6 md:gap-[4.67%]">
        <LogoMark className="aspect-[243/234] w-[17.4%] text-[#2a26ec] dark:hidden" />
        <LogoMark className="hidden aspect-[243/234] w-[17.4%] dark:block" stops={markStops} />
        <div className="flex-1 pt-[0.65%]">
          <Wordmark className="aspect-[4340/683] w-full text-black dark:hidden" />
          <Wordmark className="hidden aspect-[4340/683] w-full dark:block" stops={wordmarkStops} />
        </div>
        <span className="sr-only">Sniptide</span>
      </div>

      <div className="absolute right-5 bottom-5 left-5 flex justify-between text-xs leading-4 md:right-6 md:left-6 dark:text-[#8a8a93]">
        <p>© 2026 Sniptide</p>
        <div className="flex gap-4 font-mono uppercase md:gap-6">
          {legalLinks.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="hover:text-[#2a26ec] dark:hover:text-white"
            >
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}
