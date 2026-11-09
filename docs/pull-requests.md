# Open a pull request

Every change ends in a pull request that is ready for review. Agents never open drafts, even when
a tool or default instruction asks for one. The description fills in every section of
`.github/pull_request_template.md` and shows the change, so a reviewer can judge it without
checking out the branch.

## Choose what to capture

| Change | What the Screenshots section holds |
| --- | --- |
| A page, component, blog post, template or Open Graph image | Before and after screenshots of each affected state |
| Interaction, motion or navigation | The screenshots and a recording of the flow |
| Nothing a visitor sees, such as CI, scripts or agent instructions | "No visible change" and the reason |

Capture every state the change touches. A layout change needs desktop at 1440px and a phone at
390px, and a color or surface change needs light and dark. Take each pair at the same viewport,
theme and content, so the change is the only difference. Keep a recording to one flow of about
15 seconds. When a recording isn't possible, say so and add a screenshot of each step instead.

## Capture the before state

Take the before screenshots on the base branch before you edit. When the change already exists,
run the base from a worktree on another port:

```sh
git worktree add ../sniptide-web-base origin/main
cd ../sniptide-web-base && bun install && cp ../sniptide-web/.env.local .
bunx next dev --port 3002
```

Remove the worktree with `git worktree remove ../sniptide-web-base` when the screenshots are done.

## Take screenshots and recordings

Write the capture script in a scratch directory outside the repository, so it never becomes a
project file. This one takes desktop and phone screenshots in light and dark, and records a flow:

```js
import { chromium } from "playwright"

const base = process.env.BASE_URL ?? "http://localhost:3001"
const state = process.env.STATE ?? "after"
const viewports = { desktop: { width: 1440, height: 900 }, mobile: { width: 390, height: 844 } }
const browser = await chromium.launch()

for (const [device, viewport] of Object.entries(viewports)) {
  for (const colorScheme of ["light", "dark"]) {
    const page = await browser.newPage({ viewport, colorScheme, deviceScaleFactor: 2 })
    await page.goto(`${base}/`)
    await page.screenshot({ path: `${state}-${device}-${colorScheme}.png` })
    await page.close()
  }
}

const context = await browser.newContext({
  viewport: viewports.desktop,
  recordVideo: { dir: "recordings", size: viewports.desktop },
})
const page = await context.newPage()
await page.goto(`${base}/`)
// Drive the flow here with clicks and scrolling, pausing briefly between steps.
await context.close()
await browser.close()
```

Pass `fullPage: true` to `page.screenshot` for a long page such as a blog post. The recording is
saved as a `.webm` file in `recordings/` when its context closes.

## Attach the media

GitHub has no API for the attachments its web editor uploads, so agents attach media with
`scripts/attach-pr-media.sh`:

```sh
scripts/attach-pr-media.sh before-desktop-light.png after-desktop-light.png recordings/flow.webm
git push
```

The script commits the files to `.pr-media/` on the pull request branch and removes them in a
second commit. It prints Markdown with permanent links to the first commit, which GitHub keeps in
the pull request after the branch is merged and deleted. The squash merge into `main` contains
neither the files nor any change from them, and CI fails if `.pr-media/` remains. Recordings
become a GIF that plays in the description and an MP4 link, because GitHub plays video only from
its own uploads. The conversion needs `ffmpeg`.

Put the images in the template's table, one row per state:

```md
| Before | After |
| --- | --- |
| ![before-desktop-light](https://raw.githubusercontent.com/…/before-desktop-light.png) | ![after-desktop-light](https://raw.githubusercontent.com/…/after-desktop-light.png) |
```

Run the script again after a rebase or a force push, because rewriting the branch drops the commit
the links point to. People can drag files into the GitHub editor instead.
