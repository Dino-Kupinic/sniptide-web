import { PixelCanvas } from "@/components/pixel-canvas"
import { links } from "@/lib/links"

const rules = [
  "Links expire in an hour, a day, or a week",
  "Burn after the first read",
  "Secrets flagged before anyone sees them",
]

// The pink section looks the same in both themes.
export function Rules() {
  return (
    <section
      data-cta-location="rules"
      className="relative flex flex-col gap-8 overflow-clip bg-[#fbd3ea] px-5 py-16 text-[#2b0a1f] md:gap-14 md:p-10 xl:px-30 xl:py-28"
    >
      <PixelCanvas kind="grain" className="absolute inset-0 size-full opacity-35" />

      <h2 className="relative max-w-240 font-heading text-[30px] leading-8.75 font-medium tracking-[-0.03em] md:text-5xl md:leading-13.5">
        Code leaks differently than normal files.{" "}
        <span className="block text-[#a04577]">You need rules that travel with the link.</span>
      </h2>

      <div className="relative flex flex-col gap-8 xl:flex-row xl:justify-between xl:gap-10">
        <div className="flex shrink-0 flex-col gap-7 xl:w-115">
          <p className="text-lg leading-6.75">
            A config with a token, a stack trace with a customer email. Once a link is out, you
            can't take it back. Sniptide lets you decide before you hit share.
          </p>
          <ol className="flex flex-col border-t border-[#2b0a1f]/18">
            {rules.map((rule, i) => (
              <li key={rule} className="flex gap-4 border-b border-[#2b0a1f]/18 py-4">
                <span className="w-11 shrink-0 font-mono text-[13px] leading-4 text-[#a04577]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-base leading-5 font-medium">{rule}</span>
              </li>
            ))}
          </ol>
          <div className="flex flex-wrap gap-2.5">
            <a
              href="#features"
              className="flex h-11 items-center bg-[#2b0a1f] px-5 text-[15px] leading-4.5 font-semibold text-[#fbd3ea] hover:bg-[#3d1230]"
            >
              See sharing rules
            </a>
            <a
              href={links.docs}
              className="flex h-11 items-center border border-[#2b0a1f] px-5 text-[15px] leading-4.5 font-semibold hover:bg-[#2b0a1f]/8"
            >
              Read the docs
            </a>
          </div>
        </div>

        {/* A burn-after-read link, step by step. */}
        <div className="flex flex-col items-center justify-center bg-[#2b0a1f] px-4 py-12 font-mono text-sm leading-4.5 xl:max-w-155 xl:flex-1 xl:p-12">
          <div className="flex h-11 items-center border border-[#f6a9d3] px-4.5 text-[#fbd3ea]">
            ● paste created · expires 24h
          </div>
          <div className="h-11 w-px bg-[#f6a9d3]" />
          <div className="flex h-11 items-center bg-[#f6a9d3] px-4.5 font-semibold text-[#2b0a1f]">
            ◉ first view · 10.0.4.12
          </div>
          <div className="h-11 w-px bg-[#f6a9d3]" />
          <div className="flex h-11 items-center border border-dashed border-[#f6a9d3]/60 px-4.5 text-[#fbd3ea]/60">
            ✕ burned · link returns 410
          </div>
        </div>
      </div>
    </section>
  )
}
