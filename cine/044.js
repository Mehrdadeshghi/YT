// Wiki Roulette #044 — Charles Osborne: 68 years of hiccups
function hic(t, x, y, t0, s = 1) { const lt = t - t0; if (lt < 0 || lt > 0.8) return; const p = spring(lt, 400, 14);
  g.save(); g.translate(x, y - lt * 60); g.scale(p * s, p * s); g.globalAlpha = clamp(1 - (lt - 0.5) / 0.3); rrect(-110, -60, 220, 110, 50); g.fillStyle = TXT; g.fill();
  text('HIC!', 0, 22, 'disp', 64, PINK, { align: 'center' }); g.restore(); }
function hog(x, y, s) { g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = '#D9A0A0'; g.beginPath(); g.ellipse(0, 0, 150, 90, 0, 0, 6.283); g.fill(); g.beginPath(); g.ellipse(150, -10, 50, 44, 0, 0, 6.283); g.fill();
  g.fillStyle = '#C08080'; g.beginPath(); g.ellipse(195, -6, 18, 22, 0, 0, 6.283); g.fill(); g.fillRect(-110, 60, 30, 70); g.fillRect(70, 60, 30, 70); g.fillStyle = '#1A120C'; g.beginPath(); g.arc(160, -30, 6, 0, 6.283); g.fill(); g.restore(); }
VIS.open = (K) => { for (let i = 0; i < 7; i++) K(0.25 + i * 0.55, 'pop', 0.9, 260);
  return (t) => { atmosphere(t); person(540, 1260, 9, '#5A5A66'); for (let i = 0; i < 7; i++) hic(t, 540 + (i % 2 ? 120 : -120), 980, 0.25 + i * 0.55, 1.2);
    hookPhoto(t, 'lead', { y: 800, h: 470 }); tag(t); hook(t, EP.hook, 500); }; };
VIS[0] = (K) => { K(0.6, 'pop', 0.7, 500); K(3.6, 'whoosh', 0.8); K(4.2, 'thump', 1.3); K(4.25, 'hit', 0.8);
  return (t) => { atmosphere(t); tag(t, 0, 4); popNum('1922', 80, 520, 200, TXT, t, 0.45); label('CHARLES OSBORNE · IOWA FARMER', 84, 580, t, 1.0, { color: GOLD });
    const f = t < 3.6 ? 0 : ease((t - 3.6) / 0.6); g.save(); g.translate(shake(t, 4.2, 20), 0); person(560, 1180, 7, '#5A5A66'); hog(560, lerp(700, 1080, f), 1.2); g.restore();
    if (t > 4.4) chip('350-POUND HOG', 80, 680, t, 4.4, { size: 34, align: 'left', bg: RED, fg: TXT }); }; };
VIS[1] = (K) => { for (let i = 0; i < 6; i++) K(0.5 + i * 0.5, 'pop', 0.9, 260);
  return (t) => { atmosphere(t); tag(t, 1, 4); person(540, 1200, 8, '#5A5A66'); for (let i = 0; i < 6; i++) hic(t, 540 + (i % 2 ? 160 : -160), 920, 0.5 + i * 0.5, 1.3);
    popNum('HIC.', 80, 540, 140, TXT, t, 0.45); if (t > 1.6) popNum('HIC.', 520, 540, 140, GOLD, t, 1.6); if (t > 2.4) chip("IT DIDN'T STOP", 80, 640, t, 2.4, { size: 34, align: 'left' }); }; };
VIS[2] = (K) => { for (let i = 0; i < 20; i++) K(0.5 + i * 0.1, 'tick', 0.4); K(2.7, 'hit', 0.9); K(3.6, 'pop', 0.8, 800);
  return (t) => { atmosphere(t, { x: 540, y: 900, r: 800, c: 'rgba(255,194,61,0.10)' }); tag(t, 2, 4); const n = countTo(t, 0.5, 2.2, 430000000, 0.6);
    popNum(fmt(Math.round(n / 1e5) * 1e5), 80, 640, fit('430,000,000', 'disp', 170, 920), n >= 4.3e8 ? GOLD : TXT, t, 0.45); label('HICCUPS · ESTIMATED', 84, 700, t, 1.0);
    if (t > 3.6) chip('GUINNESS WORLD RECORD', 80, 800, t, 3.6, { size: 34, align: 'left' });
    for (let i = 0; i < 8; i++) hic(t, 200 + (i * 137) % 700, 1050 + (i % 3) * 60, 0.5 + i * 0.4, 0.8); }; };
VIS[3] = (K) => { K(0.6, 'pop', 0.8, 260); K(1.2, 'mute', 1, 2.5); K(2.2, 'thump', 0.8);
  return (t) => { atmosphere(t); tag(t, 3, 4); person(540, 1200, 8, '#5A5A66'); hic(t, 380, 920, 0.6, 1.3);
    popNum('1990', 80, 540, 200, TXT, t, 0.45); if (t > 2.2) stampText('STOPPED.', 540, 820, t, 2.2, { size: 100, rot: -0.08, color: GOLD }); }; };
