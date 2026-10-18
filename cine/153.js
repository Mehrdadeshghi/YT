// Wiki Roulette #153 — HOW IT WORKS #11: how a guided missile finds its target. Real U.S. Navy / DoD test media (vscene kit) + drawn overlays.
// Retention: frame-1 paradox (no pilot, no eyes, on target) → INS (feels every push) → twist: drift (error circle grows) →
// GPS fix, but weak and jammable (static) → plan B: terrain matching (radar profile slides onto the stored map) →
// camera vs satellite photo (scan + lock) → honest payoff: it does miss, CEP target with exactly half the hits inside → binary question.
const N153 = 6, C153G = '#3EE6FF', C153R = '#FF3B30', C153OK = '#7FE3A0';

// scene 1: planned track (dashed) vs the drifting INS track, error circle grows with time
function driftOverlay(t, t0) { const p = clamp((t - 0.3) / 2.6), x0 = 140, y0 = 1380, x1 = 820, y1 = 1020;
  g.save(); g.setLineDash([16, 14]); g.strokeStyle = 'rgba(255,255,255,0.75)'; g.lineWidth = 5; g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.stroke(); g.restore();
  const pts = []; for (let j = 0; j <= 40; j++) { const u = j / 40 * p; pts.push([lerp(x0, x1, u) + 110 * u * u, lerp(y0, y1, u) + 90 * u * u]); }
  glowLine(pts, C153R, 6); const [hx, hy] = pts.at(-1); glowDot(hx, hy, 12, C153R);
  const tx = lerp(x0, x1, p), ty = lerp(y0, y1, p), r = 20 + 110 * p * p; g.save(); g.strokeStyle = C153R; g.lineWidth = 4; g.globalAlpha = 0.8; g.beginPath(); g.arc(tx, ty, r, 0, 6.283); g.stroke(); g.restore();
  glowDot(tx, ty, 8, '#FFFFFF'); if (t > t0) chip(`±${Math.round(164 * ease(clamp((t - t0) / 0.8)))} FT`, tx, ty + r + 50, t, t0, { size: 34, bg: C153R, fg: '#FFF' }); }

// scene 2: GPS satellite above, rings that fade on the way down (weak signal), then jamming static
function gpsOverlay(t, jam) { const sx = 840, sy = 760, rx = 300, ry = 1300;
  for (let k = 0; k < 6; k++) { const u = (t * 0.7 + k / 6) % 1, x = lerp(sx, rx, u), y = lerp(sy, ry, u);
    g.save(); g.globalAlpha = (1 - u) * (1 - u) * 0.95; g.strokeStyle = C153G; g.lineWidth = 6; g.shadowColor = C153G; g.shadowBlur = 18; g.beginPath(); g.arc(x, y, 40 + 30 * u, 0, 6.283); g.stroke(); g.restore(); }
  satIcon(sx, sy, 1.8, t); glowDot(rx, ry, 14, '#FFFFFF');
  if (t > jam) { const r = rng(Math.floor(t * 24)); g.save(); g.globalAlpha = 0.55 * clamp((t - jam) / 0.2); for (let i = 0; i < 260; i++) { g.fillStyle = r() < 0.5 ? '#FFFFFF' : C153R; g.fillRect(rx - 260 + r() * 520, ry - 260 + r() * 400, 4 + r() * 18, 3); } g.restore();
    stampText('JAMMED', 540, 1220, t, jam, { size: 110, rot: -0.06, color: C153R }); } }

// scene 3: TERCOM — the stored map strip (gold) and the radar-measured strip (cyan) slide together until they match
const HILLS153 = (() => { const r = rng(153), h = []; let v = 0; for (let i = 0; i < 120; i++) { v = clamp(v + (r() - 0.5) * 0.5, -1, 1); h.push(v); } return h; })();
function tercomOverlay(t, tm) { const x0 = 80, w = 920, base = 1300, amp = 70, off = 30 * (1 - ease(clamp((t - tm + 0.6) / 1.2))), lag = Math.round(off);
  panel(40, 1120, 1000, 330, 0.8); text('STORED MAP', 80, 1165, 'mono', 24, GOLD, { ls: 3 }); text('RADAR ALTIMETER', 1000, 1165, 'mono', 24, C153G, { ls: 3, align: 'right' });
  const line = (shift, col, dy) => glowLine(HILLS153.slice(30, 110).map((v, i) => [x0 + i * w / 79, base + dy - amp * (HILLS153[30 + i + shift] ?? v)]), col, 5);
  line(0, GOLD, 0); line(lag, C153G, 8 * (lag > 0)); if (t > tm) chip('MATCH ✓', 540, 1420, t, tm, { size: 32, bg: C153OK, fg: BG }); }

// scene 4: DSMAC — a scan grid over the ground, then a lock box
function sceneMatch(t, tl) { const p = clamp((t - 0.2) / 1.6), y = lerp(620, 1380, p);
  g.save(); g.strokeStyle = 'rgba(62,230,255,0.35)'; g.lineWidth = 2; for (let x = 80; x <= 1000; x += 92) { g.beginPath(); g.moveTo(x, 620); g.lineTo(x, 1380); g.stroke(); }
  for (let yy = 620; yy <= 1380; yy += 76) { g.beginPath(); g.moveTo(80, yy); g.lineTo(1000, yy); g.stroke(); } g.restore();
  if (p < 1) glowLine([[60, y], [1020, y]], C153G, 5);
  if (t > tl) { const s = 1 + 0.6 * (1 - ease(clamp((t - tl) / 0.4))), cx = 540, cy = 1000, hw = 220 * s, hh = 160 * s; g.save(); g.strokeStyle = C153OK; g.lineWidth = 8; g.shadowColor = C153OK; g.shadowBlur = 20;
    for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) { g.beginPath(); g.moveTo(cx + sx * hw, cy + sy * (hh - 50)); g.lineTo(cx + sx * hw, cy + sy * hh); g.lineTo(cx + sx * (hw - 50), cy + sy * hh); g.stroke(); } g.restore();
    chip('SCENE MATCH ✓', 540, cy + hh + 50, t, tl + 0.2, { size: 32, bg: C153OK, fg: BG }); } }

// scene 5: CEP — a target with 20 hits, exactly 10 inside the 33-ft circle (illustration of the definition, not real impact data)
const HITS153 = (() => { const r = rng(33), out = []; for (let i = 0; i < 20; i++) { const a = r() * 6.283, d = i % 2 ? 0.25 + r() * 0.7 : 1.08 + r() * 0.9; out.push([Math.cos(a) * d, Math.sin(a) * d]); } return out; })();
function cepOverlay(t, tc) { const cx = 540, cy = 1010, R = 160; panel(90, 720, 900, 640, 0.82);
  for (let k = 3; k >= 1; k--) { g.save(); g.strokeStyle = 'rgba(255,255,255,0.18)'; g.lineWidth = 2; g.beginPath(); g.arc(cx, cy, R * k * 0.62, 0, 6.283); g.stroke(); g.restore(); }
  HITS153.forEach(([x, y], i) => { const ti = 0.3 + i * 0.07; if (t < ti) return; const inside = Math.hypot(x, y) <= 1; glowDot(cx + x * R, cy + y * R, 9, t > tc ? (inside ? C153OK : C153R) : '#FFFFFF'); if (t - ti < 0.3) shock(cx + x * R, cy + y * R, t, ti, 40, '#FFF', 0.3); });
  if (t > tc) { g.save(); g.strokeStyle = GOLD; g.lineWidth = 7; g.shadowColor = GOLD; g.shadowBlur = 16; g.beginPath(); g.arc(cx, cy, R, -1.57, -1.57 + 6.283 * ease(clamp((t - tc) / 0.5))); g.stroke(); g.restore();
    chip('33 FT', cx + R + 70, cy, t, tc + 0.3, { size: 34 }); chip('10 IN · 10 OUT', cx, 1310, t, tc + 0.6, { size: 30, bg: 'rgba(255,255,255,0.92)', fg: BG }); }
  text('ILLUSTRATION', 120, 760, 'mono', 20, 'rgba(255,255,255,0.55)', { ls: 3 }); }

// ---------- scenes ----------
VIS.open = vopen({ clip: 'launch', a: [0.5, 0.5, 1.0], b: [0.5, 0.5, 1.12], foot: 'REAL FOOTAGE · U.S. DOD CRUISE MISSILE TEST · 2019' });
VIS[0] = vscene(0, N153, { ph: 'ins', o: { box: [40, 720, 1000, 665] }, badge: 'REAL PHOTO · INERTIAL GUIDANCE (THOR MISSILE)',
  f2: ['GYROS +', 'ACCELEROMETERS', 'NO SIGNAL NEEDED', 0.8], k: [[0.8, 'hit', 1], [sw('signal', 3.6), 'ding', 0.8]] });
VIS[1] = S(() => { const hu = sw('hundred', 1.6); return vscene(1, N153, { ph: 'flight', o: { box: [40, 720, 1000, 750] }, badge: 'REAL PHOTO · TOMAHAWK FLIGHT TEST · 2002',
  f2: ['164 FT OFF', 'IN 17 MINUTES', 'EVEN THE BEST SENSORS DRIFT', hu], k: [[0.3, 'riser', 0.5], [hu, 'hit', 1.1]], x: (t) => driftOverlay(t, hu) }); });
VIS[2] = S(() => { const jm = sw('jammed', 3.4), mi = sw('twelve', 1.6); return vscene(2, N153, { ph: 'jdam', o: { box: [40, 720, 1000, 666] }, a: [0.5, 0.5, 1.0], b: [0.5, 0.5, 1.08], badge: 'REAL PHOTO · GPS-GUIDED BOMB TEST (U.S. NAVY)',
  f2: ['GPS SIGNAL:', '12,000+ MILES', 'ARRIVES VERY WEAK', mi], k: [[0.4, 'beep', 0.7], [mi, 'whoosh', 0.8], [jm, 'crack', 1.1], [jm + 0.02, 'hit', 1]], x: (t) => gpsOverlay(t, jm) }); });
VIS[3] = S(() => { const mt = sw('map', 3.0); return vscene(3, N153, { ph: 'tlaunch', a: [0.5, 0.35, 1.0], b: [0.5, 0.3, 1.1], badge: 'REAL PHOTO · TOMAHAWK TEST LAUNCH · 2002',
  f2: ['RADAR READS', 'THE HILLS', null, 0.6], k: [[0.6, 'hit', 1], [mt, 'ding', 1]], x: (t) => tercomOverlay(t, mt) }); });
VIS[4] = S(() => { const ph = sw('photos', 2.2); return vscene(4, N153, { ph: 'plant', a: [0.5, 0.5, 1.0], b: [0.5, 0.5, 1.12], badge: 'REAL PHOTO · TOMAHAWK FLIGHT TEST',
  f2: ['CAMERA VS.', 'SATELLITE PHOTO', null, 0.6], k: [[0.2, 'sonar', 0.7], [ph, 'ding', 1]], x: (t) => sceneMatch(t, ph) }); });
VIS[5] = S(() => { const ye = sw('yes', 1.2), th = sw('thirty', 2.0); return vscene(5, N153, { ph: 'hit', a: [0.5, 0.4, 1.0], b: [0.5, 0.4, 1.08], badge: 'REAL PHOTO · TOMAHAWK TEST HIT · 1986',
  f2: ['DOES IT', 'EVER MISS?', null, 0.4], k: [[ye, 'wrong', 1], ...drop(th)], x: (t) => cepOverlay(t, th) }); });
