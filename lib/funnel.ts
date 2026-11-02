// Pure helpers behind the funnel events in lib/tracking.ts, kept apart so they can be tested
// without a browser.

export const scrollMilestones = [25, 50, 75, 100] as const

// How far down the page the visitor has seen, as a whole percent of the scrollable height.
export function scrollPercent(scrollTop: number, viewportHeight: number, pageHeight: number) {
  const scrollable = pageHeight - viewportHeight
  if (scrollable <= 0) return 100
  return Math.min(100, Math.max(0, Math.round((scrollTop / scrollable) * 100)))
}

// The milestones a scroll position passes that haven't been reported yet.
export function newMilestones(percent: number, reported: ReadonlySet<number>) {
  return scrollMilestones.filter((milestone) => percent >= milestone && !reported.has(milestone))
}

// A section counts as seen once 40% of it is on screen, or, for a section taller than the screen,
// once it fills half of it.
export function isSectionSeen(
  visibleHeight: number,
  sectionHeight: number,
  viewportHeight: number,
) {
  if (sectionHeight <= 0) return false
  return visibleHeight / sectionHeight >= 0.4 || visibleHeight >= viewportHeight * 0.5
}

// A link that leaves sniptide.com and its subdomains. Calls to action (lib/cta.ts) are reported
// on their own, so this covers everything else, like the links in the "Works with" row.
export function outboundHost(href: string, currentHost: string) {
  try {
    const url = new URL(href, `https://${currentHost}`)
    if (url.protocol !== "http:" && url.protocol !== "https:") return null
    const host = url.hostname
    const site = currentHost.split(":")[0] ?? currentHost
    if (host === site || host === "sniptide.com" || host.endsWith(".sniptide.com")) return null
    return host
  } catch {
    return null
  }
}
