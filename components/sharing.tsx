"use client"

import { cn } from "@sniptide/ui/lib/utils"
import {
  ActivityIcon,
  BracesIcon,
  ChartColumnIcon,
  CheckIcon,
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
} from "lucide-react"
import { type KeyboardEvent, useId, useRef, useState } from "react"
import { LogoMark } from "@/components/brand"
import { LifeField } from "@/components/life-field"
import { SectionHeading } from "@/components/section-heading"
import { docsPages, links } from "@/lib/links"

// The pink section keeps its pink in both themes, and a window on top of it carries the content
// in the page's own colors, so every line of text sits on white or on the dark canvas. The pink
// behind it runs a sparse Game of Life that the pointer can sow.

// Muted text leans pink so it keeps AA contrast on the glass window over the pink.
const muted = "text-[#5c4653] dark:text-[#cbbfc5]"
const line = "border-[#2b0a1f]/10 dark:border-white/10"
const blueText = "text-[#2a26ec] dark:text-[#8f8cff]"

// ---------- Infographics. Each repeats what its tab's cards say, so screen readers skip it. ----------

const wireGray = "text-[#b8b8b8] dark:text-[#4a4747]"
const wireBlue = "text-[#2a26ec] dark:text-[#8f8cff]"

// Curved connectors drawn in a stretchable box: each path runs from a point on one edge to a point
// on the other, in percent. The blue ones carry a slow dash that flows from start to end.
function Wires({
  paths,
  className,
}: {
  paths: { d: string; live?: boolean }[]
  className?: string
}) {
  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={cn("block overflow-visible", className)}
    >
      {paths.map(({ d, live }) => (
        <g key={d} fill="none" strokeWidth={live ? 1.5 : 1} vectorEffect="non-scaling-stroke">
          <path
            d={d}
            stroke="currentColor"
            className={wireGray}
            vectorEffect="non-scaling-stroke"
          />
          {live && (
            <path
              d={d}
              stroke="currentColor"
              strokeDasharray="4 6"
              vectorEffect="non-scaling-stroke"
              className={cn(wireBlue, "motion-safe:animate-[wire-flow_1s_linear_infinite]")}
            />
          )}
        </g>
      ))}
    </svg>
  )
}

function CodeLines({ widths }: { widths: string[] }) {
  return (
    <span className="flex flex-col gap-1.5">
      {widths.map((width, i) => (
        <span
          // biome-ignore lint/suspicious/noArrayIndexKey: the lines are static decoration.
          key={i}
          className={cn(
            "block h-1.5 rounded-sm",
            i % 3 === 0 ? "bg-[#2a26ec]/35 dark:bg-[#8f8cff]/40" : "bg-[#e0e0e0] dark:bg-[#2f2c2c]",
          )}
          style={{ width }}
        />
      ))}
    </span>
  )
}

function ShareGraphic() {
  const levels = [
    { icon: LockIcon, name: "Private", text: "Only you" },
    { icon: LinkIcon, name: "Unlisted", text: "With the link" },
    { icon: GlobeIcon, name: "Public", text: "On your profile", active: true },
  ]
  return (
    <div className="flex flex-col">
      <div
        className={cn(
          "mx-auto flex w-full max-w-72 flex-col gap-3 rounded-lg border bg-white p-3.5 dark:bg-[#121111]",
          line,
        )}
      >
        <span className="flex items-center justify-between gap-2">
          <span className="text-sm leading-5 font-medium">confirm-dialog.tsx</span>
          <span className={cn("font-mono text-[11px]", muted)}>xhz57h</span>
        </span>
        <CodeLines widths={["70%", "88%", "54%", "76%"]} />
      </div>
      <Wires
        className="h-12 w-full"
        paths={[
          { d: "M50,0 C50,55 16.7,45 16.7,100" },
          { d: "M50,0 L50,100" },
          { d: "M50,0 C50,55 83.3,45 83.3,100", live: true },
        ]}
      />
      <div className="grid grid-cols-3 gap-2">
        {levels.map((level) => (
          <div
            key={level.name}
            className={cn(
              "relative flex flex-col items-center gap-1 rounded-lg border px-2 py-3 text-center",
              level.active
                ? "border-[#2a26ec] bg-[#2a26ec] text-white"
                : cn(line, "bg-white dark:bg-[#121111]"),
            )}
          >
            {level.active && (
              <CheckIcon className="absolute top-2 right-2 size-3.5" strokeWidth={2.5} />
            )}
            <level.icon className="size-4" strokeWidth={2} />
            <span className="text-sm leading-5 font-medium">{level.name}</span>
            <span className={cn("text-xs leading-4", level.active ? "text-white/85" : muted)}>
              {level.text}
            </span>
          </div>
        ))}
      </div>
      <div
        className={cn(
          "mt-5 flex items-center gap-3 rounded-lg border bg-white px-3.5 py-3 dark:bg-[#121111]",
          line,
        )}
      >
        <span className="flex -space-x-1.5">
          {["M", "J", "A"].map((letter, i) => (
            <span
              key={letter}
              className={cn(
                "flex size-6 items-center justify-center rounded-md border-2 border-white text-[10px] font-semibold dark:border-[#121111]",
                [
                  "bg-[#1b1919] text-white dark:bg-[#f5f5f5] dark:text-[#1b1919]",
                  "bg-[#2a26ec] text-white",
                  "bg-[#f6a9d3] text-[#2b0a1f]",
                ][i],
              )}
            >
              {letter}
            </span>
          ))}
        </span>
        <span className="min-w-0 grow truncate text-sm leading-5">Shared with 3 people</span>
        <span className={cn("shrink-0 text-xs leading-4", muted)}>2 can edit</span>
      </div>
    </div>
  )
}

function ProtectGraphic() {
  const steps = [
    { icon: LinkIcon, label: "Link sent", note: "09:41" },
    { icon: LockKeyholeIcon, label: "Password", note: "unlocked" },
    { icon: EyeIcon, label: "First view", note: "09:52" },
    { icon: FlameIcon, label: "Burned", note: "410 Gone" },
  ]
  const stops = ["1h", "1d", "1w", "1m", "never"]
  return (
    <div className="flex flex-col gap-9">
      {/* The lifecycle: blue up to the first view, dashed to the end, where the paste is gone. */}
      <div className="relative grid grid-cols-4">
        <span className="absolute top-5.5 left-[12.5%] h-px w-[50%] bg-[#2a26ec] dark:bg-[#8f8cff]" />
        <span className="absolute top-5.5 left-[62.5%] w-[25%] border-t border-dashed border-[#b0b0b0] dark:border-[#4a4747]" />
        {steps.map((step, i) => (
          <div key={step.label} className="relative flex flex-col items-center gap-2 text-center">
            <span
              className={cn(
                "flex size-11 items-center justify-center rounded-lg border",
                i === 3
                  ? "border-dashed border-[#b0b0b0] bg-[#fafafa] text-[#6b6b6b] dark:border-[#4a4747] dark:bg-[#0c0b0b] dark:text-[#a3a3a3]"
                  : i === 2
                    ? "border-[#2a26ec] bg-[#2a26ec] text-white"
                    : cn(line, "bg-white text-[#2a26ec] dark:bg-[#121111] dark:text-[#8f8cff]"),
              )}
            >
              <step.icon className="size-4.5" strokeWidth={2} />
            </span>
            <span className="flex flex-col">
              <span className="text-sm leading-5 font-medium">{step.label}</span>
              <span className={cn("font-mono text-[11px] leading-4", muted)}>{step.note}</span>
            </span>
          </div>
        ))}
      </div>

      <div className={cn("flex flex-col gap-3 border-t pt-7", line)}>
        <span className="flex items-baseline justify-between text-sm leading-5">
          <span className="font-medium">Expires after</span>
          <span className={cn("font-medium", blueText)}>1 week</span>
        </span>
        {/* Each stop is the centre of one of five equal cells, so dots, thumb and labels line up. */}
        <div className="relative grid h-6 grid-cols-5 items-center rounded-md bg-[#ececec] dark:bg-[#242222]">
          <span className="absolute inset-y-0 left-0 w-1/2 rounded-l-md bg-[#2a26ec]" />
          {stops.map((stop, i) => (
            <span
              key={stop}
              className={cn(
                "relative mx-auto size-1 rounded-full",
                i < 2 ? "bg-white/80" : "bg-[#b0b0b0] dark:bg-[#4a4747]",
              )}
            />
          ))}
          <span className="absolute top-0 left-[calc(50%-16px)] h-6 w-8 rounded-md border border-[#e8e8e8] bg-white shadow-[0_1px_2px_rgb(0_0_0/0.12)] dark:border-[#3a3a3a] dark:bg-[#f5f5f5]" />
        </div>
        <span className={cn("grid grid-cols-5 text-center font-mono text-xs", muted)}>
          {stops.map((stop) => (
            <span key={stop} className={cn(stop === "1w" && blueText)}>
              {stop}
            </span>
          ))}
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <span
          className={cn(
            "flex h-10 items-center gap-2 rounded-lg border bg-white px-3 dark:bg-[#121111]",
            line,
          )}
        >
          <LockKeyholeIcon className={cn("size-4 shrink-0", muted)} strokeWidth={2} />
          <span className="font-mono text-sm tracking-widest">••••••••</span>
        </span>
        <span
          className={cn(
            "flex h-10 items-center justify-between gap-2 rounded-lg border bg-white px-3 dark:bg-[#121111]",
            line,
          )}
        >
          <span className="truncate text-sm leading-5">Burn after read</span>
          <span className="flex h-4.5 w-7.5 shrink-0 items-center justify-end rounded-sm bg-[#2a26ec] p-0.5">
            <span className="size-3.5 rounded-xs bg-white" />
          </span>
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
  const max = 100
  const peak = 88
  const revisions = [
    { name: "Revision 3", when: "Now", added: 12, removed: 3, current: true },
    { name: "Revision 2", when: "Yesterday", added: 4, removed: 9 },
    { name: "Revision 1", when: "Oct 28", added: 84, removed: 0 },
  ]
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <span className="flex items-end justify-between gap-4">
          <span className="flex flex-col">
            <span className="font-heading text-3xl leading-9 font-medium tracking-[-0.02em] tabular-nums">
              349
            </span>
            <span className={cn("text-sm leading-5", muted)}>views this week</span>
          </span>
          <span className="flex flex-col items-end">
            <span className="text-sm leading-5 font-medium tabular-nums">212</span>
            <span className={cn("text-sm leading-5", muted)}>unique</span>
          </span>
        </span>
        {/* Gridlines at 0, 50 and 100 sit behind bars that share one scale. */}
        <div className="relative h-36">
          {[0, 50, 100].map((value) => (
            <span
              key={value}
              className={cn(
                "absolute inset-x-0 border-t",
                value === 0 ? "border-solid" : "border-dashed",
                line,
              )}
              style={{ bottom: `${value}%` }}
            />
          ))}
          <div className="relative flex h-full items-end gap-2">
            {days.map(([day, value]) => (
              <div key={day} className="flex h-full flex-1 flex-col justify-end gap-1">
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
                  style={{ height: `${(value / max) * 100}%` }}
                />
              </div>
            ))}
          </div>
        </div>
        <span className={cn("flex gap-2 font-mono text-xs", muted)}>
          {days.map(([day]) => (
            <span key={day} className="flex-1 text-center">
              {day}
            </span>
          ))}
        </span>
      </div>

      {/* Revisions: a short history with the size of each change, newest first. */}
      <ol
        className={cn("relative flex flex-col rounded-lg border bg-white dark:bg-[#121111]", line)}
      >
        <span className={cn("absolute top-5 bottom-5 left-[19px] border-l", line)} />
        {revisions.map((revision) => (
          <li key={revision.name} className="relative flex items-center gap-3 px-3.5 py-2.5">
            <span
              className={cn(
                "size-2 shrink-0 rounded-full",
                revision.current
                  ? "bg-[#2a26ec] ring-4 ring-[#2a26ec]/15 dark:bg-[#8f8cff] dark:ring-[#8f8cff]/20"
                  : "bg-[#b0b0b0] dark:bg-[#4a4747]",
              )}
            />
            <span className="text-sm leading-5 font-medium">{revision.name}</span>
            <span className={cn("grow text-sm leading-5", muted)}>{revision.when}</span>
            <span className="font-mono text-xs tabular-nums">
              <span className={blueText}>+{revision.added}</span>{" "}
              {revision.removed > 0 && <span className={muted}>−{revision.removed}</span>}
            </span>
          </li>
        ))}
      </ol>
    </div>
  )
}

function ConnectGraphic() {
  const inputs = [
    { icon: ImportIcon, label: "Gist" },
    { icon: BracesIcon, label: "REST API" },
  ]
  const outputs = [
    { icon: TerminalIcon, label: "curl /raw" },
    { icon: CodeXmlIcon, label: "<iframe>" },
    { icon: BracesIcon, label: "TypeScript" },
    { icon: BracesIcon, label: "Python" },
  ]
  // Rows sit at the centre of equal slices of the column, so the wires can aim at them in percent.
  const at = (i: number, n: number) => ((2 * i + 1) / (2 * n)) * 100
  const chip = cn(
    "flex h-9 items-center gap-2 rounded-lg border bg-white px-2 font-mono text-xs whitespace-nowrap sm:px-2.5 dark:bg-[#121111]",
    line,
  )
  return (
    <div className="flex flex-col gap-6">
      <div className="grid h-64 grid-cols-[minmax(0,1fr)_14px_auto_14px_minmax(0,1fr)] sm:grid-cols-[minmax(0,1fr)_48px_auto_48px_minmax(0,1fr)]">
        <div className="flex flex-col justify-around">
          {inputs.map((input) => (
            <span key={input.label} className={chip}>
              <input.icon
                className={cn("size-3.5 shrink-0 max-sm:hidden", muted)}
                strokeWidth={2}
              />
              <span className="truncate">{input.label}</span>
            </span>
          ))}
        </div>
        <Wires
          className="h-full w-full"
          paths={inputs.map((_, i) => ({
            d: `M0,${at(i, inputs.length)} C50,${at(i, inputs.length)} 50,50 100,50`,
            live: true,
          }))}
        />
        <div className="relative flex items-center justify-center">
          <span className="flex size-14 items-center justify-center rounded-lg bg-[#2a26ec] shadow-[0_0_0_6px_rgb(42_38_236/0.12)] sm:size-20">
            <LogoMark className="size-6 text-white sm:size-8" />
          </span>
          <span className="absolute top-[calc(50%+40px)] sm:top-[calc(50%+52px)] text-sm leading-5 font-medium">
            Sniptide
          </span>
        </div>
        <Wires
          className="h-full w-full"
          paths={outputs.map((_, i) => ({
            d: `M0,50 C50,50 50,${at(i, outputs.length)} 100,${at(i, outputs.length)}`,
            live: true,
          }))}
        />
        <div className="flex flex-col justify-around">
          {outputs.map((output) => (
            <span key={output.label} className={chip}>
              <output.icon
                className={cn("size-3.5 shrink-0 max-sm:hidden", muted)}
                strokeWidth={2}
              />
              <span className="truncate">{output.label}</span>
            </span>
          ))}
        </div>
      </div>
      <span
        className={cn(
          "overflow-x-auto rounded-lg border bg-[#1b1919] px-3.5 py-3 font-mono text-xs leading-5 whitespace-pre text-white max-sm:hidden",
          "border-[#2c2a2a]",
        )}
      >
        <span className="text-[#8a8a8a]">$ </span>curl sniptide.com/xhz57h/raw
      </span>
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
    title: "Share it with the right people.",
    summary: "Pick who can see a paste, then send the link.",
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
    title: "Set how long a link lives.",
    summary: "Each link carries its own rules.",
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
    title: "See who opened what.",
    summary: "Views and history sit next to the code.",
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
    title: "Reach your pastes from any tool.",
    summary: "Scripts, docs and chat all read the same pastes.",
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
        claim="Share any paste with a link."
        reason="Passwords, expiry and view counts come with it."
        reasonClassName="text-[#a04577]"
      />

      {/* biome-ignore lint/a11y/noStaticElementInteractions: these handlers only hold the tour while the pointer or focus is inside; the tabs are the controls. */}
      <div
        className="relative overflow-hidden rounded-lg border border-white/70 max-md:-mx-5 max-md:rounded-none max-md:border-x-0 bg-linear-to-b from-white/75 to-white/60 text-[#1b1919] shadow-[inset_0_1px_0_rgb(255_255_255/0.8),0_2px_4px_rgb(43_10_31/0.06),0_24px_48px_-12px_rgb(43_10_31/0.22)] backdrop-blur-[3px] dark:border-white/15 dark:from-[#121111]/96 dark:to-[#121111]/94 dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.12),0_24px_48px_-12px_rgb(43_10_31/0.4)] dark:text-[#f5f5f5]"
        onPointerEnter={() => setHeld(true)}
        onPointerLeave={() => setHeld(false)}
        onFocus={() => setHeld(true)}
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget)) setHeld(false)
        }}
      >
        <div
          className={cn("flex items-start gap-1 border-b bg-white/30 p-1.5 dark:bg-black/20", line)}
        >
          <div
            role="tablist"
            aria-label="Features around a paste"
            className="grid min-w-0 grow grid-cols-4 gap-1"
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
                    "relative flex h-14 flex-col items-center justify-center gap-1 overflow-hidden rounded-md text-[13px] leading-4 font-medium sm:h-11 sm:flex-row sm:gap-2 sm:text-base sm:leading-6 focus-visible:ring-2 focus-visible:ring-[#2a26ec]/40 focus-visible:outline-none",
                    selected
                      ? "bg-white/70 shadow-[0_1px_2px_rgb(0_0_0/0.08)] dark:bg-white/10"
                      : cn(muted, "hover:bg-white/40 dark:hover:bg-white/5"),
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
              "flex h-14 w-8 shrink-0 items-center justify-center rounded-md hover:bg-white/40 sm:size-11 focus-visible:ring-2 focus-visible:ring-[#2a26ec]/40 focus-visible:outline-none motion-reduce:hidden dark:hover:bg-white/5",
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
                "grid content-start items-center gap-8 p-4 lg:items-stretch [grid-area:1/1] sm:gap-10 sm:p-6 motion-safe:transition-opacity motion-safe:duration-300 md:p-10 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] lg:gap-14 lg:py-16",
                i === active ? "opacity-100" : "invisible opacity-0",
              )}
            >
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2 lg:pt-2">
                  <h3 className="font-heading text-[28px] leading-8.5 font-medium tracking-[-0.025em] md:text-4xl md:leading-11">
                    {tab.title}
                  </h3>
                  <p className={cn("text-base leading-6.5", muted)}>{tab.summary}</p>
                </div>
                {/* One panel split into four cells with hairlines between them. On desktops it grows to the
                    height of the drawing beside it. */}
                <ul
                  className={cn(
                    "grid overflow-hidden rounded-lg border sm:grid-cols-2 lg:grow lg:grid-rows-2",
                    line,
                  )}
                >
                  {tab.features.map((feature) => (
                    <li
                      key={feature.title}
                      className={cn(
                        "flex flex-col gap-1 border-b bg-white/35 p-4 last:border-b-0 sm:gap-1.5 sm:p-5 sm:odd:border-r sm:[&:nth-last-child(-n+2)]:border-b-0 lg:justify-center dark:bg-black/15",
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
                      <span
                        className={cn("text-sm leading-5 sm:text-[15px] sm:leading-5.5", muted)}
                      >
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div
                aria-hidden="true"
                className={cn(
                  "flex min-h-80 min-w-0 flex-col justify-center rounded-lg border bg-white/40 p-4 sm:p-8 lg:min-h-112 dark:bg-black/20",
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
