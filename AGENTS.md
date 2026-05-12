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

## Shumi roots / growth system (WIP, not wired in)

A new ASCII roots/growth take on the Shumi mascot is in design, not yet implemented. Reference material lives under `docs/physarum/` and is **not** registered in `docs/docs.json` (CC-facing, not public docs):

- `docs/physarum/shumi-roots-spec.md` — source of truth. Vision, 8 documented failure modes (text-shadow invisible at 5px, single-char paths invisible in dense grids, growth avoiding the red cap, etc.), architecture, grid params, 3 root-rendering options, growth system, success criteria.
- `docs/physarum/shumi-roots-v8.html` — engine skeleton + four-stage tip rendering (`eye` / `t0-t3` / `fresh` / `mid` / `set`). **The `<pre>` grid and `treePaths` array are intentionally stubbed** — the full pasted POC was ~400 KB and busts the project's <50 KB asset budget. Regenerate both from `shumi.webp` per the spec's "Architecture" section (Node + node-canvas at build time, or offscreen canvas at runtime). The eye-cell coordinates baked into the file are valid for the v8 grid resolution only.

Implementation order, per the spec — do not skip steps: (1) base image rendering, (2) one visible growth path, (3) tune to legibility, (4) then add complexity. **Live browser preview required at step 3** — the artifact viewer is not a valid environment for this work.

## Session-Discovered Failure Modes

<!-- Appended by Stop hook when a session resolves a novel failure mode. -->
