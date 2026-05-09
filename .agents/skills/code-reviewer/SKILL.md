---
name: code-reviewer
description: >-
  This skill should be used when the user wants to review code, audit a
  diff, get a second opinion on changes, or run an adversarial review.
  Common triggers include "review this code", "audit this diff", "find
  issues in", "second opinion on this", "harsh review of", "review the PR",
  "adversarial review", and "security review of". Picks one of four
  reviewer personas (adversarial, security, architecture, performance),
  supports a PR sub-mode via `gh pr diff`, and can hand off to any
  detected AI CLI for a cross-model second opinion. Skip when the user
  wants formatting fixes (use a linter) or refactoring patterns (use
  ts-best-practices or ts-best-practices-functional).

# --- Claude Code extensions (ignored by other agents) ---
argument-hint: '[<file|dir|pr-url|diff>]'
user-invocable: true
model-invocable: true
---

# code-reviewer

Reviews code through a chosen persona. Three layered modes:

1. **Local mode** — review files / diffs / staged changes in the current repo
2. **PR mode** — review a pull request by URL (fetches diff via `gh pr diff`)
3. **Cross-model mode (optional)** — hand the review off to another AI CLI on the machine for an independent second opinion

The reference docs live in [`references/`](references/) and are loaded **on demand** — the SKILL.md keeps the trigger surface lean; specifics for each persona / mode get pulled in only when the user picks one.

## When to use

Verbatim trigger phrases:

- "review this code"
- "audit this diff"
- "find issues in this"
- "second opinion on this"
- "harsh review of"
- "review the PR"
- "adversarial review"
- "security review of"

## When NOT to use

- Formatting / style fixes → use a linter (`oxlint`, `eslint`, `prettier`, etc.)
- Refactoring patterns → use `ts-best-practices` or `ts-best-practices-functional`
- Fixing PR review comments that already exist → use the existing `gg-pr-fix-review` skill
- Writing new code from scratch → this skill reviews existing code

## Inputs

`$ARGUMENTS` — one of:

- File or directory path (`src/foo.ts`, `src/` )
- `diff` / `staged` — review `git diff` or `git diff --staged`
- A PR URL or `<owner/repo#123>` — triggers PR sub-mode
- Empty — ask the user what to review

## Workflow

### 1. Determine scope

Resolve `$ARGUMENTS` to a concrete set of files + diff:

| Input                    | Action                                                                |
| ------------------------ | --------------------------------------------------------------------- |
| File/dir path            | Read the file(s) directly                                             |
| `diff`                   | `git diff`                                                            |
| `staged`                 | `git diff --staged`                                                   |
| PR URL or `owner/repo#N` | `gh pr diff <ref>` (and `gh pr view <ref>` for context)               |
| empty                    | Ask: "What should I review? (file path / `diff` / `staged` / PR URL)" |

### 2. Choose persona — load on demand

Ask the user (use `AskUserQuestion` in Claude Code, or your agent's equivalent) which review angle:

- **Adversarial** — devil's advocate, harsh, looks for everything wrong → load [`references/adversarial-reviewer.md`](references/adversarial-reviewer.md)
- **Security** — threat modeling, OWASP, input handling → load [`references/security-reviewer.md`](references/security-reviewer.md)
- **Architecture** — design, abstractions, coupling, modularity → load [`references/architecture-reviewer.md`](references/architecture-reviewer.md)
- **Performance** — algorithmic complexity, memory, I/O patterns → load [`references/performance-reviewer.md`](references/performance-reviewer.md)
- **All four sequentially** — load each, run separate passes, merge findings

Only load the reference(s) the user picked. Don't pre-load all four — that's the whole point of progressive disclosure.

### 3. Choose mode — in-process vs cross-model

Ask the user whether to run the review here (current agent) or hand it off to a different AI CLI for an independent second opinion.

If cross-model is chosen:

```bash
node scripts/detect-clis.mjs --available-only --pretty
```

The script outputs JSON of available CLIs with `promptTemplate` / `stdinTemplate`. Parse it, then ask the user (`AskUserQuestion` or equivalent) which CLI to dispatch to. See [`references/cross-model-handoff.md`](references/cross-model-handoff.md) for invocation patterns and how to compose the prompt.

If in-process: skip to step 4.

### 4. Run the review

**In-process:** apply the loaded persona reference as your guiding lens. Read the code in scope, produce findings.

**Cross-model:** compose the prompt from the persona reference + the code + the output-format spec. Invoke the chosen CLI per the `promptTemplate` from step 3. Capture stdout. The cross-model output is the review.

### 5. Format the output

Apply [`references/review-output-format.md`](references/review-output-format.md):

- Group findings by severity (`error` / `warn` / `info` — matches our skill-tools tiers)
- Use `file:line` references so the user can click to source
- Include a one-line summary at the top
- Keep verbatim quotes from the code where useful (don't paraphrase)

## Examples

<example>
<input>"review the auth refactor in src/auth/" with adversarial persona</input>
<output>
1. Scope: read every file under `src/auth/`.
2. Persona: load `references/adversarial-reviewer.md`.
3. Mode: in-process (no cross-model requested).
4. Run review through the adversarial lens — assume the code is broken, look for race conditions, missing null handling, leaked credentials, ignored errors.
5. Format per `references/review-output-format.md`. Output:

```
SUMMARY: 11 findings (3 error / 5 warn / 3 info)

ERRORS
✗ src/auth/session.ts:47  unsigned cookie used as identity check
✗ src/auth/login.ts:122   password compared with === (timing attack)
✗ src/auth/oauth.ts:88    PKCE code_verifier stored in localStorage

WARNS
⚠ src/auth/session.ts:31  session.userId can be null but isn't narrowed
...
```

</output>
</example>

<example>
<input>"second opinion on the diff via codex" — cross-model mode</input>
<output>
1. Scope: `git diff`.
2. Persona: ask user → adversarial.
3. Mode: cross-model. Run `node scripts/detect-clis.mjs --available-only`. JSON shows codex available at `/Users/.../bin/codex` with promptTemplate `codex exec {{PROMPT}}`.
4. Compose prompt: `references/adversarial-reviewer.md` body + the diff + `references/review-output-format.md` spec. Invoke `codex exec "<composed-prompt>"`.
5. Capture stdout, present as the review (with a header noting "Reviewed by OpenAI Codex 0.128.0").
</output>
</example>

<example>
<good>
Loaded only `references/adversarial-reviewer.md` because the user picked
"adversarial". Other persona refs stayed on disk.
</good>

<bad>
Pre-loaded all four persona references and the cross-model handoff doc
"just in case". Wastes context budget on every dispatch.
</bad>

The bad example violates the skill's progressive-disclosure design — references exist precisely so we don't pay the context cost when they're not needed.

## References

- [`references/adversarial-reviewer.md`](references/adversarial-reviewer.md) — harsh, devil's-advocate persona
- [`references/security-reviewer.md`](references/security-reviewer.md) — security-focused review lens
- [`references/architecture-reviewer.md`](references/architecture-reviewer.md) — design / coupling / modularity
- [`references/performance-reviewer.md`](references/performance-reviewer.md) — complexity, memory, I/O
- [`references/cross-model-handoff.md`](references/cross-model-handoff.md) — how to invoke detected CLIs
- [`references/review-output-format.md`](references/review-output-format.md) — three-tier output spec
- [`scripts/detect-clis.mjs`](scripts/detect-clis.mjs) — node script, ships with the skill, probes for ~20 AI CLIs and emits JSON
