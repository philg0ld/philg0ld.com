## Context

The site is on v0.0.1. The current `/` was written to the `Homepage — intro paragraph plus recent writing list` requirement from the previous change: a giant `<h1>Phil Goldman</h1>`, one tagline `<p>`, a `Recent writing` H2, and a list of up to 10 posts. That requirement is what we're explicitly replacing. The Topics cloud exists today on `/blog/` only, in a quiet lowercase no-border style — we'll restyle it and also surface it on `/`. No backend, no client framework; pure static Astro + scoped CSS.

## Goals / Non-Goals

**Goals:**
- Match kau.sh's structural pattern on `/` (intro paragraphs → topic cloud → writing list) without copying its colors or font weights — keep our warm-neutral palette.
- Introduce the eyebrow heading and tag-pill as reusable visual primitives, not one-off home styles.
- Eliminate the home/blog listing CSS duplication that's been accumulating since v0.0.1.
- Keep the change strictly additive on tokens (no breaking renames in `:root`).

**Non-Goals:**
- Dark mode.
- About page restructure.
- Functional `/tag/<name>/` routes.
- Stripping test posts (separate user decision).
- Restyling post-page tag rendering at the bottom of individual blog posts.

## Decisions

### D1. Drop the H1 entirely on `/`, no replacement

Don't replace the `<h1>Phil Goldman</h1>` with a smaller H1 or visually-hidden H1 — just remove it. The nav wordmark `<h2><a href="/">Phil Goldman</a></h2>` already names the page. The intro paragraphs are the first content. This means the home `<main>` has no `<h1>` at all, which is unusual but matches kau.sh and is HTML5-valid (the document outline is fine without it).

*Alternative considered:* visually-hidden `<h1>` for accessibility/SEO. Rejected — the `<title>` tag and `<meta description>` already cover both, and a hidden H1 reading "Phil Goldman" is the kind of accessibility theater that doesn't actually help anyone.

### D2. Eyebrow heading as a reusable component, not page-scoped

The `WRITING` small-caps heading isn't unique to `/` — it'll be useful again (e.g., `TOPICS`, `ELSEWHERE`, `RECENT`). Promote it to a global `.eyebrow` class in `global.css`: mono font, muted color, uppercase, letter-spaced, smaller than body. Used as `<h2 class="eyebrow">WRITING</h2>`.

*Alternative considered:* per-page scoped style. Rejected — we'd write it twice within the same change. Token-it-once is the cheaper path.

### D3. Tag pills as a reusable component too

Same logic: `.tag-pill` class in `global.css`. Style: `display: inline-flex`, mono font, ALL-CAPS via `text-transform: uppercase`, 1px border in `--color-rule` (or a slightly stronger rule token), small horizontal padding, `border-radius` matching our existing `4px` token. Used both for the Topics cloud on `/` and `/blog/`. The post-body `#tag` spans at the bottom of individual posts stay as-is (intentionally quieter — they're metadata, not navigation).

*Alternative considered:* match the post-body `#tag` style and use it everywhere. Rejected — the cloud is a navigation primitive and benefits from visual weight (it's a TOC); the post-body tags are afterthought metadata.

### D4. Topics cloud builds from the live blog collection — no curation

Compute the cloud the same way `/blog/` does today: iterate `getCollection('blog')`, count tags, sort by count desc then name asc, render as pills. No allow-list, no hide-list. If test posts are still in the collection, their tags will show up. This is a *content* problem, not a code problem, and the cloud should reflect the truth of what's in the repo.

*Alternative considered:* filter out specific tags (e.g., hide `testing`). Rejected — silently dropping data from the index is the kind of helpful magic that bites later. Strip the test posts when you're ready.

### D5. Show all published posts on `/`, drop the cap

Remove the `.slice(0, 10)` from `/`. The home now shows the same set of posts as `/blog/`. With ~5 posts today the difference is zero; the spec captures the intent for later. If/when the list grows past ~50 entries we can revisit pagination, but kau.sh runs ~50 fine on one page so we're not near that limit.

*Alternative considered:* configurable cap with sensible default. Rejected — premature config knob.

### D6. Extract shared `PostList.astro` now

The listing markup + styles are about to live in three places: `/`, `/blog/`, and (effectively) `/search/`'s Pagefind result rendering. The earlier "inline both" call from the previous change was correct for two near-identical copies; with three uses on the horizon and the new pill class to share, extract a `src/components/PostList.astro` that takes `{ posts }` and renders the `<ul>` + scoped styles. Pages then become thinner.

*Alternative considered:* keep inlining. Rejected — the duplication is now 3× and one of the call sites (the eyebrow heading) will diverge if we don't centralize.

### D7. Apply the new pill style to `/blog/` Topics cloud in the same change

If we leave `/blog/` on the lowercase quieter style and `/` gets the new bordered pills, the same visual primitive looks like two different ideas. Apply once, everywhere it's used. The cost is small (one class swap in `/blog/`).

*Alternative considered:* keep `/blog/` quieter, only `/` is loud. Rejected — splits the visual vocabulary for no reason.

### D8a. Header nav constrained to prose column

Today the nav stretches edge-to-edge: the wordmark sits at the viewport-left padding and the nav links sit at the viewport-right padding. On wide displays this visually divorces the header from the centered content column below it. Constrain `<nav>` to `width: var(--prose-max-width); margin: 0 auto`, keeping the `<header>` chrome (border-bottom) full-width. The wordmark now sits at the same x-coordinate as the left edge of `<main>`, and the rightmost nav item aligns with the right edge of `<main>`. Matches kau.sh.

*Alternative considered:* constrain the entire `<header>` (border too). Rejected — full-width bottom border anchors the page chrome better; the kau.sh comparison was about content alignment, not chrome.

### D8. Intro paragraphs — write a fresh, home-specific bio

The About page lede stays put. The home gets its own two-paragraph intro: first paragraph = "who I am" (name + current role + what I'm focused on), second paragraph = "what I write about and why anyone should read it." Tonally similar to About but written for first-time landing. Concrete nouns where possible (Databricks, Delta Lake, Claude Code) rather than generic categories ("data engineering, AI/ML").

## Risks / Trade-offs

- **[Test post tags pollute the Topics cloud]** → Mitigation: documented in proposal Impact; user strips test posts when ready. The cloud is dynamic — fix is content, not code.
- **[No `<h1>` on `/` is unusual for SEO scoring tools]** → Mitigation: site `<title>` and `<meta description>` carry the keywords; Google has been fine with H1-less pages for years. Accept the trade for the structural win.
- **[Bordered pills shift the page from "calm" to "punchy"]** → Mitigation: intentional. Shape A was chosen explicitly. Tunable by easing back the border weight or palette if it lands too loud — small lever.
- **[Eyebrow + pill primitives may be over-generalized for one-time use]** → Mitigation: I'd be wrong about this only if no other page ever uses a small-caps section divider or a topic pill. Given About already uses `#work`/`#writing`/`#elsewhere` H2s that could become eyebrows in a follow-up, the bet is sound.
- **[Bundle size]** → Net change ≈ 0. Adding ~30 lines of CSS, removing the inline-CSS duplication on two pages. Possibly net negative after the PostList extract.

## Migration Plan

Single PR, single push to `main` (production-deploy on push). Order:
1. Add `.eyebrow` and `.tag-pill` classes + any new tokens in `global.css`.
2. Create `src/components/PostList.astro` and migrate `/blog/` to use it (no visual change beyond the pill style swap).
3. Rewrite `src/pages/index.astro` to the new shape, consuming `PostList`.
4. `npm run build`, preview, eyeball every route.
5. Push. GH Actions deploys.

Rollback = `git revert`. No data migration. No URL changes.

## Open Questions

- Exact intro copy — drafted as part of implementation, reviewable in preview before commit. Not a spec-level concern.
- Pill border weight — eyeball during implementation. Either 1px in `--color-rule` (subtle) or 1.5px in a slightly darker tone. Defer to in-browser pick.
