// Wiki Roulette #058 — Pheasant Island: changes country every six months
const PI = [-1.7631, 43.3428], ESC = '#E8443A', FRC = '#4D8BFF';
function owner(m) { return m >= 1 && m <= 6 ? 'ES' : 'FR'; }                    // month index 0=Jan … 11=Dec; Feb–Jul Spanish
function bg(t, keys, o = {}) { earth(t, camPath(t, keys, { k: 3, d: 3.4 })); territory('France', FRC, 0.62, { stroke: '#DDE8FF', glow: 10 }); territory('Spain', ESC, 0.55, { stroke: '#FFC2BE', glow: 10 });
  if (o.dim) { g.fillStyle = `rgba(2,6,14,${o.dim})`; g.fillRect(0, 0, W, H); } }
function river(w, h, t, own, o = {}) { const z = o.z || 1; g.save(); g.translate(w / 2, h / 2); g.scale(z, z); g.rotate(-0.5);
  g.fillStyle = '#3B4A32'; g.fillRect(-1400, -1400, 2800, 2800); g.fillStyle = 'rgba(77,139,255,0.5)'; g.fillRect(-1400, -1400, 2800, 1290); g.fillStyle = 'rgba(232,68,58,0.45)'; g.fillRect(-1400, 110, 2800, 1290);
  const wg = g.createLinearGradient(0, -110, 0, 110); wg.addColorStop(0, '#174B70'); wg.addColorStop(0.5, '#2A6E96'); wg.addColorStop(1, '#174B70'); g.fillStyle = wg; g.fillRect(-1400, -110, 2800, 220);
  g.strokeStyle = 'rgba(200,230,255,0.25)'; g.lineWidth = 2; for (let k = 0; k < 8; k++) { const y = -95 + k * 26, x0 = ((t * 60 + k * 137) % 300) - 1400; for (let x = x0; x < 1400; x += 300) { g.beginPath(); g.moveTo(x, y); g.lineTo(x + 90, y); g.stroke(); } }
  g.fillStyle = '#C9B98A'; g.beginPath(); g.ellipse(0, 0, 175, 36, 0, 0, 6.283); g.fill(); g.fillStyle = '#4C7A3A'; g.beginPath(); g.ellipse(0, -2, 164, 28, 0, 0, 6.283); g.fill();
  if (own) { g.fillStyle = own === 'ES' ? 'rgba(232,68,58,0.85)' : 'rgba(77,139,255,0.9)'; g.beginPath(); g.ellipse(0, -2, 164, 28, 0, 0, 6.283); g.fill(); }
  g.strokeStyle = '#FFFFFF'; g.lineWidth = 2; g.setLineDash([10, 8]); g.beginPath(); g.moveTo(-1400, 0); g.lineTo(-180, 0); g.moveTo(180, 0); g.lineTo(1400, 0); g.stroke(); g.setLineDash([]);
  g.restore(); if (o.labels !== false) { mapLabel('FRANCE · HENDAYE', w - 320, 70, '#BFD6FF', 30); mapLabel('SPAIN · IRUN', 30, h - 40, '#FFC2BE', 30); mapLabel('PHEASANT ISLAND', w / 2, h / 2 + 90, GOLD, 26, { center: true }); } }
VIS.open = (K) => { K(0.2, 'whoosh', 0.9); for (let i = 0; i < 6; i++) K(1.2 + i * 0.5, 'flat', 0.5);
  return (t) => { earth(t, camPath(t, [[0, -20, 30, 2.8, 0, 0], [0.15, PI[0], PI[1], 0.03, 45, 0]], { k: 10, d: 6.4 }));
    territory('France', FRC, 0.62, { stroke: '#DDE8FF' }); territory('Spain', ESC, 0.55, { stroke: '#FFC2BE' }); const [x, y] = MAP.P(...PI); shockRing(x, y, t % 1 + 1, 1, 160, '255,255,255', 2);
    const m = Math.floor((t - 1.2) / 0.5); if (t > 1.2) flag(m % 2 ? 'FR' : 'ES', 540, 1330, 320, t, { s: 0.25 + 0.75 * Math.abs(Math.cos(((t - 1.2) % 0.5) / 0.5 * Math.PI)) });
    tag(t); hook(t, EP.hook, 480); }; };
VIS[0] = (K) => { K(0.6, 'land', 0.8); K(1.8, 'pop', 0.8, 600); K(2.6, 'pop', 0.8, 800);
  return (t) => { bg(t, [[0, PI[0], PI[1], 0.03, 45, 0], [0.1, PI[0] + 0.02, PI[1] - 0.01, 0.016, 50, -15]]);
    place(...PI, 'PHEASANT ISLAND', t, 0.6, { color: GOLD, size: 40, left: true }); const [x, y] = MAP.P(...PI); if (t > 0.6) shockRing(x, y, t % 1.2 + 0.6, 0.6, 120, '255,194,61', 2);
    place(-0.9, 43.9, 'FRANCE', t, 1.8, { color: '#BFD6FF', size: 44 }); place(-2.6, 42.9, 'SPAIN', t, 2.6, { color: '#FFC2BE', size: 44, left: true });
    tag(t, 0, 4); rgbPop('BIDASOA RIVER', 80, 560, fit('BIDASOA RIVER', 'disp', 130, 920), TXT, t, 0.45); }; };
VIS[1] = (K) => { K(0.3, 'whoosh', 0.7); K(0.45, 'hit', 1); for (let i = 0; i < 18; i++) K(2.1 + i * 0.06, 'type', 0.4); K(3.8, 'thump', 1);
  return (t) => { bg(t, [[0, PI[0], PI[1], 0.016, 50, -15], [0.1, PI[0], PI[1], 0.02, 40, 10]], { dim: 0.35 }); tag(t, 1, 4); yearTag(1659, t, 0.45);
    inset(t, 0.3, 'BIDASOA · FRANCE / SPAIN', (w, h) => river(w, h, t, null));
    const s = spring(t - 1.6, 170, 20); if (s > 0) { g.save(); g.translate(0, (1 - s) * 500); paper(540, 1020, 640, 260, -0.03); text('PEACE TREATY', 0, -60, 'mono', 24, '#7A7266', { align: 'center', ls: 6 });
      typed('Treaty of the Pyrenees', -270, 30, 'serif', 48, PINK, t, 2.1, 1.0); g.restore(); }
    stampText('SIGNED HERE', 760, 760, t, 3.8, { size: 62, rot: -0.08, color: '#2F9A5A' }); }; };
VIS[2] = (K) => { for (let i = 0; i < 12; i++) K(0.6 + i * 0.3, 'tick', i === 1 || i === 7 ? 1 : 0.4); [0.9, 2.7].forEach((a) => K(a, 'pop', 0.9, 700));
  return (t) => { const m = Math.min(11, Math.floor(clamp((t - 0.6) / 3.6) * 12)), own = owner(m);
    bg(t, [[0, PI[0], PI[1], 0.02, 40, 10], [0.1, PI[0], PI[1], 0.024, 44, -10]], { dim: 0.4 }); tag(t, 2, 4);
    inset(t, -1, null, (w, h) => { river(w, h, t, own, { labels: false, z: 1.1 }); const cx = w / 2, cy = h / 2, R = 220;
      for (let i = 0; i < 12; i++) { const a0 = -Math.PI / 2 + i / 12 * 6.283, a1 = a0 + 6.283 / 12 - 0.04; g.strokeStyle = owner(i) === 'ES' ? ESC : FRC; g.globalAlpha = i === m ? 1 : 0.5; g.lineWidth = i === m ? 34 : 22;
        g.beginPath(); g.arc(cx, cy, R, a0, a1); g.stroke(); g.globalAlpha = 1; const am = (a0 + a1) / 2; text('JFMAMJJASOND'[i], cx + Math.cos(am) * (R + 40), cy + Math.sin(am) * (R + 40) + 10, 'ui', 26, i === m ? TXT : '#C9C3B8', { align: 'center' }); }
      flag(own, cx, cy - 90, 150, t); });
    rgbPop(own === 'ES' ? 'SPANISH' : 'FRENCH', 80, 560, 150, own === 'ES' ? '#FF7A70' : '#9CC0FF', t, m === 1 ? 0.9 : m === 7 ? 2.7 : 0.45);
    label(own === 'ES' ? '1 FEBRUARY – 31 JULY' : '1 AUGUST – 31 JANUARY', 84, 625, t, 0.6, { color: TXT }); }; };
VIS[3] = (K) => { K(0.45, 'pop', 0.8, 500); K(0.8, 'riser', 0.4, 1); K(2.4, 'scratch'); K(2.42, 'thump', 1.1);
  return (t) => { bg(t, [[0, PI[0], PI[1], 0.024, 44, -10], [0.1, PI[0], PI[1], 0.012, 52, 20]], { dim: 0.35 }); tag(t, 3, 4);
    if (t > 4 || !photoCard(t, 'lead', 110, 690, 860, 500, 0.3, 'PHEASANT ISLAND · BIDASOA')) inset(t, 0.3, 'PHEASANT ISLAND', (w, h) => { river(w, h, t, t > 4 ? (Math.floor(t * 1.2) % 2 ? 'FR' : 'ES') : null, { z: 1.5 + 0.2 * ease(t / 3), labels: false });
      const p = ease((t - 0.8) / 0.8); g.save(); g.translate(w / 2, h / 2); g.rotate(-0.5); g.strokeStyle = GOLD; g.lineWidth = 6; g.beginPath(); g.moveTo(-260 * p, -90); g.lineTo(260 * p, -90); g.stroke(); g.restore(); });
    rgbPop('200 M', 80, 560, 190, GOLD, t, 1.4); label('LONG · 40 M WIDE', 84, 625, t, 1.6); stampText('NO VISITORS', 620, 1150, t, 2.4, { size: 80, rot: -0.08 }); }; };
