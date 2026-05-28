## ADDED Requirements

### Requirement: Markdown footnotes rendered as side notes

A blog post page SHALL render footnotes authored as standard markdown footnote references (`[^1]`) and definitions (`[^1]: text`) as right-margin side notes positioned at the vertical line of their reference, not in a bottom footnotes block. The transformation SHALL be implemented as an in-repo rehype plugin registered in `astro.config.mjs`'s `markdown.rehypePlugins`; no new npm dependency SHALL be introduced. The side note SHALL preserve the footnote's reference number as a bolded prefix (e.g., `1.`). On viewports narrower than `--prose-max-width + ~280px`, side notes SHALL collapse to inline block-level placement immediately after the reference's parent paragraph, preserving the numeric marker.

#### Scenario: Footnote rendered as side note on wide viewport

- **WHEN** a blog post containing `[^1]` in body and `[^1]: See my post on AI paradigms.` at end of file is rendered on a viewport wider than `--prose-max-width + 280px`
- **THEN** an `<aside class="side-note">` containing "1." plus the footnote text appears in the right gutter, vertically aligned to the paragraph containing the `[^1]` reference

#### Scenario: Bottom footnotes block removed

- **WHEN** a blog post with footnotes is rendered
- **THEN** the rendered HTML contains no trailing `<section class="footnotes">` block (the default footnote container emitted by remark-gfm has been removed by the plugin)

#### Scenario: Reference superscript preserved

- **WHEN** a blog post body contains `[^1]`
- **THEN** the rendered paragraph contains a superscript anchor (e.g., `<sup><a href="#user-content-fn-1">1</a></sup>`) at the reference point, even though the destination footnote no longer exists as a block at the bottom

#### Scenario: Narrow-viewport fallback

- **WHEN** a blog post with footnotes is rendered on a viewport narrower than `--prose-max-width + 280px`
- **THEN** each `.side-note` renders as a block-level element placed immediately after its reference's parent paragraph (not in the gutter and not in a trailing footnotes block), preserving the numeric prefix

#### Scenario: No new runtime dependency

- **WHEN** comparing `package.json` before and after the change
- **THEN** no new entry appears under `dependencies` or `devDependencies` (the plugin lives at `src/lib/rehype-sidenotes.mjs` inside the repo)

#### Scenario: Posts without footnotes unaffected

- **WHEN** a blog post that contains no `[^N]` references is rendered
- **THEN** no `<aside class="side-note">` and no empty trailing footnotes block appear in the rendered HTML

### Requirement: Related-posts block at the end of each post

A blog post page SHALL render a "You might also enjoy" section AFTER the share-button row (see "Share-this-post button row on post pages") and before the site footer. The section SHALL list up to 5 other published posts ranked by tag-overlap score (count of shared tags with the current post, descending), with publication date descending as the tiebreaker. If no candidate post shares any tag with the current post (e.g., the current post has no tags), the section SHALL fall back to the 5 most recent published posts excluding the current one. The current post SHALL NOT appear in its own related list. Draft posts SHALL NOT appear in the related list. Each list entry SHALL render as a single `<a>` element containing the post's title only (no date prefix, no description, no hero image). If the published collection contains fewer than 2 posts in total, no related section SHALL be rendered.

#### Scenario: Related selection by shared tags

- **WHEN** the current post has tags `["databricks", "ai"]` and the published collection contains five other posts with tag overlaps of 2, 1, 1, 0, 0 respectively
- **THEN** the related list renders the three posts with non-zero overlap in score-descending order, followed by the two zero-overlap posts in pubDate-descending order (capped at 5 total)

#### Scenario: Recency tiebreaker

- **WHEN** two candidate posts have the same tag-overlap score with the current post
- **THEN** the more recently published post appears first in the related list

#### Scenario: Fallback to recent when no tags overlap

- **WHEN** the current post has `tags: []` or no candidate shares any tag with it
- **THEN** the related list contains the 5 most recent published posts excluding the current post, in pubDate-descending order

#### Scenario: Current post excluded

- **WHEN** the related list is computed for a post titled "Foo"
- **THEN** no entry in the rendered list links to that post's own URL

#### Scenario: Drafts excluded

- **WHEN** the published collection contains a post with `draft: true`
- **THEN** that post never appears in the related list of any other post

#### Scenario: Empty-collection guard

- **WHEN** the published collection contains fewer than 2 published posts
- **THEN** the "You might also enjoy" section is not rendered (no empty heading, no empty list)

#### Scenario: Minimal entry markup

- **WHEN** a related-list entry renders
- **THEN** the entry is a single `<a>` element containing only the post's title (no date prefix, no description, no `<img>`)

### Requirement: Share-this-post button row on post pages

A blog post page SHALL render a row of four share buttons AFTER the post body and tags, BEFORE the "You might also enjoy" related-posts section, and before the site `<Footer />`. Final tail order on a post page: body → tags → share-button row → related-posts → footer. The row SHALL appear inside a full-bleed container with `background: var(--color-rule)` (the cool slate-200 token) and centered content. The four buttons, in this order, SHALL be LinkedIn, X / Twitter, Bluesky, and GitHub. The LinkedIn, X, and Bluesky buttons SHALL use platform share-intent URLs that pre-fill with the current post's canonical URL and title. The GitHub button SHALL link to the static profile URL `https://github.com/philg0ld` (GitHub has no share intent); its `aria-label` SHALL read "GitHub profile", not "Share on GitHub". Each anchor SHALL open in a new tab (`target="_blank" rel="noopener noreferrer"`) and SHALL contain an inline SVG icon (no icon library dependency). The share-button row SHALL NOT appear on the homepage (`/`), the blog index (`/blog/`), the About page, or any other non-post route.

#### Scenario: Row appears on a post page

- **WHEN** a blog post page renders
- **THEN** the page contains a slate-banded row with exactly four anchor elements pointing, in order, to a LinkedIn share intent, an X share intent, a Bluesky share intent, and the GitHub profile `https://github.com/philg0ld`

#### Scenario: LinkedIn share intent

- **WHEN** the LinkedIn share anchor renders on a post whose canonical URL is `U`
- **THEN** its `href` is `https://www.linkedin.com/sharing/share-offsite/?url={encodeURIComponent(U)}`

#### Scenario: X share intent with via attribution

- **WHEN** the X share anchor renders on a post with title `T` and canonical URL `U`
- **THEN** its `href` is `https://twitter.com/intent/tweet?text={encodeURIComponent(T)}&url={encodeURIComponent(U)}&via=philg0ld`

#### Scenario: Bluesky share intent

- **WHEN** the Bluesky share anchor renders on a post with title `T` and canonical URL `U`
- **THEN** its `href` is `https://bsky.app/intent/compose?text={encodeURIComponent(T + " " + U)}`

#### Scenario: GitHub is a profile link, not a share intent

- **WHEN** the GitHub anchor renders
- **THEN** its `href` is the literal string `https://github.com/philg0ld` (regardless of which post is being viewed) and its `aria-label` is `"GitHub profile"`, not `"Share on GitHub"`

#### Scenario: New-tab safety on all four anchors

- **WHEN** any of the four share-row anchors renders
- **THEN** it has `target="_blank"` and `rel="noopener noreferrer"`

#### Scenario: Row absent on non-post routes

- **WHEN** the homepage (`/`), the blog index (`/blog/`), or the About page renders
- **THEN** no share-button row appears anywhere in the rendered HTML

#### Scenario: No icon library dependency

- **WHEN** comparing `package.json` before and after the change
- **THEN** no icon-library package (`@iconify/*`, `lucide-*`, `react-icons`, `@fortawesome/*`, etc.) appears under `dependencies` or `devDependencies` (the four icons are inlined as SVG inside `ShareButtons.astro`)
