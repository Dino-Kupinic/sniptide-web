import type { Metadata } from "next"
import { Archivo, Inter } from "next/font/google"
import localFont from "next/font/local"

import "./globals.css"
import { cn } from "@sniptide/ui/lib/utils"
import { ogVideo, siteDescription, siteName, siteTitle, siteUrl } from "@/lib/site"

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

const fontMono = localFont({
  src: "../assets/fonts/PaperMono[wght].ttf",
  weight: "100 800",
  variable: "--font-mono",
})

// Every page inherits these. Pages set their own title, description and canonical path in their
// own metadata, and Next copies a page's title and description into its Open Graph and Twitter
// tags, so those are left out here (a title set here would replace every page's). The images are app/opengraph-image.tsx and
// app/twitter-image.tsx, which Next adds to every page's tags.
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: siteTitle, template: `%s · ${siteName}` },
  description: siteDescription,
  applicationName: siteName,
  openGraph: {
    type: "website",
    siteName,
    locale: "en_US",
    videos: [ogVideo],
  },
  twitter: { card: "summary_large_image" },
  // Icons and the web manifest are the files in app/ and public/ from RealFaviconGenerator.
  appleWebApp: { title: siteName },
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
