// Wiki Roulette #048 — Oymyakon, the coldest inhabited place
function thermo(x, y, h, temp, t) { const lo = -70, hi = 20, u = (temp - lo) / (hi - lo); g.save(); g.translate(x, y); rrect(-34, -h, 68, h, 34); g.fillStyle = '#EDE6D8'; g.fill();
  g.fillStyle = '#6FB7E8'; g.fillRect(-16, -h * u * 0.86 - 40, 32, h * u * 0.86 + 40); g.beginPath(); g.arc(0, 20, 56, 0, 6.283); g.fill();
  for (let c = -60; c <= 20; c += 20) { const yy = -40 - (c - lo) / (hi - lo) * h * 0.86; g.fillStyle = '#7A7266'; g.fillRect(36, yy - 2, 24, 4); text(`${c}°`, 70, yy + 9, 'mono', 24, DIM); } g.restore(); }
function village(t, smoke = 1) { const sky = g.createLinearGradient(0, 0, 0, 1150); sky.addColorStop(0, '#0A1220'); sky.addColorStop(1, '#5A7A9A'); g.fillStyle = sky; g.fillRect(0, 0, W, H);
  g.fillStyle = '#EAF2F8'; g.fillRect(0, 1150, W, H - 1150); g.beginPath(); g.moveTo(0, 1000); g.lineTo(300, 820); g.lineTo(520, 960); g.lineTo(800, 780); g.lineTo(W, 980); g.lineTo(W, 1160); g.lineTo(0, 1160); g.fillStyle = '#C9D6E2'; g.fill();
  for (let i = 0; i < 6; i++) { const x = 100 + i * 160, y = 1150; g.fillStyle = '#5A4030'; g.fillRect(x, y - 90, 120, 90); g.fillStyle = '#F2F6FA'; g.beginPath(); g.moveTo(x - 14, y - 90); g.lineTo(x + 60, y - 150); g.lineTo(x + 134, y - 90); g.fill();
    g.fillStyle = 'rgba(255,210,140,0.85)'; g.fillRect(x + 44, y - 60, 30, 26);
    if (smoke) { g.fillStyle = 'rgba(235,240,245,0.35)'; for (let k = 0; k < 5; k++) { const lt = (t * 0.6 + k * 0.2 + i * 0.13) % 1; g.beginPath(); g.arc(x + 90 + Math.sin(lt * 6) * 10, y - 150 - lt * 260, 14 + lt * 30, 0, 6.283); g.fill(); } } } }
VIS.open = (K) => { for (let i = 0; i < 16; i++) K(0.3 + i * 0.12, 'tick', 0.4); K(2.3, 'hit', 0.8);
  return (t) => { village(t); snowfall(t, 120, 0.8); thermo(880, 1320, 420, countTo(t, 0.3, 1.9, -67.7, 0.7, 10), t);
    hookPhoto(t, 'lead', { y: 800, h: 480 }); tag(t); hook(t, EP.hook, 500); }; };
VIS[0] = (K) => { K(1.2, 'land', 0.7); K(2.6, 'swish', 0.5);
  return (t) => { atmosphere(t); const cam = camLerp(t, 0.2, 26, 10.5, [100, 60, 90], [143.2, 63.5, 30], 980); darkMap(cam, { glow: 'rgba(111,183,232,0.12)' }); const [x, y] = cam.P(143.2, 63.46);
    pinAt(x, y, t, 1.2, 'OYMYAKON', { size: 58, color: '#6FB7E8', left: true }); snowfall(t, 60, 0.5); tag(t, 0, 4);
    popNum('SIBERIA', 80, 520, 160, TXT, t, 0.45); label('COLDEST PERMANENTLY INHABITED PLACE', 84, 580, t, 1.0, { size: 26, color: '#6FB7E8' }); }; };
VIS[1] = (K) => { for (let i = 0; i < 20; i++) K(0.5 + i * 0.1, 'tick', 0.4); K(2.6, 'hit', 1); K(2.7, 'crack', 0.6);
  return (t) => { atmosphere(t, { x: 540, y: 900, r: 800, c: 'rgba(111,183,232,0.12)' }); const temp = countTo(t, 0.5, 2.1, -67.7, 0.7, 0); thermo(800, 1180, 560, temp, t);
    if (t > 2.6) { const f = clamp((t - 2.6) / 0.8); g.save(); g.globalAlpha = 0.5 * f; const gr = g.createRadialGradient(540, 960, 300, 540, 960, 1100); gr.addColorStop(0, 'rgba(220,240,255,0)'); gr.addColorStop(1, 'rgba(220,240,255,1)'); g.fillStyle = gr; g.fillRect(0, 0, W, H); g.restore(); }
    tag(t, 1, 4); popNum(`${temp.toFixed(1)}°C`, 80, 600, fit('-67.7°C', 'disp', 190, 640), temp <= -67.6 ? '#6FB7E8' : TXT, t, 0.45); label('FEBRUARY 6, 1933', 84, 660, t, 1.0); }; };
VIS[2] = (K) => { K(0.5, 'pop', 0.8, 500); K(1.8, 'scratch'); K(1.82, 'thump', 1);
  return (t) => { village(t, 1); snowfall(t, 100, 0.7); g.fillStyle = 'rgba(12,11,10,0.35)'; g.fillRect(0, 0, W, 760); tag(t, 2, 4);
    doc(540, 880, 760, 280, -0.03, t, 0.45, () => { text('SCHOOL', 0, -60, 'mono', 30, '#7A7266', { align: 'center', ls: 8 }); text('Closed below', 0, 10, 'serif', 50, PINK, { align: 'center' }); text('−55°C', 0, 90, 'disp', 74, '#2F6FA6', { align: 'center' }); });
    if (t > 1.8) popNum('−55°C', 80, 600, 170, '#6FB7E8', t, 1.8); }; };
VIS[3] = (K) => { for (let i = 0; i < 10; i++) K(0.5 + i * 0.1, 'pop', 0.35, 600 + i * 30); K(1.8, 'land', 0.8);
  return (t) => { village(t, 1); snowfall(t, 100, 0.7); g.fillStyle = 'rgba(12,11,10,0.35)'; g.fillRect(0, 0, W, 760); tag(t, 3, 4);
    popNum(`~${Math.round(countTo(t, 0.5, 1.2, 500, 0.7))}`, 80, 600, 200, GOLD, t, 0.45); label('PEOPLE CALL IT HOME', 84, 660, t, 1.0); }; };
