import { cn } from "@sniptide/ui/lib/utils"
import { LockIcon } from "lucide-react"
import { links } from "@/lib/links"

type Row = {
  slug: string
  file: string
  visibility: string
  opens: string
  when: string
  burned?: boolean
  locked?: boolean
}

const rows: Row[] = [
  {
    slug: "/k7Qe2x",
    file: "use-debounce.ts",
    visibility: "unlisted",
    opens: "1,204",
    when: "2s ago",
  },
  { slug: "/9fLm3a", file: "nginx.conf", visibility: "public", opens: "2,871", when: "9s ago" },
  {
    slug: "/Xw81bP",
    file: "trace.log",
    visibility: "private",
    opens: "1",
    when: "14s ago",
    burned: true,
  },
  {
    slug: "/p3Hc7v",
    file: "deployment.yaml",
    visibility: "unlisted",
    opens: "386",
    when: "31s ago",
  },
  {
    slug: "/pg-backup",
    file: "backup.sh +1",
    visibility: "password",
    opens: "6",
    when: "1m ago",
    locked: true,
  },
  {
    slug: "/Lq20Za",
    file: "docker-compose.yml",
    visibility: "public",
    opens: "942",
    when: "2m ago",
  },
]

export function Analytics() {
  return (
    <section
      id="analytics"
      data-cta-location="analytics"
      className="flex scroll-mt-4 flex-col gap-8 border-t border-[#e8e8e8] px-5 py-16 text-[#1b1919] md:p-10 xl:flex-row xl:items-center xl:gap-20 xl:p-30 dark:border-[#1f1f1f] dark:text-[#f5f5f5]"
    >
      <div className="flex shrink-0 flex-col gap-5 xl:w-110">
        <h2 className="font-heading text-[34px] leading-9.5 font-medium tracking-[-0.03em] md:text-5xl md:leading-13">
          See every open, the second it happens.
        </h2>
        <p className="text-base leading-6.5 text-[#6b6b6b] dark:text-[#9a9a9a]">
          Every paste counts its views, total and unique, day by day. See which links are still in
          use and which ones you can let expire.
        </p>
        <div className="flex flex-wrap items-center gap-2.5 pt-2">
          <a
            href={links.newPaste}
            className="raised-button flex h-10 items-center gap-2 bg-[#2a26ec] px-4 text-sm leading-5 font-medium text-white hover:bg-[#3a36ff]"
          >
            <span className="size-2 bg-white" />
            Create a paste
          </a>
          <a
            href={links.dashboard}
            className="raised-button flex h-10 items-center bg-[#f4f4f4] [--button-depth:#d0d0d0] dark:[--button-depth:#383838] px-4 text-sm leading-5 font-medium hover:bg-[#e8e8e8] dark:bg-[#1f1f1f] dark:hover:bg-[#2a2a2a]"
          >
            Open the dashboard
          </a>
        </div>
      </div>

      <div className="min-w-0 grow overflow-hidden rounded-lg border border-[#e8e8e8] font-mono text-xs leading-4 dark:border-[#262626] dark:bg-[#111111]">
        <div className="flex h-11 items-center justify-between border-b border-[#e8e8e8] px-4.5 tracking-[0.08em] dark:border-[#262626]">
          <span className="text-[#6b6b6b] dark:text-[#9a9a9a]">LIVE LINK OPENS</span>
          <span className="flex items-center gap-1.5 text-[#2a26ec] dark:text-[#8f8cff]">
            <span className="size-1.5 bg-[#2a26ec]" />
            SNIPTIDE.COM
          </span>
        </div>
        {rows.map((row) => (
          <div
            key={row.slug}
            className={cn(
              "flex h-11.5 items-center gap-3 border-b xl:gap-0 border-[#f0f0f0] px-4.5 dark:border-[#1c1c1c]",
              row.burned && "bg-[#f6f6fe] dark:bg-[#17163a]",
            )}
          >
            <span
              className={cn(
                "flex w-33 shrink-0 items-center gap-2 sm:w-47.5",
                row.burned && "text-[#2a26ec] dark:text-[#8f8cff]",
              )}
            >
              {row.slug}
              {row.burned && (
                <span className="rounded-sm bg-[#2a26ec] px-1.25 py-px text-[10px] leading-3.5 text-white">
                  BURNED
                </span>
              )}
              {row.locked && <LockIcon className="size-3" strokeWidth={2} />}
            </span>
            <span className="min-w-0 grow truncate text-[#6b6b6b] dark:text-[#9a9a9a]">
              {row.file}
            </span>
            <span className="hidden w-27.5 shrink-0 text-[#6b6b6b] sm:block dark:text-[#9a9a9a]">
              {row.visibility}
            </span>
            <span className="hidden w-21 shrink-0 text-right sm:block">{row.opens}</span>
            <span className="w-16 shrink-0 text-right text-[#8a8a8a]">{row.when}</span>
          </div>
        ))}
        <div className="flex h-11.5 items-center justify-between px-4.5">
          <span className="text-[#8a8a8a]">6 links · last 5 minutes</span>
          <span>5,410 opens</span>
        </div>
      </div>
    </section>
  )
}
