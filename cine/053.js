// Wiki Roulette #053 — Hubble Deep Field (1995)
const GCOL = ['255,236,200', '255,200,150', '200,220,255', '255,170,120', '235,240,255'];
function galaxy(x, y, s, rot, type, col, a = 1) { g.save(); g.translate(x, y); g.rotate(rot); g.globalCompositeOperation = 'lighter';
  const gr = g.createRadialGradient(0, 0, 0, 0, 0, s); gr.addColorStop(0, `rgba(${col},${a})`); gr.addColorStop(0.3, `rgba(${col},${0.35 * a})`); gr.addColorStop(1, `rgba(${col},0)`);
  g.scale(1, type === 2 ? 0.35 : type === 1 ? 0.75 : 0.55); g.fillStyle = gr; g.beginPath(); g.arc(0, 0, s, 0, 6.283); g.fill();
  if (type === 1 && s > 14) { g.fillStyle = `rgba(170,200,255,${0.5 * a})`; for (let arm = 0; arm < 2; arm++) for (let k = 0; k < 26; k++) { const th = k * 0.22 + arm * Math.PI, r = s * 0.12 * Math.exp(k * 0.075); g.beginPath(); g.arc(Math.cos(th) * r, Math.sin(th) * r, Math.max(1, s * 0.05), 0, 6.283); g.fill(); } }
  g.restore(); }
function field(t, n, x0, y0, w, h, a = 1, seed = 53) { const r = rng(seed); for (let i = 0; i < n; i++) { const x = x0 + r() * w, y = y0 + r() * h, big = r(), s = (big > 0.97 ? 40 + r() * 40 : big > 0.8 ? 14 + r() * 16 : 4 + r() * 8) * Math.min(w, h) / 1080;
  const ap = clamp(a * 3 - (i / n) * 2); if (ap > 0) galaxy(x, y, s, r() * 6.28, Math.floor(r() * 3), GCOL[Math.floor(r() * 5)], ap); } }
function hubble(x, y, s, rot) { g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s); g.fillStyle = '#2C4A8A'; g.fillRect(-30, -110, 60, 70); g.fillRect(-30, 40, 60, 70);
  g.strokeStyle = '#7FA0E0'; g.lineWidth = 2; for (let k = -100; k < -40; k += 14) { g.beginPath(); g.moveTo(-30, k); g.lineTo(30, k); g.stroke(); } for (let k = 50; k < 110; k += 14) { g.beginPath(); g.moveTo(-30, k); g.lineTo(30, k); g.stroke(); }
  g.fillStyle = '#C9CDD2'; g.fillRect(-90, -34, 170, 68); g.fillStyle = '#8A9098'; g.fillRect(80, -30, 22, 60); g.fillStyle = '#E4E7EA'; g.fillRect(-90, -34, 60, 68); g.restore(); }
VIS.open = (K) => { K(0.3, 'sonar', 0.6); K(2.4, 'bloop', 0.6);
  return (t) => { if (!photoBG(t, 'lead', { zoom: [1.0, 1.35], dur: 5, top: 0.75, mid: 0.0, bottom: 0.5 })) { g.fillStyle = '#020306'; g.fillRect(0, 0, W, H); g.save(); g.translate(540, 1000); g.scale(1 + t * 0.06, 1 + t * 0.06); g.translate(-540, -1000); field(t, 520, 0, 0, W, H, 1); g.restore(); }
    tag(t); hook(t, EP.hook, 480); }; };
VIS[0] = (K) => { K(0.45, 'pop', 0.8, 500); K(1.4, 'swish', 0.5); K(2.6, 'pop', 1, 900);
  return (t) => { atmosphere(t); stars(t, 100, 3); g.fillStyle = '#14130F'; g.fillRect(0, 1150, W, H - 1150); human(150, 1150, 170, TXT);
    const bx = 940, by = 1080; g.strokeStyle = 'rgba(255,194,61,0.7)'; g.lineWidth = 3; g.setLineDash([12, 10]); g.beginPath(); g.moveTo(170, 1000); g.lineTo(lerp(170, bx, ease((t - 1.0) / 1.2)), lerp(1000, by, ease((t - 1.0) / 1.2))); g.stroke(); g.setLineDash([]);
    g.fillStyle = '#D8F05A'; g.beginPath(); g.arc(bx, by, 4, 0, 6.283); g.fill();
    const s = spring(t - 2.6, 220, 16); if (s > 0) { g.save(); g.translate(720, 860); g.scale(s, s); g.fillStyle = '#0C0B0A'; g.beginPath(); g.arc(0, 0, 130, 0, 6.283); g.fill(); g.strokeStyle = GOLD; g.lineWidth = 5; g.stroke();
      g.fillStyle = '#D8F05A'; g.beginPath(); g.arc(0, 0, 80, 0, 6.283); g.fill(); g.strokeStyle = '#FFFFFF'; g.lineWidth = 7; g.beginPath(); g.arc(-90, 0, 70, -0.9, 0.9); g.stroke(); g.beginPath(); g.arc(90, 0, 70, Math.PI - 0.9, Math.PI + 0.9); g.stroke(); g.restore();
      g.strokeStyle = GOLD; g.lineWidth = 3; g.beginPath(); g.moveTo(bx, by); g.lineTo(800, 970); g.stroke(); }
    if (t > 1.4) popNum('100 M', 560, 1110, 60, GOLD, t, 1.6, { align: 'center' });
    tag(t, 0, 4); rgbPop('TINY.', 80, 560, 200, TXT, t, 0.45); label('LIKE A TENNIS BALL SEEN FROM 100 M', 84, 625, t, 1.4, { size: 26 }); }; };
VIS[1] = (K) => { K(0.45, 'pop', 0.8, 400); for (let i = 0; i < 10; i++) K(1.5 + i * 0.16, 'tick', 0.6); K(3.2, 'land', 0.8);
  return (t) => { atmosphere(t); stars(t, 90, 4); const cx = 540, cy = 1000, b = 240 * spring(t - 0.3, 200, 18);
    g.fillStyle = '#000'; g.fillRect(cx - b / 2, cy - b / 2, b, b); g.strokeStyle = GOLD; g.lineWidth = 5; g.strokeRect(cx - b / 2, cy - b / 2, b, b); hubble(860, 760, 0.8, -0.5 + Math.sin(t) * 0.03);
    g.strokeStyle = 'rgba(255,194,61,0.25)'; g.lineWidth = 2; g.beginPath(); g.moveTo(800, 790); g.lineTo(cx + b / 2, cy - b / 2); g.moveTo(800, 790); g.lineTo(cx - b / 2, cy + b / 2); g.stroke();
    const d = Math.min(10, Math.floor(clamp((t - 1.5) / 1.6) * 10 + 1e-6)); tag(t, 1, 4); rgbPop('EMPTY?', 80, 560, 200, TXT, t, 0.45);
    if (t > 1.5) popNum(`DAY ${d}`, 80, 720, 110, d >= 10 ? GOLD : TXT, t, 1.5); label('HUBBLE KEPT STARING', 84, 780, t, 1.8, { color: GOLD }); }; };
VIS[2] = (K) => { K(0.4, 'riser', 0.6, 1.6); K(2.0, 'hit', 1); [2.4, 2.7, 3.0].forEach((a) => K(a, 'pop', 0.7, 700));
  return (t) => { g.fillStyle = '#020306'; g.fillRect(0, 0, W, H); const p = ease((t - 0.3) / 1.7), b = lerp(240, 1500, p), cx = 540, cy = 1000;
    g.save(); g.beginPath(); g.rect(cx - b / 2, cy - b / 2, b, b); g.clip(); g.translate(cx - b / 2, cy - b / 2); g.scale(b / 1500, b / 1500); field(t, 520, 0, 0, 1500, 1500, clamp((t - 0.8) / 1.2)); g.restore();
    if (p < 1) { g.strokeStyle = GOLD; g.lineWidth = 5; g.strokeRect(cx - b / 2, cy - b / 2, b, b); }
    [[300, 900, 2.4], [760, 1060, 2.7], [520, 760, 3.0]].forEach(([x, y, a]) => { galaxy(x, y, 30, a, 1, GCOL[Math.round(a * 3) % 5], clamp((t - 0.8) / 1.2)); const s = spring(t - a, 260, 16); if (s > 0) { g.strokeStyle = GOLD; g.lineWidth = 4; g.beginPath(); g.arc(x, y, 50 * s, 0, 6.283); g.stroke(); label('GALAXY', x, y - 64, t, a, { align: 'center', size: 22, color: GOLD }); } });
    tag(t, 2, 4); rgbPop('EVERY DOT', 80, 560, fit('EVERY DOT', 'disp', 170, 920), TXT, t, 0.45); if (t > 2.0) chip('= A GALAXY', 80, 640, t, 2.0, { size: 40, align: 'left' }); }; };
VIS[3] = (K) => { K(0.45, 'riser', 0.5, 1.5); for (let i = 0; i < 14; i++) K(0.5 + i * 0.1, 'tick', 0.4); K(2.0, 'hit', 1.1); K(2.6, 'whoosh', 0.8);
  return (t) => { g.fillStyle = '#020306'; g.fillRect(0, 0, W, H); const z = Math.exp(lerp(0, Math.log(240 / 1500), ease((t - 2.6) / 1.2))), b = 1500 * z;
    stars(t, 90 * clamp((t - 2.6) * 2), 4); g.save(); g.beginPath(); g.rect(540 - b / 2, 1000 - b / 2, b, b); g.clip(); g.translate(540 - b / 2, 1000 - b / 2); g.scale(z, z); field(t, 520, 0, 0, 1500, 1500, 1); g.restore();
    if (z < 0.9) { g.strokeStyle = GOLD; g.lineWidth = 5; g.strokeRect(540 - b / 2, 1000 - b / 2, b, b); }
    g.fillStyle = 'rgba(2,3,6,0.45)'; g.fillRect(0, 380, W, 420); tag(t, 3, 4); rgbPop(fmt(ramp(t, 0.5, 1.5, 0, 3000)), 80, 600, 260, GOLD, t, 0.45); label('GALAXIES · ONE SPECK OF SKY', 84, 670, t, 2.0); }; };
