import { Analytics } from "@/components/analytics"
import { Cta } from "@/components/cta"
import { Features } from "@/components/features"
import { Hero } from "@/components/hero"
import { RawLinks } from "@/components/raw-links"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"

export default function Home() {
  return (
    <>
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
