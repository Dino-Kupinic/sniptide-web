"use client"

import { useEffect, useState } from "react"
import type { AppStatus } from "@/lib/app-status"

const labels: Record<AppStatus, string> = {
  operational: "All systems operational",
  degraded: "The app is not responding",
}

// The app's health as one line under the footer text. It stays empty until the check answers, and
// stays empty when the check fails, so it never claims a state it did not see.
export function StatusBadge() {
  const [status, setStatus] = useState<AppStatus | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    fetch("/api/status", { signal: controller.signal })
      .then((response) => response.json())
      .then((data: { status?: AppStatus | null }) => setStatus(data.status ?? null))
      .catch(() => setStatus(null))
    return () => controller.abort()
  }, [])

  return (
    <p role="status" className="h-8">
      {status && (
        <span className="inline-flex h-8 items-center gap-2 rounded-md border border-[#e8e8e8] px-3 text-[13px] leading-[18px] motion-safe:animate-in motion-safe:fade-in-0 dark:border-[#262626]">
          <span
            aria-hidden="true"
            className={
              status === "operational"
                ? "size-2 bg-[#047857] dark:bg-[#5fd3a8]"
                : "size-2 bg-[#b45309] dark:bg-[#f5b971]"
            }
          />
          {labels[status]}
        </span>
      )}
    </p>
  )
}
