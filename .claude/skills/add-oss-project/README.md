# add-oss-project

> Scaffold a new open-source project entry for zrosenbauer.com that conforms to the contentlayer `Project` schema.

This skill is project-local to [`zrosenbauer.com`](../../../). It reads the contentlayer `Project` schema and produces a draft MDX file at `content/projects/<slug>.mdx`. Project entries are tight — frontmatter does most of the work; the body is one short paragraph adding a human angle.

## What it does

- Asks for the missing inputs (title, repository, role, description, body angle) — never invents a repo path.
- Writes the file using the boilerplate in `templates/oss-project.mdx.template`.
- References the shared voice doc at [`contributing/voice.md`](../../../contributing/voice.md) and the project-specific format rules in [`references/format.md`](references/format.md).
- Runs `pnpm typecheck` to validate frontmatter against the contentlayer schema (catches bad `role` values, non-boolean `deprecated`, etc.).

## Trigger phrases

- "add an OSS project"
- "add a project entry"
- "list this repo on the site"
- "new project entry"
- "add a project to the projects page"
- "scaffold a project"

## Files

- [`SKILL.md`](SKILL.md) — workflow & frontmatter rules
- [`references/format.md`](references/format.md) — body conventions, role semantics, good-vs-duplicate body examples
- [`templates/oss-project.mdx.template`](templates/oss-project.mdx.template) — copyable boilerplate

## Related

- [`contributing/voice.md`](../../../contributing/voice.md) — shared Zac voice doc (also used by `/add-blog-post` and `/add-design`)
- `contentlayer.config.ts` — `Project` schema source of truth
- `content/AGENTS.md` — repo-level content authoring guide
