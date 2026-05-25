**Outcome:** philg0ld.com looks and reads like a kau.sh-family text-forward blog instead of the default Astro/Bear starter.

## Why

The current theme is the unmodified Astro Blog Starter (Bear Blog lineage) with a generic indigo accent, centered post titles, and a two-column image-grid blog index. It signals "starter template," not "engineer who writes." Kaushik Gopal's [kau.sh](https://kau.sh/blog/) — the explicit voice anchor in `AGENTS.md` — has a stable, recognizable visual identity built around a narrow centered column, restrained typography, hashtag tags, and a Writing/Letters/About three-pillar nav. Aligning the visual layer to match the writing style we already commit to (problem-first narrative, concrete examples, no fluff) removes a small but persistent dissonance and makes the site feel intentional.

## What Changes

- Replace Bear Blog defaults in `src/styles/global.css` with a kau.sh-aligned design system: muted neutrals, single restrained accent, refined modular type scale, tighter prose line-length (~680–720px), distinctive blockquote and inline-code treatment.
- Rework `src/layouts/BlogPost.astro` to a left-aligned title, simplified date/tag metadata, and a less hero-dominated header. Tags rendered as `#hashtag` links.
- Rework `src/pages/blog/index.astro` from a two-column image grid to a single-column reverse-chronological list with `YYYY-MM` date prefix and post title only (no hero, no excerpt).
- Rework `src/pages/index.astro` homepage to mirror kau.sh: brief personal intro, optional tag cloud, recent-writing list — all in one column, no large hero.
- Configure a code-block syntax highlighting theme (Shiki) that reads cleanly on the new background and matches the restrained palette.
- Keep Atkinson Hyperlegible as the body font (accessibility win, already loaded), but adjust size/leading to match the kau.sh reading rhythm.
- **BREAKING:** Visual diff on every existing page. No URL or schema changes.

## Capabilities

### New Capabilities

- `site-theme`: Global visual identity — color tokens, typography scale, spacing, link styling, code/blockquote treatment, and the page-shell layout (header, footer, content column width).
- `post-presentation`: How blog posts and the blog index render — post page metadata layout, tag rendering, listing format, date display conventions.

### Modified Capabilities

None (no prior specs exist).

## Impact

- **Code:** `src/styles/global.css`, `src/layouts/BlogPost.astro`, `src/components/Header.astro`, `src/components/Footer.astro`, `src/pages/index.astro`, `src/pages/blog/index.astro`, `astro.config.mjs` (Shiki theme config), `src/components/FormattedDate.astro` (date format helpers).
- **Dependencies:** No new runtime deps expected. Shiki ships with Astro; theme is config-only.
- **Content:** Existing posts render against the new theme. No frontmatter migration. Posts without `heroImage` look the same on the listing as posts with one (intentional).
- **Out of scope / Non-goals:**
  - No dark mode toggle (kau.sh itself is light-only; defer to a separate change).
  - No comments, newsletter signup, or search.
  - No content-collection schema changes.
  - No URL changes; no redirects needed.
  - Not a pixel-perfect clone of kau.sh — aim for the family resemblance and reading feel, not a copy.
