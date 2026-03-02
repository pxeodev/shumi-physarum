# Getting Started

## Requirements

- A modern web browser (Chrome recommended, Firefox/Edge/Safari also work)
- No installation or build step required

## Which Version Should I Use?

| If you want to... | Use | Link |
|-------------------|-----|------|
| Explore and tweak every parameter | [The Generator](generator.md) | [Open →](https://haddencarpenter.github.io/shumi-physarum/index.html) |
| Create mascot avatar compositions | [The Stencil](stencil.md) | [Open →](https://haddencarpenter.github.io/shumi-physarum/stencil.html) |
| Quickly browse seed personalities | [The Masked](masked.md) | [Open →](https://haddencarpenter.github.io/shumi-physarum/masked.html) |
| See the branded landing page | Demo Hub | [Open →](https://haddencarpenter.github.io/shumi-physarum/demo.html) |

## Opening a Simulator

### Option 1: Live on GitHub Pages

Click any link above. Every simulator runs entirely in your browser.

### Option 2: Run Locally

Clone or download the repository and open `index.html`, `stencil.html`, or `masked.html` directly in your browser.

## Quick Start: The Generator

1. Open `index.html`. The swarm starts growing immediately with seed `12345`.
2. Click **Random** to discover new patterns
3. Adjust the sidebar sliders to shape the swarm's behavior
4. Hit **Save PNG** or **Record WebM** to capture your pattern

### Generator Defaults

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

## Quick Start: The Stencil

1. Open `stencil.html`. The swarm grows behind the mascot automatically.
2. Use **1 2 3 4** keys (or buttons, top-right) to switch formation modes
3. Press and hold **Space** for a full-intensity blast reveal
4. Open **☰ Settings** (top-left) to fine-tune parameters
5. Click **Share** to copy a shareable URL

## Quick Start: The Masked

1. Open `masked.html`. A random seed loads automatically.
2. Click **New Seed** to explore different palette/texture combinations
3. Each seed selects its own palette and texture, so just keep clicking
4. Click **Save PNG** or **● Record** to capture

## Sharing Your Seed

Every swarm is fully reproducible. In the Generator and Masked, share the seed number. In the Stencil, use the **Share** button to copy a URL that encodes the seed, formation mode, and key settings.

The same seed number produces different (but related) visuals across the three simulators. The underlying random sequence is shared, but each version interprets it differently.
