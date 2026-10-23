// Wiki Roulette #186 — WHY? #1: why are pigeon nests so bad? (series kit: cine/why.js)
// Frame 1 = WHY? badge + question over two real photos side by side: a weaver hanging under its woven nest vs a flimsy pigeon nest →
// REASON 1 cliff birds (real photo: pigeons on a sea cliff, chips SEA CLIFFS / CAVES) → to a pigeon, skyscrapers and overpasses are just
// cliffs (Manhattan window-cage nest, Ohio overpass) → REASON 2 no show-off (real footage: weaver male weaving, ~300 leaf strips; pigeon
// with a twig) → REASON 3 nonstop babies (real photo: parent feeding squabs; PIGEON MILK, up to 6 times a year, MOM + DAD) → comment card
// + "your next why".
const N186 = 4;

// a white pigeon egg at (x, y), pops in at tIn
function egg186(t, tIn, x, y, r = 30) { const s = spring(t - tIn, 320, 14); if (s <= 0.001) return;
  g.save(); g.translate(x, y); g.scale(s, s); g.shadowColor = 'rgba(0,0,0,0.6)'; g.shadowBlur = 16;
  const gr = g.createRadialGradient(-r * 0.3, -r * 0.4, 2, 0, 0, r * 1.3); gr.addColorStop(0, '#FFFFFF'); gr.addColorStop(1, '#D9D2C4');
  g.fillStyle = gr; g.beginPath(); g.ellipse(0, 0, r * 0.78, r, 0, 0, 6.283); g.fill(); g.restore(); }

// ---------- scenes ----------
VIS.open = (K) => { K(0.15, 'hit', 1.3); K(0.2, 'mute', 1, 0.4); const we = sw('weaver', 0.3), pi = sw('pigeons', 1.2), wh = sw('why', 2.0);
  K(pi, 'pop', 1); K(wh, 'thump', 1);
  return (t) => { atmosphere(t);
    whyPair(t, { id: 'wbuild', label: 'WEAVER', at: we, a: [0.47, 0.5, 1.0], b: [0.47, 0.5, 1.06] },
               { id: 'pnest', label: 'PIGEON', at: pi, a: [0.5, 0.45, 1.0], b: [0.48, 0.4, 1.15] }, 790, 1570, { cols: true }); tag(t);
    whyBadge(t, -0.4, 80, 345); whyQ(t, -0.5, EP_RAW.why.q, 625, { size: 104 }); }; };   // badge + question fully drawn on frame 1

VIS[0] = S(() => { const cl = sw('cliff', 1.0), se = sw('sea', 2.6), ca = sw('caves', 3.2);
  return (K) => { ks(K, [[0.1, 'whoosh', 0.8], [cl, 'hit', 1], [se, 'tick', 1], [ca, 'tick', 1]]);
    return (t) => { atmosphere(t);
      const P = shot(t, 'cliff2', { box: [40, 690, 1000, 760], a: [0.55, 0.5, 1.0], b: [0.6, 0.5, 1.12], dur: 5, credit: 'Photo: PikiWiki Israel / CC BY 2.5' }); if (!P) noPhoto(t); tag(t, 0, N186);
      realBadge(t, 0.3, 'REAL PHOTO · PIGEONS ON A SEA CLIFF, ISRAEL');
      whyReason(t, 0.1, 1, 'CLIFF BIRDS.');
      if (t > se) chip('SEA CLIFFS', 330, 770, t, se, { size: 40, bg: GOLD, fg: BG });
      if (t > ca) chip('CAVES', 720, 770, t, ca, { size: 40, bg: TXT, fg: BG }); }; }; });

VIS[1] = S(() => { const sk = sw('skyscrapers', 0.4), ov = sw('overpasses', 1.3), cl = sw('cliffs', 2.6);
  return (K) => { ks(K, [[0.1, 'whoosh', 0.8], [sk, 'tick', 1], [ov, 'tick', 1], [cl, 'hit', 1.1]]);
    return (t) => { atmosphere(t);
      whyPair(t, { id: 'nyc2', label: 'MANHATTAN, NEW YORK', at: sk, a: [0.45, 0.66, 1.2], b: [0.42, 0.68, 1.45] },
                 { id: 'overpass', label: 'HIGHWAY OVERPASS, OHIO', at: ov, a: [0.58, 0.47, 1.8], b: [0.56, 0.48, 2.2] }); tag(t, 1, N186);
      rgbPop('TO A PIGEON:', 80, 470, 105, TXT, t, 0.2); rgbPop('JUST CLIFFS.', 80, 580, 105, GOLD, t, cl); }; }; });

VIS[2] = S(() => { const th = sw('three', 2.2), fe = sw('female', 3.4), st = sw('sticks', 4.6);
  return (K) => { ks(K, [[0.1, 'whoosh', 0.8], [th, 'hit', 1.1], [fe, 'ding', 0.9], [st, 'thump', 1]]);
    return (t) => { atmosphere(t);
      whyPair(t, { id: 'wclip', clip: true, label: 'WEAVER MALE AT WORK', at: 0.4, a: [0.5, 0.3, 1.0], b: [0.5, 0.3, 1.06] },
                 { id: 'twig', label: 'PIGEON: A FEW STICKS', at: st, a: [0.55, 0.5, 1.0], b: [0.57, 0.52, 1.08] }); tag(t, 2, N186);
      whyReason(t, 0.1, 2, 'NO SHOW-OFF.');
      if (t > fe) chip('TO IMPRESS A FEMALE', 80, 645, t, fe, { size: 28, align: 'left', bg: TXT, fg: BG });
      if (t > th && t < st) { const n = Math.round(300 * easeOut(clamp((t - th) / 0.9))); chip(`≈${n} LEAF STRIPS · ONE BY ONE`, 540, 1070, t, th, { size: 34, bg: GOLD, fg: BG }); } }; }; });

VIS[3] = S(() => { const mi = sw('milk', 1.4), si = sw('six', 2.8), bo = sw('both', 3.6), da = sw('dads', 4.6), lz = sw('lazy', 6.0), nx = sw('next', 7.2);
  return (K) => { ks(K, [[0.1, 'whoosh', 0.8], [mi, 'hit', 1.1], [bo, 'tick', 1], [da, 'ding', 1], [nx, 'pop', 0.9]]);
    for (let k = 0; k < 6; k++) K(si + 0.08 * k, 'tick', 0.7);
    return (t) => { atmosphere(t);
      const P = shot(t, 'feed', { box: [40, 690, 1000, 760], a: [0.5, 0.55, 1.0], b: [0.5, 0.6, 1.12], dur: 6 }); if (!P) noPhoto(t); tag(t, 3, N186);
      realBadge(t, 0.3, 'REAL PHOTO · PIGEON FEEDING ITS CHICKS');
      whyReason(t, 0.1, 3, 'NONSTOP BABIES.');
      if (t > mi) chip('PIGEON MILK', 540, 760, t, mi, { size: 44, bg: TXT, fg: BG });
      if (t > bo && t < lz) { chip('MOM ✓', 300, 1020, t, bo, { size: 36, bg: GOLD, fg: BG }); chip('DAD ✓', 780, 1020, t, bo + 0.15, { size: 36, bg: GOLD, fg: BG }); }
      if (t > da && t < lz) chip('EVEN DADS', 780, 935, t, da, { size: 34, bg: RED, fg: '#FFF' });
      if (t > si) { panel(60, 1110, 960, 180, 0.8 * clamp((t - si) / 0.3)); for (let k = 0; k < 6; k++) egg186(t, si + 0.08 * k, 215 + k * 130, 1170, 32);
        label('UP TO 6 TIMES A YEAR', 540, 1262, t, si + 0.5, { color: GOLD, size: 30, align: 'center', ls: 4 }); }
      whyNext(t, nx, undefined, 1340); }; }; });
