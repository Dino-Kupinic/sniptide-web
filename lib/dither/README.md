# dithercn logo engine

Source: https://dithercn.dev/r/dither-core.json (retrieved 5 November 2026).
Upstream: https://github.com/opencoredev/dithercn. MIT license: [LICENSE](LICENSE).

The logo marquee and dithered logo in `components/dithercn` come from the matching
`logo-marquee.json` and `dithered-logo.json` registry entries. `logo-image.ts` retains
only the image loading, sizing and rasterization helpers from `dither-image.json`.
Imports use the shared Sniptide utilities. Logos keep accessible link labels and a source image
fallback. Hook dependencies are explicit for Biome. No shader or WebGL is used.

The marketing row uses the first logo-marquee example's defaults, with `effect="scan"`:
gradient fill, solid outlines, one-pixel cells, a six-second scan period, and soft
fades. Custom hatch and texture-strength overrides are removed. Official product
artwork and accessible links are retained, with no pause control or added brand text.
`public/logos/README.md` records logo sources.

Local motion fixes use `Animation.updatePlaybackRate()` while coasting so speed
changes synchronize with the current position. Measurements ignore translation
rounding noise, and genuine row resizes retain the current loop phase. Hover and
keyboard focus stop and resume the existing animation. Reduced motion wraps the
logos without row motion or scanning.

To update, compare the registry source with these adaptations, retain the license,
run the repository checks, and inspect light/dark desktop and phone layouts plus
reduced motion. Avoid the registry installer's `--overwrite` option because it can
replace shared utilities and theme files.

Below 640 pixels of row width, logo gaps halve to 32 pixels, soft fades narrow to
32 pixels, and scroll speed increases by 25% to 40 pixels per second. Desktop
uses the reference defaults. OpenAI's export padding is trimmed so its wordmark
has comparable visible height to the other logos.
