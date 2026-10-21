import type { Metadata } from "next"
import { Archivo, Inter, JetBrains_Mono } from "next/font/google"

import "./globals.css"
import { cn } from "@sniptide/ui/lib/utils"

const fontHeading = Archivo({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-heading",
})

// Body text matches the app, so the site and the dashboard read the same.
const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "Sniptide: the pastebin for modern teams",
  description: "Beautiful by default, self-hostable by design, and open to all.",
  // Icons and the web manifest are the files in app/ and public/ from RealFaviconGenerator.
  appleWebApp: { title: "Sniptide" },
}

// The page follows the visitor's color scheme. Set the class before first paint so dark visitors
// never see a light flash, and keep it in sync if the system setting changes.
const themeScript = `(() => {
  const query = matchMedia("(prefers-color-scheme: dark)")
  const apply = () => document.documentElement.classList.toggle("dark", query.matches)
  apply()
  query.addEventListener("change", apply)
})()`

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      // The theme script adds the dark class before React hydrates.
      suppressHydrationWarning
      className={cn(
        "antialiased font-sans",
        fontSans.variable,
        fontMono.variable,
        fontHeading.variable,
      )}
    >
      <head>
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static inline script, no input. */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  )
}
