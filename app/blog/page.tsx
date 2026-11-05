import type { Metadata } from "next"
import { LegalPage } from "@/components/legal-page"
import { links } from "@/lib/links"

export const metadata: Metadata = {
  alternates: { canonical: "/blog" },
  title: "Blog",
  description: "Product news and notes on building Sniptide.",
}

// No posts yet. The first one replaces this paragraph with a list of posts, newest first.
export default function Page() {
  return (
    <LegalPage title="Blog" updated={false}>
      <p>
        The first posts are on their way. Until then, the{" "}
        <a href={`${links.github}/releases`}>release notes on GitHub</a> list what changed in each
        version.
      </p>
    </LegalPage>
  )
}
