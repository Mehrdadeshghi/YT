// Wiki Roulette #190 — WHY? why is the ocean salty (but rivers aren't)? (series kit: cine/why.js, template #186)
// Frame 1 = WHY? badge + question over a mountain river vs a breaking wave (Santa Cruz) → REASON 1 rain (rainwater running over rock and soil, a river meeting the sea: salt out
// of the ground, carried to the sea) → REASON 2 the sun (salt ponds, San Francisco Bay: water leaves as vapor, salt stays) → proof in
// Utah (Great Salt Lake + its salt crystals: no river out, 1.1 million tons of minerals a year, far saltier than the ocean) →
// REASON 3 volcanoes (black smoker: chloride from volcanoes and seafloor vents) → comment card + "your next why".
const N190 = 4;

// rising vapor dots over a box (decorative, the photo stays the evidence)
function vapor190(t, tIn, x, y, w, h) { if (t < tIn) return; const lt = t - tIn;
  g.save(); for (let k = 0; k < 26; k++) { const ph = (lt * 0.55 + k * 0.137) % 1, px = x + ((k * 97) % w), py = y + h - ph * h;
    g.globalAlpha = 0.7 * Math.sin(ph * Math.PI) * clamp(lt / 0.4); g.fillStyle = '#E8F4FF';
    g.beginPath(); g.arc(px + Math.sin(lt * 2 + k) * 14, py, 7 + (k % 3) * 3, 0, 6.283); g.fill(); } g.restore(); }

// ---------- scenes ----------
VIS.open = (K) => { K(0.15, 'hit', 1.3); K(0.2, 'mute', 1, 0.4); const ri = sw('rivers', 0.3), oc = sw('ocean', 1.2), wh = sw('why', 2.0);
  K(oc, 'pop', 1); K(wh, 'thump', 1);
  return (t) => { atmosphere(t);
    whyPair(t, { id: 'river', label: 'RIVER: FRESH', at: ri, a: [0.5, 0.5, 1.0], b: [0.5, 0.5, 1.06] },
               { id: 'ocean', label: 'OCEAN: 3.5% SALT', at: oc, a: [0.62, 0.45, 1.0], b: [0.62, 0.45, 1.08] }, 790, 1570, { cols: true }); tag(t);
    whyBadge(t, -0.4, 80, 345); whyQ(t, -0.5, EP_RAW.why.q, 625, { size: 104 }); }; };   // badge + question fully drawn on frame 1

VIS[0] = S(() => { const ra = sw('rain', 0.9), gr = sw('ground', 2.6), rv = sw('rivers', 3.2), se = sw('sea', 4.2);
  return (K) => { ks(K, [[0.1, 'whoosh', 0.8], [ra, 'hit', 1], [gr, 'tick', 1], [rv, 'tick', 1], [se, 'thump', 1]]);
    return (t) => { atmosphere(t);
      whyPair(t, { id: 'runoff', label: 'RAINWATER OVER ROCK · W. VIRGINIA', at: ra, a: [0.5, 0.5, 1.0], b: [0.52, 0.5, 1.1] },
                 { id: 'mouth', label: 'RIVER → SEA · VISTULA, POLAND', at: rv, a: [0.45, 0.78, 1.15], b: [0.5, 0.78, 1.25] }); tag(t, 0, N190);
      whyReason(t, 0.1, 1, 'RAIN.');
      if (t > gr) chip('SALT OUT OF THE GROUND', 540, 1065, t, gr, { size: 34, bg: TXT, fg: BG }); }; }; });

VIS[1] = S(() => { const su = sw('sun', 0.9), va = sw('vapor', 2.4), sa = sw('salt', 3.0), be = sw('behind', 3.4);
  return (K) => { ks(K, [[0.1, 'whoosh', 0.8], [su, 'hit', 1], [va, 'whoosh', 0.6], [be, 'thump', 1]]);
    return (t) => { atmosphere(t);
      const P = shot(t, 'ponds', { box: [40, 690, 1000, 760], a: [0.5, 0.45, 1.0], b: [0.5, 0.5, 1.1], dur: 5 }); if (!P) noPhoto(t); tag(t, 1, N190);
      vapor190(t, va, 60, 700, 960, 520);
      realBadge(t, 0.3, 'REAL PHOTO · SALT PONDS, SAN FRANCISCO BAY');
      whyReason(t, 0.1, 2, 'THE SUN.');
      if (t > va) chip('WATER ↑ VAPOR', 300, 770, t, va, { size: 38, bg: TXT, fg: BG });
      if (t > sa) chip('SALT STAYS', 760, 1360, t, sa, { size: 44, bg: GOLD, fg: BG }); }; }; });

VIS[2] = S(() => { const ut = sw('Great', 0.4), fl = sw('flows', 1.6), mi = sw('minerals', 2.3), sl = sw('saltier', 3.6);
  return (K) => { ks(K, [[0.1, 'whoosh', 0.8], [ut, 'hit', 1], [fl, 'tick', 1], [mi, 'tick', 1], [sl, 'thump', 1.1]]);
    return (t) => { atmosphere(t);
      whyPair(t, { id: 'gsl', label: 'GREAT SALT LAKE, UTAH', at: ut, a: [0.5, 0.5, 1.0], b: [0.5, 0.5, 1.08] },
                 { id: 'crystals', label: 'ITS SALT CRYSTALS', at: mi, a: [0.5, 0.5, 1.4], b: [0.5, 0.45, 1.6] }); tag(t, 2, N190);
      whyReason(t, 0.1, null, 'PROOF: UTAH.');
      if (t > fl) chip('NO RIVER FLOWS OUT', 80, 645, t, fl, { size: 30, align: 'left', bg: RED, fg: '#FFF' });
      if (t > mi && t < sl) { const n = (1.1 * easeOut(clamp((t - mi) / 0.8))).toFixed(1); chip(`${n} MILLION TONS OF MINERALS / YEAR`, 540, 1065, t, mi, { size: 32, bg: GOLD, fg: BG }); }
      if (t > sl) chip('FAR SALTIER THAN THE OCEAN', 540, 1065, t, sl, { size: 36, bg: GOLD, fg: BG }); }; }; });

VIS[3] = S(() => { const vo = sw('volcanoes', 0.9), ch = sw('chloride', 1.8), ve = sw('vents', 3.4), dk = sw('know', 4.6), nx = sw('next', 6.4);
  return (K) => { ks(K, [[0.1, 'whoosh', 0.8], [vo, 'hit', 1.1], [ch, 'tick', 1], [ve, 'ding', 0.9], [nx, 'pop', 0.9]]);
    return (t) => { atmosphere(t);
      const P = shot(t, 'smoker', { box: [40, 690, 1000, 760], a: [0.5, 0.4, 1.0], b: [0.5, 0.35, 1.12], dur: 6 }); if (!P) noPhoto(t); tag(t, 3, N190);
      realBadge(t, 0.3, 'REAL PHOTO · BLACK SMOKER VENT, ATLANTIC SEAFLOOR');
      whyReason(t, 0.1, 3, 'VOLCANOES.');
      if (t > ch && t < dk) chip('CHLORIDE', 540, 780, t, ch, { size: 44, bg: TXT, fg: BG });
      if (t > ve && t < dk) chip('VOLCANOES + SEAFLOOR VENTS', 540, 1100, t, ve, { size: 34, bg: GOLD, fg: BG });
      whyNext(t, nx, undefined, 1340); }; }; });
