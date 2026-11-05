import { ImageResponse } from "next/og"
import { bars, wordmark } from "@/components/brand"
import { lifePaths } from "@/lib/og-life"
import { siteName } from "@/lib/site"

export const ogSize = { width: 1200, height: 630 }
export const ogContentType = "image/png"

// The Life card from the Paper file (Brand, "OG v3 · Main · Life"): the white logo in the middle of
// the dark hero black, with the Game of Life in Tide blue around it (lib/og-life.ts). The page
// title and description travel in the preview text, so the card carries only the logo.
const background = "#0c0b0b"
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
      <svg
        width={ogSize.width}
        height={ogSize.height}
        viewBox={`0 0 ${ogSize.width} ${ogSize.height}`}
        shapeRendering="crispEdges"
        aria-hidden="true"
        style={{ position: "absolute", top: 0, left: 0 }}
      >
        {lifePaths().map(({ color, opacity, d }) => (
          <path key={`${color} ${opacity}`} d={d} fill={color} fillOpacity={opacity} />
        ))}
      </svg>

      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <svg width={66} height={64} viewBox="2 2 20 19.27" role="img" aria-label={siteName}>
          <g fill={white}>
            {bars.map((points) => (
              <polygon key={points} points={points} />
            ))}
          </g>
        </svg>
        <svg width={296} height={46} viewBox="1341 238 4340 683" role="img" aria-label={siteName}>
          <g transform="translate(0,1080) scale(0.1,-0.1)" fill={white}>
            <path d={wordmark} />
          </g>
        </svg>
      </div>
    </div>,
    ogSize,
  )
}
