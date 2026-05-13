---
name: add-oss-project
description: >-
  This skill should be used when the user wants to add a new open-source
  project entry to zrosenbauer.com. Common triggers include "add an OSS
  project", "add a project entry", "list this repo on the site", "new
  project entry", "add a project to the projects page", and "scaffold a project".
  Bakes in the contentlayer Project frontmatter schema (`repository`, `role`,
  `deprecated`) and the tight one-paragraph body convention used in
  existing entries. Skip when the user wants a blog post, a design, or any
  non-project MDX content.

# --- Claude Code extensions (ignored by other agents) ---
argument-hint: '[<repo-or-name>]'
user-invocable: true
model-invocable: true
---

# add-oss-project

Scaffold a new MDX project entry under `content/projects/<slug>.mdx` that conforms to the contentlayer `Project` schema and matches the tight, pitch-style body convention used in the existing entries. Project entries are short — frontmatter does most of the work; the body adds one human angle the GitHub repo description doesn't capture.

## When to use

Verbatim trigger phrases:

- "add an OSS project"
- "add a project entry"
- "list this repo on the site"
- "new project entry"
- "add a project to the projects page"
- "scaffold a project"

## When NOT to use

- The user wants a blog post (`content/blog/posts/*.mdx`) — use `/add-blog-post`.
- The user wants a design doc (`content/designs/*.mdx`) — use `/add-design`.
- The user wants a static page (`content/pages/*.mdx`) — different schema.
- The user is editing an existing project entry — just open it and edit directly.

## Workflow

### 1. Gather inputs

Confirm the following before writing any file. If the user gave a repo or project name in the slash-command argument, use it as the starting point — but still verify the rest.

| Field | Default / Source |
|---|---|
| `title` | The project name itself, lowercase by default (`'kidd'`, `'viteval'`). Exception: domain-style names keep their casing (`'zrosenbauer.com'`). |
| `slug` | Kebab-case derivation of the title. The file lands at `content/projects/<slug>.mdx`. |
| `repository` | GitHub `owner/repo` (e.g., `joggrdocs/kidd`). Required. Ask if not derivable from context. |
| `role` | `author` for projects you started or led (solo or at a company). `contributor` for projects others run where you're a meaningful contributor. Ask if unclear. |
| `deprecated` | `false` by default. Only `true` if the project is no longer maintained. |
| `description` | One punchy sentence describing what it does. Often mirrors the repo's own tagline but tightened to Zac voice. No marketing fluff. |

If any field is missing and not derivable, ask before scaffolding. Do not invent a repository path.

### 2. Read the voice guide

Before writing prose, load [`contributing/voice.md`](../../../contributing/voice.md) (universal Zac voice rules) and [`references/format.md`](references/format.md) (project-specific body conventions). The voice for project entries is much terser than for blog posts — match the existing entries.

### 3. Write the body

The body is **one short paragraph** (one or two sentences max). It should add a human angle the `description` field doesn't already capture — the "why this exists", the "what's interesting about it", or the role context. See [`references/format.md`](references/format.md) for examples of good vs duplicate bodies.

Do **not** add headings, code blocks, images, or sign-off CTAs in project entries. The site's project page renders these short and dense.

### 4. Generate the file

Copy [`templates/oss-project.mdx.template`](templates/oss-project.mdx.template) to `content/projects/<slug>.mdx`, fill in the frontmatter, and replace the body placeholder with one short paragraph.

Always use straight quotes (`'`) in YAML frontmatter. No curly quotes anywhere. No em dashes; use commas, periods, or parentheses.

### 5. Validate

Run `pnpm typecheck` from the repo root. Contentlayer rebuilds and validates the frontmatter against the schema. If it fails:

- `role` not `author` or `contributor` → fix.
- `deprecated` not a boolean → use `true` or `false`, no quotes.
- `repository` missing → required field, fill in.

### 6. Optional preview

Suggest the user run `pnpm dev` and visit `/gui/projects/<slug>` to preview, and `/tui/projects/<slug>` for the terminal-style render.

## Examples

<example>
<input>User runs `/add-oss-project zrosenbauer/some-new-cli`</input>
<output>
Ask: "Got it — a new project entry for `zrosenbauer/some-new-cli`. A few things before I scaffold:

1. Title — what do you want to call it on the site? Default would be the repo name, lowercase.
2. Description — one punchy sentence (what does it do)?
3. Role — `author` (solo) or `contributor`?
4. Body angle — what's the human/personal angle you'd add to the body? Why does this exist?"

After answers, write `content/projects/some-new-cli.mdx` with the frontmatter and a one-paragraph body. Run `pnpm typecheck` to validate.
</output>
</example>

<example>
<good>
title: 'kidd'
description: 'An opinionated CLI framework for Node.js. Convention over configuration, end-to-end type safety.'
repository: joggrdocs/kidd
role: author
deprecated: false

(body)
A small, opinionated toolkit out of Joggr. Built to make a recurring engineering task disappear into a single command.
</good>

<bad>
title: 'Kidd: A Comprehensive Node.js CLI Framework'
description: 'A best-in-class, enterprise-ready CLI framework that empowers developers to build robust command-line interfaces with seamless type safety and unparalleled developer experience.'

(body — duplicates the description)
Kidd is a CLI framework for Node.js. It uses convention over configuration and provides end-to-end type safety.
</bad>

The `<bad>` example fails on three counts: title-cased title with marketing colon-subtitle, AI vocabulary in description (`best-in-class`, `enterprise-ready`, `empowers`, `seamless`, `unparalleled`), and a body that just restates the description without adding a human angle.
</example>

## Rationalization table

Things the agent might be tempted to do, and why each is wrong.

| Skipped rule | Verbatim excuse | Why it's wrong |
|---|---|---|
| Keep the body to one short paragraph | "The user shared a long README, I should summarize it in the body" | Project entries are tight on purpose. The body adds *one* human angle, not a summary. Long bodies don't render well on the projects index. |
| Avoid duplicating the description in the body | "The description already says what it does, so the body should expand on it" | Right instinct, wrong execution. Don't expand — pivot. The description says *what*; the body should say *why* or *what's interesting*. |
| Lowercase the title | "Title case looks more professional" | The existing entries are lowercase project names. Match the convention. |
| Use `author` vs `contributor` correctly | "I'll mark anything I committed to as author" | `author` means you started/own it. Token contributions to other people's projects are `contributor`. The role on the site is meaningful. |
| Run `pnpm typecheck` after scaffolding | "Frontmatter is simple, no need to verify" | A typo in `role` (must be `author` \| `contributor`) or a non-boolean `deprecated` silently breaks the deploy. Always verify. |

## References

- [`contributing/voice.md`](../../../contributing/voice.md) — Zac's writing voice & standards (shared across all content types)
- [`references/format.md`](references/format.md) — project-specific body conventions, good vs duplicate bodies
- [`templates/oss-project.mdx.template`](templates/oss-project.mdx.template) — copyable boilerplate
- `contentlayer.config.ts` (repo root) — `Project` schema source of truth
- `content/AGENTS.md` — repo-level content authoring guide
