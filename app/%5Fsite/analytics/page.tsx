import type { Metadata } from "next"
import { AnalyticsPreferences } from "@/components/analytics-preferences"
import { LegalPage } from "@/components/legal-page"
import { app } from "@/lib/links"

export const metadata: Metadata = {
  title: "Analytics preference: Sniptide",
  robots: { index: false, follow: false },
}

export default function AnalyticsPreferencePage() {
  return (
    <LegalPage title="Analytics preference" updated={false}>
      <p>
        Exclude your own visits from Sniptide&apos;s visitor and usage counts. This page never sends
        analytics events.
      </p>
      <AnalyticsPreferences />
      <p>
        <a href={app("/_site/analytics")}>Set the preference for the app too.</a>
      </p>
    </LegalPage>
  )
}
