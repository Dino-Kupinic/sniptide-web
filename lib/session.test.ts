import { afterEach, mock, spyOn, test } from "bun:test"
import assert from "node:assert/strict"
import { app } from "./links"
import { hasAppSession } from "./session"

const cookie = { name: "__Secure-better-auth.session_token", value: "token.signature" }

afterEach(() => {
  mock.restore()
})

function mockFetch(
  implementation: (...args: Parameters<typeof fetch>) => ReturnType<typeof fetch>,
) {
  spyOn(globalThis, "fetch").mockImplementation(
    Object.assign(implementation, { preconnect: globalThis.fetch.preconnect }),
  )
}

test("visitors without a session token do not contact the app", async () => {
  mockFetch(() => {
    throw new Error("Unexpected session check")
  })
  assert.equal(await hasAppSession([]), false)
  assert.equal(await hasAppSession([{ name: "theme", value: "dark" }]), false)
  assert.equal(await hasAppSession([{ ...cookie, value: "" }]), false)
})

for (const name of ["better-auth.session_token", "__Secure-better-auth.session_token"]) {
  test(`validates ${name} with the app without caching or forwarding unrelated cookies`, async () => {
    let checked = false
    mockFetch(async (url, options) => {
      checked = true
      assert.equal(url, app("/api/auth/get-session"))
      assert.equal(new Headers(options?.headers).get("cookie"), `${name}=token%2Bsignature`)
      assert.equal(options?.cache, "no-store")
      assert.equal(options?.redirect, "error")
      assert.ok(options?.signal)
      return Response.json({
        user: { id: "user-1" },
        session: { expiresAt: new Date(Date.now() + 60_000).toISOString() },
      })
    })
    assert.equal(
      await hasAppSession([
        { name, value: "token+signature" },
        { name: "unrelated", value: "private" },
      ]),
      true,
    )
    assert.equal(checked, true)
  })
}

for (const [label, data] of [
  ["stale or revoked", null],
  ["expired", { user: { id: "user-1" }, session: { expiresAt: "2020-01-01T00:00:00Z" } }],
  ["missing user", { session: { expiresAt: "2099-01-01T00:00:00Z" } }],
  ["malformed", { user: { id: "user-1" }, session: { expiresAt: "invalid" } }],
] as const) {
  test(`${label} sessions stay on marketing`, async () => {
    mockFetch(async () => Response.json(data))
    assert.equal(await hasAppSession([cookie]), false)
  })
}

test("app errors and invalid responses stay on marketing", async () => {
  for (const response of [new Response(null, { status: 503 }), new Response("not JSON")]) {
    mockFetch(async () => response)
    assert.equal(await hasAppSession([cookie]), false)
  }
})

for (const name of ["TypeError", "TimeoutError"]) {
  test(`${name} during session validation stays on marketing`, async () => {
    mockFetch(async () => {
      throw new DOMException("Session check failed", name)
    })
    assert.equal(await hasAppSession([cookie]), false)
  })
}
