import { ArrowUpRightIcon } from "lucide-react"
import Image from "next/image"
import grid from "@/assets/landing/footer-grid.png"
import { LogoMark, Wordmark } from "@/components/brand"
import { ConsentSettingsButton } from "@/components/consent-banner"
import { ThemeSwitch } from "@/components/theme-switch"
import { legalLinks } from "@/lib/legal"
import { type NavItem, navLinks, navMenus } from "@/lib/nav"

// The header's menus as columns. Docs leads the Developers column, since the header shows it on
// its own after the menus.
const columns = navMenus.map((menu) => ({
  label: menu.label,
  items: [
    ...(menu.label === "Developers" ? navLinks : []),
    ...menu.groups.flatMap((group) => group.items),
  ] as Pick<NavItem, "label" | "href" | "external">[],
}))

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
      className="@container relative overflow-clip bg-white text-black dark:bg-[#08080b] dark:text-[#d4d4dc]"
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
      <div className="pointer-events-none absolute bottom-[-40px] left-[-100px] hidden h-60 w-147.5 bg-[radial-gradient(ellipse_50%_50%_at_50%_50%,rgb(42_38_236/0.35),transparent)] md:bottom-[-60px] md:left-[calc(50%-600px)] md:h-80 md:w-300 dark:block" />

      {/* The text, links and wordmark share the header's 1440px frame, so they stay centered on
          wide screens while the grid above runs edge to edge. The top padding leaves the grid's
          lit rows clear. */}
      <div className="relative mx-auto flex max-w-[1440px] flex-col px-5 pt-72 md:px-6 md:pt-112">
        <div className="grid gap-10 md:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] md:gap-12">
          <p className="max-w-120 text-[15px] leading-5.5 md:text-base md:leading-5.75">
            The pastebin for your agents. Keep the code you reuse in one library, on sniptide.com or
            on your own server.
          </p>

          <nav
            aria-label="Footer"
            className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 md:justify-self-end md:gap-x-16"
          >
            {columns.map((column) => (
              <div key={column.label} className="flex min-w-0 flex-col gap-3">
                <h2 className="text-[13px] leading-[18px] text-[#6b6b6b] dark:text-[#8a8a93]">
                  {column.label}
                </h2>
                <ul className="flex flex-col gap-2">
                  {column.items.map((item) => (
                    <li key={item.label}>
                      <a
                        href={item.href}
                        {...(item.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                        className="inline-flex items-center gap-1 text-sm leading-5 transition-colors hover:text-[#2a26ec] dark:hover:text-white"
                      >
                        {item.label}
                        {item.external && (
                          <>
                            <ArrowUpRightIcon aria-hidden="true" className="size-3.5 opacity-60" />
                            <span className="sr-only">(opens in a new tab)</span>
                          </>
                        )}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-16 flex max-w-348 items-center gap-4 md:mt-20 md:gap-[4.67%]">
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

        <div className="mt-6 flex flex-col-reverse gap-3 pb-5 text-xs leading-4 md:mt-4 md:flex-row md:items-center md:justify-between dark:text-[#8a8a93]">
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
