import { ArrowRightIcon } from "lucide-react"
import type { Metadata } from "next"
import { BlogShell } from "@/components/blog/blog-shell"
import { MarkPair } from "@/components/compare/product-mark"
import { postPath } from "@/lib/blog"
import {
  compareDescription,
  comparePagePath,
  comparePages,
  comparePath,
  competitorDataPath,
  product,
} from "@/lib/compare"

export const metadata: Metadata = {
  title: "Compare Sniptide",
  description: compareDescription,
  alternates: { canonical: comparePath },
}

// The list of "Sniptide vs X" pages, each with its one-line answer.
export default function Page() {
  return (
    <BlogShell cta>
      <div
        data-cta-location="compare"
        className="mx-auto w-full max-w-[1440px] px-5 pt-12 pb-12 md:px-10 md:pt-20 md:pb-16 lg:px-30"
      >
        <header className="flex max-w-[40rem] flex-col gap-4">
          <h1 className="font-heading text-[34px] leading-9.5 font-medium tracking-[-0.03em] md:text-5xl md:leading-13">
            Compare Sniptide
          </h1>
          <p className="text-lg leading-7 text-pretty text-muted-foreground">
            Each page says who the other tool fits better, and every fact links to the page it comes
            from and the day it was checked.
          </p>
        </header>

        <ul className="mt-10 grid gap-4 md:mt-12 md:grid-cols-3">
          {comparePages.map((page) => {
            const name = product(page.competitor).name
            return (
              <li key={page.slug} className="min-w-0">
                <a
                  href={comparePagePath(page.slug)}
                  className="group flex h-full flex-col gap-6 rounded-lg border bg-card p-5 transition-colors hover:bg-muted/50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring md:p-6"
                >
                  <MarkPair competitor={page.competitor} name={name} />
                  <span className="flex flex-1 flex-col gap-2">
                    <span className="font-heading text-xl leading-7 font-medium tracking-[-0.02em]">
                      Sniptide vs {name}
                    </span>
                    <span className="text-[0.9375rem] leading-6 text-pretty text-muted-foreground">
                      {page.summary}
                    </span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-sm leading-5 font-medium text-link">
                    Read the comparison
                    <ArrowRightIcon
                      aria-hidden="true"
                      className="size-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
                    />
                  </span>
                </a>
              </li>
            )
          })}
        </ul>

        <p className="mt-8 max-w-[40rem] text-[0.9375rem] leading-6 text-pretty text-muted-foreground">
          The facts behind these pages are public in{" "}
          <a href={competitorDataPath} className="text-link underline underline-offset-2">
            competitors.json
          </a>
          . For eight Pastebin alternatives in one table, read{" "}
          <a
            href={postPath("pastebin-alternatives")}
            className="text-link underline underline-offset-2"
          >
            Best Pastebin alternatives in 2026
          </a>
          .
        </p>
      </div>
    </BlogShell>
  )
}
