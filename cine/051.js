// Wiki Roulette #051 — Challenger Deep: Everest would vanish in it
const CD = [142.2, 11.37], SURF = 780, FLOOR = 1580, PXM = (FLOOR - SURF) / 10935;
function section(t, o = {}) { const sky = g.createLinearGradient(0, 0, 0, SURF); sky.addColorStop(0, '#05080C'); sky.addColorStop(1, '#122230'); g.fillStyle = sky; g.fillRect(0, 0, W, SURF);
  const sea = g.createLinearGradient(0, SURF, 0, FLOOR); sea.addColorStop(0, '#1B5E86'); sea.addColorStop(0.35, '#0B2A45'); sea.addColorStop(1, '#02070E'); g.fillStyle = sea; g.fillRect(0, SURF, W, H - SURF);
  g.fillStyle = 'rgba(160,220,255,0.5)'; for (let x = 0; x < W; x += 6) g.fillRect(x, SURF + Math.sin(x / 40 + t * 3) * 3, 6, 3);
  g.fillStyle = '#1A1612'; g.beginPath(); g.moveTo(0, SURF + 260); g.lineTo(240, SURF + 300); g.lineTo(380, FLOOR - 40); g.lineTo(460, FLOOR); g.lineTo(760, FLOOR); g.lineTo(840, FLOOR - 60); g.lineTo(960, SURF + 340); g.lineTo(W, SURF + 300); g.lineTo(W, H); g.lineTo(0, H); g.fill();
  if (o.ever > 0) { const h = 8849 * PXM * o.ever, b = FLOOR, x = 610; g.fillStyle = '#5E5A55'; g.beginPath(); g.moveTo(x - 250, b); g.lineTo(x - 40, b - h * 0.86); g.lineTo(x, b - h); g.lineTo(x + 60, b - h * 0.9); g.lineTo(x + 230, b); g.fill();
    g.fillStyle = '#E8EEF2'; g.beginPath(); g.moveTo(x - 34, b - h * 0.86); g.lineTo(x, b - h); g.lineTo(x + 52, b - h * 0.9); g.lineTo(x + 24, b - h * 0.84); g.lineTo(x, b - h * 0.88); g.fill(); }
  marineSnow(t, 20, 0.5); }
function ruler(t, t0, d) { const v = ramp(t, t0, d, 0, 10935), y = SURF + v * PXM; g.strokeStyle = 'rgba(255,255,255,0.35)'; g.lineWidth = 2; g.beginPath(); g.moveTo(1000, SURF); g.lineTo(1000, FLOOR); g.stroke();
  for (let m = 0; m <= 10000; m += 1000) { g.fillRect(990, SURF + m * PXM, 20, 2); } g.fillStyle = GOLD; g.beginPath(); g.moveTo(1000, y); g.lineTo(970, y - 14); g.lineTo(970, y + 14); g.fill(); return v; }
VIS.open = (K) => { K(0.6, 'whoosh', 0.8); K(1.4, 'splash', 1.1); K(2.4, 'bubble', 0.8);
  return (t) => { if (!photoBG(t, 'lead', { zoom: [1.05, 1.2], dur: 4 })) { section(t, { ever: 0 }); const y = lerp(-700, 1040, ease((t - 0.3) / 1.6)) + Math.max(0, t - 1.9) * 60;
      g.save(); g.translate(0, y - FLOOR); const h = 8849 * PXM; g.fillStyle = '#5E5A55'; g.beginPath(); g.moveTo(360, FLOOR); g.lineTo(610, FLOOR - h); g.lineTo(840, FLOOR); g.fill(); g.fillStyle = '#E8EEF2'; g.beginPath(); g.moveTo(576, FLOOR - h * 0.86); g.lineTo(610, FLOOR - h); g.lineTo(640, FLOOR - h * 0.88); g.fill(); g.restore();
      if (t > 1.4) bubbles(t, 610, SURF + 40, 20, 3, 1.4, 120); }
    tag(t); hook(t, EP.hook, 480); }; };
VIS[0] = (K) => { K(0.5, 'whoosh', 0.7); K(1.5, 'sonar', 1); K(3.4, 'sonar', 0.7);
  return (t) => { atmosphere(t); stars(t, 120); const c = globeCam(t, [[0, 175, 25, 430], [0.3, CD[0], CD[1], 430], [1.3, CD[0], CD[1], 1250]]);
    const P = globe(t, 540, 1020, c.R, c.lon, c.lat, { land: '#3B4A2E' }); const [x, y] = P(...CD); pinAt(x, y, t, 1.5, null, { color: '#7FE8FF' });
    if (t > 1.6) { g.strokeStyle = 'rgba(127,232,255,0.6)'; g.lineWidth = 3; g.setLineDash([12, 10]); g.beginPath(); g.arc(x, y, 60 + 6 * Math.sin(t * 3), 0, 6.283); g.stroke(); g.setLineDash([]); }
    tag(t, 0, 5); rgbPop('CHALLENGER DEEP', 80, 560, fit('CHALLENGER DEEP', 'disp', 130, 920), TXT, t, 0.45); label('MARIANA TRENCH · PACIFIC OCEAN', 84, 625, t, 1.2, { color: '#7FE8FF' });
    if (t > 2.4) chip('DEEPEST KNOWN POINT', 80, 700, t, 2.4, { size: 34, align: 'left', bg: '#7FE8FF', fg: BG }); }; };
VIS[1] = (K) => { K(0.5, 'riser', 0.5, 2); for (let i = 0; i < 11; i++) K(0.6 + i * 0.16, 'tick', 0.45); K(2.5, 'hit', 1); K(3.4, 'thump', 1.1); K(4.4, 'pop', 0.8, 600);
  return (t) => { section(t, { ever: ease((t - 3.2) / 1.0) }); const v = ruler(t, 0.6, 1.9); tag(t, 1, 5);
    rgbPop(`${fmt(v)} M`, 80, 560, 170, v >= 10935 ? '#7FE8FF' : TXT, t, 0.45); label('OCEAN DEPTH', 84, 625, t, 0.8, { color: '#7FE8FF' });
    if (t > 3.4) { popNum('EVEREST: 8,849 M', 80, 720, fit('EVEREST: 8,849 M', 'disp', 70, 920), GOLD, t, 3.4); } }; };
VIS[2] = (K) => { K(0.5, 'swish', 0.6); K(1.2, 'hit', 1);
  return (t) => { section(t, { ever: 1 }); tag(t, 2, 5); const top = FLOOR - 8849 * PXM, p = ease((t - 0.5) / 0.7);
    g.strokeStyle = GOLD; g.lineWidth = 6; g.beginPath(); g.moveTo(700, SURF + 4); g.lineTo(740, SURF + 4); g.lineTo(740, lerp(SURF, top, p)); g.lineTo(700, lerp(SURF, top, p)); g.stroke();
    g.fillStyle = 'rgba(255,194,61,0.18)'; g.fillRect(0, SURF + 6, W, (top - SURF) * p);
    rgbPop('2+ KM', 80, 560, 220, GOLD, t, 1.2); label('OF WATER ABOVE THE SUMMIT', 84, 630, t, 1.5); }; };
VIS[3] = (K) => { for (let i = 0; i < 6; i++) K(0.5 + i * 0.3, 'thump', 0.5 + i * 0.1); K(2.3, 'crack', 1); K(2.35, 'hit', 1);
  return (t) => { atmosphere(t, { x: 540, y: 1000, r: 800, c: 'rgba(127,232,255,0.08)' }); tag(t, 3, 5);
    const sq = ease((t - 0.4) / 1.9), s = lerp(300, 150, sq), cx = 540, cy = 1000; g.save(); g.translate(cx + shake(t, 2.3, 12), cy);
    g.fillStyle = '#C9C3B8'; g.beginPath(); for (let i = 0; i < 16; i++) { const a = i / 16 * 6.283, rr = s * (1 + (i % 2 ? -0.12 : 0.05) * sq); g.lineTo(Math.cos(a + 0.2) * rr * 0.85, Math.sin(a + 0.2) * rr * 0.85); } g.fill(); g.restore();
    for (let i = 0; i < 8; i++) { const a = i / 8 * 6.283, d = s + 80 + 30 * Math.sin(t * 8 + i); g.save(); g.translate(cx + Math.cos(a) * d, cy + Math.sin(a) * d); g.rotate(a + Math.PI); g.fillStyle = '#7FE8FF'; g.beginPath(); g.moveTo(40, 0); g.lineTo(-10, -26); g.lineTo(-10, 26); g.fill(); g.fillRect(-60, -8, 52, 16); g.restore(); }
    rgbPop('1,000×', 80, 600, 230, '#7FE8FF', t, 0.45); label('THE PRESSURE AT THE SURFACE', 84, 670, t, 1.0); }; };
VIS[4] = (K) => { for (let i = 0; i < 27; i++) K(0.6 + i * 0.07, 'tick', 0.4); K(2.6, 'land', 0.9);
  return (t) => { section(t, { ever: 0 }); g.fillStyle = 'rgba(5,8,12,0.55)'; g.fillRect(0, 0, W, H); tag(t, 4, 5);
    const n = Math.min(27, Math.floor(clamp((t - 0.6) / 1.9) * 27 + 1e-6)); iconGrid(n, 9, 150, 870, 98, 128, (x, y, i) => human(x, y, 100 * spring(t - 0.6 - i * 0.07, 300, 18), i === n - 1 && n < 27 ? GOLD : TXT));
    rgbPop(`${n}`, 80, 620, 260, GOLD, t, 0.45); label('PEOPLE HAVE EVER BEEN DOWN THERE', 84, 690, t, 2.6, { size: 28 }); }; };
