// Wiki Roulette #168 — FOOTBALL: 2022 World Cup final (Argentina 3–3 France, Mbappé hat-trick, Argentina win 4–2 on penalties).
// Real fan photos from the final itself (CC BY 3.0, Sebas); the sponsor boards in them are blurred out (no logos). Scoreboard,
// last-chance save and shoot-out grid are GRAPHIC. Retention: frame-1 "hat-trick… and lost" → 2–0 and no French shot until 80' →
// two goals in 97 s, 3–2, 3–3 (board ticks + timer) → 15 s left, blocked → shoot-out dots, two French misses → trophy → question.
const N168 = 4, ARG168 = '#75AADB', FRA168 = '#3D6BE0', tm168 = ['ARGENTINA', 'FRANCE'], brd168 = { c1: ARG168, c2: FRA168 };
const sw168 = (qs, d, k = 0) => { for (const q of qs) { const v = sw(q, -99, k); if (v !== -99) return v; } return d; };
const MB168 = ['embap', 'mbap', 'embop', 'bap'];
// photo in a rounded box with a horizontal band (the sponsor boards, v0..v1 of the photo height) blurred away
function pic168(t, id, box, a, b, band, dur = 4) {
  const P = shot(t, id, { box, a, b, dur }); if (!P || !band) return P; const im = PHOTOS[id], [x0, y0] = P(0, band[0]), [x1, y1] = P(1, band[1]), top = P(0, 0)[1], bot = P(0, 1)[1];
  g.save(); rrect(box[0], box[1], box[2], box[3], 30); g.clip(); g.beginPath(); g.rect(x0, y0, x1 - x0, y1 - y0); g.clip();
  g.filter = 'blur(16px)'; g.drawImage(im, x0, top, x1 - x0, bot - top); g.filter = 'none'; g.fillStyle = 'rgba(8,8,10,0.35)'; g.fillRect(x0, y0, x1 - x0, y1 - y0); g.restore();
  return P; }

VIS.open = (K) => { K(0.15, 'hit', 1.3); K(0.2, 'mute', 1, 0.4); const lo = sw168(['lost'], 2.0); K(lo, 'boom', 1.1);
  return (t) => { atmosphere(t); pic168(t, 'mbap', [40, 840, 1000, 600], [0.45, 0.45, 1.0], [0.42, 0.45, 1.12], [0.51, 0.65], 3);
    tag(t); hook(t, EP.hook, 480); realBadge(t, 0.3, 'REAL PHOTO · MBAPPÉ SCORES · THE FINAL', 1490);
    if (t > lo) stampText('3 GOALS. LOST.', 540, 1150, t, lo, { size: 96, rot: -0.06, color: RED }); }; };

VIS[0] = S(() => { const qa = sw168(['qatar'], 0.3), led = sw168(['led'], 1.2), two = sw168(['nil', 'two'], led + 0.5), ei = sw168(['eight'], 3.6);
  return (K) => { ks(K, [[0.2, 'whoosh', 0.8], [led, 'hit', 1], [two, 'hit', 1.1], [ei, 'wrong', 1], [ei + 0.05, 'hit', 1]]);
    return (t) => { atmosphere(t); pic168(t, 'dima', [40, 860, 1000, 560], [0.5, 0.6, 1.0], [0.55, 0.62, 1.15], [0.37, 0.48]); tag(t, 0, N168);
      realBadge(t, 0.3, 'REAL PHOTO · DI MARÍA SCORES · THE FINAL', 1470);
      const sc = t > two ? '2 – 0' : t > led ? '1 – 0' : '0 – 0', hit = t > two ? two : t > led ? led : null;
      board(t, 0.1, 560, t > ei ? "80'" : t > two ? "36'" : t > led ? "23'" : "0'", tm168, sc, hit, brd168);
      if (t > qa && t < ei) chip('QATAR · 18 DEC 2022', 540, 470, t, qa, { size: 34, bg: GOLD, fg: BG });
      if (t > ei) { panel(140, 1050, 800, 170, 0.9); text('FRANCE SHOTS ON GOAL', 540, 1110, 'mono', 32, 'rgba(255,255,255,0.7)', { align: 'center', ls: 3 });
        text('0', 540, 1195, 'disp', 80, RED, { align: 'center' }); stampText('UNTIL 80\'', 540, 1330, t, ei + 0.1, { size: 90, rot: -0.05, color: RED }); } }; }; });

VIS[1] = S(() => { const g1 = sw168(MB168, 0.6), nin = sw168(['ninety'], 1.6), ex = sw168(['extra'], 2.8), me = sw168(['messi'], 3.4),
    g3 = sw168(MB168, me + 0.9, 1), all = sw168(['all'], g3 + 0.8);
  const goals = [[g1, 'MBAPPÉ · PEN'], [nin, 'MBAPPÉ'], [me, 'MESSI'], [g3, 'MBAPPÉ · PEN · HAT-TRICK']];
  return (K) => { ks(K, [[0.2, 'whoosh', 0.8], ...goals.map(([x], k) => [x, 'boom', 1 + k * 0.05]), [all + 0.05, 'hit', 1.3]]);
    return (t) => { atmosphere(t); if (PHOTOS.mbap) { const z = 1.08 + 0.05 * t / 4; g.save(); g.translate(540, 960); g.scale(z, z); g.drawImage(blurOf('mbap'), -540, -960, W, H); g.restore(); } dimAll(0.25); tag(t, 1, N168);
      const n = goals.filter(([x]) => t > x).length, sc = ['2 – 0', '2 – 1', '2 – 2', '3 – 2', '3 – 3'][n], hit = n ? goals[n - 1][0] : null;
      board(t, 0.1, 560, n >= 3 ? 'EXTRA TIME' : t > ex ? 'EXTRA TIME' : "81'", tm168, sc, hit, Object.assign({ clockCol: n === 4 ? GOLD : RED }, brd168));
      if (t > g1 && t < me) { const p = clamp((t - g1) / Math.max(0.3, nin - g1)); panel(140, 840, 800, 120, 0.8);
        text('97 SECONDS', 180, 915, 'disp', 56, TXT); rrect(620, 891, 280, 18, 9); g.fillStyle = 'rgba(255,255,255,0.15)'; g.fill(); if (p > 0) { rrect(620, 891, Math.max(18, 280 * p), 18, 9); g.fillStyle = GOLD; g.fill(); } }
      goals.forEach(([at, s], k) => { if (t > at) chip('⚽ ' + s, 540, 1020 + k * 105, t, at, { size: 42, bg: k === 2 ? ARG168 : FRA168, fg: k === 2 ? BG : '#FFF' }); });
      goals.forEach(([at]) => flash(t, at, 0.3)); }; }; });

// last chance, 123rd minute: Kolo Muani from the edge of the box, Martínez blocks with his left shin (drawn, GRAPHIC)
VIS[2] = S(() => { const fi = sw168(['fifteen'], 0.2), ch = sw168(['chance', 'last'], 1.3), lg = sw168(['leg'], 2.6);
  return (K) => { ks(K, [[0.2, 'whoosh', 0.8], [fi, 'tick', 1], [ch, 'swish', 1], [lg, 'boom', 1.2], [lg + 0.05, 'hit', 1.1]]);
    return (t) => { atmosphere(t); tag(t, 2, N168);
      // pitch from above: goal at the top, penalty box
      const X = 140, Y = 700, Wp = 800, Hp = 720; g.save(); rrect(X, Y, Wp, Hp, 30); g.fillStyle = '#1E6B34'; g.fill(); g.clip();
      for (let k = 0; k < 6; k++) { g.fillStyle = k % 2 ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)'; g.fillRect(X, Y + k * 120, Wp, 120); }
      g.strokeStyle = 'rgba(255,255,255,0.85)'; g.lineWidth = 5; g.strokeRect(X + 100, Y - 5, Wp - 200, 420); g.strokeRect(X + 260, Y - 5, Wp - 520, 150);
      g.lineWidth = 10; g.strokeStyle = '#FFF'; g.beginPath(); g.moveTo(X + 320, Y + 8); g.lineTo(X + 480, Y + 8); g.stroke(); g.restore();
      const sh = [X + 330, Y + 470], gk = [X + 410, Y + 130];
      // shooter (France) and keeper (Argentina)
      const kp = t > ch ? ease(clamp((t - ch) / Math.max(0.3, lg - ch))) : 0;
      g.fillStyle = FRA168; g.beginPath(); g.arc(sh[0], sh[1], 26, 0, 6.283); g.fill(); text('FRANCE', sh[0], sh[1] + 70, 'mono', 26, '#FFF', { align: 'center' });
      const kx = lerp(gk[0], gk[0] - 60, kp), ky = lerp(gk[1], gk[1] + 50, kp); g.fillStyle = '#F2C230'; g.beginPath(); g.arc(kx, ky, 26, 0, 6.283); g.fill();
      g.strokeStyle = '#F2C230'; g.lineWidth = 14; g.lineCap = 'round'; g.beginPath(); g.moveTo(kx, ky); g.lineTo(kx - 70 * kp, ky + 60 * kp); g.stroke();
      text('KEEPER', kx + 70, ky - 10, 'mono', 26, '#FFF');
      if (t > ch) { const p = clamp((t - ch) / Math.max(0.3, lg - ch)), bx = lerp(sh[0], kx - 70, p), by = lerp(sh[1] - 30, ky + 60, p);
        g.save(); g.strokeStyle = 'rgba(255,255,255,0.5)'; g.setLineDash([12, 10]); g.lineWidth = 4; g.beginPath(); g.moveTo(sh[0], sh[1] - 30); g.lineTo(bx, by); g.stroke(); g.restore();
        g.fillStyle = '#FFF'; g.beginPath(); g.arc(bx, by, 14, 0, 6.283); g.fill(); }
      text('GRAPHIC', 920, 1400, 'mono', 22, 'rgba(255,255,255,0.55)', { ls: 3, align: 'right' });
      if (t > fi) { const left = Math.max(0, 15 - Math.floor((t - fi) * 2)); chip(`123' · ${left} SECONDS LEFT`, 540, 520, t, fi, { size: 44, bg: RED, fg: '#FFF' }); }
      if (t > lg) { stampText('BLOCKED!', 540, 1180, t, lg, { size: 130, rot: -0.07, color: GOLD }); flash(t, lg, 0.35); } }; }; });

// shoot-out order (Wikipedia): Mbappé ✓ · Messi ✓ · Coman saved · Dybala ✓ · Tchouaméni wide · Paredes ✓ · Kolo Muani ✓ · Montiel ✓ → 4–2
const PENS168 = [[1, 1], [0, 1], [1, 0], [0, 1], [1, 0], [0, 1], [1, 1], [0, 1]];   // [team 0 ARG / 1 FRA, scored]
VIS[3] = S(() => { const ms = sw168(['miss'], 1.0), li = sw168(['lifts', 'lift'], 2.4);
  const ts = PENS168.map((_, k) => k === 2 ? ms - 0.25 : k === 4 ? ms + 0.15 : k < 2 ? 0.3 + k * 0.3 : lerp(ms + 0.4, li - 0.15, (k - 5) / 2));
  return (K) => { ks(K, [[0.2, 'whoosh', 0.8], ...ts.map((x, k) => [x, PENS168[k][1] ? 'pop' : 'wrong', 0.8]), [li, 'ding', 1.2]]);
    return (t) => { atmosphere(t); tag(t, 3, N168);
      if (t < li) { pic168(t, 'mont', [40, 830, 1000, 600], [0.5, 0.45, 1.0], [0.42, 0.45, 1.15], null); realBadge(t, 0.3, "REAL PHOTO · MONTIEL'S WINNING PENALTY", 1470); }
      else { pic168(t - li, 'troph', [40, 830, 1000, 600], [0.45, 0.4, 1.05], [0.45, 0.38, 1.15], null, 3); realBadge(t, li + 0.1, 'REAL PHOTO · THE TROPHY CEREMONY', 1470); }
      panel(60, 400, 960, 380, 0.88); text(t > ts[7] ? 'PENALTIES · ARGENTINA WIN 4 – 2' : 'PENALTIES', 540, 470, 'mono', 34, GOLD, { ls: 5, align: 'center' });
      tm168.forEach((n, r) => { const y = 570 + r * 120; text(n, 100, y + 16, 'ui', 40, r ? FRA168 : ARG168);
        let c = 0; PENS168.forEach(([tm, ok], k) => { if (tm !== r) return; const x = 560 + c * 100; c++;
          g.save(); g.lineWidth = 4; g.strokeStyle = 'rgba(255,255,255,0.35)'; g.beginPath(); g.arc(x, y, 34, 0, 6.283); g.stroke(); g.restore();
          if (t > ts[k]) { const s = spring(t - ts[k], 320, 16); g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = ok ? '#3DDC84' : RED; g.beginPath(); g.arc(0, 0, 32, 0, 6.283); g.fill();
            text(ok ? '✓' : '✗', 0, 14, 'ui', 40, '#FFF', { align: 'center' }); g.restore(); } }); }); }; }; });
