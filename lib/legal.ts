import { posthogHost } from "./posthog"

// Details the Impressum, privacy policy and terms state about whoever runs sniptide.com. An optional
// field set to undefined drops its row.

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
  // § 25 MedienG: who owns the service, and what the website is for. The Impressum is the one page
  // that names the operator; the other pages call the service "Sniptide" and link here.
  ownership: "The operator named above owns Sniptide in full.",
  purpose: "Operating the Sniptide pastebin service and publishing its open-source software.",
}

export const hosting = {
  provider: "netcup GmbH",
  country: "Germany",
  // How long the web server keeps access logs. The reverse proxy and container log rotation on the
  // server must delete request logs after this many days; see
  // docs/deployment.md.
  logDays: 14,
  // The longest any database backup is kept, so a deleted row has left every backup after this
  // many days. A ceiling the backup schedule must stay under, whichever schedule is chosen.
  backupDays: 30,
}

// The network in front of sniptide.com and its subdomains. It terminates TLS, so it sees every
// request, and it reports the visitor's country that analytics use.
export const cdn = {
  provider: "Cloudflare, Inc.",
  country: "the United States",
}

// Who delivers the app's account and notification emails over SMTP.
export const emailProvider = "Resend, Inc."

// Where PostHog stores events: the build setting that picks its API host also says whether the
// site sends them to the EU or the US.
export const analyticsInEu = posthogHost.includes("//eu.")

export const lastUpdated = "26 November 2026"

// The youngest age the terms allow.
export const minimumAge = 16

export const legalLinks = [
  { label: "Terms", href: "/terms" },
  { label: "Acceptable use", href: "/acceptable-use" },
  { label: "Privacy", href: "/privacy" },
  { label: "Impressum", href: "/impressum" },
  // Served by the app (COPYRIGHT_EMAIL) and reached through the share-link proxy.
  { label: "Copyright", href: "/copyright" },
]

export const authority = {
  name: "Datenschutzbehörde",
  address: "Barichgasse 40-42, 1030 Vienna, Austria",
  url: "https://www.dsb.gv.at",
}
