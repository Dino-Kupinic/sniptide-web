import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { ImageResponse } from "next/og"
import { bars, wordmark } from "@/components/brand"
import { reflection, sun, water } from "@/lib/og-sun"
import { siteName } from "@/lib/site"

export const ogSize = { width: 1200, height: 630 }
export const ogContentType = "image/png"

// The setting sun card from the Paper file (Brand, "OG v2 · A1 · Setting sun"): the Tide blue field
// with the white logo, a white headline and a pink pixel sun over the water.
const blue = "#2a26ec"
const white = "#ffffff"
const pink = "#f6a9d3"
// A lighter Tide blue for the water, so it reads as a surface without competing with the sun.
const waterBlue = "#5c59f2"

async function font(file: string) {
  return readFile(join(process.cwd(), "assets/fonts", file))
}

// The 1200 by 630 card for links shared on X, Slack, Discord and the like: the logo and a headline
// set in the heading font of the landing page, beside the sun. The page description travels in the
// preview text, so the card leaves it out. The images are rendered once at build time.
export async function renderOgImage({ title }: { title: string }) {
  const heading = await font("Archivo-500.woff")

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 120,
        padding: 64,
        background: blue,
        color: white,
      }}
    >
      <svg
        width={ogSize.width}
        height={ogSize.height}
        viewBox={`0 0 ${ogSize.width} ${ogSize.height}`}
        shapeRendering="crispEdges"
        aria-hidden="true"
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        <path fill={pink} d={sun} />
        <path fill={waterBlue} d={water} />
        <path fill={pink} d={reflection} />
      </svg>

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

      <div
        style={{
          display: "flex",
          fontFamily: "Archivo",
          fontSize: 96,
          lineHeight: 0.96,
          letterSpacing: -3.5,
          // The headline stays left of the sun, so it breaks into two lines.
          width: 620,
        }}
      >
        {title}
      </div>
    </div>,
    {
      ...ogSize,
      fonts: [{ name: "Archivo", data: heading, style: "normal", weight: 500 }],
    },
  )
}
