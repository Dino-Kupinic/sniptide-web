import { ArrowLeftIcon } from "lucide-react"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { BlogShell } from "@/components/blog/blog-shell"
import { secondaryButton } from "@/components/blog/buttons"
import { InlineCta } from "@/components/blog/comparison"
import { CompareTable } from "@/components/compare/compare-table"
import { FunnelTracking } from "@/components/funnel-tracking"
import {
  compareMarkdownPath,
  comparePage,
  comparePagePath,
  comparePages,
  comparePath,
  compareStructuredData,
  comparison,
  competitorDataPath,
  formatVerified,
} from "@/lib/compare"
import { links } from "@/lib/links"
import { serializeJsonLd } from "@/lib/structured-data"

type Props = { params: Promise<{ slug: string }> }

export const dynamic = "force-static"
export const dynamicParams = false

export function generateStaticParams() {
  return comparePages.map((page) => ({ slug: page.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = comparePage((await params).slug)
  if (!page) return {}
  return {
    title: page.title,
    description: page.description,
    alternates: {
      canonical: comparePagePath(page.slug),
      types: { "text/markdown": compareMarkdownPath(page.slug) },
    },
  }
}

// A "Sniptide vs X" page: the answer, who each tool is for, the table from the public data file,
// when to pick each tool, how to move over, and every source with the day it was checked.
export default async function Page({ params }: Props) {
  const page = comparePage((await params).slug)
  if (!page) notFound()
  const { products, groups, sources, oldest, newest } = comparison(page)
  const them = products[1].name

  return (
    <BlogShell cta>
      <script
        type="application/ld+json"
        // Built from lib/compare.ts and escaped by serializeJsonLd.
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD must be raw script text.
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(compareStructuredData(page)) }}
      />
      <article
        data-cta-location="compare"
        className="mx-auto w-full max-w-[44rem] px-5 pt-8 pb-12 md:px-0 md:pt-14 md:pb-16"
      >
        <header>
          <a href={comparePath} className={secondaryButton}>
            <ArrowLeftIcon aria-hidden="true" className="size-4" />
            All comparisons
          </a>
          <h1 className="mt-8 font-heading text-[34px] leading-10 font-medium tracking-[-0.03em] text-balance md:text-5xl md:leading-[3.5rem]">
            {page.title}
          </h1>
          <p className="mt-5 text-lg leading-7 text-pretty text-muted-foreground md:text-xl md:leading-8">
            {page.summary}
          </p>
        </header>

        <div className="blog-prose mt-10">
          <p>
            Sniptide publishes this comparison, so every fact links to its source below, and the
            data is public in <a href={competitorDataPath}>competitors.json</a>.
          </p>

          <h2 id="who-each-tool-is-for">Who each tool is for</h2>
          <p>{page.forThem}</p>
          <p>{page.forSniptide}</p>

          <h2 id="side-by-side">Side by side</h2>
          <CompareTable
            products={products}
            groups={groups}
            caption={`From each tool's own documentation, checked between ${formatVerified(oldest)} and ${formatVerified(newest)}. A dash means no, and a question mark means the docs don't say.`}
          />

          <h2 id="choose-them">Choose {them} if</h2>
          <ul>
            {page.chooseThem.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <h2 id="choose-sniptide">Choose Sniptide if</h2>
          <ul>
            {page.chooseSniptide.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <InlineCta
            title="Try it with your own snippets"
            description="Save a paste once and find it again from the browser, the terminal or your agent."
            href={links.signUp}
            label="Create your first paste"
            secondaryHref={links.selfHost}
            secondaryLabel="Self-host it"
          />

          <h2 id="moving">Moving from {them}</h2>
          <p>{page.moving}</p>

          <h2 id="sources">Sources</h2>
          <ul>
            {sources.flatMap(({ product: item, sources: list }) =>
              list.map((source) => (
                <li key={`${item.id}-${source.url}`}>
                  {item.name}: <a href={source.url}>{source.title}</a>, checked on{" "}
                  <time dateTime={source.verified}>{formatVerified(source.verified)}</time>
                </li>
              )),
            )}
          </ul>
        </div>
      </article>
      <FunnelTracking />
    </BlogShell>
  )
}
