# usage-remaining

A Claude Code mod that puts your remaining subscription usage in the status line:

```
5h 76.5% left (resets in 2h 14m) · 7d 52% left
```

- Updates whenever a rate-limit window moves a whole point; the reset countdown ticks every minute.
- Reads Claude Code's own rate-limit readings (from API responses), so it shows
  `usage: waiting for first reading` until the session's first response.
- Accounts without a subscription have no rate-limit windows and show `usage: no rate-limit data`.

## Install

At a Claude Code terminal prompt:

```
/plugin install usage-remaining --marketplace jonmaestro10/claude-mods
```

Answer `y` to add the marketplace, then press Enter to install at user scope.

## Develop

```
claude plugin validate .
claude plugin test .
claude --plugin-dir .
```
