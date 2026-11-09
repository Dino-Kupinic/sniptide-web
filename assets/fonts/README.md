# Fonts

`app/layout.tsx` loads `PaperMono[wght].ttf` through `next/font/local` for `--font-mono`.
Paper Mono comes from Paper Design's
[v1.000 release](https://github.com/paper-design/paper-mono/releases/tag/v1.000).
`OFL.txt` contains its SIL Open Font License 1.1.

`lib/og.tsx` reads `Archivo-500.woff` to set post titles on the blog's Open Graph cards, since the
image renderer can't use `next/font`. It is the same file the docs use (`apps/docs/assets/fonts` in
the app repo), from Google Fonts under the SIL Open Font License 1.1.

`lib/og.tsx` also reads `PaperMono-400.ttf` to set code on the templates' Open Graph cards. The
image renderer can't read variable fonts, so it is the regular (400) instance of
`PaperMono[wght].ttf`, made with `fonttools varLib.instancer "PaperMono[wght].ttf" wght=400`. The
same license applies.
