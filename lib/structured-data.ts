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
const screenshotId = `${siteUrl}/#screenshot`

// The product band's screenshot of the demo dashboard, which the page and the JSON-LD both describe.
export const screenshotCaption =
  "The Sniptide demo dashboard: paste and view counts, a quick paste editor and a chart of views."

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
      screenshot: { "@id": screenshotId },
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

// The home page's graph with the screenshot, whose URL the bundler fingerprints at build time.
export function homeGraph(screenshotSrc: string) {
  return [
    ...structuredData["@graph"],
    {
      "@type": "ImageObject",
      "@id": screenshotId,
      contentUrl: new URL(screenshotSrc, siteUrl).href,
      caption: screenshotCaption,
      encodingFormat: "image/webp",
      width: 2532,
      height: 1586,
    },
  ]
}

// One document per node, each with its own @context and @type at the top, because some readers
// look only at a script's top-level @type and never walk an @graph.
export function jsonLdDocuments(graph: object[]) {
  return graph.map((node) => ({ "@context": "https://schema.org", ...node }))
}

// JSON.stringify doesn't escape "<", so "</script>" in a value would end the tag early.
export function serializeJsonLd(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c")
}
