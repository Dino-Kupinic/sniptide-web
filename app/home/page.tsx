import type { Metadata } from "next"
import { Cta } from "@/components/cta"
import { FunnelTracking } from "@/components/funnel-tracking"
import { Hero } from "@/components/hero"
import { JsonLd } from "@/components/json-ld"
import { Overview } from "@/components/overview"
import { ProductBand } from "@/components/product-band"
import { Recipes } from "@/components/recipes"
import { Secrets } from "@/components/secrets"
import { Sharing } from "@/components/sharing"
import { SiteFooter } from "@/components/site-footer"
import { AnnouncementBar } from "@/components/announcement-bar"
import { SiteHeader } from "@/components/site-header"
import { WorksWith } from "@/components/works-with"
import { postPath } from "@/lib/blog"
import { getPosts } from "@/lib/blog-source"
import { getAnnouncement } from "@/lib/changelog-source"
import { getGithubStars } from "@/lib/github-stars"

// The same page as /. The canonical link folds it into / for search engines; adding noindex as
// well would send them two conflicting signals.
export const metadata: Metadata = { alternates: { canonical: "/" } }

export const revalidate = 3600

export default async function Home() {
  const [stars, announcement] = await Promise.all([getGithubStars(), getAnnouncement()])
  const latest = getPosts()[0]
  return (
    <div className="text-[#0a0a0a] dark:text-white">
      <JsonLd />
      {announcement && <AnnouncementBar announcement={announcement} />}
      <SiteHeader
        stars={stars}
        latestPost={latest ? { title: latest.title, href: postPath(latest.slug) } : null}
      />
      <main>
        <Hero />
        <WorksWith />
        <ProductBand />
        <Overview />
        <Recipes />
        <Secrets />
        <Sharing />
        <Cta stars={stars} />
      </main>
      <SiteFooter />
      <FunnelTracking />
    </div>
  )
}
