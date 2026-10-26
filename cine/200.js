// Wiki Roulette #200 — REEL v2 (E8): is the Yellowstone supervolcano overdue?
// Frame 1 = hook "YELLOWSTONE: / NOT OVERDUE?" over the steaming Grand Prismatic Spring (real photo) → view across the caldera,
// 45 × 28 MILES → NPS caldera map: 3 eruptions, the 3rd 640,000 years ago → USGS ash map, 240 CUBIC MILES →
// timeline graphic (2.1 M · 1.3 M · 640 K · NOW), gaps 600,000–800,000 years → "DUE?" / NO / too few to predict →
// magma graphic 6–8 % molten → "TOO LOW" → comment card over real footage of visitors at Old Faithful.
// Safe zone: everything between y 230 and 1440, nothing key right of x 850 below y 900.
const N200 = 3, BOX200 = [40, 400, 1000, 700];
function graphicBadge200(t, tIn, str, y = 360) { chip('◆ ' + str, 80, y, t, tIn, { size: 24, align: 'left', bg: 'rgba(62,140,255,0.92)', fg: TXT }); }
function hook200(t, tIn) {
  const s = Math.min(fit('YELLOWSTONE:', 'disp', 124, 920), fit('NOT OVERDUE?', 'disp', 124, 920));
  rgbPop('YELLOWSTONE:', 80, 520, s, TXT, t, tIn); rgbPop('NOT OVERDUE?', 80, 520 + s * 1.04, s, GOLD, t, tIn + 0.08);
}
// timeline of the three super-eruptions (graphic): x = 120 (2.1 million years ago) … 980 (now)
const TL200 = [[2.08, '2.1 M'], [1.3, '1.3 M'], [0.64, '640 K']], tx200 = (ma) => 120 + (2.1 - ma) / 2.1 * 840;
function timeline200(t, tIn, y, o = {}) {
  const p = easeOut((t - tIn) / 0.8); g.save(); g.strokeStyle = 'rgba(255,255,255,0.5)'; g.lineWidth = 6; g.beginPath(); g.moveTo(120, y); g.lineTo(lerp(120, 980, p), y); g.stroke(); g.restore();
  TL200.forEach(([ma, s], i) => { const at = tIn + 0.2 + i * 0.25; if (t < at) return; const x = tx200(ma);
    glowDot(x, y, 22 * spring(t - at, 300, 14), '#FF6A2A'); text(s, x, y + 72, 'mono', 30, TXT, { align: 'center', ls: 2 }); });
  if (t > tIn + 1) { chip('NOW', 980 - 20, y - 70, t, tIn + 1, { size: 26, bg: TXT, fg: BG }); }
  if (o.gaps && t > o.gaps) [[0, 1], [1, 2]].forEach(([a, b], i) => { const x0 = tx200(TL200[a][0]), x1 = tx200(TL200[b][0]), lt = t - o.gaps - i * 0.2; if (lt < 0) return;
    g.save(); g.globalAlpha = clamp(lt * 4); g.strokeStyle = GOLD; g.lineWidth = 5; g.beginPath(); g.moveTo(x0, y - 50); g.lineTo(x0, y - 80); g.lineTo(x1, y - 80); g.lineTo(x1, y - 50); g.stroke(); g.restore(); });
}
// magma reservoir (graphic): a mushy body of crystals, only a few percent of it molten
function magma200(t, tIn, cx, cy) {
  const lt = t - tIn; if (lt < 0) return; const p = easeOut(lt / 0.6), r = rng(77);
  g.save(); g.globalAlpha = clamp(lt * 3); g.beginPath(); g.ellipse(cx, cy, 420 * p, 190 * p, 0, 0, 6.283); g.fillStyle = '#3A3530'; g.fill(); g.clip();
  for (let i = 0; i < 260; i++) { const x = cx + (r() - 0.5) * 860, y = cy + (r() - 0.5) * 400, s = 10 + r() * 22, molten = i % 14 === 0;
    g.fillStyle = molten ? `rgba(255,${110 + 40 * Math.sin(t * 3 + i)},40,1)` : `rgba(${120 + r() * 50},${112 + r() * 40},${100 + r() * 30},1)`;
    g.beginPath(); g.arc(x, y, s, 0, 6.283); g.fill(); }
  g.restore(); g.save(); g.strokeStyle = 'rgba(255,140,60,0.7)'; g.lineWidth = 4; g.beginPath(); g.ellipse(cx, cy, 420 * p, 190 * p, 0, 0, 6.283); g.stroke(); g.restore();
}

// ---------- open: hook + stake ----------
VIS.open = (K) => { K(0.1, 'hit', 1.2); const no = sw('not', 1.5), ev = sw('even', 2.6), fo = sw('forty', 3.6);
  K(no, 'thump', 1); K(ev, 'whoosh', 0.7); K(fo, 'hit', 1);
  return (t) => { atmosphere(t);
    if (t < ev) { const P = shot(t, 'prism', { box: [40, 700, 1000, 460], a: [0.5, 0.6, 1.0], b: [0.45, 0.62, 1.15], dur: 3 }); if (!P) noPhoto(t);
      realBadge(t, -0.5, 'REAL PHOTO · GRAND PRISMATIC SPRING'); }
    else { const P = shot(t, 'rim', { box: [40, 700, 1000, 460], a: [0.5, 0.45, 1.0], b: [0.5, 0.42, 1.1], dur: 3, t0: ev }); if (!P) noPhoto(t);
      realBadge(t, ev, 'REAL PHOTO · VIEW ACROSS THE CALDERA');
      ruler(t, fo, 90, 1000, 700, '45 × 28 MILES', { size: 36 }); }
    tag(t); hook200(t, -0.6); }; };

// ---------- scene 1: three eruptions, the last one ----------
VIS[0] = S(() => { const th = sw('three', 0.3), la = sw('last', 2.9), si = sw('six', 3.7), tr = sw('threw', 5.7), cu = sw('cubic', 7.0);
  return (K) => { ks(K, [[0.1, 'whoosh', 0.8], [th, 'hit', 1], [la, 'tick', 1], [si, 'hit', 1], [tr, 'whoosh', 0.8], [cu, 'hit', 1.1]]);
    return (t) => { atmosphere(t);
      if (t < tr) { const P = shot(t, 'calmap', { box: BOX200, a: [0.45, 0.5, 1.0], b: [0.5, 0.45, 1.12], dur: 6 }); if (!P) noPhoto(t);
        graphicBadge200(t, 0.2, 'GRAPHIC · NPS MAP OF THE CALDERAS');
        if (P) { [[0.09, 0.73, '2'], [0.36, 0.8, '1'], [0.47, 0.5, '3']].forEach(([u, v, n], i) => { const at = th + 0.15 * i; if (t < at) return; const [x, y] = P(u, v);
          chip(n, x, y, t, at, { size: 40, bg: '#FF6A2A', fg: TXT }); });
          if (t > si) { const [x, y] = P(0.47, 0.42); ring(t, si, x, y, 170); } }
        if (t > si) { panel(60, 950, 700, 130, 0.86); rgbPop('640,000 YEARS AGO', 90, 1040, fit('640,000 YEARS AGO', 'disp', 70, 640), GOLD, t, si); } }
      else { const P = shot(t, 'ash', { box: BOX200, a: [0.35, 0.45, 1.0], b: [0.35, 0.45, 1.1], dur: 3, t0: tr }); if (!P) noPhoto(t);
        graphicBadge200(t, tr, 'GRAPHIC · USGS ASH MAP');
        if (t > cu) { panel(60, 930, 520, 160, 0.86); rgbPop('240 MI³', 90, 1045, 110, GOLD, t, cu); label('OF ROCK AND ASH', 94, 1078, t, cu + 0.3, { size: 24 }); } }
      tag(t, 0, N200); }; }; });

// ---------- scene 2: gaps, due?, NO ----------
VIS[1] = S(() => { const ga = sw('gaps', 0.1), si = sw('six', 1.1), so = sw('so', 3.0), no = sw('no', 3.8), th = sw('three', 4.5), fe = sw('few', 5.5);
  return (K) => { ks(K, [[0.1, 'whoosh', 0.8], [si, 'hit', 1], [so, 'tick', 1], [no, 'boom', 1.1], [fe, 'hit', 1]]);
    return (t) => { atmosphere(t, { x: W / 2, y: 800, r: 900, c: 'rgba(255,106,42,0.12)' });
      graphicBadge200(t, 0.1, 'GRAPHIC · THE 3 SUPER-ERUPTIONS');
      timeline200(t, 0.1, 760, { gaps: si });
      if (t > si && t < so) { rgbPop('600,000–800,000', 80, 560, fit('600,000–800,000', 'disp', 100, 920), GOLD, t, si); label('YEARS BETWEEN THEM', 84, 615, t, si + 0.3, { size: 30 }); }
      if (t > so && t < no) rgbPop('DUE?', 80, 600, 170, TXT, t, so);
      if (t > no) stampText('NO', 300, 560, t, no, { size: 150, rot: -0.08 });
      if (t > th) { panel(60, 960, 760, 140, 0.86); rgbPop('TOO FEW TO PREDICT', 90, 1050, fit('TOO FEW TO PREDICT', 'disp', 70, 700), GOLD, t, fe - 0.3); }
      tag(t, 1, N200); }; }; });

// ---------- scene 3: magma 6–8 % molten + the ONE ask ----------
VIS[2] = S(() => { const ma = sw('magma', 0.2), si = sw('six', 1.4), mo = sw('molten', 2.4), lo = sw('low', 4.7), wo = sw('would', 6.6);
  return (K) => { ks(K, [[0.1, 'whoosh', 0.8], [si, 'hit', 1], [mo, 'tick', 1], [lo, 'thump', 1], [wo, 'whoosh', 0.7]]);
    return (t) => { atmosphere(t);
      if (t < wo) { graphicBadge200(t, 0.1, 'GRAPHIC · THE MAGMA BELOW (NOT TO SCALE)');
        magma200(t, ma, 470, 800);
        if (t > si) { rgbPop('6–8% MOLTEN', 80, 560, fit('6–8% MOLTEN', 'disp', 130, 920), GOLD, t, si); }
        if (t > lo) { panel(60, 960, 760, 140, 0.88); rgbPop('TOO LOW', 90, 1035, 70, TXT, t, lo); label('FOR A SUPER-ERUPTION', 94, 1078, t, lo + 0.3, { size: 26 }); } }
      else { const P = clip(t, 'ofclip', { box: [40, 400, 1000, 700], a: [0.5, 0.5, 1.0], b: [0.5, 0.5, 1.08], dur: 4, t0: wo }); if (!P) noPhoto(t);
        footBadge(t, wo, 'REAL FOOTAGE · OLD FAITHFUL, YELLOWSTONE'); }
      tag(t, 2, N200); }; }; });
