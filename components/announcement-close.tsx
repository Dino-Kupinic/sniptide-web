"use client"

import { XIcon } from "lucide-react"

import { announcementStorageKey } from "@/lib/changelog"

// Remembers the closed release, so the bar stays away until a newer feature replaces it.
export function AnnouncementClose({ version }: { version: string }) {
  function close() {
    document.documentElement.dataset.dismissedAnnouncement = version
    try {
      localStorage.setItem(announcementStorageKey, version)
    } catch {
      // Without storage the bar closes for this page view only.
    }
  }
  return (
    <button
      type="button"
      onClick={close}
      aria-label="Close the announcement"
      className="absolute top-1/2 right-2 grid size-8 -translate-y-1/2 place-items-center rounded-md text-white/75 outline-none hover:bg-white/10 hover:text-white focus-visible:ring-2 focus-visible:ring-white/60 md:right-4"
    >
      <XIcon aria-hidden className="size-4" />
    </button>
  )
}
