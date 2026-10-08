// Shared motion-graphics kit for tech explainers ("How It Works", adult track). ep.scripts: ["tech.js"]
const CY = '#3EE6FF', MG = '#FF4FD8', LIME = '#B6FF3E', RED2 = '#FF3B4E', PK = [GOLD, CY, MG, LIME, '#FF8A3D', '#8AA4FF', GOLD, CY];
const S = (f) => (K, Sc) => f()(K, Sc);
const big = (t, at, s, o = {}) => { if (t < at) return; g.save(); g.translate(shake(t, at, o.sh ?? 10), 0); stampText(s, 540, o.y ?? 1060, t, at, { size: o.size ?? 100, rot: o.rot ?? -0.06 }); g.restore(); };
const drop = (at, len = 0.45) => [[Math.max(0.05, at - len), 'mute', 1, len], [at, 'boom', 1.1], [at + 0.02, 'hit', 1.2]];
const ks = (K, list) => list.forEach(([a, b, c, d]) => K(a, b, c, d));
function grid(t, a = 0.08, step = 80) { g.save(); g.strokeStyle = `rgba(62,230,255,${a})`; g.lineWidth = 2; const o = (t * 40) % step;
  for (let x = -step + o; x < W + step; x += step) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, H); g.stroke(); } for (let y = -step + o; y < H + step; y += step) { g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke(); } g.restore(); }
function techBg(t, c1 = '#05101E', c2 = '#0B2A46') { const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, c1); gr.addColorStop(1, c2); g.fillStyle = gr; g.fillRect(0, 0, W, H); grid(t);
  const v = g.createRadialGradient(W / 2, H / 2, 300, W / 2, H / 2, 1200); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,0.55)'); g.fillStyle = v; g.fillRect(0, 0, W, H); }
function glowDot(x, y, r, col, a = 1) { g.save(); g.globalAlpha *= a; g.shadowColor = col; g.shadowBlur = r * 3; g.fillStyle = col; g.beginPath(); g.arc(x, y, r, 0, 6.283); g.fill(); g.restore(); }
function glowLine(pts, col, w = 6, a = 1) { g.save(); g.globalAlpha *= a; g.strokeStyle = col; g.lineWidth = w; g.lineCap = 'round'; g.lineJoin = 'round'; g.shadowColor = col; g.shadowBlur = 24; g.beginPath(); pts.forEach(([x, y], k) => k ? g.lineTo(x, y) : g.moveTo(x, y)); g.stroke(); g.restore(); }
function shock(x, y, t, t0, rMax = 260, col = CY, dur = 0.8) { const u = (t - t0) / dur; if (u < 0 || u > 1) return; g.save(); g.globalAlpha = 1 - u; g.strokeStyle = col; g.lineWidth = 10 * (1 - u) + 2; g.shadowColor = col; g.shadowBlur = 30; g.beginPath(); g.arc(x, y, rMax * ease(u), 0, 6.283); g.stroke(); g.restore(); }
// chromatic-aberration headline (RGB split that settles) — the "wow" text
function rgbText(str, x, y, size, t, tIn, o = {}) { const lt = t - tIn; if (lt < 0) return; size = fit(str, 'disp', size, o.maxW || 960); const s = spring(lt, 300, 16), sp = Math.max(0, 1 - lt / 0.5) * 14 + (o.jitter ? Math.sin(t * 40) * 2 : 0);
  g.save(); g.translate(x, y); g.scale(s, s); g.globalCompositeOperation = 'lighter';
  [['#FF2A6D', -sp, 0], ['#05D9E8', sp, 0], [o.color || '#FFFFFF', 0, 0]].forEach(([c, dx, dy]) => text(str, dx, dy, 'disp', size, c, { align: 'center' })); g.restore(); }
function wrapText(str, x, y, w, size) { g.font = F.ui(size); const words = str.split(' '); let line = '', yy = y;
  words.forEach((wd) => { const tl = line ? line + ' ' + wd : wd; if (g.measureText(tl).width > w && line) { text(line, x, yy, 'ui', size, '#FFF'); line = wd; yy += size * 1.25; } else line = tl; }); text(line, x, yy, 'ui', size, '#FFF'); }
function phoneFrame(x, y, s, draw) { g.save(); g.translate(x, y); g.scale(s, s);
  g.shadowColor = 'rgba(0,0,0,0.6)'; g.shadowBlur = 40; rrect(-210, -400, 420, 800, 56); g.fillStyle = '#0D0F14'; g.fill(); g.shadowBlur = 0; g.lineWidth = 6; g.strokeStyle = '#3A4252'; g.stroke();
  g.save(); rrect(-188, -378, 376, 756, 42); g.clip(); draw(); g.restore(); rrect(-60, -366, 120, 26, 13); g.fillStyle = '#05070A'; g.fill(); g.restore(); }
// 3D: is world point p (earth radii) hidden behind the planet for the current globe camera?
function behindEarth(p) { const C = MAP.cam.C, d = [p[0] - C[0], p[1] - C[1], p[2] - C[2]], a = d[0] ** 2 + d[1] ** 2 + d[2] ** 2, b = 2 * (C[0] * d[0] + C[1] * d[1] + C[2] * d[2]), c = C[0] ** 2 + C[1] ** 2 + C[2] ** 2 - 1, disc = b * b - 4 * a * c;
  if (disc < 0) return false; const t1 = (-b - Math.sqrt(disc)) / (2 * a); return t1 > 0 && t1 < 1; }
function satIcon(x, y, s, t, col = '#E8EEF7', a = 1) { g.save(); g.translate(x, y); g.scale(s, s); g.rotate(Math.sin(t * 0.7) * 0.15); g.globalAlpha *= a;
  g.fillStyle = '#2B66C8'; g.strokeStyle = '#9CC2FF'; g.lineWidth = 2; [-1, 1].forEach((sd) => { g.fillRect(sd * 22 - (sd > 0 ? 0 : 44), -10, 44, 20); g.strokeRect(sd * 22 - (sd > 0 ? 0 : 44), -10, 44, 20); });
  g.fillStyle = col; g.fillRect(-12, -14, 24, 28); g.fillStyle = GOLD; g.fillRect(-12, -14, 24, 6); glowDot(0, 16, 4, CY); g.restore(); }
