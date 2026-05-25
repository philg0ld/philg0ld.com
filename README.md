# philg0ld.com

Source for [philg0ld.com](https://philg0ld.com) — Phil Goldman's personal blog on data engineering, Databricks, Azure, AI/ML, and Claude Code workflows.

Built with [Astro](https://astro.build) and deployed to GitHub Pages.

## Stack

- **Astro 6** + MDX for content
- **GitHub Pages** for hosting (auto-deploy on push to `main`)
- **Atkinson Hyperlegible** font, served locally
- TypeScript strict, Node 22+

## Local development

```sh
npm install
npm run dev       # localhost:4321
npm run build     # production build to dist/
npm run preview   # preview the build locally
```

## Content

Blog posts live in `src/content/blog/` as Markdown or MDX. Frontmatter is type-checked against a Zod schema in `src/content.config.ts`.

## Conventions

Authoring workflow, voice guidelines, deploy notes, and contribution rules live in [`AGENTS.md`](./AGENTS.md).

## Credit

Theme is based on the [Astro Blog Starter](https://github.com/withastro/astro/tree/main/examples/blog), which in turn is based on [Bear Blog](https://github.com/HermanMartinus/bearblog/).
