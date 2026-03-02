# How It Works

The Physarum Generator implements an agent-based simulation inspired by the real behavior of Physarum polycephalum (slime mold).

## The Algorithm

Each frame, the simulation performs these steps:

### 1. Spawn New Agents

Agents continuously birth from the central hub (50 per frame) until the agent count cap is reached. This creates the characteristic "growth from center" effect.

### 2. Agent Update (x4 per frame)

Each agent performs the classic physarum sense-turn-move cycle four times per frame for faster visible growth:

**Sense:** The agent reads trail values at three positions ahead of it:
- Center (straight ahead at `sensorDist` pixels)
- Left (at `sensorDist` pixels, offset by `-sensorAngle`)
- Right (at `sensorDist` pixels, offset by `+sensorAngle`)

**Turn:** Based on what it senses:
- If center is strongest → keep going straight
- If both sides stronger than center → randomly turn left or right
- If left is strongest → turn left by `turnSpeed` degrees
- If right is strongest → turn right by `turnSpeed` degrees
- A tiny random jitter is always added for organic feel

**Food attraction:** If near a nutrient source (within 3x its radius), the agent turns toward it proportionally.

**Cursor influence:** If enabled, agents near the mouse cursor also turn toward it.

**Move:** The agent advances by `speed` pixels in its current heading direction.

**Deposit:** The agent adds `deposit` amount of chemical to the trail map at its current position.

**Wrap:** Agents wrap around canvas edges (toroidal topology).

### 3. Diffuse and Decay

The trail map is processed:
- **Diffusion:** Each cell blends with its 8 neighbors via a 3x3 box blur, controlled by the `diffusion` parameter
- **Decay:** All values are multiplied by the `decay` rate

This is implemented as a double-buffered operation for correctness.

### 4. Replenish Food

Every 30 frames, food sources re-deposit small amounts of chemical at their positions, maintaining them as persistent attractors.

### 5. Render

Three layers are drawn:
1. **Trail map** — The chemical concentration visualized as a color gradient (pixel-by-pixel rendering)
2. **Agent glow** — Individual agent dots with additive blending (brighter at the frontier)
3. **Hub glow** — Pulsing center hub with micro-strokes

## Data Structures

- **Trail map** — `Float32Array(width * height)` storing chemical concentration per pixel
- **Agents** — Array of `{x, y, heading}` objects
- **Foods** — Array of `{x, y, radius, strength}` attractor objects

## Rendering Pipeline

The trail map is rendered per-pixel using three-stop color interpolation:

1. Trail intensity (0–1) maps between Base → Bright colors
2. Distance from center hub adds a Hot color accent
3. Agent glow uses additive blending for frontier brightness

## Why It Looks Like Real Mycelium

The emergent network structure arises because:

- Agents follow existing trails (positive feedback)
- Trails decay over time (negative feedback)
- Multiple agents competing for the same trails creates branching
- Food sources create directional growth targets
- The balance between deposit and decay determines network density

This is essentially the same mechanism real slime molds use: chemical signaling via trail pheromones.
