## MODIFIED Requirements

### Requirement: Restrained cool-slate palette

The site SHALL use a cool slate off-white background, slate-900 ink for body text, slate-500 for muted metadata, and a near-black accent. The accent MAY be the same hue as the ink (i.e., color contrast between accent and ink is not required). The site SHALL NOT use gradient backgrounds. Tokens SHALL be: `--color-bg` resolves to a cool off-white in the slate-50 range (≈`#F8FAFC`); `--color-ink` resolves to a slate-900-equivalent (≈`#1D293D`); `--color-muted` resolves to a slate-500-equivalent (≈`#62748E`); `--color-accent` resolves to a near-black (≈`#0F172B`); `--color-rule` resolves to a cool light slate (≈`#E2E8F0`); `--color-code-bg` resolves to a cool slate-100 tint (≈`#EEF2F6`).

#### Scenario: Background is cool, not warm

- **WHEN** any page is rendered
- **THEN** the page background's computed color is in the cool slate family (slate-50 ≈ `#F8FAFC`), not a warm-neutral cream (`#fafaf7`) and not a linear-gradient

#### Scenario: Accent is near-black

- **WHEN** the computed value of `--color-accent` is inspected
- **THEN** it is a near-black slate-900-or-darker value (≈`#0F172B`), not a saturated hue (e.g., not `#2e5c8a`)

#### Scenario: Links inherit the near-black accent

- **WHEN** an `<a>` element renders inside body prose
- **THEN** its computed `color` resolves to `--color-accent` (near-black) and it has an underline whose thickness increases on `:hover` and `:focus-visible`

#### Scenario: Single accent

- **WHEN** counting distinct accent colors used across links, blockquotes, and active nav state
- **THEN** all three resolve to the same `--color-accent` token

### Requirement: Atkinson body with cool-slate hero scale

The site SHALL use Atkinson Hyperlegible (already loaded as `--font-atkinson`) for body text and for all headings that are NOT covered by the "Serif heading family for prose" requirement. The site SHALL use a base body size of 18–19px and body line-height ≈1.6. The blog post `h1` SHALL be between 2.8em and 3.2em (approximately 54–60px at the base body size). The `h2` SHALL be between 1.5em and 1.85em.

#### Scenario: H1 sizing on blog posts

- **WHEN** a blog post page renders its `<h1>`
- **THEN** the computed `font-size` is between 2.8em and 3.2em (i.e., approximately 54–60px at the base body size)

#### Scenario: H2 sizing on blog posts

- **WHEN** a blog post page renders an `<h2>` inside the prose region
- **THEN** the computed `font-size` is between 1.5em and 1.85em

#### Scenario: System monospace for code

- **WHEN** an inline `<code>` or `<pre><code>` block is rendered
- **THEN** its `font-family` resolves to a system monospace stack (`ui-monospace, SF Mono, Menlo, Consolas, monospace`) with no web font download

#### Scenario: Atkinson remains the body face

- **WHEN** a `<p>` element renders inside the prose region
- **THEN** its computed `font-family` resolves to `--font-atkinson` (Atkinson Hyperlegible), not a serif and not Geist

### Requirement: Distinctive inline-code and blockquote treatment

The site SHALL style inline `<code>` with a subtle background tint, 2–4px horizontal padding, and a small `border-radius` (2–3px). The site SHALL style `<blockquote>` with a left border in the accent color and italic-free body text (relying on the border, not font-style, for emphasis). The radius treatment for `<pre>`, hero images, and content images is governed by the "Sharp media and code blocks" requirement and is NOT covered here.

#### Scenario: Inline code

- **WHEN** an inline `<code>` element renders
- **THEN** it has a subtle background fill distinguishable from the page background, small horizontal padding, and a small `border-radius` between 2px and 3px

#### Scenario: Blockquote

- **WHEN** a `<blockquote>` renders
- **THEN** it has a left border using `--color-accent` and its text is not italicized by default

### Requirement: Page shell — header, footer, content column

The site SHALL render a thin header containing the site name and primary nav, a single-column main content area, and a minimal text footer. The header SHALL NOT use a white panel with a box-shadow. The nav content (wordmark on the left, links on the right) SHALL be horizontally constrained to the same `--prose-max-width` as `<main>` and centered, so the wordmark aligns with the left edge of the prose column and the rightmost nav element aligns with its right edge. The header chrome (background, border) MAY span the full viewport width. The footer SHALL contain only a plain-text copyright line. The footer SHALL NOT include a subscribe form, newsletter signup, email-collection UI, or share-this-page buttons (share buttons live in the post page layout per the `post-presentation` capability, not in the site footer).

#### Scenario: Header chrome

- **WHEN** any page renders
- **THEN** the `<header>` element has a transparent or page-matching background, no `box-shadow`, and a single 1px or smaller bottom border (or no border)

#### Scenario: Footer copyright

- **WHEN** any page renders
- **THEN** the `<footer>` contains a copyright line as plain text, centered or left-aligned, with no gradient background

#### Scenario: No subscribe block

- **WHEN** any page renders
- **THEN** no element with text "Subscribe", no `<form>` collecting email addresses, and no input of `type="email"` appears anywhere in the `<footer>` or directly above it inside `<main>`

#### Scenario: No share buttons in site footer

- **WHEN** any page renders
- **THEN** the `<footer>` itself contains no share-this-page buttons or social icons (the share-button row defined by the `post-presentation` capability is rendered inside the blog post layout, above `<Footer />`)

#### Scenario: Nav alignment with prose column

- **WHEN** the viewport is wider than `--prose-max-width`
- **THEN** the `<nav>` content has `width: var(--prose-max-width)` (or equivalent), is horizontally centered inside the `<header>`, and its wordmark sits at the same x-coordinate as the left edge of `<main>` while the rightmost nav element sits at the same x-coordinate as the right edge of `<main>`

#### Scenario: Nav alignment on narrow viewports

- **WHEN** the viewport is ≤ `--prose-max-width`
- **THEN** the `<nav>` shrinks to viewport width minus the header's horizontal padding (no horizontal scrollbar, no overflow)

## ADDED Requirements

### Requirement: Serif heading family for prose

The site SHALL load a single free web serif as `--font-serif` via Astro's built-in fonts API (no new npm package). The serif SHALL be loaded with weights 400 and 700 and styles normal and italic. The serif SHALL be applied to: (a) `h1` inside the blog post prose region (`.prose h1`) at `font-weight: 700` and `font-style: italic`, (b) `h2` inside the blog post prose region (`.prose h2`) at `font-weight: 700` and `font-style: normal`, and (c) the site-title anchor in the header at `font-weight: 700` and `font-style: normal`. The serif SHALL NOT be applied to: `.eyebrow`, `.tag-pill`, body paragraphs, or `h3`–`h6`. The serif SHALL be self-hosted in the build output (no runtime third-party font request).

#### Scenario: Serif applied to blog prose H1 as bold italic

- **WHEN** a blog post page renders its `<h1>`
- **THEN** its computed `font-family` resolves to `--font-serif`, its `font-weight` is `700`, and its `font-style` is `italic`

#### Scenario: Serif applied to blog prose H2 as bold upright

- **WHEN** a blog post page renders an `<h2>` inside the prose region
- **THEN** its computed `font-family` resolves to `--font-serif`, its `font-weight` is `700`, and its `font-style` is `normal`

#### Scenario: Serif applied to site-title upright

- **WHEN** the header renders its site-title anchor
- **THEN** the site-title's computed `font-family` resolves to `--font-serif` and its `font-style` is `normal`

#### Scenario: Eyebrow and tag-pill unaffected

- **WHEN** an `.eyebrow` or `.tag-pill` element renders
- **THEN** its computed `font-family` resolves to `--font-mono`, not `--font-serif`

#### Scenario: Body remains sans

- **WHEN** a `<p>` or `h3`–`h6` element renders inside the prose region
- **THEN** its computed `font-family` resolves to `--font-atkinson`, not `--font-serif`

#### Scenario: No runtime third-party font request

- **WHEN** the deployed site is loaded in a browser
- **THEN** the network panel shows no request to `fonts.googleapis.com` or `fonts.gstatic.com` (the serif is served from the site's own origin via Astro's fonts integration)

### Requirement: Sharp media and code blocks

The site SHALL render `<pre>` blocks, blog hero images, and content images inside the prose region with `border-radius: 0`. The `.tag-pill` component and inline `<code>` are explicitly out of scope of this requirement and SHALL retain their existing small radius.

#### Scenario: Pre block has no rounded corners

- **WHEN** a fenced code block renders as `<pre><code>…</code></pre>`
- **THEN** the `<pre>` element's computed `border-radius` is `0px`

#### Scenario: Hero image has no rounded corners

- **WHEN** a blog post with a `heroImage` renders
- **THEN** the hero `<img>` element's computed `border-radius` is `0px`

#### Scenario: Content images have no rounded corners

- **WHEN** an `<img>` renders inside the prose region (i.e., from markdown body)
- **THEN** its computed `border-radius` is `0px`

#### Scenario: Tag pill radius preserved

- **WHEN** a `.tag-pill` element renders
- **THEN** its computed `border-radius` is greater than `0px` (matching the existing radius scale, e.g., 4px)

### Requirement: Interactive `##` anchor marker on prose H2

The site SHALL render a `##` marker immediately to the left of every `<h2>` element inside the `.prose` region. The marker SHALL be a real DOM element (an `<a class="heading-anchor" href="#<slug>">`), not a CSS `::before` pseudo-element, so it is keyboard-focusable and clickable. The marker SHALL render in `--font-serif` at `--color-muted` in its default state. On hover and on `:focus-visible` the marker SHALL change color to `--color-hot` (a deep orange, ≈`#E55720`). On click the marker SHALL: (a) copy the absolute URL to the section (origin + pathname + `#<slug>`) to the user's clipboard via `navigator.clipboard.writeText`, (b) swap its visible content from the `##` glyph to a check-mark SVG icon for ~1500ms, then revert. The marker SHALL be positioned in the left gutter via absolute positioning (relative to its parent `<h2>`) so it does not affect text wrapping. On viewports narrower than the prose column plus the gutter, the marker MAY overlap or collapse against the heading but SHALL NOT cause horizontal overflow.

Each `<h2>` inside the `.prose` region SHALL receive an `id` attribute derived from the slugified heading text (lowercase, non-alphanumeric runs collapsed to `-`, trimmed).

#### Scenario: Default state

- **WHEN** a blog post page renders an `<h2>` inside the prose region
- **THEN** the H2 contains an `<a class="heading-anchor" href="#<slug>">` as its first child, the H2 itself has `id="<slug>"`, and the anchor's computed `color` resolves to `--color-muted` and its computed `font-family` resolves to `--font-serif`

#### Scenario: Hover state

- **WHEN** the user hovers a `.heading-anchor` element
- **THEN** its computed `color` resolves to `--color-hot` (deep orange, ≈`#E55720`)

#### Scenario: Click copies URL and flashes checkmark

- **WHEN** the user clicks a `.heading-anchor` whose `href` is `#getting-started` on a post served from `https://philg0ld.com/blog/foo/`
- **THEN** the clipboard receives the string `https://philg0ld.com/blog/foo/#getting-started`, the anchor element receives a `.copied` class for ~1500ms, the `##` glyph is hidden while `.copied` is set, and a check-mark SVG icon is visible in its place

#### Scenario: H2 outside `.prose` unaffected

- **WHEN** an `<h2>` renders outside the `.prose` region (e.g., the `.eyebrow` H2 on the homepage)
- **THEN** no `.heading-anchor` element is injected and no `id` is added

#### Scenario: No horizontal overflow on narrow viewports

- **WHEN** a blog post is viewed on a viewport narrower than `--prose-max-width + 280px`
- **THEN** the `.heading-anchor` does not cause a horizontal scrollbar on `<body>` and does not push the heading text below the visible viewport

#### Scenario: Idempotent re-injection

- **WHEN** the rehype-heading-anchors plugin processes an `<h2>` that already contains a `.heading-anchor` first child
- **THEN** it does not add a second anchor element

### Requirement: Section divider rendered as centered asterisks

The site SHALL style `<hr>` elements inside the `.prose` region to render as a centered `* * *` glyph instead of a horizontal rule. The default border SHALL be removed; the asterisks SHALL be injected via CSS pseudo-content; color SHALL resolve to `--color-muted`.

#### Scenario: HR renders as asterisks inside prose

- **WHEN** a blog post markdown contains `---` or `***` between paragraphs
- **THEN** the rendered `<hr>` displays a centered `* * *` glyph and has no visible 1px rule

#### Scenario: HR outside prose unaffected

- **WHEN** an `<hr>` renders outside the `.prose` region
- **THEN** it falls back to the default thin slate rule defined for global `<hr>`
