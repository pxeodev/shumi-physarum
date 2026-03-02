// ═══════════════════════════════════════════════════════════════
//  STENCIL-WORKER.JS — Physarum simulation engine (Web Worker)
//  Renders to OffscreenCanvases, sends ImageBitmaps to main thread
// ═══════════════════════════════════════════════════════════════

// ── Palette families ──
const TEXTURES = {
    standard:    { bg: { speed: 7.0, sensorDist: 22, diffusion: 0.25, deposit: 12, decay: 0.960, turnSpeed: 26, trailBright: 1.3, foodCount: 12 },
                   ms: { speed: 3.2, sensorDist: 22, diffusion: 0.25, deposit: 4, decay: 0.925, turnSpeed: 22, trailBright: 0.8 } },
    crystalline: { bg: { speed: 5.5, sensorDist: 18, diffusion: 0.10, deposit: 18, decay: 0.950, turnSpeed: 22, trailBright: 1.6, foodCount: 16 },
                   ms: { speed: 3.0, sensorDist: 20, diffusion: 0.10, deposit: 5, decay: 0.920, turnSpeed: 18, trailBright: 0.9 } },
    smoke:       { bg: { speed: 7.5, sensorDist: 28, diffusion: 0.45, deposit: 8,  decay: 0.972, turnSpeed: 30, trailBright: 1.0, foodCount: 8 },
                   ms: { speed: 3.5, sensorDist: 24, diffusion: 0.30, deposit: 3, decay: 0.930, turnSpeed: 24, trailBright: 0.7 } },
    coral:       { bg: { speed: 4.5, sensorDist: 30, diffusion: 0.18, deposit: 14, decay: 0.965, turnSpeed: 22, trailBright: 1.4, foodCount: 18 },
                   ms: { speed: 3.0, sensorDist: 26, diffusion: 0.20, deposit: 4, decay: 0.928, turnSpeed: 20, trailBright: 0.8 } },
    silk:        { bg: { speed: 8.0, sensorDist: 20, diffusion: 0.30, deposit: 6,  decay: 0.942, turnSpeed: 28, trailBright: 1.8, foodCount: 10 },
                   ms: { speed: 3.5, sensorDist: 22, diffusion: 0.28, deposit: 3, decay: 0.922, turnSpeed: 22, trailBright: 0.9 } },
    electric:    { bg: { speed: 9.0, sensorDist: 14, diffusion: 0.15, deposit: 10, decay: 0.955, turnSpeed: 34, trailBright: 1.5, foodCount: 14 },
                   ms: { speed: 3.8, sensorDist: 20, diffusion: 0.15, deposit: 4, decay: 0.925, turnSpeed: 26, trailBright: 0.8 } },
    flow:        { bg: { speed: 6.0, sensorDist: 26, diffusion: 0.42, deposit: 4,  decay: 0.938, turnSpeed: 20, trailBright: 0.8, foodCount: 6 },
                   ms: { speed: 3.2, sensorDist: 24, diffusion: 0.30, deposit: 3, decay: 0.920, turnSpeed: 18, trailBright: 0.6, densityMult: 0.5, trailMax: 150 } },
    spore:       { bg: { speed: 6.0, sensorDist: 12, diffusion: 0.20, deposit: 16, decay: 0.948, turnSpeed: 24, trailBright: 1.8, foodCount: 20 },
                   ms: { speed: 3.0, sensorDist: 20, diffusion: 0.18, deposit: 5, decay: 0.925, turnSpeed: 20, trailBright: 0.9 } },
};
const TEXTURE_NAMES = ['standard', 'crystalline', 'smoke', 'coral', 'silk', 'electric', 'flow', 'spore'];

const PALETTES = [
    { name: 'Ember',  mascot: ['#181208', '#E0B860', '#E8A070'], bg: ['#121010', '#9A8A55', '#8A7050'], chromatic: ['rgba(240,140,80,A)', 'rgba(80,180,220,A)'] },
    { name: 'Frost',  mascot: ['#0A1018', '#70B0E0', '#90C8E8'], bg: ['#0C1014', '#507898', '#608090'], chromatic: ['rgba(100,180,240,A)', 'rgba(180,120,220,A)'] },
    { name: 'Moss',   mascot: ['#0C1408', '#88C870', '#B0D890'], bg: ['#0C1210', '#608858', '#6A8060'], chromatic: ['rgba(120,220,100,A)', 'rgba(220,200,80,A)'] },
    { name: 'Pearl',  mascot: ['#0E0E0E', '#C0B8B0', '#E0D8D0'], bg: ['#0A0A0A', '#807870', '#9A9490'], chromatic: ['rgba(200,200,220,A)', 'rgba(140,130,160,A)'] },
    { name: 'Bloom',  mascot: ['#140A10', '#D880B8', '#E0A0C8'], bg: ['#120C10', '#906878', '#886878'], chromatic: ['rgba(220,120,180,A)', 'rgba(100,220,180,A)'] },
    { name: 'Honey',  mascot: ['#14120A', '#E0C860', '#E8C080'], bg: ['#12100A', '#988850', '#8A8058'], chromatic: ['rgba(230,200,80,A)', 'rgba(80,130,220,A)'] },
    { name: 'Tide',   mascot: ['#080C14', '#6888C0', '#80A0D0'], bg: ['#0A0C12', '#506888', '#486080'], chromatic: ['rgba(100,140,220,A)', 'rgba(220,140,100,A)'] },
    { name: 'Rust',   mascot: ['#140C08', '#C88060', '#D8A080'], bg: ['#120A0A', '#8A6050', '#806048'], chromatic: ['rgba(210,130,90,A)', 'rgba(90,200,180,A)'] },
];

const CELL_W = 8;
const CELL_H = 14;
const CHAR_RAMP = ' \u00b7:;=+*#%@';
const PULSE_SPEED = 0.055;
const PULSE_BRIGHT = 0.25;
const PULSE_RAMP = 1.2;
const STENCIL_START = 0;
const STENCIL_END = 90;

const CODE_LINES = [
    'let mark = exchange.getMarkPrice("BTC-PERP");',
    'let index = exchange.getIndexPrice("BTC-PERP");',
    'let basis = (mark - index) / index * 100;',
    'let funding = await getFundingRate(symbol);',
    'if (funding > 0.03 && oi_delta < -0.05) {',
    '  openShort({ leverage: 5, size: notional });',
    '}',
    'let liqPrice = entry * (1 - 1/leverage + mm);',
    'if (mark < liqPrice * 1.05) reducePosition(0.5);',
    'const oi = await coinalyze.getOI("BTCUSDT");',
    'let oiChange = (oi.current - oi.prev) / oi.prev;',
    'if (oiChange > 0.08 && price.delta < -0.02) {',
    '  signal = "LONG_SQUEEZE"; conviction = 0.85;',
    '}',
    'async function rebalanceHedge(pos) {',
    '  let delta = pos.long.size - pos.short.size;',
    '  if (Math.abs(delta) > threshold) {',
    '    await placeOrder(delta > 0 ? "SELL" : "BUY",',
    '      Math.abs(delta), "MARKET");',
    '  }',
    '}',
    'let atr = calcATR(candles, 14);',
    'let sl = entry - atr * 1.5;',
    'let tp = entry + atr * 3.0;',
    'let rr = (tp - entry) / (entry - sl);',
    'function kelly(winRate, avgWin, avgLoss) {',
    '  return winRate - (1 - winRate) / (avgWin/avgLoss);',
    '}',
    'let size = kelly(0.895, 2.1, 1) * balance;',
    'size = Math.min(size, maxRisk * balance);',
    'let pnl = (exit - entry) / entry * leverage;',
    'let fee = notional * 2 * takerFee;',
    'let netPnl = pnl * notional - fee;',
    'for (let tf of ["5m","15m","1h","4h"]) {',
    '  let sst = superTrend(ohlc[tf], 3, 10);',
    '  if (sst.dir > 0) bullCount++;',
    '}',
    'if (bullCount >= 3) bias = "STRONG_LONG";',
    'let fr8h = funding.rate * 3; // annualize',
    'let carry = fr8h * 365 * notional;',
    'if (carry > minYield && trend.aligned) {',
    '  openCarryTrade(symbol, "LONG_SPOT_SHORT_PERP");',
    '}',
    'await ws.subscribe(`${symbol}@aggTrade`);',
    'ws.on("message", (tick) => {',
    '  cvd += tick.side === "BUY" ? tick.qty : -tick.qty;',
    '  if (cvd < -threshold) emit("SELL_PRESSURE");',
    '});',
    'let margin = position.notional / leverage;',
    'let mmr = margin * maintenanceRate;',
    'let freeMargin = balance - margin + unrealizedPnl;',
    'if (freeMargin < mmr * 2) closePosition();',
    'let spread = askPrice - bidPrice;',
    'let slip = size * avgSlippage[symbol];',
    'let breakeven = entry + (fee * 2 + slip) / size;',
    'function calcMaxLev(vol30d, balance) {',
    '  let risk = vol30d * 2.5; // 2.5 sigma move',
    '  return Math.floor(1 / risk);',
    '}',
    'if (exchange === "BYBIT") setTPSL(tp, sl, "FULL");',
    'if (exchange === "BINANCE") setBracketOrder(tp, sl);',
    'let longFunding = shorts.funding - longs.funding;',
    'let netRate = longFunding * position.size;',
    'emit("FUNDING_PNL", { rate: fr8h, net: netRate });',
];
const CODE_SRC = CODE_LINES.join(' ').split('');
const CODE_LEN = CODE_SRC.length;
let CODE_BUF = CODE_SRC.slice();

// ═══════════════════════════════════════════════════════════════
//  STATE
// ═══════════════════════════════════════════════════════════════

let IS_MOBILE = false;
let VW, VH, MSIZE;
let seed = 1;
let formationMode = 1;

// OffscreenCanvases (created on init)
let bgOffscreen, bgOffCtx;
let mascotOffscreen, mascotOffCtx;
let ghostOffscreen, ghostOffCtx;

// Palette state
let IS_LP = false;
let _blastOnLoad = false;
let _blastTarget = 0.28;
let activePalette = PALETTES[0];
let activeTextureName = 'standard';
let COLORS = [...activePalette.mascot];
let BG_COLORS = [...activePalette.bg];

// Sim params
const BG = {
    agentCount: 8000, speed: 7.5, sensorDist: 22,
    sensorAngle: 40 * Math.PI / 180, turnSpeed: 26 * Math.PI / 180,
    deposit: 11, decay: 0.938, diffusion: 0.17, trailBright: 1.3,
    agentGlow: 0.18, spawnR: 15, stepsPerFrame: 5, spawnRate: 140,
    initialBatch: 3000, foodCount: 16, foodStr: 15,
};
const MS = {
    agentCount: 5500, speed: 4.8, sensorDist: 16,
    sensorAngle: 35 * Math.PI / 180, turnSpeed: 24 * Math.PI / 180,
    deposit: 11, decay: 0.968, diffusion: 0.24, trailBright: 2.4,
    agentGlow: 0.5, spawnR: 10, stepsPerFrame: 5, spawnRate: 70,
    initialBatch: 1400,
};

// Sim state
let bgAgents = [], bgTrail, bgTrailPrev, bgFoods = [];
let bgCx, bgCy, bgFc = 0;
let msAgents = [], msTrail, msTrailPrev, msFoods = [];
let msCx, msCy, msFc = 0;

let densityMap = null;
let edgeDistMap = null;
let edgeFoods = [];
let stencilGrid = null;
let pulsePhase = 0;

// Stencil params (mirroring window._ vars from main thread)
let _stencilMaster = 0.28;
let _pulseSpeed = PULSE_SPEED;
let _stencilEnd = STENCIL_END;
let _edgeStrong = 0.3;
let _edgeWeak = 0.12;
let _edgeFadeDepth = 30;
let _darkThresh = 0.12;
let _nearDarkBoost = 2.5;
let _fillDensity = 3;
let _trailBoost = 1.0;

// Ghost fade state
let ghostFadeStart = -1;
const GHOST_HOLD_FRAMES = 90;
const GHOST_FADE_FRAMES = 180;

// Persistent resurface — retinal burn base layer (damped breathing pulse)
const RESURFACE_PEAK = 0.55;
const RESURFACE_FLOOR = 0.06;
const RESURFACE_FADE_UP = 90;        // 1.5s fade-in
const RESURFACE_PULSE_PERIOD = 180;  // 3s per breath cycle
const RESURFACE_DECAY = 360;         // exponential half-life ~6s (decays to ~0.37 at this frame)

// LP resurface constants
const LP_FADE_IN = 90;
const LP_PEAK_DESKTOP = 0.55;
const LP_PEAK_MOBILE = 0.40;
const LP_PULSE_PERIOD = 210;         // 3.5s per breath (slightly slower for LP)
const LP_DECAY = 420;                // ~7s half-life
const LP_FLOOR_DESKTOP = 0.25;
const LP_FLOOR_MOBILE = 0.15;

// Mask data (received from main thread)
let maskImageData = null; // ImageData of the mascot

// PRNG
let rngState;
function srng(s) { rngState = s | 0; }
function rng() {
    rngState = (rngState + 0x6D2B79F5) | 0;
    let t = Math.imul(rngState ^ (rngState >>> 15), 1 | rngState);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

// ═══════════════════════════════════════════════════════════════
//  COLOR MATH
// ═══════════════════════════════════════════════════════════════

function h2r(hex) {
    let r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return r ? { r: parseInt(r[1], 16), g: parseInt(r[2], 16), b: parseInt(r[3], 16) } : { r: 100, g: 80, b: 30 };
}

function hexToHSL(hex) {
    let r = parseInt(hex.slice(1,3),16)/255, g = parseInt(hex.slice(3,5),16)/255, b = parseInt(hex.slice(5,7),16)/255;
    let max = Math.max(r,g,b), min = Math.min(r,g,b), h, s, l = (max+min)/2;
    if (max === min) { h = s = 0; } else {
        let d = max - min;
        s = l > 0.5 ? d/(2-max-min) : d/(max+min);
        if (max === r) h = ((g-b)/d + (g<b?6:0))/6;
        else if (max === g) h = ((b-r)/d+2)/6;
        else h = ((r-g)/d+4)/6;
    }
    return [h*360, s*100, l*100];
}

function hslToHex(h, s, l) {
    h = ((h%360)+360)%360; s = Math.max(0,Math.min(100,s))/100; l = Math.max(0,Math.min(100,l))/100;
    let c = (1-Math.abs(2*l-1))*s, x = c*(1-Math.abs((h/60)%2-1)), m = l-c/2;
    let r,g,b;
    if (h<60){r=c;g=x;b=0;} else if(h<120){r=x;g=c;b=0;} else if(h<180){r=0;g=c;b=x;}
    else if(h<240){r=0;g=x;b=c;} else if(h<300){r=x;g=0;b=c;} else{r=c;g=0;b=x;}
    let toHex = v => Math.round((v+m)*255).toString(16).padStart(2,'0');
    return '#' + toHex(r) + toHex(g) + toHex(b);
}

function driftColor(hex, hueDrift, satDrift, lumDrift) {
    let [h,s,l] = hexToHSL(hex);
    return hslToHex(h + hueDrift, s + satDrift, l + lumDrift);
}

// ═══════════════════════════════════════════════════════════════
//  PALETTE / TEXTURE SELECTION (returns info instead of injecting CSS)
// ═══════════════════════════════════════════════════════════════

function selectPalette(s) {
    let palIdx = s % PALETTES.length;
    let texIdx = Math.floor(s / PALETTES.length) % TEXTURE_NAMES.length;
    activePalette = PALETTES[palIdx];
    activeTextureName = TEXTURE_NAMES[texIdx];

    let tmpRng = s;
    function quickRng() { tmpRng = (tmpRng * 16807 + 0) % 2147483647; return tmpRng / 2147483647; }
    let hDrift = (quickRng() - 0.5) * 16;
    let sDrift = (quickRng() - 0.5) * 10;
    let lDrift = (quickRng() - 0.5) * 6;

    COLORS = activePalette.mascot.map(c => driftColor(c, hDrift, sDrift, lDrift));
    BG_COLORS = activePalette.bg.map(c => driftColor(c, hDrift * 0.6, sDrift * 0.4, lDrift * 0.3));

    // LP mode: use mascot colors for BG filaments so they're visible
    if (IS_LP) {
        BG_COLORS = [BG_COLORS[0], COLORS[1], COLORS[2]];
    }

    let tex = TEXTURES[activeTextureName] || TEXTURES.standard;
    let bgTex = tex.bg;
    let msTex = tex.ms;
    function jitter(base, range) { return base + (quickRng() - 0.5) * base * range; }

    BG.speed = jitter(bgTex.speed, 0.15);
    BG.sensorDist = Math.round(jitter(bgTex.sensorDist, 0.15));
    BG.diffusion = Math.max(0.05, Math.min(0.50, jitter(bgTex.diffusion, 0.20)));
    BG.deposit = Math.max(4, Math.round(jitter(bgTex.deposit, 0.15)));
    BG.decay = Math.max(0.940, Math.min(0.990, jitter(bgTex.decay, 0.005)));
    BG.turnSpeed = jitter(bgTex.turnSpeed, 0.15) * Math.PI / 180;
    BG.trailBright = jitter(bgTex.trailBright, 0.10);
    BG.foodCount = Math.round(jitter(bgTex.foodCount, 0.20));

    // LP mode: vein-first params — fewer agents + faster decay = visible corridors
    if (IS_LP) {
        BG.agentCount = IS_MOBILE ? 3000 : 4000;
        BG.speed = 3.0;
        BG.sensorDist = 28;
        BG.turnSpeed = 30 * Math.PI / 180;
        BG.sensorAngle = 45 * Math.PI / 180;
        BG.deposit = 16;
        BG.decay = 0.920;
        BG.diffusion = 0.08;
        BG.trailBright = 1.3;
        BG.stepsPerFrame = 3;
        BG.foodCount = 10;
        BG.spawnRate = 100;
        BG.initialBatch = 2000;
        BG.hBias = true;
    }

    MS.speed = jitter(msTex.speed, 0.15);
    MS.sensorDist = Math.round(jitter(msTex.sensorDist, 0.15));
    MS.diffusion = Math.max(0.05, Math.min(0.45, jitter(msTex.diffusion, 0.20)));
    MS.deposit = Math.round(jitter(msTex.deposit, 0.15));
    MS.decay = Math.max(0.945, Math.min(0.990, jitter(msTex.decay, 0.005)));
    MS.turnSpeed = jitter(msTex.turnSpeed, 0.15) * Math.PI / 180;
    MS.trailBright = jitter(msTex.trailBright, 0.10);
    MS.densityMult = msTex.densityMult !== undefined ? msTex.densityMult : 1.0;
    MS.trailMax = msTex.trailMax || 180;

    if (IS_MOBILE) {
        BG.agentCount = Math.min(BG.agentCount, 6000);
        MS.agentCount = Math.min(MS.agentCount, 4500);
        BG.stepsPerFrame = Math.min(BG.stepsPerFrame, 4);
        MS.stepsPerFrame = Math.min(MS.stepsPerFrame, 4);
        BG.spawnRate = Math.min(BG.spawnRate, 120);
        MS.spawnRate = Math.min(MS.spawnRate, 60);
    }
}

// ═══════════════════════════════════════════════════════════════
//  MASK BUILDING (from received ImageData, no DOM)
// ═══════════════════════════════════════════════════════════════

function buildMask() {
    if (!maskImageData) return;

    // maskImageData is the full MSIZE x MSIZE ImageData of mascot drawn on mask canvas
    let maskData = maskImageData.data;

    // Edge distance map
    edgeDistMap = new Float32Array(MSIZE * MSIZE);
    let binary = new Uint8Array(MSIZE * MSIZE);
    for (let i = 0; i < MSIZE * MSIZE; i++) binary[i] = maskData[i * 4 + 3] > 30 ? 1 : 0;
    let dist = new Float32Array(MSIZE * MSIZE);
    for (let i = 0; i < MSIZE * MSIZE; i++) dist[i] = binary[i] ? 999 : 0;
    for (let y = 1; y < MSIZE - 1; y++) {
        for (let x = 1; x < MSIZE - 1; x++) {
            let i = y * MSIZE + x;
            if (dist[i] > 0) dist[i] = Math.min(dist[i], Math.min(dist[i-1], dist[i-MSIZE]) + 1);
        }
    }
    for (let y = MSIZE - 2; y > 0; y--) {
        for (let x = MSIZE - 2; x > 0; x--) {
            let i = y * MSIZE + x;
            if (dist[i] > 0) dist[i] = Math.min(dist[i], Math.min(dist[i+1], dist[i+MSIZE]) + 1);
        }
    }
    let edgeFadeDepth = _edgeFadeDepth;
    let noiseGrid = 8;
    let nw = Math.ceil(MSIZE / noiseGrid) + 1;
    let nh = Math.ceil(MSIZE / noiseGrid) + 1;
    let noise = new Float32Array(nw * nh);
    for (let i = 0; i < noise.length; i++) noise[i] = rng() * 0.6 + 0.7;
    for (let y = 0; y < MSIZE; y++) {
        for (let x = 0; x < MSIZE; x++) {
            let i = y * MSIZE + x;
            let gx = x / noiseGrid, gy = y / noiseGrid;
            let gx0 = Math.floor(gx), gy0 = Math.floor(gy);
            let fx = gx - gx0, fy = gy - gy0;
            let gx1 = Math.min(gx0 + 1, nw - 1), gy1 = Math.min(gy0 + 1, nh - 1);
            let n = noise[gy0 * nw + gx0] * (1-fx)*(1-fy) + noise[gy0 * nw + gx1] * fx*(1-fy)
                  + noise[gy1 * nw + gx0] * (1-fx)*fy + noise[gy1 * nw + gx1] * fx*fy;
            edgeDistMap[i] = Math.min(1, (dist[i] * n) / edgeFadeDepth);
        }
    }

    // Density map from mascot image
    let px = maskData;
    densityMap = new Float32Array(MSIZE * MSIZE);
    edgeFoods = [];

    let lum = new Float32Array(MSIZE * MSIZE);
    for (let i = 0; i < MSIZE * MSIZE; i++) {
        let r = px[i*4], g = px[i*4+1], b = px[i*4+2], a = px[i*4+3];
        lum[i] = a > 10 ? (r * 0.299 + g * 0.587 + b * 0.114) / 255 : 0;
    }

    for (let y = 1; y < MSIZE - 1; y++) {
        for (let x = 1; x < MSIZE - 1; x++) {
            let idx = y * MSIZE + x;
            let gx = -lum[idx - MSIZE - 1] + lum[idx - MSIZE + 1]
                     -2*lum[idx - 1]        + 2*lum[idx + 1]
                     -lum[idx + MSIZE - 1]  + lum[idx + MSIZE + 1];
            let gy = -lum[idx - MSIZE - 1] - 2*lum[idx - MSIZE] - lum[idx - MSIZE + 1]
                     +lum[idx + MSIZE - 1]  + 2*lum[idx + MSIZE] + lum[idx + MSIZE + 1];
            let edge = Math.sqrt(gx * gx + gy * gy);
            let a = px[idx * 4 + 3];
            let darkBoost = (a > 128 && lum[idx] < 0.18) ? 0.35 : 0;
            densityMap[idx] = Math.min(1, edge * 3 + lum[idx] * 0.15 + darkBoost);
        }
    }

    let candidates = [];
    for (let y = 4; y < MSIZE - 4; y += 3) {
        for (let x = 4; x < MSIZE - 4; x += 3) {
            let d = densityMap[y * MSIZE + x];
            if (d > 0.4) candidates.push({ x, y, d });
        }
    }
    candidates.sort((a, b) => b.d - a.d);
    let minDist = MSIZE * 0.06;
    for (let c of candidates) {
        if (edgeFoods.length >= 30) break;
        let tooClose = false;
        for (let f of edgeFoods) {
            let dx = f.x - c.x, dy = f.y - c.y;
            if (Math.sqrt(dx*dx + dy*dy) < minDist) { tooClose = true; break; }
        }
        if (!tooClose) edgeFoods.push({ x: c.x, y: c.y, r: 100 });
    }

    // Dark-feature food points (eyes, dark regions)
    let darkCandidates = [];
    for (let y = 4; y < MSIZE - 4; y += 3) {
        for (let x = 4; x < MSIZE - 4; x += 3) {
            let idx = y * MSIZE + x;
            if (px[idx * 4 + 3] > 128 && lum[idx] < 0.15) {
                darkCandidates.push({ x, y, d: 1 - lum[idx] });
            }
        }
    }
    darkCandidates.sort((a, b) => b.d - a.d);
    for (let c of darkCandidates) {
        if (edgeFoods.length >= 40) break;
        let tooClose = false;
        for (let f of edgeFoods) {
            let dx = f.x - c.x, dy = f.y - c.y;
            if (Math.sqrt(dx*dx + dy*dy) < minDist * 0.7) { tooClose = true; break; }
        }
        if (!tooClose) edgeFoods.push({ x: c.x, y: c.y, r: 80 });
    }

    // ASCII stencil grid
    let sCols = Math.floor(MSIZE / CELL_W);
    let sRows = Math.floor(MSIZE / CELL_H);
    stencilGrid = new Array(sCols * sRows);
    let imgPx = px; // same maskImageData
    for (let row = 0; row < sRows; row++) {
        let sy = row * CELL_H + Math.floor(CELL_H / 2);
        for (let col = 0; col < sCols; col++) {
            let sx = col * CELL_W + Math.floor(CELL_W / 2);
            let si = (sy * MSIZE + sx) * 4;
            let r = imgPx[si], g = imgPx[si+1], b = imgPx[si+2], a = imgPx[si+3];
            let lumVal = a > 10 ? (r * 0.299 + g * 0.587 + b * 0.114) / 255 : 0;
            let edgeVal = densityMap ? densityMap[sy * MSIZE + sx] : 0;
            let edgeMax = edgeVal;
            for (let dy = -2; dy <= 2; dy++) {
                for (let dx = -2; dx <= 2; dx++) {
                    let ny = sy + dy * 2, nx = sx + dx * 2;
                    if (ny >= 0 && ny < MSIZE && nx >= 0 && nx < MSIZE && densityMap) {
                        edgeMax = Math.max(edgeMax, densityMap[ny * MSIZE + nx]);
                    }
                }
            }
            let reveal = a > 10 ? (1 - edgeVal * 0.6) * (0.3 + rng() * 0.7) : 2;
            stencilGrid[row * sCols + col] = { lum: lumVal, a: a / 255, reveal, r, g, b, edge: edgeMax };
        }
    }
}

function buildGhost() {
    if (!ghostOffscreen || !maskImageData) return;
    ghostOffCtx.clearRect(0, 0, MSIZE, MSIZE);

    // Draw mascot from ImageData onto a temp canvas, then draw to ghost
    let tmpCanvas = new OffscreenCanvas(MSIZE, MSIZE);
    let tmpCtx = tmpCanvas.getContext('2d');
    tmpCtx.putImageData(maskImageData, 0, 0);

    ghostOffCtx.drawImage(tmpCanvas, 0, 0);

    // Crush color with multiply composites
    ghostOffCtx.globalCompositeOperation = 'multiply';
    ghostOffCtx.fillStyle = '#1a1a1a';
    ghostOffCtx.fillRect(0, 0, MSIZE, MSIZE);
    ghostOffCtx.globalCompositeOperation = 'multiply';
    ghostOffCtx.fillStyle = '#2a2a2a';
    ghostOffCtx.fillRect(0, 0, MSIZE, MSIZE);

    // Feather edges — build blur mask in worker using manual gaussian
    // (canvas filter: 'blur()' may not work in workers, so use feathered mask from main thread
    // if available, otherwise skip feathering in worker — main thread handles final mask)
    ghostOffCtx.globalCompositeOperation = 'source-over';

    ghostFadeStart = -1;
}

function getMaskFoodPoints(count) {
    let points = [];
    if (!maskImageData) return points;
    let data = maskImageData.data;
    let opaque = [];
    for (let y = 0; y < MSIZE; y += 3) {
        for (let x = 0; x < MSIZE; x += 3) {
            if (data[(y * MSIZE + x) * 4 + 3] > 128) opaque.push({ x, y });
        }
    }
    for (let i = 0; i < count && opaque.length > 0; i++) {
        points.push(opaque[Math.floor(rng() * opaque.length)]);
    }
    return points;
}

// ═══════════════════════════════════════════════════════════════
//  PHYSARUM ENGINE
// ═══════════════════════════════════════════════════════════════

function sampleT(trail, w, h, x, y) {
    let ix = Math.floor(x), iy = Math.floor(y);
    if (ix < 0 || ix >= w || iy < 0 || iy >= h) return 0;
    return trail[iy * w + ix];
}

class Agent {
    constructor(x, y, h) { this.x = x; this.y = y; this.h = h; }

    step(P, trail, foods, w, h, dmap, edmap) {
        let sL = this.sense(P, trail, w, h, -P.sensorAngle);
        let sC = this.sense(P, trail, w, h, 0);
        let sR = this.sense(P, trail, w, h, P.sensorAngle);

        if (dmap) {
            let sd = P.sensorDist;
            let dL = sampleT(dmap, w, h, this.x + Math.cos(this.h - P.sensorAngle) * sd, this.y + Math.sin(this.h - P.sensorAngle) * sd);
            let dC = sampleT(dmap, w, h, this.x + Math.cos(this.h) * sd, this.y + Math.sin(this.h) * sd);
            let dR = sampleT(dmap, w, h, this.x + Math.cos(this.h + P.sensorAngle) * sd, this.y + Math.sin(this.h + P.sensorAngle) * sd);
            sL += dL * 40; sC += dC * 40; sR += dR * 40;
        }

        if (foods && foods.length > 0) {
            let bd = Infinity, ba = 0;
            for (let f of foods) {
                let dx = f.x - this.x, dy = f.y - this.y;
                let d = Math.sqrt(dx * dx + dy * dy);
                if (d < (f.r || 150) && d < bd) { bd = d; ba = Math.atan2(dy, dx); }
            }
            if (bd < 150 && bd > 3) {
                let diff = ba - this.h;
                while (diff > Math.PI) diff -= Math.PI * 2;
                while (diff < -Math.PI) diff += Math.PI * 2;
                this.h += diff * Math.pow(1 - bd / 150, 2) * 0.12;
            }
        }

        if (sC > sL && sC > sR) { /* straight */ }
        else if (sC < sL && sC < sR) { this.h += (rng() < 0.5 ? P.turnSpeed : -P.turnSpeed); }
        else if (sL > sR) { this.h -= P.turnSpeed; }
        else if (sR > sL) { this.h += P.turnSpeed; }

        // Horizontal bias: pull agents toward nearest horizontal heading
        if (P.hBias) {
            let vert = Math.abs(Math.sin(this.h));
            if (vert > 0.3) {
                let target = Math.cos(this.h) > 0 ? 0 : Math.PI;
                let diff = target - this.h;
                if (diff > Math.PI) diff -= Math.PI * 2;
                if (diff < -Math.PI) diff += Math.PI * 2;
                this.h += diff * 0.08 * vert;
            }
        }

        this.x += Math.cos(this.h) * P.speed;
        this.y += Math.sin(this.h) * P.speed;

        if (this.x < 0) this.x += w; if (this.x >= w) this.x -= w;
        if (this.y < 0) this.y += h; if (this.y >= h) this.y -= h;

        let ix = Math.floor(this.x), iy = Math.floor(this.y);
        if (ix >= 0 && ix < w && iy >= 0 && iy < h) {
            let dep = P.deposit;
            if (dmap) {
                let d = dmap[iy * w + ix] || 0;
                let dm = P.densityMult !== undefined ? P.densityMult : 1.0;
                dep = P.deposit * (0.5 + d * 2.5 * dm);
            }
            if (edmap) {
                let ef = edmap[iy * w + ix] || 0;
                dep *= 0.15 + ef * 0.85;
            }
            let tmax = P.trailMax || 255;
            trail[iy * w + ix] = Math.min(trail[iy * w + ix] + dep, tmax);
        }
    }

    sense(P, trail, w, h, offset) {
        let a = this.h + offset;
        return sampleT(trail, w, h, this.x + Math.cos(a) * P.sensorDist, this.y + Math.sin(a) * P.sensorDist);
    }
}

function diffuse(trail, trailPrev, w, h, diffusion, decay) {
    let tmp = trailPrev; trailPrev = trail; trail = tmp;
    let id = 1 - diffusion;
    for (let y = 1; y < h - 1; y++) {
        for (let x = 1; x < w - 1; x++) {
            let idx = y * w + x;
            let avg = (trailPrev[idx - 1] + trailPrev[idx + 1] + trailPrev[idx - w] + trailPrev[idx + w]) * 0.25;
            trail[idx] = (trailPrev[idx] * id + avg * diffusion) * decay;
        }
    }
    return { trail, trailPrev };
}

function spawnAgent(agents, cx, cy, spawnR) {
    let a = rng() * Math.PI * 2;
    let r = rng() * spawnR;
    agents.push(new Agent(cx + Math.cos(a) * r, cy + Math.sin(a) * r, a));
}

function seedTrail(trail, cx, cy, w, h, spawnR) {
    for (let dy = -spawnR; dy <= spawnR; dy++) {
        for (let dx = -spawnR; dx <= spawnR; dx++) {
            let dd = Math.sqrt(dx * dx + dy * dy);
            if (dd < spawnR) {
                let ix = Math.floor(cx + dx), iy = Math.floor(cy + dy);
                if (ix >= 0 && ix < w && iy >= 0 && iy < h) {
                    trail[iy * w + ix] = (1 - dd / spawnR) * 40;
                }
            }
        }
    }
}

// ═══════════════════════════════════════════════════════════════
//  RENDERING
// ═══════════════════════════════════════════════════════════════

function renderTrail(ctx, trail, w, h, P, colors) {
    colors = colors || COLORS;
    let base = h2r(colors[0]), bright = h2r(colors[1]), hot = h2r(colors[2]);

    ctx.fillStyle = colors[0];
    ctx.fillRect(0, 0, w, h);

    let cellW = CELL_W;
    let cellH = CELL_H;
    let cols = Math.floor(w / cellW);
    let rows = Math.floor(h / cellH);
    let fontSize = cellH - 2;
    ctx.font = `${fontSize}px 'Courier New'`;
    ctx.textBaseline = 'top';
    ctx.textAlign = 'center';

    let pulse = Math.sin(pulsePhase);
    let brightMult = 1 + pulse * PULSE_BRIGHT;
    let rampShift = pulse * PULSE_RAMP;

    // LP sanctuary: hard-cull below 45% of canvas, feather from 40-45%
    let sanctuaryY = IS_LP ? Math.floor(h * 0.45) : h;
    let featherTop = IS_LP ? Math.floor(h * 0.40) : h;

    for (let row = 0; row < rows; row++) {
        let py = row * cellH + Math.floor(cellH / 2);
        if (py >= h || py >= sanctuaryY) continue;
        for (let col = 0; col < cols; col++) {
            let px = col * cellW + Math.floor(cellW / 2);
            if (px >= w) continue;
            let v = trail[py * w + px] * P.trailBright * (_trailBoost || 1.0);
            if (v < 5) continue;

            let ch = CODE_BUF[(row * cols + col) % CODE_LEN];
            if (ch === ' ') ch = CODE_BUF[(row * cols + col + 7) % CODE_LEN];

            let r, g, b, alpha;

            if (v > 20) {
                let vPulsed = v * brightMult;
                let rawAlpha = Math.min(1, v / 60);
                alpha = rawAlpha * rawAlpha;

                let t = Math.min(vPulsed / 40, 1);
                let t2 = Math.min(vPulsed / 90, 1);
                if (t2 > 0.3) {
                    let ht = (t2 - 0.3) / 0.7;
                    r = bright.r + (hot.r - bright.r) * ht;
                    g = bright.g + (hot.g - bright.g) * ht;
                    b = bright.b + (hot.b - bright.b) * ht;
                } else {
                    r = base.r + (bright.r - base.r) * t;
                    g = base.g + (bright.g - base.g) * t;
                    b = base.b + (bright.b - base.b) * t;
                }
            } else {
                r = 26; g = 22; b = 10;
                alpha = 0.03;
            }

            // Feather near sanctuary edge
            if (py > featherTop) {
                alpha *= 1 - (py - featherTop) / (sanctuaryY - featherTop);
            }

            ctx.globalAlpha = alpha;
            ctx.fillStyle = `rgb(${Math.min(255,r)|0},${Math.min(255,g)|0},${Math.min(255,b)|0})`;
            ctx.fillText(ch, col * cellW + Math.floor(cellW / 2), row * cellH);
        }
    }
    ctx.globalAlpha = 1;
}

function renderTrailPixel(ctx, trail, w, h, P, colors) {
    let base = h2r(colors[0]), bright = h2r(colors[1]), hot = h2r(colors[2]);
    let imgData = ctx.createImageData(w, h);
    let px = imgData.data;
    let pulse = Math.sin(pulsePhase);
    let brightMult = 1 + pulse * PULSE_BRIGHT;

    let boost = _trailBoost || 1.0;
    for (let i = 0; i < w * h; i++) {
        let v = trail[i] * P.trailBright * boost;
        if (v < 0.5) {
            px[i*4] = base.r; px[i*4+1] = base.g; px[i*4+2] = base.b; px[i*4+3] = 255;
            continue;
        }
        let vP = v * brightMult;
        let rawA = Math.min(1, v / 40);
        let alpha = rawA * rawA;
        if (alpha < 0.01) {
            px[i*4] = base.r; px[i*4+1] = base.g; px[i*4+2] = base.b; px[i*4+3] = 255;
            continue;
        }
        let t1 = Math.min(vP / 30, 1);
        let t2 = Math.min(vP / 80, 1);
        let r, g, b;
        if (t2 > 0.5) {
            let ht = (t2 - 0.5) / 0.5;
            r = bright.r + (hot.r - bright.r) * ht * 0.6;
            g = bright.g + (hot.g - bright.g) * ht * 0.6;
            b = bright.b + (hot.b - bright.b) * ht * 0.6;
        } else {
            r = base.r + (bright.r - base.r) * t1;
            g = base.g + (bright.g - base.g) * t1;
            b = base.b + (bright.b - base.b) * t1;
        }
        px[i*4]   = (base.r * (1 - alpha) + r * alpha) | 0;
        px[i*4+1] = (base.g * (1 - alpha) + g * alpha) | 0;
        px[i*4+2] = (base.b * (1 - alpha) + b * alpha) | 0;
        px[i*4+3] = 255;
    }
    ctx.putImageData(imgData, 0, 0);
}

// ═══════════════════════════════════════════════════════════════
//  INIT
// ═══════════════════════════════════════════════════════════════

function generateBgFoods() {
    bgFoods = [];
    let cx = VW / 2, cy = VH / 2;
    if (IS_LP) {
        let minR = MSIZE * 0.75;
        for (let i = 0; i < BG.foodCount; i++) {
            let a = rng() * Math.PI * 2;
            let r = minR + rng() * Math.min(VW, VH) * 0.35;
            bgFoods.push({ x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r, r: 80 + rng() * 120 });
        }
    } else {
        let minR = MSIZE * 0.5;
        let maxR = Math.max(VW, VH) * 0.55;
        for (let i = 0; i < BG.foodCount; i++) {
            let a = rng() * Math.PI * 2;
            let r = minR + rng() * (maxR - minR);
            bgFoods.push({ x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r, r: 100 + rng() * 140 });
        }
    }
}

function initAll() {
    selectPalette(seed);
    srng(seed);

    ghostFadeStart = -1;

    // Shuffle code buffer
    CODE_BUF = CODE_SRC.slice();
    for (let i = CODE_LEN - 1; i > 0; i--) {
        let j = Math.floor(rng() * (i + 1));
        let tmp = CODE_BUF[i]; CODE_BUF[i] = CODE_BUF[j]; CODE_BUF[j] = tmp;
    }

    // Create OffscreenCanvases
    bgOffscreen = new OffscreenCanvas(VW, VH);
    bgOffCtx = bgOffscreen.getContext('2d');
    mascotOffscreen = new OffscreenCanvas(MSIZE, MSIZE);
    mascotOffCtx = mascotOffscreen.getContext('2d');
    ghostOffscreen = new OffscreenCanvas(MSIZE, MSIZE);
    ghostOffCtx = ghostOffscreen.getContext('2d');

    // Build mask data
    buildMask();
    buildGhost();

    // BG sim
    bgCx = VW / 2; bgCy = IS_LP ? (IS_MOBILE ? VH * 0.25 : VH * 0.32) : VH / 2; bgFc = 0;
    bgAgents = [];
    bgTrail = new Float32Array(VW * VH);
    bgTrailPrev = new Float32Array(VW * VH);
    generateBgFoods();

    let spawnRingR = MSIZE * 0.35;
    let seedPts = IS_LP ? 24 : 48;
    let seedR = IS_LP ? 8 : 10;
    for (let i = 0; i < seedPts; i++) {
        let a = (i / seedPts) * Math.PI * 2;
        seedTrail(bgTrail, bgCx + Math.cos(a) * spawnRingR, bgCy + Math.sin(a) * spawnRingR, VW, VH, seedR);
    }
    for (let f of bgFoods) seedTrail(bgTrail, f.x, f.y, VW, VH, 8);
    for (let i = 0; i < BG.initialBatch; i++) {
        let a = rng() * Math.PI * 2;
        let r = spawnRingR + (rng() - 0.5) * 20;
        bgAgents.push(new Agent(bgCx + Math.cos(a) * r, bgCy + Math.sin(a) * r, a + (rng() - 0.5) * 0.8));
    }

    // MS sim
    msCx = MSIZE / 2; msCy = MSIZE / 2; msFc = 0;
    msAgents = [];
    msTrail = new Float32Array(MSIZE * MSIZE);
    msTrailPrev = new Float32Array(MSIZE * MSIZE);
    seedTrail(msTrail, msCx, msCy, MSIZE, MSIZE, MS.spawnR);
    msFoods = edgeFoods.length > 0 ? edgeFoods : getMaskFoodPoints(25);
    for (let f of msFoods) seedTrail(msTrail, f.x, f.y, MSIZE, MSIZE, 6);

    if (densityMap) {
        for (let i = 0; i < MSIZE * MSIZE; i++) {
            msTrail[i] += densityMap[i] * 15;
        }
    }
    for (let i = 0; i < MS.initialBatch; i++) spawnAgent(msAgents, msCx, msCy, MS.spawnR);
}

// ═══════════════════════════════════════════════════════════════
//  FRAME (called on each tick message)
// ═══════════════════════════════════════════════════════════════

function handleTick() {
    bgFc++; msFc++;
    pulsePhase += (_pulseSpeed || PULSE_SPEED);

    // Blast-on-load fade-down: hold blast briefly then ease to normal
    if (_blastOnLoad) {
        let BLAST_HOLD = 60;
        let BLAST_FADE = 150;
        let TARGET_BOOST = IS_LP ? (IS_MOBILE ? 1.0 : 2.5) : 1.0;
        if (msFc <= BLAST_HOLD) {
            // hold at blast
        } else if (msFc <= BLAST_HOLD + BLAST_FADE) {
            let t = (msFc - BLAST_HOLD) / BLAST_FADE;
            let ease = t * t * (3 - 2 * t);
            _stencilMaster = 3.0 + (_blastTarget - 3.0) * ease;
            _trailBoost = 4.0 + (TARGET_BOOST - 4.0) * ease;
        } else {
            _stencilMaster = _blastTarget;
            _trailBoost = TARGET_BOOST;
            _blastOnLoad = false;
        }
    }

    let stencilEnd = _stencilEnd || (IS_MOBILE ? 45 : STENCIL_END);
    let formationLinear = Math.min(1, Math.max(0, (msFc - STENCIL_START) / (stencilEnd - STENCIL_START)));
    let formation = formationLinear * formationLinear;

    // ── Early-frame trail boost — exponential decay from 4x to 1x over ~2s ──
    let earlyBoost = 1 + 3 * Math.exp(-msFc / 60);  // 4x at frame 0, ~2x at frame 60, ~1.1x at frame 120
    let boostedBgSteps = Math.round(BG.stepsPerFrame * earlyBoost);
    let boostedMsSteps = Math.round(MS.stepsPerFrame * earlyBoost);

    // ── BG sim step ──
    if (bgAgents.length < BG.agentCount) {
        let n = Math.min(BG.spawnRate, BG.agentCount - bgAgents.length);
        let ringR = MSIZE * 0.35;
        for (let i = 0; i < n; i++) {
            let a = rng() * Math.PI * 2;
            let r = ringR + (rng() - 0.5) * 20;
            bgAgents.push(new Agent(bgCx + Math.cos(a) * r, bgCy + Math.sin(a) * r, a + (rng() - 0.5) * 0.8));
        }
    }
    for (let s = 0; s < boostedBgSteps; s++) {
        for (let a of bgAgents) a.step(BG, bgTrail, bgFoods, VW, VH);
    }
    let bgD = diffuse(bgTrail, bgTrailPrev, VW, VH, BG.diffusion, BG.decay);
    bgTrail = bgD.trail; bgTrailPrev = bgD.trailPrev;

    // Center suppression — strategy selected once, no branching in hot loop
    let fadeR = IS_LP ? MSIZE * 0.358 : MSIZE * 0.22;
    let fadeR2 = fadeR * fadeR;
    let yMin = Math.max(0, Math.floor(bgCy - fadeR)), yMax = Math.min(VH - 1, Math.ceil(bgCy + fadeR));
    let xMin = Math.max(0, Math.floor(bgCx - fadeR)), xMax = Math.min(VW - 1, Math.ceil(bgCx + fadeR));
    if (IS_LP) {
        for (let y = yMin; y <= yMax; y++) {
            let dy = y - bgCy;
            for (let x = xMin; x <= xMax; x++) {
                let dx = x - bgCx;
                let d2 = dx * dx + dy * dy;
                if (d2 < fadeR2) {
                    let f = Math.sqrt(d2) / fadeR;
                    f = f * f;
                    bgTrail[y * VW + x] *= f;
                }
            }
        }
    } else {
        for (let y = yMin; y <= yMax; y++) {
            let dy = y - bgCy;
            for (let x = xMin; x <= xMax; x++) {
                let dx = x - bgCx;
                let d2 = dx * dx + dy * dy;
                if (d2 < fadeR2) {
                    let f = Math.sqrt(d2) / fadeR;
                    bgTrail[y * VW + x] *= 0.3 + f * 0.7;
                }
            }
        }
    }

    // ── MS sim step ──
    if (msAgents.length < MS.agentCount) {
        let n = Math.min(MS.spawnRate, MS.agentCount - msAgents.length);
        for (let i = 0; i < n; i++) spawnAgent(msAgents, msCx, msCy, MS.spawnR);
    }
    for (let s = 0; s < boostedMsSteps; s++) {
        for (let a of msAgents) a.step(MS, msTrail, msFoods, MSIZE, MSIZE, densityMap, edgeDistMap);
    }
    let msD = diffuse(msTrail, msTrailPrev, MSIZE, MSIZE, MS.diffusion, MS.decay);
    msTrail = msD.trail; msTrailPrev = msD.trailPrev;

    // ── Render BG ──
    renderTrail(bgOffCtx, bgTrail, VW, VH, BG, BG_COLORS);

    // ── Render mascot ──
    if (formationMode === 3) {
        renderTrailPixel(mascotOffCtx, msTrail, MSIZE, MSIZE, MS, COLORS);
    } else if (formationMode === 4) {
        renderTrailPixel(mascotOffCtx, msTrail, MSIZE, MSIZE, MS, COLORS);
    } else {
        renderTrail(mascotOffCtx, msTrail, MSIZE, MSIZE, MS, COLORS);
    }

    // ── ASCII stencil overlay ──
    let STENCIL_MASTER = _stencilMaster;
    let isBlast = STENCIL_MASTER > 1.0;
    if (stencilGrid && (isBlast || formation > 0) && (formationMode === 1 || formationMode === 2 || formationMode === 4)) {
        let EDGE_STRONG = _edgeStrong;
        let EDGE_WEAK   = _edgeWeak;

        let cw = IS_MOBILE ? 5 : CELL_W;
        let ch_ = IS_MOBILE ? 8 : CELL_H;
        let sCols = Math.floor(MSIZE / cw);
        let sRows = Math.floor(MSIZE / ch_);
        let pulse = Math.sin(pulsePhase);
        let rampShift = pulse * PULSE_RAMP * 0.6;
        let bright = h2r(COLORS[1]), hot = h2r(COLORS[2]);

        mascotOffCtx.font = `${ch_ - 2}px 'Courier New'`;
        mascotOffCtx.textBaseline = 'top';
        mascotOffCtx.textAlign = 'center';

        let origCols = Math.floor(MSIZE / CELL_W);
        let origRows = Math.floor(MSIZE / CELL_H);
        let codeScroll = formationMode === 2 ? Math.floor(msFc * 0.15) : 0;

        for (let row = 0; row < sRows; row++) {
            for (let col = 0; col < sCols; col++) {
                let gridCol = Math.min(origCols - 1, Math.floor((col * cw + cw / 2) / CELL_W));
                let gridRow = Math.min(origRows - 1, Math.floor((row * ch_ + ch_ / 2) / CELL_H));
                let cell = stencilGrid[gridRow * origCols + gridCol];
                if (!cell || cell.a < 0.1) continue;
                if (!isBlast && formation < cell.reveal) continue;

                let isEdge = cell.edge >= EDGE_STRONG;
                let isMidEdge = cell.edge >= EDGE_WEAK;
                let darkThresh = _darkThresh;
                let isDarkFeature = cell.a > 0.3 && cell.lum < darkThresh;
                let cellBlend = isBlast ? 1.0 : Math.min(1, (formation - cell.reveal) / 0.3);
                let lumPulsed = cell.lum + pulse * 0.15;

                let ch;
                let skipCell = false;
                let alphaBoost = 1.0;

                let isDarkFill = isDarkFeature && !isEdge;
                let nearDark = false;
                if (isEdge) {
                    for (let dy = -1; dy <= 1 && !nearDark; dy++) {
                        for (let dx = -1; dx <= 1 && !nearDark; dx++) {
                            let nc = gridCol + dx, nr = gridRow + dy;
                            if (nc >= 0 && nc < origCols && nr >= 0 && nr < origRows) {
                                let neighbor = stencilGrid[nr * origCols + nc];
                                if (neighbor && neighbor.a > 0.3 && neighbor.lum < 0.12) nearDark = true;
                            }
                        }
                    }
                }

                let fillD = _fillDensity;

                if (formationMode === 1) {
                    let edgeBonus = isEdge ? 2 : (isMidEdge ? 1 : 0);
                    let rampIdx = Math.floor((lumPulsed + cell.edge) * (CHAR_RAMP.length - 1) + rampShift + edgeBonus);
                    rampIdx = Math.max(1, Math.min(CHAR_RAMP.length - 1, rampIdx));
                    ch = CHAR_RAMP[rampIdx];
                    if (!isMidEdge && (row + col) % fillD !== 0) { skipCell = true; }
                    alphaBoost = isEdge ? 1.8 : (isMidEdge ? 0.9 : 0.4);
                } else if (formationMode === 2) {
                    let scrollIdx = ((row + codeScroll) * sCols + col) % CODE_LEN;
                    ch = CODE_BUF[scrollIdx];
                    if (ch === ' ') ch = CODE_BUF[(scrollIdx + 7) % CODE_LEN];
                    let codeFillD = Math.max(1, fillD - 1);
                    if (!isMidEdge && (row + col) % codeFillD !== 0) { skipCell = true; }
                    alphaBoost = isEdge ? 2.0 : (isMidEdge ? 1.2 : 0.6);
                } else if (formationMode === 4) {
                    let scrollIdx = ((row + codeScroll) * sCols + col) % CODE_LEN;
                    ch = CODE_BUF[scrollIdx];
                    if (ch === ' ') ch = CODE_BUF[(scrollIdx + 13) % CODE_LEN];
                    let codeFillD = Math.max(1, fillD - 1);
                    if (!isMidEdge && (row + col) % codeFillD !== 0) { skipCell = true; }
                    alphaBoost = isEdge ? 1.5 : (isMidEdge ? 0.8 : 0.4);
                }

                if (isDarkFill) {
                    skipCell = false;
                    alphaBoost = 0.5;
                    if (formationMode === 1) {
                        ch = CHAR_RAMP[Math.max(1, Math.min(3, Math.floor(cell.edge * 4)))];
                    }
                }

                if (nearDark) { alphaBoost = Math.max(alphaBoost, _nearDarkBoost); }

                let blast = STENCIL_MASTER > 1.0;
                if (blast && skipCell) {
                    skipCell = false;
                    let rampIdx = Math.max(1, Math.floor(lumPulsed * (CHAR_RAMP.length - 1)));
                    ch = CHAR_RAMP[Math.min(CHAR_RAMP.length - 1, rampIdx)];
                    alphaBoost = 0.6;
                }
                if (skipCell) continue;

                let r, g, b;
                if (blast) {
                    let t = Math.min(1, lumPulsed * 1.3);
                    if (t < 0.5) {
                        let lt = t / 0.5;
                        r = 60 + 195 * lt; g = 10 + 40 * lt; b = 10 + 30 * lt;
                    } else {
                        let ht = (t - 0.5) / 0.5;
                        r = 255; g = 50 + 205 * ht; b = 40 + 215 * ht;
                    }
                    let whiten = Math.min(0.4, (STENCIL_MASTER - 1.0) * 0.15);
                    r = r + (255 - r) * whiten; g = g + (255 - g) * whiten; b = b + (255 - b) * whiten;
                } else {
                    let colorPush = STENCIL_MASTER * 2.5;
                    let lumT = Math.min(1, lumPulsed * (0.9 + colorPush * 0.3));
                    let hotMix = 0.3 + colorPush * 0.35;
                    let baseMix = 0.5 + colorPush * 0.25;
                    let t = 0.2 + lumT * (0.4 + colorPush * 0.15);
                    if (t > 0.5) {
                        let ht = (t - 0.5) / 0.5;
                        r = bright.r + (hot.r - bright.r) * ht * hotMix;
                        g = bright.g + (hot.g - bright.g) * ht * hotMix;
                        b = bright.b + (hot.b - bright.b) * ht * hotMix;
                    } else {
                        let bt = t / 0.5;
                        r = bright.r * bt * baseMix + bright.r * 0.15;
                        g = bright.g * bt * baseMix + bright.g * 0.15;
                        b = bright.b * bt * baseMix + bright.b * 0.15;
                    }
                }

                let masterAlpha = STENCIL_MASTER * (1 + STENCIL_MASTER);
                let alphaFloor = blast ? 0.3 : 0;
                let finalAlpha = Math.min(1, Math.max(alphaFloor, cellBlend * cell.a * masterAlpha * alphaBoost));
                mascotOffCtx.globalAlpha = finalAlpha;
                mascotOffCtx.fillStyle = `rgb(${r|0},${g|0},${b|0})`;
                mascotOffCtx.fillText(ch, col * cw + Math.floor(cw / 2), row * ch_);
            }
        }
        mascotOffCtx.globalAlpha = 1;
    }

    // ── Ghost opacity computation ──
    let ghostOpacity = IS_LP ? 0 : 1;
    let ghostVisible = !IS_LP;
    if (ghostFadeStart < 0 && msFc > GHOST_HOLD_FRAMES) ghostFadeStart = msFc;
    if (ghostFadeStart > 0) {
        let elapsed = msFc - ghostFadeStart;
        let t = Math.min(1, elapsed / GHOST_FADE_FRAMES);
        ghostOpacity = 1 - t * t * (3 - 2 * t);
        if (ghostOpacity <= 0.001) { ghostVisible = false; ghostOpacity = 0; }
    }

    // ── Resurface opacity — damped breathing pulse ──
    let resurfaceOpacity = 0;
    {
        if (IS_LP) {
            let lpPeak = IS_MOBILE ? LP_PEAK_MOBILE : LP_PEAK_DESKTOP;
            let lpFloor = IS_MOBILE ? LP_FLOOR_MOBILE : LP_FLOOR_DESKTOP;
            if (msFc < LP_FADE_IN) {
                let t = msFc / LP_FADE_IN;
                resurfaceOpacity = lpPeak * t * t * (3 - 2 * t);
            } else {
                let age = msFc - LP_FADE_IN;
                let envelope = Math.exp(-age / LP_DECAY);
                let breath = 0.5 + 0.5 * Math.cos(age * 2 * Math.PI / LP_PULSE_PERIOD);
                resurfaceOpacity = lpFloor + (lpPeak - lpFloor) * envelope * breath;
            }
        } else if (msFc < RESURFACE_FADE_UP) {
            let t = msFc / RESURFACE_FADE_UP;
            resurfaceOpacity = RESURFACE_PEAK * t * t * (3 - 2 * t);
        } else {
            let age = msFc - RESURFACE_FADE_UP;
            let envelope = Math.exp(-age / RESURFACE_DECAY);
            let breath = 0.5 + 0.5 * Math.cos(age * 2 * Math.PI / RESURFACE_PULSE_PERIOD);
            resurfaceOpacity = RESURFACE_FLOOR + (RESURFACE_PEAK - RESURFACE_FLOOR) * envelope * breath;
        }
    }

    // ── Transfer bitmaps ──
    let bgBitmap = bgOffscreen.transferToImageBitmap();
    let mascotBitmap = mascotOffscreen.transferToImageBitmap();

    let msg = {
        type: 'frame',
        bgBitmap,
        mascotBitmap,
        ghostOpacity,
        ghostVisible,
        resurfaceOpacity,
        frameNum: msFc,
    };

    // Include status info on first frame
    if (msFc === 1) {
        msg.statusText = `${seed} \u00b7 ${activePalette.name} \u00b7 ${activeTextureName}`;
    }

    self.postMessage(msg, [bgBitmap, mascotBitmap]);
}

// ═══════════════════════════════════════════════════════════════
//  MESSAGE HANDLER
// ═══════════════════════════════════════════════════════════════

self.onmessage = function(e) {
    let msg = e.data;
    switch (msg.type) {
        case 'init': {
            seed = msg.seed;
            IS_MOBILE = msg.IS_MOBILE;
            IS_LP = msg.IS_LP || false;
            VW = msg.VW;
            VH = msg.VH;
            MSIZE = msg.MSIZE;
            formationMode = msg.formationMode || 1;
            maskImageData = msg.maskImageData || null;

            // Apply params
            if (msg.params) {
                _stencilMaster = msg.params.stencilMaster ?? 0.28;
                _pulseSpeed = msg.params.pulseSpeed ?? PULSE_SPEED;
                _stencilEnd = msg.params.stencilEnd ?? STENCIL_END;
                _edgeStrong = msg.params.edgeStrong ?? 0.3;
                _edgeWeak = msg.params.edgeWeak ?? 0.12;
                _edgeFadeDepth = msg.params.edgeFadeDepth ?? 30;
                _darkThresh = msg.params.darkThresh ?? 0.12;
                _nearDarkBoost = msg.params.nearDarkBoost ?? 2.5;
                _fillDensity = msg.params.fillDensity ?? 3;
                _blastTarget = msg.params.blastTarget ?? 0.28;
            }

            // Detect blast-on-load (stencilMaster > 1.0 means main thread set blast)
            if (_stencilMaster > 1.0) {
                _blastOnLoad = true;
                _trailBoost = 4.0;
            }

            // Apply LP scaling — full BG for rich filaments, lean mascot
            if (IS_LP) {
                // BG unchanged (8000 agents, full speed)
                MS.agentCount = Math.round(5500 * 0.40);
                MS.stepsPerFrame = Math.max(2, Math.round(5 * 0.50));
                MS.spawnRate = Math.round(70 * 0.40);
                MS.initialBatch = Math.round(1400 * 0.40);
                MS.trailBright = 2.4 * 1.4;
                // Mobile LP: pixel mold instead of chunky ASCII
                if (IS_MOBILE) {
                    formationMode = 3;
                }
            } else if (IS_MOBILE) {
                BG.agentCount = Math.round(8000 * 0.60);
                MS.agentCount = Math.round(5500 * 0.60);
                BG.stepsPerFrame = Math.max(3, Math.round(5 * 0.65));
                MS.stepsPerFrame = Math.max(3, Math.round(5 * 0.65));
                BG.spawnRate = Math.round(140 * 0.60);
                MS.spawnRate = Math.round(70 * 0.60);
                BG.initialBatch = Math.round(3000 * 0.60);
                MS.initialBatch = Math.round(1400 * 0.60);
                BG.trailBright = 1.3 * 1.4;
                MS.trailBright = 2.4 * 1.4;
                if (_stencilMaster === 0.28) _stencilMaster = 0.7;
            }

            // Apply BG/MS overrides from main thread
            if (msg.bgParams) Object.assign(BG, msg.bgParams);
            if (msg.msParams) Object.assign(MS, msg.msParams);

            initAll();

            // Send ready with ghost bitmap and palette info
            let ghostBitmap = ghostOffscreen.transferToImageBitmap();
            self.postMessage({
                type: 'ready',
                ghostBitmap,
                paletteName: activePalette.name,
                textureName: activeTextureName,
                chromaticWarm: activePalette.chromatic[0],
                chromaticCool: activePalette.chromatic[1],
                bgParams: { ...BG },
                msParams: { ...MS },
            }, [ghostBitmap]);
            break;
        }

        case 'tick':
            handleTick();
            break;

        case 'blast':
            _blastOnLoad = false; // manual blast cancels LP fade
            if (msg.active) {
                _stencilMaster = 3.0;
                _trailBoost = 4.0;
            } else {
                _stencilMaster = msg.savedMaster ?? 0.28;
                _trailBoost = 1.0;
            }
            break;

        case 'updateParams':
            switch (msg.key) {
                case 'stencilMaster': _stencilMaster = msg.value; break;
                case 'pulseSpeed': _pulseSpeed = msg.value; break;
                case 'stencilEnd': _stencilEnd = msg.value; break;
                case 'edgeStrong': _edgeStrong = msg.value; break;
                case 'edgeWeak': _edgeWeak = msg.value; break;
                case 'edgeFadeDepth': _edgeFadeDepth = msg.value; break;
                case 'darkThresh': _darkThresh = msg.value; break;
                case 'nearDarkBoost': _nearDarkBoost = msg.value; break;
                case 'fillDensity': _fillDensity = msg.value; break;
            }
            break;

        case 'updateSimParam': {
            let target = msg.target === 'BG' ? BG : MS;
            target[msg.key] = msg.value;
            break;
        }

        case 'setMode':
            formationMode = msg.mode;
            break;

        case 'restart':
            seed = msg.seed;
            if (msg.maskImageData) maskImageData = msg.maskImageData;
            initAll();
            let ghostBmp = ghostOffscreen.transferToImageBitmap();
            self.postMessage({
                type: 'ready',
                ghostBitmap: ghostBmp,
                paletteName: activePalette.name,
                textureName: activeTextureName,
                chromaticWarm: activePalette.chromatic[0],
                chromaticCool: activePalette.chromatic[1],
                bgParams: { ...BG },
                msParams: { ...MS },
            }, [ghostBmp]);
            break;

        case 'resize':
            VW = msg.VW;
            VH = msg.VH;
            MSIZE = msg.MSIZE;
            if (msg.maskImageData) maskImageData = msg.maskImageData;
            initAll();
            let gBmp = ghostOffscreen.transferToImageBitmap();
            self.postMessage({
                type: 'ready',
                ghostBitmap: gBmp,
                paletteName: activePalette.name,
                textureName: activeTextureName,
                chromaticWarm: activePalette.chromatic[0],
                chromaticCool: activePalette.chromatic[1],
                bgParams: { ...BG },
                msParams: { ...MS },
            }, [gBmp]);
            break;
    }
};
