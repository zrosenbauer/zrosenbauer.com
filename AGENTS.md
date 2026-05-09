# zrosenbauer.com

Personal site & blog. Statically exported Next.js 16 app, MDX content via Contentlayer, Tailwind v4 + shadcn/ui (new-york).

## Scripts (pnpm)

```bash
pnpm dev              # next dev (webpack flag — required for contentlayer HMR)
pnpm build            # contentlayer build → next build (writes static export to out/)
pnpm preview          # build + serve out/
pnpm typecheck        # contentlayer build → tsc --noEmit
pnpm lint             # oxlint
pnpm lint:fix         # oxlint --fix
pnpm format           # oxfmt (writes in place)
pnpm format:check     # oxfmt --check
pnpm knip             # unused-export check
```

## Layout

```
content/         # MDX (blog posts, projects, designs, pages) — see content/AGENTS.md
src/             # app, components, utils — see src/AGENTS.md
public/          # static assets (images, fonts, etc.)
scripts/         # dev/tooling scripts
.contentlayer/   # generated; don't edit, don't commit
.scratch/        # uncommitted notes, drafts, throwaway files (gitignored)
out/             # static export build output; don't edit, don't commit
```

## Scratchpad convention

`.scratch/` is gitignored. When the user asks you to "add to scratch", "put this in scratchpad", or otherwise indicates a file shouldn't be committed, write it under `.scratch/` instead of `contributing/`, the repo root, or anywhere tracked. Same default applies if you produce a draft, review report, or analysis doc unprompted — put it in `.scratch/` unless the user explicitly says it belongs in a tracked location.

## Routing model

Two parallel route trees render the same content:

- `/gui/...` — visual web UI (the "real" site)
- `/tui/...` — terminal-style alt UI

Contentlayer-generated paths point at `/gui/<flattenedPath>`. Pages under `content/pages/` get the `pages/` prefix stripped (so `content/pages/about.mdx` → `/gui/about`).

## Gotchas

- `pnpm typecheck` runs `contentlayer build` first — running `tsc` alone will fail if `.contentlayer/generated` is stale.
- Static export (`output: 'export'`) only flips on in production. In dev you have full Next features.
- `next.config.mjs` opts into `experimental.mdxRs` and Turbopack, but `pnpm dev` uses `--webpack` because contentlayer's HMR plugin is webpack-only.
- The CLAUDE.md files at `./`, `content/`, and `src/` are symlinks to AGENTS.md — edit AGENTS.md, not the symlink.

@content/AGENTS.md
@src/AGENTS.md
