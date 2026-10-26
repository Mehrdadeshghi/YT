// Wiki Roulette — REEL v2 kit (experiment E8, episodes 196–198). ep.scripts: ["tech.js", "r2kit.js"], "facts": true.
// Safe zone for Shorts/Reels overlays: all text + key visuals between y 230 and 1440, right 230 px clear below y 900.
// Captions sit at capY 1250 (capCX/capW keep them left of x 850), the comment card at cardY 1150.
const R2 = { x: 80, maxW: 920, maxWlow: 760, badgeY: 380 };

// frame-1 hook: big stacked text, fully drawn at t = 0 (tIn < 0) but always moving (drift + breathing), ≤ 6 words
function r2hook(t, lines, y0 = 560, o = {}) {
  const size = Math.min(...lines.map((l) => fit(l, 'disp', o.size || 150, o.maxW || R2.maxW)));
  const br = 1 + 0.025 * Math.sin(t * 3.2), dy = -14 * clamp(t / 2.5);
  lines.forEach((l, i) => { const s = spring(t + 0.6 - i * 0.12, 260, 18);
    g.save(); g.translate(R2.x, y0 + i * size * 1.04 + dy); g.scale(br * s, br * s);
    text(l, 0, 0, 'disp', size, i === lines.length - 1 ? (o.c2 || GOLD) : (o.c1 || TXT), { shadow: true }); g.restore(); });
  return y0 + (lines.length - 1) * size * 1.04;
}
// honest media labels (red = real, blue = drawn)
const r2real = (t, tIn, str, y = R2.badgeY) => realBadge(t, tIn, str, y);
const r2foot = (t, tIn, str, y = R2.badgeY) => chip('▶ ' + str, R2.x, y, t, tIn, { size: 24, align: 'left', bg: 'rgba(255,59,48,0.92)', fg: TXT });
const r2graphic = (t, tIn, str = 'GRAPHIC', y = R2.badgeY) => chip('◆ ' + str, R2.x, y, t, tIn, { size: 24, align: 'left', bg: 'rgba(62,140,255,0.92)', fg: TXT });
// one big punch line (RGB split), left aligned, auto-fit
function r2big(t, tIn, str, y, o = {}) { if (t < tIn) return; const sz = fit(str, 'disp', o.size || 130, o.maxW || (y > 900 ? R2.maxWlow : R2.maxW));
  rgbPop(str, o.x ?? R2.x, y, sz, o.color || GOLD, t, tIn, { align: 'left' }); }
// small mono line under a punch line
const r2line = (t, tIn, str, y, o = {}) => { if (t >= tIn) label(str, (o.x ?? R2.x) + 4, y, t, tIn, { size: o.size || 30, color: o.color || TXT, ls: 4 }); };
// dark band behind text for legibility over photos
function r2band(y0, y1, a = 0.55) { g.save(); const gr = g.createLinearGradient(0, y0, 0, y1); gr.addColorStop(0, `rgba(8,8,10,0)`); gr.addColorStop(0.25, `rgba(8,8,10,${a})`);
  gr.addColorStop(0.75, `rgba(8,8,10,${a})`); gr.addColorStop(1, `rgba(8,8,10,0)`); g.fillStyle = gr; g.fillRect(0, y0, W, y1 - y0); g.restore(); }
// a number that counts up (ease-out), left aligned
function r2count(t, t0, dur, to, x, y, size, color, fmt = (n) => Math.round(n).toLocaleString('en-US'), suffix = '') {
  if (t < t0) return; const v = to * easeOut((t - t0) / dur); const s = fmt(v) + suffix;
  text(s, x, y, 'disp', fit(s, 'disp', size, R2.maxW), color, { shadow: true }); }
// full-bleed photo with extra darkening, returns P()
function r2photo(t, id, o = {}) { const P = shot(t, id, Object.assign({ dur: 4 }, o)); if (!P) noPhoto(t);
  if (o.dim) { g.save(); g.fillStyle = `rgba(8,8,10,${o.dim})`; g.fillRect(0, 0, W, H); g.restore(); } return P; }
function r2clip(t, id, o = {}) { const P = clip(t, id, Object.assign({ dur: 4 }, o)); if (!P) noPhoto(t);
  if (o.dim) { g.save(); g.fillStyle = `rgba(8,8,10,${o.dim})`; g.fillRect(0, 0, W, H); g.restore(); } return P; }
