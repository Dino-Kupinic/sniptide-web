import { ChevronRightIcon } from "lucide-react"
import { comparisonPath, comparisons } from "@/lib/comparisons"

export function Compare() {
  return (
    <section
      id="compare"
      data-cta-location="compare"
      className="flex scroll-mt-4 flex-col gap-8 border-t border-[#e8e8e8] px-5 py-16 text-[#1b1919] md:p-10 xl:flex-row xl:gap-20 xl:p-30 dark:border-[#1f1f1f] dark:text-[#f5f5f5]"
    >
      <h2 className="shrink-0 font-heading text-[34px] leading-9.5 font-medium tracking-[-0.03em] md:text-5xl md:leading-13 xl:w-110">
        How Sniptide compares with the tools you use today.
      </h2>

      <ul className="flex min-w-0 grow flex-col border-t border-[#e8e8e8] dark:border-[#262626]">
        {comparisons.map((comparison) => (
          <li key={comparison.slug} className="border-b border-[#e8e8e8] dark:border-[#262626]">
            <a
              href={comparisonPath(comparison.slug)}
              className="group flex items-center justify-between gap-6 py-5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2a26ec] dark:focus-visible:outline-[#8f8cff]"
            >
              <span className="flex min-w-0 flex-col gap-1.5">
                <span className="text-lg leading-6 font-semibold group-hover:text-[#2a26ec] dark:group-hover:text-[#8f8cff]">
                  Sniptide vs {comparison.name}
                </span>
                <span className="max-w-[60ch] text-base leading-6.5 text-[#6b6b6b] dark:text-[#9a9a9a]">
                  {comparison.summary}
                </span>
              </span>
              <ChevronRightIcon className="size-4 shrink-0" strokeWidth={2} aria-hidden="true" />
            </a>
          </li>
        ))}
      </ul>
    </section>
  )
}
