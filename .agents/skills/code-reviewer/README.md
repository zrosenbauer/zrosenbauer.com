# code-reviewer

> Review code with a chosen reviewer persona — adversarial, security, architecture, or performance. Optionally hand the review off to a second AI CLI on the machine for an independent cross-model second opinion.

Three layered modes:

1. **Local** — review files / diffs / staged changes with the current agent
2. **PR** — review a pull request by URL (`gh pr diff` under the hood)
3. **Cross-model** — invoke `codex`, `gemini`, `aider`, or any of ~20 detected AI CLIs for a second-opinion review

## Install

```bash
npx skills add zrosenbauer/skills --skill code-reviewer
```

## What it does

- Loads only the persona reference the user picks (progressive disclosure — the SKILL.md stays lean)
- Runs the [`scripts/detect-clis.mjs`](scripts/detect-clis.mjs) probe to discover AI CLIs on `$PATH`
- Composes a persona-specific prompt for cross-model handoff and captures stdout verbatim
- Outputs findings in three-tier severity (error / warn / info) matching the repo's `skill-tools` lint format

## Personas

| Persona      | When to use                                                             | Reference                                                                    |
| ------------ | ----------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| Adversarial  | Default for "harsh review", devil's advocate, before-merge sanity check | [`references/adversarial-reviewer.md`](references/adversarial-reviewer.md)   |
| Security     | Threat-model the code; OWASP / CWE categories                           | [`references/security-reviewer.md`](references/security-reviewer.md)         |
| Architecture | Boundaries, coupling, change locality, dependency direction             | [`references/architecture-reviewer.md`](references/architecture-reviewer.md) |
| Performance  | Algorithmic complexity, I/O patterns, GC pressure                       | [`references/performance-reviewer.md`](references/performance-reviewer.md)   |

## Trigger phrases

- "review this code"
- "audit this diff"
- "find issues in this"
- "second opinion on this"
- "harsh review of"
- "review the PR"
- "adversarial review"
- "security review of"

## Cross-model CLI detection

```bash
node scripts/detect-clis.mjs --available-only --pretty
```

Probes `$PATH` for ~20 known AI CLIs (Claude Code, Codex, Gemini CLI, Cursor agent, Aider, OpenCode, Crush, Mods, Ollama, Goose, Continue, Windsurf, Droid, Tabnine, Amp, Qwen Code, iFlow, Kimi, aichat, gh copilot). Outputs JSON with binary path, version, and invocation template per detected CLI.

The skill body uses this JSON to ask the user (`AskUserQuestion` in Claude Code) which CLI to dispatch to. Empty result → no second model available, skill falls back to in-process review.

## License

[MIT](./LICENSE) © Zac Rosenbauer
