# zrosenbauer.com

Personal website for Zac Rosenbauer, published at [zrosenbauer.com](https://zrosenbauer.com).

The site has two front ends over the same content:

- `/tui` - a keyboard-driven terminal interface with in-terminal reading views.
- `/gui` - a classic web layout for browsing projects, posts, designs, about, and contact pages.

## Stack

- Next.js App Router with static export for GitHub Pages
- React, TypeScript, and Tailwind CSS
- Contentlayer for MDX-backed pages, blog posts, projects, and designs
- pnpm for package management

## Development

```bash
pnpm install
pnpm dev
pnpm build
```

Useful checks:

```bash
pnpm check:types
pnpm lint
pnpm format:check
```
