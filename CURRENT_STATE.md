# Shumi Physarum — Current State

_Last updated: 2026-03-05_

## Overview

Real-time agent-based physarum (slime mold) simulator that generates organic visual networks on HTML canvas. ~6,000 agents deposit pheromone trails that diffuse and decay each frame, producing emergent fungal transport networks. Ships as standalone HTML + Web Worker JS — no bundler, no framework, no build step.

Primary use case: animated hero background for the Shumi landing page, plus an interactive creative tool for exploring emergent patterns.

## Active Files

| File | Lines | Size | Role |
|---|---|---|---|
| `stencil.html` | ~2,471 | 119 KB | Main application (UI, compositing, recording) |
| `stencil-worker.js` | ~1,303 | 56 KB | Web Worker simulation engine |
| `demo.html` | ~247 | 7.5 KB | Hub/landing page with live preview |

## Legacy Files (Unmaintained)

| File | Role |
|---|---|
| `index.html` | v1 Generator (p5.js-based) |
| `masked.html` | v2 Masked explorer (p5.js-based) |
| `gen-ascii-logo.html` | ASCII art generator utility |

## Tech Stack

- **Vanilla JavaScript** — no frameworks, no dependencies
- **Web Workers + OffscreenCanvas** — off-thread simulation for 60 FPS
- **Canvas 2D API** — all rendering
- **MediaRecorder API** — WebM video capture (VP9)
- **Mintlify** — documentation platform (`docs/` directory)
- **GitHub Pages** — deployment (static files served directly)

## Architecture

```
┌─────────────────────────────────────┐
│  Main Thread (stencil.html)         │
│  ├─ Settings panel (30+ params)     │
│  ├─ Canvas compositing layers:      │
│  │   ghost, resurface, chromatic    │
│  ├─ Recording controls (PNG/WebM)   │
│  └─ URL state management            │
└──────────────┬──────────────────────┘
               │ postMessage (JSON)
┌──────────────▼──────────────────────┐
│  Web Worker (stencil-worker.js)     │
│  ├─ Two OffscreenCanvases           │
│  │   ├─ Background simulation       │
│  │   └─ Mascot simulation           │
│  ├─ All physics & trail rendering   │
│  └─ Mask & density map processing   │
└──────────────┬──────────────────────┘
               │ transferToImageBitmap()
               └─→ Zero-copy frame handoff
```

**Message protocol:** `init`, `tick`, `frame`, `restart`, `resize`, `updateParams`, `setMode`, `blast`

**Fallback:** Legacy single-thread mode when `OffscreenCanvas` is unavailable.

## Key Features

- **4 formation modes:** Ramp (ASCII density), Code (code-like ASCII), Mold (pixel trails), Hybrid (ASCII + pixel blend)
- **8 palettes × 8 textures** — seed-deterministic (`seed % 8` for palette, `Math.floor(seed / 8) % 8` for texture)
- **Deterministic seeding** — same seed always produces the same visual across platforms
- **30+ real-time parameters** — agent count, speed, sensors, chemistry, appearance, stencil controls
- **Export:** PNG snapshots, WebM video (60 FPS, VP9)
- **LP mode (`?lp`):** Strips all UI for clean iframe embedding as a background visual
- **URL API:** `?seed=N`, `?mode=1-4`, `?master=0.0-1.5`, `?es=`, `?ew=`, `?legacy`
- **Visual effects:** Chromatic aberration orbit, ghost afterimage, resurface pulse, spacebar blast
- **Mobile-optimized:** Capped agent counts, reduced sensor counts, touch support

## Simulation Loop (Per Frame)

1. **Spawn** — continuous agent birth until population cap
2. **Update** — each agent: sense → turn → move → deposit (4 physics steps/frame)
3. **Diffuse** — signal map blurs with 8-neighbor box filter
4. **Decay** — signal multiplied by decay rate (0.92–0.99)
5. **Render** — signal intensity maps to color gradient

## Recent Activity

| Commit | Description |
|---|---|
| `5c09e28` | Add live physarum hero canvas and enlarge demo hub layout |
| `d8e9831` | Fix mascot displacement in recording/export on HiDPI displays |
| `b4fac93` | Fix internal doc links to use absolute /physarum/ paths |
| `18d7ea5` | Remove introduction page, redirect root to physarum overview |
| `27a8bb6` | Migrate docs from GitBook to Mintlify |

## Priorities (Ranked)

1. **60 FPS on mobile Safari** — zero dropped frames; zero allocations, no DOM touches, no branching in hot paths
2. **Zero jank on load** — no white flash, no half-drawn mascot, no ghost layer popping
3. **LP mode visual fidelity** — mascot resurface, filament density, fade curves must look organic
4. **Payload size < 50 KB per file** — stencil.html (119 KB) and stencil-worker.js (56 KB) are both over budget

## Known Tech Debt

- **Simulation param duplication** — params duplicated between worker and main-thread fallback paths; shared config object would be cleaner
- **Two rendering codepaths** — worker OffscreenCanvas vs. legacy single-thread can drift if only one is updated
- **File size overbudget** — stencil.html (119 KB, target 50 KB), stencil-worker.js (56 KB, target 50 KB); needs minification or splitting
- **Legacy p5.js versions** — `index.html` and `masked.html` are effectively unmaintained; all active work targets stencil

## Documentation

Hosted via Mintlify in `docs/physarum/`:

- `overview.md` — three iterations compared
- `how-it-works.md` — core physics, architecture
- `stencil.md` — UI, modes, worker architecture
- `palettes-and-modes.md` — color systems, textures
- `seed-system.md` — deterministic seeding, URL API
- `recording-and-export.md` — PNG, WebM, GIF, batch capture
- `tips-and-recipes.md` — parameter tuning
- `seed-gallery.md` — curated seed examples

## Branches

- `master` — main development branch
- `main` — remote default (origin)

## License

MIT
