# Content authoring

All MDX documents live here. Each subdirectory maps to a Contentlayer document type defined in `contentlayer.config.ts` at the repo root. Adding/editing content requires no code changes — just write MDX with the right frontmatter and run `pnpm typecheck` (which rebuilds Contentlayer).

## Document types

| Path | Type | URL |
|---|---|---|
| `blog/posts/*.mdx` | `BlogPost` | `/gui/blog/posts/<slug>` |
| `projects/*.mdx`   | `Project`  | `/gui/projects/<slug>` |
| `designs/*.mdx`    | `Design`   | `/gui/designs/<slug>` |
| `pages/*.mdx`      | `Page`     | `/gui/<slug>` (the `pages/` prefix is stripped) |

The `/tui/` route renders the same documents in terminal style — no separate authoring needed.

## Frontmatter

### `BlogPost` — `content/blog/posts/<slug>.mdx`

```yaml
---
title: 'string'                       # required
description: 'string'                 # required
authorGithubUsername: 'string'        # required
readTime: 3                           # required, minutes
publishedAt: '2024-05-10'             # required, ISO date
image: '/img/foo.gif'                 # optional
tags:                                 # optional, must be from allowed list
  - fun
---
```

Allowed tags (defined in `src/utils/blog/tags.ts`):
`devops`, `gotchas`, `react`, `docker`, `github`, `nextjs`, `fun`

To add a new tag: edit `src/utils/blog/tags.ts`. Contentlayer reads the list at build time, so the enum updates automatically.

### `Project` — `content/projects/<slug>.mdx`

```yaml
---
title: 'string'                       # required
repository: 'owner/repo'              # required
deprecated: false                     # required
role: 'author' | 'contributor'        # required
description: 'string'                 # required
---
```

### `Design` — `content/designs/<slug>.mdx`

```yaml
---
title: 'string'                       # required
description: 'string'                 # required
mode: 'light' | 'dark'                # required, controls page theme
---
```

### `Page` — `content/pages/<slug>.mdx`

```yaml
---
title: 'string'                       # required
description: 'string'                 # optional
template: 'default'                   # required
---
```

## MDX features available

- **GFM** (tables, strikethrough, task lists) via `remark-gfm`
- **GitHub-style alerts** via `remark-github-blockquote-alert`:
  ```
  > [!NOTE]
  > Helpful context
  ```
- **Code highlighting** via `rehype-pretty-code` (theme: `github-dark`)
  - Line highlighting: ```` ```ts {1,3-5} ````
  - Word highlighting: ```` ```ts /word/ ````
- **Auto-linked headings** via `rehype-autolink-headings` (anchor class `subheading-anchor`)
- **Raw HTML / JSX** is supported (e.g. `<img src="..." />` in `designs/coding-states.mdx`)

## Assets

Images go in `public/img/...` and are referenced with absolute paths (`/img/foo.png`). Image optimization is **disabled** (static export), so size images appropriately before committing.

## After editing content

```bash
pnpm typecheck   # rebuilds contentlayer + validates frontmatter against schema
```

If frontmatter is wrong, contentlayer fails the build with a per-file error.
