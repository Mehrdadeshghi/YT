// PRO look — calm, premium explainer style (benchmark: German IT explainer Shorts, Oct 2026).
// Rules: dark petrol background, ONE accent (green) for what matters, ONE highlight (orange) for the single key detail,
// app-like cards that float in (fade + rise), thin line icons, small one-line captions (cine.html proCaptions), no shake/flash/glitch.
// Load with ep.scripts [..., "pro.js"] and "style": "pro".
window.PRO = { bg0: '#061015', bg1: '#0C1F27', card: '#0F2027', card2: '#152A33', line: 'rgba(170,230,240,0.11)',
  acc: '#38E07B', hi: '#FF9F1C', txt: '#F3F7F8', mute: '#7D9299', dim: '#23363E', red: '#FF5A4E' };
const eO = (x) => 1 - Math.pow(1 - clamp(x), 3);
const inA = (t, t0, d = 0.4) => eO((t - t0) / d);

function proBg(t, o = {}) {
  const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, PRO.bg0); gr.addColorStop(0.45, PRO.bg1); gr.addColorStop(1, PRO.bg0);
  g.fillStyle = gr; g.fillRect(0, 0, W, H);
  const cx = o.x ?? 540, cy = (o.y ?? 900) + Math.sin(t * 0.4) * 30, rg = g.createRadialGradient(cx, cy, 0, cx, cy, o.r ?? 820);
  rg.addColorStop(0, o.glow || 'rgba(56,224,123,0.075)'); rg.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = rg; g.fillRect(0, 0, W, H);
  g.strokeStyle = 'rgba(170,230,240,0.035)'; g.lineWidth = 1.5; g.beginPath();          // very faint dot grid
  for (let y = 120; y < H; y += 90) for (let x = 45; x < W; x += 90) { g.moveTo(x + 2, y); g.arc(x, y, 2, 0, 6.283); } g.stroke();
}
// text with *accent* words; align center|left|right; returns width
function rich(str, x, y, size, o = {}) {
  g.save(); g.font = F.ui(size, o.w || 800); g.textAlign = 'left'; const parts = []; let on = false;
  str.split(/(\*)/).forEach((p) => { if (p === '*') on = !on; else if (p) parts.push([p, on]); });
  const ws = parts.map(([p]) => g.measureText(p).width), tot = ws.reduce((a, b) => a + b, 0);
  let cx = o.align === 'left' ? x : o.align === 'right' ? x - tot : x - tot / 2;
  if (o.alpha != null) g.globalAlpha *= clamp(o.alpha); if (o.shadow !== false) { g.shadowColor = 'rgba(0,0,0,0.6)'; g.shadowBlur = 16; }
  parts.forEach(([p, a], i) => { g.fillStyle = a ? (o.acc || PRO.acc) : (o.color || PRO.txt); g.fillText(p, cx, y); cx += ws[i]; });
  g.restore(); return tot;
}
function ptext(str, x, y, size, col = PRO.txt, o = {}) { g.save(); g.font = F.ui(size, o.w || 700); g.textAlign = o.align || 'left'; g.fillStyle = col;
  if (o.alpha != null) g.globalAlpha *= clamp(o.alpha); if (o.ls) g.letterSpacing = o.ls + 'px'; g.fillText(str, x, y); g.restore(); }
// title at the top of the first frames (hook), wraps into 2 lines
function proTitle(t, str, y = 230, size = 66, until = 99) {
  const a = clamp(t / 0.25) * (1 - clamp((t - until) / 0.3)); if (a <= 0) return;
  g.save(); const tb = g.createLinearGradient(0, 0, 0, y + size * 2.6); tb.addColorStop(0, `rgba(6,16,21,${0.92 * a})`); tb.addColorStop(0.75, `rgba(6,16,21,${0.75 * a})`); tb.addColorStop(1, "rgba(6,16,21,0)"); g.fillStyle = tb; g.fillRect(0, 0, W, y + size * 2.6); g.restore();
  g.save(); g.font = F.ui(size, 800); const words = str.split(' '), wd = (s) => g.measureText(s.replace(/\*/g, '')).width; let best = [str], bd = 1e9;
  if (wd(str) > 900) for (let i = 1; i < words.length; i++) { const l1 = words.slice(0, i).join(' '), l2 = words.slice(i).join(' '), d = Math.abs(wd(l1) - wd(l2)); if (d < bd && wd(l1) < 960 && wd(l2) < 960) { bd = d; best = [l1, l2]; } }
  g.restore(); let on = false;
  best.forEach((l, i) => { const s = (on ? '*' : '') + l + (((l.match(/\*/g) || []).length % 2 && !on) ? '*' : ''); if ((l.match(/\*/g) || []).length % 2) on = !on; rich(s, 540, y + i * size * 1.18, size, { alpha: a }); });
}
// a floating card: fades + rises in at t0 (and out at o.out); fn(lt) draws in card-local coords (0,0 = top-left, clipped)
function card(t, t0, x, y, w, h, fn, o = {}) {
  const p = inA(t, t0, o.d ?? 0.45); if (p <= 0) return; const out = o.out != null ? 1 - inA(t, o.out, 0.3) : 1; if (out <= 0) return;
  const r = o.r ?? 34; g.save(); g.globalAlpha *= p * out; const s = 0.95 + 0.05 * p; g.translate(x + w / 2, y + h / 2 + (1 - p) * 36 - (1 - out) * 20); g.scale(s, s); g.translate(-w / 2, -h / 2);
  g.shadowColor = 'rgba(0,0,0,0.55)'; g.shadowBlur = 48; g.shadowOffsetY = 18; rrect(0, 0, w, h, r); g.fillStyle = o.fill || PRO.card; g.fill(); g.shadowColor = 'transparent';
  const hl = g.createLinearGradient(0, 0, 0, h); hl.addColorStop(0, 'rgba(255,255,255,0.055)'); hl.addColorStop(0.35, 'rgba(255,255,255,0)'); g.fillStyle = hl; g.fill();
  g.lineWidth = 2; g.strokeStyle = o.edge || PRO.line; g.stroke();
  if (fn) { g.save(); rrect(0, 0, w, h, r); g.clip(); fn(t - t0, w, h); g.restore(); }
  g.restore();
}
// small label pill ("Source: …", "Real photo")
function pill(str, x, y, t, t0, o = {}) { const a = inA(t, t0, 0.3); if (a <= 0) return; g.save(); g.globalAlpha *= a; g.font = F.ui(o.size || 24, 700);
  const w = g.measureText(str).width + 36, h = (o.size || 24) * 1.7, x0 = o.align === 'left' ? x : o.align === 'right' ? x - w : x - w / 2;
  rrect(x0, y - h / 2, w, h, h / 2); g.fillStyle = o.bg || 'rgba(255,255,255,0.07)'; g.fill(); if (o.edge !== false) { g.lineWidth = 1.5; g.strokeStyle = o.edge || PRO.line; g.stroke(); }
  g.fillStyle = o.color || PRO.mute; g.textAlign = 'left'; g.fillText(str, x0 + 18, y + (o.size || 24) * 0.36); g.restore(); }
function kicker(str, x, y, col = PRO.mute, o = {}) { ptext(str.toUpperCase(), x, y, o.size || 24, col, { ls: 3, align: o.align, alpha: o.alpha }); }
// icons (flat, single colour)
function personIcon(x, y, s, col) { g.fillStyle = col; g.beginPath(); g.arc(x, y - 30 * s, 17 * s, 0, 6.283); g.fill();
  g.beginPath(); g.moveTo(x - 30 * s, y + 34 * s); g.quadraticCurveTo(x - 32 * s, y - 6 * s, x, y - 7 * s); g.quadraticCurveTo(x + 32 * s, y - 6 * s, x + 30 * s, y + 34 * s); g.closePath(); g.fill(); }
function heartIcon(x, y, s, col, beat = 0) { g.save(); g.translate(x, y); const k = s * (1 + 0.14 * beat); g.scale(k, k); g.fillStyle = col; g.beginPath();
  for (let i = 0; i <= 60; i++) { const u = i / 60 * 6.283, hx = 16 * Math.pow(Math.sin(u), 3), hy = -(13 * Math.cos(u) - 5 * Math.cos(2 * u) - 2 * Math.cos(3 * u) - Math.cos(4 * u)); i ? g.lineTo(hx, hy) : g.moveTo(hx, hy); }
  g.closePath(); g.fill(); g.restore(); }
function checkIcon(x, y, s, col = PRO.acc) { g.save(); g.fillStyle = col; g.beginPath(); g.arc(x, y, 22 * s, 0, 6.283); g.fill(); g.strokeStyle = PRO.bg0; g.lineWidth = 6 * s; g.lineCap = 'round'; g.lineJoin = 'round';
  g.beginPath(); g.moveTo(x - 10 * s, y); g.lineTo(x - 3 * s, y + 8 * s); g.lineTo(x + 11 * s, y - 8 * s); g.stroke(); g.restore(); }
// thin glowing line (no heavy bloom)
function pline(pts, col, w = 5, a = 1) { g.save(); g.globalAlpha *= a; g.strokeStyle = col; g.lineWidth = w; g.lineCap = 'round'; g.lineJoin = 'round';
  g.shadowColor = col; g.shadowBlur = 14; g.beginPath(); pts.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.stroke(); g.restore(); }
// real photo inside a card: cover crop, slow push-in, cool grade; label pill top-left (honest labelling)
function photoCard(t, t0, id, x, y, w, h, o = {}) {
  const im = PHOTOS[id]; if (!im) return false;
  card(t, t0, x, y, w, h, (lt) => { const f = o.focus || [0.5, 0.45], z = (o.zoom || [1.04, 1.12]), k = lerp(z[0], z[1], clamp(lt / (o.dur || 5)));
    const sc = Math.max(w / im.width, h / im.height) * k, dw = im.width * sc, dh = im.height * sc;
    g.drawImage(im, clamp(w / 2 - dw * f[0], w - dw, 0), clamp(h / 2 - dh * f[1], h - dh, 0), dw, dh);
    g.save(); g.globalCompositeOperation = 'soft-light'; g.fillStyle = 'rgba(20,70,90,0.55)'; g.fillRect(0, 0, w, h); g.restore();
    const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, 'rgba(6,16,21,0.35)'); gr.addColorStop(0.3, 'rgba(6,16,21,0)'); gr.addColorStop(0.75, 'rgba(6,16,21,0.05)'); gr.addColorStop(1, 'rgba(6,16,21,0.6)');
    g.fillStyle = gr; g.fillRect(0, 0, w, h);
    if (o.label) pill(o.label, 24, 44, lt, 0.25, { size: 22, bg: 'rgba(6,16,21,0.7)', color: PRO.txt, align: 'left' }); if (o.draw) o.draw(lt, w, h); }, { r: o.r ?? 30, out: o.out });
  return true;
}
// ring that marks one spot (orange highlight)
function marker(x, y, r, t, t0, col = PRO.hi) { const a = inA(t, t0, 0.35); if (a <= 0) return; const p = 0.5 + 0.5 * Math.sin((t - t0) * 6);
  g.save(); g.globalAlpha *= a; g.strokeStyle = col; g.lineWidth = 6; g.shadowColor = col; g.shadowBlur = 18; g.beginPath(); g.arc(x, y, r * (0.9 + 0.1 * a) + p * 6, 0, 6.283); g.stroke();
  g.fillStyle = col; g.globalAlpha *= 0.9; g.beginPath(); g.arc(x, y, 10, 0, 6.283); g.fill(); g.restore(); }
// thin progress bar
function pbar(x, y, w, p, col = PRO.acc, bg = PRO.dim, h = 10) { rrect(x, y, w, h, h / 2); g.fillStyle = bg; g.fill(); if (p > 0) { rrect(x, y, Math.max(h, w * clamp(p)), h, h / 2); g.fillStyle = col; g.fill(); } }
// the AI presenter, full frame: k = voice segment index (voice order), at = when that line starts in scene time (Sc.vo[j].at).
// Uses the real (unwarped) scene time RT so the lips stay in sync. Realism: jump cuts between a medium and a close framing
// every ~3.5 s (like real creators), slow breathing and a little handheld drift. Cards float over the chest, captions above them.
function host(t, k, at, o = {}) {
  const lt = RT ?? t, im = hostImg(k, Math.floor((lt - at) * 30)); if (!im) { proBg(t); return; }
  const shot = (k + Math.floor(Math.max(0, lt - at) / (o.cutEvery ?? 3.5))) % 2, close = o.close ?? 1.16, z0 = shot ? close : 1.03;
  const T = (TNOW ?? lt), br = 1 + 0.005 * Math.sin(T * 6.283 / 4.2), dx = 7 * Math.sin(T * 0.37), dy = 5 * Math.sin(T * 0.29 + 1);
  const sc = Math.max(W / im.width, H / im.height) * z0 * br, dw = im.width * sc, dh = im.height * sc, fx = o.fx ?? 0.5, fy = o.fy ?? 0.27;
  const x = clamp(540 - fx * dw + dx, W - dw, 0), y = clamp((shot ? 600 : 520) - fy * dh + dy, H - dh, 0);
  g.drawImage(im, x, y, dw, dh);
  const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, 'rgba(6,16,21,0.22)'); gr.addColorStop(0.35, 'rgba(6,16,21,0)'); gr.addColorStop(0.62, 'rgba(6,16,21,0.04)'); gr.addColorStop(1, 'rgba(6,16,21,0.5)');
  g.fillStyle = gr; g.fillRect(0, 0, W, H);
}
// two stacked hands seen from the side, pressing down (p 0..1); arms come from above
function pressHands(x, y, s, p, col = PRO.txt) { g.save(); g.translate(x, y + p * 34 * s); g.scale(s, s);
  g.fillStyle = 'rgba(243,247,248,0.16)'; rrect(-26, -260, 52, 210, 26); g.fill();                            // arms
  g.fillStyle = col; rrect(-70, -60, 140, 52, 26); g.fill(); g.fillStyle = 'rgba(243,247,248,0.7)'; rrect(-60, -98, 120, 44, 22); g.fill(); g.restore(); }

// ================================================================ ART: paintings as the stage
// camera over a painting: keys = [[t, u, v, z], …] (u,v = point of the image at the screen centre, 0..1; z = zoom, 1 = image width fills the frame)
// returns P(u, v) → [x, y] on screen (for markers / spotlights), or null if the image is missing
function camAt(t, keys) { if (t <= keys[0][0]) return keys[0].slice(1); for (let i = 1; i < keys.length; i++) if (t < keys[i][0]) {
    const a = keys[i - 1], b = keys[i], p = ease((t - a[0]) / (b[0] - a[0])); return [lerp(a[1], b[1], p), lerp(a[2], b[2], p), Math.exp(lerp(Math.log(a[3]), Math.log(b[3]), p))]; }
  return keys.at(-1).slice(1); }
function art(t, id, keys, o = {}) {
  const im = PHOTOS[id]; if (!im) return null; const [u, v, z] = camAt(t, keys), cx = o.cx ?? 540, cy = o.cy ?? 900;
  const s = (o.w ?? W) / im.width * z, dw = im.width * s, dh = im.height * s, x = cx - u * dw, y = cy - v * dh;
  if (o.frame !== false && (dw < W + 40 || dh < H + 40)) { g.save(); g.shadowColor = 'rgba(0,0,0,0.7)'; g.shadowBlur = 60; g.shadowOffsetY = 24; g.fillStyle = '#000'; g.fillRect(x, y, dw, dh); g.restore(); }
  g.drawImage(im, x, y, dw, dh);
  if (o.grade !== false) { g.save(); g.globalCompositeOperation = 'soft-light'; g.fillStyle = 'rgba(30,60,70,0.25)'; g.fillRect(Math.max(0, x), Math.max(0, y), Math.min(W, dw), Math.min(H, dh)); g.restore(); }
  return (pu, pv) => [x + pu * dw, y + pv * dh];
}
// darken everything except a soft circle (the detail we talk about)
function spotlight(t, t0, x, y, r, o = {}) { const a = inA(t, t0, 0.5) * (o.out != null ? 1 - inA(t, o.out, 0.3) : 1); if (a <= 0) return;
  g.save(); const gr = g.createRadialGradient(x, y, r * 0.75, x, y, r * 1.35); gr.addColorStop(0, 'rgba(4,10,13,0)'); gr.addColorStop(1, `rgba(4,10,13,${0.78 * a})`);
  g.fillStyle = gr; g.fillRect(0, 0, W, H); g.restore(); marker(x, y, r, t, t0 + 0.2, o.col || PRO.hi); }
// a label pill with a thin leader line to a point
function callout(t, t0, px, py, lx, ly, str, o = {}) { const a = inA(t, t0, 0.35); if (a <= 0) return;
  g.save(); g.globalAlpha *= a; g.strokeStyle = o.col || PRO.hi; g.lineWidth = 3; g.beginPath(); g.moveTo(px, py); g.lineTo(lerp(px, lx, a), lerp(py, ly, a)); g.stroke();
  g.fillStyle = o.col || PRO.hi; g.beginPath(); g.arc(px, py, 7, 0, 6.283); g.fill(); g.restore();
  pill(str, lx, ly, t, t0 + 0.15, { size: o.size || 30, bg: 'rgba(6,16,21,0.88)', color: PRO.txt, edge: o.col || PRO.hi, align: o.align || 'center' }); }
// big number / phrase in the middle of a card or the screen
function bigText(t, t0, str, x, y, size, o = {}) { const a = inA(t, t0, 0.35); if (a <= 0) return; g.save(); g.globalAlpha *= a; g.translate(x, y + (1 - a) * 20);
  rich(str, 0, 0, fit(str.replace(/\*/g, ''), 'ui', size, o.maxW || 940), { align: o.align || 'center', color: o.color, acc: o.acc }); g.restore(); }
// rolling counter: from → to (formatted by fmtFn)
function counter(t, t0, dur, from, to, x, y, size, fmtFn = (n) => Math.round(n).toLocaleString('en-US'), o = {}) { if (t < t0) return; const p = eO((t - t0) / dur), v = from * Math.pow(to / from, p);
  bigText(t, t0, (o.pre || '') + fmtFn(p >= 1 ? to : v) + (o.post || ''), x, y, size, o); }
// a small "REAL PHOTO / PAINTING · year" source line at the bottom of a painting shot
function artInfo(t, t0, str, y = 1415) { pill(str, 540, y, t, t0, { size: 22, bg: 'rgba(6,16,21,0.8)', color: PRO.mute }); }
