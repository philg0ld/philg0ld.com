## 1. Tokens & primitives in global.css

- [x] 1.1 Add `.eyebrow` class to `src/styles/global.css`: `font-family: var(--font-mono)`, `color: var(--color-muted)`, `text-transform: uppercase`, `letter-spacing: 0.08em`, `font-size: 0.85em`, `font-weight: 400`, `margin-top: 2.5em`, `margin-bottom: 1em`. Resets default H2 sizing when applied to an `<h2>`.
- [x] 1.2 Add `.tag-pill` class to `src/styles/global.css`: `display: inline-flex`, `align-items: center`, `gap: 0.4em`, `font-family: var(--font-mono)`, `font-size: 0.8em`, `text-transform: uppercase`, `letter-spacing: 0.05em`, `padding: 0.35em 0.7em`, `border: 1px solid var(--color-rule)`, `border-radius: 4px`, `color: var(--color-ink)`, `text-decoration: none`, `white-space: nowrap`. Add hover: `border-color: var(--color-accent)`, `color: var(--color-accent)`.
- [x] 1.3 Add a `.tag-pill .count` rule inside `global.css` for the post-count number that sits inside each pill: `color: var(--color-muted)`, `font-size: 0.85em`. Pill hover state inherits accent color via `currentColor` on the count.
- [-] 1.4 (Optional, only if pill border looks too faint at 1px on the warm-neutral bg) Add a `--color-rule-strong` token at `:root` (e.g., a slightly darker tone than `--color-rule`) and use it for `.tag-pill` border. Skip if 1px `--color-rule` reads fine in browser. *(Deferred to in-browser eyeball — start with 1px `--color-rule`. Token can be added later if too faint.)*

## 2. Shared PostList component

- [x] 2.1 Create `src/components/PostList.astro` that takes a `posts: CollectionEntry<'blog'>[]` prop and renders the existing single-column listing markup (`<ul class="post-list">` with date + title spans). Move the scoped listing CSS from `/blog/index.astro` and `/index.astro` into this component's `<style>` block. Keep the `YYYY-MM` `<FormattedDate format="year-month" />` usage. Component must work both standalone (used on `/`) and inside the year-grouping wrapper on `/blog/`.
- [x] 2.2 Update `src/pages/blog/index.astro` to import and use `PostList` for each year's posts (the year-grouping H2s stay on the page; only the inner `<ul>` becomes the component). Verify visual output is identical to current `/blog/`.

## 3. Topics cloud — restyle and componentize

- [x] 3.1 In `src/pages/blog/index.astro`, swap the existing Topics anchor markup to use `class="tag-pill"`. Keep the `<span class="count">({count})</span>` inside each pill. Remove the now-unused `.topics a`, `.topics .count`, `.topics li` scoped styles (or simplify them to just layout: `.topics ul { display: flex; flex-wrap: wrap; gap: 0.5em 0.75em; padding: 0; list-style: none; }`). *(Removed all `.topics a/li/count` styles; kept only `.topics ul` layout flex.)*
- [x] 3.2 Build the same Topics computation (tag counts → sorted entries) on `/index.astro` via the same `getCollection` + Map logic. *(Inlined — two call sites only; helper extraction deferred until a third use appears.)*

## 4. Homepage rewrite

- [x] 4.1 Rewrite `src/pages/index.astro` — H1 removed, two `<p>` intro, `<section class="topics">` between intro and writing list, `<h2 class="eyebrow">Writing</h2>` instead of "Recent writing" H2, `.slice(0, 10)` dropped, `<PostList posts={posts} />` instead of inline markup.
- [x] 4.2 Wrote the two intro paragraphs (drafted in `src/pages/index.astro`). Reviewable in preview before commit.

## 4a. Header nav alignment (scope extension)

- [x] 4a.1 In `src/components/Header.astro`, constrain the `<nav>` element to `width: var(--prose-max-width); max-width: 100%; margin: 0 auto;` so wordmark/links align with the centered prose column on every page. Header chrome (border-bottom) stays full-width.

## 5. Verify

- [x] 5.1 `npm run build` succeeds. 9 pages still build (no route changes). Pagefind re-indexes cleanly (454 words, up 1 word from prior build — within rounding).
- [-] 5.2 `npm run preview` and click through `/`, `/blog/`, `/about/`, `/search/`, plus every post. *(Preview server up at http://localhost:4321/. Markup verification confirms: 0 H1 inside main on /, two intro paragraphs, Topics + Writing eyebrow on /, 7 tag-pills with `/search/?q=<tag>` hrefs, 5 posts on / (matches /blog/), eyebrow Topics on /blog/. **Visual eyeball still recommended** before commit — agent can't render colors/typography reliably without browser automation.)*
- [x] 5.3 Confirm `git diff package.json package-lock.json` is empty (no new deps). *(0 lines)*
- [x] 5.4 Confirm `public/CNAME` is unchanged. *(`philg0ld.com`)*
- [x] 5.5 View built `/index.html` source: GA snippet present (`G-QHL6MG41R7`), no `<h1>` inside the `<main>` of the home document. *(GA present 2x — script tag + gtag init. H1 count inside `<main>` of `/index.html` = 0.)*

## 6. Changelog & commit

- [x] 6.1 Added `## [Unreleased]` entries to `CHANGELOG.md` (homepage rework, restyled pill, header nav constraint, `.eyebrow`/`.tag-pill` classes, `PostList` component).
- [x] 6.2 Committed as `f07687c Rework homepage to kau.sh-shaped layout`. Pushed as part of the v0.0.2 release motion.
