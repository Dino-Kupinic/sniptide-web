import { createHash } from "node:crypto"
import { readFileSync } from "node:fs"
import { join } from "node:path"
import { siteUrl } from "@/lib/site"

// https://agentskills.io discovery index, schema v0.2.0. Each digest hashes the raw bytes of the
// SKILL.md served from public/skills, so a client can check it fetched the file this index lists.
export const agentSkillsSchema = "https://schemas.agentskills.io/discovery/0.2.0/schema.json"

export const agentSkills = [
  {
    name: "reuse-snippets",
    description:
      "Find and adapt existing Sniptide snippets or follow a collection when a coding task may have a reusable pattern.",
  },
  {
    name: "save-snippets",
    description:
      "Save a reusable code pattern to Sniptide with source context when the user asks to capture or preserve code for later reuse.",
  },
  {
    name: "apply-collection",
    description:
      "Apply a Sniptide collection as an ordered recipe when the user asks to reuse a collection of code patterns in a project.",
  },
].map((skill) => ({
  ...skill,
  type: "skill-md" as const,
  url: `${siteUrl}/skills/${skill.name}/SKILL.md`,
  digest: `sha256:${createHash("sha256")
    .update(readFileSync(join(process.cwd(), "public/skills", skill.name, "SKILL.md")))
    .digest("hex")}`,
}))

export const agentSkillsIndex = { $schema: agentSkillsSchema, skills: agentSkills }
