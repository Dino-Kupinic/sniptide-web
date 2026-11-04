import Image from "next/image"
import grid from "@/assets/landing/footer-grid.png"
import { LogoMark, Wordmark } from "@/components/brand"
import { ConsentSettingsButton } from "@/components/consent-banner"
import { ThemeSwitch } from "@/components/theme-switch"
import { legalLinks } from "@/lib/legal"
import { links } from "@/lib/links"

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

export function SiteFooter() {
  return (
    <footer
      data-cta-location="footer"
      className="@container relative h-145 overflow-clip bg-white text-black md:h-210 dark:bg-[#08080b] dark:text-[#d4d4dc]"
    >
      {/* Dithered glow grid, cropped so its lower rows meet the tagline. From md up it stays at its
          1440px size, centered under the content, and past 1440px its sides fade into the footer
          so the grid ends softly instead of stretching. In dark mode it lightens onto the footer
          so its black edges vanish. */}
      <Image
        src={grid}
        alt=""
        aria-hidden="true"
        unoptimized
        className="pointer-events-none absolute top-[-440px] left-[-60px] max-md:[mask-image:linear-gradient(to_bottom,transparent_440px,black_600px)] h-205 w-360 max-w-none invert hue-rotate-180 md:top-[-231px] md:left-1/2 md:h-auto md:w-360 md:-translate-x-1/2 min-[90rem]:[mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)] dark:mix-blend-lighten dark:invert-0 dark:hue-rotate-0"
      />
      <div className="pointer-events-none absolute top-95 left-[-100px] hidden h-60 w-147.5 bg-[radial-gradient(ellipse_50%_50%_at_50%_50%,rgb(42_38_236/0.35),transparent)] md:top-145 md:left-[calc(50%-600px)] md:h-80 md:w-300 dark:block" />

      {/* The text, links and wordmark share the header's 1440px frame, so they stay centered on
          wide screens while the grid above runs edge to edge. */}
      <div className="absolute inset-y-0 right-0 left-0 mx-auto max-w-[1440px]">
        <p className="absolute top-72 right-5 left-5 text-[15px] leading-5.5 md:top-112 md:right-auto md:left-6 md:w-120 md:text-base md:leading-5.75">
          The pastebin for your agents. Keep the code you reuse in one library, on sniptide.com or
          on your own server.
        </p>

        <nav className="absolute top-93 right-5 left-5 flex flex-wrap gap-x-3 gap-y-2.5 font-mono text-[13px] leading-4 tracking-[0.5px] uppercase md:top-113 md:right-6 md:left-auto md:gap-6">
          {nav.map((item) => (
            <a
              key={item.label}
              href={item.href}
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
            <Wordmark
              className="hidden aspect-[4340/683] w-full dark:block"
              stops={wordmarkStops}
            />
          </div>
          <span className="sr-only">Sniptide</span>
        </div>

        <div className="absolute right-5 bottom-5 left-5 flex flex-col-reverse gap-3 text-xs md:flex-row md:items-center md:justify-between leading-4 md:right-6 md:left-6 dark:text-[#8a8a93]">
          <div className="flex items-center justify-between gap-4 md:justify-start">
            <p>© 2026 Sniptide</p>
            <ThemeSwitch />
          </div>
          <div className="flex flex-wrap gap-x-3 gap-y-2 font-mono uppercase md:gap-6">
            {legalLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="hover:text-[#2a26ec] dark:hover:text-white"
              >
                {item.label}
              </a>
            ))}
            <ConsentSettingsButton className="uppercase hover:text-[#2a26ec] dark:hover:text-white" />
          </div>
        </div>
      </div>
    </footer>
  )
}
