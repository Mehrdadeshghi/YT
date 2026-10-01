// Wiki Roulette #050 — Pale Blue Dot (1990)
const DOT = [652, 1010];
function bands(t, o = 1) { g.fillStyle = '#05060A'; g.fillRect(0, 0, W, H); stars(t, 60, 50);
  [[300, 120, '210,140,90', 0.20], [520, 160, '230,170,110', 0.28], [700, 90, '160,150,190', 0.16], [880, 130, '220,120,100', 0.18]].forEach(([x, w, c, a], i) => {
    g.save(); g.translate(x + Math.sin(t * 0.3 + i) * 6, 960); g.rotate(-0.08); const gr = g.createLinearGradient(-w, 0, w, 0); gr.addColorStop(0, `rgba(${c},0)`); gr.addColorStop(0.5, `rgba(${c},${a * o})`); gr.addColorStop(1, `rgba(${c},0)`);
    g.fillStyle = gr; g.fillRect(-w, -1200, 2 * w, 2400); g.restore(); });
  g.fillStyle = 'rgba(255,255,255,0.03)'; const r = rng(Math.floor(t * 24)); for (let i = 0; i < 300; i++) g.fillRect(r() * W, r() * H, 2, 2); }
function earthDot(t, x, y, a = 1) { glowDot(x, y, 26, '140,200,255', 0.5 * a); g.fillStyle = `rgba(200,230,255,${a})`; g.beginPath(); g.arc(x, y, 4, 0, 6.283); g.fill(); }
function voyager(x, y, s, rot = 0) { g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s);
  g.strokeStyle = '#B8B2A6'; g.lineWidth = 4; g.beginPath(); g.moveTo(0, 0); g.lineTo(-170, 40); g.moveTo(0, 0); g.lineTo(150, 60); g.moveTo(0, 0); g.lineTo(40, -230); g.stroke();
  g.fillStyle = '#6E665A'; g.fillRect(-150, 30, 46, 22); g.fillStyle = '#D9A441'; g.fillRect(-30, -20, 60, 40);
  g.fillStyle = '#EDE9E1'; g.beginPath(); g.ellipse(0, -40, 26, 95, 0, 0, 6.283); g.fill(); g.fillStyle = '#C9C3B8'; g.beginPath(); g.ellipse(6, -40, 14, 70, 0, 0, 6.283); g.fill();
  g.strokeStyle = '#EDE9E1'; g.lineWidth = 3; g.beginPath(); g.moveTo(-20, -40); g.lineTo(-90, -40); g.stroke(); g.restore(); }
VIS.open = (K) => { K(1.6, 'sonar', 0.7); K(2.8, 'bloop', 0.6);
  return (t) => { if (!photoBG(t, 'lead', { zoom: [1.0, 1.25], dur: 5, focus: [0.5, 0.55], top: 0.7, mid: 0.05, bottom: 0.6 })) { bands(t); earthDot(t, ...DOT); }
    if (t > 1.6) { const p = spring(t - 1.6, 200, 14); g.strokeStyle = GOLD; g.lineWidth = 5; g.beginPath(); g.arc(DOT[0], DOT[1], 70 * p + 10, 0, 6.283); g.stroke();
      g.beginPath(); g.moveTo(DOT[0] + 60, DOT[1] - 50); g.lineTo(DOT[0] + 170, DOT[1] - 160); g.stroke(); label('YOU ARE HERE', DOT[0] + 30, DOT[1] - 180, t, 1.9, { color: GOLD, size: 30 }); }
    tag(t); hook(t, EP.hook, 500); }; };
VIS[0] = (K) => { K(0.45, 'hit', 0.9); K(1.2, 'riser', 0.4, 3); for (let i = 0; i < 12; i++) K(1.4 + i * 0.25, 'tick', 0.4); K(4.5, 'pop', 0.8, 700);
  return (t) => { atmosphere(t); stars(t, 180, 7); const d = ramp(t, 1.2, 3.3, 0, 6e9);
    glowDot(140, 1500, 120, '255,220,150', 0.7); earthDot(t, 220, 1430, 0.9); label('SUN', 110, 1640, t, 0.8, { size: 24, color: DIM }); label('EARTH', 200, 1400, t, 0.8, { size: 24, color: '#9FD0FF' });
    const px = lerp(420, 860, clamp(t / 5.5)), py = lerp(1150, 820, clamp(t / 5.5)); voyager(px, py, 0.9 + t * 0.02, 0.4);
    g.setLineDash([10, 14]); g.strokeStyle = 'rgba(255,194,61,0.5)'; g.lineWidth = 3; g.beginPath(); g.moveTo(220, 1430); g.lineTo(px, py); g.stroke(); g.setLineDash([]);
    tag(t, 0, 4); rgbPop('1990', 80, 560, 200, TXT, t, 0.45); label('VOYAGER 1', 84, 625, t, 0.8, { color: GOLD });
    if (t > 1.2) popNum(`${fmt(d / 1e6)} MILLION KM`, 80, 1260 - 560, fit('6,000 MILLION KM', 'disp', 80, 920), d >= 6e9 ? GOLD : TXT, t, 1.2);
    if (t > 4.5) chip('FROM HOME', 80, 790, t, 4.5, { size: 32, align: 'left', bg: '#2B2A28', fg: TXT }); }; };
VIS[1] = (K) => { K(0.45, 'pop', 0.8, 500); K(1.6, 'swish', 0.7); K(3.0, 'click', 1); K(3.05, 'flat', 0.5);
  return (t) => { atmosphere(t); stars(t, 180, 7); const rot = lerp(0.4, Math.PI + 0.25, ease((t - 1.4) / 1.4));
    const cx = 800, cy = 820; if (t > 2.7) { const a = clamp((t - 2.7) * 2); g.save(); g.globalCompositeOperation = 'lighter'; const gr = g.createLinearGradient(cx, cy, 120, cy + 260); gr.addColorStop(0, `rgba(255,194,61,${0.35 * a})`); gr.addColorStop(1, 'rgba(255,194,61,0)');
      g.fillStyle = gr; g.beginPath(); g.moveTo(cx - 60, cy); g.lineTo(0, cy + 40); g.lineTo(0, cy + 420); g.closePath(); g.fill(); g.restore(); }
    earthDot(t, 150, cy + 230, 1); voyager(cx, cy, 1.1, rot);
    if (t > 3.0) { g.strokeStyle = TXT; g.lineWidth = 4; const k = 1 + 0.1 * Math.exp(-(t - 3) * 6); g.strokeRect(150 - 70 * k, cy + 230 - 70 * k, 140 * k, 140 * k); }
    tag(t, 1, 4); rgbPop('CARL SAGAN', 80, 560, fit('CARL SAGAN', 'disp', 150, 920), TXT, t, 0.45); label('ASKED NASA: LOOK BACK', 84, 625, t, 1.0, { color: GOLD }); }; };
VIS[2] = (K) => { K(0.5, 'riser', 0.6, 2.2); K(2.8, 'hit', 1); K(2.85, 'mute', 1, 0.5);
  return (t) => { g.fillStyle = '#05060A'; g.fillRect(0, 0, W, H);
    const z = Math.exp(lerp(Math.log(8), Math.log(420), ease((t - 0.4) / 2.4))), cx = 540, cy = 1000;
    g.save(); g.beginPath(); g.rect(0, 380, W, 1100); g.clip(); const n = Math.ceil(700 / z) + 1, r = rng(5);
    for (let i = -n; i <= n; i++) for (let j = -n; j <= n; j++) { const v = 10 + ((i * 7 + j * 13) & 7) * 3 + (Math.abs((i * 31 + j * 17) % 5) < 1 ? 30 : 0); g.fillStyle = `rgb(${v + 14},${v + 8},${v})`; g.fillRect(cx + i * z - z / 2, cy + j * z - z / 2, z - Math.min(4, z * 0.06), z - Math.min(4, z * 0.06)); }
    g.fillStyle = '#05060A'; g.fillRect(cx - z / 2, cy - z / 2, z, z); const e = z * Math.sqrt(0.12); glowDot(cx, cy, e * 1.6, '120,190,255', 0.5); g.fillStyle = '#9FD0FF'; g.fillRect(cx - e / 2, cy - e / 2, e, e);
    g.strokeStyle = GOLD; g.lineWidth = 6; g.strokeRect(cx - z / 2, cy - z / 2, z, z); g.restore();
    tag(t, 2, 4); rgbPop('0.12', 80, 600, 260, GOLD, t, 2.8); label('OF ONE PIXEL', 84, 670, t, 3.0, { size: 34 }); if (t > 3.0) label('1 PIXEL', cx - 210, cy - 225, t, 3.2, { size: 26, color: GOLD }); }; };
VIS[3] = (K) => { K(1.2, 'zap', 0.8); K(1.6, 'mute', 1, 1.5); K(2.0, 'thump', 1);
  return (t) => { const p = clamp((t - 1.2) / 0.5), q = clamp((t - 1.7) / 0.3); g.fillStyle = '#000'; g.fillRect(0, 0, W, H);
    if (q < 1) { g.save(); g.translate(540, 960); g.scale(lerp(1, 0.004, q), lerp(1, 0.003, p)); g.translate(-540, -960); bands(t, 1 + p * 2); earthDot(t, ...DOT); g.restore();
      if (p > 0.5) { g.fillStyle = `rgba(255,255,255,${1 - q})`; g.fillRect(lerp(0, 538, q), 958, lerp(W, 4, q), 4); } }
    if (t > 2.0) glowDot(540, 960, 20 * Math.exp(-(t - 2) * 3), '255,255,255', 1);
    tag(t, 3, 4); stampText('SWITCHED OFF', 540, 640, t, 2.0, { size: 92, rot: -0.07 }); if (t > 2.6) label('FOR GOOD', 540, 800, t, 2.6, { align: 'center', size: 40, color: GOLD }); }; };
