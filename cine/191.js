// Wiki Roulette #191 — WHY? #6: why do you never see baby pigeons? (series kit: cine/why.js)
// Frame 1 = WHY? badge + question over two real photos: a city flock (up to 120 million pigeons) vs a squab in its nest →
// REASON 1 hidden nests (real photo: rock dove with its young in a cliff crack; then overpass + Manhattan window cage) →
// REASON 2 the babies stay home ~a month (real footage: squab a few hours old; real photo: parent feeding squabs; day counter,
// weight x2 in 2 days) → REASON 3 they leave adult-sized (two young pigeons that look grown-up, real photos) → comment card + "your next why".
const N191 = 3;

// "IN THE NEST · DAY n" counter (n runs 1 → 30 between t0 and t1)
function days191(t, t0, t1, x, y) { if (t < t0) return; const n = Math.max(1, Math.round(30 * easeOut(clamp((t - t0) / (t1 - t0)))));
  chip(`IN THE NEST · DAY ${n}`, x, y, t, t0, { size: 34, align: 'left', bg: n >= 30 ? GOLD : TXT, fg: BG }); }

// ---------- scenes ----------
VIS.open = (K) => { K(0.15, 'hit', 1.3); K(0.2, 'mute', 1, 0.4); const mi = sw('million', 1.4), ba = sw('baby', 2.6), wh = sw('why', 3.4);
  K(mi, 'tick', 1); K(ba, 'pop', 1); K(wh, 'thump', 1);
  return (t) => { atmosphere(t);
    whyPair(t, { id: 'adult', label: 'UP TO 120 MILLION', at: mi, a: [0.45, 0.45, 1.0], b: [0.45, 0.45, 1.08] },
               { id: 'squab', label: 'A BABY ONE?', at: ba, a: [0.68, 0.55, 1.0], b: [0.68, 0.55, 1.1] }, 790, 1570, { cols: true }); tag(t);
    whyBadge(t, -0.4, 80, 345); whyQ(t, -0.5, EP_RAW.why.q, 625, { size: 104 }); }; };   // badge + question fully drawn on frame 1

VIS[0] = S(() => { const cr = sw('cracks', 1.6), le = sw('ledges', 2.2), co = sw('cover', 2.8), ov = sw('overpasses', 3.8), sk = sw('skyscrapers', 4.6);
  return (K) => { ks(K, [[0.1, 'whoosh', 0.8], [cr, 'tick', 1], [le, 'tick', 1], [co, 'hit', 1], [ov, 'whoosh', 0.7], [sk, 'tick', 1]]);
    return (t) => { atmosphere(t);
      if (t < ov) { const P = shot(t, 'crevice', { box: [40, 690, 1000, 760], a: [0.5, 0.5, 1.0], b: [0.5, 0.5, 1.12], dur: 5 }); if (!P) noPhoto(t);
        realBadge(t, 0.3, 'REAL PHOTO · ROCK DOVE + YOUNG IN A CLIFF CRACK');
        if (t > cr) chip('CRACKS', 250, 780, t, cr, { size: 40, bg: GOLD, fg: BG });
        if (t > le) chip('LEDGES', 540, 780, t, le, { size: 40, bg: GOLD, fg: BG });
        if (t > co) chip('UNDER COVER', 830, 780, t, co, { size: 40, bg: TXT, fg: BG }); }
      else whyPair(t, { id: 'overpass', label: 'UNDER AN OVERPASS, OHIO', at: ov, a: [0.58, 0.47, 1.8], b: [0.56, 0.48, 2.1] },
                      { id: 'nyc2', label: 'SKYSCRAPER WINDOW, NEW YORK', at: sk, a: [0.45, 0.66, 1.2], b: [0.42, 0.68, 1.4] });
      tag(t, 0, N191); whyReason(t, 0.1, 1, 'HIDDEN NESTS.'); }; }; });

VIS[1] = S(() => { const mo = sw('month', 2.0), bo = sw('both', 2.8), mi = sw('milk', 3.4), dbl = sw('doubles', 4.4), tw = sw('two', 5.0);
  return (K) => { ks(K, [[0.1, 'whoosh', 0.8], [mo, 'hit', 1], [bo, 'whoosh', 0.6], [mi, 'ding', 0.9], [dbl, 'hit', 1.1]]);
    return (t) => { atmosphere(t);
      if (t < bo) { const P = clip(t, 'sclip', { box: [40, 690, 1000, 760], a: [0.5, 0.55, 1.0], b: [0.5, 0.55, 1.1], dur: 5 }); if (!P) noPhoto(t);
        realBadge(t, 0.3, 'REAL FOOTAGE · SQUAB, A FEW HOURS OLD'); }
      else { const P = shot(t, 'feed', { box: [40, 690, 1000, 760], a: [0.5, 0.55, 1.0], b: [0.5, 0.6, 1.12], dur: 5, t0: bo }); if (!P) noPhoto(t);
        realBadge(t, bo, 'REAL PHOTO · PARENT FEEDING ITS SQUABS'); }
      tag(t, 1, N191); whyReason(t, 0.1, 2, 'THEY STAY HOME.');
      days191(t, mo - 0.2, mo + 1.2, 80, 1380);
      if (t > mi) chip('PIGEON MILK · MOM + DAD', 540, 780, t, mi, { size: 36, bg: TXT, fg: BG });
      if (t > dbl) { panel(600, 1300, 400, 130, 0.85); rgbPop('WEIGHT ×2', 630, 1370, 54, GOLD, t, dbl);
        label('IN JUST 2 DAYS', 634, 1414, t, tw, { size: 26, color: TXT, ls: 3 }); } }; }; });

VIS[2] = S(() => { const ad = sw('adult', 2.0), se = sw('seen', 3.6), te = sw('tell', 5.0), ev = sw('ever', 6.0), nx = sw('next', 7.6);
  return (K) => { ks(K, [[0.1, 'whoosh', 0.8], [ad, 'hit', 1.1], [se, 'ding', 1], [nx, 'pop', 0.9]]);
    return (t) => { atmosphere(t);
      whyPair(t, { id: 'fledg', label: 'FLEDGLING · JUST OUT, FRANCE', at: 0.4, a: [0.6, 0.45, 1.0], b: [0.6, 0.45, 1.08] },
                 { id: 'juv2', label: 'YOUNG PIGEON · NEBRASKA', at: ad, a: [0.65, 0.4, 1.0], b: [0.65, 0.4, 1.08] }, 690, 1290); tag(t, 2, N191);
      whyReason(t, 0.1, 3, 'ADULT-SIZED.');
      if (t > se && t < ev) { g.save(); g.fillStyle = 'rgba(8,8,10,0.55)'; g.fillRect(0, 880, W, 230); g.restore();
        rgbPop("YOU'VE SEEN THEM.", 80, 980, fit("YOU'VE SEEN THEM.", 'disp', 100, 920), TXT, t, se);
        rgbPop("YOU JUST COULDN'T TELL.", 80, 1080, fit("YOU JUST COULDN'T TELL.", 'disp', 70, 920), GOLD, t, te); }
      whyNext(t, nx, undefined, 1340); }; }; });
