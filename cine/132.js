// ART SECRETS #4 (#132): The Night Watch — not night (varnish), trimmed in 1715, knife attack 1911.
VIS.open = (K) => { K(0.05, 'swish', 0.4);
  return (t) => { proBg(t); const P = art(t, 'nw', [[0, 0.5, 0.55, 1.05], [2.4, 0.5, 0.58, 1.5]], { cy: 1000 }); proTitle(t, EP.titlePro, 260, 66);
    g.save(); g.globalAlpha = 0.55 * (1 - clamp((t - 1.0) / 1.2)); g.fillStyle = '#0B0700'; g.fillRect(0, 380, W, 1300); g.restore(); }; };
VIS[0] = S(() => (K, Sc) => { const re = sw('rembrandt', 0.6), ca = sw('captain', 3.6);
  return (t) => { proBg(t); const P = art(t, 'nw', [[0, 0.5, 0.5, 1.0], [ca, 0.5, 0.55, 1.2], [ca + 2, 0.5, 0.58, 2.4]], { cy: 860 });
    artInfo(t, re, 'Rembrandt · The Night Watch · 1642 · Rijksmuseum', 1300); if (P && t > ca) callout(t, ca + 0.3, ...P(0.48, 0.5), 300, 420, 'Captain Frans Banninck Cocq'); }; });
VIS[1] = S(() => (K, Sc) => { const at = Sc.vo[0].at, va = sw('varnish', 1.6), ni = sw('night', 3.4), na = sw('name', 5.0);
  return (t) => { host(t, 2, at); CAPY = 890;
    card(t, Math.max(0.15, va - 0.2), 150, 950, 780, 430, (lt, w, h) => { const im = PHOTOS.nw; if (!im) return; const s = w / im.width; g.drawImage(im, 0, h / 2 - im.height * s / 2, w, im.height * s);
      const cut = w * clamp((t - ni) / 1.6); g.fillStyle = 'rgba(28,18,4,0.72)'; g.fillRect(cut, 0, w - cut, h);           // dark varnish wiped away
      if (t > ni) { g.fillStyle = PRO.hi; g.fillRect(cut - 3, 0, 6, h); } pill(t > ni + 1.6 ? 'Cleaned' : 'Dark varnish', 24, 44, lt, 0.3, { size: 22, bg: 'rgba(6,16,21,0.8)', color: PRO.txt, align: 'left' }); }); }; });
VIS[2] = S(() => (K, Sc) => { const y = sw('seventeen', 1.2), tr = sw('trimmed', 3.4), fo = sw('four', 4.2); ks(K, [[tr, 'scratch', 0.6]]);
  return (t) => { proBg(t); const P = art(t, 'copy', [[0, 0.5, 0.5, 1.0]], { cy: 760 });
    if (P && t > tr) { const [x0, y0] = P(0.1, 0.07), [x1, y1] = P(0.975, 1), a = clamp((t - tr) / 0.6); g.save(); g.fillStyle = `rgba(6,16,21,${0.75 * a})`; const [L, T] = P(0, 0), [R, B] = P(1, 1);
      g.fillRect(L, T, x0 - L, B - T); g.fillRect(x1, T, R - x1, B - T); g.fillRect(x0, T, x1 - x0, y0 - T); g.strokeStyle = PRO.hi; g.lineWidth = 4; g.setLineDash([16, 12]); g.strokeRect(x0, y0, x1 - x0, Math.min(y1, B) - y0); g.setLineDash([]); g.restore(); }
    if (t > y) bigText(t, y, '*1715*', 540, 1290, 100); if (t > fo) pill('Trimmed on all four sides', 540, 1375, t, fo, { size: 32 }); }; });
VIS[3] = S(() => (K, Sc) => { const co = sw('copy', 0.8), le = sw('left', 2.6), nv = sw('never', 4.4);
  return (t) => { proBg(t); const P = art(t, 'copy', [[0, 0.5, 0.5, 1.0], [le, 0.2, 0.55, 1.7]], { cy: 820 });
    g.save(); g.globalCompositeOperation = 'screen'; g.fillStyle = 'rgba(40,34,20,0.35)'; g.fillRect(0, 300, W, 1100); g.restore();
    artInfo(t, co, 'Copy by Gerrit Lundens, before the cut · National Gallery, London', 1300);
    if (P && t > le) { const [x, y] = P(0.05, 0.55); spotlight(t, le + 0.2, x, y, 200); } if (t > nv) bigText(t, nv, '*Never* found', 540, 1390, 70); }; });
VIS[4] = S(() => (K, Sc) => { const at = Sc.vo[0].at, y = sw('1911', 1.6), kn = sw('knife', 3.0), pr = sw('protected', 5.0); ks(K, [[kn, 'scratch', 0.5]]);
  return (t) => { host(t, 5, at); CAPY = 890;
    card(t, Math.max(0.15, y - 0.2), 150, 950, 780, 280, (lt, w) => { kicker('13 January 1911', 40, 60); rich('Attacked with a *knife*', 40, 145, 52, { align: 'left' }); if (t > pr) rich('The varnish *saved it*', 40, 225, 40, { align: 'left', acc: PRO.acc }); }); }; });
VIS[5] = S(() => (K, Sc) => { const gl = sw('glass', 2.6), cta = Sc.vo[1] ? Sc.vo[1].at : 99;
  return (t) => { const lt = RT ?? t; if (lt > cta - 0.1) { host(t, 7, cta); CAPY = 890; return; }
    proBg(t); photoCard(t, 0.05, 'hall', 90, 430, 900, 640, { label: 'Real photo · Rijksmuseum', focus: [0.5, 0.45] }, ); if (t > gl) photoCard(t, gl, 'resto', 150, 820, 780, 560, { label: 'Real photo · restoration in public, 2024' }); }; });
