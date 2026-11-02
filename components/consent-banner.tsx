"use client"

import { cn } from "@sniptide/ui/lib/utils"
import { useEffect, useRef, useState } from "react"
import { isAnalyticsExcluded } from "@/lib/analytics-preference"
import {
  type ConsentChoice,
  onConsentSettingsOpen,
  openConsentSettings,
  readConsent,
  writeConsent,
} from "@/lib/consent"
import { posthogKey } from "@/lib/posthog"
import { track } from "@/lib/tracking"

const button =
  "raised-button flex h-10 flex-1 items-center justify-center px-4 text-sm leading-5 font-medium sm:h-9"

// Asks once per six months whether PostHog may use cookies (lib/tracking.ts). Reject and Accept
// share one size and one row. The banner never blocks the page, and without a PostHog key there is
// nothing to ask about, so it stays hidden.
export function ConsentBanner() {
  const [open, setOpen] = useState(false)
  const shownFrom = useRef<string | null>(null)

  useEffect(() => {
    if (!posthogKey || isAnalyticsExcluded()) return
    const show = (trigger: string) => {
      shownFrom.current = trigger
      setOpen(true)
      track("consent_banner_shown", { trigger })
    }
    if (readConsent() === "pending") show("first_visit")
    return onConsentSettingsOpen(() => show("settings"))
  }, [])

  function choose(choice: ConsentChoice) {
    writeConsent(choice)
    track("consent_updated", { status: choice, source: shownFrom.current ?? "first_visit" })
    setOpen(false)
  }

  if (!open) return null

  return (
    <section
      aria-label="Cookie consent"
      className={cn(
        "fixed inset-x-4 bottom-4 z-40 flex flex-col gap-4 rounded-lg border border-border bg-popover p-4 text-popover-foreground shadow-(--float-shadow)",
        "sm:inset-x-auto sm:bottom-6 sm:left-6 sm:w-100",
        "motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-2 motion-safe:duration-200",
      )}
    >
      <p className="text-sm leading-5">
        We count visits without cookies. If you accept, we also use cookies and session replays to
        see which parts of this site lead people to sign up. We never use them for ads. Read the{" "}
        <a
          href="/privacy#cookies"
          className="text-[#2a26ec] underline underline-offset-2 hover:no-underline dark:text-[#8f8cff]"
        >
          privacy policy
        </a>
        .
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => choose("denied")}
          className={cn(
            button,
            "bg-secondary text-secondary-foreground [--button-depth:#d0d0d0] hover:bg-[#e8e8e8] dark:[--button-depth:#383838] dark:hover:bg-[#2a2a2a]",
          )}
        >
          Reject
        </button>
        <button
          type="button"
          onClick={() => choose("granted")}
          className={cn(button, "bg-primary text-primary-foreground hover:bg-[#3a36ff]")}
        >
          Accept
        </button>
      </div>
    </section>
  )
}

// Reopens the banner, for the footer and the privacy policy.
export function ConsentSettingsButton({
  className,
  children = "Cookies",
}: {
  className?: string
  children?: React.ReactNode
}) {
  return (
    <button type="button" onClick={openConsentSettings} className={cn("cursor-pointer", className)}>
      {children}
    </button>
  )
}
