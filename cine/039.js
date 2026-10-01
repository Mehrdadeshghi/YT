// Wiki Roulette #039 — Point Nemo
const NEMO = [-123.39, -48.88], LANDS = [[-124.78, -24.68, 'DUCIE ISLAND'], [-109.45, -27.2, 'MOTU NUI'], [-125.5, -72.9, 'ANTARCTICA']];
function iss(x, y, s, t) { g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = '#C9D2DA'; g.fillRect(-14, -10, 28, 20); g.fillRect(-90, -3, 180, 6);
  g.fillStyle = '#3A5A8A'; [-80, -50, 30, 60].forEach((px) => g.fillRect(px, -40, 22, 80)); g.restore(); }
function earthLimb(t, cy = 1500) { const gr = g.createRadialGradient(540, cy + 1800, 1700, 540, cy + 1800, 1900); gr.addColorStop(0, '#1E5A8A'); gr.addColorStop(0.97, '#3D8AC9'); gr.addColorStop(1, 'rgba(120,190,255,0)');
  g.fillStyle = gr; g.beginPath(); g.arc(540, cy + 1800, 1900, 0, 6.283); g.fill(); }
VIS.open = (K) => { K(0.2, 'sonar', 0.7); K(2.6, 'pop', 0.7, 900);
  return (t) => { atmosphere(t); snowfall(t * 0.1, 60, 0.4, 9); earthLimb(t, 1250); iss(lerp(200, 880, t / 4.5), 980, 1.2, t);
    g.fillStyle = GOLD; g.beginPath(); g.arc(560, 1290, 10, 0, 6.283); g.fill(); g.strokeStyle = GOLD; g.setLineDash([10, 10]); g.lineWidth = 3; g.beginPath(); g.moveTo(560, 1280); g.lineTo(560, 1010); g.stroke(); g.setLineDash([]);
    hookPhoto(t, 'lead', { y: 800, h: 470 }); tag(t); hook(t, EP.hook, 500); }; };
VIS[0] = (K) => { K(1.2, 'land', 0.7); K(2.4, 'sonar', 0.8);
  return (t) => { atmosphere(t, { x: 540, y: 1000, r: 800, c: 'rgba(67,198,217,0.08)' }); const cam = camLerp(t, 0.2, 26, 10.5, [-100, -20, 160], [-118, -45, 75], 980); darkMap(cam, { glow: 'rgba(67,198,217,0.1)' });
    const [x, y] = cam.P(...NEMO); pinAt(x, y, t, 1.2, 'POINT NEMO', { size: 56, color: TEAL }); tag(t, 0, 4);
    popNum('FARTHEST', 80, 520, 150, TXT, t, 0.45); popNum('FROM ANY LAND', 80, 640, fit('FROM ANY LAND', 'disp', 110, 920), TEAL, t, 0.7); }; };
VIS[1] = (K) => { LANDS.forEach((l, i) => K(0.8 + i * 0.3, 'pop', 0.7, 500 + i * 150)); for (let i = 0; i < 14; i++) K(2.2 + i * 0.08, 'tick', 0.4); K(3.4, 'land', 0.8);
  return (t) => { atmosphere(t); const cam = mapCam(-118, -48, 75, 1080); darkMap(cam, { glow: 'rgba(67,198,217,0.1)' }); const [nx, ny] = cam.P(...NEMO);
    LANDS.forEach(([lo, la, n], i) => { const p = ease((t - 0.8 - i * 0.3) / 0.7); if (p <= 0) return; const [x, y] = cam.P(lo, la);
      g.strokeStyle = TEAL; g.lineWidth = 4; g.setLineDash([12, 10]); g.beginPath(); g.moveTo(nx, ny); g.lineTo(lerp(nx, x, p), lerp(ny, y, p)); g.stroke(); g.setLineDash([]);
      if (p >= 1) { g.fillStyle = TXT; g.beginPath(); g.arc(x, y, 8, 0, 6.283); g.fill(); text(n, x + 16, y + 8, 'mono', 22, DIM, { ls: 2 }); } });
    g.fillStyle = GOLD; g.beginPath(); g.arc(nx, ny, 12, 0, 6.283); g.fill(); tag(t, 1, 4);
    popNum(`${fmt(countTo(t, 2.2, 1.2, 2688, 0.7))} KM`, 80, 560, 170, TXT, t, 2.1); label('TO THE NEAREST LAND', 84, 620, t, 2.4); }; };
VIS[2] = (K) => { K(0.6, 'whoosh', 0.8); K(2.0, 'pop', 0.9, 900);
  return (t) => { atmosphere(t); earthLimb(t, 1150); tag(t, 2, 4); const sy = 1150, iy = lerp(sy - 80, 640, ease((t - 0.4) / 1.4));
    iss(560, iy, 1.4, t); g.strokeStyle = GOLD; g.lineWidth = 4; g.setLineDash([12, 10]); g.beginPath(); g.moveTo(560, sy); g.lineTo(560, iy + 50); g.stroke(); g.setLineDash([]);
    g.fillStyle = GOLD; g.beginPath(); g.arc(560, sy, 10, 0, 6.283); g.fill();
    popNum('~400 KM', 620, (sy + iy) / 2 + 20, 90, GOLD, t, 2.0); popNum('ISS', 80, 520, 170, TXT, t, 0.45); }; };
VIS[3] = (K) => { for (let i = 0; i < 6; i++) K(0.6 + i * 0.45, 'whoosh', 0.4); for (let i = 0; i < 6; i++) K(1.0 + i * 0.45, 'splash', 0.35); K(4.6, 'hit', 0.9);
  return (t) => { atmosphere(t, { x: 540, y: 1000, r: 800, c: 'rgba(255,120,60,0.08)' }); tag(t, 3, 4);
    for (let i = 0; i < 6; i++) { const lt = t - 0.6 - i * 0.45; if (lt < 0 || lt > 0.6) continue; const p = lt / 0.6, x = lerp(900 - i * 60, 450 + i * 30, p), y = lerp(380, 1080, p);
      g.strokeStyle = 'rgba(255,170,90,0.8)'; g.lineWidth = 8; g.beginPath(); g.moveTo(x + 120, y - 180); g.lineTo(x, y); g.stroke(); g.fillStyle = '#FFE0B0'; g.beginPath(); g.arc(x, y, 9, 0, 6.283); g.fill(); }
    waterOver(t, 1100, { c1: '#103048' });
    popNum('SPACECRAFT', 80, 520, fit('SPACECRAFT', 'disp', 150, 920), TXT, t, 0.45); popNum('CEMETERY', 80, 660, 150, '#FFAA5A', t, 0.6);
    if (t > 4.6) chip('ISS · PLANNED FOR 2031', 80, 760, t, 4.6, { size: 32, align: 'left' }); }; };
