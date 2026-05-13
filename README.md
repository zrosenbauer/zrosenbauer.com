<div align="center">
  <img src="./.github/assets/banner.jpg" alt="zrosenbauer.com" width="100%" />
  <p><strong>Personal site & blog for Zac Rosenbauer. Statically exported Next.js with a GUI and a TUI over the same MDX content.</strong></p>

<a href="https://zrosenbauer.com"><img src="https://img.shields.io/badge/live-zrosenbauer.com-181717?logo=githubpages" alt="Live site" /></a>
<a href="https://github.com/zrosenbauer/zrosenbauer.com/actions/workflows/ci.yml"><img src="https://github.com/zrosenbauer/zrosenbauer.com/actions/workflows/ci.yml/badge.svg?branch=main" alt="CI" /></a>
<a href="https://github.com/zrosenbauer/zrosenbauer.com/actions/workflows/deploy.yml"><img src="https://github.com/zrosenbauer/zrosenbauer.com/actions/workflows/deploy.yml/badge.svg?branch=main" alt="Deploy" /></a>
<a href="./LICENSE"><img src="https://img.shields.io/badge/code-MIT-green" alt="Code license: MIT" /></a>

</div>

## Layout

Two front ends, same MDX content:

- `/gui` — the graphical web UI
- `/tui` — a terminal-style alt UI

Content lives in `content/` (blog posts, projects, designs, pages). Routes in `src/app/`. Tailwind v4, contentlayer, shadcn primitives, oxlint + oxfmt.

## Scripts

```bash
pnpm dev           # local dev server
pnpm build         # contentlayer + static export to out/
pnpm preview       # build + serve out/
pnpm typecheck     # contentlayer + tsc
pnpm lint          # oxlint
pnpm format        # oxfmt
pnpm lint:content  # alex (inclusivity + profanity over MDX)
```

## License

- **Code, configuration, tooling** — MIT, see [`LICENSE`](./LICENSE).
- **Content** (posts, designs, project entries, page copy, prose, imagery in `public/img/`) — All Rights Reserved, see [`content/LICENSE`](./content/LICENSE).

For permission to reuse content beyond fair use, [me@zrosenbauer.com](mailto:me@zrosenbauer.com).
