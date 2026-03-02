# Stencil Mode

Stencil mode (`stencil.html`) is a separate page that layers the physarum simulation behind artwork, creating masked compositions where the mycelial network grows behind and around a centered image.

## What is Stencil Mode?

Instead of showing the raw simulation, stencil mode:

1. Runs the physarum simulation as a fullscreen background
2. Overlays a centered mascot/artwork image on top
3. Adds chromatic aberration effects and subtle animations
4. Creates a ghost/afterimage "retinal burn" effect

The result is an animated landing page where organic mycelial networks grow behind your branding or artwork.

## How to Use

1. Open `stencil.html` in a browser
2. The physarum simulation starts automatically in the background
3. The mascot artwork fades in with an entrance animation
4. The simulation seed is randomized on each load

## Customizing

### Changing the Artwork

Replace the `shumi.webp` file with your own image. The image is centered on the viewport and displayed at a fixed size.

### Simulation Parameters

The stencil worker (`stencil-worker.js`) runs the physarum simulation off the main thread for smooth performance. Parameters are configured in the worker file.

### Visual Effects

Stencil mode includes several CSS-driven effects:

- **Chromatic orbit** — RGB channel separation that rotates around the artwork
- **Breathing animation** — Subtle scale pulsing
- **Ghost layer** — A faded afterimage that appears and disappears
- **Resurface layer** — A persistent full-color base image

Mobile devices get lighter effects (smaller offsets, no background chromatic) for performance.

## Use Cases

- **Landing pages** — Hero section with animated mycelial background
- **Profile pages** — Animated avatar with organic backdrop
- **Presentations** — Full-screen animated title slides
- **Social media** — Record the page for animated content

## Demo Page

The `demo.html` file shows a complete landing page layout that embeds the physarum simulation as a hero background via an iframe. This demonstrates how to integrate the generator into a real website design.
