// COLOR STORIES #2 (#137): Scheele's green / Paris green — arsenic.
const SG = '#478800';
function wallpaper(x, y, w, h, t, a = 1) { g.save(); g.globalAlpha *= a; g.beginPath(); g.rect(x, y, w, h); g.clip(); g.fillStyle = '#1F3A10'; g.fillRect(x, y, w, h);
  for (let j = 0; j < 12; j++) for (let i = 0; i < 9; i++) { const cx = x + i * 120 + (j % 2) * 60, cy = y + j * 120; g.fillStyle = SG; g.beginPath(); g.ellipse(cx, cy, 34, 16, 0.6, 0, 6.283); g.fill(); g.beginPath(); g.ellipse(cx + 22, cy + 22, 30, 14, -0.6, 0, 6.283); g.fill();
    g.fillStyle = '#A9D86E'; g.beginPath(); g.arc(cx + 8, cy + 8, 7, 0, 6.283); g.fill(); } g.restore(); }
VIS.open = (K) => { K(0.05, 'swish', 0.4);
  return (t) => { proBg(t, { glow: 'rgba(71,136,0,0.12)' }); wallpaper(90, 560, 900, 760, t); pill('Illustration · arsenic-green wallpaper pattern', 540, 1390, t, 0.6, { size: 22 }); proTitle(t, EP.titlePro, 250, 66); }; };
VIS[0] = S(() => (K, Sc) => { const y = sw('1775', 0.6), gr = sw('green', 3.2), ar = sw('arsenic', 4.8); ks(K, [[ar, 'thump', 0.6]]);
  return (t) => { proBg(t, { glow: 'rgba(71,136,0,0.12)' }); bigText(t, y, '*1775*', 540, 600, 100); pill('Carl Wilhelm Scheele, chemist', 540, 690, t, y + 0.3, { size: 30 });
    if (t > gr) card(t, gr, 240, 780, 600, 420, (lt, w, h) => { g.fillStyle = SG; rrect(24, 24, w - 48, h - 120, 18); g.fill(); ptext("Scheele's green", 30, h - 46, 36, PRO.txt, { w: 800 }); });
    if (t > ar) bigText(t, ar, 'Key ingredient: *arsenic*', 540, 1330, 60, { acc: PRO.hi }); }; });
VIS[1] = S(() => (K, Sc) => { const at = Sc.vo[0].at, wa = sw('wallpaper', 1.6), to = sw('toys', 4.2);
  return (t) => { host(t, 2, at); CAPY = 890;
    card(t, Math.max(0.15, wa - 0.2), 150, 950, 780, 300, (lt, w, h) => { wallpaper(0, 0, w, h, t, 0.35); kicker('Colored with arsenic green', 40, 60, PRO.txt);
      ['Wallpaper', 'Dresses', 'Candles', 'Toys'].forEach((s, i) => { const tt = [wa, wa + 0.6, wa + 1.2, to][i]; if (t > tt) pill(s, 40 + i * 180, 170, lt, tt - (t - lt), { size: 28, align: 'left', color: i === 3 ? PRO.hi : PRO.txt, bg: 'rgba(6,16,21,0.85)' }); }); }); }; });
VIS[2] = S(() => (K, Sc) => { const da = sw('damp', 0.6), mo = sw('mold', 1.6), ga = sw('gas', 4.2);
  return (t) => { proBg(t); card(t, 0.05, 90, 470, 900, 800, (lt, w, h) => { wallpaper(0, 0, w, h, t);
      const m = clamp((t - mo) / 2); const r = rng(3); for (let i = 0; i < 40 * m; i++) { g.fillStyle = `rgba(40,45,35,${0.5 + r() * 0.3})`; g.beginPath(); g.arc(r() * w, h * 0.5 + r() * h * 0.5, 10 + r() * 50 * m, 0, 6.283); g.fill(); }
      if (t > ga) { for (let i = 0; i < 26; i++) { const p = ((t - ga) * 0.4 + i / 26) % 1; g.fillStyle = `rgba(255,159,28,${0.25 * (1 - p)})`; g.beginPath(); g.arc(80 + (i * 137) % (w - 160) + Math.sin(t * 2 + i) * 20, h - p * h, 18 + p * 30, 0, 6.283); g.fill(); } } });
    if (t > da) pill('Illustration', 540, 1320, t, da, { size: 22 }); if (t > ga) bigText(t, ga, 'Poisonous *gas*', 540, 1360, 70, { acc: PRO.hi }); }; });
VIS[3] = S(() => (K, Sc) => { const pa = sw('paris', 0.8), in_ = sw('insecticide', 4.6);
  return (t) => { proBg(t); photoCard(t, 0.0, 'pg', 120, 430, 400, 560, { label: 'Paris green pigment', focus: [0.5, 0.5] }); if (t > pa + 0.5) photoCard(t, pa + 0.5, 'dust', 560, 430, 400, 560, { label: 'US poster', focus: [0.5, 0.35] });
    if (t > in_) bigText(t, in_, 'The first chemical *insecticide*', 540, 1150, 56); }; });
VIS[4] = S(() => (K, Sc) => { const at = Sc.vo[0].at, na = sw('napoleon', 1.6), he = sw('helena', 3.4), ca = sw('cancer', 7.0);
  return (t) => { host(t, 5, at); CAPY = 890;
    photoCard(t, Math.max(0.15, na - 0.2), 'nap', 150, 950, 780, 420, { label: 'Charles de Steuben · Death of Napoleon (1821)', focus: [0.38, 0.45], out: he - 0.05 });
    if (t > he) photoCard(t, he, 'longwood', 150, 950, 780, 420, { label: 'Real photo · Longwood House, Saint Helena', focus: [0.5, 0.5] }); }; });
VIS[5] = S(() => (K, Sc) => { const y = sw('1890s', 0.8), cta = Sc.vo[1] ? Sc.vo[1].at : 99;
  return (t) => { const lt = RT ?? t; if (lt > cta - 0.1) { host(t, 7, cta); CAPY = 890; return; }
    proBg(t); card(t, 0.05, 90, 470, 900, 640, (l, w, h) => { wallpaper(0, 0, w, h, t, 1 - clamp((t - y) / 1.5) * 0.85); }); if (t > y) bigText(t, y, 'Gone by the *1890s*', 540, 1250, 70); }; });
