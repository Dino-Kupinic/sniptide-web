# Blog

Posts are MDX files in `content/blog`, and the file name is the address (`content/blog/foo.mdx` is
`/blog/foo`). fumadocs-mdx compiles them when the site builds (`lib/blog-source.ts`), and the
frontmatter schema in `lib/blog.ts` fails the build on a missing field or an author that isn't in
`lib/authors.ts`. Every post has one `category` from `categories` in `lib/blog.ts`. `draft: true`
keeps a post out of production builds, the sitemap and the feeds.

```yaml
---
title: Teach your agent a recipe # at most 70 characters
description: Collections give a coding agent an ordered set of snippets to follow. # 50 to 160
date: 2026-11-20
updated: 2026-11-24 # optional
author: dino # a key in lib/authors.ts
category: agents # product, engineering, agents, self-hosting or company
tags: [collections, mcp] # optional
cover: /blog/agent-recipes/cover-light.webp # the main picture, at the top of the post and the index
coverDark: /blog/agent-recipes/cover-dark.webp # optional
coverAlt: The collection page with three snippets. # describes the cover for screen readers
image: /blog/agent-recipes/share.png # the 1200 by 630 share card
featured: true # optional, pins the post to the top of the index
draft: true # optional
---
```

- **Index.** `/blog` opens with one big featured post: the newest, or the newest with
  `featured: true`, shown with its `cover` picture or its share picture. A faint Game of Life
  (`components/blog/life-background.tsx`) runs behind the title and the featured post, pauses off
  screen and stays still under reduced motion. Below it, a category filter
  and a search over titles, descriptions, tags and post text sit above a grid of cards, each with the
  post's share picture (`image`, or the generated Open Graph card), a category badge, the date, the
  title and the description. The grid shows nine cards and adds nine more as the reader scrolls
  (`components/blog/blog-index.tsx`). The filters live in the URL
  (`/blog?category=engineering&q=mcp`), so a filtered list can be shared.

- **Style.** The [blog style guide](blog-style-guide.md) covers choosing a topic, titles, openings, article
  structures, visuals and the next step a post asks for. Read it before drafting.
- **Writing.** Posts use the docs' prose components (`components/blog/prose.tsx`, `tabs.tsx` and
  `code-block.tsx`): `Callout`, `Steps`, `Tabs`, `Params`, `Files`, `Figure` and `Kbd`, plus fenced
  code with a `title`. `Comparison` (`components/blog/comparison.tsx`) wraps a plain Markdown table
  and draws it as a feature-by-product comparison: bold rows become groups, `✓` and `–` cells become
  markers, `~note` marks partial support and `highlight` tints one column. `FeatureGrid` lays out
  bold lines with lists as feature cards, and `InlineCta` places a call to action inside a post. Both stay plain Markdown in the `.md` twin, so agents
  read them. Text sets at 17px on a 27px line (16px on 26px on phones) in a 35rem
  column, about 68 characters to a line (`.blog-prose` in `app/globals.css`). Inter loads its
  optical size axis for the whole site. Table cells grow with their text up to 18rem, and wide tables scroll
  sideways inside their frame, with the first column pinned.
- **Post page.** From 1280px the text sits between two sticky rails. The left one holds an "All
  posts" link, the author and two groups of actions (`components/blog/post-actions.tsx`): sharing
  (copy link, X, LinkedIn) and reading with AI (copy the post's Markdown, open it in ChatGPT or
  Claude, or view the `.md` twin). The right one lists the post's h2 and h3 headings and marks the
  section being read (`components/blog/table-of-contents.tsx`); it shows once a post has two
  headings. On narrower screens the back link sits above the title, the actions become a Share
  menu and a Read with AI menu under the byline, and the contents sit in a disclosure that starts open. A fainter
  copy of the index's Game of Life runs behind the top of the post, and every post ends with the
  landing page's closing call to action above the footer (`BlogShell` with `cta`).
- **Images.** Pictures go in `public/blog/<slug>/`, and author avatars in `public/blog/authors/`.
  Every post needs a `cover`, a `coverAlt` and an `image` (the blog tests check), so the post, the
  index and link previews always show a picture. The cover sits at the top of the post under the
  description. Every picture, from `<Figure src darkSrc>` or a Markdown image, opens a full-screen
  viewer with zoom up to 4x, panning and pinch (`components/blog/zoom-image.tsx`), and shows its
  caption centered below in smaller text. A Markdown image uses its title, or its alt text, as the
  caption.
- **Feeds and previews.** `/blog/rss.xml`, `/blog/atom.xml` and `/blog/feed.json` (JSON Feed 1.1)
  list the latest 20 posts, and the Subscribe menu on the index offers all three. Each post gets an Open Graph
  card with its title (`renderPostOgImage` in `lib/og.tsx`), `BlogPosting` JSON-LD, a sitemap entry
  and a Markdown twin at its address plus `.md`. The newest post also fills the "From the blog" line
  in the Resources menu.
