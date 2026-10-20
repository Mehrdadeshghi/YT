// Wiki Roulette #158 — FOOTBALL: Istanbul 2005 (Liverpool 0–3 down at half-time vs Milan → 3–3 → penalties 3–2).
// No free match footage/photos exist, so the story runs on a live scoreboard + shoot-out grid (GRAPHIC) over real, honestly
// labelled photos: the stadium, Gerrard and Dudek at other games, the real 2005 trophy. No crests or logos.
// Retention: frame-1 impossible result → 0–3 builds on the board → three goals in six minutes (score ticks, timer) →
// 117th-minute double save → shoot-out dots fill up, last one = Shevchenko saved → trophy → binary question.
const N158 = 4, LIV158 = '#E3313B', MIL158 = '#F2F2F2';
const sw158 = (qs, d) => { for (const q of qs) { const v = sw(q, -99); if (v !== -99) return v; } return d; };
const tm158 = ['LIVERPOOL', 'MILAN'], brd158 = { c1: LIV158, c2: MIL158 };

VIS.open = vopen({ ph: 'stad', a: [0.5, 0.55, 1.0], b: [0.5, 0.6, 1.18],
  x: (t) => realBadge(t, 0.3, 'REAL PHOTO · THE STADIUM, ISTANBUL', 1480) });

VIS[0] = S(() => { const fm = sw158(['first'], 1.4), tw = sw158(['twice'], 2.8), br = sw158(['break'], 3.4);
  return (K) => { ks(K, [[0.25, 'whoosh', 0.8], [fm + 0.1, 'hit', 1.1], [tw, 'hit', 1], [tw + 0.45, 'hit', 1.1], ...drop(br + 0.1)]);
    return (t) => { atmosphere(t); shot(t, 'stad', { a: [0.35, 0.5, 1.15], b: [0.45, 0.5, 1.3], dur: 4 }); dimAll(0.55); tag(t, 0, N158);
      realBadge(t, 0.3, 'REAL PHOTO · THE STADIUM');
      const sc = t > tw + 0.45 ? '0 – 3' : t > tw ? '0 – 2' : t > fm ? '0 – 1' : '0 – 0', hit = t > tw + 0.45 ? tw + 0.45 : t > tw ? tw : fm;
      board(t, 0.2, 640, t > br ? 'HALF-TIME' : t > tw ? "45'" : "1'", tm158, sc, hit, brd158);
      if (t > fm) chip('MALDINI · 1ST MINUTE', 540, 960, t, fm, { size: 40, bg: MIL158, fg: BG });
      if (t > tw) chip('CRESPO · CRESPO', 540, 1070, t, tw, { size: 40, bg: MIL158, fg: BG });
      if (t > br + 0.1) stampText('0 – 3', 540, 1290, t, br + 0.1, { size: 150, rot: -0.07, color: RED }); }; }; });

VIS[1] = S(() => { const six = sw158(['six'], 1.0), g1 = sw158(['gerr', 'jerr', 'jar'], 1.9), g3 = sw158(['alon'], 2.9),
    g2 = sw158(['shm', 'smee', 'schm', 'smi'], (g1 + g3) / 2), all = sw158(['all'], g3 + 0.7);
  return (K) => { ks(K, [[0.2, 'whoosh', 0.8], [six, 'ding', 0.9], [g1, 'boom', 1.1], [g2, 'boom', 1.1], [g3, 'boom', 1.2], [all + 0.05, 'hit', 1.3]]);
    return (t) => { atmosphere(t); if (PHOTOS.ger) { const z = 1.08 + 0.05 * t / 4; g.save(); g.translate(540, 960); g.scale(z, z); g.drawImage(blurOf('ger'), -540, -960, W, H); g.restore(); } dimAll(0.25); tag(t, 1, N158);
      const n = (t > g1) + (t > g2) + (t > g3), hit = [null, g1, g2, g3][n];
      board(t, 0.1, 560, n === 3 ? '3 – 3' : "2ND HALF", tm158, `${n} – 3`, hit, Object.assign({ clockCol: n === 3 ? GOLD : RED }, brd158));
      // six-minute timer: fills from the first goal to the third
      if (t > six) { const p = clamp((t - g1 + 0.2) / Math.max(0.3, g3 - g1 + 0.2)); panel(140, 840, 800, 120, 0.78);
        text('6 MINUTES', 180, 915, 'disp', 56, TXT); rrect(580, 891, 320, 18, 9); g.fillStyle = 'rgba(255,255,255,0.15)'; g.fill(); if (p > 0) { rrect(580, 891, Math.max(18, 320 * p), 18, 9); g.fillStyle = GOLD; g.fill(); } }
      ['GERRARD', 'ŠMICER', 'ALONSO'].forEach((s, k) => { const at = [g1, g2, g3][k]; if (t > at) chip('⚽ ' + s, 540, 1060 + k * 110, t, at, { size: 46, bg: LIV158, fg: '#FFF' }); });
      flash(t, g1, 0.3); flash(t, g2, 0.3); flash(t, g3, 0.4); }; }; });

VIS[2] = S(() => { const ext = sw158(['extra'], 0.5), yd = sw158(['yard'], 1.6), s1 = sw158(['save'], 2.4), s2 = sw158(['twice'], s1 + 0.6);
  return (K) => { ks(K, [[0.2, 'whoosh', 0.8], [yd, 'swish', 0.8], [s1, 'boom', 1.1], [s2, 'boom', 1.2], [s2 + 0.05, 'hit', 1.1]]);
    return (t) => { atmosphere(t); const P = shot(t, 'dud', { a: [0.56, 0.56, 1.05], b: [0.56, 0.56, 1.1], dur: 4 }); dimAll(0.3);
      { const gt = g.createLinearGradient(0, 0, 0, 545); gt.addColorStop(0, 'rgba(8,8,10,1)'); gt.addColorStop(0.9, 'rgba(8,8,10,0.96)'); gt.addColorStop(1, 'rgba(8,8,10,0)'); g.fillStyle = gt; g.fillRect(0, 0, W, 545); }   // hides the sponsor boards
      tag(t, 2, N158);
      realBadge(t, 0.3, 'REAL PHOTO · DUDEK, NOT FROM THE FINAL');
      if (t > ext) chip("117TH MINUTE · 3 – 3", 540, 1180, t, ext, { size: 42, bg: GOLD, fg: BG });
      if (t > yd) ruler(t, yd, 300, 1440, 480, 'UNDER 3 YARDS', { color: GOLD });
      if (t > s1) stampText('SAVE!', 330, 820, t, s1, { size: 120, rot: -0.12, color: GOLD });
      if (t > s2) stampText('SAVE!', 720, 1010, t, s2, { size: 120, rot: 0.08, color: GOLD }); }; }; });

// shoot-out order (Wikipedia): Serginho over · Hamann ✓ · Pirlo saved · Cissé ✓ · Tomasson ✓ · Riise saved · Kaká ✓ · Šmicer ✓ · Shevchenko saved
const PENS158 = [[1, 0], [0, 1], [1, 0], [0, 1], [1, 1], [0, 0], [1, 1], [0, 1], [1, 0]];   // [team 0 LIV / 1 MIL, scored]
VIS[3] = S(() => { const pi = sw158(['pirlo'], 1.6), sh = sw158(['shev'], 2.4), cup = sw158(['cup'], 3.2);
  const ts = PENS158.map((_, k) => k < 2 ? pi - 0.7 + k * 0.35 : k === 2 ? pi : k === 8 ? sh : lerp(pi, sh, (k - 2) / 6));
  return (K) => { ks(K, [[0.2, 'whoosh', 0.8], ...ts.map((x, k) => [x, PENS158[k][1] ? 'pop' : 'wrong', 0.8]), [pi, 'boom', 1], [sh, 'boom', 1.2], [cup, 'ding', 1.1]]);
    return (t) => { atmosphere(t); tag(t, 3, N158);
      if (t > cup) { shot(t - cup, 'cup', { box: [240, 830, 600, 520], a: [0.62, 0.5, 1.0], b: [0.62, 0.48, 1.08], dur: 3 }); realBadge(t, cup + 0.1, 'REAL PHOTO · THE 2005 TROPHY', 800); }
      panel(60, 400, 960, 380, 0.85); text(t > sh ? 'PENALTIES · LIVERPOOL WIN 3 – 2' : 'PENALTIES', 540, 470, 'mono', 34, GOLD, { ls: 6, align: 'center' });
      tm158.forEach((n, r) => { const y = 570 + r * 120; text(n, 110, y + 16, 'ui', 44, r ? MIL158 : LIV158);
        let c = 0; PENS158.forEach(([tm, ok], k) => { if (tm !== r) return; const x = 520 + c * 100; c++;
          g.save(); g.lineWidth = 4; g.strokeStyle = 'rgba(255,255,255,0.35)'; g.beginPath(); g.arc(x, y, 34, 0, 6.283); g.stroke(); g.restore();
          if (t > ts[k]) { const s = spring(t - ts[k], 320, 16); g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = ok ? '#3DDC84' : RED; g.beginPath(); g.arc(0, 0, 32, 0, 6.283); g.fill();
            text(ok ? '✓' : '✗', 0, 14, 'ui', 40, '#FFF', { align: 'center' }); g.restore(); } }); });
      if (t > sh && t < cup) stampText('3 – 2', 540, 1120, t, sh, { size: 130, rot: -0.06, color: GOLD }); }; }; });
