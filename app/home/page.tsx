import { Analytics } from "@/components/analytics"
import { Cta } from "@/components/cta"
import { Features } from "@/components/features"
import { Hero } from "@/components/hero"
import { JsonLd } from "@/components/json-ld"
import { RawLinks } from "@/components/raw-links"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"

export default function Home() {
  return (
    <>
      <JsonLd />
      <SiteHeader />
      <main>
        <Hero />
        <Analytics />
        <Features />
        <RawLinks />
        <Cta />
      </main>
      <SiteFooter />
    </>
  )
}
