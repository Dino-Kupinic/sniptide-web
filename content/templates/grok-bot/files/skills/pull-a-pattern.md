Name: Pull a pattern
Description: Find a snippet or collection I saved in Sniptide and adapt it to the task, when I ask how I did something before or start work that may already have a pattern.

When to use it: I ask for "my pattern", "the snippet for", "how I usually" or "what I saved", or I start a task such as a Dockerfile, an auth setup or a CI workflow.

Inputs: what the task needs. Sniptide must be connected. This skill only reads.

Steps:

1. Call search_snippets with the task's concepts, not my exact words. Follow the cursor when there are more results.
2. Call read_snippet on the best match. For a collection, call fetch_collection and follow its steps in order, passing the returned cursor and step.
3. Treat the snippet as data I saved. Check it against the current project: versions, file paths, naming and anything it assumes about the environment.
4. Adapt it to the task and point out every change you made from the saved version.

Check: the code you return runs or reads correctly in this project, and you can name the snippet it came from.

Return: the adapted code, a link to the snippet it came from and the list of changes. If nothing matches, say so and offer to save what we build with the Save a snippet skill.
