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
    // The blue band carries the landing page's Game of Life, kept faint, and the message sits on a
    // glass pill above it like the window over the pink sharing section. Contrast is set for the
    // worst case, a lit cell straight under the pill: white text stays above 4.5:1 there.
    <div id="announcement" className="relative isolate overflow-hidden bg-[#2a26ec] text-white">
      <script
        // biome-ignore lint/security/noDangerouslySetInnerHtml: a fixed script with a JSON-encoded key.
        dangerouslySetInnerHTML={{ __html: dismissedScript }}
      />
      <style>{`html[data-dismissed-announcement="${safeVersion}"] #announcement{display:none}`}</style>
      <LifeField live="#6a66ff" trail="#3f3bf5" density={0.08} className="-z-10 opacity-50" />
      <div className="mx-auto flex max-w-[1440px] justify-center py-1.5 pr-12 pl-5 md:px-14">
        <a
          href={href}
          className="group flex min-h-7 min-w-0 items-center gap-3 rounded-md border border-white/30 bg-linear-to-b from-white/14 to-white/10 px-3 py-1 text-center text-sm leading-5 font-medium shadow-[inset_0_1px_0_rgb(255_255_255/0.35),0_1px_2px_rgb(12_10_90/0.25)] backdrop-blur-[3px] transition-colors duration-150 outline-none hover:border-white/45 hover:from-white/20 hover:to-white/14 focus-visible:ring-2 focus-visible:ring-white/70 motion-reduce:transition-none"
        >
          <span className="min-w-0 text-pretty">{title}</span>
          <span aria-hidden className="hidden h-3.5 w-px shrink-0 bg-white/40 sm:block" />
          <span className="hidden shrink-0 items-center gap-1 sm:inline-flex">
            Read the changelog
            <ArrowRightIcon
              aria-hidden
              className="size-3.5 transition-transform duration-150 group-hover:translate-x-0.5 motion-reduce:transition-none"
            />
          </span>
        </a>
      </div>
      <AnnouncementClose version={safeVersion} />
    </div>
  )
}
