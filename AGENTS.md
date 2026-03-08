# AGENTS.md — Session Handoff & Error Triage Guide

> This file is read by Claude Code at the start of every session.
> It provides operational context that survives context cutoffs between sessions.
> For architecture constraints and project goals, see `.council-goals`.

---

## Repo Context

**Shumi Physarum** — Real-time agent-based physarum simulator (Web Worker + OffscreenCanvas). Ships as standalone HTML + worker JS. Active development is on `stencil.html` + `stencil-worker.js`; the p5.js paths (`index.html`, `masked.html`) are legacy/unmaintained.

Key files: `stencil.html` (~117 KB), `stencil-worker.js` (~54 KB), `.council-goals` (architecture constraints).

---

## Error Triage Guide

### General Error — Bugsnag Alert or Exception

1. Read the full error: class, message, and stack trace
2. Check `first_seen` vs `last_seen` — is this genuinely new or long-running?
3. Check `/exceptions` — should this be suppressed as a known condition?
4. Check if a recent deploy correlates with `first_seen`
   - If yes → rollback first, then investigate
   - If no deploy → this is data-driven; read the full error context in Bugsnag (request payload, specific data values) to understand what input triggered it
5. Reproduce locally using the same data/input as your test case, then fix

**Do NOT:** Rollback to cure a data-driven error — it won't help. Do not push a fix that just swallows the error without understanding why the data is unexpected.

---

### Lab Results Anomaly — Data Gap

**Presentation:** Alert says today's count is significantly lower than yesterday's

**Critical mindset: our data is naturally variable.** The number of active coins, market cap tiers, and derivative-eligible assets changes daily. A slightly lower count is often completely normal. Do not treat every data gap alert as an emergency — verify first.

**Triage — rule out normal causes before diagnosing a gap:**
- **OHLC:** Uses 4h candles (6 per day, closing at 00:00/04:00/08:00/12:00/16:00/20:00 UTC). Today's count will always be lower than yesterday's full count until all candles have closed. Compare today to the *same candle window* from yesterday — not the full day.
- **SuperTrend:** If the alert fires between 00:20–02:30 UTC, the Daily CRON is still mid-run. Wait until 02:30 UTC before concluding anything is wrong.
- **CoinTime 1h:** Compare `todayTotal` to `yesterdaySameWindow`, never to `yesterdayFull`.
- **CoinTime 1d:** Up to ±5% daily variation is completely normal — coins enter and exit data sources constantly.
- Run `/data [table]` and read the numbers carefully before drawing any conclusion.

**If a real gap is confirmed:**
1. Check whether the relevant cron ran: `/crons`
2. Check cron run logs on Render for errors
3. Check if the upstream data source API is having issues
4. If the cron ran and completed without errors but data is still missing: **escalate to Sascha** — do not attempt manual data repair

**Do NOT** manually insert or patch data in the database without Sascha's approval.

---

### Irregular Vitals — Cron Job Failed

**Presentation:** `/crons` shows a failed or missed run

**Critical note:** The most common cause of cron failures is the upstream API returning a different data structure than expected — a renamed field, new nesting, a changed format. This is an external change, not a bug you introduced. Always read the logs before doing anything.

**Treatment:**
1. Render dashboard → cron service → run history
2. Read the logs. Common patterns:
   - `Cannot read property X of undefined` → API field renamed or removed
   - `TypeError: X is not a function` → data type changed (array vs object, etc.)
   - `Timeout / 429 / 503` → upstream API is temporarily down or rate-limiting — **transient, do nothing**, it retries on next schedule
3. If the upstream API structure changed:
   - Fetch the live API response manually and compare it to what the code expects
   - Fix the parsing code locally
   - **Verification step:** run the cron locally against the real API and query the database after: `SELECT * FROM "TableName" ORDER BY "createdAt" DESC LIMIT 10` — confirm the data looks correct before deploying
4. Deploy only once correct data has been confirmed locally

**Do NOT:** Manually trigger a cron re-run on production without understanding why it failed. Running it twice risks duplicate data.

---

### ICU Watch — Database Memory / CPU

**Presentation:** Alert reports DB memory >90% or CPU sustained >80%

**Important:** Memory and CPU spikes are not automatically critical. The database can still respond under pressure — it will just be slower. This only becomes an emergency if you can see it visibly affecting other services (slow API responses, connection timeouts, cron failures).

**Assessment:**
1. Run `/db` to see current memory and settings
2. Check whether the spike correlates with a cron run, a deploy, or unusual traffic
3. If a specific query is the culprit, check for missing indexes or unoptimized queries
4. If memory is consistently high with no clear cause: **escalate to Sascha**

---

## Session Handoff Rules

1. **Do not start work without reading `.council-goals` and this file.** They contain constraints that prevent regressions.
2. **If a previous session left uncommitted changes**, read the diff before continuing. Do not discard work.
3. **If you hit a context limit mid-task**, summarize your progress and next steps in a commit message so the next session can pick up cleanly.
4. **Performance is priority #1.** See `.council-goals` for the ranked priority list. Never trade frame rate for features.
5. **LP mode is production; normal mode is dev tooling.** Both must work, but LP mode regressions are production incidents.
