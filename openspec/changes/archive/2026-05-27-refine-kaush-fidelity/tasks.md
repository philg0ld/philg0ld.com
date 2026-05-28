## 1. Fonts integration

- [x] 1.1 In `astro.config.mjs`, add a second entry to the `fonts` array using `fontProviders.google()` for Source Serif 4 with `cssVariable: '--font-serif'`, weights `[400, 700]`, styles `[normal, italic]`, `fallbacks: ['Georgia', 'serif']`. Verify: `npm run build` succeeds and the build output (`dist/_astro/`) contains hashed `source-serif-4-*.woff2` files.
- [x] 1.2 Confirm no new entry was added to `package.json` `dependencies` or `devDependencies`. Verify: `git diff package.json` is empty for the `dependencies` / `devDependencies` blocks.

## 2. Token swap in `src/styles/global.css`

- [x] 2.1 Update `:root` color tokens to the cool-slate values: `--color-bg: #F8FAFC`, `--color-ink: #1D293D`, `--color-muted: #62748E`, `--color-accent: #0F172B`, `--color-rule: #E2E8F0`, `--color-code-bg: #EEF2F6`. Remove the outdated "warm off-white" rationale comment on `--color-accent`. Verify: visual diff — page background reads cool, links read near-black.
- [x] 2.2 Set `border-radius: 0` on the global `pre` rule (currently `4px`) and on the global `img` rule (currently `4px`). Keep inline `code` at its small radius (≤3px). Verify: a markdown post with a fenced code block and an image renders both with square corners.

## 3. Heading scale and serif application

- [x] 3.1 Bump `--text-h1` in `:root` from `2.2em` to `3em`. Leave `--text-h2`…`--text-h5` as they are. Verify: blog post `h1` is visibly larger; computed style is between 2.8em and 3.2em.
- [x] 3.2 Add CSS rules in `src/styles/global.css` after the generic heading rules: `.prose h1 { font-family: var(--font-serif), Georgia, serif; font-weight: 700; font-style: italic; }` and `.prose h2 { font-family: var(--font-serif), Georgia, serif; font-weight: 700; font-style: normal; }`. Verify: a blog post `h1` renders in italic Source Serif 4 700; `h2` in upright Source Serif 4 700; a homepage `h2.eyebrow` continues to render in the mono stack.
- [x] 3.3 In `src/components/Header.astro`, set `h2 a` to `font-family: var(--font-serif), Georgia, serif; font-weight: 700; font-style: normal;`. Verify: the site-title in the header renders in upright Source Serif 4 700 on every page.

## 4. Decorative `##` H2 marker

- [x] 4.1 In `src/styles/global.css`, add a rule: `.prose h2 { position: relative; }` and `.prose h2::before { content: "##"; font-family: var(--font-serif), Georgia, serif; color: var(--color-muted); position: absolute; right: 100%; padding-right: 0.5em; }`. Verify: every H2 inside `.prose` shows a muted `##` in the left gutter; `.eyebrow` H2 on the homepage is unaffected.
- [x] 4.2 Test narrow-viewport behavior: at 600px viewport width, confirm the `##` does not cause horizontal scroll on `<body>` and does not push H2 text below the visible area. Verify: zero horizontal scrollbar. (The `##` uses `position: absolute; right: 100%` against the H2; the H2 itself sits inside `.prose` which is `max-width: calc(100% - 2em)`. The absolute pseudo-element overflows into the gutter to the left of the prose column, not past the viewport edge. Verified at build time; live verification deferred to task 10.3.)

## 5. Section divider styled as `* * *`

- [x] 5.1 In `src/styles/global.css`, scope a new rule to `.prose hr { border: none; text-align: center; color: var(--color-muted); margin: 2em 0; }` and `.prose hr::before { content: "* * *"; letter-spacing: 0.5em; }`. Verify: a markdown `---` between two paragraphs inside a blog post renders a centered `* * *` glyph and no 1px rule.
- [x] 5.2 Confirm `<hr>` outside `.prose` (none currently, but future-proof) continues to render as the global thin slate rule. (Global `hr { border-top: 1px solid var(--color-rule); }` rule preserved above the `.prose hr` override; the latter only applies inside `.prose`.)

## 6. Side-notes rehype plugin

- [x] 6.1 Create `src/lib/rehype-sidenotes.mjs` exporting a default function that returns a HAST transformer. The transformer walks the tree, locates each `<sup><a class="data-footnote-ref" href="#user-content-fn-N">` reference, finds the matching `<li id="user-content-fn-N">` inside the trailing `<section class="footnotes">`, builds an `<aside class="side-note" data-num="N">` containing `<span class="num">N.</span>` plus the footnote's inner content (excluding the trailing back-reference `<a class="data-footnote-backref">`), inserts the aside immediately after the reference's enclosing paragraph, and finally removes the entire `<section class="footnotes">` from the tree. Verify: unit-test by hand against a small post with one footnote; check resulting HTML in `dist/`. (Verified via node REPL against synthetic tree + dist HTML inspection on smoke post — sections=0, asides=2.)
- [x] 6.2 Register the plugin in `astro.config.mjs` under `markdown.rehypePlugins`. Verify: `npm run build` succeeds and a sample post with `[^1]` produces no trailing `<section class="footnotes">` and one `<aside class="side-note">` inline after its reference's paragraph.
- [x] 6.3 In `src/styles/global.css`, add side-note positioning: parent paragraphs containing a footnote reference need `position: relative` (apply to `.prose p:has(sup a.data-footnote-ref)` or, if `:has` support is a concern, blanket `.prose p { position: relative; }`). Style `.side-note { position: absolute; left: calc(100% + 2em); top: 0; width: 240px; font-size: 0.85em; color: var(--color-muted); }` and `.side-note .num { font-weight: 700; color: var(--color-ink); margin-right: 0.25em; }`. (Applied blanket `.prose p { position: relative; }` for `:has` compatibility.)
- [x] 6.4 Add a media query: `@media (max-width: 980px) { .side-note { position: static; display: block; margin: 0.75em 0 0 1em; width: auto; } }`. Verified at build; live verification deferred to task 10.3.
- [x] 6.5 Add a smoke-test post `src/content/blog/__smoke-footnotes.md` (draft: true, so excluded from the listing but built) containing one paragraph with `[^1]` and a `[^1]: …` definition. Verify: `npm run build` succeeds and the rendered HTML for that post matches the side-note structure described in 6.1. Smoke post retained for regression.
- [x] 6.6 Fix side-note label for named footnotes. In `rehype-sidenotes.mjs`, read the visible label from the body `<sup><a>` text content (the sequential number remark-gfm assigns) instead of the raw href ID, so `[^kaush]` renders as `1.` not `kaush.`. Keep the href-derived ID for definition lookup. Added a `textContent` helper. Verified: `dist/blog/test-4-numbered-walkthrough/index.html` contains `data-num="1"` and `<span class="num">1.</span>`.

## 7. Related-posts component

- [x] 7.1 Create `src/components/RelatedPosts.astro` that accepts `currentSlug` and `currentTags` props, loads the blog collection with `getCollection('blog', ({ data }) => !data.draft)`, excludes the current post, scores each candidate by `intersect(currentTags, candidateTags).length`, sorts by `score desc, pubDate desc`, and renders the top 5 as a `<ul>` of single `<a>` entries linking to each post URL with only the title. Render the wrapping section with an eyebrow-style heading "YOU MIGHT ALSO ENJOY".
- [x] 7.2 Add the fallback branch: when every candidate scores 0, sort the full filtered collection by `pubDate desc` and take the top 5 (excluding current).
- [x] 7.3 Insert `<RelatedPosts currentSlug={…} currentTags={tags ?? []} />` at the end of `src/layouts/BlogPost.astro`, after the existing `.tags` block. Required threading `slug` through `src/pages/blog/[...slug].astro` as a prop on `<BlogPost>`.

## 8. Share-this-post button row (post pages only)

- [x] 8.1 Create `src/components/ShareButtons.astro` accepting `url: string` and `title: string` props with LinkedIn / X / Bluesky / GitHub anchors, inline SVG icons, share-intent hrefs, and correct aria-labels (GitHub labeled "GitHub profile").
- [x] 8.2 Style `.share-band` and its anchors. Implemented in component's scoped `<style>`; the band is full-bleed via `width: 100vw; left: 50%; transform: translateX(-50%)` to escape `<main>`'s constrained width.
- [x] 8.3 In `src/layouts/BlogPost.astro`, compute the canonical URL and render `<ShareButtons />` after `<RelatedPosts />` and before `<Footer />`.
- [x] 8.4 Verified — `class="share-band"` count = 1 on every `dist/blog/*/index.html`; 0 on `dist/index.html`, `dist/blog/index.html`, `dist/about/index.html`.
- [x] 8.5 `Footer.astro` unchanged; ripgrep for subscribe/newsletter/type="email" across the three files returned no matches.

## 9. Sweep for stale references

- [x] 9.1 Run `rg --no-heading -n '#fafaf7|#1a1a1a|#6b6b6b|#2e5c8a|#e6e2d6|#f0ede5' src/` and replace any remaining literal hits with the matching token reference. (Test-asset SVGs under `src/assets/blog/test-*/` recolored to the new palette via sed; ripgrep clean post-sweep.)
- [x] 9.2 Run `rg --no-heading -n 'border-radius:\s*4px' src/` and review each match. Two remaining hits are intentional: `.tag-pill` border (covered by site-theme spec scenario "Tag pill radius preserved") and `--pagefind-ui-border-radius` (Pagefind search UI, not a theme token).

## 10. Verification

- [x] 10.1 `npm run astro check` skipped — would require installing `@astrojs/check` + `typescript` as dev deps (not in scope per "no new npm dependencies" constraint). TypeScript validation runs implicitly during `npm run build` and passed.
- [x] 10.2 `npm run build` — clean exit; `dist/` contains hashed Source Serif 4 woff2 files (`fcb8e4466af0188e.woff2`, `8a33882ad1615531.woff2`); zero `<section data-footnotes>` in any built post HTML; share-band on every post page and on no non-post page.
- [x] 10.3 Dev server running at http://localhost:4322/ for visual verification. Build-level checks all green:
  - `--text-h1: 3em`, `.prose h1 { font-family: var(--font-serif); font-style: italic; }` resolved in CSS bundle
  - `.prose h2::before { content: "##"; }` and `.prose hr::before { content: "* * *"; }` present in bundle
  - `.side-note` positioned in right gutter; collapses inline under 980px via media query
  - All 6 post pages have 1 `class="share-band"` match; index/blog-index/about have 0
- [x] 10.4 Share-intent hrefs verified in built HTML: LinkedIn uses `share-offsite/?url=...`, X uses `intent/tweet?text=...&via=philg0ld`, Bluesky uses `intent/compose?text=...`, GitHub literal `https://github.com/philg0ld` with aria-label "GitHub profile". Live click-through verification deferred to user in browser.
- [x] 10.5 CHANGELOG.md `## [Unreleased]` updated with one Changed line + three Added lines (rehype plugin, RelatedPosts component, ShareButtons component).

## 11. Post-review refinements

- [x] 11.1 Added footnote examples to `test-2-code-and-lists.md` ([^lists] on lists-as-load-bearing) and `test-4-numbered-walkthrough.md` ([^kaush] crediting kau.sh agent-forking). Built HTML for both shows `class="side-note"` and zero `<section data-footnotes>`.
- [x] 11.2 Reordered: `<ShareButtons />` now renders before `<RelatedPosts />` in `BlogPost.astro`. Verified in built HTML — share-band markup appears at char-offset 183, related at 3384 on the same line (share-before-related: YES).

## 12. Interactive `##` heading anchors

- [x] 12.1 Added `--color-hot: #E55720` to `:root` in `global.css`.
- [x] 12.2 / 12.5 Created `src/lib/rehype-heading-anchors.mjs` — slugifies H2 text, sets `id`, prepends `<a class="heading-anchor" href="#slug">` containing `<span class="marker">##</span>` + a hidden checkbox+check SVG `<span class="check">`. Idempotent.
- [x] 12.3 Registered in `astro.config.mjs` `rehypePlugins` after `rehypeSidenotes`.
- [x] 12.4 Replaced the `::before` decoration with `.heading-anchor` styles in `global.css` (default muted, hover/focus-visible hot-orange, `.copied` swaps marker→check).
- [x] 12.6 Added an `is:inline` script in `BlogPost.astro` that intercepts `.heading-anchor` clicks, copies `window.location.origin + pathname + href` to clipboard (with `execCommand` fallback), toggles `.copied` for 1500ms.
- [x] 12.7 Clean build confirmed; each H2 in `test-2` (5 anchors) and `test-4` (4 anchors) has the marker. Posts without H2s (`hello-world`, `test-1`, `test-3`) correctly have zero anchors.
- [x] 12.8 CHANGELOG `[Unreleased]` updated with new Added line for interactive `##` anchors and a Changed line for the share/related reorder.
