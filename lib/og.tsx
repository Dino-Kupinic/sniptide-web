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
