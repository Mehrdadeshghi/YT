// Wiki Roulette #058 — Pheasant Island: changes country every six months
const PI = [-1.7631, 43.3428], ESC = '#F1BF00', FRC = '#2E6FE0';
function owner(m) { return m >= 1 && m <= 6 ? 'ES' : 'FR'; }                    // month index 0=Jan … 11=Dec; Feb–Jul Spanish
function river(t, own, o = {}) { const z = o.z || 1; g.fillStyle = '#2C4A2A'; g.fillRect(0, 0, W, H);
  const r = rng(58); for (let i = 0; i < 160; i++) { g.fillStyle = `rgba(${40 + r() * 30 | 0},${70 + r() * 40 | 0},${35 + r() * 20 | 0},0.6)`; g.beginPath(); g.arc(r() * W, r() * H, 20 + r() * 40, 0, 6.283); g.fill(); }
  g.save(); g.translate(540, 1000); g.scale(z, z); g.rotate(-0.55);
  const wg = g.createLinearGradient(0, -260, 0, 260); wg.addColorStop(0, '#1C4E6E'); wg.addColorStop(0.5, '#2A6A8E'); wg.addColorStop(1, '#1C4E6E'); g.fillStyle = wg; g.fillRect(-1600, -260, 3200, 520);
  g.strokeStyle = 'rgba(200,230,255,0.25)'; g.lineWidth = 3; for (let k = 0; k < 14; k++) { const y = -230 + k * 36, x0 = ((t * 80 + k * 137) % 400) - 1600; for (let x = x0; x < 1600; x += 400) { g.beginPath(); g.moveTo(x, y); g.lineTo(x + 120, y); g.stroke(); } }
  g.fillStyle = '#C9B98A'; g.beginPath(); g.ellipse(0, 0, 310, 70, 0, 0, 6.283); g.fill(); g.fillStyle = '#4C7A3A'; g.beginPath(); g.ellipse(0, -4, 290, 56, 0, 0, 6.283); g.fill();
  const rr = rng(5); for (let i = 0; i < 22; i++) { g.fillStyle = '#2F5A26'; g.beginPath(); g.arc(-250 + rr() * 500, -30 + rr() * 50, 16 + rr() * 12, 0, 6.283); g.fill(); }
  g.fillStyle = '#EDE6D8'; g.fillRect(-10, -60, 20, 40); g.beginPath(); g.moveTo(-18, -60); g.lineTo(0, -82); g.lineTo(18, -60); g.fill();
  if (own) { g.globalAlpha = 0.45; g.fillStyle = own === 'ES' ? ESC : FRC; g.beginPath(); g.ellipse(0, -4, 290, 56, 0, 0, 6.283); g.fill(); g.globalAlpha = 1; }
  g.restore(); g.fillStyle = 'rgba(0,0,0,0.25)'; g.fillRect(0, 0, W, H);
  if (o.banks !== false) { text('SPAIN · IRUN', 120, 1420, 'ui', 40, ESC, { shadow: true }); text('FRANCE · HENDAYE', 960, 760, 'ui', 40, '#7FB2FF', { align: 'right', shadow: true }); } }
VIS.open = (K) => { K(0.2, 'whoosh', 0.9); for (let i = 0; i < 6; i++) K(1.2 + i * 0.5, 'flat', 0.5);
  return (t) => { earth(t, camPath(t, [[0, -20, 30, 2.8, 0, 0], [0.15, PI[0], PI[1], 0.035, 45, 0]], { k: 10, d: 6.4 }));
    territory('France', FRC, 0.35, {}); territory('Spain', ESC, 0.35, {}); const [x, y] = MAP.P(...PI); shockRing(x, y, t % 1 + 1, 1, 160, '255,255,255', 2);
    const m = Math.floor((t - 1.2) / 0.5); if (t > 1.2) flag(m % 2 ? 'FR' : 'ES', 540, 1300, 300, t, { s: Math.abs(Math.cos(((t - 1.2) % 0.5) / 0.5 * Math.PI)) });
    tag(t); hook(t, EP.hook, 480); }; };
VIS[0] = (K) => { K(0.6, 'land', 0.8); K(2.4, 'pop', 0.8, 600);
  return (t) => { earth(t, camPath(t, [[0, PI[0], PI[1], 0.035, 45, 0], [0.1, PI[0] + 0.02, PI[1] - 0.01, 0.02, 50, -15]], { k: 4, d: 4 }));
    territory('France', FRC, 0.45, { stroke: '#7FB2FF', glow: 8 }); territory('Spain', ESC, 0.32, { stroke: ESC, glow: 8 });
    place(...PI, 'PHEASANT ISLAND', t, 0.6, { color: GOLD, size: 38 }); const [x, y] = MAP.P(...PI); if (t > 0.6) shockRing(x, y, t % 1.2 + 0.6, 0.6, 120, '255,194,61', 2);
    tag(t, 0, 4); rgbPop('FRANCE', 80, 540, 120, '#7FB2FF', t, 2.2); rgbPop('SPAIN', 80, 670, 120, ESC, t, 2.6); }; };
VIS[1] = (K) => { K(0.45, 'hit', 1); K(1.4, 'swish', 0.7); for (let i = 0; i < 18; i++) K(1.9 + i * 0.06, 'type', 0.4); K(3.6, 'thump', 1);
  return (t) => { river(t, null, { banks: false }); tag(t, 1, 4); yearTag(1659, t, 0.45);
    const s = spring(t - 1.3, 170, 20); if (s > 0) { g.save(); g.translate(0, (1 - s) * 500); paper(540, 980, 700, 380, -0.03); text('PEACE TREATY', 0, -110, 'mono', 26, '#7A7266', { align: 'center', ls: 6 });
      typed('Treaty of the Pyrenees', -300, 0, 'serif', 52, PINK, t, 1.9, 1.0); g.restore(); flag('ES', 300, 1250, 160, t, { s }); flag('FR', 780, 1250, 160, t + 1, { s }); }
    stampText('SIGNED HERE', 540, 740, t, 3.6, { size: 70, rot: -0.07, color: '#2F7A4A' }); }; };
VIS[2] = (K) => { for (let i = 0; i < 12; i++) K(0.6 + i * 0.3, 'tick', i === 1 || i === 7 ? 1 : 0.4); [0.9, 2.7].forEach((a) => K(a, 'pop', 0.9, 700));
  return (t) => { const m = Math.min(11, Math.floor(clamp((t - 0.6) / 3.6) * 12)), own = owner(m); river(t, own, { banks: false });
    const cx = 540, cy = 1010, R = 360; for (let i = 0; i < 12; i++) { const a0 = -Math.PI / 2 + i / 12 * 6.283, a1 = a0 + 6.283 / 12 - 0.03; g.strokeStyle = owner(i) === 'ES' ? ESC : FRC; g.globalAlpha = i === m ? 1 : 0.45; g.lineWidth = i === m ? 46 : 30;
      g.beginPath(); g.arc(cx, cy, R, a0, a1); g.stroke(); g.globalAlpha = 1; const am = (a0 + a1) / 2; text('JFMAMJJASOND'[i], cx + Math.cos(am) * (R + 52), cy + Math.sin(am) * (R + 52) + 12, 'ui', 30, i === m ? TXT : DIM, { align: 'center' }); }
    flag(own, cx, cy - 150, 200, t); tag(t, 2, 4);
    rgbPop(own === 'ES' ? 'SPANISH' : 'FRENCH', 80, 560, 150, own === 'ES' ? ESC : '#7FB2FF', t, m === 1 ? 0.9 : m === 7 ? 2.7 : 0.45);
    label(own === 'ES' ? '1 FEBRUARY – 31 JULY' : '1 AUGUST – 31 JANUARY', 84, 625, t, 0.6, { color: TXT }); }; };
VIS[3] = (K) => { K(0.45, 'pop', 0.8, 500); K(0.8, 'riser', 0.4, 1); K(2.6, 'scratch'); K(2.62, 'thump', 1.1);
  return (t) => { river(t, null, { z: 1 + 0.25 * ease(t / 2), banks: false }); tag(t, 3, 4);
    const p = ease((t - 0.8) / 1.0); g.strokeStyle = GOLD; g.lineWidth = 6; g.save(); g.translate(540, 1000); g.rotate(-0.55); g.beginPath(); g.moveTo(-380 * p, -150); g.lineTo(380 * p, -150); g.stroke(); g.restore();
    rgbPop('200 M', 80, 560, 200, GOLD, t, 1.6); label('LONG · 40 M WIDE', 84, 625, t, 1.8);
    if (!photoCard(t, 'lead', 600, 400, 380, 260, 1.2, 'PHEASANT ISLAND')) {}
    stampText('NO VISITORS', 540, 820, t, 2.6, { size: 90, rot: -0.08 }); }; };
