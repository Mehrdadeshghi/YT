// Wiki Roulette #047 — Michel Lotito, "Monsieur Mangetout"
function bitesClip(n, seed, fx) { const r = rng(seed); for (let i = 0; i < n; i++) { const [cx, cy, rad] = fx(r, i); g.beginPath(); g.rect(-2000, -2000, 4000, 4000); g.arc(cx, cy, rad, 0, 6.283); g.clip('evenodd'); } }
function cessna(x, y, s, eaten = 0, t = 0) { g.save(); g.translate(x, y); g.scale(s, s);
  if (eaten > 0) bitesClip(Math.floor(60 * eaten), 47, (r, i) => [-300 + i / 60 * 600 + (r() - 0.5) * 60, -60 + r() * 120, 24 + r() * 22]);
  g.fillStyle = '#EDE6D8'; g.beginPath(); g.moveTo(-260, -10); g.lineTo(150, -30); g.quadraticCurveTo(230, -20, 240, 10); g.lineTo(150, 30); g.lineTo(-240, 20); g.lineTo(-290, -70); g.lineTo(-250, -70); g.closePath(); g.fill();
  g.fillRect(-60, -70, 160, 16); g.fillStyle = '#3A5A8A'; g.fillRect(-60, -70, 160, 6); g.fillStyle = '#7A90A8'; g.fillRect(100, -26, 60, 26); g.fillStyle = '#2B2A28'; g.fillRect(238, -40, 8, 90);
  g.strokeStyle = '#2B2A28'; g.lineWidth = 6; g.beginPath(); g.moveTo(40, 30); g.lineTo(30, 80); g.moveTo(-100, 25); g.lineTo(-110, 80); g.stroke();
  g.restore(); }
function cutlery(x, y, s) { g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = '#B9B2A5'; g.fillRect(-60, -100, 14, 200); for (let i = 0; i < 3; i++) g.fillRect(-72 + i * 12, -140, 6, 50); g.beginPath(); g.ellipse(60, -80, 22, 60, 0, 0, 6.283); g.fill(); g.fillRect(53, -30, 14, 130); g.restore(); }
VIS.open = (K) => { [0.4, 0.9, 1.4, 1.9].forEach((a) => K(a, 'crack', 0.4)); K(1.5, 'pop', 0.8, 400);
  return (t) => { atmosphere(t, { x: 540, y: 1050, r: 800, c: 'rgba(255,194,61,0.10)' });     cessna(540, 1100, 1.6, clamp(t / 4) * 0.12, t); hookPhoto(t, 'lead', { y: 800, h: 480 }); tag(t); hook(t, EP.hook, 500); if (t > 1.5) chip('REPORTEDLY', 80, 760, t, 1.5, { size: 30, align: 'left', bg: '#2B2A28', fg: TXT }); }; };
VIS[0] = (K) => { K(0.6, 'pop', 0.8, 500); K(2.0, 'coin', 0.8);
  return (t) => { atmosphere(t); tag(t, 0, 4); cutlery(540, 1000, 2.2 * spring(t - 0.8, 200, 14));
    popNum('MICHEL LOTITO', 80, 520, fit('MICHEL LOTITO', 'disp', 140, 920), TXT, t, 0.45); popNum('"MONSIEUR MANGETOUT"', 80, 640, fit('"MONSIEUR MANGETOUT"', 'disp', 80, 920), GOLD, t, 1.6); label('= MISTER EATS-ALL', 84, 700, t, 2.6); }; };
VIS[1] = (K) => { for (let i = 0; i < 10; i++) K(0.8 + i * 0.35, 'crack', 0.35); K(4.2, 'land', 0.8);
  return (t) => { atmosphere(t); tag(t, 1, 4); const e = clamp((t - 0.6) / 3.6); cessna(540, 1000, 1.7, e, t);
    popNum('CESSNA 150', 80, 520, fit('CESSNA 150', 'disp', 150, 920), TXT, t, 0.45); popNum(`${(e * 2).toFixed(1)} YEARS`, 80, 640, 100, GOLD, t, 0.6); label('PIECE BY PIECE · AS CLAIMED', 84, 700, t, 1.2); }; };
VIS[2] = (K) => { [0.6, 1.4, 2.2].forEach((a) => K(a, 'pop', 0.9, 600)); for (let i = 0; i < 14; i++) K(3.2 + i * 0.07, 'tick', 0.4); K(4.3, 'thump', 1);
  return (t) => { atmosphere(t); tag(t, 2, 4);
    [['18', 'BICYCLES', 0.6], ['7', 'TV SETS', 1.4], ['1', 'COFFIN', 2.2]].forEach(([n, l, at], i) => { const y = 500 + i * 150; popNum(n, 80, y, 130, GOLD, t, at); if (t > at) label(l, 300, y - 20, t, at + 0.1, { size: 40 }); });
    popNum(`~${(countTo(t, 3.2, 1.0, 9, 0.7)).toFixed(1)} TONS`, 80, 1040, 150, TXT, t, 3.1); label('OF METAL, 1959–1997', 84, 1100, t, 3.6); }; };
VIS[3] = (K) => { K(0.6, 'land', 0.7); [2.4, 2.8, 3.2].forEach((a) => K(a, 'crack', 0.6)); K(3.6, 'pop', 1, 900);
  return (t) => { atmosphere(t, { x: 540, y: 900, r: 800, c: 'rgba(255,194,61,0.14)' }); tag(t, 3, 4); const bites = clamp((t - 2.3) / 1.2);
    g.save(); g.translate(540, 900); g.scale(spring(t - 0.5, 200, 16), spring(t - 0.5, 200, 16)); if (bites > 0) bitesClip(Math.floor(26 * bites), 3, (r, i) => [330 - r() * 200 - i * 22, -170 + r() * 340, 50]); rrect(-330, -170, 660, 340, 20); g.fillStyle = '#C9A15A'; g.fill(); g.strokeStyle = '#8A6A2E'; g.lineWidth = 10; g.stroke();
    text('GUINNESS', 0, -70, 'mono', 34, '#3A2A10', { align: 'center', ls: 6 }); text('STRANGEST', 0, 20, 'disp', 70, '#3A2A10', { align: 'center' }); text('DIET', 0, 100, 'disp', 70, '#3A2A10', { align: 'center' });
    g.restore(); if (t > 3.6) popNum('HE ATE IT TOO.', 540, 1180, 80, GOLD, t, 3.6, { align: 'center' }); }; };
