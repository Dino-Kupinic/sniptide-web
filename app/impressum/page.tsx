import type { Metadata } from "next"
import { LegalPage } from "@/components/legal-page"
import { operator } from "@/lib/legal"

export const metadata: Metadata = {
  title: "Impressum: Sniptide",
  description: "Who runs sniptide.com and how to reach them.",
}

type Row = { label: string; value: React.ReactNode | undefined }

const rows: Row[] = [
  { label: "Operator", value: operator.name },
  { label: "Legal form", value: operator.legalForm },
  {
    label: "Address",
    value: (
      <>
        {operator.street}
        <br />
        {operator.city}
        <br />
        {operator.country}
      </>
    ),
  },
  { label: "Email", value: <a href={`mailto:${operator.email}`}>{operator.email}</a> },
  { label: "Phone", value: operator.phone },
  { label: "Company register", value: operator.register },
  { label: "VAT identification number", value: operator.vatId },
  { label: "Trade authority", value: operator.tradeAuthority },
  { label: "Chamber", value: operator.chamber },
  { label: "Business purpose", value: operator.purpose },
  { label: "Ownership", value: operator.ownership },
]

export default function Impressum() {
  return (
    <LegalPage title="Impressum" updated={false}>
      <p>
        Sniptide is operated by the person or company below. This page gives the information
        required of service providers by § 5 E-Commerce Act (ECG) and § 14 Business Code (UGB), and
        the disclosure required of media owners by § 25 Media Act (MedienG).
      </p>

      <dl className="grid gap-x-8 gap-y-4 md:grid-cols-[13rem_1fr]">
        {rows
          .filter((row) => row.value)
          .map(({ label, value }) => (
            <div key={label} className="contents">
              <dt className="font-medium">{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
      </dl>

      <h2>Basic direction of the website</h2>
      <p>
        The website informs visitors about the Sniptide pastebin service and its open-source
        software, and links to the service itself.
      </p>

      <h2>Contact point under the Digital Services Act</h2>
      <p>
        Authorities of the EU member states, the European Commission and users of the service can
        reach us about the Digital Services Act at the email address above. To report a paste,
        follow the steps in the <a href="/terms#reporting">terms of service</a>.
      </p>

      <h2>Open source</h2>
      <p>
        The Sniptide software is licensed under the AGPL-3.0. The source code is available at{" "}
        <a href="https://github.com/Dino-Kupinic/sniptide">github.com/Dino-Kupinic/sniptide</a>.
      </p>
    </LegalPage>
  )
}
