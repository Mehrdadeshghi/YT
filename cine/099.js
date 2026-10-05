// Wiki Roulette #099 — 1999 Champions League final: Bayern had already won (figures style, Football's Craziest Moments #1)
// Hook technique: the first frame looks final/irreversible (90:00, 1–0, trophy with ribbons on its way) — the video resolves it.
const N = 5, GOLDC = '#F2C230';
const FCB = { shirt: '#8E959E', pants: '#2B2B2B', hat: 'hair', hair: '#3A2A1E' };          // Bayern wore their grey third kit in the final
const MUN = { shirt: '#D71920', pants: '#FFFFFF', hat: 'hair', hair: '#C98A3B' };          // United in red
const BOSS = A(CAST.official, { hat: 'grey', glasses: true, tie: '#1F3A93' });
// stadium scoreboard: clock + score, the changed digit flashes at o.hitAt
function board(t, tIn, x, y, o) {
  const lt = t - tIn; if (lt < 0) return; const s = spring(lt, 260, 16), w = 900, h = 220;
  g.save(); g.translate(x, y + (1 - s) * -200); g.globalAlpha *= clamp(s * 1.5);
  g.shadowColor = 'rgba(0,0,0,0.6)'; g.shadowBlur = 30; rrect(-w / 2, 0, w, h, 26); g.fillStyle = '#0E0F12'; g.fill(); g.shadowBlur = 0;
  g.lineWidth = 6; g.strokeStyle = '#2E3138'; g.stroke();
  const clk = typeof o.clock === 'function' ? o.clock(t) : o.clock;
  rrect(-150, -34, 300, 76, 18); g.fillStyle = o.clockCol || '#FF3B30'; g.fill();
  text(clk, 0, 22, 'mono', 52, '#FFFFFF', { align: 'center' });
  const fl = o.hitAt != null && t > o.hitAt && t < o.hitAt + 0.9 ? (Math.floor((t - o.hitAt) * 8) % 2) : 0;
  text('BAYERN', -400, 150, 'ui', 50, '#E6E8EC'); text('MAN UTD', 400, 150, 'ui', 50, '#FF5A50', { align: 'right' });
  const sc = typeof o.score === 'function' ? o.score(t) : o.score;
  text(`${sc[0]}–${sc[1]}`, 0, 168, 'disp', 104, fl ? GOLDC : '#FFFFFF', { align: 'center' });
  g.restore(); }
// cartoon European Cup with red + white ribbons
function cupBody(rib, t) {
  const p = new Path2D(); p.moveTo(-60, 0); p.lineTo(60, 0); p.lineTo(48, -36); p.lineTo(-48, -36); p.closePath(); sh(p, '#3A3F47');
  sh(rr(-18, -100, 36, 66, 10), '#D9DCE1');
  const b = new Path2D(); b.moveTo(-80, -270); b.lineTo(80, -270); b.quadraticCurveTo(84, -130, 0, -96); b.quadraticCurveTo(-84, -130, -80, -270); b.closePath(); sh(b, '#E3E6EB');
  for (const sx of [-1, 1]) { const h = new Path2D(); h.moveTo(sx * 74, -250); h.bezierCurveTo(sx * 190, -270, sx * 190, -120, sx * 52, -140);   // the big "ears"
    g.lineCap = 'round'; if (SK) { g.lineWidth = 44; g.strokeStyle = '#FFF'; g.stroke(h); } else { g.lineWidth = 30; g.strokeStyle = INK; g.stroke(h); g.lineWidth = 18; g.strokeStyle = '#E3E6EB'; g.stroke(h); } }
  if (SK) return;
  g.fillStyle = 'rgba(255,255,255,0.7)'; g.beginPath(); g.ellipse(-36, -210, 12, 40, 0.15, 0, 6.283); g.fill();
  if (rib) for (const [sx, col] of [[-1, '#C8102E'], [1, '#FFFFFF'], [-1, '#FFFFFF'], [1, '#C8102E']].slice(0, 4)) {
    const k = col === '#FFFFFF' ? 1 : 0, ox = sx * (150 + k * 14); g.strokeStyle = col; g.lineWidth = 16; g.lineCap = 'round'; g.beginPath(); g.moveTo(sx * 150, -200);
    g.bezierCurveTo(ox + Math.sin(t * 6 + k) * 20, -120, ox - sx * 20, -40, ox + Math.sin(t * 5 + k * 2) * 26, 30 + k * 30); g.stroke();
    g.strokeStyle = INK; g.lineWidth = 3; g.stroke(); }
}
function cup(t, tIn, x, y, s, o = {}) { const lt = t - tIn; if (lt < 0) return; const sp = spring(lt, 300, 14), sc = s * sp;
  g.save(); g.translate(x, y + Math.sin(t * 3) * 5); g.rotate((o.rot || 0) + (1 - Math.min(1, sp)) * 0.4); g.scale(sc, sc);
  g.save(); SK = 1; cupBody(o.rib, t); g.restore(); g.save(); SK = 0; cupBody(o.rib, t); g.restore(); g.restore(); }
// a goal: net on the right, the ball flies in at tAt, net bulges
function goal(t, tAt, x, y) {
  g.save(); g.translate(x, y); g.lineWidth = 12; g.strokeStyle = '#FFFFFF'; g.strokeRect(-160, -180, 320, 180);
  const bul = t > tAt + 0.25 ? Math.exp(-(t - tAt - 0.25) * 4) * 30 : 0; g.lineWidth = 2; g.strokeStyle = 'rgba(255,255,255,0.55)';
  for (let i = -150; i <= 150; i += 25) { g.beginPath(); g.moveTo(i, -170); g.quadraticCurveTo(i, -80 - bul * 1.5, i, -6); g.stroke(); }
  for (let j = -160; j <= -10; j += 25) { g.beginPath(); g.moveTo(-150, j); g.quadraticCurveTo(0, j - bul, 150, j); g.stroke(); }
  g.restore();
  const p = clamp((t - tAt) / 0.28); if (t < tAt - 0.3) return;
  const bx = lerp(x - 520, x - 20, ease(p)), by = lerp(y - 40, y - 110, p) - Math.sin(p * Math.PI) * 120;
  g.save(); g.translate(bx, by); g.rotate(t * 12); g.fillStyle = '#FFFFFF'; g.beginPath(); g.arc(0, 0, 34, 0, 6.283); g.fill(); g.lineWidth = 5; g.strokeStyle = INK; g.stroke();
  g.fillStyle = INK; for (let k = 0; k < 5; k++) { const a = k * 1.2566; g.beginPath(); g.arc(Math.cos(a) * 20, Math.sin(a) * 20, 7, 0, 6.283); g.fill(); } g.beginPath(); g.arc(0, 0, 8, 0, 6.283); g.fill(); g.restore(); }
const clk = (m0, s0, rate = 1) => (t) => { const tot = Math.floor(m0 * 60 + s0 + Math.max(0, t) * rate), m = Math.floor(tot / 60), s = tot % 60; return `${m}:${String(s).padStart(2, '0')}`; };

VIS.open = fscene(null, N, { bg: 'lineup', a: [0.5, 0.5, 1.15], b: [0.5, 0.5, 1.3], dim: 0.45, hook: true, k: [[0.15, 'hit', 1.3], [0.5, 'tick', 0.8], [1.0, 'tick', 0.8], [1.5, 'tick', 0.8]],
  figs: [[-0.3, 230, 1440, 0.6, A(FCB, { face: 'happy', armL: 'up', armR: 'up' })], [-0.3, 860, 1440, 0.6, A(MUN, { face: 'sad', flip: true })]],
  x: (t) => { board(t, -0.3, 540, 760, { clock: '90:00', score: [1, 0] }); cup(t, -0.3, 545, 1420, 0.85, { rib: true }); lot(t, -0.3, 'hourglass', 940, 760, 140); } });

VIS[0] = fscene(0, N, { bg: 'lineup', a: [0.5, 0.5, 1.0], b: [0.5, 0.48, 1.12], dim: 0.35, badge: 'REAL PHOTO · THE TEAMS, CAMP NOU, 26 MAY 1999', k: [[0.75, 'hit', 1], [1.5, 'land', 1], [2.1, 'land', 1]],
  figs: [[0.1, 260, 1140, 0.58, A(FCB, { face: 'happy', armR: 'fist' })], [0.3, 840, 1140, 0.58, A(MUN, { face: 'shock', flip: true })]],
  x: (t) => { board(t, 0.2, 540, 560, { clock: "6'", score: (t) => [t > 0.75 ? 1 : 0, 0], hitAt: 0.75 });
    if (t > 1.5) burst(t, 1.5, 540, 930, 80, 'POST!', '#FFFFFF'); if (t > 2.1) burst(t, 2.1, 560, 1080, 80, 'BAR!', '#FFFFFF'); } });

VIS[1] = fscene(1, N, { bg: 'johan', a: [0.5, 0.35, 1.0], b: [0.5, 0.35, 1.1], dim: 0.4, badge: 'REAL PHOTO · LENNART JOHANSSON, UEFA PRESIDENT', k: [[0.6, 'tick', 0.8], [1.1, 'tick', 0.8], [1.6, 'tick', 0.8], [1.3, 'pop', 0.7, 900]],
  x: (t) => { board(t, 0.1, 540, 560, { clock: clk(89, 54, 3), score: [1, 0] });
    const wx = lerp(250, 520, ease(clamp((t - 0.2) / 2.2)));
    fig(t, 0.1, wx, 1150, 0.6 * FIGSCALE, A(BOSS, { face: 'smug', armR: 'hold', armL: 'hold', walk: t < 2.4 }));
    cup(t, 0.2, wx + 20, 1150 - 150 * 0.6 * FIGSCALE, 0.5, { rib: true }); lot(t, 1.3, 'alarm', 860, 900, 160); } });

VIS[2] = fscene(2, N, { bg: 'sher', a: [0.5, 0.3, 1.0], b: [0.5, 0.3, 1.1], dim: 0.45, badge: 'REAL PHOTO · TEDDY SHERINGHAM (2024)', k: [[0.9, 'mute', 1, 0.55], [1.5, 'boom', 1], [1.52, 'hit', 1.3]],
  figs: [[0.1, 200, 1140, 0.58, (t) => A(MUN, { face: t > 1.5 ? 'wow' : 'talk', armR: t > 1.5 ? 'fist' : 'out' })]],
  x: (t) => { goal(t, 1.22, 800, 1140); board(t, 0.1, 540, 560, { clock: '90+1', score: (t) => [1, t > 1.5 ? 1 : 0], hitAt: 1.5 });
    if (t > 1.5) { flash(t, 1.5, 0.5, 0.15); burst(t, 1.5, 760, 880, 110, 'GOAL!', GOLDC); lot(t, 1.7, 'mindblown', 470, 930, 150); } } });

VIS[3] = fscene(3, N, { bg: 'sol', a: [0.5, 0.35, 1.0], b: [0.5, 0.33, 1.12], dim: 0.45, badge: 'REAL PHOTO · OLE GUNNAR SOLSKJÆR', k: [[0.75, 'mute', 1, 0.4], [1.05, 'boom', 1.1], [1.07, 'hit', 1.4], [1.4, 'crack', 0.8]],
  figs: [[0.1, 200, 1140, 0.58, (t) => A(MUN, { face: t > 1.05 ? 'wow' : 'talk', armR: t > 1.05 ? 'up' : 'out', armL: t > 1.05 ? 'up' : 'down' })]],
  x: (t) => { goal(t, 0.8, 800, 1140); board(t, 0.1, 540, 560, { clock: '90+3', score: (t) => [1, t > 1.05 ? 2 : 1], hitAt: 1.05 });
    if (t > 1.05) { flash(t, 1.05, 0.6, 0.15); g.save(); g.translate(shake(t, 1.05, 16), 0); burst(t, 1.05, 760, 880, 120, '2–1!', '#FF5A50'); g.restore(); lot(t, 1.3, 'scream', 470, 930, 150); } } });

VIS[4] = fscene(4, N, { bg: 'celeb', a: [0.5, 0.5, 1.0], b: [0.5, 0.5, 1.1], dim: 0.35, badge: 'REAL PHOTO · UNITED CELEBRATE, CAMP NOU', k: [[0.5, 'thump', 1], [1.0, 'pop', 0.8, 800], [1.6, 'pop', 0.8, 600]],
  figs: [[0.1, 300, 1170, 0.56, A(FCB, { face: 'cry', tilt: 1.35, flip: true })], [0.3, 820, 1140, 0.58, A(MUN, { face: 'happy', armL: 'wave', armR: 'wave', flip: true })]],
  bub: [[1.0, 540, 820, 'WINNERS CRY.', { size: 50, tx: 300, ty: 1000 }], [1.6, 600, 960, 'LOSERS DANCE.', { size: 50, tx: 800, ty: 1050 }]],
  x: (t) => { board(t, 0.1, 540, 520, { clock: 'FULL TIME', clockCol: '#2E7D32', score: [1, 2] }); lot(t, 0.7, 'cry', 200, 960, 130); lot(t, 1.2, 'party', 930, 860, 150); } });
