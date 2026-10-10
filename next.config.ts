import type { NextConfig } from "next"
import { appUrl } from "./lib/links"

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

  async redirects() {
    return [
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
      // Everything without a page here is a share link (sniptide.com/k7Qe2x, /k7Qe2x/raw,
      // /k7Qe2x/reveal) or one of its assets: the app serves it, while the address bar keeps
      // sniptide.com. proxy.ts answers non-POST, preview-bot, and cross-site requests on
      // /<slug>/reveal before this rewrite runs.
      fallback: [{ source: "/:path*", destination: `${appUrl}/:path*` }],
    }
  },
}

export default nextConfig
