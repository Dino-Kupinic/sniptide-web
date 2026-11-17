# Landing page

## Product screenshot

The product band shows the demo dashboard as a still, light and dark, in
`assets/landing/demo-preview-{light,dark}.webp`. The same stills supply the homepage screenshot
metadata, so keep the caption in `lib/structured-data.ts` in sync with what they show.

To refresh them, sign in to the shared demo at `demo.sniptide.com/demo` and add a few pastes with
realistic sample code, so the sidebar and lists look like a library in use. Capture the dashboard
at 1266 × 793 with a device scale factor of 2 in each theme and save both as WebP. Move the pastes
you added to the trash afterwards; the demo also resets to its example data every hour. Check both
themes, the centered demo link and the phone cropping after replacing the files.

## Recipes figure

The recipes section draws the Components collection next to the project it was pulled into in
`components/recipe-tree.tsx`, in code, so it follows the theme and stays sharp. Keep its six steps
in line with the CLI session in `components/recipes.tsx`, which reports writing six files.

## Extensions carousel

The extensions section is a horizontal carousel in `components/extensions.tsx`. The track scrolls
natively with snap points, so touch, trackpad and keyboard scrolling work, and the arrow buttons
move it one card at a time and turn off at each end. Each card draws its tool in code in
`components/extension-replicas.tsx`, using the extension's real commands and labels, so update a
drawing when an extension renames a command. A new card needs a replica, a title, one sentence and
a link to its guide.

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
