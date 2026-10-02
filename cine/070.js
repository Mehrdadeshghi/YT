// Wiki Roulette #070 — "7 deep-sea creatures that look fake" (16:9 long-form special, cine.html?ep=070&wide=1)
// Every scene is a real photo (or a labelled model/illustration). Photo coords (u,v) are read off the real files.
const RW = (P, u, v, du) => Math.abs(P(u + du, v)[0] - P(u, v)[0]);
const SIDE = [1000, 130, 840, 790];                 // right-hand frame for portrait photos (text stays on the left)
const NAMES = { 7: 'PISTOL SHRIMP', 6: 'TONGUE-EATING LOUSE', 5: 'BLACK SEADEVIL', 4: 'GIANT OARFISH', 3: 'GOBLIN SHARK', 2: 'COLOSSAL SQUID', 1: 'GREENLAND SHARK' };
let RANK = 0;                                       // rank of the creature on screen (for the countdown ladder)
function ladder(t) {                                // 7 … 1 in the top-right corner, current one in gold
  if (!RANK) return; for (let k = 7; k >= 1; k--) { const x = W - 80 - (k - 1) * 58, on = k === RANK, done = k > RANK;
    g.save(); rrect(x - 24, 56, 48, 48, 12); g.fillStyle = on ? GOLD : done ? 'rgba(255,255,255,0.18)' : 'rgba(12,11,10,0.55)'; g.fill();
    text(String(k), x, 92, 'disp', 28, on ? BG : done ? '#9A948A' : TXT, { align: 'center' }); g.restore(); }
}
// generic photo scene: s = { ph, a, b, side, framed:[x,y,w], ring:[u,v,du,tIn,color], co:[[u,v,lx,ly,str,tIn],…], f:[big,small,tIn], f2:[l1,l2,small,tIn,o], badge, k:[[t,type,gain],…], x:(t,P)=>{} }
function scene(rank, s) {
  return (K) => { K(0.5, 'whoosh', 0.5); (s.k || [[1.0, 'hit', 1]]).forEach(([a, b, c, d]) => K(a, b, c, d));
    return (t) => { RANK = rank; atmosphere(t);
      const P = s.framed ? framed(t, s.ph, ...s.framed, { a: [0.5, 0.5, 1.0], b: [0.5, 0.5, 1.05], dur: 7 })
        : shot(t, s.ph, Object.assign({ a: s.a || [0.5, 0.5, 1.0], b: s.b || s.a || [0.5, 0.5, 1.08], dur: 7 }, s.side ? { box: SIDE, anchor: [SIDE[0] + SIDE[2] / 2, SIDE[1] + SIDE[3] * 0.48] } : {}, s.o || {}));
      if (!P) noPhoto(t); if (s.pre) s.pre(t, P);
      tag(t); ladder(t); if (s.badge !== false) realBadge(t, 0.3, s.badge || 'REAL PHOTO');
      if (P && s.ring) { const [u, v, du, tIn, col] = s.ring, [x, y] = P(u, v); ring(t, tIn ?? 1.0, x, y, RW(P, u, v, du), { color: col, spot: !s.side && !s.framed && !(s.o && s.o.box) }); }
      if (P && s.co) s.co.forEach(([u, v, lx, ly, str, tIn]) => callout(t, tIn ?? 1.8, P(u, v), lx, ly, str));
      if (s.f) fact(t, s.f[2] ?? 0.8, s.f[0], s.f[1], s.fo || {});
      if (s.f2) fact2(t, s.f2[3] ?? 0.8, s.f2[0], s.f2[1], s.f2[2], s.f2[4] || {});
      if (s.x) s.x(t, P); }; };
}
// title card for each rank: photo, a huge rank number and the name
function titleCard(rank, ph, a, b, latin, o = {}) {
  return (K) => { K(0.3, 'riser', 0.4, 0.5); K(0.8, 'hit', 1.3); K(0.85, 'thump', 1);
    return (t) => { RANK = rank; atmosphere(t); const P = shot(t, ph, Object.assign({ a, b, dur: 4 }, o)); if (!P) noPhoto(t);
      g.save(); g.fillStyle = 'rgba(8,8,10,0.25)'; g.fillRect(0, 0, W, H); g.restore(); tag(t); ladder(t);
      rgbPop('#' + rank, 80, 470, 300, GOLD, t, 0.8); rgbPop(NAMES[rank], 86, 600, fit(NAMES[rank], 'disp', 96, 1000), TXT, t, 1.05);
      label(latin, 92, 660, t, 1.4, { color: '#C9C1B4', size: 30 }); }; };
}
// ---------- drawn extras (16:9 versions) ----------
function lifeline(t, tIn, y) {        // 392 ± 120 years, dated 2016 → born ~1504–1744; USA founded 1776
  const lt = t - tIn; if (lt < 0) return; const X0 = 120, X1 = 880, Y0 = 1480, Y1 = 2030, X = (yr) => lerp(X0, X1, (yr - Y0) / (Y1 - Y0));
  g.save(); g.globalAlpha = clamp(lt / 0.3); panel(70, y - 110, 860, 220, 0.82);
  g.strokeStyle = 'rgba(255,255,255,0.35)'; g.lineWidth = 4; g.beginPath(); g.moveTo(X0, y); g.lineTo(X1, y); g.stroke();
  [1500, 1600, 1700, 1800, 1900, 2000].forEach((yr) => { g.fillStyle = 'rgba(255,255,255,0.5)'; g.fillRect(X(yr) - 1, y - 10, 3, 20); text(String(yr), X(yr), y + 52, 'mono', 26, '#B8B0A4', { align: 'center' }); });
  const p = easeOut((lt - 0.2) / 0.7); if (p > 0) { g.fillStyle = 'rgba(255,194,61,0.35)'; g.fillRect(X(1504), y - 20, (X(1744) - X(1504)) * p, 40); g.strokeStyle = GOLD; g.lineWidth = 3; g.strokeRect(X(1504), y - 20, (X(1744) - X(1504)) * p, 40); }
  if (lt > 0.8) text('BORN IN HERE', (X(1504) + X(1744)) / 2, y - 40, 'mono', 28, GOLD, { align: 'center', alpha: clamp((lt - 0.8) * 4) });
  if (lt > 1.2) { g.fillStyle = RED; g.fillRect(X(1776) - 3, y - 46, 6, 92); text('USA 1776', X(1776) + 12, y - 52, 'mono', 26, RED); }
  if (lt > 0.4) { g.fillStyle = TXT; g.beginPath(); g.arc(X(2016), y, 9, 0, 6.283); g.fill(); text('2016', X(2016), y - 32, 'mono', 26, TXT, { align: 'center' }); }
  g.restore();
}
function depthGauge(t, tIn, x, y0, y1) {
  const lt = t - tIn; if (lt < 0) return; const D = (m) => lerp(y0, y1, m / 2000);
  g.save(); g.globalAlpha = clamp(lt / 0.3); panel(x - 30, y0 - 60, 300, y1 - y0 + 110, 0.8);
  const gr = g.createLinearGradient(0, y0, 0, y1); gr.addColorStop(0, '#2C6E8F'); gr.addColorStop(0.15, '#0D2A3A'); gr.addColorStop(1, '#000'); g.fillStyle = gr; g.fillRect(x, y0, 40, y1 - y0);
  [0, 500, 1000, 1500, 2000].forEach((m) => { g.fillStyle = 'rgba(255,255,255,0.6)'; g.fillRect(x + 40, D(m) - 1, 16, 3); text(m.toLocaleString('en-US') + ' M', x + 66, D(m) + 10, 'mono', 26, '#C9C1B4'); });
  const p = easeOut((lt - 0.3) / 0.7); if (p > 0) { g.strokeStyle = GOLD; g.lineWidth = 6; g.strokeRect(x - 6, D(200), 52, (D(1500) - D(200)) * p); }
  if (lt > 1.0) text('IT LIVES HERE', x - 4, D(200) - 16, 'mono', 26, GOLD, { alpha: clamp((lt - 1) * 4) });
  g.restore();
}
function bars(t, rows, x, y, w) {     // rows: [label, fraction, color, tIn]
  rows.forEach(([lab, k, col, tIn], i) => { const lt = t - tIn; if (lt < 0) return; const yy = y + i * 110;
    g.fillStyle = col; rrect(x, yy, Math.max(6, w * k * easeOut(lt / 0.6)), 44, 10); g.fill(); text(lab, x, yy - 14, 'mono', 30, col); });
}
function eyeBall(x, y, r) { const gr = g.createRadialGradient(x - r * 0.3, y - r * 0.3, r * 0.1, x, y, r); gr.addColorStop(0, '#5A6B78'); gr.addColorStop(1, '#0B1014');
  g.fillStyle = gr; g.beginPath(); g.arc(x, y, r, 0, 6.283); g.fill(); g.fillStyle = '#000'; g.beginPath(); g.arc(x, y, r * 0.45, 0, 6.283); g.fill();
  g.fillStyle = 'rgba(255,255,255,0.7)'; g.beginPath(); g.arc(x - r * 0.25, y - r * 0.3, r * 0.1, 0, 6.283); g.fill(); }
function ball(x, y, r) { g.fillStyle = '#F2F0EA'; g.beginPath(); g.arc(x, y, r, 0, 6.283); g.fill(); g.fillStyle = '#16181A';
  const pent = (cx, cy, s) => { g.beginPath(); for (let k = 0; k < 5; k++) { const a = -1.571 + k * 1.2566; g.lineTo(cx + Math.cos(a) * s, cy + Math.sin(a) * s); } g.fill(); };
  pent(x, y, r * 0.28); for (let k = 0; k < 5; k++) { const a = -1.571 + k * 1.2566 + 0.63; g.save(); g.beginPath(); g.arc(x, y, r, 0, 6.283); g.clip(); pent(x + Math.cos(a) * r * 0.8, y + Math.sin(a) * r * 0.8, r * 0.26); g.restore(); } }
function jet(t, t0, x, y, dir = 1) { const lt = t - t0; if (lt < 0 || lt > 1.6) return; const r = rng(69);
  for (let i = 0; i < 24; i++) { const d = lt * (600 + r() * 900) * Math.exp(-lt * 1.2), a = (r() - 0.5) * 0.35, rad = 4 + r() * 14;
    g.globalAlpha = clamp(1 - lt / 1.6) * 0.85; g.strokeStyle = '#E8F7FF'; g.lineWidth = 3; g.beginPath(); g.arc(x + Math.cos(a) * d * dir, y + Math.sin(a) * d, rad, 0, 6.283); g.stroke(); }
  g.globalAlpha = 1; }

// ---------- cold open: 7 real photos in quick cuts under the hook ----------
const MONTAGE = [['gl_lead', [0.62, 0.5, 1.0]], ['cs_tepapa', [0.5, 0.3, 1.0]], ['gs_lead', [0.35, 0.65, 1.1]], ['of_aus', [0.45, 0.55, 1.0]], ['sd_rob', [0.45, 0.26, 1.0]], ['tl_clown', [0.41, 0.66, 1.0]], ['ps_pink', [0.2, 0.43, 1.0]]];
VIS.open = (K) => { MONTAGE.forEach((_, i) => K(i * 1.15 + 0.05, i ? 'thump' : 'hit', i ? 0.6 : 1.3)); K(8.1, 'riser', 0.4, 0.8);
  return (t) => { RANK = 0; const i = Math.min(MONTAGE.length - 1, Math.floor(t / 1.15)), [ph, a] = MONTAGE[i], lt = t - i * 1.15;
    const P = shot(lt, ph, { a, b: [a[0], a[1], a[2] * 1.12], dur: 1.15 }); if (!P) noPhoto(t); flash(lt, 0, 0.25, 0.08);
    tag(t); hook(t, EP.hook, 330, { size: 120, maxW: 900 }); label('ALL OF THEM ARE REAL.', 86, 700, t, 3.6, { color: GOLD, size: 34 }); }; };

// ---------- #7 pistol shrimp ----------
VIS.ps_t = titleCard(7, 'ps_pink', [0.22, 0.44, 1.25], [0.18, 0.43, 1.4], 'ALPHEIDAE', { box: [960, 140, 880, 760] });
VIS.ps1 = scene(7, { ph: 'ps_red', a: [0.7, 0.5, 1.0], b: [0.78, 0.55, 1.15], ring: [0.8, 0.55, 0.09, 1.0], k: [[1.4, 'crack', 1.2], [1.42, 'hit', 1.2]],
  f: ['90 KM/H', 'THE BUBBLE IT FIRES FROM ITS CLAW', 1.4], x: (t, P) => { if (P) { const [x, y] = P(0.98, 0.6); jet(t, 1.4, x, y, 1); } flash(t, 1.4, 0.45, 0.1, '#E8F7FF'); } });
VIS.ps2 = scene(7, { ph: 'ps_claw', framed: [960, 170, 880], badge: 'DIAGRAM: HOW THE CLAW SNAPS', k: [[1.0, 'crack', 1.3], [1.02, 'hit', 1.4], [1.05, 'mute', 1, 0.3]],
  f: ['218 dB', 'UNDERWATER. ENOUGH TO STUN A FISH.', 1.0], x: (t, P) => { if (P) { const [x, y] = P(0.86, 0.86); ring(t, 1.0, x, y, 60, { spot: false }); shockRing(x, y, t, 1.0, 500, '232,247,255', 3); } flash(t, 1.0, 0.4, 0.1, '#E8F7FF'); } });
VIS.ps3 = scene(7, { ph: 'ps_lead', a: [0.4, 0.7, 1.0], b: [0.3, 0.75, 1.15], k: [[1.4, 'zap', 1], [1.42, 'hit', 1.2], [3.2, 'tick', 0.8], [4.4, 'tick', 0.8]],
  f: ['A FLASH', 'OF LIGHT FROM THE COLLAPSING BUBBLE', 1.4], pre: (t, P) => { g.fillStyle = `rgba(0,0,0,${0.25 + 0.3 * clamp((t - 1) / 0.4)})`; g.fillRect(0, 0, W, H);
    if (P) { const [x, y] = P(0.22, 0.77), f = Math.exp(-Math.max(0, t - 1.4) * 2.5) * (t > 1.4); g.save(); g.globalCompositeOperation = 'lighter'; glowDot(x, y, 380 * f + 30, '200,235,255', 0.9 * f + 0.15); g.restore(); } }, x: (t) => {
    if (t > 2.8) panel(70, 470, 860, 260, 0.82); bars(t, [['SHRIMP FLASH · 5,000+ K', 5000 / 5772, '#9ED8FF', 3.2], ["SUN'S SURFACE · 5,772 K", 1, GOLD, 4.4]], 120, 560, 760); } });
VIS.ps6 = scene(7, { ph: 'ps_lead', a: [0.6, 0.6, 1.0], b: [0.62, 0.62, 1.1], k: [[1.0, 'sonar', 0.9], [2.0, 'crack', 0.4], [2.2, 'crack', 0.35], [2.4, 'crack', 0.4], [2.6, 'crack', 0.3]],
  f2: ['COLONIES', 'JAM SONAR.', 'WHEN THOUSANDS SNAP TOGETHER', 1.0], x: (t) => { for (let k = 0; k < 12; k++) shockRing(1000 + (k * 173) % 800, 200 + (k * 211) % 600, t, 1.8 + k * 0.12, 260, '120,220,255', 1);
    const sw = (t * 0.9) % 1; g.strokeStyle = `rgba(120,255,170,${0.6 * (1 - sw)})`; g.lineWidth = 4; g.beginPath(); g.arc(1300, 520, 60 + sw * 420, -2.4, -0.7); g.stroke(); } });
VIS.ps4 = scene(7, { ph: 'ps_goby', a: [0.5, 0.5, 1.0], b: [0.52, 0.5, 1.08], co: [[0.2, 0.56, 760, 820, 'GOBY · LOOKOUT', 1.6], [0.66, 0.42, 1300, 160, 'THE SHRIMP', 2.6]], k: [[1.0, 'hit', 1], [1.6, 'pop', 0.7], [2.6, 'pop', 0.7]],
  f: ['ROOMMATES.', 'ONE BURROW, TWO ANIMALS', 0.8] });
VIS.ps5 = scene(7, { ph: 'ps_pink', o: { box: [960, 140, 880, 760] }, a: [0.22, 0.44, 1.25], b: [0.17, 0.43, 1.45], ring: [0.15, 0.42, 0.08, 1.6, '#FF5A8A'], f2: ['NAMED AFTER', 'PINK FLOYD.', 'SYNALPHEUS PINKFLOYDI · 2017', 0.8, { c2: '#FF5A8A' }] });

// ---------- #6 tongue-eating louse ----------
VIS.tl_t = titleCard(6, 'tl_clown', [0.41, 0.6, 1.0], [0.41, 0.66, 1.1], 'CYMOTHOA EXIGUA', { box: SIDE, anchor: [1420, 525] });
VIS.tl1 = scene(6, { ph: 'tl_clown', side: true, a: [0.41, 0.68, 1.3], b: [0.41, 0.69, 1.8], ring: [0.41, 0.69, 0.11, 1.3], co: [[0.47, 0.75, 1300, 880, 'PARASITE', 2.4]], f: ['NOT A TONGUE.', 'IT SITS WHERE THE TONGUE WAS', 1.3] });
VIS.tl2 = scene(6, { ph: 'tl_back', a: [0.42, 0.4, 1.0], b: [0.5, 0.34, 1.1], ring: [0.5, 0.33, 0.07, 1.0], co: [[0.5, 0.42, 1350, 860, 'THE LOUSE', 2.0]], f2: ['IN THROUGH', 'THE GILLS.', 'AS A JUVENILE', 0.8] });
VIS.tl3 = scene(6, { ph: 'tl_mouth', a: [0.5, 0.5, 1.0], b: [0.51, 0.53, 1.3], ring: [0.51, 0.53, 0.1, 1.7, RED], k: [[1.7, 'crack', 0.9], [1.75, 'hit', 1.1]], f2: ['NO BLOOD.', 'NO TONGUE.', null, 0.6, { c2: RED }] });
VIS.tl4 = scene(6, { ph: 'tl_lead', a: [0.55, 0.5, 1.0], b: [0.58, 0.55, 1.25], ring: [0.58, 0.56, 0.08, 1.2], co: [[0.58, 0.64, 1350, 880, 'ITS NEW "TONGUE"', 2.2]], f2: ['IT BECOMES', 'THE TONGUE.', 'A LIVING PROSTHETIC ORGAN', 1.2] });
VIS.tl6 = scene(6, { ph: 'tl_back', a: [0.6, 0.45, 1.0], b: [0.55, 0.4, 1.12], f2: ['MALE', '→ FEMALE.', 'IF A SECOND MALE MOVES IN', 0.8], k: [[0.8, 'hit', 1], [1.6, 'pop', 0.7]] });
VIS.tl5 = scene(6, { ph: 'tl_hand', side: true, a: [0.5, 0.35, 1.0], b: [0.52, 0.28, 1.3], ring: [0.52, 0.27, 0.12, 1.0], co: [[0.6, 0.35, 1080, 860, 'FINGERTIPS FOR SCALE', 1.6]], f: ['1–3 CM', 'AND HARMLESS TO HUMANS', 1.0] });

// ---------- #5 black seadevil ----------
VIS.sd_t = titleCard(5, 'sd_rob', [0.45, 0.22, 1.35], [0.43, 0.24, 1.45], 'MELANOCETUS JOHNSONII', { box: [960, 140, 880, 760], anchor: [1400, 520] });
VIS.sd1 = scene(5, { ph: 'sd_draw', badge: 'ENGRAVING', a: [0.55, 0.45, 1.0], b: [0.6, 0.45, 1.1], k: [[1.0, 'hit', 1], [1.4, 'sonar', 0.6]],
  f: ['200–1,500 M', 'DOWN. NO SUNLIGHT REACHES IT.', 1.0], x: (t) => depthGauge(t, 1.4, 120, 520, 860) });
VIS.sd2 = scene(5, { ph: 'sd_rob', badge: 'REAL SPECIMEN', o: { box: [960, 140, 880, 760] }, a: [0.2, 0.62, 1.6], b: [0.19, 0.58, 1.9], k: [[1.0, 'hit', 1], [1.8, 'zap', 0.5]],
  f2: ['GLOWING', 'BACTERIA.', 'LIVING INSIDE ITS LURE', 0.6], x: (t, P) => { if (!P) return; const [x, y] = P(0.19, 0.545); g.save(); g.globalCompositeOperation = 'lighter';
    glowDot(x, y, 90 * (t > 1.8) * (0.8 + 0.2 * Math.sin(t * 8)), '120,220,255', 0.9); g.restore(); ring(t, 1.0, x, y, RW(P, 0.19, 0.545, 0.035), { spot: false }); callout(t, 1.8, [x, y + 30], x, 860, 'THE LURE'); } });
VIS.sd3 = (K) => { K(0.5, 'whoosh', 0.6); K(0.9, 'pop', 0.7); K(2.2, 'hit', 1.3); K(2.25, 'crack', 0.7);
  return (t) => { RANK = 5; atmosphere(t); const after = t > 2.2, P = after ? shot(t, 'sd_after', { a: [0.42, 0.55, 1.0], b: [0.45, 0.55, 1.08], dur: 3, t0: 2.2 })
      : shot(t, 'sd_before', { a: [0.55, 0.52, 1.0], b: [0.6, 0.5, 1.08], dur: 2.5 }); if (!P) noPhoto(t);
    flash(t, 2.2, 0.5, 0.12); tag(t); ladder(t); realBadge(t, 0.4, 'MUSEUM MODEL');
    chip(after ? 'AFTER A MEAL' : 'BEFORE A MEAL', 80, 560, t, after ? 2.2 : 0.9, { size: 40, align: 'left', bg: after ? RED : GOLD, fg: after ? TXT : BG });
    fact2(t, after ? 2.2 : 99, 'HEAVIER', 'THAN ITSELF.', null); }; };
VIS.sd4 = scene(5, { ph: 'sd_nhm', badge: 'MUSEUM MODEL', a: [0.5, 0.45, 1.0], b: [0.55, 0.45, 1.08], k: [[1.0, 'hit', 1], [1.5, 'tick', 0.8], [2.3, 'tick', 0.8], [3.0, 'pop', 0.7]],
  f: ['TO SCALE', null, 0.8], x: (t) => { panel(70, 420, 860, 420, 0.85); const CM = 50, X = 120;
    bars(t, [['FEMALE · 15 CM', 15.3 / 15.3 * 0.99, GOLD, 1.5], ['MALE · UNDER 3 CM', 2.8 / 15.3, RED, 2.3]], X, 520, 15.3 * CM);
    const lt = t - 3.0; if (lt > 0) { g.strokeStyle = 'rgba(255,255,255,0.75)'; g.lineWidth = 4; rrect(X, 740, Math.max(6, 14.7 * CM * easeOut(lt / 0.5)), 50, 14); g.stroke(); text('A PHONE · ≈15 CM', X, 726, 'mono', 30, '#C9C1B4'); } } });
VIS.sd5 = (K) => { K(0.5, 'riser', 0.5, 1); K(1.2, 'hit', 1.2); K(1.25, 'splash', 0.8);
  return (t) => { RANK = 5; const sky = g.createLinearGradient(0, 0, 0, H); sky.addColorStop(0, '#0B3A57'); sky.addColorStop(0.5, '#0E5F86'); sky.addColorStop(1, '#06202F'); g.fillStyle = sky; g.fillRect(0, 0, W, H);
    g.save(); g.globalCompositeOperation = 'lighter'; for (let k = 0; k < 10; k++) { const x = 100 + k * 190 + Math.sin(t * 0.8 + k) * 40, gr = g.createLinearGradient(x, 0, x + 120, H); gr.addColorStop(0, 'rgba(255,240,200,0.2)'); gr.addColorStop(1, 'rgba(255,240,200,0)');
      g.fillStyle = gr; g.beginPath(); g.moveTo(x - 30, 0); g.lineTo(x + 30, 0); g.lineTo(x + 200, H); g.lineTo(x + 60, H); g.fill(); } g.restore();
    const P = shot(t, 'sd_rob', { box: [1000, 200, 820, 600], a: [0.45, 0.26, 1.2], b: [0.45, 0.26, 1.28], dur: 8, backdrop: false });
    tag(t); ladder(t); fact2(t, 1.2, 'FEB 5, 2025:', 'DAYLIGHT.', 'FILMED ALIVE AT THE SURFACE · TENERIFE'); if (P) chip('SAME SPECIES · NOT THE 2025 FISH', 1410, 850, t, 2.0, { size: 24, bg: 'rgba(12,11,10,0.8)', fg: TXT }); }; };

// ---------- #4 giant oarfish ----------
VIS.of_t = titleCard(4, 'of_aus', [0.5, 0.5, 1.0], [0.42, 0.6, 1.1], 'REGALECUS GLESNE');
VIS.of1 = scene(4, { ph: 'of_men', framed: [80, 400, 1760], badge: 'REAL PHOTO', k: [[1.0, 'hit', 1.1]], f: ['7–8 METRES', 'THE LONGEST BONY FISH ALIVE', 0.6], fo: { y: 300, size: 110 } });
VIS.of5 = scene(4, { ph: 'of_wien', framed: [210, 470, 1500], badge: 'REAL SPECIMEN · VIENNA', k: [[1.0, 'hit', 1], [1.8, 'pop', 0.7]], f2: ['IT SWIMS', 'UPRIGHT.', 'TAIL DOWN, RIPPLING ITS BACK FIN', 0.6, { size: 90, y: 260 }],
  co: [[0.9, 0.3, 1450, 330, 'THE LONG FIN', 1.8]] });
VIS.of2 = scene(4, { ph: 'of_aus', a: [0.5, 0.5, 1.0], b: [0.42, 0.62, 1.15], co: [[0.38, 0.72, 1250, 860, 'WASHED UP · AUSTRALIA', 1.8]], f2: ['ALMOST', 'NEVER SEEN.', 'HEALTHY ONES, IN THE WILD', 0.8] });
VIS.of3 = scene(4, { ph: 'of_bermuda', framed: [940, 180, 900], badge: "HARPER'S WEEKLY · 1860", k: [[1.0, 'hit', 1], [2.0, 'pop', 0.7]], f2: ['BERMUDA,', '1860.', '16 FEET. CALLED A SEA SERPENT.', 0.8],
  co: [[0.92, 0.78, 1500, 860, 'HEAD', 2.0]] });
VIS.of4 = scene(4, { ph: 'of_beach', a: [0.6, 0.55, 1.0], b: [0.65, 0.6, 1.1], k: [[1.0, 'hit', 1], [2.6, 'scratch', 0.6], [2.62, 'thump', 1]],
  f2: ['EARTHQUAKE', 'FISH?', null, 0.8], x: (t) => { if (t > 2.6) stampText('NO LINK · 2019 STUDY', 480, 640, t, 2.6, { size: 60, rot: -0.05 }); } });

// ---------- #3 goblin shark ----------
VIS.gs_t = titleCard(3, 'gs_lead', [0.4, 0.62, 1.0], [0.3, 0.66, 1.15], 'MITSUKURINA OWSTONI');
VIS.gs1 = scene(3, { ph: 'gs_lead', a: [0.5, 0.6, 1.0], b: [0.45, 0.62, 1.1], k: [[1.0, 'hit', 1.2]], f2: ['125 MILLION', 'YEARS.', 'AN ANCIENT LINEAGE · A "LIVING FOSSIL"', 0.8] });
VIS.gs5 = scene(3, { ph: 'gs_lead', o: { box: [960, 140, 880, 760] }, a: [0.22, 0.7, 1.4], b: [0.18, 0.72, 1.6], ring: [0.13, 0.74, 0.05, 1.4], co: [[0.13, 0.78, 1200, 860, 'THE "GOBLIN" NOSE', 2.2]], f2: ['TENGU', 'ZAME.', 'NAMED AFTER A LONG-NOSED JAPANESE GOBLIN', 0.8] });
VIS.gs2 = scene(3, { ph: 'gs_jaws', a: [0.6, 0.6, 1.0], b: [0.66, 0.62, 1.15], ring: [0.68, 0.64, 0.14, 1.2], co: [[0.68, 0.8, 1500, 900, 'JAWS EXTENDED', 2.0]], badge: 'REAL SPECIMEN',
  k: [[1.2, 'crack', 1], [1.22, 'hit', 1.2]], f2: ['ITS JAWS', 'SHOOT OUT.', 'UP TO 3.14 METRES PER SECOND', 0.8] });
VIS.gs3 = scene(3, { ph: 'gs_snout', side: true, a: [0.5, 0.6, 1.0], b: [0.5, 0.7, 1.15], badge: 'REAL PHOTO · AQUARIUM', f2: ['WHY', 'PINK?', 'BLOOD VESSELS SHOW THROUGH ITS SKIN', 0.8] });
VIS.gs4 = scene(3, { ph: 'gs_size', framed: [960, 220, 880], badge: 'SIZE CHART', k: [[1.0, 'hit', 1.2], [2.0, 'pop', 0.7]], f2: ['4.7 M', '800 KG.', 'A PREGNANT FEMALE · TAIWAN, 2023', 0.8],
  x: (t) => chip('THE TAIWAN SHARK WAS EVEN BIGGER', 1400, 170, t, 2.0, { size: 26, bg: RED, fg: TXT }) });

// ---------- #2 colossal squid ----------
VIS.cs_t = titleCard(2, 'cs_tepapa', [0.5, 0.3, 1.0], [0.5, 0.3, 1.08], 'MESONYCHOTEUTHIS HAMILTONI', { box: SIDE, anchor: [1420, 480] });
VIS.cs1 = (K) => { K(0.5, 'whoosh', 0.6); K(1.0, 'hit', 1.1); K(1.8, 'pop', 0.7); K(2.6, 'pop', 0.6);
  return (t) => { RANK = 2; if (PHOTOS.cs_tepapa) g.drawImage(blurOf('cs_tepapa'), 0, 0, W, H); else noPhoto(t); tag(t); ladder(t);
    fact(t, 0.6, '27–30 CM', 'EACH EYE. THE BIGGEST OF ANY ANIMAL.'); const CM = 15, y = 680; panel(980, 160, 860, 760, 0.7); text('TO SCALE', 1010, 210, 'mono', 26, DIM, { ls: 4 });
    const s1 = spring(t - 1.0, 200, 22), s2 = spring(t - 1.8, 200, 22), s3 = spring(t - 2.6, 200, 22);
    if (s1 > 0) { g.save(); g.translate(1240, 520); g.scale(s1, s1); eyeBall(0, 0, 30 * CM / 2); g.restore(); text('COLOSSAL SQUID EYE', 1240, 800, 'mono', 26, GOLD, { align: 'center' }); }
    if (s2 > 0) { g.save(); g.translate(1640, 580); g.scale(s2, s2); ball(0, 0, 22 * CM / 2); g.restore(); text('FOOTBALL · 22 CM', 1640, 800, 'mono', 26, TXT, { align: 'center' }); }
    if (s3 > 0) { g.save(); g.translate(1640, 860); g.scale(s3, s3); eyeBall(0, 0, 2.4 * CM / 2); g.restore(); text('YOUR EYE', 1700, 870, 'mono', 24, TXT); } }; };
VIS.cs2 = scene(2, { ph: 'cs_tepapa', side: true, a: [0.5, 0.35, 1.0], b: [0.5, 0.3, 1.1], badge: 'REAL PHOTO · TE PAPA, NEW ZEALAND', f: ['495 KG', 'THE HEAVIEST EVER CAUGHT · 2007', 0.8] });
VIS.cs3 = scene(2, { ph: 'cs_club', side: true, a: [0.45, 0.5, 1.0], b: [0.42, 0.55, 1.3], ring: [0.42, 0.55, 0.14, 1.0], badge: 'REAL SPECIMEN · LONDON', k: [[1.0, 'hit', 1], [1.8, 'scratch', 0.6]], f2: ['HOOKS.', 'SOME SWIVEL.', 'ON ITS ARMS AND TENTACLES', 0.8] });
VIS.cs4 = scene(2, { ph: 'cs_beak', side: true, a: [0.35, 0.6, 1.0], b: [0.35, 0.62, 1.3], ring: [0.35, 0.62, 0.11, 1.4], badge: 'REAL SPECIMEN · LONDON', f: ['14%', 'OF BEAKS IN ANTARCTIC SPERM WHALES', 0.8],
  x: (t) => label('ITS BEAK, IN A JAR', 1010, 960 - 60, t, 2.0, { color: GOLD, size: 26 }) });
VIS.cs5 = scene(2, { ph: 'cs_human', o: { box: [960, 150, 880, 760] }, a: [0.5, 0.3, 1.0], b: [0.5, 0.3, 1.05], badge: 'ILLUSTRATION · TO SCALE', co: [[0.72, 0.24, 1100, 240, 'A HUMAN DIVER', 2.0]],
  f2: ['FIRST FILMED', 'ALIVE: 2025.', 'A 30 CM BABY · 600 M DEEP', 0.8] });

// ---------- #1 Greenland shark ----------
VIS.gl_t = titleCard(1, 'gl_lead', [0.62, 0.5, 1.0], [0.62, 0.52, 1.12], 'SOMNIOSUS MICROCEPHALUS');
VIS.gl1 = scene(1, { ph: 'gl_lead', a: [0.6, 0.5, 1.05], b: [0.58, 0.47, 1.45], k: [[0.6, 'hit', 1.1], [3.0, 'whoosh', 0.5], [4.2, 'tick', 0.9]], co: [[0.58, 0.5, 1150, 860, 'AGE READ FROM THE EYE LENS', 1.6]],
  f: ['392 YEARS', 'GIVE OR TAKE 120 · CARBON-DATED', 0.6], x: (t, P) => { if (P && t < 3.4) ring(t, 1.0, ...P(0.58, 0.47), RW(P, 0.58, 0.47, 0.04), { spot: false }); lifeline(t, 3.4, 640); } });
VIS.gl2 = scene(1, { ph: 'gl_deep', framed: [960, 250, 880], badge: 'REAL PHOTO · NOAA', f2: ['1 CM', 'A YEAR.', 'ADULT AT AROUND 150 YEARS OLD', 0.8] });
VIS.gl7 = scene(1, { ph: 'gl_expl', a: [0.42, 0.3, 1.0], b: [0.42, 0.26, 1.1], badge: 'REAL PHOTO · NOAA', f: ['0.34 M/S', 'ABOUT 1.2 KM/H. SLOWER THAN YOU WALK.', 0.8] });
VIS.gl3 = scene(1, { ph: 'gl_ice', a: [0.5, 0.5, 1.0], b: [0.47, 0.52, 1.1], co: [[0.45, 0.58, 1300, 860, 'THIS ONE: ABOUT 4 M', 2.0]], f: ['UP TO 6.4 M', 'AND OVER 1,000 KG', 0.8] });
VIS.gl4 = scene(1, { ph: 'gl_eye', a: [0.5, 0.42, 1.0], b: [0.55, 0.39, 1.2], ring: [0.55, 0.39, 0.05, 1.0], co: [[0.55, 0.45, 1300, 860, 'A PARASITE ON ITS EYE', 1.8]], f2: ['ALMOST', 'BLIND.', null, 0.8] });
VIS.gl5 = scene(1, { ph: 'gl_expl', framed: [960, 220, 880], badge: 'REAL PHOTO · NOAA', k: [[1.0, 'hit', 0.9], [1.6, 'pop', 0.8], [2.1, 'pop', 0.8], [2.6, 'hit', 1.1]],
  f: ['IN ITS STOMACH:', null, 0.6], x: (t) => { chip('REINDEER', 80, 470, t, 1.6, { size: 44, align: 'left' }); chip('MOOSE', 80, 580, t, 2.1, { size: 44, align: 'left' }); chip('POLAR BEAR', 80, 690, t, 2.6, { size: 44, align: 'left', bg: RED, fg: TXT }); } });
VIS.gl6 = scene(1, { ph: 'gl_hakarl', a: [0.5, 0.45, 1.0], b: [0.55, 0.45, 1.1], badge: 'REAL PHOTO · ICELAND', f2: ['TOXIC MEAT.', 'HÁKARL.', 'FERMENTED, THEN HUNG TO DRY', 0.8] });

// ---------- ending: all seven, comment the number ----------
const GRID = [[7, 'ps_pink', [0.2, 0.43, 1.0]], [6, 'tl_clown', [0.41, 0.66, 1.0]], [5, 'sd_rob', [0.45, 0.26, 1.0]], [4, 'of_aus', [0.42, 0.6, 1.0]], [3, 'gs_lead', [0.3, 0.66, 1.2]], [2, 'cs_tepapa', [0.5, 0.3, 1.0]], [1, 'gl_lead', [0.62, 0.5, 1.0]]];
VIS.end = (K) => { GRID.forEach((_, i) => K(0.6 + i * 0.18, 'pop', 0.5));
  return (t) => { RANK = 0; atmosphere(t); tag(t); text('WHICH ONE IS THE CREEPIEST?', 80, 190, 'disp', 64, TXT, { shadow: true });
    GRID.forEach(([n, ph, a], i) => { const s = spring(t - 0.6 - i * 0.18, 220, 20); if (s <= 0) return; const x = 80 + i * 254, y = 250, w = 236, h = 380;
      g.save(); g.translate(x + w / 2, y + h / 2); g.scale(s, s); g.translate(-x - w / 2, -y - h / 2);
      if (!shot(t, ph, { box: [x, y, w, h], a, b: a, backdrop: false, r: 22, credit: '' })) { panel(x, y, w, h); }
      rrect(x + 14, y + 14, 70, 56, 14); g.fillStyle = GOLD; g.fill(); text('#' + n, x + 49, y + 55, 'disp', 34, BG, { align: 'center' });
      text(NAMES[n], x + w / 2, y + h + 40, 'mono', 20, '#C9C1B4', { align: 'center' }); g.restore(); }); }; };

// ---------- thumbnail (cine.html?ep=070&wide=1&thumb=1, frame at t = 3) ----------
VIS.thumb = () => (t) => { g.fillStyle = BG; g.fillRect(0, 0, W, H);
  const P3 = [['gs_jaws', [0.66, 0.6, 1.25]], ['tl_clown', [0.41, 0.66, 1.45]], ['gl_lead', [0.6, 0.5, 1.5]]];
  P3.forEach(([ph, a], i) => { const x = i * 640; shot(9, ph, { box: [x + 6, 0, 628, 760], a, b: a, backdrop: false, r: 0, credit: '' }); });
  const gr = g.createLinearGradient(0, 560, 0, H); gr.addColorStop(0, 'rgba(12,11,10,0)'); gr.addColorStop(0.35, 'rgba(12,11,10,0.95)'); gr.addColorStop(1, BG); g.fillStyle = gr; g.fillRect(0, 560, W, H - 560);
  text('THESE ARE', 70, 900, 'disp', 150, TXT, { shadow: true }); text('REAL.', 1060, 900, 'disp', 150, GOLD, { shadow: true });
  text('7 DEEP-SEA CREATURES', 76, 1010, 'mono', 54, '#D9D2C6', { ls: 6 });
  rrect(1560, 40, 320, 110, 24); g.fillStyle = RED; g.fill(); text('#1: 392 YRS', 1720, 112, 'disp', 50, TXT, { align: 'center' });
  g.drawImage(VIG, 0, 0); };
