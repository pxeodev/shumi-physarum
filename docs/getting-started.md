# Getting Started

## Requirements

- A modern web browser (Chrome recommended, Firefox/Edge/Safari also work)
- No installation or build step required

## Opening the Generator

### Option 1: Live on GitHub Pages

Visit the published URL directly — the generator runs entirely in your browser.

### Option 2: Run Locally

Clone or download the repository and open `index.html` in your browser.

## Interface Layout

![Shumi Generator Interface](https://raw.githubusercontent.com/haddencarpenter/shumi-physarum/main/shumi.webp)

The interface has two areas:

- **Left sidebar** (300px) — All controls: seed navigation, swarm parameters, palette selection, and export tools
- **Main canvas** (right) — The live swarm simulation at 16:9 aspect ratio

## Your First Swarm

When you open the generator, it immediately begins growing a swarm with these defaults:

| Parameter | Default Value |
|-----------|--------------|
| Seed | 12345 |
| Cell Count | 6,000 |
| Speed | 2.8 |
| Sensor Distance | 22 |
| Sensor Angle | 40° |
| Turn Speed | 20° |
| Signal Deposit | 12 |
| Signal Decay | 0.968 |
| Diffusion | 0.25 |
| Attractors | 12 |
| Palette | Shumi Gold |

The swarm spawns from a central intelligence hub positioned at 35% from the top of the canvas and grows outward. New cells continuously emerge from the hub until the population cap is reached.

## Basic Workflow

1. **Explore seeds** — Click **Random** or use **Prev/Next** to browse unique patterns
2. **Shape the swarm** — Adjust sliders to change cell behavior, signal chemistry, and rendering
3. **Choose a palette** — Pick a preset or define your own color identity
4. **Export** — Save as PNG, record WebM video, or export an animated GIF
5. **Preview & batch** — Use the seed preview carousel to audition many seeds, bookmark favorites, then batch-record them all

## Sharing Your Seed

Every swarm is fully reproducible. Share your seed number and parameter settings with others — they'll see the exact same pattern. This is how Shumi agents will be identified: by their unique seed.
