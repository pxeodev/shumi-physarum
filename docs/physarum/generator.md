---
title: "The Generator"
description: "Full-control physarum laboratory with 14 sliders, 8 palettes, and a recording studio."
---

![The Generator](/physarum/og-thumbnail.png)

The Generator is the full-control physarum laboratory. It exposes every parameter of the swarm simulation through a sidebar of sliders, giving you complete creative authority over cell behavior, signal chemistry, rendering, and color.

**[Open the Generator →](https://haddencarpenter.github.io/shumi-physarum/index.html)**

## Interface Layout

- **Left sidebar** (300px): All controls: seed navigation, swarm parameters, palette selection, and export tools
- **Main canvas** (right): The live swarm simulation at 16:9 aspect ratio

## Seed Navigation

| Control | Action |
|---------|--------|
| Seed input field | Type a specific seed number and press Enter |
| Prev / Next | Step through seeds one at a time |
| Random | Jump to a random seed (1–999,999) |
| Jump | Apply the seed currently typed in the input |

Changing the seed resets the simulation: new cell positions, new attractor placement, and a fresh signal map.

## Colony Parameters

These control the swarm cells: how many, how fast, and how they navigate.

### Cell Count
- **Range:** 500 – 8,000 | **Default:** 6,000
- **Sweet spot:** 4,000 – 7,000
- Sparse below 4,000. Sluggish above 7,000. Higher counts produce denser, more intricate networks.

### Speed
- **Range:** 0.5 – 30.0 | **Default:** 2.8
- **Sweet spot:** 2.0 – 3.5
- How far each cell moves per frame. Low = deliberate crawl. High = chaotic scatter.

### Sensor Distance
- **Range:** 5 – 40 | **Default:** 22
- **Sweet spot:** 15 – 30
- How far ahead each cell "senses" signal trails. Short = tight spirals. Long = blobby structures.

### Sensor Angle
- **Range:** 10° – 80° | **Default:** 40°
- **Sweet spot:** 30° – 55°
- The angle between a cell's forward direction and its side sensors. Narrow = straight filaments. Wide = noisy branching.

### Turn Speed
- **Range:** 5° – 60° | **Default:** 20°
- **Sweet spot:** 12° – 30°
- Maximum turning rate per frame. Low = stiff angular paths. High = jittery movement.

## Signal Chemistry

These control the signal trail system that cells use to communicate and self-organize.

### Signal Deposit
- **Range:** 5 – 80 | **Default:** 12
- **Sweet spot:** 8 – 20
- How much signal each cell deposits per frame. Low = faint trails. High = thick concentrated blobs.

### Signal Decay
- **Range:** 0.900 – 0.999 | **Default:** 0.965
- **Sweet spot:** 0.955 – 0.985
- How quickly signals fade. Lower = trails vanish fast. Higher (closer to 1.0) = signals persist and accumulate.

### Diffusion
- **Range:** 0.0 – 1.0 | **Default:** 0.25
- **Sweet spot:** 0.1 – 0.4
- How much signal spreads to neighboring cells. At 0, trails are pixel-sharp. Above 0.6, everything becomes soft and blurry.

## Environment

### Attractors
- **Range:** 0 – 20 | **Default:** 12
- **Sweet spot:** 6 – 15
- Number of signal attractors placed around the canvas. Set to 0 for pure radial growth from center.

### Attractor Strength
- **Range:** 0 – 50 | **Default:** 15
- **Sweet spot:** 8 – 25
- How strongly attractors pull nearby cells. High values cause cells to cluster at attractor sites.

### Spawn Radius
- **Range:** 5 – 100 | **Default:** 20
- **Sweet spot:** 5 – 25
- Size of the initial spawn area at the hub. Tight = clean burst. Wide = diffuse start.

## Rendering

These affect the visual output without changing the underlying swarm behavior.

### Trail Brightness
- **Range:** 0.3 – 3.0 | **Default:** 1.8
- **Sweet spot:** 1.2 – 2.5
- Brightness multiplier for signal trails.

### Cell Glow
- **Range:** 0.0 – 2.0 | **Default:** 0.5
- **Sweet spot:** 0.2 – 0.8
- Brightness of individual cell dots. Cells glow brighter at the frontier, the unexplored edge of the swarm.

### Cursor Influence
- **Range:** 0 – 500 | **Default:** 0 (off)
- **Sweet spot:** 0 for recording, 100–300 for interactive play
- Radius within which the mouse cursor attracts cells. Set to 0 when recording.

## Color Presets

The Generator includes 8 curated palettes. See [Swarm Palettes & Modes](/physarum/palettes-and-modes) for full color details.

| Preset | Character |
|--------|-----------|
| **Shumi Gold** *(default)* | Warm amber networks, burnt orange accents |
| **Emerald** | Bioluminescent green, deep ocean |
| **Violet** | Purple-magenta neural glow |
| **Ice** | Cool blue, ethereal and minimal |
| **Ember** | Fire and molten gold |
| **Toxic** | Neon green, cyberpunk |
| **Rose** | Pink-magenta, soft organic |
| **Mono** | Grayscale, raw topology |

Custom colors can be set via three color pickers: Signal Base, Signal Bright, and Hub Accent.

## Export Options

The Generator has the most complete export toolkit. See [Recording & Export](/physarum/recording-and-export) for full details.

| Feature | Description |
|---------|-------------|
| **Save PNG** | Snapshot of current frame |
| **Record WebM** | VP9 video at 60fps / 8Mbps |
| **Export GIF** | Animated loop, center-cropped square (128–720px) |
| **Fullscreen 1080p** | Hides sidebar, records at 1080×1080 |
| **Seed Preview** | Random seeds cycle every 4s, bookmark with Space |
| **Batch Record** | Records all bookmarked seeds sequentially |

## Reset

Click **Reset All Parameters** to restore every slider and color to its default value.
