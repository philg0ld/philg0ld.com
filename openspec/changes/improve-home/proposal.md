**Outcome:** the homepage reads as "letter from a person → their themes → their writing" instead of "name → tagline → recent posts."

## Why

The current `/` is a textbook starter layout: a giant `Phil Goldman` H1 that duplicates the nav wordmark, a one-sentence tagline that reads like a `<meta description>`, then "Recent writing." Compared side-by-side with [kau.sh](https://kau.sh/) — our explicit voice anchor — the page signals "personal site template" rather than "engineer thinking out loud." kau.sh drops the H1 entirely, opens with two substantive paragraphs of bio, then plants a topic tag cloud as a what-I-think-about index, then lists writing under a quiet `WRITING` eyebrow. The structural shift is small but it changes who the page is for: a stranger lands and instantly knows who is talking and what they care about.

## What Changes

- Drop the `<h1>Phil Goldman</h1>` on `/`. The nav wordmark already names the site.
- Replace the one-sentence tagline with **two substantive intro paragraphs** ("who I am" + "what I write about and why").
- Add a **Topics tag cloud** on the homepage, built from real blog-collection tags with post counts.
- Replace the `Recent writing` H2 with a small-caps `WRITING` **eyebrow heading**.
- **Show all published posts** on the homepage (drop the `.slice(0, 10)` cap).
- Add two new visual primitives to the theme:
  - A small-caps eyebrow heading style (mono, muted, letter-spaced) reusable as a section divider.
  - An all-caps bordered tag-pill style (rounded outline, mono, ALL-CAPS) for the Topics cloud on both `/` and `/blog/`.
- Apply the new pill style to the existing Topics cloud on `/blog/` for consistency.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `site-theme`: add two new visual primitives — an eyebrow section heading and an all-caps bordered tag pill — as canonical components consumable by any page.
- `post-presentation`: replace the existing `Homepage — intro paragraph plus recent writing list` requirement with the new kau.sh-shaped homepage; add a new `Topics tag cloud` requirement that codifies the cloud on both `/` and `/blog/`.

## Impact

- **Code:** `src/pages/index.astro` (full rewrite), `src/pages/blog/index.astro` (tag-cloud markup re-styled to use new pill class), `src/styles/global.css` (add eyebrow + tag-pill classes/tokens), possibly extract a shared `PostList.astro` component now that home and `/blog/` use the identical listing.
- **About page:** unchanged in this round (home is the teaser, About stays the deep page per agreed split).
- **Content:** Topics cloud is data-driven — it will currently include `testing` / `design` / `code` / `images` / `longform` / `walkthrough` tags from the four test posts. The cloud will look more meaningful once test posts are stripped or real posts arrive. Not blocking; flagged.
- **Dependencies:** no new runtime or dev deps.
- **URLs & feeds:** unchanged. RSS, sitemap, GA snippet untouched.

## Non-goals

- Dark mode.
- Removing or rebuilding the `/about/` page.
- Real `/tag/<name>/` routes — Topics pills continue to link to `/search/?q=<tag>` in this round.
- Stripping or rewriting the four test blog posts (separate decision).
- Changing how post-page tags render at the bottom of individual posts (they stay as muted `#tag` spans, not bordered pills).
