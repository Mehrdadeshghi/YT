// COLOR STORIES #1 (#136): mummy brown — paint made from real mummies.
const MB = '#5E3A24';
function swatch(t, t0, x, y, w, h, col, name) { card(t, t0, x, y, w, h, (lt, ww, hh) => { g.fillStyle = col; rrect(24, 24, ww - 48, hh - 110, 18); g.fill(); ptext(name, 30, hh - 40, 34, PRO.txt, { w: 800 }); }); }
VIS.open = (K) => { K(0.05, 'swish', 0.4);
  return (t) => { proBg(t, { glow: 'rgba(160,100,60,0.09)' }); photoCard(t, 0.0, 'mummy', 60, 560, 960, 700, { focus: [0.5, 0.5], zoom: [1.05, 1.18], dur: 3, label: 'Real photo · Egyptian mummy, Vatican Museums' }); proTitle(t, EP.titlePro, 250, 66); }; };
VIS[0] = S(() => (K, Sc) => { const mb = sw('mummy', 0.9), li = sw('literally', 3.2);
  return (t) => { proBg(t, { glow: 'rgba(160,100,60,0.09)' }); swatch(t, mb - 0.1, 240, 520, 600, 560, MB, 'Mummy brown');
    if (t > li) photoCard(t, li, 'tube', 90, 1130, 900, 300, { label: 'Real photo · a tube of mummy brown', focus: [0.5, 0.5] }); }; });
VIS[1] = S(() => (K, Sc) => { const at = Sc.vo[0].at, gr = sw('ground', 1.0), my = sw('myrrh', 3.4), ca = sw('cats', 5.2);
  return (t) => { host(t, 2, at); CAPY = 890;
    card(t, Math.max(0.15, gr - 0.2), 150, 950, 780, 300, (lt, w) => { kicker('The recipe', 40, 60); ptext('Ground-up mummies', 40, 130, 44, PRO.txt, { w: 800 }); if (t > my) ptext('+ white pitch + myrrh', 40, 190, 36, PRO.mute); }, { out: ca - 0.05 });
    if (t > ca) photoCard(t, ca, 'cat', 300, 950, 480, 420, { label: 'Real photo · mummified cat', focus: [0.5, 0.35] }); }; });
VIS[2] = S(() => (K, Sc) => { const po = sw('popular', 2.2), de = sw('delacroix', 4.4);
  return (t) => { proBg(t); if (t < de) { bigText(t, 0.1, '*1700s–1800s*', 540, 760, 96); if (t > po) pill('Hugely popular with painters', 540, 870, t, po, { size: 34 }); }
    else { art(t, 'liberty', [[de, 0.5, 0.5, 1.0], [de + 3, 0.5, 0.55, 1.15]], { cy: 860 }); artInfo(t, de, 'Eugène Delacroix · Liberty Leading the People · 1830', 1300); pill('Delacroix is thought to have used mummy brown', 540, 1380, t, de + 0.4, { size: 26 }); } }; });
VIS[3] = S(() => (K, Sc) => { const at = Sc.vo[0].at, bj = sw('burne', 1.2), bu = sw('burial', 4.6); ks(K, [[bu, 'thump', 0.5]]);
  return (t) => { host(t, 4, at); CAPY = 890;
    photoCard(t, Math.max(0.15, bj - 0.2), 'bj', 150, 950, 780, 330, { label: 'Edward Burne-Jones · The Last Sleep of Arthur in Avalon', focus: [0.5, 0.5], out: bu - 0.05 });
    if (t > bu) card(t, bu, 150, 950, 780, 260, (lt, w) => { kicker('1881', 40, 60); ptext('He buried his tube', 40, 140, 50, PRO.txt, { w: 800 }); ptext('in his garden', 40, 200, 36, PRO.hi); }); }; });
VIS[4] = S(() => (K, Sc) => { const y = sw('1964', 0.6), ru = sw('run', 3.4);
  return (t) => { proBg(t); photoCard(t, 0.0, 'dealer', 240, 430, 600, 740, { label: 'Real photo · a mummy dealer, 19th century', focus: [0.5, 0.4] });
    if (t > y) bigText(t, y, '*1964*', 540, 1270, 96); if (t > ru) pill('"We ran out of mummies"', 540, 1370, t, ru, { size: 36, color: PRO.hi }); }; });
VIS[5] = S(() => (K, Sc) => { const me = sw('medicine', 3.0), cta = Sc.vo[1] ? Sc.vo[1].at : 99;
  return (t) => { const lt = RT ?? t; if (lt > cta - 0.1) { host(t, 7, cta); CAPY = 890; return; }
    proBg(t, { glow: 'rgba(160,100,60,0.09)' }); card(t, 0.05, 240, 560, 600, 560, (l, w, h) => { g.fillStyle = '#2A2016'; rrect(150, 110, 300, 330, 30); g.fill(); g.fillStyle = MB; rrect(170, 230, 260, 190, 20); g.fill(); ptext('MUMIA', w / 2, 200, 44, '#E8D7B8', { align: 'center', w: 800 }); });
    if (t > me) bigText(t, me, 'Mummy powder as *medicine*', 540, 1250, 60); }; });
