# Audit prompt template

The verbatim prompt the parent agent hands to each per-provider subagent in step 3 of the workflow. Copy this template, fill the `{{...}}` placeholders, and pass as the `prompt` argument to `Agent({ subagent_type: "general-purpose", ... })`.

Keep all four subagent prompts identical except for the per-provider data — the parent does the cross-provider aggregation in step 4, not the subagents.

## Template

```
You are auditing one agent skill against the {{PROVIDER_NAME}} format.

PROVIDER METADATA (from scripts/providers.mjs):
- id:                    {{provider.id}}
- fileFormat:            {{provider.fileFormat}}
- fileLocation:          {{provider.fileLocation}}
- requiredFrontmatter:   {{provider.requiredFrontmatter}}
- optionalFrontmatter:   {{provider.optionalFrontmatter}}
- forbiddenFrontmatter:  {{provider.forbiddenFrontmatter}}
- toolSurface:           {{provider.toolSurface}}
- notes:                 {{provider.notes}}

DOC URLS TO CONSULT (in priority order — try the first, fall back to the
next on 4xx/5xx):
{{provider.docUrls bulleted}}

SKILL CONTENT TO AUDIT:
---
{{skill.frontmatter as YAML}}
---

{{skill.body as markdown}}

YOUR JOB:

1. WebFetch the first docUrl above. If it returns 4xx/5xx, fall back to the
   next URL. If all URLs fail, set FORMAT/BODY/TOOLS to "unknown" and explain
   in NOTES.

2. Evaluate the skill against three layers:

   a. FORMAT — does the file shape match {{provider.fileFormat}}? Are all
      requiredFrontmatter fields present? Are any forbiddenFrontmatter
      fields present? What about file-location conventions
      ({{provider.fileLocation}})?

   b. BODY — does the body lean on conventions {{provider.name}} doesn't
      parse? (Examples to look for: XML tags <example>/<good>/<bad>,
      progressive-disclosure links to references/, headings the provider
      ignores, sections referencing companion files that won't load.)

   c. TOOLS — scan the body for tool names. Match each name against the
      toolSurface above. Report unmatched tool names — these are the ones
      the agent in {{provider.name}} cannot call by that name.

3. Return ONLY this exact structure (no preamble, no markdown headings, no
   trailing prose):

   VERDICT: compatible | partial | incompatible
   FORMAT: <one-line summary of format-layer findings>
   BODY: <one-line summary of body-layer findings>
   TOOLS: <comma-separated unmatched tool names, or "none">
   NOTES: <2–3 short bullets with specific findings; cite frontmatter field
          names or quote phrases from the body where useful>

VERDICT scoring rubric:
- "compatible"   = format matches, body parses cleanly, all named tools
                   exist in toolSurface
- "partial"      = format works after a rename or one frontmatter tweak,
                   OR body has some non-portable structure, OR 1–2 tool
                   names are unmatched but their function is achievable
- "incompatible" = required frontmatter missing, format mismatch needs
                   substantive rewrite, OR core workflow tools are absent
                   from this provider's surface
```

## Worked example — Cursor verdict on the code-reviewer skill

Hypothetical filled-in prompt → hypothetical subagent return:

```
VERDICT: partial
FORMAT: SKILL.md must be renamed to .cursor/rules/code-reviewer.mdc; the
        references/ directory will not load — those reference docs reach
        Claude Code via lazy load, but Cursor reads only the single .mdc.
BODY: <example> tags render as fenced code in Cursor's chat panel rather
      than being parsed as structure. Acceptable but not load-bearing.
TOOLS: AskUserQuestion, gh
NOTES:
- Frontmatter `argument-hint`, `user-invocable`, `model-invocable` are
  silently ignored by Cursor — harmless.
- The "load on demand" persona-reference pattern (lines 70–82 of SKILL.md)
  doesn't survive the port. Inline at least one persona before shipping
  to Cursor users.
- `gh pr diff` runs fine via Cursor's run_terminal_cmd; it's the
  AskUserQuestion call that needs replacing with a chat prompt the user
  answers free-form.
```
