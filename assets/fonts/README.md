# Fonts for generated images

`Archivo-500.woff` and `StackSansText-400.woff` are the weights of the site's heading and body
fonts that the Open Graph image uses (`lib/og.tsx`). `next/og` needs the font data itself, which
`next/font` doesn't expose. Both fonts are open source under the SIL Open Font License 1.1 and come
from Google Fonts. Replace a file when the site changes its heading or body font.
