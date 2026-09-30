// Wiki Roulette #021 — Whale fall: bespoke CINE visuals (loaded by cine.html)
function skeleton(x, y, s, t, o = {}) {       // spine, ribs, skull, flukes' bones — lying on its side
  g.save(); g.translate(x, y); g.scale(s, s); g.lineCap = 'round'; g.strokeStyle = o.color || BONE; g.fillStyle = o.color || BONE;
  g.globalAlpha *= o.alpha ?? 1;
  for (let i = 0; i < 26; i++) { const vx = 180 - i * 20, vy = Math.sin(i * 0.25) * 6, r = lerp(11, 4, i / 26);
    g.beginPath(); g.ellipse(vx, vy, r * 0.9, r * 1.4, 0, 0, 6.283); g.fill(); }
  for (let i = 0; i < 11; i++) { const rx = 150 - i * 22, len = 70 - Math.abs(i - 4) * 4;
    g.lineWidth = 7; g.beginPath(); g.moveTo(rx, 4); g.quadraticCurveTo(rx - 22, len * 0.6, rx - 8, len); g.stroke(); }
  g.beginPath(); g.moveTo(190, -14); g.bezierCurveTo(260, -34, 330, -20, 350, 2); g.bezierCurveTo(330, 22, 260, 30, 190, 16); g.closePath(); g.fill();
  g.lineWidth = 8; g.beginPath(); g.moveTo(200, 16); g.quadraticCurveTo(290, 46, 352, 14); g.stroke();
  g.lineWidth = 6; g.beginPath(); g.moveTo(100, 20); g.lineTo(60, 80); g.moveTo(96, 24); g.lineTo(44, 74); g.stroke();
  g.restore();
}
// bone anchor points in skeleton-local coords (for worms, mats)
const BONEPTS = []; { for (let i = 0; i < 26; i++) BONEPTS.push([180 - i * 20, Math.sin(i * 0.25) * 6 - 10]);
  for (let i = 0; i < 11; i++) { const rx = 150 - i * 22, len = 70 - Math.abs(i - 4) * 4; BONEPTS.push([rx - 14, len * 0.55]); } }


// ---- OPEN: hook + a whale sinking through light
VIS.open = (K) => {
  K(0.15, 'sonar', 0.7); K(3.1, 'bubble', 0.6);
  return (t) => {
    sea('#11405E', '#04070A'); lightRays(t, 1); marineSnow(t, -18, 0.8);
    { const gr = g.createLinearGradient(0, 250, 0, 900); gr.addColorStop(0, 'rgba(4,7,10,0.45)'); gr.addColorStop(1, 'rgba(4,7,10,0)'); g.fillStyle = gr; g.fillRect(0, 0, W, 900); }
    tag(t); hook(t, EP.hook, 500);
    const y = 1110 + t * 22, rot = 0.18 + Math.sin(t * 0.5) * 0.02;
    whale(560, y, 1.35, rot, '#1B3B4E', { rim: 'rgba(160,225,240,0.6)', eye: true });
    bubbles(t, 700, y - 60, 10, 3, -1.2, 120);
  };
};
// ---- 1: the long fall
VIS[0] = (K) => {
  for (let m = 100; m <= 1000; m += 100) K(1.0 + 3.0 * (m / 1000) ** 0.8, 'tick', m % 500 ? 0.4 : 0.9);
  K(4.1, 'hit', 0.6); K(4.1, 'mute', 1, 0.6);
  return (t) => {
    const u = clamp((tq(t) - 1.0) / 3.0) ** 1.25, depth = 1000 * u, dark = clamp((t - 3.9) / 0.6);
    const top = `rgb(${lerp(14, 4, u) | 0},${lerp(53, 8, u) | 0},${lerp(80, 12, u) | 0})`;
    sea(top, '#020304'); lightRays(t, 1 - u * 1.2); marineSnow(t, -90 - 260 * u, 1);
    // depth ruler scrolling past
    g.save(); g.strokeStyle = 'rgba(200,230,240,0.35)'; g.fillStyle = 'rgba(200,230,240,0.55)'; g.font = F.mono(24); g.textAlign = 'left';
    const pxPerM = 3.2, base = 900 - depth * pxPerM;
    for (let m = 0; m <= 1100; m += 50) { const y = base + m * pxPerM; if (y < 330 || y > 1450) continue;
      g.lineWidth = m % 100 ? 2 : 4; g.beginPath(); g.moveTo(80, y); g.lineTo(m % 100 ? 104 : 130, y); g.stroke(); if (!(m % 100)) g.fillText(m + ' m', 142, y + 8); }
    g.restore();
    const wy = 860 + Math.sin(t * 1.1) * 10;
    whale(600, wy, 1.05, 0.28 + Math.sin(t * 0.6) * 0.03, '#15293A', { rim: `rgba(140,210,230,${0.45 * (1 - u)})`, eye: true });
    g.fillStyle = `rgba(0,0,0,${0.85 * dark})`; g.fillRect(0, 0, W, H);
    if (dark > 0) whale(600, wy, 1.05, 0.28 + Math.sin(t * 0.6) * 0.03, 'rgba(0,0,0,0)', { rim: `rgba(140,210,230,${0.25 * dark})` });
    tag(t, 0, 6);
    g.save(); g.font = F.disp(150); g.textAlign = 'right'; g.fillStyle = u >= 1 ? GOLD : TXT; g.fillText(fmt(depth), 1000, 560);
    g.font = F.mono(34); g.letterSpacing = '6px'; g.fillStyle = TXT; g.fillText('METERS DOWN', 1000, 620); g.restore();
    chip('NO SUNLIGHT', 1000 - 130, 690, t, 4.3, { size: 28 });
  };
};
// ---- 2: scavengers
const HAG = []; { const r = rng(77); for (let i = 0; i < 24; i++) { const side = r() < 0.5 ? -1 : 1;
  HAG.push({ sx: side < 0 ? -120 : W + 120, sy: 700 + r() * 500, tx: 280 + r() * 520, ty: 840 + r() * 170, t0: 0.8 + r() * 1.5, ph: r() * 6, len: 70 + r() * 40 }); } }
function hagfish(x, y, ang, len, t, ph) {
  g.save(); g.translate(x, y); g.rotate(ang); g.strokeStyle = '#B08A80'; g.lineCap = 'round'; g.lineWidth = 9; g.beginPath();
  for (let i = 0; i <= 10; i++) { const u = i / 10, px = -u * len, py = Math.sin(t * 12 + ph - u * 5) * 9 * u; i ? g.lineTo(px, py) : g.moveTo(px, py); }
  g.stroke(); g.restore();
}
function shark(x, y, s) {
  g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = '#3A4854'; g.beginPath();
  g.moveTo(160, 0); g.bezierCurveTo(140, -40, 0, -46, -120, -18); g.lineTo(-190, -50); g.lineTo(-175, 0); g.lineTo(-195, 40); g.lineTo(-120, 16);
  g.bezierCurveTo(0, 42, 140, 34, 160, 0); g.fill(); g.beginPath(); g.moveTo(20, -40); g.lineTo(-10, -70); g.lineTo(-30, -38); g.fill(); g.restore();
}
VIS[1] = (K) => {
  K(0.6, 'pop', 0.6, 400); for (let i = 0; i < 6; i++) K(0.9 + i * 0.22, 'swish', 0.25); K(2.7, 'hit', 0.7);
  return (t) => {
    sea('#07131B', '#020405'); marineSnow(t, 20, 0.6); spotlight(620, 860, 700, 1); seafloor(1010, t);
    const eaten = clamp((t - 2.9) / 2.8);
    skeleton(560, 930, 1.25, t, { alpha: 0.2 + 0.8 * eaten });
    whale(560, 930, 1.3, 0.04, FLESH, { alpha: 1 - 0.8 * eaten, eye: true });
    const sx = lerp(-300, W + 300, clamp((t - 1.4) / 4.2));
    if (t > 1.4) shark(sx, 720, 1.1);
    for (const h of HAG) { const p = ease((t - h.t0) / 1.2); if (p <= 0) continue;
      const x = lerp(h.sx, h.tx, p) + Math.sin(t * 2 + h.ph) * 16 * p, y = lerp(h.sy, h.ty, p) + Math.cos(t * 2.4 + h.ph) * 10 * p;
      const ang = p < 1 ? Math.atan2(h.ty - h.sy, h.tx - h.sx) : Math.sin(t * 3 + h.ph) * 1.2 + (h.tx > 560 ? 0 : Math.PI);
      hagfish(x, y, ang, h.len, t, h.ph); }
    tag(t, 1, 6);
    chip('STAGE 1 · MONTHS TO 1.5 YEARS', 80, 400, t, 0.5, { size: 28, align: 'left' });
    const c = spring(t - 2.7, 260, 18); if (c > 0) { g.save(); g.translate(80, 590); g.scale(c, c);
      text('60 KG', 0, 0, 'disp', 170, GOLD, { shadow: true }); text('OF FLESH A DAY', 8, 60, 'mono', 32, TXT, { ls: 5 }); g.restore(); }
  };
};
// ---- 3: bone-eating worms
const WORMS = []; { const r = rng(31); for (let i = 0; i < 46; i++) { const b = BONEPTS[Math.floor(r() * BONEPTS.length)]; WORMS.push({ bx: b[0] + (r() - 0.5) * 10, by: b[1], t0: 0.8 + r() * 1.6, h: 14 + r() * 16, ph: r() * 6 }); } }
function worm(x, y, h, g0, t, ph) {
  if (g0 <= 0) return; const hh = h * g0, sw = Math.sin(t * 2.2 + ph) * 0.25;
  g.strokeStyle = '#D9C9B0'; g.lineWidth = 1.6; g.beginPath(); g.moveTo(x, y); g.lineTo(x + sw * hh, y - hh); g.stroke();
  g.strokeStyle = '#E8473B'; g.lineWidth = 2.2;
  for (let k = 0; k < 4; k++) { const a = -Math.PI / 2 + (k - 1.5) * 0.45 + sw + Math.sin(t * 3 + ph + k) * 0.12;
    g.beginPath(); g.moveTo(x + sw * hh, y - hh); g.quadraticCurveTo(x + sw * hh + Math.cos(a) * 8 * g0, y - hh + Math.sin(a) * 8 * g0, x + sw * hh + Math.cos(a + 0.3) * 13 * g0, y - hh + Math.sin(a + 0.3) * 13 * g0); g.stroke(); }
}
VIS[2] = (K) => {
  K(0.6, 'pop', 0.6, 500); for (let i = 0; i < 8; i++) K(0.9 + i * 0.2, 'tick', 0.5); K(2.3, 'bubble', 0.9); K(2.6, 'bubble', 0.7);
  return (t) => {
    sea('#07131B', '#020405'); marineSnow(t, 16, 0.5); spotlight(540, 860, 620, 1);
    const zoom = lerp(2.2, 2.45, clamp(t / 5)), cx = 470, cy = 990;
    g.save(); g.translate(cx, cy); g.scale(zoom, zoom); g.translate(-60, -20);
    skeleton(0, 0, 1, t);
    const acid = clamp((t - 2.3) / 1.5);
    if (acid > 0) { const r = rng(5); g.fillStyle = 'rgba(40,30,20,0.55)'; for (let i = 0; i < 70 * acid; i++) { const b = BONEPTS[Math.floor(r() * BONEPTS.length)]; g.beginPath(); g.arc(b[0] + (r() - 0.5) * 14, b[1] + 10 + (r() - 0.5) * 12, 1 + r() * 2.2, 0, 6.283); g.fill(); } }
    for (const w of WORMS) worm(w.bx, w.by, w.h, spring(t - w.t0, 180, 16), t, w.ph);
    g.restore();
    if (t > 2.3) { const r = rng(9); for (let i = 0; i < 6; i++) { const b = BONEPTS[Math.floor(r() * BONEPTS.length)];
      bubbles(t, cx + (b[0] - 60) * zoom, cy + (b[1] - 20) * zoom, 5, 40 + i, 2.3 + i * 0.1, 30); } }
    tag(t, 2, 6);
    chip('STAGE 2 · UP TO 4.5 YEARS', 80, 400, t, 0.5, { size: 28, align: 'left' });
    rise('OSEDAX', 80, 580, 'disp', 150, '#E8473B', t, 1.2);
    rise('THE BONE-EATING WORM', 84, 650, 'mono', 32, TXT, t, 1.4, { stagger: 0.04 });
    chip('ACID', 820, 1130, t, 2.6, { size: 32, bg: '#B6F25A' });
  };
};
// ---- 4: bacteria, fifty to a hundred years
const MATS = []; { const r = rng(61); for (let i = 0; i < 420; i++) { const b = BONEPTS[Math.floor(r() * BONEPTS.length)]; MATS.push({ x: b[0] + (r() - 0.5) * 22, y: b[1] + 8 + (r() - 0.5) * 22, t0: 0.8 + r() * 1.8, s: 1 + r() * 2.5 }); } }
const CLAMS = []; { const r = rng(62); for (let i = 0; i < 26; i++) CLAMS.push({ x: -280 + r() * 700, y: 95 + r() * 40, t0: 2.0 + r() * 1.2, s: 0.7 + r() * 0.6 }); }
VIS[3] = (K) => {
  K(0.6, 'pop', 0.6, 600); K(1.0, 'riser', 0.4, 1.4); K(2.95, 'land', 0.6); for (let y = 51; y <= 100; y++) K(3.75 + 1.0 * ((y - 50) / 50) ** 0.7, 'tick', y % 10 ? 0.35 : 0.8); K(4.8, 'hit', 0.7);
  return (t) => {
    sea('#07131B', '#020405'); marineSnow(t, 14, 0.5); spotlight(540, 960, 700, 0.9); seafloor(1060, t);
    const glow = clamp((t - 0.8) / 2);
    g.save(); g.translate(560, 990); g.scale(1.45, 1.45);
    skeleton(0, 0, 1, t);
    g.globalCompositeOperation = 'lighter';
    for (const m of MATS) { const p = spring(t - m.t0, 120, 16); if (p <= 0) continue; g.fillStyle = `rgba(210,240,230,${0.16 * clamp(p)})`;
      g.beginPath(); g.arc(m.x, m.y, m.s * 2.2 * clamp(p), 0, 6.283); g.fill(); }
    g.globalCompositeOperation = 'source-over';
    for (const c of CLAMS) { const p = spring(t - c.t0, 260, 18); if (p <= 0) continue;
      g.save(); g.translate(c.x, c.y); g.scale(c.s * p, c.s * p); g.fillStyle = '#3F4A52'; g.beginPath(); g.ellipse(0, 0, 11, 6, 0.2, 0, 6.283); g.fill();
      g.strokeStyle = '#8FA3AE'; g.lineWidth = 1.5; g.stroke(); g.restore(); }
    g.restore();
    if (glow > 0) spotlight(560, 990, 520, glow * 0.6);
    tag(t, 3, 6);
    chip('STAGE 3 · BACTERIA', 80, 400, t, 0.5, { size: 28, align: 'left' });
    const yrs = t < 3.75 ? 50 : Math.floor(50 + 50 * clamp((tq(t) - 3.75) / 1.0) ** (1 / 0.7) + 1e-6), s = spring(t - 2.9, 260, 18);
    if (s > 0) { g.save(); g.translate(80, 640); g.scale(s, s);
      text(String(yrs), 0, 0, 'disp', 220, yrs >= 100 ? GOLD : TXT, { shadow: true });
      g.font = F.disp(220); const w = g.measureText(String(yrs)).width; text('YEARS', w + 24, -18, 'mono', 44, TXT, { ls: 6 });
      text(yrs >= 100 ? 'MAYBE' : '', w + 24, -80, 'mono', 30, GOLD, { ls: 4 }); g.restore(); }
  };
};
// ---- 5: whaling
VIS[4] = (K) => {
  K(0.5, 'swish', 0.5); for (let i = 0; i < 15; i++) K(1.05 + i * 0.06, 'tick', 0.7); K(2.35, 'whoosh', 0.6);
  K(3.9, 'mute', 1, 0.7); for (let i = 0; i < 31; i++) K(4.0 + i * 0.025, 'tick', 0.35); K(4.75, 'thump', 1.2);
  const LIFE = []; { const r = rng(501); for (let i = 0; i < 100; i++) LIFE.push({ i, k: r() }); LIFE.sort((a, b) => a.k - b.k); LIFE.forEach((o, j) => o.dead = j < 31); }
  return (t) => {
    sea('#081018', '#020304'); marineSnow(t, 16, 0.5); tag(t, 4, 6);
    const sw = spring(t - 2.4, 180, 26);
    if (sw < 0.999) { g.save(); g.globalAlpha = clamp(1 - sw); g.translate(-300 * sw, 0);
      for (let i = 0; i < 15; i++) { const col = i % 3, row = Math.floor(i / 3), x = 260 + col * 290, y = 470 + row * 150 + (col % 2) * 30;
        const gone = spring(t - (1.05 + i * 0.06), 300, 22);
        whale(x + Math.sin(t + i) * 8, y, 0.32, 0.05, TEAL, { alpha: 1 - 0.8 * clamp(gone) });
        if (gone > 0) { g.save(); g.translate(x, y); g.scale(gone, gone); g.strokeStyle = RED; g.lineWidth = 9; g.lineCap = 'round';
          g.beginPath(); g.moveTo(-50, -50); g.lineTo(50, 50); g.moveTo(50, -50); g.lineTo(-50, 50); g.stroke(); g.restore(); } }
      g.restore(); }
    if (sw > 0.001) { g.save(); g.globalAlpha = clamp(sw); g.translate(300 * (1 - sw), 0);
      text('LIFE IN THE DEEP SEA', 80, 450, 'mono', 32, TEAL, { ls: 5 });
      LIFE.forEach((o) => { const col = o.i % 10, row = Math.floor(o.i / 10), x = 125 + col * 92, y = 510 + row * 52;
        const d = o.dead ? clamp((t - 4.0 - LIFE.indexOf(o) * 0.025) / 0.25) : 0;
        g.save(); g.translate(x, y + Math.sin(t * 2 + o.i) * 3); g.globalAlpha *= 1 - 0.75 * d;
        g.fillStyle = d > 0.5 ? RED : TEAL; g.beginPath(); g.ellipse(0, 0, 22, 11, 0, 0, 6.283); g.fill();
        g.beginPath(); g.moveTo(-18, 0); g.lineTo(-34, -11); g.lineTo(-34, 11); g.closePath(); g.fill(); g.restore(); });
      const s = spring(t - 4.75, 280, 16); if (s > 0) { g.save(); g.translate(540, 1140); g.scale(s, s); text('−30%+', 0, 0, 'disp', 170, RED, { align: 'center', shadow: true }); g.restore(); }
      g.restore(); }
    chip('ESTIMATE', 1000 - 90, 450, t, 4.9, { size: 24, bg: '#2B2A28', fg: TXT });
  };
};
// ---- 6: 690,000 of them, right now
let FALLS = null;
function oceanPoints() {
  const x = document.createElement('canvas').getContext('2d'), r = rng(690), pts = [];
  while (pts.length < 520) { const lo = -180 + r() * 360, la = -60 + r() * 128;
    if (!x.isPointInPath(MAPPATH, lo * MAPCOS, -la)) pts.push([lo, la, r()]); }
  return pts.sort((a, b) => a[2] - b[2]);
}
VIS[5] = (K) => {
  K(0.5, 'sonar', 0.8); K(0.8, 'riser', 0.5, 2.6); for (let i = 0; i < 24; i++) K(0.8 + i * 0.1, 'tick', 0.35); K(3.35, 'hit', 1); K(3.4, 'sonar', 0.6);
  if (!FALLS) FALLS = oceanPoints();
  return (t) => {
    atmosphere(t, { x: 540, y: 900, r: 900, c: 'rgba(67,198,217,0.08)' });
    const cam = mapCam(10, 5, 360, 930);
    g.save(); cam.apply(); g.fillStyle = '#1B1A18'; g.fill(MAPPATH); g.strokeStyle = '#3A362F'; g.lineWidth = 1 / cam.k; g.stroke(MAPPATH); g.restore();
    const u = clamp((tq(t) - 0.8) / 2.5);
    FALLS.forEach((p, i) => { const ti = 0.8 + 2.5 * (i / FALLS.length); if (t < ti) return; const [x, y] = cam.P(p[0], p[1]), a = spring(t - ti, 300, 20);
      g.fillStyle = i % 9 ? TEAL : GOLD; g.globalAlpha = 0.85; g.beginPath(); g.arc(x, y, 3.2 * a, 0, 6.283); g.fill(); });
    g.globalAlpha = 1;
    const land = t - 3.35; if (land > 0) for (let r = 0; r < 2; r++) { const ph = clamp(land * 0.9 - r * 0.3); if (ph <= 0 || ph >= 1) continue;
      g.strokeStyle = TEAL; g.globalAlpha = (1 - ph) * 0.5; g.lineWidth = 4; g.beginPath(); g.arc(540, 930, 60 + ph * 700, 0, 6.283); g.stroke(); g.globalAlpha = 1; }
    tag(t, 5, 6);
    text('RIGHT NOW, ON THE OCEAN FLOOR', 80, 420, 'mono', 30, TEAL, { ls: 4, alpha: (t - 0.45) * 3 });
    const n = 690000 * ease(u), pop = land > 0 ? 1 + 0.1 * Math.exp(-land * 5) * Math.cos(land * 16) : 1;
    g.save(); g.translate(80, 580); g.scale(pop, pop); text(fmt(Math.round(n / 1000) * 1000), 0, 0, 'disp', 170, land > 0 ? GOLD : TXT, { shadow: true }); g.restore();
    text('WHALE FALLS · ESTIMATE', 84, 640, 'mono', 30, TXT, { ls: 4, alpha: (t - 3.4) * 3 });
  };
};
