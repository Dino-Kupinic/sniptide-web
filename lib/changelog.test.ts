import { describe, expect, test } from "bun:test"
import {
  cleanSubject,
  type GithubRelease,
  groupEntries,
  parseRelease,
  toEntries,
} from "./changelog"

function release(tag: string, body: string, published_at = "2026-11-08T16:43:56Z"): GithubRelease {
  return {
    tag_name: tag,
    name: tag,
    body,
    html_url: `https://github.com/Dino-Kupinic/sniptide/releases/tag/${tag}`,
    published_at,
    draft: false,
    prerelease: false,
  }
}

const featureList = `## [0.77.0](https://github.com/Dino-Kupinic/sniptide/compare/v0.76.0...v0.77.0) (2026-11-08)

### Features

* **web:** move custom links under /[@handle](https://github.com/handle) (WRK-531) ([#251](https://github.com/Dino-Kupinic/sniptide/issues/251)) ([7e7d25f](https://github.com/Dino-Kupinic/sniptide/commit/7e7d25f7b7465f70027d9f705b9aa73915f75272))
`

const ciList = `## [0.75.2](https://github.com/Dino-Kupinic/sniptide/compare/v0.75.1...v0.75.2) (2026-11-07)

### CI

* run the docs check on every pull request ([#240](https://github.com/Dino-Kupinic/sniptide/issues/240)) ([abc1234](https://github.com/Dino-Kupinic/sniptide/commit/abc1234))
`

describe("semantic-release fallback", () => {
  test("a feature release takes its subject as the title", () => {
    const entry = parseRelease(release("v0.77.0", featureList))
    expect(entry).toMatchObject({
      version: "0.77.0",
      kind: "feature",
      title: "Move custom links under /@handle",
      body: "",
      pulls: [251],
      written: false,
    })
  })

  test("a CI-only release is internal", () => {
    const entry = parseRelease(release("v0.75.2", ciList))
    expect(entry.kind).toBe("internal")
    expect(entry.title).toBe("Run the docs check on every pull request")
  })

  test("other user-facing items become the body and internal ones are left out", () => {
    const body = `${featureList}
### Bug fixes

* **cli:** keep the token after an upgrade ([#252](https://github.com/Dino-Kupinic/sniptide/issues/252)) ([1234567](https://github.com/Dino-Kupinic/sniptide/commit/1234567))

### Tests

* cover the handle redirect ([#253](https://github.com/Dino-Kupinic/sniptide/issues/253)) ([2345678](https://github.com/Dino-Kupinic/sniptide/commit/2345678))
`
    const entry = parseRelease(release("v0.77.0", body))
    expect(entry.title).toBe("Move custom links under /@handle")
    expect(entry.body).toBe("- Keep the token after an upgrade")
    expect(entry.pulls).toEqual([251, 252, 253])
  })

  test("an empty body still yields an entry", () => {
    expect(parseRelease(release("v0.1.0", ""))).toMatchObject({
      kind: "internal",
      title: "Maintenance release",
    })
  })

  test("subjects lose their scope, Linear IDs and links", () => {
    expect(
      cleanSubject(
        "* **web:** honor consent (WRK-532, WRK-533) ([#253](https://github.com/o/r/issues/253)) ([360b390](https://github.com/o/r/commit/360b390))",
      ),
    ).toBe("honor consent")
  })
})

describe("written release notes", () => {
  test("the post between the markers wins over the commit list", () => {
    const body = `<!-- sniptide-notes:start kind="feature" -->
## Custom links now live under your handle

Links you create read **sniptide.com/@you/name**, so two people can use the same name.

- Old links redirect.
<!-- sniptide-notes:end -->

<details>
<summary>Technical changes</summary>

${featureList}
</details>`
    const entry = parseRelease(release("v0.77.0", body))
    expect(entry).toMatchObject({
      kind: "feature",
      title: "Custom links now live under your handle",
      written: true,
      pulls: [251],
    })
    expect(entry.body).toBe(
      "Links you create read **sniptide.com/@you/name**, so two people can use the same name.\n\n- Old links redirect.",
    )
  })

  test("an internal note without a heading uses its sentence as the title", () => {
    const body = `<!-- sniptide-notes:start kind="internal" -->
Faster CI runs for pull requests.
<!-- sniptide-notes:end -->`
    expect(parseRelease(release("v0.75.2", body))).toMatchObject({
      kind: "internal",
      title: "Faster CI runs for pull requests.",
      body: "",
    })
  })

  test("an unknown kind falls back to feature", () => {
    const body = `<!-- sniptide-notes:start kind="other" -->\n## Title\n<!-- sniptide-notes:end -->`
    expect(parseRelease(release("v1.0.0", body)).kind).toBe("feature")
  })
})

describe("listing", () => {
  test("drafts and prereleases are hidden and the newest comes first", () => {
    const entries = toEntries([
      release("v0.1.0", featureList, "2026-10-01T00:00:00Z"),
      { ...release("v0.3.0", featureList, "2026-10-03T00:00:00Z"), draft: true },
      { ...release("v0.4.0-rc.1", featureList, "2026-10-04T00:00:00Z"), prerelease: true },
      release("v0.2.0", featureList, "2026-10-02T00:00:00Z"),
    ])
    expect(entries.map((entry) => entry.tag)).toEqual(["v0.2.0", "v0.1.0"])
  })

  test("consecutive internal releases share one group", () => {
    const entries = toEntries([
      release("v0.5.0", featureList, "2026-10-05T00:00:00Z"),
      release("v0.4.2", ciList, "2026-10-04T02:00:00Z"),
      release("v0.4.1", ciList, "2026-10-04T01:00:00Z"),
      release("v0.4.0", featureList, "2026-10-04T00:00:00Z"),
      release("v0.3.1", ciList, "2026-10-03T00:00:00Z"),
    ])
    const units = groupEntries(entries)
    expect(
      units.map((unit) =>
        unit.type === "entry" ? unit.entry.tag : unit.entries.map((e) => e.tag).join(","),
      ),
    ).toEqual(["v0.5.0", "v0.4.2,v0.4.1", "v0.4.0", "v0.3.1"])
  })
})
