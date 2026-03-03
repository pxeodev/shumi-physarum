---
title: "The Masked"
description: "Minimal seed explorer with automatic palette and texture selection."
---

![The Masked](/physarum/og-thumbnail.png)

The Masked is the minimal seed explorer. No sidebars, no sliders: just the swarm, the mascot, and three buttons. Each seed deterministically selects a palette and texture profile, with per-seed color drift creating infinite variation within each family.

**[Open the Masked →](https://haddencarpenter.github.io/shumi-physarum/masked.html)**

## How It Works

The Masked runs two physarum simulations (background + mascot), just like the Stencil, but with a fully automated parameter system. Instead of manual controls, the seed number determines everything:

1. **Palette selection**: `seed % 8` picks from 8 color palettes
2. **Texture selection**: `Math.floor(seed / 8) % 8` picks from 8 texture profiles
3. **Color drift**: Per-seed PRNG applies subtle hue, saturation, and luminance shifts within the selected palette
4. **Parameter jitter**: Each simulation parameter gets a ±10% seed-based variation within its texture profile

This means every seed has a unique look, not just different positions, but different colors and behavioral character.

## The 8 Palettes

Each palette defines three color stops for the mascot trails and three for the background.

| Palette | Mascot Colors | Character |
|---------|--------------|-----------|
| **Ember** | Dark brown → Gold → Warm orange | Default Shumi warmth |
| **Frost** | Dark blue → Sky blue → Ice blue | Ethereal, cold intelligence |
| **Moss** | Dark green → Lime → Pale green | Organic, bioluminescent growth |
| **Pearl** | Dark gray → Warm gray → Off-white | Minimal, elegant, neutral |
| **Bloom** | Dark magenta → Pink → Rose | Soft organic energy |
| **Honey** | Dark amber → Yellow-gold → Warm gold | Rich, saturated warmth |
| **Tide** | Navy → Steel blue → Periwinkle | Ocean depth, calm flow |
| **Rust** | Dark brown → Copper → Terracotta | Earthy, oxidized metal |

## The 8 Textures

Textures define the behavioral character: how fast cells move, how trails diffuse, and how much structure vs. haze the swarm produces.

| Texture | Character | Key Traits |
|---------|-----------|-----------|
| **Standard** | Warm, steady glow | Medium everything (the baseline) |
| **Crystalline** | Sharp defined veins | Low diffusion, high deposit, gem-like facets |
| **Smoke** | Soft ghostly haze | High diffusion, low deposit, trails dissolve |
| **Coral** | Dense branching networks | Slow speed, wide sensing, organic growth |
| **Silk** | Thin delicate threads | Fast speed, quick fade, silk in water |
| **Electric** | Long streaky paths | Very fast, tight sensors, lightning energy |
| **Flow** | Wide flowing rivers | Heavy diffusion, low deposit, lava lamp |
| **Spore** | Tight clusters with bright nodes | Short sensors, high deposit, constellation map |

## Per-Seed Color Drift

Even within the same palette, no two seeds look identical. The drift system applies:

- **Hue drift:** ±8° shift
- **Saturation drift:** ±5 units
- **Luminance drift:** ±3 units

Background colors receive a dampened version of the drift (60% hue, 40% saturation, 30% luminance) so the background stays complementary without competing with the mascot.

## Masking System

The mascot physarum doesn't just overlay the swarm. It grows *through* the mascot shape using a multi-pass analysis:

1. **Luminance pass**: Converts mascot pixels to brightness values
2. **Sobel edge detection**: Identifies sharp boundaries (cap outline, eyes, face border)
3. **Density map**: Combines edge strength with luminance to guide where trails grow densest
4. **Edge food sources**: High-contrast points become attractors, pulling cells toward structural features
5. **Edge distance fade**: Trails fade near mask boundaries for clean edges

The result is a swarm that traces the mascot's internal structure, concentrating along edges, eyes, and outlines.

## Ghost Afterimage

On each new seed, a ghost layer appears: a barely-perceptible retinal-burn echo of the original mascot. As the physarum trails build, the ghost fades over about 4 seconds, giving the appearance of the swarm replacing the original image.

## Chromatic Aberration

The mascot layer orbits with a subtle RGB channel separation effect:
- **Desktop:** 5px offset, 30% opacity, 6-second orbit cycle
- **Mobile:** 3px offset, 20% opacity, 8-second orbit (lighter for performance)

The background canvas also gets a dim, slow chromatic effect (14-second cycle) on desktop. Mobile disables background chromatic entirely.

## Interface

The Masked has the most minimal UI of all three simulators:

| Control | Action |
|---------|--------|
| **New Seed** | Generate a random seed and restart both simulations |
| **● Record** | Start/stop WebM video recording |
| **Save PNG** | Capture the current composite frame as PNG |

A status indicator at the top center shows brief messages (seed number, recording state) that fade after display.

## Composite Recording

When recording, the Masked composites all visible layers (background swarm, ghost, mascot physarum) onto a hidden canvas, then records that composite as WebM. The watermark (seed number) is included in the recording.
