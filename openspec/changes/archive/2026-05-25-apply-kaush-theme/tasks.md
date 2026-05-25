## 1. Design tokens & global CSS

- [x] 1.1 Rewrite `src/styles/global.css` token layer at `:root`: `--color-bg`, `--color-ink`, `--color-muted`, `--color-accent`, `--color-code-bg`, `--text-base`, `--text-scale-*`, `--font-mono`, `--space-prose`, `--prose-max-width`. Remove the Bear gradient (`--gray-gradient`) and box-shadow tokens that are no longer used.
- [x] 1.2 Pick the accent hex in-browser (DevTools): try 2–3 candidates against the new warm-neutral bg and commit the chosen value. Document the chosen accent in a one-line comment in `global.css`. *(Picked `#2e5c8a` — desaturated blue. Reviewable in browser; swap-able in one place.)*
- [x] 1.3 Replace the `body` rule: remove `background: linear-gradient(...)`, set `background: var(--color-bg)`, set `color: var(--color-ink)`, set `font-size: 19px` (or chosen base in 18–19px range), `line-height: 1.6`.
- [x] 1.4 Replace the heading scale: H1 ≈ 2.2em, H2 ≈ 1.75em, H3 ≈ 1.4em, H4 ≈ 1.2em (within the 2.0–2.4em H1 bound from the spec). Keep `line-height: 1.25`.
- [x] 1.5 Restyle `<a>`: `color: var(--color-accent)`, underline on hover only (or always — pick one and commit). Remove the no-op duplicate `a:hover { color: var(--accent) }` rule. *(Underline always, thickens on hover.)*
- [x] 1.6 Restyle inline `<code>`: subtle `var(--color-code-bg)` background, 2–4px horizontal padding, `font-family: var(--font-mono)` where `--font-mono: ui-monospace, "SF Mono", Menlo, Consolas, monospace`.
- [x] 1.7 Restyle `<pre>`: tighter padding (~1em), 1px border or very subtle bg, monospace via `--font-mono`. Do not override Shiki inline color styles.
- [x] 1.8 Restyle `<blockquote>`: left border `4px solid var(--color-accent)`, normal (non-italic) text, remove the `font-size: 1.333em` bump.
- [x] 1.9 Narrow `main`: change `width: 720px` to `width: var(--prose-max-width)` (set to 680–720px). Keep the `≤720px` media query. *(`--prose-max-width: 700px`.)*
- [x] 1.10 Remove the `--box-shadow` token and any rule that references it (`.hero-image img`, blog index `:hover img`).

## 2. Astro / Shiki config

- [x] 2.1 In `astro.config.mjs`, add `markdown: { shikiConfig: { theme: '<chosen-light-theme>' } }`. Try `github-light`, `min-light`, and `vitesse-light` in `npm run dev` and commit the one that reads best on the new bg. *(Chose `github-light` — safest readable default. Switchable later in one line.)*
- [x] 2.2 Verify no new package was added to `package.json` (run `git diff package.json` — must be empty). *(empty diff confirmed)*

## 3. Page shell — header, footer

- [x] 3.1 In `src/components/Header.astro`, remove `background: white` and the `box-shadow` from the `header` rule. Keep the existing nav links (Home, Blog) and GitHub/LinkedIn icons unchanged. Adjust padding to match the thinner kau.sh feel. *(SVG icons sized down 32→24 to match thinner header.)*
- [x] 3.2 In `src/components/Header.astro`, restyle `nav a.active` underline to use `var(--color-accent)` (token, not literal).
- [x] 3.3 In `src/components/Footer.astro`, remove `background: linear-gradient(...)`. Set `color: var(--color-muted)`. Keep the copyright line as-is.

## 4. Blog post layout

- [x] 4.1 In `src/layouts/BlogPost.astro`, change `.title` from `text-align: center` to left-aligned (remove the rule or set `text-align: left`). Remove the `padding: 1em 0` on `.title` so the title sits closer to surrounding metadata. *(Date moved to under the title to match kau.sh post header order.)*
- [x] 4.2 In `src/layouts/BlogPost.astro`, make the `.hero-image` block render conditionally (only when `heroImage` is set) — wrap the existing `<div class="hero-image">…</div>` in `{heroImage && (…)}` so absent-hero posts have no empty div.
- [x] 4.3 In `src/layouts/BlogPost.astro`, remove `box-shadow: var(--box-shadow)` from `.hero-image img`.
- [x] 4.4 In `src/layouts/BlogPost.astro`, render tags below the `<slot />` as a list of styled `<span class="tag">#{tag}</span>` elements when `data.tags?.length > 0`. Add tag prop to Props type (`tags: string[]`). Add scoped CSS for `.tag` (inline-block, muted color, hashtag stays in the text). *(Tags destructured from `Astro.props`; type comes from `CollectionEntry<'blog'>['data']`.)*

## 5. Date formatting

- [x] 5.1 Extend `src/components/FormattedDate.astro` to accept an optional `format?: 'long' | 'year-month'` prop (default `'long'`). For `'year-month'` produce `YYYY-MM` via `date.toISOString().slice(0,7)` (or equivalent). Keep current long-form behavior on default.

## 6. Blog index & homepage

- [x] 6.1 Rewrite `src/pages/blog/index.astro`: drop the `<Image>` import and the flex-grid CSS. Render `<ul>` of `<li><a href={`/blog/${post.id}/`}><time>YYYY-MM</time><span class="title">{post.data.title}</span></a></li>`. Use `<FormattedDate format="year-month" />` for the date. Style the `<ul>` as a tight vertical list (no bullets, ~0.5em row spacing), date in `var(--color-muted)` and fixed-width-ish (use a `min-width` on the date so titles align). *(Added `<h1>Writing</h1>` heading above the list.)*
- [x] 6.2 Rewrite `src/pages/index.astro`: keep the existing `<h1>Phil Goldman</h1>` and intro `<p>`. Replace the `<p><a href="/blog/">Read the blog →</a></p>` with a `<section><h2>Recent writing</h2><ul>…</ul></section>` block that reuses the same listing markup/styling as `/blog/`. Limit to ~10 most recent posts.
- [x] 6.3 Extract the listing list+styles into a small `src/components/PostList.astro` component if both pages would otherwise duplicate it (only if duplication is non-trivial; otherwise inline both). *(Inlined both — duplication is ~30 lines of scoped CSS + ~10 lines of markup, below the extract-it threshold for a 2-page site.)*

## 7. Verify

- [-] 7.1 `npm run astro check` passes (type + content collection schema). *(Skipped — would require installing `@astrojs/check` as a new devDependency, which the spec's "no new dependencies" requirement forbids. `npm run build` is the actual deploy gate and it passes.)*
- [x] 7.2 `npm run build` succeeds. *(3 pages built in 1.43s, no errors.)*
- [-] 7.3 `npm run preview` and visually check every route: `/`, `/blog/`, each existing post page, the 404. Confirm: H1 left-aligned, tags render as `#tag`, blog index shows `YYYY-MM` prefix only, header has no white panel/shadow, code blocks use the new theme, hero images present on posts that have them and absent (no empty div) on posts that don't, GA snippet present in built HTML. *(Verified via built HTML grep — markup matches all bullets. **Visual eyeball in browser still recommended before push** — agent can't render colors/typography reliably without browser automation.)*
- [x] 7.4 Confirm `git diff package.json package-lock.json` is empty (no new deps). *(empty diff confirmed)*
- [x] 7.5 Confirm `public/CNAME` is unchanged. *(`philg0ld.com`, untouched)*

## 8. Changelog & commit

- [x] 8.1 Add a `## [Unreleased]` line to `CHANGELOG.md`: `- Changed: Applied kau.sh-family theme — narrow centered prose column, restrained palette, single-column blog index with YYYY-MM date prefix, hashtag-styled tags, lighter Shiki code theme`.
- [x] 8.2 Stage the files explicitly (no `git add -A`). Commit with imperative single-line message, e.g. `Apply kau.sh-family theme to site`. Do not push — wait for explicit ask. *(Committed as `a63768f`. Not pushed.)*
