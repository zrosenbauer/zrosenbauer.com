#!/usr/bin/env node
/**
 * detect-clis — probe for AI coding CLIs available on $PATH.
 *
 * Outputs JSON to stdout (one entry per registered CLI):
 *
 *   {
 *     "id": "claude-code",
 *     "name": "Claude Code",
 *     "binary": "claude",
 *     "available": true,
 *     "path": "/opt/homebrew/bin/claude",
 *     "version": "2.1.119" | null,
 *     "promptTemplate": "claude -p {{PROMPT}}",
 *     "stdinTemplate": "claude -p" | null,
 *     "notes": "..." | null
 *   }
 *
 * Flags:
 *   --available-only    only emit entries with available: true
 *   --names-only        emit just the names (one per line)
 *   --pretty            pretty-print JSON (default: compact for piping)
 *
 * Exit code: 0 always (probing is best-effort; empty result means "no CLIs found").
 */

import { execFileSync } from 'node:child_process'

import { REGISTRY, locateBinary, readVersion } from './cli-registry.mjs'

const flags = parseFlags(process.argv.slice(2))
const results = REGISTRY.map(probe).filter((entry) => !flags.availableOnly || entry.available)

if (flags.namesOnly) {
  for (const r of results) process.stdout.write(`${r.name}\n`)
} else {
  process.stdout.write(JSON.stringify(results, null, flags.pretty ? 2 : 0) + '\n')
}

/**
 * Probe a single registry entry — never throws.
 * @param {import('./cli-registry.mjs').CliEntry} entry
 */
function probe(entry) {
  const found = entry.subcommand ? probeSubcommand(entry) : locateBinary(entry.binary)
  return {
    id: entry.id,
    name: entry.name,
    binary: entry.binary,
    available: found.available,
    path: found.path,
    version: found.available ? readVersion(entry) : null,
    promptTemplate: entry.promptTemplate,
    stdinTemplate: entry.stdinTemplate ?? null,
    notes: entry.notes ?? null,
  }
}

/**
 * Subcommand probe: parent must exist AND the subcommand check must succeed.
 * Currently used for `gh copilot` (gh extension list).
 *
 * @param {import('./cli-registry.mjs').CliEntry} entry
 */
function probeSubcommand(entry) {
  const parent = locateBinary(entry.binary)
  if (!parent.available || !entry.subcommandCheck) return parent
  try {
    const [cmd, ...rest] = entry.subcommandCheck.split(' ')
    const out = execFileSync(cmd, rest, {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
      timeout: 3000,
    })
    if (out.toLowerCase().includes('copilot')) return parent
  } catch {
    /* best-effort */
  }
  return { available: false, path: null }
}

/** @param {string[]} argv */
function parseFlags(argv) {
  const set = new Set(argv)
  return {
    availableOnly: set.has('--available-only'),
    namesOnly: set.has('--names-only'),
    pretty: set.has('--pretty'),
  }
}
