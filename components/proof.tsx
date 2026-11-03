import {
  BracesIcon,
  ChartColumnIcon,
  ChevronRightIcon,
  CodeXmlIcon,
  HistoryIcon,
  ImportIcon,
  MessageSquareIcon,
} from "lucide-react"
import { docsPages } from "@/lib/links"

// A denser catalog after the demonstrations. A capability with a docs page links to it.
const items: { icon: typeof BracesIcon; title: string; text: string; href?: string }[] = [
  {
    icon: BracesIcon,
    title: "API and SDKs",
    text: "A REST API described in OpenAPI, with TypeScript and Python SDKs that retry safely.",
    href: docsPages.sdks,
  },
  {
    icon: ImportIcon,
    title: "Gist import",
    text: "Bring a GitHub gist over with all of its files and their names.",
    href: docsPages.importGist,
  },
  {
    icon: HistoryIcon,
    title: "Revisions",
    text: "Every save is a revision you can compare side by side and roll back.",
    href: docsPages.revisions,
  },
  {
    icon: MessageSquareIcon,
    title: "Link previews",
    text: "Slack, Discord and X unfurl a card with the first lines, and you can post a link to a channel.",
    href: `${docsPages.sharing}#link-previews-and-channels`,
  },
  {
    icon: CodeXmlIcon,
    title: "Embed and print",
    text: "Put a paste inside your docs, or print it with its highlighting intact.",
  },
  {
    icon: ChartColumnIcon,
    title: "Analytics without cookies",
    text: "Views, visitors, copies and referrers, counted in your own database.",
    href: docsPages.analytics,
  },
]

function Item({ icon: Icon, title, text }: (typeof items)[number]) {
  return (
    <>
      <Icon
        aria-hidden="true"
        className="mt-1 size-4 shrink-0 text-[#6b6b6b] dark:text-[#9a9a9a]"
        strokeWidth={2}
      />
      <span className="flex min-w-0 flex-col gap-1">
        <span className="text-base leading-6 font-semibold">{title}</span>
        <span className="text-base leading-6 text-[#6b6b6b] dark:text-[#9a9a9a]">{text}</span>
      </span>
    </>
  )
}

export function Proof() {
  return (
    <section
      data-cta-location="proof"
      className="grid gap-8 border-t border-[#e8e8e8] bg-[#fafafa] section-frame py-16 text-[#1b1919] md:py-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-16 xl:py-24 dark:border-[#1f1f1f] dark:bg-[#0f0f0f] dark:text-[#f5f5f5]"
    >
      <h2 className="font-heading text-[28px] leading-8.5 font-medium tracking-[-0.025em] text-balance md:text-[34px] md:leading-10">
        Everything around the paste ships in the same app.
      </h2>
      <ul className="grid gap-x-8 sm:grid-cols-2">
        {items.map((item) => (
          <li key={item.title} className="min-w-0 border-t border-[#e8e8e8] dark:border-[#262626]">
            {item.href ? (
              <a
                href={item.href}
                className="group relative flex gap-3 py-5 pr-6 hover:text-[#2a26ec] dark:hover:text-[#8f8cff]"
              >
                <Item {...item} />
                <ChevronRightIcon
                  aria-hidden="true"
                  className="absolute top-6 right-0 size-4 text-[#6b6b6b] transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none dark:text-[#9a9a9a]"
                  strokeWidth={2}
                />
              </a>
            ) : (
              <div className="flex gap-3 py-5 pr-6">
                <Item {...item} />
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}
