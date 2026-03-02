# Recording & Export

All three simulators support PNG snapshots and WebM video recording. The Generator adds GIF export, fullscreen 1080p capture, and batch recording.

---

## Export Comparison

| Feature | Generator | Stencil | Masked |
|---------|-----------|---------|--------|
| **Save PNG** | Yes | Yes | Yes |
| **Record WebM** | Yes | Yes | Yes |
| **Export GIF** | Yes | — | — |
| **Fullscreen 1080p** | Yes | — | — |
| **Batch Record** | Yes | — | — |
| **Share URL** | — | Yes | — |

---

## PNG Snapshot

Available in all three simulators via the **Save PNG** button.

- **File:** `shumi-physarum-{seed}.png`
- **Resolution:** Matches current canvas size
- **Best for:** Static backgrounds, social posts, print-ready assets

**Tip:** Let the swarm grow 3–5 seconds before capturing for a fully developed network.

### Stencil & Masked Compositing

In the Stencil and Masked, PNG capture composites all visible layers (background swarm, ghost afterimage, mascot physarum) into a single image — what you see is what you get.

---

## WebM Video

Available in all three simulators via the **● Record** button.

- **Codec:** VP9 at 60 FPS (falls back to VP8 if unsupported)
- **Bitrate:** 8 Mbps for high-quality output
- **File:** `shumi-physarum-{seed}.webm`
- **Best for:** Hero backgrounds, looping videos, social content

Click the button once to start, again to stop and download.

**Important (Generator):** Set **Cursor Influence** to 0 before recording to avoid mouse interference.

### Converting WebM to MP4

```bash
ffmpeg -i shumi-physarum-12345.webm -c:v libx264 -crf 18 output.mp4
```

---

## Animated GIF (Generator Only)

The GIF exporter captures the live swarm, center-crops to a square, and encodes a looping animation.

### Settings

| Setting | Range | Default | Notes |
|---------|-------|---------|-------|
| Size | 128 – 720 px | 256px | Square output — perfect for avatars |
| Duration | 2 – 15 seconds | 4s | Shorter = smaller file size |
| FPS | 8 – 30 | 16 | Sweet spot 12–20 |

### Size Guide

| Size | Use Case |
|------|----------|
| **128 × 128** | Favicon, tiny embed, chat avatar |
| **256 × 256** | Standard avatar, profile picture |
| **480 × 480** | High-res profile, thumbnail |
| **720 × 720** | Social media post, full-size asset |

### How to Export

1. Let the swarm grow to a frame you like
2. Set size, duration, and FPS
3. Click **Export GIF**
4. Wait for capture + encoding (progress shown)
5. File downloads automatically

---

## Fullscreen 1080p Recording (Generator Only)

Click **Fullscreen Record (1080p)** for cinematic quality.

- Hides the sidebar, resizes canvas to 1080 × 1080
- Hub stays at 35% from top (designed for hero backgrounds)
- Uses the clip length from the Recording Studio section
- UI restores automatically when done
- **Best for:** Website hero sections, presentations, brand assets

---

## Recording Studio (Generator Only)

### Seed Preview (Audition)

The fastest way to find your perfect swarm:

1. Click **Preview Seeds** — random seeds cycle every 4 seconds
2. Press **Space** to bookmark the current seed (max 10)
3. Canvas border flashes green on bookmark
4. Click **Stop Preview** when done
5. Bookmarked seeds appear as clickable links

### Batch Recording

After bookmarking seeds:

1. Set **Clip Length** (5–60 seconds per seed)
2. Click **Batch Record Bookmarks**
3. Each seed records sequentially in fullscreen 1080p
4. Files download one by one as each clip finishes

---

## Share URL (Stencil Only)

The Stencil's **Share** button copies a URL to clipboard that encodes the current seed, formation mode, and key stencil settings. See [The Stencil](stencil.md) for details on which parameters are encoded.

---

## Browser Compatibility

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| Live swarm | Yes | Yes | Yes | Yes |
| WebM recording | Yes | Yes | No* | Yes |
| GIF export | Yes | Yes | Yes | Yes |
| OffscreenCanvas (Stencil Worker) | Yes | Yes | No | Yes |

*Safari doesn't support MediaRecorder with WebM. Use GIF export or screen recording instead.
