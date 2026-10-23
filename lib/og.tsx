import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { ImageResponse } from "next/og"
import { bars, wordmark } from "@/components/brand"
import { siteName } from "@/lib/site"

export const ogSize = { width: 1200, height: 630 }
export const ogContentType = "image/png"

// The brand colors from the landing page: ink, graphite and the Tide blue of the logo mark.
const ink = "#0a0a0a"
const graphite = "#6b6b6b"
const blue = "#2a26ec"

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
        padding: "72px 80px",
        background: "#ffffff",
        color: ink,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <svg width={54} height={52} viewBox="2 2 20 19.27" role="img" aria-label={siteName}>
          <g fill={blue}>
            {bars.map((points) => (
              <polygon key={points} points={points} />
            ))}
          </g>
        </svg>
        <svg width={176} height={28} viewBox="1341 238 4340 683" role="img" aria-label={siteName}>
          <g transform="translate(0,1080) scale(0.1,-0.1)" fill={ink}>
            <path d={wordmark} />
          </g>
        </svg>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
        <div
          style={{
            fontFamily: "Archivo",
            fontSize: 104,
            lineHeight: 1,
            letterSpacing: -4,
            maxWidth: 980,
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontFamily: "Inter",
            fontSize: 34,
            lineHeight: 1.4,
            color: graphite,
            maxWidth: 900,
          }}
        >
          {summary}
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 14, height: 14, background: blue }} />
        <div style={{ fontFamily: "Inter", fontSize: 28, color: graphite }}>sniptide.com</div>
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
