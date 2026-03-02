# Controls Reference

Every parameter can be adjusted in real time via the sidebar sliders. Changes take effect immediately — no need to restart the simulation.

## Seed

| Control | Action |
|---------|--------|
| Seed input field | Type a specific seed number and press Enter |
| Prev / Next | Step through seeds one at a time |
| Random | Jump to a random seed (1–999,999) |
| Jump | Apply the seed currently typed in the input |

Changing the seed resets the simulation completely — new agent positions, new food source placement, and a fresh trail map.

## Colony Parameters

These control the agents themselves — how many, how fast, and how they navigate.

### Agent Count
- **Range:** 500 – 8,000
- **Default:** 6,000
- **Sweet spot:** 4,000 – 7,000
- Sparse below 4,000, sluggish above 7,000. Higher counts produce denser, more intricate networks but reduce performance.

### Speed
- **Range:** 0.5 – 30.0
- **Default:** 2.8
- **Sweet spot:** 2.0 – 3.5
- Controls how far each agent moves per frame. Low values create slow, deliberate crawling. High values cause chaotic scattering.

### Sensor Distance
- **Range:** 5 – 40
- **Default:** 22
- **Sweet spot:** 15 – 30
- How far ahead each agent "looks" to sense chemical trails. Short distance creates tight spirals, long distance creates blobby structures.

### Sensor Angle
- **Range:** 10 – 80 degrees
- **Default:** 40
- **Sweet spot:** 30 – 55
- The angle between the agent's forward direction and its side sensors. Narrow angles produce straight hyphae (thread-like structures), wide angles produce noisy growth.

### Turn Speed
- **Range:** 5 – 60 degrees
- **Default:** 20
- **Sweet spot:** 12 – 30
- Maximum turning rate per frame. Low values create stiff, angular paths. High values create jittery movement.

## Chemistry Parameters

These control the chemical trail system that agents use to communicate.

### Deposit Strength
- **Range:** 5 – 80
- **Default:** 12
- **Sweet spot:** 8 – 20
- How much chemical each agent deposits per frame. Low values create invisible trails, high values create thick blobs.

### Decay Rate
- **Range:** 0.900 – 0.999
- **Default:** 0.965
- **Sweet spot:** 0.955 – 0.985
- Multiplier applied to all trail values each frame. Lower values cause trails to vanish quickly. Higher values (closer to 1.0) cause trails to persist and fill the canvas solid.

### Diffusion
- **Range:** 0.0 – 1.0
- **Default:** 0.25
- **Sweet spot:** 0.1 – 0.4
- How much chemical spreads to neighboring cells each frame (via 3x3 box blur). At 0, trails are pixel-sharp. Above 0.6, everything becomes blurry mush.

## Environment Parameters

These control the world the agents inhabit.

### Nutrient Sources
- **Range:** 0 – 20
- **Default:** 12
- **Sweet spot:** 6 – 15
- Number of food attractors placed randomly around the canvas. Set to 0 for pure radial growth from center. Too many creates a cluttered pattern.

### Nutrient Strength
- **Range:** 0 – 50
- **Default:** 15
- **Sweet spot:** 8 – 25
- How strongly food sources attract nearby agents. High values cause agents to clump at nutrient sites.

### Spawn Radius
- **Range:** 5 – 100
- **Default:** 20
- **Sweet spot:** 5 – 25
- Radius of the initial spawn area. Tight values (5–15) produce a clean burst point. Wide values create a diffuse start.

## Rendering Parameters

These affect how the simulation is displayed, without changing the underlying behavior.

### Trail Brightness
- **Range:** 0.3 – 3.0
- **Default:** 1.8
- **Sweet spot:** 1.2 – 2.5
- Multiplier for how bright the chemical trails appear. Too dim below 1.0, blown out above 2.5.

### Agent Glow
- **Range:** 0.0 – 2.0
- **Default:** 0.5
- **Sweet spot:** 0.2 – 0.8
- Brightness of the individual agent dots. At 0, agents are invisible (only trails show). High values create distracting sparkle. Agents glow brighter at the frontier (unexplored areas).

### Cursor Influence
- **Range:** 0 – 500
- **Default:** 0 (off)
- **Sweet spot:** 0 for recording, 100–300 for interactive play
- Radius within which the mouse cursor attracts agents. Set to 0 when recording to avoid unintentional influence.

## Colors

### Presets

Eight built-in color presets are available via buttons:

| Preset | Trail Base | Trail Bright | Hub / Hot |
|--------|-----------|-------------|-----------|
| Shumi Gold | #1A1408 | #D4A84B | #D97757 |
| Emerald | #061A0A | #2ECC71 | #1ABC9C |
| Violet | #0D0815 | #9B59B6 | #E74C8B |
| Ice | #060D1A | #5DADE2 | #AED6F1 |
| Ember | #1A0A04 | #E74C3C | #F39C12 |
| Toxic | #0A1A04 | #39FF14 | #BFFF00 |
| Rose | #1A0810 | #E91E63 | #FF6F91 |
| Mono | #0D0D0D | #CCCCCC | #FFFFFF |

### Custom Colors

Three color pickers allow full customization:

- **Trail Base** — The darkest color, used for faint trails and background tint
- **Trail Bright** — The main trail color, used for well-established paths
- **Hub / Hot** — The accent color, used for the center hub glow and high-intensity areas

The rendering engine interpolates between these three stops based on trail intensity and distance from the center hub.

## Reset

Click **Reset All Parameters** to restore every slider and color to its default value.
