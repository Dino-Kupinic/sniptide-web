import type { Metadata } from "next"
import { Analytics } from "@/components/analytics"
import { Compare } from "@/components/compare"
import { Cta } from "@/components/cta"
import { Features } from "@/components/features"
import { Hero } from "@/components/hero"
import { JsonLd } from "@/components/json-ld"
import { ProductBand } from "@/components/product-band"
import { RawLinks } from "@/components/raw-links"
import { Rules } from "@/components/rules"
import { SelfHost } from "@/components/self-host"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { WorksWith } from "@/components/works-with"

// The same page as /, kept out of search results so the two never compete.
export const metadata: Metadata = {
  alternates: { canonical: "/" },
  robots: { index: false, follow: true },
}

export default function Home() {
  return (
    <div className="text-[#0a0a0a] dark:text-white">
      <JsonLd />
      <SiteHeader />
      <main>
        <Hero />
        <WorksWith />
        <ProductBand />
        <Features />
        <Rules />
        <Analytics />
        <Compare />
        <RawLinks />
        <SelfHost />
        <Cta />
      </main>
      <SiteFooter />
    </div>
  )
}
