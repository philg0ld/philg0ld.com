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

### Requirement: Blog index — single-column list with `YYYY-MM` date prefix

The `/blog/` route SHALL render posts as a single vertical list ordered newest-first. Each entry SHALL display the publication date in `YYYY-MM` format followed by the post title, both inside one anchor linking to the post. The blog index SHALL NOT render hero images or post descriptions.

#### Scenario: Listing format

- **WHEN** `/blog/` renders with at least one post dated 2026-05-12
- **THEN** that entry shows `2026-05` as a muted prefix and the post title next to or under it, with both wrapped in a single `<a>` to the post URL

#### Scenario: No images on listing

- **WHEN** `/blog/` renders
- **THEN** no `<img>` elements appear inside the post list

#### Scenario: Draft exclusion preserved

- **WHEN** the blog collection contains a post with `draft: true`
- **THEN** that post does not appear in the `/blog/` listing

### Requirement: Homepage — intro paragraph plus recent writing list

The `/` route SHALL render a short personal intro paragraph followed by a "Recent writing" list using the same single-column `YYYY-MM` + title format as `/blog/`. The homepage SHALL NOT render hero images, a large hero block, or a marketing CTA.

#### Scenario: Homepage layout

- **WHEN** `/` renders
- **THEN** the page contains a `<p>` intro paragraph and a list of recent posts formatted identically to entries on `/blog/`

#### Scenario: No standalone "Read the blog →" link

- **WHEN** `/` renders
- **THEN** there is no standalone "Read the blog →" call-to-action paragraph in place of the post list

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
