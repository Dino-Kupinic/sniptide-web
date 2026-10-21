import { posthogHost } from "./posthog"

// Details the Impressum, privacy policy and terms state about whoever runs sniptide.com.
// [Bracketed text] is a placeholder: replace it before the pages go live. An optional field set to
// undefined drops its row.
const todo = (what: string) => `[${what}]`

export const operator = {
  name: "Dino Kupinic",
  street: "Pfeiffergasse 5",
  city: "1150 Vienna",
  country: "Austria",
  email: "office@sniptide.com",
  phone: undefined as string | undefined,
  // Sniptide is run by a private person, not a company. If that changes, fill in the legal form,
  // the Firmenbuch entry with its court, the VAT number, and the trade authority and chamber
  // behind a trade licence (§ 63 GewO); each one adds a row to the Impressum.
  legalForm: undefined as string | undefined,
  register: undefined as string | undefined,
  vatId: undefined as string | undefined,
  tradeAuthority: undefined as string | undefined,
  chamber: undefined as string | undefined,
  // § 25 MedienG: who owns the service, and what the website is for.
  ownership: "Dino Kupinic owns Sniptide in full.",
  purpose: "Operating the Sniptide pastebin service and publishing its open-source software.",
}

export const hosting = {
  provider: "netcup GmbH",
  country: "Germany",
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
