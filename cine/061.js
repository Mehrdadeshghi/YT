// Wiki Roulette #061 — Diomede Islands: 4 km apart, 21 hours apart
const BD = [-169.08, 65.78], LD = [-168.93, 65.755], RUC = '#D52B1E', USC = '#3C6BD8';
const BDP = islandPoly(...BD, 2.0, 4.2, 0.3, 61), LDP = islandPoly(...LD, 1.5, 2.3, 0.3, 62), DL = densify([[-168.977, 64.6], [-168.977, 67.0]], 30);
function isles(t, o = {}) { territory(BDP, '#6E6658', 1, {}); territory(LDP, '#6E6658', 1, {}); territory(BDP, RUC, o.a ?? 0.55, { stroke: '#FFB0A8', glow: 10 }); territory(LDP, USC, o.a ?? 0.55, { stroke: '#B0C8FF', glow: 10 }); }
VIS.open = (K) => { K(0.2, 'whoosh', 0.9); K(2.0, 'tick', 1); K(2.6, 'tick', 1);
  return (t) => { earth(t, camPath(t, [[0, -150, 50, 2.8, 0, 0], [0.15, -169, 65.75, 0.045, 38, 0]], { k: 10, d: 6.4 }), { minAlt: 0.004 }); isles(t);
    territory('Russia', RUC, 0.5, { stroke: '#FFC2BE' }); territory('United States of America', USC, 0.5, { stroke: '#DDE8FF' }); isles(t); tag(t); hook(t, EP.hook, 480);
    if (t > 2.0) { clockFace(300, 1350, 110, 13, 0, {}); text('MON', 300, 1520, 'disp', 50, '#B0C8FF', { align: 'center', shadow: true }); }
    if (t > 2.6) { clockFace(780, 1350, 110, 10, 0, {}); text('TUE', 780, 1520, 'disp', 50, '#FFB0A8', { align: 'center', shadow: true }); } }; };
VIS[0] = (K) => { K(0.6, 'land', 0.8); K(2.2, 'pop', 0.8, 600); K(3.6, 'pop', 0.8, 800); K(4.6, 'swish', 0.6);
  return (t) => { earth(t, camPath(t, [[0, -169, 65.75, 0.045, 38, 0], [0.4, -169, 65.77, 0.011, 45, 10]], { k: 3, d: 3.4 }), { minAlt: 0.004 }); territory('Russia', RUC, 0.5, { stroke: '#FFC2BE' }); territory('United States of America', USC, 0.5, { stroke: '#DDE8FF' }); isles(t);
    place(-170.6, 65.95, 'RUSSIA', t, 0.5, { color: '#FFC2BE', size: 38 }); place(-167.6, 65.55, 'ALASKA', t, 0.9, { color: '#DDE8FF', size: 38 });
    flagPin(...BD, 'RU', t, 2.2, { label: 'BIG DIOMEDE', left: true, w: 120 }); flagPin(...LD, 'US', t, 3.6, { label: 'LITTLE DIOMEDE', w: 120 });
    if (t > 4.6) { const [x1, y1] = MAP.P(-169.0, 65.765), [x2, y2] = MAP.P(-168.955, 65.757); g.strokeStyle = GOLD; g.lineWidth = 5; g.beginPath(); g.moveTo(x1, y1); g.lineTo(lerp(x1, x2, ease((t - 4.6) / 0.5)), lerp(y1, y2, ease((t - 4.6) / 0.5))); g.stroke(); }
    tag(t, 0, 4); rgbPop('BERING STRAIT', 80, 540, fit('BERING STRAIT', 'disp', 140, 920), TXT, t, 0.45); if (t > 4.6) label('3.8 KM APART', 84, 605, t, 4.6, { color: GOLD, size: 38 }); }; };
VIS[1] = (K) => { K(0.45, 'riser', 0.5, 1); K(1.2, 'hit', 1);
  return (t) => { earth(t, camPath(t, [[0, -169, 65.77, 0.009, 45, 10], [0.1, -169.0, 65.77, 0.011, 30, 0]], { k: 3, d: 3.4 }), { minAlt: 0.004 }); isles(t);
    line3d(DL, ease((t - 0.5) / 0.8), GOLD, { w: 7, dash: [18, 12], glow: 18 }); tag(t, 1, 4);
    rgbPop('DATE LINE', 80, 540, fit('DATE LINE', 'disp', 160, 920), GOLD, t, 1.2); label('INTERNATIONAL', 84, 605, t, 1.3); }; };
VIS[2] = (K) => { K(0.45, 'tick', 1); K(1.2, 'tick', 1); for (let i = 0; i < 21; i++) K(1.6 + i * 0.07, 'tick', 0.35); K(3.2, 'hit', 1);
  return (t) => { atmosphere(t); g.fillStyle = 'rgba(255,194,61,0.8)'; g.setLineDash([18, 12]); g.fillRect(538, 380, 4, 1200); g.setLineDash([]);
    clockFace(290, 1010, 150, 13, 0, {}); text('LITTLE DIOMEDE', 290, 720, 'mono', 26, '#B0C8FF', { align: 'center', ls: 3 }); text('MONDAY', 290, 815, 'disp', 64, '#B0C8FF', { align: 'center', shadow: true });
    const h = 13 + ramp(t, 1.6, 1.5, 0, 21); clockFace(790, 1010, 150, h, 0, {}); text('BIG DIOMEDE', 790, 720, 'mono', 26, '#FFB0A8', { align: 'center', ls: 3 });
    text(h >= 24 ? 'TUESDAY' : 'MONDAY', 790, 815, 'disp', 64, '#FFB0A8', { align: 'center', shadow: true });
    tag(t, 2, 4); rgbPop(`+${Math.round(h - 13)} HOURS`, 80, 520, 130, GOLD, t, 1.6); if (t > 3.2) chip('"TOMORROW ISLAND"', 80, 580, t, 3.2, { size: 36, align: 'left', bg: '#FFB0A8', fg: BG }); }; };
VIS[3] = (K) => { K(0.45, 'splash', 0.8); for (let i = 0; i < 10; i++) K(1.0 + i * 0.4, 'bubble', 0.3); K(4.6, 'land', 0.9);
  return (t) => { earth(t, camPath(t, [[0, -169.0, 65.765, 0.008, 40, -10], [0.1, -169.0, 65.765, 0.009, 50, 15]], { k: 2, d: 2.8 }), { minAlt: 0.004 }); isles(t, { a: 0.6 });
    line3d(DL, 1, GOLD, { w: 5, dash: [16, 12], glow: 10 }); const A = [-168.965, 65.758], B = [-169.035, 65.77], p = ease((t - 0.8) / 4.0), cur = [lerp(A[0], B[0], p), lerp(A[1], B[1], p)];
    line3d(densify([A, cur], 20), 1, '#FFFFFF', { w: 4, dash: [8, 8], glow: 6 }); const [x, y] = MAP.P(...cur); glowDot(x, y, 40, '255,255,255', 0.6); g.fillStyle = '#FFFFFF'; g.beginPath(); g.arc(x, y, 10, 0, 6.283); g.fill();
    if (t > 0.8) mapLabel('LYNNE COX', x + 20, y - 24, TXT, 30); place(...LD, 'USA', t, 0.3, { color: '#DDE8FF', size: 34 }); place(...BD, 'USSR', t, 0.3, { color: '#FFC2BE', size: 34, left: true });
    tag(t, 3, 4); yearTag(1987, t, 0.45); label('SHE SWIMS FROM AMERICA TO THE USSR', 84, 625, t, 0.9, { color: GOLD, size: 26 }); if (t > 4.6) chip('INTO TOMORROW', 80, 700, t, 4.6, { size: 34, align: 'left' }); }; };
