# Blog post format — heading, structure, and arc rules

The shared voice rules live in [`contributing/voice.md`](../../../../contributing/voice.md). This doc covers what's specific to blog posts: heading conventions, the two structural archetypes, and the section vocabulary.

## Heading conventions

- **Lowercase.** `## the bug`, not `## The Bug`. Even proper nouns (`react-dnd`) keep their casing but the surrounding heading is lowercase. Exception: personal-archetype headings like `## 🤨 Who am I?` use sentence case after the emoji.
- **Leading emoji.** Each `##` heading starts with one emoji that signals the section's beat:
  - `📝` background / setup
  - `🐛` bug / problem
  - `🔎` hunt / investigation
  - `🤯` discovery / aha moment
  - `🔧` fix / solution
  - `🎉` conclusion / wrap
  - `🤨` who am I (intro/about sections)
  - `🤷` who cares (motivation sections)
- **No `#` H1 headings inside posts.** The post title in frontmatter is the H1; body sections start at `##`.
- **Don't invent new emoji-section pairings without a reason.** The set above is the vocabulary.

## Archetype 1 — War story

**Use when:** the post is about a bug, a gotcha, a debugging session, a thing that broke and got fixed. This is the dominant archetype.

**Reference post:** `content/blog/posts/react-dnd-scoping.mdx`.

**Structure:**

```
[Hook paragraph: 1–2 sentences. Name the company / library, state the problem.]

[Optional: TL;DR? If you want to skip the story and just see the fix, [click here](#-the-fix).]

## 📝 the background
[1–2 paragraphs. Why this code existed, what was working before, what was added that triggered the issue. Link tools and people.]

## 🐛 the bug
[Quote the user-reported bug as a blockquote. State why it was confusing.]

## 🔎 the hunt
[How you investigated. What didn't work. Search queries you tried (as blockquotes). Whose head was banging on the wall.]

## 🤯 the discovery
[The aha moment. Link the GitHub issue / Stack Overflow / blog post that unlocked it. One-line GitHub alert with the generalizable lesson.]

## 🔧 the fix
[Show the broken version first as a code block. One-line caption. Show the fix as a code block. Brief explanation of what changed and why.]

## 🎉 the conclusion
[1 paragraph. CTA — "reach out on X or email me".]
```

## Archetype 2 — Personal / opinion

**Use when:** the post is reflective, introductory, an opinion piece, an intro to the author/site, or a non-technical anecdote.

**Reference post:** `content/blog/posts/hello-world.mdx`.

**Structure:**

```
[Hook paragraph: 1 short paragraph or a single line. Often followed by a code block as a punchline.]

[Optional callback line: "Well I probably used VBScript or something like that, but you get the idea."]

## 🤨 [Who am I? / What is this? / Why does this exist?]
[1 short intro paragraph. Then a list of bolded labels with concrete details — companies worked at, technologies, accomplishments. Each list item is a sentence, not a bullet point of buzzwords.]

## 🤷 [Who cares? / Why bother? / So what?]
[1–2 paragraphs answering the implicit "why are you telling me this". Self-deprecating is good. End with the personal stake — what the author hopes the reader gets out of it.]
```

## Section content rules

- **Length:** 1–4 short paragraphs per section. If longer, split into a sub-section or trim.
- **Code blocks:** Always tagged with a language (` ```tsx `, ` ```javascript `). Use line highlighting for the changed line: ` ```tsx {3,5-7} `.
- **Blockquotes:** Use `>` for direct quotes (bug reports, search queries).
- **GitHub alerts:** Use `> [!TIP]` or `> [!NOTE]` for one-line lessons embedded in the story. One per post is plenty.
- **Images:** `![alt](/img/blog/posts/<slug>/<file>.png)`. Files live under `public/img/blog/posts/<slug>/`. No optimization happens (static export), so size before committing.

## Frontmatter checklist

| Field | Required | Notes |
|---|---|---|
| `title` | yes | Lowercase or sentence-case. Keep it short. |
| `description` | yes | One sentence with personality, not a marketing line. |
| `authorGithubUsername` | yes | `'zrosenbauer'`. |
| `readTime` | yes | Default `3`. |
| `publishedAt` | yes | `YYYY-MM-DD`. |
| `image` | no | Optional. Path under `/img/blog/posts/<slug>/...`. |
| `tags` | no | From the enum in `src/utils/blog/tags.ts`. Pick 1–3. |

After scaffolding, run `pnpm typecheck` from the repo root. Contentlayer validates frontmatter at that step; a missing required field or unknown tag fails the build with a per-file error.

## Length & cadence

- **Default `readTime: 3`.** Posts are short. If a post is running long, the answer is usually to cut, not to bump readTime.
- **Sections are 1–4 short paragraphs each.** If a section is longer, split it.
- **Code blocks are full enough to compile/copy** but not padded with imports the reader can infer.

## Sign-off CTA (war stories)

End war-story posts with: "If you have any questions feel free to reach out to me on [X](https://twitter.com/zrosenbauer) or [me@zrosenbauer.com](mailto:me@zrosenbauer.com)." Personal, direct, low-friction.
