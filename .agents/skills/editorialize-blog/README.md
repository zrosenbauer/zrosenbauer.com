# editorialize-blog

Runs an editorial pass over a blog post on zrosenbauer.com by dispatching four specialized subagents in parallel and walking their findings.

## What it does

Given a blog post slug or path, the skill:

1. Resolves the target under `content/blog/posts/` — or prompts you to pick from the 4 most recent posts (by `publishedAt`) if no target is passed
2. Dispatches four subagents in parallel:
   - **factchecker** — verifies factual/technical claims via Context7 (libraries/frameworks) + WebSearch (history/bio)
   - **humanizer** — scans for the 29 AI-writing patterns from the humanizer skill
   - **voice-matcher** — compares against the author's prior posts and flags voice drift
   - **structure-reviewer** — validates frontmatter, headings, tags, and image paths
3. Aggregates the four partial reports into a single editorial report at `.scratch/editorialize-<slug>.md`
4. Applies findings per mode (`auto` or `ask`)

## Triggers

- "editorialize the blog post"
- "edit my blog post"
- "review the blog draft"
- "run editorial on X"
- "fact check and humanize this post"
- "edit my latest post"
- "review my most recent blog post"

## Usage

```
/editorialize-blog [<slug|path>] [auto|ask|scratch]
```

Examples:

```
/editorialize-blog                                          # prompts to pick from the 4 most recent posts
/editorialize-blog auto                                     # same, then auto-applies safe fixes after picking
/editorialize-blog rust-ruined-javascript-result ask
/editorialize-blog new-draft.mdx auto
/editorialize-blog content/blog/posts/hello-world.mdx
/editorialize-blog rust-ruined-javascript-result scratch    # report-only, applies zero edits
```

Mode defaults to `ask`. When no target is given, the skill scans `content/blog/posts/*.mdx`, sorts by `publishedAt`, and prompts you to pick — via `AskUserQuestion` in Claude Code, or a numbered list in codex / opencode / pi / Cursor / Copilot.

## Modes

| Mode      | What gets applied                                                                                       |
| --------- | ------------------------------------------------------------------------------------------------------- |
| `ask`     | Walks every finding interactively; user approves each fix                                               |
| `auto`    | Applies structure-reviewer blocking fixes + humanizer pattern fixes; leaves factcheck/voice for review  |
| `scratch` | Report-only; applies zero edits. Use for evals, CI, dry-runs, or review without commitment.             |

## Files

- `SKILL.md` — workflow + frontmatter (loaded by the dispatcher)
- `templates/report.md.template` — aggregated report layout
- `evals.json` — pressure scenarios for skill-eval

## Subagents

Live in `.agents/agents/`, symlinked into `.claude/agents/`. Each is a standard Claude Code subagent and can be invoked directly:

- `factchecker` — requires Context7 MCP (see Dependencies)
- `humanizer`
- `voice-matcher`
- `structure-reviewer`

## Dependencies

Context7 MCP is required. The project ships a `.mcp.json` at the repo root that declares it:

```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp@latest"]
    }
  }
}
```

Anonymous tier — no Upstash account required. If you hit rate limits, set a `CONTEXT7_API_KEY` env var (free account at upstash.com) and wire it into `.mcp.json`. The factchecker subagent uses Context7 for live library/framework docs and WebSearch for biographical/historical facts.

## License

MIT
