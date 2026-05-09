# Code & styling

Application code: routes, components, utils. Pairs with `content/AGENTS.md` (MDX authoring) and the root `AGENTS.md` (scripts + project-wide context).

## Stack

- **Next.js 16** App Router, **static export** (`output: 'export'` in production)
- **React 19**, **TypeScript 6** (strict)
- **Contentlayer 2** for typed MDX (generated into `.contentlayer/generated`)
- **Tailwind v4** via PostCSS (`@tailwindcss/postcss`), no `tailwind.config` — config lives in `src/global.css` via `@theme`
- **shadcn/ui** (new-york style, neutral base, lucide icons) — `components.json` at repo root
- **oxlint** + **oxfmt** (Oxc toolchain) instead of ESLint/Prettier — fast, but smaller rule surface

## Layout

```
src/
  app/                  # Next App Router
    gui/                # primary visual UI — most routes live here
      [...slug]/        # catch-all for contentlayer documents
      blog/, projects/, designs/, contact/
    tui/                # terminal-style alt UI
      [...slug]/
    llms.txt/, llms-full.txt/  # llms.txt route handlers
    layout.tsx, page.tsx, not-found.tsx, landing.css
  components/
    ui/                 # shadcn output (currently empty — add via `pnpm dlx shadcn@latest add <component>`)
    blog/, md/, site/, terminal/  # feature components
    analytics.tsx
  utils/
    blog/, github/      # domain helpers
    llms.ts             # llms.txt generation
  global.css            # Tailwind v4 entry + theme tokens
```

## Path aliases (tsconfig)

| Alias | Resolves to |
|---|---|
| `@components/*` | `src/components/*` |
| `@utils/*`      | `src/utils/*` |
| `@layouts/*`    | `src/layouts/*` |
| `@types/*`      | `src/types/*` |
| `@content`      | `.contentlayer/generated` |

Always import via aliases, not relative paths across feature boundaries. `@content` gives you the typed document arrays (`allBlogPosts`, `allProjects`, etc.).

## Styling conventions

- Tailwind v4 — **no `tailwind.config.js`**. Theme tokens, custom colors, and `@layer` overrides go in `src/global.css`.
- shadcn config: new-york, CSS variables on, neutral base, prefix empty. `cn()` lives at `src/utils/cn` (alias-resolved).
- Page-specific styles: co-locate as `<route>.css` next to the route (see `src/app/landing.css`).
- For the TUI route, terminal aesthetic components live in `src/components/terminal/`.

## Linting & formatting

- `pnpm lint` / `pnpm lint:fix` — oxlint (rules in `.oxlintrc.json`)
- `pnpm format` / `pnpm format:check` — oxfmt (config in `.oxfmtrc.json`: 100 col, 2-space, single-quote, semi, trailing-comma `es5`, sorted imports)
- A Claude Code hook in `.claude/settings.json` auto-runs oxfmt after Write/Edit on `.ts/.tsx/.js/.jsx/.mjs/.cjs/.json` files — no need to format manually during a session.
- `pnpm knip` — unused exports/files. Config in `knip.json`.

## Gotchas

- **Don't import from `.contentlayer/generated` directly** — use the `@content` alias. Direct imports break when the generated dir is missing pre-build.
- **Static export limits** — no API routes, no `next/image` optimization, no middleware, no ISR. `images.unoptimized: true` is set; `<Image>` works but won't optimize.
- **Turbopack vs webpack** — `next.config.mjs` declares `turbopack: {}` (Next 16 default), but `pnpm dev` passes `--webpack` because contentlayer's HMR plugin is webpack-only. Don't "fix" this.
- **`next-env.d.ts` is gitignored** — Next regenerates it; don't commit it.
- **Strict TS** — `strict: true`, `isolatedModules: true`. Type errors block `pnpm build`.
