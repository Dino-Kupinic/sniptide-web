import { links } from "@/lib/links"

// Which button was clicked: the destination says what it does, the closest section marked with
// data-cta-location says where it sits (header, hero, product, features, rules, analytics, raw-links,
// self-host, cta, footer).
export type CtaTarget =
  | "sign_up"
  | "sign_in"
  | "new_paste"
  | "dashboard"
  | "import_gist"
  | "collections"
  | "api_docs"
  | "github"
  | "docs"
  | "self_host"
  | "demo"
  | "anchor"

const targets: Record<string, CtaTarget> = {
  [links.signUp]: "sign_up",
  [links.signIn]: "sign_in",
  [links.newPaste]: "new_paste",
  [links.dashboard]: "dashboard",
  [links.importGist]: "import_gist",
  [links.collections]: "collections",
  [links.apiDocs]: "api_docs",
  [links.github]: "github",
  [links.docs]: "docs",
  [links.selfHost]: "self_host",
  [links.demo]: "demo",
}

// A bare "#" is a placeholder and is not reported. Links to other pages, like the legal pages, are
// not tracked as calls to action.
export function ctaTarget(href: string | null): CtaTarget | null {
  if (!href || href === "#") return null
  if (href.startsWith("#")) return "anchor"
  return targets[href] ?? null
}

export function ctaEvent(link: Element) {
  const target = ctaTarget(link.getAttribute("href"))
  const location = link.closest("[data-cta-location]")?.getAttribute("data-cta-location")
  return target && location ? { location, target } : null
}
