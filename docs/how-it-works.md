# How the Swarm Works

The Shumi Swarm Generator uses an agent-based simulation inspired by biological transport networks. Thousands of simple cells, following basic rules, produce complex emergent intelligence.

## The Core Loop

Each frame, the swarm executes this cycle:

### 1. Spawn New Cells

Cells continuously emerge from the central intelligence hub (50 per frame) until the population cap is reached. This creates the characteristic growth-from-center effect — the swarm expanding outward like a living network.

### 2. Cell Update (×4 per frame)

Each cell performs the **sense → turn → move → deposit** cycle four times per frame for visible growth speed.

**Sense:** Each cell reads signal values at three positions ahead of it:
- **Center** — Straight ahead at `sensorDist` pixels
- **Left** — Offset by `-sensorAngle` degrees
- **Right** — Offset by `+sensorAngle` degrees

**Turn:** Based on what it senses:
- If center signal is strongest → keep going straight
- If both sides are stronger → randomly pick left or right
- If left is stronger → turn left
- If right is stronger → turn right
- A tiny random jitter is always added for organic texture

**Attract:** If near an attractor (within 3× its radius), the cell turns toward it proportionally. If cursor influence is enabled, cells near the mouse also respond.

**Move:** The cell advances by `speed` pixels in its current heading.

**Deposit:** The cell drops `deposit` units of signal at its position.

**Wrap:** Cells that leave one edge appear on the opposite side (toroidal topology).

### 3. Signal Processing

The signal map is processed every frame:
- **Diffusion** — Each cell's signal blends with its 8 neighbors via box blur
- **Decay** — All values multiply by the decay rate

This double-buffered operation creates the fading trail effect and prevents signal buildup.

### 4. Attractor Refresh

Every 30 frames, attractors re-deposit small signal amounts at their positions, keeping them as persistent targets for the swarm.

### 5. Render

Three visual layers compose the final frame:
1. **Signal map** — Chemical concentration rendered pixel-by-pixel through the three-stop color gradient
2. **Cell glow** — Individual cell dots with additive blending (brighter at the frontier)
3. **Hub pulse** — Animated center glow with micro-strokes

## Why It Looks Alive

The emergent network structure arises from simple feedback:

- **Positive feedback** — Cells follow existing signals, reinforcing popular paths
- **Negative feedback** — Signals decay over time, pruning unused routes
- **Competition** — Multiple cells vying for the same signals creates branching
- **Attractors** — External targets create directional growth, pulling the network toward goals
- **Balance** — The tension between deposit rate and decay rate determines network density

No cell knows the big picture. Each one just follows local signals. The intelligence emerges from the collective — which is exactly how the Shumi agents operate.

## Data Structures

| Structure | Type | Purpose |
|-----------|------|---------|
| Signal map | `Float32Array(W × H)` | Chemical concentration per pixel |
| Cells | Array of `{x, y, heading}` | Individual swarm members |
| Attractors | Array of `{x, y, radius, strength}` | Environmental targets |

## The Rendering Pipeline

The signal map is rendered per-pixel:

1. Signal intensity (0–1) interpolates between **Base → Bright** colors
2. Distance from hub blends in the **Accent** color
3. Cell glow uses additive blending — brighter at unexplored frontiers
4. The hub pulses with micro-strokes for a living center point
