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
function kscene(i, sp) { return (K) => { (sp.k || []).forEach(([a, b, c, d]) => K(a, b, c, d));     // kids: no whoosh, calm transitions (crossfade)
  return (t) => { g.save(); const [z, fx, fy] = sp.cam ? sp.cam(t) : [1, 540, 1000]; cam(z, fx, fy); NOSTART = !!sp.noStart; meadow(t); NOSTART = false; if (sp.world) sp.world(t); g.restore();
    if (sp.ui) sp.ui(t); tag(t, i, N); }; }; }
const storyChip = (t) => chip('STORY TIME · THE TORTOISE AND THE HARE', 540, 360, t, -0.3, { size: 24, bg: GOLD, fg: BG });
// kids label: a soft rounded card that floats in gently (no shake, no flash, no stamp)
function label(str, x, y, t, tIn, o = {}) { const lt = t - tIn; if (lt < 0) return; const s = spring(lt, 140, 22), size = o.size || 84;
  g.save(); g.font = F.disp(size); const w = g.measureText(str).width + 90, h = size * 1.55; g.translate(x, y + (1 - s) * 40); g.globalAlpha *= clamp(lt / 0.35);
  g.shadowColor = 'rgba(0,0,0,0.25)'; g.shadowBlur = 24; rrect(-w / 2, -h / 2, w, h, h / 2); g.fillStyle = o.bg || '#FFFFFF'; g.fill(); g.shadowBlur = 0; g.lineWidth = 6; g.strokeStyle = INKC; g.stroke();
  text(str, 0, size * 0.36, 'disp', size, o.fg || INKC, { align: 'center' }); g.restore(); }
// participation pause: two soft choice cards that gently bob while the child answers
function choice(t, tIn, tOut) { if (t < tIn || t > tOut) return; const b = Math.sin((t - tIn) * 4) * 8;
  label('TORTOISE?', 300, 1330 + b, t, tIn, { size: 52, bg: '#C9F2B5' }); label('HARE?', 790, 1330 - b, t, tIn + 0.15, { size: 52, bg: '#FFE0C7' }); }
const stepChips = (t, steps) => steps.forEach((s, k) => { if (t > s) label(['STEP…', 'BY STEP…', 'BY STEP!'][k], 540, 1290 + k * 105, t, s, { size: 52 }); });

VIS.open = (K) => { const ha = sw('hare', 1.4), to = sw('tortoise', 2.6), th = sw('think', 3.4), fi = sw('find', 6);
  K(0.05, 'ding', 0.8); K(ha, 'pop', 0.7, 700); K(to, 'pop', 0.7, 500); K(fi, 'ding', 0.8);
  return (t) => { g.save(); cam(1, 420, 1000); meadow(t); ribbon(FINISH, null, t);
    hare(t, 520, GROUND, 0.95, { face: 'smug', pose: t > ha && t < to ? 'flex' : 'stand' }); tortoise(t, 220, GROUND, 0.85, { face: 'smile' }); g.restore();
    tag(t); if (t < th) hook(t, EP.hook, 1440, { size: 110 }); choice(t, th, fi); if (t > th) lot(t, th, 'think', 920, 560, 140); }; };

VIS[0] = S(() => { const fa = sw('fast', 1.4), sh = sw('show', 2.6);
  return kscene(0, { k: [[fa - 0.3, 'swish', 0.6], [sh, 'pop', 0.7, 800]],
    world: (t) => { const run = t > fa - 0.4 && t < fa + 1.4, x = run ? lerp(-300, 1300, (t - fa + 0.4) / 1.8) : t < fa ? 540 : 600;
      if (run) speedLines(x, GROUND, 1, t);
      hare(t, t > fa + 1.4 ? 600 : x, GROUND, 1, { face: run ? 'happy' : 'smug', run, pose: t > sh ? 'flex' : 'stand' }); },
    ui: (t) => { storyChip(t); if (t > sh) label('SHOW-OFF!', 540, 1330, t, sh, { size: 70 }); } }); });

VIS[1] = S(() => { const fs = sw('fastest', 0.6), la = sw('laughed', 1.6), sl = sw('slow', 2.6);
  return kscene(1, { noStart: true, k: [[fs, 'pop', 0.7, 700], [la, 'pop', 0.6, 900]],
    cam: (t) => zoomTo(t, [1.0, 540, 1000], [1.15, 480, 960], 0, 1.5),
    world: (t) => { hare(t, 640, GROUND, 1, { face: t > la ? 'laugh' : 'smug', pose: t > la ? 'clap' : 'flex', flip: true }); tortoise(t, 240, GROUND, 0.85, { face: t > sl ? 'sad' : 'smile' }); },
    ui: (t) => { if (t > fs && t < sl) bubble(t, fs, 640, 560, "I'M THE FASTEST!", { size: 52, tx: 680, ty: 760 }); if (t > sl) bubble(t, sl, 640, 560, "YOU'RE SO SLOW!", { size: 52, tx: 680, ty: 760 }); } }); });

VIS[2] = S(() => { const smi = sw('smiled', 0.8), race = sw('race', 1.8), win = sw('win', 3.0), hm = sw('hmm', 5.0);
  return kscene(2, { noStart: true, k: [[smi, 'ding', 0.6], [race, 'pop', 0.8, 600], [win + 0.3, 'ding', 0.6]],
    cam: (t) => zoomTo(t, [1.15, 480, 960], [1.2, 420, 960], 0, 1.5),
    world: (t) => { hare(t, 640, GROUND, 1, { face: t > race && t < win ? 'shock' : 'smug', pose: 'stand', flip: true }); tortoise(t, 240, GROUND, 0.85, { face: 'proud' }); },
    ui: (t) => { if (t > race - 0.5 && t < win) bubble(t, race - 0.5, 360, 560, "LET'S HAVE A RACE!", { size: 50, tx: 330, ty: 820 }); choice(t, win, hm + 0.6); if (t > win) lot(t, win, 'think', 900, 560, 130); } }); });

VIS[3] = S(() => { const re = sw('ready', 0.3), st2 = sw('steady', 1.0), go = sw('go', 1.6), zo = sw('zoom', 2.1);
  return kscene(3, { k: [[re, 'beep', 0.6], [st2, 'beep', 0.6], [go, 'ding', 0.9], [zo, 'swish', 0.8]],
    cam: (t) => [1, 380, 1000],
    world: (t) => { const hx = t < zo ? 520 : 520 + Math.pow(t - zo, 1.4) * 1100; if (t > zo) speedLines(hx, GROUND, 1, t);
      hare(t, hx, GROUND, 1, { face: t > zo ? 'happy' : 'smug', run: t > zo }); tortoise(t, 230, GROUND, 0.85, { face: 'smile', walk: t > go }); },
    ui: (t) => { const w2 = t > go ? 'GO!' : t > st2 ? 'STEADY…' : t > re ? 'READY…' : null, at = t > go ? go : t > st2 ? st2 : re;
      if (w2) label(w2, 540, 1330, t, at, { size: t > go ? 110 : 80, bg: t > go ? '#C9F2B5' : '#FFFFFF' }); } }); });

const refrain = (i) => S(() => { const s1 = sw('step', 1.4), s2 = sw('step', 2.1, 1), s3 = sw('step', 2.8, 2), x0 = i === 4 ? 230 : TREE - 420, x1 = i === 4 ? 560 : TREE + 300;
  return kscene(i, { k: [[s1, 'tick', 0.7], [s2, 'tick', 0.7], [s3, 'tick', 0.7]],
    cam: (t) => i === 4 ? zoomTo(t, [1.2, 300, 1000], [1.2, 480, 1000], 0, 3.5) : zoomTo(t, [1.0, TREE - 200, 1000], [1.0, TREE + 250, 1000], 0, 3.5),
    world: (t) => { if (i === 6) hare(t, TREE + 160, GROUND - 40, 1, { face: 'sleep', pose: 'lie' });
      tortoise(t, lerp(x0, x1, clamp(t / 3.6)), GROUND + (i === 6 ? 40 : 0), 0.9, { face: 'smile', walk: true }); },
    ui: (t) => stepChips(t, [s1, s2, s3]) }); });
VIS[4] = refrain(4);

VIS[5] = S(() => { const lb = sw('looked', 0.5), far = sw('far', 1.4), nap = sw('nap', 2.8), sh = sw('shhh', 3.8);
  return kscene(5, { k: [[lb, 'pop', 0.5, 500], [nap, 'pop', 0.6, 1000]],
    cam: (t) => zoomTo(t, [1.05, TREE - 100, 1000], [1.15, TREE, 980], nap - 0.3, 1.0),
    world: (t) => { hare(t, TREE + 160, t > nap ? GROUND - 40 : GROUND, 1, { face: t > nap + 0.4 ? 'sleep' : t > lb ? 'smug' : 'happy', flip: t > lb && t < nap, pose: t > nap + 0.3 ? 'lie' : 'stand', look: [-0.8, 0] }); },
    ui: (t) => { if (t > far && t < nap) label('FAR, FAR AWAY…', 540, 1330, t, far, { size: 60 }); if (t > nap) bubble(t, nap, 540, 560, 'NAP TIME!', { size: 56, tx: 600, ty: 760 }); if (t > sh) label('SHHH…', 540, 1330, t, sh, { size: 80, bg: '#D6E4FF' }); } }); });

VIS[6] = refrain(6);

VIS[7] = S(() => { const wo = sw('woke', 0.7), oh = sw('oh', 1.6), fin = sw('finish', 3.0);
  return kscene(7, { k: [[wo, 'pop', 0.6, 600], [oh, 'ding', 0.8]],
    cam: (t) => t < oh ? [1.2, TREE + 100, 960] : zoomTo(t, [1.0, FINISH - 250, 1000], [1.05, FINISH - 200, 980], oh, 2.0),
    world: (t) => { ribbon(FINISH, null, t); if (t < oh) hare(t, TREE + 160, t < wo ? GROUND - 40 : GROUND, 1, { face: t < wo ? 'sleep' : 'shock', pose: t < wo ? 'lie' : 'stand' });
      tortoise(t, lerp(FINISH - 420, FINISH - 250, clamp((t - oh) / 2.5)), GROUND, 0.9, { face: 'proud', walk: true }); },
    ui: (t) => { if (t > wo && t < oh) lot(t, wo, 'shocked', 860, 600, 140); if (t > fin) label('ALMOST THERE!', 540, 1330, t, fin, { size: 64, bg: '#FFE0C7' }); } }); });

VIS[8] = S(() => { const ran = sw('ran', 0.5), but = sw('but', 1.8), won = sw('won', 2.6);
  return kscene(8, { k: [[ran, 'swish', 0.7], [won, 'ding', 1], [won + 0.3, 'pop', 0.7, 900]],
    cam: (t) => [1.0, FINISH - 150, 1000],
    world: (t) => { const tx = lerp(FINISH - 250, FINISH + 60, clamp((t - 0.2) / Math.max(0.5, won - 0.2))); ribbon(FINISH, t > won ? won : null, t);
      const hx = lerp(FINISH - 1100, FINISH - 260, clamp((t - ran) / Math.max(0.5, won - ran + 0.3))); speedLines(hx, GROUND, 1, t);
      hare(t, hx, GROUND, 0.9, { face: t > won ? 'sad' : 'shock', run: t < won + 0.3 }); tortoise(t, tx, GROUND, 0.9, { face: t > won ? 'proud' : 'smile', walk: t < won }); },
    ui: (t) => { if (t > won) { label('THE TORTOISE WON!', 540, 1330, t, won, { size: 64, bg: '#C9F2B5' }); lot(t, won, 'party', 230, 520, 150); lot(t, won + 0.2, 'trophy', 860, 560, 140); } } }); });

VIS[9] = S(() => { const sl = sw('slow', 0.3), le = sw('learn', 2.0), ng = sw('never', 3.6);
  return kscene(9, { k: [[sl, 'ding', 0.8], [ng, 'ding', 0.8]],
    cam: (t) => [1.15, FINISH, 990],
    world: (t) => { ribbon(FINISH, -1, t + 5); tortoise(t, FINISH - 40, GROUND, 0.95, { face: 'proud', medal: true }); hare(t, FINISH + 300, GROUND, 0.85, { face: 'happy', pose: 'clap', flip: true }); },
    ui: (t) => { if (t > sl && t < le) label('SLOW & STEADY!', 540, 1330, t, sl, { size: 64 }); if (t > le && t < ng) label('STEP BY STEP', 540, 1330, t, le, { size: 64, bg: '#D6E4FF' });
      if (t > ng) label('NEVER GIVE UP!', 540, 1330, t, ng, { size: 64, bg: GOLD }); lot(t, 0.3, 'clap', 900, 560, 120); } }); });
