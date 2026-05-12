# SHUMI ASCII Mushroom Mascot — CC Handoff Spec

**Date:** 2026-05-05
**Author:** pxeo
**For:** Claude Code / Sascha — live browser preview required
**Constraint:** Pure DOM, no canvas, no WebGL, no GPU
**Target:** shumi.ai landing page hero section
**Skills:** `/mnt/skills/` — reference for environment
**npm:** `shumi` package — reference in any build tooling

---

## The Vision

The SHUMI mushroom mascot rendered entirely in dense ASCII characters. On load, the mushroom is clearly recognizable — full color, every feature visible. Then mycelial roots begin growing outward from the eyes (the "intelligence sources"), bleeding through the entire form — cap, face, stem, everything — leaving permanent glowing filament trails. Over 30-60 seconds, the mushroom transforms from a static image into a living network organism. The roots don't disappear. They accumulate. The mushroom becomes the network.

---

## Reference Material

### Primary visual reference

**Benji Taylor's ASCII black hole** ([@benjitaylor, 06 Mar 26](https://x.com/benjitaylor)):
- Dense monospace characters tightly packed, tiny font
- Shape emerges from color tinting of characters by underlying image pixels
- Code fragments / variable names as character vocabulary
- Sparse ambient code text scattered in background behind main shape
- Animated — characters shift, shapes emerge and evolve

### Source asset

The SHUMI mushroom mascot header logo — red cap with white spots, dark eyes, tan/beige face. This image must be provided to CC alongside this spec. The shape comes entirely from pixel-sampling this image — there is no hand-coded mask.

### Behavioral reference

Real hyphal tip growth (microscopy footage of mycelium extending):
- Bright tip pushes forward slowly
- Behind the tip, the filament solidifies and STAYS
- Branching happens at nodes — main trunk forks into sub-branches
- Growth radiates outward from origin points
- Network accumulates over time — it never retracts

---

## What Failed in 8 Iterations (Read This First)

These are hard-won lessons. Every one of these caused a wasted iteration cycle:

### 1. Shape legibility at low resolution
**V1-V2:** 80 columns was not enough. The mushroom features (spots, eyes, mouth) dissolved into an amorphous blob. **Minimum 160 columns.** The full grid must fit the viewport width — if you can only see a zoomed-in section, the shape won't resolve. Test at target viewport size immediately.

### 2. Unicode symbols instead of density characters
**V1:** Using `▲◆●█▓▒░` as colored icons scattered on a grid looked like a particle field, not a mushroom. **Use plain code characters** (`$#@%&*+=!?` etc.) uniformly — the shape comes from COLOR, not from glyph choice.

### 3. Text-shadow is invisible at 5px font size
**V7-V8:** CSS `text-shadow` on a 5px character is imperceptible, especially on mobile. The "permanent filament" effect using glow-only shadows was completely invisible — the mushroom looked identical before and after growth. **Filaments must change the character's actual color to be visible.** The settled filament color must be clearly distinct from all base mushroom colors (reds, tans, whites).

### 4. Single-character-wide paths are invisible in a dense grid
**V4-V8:** A growth path that's 1 character wide threading through a 160×80 grid of dense text is imperceptible. **Paths need width** — light up adjacent characters too, or use a thicker glow effect that's actually visible at the render size.

### 5. Growth avoiding the red cap
**V4-V7:** The growth algorithm avoided dark/dim pixels, which meant the entire red cap (35% of the mushroom) was a dead zone with zero root activity. **Growth pathing must be luminance-blind** — every cell inside the silhouette is valid terrain.

### 6. Growth too slow / not enough concurrent activity
**V5-V6:** At 0.25 cells/frame with 5-9 second spawn intervals, two screenshots 30 seconds apart showed almost no perceptible change. **Growth must be visible within 3-5 seconds of page load.** Multiple concurrent growths needed.

### 7. Trails that fade away
**V4-V5:** Early versions faded trails back to base color. The roots must be **permanent**. The network accumulates — that's the whole point. Each wave adds more visible structure.

### 8. Claude artifact viewer is not a valid preview environment
The mobile artifact viewer renders tiny fonts at unpredictable scales and can't show the full grid. **This must be built with live browser preview at the target viewport size.** This is why it's a CC task.

---

## Architecture

```
┌──────────────────────────────────────────────────┐
│  Build step (once, at page load)                 │
│                                                  │
│  1. Load mushroom image → hidden <img>           │
│  2. Draw to hidden <canvas> → read pixels        │
│  3. For each cell in grid:                       │
│     - Sample pixel RGB                           │
│     - If dark (lum < threshold) → space          │
│     - Else → <span> with inline color,           │
│       random code character, unique ID           │
│  4. Mount as <pre> in DOM                        │
│  5. Mark eye cells with pulsing glow class       │
│  6. Start growth engine                          │
│                                                  │
│  Runtime:                                        │
│  - Growth engine: setInterval/rAF                │
│  - Character cycling: setInterval                │
│  - Breathing: CSS animation on container         │
└──────────────────────────────────────────────────┘
```

### Production path (SSR)

For the actual landing page, pre-generate the HTML at build time with a Node script (node-canvas for pixel reading). Ship the `<pre>` block as static HTML. Only the growth engine and character cycling run client-side.

---

## Grid Specification

| Parameter | Value | Notes |
|-----------|-------|-------|
| Columns | 160–200 | Must resolve spots, eyes, mouth |
| Rows | auto | `cols × (img_h / img_w) × 0.5` (monospace aspect correction) |
| Font | Geist Mono → Courier New fallback | Must be monospace |
| Font size | **Tune by eye** | Full mushroom must fit viewport at once |
| Line height | font-size × 1.2 | Tight, no row gaps |
| Letter spacing | 0–0.5px | Characters should nearly touch |
| Luminance threshold | 8–12 | Below this → invisible space |

**Responsive:** Either use `transform: scale()` on the `<pre>` to fit viewport, or generate multiple column counts and swap via media query.

---

## Color Mapping (Base Layer)

```javascript
const [r, g, b] = samplePixel(x, y);
const lum = 0.299 * r + 0.587 * g + 0.114 * b;

if (lum < THRESHOLD) return ' '; // void

// Boost dim colors (dark red cap areas) so they're visible on #0A0A0A
let boost = 1.0;
if (lum < 80) boost = Math.min(80 / lum, 2.5);

const color = `rgb(${clamp(r * boost)}, ${clamp(g * boost)}, ${clamp(b * boost)})`;
```

Each visible cell stores its original RGB as a `data-rgb` attribute or CSS custom property so the growth engine can reference it later if needed.

---

## Character Vocabulary

Uniform random selection from:

```
$ # @ % & * + = ! ? / | ( ) { } [ ] < > : ; , . ~ ^ - _
a b c d e f g h i j k l m n o p q r s t u v w x y z
0 1 2 3 4 5 6 7 8 9
```

Character choice does NOT vary by brightness or position. Every visible cell gets a random pick. This reads as "code texture."

---

## Growth System

### Origin Points: The Eyes

Both eyes are "intelligence sources." Locate them by finding the two darkest clusters in the face region (roughly x: 30-70%, y: 55-72% of the grid). These are the only two root origins.

On load, eye cells get a **permanent pulsing glow** — this is the only element that animates before growth starts. The glow should be clearly visible (not subtle shadow — actual visible effect).

### Growth Behavior: Hyphal Tip Extension

Each growth is a **tree that branches**:

1. A main trunk extends outward from an eye in a given direction
2. The trunk curves gently (slight angle perturbation per step)
3. At random points along the trunk, sub-branches fork off
4. Sub-branches can fork further (up to depth 3-4)
5. All growth stays inside the mushroom silhouette (visibility mask)
6. Growth is **luminance-blind** — paths go through reds, tans, whites, everything

### Growth Rendering: What Makes a Root Visible

**THIS IS THE CRITICAL PART THAT FAILED IN ALL PREVIOUS ITERATIONS.**

A root path must be clearly visible against the base mushroom image. At 5px font size, text-shadow is invisible. A single character changing color is invisible in a 160×80 grid. The root must be rendered as:

**Option A — Color override with width:**
- The tip cell AND its immediate neighbors (±1 in x and y) change color to bright gold `#D4A044`
- Behind the tip, settled cells change to a permanent color that's distinct from ALL base colors
- Suggested settled color: `#D4A044` at reduced opacity, or a color that contrasts with both the red cap and the tan face — experiment with phosphor green `#39FF14` at low intensity, or warm amber

**Option B — Character replacement:**
- Root cells get their character replaced with connected-line box-drawing characters: `─ │ ┌ ┐ └ ┘ ├ ┤ ┬ ┴ ┼`
- Choose the character based on the direction the path is traveling
- This makes roots structurally distinct from the random background characters
- Color them gold/amber

**Option C — Brightness boost:**
- Root cells keep their base color but get dramatically brightened — `filter: brightness(2.5)` or multiply RGB by 2-3x
- The root path reads as a bright vein of the mushroom's own color
- This is the most organic option — the roots "illuminate" the existing texture

**Recommendation:** Start with Option A (color override) because it's the most reliably visible. If it looks too harsh, soften toward Option C. Option B is the most technically interesting but hardest to get right.

### Growth Speed and Density

- **Visible change within 3 seconds of page load**
- Multiple trunks growing simultaneously (3-5 concurrent)
- New waves spawning every 1-2 seconds
- Growth speed: fast enough to watch, slow enough to follow — roughly 15-25 cells per second per trunk
- Alternating between left eye and right eye
- Inter-eye connectors: some paths grow directly between the two eyes

### Permanence

**Roots never disappear.** Once a cell has been traversed by a growth tip, it permanently changes state. The network accumulates. After 60 seconds, the mushroom should be visibly laced with root paths. After 2-3 minutes, it's dense with network structure.

The growth engine should eventually reach a "full" state where most of the mushroom has been traversed, and then either stop or slow to very occasional new paths.

---

## Eye Glow

The eyes need to clearly read as glowing intelligence sources BEFORE any growth starts. This means the glow must be visible at the actual render size. Options:

- Change eye cell colors to bright gold and add CSS animation
- Increase font-weight or font-size of eye cells slightly
- Use a radial CSS gradient behind the `<pre>` positioned at the eye locations
- Add actual `<div>` elements positioned absolutely over the eye locations with blur/glow

The last option (overlay divs) is probably the most reliable way to get a visible glow effect at tiny font sizes.

---

## Breathing Animation

Single CSS keyframe on the container:

```css
@keyframes breathe {
    0%, 100% { filter: brightness(0.82); }
    50% { filter: brightness(1.08); }
}
```

Period: 6-8 seconds. Subtle — the form inhales and exhales.

---

## Character Cycling

Swap ~5% of NON-ROOT characters every 1000ms:

```javascript
setInterval(() => {
    // Only cycle cells that haven't been claimed by the growth network
    // Root cells keep their characters locked
}, 1000);
```

---

## Background Layer (Enhancement)

Sparse, real SHUMI code fragments scattered across the viewport behind the mascot at very low opacity:

```
const signal = await cr.getScore('ETH');
if (regime === 'UP') confluence++;
$SHUMI.subscribe(alerts.funding);
bandPosition: 'HIGH', streak: 14
superTrend.flip('1D', 'bullish');
monteCarlo.survival > 0.75
```

Position absolutely, 0.08–0.15 opacity, Geist Mono, same breathing animation. These should be real enough to reward a close reader. 15-25 of them scattered around the edges.

---

## DOM Structure

```html
<div class="shumi-mascot-hero">
    <!-- Background code fragments -->
    <div class="code-bg">
        <span style="top:12%;left:5%">const signal = await cr.getScore('ETH');</span>
        ...
    </div>

    <!-- Eye glow overlays -->
    <div class="eye-glow left" style="left:37%;top:64%"></div>
    <div class="eye-glow right" style="left:60%;top:64%"></div>

    <!-- Main ASCII grid -->
    <pre class="mascot-grid">
        <s id="c0" style="color:rgb(180,30,25)">$</s>...
    </pre>
</div>
```

Use `<s>` (shortest inline tag) with `text-decoration: none`. Void cells are plain spaces (no element). Inline styles for per-cell color.

---

## Files to Provide CC

| File | Description |
|------|-------------|
| This spec (`shumi-ascii-mascot-spec.md`) | Architecture + all lessons learned |
| Mushroom source image | The SHUMI mascot asset — red cap, white spots, dark eyes |
| `shumi-ascii-mascot-v8.html` | Latest working POC — use for reference, not as starting point |
| `shumi-ascii-mascot-v3.html` | Simplest working POC (base image only, no growth) — good starting point for the base layer |

---

## Implementation Order

1. **Get the base image rendering right first.** Dense ASCII grid, mushroom clearly recognizable, correct font size for viewport. Don't touch growth until this looks good.
2. **Add eye glow.** Verify it's visible at render size.
3. **Add single growth path** from one eye. Get the rendering right — make sure the root trail is clearly visible against the base image. This is the hardest step.
4. **Add branching** and multi-directional growth from both eyes.
5. **Add permanence** — trails stay.
6. **Add character cycling** and breathing.
7. **Add background code fragments.**

---

## Design System Alignment

- **Font:** Geist Mono (canonical across all SHUMI surfaces)
- **Background:** Terminal Dark `#0A0A0A`
- **Gold:** `#D4A044` — annotation/accent, appropriate for root network
- **Phosphor Green:** `#39FF14` — signal states, possible alternative root color
- **Red:** `#E74C3C` — action only, max 3 touchpoints (don't use for roots)
- **Border radius:** N/A — no borders, no cards
- **No glassmorphism, no gradients, no shadows on containers**
- **The mascot floats directly on terminal dark**

---

## Success Criteria

1. On load, the mushroom is immediately recognizable — cap, spots, eyes, face, stem all legible
2. Within 3-5 seconds, visible root growth begins from the eye regions
3. The roots are clearly visible as they grow through ALL areas including the dark red cap
4. Roots persist permanently — the network accumulates
5. After 60 seconds, the mushroom is visibly threaded with golden root paths
6. Zero GPU usage — pure DOM, CSS animations, JS class toggling / color changes
7. Works at the target viewport size (not just in a code editor or artifact viewer)
