// Wiki Roulette #078 — Turritopsis dohrnii, the jellyfish that ages backwards (figures style, Bizarre Nature #1)
const N = 6, SCI = A(CAST.sci, { seed: 1 }), DIVER = A(CAST.man, { shirt: '#1F2A44', pants: '#1F2A44', hat: 'beanie', hatCol: '#F28C28', glasses: true, seed: 2 });
// cartoon jellyfish character: sticker look like the cast. age: 'adult' | 'old' | 'baby' | 'polyp'
function jelly(t, tIn, x, y, s, o = {}) {
  const lt = t - tIn; if (lt < 0) return; const sp = spring(lt, 240, 15), bob = Math.sin(t * 2.4 + (o.seed || 0)) * 14, pulse = 1 + 0.06 * Math.sin(t * 4);
  const age = o.age || 'adult', col = o.col || '#FF7FA8', sc = s * sp * (age === 'baby' ? 0.6 : 1);
  g.save(); g.translate(x, y + bob); g.scale(sc, sc);
  for (const pass of [1, 0]) {                                   // 1 = white sticker outline, 0 = colour
    g.lineCap = 'round'; g.lineJoin = 'round';
    if (age === 'polyp') {                                       // stalk + little head with tentacles (the "baby" stage)
      g.lineWidth = pass ? 46 : 24; g.strokeStyle = pass ? '#FFF' : '#E8C7A0'; g.beginPath(); g.moveTo(0, 160); g.quadraticCurveTo(-20, 60, 0, -10); g.stroke();
      for (let k = -3; k <= 3; k++) { g.lineWidth = pass ? 26 : 10; g.strokeStyle = pass ? '#FFF' : col; g.beginPath(); g.moveTo(0, -30); g.quadraticCurveTo(k * 22, -90, k * 34, -120 + Math.sin(t * 5 + k) * 8); g.stroke(); }
      g.beginPath(); g.ellipse(0, -30, 46, 36, 0, 0, 6.283); g.fillStyle = pass ? '#FFF' : col; if (pass) { g.lineWidth = 24; g.strokeStyle = '#FFF'; g.stroke(); } g.fill();
      if (!pass) { g.lineWidth = 5; g.strokeStyle = INK; g.stroke(); }
    } else {
      for (let k = -4; k <= 4; k++) { const wv = Math.sin(t * 4 + k * 0.8) * 16; g.lineWidth = pass ? 26 : 9; g.strokeStyle = pass ? '#FFF' : col;
        g.beginPath(); g.moveTo(k * 26, 40); g.bezierCurveTo(k * 30 + wv, 120, k * 26 - wv, 190, k * 30 + wv * 0.6, 260); g.stroke(); }
      g.save(); g.scale(pulse, 2 - pulse); g.beginPath(); g.moveTo(-150, 50); g.bezierCurveTo(-160, -170, 160, -170, 150, 50); g.quadraticCurveTo(0, 85, -150, 50); g.closePath();
      if (pass) { g.lineWidth = 28; g.strokeStyle = '#FFF'; g.stroke(); g.fillStyle = '#FFF'; g.fill(); }
      else { const gr = g.createLinearGradient(0, -130, 0, 60); gr.addColorStop(0, col); gr.addColorStop(1, '#FFC2D6'); g.fillStyle = gr; g.fill(); g.lineWidth = 6; g.strokeStyle = INK; g.stroke();
        g.fillStyle = 'rgba(255,255,255,0.45)'; g.beginPath(); g.ellipse(-70, -70, 34, 18, -0.5, 0, 6.283); g.fill(); }
      g.restore();
    }
  }
  // face
  const fy = age === 'polyp' ? -30 : -20, sm = age === 'polyp' ? 0.45 : 1, f = o.face || 'happy';
  g.save(); g.translate(0, fy); g.scale(sm, sm);
  for (const sx of [-1, 1]) { const blink = Math.sin(t * 1.6 + sx) > 0.985;
    if (blink) { g.strokeStyle = INK; g.lineWidth = 6; g.beginPath(); g.moveTo(sx * 45 - 16, -10); g.lineTo(sx * 45 + 16, -10); g.stroke(); continue; }
    g.fillStyle = '#FFF'; g.strokeStyle = INK; g.lineWidth = 5; g.beginPath(); g.ellipse(sx * 45, -12, f === 'shock' ? 24 : 19, f === 'shock' ? 28 : 23, 0, 0, 6.283); g.fill(); g.stroke();
    g.fillStyle = INK; g.beginPath(); g.arc(sx * 45, -10, f === 'shock' ? 7 : 10, 0, 6.283); g.fill(); }
  g.strokeStyle = INK; g.fillStyle = INK; g.lineWidth = 6;
  if (f === 'shock') { g.beginPath(); g.ellipse(0, 30, 16, 22, 0, 0, 6.283); g.fill(); }
  else if (f === 'sad' || f === 'tired') { g.beginPath(); g.moveTo(-22, 36); g.quadraticCurveTo(0, 20, 22, 36); g.stroke(); }
  else { g.beginPath(); g.moveTo(-26, 22); g.quadraticCurveTo(0, 50, 26, 22); g.closePath(); g.fill(); }
  g.restore();
  if (age === 'old') { g.strokeStyle = INK; g.lineWidth = 6; for (const sx of [-1, 1]) { g.beginPath(); g.arc(sx * 45, -32, 30, 0, 6.283); g.stroke(); } g.beginPath(); g.moveTo(-15, -32); g.lineTo(15, -32); g.stroke();
    g.fillStyle = '#DDD'; for (const sx of [-1, 1]) { g.beginPath(); g.ellipse(sx * 45, -78, 26, 8, 0, 0, 6.283); g.fill(); } }   // glasses + grey brows
  if (age === 'baby') { g.fillStyle = '#7CC8FF'; g.beginPath(); g.arc(0, 40, 14, 0, 6.283); g.fill(); g.strokeStyle = INK; g.lineWidth = 4; g.stroke(); }  // pacifier
  if (o.bandage) { g.save(); g.rotate(-0.4); g.fillStyle = '#F4D9B0'; g.strokeStyle = INK; g.lineWidth = 4; rrect(60, -120, 90, 30, 10); g.fill(); g.stroke(); g.restore(); }
  g.restore();
}
const bubbles2 = (t) => { const r = rng(78); g.fillStyle = 'rgba(255,255,255,0.35)'; for (let i = 0; i < 26; i++) { const x = r() * W, y = H - ((t * (40 + r() * 60) + r() * H) % H); g.beginPath(); g.arc(x, y, 4 + r() * 8, 0, 6.283); g.fill(); } };
// a "rewind" ring: clock-style arrow spinning backwards
function rewind(t, tIn, x, y, r) { const lt = t - tIn; if (lt < 0) return; const s = spring(lt, 260, 16), a = -lt * 6;
  g.save(); g.translate(x, y); g.scale(s, s); g.strokeStyle = GOLD; g.lineWidth = 14; g.lineCap = 'round'; g.beginPath(); g.arc(0, 0, r, a, a + 4.6); g.stroke();
  const ex = Math.cos(a) * r, ey = Math.sin(a) * r; g.fillStyle = GOLD; g.beginPath(); g.moveTo(ex - 28, ey); g.lineTo(ex + 28, ey); g.lineTo(ex, ey + 34); g.closePath(); g.fill(); g.restore(); }

VIS.open = fscene(null, N, { bg: 'jelly', a: [0.5, 0.5, 1.0], b: [0.5, 0.5, 1.1], dim: 0.15, hook: true, k: [[0.15, 'hit', 1.3], [0.6, 'riser', 0.5, 1]],
  pre: (t) => bubbles2(t), x: (t) => { jelly(t, -0.3, 300, 1000, 0.95, { age: 'old', face: 'tired', seed: 1 }); rewind(t, 0.5, 560, 980, 70); jelly(t, 0.9, 820, 1040, 0.95, { age: 'baby', face: 'happy', seed: 2 }); } });
VIS[0] = fscene(0, N, { bg: 'jelly', a: [0.5, 0.45, 1.1], b: [0.5, 0.45, 1.3], badge: 'REAL PHOTO · TURRITOPSIS (SAME GENUS)', k: [[0.9, 'pop', 0.9]],
  pre: (t) => bubbles2(t), figs: [[0.2, 820, 1250, 0.66, A(SCI, { face: 'wow', armL: 'hold', itemL: 'magnifier', flip: true })]],
  x: (t) => { jelly(t, 0.3, 330, 1040, 0.55, { face: 'happy' }); if (t > 0.9) { ruler(t, 0.9, 250, 1250, 160, '4.5 MM', {}); } }, f: ['TINY.', 'ABOUT 4.5 MM ACROSS'] });
VIS[1] = fscene(1, N, { bg: 'cycle', a: [0.5, 0.5, 1.0], b: [0.5, 0.45, 1.1], dim: 0.45, badge: 'REAL DRAWING · ITS LIFE CYCLE, 1888', k: [[1.0, 'hit', 1.1], [1.05, 'swish', 0.8]],
  pre: (t) => bubbles2(t), x: (t) => { if (t < 1.0) jelly(t, 0.1, 540, 1040, 0.85, { age: 'old', face: 'tired', bandage: true });
    else { flash(t, 1.0, 0.4, 0.1); jelly(t, 1.0, 540, 1080, 0.85, { age: 'polyp', face: 'happy' }); } rewind(t, 0.8, 850, 820, 60); },
  bst: [[1.0, 250, 790, 100, 'RESET!']], f: ['HURT? OLD?', 'IT TURNS BACK INTO A POLYP'] });
VIS[2] = fscene(2, N, { bg: 'polyps', a: [0.5, 0.5, 1.0], b: [0.5, 0.5, 1.1], dim: 0.25, badge: 'REAL PHOTO · A POLYP COLONY (RELATIVE)', k: [[0.6, 'pop', 0.8], [1.0, 'pop', 0.8]],
  pre: (t) => bubbles2(t), x: (t) => { jelly(t, 0.1, 260, 1120, 0.7, { age: 'polyp' }); jelly(t, 0.6, 540, 1060, 0.75, { age: 'baby' }); jelly(t, 1.0, 830, 1020, 0.7, { face: 'happy' }); }, f: ['GROWS UP', 'ALL OVER AGAIN', 0.3] });
VIS[3] = fscene(3, N, { bg: 'rubra', a: [0.5, 0.5, 1.0], b: [0.5, 0.5, 1.1], dim: 0.35, badge: 'REAL PHOTO · TURRITOPSIS RUBRA (RELATIVE)', k: [[0.7, 'tick', 0.8], [1.6, 'hit', 1.1]],
  figs: [[0.2, 820, 1250, 0.66, A(SCI, { face: 'shock', armL: 'up', armR: 'up', flip: true })]],
  x: (t) => { const n = Math.min(11, Math.floor(Math.max(0, t - 0.6) * 9)); if (t > 0.6) { panel(70, 700, 520, 330, 0.85); popNum(n + '×', 110, 880, 150, GOLD, t, 0.6); label('REBIRTHS IN 2 YEARS', 114, 960, t, 0.7, { size: 26 }); label('ONE LAB COLONY', 114, 1000, t, 0.9, { size: 22 }); } } ,
  f: ['ONE LAB:', '11 RESETS IN 2 YEARS'] });
VIS[4] = fscene(4, N, { bg: 'moon', a: [0.5, 0.5, 1.0], b: [0.5, 0.5, 1.1], dim: 0.3, chip: 'REAL PHOTO · MOON JELLIES (OTHER SPECIES)', k: [[0.8, 'riser', 0.4, 0.8], [1.3, 'hit', 1.2]],
  pre: (t) => bubbles2(t), x: (t) => { jelly(t, 0.1, 540, 1060, 0.95, { face: 'happy', col: '#FFC23D' }); }, bst: [[1.3, 820, 760, 110, '∞']], f: ['"IMMORTAL"', 'BIOLOGICALLY, AT LEAST'] });
VIS[5] = fscene(5, N, { bg: 'sea', a: [0.5, 0.5, 1.0], b: [0.5, 0.5, 1.1], dim: 0.2, badge: 'REAL PHOTO · UNDERWATER, LEMNOS', k: [[0.9, 'crack', 0.9], [0.92, 'hit', 1.1]],
  pre: (t) => bubbles2(t), figs: [[0.2, 820, 1250, 0.66, A(DIVER, { face: 'shock', flip: true })]],
  x: (t) => { const eaten = t > 0.9; if (!eaten) jelly(t, 0.1, 300, 1040, 0.6, { face: 'happy' }); else { jelly(t, 0.9, 300, 1060, 0.5, { face: 'shock' }); } },
  bst: [[0.9, 330, 790, 100, 'CHOMP!', '#FF6B4A']], f: ['IN THE WILD:', 'MOST STILL GET EATEN OR SICK'] });
