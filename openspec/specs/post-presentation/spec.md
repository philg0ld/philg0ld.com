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
