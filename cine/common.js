// Shared CINE helpers (water, light, creatures) — loaded before every cine/<ep>.js
const TEAL = '#43C6D9', BONE = '#E6DAC2', FLESH = '#3B4855', SEA = '#0E3550';

// ---------- shared drawings ----------
function whalePath() {                 // local coords: head at +300, flukes at -340, belly down
  const p = new Path2D();
  p.moveTo(300, 5); p.bezierCurveTo(305, -60, 150, -98, -40, -86); p.bezierCurveTo(-170, -76, -250, -30, -290, -12);
  p.bezierCurveTo(-320, -40, -345, -78, -372, -80); p.bezierCurveTo(-360, -40, -340, -12, -318, 0);
  p.bezierCurveTo(-340, 12, -360, 40, -372, 80); p.bezierCurveTo(-345, 78, -320, 40, -290, 12);
  p.bezierCurveTo(-250, 34, -150, 82, -20, 92); p.bezierCurveTo(150, 100, 290, 70, 300, 5); p.closePath();
  p.moveTo(110, 70); p.bezierCurveTo(90, 130, 40, 190, 10, 200); p.bezierCurveTo(30, 150, 50, 110, 60, 80); p.closePath();
  return p;
}
const WHALE = whalePath();
function whale(x, y, s, rot, fill, o = {}) {
  g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s); if (o.alpha != null) g.globalAlpha *= clamp(o.alpha);
  g.fillStyle = fill; g.fill(WHALE);
  if (o.rim) { g.strokeStyle = o.rim; g.lineWidth = 3 / s; g.stroke(WHALE); }
  if (o.eye) { g.fillStyle = 'rgba(0,0,0,0.6)'; g.beginPath(); g.arc(220, 10, 7, 0, 6.283); g.fill(); }
  g.restore();
}
function lightRays(t, a) {
  if (a <= 0.01) return; g.save(); g.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 6; i++) { const x = 140 + i * 170 + Math.sin(t * 0.4 + i) * 40, w = 60 + (i % 3) * 30;
    const gr = g.createLinearGradient(0, 0, 0, 1500); gr.addColorStop(0, `rgba(120,200,230,${0.12 * a})`); gr.addColorStop(1, 'rgba(120,200,230,0)');
    g.fillStyle = gr; g.beginPath(); g.moveTo(x - w / 2, 0); g.lineTo(x + w / 2, 0); g.lineTo(x + w * 2.4 - 200, 1500); g.lineTo(x - 200, 1500); g.closePath(); g.fill(); }
  g.restore();
}
const SNOW = []; { const r = rng(211); for (let i = 0; i < 140; i++) SNOW.push({ x: r() * W, y: r() * H, z: 0.3 + r() * 0.7, s: r() }); }
function marineSnow(t, speed = 30, alpha = 1) {
  g.fillStyle = '#CFE6EE';
  for (const p of SNOW) { const y = ((p.y + t * speed * p.z) % H + H) % H, x = p.x + Math.sin(t * 0.5 + p.s * 9) * 12;
    g.globalAlpha = (0.06 + 0.22 * p.z) * alpha; g.fillRect(x, y, 2 + 2 * p.z, 2 + 2 * p.z); }
  g.globalAlpha = 1;
}
function sea(top, bottom) { const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, top); gr.addColorStop(1, bottom); g.fillStyle = gr; g.fillRect(0, 0, W, H); }
function seafloor(y, t) {
  const gr = g.createLinearGradient(0, y - 40, 0, H); gr.addColorStop(0, '#1E2A2E'); gr.addColorStop(1, '#070A0B');
  g.fillStyle = gr; g.beginPath(); g.moveTo(0, y); for (let x = 0; x <= W; x += 30) g.lineTo(x, y + Math.sin(x / 90) * 10 + Math.sin(x / 37) * 4); g.lineTo(W, H); g.lineTo(0, H); g.closePath(); g.fill();
}
function spotlight(x, y, r, a = 1) {
  const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, `rgba(170,220,235,${0.22 * a})`); gr.addColorStop(1, 'rgba(170,220,235,0)');
  g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2);
}
function bubbles(t, x0, y0, n, seed, t0, spread = 40) {
  const r = rng(seed); g.strokeStyle = 'rgba(210,240,250,0.7)'; g.lineWidth = 2;
  for (let i = 0; i < n; i++) { const st = t0 + r() * 1.5, lt = t - st, dx = (r() - 0.5) * spread, sz = 3 + r() * 6; if (lt < 0) continue;
    const y = y0 - lt * (90 + sz * 12); if (y < y0 - 400) continue;
    g.globalAlpha = clamp(1 - (y0 - y) / 400); g.beginPath(); g.arc(x0 + dx + Math.sin(lt * 5 + i) * 6, y, sz, 0, 6.283); g.stroke(); }
  g.globalAlpha = 1;
}
const wrap = (d) => ((d % 1) + 1) % 1;

// ---------- generic story helpers ----------
const countTo = (t, t0, dur, to, pw = 1, from = 0) => from + (to - from) * Math.pow(clamp((tq(t) - t0) / dur), pw);
function popNum(str, x, y, size, color, t, tIn, o = {}) {        // number/word that springs in (anchor left|center|right)
  const s = spring(t - tIn, o.k || 260, o.d || 18); if (s <= 0.001) return 0;
  g.save(); g.translate(x, y); g.scale(s, s); text(str, 0, 0, o.fam || 'disp', size, color, { align: o.align || 'left', shadow: true }); g.restore(); return s;
}
function label(str, x, y, t, tIn, o = {}) { text(str, x, y, 'mono', o.size || 30, o.color || TXT, { ls: o.ls ?? 5, align: o.align || 'left', alpha: (t - tIn) * 4 }); }
function darkMap(cam, o = {}) {
  g.save(); cam.apply(); g.fillStyle = o.land || '#1C1A17'; g.fill(MAPPATH); g.lineJoin = 'round';
  g.strokeStyle = o.glow || 'rgba(255,194,61,0.10)'; g.lineWidth = 8 / cam.k; g.stroke(MAPPATH);
  g.strokeStyle = o.edge || '#4A433A'; g.lineWidth = 2 / cam.k; g.stroke(MAPPATH); g.restore();
}
function camLerp(t, t0, k, d, A, B, cy) {                       // spring camera between [lon,lat,span] keys
  const p = spring(t - t0, k, d), span = Math.exp(lerp(Math.log(A[2]), Math.log(B[2]), p));
  return mapCam(lerp(A[0], B[0], p), lerp(A[1], B[1], p), span, cy);
}
function pinAt(x, y, t, tIn, name, o = {}) {
  const s = spring(t - tIn, 260, 16); if (s <= 0) return;
  for (let r = 0; r < 3; r++) { const ph = ((t - tIn) * 0.8 + r / 3) % 1;
    g.strokeStyle = o.color || GOLD; g.globalAlpha = (1 - ph) * 0.7; g.lineWidth = 4; g.beginPath(); g.arc(x, y, 20 + ph * 130, 0, 6.283); g.stroke(); }
  g.globalAlpha = 1; g.fillStyle = o.color || GOLD; g.beginPath(); g.arc(x, y, 15 * s, 0, 6.283); g.fill();
  g.fillStyle = BG; g.beginPath(); g.arc(x, y, 6 * s, 0, 6.283); g.fill();
  if (name) rise(name, x + (o.left ? -40 : 40), y - 20, 'disp', o.size || 70, TXT, t, tIn + 0.05, {});
}
function person(x, y, s, color) { g.fillStyle = color; g.beginPath(); g.arc(x, y - 22 * s, 9 * s, 0, 6.283); g.fill();
  g.beginPath(); g.roundRect(x - 11 * s, y - 10 * s, 22 * s, 28 * s, [10 * s, 10 * s, 3 * s, 3 * s]); g.fill(); }
function shake(t, t0, amp = 20, len = 0.45) { const lt = t - t0; return lt > 0 && lt < len ? Math.sin(lt * 70) * (1 - lt / len) * amp : 0; }
function flash(t, t0, a = 0.35, len = 0.1, col = '#fff') { const lt = t - t0; if (lt > 0 && lt < len) { g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.fillStyle = col; g.globalAlpha = a * (1 - lt / len); g.fillRect(0, 0, W, H); g.restore(); } }
function stampText(str, x, y, t, tIn, o = {}) {
  const lt = t - tIn; if (lt < 0) return; const p = spring(lt, 320, 20), sc = lerp(2.4, 1, p);
  g.save(); g.translate(x, y); g.rotate(o.rot ?? -0.1); g.scale(sc, sc); g.globalAlpha *= clamp(p * 3);
  g.font = F.disp(o.size || 100); const w = g.measureText(str).width + 70, h = (o.size || 100) * 1.45;
  rrect(-w / 2, -h * 0.58, w, h, 16); g.fillStyle = 'rgba(12,11,10,0.5)'; g.fill(); g.lineWidth = 11; g.strokeStyle = o.color || RED; g.stroke();
  g.fillStyle = o.color || RED; g.textAlign = 'center'; g.fillText(str, 0, (o.size || 100) * 0.35); g.restore();
}
function typed(str, x, y, fam, size, color, t, t0, dur, o = {}) {
  const n = Math.floor(str.length * clamp((tq(t) - t0) / dur)); if (n <= 0) return;
  text(str.slice(0, n), x, y, fam, size, color, o);
  if (n < str.length && Math.floor(t * 4) % 2 === 0) { g.font = F[fam](size); const w = g.measureText(str.slice(0, n)).width; g.fillStyle = color; g.fillRect(x + w + 4, y - size * 0.8, size * 0.08, size); }
}
function paper(x, y, w, h, rot = 0, col = PAPER) { g.translate(x, y); g.rotate(rot); rrect(-w / 2 + 10, -h / 2 + 14, w, h, 10); g.fillStyle = 'rgba(0,0,0,0.5)'; g.fill(); rrect(-w / 2, -h / 2, w, h, 10); g.fillStyle = col; g.fill(); }

// ---------- real photos (from wiki_images.zip → assets/photos/<file>, listed in ep.photos) ----------
// photo(t, 'lead', x, y, w, h, { tIn, zoom: [1, 1.12], focus: [fx, fy], dur })  — id from ep.photos; returns false if missing
const hasPhoto = (id) => !!PHOTOS[id];
function photo(t, src, x, y, w, h, o = {}) {
  const im = PHOTOS[src]; if (!im) return false;
  const s = o.tIn != null ? spring(t - o.tIn, 200, 24) : 1; if (s <= 0.001) return true;
  const z = lerp((o.zoom || [1, 1.12])[0], (o.zoom || [1, 1.12])[1], clamp((t - (o.tIn || 0)) / (o.dur || 6)));
  const [fx, fy] = o.focus || [0.5, 0.5], sc = Math.max(w / im.width, h / im.height) * z, dw = im.width * sc, dh = im.height * sc;
  g.save(); g.globalAlpha *= clamp(s * 1.5); g.translate(0, (1 - s) * 60);
  rrect(x, y, w, h, o.r ?? 28); g.save(); g.clip();
  g.drawImage(im, x + (w - dw) * fx, y + (h - dh) * fy, dw, dh);
  if (o.tint) { g.fillStyle = o.tint; g.fillRect(x, y, w, h); }
  const gr = g.createLinearGradient(0, y + h - 120, 0, y + h); gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(1, 'rgba(0,0,0,0.6)'); g.fillStyle = gr; g.fillRect(x, y + h - 120, w, 120);
  g.restore(); g.lineWidth = 3; g.strokeStyle = 'rgba(255,255,255,0.12)'; rrect(x, y, w, h, o.r ?? 28); g.stroke();
  const cr = o.credit ?? CREDITS[src]; if (cr) { g.font = F.mono(18); let c = cr; while (g.measureText(c).width > w - 40 && c.length > 10) c = c.slice(0, -2); text(c, x + 20, y + h - 18, 'mono', 18, 'rgba(255,255,255,0.8)', { ls: 1 }); }
  g.restore(); return true;
}
