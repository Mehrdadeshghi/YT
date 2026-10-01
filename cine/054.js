// Wiki Roulette #054 — Darvaza gas crater: the Door to Hell
const DV = [58.44, 40.25], ORG = '#FF7A2E';
function desert(t, hy = 1000) { const sky = g.createLinearGradient(0, 0, 0, hy); sky.addColorStop(0, '#05060C'); sky.addColorStop(1, '#1A1420'); g.fillStyle = sky; g.fillRect(0, 0, W, hy); stars(t, 120, 54);
  const sd = g.createLinearGradient(0, hy, 0, H); sd.addColorStop(0, '#2A1E16'); sd.addColorStop(1, '#0E0A08'); g.fillStyle = sd; g.fillRect(0, hy, W, H - hy); }
function flame(x, y, h, w, a = 1) { const gr = g.createLinearGradient(x, y, x, y - h); gr.addColorStop(0, `rgba(255,240,170,${a})`); gr.addColorStop(0.4, `rgba(255,140,40,${0.8 * a})`); gr.addColorStop(1, 'rgba(200,40,10,0)');
  g.fillStyle = gr; g.beginPath(); g.moveTo(x - w, y); g.quadraticCurveTo(x - w * 0.6, y - h * 0.6, x, y - h); g.quadraticCurveTo(x + w * 0.6, y - h * 0.6, x + w, y); g.fill(); }
function crater(t, cx, cy, rx, ry, f = 1) { glowDot(cx, cy, rx * 1.6, '255,120,40', 0.45 * f);
  g.fillStyle = '#120A06'; g.beginPath(); g.ellipse(cx, cy, rx * 1.06, ry * 1.12, 0, 0, 6.283); g.fill();
  const inn = g.createRadialGradient(cx, cy + ry * 0.3, 0, cx, cy, rx); inn.addColorStop(0, `rgba(255,${120 + 60 * f | 0},40,${f})`); inn.addColorStop(0.7, `rgba(140,40,10,${0.9 * f})`); inn.addColorStop(1, '#1A0C06');
  g.fillStyle = inn; g.beginPath(); g.ellipse(cx, cy, rx, ry, 0, 0, 6.283); g.fill();
  g.save(); g.beginPath(); g.ellipse(cx, cy, rx, ry, 0, 0, 6.283); g.clip(); g.globalCompositeOperation = 'lighter'; const r = rng(7);
  for (let i = 0; i < 220; i++) { const a = r() * 6.283, d = Math.sqrt(r()) * 0.9, bx = cx + Math.cos(a) * rx * d, by = cy + Math.sin(a) * ry * d + ry * 0.2, sp = 0.8 + r() * 1.2, ph = (t * sp + r()) % 1, h = (60 + 90 * r()) * rx / 420;
    const x = bx + Math.sin(t * 6 + i) * 8 * ph, y = by - ph * h, rr = (1 - ph) * (16 + 14 * r()) * rx / 420; glowDot(x, y, rr * 2.2, `255,${200 - ph * 150 | 0},${80 - ph * 60 | 0}`, (1 - ph) * 0.45 * f); }
  g.restore(); if (f > 0.05) embers(t, cx - rx * 0.7, cx + rx * 0.7, cy, Math.round(50 * f), 5); }
function pit(t, f = 1, gx = 190, gy = 780, w = 700, d = 280) { g.fillStyle = '#2A1E16'; g.fillRect(0, gy, W, H - gy); g.fillStyle = '#100906'; g.beginPath(); g.moveTo(gx, gy); g.lineTo(gx + 40, gy + d); g.lineTo(gx + w - 40, gy + d); g.lineTo(gx + w, gy); g.fill();
  if (f > 0) { g.save(); g.beginPath(); g.moveTo(gx, gy); g.lineTo(gx + 40, gy + d); g.lineTo(gx + w - 40, gy + d); g.lineTo(gx + w, gy); g.clip(); glowDot(gx + w / 2, gy + d, w * 0.6, '255,120,40', 0.7 * f); g.globalCompositeOperation = 'lighter';
    for (let x = gx + 50; x < gx + w - 40; x += 26) flame(x, gy + d + 4, (60 + 35 * Math.sin(t * 11 + x)) * f, 24, 0.7 * f); for (let k = 0; k < 10; k++) { const yy = gy + 40 + k * 26; flame(gx + 6 + k * 3.6 + 10, yy + 20, (24 + 10 * Math.sin(t * 13 + k)) * f, 8, 0.6 * f); flame(gx + w - 16 - k * 3.6, yy + 20, (24 + 10 * Math.sin(t * 12 + k)) * f, 8, 0.6 * f); } g.restore();
    embers(t, gx + 60, gx + w - 60, gy + d, Math.round(40 * f), 8); } }
VIS.open = (K) => { K(0.3, 'riser', 0.5, 2); K(2.6, 'thump', 0.9);
  return (t) => { if (!photoBG(t, 'lead', { zoom: [1.05, 1.2], dur: 4, focus: [0.5, 0.6] })) { desert(t, 900); crater(t, 540, 1150, 440, 170, 1); }
    else embers(t, 200, 880, 1500, 40, 5); tag(t); hook(t, EP.hook, 480); }; };
VIS[0] = (K) => { K(0.5, 'whoosh', 0.7); K(1.5, 'land', 0.7); K(2.4, 'hit', 1.1);
  return (t) => { atmosphere(t); stars(t, 120); const c = globeCam(t, [[0, 20, 30, 430], [0.3, DV[0], DV[1], 430], [1.3, DV[0], DV[1], 900]]);
    const P = globe(t, 540, 1200, c.R, c.lon, c.lat, { land: '#4A5A38' }); const [x, y] = P(...DV); pinAt(x, y, t, 1.5, 'DARVAZA', { size: 44, color: ORG });
    tag(t, 0, 5); rgbPop('TURKMENISTAN', 80, 560, fit('TURKMENISTAN', 'disp', 150, 920), TXT, t, 0.45); label('KARAKUM DESERT', 84, 625, t, 1.0, { color: ORG });
    if (t > 2.4) rgbPop('"THE DOOR TO HELL"', 80, 740, fit('"THE DOOR TO HELL"', 'disp', 100, 920), ORG, t, 2.4); }; };
VIS[1] = (K) => { K(0.5, 'swish', 0.6); for (let i = 0; i < 7; i++) K(0.7 + i * 0.12, 'tick', 0.5); K(1.7, 'pop', 0.9, 700); for (let i = 0; i < 3; i++) K(2.0 + i * 0.15, 'tick', 0.5); K(2.6, 'pop', 0.9, 500);
  return (t) => { desert(t, 780); pit(t, 1); human(170, 780, 17, TXT); if (t > 2.8) label('YOU', 150, 745, t, 2.8, { size: 22, color: GOLD });
    const pw = ease((t - 0.6) / 1.0), pd = ease((t - 1.9) / 0.7); g.strokeStyle = GOLD; g.lineWidth = 5; g.beginPath(); g.moveTo(540 - 350 * pw, 725); g.lineTo(540 + 350 * pw, 725); g.moveTo(940, 780); g.lineTo(940, 780 + 280 * pd); g.stroke();
    if (pw > 0) { g.beginPath(); g.moveTo(540 - 350 * pw, 705); g.lineTo(540 - 350 * pw, 745); g.moveTo(540 + 350 * pw, 705); g.lineTo(540 + 350 * pw, 745); g.stroke(); }
    tag(t, 1, 5); rgbPop(`${Math.round(ramp(t, 0.6, 1.0, 0, 70))} M WIDE`, 80, 520, 130, TXT, t, 0.45); if (t > 1.9) rgbPop(`${Math.round(ramp(t, 1.9, 0.7, 0, 30))} M DEEP`, 80, 650, 130, ORG, t, 1.9); }; };
VIS[2] = (K) => { K(0.5, 'pop', 0.8, 400); K(1.2, 'swish', 0.8); K(1.9, 'hit', 1.2); K(1.95, 'crack', 0.8); K(3.4, 'pop', 0.8, 600);
  return (t) => { desert(t, 900); const ig = clamp((t - 1.9) / 1.2); crater(t, 540, 1120, 420, 160, ig);
    if (t < 1.9) { for (let i = 0; i < 12; i++) { const ph = (t * 0.4 + i / 12) % 1; glowDot(300 + i * 42 + Math.sin(t + i) * 30, 1100 - ph * 420, 70 + ph * 90, '150,200,130', 0.18 * (1 - ph)); }
      const p = clamp((t - 1.2) / 0.7); if (t > 1.2) { const x = lerp(1000, 560, p), y = lerp(760, 1110, p) - Math.sin(p * Math.PI) * 220; g.save(); g.translate(x, y); g.rotate(t * 10); g.fillStyle = '#6E5236'; g.fillRect(-60, -7, 120, 14); g.restore(); glowDot(x, y, 90, '255,160,60', 0.6); flame(x, y, 80, 18, 1); } }
    flash(t, 1.9, 0.6, 0.15, '#FFD9A0'); tag(t, 2, 5); chip('PLAN: BURN OFF THE GAS', 80, 470, t, 0.5, { size: 30, align: 'left', bg: '#2B2A28', fg: TXT });
    if (t > 3.4) chip('…AND LET IT GO OUT. FAST.', 80, 570, t, 3.4, { size: 30, align: 'left', bg: ORG, fg: BG }); }; };
VIS[3] = (K) => { K(0.45, 'scratch'); K(0.47, 'thump', 1); for (let i = 0; i < 20; i++) K(0.6 + i * 0.07, 'tick', 0.35); K(2.1, 'hit', 1); K(2.6, 'swish', 0.6); K(4.2, 'land', 0.9);
  return (t) => { desert(t, 780); pit(t, 1); const y = Math.round(ramp(t, 0.6, 1.4, 1971, 2013)), dp = ease((t - 2.6) / 1.6);
    g.strokeStyle = '#D8CDB5'; g.lineWidth = 3; g.beginPath(); g.moveTo(560, 700); g.lineTo(560, 740 + dp * 260); g.stroke(); g.fillStyle = '#8C857A'; g.fillRect(470, 690, 180, 12);
    human(560, 800 + dp * 255, 56, '#F4F4F4');
    tag(t, 3, 5); popNum('IT DIDN\'T.', 80, 450, 70, ORG, t, 0.45); rgbPop(String(y), 80, 590, 170, y >= 2013 ? GOLD : TXT, t, 0.6);
    if (t > 2.6) label('GEORGE KOUROUNIS · FIRST TO THE BOTTOM', 84, 650, t, 2.6, { size: 24 }); }; };
VIS[4] = (K) => { K(0.5, 'pop', 0.8, 500); K(1.2, 'splash', 0.7); K(2.4, 'mute', 1, 0.8);
  return (t) => { desert(t, 900); const f = lerp(1, 0.3, ease((t - 0.8) / 2.6)); crater(t, 540, 1120, 420, 160, f);
    for (let i = 0; i < 14; i++) { const ph = (t * 0.3 + i / 14) % 1; glowDot(360 + (i * 53) % 360 + Math.sin(t + i) * 40, 1060 - ph * 520, 90 + ph * 120, '170,160,150', 0.22 * (1 - ph) * (1.2 - f)); }
    tag(t, 4, 5); rgbPop('NOW:', 80, 520, 120, TXT, t, 0.45); rgbPop('PUT IT OUT?', 80, 670, fit('PUT IT OUT?', 'disp', 150, 920), ORG, t, 1.0); }; };
