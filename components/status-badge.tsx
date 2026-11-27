"use client"

import { ArrowUpRightIcon } from "lucide-react"
import { useEffect, useState } from "react"
import type { AppStatus, StatusReport } from "@/lib/app-status"

const labels: Record<AppStatus, string> = {
  operational: "All systems operational",
  degraded: "Some systems are degraded",
  outage: "Some systems are down",
  maintenance: "Maintenance in progress",
}

const pill =
  "inline-flex h-8 items-center gap-2 rounded-md border border-[#e8e8e8] px-3 text-[13px] leading-[18px] motion-safe:animate-in motion-safe:fade-in-0 dark:border-[#262626]"

// The app's health as one line under the footer text. It stays empty until the check answers, and
// stays empty when the check fails, so it never claims a state it did not see. With a status page
// configured, the line reads that page's state and links to it.
export function StatusBadge() {
  const [report, setReport] = useState<StatusReport | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    fetch("/api/status", { signal: controller.signal })
      .then((response) => response.json())
      .then((data: Partial<StatusReport>) =>
        setReport({ status: data.status ?? null, url: data.url ?? null }),
      )
      .catch(() => setReport(null))
    return () => controller.abort()
  }, [])

  const status = report?.status
  const content = status && (
    <>
      <span
        aria-hidden="true"
        className={
          status === "operational"
            ? "size-2 bg-[#047857] dark:bg-[#5fd3a8]"
            : "size-2 bg-[#b45309] dark:bg-[#f5b971]"
        }
      />
      {labels[status]}
    </>
  )

  return (
    <p role="status" className="h-8">
      {content &&
        (report.url ? (
          <a
            href={report.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`${pill} transition-colors hover:bg-[#f4f4f4] focus-visible:ring-2 focus-visible:ring-[#2a26ec]/40 focus-visible:outline-none dark:hover:bg-[#1a1919] dark:focus-visible:ring-[#8f8cff]/40`}
          >
            {content}
            <ArrowUpRightIcon aria-hidden="true" className="-mr-0.5 size-3.5 opacity-60" />
            <span className="sr-only">(status page, opens in a new tab)</span>
          </a>
        ) : (
          <span className={pill}>{content}</span>
        ))}
    </p>
  )
}
