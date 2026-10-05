// Wiki Roulette #100 — Zidane's headbutt, 2006 World Cup final (figures style, Football's Craziest Moments #2)
// Hook technique: "wait, what did he just do?!" — frame 1 is the headbutt itself; the video then explains how it came to that.
const N = 5, GOLDC = '#F2C230';
const ZZ = { shirt: '#F4F4F4', pants: '#F4F4F4', hat: 'none', skin: '#E2B48C', seed: 7 };                 // France in white
const MAT = { shirt: '#1F5FBF', pants: '#FFFFFF', hat: 'hair', hair: '#2A1A10', beard: '#2A1A10', seed: 8 }; // Italy in blue
const REF = { shirt: '#1E1E1E', pants: '#1E1E1E', hat: 'hair', hair: '#2A1A10', seed: 9 };
function board(t, tIn, x, y, o) {
  const lt = t - tIn; if (lt < 0) return; const s = spring(lt, 260, 16), w = 900, h = 220;
  g.save(); g.translate(x, y + (1 - s) * -200); g.globalAlpha *= clamp(s * 1.5);
  g.shadowColor = 'rgba(0,0,0,0.6)'; g.shadowBlur = 30; rrect(-w / 2, 0, w, h, 26); g.fillStyle = '#0E0F12'; g.fill(); g.shadowBlur = 0;
  g.lineWidth = 6; g.strokeStyle = '#2E3138'; g.stroke();
  const clk = typeof o.clock === 'function' ? o.clock(t) : o.clock;
  rrect(-170, -34, 340, 76, 18); g.fillStyle = o.clockCol || '#FF3B30'; g.fill(); text(clk, 0, 22, 'mono', 52, '#FFFFFF', { align: 'center' });
  const fl = o.hitAt != null && t > o.hitAt && t < o.hitAt + 0.9 ? (Math.floor((t - o.hitAt) * 8) % 2) : 0;
  text('FRANCE', -400, 150, 'ui', 50, '#E6E8EC'); text('ITALY', 400, 150, 'ui', 50, '#5A9BFF', { align: 'right' });
  const sc = typeof o.score === 'function' ? o.score(t) : o.score;
  text(`${sc[0]}–${sc[1]}`, 0, 168, 'disp', 104, fl ? GOLDC : '#FFFFFF', { align: 'center' }); g.restore(); }
const clk = (m0, s0, rate = 1) => (t) => { const tot = Math.floor(m0 * 60 + s0 + Math.max(0, t) * rate); return `${Math.floor(tot / 60)}:${String(tot % 60).padStart(2, '0')}`; };
function ballAt(x, y, r, rot) { g.save(); g.translate(x, y); g.rotate(rot); g.fillStyle = '#FFFFFF'; g.beginPath(); g.arc(0, 0, r, 0, 6.283); g.fill(); g.lineWidth = 5; g.strokeStyle = INK; g.stroke();
  g.fillStyle = INK; for (let k = 0; k < 5; k++) { const a = k * 1.2566; g.beginPath(); g.arc(Math.cos(a) * r * 0.6, Math.sin(a) * r * 0.6, r * 0.2, 0, 6.283); g.fill(); } g.beginPath(); g.arc(0, 0, r * 0.24, 0, 6.283); g.fill(); g.restore(); }
// chip penalty: the ball floats up, kisses the underside of the bar, drops in
function chipGoal(t, tAt, x, y) {
  g.save(); g.translate(x, y); g.lineWidth = 12; g.strokeStyle = '#FFFFFF'; g.strokeRect(-170, -190, 340, 190); g.lineWidth = 2; g.strokeStyle = 'rgba(255,255,255,0.5)';
  for (let i = -160; i <= 160; i += 25) { g.beginPath(); g.moveTo(i, -180); g.lineTo(i, -6); g.stroke(); } for (let j = -170; j <= -10; j += 25) { g.beginPath(); g.moveTo(-160, j); g.lineTo(160, j); g.stroke(); } g.restore();
  if (t < tAt - 0.2) { ballAt(x - 430, y - 30, 30, 0); return; }
  const p = clamp((t - tAt) / 0.7), bx = lerp(x - 430, x - 10, p), by = p < 0.75 ? lerp(y - 30, y - 186, Math.sin(p / 0.75 * Math.PI / 2)) : lerp(y - 186, y - 40, (p - 0.75) / 0.25);
  ballAt(bx, by, 30, t * 6); }
// a big red card raised over the referee's head
function redCard(t, tIn, x, y) { const lt = t - tIn; if (lt < 0) return; const s = spring(lt, 320, 14);
  g.save(); g.translate(x, y - (1 - s) * 200); g.rotate(-0.15 + Math.sin(lt * 8) * 0.03 * (lt < 1)); g.scale(s, s);
  g.shadowColor = 'rgba(0,0,0,0.5)'; g.shadowBlur = 24; rrect(-70, -100, 140, 200, 14); g.fillStyle = '#E3101E'; g.fill(); g.shadowBlur = 0; g.lineWidth = 8; g.strokeStyle = '#FFFFFF'; g.stroke(); g.restore(); }
function goldBall(t, tIn, x, y, r) { const lt = t - tIn; if (lt < 0) return; const s = spring(lt, 300, 14); g.save(); g.translate(x, y); g.scale(s, s);
  g.shadowColor = 'rgba(255,200,40,0.8)'; g.shadowBlur = 40; ballAt(0, 0, r, t * 2); g.restore();
  g.save(); g.globalCompositeOperation = 'multiply'; g.fillStyle = GOLDC; g.beginPath(); g.arc(x, y, r * s, 0, 6.283); g.fill(); g.restore(); }
// the headbutt: Zidane lunges at tHit, Materazzi falls backwards
const zzAt = (t, tHit, o = {}) => A(ZZ, Object.assign({ face: t > tHit - 0.2 ? 'angry' : 'talk', tilt: t > tHit - 0.12 ? 0.42 * Math.exp(-Math.max(0, t - tHit - 0.25) * 2) + 0.06 : 0, armL: 'down', armR: 'down' }, o));
const matAt = (t, tHit, o = {}) => A(MAT, Object.assign({ face: t > tHit ? 'shock' : 'smug', flip: true, tilt: t > tHit ? Math.min(1.45, (t - tHit) * 4) : 0, armL: t > tHit ? 'up' : 'out' }, o));

VIS.open = fscene(null, N, { bg: 'match', a: [0.5, 0.5, 1.15], b: [0.5, 0.5, 1.3], dim: 0.45, hook: true, k: [[0.02, 'boom', 1.2], [0.03, 'hit', 1.4], [0.4, 'thump', 1]],
  x: (t) => { g.save(); g.translate(shake(t, 0.1, 18), 0);
    fig(t, -1, 380, 1420, 0.72 * FIGSCALE, zzAt(t, -0.12, { face: 'angry' })); fig(t, -1, 700, 1420, 0.72 * FIGSCALE, matAt(t, -0.12));
    burst(t, -0.2, 820, 880, 120, 'WHAT?!', '#FF5A50'); g.restore(); flash(t, 0.0, 0.5, 0.12); lot(t, 0.4, 'scream', 230, 950, 160); } });

VIS[0] = fscene(0, N, { bg: 'zz', a: [0.55, 0.4, 1.0], b: [0.55, 0.4, 1.12], dim: 0.45, badge: 'REAL PHOTO · ZIDANE IN THE FINAL, 9 JULY 2006', k: [[0.9, 'swish', 0.8], [1.3, 'land', 0.9], [1.55, 'hit', 1.1]],
  figs: [[0.1, 230, 1150, 0.58, (t) => A(ZZ, { face: t > 1.55 ? 'smug' : 'talk', armR: t > 1.55 ? 'fist' : 'down' })]],
  x: (t) => { board(t, 0.1, 540, 560, { clock: "7'", score: (t) => [t > 1.55 ? 1 : 0, 0], hitAt: 1.55 }); chipGoal(t, 0.8, 760, 1150);
    if (t > 1.55) burst(t, 1.55, 760, 880, 90, 'CHIP!', GOLDC); } });

VIS[1] = fscene(1, N, { bg: 'ball', a: [0.5, 0.5, 1.0], b: [0.5, 0.5, 1.15], dim: 0.4, badge: 'REAL PHOTO · THE MATCH BALL OF THE FINAL', k: [[0.6, 'hit', 0.9], [1.4, 'riser', 0.5, 1.4]],
  figs: [[0.1, 260, 1150, 0.58, A(ZZ, { face: 'talk' })], [0.2, 820, 1150, 0.58, A(MAT, { face: 'smug', flip: true })]],
  x: (t) => { board(t, 0.1, 540, 560, { clock: (t) => t < 1.4 ? 'EXTRA TIME' : clk(108, 52, 4)(t - 1.4), score: [1, 1] }); lot(t, 1.4, 'eyes', 540, 960, 150); } });

VIS[2] = fscene(2, N, { bg: 'match', a: [0.6, 0.5, 1.2], b: [0.6, 0.5, 1.35], dim: 0.5, badge: 'REAL PHOTO · ITALY VS FRANCE, BERLIN 2006', k: [[0.5, 'scratch', 0.8], [1.95, 'mute', 1, 0.5], [2.4, 'boom', 1.2], [2.42, 'hit', 1.4], [2.6, 'thump', 1]],
  bub: [[0.7, 700, 820, '@#$%!', { size: 60, tx: 760, ty: 940, out: 1.9 }]],
  x: (t) => { g.save(); g.translate(shake(t, 2.4, 18), 0);
    const turned = t > 1.6;
    fig(t, 0.1, 420, 1150, 0.62 * FIGSCALE, zzAt(t, 2.4, { flip: !turned, face: t < 1.6 ? 'sad' : 'angry' }));
    fig(t, 0.1, 650, 1150, 0.62 * FIGSCALE, matAt(t, 2.4, { armR: t < 1.6 ? 'point' : 'out' }));
    if (t > 2.4) burst(t, 2.4, 820, 820, 110, 'WHAT?!', '#FF5A50'); g.restore(); flash(t, 2.4, 0.5, 0.12); lot(t, 2.6, 'scream', 230, 860, 150); } });

VIS[3] = fscene(3, N, { bg: 'berlin', a: [0.5, 0.5, 1.0], b: [0.5, 0.5, 1.1], dim: 0.4, badge: 'REAL PHOTO · OLYMPIASTADION, BERLIN, WORLD CUP FINAL', k: [[0.5, 'beep', 0.8], [0.8, 'beep', 0.8], [1.3, 'stamp', 1.1], [1.32, 'hit', 1.1]],
  figs: [[0.1, 300, 1150, 0.6, (t) => A(REF, { face: t > 1.3 ? 'angry' : 'shock', armR: t > 1.3 ? 'up' : 'down', armL: 'down' })], [0.3, 820, 1150, 0.58, A(ZZ, { face: 'sad', flip: true })]],
  x: (t) => { redCard(t, 1.3, 300 + 100 * 0.6 * FIGSCALE, 1150 - 520 * 0.6 * FIGSCALE); if (t < 1.3) bubble(t, 0.45, 300, 760, 'HEADSET: "HE DID IT."', { size: 40, tx: 300, ty: 860 });
    lot(t, 1.4, 'siren', 820, 760, 150); chip("109' · ZIDANE · OFF", 540, 520, t, 1.3, { size: 34, bg: '#E3101E', fg: '#FFFFFF' }); } });

VIS[4] = fscene(4, N, { bg: 'rome', a: [0.5, 0.5, 1.0], b: [0.5, 0.5, 1.1], dim: 0.35, badge: 'REAL PHOTO · ITALY FANS CELEBRATE IN ROME', k: [[0.5, 'hit', 1], [1.3, 'ding', 0.9], [1.35, 'coin', 0.7]],
  figs: [[0.1, 250, 1150, 0.58, A(MAT, { face: 'happy', armL: 'up', armR: 'up' })], [0.3, 820, 1150, 0.58, A(ZZ, { face: 'sad', flip: true })]],
  x: (t) => { board(t, 0.1, 540, 520, { clock: 'PENALTIES', clockCol: '#2E7D32', score: ['3', '5'] }); lot(t, 0.5, 'trophy', 430, 930, 130);
    goldBall(t, 1.3, 600, 860, 55); chip('GOLDEN BALL', 600, 950, t, 1.4, { size: 26, bg: GOLDC, fg: '#111' }); } });
