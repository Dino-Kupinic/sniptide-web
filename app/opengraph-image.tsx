import { ogContentType, ogSize, renderOgImage } from "@/lib/og"
import { heroSummary } from "@/lib/site"

export const alt = "Sniptide: the pastebin for modern teams"
export const size = ogSize
export const contentType = ogContentType

export default function Image() {
  return renderOgImage({ title: "The pastebin for modern teams.", summary: heroSummary })
}
