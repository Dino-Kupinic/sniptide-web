import { siteUrl } from "@/lib/site"

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
].map((skill) => ({ ...skill, url: `${siteUrl}/skills/${skill.name}/SKILL.md` }))
