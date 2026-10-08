// Body Facts #7 (#125) — stop cleaning your ears with cotton swabs. Motion graphics (tech.js + med.js).
const N = 6;
function candle(x, y, s, t, lit) { g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = '#F2E2B0'; g.beginPath(); g.moveTo(-40, 0); g.lineTo(-20, -420); g.lineTo(20, -420); g.lineTo(40, 0); g.closePath(); g.fill();
  g.strokeStyle = 'rgba(0,0,0,0.12)'; g.lineWidth = 4; for (let k = 1; k < 7; k++) { g.beginPath(); g.moveTo(-40 + k * 3, -k * 60); g.lineTo(40 - k * 3, -k * 60 + 30); g.stroke(); }
  if (lit) { const f = 1 + 0.12 * Math.sin(t * 23) + 0.08 * Math.sin(t * 37); g.shadowColor = '#FF9A2E'; g.shadowBlur = 50; g.fillStyle = '#FFB23E'; g.beginPath(); g.ellipse(0, -480, 36 * f, 70 * f, 0, 0, 6.283); g.fill(); g.fillStyle = '#FFF1B0'; g.beginPath(); g.ellipse(0, -470, 16, 34 * f, 0, 0, 6.283); g.fill(); }
  g.restore(); }
function outerEar(x, y, s, col = SKIN) { g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = col; g.strokeStyle = '#B97E5E'; g.lineWidth = 10;
  g.beginPath(); g.moveTo(-40, 220); g.bezierCurveTo(-180, 160, -200, -260, 40, -260); g.bezierCurveTo(220, -260, 230, -40, 120, 40); g.bezierCurveTo(60, 90, 80, 200, -40, 220); g.closePath(); g.fill(); g.stroke();
  g.strokeStyle = '#C98E6E'; g.lineWidth = 14; g.beginPath(); g.moveTo(-60, 120); g.bezierCurveTo(-120, -40, -60, -190, 40, -190); g.bezierCurveTo(140, -190, 150, -60, 80, -10); g.stroke();
  g.fillStyle = '#5A3424'; g.beginPath(); g.ellipse(10, 40, 30, 40, 0, 0, 6.283); g.fill(); g.restore(); }

VIS.open = (K) => { const sw2 = sw('swabs', 2.0); K(0.05, 'hit', 1.1); ks(K, [[sw2, 'stamp', 1]]);
  return (t) => { bodyBg(t, '#120A06', '#2E1A0C'); const P = framed(t, 'swab', 290, 660, 500, { b: [0.5, 0.5, 1.05] }); if (!P) noPhoto(t);
    if (t > sw2) stampText('STOP', 540, 1060, t, sw2, { size: 110, color: RED2 });
    tag(t); hook(t, EP.hook, 400); if (EP.series) chip(EP.series, 80, 300, t, -0.3, { size: 26, align: 'left', bg: MRED, fg: '#FFF' }); }; };

VIS[0] = S(() => { const di = sw('dirt', 0.8), cl = sw('cleans', 1.6), pr = sw('protects', 2.1), oi = sw('oils', 2.7), tr = sw('traps', 4.0);
  return (K) => { ks(K, [[di, 'wrong', 0.8], [cl, 'pop', 0.8, 500], [pr, 'pop', 0.8, 650], [oi, 'pop', 0.8, 800], [tr, 'ding', 0.9]]);
    return (t) => { bodyBg(t, '#120A06', '#2E1A0C'); tag(t, 0, N); earSection(560, 900, 1.0, t, { wax: 1 });
      if (t > tr) { const r = rng(4); for (let k = 0; k < 12; k++) { const p = mE((t - tr - k * 0.05) / 0.8), sx = -60, sy = 700 + r() * 400, ex = 180 + r() * 300, ey = 870 + r() * 60; if (p > 0) glowDot(sx + (ex - sx) * p, sy + (ey - sy) * p, 6, '#DDDDDD'); } chip('TRAPS DUST', 540, 1180, t, tr, { size: 34, bg: GOLD, fg: BG }); }
      [['CLEANS', cl, 220], ['PROTECTS', pr, 540], ['OILS', oi, 860]].forEach(([s, at, x]) => { if (t > at) chip('✓ ' + s, x, 640, t, at, { size: 32, bg: LIME, fg: BG }); });
      rgbText("EARWAX ISN'T DIRT", 540, 470, 100, t, 0.1, { color: '#E2A33D' }); }; }; });

VIS[1] = S(() => { const cl = sw('clean', 0.8), ch = sw('chew', 1.8), ou = sw('outward', 3.6);
  return (K) => { ks(K, [[cl, 'ding', 0.9], [ch, 'pop', 0.8, 400], [ch + 0.4, 'pop', 0.8, 400], [ou, 'whoosh', 0.7]]);
    return (t) => { bodyBg(t, '#120A06', '#2E1A0C'); tag(t, 1, N); earSection(560, 900, 1.0, t, { wax: 1, flow: t > ch });
      if (t > ch) { const j = Math.abs(Math.sin(t * 9)); g.save(); g.translate(540, 1180 - 14 * j); chip('😋 CHEW · 🗣 TALK', 0, 0, t, ch, { size: 34, bg: GOLD, fg: BG }); g.restore(); }
      if (t > ou) { glowLine([[700, 780], [200, 780]], LIME, 8); g.fillStyle = LIME; g.beginPath(); g.moveTo(170, 780); g.lineTo(220, 750); g.lineTo(220, 810); g.fill(); text('OUTWARD', 450, 760, 'disp', 40, LIME, { align: 'center' }); }
      rgbText('SELF-CLEANING EARS', 540, 470, 104, t, cl, { color: LIME }); if (t > ch) chip('YOUR JAW = A SLOW CONVEYOR BELT', 540, 560, t, ch, { size: 28, bg: '#FFFFFF', fg: BG }); }; }; });

VIS[2] = S(() => { const pu = sw('pushes', 1.0), de = sw('deeper', 1.9), ea = sw('eardrum', 3.4);
  return (K) => { ks(K, [[pu, 'whoosh', 0.6], [de, 'thump', 0.8], [ea, 'wrong', 1]]);
    return (t) => { bodyBg(t, '#1A0610', '#3A0D1E'); tag(t, 2, N); const p = t > pu ? clamp((t - pu) / 1.6) : 0.05 * Math.min(1, t); earSection(560, 900, 1.0, t, { wax: 1, swab: Math.max(0.05, p), drum: t > ea && Math.floor(t * 6) % 2 });
      if (t > ea) shock(880, 900, t, ea, 200, RED2);
      rgbText(t > ea ? 'IT CAN HURT YOUR EARDRUM' : 'PUSHES WAX DEEPER', 540, 470, 96, t, t > ea ? ea : pu, { color: t > ea ? RED2 : GOLD }); }; }; });

VIS[3] = S(() => { const ca = sw('candles', 0.4), ev = sw('evidence', 2.0), in2 = sw('injure', 3.4);
  return (K) => { ks(K, [[ca, 'whoosh', 0.7], [ev, 'stamp', 1], [in2, 'wrong', 0.9]]);
    return (t) => { bodyBg(t, '#120A06', '#2E1A0C'); tag(t, 3, N); candle(540, 1160, 0.9, t, true); text('EAR CANDLE', 540, 1200, 'mono', 28, '#FFFFFF', { align: 'center' });
      if (t > ev) stampText('NO EVIDENCE', 540, 820, t, ev, { size: 84, color: RED2 });
      if (t > in2) chip('⚠ BURNS · BLOCKAGES · EARDRUM INJURY', 540, 560, t, in2, { size: 28, bg: RED2, fg: '#FFF' });
      rgbText('EAR CANDLES?', 540, 470, 120, t, ca, { color: '#FFB23E' }); }; }; });

VIS[4] = S(() => { const ou = sw('outer', 0.6), wa = sw('washcloth', 1.8);
  return (K) => { ks(K, [[ou, 'pop', 0.8, 600], [wa, 'ding', 1]]);
    return (t) => { bodyBg(t, '#06140E', '#0E3A24'); tag(t, 4, N); outerEar(540, 900, 1.3);
      if (t > ou) { g.save(); g.strokeStyle = LIME; g.lineWidth = 8; g.setLineDash([16, 12]); g.lineDashOffset = -t * 40; g.beginPath(); g.ellipse(560, 870, 330, 400, 0, 0, 6.283); g.stroke(); g.restore(); }
      if (t > wa) { const a = t * 3, x = 540 + Math.cos(a) * 160, y = 780 + Math.sin(a) * 120; g.save(); g.translate(x, y); g.rotate(Math.sin(a) * 0.3); g.fillStyle = '#7FD3FF'; rrect(-110, -70, 220, 140, 20); g.fill();
        g.strokeStyle = 'rgba(255,255,255,0.5)'; g.lineWidth = 4; for (let k = -90; k < 110; k += 25) { g.beginPath(); g.moveTo(k, -70); g.lineTo(k, 70); g.stroke(); } g.restore(); chip('✓ OUTER EAR ONLY', 540, 1180, t, wa, { size: 38, bg: LIME, fg: BG }); }
      rgbText('JUST A WASHCLOTH', 540, 470, 110, t, 0.1, { color: LIME }); }; }; });

VIS[5] = S(() => { const he = sw('hearing', 0.3), pa = sw('pain', 1.0), bl = sw('blocked', 1.6), dc = sw('doctor', 2.6);
  return (K) => { ks(K, [[he, 'pop', 0.8, 500], [pa, 'pop', 0.8, 650], [bl, 'pop', 0.8, 800], [dc, 'ding', 1]]);
    return (t) => { if (t > dc) { const P = shot(t, 'otoscope', { a: [0.55, 0.5, 1.1], b: [0.55, 0.5, 1.25], dur: 3, t0: dc }); if (!P) noPhoto(t); tag(t, 5, N); realBadge(t, dc, 'REAL PHOTO · EAR EXAM WITH AN OTOSCOPE'); rgbText('SEE A DOCTOR', 540, 560, 120, t, dc, { color: LIME }); medNote(t, dc + 0.3, 650); return; }
      bodyBg(t, '#1A0610', '#3A0D1E'); tag(t, 5, N); outerEar(540, 950, 0.9); rgbText('WATCH FOR THIS', 540, 470, 110, t, 0.1, { color: '#FFFFFF' });
      [['HEARING WORSE', he, 640], ['EAR PAIN', pa, 1180], ['BLOCKED FEELING', bl, 1260]].forEach(([s, at, y], k) => { if (t > at) chip(s, k === 0 ? 540 : k === 1 ? 300 : 760, k ? 1190 : 620, t, at, { size: 36, bg: RED2, fg: '#FFF' }); }); }; }; });
