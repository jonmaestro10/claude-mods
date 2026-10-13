import type { Register, SessionRateLimit } from 'claude-code'
import { formatUsage } from './format'

const REFRESH_MS = 60_000

export const register: Register = on => {
  // Last readings, so the minute tick can count the reset down between API responses.
  let latest: SessionRateLimit[] = []
  let show = async () => {}

  on('session.start', async ($, e, next) => {
    const out = await next(e)
    show = async () => {
      $.ui.status(formatUsage(latest, await $.clock.now()) ?? 'usage: waiting for first reading')
    }
    latest = (await $.session.usage()).rateLimits
    await show()
    $.clock.every(REFRESH_MS, () => void show())
    return out
  })

  on('session.measure', async ($, e, next) => {
    if (e.changed.includes('rateLimits')) {
      latest = e.rateLimits
      await show()
    }
    return next(e)
  })
}
