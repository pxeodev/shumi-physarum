# Tips & Recipes

Parameter combinations and workflow tips across all three simulators.

---

## General Tips

### Performance
- Chrome gives the best canvas rendering performance
- The Stencil's Web Worker architecture performs best in Chrome (requires `OffscreenCanvas`)
- Cell counts above 7,000 in the Generator may slow down on older hardware
- GIF encoding is CPU-intensive — larger sizes take longer
- The simulation runs 4 physics steps per frame for visible growth speed

### Recording
- **Always** set Cursor Influence to 0 in the Generator before recording
- Let the swarm grow 3–5 seconds before PNG capture for a developed network
- For video loops, 15–30 second clips give the most growth
- In the Stencil, the watermark (seed number) is included in recordings

### Colors
- Dark base colors (near black) give the best contrast in all simulators
- The Generator's Mono palette is useful as a starting point for post-processing
- In the Stencil/Masked, seed-based color drift means adjacent seeds in the same palette family still look unique

---

## Generator Recipes

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
Long, elegant reaching paths with minimal branching.

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
Clean explosion from center — symmetrical, meditative.

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
Bold, bright paths — high-energy, maximum presence.

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
Optimized for cursor play.

| Parameter | Value |
|-----------|-------|
| Cell Count | 5,000 |
| Speed | 3.0 |
| Cursor Influence | 200 |
| Cell Glow | 1.0 |
| Signal Deposit | 15 |
| Signal Decay | 0.955 |

### Avatar-Ready (GIF Export)
Optimized for small looping animated avatars.

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

---

## Stencil Recipes

### Dramatic Entrance
Maximize the blast-on-load reveal effect.

1. Set Master Opacity to **0.8** or higher
2. Use Mode **1 (Ramp)** for maximum ASCII contrast
3. Press **Space** to re-trigger the blast at any time
4. Record during the blast for a dramatic reveal clip

### Sharp Edge Definition
Make the mascot boundary crisp and well-defined.

| Setting | Value |
|---------|-------|
| Edge Strong | 0.45 |
| Edge Weak | 0.08 |
| Edge Fade Depth | 20 |
| Dark Edge Boost | 3.5 |

### Subtle Background Presence
Soft mascot with dominant background swarm.

| Setting | Value |
|---------|-------|
| Master Opacity | 0.15 |
| BG Trail Brightness | 2.0 |
| BG Agent Count | 12,000 |
| Mode | 3 (Mold) |

### LP Mode for Embedding
Use the Stencil as a hero background:

```
https://yourdomain.github.io/shumi-physarum/stencil.html?lp&seed=60
```

The `?lp` flag hides all UI and positions the mascot for iframe embedding. Add `&es=0.57&ew=0.28` to customize edge parameters.

### Shareable Compositions
1. Dial in your ideal settings
2. Click **Share** to copy the URL
3. The URL encodes seed, mode, master opacity, and edge settings
4. Recipients see the exact same composition

---

## Masked Recipes

### Finding Specific Textures
Since the Masked auto-selects textures by seed, use this guide to target specific looks:

| Texture | Seeds (first 64) |
|---------|-------------------|
| Standard | 0–7 |
| Crystalline | 8–15 |
| Smoke | 16–23 |
| Coral | 24–31 |
| Silk | 32–39 |
| Electric | 40–47 |
| Flow | 48–55 |
| Spore | 56–63 |

Pattern: `texture = TEXTURE_NAMES[Math.floor(seed / 8) % 8]`

### Finding Specific Palettes
Within any texture group, palettes cycle every seed:

| Palette | Seeds (within any group of 8) |
|---------|-------------------------------|
| Ember | 0, 8, 16, 24, 32, 40, 48, 56 |
| Frost | 1, 9, 17, 25, 33, 41, 49, 57 |
| Moss | 2, 10, 18, 26, 34, 42, 50, 58 |
| Pearl | 3, 11, 19, 27, 35, 43, 51, 59 |
| Bloom | 4, 12, 20, 28, 36, 44, 52, 60 |
| Honey | 5, 13, 21, 29, 37, 45, 53, 61 |
| Tide | 6, 14, 22, 30, 38, 46, 54, 62 |
| Rust | 7, 15, 23, 31, 39, 47, 55, 63 |

Pattern: `palette = PALETTES[seed % 8]`

### Ghost Afterimage Timing
The ghost layer appears on each new seed and fades over ~4 seconds. For the best PNG captures, wait until the ghost has fully faded and the physarum trails have replaced it.

---

## Export Format Guide

| Format | Best For | Typical Size | Available In |
|--------|----------|-------------|--------------|
| **PNG** | Static avatars, print, social posts | 1–3 MB | All three |
| **WebM** | Hero backgrounds, looping video | 5–20 MB / 15s | All three |
| **GIF** | Animated avatars, chat profiles | 0.5–5 MB | Generator only |
| **Fullscreen 1080p** | Website hero sections, cinematic | 10–30 MB / 15s | Generator only |
| **Share URL** | Reproducible compositions | — | Stencil only |
