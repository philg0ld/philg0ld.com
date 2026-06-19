# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog 1.1.0](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning 2.0.0](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

- Added: Drafted VLM document extraction evaluation article with SVG and Excalidraw diagrams

## [0.0.3] — 2026-05-27

**Added:**

- `src/lib/rehype-sidenotes.mjs` — in-repo rehype plugin that rewrites markdown footnotes into inline `<aside class="side-note">` elements
- `RelatedPosts.astro` ("You might also enjoy") component, ranked by tag overlap with recency tiebreaker
- `ShareButtons.astro` row on blog post pages — LinkedIn / X / Bluesky share intents plus a GitHub profile link
- Interactive `##` section anchors on H2 headings (hover hot-orange; click copies the section URL and flashes a checkmark) via in-repo `rehype-heading-anchors.mjs`
- `src/lib/rehype-callouts.mjs` — in-repo rehype plugin that transforms blockquotes starting with `[!type] Title` (Obsidian / GFM syntax) into `<blockquote class="callout callout-{type}">` with a styled title row. Recognised types: note, tip, important, warning, caution, info
- Source Serif 4 weights 500 and 600 italic to the font config

**Changed:**

- Refined theme to match kau.sh visual fingerprint — cool-slate palette, italic-serif (Source Serif 4) prose headings, decorative `##` H2 markers, footnotes as right-margin side notes, `* * *` section dividers, related-posts block, share-this-post buttons on post pages, sharp media corners
- Post-page tail order is now body → tags → share-band → related-posts (matches kau.sh post layout)
- Hover on nav links, prose links, related-post links, and share icons now uses `--color-hot` orange and drops the underline — matches kau.sh's link signature
- Section headings (`.prose h2`) now render in italic Source Serif 4 to share H1's typographic rhythm
- Related-posts list (`.related ul`) uses kau.sh-style left margin (`0.9em`) instead of bullet-padding indent for tighter alignment under the eyebrow
- Related-posts `<li>` swapped padding (`0.2em 0`) for `margin-top: 0.25em` to match kau.sh's tighter row rhythm
- Site header is now sticky (`position: sticky; top: 0; z-index: 40`) with an opaque `--color-bg` background so the nav stays visible while scrolling
- `.prose h1` from italic 700 to italic 500; `.prose h2` from italic 700 to italic 600 — lighter heading rhythm closer to kau.sh
- `.eyebrow` font-size 0.85em → 0.65em — small-caps section labels (TOPICS, WRITING) now ~12px, closer to kau.sh's subtle section dividers
- `.tag-pill` padding tightened (0.35em 0.7em → 0.2em 0.55em) and font-size 0.8em → 0.75em — tag cloud reads more compact
- PostList row padding tightened (0.35em → 0.15em) — tighter vertical rhythm on Writing list
- Home page browser-tab title is now "Phil Goldman's Website" (was "Phil Goldman") — clearer in tab strips
- `/blog/` browser-tab title is now "Phil Goldman's blog posts - Phil Goldman's Website" (was "Writing — Phil Goldman") — matches the `<Name>'s blog posts - <Name>'s Website` pattern

**Fixed:**

- Side-note label now uses the sequential number from the body superscript instead of the raw footnote ID — named footnotes like `[^kaush]` previously rendered as `kaush.` instead of `1.`

**Removed:**

- `<h1>Writing</h1>` page heading on `/blog/` — page now opens directly with the Topics cloud, matching kau.sh's quieter intro
- Year-grouping headings (`#2026`, `#2025`, `#2024`) on `/blog/` — post list is now flat with mono `YYYY-MM` date prefix on each row

## [0.0.2] — 2026-05-25

Homepage rework to better match the kau.sh-family structure.

**Added:**

- Reusable `.eyebrow` and `.tag-pill` classes in `global.css`
- Shared `PostList` component used by `/` and `/blog/`

**Changed:**

- Reworked homepage to a kau.sh-shaped layout — two-paragraph intro (no big H1), Topics tag cloud, small-caps "Writing" eyebrow, full post list (no cap)
- `/blog/` Topics cloud restyled to use the new bordered ALL-CAPS pill style
- Header nav now constrained to the same width as the prose column (wordmark + links align with main content instead of viewport edges)

## [0.0.1] — 2026-05-25

First tagged release. Site is live at [philg0ld.com](https://philg0ld.com).

**Added:**

- About page (`/about/`) with bio, link sections, and colophon
- Search page (`/search/`) with Pagefind static full-text search; build script now runs `pagefind --site dist`
- Topics tag cloud and year-grouped post list on `/blog/` (e.g. `#2026`, `#2025`)
- Search icon in nav (links to `/search/`)
- Four test blog posts exercising prose, code blocks, images, and longform structure

**Changed:**

- Renamed nav link "Blog" → "Writing"
- Applied kau.sh-family theme — narrow centered prose column, restrained warm-neutral palette with desaturated blue accent, left-aligned post titles, single-column blog index with YYYY-MM date prefix, hashtag-styled tags, github-light Shiki code theme

**Removed:**

- GitHub and LinkedIn icons from nav (still linked from `/about/`)
