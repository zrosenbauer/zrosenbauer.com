# zrosenbauer.com

Personal website for Zac Rosenbauer, published at [zrosenbauer.com](https://zrosenbauer.com).

## Overview

This repo powers a small personal site with two front ends over the same MDX content:

- `/tui` - a keyboard-driven terminal interface with in-terminal reading views.
- `/gui` - a graphical web interface for projects, writing, designs, about, and contact pages.

The site is statically exported and deployed to GitHub Pages.

## Stack

- Next.js App Router
- React and TypeScript
- Tailwind CSS
- Contentlayer for MDX content
- pnpm for package management

## Project Structure

```text
content/
  blog/       Blog posts
  designs/    Design writeups
  pages/      Static pages
  projects/   Project entries
public/       Static assets
src/
  app/        Next.js routes
  components/ Shared UI, site, blog, MDX, and terminal components
  utils/      Content and integration helpers
```

## Getting Started

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`.

## Scripts

```bash
pnpm dev           # Start the local Next.js dev server
pnpm build         # Generate Contentlayer data and export the site
pnpm start         # Serve the exported out/ directory
pnpm preview       # Build, then serve the export
pnpm check:types   # Run TypeScript
pnpm lint          # Run oxlint
pnpm format:check  # Check formatting
pnpm knip          # Check for unused files/dependencies
```

## Deployment

Production builds use Next.js static export. The generated site is written to `out/` and can be hosted as static files.
