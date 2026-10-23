# Fonts for generated images

`Archivo-500.woff` is the weight of the site's heading font that the Open Graph image uses
(`lib/og.tsx`). `next/og` needs the font data itself, which `next/font` doesn't expose. Archivo is
open source under the SIL Open Font License 1.1 and comes from Google Fonts. Replace the file when
the site changes its heading font.
