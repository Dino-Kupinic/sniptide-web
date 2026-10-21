import { Cta } from "@/components/cta"
import { JsonLd } from "@/components/json-ld"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { type Comparison, comparisonPath, comparisons, comparisonsChecked } from "@/lib/comparisons"
import { comparisonStructuredData } from "@/lib/structured-data"

const muted = "text-[#6b6b6b] dark:text-[#9a9a9a]"
const link =
  "text-[#2a26ec] underline underline-offset-2 hover:no-underline dark:text-[#8f8cff] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2a26ec] dark:focus-visible:outline-[#8f8cff]"

// "a", "a and b", "a, b and c".
function list(items: React.ReactNode[]) {
  return items.map((item, index) => (
    // The list is static, so the position is a stable key.
    // biome-ignore lint/suspicious/noArrayIndexKey: static list, never reordered.
    <span key={index}>
      {index > 0 && (index === items.length - 1 ? " and " : ", ")}
      {item}
    </span>
  ))
}

// The home page keeps its sections, so the header and footer on this page link into it.
const home = "/home"

export function ComparisonPage({ comparison }: { comparison: Comparison }) {
  const others = comparisons.filter((item) => item.slug !== comparison.slug)

  return (
    <div className="text-[#0a0a0a] dark:text-white">
      <JsonLd data={comparisonStructuredData(comparison)} />
      <SiteHeader home={home} />
      <main>
        <article className="flex flex-col gap-12 px-5 py-12 md:gap-16 md:px-10 md:py-20 xl:px-30">
          <header className="flex max-w-[66ch] flex-col gap-5">
            <h1 className="font-heading text-[34px] leading-9.5 font-medium tracking-[-0.03em] md:text-5xl md:leading-13">
              Sniptide vs {comparison.name}
            </h1>
            <p className={`text-base leading-6.5 md:text-lg md:leading-7 ${muted}`}>
              {comparison.lead}
            </p>
          </header>

          <div className="flex flex-col gap-4">
            <table className="w-full border-collapse text-left text-[15px] leading-6">
              <caption className="sr-only">
                Sniptide and {comparison.name} compared feature by feature
              </caption>
              <thead className="sr-only md:table-header-group md:not-sr-only">
                <tr className="border-b border-[#1b1919] dark:border-[#f5f5f5]">
                  <th scope="col" className="w-1/5 py-3 pr-6 font-medium">
                    Feature
                  </th>
                  <th
                    scope="col"
                    className="w-2/5 py-3 pr-6 font-medium text-[#2a26ec] dark:text-[#8f8cff]"
                  >
                    Sniptide
                  </th>
                  <th scope="col" className="w-2/5 py-3 font-medium">
                    {comparison.name}
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparison.rows.map((row) => (
                  <tr
                    key={row.label}
                    className="block border-b border-[#e8e8e8] py-4 md:table-row md:py-0 dark:border-[#262626]"
                  >
                    <th
                      scope="row"
                      className="block pb-2 font-medium md:table-cell md:py-4 md:pr-6 md:align-top"
                    >
                      {row.label}
                    </th>
                    <td
                      data-label="Sniptide"
                      className="block py-1 before:block before:font-medium before:text-[#2a26ec] before:content-[attr(data-label)] md:table-cell md:py-4 md:pr-6 md:align-top md:before:hidden dark:before:text-[#8f8cff]"
                    >
                      {row.sniptide}
                    </td>
                    <td
                      data-label={comparison.name}
                      className="block py-1 before:block before:font-medium before:content-[attr(data-label)] md:table-cell md:py-4 md:align-top md:before:hidden"
                    >
                      {row.other}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className={`max-w-[66ch] text-sm leading-5.5 ${muted}`}>
              The details about {comparison.name} come from{" "}
              {list(
                comparison.sources.map((source) => (
                  <a key={source.href} href={source.href} className={link}>
                    {source.label}
                  </a>
                )),
              )}
              , last checked on {comparisonsChecked}. &ldquo;Not documented&rdquo; means those pages
              do not say either way.
            </p>
          </div>

          {comparison.sections.map((section) => (
            <section
              key={section.heading}
              className="flex flex-col gap-5 border-t border-[#e8e8e8] pt-10 xl:grid xl:grid-cols-[5fr_7fr] xl:gap-20 dark:border-[#262626]"
            >
              <h2 className="font-heading text-[26px] leading-8 font-medium tracking-[-0.02em] md:text-[32px] md:leading-10">
                {section.heading}
              </h2>
              <div className="flex max-w-[66ch] flex-col gap-4 text-base leading-6.5">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}

          <nav
            aria-label="Other comparisons"
            className="flex flex-col gap-3 border-t border-[#e8e8e8] pt-10 sm:flex-row sm:gap-8 dark:border-[#262626]"
          >
            {others.map((other) => (
              <a
                key={other.slug}
                href={comparisonPath(other.slug)}
                className={`${link} text-base leading-6.5`}
              >
                Sniptide vs {other.name}
              </a>
            ))}
          </nav>
        </article>
        <Cta />
      </main>
      <SiteFooter home={home} />
    </div>
  )
}
