import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  // Self-contained server for the Docker image (.next/standalone).
  output: "standalone",
  // sniptide.com serves this site at "/" and the app everywhere else (see README). The prefix keeps
  // this site's /_next assets apart from the app's.
  assetPrefix: "/_site",
  // @sniptide/ui ships TypeScript source.
  transpilePackages: ["@sniptide/ui"],
}

export default nextConfig
