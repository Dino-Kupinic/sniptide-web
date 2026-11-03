import type { Metadata } from "next"
import { Analytics } from "@/components/analytics"
import { Cta } from "@/components/cta"
import { Features } from "@/components/features"
import { FunnelTracking } from "@/components/funnel-tracking"
import { Hero } from "@/components/hero"
import { JsonLd } from "@/components/json-ld"
import { ProductBand } from "@/components/product-band"
import { RawLinks } from "@/components/raw-links"
import { Rules } from "@/components/rules"
import { SelfHost } from "@/components/self-host"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { WorksWith } from "@/components/works-with"
import { getGithubStars } from "@/lib/github-stars"

// The same page as /. The canonical link folds it into / for search engines; adding noindex as
// well would send them two conflicting signals.
export const metadata: Metadata = { alternates: { canonical: "/" } }

export const revalidate = 3600

export default async function Home() {
  const stars = await getGithubStars()
  return (
    <div className="text-[#0a0a0a] dark:text-white">
      <JsonLd />
      <SiteHeader stars={stars} />
      <main>
        <Hero />
        <WorksWith />
        <ProductBand />
        <Features />
        <Rules />
        <Analytics />
        <RawLinks />
        <SelfHost />
        <Cta />
      </main>
      <SiteFooter />
      <FunnelTracking />
    </div>
  )
}
