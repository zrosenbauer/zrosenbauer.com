# OSS project entry — format & body conventions

Shared voice rules live in [`contributing/voice.md`](../../../../contributing/voice.md). This doc covers what's specific to project entries: title casing, role semantics, and the one-paragraph body convention.

## Frontmatter

| Field | Required | Notes |
|---|---|---|
| `title` | yes | Lowercase project name (`'kidd'`, `'lauf'`, `'viteval'`). Domain-style names keep their casing (`'zrosenbauer.com'`). Single straight quotes. |
| `repository` | yes | GitHub `owner/repo` format (`joggrdocs/kidd`, `viteval/viteval`). No `https://` prefix. No quotes needed but YAML accepts them. |
| `deprecated` | yes | Boolean. `false` for active projects, `true` for archived. |
| `role` | yes | `author` if you started/own it. `contributor` if you're a meaningful contributor on someone else's project. |
| `description` | yes | One sentence describing what the project does. Punchy, not marketing. |

## `role` — author vs contributor

| Role | Use when |
|---|---|
| `author` | You started the project, or you own it now. Joggr-led projects (`joggrdocs/*`) where you're the engineering driver count as `author`. Personal repos under `zrosenbauer/*` are `author`. |
| `contributor` | The project is run by someone else and you're a meaningful contributor — e.g., `voltagent/voltagent` is run by the VoltAgent team; you contribute regularly but don't own it. Token PRs to random repos do **not** warrant a project entry at all. |

If unsure, ask. Lying about `role` on the site is worse than not listing the project.

## `description` style

One sentence. State what the project is or does. Lift the repo's own tagline if it's good; tighten if it's not. Avoid:

- Marketing words: `best-in-class`, `enterprise-ready`, `next-generation` (with one exception — see below).
- AI vocabulary: `seamless`, `empower`, `groundbreaking`, `unleash`.
- Long compound sentences with multiple clauses.

The exception: `viteval`'s description starts with "Next generation LLM evaluation framework" — that's the project's own tagline, lifted directly. If a project genuinely uses marketing-y phrasing in its own README, mirroring it is OK. Don't invent marketing language Zac wouldn't write himself.

## Body convention — one short paragraph

The body is the value-add. The frontmatter `description` already tells the reader what the project does; the body should add a human angle.

### Examples of good bodies (from existing entries)

| Project | Body | Why it works |
|---|---|---|
| `kidd` | "A small, opinionated toolkit out of Joggr. Built to make a recurring engineering task disappear into a single command." | Adds origin (Joggr) and intent (the recurring task it kills). Doesn't repeat the description. |
| `viteval` | "Vite-native eval framework for AI applications — write, run, and CI your LLM evals like tests, with the dev loop you already use." | Adds the key positioning (use the dev loop you already have). |
| `voltagent` | "Open-source TypeScript framework for building, observing, and shipping AI agents. Core contributor — focused on agent runtime, tooling, and developer ergonomics." | Adds the role context (what Zac specifically works on). This is the right move for `contributor` entries. |
| `zpress` | "A Joggr utility for compressing and packaging engineering knowledge into something an LLM can actually consume." | Adds the practical "why" — what real-world need this solves. |

### Examples of bad bodies (what to avoid)

| Bad pattern | Example | Why it fails |
|---|---|---|
| Restates the description | Description: "An npm package naming toolkit." Body: "An npm package naming toolkit that helps you name packages." | No new information. The body wastes the reader's time. |
| Marketing puff | "A revolutionary approach to package naming that empowers developers to ship faster." | AI vocab, not specific, no human angle. |
| Multi-paragraph essay | Three paragraphs of background, philosophy, and roadmap. | Project entries are tight. Long bodies belong in a blog post. |
| Headings inside the body | `# Background` / `# Goals` | Project entries don't use headings in the body. Use a blog post if you need sections. |

## What NOT to include

- **No headings** in the body (`#`, `##`, etc.).
- **No code blocks.** If you need code, that's a blog post.
- **No images.** The projects index renders entries small.
- **No sign-off CTA** ("reach out on X / email"). That's a blog convention.

## Length & cadence

- Body is **1–2 sentences** total.
- If you can't tighten it to that, the post wants to be a blog post, not a project entry.

## After scaffolding

Run `pnpm typecheck` from the repo root. Contentlayer validates `role` (must be `author` | `contributor`), `deprecated` (must be boolean), and `repository` (must be present).
