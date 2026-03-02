---
title: "Seed System"
description: "How deterministic seeds control swarm patterns, palettes, and agent identity. Includes URL API reference for deep-linking."
---

Every Shumi agent is identified by a unique seed. Seeds are deterministic: the same seed always produces the same swarm pattern in a given simulator. Your seed is your agent's visual identity.

## How Seeds Work

A seed is a positive integer (1–999,999) that initializes the swarm's random number generator. It controls:

- **Cell spawn positions**: Where each cell emerges
- **Cell headings**: The initial direction each cell faces
- **Attractor placement**: Where signal attractors land on the canvas
- **Micro-randomness**: Subtle jitter in cell movement for organic texture

Same seed + same simulator + same parameters = identical swarm, every time, on any device.

## Seeds Across the Three Simulators

The same seed number produces **related but distinct** visuals in each simulator:

| Aspect | Generator | Stencil | Masked |
|--------|-----------|---------|--------|
| **PRNG sequence** | Shared base | Shared base | Shared base |
| **Layout** | Radial from center hub | BG + mascot-shaped | BG + mascot-shaped |
| **Palette** | Manual (presets/pickers) | Seed-determined (`seed % 8`) | Seed-determined (`seed % 8`) |
| **Texture** | Manual (all sliders) | Seed-determined (`seed/8 % 8`) | Seed-determined (`seed/8 % 8`) |
| **Color drift** | None | Per-seed HSL shift | Per-seed HSL shift |

Think of the seed as a genome: the same DNA expressed differently in each environment.

## Seed-to-Palette-to-Texture Mapping

In the Stencil and Masked, the seed fully determines the visual style. Here's the exact mapping:

**Palette** = `seed % 8`

| Index | Palette | Example seeds |
|-------|---------|---------------|
| 0 | Ember | 8, 16, 24, 32, 40 |
| 1 | Frost | 1, 9, 17, 25, 33 |
| 2 | Moss | 2, 10, 18, 26, 34 |
| 3 | Pearl | 3, 11, 19, 27, 35 |
| 4 | Bloom | 4, 12, 20, 28, 36 |
| 5 | Honey | 5, 13, 21, 29, 37 |
| 6 | Tide | 6, 14, 22, 30, 38 |
| 7 | Rust | 7, 15, 23, 31, 39 |

**Texture** = `Math.floor(seed / 8) % 8`

| Index | Texture | Seed range (first cycle) |
|-------|---------|--------------------------|
| 0 | Standard | 1–7 |
| 1 | Crystalline | 8–15 |
| 2 | Smoke | 16–23 |
| 3 | Coral | 24–31 |
| 4 | Silk | 32–39 |
| 5 | Electric | 40–47 |
| 6 | Flow | 48–55 |
| 7 | Spore | 56–63 |

This gives **64 base combinations** (8 palettes × 8 textures). The cycle repeats every 64 seeds, but per-seed color drift (±8° hue, ±5 saturation, ±3 luminance) means no two seeds look identical even within the same palette+texture pair.

**To find a specific combination**: pick the texture row, then pick the palette column within it. For example, Frost + Crystalline = seed 9 (Crystalline starts at 8, Frost is index 1, so 8 + 1 = 9).

## URL Deep-Linking

All three simulators support `?seed=` URL parameters for deep-linking to a specific seed.

**Base URL**: `https://haddencarpenter.github.io/shumi-physarum/`

### Generator (`index.html`)

| Parameter | Key | Example | Notes |
|-----------|-----|---------|-------|
| Seed | `seed` | `?seed=42069` | Integer 1–999,999. Defaults to 12345 if omitted. |

```
https://haddencarpenter.github.io/shumi-physarum/index.html?seed=42069
```

The Generator does not encode other parameters in the URL. Palette and sliders are controlled manually in the sidebar.

### Stencil (`stencil.html`)

| Parameter | Key | Example | Default | Notes |
|-----------|-----|---------|---------|-------|
| Seed | `seed` | `seed=42069` | Random | Integer 1–999,999 |
| Formation mode | `mode` | `mode=3` | `1` | 1=Ramp, 2=Code, 3=Mold, 4=Hybrid |
| Master opacity | `master` | `master=0.50` | `0.28` | Float 0–1.5 |
| Edge strong | `es` | `es=0.35` | `0.30` | Float, edge detection strength |
| Edge weak | `ew` | `ew=0.15` | `0.12` | Float, subtle edge threshold |
| Landing page mode | `lp` | `lp` | off | Hides all UI for iframe embedding |
| Legacy rendering | `legacy` | `legacy` | off | Forces single-thread (no Web Worker) |

```
https://haddencarpenter.github.io/shumi-physarum/stencil.html?seed=10&mode=3&master=0.50&es=0.35
```

The Stencil's **Share** button auto-generates a URL with the current settings. Only non-default values are included.

### Masked (`masked.html`)

| Parameter | Key | Example | Notes |
|-----------|-----|---------|-------|
| Seed | `seed` | `?seed=37` | Integer 1–999,999. Random if omitted. |

```
https://haddencarpenter.github.io/shumi-physarum/masked.html?seed=37
```

The Masked has no other URL parameters. Palette, texture, and all simulation parameters are determined entirely by the seed.

## Seed Controls by Simulator

### Generator

| Action | How |
|--------|-----|
| Enter a specific seed | Type in the seed field, press Enter or click Jump |
| Deep-link to a seed | Add `?seed=X` to the URL |
| Step forward | Click **Next** (seed + 1) |
| Step backward | Click **Prev** (seed - 1, minimum 1) |
| Random seed | Click **Random** (picks 1–999,999) |

### Stencil

| Action | How |
|--------|-----|
| Random seed | Click **New Seed** |
| Specific seed | Open **☰ Settings**, type in seed field, click **Jump** |
| Deep-link to a seed | Add `?seed=X` to the URL (plus optional `&mode=`, `&master=`, `&es=`, `&ew=`) |
| Share seed + settings | Click **Share** (copies URL with all non-default params) |

### Masked

| Action | How |
|--------|-----|
| Random seed | Click **New Seed** |
| Deep-link to a seed | Add `?seed=X` to the URL |

## What Changes Between Seeds

### In the Generator

With default parameters, different seeds produce noticeably different topologies:

1. **Attractor layout varies.** Attractors land in different positions, creating unique branch targets.
2. **Spawn angles differ.** Cells radiate in different initial directions from the hub.
3. **Early-stage divergence.** Small differences in the first frames compound into completely different networks.

### In the Stencil & Masked

In addition to layout differences, the seed also changes:

1. **Palette**: Cycling through the 8 palettes (Ember, Frost, Moss, Pearl, Bloom, Honey, Tide, Rust)
2. **Texture profile**: Cycling through 8 textures (standard, crystalline, smoke, coral, silk, electric, flow, spore)
3. **Color drift**: Subtle hue/saturation/luminance shifts within the palette family
4. **Parameter jitter**: ±10% variation in simulation parameters

## What Stays Constant

- **Generator:** Hub at 35% from top, horizontally centered. Swarm character (density, speed, palette) set by parameters.
- **Stencil:** Mascot image, formation mode, and settings panel values persist across seeds.
- **Masked:** Mascot shape, masking behavior, and ghost afterimage timing are fixed.

## Finding Your Seed

### Manual Browsing (Generator)

Use **Prev/Next** to step through seeds. Adjacent seeds (e.g., 100 and 101) can produce very different results. There's no gradual transition.

### Preview Carousel (Generator)

The **Preview Seeds** feature is the fastest discovery method:

1. Click **Preview Seeds**
2. Watch random seeds grow for 4 seconds each
3. Press **Space** to bookmark ones that resonate
4. Stop when you've found your candidates

### Rapid Tapping (Masked)

In the Masked, just keep clicking **New Seed**. The minimal UI and fast restarts make it the quickest way to browse palette/texture combinations. The seed number appears briefly in the status bar.

### Share URL (Stencil)

Found a great combination? Click **Share** to capture the exact seed, mode, and settings in a URL.

## Seed as Identity

When the Shumi agent collection launches, each agent will be paired with a seed number. The swarm pattern generated by that seed becomes the agent's permanent visual identity.
