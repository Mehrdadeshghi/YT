// Wiki Roulette #024 — Bobbit worm: bespoke CINE visuals
const SAND = '#3B3226', SAND2 = '#2A231B', PURP = ['#5B3A6E', '#734A82'], SHEEN = 'rgba(120,230,220,0.35)';
function fish(x, y, s, dir = 1, t = 0) {
  g.save(); g.translate(x, y); g.scale(s * dir, s); const wag = Math.sin(t * 10) * 0.25;
  g.fillStyle = '#E8B84A'; g.beginPath(); g.moveTo(40, 0); g.bezierCurveTo(30, -22, -20, -24, -30, 0); g.bezierCurveTo(-20, 24, 30, 22, 40, 0); g.fill();
  g.save(); g.translate(-28, 0); g.rotate(wag); g.beginPath(); g.moveTo(0, 0); g.lineTo(-26, -18); g.lineTo(-22, 0); g.lineTo(-26, 18); g.closePath(); g.fill(); g.restore();
  g.fillStyle = '#1a1714'; g.beginPath(); g.arc(24, -5, 3.5, 0, 6.283); g.fill(); g.restore();
}
function wormBody(pts, w0, t, alpha = 1) {
  g.save(); g.globalAlpha *= alpha;
  for (let i = pts.length - 1; i >= 0; i--) { const [x, y] = pts[i], u = i / (pts.length - 1), w = w0 * (0.55 + 0.45 * Math.sin(Math.PI * Math.min(1, u * 1.3 + 0.1)));
    g.fillStyle = PURP[i % 2]; g.beginPath(); g.ellipse(x, y, w * 0.62, w * 0.62, 0, 0, 6.283); g.fill();
    g.fillStyle = SHEEN; g.beginPath(); g.ellipse(x - w * 0.15, y - w * 0.22, w * 0.25, w * 0.12, 0, 0, 6.283); g.fill(); }
  g.restore();
}
function antennae(x, y, t, s = 1, stir = 0) {
  g.save(); g.translate(x, y); g.scale(s, s); g.lineCap = 'round';
  for (let k = 0; k < 5; k++) { const base = (k - 2) * 7, len = k === 2 ? 70 : 52 - Math.abs(k - 2) * 4;
    for (let j = 0; j < 8; j++) { const u0 = j / 8, u1 = (j + 1) / 8, sw = Math.sin(t * 1.6 + k) * 0.25 + stir * Math.sin(t * 12 + k) * 0.3, ang = (k - 2) * 0.28 + sw;
      g.strokeStyle = j % 2 ? '#E9E2D2' : '#4B3A30'; g.lineWidth = 5 * (1 - u0 * 0.6);
      g.beginPath(); g.moveTo(base + Math.sin(ang) * len * u0, -len * u0 * Math.cos(ang * 0.6)); g.lineTo(base + Math.sin(ang) * len * u1, -len * u1 * Math.cos(ang * 0.6)); g.stroke(); } }
  g.restore();
}
function jaws(x, y, open, s = 1) {                   // two hooked mandibles; open 0..1
  g.save(); g.translate(x, y); g.scale(s, s);
  for (const side of [-1, 1]) { g.save(); g.scale(side, 1); g.rotate(open * 0.7);
    g.fillStyle = '#1E1612'; g.strokeStyle = '#C9A46A'; g.lineWidth = 3; g.beginPath(); g.moveTo(4, 0); g.bezierCurveTo(30, -10, 44, -50, 20, -80); g.bezierCurveTo(28, -50, 18, -24, 2, -18); g.closePath(); g.fill(); g.stroke();
    for (let k = 0; k < 4; k++) { g.beginPath(); g.moveTo(14 + k * 3, -24 - k * 13); g.lineTo(8 + k * 2, -28 - k * 13); g.stroke(); } g.restore(); }
  g.restore();
}
function sandFloor(y, t, o = {}) {
  const gr = g.createLinearGradient(0, y, 0, H); gr.addColorStop(0, SAND); gr.addColorStop(1, '#120F0B'); g.fillStyle = gr;
  g.beginPath(); g.moveTo(0, y); for (let x = 0; x <= W; x += 20) g.lineTo(x, y + Math.sin(x / 60) * 5); g.lineTo(W, H); g.lineTo(0, H); g.fill();
  const r = rng(o.seed || 9); g.fillStyle = 'rgba(255,240,210,0.07)'; for (let i = 0; i < 260; i++) g.fillRect(r() * W, y + 8 + r() * (H - y), 2, 2);
}
const BURIED = (() => { const p = []; for (let i = 0; i <= 90; i++) { const u = i / 90; p.push([560 - 380 * u + 60 * Math.sin(u * 9), 1060 + 200 * u + 50 * Math.sin(u * 13)]); } return p; })();

function human(x, ground, h, col) {      // a slim standing silhouette, h px tall
  if (h < 4) return; const r = h * 0.065; g.fillStyle = col;
  g.beginPath(); g.arc(x, ground - h + r, r, 0, 6.283); g.fill();
  g.beginPath(); g.roundRect(x - h * 0.105, ground - h * 0.84, h * 0.21, h * 0.4, h * 0.05); g.fill();
  g.beginPath(); g.roundRect(x - h * 0.098, ground - h * 0.47, h * 0.085, h * 0.47, h * 0.03); g.roundRect(x + h * 0.013, ground - h * 0.47, h * 0.085, h * 0.47, h * 0.03); g.fill();
  g.beginPath(); g.roundRect(x - h * 0.15, ground - h * 0.82, h * 0.05, h * 0.37, h * 0.025); g.roundRect(x + h * 0.1, ground - h * 0.82, h * 0.05, h * 0.37, h * 0.025); g.fill();
}
// ---- OPEN
VIS.open = (K) => {
  K(2.2, 'thump', 0.5);
  return (t) => {
    sea('#0B2230', '#040709'); lightRays(t, 0.5); marineSnow(t, 14, 0.7); sandFloor(1050, t);
    wormBody(BURIED, 40, t, 0.13);
    antennae(560, 1052, t, 1.6);
    fish(200 + t * 60, 900 + Math.sin(t * 1.3) * 12, 1.2, 1, t);
    photo(t, 'worm', 80, 840, 920, 500, { zoom: [1, 1.1], dur: 4.5 });
    tag(t); hook(t, EP.hook, 500);
  };
};
// ---- 0: it buries its whole body
VIS[0] = (K) => {
  K(0.5, 'pop', 0.7, 400); K(1.6, 'riser', 0.5, 1.2); K(2.8, 'thump', 0.8);
  return (t) => {
    sea('#0B2230', '#040709'); marineSnow(t, 12, 0.5); sandFloor(760, t, { seed: 4 });
    const rv = clamp((t - 1.6) / 1.2), pts = BURIED.map(([x, y]) => [x + 20, y - 190]);
    g.save(); g.beginPath(); g.rect(0, 0, W * ease(rv) + 1, H); g.clip();
    g.fillStyle = 'rgba(10,8,6,0.55)'; g.fillRect(0, 770, W, H);
    wormBody(pts, 46, t, 1); g.restore();
    antennae(580, 762, t, 1.4);
    if (rv > 0.9) { g.strokeStyle = GOLD; g.lineWidth = 3; g.setLineDash([10, 10]); g.beginPath(); g.moveTo(170, 1180); g.lineTo(640, 1180); g.stroke(); g.setLineDash([]); label('UP TO ~3 M', 180, 1224, t, 3.0, { color: GOLD }); }
    tag(t, 0, 5);
    rise('BOBBIT', 80, 520, 'disp', 170, TXT, t, 0.45); rise('WORM', 80, 690, 'disp', 170, '#B98AD0', t, 0.55);
    label('EUNICE APHRODITOIS', 84, 380, t, 1.0, { size: 26, color: DIM });
  };
};
// ---- 1: only the antennae
VIS[1] = (K) => {
  K(0.5, 'swish', 0.4); K(2.0, 'riser', 0.6, 2.5);
  return (t) => {
    sea('#0B2230', '#040709'); lightRays(t, 0.35); marineSnow(t, 10, 0.6); sandFloor(1000, t);
    antennae(560, 1002, t, 3.2, clamp((t - 3.2) / 1));
    fish(lerp(-120, 360, ease((t - 0.8) / 3.8)), 820 + Math.sin(t * 1.6) * 16, 1.6, 1, t);
    tag(t, 1, 5); chip('5 ANTENNAE', 560, 700, t, 1.0, { size: 30 });
    rise('AND IT WAITS.', 80, 520, 'disp', fit('AND IT WAITS.', 'disp', 150, 920), TXT, t, 2.0, { colors: [TXT, TXT, GOLD] });
  };
};
// ---- 2: the strike
VIS[2] = (K) => {
  K(1.25, 'mute', 1, 0.35); K(1.6, 'whoosh', 1); K(1.62, 'hit', 1.1); K(1.75, 'crack', 0.7); K(2.05, 'thump', 0.7); K(2.4, 'bubble', 0.8); for (let i = 0; i < 4; i++) K(2.9 + i * 0.4, 'click', 0.8);
  return (t) => {
    const st = 1.6, up = t < st ? 0 : spring(t - st, 900, 30) * (1 - spring(t - 2.05, 200, 26));
    g.save(); g.translate(shake(t, st, 26), shake(t, st, 10));
    sea('#0B2230', '#040709'); marineSnow(t, 10, 0.6); sandFloor(1000, t);
    const caught = t > st + 0.12, fx = caught ? 560 : lerp(380, 540, ease((t - 0.3) / 1.2)), fy = caught ? 1000 - 420 * up - 40 : 830 + Math.sin(t * 1.6) * 10;
    if (up > 0.01) { const pts = []; for (let i = 0; i <= 40; i++) { const u = i / 40; pts.push([560 + Math.sin(u * 6 + t * 3) * 14 * u, 1000 - 420 * up * (1 - u) + u * 60]); } wormBody(pts, 58, t, 1);
      jaws(560, 1000 - 420 * up - 10, caught ? 0.05 : 1, 1.4); }
    else antennae(560, 1002, t, 3.2, 1);
    if (!caught || up > 0.05) fish(fx, fy, 1.6, 1, t);
    g.restore(); flash(t, st, 0.5, 0.12);
    if (t > 2.3) bubbles(t, 560, 990, 16, 5, 2.1, 90);
    tag(t, 2, 5);
    const d = spring(t - 2.6, 200, 20); if (d > 0) { g.save(); g.globalAlpha = clamp(d);
      rrect(80, 380, 920, 400, 30); g.fillStyle = PANEL; g.fill(); g.strokeStyle = EDGE; g.lineWidth = 3; g.stroke();
      const snap = 0.5 + 0.5 * Math.cos((t - 2.6) * 7.85); jaws(540, 720, snap, 2.6);
      label('SHARP MANDIBLES', 120, 440, t, 2.7, { color: GOLD, size: 28 }); g.restore(); chip('CAN SNAP PREY IN HALF', 540, 840, t, 3.3, { size: 30, bg: RED, fg: TXT }); }
  };
};
// ---- 3: 299 cm vs the tallest human
VIS[3] = (K) => {
  for (let i = 0; i < 14; i++) K(0.6 + i * 0.1, 'tick', 0.4); K(2.1, 'land', 0.8); K(4.3, 'pop', 0.8, 500); K(4.9, 'thump', 0.7);
  return (t) => {
    atmosphere(t, { x: 540, y: 850, r: 800, c: 'rgba(185,138,208,0.08)' }); tag(t, 3, 5);
    const G = 1180, PX = 2.0, cm = countTo(t, 0.6, 1.5, 299, 0.7);
    g.strokeStyle = '#4A443C'; g.lineWidth = 4; g.beginPath(); g.moveTo(80, G); g.lineTo(1000, G); g.stroke();
    g.font = F.mono(22); g.fillStyle = DIM; g.textAlign = 'left';
    for (let c = 0; c <= 300; c += 50) { const y = G - c * PX; g.fillRect(100, y - 2, c % 100 ? 16 : 30, 4); if (!(c % 100)) g.fillText(c + ' cm', 140, y + 8); }
    const hgt = cm * PX, pts = []; for (let i = 0; i <= 60; i++) { const u = i / 60; pts.push([430 + Math.sin(u * 10 + t * 2) * 16, G - 20 - (hgt - 30) * u]); }
    if (hgt > 5) { wormBody(pts, 40, t, 1); antennae(430 + Math.sin(10 + t * 2) * 16, G - hgt + 4, t, 0.9); }
    popNum(`${Math.round(cm)} CM`, 1000, 450, 120, cm >= 299 ? GOLD : TXT, t, 0.5, { align: 'right' }); label('LONGEST MEASURED', 1000, 505, t, 0.8, { align: 'right' });
    const hs = spring(t - 4.3, 160, 18); if (hs > 0) { human(780, G, 272 * PX * hs, 'rgba(244,238,227,0.85)');
      g.strokeStyle = TXT; g.setLineDash([8, 10]); g.lineWidth = 3; g.beginPath(); g.moveTo(640, G - 272 * PX); g.lineTo(920, G - 272 * PX); g.stroke(); g.setLineDash([]);
      label('272 CM · TALLEST HUMAN', 1000, G - 272 * PX - 20, t, 4.6, { align: 'right', size: 24 }); }
  };
};
// ---- 4: 20 million years
VIS[4] = (K) => {
  K(0.6, 'pop', 0.6, 400); for (let i = 0; i < 16; i++) K(1.0 + i * 0.1, 'tick', 0.35); K(2.7, 'hit', 0.9); K(3.2, 'pop', 0.7, 800);
  const BUR = []; { const r = rng(20); for (let i = 0; i < 7; i++) BUR.push({ x: 140 + i * 130 + r() * 40, y: 820 + r() * 300, d: 60 + r() * 120, t0: 1.2 + i * 0.15 }); }
  return (t) => {
    atmosphere(t); tag(t, 4, 5);
    const cols = ['#3E3328', '#4A3C2E', '#342B22', '#54452F', '#3A3026', '#463A2C'];
    for (let i = 0; i < 6; i++) { const y = 720 + i * 90; g.fillStyle = cols[i]; g.beginPath(); g.moveTo(0, y); for (let x = 0; x <= W; x += 40) g.lineTo(x, y + Math.sin(x / 150 + i) * 14); g.lineTo(W, H); g.lineTo(0, H); g.fill(); }
    for (const b of BUR) { const p = clamp((t - b.t0) / 0.8); if (p <= 0) continue; g.strokeStyle = `rgba(255,194,61,${0.9 * p})`; g.lineWidth = 12; g.lineCap = 'round';
      g.beginPath(); g.moveTo(b.x, b.y - b.d); g.lineTo(b.x, b.y); g.quadraticCurveTo(b.x, b.y + 40, b.x + 50 * p, b.y + 40); g.stroke(); }
    const n = countTo(t, 1.0, 1.7, 20000000, 0.5);
    popNum(fmt(Math.round(n / 100000) * 100000), 80, 540, fit('20,000,000', 'disp', 150, 920), n >= 2e7 ? GOLD : TXT, t, 0.6); label('YEARS OF AMBUSH', 84, 600, t, 1.0);
    chip('FOSSIL BURROWS · TAIWAN', 80, 680, t, 3.2, { size: 28, align: 'left', bg: '#2B2A28', fg: TXT });
  };
};
