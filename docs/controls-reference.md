# Controls Reference

Every parameter can be adjusted in real time via the sidebar sliders. Changes take effect immediately — the swarm adapts as you move each slider.

## Seed Navigation

| Control | Action |
|---------|--------|
| Seed input field | Type a specific seed number and press Enter |
| Prev / Next | Step through seeds one at a time |
| Random | Jump to a random seed (1–999,999) |
| Jump | Apply the seed currently typed in the input |

Changing the seed resets the simulation — new cell positions, new attractor placement, and a fresh signal map.

## Colony Parameters

These control the swarm cells — how many, how fast, and how they navigate.

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

These control the world the swarm inhabits.

### Attractors
- **Range:** 0 – 20 | **Default:** 12
- **Sweet spot:** 6 – 15
- Number of signal attractors placed around the canvas. Set to 0 for pure radial growth from center. Too many creates a cluttered pattern.

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
- Brightness multiplier for signal trails. Too dim below 1.0, blown out above 2.5.

### Cell Glow
- **Range:** 0.0 – 2.0 | **Default:** 0.5
- **Sweet spot:** 0.2 – 0.8
- Brightness of individual cell dots. At 0, cells are invisible (only trails show). Cells glow brighter at the frontier — the unexplored edge of the swarm.

### Cursor Influence
- **Range:** 0 – 500 | **Default:** 0 (off)
- **Sweet spot:** 0 for recording, 100–300 for interactive play
- Radius within which the mouse cursor attracts cells. Set to 0 when recording.

## Palettes

See [Swarm Palettes](color-presets.md) for full details on the 8 built-in palettes and custom color options.

## Reset

Click **Reset All Parameters** to restore every slider and color to its default value.
