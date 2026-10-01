// Wiki Roulette #064 — Neutral Moresnet: a territory that existed for a zinc mine
const NM = [6.024, 50.725], TRI = [[6.0, 50.718], [6.048, 50.718], [6.024, 50.737]];
function triStripes(t, a = 1, cols = ['#111111', '#FFFFFF', '#2A6FDB']) { if (a <= 0) return; const pts = TRI.map((p) => MAP.P(...p)); g.save(); g.globalAlpha = a; g.beginPath(); pts.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.closePath(); g.clip();
  const ys = pts.map((p) => p[1]), y0 = Math.min(...ys), y1 = Math.max(...ys); cols.forEach((c, i) => { g.fillStyle = c; g.fillRect(0, y0 + (y1 - y0) * i / cols.length, W, (y1 - y0) / cols.length + 1); }); g.restore();
  g.save(); g.globalAlpha = a; g.strokeStyle = GOLD; g.lineWidth = 5; g.shadowColor = GOLD; g.shadowBlur = 18; g.beginPath(); pts.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.closePath(); g.stroke(); g.restore(); }
function lands(a = 0.35) { territory('Belgium', '#FDDA24', a, {}); territory('Germany', '#8C857A', a, {}); territory('Netherlands', '#FF7F1E', a, {}); }
function mine(t, x, y, s) { g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = '#3A3026'; g.beginPath(); g.moveTo(-200, 120); g.lineTo(-200, -40); g.quadraticCurveTo(0, -200, 200, -40); g.lineTo(200, 120); g.fill();
  g.fillStyle = '#0B0908'; g.beginPath(); g.moveTo(-110, 120); g.lineTo(-110, 0); g.quadraticCurveTo(0, -100, 110, 0); g.lineTo(110, 120); g.fill(); g.strokeStyle = '#6E5236'; g.lineWidth = 16; g.beginPath(); g.moveTo(-120, 120); g.lineTo(-120, -6); g.quadraticCurveTo(0, -112, 120, -6); g.lineTo(120, 120); g.stroke();
  const cx = lerp(-40, 40, 0.5 + 0.5 * Math.sin(t)); g.fillStyle = '#5A5A60'; g.fillRect(cx - 60, 50, 120, 50); g.fillStyle = '#A8B0B8'; g.beginPath(); g.arc(cx - 20, 48, 20, 0, 6.283); g.arc(cx + 18, 44, 24, 0, 6.283); g.fill(); g.restore(); }
VIS.open = (K) => { K(0.2, 'whoosh', 0.9); K(2.0, 'pop', 0.8, 600);
  return (t) => { earth(t, camPath(t, [[0, 5, 45, 2.8, 0, 0], [0.15, NM[0], NM[1] - 0.01, 0.006, 42, 0]], { k: 10, d: 6.4 })); lands(0.35); triStripes(t, clamp((t - 1.6) * 3));
    flag('NM', 540, 1380, 260, t, { s: spring(t - 2.0, 260, 16) }); tag(t); hook(t, EP.hook, 480); }; };
VIS[0] = (K) => { K(0.45, 'hit', 0.9); K(1.6, 'thump', 0.8); K(3.2, 'pop', 0.8, 600);
  return (t) => { const sky = g.createLinearGradient(0, 0, 0, H); sky.addColorStop(0, '#120E0A'); sky.addColorStop(1, '#2C2218'); g.fillStyle = sky; g.fillRect(0, 0, W, H); glowDot(540, 1000, 500, '255,200,120', 0.12);
    mine(t, 540, 1080, 1.4 * spring(t - 1.4, 200, 18)); versus('PR', 'NL', 'PRUSSIA', 'NETHERLANDS', t, 3.0, 760);
    tag(t, 0, 4); yearTag(1816, t, 0.45); label('WHO GETS THE ZINC MINE?', 84, 625, t, 1.6, { color: GOLD }); }; };
VIS[1] = (K) => { K(0.45, 'whoosh', 0.7); K(1.2, 'pop', 0.9, 700); K(2.4, 'hit', 0.9);
  return (t) => { earth(t, camPath(t, [[0, NM[0], NM[1] - 0.01, 0.006, 42, 0], [0.1, NM[0], NM[1] - 0.008, 0.0035, 45, 10]], { k: 3, d: 3.4 })); lands(0.35); triStripes(t, 1);
    flagPin(6.024, 50.726, 'NM', t, 1.2, { w: 110, pole: 90, label: 'NEUTRAL MORESNET' }); tag(t, 1, 4); rgbPop('3.5 KM²', 80, 560, 200, GOLD, t, 2.4); label('NEUTRAL GROUND', 84, 625, t, 0.8); }; };
VIS[2] = (K) => { K(0.45, 'hit', 0.9); K(1.6, 'pop', 1, 900);
  return (t) => { earth(t, camPath(t, [[0, NM[0], NM[1] - 0.008, 0.0035, 45, 10], [0.1, NM[0], NM[1] - 0.008, 0.0038, 40, -8]], { k: 2, d: 2.8 })); lands(0.35); triStripes(t, 1, ['#009900', '#009900', '#FFFFFF']);
    flagPin(6.024, 50.726, 'EO', t, 1.0, { w: 120, pole: 90 }); tag(t, 2, 4); yearTag(1908, t, 0.45, { color: '#7CFC7C' });
    rgbPop('"AMIKEJO"', 80, 700, 110, '#7CFC7C', t, 1.6); label('= "FRIENDSHIP PLACE" · ESPERANTO', 84, 760, t, 2.0); }; };
VIS[3] = (K) => { K(0.45, 'hit', 1); K(1.6, 'scratch'); K(1.62, 'thump', 1.1); K(3.2, 'swish', 0.8);
  return (t) => { earth(t, camPath(t, [[0, NM[0], NM[1] - 0.008, 0.0038, 40, -8], [2.6, NM[0], NM[1] - 0.01, 0.012, 30, 0]], { k: 4, d: 4 })); lands(0.35);
    const be = clamp((t - 1.0) * 2), gone = clamp((t - 3.0) / 1.2); triStripes(t, (1 - be) * (1 - gone)); triStripes(t, be * (1 - gone), ['#000000', '#FDDA24', '#EF3340']);
    tag(t, 3, 4); yearTag(1920, t, 0.45); stampText('TREATY OF VERSAILLES', 540, 820, t, 1.6, { size: 54, rot: -0.07 }); if (t > 3.4) label('TODAY: KELMIS, BELGIUM', 84, 625, t, 3.4, { color: GOLD });
    if (!photoCard(t, 'lead', 620, 960, 360, 260, 4.4, 'NEUTRAL MORESNET')) {} }; };
