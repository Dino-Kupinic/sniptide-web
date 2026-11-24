// Relative, because next.config.ts loads this file too.
import { documentation } from "./agent-docs"
import { repoUrl } from "./site"

// The app runs on its own subdomain; sniptide.com is this site. For local development set
// NEXT_PUBLIC_APP_URL=http://localhost:3000 to reach a local app.
export const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://app.sniptide.com"

// The self-host installer, served from the app repo. sniptide.com/install.sh redirects here.
export const installScriptUrl =
  "https://raw.githubusercontent.com/Dino-Kupinic/sniptide/main/scripts/install.sh"

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
}

// Docs pages the landing sections link to next to the feature they explain.
const docsUrl = documentation.home.url
export const docsPages = {
  sharing: `${docsUrl}/core-concepts/sharing`,
  revisions: `${docsUrl}/core-concepts/revisions`,
  encryptedPastes: `${docsUrl}/core-concepts/encrypted-pastes`,
  analytics: `${docsUrl}/core-concepts/analytics`,
  importGist: `${docsUrl}/getting-started/import-gist`,
  sdks: `${docsUrl}/sdks`,
  envSync: `${documentation.cli.url}#sync-env-files`,
  vscodeExtension: `${docsUrl}/vscode-extension`,
  browserExtension: `${docsUrl}/browser-extension`,
  raycastExtension: `${docsUrl}/raycast-extension`,
  agentPlugin: `${documentation.mcp.url}#install-in-your-agent`,
}
