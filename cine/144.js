// CIRCLES #1 (#144): "How many circles does it take to draw the USA?" — Fourier epicycles (scripts/fourier.py → cine/144_fou.js).
// One continuous timeline across the opener and the single scene: 7 stages (1 → 500 circles), each traces the outline once,
// the miss (Hausdorff distance, miles) shrinks in a bar chart, place names pop up as the pen passes, then the full reveal.
const NAVY1 = '#0A1530', ROSE = '#E8384F', CREAM1 = '#F4EFE4', GOLD1 = '#E9B949';
const L = [3.4, 3.4, 3.8, 4.0, 4.4, 4.6, 5.2], T0 = 0.8, STARTS = L.reduce((a, d, i) => (a.push(a[i] + d), a), [T0]), TEND = STARTS.at(-1);
const BOX = FOU.box, MX = { x: 70, y: 470, w: 940, h: 640 }, SC = Math.min(MX.w / (BOX[2] - BOX[0]), MX.h / (BOX[3] - BOX[1]));
const OX = MX.x + (MX.w - (BOX[2] - BOX[0]) * SC) / 2 - BOX[0] * SC, OY = MX.y + (MX.h - (BOX[3] - BOX[1]) * SC) / 2 - BOX[1] * SC;
const px = (x, y) => [OX + x * SC, OY + y * SC];
// the curve of each stage, sampled once
const M = 1600, CURVES = FOU.stages.map((s) => { const cs = FOU.coef.slice(0, s.n + 1), pts = new Float32Array(M * 2);
  for (let j = 0; j < M; j++) { const u = j / M; let x = 0, y = 0; for (const [k, re, im] of cs) { const a = 2 * Math.PI * k * u, c = Math.cos(a), s2 = Math.sin(a); x += re * c - im * s2; y += re * s2 + im * c; }
    const [X, Y] = px(x, y); pts[2 * j] = X; pts[2 * j + 1] = Y; } return pts; });
const OUT = FOU.outline.map(([x, y]) => px(x, y));
const stageAt = (G) => { let i = 0; while (i < L.length - 1 && G >= STARTS[i + 1]) i++; return i; };

function bg() { const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, '#0D1B3D'); gr.addColorStop(1, NAVY1); g.fillStyle = gr; g.fillRect(0, 0, W, H);
  g.save(); g.globalAlpha = 0.05; g.fillStyle = '#FFFFFF'; for (let i = 0; i < 7; i++) g.fillRect(0, 1180 + i * 26, W, 13); g.restore(); }
function silhouette(a, fill) { g.save(); g.beginPath(); OUT.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.closePath();
  g.fillStyle = fill || `rgba(244,239,228,${0.07 * a})`; g.fill(); g.lineWidth = 1.5; g.strokeStyle = `rgba(244,239,228,${0.16 * a})`; g.stroke(); g.restore(); }
function trail(pts, upto, col, lw, glow) { const n = Math.min(M, Math.floor(upto * M)); if (n < 2) return; g.save(); g.lineJoin = g.lineCap = 'round';
  if (glow) { g.shadowColor = col; g.shadowBlur = glow; } g.strokeStyle = col; g.lineWidth = lw; g.beginPath(); g.moveTo(pts[0], pts[1]);
  for (let j = 1; j < n; j++) g.lineTo(pts[2 * j], pts[2 * j + 1]); if (upto >= 1) g.closePath(); g.stroke(); g.restore(); }
function arms(n, u) { const cs = FOU.coef.slice(0, n + 1); let x = cs[0][1], y = cs[0][2]; g.save(); g.lineWidth = 1.4;
  for (let i = 1; i < cs.length; i++) { const [k, re, im] = cs[i], a = 2 * Math.PI * k * u, dx = re * Math.cos(a) - im * Math.sin(a), dy = re * Math.sin(a) + im * Math.cos(a);
    const [X, Y] = px(x, y), r = Math.hypot(re, im) * SC; if (r > 0.6) { g.strokeStyle = `rgba(244,239,228,${i < 4 ? 0.42 : 0.22})`; g.beginPath(); g.arc(X, Y, r, 0, 6.283); g.stroke(); }
    const [X2, Y2] = px(x + dx, y + dy); g.strokeStyle = `rgba(244,239,228,${i < 4 ? 0.8 : 0.5})`; g.beginPath(); g.moveTo(X, Y); g.lineTo(X2, Y2); g.stroke(); x += dx; y += dy; }
  const [X, Y] = px(x, y); g.fillStyle = ROSE; g.shadowColor = ROSE; g.shadowBlur = 18; g.beginPath(); g.arc(X, Y, 7, 0, 6.283); g.fill(); g.restore(); }
function header(G) { const a = clamp(G / 0.4); g.save(); g.globalAlpha = a;
  text('HOW MANY CIRCLES DOES IT TAKE', 540, 180, 'mono', 30, GOLD1, { align: 'center', ls: 4 }); text('TO DRAW THE', 540, 222, 'mono', 30, GOLD1, { align: 'center', ls: 4 });
  text('USA?', 540, 370, 'disp', 150, CREAM1, { align: 'center' }); text('z(t) = Σ cₖ · e^(i·k·t)', 540, 432, 'serif', 34, 'rgba(244,239,228,0.55)', { align: 'center' }); g.restore(); }
function counter(G, i, done) { const s = FOU.stages[i], fin = G > TEND, n = s.n, col = fin ? GOLD1 : CREAM1, pop = spring(G - STARTS[i], 320, 14);
  g.save(); g.translate(540, 1250); g.scale(0.85 + 0.15 * pop, 0.85 + 0.15 * pop); text(`${n} ${n === 1 ? 'CIRCLE' : 'CIRCLES'}`, 0, 0, 'disp', 96, col, { align: 'center' }); g.restore();
  text(`misses by up to ${s.mi.toLocaleString('en-US')} miles`, 540, 1316, 'ui', 40, fin ? '#7FE3A0' : ROSE, { align: 'center' }); }
function bars(G, i) { const x0 = 120, w = 840, base = 1580, hMax = 190, bw = 80, gap = (w - bw * 7) / 6, mx = FOU.stages[0].mi;
  g.save(); g.fillStyle = 'rgba(244,239,228,0.25)'; g.fillRect(x0 - 10, base, w + 20, 2);
  FOU.stages.forEach((s, j) => { if (j > i) return; const p = clamp((G - STARTS[j]) / 0.5), h = Math.max(6, hMax * Math.sqrt(s.mi / mx)) * easeOutB(p), x = x0 + j * (bw + gap);
    g.fillStyle = j === i ? ROSE : 'rgba(232,56,79,0.45)'; rrect(x, base - h, bw, h, 10); g.fill();
    text(String(s.mi), x + bw / 2, base - h - 12, 'mono', 22, 'rgba(244,239,228,0.8)', { align: 'center' }); text(String(s.n), x + bw / 2, base + 34, 'mono', 24, CREAM1, { align: 'center' }); });
  text('MILES OFF', x0 - 10, base - hMax - 62, 'mono', 20, 'rgba(244,239,228,0.5)', { ls: 3 }); text('CIRCLES', x0 + w + 10, base + 70, 'mono', 20, 'rgba(244,239,228,0.5)', { ls: 3, align: 'right' }); g.restore(); }
const easeOutB = (x) => 1 - Math.pow(1 - clamp(x), 3);
function labels(G, i, u, all) { FOU.labels.forEach(([nm, x, y, f]) => { let a = 0;
    if (all) a = clamp((G - TEND - 0.6) / 0.4); else if (FOU.stages[i].n >= 30 && u > f) a = clamp((u - f) * L[i] / 0.25) * (1 - clamp(((u - f) * L[i] - 2.2) / 0.5));
    if (a <= 0) return; const [X, Y] = px(x, y); g.save(); g.globalAlpha = a; g.font = F.mono(22); const tw = g.measureText(nm).width + 26, bx = clamp(X - tw / 2, 20, W - 20 - tw);
    rrect(bx, Y - 18, tw, 36, 18); g.fillStyle = 'rgba(10,21,48,0.85)'; g.fill(); g.lineWidth = 1.5; g.strokeStyle = GOLD1; g.stroke(); text(nm, bx + tw / 2, Y + 8, 'mono', 22, GOLD1, { align: 'center' }); g.restore(); }); }
function credit() { text("Music: Dvořák · Symphony No. 9 'From the New World' (written in the USA, 1893) · Map: Natural Earth", 540, 1890, 'mono', 15, 'rgba(244,239,228,0.4)', { align: 'center' }); }

function frame(G) { bg(); header(G); const i = stageAt(Math.max(T0, G)), fin = G > TEND, u = clamp((G - STARTS[i]) / L[i]);
  silhouette(fin ? 1 - clamp((G - TEND) / 0.8) : clamp(G / 0.8));
  if (G >= T0) {
    if (i > 0 && G - STARTS[i] < 1.0 && !fin) trail(CURVES[i - 1], 1, `rgba(244,239,228,${0.35 * (1 - (G - STARTS[i]))})`, 2);   // previous stage fades out
    if (!fin) { trail(CURVES[i], u, ROSE, 4, 14); arms(FOU.stages[i].n, u); }
    else { const r = clamp((G - TEND) / 0.8); g.save(); g.beginPath(); for (let j = 0; j < M; j++) g.lineTo(CURVES[6][2 * j], CURVES[6][2 * j + 1]); g.closePath();
      const gr = g.createLinearGradient(0, MX.y, 0, MX.y + MX.h); gr.addColorStop(0, `rgba(232,56,79,${0.35 * r})`); gr.addColorStop(1, `rgba(60,90,200,${0.35 * r})`); g.fillStyle = gr; g.fill(); g.restore();
      trail(CURVES[6], 1, ROSE, 4, 18); }
    counter(G, i, fin); bars(G, i); labels(G, i, u, fin); }
  credit(); }

VIS.open = (K) => { K(0.05, 'swish', 0.5); K(T0, 'pop', 0.6, 520);
  return (t) => frame(t); };
VIS[0] = (K) => { const od = SCENES[0].to, at = (G) => G - od + PRE;
  STARTS.slice(1, -1).forEach((s, j) => { if (s > od) K(at(s), 'pop', 0.6, 560 + j * 60); else if (j === 0) {} });
  K(at(TEND), 'ding', 1); K(at(TEND) + 0.05, 'riser', 0.3);
  return (t) => frame(od + t - PRE); };
