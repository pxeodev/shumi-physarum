# Tips & Recipes

Parameter combinations for specific swarm aesthetics, plus practical workflow tips.

## General Tips

### Performance
- Chrome gives the best canvas rendering performance
- Cell counts above 7,000 may slow down on older hardware
- GIF encoding is CPU-intensive — larger sizes take longer
- The simulation runs 4 physics steps per frame for visible growth speed

### Recording
- **Always** set Cursor Influence to 0 before recording
- Let the swarm grow 3–5 seconds before PNG capture for a developed network
- For video loops, 15–30 second clips give the most growth
- The seed label always appears in the bottom-left corner

### Palette
- Dark base colors (near black) give the best contrast
- The Mono palette is useful as a starting point for post-processing
- Signal Bright dominates the visual — choose it first when making custom palettes

## Recipes

### Dense Neural Web
A tight, intricate network with fine branching — the classic Shumi look.

| Parameter | Value |
|-----------|-------|
| Cell Count | 7,000 |
| Speed | 2.0 |
| Sensor Distance | 18 |
| Sensor Angle | 45° |
| Turn Speed | 15° |
| Signal Deposit | 10 |
| Signal Decay | 0.975 |
| Diffusion | 0.15 |
| Attractors | 8 |

### Sparse Tendrils
Long, elegant reaching paths with minimal branching — a more refined, selective topology.

| Parameter | Value |
|-----------|-------|
| Cell Count | 3,000 |
| Speed | 3.5 |
| Sensor Distance | 30 |
| Sensor Angle | 25° |
| Turn Speed | 10° |
| Signal Deposit | 15 |
| Signal Decay | 0.960 |
| Diffusion | 0.10 |
| Attractors | 4 |

### Pure Radial Burst
Clean explosion from center with no attractor interference — a symmetrical, meditative pattern.

| Parameter | Value |
|-----------|-------|
| Cell Count | 6,000 |
| Speed | 2.8 |
| Sensor Distance | 22 |
| Sensor Angle | 40° |
| Turn Speed | 20° |
| Signal Deposit | 12 |
| Signal Decay | 0.965 |
| Diffusion | 0.25 |
| Attractors | 0 |

### Thick Luminous Vines
Bold, bright paths that fill the canvas — high-energy, maximum presence.

| Parameter | Value |
|-----------|-------|
| Cell Count | 5,000 |
| Speed | 2.5 |
| Sensor Distance | 15 |
| Sensor Angle | 50° |
| Turn Speed | 25° |
| Signal Deposit | 30 |
| Signal Decay | 0.985 |
| Diffusion | 0.40 |
| Trail Brightness | 2.5 |
| Attractors | 15 |

### Interactive Exploration
Optimized for real-time cursor play — guide the swarm with your mouse.

| Parameter | Value |
|-----------|-------|
| Cell Count | 5,000 |
| Speed | 3.0 |
| Cursor Influence | 200 |
| Cell Glow | 1.0 |
| Signal Deposit | 15 |
| Signal Decay | 0.955 |

Move slowly across the canvas to guide network growth. Cells follow your cursor and build signal trails along your path.

### Avatar-Ready (GIF Export)
Optimized for small, looping animated avatars.

| Parameter | Value |
|-----------|-------|
| Cell Count | 5,000 |
| Speed | 2.5 |
| Signal Deposit | 14 |
| Signal Decay | 0.970 |
| Trail Brightness | 2.0 |
| Cell Glow | 0.3 |
| Attractors | 6 |
| **GIF Size** | 256px |
| **GIF Duration** | 4s |
| **GIF FPS** | 16 |

## Export Format Guide

| Format | Best For | Typical Size |
|--------|----------|-------------|
| **PNG** | Static avatars, print, social posts | 1–3 MB |
| **WebM** | Hero backgrounds, looping video, presentations | 5–20 MB / 15s |
| **GIF** | Animated avatars, chat profiles, inline embeds | 0.5–5 MB |
| **Fullscreen 1080p** | Website hero sections, cinematic brand assets | 10–30 MB / 15s |
