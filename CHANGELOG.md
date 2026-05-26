# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog 1.1.0](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning 2.0.0](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
