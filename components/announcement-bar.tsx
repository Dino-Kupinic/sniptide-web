import { ArrowRightIcon } from "lucide-react"
import { AnnouncementClose } from "@/components/announcement-close"
import { LifeField } from "@/components/life-field"
import { type Announcement, announcementStorageKey } from "@/lib/changelog"

// Runs while the page is parsed, before it paints, so a reader who closed this release's bar never
// sees it flash. <html> already accepts attributes set before hydration (see the theme script).
const dismissedScript = `try{var v=localStorage.getItem(${JSON.stringify(announcementStorageKey)});if(v)document.documentElement.dataset.dismissedAnnouncement=v}catch(e){}`

// A blue bar above the site header that names the newest feature release and links to it in the
// changelog. It scrolls away with the page, and closing it hides it until the next feature ships.
export function AnnouncementBar({ announcement }: { announcement: Announcement }) {
  const { version, title, href } = announcement
  const safeVersion = version.replace(/[^\w.-]/g, "")
  return (
    // The whole bar is a pane of blue glass over the landing page's Game of Life: the cells drift
    // underneath, softened by a light blur. Contrast is set for the worst case, a lit cell straight
    // under a letter: white text stays above 4.5:1 there and at 8:1 over the plain band.
    <div id="announcement" className="relative isolate overflow-hidden bg-[#2a26ec] text-white">
      <script
        // biome-ignore lint/security/noDangerouslySetInnerHtml: a fixed script with a JSON-encoded key.
        dangerouslySetInnerHTML={{ __html: dismissedScript }}
      />
      <style>{`html[data-dismissed-announcement="${safeVersion}"] #announcement{display:none}`}</style>
      <LifeField live="#6a66ff" trail="#4541f8" density={0.14} className="-z-20 opacity-90" />
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 backdrop-blur-[2px]" />
      <a
        href={href}
        className="group mx-auto flex min-h-10 max-w-[1440px] items-center justify-center gap-3 py-2.5 pr-12 pl-5 text-center text-sm leading-5 font-medium outline-none focus-visible:underline md:px-14"
      >
        <span className="min-w-0 text-pretty">{title}</span>
        <span aria-hidden className="hidden h-3.5 w-px shrink-0 bg-white/40 sm:block" />
        <span className="hidden shrink-0 items-center gap-1 underline-offset-4 group-hover:underline sm:inline-flex">
          Read the changelog
          <ArrowRightIcon
            aria-hidden
            className="size-3.5 transition-transform duration-150 group-hover:translate-x-0.5 motion-reduce:transition-none"
          />
        </span>
      </a>
      <AnnouncementClose version={safeVersion} />
    </div>
  )
}
