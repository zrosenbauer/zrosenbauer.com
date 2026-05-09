# add-blog-post

> Scaffold a new blog post for zrosenbauer.com that conforms to the contentlayer schema and matches Zac's voice.

This skill is project-local to [`zrosenbauer.com`](../../../). It reads the contentlayer `BlogPost` schema, the allowed tag enum, and Zac's writing voice (extracted from existing posts) and produces a draft MDX file at `content/blog/posts/<slug>.mdx`.

## What it does

- Asks for the missing inputs (title, description, slug, tags, image) — never invents them.
- Picks a structural archetype: war-story (bug/gotcha/debug) or personal/opinion.
- Writes the file using the boilerplate in `templates/blog-post.mdx.template`.
- References the shared voice doc at [`contributing/voice.md`](../../../contributing/voice.md) and the blog-specific format rules in [`references/format.md`](references/format.md) so the prose matches Zac's voice.
- Runs `pnpm typecheck` to validate frontmatter against the contentlayer schema.

## Trigger phrases

- "new blog post"
- "add a blog post"
- "write a post about X"
- "draft a blog post"
- "publish a post on the site"
- "scaffold a post"

## Files

- [`SKILL.md`](SKILL.md) — workflow & frontmatter rules
- [`references/format.md`](references/format.md) — blog-specific heading conventions, archetypes, sign-off CTA
- [`templates/blog-post.mdx.template`](templates/blog-post.mdx.template) — copyable boilerplate

## Related

- [`contributing/voice.md`](../../../contributing/voice.md) — shared Zac voice doc (also used by `/add-oss-project` and `/add-design`)
- `contentlayer.config.ts` — `BlogPost` schema source of truth
- `src/utils/blog/tags.ts` — allowed tags enum
- `content/AGENTS.md` — repo-level content authoring guide
