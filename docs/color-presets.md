# Color Presets

The generator includes 8 built-in color presets. Each preset defines three color stops that the rendering engine interpolates between.

## How Colors Work

Every pixel on the canvas is colored using a three-stop gradient:

1. **Trail Base** — Applied to faint trails and low-intensity areas
2. **Trail Bright** — Applied to well-established, high-traffic paths
3. **Hub / Hot** — Blended into areas near the center hub and at maximum intensity

The trail intensity (0–1) determines the interpolation point. Distance from the center hub adds a warm accent via the Hub/Hot color.

## Available Presets

### Shumi Gold (Default)
The signature look — warm amber trails on a dark canvas with orange accents.
- Base: `#1A1408` | Bright: `#D4A84B` | Hot: `#D97757`

### Emerald
Lush green network reminiscent of bioluminescent organisms.
- Base: `#061A0A` | Bright: `#2ECC71` | Hot: `#1ABC9C`

### Violet
Purple-pink mycelial glow.
- Base: `#0D0815` | Bright: `#9B59B6` | Hot: `#E74C8B`

### Ice
Cool blue network, subtle and ethereal.
- Base: `#060D1A` | Bright: `#5DADE2` | Hot: `#AED6F1`

### Ember
Fire and lava — red trails with golden hotspots.
- Base: `#1A0A04` | Bright: `#E74C3C` | Hot: `#F39C12`

### Toxic
Neon green sci-fi aesthetic.
- Base: `#0A1A04` | Bright: `#39FF14` | Hot: `#BFFF00`

### Rose
Pink-magenta palette for softer, organic compositions.
- Base: `#1A0810` | Bright: `#E91E63` | Hot: `#FF6F91`

### Mono
Grayscale — useful as a neutral base for post-processing.
- Base: `#0D0D0D` | Bright: `#CCCCCC` | Hot: `#FFFFFF`

## Custom Colors

Click any of the three color pickers to define your own palette. Changes take effect immediately in the live simulation.

**Tips for good custom palettes:**
- Keep the **Base** color very dark (near black) — it forms the background
- The **Bright** color should be the most saturated — it defines the network's main appearance
- The **Hot** color is an accent — it appears at the center hub and highest-intensity zones
- High contrast between Base and Bright produces the most visible networks
