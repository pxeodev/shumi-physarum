# Recording & Export

Capture your swarm pattern in multiple formats — for avatars, hero backgrounds, profile pictures, or social content.

## PNG Snapshot

Click **Save PNG** to capture the current frame.

- **File:** `shumi-physarum-{seed}.png`
- **Resolution:** Matches current canvas size
- **Best for:** Static backgrounds, social posts, print-ready assets

**Tip:** Let the swarm grow for 3–5 seconds before capturing for a fully developed network.

## WebM Video

Click **Record WebM** to start recording the live swarm.

- **Codec:** VP9 at 60 FPS (falls back to VP8 if unsupported)
- **Bitrate:** 8 Mbps for high-quality output
- **File:** `shumi-physarum-{seed}.webm`
- **Best for:** Hero backgrounds, looping videos, social content

Click **Stop Recording** to end and download.

**Important:** Set **Cursor Influence** to 0 before recording to avoid accidental mouse interference.

### Converting WebM to MP4

```bash
ffmpeg -i shumi-physarum-12345.webm -c:v libx264 -crf 18 output.mp4
```

## Animated GIF

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
| **128 x 128** | Favicon, tiny embed, chat avatar |
| **256 x 256** | Standard avatar, profile picture |
| **480 x 480** | High-res profile, thumbnail |
| **720 x 720** | Social media post, full-size asset |

### How to Export

1. Let the swarm grow to a frame you like
2. Set size, duration, and FPS
3. Click **Export GIF**
4. Wait for capture + encoding (progress shown)
5. File downloads automatically

## Fullscreen 1080p Recording

Click **Fullscreen Record (1080p)** for cinematic quality.

- Hides the sidebar, resizes canvas to 1080 x 1080
- Hub stays at 35% from top (designed for hero backgrounds)
- Uses the clip length from the Recording Studio section
- UI restores automatically when done
- **Best for:** Website hero sections, presentations, brand assets

## Recording Studio

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

This workflow produces multiple hero backgrounds in a single session — ideal for content creators or for choosing between several candidate swarm identities.

## Browser Compatibility

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| Live swarm | Yes | Yes | Yes | Yes |
| WebM recording | Yes | Yes | No* | Yes |
| GIF export | Yes | Yes | Yes | Yes |

*Safari doesn't support MediaRecorder with WebM. Use GIF export or screen recording instead.
