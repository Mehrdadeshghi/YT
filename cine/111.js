// Wiki Roulette #111 — HOW IT WORKS #3: how a touchscreen works (and why a sausage can do it). Motion graphics (tech.js kit).
// Retention: frame-1 paradox (your phone can't feel your finger) → exploded phone layers (hidden grid) → cross-section: field lines
// flow INTO the finger ("steals") → 120 Hz scan finds the heat blob → twist: gloves fail (NO SIGNAL) → absurd payoff: a sausage works
// (Korea 2010, sales up) → history drop (1965 radar screen) → loop line + binary comment question (would you use a sausage?).
const N = 7;
// ---------- shared drawings ----------
// a fingertip / gloved finger / sausage, tip at (x,y), body pointing away at angle ang (0 = straight up)
function tsDigit(kind, x, y, ang, t, o = {}) { g.save(); g.translate(x, y); g.rotate(ang); g.scale(o.s ?? 1, o.s ?? 1);
  const w = kind === 'glove' ? 200 : kind === 'sausage' ? 140 : 170, L = kind === 'sausage' ? 560 : 1100;
  g.beginPath(); if (kind === 'sausage') { g.moveTo(-w / 2, -L + w / 2); g.arc(0, -L + w / 2, w / 2, Math.PI, 0); } else g.moveTo(-w / 2, -L);
  g.lineTo(w / 2, kind === 'sausage' ? -L + w / 2 : -L); g.lineTo(w / 2, -w / 2); g.arc(0, -w / 2, w / 2, 0, Math.PI); g.closePath();
  const gr = g.createLinearGradient(-w / 2, 0, w / 2, 0);
  const pal = kind === 'glove' ? ['#1E2944', '#3E5180', '#33446C', '#141C30'] : kind === 'sausage' ? ['#7A2414', '#E0703F', '#C2502C', '#6A1C0E'] : ['#A86D50', '#F2C6A4', '#E2A985', '#8E5A40'];
  pal.forEach((c, k) => gr.addColorStop([0, 0.38, 0.62, 1][k], c)); g.shadowColor = 'rgba(0,0,0,0.55)'; g.shadowBlur = 40; g.fillStyle = gr; g.fill(); g.shadowBlur = 0;
  g.save(); g.clip();
  if (kind === 'finger') { rrect(-w * 0.3, -w * 1.22, w * 0.6, w * 0.82, 34); const ng = g.createLinearGradient(0, -w * 1.22, 0, -w * 0.4); ng.addColorStop(0, '#E9B8A6'); ng.addColorStop(1, '#F8DCCF'); g.fillStyle = ng; g.fill();
    g.strokeStyle = 'rgba(120,70,50,0.35)'; g.lineWidth = 3; g.stroke(); g.fillStyle = 'rgba(255,255,255,0.35)'; rrect(-w * 0.18, -w * 1.15, w * 0.1, w * 0.6, 8); g.fill();
    g.strokeStyle = 'rgba(110,60,40,0.45)'; g.lineWidth = 4; [-w * 1.9, -w * 2.05, -w * 2.2].forEach((yy) => { g.beginPath(); g.moveTo(-w * 0.35, yy); g.quadraticCurveTo(0, yy + 14, w * 0.35, yy); g.stroke(); }); }
  if (kind === 'glove') { g.strokeStyle = 'rgba(160,180,230,0.22)'; g.lineWidth = 3; for (let yy = -L; yy < 0; yy += 18) for (let xx = -w / 2; xx < w / 2; xx += 22) { g.beginPath(); g.moveTo(xx, yy); g.lineTo(xx + 11, yy + 12); g.lineTo(xx + 22, yy); g.stroke(); }
    g.strokeStyle = 'rgba(10,14,25,0.7)'; g.setLineDash([10, 8]); g.lineWidth = 4; g.beginPath(); g.moveTo(0, -L); g.lineTo(0, -12); g.stroke(); }
  if (kind === 'sausage') { g.fillStyle = 'rgba(255,255,255,0.32)'; rrect(-w * 0.28, -L + 60, w * 0.12, L - 120, 10); g.fill(); g.strokeStyle = 'rgba(90,20,8,0.35)'; g.lineWidth = 4;
    for (let k = 1; k < 6; k++) { const yy = -L + k * L / 6; g.beginPath(); g.moveTo(-w / 2, yy); g.quadraticCurveTo(0, yy - 16, w / 2, yy); g.stroke(); } }
  if (o.charge > 0) { const ch = o.charge, gl = g.createRadialGradient(0, -40, 10, 0, -40, 420); gl.addColorStop(0, `rgba(62,230,255,${0.55 * ch})`); gl.addColorStop(1, 'rgba(62,230,255,0)'); g.fillStyle = gl; g.fillRect(-w, -L, w * 2, L);
    for (let k = 0; k < 3; k++) tsBolt(-w * 0.25 + k * w * 0.25, -L * 0.7, (k - 1) * 20, -20, t, CY, 7 + k, ch * 0.8, 3); }
  g.restore(); if (kind === 'sausage') { g.fillStyle = '#5A1A0C'; g.beginPath(); g.arc(0, -L + 4, 14, 0, 6.283); g.fill(); }
  g.restore(); }
// a jagged electric arc between two points (re-randomised 16× per second)
function tsBolt(x1, y1, x2, y2, t, col = CY, seed = 1, a = 1, w = 5) { if (a <= 0) return; const r = rng(Math.floor(t * 16) * 31 + seed), n = 10, nx = -(y2 - y1), ny = x2 - x1, nl = Math.hypot(nx, ny) || 1, pts = [];
  for (let i = 0; i <= n; i++) { const u = i / n, off = (i && i < n) ? (r() - 0.5) * 0.18 * Math.hypot(x2 - x1, y2 - y1) * Math.sin(Math.PI * u) : 0; pts.push([lerp(x1, x2, u) + nx / nl * off, lerp(y1, y2, u) + ny / nl * off]); }
  glowLine(pts, col, w * 2.2, 0.5 * a); glowLine(pts, '#FFFFFF', w, a); }
// side cross-section: glass slab, electrodes underneath, field lines between transmit (gold) and receive (cyan) electrodes.
// o.touch = { x, k } bends the field into a conductor touching at x (k = 0..1); o.on = field visibility
const TS_X = [150, 280, 410, 540, 670, 800, 930], TS_H = [55, 105, 165, 240];
function tsXsec(t, o = {}) { const GY = o.y ?? 1080, EY = GY + 95, on = o.on ?? 1, tc = o.touch;
  g.save(); g.fillStyle = 'rgba(6,14,26,0.9)'; g.fillRect(90, GY + 125, 900, 60); for (let x = 100; x < 980; x += 12) { g.fillStyle = ['#FF3B4E', '#3EE66A', '#3E7BFF'][(x / 12) % 3 | 0]; g.globalAlpha = 0.35; g.fillRect(x, GY + 135, 8, 40); } g.restore();
  for (let i = 0; i < TS_X.length - 1; i++) { const a = TS_X[i], b = TS_X[i + 1], m = (a + b) / 2, tx = i % 2 ? b : a;
    TS_H.forEach((h, j) => { const wgt = tc ? clamp(1 - Math.abs(m - tc.x) / 300) * (h >= 100 ? 1 : 0.3) : 0, s = tc ? tc.k * wgt : 0;
      g.save(); g.globalAlpha = on * (0.75 - j * 0.12) * (1 - 0.85 * s); g.strokeStyle = j % 2 ? CY : GOLD; g.lineWidth = 3.5; g.shadowColor = CY; g.shadowBlur = 12; g.setLineDash([16, 12]); g.lineDashOffset = -t * 70;
      g.beginPath(); g.moveTo(a, EY); g.quadraticCurveTo(m, EY - 2 * h, b, EY); g.stroke(); g.restore();
      if (s > 0.02) { const cx = lerp(m, tc.x, 0.55), cy = EY - 2 * h * 0.85, ex = tc.x, ey = GY - 6;
        g.save(); g.globalAlpha = s; g.strokeStyle = MG; g.lineWidth = 5; g.shadowColor = MG; g.shadowBlur = 22; g.setLineDash([18, 10]); g.lineDashOffset = -t * 160;
        g.beginPath(); g.moveTo(tx, EY); g.quadraticCurveTo(cx, cy, ex, ey); g.stroke(); g.restore();
        for (let p = 0; p < 3; p++) { const u = (t * 1.4 + p / 3 + j * 0.13 + i * 0.07) % 1, q = 1 - u; glowDot(q * q * tx + 2 * q * u * cx + u * u * ex, q * q * EY + 2 * q * u * cy + u * u * ey, 7, '#FFFFFF', s); } } }); }
  g.save(); rrect(90, GY, 900, 70, 14); const gg = g.createLinearGradient(0, GY, 0, GY + 70); gg.addColorStop(0, 'rgba(200,240,255,0.30)'); gg.addColorStop(1, 'rgba(120,180,220,0.10)'); g.fillStyle = gg; g.fill();
  g.lineWidth = 3; g.strokeStyle = 'rgba(220,245,255,0.7)'; g.stroke(); g.fillStyle = 'rgba(255,255,255,0.5)'; g.fillRect(110, GY + 6, 860, 3); g.restore();
  TS_X.forEach((x, i) => { const col = i % 2 ? CY : GOLD; g.save(); g.shadowColor = col; g.shadowBlur = 18 * on; g.fillStyle = col; g.fillRect(x - 34, EY - 8, 68, 16); g.restore(); });
  if (o.labels) { text('GLASS', 110, GY + 50, 'mono', 26, 'rgba(255,255,255,0.75)'); text('ELECTRODES', 110, EY + 48, 'mono', 24, GOLD); } }
// exploded phone layers (affine "iso" view): display, touch grid, cover glass
function tsLayer(cx, cy, off, s, draw) { const th = -0.52, c = Math.cos(th), sn = Math.sin(th); g.save(); g.transform(s * c, s * 0.5 * sn, -s * sn, s * 0.5 * c, cx, cy - off); draw(); g.restore(); }
function tsStack(t, sep, o = {}) { const cx = 540, cy = o.cy ?? 1010, s = 0.85, gOn = o.grid ?? 0, pulse = o.pulse ?? -1;
  tsLayer(cx, cy, 0, s, () => { g.shadowColor = 'rgba(0,0,0,0.8)'; g.shadowBlur = 60; rrect(-200, -390, 400, 780, 50); g.fillStyle = '#0B0E14'; g.fill(); g.shadowBlur = 0;
    rrect(-185, -375, 370, 750, 40); const wg = g.createLinearGradient(0, -375, 0, 375); wg.addColorStop(0, '#5B2BD8'); wg.addColorStop(1, '#0FA3C8'); g.fillStyle = wg; g.fill();
    const pal = [GOLD, CY, MG, LIME, '#FF8A3D', '#8AA4FF']; for (let r = 0; r < 5; r++) for (let k = 0; k < 4; k++) { rrect(-150 + k * 82, -310 + r * 110, 56, 56, 16); g.fillStyle = pal[(r * 4 + k) % 6]; g.fill(); } });
  if (sep > 0.01 || gOn > 0) tsLayer(cx, cy, sep * 195, s, () => { g.save(); g.globalAlpha = Math.max(0.15, gOn) * (0.6 + 0.4 * Math.sin(t * 30) * (gOn < 1 ? 1 : 0)); g.lineWidth = 3;
    for (let k = -6; k <= 6; k++) { g.strokeStyle = GOLD; g.shadowColor = GOLD; g.shadowBlur = 14; g.beginPath(); g.moveTo(-185, k * 58); g.lineTo(185, k * 58); g.stroke(); }
    for (let k = -3; k <= 3; k++) { g.strokeStyle = CY; g.shadowColor = CY; g.beginPath(); g.moveTo(k * 56, -375); g.lineTo(k * 56, 375); g.stroke(); } g.restore();
    if (pulse >= 0) for (let k = -6; k <= 6; k++) { const u = ((t - pulse) * 1.6 + k * 0.07) % 1; glowDot(-185 + u * 370, k * 58, 7, '#FFFFFF', 0.9); }
    if (pulse >= 0) for (let k = -3; k <= 3; k++) { const u = ((t - pulse) * 1.3 + k * 0.11) % 1; glowDot(k * 56, -375 + u * 750, 7, '#FFFFFF', 0.9); } });
  if (sep > 0.01) tsLayer(cx, cy, sep * 390, s, () => { rrect(-200, -390, 400, 780, 50); g.fillStyle = 'rgba(190,230,255,0.13)'; g.fill(); g.lineWidth = 4; g.strokeStyle = 'rgba(230,248,255,0.75)'; g.stroke();
    g.save(); g.clip(); g.fillStyle = 'rgba(255,255,255,0.18)'; g.beginPath(); const sx = -400 + ((t * 300) % 1100); g.moveTo(sx, -400); g.lineTo(sx + 90, -400); g.lineTo(sx + 330, 400); g.lineTo(sx + 240, 400); g.fill(); g.restore(); }); }
// top view: the scan grid with a touch "heat blob" revealed row by row
const TS_C = 12, TS_R = 16, TS_G = [150, 930, 540, 1180];
function tsScan(t, o = {}) { const [x0, x1, y0, y1] = TS_G, dx = (x1 - x0) / (TS_C - 1), dy = (y1 - y0) / (TS_R - 1), row = Math.floor(t * (o.speed ?? 28)) % TS_R;
  g.save(); g.lineWidth = 2.5; for (let r = 0; r < TS_R; r++) { const hi = r === row; g.strokeStyle = hi ? GOLD : 'rgba(255,200,80,0.22)'; g.shadowColor = GOLD; g.shadowBlur = hi ? 26 : 0; g.lineWidth = hi ? 6 : 2.5; g.beginPath(); g.moveTo(x0 - 30, y0 + r * dy); g.lineTo(x1 + 30, y0 + r * dy); g.stroke(); }
  g.shadowBlur = 0; g.lineWidth = 2.5; for (let c = 0; c < TS_C; c++) { g.strokeStyle = 'rgba(62,230,255,0.28)'; g.beginPath(); g.moveTo(x0 + c * dx, y0 - 30); g.lineTo(x0 + c * dx, y1 + 30); g.stroke(); } g.restore();
  for (let c = 0; c < TS_C; c++) glowDot(x0 + c * dx, y0 + row * dy, 6, '#FFFFFF', 0.9);
  (o.touches || []).forEach(([tx, ty, t0]) => { const lt = t - t0; if (lt < 0) return; const rev = Math.floor(lt * (o.speed ?? 28)) + 1;
    for (let r = 0; r < Math.min(TS_R, rev); r++) for (let c = 0; c < TS_C; c++) { const x = x0 + c * dx, y = y0 + r * dy, v = Math.exp(-((x - tx) ** 2 + (y - ty) ** 2) / (2 * 75 * 75)); if (v < 0.06) continue;
      const col = v > 0.66 ? '#FFFFFF' : v > 0.4 ? GOLD : v > 0.2 ? MG : CY; g.save(); g.globalAlpha = Math.min(1, v * 1.3); g.shadowColor = col; g.shadowBlur = 24; g.fillStyle = col; rrect(x - 26 * v - 8, y - 26 * v - 8, 52 * v + 16, 52 * v + 16, 8); g.fill(); g.restore(); } }); }
function tsCross(x, y, t, t0, str) { const lt = t - t0; if (lt < 0) return; const p = easeOut(lt / 0.35), L = lerp(600, 70, p);
  g.save(); g.strokeStyle = LIME; g.lineWidth = 5; g.shadowColor = LIME; g.shadowBlur = 20; g.beginPath(); g.moveTo(x - L - 40, y); g.lineTo(x - 40, y); g.moveTo(x + 40, y); g.lineTo(x + L + 40, y); g.moveTo(x, y - L - 40); g.lineTo(x, y - 40); g.moveTo(x, y + 40); g.lineTo(x, y + L + 40); g.stroke();
  g.strokeRect(x - 60 * (2 - p), y - 60 * (2 - p), 120 * (2 - p), 120 * (2 - p)); g.restore(); shock(x, y, t, t0 + 0.3, 200, LIME); if (lt > 0.3) chip(str, x, y - 150, t, t0 + 0.3, { size: 34, bg: LIME, fg: BG }); }
// green radar scope (1965 air-traffic display)
const TS_BLIPS = [[0.6, 0.55], [2.2, 0.75], [3.5, 0.4], [4.6, 0.82], [5.5, 0.62]];
function tsRadar(t, cx, cy, r, o = {}) { const a = (t * 2.0) % 6.283; g.save(); g.beginPath(); g.arc(cx, cy, r, 0, 6.283); g.fillStyle = '#021A0C'; g.fill(); g.clip();
  for (let k = 0; k < 40; k++) { const aa = a - k * 0.03; g.fillStyle = `rgba(60,255,120,${0.28 * (1 - k / 40)})`; g.beginPath(); g.moveTo(cx, cy); g.arc(cx, cy, r, aa - 0.03, aa); g.closePath(); g.fill(); }
  g.strokeStyle = 'rgba(60,255,120,0.35)'; g.lineWidth = 2; [0.25, 0.5, 0.75, 1].forEach((k) => { g.beginPath(); g.arc(cx, cy, r * k, 0, 6.283); g.stroke(); });
  g.beginPath(); g.moveTo(cx - r, cy); g.lineTo(cx + r, cy); g.moveTo(cx, cy - r); g.lineTo(cx, cy + r); g.stroke(); g.restore();
  g.save(); g.lineWidth = 8; g.strokeStyle = '#1F3A2A'; g.beginPath(); g.arc(cx, cy, r + 4, 0, 6.283); g.stroke(); g.restore();
  TS_BLIPS.forEach(([th, rr], k) => { const d = ((a - th) % 6.283 + 6.283) % 6.283, br = Math.exp(-d * 0.9), x = cx + Math.cos(th) * r * rr, y = cy + Math.sin(th) * r * rr; glowDot(x, y, 9 + (o.hi === k ? 6 : 0), o.hi === k ? GOLD : '#5CFF8A', 0.25 + 0.75 * br); }); }
function tsSnow(t, a = 1) { const r = rng(5); for (let i = 0; i < 90; i++) { const x = (r() * W + Math.sin(t + i) * 30), y = (r() * H + t * (80 + r() * 120)) % H, s = 2 + r() * 5; glowDot(x, y, s, '#FFFFFF', 0.6 * a); } }

// ---------- scenes ----------
VIS.open = (K) => { const fe = sw('feels', 2.2), el = sw('electricity', 2.8); K(0.05, 'hit', 1.3); K(0.3, 'wrong', 1); K(fe, 'zap', 0.9); ks(K, drop(el, 0.4));
  return (t) => { techBg(t, '#03070F', '#0A1C33'); const dn = easeOut((t - 0.2) / 1.6), ty = lerp(720, 972, dn), tx = 540 + (980 - ty) * 0.05;
    tsXsec(t, { y: 980, on: 0.4 + 0.6 * clamp((t - 0.3) / 0.8), touch: t > fe ? { x: 540, k: clamp((t - fe) / 0.5) } : null });
    tsDigit('finger', tx, ty, 0.75, t, { charge: t > el ? 1 : t > fe ? 0.4 : 0 });
    if (t > fe) for (let k = 0; k < 3; k++) tsBolt(tx - 30 + k * 30, ty, 470 + k * 70, 986, t, k === 1 ? '#FFFFFF' : CY, k + 3, t > el ? 1 : 0.5);
    if (t > el) { flash(t, el, 0.5, 0.12, '#BFF6FF'); shock(540, 980, t, el, 520, CY, 1.0); rgbText('ELECTRICITY', 540, 740, 118, t, el, { color: CY, jitter: true }); }
    tag(t); hook(t, EP.hook, 400); if (EP.series) chip(EP.series, 80, 300, t, -0.3, { size: 26, align: 'left', bg: GOLD, fg: BG }); }; };

VIS[0] = S(() => { const gl = sw('glass', 0.5), inv = sw('invisible', 1.3), wi = sw('wires', 2.8), se = sw('see', 2.3);
  return (K) => { ks(K, [[gl, 'whoosh', 0.9], [inv, 'glitch', 0.9], [inv + 0.02, 'zap', 0.6], [wi, 'ding', 1], [se, 'pop', 0.7, 900]]);
    return (t) => { techBg(t); tag(t, 0, N); const sep = easeOut((t - gl + 0.1) / 0.7), gOn = t > inv ? clamp((t - inv) / 0.5) : 0;
      tsStack(t, sep, { grid: gOn, pulse: t > wi ? wi : -1 });
      if (sep > 0.6) { const a = clamp((sep - 0.6) / 0.4); g.save(); g.globalAlpha = a; text('COVER GLASS', 960, 640, 'mono', 30, '#DFF6FF', { align: 'right' }); text('TOUCH GRID', 960, 830, 'mono', 30, CY, { align: 'right' }); text('DISPLAY', 960, 1020, 'mono', 30, '#C9B8FF', { align: 'right' }); g.restore(); }
      if (t > inv) rgbText('INVISIBLE GRID', 540, 420, 100, t, inv, { color: CY });
      if (t > se) { framed(t, 'capgrid', 60, 1010, 300, { b: [0.5, 0.5, 1.08], backdrop: false }); realBadge(t, se, 'REAL PHOTO · PHONE TOUCH GRID, TRACKS VISIBLE IN LIGHT', 975); } }; }; });

VIS[1] = S(() => { const cr = sw('crossing', 0.3), fi = sw('field', 1.4), bo = sw('body', 2.2), co = sw('conducts', 2.6), fg = sw('finger', 3.4), st = sw('steals', 3.8);
  return (K) => { ks(K, [[cr, 'tick', 0.8], [fi, 'zap', 0.8], [co, 'whoosh', 0.7], ...drop(st, 0.4)]);
    return (t) => { techBg(t, '#04060E', '#0D1730'); tag(t, 1, N); const on = clamp((t - fi + 0.3) / 0.6) * 0.85 + 0.15;
      const dn = easeOut((t - bo) / Math.max(0.5, st - bo)), ty = lerp(460, 972, dn);
      tsXsec(t, { y: 980, on, labels: t < bo, touch: t > st - 0.1 ? { x: 540, k: clamp((t - st + 0.1) / 0.45) } : null });
      if (t > bo) tsDigit('finger', 540, ty, 0, t, { charge: t > co ? Math.min(1, (t - co) * 2) * (t > st ? 1 : 0.5) : 0 });
      if (t > cr && t < bo) { ring(t, cr, 540, 1075, 90, { color: GOLD, spot: false }); chip('ONE CROSSING', 540, 870, t, cr, { size: 32, bg: GOLD, fg: BG }); }
      if (t > fi && t < bo) rgbText('ELECTRIC FIELD', 540, 640, 100, t, fi, { color: CY });
      if (t > co && t < st) chip('YOUR BODY CONDUCTS', 540, 440, t, co, { size: 38, bg: CY, fg: BG });
      if (t > st) { rgbText('STOLEN!', 540, 470, 130, t, st, { color: MG }); const v = Math.round(lerp(100, 74, clamp((t - st) / 0.5)));
        g.save(); rrect(640, 560, 340, 110, 24); g.fillStyle = 'rgba(8,16,30,0.92)'; g.fill(); g.lineWidth = 4; g.strokeStyle = MG; g.stroke(); g.restore();
        text('FIELD', 670, 605, 'mono', 26, '#9FB3CF'); text(`${v}%`, 950, 650, 'disp', 64, MG, { align: 'right' }); } }; }; });

VIS[2] = S(() => { const hu = sw('hundred', 0.5), sc = sw('scans', 1.6), ex = sw('exactly', 2.8), TX = 612, TY = 884;
  return (K) => { ks(K, [[hu, 'whoosh', 0.7], [sc, 'type', 1], [ex, 'stamp', 1], [ex + 0.02, 'ding', 1]]); for (let k = 0; k < 8; k++) K(0.2 + k * 0.3, 'tick', 0.35);
    return (t) => { techBg(t, '#03060D', '#091A2E'); tag(t, 2, N);
      tsScan(t, { speed: 30, touches: [[TX, TY, Math.max(0.2, sc - 0.6)]] });
      if (t < ex) { g.save(); g.globalAlpha = 0.25; g.fillStyle = '#F2C6A4'; g.beginPath(); g.ellipse(TX, TY, 95, 120, 0, 0, 6.283); g.fill(); g.restore(); }
      const n = Math.floor(t * 120); rgbText(`SCAN #${String(n).padStart(4, '0')}`, 540, 395, 70, t, 0.1, { color: '#FFFFFF' });
      if (t > hu) chip('120 SCANS EVERY SECOND', 540, 470, t, hu, { size: 32, bg: GOLD, fg: BG });
      if (t > ex) tsCross(TX, TY, t, ex, 'X 612 · Y 884');
      if (t > ex + 0.6) { clip(t, 'tenfing', { box: [70, 880, 400, 282], a: [0.58, 0.4, 1.4], b: [0.58, 0.4, 1.45], t0: ex + 0.6, backdrop: false, credit: '' }); footBadge(t, ex + 0.6, 'REAL FOOTAGE · RAW TOUCH DATA, 10 FINGERS', 835); } }; }; });

VIS[3] = S(() => { const gv = sw('gloves', 0.3), wo = sw('work', 0.9), fa = sw('fabric', 1.4), co = sw('conduct', 2.0);
  return (K) => { ks(K, [[gv, 'whoosh', 0.8], [wo, 'wrong', 1.1], [wo + 0.02, 'glitch', 0.9], [fa, 'pop', 0.8, 600]]);
    return (t) => { techBg(t, '#0E0408', '#22070F'); tag(t, 3, N); const dn = easeOut((t - gv + 0.2) / 0.5), ty = lerp(460, 972, dn);
      tsXsec(t, { y: 980, on: 1 }); tsDigit('glove', 540, ty, 0, t);
      if (t > wo) { const gl = Math.sin(t * 50) * 6 * Math.max(0, 1 - (t - wo) * 1.5); g.save(); g.translate(gl, 0); rgbText('NO SIGNAL', 540, 470, 130, t, wo, { color: RED2, jitter: true }); g.restore();
        if (Math.floor(t * 5) % 2) { g.fillStyle = 'rgba(255,40,60,0.10)'; g.fillRect(0, 0, W, H); }
        g.save(); g.strokeStyle = RED2; g.lineWidth = 16; g.lineCap = 'round'; g.shadowColor = RED2; g.shadowBlur = 30; const p = easeOut((t - wo) / 0.3), R = 90;
        g.beginPath(); g.moveTo(830 - R, 700 - R); g.lineTo(830 - R + 2 * R * p, 700 - R + 2 * R * p); g.moveTo(830 + R, 700 - R); g.lineTo(830 + R - 2 * R * p, 700 - R + 2 * R * p); g.stroke(); g.restore(); }
      if (t > fa) chip(t > co ? 'FABRIC = INSULATOR' : 'FABRIC', 540, 860, t, fa, { size: 40, bg: RED2, fg: '#FFF' }); }; }; });

VIS[4] = S(() => { const sa = sw('sausage', 0.2), tw = sw('twenty', 1.4), fr = sw('freezing', 2.0), ta = sw('tapped', 3.4), sl = sw('sales', 5.2), so = sw('soared', 5.8);
  return (K) => { ks(K, [...drop(sa, 0.35), [tw, 'whoosh', 0.8], [fr, 'swish', 0.6], [ta, 'pop', 0.8, 500], [ta + 0.4, 'pop', 0.8, 650], [sl, 'ding', 0.9], [so, 'boom', 0.9]]);
    return (t) => { if (t < tw) { techBg(t, '#04060E', '#0D1730'); tag(t, 4, N); const dn = easeOut((t - 0.05) / Math.max(0.4, sa + 0.2)), ty = lerp(520, 972, dn);
        tsXsec(t, { y: 980, touch: t > sa ? { x: 540, k: clamp((t - sa) / 0.4) } : null }); tsDigit('sausage', 540, ty, 0.12, t, { charge: t > sa ? 0.8 : 0 });
        if (t > sa) { rgbText('A SAUSAGE?!', 540, 470, 130, t, sa, { color: GOLD }); chip('✓ TOUCH DETECTED', 540, 860, t, sa + 0.25, { size: 38, bg: LIME, fg: BG }); lot(t, sa + 0.2, 'lol', 900, 700, 130); } return; }
      techBg(t, '#06101E', '#163252'); tsSnow(t); tag(t, 4, N); flash(t, tw, 0.4, 0.1);
      if (t < sl) { chip('SOUTH KOREA · WINTER 2010', 540, 400, t, tw, { size: 40, bg: CY, fg: BG }); if (t > fr) lot(t, fr, 'cold', 930, 520, 120);
        framed(t, 'sausage', 70, 500, 430, { b: [0.5, 0.5, 1.08], backdrop: false }); realBadge(t, tw + 0.1, 'REAL PHOTO · SNACK SAUSAGE', 470);
        const tp = t > ta ? Math.abs(Math.sin((t - ta) * 7)) : 1;
        phoneFrame(760, 900, 0.62, () => { const wg = g.createLinearGradient(0, -378, 0, 378); wg.addColorStop(0, '#1B3F7A'); wg.addColorStop(1, '#0B1A33'); g.fillStyle = wg; g.fillRect(-190, -380, 380, 760);
          const pal = [GOLD, CY, MG, LIME]; for (let r = 0; r < 5; r++) for (let k = 0; k < 4; k++) { rrect(-150 + k * 82, -300 + r * 110, 56, 56, 16); g.fillStyle = pal[(r + k) % 4]; g.fill(); } });
        if (t > ta) { shock(700, 950, t, ta + Math.floor((t - ta) * 7 / Math.PI) * Math.PI / 7, 90, CY, 0.4); tsDigit('sausage', 700, 950 - tp * 120, 0.5, t, { s: 0.7 }); } return; }
      if (t < so) chip('SOUTH KOREA · WINTER 2010', 540, 400, t, -1, { size: 40, bg: CY, fg: BG });
      const p = easeOut((t - sl) / 0.9); g.save(); g.strokeStyle = 'rgba(255,255,255,0.35)'; g.lineWidth = 4; g.beginPath(); g.moveTo(150, 680); g.lineTo(150, 1150); g.lineTo(950, 1150); g.stroke(); g.restore();
      const pts = []; for (let i = 0; i <= 40; i++) { const u = i / 40; if (u > p) break; pts.push([150 + u * 800, 1120 - (u < 0.55 ? u * 70 : 38 + Math.pow((u - 0.55) / 0.45, 2.2) * 400)]); }
      if (pts.length > 1) { glowLine(pts, GOLD, 9); const [lx, ly] = pts[pts.length - 1]; glowDot(lx, ly, 16, '#FFFFFF'); }
      text('SNACK SAUSAGE SALES (ILLUSTRATION)', 160, 660, 'mono', 30, '#BFD3EA'); if (t > so) { rgbText('SOARED!', 540, 460, 130, t, so, { color: GOLD }); lot(t, so, 'fire', 880, 780, 120); chip('AS REPORTED BY NEWS, FEB 2010', 540, 560, t, so + 0.2, { size: 28, bg: 'rgba(255,255,255,0.9)', fg: BG }); } }; }; });

VIS[5] = S(() => { const fi = sw('first', 0.4), en = sw('england', 1.6), ni = sw('nineteen', 2.2), ai = sw('air', 3.6);
  return (K) => { ks(K, [[fi, 'whoosh', 0.8], [en, 'pop', 0.7, 700], ...drop(ni, 0.4), [ai, 'beep', 1], [ai + 0.3, 'beep', 1]]);
    return (t) => { techBg(t, '#020A05', '#06200F'); tag(t, 5, N); tsRadar(t, 540, 900, 320, { hi: t > ai ? 0 : -1 });
      if (t > ai) { const [th, rr] = TS_BLIPS[0], x = 540 + Math.cos(th) * 320 * rr, y = 900 + Math.sin(th) * 320 * rr; tsDigit('finger', x + 4, y + 14, 0.55, t, { s: 0.55 }); shock(x, y, t, ai, 120, GOLD);
        chip('TOUCH THE PLANE ON THE RADAR', 540, 590, t, ai + 0.1, { size: 32, bg: '#5CFF8A', fg: BG }); }
      if (t > fi && t < ni) { rgbText('THE FIRST ONE?', 540, 420, 100, t, fi, { color: '#5CFF8A' }); }
      if (t > en && t < ni) { framed(t, 'rre', 80, 560, 380, { backdrop: false }); realBadge(t, en, 'REAL PHOTO · OLD ROYAL RADAR ESTABLISHMENT LABS, MALVERN', 520); }
      if (t > ni) { const y = Math.round(lerp(2026, 1965, easeOut((t - ni) / 0.6))); rgbText(String(y), 540, 430, 170, t, ni, { color: '#5CFF8A' }); if (t < ai) chip('E. A. JOHNSON · MALVERN, ENGLAND', 540, 520, t, ni + 0.3, { size: 32, bg: GOLD, fg: BG }); } }; }; });

VIS[6] = S(() => { const nv = sw('never', 0.4), on = sw('only', 1.6), el = sw('electricity', 2.2), sa = sw('sausage', 4.4);
  return (K) => { ks(K, [[nv, 'swish', 0.8], ...drop(el, 0.4), [sa, 'pop', 0.9, 600]]);
    return (t) => { if (t < on) { const P = shot(t, 'smudge', { a: [0.5, 0.5, 1.15], b: [0.5, 0.5, 1.35], dur: 2 }); if (!P) noPhoto(t); g.fillStyle = 'rgba(2,6,14,0.3)'; g.fillRect(0, 0, W, H); tag(t, 6, N); realBadge(t, 0.1, 'REAL PHOTO · FINGERPRINTS ON A TOUCHSCREEN'); return; }
      techBg(t, '#03070F', '#0A1C33'); tag(t, 6, N); flash(t, on, 0.4, 0.1); const ch = t > el ? 1 : 0.4;
      tsXsec(t, { y: 980, touch: { x: 540, k: 1 } }); tsDigit('finger', 540, 972, 0, t, { charge: ch });
      if (t > el) { for (let k = 0; k < 5; k++) tsBolt(540, 960, 120 + k * 210, 1080, t, k % 2 ? CY : '#FFFFFF', k + 11, 0.9); shock(540, 980, t, el, 600, CY, 1); rgbText('ONLY YOUR', 540, 380, 100, t, el, { color: '#FFFFFF' }); rgbText('ELECTRICITY', 540, 500, 118, t, el + 0.1, { color: CY, jitter: true }); }
      if (t > sa) { tsDigit('sausage', 860, 900, 0.35, t, { s: 0.6 }); lot(t, sa, 'lol', 860, 640, 120); } }; }; });
