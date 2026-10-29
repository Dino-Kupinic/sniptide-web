import type { NextConfig } from "next"
import { documentation } from "./lib/agent-docs"
import { appUrl } from "./lib/links"
import { posthogAssetsHost, posthogHost, posthogProxyPath } from "./lib/posthog"

// App pages: sniptide.com sends people to app.sniptide.com for these.
const appPages = [
  "sign-in",
  "sign-up",
  "dashboard",
  "new",
  "pastes",
  "settings",
  "shared",
  "starred",
  "trash",
  "collections",
].join("|")

const nextConfig: NextConfig = {
  // Self-contained server for the Docker image (.next/standalone).
  output: "standalone",
  // This site's own assets live under /_site, so /_next/* is free for the app's share pages
  // proxied below.
  assetPrefix: "/_site",
  // @sniptide/ui ships TypeScript source.
  transpilePackages: ["@sniptide/ui"],
  // PostHog's API paths end in a slash; redirecting them would break ingestion.
  skipTrailingSlashRedirect: true,

  async redirects() {
    return [
      { source: "/docs", destination: documentation.home.url, permanent: true },
      { source: "/docs/mcp", destination: documentation.mcp.url, permanent: true },
      { source: "/docs/auth", destination: documentation.oauth.url, permanent: true },
      {
        source: `/:page(${appPages})/:rest*`,
        destination: `${appUrl}/:page/:rest*`,
        permanent: true,
      },
      { source: "/api/auth/:rest*", destination: `${appUrl}/api/auth/:rest*`, permanent: true },
    ]
  },

  async rewrites() {
    return {
      // PostHog, proxied so ad blockers don't drop events (lib/posthog.ts).
      beforeFiles: [
        {
          source: `${posthogProxyPath}/static/:path*`,
          destination: `${posthogAssetsHost(posthogHost)}/static/:path*`,
        },
        { source: `${posthogProxyPath}/:path*`, destination: `${posthogHost}/:path*` },
      ],
      // Everything without a page here is a share link (sniptide.com/k7Qe2x, /k7Qe2x/raw,
      // /k7Qe2x/reveal) or one of its assets: the app serves it, while the address bar keeps
      // sniptide.com. proxy.ts answers non-POST, preview-bot, and cross-site requests on
      // /<slug>/reveal before this rewrite runs.
      fallback: [{ source: "/:path*", destination: `${appUrl}/:path*` }],
    }
  },
}

export default nextConfig
