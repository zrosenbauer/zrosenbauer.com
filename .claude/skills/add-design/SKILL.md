---
name: add-design
description: >-
  This skill should be used when the user wants to add a new design entry
  to zrosenbauer.com. Common triggers include "add a design", "new design
  entry", "publish a design page", "add design page", "scaffold a design",
  and "add a designs page". Bakes in the contentlayer Design frontmatter schema (`mode`
  light/dark for page theme), top-level H1 headings, raw `<img>`
  tags for images, and the playful third-person Zac voice used in existing
  designs. Skip when the user wants a blog post, an OSS project entry, or
  any non-design MDX content.

# --- Claude Code extensions (ignored by other agents) ---
argument-hint: '[<design-title>]'
user-invocable: true
model-invocable: true
---

# add-design

Scaffold a new MDX design entry under `content/designs/<slug>.mdx` that conforms to the contentlayer `Design` schema. Design entries are image-heavy showcases with a playful tone — third-person Zac jokes, raw HTML `<img>` tags, and `mode: light|dark` controlling the page theme.

## When to use

Verbatim trigger phrases:

- "add a design"
- "new design entry"
- "publish a design page"
- "add design page"
- "scaffold a design"
- "add a designs page"

## When NOT to use

- The user wants a blog post (`content/blog/posts/*.mdx`) — use `/add-blog-post`.
- The user wants an OSS project entry (`content/projects/*.mdx`) — use `/add-oss-project`.
- The user wants a static page (`content/pages/*.mdx`) — different schema.
- The user is editing an existing design — just open it and edit directly.

## Workflow

### 1. Gather inputs

Confirm the following before writing any file. If the user gave a title in the slash-command argument, use it as the starting point — but still verify the rest.

| Field | Default / Source |
|---|---|
| `title` | Title-case (`'Coding States'`, not `'coding states'`). The design name on the site. |
| `slug` | Kebab-case derivation of the title. The file lands at `content/designs/<slug>.mdx`. |
| `description` | One sentence describing what the design is. Can be deadpan or playful. |
| `mode` | `'light'` or `'dark'` — controls the page theme (light bg vs dark bg). Ask if the design's images are dark-on-light or light-on-dark and pick accordingly. |
| Images | Live under `public/img/designs/<slug>/<file>.png`. The skill should not invent files; ask the user where the images are or to drop them in first. |

If any field is missing and not derivable, ask before scaffolding. Do not invent image filenames.

### 2. Read the voice guide

Before writing prose, load [`contributing/voice.md`](../../../contributing/voice.md) (universal Zac voice rules) and [`references/format.md`](references/format.md) (design-specific format rules — H1 headings, raw `<img>` tags, third-person jokes). The voice for designs is more playful than blog posts — match `coding-states.mdx`.

### 3. Pick the structure

Designs follow a consistent shape:

- `# Background` — a couple sentences of context. How this came to exist.
- `# The States` (or equivalent grouping noun) — intro line for the showcase.
- `## item-name` (lowercase) → one-line description → raw `<img>` tag. Repeat per item.

See [`references/format.md`](references/format.md) for the full skeleton.

### 4. Generate the file

Copy [`templates/design.mdx.template`](templates/design.mdx.template) to `content/designs/<slug>.mdx`, fill in the frontmatter and section placeholders.

Use raw HTML `<img src="..." />` tags, **not** Markdown `![alt](...)` syntax. The existing designs all use raw HTML. Image paths are absolute: `/img/designs/<slug>/<file>.png`.

Always use straight quotes in YAML frontmatter. No curly quotes. No em dashes; use commas, periods, or parentheses.

### 5. Generate the hero banner

After the per-item images are in place at `public/img/designs/<slug>/`, run:

```bash
pnpm generate:design-banner --slug=<slug>
```

This composites every `<img>` referenced in the MDX (in document order) into a single `public/img/designs/<slug>/banner.png`. The script reads `mode` from the MDX to pick the background (dark → `#0a0a0a`, light → transparent), and auto-picks a grid layout based on image count (≤4 → 1 row, 5-6 → 3 cols, 7-12 → 4 cols, more → square-ish).

Override with `--cols=N`, `--gap=PX`, or `--bg=#hex|none` when the default layout doesn't suit the assets.

The design page route at `src/app/gui/designs/[slug]/page.tsx` hard-codes the hero img path to `/img/designs/<slug>/banner.png` and renders it as a hero section between the title and the body. **Do not** embed the banner inline at the top of the MDX — it'll render twice. Just generate the file; the route handles surfacing it.

### 6. Validate

Run both checks from the repo root:

1. `pnpm typecheck` — rebuilds contentlayer and validates frontmatter against the schema.
2. `pnpm lint:content` — runs `alex` for inclusive-language and profanity checks across all MDX content.

Typecheck failures:

- `mode` not `light` or `dark` → fix.
- Missing required field → fill in.

Content-lint failures (alex warnings on the new design):

- If the flag is a **real issue** (e.g., `peanut gallery`, `master/slave`, `blacklist`, gendered defaults like `guys`/`mankind`), rewrite the prose. Do not auto-allow.
- If the flag is a **legitimate false positive** for the site's voice (alex flags conversational words like `dude`, `simple`, color descriptors), add the rule ID to the `allow` array in `.alexrc.json` at the repo root rather than rewriting. Mention the addition to the user so they can confirm.
- For one-off intentional uses, prefer an inline `<!--alex ignore <rule-id>-->` comment over a global allow.

Then verify the images actually exist at the paths referenced. Static export means a missing image silently 404s in production.

### 7. Generate the OG image

After typecheck passes, run:

```bash
pnpm generate:og --type=design --slug=<slug>
```

This renders `public/og/designs/<slug>.png` (1200x630) from the design's frontmatter — title and description. The PNG is committed alongside the design. If the OG template changes globally, re-run with `--force` to regenerate everything. The design slug page's `generateMetadata` references this file at `/og/designs/<slug>.png`, so no further wiring is needed.

### 8. Optional preview

Suggest the user run `pnpm dev` and visit `/gui/designs/<slug>` to preview, and `/tui/designs/<slug>` for the terminal-style render.

## Examples

<example>
<input>User runs `/add-design Cursed Editors` after dropping images at `public/img/designs/cursed-editors/`</input>
<output>
Ask: "Got it — a new design entry called 'Cursed Editors'. A few things before I scaffold:

1. Description — one sentence?
2. Mode — `light` or `dark` page theme?
3. The images at `public/img/designs/cursed-editors/` — what are the filenames and what does each represent? I'll need a one-line description per item."

After answers, write `content/designs/cursed-editors.mdx` with `# Background`, `# The Editors`, and one `## <name>` block per image. Run `pnpm typecheck` to validate.
</output>
</example>

<example>
<good>
title: 'Coding States'
description: 'A set of images that represent different states of coding.'
mode: 'dark'

# Background
[1–2 sentences with personal context]

# The States
[One-line intro to the showcase]

## angry
"Angry Zac" smashes the keyboard while listening to Death Metal.

<img src="/img/designs/coding-states/angry.png" />
</good>

<bad>
title: 'My Coding States Design'
description: 'A comprehensive visual exploration of various emotional states experienced during the software development lifecycle.'
mode: 'light'

## Background
This document presents a curated collection of digital illustrations...

![angry](./angry.png)
</bad>

The `<bad>` example fails: title with throat-clearing prefix, AI-vocab description (`comprehensive visual exploration`, `software development lifecycle`), `##` instead of `#` for top-level sections, present-tense narrator instead of playful third-person Zac, Markdown image syntax instead of raw `<img>`, and a relative path that won't resolve in static export.
</example>

## Rationalization table

Things the agent might be tempted to do, and why each is wrong.

| Skipped rule | Verbatim excuse | Why it's wrong |
|---|---|---|
| Use `# H1` for top-level body sections | "Markdown convention is `##` for in-page sections since `#` is reserved for the page title" | Designs use `# H1` (see `coding-states.mdx`). The frontmatter `title` is rendered separately; in-body `#` is fine. Match the convention. |
| Use raw `<img>` tags | "Markdown `![alt](src)` is more portable" | The existing designs use raw `<img>`. MDX renders both, but the convention is HTML for designs. Match it. |
| Reference images that exist | "The user said the design has 6 states, I'll add 6 `<img>` tags with placeholder filenames" | Static export means missing images 404 silently in prod. Only reference paths the user has confirmed exist on disk. |
| Match the playful third-person voice | "Third person is unprofessional" | The designs page is intentionally playful. "Angry Zac smashes the keyboard" is the voice. Don't sterilize it. |
| Pick `mode` based on images | "I'll default to `light`" | If the images are dark/moody (Coding States) the page theme should be `dark` so the contrast works. Ask. |
| Run `pnpm generate:design-banner` | "The per-item images already show what the design looks like, a banner is redundant." | The page route hard-codes `/img/designs/<slug>/banner.png` as a hero element above the body. Skip the script and that hero 404s. Always run the script after dropping the per-item PNGs. |
| Don't embed the banner `<img>` inline | "Putting `<img src=".../banner.png">` at the top of the body makes the hero explicit and self-documenting." | The route already renders the banner as a hero section between the title and the body. An inline copy duplicates it. The banner file is referenced by the route, never inline in the MDX. |

## References

- [`contributing/voice.md`](../../../contributing/voice.md) — Zac's writing voice & standards (shared across all content types)
- [`references/format.md`](references/format.md) — design-specific heading conventions, image rules, mode selection, banner hero pattern
- [`templates/design.mdx.template`](templates/design.mdx.template) — copyable boilerplate (includes the banner `<img>` line)
- `scripts/generate-design-banner.ts` (repo root) — composites per-item PNGs into `banner.png`. Run via `pnpm generate:design-banner --slug=<slug>`.
- `contentlayer.config.ts` (repo root) — `Design` schema source of truth
- `content/AGENTS.md` — repo-level content authoring guide
