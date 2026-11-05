# dithercn logo engine

Source: https://dithercn.dev/r/dither-core.json (retrieved 5 November 2026).
Upstream: https://github.com/opencoredev/dithercn. MIT license: [LICENSE](LICENSE).

The logo marquee and dithered logo in `components/dithercn` come from the matching
`logo-marquee.json` and `dithered-logo.json` registry entries. `logo-image.ts` retains
only the image loading, sizing and rasterization helpers from `dither-image.json`.
Imports use the shared Sniptide utilities. Logos keep text labels and a source image
fallback. Hook dependencies are explicit for Biome. No shader or WebGL is used.

`settings.ts` matches the app: hatched fill, one-pixel cells, bloom off. The marquee
has soft fades, coasts to a stop on hover/focus, includes a pause control, and wraps
without moving under reduced motion. `public/logos/README.md` records logo sources.

To update, compare the registry source with these adaptations, retain the license,
run the repository checks, and inspect light/dark desktop and phone layouts plus
reduced motion. Avoid the registry installer's `--overwrite` option because it can
replace shared utilities and theme files.
