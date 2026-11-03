import panelLight from "@/assets/landing/panel-light.webp"
import { PixelCanvas } from "@/components/pixel-canvas"
import { Screenshot } from "@/components/screenshot"
import { SectionHeading } from "@/components/section-heading"
import { docsPages, links } from "@/lib/links"

// The pink section looks the same in both themes, so it shows the light panel in both. Secondary
// text uses the ink at 75%, which keeps AA contrast on the pink, and only the large second line of
// the heading uses #a04577.

const rules = [
  {
    title: "Expiry",
    text: "Pick an hour, a day, a week, a month or never. When time is up, the link stops working.",
  },
  {
    title: "Burn after read",
    text: "The first person to open it is the last, and the link answers 410 after that.",
  },
  {
    title: "Password",
    text: "Visitors unlock the paste before they see a single line, and you never see the prompt.",
  },
  {
    title: "Invite people",
    text: "Share a private paste with teammates by email or username, with view or edit access.",
  },
  {
    title: "Raw links",
    text: "Every file is one curl away as plain text, and you can switch that off per paste.",
  },
  {
    title: "View counts",
    text: "See total and unique opens per day. Crawlers and link previews never count.",
  },
]

export function Sharing() {
  return (
    <section
      id="sharing"
      data-cta-location="sharing"
      className="relative flex scroll-mt-4 flex-col gap-10 overflow-clip bg-[#fbd3ea] section-frame py-16 text-[#2b0a1f] md:gap-14 md:py-20 xl:py-30"
    >
      <PixelCanvas kind="grain" className="absolute inset-0 size-full opacity-35" />

      <SectionHeading
        className="relative"
        claim="When a person needs it, send a link."
        reason="Every link carries its own rules."
        reasonClassName="text-[#a04577]"
      />

      <div className="relative grid items-start gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,4fr)] lg:gap-16">
        <div className="flex flex-col gap-10">
          <ul className="flex flex-col border-b border-[#2b0a1f]/18">
            {rules.map((rule) => (
              <li
                key={rule.title}
                className="grid min-w-0 gap-1 border-t border-[#2b0a1f]/18 py-5 sm:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] sm:gap-6"
              >
                <h3 className="text-base leading-5.5 font-semibold">{rule.title}</h3>
                <p className="text-base leading-6 text-[#2b0a1f]/75">{rule.text}</p>
              </li>
            ))}
          </ul>
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <a
              href={links.newPaste}
              className="raised-button flex h-11 shrink-0 items-center gap-2 bg-[#2b0a1f] [--button-depth:#160510] [--button-focus:#2b0a1f] px-4 text-sm leading-5 font-medium text-[#fbd3ea] hover:bg-[#3d1230]"
            >
              <span className="size-2 bg-[#fbd3ea]" />
              Create a paste
            </a>
            <a
              href={docsPages.sharing}
              className="text-base leading-6 font-medium underline decoration-[#2b0a1f]/40 underline-offset-4 hover:decoration-[#2b0a1f]"
            >
              Read how sharing works
            </a>
          </div>
        </div>

        <figure className="flex flex-col gap-3 sm:max-w-90 lg:max-w-none">
          <Screenshot
            light={panelLight}
            alt="The sharing panel of a paste in Sniptide: the link with a copy button, Private, Unlisted and Public, then an expiry, password, burn after reading and raw access switches."
            className="border-[#2b0a1f]/25"
          />
          <figcaption className="text-base leading-6 text-[#2b0a1f]/75">
            Every rule sits in the panel next to the paste.
          </figcaption>
        </figure>
      </div>
    </section>
  )
}
