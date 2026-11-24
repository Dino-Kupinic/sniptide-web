# Comparison pages

The pages at `/compare` compare Sniptide with one other tool each: GitHub Gist, Pastebin and
PrivateBin. `/compare` lists them as cards, each with Sniptide's mark, "vs" and the other tool's
mark. The Resources menu has a Compare group below Brand and releases with one link per page, and
the footer lists the same links.

## Where the facts live

Every cell in a comparison table comes from `content/compare/competitors.json`. The site serves
the same file at `/compare/competitors.json`, so readers can check a page against its data.

- `features` lists the table rows in order, each in a group such as Sharing or Hosting.
- `products` holds one entry per tool, with its `sources` (a title and a URL each) and one fact per
  feature. A fact has a `value`, the key of the `source` that backs it and the `verified` date on
  which someone last checked that source.

A value uses the notation of the blog's Comparison component: `✓` for yes, `–` for no or not
documented, `?` when the docs don't say, a leading `~` for partial support (`~Folders`), and any
other short text as a note (`Up to 10`). A row where both tools on a page say `–` is left out of
that page's table.

`lib/compare.test.ts` fails when a product misses a feature, cites a source it doesn't list or
carries a check date in the future.

## Update a fact

1. Open the source and confirm what it says today.
2. Change the fact's `value` if needed, and set `verified` to today's date even when the value
   stays the same.
3. Read the page copy in `lib/compare.ts` for that tool. The summary, the "who each tool is for"
   paragraphs and the "choose" lists may only claim what the data file backs, so fix any sentence
   the new fact contradicts.

The table caption, the Sources list, the sitemap and the structured data read their dates from the
file, so nothing else needs a date change.

## Add a comparison page

1. Add the tool to `products` in `content/compare/competitors.json` with a fact for every feature
   and a source for every fact.
2. Add an entry to `comparePages` in `lib/compare.ts`. Write it for a busy reader: open with the
   answer, say who each tool fits, and list at least two honest reasons to choose the other tool.
   Name Sniptide's gaps plainly and say nothing about the other tool that its own documentation
   doesn't back.
3. Add the tool's mark to `ProductMark` in `components/compare/product-mark.tsx`, and record where
   the artwork comes from in `public/compare/README.md`. Use the tool's published mark without
   changing its paths or colors.
4. Add a link to the Compare group in `lib/nav.ts`.
5. The page, its Markdown twin at `/compare/<slug>.md`, the index and the sitemap entry follow from
   the entry.

## Principles

- State Sniptide's gaps and the other tool's real strengths, and say when the other tool fits the
  reader better.
- Open with who each tool is for, then the table, for readers who decide fast. Sniptide's ideal
  reader gives coding agents a snippet library or runs Sniptide on their own server.
- Keep every fact sourced and dated in the data file, so a change is one edit.
