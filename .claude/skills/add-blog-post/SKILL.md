---
name: add-blog-post
description: >-
  This skill should be used when the user wants to add a new blog post to
  zrosenbauer.com. Common triggers include "new blog post", "add a blog
  post", "write a post about X", "draft a blog post", and "publish a post
  on the site". Bakes in the contentlayer BlogPost frontmatter schema, the
  emoji-prefixed lowercase section structure used in existing posts, and
  Zac's writing voice (shared across all content types). Skip when the user
  wants an OSS project entry, a design doc, or any non-blog MDX content.

# --- Claude Code extensions (ignored by other agents) ---
argument-hint: '[<topic-or-title>]'
user-invocable: true
model-invocable: true
---

# add-blog-post

Scaffold a new MDX blog post under `content/blog/posts/<slug>.mdx` that conforms to the contentlayer `BlogPost` schema and matches Zac's established voice and structural conventions. The skill produces a draft — the human still does the writing, but the boilerplate, frontmatter, voice guardrails, and section skeleton are pre-built.

## When to use

Verbatim trigger phrases:

- "new blog post"
- "add a blog post"
- "write a post about X"
- "draft a blog post"
- "publish a post on the site"
- "scaffold a post"

## When NOT to use

- The user wants a project entry (`content/projects/*.mdx`) — different schema.
- The user wants a design doc (`content/designs/*.mdx`) — different schema.
- The user wants a static page (`content/pages/*.mdx`) — different schema.
- The user is editing an existing post — just open it and edit directly.
- The user wants generic ghostwriting unrelated to this site.

## Workflow

### 1. Gather inputs

Confirm the following before writing any file. If the user gave a topic in the slash-command argument, use it as the starting point — but still verify the rest.

| Field | Default / Source |
|---|---|
| `title` | Lowercase or sentence-case, mirrors how the existing posts read (e.g., `'hello world'`, `'Scoping react-dnd'`). Ask if not given. |
| `slug` | Kebab-case derivation of the title. The file lands at `content/blog/posts/<slug>.mdx`. |
| `description` | One sentence with personality — not a marketing blurb. Often hints at the punchline or pain. |
| `authorGithubUsername` | Always `'zrosenbauer'` unless told otherwise. |
| `readTime` | Default `3` minutes; existing posts are short. Bump only if content warrants it. |
| `publishedAt` | Today's ISO date (`YYYY-MM-DD`). |
| `image` | Optional. If the user has an image, place under `public/img/blog/posts/<slug>/` and reference as `/img/blog/posts/<slug>/<file>`. |
| `tags` | Pick from the allowed enum in `src/utils/blog/tags.ts`: `devops`, `gotchas`, `react`, `docker`, `github`, `nextjs`, `fun`. If the right tag doesn't exist, ask whether to add it (edit `tags.ts`). |

If any field is missing and not derivable, ask before scaffolding. Do not invent.

### 2. Read the voice guide

Before writing prose, load [`contributing/voice.md`](../../../contributing/voice.md) (universal Zac voice rules) and [`references/format.md`](references/format.md) (blog-specific format rules — heading conventions, the two archetypes, alert callouts, sign-off CTA). Match those patterns; do not invent new ones.

### 3. Pick the structure

Two structural archetypes live in the existing posts:

- **Personal / opinion** (like `hello-world.mdx`) — short hook, "Who am I / Who cares" framing, lists of credentials or experiences, sign-off.
- **War story** (like `react-dnd-scoping.mdx`) — `the background → the bug → the hunt → the discovery → the fix → the conclusion` arc. Each `##` heading is lowercase and prefixed with an emoji.

If the user is debugging something, default to the war-story archetype. If the post is reflective or introductory, use the personal archetype. See [`references/format.md`](references/format.md) for the full skeleton.

### 4. Generate the file

Copy [`templates/blog-post.mdx.template`](templates/blog-post.mdx.template) to `content/blog/posts/<slug>.mdx`, fill in the frontmatter, and replace the section placeholders with the user's content (or leave `TODO` markers in the body **only** — never in frontmatter, since contentlayer rejects malformed frontmatter at build).

Always use straight quotes (`'`) in YAML frontmatter and straight double quotes (`"`) in prose. No curly quotes. No em dashes; use commas, periods, or parentheses (per the shared voice doc).

### 5. Validate

Run both checks from the repo root:

1. `pnpm typecheck` — rebuilds contentlayer and validates the frontmatter against the schema.
2. `pnpm lint:content` — runs `alex` for inclusive-language and profanity checks across all MDX content.

Typecheck failures:

- `tags` not in enum → fix tag or add to `src/utils/blog/tags.ts`.
- Missing required field → fill it in, do not delete the field.
- Date format wrong → must be `YYYY-MM-DD`.

Content-lint failures (alex warnings on the new post):

- If the flag is a **real issue** (e.g., `peanut gallery`, `master/slave`, `blacklist`, gendered defaults like `guys`/`mankind`), rewrite the prose. Do not auto-allow.
- If the flag is a **legitimate false positive** for the site's voice (alex flags conversational words like `dude`, `simple`, color descriptors), add the rule ID to the `allow` array in `.alexrc.json` at the repo root rather than rewriting. Mention the addition to the user so they can confirm.
- For one-off intentional uses, prefer an inline `<!--alex ignore <rule-id>-->` comment over a global allow.

### 6. Generate the OG image

After typecheck passes, run:

```bash
pnpm generate:og --type=blog --slug=<slug>
```

This renders `public/og/blog/<slug>.png` (1200x630) from the post's frontmatter — title, description, date, read time, tags. The PNG is committed alongside the post. If the design template changes globally, re-run with `--force` to regenerate everything. The blog slug page's `generateMetadata` references this file at `/og/blog/<slug>.png`, so no further wiring is needed.

### 7. Optional preview

Suggest the user run `pnpm dev` and visit `/gui/blog/posts/<slug>` to preview, and `/tui/blog/posts/<slug>` for the terminal-style render.

## Examples

<example>
<input>User runs `/add-blog-post react server actions gotcha`</input>
<output>
Ask: "Got it — a war-story-style post on a React Server Actions gotcha. A few things before I scaffold:

1. Title — does `'React Server Actions: the gotcha I wish I knew'` work, or do you have a phrasing in mind?
2. The bug — one-line description of what broke?
3. Tags — `react` and `gotchas` look right. Add `nextjs` too?
4. Image — do you have one, or skip?"

After answers, write `content/blog/posts/react-server-actions-gotcha.mdx` with the war-story arc (`📝 the background`, `🐛 the bug`, `🔎 the hunt`, `🤯 the discovery`, `🔧 the fix`, `🎉 the conclusion`), filling section bodies with `TODO` placeholders the user fleshes out. Run `pnpm typecheck` to validate.
</output>
</example>

<example>
<good>
title: 'Scoping react-dnd'
description: 'We added react-dnd to our application and it broke drag-n-drop everywhere else (except for the implementation of react-dnd)... this is how you fix it.'
</good>

<bad>
title: 'A Comprehensive Guide to Scoping React-DnD in Modern Applications'
description: 'In this article, we will dive deep into the intricacies of react-dnd and explore best practices for scoping its functionality.'
</bad>

The `<bad>` example fails Zac's voice: title-case, "comprehensive guide" inflation, "we will dive deep" signposting, "intricacies" and "best practices" AI vocabulary. The `<good>` example is the actual existing post — lowercase title, conversational description, hints at the pain.
</example>

## Rationalization table

Things the agent might be tempted to do, and why each is wrong.

| Skipped rule | Verbatim excuse | Why it's wrong |
|---|---|---|
| Use lowercase emoji-prefixed headings | "Title case is the standard markdown convention" | Both existing posts use lowercase. Standard markdown != Zac's voice. |
| Avoid em dashes | "Em dashes are punchy and well-formed punctuation" | Zac's existing prose uses commas, periods, and parentheses for these breaks. Em dashes read as AI/marketing voice. |
| Match the war-story arc on bug posts | "The user only described the fix, so I'll lead with the fix" | The arc is the format. Lead with story, not solution; offer a TL;DR anchor link to the fix for impatient readers. |
| Use only allowed tags | "I'll add `typescript` since the post is about TS" | The enum in `src/utils/blog/tags.ts` is the source of truth; add a tag there first or contentlayer fails the build. |
| Run `pnpm typecheck` after scaffolding | "Frontmatter looks right, no need to verify" | Contentlayer validates at build time; a typo in `publishedAt` or an unknown tag silently breaks the deploy. Always verify. |
| Run `pnpm lint:content` after scaffolding | "Alex is just style; the post reads fine" | Alex catches real issues (bias-etymology phrases, ableist tech terms, profanity) that the lefthook pre-commit hook will block on. Catch them now, not at commit time. |
| Keep first-person voice | "Third person sounds more authoritative for technical content" | Every existing post is first person. Authority on this site comes from specifics and self-deprecation, not detached prose. |

## References

- [`contributing/voice.md`](../../../contributing/voice.md) — Zac's writing voice & standards (shared across all content types)
- [`references/format.md`](references/format.md) — blog-specific heading conventions, archetypes, section rules
- [`templates/blog-post.mdx.template`](templates/blog-post.mdx.template) — copyable boilerplate
- `contentlayer.config.ts` (repo root) — `BlogPost` schema source of truth
- `src/utils/blog/tags.ts` — allowed tags enum
- `content/AGENTS.md` — repo-level content authoring guide
