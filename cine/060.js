// Wiki Roulette #060 — Baarle: the border goes through front doors
const BL = [4.93, 51.44], NLC = '#FF7F1E', BEC = '#E8443A';
const BLOBS = (() => { const r = rng(60), out = []; for (let i = 0; i < 22; i++) { const big = i < 3; out.push({ x: 90 + r() * 780, y: 80 + r() * 400, rx: big ? 90 + r() * 40 : 18 + r() * 26, ry: big ? 64 + r() * 34 : 15 + r() * 20, a: r() * 3, s: Math.floor(r() * 1000) }); }
  out.sort((a, b) => b.rx - a.rx); return out; })();
function blob(x, y, rx, ry, rot, seed, col, a = 1) { const r = rng(seed); g.save(); g.globalAlpha = a; g.fillStyle = col; g.beginPath();
  for (let i = 0; i < 12; i++) { const an = i / 12 * 6.283, k = 0.75 + 0.35 * r(); g.lineTo(x + Math.cos(an + rot) * rx * k, y + Math.sin(an + rot) * ry * k); } g.closePath(); g.fill();
  g.strokeStyle = 'rgba(255,255,255,0.85)'; g.lineWidth = 2.5; g.setLineDash([7, 5]); g.stroke(); g.setLineDash([]); g.restore(); }
function bg(t, keys, dim = 0.35) { earth(t, camPath(t, keys, { k: 3, d: 3.4 })); territory('Netherlands', NLC, 0.38, { stroke: '#FFD0A0', glow: 8 }); territory('Belgium', BEC, 0.34, { stroke: '#FFC2BE', glow: 8 });
  if (dim) { g.fillStyle = `rgba(2,6,14,${dim})`; g.fillRect(0, 0, W, H); } }
function town(w, h, t) { g.fillStyle = '#2E3A2A'; g.fillRect(0, 0, w, h); g.fillStyle = 'rgba(255,127,30,0.42)'; g.fillRect(0, 0, w, h);
  const r = rng(61); g.strokeStyle = 'rgba(240,230,210,0.35)'; g.lineWidth = 5; for (let i = 0; i < 7; i++) { g.beginPath(); g.moveTo(r() * w, 0); g.bezierCurveTo(r() * w, h * 0.4, r() * w, h * 0.7, r() * w, h); g.stroke(); }
  g.fillStyle = 'rgba(20,16,12,0.35)'; for (let i = 0; i < 120; i++) g.fillRect(r() * w, r() * h, 8 + r() * 14, 8 + r() * 14); }
VIS.open = (K) => { K(0.2, 'whoosh', 0.9); K(2.2, 'thump', 0.9);
  return (t) => { earth(t, camPath(t, [[0, 0, 40, 2.8, 0, 0], [0.15, BL[0], BL[1], 0.03, 45, 0]], { k: 10, d: 6.4 }));
    territory('Netherlands', NLC, 0.45, { stroke: '#FFD0A0' }); territory('Belgium', BEC, 0.4, { stroke: '#FFC2BE' }); const [x, y] = MAP.P(...BL); shockRing(x, y, t % 1 + 1, 1, 160, '255,255,255', 2);
    tag(t); hook(t, EP.hook, 480); }; };
VIS[0] = (K) => { K(0.6, 'land', 0.8); K(1.6, 'pop', 0.8, 600); K(2.3, 'pop', 0.8, 800);
  return (t) => { bg(t, [[0, BL[0], BL[1], 0.03, 45, 0], [0.1, BL[0], BL[1] - 0.02, 0.02, 50, 12]], 0);
    place(...BL, 'BAARLE', t, 0.6, { color: GOLD, size: 44 }); place(4.98, 51.53, 'NETHERLANDS', t, 1.6, { color: '#FFD0A0', size: 40 }); place(4.82, 51.37, 'BELGIUM', t, 2.3, { color: '#FFC2BE', size: 40 });
    tag(t, 0, 4); rgbPop('BAARLE', 80, 560, 170, TXT, t, 0.45); }; };
VIS[1] = (K) => { for (let i = 0; i < 22; i++) K(0.5 + i * 0.07, 'pop', 0.35, 500 + i * 20); for (let i = 0; i < 7; i++) K(3.6 + i * 0.12, 'pop', 0.5, 900);
  const IN = [0, 0, 0, 0, 0, 0, 1];
  return (t) => { bg(t, [[0, BL[0], BL[1] - 0.02, 0.02, 50, 12], [0.1, BL[0], BL[1], 0.012, 40, -10]]); tag(t, 1, 4);
    const n = Math.min(22, Math.floor(clamp((t - 0.5) / 1.6) * 22 + 1e-6)), m = Math.min(7, Math.floor(clamp((t - 3.6) / 0.9) * 7 + 1e-6));
    inset(t, -1, 'BAARLE · THE BORDER PUZZLE', (w, h) => { town(w, h, t);
      BLOBS.slice(0, n).forEach((b, i) => { const s = spring(t - 0.5 - i * 0.07, 300, 16); blob(b.x, b.y, b.rx * s, b.ry * s, b.a, b.s, BEC, 0.9); });
      for (let i = 0; i < m; i++) { const b = BLOBS[IN[i]], an = i * 0.9, d = i === 6 ? 0 : 0.45; blob(b.x + Math.cos(an) * b.rx * d, b.y + Math.sin(an) * b.ry * d, 16, 13, i, 99 + i, NLC, 1); }
      mapLabel('NETHERLANDS', w - 250, h - 24, '#FFD0A0', 26); });
    rgbPop(`${n}`, 80, 560, 190, '#FF8A80', t, 0.5); label('PIECES OF BELGIUM INSIDE THE NETHERLANDS', 84, 625, t, 0.8, { size: 24, color: '#FFC2BE' });
    if (t > 3.6) chip(`+ ${m} DUTCH PIECES INSIDE THOSE`, 80, 1260 - 40, t, 3.6, { size: 30, align: 'left', bg: NLC, fg: BG }); }; };
VIS[2] = (K) => { K(0.6, 'scratch'); K(0.62, 'thump', 1); K(1.8, 'pop', 0.9, 600); K(2.3, 'pop', 0.9, 800);
  return (t) => { bg(t, [[0, BL[0], BL[1], 0.012, 40, -10], [0.1, BL[0], BL[1], 0.008, 50, 15]], 0.45); tag(t, 2, 4);
    inset(t, -1, 'LOVEREN STREET, BAARLE', (w, h) => { const sky = g.createLinearGradient(0, 0, 0, h); sky.addColorStop(0, '#1A2638'); sky.addColorStop(1, '#3C4E66'); g.fillStyle = sky; g.fillRect(0, 0, w, h);
      g.fillStyle = 'rgba(255,127,30,0.25)'; g.fillRect(0, 0, w / 2, h); g.fillStyle = 'rgba(232,68,58,0.25)'; g.fillRect(w / 2, 0, w / 2, h); g.fillStyle = '#4A4A46'; g.fillRect(0, h - 70, w, 70);
      g.save(); g.translate(w / 2 - 270, 120); g.fillStyle = '#8C4A32'; g.fillRect(0, 90, 540, 300); g.fillStyle = '#2B2A28'; g.beginPath(); g.moveTo(-24, 96); g.lineTo(270, -40); g.lineTo(564, 96); g.fill();
      g.fillStyle = '#E8D9A8'; g.fillRect(50, 150, 100, 90); g.fillRect(390, 150, 100, 90); g.fillStyle = '#1F3A5A'; g.fillRect(215, 200, 110, 190); g.restore();
      const p = ease((t - 0.5) / 0.6); g.save(); g.strokeStyle = '#FFFFFF'; g.lineWidth = 6; g.setLineDash([18, 12]); g.beginPath(); g.moveTo(w / 2, h); g.lineTo(w / 2, h - h * p); g.stroke(); g.restore();
      if (p > 0.9) { mapLabel('NL', w / 2 - 110, h - 22, '#FFD0A0', 30); mapLabel('BE', w / 2 + 30, h - 22, '#FFC2BE', 30); }
      const plate = (x, s, a, b, col) => { if (s <= 0) return; g.save(); g.translate(x, 170); g.scale(s, s); g.fillStyle = col; rrect(-110, -36, 220, 72, 12); g.fill(); text(a, 0, -4, 'ui', 26, BG, { align: 'center' }); text(b, 0, 22, 'mono', 16, BG, { align: 'center' }); g.restore(); };
      plate(w / 2 - 260, spring(t - 1.8, 260, 16), 'LOVEREN 19', 'BAARLE-NASSAU', NLC); plate(w / 2 + 260, spring(t - 2.3, 260, 16), 'LOVEREN 2', 'BAARLE-HERTOG', '#FF8A80'); });
    rgbPop('2 ADDRESSES', 80, 540, fit('2 ADDRESSES', 'disp', 140, 920), TXT, t, 1.8); label('ONE FRONT DOOR', 84, 605, t, 2.0, { color: GOLD }); }; };
VIS[3] = (K) => { K(0.6, 'tick', 0.8); K(1.8, 'beep', 0.8); K(2.6, 'swish', 0.8); K(3.6, 'land', 0.8);
  const G = [[200, 200], [250, 330], [160, 350], [300, 170]];
  return (t) => { bg(t, [[0, BL[0], BL[1], 0.008, 50, 15], [0.1, BL[0], BL[1], 0.014, 40, -15]], 0.45); tag(t, 3, 4);
    inset(t, -1, 'A CAFÉ ON THE BORDER · SEEN FROM ABOVE', (w, h) => { g.fillStyle = '#3A2A1C'; g.fillRect(0, 0, w, h); g.fillStyle = 'rgba(255,127,30,0.22)'; g.fillRect(0, 0, w / 2, h); g.fillStyle = 'rgba(232,68,58,0.22)'; g.fillRect(w / 2, 0, w / 2, h);
      g.strokeStyle = 'rgba(0,0,0,0.25)'; g.lineWidth = 2; for (let x = 0; x < w; x += 60) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, h); g.stroke(); }
      g.save(); g.strokeStyle = '#FFFFFF'; g.lineWidth = 6; g.setLineDash([18, 12]); g.beginPath(); g.moveTo(w / 2, 0); g.lineTo(w / 2, h); g.stroke(); g.restore();
      const table = (x, y) => { g.fillStyle = '#6E5236'; g.beginPath(); g.arc(x, y, 60, 0, 6.283); g.fill(); g.strokeStyle = '#2A1C10'; g.lineWidth = 4; g.stroke(); }; table(240, 270); table(w - 240, 270);
      const mv = ease((t - 2.6) / 1.0); G.forEach(([x, y], i) => { const xx = lerp(x, x + (w - 480), mv) + Math.sin(t * 3 + i) * 3 + (t > 4.5 ? Math.sin(t * 7 + i * 1.7) * 8 : 0); g.fillStyle = ['#E8D9A8', '#C9A884', '#EDE6D8', '#B0C8FF'][i]; g.beginPath(); g.arc(xx, y, 26, 0, 6.283); g.fill(); g.strokeStyle = 'rgba(0,0,0,0.5)'; g.lineWidth = 3; g.stroke(); });
      mapLabel('NETHERLANDS', 30, h - 24, '#FFD0A0', 26); mapLabel('BELGIUM', w - 180, h - 24, '#FFC2BE', 26); clockFace(w - 90, 90, 60, 0, ramp(t, 0.3, 1.5, 50, 60), {}); });
    if (t > 1.8) chip('NL: CLOSING TIME', 80, 470, t, 1.8, { size: 32, align: 'left', bg: NLC, fg: BG }); if (t > 3.6) chip('BE: STILL OPEN', 80, 570, t, 3.6, { size: 32, align: 'left', bg: '#FF8A80', fg: BG }); }; };
