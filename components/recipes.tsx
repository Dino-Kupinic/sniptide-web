import { cn } from "@sniptide/ui/lib/utils"
import { SectionHeading } from "@/components/section-heading"
import { documentation } from "@/lib/agent-docs"

// The logo's six stripes, tapering from a hairline at the top to a full bar at the bottom.
const stripes = [1, 3, 5, 8, 11, 15]

function Stripes() {
  return (
    <div aria-hidden="true" className="absolute inset-0 flex flex-col justify-around py-5">
      {stripes.map((height) => (
        <div key={height} className="bg-[#2a26ec]" style={{ height }} />
      ))}
    </div>
  )
}

function Stage({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex h-64 items-center overflow-hidden rounded-lg px-4 md:h-72">
      <Stripes />
      <div className="relative w-full">{children}</div>
    </div>
  )
}

function Shell({ title, lines }: { title: string; lines: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-lg border border-[#2c2a2a] bg-[#1b1919] font-mono text-[11px] leading-5 text-[#d4d4d4]">
      <div className="flex h-8 items-center border-b border-[#2c2a2a] px-3 text-[#6b6b6b]">
        {title}
      </div>
      <div className="overflow-x-auto px-3 py-3 whitespace-pre">{lines}</div>
    </div>
  )
}

const steps = ["tokens.css", "button.tsx", "toast.tsx", "confirm-dialog/"]

function CollectionCard() {
  return (
    <div className="overflow-hidden rounded-lg border border-[#e8e8e8] bg-white text-xs leading-4 text-[#1b1919] dark:border-[#262626] dark:bg-[#141414] dark:text-[#f5f5f5]">
      <div className="flex h-8 items-center justify-between border-b border-[#e8e8e8] px-3 dark:border-[#262626]">
        <span className="font-medium">Collection ui</span>
        <span className="font-mono text-[11px] text-[#6b6b6b] dark:text-[#8a8a8a]">4 steps</span>
      </div>
      <ol>
        {steps.map((step, i) => {
          const added = i === steps.length - 1
          return (
            <li
              key={step}
              className={cn(
                "flex h-9 items-center gap-3 border-b border-[#f0f0f0] px-3 font-mono last:border-b-0 dark:border-[#1f1f1f]",
                added && "bg-[#2a26ec] text-white dark:border-transparent",
              )}
            >
              <span className={cn("w-3 text-[#8a8a8a]", added && "text-white/70")}>{i + 1}</span>
              <span className="grow">{step}</span>
              {added && <span className="text-[11px] text-white/80">added</span>}
            </li>
          )
        })}
      </ol>
    </div>
  )
}

const push = (
  <>
    <span className="text-white">$ sniptide push confirm-dialog --collection ui</span>
    {"\n"}
    <span className="text-[#8f8cff]">↑</span> index.ts{"\n"}
    <span className="text-[#8f8cff]">↑</span> confirm-dialog.tsx{"\n"}
    <span className="text-[#8f8cff]">↑</span> use-confirm.ts{"\n"}
    <span className="text-[#8a8a8a]">✓ k7Qe2x · 3 files · ui</span>
  </>
)

const pull = (
  <>
    <span className="text-white">$ sniptide pull collection:ui</span>
    {"\n"}
    <span className="text-[#8f8cff]">✓</span> src/styles/tokens.css{"\n"}
    <span className="text-[#8f8cff]">✓</span> src/components/button.tsx{"\n"}
    <span className="text-[#8f8cff]">✓</span> src/components/toast.tsx{"\n"}
    <span className="text-[#8f8cff]">✓</span> src/components/confirm-dialog/ · 3 files{"\n"}
    <span className="text-[#8a8a8a]">4 steps · 6 files written</span>
  </>
)

function Step({
  title,
  children,
  visual,
}: {
  title: string
  children: React.ReactNode
  visual: React.ReactNode
}) {
  return (
    <li className="flex min-w-0 flex-col gap-5">
      <Stage>{visual}</Stage>
      <div className="flex flex-col gap-1.5">
        <h3 className="text-base leading-5.5 font-semibold">{title}</h3>
        <p className="text-sm leading-5.5 text-[#6b6b6b] dark:text-[#9a9a9a]">{children}</p>
      </div>
    </li>
  )
}

export function Recipes() {
  return (
    <section
      id="recipes"
      data-cta-location="recipes"
      className="flex scroll-mt-4 flex-col gap-8 border-t border-[#e8e8e8] bg-[#fafafa] px-5 py-16 text-[#1b1919] md:gap-12 md:p-10 xl:p-30 dark:border-[#1f1f1f] dark:bg-[#0f0f0f] dark:text-[#f5f5f5]"
    >
      <SectionHeading
        claim="Capture a folder once and restore it anywhere."
        reason="The CLI keeps the paths, and collections keep the order."
      />

      <ol className="grid gap-10 md:gap-5 lg:grid-cols-3">
        <Step title="Push a folder" visual={<Shell title="~/acme/web" lines={push} />}>
          Every file keeps its path, so a component comes back exactly where it lived.
        </Step>
        <Step title="Add it to a collection" visual={<CollectionCard />}>
          A collection is a recipe with its steps in order, and agents follow it one step at a time.
        </Step>
        <Step
          title="Pull it into the next project"
          visual={<Shell title="~/acme/admin" lines={pull} />}
        >
          The CLI checks every path before it writes, and replaces a file only when you pass{" "}
          <code className="font-mono text-[13px]">--force</code>.
        </Step>
      </ol>

      <p className="max-w-170 text-base leading-6.5 text-[#6b6b6b] dark:text-[#9a9a9a]">
        <code className="font-mono text-[15px] text-[#1b1919] dark:text-[#f5f5f5]">
          sniptide skill ui
        </code>{" "}
        turns the same collection into a skill for Claude Code, Cursor or Codex.{" "}
        <a
          href={documentation.cli.url}
          className="font-medium text-[#2a26ec] underline-offset-4 hover:underline dark:text-[#8f8cff]"
        >
          Read the CLI guide
        </a>
      </p>
    </section>
  )
}
