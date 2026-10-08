// The app lives on the same domain in production (sniptide.com routes "/" here, everything else to
// the app). In development set NEXT_PUBLIC_APP_URL=http://localhost:3000 to reach a local app.
const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? ""

export function app(path: string) {
  return `${appUrl}${path}`
}

export const links = {
  signIn: app("/sign-in"),
  signUp: app("/sign-up"),
  newPaste: app("/new"),
  dashboard: app("/dashboard"),
  importGist: app("/pastes"),
}
