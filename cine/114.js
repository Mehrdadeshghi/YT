// Wiki Roulette #114 — HOW IT WORKS #6: QR codes (a third can be missing) + the parking-meter scam. Motion graphics (tech.js kit).
// Retention: frame-1 destruction (a chunk is ripped off, still scans) → 1994 car-parts origin → finder squares → ones/zeros + repair data →
// 30 % erased and rebuilt → twist: fake sticker on a parking meter → value tip (check the address, sticker = don't scan) → CTA.
const N = 6, QN = 25;
const qEase = (x) => 1 - Math.pow(1 - clamp(x), 3);
const QR = (() => { const r = rng(1994), m = []; for (let y = 0; y < QN; y++) { m.push([]); for (let x = 0; x < QN; x++) m[y].push(r() < 0.48 ? 1 : 0); }
  const fp = (ox, oy) => { for (let y = -1; y < 8; y++) for (let x = -1; x < 8; x++) { const X = ox + x, Y = oy + y; if (X < 0 || Y < 0 || X >= QN || Y >= QN) continue;
      const d = Math.max(Math.abs(x - 3), Math.abs(y - 3)); m[Y][X] = (x < 0 || y < 0 || x > 6 || y > 6) ? 0 : (d === 3 || d <= 1) ? 1 : 0; } };
  fp(0, 0); fp(QN - 7, 0); fp(0, QN - 7); for (let k = 8; k < QN - 8; k++) { m[6][k] = k % 2 ? 0 : 1; m[k][6] = k % 2 ? 0 : 1; } return m; })();
const isFinder = (x, y) => (x < 8 && y < 8) || (x >= QN - 8 && y < 8) || (x < 8 && y >= QN - 8);
// o: { gone(x,y)→bool, digits, repair, finderGlow, col, bg }
function drawQR(cx, cy, size, t, o = {}) { const c = size / (QN + 2), x0 = cx - size / 2 + c, y0 = cy - size / 2 + c;
  g.save(); g.shadowColor = 'rgba(0,0,0,0.6)'; g.shadowBlur = 40; rrect(cx - size / 2, cy - size / 2, size, size, 18); g.fillStyle = o.bg || '#FFFFFF'; g.fill(); g.restore();
  for (let y = 0; y < QN; y++) for (let x = 0; x < QN; x++) { if (o.gone && o.gone(x, y)) continue; const v = QR[y][x], rep = o.repair && !isFinder(x, y) && (x + y * 3) % 5 < 2;
    if (o.digits && !isFinder(x, y)) { text(String(v), x0 + x * c + c / 2, y0 + y * c + c * 0.78, 'mono', c * 0.85, rep && o.repair > 0 ? GOLD : v ? '#0A0A12' : '#9AA4B5', { align: 'center' }); continue; }
    if (!v) { if (rep && o.repair > 0) { g.fillStyle = `rgba(255,197,61,${0.25 * o.repair})`; g.fillRect(x0 + x * c, y0 + y * c, c, c); } continue; }
    g.fillStyle = rep && o.repair > 0 ? `rgb(${lerp(10, 220, o.repair)},${lerp(10, 150, o.repair)},${lerp(18, 20, o.repair)})` : (o.col || '#0A0A12'); g.fillRect(x0 + x * c - 0.3, y0 + y * c - 0.3, c + 0.6, c + 0.6); }
  if (o.finderGlow > 0) [[0, 0], [QN - 7, 0], [0, QN - 7]].forEach(([fx, fy], k) => { const px = x0 + (fx + 3.5) * c, py = y0 + (fy + 3.5) * c, pul = 1 + 0.08 * Math.sin(t * 8 + k);
    g.save(); g.globalAlpha = o.finderGlow; g.strokeStyle = MG; g.lineWidth = 8; g.shadowColor = MG; g.shadowBlur = 30; g.strokeRect(px - 4.6 * c * pul, py - 4.6 * c * pul, 9.2 * c * pul, 9.2 * c * pul); g.restore(); });
  return { c, x0, y0 }; }
function scanFrame(cx, cy, size, t, col = LIME) { g.save(); g.strokeStyle = col; g.lineWidth = 10; g.lineCap = 'round'; g.shadowColor = col; g.shadowBlur = 24; const h = size / 2 + 30, L = 70;
  [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([sx, sy]) => { g.beginPath(); g.moveTo(cx + sx * h, cy + sy * (h - L)); g.lineTo(cx + sx * h, cy + sy * h); g.lineTo(cx + sx * (h - L), cy + sy * h); g.stroke(); });
  const yy = cy - h + ((t * 500) % (2 * h)); g.globalAlpha = 0.6; g.beginPath(); g.moveTo(cx - h, yy); g.lineTo(cx + h, yy); g.stroke(); g.restore(); }
function meter(x, y, s) { g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = '#2B3240'; g.fillRect(-30, 200, 60, 500); g.shadowColor = 'rgba(0,0,0,0.6)'; g.shadowBlur = 40; rrect(-210, -300, 420, 520, 40); g.fillStyle = '#2E5A9E'; g.fill(); g.shadowBlur = 0;
  rrect(-170, -260, 340, 90, 14); g.fillStyle = '#0A1830'; g.fill(); text('P  PAY HERE', 0, -200, 'disp', 40, '#FFFFFF', { align: 'center' }); g.restore(); }

// ---------- scenes ----------
VIS.open = (K) => { const ri = sw('rip', 0.4), wo = sw('works', 2.6); K(0.05, 'hit', 1.3); ks(K, [[ri, 'glitch', 1], [ri + 0.05, 'whoosh', 0.9], ...drop(wo, 0.35)]); K(wo + 0.1, 'ding', 1.1);
  return (t) => { techBg(t, '#04070F', '#0D1F3A'); const lt = t - ri, cut = (x, y) => lt > 0 && x + y > QN * 1.25;
    drawQR(540, 900, 560, t, { gone: cut });
    if (lt > 0) { g.save(); g.translate(540 + 200 + lt * 600, 900 + 200 + lt * 900); g.rotate(lt * 3); g.globalAlpha = clamp(1 - lt / 1.2); g.fillStyle = '#FFFFFF'; g.beginPath(); g.moveTo(-60, 120); g.lineTo(120, -60); g.lineTo(140, 140); g.closePath(); g.fill();
      g.fillStyle = '#0A0A12'; for (let k = 0; k < 14; k++) g.fillRect(-20 + (k % 5) * 30, (k / 5 | 0) * 30, 24, 24); g.restore(); }
    if (t > wo) { scanFrame(540, 900, 560, t); chip('STILL WORKS ✓', 540, 900, t, wo, { size: 64, bg: LIME, fg: BG }); lot(t, wo + 0.1, 'mindblown', 900, 640, 120); }
    tag(t); hook(t, EP.hook, 400); if (EP.series) chip(EP.series, 80, 300, t, -0.3, { size: 26, align: 'left', bg: GOLD, fg: BG }); }; };

VIS[0] = S(() => { const ja = sw('japan', 1.2), ni = sw('nineteen', 1.7), ca = sw('car', 3.0);
  return (K) => { ks(K, [[ja, 'pop', 0.8, 600], ...drop(ni, 0.35), [ca, 'ding', 1]]); for (let k = 0; k < 5; k++) K(ca + 0.2 + k * 0.3, 'beep', 0.5);
    return (t) => { techBg(t, '#08060A', '#241018'); tag(t, 0, N);
      if (t > ni) { const y = Math.round(lerp(2026, 1994, qEase((t - ni) / 0.6))); rgbText(String(y), 540, 480, 180, t, ni, { color: RED2 }); chip('JAPAN · INVENTED FOR CAR PARTS', 540, 570, t, ni + 0.3, { size: 32, bg: GOLD, fg: BG }); }
      else if (t > ja) { g.save(); g.fillStyle = '#FFFFFF'; g.beginPath(); g.arc(540, 480, 70, 0, 6.283); g.fill(); g.fillStyle = '#E0303A'; g.beginPath(); g.arc(540, 480, 28, 0, 6.283); g.fill(); g.restore(); }
      g.save(); g.fillStyle = '#2B3240'; g.fillRect(0, 1180, W, 40); for (let k = 0; k < 14; k++) { g.fillStyle = '#3A4252'; g.fillRect(((k * 90 - t * 160) % 1260 + 1260) % 1260 - 90, 1190, 40, 20); } g.restore();
      for (let k = 0; k < 4; k++) { const x = ((k * 330 + t * 160) % 1320) - 160; g.save(); g.translate(x, 1040); g.fillStyle = '#B98A55'; g.fillRect(-120, -130, 240, 140); g.strokeStyle = '#7C5A33'; g.lineWidth = 4; g.strokeRect(-120, -130, 240, 140); g.restore(); drawQR(x, 980, 110, t);
        if (Math.abs(x - 540) < 60 && t > ca) { glowLine([[540, 700], [x, 980]], RED2, 5, 0.8); glowDot(x, 980, 12, RED2); } }
      if (t > ca) { g.save(); g.translate(540, 700); g.fillStyle = '#1A1E26'; rrect(-60, -40, 120, 80, 14); g.fill(); g.restore(); chip('SCANNED ✓', 540, 790, t, ca, { size: 30, bg: LIME, fg: BG }); } }; }; });

VIS[1] = S(() => { const th = sw('three', 0.5), he = sw('here', 1.8), up = sw('up', 3.0);
  return (K) => { ks(K, [[th, 'zap', 0.8], [he, 'pop', 0.8, 700], [up, 'ding', 1]]);
    return (t) => { techBg(t); tag(t, 1, N); const rot = t < up ? 0.6 * Math.sin(t * 1.3) + 0.5 : 0.5 * (1 - qEase((t - up) / 0.5));
      g.save(); g.translate(540, 840); g.rotate(rot); drawQR(0, 0, 580, t, { finderGlow: t > th ? clamp((t - th) / 0.3) : 0 }); g.restore();
      if (t > he) scanFrame(540, 840, 580, t, CY);
      if (t > th && t < up) rgbText('3 FINDER SQUARES', 540, 470, 90, t, th, { color: MG });
      if (t > up) { rgbText('↑ THIS WAY UP', 540, 470, 100, t, up, { color: CY }); } }; }; });

VIS[2] = S(() => { const on = sw('ones', 1.0), ex = sw('extra', 2.4), re = sw('repair', 2.8);
  return (K) => { ks(K, [[on, 'type', 1], [re, 'zap', 0.9], [re + 0.02, 'ding', 0.8]]);
    return (t) => { techBg(t, '#03070F', '#0A1B33'); tag(t, 2, N); const zm = t > on ? qEase((t - on) / 0.5) : 0;
      g.save(); g.translate(540, 840); g.scale(1 + zm * 0.1, 1 + zm * 0.1); drawQR(0, 0, 620, t, { digits: t > on, repair: t > re ? clamp((t - re) / 0.4) : 0 }); g.restore();
      if (t > on && t < re) rgbText('1 0 1 1 0 1', 540, 440, 110, t, on, { color: '#FFFFFF' });
      if (t > re) { rgbText('REPAIR DATA', 540, 440, 120, t, re, { color: GOLD }); chip('ERROR CORRECTION', 540, 530, t, re + 0.2, { size: 32, bg: GOLD, fg: BG }); } }; }; });

VIS[3] = S(() => { const th = sw('thirty', 1.4), mi = sw('missing', 2.2), re = sw('rebuilds', 3.6);
  return (K) => { ks(K, [[0.3, 'glitch', 0.8], ...drop(th, 0.35), [mi, 'wrong', 0.8], [re, 'swish', 0.8], [re + 0.5, 'ding', 1.1]]);
    return (t) => { techBg(t); tag(t, 3, N); const er = clamp((t - 0.3) / Math.max(0.6, th - 0.3)) * (t > re ? 1 - qEase((t - re) / 0.6) : 1), rr = rng(7);
      const hole = Array.from({ length: QN * QN }, () => rr()); const gone = (x, y) => !isFinder(x, y) && hole[y * QN + x] < er * 0.32 + (Math.hypot(x - 15, y - 14) < 5.5 ? er : 0) * 0.9;
      drawQR(540, 840, 580, t, { gone });
      if (t > re + 0.3) rgbText('REBUILT ✓', 540, 450, 120, t, re + 0.3, { color: LIME }); else if (t > th) { const v = Math.round(30 * qEase((t - th) / 0.5)); rgbText(`${v}% GONE`, 540, 450, 120, t, th, { color: RED2 }); }
      if (t > re) scanFrame(540, 840, 580, t);
      if (t > mi && t < re) { framed(t, 'damaged', 700, 1100, 300, { backdrop: false }); realBadge(t, mi, 'REAL PHOTO · DAMAGED QR CODE, STILL READABLE', 1070); } }; }; });

VIS[4] = S(() => { const sc = sw('scammers', 0.4), st = sw('stick', 1.4), pa = sw('parking', 2.4), fa = sw('fake', 4.0, 1);
  return (K) => { ks(K, [[sc, 'glitch', 0.9], [st, 'stamp', 1.1], [pa, 'pop', 0.7, 600], [fa, 'wrong', 1.1]]);
    return (t) => { techBg(t, '#0E0408', '#22070F'); tag(t, 4, N); meter(330, 880, 1.0); drawQR(330, 1010, 230, t);
      if (t > st) { const p = qEase((t - st) / 0.3); g.save(); g.translate(330 + 8, lerp(700, 1004, p)); g.rotate(0.06 * (1 - p) + 0.03); drawQR(0, 0, 250, t + 7, { col: '#1A0A12' }); g.restore();
        if (t > st + 0.3) { g.save(); g.fillStyle = 'rgba(255,255,255,0.85)'; g.beginPath(); g.moveTo(463, 1135); g.lineTo(463, 1100); g.lineTo(430, 1135); g.closePath(); g.fill(); g.restore(); } }
      if (t > sc && t < fa) rgbText('SCAMMERS', 540, 470, 120, t, sc, { color: RED2, jitter: true });
      if (t > fa) { phoneFrame(800, 980, 0.55, () => { g.fillStyle = '#FFFFFF'; g.fillRect(-190, -380, 380, 760); rrect(-170, -350, 340, 60, 14); g.fillStyle = '#FFE1E4'; g.fill(); text('pay-parkng-secure…', -150, -310, 'mono', 26, RED2);
          text('Card number', -160, -180, 'ui', 30, '#333'); rrect(-160, -160, 320, 60, 10); g.strokeStyle = '#999'; g.lineWidth = 3; g.stroke(); text('CVC', -160, -50, 'ui', 30, '#333'); rrect(-160, -30, 150, 60, 10); g.stroke(); rrect(-160, 120, 320, 80, 16); g.fillStyle = '#2E5A9E'; g.fill(); text('PAY €2.00', 0, 172, 'disp', 34, '#FFF', { align: 'center' }); });
        rgbText('FAKE PAYMENT SITE', 540, 470, 86, t, fa, { color: RED2 }); lot(t, fa, 'warning', 940, 640, 110); } }; }; });

VIS[5] = S(() => { const ch = sw('check', 0.4), ad = sw('address', 1.6), st = sw('sticker', 2.8), sc = sw('scan', 3.8);
  return (K) => { ks(K, [[ch, 'pop', 0.8, 700], [ad, 'ding', 0.9], [st, 'zap', 0.8], ...drop(sc, 0.35)]);
    return (t) => { techBg(t); tag(t, 5, N);
      phoneFrame(540, 900, 0.95, () => { g.fillStyle = '#0A0F18'; g.fillRect(-190, -380, 380, 760); drawQR(0, -60, 260, t); scanFrame(0, -60, 260, t, '#FFFFFF');
        if (t > ad) { rrect(-175, 160, 350, 110, 20); g.fillStyle = 'rgba(255,255,255,0.95)'; g.fill(); text('OPEN LINK?', -150, 200, 'mono', 22, '#666'); text('pay-parkng-secure…', -150, 245, 'mono', 26, RED2); g.save(); g.strokeStyle = GOLD; g.lineWidth = 6; rrect(-180, 155, 360, 120, 22); g.stroke(); g.restore(); } });
      if (t > ch && t < st) rgbText('CHECK THE ADDRESS', 540, 430, 86, t, ch, { color: GOLD });
      if (t > st) { rgbText('STICKER? DON\'T SCAN!', 540, 430, 80, t, st, { color: RED2 }); g.save(); g.strokeStyle = RED2; g.lineWidth = 20; g.lineCap = 'round'; g.shadowColor = RED2; g.shadowBlur = 30; const p = qEase((t - sc) / 0.3);
        if (t > sc) { g.beginPath(); g.moveTo(400, 700); g.lineTo(400 + 280 * p, 700 + 280 * p); g.moveTo(680, 700); g.lineTo(680 - 280 * p, 700 + 280 * p); g.stroke(); } g.restore(); } }; }; });
