## Context

The site currently runs a kau.sh-inspired theme landed via the archived `apply-kaush-theme` change. A 2026-05-26 Firecrawl branding extraction (`/Users/pg/Downloads/kau.sh_*.json`) plus a full-page screenshot of `kau.sh/blog/agent-forking/` exposed concrete divergences across both visual tokens (palette, fonts, corner radius) AND post page chrome (footnotes, decorative `##`, dividers, related-posts block, social footer).

The implementation surface spans:

- `src/styles/global.css` — tokens, headings, dividers, decorative `::before`
- `src/layouts/BlogPost.astro` — hero radius, heading family, related-posts insertion
- `src/components/Header.astro` — site-title font
- `src/components/Footer.astro` — social row + slate band
- `astro.config.mjs` — fonts API + remark plugin registration
- New files: `src/components/SocialIcons.astro`, `src/components/RelatedPosts.astro`, `src/lib/remark-sidenotes.mjs`

The change is medium-sized: roughly half is CSS token swaps and the other half is two new components and one custom remark plugin. A design document is justified because the side-notes plugin and the related-posts ranking need decisions captured before implementation.

## Goals / Non-Goals

**Goals:**
- Replace warm-neutral tokens with a cool-slate set matching kau.sh's extracted palette.
- Apply an italic bold serif to blog `h1` and an upright serif to `h2` and the site-title.
- Bump blog `h1` to a hero scale (~3em).
- Render `<hr>` as a centered `* * *` glyph and prefix every `.prose h2` with a muted `##`.
- Render markdown footnotes as right-margin side notes via an in-repo remark plugin.
- Render a "You might also enjoy" related-posts list at the end of each post, ranked by tag overlap then recency.
- Add a four-icon social row (LinkedIn, X, GitHub, Bluesky) in the footer, in a slate band.
- Sharpen media (`pre`, hero `img`, content `img`) to `border-radius: 0`.
- Keep build green; preserve Lighthouse score; no new npm packages; no subscribe block.

**Non-Goals:**
- Replacing Atkinson Hyperlegible as the body face.
- Restyling the `.tag-pill` (it stays rounded and uses the existing radius scale).
- Reworking layout proportions, header chrome, prose column width, or nav alignment.
- Adding any subscribe / newsletter / email collection UI.
- Adding a dark-mode variant.

## Decisions

### 1. Use `fontProviders.google()` for Source Serif 4

**Choice:** Add Source Serif 4 via Astro's `fontProviders.google()` in `astro.config.mjs`, exposing `--font-serif`, weights `[400, 700]`, styles `[normal, italic]`.

**Why over alternatives:**
- **`local()` with downloaded `.woff2`:** Mirrors the Atkinson setup, but commits binary files and requires manual subsetting. Higher ongoing maintenance.
- **`fontProviders.fontsource()`:** Source Serif 4 isn't a first-class Fontsource family.
- **`fontProviders.google()`:** Astro downloads the font at build and self-hosts it — no runtime third-party request, no new npm dependency. ✅

### 2. H1 is bold italic; H2 and site-title are upright bold serif

**Choice:** `.prose h1` uses `font-weight: 700; font-style: italic`. `.prose h2` and the header site-title use `font-weight: 700; font-style: normal`. Eyebrow headings and tag pills stay mono.

**Why:** Matches kau.sh exactly — the H1 is the literary hero, H2s are upright section labels. Mixing italic on H1 with upright on H2 creates a clear hierarchy without needing a size jump that would crowd the page on mobile.

### 3. Accent becomes near-black; links keep underline

**Choice:** Drop the desaturated-blue `--color-accent` in favor of near-black (`#0F172B`). Links inherit `--color-accent` for `color`, keep underline (which thickens on `:hover` / `:focus-visible`).

**Trade-off:** Color contrast between link and body text drops to zero. Mitigation: underline is always present and thickens on interaction; WCAG SC 1.4.1 satisfied because color is not the sole indicator.

### 4. Decorative `##` marker via CSS `::before`, always on `.prose h2`

**Choice:** Inject the marker via `.prose h2::before { content: "##"; }` in `global.css`, positioned with negative margin so it sits in the left gutter without affecting heading wrap. No per-post markup.

**Why:** Zero authoring overhead. Per-post opt-in would force every section heading to carry a class or HTML escape hatch — friction that breaks the markdown-first workflow.

**Trade-off:** The marker shows on every H2 across the site, including non-blog routes that happen to use `.prose h2`. Scoping to `.prose h2` (only blog post bodies have the `.prose` wrapper) keeps it confined to long-form content; homepage `.eyebrow` H2s are unaffected because they don't carry `.prose`.

### 5. Section divider styled via CSS pseudo-content

**Choice:** Style `<hr>` to render as a centered `* * *` glyph: hide the default border, set `text-align: center`, inject `content: "* * *"` via `::before` or `::after`, color muted.

**Why over an MDX component:** Markdown `---` / `***` already produces `<hr>` — restyling preserves Markdown portability. An MDX `<Divider />` would force every post to import a component.

### 6. Footnote-to-side-note via a custom rehype plugin (not remark)

**Choice:** Write `src/lib/rehype-sidenotes.mjs`. Hook in via `markdown.rehypePlugins` in `astro.config.mjs`. The plugin runs after remark's default footnote rendering and rewrites the HAST:

1. Find every `sup > a.data-footnote-ref` (the reference superscript that remark-gfm emits).
2. Find the matching `<li id="user-content-fn-N">` in the trailing `<section class="footnotes">`.
3. Inline an `<aside class="side-note" data-num="N">` immediately after the reference's parent paragraph, containing the footnote's inner content.
4. Remove the trailing `<section class="footnotes">` from the document.

CSS then absolutely-positions `.side-note` into the right gutter at `top: 0` relative to the reference's parent paragraph (which becomes `position: relative`).

**Why rehype over remark:** Remark operates on Markdown AST before footnote rendering happens. Rehype operates on the HAST after — meaning we can rely on remark-gfm having already done the heavy lifting (matching refs to definitions, generating IDs, handling multi-paragraph footnotes). We rewrite, not parse.

**Why not a published package:** Existing options (`remark-sidenotes`, `remark-tufte`) are unmaintained, narrow, or expect specific markdown extensions. A ~40-line in-repo plugin is cheaper than carrying a third-party surface area.

**Fallback for narrow viewports:** Below `--prose-max-width + ~280px` (≈980px), the side gutter doesn't exist. CSS media query collapses `.side-note` back to inline block-level placement after the reference's paragraph, with the original number marker preserved.

### 7. Related-posts ranking: shared-tag count, then recency, top 5

**Choice:** In `src/components/RelatedPosts.astro`, given the current post:

1. Load the published blog collection (filter `draft: false`).
2. Exclude the current post.
3. For each candidate, compute `score = |intersect(currentTags, candidateTags)|`.
4. Sort by `score desc, pubDate desc`.
5. Take the top 5.
6. If `score === 0` for all (e.g., current post has no tags or no overlap), fall back to the 5 most recent posts.

Render as a `<ul>` with each entry a single `<a>` to the post URL. No date prefix, no description (matches kau.sh's compact list style).

**Why not manual frontmatter:** Adds friction to every post. Algorithmic selection scales with content and is reversible — frontmatter override can be added later if needed.

**Why top 5:** Matches kau.sh's typical density without dominating the page tail.

### 8. Share-this-post button row, scoped to post pages

**Choice:** Create `src/components/ShareButtons.astro` accepting `url` and `title` props. The component renders a row of four anchor tags inside a full-bleed `<div>` with `background: var(--color-rule)` and centered content. The row is inserted in `src/layouts/BlogPost.astro` between the related-posts block and the existing `<Footer />`. It is NOT placed inside `Footer.astro`. The homepage, blog index, About page, and any future non-post route SHALL NOT render this row.

**Three buttons use share-intent URLs; one is a profile fallback:**

| Button | Type | Href template |
|---|---|---|
| LinkedIn | Share intent | `https://www.linkedin.com/sharing/share-offsite/?url={encodeURIComponent(url)}` |
| X / Twitter | Share intent | `https://twitter.com/intent/tweet?text={encodeURIComponent(title)}&url={encodeURIComponent(url)}&via=philg0ld` |
| Bluesky | Share intent | `https://bsky.app/intent/compose?text={encodeURIComponent(title + " " + url)}` |
| GitHub | Profile link | `https://github.com/philg0ld` (literal — GitHub has no share intent) |

`{url}` is the canonical post URL (`new URL(Astro.url.pathname, Astro.site).toString()`); `{title}` is the post title from frontmatter. Each anchor has `target="_blank" rel="noopener noreferrer"`. The three share buttons have `aria-label="Share on <Platform>"`; the GitHub button has `aria-label="GitHub profile"` to be honest about what it links to.

**Why inline SVG, not an icon library:** No new dependency; four icons inline is trivial.

**Why scoped to post pages, not site-wide:** Share buttons in the global footer would have nothing semantic to share on the homepage / about / blog index — they'd default to sharing the route URL, which is technically valid but not what readers expect. Scoping to `BlogPost.astro` keeps the affordance honest. `Footer.astro` stays as a pure copyright component.

### 9. Sharp media is its own requirement, not buried in code styling

**Choice:** Add a new `site-theme` requirement, "Sharp media and code blocks," covering `<pre>`, hero `img`, and content `img` only. Modify the existing "Distinctive inline-code and blockquote treatment" to clarify that inline `<code>` keeps its small radius.

**Why:** Future readers see "sharp corners on media" as its own line, not buried in a code-styling clause.

## Risks / Trade-offs

- **[Serif load adds bytes to the wire]** → Mitigation: limit to two weights × two styles = four files; Astro inlines preload links; Google provider's woff2 outputs are small (~25–35KB per file after Latin subsetting).
- **[Link color removal hurts scannability]** → Mitigation: underline is always present, thickens on hover. Revisitable if reading shows degradation.
- **[Side-notes plugin breaks if remark-gfm changes its HAST shape]** → Mitigation: pin the assertion on `data-footnote-ref` (a stable attribute name from GFM spec); add a smoke test post with a footnote committed to `src/content/blog/` so any structural regression fails `npm run build` or visual review.
- **[Side notes have no clear home on narrow viewports]** → Mitigation: media query collapses to inline block-level placement below 980px; preserves the numeric marker so context isn't lost.
- **[Related-posts component reads the full collection on every post page]** → Acceptable: Astro builds are static; the collection is in-memory at build time and the sort is O(n log n) per post. With current post count (<20), build cost is negligible.
- **[Decorative `##` may overflow narrow viewports]** → Mitigation: position via negative `margin-left` rather than `position: absolute`; collapses cleanly when the gutter disappears.
- **[Token rename in `global.css` could miss a component-scoped usage]** → Mitigation: ripgrep sweep in `src/` for old hex values after the swap.

## Migration Plan

CSS/config/component change with no schema or data migration. Deployment is the standard `push to main → GitHub Actions → Pages` flow. Rollback = `git revert` of the implementation commit; no state to unwind. Visual diff on the live site after deploy is the verification step.

## Open Questions

- Should `.prose h3`–`h6` also use the serif? Default in this design: stay on body face (matches kau.sh — only h1/h2 are serif). Revisitable if hierarchy reads inconsistent.
- Should `<hr>` styling apply globally or only inside `.prose`? Default: only `.prose hr` to avoid affecting any future non-blog routes.
- _none._ Handles and URL templates resolved (see Decision 8).
