## MODIFIED Requirements

### Requirement: Page shell — header, footer, content column

The site SHALL render a thin header containing the site name and primary nav, a single-column main content area, and a minimal text footer. The header SHALL NOT use a white panel with a box-shadow. The nav content (wordmark on the left, links on the right) SHALL be horizontally constrained to the same `--prose-max-width` as `<main>` and centered, so the wordmark aligns with the left edge of the prose column and the rightmost nav element aligns with its right edge. The header chrome (background, border) MAY span the full viewport width.

#### Scenario: Header chrome

- **WHEN** any page renders
- **THEN** the `<header>` element has a transparent or page-matching background, no `box-shadow`, and a single 1px or smaller bottom border (or no border)

#### Scenario: Footer content

- **WHEN** any page renders
- **THEN** the `<footer>` contains the copyright line as plain text, centered or left-aligned, with no gradient background

#### Scenario: Nav alignment with prose column

- **WHEN** the viewport is wider than `--prose-max-width`
- **THEN** the `<nav>` content has `width: var(--prose-max-width)` (or equivalent), is horizontally centered inside the `<header>`, and its wordmark sits at the same x-coordinate as the left edge of `<main>` while the rightmost nav element sits at the same x-coordinate as the right edge of `<main>`

#### Scenario: Nav alignment on narrow viewports

- **WHEN** the viewport is ≤ `--prose-max-width`
- **THEN** the `<nav>` shrinks to viewport width minus the header's horizontal padding (no horizontal scrollbar, no overflow)

## ADDED Requirements

### Requirement: Section eyebrow heading

The site SHALL provide a reusable `.eyebrow` class for small-caps section dividers (e.g., `WRITING`, `TOPICS`). The class SHALL apply to heading elements (typically `<h2>`) and SHALL render in the monospace stack, the muted color token, uppercase, with positive letter-spacing, at a font-size smaller than body text.

#### Scenario: Eyebrow visual properties

- **WHEN** an `<h2 class="eyebrow">WRITING</h2>` element renders
- **THEN** its computed style resolves to: `font-family: var(--font-mono)`, `color: var(--color-muted)`, `text-transform: uppercase`, `letter-spacing` greater than 0, and `font-size` less than `1rem`

#### Scenario: Eyebrow reusable across pages

- **WHEN** the `.eyebrow` class is used on more than one page
- **THEN** its styles resolve from a single declaration in `src/styles/global.css` (not duplicated in per-page scoped styles)

### Requirement: Topic tag pill component

The site SHALL provide a reusable `.tag-pill` class for navigation-weight tag labels (used in topic clouds). The class SHALL render as an `inline-flex` element in the monospace stack, uppercase, with a 1px border in a rule-colored token, small horizontal padding, and a rounded corner radius consistent with the existing radius scale.

#### Scenario: Pill visual properties

- **WHEN** an element with class `.tag-pill` renders
- **THEN** its computed style resolves to: `display: inline-flex`, `font-family: var(--font-mono)`, `text-transform: uppercase`, `border` of 1px solid using a token (e.g., `var(--color-rule)` or a slightly stronger variant), `border-radius` matching the rest of the theme, and small horizontal padding (≥ 0.4em)

#### Scenario: Pill reusable across pages

- **WHEN** the `.tag-pill` class is used on more than one page (homepage and `/blog/`)
- **THEN** its styles resolve from a single declaration in `src/styles/global.css`

#### Scenario: Post-body tags unaffected

- **WHEN** a blog post page renders its `#tag` labels at the bottom of the post body
- **THEN** those labels continue to use the existing muted-span style, not the `.tag-pill` class (the pill is a navigation primitive, not a post-metadata primitive)
