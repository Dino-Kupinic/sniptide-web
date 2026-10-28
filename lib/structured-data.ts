import { operator } from "@/lib/legal"
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
      contactPoint: {
        "@type": "ContactPoint",
        email: operator.email,
        contactType: "customer support",
      },
      address: {
        "@type": "PostalAddress",
        streetAddress: operator.street,
        addressLocality: "Vienna",
        postalCode: "1150",
        addressCountry: operator.country,
      },
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
