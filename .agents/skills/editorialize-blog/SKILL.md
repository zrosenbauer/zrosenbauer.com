---
name: editorialize-blog
description: >-
  This skill should be used when the user wants to run a full editorial pass
  over a blog post on zrosenbauer.com. Common triggers include "editorialize
  the blog post", "edit my blog post", "review the blog draft", "run editorial
  on X", "fact check and humanize this post", "edit my latest post", and "review
  my most recent blog post". When
  invoked without a target, lists the most recent posts by publishedAt and
  prompts the user to pick. Dispatches four subagents in parallel (factchecker,
  humanizer, voice-matcher, structure-reviewer), aggregates findings into a
  scratch report, and either auto-applies safe fixes or walks each finding
  interactively. Skip when the user wants to draft a new post (use
  add-blog-post), edit a design (use add-design), or run only one of the
  underlying agents directly.

# --- Claude Code extensions (ignored by other agents) ---
argument-hint: '[<slug|path>] [auto|ask|scratch]'
user-invocable: true
model-invocable: false
---

# editorialize-blog

Runs a multi-agent editorial pass over a blog post under `content/blog/posts/`. Four specialized subagents review the draft in parallel, their findings get aggregated into a single report under `.scratch/`, and the skill walks the findings with the user (or auto-applies mechanical fixes).

## Dependencies

This skill requires the **Context7 MCP server**, declared in the project's `.mcp.json`. The `factchecker` subagent uses Context7 as the primary source for library/framework/language API claims. If the MCP isn't available, factchecker fails loudly rather than producing a degraded report.

On first run in a fresh checkout, Claude Code (or any compatible agent) will prompt to enable the project MCP. Approve it once; nothing else to configure.

Why `model-invocable: false`: this is an interactive editorial loop that requires human judgment on every voice/factcheck finding. Auto-routing the dispatcher would skip the human-in-the-loop step. Invoke explicitly via `/editorialize-blog`.

## When to use

Verbatim trigger phrases:

- "editorialize the blog post"
- "edit my blog post"
- "review the blog draft"
- "run editorial on X"
- "fact check and humanize this post"
- "edit my latest post"
- "review my most recent blog post"

## When NOT to use

- Drafting a brand-new post → use `add-blog-post`
- Editing a design page → use `add-design` (no editorial agent exists for designs yet)
- Running only one agent (e.g., just humanizer) → invoke that subagent directly
- Editing project entries → use `add-oss-project`

## Inputs

`$ARGUMENTS` — `[<slug|path>] [auto|ask|scratch]`

| Position | Name      | Required | Description                                                                                                          |
| -------- | --------- | -------- | -------------------------------------------------------------------------------------------------------------------- |
| 1        | `target`  | No       | Slug (`rust-ruined-javascript-result`), filename, relative path, or absolute path. If omitted, prompt the user.       |
| 2        | `mode`    | No       | `auto`, `ask`, or `scratch`. Defaults to `ask`.                                                                       |

Mode behavior:

- **`ask`** — walks every finding with the user. For each: show context, original, proposed change. Apply on yes. This is the safe default for prose where voice matters.
- **`auto`** — applies only mechanical, low-risk fixes: humanizer pattern replacements with clear before/after, structure-reviewer blocking fixes (lowercase headings, tag corrections, broken image paths). Leaves factcheck disputes and voice rewrites in the report for human review.
- **`scratch`** — report-only. Dispatches all four agents, aggregates the `.scratch/editorialize-<slug>.md` report, applies **zero** edits to the post. Use this for evals, dry-runs, and review without commitment.

## Workflow

### 1. Resolve args

First, separate `target` and `mode` from `$ARGUMENTS`. The second positional is `mode` (`auto` / `ask` / `scratch`); default `ask`. If the **first** positional looks like a mode keyword (not a slug or path), treat it as `mode` and treat `target` as omitted.

**If `target` is passed:**

- Absolute path → use as-is, verify file exists
- Contains `/` → treat as a relative path from `repoRoot`, verify it exists
- Ends in `.mdx` → match `content/blog/posts/<target>`
- Otherwise → match `content/blog/posts/<target>.mdx`

Fail loudly if no match or multiple matches. Surface the resolved `title`, `slug`, and `path` so the user can confirm. Note: `slug` for non-`content/blog/posts/` paths is the basename without the `.mdx` extension.

**If `target` is omitted:**

1. List `content/blog/posts/*.mdx`.
2. Parse the `publishedAt` ISO date from each post's frontmatter (Bash + `grep -m1 'publishedAt:'` is enough; no need for a full YAML parser).
3. Sort descending by `publishedAt`. Take the top **4** (the AskUserQuestion option cap; users can pick "Other" to type a slug not in the list).
4. Prompt the user to pick one. Use the right tool for the current agent:

   - **Claude Code** — call `AskUserQuestion` with the 4 most recent posts as options. Format each option label as `<title>` and description as `<slug> · <publishedAt> · <readTime>min`. Recommend the most recent (label suffix `(Recommended)`).
   - **Codex CLI / opencode / pi / Cursor / Copilot** — emit a plain numbered list and wait for a reply:

     ```
     Which post should I editorialize?

       1. <title> — <slug> · <publishedAt>  (default)
       2. <title> — <slug> · <publishedAt>
       3. <title> — <slug> · <publishedAt>
       4. <title> — <slug> · <publishedAt>

     Reply with a number, a slug, or a path. Default: 1.
     ```

5. Resolve the user's pick to `path`, `slug`, `title`, then continue. If the user replies with a slug or path not in the list, resolve it via the same rules as when `target` is passed.

If the agent has no user (running in eval / CI), `target` MUST be provided — fail with an explanatory message rather than guessing.

### 2. Dispatch the four agents in parallel

In a single tool-call block, dispatch all four subagents. Each receives `path`, `slug`, and `repoRoot` and writes its partial report to `.scratch/`.

```
Agent({ subagent_type: "factchecker",        prompt: "<path>, <slug>, <repoRoot>" })
Agent({ subagent_type: "humanizer",          prompt: "<path>, <slug>, <repoRoot>" })
Agent({ subagent_type: "voice-matcher",      prompt: "<path>, <slug>, <repoRoot>" })
Agent({ subagent_type: "structure-reviewer", prompt: "<path>, <slug>, <repoRoot>" })
```

Each agent writes to a distinct file, so there's no contention:

- `.scratch/editorialize-<slug>-factcheck.md`
- `.scratch/editorialize-<slug>-humanizer.md`
- `.scratch/editorialize-<slug>-voice.md`
- `.scratch/editorialize-<slug>-structure.md`

### 3. Aggregate

Read all four partial reports. Merge into `.scratch/editorialize-<slug>.md` using [`templates/report.md.template`](templates/report.md.template). Section order matters:

1. **Structure** — blocking; fix these first
2. **Factcheck** — correctness; humans must verify
3. **Voice** — subjective; humans must decide
4. **Humanizer** — mechanical; safest to apply

### 4. Apply per mode

**`scratch` mode (report-only):**

Skip step 4 entirely. The aggregated report from step 3 is the deliverable. Print the final summary (step 5) showing 0 applied, all findings deferred, and the report path. Do **not** call `Edit` on the post.

This is the mode for evals, CI, and any time you want to inspect findings without committing to edits.

**`ask` mode:**

Walk findings in the section order above. For each finding:

1. Print the section, finding number, line range, and the before/after pair.
2. Ask the user: apply / skip / skip-section / quit.
3. On apply, use `Edit` with the verbatim "before" string from the report as `old_string` and the suggested "after" as `new_string`. The Edit tool enforces uniqueness — if the before isn't unique, surface that to the user and skip.
4. Record applied vs. deferred in the final summary.

**`auto` mode:**

Apply only:

- All **structure-reviewer** blocking findings (frontmatter fixes, broken image paths, invalid tags, heading case)
- All **humanizer** findings (29 patterns are mechanical pattern replacements; safe to apply)

Skip and defer to the report:

- All **factcheck** findings (need human verification even if the agent is confident)
- All **voice-matcher** findings (voice rewrites are subjective)

Print a short summary of applied vs. deferred at the end.

### 5. Final summary

After applying (or after `ask` completes), print:

```
Editorial pass — <title>
  Path:       <absolute-path>
  Mode:       <auto|ask>
  Applied:    <n>
  Deferred:   <n>
  Report:     .scratch/editorialize-<slug>.md
```

## Examples

<example>
<input>User says: `/editorialize-blog rust-ruined-javascript-result ask`</input>
<output>
1. Resolves to `content/blog/posts/rust-ruined-javascript-result.mdx`.
2. Dispatches the four agents in parallel.
3. Each agent writes its partial report.
4. Skill aggregates into `.scratch/editorialize-rust-ruined-javascript-result.md`.
5. Walks findings: 0 structure, 1 factcheck (verified — applies fix), 0 voice, 3 humanizer (user applies 2, skips 1).
6. Final summary: 3 applied, 1 deferred.
</output>
</example>

<example>
<input>User says: `/editorialize-blog` (no target) in Claude Code</input>
<output>
1. Scans `content/blog/posts/*.mdx`, parses `publishedAt` from each.
2. Sorts desc, takes top 4.
3. Calls `AskUserQuestion` with the 4 most recent posts; recommends #1.
4. User picks `rust-ruined-javascript-result`.
5. Continues with the standard dispatch + aggregate + walk flow.
</output>
</example>

<example>
<input>User says: `/editorialize-blog auto` (no slug, just a mode) in codex</input>
<output>
1. Parses args: position 1 is a mode keyword, no slug. Sets `mode=auto`, target unresolved.
2. Emits a plain numbered list of the 4 most recent posts.
3. User replies `2`.
4. Resolves to the 2nd post, dispatches agents, auto-applies structure + humanizer.
</output>
</example>

<example>
<input>User says: `/editorialize-blog new-draft.mdx auto`</input>
<output>
1. Resolves to `content/blog/posts/new-draft.mdx`.
2. Dispatches four agents.
3. Auto-applies all structure + humanizer findings.
4. Factcheck and voice findings remain in the report.
5. User reads the report in `.scratch/` and decides what else to apply manually.
</output>
</example>

<example>
<good>User says: "edit my latest blog post" → routes to `/editorialize-blog`, prompts to pick from recent posts</good>
<bad>User says: "add a new blog post about Result types" → wrong skill, route to `/add-blog-post`. The trigger is *adding* new content, not editing existing content.</bad>
<bad>User says: "humanize this paragraph: <text>" → wrong skill, route to `/humanizer`. The user wants the standalone humanizer on a snippet, not a multi-agent pass on a published `.mdx` file.</bad>
</example>

## Rationalization table

`auto` mode has rules the agent might rationalize skipping. Recognize these excuses; they are wrong.

| Skipped rule                                  | Verbatim excuse                                                  | Why it's wrong                                                                                           |
| --------------------------------------------- | ---------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| Defer factcheck findings in `auto` mode       | "this factcheck is obviously correct, I'll just apply it"        | Even confident-looking factchecks can be wrong about category, version, or attribution — human verifies. |
| Defer voice-matcher findings in `auto` mode   | "this voice rewrite is clearly better, applying it"              | Voice is the author's signature; a "clearly better" rewrite still flattens it. Human decides.            |
| Run `auto` mode in evals/CI to "save a step"  | "no user is here, auto is the only mode that finishes"           | Use `scratch` mode. `auto` mutates tracked content; that's a working-tree contamination, not a feature.  |
| Apply edits without the report aggregating first | "I have all 4 partials, I can skip step 3 and apply directly" | The aggregated report is the audit trail. Skipping it loses the per-section ordering and deferred list.  |

## References

- [`templates/report.md.template`](templates/report.md.template) — aggregated report format
- `.agents/agents/factchecker.md` — factcheck subagent
- `.agents/agents/humanizer.md` — humanizer subagent
- `.agents/agents/voice-matcher.md` — voice-matcher subagent
- `.agents/agents/structure-reviewer.md` — structure-reviewer subagent
- `.agents/skills/humanizer/SKILL.md` — 29-pattern taxonomy the humanizer agent loads
- `content/AGENTS.md` — `BlogPost` frontmatter schema the structure-reviewer enforces
