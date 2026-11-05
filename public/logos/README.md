# Compatible tool logos

The marquee uses artwork from official sites and brand kits, retrieved on
5 November 2026. Lettering is part of the artwork; no brand names are recreated
with the site's font. The canvas uses dithercn's default gradient fill and solid
outlines across the complete logo, with the scan effect enabled. The source artwork also serves as the loading fallback.

| Local file | Official source | Artwork |
| --- | --- | --- |
| `claude.svg` | [Claude Code product page](https://claude.com/product/claude-code) | The Claude wordmark from the page's navigation, an inline SVG with `currentColor` set to `#141413` and the spark in `#D97757` |
| `cursor.svg` | [Cursor brand kit](https://cursor.com/brand) | `General Logos/Lockup Horizontal/SVG/LOCKUP_HORIZONTAL_2D_DARK.svg` |
| `openai.svg` | [OpenAI brand kit](https://cdn.openai.com/brand/OpenAI-Logos-2025.zip) | `OpenAI-logos(new)/SVGs/OpenAI-black-wordmark.svg`; transparent export padding trimmed to a 1127 × 305 viewBox |
| `github.svg` | [GitHub logos](https://github.com/logos), [brand kit](https://brand.github.com/GitHub_Logos.zip) | `GitHub Logos/SVG/GitHub_Lockup_Black.svg` |
| `docker.svg` | [Docker media resources](https://www.docker.com/company/newsroom/media-resources/), [brand kit](https://www.docker.com/static/Docker-Logos-1.zip) | `docker-logos/SVG/docker-logo-black.svg` |
| `slack.svg` | [Official Slack logo library](https://brandfolder.com/slack/logos/#!asset/pl546j-7le8zk-4v3yy6) | `Slack_Monochrome_Black.svg`, standalone symbol and wordmark without a Salesforce suffix |
| `discord.svg` | [Discord branding](https://discord.com/branding), [logo download](https://cdn.discordapp.com/assets/content/061dbac3ba20669ec7e5cce279692835f4077ab26174b9cd73fea32fa7c70a6d.zip) | `DIscord_Logo_White/Discord-Logo-White.svg` |
| `curl.svg` | [curl logos](https://curl.se/logo/), [SVG](https://curl.se/logo/curl-logo.svg) | curl wordmark |

SVGs retain the original product paths and proportions, with accessible names
added to the root elements. Claude uses the wordmark from the Claude Code
product page because the documentation header's thin lettering breaks up under
the dither fill in light mode; its paths are unchanged, and the link still opens
the Claude Code page. Slack's viewBox trims transparent export
padding; its paths are unchanged. The renderer uses the source mask and the page's
foreground color. OpenAI uses the same 28-pixel logo height as the rest of the
row; trimming transparent export padding gives the lettering comparable visual
size. Slack uses the official
standalone monochrome SVG rather than the navigation lockup with Salesforce text.

These are compatibility links. The marks belong to their respective owners.


Every logo links to its official site in a new tab, with `noopener noreferrer`.
Accessible link labels announce that a new tab opens.
