// Wiki Roulette #059 — Hans Island: the Whisky War
const HI = [-66.46, 80.83], CAR = '#E8443A', GLC = '#4D8BFF';
const ISLE = (() => { const b = [[-0.42, -0.1], [-0.3, -0.34], [-0.05, -0.42], [0.22, -0.36], [0.4, -0.18], [0.44, 0.06], [0.33, 0.3], [0.08, 0.4], [-0.18, 0.36], [-0.36, 0.2]], r = rng(7), o = [];
  b.forEach((p, i) => { const q = b[(i + 1) % b.length]; for (let k = 0; k < 5; k++) { const u = k / 5, j = 0.025 * (r() - 0.5); o.push([lerp(p[0], q[0], u) * (1 + j * 4), lerp(p[1], q[1], u) * (1 + j * 4)]); } }); return o; })();
function bg(t, keys, dim = 0.35) { earth(t, camPath(t, keys, { k: 3, d: 3.4 })); territory('Canada', CAR, 0.5, { stroke: '#FFC2BE', glow: 8 }); territory('Greenland', GLC, 0.45, { stroke: '#DDE8FF', glow: 8 });
  if (dim) { g.fillStyle = `rgba(2,6,14,${dim})`; g.fillRect(0, 0, W, H); } }
// top-down island map inside an inset; split = 0..1 shows the 2022 border
function isle(w, h, t, o = {}) { waterBG(w, h, t, '#16405F'); const cx = w / 2, cy = h / 2 + 20, S = 520;
  const path = new Path2D(); ISLE.forEach(([x, y], i) => i ? path.lineTo(cx + x * S, cy + y * S) : path.moveTo(cx + x * S, cy + y * S)); path.closePath();
  g.fillStyle = 'rgba(235,245,250,0.85)'; g.lineWidth = 26; g.strokeStyle = 'rgba(235,245,250,0.35)'; g.stroke(path); g.fillStyle = '#6E6A63'; g.fill(path);
  const r = rng(59); g.save(); g.clip(path); for (let i = 0; i < 50; i++) { g.fillStyle = `rgba(${90 + r() * 60 | 0},${86 + r() * 50 | 0},${80 + r() * 40 | 0},0.6)`; g.beginPath(); g.arc(cx + (r() - 0.5) * S, cy + (r() - 0.5) * S * 0.8, 10 + r() * 30, 0, 6.283); g.fill(); }
  if (o.own) { g.fillStyle = o.own === 'CA' ? 'rgba(232,68,58,0.55)' : 'rgba(77,139,255,0.55)'; g.fill(path); }
  if (o.split > 0) { const rift = new Path2D(); rift.moveTo(cx + 0.02 * S, cy - 0.45 * S); rift.quadraticCurveTo(cx - 0.16 * S, cy, cx + 0.02 * S, cy + 0.45 * S);
    g.globalAlpha = o.split; g.fillStyle = 'rgba(232,68,58,0.6)'; g.beginPath(); g.rect(0, 0, cx - 0.2 * S, h); g.fill(); g.save(); g.beginPath(); g.moveTo(0, 0); g.lineTo(cx + 0.02 * S, 0); g.lineTo(cx + 0.02 * S, cy - 0.45 * S); g.quadraticCurveTo(cx - 0.16 * S, cy, cx + 0.02 * S, cy + 0.45 * S); g.lineTo(cx + 0.02 * S, h); g.lineTo(0, h); g.closePath(); g.clip(); g.fillStyle = 'rgba(232,68,58,0.6)'; g.fill(path); g.restore();
    g.save(); g.beginPath(); g.moveTo(w, 0); g.lineTo(cx + 0.02 * S, 0); g.lineTo(cx + 0.02 * S, cy - 0.45 * S); g.quadraticCurveTo(cx - 0.16 * S, cy, cx + 0.02 * S, cy + 0.45 * S); g.lineTo(cx + 0.02 * S, h); g.lineTo(w, h); g.closePath(); g.clip(); g.fillStyle = 'rgba(77,139,255,0.6)'; g.fill(path); g.restore();
    g.strokeStyle = GOLD; g.lineWidth = 6; g.setLineDash([16, 10]); g.stroke(rift); g.setLineDash([]); g.globalAlpha = 1; }
  g.restore(); g.strokeStyle = 'rgba(255,255,255,0.6)'; g.lineWidth = 3; g.stroke(path); return [cx, cy, S]; }
function pole(x, y, code, t, s = 1, w = 120) { if (s <= 0.01) return; g.strokeStyle = '#EDE6D8'; g.lineWidth = 5; g.beginPath(); g.moveTo(x, y); g.lineTo(x, y - 150 * s); g.stroke(); flag(code, x + w * s / 2, y - 150 * s + w * s * 0.3, w * s, t); }
VIS.open = (K) => { K(0.2, 'whoosh', 0.9); K(1.6, 'pop', 0.8, 500); K(2.2, 'pop', 0.8, 800);
  return (t) => { earth(t, camPath(t, [[0, -40, 50, 2.8, 0, 0], [0.15, HI[0], HI[1], 0.08, 40, 0]], { k: 10, d: 6.4 }));
    territory('Canada', CAR, 0.5, { stroke: '#FFC2BE' }); territory('Greenland', GLC, 0.45, { stroke: '#DDE8FF' }); const [x, y] = MAP.P(...HI); shockRing(x, y, t % 1 + 1, 1, 140, '255,194,61', 2);
    bottle(330, 1330, 1.7 * spring(t - 1.6, 260, 14), '#B8742A', 'WHISKY', { rot: -0.2 }); bottle(750, 1330, 1.7 * spring(t - 2.2, 260, 14), '#7FA8C9', 'SCHNAPPS', { rot: 0.2 });
    tag(t); hook(t, EP.hook, 480); }; };
VIS[0] = (K) => { K(0.6, 'land', 0.8); K(1.8, 'pop', 0.8, 700); K(2.6, 'pop', 0.8, 500); K(3.4, 'whoosh', 0.6);
  return (t) => { bg(t, [[0, HI[0], HI[1], 0.08, 40, 0], [0.1, HI[0], HI[1], 0.05, 48, 10]], 0);
    place(...HI, 'HANS ISLAND', t, 0.6, { color: GOLD, size: 40 }); const [x, y] = MAP.P(...HI); if (t > 0.6) shockRing(x, y, t % 1.2 + 0.6, 0.6, 120, '255,194,61', 2);
    place(-70, 80.4, 'CANADA', t, 1.8, { color: '#FFC2BE', size: 40, left: true }); place(-62, 81.2, 'GREENLAND', t, 2.6, { color: '#DDE8FF', size: 40 });
    inset(t, 3.4, '1.3 KM² OF BARE ROCK', (w, h) => isle(w, h, t), { y: 680, h: 420, x: 140, w: 800 });
    tag(t, 0, 5); rgbPop('NARES STRAIT', 80, 560, fit('NARES STRAIT', 'disp', 140, 920), TXT, t, 0.45); }; };
VIS[1] = (K) => { K(0.45, 'hit', 0.9); K(1.4, 'thump', 1); K(2.8, 'pop', 1, 700);
  return (t) => { bg(t, [[0, HI[0], HI[1], 0.05, 48, 10], [0.1, HI[0], HI[1], 0.06, 40, -10]]); tag(t, 1, 5); yearTag(1984, t, 0.45, { color: '#FF8A80' }); label('CANADA WAS HERE', 84, 625, t, 1.2, { color: GOLD });
    inset(t, -1, 'HANS ISLAND', (w, h) => { const [cx, cy] = isle(w, h, t, { own: t > 1.4 ? 'CA' : null }); pole(cx - 40, cy + 20, 'CA', t, spring(t - 1.4, 260, 16)); bottle(cx + 150, cy + 30, 1.1 * spring(t - 2.8, 260, 14), '#B8742A', 'WHISKY'); }); }; };
VIS[2] = (K) => { K(0.45, 'swish', 0.8); K(0.9, 'thump', 1); K(2.4, 'pop', 1, 900);
  return (t) => { bg(t, [[0, HI[0], HI[1], 0.06, 40, -10], [0.1, HI[0], HI[1], 0.05, 46, 12]]); tag(t, 2, 5); rgbPop('DENMARK', 80, 540, 150, '#9CC0FF', t, 0.9); label('A MINISTER REPLIES', 84, 605, t, 1.2, { color: GOLD });
    const sw = clamp((t - 0.6) / 0.5); inset(t, -1, 'HANS ISLAND', (w, h) => { const [cx, cy] = isle(w, h, t, { own: sw < 0.5 ? 'CA' : 'DK' }); pole(cx - 40, cy + 20, sw < 0.5 ? 'CA' : 'DK', t, Math.abs(1 - 2 * sw));
      bottle(cx + 150, cy + 30, 1.1 * (1 - clamp((t - 0.6) * 3)), '#B8742A', 'WHISKY'); bottle(cx + 150, cy + 30, 1.1 * spring(t - 2.4, 260, 14), '#7FA8C9', 'SCHNAPPS'); }); }; };
VIS[3] = (K) => { for (let i = 0; i < 8; i++) K(0.5 + i * 0.42, 'swish', 0.5);
  return (t) => { bg(t, [[0, HI[0], HI[1], 0.05, 46, 12], [0.1, HI[0], HI[1], 0.07, 38, -12]]); const k = Math.floor(Math.max(0, t - 0.5) / 0.42), ph = (Math.max(0, t - 0.5) % 0.42) / 0.42, dk = k % 2 === 1;
    inset(t, -1, 'HANS ISLAND', (w, h) => { const [cx, cy] = isle(w, h, t, { own: dk ? 'DK' : 'CA' }); pole(cx - 40, cy + 20, dk ? 'DK' : 'CA', t, t < 0.5 ? 1 : Math.abs(Math.cos(ph * Math.PI)) * 0.8 + 0.2);
      bottle(cx + 150, cy + 30, 1.1, dk ? '#7FA8C9' : '#B8742A', dk ? 'SCHNAPPS' : 'WHISKY', { rot: Math.sin(t * 8) * 0.1 }); });
    tag(t, 3, 5); const y = Math.round(ramp(t, 0.5, 3.2, 1984, 2021)); yearTag(y, t, 0.45); label('FLAGS + BOTTLES, BACK AND FORTH', 84, 625, t, 0.6, { color: GOLD }); }; };
VIS[4] = (K) => { K(0.45, 'hit', 1); K(1.0, 'scratch'); K(1.02, 'thump', 1); K(4.4, 'pop', 0.8, 600);
  return (t) => { bg(t, [[0, HI[0], HI[1], 0.07, 38, -12], [0.1, HI[0], HI[1], 0.05, 48, 25]], 0.3); tag(t, 4, 5); yearTag(2022, t, 0.45); label('SPLIT ALONG A NATURAL RIFT', 84, 625, t, 1.0, { color: GOLD });
    inset(t, -1, '1,280 M LAND BORDER', (w, h) => { const [cx, cy, S] = isle(w, h, t, { split: clamp((t - 1.0) * 2) }); pole(cx - 0.22 * S, cy, 'CA', t, spring(t - 1.4, 260, 16), 110); pole(cx + 0.24 * S, cy - 10, 'DK', t, spring(t - 1.7, 260, 16), 110);
      if (t > 4.4) { const p = 1 + 0.08 * Math.sin(t * 6); mapLabel('CANADA', cx - 0.36 * S, cy + 0.3 * S * p, '#FFC2BE', 28); mapLabel('GREENLAND', cx + 0.1 * S, cy + 0.3 * S * p, '#DDE8FF', 28); } });
    if (t > 2.4 && !photoCard(t, 'lead', 640, 340, 330, 230, 99, 'HANS ISLAND')) {} }; };
