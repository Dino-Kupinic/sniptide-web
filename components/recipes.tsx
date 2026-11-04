import { LoopVideo } from "@/components/loop-video"
import { SectionHeading } from "@/components/section-heading"
import { documentation } from "@/lib/agent-docs"

function Shell({ lines }: { lines: React.ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-[#2c2a2a] bg-[#1b1919] px-3.5 py-3 font-mono text-xs leading-5 whitespace-pre text-[#d4d4d4]">
      {lines}
    </div>
  )
}

const push = (
  <>
    <span className="text-white">$ sniptide push confirm-dialog --collection ui</span>
    {"\n"}
    <span className="text-[#8a8a8a]">✓ k7Qe2x · 3 files · ui</span>
  </>
)

const pull = (
  <>
    <span className="text-white">$ sniptide pull collection:ui</span>
    {"\n"}
    <span className="text-[#8a8a8a]">✓ 4 steps · 6 files written</span>
  </>
)

const steps = [
  {
    title: "Push a folder",
    text: "Every file keeps its path, so a component comes back exactly where it lived.",
    shell: push,
  },
  {
    title: "Order it in a collection",
    text: "A collection is a recipe with its steps in order, and agents follow it one step at a time.",
  },
  {
    title: "Pull it into the next project",
    text: "The CLI checks every path before it writes, and replaces a file only when you pass --force.",
    shell: pull,
  },
]

export function Recipes() {
  return (
    <section
      id="recipes"
      data-cta-location="recipes"
      className="flex scroll-mt-4 flex-col gap-10 border-t border-[#e8e8e8] bg-[#fafafa] section-frame py-16 text-[#1b1919] md:gap-14 md:py-20 xl:py-30 dark:border-[#1f1f1f] dark:bg-[#0f0f0f] dark:text-[#f5f5f5]"
    >
      <SectionHeading
        claim="Save a folder once and pull it anywhere."
        reason="Every path and every step comes back in order."
      />

      <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-16">
        {/* Recorded from a local demo instance with the ui collection seeded (public/landing). */}
        <LoopVideo
          light={{
            src: "/landing/collection-light.mp4",
            poster: "/landing/collection-light-poster.webp",
          }}
          dark={{
            src: "/landing/collection-dark.mp4",
            poster: "/landing/collection-dark-poster.webp",
          }}
          width={1604}
          height={834}
          label="The ui collection in Sniptide with four pastes: Confirm dialog, Toaster, Button with variants and Design tokens. Filtering for button leaves Button with variants."
          crop
        />

        <div className="flex flex-col gap-8">
          <ol className="flex flex-col gap-8">
            {steps.map((step, i) => (
              <li key={step.title} className="grid grid-cols-[28px_minmax(0,1fr)] gap-x-3">
                <span className="font-mono text-[13px] leading-5.5 text-[#2a26ec] tabular-nums dark:text-[#8f8cff]">
                  {i + 1}
                </span>
                <div className="flex min-w-0 flex-col gap-3">
                  <div className="flex flex-col gap-1">
                    <h3 className="text-base leading-5.5 font-semibold">{step.title}</h3>
                    <p className="text-base leading-6 text-[#6b6b6b] dark:text-[#a3a3a3]">
                      {step.text}
                    </p>
                  </div>
                  {step.shell && <Shell lines={step.shell} />}
                </div>
              </li>
            ))}
          </ol>
          <p className="border-t border-[#e8e8e8] pt-6 pl-10 dark:border-[#262626] text-base leading-6.5 text-[#6b6b6b] dark:text-[#a3a3a3]">
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
        </div>
      </div>
    </section>
  )
}
