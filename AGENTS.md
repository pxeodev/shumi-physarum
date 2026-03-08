# AGENTS.md

Read `.council-goals` before starting work.

Active files: `stencil.html` + `stencil-worker.js`. Everything else is legacy. Client-side only — no backend.

## Failure Modes

- **Load glitch** — Race between mask image load, ghost pre-render, and first worker frame. Check init sequence and `postMessage` ordering. Test both LP and normal mode.
- **FPS drop** — Zero allocations in `updateAgents()`, `diffuseAndDecay()`, `renderTrailPixels()`. No DOM touches in worker. Profile mobile Safari.
- **Worker desync** — Message protocol is a contract. Adding fields is safe, changing semantics breaks silently. Never swap `transferToImageBitmap()` for `toDataURL()`/`getImageData()`.
- **LP/normal drift** — LP overrides bake at init, not per-frame. Resurface overlay has two codepaths (OffscreenCanvas vs regular) that can diverge. Never break seed determinism.

## Handoff

1. Uncommitted changes from a prior session? Read the diff first. Do not discard.
2. Context limit mid-task? Summarize next steps in the commit message.
3. LP mode = production. Normal mode = dev tooling.
4. Promote any recurring entry from below into "Failure Modes", then remove it.

## Session-Discovered Failure Modes

<!-- Appended by Stop hook when a session resolves a novel failure mode. -->
