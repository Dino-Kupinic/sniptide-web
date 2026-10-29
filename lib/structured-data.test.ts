import { describe, expect, test } from "bun:test"
import { homeGraph, jsonLdDocuments, serializeJsonLd, structuredData } from "./structured-data"

const graph = structuredData["@graph"]
const byType = (type: string) => graph.find((node) => node["@type"] === type)

describe("structured data", () => {
  test("describes the organization, the website and the software", () => {
    expect(graph.map((node) => node["@type"])).toEqual([
      "Organization",
      "WebSite",
      "SoftwareApplication",
      "WebPage",
      "SoftwareSourceCode",
    ])
    expect(byType("SoftwareApplication")).toMatchObject({
      name: "Sniptide",
      applicationCategory: "DeveloperApplication",
      softwareHelp: { "@type": "WebPage", url: "https://docs.sniptide.com" },
    })
  })

  test("gives the software the same image link previews show", () => {
    expect(byType("SoftwareApplication")).toHaveProperty(
      "image",
      "https://sniptide.com/opengraph-image",
    )
  })

  test("references the organization by an id that exists", () => {
    const organizationId = "https://sniptide.com/#organization"
    expect(byType("Organization")?.["@id"]).toBe(organizationId)
    expect(byType("WebSite")).toHaveProperty("publisher", { "@id": organizationId })
    expect(byType("SoftwareApplication")).toHaveProperty("publisher", { "@id": organizationId })
  })

  test("serializes to JSON that round-trips and can't close a script tag", () => {
    const json = serializeJsonLd({ name: "</script><script>alert(1)</script>" })
    expect(json).not.toContain("<")
    expect(JSON.parse(json)).toEqual({ name: "</script><script>alert(1)</script>" })
    expect(JSON.parse(serializeJsonLd(structuredData))).toEqual(structuredData)
  })

  test("adds the product band screenshot to the home page graph", () => {
    const home = homeGraph("/_next/static/media/demo-preview-light.abc123.webp")
    const image = home.find((node) => node["@type"] === "ImageObject")
    expect(image).toMatchObject({
      "@id": "https://sniptide.com/#screenshot",
      contentUrl: "https://sniptide.com/_next/static/media/demo-preview-light.abc123.webp",
    })
    expect(byType("SoftwareApplication")).toHaveProperty("screenshot", { "@id": image?.["@id"] })
  })

  test("splits the graph into documents with a top-level @context and @type", () => {
    const documents = jsonLdDocuments(homeGraph("/screenshot.webp"))
    expect(documents).toHaveLength(graph.length + 1)
    for (const document of documents) {
      expect(document).toHaveProperty("@context", "https://schema.org")
      expect(document).toHaveProperty("@type")
    }
  })
})
