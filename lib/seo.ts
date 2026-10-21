import type { Metadata } from "next"
import { siteName } from "@/lib/site"

// Metadata for a page with its own title. A page's openGraph and twitter objects replace the
// layout's instead of merging into them, so each one repeats the site-wide fields. The image comes
// from the page's own opengraph-image.tsx and twitter-image.tsx, which Next adds to these tags.
export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string
  description: string
  path: string
}): Metadata {
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      siteName,
      locale: "en_US",
      title,
      description,
      url: path,
    },
    twitter: { card: "summary_large_image", title, description },
  }
}
