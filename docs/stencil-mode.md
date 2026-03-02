# Stencil Mode

Stencil mode layers the swarm behind artwork — creating compositions where the network grows behind and around a centered image. This is how the Shumi agent avatars get their signature look.

## What It Does

![Shumi Stencil](https://raw.githubusercontent.com/haddencarpenter/shumi-physarum/main/shumi.webp)

Instead of showing the raw swarm, stencil mode:

1. Runs the swarm simulation as a fullscreen background
2. Centers your artwork (mascot, logo, avatar) on top
3. Adds chromatic aberration effects and breathing animation
4. Creates a ghost afterimage — a retinal-burn echo of the image

The result is an animated composition where organic signal networks grow behind your visual identity.

## How to Use

1. Open `stencil.html` in a browser
2. The swarm starts automatically in the background
3. The artwork fades in with an entrance animation
4. Seed is randomized on each load

## Customizing

### Changing the Artwork

Replace `shumi.webp` with your own image. The image is centered on the viewport at a fixed size.

### Swarm Parameters

The stencil worker (`stencil-worker.js`) runs the swarm off the main thread for smooth 60fps performance. Parameters are configured within the worker.

### Visual Effects

Stencil mode includes several CSS-driven layers:

| Effect | Description |
|--------|-------------|
| **Chromatic orbit** | RGB channel separation that rotates around the artwork |
| **Breathing** | Subtle scale pulse animation |
| **Ghost layer** | Faded afterimage that appears and disappears |
| **Resurface layer** | Persistent full-color base image beneath the animation |

Mobile devices automatically get lighter effects (smaller offsets, no background chromatic) for performance.

## Use Cases

- **Agent avatars** — The primary way Shumi agents are visualized
- **Landing pages** — Hero section with animated swarm background
- **Profile pages** — Animated avatar with organic backdrop
- **Presentations** — Full-screen animated title slides
- **Social content** — Record the page for animated posts

## Demo Page

`demo.html` shows a complete landing page that embeds the swarm as a hero background via iframe — a working example of how to integrate the generator into a real website.
