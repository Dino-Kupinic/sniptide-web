import {
  BracesIcon,
  ChartColumnIcon,
  CodeXmlIcon,
  HistoryIcon,
  ImportIcon,
  MessageSquareIcon,
} from "lucide-react"
import { links } from "@/lib/links"

const items = [
  {
    icon: BracesIcon,
    title: "API and SDKs",
    text: "A REST API described in OpenAPI, with TypeScript and Python SDKs that retry safely.",
    href: links.apiDocs,
  },
  {
    icon: ImportIcon,
    title: "Gist import",
    text: "Bring a GitHub gist over with all of its files and their names.",
    href: links.importGist,
  },
  {
    icon: HistoryIcon,
    title: "Revisions",
    text: "Every save is a revision you can compare side by side and roll back.",
  },
  {
    icon: MessageSquareIcon,
    title: "Link previews",
    text: "Slack, Discord and X unfurl a card with the first lines, and you can post a link to a channel.",
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
  },
]

export function Proof() {
  return (
    <section
      data-cta-location="proof"
      className="flex flex-col gap-8 border-t border-[#e8e8e8] bg-[#fafafa] px-5 py-16 text-[#1b1919] md:gap-10 md:p-10 xl:px-30 xl:py-24 dark:border-[#1f1f1f] dark:bg-[#0f0f0f] dark:text-[#f5f5f5]"
    >
      <h2 className="max-w-240 font-heading text-[28px] leading-8.5 font-medium tracking-[-0.025em] md:text-[34px] md:leading-10">
        Everything around the paste ships in the same app.
      </h2>
      <ul className="grid gap-x-5 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map(({ icon: Icon, title, text, href }) => (
          <li
            key={title}
            className="flex min-w-0 gap-3 border-t border-[#e8e8e8] pt-4 dark:border-[#262626]"
          >
            <Icon
              aria-hidden="true"
              className="mt-0.5 size-4 shrink-0 text-[#6b6b6b] dark:text-[#9a9a9a]"
              strokeWidth={2}
            />
            <div className="flex flex-col gap-1">
              <h3 className="text-base leading-5.5 font-semibold">
                {href ? (
                  <a href={href} className="underline-offset-4 hover:underline">
                    {title}
                  </a>
                ) : (
                  title
                )}
              </h3>
              <p className="text-sm leading-5.5 text-[#6b6b6b] dark:text-[#9a9a9a]">{text}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
