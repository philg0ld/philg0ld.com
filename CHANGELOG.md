# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog 1.1.0](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning 2.0.0](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

- Changed: Refined theme to match kau.sh visual fingerprint — cool-slate palette, italic-serif (Source Serif 4) prose headings, decorative `##` H2 markers, footnotes as right-margin side notes, `* * *` section dividers, related-posts block, share-this-post buttons on post pages, sharp media corners
- Added: `src/lib/rehype-sidenotes.mjs` — in-repo rehype plugin that rewrites markdown footnotes into inline `<aside class="side-note">` elements
- Added: `RelatedPosts.astro` ("You might also enjoy") component, ranked by tag overlap with recency tiebreaker
- Added: `ShareButtons.astro` row on blog post pages — LinkedIn / X / Bluesky share intents plus a GitHub profile link
- Added: Interactive `##` section anchors on H2 headings (hover hot-orange; click copies the section URL and flashes a checkmark) via in-repo `rehype-heading-anchors.mjs`
- Changed: Post-page tail order is now body → tags → share-band → related-posts (matches kau.sh post layout)
- Fixed: Side-note label now uses the sequential number from the body superscript instead of the raw footnote ID — named footnotes like `[^kaush]` previously rendered as `kaush.` instead of `1.`
- Changed: Hover on nav links, prose links, related-post links, and share icons now uses `--color-hot` orange and drops the underline — matches kau.sh's link signature
- Changed: Section headings (`.prose h2`) now render in italic Source Serif 4 to share H1's typographic rhythm
- Changed: Related-posts list (`.related ul`) uses kau.sh-style left margin (`0.9em`) instead of bullet-padding indent for tighter alignment under the eyebrow
- Changed: Related-posts `<li>` swapped padding (`0.2em 0`) for `margin-top: 0.25em` to match kau.sh's tighter row rhythm
- Changed: Site header is now sticky (`position: sticky; top: 0; z-index: 40`) with an opaque `--color-bg` background so the nav stays visible while scrolling
- Added: `src/lib/rehype-callouts.mjs` — in-repo rehype plugin that transforms blockquotes starting with `[!type] Title` (Obsidian / GFM syntax) into `<blockquote class="callout callout-{type}">` with a styled title row. Recognised types: note, tip, important, warning, caution, info
- Added: Source Serif 4 weights 500 and 600 italic to the font config
- Changed: `.prose h1` from italic 700 to italic 500; `.prose h2` from italic 700 to italic 600 — lighter heading rhythm closer to kau.sh

## [0.0.2] — 2026-05-25

Homepage rework to better match the kau.sh-family structure.

- Changed: Reworked homepage to a kau.sh-shaped layout — two-paragraph intro (no big H1), Topics tag cloud, small-caps "Writing" eyebrow, full post list (no cap)
- Changed: `/blog/` Topics cloud restyled to use the new bordered ALL-CAPS pill style
- Changed: Header nav now constrained to the same width as the prose column (wordmark + links align with main content instead of viewport edges)
- Added: Reusable `.eyebrow` and `.tag-pill` classes in `global.css`
- Added: Shared `PostList` component used by `/` and `/blog/`

## [0.0.1] — 2026-05-25

First tagged release. Site is live at [philg0ld.com](https://philg0ld.com).

- Added: About page (`/about/`) with bio, link sections, and colophon
- Added: Search page (`/search/`) with Pagefind static full-text search; build script now runs `pagefind --site dist`
- Added: Topics tag cloud and year-grouped post list on `/blog/` (e.g. `#2026`, `#2025`)
- Added: Search icon in nav (links to `/search/`)
- Added: Four test blog posts exercising prose, code blocks, images, and longform structure
- Changed: Renamed nav link "Blog" → "Writing"
- Removed: GitHub and LinkedIn icons from nav (still linked from `/about/`)
- Changed: Applied kau.sh-family theme — narrow centered prose column, restrained warm-neutral palette with desaturated blue accent, left-aligned post titles, single-column blog index with YYYY-MM date prefix, hashtag-styled tags, github-light Shiki code theme
