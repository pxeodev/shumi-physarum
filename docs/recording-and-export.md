# Recording & Export

The generator supports multiple export formats for different use cases.

## PNG Snapshot

Click **Save PNG** to capture the current canvas frame as a PNG image.

- File name: `shumi-physarum-{seed}.png`
- Resolution matches the current canvas size
- Best for: static backgrounds, social media posts, print

## WebM Video Recording

Click **Record WebM** to start recording the live simulation.

- Records at 60 FPS with VP9 codec (falls back to VP8 if unsupported)
- Bitrate: 8 Mbps for high quality
- Click **Stop Recording** to end and download the file
- File name: `shumi-physarum-{seed}.webm`
- Best for: hero backgrounds, looping videos, social media content

**Tip:** Set **Cursor Influence** to 0 before recording to avoid accidental mouse effects.

## Animated GIF Export

The GIF exporter captures frames from the live simulation, center-crops to a square, and encodes them into a looping GIF.

### Settings

| Setting | Range | Default | Notes |
|---------|-------|---------|-------|
| Size | 128 – 720 px | 256px | Square output |
| Duration | 2 – 15 seconds | 4s | Shorter = smaller file |
| FPS | 8 – 30 | 16 | Sweet spot 12–20 |

### Size Presets

- **128 x 128** — Favicon or tiny embeds
- **256 x 256** — Avatar or profile picture
- **480 x 480** — Profile picture (high res)
- **720 x 720** — Social media post

### Usage

1. Get the simulation to a frame you like (let it grow a few seconds)
2. Set your desired size, duration, and FPS
3. Click **Export GIF**
4. Wait for frame capture, then GIF encoding
5. The file downloads automatically

The GIF is center-cropped from the canvas, so the spawn hub will be visible in the frame.

## Fullscreen 1080p Recording

Click **Fullscreen Record (1080p)** for professional-quality output.

- Hides the sidebar and resizes to 1080 x 1080
- Spawn point stays at 35% from top (designed for landing page hero backgrounds)
- Uses the clip length set in the Recording Studio section
- When finished, the UI restores and the file downloads
- Best for: website hero sections, presentation backgrounds

## Recording Studio

The Recording Studio section provides advanced recording workflows.

### Seed Preview (Audition)

1. Click **Preview Seeds** to start cycling through random seeds
2. Each seed plays for 4 seconds, then auto-advances
3. Press **Space** to bookmark the current seed (max 10)
4. The canvas border flashes green when a seed is bookmarked
5. Click **Stop Preview** when done
6. Bookmarked seeds appear as clickable links below

### Batch Recording

After bookmarking seeds via Preview:

1. Set the desired **Clip Length** (5–60 seconds per seed)
2. Click **Batch Record Bookmarks**
3. Each bookmarked seed is recorded sequentially in fullscreen 1080p
4. Files download one by one as each clip finishes
5. Status updates show progress

This workflow is ideal for producing multiple hero background videos in one session.
