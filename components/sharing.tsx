"use client"

import { cn } from "@sniptide/ui/lib/utils"
import { CopyIcon, PauseIcon, PlayIcon, TriangleAlertIcon } from "lucide-react"
import { type KeyboardEvent, useId, useRef, useState } from "react"
import { PixelCanvas } from "@/components/pixel-canvas"
import { SectionHeading } from "@/components/section-heading"
import { docsPages, links } from "@/lib/links"

// The pink section looks the same in both themes. Text on the pink uses the ink #2b0a1f at full
// strength or at 80% (about 8:1), and the showcases sit on white cards with the app's own ink,
// greys and Tide Blue. Only the large second line of the heading uses #a04577.

type Feature = { title: string; text: string }

const ink = "text-[#2b0a1f]"

// ---------- Showcases. Each repeats what its tab's list says, so screen readers skip it. ----------

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border border-[#2b0a1f]/15 bg-white text-[#1b1919] shadow-[0_24px_48px_-12px_rgb(43_10_31/0.25)]",
        className,
      )}
    >
      {children}
    </div>
  )
}

function Switch({ on }: { on: boolean }) {
  return (
    <span
      className={cn(
        "flex h-4.5 w-7.5 items-center rounded-sm p-0.5",
        on ? "justify-end bg-[#2a26ec]" : "bg-[#e8e8e8]",
      )}
    >
      <span className="size-3.5 rounded-[2px] bg-white" />
    </span>
  )
}

function ShareShowcase() {
  const stops = ["1h", "1d", "1w", "1m", "Never"]
  return (
    <Card className="mx-auto w-full max-w-120 text-sm leading-5">
      <div className="flex flex-col gap-3 border-b border-[#e8e8e8] p-5">
        <span className="font-medium">Sharing</span>
        <div className="flex h-10 items-center rounded-lg border border-[#e8e8e8] pr-1 pl-3 font-mono text-[13px]">
          <span className="grow truncate">https://sniptide.com/xhz57h</span>
          <span className="flex h-8 items-center gap-1.5 rounded-md bg-[#1b1919] px-3 font-sans text-white">
            <CopyIcon className="size-3.5" strokeWidth={2} />
            Copy
          </span>
        </div>
        <div className="grid grid-cols-3 rounded-lg bg-[#f4f4f4] p-0.75 text-center">
          <span className="py-1.5 text-[#6b6b6b]">Private</span>
          <span className="py-1.5 text-[#6b6b6b]">Unlisted</span>
          <span className="rounded-md bg-white py-1.5 font-medium shadow-[0_1px_2px_rgb(0_0_0/0.08)]">
            Public
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-4 p-5">
        <div className="flex flex-col gap-2">
          <span className="font-medium text-[#2a26ec]">1 week</span>
          <div className="relative flex h-6 items-center justify-between rounded-md bg-[#f4f4f4] px-3">
            <div className="absolute inset-y-0 left-0 w-1/2 rounded-l-md bg-[#2a26ec]" />
            <div className="absolute top-0 left-[calc(50%-16px)] h-6 w-8 rounded-md border border-[#e8e8e8] bg-white" />
            {stops.map((stop, i) => (
              <span
                key={stop}
                className={cn("relative size-1 rounded-full", i < 2 ? "bg-white" : "bg-[#c8c8c8]")}
              />
            ))}
          </div>
        </div>
        {[
          ["Password", true],
          ["Burn after reading", false],
          ["Allow raw access", true],
        ].map(([label, on]) => (
          <span key={label as string} className="flex items-center justify-between">
            {label}
            <Switch on={on as boolean} />
          </span>
        ))}
        <div className="flex flex-col border-t border-[#e8e8e8] pt-3">
          {[
            ["MC", "maya@acme.dev", "Can edit"],
            ["JB", "jonas", "Can view"],
          ].map(([initials, who, access]) => (
            <span key={who} className="flex h-9 items-center gap-2.5">
              <span className="flex size-6 items-center justify-center rounded-md bg-[#1b1919] text-[10px] font-medium text-white">
                {initials}
              </span>
              <span className="grow">{who}</span>
              <span className="text-[#6b6b6b]">{access}</span>
            </span>
          ))}
        </div>
      </div>
    </Card>
  )
}

function TrackShowcase() {
  const days = [28, 40, 34, 52, 88, 61, 46]
  const peak = Math.max(...days)
  const revisions = [
    ["Revision 3", "2 min ago", true],
    ["Revision 2", "Yesterday", false],
    ["Revision 1", "Oct 28", false],
  ] as const
  return (
    <div className="mx-auto flex w-full max-w-120 flex-col gap-4 text-sm leading-5">
      <Card className="flex flex-col gap-4 p-5">
        <span className="flex items-baseline justify-between">
          <span className="font-medium">Views</span>
          <span className="text-[#6b6b6b] tabular-nums">349 views · 212 unique</span>
        </span>
        <div className="flex h-28 items-end gap-2">
          {days.map((value, i) => (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: a fixed week of bars
              key={i}
              className={cn(
                "flex-1 rounded-t-sm",
                value === peak ? "bg-[#e353ac]" : "bg-[#2a26ec]",
              )}
              style={{ height: `${(value / peak) * 100}%` }}
            />
          ))}
        </div>
        <span className="flex justify-between font-mono text-xs text-[#6b6b6b]">
          <span>Mon</span>
          <span>Sun</span>
        </span>
      </Card>
      <Card>
        {revisions.map(([name, when, current]) => (
          <span
            key={name}
            className="flex h-11 items-center justify-between border-b border-[#e8e8e8] px-5 last:border-b-0"
          >
            <span className={cn(current && "font-medium")}>{name}</span>
            <span className="text-[#6b6b6b]">{current ? "Current" : when}</span>
          </span>
        ))}
      </Card>
      <Card className="flex items-start gap-3 p-4">
        <TriangleAlertIcon className="mt-0.5 size-4 shrink-0 text-[#b45309]" strokeWidth={2} />
        <span>Line 4 looks like a Stripe secret key. Remove it before you share this paste.</span>
      </Card>
    </div>
  )
}

function ConnectShowcase() {
  return (
    <div className="mx-auto flex w-full max-w-120 flex-col gap-4 text-sm leading-5">
      <Card className="border-[#2c2a2a] bg-[#1b1919] text-[#d4d4d4]">
        <div className="overflow-x-auto p-5 font-mono text-xs leading-5 whitespace-pre">
          <span className="text-[#8f8cff]">import</span>
          {" { SniptideClient } "}
          <span className="text-[#8f8cff]">from</span>
          <span className="text-[#5fd3a8]"> "@sniptide/sdk"</span>
          {"\n\n"}
          <span className="text-[#8f8cff]">const</span>
          {" client = "}
          <span className="text-[#8f8cff]">new</span>
          <span className="text-[#c4b5fd]"> SniptideClient</span>
          {"(token)\n"}
          <span className="text-[#8f8cff]">await</span>
          {" client."}
          <span className="text-[#c4b5fd]">createPaste</span>
          {"({ title: "}
          <span className="text-[#5fd3a8]">"nginx.conf"</span>
          {", files })"}
        </div>
      </Card>
      <Card className="flex gap-3 p-4">
        <span className="w-1 shrink-0 rounded-full bg-[#2a26ec]" />
        <span className="flex min-w-0 flex-col gap-1">
          <span className="font-medium">Sniptide</span>
          <span className="font-semibold text-[#2a26ec]">nginx reverse proxy with TLS</span>
          <span className="truncate font-mono text-xs text-[#6b6b6b]">
            server {"{"} listen 443 ssl http2; server_name app.acme.dev;
          </span>
        </span>
      </Card>
      <Card className="flex items-center justify-between gap-4 p-4">
        <span className="truncate font-mono text-xs">gist.github.com/maya/9f2c41</span>
        <span className="shrink-0 text-[#6b6b6b]">3 files imported</span>
      </Card>
    </div>
  )
}

// ---------- Tabs ----------

const tabs: { label: string; title: string; features: Feature[]; showcase: React.ReactNode }[] = [
  {
    label: "Share",
    title: "Every link carries its own rules.",
    features: [
      { title: "Expiry", text: "Pick an hour, a day, a week, a month or never." },
      { title: "Burn after read", text: "The first person to open the link is the last." },
      { title: "Password", text: "Visitors enter it before they see a single line." },
      { title: "Invites", text: "Share a private paste by email or username, to view or edit." },
      { title: "Raw links", text: "Every file is one curl away as plain text." },
    ],
    showcase: <ShareShowcase />,
  },
  {
    label: "Track",
    title: "See what happened to every paste.",
    features: [
      { title: "View counts", text: "Total and unique opens per day, without crawlers." },
      {
        title: "Analytics without cookies",
        text: "Visitors, copies and referrers, kept in your database.",
      },
      { title: "Revisions", text: "Compare any two saves side by side and roll back." },
      { title: "Key warnings", text: "The editor flags anything that looks like a key." },
    ],
    showcase: <TrackShowcase />,
  },
  {
    label: "Connect",
    title: "Code moves in and out the way you work.",
    features: [
      { title: "API and SDKs", text: "A REST API in OpenAPI, with TypeScript and Python SDKs." },
      { title: "Link previews", text: "Slack, Discord and X unfurl a card with the first lines." },
      { title: "Gist import", text: "Bring a GitHub gist over with all of its files." },
      { title: "Embed and print", text: "Put a paste in your docs, or print it highlighted." },
    ],
    showcase: <ConnectShowcase />,
  },
]

export function Sharing() {
  const id = useId()
  const [active, setActive] = useState(0)
  // Autoplay runs until someone picks a tab or presses pause, and it waits while the pointer or
  // focus is inside. It moves content for longer than five seconds, so it has a pause button
  // (WCAG 2.2.2), and under reduced motion the countdown never runs, so it never advances.
  const [stopped, setStopped] = useState(false)
  const [held, setHeld] = useState(false)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  const select = (index: number, focus = false) => {
    setActive(index)
    setStopped(true)
    if (focus) tabRefs.current[index]?.focus()
  }

  const onKeyDown = (event: KeyboardEvent) => {
    const last = tabs.length - 1
    const next =
      event.key === "ArrowRight"
        ? active === last
          ? 0
          : active + 1
        : event.key === "ArrowLeft"
          ? active === 0
            ? last
            : active - 1
          : event.key === "Home"
            ? 0
            : event.key === "End"
              ? last
              : null
    if (next === null) return
    event.preventDefault()
    select(next, true)
  }

  return (
    <section
      id="sharing"
      data-cta-location="sharing"
      className={cn(
        "relative flex scroll-mt-4 flex-col gap-10 overflow-clip bg-[#fbd3ea] section-frame py-16 [--button-focus:#2b0a1f] md:gap-12 md:py-20 xl:py-30",
        ink,
      )}
    >
      <PixelCanvas kind="grain" className="absolute inset-0 size-full opacity-20" />

      <SectionHeading
        className="relative"
        claim="When a person needs it, send a link."
        reason="Everything around the link is already built in."
        reasonClassName="text-[#a04577]"
      />

      {/* biome-ignore lint/a11y/noStaticElementInteractions: these handlers only hold the autoplay while the pointer or focus is inside; the tabs and the pause button are the controls. */}
      <div
        className="relative flex flex-col gap-8 md:gap-10"
        onPointerEnter={() => setHeld(true)}
        onPointerLeave={() => setHeld(false)}
        onFocus={() => setHeld(true)}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) setHeld(false)
        }}
      >
        <div className="flex items-stretch gap-2 border-b border-[#2b0a1f]/20">
          <div
            role="tablist"
            aria-label="Features around a paste"
            className="flex min-w-0 grow overflow-x-auto"
          >
            {tabs.map((tab, i) => {
              const selected = i === active
              return (
                <button
                  key={tab.label}
                  ref={(node) => {
                    tabRefs.current[i] = node
                  }}
                  type="button"
                  role="tab"
                  id={`${id}-tab-${i}`}
                  aria-selected={selected}
                  aria-controls={`${id}-panel-${i}`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => select(i)}
                  onKeyDown={onKeyDown}
                  className={cn(
                    "relative h-12 shrink-0 px-4 text-base leading-6 font-medium whitespace-nowrap focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#2b0a1f] md:px-6",
                    selected ? "text-[#2b0a1f]" : "text-[#2b0a1f]/80 hover:text-[#2b0a1f]",
                  )}
                >
                  {tab.label}
                  {/* The underline doubles as the countdown to the next tab. */}
                  <span aria-hidden="true" className="absolute inset-x-0 -bottom-px h-0.5">
                    {selected && (
                      <span
                        key={`${active}-${stopped}`}
                        onAnimationEnd={() => setActive((active + 1) % tabs.length)}
                        className={cn(
                          "block h-full origin-left bg-[#2b0a1f]",
                          !stopped &&
                            "motion-safe:animate-[tab-progress_5s_linear] motion-reduce:scale-x-100",
                          (held || stopped) && "[animation-play-state:paused]",
                        )}
                      />
                    )}
                  </span>
                </button>
              )
            })}
          </div>
          <button
            type="button"
            onClick={() => setStopped(!stopped)}
            aria-label={stopped ? "Play the feature tour" : "Pause the feature tour"}
            className="flex size-10 shrink-0 items-center justify-center self-center rounded-md hover:bg-[#2b0a1f]/8 focus-visible:outline-2 focus-visible:outline-[#2b0a1f] motion-reduce:hidden"
          >
            {stopped ? (
              <PlayIcon className="size-4" strokeWidth={2} />
            ) : (
              <PauseIcon className="size-4" strokeWidth={2} />
            )}
          </button>
        </div>

        {/* Every panel sits in the same grid cell, so the section keeps the height of the tallest
            one and nothing below it jumps when the tab changes. */}
        <div className="grid">
          {tabs.map((tab, i) => (
            <div
              key={tab.label}
              role="tabpanel"
              id={`${id}-panel-${i}`}
              aria-labelledby={`${id}-tab-${i}`}
              className={cn(
                "grid items-start gap-10 [grid-area:1/1] motion-safe:transition-opacity motion-safe:duration-300 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-16",
                i === active ? "opacity-100" : "invisible opacity-0",
              )}
            >
              <div className="flex flex-col gap-6">
                <h3 className="font-heading text-[28px] leading-8.5 font-medium tracking-[-0.025em] md:text-4xl md:leading-11">
                  {tab.title}
                </h3>
                <ul className="flex flex-col border-b border-[#2b0a1f]/20">
                  {tab.features.map((feature) => (
                    <li
                      key={feature.title}
                      className="flex flex-col gap-0.5 border-t border-[#2b0a1f]/20 py-3.5"
                    >
                      <span className="text-base leading-6 font-semibold">{feature.title}</span>
                      <span className="text-base leading-6 text-[#2b0a1f]/80">{feature.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div aria-hidden="true" className="min-w-0">
                {tab.showcase}
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <a
            href={links.newPaste}
            className="raised-button flex h-11 shrink-0 items-center gap-2 bg-[#2b0a1f] [--button-depth:#160510] px-4 text-sm leading-5 font-medium text-[#fbd3ea] hover:bg-[#3d1230]"
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
    </section>
  )
}
