// Wiki Roulette #063 — Kaliningrad: a piece of Russia surrounded by the EU
const KG = [20.51, 54.71], MOS = [37.62, 55.75], EUC = '#2D5BD8', RUC = '#D52B1E';
function eu(a = 0.4) { ['Poland', 'Lithuania', 'Latvia', 'Germany', 'Denmark', 'Sweden', 'Estonia'].forEach((n) => territory(n, EUC, a, { stroke: '#FFCC00', glow: 6, lw: 2 })); }
VIS.open = (K) => { K(0.2, 'whoosh', 0.9); K(0.9, 'hit', 0.9);
  return (t) => { earth(t, camPath(t, [[0, 40, 40, 2.8, 0, 0], [0.15, 21.4, 54.4, 0.14, 35, 0]], { k: 10, d: 6.4 })); eu(0.4); territory('Russia', RUC, 0.5 * clamp((t - 0.9) * 3), { stroke: '#FFB0A8' });
    const [x, y] = MAP.P(...KG); if (t > 0.9) shockRing(x, y, t, 0.9, 260, '255,120,100', 2); tag(t); hook(t, EP.hook, 480); }; };
VIS[0] = (K) => { K(0.6, 'land', 0.8); [1.6, 2.2, 2.8].forEach((a) => K(a, 'pop', 0.7, 700));
  return (t) => { earth(t, camPath(t, [[0, 21.4, 54.4, 0.14, 35, 0], [0.1, 21.6, 54.5, 0.16, 40, 8]], { k: 3, d: 3.4 })); eu(0.35); territory('Russia', RUC, 0.5, { stroke: '#FFB0A8' });
    place(...KG, 'KALININGRAD', t, 0.6, { size: 40 }); place(20.3, 53.1, 'POLAND', t, 1.6, { size: 32 }); place(23.6, 55.3, 'LITHUANIA', t, 2.2, { size: 32 }); place(18.6, 55.7, 'BALTIC SEA', t, 2.8, { size: 30, color: '#9FD0FF' });
    tag(t, 0, 4); rgbPop('RUSSIA', 80, 540, 160, '#FF8A80', t, 0.45); label('BUT NOT CONNECTED TO IT', 84, 605, t, 1.0, { color: GOLD }); }; };
VIS[1] = (K) => { K(0.45, 'hit', 0.9); K(1.2, 'thump', 0.8); K(3.6, 'pop', 0.8, 600);
  return (t) => { earth(t, camPath(t, [[0, 21.6, 54.5, 0.16, 40, 8], [0.1, 20.8, 54.6, 0.1, 42, -6]], { k: 3, d: 3.4 })); territory('Russia', '#2B2A28', 0.5, { stroke: '#EDE6D8' });
    flagPin(...KG, 'EP', t, 1.2, { label: 'KÖNIGSBERG', w: 130 }); tag(t, 1, 4); yearTag(1945, t, 0.45); label('GERMAN · EAST PRUSSIA', 84, 625, t, 0.9, { color: GOLD });
    if (!photoCard(t, 'kant', 640, 360, 330, 400, 3.6, 'IMMANUEL KANT')) chip('HOME OF IMMANUEL KANT', 80, 700, t, 3.6, { size: 32, align: 'left' }); }; };
VIS[2] = (K) => { K(0.45, 'hit', 1); K(2.6, 'scratch'); K(2.62, 'thump', 1); K(3.4, 'pop', 0.9, 800);
  return (t) => { earth(t, camPath(t, [[0, 20.8, 54.6, 0.1, 42, -6], [0.1, 21.2, 54.6, 0.13, 36, 6]], { k: 3, d: 3.4 })); const red = clamp((t - 0.6) * 2);
    territory('Russia', '#2B2A28', 0.5 * (1 - red), {}); territory('Russia', RUC, 0.55 * red, { stroke: '#FFB0A8' }); tag(t, 2, 4); yearTag(1946, t, 0.45, { color: '#FF8A80' }); label('THE SOVIET UNION TAKES IT', 84, 625, t, 0.8, { color: GOLD });
    const [x, y] = MAP.P(...KG); text('KÖNIGSBERG', x, y - 30, 'disp', 54, TXT, { align: 'center', shadow: true, alpha: 1 - clamp((t - 3.2) * 2) });
    if (t > 2.6) { g.strokeStyle = RED; g.lineWidth = 8; g.beginPath(); g.moveTo(x - 200, y - 46); g.lineTo(x - 200 + 400 * ease((t - 2.6) / 0.3), y - 46); g.stroke(); }
    if (t > 3.4) popNum('KALININGRAD', x, y + 60, 64, GOLD, t, 3.4, { align: 'center' }); }; };
VIS[3] = (K) => { K(0.45, 'whoosh', 0.8); K(1.4, 'hit', 1); K(3.0, 'crack', 1);
  return (t) => { earth(t, camPath(t, [[0, 21.2, 54.6, 0.13, 36, 6], [0.2, 29.5, 55.2, 0.55, 20, 0]], { k: 5, d: 4.5 })); eu(0.3); territory('Russia', RUC, 0.45, { stroke: '#FFB0A8' }); territory('Belarus', '#8C857A', 0.35, {});
    territory('Lithuania', '#FDB913', 0.5 * clamp((t - 1.4) * 3), { stroke: '#FDB913' }); if (t > 1.4) flagPin(24.0, 55.2, 'LT', t, 1.4, { w: 100, pole: 70 });
    place(...KG, 'KALININGRAD', t, 0.4, { size: 30 }); place(...MOS, 'MOSCOW', t, 0.6, { size: 30 }); arc3d(KG, MOS, ease((t - 0.6) / 1.6), RED, { dash: [20, 14], w: 6, lift: 0.01 });
    if (t > 3.0) { const [x, y] = MAP.P(25.5, 55.5), s = spring(t - 3.0, 300, 14); g.save(); g.translate(x, y); g.scale(s, s); g.strokeStyle = RED; g.lineWidth = 16; g.lineCap = 'round'; g.beginPath(); g.moveTo(-40, -40); g.lineTo(40, 40); g.moveTo(40, -40); g.lineTo(-40, 40); g.stroke(); g.restore(); }
    tag(t, 3, 4); yearTag(1990, t, 0.45); label('LITHUANIA BECOMES INDEPENDENT', 84, 625, t, 1.4, { color: GOLD }); if (t > 3.0) chip('NO LAND LINK TO RUSSIA', 80, 700, t, 3.0, { size: 32, align: 'left', bg: RED, fg: TXT }); }; };
