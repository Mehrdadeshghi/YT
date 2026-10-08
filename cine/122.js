// Body Facts #4 (#122) — migraine is not just a headache. Motion graphics (tech.js + med.js).
const N = 6;
function figure(x, y, s, col, a = 1) { g.save(); g.globalAlpha *= a; g.fillStyle = col; g.beginPath(); g.arc(x, y - 52 * s, 24 * s, 0, 6.283); g.fill(); rrect(x - 30 * s, y - 22 * s, 60 * s, 74 * s, 22 * s); g.fill(); g.restore(); }
// zigzag "fortification" arc (the aura), growing with p, flickering
function zigzag(x, y, r, p, t, a = 1) { if (p <= 0) return; g.save(); g.globalAlpha *= a * (0.75 + 0.25 * Math.sin(t * 40)); g.lineWidth = 7; g.lineJoin = 'miter';
  const a0 = -2.4, a1 = a0 + 2.2 * p, n = Math.max(3, Math.floor(26 * p)); ['#FF3B4E', '#FFE14D', '#3EE6FF'].forEach((c, ci) => { g.strokeStyle = c; g.shadowColor = c; g.shadowBlur = 16; g.beginPath();
    for (let i = 0; i <= n; i++) { const an = a0 + (a1 - a0) * i / n, rr = r * (1 + p * 0.35) + (i % 2 ? 26 : -26) + ci * 10; i ? g.lineTo(x + Math.cos(an) * rr, y + Math.sin(an) * rr) : g.moveTo(x + Math.cos(an) * rr, y + Math.sin(an) * rr); } g.stroke(); }); g.restore(); }
function headSide(x, y, s, t, pain) { g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = '#3A4C6E'; g.beginPath(); g.ellipse(0, -40, 190, 220, 0, 0, 6.283); g.fill(); rrect(-80, 120, 160, 190, 40); g.fill(); g.beginPath(); g.moveTo(180, -60); g.lineTo(235, 10); g.lineTo(178, 30); g.fill(); g.beginPath(); g.ellipse(-10, -20, 30, 48, 0, 0, 6.283); g.fillStyle = '#2C3B57'; g.fill(); g.fillStyle = '#3A4C6E';
  if (pain > 0) { const p = 0.6 + 0.4 * Math.sin(t * 9); g.save(); g.beginPath(); g.ellipse(0, -40, 190, 220, 0, 0, 6.283); g.clip(); const gr = g.createRadialGradient(-110, -110, 10, -110, -110, 260); gr.addColorStop(0, `rgba(255,59,78,${0.95 * pain})`); gr.addColorStop(1, 'rgba(255,59,78,0)'); g.fillStyle = gr; g.fillRect(-200, -270, 200, 460); g.restore();
    g.strokeStyle = `rgba(255,220,80,${p * pain})`; g.lineWidth = 9; g.shadowColor = GOLD; g.shadowBlur = 20; [[-150, -200], [-210, -80], [-140, 40]].forEach(([bx, by], k) => { g.beginPath(); g.moveTo(bx, by); g.lineTo(bx - 40, by + 20); g.lineTo(bx - 20, by + 34); g.lineTo(bx - 70, by + 60); g.stroke(); }); }
  g.restore(); }
function diary(x, y, t, rows) { g.save(); g.translate(x, y); g.rotate(-0.04); g.fillStyle = '#F4EEDC'; g.shadowColor = 'rgba(0,0,0,0.5)'; g.shadowBlur = 40; rrect(-300, -260, 600, 520, 24); g.fill(); g.shadowBlur = 0;
  g.fillStyle = MRED; g.fillRect(-300, -260, 40, 520); text('MIGRAINE DIARY', 20, -190, 'disp', 44, BG, { align: 'center' });
  rows.forEach(([lab, at], k) => { const yy = -90 + k * 100; g.strokeStyle = 'rgba(0,0,0,0.15)'; g.lineWidth = 3; g.beginPath(); g.moveTo(-230, yy + 30); g.lineTo(260, yy + 30); g.stroke();
    if (t > at) { const p = mE((t - at) / 0.35); text(lab, -165, yy + 14, 'disp', 36, BG, { alpha: p }); g.strokeStyle = '#1FA85A'; g.lineWidth = 9; g.beginPath(); g.moveTo(-220, yy); g.lineTo(-200, yy + 20 * p); g.lineTo(-200 + 50 * p, yy - 26 * p); g.stroke(); } }); g.restore(); }
function pill(x, y, s, ang, col = '#FFFFFF') { g.save(); g.translate(x, y); g.rotate(ang); g.scale(s, s); rrect(-60, -24, 120, 48, 24); g.fillStyle = col; g.fill(); g.save(); g.beginPath(); g.rect(0, -30, 70, 60); g.clip(); rrect(-60, -24, 120, 48, 24); g.fillStyle = MRED; g.fill(); g.restore(); g.restore(); }

VIS.open = (K) => { const no = sw('not', 0.5), he = sw('headache', 1.6); K(0.05, 'hit', 1.1); ks(K, [[no, 'glitch', 0.8], [he, 'boom', 0.7]]);
  return (t) => { bodyBg(t, '#12061A', '#2E0C3A'); headSide(540, 980, 1.0, t, clamp((t - 0.2) / 0.5)); if (Math.floor(t * 6) % 3 === 0 && t > he) { g.fillStyle = 'rgba(255,40,60,0.08)'; g.fillRect(0, 0, W, H); }
    tag(t); hook(t, EP.hook, 400); if (EP.series) chip(EP.series, 80, 300, t, -0.3, { size: 26, align: 'left', bg: MRED, fg: '#FFF' }); }; };

VIS[0] = S(() => { const se = sw('seven', 0.8), wo = sw('women', 2.4), th = sw('three', 3.2);
  return (K) => { ks(K, [...drop(se, 0.35), [wo, 'whoosh', 0.7], [th, 'pop', 0.9, 600]]);
    return (t) => { bodyBg(t, '#12061A', '#2E0C3A'); tag(t, 0, N);
      if (t < wo) { for (let k = 0; k < 7; k++) { const hl = k === 3 && t > se; figure(180 + k * 120, 900, 1.6, hl ? MRED : 'rgba(255,255,255,0.3)'); if (hl) shock(180 + k * 120, 860, t, se, 160, MRED); }
        if (t > se) rgbText('1 IN 7 PEOPLE', 540, 470, 120, t, se, { color: MRED }); chip('WORLDWIDE', 540, 560, t, se + 0.2, { size: 34, bg: '#FFFFFF', fg: BG }); }
      else { [['WOMEN', 3, MG, 340], ['MEN', 1, CY, 740]].forEach(([lab, v, c, x]) => { const p = mE((t - (v === 3 ? th : wo)) / 0.6), h = 130 * v * p; if (p > 0) { g.save(); g.fillStyle = c; g.shadowColor = c; g.shadowBlur = 30; rrect(x - 100, 1100 - h, 200, h, 16); g.fill(); g.restore(); }
          text(lab, x, 1100 - h - 20, 'disp', 50, c, { align: 'center' }); });
        rgbText(t > th ? '~3× MORE OFTEN' : 'WOMEN VS. MEN', 540, 470, 110, t, t > th ? th : wo, { color: t > th ? MG : '#FFFFFF' }); } }; }; });

VIS[1] = S(() => { const au = sw('aura', 0.6), zi = sw('zigzag', 1.8), sp = sw('spread', 3.2);
  return (K) => { ks(K, [[au, 'whoosh', 0.8], [zi, 'glitch', 0.7], [sp, 'riser', 0.6]]);
    return (t) => { if (t < zi) { bodyBg(t, '#12061A', '#2E0C3A'); tag(t, 1, N); g.save(); g.translate(540, 860); g.strokeStyle = '#FFFFFF'; g.lineWidth = 10; g.beginPath(); g.ellipse(0, 0, 260, 150, 0, 0, 6.283); g.stroke();
        g.fillStyle = '#4A7BD8'; g.beginPath(); g.arc(0, 0, 110, 0, 6.283); g.fill(); g.fillStyle = '#111'; g.beginPath(); g.arc(0, 0, 50, 0, 6.283); g.fill(); g.restore(); zigzag(540, 860, 150, clamp((t - au) / 1.5) * 0.6, t);
        if (t > au) rgbText('THE AURA', 540, 470, 120, t, au, { color: GOLD }); return; }
      bodyBg(t, '#0A0A12', '#1A1A2A'); const P = framed(t, 'aura', 60, 660, 960, { b: [0.5, 0.5, 1.08] }); if (!P) noPhoto(t); tag(t, 1, N); realBadge(t, zi, 'REAL SIMULATION · HOW AN AURA CAN LOOK');
      if (P) { const [x, y] = P(0.45, 0.5); zigzag(x, y, 120, clamp((t - zi) / 2.5), t, 0.8); }
      rgbText(t > sp ? 'IT SLOWLY SPREADS' : 'FLICKERING ZIGZAGS', 540, 520, 96, t, t > sp ? sp : zi, { color: GOLD, jitter: true }); }; }; });

VIS[2] = S(() => { const wa = sw('wave', 1.2), cr = sw('creeping', 2.4), mm = sw('millimeters', 3.8);
  return (K) => { ks(K, [[wa, 'zap', 0.8], [cr, 'riser', 0.7], [mm, 'pop', 0.9, 600]]);
    return (t) => { bodyBg(t, '#06101E', '#102A46'); tag(t, 2, N); const w = t > wa ? clamp((t - wa) / 4.5) : null; brain(540, 880, 1.6, t, { wave: w });
      rgbText(t > wa ? 'A SLOW ELECTRICAL WAVE' : 'WHAT CAUSES THE AURA?', 540, 470, 88, t, t > wa ? wa : 0.1, { color: t > wa ? CY : '#FFFFFF' });
      if (t > mm) chip('ONLY A FEW MILLIMETERS PER MINUTE', 540, 1160, t, mm, { size: 32, bg: CY, fg: BG }); }; }; });

VIS[3] = S(() => { const pa = sw('pain', 0.5), si = sw('side', 1.4), na = sw('nausea', 2.4), li = sw('light', 3.6), so = sw('sound', 4.2);
  return (K) => { ks(K, [[pa, 'boom', 0.7], [na, 'pop', 0.8, 500], [li, 'pop', 0.8, 700], [so, 'pop', 0.8, 900]]);
    return (t) => { bodyBg(t, '#120A06', '#2E1A0C'); const P = framed(t, 'cruik', 90, 620, 900, { b: [0.4, 0.4, 1.08] }); if (!P) noPhoto(t); tag(t, 3, N); realBadge(t, 0.1, 'REAL CARTOON · "THE HEAD ACHE", G. CRUIKSHANK, 1819');
      if (P && t > si) { const [x, y] = P(0.44, 0.36); ring(t, si, x, y, 110, { color: RED2 }); }
      rgbText(t > si ? 'OFTEN ON ONE SIDE' : 'THEN THE PAIN', 540, 520, 100, t, t > si ? si : pa, { color: RED2 });
      [['🤢 NAUSEA', na, 220], ['💡 LIGHT', li, 540], ['🔊 SOUND', so, 860]].forEach(([s, at, x]) => { if (t > at) chip(s, x, 1180, t, at, { size: 34, bg: '#FFFFFF', fg: BG }); }); }; }; });

VIS[4] = S(() => { const di = sw('diary', 1.4), sl = sw('sleep', 2.2), st = sw('stress', 2.8), sk = sw('skipped', 3.4), tr = sw('triggers', 5.0);
  return (K) => { ks(K, [[di, 'paper', 0.9], [sl, 'pen', 0.7], [st, 'pen', 0.7], [sk, 'pen', 0.7], [tr, 'ding', 1]]);
    return (t) => { bodyBg(t, '#06140E', '#0E3A24'); tag(t, 4, N); const p = spring(Math.max(0, t - di + 0.3), 220, 18); g.save(); g.translate(540, 900); g.scale(p, p); g.translate(-540, -900); diary(540, 900, t, [['SLEEP', sl], ['STRESS', st], ['SKIPPED MEALS', sk]]); g.restore();
      rgbText(t > tr ? 'FIND YOUR TRIGGERS' : "HERE'S A TIP", 540, 470, 104, t, t > tr ? tr : 0.1, { color: LIME });
      if (t > tr) { g.save(); g.translate(860, 1120); g.rotate(-0.6); g.strokeStyle = GOLD; g.lineWidth = 16; g.shadowColor = GOLD; g.shadowBlur = 20; g.beginPath(); g.arc(0, 0, 70, 0, 6.283); g.stroke(); g.lineWidth = 22; g.beginPath(); g.moveTo(0, 70); g.lineTo(0, 170); g.stroke(); g.restore(); } }; }; });

VIS[5] = S(() => { const pa = sw('painkillers', 0.8), of = sw('often', 1.4), dc = sw('doctor', 2.2), wo = sw('worse', 4.4);
  return (K) => { const pk = [0, 1, 2, 3, 4, 5, 6, 7].map((k) => pa + k * 0.18); pk.forEach((x) => K(x, 'tick', 0.5)); ks(K, [[dc, 'ding', 0.9], [wo, 'wrong', 1]]);
    return (t) => { bodyBg(t, '#12061A', '#2E0C3A'); tag(t, 5, N); const r = rng(5);
      for (let k = 0; k < 8; k++) { const at = pa + k * 0.18; if (t < at) continue; const d = mE((t - at) / 0.4); pill(260 + (k % 4) * 180 + r() * 30, 640 + (1020 - 640) * d + Math.floor(k / 4) * -70, 1.0, r() * 3, '#FFFFFF'); }
      if (t > wo) { g.save(); g.translate(540, 820); g.rotate(t * 1.5); g.strokeStyle = RED2; g.lineWidth = 12; g.shadowColor = RED2; g.shadowBlur = 20; g.beginPath(); g.arc(0, 0, 150, 0, 5.2); g.stroke();
        g.fillStyle = RED2; g.beginPath(); g.moveTo(150 * Math.cos(5.2) + 30, 150 * Math.sin(5.2) + 10); g.lineTo(150 * Math.cos(5.2) - 30, 150 * Math.sin(5.2) - 10); g.lineTo(150 * Math.cos(5.2) + 10, 150 * Math.sin(5.2) - 50); g.fill(); g.restore();
        chip('TOO MANY PAINKILLERS → MORE HEADACHES', 540, 1160, t, wo, { size: 28, bg: RED2, fg: '#FFF' }); }
      rgbText(t > dc ? 'TALK TO A DOCTOR' : 'PAINKILLERS VERY OFTEN?', 540, 470, 96, t, t > dc ? dc : pa, { color: t > dc ? LIME : '#FFFFFF' }); medNote(t, dc + 0.3, 560); }; }; });
