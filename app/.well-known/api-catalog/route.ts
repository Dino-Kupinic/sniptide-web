import { appBase, siteUrl } from "@/lib/site"

export function GET() {
  return Response.json(
    {
      linkset: [
        { anchor: `${siteUrl}/.well-known/api-catalog`, item: [{ href: `${appBase}/api/v1/me` }] },
        {
          anchor: `${appBase}/api/v1/me`,
          "service-desc": [{ href: `${appBase}/api/openapi.json`, type: "application/json" }],
          "service-doc": [{ href: `${appBase}/docs/api`, type: "text/html" }],
        },
      ],
    },
    {
      headers: {
        "Content-Type":
          'application/linkset+json; profile="https://www.rfc-editor.org/info/rfc9727"',
        Link: `<${siteUrl}/.well-known/api-catalog>; rel="api-catalog"`,
      },
    },
  )
}
