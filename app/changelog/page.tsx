import type { Metadata } from "next"
import { BlogShell } from "@/components/blog/blog-shell"
import { secondaryButton } from "@/components/blog/buttons"
import { ChangelogList, type RenderedUnit } from "@/components/changelog/changelog-list"
import { ReleaseMarkdown } from "@/components/changelog/release-markdown"
import { GitHubMark } from "@/components/github-mark"
import { type ChangelogEntry, changelogPath, groupEntries } from "@/lib/changelog"
import { getChangelog } from "@/lib/changelog-source"
import { links } from "@/lib/links"

export const metadata: Metadata = {
  alternates: { canonical: changelogPath },
  title: "Changelog",
  description: "Every Sniptide release, newest first, with what changed for you in each one.",
}

// Releases are read from GitHub and refreshed hourly, so a new release shows up without a deploy.
export const revalidate = 3600

const releasesUrl = `${links.github}/releases`

function render(entry: ChangelogEntry) {
  return { ...entry, content: entry.body ? <ReleaseMarkdown markdown={entry.body} /> : null }
}

export default async function Page() {
  const entries = await getChangelog()
  const units: RenderedUnit[] | null = entries
    ? groupEntries(entries).map((unit) =>
        unit.type === "entry"
          ? { type: "entry", entry: render(unit.entry) }
          : {
              type: "maintenance",
              entries: [render(unit.entries[0]), ...unit.entries.slice(1).map(render)],
            },
      )
    : null

  return (
    <BlogShell>
      <div className="mx-auto w-full max-w-[1440px] px-5 pt-12 pb-20 md:px-10 md:pt-20 md:pb-28 lg:px-30">
        <div className="flex items-end justify-between gap-4 pb-8 md:pb-10">
          <h1 className="font-heading text-[34px] leading-9.5 font-medium tracking-[-0.03em] md:text-5xl md:leading-13">
            Changelog
          </h1>
          <a href={releasesUrl} className={secondaryButton}>
            <GitHubMark className="size-4" />
            <span>
              <span className="sr-only md:not-sr-only">Releases on </span>GitHub
            </span>
          </a>
        </div>
        {units && units.length > 0 ? (
          <ChangelogList units={units} />
        ) : (
          <section className="flex flex-col items-start gap-6 rounded-lg border bg-sidebar px-6 py-10 md:px-12 md:py-14">
            <div className="flex max-w-[34rem] flex-col gap-3">
              <h2 className="font-heading text-2xl leading-8 font-medium tracking-[-0.02em] text-balance md:text-[28px] md:leading-9">
                {units ? "No releases yet" : "The releases could not be loaded"}
              </h2>
              <p className="text-base leading-6.5 text-muted-foreground">
                {units
                  ? "The first release will be listed here when it ships."
                  : "GitHub did not answer in time. The same notes are on the releases page there."}
              </p>
            </div>
            <a href={releasesUrl} className={secondaryButton}>
              <GitHubMark className="size-4" />
              Open the releases on GitHub
            </a>
          </section>
        )}
      </div>
    </BlogShell>
  )
}
