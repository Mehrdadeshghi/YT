// Wiki Roulette #055 — Tsar Bomba (1961)
const NZ = [55.0, 73.8];
function puff(x, y, r, warm = 0) { const c0 = `${235 + 20 * warm | 0},${215 - 40 * warm | 0},${190 - 90 * warm | 0}`, c1 = `${150 + 60 * warm | 0},${120 + 10 * warm | 0},${105 - 30 * warm | 0}`;
  const gr = g.createRadialGradient(x - r * 0.25, y - r * 0.3, r * 0.05, x, y, r); gr.addColorStop(0, `rgba(${c0},0.95)`); gr.addColorStop(0.55, `rgba(${c1},0.75)`); gr.addColorStop(1, `rgba(${c1},0)`); g.fillStyle = gr; g.beginPath(); g.arc(x, y, r, 0, 6.283); g.fill(); }
function mushroom(t, x, gy, top, p, s = 1) { if (p <= 0) return; const cy = lerp(gy, top, p), r = rng(55), heat = clamp(1 - p * 1.3);
  for (let k = 0; k < 40; k++) { const u = k / 40, y = lerp(gy, cy + 50 * s, u); puff(x + (r() - 0.5) * 50 * s + Math.sin(t * 2 + k) * 5 * s, y, (40 + 26 * (1 - u)) * s * (0.6 + 0.4 * p) * (0.8 + 0.4 * r()), heat * (1 - u)); }
  for (let k = 0; k < 24; k++) { const a = r() * 6.283; puff(x + Math.cos(a) * (60 + 80 * p) * s, lerp(gy, cy, 0.55) + Math.sin(a) * 18 * s, 34 * s * p, 0); }
  for (let k = 0; k < 90; k++) { const a = r() * 6.283, d = Math.sqrt(r()), w = (90 + 210 * p) * s, h = (40 + 80 * p) * s; puff(x + Math.cos(a) * w * d, cy + Math.sin(a) * h * d - h * 0.15 + Math.sin(t + k) * 3, (40 + 36 * r()) * s * (0.5 + 0.5 * p), clamp(heat + 0.4 * (1 - d) * (1 - p))); }
  g.save(); g.globalCompositeOperation = 'lighter'; glowDot(x, cy, 220 * s, '255,150,60', 0.35 * heat + 0.08); g.restore(); }
function arcticSky(t, gy) { const sky = g.createLinearGradient(0, 0, 0, gy); sky.addColorStop(0, '#0A1220'); sky.addColorStop(1, '#3A4E66'); g.fillStyle = sky; g.fillRect(0, 0, W, gy); g.fillStyle = '#D8E2EA'; g.fillRect(0, gy, W, H - gy); g.fillStyle = 'rgba(10,18,32,0.35)'; g.fillRect(0, gy, W, H - gy); }
VIS.open = (K) => { K(0.1, 'hit', 1.4); K(0.12, 'mute', 1, 0.5); K(0.4, 'riser', 0.6, 2.5);
  return (t) => { if (!photoBG(t, 'lead', { zoom: [1.05, 1.22], dur: 4, focus: [0.5, 0.45] })) { arcticSky(t, 1500); mushroom(t, 540, 1500, 880, ease(t / 3.5), 1.4);
      g.save(); g.globalCompositeOperation = 'lighter'; glowDot(540, 1400, 700, '255,240,210', Math.exp(-t * 1.6)); g.restore(); }
    flash(t, 0.1, 0.9, 0.25, '#FFFFFF'); tag(t); hook(t, EP.hook, 480); }; };
VIS[0] = (K) => { K(0.5, 'whoosh', 0.7); K(1.6, 'land', 0.7); K(2.6, 'hit', 1.2);
  return (t) => { atmosphere(t); stars(t, 120); const c = globeCam(t, [[0, 37, 55, 430], [0.3, NZ[0], NZ[1] - 8, 430], [1.3, NZ[0], NZ[1] - 8, 1000]]);
    const P = globe(t, 540, 1180, c.R, c.lon, c.lat, { land: '#4A5A42' }); const [x, y] = P(...NZ); if (t < 2.6) pinAt(x, y, t, 1.6, 'NOVAYA ZEMLYA', { size: 40, color: RED });
    else { g.save(); g.globalCompositeOperation = 'lighter'; glowDot(x, y, 360, '255,230,190', Math.exp(-(t - 2.6) * 1.2)); g.restore(); shockRing(x, y, t, 2.6, 600); }
    flash(t, 2.6, 0.7, 0.2); tag(t, 0, 5); rgbPop('OCTOBER 1961', 80, 560, fit('OCTOBER 1961', 'disp', 150, 920), TXT, t, 0.45); label('SOVIET UNION · ARCTIC TEST SITE', 84, 625, t, 1.0, { color: GOLD });
    if (t > 2.6) rgbPop('TSAR BOMBA', 80, 760, fit('TSAR BOMBA', 'disp', 130, 920), RED, t, 2.6); }; };
VIS[1] = (K) => { K(0.45, 'hit', 1); K(1.0, 'pop', 0.9, 900); for (let i = 0; i < 24; i++) K(1.6 + i * 0.1, 'tick', 0.35); K(4.2, 'thump', 1.1);
  return (t) => { atmosphere(t, { x: 540, y: 950, r: 800, c: 'rgba(255,90,40,0.08)' }); tag(t, 1, 5); const C = 50, S = 14, x0 = 190, y0 = 690, n = Math.floor(ramp(t, 1.6, 2.6, 1, 1570));
    for (let i = 0; i < n; i++) { const cx = x0 + (i % C) * S, cy = y0 + Math.floor(i / C) * S; g.fillStyle = i === 0 ? GOLD : `rgb(${200 + (i * 37) % 55},${60 + (i * 13) % 40},40)`; g.fillRect(cx, cy, S - 3, S - 3); }
    if (t > 1.0) { g.strokeStyle = GOLD; g.lineWidth = 3; g.beginPath(); g.moveTo(x0 + 6, y0 - 4); g.lineTo(x0 + 6, y0 - 40); g.stroke(); label('= HIROSHIMA + NAGASAKI', x0 + 20, y0 - 30, t, 1.0, { size: 22, color: GOLD }); }
    rgbPop('50 MEGATONS', 80, 520, fit('50 MEGATONS', 'disp', 150, 920), TXT, t, 0.45); if (t > 1.6) popNum(`×${fmt(n)}`, 80, 625, 70, n >= 1570 ? RED : TXT, t, 1.6); }; };
VIS[2] = (K) => { K(0.45, 'hit', 1); K(2.4, 'riser', 0.6, 2); K(4.4, 'thump', 1.1);
  return (t) => { const gy = 1460, KM = 10; arcticSky(t, gy); stars(t, 60, 8);
    g.fillStyle = '#6E7680'; g.beginPath(); g.moveTo(820, gy); g.lineTo(870, gy - 8.8 * KM); g.lineTo(920, gy); g.fill(); g.fillStyle = '#F0F4F8'; g.beginPath(); g.moveTo(860, gy - 7 * KM); g.lineTo(870, gy - 8.8 * KM); g.lineTo(880, gy - 7 * KM); g.fill(); label('EVEREST', 870, gy - 110, t, 0.5, { size: 20, align: 'center', color: '#C9D2DA', ls: 2 });
    const fb = spring(t - 0.45, 120, 14); if (t < 2.6) { g.save(); g.globalCompositeOperation = 'lighter'; glowDot(400, gy - 40, 4 * KM * 2.4 * fb, '255,200,120', 1); g.restore(); g.fillStyle = '#FFF4D8'; g.beginPath(); g.arc(400, gy - 40, 4 * KM * fb, 0, 6.283); g.fill(); }
    mushroom(t, 400, gy, gy - 67 * KM + 150, ease((t - 2.4) / 2.0), 0.9);
    g.strokeStyle = 'rgba(255,255,255,0.4)'; g.lineWidth = 2; g.beginPath(); g.moveTo(1000, gy); g.lineTo(1000, gy - 70 * KM); g.stroke(); for (let k = 0; k <= 70; k += 10) { g.fillStyle = 'rgba(255,255,255,0.5)'; g.fillRect(990, gy - k * KM, 20, 2); if (k) text(`${k}`, 980, gy - k * KM + 8, 'mono', 20, 'rgba(255,255,255,0.6)', { align: 'right' }); }
    if (t > 4.4) { g.strokeStyle = GOLD; g.lineWidth = 4; g.setLineDash([12, 8]); g.beginPath(); g.moveTo(400, gy - 67 * KM); g.lineTo(1000, gy - 67 * KM); g.stroke(); g.setLineDash([]); }
    tag(t, 2, 5); popNum('FIREBALL: 8 KM WIDE', 80, 470, fit('FIREBALL: 8 KM WIDE', 'disp', 70, 920), TXT, t, 0.45); if (t > 4.4) rgbPop('CLOUD: 67 KM', 80, 610, fit('CLOUD: 67 KM', 'disp', 120, 920), GOLD, t, 4.4); }; };
VIS[3] = (K) => { K(0.5, 'whoosh', 0.8); K(1.9, 'crack', 1.2); K(1.92, 'hit', 0.9);
  return (t) => { atmosphere(t); stars(t, 120); const P = globe(t, 540, 1150, 800, 40 + t, 66, { land: '#4A5A42' }); const [x, y] = P(...NZ); pinAt(x, y, t, -1, null, { color: RED });
    const a = 900 / 6371 * ease((t - 0.5) / 1.2); if (a > 0) { g.strokeStyle = GOLD; g.lineWidth = 6; g.fillStyle = 'rgba(255,194,61,0.12)'; g.beginPath(); for (let b = 0; b <= 360; b += 4) { const br = b * D2R, la0 = NZ[1] * D2R, lo0 = NZ[0] * D2R;
      const la = Math.asin(Math.sin(la0) * Math.cos(a) + Math.cos(la0) * Math.sin(a) * Math.cos(br)), lo = lo0 + Math.atan2(Math.sin(br) * Math.sin(a) * Math.cos(la0), Math.cos(a) - Math.sin(la0) * Math.sin(la)); const [px, py] = P(lo / D2R, la / D2R); b ? g.lineTo(px, py) : g.moveTo(px, py); } g.fill(); g.stroke(); }
    if (t > 1.9) { const r = rng(19), cx = 300, cy = 1000, k = clamp((t - 1.9) * 6); g.strokeStyle = 'rgba(255,255,255,0.85)'; g.lineWidth = 3; for (let i = 0; i < 14; i++) { let px = cx, py = cy, an = r() * 6.283; g.beginPath(); g.moveTo(px, py); for (let j = 0; j < 6; j++) { an += (r() - 0.5) * 0.7; px += Math.cos(an) * 90 * k; py += Math.sin(an) * 90 * k; g.lineTo(px, py); } g.stroke(); }
      g.lineWidth = 2; for (let ring = 1; ring < 4; ring++) { g.beginPath(); for (let i = 0; i <= 12; i++) { const an = i / 12 * 6.283; g.lineTo(cx + Math.cos(an) * ring * 70 * k * (0.8 + 0.3 * r()), cy + Math.sin(an) * ring * 70 * k * (0.8 + 0.3 * r())); } g.stroke(); } }
    shake(t, 1.9, 14); tag(t, 3, 5); rgbPop('900 KM', 80, 560, 200, GOLD, t, 0.6); label('AWAY: WINDOWS SHATTERED', 84, 625, t, 1.9); }; };
VIS[4] = (K) => { K(0.45, 'pop', 0.8, 500); for (let i = 0; i < 10; i++) K(1.0 + i * 0.1, 'tick', 0.45); K(2.6, 'swish', 0.6); K(3.4, 'hit', 1.1);
  return (t) => { atmosphere(t, { x: 540, y: 1050, r: 800, c: 'rgba(255,59,48,0.10)' }); tag(t, 4, 5); const cx = 540, cy = 1120, R = 360;
    g.lineWidth = 44; g.strokeStyle = '#2B2A28'; g.beginPath(); g.arc(cx, cy, R, Math.PI, 0); g.stroke(); g.strokeStyle = RED; g.beginPath(); g.arc(cx, cy, R, Math.PI * 1.5, 0); g.stroke();
    for (let k = 0; k <= 10; k++) { const a = Math.PI + k / 10 * Math.PI; g.fillStyle = TXT; g.fillRect(cx + Math.cos(a) * (R - 40) - 3, cy + Math.sin(a) * (R - 40) - 3, 6, 6); }
    text('0', cx - R, cy + 60, 'mono', 26, DIM, { align: 'center' }); text('50', cx, cy - R - 40, 'mono', 26, TXT, { align: 'center' }); text('100 MT', cx + R, cy + 60, 'mono', 26, RED, { align: 'center' });
    const needle = (v, col, dash) => { const a = Math.PI + v / 100 * Math.PI; g.strokeStyle = col; g.lineWidth = 10; g.lineCap = 'round'; if (dash) g.setLineDash([16, 14]); g.beginPath(); g.moveTo(cx, cy); g.lineTo(cx + Math.cos(a) * (R - 70), cy + Math.sin(a) * (R - 70)); g.stroke(); g.setLineDash([]); };
    if (t > 2.6) needle(lerp(50, 100, ease((t - 2.6) / 0.7)), 'rgba(255,59,48,0.75)', true); needle(ramp(t, 1.0, 1.0, 0, 50), TXT); g.fillStyle = TXT; g.beginPath(); g.arc(cx, cy, 20, 0, 6.283); g.fill();
    rgbPop('TONED DOWN.', 80, 540, fit('TONED DOWN.', 'disp', 150, 920), TXT, t, 0.45); if (t > 3.4) rgbPop('DESIGNED FOR 100', 80, 660, fit('DESIGNED FOR 100', 'disp', 90, 920), RED, t, 3.4); }; };
