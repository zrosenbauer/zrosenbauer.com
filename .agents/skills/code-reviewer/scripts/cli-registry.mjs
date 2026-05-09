/**
 * Shared registry of known AI coding CLIs. Single source of truth for both
 * `detect-clis.mjs` (probes $PATH) and `invoke-cli.mjs` (executes a CLI with
 * a prompt from stdin).
 *
 * Add a new entry here to grow coverage; nothing else needs to change.
 *
 * @typedef {object} CliEntry
 * @property {string} id          Stable identifier, kebab-case (matches skills.sh agent id when possible)
 * @property {string} name        Human-readable
 * @property {string} binary      Executable name to look for on $PATH
 * @property {string} promptTemplate  How to invoke for a one-shot prompt; uses {{PROMPT}} placeholder
 * @property {string|null} stdinTemplate  Alternative: command that reads prompt from stdin (preferred when set)
 * @property {string=} versionFlag        Flag to ask for version; defaults to --version
 * @property {string=} notes
 * @property {boolean=} subcommand        true if `binary` is a parent + subcommand (e.g., `gh copilot`)
 * @property {string=} subcommandCheck    For subcommands, the full check command (e.g., `gh extension list`)
 */

import { execFileSync } from 'node:child_process'
import { existsSync, statSync } from 'node:fs'
import path from 'node:path'

/** @type {CliEntry[]} */
export const REGISTRY = [
  {
    id: 'claude-code',
    name: 'Claude Code',
    binary: 'claude',
    promptTemplate: 'claude -p {{PROMPT}}',
    stdinTemplate: 'claude -p',
    notes: 'Anthropic Claude Code CLI; -p runs one-shot non-interactive',
  },
  {
    id: 'codex',
    name: 'OpenAI Codex',
    binary: 'codex',
    promptTemplate: 'codex exec {{PROMPT}}',
    stdinTemplate: 'codex exec -',
    notes: 'OpenAI Codex CLI; `codex exec` runs non-interactive',
  },
  {
    id: 'gemini-cli',
    name: 'Gemini CLI',
    binary: 'gemini',
    promptTemplate: 'gemini -p {{PROMPT}}',
    stdinTemplate: 'gemini -p',
    notes: 'Google Gemini CLI; -p runs one-shot',
  },
  {
    id: 'opencode',
    name: 'OpenCode',
    binary: 'opencode',
    promptTemplate: 'opencode run {{PROMPT}}',
    stdinTemplate: null,
    notes: 'OpenCode CLI; `opencode run` for non-interactive prompts',
  },
  {
    id: 'cursor-agent',
    name: 'Cursor agent',
    binary: 'cursor-agent',
    promptTemplate: 'cursor-agent -p {{PROMPT}}',
    stdinTemplate: null,
    notes: 'Cursor CLI agent (separate from the IDE)',
  },
  {
    id: 'github-copilot',
    name: 'GitHub Copilot',
    binary: 'gh',
    subcommand: true,
    subcommandCheck: 'gh extension list',
    promptTemplate: 'gh copilot explain {{PROMPT}}',
    stdinTemplate: null,
    versionFlag: '--version',
    notes: 'gh copilot extension; check with `gh extension list | grep copilot`',
  },
  {
    id: 'aider',
    name: 'Aider',
    binary: 'aider',
    promptTemplate: 'aider --message {{PROMPT}}',
    stdinTemplate: null,
    notes: 'AI pair-programming CLI; --message for one-shot',
  },
  {
    id: 'crush',
    name: 'Crush',
    binary: 'crush',
    promptTemplate: 'crush -p {{PROMPT}}',
    stdinTemplate: 'crush -p',
    notes: 'Charm Crush — terminal AI assistant',
  },
  {
    id: 'mods',
    name: 'Mods',
    binary: 'mods',
    promptTemplate: 'mods {{PROMPT}}',
    stdinTemplate: 'mods',
    notes: 'Charm Mods — pipes prompts to LLMs',
  },
  {
    id: 'ollama',
    name: 'Ollama',
    binary: 'ollama',
    promptTemplate: 'ollama run llama3 {{PROMPT}}',
    stdinTemplate: 'ollama run llama3',
    notes: 'Local model runner; substitute the model name as needed',
  },
  {
    id: 'goose',
    name: 'Goose',
    binary: 'goose',
    promptTemplate: 'goose run -t {{PROMPT}}',
    stdinTemplate: null,
    notes: 'Block Goose — agentic CLI',
  },
  {
    id: 'continue',
    name: 'Continue',
    binary: 'continue',
    promptTemplate: 'continue chat {{PROMPT}}',
    stdinTemplate: null,
    notes: 'Continue CLI / dev agent',
  },
  {
    id: 'windsurf',
    name: 'Windsurf',
    binary: 'windsurf',
    promptTemplate: 'windsurf -p {{PROMPT}}',
    stdinTemplate: null,
    notes: 'Codeium Windsurf CLI',
  },
  {
    id: 'droid',
    name: 'Droid (Factory)',
    binary: 'droid',
    promptTemplate: 'droid run {{PROMPT}}',
    stdinTemplate: null,
    notes: 'Factory Droid CLI',
  },
  {
    id: 'tabnine-cli',
    name: 'Tabnine CLI',
    binary: 'tabnine',
    promptTemplate: 'tabnine ask {{PROMPT}}',
    stdinTemplate: null,
  },
  {
    id: 'amp',
    name: 'Amp',
    binary: 'amp',
    promptTemplate: 'amp run {{PROMPT}}',
    stdinTemplate: null,
    notes: 'Sourcegraph Amp CLI',
  },
  {
    id: 'qwen-code',
    name: 'Qwen Code',
    binary: 'qwen-code',
    promptTemplate: 'qwen-code -p {{PROMPT}}',
    stdinTemplate: null,
  },
  {
    id: 'iflow-cli',
    name: 'iFlow CLI',
    binary: 'iflow',
    promptTemplate: 'iflow -p {{PROMPT}}',
    stdinTemplate: null,
  },
  {
    id: 'kimi-cli',
    name: 'Kimi Code CLI',
    binary: 'kimi',
    promptTemplate: 'kimi -p {{PROMPT}}',
    stdinTemplate: null,
  },
  {
    id: 'aichat',
    name: 'aichat',
    binary: 'aichat',
    promptTemplate: 'aichat {{PROMPT}}',
    stdinTemplate: 'aichat',
    notes: 'Polyglot CLI — supports many providers; useful as a fallback',
  },
]

/**
 * Candidate file extensions to probe for a binary on $PATH. POSIX hosts only
 * try the bare name; Windows additionally tries the executable extensions
 * registered in `PATHEXT` (npm-installed CLIs typically ship as `<name>.cmd`
 * shims, not extensionless `<name>`).
 *
 * @returns {string[]}
 * @private
 */
function pathExtCandidates() {
  if (process.platform !== 'win32') return ['']
  // Windows PATHEXT default is `.COM;.EXE;.BAT;.CMD;.VBS;.VBE;.JS;.JSE;.WSF;.WSH;.MSC`.
  // Only the executable shapes are interesting for CLI probing.
  const raw = process.env.PATHEXT ?? '.COM;.EXE;.BAT;.CMD'
  const exts = raw
    .split(';')
    .map((e) => e.trim())
    .filter(Boolean)
    .map((e) => (e.startsWith('.') ? e : `.${e}`))
  // Try the bare name first (lets a non-shimmed binary win), then the registered
  // extensions in PATHEXT order.
  return ['', ...exts]
}

/**
 * Walk $PATH for a binary. Returns absolute path on success, null on miss.
 * Pure — never throws.
 *
 * @param {string} binary
 * @returns {{ available: true, path: string } | { available: false, path: null }}
 */
export function locateBinary(binary) {
  const dirs = (process.env.PATH ?? '').split(path.delimiter)
  const extCandidates = pathExtCandidates()
  for (const dir of dirs) {
    if (!dir) continue
    for (const ext of extCandidates) {
      const candidate = path.join(dir, binary + ext)
      let stat
      try {
        // Follow symlinks (e.g. /usr/local/bin/claude → real binary).
        stat = statSync(candidate)
      } catch {
        // ENOENT, EACCES on parent dir, dangling symlink, etc.
        continue
      }
      if (!stat.isFile()) continue
      // POSIX: any execute bit (owner / group / other). On Windows, executability
      // is determined by file extension (PATHEXT), not mode bits, so fall back to
      // the existence-style check there to avoid false negatives.
      if (process.platform !== 'win32' && (stat.mode & 0o111) === 0) continue
      return { available: true, path: candidate }
    }
  }
  return { available: false, path: null }
}

/**
 * Best-effort version probe. Returns the version string or null. Never throws.
 *
 * @param {CliEntry} entry
 */
export function readVersion(entry) {
  const flag = entry.versionFlag ?? '--version'
  try {
    const out = execFileSync(entry.binary, [flag], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
      timeout: 3000,
    })
    const semver = out.match(/\d+\.\d+(?:\.\d+)?/)
    return semver ? semver[0] : out.trim().split('\n')[0].slice(0, 64)
  } catch {
    return null
  }
}

/**
 * Look up a CliEntry by id. Returns null if not found.
 *
 * @param {string} id
 */
export function findEntry(id) {
  return REGISTRY.find((e) => e.id === id) ?? null
}

/**
 * Build the spawn plan for invoking a registry entry with a given prompt.
 * Prefers stdin (`stdinTemplate`) when defined; falls back to argv
 * (`promptTemplate` with `{{PROMPT}}` substitution).
 *
 * Pure — no spawning, no I/O. Exported for testing and reuse.
 *
 * @param {CliEntry} entry
 * @param {string} prompt
 * @returns {{ mode: 'stdin' | 'argv', command: string, args: string[], stdin: string | null }}
 */
export function buildInvocation(entry, prompt) {
  if (entry.stdinTemplate) {
    const tokens = tokenize(entry.stdinTemplate)
    const [command, ...args] = tokens
    return { mode: 'stdin', command, args, stdin: prompt }
  }

  const tokens = tokenize(entry.promptTemplate)
  if (!tokens.includes('{{PROMPT}}')) {
    throw new Error(`promptTemplate missing {{PROMPT}}: ${entry.promptTemplate}`)
  }
  const [command, ...rest] = tokens
  const args = rest.map((t) => (t === '{{PROMPT}}' ? prompt : t))
  return { mode: 'argv', command, args, stdin: null }
}

/** @param {string} template */
function tokenize(template) {
  return template.trim().split(/\s+/)
}
