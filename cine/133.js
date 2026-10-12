// ART SCANDALS #1 (#133): the Isabella Stewart Gardner Museum theft, 1990.
VIS.open = (K) => { K(0.05, 'swish', 0.4); K(1.0, 'thump', 0.5);
  return (t) => { proBg(t); photoCard(t, 0.0, 'frames', 60, 520, 960, 860, { focus: [0.55, 0.3], zoom: [1.1, 1.25], dur: 3 }); proTitle(t, EP.titlePro, 250, 60);
    if (t > 1.0) pill('Real photo · the empty frames, still on the wall', 540, 1440, t, 1.0, { size: 24 }); }; };
VIS[0] = S(() => (K, Sc) => { const ma = sw('march', 0.5), po = sw('police', 3.6), ga = sw('gardner', 5.6);
  return (t) => { proBg(t, { glow: 'rgba(62,123,255,0.08)' }); bigText(t, ma, 'March 18, *1990*', 540, 560, 80); pill('Boston · in the middle of the night', 540, 650, t, ma + 0.3, { size: 30 });
    if (t > po) card(t, po, 190, 760, 700, 520, (lt, w, h) => { const im = PHOTOS.sketch; if (im) { const s = Math.max(w / im.width, (h - 80) / im.height); g.drawImage(im, w / 2 - im.width * s / 2, 0, im.width * s, im.height * s); }
      g.fillStyle = 'rgba(6,16,21,0.85)'; g.fillRect(0, h - 80, w, 80); ptext('FBI sketches · men dressed as police', w / 2, h - 28, 26, PRO.txt, { align: 'center' }); });
    if (t > ga) pill('Isabella Stewart Gardner Museum', 540, 1360, t, ga, { size: 30 }); }; });
VIS[1] = S(() => (K, Sc) => { const at = Sc.vo[0].at, le = sw('let', 0.6), ba = sw('basement', 3.0), du = sw('duct', 4.2);
  return (t) => { host(t, 2, at); CAPY = 890;
    card(t, Math.max(0.15, le - 0.1), 150, 950, 780, 300, (lt, w) => { kicker('Inside the museum', 40, 60); ptext('Guards tied up', 40, 140, 54, PRO.txt, { w: 800 }); if (t > ba) ptext('in the basement', 40, 200, 36, PRO.hi);
      if (t > du) pill('Over an hour inside', w - 40, 60, lt, du - (t - lt), { size: 22, align: 'right' }); }); }; });
VIS[2] = S(() => (K, Sc) => { const th = sw('thirteen', 1.0), re = sw('rembrandt', 2.6), co = sw('concert', 3.8), mv = sw('valuable', 5.4);
  return (t) => { proBg(t); if (t > th && t < re) bigText(t, th, '*13* works stolen', 540, 900, 110);
    if (t > re && t < co) { art(t, 'storm', [[re, 0.5, 0.45, 0.72], [co, 0.5, 0.4, 0.8]], { cy: 860 }); artInfo(t, re, 'Rembrandt · The Storm on the Sea of Galilee · stolen', 1400); }
    if (t > co) { art(t, 'concert', [[co, 0.5, 0.5, 0.75], [co + 4, 0.5, 0.45, 0.85]], { cy: 860 }); artInfo(t, co, 'Vermeer · The Concert · stolen', 1400); if (t > mv) pill('The most valuable missing painting in the world', 540, 1470, t, mv, { size: 26, color: PRO.hi }); } }; });
VIS[3] = S(() => (K, Sc) => { const at = Sc.vo[0].at, fbi = sw('fbi', 1.0), fi = sw('five', 2.0), bi = sw('biggest', 4.6); ks(K, [[fi, 'coin', 0.5]]);
  return (t) => { host(t, 4, at); CAPY = 890;
    card(t, Math.max(0.15, fbi - 0.1), 150, 950, 780, 300, (lt, w) => { kicker('FBI estimate, 2000', 40, 60); if (t > fi) counter(t, fi, 1.2, 1e6, 500e6, w / 2, 170, 100, (n) => '$' + Math.round(n / 1e6) + 'M');
      if (t > bi) ptext('Biggest museum robbery in history', w / 2, 250, 30, PRO.hi, { align: 'center' }); }); }; });
VIS[4] = S(() => (K, Sc) => { const wi = sw('will', 1.2), fr = sw('frames', 4.6);
  return (t) => { proBg(t); photoCard(t, 0.0, 'court', 90, 430, 900, 560, { label: 'Real photo · the museum courtyard', focus: [0.5, 0.5] }, );
    if (t > wi) card(t, wi, 150, 1030, 780, 170, (lt, w) => { ptext('Her will: nothing may be changed', w / 2, 100, 40, PRO.txt, { align: 'center' }); });
    if (t > fr) photoCard(t, fr, 'rframes', 60, 420, 960, 820, { label: 'Real photo · the empty Rembrandt frames', focus: [0.5, 0.5] }); }; });
VIS[5] = S(() => (K, Sc) => { const te = sw('ten', 1.2), no = sw('nobody', 3.4), cta = Sc.vo[1] ? Sc.vo[1].at : 99; ks(K, [[te, 'coin', 0.5]]);
  return (t) => { const lt = RT ?? t; if (lt > cta - 0.1) { host(t, 7, cta); CAPY = 890; return; }
    proBg(t); card(t, 0.05, 150, 560, 780, 420, (l, w) => { kicker('Reward', 40, 60); if (t > te) counter(t, te, 1.0, 1e5, 10e6, w / 2, 230, 130, (n) => '$' + (n / 1e6).toFixed(n < 1e6 ? 1 : 0) + 'M'); if (t > no) ptext('Nobody has ever been charged', w / 2, 340, 36, PRO.hi, { align: 'center' }); }); }; });
