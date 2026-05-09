import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import path from 'node:path'
import { test } from 'node:test'

import { buildInvocation, findEntry } from './cli-registry.mjs'

const SCRIPT = path.join(import.meta.dirname, 'invoke-cli.mjs')

function run(args = [], stdin = '') {
  return spawnSync('node', [SCRIPT, ...args], { encoding: 'utf8', input: stdin })
}

test('exits 1 with no cli-id', () => {
  const r = run([], 'prompt')
  assert.equal(r.status, 1)
  assert.match(r.stderr, /Usage/)
})

test('exits 1 on unknown cli-id', () => {
  const r = run(['definitely-unknown-cli'], 'prompt')
  assert.equal(r.status, 1)
  assert.match(r.stderr, /Unknown cli-id/i)
})

test('exits 1 when stdin is empty for a known cli', () => {
  const r = run(['claude-code'], '')
  assert.equal(r.status, 1)
  assert.match(r.stderr, /Empty prompt/i)
})

test('--dry-run prints a JSON plan and exits 0 without spawning the CLI', () => {
  const r = run(['codex', '--dry-run'], 'review this code')
  assert.equal(r.status, 0)
  const plan = JSON.parse(r.stdout)
  assert.equal(plan.cli.id, 'codex')
  assert.equal(plan.mode, 'stdin')
  assert.equal(plan.command, 'codex')
  assert.deepEqual(plan.args, ['exec', '-'])
  assert.equal(plan.stdinBytes, Buffer.byteLength('review this code'))
})

test('--dry-run for an argv-mode CLI shows promptTemplate substitution', () => {
  const r = run(['aider', '--dry-run'], 'find issues')
  assert.equal(r.status, 0)
  const plan = JSON.parse(r.stdout)
  assert.equal(plan.mode, 'argv')
  assert.equal(plan.command, 'aider')
  assert.ok(plan.args.includes('find issues'), 'prompt should be substituted into argv')
  assert.ok(plan.args.includes('--message'))
  assert.equal(plan.stdinBytes, 0)
})

test('--timeout requires a positive number', () => {
  const r = run(['codex', '--timeout', 'abc', '--dry-run'], 'p')
  assert.equal(r.status, 1)
  assert.match(r.stderr, /positive number/)
})

test('--timeout accepts a positive number', () => {
  const r = run(['codex', '--timeout', '30', '--dry-run'], 'p')
  assert.equal(r.status, 0)
})

// Unit tests for buildInvocation — exported for direct testing
test('buildInvocation: stdin mode for entry with stdinTemplate', () => {
  const entry = findEntry('codex')
  const plan = buildInvocation(entry, 'hello world')
  assert.equal(plan.mode, 'stdin')
  assert.equal(plan.command, 'codex')
  assert.deepEqual(plan.args, ['exec', '-'])
  assert.equal(plan.stdin, 'hello world')
})

test('buildInvocation: argv mode when no stdinTemplate', () => {
  const entry = findEntry('aider')
  const plan = buildInvocation(entry, 'review this')
  assert.equal(plan.mode, 'argv')
  assert.equal(plan.command, 'aider')
  assert.ok(plan.args.includes('review this'))
  assert.equal(plan.stdin, null)
})

test('buildInvocation: substitutes {{PROMPT}} verbatim including special chars', () => {
  const entry = findEntry('aider')
  const tricky = 'review this `code` with $VARS and "quotes"'
  const plan = buildInvocation(entry, tricky)
  assert.ok(plan.args.includes(tricky), 'special chars must be passed verbatim through argv')
})

test('buildInvocation: throws if promptTemplate lacks {{PROMPT}}', () => {
  const broken = {
    id: 'broken',
    name: 'Broken',
    binary: 'broken',
    promptTemplate: 'broken --no-placeholder',
    stdinTemplate: null,
  }
  assert.throws(() => buildInvocation(broken, 'p'), /PROMPT/)
})
