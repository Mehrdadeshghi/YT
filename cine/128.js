// Body Facts #10 (#128) — heart attack signs in women. Motion graphics (tech.js + med.js).
const N = 6;
// front-facing woman (head, hair, body, arms); returns key points
function woman(x, y, s, col = '#3A4C6E') { g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = '#5A3A2A'; g.beginPath(); g.ellipse(0, -250, 105, 125, 0, 0, 6.283); g.fill(); rrect(-105, -260, 210, 200, 60); g.fill();
  g.fillStyle = SKIN; g.beginPath(); g.ellipse(0, -255, 72, 88, 0, 0, 6.283); g.fill(); rrect(-24, -180, 48, 50, 10); g.fill(); g.fillStyle = col; g.beginPath(); g.moveTo(-150, -120); g.quadraticCurveTo(0, -150, 150, -120); g.lineTo(130, 220); g.lineTo(-130, 220); g.closePath(); g.fill();
  rrect(-215, -115, 60, 300, 30); g.fill(); rrect(155, -115, 60, 300, 30); g.fill(); g.restore();
  return { chest: [x - 30 * s, y - 40 * s], lungs: [x + 50 * s, y - 50 * s], stomach: [x, y + 110 * s], jaw: [x, y - 190 * s], arm: [x - 185 * s, y + 20 * s] }; }
function hot(x, y, r, t, t0, col = RED2) { if (t < t0) return; const p = mE((t - t0) / 0.4), q = 0.6 + 0.4 * Math.sin(t * 7); g.save(); const gr = g.createRadialGradient(x, y, 0, x, y, r * p); gr.addColorStop(0, col); gr.addColorStop(1, 'rgba(255,59,78,0)');
  g.globalAlpha = q; g.fillStyle = gr; g.beginPath(); g.arc(x, y, r * p, 0, 6.283); g.fill(); g.restore(); glowDot(x, y, 12 * p, '#FFFFFF', q); shock(x, y, t, t0, r * 1.6, col, 0.7); }
function car(x, y, s) { g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = '#4A6FB0'; rrect(-220, -40, 440, 110, 30); g.fill(); g.beginPath(); g.moveTo(-130, -40); g.lineTo(-80, -120); g.lineTo(90, -120); g.lineTo(150, -40); g.fill();
  g.fillStyle = '#BFE3FF'; g.beginPath(); g.moveTo(-105, -45); g.lineTo(-70, -105); g.lineTo(0, -105); g.lineTo(0, -45); g.fill(); g.beginPath(); g.moveTo(15, -45); g.lineTo(15, -105); g.lineTo(80, -105); g.lineTo(125, -45); g.fill();
  g.fillStyle = '#111'; g.beginPath(); g.arc(-130, 70, 46, 0, 6.283); g.arc(130, 70, 46, 0, 6.283); g.fill(); g.restore(); }

VIS.open = (K) => { const mo = sw('movies', 1.8), wo = sw('women', 3.2); K(0.05, 'hit', 1.1); ks(K, [[mo, 'scratch', 0.8], [wo, 'boom', 0.7]]);
  return (t) => { bodyBg(t, '#1A0610', '#3A0D1E'); const P = framed(t, 'ecg', 40, 900, 1000, { b: [0.5, 0.5, 1.06], backdrop: false }); g.fillStyle = 'rgba(26,6,16,0.55)'; g.fillRect(0, 880, W, 700);
    heart(540, 1150, 0.9, beatAt(t, 90)); if (t > mo) { g.save(); g.strokeStyle = RED2; g.lineWidth = 18; g.lineCap = 'round'; const q = mE((t - mo) / 0.3); g.beginPath(); g.moveTo(380, 990); g.lineTo(380 + 320 * q, 990 + 320 * q); g.stroke(); g.restore(); }
    if (t > mo) chip('NOT ALWAYS LIKE IN THE MOVIES', 540, 800, t, mo, { size: 32, bg: '#FFFFFF', fg: BG });
    tag(t); hook(t, EP.hook, 400); if (EP.series) chip(EP.series, 80, 300, t, -0.3, { size: 26, align: 'left', bg: MRED, fg: '#FFF' }); }; };

VIS[0] = S(() => { const cl = sw('classic', 0.4), ch = sw('chest', 1.0), co = sw('common', 2.8), me = sw('men', 3.6);
  return (K) => { ks(K, [[ch, 'thump', 0.9], [co, 'pop', 0.8, 600], [me, 'ding', 0.9]]);
    return (t) => { bodyBg(t, '#1A0610', '#3A0D1E'); tag(t, 0, N); if (t < co) { const P = framed(t, 'mi', 300, 640, 480, { b: [0.5, 0.4, 1.06] }); if (!P) noPhoto(t); realBadge(t, cl, 'REAL ILLUSTRATION · HEART ATTACK (BLOCKED ARTERY)');
        rgbText('CHEST PAIN OR PRESSURE', 540, 520, 90, t, ch, { color: RED2 }); return; }
      torso(320, 1000, 1.1, '#3A4C6E'); woman(770, 1020, 0.95); hot(320, 960, 90, t, co); hot(740, 980, 80, t, me);
      rgbText('STILL THE #1 SIGN', 540, 470, 110, t, co, { color: RED2 }); if (t > me) chip('IN MEN AND IN WOMEN', 540, 560, t, me, { size: 36, bg: '#FFFFFF', fg: BG }); }; }; });

VIS[1] = S(() => { const ot = sw('other', 0.8), br = sw('breath', 2.0), na = sw('nausea', 2.6), ba = sw('back', 3.6), ja = sw('jaw', 4.0), ar = sw('arm', 4.4);
  return (K) => { ks(K, [[ot, 'whoosh', 0.7], [br, 'pop', 0.8, 500], [na, 'pop', 0.8, 600], [ba, 'pop', 0.8, 700], [ja, 'pop', 0.8, 800], [ar, 'pop', 0.8, 900]]);
    return (t) => { bodyBg(t, '#1A0610', '#3A0D1E'); tag(t, 1, N); const Pt = woman(540, 1010, 1.05);
      if (t > ba && t < ja) { const P = framed(t, 'painback', 640, 640, 380, { b: [0.5, 0.4, 1.05], backdrop: false }); if (P) realBadge(t, ba, 'REAL DIAGRAM · BACK PAIN AREA', 600); }
      hot(...Pt.lungs, 80, t, br, '#FF9F3D'); hot(...Pt.stomach, 80, t, na, '#B6E04A'); hot(...Pt.jaw, 50, t, ja); hot(...Pt.arm, 60, t, ar);
      [['SHORT OF BREATH', br, 200, 760], ['NAUSEA', na, 210, 1160], ['BACK', ba, 880, 1160], ['JAW', ja, 880, 760], ['ARM', ar, 210, 960]].forEach(([s, at, x, y]) => { if (t > at) chip(s, x, y, t, at, { size: 30, bg: '#FFFFFF', fg: BG }); });
      rgbText('WOMEN: MORE OFTEN', 540, 470, 104, t, ot, { color: MG }); chip('SOURCE: AMERICAN HEART ASSOCIATION', 540, 560, t, ot + 0.2, { size: 24, bg: 'rgba(255,255,255,0.85)', fg: BG }); }; }; });

VIS[2] = S(() => { const ti = sw('tired', 0.8), an = sw('anxious', 1.6), sw2 = sw('sweat', 3.0);
  return (K) => { ks(K, [[ti, 'pop', 0.8, 400], [an, 'pop', 0.8, 700], [sw2, 'splash', 0.5]]);
    return (t) => { bodyBg(t, '#06101E', '#102A46'); tag(t, 2, N);
      if (t > ti) { g.save(); g.strokeStyle = '#FFFFFF'; g.lineWidth = 8; rrect(110, 780, 230, 120, 18); g.stroke(); g.fillRect(345, 815, 16, 50); g.fillStyle = RED2; rrect(124, 794, 40 * (0.6 + 0.4 * Math.sin(t * 3)), 92, 10); g.fill(); g.restore(); text('UNUSUALLY TIRED', 225, 960, 'mono', 26, '#FFFFFF', { align: 'center' }); }
      if (t > an) { heart(540, 840, 0.45, beatAt(t, 150)); ecgTrace(420, 660, 960, t, 150, GOLD, 30); text('ANXIOUS', 540, 1010, 'mono', 26, '#FFFFFF', { align: 'center' }); }
      if (t > sw2) { for (let k = 0; k < 4; k++) { const y = 780 + ((t - sw2) * 140 + k * 60) % 180; g.fillStyle = '#7FD3FF'; g.beginPath(); g.moveTo(780 + k * 50, y - 26); g.quadraticCurveTo(805 + k * 50, y + 10, 780 + k * 50, y + 16); g.quadraticCurveTo(755 + k * 50, y + 10, 780 + k * 50, y - 26); g.fill(); } text('COLD SWEAT', 855, 1010, 'mono', 26, '#FFFFFF', { align: 'center' }); }
      rgbText('OTHER WARNING SIGNS', 540, 470, 100, t, 0.1, { color: CY }); }; }; });

VIS[3] = S(() => { const br = sw('brush', 0.8), st = sw('stress', 1.8), sto = sw('stomach', 2.8);
  return (K) => { ks(K, [[st, 'pop', 0.8, 500], [sto, 'pop', 0.8, 600], [sto + 0.8, 'swish', 0.9], [sto + 1.2, 'stamp', 1]]);
    return (t) => { bodyBg(t, '#1A0610', '#3A0D1E'); tag(t, 3, N); const sweep = t > sto + 0.8 ? mE((t - sto - 0.8) / 0.4) : 0;
      [['"JUST STRESS"', st, 820], ['"UPSET STOMACH"', sto, 960]].forEach(([s, at, y]) => { if (t > at) { g.save(); g.translate(1200 * sweep, 0); g.rotate(0.2 * sweep); chip(s, 540, y, t, at, { size: 48, bg: '#FFFFFF', fg: BG }); g.restore(); } });
      if (t > sto + 1.2) stampText("DON'T IGNORE IT", 540, 900, t, sto + 1.2, { size: 80, color: RED2 });
      rgbText('EASY TO BRUSH OFF', 540, 470, 110, t, br, { color: '#FFFFFF' }); }; }; });

VIS[4] = S(() => { const dr = sw('drive', 1.0), ca = sw('call', 1.8);
  return (K) => { ks(K, [[dr, 'wrong', 1], [ca, 'beep', 1], [ca + 0.3, 'beep', 1]]);
    return (t) => { bodyBg(t, '#1A0610', '#3A0D1E'); tag(t, 4, N);
      if (t < ca) { car(540, 920, 1.1); if (t > dr) { g.save(); g.strokeStyle = RED2; g.lineWidth = 24; g.lineCap = 'round'; const q = mE((t - dr) / 0.3); g.beginPath(); g.moveTo(330, 740); g.lineTo(330 + 420 * q, 740 + 360 * q); g.moveTo(750, 740); g.lineTo(750 - 420 * q, 740 + 360 * q); g.stroke(); g.restore(); }
        rgbText("DON'T DRIVE YOURSELF", 540, 470, 100, t, dr, { color: RED2 }); return; }
      if (Math.floor(t * 4) % 2) { g.fillStyle = 'rgba(62,123,255,0.12)'; g.fillRect(0, 0, W, H); } phoneFrame(540, 930, 0.5, () => { g.fillStyle = '#0B2A1A'; g.fillRect(-190, -380, 380, 760); text('112 · 911', 0, -40, 'disp', 64, LIME, { align: 'center' }); text('calling…', 0, 40, 'ui', 34, '#FFFFFF', { align: 'center' }); });
      rgbText('CALL EMERGENCY NOW', 540, 470, 100, t, ca, { color: LIME }); }; }; });

VIS[5] = S(() => { const sh = sw('share', 0.3), lo = sw('love', 1.4);
  return (K) => { ks(K, [[sh, 'whoosh', 0.7], [lo, 'ding', 1]]);
    return (t) => { bodyBg(t, '#1A0610', '#3A0D1E'); tag(t, 5, N); heart(540, 880, 1.1, beatAt(t, 72));
      if (t > sh) for (let k = 0; k < 6; k++) { const a = k / 6 * 6.283 + t * 0.4, p = mE((t - sh - k * 0.08) / 0.6), r = 300 * p; woman(540 + Math.cos(a) * r, 900 + Math.sin(a) * r * 0.8, 0.22, [MG, CY, GOLD, LIME, '#FF9F3D', '#8AA4FF'][k]); }
      rgbText('SHARE THIS', 540, 470, 120, t, sh, { color: MRED }); if (t > lo) chip('WITH THE WOMEN YOU LOVE ❤', 540, 560, t, lo, { size: 36, bg: MRED, fg: '#FFF' }); medNote(t, lo + 0.3, 640); }; }; });
