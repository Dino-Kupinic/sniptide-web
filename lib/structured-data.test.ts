import { describe, expect, test } from "bun:test"
import { serializeJsonLd, structuredData } from "./structured-data"

const graph = structuredData["@graph"]
const byType = (type: string) => graph.find((node) => node["@type"] === type)

describe("structured data", () => {
  test("describes the organization, the website and the software", () => {
    expect(graph.map((node) => node["@type"])).toEqual([
      "Organization",
      "WebSite",
      "SoftwareApplication",
    ])
    expect(byType("SoftwareApplication")).toMatchObject({
      name: "Sniptide",
      applicationCategory: "DeveloperApplication",
    })
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
})
