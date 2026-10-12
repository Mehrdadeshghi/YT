// ART SECRETS #3 (#131): Leonardo's Last Supper — the doorway cut in 1652.
const DOOR = [0.5, 0.88];
VIS.open = (K) => { K(0.05, 'swish', 0.4);
  return (t) => { proBg(t); const P = art(t, 'supper', [[0, 0.5, 0.6, 1.0], [2.3, 0.5, 0.82, 1.9]], { cy: 1000 }); proTitle(t, EP.titlePro, 260, 64);
    if (P) marker(...P(...DOOR), 110, t, 1.1); }; };
VIS[0] = S(() => (K, Sc) => { const le = sw('leonardo', 0.6), mi = sw('milan', 2.6), fi = sw('finished', 3.6);
  return (t) => { proBg(t); if (t < mi) art(t, 'room', [[0, 0.5, 0.45, 1.6], [mi, 0.5, 0.4, 1.8]], { cy: 900 }); else art(t, 'supper', [[mi, 0.5, 0.5, 1.0], [mi + 4, 0.5, 0.45, 1.2]], { cy: 860 });
    if (t < mi) artInfo(t, le, 'Real photo · the dining hall, Santa Maria delle Grazie, Milan', 1380); else artInfo(t, mi, 'Leonardo da Vinci · The Last Supper · 1495–1498', 1260);
    if (t > fi) bigText(t, fi, '*1498*', 540, 1340, 110); }; });
VIS[1] = S(() => (K, Sc) => { const at = Sc.vo[0].at, te = sw('tempera', 2.5), fl = sw('flake', 5.0);
  return (t) => { host(t, 2, at); CAPY = 890;
    card(t, Math.max(0.15, te - 0.2), 150, 950, 780, 300, (lt, w) => { kicker('The experiment', 40, 60); ptext('Tempera on a dry wall', 40, 145, 50, PRO.txt, { w: 800 }); ptext('instead of real fresco (wet plaster)', 40, 200, 28, PRO.mute); }, { out: fl - 0.05 });
    photoCard(t, fl, 'detail', 150, 950, 780, 420, { label: 'Real photo · the painting today', focus: [0.5, 0.5] }); }; });
VIS[2] = S(() => (K, Sc) => { const ye = sw('1556', 0.6), si = sw('sixty', 1.6), mu = sw('muddle', 3.4);
  return (t) => { proBg(t); const P = art(t, 'supper', [[0, 0.5, 0.5, 1.0], [5, 0.5, 0.55, 1.15]], { cy: 720 });
    if (P) { const r = rng(7), n = Math.floor(90 * clamp((t - si) / 2.5)); for (let i = 0; i < n; i++) { const [x, y] = P(r(), 0.1 + r() * 0.85); g.fillStyle = `rgba(${90 + r() * 60},${70 + r() * 40},${50 + r() * 30},${0.25 + r() * 0.35})`; g.beginPath(); g.ellipse(x, y, 6 + r() * 26, 4 + r() * 16, r() * 3, 0, 6.283); g.fill(); } }
    bigText(t, ye, '*1556*', 540, 1130, 110); if (t > si) pill('less than 60 years later', 540, 1215, t, si, { size: 30 }); if (t > mu) bigText(t, mu, '"A muddle of blots"', 540, 1340, 56); }; });
VIS[3] = S(() => (K, Sc) => { const at = Sc.vo[0].at, y = sw('1652', 0.8), dw = sw('doorway', 3.5); ks(K, [[dw, 'thump', 0.7]]);
  return (t) => { host(t, 4, at); CAPY = 890;
    card(t, Math.max(0.15, y - 0.2), 150, 950, 780, 230, (lt, w) => { bigText(lt + 1, 1, '*1652*', w / 2, 150, 110); }, { out: dw - 0.05 });
    if (t > dw) card(t, dw, 150, 950, 780, 420, (lt, w, h) => { const im = PHOTOS.supper; if (!im) return; const s = w / im.width * 1.8; g.drawImage(im, w / 2 - DOOR[0] * im.width * s, h / 2 - 0.78 * im.height * s, im.width * s, im.height * s);
      marker(w / 2, h / 2 + 0.1 * im.height * s, 80, lt, 0.2); }); }; });
VIS[4] = S(() => (K, Sc) => { const ar = sw('arch', 1.2), fe = sw('feet', 3.2); ks(K, [[fe, 'pop', 0.6, 500]]);
  return (t) => { proBg(t); const P = art(t, 'supper', [[0, 0.5, 0.6, 1.4], [ar, 0.5, 0.82, 2.6]], { cy: 860 });
    if (P) { const [x, y] = P(...DOOR); if (t > ar) spotlight(t, ar, x, y, 170); if (t > fe) callout(t, fe, x, y - 150, 760, 430, "Jesus' feet were here"); } }; });
VIS[5] = S(() => (K, Sc) => { const bo = sw('bomb', 0.8), sa = sw('sandbags', 2.0), re = sw('restoration', 3.4), y99 = sw('1999', 5.5), cta = Sc.vo[1] ? Sc.vo[1].at : 99; ks(K, [[bo, 'boom', 0.6]]);
  return (t) => { const lt = RT ?? t; if (lt > cta - 0.1) { host(t, 7, cta); CAPY = 890; return; }
    proBg(t); art(t, 'room', [[0, 0.5, 0.45, 1.5], [6, 0.5, 0.42, 1.7]], { cy: 860 });
    [[bo, '1943 · bomb hits the building'], [sa, 'Sandbags save the wall'], [re, '21-year restoration'], [y99, '1999 · back on display']].forEach(([a, s], i) => { if (t > a) pill(s, 540, 1110 + i * 72, t, a, { size: 30, color: i === 3 ? PRO.acc : PRO.txt }); }); }; });
