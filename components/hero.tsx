import { PixelCanvas } from "@/components/pixel-canvas"
import { links } from "@/lib/links"

export function Hero() {
  return (
    <section
      data-cta-location="hero"
      className="relative flex h-160 flex-col justify-end overflow-clip bg-white p-3 md:block md:h-200 md:p-0 dark:bg-[#0a0a0a]"
    >
      {/* Pixel horizon: a day seascape in light mode, a pink dusk in dark mode. Phones get a crop
          of the desktop scene around the sun rather than a squeezed one. */}
      <PixelCanvas
        kind="horizon"
        className="absolute bottom-0 left-[calc((100%-1178px)*0.8)] h-180 w-[1178px] md:top-[-80px] md:bottom-auto md:left-0 md:h-[calc(100%+80px)] md:w-full"
      />

      <div className="relative flex flex-col gap-4 bg-white p-6 md:absolute md:top-10 md:left-8 md:w-160 md:max-w-[calc(100%-64px)] md:gap-5.5 md:p-10 dark:bg-[#0a0a0a]">
        <h1 className="font-heading text-[44px] leading-none tracking-[-1.5px] text-[#0a0a0a] md:text-7xl md:tracking-[-2.5px] dark:text-white">
          The pastebin for your agents.
        </h1>
        <p className="text-base leading-[1.5] text-[#6b6b6b] md:text-[19px] dark:text-[#a3a3a3]">
          Let your coding agents search, read and save snippets. Open source and self-hostable.
        </p>
        <div className="flex flex-col gap-2 pt-1 md:flex-row md:gap-2.5 md:pt-1.5">
          <a
            href={links.newPaste}
            className="raised-button flex h-12 items-center justify-center gap-2.5 bg-[#2a26ec] px-5.5 text-base leading-5 font-semibold text-white hover:bg-[#3a36ff]"
          >
            <span className="size-2.5 bg-white" />
            Create a paste
          </a>
          <a
            href={links.selfHost}
            className="raised-button flex h-12 items-center justify-center bg-[#f2f2f2] [--button-depth:#d0d0d0] dark:[--button-depth:#383838] px-5.5 text-base leading-5 font-semibold text-[#0a0a0a] hover:bg-[#e8e8e8] dark:bg-[#1c1c1c] dark:text-white dark:hover:bg-[#262626]"
          >
            Self-host Sniptide
          </a>
        </div>
      </div>
    </section>
  )
}
