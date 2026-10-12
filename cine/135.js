// ART SCANDALS #3 (#135): Salvator Mundi — £45 → $1,175 → $450 million.
VIS.open = (K) => { K(0.05, 'swish', 0.4);
  return (t) => { proBg(t); art(t, 'sm', [[0, 0.5, 0.3, 1.0], [2.4, 0.5, 0.25, 1.15]], { cy: 1100, w: 860 }); proTitle(t, EP.titlePro, 250, 62); }; };
VIS[0] = S(() => (K, Sc) => { const y = sw('1958', 0.6), fo = sw('forty', 2.4), st = sw('students', 4.6);
  return (t) => { proBg(t); photoCard(t, 0.0, 'before', 250, 420, 580, 730, { label: 'Before restoration', focus: [0.5, 0.35] });
    if (t > y) pill('1958 auction', 540, 1200, t, y, { size: 30 }); if (t > fo) bigText(t, fo, '*£45*', 540, 1320, 100); if (t > st) pill("as a work by one of Leonardo's students", 540, 1395, t, st, { size: 24 }); }; });
VIS[1] = S(() => (K, Sc) => { const at = Sc.vo[0].at, de = sw('dealers', 1.4), th = sw('thousand', 2.4), re = sw('restored', 5.4); ks(K, [[th, 'coin', 0.5]]);
  return (t) => { host(t, 2, at); CAPY = 890;
    card(t, Math.max(0.15, de - 0.2), 150, 950, 780, 280, (lt, w) => { kicker('2005 · two art dealers', 40, 60); if (t > th) bigText(t, th, '*$1,175*', w / 2, 190, 110); if (t > re) pill('then restored', w / 2, 250, lt, re - (t - lt), { size: 24 }); }); }; });
VIS[2] = S(() => (K, Sc) => { const le = sw('leonardo', 1.6), sa = sw('salvator', 3.6), sv = sw('savior', 4.8);
  return (t) => { proBg(t); const P = art(t, 'sm', [[0, 0.5, 0.4, 0.95], [sa, 0.5, 0.3, 1.25], [sv + 1, 0.55, 0.85, 2.0]], { cy: 860, w: 900 });
    if (t > le) artInfo(t, le, 'Attributed to Leonardo da Vinci · c. 1500', 1360); if (t > sa) bigText(t, sa, '*Salvator Mundi*', 540, 1330, 72); if (P && t > sv) callout(t, sv, ...P(0.56, 0.86), 800, 600, 'The crystal orb'); }; });
VIS[3] = S(() => (K, Sc) => { const ch = sw('christie', 1.0), fo = sw('four', 3.2), ex = sw('expensive', 6.0); ks(K, [[fo, 'boom', 0.6]]);
  return (t) => { proBg(t); photoCard(t, 0.0, 'auction', 90, 430, 900, 640, { label: "Christie's auction room (historic print)", focus: [0.5, 0.5] }, );
    if (t > ch) pill("Christie's, New York · 2017", 540, 1140, t, ch, { size: 30 }); if (t > fo) counter(t, fo, 1.4, 1175, 450e6, 540, 1300, 120, (n) => n < 1e6 ? '$' + Math.round(n).toLocaleString('en-US') : '$' + Math.round(n / 1e6) + 'M');
    if (t > ex) pill('The most expensive painting ever sold', 540, 1410, t, ex, { size: 30, color: PRO.hi }); }; });
VIS[4] = S(() => (K, Sc) => { const at = Sc.vo[0].at, sa = sw('saudi', 2.4), pu = sw('public', 5.4), st = sw('storage', 6.8);
  return (t) => { host(t, 5, at); CAPY = 890;
    card(t, Math.max(0.15, sa - 0.3), 150, 950, 780, 300, (lt, w) => { kicker('Where is it now?', 40, 60); ptext('Not shown in public since 2017', 40, 140, 42, PRO.txt, { w: 800 }); if (t > st) ptext('Reportedly in storage', 40, 210, 34, PRO.hi); }); }; });
VIS[5] = S(() => (K, Sc) => { const do_ = sw('doubt', 1.4), cta = Sc.vo[1] ? Sc.vo[1].at : 99;
  return (t) => { const lt = RT ?? t; if (lt > cta - 0.1) { host(t, 7, cta); CAPY = 890; return; }
    proBg(t); art(t, 'sm', [[0, 0.5, 0.22, 1.6], [4, 0.5, 0.2, 1.9]], { cy: 860, w: 900 }); if (t > do_) bigText(t, do_, 'Leonardo or *not*?', 540, 1420, 80); }; });
