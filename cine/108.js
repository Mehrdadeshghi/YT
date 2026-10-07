// Wiki Roulette #108 — STORY TIME: "The Tortoise and the Hare" (Aesop's fable, public domain).
// Kids special #2: picture-book meadow drawn in code (race track, oak tree, start/finish), original cartoon tortoise + hare,
// the family voice (cleaned with DeepFilterNet) tells the story, every action synced to the spoken word (sw()).
// Retention for kids: question in frame 1 (who wins?) → show-off → challenge → race start → the nap (open loop) →
// the slow walk past the sleeping hare → wake-up shock → photo finish → moral → subscribe.
const N = 10, INKC = '#1A1714', GRASS = '#7BCB4E', GRASS2 = '#5DAE38', PATH = '#E9C98A', SHELL = '#4FA544', SHELL2 = '#2F7D2E', SKIN = '#B5C95A';
const FUR = '#C9B49A', FUR2 = '#F4ECE0', EARPINK = '#FF9EB5', TRACK0 = 300, FINISH = 2700, TREE = 1750, GROUND = 1150;
const st = (p, col, lw = 7) => { g.lineJoin = 'round'; g.lineCap = 'round'; g.fillStyle = col; g.fill(p); g.lineWidth = lw; g.strokeStyle = INKC; g.stroke(p); };
const P2 = () => new Path2D();
const blinkK = (t, seed) => { const ph = (t + seed * 1.7) % 3.4; return ph < 0.12 ? Math.abs(ph - 0.06) / 0.06 : 1; };
const S = (f) => (K, Sc) => f()(K, Sc);
function cam(z, fx, fy) { g.translate(540, 1000); g.scale(z * 1.3, z * 1.3); g.translate(-fx, -fy); }   // characters big, ground at ~y 1200
const zoomTo = (t, a, b, t0, dur) => { const u = ease((t - t0) / dur); return a.map((v, k) => lerp(v, b[k], u)); };

// ---------- world: meadow race track ----------
function meadow(t) {
  const gr = g.createLinearGradient(0, -300, 0, 1000); gr.addColorStop(0, '#78CDF5'); gr.addColorStop(1, '#DDF5FF'); g.fillStyle = gr; g.fillRect(-2000, -1500, 7000, 2600);
  g.save(); g.translate(1400, 260); g.rotate(t * 0.25); g.fillStyle = '#FFE36B'; for (let k = 0; k < 12; k++) { g.rotate(Math.PI / 6); g.beginPath(); g.moveTo(-14, 120); g.lineTo(0, 175); g.lineTo(14, 120); g.fill(); } g.restore();
  st(circ(1400, 260, 95), '#FFD93D', 6);
  [[0, 200, 1], [700, 120, 0.8], [1900, 260, 1], [2700, 160, 0.9], [-700, 220, 1.1], [3400, 240, 0.9]].forEach(([x, y, s], k) => { const xx = x + t * 14 * (k % 2 ? 1 : 0.6);
    g.save(); g.translate(xx, y); g.scale(s, s); const p = P2(); [[-70, 10, 50], [-10, -15, 65], [60, 10, 50], [0, 20, 55]].forEach(([a, b, r]) => p.arc(a, b, r, 0, 6.283)); g.fillStyle = '#FFF'; g.fill(p); g.restore(); });
  const hill = (y, amp, col, ph) => { const p = P2(); p.moveTo(-2000, 2000); for (let x = -2000; x <= 5000; x += 40) p.lineTo(x, y - Math.abs(Math.sin(x / 520 + ph)) * amp); p.lineTo(5000, 2000); p.closePath(); g.fillStyle = col; g.fill(p); g.lineWidth = 6; g.strokeStyle = INKC; g.stroke(p); };
  hill(930, 150, '#A8DE7E', 0.3); hill(1010, 90, '#93D468', 1.4);
  g.fillStyle = GRASS; g.fillRect(-2000, 1060, 7000, 1200); g.lineWidth = 6; g.strokeStyle = INKC; g.beginPath(); g.moveTo(-2000, 1060); g.lineTo(5000, 1060); g.stroke();
  const pa = P2(); pa.moveTo(-2000, 1110); pa.lineTo(5000, 1110); pa.lineTo(5000, 1230); pa.lineTo(-2000, 1230); pa.closePath(); g.fillStyle = PATH; g.fill(pa);
  g.strokeStyle = 'rgba(26,23,20,0.35)'; g.lineWidth = 4; g.beginPath(); g.moveTo(-2000, 1110); g.lineTo(5000, 1110); g.moveTo(-2000, 1230); g.lineTo(5000, 1230); g.stroke();
  for (let k = 0; k < 40; k++) { const x = -1500 + k * 170 + (k % 3) * 40, y = 1300 + (k % 4) * 90, col = ['#FF6FA5', '#FFD93D', '#FFFFFF', '#B57BFF'][k % 4];
    g.fillStyle = col; for (let a = 0; a < 5; a++) { g.beginPath(); g.arc(x + Math.cos(a * 1.257) * 12, y + Math.sin(a * 1.257) * 12, 9, 0, 6.283); g.fill(); } g.fillStyle = '#FFB000'; g.beginPath(); g.arc(x, y, 7, 0, 6.283); g.fill(); }
  // big oak (nap tree)
  const tr = P2(); tr.moveTo(TREE - 50, 1080); tr.quadraticCurveTo(TREE - 20, 900, TREE - 40, 760); tr.lineTo(TREE + 40, 760); tr.quadraticCurveTo(TREE + 20, 900, TREE + 55, 1080); tr.closePath(); st(tr, '#9C6B3C');
  const cp = P2(); [[-170, 0, 150], [0, -90, 180], [170, 0, 150], [-90, 80, 130], [100, 80, 130]].forEach(([a, b, r]) => { cp.moveTo(TREE + a + r, 640 + b); cp.arc(TREE + a, 640 + b, r, 0, 6.283); });
  g.lineWidth = 14; g.strokeStyle = INKC; g.stroke(cp); g.fillStyle = '#3DBA4E'; g.fill(cp); g.fillStyle = '#2E9A3E'; [[-110, 40, 60], [90, -60, 70], [140, 70, 50]].forEach(([a, b, r]) => { g.beginPath(); g.arc(TREE + a, 640 + b, r, 0, 6.283); g.fill(); });
  if (!NOSTART) banner(TRACK0, 'START', '#4DA3FF'); banner(FINISH, 'FINISH', '#FF4D6D', true); }
let NOSTART = false;
function banner(x, label, col, checker) {
  [x - 230, x + 230].forEach((px) => st(rr(px - 12, 640, 24, 520, 10), '#FFFFFF', 6));
  st(rr(x - 250, 620, 500, 110, 20), col, 7); if (checker) { g.save(); g.beginPath(); g.roundRect(x - 250, 620, 500, 110, 20); g.clip();
    for (let i = 0; i < 20; i++) for (let j = 0; j < 4; j++) if ((i + j) % 2) { g.fillStyle = 'rgba(26,23,20,0.18)'; g.fillRect(x - 250 + i * 25, 620 + j * 28, 25, 28); } g.restore(); }
  text(label, x, 700, 'disp', 64, '#FFFFFF', { align: 'center' }); }
function ribbon(x, broken, t) { if (!broken) { g.strokeStyle = '#FF4D6D'; g.lineWidth = 10; g.beginPath(); g.moveTo(x - 230, 1000); g.quadraticCurveTo(x, 1020, x + 230, 1000); g.stroke(); return; }
  g.strokeStyle = '#FF4D6D'; g.lineWidth = 10; const k = Math.min(1, (t - broken) * 3); g.beginPath(); g.moveTo(x - 230, 1000); g.quadraticCurveTo(x - 120, 1040 + 60 * k, x - 40, 1080 + 40 * k); g.moveTo(x + 230, 1000); g.quadraticCurveTo(x + 120, 1040 + 60 * k, x + 40, 1080 + 40 * k); g.stroke(); }
function speedLines(x, y, dir, t) { g.strokeStyle = 'rgba(255,255,255,0.95)'; g.lineWidth = 8; g.lineCap = 'round'; for (let k = 0; k < 5; k++) { const yy = y - 60 - k * 55, len = 90 + ((k * 37 + t * 900) % 80);
  g.beginPath(); g.moveTo(x - dir * (120 + k * 10), yy); g.lineTo(x - dir * (120 + k * 10 + len), yy); g.stroke(); } }
function dust(x, y, t0, t) { const lt = t - t0; if (lt < 0 || lt > 0.9) return; for (let k = 0; k < 6; k++) { const r = 30 + lt * 90 + k * 6, a = (1 - lt / 0.9) * 0.8;
  g.fillStyle = `rgba(233,201,138,${a})`; g.beginPath(); g.arc(x - k * 40 - lt * 120, y - 20 - (k % 2) * 25, r * 0.5, 0, 6.283); g.fill(); } }

// ---------- cast ----------
// tortoise: feet on ground at (x, y); faces right (flip → left). o: { face: happy|smile|proud|sad|wow, walk (bool), medal, look }
function tortoise(t, x, y, s, o = {}) {
  const ph = o.walk ? t * 5 : 0, bob = o.walk ? Math.abs(Math.sin(ph)) * 5 : Math.sin(t * 2) * 2;
  g.save(); g.translate(x, y - bob); g.scale(s * (o.flip ? -1 : 1), s);
  [[-80, 0], [70, Math.PI]].forEach(([lx, off]) => { const sw2 = o.walk ? Math.sin(ph + off) * 14 : 0; st(rr(lx - 24 + sw2, -60, 48, 62, 20), SKIN, 6); });
  const tail = P2(); tail.moveTo(-140, -70); tail.lineTo(-175, -55); tail.lineTo(-138, -48); st(tail, SKIN, 5);
  // head + neck (in front, right)
  const hy = -125 + (o.walk ? Math.sin(ph * 2) * 3 : 0), neck = P2(); neck.moveTo(100, -80); neck.quadraticCurveTo(140, -100, 150, hy + 20); neck.lineTo(185, hy + 30); neck.quadraticCurveTo(170, -70, 120, -55); neck.closePath(); st(neck, SKIN, 6);
  st(ell(185, hy, 58, 50), SKIN);
  const bl = o.closed ? 0.15 : blinkK(t, 4); g.save(); g.translate(200, hy - 12); g.scale(1, bl); g.fillStyle = '#FFF'; g.beginPath(); g.ellipse(0, 0, 17, 20, 0, 0, 6.283); g.fill(); g.lineWidth = 4; g.strokeStyle = INKC; g.stroke();
  g.fillStyle = INKC; g.beginPath(); g.arc(5 + (o.look ? o.look[0] * 4 : 0), 3, 8, 0, 6.283); g.fill(); g.fillStyle = '#FFF'; g.beginPath(); g.arc(8, -1, 3, 0, 6.283); g.fill(); g.restore();
  g.fillStyle = 'rgba(255,120,120,0.45)'; g.beginPath(); g.ellipse(212, hy + 18, 12, 8, 0, 0, 6.283); g.fill();
  g.lineWidth = 5; g.strokeStyle = INKC; g.lineCap = 'round'; const f = o.face || 'smile';
  if (f === 'wow') st(ell(222, hy + 22, 9, 12), '#7A1F1F', 4); else if (f === 'sad') { g.beginPath(); g.arc(215, hy + 36, 13, Math.PI + 0.5, -0.5); g.stroke(); }
  else { g.beginPath(); g.arc(212, hy + 12, f === 'proud' ? 22 : 17, 0.3, Math.PI - 0.6); g.stroke(); }
  // shell
  const sh = P2(); sh.moveTo(-150, -50); sh.bezierCurveTo(-150, -230, 130, -230, 130, -50); sh.closePath(); st(sh, SHELL);
  g.save(); g.clip(sh); g.strokeStyle = SHELL2; g.lineWidth = 7; [[-60, -120], [20, -150], [80, -95], [-110, -85], [0, -80]].forEach(([a, b]) => { const p = P2(); for (let k = 0; k < 6; k++) { const an = k / 6 * 6.283; p.lineTo(a + Math.cos(an) * 40, b + Math.sin(an) * 36); } p.closePath(); g.stroke(p); }); g.restore();
  st(rr(-160, -60, 300, 26, 13), '#E6C35A', 6);
  if (o.medal) { g.strokeStyle = '#4DA3FF'; g.lineWidth = 8; g.beginPath(); g.moveTo(150, hy + 40); g.lineTo(175, hy + 90); g.lineTo(200, hy + 40); g.stroke(); st(circ(175, hy + 105, 26), '#FFD93D', 5); text('1', 175, hy + 117, 'disp', 30, INKC, { align: 'center' }); }
  g.restore(); }
// hare: feet at (x, y); faces right (flip → left). o: { face: smug|laugh|shock|sleep|sad|happy, run (bool), pose: stand|flex|clap|lie, look }
function hare(t, x, y, s, o = {}) {
  const run = o.run, ph = t * 18, lie = o.pose === 'lie';
  g.save(); g.translate(x, y - (run ? Math.abs(Math.sin(ph)) * 30 : Math.sin(t * 3) * 3)); g.scale(s * (o.flip ? -1 : 1), s); if (lie) g.rotate(-1.35); if (run) g.rotate(0.12);
  st(circ(-70, -110, 28), '#FFFFFF', 6);   // tail
  // legs / big feet
  const fl = run ? Math.sin(ph) * 40 : 0; st(ell(-20 - fl, -12, 58, 22), FUR, 6); st(ell(40 + fl, -12, 58, 22), FUR, 6);
  st(ell(0, -120, 72, 100), FUR); st(ell(14, -105, 44, 70), FUR2, 5);
  // arms
  const pose = o.pose || 'stand', ARM = { stand: [[-40, -170, -50, -95], [50, -170, 70, -100]], flex: [[-40, -170, -105, -235], [50, -170, 115, -235]], clap: [[-40, -170, 20, -160 + Math.sin(t * 20) * 8], [50, -170, 30, -160 - Math.sin(t * 20) * 8]], lie: [[-40, -170, -50, -95], [50, -170, 70, -100]] };
  (ARM[pose] || ARM.stand).forEach(([a, b, c, d]) => { const p = P2(); p.moveTo(a, b); p.quadraticCurveTo((a + c) / 2 + 20, (b + d) / 2, c, d); g.lineWidth = 30; g.strokeStyle = INKC; g.lineCap = 'round'; g.stroke(p); g.lineWidth = 18; g.strokeStyle = FUR; g.stroke(p); st(circ(c, d, 15), FUR2, 5); });
  if (pose === 'flex') [[-105, -235], [115, -235]].forEach(([a, b]) => { g.save(); g.translate(a, b - 30); st(ell(0, 0, 18, 14), FUR, 4); g.restore(); });
  // head + ears
  const hy = -255, ew = Math.sin(t * 2.5) * 0.06 + (run ? -0.5 : 0);
  [[-28, -0.18], [28, 0.18]].forEach(([ex, rot]) => { g.save(); g.translate(ex, hy - 50); g.rotate(rot + ew); st(ell(0, -85, 24, 92), FUR); st(ell(0, -80, 11, 70), EARPINK, 0); g.restore(); });
  st(ell(0, hy, 66, 60), FUR); st(ell(18, hy + 18, 34, 26), FUR2, 0);
  const bl = o.face === 'sleep' ? 0 : blinkK(t, 5), [lx, ly] = o.look || [0.4, 0];
  [[-6, hy - 12], [36, hy - 12]].forEach(([ex, ey]) => { if (o.face === 'sleep') { g.lineWidth = 5; g.strokeStyle = INKC; g.beginPath(); g.arc(ex, ey, 12, 0.2, Math.PI - 0.2); g.stroke(); return; }
    g.save(); g.translate(ex, ey); g.scale(1, bl); const big = o.face === 'shock'; g.fillStyle = '#FFF'; g.beginPath(); g.ellipse(0, 0, big ? 18 : 14, big ? 22 : 18, 0, 0, 6.283); g.fill(); g.lineWidth = 4; g.strokeStyle = INKC; g.stroke();
    g.fillStyle = INKC; g.beginPath(); g.arc(lx * 5, ly * 5 + 2, big ? 5 : 7, 0, 6.283); g.fill(); g.restore(); if (o.face === 'smug') { g.lineWidth = 5; g.strokeStyle = INKC; g.beginPath(); g.moveTo(ex - 16, ey - 14); g.lineTo(ex + 16, ey - 10); g.stroke(); } });
  st(ell(26, hy + 8, 10, 8), EARPINK, 4);
  g.lineWidth = 5; g.strokeStyle = INKC; g.lineCap = 'round'; const f = o.face || 'smug';
  if (f === 'laugh') { const p = P2(); p.moveTo(0, hy + 22); p.quadraticCurveTo(22, hy + 70 + Math.abs(Math.sin(t * 14)) * 8, 46, hy + 22); p.closePath(); st(p, '#C0392B', 5); st(rr(12, hy + 22, 22, 18, 3), '#FFF', 3); }
  else if (f === 'shock') st(ell(24, hy + 40, 12, 16), '#7A1F1F', 5);
  else if (f === 'sad') { g.beginPath(); g.arc(24, hy + 48, 14, Math.PI + 0.5, -0.5); g.stroke(); }
  else if (f === 'sleep') { g.beginPath(); g.arc(24, hy + 30, 8, 0, 6.283); g.stroke(); }
  else { g.beginPath(); g.moveTo(6, hy + 30); g.quadraticCurveTo(28, hy + 44, 48, hy + 24); g.stroke(); st(rr(18, hy + 34, 18, 14, 3), '#FFF', 3); }
  g.restore();
  if (o.face === 'sleep') { [0, 1, 2].forEach((k) => { const lt = (t * 0.8 + k / 3) % 1; g.save(); g.globalAlpha = Math.sin(lt * Math.PI); text('Z', x + 80 + lt * 90 + k * 10, y - 260 - lt * 200, 'disp', 40 + k * 14, '#3B5BDB', { align: 'center' }); g.restore(); }); } }

// ---------- scene plumbing ----------
function kscene(i, sp) { return (K) => { K(0.45, 'whoosh', 0.45); (sp.k || []).forEach(([a, b, c, d]) => K(a, b, c, d));
  return (t) => { g.save(); const [z, fx, fy] = sp.cam ? sp.cam(t) : [1, 540, 1000]; cam(z, fx, fy); NOSTART = !!sp.noStart; meadow(t); NOSTART = false; if (sp.world) sp.world(t); g.restore();
    if (sp.ui) sp.ui(t); tag(t, i, N); }; }; }
const storyChip = (t) => chip('STORY TIME · THE TORTOISE AND THE HARE', 540, 360, t, -0.3, { size: 24, bg: GOLD, fg: BG });

VIS.open = (K) => { K(0.05, 'pop', 1, 700); K(0.3, 'ding', 0.9); K(sw('hare', 1.4), 'zap', 0.8); K(sw('tortoise', 2.6), 'pop', 0.9, 500); K(sw('find', 3.6), 'pop', 1, 900);
  return (t) => { g.save(); cam(1, 420, 1000); meadow(t); ribbon(FINISH, null, t);
    hare(t, 520, GROUND, 0.95, { face: 'smug', pose: t > sw('hare', 1.4) ? 'flex' : 'stand' }); tortoise(t, 220, GROUND, 0.85, { face: 'smile' }); g.restore();
    tag(t); hook(t, EP.hook, 1440, { size: 110 }); lot(t, 0.4, 'think', 920, 560, 140); }; };

VIS[0] = S(() => { const fa = sw('fast', 1.4), sh = sw('show', 2.6);
  return kscene(0, { k: [[fa - 0.3, 'swish', 1], [sh, 'pop', 1, 800]],
    cam: (t) => [1, 540, 1000],
    world: (t) => { const run = t > fa - 0.4 && t < fa + 0.9, x = run ? lerp(-300, 1500, (t - fa + 0.4) / 1.3) : t < fa ? 540 : 600;
      if (run) { speedLines(x, GROUND, 1, t); dust(x - 80, GROUND, fa - 0.4, t); }
      hare(t, t > fa + 0.9 ? 600 : x, GROUND, 1, { face: run ? 'happy' : 'smug', run, pose: t > sh ? 'flex' : 'stand' }); },
    ui: (t) => { storyChip(t); if (t > fa - 0.3 && t < fa + 1.2) lot(t, fa - 0.3, 'zap', 860, 560, 150); if (t > sh) { lot(t, sh, 'sparkles', 860, 560, 150); chip('SHOW-OFF!', 540, 1320, t, sh, { size: 44, bg: '#FFFFFF', fg: INKC }); } } }); });

VIS[1] = S(() => { const fs = sw('fastest', 0.6), la = sw('laughed', 2.0), sl = sw('slow', 3.0);
  return kscene(1, { noStart: true, k: [[fs, 'pop', 1, 700], [la, 'pop', 0.9, 900], [sl, 'wrong', 0.9]],
    cam: (t) => zoomTo(t, [1.0, 540, 1000], [1.2, 480, 960], 0, 0.8),
    world: (t) => { hare(t, 640, GROUND, 1, { face: t > la ? 'laugh' : 'smug', pose: t > la ? 'clap' : 'flex', flip: true }); tortoise(t, 240, GROUND, 0.85, { face: t > sl ? 'sad' : 'smile' }); },
    ui: (t) => { if (t > fs && t < sl) bubble(t, fs, 640, 560, "I'M THE FASTEST!", { size: 52, tx: 680, ty: 760 }); if (t > sl) bubble(t, sl, 640, 560, "YOU'RE SO SLOW!", { size: 52, tx: 680, ty: 760 }); if (t > la) lot(t, la, 'lol', 900, 760, 130); } }); });

VIS[2] = S(() => { const smi = sw('smiled', 0.8), race = sw('race', 1.8), la = sw('laughed', 2.6);
  return kscene(2, { noStart: true, k: [[smi, 'ding', 0.8], [race, 'stamp', 1], [la, 'pop', 0.9, 900]],
    cam: (t) => zoomTo(t, [1.2, 480, 960], [1.3, 380, 960], 0, 1.0),
    world: (t) => { hare(t, 640, GROUND, 1, { face: t > la ? 'laugh' : 'shock', pose: t > la ? 'clap' : 'stand', flip: true }); tortoise(t, 240, GROUND, 0.85, { face: 'proud' }); },
    ui: (t) => { if (t > smi) bubble(t, Math.max(smi, race - 0.6), 360, 560, "LET'S HAVE A RACE!", { size: 50, tx: 330, ty: 820 }); if (t > la) lot(t, la, 'lol', 900, 760, 140); } }); });

VIS[3] = S(() => { const re = sw('ready', 0.3), st2 = sw('steady', 1.0), go = sw('go', 1.6), zo = sw('zoom', 2.1);
  return kscene(3, { k: [[re, 'beep', 1], [st2, 'beep', 1], [go, 'ding', 1.2], [zo, 'swish', 1.2], [zo + 0.02, 'zap', 0.8]],
    cam: (t) => [1, 380, 1000],
    world: (t) => { const hx = t < zo ? 520 : 520 + Math.pow(t - zo, 1.6) * 1800; if (t > zo) { speedLines(hx, GROUND, 1, t); dust(520, GROUND, zo, t); }
      hare(t, hx, GROUND, 1, { face: t > zo ? 'happy' : 'smug', run: t > zo }); tortoise(t, 230, GROUND, 0.85, { face: 'smile', walk: t > go }); },
    ui: (t) => { const w2 = t > go ? 'GO!' : t > st2 ? 'STEADY…' : t > re ? 'READY…' : null, at = t > go ? go : t > st2 ? st2 : re;
      if (w2) stampText(w2, 540, 1320, t, at, { size: t > go ? 150 : 100, rot: -0.06 }); if (t > zo) lot(t, zo, 'zap', 860, 760, 150); } }); });

VIS[4] = S(() => { const sl = sw('slowly', 1.0), s1 = sw('step', 1.6), s2 = sw('step', 2.3, 1), s3 = sw('step', 3.0, 2);
  return kscene(4, { k: [[s1, 'tick', 1], [s2, 'tick', 1], [s3, 'tick', 1]],
    cam: (t) => zoomTo(t, [1.25, 300, 1000], [1.25, 480, 1000], 0, 3.5),
    world: (t) => { const x = lerp(230, 560, clamp(t / 3.6)); [s1, s2, s3].forEach((s, k) => { if (t > s) { g.fillStyle = 'rgba(120,90,50,0.35)'; g.beginPath(); g.ellipse(230 + (k + 1) * 80, GROUND + 25, 18, 9, 0, 0, 6.283); g.fill(); } });
      tortoise(t, x, GROUND, 0.9, { face: 'smile', walk: true }); },
    ui: (t) => { [s1, s2, s3].forEach((s, k) => { if (t > s) chip(['STEP…', 'BY STEP…', 'BY STEP!'][k], 540, 1290 + k * 70, t, s, { size: 40, bg: '#FFFFFF', fg: INKC }); }); if (t > sl) lot(t, sl, 'turtle', 880, 760, 130); } }); });

VIS[5] = S(() => { const lb = sw('looked', 0.8), far = sw('far', 1.6), nap = sw('nap', 3.0);
  return kscene(5, { k: [[lb, 'whoosh', 0.6], [far, 'pop', 0.9, 500], [nap, 'pop', 1, 1000]],
    cam: (t) => zoomTo(t, [1.05, TREE - 100, 1000], [1.15, TREE, 980], nap - 0.3, 0.6),
    world: (t) => { hare(t, TREE + 160, t > nap ? GROUND - 40 : GROUND, 1, { face: t > nap + 0.4 ? 'sleep' : t > lb ? 'smug' : 'happy', flip: t > lb && t < nap, pose: t > nap + 0.3 ? 'lie' : 'stand', look: [-0.8, 0] }); },
    ui: (t) => { if (t > far && t < nap) chip('TORTOISE: FAR, FAR BEHIND…', 540, 1320, t, far, { size: 36, bg: '#FFFFFF', fg: INKC }); if (t > nap) bubble(t, nap, 540, 560, 'NAP TIME!', { size: 56, tx: 600, ty: 760, out: nap + 1.6 }); } }); });

VIS[6] = S(() => { const kw = sw('kept', 0.8), nev = sw('never', 2.5);
  return kscene(6, { k: [[kw, 'tick', 0.8], [kw + 0.5, 'tick', 0.8], [nev, 'stamp', 1.1]],
    cam: (t) => zoomTo(t, [1.05, TREE - 200, 1000], [1.05, TREE + 300, 1000], 0, 3.5),
    world: (t) => { hare(t, TREE + 160, GROUND - 40, 1, { face: 'sleep', pose: 'lie' }); tortoise(t, lerp(TREE - 450, TREE + 520, clamp(t / 3.6)), GROUND + 40, 0.85, { face: 'smile', walk: true }); },
    ui: (t) => { if (t > nev) { stampText('NEVER STOP!', 540, 1320, t, nev, { size: 96, rot: -0.06 }); lot(t, nev + 0.1, 'hundred', 880, 760, 130); } } }); });

VIS[7] = S(() => { const wo = sw('woke', 0.7), oh = sw('oh', 1.6), fin = sw('finish', 3.0);
  return kscene(7, { k: [[wo, 'pop', 0.9, 600], [oh - 0.35, 'mute', 1, 0.35], [oh, 'boom', 1], [oh + 0.02, 'hit', 1]],
    cam: (t) => t < oh ? [1.2, TREE + 100, 960] : zoomTo(t, [1.0, FINISH - 250, 1000], [1.1, FINISH - 200, 980], oh, 1.5),
    world: (t) => { ribbon(FINISH, null, t); hare(t, TREE + 160, t < wo ? GROUND - 40 : GROUND, 1, { face: t < wo ? 'sleep' : 'shock', pose: t < wo ? 'lie' : 'stand' });
      tortoise(t, lerp(FINISH - 420, FINISH - 250, clamp((t - oh) / 2.5)), GROUND, 0.9, { face: 'proud', walk: true }); },
    ui: (t) => { if (t > wo && t < oh) lot(t, wo, 'shocked', 860, 600, 140); if (t > oh) { flash(t, oh, 0.4, 0.1); lot(t, oh, 'scream', 880, 600, 150); } if (t > fin) chip('ALMOST AT THE FINISH!', 540, 1320, t, fin, { size: 40, bg: '#FF4D6D', fg: '#FFF' }); } }); });

VIS[8] = S(() => { const ran = sw('ran', 0.5), late = sw('late', 2.6), won = sw('won', 3.4);
  return kscene(8, { k: [[ran, 'swish', 1.1], [late, 'wrong', 1], [won - 0.4, 'mute', 1, 0.4], [won, 'boom', 1.1], [won + 0.02, 'ding', 1.2]],
    cam: (t) => [1.0, FINISH - 150, 1000],
    world: (t) => { const tx = lerp(FINISH - 250, FINISH + 60, clamp((t - 0.2) / Math.max(0.5, won - 0.2))); ribbon(FINISH, t > won ? won : null, t);
      const hx = lerp(FINISH - 1100, FINISH - 260, clamp((t - ran) / Math.max(0.5, won - ran + 0.3))); speedLines(hx, GROUND, 1, t);
      hare(t, hx, GROUND, 0.9, { face: t > won ? 'sad' : 'shock', run: t < won + 0.3 }); tortoise(t, tx, GROUND, 0.9, { face: t > won ? 'proud' : 'smile', walk: t < won }); },
    ui: (t) => { if (t > late && t < won) chip('TOO LATE!', 540, 1320, t, late, { size: 52, bg: '#FF4D6D', fg: '#FFF' });
      if (t > won) { stampText('WINNER!', 540, 1320, t, won, { size: 130, rot: -0.06 }); lot(t, won, 'party', 230, 520, 160); lot(t, won + 0.1, 'trophy', 860, 760, 150); } } }); });

VIS[9] = S(() => { const sl = sw('slow', 0.3), ng = sw('never', 1.8);
  return kscene(9, { k: [[sl, 'ding', 1], [ng, 'stamp', 1.1]],
    cam: (t) => [1.15, FINISH, 990],
    world: (t) => { ribbon(FINISH, -1, t + 5); tortoise(t, FINISH - 40, GROUND, 0.95, { face: 'proud', medal: true }); hare(t, FINISH + 300, GROUND, 0.85, { face: 'happy', pose: 'clap', flip: true }); },
    ui: (t) => { if (t > sl) stampText('SLOW & STEADY!', 540, 1300, t, sl, { size: 84, rot: -0.05 }); if (t > ng) chip('NEVER GIVE UP!', 540, 600, t, ng, { size: 48, bg: GOLD, fg: BG }); lot(t, 0.3, 'clap', 900, 560, 120); } }); });
