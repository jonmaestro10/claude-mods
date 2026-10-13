import type { SessionRateLimit } from 'claude-code'

const LABELS: Record<string, string> = { five_hour: '5h', seven_day: '7d' }

function remaining(used: number): number {
  return Math.max(0, Math.round((100 - used) * 10) / 10)
}

/** "2h 14m" until `resetsAt`, or undefined when it is missing, unparseable or past. */
export function timeUntil(resetsAt: string | undefined, now: number): string | undefined {
  if (!resetsAt) return undefined
  const ms = Date.parse(resetsAt) - now
  if (!Number.isFinite(ms) || ms <= 0) return undefined
  const mins = Math.ceil(ms / 60_000)
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return h ? `${h}h ${m}m` : `${m}m`
}

/** "5h 77% left (resets in 2h 14m) · 7d 52% left", or undefined with no readings. */
export function formatUsage(limits: SessionRateLimit[], now: number): string | undefined {
  const parts = ['five_hour', 'seven_day'].flatMap(kind => {
    const w = limits.find(l => l.kind === kind)
    if (!w) return []
    let part = `${LABELS[kind]} ${remaining(w.percentUsed)}% left`
    const until = kind === 'five_hour' ? timeUntil(w.resetsAt, now) : undefined
    if (until) part += ` (resets in ${until})`
    return [part]
  })
  return parts.length ? parts.join(' · ') : undefined
}
