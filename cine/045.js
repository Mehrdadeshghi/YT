// Wiki Roulette #045 — Kowloon Walled City
function block(t, x, y, w, h, o = {}) { const r = rng(45); g.fillStyle = '#2C2A26'; g.fillRect(x, y - h, w, h);
  for (let yy = y - h + 6; yy < y - 6; yy += 16) for (let xx = x + 4; xx < x + w - 8; xx += 14) { const k = r(); g.fillStyle = k > 0.7 ? `rgba(255,200,120,${0.5 + 0.4 * Math.sin(t * 2 + k * 20)})` : k > 0.4 ? '#3E3A34' : '#1E1C19'; g.fillRect(xx, yy, 9, 10); }
  g.fillStyle = 'rgba(255,255,255,0.06)'; for (let i = 0; i < 14; i++) g.fillRect(x + r() * w, y - h, 3, h); }
VIS.open = (K) => { K(0.3, 'thump', 0.6); for (let i = 0; i < 12; i++) K(0.8 + i * 0.25, 'tick', 0.35);
  return (t) => { atmosphere(t); block(t, 90, 1330, 900, 480);
    hookPhoto(t, 'lead', { y: 800, h: 480 }); tag(t); hook(t, EP.hook, 500); }; };
VIS[0] = (K) => { K(1.0, 'land', 0.6); for (let i = 0; i < 12; i++) K(2.4 + i * 0.12, 'thump', 0.3);
  return (t) => { if (t < 2.3) { atmosphere(t); const cam = camLerp(t, 0.2, 28, 11, [114, 25, 30], [114.19, 22.33, 2], 950); darkMap(cam); const [x, y] = cam.P(114.19, 22.33); pinAt(x, y, t, 1.0, 'HONG KONG', { size: 60 }); }
    else { atmosphere(t); block(t, 90, 1180, 900, 560 * ease((t - 2.3) / 1.6)); }
    tag(t, 0, 4); popNum('KOWLOON', 80, 520, 150, TXT, t, 0.45); label('WALLED CITY · ~300 BUILDINGS, GROWN INTO ONE', 84, 580, t, 1.2, { size: 24 }); }; };
VIS[1] = (K) => { K(0.5, 'whoosh', 1); K(1.5, 'whoosh', 0.6); K(2.4, 'pop', 0.8, 500);
  return (t) => { atmosphere(t); block(t, 90, 1180, 900, 560); tag(t, 1, 4); const px = lerp(-300, 1300, (t - 0.3) / 2.2);
    g.save(); g.translate(px, 560); g.fillStyle = '#C9D2DA'; g.beginPath(); g.ellipse(0, 0, 160, 26, 0, 0, 6.283); g.fill(); g.beginPath(); g.moveTo(-20, 0); g.lineTo(-80, 90); g.lineTo(-30, 90); g.lineTo(40, 0); g.fill(); g.beginPath(); g.moveTo(-130, 0); g.lineTo(-170, -60); g.lineTo(-140, -60); g.lineTo(-110, 0); g.fill(); g.restore();
    g.strokeStyle = GOLD; g.lineWidth = 5; g.beginPath(); g.moveTo(1010, 1180); g.lineTo(1010, 620); g.stroke(); popNum('14', 900, 700, 110, GOLD, t, 2.4, { align: 'right' }); label('STORIES MAX', 1000, 760, t, 2.6, { align: 'right' });
    popNum('THE AIRPORT', 80, 520, fit('THE AIRPORT', 'disp', 140, 920), TXT, t, 0.45); }; };
VIS[2] = (K) => { K(0.5, 'pop', 0.6, 400); [1.7, 2.6].forEach((a) => K(a, 'zap', 0.5));
  return (t) => { atmosphere(t); block(t, 90, 1180, 900, 560); g.fillStyle = 'rgba(12,11,10,0.5)'; g.fillRect(0, 0, W, H); tag(t, 2, 4);
    popNum('NO GOVERNMENT', 80, 520, fit('NO GOVERNMENT', 'disp', 130, 920), TXT, t, 0.45); label('ALMOST NONE', 84, 580, t, 0.8);
    [['DENTIST', 300, 820, '#FF4D8A', 1.7], ['DOCTOR', 700, 960, '#43C6D9', 2.6]].forEach(([s, x, y, c, at]) => { const p = spring(t - at, 300, 14); if (p <= 0) return; const fl = 0.75 + 0.25 * Math.sin(t * 20);
      g.save(); g.translate(x, y); g.scale(p, p); rrect(-160, -50, 320, 100, 14); g.strokeStyle = c; g.globalAlpha = fl; g.lineWidth = 8; g.stroke(); text(s, 0, 20, 'disp', 60, c, { align: 'center' }); g.restore(); });
    if (t > 3.6) chip('UNLICENSED', 540, 1100, t, 3.6, { size: 34, bg: RED, fg: TXT }); }; };
VIS[3] = (K) => { for (let i = 0; i < 16; i++) K(0.5 + i * 0.08, 'tick', 0.4); K(3.4, 'crack', 1); K(3.5, 'hit', 1);
  return (t) => { atmosphere(t); tag(t, 3, 4); const fall = clamp((t - 3.4) / 1.4);
    g.save(); g.beginPath(); g.rect(0, 0, W, 1180); g.clip(); g.translate(shake(t, 3.4, 16), fall * fall * 600); block(t, 90, 1180, 900, 560); g.restore();
    if (fall > 0) { g.fillStyle = `rgba(150,140,125,${0.6 * fall})`; for (let i = 0; i < 10; i++) { g.beginPath(); g.arc(150 + i * 90, 1150 - fall * 120, 80 * fall, 0, 6.283); g.fill(); } }
    popNum(fmt(countTo(t, 0.5, 1.6, 1255000, 0.6)), 80, 520, fit('1,255,000', 'disp', 150, 920), TXT, t, 0.45); label('PEOPLE PER KM²', 84, 580, t, 0.8);
    if (t > 3.4) chip('DEMOLISHED · 1994', 80, 670, t, 3.5, { size: 34, align: 'left', bg: RED, fg: TXT }); }; };
