import type { Metadata } from "next"
import { LegalPage } from "@/components/legal-page"

export const metadata: Metadata = {
  alternates: { canonical: "/vision" },
  title: "Vision",
  description: "Why Sniptide exists and where it is going.",
}

// Not written yet. The vision replaces this paragraph when it is ready.
export default function Page() {
  return (
    <LegalPage title="Vision" updated={false}>
      <p>
        We're writing down where Sniptide is going. Until then, the <a href="/about">about page</a>{" "}
        says what it does today.
      </p>
    </LegalPage>
  )
}
