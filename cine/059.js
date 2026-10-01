// Wiki Roulette #059 — Hans Island: the Whisky War
const HI = [-66.46, 80.83], CAR = '#D80621', GLW = '#5E8FD0';
function rock(t, o = {}) { const sky = g.createLinearGradient(0, 0, 0, 780); sky.addColorStop(0, '#0B1520'); sky.addColorStop(1, '#4A6A80'); g.fillStyle = sky; g.fillRect(0, 0, W, H);
  g.fillStyle = '#7F95A4'; g.fillRect(0, 780, W, H - 780); const r = rng(59); for (let i = 0; i < 40; i++) { g.fillStyle = `rgba(220,232,240,${0.15 + r() * 0.25})`; g.beginPath(); g.ellipse(r() * W, 800 + r() * 1100, 60 + r() * 140, 14 + r() * 20, 0, 0, 6.283); g.fill(); }
  g.fillStyle = '#1C3448'; for (let i = 0; i < 8; i++) { g.beginPath(); g.ellipse(r() * W, 840 + r() * 1000, 80 + r() * 120, 10, 0, 0, 6.283); g.fill(); }
  g.fillStyle = '#5E5A55'; g.beginPath(); g.moveTo(80, 1120); g.lineTo(200, 930); g.lineTo(380, 860); g.lineTo(560, 820); g.lineTo(760, 870); g.lineTo(900, 960); g.lineTo(1000, 1120); g.closePath(); g.fill();
  g.fillStyle = '#7A746C'; g.beginPath(); g.moveTo(200, 930); g.lineTo(380, 860); g.lineTo(560, 820); g.lineTo(600, 880); g.lineTo(380, 940); g.closePath(); g.fill();
  if (o.split) { g.strokeStyle = GOLD; g.lineWidth = 6; g.setLineDash([16, 10]); g.beginPath(); g.moveTo(560, 820); g.quadraticCurveTo(470, 970, 560, 1120); g.stroke(); g.setLineDash([]);
    g.globalAlpha = 0.3 * o.split; g.fillStyle = CAR; g.beginPath(); g.moveTo(80, 1120); g.lineTo(200, 930); g.lineTo(380, 860); g.lineTo(560, 820); g.quadraticCurveTo(470, 970, 560, 1120); g.fill();
    g.fillStyle = '#FFFFFF'; g.beginPath(); g.moveTo(560, 820); g.lineTo(760, 870); g.lineTo(900, 960); g.lineTo(1000, 1120); g.lineTo(560, 1120); g.quadraticCurveTo(470, 970, 560, 820); g.fill(); g.globalAlpha = 1; } }
function pole(x, y, code, t, tIn, s0 = 1) { const s = spring(t - tIn, 260, 16) * s0; if (s <= 0.01) return; g.strokeStyle = '#EDE6D8'; g.lineWidth = 6; g.beginPath(); g.moveTo(x, y); g.lineTo(x, y - 230 * s); g.stroke(); flag(code, x + 92, y - 230 * s + 55, 180 * s, t); }
VIS.open = (K) => { K(0.2, 'whoosh', 0.9); K(1.6, 'pop', 0.8, 500); K(2.2, 'pop', 0.8, 800);
  return (t) => { earth(t, camPath(t, [[0, -40, 50, 2.8, 0, 0], [0.15, HI[0], HI[1], 0.1, 40, 0]], { k: 10, d: 6.4 }));
    territory('Canada', CAR, 0.3, {}); territory('Greenland', GLW, 0.3, {}); const [x, y] = MAP.P(...HI); shockRing(x, y, t % 1 + 1, 1, 140, '255,194,61', 2);
    bottle(330, 1330, 1.7 * spring(t - 1.6, 260, 14), '#B8742A', 'WHISKY', { rot: -0.2 }); bottle(750, 1330, 1.7 * spring(t - 2.2, 260, 14), '#7FA8C9', 'SCHNAPPS', { rot: 0.2 });
    tag(t); hook(t, EP.hook, 480); }; };
VIS[0] = (K) => { K(0.6, 'land', 0.8); K(2.2, 'pop', 0.8, 700); K(3.4, 'pop', 0.8, 500);
  return (t) => { earth(t, camPath(t, [[0, HI[0], HI[1], 0.1, 40, 0], [0.1, HI[0], HI[1], 0.06, 48, 10]], { k: 3, d: 3.4 }));
    territory('Canada', CAR, 0.35, { stroke: CAR, glow: 8 }); territory('Greenland', GLW, 0.3, { stroke: '#FFFFFF', glow: 8 });
    territory(islandPoly(...HI, 0.9, 0.6, 0.4, 3), GOLD, 0.9, { stroke: GOLD }); place(...HI, 'HANS ISLAND', t, 0.6, { color: GOLD, size: 40 });
    tag(t, 0, 5); rgbPop('1.3 KM²', 80, 560, 170, GOLD, t, 1.4); label('OF BARE ROCK', 84, 625, t, 1.6);
    flag('CA', 260, 1440, 190, t, { s: spring(t - 2.2, 260, 16) }); text('CANADA', 260, 1550, 'ui', 34, TXT, { align: 'center', shadow: true, alpha: (t - 2.2) * 3 });
    flag('GL', 820, 1440, 190, t, { s: spring(t - 3.4, 260, 16) }); text('GREENLAND', 820, 1550, 'ui', 34, TXT, { align: 'center', shadow: true, alpha: (t - 3.4) * 3 }); }; };
VIS[1] = (K) => { K(0.45, 'hit', 0.9); K(1.6, 'thump', 1); K(3.0, 'pop', 1, 700);
  return (t) => { rock(t); pole(420, 840, 'CA', t, 1.6); bottle(650, 980, 1.6 * spring(t - 3.0, 260, 14), '#B8742A', 'WHISKY');
    tag(t, 1, 5); yearTag(1984, t, 0.45, { color: '#FF6B6B' }); label('CANADA WAS HERE', 84, 625, t, 1.8, { color: GOLD }); }; };
VIS[2] = (K) => { K(0.45, 'swish', 0.8); K(0.9, 'thump', 1); K(2.6, 'pop', 1, 900);
  return (t) => { rock(t); const sw = clamp((t - 0.6) / 0.5); pole(420, 840, sw < 0.5 ? 'CA' : 'DK', t, -1, Math.abs(1 - 2 * sw));
    bottle(650, 980, 1.6 * (1 - clamp((t - 0.6) * 3)), '#B8742A', 'WHISKY'); bottle(650, 980, 1.6 * spring(t - 2.6, 260, 14), '#7FA8C9', 'SCHNAPPS');
    tag(t, 2, 5); rgbPop('DENMARK', 80, 540, 150, '#FF6B6B', t, 0.9); label('A MINISTER REPLIES', 84, 605, t, 1.2, { color: GOLD }); }; };
VIS[3] = (K) => { for (let i = 0; i < 8; i++) K(0.5 + i * 0.42, 'swish', 0.5);
  return (t) => { rock(t); const k = Math.floor(Math.max(0, t - 0.5) / 0.42), ph = (Math.max(0, t - 0.5) % 0.42) / 0.42, dk = k % 2 === 1;
    pole(420, 840, dk ? 'DK' : 'CA', t, -1, t < 0.5 ? 1 : Math.abs(Math.cos(ph * Math.PI)) * 0.8 + 0.2); bottle(650, 980, 1.6, dk ? '#7FA8C9' : '#B8742A', dk ? 'SCHNAPPS' : 'WHISKY', { rot: Math.sin(t * 8) * 0.1 });
    tag(t, 3, 5); const y = Math.round(ramp(t, 0.5, 3.2, 1984, 2021)); yearTag(y, t, 0.45); label('FLAGS + BOTTLES, BACK AND FORTH', 84, 625, t, 0.6, { color: GOLD }); }; };
VIS[4] = (K) => { K(0.45, 'hit', 1); K(1.0, 'scratch'); K(1.02, 'thump', 1); K(4.4, 'pop', 0.8, 600);
  return (t) => { rock(t, { split: clamp((t - 1.0) * 2) }); pole(300, 940, 'CA', t, 1.4); pole(780, 900, 'DK', t, 1.7);
    tag(t, 4, 5); yearTag(2022, t, 0.45); label('SPLIT ALONG A NATURAL RIFT', 84, 625, t, 1.0, { color: GOLD });
    if (!photoCard(t, 'lead', 620, 380, 360, 240, 2.4, 'HANS ISLAND')) {} }; };
