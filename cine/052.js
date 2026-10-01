// Wiki Roulette #052 — Tunguska event (1908)
const TG = [101.9, 60.9];
function forest(t, R, cx = 540, cy = 1000, y0 = 520, y1 = 1500) { g.fillStyle = '#1E261A'; g.fillRect(0, y0, W, y1 - y0); const r = rng(52);
  for (let i = 0; i < 900; i++) { const x = r() * W, y = y0 + r() * (y1 - y0), dx = x - cx, dy = y - cy, d = Math.hypot(dx, dy) || 1, s = 7 + r() * 5;
    if (d < R && d > 36) { const l = 22 + r() * 14; g.strokeStyle = '#6E5236'; g.lineWidth = 4; g.beginPath(); g.moveTo(x, y); g.lineTo(x + dx / d * l, y + dy / d * l); g.stroke(); }
    else if (d <= 36) { g.fillStyle = '#4A3A28'; g.beginPath(); g.arc(x, y, 4, 0, 6.283); g.fill(); }
    else { g.fillStyle = r() < 0.5 ? '#2F5A2E' : '#3A6B34'; g.beginPath(); g.arc(x, y, s, 0, 6.283); g.fill(); } } }
function burnGlow(x, y, a, r = 500) { g.save(); g.globalCompositeOperation = 'lighter'; glowDot(x, y, r, '255,200,120', a); g.restore(); }
VIS.open = (K) => { K(0.2, 'hit', 1.3); K(0.25, 'crack', 1); K(0.3, 'mute', 1, 0.4); K(2.2, 'thump', 0.8);
  return (t) => { if (!photoBG(t, 'lead', { zoom: [1.08, 1.2], dur: 4, focus: [0.5, 0.5] })) { g.fillStyle = BG; g.fillRect(0, 0, W, H);
      g.save(); g.translate(shake(t, 0.2, 18), 0); forest(t, ramp(t, 0.2, 1.4, 0, 900), 540, 1060, 760, H); burnGlow(540, 1060, Math.exp(-(t - 0.2) * 1.5) * (t > 0.2), 600); g.restore(); shockRing(540, 1060, t, 0.2, 900); }
    flash(t, 0.2, 0.7, 0.15, '#FFF2D0'); tag(t); hook(t, EP.hook, 480); }; };
VIS[0] = (K) => { K(0.5, 'whoosh', 0.7); K(2.9, 'mute', 1, 0.5); K(3.0, 'hit', 1.4); K(3.05, 'crack', 0.8);
  return (t) => { atmosphere(t); stars(t, 120); const c = globeCam(t, [[0, 40, 45, 430], [0.3, TG[0], TG[1], 430], [1.4, TG[0], TG[1], 950]]);
    g.save(); g.translate(shake(t, 3.0, 22), 0); const P = globe(t, 540, 1100, c.R, c.lon, c.lat, { land: '#3B4A2E' }); const [x, y] = P(...TG);
    if (t < 3.0) pinAt(x, y, t, 1.5, null, { color: RED }); else { burnGlow(x, y, Math.exp(-(t - 3) * 1.2), 420); shockRing(x, y, t, 3.0, 700); } g.restore(); flash(t, 3.0, 0.7, 0.18, '#FFF2D0');
    tag(t, 0, 4); rgbPop('JUNE 30, 1908', 80, 560, fit('JUNE 30, 1908', 'disp', 150, 920), TXT, t, 0.45); label('SIBERIA · RUSSIA', 84, 625, t, 1.2, { color: GOLD });
    if (t > 3.2) chip('A BLAST', 80, 700, t, 3.2, { size: 40, align: 'left', bg: RED, fg: TXT }); }; };
VIS[1] = (K) => { K(0.5, 'riser', 0.5, 0.6); K(1.0, 'crack', 1); for (let i = 0; i < 16; i++) K(1.0 + i * 0.12, 'thump', 0.35); K(3.0, 'hit', 1);
  return (t) => { atmosphere(t); const R = ramp(t, 1.0, 2.2, 0, 760); forest(t, R, 540, 1080, 760, 1560); shockRing(540, 1080, t, 1.0, 760, '255,220,170', 2); tag(t, 1, 4);
    rgbPop('2,150 KM²', 80, 560, fit('2,150 KM²', 'disp', 190, 920), GOLD, t, 3.0); label('≈ 80 MILLION TREES. FLATTENED.', 84, 630, t, 3.4); }; };
VIS[2] = (K) => { K(0.5, 'whoosh', 0.8); K(1.0, 'riser', 0.4, 1); K(2.2, 'hit', 1.1); K(2.25, 'land', 0.9);
  return (t) => { const sky = g.createLinearGradient(0, 0, 0, 1200); sky.addColorStop(0, '#0B0C10'); sky.addColorStop(1, '#4A3A2A'); g.fillStyle = sky; g.fillRect(0, 0, W, H);
    burnGlow(-60, 1100, 0.8, 700); g.fillStyle = '#1A1612'; g.fillRect(0, 1100, W, H - 1100); tag(t, 2, 4);
    const fx = lerp(-300, 1400, clamp((t - 0.6) / 2.4)); g.save(); g.globalCompositeOperation = 'lighter'; for (let k = 0; k < 9; k++) glowDot(fx - k * 40, 1100 - k * 50 + Math.sin(t * 5 + k) * 10, 220 - k * 10, '200,160,110', 0.35); g.restore();
    const hit = clamp((t - 2.2) / 0.35), x = 820; g.save(); g.translate(x + hit * 40, 1100); g.rotate(hit * 1.45); human(0, 0, 180, TXT); g.restore();
    g.strokeStyle = GOLD; g.lineWidth = 4; g.setLineDash([14, 10]); g.beginPath(); g.moveTo(60, 1000); g.lineTo(lerp(60, 760, ease((t - 0.4) / 1.2)), 1000); g.stroke(); g.setLineDash([]);
    rgbPop('60+ KM', 80, 560, 200, GOLD, t, 0.45); label('AWAY — AND STILL KNOCKED DOWN', 84, 625, t, 2.3); }; };
VIS[3] = (K) => { K(0.4, 'whoosh', 1); K(1.3, 'hit', 1.3); K(1.35, 'mute', 1, 0.4); K(3.2, 'scratch'); K(3.22, 'thump', 1.1);
  return (t) => { const GR = 1450, KM = 80, by = GR - 7.5 * KM, bx = 540; const sky = g.createLinearGradient(0, 0, 0, GR); sky.addColorStop(0, '#07080C'); sky.addColorStop(1, '#283040'); g.fillStyle = sky; g.fillRect(0, 0, W, H); stars(t, 80, 9);
    if (t < 1.3) { const p = clamp((t - 0.2) / 1.1), mx = lerp(1150, bx, p), my = lerp(160, by, p); const tr = g.createLinearGradient(mx, my, mx + 400, my - 450); tr.addColorStop(0, 'rgba(255,230,180,0.9)'); tr.addColorStop(1, 'rgba(255,150,60,0)');
      g.strokeStyle = tr; g.lineWidth = 14; g.beginPath(); g.moveTo(mx, my); g.lineTo(mx + 400, my - 450); g.stroke(); glowDot(mx, my, 60, '255,230,180', 1); }
    else { burnGlow(bx, by, Math.exp(-(t - 1.3) * 1.0), 520); shockRing(bx, by, t, 1.3, 900); }
    const fl = clamp((t - 1.6) / 0.5); g.fillStyle = '#1E261A'; g.fillRect(0, GR, W, H - GR); for (let x = 30; x < W; x += 42) { const d = x - bx, a = fl * Math.sign(d) * 1.4 * (Math.abs(d) > 40); g.save(); g.translate(x, GR); g.rotate(a); g.fillStyle = '#2F5A2E'; g.beginPath(); g.moveTo(-12, 0); g.lineTo(0, -60); g.lineTo(12, 0); g.fill(); g.restore(); }
    g.strokeStyle = 'rgba(255,255,255,0.4)'; g.lineWidth = 2; g.beginPath(); g.moveTo(990, GR); g.lineTo(990, GR - 11 * KM); g.stroke(); for (let k = 0; k <= 10; k++) g.fillRect(980, GR - k * KM, 20, 2);
    if (t > 1.8) { const p = ease((t - 1.8) / 0.5); g.fillStyle = 'rgba(255,194,61,0.18)'; g.fillRect(940, GR - 10 * KM, 100, 5 * KM * p); g.strokeStyle = GOLD; g.lineWidth = 5; g.strokeRect(940, GR - 10 * KM, 100, 5 * KM * p); }
    flash(t, 1.3, 0.6, 0.15, '#FFF2D0'); tag(t, 3, 4); rgbPop('IN THE AIR', 80, 520, fit('IN THE AIR', 'disp', 150, 820), TXT, t, 1.3); label('5–10 KM UP', 84, 585, t, 1.8, { color: GOLD, size: 36 });
    stampText('NO CRATER', 540, 1090, t, 3.2, { size: 96, rot: -0.06 }); }; };
