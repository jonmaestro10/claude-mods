import { test, expect } from 'claude-code/testing'
import { formatUsage, timeUntil } from './format'

const NOW = Date.parse('2026-10-13T12:00:00Z')

test('formats both windows with the 5h reset countdown', () => {
  expect(
    formatUsage(
      [
        { kind: 'seven_day', percentUsed: 48, resetsAt: '2026-10-16T00:00:00Z' },
        { kind: 'five_hour', percentUsed: 23.5, resetsAt: '2026-10-13T14:14:00Z' },
      ],
      NOW,
    ),
  ).toBe('5h 76.5% left (resets in 2h 14m) · 7d 52% left')
})

test('clamps past 100 and skips missing or other windows', () => {
  expect(formatUsage([{ kind: 'five_hour', percentUsed: 104 }, { kind: 'spend_limit', percentUsed: 5 }], NOW)).toBe('5h 0% left')
  expect(formatUsage([], NOW)).toBeUndefined()
})

test('countdown edge cases', () => {
  expect(timeUntil('2026-10-13T12:00:30Z', NOW)).toBe('1m')
  expect(timeUntil('2026-10-13T11:00:00Z', NOW)).toBeUndefined()
  expect(timeUntil('garbage', NOW)).toBeUndefined()
  expect(timeUntil(undefined, NOW)).toBeUndefined()
})
