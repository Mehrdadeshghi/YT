// Wiki Roulette #042 — Emperor Norton
function crown(x, y, s, col = GOLD) { g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = col; g.beginPath(); g.moveTo(-100, 40); g.lineTo(-110, -50); g.lineTo(-55, 0); g.lineTo(0, -70); g.lineTo(55, 0); g.lineTo(110, -50); g.lineTo(100, 40); g.closePath(); g.fill();
  g.fillStyle = RED; [-110, 0, 110].forEach((cx, i) => { g.beginPath(); g.arc(cx, i === 1 ? -70 : -50, 12, 0, 6.283); g.fill(); }); g.restore(); }
VIS.open = (K) => { K(0.3, 'pop', 0.9, 800); K(2.0, 'land', 0.6);
  return (t) => { atmosphere(t, { x: 540, y: 1050, r: 800, c: 'rgba(255,194,61,0.14)' }); crown(540, 1080, 2.2 * (1 + 0.04 * Math.sin(t * 3)));
    hookPhoto(t, 'lead', { y: 800, h: 480, focus: [0.5, 0.25] }); tag(t); hook(t, EP.hook, 500); }; };
VIS[0] = (K) => { K(0.6, 'whoosh', 0.6); K(1.6, 'thump', 0.9); for (let i = 0; i < 30; i++) K(3.2 + i * 0.06, 'type', 0.35);
  return (t) => { atmosphere(t); tag(t, 0, 4);
    if (t < 3.0) { popNum('RICE', 80, 520, 170, TXT, t, 0.45); g.strokeStyle = RED; g.lineWidth = 10; g.lineJoin = 'round'; g.beginPath(); const p = clamp((t - 0.8) / 1.2);
      for (let i = 0; i <= 20 * p; i++) { const x = 120 + i * 42, y = 700 + (i < 10 ? -i * 8 : -80 + (i - 10) ** 2 * 6); i ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke(); if (t > 1.6) chip('FORTUNE: GONE', 80, 1000, t, 1.6, { size: 34, align: 'left', bg: RED, fg: TXT }); }
    else doc(540, 860, 860, 560, -0.02, t, 3.0, () => { text('SAN FRANCISCO DAILY EVENING BULLETIN', 0, -220, 'mono', 20, '#7A7266', { align: 'center', ls: 2 }); text('SEPT 17, 1859', 0, -170, 'mono', 22, '#7A7266', { align: 'center', ls: 3 });
      g.fillStyle = '#CFC6B5'; g.fillRect(-380, -145, 760, 3); typed('"I, Joshua Norton, declare and', -360, -60, 'serif', 40, PINK, t, 3.2, 1.0); typed('proclaim myself Emperor of', -360, 0, 'serif', 40, PINK, t, 4.1, 0.9); typed('these United States."', -360, 60, 'serif', 40, PINK, t, 4.9, 0.7); }); }; };
VIS[1] = (K) => { K(0.6, 'land', 0.7); K(2.2, 'scratch'); K(2.22, 'thump', 1); K(3.6, 'mute', 1, 0.6);
  return (t) => { atmosphere(t); tag(t, 1, 4);
    popNum('NORTON I', 80, 520, 150, GOLD, t, 0.45); doc(540, 880, 800, 380, 0.02, t, 0.9, () => { text('IMPERIAL DECREE', 0, -110, 'mono', 26, '#7A7266', { align: 'center', ls: 6 }); text('Congress is', 0, 0, 'serif', 60, PINK, { align: 'center' }); text('DISSOLVED', 0, 90, 'disp', 70, PINK, { align: 'center' }); });
    stampText('ORDERED', 760, 1020, t, 2.2, { size: 60, rot: -0.14, color: GOLD }); if (t > 3.6) popNum('IGNORED.', 540, 1180, 80, DIM, t, 3.6, { align: 'center' }); }; };
VIS[2] = (K) => { K(0.6, 'coin', 1); K(1.4, 'coin', 0.8); K(2.6, 'pop', 0.9, 700);
  return (t) => { atmosphere(t, { x: 540, y: 900, r: 800, c: 'rgba(255,194,61,0.10)' }); tag(t, 2, 4);
    popNum('SAN FRANCISCO', 80, 520, fit('SAN FRANCISCO', 'disp', 130, 920), TXT, t, 0.45); popNum('PLAYED ALONG', 80, 650, fit('PLAYED ALONG', 'disp', 110, 920), GOLD, t, 0.7);
    for (let i = 0; i < 3; i++) { const s = spring(t - 1.0 - i * 0.3, 220, 18); if (s <= 0) continue; g.save(); g.translate(540 + (i - 1) * 30, 950 + i * 30); g.rotate((i - 1) * 0.08); g.scale(s, s);
      rrect(-300, -120, 600, 240, 16); g.fillStyle = '#DCD3B0'; g.fill(); g.strokeStyle = '#6A7A4A'; g.lineWidth = 8; g.stroke();
      text('EMPIRE OF NORTON', 0, -50, 'mono', 26, '#3A4A2A', { align: 'center', ls: 4 }); text('50¢', 0, 50, 'disp', 90, '#3A4A2A', { align: 'center' }); crown(-220, 60, 0.3, '#6A7A4A'); g.restore(); }
    if (t > 2.6) stampText('ACCEPTED', 760, 1150, t, 2.6, { size: 54, rot: -0.12, color: '#2F7A4A' }); }; };
VIS[3] = (K) => { K(0.6, 'scratch', 0.6); K(2.4, 'riser', 0.4, 1); K(3.4, 'land', 0.9);
  return (t) => { atmosphere(t); tag(t, 3, 4); const wy = 1000;
    g.fillStyle = '#1C2A38'; g.fillRect(0, wy, W, 260); g.fillStyle = '#2A2620'; g.fillRect(0, wy - 40, 160, 300); g.fillRect(920, wy - 40, 160, 300);
    const p = ease((t - 1.0) / 2.2); g.strokeStyle = t > 3.3 ? GOLD : TXT; g.lineWidth = 6;
    g.beginPath(); g.moveTo(160, wy - 50); g.lineTo(lerp(160, 920, p), wy - 50); g.stroke();
    [400, 680].forEach((tx) => { if (p > (tx - 160) / 760) { g.fillRect(tx - 8, wy - 220, 16, 230); } });
    if (p > 0.5) { g.beginPath(); g.moveTo(160, wy - 60); g.quadraticCurveTo(280, wy - 80, 400, wy - 220); g.quadraticCurveTo(540, wy - 60, 680, wy - 220); g.quadraticCurveTo(800, wy - 80, lerp(680, 920, clamp((p - 0.7) / 0.3)), wy - 60); g.stroke(); }
    popNum('A BRIDGE', 80, 520, 150, TXT, t, 0.45); label('ONE OF HIS DECREES', 84, 580, t, 0.8, { color: DIM }); if (t > 3.4) chip('TODAY: THE BAY BRIDGE', 80, 680, t, 3.4, { size: 34, align: 'left' }); }; };
