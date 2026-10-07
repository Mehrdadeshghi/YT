// Wiki Roulette #107 — STORY TIME: "The Clever Monkey" (the monkey and the crocodile, an old fable from India — Panchatantra / Jataka).
// Kids special: bright picture-book world drawn in code (island, apple tree, river), original cartoon monkey + crocodiles,
// a family member's cloned voice telling the story, every action synced to the spoken word (sw()).
// Retention plan for kids: question in frame 1 (can a little monkey trick a big crocodile?) → friendship (apples) →
// danger (the wife wants the heart) → cliffhanger in the middle of the river → the trick → safe + laugh → moral → subscribe.
const N = 9, SKY1 = '#7FD3F7', SKY2 = '#D9F4FF', SEA1 = '#2BA8D8', SEA2 = '#11709E', SAND = '#F5D58A', LEAF = '#3DBA4E', LEAF2 = '#2E9A3E';
const BROWN = '#8B5A2B', TAN = '#F0CFA0', CROC = '#4CAF50', CROC2 = '#2F8F3A', WIFE = '#3FB58A', WIFE2 = '#25875F', APPLE = '#E8262B';
const st = (p, col, lw = 7) => { g.lineJoin = 'round'; g.lineCap = 'round'; g.fillStyle = col; g.fill(p); g.lineWidth = lw; g.strokeStyle = INK; g.stroke(p); };
const P2 = () => new Path2D();
const ease = (x) => { x = clamp(x); return x * x * (3 - 2 * x); };
const arc = (t, t0, dur, x0, y0, x1, y1, h) => { const u = ease((t - t0) / dur); return [lerp(x0, x1, u), lerp(y0, y1, u) - Math.sin(Math.PI * u) * h, u]; };
const blinkK = (t, seed) => { const ph = (t + seed * 1.7) % 3.4; return ph < 0.12 ? Math.abs(ph - 0.06) / 0.06 : 1; };

// ---------- world ----------
function sky(t) { const gr = g.createLinearGradient(0, -400, 0, 1000); gr.addColorStop(0, SKY1); gr.addColorStop(1, SKY2); g.fillStyle = gr; g.fillRect(-1500, -1200, 4200, 2300);
  g.save(); g.translate(880, 250); g.rotate(t * 0.25); g.fillStyle = '#FFE36B';
  for (let k = 0; k < 12; k++) { g.rotate(Math.PI / 6); g.beginPath(); g.moveTo(-14, 120); g.lineTo(0, 175); g.lineTo(14, 120); g.fill(); } g.restore();
  st(circ(880, 250, 95), '#FFD93D', 6);
  [[160, 230, 1], [620, 140, 0.8], [1250, 300, 0.9], [-300, 200, 1.1]].forEach(([x, y, s], k) => { const xx = ((x + t * 18 * (k % 2 ? 1 : 0.6)) % 1900 + 1900) % 1900 - 400;
    g.save(); g.translate(xx, y); g.scale(s, s); const p = P2(); [[-70, 10, 50], [-10, -15, 65], [60, 10, 50], [0, 20, 55]].forEach(([a, b, r]) => p.arc(a, b, r, 0, 6.283)); g.fillStyle = '#FFFFFF'; g.fill(p); g.restore(); }); }
function sea(t, y0 = 1000, front = false) {
  const gr = g.createLinearGradient(0, y0, 0, y0 + 950); gr.addColorStop(0, front ? 'rgba(43,168,216,0.82)' : SEA1); gr.addColorStop(1, front ? 'rgba(17,112,158,0.9)' : SEA2);
  const p = P2(); p.moveTo(-1500, y0 + 40); for (let x = -1500; x <= 2700; x += 30) p.lineTo(x, y0 + Math.sin(x / 70 + t * 2.2) * 9 + (front ? 30 : 0)); p.lineTo(2700, y0 + 1300); p.lineTo(-1500, y0 + 1300); p.closePath();
  g.fillStyle = gr; g.fill(p); if (!front) { g.strokeStyle = 'rgba(255,255,255,0.6)'; g.lineWidth = 5;
    for (let k = 0; k < 9; k++) { const x = ((k * 260 + t * 40) % 2400) - 900, y = y0 + 90 + (k % 3) * 110; g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + 30, y - 18, x + 60, y); g.stroke(); } }
  else { g.strokeStyle = 'rgba(255,255,255,0.75)'; g.lineWidth = 6; g.beginPath(); for (let x = -1500; x <= 2700; x += 30) { const y = y0 + 30 + Math.sin(x / 70 + t * 2.2) * 9; x === -1500 ? g.moveTo(x, y) : g.lineTo(x, y); } g.stroke(); } }
function apple(x, y, r = 26, rot = 0) { g.save(); g.translate(x, y); g.rotate(rot); const p = P2(); p.moveTo(0, -r * 0.7);
  p.bezierCurveTo(r * 0.9, -r * 1.25, r * 1.35, r * 0.2, 0, r); p.bezierCurveTo(-r * 1.35, r * 0.2, -r * 0.9, -r * 1.25, 0, -r * 0.7); st(p, APPLE, 5);
  g.fillStyle = 'rgba(255,255,255,0.55)'; g.beginPath(); g.ellipse(-r * 0.4, -r * 0.2, r * 0.18, r * 0.3, -0.4, 0, 6.283); g.fill();
  g.strokeStyle = INK; g.lineWidth = 5; g.beginPath(); g.moveTo(0, -r * 0.7); g.lineTo(r * 0.1, -r * 1.15); g.stroke();
  const lf = P2(); lf.ellipse(r * 0.45, -r * 1.05, r * 0.36, r * 0.16, -0.5, 0, 6.283); st(lf, LEAF, 4); g.restore(); }
function heart(x, y, r, col = '#FF3B5C', t = 0) { const s = 1 + 0.08 * Math.sin(t * 9); g.save(); g.translate(x, y); g.scale(s, s); const p = P2(); p.moveTo(0, r * 0.35);
  p.bezierCurveTo(-r * 1.3, -r * 0.5, -r * 0.5, -r * 1.35, 0, -r * 0.55); p.bezierCurveTo(r * 0.5, -r * 1.35, r * 1.3, -r * 0.5, 0, r * 0.35);
  p.lineTo(0, r * 0.95); st(p, col, 6); g.restore(); }
function heartIcon(x, y, r, col = '#FF3B5C', t = 0) { const s = 1 + 0.08 * Math.sin(t * 9); g.save(); g.translate(x, y); g.scale(s, s); const p = P2();
  p.moveTo(0, r); p.bezierCurveTo(-r * 1.6, -r * 0.1, -r * 0.8, -r * 1.3, 0, -r * 0.45); p.bezierCurveTo(r * 0.8, -r * 1.3, r * 1.6, -r * 0.1, 0, r); st(p, col, 6);
  g.fillStyle = 'rgba(255,255,255,0.5)'; g.beginPath(); g.ellipse(-r * 0.5, -r * 0.45, r * 0.18, r * 0.28, -0.6, 0, 6.283); g.fill(); g.restore(); }
const APPLES = [[-150, -70], [-40, -170], [110, -120], [160, 10], [-170, 60], [20, -40], [70, 90]];
function island(t, o = {}) { const x = o.x ?? 300, y = 1000;
  const p = P2(); p.moveTo(x - 380, y + 30); p.quadraticCurveTo(x, y - 170, x + 380, y + 30); p.closePath(); st(p, SAND, 7);
  const gp = P2(); gp.moveTo(x - 260, y - 40); gp.quadraticCurveTo(x, y - 175, x + 260, y - 40); gp.quadraticCurveTo(x, y - 95, x - 260, y - 40); st(gp, LEAF, 6);
  const tr = P2(); tr.moveTo(x - 40, y - 90); tr.quadraticCurveTo(x - 10, y - 330, x - 30, y - 470); tr.lineTo(x + 30, y - 470); tr.quadraticCurveTo(x + 20, y - 330, x + 45, y - 90); tr.closePath(); st(tr, '#9C6B3C', 7);
  const br = P2(); br.moveTo(x + 10, y - 360); br.quadraticCurveTo(x + 120, y - 390, x + 175, y - 455); g.lineWidth = 34; g.strokeStyle = INK; g.lineCap = 'round'; g.stroke(br); g.lineWidth = 22; g.strokeStyle = '#9C6B3C'; g.stroke(br);
  const cy = y - 640, sw2 = Math.sin(t * 1.3) * 4, cp = P2(); [[-170, 40, 150], [0, -60, 190], [170, 30, 150], [-90, 120, 130], [100, 120, 130], [0, 60, 150]].forEach(([a, b, r]) => { cp.moveTo(x + a + sw2 + r, cy + b); cp.arc(x + a + sw2, cy + b, r, 0, 6.283); });
  g.lineWidth = 14; g.strokeStyle = INK; g.stroke(cp); g.fillStyle = LEAF; g.fill(cp);
  g.fillStyle = LEAF2; [[-120, 80, 60], [90, -40, 70], [140, 110, 50], [-40, -110, 55]].forEach(([a, b, r]) => { g.beginPath(); g.arc(x + a + sw2, cy + b, r, 0, 6.283); g.fill(); });
  APPLES.forEach(([a, b], k) => { if (o.taken && o.taken(k)) return; const gl = o.glint && t > o.glint && t < o.glint + 0.6 ? 1 + 0.25 * Math.sin((t - o.glint) * 20) : 1; apple(x + a + sw2, cy + b, 26 * gl); });
  if (o.palm !== false) { const px = x + 300; const pt = P2(); pt.moveTo(px - 14, y - 10); pt.quadraticCurveTo(px + 40, y - 150, px + 20, y - 250); pt.lineTo(px + 40, y - 250); pt.quadraticCurveTo(px + 60, y - 150, px + 12, y - 10); st(pt, '#B07A45', 5);
    for (let k = 0; k < 5; k++) { const a = -2.6 + k * 0.55 + Math.sin(t * 1.5 + k) * 0.05; const lf = P2(); lf.ellipse(px + 30 + Math.cos(a) * 70, y - 255 + Math.sin(a) * 40, 80, 20, a, 0, 6.283); st(lf, LEAF, 5); } } }
// river home of the crocodiles: reeds + lily pads
function riverHome(t) { sky(t); sea(t, 820);
  for (let k = 0; k < 9; k++) { const x = 40 + k * 130 + (k % 2) * 40, h = 220 + (k % 3) * 70, sw2 = Math.sin(t * 1.6 + k) * 10; g.strokeStyle = INK; g.lineWidth = 14; g.lineCap = 'round';
    g.beginPath(); g.moveTo(x, 860); g.quadraticCurveTo(x + sw2, 860 - h / 2, x + sw2 * 2, 860 - h); g.stroke(); g.strokeStyle = '#5DAA3A'; g.lineWidth = 8; g.stroke();
    st(ell(x + sw2 * 2, 860 - h, 13, 38), '#8A5A2E', 5); }
  [[200, 1350], [820, 1450], [520, 1600]].forEach(([x, y], k) => { const p = P2(); p.ellipse(x, y + Math.sin(t * 2 + k) * 5, 90, 34, 0, 0.35, 6.0); p.lineTo(x, y); p.closePath(); st(p, '#59C13E', 5); }); }

// ---------- cast (original characters, drawn in code) ----------
// monkey: feet at (x, y); s = 1 ≈ 300 px; o: { face: happy|laugh|shock|smart|scared|think, arms: down|wave|up|hold|chest|throw, flip, apple, look:[dx,dy], sit }
function monkey(t, x, y, s, o = {}) {
  const face = o.face || 'happy', bob = Math.sin(t * 4) * 4 * (o.still ? 0 : 1);
  g.save(); g.translate(x, y + bob); g.scale(s * (o.flip ? -1 : 1), s); g.rotate(o.tilt || 0);
  const tail = P2(); tail.moveTo(30, -60); tail.bezierCurveTo(140, -40, 150, -170, 95, -175); tail.bezierCurveTo(60, -178, 70, -130, 100, -135);
  g.lineCap = 'round'; g.lineWidth = 30; g.strokeStyle = INK; g.stroke(tail); g.lineWidth = 18; g.strokeStyle = BROWN; g.stroke(tail);
  st(ell(-34, -16, 30, 20), BROWN, 6); st(ell(34, -16, 30, 20), BROWN, 6);
  st(ell(0, -95, 62, 78), BROWN); st(ell(0, -85, 40, 54), TAN, 5);
  const ARMS = { down: [[-58, -120, -70, -45], [58, -120, 70, -45]], wave: [[-58, -120, -70, -45], [58, -120, 95 + Math.sin(t * 12) * 18, -235]], up: [[-58, -120, -110, -235], [58, -120, 110, -235]],
    hold: [[-58, -120, -30, -95], [58, -120, 30, -95]], chest: [[-58, -120, -15, -110], [58, -120, 70, -45]], throw: [[-58, -120, -70, -45], [58, -120, 120, -230]], think: [[-58, -120, -70, -45], [58, -120, 25, -175]] };
  (ARMS[o.arms || 'down']).forEach(([a, b, c, d]) => { const p = P2(); p.moveTo(a, b); p.quadraticCurveTo((a + c) / 2 + (a < 0 ? -25 : 25), (b + d) / 2, c, d);
    g.lineWidth = 32; g.strokeStyle = INK; g.stroke(p); g.lineWidth = 20; g.strokeStyle = BROWN; g.stroke(p); st(circ(c, d, 16), TAN, 5); });
  if (o.apple) apple((ARMS[o.arms || 'down'])[1][2], (ARMS[o.arms || 'down'])[1][3] - 26, 26);
  if (o.heart) heartIcon(0, -110, 30, '#FF3B5C', t);
  // head
  st(circ(-74, -215, 28), BROWN, 6); st(circ(74, -215, 28), BROWN, 6); st(circ(-74, -215, 15), TAN, 0); st(circ(74, -215, 15), TAN, 0);
  st(circ(0, -215, 74), BROWN); const m = P2(); m.ellipse(0, -192, 54, 44, 0, 0, 6.283); m.ellipse(-24, -228, 27, 26, 0, 0, 6.283); m.ellipse(24, -228, 27, 26, 0, 0, 6.283); g.fillStyle = TAN; g.fill(m);
  const bl = o.closed ? 0.15 : blinkK(t, 1), [lx, ly] = o.look || [0, 0];
  [-24, 24].forEach((ex) => { g.save(); g.translate(ex, -228); g.scale(1, bl); g.fillStyle = '#FFF'; g.beginPath(); g.ellipse(0, 0, 14, 17, 0, 0, 6.283); g.fill(); g.lineWidth = 4; g.strokeStyle = INK; g.stroke();
    g.fillStyle = INK; g.beginPath(); g.arc(lx * 5, ly * 5 + 2, face === 'shock' || face === 'scared' ? 5 : 8, 0, 6.283); g.fill(); g.fillStyle = '#FFF'; g.beginPath(); g.arc(lx * 5 + 3, ly * 5 - 2, 2.5, 0, 6.283); g.fill(); g.restore(); });
  g.fillStyle = 'rgba(255,120,120,0.45)'; g.beginPath(); g.ellipse(-42, -192, 12, 8, 0, 0, 6.283); g.ellipse(42, -192, 12, 8, 0, 0, 6.283); g.fill();
  g.fillStyle = INK; g.beginPath(); g.arc(-7, -200, 3.5, 0, 6.283); g.arc(7, -200, 3.5, 0, 6.283); g.fill();
  g.lineWidth = 5; g.strokeStyle = INK; g.lineCap = 'round';
  if (face === 'happy') { g.beginPath(); g.arc(0, -186, 20, 0.2, Math.PI - 0.2); g.stroke(); }
  else if (face === 'laugh') { const p = P2(); p.moveTo(-26, -184); p.quadraticCurveTo(0, -140 - Math.abs(Math.sin(t * 14)) * 8, 26, -184); p.closePath(); st(p, '#C0392B', 5); }
  else if (face === 'shock' || face === 'scared') { st(ell(0, -170, 13, 17 + (face === 'scared' ? Math.sin(t * 30) * 2 : 0)), '#7A1F1F', 5);
    if (face === 'scared') { g.fillStyle = '#9EE0FF'; g.beginPath(); g.ellipse(58, -250 + ((t * 60) % 30), 7, 11, 0, 0, 6.283); g.fill(); } }
  else if (face === 'smart') { g.beginPath(); g.moveTo(-18, -180); g.quadraticCurveTo(8, -170, 24, -192); g.stroke(); g.beginPath(); g.moveTo(-38, -258); g.lineTo(-12, -252); g.moveTo(12, -256); g.lineTo(38, -264); g.stroke(); }
  else if (face === 'think') { g.beginPath(); g.moveTo(-14, -178); g.lineTo(14, -182); g.stroke(); }
  g.restore(); }
// crocodile: waterline at (x, y); faces left (flip → right); o: { open 0..1, face: smile|hungry|evil|sad|happy, wife, chomp:[t0..], swim }
function croc(t, x, y, s, o = {}) {
  const C1 = o.wife ? WIFE : CROC, C2 = o.wife ? WIFE2 : CROC2, sw2 = Math.sin(t * 3) * (o.swim ? 1 : 0.3);
  let open = o.open ?? 0.15; (o.chomp || []).forEach((c) => { const d = t - c; if (d > 0 && d < 0.45) open = Math.max(open, Math.sin(d / 0.45 * Math.PI)); });
  g.save(); g.translate(x, y + Math.sin(t * 2.2) * 5); g.scale(s * (o.flip ? -1 : 1), s);
  const tl = P2(); tl.moveTo(170, -50); tl.quadraticCurveTo(300, -40 + sw2 * 20, 420, -10 + sw2 * 35); tl.quadraticCurveTo(300, 10, 170, 30); tl.closePath(); st(tl, C1);
  st(ell(0, -10, 205, 72), C1); g.fillStyle = C2; for (let k = 0; k < 7; k++) { const sx = -130 + k * 48; g.beginPath(); g.moveTo(sx - 16, -70); g.lineTo(sx, -98); g.lineTo(sx + 16, -70); g.fill(); g.lineWidth = 4; g.strokeStyle = INK; g.stroke(); }
  // jaws (hinge at -180,-20)
  g.save(); g.translate(-180, -20); g.rotate(open * 0.38);
  const lo = P2(); lo.moveTo(0, 0); lo.lineTo(-215, 8); lo.quadraticCurveTo(-245, 20, -215, 40); lo.lineTo(0, 45); lo.closePath(); st(lo, C1);
  g.fillStyle = '#FFF'; for (let k = 0; k < 6; k++) { const tx = -200 + k * 32; g.beginPath(); g.moveTo(tx, 8); g.lineTo(tx + 9, -10); g.lineTo(tx + 18, 8); g.fill(); g.lineWidth = 3; g.strokeStyle = INK; g.stroke(); }
  g.restore();
  g.save(); g.translate(-180, -20); g.rotate(-open * 0.42);
  if (open > 0.08) { const mo = P2(); mo.moveTo(0, 0); mo.lineTo(-200, 2); mo.lineTo(-200, 10); mo.lineTo(0, 10); g.fillStyle = '#C0392B'; g.fill(mo); }
  const up = P2(); up.moveTo(20, -45); up.lineTo(-210, -30); up.quadraticCurveTo(-262, -18, -228, 6); up.lineTo(0, 6); up.closePath(); st(up, C1);
  st(circ(-232, -26, 9), C2, 4); g.fillStyle = '#FFF'; for (let k = 0; k < 6; k++) { const tx = -205 + k * 32; g.beginPath(); g.moveTo(tx, 6); g.lineTo(tx + 9, 24); g.lineTo(tx + 18, 6); g.fill(); g.lineWidth = 3; g.strokeStyle = INK; g.stroke(); }
  g.restore();
  // eye
  st(circ(-150, -82, 38), C1); const bl = blinkK(t, o.wife ? 2 : 3); g.save(); g.translate(-150, -86); g.scale(1, bl);
  g.fillStyle = '#FFF'; g.beginPath(); g.ellipse(0, 0, 22, 24, 0, 0, 6.283); g.fill(); g.lineWidth = 4; g.strokeStyle = INK; g.stroke();
  g.fillStyle = INK; g.beginPath(); g.ellipse(-4, 2, 6, 13, 0, 0, 6.283); g.fill(); g.restore();
  g.lineWidth = 7; g.strokeStyle = INK; g.lineCap = 'round'; const f = o.face || 'smile';
  if (f === 'evil' || f === 'hungry') { g.beginPath(); g.moveTo(-182, -128); g.lineTo(-122, -108); g.stroke(); }
  else if (f === 'sad') { g.beginPath(); g.moveTo(-178, -106); g.lineTo(-124, -124); g.stroke(); g.fillStyle = '#9EE0FF'; g.beginPath(); g.ellipse(-168, -50 + ((t * 50) % 40), 8, 12, 0, 0, 6.283); g.fill(); }
  else { g.beginPath(); g.arc(-150, -110, 30, Math.PI + 0.5, -0.5); g.stroke(); }
  if (o.wife) { g.lineWidth = 4; [-0.9, -0.5, -0.1].forEach((a) => { g.beginPath(); g.moveTo(-150 + Math.cos(a - 1.4) * 26, -86 + Math.sin(a - 1.4) * 26); g.lineTo(-150 + Math.cos(a - 1.4) * 40, -86 + Math.sin(a - 1.4) * 40); g.stroke(); });
    const b1 = P2(); b1.moveTo(-95, -95); b1.lineTo(-140, -130); b1.lineTo(-140, -70); b1.closePath(); st(b1, '#FF5FA2', 5); const b2 = P2(); b2.moveTo(-95, -95); b2.lineTo(-50, -130); b2.lineTo(-50, -70); b2.closePath(); st(b2, '#FF5FA2', 5); st(circ(-95, -95, 13), '#FF8CC0', 5); }
  g.restore(); }

// ---------- scene plumbing ----------
const S = (f) => (K, Sc) => f()(K, Sc);
function cam(z, fx, fy) { g.translate(540, 900); g.scale(z, z); g.translate(-fx, -fy); }
const zoomTo = (t, a, b, t0, dur) => { const u = ease((t - t0) / dur); return a.map((v, k) => lerp(v, b[k], u)); };
function kscene(i, sp) { return (K) => { K(0.45, 'whoosh', 0.45); (sp.k || []).forEach(([a, b, c, d]) => K(a, b, c, d));
  return (t) => { g.save(); const [z, fx, fy] = sp.cam ? sp.cam(t) : [1, 540, 900]; cam(z, fx, fy); sp.world(t); g.restore();
    if (sp.ui) sp.ui(t); tag(t, i, N); }; }; }
const storyChip = (t) => chip('STORY TIME · THE CLEVER MONKEY', 540, 360, t, -0.3, { size: 26, bg: GOLD, fg: BG });

// hook: the two of them face to face, question in big letters
VIS.open = (K) => { K(0.05, 'pop', 1, 700); K(0.3, 'ding', 0.9); K(sw('trick', 1.2), 'stamp', 1); K(sw('find', 2.2), 'pop', 0.9, 900);
  return (t) => { g.save(); cam(1, 540, 900); sky(t); sea(t); island(t); monkey(t, 470, 545, 0.85, { face: t > sw('find', 2.2) ? 'smart' : 'happy', arms: 'wave', flip: true });
    croc(t, 860, 1060, 0.95, { face: 'hungry', open: 0.3 + 0.2 * Math.sin(t * 5) }); sea(t, 1000, true); g.restore();
    tag(t); hook(t, EP.hook, 470, { size: 120 }); lot(t, 0.5, 'think', 930, 1180, 140); }; };

VIS[0] = S(() => { const isl = sw('island', 2.5), ap = sw('apple', 1.8), mk = sw('monkey', 1.0);
  return kscene(0, { k: [[mk, 'pop', 0.9, 800], [ap, 'ding', 0.9], [isl, 'whoosh', 0.5]],
    cam: (t) => t < isl ? zoomTo(t, [1.0, 540, 900], [1.6, 380, 560], mk - 0.3, 0.8) : zoomTo(t, [1.6, 380, 560], [0.85, 540, 900], isl, 0.7),
    world: (t) => { sky(t); sea(t); island(t, { glint: ap }); monkey(t, 470, 545, 0.85, { face: 'happy', arms: t > mk ? 'wave' : 'down', flip: true }); sea(t, 1000, true); },
    ui: (t) => { storyChip(t); if (t > ap && t < isl) lot(t, ap, 'sparkles', 850, 700, 150); } }); });

VIS[1] = S(() => { const cr = sw('crocodile', 0.9), sm = sw('swam', 1.3), hu = sw('hungry', 2.4);
  return kscene(1, { k: [[sm, 'splash', 0.8], [hu, 'pop', 1, 600], [hu + 0.3, 'thump', 0.8]],
    cam: (t) => zoomTo(t, [1, 540, 900], [1.15, 640, 900], hu - 0.2, 0.5),
    world: (t) => { sky(t); sea(t); island(t); const cx = lerp(1500, 830, ease((t - sm + 0.3) / 1.2)); monkey(t, 470, 545, 0.85, { face: t > hu ? 'shock' : 'happy', look: [1, 0.5], flip: true });
      croc(t, cx, 1060, 1, { face: 'hungry', swim: t < sm + 0.9, open: t > hu ? 0.55 + 0.25 * Math.sin(t * 9) : 0.15 }); sea(t, 1000, true); },
    ui: (t) => { if (t > hu) { bubble(t, hu, 690, 640, "I'M SO HUNGRY!", { size: 54, tx: 720, ty: 900 }); lot(t, hu + 0.1, 'flushed', 930, 470, 120); } } }); });

VIS[2] = S(() => { const th = sw('threw', 0.8), c1 = sw('crunch', 2.0), c2 = sw('crunch', 2.4, 1), c3 = sw('crunch', 2.8, 2), yu = sw('yummy', 3.3);
  return kscene(2, { k: [[th, 'swish', 0.9], [c1, 'crack', 0.7], [c2, 'crack', 0.7], [c3, 'crack', 0.7], [yu, 'ding', 1]],
    cam: (t) => t < c1 - 0.1 ? [1, 540, 900] : zoomTo(t, [1, 540, 900], [1.35, 700, 960], c1 - 0.1, 0.35),
    world: (t) => { sky(t); sea(t); island(t, { taken: (k) => k === 3 && t > th }); monkey(t, 470, 545, 0.85, { face: 'happy', arms: t > th && t < th + 0.5 ? 'throw' : t < th ? 'hold' : 'down', apple: t < th, flip: true });
      croc(t, 830, 1060, 1, { face: t > yu ? 'smile' : 'hungry', chomp: [c1, c2, c3], open: t > th && t < c1 ? 0.9 : 0.12 });
      if (t > th && t < c1) { const [ax, ay] = arc(t, th, c1 - th, 520, 400, 610, 1000, 260); apple(ax, ay, 30, t * 8); }
      sea(t, 1000, true); },
    ui: (t) => { [c1, c2, c3].forEach((c, k) => { if (t > c && t < c + 0.5) burst(t, c, 360 + k * 180, 760 - k * 40, 110, 'CRUNCH!', ['#FFD23D', '#FF8C42', '#7CF27C'][k]); });
      if (t > yu) { bubble(t, yu, 700, 640, 'YUMMY!', { size: 64, tx: 680, ty: 900 }); lot(t, yu + 0.05, 'heart', 900, 470, 130); } } }); });

VIS[3] = S(() => { const wf = sw('wife', 0.9), sweet = sw('sweet', 2.0), hr = sw('heart', 3.0), br = sw('bring', 4.0);
  return kscene(3, { k: [[wf, 'pop', 0.9, 900], [hr, 'ding', 1], [br - 0.4, 'mute', 1, 0.4], [br, 'boom', 1], [br + 0.02, 'thump', 1]],
    cam: (t) => t < br ? zoomTo(t, [1, 540, 900], [1.2, 470, 900], wf, 0.6) : zoomTo(t, [1.2, 470, 900], [1.55, 380, 880], br, 0.3),
    world: (t) => { riverHome(t); croc(t, 820, 900, 0.75, { face: 'smile', flip: false }); croc(t, 380, 930, 0.85, { wife: true, flip: true, face: t > br ? 'evil' : t > hr ? 'hungry' : 'smile', open: t > br ? 0.5 + 0.2 * Math.sin(t * 10) : 0.1 }); sea(t, 820, true); },
    ui: (t) => { if (t > sweet && t < hr) { const k = spring(t - sweet, 300, 14); g.save(); g.translate(400, 560); g.scale(k, k); apple(0, 0, 60); g.restore(); lot(t, sweet, 'sparkles', 520, 470, 120); }
      if (t > hr && t < br) { heartIcon(380, 560, 80, '#FF3B5C', t); lot(t, hr, 'sparkles', 520, 470, 140); }
      if (t > br) { g.save(); g.translate(shake(t, br, 12), 0); burst(t, br, 540, 560, 230, 'HIS HEART!', '#FF5FA2'); g.restore(); } } }); });

VIS[4] = S(() => { const din = sw('dinner', 1.4), jp = sw('jump', 2.2), bk = sw('back', 2.7);
  return kscene(4, { k: [[din, 'pop', 1, 700], [jp, 'swish', 1], [bk + 0.1, 'thump', 0.9]],
    world: (t) => { sky(t); sea(t); island(t); croc(t, 830, 1060, 1, { face: 'smile', open: 0.1 });
      const [mx, my] = t < jp ? [470, 545] : arc(t, jp, 0.8, 470, 545, 800, 990, 200); monkey(t, mx, my, 0.85, { face: t > jp ? 'happy' : 'happy', arms: t > jp && t < jp + 0.8 ? 'up' : 'down', flip: true, still: t > jp });
      sea(t, 1000, true); },
    ui: (t) => { if (t > 0.3 && t < jp) bubble(t, 0.3, 700, 620, t > din - 0.4 ? 'COME FOR DINNER!' : 'HELLO, MONKEY!', { size: 52, tx: 740, ty: 900 }); if (t > jp && t < jp + 1.2) lot(t, jp, 'party', 900, 500, 130); } }); });

VIS[5] = S(() => { const mid = sw('middle', 0.9), sm = sw('smiled', 1.9), wa = sw('wants', 3.0), hr = sw('heart', 3.4);
  return kscene(5, { k: [[0.3, 'splash', 0.6], [hr - 0.45, 'mute', 1, 0.45], [hr, 'boom', 1.2], [hr + 0.02, 'hit', 1.2]],
    cam: (t) => t < hr ? zoomTo(t, [0.8, 540, 900], [1.1, 620, 920], mid, 1.5) : zoomTo(t, [1.1, 620, 920], [1.6, 560, 850], hr, 0.25),
    world: (t) => { sky(t); sea(t); island(t, { x: lerp(200, -500, ease(t / 2.5)) }); const cx = 700;
      croc(t, cx, 1060, 1, { face: t > sm ? 'evil' : 'smile', swim: true, open: t > wa ? 0.35 : 0.1 });
      monkey(t, cx - 10, 990, 0.85, { face: t > hr ? 'scared' : 'happy', arms: t > hr ? 'up' : 'down', flip: false, still: true }); sea(t, 1000, true); },
    ui: (t) => { if (t > wa) bubble(t, wa, 560, 520, 'MY WIFE WANTS YOUR HEART!', { size: 44, tx: 520, ty: 820 });
      if (t > hr) { flash(t, hr, 0.4, 0.1); lot(t, hr, 'scream', 900, 700, 150); } } }); });

VIS[6] = S(() => { const th = sw('thought', 0.6), oh = sw('oh', 1.4), tr = sw('tree', 2.7), bk = sw('back', 3.6);
  return kscene(6, { k: [[th, 'ding', 1], [oh, 'pop', 1, 800], [tr, 'pop', 0.9, 900]],
    cam: (t) => zoomTo(t, [1.6, 560, 850], [1.3, 600, 880], 0, 0.6),
    world: (t) => { sky(t); sea(t); croc(t, 700, 1060, 1, { face: 'evil', swim: true });
      monkey(t, 690, 990, 0.85, { face: t < oh ? 'think' : 'smart', arms: t < oh ? 'think' : 'up', flip: false, still: true }); sea(t, 1000, true); },
    ui: (t) => { if (t > th && t < oh) lot(t, th, 'idea', 760, 560, 160);
      if (t > oh) bubble(t, oh, 540, 520, 'OH NO! MY HEART IS', { size: 50, tx: 560, ty: 760 });
      if (t > tr) { g.save(); g.translate(250, 1250); g.scale(0.38, 0.38); g.translate(-300, -560); island(t, { palm: false }); heartIcon(300, 560, 70, '#FF3B5C', t); g.restore(); chip('…IN THE APPLE TREE!', 540, 640, t, tr, { size: 40, bg: '#FF5FA2', fg: '#FFF' }); } } }); });

VIS[7] = S(() => { const si = sw('silly', 0.5), bk = sw('back', 1.3), jp = sw('jumped', 2.4), sf = sw('safe', 3.4);
  return kscene(7, { k: [[bk, 'splash', 0.7], [jp, 'swish', 1], [jp + 0.75, 'land', 1], [sf, 'stamp', 1.2], [sf + 0.02, 'ding', 1]],
    world: (t) => { sky(t); sea(t); island(t); const cx = lerp(1250, 830, ease((t - 0.2) / Math.max(0.5, jp - 0.4)));
      croc(t, cx, 1060, 1, { face: t > jp + 0.4 ? 'sad' : 'smile', swim: t < jp });
      const [mx, my] = t < jp ? [cx - 10, 990] : arc(t, jp, 0.75, cx - 10, 990, 470, 545, 300); monkey(t, mx, my, 0.85, { face: t > jp ? 'laugh' : 'smart', arms: t > jp && t < jp + 0.75 ? 'up' : 'wave', flip: t > jp + 0.75, still: t < jp });
      sea(t, 1000, true); },
    ui: (t) => { if (t > si && t < jp) chip('SILLY CROCODILE…', 540, 620, t, si, { size: 38, bg: '#FFFFFF', fg: INK }); if (t > sf) { stampText('SAFE!', 540, 700, t, sf, { size: 150, rot: -0.08 }); lot(t, sf + 0.05, 'party', 880, 520, 150); } } }); });

VIS[8] = S(() => { const ha = sw('ha', 0.3), ins = sw('inside', 1.6), nv = sw('never', 2.4);
  return kscene(8, { k: [[ha, 'pop', 1, 900], [ins, 'ding', 1], [nv, 'stamp', 1]],
    cam: (t) => zoomTo(t, [1.25, 470, 700], [1.0, 540, 900], nv - 0.2, 0.6),
    world: (t) => { sky(t); sea(t); island(t); monkey(t, 470, 545, 0.85, { face: 'laugh', arms: t > ins - 0.2 ? 'hold' : 'wave', heart: t > ins - 0.2, flip: true });
      croc(t, 860, 1080, 0.9, { face: 'sad', open: 0.05, flip: true }); sea(t, 1000, true); },
    ui: (t) => { if (t > ha) lot(t, ha, 'lol', 860, 470, 150); if (t > nv) chip('NEVER TRUST A HUNGRY CROCODILE!', 540, 1180, t, nv, { size: 34, bg: GOLD, fg: BG }); } }); });

// moral + subscribe (the CTA segment drives the end card)
VIS[9] = S(() => { const cl = sw('clever', 0.8);
  return kscene(9, { k: [[0.3, 'ding', 1], [cl, 'pop', 1, 900]],
    world: (t) => { sky(t); sea(t); island(t); monkey(t, 470, 545, 0.85, { face: 'happy', arms: 'wave', flip: true }); sea(t, 1000, true); },
    ui: (t) => { if (t > cl) { stampText('BE CLEVER!', 540, 720, t, cl, { size: 130, rot: -0.06 }); lot(t, cl + 0.1, 'brain', 870, 520, 140); } } }); });
