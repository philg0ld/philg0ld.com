# philg0ld.com — agent guide

Personal blog by Phil Goldman. Astro 6 + MDX, deployed to GitHub Pages on push to `main`. Custom domain `philg0ld.com` (via `public/CNAME`).

Parent area: see [`../AGENTS.md`](../AGENTS.md) for brand themes, 2026 goals, and content strategy. This file covers the **site repo** specifically.

## Quick commands

| Command | Action |
|---|---|
| `npm run dev` | Local dev server on `localhost:4321` |
| `npm run build` | Production build to `./dist/` |
| `npm run preview` | Preview the built site locally |
| `npm run astro check` | Type-check Astro files + content collection schema |

Run `npm run build` before suggesting a commit. The GH Actions pipeline only does build — type/schema errors that escape the IDE will fail in CI.

## Repo layout

```
src/
├── content/blog/         # Markdown/MDX posts (one collection: 'blog')
├── content.config.ts     # Zod schema for blog frontmatter
├── consts.ts             # SITE_TITLE, SITE_DESCRIPTION
├── pages/                # Routes: index.astro, blog/, rss.xml.js
├── layouts/BlogPost.astro
├── components/           # Header, Footer, BaseHead, FormattedDate, HeaderLink
├── styles/global.css     # Bear Blog–derived defaults
└── assets/fonts/         # Atkinson Hyperlegible (local woff)
public/                   # Static assets (favicon, CNAME — DO NOT delete CNAME)
.github/workflows/deploy.yml
```

## Content: blog posts

### Schema (enforced via Zod in `src/content.config.ts`)

```ts
{
  title: string
  description: string        // <meta description> + OG card
  pubDate: Date              // Coerced from string; 'MMM DD YYYY' works
  updatedDate?: Date         // Renders "Last updated on …"
  heroImage?: image()        // Resolved by astro:assets
  tags: string[]             // Defaults to []
  draft: boolean             // Defaults to false
}
```

`draft: true` excludes from `/blog/` listing but does **not** block the build — the post is still reachable by direct URL. Treat drafts as published-if-known.

### Authoring workflow (Obsidian → repo)

1. Idea/outline lives in Obsidian (`Areas/MyBrand/Journal/` or similar).
2. Copy the finalized draft into `src/content/blog/<slug>.md` (or `.mdx`).
3. Convert:
   - Obsidian wikilinks → real markdown links or remove
   - Vault frontmatter → blog schema (title/description/pubDate/tags/draft)
   - Hero image into `src/assets/blog/<slug>/hero.png` (NOT `public/`) so `astro:assets` processes it; reference relatively from frontmatter
   - Inline images go in the same `src/assets/blog/<slug>/` folder
4. Filename = URL slug. Kebab-case, no date prefix.
5. `npm run build` before committing to catch schema/image errors.

### Voice & style

Reference: [kau.sh](https://kau.sh/blog/) by Kaushik Gopal. Match these patterns:

- **Open with personal narrative.** Concrete scene, not a thesis. ("Last week I was debugging…", "I recently found myself…")
- **Variable rhythm.** Mix short declarative sentences with longer ones. Use single-sentence paragraphs for emphasis.
- **Problem first, construct second.** Show the pain point before naming the solution. Never define abstractly ahead of the reader feeling the need.
- **Numbered scaffolding** for multi-step posts (Step 0, Step 1…) with descriptive subtitles.
- **First person, conversational + authoritative.** Mark opinions explicitly: "My take:", "What I'd actually ship:", "Not the way I'd do this."
- **Concrete over abstract.** Real folder paths, real code, real numbers. No generic `foo`/`bar`.
- **Offload dense theory** to a linked reference rather than exhausting the reader inline.
- **Close with acknowledgments or a short revision log**, not a grand conclusion.

Avoid: marketing-speak ("leverage", "unleash", "synergy"), buzzword stacks, LinkedIn-style hooks on technical posts, bullet lists where prose would do.

Note: kau.sh uses sparing inline emoji markers as judgment cues. My global no-emoji rule overrides this — agents skip them. I add by hand if I want them.

## Site customization

Built on the Astro Blog Starter (Bear Blog lineage). Defaults:

- **Match existing style.** Component conventions, scoped `<style>` blocks. Don't introduce Tailwind / CSS-in-JS without explicit ask.
- **`src/consts.ts` is the single source** for `SITE_TITLE` / `SITE_DESCRIPTION`. Update there, not in pages.
- **Color palette and base typography** in `src/styles/global.css` (`--accent`, `--gray*`).
- **SEO meta** is centralized in `src/components/BaseHead.astro`. Open Graph + Twitter Card already wired.
- **Don't refactor adjacent untouched code** when making a focused change.

## Build & deploy

- Trigger: push to `main` → `.github/workflows/deploy.yml`
- Node 22 (pinned in workflow; `package.json` requires `>=22.12.0`)
- Flow: `npm ci && npm run build` → uploads `dist/` artifact → `actions/deploy-pages@v4`
- Verify after push: GitHub Actions tab; run takes ~1–2 min.
- **`public/CNAME` keeps the custom domain working — don't modify or delete unless explicitly changing the domain.**

## Integrations

| Integration | Location | Notes |
|---|---|---|
| Google Analytics | `src/components/BaseHead.astro` (inline) | ID `G-QHL6MG41R7`. Public; safe to commit. |
| RSS | `src/pages/rss.xml.js` | Auto-built from blog collection |
| Sitemap | `@astrojs/sitemap` | Auto at `/sitemap-index.xml` |
| Atkinson font | `astro.config.mjs` fonts API + `src/assets/fonts/` | Local woff, preloaded via `<Font>` |

If we later add a comment system, newsletter, or auth: use env vars + GH Secrets, never inline.

## OpenSpec workflow

This repo uses [OpenSpec](https://github.com/Fission-AI/OpenSpec) for spec-driven changes. Config in `openspec/config.yaml`; slash-commands under `.claude/commands/opsx/`.

**Reach for `/opsx:propose`** when the work is:
- A new feature (search, comments, newsletter, tag pages, dark mode, post series)
- A structural change (new content collection, layout overhaul, route redirects, i18n)
- An integration (analytics swap, CMS, image CDN, third-party widget)

**Skip OpenSpec — just do it** for:
- Writing or editing blog posts
- Dependency bumps, copy/style/typo fixes
- Single-component tweaks with no behavior change
- README, CHANGELOG, or AGENTS.md edits

Flow: `/opsx:propose <kebab-name>` → `/opsx:apply <name>` → `/opsx:archive <name>`. Use `/opsx:explore` to think through an idea without writing code.

## Guardrails

- **Never commit/push without explicit ask** (global default). Push to `main` = production deploy. No preview env.
- **Commit message style** (match existing log): imperative, capitalized first word, no conventional-commits prefix. e.g. "Fix LinkedIn URL to correct profile" — not "fix: linkedin url".
- **No secrets in the repo.** GA ID is the only public ID currently committed.
- **`README.md`** is still the unmodified Astro starter. Replace it the first time we want a real README — don't keep patching the template.

## Changelogs

For user-visible changes, add one line under `## [Unreleased]` in `CHANGELOG.md` in the same commit. Pick one category:
**Added** · **Changed** · **Deprecated** · **Removed** · **Fixed** · **Security**.

Line format: `- <Category>: <one-line description>` (past tense, no trailing period).
Skip: typos, comment-only edits, internal refactors with no observable effect.
On release: rename `## [Unreleased]` to `## [X.Y.Z] — YYYY-MM-DD` and add a fresh `## [Unreleased]` above it.

Standard: [Keep a Changelog 1.1.0](https://keepachangelog.com/en/1.1.0/) · [SemVer 2.0](https://semver.org/spec/v2.0.0.html)

## Related

- Parent area: [`../AGENTS.md`](../AGENTS.md)
- Vault root: vault-wide conventions in `/AGENTS.md`
- Voice reference: [kau.sh](https://kau.sh/blog/)
- `[[2026-02-26 0702 Agents for Posts and Articles]]` — content automation idea
- `[[2026-03-07 0803 Content Creation]]` — content-creator skill concept
