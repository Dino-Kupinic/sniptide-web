import { posthogHost } from "./posthog"

// Details the Impressum, privacy policy and terms state about whoever runs sniptide.com.
// [Bracketed text] is a placeholder: replace it before the pages go live, and set an optional
// field to undefined to drop its row.
const todo = (what: string) => `[${what}]`

export const operator = {
  name: todo("Full legal name or company name"),
  legalForm: todo("Legal form, such as sole proprietor or GmbH"),
  street: todo("Street and number"),
  city: todo("Postcode and city"),
  country: "Austria",
  email: todo("Contact email"),
  phone: undefined as string | undefined,
  // Entry in the Firmenbuch, with its court. Leave undefined when the business is not registered.
  register: todo("Firmenbuch number and court, if registered") as string | undefined,
  vatId: todo("VAT identification number, if any") as string | undefined,
  // The trade licence behind the business (§ 63 GewO): the authority that issued it and the
  // chamber the business belongs to.
  tradeAuthority: todo("Trade authority, such as Magistrat or Bezirkshauptmannschaft") as
    | string
    | undefined,
  chamber: todo("Chamber membership, such as Wirtschaftskammer Wien") as string | undefined,
  // § 25 MedienG: who owns the business, and what the website is for.
  ownership: todo("Owners and their shares"),
  purpose: "Operating the Sniptide pastebin service and publishing its open-source software.",
}

export const hosting = {
  provider: todo("Hosting provider"),
  country: todo("Country of the servers"),
  // How long the web server keeps access logs.
  logDays: todo("number of days"),
}

// Where PostHog stores events: the build setting that picks its API host also says whether the
// site sends them to the EU or the US.
export const analyticsInEu = posthogHost.includes("//eu.")

export const lastUpdated = "21 October 2026"

export const legalLinks = [
  { label: "Terms", href: "/terms" },
  { label: "Privacy", href: "/privacy" },
  { label: "Impressum", href: "/impressum" },
]

export const authority = {
  name: "Datenschutzbehörde",
  address: "Barichgasse 40-42, 1030 Vienna, Austria",
  url: "https://www.dsb.gv.at",
}
