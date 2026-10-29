import { operator } from "@/lib/legal"
import {
  appBase,
  features,
  logoUrl,
  ogImageUrl,
  repoUrl,
  siteDescription,
  siteName,
  siteTitle,
  siteUrl,
} from "@/lib/site"

const organizationId = `${siteUrl}/#organization`
const softwareId = `${siteUrl}/#software`

// Profiles Sniptide itself publishes. Personal profiles of the operator stay out, and Wikipedia,
// Wikidata or social profiles join this list only once they exist.
const npmOrg = "https://www.npmjs.com/org/sniptide"
const mcpRegistry =
  "https://registry.modelcontextprotocol.io/v0.1/servers/io.github.Dino-Kupinic%2Fsniptide/versions/latest"
const packages = [
  "https://www.npmjs.com/package/@sniptide/cli",
  "https://www.npmjs.com/package/@sniptide/mcp",
  "https://github.com/Dino-Kupinic/sniptide/pkgs/container/sniptide",
]

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
      sameAs: [repoUrl, npmOrg],
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
      "@id": softwareId,
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
      sameAs: [repoUrl, mcpRegistry, ...packages],
      publisher: { "@id": organizationId },
    },
    // The home page itself, which presents the software.
    {
      "@type": "WebPage",
      "@id": `${siteUrl}/#webpage`,
      url: siteUrl,
      name: siteTitle,
      description: siteDescription,
      inLanguage: "en",
      isPartOf: { "@id": `${siteUrl}/#website` },
      about: { "@id": softwareId },
      primaryImageOfPage: { "@type": "ImageObject", url: ogImageUrl },
    },
    // The self-host section shows the source on GitHub and the Docker image it builds.
    {
      "@type": "SoftwareSourceCode",
      "@id": `${siteUrl}/#source`,
      name: siteName,
      codeRepository: repoUrl,
      programmingLanguage: "TypeScript",
      runtimePlatform: "Docker",
      license: "https://www.gnu.org/licenses/agpl-3.0.html",
      targetProduct: { "@id": softwareId },
      publisher: { "@id": organizationId },
    },
  ],
}

// JSON.stringify doesn't escape "<", so "</script>" in a value would end the tag early.
export function serializeJsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c")
}
