import { ChevronRightIcon } from "lucide-react"
import { ProductPreview } from "@/components/product-preview"
import { links } from "@/lib/links"

export function ProductBand() {
  return (
    <section
      data-cta-location="product"
      className="flex flex-col items-center gap-6 overflow-clip bg-[#2a26ec] px-5 pt-10 md:gap-9 md:px-10 md:pt-16"
    >
      <a
        href={links.signUp}
        className="raised-button flex h-8.5 shrink-0 items-center gap-2.5 self-start bg-[#2a26ec] [--button-focus:white] border border-white/35 px-3.5 text-sm leading-4.5 font-medium text-white hover:bg-white/10 md:self-auto"
      >
        Write, share and track every paste
        <ChevronRightIcon className="size-2.5" strokeWidth={3} />
      </a>

      <div className="relative w-full max-w-340 overflow-clip rounded-t-lg border border-b-0 border-[#e8e8e8] bg-white dark:border-[#0a0a0a] dark:bg-[#0a0a0a]">
        <ProductPreview />
      </div>
    </section>
  )
}
