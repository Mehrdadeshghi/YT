// Wiki Roulette #118 — HOW IT WORKS #10: wireless charging (current through a magnetic field). Motion graphics (tech.js kit).
// Retention: frame-1 magic (phone charges with no cable) → X-ray: two copper coils (+ real teardown photo) → field flipping 100,000+×/s →
// induced current fills the battery, no contact → misaligned = weak, magnets snap it in → twist: heat (real thermal photo) → value tips → CTA.
const N = 6;
const wE = (x) => 1 - Math.pow(1 - clamp(x), 3);
function spiral(x, y, R, turns, col, a = 1, sq = 0.35) { g.save(); g.globalAlpha *= a; g.strokeStyle = col; g.lineWidth = 6; g.shadowColor = col; g.shadowBlur = 14; g.beginPath();
  for (let i = 0; i <= turns * 60; i++) { const u = i / 60, r = R * (0.3 + 0.7 * u / turns), an = u * 6.283; const px = x + Math.cos(an) * r, py = y + Math.sin(an) * r * sq; i ? g.lineTo(px, py) : g.moveTo(px, py); } g.stroke(); g.restore(); }
function pad(x, y, t, o = {}) { g.save(); g.translate(x, y); g.shadowColor = 'rgba(0,0,0,0.7)'; g.shadowBlur = 50; g.fillStyle = '#20242C'; g.beginPath(); g.ellipse(0, 30, 300, 100, 0, 0, 6.283); g.fill(); g.fillStyle = '#2E333D'; g.beginPath(); g.ellipse(0, 0, 300, 100, 0, 0, 6.283); g.fill(); g.shadowBlur = 0;
  if (o.xray) { g.fillStyle = `rgba(5,10,20,${0.8 * o.xray})`; g.beginPath(); g.ellipse(0, 0, 290, 92, 0, 0, 6.283); g.fill(); spiral(0, 0, 230, 7, '#E8A33D', o.xray, 0.36); }
  if (o.magnets) for (let k = 0; k < 16; k++) { const a = k / 16 * 6.283; glowDot(Math.cos(a) * 170, Math.sin(a) * 60, 9, k % 2 ? RED2 : '#3E7BFF', o.magnets); }
  glowDot(260, 40, 7, o.on ? LIME : '#3A4252', 1); g.restore(); }
// phone seen at an angle, floating above the pad (screen up)
function flatPhone(x, y, t, o = {}) { g.save(); g.translate(x, y); g.shadowColor = 'rgba(0,0,0,0.6)'; g.shadowBlur = 40; g.fillStyle = '#0D0F14'; g.beginPath(); g.ellipse(0, 0, 230, 80, 0, 0, 6.283); g.fill(); g.shadowBlur = 0;
  rrect(-200, -70, 400, 140, 60); g.fillStyle = o.xray ? 'rgba(10,20,40,0.85)' : '#141A26'; g.fill(); g.lineWidth = 4; g.strokeStyle = '#3A4252'; g.stroke(); if (o.xray) spiral(0, 0, 150, 6, '#E8A33D', o.xray, 0.42); else { rrect(-180, -56, 360, 112, 50); const sg = g.createLinearGradient(-180, 0, 180, 0); sg.addColorStop(0, '#1B3F7A'); sg.addColorStop(1, '#3A1B6A'); g.fillStyle = sg; g.fill();
    g.fillStyle = LIME; g.shadowColor = LIME; g.shadowBlur = 20; g.beginPath(); g.moveTo(10, -40); g.lineTo(-30, 8); g.lineTo(-2, 8); g.lineTo(-12, 42); g.lineTo(30, -8); g.lineTo(2, -8); g.closePath(); g.fill(); g.shadowBlur = 0; }
  if (o.flow) for (let k = 0; k < 14; k++) { const u = (t * 0.6 + k / 14) % 1, an = u * 6.283 * 6, r = 150 * (0.3 + 0.7 * u); glowDot(Math.cos(an) * r, Math.sin(an) * r * 0.42, 6, CY, o.flow); }
  if (o.heat) { const gr = g.createRadialGradient(0, 0, 10, 0, 0, 240); gr.addColorStop(0, `rgba(255,240,120,${0.85 * o.heat})`); gr.addColorStop(0.4, `rgba(255,120,30,${0.7 * o.heat})`); gr.addColorStop(1, `rgba(120,20,120,${0.3 * o.heat})`); g.fillStyle = gr; rrect(-200, -70, 400, 140, 60); g.fill(); }
  g.restore(); }
function battery(x, y, s, lvl, col) { g.save(); g.translate(x, y); g.scale(s, s); g.lineWidth = 8; g.strokeStyle = '#FFFFFF'; rrect(-110, -50, 210, 100, 18); g.stroke(); g.fillStyle = '#FFFFFF'; g.fillRect(104, -20, 14, 40);
  g.fillStyle = col; g.shadowColor = col; g.shadowBlur = 20; rrect(-98, -38, 186 * clamp(lvl), 76, 10); g.fill(); g.restore(); }
function fieldUp(x, y0, y1, t, a = 1, hz = 3) { const ph = Math.sin(t * hz * 6.283) > 0; for (let k = 0; k < 7; k++) { const dx = (k - 3) * 55; g.save(); g.globalAlpha = a * (1 - Math.abs(k - 3) * 0.12); g.strokeStyle = ph ? CY : MG; g.lineWidth = 4; g.shadowColor = g.strokeStyle; g.shadowBlur = 14; g.setLineDash([16, 10]); g.lineDashOffset = (ph ? -1 : 1) * t * 120;
    g.beginPath(); g.moveTo(x + dx, y0); g.bezierCurveTo(x + dx * 1.4, (y0 + y1) / 2, x + dx * 1.2, (y0 + y1) / 2, x + dx * 0.9, y1); g.stroke(); g.restore(); } }

// ---------- scenes ----------
VIS.open = (K) => { const ca = sw('cable', 0.9), ma = sw('magnetic', 2.4); K(0.05, 'hit', 1.3); ks(K, [[ca, 'wrong', 0.9], ...drop(ma, 0.4)]);
  return (t) => { techBg(t, '#04070F', '#0D1F3A'); const lift = 20 * Math.sin(t * 2.2); pad(540, 1180, t, { on: t > ma });
    if (t > ma) fieldUp(540, 1160, 980 + lift, t, 0.9, 6); flatPhone(540, 960 + lift, t, { flow: t > ma ? 1 : 0 });
    if (t > ca && t < ma) { g.save(); g.strokeStyle = '#DDE6F7'; g.lineWidth = 14; g.lineCap = 'round'; g.beginPath(); g.moveTo(140, 760); g.bezierCurveTo(260, 700, 300, 840, 400, 780); g.stroke(); g.strokeStyle = RED2; g.lineWidth = 12; g.beginPath(); g.moveTo(180, 700); g.lineTo(380, 860); g.moveTo(380, 700); g.lineTo(180, 860); g.stroke(); g.restore(); }
    if (t > ma) { battery(860, 720, 0.8, 0.2 + ((t - ma) * 0.4) % 0.8, LIME); rgbText('MAGNETISM', 540, 700, 110, t, ma, { color: CY, jitter: true }); }
    tag(t); hook(t, EP.hook, 400); if (EP.series) chip(EP.series, 80, 300, t, -0.3, { size: 26, align: 'left', bg: GOLD, fg: BG }); }; };

VIS[0] = S(() => { const ins = sw('inside', 0.2), co = sw('copper', 1.2), ph = sw('phone', 2.6);
  return (K) => { ks(K, [[ins, 'glitch', 0.8], [co, 'zap', 0.8], [ph, 'pop', 0.8, 700]]);
    return (t) => { techBg(t, '#030810', '#0A1A30'); tag(t, 0, N); const xr = clamp((t - ins) / 0.5);
      pad(540, 1120, t, { xray: xr }); if (t > ph) flatPhone(540, 860, t, { xray: clamp((t - ph) / 0.4) });
      if (t > co && t < ph + 0.3) { framed(t, 'nokia', 80, 520, 600, { b: [0.5, 0.5, 1.06], backdrop: false }); realBadge(t, co, 'REAL PHOTO · CHARGER OPENED: COPPER COILS', 490); }
      if (t > ph) { rgbText('TWO COILS', 540, 470, 130, t, ph, { color: '#E8A33D' }); chip('PAD COIL ↓   PHONE COIL ↑', 540, 570, t, ph + 0.2, { size: 30, bg: '#E8A33D', fg: BG }); } }; }; });

VIS[1] = S(() => { const ma = sw('magnetic', 1.0), fl = sw('flips', 2.0), hu = sw('hundred', 2.6);
  return (K) => { ks(K, [[ma, 'zap', 0.9], [fl, 'glitch', 0.7], ...drop(hu, 0.35)]); for (let k = 0; k < 8; k++) K(ma + 0.2 + k * 0.17, 'tick', 0.4);
    return (t) => { techBg(t, '#06040F', '#1A0B2E'); tag(t, 1, N); pad(540, 1120, t, { xray: 1 });
      if (t > ma) fieldUp(540, 1100, 700, t, clamp((t - ma) / 0.4), t > fl ? 12 : 2);
      if (t > hu) { const v = Math.round(100000 * wE((t - hu) / 0.7)); rgbText(v.toLocaleString('en-US') + '+', 540, 470, 120, t, hu, { color: CY, jitter: true }); chip('FLIPS PER SECOND', 540, 570, t, hu + 0.2, { size: 34, bg: CY, fg: BG }); }
      else if (t > ma) rgbText('MAGNETIC FIELD', 540, 470, 100, t, ma, { color: MG }); }; }; });

VIS[2] = S(() => { const re = sw('reaches', 0.5), cu = sw('current', 1.6), wi = sw('without', 3.2);
  return (K) => { ks(K, [[re, 'whoosh', 0.7], [cu, 'zap', 0.9], ...drop(wi, 0.35)]);
    return (t) => { techBg(t, '#030810', '#0A1A30'); tag(t, 2, N); pad(540, 1140, t, { xray: 0.6, on: t > cu }); fieldUp(540, 1120, 900, t, 0.8, 5);
      flatPhone(540, 880, t, { xray: 1, flow: t > cu ? clamp((t - cu) / 0.4) : 0 }); if (t > cu) battery(860, 640, 0.9, 0.15 + clamp((t - cu) / 2.5) * 0.85, LIME);
      if (t > wi) { g.save(); g.strokeStyle = GOLD; g.lineWidth = 4; g.setLineDash([10, 8]); g.beginPath(); g.moveTo(800, 950); g.lineTo(800, 1080); g.stroke(); g.restore(); text('GAP · NO CONTACT', 830, 1025, 'mono', 26, GOLD);
        rgbText('NO TOUCHING!', 540, 470, 120, t, wi, { color: LIME }); } else if (t > cu) rgbText('CURRENT!', 540, 470, 120, t, cu, { color: CY }); }; }; });

VIS[3] = S(() => { const li = sw('line', 0.6), ma = sw('magnets', 2.6), sn = sw('snap', 3.2);
  return (K) => { ks(K, [[li, 'wrong', 0.8], [ma, 'zap', 0.8], [sn, 'stamp', 1.1], [sn + 0.05, 'ding', 1]]);
    return (t) => { if (t > sn + 0.6) { const P = shot(t, 'phonechg', { a: [0.5, 0.55, 1.1], b: [0.5, 0.55, 1.25], dur: 1.5, t0: sn + 0.6 }); if (!P) noPhoto(t); tag(t, 3, N); realBadge(t, sn + 0.6, 'REAL PHOTO · PHONE ON A WIRELESS CHARGER'); return; }
      techBg(t); tag(t, 3, N); const snap = t > sn ? wE((t - sn) / 0.25) : 0, off = lerp(220, 0, snap); pad(540, 1140, t, { xray: 0.8, magnets: t > ma ? 1 : 0, on: snap > 0.9 });
      fieldUp(540, 1120, 900, t, 0.7, 4); flatPhone(540 + off, 880, t, { xray: 1, flow: snap > 0.9 ? 1 : 0.15 });
      if (snap < 0.9) { chip('MISALIGNED · WEAK', 540, 470, t, li, { size: 40, bg: RED2, fg: '#FFF' }); } else { rgbText('SNAP!', 540, 470, 150, t, sn, { color: LIME }); shock(540, 880, t, sn, 300, LIME); }
      if (t > ma && snap < 0.9) chip('MAGNET RING (Qi2 / MagSafe)', 540, 570, t, ma, { size: 30, bg: '#3E7BFF', fg: '#FFF' }); }; }; });

VIS[4] = S(() => { const he = sw('heat', 1.4), ag = sw('ages', 2.4), ba = sw('battery', 2.8);
  return (K) => { ks(K, [[0.3, 'swish', 0.7], ...drop(he, 0.35), [ba, 'wrong', 1]]);
    return (t) => { if (t > he && t < ag) { techBg(t, '#0E0604', '#2A0E06'); const P = framed(t, 'thermal', 60, 620, 960, { backdrop: false }); if (!P) noPhoto(t); tag(t, 4, N); realBadge(t, he, 'REAL THERMAL IMAGE · SAME CASE: WIRELESS RUNS WARMER THAN CABLE'); rgbText('HEAT', 540, 470, 150, t, he, { color: '#FFF07A' }); return; }
      techBg(t, '#0E0604', '#2A0E06'); tag(t, 4, N); const h = clamp((t - 0.2) / 1.0); pad(540, 1140, t, { on: true }); flatPhone(540, 900, t, { heat: h });
      g.save(); g.translate(900, 760); g.fillStyle = '#FFFFFF'; rrect(-22, -180, 44, 220, 22); g.fill(); g.beginPath(); g.arc(0, 60, 44, 0, 6.283); g.fill(); g.fillStyle = RED2; g.beginPath(); g.arc(0, 60, 32, 0, 6.283); g.fill(); g.fillRect(-12, 40 - 200 * h * 0.85, 24, 200 * h * 0.85); g.restore();
      if (t > ag) { battery(300, 700, 0.9, lerp(1, 0.78, wE((t - ag) / 1.0)), RED2); text('BATTERY HEALTH (ILLUSTRATION)', 300, 800, 'mono', 22, '#FFB0A0', { align: 'center' }); rgbText('BATTERY AGES', 540, 470, 110, t, ag, { color: RED2 }); }
      else rgbText('ENERGY → HEAT', 540, 470, 110, t, 0.3, { color: '#FFB347' }); }; }; });

VIS[5] = S(() => { const ca = sw('cases', 0.8), cd = sw('cards', 1.8), ga = sw('games', 3.2), cb = sw('cable', 5.0);
  return (K) => { ks(K, [[ca, 'pop', 0.9, 600], [cd, 'pop', 0.9, 750], [ga, 'pop', 0.9, 900], [cb, 'ding', 0.9]]);
    return (t) => { techBg(t); tag(t, 5, N); const items = [['THICK CASE OFF', ca], ['NO CARDS / METAL', cd], ['NO GAMING WHILE CHARGING', ga]];
      items.forEach(([s, at], k) => { if (t < at) return; const y = 680 + k * 170, p = wE((t - at) / 0.3); g.save(); g.globalAlpha = p; g.translate((1 - p) * 300, 0); rrect(120, y - 60, 840, 120, 26); g.fillStyle = 'rgba(8,16,30,0.92)'; g.fill(); g.lineWidth = 4; g.strokeStyle = LIME; g.stroke();
        g.strokeStyle = LIME; g.lineWidth = 12; g.lineCap = 'round'; g.beginPath(); g.moveTo(175, y); g.lineTo(200, y + 25); g.lineTo(245, y - 25); g.stroke(); text(s, 290, y + 13, 'disp', s.length > 18 ? 34 : 44, '#FFFFFF'); g.restore(); });
      rgbText('3 TIPS', 540, 470, 140, t, 0.1, { color: GOLD }); }; }; });
