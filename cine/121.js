// Body Facts #3 (#121) — kidney stones on a roller coaster. Motion graphics (tech.js + med.js).
const N = 6;
// coaster track (sine hills) across the screen; returns point/angle at u 0..1
const trackY = (x, y0, amp) => y0 - amp * (0.5 + 0.5 * Math.sin(x / 150 - 1.2)) * (0.6 + 0.4 * Math.sin(x / 410));
function track(y0, amp, t, col = '#FFC53D') { const pts = []; for (let x = -20; x <= W + 20; x += 8) pts.push([x, trackY(x, y0, amp)]);
  g.save(); g.strokeStyle = 'rgba(255,255,255,0.18)'; g.lineWidth = 4; for (let x = 0; x <= W; x += 60) { g.beginPath(); g.moveTo(x, trackY(x, y0, amp)); g.lineTo(x, 1500); g.stroke(); } g.restore();
  glowLine(pts, col, 8); }
function cart(x, y, ang, s, col, label) { g.save(); g.translate(x, y); g.rotate(ang); g.scale(s, s); g.fillStyle = col; g.shadowColor = col; g.shadowBlur = 20; rrect(-60, -60, 120, 55, 14); g.fill(); g.shadowBlur = 0;
  g.fillStyle = '#111'; g.beginPath(); g.arc(-35, 0, 12, 0, 6.283); g.arc(35, 0, 12, 0, 6.283); g.fill(); if (label) text(label, 0, -22, 'disp', 30, BG, { align: 'center' }); g.restore(); }
function backpack(x, y, s) { g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = '#2E6BD6'; rrect(-110, -140, 220, 280, 50); g.fill(); g.fillStyle = '#244FA0'; rrect(-80, 20, 160, 100, 24); g.fill();
  g.strokeStyle = '#1A3A78'; g.lineWidth = 14; g.beginPath(); g.arc(0, -140, 60, Math.PI, 0); g.stroke(); g.restore(); }
function burst(t, t0, x, y, cols = [GOLD, MG, CY, LIME]) { const lt = t - t0; if (lt < 0 || lt > 2.2) return; const r = rng(7);
  for (let k = 0; k < 60; k++) { const a = r() * 6.283, v = 500 + r() * 700, px = x + Math.cos(a) * v * lt * Math.exp(-lt * 1.4), py = y + Math.sin(a) * v * lt * Math.exp(-lt * 1.4) + 500 * lt * lt;
    g.save(); g.globalAlpha = clamp(2.2 - lt); g.translate(px, py); g.rotate(lt * 8 + k); g.fillStyle = cols[k % cols.length]; g.fillRect(-9, -4, 18, 8); g.restore(); } }

VIS.open = (K) => { const tw = sw('twenty', 2.4); K(0.05, 'hit', 1.1); ks(K, [[0.4, 'whoosh', 0.8], ...drop(tw, 0.35)]);
  return (t) => { techBg(t, '#071226', '#13306A'); track(1180, 300, t); const u = (t * 0.22) % 1, x = -60 + u * (W + 120), y = trackY(x, 1180, 300), y2 = trackY(x + 4, 1180, 300);
    const ang = Math.atan2(y2 - y, 4); cart(x, y, ang, 1.2, GOLD); kidney(x, y - 120, 0.28); stone(x + 10, y - 130, 12, t * 3);
    if (t > tw) { const n = Math.min(20, Math.floor((t - tw) * 24) + 1); rgbText(`×${n}`, 540, 800, 180, t, tw, { color: GOLD }); }
    tag(t); hook(t, EP.hook, 400); if (EP.series) chip(EP.series, 80, 300, t, -0.3, { size: 26, align: 'left', bg: MRED, fg: '#FFF' }); }; };

VIS[0] = S(() => { const mi = sw('michigan', 0.6), st = sw('story', 1.8), di = sw('disney', 2.9), ca = sw('came', 4.6);
  return (K) => { ks(K, [[mi, 'pop', 0.8, 600], [st, 'pop', 0.7, 800], [di, 'pop', 0.7, 900], [ca, 'ding', 1]]);
    return (t) => { bodyBg(t, '#0A1020', '#1A2A50'); tag(t, 0, N); const out = t > ca ? mE((t - ca) / 0.8) : 0;
      kidney(540, 860, 1.0); if (out < 1) stone(560 + out * 40, 860 + out * 520, 34, t * (t > ca ? 6 : 0.5)); if (t > ca) { shock(560, 860, t, ca, 220, GOLD); text('OUT!', 760, 1080, 'disp', 70, LIME, { align: 'center' }); }
      if (t > mi) chip('A DOCTOR IN MICHIGAN', 540, 470, t, mi, { size: 40, bg: '#FFFFFF', fg: BG });
      [['"AFTER A RIDE…"', st, 250], ['"…IT CAME OUT!"', di, 830]].forEach(([s, at, x], k) => { if (t > at) chip(s, x, 590 + k * 70, t, at, { size: 30, bg: k ? GOLD : CY, fg: BG }); }); }; }; });

VIS[1] = S(() => { const pr = sw('printed', 0.9), st = sw('stones', 2.0), bi = sw('big', 3.4), ba = sw('backpack', 4.8);
  return (K) => { ks(K, [[pr, 'zap', 0.7], ...drop(st, 0.3), [bi, 'whoosh', 0.9], [ba, 'pop', 0.8, 600]]);
    return (t) => { if (t > bi) { const P = shot(t, 'thunder', { a: [0.5, 0.5, 1.05], b: [0.45, 0.5, 1.2], dur: 3, t0: bi }); if (!P) noPhoto(t); tag(t, 1, N); realBadge(t, bi + 0.05, 'REAL PHOTO · BIG THUNDER MOUNTAIN, DISNEY WORLD');
        if (t > ba) { g.save(); g.globalAlpha = clamp((t - ba) / 0.3); backpack(540, 1040, 0.8); kidney(540, 1050, 0.32); g.restore(); chip('KIDNEY IN A BACKPACK', 540, 560, t, ba, { size: 36, bg: GOLD, fg: BG }); } return; }
      bodyBg(t, '#0A1020', '#1A2A50'); tag(t, 1, N); const p = clamp((t - pr) / 1.2);
      g.save(); g.beginPath(); g.rect(0, 1080 - 460 * p, W, 460 * p + 10); g.clip(); kidney(540, 860, 1.0, '#7A8BA8'); g.restore();
      if (p > 0 && p < 1) { const yy = 1080 - 460 * p; glowLine([[300, yy], [780, yy]], CY, 4); glowDot(380 + 320 * (0.5 + 0.5 * Math.sin(t * 14)), yy, 12, '#FFFFFF'); }
      g.fillStyle = '#2A3446'; g.fillRect(260, 1080, 560, 30);
      if (t > st) [[520, 800], [580, 900], [500, 960]].forEach(([x, y], k) => { const d = mE((t - st - k * 0.15) / 0.5); if (d > 0) stone(x, 600 + (y - 600) * d, 26, k); });
      rgbText(t > st ? 'REAL STONES INSIDE' : '3D-PRINTED KIDNEY', 540, 470, 90, t, t > st ? st : pr, { color: t > st ? GOLD : CY }); }; }; });

VIS[2] = S(() => { const fr = sw('front', 0.4), si = sw('sixteen', 1.4), la = sw('last', 3.0), sx = sw('sixty', 3.8);
  return (K) => { ks(K, [[fr, 'whoosh', 0.7], [si, 'pop', 0.9, 500], [la, 'whoosh', 0.7], ...drop(sx, 0.35)]);
    return (t) => { bodyBg(t, '#071226', '#13306A'); tag(t, 2, N); const sh = Math.sin(t * 30) * 3;
      for (let k = 0; k < 4; k++) { const hl = (k === 0 && t > fr && t < la) || (k === 3 && t > la); cart(830 - k * 200 + sh * (k === 3 ? 2 : 0.5), 1150, 0, 1.25, hl ? (k ? MG : CY) : '#4A5670', k === 0 ? 'FRONT' : k === 3 ? 'BACK' : ''); }
      glowLine([[60, 1165], [1020, 1165]], '#FFC53D', 5);
      const bar = (x, pct, at, col) => { if (t < at) return; const p = mE((t - at) / 0.7), h = 4.0 * pct * p; g.save(); g.fillStyle = col; g.shadowColor = col; g.shadowBlur = 30; rrect(x - 90, 1020 - h, 180, h, 16); g.fill(); g.restore();
        text(`${Math.round(pct * p)}%`, x, 990 - h, 'disp', 80, col, { align: 'center' }); };
      bar(830, 16, si, CY); bar(230, 64, sx, MG);
      if (t > sx) rgbText('4× MORE IN THE BACK', 540, 470, 90, t, sx, { color: MG }); else if (t > fr) rgbText('STONES THAT PASSED', 540, 470, 90, t, fr, { color: '#FFFFFF' });
      chip('WARTINGER & MITCHELL, 2016 · MODEL STUDY', 540, 560, t, fr + 0.2, { size: 24, bg: 'rgba(255,255,255,0.85)', fg: BG }); }; }; });

VIS[3] = S(() => { const sh = sw('shaking', 0.4), sl = sw('slide', 1.6), mo = sw('model', 2.8), tr = sw('treatment', 3.8);
  return (K) => { ks(K, [[sh, 'glitch', 0.8], [mo, 'stamp', 1]]);
    return (t) => { const j = t > sh && t < mo ? 8 : 0; g.save(); g.translate(Math.sin(t * 47) * j, Math.cos(t * 39) * j); const P = shot(t, 'xray', { a: [0.5, 0.5, 1.05], b: [0.5, 0.5, 1.15], dur: 5 }); if (!P) noPhoto(t); g.restore();
      tag(t, 3, N); realBadge(t, 0.1, 'REAL X-RAY · KIDNEY STONES');
      if (t > sh && t < mo) rgbText('SHAKE, SHAKE…', 540, 560, 110, t, sh, { color: GOLD, jitter: true });
      if (t > mo) { stampText('MODEL STUDY', 540, 760, t, mo, { size: 90, color: RED2 }); if (t > tr) chip('NOT A TREATMENT', 540, 960, t, tr, { size: 44, bg: RED2, fg: '#FFF' }); } }; }; });

VIS[4] = S(() => { const ig = sw('ig', 0.6), tw = sw('twenty', 2.0);
  return (K) => { ks(K, [[ig, 'ding', 1], [tw, 'boom', 0.6]]);
    return (t) => { bodyBg(t, '#120A00', '#3A2400'); tag(t, 4, N); const p = spring(Math.max(0, t - ig), 200, 14);
      g.save(); g.translate(540, 900); g.scale(p, p); g.rotate(Math.sin(t * 2) * 0.05); g.shadowColor = GOLD; g.shadowBlur = 60; g.fillStyle = GOLD; g.beginPath(); g.arc(0, 0, 200, 0, 6.283); g.fill(); g.shadowBlur = 0;
      g.strokeStyle = '#8A6A1E'; g.lineWidth = 10; g.beginPath(); g.arc(0, 0, 170, 0, 6.283); g.stroke(); text('IG', 0, -10, 'disp', 120, '#5A3E0A', { align: 'center' }); text('NOBEL', 0, 70, 'disp', 56, '#5A3E0A', { align: 'center' }); g.restore();
      burst(t, ig + 0.1, 540, 900); if (t > tw) rgbText('IG NOBEL PRIZE · 2018', 540, 470, 86, t, tw, { color: GOLD });
      if (t > tw) chip('"RESEARCH THAT MAKES YOU LAUGH, THEN THINK"', 540, 560, t, tw + 0.3, { size: 26, bg: 'rgba(255,255,255,0.85)', fg: BG }); }; }; });

VIS[5] = S(() => { const wa = sw('water', 1.0), da = sw('day', 1.9), pa = sw('pain', 3.0), dr = sw('doctor', 3.6);
  return (K) => { ks(K, [[wa, 'splash', 0.8], [da, 'ding', 0.9], [dr, 'pop', 0.9, 700]]);
    return (t) => { bodyBg(t, '#06142A', '#0E3A66'); tag(t, 5, N); const f = clamp((t - wa) / 1.6);
      g.save(); g.translate(540, 900); g.strokeStyle = 'rgba(255,255,255,0.8)'; g.lineWidth = 8; g.beginPath(); g.moveTo(-130, -200); g.lineTo(-100, 200); g.lineTo(100, 200); g.lineTo(130, -200); g.stroke();
      const ly = 200 - 380 * f; g.beginPath(); g.moveTo(-100 - 30 * (200 - ly) / 400, ly); g.quadraticCurveTo(0, ly + Math.sin(t * 6) * 12, 100 + 30 * (200 - ly) / 400, ly); g.lineTo(100, 196); g.lineTo(-100, 196); g.closePath();
      const wg = g.createLinearGradient(0, ly, 0, 200); wg.addColorStop(0, '#6FD3FF'); wg.addColorStop(1, '#1E78D6'); g.fillStyle = wg; g.fill(); g.restore();
      if (t > wa && f < 1) for (let k = 0; k < 4; k++) { const yy = 600 + ((t * 600 + k * 90) % 240); glowDot(540, yy, 10, '#9FE4FF'); }
      rgbText(t > wa ? 'DRINK ENOUGH WATER' : 'PREVENT STONES', 540, 470, 90, t, t > wa ? wa : 0.1, { color: '#6FD3FF' }); if (t > da) chip('EVERY DAY', 540, 560, t, da, { size: 40, bg: '#6FD3FF', fg: BG });
      if (t > dr) chip('STRONG PAIN → SEE A DOCTOR', 540, 1160, t, dr, { size: 36, bg: RED2, fg: '#FFF' }); medNote(t, dr + 0.4, 640); }; }; });
