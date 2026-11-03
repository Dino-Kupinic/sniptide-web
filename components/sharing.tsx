import { cn } from "@sniptide/ui/lib/utils"
import { EyeIcon, LockIcon, XIcon } from "lucide-react"
import { PixelCanvas } from "@/components/pixel-canvas"
import { SectionHeading } from "@/components/section-heading"
import { docsPages, links } from "@/lib/links"

// The pink section looks the same in both themes. Small labels use the ink at 70%, which keeps
// AA contrast on the pink, and only the large second line of the heading uses #a04577.

function ExpiryVisual() {
  const marks = ["1h", "1d", "1w", "1m", "never"]
  return (
    <div className="flex w-full flex-col gap-3 font-mono text-[11px] leading-4">
      <span className="text-sm leading-5 font-medium font-sans">Expires after 1 week</span>
      <div className="relative flex h-6 items-center justify-between rounded-md bg-[#2b0a1f]/10 px-3">
        <div className="absolute inset-y-0 left-0 w-1/2 rounded-l-md bg-[#2b0a1f]" />
        <div className="absolute top-0 left-[calc(50%-16px)] h-6 w-8 rounded-md border border-[#2b0a1f] bg-[#fbd3ea]" />
        {marks.map((mark, i) => (
          <span
            key={mark}
            className={cn(
              "relative size-1 rounded-full",
              i < 2 ? "bg-[#fbd3ea]" : "bg-[#2b0a1f]/40",
            )}
          />
        ))}
      </div>
      <div className="flex justify-between text-[#2b0a1f]/70">
        {marks.map((mark) => (
          <span key={mark}>{mark}</span>
        ))}
      </div>
    </div>
  )
}

function BurnVisual() {
  const box = "flex size-12 items-center justify-center rounded-md"
  return (
    <div className="flex items-start font-mono text-[11px] leading-3.5 text-[#2b0a1f]/70">
      <div className="flex flex-col items-center gap-2">
        <div className={cn(box, "border border-[#2b0a1f]")}>
          <div className="flex flex-col gap-1">
            <div className="h-0.5 w-6 bg-[#2b0a1f]" />
            <div className="h-0.5 w-4 bg-[#2b0a1f]" />
            <div className="h-0.5 w-5 bg-[#2b0a1f]" />
          </div>
        </div>
        paste
      </div>
      <div className="mt-6 h-px w-8 bg-[#2b0a1f] sm:w-10" />
      <div className="flex flex-col items-center gap-2">
        <div className={cn(box, "bg-[#2b0a1f]")}>
          <EyeIcon className="size-5 text-[#fbd3ea]" strokeWidth={2} />
        </div>
        1st view
      </div>
      <div className="mt-6 w-8 border-t border-dashed border-[#2b0a1f]/50 sm:w-10" />
      <div className="flex flex-col items-center gap-2">
        <div className={cn(box, "border border-dashed border-[#2b0a1f]/50")}>
          <XIcon className="size-4.5 text-[#2b0a1f]/50" strokeWidth={2} />
        </div>
        410 gone
      </div>
    </div>
  )
}

function PasswordVisual() {
  return (
    <div className="flex w-full max-w-64 flex-col gap-2.5">
      <div className="flex h-9 items-center gap-2 rounded-md border border-[#2b0a1f] px-2.5 text-sm tracking-[0.2em]">
        <LockIcon className="size-3.5 shrink-0" strokeWidth={2} />
        ••••••••
      </div>
      <div className="flex h-9 items-center justify-center rounded-md bg-[#2b0a1f] text-[13px] leading-4.5 font-medium text-[#fbd3ea] shadow-[0_2px_0_0_#160510]">
        Unlock paste
      </div>
    </div>
  )
}

function InviteVisual() {
  const people = [
    { who: "maya@acme.dev", access: "Can edit" },
    { who: "jonas", access: "Can view" },
  ]
  return (
    <ul className="flex w-full max-w-72 flex-col overflow-hidden rounded-md border border-[#2b0a1f]/25 text-[13px] leading-4.5">
      {people.map((person) => (
        <li
          key={person.who}
          className="flex h-10 items-center gap-2.5 border-b border-[#2b0a1f]/15 px-3 last:border-b-0"
        >
          <span className="flex size-5.5 shrink-0 items-center justify-center rounded-md bg-[#2b0a1f] text-[11px] font-medium text-[#fbd3ea] uppercase">
            {person.who[0]}
          </span>
          <span className="min-w-0 grow truncate">{person.who}</span>
          <span className="shrink-0 text-[#2b0a1f]/70">{person.access}</span>
        </li>
      ))}
    </ul>
  )
}

function RawVisual() {
  return (
    <pre className="w-full overflow-x-auto rounded-md bg-[#2b0a1f] px-3.5 py-3 font-mono text-[11px] leading-5 text-[#fbd3ea]">
      {"$ curl sniptide.com/9fLm3a/raw\nserver {\n  listen 443 ssl;\n  server_name app.acme.dev;"}
    </pre>
  )
}

function ViewsVisual() {
  const days = [28, 40, 34, 52, 88, 61, 46]
  const peak = Math.max(...days)
  return (
    <div className="flex w-full flex-col gap-2">
      <div className="flex h-20 items-end gap-1.5">
        {days.map((value, i) => (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: a fixed week of bars
            key={i}
            className={cn("flex-1 rounded-t-sm", value === peak ? "bg-[#2a26ec]" : "bg-[#2b0a1f]")}
            style={{ height: `${(value / peak) * 100}%` }}
          />
        ))}
      </div>
      <div className="flex justify-between font-mono text-[11px] leading-4 text-[#2b0a1f]/70">
        <span>Mon</span>
        <span className="tabular-nums">349 views · 212 unique</span>
        <span>Sun</span>
      </div>
    </div>
  )
}

const tiles = [
  {
    title: "Expiry",
    text: "Pick an hour, a day, a week, a month or never. When time is up, the link stops working.",
    visual: <ExpiryVisual />,
  },
  {
    title: "Burn after read",
    text: "The first person to open it is the last, and the link answers 410 after that.",
    visual: <BurnVisual />,
  },
  {
    title: "Password",
    text: "Visitors unlock the paste before they see a single line, and you never see the prompt.",
    visual: <PasswordVisual />,
  },
  {
    title: "Invite people",
    text: "Share a private paste with teammates by email or username, with view or edit access.",
    visual: <InviteVisual />,
  },
  {
    title: "Raw links",
    text: "Every file is one curl away as plain text, and you can switch that off per paste.",
    visual: <RawVisual />,
  },
  {
    title: "View counts",
    text: "See total and unique opens per day. Crawlers and link previews never count.",
    visual: <ViewsVisual />,
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

      <ul className="relative grid border-t border-l border-[#2b0a1f]/18 sm:grid-cols-2 lg:grid-cols-3">
        {tiles.map((tile) => (
          <li
            key={tile.title}
            className="flex min-w-0 flex-col gap-6 border-r border-b border-[#2b0a1f]/18 p-6 md:p-8"
          >
            {/* The illustration repeats what the text below says, so screen readers skip it. */}
            <div aria-hidden="true" className="flex h-28 items-center justify-center">
              {tile.visual}
            </div>
            <div className="flex flex-col gap-1.5">
              <h3 className="text-base leading-5.5 font-semibold">{tile.title}</h3>
              <p className="text-base leading-6 text-[#2b0a1f]/75">{tile.text}</p>
            </div>
          </li>
        ))}
      </ul>

      <div className="relative flex flex-col items-start gap-4 sm:flex-row sm:items-center">
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
    </section>
  )
}
