import { ChevronRightIcon } from "lucide-react"
import Image from "next/image"
import demoPreview from "@/assets/landing/demo-preview.webp"
import { links } from "@/lib/links"

const alt =
  "The Sniptide demo dashboard: paste and view counts, a quick paste editor and a chart of views."

export function ProductBand() {
  return (
    <section
      data-cta-location="product"
      className="flex flex-col items-center gap-6 overflow-clip bg-[#2a26ec] pt-10 pl-5 md:gap-9 md:px-10 md:pt-16"
    >
      <a
        href={links.signUp}
        className="raised-button flex h-8.5 shrink-0 items-center gap-2.5 self-start bg-[#2a26ec] [--button-focus:white] border border-white/35 px-3.5 text-sm leading-4.5 font-medium text-white hover:bg-white/10 md:self-auto"
      >
        <span className="md:hidden">Write, share and track every paste</span>
        <span className="hidden md:inline">Write, share and track every paste from one place</span>
        <ChevronRightIcon className="size-2.5" strokeWidth={3} />
      </a>

      {/* On phones the app runs off the right edge, like a window that doesn't fit the screen. */}
      <div className="relative h-85 w-full self-start overflow-clip rounded-t-lg border-t border-l border-[#0a0a0a] bg-[#0a0a0a] md:aspect-[1360/640] md:h-auto md:w-full md:max-w-340 md:self-center md:border-r">
        {/* The demo is dark-themed, so the same shot is used in both color schemes. */}
        <Image
          src={demoPreview}
          alt={alt}
          unoptimized
          className="block h-auto w-200 max-w-none md:w-full"
        />

        {/* Dimmed so the button reads as the way in. */}
        <div className="absolute inset-0 flex items-center justify-center bg-[#0a0a0a]/45">
          <a
            href={links.demo}
            className="raised-button flex h-12 items-center gap-2.5 bg-white [--button-depth:#b6b4ff] [--button-focus:white] px-5.5 text-base leading-5 font-semibold text-[#2a26ec]"
          >
            <span className="size-2.5 bg-[#2a26ec]" />
            Try the demo
          </a>
        </div>
      </div>
    </section>
  )
}
