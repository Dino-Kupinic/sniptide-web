import { describe, expect, test } from "bun:test"
import { deploymentEnvironment } from "./posthog"

describe("deployment environment", () => {
  test("labels the live site as production", () => {
    expect(deploymentEnvironment("sniptide.com")).toBe("production")
  })

  test("labels numbered pull request hosts as previews", () => {
    expect(deploymentEnvironment("33.sniptide.com")).toBe("preview")
    expect(deploymentEnvironment("150.sniptide.com")).toBe("preview")
  })

  test("labels every other host as development", () => {
    expect(deploymentEnvironment("localhost")).toBe("development")
    expect(deploymentEnvironment("app.sniptide.com")).toBe("development")
    expect(deploymentEnvironment("33.sniptide.com.example.org")).toBe("development")
  })
})
