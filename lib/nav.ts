import { links } from "./links"

export const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Compare", href: "#compare" },
  { label: "Self-host", href: "#self-host" },
  { label: "Docs", href: links.docs },
  { label: "GitHub", href: links.github },
]

// Section links point into the home page. On another page they go through its address, so
// "#features" becomes "/home#features".
export function navHref(href: string, home = "") {
  return href.startsWith("#") ? `${home}${href}` : href
}
