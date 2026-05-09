# add-design

> Scaffold a new design entry for zrosenbauer.com that conforms to the contentlayer `Design` schema.

This skill is project-local to [`zrosenbauer.com`](../../../). It reads the contentlayer `Design` schema and produces a draft MDX file at `content/designs/<slug>.mdx`. Designs are image-heavy showcase pages with a playful third-person voice and `mode: light|dark` controlling the page theme.

## What it does

- Asks for the missing inputs (title, description, mode, image paths) — never invents image filenames.
- Writes the file using the boilerplate in `templates/design.mdx.template`.
- References the shared voice doc at [`contributing/voice.md`](../../../contributing/voice.md) and the design-specific format rules in [`references/format.md`](references/format.md).
- Runs `pnpm typecheck` to validate frontmatter against the contentlayer schema.

## Trigger phrases

- "add a design"
- "new design entry"
- "publish a design page"
- "add design page"
- "scaffold a design"
- "add a designs page"

## Files

- [`SKILL.md`](SKILL.md) — workflow & frontmatter rules
- [`references/format.md`](references/format.md) — heading conventions, image rules, mode selection, third-person voice notes
- [`templates/design.mdx.template`](templates/design.mdx.template) — copyable boilerplate

## Related

- [`contributing/voice.md`](../../../contributing/voice.md) — shared Zac voice doc (also used by `/add-blog-post` and `/add-oss-project`)
- `contentlayer.config.ts` — `Design` schema source of truth
- `content/AGENTS.md` — repo-level content authoring guide
