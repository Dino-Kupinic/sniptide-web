// Relative, because next.config.ts loads this file too.
import { documentation } from "./agent-docs"
import { repoUrl } from "./site"

// The app runs on its own subdomain; sniptide.com is this site. For local development set
// NEXT_PUBLIC_APP_URL=http://localhost:3000 to reach a local app.
export const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://app.sniptide.com"

// The public demo instance (DEMO_MODE in the app), where /demo signs visitors in as a guest.
export const demoUrl = process.env.NEXT_PUBLIC_DEMO_URL ?? "https://demo.sniptide.com/demo"

export function app(path: string) {
  return `${appUrl}${path}`
}

export const links = {
  signIn: app("/sign-in"),
  signUp: app("/sign-up"),
  newPaste: app("/new"),
  dashboard: app("/dashboard"),
  importGist: app("/pastes"),
  collections: app("/collections"),
  apiDocs: app("/docs/api"),
  github: repoUrl,
  docs: documentation.home.url,
  selfHost: documentation.selfHosting.url,
  demo: demoUrl,
}
