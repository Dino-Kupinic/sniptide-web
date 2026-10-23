import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { ImageResponse } from "next/og"
import { bars, wordmark } from "@/components/brand"
import { siteName } from "@/lib/site"

export const ogSize = { width: 1200, height: 630 }
export const ogContentType = "image/png"

// The campaign cards from the Paper file (Brand, "Marketing headers"): the Tide blue field with the
// white logo and a white headline.
const blue = "#2a26ec"
const white = "#ffffff"
// White at 78% on the blue keeps the summary secondary and still clears 4.5:1.
const muted = "rgba(255, 255, 255, 0.78)"

async function font(file: string) {
  return readFile(join(process.cwd(), "assets/fonts", file))
}

// The 1200 by 630 card for links shared on X, Slack, Discord and the like: the logo, a headline
// set in the heading font of the landing page, and one line under it. The images are rendered
// once at build time.
export async function renderOgImage({ title, summary }: { title: string; summary: string }) {
  const [heading, body] = await Promise.all([font("Archivo-500.woff"), font("Inter-400.woff")])

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 64,
        background: blue,
        color: white,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
        <svg width={33} height={32} viewBox="2 2 20 19.27" role="img" aria-label={siteName}>
          <g fill={white}>
            {bars.map((points) => (
              <polygon key={points} points={points} />
            ))}
          </g>
        </svg>
        <svg width={148} height={23} viewBox="1341 238 4340 683" role="img" aria-label={siteName}>
          <g transform="translate(0,1080) scale(0.1,-0.1)" fill={white}>
            <path d={wordmark} />
          </g>
        </svg>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
        <div
          style={{
            fontFamily: "Archivo",
            fontSize: 96,
            lineHeight: 0.96,
            letterSpacing: -3.5,
            maxWidth: 900,
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontFamily: "Inter",
            fontSize: 32,
            lineHeight: 1.4,
            color: muted,
            maxWidth: 900,
          }}
        >
          {summary}
        </div>
      </div>
    </div>,
    {
      ...ogSize,
      fonts: [
        { name: "Archivo", data: heading, style: "normal", weight: 500 },
        { name: "Inter", data: body, style: "normal", weight: 400 },
      ],
    },
  )
}
