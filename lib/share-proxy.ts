// The app trusts these only together, after a constant-time check of the secret. A visitor's
// copies are never forwarded: the address comes from CLIENT_IP_HEADER instead.
const CLIENT_IP = "x-sniptide-client-ip"
const PROXY_SECRET = "x-sniptide-proxy-secret"
const FORWARDED_FOR = "x-forwarded-for"

// Sections next.config.ts redirects to the app. They are not paste slugs, so /sign-in/reveal
// stays a redirect rather than a burn-after-read response.
const REDIRECTED_SECTIONS = new Set([
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
])

// Link-preview fetchers. A hit from one of these on /<slug>/reveal must be answered here.
const PREVIEW_BOT = new RegExp(
  [
    "applebot",
    "bingpreview",
    "bitlybot",
    "discordbot",
    "embedly",
    "facebookcatalog",
    "facebookexternalhit",
    "facebot",
    "google-pagerenderer",
    "iframely",
    "linkedinbot",
    "micromessenger",
    "pinterestbot",
    "quora link preview",
    "redditbot",
    "skypeuripreview",
    "slack-imgproxy",
    "slackbot",
    "telegrambot",
    "tumblr",
    "twitterbot",
    "vkshare",
    "whatsapp",
  ].join("|"),
  "i",
)

// Indexed so the value is read when the request arrives. A static process.env.NAME lookup can be
// frozen at `next build`.
function envValue(name: string) {
  const value = process.env[name]
  return value ? value : undefined
}

export function configuredIpHeader() {
  return envValue("CLIENT_IP_HEADER")?.trim() || FORWARDED_FOR
}

// The visitor address to forward, or null when the chosen header is missing. The default header
// is X-Forwarded-For, and only its last hop is used: that is the address a reverse proxy appends,
// after any value the client sent. Any other header is taken whole.
export function visitorAddress(headers: Headers, headerName = configuredIpHeader()) {
  const name = headerName.trim().toLowerCase()
  if (name === CLIENT_IP || name === PROXY_SECRET) return null

  const raw = headers.get(name)
  if (raw == null) return null
  if (name === FORWARDED_FOR) {
    const hops = raw
      .split(",")
      .map((hop) => hop.trim())
      .filter(Boolean)
    return hops.at(-1) ?? null
  }
  const address = raw.trim()
  return address || null
}

// Headers for a request the rewrite will send to the app. Both trusted headers are set, or neither.
export function headersForUpstream(headers: Headers) {
  const upstream = new Headers(headers)
  upstream.delete(CLIENT_IP)
  upstream.delete(PROXY_SECRET)

  const secret = envValue("SHARE_PROXY_SECRET")
  const address = visitorAddress(headers)
  if (secret && address) {
    upstream.set(CLIENT_IP, address)
    upstream.set(PROXY_SECRET, secret)
  }
  return upstream
}

export function isPreviewBot(headers: Headers) {
  const agent = headers.get("user-agent")
  return agent != null && PREVIEW_BOT.test(agent)
}

export type RevealBlock = { status: 403 } | { status: 405 }

// Non-null when this site must answer /<slug>/reveal itself. Otherwise the POST is proxied, and
// that POST is what burns the paste.
export function revealBlock(
  pathname: string,
  method: string,
  headers: Headers,
): RevealBlock | null {
  if (!revealSlug(pathname)) return null
  if (isPreviewBot(headers)) return { status: 403 }
  if (method === "POST" && headers.get("sec-fetch-site")?.trim().toLowerCase() === "cross-site") {
    return { status: 403 }
  }
  if (method !== "POST") return { status: 405 }
  return null
}

function revealSlug(pathname: string) {
  const slug = /^\/([^/]+)\/reveal\/?$/.exec(pathname)?.[1]
  if (!slug || REDIRECTED_SECTIONS.has(slug.toLowerCase())) return null
  return slug
}
