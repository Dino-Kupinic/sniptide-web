import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  // Self-contained server for the Docker image (.next/standalone).
  output: "standalone",
  // @sniptide/ui ships TypeScript source.
  transpilePackages: ["@sniptide/ui"],
}

export default nextConfig
