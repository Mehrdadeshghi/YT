// Wiki Roulette #049 — Krakatoa 1883: the loudest sound in recorded history
const KRK = [105.42, -6.10], ROD = [63.42, -19.72];
function volcano(t, erupt = 1, y = 1250) { const sky = g.createLinearGradient(0, 0, 0, y); sky.addColorStop(0, '#120806'); sky.addColorStop(1, `rgb(${90 + 80 * erupt | 0},40,20)`); g.fillStyle = sky; g.fillRect(0, 0, W, H);
  g.fillStyle = '#1A110C'; g.beginPath(); g.moveTo(0, y); g.lineTo(380, y - 330); g.lineTo(700, y - 330); g.lineTo(W, y); g.lineTo(W, H); g.lineTo(0, H); g.fill();
  if (erupt > 0) { const r = rng(9); for (let i = 0; i < 40; i++) { const ph = (t * 0.25 + r()) % 1, x = 540 + (r() - 0.5) * 260 * (0.4 + ph * 2), yy = y - 330 - ph * 900, rr = 40 + ph * 160;
      g.fillStyle = `rgba(${60 + r() * 40 | 0},${40 + r() * 20 | 0},${36 | 0},${0.55 * (1 - ph * 0.6) * erupt})`; g.beginPath(); g.arc(x, yy, rr, 0, 6.283); g.fill(); }
    const gl = g.createRadialGradient(540, y - 330, 0, 540, y - 330, 380); gl.addColorStop(0, `rgba(255,150,60,${0.6 * erupt})`); gl.addColorStop(1, 'rgba(255,90,30,0)'); g.fillStyle = gl; g.fillRect(140, y - 720, 800, 800);
    embers(t, 400, 680, y - 330, 50, 4); }
  g.fillStyle = '#0B1218'; g.fillRect(0, y, W, H - y); }
VIS.open = (K) => { K(0.05, 'hit', 1.2); K(0.1, 'crack', 0.8); K(1.8, 'riser', 0.4, 1.5);
  return (t) => { volcano(t, 1, 1450); shockRing(540, 1120, t % 1.6, 0, 900); if (!photoBG(t, 'lead', { zoom: [1.05, 1.15], dur: 4 })) {} tag(t); hook(t, EP.hook, 500); }; };
VIS[0] = (K) => { K(0.6, 'whoosh', 0.6); K(2.6, 'hit', 1.3); K(2.65, 'mute', 1, 0.5);
  return (t) => { atmosphere(t); stars(t, 140); const c = globeCam(t, [[0, 80, 10, 420], [0.3, 105.4, -6.1, 420], [1.2, 105.4, -6.1, 9000]]);
    const P = globe(t, 540, 960, c.R, c.lon, c.lat, { land: '#3B4A2E' }); const [x, y] = P(...KRK);
    if (t > 2.6) { shockRing(x, y, t, 2.6, 800); flash(t, 2.6, 0.6, 0.2, '#FFE2B0'); } else pinAt(x, y, t, 1.4, null, { color: RED });
    tag(t, 0, 5); rgbPop('1883', 80, 560, 200, TXT, t, 0.45); if (t > 1.6) label('KRAKATOA · INDONESIA', 84, 620, t, 1.6, { color: GOLD }); }; };
VIS[1] = (K) => { K(0.5, 'sonar', 0.8); K(2.6, 'thump', 1); K(3.8, 'pop', 0.8, 400);
  return (t) => { atmosphere(t); stars(t, 120); const P = globe(t, 540, 1000, 560, 86 + t * 2, -12, { land: '#3B4A2E' });
    const [kx, ky] = P(...KRK), [rx, ry, rv] = P(...ROD), p = ease((t - 0.5) / 2.0);
    g.strokeStyle = GOLD; g.lineWidth = 6; g.setLineDash([16, 12]); g.beginPath(); for (let i = 0; i <= 40 * p; i++) { const u = i / 40, [x, y] = P(lerp(KRK[0], ROD[0], u), lerp(KRK[1], ROD[1], u)); i ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke(); g.setLineDash([]);
    pinAt(kx, ky, t, -1, null, { color: RED }); if (p >= 1) pinAt(rx, ry, t, 2.5, 'RODRIGUES', { size: 46, left: true });
    tag(t, 1, 5); rgbPop('4,800 KM', 80, 560, 170, GOLD, t, 2.6); if (t > 3.8) chip('"CANNON FIRE?"', 80, 670, t, 3.8, { size: 44, align: 'left', bg: '#2B2A28', fg: TXT }); }; };
VIS[2] = (K) => { [0.6, 1.5, 2.4].forEach((a) => K(a, 'whoosh', 0.8)); K(3.0, 'land', 0.8);
  return (t) => { atmosphere(t); stars(t, 120); const lon = 105 + t * 40, P = globe(t, 540, 1000, 520, lon, 0, { land: '#3B4A2E' });
    for (let k = 0; k < 3; k++) { const ang = ((t - 0.4 - k * 0.6) * 70); if (ang < 0) continue; const a = (ang % 180) * D2R; g.strokeStyle = `rgba(255,220,170,${0.8 - k * 0.2})`; g.lineWidth = 5; g.beginPath(); let st = false;
      for (let b = 0; b <= 360; b += 4) { const br = b * D2R, la0 = KRK[1] * D2R, lo0 = KRK[0] * D2R; const la = Math.asin(Math.sin(la0) * Math.cos(a) + Math.cos(la0) * Math.sin(a) * Math.cos(br)); const lo = lo0 + Math.atan2(Math.sin(br) * Math.sin(a) * Math.cos(la0), Math.cos(a) - Math.sin(la0) * Math.sin(la));
        const [x, y, v] = P(lo / D2R, la / D2R); if (!v) { st = false; continue; } st ? g.lineTo(x, y) : g.moveTo(x, y); st = true; } g.stroke(); }
    tag(t, 2, 5); rgbPop('×3', 80, 600, 260, GOLD, t, 3.0); label('AROUND THE WORLD', 84, 660, t, 3.2); }; };
VIS[3] = (K) => { K(0.5, 'riser', 0.6, 1.2); K(1.6, 'splash', 1.3); K(1.65, 'hit', 1); K(3.4, 'thump', 1);
  return (t) => { const sky = g.createLinearGradient(0, 0, 0, 1200); sky.addColorStop(0, '#0B1016'); sky.addColorStop(1, '#3A4A58'); g.fillStyle = sky; g.fillRect(0, 0, W, H);
    const hgt = 620 * ease((t - 0.4) / 1.3), base = 1200; g.fillStyle = '#123448'; g.beginPath(); g.moveTo(0, base); for (let x = 0; x <= W; x += 20) { const u = x / W; g.lineTo(x, base - hgt * Math.pow(Math.sin(Math.PI * clamp(u * 1.2 - 0.1)), 2) - Math.sin(x / 30 + t * 4) * 8); } g.lineTo(W, H); g.lineTo(0, H); g.fill();
    g.fillStyle = 'rgba(230,245,250,0.6)'; for (let x = 200; x < 900; x += 26) g.fillRect(x, base - hgt - 6 + Math.sin(x + t * 6) * 6, 16, 6);
    human(940, base, 26, TXT); g.strokeStyle = GOLD; g.lineWidth = 5; g.beginPath(); g.moveTo(1000, base); g.lineTo(1000, base - hgt); g.stroke();
    tag(t, 3, 5); if (t > 1.6) rgbPop('42 M', 80, 560, 200, TXT, t, 1.6); if (t > 3.4) rgbPop('36,000+ DEAD', 80, 720, fit('36,000+ DEAD', 'disp', 110, 920), RED, t, 3.4); }; };
VIS[4] = (K) => { K(0.5, 'swish', 0.5); K(1.6, 'land', 0.6);
  return (t) => { const sky = g.createLinearGradient(0, 0, 0, 1150); sky.addColorStop(0, '#2A0E14'); sky.addColorStop(0.6, '#C2402A'); sky.addColorStop(1, '#FFB060'); g.fillStyle = sky; g.fillRect(0, 0, W, H);
    g.fillStyle = '#FFE0A0'; g.beginPath(); g.arc(540, 1120 + t * 20, 110, 0, 6.283); g.fill(); waterOver(t, 1150, { c1: '#5A2A20' });
    tag(t, 4, 5); popNum('RED SUNSETS', 80, 560, fit('RED SUNSETS', 'disp', 150, 920), TXT, t, 0.45); label('AROUND THE WORLD · FOR MONTHS', 84, 620, t, 1.4); }; };
