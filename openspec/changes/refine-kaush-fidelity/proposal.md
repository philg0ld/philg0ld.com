**Outcome:** philg0ld.com's visual theme and post page chrome match the actual kau.sh visual fingerprint (cool-slate palette, italic serif prose headings, side-margin footnotes, decorative `##` H2 markers, social-icons footer, related-posts block, sharp media corners) instead of an approximation.

## Why

The previously archived `apply-kaush-theme` change landed a "kau.sh-family" theme, but a fresh Firecrawl branding extraction of kau.sh (homepage + a blog post) plus a captured screenshot of `kau.sh/blog/agent-forking/` showed concrete divergences across both visual tokens AND post page chrome:

1. Palette is **cool slate** (`#F8FAFC` / `#1D293D` / `#62748E`), not warm-neutral; accent is near-black, not a desaturated blue.
2. Blog post headings use a **serif** (AT Lang), and the H1 specifically is **bold italic**.
3. H2 sections render a decorative `##` glyph in the left margin (matches the markdown source).
4. Footnotes appear as **side notes in the right margin** at the reference's vertical position, not at the bottom of the post.
5. `<hr>` renders as a centered `* * *` glyph, not a thin rule.
6. The post page closes with a **"You might also enjoy"** related-posts list and a **social-icons row** in a slate band.
7. Code blocks and content images use **sharp corners** (radius 0).

Subscribe blocks are explicitly out of scope. Closing the gap now — while the broader theme is still fresh — is cheaper than drifting further.

## What Changes

- **Palette:** recolor design tokens to cool slate; drop the blue link accent (accent becomes near-black, links rely on underline).
- **Serif headings:** introduce a free web serif (Source Serif 4) as `--font-serif`, loaded via Astro's existing fonts API. Apply to blog prose `h1`/`h2` and the homepage hero/site-title. The blog post `h1` SHALL render in **italic 700** (bold italic). Body and small headings stay on Atkinson Hyperlegible.
- **H1 scale:** bump blog `h1` from `2.2em` to ~`3em` (≈54–60px) to match kau.sh's hero scale.
- **Decorative `##` marker:** every `.prose h2` SHALL render a muted `##` glyph in the left margin via CSS `::before` (no per-post markup).
- **Section divider:** `<hr>` (from markdown `---` / `***`) SHALL render as a centered `* * *` glyph, not a thin slate rule.
- **Side notes:** markdown footnotes (`[^1]`) SHALL render as right-margin side notes positioned at the reference's vertical line, not in a bottom footnotes block. Implemented as an in-repo remark/rehype plugin (no new npm dep).
- **Related posts:** the blog post layout SHALL render a "You might also enjoy" list of up to 5 related posts after the body. Selection: rank by shared-tag count with the current post; tie-break by recency.
- **Share-this-post row:** blog post pages SHALL render a row of share-intent buttons in a slate band after the post body, with four icons: LinkedIn, X, Bluesky (true share intents that pre-fill with the current post's title and URL) and GitHub (profile link — no share intent exists). Handles: `philg0ld` (X `via=`, GitHub profile, Bluesky), `philg0ld` (LinkedIn slug). The row SHALL NOT appear on the homepage, blog index, About page, or any non-post route. The site-wide footer continues to render only the copyright line. No subscribe block.
- **Sharp corners:** remove `border-radius` from `pre`, hero `img`, and content `img` (set to `0`); inline `code` and `.tag-pill` unchanged.

## Non-goals

- Switching the body face to Geist sans.
- Recoloring the `.tag-pill` border or removing its radius.
- Adding any runtime npm dependency.
- Changing layout proportions, prose column width, nav alignment, or the header search icon.
- Adding a subscribe block, newsletter form, or email collection.
- Adding a dark-mode variant.

## Capabilities

### New Capabilities
- _none_

### Modified Capabilities
- `site-theme`: palette tokens shift from warm-neutral to cool slate; accent loosens to "single-hue, may be near-black"; heading-scale H1 range widens to 2.8–3.2em; new requirement for an italic serif heading family on prose; new requirements for decorative `##` H2 marker, centered-asterisk `<hr>`, and zero radius on media; Page shell footer scenario clarifies the footer remains copyright-only and explicitly excludes subscribe UI.
- `post-presentation`: new requirement for markdown footnotes rendered as right-margin side notes; new requirement for a related-posts block at the end of each post; new requirement for a share-this-post button row on blog post pages only.

## Impact

- **Code:** `src/styles/global.css` (tokens, `pre`, `img`, heading rules, `::before` decoration, `<hr>` styling), `src/layouts/BlogPost.astro` (hero radius, prose heading family, share-row insertion, related-posts block), `src/components/Header.astro` (site-title font), `src/components/ShareButtons.astro` (new — inline SVG icons, share-intent anchors), `src/components/RelatedPosts.astro` (new — tag-overlap ranking), `src/lib/rehype-sidenotes.mjs` (new — in-repo plugin), `astro.config.mjs` (fonts API: add serif; markdown.rehypePlugins: register sidenotes plugin). `src/components/Footer.astro` is unchanged (site-wide copyright only).
- **APIs / dependencies:** None. No new npm package; serif loaded via Astro's `fonts` integration; remark plugin authored in-repo.
- **Visual regression:** All existing posts re-render with new palette, italic-serif title, and side-margin footnotes (existing posts without footnotes are unaffected); no content edits required.
- **CI:** No pipeline changes; `npm run build` must still pass.
