// Body Facts #8 (#126) — Semmelweis: wash your hands. Motion graphics (tech.js + med.js).
const N = 6, SEPIA = '#E8D2A6';
function hands(x, y, s, t, foam = 0) { g.save(); g.translate(x, y); g.scale(s, s); const w = Math.sin(t * 10) * 12 * (foam > 0 ? 1 : 0);
  [-1, 1].forEach((k) => { g.save(); g.translate(k * (40 + w * k), 0); g.rotate(k * 0.25); g.fillStyle = SKIN; g.strokeStyle = '#B97E5E'; g.lineWidth = 5; rrect(-60, -120, 120, 220, 50); g.fill(); g.stroke();
    for (let f = 0; f < 4; f++) { rrect(-56 + f * 30, -200, 26, 100, 13); g.fill(); g.stroke(); } g.restore(); });
  if (foam > 0) { const r = rng(2); for (let k = 0; k < 26 * foam; k++) { const bx = (r() - 0.5) * 300, by = -180 + r() * 300 + Math.sin(t * 3 + k) * 10, rr = 10 + r() * 22; g.fillStyle = 'rgba(255,255,255,0.85)'; g.beginPath(); g.arc(bx, by, rr, 0, 6.283); g.fill(); g.strokeStyle = 'rgba(160,220,255,0.8)'; g.lineWidth = 2; g.stroke(); } }
  g.restore(); }
function bars(x, y, t, on) { if (on <= 0) return; g.save(); g.fillStyle = '#2A2A2E'; g.shadowColor = '#000'; g.shadowBlur = 30; const yy = y - 900 * (1 - mE(on));
  for (let k = 0; k < 7; k++) { rrect(x - 420 + k * 140, yy - 520, 36, 1040, 18); g.fill(); } g.fillRect(x - 460, yy - 540, 920, 40); g.fillRect(x - 460, yy + 500, 920, 40); g.restore(); }
function bed(x, y, s, col) { g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = col; rrect(-80, -10, 160, 40, 10); g.fill(); g.fillRect(-80, 20, 12, 40); g.fillRect(68, 20, 12, 40); g.beginPath(); g.arc(-48, -26, 20, 0, 6.283); g.fill(); rrect(-30, -40, 110, 34, 14); g.fill(); g.restore(); }

VIS.open = (K) => { const wa = sw('wash', 1.4), lo = sw('locked', 3.2); K(0.05, 'hit', 1.1); ks(K, [[wa, 'splash', 0.6], [lo, 'crack', 1]]);
  return (t) => { const P = shot(t, 'semmel', { a: [0.5, 0.35, 1.1], b: [0.5, 0.3, 1.25], dur: 4 }); if (!P) noPhoto(t); g.fillStyle = 'rgba(30,20,10,0.25)'; g.fillRect(0, 0, W, H);
    if (t > wa && t < lo) hands(540, 1080, 0.7, t, clamp((t - wa) / 0.6)); bars(540, 900, t, t > lo ? (t - lo) / 0.5 : 0); if (t > lo) shock(540, 1300, t, lo, 300, '#FFFFFF');
    tag(t); hook(t, EP.hook, 400); if (EP.series) chip(EP.series, 80, 300, t, -0.3, { size: 26, align: 'left', bg: MRED, fg: '#FFF' }); }; };

VIS[0] = S(() => { const vi = sw('vienna', 0.2), ma = sw('maternity', 1.6), dy = sw('dying', 3.0), fe = sw('fever', 4.0);
  return (K) => { ks(K, [[vi, 'stamp', 0.9], [ma, 'pop', 0.7, 500], [dy, 'thump', 0.8]]);
    return (t) => { bodyBg(t, '#140E06', '#2E2210'); tag(t, 0, N); rgbText('VIENNA · 1847', 540, 470, 120, t, vi, { color: SEPIA });
      for (let k = 0; k < 8; k++) { const x = 250 + (k % 4) * 195, y = 820 + Math.floor(k / 4) * 190, a = clamp((t - ma - k * 0.08) / 0.3), dead = t > dy && k % 8 !== 3 && k % 8 !== 6 ? clamp((t - dy - k * 0.1) / 0.4) : 0;
        if (a > 0) { g.save(); g.globalAlpha = a; bed(x, y, 1.0, dead ? `rgb(${Math.round(255 - 30 * dead)},${Math.round(255 - 200 * dead)},${Math.round(255 - 190 * dead)})` : '#E8E0D0'); g.restore(); } }
      if (t > ma) chip('MATERNITY WARD', 540, 560, t, ma, { size: 36, bg: SEPIA, fg: BG }); if (t > fe) chip('CHILDBED FEVER', 540, 1180, t, fe, { size: 40, bg: RED2, fg: '#FFF' }); }; }; });

VIS[1] = S(() => { const se = sw('semmelweis', 0.6), au = sw('autopsies', 2.8), de = sw('deliver', 3.8);
  return (K) => { ks(K, [[se, 'pop', 0.8, 600], [au, 'whoosh', 0.8], [de, 'wrong', 0.9]]);
    return (t) => { if (t < au) { bodyBg(t, '#140E06', '#2E2210'); const P = framed(t, 'semmel', 190, 620, 700, { b: [0.5, 0.4, 1.06] }); if (!P) noPhoto(t); tag(t, 1, N); realBadge(t, se, 'REAL PHOTO · IGNAZ SEMMELWEIS');
        rgbText('DR. IGNAZ SEMMELWEIS', 540, 520, 90, t, se, { color: SEPIA }); return; }
      bodyBg(t, '#1A0610', '#3A0D1E'); tag(t, 1, N); const p = clamp((t - au) / 1.4);
      [['AUTOPSY ROOM', 230, au, '#9FB3CF'], ['DELIVERY ROOM', 850, de, SEPIA]].forEach(([s, x, at, c]) => { if (t > at - 0.2) { g.save(); g.strokeStyle = c; g.lineWidth = 8; rrect(x - 170, 780, 340, 240, 30); g.stroke(); g.restore(); text(s, x, 1070, 'mono', 30, c, { align: 'center' }); } });
      hands(230 + 620 * p, 900, 0.45, t); for (let k = 0; k < 10; k++) { const a = k * 0.7 + t * 2; bacterium(230 + 620 * p + Math.cos(a) * 90, 860 + Math.sin(a) * 70, 30, a, t, LIME, 0.9); }
      if (p > 0.1) glowLine([[400, 900], [400 + 280 * p, 900]], RED2, 4, 0.6);
      rgbText(t > de ? 'STRAIGHT TO THE BABIES' : 'FROM AUTOPSIES…', 540, 470, 96, t, t > de ? de : au, { color: t > de ? RED2 : '#FFFFFF' }); }; }; });

VIS[2] = S(() => { const wa = sw('wash', 0.6), li = sw('lime', 2.0), ei = sw('eighteen', 3.4), ju = sw('july', 5.2);
  return (K) => { ks(K, [[wa, 'splash', 0.7], [li, 'bubble', 0.8], [ei, 'pop', 0.9, 500], [ju, 'ding', 1]]);
    return (t) => { bodyBg(t, '#06101E', '#102A46'); tag(t, 2, N);
      if (t < ei) { hands(540, 1000, 1.0, t, clamp((t - wa) / 0.8)); rgbText('WASH YOUR HANDS', 540, 470, 110, t, wa, { color: CY }); if (t > li) chip('WITH CHLORINATED LIME', 540, 560, t, li, { size: 34, bg: CY, fg: BG }); return; }
      const v1 = 18.3, v2 = 1.2, h1 = 24 * v1 * mE((t - ei) / 0.6), h2 = 24 * Math.max(v2, (v1 - (v1 - v2) * mE((t - ju + 0.6) / 0.8))) * (t > ju - 0.6 ? 1 : 0);
      [[300, h1, 'APRIL', RED2, '18%'], [780, h2, 'JULY', LIME, t > ju ? '~1%' : '']].forEach(([x, h, lab, c, v]) => { if (h <= 0) return; g.save(); g.fillStyle = c; g.shadowColor = c; g.shadowBlur = 30; rrect(x - 110, 1140 - h, 220, h, 16); g.fill(); g.restore();
        text(v, x, 1110 - h, 'disp', 80, c, { align: 'center' }); text(lab, x, 1190, 'mono', 32, '#FFFFFF', { align: 'center' }); });
      rgbText(t > ju ? 'DEATHS FELL ~15×' : 'DEATHS, 1847', 540, 470, 110, t, t > ju ? ju : ei, { color: t > ju ? LIME : '#FFFFFF' }); chip('SEMMELWEIS\'S OWN RECORDS', 540, 560, t, ei + 0.2, { size: 26, bg: 'rgba(255,255,255,0.85)', fg: BG }); }; }; });

VIS[3] = S(() => { const mo = sw('mocked', 0.8), ge = sw('gentleman', 1.8);
  return (K) => { ks(K, [[mo, 'scratch', 0.8], [ge, 'stamp', 0.9]]);
    return (t) => { bodyBg(t, '#140E06', '#2E2210'); const P = framed(t, 'mort', 90, 610, 900, { b: [0.5, 0.5, 1.05] }); if (!P) noPhoto(t); tag(t, 3, N); realBadge(t, 0.1, 'REAL DATA · CHILDBED FEVER DEATHS, VIENNA 1841–49');
      if (P) { const [x, y] = P(0.8, 0.55); ring(t, 0.5, x, y, 90, { color: LIME, spot: false }); }
      [['HA!', 190, 1190, mo], ['NONSENSE!', 540, 1200, mo + 0.3], ['HA HA!', 890, 1185, mo + 0.6]].forEach(([s, x, y, at]) => { if (t > at) chip(s, x, y, t, at, { size: 36, bg: '#FFFFFF', fg: BG }); });
      rgbText(t > ge ? '"A GENTLEMAN\'S HANDS, UNCLEAN?"' : 'COLLEAGUES MOCKED HIM', 540, 520, 80, t, t > ge ? ge : mo, { color: t > ge ? GOLD : '#FFFFFF' }); }; }; });

VIS[4] = S(() => { const as = sw('asylum', 0.8), si = sw('sixty', 1.6), ge = sw('germ', 2.8), ri = sw('right', 3.8);
  return (K) => { ks(K, [[as, 'thump', 0.8], [ge, 'whoosh', 0.7], [ri, 'ding', 1]]);
    return (t) => { bodyBg(t, '#0A0806', '#1E1A14'); const P = framed(t, 'book', 300, 640, 480, { b: [0.5, 0.4, 1.05] }); if (!P) noPhoto(t); tag(t, 4, N); realBadge(t, 0.1, 'REAL BOOK · HIS 1861 WORK ON CHILDBED FEVER');
      rgbText(t > ri ? 'HE WAS RIGHT' : t > ge ? 'GERM THEORY' : 'DIED 1865 · IN AN ASYLUM', 540, 520, t > ri ? 120 : 90, t, t > ri ? ri : t > ge ? ge : as, { color: t > ri ? LIME : t > ge ? CY : '#BFBFBF' });
      if (t > ri) { g.save(); g.strokeStyle = LIME; g.lineWidth = 26; g.lineCap = 'round'; g.shadowColor = LIME; g.shadowBlur = 30; const q = mE((t - ri) / 0.4); g.beginPath(); g.moveTo(400, 1150); g.lineTo(400 + 90 * Math.min(1, q * 2), 1150 + 90 * Math.min(1, q * 2)); if (q > 0.5) g.lineTo(490 + 220 * (q - 0.5) * 2, 1240 - 260 * (q - 0.5) * 2); g.stroke(); g.restore(); }
      if (t > ge && t < ri) for (let k = 0; k < 6; k++) bacterium(200 + k * 140, 1180 + Math.sin(t * 3 + k) * 20, 50, k, t, CY); }; }; });

VIS[5] = S(() => { const so = sw('soap', 0.8), tw = sw('twenty', 1.4), bi = sw('birthday', 3.6);
  return (K) => { ks(K, [[so, 'bubble', 0.8], [tw, 'pop', 0.9, 600], [bi, 'ding', 1]]);
    return (t) => { bodyBg(t, '#06101E', '#102A46'); tag(t, 5, N); hands(540, 1000, 0.8, t, clamp((t - so) / 0.6));
      if (t > tw) { const p = clamp((t - tw) / 4), sec = Math.ceil(20 * (1 - p)); g.save(); g.strokeStyle = 'rgba(255,255,255,0.18)'; g.lineWidth = 16; g.beginPath(); g.arc(540, 900, 300, 0, 6.283); g.stroke(); g.strokeStyle = CY; g.shadowColor = CY; g.shadowBlur = 20; g.beginPath(); g.arc(540, 900, 300, -Math.PI / 2, -Math.PI / 2 + 6.283 * (1 - p)); g.stroke(); g.restore();
        chip(`${sec}s`, 540, 600, t, tw, { size: 44, bg: CY, fg: BG }); }
      if (t > bi) { chip('🎂 HAPPY BIRTHDAY × 2', 540, 1200, t, bi, { size: 38, bg: GOLD, fg: BG }); for (let k = 0; k < 5; k++) { const x = 160 + k * 190, y = 760 - ((t - bi) * 120 + k * 50) % 260; text('♪', x, y, 'disp', 60, GOLD, { align: 'center', alpha: 0.8 }); } }
      rgbText('SOAP · 20 SECONDS', 540, 470, 110, t, so, { color: CY }); }; }; });
