import { LoopVideo } from "@/components/loop-video"
import { SectionHeading } from "@/components/section-heading"
import { type SessionLine, TypedSession } from "@/components/typed-session"
import { documentation } from "@/lib/agent-docs"

// What the CLI prints for each step: `push` reports the new paste, `pull` lists what it wrote.
const push: SessionLine[] = [
  { kind: "command", text: "sniptide push ./confirm-dialog --collection components" },
  { kind: "output", text: "Created k7Qe2x (3 files).", tone: "success" },
]

const pull: SessionLine[] = [
  { kind: "command", text: "sniptide pull collection:components" },
  { kind: "output", text: "Wrote 6 files in ~/acme/shop.", tone: "success" },
  { kind: "output", text: "src/components/confirm-dialog.tsx" },
  { kind: "output", text: "src/components/toaster.tsx" },
]

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
        {/* Recorded from a local demo instance with a Components collection seeded (public/landing). */}
        <LoopVideo
          light={{
            src: "/landing/components-light.mp4",
            poster: "/landing/components-light-poster.webp",
          }}
          dark={{
            src: "/landing/components-dark.mp4",
            poster: "/landing/components-dark-poster.webp",
          }}
          width={1604}
          height={960}
          label="The Components collection in Sniptide as cards in two columns, scrolling past Confirm dialog, Toaster, Button, Design tokens, Combobox, Data table, Bottom sheet, Kbd, Tabs and Switch."
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
                  {step.shell && <TypedSession lines={step.shell} variant="shell" hold={2600} />}
                </div>
              </li>
            ))}
          </ol>
          <p className="border-t border-[#e8e8e8] pt-6 pl-10 dark:border-[#262626] text-base leading-6.5 text-[#6b6b6b] dark:text-[#a3a3a3]">
            <code className="font-mono text-[15px] text-[#1b1919] dark:text-[#f5f5f5]">
              sniptide skill components
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
