"use client"

import { useEffect } from "react"
import { watchPage } from "@/lib/tracking"

// Reports which landing sections a visitor sees and how far they scroll (lib/tracking.ts).
export function FunnelTracking() {
  useEffect(() => watchPage(), [])
  return null
}
