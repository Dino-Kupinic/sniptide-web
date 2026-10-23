import { LogoMark, Wordmark } from "@/components/brand"
import { lastUpdated, legalLinks } from "@/lib/legal"

// Shared frame for the Impressum, privacy policy and terms. Headings, paragraphs, lists and links
// take their style from the article, so each page is plain markup.
const prose = [
  "mt-10 flex flex-col gap-4 text-base leading-6.5",
  "[&_h2]:mt-6 [&_h2]:font-heading [&_h2]:text-2xl [&_h2]:leading-8 [&_h2]:font-medium [&_h2]:tracking-[-0.02em]",
  "[&_h3]:mt-2 [&_h3]:font-medium",
  "[&_ul]:flex [&_ul]:list-disc [&_ul]:flex-col [&_ul]:gap-2 [&_ul]:pl-5",
  "[&_a]:text-[#2a26ec] [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:no-underline dark:[&_a]:text-[#8f8cff]",
  "[&_code]:font-mono [&_code]:text-[0.9em]",
].join(" ")

const focusRing =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2a26ec] dark:focus-visible:outline-[#8f8cff]"

export function LegalPage({
  title,
  updated = true,
  children,
}: {
  title: string
  updated?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-dvh flex-col text-[#1b1919] dark:text-[#f5f5f5]">
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:bg-[#2a26ec] focus:px-3 focus:py-2 focus:text-sm focus:text-white"
      >
        Skip to content
      </a>
      <header className="border-b border-[#e8e8e8] dark:border-[#222222]">
        <div className="flex h-14 items-center px-5 md:h-18 md:px-10">
          <a href="/home" className={focusRing}>
            <span className="flex items-center gap-1.75">
              <LogoMark className="h-6 w-[25px] text-[#2a26ec] dark:text-white" />
              <Wordmark className="mt-px h-[18px] w-[111px]" />
              <span className="sr-only">Sniptide</span>
            </span>
          </a>
        </div>
      </header>

      <main id="content" className="flex-1 px-5 py-12 md:px-10 md:py-20 lg:px-30">
        <article className="max-w-[66ch]">
          <h1 className="font-heading text-[34px] leading-9.5 font-medium tracking-[-0.03em] md:text-5xl md:leading-13">
            {title}
          </h1>
          {updated && (
            <p className="mt-4 text-base leading-6.5 text-[#6b6b6b] dark:text-[#9a9a9a]">
              Last updated on {lastUpdated}.
            </p>
          )}
          <div className={prose}>{children}</div>
        </article>
      </main>

      <footer className="flex justify-between gap-4 border-t border-[#e8e8e8] px-5 py-5 text-xs leading-4 md:px-10 dark:border-[#222222] dark:text-[#8a8a93]">
        <p>© 2026 Sniptide</p>
        <nav aria-label="Legal" className="flex gap-4 font-mono uppercase md:gap-6">
          {legalLinks.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="hover:text-[#2a26ec] dark:hover:text-white"
            >
              {item.label}
            </a>
          ))}
        </nav>
      </footer>
    </div>
  )
}
