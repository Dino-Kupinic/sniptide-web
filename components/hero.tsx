import { Button } from "@sniptide/ui/components/button"
import Image from "next/image"
import dashboard from "@/assets/dashboard.webp"
import pixelsLeft from "@/assets/pixels-left.svg"
import pixelsRight from "@/assets/pixels-right.svg"
import { links } from "@/lib/links"

export function Hero() {
  return (
    <>
      <section
        data-cta-location="hero"
        className="relative flex flex-col items-center gap-6.5 overflow-clip px-4 pt-20 pb-26 text-center md:h-130 md:justify-center md:pt-0 md:pb-6"
      >
        {/* Barcode pixels drifting in from the edges; decoration only. */}
        <Image
          src={pixelsLeft}
          unoptimized
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute top-12.5 left-0 hidden h-110 w-70 xl:block"
        />
        <Image
          src={pixelsRight}
          unoptimized
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute top-17.5 right-0 hidden h-110 w-70 xl:block"
        />

        <h1 className="font-heading text-5xl leading-[1.03] font-medium tracking-[-0.035em] md:text-[76px] md:leading-[78px]">
          Short links
          <br />
          for your code.
        </h1>
        <p className="max-w-140 text-lg leading-7 text-muted-foreground">
          Paste code, choose when it expires, and share one link. Every paste shows how often it was
          opened.
        </p>
        <div className="flex items-center gap-2.5 pt-1.5">
          <Button
            className="h-11 gap-2 px-4.5 text-[15px]"
            render={<a href={links.newPaste} />}
            nativeButton={false}
          >
            <span className="size-2.5 bg-primary-foreground" />
            Create a paste
          </Button>
          <Button
            variant="secondary"
            className="h-11 px-4.5 text-[15px]"
            render={<a href="#features" />}
            nativeButton={false}
          >
            See features
          </Button>
        </div>
      </section>

      <section className="flex justify-center px-4 pb-30 sm:px-8 lg:px-30">
        <div className="w-full max-w-300 bg-sidebar shadow-[10px_10px_0_var(--foreground)]">
          <Image
            src={dashboard}
            unoptimized
            priority
            alt="The Sniptide dashboard: paste stats, a quick paste editor and a chart of views."
            className="block h-auto w-full"
          />
        </div>
      </section>
    </>
  )
}
