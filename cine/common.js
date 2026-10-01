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

// ---------- more shared drawings ----------
// an ocean liner in side view, bow to the right; o: {hull, funnels, tilt, hospital, sink (0..1 clip below water)}
function liner(x, y, s, o = {}) {
  g.save(); g.translate(x, y); g.rotate(o.tilt || 0); g.scale(s, s);
  const hull = o.hull || '#15181B';
  g.fillStyle = hull; g.beginPath(); g.moveTo(-300, -40); g.lineTo(300, -40); g.lineTo(330, -58); g.lineTo(300, 30); g.lineTo(-270, 30); g.lineTo(-310, -10); g.closePath(); g.fill();
  if (o.hospital) { g.fillStyle = '#2F8A4A'; g.fillRect(-285, -12, 580, 10); g.fillStyle = RED; [-150, 150].forEach((cx) => { g.fillRect(cx - 14, -34, 28, 8); g.fillRect(cx - 4, -44, 8, 28); }); }
  g.fillStyle = o.hospital ? '#E9E6DE' : '#E8E1D0'; g.fillRect(-230, -70, 440, 30); g.fillRect(-190, -88, 330, 18);
  g.fillStyle = 'rgba(0,0,0,0.35)'; for (let i = -220; i < 200; i += 18) g.fillRect(i, -62, 8, 6);
  for (let k = 0; k < 4; k++) { const fx = -150 + k * 85; g.fillStyle = o.funnels || '#C9A15A'; g.fillRect(fx, -150, 36, 62); g.fillStyle = '#111'; g.fillRect(fx, -150, 36, 16); }
  g.strokeStyle = 'rgba(200,200,200,0.5)'; g.lineWidth = 2; g.beginPath(); g.moveTo(-280, -40); g.lineTo(-250, -190); g.moveTo(290, -40); g.lineTo(250, -190); g.stroke();
  g.restore();
}
function nightSea(t, wl = 1000, o = {}) {
  const sky = g.createLinearGradient(0, 0, 0, wl); sky.addColorStop(0, o.top || '#05070B'); sky.addColorStop(1, o.hor || '#1A2432'); g.fillStyle = sky; g.fillRect(0, 0, W, wl);
  const r = rng(o.seed || 7); for (let i = 0; i < 90; i++) { const x = r() * W, y = r() * wl * 0.8; g.fillStyle = `rgba(255,250,240,${0.35 * r() * (0.6 + 0.4 * Math.sin(t * 2 + i))})`; g.fillRect(x, y, 2, 2); }
}
function waterOver(t, wl = 1000, o = {}) {           // water drawn in front (hides what's below the line)
  const sea = g.createLinearGradient(0, wl, 0, H); sea.addColorStop(0, o.c1 || '#0E2233'); sea.addColorStop(1, '#030507'); g.fillStyle = sea;
  g.beginPath(); g.moveTo(0, wl); for (let x = 0; x <= W; x += 20) g.lineTo(x, wl + Math.sin(x / 50 + t * 2) * 5 + Math.sin(x / 23 - t * 3) * 2); g.lineTo(W, H); g.lineTo(0, H); g.closePath(); g.fill();
  g.strokeStyle = 'rgba(180,210,230,0.35)'; g.lineWidth = 2; g.beginPath(); for (let x = 0; x <= W; x += 20) g.lineTo(x, wl + Math.sin(x / 50 + t * 2) * 5); g.stroke();
}
// standard hook photo card on frame 0 (drawn fallback stays underneath when there is no photo)
const hookPhoto = (t, id = 'lead', o = {}) => photo(t, id, 80, o.y ?? 830, 920, o.h ?? 480, { zoom: [1, 1.08], dur: 5, focus: o.focus || [0.5, 0.35] });
function checkMark(x, y, s, col = GOLD) { g.strokeStyle = col; g.lineWidth = 10 * s; g.lineCap = 'round'; g.lineJoin = 'round'; g.beginPath(); g.moveTo(x - 22 * s, y); g.lineTo(x - 6 * s, y + 16 * s); g.lineTo(x + 24 * s, y - 18 * s); g.stroke(); }

// ---------- batch 3 helpers ----------
function clockFace(x, y, r, hh, mm, o = {}) {           // analog clock; hh/mm may be fractional
  g.save(); g.translate(x, y); g.fillStyle = o.face || '#EDE6D8'; g.beginPath(); g.arc(0, 0, r, 0, 6.283); g.fill(); g.lineWidth = r * 0.06; g.strokeStyle = PINK; g.stroke();
  for (let i = 0; i < 12; i++) { const a = i / 12 * 6.283; g.fillStyle = PINK; g.fillRect(Math.cos(a) * r * 0.82 - 3, Math.sin(a) * r * 0.82 - 3, 6, 6); }
  if (o.arcFrom != null) { g.fillStyle = 'rgba(255,59,48,0.35)'; g.beginPath(); g.moveTo(0, 0); g.arc(0, 0, r * 0.9, -Math.PI / 2 + o.arcFrom / 60 * 6.283, -Math.PI / 2 + mm / 60 * 6.283); g.closePath(); g.fill(); }
  const ha = -Math.PI / 2 + ((hh % 12) + mm / 60) / 12 * 6.283, ma = -Math.PI / 2 + mm / 60 * 6.283;
  g.strokeStyle = PINK; g.lineCap = 'round'; g.lineWidth = r * 0.07; g.beginPath(); g.moveTo(0, 0); g.lineTo(Math.cos(ha) * r * 0.5, Math.sin(ha) * r * 0.5); g.stroke();
  g.lineWidth = r * 0.045; g.beginPath(); g.moveTo(0, 0); g.lineTo(Math.cos(ma) * r * 0.75, Math.sin(ma) * r * 0.75); g.stroke(); g.restore();
}
function snowfall(t, n = 120, a = 1, seed = 5) { const r = rng(seed); g.fillStyle = '#fff'; for (let i = 0; i < n; i++) { const x = (r() * W + Math.sin(t + i) * 30), y = ((r() * H + t * (60 + r() * 80)) % H); g.globalAlpha = a * (0.3 + 0.6 * r()); g.beginPath(); g.arc(x, y, 1.5 + r() * 3, 0, 6.283); g.fill(); } g.globalAlpha = 1; }
function iconGrid(n, cols, x0, y0, dx, dy, fn) { for (let i = 0; i < n; i++) fn(x0 + (i % cols) * dx, y0 + Math.floor(i / cols) * dy, i); }
function doc(x, y, w, h, rot, t, tIn, fn) { const s = spring(t - tIn, 170, 20); if (s <= 0) return; g.save(); g.translate(0, (1 - s) * 400); paper(x, y, w, h, rot); fn(); g.restore(); }

// ---------- v3 "wow" helpers: 3D globe, full-bleed photos, impact text, embers ----------
const D2R = Math.PI / 180;
let RINGS = null;
function globeRings() { if (RINGS) return RINGS; RINGS = [];
  for (const f of WORLD) { const polys = f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates;
    for (const poly of polys) for (const ring of poly) { const a = new Float64Array(ring.length * 2); ring.forEach(([lo, la], j) => { a[j * 2] = lo * D2R; a[j * 2 + 1] = la * D2R; }); RINGS.push(a); } }
  return RINGS; }
function globeProj(lon0, lat0, cx, cy, R) { const l0 = lon0 * D2R, cl0 = Math.cos(lat0 * D2R), sl0 = Math.sin(lat0 * D2R);
  return (lo, la) => { const l = lo - l0, cp = Math.cos(la), sp = Math.sin(la), cl = Math.cos(l); const x = cp * Math.sin(l), y = cl0 * sp - sl0 * cp * cl, c = sl0 * sp + cl0 * cp * cl;
    if (c < 0) { const n = Math.hypot(x, y) || 1; return [cx + x / n * R, cy - y / n * R, c]; } return [cx + x * R, cy - y * R, c]; }; }
// draws an orthographic, lit globe; returns P(lonDeg, latDeg) -> [x, y, visible]
function globe(t, cx, cy, R, lon0, lat0, o = {}) {
  const P = globeProj(lon0, lat0, cx, cy, R);
  if (R < 4000) { const halo = g.createRadialGradient(cx, cy, R * 0.95, cx, cy, R * 1.18); halo.addColorStop(0, 'rgba(90,170,255,0.45)'); halo.addColorStop(1, 'rgba(90,170,255,0)'); g.fillStyle = halo; g.beginPath(); g.arc(cx, cy, R * 1.18, 0, 6.283); g.fill(); }
  g.save(); g.beginPath(); g.arc(cx, cy, R, 0, 6.283); g.clip();
  const oc = g.createRadialGradient(cx - R * 0.35, cy - R * 0.4, R * 0.1, cx, cy, R); oc.addColorStop(0, o.ocean1 || '#1F5E9A'); oc.addColorStop(1, o.ocean2 || '#071C33'); g.fillStyle = oc; g.fillRect(cx - R, cy - R, 2 * R, 2 * R);
  if (o.grid !== false && R < 3000) { g.strokeStyle = 'rgba(160,210,255,0.12)'; g.lineWidth = 1.2; for (let lo = -180; lo < 180; lo += 30) { g.beginPath(); let st = false; for (let la = -90; la <= 90; la += 5) { const [x, y, c] = P(lo * D2R, la * D2R); if (c < 0) { st = false; continue; } st ? g.lineTo(x, y) : g.moveTo(x, y); st = true; } g.stroke(); }
    for (let la = -60; la <= 60; la += 30) { g.beginPath(); let st = false; for (let lo = -180; lo <= 180; lo += 5) { const [x, y, c] = P(lo * D2R, la * D2R); if (c < 0) { st = false; continue; } st ? g.lineTo(x, y) : g.moveTo(x, y); st = true; } g.stroke(); } }
  g.beginPath(); for (const a of globeRings()) { let any = false; for (let j = 0; j < a.length; j += 2) if (Math.cos(a[j + 1]) * Math.cos(a[j] - lon0 * D2R) * Math.cos(lat0 * D2R) + Math.sin(a[j + 1]) * Math.sin(lat0 * D2R) > -0.05) { any = true; break; } if (!any) continue;
    for (let j = 0; j < a.length; j += 2) { const [x, y] = P(a[j], a[j + 1]); j ? g.lineTo(x, y) : g.moveTo(x, y); } g.closePath(); }
  g.fillStyle = o.land || '#3A4A30'; g.fill(); g.strokeStyle = o.coast || 'rgba(255,240,200,0.25)'; g.lineWidth = Math.max(1, Math.min(3, R / 400)); g.stroke();
  if (R < 4000) { const sh = g.createRadialGradient(cx - R * 0.45, cy - R * 0.5, R * 0.2, cx, cy, R * 1.05); sh.addColorStop(0, 'rgba(255,255,255,0.10)'); sh.addColorStop(0.6, 'rgba(0,0,0,0)'); sh.addColorStop(1, 'rgba(0,0,10,0.65)'); g.fillStyle = sh; g.fillRect(cx - R, cy - R, 2 * R, 2 * R); }
  g.restore();
  return (lo, la) => { const r = P(lo * D2R, la * D2R); return [r[0], r[1], r[2] > 0]; };
}
// camera keys: [[t, lon, lat, R], …] — R interpolates exponentially, spring-smoothed
function globeCam(t, keys, k = 22, d = 9.5) { let lon = keys[0][1], lat = keys[0][2], lr = Math.log(keys[0][3]);
  for (let i = 1; i < keys.length; i++) { const p = spring(t - keys[i][0], k, d); lon += (keys[i][1] - keys[i - 1][1]) * p; lat += (keys[i][2] - keys[i - 1][2]) * p; lr += (Math.log(keys[i][3]) - Math.log(keys[i - 1][3])) * p; }
  return { lon, lat, R: Math.exp(lr) }; }
function stars(t, n = 160, seed = 2) { const r = rng(seed); for (let i = 0; i < n; i++) { const x = r() * W, y = r() * H, s = r(); g.fillStyle = `rgba(255,255,255,${(0.2 + 0.6 * s) * (0.7 + 0.3 * Math.sin(t * 2 + i))})`; g.fillRect(x, y, 1 + s * 2, 1 + s * 2); } }
// full-bleed real photo with Ken Burns and grade; returns false if not available
function photoBG(t, id, o = {}) { const im = PHOTOS[id]; if (!im) return false;
  const z = lerp((o.zoom || [1.05, 1.18])[0], (o.zoom || [1.05, 1.18])[1], clamp(t / (o.dur || 6))), [fx, fy] = o.focus || [0.5, 0.4];
  const sc = Math.max(W / im.width, H / im.height) * z, dw = im.width * sc, dh = im.height * sc, px = (o.pan || 0) * t * 20;
  g.save(); g.filter = o.blur ? `blur(${o.blur}px)` : 'none'; g.drawImage(im, (W - dw) * fx + px, (H - dh) * fy, dw, dh); g.filter = 'none';
  const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, `rgba(8,8,10,${o.top ?? 0.75})`); gr.addColorStop(0.45, `rgba(8,8,10,${o.mid ?? 0.25})`); gr.addColorStop(1, `rgba(8,8,10,${o.bottom ?? 0.85})`); g.fillStyle = gr; g.fillRect(0, 0, W, H);
  if (o.tint) { g.fillStyle = o.tint; g.fillRect(0, 0, W, H); }
  if (CREDITS[id]) text(CREDITS[id].slice(0, 70), 80, 1560, 'mono', 18, 'rgba(255,255,255,0.55)', { ls: 1 });
  g.restore(); return true; }
// impact number/word: springs in with an RGB split that settles
function rgbPop(str, x, y, size, color, t, tIn, o = {}) { const lt = t - tIn; if (lt < 0) return; const s = spring(lt, o.k || 320, o.d || 16), sp = 18 * Math.exp(-lt * 7);
  g.save(); g.translate(x, y); g.scale(s, s); const al = o.align || 'left', fam = o.fam || 'disp';
  if (sp > 0.5) { g.globalCompositeOperation = 'lighter'; text(str, -sp, 0, fam, size, 'rgba(255,40,60,0.8)', { align: al }); text(str, sp, 0, fam, size, 'rgba(40,200,255,0.8)', { align: al }); g.globalCompositeOperation = 'source-over'; }
  text(str, 0, 0, fam, size, color, { align: al, shadow: true }); g.restore(); }
function embers(t, x0, x1, y0, n = 60, seed = 3, col = [255, 150, 60]) { g.save(); g.globalCompositeOperation = 'lighter'; const r = rng(seed);
  for (let i = 0; i < n; i++) { const ph = (t * (0.3 + r() * 0.5) + r()) % 1, x = lerp(x0, x1, r()) + Math.sin(t * 2 + i) * 30 * ph, y = y0 - ph * (500 + r() * 500), s = 2 + r() * 4;
    g.fillStyle = `rgba(${col.join(',')},${(1 - ph) * 0.9})`; g.beginPath(); g.arc(x, y, s, 0, 6.283); g.fill(); } g.restore(); }
function shockRing(x, y, t, t0, max = 900, col = '255,230,190', n = 3) { for (let k = 0; k < n; k++) { const p = clamp((t - t0) * 0.7 - k * 0.12); if (p <= 0 || p >= 1) continue;
  g.strokeStyle = `rgba(${col},${(1 - p) * 0.8})`; g.lineWidth = 10 * (1 - p) + 2; g.beginPath(); g.arc(x, y, 20 + p * max, 0, 6.283); g.stroke(); } }

function human(x, ground, h, col) {      // a slim standing silhouette, h px tall
  if (h < 4) return; const r = h * 0.065; g.fillStyle = col;
  g.beginPath(); g.arc(x, ground - h + r, r, 0, 6.283); g.fill();
  g.beginPath(); g.roundRect(x - h * 0.105, ground - h * 0.84, h * 0.21, h * 0.4, h * 0.05); g.fill();
  g.beginPath(); g.roundRect(x - h * 0.098, ground - h * 0.47, h * 0.085, h * 0.47, h * 0.03); g.roundRect(x + h * 0.013, ground - h * 0.47, h * 0.085, h * 0.47, h * 0.03); g.fill();
  g.beginPath(); g.roundRect(x - h * 0.15, ground - h * 0.82, h * 0.05, h * 0.37, h * 0.025); g.roundRect(x + h * 0.1, ground - h * 0.82, h * 0.05, h * 0.37, h * 0.025); g.fill();
}
function ramp(t, t0, d, a, b) { const x = clamp((t - t0) / d); return lerp(a, b, 1 - Math.pow(1 - x, 3)); }   // ease-out counter
function glowDot(x, y, r, col = '120,190,255', a = 1) { const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, `rgba(${col},${a})`); gr.addColorStop(1, `rgba(${col},0)`); g.fillStyle = gr; g.fillRect(x - r, y - r, 2 * r, 2 * r); }
