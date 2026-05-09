#!/usr/bin/env node
/**
 * invoke-cli — invoke a registered AI CLI with a prompt from stdin.
 *
 * Usage:
 *   node invoke-cli.mjs <cli-id> [--timeout <seconds>] [--dry-run]
 *
 * Reads the prompt from stdin. Looks up <cli-id> in `cli-registry.mjs`.
 * Prefers `stdinTemplate` (pipes prompt to the child's stdin); falls back to
 * `promptTemplate` (passes the prompt as the last argv argument). Times out
 * after <timeout> seconds (default 120s).
 *
 * The child's stdout becomes our stdout. The child's stderr becomes our
 * stderr. The child's exit code passes through (mapped — see below).
 *
 * Exit codes:
 *   0  — child exited 0
 *   1  — argument error (no cli-id, unknown id, empty prompt)
 *   2  — child exited non-zero
 *   3  — timeout
 *   4  — child binary not on $PATH (registered but not installed)
 *
 * Examples:
 *   echo "review this code" | node invoke-cli.mjs codex
 *   node invoke-cli.mjs claude-code --timeout 60 < prompt.md
 *   node invoke-cli.mjs codex --dry-run < prompt.md   # show planned invocation, don't run
 */

import { spawnSync } from 'node:child_process'
import { readFileSync } from 'node:fs'

import { buildInvocation, findEntry, locateBinary } from './cli-registry.mjs'

const argv = process.argv.slice(2)
const cliId = argv[0]
const flags = parseFlags(argv.slice(1))

if (!cliId || cliId.startsWith('--')) {
  process.stderr.write('Usage: invoke-cli <cli-id> [--timeout <seconds>] [--dry-run] < prompt\n')
  process.exit(1)
}

const entry = findEntry(cliId)
if (!entry) {
  process.stderr.write(`Unknown cli-id: ${cliId}\n`)
  process.stderr.write('Run `node detect-clis.mjs --names-only` to see available ids.\n')
  process.exit(1)
}

const prompt = readStdin()
if (!prompt.trim()) {
  process.stderr.write('Empty prompt on stdin. Pipe a prompt: `echo "..." | invoke-cli <id>`\n')
  process.exit(1)
}

const plan = buildInvocation(entry, prompt)

if (flags.dryRun) {
  process.stdout.write(
    JSON.stringify(
      {
        cli: { id: entry.id, name: entry.name, binary: entry.binary },
        mode: plan.mode,
        command: plan.command,
        args: plan.args,
        stdinBytes: plan.stdin === null ? 0 : Buffer.byteLength(plan.stdin),
      },
      null,
      2
    ) + '\n'
  )
  process.exit(0)
}

const located = locateBinary(entry.binary)
if (!located.available) {
  process.stderr.write(`${entry.binary} not found on $PATH\n`)
  process.exit(4)
}

const result = spawnSync(plan.command, plan.args, {
  input: plan.stdin ?? undefined,
  encoding: 'utf8',
  timeout: flags.timeout * 1000,
  stdio: ['pipe', 'pipe', 'pipe'],
  maxBuffer: 50 * 1024 * 1024,
})

if (result.error?.code === 'ETIMEDOUT') {
  process.stderr.write(`invoke-cli: timed out after ${flags.timeout}s\n`)
  process.exit(3)
}
if (result.error) {
  process.stderr.write(`invoke-cli: ${result.error.message}\n`)
  process.exit(2)
}

process.stdout.write(result.stdout ?? '')
if (result.stderr) process.stderr.write(result.stderr)
process.exit(result.status === 0 ? 0 : 2)

/** @param {string[]} rest */
function parseFlags(rest) {
  let timeout = 120
  let dryRun = false
  for (let i = 0; i < rest.length; i += 1) {
    const a = rest[i]
    if (a === '--dry-run') {
      dryRun = true
      continue
    }
    if (a === '--timeout') {
      const next = rest[i + 1]
      const n = Number(next)
      if (!Number.isFinite(n) || n <= 0) {
        process.stderr.write(`--timeout requires a positive number; got: ${next}\n`)
        process.exit(1)
      }
      timeout = n
      i += 1
      continue
    }
  }
  return { timeout, dryRun }
}

function readStdin() {
  try {
    return readFileSync(0, 'utf8')
  } catch {
    return ''
  }
}
