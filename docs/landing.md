# Landing page

## Product walkthrough


The product preview loops through the demo dashboard, creating a TypeScript paste, the saved paste,
and account analytics, then returns to the dashboard. Light and dark GIFs live in
`assets/landing/demo-walkthrough-{light,dark}.gif`. They replace the screenshots inside the existing
preview, with the same dimensions, phone cropping, dimming, and centered **Try the demo** link.
The recording follows the theme selected in the footer. The WebP dashboard stills supply the
homepage screenshot metadata.

To refresh the media, record the same flow at 1266 × 793 in each theme using the shared demo's
example data. Use only sample code, discard restored drafts before recording, and remove any
pastes created for the recording afterwards. Until the companion banner removal in
[sniptide#233](https://github.com/Dino-Kupinic/sniptide/pull/233) deploys, hide only the workspace's
`p[role=note]` banner in the recording browser. Export an infinitely looping GIF and a WebP of the
opening dashboard frame for each theme. Keep the dimensions and dashboard caption in
`lib/structured-data.ts` in sync with the stills. Check both themes, the footer theme switch,
the centered demo link, and phone cropping after replacing the files.


## Compatible tool marquee


`components/works-with.tsx` follows the [first dithercn example](https://dithercn.dev/docs/images/logo-marquee):
a looping row with a gradient fill that keeps 60% of its ink at the bottom (the example's default is 30%, which reads pale on white), solid outlines, one-pixel cells,
28-pixel logo height, 64-pixel gaps, 32-pixel-per-second speed and soft edge fades.
The scan effect passes through each logo in turn. Hover or keyboard focus coasts
the row to a stop at its current position; leaving resumes from there. Reduced
motion shows one still, wrapping row without the scan animation.

Official artwork supplies the lettering, and tool names remain accessible link
labels. Logo links open in a new tab with `noopener noreferrer`; accessible labels
announce this behavior. There is no pause button. Keep the local artwork and its sources in
`public/logos` together when changing the list.

Below 640 pixels of row width, logos shrink to 21 pixels tall, gaps halve to 32
pixels, soft fades narrow to 48 pixels, and scroll speed increases by 25% to 40
pixels per second, so about three logos stay in view on a phone. Logo size and
gaps come from container queries, so they apply on first paint before the page
hydrates. A tap that focuses a logo link does not hold the row; only keyboard
focus does. Desktop
uses the reference defaults. OpenAI's export padding is trimmed so its wordmark
has comparable visible height to the other logos.
