# Getting Started

## Requirements

- A modern web browser (Chrome, Firefox, Edge, Safari)
- No installation or build step required

## Opening the Generator

### Option 1: Local File

Download or clone the repository, then open `index.html` directly in your browser.

### Option 2: GitHub Pages

Visit the published URL if GitHub Pages is enabled on the repository.

## Interface Layout

The interface is split into two areas:

- **Left sidebar** (300px) — All controls, sliders, and export buttons
- **Main canvas** (right) — The live physarum simulation at 16:9 aspect ratio

## Your First Simulation

When you open the generator, it immediately starts running with these defaults:

| Parameter | Default Value |
|-----------|--------------|
| Seed | 12345 |
| Agent Count | 6,000 |
| Speed | 2.8 |
| Sensor Distance | 22 |
| Sensor Angle | 40 |
| Turn Speed | 20 |
| Deposit Strength | 12 |
| Decay Rate | 0.968 |
| Diffusion | 0.25 |
| Nutrient Sources | 12 |
| Color Preset | Shumi Gold |

The colony spawns from a single point at 35% from the top of the canvas and grows outward. New agents continuously birth from the hub until the agent count cap is reached.

## Basic Workflow

1. **Explore seeds** — Click Random or use Prev/Next to browse patterns
2. **Tweak parameters** — Adjust sliders to change the colony's behavior
3. **Change colors** — Pick a preset or use custom color pickers
4. **Export** — Save as PNG snapshot, record WebM video, or export animated GIF
5. **Preview & batch** — Use the seed preview carousel to audition many seeds, bookmark favorites, then batch record them all
