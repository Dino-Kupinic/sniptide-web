import { ArrowRightIcon } from "lucide-react"
import type { Metadata } from "next"
import { BlogShell } from "@/components/blog/blog-shell"
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
        className="mx-auto w-full max-w-[44rem] px-5 pt-12 pb-12 md:px-0 md:pt-20 md:pb-16"
      >
        <header className="flex flex-col gap-4">
          <h1 className="font-heading text-[34px] leading-9.5 font-medium tracking-[-0.03em] md:text-5xl md:leading-13">
            Compare Sniptide
          </h1>
          <p className="text-lg leading-7 text-pretty text-muted-foreground">
            Each page says who the other tool fits better, and every fact links to the page it comes
            from and the day it was checked.
          </p>
        </header>

        <ul className="mt-10 flex flex-col border-t">
          {comparePages.map((page) => (
            <li key={page.slug} className="border-b">
              <a
                href={comparePagePath(page.slug)}
                className="group flex items-start gap-4 py-6 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
              >
                <span className="flex min-w-0 flex-1 flex-col gap-1.5">
                  <span className="font-heading text-xl leading-7 font-medium tracking-[-0.02em] group-hover:text-link">
                    Sniptide vs {product(page.competitor).name}
                  </span>
                  <span className="text-[0.9375rem] leading-6 text-pretty text-muted-foreground">
                    {page.summary}
                  </span>
                </span>
                <ArrowRightIcon
                  aria-hidden="true"
                  className="mt-1.5 size-4 shrink-0 text-muted-foreground group-hover:text-link"
                />
              </a>
            </li>
          ))}
        </ul>

        <p className="mt-8 text-[0.9375rem] leading-6 text-pretty text-muted-foreground">
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
