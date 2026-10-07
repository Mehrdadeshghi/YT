// Wiki Roulette #110 — HOW IT WORKS #2: how GPS works (and why it needs Einstein). Motion graphics (tech.js kit) + 3D globe.
// Retention: frame-1 paradox (your phone uses Einstein daily) → orbiting satellite swarm (scale wow) → signal = time stamp →
// distance from delay (formula) → trilateration (circle, two points, BOOM pin) → twist (time runs faster up there, glitching clocks) →
// stakes (10 km drift per day, map sliding away) → payoff (relativity in your pocket) → binary comment question.
const N = 7, ORB = 1.95, INC = 55 * Math.PI / 180;     // orbit radius in Earth radii (NOT to scale: real ~4.2), inclination 55°
// 6 orbital planes × 4 satellites, positions on a tilted circle
function satPos(plane, k, t) { const raan = plane * Math.PI / 3, u = k * Math.PI / 2 + plane * 0.4 + t * 0.12;
  const x0 = Math.cos(u), y0 = Math.sin(u) * Math.cos(INC), z0 = Math.sin(u) * Math.sin(INC);
  return [ORB * (x0 * Math.cos(raan) - y0 * Math.sin(raan)), ORB * (x0 * Math.sin(raan) + y0 * Math.cos(raan)), ORB * z0]; }
function orbits(t, a = 1, upto = 6) { for (let pl = 0; pl < upto; pl++) { const pts = []; for (let i = 0; i <= 90; i++) { const raan = pl * Math.PI / 3, u = i / 90 * 6.283;
      const x0 = Math.cos(u), y0 = Math.sin(u) * Math.cos(INC), z0 = Math.sin(u) * Math.sin(INC), p = [ORB * (x0 * Math.cos(raan) - y0 * Math.sin(raan)), ORB * (x0 * Math.sin(raan) + y0 * Math.cos(raan)), ORB * z0];
      const [x, y] = MAP.PV(p); pts.push([x, y, behindEarth(p)]); }
    g.save(); g.globalAlpha = 0.35 * a; g.strokeStyle = pl % 2 ? CY : GOLD; g.lineWidth = 2.5; g.setLineDash([10, 10]); g.beginPath(); let pen = false;
    pts.forEach(([x, y, hid]) => { if (hid) { pen = false; return; } pen ? g.lineTo(x, y) : g.moveTo(x, y); pen = true; }); g.stroke(); g.restore(); } }
function swarm(t, a = 1, upto = 6, hi = -1) { const out = []; for (let pl = 0; pl < upto; pl++) for (let k = 0; k < 4; k++) { const p = satPos(pl, k, t); if (behindEarth(p)) continue;
    const [x, y, , front] = MAP.PV(p); if (!front) continue; const isHi = pl * 4 + k === hi; satIcon(x, y, isHi ? 1.6 : 0.9, t + pl, '#E8EEF7', a); if (isHi) shock(x, y, t % 1 + 1, 1, 120, GOLD, 1); out.push([x, y]); } return out; }
function space(t, keys) { return earth(t, camPath(t, keys, { k: 3, d: 3 }), { drift: 0.5, coast: true }); }
// a dark city seen from above (for the trilateration)
const STREETS = (() => { const r = rng(110), s = []; for (let i = 0; i < 16; i++) s.push([r() < 0.5, 60 + r() * 960, 2 + r() * 6]); return s; })();
function city(t, glow = 1) { g.fillStyle = '#060B14'; g.fillRect(0, 0, W, H); g.save(); g.translate(0, 120);
  STREETS.forEach(([hor, p, w]) => { g.strokeStyle = `rgba(90,140,200,${0.22 * glow})`; g.lineWidth = w; g.beginPath(); hor ? (g.moveTo(0, p * 1.6), g.lineTo(W, p * 1.6 + 60)) : (g.moveTo(p, 0), g.lineTo(p - 80, 1700)); g.stroke(); });
  const r = rng(7); for (let i = 0; i < 160; i++) { g.fillStyle = `rgba(255,${180 + r() * 60},${90 + r() * 60},${0.25 + r() * 0.35})`; g.fillRect(r() * W, r() * 1700, 3, 3); } g.restore(); grid(t, 0.05, 120); }
function circ3(x, y, r, col, p, a = 1) { if (p <= 0) return; g.save(); g.globalAlpha = a; g.strokeStyle = col; g.lineWidth = 7; g.shadowColor = col; g.shadowBlur = 26; g.beginPath(); g.arc(x, y, r, -Math.PI / 2, -Math.PI / 2 + 6.283 * clamp(p)); g.stroke(); g.restore(); }
function pin(x, y, t, t0, col = RED2) { const lt = t - t0; if (lt < 0) return; const b = Math.abs(Math.sin(Math.min(lt * 9, Math.PI))) * Math.exp(-lt * 3) * 60, yy = y - (lt < 0.2 ? (1 - lt / 0.2) * 400 : b);
  shock(x, y, t, t0 + 0.2, 220, col, 0.9); g.save(); g.translate(x, yy); g.shadowColor = col; g.shadowBlur = 30; g.fillStyle = col; g.beginPath(); g.arc(0, -70, 42, Math.PI, 0); g.lineTo(0, 0); g.closePath(); g.fill(); g.shadowBlur = 0; g.fillStyle = '#FFF'; g.beginPath(); g.arc(0, -72, 16, 0, 6.283); g.fill(); g.restore(); }
function clockCard(x, y, label, us, col, t, tIn, glitch) { const lt = t - tIn; if (lt < 0) return; const s = spring(lt, 260, 16); g.save(); g.translate(x + (glitch ? Math.sin(t * 60) * glitch : 0), y); g.scale(s, s);
  g.shadowColor = col; g.shadowBlur = 30; rrect(-430, -110, 860, 220, 30); g.fillStyle = 'rgba(8,16,30,0.95)'; g.fill(); g.lineWidth = 5; g.strokeStyle = col; g.stroke(); g.shadowBlur = 0;
  text(label, -390, -50, 'mono', 30, col); const sec = Math.floor(us / 1e6), mic = Math.floor(us % 1e6);
  text(`12:00:${String(42 + sec).padStart(2, '0')}.${String(mic).padStart(6, '0')}`, 0, 62, 'mono', 76, '#FFFFFF', { align: 'center' }); g.restore(); }

// ---------- scenes ----------
VIS.open = (K) => { K(0.05, 'hit', 1.3); K(0.3, 'wrong', 1); K(sw('einstein', 1.4), 'zap', 1); K(sw('find', 3.0), 'boom', 0.9);
  return (t) => { space(t, [[0, 20, 25, 6.2, 0, 0], [2, 20, 25, 5.0, 10, 0]]); orbits(t, 1); swarm(t, 1); g.fillStyle = 'rgba(2,6,14,0.25)'; g.fillRect(0, 0, W, H);
    tag(t); hook(t, EP.hook, 400); if (EP.series) chip(EP.series, 80, 630, t, -0.3, { size: 26, align: 'left', bg: GOLD, fg: BG });
    if (t > sw('find', 3.0)) rgbText('TO FIND YOU', 540, 1120, 110, t, sw('find', 3.0)); lot(t, 0.3, 'mindblown', 900, 800, 130); }; };

VIS[0] = S(() => { const tw = sw('twenty', 0.6), ci = sw('circle', 2.0), at = sw('atomic', 3.6);
  return (K) => { ks(K, [[tw, 'whoosh', 0.8], [ci, 'zap', 0.7], [at, 'ding', 1], [at + 0.02, 'tick', 0.8]]);
    return (t) => { const c = space(t, [[0, 20, 25, 3.2, 0, 0], [0.1, 20, 25, 6.4, 18, 30]]); orbits(t, clamp((t - ci + 0.6) / 0.8)); const pts = swarm(t, 1, Math.min(6, 1 + Math.floor(clamp((t - ci + 0.6) / 1.2) * 6)), at > 0 && t > at ? 0 : -1);
      g.fillStyle = 'rgba(2,6,14,0.15)'; g.fillRect(0, 0, W, H); tag(t, 0, N);
      if (t > tw) { const v = Math.round(20000 * ease(clamp((t - tw) / 0.8))); rgbText(`${v.toLocaleString('en-US')} KM UP`, 540, 560, 96, t, tw); }
      if (t > ci) chip('31 SATELLITES · 6 ORBITS (NOT TO SCALE)', 540, 640, t, ci, { size: 28, bg: CY, fg: BG });
      if (t > at && pts.length) { const [x, y] = pts[0]; g.save(); g.strokeStyle = GOLD; g.lineWidth = 4; g.beginPath(); g.moveTo(x, y); g.lineTo(540, 1080); g.stroke(); g.restore();
        clockCard(540, 1100, 'ATOMIC CLOCK ON BOARD', (t - at) * 1e6 * 0.37, GOLD, t, at); } }; }; });

VIS[1] = S(() => { const ti = sw('time', 1.6), wh = sw('where', 2.6);
  return (K) => { ks(K, [[0.3, 'tick', 0.6], [ti, 'beep', 1], [wh, 'beep', 1]]); for (let k = 0; k < 6; k++) K(0.4 + k * 0.5, 'tick', 0.4);
    return (t) => { techBg(t, '#030812', '#071A30'); tag(t, 1, N); const sx = 540, sy = 560;
      for (let k = 0; k < 7; k++) { const u = ((t * 0.9 + k / 7) % 1); g.save(); g.globalAlpha = (1 - u) * 0.9; g.strokeStyle = k % 2 ? CY : GOLD; g.lineWidth = 5; g.shadowColor = CY; g.shadowBlur = 20;
        g.beginPath(); g.arc(sx, sy, 60 + u * 900, 0.15 * Math.PI, 0.85 * Math.PI); g.stroke(); g.restore(); }
      satIcon(sx, sy, 3.2, t); const now = 12 * 3600 + 42 * 60 + (t * 1.0);
      if (t > ti) { const s2 = (42 + t).toFixed(6); rgbText(`TIME 12:00:${s2.padStart(9, '0')}`, 540, 980, 58, t, ti); }
      if (t > wh) rgbText('POS 26,560 KM · 55° ORBIT', 540, 1080, 50, t, wh, { color: CY }); }; }; });

VIS[2] = S(() => { const se = sw('seven', 0.6), ph = sw('phone', 1.6), dl = sw('delay', 2.6), di = sw('distance', 3.6);
  return (K) => { ks(K, [[0.2, 'swish', 0.8], [ph, 'ding', 0.9], [dl, 'type', 1], [di, 'stamp', 1]]);
    return (t) => { techBg(t); tag(t, 2, N); const sx = 220, sy = 500, px = 820, py = 1120, p = clamp((t - 0.2) / Math.max(0.6, ph - 0.2));
      glowLine([[sx, sy], [lerp(sx, px, p), lerp(sy, py, p)]], CY, 6); for (let k = 0; k < 5; k++) { const q = clamp(p - k * 0.05); glowDot(lerp(sx, px, q), lerp(sy, py, q), 9 - k, '#FFFFFF', 1 - k * 0.18); }
      satIcon(sx, sy, 2.2, t); phoneFrame(px, py, 0.32, () => { g.fillStyle = '#0E2440'; g.fillRect(-200, -400, 400, 800); grid(t, 0.15, 60); glowDot(0, 0, 26, '#3E8BFF'); }); if (p >= 1) shock(px, py, t, ph, 200, CY);
      const ms = Math.min(67, Math.round(67 * p)); rgbText(`${ms} MS`, 540, 820, 120, t, 0.25, { color: t > ph ? LIME : '#FFFFFF' });
      if (t > dl) { const q = spring(t - dl, 240, 18); g.save(); g.translate(540, 1500); g.scale(q, q); rrect(-460, -90, 920, 180, 30); g.fillStyle = 'rgba(8,16,30,0.95)'; g.fill(); g.lineWidth = 4; g.strokeStyle = GOLD; g.stroke();
        text('300,000 KM/S × 0.067 S', 0, -14, 'mono', 44, '#FFFFFF', { align: 'center' }); text(t > di ? '≈ 20,000 KM' : '= ?', 0, 56, 'disp', 54, GOLD, { align: 'center' }); g.restore(); } }; }; });

VIS[3] = S(() => { const one = sw('one', 0.4), two = sw('two', 1.6), thr = sw('three', 2.7), boom = sw('boom', 3.1);
  const Y = [560, 780], C1 = [180, 380, 560], C2 = [960, 420, 540], C3 = [600, 1500, 720];
  return (K) => { ks(K, [[one, 'swish', 0.9], [two, 'swish', 0.9], [thr, 'swish', 0.9], ...drop(boom, 0.4)]);
    return (t) => { city(t); tag(t, 3, N);
      circ3(C1[0], C1[1], C1[2], CY, (t - one) / 0.7); circ3(C2[0], C2[1], C2[2], GOLD, (t - two) / 0.7); circ3(C3[0], C3[1], C3[2], MG, (t - thr) / 0.5);
      [[C1, CY], [C2, GOLD], [C3, MG]].forEach(([c, col], k) => { const at = [one, two, thr][k]; if (t > at) { satIcon(c[0], c[1], 1.3, t); } });
      if (t > two + 0.5 && t < boom) { const b = Math.sin(t * 10) > 0; glowDot(560, 760, 16, b ? '#FFFFFF' : GOLD); glowDot(560, 210, 16, b ? GOLD : '#FFFFFF'); }   // the two candidate points
      if (t > boom) { pin(560, 780, t, boom); rgbText("THAT'S YOU!", 540, 1180, 100, t, boom + 0.15); }
      if (t > boom + 0.6) chip('4TH SATELLITE CORRECTS YOUR PHONE’S CLOCK', 540, 1290, t, boom + 0.6, { size: 26, bg: CY, fg: BG }); }; }; });

VIS[4] = S(() => { const cr = sw('crazy', 0.8), fa = sw('faster', 2.0), th = sw('thirty', 2.8);
  return (K) => { ks(K, [[cr, 'glitch', 1], ...drop(fa, 0.45), [th, 'zap', 0.9]]);
    return (t) => { techBg(t, '#08040F', '#1A0A2A'); tag(t, 4, N); const warp = t > fa ? clamp((t - fa) / 1.5) : 0;
      if (warp > 0) { g.save(); g.globalAlpha = 0.4 * warp; for (let k = 0; k < 40; k++) { const a = k / 40 * 6.283 + t * 0.3, r0 = 80 + ((t * 300 + k * 37) % 700); g.strokeStyle = k % 2 ? MG : CY; g.lineWidth = 3;
        g.beginPath(); g.moveTo(540 + Math.cos(a) * r0, 860 + Math.sin(a) * r0); g.lineTo(540 + Math.cos(a) * (r0 + 120), 860 + Math.sin(a) * (r0 + 120)); g.stroke(); } g.restore(); }
      const base = t * 1e6 * 0.37, extra = t > fa ? (t - fa) * 38 * 2000 : 0;
      clockCard(540, 680, 'ON EARTH', base, CY, t, 0.2); clockCard(540, 960, 'IN ORBIT', base + extra, MG, t, 0.4, t > fa ? 4 : 0);
      if (t > cr && t < fa) rgbText('THE CRAZY PART…', 540, 470, 70, t, cr, { jitter: true });
      if (t > th) { rgbText('+38 μs / DAY', 540, 1240, 110, t, th, { color: GOLD }); chip('SATELLITE CLOCKS RUN AHEAD', 540, 470, t, th, { size: 34, bg: MG, fg: '#FFF' }); } }; }; });

VIS[5] = S(() => { const ti = sw('tiny', 0.4), ei = sw('einstein', 1.2), te = sw('ten', 2.6), ev = sw('every', 3.4);
  return (K) => { ks(K, [[ti, 'pop', 0.8, 900], [ei, 'whoosh', 0.7], ...drop(te, 0.45), [ev, 'wrong', 1]]); for (let k = 0; k < 3; k++) K(ev + 0.2 + k * 0.35, 'beep', 0.9);
    return (t) => { city(t, 0.8); tag(t, 5, N); const drift = t > te ? (t - te) * 160 : 0, day = t > ev ? Math.min(3, 1 + Math.floor((t - ev) / 0.35)) : 1;
      glowDot(540, 900, 14, '#FFFFFF'); text('REAL POSITION', 540, 960, 'mono', 26, '#9FB3CF', { align: 'center' });
      if (t > te) { const ex = 540 + Math.min(420, drift * day * 0.5), ey = 900 - Math.min(300, drift * 0.3); glowLine([[540, 900], [ex, ey]], RED2, 4, 0.8); pin(ex, ey, t, te, RED2);
        g.save(); g.globalAlpha = 0.25; g.strokeStyle = RED2; g.lineWidth = 3; g.setLineDash([12, 10]); g.beginPath(); g.arc(540, 900, Math.hypot(ex - 540, ey - 900), 0, 6.283); g.stroke(); g.restore();
        if (Math.floor(t * 4) % 2) { g.fillStyle = 'rgba(255,40,60,0.12)'; g.fillRect(0, 0, W, H); } }
      if (t > ti && t < te) rgbText('ONLY 0.000038 S…', 540, 560, 76, t, ti);
      if (t > ei && t < te) chip('WITHOUT EINSTEIN’S CORRECTION', 540, 650, t, ei, { size: 34, bg: GOLD, fg: BG });
      if (t > te) rgbText(`${10 * day} KM OFF`, 540, 560, 120, t, te, { color: RED2 }); if (t > ev) chip(`DAY ${day}`, 540, 660, t, ev, { size: 40, bg: RED2, fg: '#FFF' }); }; }; });

VIS[6] = S(() => { const op = sw('open', 1.0), rel = sw('relativity', 2.0);
  return (K) => { ks(K, [[op, 'pop', 0.8, 700], [rel, 'boom', 1], [rel + 0.02, 'ding', 1]]);
    return (t) => { techBg(t); tag(t, 6, N);
      phoneFrame(540, 860, 1.0, () => { city(t, 1.2); const p = 1 + 0.15 * Math.sin(t * 4); g.save(); g.translate(0, 0); g.fillStyle = 'rgba(62,139,255,0.25)'; g.beginPath(); g.arc(0, 0, 70 * p, 0, 6.283); g.fill(); g.restore(); glowDot(0, 0, 22, '#3E8BFF');
        rrect(-170, -350, 340, 70, 20); g.fillStyle = 'rgba(255,255,255,0.92)'; g.fill(); text('Search here', -140, -305, 'ui', 28, '#5B6577'); });
      if (t > rel) { rgbText('E I N S T E I N', 540, 420, 64, t, rel, { color: GOLD }); chip('INSIDE YOUR POCKET', 540, 1330, t, rel + 0.2, { size: 40, bg: LIME, fg: BG }); lot(t, rel, 'mindblown', 900, 1150, 130); } }; }; });
