// Wiki Roulette #060 — Baarle: the border goes through front doors
const BL = [4.93, 51.44], NLC = '#FF7F1E', BEC = '#FDDA24';
const BLOBS = (() => { const r = rng(60), out = []; for (let i = 0; i < 22; i++) { const big = i < 3; out.push({ x: 140 + r() * 800, y: 760 + r() * 600, rx: big ? 120 + r() * 60 : 26 + r() * 40, ry: big ? 90 + r() * 50 : 22 + r() * 30, a: r() * 3, s: Math.floor(r() * 1000) }); }
  out.sort((a, b) => b.rx - a.rx); return out; })();
function blob(x, y, rx, ry, rot, seed, col, a = 1) { const r = rng(seed); g.save(); g.globalAlpha = a; g.fillStyle = col; g.beginPath();
  for (let i = 0; i < 12; i++) { const an = i / 12 * 6.283, k = 0.75 + 0.35 * r(); g.lineTo(x + Math.cos(an + rot) * rx * k, y + Math.sin(an + rot) * ry * k); } g.closePath(); g.fill();
  g.strokeStyle = 'rgba(255,255,255,0.7)'; g.lineWidth = 3; g.setLineDash([8, 6]); g.stroke(); g.setLineDash([]); g.restore(); }
function fields(t) { g.fillStyle = '#3A5A2E'; g.fillRect(0, 0, W, H); const r = rng(61); for (let i = 0; i < 70; i++) { g.fillStyle = `rgba(${60 + r() * 50 | 0},${90 + r() * 50 | 0},${40 + r() * 30 | 0},0.7)`; g.fillRect(r() * W, r() * H, 80 + r() * 200, 60 + r() * 160); }
  g.strokeStyle = 'rgba(230,220,200,0.35)'; g.lineWidth = 6; for (let i = 0; i < 6; i++) { g.beginPath(); g.moveTo(r() * W, 0); g.bezierCurveTo(r() * W, 600, r() * W, 1200, r() * W, H); g.stroke(); } }
function house(t, o = {}) { const sky = g.createLinearGradient(0, 0, 0, 1150); sky.addColorStop(0, '#0E1420'); sky.addColorStop(1, '#3C4E66'); g.fillStyle = sky; g.fillRect(0, 0, W, H); g.fillStyle = '#4A4A46'; g.fillRect(0, 1150, W, H - 1150);
  g.fillStyle = '#8C4A32'; g.fillRect(190, 700, 700, 450); g.strokeStyle = 'rgba(0,0,0,0.18)'; g.lineWidth = 2; for (let y = 715; y < 1150; y += 22) { g.beginPath(); g.moveTo(190, y); g.lineTo(890, y); g.stroke(); }
  g.fillStyle = '#2B2A28'; g.beginPath(); g.moveTo(160, 710); g.lineTo(540, 470); g.lineTo(920, 710); g.fill(); g.fillStyle = '#E8D9A8'; [[260, 790], [700, 790]].forEach(([x, y]) => g.fillRect(x, y, 120, 110));
  g.fillStyle = '#1F3A5A'; g.fillRect(470, 900, 140, 250); g.fillStyle = GOLD; g.beginPath(); g.arc(590, 1030, 7, 0, 6.283); g.fill(); }
VIS.open = (K) => { K(0.2, 'whoosh', 0.9); K(2.2, 'thump', 0.9);
  return (t) => { earth(t, camPath(t, [[0, 0, 40, 2.8, 0, 0], [0.15, BL[0], BL[1], 0.035, 45, 0]], { k: 10, d: 6.4 }));
    territory('Netherlands', NLC, 0.5, { stroke: NLC, glow: 8 }); territory('Belgium', BEC, 0.5, { stroke: BEC, glow: 8 }); const [x, y] = MAP.P(...BL); shockRing(x, y, t % 1 + 1, 1, 160, '255,255,255', 2);
    tag(t); hook(t, EP.hook, 480); }; };
VIS[0] = (K) => { K(0.6, 'land', 0.8); K(2.0, 'pop', 0.8, 600); K(2.5, 'pop', 0.8, 800);
  return (t) => { earth(t, camPath(t, [[0, BL[0], BL[1], 0.035, 45, 0], [0.1, BL[0], BL[1] - 0.02, 0.022, 50, 12]], { k: 3, d: 3.4 }));
    territory('Netherlands', NLC, 0.5, { stroke: NLC, glow: 8 }); territory('Belgium', BEC, 0.5, { stroke: BEC, glow: 8 }); place(...BL, 'BAARLE', t, 0.6, { color: TXT, size: 44 });
    tag(t, 0, 4); flag('NL', 300, 1460, 200, t, { s: spring(t - 2.0, 260, 16) }); flag('BE', 780, 1460, 200, t, { s: spring(t - 2.5, 260, 16) });
    rgbPop('BAARLE', 80, 560, 170, TXT, t, 0.45); label('NETHERLANDS + BELGIUM', 84, 625, t, 0.9, { color: GOLD }); }; };
VIS[1] = (K) => { for (let i = 0; i < 22; i++) K(0.5 + i * 0.07, 'pop', 0.35, 500 + i * 20); for (let i = 0; i < 7; i++) K(3.6 + i * 0.12, 'pop', 0.5, 900);
  const IN = [0, 0, 0, 0, 0, 0, 1];
  return (t) => { fields(t); g.fillStyle = 'rgba(255,127,30,0.35)'; g.fillRect(0, 0, W, H);
    const n = Math.min(22, Math.floor(clamp((t - 0.5) / 1.6) * 22 + 1e-6)); BLOBS.slice(0, n).forEach((b, i) => blob(b.x, b.y, b.rx * spring(t - 0.5 - i * 0.07, 300, 16), b.ry * spring(t - 0.5 - i * 0.07, 300, 16), b.a, b.s, BEC, 0.9));
    const m = Math.min(7, Math.floor(clamp((t - 3.6) / 0.9) * 7 + 1e-6)); for (let i = 0; i < m; i++) { const b = BLOBS[IN[i]], an = i * 0.9, d = i === 6 ? 0 : 0.45;
      blob(b.x + Math.cos(an) * b.rx * d, b.y + Math.sin(an) * b.ry * d, 22, 18, i, 99 + i, NLC, 1); }
    tag(t, 1, 4); rgbPop(`${n}`, 80, 560, 200, BEC, t, 0.5); label('PIECES OF BELGIUM', 84, 625, t, 0.8, { size: 34, color: BEC });
    if (t > 3.6) { rgbPop(`${m}`, 80, 770, 130, NLC, t, 3.6); label('DUTCH PIECES INSIDE THOSE', 84, 830, t, 3.7, { size: 30, color: NLC }); } }; };
VIS[2] = (K) => { K(0.6, 'scratch'); K(0.62, 'thump', 1); K(1.8, 'pop', 0.9, 600); K(2.3, 'pop', 0.9, 800);
  return (t) => { house(t); const p = ease((t - 0.5) / 0.6); g.save(); g.strokeStyle = '#FFFFFF'; g.lineWidth = 8; g.setLineDash([22, 14]); g.beginPath(); g.moveTo(540, 1700); g.lineTo(540, 1700 - 1250 * p); g.stroke(); g.restore();
    if (p > 0.9) { text('NL', 470, 1500, 'disp', 60, NLC, { align: 'right', shadow: true }); text('BE', 610, 1500, 'disp', 60, BEC, { shadow: true }); }
    const plate = (x, s, a, b, col) => { if (s <= 0) return; g.save(); g.translate(x, 860); g.scale(s, s); g.fillStyle = col; rrect(-120, -40, 240, 80, 12); g.fill(); text(a, 0, -4, 'ui', 28, BG, { align: 'center' }); text(b, 0, 26, 'mono', 18, BG, { align: 'center' }); g.restore(); };
    plate(330, spring(t - 1.8, 260, 16), 'LOVEREN 19', 'BAARLE-NASSAU', NLC); plate(750, spring(t - 2.3, 260, 16), 'LOVEREN 2', 'BAARLE-HERTOG', BEC);
    tag(t, 2, 4); rgbPop('2 ADDRESSES', 80, 540, fit('2 ADDRESSES', 'disp', 140, 920), TXT, t, 1.8); label('ONE FRONT DOOR', 84, 605, t, 2.0, { color: GOLD }); }; };
VIS[3] = (K) => { K(0.6, 'tick', 0.8); K(1.8, 'beep', 0.8); K(2.6, 'swish', 0.8); K(3.6, 'land', 0.8);
  return (t) => { const sky = g.createLinearGradient(0, 0, 0, H); sky.addColorStop(0, '#1A120C'); sky.addColorStop(1, '#3A2818'); g.fillStyle = sky; g.fillRect(0, 0, W, H);
    glowDot(540, 700, 600, '255,200,120', 0.18); g.fillStyle = '#5A3E26'; g.fillRect(0, 1100, W, H - 1100);
    g.save(); g.strokeStyle = '#FFFFFF'; g.lineWidth = 8; g.setLineDash([22, 14]); g.beginPath(); g.moveTo(540, 1100); g.lineTo(540, 1920); g.stroke(); g.restore();
    text('NETHERLANDS', 270, 1170, 'mono', 26, NLC, { align: 'center', ls: 3 }); text('BELGIUM', 810, 1170, 'mono', 26, BEC, { align: 'center', ls: 3 });
    const tbl = (x) => { g.fillStyle = '#2A1C10'; g.fillRect(x - 130, 1010, 260, 24); g.fillRect(x - 10, 1034, 20, 120); }; tbl(270); tbl(810);
    const mv = ease((t - 2.6) / 1.0); [-70, 0, 70].forEach((dx, i) => person(lerp(270, 810, mv) + dx, 1000, 2.6, ['#E8D9A8', '#C9A884', '#EDE6D8'][i]));
    clockFace(870, 600, 110, 0, ramp(t, 0.3, 1.5, 50, 60), {}); if (t > 1.8) chip('NL: CLOSED', 80, 470, t, 1.8, { size: 34, align: 'left', bg: NLC, fg: BG });
    if (t > 3.6) chip('BE: STILL OPEN', 80, 570, t, 3.6, { size: 34, align: 'left', bg: BEC, fg: BG }); tag(t, 3, 4); }; };
