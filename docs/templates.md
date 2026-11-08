# Templates

The pages at `sniptide.com/templates` come from `content/templates`. Each template is one folder,
and the folder name is its URL: `content/templates/claude-md` is `/templates/claude-md`.

```text
content/templates/claude-md/
  template.mdx      frontmatter and the explanation under the files
  files/CLAUDE.md   the template's files, as the page shows and the editor opens them
```

## What one template produces

| URL | Source |
| --- | --- |
| `/templates/<name>` | The page: answer, files, "Save with your agent", explanation, related template cards |
| `/templates/<name>.md` | The Markdown twin for agents (`app/templates/md/[name]/route.ts`) |
| `/templates/<name>.json` | The files as JSON, which the app's `/new?template=<name>` reads (`app/templates/json/[name]/route.ts`) |
| `/templates/<name>/raw/<path>` | One file as plain text, behind each file's Raw link |
| `/templates/<name>/opengraph-image` | The share card with the title and the template's logo or icon |

The page is also a card in `/templates`, which filters by department and searches titles, categories and file names. Every template needs a visual: the card's cover shows the tool's logo, or an icon with a short name, over a blurred glimpse of the first file, and the share image shows the same visual next to the title. `lib/templates.test.ts` fails when a template has neither. To add an icon, copy it from Material Icon Theme into `public/templates/icons` as that folder's README describes. The page is also listed in the sitemap, `llms.txt` and the IndexNow submission after
deploy, with no further step.

## Add a template

1. Pick one search query with clear intent for a file people copy. Check its demand and difficulty
   with a keyword tool first, and skip it if an official source already owns the result.
2. Create `content/templates/<name>/files/` with the files, and `template.mdx` with this
   frontmatter (`lib/templates.ts` has the schema):

   ```yaml
   title: CLAUDE.md template        # the H1, matching the query
   query: CLAUDE.md template        # the target query, for upkeep
   description: One sentence of 50 to 160 characters for search results and the directory.
   answer: Two sentences under the H1 that answer the query before the files.
   category: agents                 # agents, deploy, project, specs, discovery or writing
   department: engineering          # engineering, product or marketing
   logo: claude                     # claude, cursor, openai, github or docker
   # or, for a tool without a logo in public/logos:
   # icon: robots                     # an icon from public/templates/icons
   # mark: "robots.txt"               # the short name beside it, up to 16 characters
   updated: 2026-11-08
   files:
     - CLAUDE.md                    # paths under files/, in display order
   related: [agents-md, claude-code-skill]
   post: claude-code-skills         # optional blog post slug
   ```

3. Write the explanation: what each section does and when to change it, then one or two variants.
   That part is what makes the page worth ranking. Follow the copy rules in `DESIGN.md`.
4. Run `bun test`. `lib/templates.test.ts` fails when `files/` and the frontmatter disagree, or
   when a related template or post doesn't exist. Update the list of names in that test when
   you add or remove a template.

A template holds at most 10 files with names up to 120 characters, the same limits as a paste, so
the editor can open every template.

## Review every quarter

Outdated templates hurt rankings and trust. Each quarter, check every template against the
current documentation of the tool it configures, such as action versions, image tags and
frontmatter fields. Change `updated` only when the files or the explanation change, so the date
on the page and in the sitemap stays honest.
