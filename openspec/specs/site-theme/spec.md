# site-theme Specification

## Purpose

Defines the visual theme of philg0ld.com: design tokens, palette, typography, layout proportions, and chrome (header/footer/code/blockquote treatments). Establishes a restrained warm-neutral aesthetic in the spirit of kau.sh, built on the existing Astro + Atkinson Hyperlegible stack with no new runtime dependencies.

## Requirements

### Requirement: Design tokens centralized at `:root`

The site SHALL expose its visual design as CSS custom properties declared at `:root` in `src/styles/global.css`, grouped into color tokens, typography tokens, and spacing tokens. Component-scoped styles SHALL consume these tokens rather than hard-coding values.

#### Scenario: Token consumption

- **WHEN** a developer inspects a styled element in DevTools
- **THEN** its color, font, and spacing values resolve to `:root` custom properties (e.g., `--color-ink`, `--text-base`, `--space-prose`) rather than literal hex/px values defined in scoped styles

#### Scenario: Single source for accent color

- **WHEN** the accent color is changed in `:root`
- **THEN** links, blockquote bars, and active nav underlines across the site update without further edits

### Requirement: Restrained warm-neutral palette

The site SHALL use an off-white warm-neutral background, near-black ink for body text, mid-gray for muted metadata, and a single restrained accent hue. The site SHALL NOT use gradient backgrounds.

#### Scenario: Background is not pure white

- **WHEN** any page is rendered
- **THEN** the page background is an off-white warm neutral, not `#ffffff` and not a linear-gradient

#### Scenario: Single accent

- **WHEN** counting distinct accent colors used across links, blockquotes, and active nav state
- **THEN** all three resolve to the same `--color-accent` token

### Requirement: Atkinson body with tightened modular scale

The site SHALL use Atkinson Hyperlegible (already loaded as `--font-atkinson`) for body and headings, a base body size of 18–19px, body line-height ≈1.6, and a heading scale where the H1 is between 2.0em and 2.4em.

#### Scenario: H1 sizing

- **WHEN** a blog post page renders its `<h1>`
- **THEN** the computed `font-size` is between 2.0em and 2.4em (not the prior 3.052em)

#### Scenario: System monospace for code

- **WHEN** an inline `<code>` or `<pre><code>` block is rendered
- **THEN** its `font-family` resolves to a system monospace stack (`ui-monospace, SF Mono, Menlo, Consolas, monospace`) with no web font download

### Requirement: Narrow centered prose column

The site SHALL render long-form prose inside a centered column whose `max-width` is between 680px and 720px and reduces to full width minus 2em padding on viewports ≤720px.

#### Scenario: Desktop prose width

- **WHEN** the viewport is wider than 720px
- **THEN** the prose container width is between 680px and 720px and is horizontally centered

#### Scenario: Mobile prose width

- **WHEN** the viewport is ≤720px
- **THEN** the prose container fills the viewport minus a 1em side padding

### Requirement: Distinctive inline-code and blockquote treatment

The site SHALL style inline `<code>` with a subtle background tint and 2–4px horizontal padding, and style `<blockquote>` with a left border in the accent color and italic-free body text (relying on the border, not font-style, for emphasis).

#### Scenario: Inline code

- **WHEN** an inline `<code>` element renders
- **THEN** it has a subtle background fill distinguishable from the page background and small horizontal padding

#### Scenario: Blockquote

- **WHEN** a `<blockquote>` renders
- **THEN** it has a left border using `--color-accent` and its text is not italicized by default

### Requirement: Code-block syntax highlighting theme

The site SHALL configure Astro's built-in Shiki highlighter with a single light theme via `markdown.shikiConfig` in `astro.config.mjs`. The configured theme SHALL be one of Shiki's stock light themes (e.g., `github-light`, `min-light`, `vitesse-light`). Code blocks SHALL be styled with tighter padding than the Bear default and SHALL NOT use the heavy default background.

#### Scenario: Code block renders with configured theme

- **WHEN** a markdown post containing a fenced code block is built
- **THEN** the rendered HTML applies inline Shiki styles from the configured theme

#### Scenario: No new highlighting dependency

- **WHEN** inspecting `package.json` after the change
- **THEN** no new syntax-highlighting package (e.g., `expressive-code`, `prismjs`) has been added

### Requirement: Page shell — header, footer, content column

The site SHALL render a thin header containing the site name and primary nav, a single-column main content area, and a minimal text footer. The header SHALL NOT use a white panel with a box-shadow.

#### Scenario: Header chrome

- **WHEN** any page renders
- **THEN** the `<header>` element has a transparent or page-matching background, no `box-shadow`, and a single 1px or smaller bottom border (or no border)

#### Scenario: Footer content

- **WHEN** any page renders
- **THEN** the `<footer>` contains the copyright line as plain text, centered or left-aligned, with no gradient background

### Requirement: No new runtime dependencies

The change SHALL NOT introduce any new runtime npm dependencies. Build-time configuration of existing packages (Astro, Shiki) is permitted.

#### Scenario: Dependency diff

- **WHEN** comparing `package.json` before and after the change
- **THEN** `dependencies` and `devDependencies` are unchanged
