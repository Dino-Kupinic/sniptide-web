# Fonts

`app/layout.tsx` loads `PaperMono[wght].ttf` through `next/font/local` for `--font-mono`.
Paper Mono comes from Paper Design's
[v1.000 release](https://github.com/paper-design/paper-mono/releases/tag/v1.000).
`OFL.txt` contains its SIL Open Font License 1.1.

`Archivo-500.woff` is the weight of the site's heading font that the Open Graph image uses
(`lib/og.tsx`). `next/og` needs the font data itself, which `next/font` doesn't expose. Archivo is
open source under the SIL Open Font License 1.1 and comes from Google Fonts. Replace the file when
the site changes its heading font.
