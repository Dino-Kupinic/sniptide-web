# Changelog

`/changelog` lists every release of the app repo, newest first, read from the GitHub API
(`lib/changelog-source.ts`) and refreshed hourly, so a release appears without a deploy. The list
shows 20 rows and loads 20 more as the reader scrolls. Each release has an anchor such as
`/changelog#v0.77.0`, and a link to an older one loads the page that holds it.

The app repo's release workflow asks a model to turn the merged pull requests into a short post and
writes it to the top of the release body between `<!-- sniptide-notes:start kind="…" -->` and
`<!-- sniptide-notes:end -->`. `kind` is `feature`, `fix` or `internal`. The first heading inside
the markers is the title, and the rest renders as Markdown without raw HTML. Written posts follow
one template: a paragraph, then **What's new** or **What's fixed**, then **Self-hosting** when
operators have a step to take. To correct a post, edit
the release on GitHub. Releases without the markers fall back to the semantic-release list: the
first feature or fix is the title, and releases with only CI, test or maintenance commits count as
internal. Consecutive internal releases collapse into one row.

The newest featured release from the last 14 days also fills a blue bar above the header on the
landing page and every blog and changelog page (`components/announcement-bar.tsx`). A release is
featured when its marker reads `kind="feature" featured="true"`, which the release workflow sets
from a `featured` label on the pull request. It links to
that release in the changelog and scrolls away with the page. The bar is a pane of blue glass
over the Game of Life, like the window on the pink sharing section; its colors keep white text
above 4.5:1 even over a lit cell. Closing it stores the version in
`localStorage`, and a small inline script hides it before the page paints, so it stays closed until
a newer featured release ships. Unflagged features, fixes and maintenance releases never take the
bar.

Set `GITHUB_TOKEN` to raise GitHub's rate limit from 60 requests an hour per address, which builds
and other services on the same server share. The token needs no scopes. The changelog renders on
each request from an hourly cache of the releases, so a failed fetch is retried on the next visit
instead of staying in a prerendered page. Until GitHub answers, the page links to the releases on
GitHub and the server logs the reason.
