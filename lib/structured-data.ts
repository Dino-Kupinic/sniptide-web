import { type Comparison, comparisonPath, comparisonsChecked } from "@/lib/comparisons"
import {
  appBase,
  features,
  logoUrl,
  ogImageUrl,
  repoUrl,
  siteDescription,
  siteName,
  siteUrl,
} from "@/lib/site"

const organizationId = `${siteUrl}/#organization`

export const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": organizationId,
      name: siteName,
      url: siteUrl,
      logo: logoUrl,
      description: siteDescription,
      sameAs: [repoUrl],
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      name: siteName,
      url: siteUrl,
      description: siteDescription,
      inLanguage: "en",
      publisher: { "@id": organizationId },
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${siteUrl}/#software`,
      name: siteName,
      url: siteUrl,
      description: siteDescription,
      image: ogImageUrl,
      applicationCategory: "DeveloperApplication",
      operatingSystem: "Web, Linux (Docker)",
      license: "https://www.gnu.org/licenses/agpl-3.0.html",
      isAccessibleForFree: true,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      featureList: features,
      softwareHelp: { "@type": "WebPage", url: `${appBase}/docs/api` },
      sameAs: [repoUrl],
      publisher: { "@id": organizationId },
    },
  ],
}

// JSON.stringify doesn't escape "<", so "</script>" in a value would end the tag early.
export function serializeJsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c")
}

// A comparison page points at the website and the software described on the home page, and
// carries the date its competitor details were last checked.
export function comparisonStructuredData(comparison: Comparison) {
  const url = `${siteUrl}${comparisonPath(comparison.slug)}`
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: comparison.title,
    description: comparison.description,
    inLanguage: "en",
    dateModified: new Date(`${comparisonsChecked} UTC`).toISOString().slice(0, 10),
    isPartOf: { "@id": `${siteUrl}/#website` },
    about: { "@id": `${siteUrl}/#software` },
    primaryImageOfPage: `${url}/opengraph-image`,
  }
}
