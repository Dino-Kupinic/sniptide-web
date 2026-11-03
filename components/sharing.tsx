"use client"

import { cn } from "@sniptide/ui/lib/utils"
import {
  ActivityIcon,
  BracesIcon,
  ChartColumnIcon,
  CodeXmlIcon,
  CookieIcon,
  EyeIcon,
  FlameIcon,
  GlobeIcon,
  HistoryIcon,
  ImportIcon,
  LinkIcon,
  LockIcon,
  LockKeyholeIcon,
  type LucideIcon,
  MessageSquareIcon,
  PauseIcon,
  PlayIcon,
  PlugIcon,
  Share2Icon,
  ShieldAlertIcon,
  ShieldIcon,
  TerminalIcon,
  TimerIcon,
  Trash2Icon,
  UserPlusIcon,
  XIcon,
} from "lucide-react"
import { type KeyboardEvent, useId, useRef, useState } from "react"
import { LifeField } from "@/components/life-field"
import { SectionHeading } from "@/components/section-heading"
import { docsPages, links } from "@/lib/links"

// The pink section keeps its pink in both themes, and a window on top of it carries the content
// in the page's own colors, so every line of text sits on white or on the dark canvas. The pink
// behind it runs a sparse Game of Life that the pointer can sow.

const muted = "text-[#6b6b6b] dark:text-[#a3a3a3]"
const line = "border-[#e8e8e8] dark:border-[#262626]"
const blueText = "text-[#2a26ec] dark:text-[#8f8cff]"
const node = cn(
  "flex items-center gap-2 rounded-lg border bg-white px-3 py-2 text-sm leading-5 dark:bg-[#121111]",
  line,
)

// ---------- Infographics. Each repeats what its tab's cards say, so screen readers skip it. ----------

function Stub({ className }: { className?: string }) {
  return <span className={cn("block bg-[#c8c8c8] dark:bg-[#3a3a3a]", className)} />
}

function ShareGraphic() {
  const levels = [
    { icon: LockIcon, name: "Private", text: "Only you" },
    { icon: LinkIcon, name: "Unlisted", text: "Anyone with the link" },
    { icon: GlobeIcon, name: "Public", text: "On your profile", active: true },
  ]
  return (
    <div className="flex flex-col items-center">
      <div className={cn(node, "font-mono")}>
        <span className="size-2 bg-[#2a26ec]" />
        sniptide.com/xhz57h
      </div>
      <Stub className="h-6 w-px" />
      <Stub className="h-px w-2/3" />
      <div className="grid w-full grid-cols-3 gap-2">
        {levels.map((level) => (
          <div key={level.name} className="flex flex-col items-center">
            <Stub className="h-6 w-px" />
            <div
              className={cn(
                "flex w-full flex-col items-center gap-1 rounded-lg border px-2 py-3 text-center",
                level.active
                  ? "border-[#2a26ec] bg-[#2a26ec] text-white"
                  : cn(line, "bg-white dark:bg-[#121111]"),
              )}
            >
              <level.icon className="size-4" strokeWidth={2} />
              <span className="text-sm leading-5 font-medium">{level.name}</span>
              <span className={cn("text-xs leading-4", level.active ? "text-white/85" : muted)}>
                {level.text}
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 flex w-full flex-wrap items-center justify-center gap-2">
        {[
          ["maya", "can edit"],
          ["jonas", "can view"],
        ].map(([who, access]) => (
          <span key={who} className={node}>
            <span className="flex size-5 items-center justify-center rounded-md bg-[#1b1919] text-[10px] font-medium text-white uppercase dark:bg-[#f5f5f5] dark:text-[#1b1919]">
              {who?.[0]}
            </span>
            {who}
            <span className={muted}>{access}</span>
          </span>
        ))}
      </div>
    </div>
  )
}

function ProtectGraphic() {
  const steps = [
    { icon: LinkIcon, label: "Link sent" },
    { icon: LockKeyholeIcon, label: "Password" },
    { icon: EyeIcon, label: "First view" },
    { icon: XIcon, label: "410 Gone", gone: true },
  ]
  const stops = ["1h", "1d", "1w", "1m", "never"]
  return (
    <div className="flex flex-col gap-10">
      <div className="flex items-start">
        {steps.map((step, i) => (
          <div key={step.label} className="flex flex-1 items-start">
            <div className="flex w-full flex-col items-center gap-2">
              <span className="flex w-full items-center">
                <Stub className={cn("h-px flex-1", i === 0 && "invisible")} />
                <span
                  className={cn(
                    "flex size-11 shrink-0 items-center justify-center rounded-lg border",
                    step.gone
                      ? "border-dashed border-[#c8c8c8] text-[#6b6b6b] dark:border-[#3a3a3a] dark:text-[#a3a3a3]"
                      : i === 2
                        ? "border-[#2a26ec] bg-[#2a26ec] text-white"
                        : cn(line, "bg-white dark:bg-[#121111]"),
                  )}
                >
                  <step.icon className="size-4.5" strokeWidth={2} />
                </span>
                <Stub className={cn("h-px flex-1", i === steps.length - 1 && "invisible")} />
              </span>
              <span className="text-center text-sm leading-5">{step.label}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-3">
        <span className="flex items-baseline justify-between text-sm leading-5">
          <span className="font-medium">Expires after</span>
          <span className={cn("font-medium", blueText)}>1 week</span>
        </span>
        <div className="relative flex h-6 items-center justify-between rounded-md bg-[#ececec] px-3 dark:bg-[#242222]">
          <div className="absolute inset-y-0 left-0 w-1/2 rounded-l-md bg-[#2a26ec]" />
          <div className="absolute top-0 left-[calc(50%-16px)] h-6 w-8 rounded-md border border-[#e8e8e8] bg-white dark:border-[#3a3a3a] dark:bg-[#121111]" />
          {stops.map((stop, i) => (
            <span
              key={stop}
              className={cn(
                "relative size-1 rounded-full",
                i < 2 ? "bg-white" : "bg-[#b0b0b0] dark:bg-[#4a4747]",
              )}
            />
          ))}
        </div>
        <span className={cn("flex justify-between font-mono text-xs", muted)}>
          {stops.map((stop) => (
            <span key={stop}>{stop}</span>
          ))}
        </span>
      </div>
    </div>
  )
}

function TrackGraphic() {
  const days = [
    ["Mon", 28],
    ["Tue", 40],
    ["Wed", 34],
    ["Thu", 52],
    ["Fri", 88],
    ["Sat", 61],
    ["Sun", 46],
  ] as const
  const peak = 88
  const revisions = ["Oct 28", "Yesterday", "Now"]
  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-3">
        <span className="flex items-baseline justify-between text-sm leading-5">
          <span className="font-medium">Views this week</span>
          <span className={cn("tabular-nums", muted)}>349 views · 212 unique</span>
        </span>
        <div className="flex h-36 items-end gap-2">
          {days.map(([day, value]) => (
            <div key={day} className="flex h-full flex-1 flex-col justify-end gap-1.5">
              {value === peak && (
                <span className="text-center font-mono text-xs text-[#e353ac] tabular-nums dark:text-[#f6a9d3]">
                  {value}
                </span>
              )}
              <div
                className={cn(
                  "rounded-t-sm",
                  value === peak ? "bg-[#e353ac] dark:bg-[#f6a9d3]" : "bg-[#2a26ec]",
                )}
                style={{ height: `${(value / peak) * 80}%` }}
              />
            </div>
          ))}
        </div>
        <span className={cn("flex gap-2 font-mono text-xs", muted)}>
          {days.map(([day]) => (
            <span key={day} className="flex-1 text-center">
              {day}
            </span>
          ))}
        </span>
      </div>
      <div className="flex items-start">
        {revisions.map((when, i) => (
          <div key={when} className="flex flex-1 flex-col items-center gap-2">
            <span className="flex w-full items-center">
              <Stub className={cn("h-px flex-1", i === 0 && "invisible")} />
              <span
                className={cn(
                  "size-3 shrink-0 rounded-full",
                  i === revisions.length - 1
                    ? "bg-[#2a26ec] ring-4 ring-[#2a26ec]/20"
                    : "bg-[#b0b0b0] dark:bg-[#4a4747]",
                )}
              />
              <Stub className={cn("h-px flex-1", i === revisions.length - 1 && "invisible")} />
            </span>
            <span className="text-sm leading-5 font-medium">Revision {i + 1}</span>
            <span className={cn("text-xs leading-4", muted)}>{when}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function ConnectGraphic() {
  const inputs = ["GitHub gist", "REST API"]
  const outputs = ["curl /raw", "<iframe>", "TypeScript", "Python"]
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-x-0">
      <div className="flex flex-col gap-3">
        {inputs.map((input) => (
          <span key={input} className="flex items-center">
            <span className={cn(node, "min-w-0 grow font-mono text-xs whitespace-nowrap")}>
              {input}
            </span>
            <Stub className="h-px w-4 shrink-0 sm:w-8" />
          </span>
        ))}
      </div>
      <div className="flex flex-col items-center gap-2 px-1">
        <span className="flex size-20 items-center justify-center rounded-lg bg-[#2a26ec] text-sm font-semibold text-white sm:size-24">
          Sniptide
        </span>
      </div>
      <div className="flex flex-col gap-3">
        {outputs.map((output) => (
          <span key={output} className="flex items-center">
            <Stub className="h-px w-4 shrink-0 sm:w-8" />
            <span className={cn(node, "min-w-0 grow font-mono text-xs whitespace-nowrap")}>
              {output}
            </span>
          </span>
        ))}
      </div>
    </div>
  )
}

// ---------- Tabs ----------

type Feature = { icon: LucideIcon; title: string; text: string }

const tabs: {
  label: string
  icon: LucideIcon
  title: string
  summary: string
  features: Feature[]
  graphic: React.ReactNode
}[] = [
  {
    label: "Share",
    icon: Share2Icon,
    title: "Share with exactly who needs it.",
    summary: "Pick who can see a paste, then send the link anywhere.",
    features: [
      {
        icon: GlobeIcon,
        title: "Visibility",
        text: "Private, unlisted or public, and you can switch at any time.",
      },
      {
        icon: UserPlusIcon,
        title: "Invites",
        text: "Add teammates by email or username, to view or edit.",
      },
      {
        icon: MessageSquareIcon,
        title: "Link previews",
        text: "Slack, Discord and X unfurl a card with the first lines.",
      },
      {
        icon: LinkIcon,
        title: "Short links",
        text: "Every paste gets a short link that is easy to paste in chat.",
      },
    ],
    graphic: <ShareGraphic />,
  },
  {
    label: "Protect",
    icon: ShieldIcon,
    title: "Decide how long a link lives.",
    summary: "Every link carries its own rules, set in the panel next to the paste.",
    features: [
      { icon: TimerIcon, title: "Expiry", text: "An hour, a day, a week, a month or never." },
      {
        icon: FlameIcon,
        title: "Burn after read",
        text: "The first person to open the link is the last.",
      },
      {
        icon: LockKeyholeIcon,
        title: "Password",
        text: "Visitors unlock the paste before they see a line.",
      },
      {
        icon: ShieldAlertIcon,
        title: "Key warnings",
        text: "The editor flags anything that looks like a key.",
      },
    ],
    graphic: <ProtectGraphic />,
  },
  {
    label: "Track",
    icon: ActivityIcon,
    title: "See what happened to every paste.",
    summary: "Numbers and history sit next to the code they belong to.",
    features: [
      {
        icon: ChartColumnIcon,
        title: "View counts",
        text: "Total and unique opens per day, without crawlers.",
      },
      {
        icon: CookieIcon,
        title: "No cookies",
        text: "Visitors, copies and referrers, counted in your own database.",
      },
      {
        icon: HistoryIcon,
        title: "Revisions",
        text: "Compare any two saves side by side and roll back.",
      },
      {
        icon: Trash2Icon,
        title: "Trash",
        text: "Deleted pastes wait in the trash until you restore them.",
      },
    ],
    graphic: <TrackGraphic />,
  },
  {
    label: "Connect",
    icon: PlugIcon,
    title: "Move code in and out the way you work.",
    summary: "The same pastes reach your scripts, your docs and your chat.",
    features: [
      {
        icon: BracesIcon,
        title: "API and SDKs",
        text: "A REST API in OpenAPI, with TypeScript and Python SDKs.",
      },
      {
        icon: ImportIcon,
        title: "Gist import",
        text: "Bring a GitHub gist over with all of its files.",
      },
      {
        icon: TerminalIcon,
        title: "Raw links",
        text: "Every file is one curl away as plain text.",
      },
      {
        icon: CodeXmlIcon,
        title: "Embed and print",
        text: "Put a paste in your docs, or print it highlighted.",
      },
    ],
    graphic: <ConnectGraphic />,
  },
]

export function Sharing() {
  const id = useId()
  const [active, setActive] = useState(0)
  // The tour moves on every five seconds until someone picks a tab, and it waits while the
  // pointer or focus is inside the window. Under reduced motion the countdown never runs, so it
  // never advances on its own.
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
    const keys: Record<string, number> = {
      ArrowRight: active === last ? 0 : active + 1,
      ArrowLeft: active === 0 ? last : active - 1,
      Home: 0,
      End: last,
    }
    const next = keys[event.key]
    if (next === undefined) return
    event.preventDefault()
    select(next, true)
  }

  return (
    <section
      id="sharing"
      data-cta-location="sharing"
      className="relative flex scroll-mt-4 flex-col gap-10 overflow-clip bg-[#fbd3ea] section-frame py-16 text-[#2b0a1f] md:gap-12 md:py-20 xl:py-30"
    >
      <LifeField live="#e353ac" trail="#f6a9d3" density={0.035} className="opacity-60" />

      <SectionHeading
        className="relative"
        claim="When a person needs it, send a link."
        reason="Everything around the link is already built in."
        reasonClassName="text-[#a04577]"
      />

      {/* biome-ignore lint/a11y/noStaticElementInteractions: these handlers only hold the tour while the pointer or focus is inside; the tabs are the controls. */}
      <div
        className="relative overflow-hidden rounded-lg border border-[#2b0a1f]/15 bg-white text-[#1b1919] shadow-[0_2px_4px_rgb(43_10_31/0.06),0_24px_48px_-12px_rgb(43_10_31/0.22)] dark:border-[#2b0a1f]/40 dark:bg-[#121111] dark:text-[#f5f5f5]"
        onPointerEnter={() => setHeld(true)}
        onPointerLeave={() => setHeld(false)}
        onFocus={() => setHeld(true)}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) setHeld(false)
        }}
      >
        <div
          className={cn(
            "flex items-start gap-1 border-b bg-[#fafafa] p-1.5 dark:bg-[#0c0b0b]",
            line,
          )}
        >
          <div
            role="tablist"
            aria-label="Features around a paste"
            className="grid min-w-0 grow grid-cols-2 gap-1 sm:grid-cols-4"
          >
            {tabs.map((tab, i) => {
              const selected = i === active
              return (
                <button
                  key={tab.label}
                  ref={(element) => {
                    tabRefs.current[i] = element
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
                    "relative flex h-11 items-center justify-center gap-2 overflow-hidden rounded-md text-base leading-6 font-medium focus-visible:ring-2 focus-visible:ring-[#2a26ec]/40 focus-visible:outline-none",
                    selected
                      ? "bg-white shadow-[0_1px_2px_rgb(0_0_0/0.08)] dark:bg-[#1a1919]"
                      : cn(muted, "hover:bg-[#f4f4f4] dark:hover:bg-[#1a1919]"),
                  )}
                >
                  {/* The countdown to the next tab: a faint wash that fills the selected tab. */}
                  {selected && !stopped && (
                    <span
                      key={active}
                      aria-hidden="true"
                      onAnimationEnd={() => setActive((active + 1) % tabs.length)}
                      className={cn(
                        "absolute inset-0 origin-left bg-[#2a26ec]/8 motion-safe:animate-[tab-progress_5s_linear] motion-reduce:hidden dark:bg-[#8f8cff]/10",
                        held && "[animation-play-state:paused]",
                      )}
                    />
                  )}
                  <tab.icon
                    aria-hidden="true"
                    className={cn("relative size-4", selected && blueText)}
                    strokeWidth={2}
                  />
                  <span className="relative">{tab.label}</span>
                </button>
              )
            })}
          </div>
          <button
            type="button"
            onClick={() => setStopped(!stopped)}
            aria-label={stopped ? "Play the tour" : "Pause the tour"}
            className={cn(
              "flex size-11 shrink-0 items-center justify-center rounded-md hover:bg-[#f4f4f4] focus-visible:ring-2 focus-visible:ring-[#2a26ec]/40 focus-visible:outline-none motion-reduce:hidden dark:hover:bg-[#1a1919]",
              muted,
            )}
          >
            {stopped ? (
              <PlayIcon aria-hidden="true" className="size-4" strokeWidth={2} />
            ) : (
              <PauseIcon aria-hidden="true" className="size-4" strokeWidth={2} />
            )}
          </button>
        </div>

        {/* Every panel sits in the same grid cell, so the window keeps the height of the tallest
            one and the page below never jumps when the tab changes. */}
        <div className="grid">
          {tabs.map((tab, i) => (
            <div
              key={tab.label}
              role="tabpanel"
              id={`${id}-panel-${i}`}
              aria-labelledby={`${id}-tab-${i}`}
              className={cn(
                "grid items-center gap-10 p-5 [grid-area:1/1] motion-safe:transition-opacity motion-safe:duration-300 md:p-10 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:gap-14",
                i === active ? "opacity-100" : "invisible opacity-0",
              )}
            >
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <h3 className="font-heading text-[26px] leading-8 font-medium tracking-[-0.025em] md:text-3xl md:leading-9">
                    {tab.title}
                  </h3>
                  <p className={cn("text-base leading-6.5", muted)}>{tab.summary}</p>
                </div>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {tab.features.map((feature) => (
                    <li
                      key={feature.title}
                      className={cn(
                        "flex flex-col gap-1.5 rounded-lg border bg-[#fafafa] p-4 dark:bg-[#0c0b0b]",
                        line,
                      )}
                    >
                      <span className="flex items-center gap-2">
                        <feature.icon
                          aria-hidden="true"
                          className={cn("size-4 shrink-0", blueText)}
                          strokeWidth={2}
                        />
                        <span className="text-base leading-6 font-semibold">{feature.title}</span>
                      </span>
                      <span className={cn("text-[15px] leading-5.5", muted)}>{feature.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div
                aria-hidden="true"
                className={cn(
                  "flex min-h-80 min-w-0 flex-col justify-center rounded-lg border bg-[#fafafa] p-5 sm:p-8 dark:bg-[#0c0b0b]",
                  line,
                )}
              >
                {tab.graphic}
              </div>
            </div>
          ))}
        </div>
      </div>

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
          className="rounded-md bg-[#fbd3ea]/80 px-1 text-base leading-6 font-medium hover:bg-white/60"
        >
          Read how sharing works
        </a>
      </div>
    </section>
  )
}
