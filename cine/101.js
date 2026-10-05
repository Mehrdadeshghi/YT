// Wiki Roulette #101 — the Hand of God, 1986 (figures style, Football's Craziest Moments #3)
// Hook technique: a confession ("Let's be honest: this was a handball") over the real photo, the hand circled in frame 1.
const N = 5, RED = '#FF3B30';
const ARG = { shirt: '#2B4C9B', pants: '#1E1E1E', hat: 'hair', hair: '#1A120C', seed: 11 };     // Argentina wore dark blue that day
const ENG = { shirt: '#F4F4F4', pants: '#1F2A44', hat: 'hair', hair: '#6B4A2B', seed: 12 };     // England in white
const REF = { shirt: '#1E1E1E', pants: '#1E1E1E', hat: 'hair', hair: '#2A1A10', seed: 13 };
const shade = (a) => { g.fillStyle = `rgba(8,8,10,${a})`; g.fillRect(0, 0, W, H); };
// photo scene with a ring around a detail (u, v in photo fractions)
function photoRing(i, sp) {
  return (K) => { K(0.45, 'whoosh', 0.5); (sp.k || []).forEach(([a, b, c, d]) => K(a, b, c, d));
    return (t) => { atmosphere(t); const P = shot(t, sp.ph, { a: sp.a, b: sp.b, dur: 6 }); if (!P) noPhoto(t); if (sp.dim) shade(sp.dim);
      if (i != null) tag(t, i, N); else tag(t);
      if (sp.badge) realBadge(t, 0.3, sp.badge);
      if (P) { const [x, y] = P(sp.ring[0], sp.ring[1]); ring(t, sp.ringAt ?? 0.6, x, y, sp.ring[2], { color: RED, lw: 12 });
        if (sp.co) callout(t, sp.co[0], [x, y], sp.co[1], sp.co[2], sp.co[3], { bg: RED, fg: '#FFFFFF', color: RED, size: 40 });
        if (sp.lot) lot(t, sp.lot[0], sp.lot[1], x + sp.lot[2], y + sp.lot[3], sp.lot[4]); }
      if (sp.hook) { hook(t, EP.hook, 400); if (EP.series) chip(EP.series, 80, 630, t, -0.3, { size: 26, align: 'left', bg: GOLD, fg: BG }); }
      if (sp.f) fact(t, sp.f[2] ?? 0.6, sp.f[0], sp.f[1], {}); if (sp.x) sp.x(t); }; };
}
// dribble trail: the run weaves past four defenders, then the ball hits the net
function dribble(t, tIn, x0, y0, x1, y1) {
  const lt = t - tIn; if (lt < 0) return; const p = clamp(lt / 1.6), pts = [];
  for (let k = 0; k <= 60; k++) { const u = k / 60; pts.push([lerp(x0, x1, u) + Math.sin(u * Math.PI * 4) * 70, lerp(y0, y1, u)]); }
  g.save(); g.strokeStyle = GOLD; g.lineWidth = 10; g.setLineDash([22, 16]); g.lineCap = 'round'; g.beginPath();
  pts.slice(0, Math.max(1, Math.floor(p * 60))).forEach(([x, y], k) => k ? g.lineTo(x, y) : g.moveTo(x, y)); g.stroke(); g.restore();
  for (let d = 0; d < 4; d++) { const u = (d + 0.5) / 4.4, [dx, dy] = pts[Math.round(u * 60)], passed = p > u + 0.05;
    g.save(); g.translate(dx + (d % 2 ? -80 : 80), dy); g.globalAlpha = passed ? 0.55 : 1; g.fillStyle = '#F4F4F4'; g.strokeStyle = INK; g.lineWidth = 5;
    g.beginPath(); g.arc(0, 0, 30, 0, 6.283); g.fill(); g.stroke(); if (passed) { g.strokeStyle = RED; g.lineWidth = 7; g.beginPath(); g.moveTo(-18, -18); g.lineTo(18, 18); g.moveTo(18, -18); g.lineTo(-18, 18); g.stroke(); } g.restore(); }
  const [bx, by] = pts[Math.floor(p * 60)]; g.save(); g.translate(bx, by); g.rotate(t * 10); g.fillStyle = '#FFF'; g.beginPath(); g.arc(0, 0, 24, 0, 6.283); g.fill(); g.lineWidth = 4; g.strokeStyle = INK; g.stroke(); g.restore();
}

VIS.open = photoRing(null, { ph: 'hand2', a: [0.5, 0.2, 1.3], b: [0.5, 0.2, 1.4], dim: 0.15, ring: [0.41, 0.15, 110], ringAt: -0.3, hook: true,
  co: [0.3, 700, 920, 'HAND!'], k: [[0.15, 'hit', 1.3], [0.3, 'wrong', 1], [0.35, 'stamp', 0.8]] });

VIS[0] = fscene(0, N, { bg: 'azteca', a: [0.5, 0.5, 1.0], b: [0.5, 0.5, 1.12], dim: 0.3, badge: 'REAL PHOTO · ESTADIO AZTECA, MEXICO CITY', k: [[0.7, 'hit', 1], [1.2, 'pop', 0.8, 700]],
  figs: [[0.1, 250, 1150, 0.58, A(ARG, { face: 'smug', armL: 'hips', armR: 'hips' })], [0.3, 830, 1150, 0.58, A(ENG, { face: 'angry', flip: true, armR: 'fist' })]],
  x: (t) => { lot(t, 1.2, 'fire', 540, 960, 170); }, f: ['ARGENTINA VS ENGLAND', 'WORLD CUP QUARTER-FINAL · 22 JUNE 1986'] });

VIS[1] = photoRing(1, { ph: 'hand', a: [0.45, 0.25, 1.4], b: [0.44, 0.25, 1.55], dim: 0.1, ring: [0.44, 0.15, 120], ringAt: 1.0, badge: 'REAL PHOTO · THE "HAND OF GOD", 51st MINUTE',
  co: [1.3, 760, 1000, 'LEFT HAND'], lot: [1.6, 'eyes', 260, 0, 140], k: [[1.0, 'hit', 1.2], [1.05, 'wrong', 1]] });

VIS[2] = fscene(2, N, { bg: 'hand', a: [0.5, 0.5, 1.2], b: [0.5, 0.5, 1.3], dim: 0.6, badge: 'ILLUSTRATION · THE REFEREE ALLOWED IT', k: [[0.5, 'beep', 0.9], [0.9, 'hit', 1.1], [1.2, 'thump', 0.8]],
  figs: [[0.1, 330, 1150, 0.6, A(REF, { face: 'happy', armR: 'point' })], [0.3, 820, 1150, 0.58, A(ENG, { face: 'angry', flip: true, armL: 'up', armR: 'up' })]],
  bub: [[0.5, 760, 780, 'HANDBALL!!', { size: 54, tx: 800, ty: 880 }], [0.9, 330, 820, 'GOAL.', { size: 60, tx: 340, ty: 900 }]],
  x: (t) => { lot(t, 1.1, 'angry', 930, 980, 130); } });

VIS[3] = fscene(3, N, { bg: 'celeb', a: [0.55, 0.45, 1.0], b: [0.55, 0.45, 1.12], dim: 0.45, badge: 'REAL PHOTO · MARADONA VS ENGLAND, 1986', k: [[0.7, 'ding', 0.8], [1.2, 'pop', 0.8, 900]],
  figs: [[0.1, 260, 1150, 0.58, A(ARG, { face: 'smug', armR: 'up' })]],
  x: (t) => { lot(t, 1.2, 'monocle', 820, 960, 160); }, f: ['"THE HAND OF GOD"', 'MARADONA, AFTER THE MATCH'] });

VIS[4] = fscene(4, N, { bg: 'century', a: [0.5, 0.45, 1.0], b: [0.5, 0.45, 1.12], dim: 0.4, badge: 'REAL PHOTO · THE GOAL OF THE CENTURY', k: [[0.5, 'swish', 0.8], [0.9, 'swish', 0.8], [1.3, 'swish', 0.8], [1.7, 'swish', 0.8], [2.1, 'boom', 1], [2.12, 'hit', 1.2]],
  x: (t) => { dribble(t, 0.5, 540, 1180, 540, 640); if (t > 2.1) { burst(t, 2.1, 540, 640, 120, 'GOAL!', GOLD); lot(t, 2.2, 'starstruck', 860, 760, 150); }
    chip('60 YARDS · 10 SECONDS · 4 PLAYERS', 540, 520, t, 0.6, { size: 30, bg: GOLD, fg: BG }); } });
