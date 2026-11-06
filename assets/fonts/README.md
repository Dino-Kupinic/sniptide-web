# Fonts

`app/layout.tsx` loads `PaperMono[wght].ttf` through `next/font/local` for `--font-mono`.
Paper Mono comes from Paper Design's
[v1.000 release](https://github.com/paper-design/paper-mono/releases/tag/v1.000).
`OFL.txt` contains its SIL Open Font License 1.1.

`lib/og.tsx` reads `Archivo-500.woff` to set post titles on the blog's Open Graph cards, since the
image renderer can't use `next/font`. It is the same file the docs use (`apps/docs/assets/fonts` in
the app repo), from Google Fonts under the SIL Open Font License 1.1.
