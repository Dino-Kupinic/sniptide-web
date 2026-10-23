import { app } from "./links"

const SESSION_COOKIES = new Set(["better-auth.session_token", "__Secure-better-auth.session_token"])

// Cookie presence is only a hint: expired or revoked sessions must stay on marketing.
// Ask the app on the root page; /home never reads cookies or depends on the app.
export async function hasAppSession(cookies: { name: string; value: string }[]): Promise<boolean> {
  const cookie = cookies
    .filter(({ name, value }) => SESSION_COOKIES.has(name) && value)
    .map(({ name, value }) => `${name}=${encodeURIComponent(value)}`)
    .join("; ")
  if (!cookie) return false

  try {
    const response = await fetch(app("/api/auth/get-session"), {
      headers: { cookie },
      cache: "no-store",
      redirect: "error",
      signal: AbortSignal.timeout(3000),
    })
    if (!response.ok) return false

    const data = await response.json()
    return (
      typeof data?.user?.id === "string" &&
      data.user.id.length > 0 &&
      typeof data?.session?.expiresAt === "string" &&
      Date.parse(data.session.expiresAt) > Date.now()
    )
  } catch {
    // Marketing remains available if session validation is unavailable or times out.
    return false
  }
}
