"use client"

import { Dialog } from "@base-ui/react/dialog"
import { Switch } from "@sniptide/ui/components/switch"
import { cn } from "@sniptide/ui/lib/utils"
import { useCallback, useEffect, useId, useRef, useState } from "react"
import { isAnalyticsExcluded } from "@/lib/analytics-preference"
import {
  type Consent,
  type ConsentCategory,
  fullConsent,
  noConsent,
  normalizeConsent,
  onConsentSettingsOpen,
  openConsentSettings,
  readConsent,
  writeConsent,
} from "@/lib/consent"
import { posthogKey } from "@/lib/posthog"
import { track } from "@/lib/tracking"

// Laid out like a classic consent banner: equal outline buttons to deny or accept, and the
// settings in an inverted button. Colors are the landing page's own.
const surface =
  "border border-[#e8e8e8] bg-white text-[#1b1919] dark:border-[#262626] dark:bg-[#0c0b0b] dark:text-[#f5f5f5]"
const muted = "text-[#6b6b6b] dark:text-[#9a9a9a]"
const focus =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2a26ec] dark:focus-visible:outline-[#8f8cff]"
const button = cn(
  "flex h-10 items-center justify-center rounded-lg px-4 text-sm leading-5 font-medium whitespace-nowrap transition-colors active:translate-y-px",
  focus,
)
const outline = cn(
  button,
  "border border-[#d6d6d6] hover:bg-[#f4f4f4] dark:border-[#333333] dark:hover:bg-[#1c1c1c]",
)
const inverted = cn(
  button,
  "bg-[#0a0a0a] text-white hover:bg-[#0a0a0a]/85 dark:bg-[#f4f4f4] dark:text-[#0a0a0a] dark:hover:bg-[#f4f4f4]/85",
)
const link = cn("font-medium underline-offset-2 hover:underline", focus)
const intro =
  "This site uses tracking technologies. You may opt in or opt out of the use of these technologies."

type Action = "accept_all" | "reject_all" | "save"
type Source = "banner" | "settings"

const categories: { id: ConsentCategory | "essential"; label: string }[] = [
  { id: "essential", label: "Essential" },
  { id: "analytics", label: "Analytics" },
  { id: "replay", label: "Session replay" },
]

// Asks once per six months which kinds of cookies analytics may use (lib/tracking.ts). The banner
// offers Deny and Accept all at the same size, and Consent settings opens a switch per category.
// Neither blocks the page. Without a PostHog key there is nothing to ask about, so both stay hidden.
export function ConsentBanner() {
  const [banner, setBanner] = useState(false)
  const [settings, setSettings] = useState(false)
  const [draft, setDraft] = useState<Consent>(noConsent)
  const settingsSource = useRef<Source>("banner")

  const openSettings = useCallback((from: Source) => {
    settingsSource.current = from
    setDraft(readConsent() ?? noConsent)
    setSettings(true)
    track("consent_banner_shown", { trigger: from === "banner" ? "banner_settings" : "settings" })
  }, [])

  useEffect(() => {
    if (!posthogKey || isAnalyticsExcluded()) return
    if (readConsent() === null) {
      setBanner(true)
      track("consent_banner_shown", { trigger: "first_visit" })
    }
    return onConsentSettingsOpen(() => openSettings("settings"))
  }, [openSettings])

  function choose(consent: Consent, action: Action, source: Source) {
    const next = normalizeConsent(consent)
    writeConsent(next)
    track("consent_updated", { action, source, ...next })
    setBanner(false)
    setSettings(false)
  }

  function toggle(category: ConsentCategory, on: boolean) {
    setDraft((current) => {
      if (category === "analytics") return normalizeConsent({ ...current, analytics: on })
      // Turning replay on turns analytics on, since replay needs it.
      return { analytics: current.analytics || on, replay: on }
    })
  }

  return (
    <>
      {banner && !settings && (
        <section
          aria-label="Cookie consent"
          className={cn(
            "fixed inset-x-4 bottom-4 z-40 flex flex-col gap-5 rounded-lg p-5 shadow-(--float-shadow)",
            "sm:inset-x-auto sm:bottom-6 sm:left-6 sm:w-112",
            "motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-2 motion-safe:duration-200",
            surface,
          )}
        >
          <p className="text-[15px] leading-6">{intro}</p>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => choose(noConsent, "reject_all", "banner")}
              className={cn(outline, "flex-1 sm:flex-none")}
            >
              Deny
            </button>
            <button
              type="button"
              onClick={() => choose(fullConsent, "accept_all", "banner")}
              className={cn(outline, "flex-1 sm:flex-none")}
            >
              Accept all
            </button>
            <button
              type="button"
              onClick={() => openSettings("banner")}
              className={cn(inverted, "w-full sm:ml-auto sm:w-auto")}
            >
              Consent settings
            </button>
          </div>
        </section>
      )}

      <Dialog.Root open={settings} onOpenChange={setSettings}>
        <Dialog.Portal>
          <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/20 transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0 motion-reduce:transition-none dark:bg-black/60" />
          <Dialog.Popup
            className={cn(
              "fixed top-1/2 left-1/2 z-50 flex max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 -translate-y-1/2 flex-col overflow-y-auto rounded-lg shadow-(--dialog-shadow) outline-none",
              "transition-[scale,opacity] duration-150 data-ending-style:scale-[0.98] data-ending-style:opacity-0 data-starting-style:scale-[0.98] data-starting-style:opacity-0 motion-reduce:transition-none",
              surface,
            )}
          >
            <div className="flex flex-col gap-4 p-6 pb-8">
              <Dialog.Title className="font-heading text-2xl leading-8 font-medium tracking-[-0.02em]">
                Your privacy
              </Dialog.Title>
              <Dialog.Description className="text-[15px] leading-6">{intro}</Dialog.Description>
              <ul className="mt-2 flex shrink-0 flex-col divide-y divide-[#e8e8e8] overflow-hidden rounded-lg border border-[#e8e8e8] dark:divide-[#262626] dark:border-[#262626]">
                {categories.map((category) => (
                  <CategoryRow
                    key={category.id}
                    label={category.label}
                    checked={category.id === "essential" ? true : draft[category.id]}
                    disabled={category.id === "essential"}
                    onChange={(on) => category.id !== "essential" && toggle(category.id, on)}
                  />
                ))}
              </ul>
            </div>

            <div className="flex flex-col gap-4 border-t border-[#e8e8e8] bg-[#fafafa] p-6 dark:border-[#262626] dark:bg-[#111111]">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => choose(noConsent, "reject_all", settingsSource.current)}
                  className={cn(outline, "flex-1 sm:flex-none")}
                >
                  Deny
                </button>
                <button
                  type="button"
                  onClick={() => choose(fullConsent, "accept_all", settingsSource.current)}
                  className={cn(outline, "flex-1 sm:flex-none")}
                >
                  Accept all
                </button>
                <button
                  type="button"
                  onClick={() => choose(draft, "save", settingsSource.current)}
                  className={cn(inverted, "w-full sm:ml-auto sm:w-auto")}
                >
                  Save
                </button>
              </div>
              <p className={cn("text-sm leading-5", muted)}>
                Read how we handle your data in our{" "}
                <a
                  href="/privacy#cookies"
                  className={cn(link, "text-[#1b1919] dark:text-[#f5f5f5]")}
                >
                  privacy policy
                </a>
                .
              </p>
            </div>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  )
}

function CategoryRow({
  label,
  checked,
  disabled,
  onChange,
}: {
  label: string
  checked: boolean
  disabled: boolean
  onChange: (on: boolean) => void
}) {
  const id = useId()
  return (
    <li className="flex h-14 items-center justify-between gap-4 px-4">
      <label htmlFor={id} className="text-[15px] leading-6 font-medium">
        {label}
      </label>
      <Switch
        id={id}
        checked={checked}
        disabled={disabled}
        onCheckedChange={onChange}
        className="rounded-sm bg-[#e8e8e8] disabled:opacity-60 data-checked:bg-[#2a26ec] dark:bg-[#2a2a2a] dark:data-checked:bg-[#2a26ec]"
      />
    </li>
  )
}

// Opens the cookie settings, for the footer and the privacy policy.
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
