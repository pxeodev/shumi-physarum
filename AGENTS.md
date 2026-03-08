# AGENTS.md — Session Handoff & Debugging Guide

For architecture constraints and ranked priorities, see `.council-goals`.

## Repo Context

Active development is on `stencil.html` + `stencil-worker.js`. The p5.js paths (`index.html`, `masked.html`) are legacy/unmaintained. This is a client-side-only project — no backend, no database, no cron jobs.

## Common Failure Modes

### Visual Glitch on Load

Race conditions between mask image loading, ghost pre-render, and first visible frame are the #1 class of bugs. If you see a white flash, half-drawn mascot, or ghost layer popping:
1. Check the initialization sequence in `stencil.html` — is the mask image `onload` firing before the worker posts its first frame?
2. Check `postMessage` ordering — does the worker receive `init` before the main thread expects `frame` responses?
3. Test in both LP mode and normal mode — they have different init paths.

### Frame Rate Drop

Performance is priority #1 (see `.council-goals`). If fps drops below 60:
1. Check for allocations in the hot loop — `updateAgents()`, `diffuseAndDecay()`, `renderTrailPixels()` must be zero-alloc.
2. Check for DOM touches or branching on hot paths in the worker.
3. Profile in mobile Safari specifically — that is the target constraint.

### Worker/Main-Thread Desync

The message protocol (`init`, `tick`, `frame`, `restart`, `resize`, `updateParams`, `setMode`, `blast`) is a contract. If behavior is wrong after a change:
1. Verify both sides agree on the message format — adding fields is safe, changing semantics breaks silently.
2. Check `transferToImageBitmap()` usage — never replace with `toDataURL()` or `getImageData()` in the frame loop.

### LP Mode vs Normal Mode Drift

LP-specific overrides (food placement, core suppression, agent counts) are baked in at init, not branched per-frame. If LP mode looks wrong but normal mode is fine:
1. Check whether the LP override was applied at init time, not per-frame.
2. Check the resurface/mascot overlay — it uses OffscreenCanvas in the worker and regular canvas in the fallback. Two codepaths that can drift if only one is updated.

**Do NOT:** Add per-frame branching for LP vs normal mode. Do not break seed determinism — a given seed must always produce the same visual.

## Session Handoff Rules

1. **If a previous session left uncommitted changes**, read the diff before continuing. Do not discard work.
2. **If you hit a context limit mid-task**, summarize progress and next steps in a commit message so the next session can pick up cleanly.
3. **LP mode is production; normal mode is dev tooling.** Both must work, but LP mode regressions are production incidents.
