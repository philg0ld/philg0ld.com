## Context

The site ships with the unmodified Astro Blog Starter (Bear Blog lineage): a Bear-derived `global.css`, a centered-title `BlogPost.astro`, and an image-grid `blog/index.astro`. Atkinson Hyperlegible is already loaded locally via Astro's fonts API. Build is Astro 6 + MDX → static HTML on GitHub Pages; no client-side framework. We're applying a kau.sh-family visual identity without taking on new runtime dependencies or changing the content model. Stakeholder is one person (me); review surface is "does it look right in the browser."

## Goals / Non-Goals

**Goals:**
- Match the kau.sh family resemblance: narrow centered prose column, restrained palette, text-forward hierarchy, simple metadata, hashtag-style tags.
- Keep Atkinson Hyperlegible as the body face — it's already loaded, accessibility-positive, and works inside a text-forward design.
- Keep build output size flat or smaller (no new fonts, no new client JS, no icon libraries).
- Preserve all URLs, the RSS feed, sitemap, and the GA snippet exactly as-is.

**Non-Goals:**
- Dark mode (separate change).
- Tag archive pages or working `#hashtag` links — render tags as plain hashtag-styled inline labels for now; routes come later.
- Pixel cloning of kau.sh. We're after the reading feel, not the exact CSS.
- Any change to the content collection schema, MDX components, or build pipeline.

## Decisions

### D1. CSS architecture: extend `src/styles/global.css`, no Tailwind, no CSS-in-JS

`AGENTS.md` already forbids introducing Tailwind/CSS-in-JS without explicit ask. Keep the single `global.css` + per-component scoped `<style>` blocks. Refactor `global.css` to use a flat token layer (`--color-*`, `--space-*`, `--text-*`) at `:root`, then base element styles consume those tokens. Per-component scoped styles override layout-specific concerns only (post header, listing).

*Alternative considered:* Split into `tokens.css` + `base.css` + `prose.css`. Rejected — adds three import lines for a ~250-line stylesheet. Single file is fine until it isn't.

### D2. Color palette: warm-neutral background, near-black ink, single accent

- Background: off-white warm neutral (`#fafaf7` range), not pure white. Removes the Bear gradient-strip background.
- Ink: near-black (`#1a1a1a` range), not pure black.
- Muted text (dates, meta): mid-gray.
- Accent: single hue used for links, blockquote bar, and active nav underline. Replace the loud indigo (`#2337ff`) with something more restrained — a desaturated blue-gray or muted red.
- No gradients anywhere.

*Alternative considered:* Match kau.sh hex-for-hex. Rejected — site identity should feel like a sibling, not a copy. Plus the exact kau.sh colors weren't extractable from the rendered pages.

### D3. Typography: Atkinson body, modular scale tightened

- Body: Atkinson Hyperlegible (already loaded), 18–19px base, line-height ~1.6.
- Headings: same Atkinson face, weight 700, tighter line-height (~1.25). Pull down the modular scale from the current 1.25 ratio (h1 = 3.05em) to ~1.2 (h1 ≈ 2.0–2.4em) — current H1 is comically large at 3.05em on a ~720px column.
- Inline code + code blocks: system monospace stack (`ui-monospace, "SF Mono", Menlo, Consolas, monospace`). No web monospace download.

*Alternative considered:* Swap to a sans like Inter or a serif. Rejected — Atkinson is already paid for in bytes, is highly readable, and gives the site a small differentiator vs the "Inter everywhere" default.

### D4. Code highlighting: configure Shiki via `astro.config.mjs`

Astro ships Shiki built-in. Set `markdown.shikiConfig.themes` to a light theme that reads on the warm-neutral background (`github-light`, `min-light`, or `vitesse-light` are stock options — pick by eye). Set a single theme; no dual-theme dance until dark mode lands. Add small CSS to the code block: tighter padding, subtle 1px border instead of a heavy background, monospace stack.

*Alternative considered:* Bring in `expressive-code`. Rejected — extra dep + bundle weight for features (line highlights, copy button) we don't need yet.

### D5. Blog index: vertical list, `YYYY-MM` prefix, no images

Replace the two-column flex grid. Each item: `<YYYY-MM>` in muted gray on the left, post title on the right, both inside a single anchor. Hero images are not shown on the listing. Wrap responsively to two lines on mobile.

*Alternative considered:* Keep the hero-image grid as a secondary listing. Rejected — kau.sh deliberately avoids visual weight on the index; we want the same scan-the-titles feel.

### D6. Blog post header: left-aligned title, date below, tags as `#hashtag`

Move from centered to left-aligned, drop the surrounding box-padded date block. Render tags below the post body as inline `#tag` links — styled, but pointing to `#` href until a tag-page change is done. Hero image keeps its current placement above the title if present; if absent, no empty space.

*Alternative considered:* Drop hero images entirely. Rejected — they're already in the schema and useful for posts that benefit from them.

### D7. Header / nav: keep current structure, restyle

Keep "Home / Blog" links and the GitHub + LinkedIn icons. Don't introduce kau.sh's "Writing / Letters / About" labels — we don't have those sections. Restyle to a thinner header, no white panel, no shadow, simple underline on hover/active.

### D8. Homepage: brief intro + recent-posts list

Replace the current one-paragraph + `Read the blog →` link with a kau.sh-style two-block layout: short personal intro paragraph (already in `consts.ts`'s SITE_DESCRIPTION territory), then a "Recent writing" list rendered the same way as `/blog/`. No tag cloud in v1 (kau.sh has one, but it needs working tag pages, which is out of scope).

### D9. Date formatting: `YYYY-MM` on listings, full date on posts

Add a `formatYearMonth(date)` helper, or extend `FormattedDate.astro` with a `format` prop. Post pages keep the existing long-form date. Listings use `2026-05` style.

## Risks / Trade-offs

- **[Visual diff on every page]** → Mitigation: do a `npm run build && npm run preview` sweep through `/`, `/blog/`, and at least one post before committing. Existing posts are few; manual eyeball is cheap.
- **[Lighthouse / CLS regression from removing background gradient or restyling fonts]** → Mitigation: Atkinson is preloaded via `<Font>` already; no font swap. Smaller H1 actually reduces layout shift risk. Run Lighthouse after build to confirm.
- **[Tags rendered as `#tag` look like working links but aren't routable]** → Mitigation: link them to `#` and add `title="Tag pages not yet implemented"`, OR render as non-anchor styled spans. Pick non-anchor for v1 to avoid lying to the reader.
- **[Replacing indigo accent breaks brand consistency with anything off-site]** → Mitigation: site has no brand kit yet, so this is the moment to pick the accent intentionally.
- **[Shiki theme change re-renders all code blocks]** → No mitigation needed; static rebuild handles it. Just verify a post with a code block renders correctly.
- **[Bundle size]** → Net change should be ≈ zero. No new deps; we may delete a few CSS rules. Code highlighting theme is config, not a dep.

## Migration Plan

Single PR / single push to `main`:
1. Land tokens + base CSS rewrite in `global.css`.
2. Update component scoped styles + `BlogPost.astro` layout in the same commit (they reference the same token names).
3. Update `astro.config.mjs` Shiki theme.
4. Update `index.astro` and `blog/index.astro`.
5. Build + preview locally, eyeball every existing route.
6. Push. GH Actions deploys. Rollback = `git revert`.

No data migration, no schema change, no redirect. Old URLs keep working.

## Open Questions

- Exact accent color hex — needs an eyeball pick during implementation, not now.
- Whether to render tags as styled spans or non-routing anchors in v1 — decided above (spans), but worth a second look during build.
- Whether to keep the `heroImage` field on the schema if we stop showing it on listings — keeping it (still used on post pages), no schema change needed.
