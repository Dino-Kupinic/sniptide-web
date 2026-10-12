import { Button } from "@sniptide/ui/components/button"
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
      className="flex scroll-mt-4 flex-col gap-12 border-t border-border px-4 py-20 sm:px-8 lg:flex-row lg:items-center lg:gap-20 lg:p-30"
    >
      <div className="flex shrink-0 flex-col gap-5 lg:w-110">
        <p className="text-sm font-medium text-primary">Analytics</p>
        <h2 className="font-heading text-4xl font-medium tracking-[-0.03em] md:text-5xl md:leading-13">
          Know when your link gets opened.
        </h2>
        <p className="text-base leading-6.5 text-muted-foreground">
          Every paste counts its views, total and unique, day by day. See which links are still in
          use and which ones you can let expire.
        </p>
        <div className="flex items-center gap-2.5 pt-2">
          <Button
            className="h-10 gap-2 px-4 text-sm"
            render={<a href={links.newPaste} />}
            nativeButton={false}
          >
            <span className="size-2 bg-primary-foreground" />
            Create a paste
          </Button>
          <Button
            variant="secondary"
            className="h-10 px-4 text-sm"
            render={<a href={links.dashboard} />}
            nativeButton={false}
          >
            Open the dashboard
          </Button>
        </div>
      </div>

      <div className="min-w-0 grow overflow-x-auto border border-border font-mono text-xs leading-4">
        <div className="min-w-150">
          <div className="flex h-11 items-center justify-between border-b border-border px-4.5 tracking-[0.08em]">
            <span className="text-muted-foreground">LIVE LINK OPENS</span>
            <span className="flex items-center gap-1.5 text-primary">
              <span className="size-1.5 bg-primary" />
              SNIPTIDE.COM
            </span>
          </div>
          {rows.map((row) => (
            <div
              key={row.slug}
              className={cn(
                "flex h-11.5 items-center border-b border-[#f0f0f0] px-4.5",
                row.burned && "bg-[#f6f6fe]",
              )}
            >
              <span
                className={cn(
                  "flex w-47.5 shrink-0 items-center gap-2",
                  row.burned && "text-primary",
                )}
              >
                {row.slug}
                {row.burned && (
                  <span className="bg-primary px-1.25 py-px text-[10px] leading-3.5 text-primary-foreground">
                    BURNED
                  </span>
                )}
                {row.locked && <LockIcon className="size-3" strokeWidth={2} />}
              </span>
              <span className="grow text-muted-foreground">{row.file}</span>
              <span className="w-27.5 shrink-0 text-muted-foreground">{row.visibility}</span>
              <span className="w-21 shrink-0 text-right">{row.opens}</span>
              <span className="w-16 shrink-0 text-right text-[#8a8a8a]">{row.when}</span>
            </div>
          ))}
          <div className="flex h-11.5 items-center justify-between px-4.5">
            <span className="text-[#8a8a8a]">6 links · last 5 minutes</span>
            <span>5,410 opens</span>
          </div>
        </div>
      </div>
    </section>
  )
}
