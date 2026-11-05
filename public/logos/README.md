# Compatible tool logos

The marquee uses artwork from official sites and brand kits, retrieved on
5 November 2026. Lettering is part of the artwork; no brand names are recreated
with the site's font. The canvas uses dithercn's default gradient fill and solid
outlines across the complete logo, with the scan effect enabled. The source artwork also serves as the loading fallback.

| Local file | Official source | Artwork |
| --- | --- | --- |
| `claude-code.svg` | [Claude Code documentation](https://code.claude.com/docs/en/overview), [SVG](https://mintcdn.com/claude-code/c5r9_6tjPMzFdDDT/logo/light.svg) | Product portion of the official header: the four “Docs” paths are removed, with the viewBox narrowed to 188 × 28 |
| `cursor.svg` | [Cursor brand kit](https://cursor.com/brand) | `General Logos/Lockup Horizontal/SVG/LOCKUP_HORIZONTAL_2D_DARK.svg` |
| `codex.png` | [Official Codex app](https://developers.openai.com/codex/app) | Unchanged `webview/assets/codex-app-ga-logo.dfddfb85d7.png` from the official installed OpenAI app bundle; the Codex cloud/terminal mark |
| `github.svg` | [GitHub logos](https://github.com/logos), [brand kit](https://brand.github.com/GitHub_Logos.zip) | `GitHub Logos/SVG/GitHub_Lockup_Black.svg` |
| `docker.svg` | [Docker media resources](https://www.docker.com/company/newsroom/media-resources/), [brand kit](https://www.docker.com/static/Docker-Logos-1.zip) | `docker-logos/SVG/docker-logo-black.svg` |
| `slack.svg` | [Official Slack logo library](https://brandfolder.com/slack/logos/#!asset/pl546j-7le8zk-4v3yy6) | `Slack_Monochrome_Black.svg`, standalone symbol and wordmark without a Salesforce suffix |
| `discord.svg` | [Discord branding](https://discord.com/branding), [logo download](https://cdn.discordapp.com/assets/content/061dbac3ba20669ec7e5cce279692835f4077ab26174b9cd73fea32fa7c70a6d.zip) | `DIscord_Logo_White/Discord-Logo-White.svg` |
| `curl.svg` | [curl logos](https://curl.se/logo/), [SVG](https://curl.se/logo/curl-logo.svg) | curl wordmark |

SVGs retain the original product paths and proportions, with accessible names
added to the root elements. Claude Code omits the documentation-only suffix;
its eleven product paths are unchanged. Slack's viewBox trims transparent export
padding; its paths are unchanged. The renderer uses the source mask and the page's
foreground color. Codex uses the actual product mark at 32 pixels high with
`tone="original"`, retaining its blue cloud and light terminal details. Slack uses the official
standalone monochrome SVG rather than the navigation lockup with Salesforce text.

These are compatibility links. The marks belong to their respective owners.

Codex asset provenance: OpenAI app version 26.1029.61003 (build 24614),
`Contents/Resources/app.asar`, extracted without modifying the PNG. SHA-256:
`8e82b26c98a10e45798ce48124515720657f7735fb8d0853b3f087eaa8a6b74e`.
