import type { ReactNode } from "react"
import { AnnouncementBar } from "@/components/announcement-bar"
import { Cta } from "@/components/cta"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { postPath } from "@/lib/blog"
import { getPosts } from "@/lib/blog-source"
import { getAnnouncement } from "@/lib/changelog-source"
import { getGithubStars } from "@/lib/github-stars"

// The landing page's header and footer around a blog page, so readers can reach the product from
// any post. The .blog class sets the reading surfaces (app/globals.css). With `cta`, the landing
// page's closing section sits between the page and the footer.
export async function BlogShell({ children, cta = false }: { children: ReactNode; cta?: boolean }) {
  const [stars, announcement] = await Promise.all([getGithubStars(), getAnnouncement()])
  const latest = getPosts()[0]
  return (
    <div className="blog flex min-h-dvh flex-col bg-background text-foreground">
      <a
        href="#content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-md focus:bg-primary focus:px-3 focus:py-2 focus:text-sm focus:text-primary-foreground"
      >
        Skip to content
      </a>
      {announcement && <AnnouncementBar announcement={announcement} />}
      <SiteHeader
        stars={stars}
        latestPost={latest ? { title: latest.title, href: postPath(latest.slug) } : null}
      />
      <main id="content" className="flex-1 pb-12 md:pb-20">
        {children}
      </main>
      {cta && <Cta stars={stars} />}
      <SiteFooter sectionBase="/home" />
    </div>
  )
}
