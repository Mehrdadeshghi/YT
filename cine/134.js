// ART SCANDALS #2 (#134): Han van Meegeren, the forger who fooled Göring.
VIS.open = (K) => { K(0.05, 'swish', 0.4);
  return (t) => { proBg(t); photoCard(t, 0.0, 'painting', 60, 560, 960, 760, { focus: [0.45, 0.4], zoom: [1.05, 1.2], dur: 3, label: 'Real photo · Han van Meegeren painting a "Vermeer", 1945' }); proTitle(t, EP.titlePro, 250, 64); }; };
VIS[0] = S(() => (K, Sc) => { const ha = sw('han', 0.4), ig = sw('ignored', 2.6), fo = sw('forging', 3.8);
  return (t) => { proBg(t); photoCard(t, 0.0, 'walk', 90, 420, 900, 700, { label: 'Real photo · Han van Meegeren, 1947', focus: [0.3, 0.4] }, );
    if (t > ig) pill('Ignored by the critics', 540, 1190, t, ig, { size: 32 }); if (t > fo) bigText(t, fo, 'So he forged *Vermeer*', 540, 1330, 66); }; });
VIS[1] = S(() => (K, Sc) => { const at = Sc.vo[0].at, ex = sw('experts', 1.4), mi = sw('millions', 4.0); ks(K, [[mi, 'coin', 0.5]]);
  return (t) => { host(t, 2, at); CAPY = 890;
    photoCard(t, Math.max(0.15, ex - 0.2), 'emmaus', 150, 950, 780, 430, { label: 'Fake "Vermeer" · The Supper at Emmaus, 1937', focus: [0.5, 0.45], out: mi - 0.05 });
    if (t > mi) card(t, mi, 150, 950, 780, 260, (lt, w) => { kicker('He earned', 40, 60); ptext('5.5–7.5 million guilders', w / 2, 170, 58, PRO.acc, { align: 'center', w: 800 }); }); }; });
VIS[2] = S(() => (K, Sc) => { const go = sw('göring', 1.8), tr = sw('traded', 3.2), lo = sw('looted', 5.0); ks(K, [[lo, 'thump', 0.6]]);
  return (t) => { proBg(t, { glow: 'rgba(255,90,78,0.07)' }); bigText(t, 0.1, 'Hermann *Göring*', 540, 560, 84, { acc: PRO.hi });
    if (t > tr) { const n = Math.min(137, Math.floor((t - tr) * 60)); for (let i = 0; i < n; i++) { const x = 130 + (i % 14) * 63, y = 680 + Math.floor(i / 14) * 62; rrect(x, y, 48, 40, 5); g.fillStyle = i % 9 ? PRO.dim : 'rgba(255,159,28,0.6)'; g.fill(); } }
    if (t > lo) bigText(t, lo, '*137* looted paintings → 1 fake', 540, 1400, 56); }; });
VIS[3] = S(() => (K, Sc) => { const at = Sc.vo[0].at, sa = sw('salt', 1.6), de = sw('death', 6.0);
  return (t) => { host(t, 4, at); CAPY = 890;
    card(t, Math.max(0.15, sa - 0.2), 150, 950, 780, 280, (lt, w) => { kicker('1945', 40, 60); ptext('Found in a salt mine', 40, 140, 50, PRO.txt, { w: 800 }); if (t > de) ptext('Charge: collaboration · possible death penalty', 40, 210, 28, PRO.hi); }); }; });
VIS[4] = S(() => (K, Sc) => { const fa = sw('fake', 0.8), pr = sw('prove', 2.6), wi = sw('witnesses', 4.4);
  return (t) => { proBg(t); if (t < pr) bigText(t, fa, '"It\'s a *fake*. I painted it."', 540, 900, 64);
    else photoCard(t, pr, 'painting', 60, 430, 960, 700, { label: 'Real photo · painting a new "Vermeer" for the court, 1945', focus: [0.45, 0.4] });
    if (t > wi) pill('In front of witnesses', 540, 1210, t, wi, { size: 34, color: PRO.acc }); }; });
VIS[5] = S(() => (K, Sc) => { const ye = sw('year', 1.0), di = sw('died', 2.6), fo = sw('fooled', 5.4), cta = Sc.vo[1] ? Sc.vo[1].at : 99;
  return (t) => { const lt = RT ?? t; if (lt > cta - 0.1) { host(t, 7, cta); CAPY = 890; return; }
    proBg(t); photoCard(t, 0.05, 'court', 60, 430, 960, 660, { label: 'Real photo · the trial, Amsterdam 1947', focus: [0.5, 0.45] });
    if (t > ye) pill('1 year in prison for fraud', 540, 1170, t, ye, { size: 32 }); if (t > di) pill('Died before serving it', 540, 1250, t, di, { size: 32 }); if (t > fo) bigText(t, fo, 'The man who *fooled Göring*', 540, 1380, 56); }; });
