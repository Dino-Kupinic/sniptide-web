import { ogContentType, ogSize, renderOgImage } from "@/lib/og"
import { heroTitle, siteTitle } from "@/lib/site"

export const alt = siteTitle
export const size = ogSize
export const contentType = ogContentType

export default function Image() {
  return renderOgImage({ title: heroTitle })
}
