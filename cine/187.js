// Wiki Roulette #187 — WHY? #2: why are flamingos pink? (series kit: cine/why.js, template #186)
// Frame 1 = WHY? badge + question over a grey fluffy chick vs a pink adult → REASON 1 you are what you eat (real footage: filter-feeding
// in Walvis Bay + brine shrimp; CAROTENOIDS, liver → pink) → REASON 2 pink = healthy (bright Caribbean flamingo + preening = "make-up")
// → REASON 3 they feed it away (real photo: chick fed crop milk; MOM + DAD, RED MILK, looks like blood, parents turn pale)
// → comment card + "your next why".
const N187 = 3;

// a pink → pale colour swatch bar (parents lose colour while feeding)
function fade187(t, tIn, x, y, w, h) { const k = clamp((t - tIn) / 1.2); if (t < tIn) return;
  g.save(); rrect(x, y, w, h, h / 2); const gr = g.createLinearGradient(x, 0, x + w, 0);
  gr.addColorStop(0, '#FF5A8A'); gr.addColorStop(1, '#F6E7EA'); g.fillStyle = gr; g.globalAlpha = 0.95 * clamp((t - tIn) / 0.3); g.fill();
  const px = x + 14 + (w - 28) * easeOut(k); g.globalAlpha = 1; g.fillStyle = '#FFF'; g.shadowColor = 'rgba(0,0,0,0.6)'; g.shadowBlur = 10;
  g.beginPath(); g.arc(px, y + h / 2, h * 0.62, 0, 6.283); g.fill(); g.restore(); }

// ---------- scenes ----------
VIS.open = (K) => { K(0.15, 'hit', 1.3); K(0.2, 'mute', 1, 0.4); const ba = sw('baby', 0.3), ad = sw('adults', 1.2), wh = sw('why', 2.0);
  K(ad, 'pop', 1); K(wh, 'thump', 1);
  return (t) => { atmosphere(t);
    whyPair(t, { id: 'chick', label: 'CHICK', at: ba, a: [0.6, 0.45, 1.0], b: [0.6, 0.42, 1.08] },
               { id: 'adult2', label: 'ADULT', at: ad, a: [0.5, 0.45, 1.0], b: [0.5, 0.4, 1.1] }, 790, 1570, { cols: true }); tag(t);
    whyBadge(t, -0.4, 80, 345); whyQ(t, -0.5, EP_RAW.why.q, 625, { size: 104 }); }; };   // badge + question fully drawn on frame 1

VIS[0] = S(() => { const sh = sw('shrimp', 1.8), ca = sw('carotenoids', 3.6), li = sw('liver', 4.6), pk = sw('pink', 5.4);
  return (K) => { ks(K, [[0.1, 'whoosh', 0.8], [sh, 'tick', 1], [ca, 'hit', 1], [pk, 'ding', 1]]);
    return (t) => { atmosphere(t);
      whyPair(t, { id: 'feedclip', clip: true, label: 'FILTER-FEEDING, NAMIBIA', at: 0.4, a: [0.42, 0.33, 1.25], b: [0.68, 0.36, 1.25] },
                 { id: 'shrimp2', label: 'BRINE SHRIMP', at: sh, a: [0.5, 0.5, 1.0], b: [0.5, 0.5, 1.1] }); tag(t, 0, N187);
      whyReason(t, 0.1, 1, 'YOU ARE WHAT YOU EAT.');
      if (t > ca) chip('CAROTENOIDS', 540, 1070, t, ca, { size: 40, bg: GOLD, fg: BG });
      if (t > li) chip('LIVER → PINK', 540, 1150, t, li, { size: 34, bg: '#FF5A8A', fg: '#FFF' }); }; }; });

VIS[1] = S(() => { const pa = sw('pale', 1.6), mt = sw('mate', 3.8), mk = sw('make', 5.4);
  return (K) => { ks(K, [[0.1, 'whoosh', 0.8], [pa, 'tick', 1], [mt, 'ding', 0.9], [mk, 'hit', 1.1]]);
    return (t) => { atmosphere(t);
      whyPair(t, { id: 'milk3', label: 'BRIGHT PINK', at: 0.4, a: [0.62, 0.45, 1.0], b: [0.62, 0.42, 1.1] },
                 { id: 'preen', label: 'PREENING = "MAKE-UP"', at: mk, a: [0.5, 0.4, 1.0], b: [0.5, 0.38, 1.1] }); tag(t, 1, N187);
      whyReason(t, 0.1, 2, 'PINK = HEALTHY.');
      if (t > pa && t < mk) chip('PALE = SICK OR STARVING', 540, 1070, t, pa, { size: 32, bg: TXT, fg: BG });
      if (t > mt && t < mk) chip('BRIGHT PINK WINS A MATE', 540, 1150, t, mt, { size: 32, bg: '#FF5A8A', fg: '#FFF' }); }; }; });

VIS[2] = S(() => { const mo = sw('mom', 1.4), re = sw('red', 2.4), bl = sw('blood', 3.6), pa = sw('pale', 4.6), nx = sw('next', 8.0);
  return (K) => { ks(K, [[0.1, 'whoosh', 0.8], [mo, 'tick', 1], [re, 'hit', 1.1], [bl, 'thump', 1], [pa, 'ding', 1], [nx, 'pop', 0.9]]);
    return (t) => { atmosphere(t);
      const P = shot(t, 'milk', { box: [40, 690, 1000, 760], a: [0.5, 0.42, 1.0], b: [0.5, 0.4, 1.12], dur: 7 }); if (!P) noPhoto(t); tag(t, 2, N187);
      realBadge(t, 0.3, 'REAL PHOTO · CHICK FED CROP MILK, ZOO BASEL');
      whyReason(t, 0.1, 3, 'THEY FEED IT AWAY.');
      if (t > mo && t < pa) { chip('MOM ✓', 300, 760, t, mo, { size: 36, bg: GOLD, fg: BG }); chip('DAD ✓', 780, 760, t, mo + 0.15, { size: 36, bg: GOLD, fg: BG }); }
      if (t > re && t < pa) chip('RED MILK', 540, 860, t, re, { size: 44, bg: '#D7263D', fg: '#FFF' });
      if (t > bl && t < pa) chip('LOOKS LIKE BLOOD. ISN\'T.', 540, 950, t, bl, { size: 32, bg: TXT, fg: BG });
      if (t > pa) { panel(60, 1110, 960, 180, 0.8 * clamp((t - pa) / 0.3)); fade187(t, pa + 0.1, 140, 1160, 800, 36);
        label('PARENTS TURN PALE', 540, 1262, t, pa + 0.3, { color: GOLD, size: 30, align: 'center', ls: 4 }); }
      whyNext(t, nx, undefined, 1340); }; }; });
