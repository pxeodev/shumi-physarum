# Seed System

Seeds are the foundation of reproducibility in the Physarum Generator. Every seed produces the same simulation when all parameters are equal.

## How Seeds Work

A seed is a positive integer that initializes the pseudo-random number generator (PRNG). The PRNG controls:

- **Agent spawn positions** — Where each agent is placed within the spawn radius
- **Agent headings** — Initial direction each agent faces
- **Food source placement** — Positions and radii of nutrient attractors
- **Turn randomness** — Subtle jitter in agent movement

Because p5.js uses a deterministic PRNG, the same seed + same parameters always produces the exact same growth pattern.

## Seed Controls

| Action | How |
|--------|-----|
| Enter a specific seed | Type in the seed input field, press Enter or click Jump |
| Step forward | Click **Next** (seed + 1) |
| Step backward | Click **Prev** (seed - 1, minimum 1) |
| Random seed | Click **Random** (picks 1–999,999) |

## What Changes Between Seeds

With default parameters, different seeds produce noticeably different patterns because:

1. **Food placement varies** — 12 nutrient sources land in different positions, creating unique branch targets
2. **Spawn angles differ** — Agents radiate in different initial directions
3. **Early-stage chaos** — Small differences in the first few frames compound into completely different network topologies

## What Doesn't Change

- The spawn point is always at 35% from the top, horizontally centered
- The overall character of the simulation (density, speed, color) is determined by parameters, not the seed
- The growth pattern (radial outward from center) is consistent across all seeds

## Finding Good Seeds

### Manual Browsing

Use **Prev/Next** to step through seeds sequentially. Seeds near each other (e.g., 100 and 101) can produce very different results.

### Preview Carousel

The **Preview Seeds** feature in the Recording Studio is the fastest way to find good seeds:

1. Click **Preview Seeds**
2. Watch random seeds grow for 4 seconds each
3. Press **Space** to bookmark ones you like
4. Stop when you've collected enough

### What Makes a "Good" Seed

This is subjective, but visually interesting seeds tend to have:

- Food sources spread widely (not clustered on one side)
- Multiple distinct branches visible
- Balanced growth (not all in one direction)
- Clear separation between major paths
