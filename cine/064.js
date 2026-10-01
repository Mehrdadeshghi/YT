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
function wedge(w, h, t, cols, o = {}) { g.fillStyle = '#2E3A2A'; g.fillRect(0, 0, w, h); g.fillStyle = o.west || 'rgba(255,127,30,0.45)'; g.beginPath(); g.moveTo(0, 0); g.lineTo(w * 0.47, 0); g.lineTo(w * 0.47, h); g.lineTo(0, h); g.fill();
  g.fillStyle = 'rgba(140,133,122,0.55)'; g.beginPath(); g.moveTo(w * 0.53, 0); g.lineTo(w, 0); g.lineTo(w, h); g.lineTo(w * 0.53, h); g.fill();
  const T = [[w * 0.47, h * 0.92], [w * 0.53, h * 0.92], [w * 0.5, h * 0.06]]; const path = new Path2D(); T.forEach(([x, y], i) => i ? path.lineTo(x, y) : path.moveTo(x, y)); path.closePath();
  const A = [[w * 0.32, h * 0.95], [w * 0.68, h * 0.95], [w * 0.5, h * 0.08]], tri = new Path2D(); A.forEach(([x, y], i) => i ? tri.lineTo(x, y) : tri.moveTo(x, y)); tri.closePath();
  g.save(); g.globalAlpha = o.a ?? 1; g.clip(tri); cols.forEach((c, i) => { g.fillStyle = c; g.fillRect(0, h * (0.08 + 0.87 * i / cols.length), w, h * 0.87 / cols.length + 1); }); g.restore();
  g.save(); g.globalAlpha = o.a ?? 1; g.strokeStyle = GOLD; g.lineWidth = 5; g.shadowColor = GOLD; g.shadowBlur = 16; g.stroke(tri); g.restore();
  g.strokeStyle = 'rgba(255,255,255,0.7)'; g.lineWidth = 3; g.setLineDash([12, 9]); g.beginPath(); g.moveTo(w * 0.32, 0); g.lineTo(w * 0.32, h); g.moveTo(w * 0.68, 0); g.lineTo(w * 0.68, h); g.stroke(); g.setLineDash([]);
  mapLabel(o.wl || 'NETHERLANDS', 24, h - 26, '#FFD0A0', 26); mapLabel('PRUSSIA', w - 160, h - 26, '#E0DCD4', 26); }
VIS[1] = (K) => { K(0.45, 'whoosh', 0.7); K(1.2, 'pop', 0.9, 700); K(2.4, 'hit', 0.9);
  return (t) => { earth(t, camPath(t, [[0, NM[0], NM[1] - 0.01, 0.006, 42, 0], [0.1, NM[0], NM[1] - 0.05, 0.02, 40, 10]], { k: 3, d: 3.4 })); lands(0.5); place(6.02, 50.72, 'MORESNET', t, 0.5, { color: GOLD, size: 36 });
    g.fillStyle = 'rgba(2,6,14,0.3)'; g.fillRect(0, 0, W, H); inset(t, 0.9, 'NEUTRAL MORESNET · 1816–1920', (w, h) => wedge(w, h, t, ['#111111', '#FFFFFF', '#2A6FDB']));
    tag(t, 1, 4); rgbPop('3.5 KM²', 80, 560, 200, GOLD, t, 2.4); label('NEUTRAL GROUND', 84, 625, t, 0.8); }; };
VIS[2] = (K) => { K(0.45, 'hit', 0.9); K(1.6, 'pop', 1, 900);
  return (t) => { earth(t, camPath(t, [[0, NM[0], NM[1] - 0.05, 0.02, 40, 10], [0.1, NM[0], NM[1] - 0.05, 0.022, 44, -10]], { k: 2, d: 2.8 })); lands(0.5); g.fillStyle = 'rgba(2,6,14,0.3)'; g.fillRect(0, 0, W, H);
    inset(t, -1, 'AMIKEJO · "FRIENDSHIP PLACE"', (w, h) => { const k = clamp((t - 0.8) * 1.5); wedge(w, h, t, ['#111111', '#FFFFFF', '#2A6FDB'], { a: 1 - k }); wedge(w, h, t, ['#009900', '#009900', '#FFFFFF'], { a: k }); flag('EO', w / 2, h * 0.55, 130 * spring(t - 1.6, 260, 16), t); });
    tag(t, 2, 4); yearTag(1908, t, 0.45, { color: '#7CFC7C' }); label('PLAN: THE FIRST ESPERANTO STATE', 84, 625, t, 1.0, { color: '#7CFC7C', size: 26 }); }; };
VIS[3] = (K) => { K(0.45, 'hit', 1); K(1.6, 'scratch'); K(1.62, 'thump', 1.1); K(3.2, 'swish', 0.8);
  return (t) => { earth(t, camPath(t, [[0, NM[0], NM[1] - 0.05, 0.022, 44, -10], [2.6, NM[0], NM[1] - 0.03, 0.035, 36, 15]], { k: 3, d: 3.4 })); lands(0.5); g.fillStyle = 'rgba(2,6,14,0.3)'; g.fillRect(0, 0, W, H);
    const be = clamp((t - 1.0) * 2), gone = clamp((t - 3.0) / 1.2);
    inset(t, -1, t < 3.4 ? 'NEUTRAL MORESNET' : 'TODAY: KELMIS, BELGIUM', (w, h) => { wedge(w, h, t, ['#111111', '#FFFFFF', '#2A6FDB'], { a: 1 - be, wl: 'BELGIUM' }); wedge(w, h, t, ['#000000', '#FDDA24', '#EF3340'], { a: be * (1 - gone), wl: 'BELGIUM' });
      if (gone > 0) { g.globalAlpha = gone; g.fillStyle = 'rgba(232,68,58,0.45)'; g.fillRect(0, 0, w * 0.5, h); g.globalAlpha = 1; mapLabel('KELMIS', w / 2 - 70, h / 2, TXT, 32); } });
    tag(t, 3, 4); yearTag(1920, t, 0.45); stampText('TREATY OF VERSAILLES', 540, 1000, t, 1.6, { size: 54, rot: -0.07 });
    if (t > 5.5 && !photoCard(t, 'lead', 620, 380, 340, 230, 5.5, 'FLAG OF MORESNET')) {} }; };
