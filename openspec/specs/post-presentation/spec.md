# post-presentation Specification

## Purpose

Defines how blog content is presented to readers: post page layout (title, metadata, hero, tags), the blog index listing, the homepage recent-writing list, and the date formatting helper that supports both forms. Scoped to presentation only — does not change URLs, the RSS feed, the sitemap, or analytics.

## Requirements

### Requirement: Blog post header — left-aligned, simple metadata

A blog post page SHALL render its title left-aligned (not centered), with the publication date displayed in muted color directly above or below the title in a single line. The "Last updated on …" line SHALL render only when `updatedDate` is set in frontmatter.

#### Scenario: Title alignment

- **WHEN** a post page renders
- **THEN** the `<h1>` `text-align` resolves to `left` (or the default block flow alignment), not `center`

#### Scenario: Updated date conditional

- **WHEN** a post's frontmatter has no `updatedDate`
- **THEN** no "Last updated on …" text appears on the page

#### Scenario: Updated date shown

- **WHEN** a post's frontmatter sets `updatedDate`
- **THEN** the rendered page includes "Last updated on <formatted date>"

### Requirement: Hero image is optional and not visually dominant

A blog post page SHALL render the `heroImage` above the title when present and SHALL render no hero block when absent. The hero image SHALL NOT use a drop shadow that visually dominates the page.

#### Scenario: Post without hero image

- **WHEN** a post's frontmatter has no `heroImage`
- **THEN** no empty hero placeholder or empty `<div class="hero-image">` is rendered

#### Scenario: Post with hero image

- **WHEN** a post's frontmatter sets `heroImage`
- **THEN** the image renders above the title at full prose-column width without a heavy `box-shadow`

### Requirement: Tags rendered as `#hashtag` labels

A blog post page SHALL render each tag from `data.tags` as a `#tagname` styled label at the end of the post (below the body). Tags SHALL render as non-anchor `<span>` elements in v1 (no clickable destination until tag pages exist).

#### Scenario: Tag rendering

- **WHEN** a post with `tags: ["databricks", "ai"]` is rendered
- **THEN** the page contains `#databricks` and `#ai` labels as non-anchor styled spans

#### Scenario: Post with no tags

- **WHEN** a post has `tags: []` or no `tags` field
- **THEN** no tag block is rendered

### Requirement: Blog index — single-column list with `YYYY-MM` date prefix and Topics cloud

The `/blog/` route SHALL render a Topics tag cloud (per the `Topics tag cloud on home and blog index` requirement), followed by posts as a single vertical list ordered newest-first, grouped by year under `#YYYY` headings. Each entry SHALL display the publication date in `YYYY-MM` format followed by the post title, both inside one anchor linking to the post. The blog index SHALL NOT render hero images or post descriptions.

#### Scenario: Listing format

- **WHEN** `/blog/` renders with at least one post dated 2026-05-12
- **THEN** that entry shows `2026-05` as a muted prefix and the post title next to or under it, with both wrapped in a single `<a>` to the post URL

#### Scenario: No images on listing

- **WHEN** `/blog/` renders
- **THEN** no `<img>` elements appear inside the post list

#### Scenario: Draft exclusion preserved

- **WHEN** the blog collection contains a post with `draft: true`
- **THEN** that post does not appear in the `/blog/` listing

#### Scenario: Year grouping

- **WHEN** `/blog/` renders with posts spanning multiple years
- **THEN** posts are grouped under year headings (`<h2>` styled as `#YYYY` via CSS `::before`), newest year first

### Requirement: Homepage — intro paragraphs, topics cloud, and full writing list

The `/` route SHALL render, in order: (1) two substantive intro paragraphs (no `<h1>`), (2) a Topics tag cloud built from the blog collection, (3) a small-caps `WRITING` eyebrow heading, (4) the full list of published posts in the same single-column `YYYY-MM` + title format used by `/blog/`. The homepage SHALL NOT render hero images, a large hero block, a marketing CTA, or a top-level `<h1>` element inside `<main>`.

#### Scenario: No H1 inside main

- **WHEN** `/` renders
- **THEN** there is no `<h1>` element inside `<main>` (the nav wordmark above `<main>` is the only place the site name appears)

#### Scenario: Two intro paragraphs

- **WHEN** `/` renders
- **THEN** the page contains at least two distinct `<p>` elements before the Topics cloud, written as bio prose (who I am + what I write about), not as a one-line tagline

#### Scenario: Topics cloud present

- **WHEN** `/` renders and the blog collection contains at least one published post with at least one tag
- **THEN** the page contains a Topics section listing every unique tag from the published collection, rendered using `.tag-pill` elements

#### Scenario: Eyebrow heading

- **WHEN** `/` renders
- **THEN** the post list is preceded by an `<h2 class="eyebrow">WRITING</h2>` element, not a default-weight `<h2>` reading "Recent writing"

#### Scenario: All posts listed

- **WHEN** `/` renders and the blog collection contains N published posts
- **THEN** N entries appear in the homepage writing list (no slice / cap)

#### Scenario: Draft exclusion preserved

- **WHEN** the blog collection contains a post with `draft: true`
- **THEN** that post does not appear in the homepage writing list, and its tags do not contribute to the Topics cloud counts

### Requirement: Topics tag cloud on home and blog index

Both the `/` route and the `/blog/` route SHALL render a Topics section that lists every unique tag from the published blog collection, with a post count next to each tag, rendered using the `.tag-pill` class. Each pill SHALL link to `/search/?q=<tag>` (URL-encoded). Tags SHALL be sorted by post count descending, then alphabetically ascending.

#### Scenario: Same component on both pages

- **WHEN** both `/` and `/blog/` are rendered
- **THEN** their Topics sections use the same `.tag-pill` markup and styling (single declaration source)

#### Scenario: Pill links to search

- **WHEN** a Topics pill for tag `databricks` renders
- **THEN** its `href` is `/search/?q=databricks` (URL-encoded if the tag contains special characters)

#### Scenario: Sort order

- **WHEN** the published collection has tags `a` (3 posts), `b` (3 posts), `c` (1 post)
- **THEN** the Topics cloud renders pills in the order `a`, `b`, `c` (count desc, then name asc)

#### Scenario: Empty collection

- **WHEN** the published collection has zero tags
- **THEN** no Topics section is rendered (no empty heading or empty pill list)

### Requirement: Date formatting helper supports `YYYY-MM`

The `FormattedDate` component (or an equivalent helper) SHALL accept a `format` prop (or equivalent) that produces the `YYYY-MM` form, defaulting to the existing long-form format for backwards compatibility.

#### Scenario: Long-form default

- **WHEN** `<FormattedDate date={someDate} />` is rendered without a format prop
- **THEN** it renders the existing long-form date used today on post pages

#### Scenario: Year-month format

- **WHEN** `<FormattedDate date={2026-05-12} format="year-month" />` (or equivalent invocation) is rendered
- **THEN** it produces `2026-05`

### Requirement: URLs and feeds unchanged

The change SHALL NOT alter any URL, the RSS feed contents structure, or the sitemap routes. The GA tracking snippet SHALL remain in place unchanged.

#### Scenario: URL stability

- **WHEN** comparing the list of routes produced by `npm run build` before and after the change
- **THEN** the set of generated HTML paths is identical

#### Scenario: GA snippet intact

- **WHEN** inspecting the built HTML of any page
- **THEN** the Google Analytics script tag with `G-QHL6MG41R7` is present and unchanged

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
