/// <reference types="bun-types" />
import { describe, expect, test } from "bun:test"
import { NextRequest } from "next/server"
import { headersForUpstream, isPreviewBot, revealBlock, visitorAddress } from "@/lib/share-proxy"
import { proxy } from "@/proxy"

const SECRET = "share-secret"
const SPOOFED = {
  "x-sniptide-client-ip": "9.9.9.9",
  "x-sniptide-proxy-secret": "stolen",
}

function withEnv(values: Record<string, string | undefined>, run: () => void) {
  const previous = new Map<string, string | undefined>()
  for (const [key, value] of Object.entries(values)) {
    previous.set(key, process.env[key])
    if (value === undefined) delete process.env[key]
    else process.env[key] = value
  }
  try {
    run()
  } finally {
    for (const [key, value] of previous) {
      if (value === undefined) delete process.env[key]
      else process.env[key] = value
    }
  }
}

function request(path: string, method = "GET", headers?: HeadersInit) {
  return new NextRequest(`https://sniptide.com${path}`, { method, headers })
}

function upstream(response: Response) {
  const listed = response.headers.get("x-middleware-override-headers")
  const names = new Set(
    (listed ?? "")
      .split(",")
      .map((name) => name.trim())
      .filter(Boolean),
  )
  const get = (name: string) =>
    names.has(name) ? response.headers.get(`x-middleware-request-${name}`) : null
  return {
    continued: response.headers.get("x-middleware-next") === "1",
    clientIp: get("x-sniptide-client-ip"),
    secret: get("x-sniptide-proxy-secret"),
  }
}

describe("visitor address", () => {
  test("uses the last X-Forwarded-For hop by default", () => {
    withEnv({ CLIENT_IP_HEADER: undefined }, () => {
      const headers = new Headers({ "x-forwarded-for": "198.51.100.1, 203.0.113.9, 192.0.2.8" })
      expect(visitorAddress(headers)).toBe("192.0.2.8")
    })
  })

  test("keeps a single hop and an IPv6 hop", () => {
    withEnv({ CLIENT_IP_HEADER: undefined }, () => {
      expect(visitorAddress(new Headers({ "x-forwarded-for": "203.0.113.9" }))).toBe("203.0.113.9")
      expect(visitorAddress(new Headers({ "x-forwarded-for": "203.0.113.9, 2001:db8::10" }))).toBe(
        "2001:db8::10",
      )
    })
  })

  test("ignores blank hops and a missing header", () => {
    withEnv({ CLIENT_IP_HEADER: undefined }, () => {
      expect(visitorAddress(new Headers({ "x-forwarded-for": "203.0.113.9, " }))).toBe(
        "203.0.113.9",
      )
      expect(visitorAddress(new Headers({ "x-forwarded-for": " , " }))).toBeNull()
      expect(visitorAddress(new Headers())).toBeNull()
    })
  })

  test("reads CLIENT_IP_HEADER whole and does not fall back", () => {
    withEnv({ CLIENT_IP_HEADER: "x-real-ip" }, () => {
      const headers = new Headers({
        "x-real-ip": "203.0.113.7, 198.51.100.2",
        "x-forwarded-for": "192.0.2.8",
      })
      expect(visitorAddress(headers)).toBe("203.0.113.7, 198.51.100.2")
      expect(visitorAddress(new Headers({ "x-forwarded-for": "192.0.2.8" }))).toBeNull()
    })
  })

  test("treats an explicit X-Forwarded-For setting as the last hop", () => {
    withEnv({ CLIENT_IP_HEADER: " X-Forwarded-For " }, () => {
      expect(visitorAddress(new Headers({ "x-forwarded-for": "198.51.100.1, 203.0.113.9" }))).toBe(
        "203.0.113.9",
      )
    })
  })

  test("never takes the address from the headers this site adds", () => {
    withEnv({ CLIENT_IP_HEADER: "x-sniptide-client-ip" }, () => {
      expect(visitorAddress(new Headers(SPOOFED))).toBeNull()
    })
  })
})

describe("upstream headers", () => {
  test("sends the address and the secret together", () => {
    withEnv({ SHARE_PROXY_SECRET: SECRET, CLIENT_IP_HEADER: undefined }, () => {
      const upstreamHeaders = headersForUpstream(
        new Headers({ "x-forwarded-for": "198.51.100.1, 203.0.113.9", ...SPOOFED }),
      )
      expect(upstreamHeaders.get("x-sniptide-client-ip")).toBe("203.0.113.9")
      expect(upstreamHeaders.get("x-sniptide-proxy-secret")).toBe(SECRET)
    })
  })

  test("sends neither header when the secret or the address is missing", () => {
    const forwarded = new Headers({ "x-forwarded-for": "203.0.113.9", ...SPOOFED })
    withEnv({ SHARE_PROXY_SECRET: undefined, CLIENT_IP_HEADER: undefined }, () => {
      const upstreamHeaders = headersForUpstream(forwarded)
      expect(upstreamHeaders.get("x-sniptide-client-ip")).toBeNull()
      expect(upstreamHeaders.get("x-sniptide-proxy-secret")).toBeNull()
    })
    withEnv({ SHARE_PROXY_SECRET: "", CLIENT_IP_HEADER: undefined }, () => {
      const upstreamHeaders = headersForUpstream(forwarded)
      expect(upstreamHeaders.get("x-sniptide-client-ip")).toBeNull()
      expect(upstreamHeaders.get("x-sniptide-proxy-secret")).toBeNull()
    })
    withEnv({ SHARE_PROXY_SECRET: SECRET, CLIENT_IP_HEADER: "x-real-ip" }, () => {
      const upstreamHeaders = headersForUpstream(forwarded)
      expect(upstreamHeaders.get("x-sniptide-client-ip")).toBeNull()
      expect(upstreamHeaders.get("x-sniptide-proxy-secret")).toBeNull()
    })
  })
})

describe("reveal", () => {
  const chrome = {
    "user-agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  }

  test("proxies a same-origin POST and answers every other method", () => {
    expect(revealBlock("/k7Qe2x/reveal", "POST", new Headers(chrome))).toBeNull()
    expect(
      revealBlock(
        "/k7Qe2x/reveal",
        "POST",
        new Headers({ ...chrome, "sec-fetch-site": "same-origin" }),
      ),
    ).toBeNull()
    expect(
      revealBlock(
        "/k7Qe2x/reveal",
        "POST",
        new Headers({ ...chrome, "sec-fetch-site": "same-site" }),
      ),
    ).toBeNull()
    expect(
      revealBlock("/k7Qe2x/reveal", "POST", new Headers({ ...chrome, "sec-fetch-site": "none" })),
    ).toBeNull()

    for (const method of ["GET", "HEAD", "PUT", "PATCH", "DELETE", "OPTIONS"]) {
      expect(revealBlock("/k7Qe2x/reveal", method, new Headers(chrome))).toEqual({ status: 405 })
    }
    expect(revealBlock("/k7Qe2x/reveal/", "GET", new Headers(chrome))).toEqual({ status: 405 })
  })

  test("refuses known preview bots", () => {
    const agents = [
      "Slackbot-LinkExpanding 1.0",
      "Twitterbot/1.0",
      "facebookexternalhit/1.1",
      "Discordbot/2.0",
      "WhatsApp/2.1",
      "LinkedInBot/1.0",
      "TelegramBot (like TwitterBot)",
      "Iframely/1.0",
      "Slack-ImgProxy",
    ]
    for (const agent of agents) {
      const headers = new Headers({ "user-agent": agent, "sec-fetch-site": "same-origin" })
      expect(isPreviewBot(headers)).toBe(true)
      expect(revealBlock("/k7Qe2x/reveal", "POST", headers)).toEqual({ status: 403 })
      expect(revealBlock("/k7Qe2x/reveal", "GET", headers)).toEqual({ status: 403 })
    }
    expect(isPreviewBot(new Headers(chrome))).toBe(false)
    const crawler = new Headers({ "user-agent": "Googlebot/2.1 (+http://www.google.com/bot.html)" })
    expect(isPreviewBot(crawler)).toBe(false)
    expect(revealBlock("/k7Qe2x/reveal", "GET", crawler)).toEqual({ status: 405 })
    expect(revealBlock("/k7Qe2x/reveal", "POST", crawler)).toBeNull()
  })

  test("refuses cross-site posts and leaves other paths alone", () => {
    expect(
      revealBlock(
        "/k7Qe2x/reveal",
        "POST",
        new Headers({ ...chrome, "sec-fetch-site": " Cross-Site " }),
      ),
    ).toEqual({ status: 403 })
    expect(
      revealBlock(
        "/k7Qe2x/reveal",
        "GET",
        new Headers({ ...chrome, "sec-fetch-site": "cross-site" }),
      ),
    ).toEqual({ status: 405 })
    expect(revealBlock("/k7Qe2x", "POST", new Headers(chrome))).toBeNull()
    expect(revealBlock("/k7Qe2x/raw", "GET", new Headers({ "user-agent": "Slackbot" }))).toBeNull()
    expect(revealBlock("/sign-in/reveal", "GET", new Headers(chrome))).toBeNull()
    expect(revealBlock("/Sign-In/reveal", "POST", new Headers(chrome))).toBeNull()
    expect(revealBlock("/api/auth/reveal", "POST", new Headers(chrome))).toBeNull()
  })
})

describe("proxy", () => {
  test("leaves session redirects to the root page and always passes marketing and shares through", () => {
    for (const path of ["/", "/home", "/k7Qe2x"]) {
      for (const name of ["better-auth.session_token", "__Secure-better-auth.session_token"]) {
        const response = proxy(request(path, "GET", { cookie: `${name}=abc` }))
        expect(response.status).toBe(200)
        expect(response.headers.get("location")).toBeNull()
        expect(upstream(response).continued).toBe(true)
      }
    }
  })

  test("answers reveal itself and proxies an allowed POST with the visitor address", () => {
    withEnv({ SHARE_PROXY_SECRET: SECRET, CLIENT_IP_HEADER: undefined }, () => {
      const headers = {
        "user-agent": "Slackbot-LinkExpanding 1.0",
        "x-forwarded-for": "203.0.113.9",
        ...SPOOFED,
      }
      const bot = proxy(request("/k7Qe2x/reveal", "POST", headers))
      expect(bot.status).toBe(403)
      expect(bot.headers.get("cache-control")).toBe("private, no-store")
      expect(bot.headers.get("x-middleware-next")).toBeNull()
      expect(bot.headers.get("x-sniptide-proxy-secret")).toBeNull()
      expect(upstream(bot).secret).toBeNull()

      const get = proxy(request("/k7Qe2x/reveal", "GET"))
      expect(get.status).toBe(405)
      expect(get.headers.get("allow")).toBe("POST")
      expect(get.headers.get("x-middleware-next")).toBeNull()

      const crossSite = proxy(
        request("/k7Qe2x/reveal", "POST", {
          "user-agent": "curl/8.0",
          "sec-fetch-site": "cross-site",
          "x-forwarded-for": "203.0.113.9",
        }),
      )
      expect(crossSite.status).toBe(403)
      expect(upstream(crossSite).continued).toBe(false)

      const allowed = proxy(
        request("/k7Qe2x/reveal", "POST", {
          "user-agent": "curl/8.0",
          "sec-fetch-site": "same-origin",
          "x-forwarded-for": "198.51.100.1, 203.0.113.9",
          ...SPOOFED,
        }),
      )
      const forwarded = upstream(allowed)
      expect(allowed.status).toBe(200)
      expect(forwarded.continued).toBe(true)
      expect(forwarded.clientIp).toBe("203.0.113.9")
      expect(forwarded.secret).toBe(SECRET)

      const page = proxy(
        request("/k7Qe2x", "GET", {
          "user-agent": "Slackbot-LinkExpanding 1.0",
          "x-forwarded-for": "203.0.113.9",
          ...SPOOFED,
        }),
      )
      const pageHeaders = upstream(page)
      expect(page.status).toBe(200)
      expect(pageHeaders.continued).toBe(true)
      expect(pageHeaders.clientIp).toBe("203.0.113.9")
      expect(pageHeaders.secret).toBe(SECRET)
    })
  })

  test("drops forged proxy headers when it cannot forward an address", () => {
    withEnv({ SHARE_PROXY_SECRET: undefined, CLIENT_IP_HEADER: undefined }, () => {
      const response = proxy(
        request("/k7Qe2x/raw", "GET", { "x-forwarded-for": "203.0.113.9", ...SPOOFED }),
      )
      const forwarded = upstream(response)
      expect(forwarded.continued).toBe(true)
      expect(forwarded.clientIp).toBeNull()
      expect(forwarded.secret).toBeNull()
    })
  })
})
