import { startTracking } from "@/lib/tracking"

// PostHog starts on every page, cookieless until the visitor accepts the banner (lib/tracking.ts).
startTracking()
