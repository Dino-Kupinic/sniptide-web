import { expect, test } from "bun:test"
import { mcpEndpoint } from "./agent-docs"
import { agentSetupPrompt } from "./agent-setup-prompt"

// The prompt mirrors "Connect an agent" on docs.sniptide.com/mcp. These are the facts an agent
// acts on, so a change to any of them must reach the prompt too.
test("the setup prompt gives each agent the documented command and endpoint", () => {
  expect(mcpEndpoint).toBe("https://app.sniptide.com/api/mcp")
  expect(agentSetupPrompt).toContain(`claude mcp add --transport http sniptide ${mcpEndpoint}`)
  expect(agentSetupPrompt).toContain(`codex mcp add sniptide --url ${mcpEndpoint}`)
  expect(agentSetupPrompt).toContain("/api/mcp instead")
  expect(agentSetupPrompt).toContain("list_collections")
  expect(agentSetupPrompt).toContain("https://docs.sniptide.com/llms.mdx/mcp")
})

test("the setup prompt never asks for a token in the chat", () => {
  expect(agentSetupPrompt).toContain("Don't ask me to paste an API token into this chat.")
  expect(agentSetupPrompt).not.toMatch(/Bearer|YOUR_PERSONAL_API_TOKEN/)
})
