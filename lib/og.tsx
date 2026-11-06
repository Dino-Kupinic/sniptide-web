import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { ImageResponse } from "next/og"
import { bars, wordmark } from "@/components/brand"
import { siteName } from "@/lib/site"

export const ogSize = { width: 1200, height: 630 }
export const ogContentType = "image/png"

// The logo card from the Paper file (Brand, "OG v3 · Main"): the white logo, large, in the middle of
// a black field. The page title and description travel in the preview text, so the card carries
// only the logo.
const background = "#000000"
const white = "#ffffff"

// The 1200 by 630 card for links shared on X, Slack, Discord and the like. It is rendered once at
// build time.
export function renderOgImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 30 }}>
        <svg width={112} height={109} viewBox="2 2 20 19.27" role="img" aria-label={siteName}>
          <g fill={white}>
            {bars.map((points) => (
              <polygon key={points} points={points} />
            ))}
          </g>
        </svg>
        <svg width={503} height={79} viewBox="1341 238 4340 683" role="img" aria-label={siteName}>
          <g transform="translate(0,1080) scale(0.1,-0.1)" fill={white}>
            <path d={wordmark} />
          </g>
        </svg>
      </div>
    </div>,
    ogSize,
  )
}

// The card for a blog post: the logo card's black field and white logo, smaller in the top left,
// with the post title in Archivo below it, so a shared post says what it is about. Rendered once
// per post at build time.
export async function renderPostOgImage({ title }: { title: string }) {
  const heading = await readFile(join(process.cwd(), "assets/fonts/Archivo-500.woff"))

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        background,
        color: white,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <svg width={41} height={40} viewBox="2 2 20 19.27" role="img" aria-label={siteName}>
          <g fill={white}>
            {bars.map((points) => (
              <polygon key={points} points={points} />
            ))}
          </g>
        </svg>
        <svg width={184} height={29} viewBox="1341 238 4340 683" role="img" aria-label={siteName}>
          <g transform="translate(0,1080) scale(0.1,-0.1)" fill={white}>
            <path d={wordmark} />
          </g>
        </svg>
      </div>
      <div
        style={{
          display: "flex",
          fontFamily: "Archivo",
          // One size for every post: titles up to 70 characters take three lines at most.
          fontSize: 76,
          lineHeight: 1.04,
          letterSpacing: -2.5,
          maxWidth: 1000,
        }}
      >
        {title}
      </div>
    </div>,
    { ...ogSize, fonts: [{ name: "Archivo", data: heading, style: "normal", weight: 500 }] },
  )
}
