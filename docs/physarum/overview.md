---
title: "Shumi Physarum"
description: "Three iterations of a biomimetic swarm simulator — from open sandbox to identity engine."
---

![Shumi Physarum](/physarum/og-thumbnail.png)

Three simulators built on the same physarum transport network engine. Each iteration added a layer of structure on top of the raw swarm simulation.

## The Three Iterations

### [v1 — The Generator](/physarum/generator) (`index.html`)

The original sandbox. 14 sliders, 8 color presets, and a recording studio for batch exports. Full manual control over every swarm parameter — speed, sensor distance, decay, diffusion, attractors. Exports PNG, WebM, GIF, and fullscreen 1080p.

**Best for:** Exploration, custom parameter tuning, batch recording.

### [v2 — The Masked](/physarum/masked) (`masked.html`)

Deterministic seed explorer. Each seed auto-selects from 8 palettes and 8 texture profiles with per-seed color drift. Minimal UI — just click through seeds to discover personalities. The swarm grows through the mascot shape using edge detection and density mapping.

**Best for:** Discovering seed personalities, quick visual identity browsing.

### [v3 — The Stencil](/physarum/stencil) (`stencil.html`)

Identity engine. Layers physarum behind the mascot using four formation modes (Ramp, Code, Mold, Hybrid), each rendering the swarm as ASCII art or pixel density. Full settings panel, shareable URL system, and Web Worker rendering for performance.

**Best for:** Agent avatars, social content, shareable identity links.

## Shared Engine

All three simulators share the same underlying physics:

- **Deterministic seeds.** Same seed → consistent results across all three versions.
- **Biomimetic transport network.** Autonomous agents sense, navigate, and build signal pathways.
- **Signal memory.** Decay and propagation create self-organizing network structures.
- **PNG and WebM export.** Every version can capture stills and video.

## Quick Links

| | Generator (v1) | Masked (v2) | Stencil (v3) |
|---|---|---|---|
| **Live** | [Open →](https://haddencarpenter.github.io/shumi-physarum/index.html) | [Open →](https://haddencarpenter.github.io/shumi-physarum/masked.html) | [Open →](https://haddencarpenter.github.io/shumi-physarum/stencil.html) |
| **Docs** | [Generator](/physarum/generator) | [Masked](/physarum/masked) | [Stencil](/physarum/stencil) |
| **Status** | Legacy (p5.js) | Legacy (p5.js) | Active |
| **UI** | Full sidebar, 14 sliders | 3 buttons | Settings panel + mode buttons |
| **Export** | PNG, WebM, GIF, 1080p | PNG, WebM | PNG, WebM, Share URL |

No installation. No build step. No dependencies. Just open and explore.
