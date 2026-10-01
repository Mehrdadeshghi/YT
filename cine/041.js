// Wiki Roulette #041 — Kentucky meat shower (3 March 1876)
const MEAT = ['#B0473E', '#C9625A', '#8E3530'];
function meatRain(t, t0, n = 60, ground = 1150, seed = 4) { const r = rng(seed);
  for (let i = 0; i < n; i++) { const st = t0 + r() * 3, x = r() * W, s = 8 + r() * 16, v = 700 + r() * 500, lt = t - st; if (lt < 0) continue; const y = -40 + lt * v;
    const yy = Math.min(y, ground + r() * 60); g.save(); g.translate(x, yy); g.rotate(y < ground ? lt * 6 : r() * 3); g.fillStyle = MEAT[i % 3]; g.beginPath(); g.ellipse(0, 0, s, s * 0.7, 0, 0, 6.283); g.fill(); g.fillStyle = 'rgba(255,230,220,0.35)'; g.fillRect(-s * 0.4, -2, s * 0.8, 3); g.restore(); } }
function farm(t) { const sky = g.createLinearGradient(0, 0, 0, 1150); sky.addColorStop(0, '#6E8AA6'); sky.addColorStop(1, '#C9D6DE'); g.fillStyle = sky; g.fillRect(0, 0, W, H);
  g.fillStyle = '#5A7A3A'; g.beginPath(); g.moveTo(0, 1100); g.quadraticCurveTo(540, 1040, W, 1110); g.lineTo(W, H); g.lineTo(0, H); g.fill(); g.fillStyle = '#4A6A30'; g.fillRect(0, 1150, W, H - 1150);
  g.fillStyle = '#7A3A2A'; g.fillRect(760, 960, 200, 150); g.beginPath(); g.moveTo(740, 960); g.lineTo(860, 880); g.lineTo(980, 960); g.fill(); }
VIS.open = (K) => { K(0.4, 'whoosh', 0.6); for (let i = 0; i < 14; i++) K(0.6 + i * 0.22, 'thump', 0.25);
  return (t) => { farm(t); meatRain(t, -2.5, 70); g.fillStyle = 'rgba(12,11,10,0.45)'; g.fillRect(0, 0, W, 760); hookPhoto(t, 'lead', { y: 800, h: 460 }); tag(t); hook(t, EP.hook, 500); }; };
VIS[0] = (K) => { K(1.2, 'land', 0.6); for (let i = 0; i < 10; i++) K(2.4 + i * 0.18, 'thump', 0.3);
  return (t) => { if (t < 2.2) { atmosphere(t); const cam = camLerp(t, 0.2, 28, 11, [-95, 39, 40], [-84.5, 38, 9], 900); darkMap(cam); const [x, y] = cam.P(-83.7, 38.08); pinAt(x, y, t, 1.2, 'KENTUCKY', { size: 60 }); }
    else { farm(t); meatRain(t, 2.2, 60); }
    tag(t, 0, 4); popNum('MARCH 3, 1876', 80, 520, fit('MARCH 3, 1876', 'disp', 140, 920), t < 2.2 ? TXT : PINK, t, 0.45); label('OLYMPIA SPRINGS, BATH COUNTY', 84, 580, t, 1.0, { color: t < 2.2 ? GOLD : PINK }); }; };
VIS[1] = (K) => { K(0.6, 'pop', 0.8, 500); for (let i = 0; i < 10; i++) K(0.9 + i * 0.05, 'tick', 0.4); K(2.8, 'pop', 0.8, 800); K(3.8, 'pop', 0.8, 650);
  return (t) => { atmosphere(t); tag(t, 1, 4); const s = spring(t - 0.5, 260, 18);
    if (s > 0) { g.save(); g.translate(540, 900); g.scale(s, s); g.fillStyle = MEAT[0]; g.beginPath(); g.ellipse(0, 0, 150, 110, 0.2, 0, 6.283); g.fill(); g.fillStyle = 'rgba(255,230,220,0.35)'; g.beginPath(); g.ellipse(-30, -30, 70, 18, 0.2, 0, 6.283); g.fill(); g.restore(); }
    g.strokeStyle = GOLD; g.lineWidth = 5; g.beginPath(); g.moveTo(390, 1060); g.lineTo(690, 1060); g.moveTo(390, 1040); g.lineTo(390, 1080); g.moveTo(690, 1040); g.lineTo(690, 1080); g.stroke();
    popNum('UP TO 10 CM', 540, 1140, 64, GOLD, t, 1.0, { align: 'center' });
    popNum('THEY TASTED IT.', 80, 520, fit('THEY TASTED IT.', 'disp', 130, 920), TXT, t, 2.4);
    if (t > 3.8) { chip('LAMB?', 80, 620, t, 3.8, { size: 34, align: 'left' }); chip('DEER?', 300, 620, t, 4.2, { size: 34, align: 'left' }); } }; };
VIS[2] = (K) => { K(0.5, 'zap', 0.5); K(2.2, 'thump', 0.8); K(3.4, 'hit', 1);
  return (t) => { atmosphere(t); tag(t, 2, 4); const cx = 540, cy = 900, R = 300;
    g.save(); g.beginPath(); g.arc(cx, cy, R, 0, 6.283); g.clip(); g.fillStyle = '#F2C6C2'; g.fillRect(cx - R, cy - R, 2 * R, 2 * R); const r = rng(7);
    for (let i = 0; i < 60; i++) { g.strokeStyle = 'rgba(176,71,62,0.6)'; g.lineWidth = 3; g.beginPath(); g.ellipse(cx + (r() - 0.5) * 520, cy + (r() - 0.5) * 520, 20 + r() * 30, 14 + r() * 20, r() * 3, 0, 6.283); g.stroke(); }
    g.restore(); g.lineWidth = 20; g.strokeStyle = '#2B2A28'; g.beginPath(); g.arc(cx, cy, R, 0, 6.283); g.stroke();
    popNum('LUNG TISSUE', 80, 520, fit('LUNG TISSUE', 'disp', 150, 920), TXT, t, 0.45);
    if (t > 2.2) chip('HORSE…', 80, 620, t, 2.2, { size: 34, align: 'left', bg: '#2B2A28', fg: TXT }); if (t > 3.4) chip('OR A HUMAN BABY', 300, 620, t, 3.4, { size: 34, align: 'left', bg: RED, fg: TXT }); }; };
VIS[3] = (K) => { K(0.6, 'swish', 0.6); K(2.4, 'splash', 0.5);
  return (t) => { farm(t); g.fillStyle = 'rgba(12,11,10,0.35)'; g.fillRect(0, 0, W, 800); tag(t, 3, 4);
    for (let i = 0; i < 4; i++) { const x = ((i * 300 + t * 140) % 1300) - 100, y = 820 + Math.sin(t * 2 + i) * 30, f = Math.sin(t * 8 + i) * 0.5;
      g.save(); g.translate(x, y); g.fillStyle = '#1E1A16'; g.beginPath(); g.ellipse(0, 0, 40, 16, 0, 0, 6.283); g.fill(); g.beginPath(); g.moveTo(-10, 0); g.lineTo(-120, -50 * f - 10); g.lineTo(-30, 8); g.fill(); g.beginPath(); g.moveTo(10, 0); g.lineTo(120, -50 * f - 10); g.lineTo(30, 8); g.fill();
      g.fillStyle = '#C9625A'; g.beginPath(); g.arc(40, 0, 10, 0, 6.283); g.fill(); g.restore(); }
    if (t > 2.4) meatRain(t, 2.4, 25, 1150, 9);
    popNum('VULTURES.', 80, 560, fit('VULTURES.', 'disp', 170, 920), GOLD, t, 0.6); label('THE LEADING EXPLANATION', 84, 620, t, 1.0); }; };
