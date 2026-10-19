import { expect, test } from "bun:test"
import { ctaTarget } from "./cta"
import { links } from "./links"

test("names the destination of each button", () => {
  expect(ctaTarget(links.signUp)).toBe("sign_up")
  expect(ctaTarget(links.signIn)).toBe("sign_in")
  expect(ctaTarget(links.newPaste)).toBe("new_paste")
  expect(ctaTarget(links.dashboard)).toBe("dashboard")
  expect(ctaTarget(links.importGist)).toBe("import_gist")
  expect(ctaTarget(links.apiDocs)).toBe("api_docs")
  expect(ctaTarget(links.github)).toBe("github")
  expect(ctaTarget(links.docs)).toBe("docs")
  expect(ctaTarget(links.selfHost)).toBe("self_host")
})

test("groups in-page links as anchors", () => {
  expect(ctaTarget("#features")).toBe("anchor")
  expect(ctaTarget("#raw-links")).toBe("anchor")
})

test("ignores placeholders and other links", () => {
  expect(ctaTarget("#")).toBeNull()
  expect(ctaTarget(null)).toBeNull()
  expect(ctaTarget("https://example.com")).toBeNull()
})
