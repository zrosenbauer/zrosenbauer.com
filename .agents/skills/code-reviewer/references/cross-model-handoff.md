# Cross-model handoff

Load when the user has chosen the cross-model review mode. The job is to invoke a different AI CLI on the same machine, give it a persona + the code, and capture its review verbatim.

**Why bother:** the current agent has its own training, biases, and blind spots. A second model often catches what the first missed. This is especially valuable for adversarial / security review where one model's "looks fine" is another model's "obvious vulnerability".

## Step 1 — Detect available CLIs

```bash
node scripts/detect-clis.mjs --available-only --pretty
```

The script (~20 known agents) probes `$PATH` for binaries and emits JSON:

```json
[
  {
    "id": "codex",
    "name": "OpenAI Codex",
    "binary": "codex",
    "available": true,
    "path": "/Users/.../bin/codex",
    "version": "0.128.0",
    "promptTemplate": "codex exec {{PROMPT}}",
    "stdinTemplate": "codex exec -",
    "notes": "OpenAI Codex CLI; `codex exec` runs non-interactive"
  }
]
```

If the array is empty, **stop** — there's no second model available. Tell the user and offer to run in-process review instead.

## Step 2 — Ask the user which CLI

In Claude Code, use `AskUserQuestion`. In other agents, use whatever the agent provides (stdin prompt, etc.). Show: `name`, `version`, and a one-line summary of `notes`.

Skip the current agent's own CLI in the picker — running Claude on Claude is not "cross-model".

## Step 3 — Compose the prompt

Concatenate, in order:

1. **The persona reference** (e.g., `references/adversarial-reviewer.md`) — but strip the YAML / Markdown headers and pass only the persona body. The receiving model doesn't need our taxonomy of headings.
2. **A scope marker:** `\n\n--- CODE TO REVIEW ---\n\n`
3. **The code itself** — file contents, diff, or PR diff. Keep it complete; truncation hides the bugs.
4. **The output-format spec** — pass `references/review-output-format.md`'s "Format" section verbatim.

Total prompt should fit in the target model's context. If the code is huge:

- For diffs: pass the diff, not the whole files
- For files > ~50KB: chunk and run the review per file, then concatenate findings

## Step 4 — Invoke the CLI

Use the bundled `invoke-cli.mjs` script. It encapsulates the stdin-vs-argv choice, handles timeouts, and avoids all shell-quoting hazards:

```bash
PROMPT_FILE=$(mktemp)
cat > "$PROMPT_FILE" << 'EOF'
<full composed prompt — persona body, scope marker, code, output-format spec>
EOF
node scripts/invoke-cli.mjs <cli-id> --timeout 120 < "$PROMPT_FILE"
rm "$PROMPT_FILE"
```

The script:

- Looks up `<cli-id>` in the same registry `detect-clis.mjs` uses
- Prefers `stdinTemplate` (pipes the prompt to the child's stdin); falls back to `promptTemplate` argv substitution when the CLI doesn't support stdin
- Times out after `--timeout` seconds (default 120s) — prevents a hanging interactive CLI from locking the agent
- Returns the child's stdout on stdout, stderr on stderr
- Exit codes: `0` success, `1` argument error, `2` child exited non-zero, `3` timeout, `4` binary not on $PATH

### Dry-run before committing tokens

If you're not sure the invocation will work, do a dry run first — prints the planned command without spawning the CLI:

```bash
echo "test prompt" | node scripts/invoke-cli.mjs codex --dry-run
# {
#   "cli": { "id": "codex", "name": "OpenAI Codex", "binary": "codex" },
#   "mode": "stdin",
#   "command": "codex",
#   "args": ["exec", "-"],
#   "stdinBytes": 11
# }
```

## Step 5 — Capture the response

The CLI's stdout is the review. Save it (don't paraphrase). If the user asked for the review _as the response_, present it; if they asked for a summary, summarize at the end but keep the raw text accessible.

**Always include a header noting which model produced the review:**

```
# Code review (via OpenAI Codex 0.128.0)

[verbatim CLI output below]
```

## Things that go wrong

| Symptom                                              | Cause                                             | Fix                                                                                            |
| ---------------------------------------------------- | ------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| CLI hangs                                            | Likely waiting for interactive input              | Make sure you used the non-interactive flag (`-p`, `exec`, etc. — see `promptTemplate`)        |
| Empty / minimal output                               | CLI silently rate-limited or auth-failed          | Run the CLI manually with `--help` to verify auth                                              |
| Output is in a chat-style format ("Sure! Here's...") | The model wasn't pushed into reviewer mode        | Strengthen the persona prompt — explicitly say "Output ONLY the findings, no preamble"         |
| Output mixes findings with code suggestions          | Persona didn't say "findings only, not solutions" | Adversarial / security personas explicitly forbid solutions; reinforce in the prompt if needed |

## Don't

- Don't run the same prompt against two CLIs and concatenate — diluted findings, no value-add
- Don't fall back to in-process if the cross-model CLI fails silently — tell the user, give them the failure detail, let them decide
- Don't trim the cross-model output to "fit" — capture verbatim. The whole point is the second model's perspective.
