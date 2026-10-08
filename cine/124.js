// Body Facts #6 (#124) — antibiotics don't help your cold. Motion graphics (tech.js + med.js).
const N = 6;
function capsule(x, y, s, ang, a = 1) { g.save(); g.globalAlpha *= a; g.translate(x, y); g.rotate(ang); g.scale(s, s); g.shadowColor = '#FFFFFF'; g.shadowBlur = 20; rrect(-80, -32, 160, 64, 32); g.fillStyle = '#FFFFFF'; g.fill(); g.shadowBlur = 0;
  g.save(); g.beginPath(); g.rect(0, -40, 90, 80); g.clip(); rrect(-80, -32, 160, 64, 32); g.fillStyle = '#3E7BFF'; g.fill(); g.restore(); g.restore(); }
// a body cell (membrane + nucleus); hij 0..1 = virus copies inside
function cell(x, y, r, t, hij = 0) { g.save(); g.translate(x, y); const w = 1 + 0.03 * Math.sin(t * 2); g.fillStyle = 'rgba(255,170,190,0.18)'; g.strokeStyle = '#FF9FB4'; g.lineWidth = 8; g.beginPath(); g.ellipse(0, 0, r * w, r / w * 0.85, 0, 0, 6.283); g.fill(); g.stroke();
  g.fillStyle = '#B4507A'; g.beginPath(); g.arc(-r * 0.2, 0, r * 0.28, 0, 6.283); g.fill(); g.restore(); const n = Math.floor(hij * 9), rr = rng(3); for (let k = 0; k < n; k++) virus(x - r * 0.6 + rr() * r * 1.2, y - r * 0.5 + rr() * r, 16, t + k, MG); }
function icon(kind, x, y, s, col) { g.save(); g.translate(x, y); g.scale(s, s); g.strokeStyle = col; g.fillStyle = col; g.lineWidth = 12; g.lineCap = 'round'; g.lineJoin = 'round';
  if (kind === 'bed') { g.beginPath(); g.moveTo(-90, -50); g.lineTo(-90, 60); g.moveTo(-90, 20); g.lineTo(90, 20); g.lineTo(90, 60); g.stroke(); g.beginPath(); g.arc(-50, -12, 22, 0, 6.283); g.fill(); rrect(-20, -30, 110, 40, 16); g.fill(); text('z', 50, -60, 'disp', 50, col); text('z', 80, -100, 'disp', 36, col); }
  if (kind === 'cup') { g.beginPath(); g.moveTo(-60, -50); g.lineTo(-50, 70); g.lineTo(50, 70); g.lineTo(60, -50); g.stroke(); g.beginPath(); g.arc(80, 10, 30, -1.2, 1.2); g.stroke(); for (let k = -1; k <= 1; k++) { g.beginPath(); g.moveTo(k * 30, -80); g.quadraticCurveTo(k * 30 + 15, -100, k * 30, -125); g.stroke(); } }
  if (kind === 'clock') { g.beginPath(); g.arc(0, 0, 80, 0, 6.283); g.stroke(); g.beginPath(); g.moveTo(0, 0); g.lineTo(0, -50); g.moveTo(0, 0); g.lineTo(38, 20); g.stroke(); }
  g.restore(); }

VIS.open = (K) => { const no = sw('nothing', 1.0), co = sw('cold', 2.0); K(0.05, 'hit', 1.1); ks(K, [[no, 'thump', 0.9], [co, 'wrong', 1]]);
  return (t) => { bodyBg(t, '#08060C', '#1E0A28'); virus(700, 980, 110, t, MG); const hit = no, u = clamp((t - 0.2) / (hit - 0.2)), bx = t < hit ? 160 + 380 * u : 540 - 240 * mE((t - hit) / 0.6), by = t < hit ? 980 : 980 + 300 * mE((t - hit) / 0.6);
    capsule(bx, by, 1.0, t < hit ? 0 : (t - hit) * 6); shock(620, 980, t, hit, 200, '#FFFFFF');
    if (t > co) { g.save(); g.strokeStyle = RED2; g.lineWidth = 22; g.lineCap = 'round'; g.shadowColor = RED2; g.shadowBlur = 30; const q = mE((t - co) / 0.3); g.beginPath(); g.moveTo(560, 820); g.lineTo(560 + 300 * q, 820 + 300 * q); g.moveTo(860, 820); g.lineTo(860 - 300 * q, 820 + 300 * q); g.stroke(); g.restore(); }
    tag(t); hook(t, EP.hook, 400); if (EP.series) chip(EP.series, 80, 300, t, -0.3, { size: 26, align: 'left', bg: MRED, fg: '#FFF' }); }; };

VIS[0] = S(() => { const vi = sw('viruses', 1.4), an = sw('antibiotics', 2.2), ba = sw('bacteria', 3.6);
  return (K) => { ks(K, [[vi, 'pop', 0.9, 500], [an, 'whoosh', 0.7], [ba, 'pop', 0.9, 800]]);
    return (t) => { bodyBg(t, '#08060C', '#1E0A28'); tag(t, 0, N); g.fillStyle = 'rgba(255,255,255,0.1)'; g.fillRect(538, 640, 4, 560);
      if (t > vi) { const a = clamp((t - vi) / 0.4); virus(290, 880, 90, t, MG, a); text('VIRUSES', 290, 1080, 'disp', 54, MG, { align: 'center', alpha: a }); text('COLDS · FLU', 290, 1130, 'mono', 28, '#FFFFFF', { align: 'center', alpha: a }); }
      if (t > ba) { const a = clamp((t - ba) / 0.4); bacterium(790, 880, 170, 0.4, t, LIME, a); text('BACTERIA', 790, 1080, 'disp', 54, LIME, { align: 'center', alpha: a }); }
      if (t > an) { const p = mE((t - an) / 0.8), tx = t > ba ? 790 : 540; capsule(540 + (tx - 540) * p, 700, 0.7, 0); if (t > ba) { text('✓', 920, 760, 'disp', 90, LIME); text('✗', 160, 760, 'disp', 90, RED2); } }
      rgbText(t > ba ? 'ONLY WORKS ON BACTERIA' : t > vi ? 'COLDS = VIRUSES' : 'WHAT CAUSES A COLD?', 540, 470, 96, t, t > ba ? ba : t > vi ? vi : 0.1, { color: t > ba ? LIME : t > vi ? MG : '#FFFFFF' }); }; }; });

VIS[1] = S(() => { const ce = sw('cells', 1.2), vi = sw('viruses', 1.8), hi = sw('hijack', 3.0), no = sw('nothing', 4.4);
  return (K) => { ks(K, [[ce, 'pop', 0.8, 700], [vi, 'whoosh', 0.7], [hi, 'glitch', 0.8], [no, 'wrong', 1]]);
    return (t) => { if (t < vi) { const P = shot(t, 'ecoli', { a: [0.5, 0.5, 1.1], b: [0.5, 0.45, 1.3], dur: 3 }); if (!P) noPhoto(t); tag(t, 1, N); realBadge(t, 0.1, 'REAL MICROSCOPE IMAGE · E. COLI BACTERIA');
        if (t > ce) rgbText('TINY LIVING CELLS', 540, 560, 100, t, ce, { color: LIME }); return; }
      bodyBg(t, '#08060C', '#1E0A28'); tag(t, 1, N); cell(540, 900, 300, t, t > hi ? clamp((t - hi) / 1.2) : 0);
      if (t < hi) { const p = mE((t - vi) / 1.0); virus(540 + 420 * (1 - p) + 0, 600 + 160 * p, 34, t, MG); }
      if (t > no) { const u = clamp((t - no) / 1.4); capsule(-100 + 1280 * u, 900, 0.6, 0, 0.9); chip('NOTHING TO ATTACK', 540, 1180, t, no, { size: 40, bg: RED2, fg: '#FFF' }); }
      rgbText(t > hi ? 'THEY HIJACK YOUR CELLS' : 'VIRUSES: NOT CELLS', 540, 470, 96, t, t > hi ? hi : vi, { color: MG }); }; }; });

VIS[2] = S(() => { const ne = sw('need', 1.4), re = sw('resistant', 2.8);
  return (K) => { ks(K, [[ne, 'zap', 0.8], [re, 'boom', 0.7]]);
    return (t) => { if (t > re + 1.4) { const P = shot(t, 'plate', { a: [0.5, 0.5, 1.05], b: [0.5, 0.5, 1.2], dur: 3, t0: re + 1.4 }); if (!P) noPhoto(t); tag(t, 2, N); realBadge(t, re + 1.45, 'REAL LAB TEST · BACTERIA VS. ANTIBIOTIC DISCS'); rgbText('RESISTANCE', 540, 560, 120, t, re + 1.4, { color: RED2 }); return; }
      bodyBg(t, '#08060C', '#1E0A28'); tag(t, 2, N); const r = rng(9), kill = t > ne ? clamp((t - ne) / 0.8) : 0, grow = t > re ? clamp((t - re) / 1.2) : 0;
      for (let k = 0; k < 24; k++) { const x = 200 + r() * 680, y = 700 + r() * 440, res = k % 8 === 0, a = res ? 1 : 1 - kill; if (a > 0) bacterium(x, y, 70, r() * 3, t, res ? RED2 : LIME, a); }
      if (grow > 0) for (let k = 0; k < 18 * grow; k++) bacterium(220 + ((k * 137) % 640), 720 + ((k * 89) % 420), 70, k, t, RED2, 1);
      if (t > ne && t < ne + 0.8) for (let k = 0; k < 4; k++) capsule(200 + k * 230, 600 + 600 * clamp((t - ne) / 0.8), 0.5, k);
      rgbText(t > re ? 'SURVIVORS TAKE OVER' : 'ANTIBIOTICS YOU DON\'T NEED', 540, 470, 90, t, t > re ? re : 0.1, { color: t > re ? RED2 : '#FFFFFF' }); }; }; });

VIS[3] = S(() => { const ni = sw('nineteen', 0.6), on = sw('one', 2.4), mi = sw('million', 3.6);
  return (K) => { ks(K, [[ni, 'pop', 0.8, 500], ...drop(on, 0.35), [mi, 'boom', 0.8]]);
    return (t) => { const P = shot(t, 'mrsa', { a: [0.5, 0.4, 1.05], b: [0.5, 0.45, 1.2], dur: 6 }); if (!P) noPhoto(t); g.fillStyle = 'rgba(8,6,12,0.45)'; g.fillRect(0, 0, W, H); tag(t, 3, N); realBadge(t, 0.1, 'REAL IMAGE · WHITE BLOOD CELL VS. RESISTANT MRSA');
      if (t > ni) chip('2019 · WORLDWIDE', 540, 560, t, ni, { size: 38, bg: '#FFFFFF', fg: BG });
      if (t > on) { const v = 1.27 * mE((t - on) / 1.2); rgbText(`${v.toFixed(2)} MILLION`, 540, 820, 130, t, on, { color: RED2 }); text('DEATHS DIRECTLY CAUSED', 540, 920, 'mono', 34, '#FFFFFF', { align: 'center' }); }
      if (t > mi) chip('SOURCE: THE LANCET, 2022', 540, 1000, t, mi + 0.2, { size: 24, bg: 'rgba(255,255,255,0.85)', fg: BG }); }; }; });

VIS[4] = S(() => { const dc = sw('prescribes', 1.4), ex = sw('exactly', 2.6), le = sw('leftovers', 4.0);
  return (K) => { ks(K, [[dc, 'ding', 0.9], [ex, 'ding', 0.9], [le, 'wrong', 0.9]]);
    return (t) => { bodyBg(t, '#06140E', '#0E3A24'); tag(t, 4, N); g.save(); g.translate(540, 820); g.rotate(-0.08); g.fillStyle = '#D9DEE6'; rrect(-260, -140, 520, 280, 30); g.fill();
      for (let k = 0; k < 8; k++) { const x = -190 + (k % 4) * 127, y = -60 + Math.floor(k / 4) * 120, used = k < 3; g.fillStyle = used ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.8)'; g.beginPath(); g.ellipse(x, y, 48, 38, 0, 0, 6.283); g.fill(); if (!used) capsule(x, y, 0.4, 0); } g.restore();
      [['✓ ONLY WITH A PRESCRIPTION', dc, LIME], ['✓ EXACTLY AS TOLD', ex, LIME], ['✗ NEVER USE LEFTOVERS', le, RED2]].forEach(([s, at, c], k) => { if (t > at) chip(s, 540, 1040 + k * 72, t, at, { size: 32, bg: c, fg: k === 2 ? '#FFF' : BG }); });
      rgbText('HOW TO TAKE THEM', 540, 470, 110, t, 0.1, { color: '#FFFFFF' }); }; }; });

VIS[5] = S(() => { const re = sw('rest', 0.6), dr = sw('drink', 1.2), ti = sw('time', 2.4);
  return (K) => { ks(K, [[re, 'pop', 0.8, 500], [dr, 'pop', 0.8, 700], [ti, 'ding', 1]]);
    return (t) => { bodyBg(t, '#06101E', '#102A46'); tag(t, 5, N);
      [['bed', 'REST', re, 200], ['cup', 'DRINK', dr, 540], ['clock', 'TIME', ti, 880]].forEach(([k, s, at, x]) => { if (t < at) return; const p = spring(t - at, 260, 16); g.save(); g.translate(x, 860); g.scale(p, p); g.translate(-x, -860); icon(k, x, 860, 1.2, CY); g.restore(); text(s, x, 1040, 'disp', 50, '#FFFFFF', { align: 'center', alpha: clamp((t - at) / 0.3) }); });
      rgbText('GOT A COLD?', 540, 470, 120, t, 0.1, { color: CY }); medNote(t, ti + 0.3, 560); }; }; });
