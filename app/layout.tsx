import type { Metadata } from "next"
import { Inter, JetBrains_Mono, Stack_Sans_Notch } from "next/font/google"

import "./globals.css"
import { cn } from "@sniptide/ui/lib/utils"

const fontHeading = Stack_Sans_Notch({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-heading",
})

const fontSans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const metadata: Metadata = {
  title: "Sniptide: short links for your code",
  description:
    "Paste code, choose when it expires, and share one link. Every paste shows how often it was opened.",
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={cn(
        "antialiased font-sans",
        fontSans.variable,
        fontMono.variable,
        fontHeading.variable,
      )}
    >
      <body>{children}</body>
    </html>
  )
}
