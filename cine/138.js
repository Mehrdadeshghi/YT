// COLOR STORIES #3 (#138): ultramarine — the blue worth as much as gold.
const UM = '#1F3BA8';
VIS.open = (K) => { K(0.05, 'swish', 0.4);
  return (t) => { proBg(t, { glow: 'rgba(40,70,200,0.12)' }); photoCard(t, 0.0, 'cia', 60, 560, 960, 700, { focus: [0.5, 0.5], zoom: [1.05, 1.2], dur: 3, label: 'Real photo · lapis lazuli' }); proTitle(t, EP.titlePro, 250, 66); }; };
VIS[0] = S(() => (K, Sc) => { const ul = sw('ultramarine', 0.8), be = sw('beyond', 3.0);
  return (t) => { proBg(t, { glow: 'rgba(40,70,200,0.12)' }); card(t, ul - 0.1, 240, 520, 600, 560, (lt, w, h) => { g.fillStyle = UM; rrect(24, 24, w - 48, h - 110, 18); g.fill(); ptext('Ultramarine', 30, h - 40, 36, PRO.txt, { w: 800 }); });
    if (t > be) bigText(t, be, '*ultra marinus* = beyond the sea', 540, 1250, 52); }; });
VIS[1] = S(() => (K, Sc) => { const at = Sc.vo[0].at, la = sw('lapis', 1.2), af = sw('afghanistan', 3.4), it = sw('italian', 5.2);
  return (t) => { host(t, 2, at); CAPY = 890;
    photoCard(t, Math.max(0.15, la - 0.2), 'lapis', 150, 950, 780, 420, { label: 'Real photo · lapis lazuli from Afghanistan', focus: [0.5, 0.5] });
    if (t > it) pill('Afghanistan → Venice → Europe', 540, 1320, t, it, { size: 28, bg: 'rgba(6,16,21,0.9)', color: PRO.txt }); }; });
VIS[2] = S(() => (K, Sc) => { const gr = sw('grinding', 0.5), si = sw('sifting', 1.2), wa = sw('washing', 1.8), te = sw('ten', 4.6);
  return (t) => { proBg(t, { glow: 'rgba(40,70,200,0.1)' }); photoCard(t, 0.0, 'pigment', 240, 430, 600, 500, { label: 'Natural ultramarine pigment', focus: [0.5, 0.5] });
    [['Grind', gr], ['Sift', si], ['Wash', wa]].forEach(([s, a], i) => { if (t > a) pill(s, 300 + i * 240, 1010, t, a, { size: 32 }); });
    if (t > te) bigText(t, te, '≈ *10×* the price of the stone', 540, 1180, 60); }; });
VIS[3] = S(() => (K, Sc) => { const at = Sc.vo[0].at, im = sw('important', 2.6), ma = sw('virgin', 4.2);
  return (t) => { host(t, 4, at); CAPY = 890;
    card(t, Math.max(0.15, im - 0.2), 150, 950, 780, 280, (lt, w) => { kicker('Saved for the most important thing', 40, 60); if (t > ma) { g.fillStyle = UM; rrect(40, 110, 120, 120, 16); g.fill(); ptext('The robes of the', 190, 155, 34, PRO.mute); ptext('Virgin Mary', 190, 210, 50, PRO.txt, { w: 800 }); } }); }; });
VIS[4] = S(() => (K, Sc) => { const ve = sw('vermeer', 0.8), mi = sw('milkmaid', 3.0);
  return (t) => { proBg(t); const P = art(t, 'milkmaid', [[0, 0.5, 0.45, 0.85], [mi, 0.62, 0.62, 1.6]], { cy: 860, w: 1000 });
    artInfo(t, ve, 'Johannes Vermeer · The Milkmaid · c. 1658 · Rijksmuseum', 1400); if (P && t > mi) { const [x, y] = P(0.66, 0.64); spotlight(t, mi, x, y, 190, { col: '#5B7CFF' }); } }; });
VIS[5] = S(() => (K, Sc) => { const y = sw('1826', 0.6), sy = sw('synthetic', 2.0), ch = sw('cheap', 4.2), cta = Sc.vo[1] ? Sc.vo[1].at : 99;
  return (t) => { const lt = RT ?? t; if (lt > cta - 0.1) { host(t, 7, cta); CAPY = 890; return; }
    proBg(t, { glow: 'rgba(40,70,200,0.12)' }); bigText(t, y, '*1826*', 540, 620, 110); if (t > sy) pill('Synthetic ultramarine', 540, 720, t, sy, { size: 34 });
    if (t > ch) { const p = eO((t - ch) / 0.8); card(t, ch, 240, 820, 600, 400, (l, w, h) => { g.fillStyle = UM; rrect(24, 24, w - 48, h - 48, 18); g.fill(); ptext('Gold → cheap', w / 2, h / 2 + 18, 56, '#FFFFFF', { align: 'center', w: 800 }); }); } }; });
