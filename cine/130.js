// ART SECRETS #2 (#130): Bosch, Garden of Earthly Delights — the butt music. Plays the real transcription (Commons, CC BY 3.0).
const BUTT = [0.165, 0.735];   // the man with the score on his backside (hell panel)
VIS.open = (K) => { K(0.05, 'swish', 0.4);
  return (t) => { proBg(t); const P = art(t, 'hell', [[0, 0.35, 0.62, 1.0], [2.4, BUTT[0], BUTT[1], 2.2]], { cy: 1080 }); proTitle(t, EP.titlePro, 250, 70);
    if (P) marker(...P(...BUTT), 70, t, 1.2); }; };
VIS[0] = S(() => (K, Sc) => { const bo = sw('bosch', 0.9), pr = sw('prado', 3.5);
  return (t) => { proBg(t); art(t, 'garden', [[0, 0.5, 0.5, 1.0], [5, 0.5, 0.5, 1.12]], { cy: 860 });
    artInfo(t, bo, 'Hieronymus Bosch · The Garden of Earthly Delights · 1490–1510', 1300); if (t > pr) pill('Museo del Prado, Madrid', 540, 1370, t, pr, { size: 26 }); }; });
VIS[1] = S(() => (K, Sc) => { const at = Sc.vo[0].at, he = sw('hell', 1.0), mu = sw('musicians', 2.6);
  return (t) => { host(t, 2, at); CAPY = 890;
    card(t, Math.max(0.15, he - 0.2), 150, 950, 780, 430, (lt, w, h) => { const im = PHOTOS.hell; if (!im) return; const z = lerp(1.0, 1.8, eO((t - mu) / 1.5) * (t > mu)),
      u = lerp(0.5, 0.2, (t > mu) * eO((t - mu) / 1.5)), v = lerp(0.5, 0.68, (t > mu) * eO((t - mu) / 1.5)), s = w / im.width * z;
      g.drawImage(im, w / 2 - u * im.width * s, h / 2 - v * im.height * s, im.width * s, im.height * s);
      if (t > mu) pill("The Musicians' Hell", 24, 44, lt, mu - (t - lt) + 0.2, { size: 22, bg: 'rgba(6,16,21,0.8)', color: PRO.txt, align: 'left' }); }); }; });
VIS[2] = S(() => (K, Sc) => { const lu = sw('lute', 1.0), bs = sw('backside', 2.6), ch = sw('choir', 4.2); ks(K, [[bs, 'pop', 0.6, 600]]);
  return (t) => { proBg(t); const P = art(t, 'hell', [[0, 0.3, 0.68, 1.6], [lu, 0.15, 0.7, 3.0], [bs, BUTT[0], BUTT[1], 5.5]], { cy: 880 });
    if (P && t > bs) { const [x, y] = P(...BUTT); spotlight(t, bs + 0.1, x, y, 150); callout(t, bs + 0.4, x + 60, y - 90, 760, 420, 'Sheet music'); } }; });
VIS[3] = S(() => (K, Sc) => { const at = Sc.vo[0].at, st = sw('student', 1.0), so = sw('song', 4.5);
  return (t) => { host(t, 4, at); CAPY = 890;
    card(t, Math.max(0.15, st - 0.2), 150, 950, 780, 300, (lt, w) => { kicker('2014', 40, 60); ptext('Transcribed & played', 40, 140, 52, PRO.txt, { w: 800 });
      for (let i = 0; i < 9; i++) { const y = 220 + ((i * 37) % 5) * -12, x = 60 + i * 76; g.fillStyle = PRO.acc; g.beginPath(); g.ellipse(x, y, 16, 12, -0.3, 0, 6.283); g.fill(); g.fillRect(x + 13, y - 60, 4, 60); }
      g.strokeStyle = 'rgba(243,247,248,0.25)'; g.lineWidth = 2; for (let l = 0; l < 5; l++) { g.beginPath(); g.moveTo(40, 172 + l * 14); g.lineTo(w - 40, 172 + l * 14); g.stroke(); } }, { out: so - 0.05 });
    if (t > so) card(t, so, 150, 950, 780, 220, (lt, w) => { rich('The *butt song* from hell', w / 2, 130, 52); }); }; });
VIS[4] = S(() => (K, Sc) => { const at = Sc.vo[0].at, so = sw('sounds', 1.0); K(so + 0.35, 'clip', 1.0, 'butt');
  return (t) => { proBg(t); const P = art(t, 'hell', [[0, BUTT[0], BUTT[1], 5.5], [so + 4, BUTT[0], BUTT[1] - 0.01, 6.5]], { cy: 760 });
    if (P) { const [x, y] = P(...BUTT); marker(x, y, 140, t, 0.2); }
    if (t > so + 0.35) { const lt = t - so - 0.35; for (let i = 0; i < 24; i++) { const hh = 14 + 70 * Math.abs(Math.sin(lt * 7 + i * 0.9)) * Math.abs(Math.sin(i * 1.3 + lt * 2)); rrect(540 - 12 * 24 + i * 24, 1300 - hh, 14, hh, 7); g.fillStyle = PRO.acc; g.fill(); }
      pill('Melody transcribed from the painting · lute', 540, 1360, t, so + 0.5, { size: 22 }); } }; });
VIS[5] = S(() => (K, Sc) => { const ar = sw('argue', 3.0), cta = Sc.vo[1] ? Sc.vo[1].at : 99;
  return (t) => { const lt = RT ?? t; if (lt > cta - 0.1) { host(t, 7, cta); CAPY = 890; return; }
    proBg(t); const P = art(t, 'garden', [[0, 0.78, 0.5, 1.6], [5, 0.5, 0.5, 1.0]], { cy: 860 }); if (P) { [[0.12, 0.55], [0.5, 0.35], [0.86, 0.6], [0.72, 0.25]].forEach(([u, v], i) => marker(...P(u, v), 40, t, 0.3 + i * 0.35, PRO.acc)); }
    if (t > ar) bigText(t, ar, 'Experts still *argue*', 540, 1380, 60); }; });
