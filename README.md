# Shumi Physarum

Interactive Physarum (slime mold) transport network simulator with gold/amber color palette. Built with p5.js.

## Features

- **Real-time simulation** — Physarum polycephalum agent-based model with chemical trails, diffusion, and decay
- **Seed system** — Deterministic seeds for reproducible patterns. Randomize or bookmark favorites
- **Full parameter control** — Agent count, speed, sensor distance/angle, turn speed, deposit, decay, diffusion, food sources, trail brightness, agent glow
- **Custom color palette** — Three-stop gradient (background, primary trail, accent)
- **Cursor influence** — Mouse interaction attracts or repels agents
- **Recording** — Record individual seeds or batch-record bookmarked seeds as WebM video
- **Fullscreen recording** — Records at 1920x1080 with spawn point at 35% from top (designed for landing page hero backgrounds)
- **Birth-to-maturity growth** — Simulation starts from a single spawn point and grows outward

## Usage

Open `index.html` in a browser. No build step required.

**Or use GitHub Pages** — enable Pages on the repo and visit the published URL.

### Controls

- **Sidebar sliders** — Adjust all simulation parameters in real time
- **Seed input** — Enter a specific seed or click Randomize
- **Bookmark** — Save seeds you like for batch recording later
- **Record** — Capture the current simulation as WebM video
- **Fullscreen Record** — Hide sidebar and record at full 1920x1080
- **Batch Record** — Automatically record all bookmarked seeds sequentially

## Tech

Single-file HTML application using:
- [p5.js](https://p5js.org/) for canvas rendering
- Canvas `captureStream()` + `MediaRecorder` API for video capture
- No dependencies beyond p5.js (loaded from CDN)

## License

MIT
