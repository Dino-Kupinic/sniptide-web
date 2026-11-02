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

// The site's raised buttons (app/globals.css): Deny and Accept all match Sign in, and the settings
// and Save buttons match Get started. Colors are the landing page's own.
const surface =
  "border border-[#e8e8e8] bg-white text-[#1b1919] dark:border-[#262626] dark:bg-[#0c0b0b] dark:text-[#f5f5f5]"
const muted = "text-[#6b6b6b] dark:text-[#9a9a9a]"
const focus =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2a26ec] dark:focus-visible:outline-[#8f8cff]"
const button =
  "raised-button flex h-9 cursor-pointer items-center justify-center border px-3.5 text-sm leading-5 font-semibold whitespace-nowrap"
const outline = cn(
  button,
  "border-[#d8d8d8] bg-white text-[#0a0a0a] [--button-depth:#d0d0d0] hover:bg-[#f7f7f7] dark:border-[#333333] dark:bg-[#111111] dark:text-white dark:[--button-depth:#383838] dark:hover:bg-[#1c1c1c]",
)
const primary = cn(
  button,
  "border-[#2a26ec] bg-[#2a26ec] text-white hover:border-[#3a36ff] hover:bg-[#3a36ff]",
)
const link = cn("font-medium underline-offset-2 hover:underline", focus)
const bannerText =
  "We use tracking technologies to improve this site. You can opt in or out at any time."
const settingsText =
  "Choose which tracking technologies this site may use. You can change this later from the footer."

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
            "fixed inset-x-4 bottom-4 z-40 flex flex-col gap-3.5 rounded-lg p-4 shadow-(--float-shadow)",
            "sm:inset-x-auto sm:bottom-6 sm:left-6 sm:w-104",
            "motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-2 motion-safe:duration-200",
            surface,
          )}
        >
          <p className="text-sm leading-5">{bannerText}</p>
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
              className={cn(primary, "w-full sm:ml-auto sm:w-auto")}
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
              "fixed top-1/2 left-1/2 z-50 flex max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 flex-col overflow-y-auto rounded-lg shadow-(--dialog-shadow) outline-none",
              "transition-[scale,opacity] duration-150 data-ending-style:scale-[0.98] data-ending-style:opacity-0 data-starting-style:scale-[0.98] data-starting-style:opacity-0 motion-reduce:transition-none",
              surface,
            )}
          >
            <div className="flex flex-col gap-3 p-5 pb-6">
              <Dialog.Title className="font-heading text-xl leading-7 font-bold tracking-[-0.02em]">
                Your privacy
              </Dialog.Title>
              <Dialog.Description className={cn("text-sm leading-5", muted)}>
                {settingsText}
              </Dialog.Description>
              <ul className="mt-1 flex shrink-0 flex-col divide-y divide-[#e8e8e8] overflow-hidden rounded-lg border border-[#e8e8e8] dark:divide-[#262626] dark:border-[#262626]">
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

            <div className="flex flex-col gap-3.5 border-t border-[#e8e8e8] bg-[#fafafa] p-5 dark:border-[#262626] dark:bg-[#111111]">
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
                  className={cn(primary, "w-full sm:ml-auto sm:w-auto")}
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
    <li className="flex h-12 items-center justify-between gap-4 px-3.5">
      <label htmlFor={id} className="text-sm leading-5 font-medium">
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
