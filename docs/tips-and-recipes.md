# Tips & Recipes

Practical tips and parameter combinations for common use cases.

## General Tips

### Performance
- Chrome delivers the best performance for canvas rendering
- Agent counts above 7,000 may slow down on older hardware
- GIF encoding is CPU-intensive — be patient with large sizes
- The simulation runs 4 physics steps per frame for visible growth speed

### Recording
- Always set **Cursor Influence** to 0 before recording
- Let the simulation grow for 2–3 seconds before exporting PNG for a developed network
- For video loops, longer clips (15–30s) give more growth to work with
- The seed label always appears in the bottom-left corner of recordings

### Color
- Dark base colors (near black) give the best contrast
- Monochrome preset is useful as a neutral starting point for post-processing
- The Trail Bright color dominates the visual — choose it carefully

## Recipes

### Dense, Intricate Web
A tight, detailed network with many fine branches.

| Parameter | Value |
|-----------|-------|
| Agent Count | 7,000 |
| Speed | 2.0 |
| Sensor Distance | 18 |
| Sensor Angle | 45 |
| Turn Speed | 15 |
| Deposit | 10 |
| Decay | 0.975 |
| Diffusion | 0.15 |
| Nutrient Sources | 8 |

### Sparse Tendrils
Long, elegant reaching paths with minimal branching.

| Parameter | Value |
|-----------|-------|
| Agent Count | 3,000 |
| Speed | 3.5 |
| Sensor Distance | 30 |
| Sensor Angle | 25 |
| Turn Speed | 10 |
| Deposit | 15 |
| Decay | 0.960 |
| Diffusion | 0.10 |
| Nutrient Sources | 4 |

### Radial Burst
Clean radial explosion with no food source interference.

| Parameter | Value |
|-----------|-------|
| Agent Count | 6,000 |
| Speed | 2.8 |
| Sensor Distance | 22 |
| Sensor Angle | 40 |
| Turn Speed | 20 |
| Deposit | 12 |
| Decay | 0.965 |
| Diffusion | 0.25 |
| Nutrient Sources | 0 |

### Thick, Glowing Vines
Bold, bright paths that fill more of the canvas.

| Parameter | Value |
|-----------|-------|
| Agent Count | 5,000 |
| Speed | 2.5 |
| Sensor Distance | 15 |
| Sensor Angle | 50 |
| Turn Speed | 25 |
| Deposit | 30 |
| Decay | 0.985 |
| Diffusion | 0.40 |
| Trail Brightness | 2.5 |
| Nutrient Sources | 15 |

### Interactive Play
Settings optimized for real-time cursor interaction.

| Parameter | Value |
|-----------|-------|
| Agent Count | 5,000 |
| Speed | 3.0 |
| Cursor Influence | 200 |
| Agent Glow | 1.0 |
| Deposit | 15 |
| Decay | 0.955 |

Move your mouse slowly across the canvas to guide the network growth. Agents will follow your cursor and build trails along your path.

## File Formats

### When to Use Each Format

| Format | Best For | File Size |
|--------|----------|-----------|
| PNG | Static backgrounds, print, social posts | 1–3 MB |
| WebM | Hero videos, looping backgrounds, presentations | 5–20 MB per 15s |
| GIF | Avatars, favicons, inline embeds, chat reactions | 0.5–5 MB |

### Converting WebM

WebM files can be converted to MP4 or other formats using FFmpeg:

```bash
ffmpeg -i shumi-physarum-12345.webm -c:v libx264 -crf 18 output.mp4
```

## Browser Compatibility

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| Simulation | Yes | Yes | Yes | Yes |
| WebM Recording | Yes | Yes | No* | Yes |
| GIF Export | Yes | Yes | Yes | Yes |
| VP9 Codec | Yes | Yes | No | Yes |

*Safari does not support MediaRecorder with WebM. Use GIF export or screen recording software instead.
