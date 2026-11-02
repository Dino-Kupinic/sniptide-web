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

const button =
  "raised-button flex h-10 items-center justify-center px-4 text-sm leading-5 font-medium whitespace-nowrap sm:h-9"
// The landing page's own palette, so the banner reads as part of the page.
const surface =
  "border border-[#e8e8e8] bg-white text-[#1b1919] dark:border-[#262626] dark:bg-[#111111] dark:text-[#f5f5f5]"
const muted = "text-[#6b6b6b] dark:text-[#9a9a9a]"
const primary = cn(button, "bg-[#2a26ec] text-white hover:bg-[#3a36ff]")
const secondary = cn(
  button,
  "bg-[#f2f2f2] text-[#0a0a0a] [--button-depth:#d0d0d0] hover:bg-[#e8e8e8] dark:bg-[#1c1c1c] dark:text-white dark:[--button-depth:#383838] dark:hover:bg-[#262626]",
)
const link =
  "text-[#2a26ec] underline underline-offset-2 hover:no-underline dark:text-[#8f8cff] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2a26ec] dark:focus-visible:outline-[#8f8cff]"

type Action = "accept_all" | "reject_all" | "save"
type Source = "banner" | "settings"

const categories: { id: ConsentCategory | "essential"; label: string; description: string }[] = [
  {
    id: "essential",
    label: "Essential",
    description: "Saves your cookie choice. Always on.",
  },
  {
    id: "analytics",
    label: "Analytics",
    description: "Shows us which pages lead people to sign up.",
  },
  {
    id: "replay",
    label: "Session replay",
    description:
      "Records clicks and scrolling so we can see where people get stuck. Needs analytics.",
  },
]

// Asks once per six months which kinds of cookies analytics may use (lib/tracking.ts). The banner
// offers Reject all and Accept all at the same size, and Settings opens a switch per category.
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
            "fixed inset-x-4 bottom-4 z-40 flex flex-col gap-4 rounded-lg p-4 shadow-(--float-shadow)",
            surface,
            "sm:inset-x-auto sm:bottom-6 sm:left-6 sm:w-100",
            "motion-safe:animate-in motion-safe:fade-in-0 motion-safe:slide-in-from-bottom-2 motion-safe:duration-200",
          )}
        >
          <p className="text-sm leading-5">
            We use cookies to improve Sniptide, never for ads.{" "}
            <a href="/privacy#cookies" className={link}>
              Privacy policy
            </a>
          </p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="flex flex-1 gap-2">
              <button
                type="button"
                onClick={() => choose(noConsent, "reject_all", "banner")}
                className={cn(secondary, "flex-1")}
              >
                Reject all
              </button>
              <button
                type="button"
                onClick={() => choose(fullConsent, "accept_all", "banner")}
                className={cn(primary, "flex-1")}
              >
                Accept all
              </button>
            </div>
            <button
              type="button"
              onClick={() => openSettings("banner")}
              className="h-10 rounded-lg px-3 text-sm leading-5 font-medium hover:bg-[#f4f4f4] sm:h-9 dark:hover:bg-[#1c1c1c] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2a26ec] dark:focus-visible:outline-[#8f8cff]"
            >
              Settings
            </button>
          </div>
        </section>
      )}

      <Dialog.Root open={settings} onOpenChange={setSettings}>
        <Dialog.Portal>
          <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/20 transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0 motion-reduce:transition-none dark:bg-black/60" />
          <Dialog.Popup
            className={cn(
              "fixed top-1/2 left-1/2 z-50 flex max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 flex-col gap-4 overflow-y-auto rounded-lg p-6 shadow-(--dialog-shadow) outline-none",
              surface,
              "transition-[scale,opacity] duration-150 data-ending-style:scale-[0.98] data-ending-style:opacity-0 data-starting-style:scale-[0.98] data-starting-style:opacity-0 motion-reduce:transition-none",
            )}
          >
            <Dialog.Title className="font-heading text-xl leading-7 font-medium tracking-[-0.02em]">
              Cookie settings
            </Dialog.Title>
            <Dialog.Description className={cn("text-sm leading-5", muted)}>
              Choose which cookies we may use. You can change this anytime in the footer.
            </Dialog.Description>

            <ul className="flex shrink-0 flex-col divide-y divide-[#e8e8e8] overflow-hidden rounded-lg border border-[#e8e8e8] dark:divide-[#262626] dark:border-[#262626]">
              {categories.map((category) => (
                <CategoryRow
                  key={category.id}
                  label={category.label}
                  description={category.description}
                  checked={category.id === "essential" ? true : draft[category.id]}
                  disabled={category.id === "essential"}
                  onChange={(on) => category.id !== "essential" && toggle(category.id, on)}
                />
              ))}
            </ul>

            <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:items-center">
              <div className="flex flex-1 gap-2">
                <button
                  type="button"
                  onClick={() => choose(noConsent, "reject_all", settingsSource.current)}
                  className={cn(secondary, "flex-1 sm:flex-none")}
                >
                  Reject all
                </button>
                <button
                  type="button"
                  onClick={() => choose(fullConsent, "accept_all", settingsSource.current)}
                  className={cn(secondary, "flex-1 sm:flex-none")}
                >
                  Accept all
                </button>
              </div>
              <button
                type="button"
                onClick={() => choose(draft, "save", settingsSource.current)}
                className={primary}
              >
                Save choices
              </button>
            </div>

            <a href="/privacy#cookies" className={cn(link, "self-start text-sm leading-5")}>
              Privacy policy
            </a>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  )
}

function CategoryRow({
  label,
  description,
  checked,
  disabled,
  onChange,
}: {
  label: string
  description: string
  checked: boolean
  disabled: boolean
  onChange: (on: boolean) => void
}) {
  const id = useId()
  return (
    <li className="flex items-start gap-4 p-4">
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <label htmlFor={id} className="text-sm leading-5 font-medium">
          {label}
        </label>
        <p id={`${id}-description`} className={cn("text-sm leading-5", muted)}>
          {description}
        </p>
      </div>
      <Switch
        id={id}
        checked={checked}
        disabled={disabled}
        onCheckedChange={onChange}
        aria-describedby={`${id}-description`}
        className="mt-0.5 rounded-sm bg-[#e8e8e8] disabled:opacity-60 data-checked:bg-[#2a26ec] dark:bg-[#2a2a2a] dark:data-checked:bg-[#2a26ec]"
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
