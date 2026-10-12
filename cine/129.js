// ART SECRETS #1 (#129): Holbein's Ambassadors — the anamorphic skull. Pro look + art host.
// the stretched skull "un-stretches" when the viewer looks from the side (we animate the anamorphosis back)
function skullMorph(t, t0, x, y, w) { const im = PHOTOS.skull; if (!im) return; const p = eO((t - t0) / 1.4);
  g.save(); g.translate(x, y); g.rotate(lerp(-0.42, 0, p)); g.scale(lerp(3.2, 1, p), lerp(0.28, 1, p)); const s = w / im.width; g.globalAlpha *= clamp((t - t0) / 0.2);
  g.drawImage(im, -im.width * s / 2, -im.height * s / 2, im.width * s, im.height * s); g.restore(); }
VIS.open = (K) => { K(0.05, 'swish', 0.4);
  return (t) => { proBg(t); const P = art(t, 'amb', [[0, 0.5, 0.5, 0.95], [2.5, 0.47, 0.72, 1.2]], { cy: 1120 });
    proTitle(t, EP.titlePro, 250, 66); if (P) { const [x, y] = P(0.47, 0.86); marker(x, y, 70, t, 0.9); } }; };
VIS[0] = S(() => (K, Sc) => { const ho = sw('holbein', 0.9), tw = sw('two', 2.4);
  return (t) => { proBg(t); const P = art(t, 'amb', [[0, 0.5, 0.45, 1.0], [tw, 0.5, 0.45, 1.0], [tw + 2, 0.5, 0.3, 1.35]], { cy: 830 });
    artInfo(t, ho, 'Hans Holbein the Younger · The Ambassadors · 1533 · National Gallery, London');
    if (P && t > tw) { callout(t, tw + 0.2, ...P(0.22, 0.25), 260, 380, 'Jean de Dinteville, 29'); callout(t, tw + 0.5, ...P(0.85, 0.2), 800, 330, 'Georges de Selve, 25'); } }; });
VIS[1] = S(() => (K, Sc) => { const at = Sc.vo[0].at, fl = sw('floor', 1.2), st = sw('stain', 3.0);
  return (t) => { host(t, 2, at); CAPY = 890;
    card(t, Math.max(0.15, fl - 0.2), 150, 950, 780, 420, (lt, w, h) => { const im = PHOTOS.amb; if (!im) return; const s = w / im.width * 2.2;
      g.drawImage(im, w / 2 - 0.47 * im.width * s, h / 2 - 0.86 * im.height * s, im.width * s, im.height * s); marker(w / 2, h / 2, 90, lt, 0.4);
      if (t > st) bigText(t, st, '*Not* a stain', w / 2, h - 40, 46); }); }; });
VIS[2] = S(() => (K, Sc) => { const sd = sw('side', 1.0), sk = sw('skull', 3.0); ks(K, [[sd, 'swish', 0.5], [sk, 'ding', 0.7]]);
  return (t) => { proBg(t, { glow: 'rgba(255,159,28,0.06)' });
    if (t < sd + 0.2) { const P = art(t, 'amb', [[0, 0.47, 0.86, 2.4]], { cy: 900 }); }
    else { card(t, sd, 90, 470, 900, 880, (lt, w, h) => { g.fillStyle = '#0A0F12'; g.fillRect(0, 0, w, h); skullMorph(t, sd + 0.15, w / 2, h / 2, 640); }); }
    if (t > sk) bigText(t, sk, 'A perfect human *skull*', 540, 1420, 58); }; });
VIS[3] = S(() => (K, Sc) => { const at = Sc.vo[0].at, an = sw('anamorphosis', 1.2), dr = sw('door', 3.5), de = sw('death', 6.0);
  return (t) => { host(t, 4, at); CAPY = 890;
    card(t, Math.max(0.15, an - 0.1), 150, 950, 780, 300, (lt, w) => { kicker('The trick', 40, 60); rich('*Anamorphosis*', 40, 150, 64, { align: 'left' }); ptext('A distorted image that only works from one angle', 40, 215, 26, PRO.mute); }, { out: dr - 0.1 });
    photoCard(t, dr, 'tube', 230, 950, 620, 420, { label: 'Real photo · viewing the skull', focus: [0.5, 0.45] }); }; });
VIS[4] = S(() => (K, Sc) => { const cr = sw('crucifix', 1.4), co = sw('corner', 3.5); ks(K, [[cr, 'pop', 0.6, 600]]);
  return (t) => { proBg(t); const P = art(t, 'amb', [[0, 0.5, 0.5, 1.0], [cr, 0.15, 0.15, 2.2]], { cy: 830 });
    if (P && t > co) { const [x, y] = P(0.012, 0.03); spotlight(t, co, Math.max(x, 60), Math.max(y, 60), 80); }
    if (t > cr) photoCard(t, cr + 0.3, 'cross', 300, 900, 480, 470, { label: 'Detail · the hidden crucifix', focus: [0.5, 0.5] }); }; });
VIS[5] = S(() => (K, Sc) => { const mm = sw('memento', 0.6), di = sw('die', 2.2), cta = Sc.vo[1] ? Sc.vo[1].at : 99;
  return (t) => { const lt = RT ?? t; if (lt > cta - 0.1) { host(t, 7, cta); CAPY = 890; return; }
    proBg(t); art(t, 'amb', [[0, 0.47, 0.75, 1.0], [4, 0.47, 0.6, 0.85]], { cy: 760 });
    if (t > mm) bigText(t, mm, '*Memento mori*', 540, 1300, 90); if (t > di) bigText(t, di, 'Remember, you will die', 540, 1385, 40, { color: PRO.mute }); }; });
