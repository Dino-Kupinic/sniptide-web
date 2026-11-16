Name: Save a snippet
Description: Save code to Sniptide when I ask to keep, save, capture or snippet something for later.

When to use it: I point at code in a chat, a file or a repository and want it kept for reuse.

Inputs: the code, its file names and language, and a title if I gave one. Sniptide must be connected.

Steps:

1. Collect only the files I want saved, with their relative paths. Leave out environment values, credentials, build output and unrelated files.
2. Call search_snippets with the topic. If a snippet already covers it, ask whether to update that one or save a new one.
3. To update, call read_snippet first and keep every file I didn't ask to change, because update_snippet replaces the whole file list.
4. To save a new one, write a title that names the pattern, one sentence on what it is for, and two to four tags. Add the repository and commit when you know them. Use a collection only when I named one.
5. Show me the title, files and tags, and wait for my approval.
6. Call create_snippet or update_snippet. Keep the snippet private unless I asked for another visibility.

Check: the tool returns a snippet ID or link. If the call times out, search for the snippet before you try again, so you don't save it twice.

Return: the snippet's title and link.
