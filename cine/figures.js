// Wiki Roulette — original cartoon cast ("figures") for explainer Shorts.
// All characters here are drawn in code (no third-party characters). Sticker look: thick white outline + shadow.
//   fig(t, tIn, x, y, s, o)  -> pops in at tIn, idles (bob, blink); feet at (x, y); s = scale (1 ≈ 470 px tall)
//   o: { skin, shirt, pants, shoes, hat, hair, beard, face, armL, armR, item, itemL, look:[dx,dy], flip, walk, talk:[t0,t1], frozen, tilt }
//   face: happy | shock | angry | sad | smug | talk | greedy | cry | cold | sleep | wow | evil
//   arm:  down | up | out | point | hold | wave | hips | fist
//   hat:  cap | beanie | hardhat | lab | tyrol | fur | helmet | crown | beret | bun | hair | none
//   item: jackhammer | magnifier | tape | flagIT | flagAT | money | bow | paper | gavel | pole | arrow | sign:<text>
const INK = '#1A1714';
let SK = 0;   // 1 = sticker (outline) pass
function sh(p, col) { g.lineJoin = 'round'; g.lineCap = 'round';
  if (SK) { g.lineWidth = 26; g.strokeStyle = '#FFFFFF'; g.stroke(p); g.fillStyle = '#FFFFFF'; g.fill(p); }
  else { g.fillStyle = col; g.fill(p); g.lineWidth = 6; g.strokeStyle = INK; g.stroke(p); } }
function limb(x0, y0, x1, y1, col, w = 30, mx, my) { const p = new Path2D(); p.moveTo(x0, y0); if (mx != null) p.quadraticCurveTo(mx, my, x1, y1); else p.lineTo(x1, y1);
  g.lineCap = 'round'; g.lineJoin = 'round';
  if (SK) { g.lineWidth = w + 32; g.strokeStyle = '#FFFFFF'; g.stroke(p); }
  else { g.lineWidth = w + 12; g.strokeStyle = INK; g.stroke(p); g.lineWidth = w; g.strokeStyle = col; g.stroke(p); } }
const circ = (x, y, r) => { const p = new Path2D(); p.arc(x, y, r, 0, 6.283); return p; };
const ell = (x, y, rx, ry, rot = 0) => { const p = new Path2D(); p.ellipse(x, y, rx, ry, rot, 0, 6.283); return p; };
const rr = (x, y, w, h, r) => { const p = new Path2D(); p.roundRect(x, y, w, h, r); return p; };
const darker = (hex, k = 0.75) => { const n = parseInt(hex.slice(1), 16); const f = (v) => Math.round(v * k); return `rgb(${f(n >> 16)},${f((n >> 8) & 255)},${f(n & 255)})`; };

const ARM = { down: [92, -150], up: [100, -470], out: [190, -300], point: [215, -330], hold: [70, -215], wave: [125, -455], hips: [70, -190], fist: [120, -420] };
function handPos(kind, side, t) {
  let [hx, hy] = ARM[kind] || ARM.down; hx *= side;
  if (kind === 'wave') { const a = Math.sin(t * 9) * 0.5; hx = side * (70 + 80 * Math.cos(a)); hy = -300 - 150 * Math.cos(a * 0.4) - 20; }
  if (kind === 'fist') hy += Math.sin(t * 14) * 18;
  return [hx, hy];
}
function item(kind, hx, hy, t, side = 1) {
  if (!kind) return; g.save(); g.translate(hx, hy);
  if (kind === 'jackhammer') { const sh2 = Math.sin(t * 70) * 6; g.translate(sh2 * 0.4, sh2);
    sh(rr(-60, -18, 120, 26, 10), '#3A3A3A'); sh(rr(-34, 8, 68, 120, 14), '#F2B705'); sh(rr(-12, 128, 24, 70, 6), '#9AA0A6'); }
  else if (kind === 'magnifier') { limb(0, 0, 40 * side, -50, '#6B4A2B', 14); g.save(); g.translate(65 * side, -85); sh(circ(0, 0, 46), 'rgba(180,225,255,0.55)'); if (!SK) { g.strokeStyle = '#FFFFFF'; g.lineWidth = 6; g.beginPath(); g.arc(-12, -12, 22, 3.6, 4.6); g.stroke(); } g.restore(); }
  else if (kind === 'tape') { sh(rr(-36, -36, 72, 72, 18), '#F2B705'); if (!SK) { g.fillStyle = INK; g.beginPath(); g.arc(0, 0, 14, 0, 6.283); g.fill(); }
    const L = 260 + 40 * Math.sin(t * 2); sh(rr(side > 0 ? 30 : -30 - L, -10, L, 20, 4), '#FFE27A'); if (!SK) for (let k = 30; k < L; k += 26) { g.fillStyle = INK; g.fillRect(side > 0 ? 30 + k : -30 - k, -10, 3, 10); } }
  else if (kind === 'flagIT' || kind === 'flagAT') { limb(0, 40, 0, -230, '#8B6A43', 10); const wv = (u) => Math.sin(t * 6 + u * 4) * 10;
    const cols = kind === 'flagIT' ? ['#009246', '#FFFFFF', '#CE2B37'] : ['#ED2939', '#FFFFFF', '#ED2939'];
    for (let k = 0; k < 3; k++) { const p = new Path2D(); if (kind === 'flagIT') { const x0 = 5 + k * 50; p.moveTo(x0, -230 + wv(k / 3)); p.lineTo(x0 + 50, -230 + wv((k + 1) / 3)); p.lineTo(x0 + 50, -130 + wv((k + 1) / 3)); p.lineTo(x0, -130 + wv(k / 3)); }
      else { const y0 = -230 + k * 34; p.moveTo(5, y0 + wv(0)); p.lineTo(155, y0 + wv(1)); p.lineTo(155, y0 + 34 + wv(1)); p.lineTo(5, y0 + 34 + wv(0)); } p.closePath(); sh(p, cols[k]); } }
  else if (kind === 'money') { const p = new Path2D(); p.moveTo(-50, 0); p.quadraticCurveTo(-70, 110, 0, 115); p.quadraticCurveTo(70, 110, 50, 0); p.quadraticCurveTo(0, -30, -50, 0); sh(p, '#C9A34E'); sh(rr(-22, -34, 44, 26, 8), '#A88437'); if (!SK) text('€', 0, 82, 'ui', 70, INK, { align: 'center' }); }
  else if (kind === 'bow') { const p = new Path2D(); p.moveTo(0, -170); p.quadraticCurveTo(-90 * side, 0, 0, 170); g.lineWidth = SK ? 34 : 14; g.strokeStyle = SK ? '#FFFFFF' : '#7A4E22'; g.stroke(p); if (!SK) { g.lineWidth = 2; g.strokeStyle = '#EEE'; g.beginPath(); g.moveTo(0, -170); g.lineTo(0, 170); g.stroke(); } }
  else if (kind === 'arrow') { limb(-90, 0, 90, 0, '#8B6A43', 8); const p = new Path2D(); p.moveTo(90, -18); p.lineTo(130, 0); p.lineTo(90, 18); p.closePath(); sh(p, '#5A5A5A'); }
  else if (kind === 'paper') { g.rotate(-0.15 * side); sh(rr(-55, -150, 110, 140, 8), '#FFFFFF'); if (!SK) for (let k = 0; k < 5; k++) { g.fillStyle = 'rgba(26,23,20,0.35)'; g.fillRect(-38, -125 + k * 22, 76 - (k % 2) * 20, 6); } }
  else if (kind === 'gavel') { g.rotate(-0.6 + Math.max(0, Math.sin(t * 8)) * 0.6); limb(0, 0, 0, -120, '#7A4E22', 14); sh(rr(-45, -165, 90, 45, 10), '#7A4E22'); }
  else if (kind === 'pole') { limb(0, -60, 10, 230, '#9AA0A6', 10); }
  else if (kind.startsWith('sign:')) { const s2 = kind.slice(5); limb(0, 40, 0, -170, '#8B6A43', 12); g.font = F.ui(44); const w = Math.max(160, g.measureText(s2).width + 50);
    sh(rr(-w / 2, -300, w, 110, 14), '#FFFFFF'); if (!SK) text(s2, 0, -228, 'ui', 44, INK, { align: 'center' }); }
  g.restore();
}
function face(o, t, tl) {
  const f = o.face || 'happy', [lx, ly] = o.look || [0, 0], blink = (Math.sin(t * 1.7 + (o.seed || 0)) > 0.985) || f === 'sleep';
  const talking = (o.talk && t > o.talk[0] && t < o.talk[1]) || f === 'talk';
  g.save(); g.translate(0, -370);
  // eyes
  const big = f === 'shock' || f === 'wow' ? 1.35 : 1;
  for (const sx of [-1, 1]) { const ex = sx * 34;
    if (blink) { g.strokeStyle = INK; g.lineWidth = 6; g.beginPath(); g.moveTo(ex - 18, 0); g.quadraticCurveTo(ex, 10, ex + 18, 0); g.stroke(); continue; }
    if (f === 'greedy') { text('$', ex, 18, 'disp', 54, '#1E9E4A', { align: 'center' }); continue; }
    g.fillStyle = '#FFFFFF'; g.strokeStyle = INK; g.lineWidth = 5; g.beginPath(); g.ellipse(ex, -4, 20 * big, 25 * big, 0, 0, 6.283); g.fill(); g.stroke();
    g.fillStyle = INK; g.beginPath(); g.arc(ex + lx * 8, -2 + ly * 8, (f === 'shock' ? 6 : 10), 0, 6.283); g.fill();
    g.fillStyle = '#FFFFFF'; g.beginPath(); g.arc(ex + lx * 8 - 3, -6 + ly * 8, 3, 0, 6.283); g.fill(); }
  // brows
  g.strokeStyle = INK; g.lineWidth = 8; g.lineCap = 'round';
  const brow = { angry: [14, -14], evil: [14, -14], sad: [-12, 10], cry: [-12, 10], shock: [-6, -6], wow: [-8, -8], smug: [0, -8], cold: [-6, 6] }[f] || [0, 0];
  for (const sx of [-1, 1]) { const by = -40 - (f === 'shock' || f === 'wow' ? 16 : 0); g.beginPath(); g.moveTo(sx * 16, by + brow[0]); g.lineTo(sx * 52, by + (sx > 0 ? brow[1] : brow[1])); g.stroke(); }
  // mouth
  g.translate(0, 52); g.fillStyle = INK; g.strokeStyle = INK; g.lineWidth = 7;
  const open = talking ? 0.35 + 0.65 * Math.abs(Math.sin(t * 17)) : 0;
  if (f === 'shock' || f === 'wow') { g.beginPath(); g.ellipse(0, 6, 18, 28, 0, 0, 6.283); g.fill(); g.fillStyle = '#E86A6A'; g.beginPath(); g.ellipse(0, 22, 10, 8, 0, 0, 6.283); g.fill(); }
  else if (talking) { g.beginPath(); g.ellipse(0, 2, 24, 6 + 18 * open, 0, 0, 6.283); g.fill(); }
  else if (f === 'happy' || f === 'greedy') { g.beginPath(); g.moveTo(-30, -6); g.quadraticCurveTo(0, 34, 30, -6); g.closePath(); g.fill(); g.fillStyle = '#FFFFFF'; g.fillRect(-20, -4, 40, 8); }
  else if (f === 'evil') { g.beginPath(); g.moveTo(-34, -8); g.quadraticCurveTo(0, 26, 34, -8); g.stroke(); }
  else if (f === 'smug') { g.beginPath(); g.moveTo(-22, 4); g.quadraticCurveTo(10, 14, 30, -8); g.stroke(); }
  else if (f === 'angry') { g.fillStyle = '#FFFFFF'; g.beginPath(); g.roundRect(-28, -6, 56, 22, 6); g.fill(); g.stroke(); g.beginPath(); g.moveTo(-28, 5); g.lineTo(28, 5); g.lineWidth = 3; g.stroke(); }
  else if (f === 'sad' || f === 'cry') { g.beginPath(); g.moveTo(-26, 14); g.quadraticCurveTo(0, -10, 26, 14); g.stroke(); }
  else if (f === 'cold') { g.beginPath(); for (let k = 0; k <= 8; k++) g.lineTo(-28 + k * 7, 4 + (k % 2 ? -5 : 5) * (1 + 0.3 * Math.sin(t * 30))); g.stroke(); }
  else if (f === 'sleep') { g.beginPath(); g.ellipse(0, 4, 10, 12, 0, 0, 6.283); g.fill(); }
  g.restore();
  // extras
  if (f === 'shock') { g.fillStyle = '#7CC8FF'; g.beginPath(); const dy = ((t * 1.5) % 1) * 40; g.moveTo(88, -440 + dy); g.quadraticCurveTo(112, -400 + dy, 88, -392 + dy); g.quadraticCurveTo(64, -400 + dy, 88, -440 + dy); g.fill(); }
  if (f === 'angry') { g.save(); g.translate(62, -440); g.strokeStyle = '#E0262A'; g.lineWidth = 7; for (let k = 0; k < 4; k++) { g.rotate(Math.PI / 2); g.beginPath(); g.moveTo(6, 6); g.quadraticCurveTo(10, 18, 22, 20); g.stroke(); } g.restore(); }
  if (f === 'cry') { g.fillStyle = 'rgba(124,200,255,0.85)'; for (const sx of [-1, 1]) { g.beginPath(); g.roundRect(sx * 34 - 8, -350, 16, 40 + ((t * 60) % 30), 8); g.fill(); } }
  if (f === 'happy' || f === 'smug' || f === 'greedy') { g.fillStyle = 'rgba(255,110,110,0.35)'; for (const sx of [-1, 1]) { g.beginPath(); g.ellipse(sx * 58, -330, 16, 9, 0, 0, 6.283); g.fill(); } }
  if (f === 'cold') { g.fillStyle = 'rgba(124,200,255,0.25)'; g.beginPath(); g.arc(0, -370, 95, 0, 6.283); g.fill(); }
  if (f === 'sleep') text('z', 110, -470 - ((t * 30) % 30), 'disp', 50, INK);
}
function hat(o, t) {
  const k = o.hat || 'hair', hc = o.hair || '#4A3020';
  if (k === 'hair') sh((() => { const p = new Path2D(); p.arc(0, -385, 98, Math.PI * 1.05, Math.PI * 1.95); p.quadraticCurveTo(40, -430, -90, -400); p.closePath(); return p; })(), hc);
  else if (k === 'bun') { sh(circ(0, -490, 36), hc); sh((() => { const p = new Path2D(); p.arc(0, -380, 100, Math.PI * 1.02, Math.PI * 1.98); p.closePath(); return p; })(), hc); }
  else if (k === 'cap' || k === 'beanie') { const c = o.hatCol || '#E5533D'; sh((() => { const p = new Path2D(); p.arc(0, -395, 98, Math.PI, 0); p.closePath(); return p; })(), c);
    if (k === 'cap') sh(ell(55, -398, 75, 14, -0.05), darker(c)); else sh(circ(0, -500, 22), '#FFFFFF'); }
  else if (k === 'hardhat') { sh((() => { const p = new Path2D(); p.arc(0, -400, 100, Math.PI, 0); p.closePath(); return p; })(), '#F2B705'); sh(rr(-120, -410, 240, 22, 10), '#E0A800'); }
  else if (k === 'helmet') { sh((() => { const p = new Path2D(); p.arc(0, -400, 102, Math.PI, 0); p.closePath(); return p; })(), o.hatCol || '#2E3A59'); }
  else if (k === 'tyrol') { const c = o.hatCol || '#3E5B3A'; sh(ell(0, -425, 125, 22), c); sh(rr(-62, -505, 124, 85, 30), c); sh(rr(-62, -445, 124, 16, 4), '#8B1E1E');
    const p = new Path2D(); p.moveTo(50, -440); p.quadraticCurveTo(110, -540, 90, -580); p.quadraticCurveTo(80, -520, 40, -450); sh(p, '#E8E2D0'); }
  else if (k === 'fur') { const c = '#6B4A2B'; sh((() => { const p = new Path2D(); for (let a = Math.PI; a <= Math.PI * 2 + 0.01; a += Math.PI / 10) { const r = 104 + (Math.round(a * 10) % 2 ? 10 : 0); p.lineTo(Math.cos(a) * r, -395 + Math.sin(a) * r); } p.closePath(); return p; })(), c);
    if (!SK) { g.strokeStyle = 'rgba(0,0,0,0.25)'; g.lineWidth = 4; for (let k2 = -70; k2 <= 70; k2 += 20) { g.beginPath(); g.moveTo(k2, -420); g.lineTo(k2 + 6, -470); g.stroke(); } } }
  else if (k === 'lab') { sh((() => { const p = new Path2D(); for (let a = 0; a < 6.283; a += 0.6) p.lineTo(Math.cos(a) * 110 + (a < 3.14 ? 0 : 0), -400 + Math.sin(a) * 60 - 20); p.closePath(); return p; })(), '#EDEDED');
    if (!SK) { g.strokeStyle = INK; g.lineWidth = 6; g.fillStyle = 'rgba(255,255,255,0.25)'; for (const sx of [-1, 1]) { g.beginPath(); g.arc(sx * 34, -374, 32, 0, 6.283); g.fill(); g.stroke(); } g.beginPath(); g.moveTo(-2, -374); g.lineTo(2, -374); g.stroke(); } }
  else if (k === 'beret') { sh(ell(-10, -460, 95, 34, -0.15), o.hatCol || '#2E3A59'); }
  else if (k === 'crown') { const p = new Path2D(); p.moveTo(-70, -450); p.lineTo(-70, -530); p.lineTo(-35, -490); p.lineTo(0, -545); p.lineTo(35, -490); p.lineTo(70, -530); p.lineTo(70, -450); p.closePath(); sh(p, '#F2C230'); }
}
function figBody(o, t) {
  const skin = o.skin || '#F2C9A0', shirt = o.shirt || '#3D7BD9', pants = o.pants || '#2E3A59', shoes = o.shoes || '#3A2A1E';
  const wk = o.walk ? Math.sin(t * 9) : 0, bob = o.walk ? Math.abs(Math.cos(t * 9)) * -10 : Math.sin(t * 2.2 + (o.seed || 0)) * 4;
  g.translate(0, bob);
  // legs
  limb(-30, -140, -38 + wk * 40, -18, pants, 34); limb(30, -140, 38 - wk * 40, -18, pants, 34);
  sh(ell(-44 + wk * 40, -10, 34, 16), shoes); sh(ell(44 - wk * 40, -10, 34, 16), shoes);
  // arms behind? (left arm first)
  const [lx, ly] = handPos(o.armL || 'down', -1, t), [rx, ry] = handPos(o.armR || 'down', 1, t);
  limb(-60, -260, lx, ly, shirt, 28, -95, (ly - 260) / 2 - 40);
  // torso
  sh(rr(-74, -290, 148, 170, 58), shirt);
  if (o.fur && !SK) { g.strokeStyle = 'rgba(0,0,0,0.22)'; g.lineWidth = 4; for (let k = -60; k <= 60; k += 18) { g.beginPath(); g.moveTo(k, -270); g.lineTo(k + 8, -140); g.stroke(); } }
  if (o.tie && !SK) { g.fillStyle = o.tie; g.beginPath(); g.moveTo(-10, -282); g.lineTo(10, -282); g.lineTo(14, -190); g.lineTo(0, -170); g.lineTo(-14, -190); g.closePath(); g.fill(); }
  limb(60, -260, rx, ry, shirt, 28, 95, (ry - 260) / 2 - 40);
  sh(circ(lx, ly, 19), skin); sh(circ(rx, ry, 19), skin);
  // head
  if (o.hat === 'bun' || o.hat === 'long') {}
  sh(circ(0, -370, 96), skin);
  if (o.beard) sh((() => { const p = new Path2D(); p.arc(0, -350, 92, 0.15, Math.PI - 0.15); p.quadraticCurveTo(0, -300, 90, -335); p.closePath(); return p; })(), o.beard);
  hat(o, t);
  if (!SK) face(o, t);
  item(o.item, rx, ry, t, 1); item(o.itemL, lx, ly, t, -1);
}
function fig(t, tIn, x, y, s, o = {}) {
  const lt = t - tIn; if (lt < 0) return; const sp = spring(lt, o.k || 260, o.d || 15), out = o.out != null ? clamp((t - o.out) / 0.25) : 0;
  if (out >= 1) return;
  const sc = s * (o.noPop ? 1 : sp) * (1 - out);
  g.save(); g.translate(x + (o.dx ? o.dx(t) : 0), y); g.rotate((o.tilt || 0) + (1 - Math.min(1, sp)) * 0.3);
  g.scale(sc * (o.flip ? -1 : 1), sc);
  g.save(); g.translate(12, 12); g.globalAlpha = 0.25; SK = 1; figBody(o, t); g.restore();   // drop shadow (no blur filter: fast)
  g.globalAlpha = 1; g.save(); SK = 1; figBody(o, t); g.restore(); g.save(); SK = 0; figBody(o, t); g.restore();
  if (o.frozen) { const p = rr(-150, -520, 300, 530, 30); g.fillStyle = 'rgba(170,220,255,0.22)'; g.fill(p); g.lineWidth = 8; g.strokeStyle = 'rgba(230,248,255,0.9)'; g.stroke(p);
    g.strokeStyle = 'rgba(255,255,255,0.7)'; g.lineWidth = 6; g.beginPath(); g.moveTo(-120, -470); g.lineTo(-60, -500); g.moveTo(-125, -430); g.lineTo(-95, -445); g.stroke(); }
  g.restore();
}
// comic speech bubble, tail points to (tx, ty)
function bubble(t, tIn, x, y, str, o = {}) {
  const lt = t - tIn; if (lt < 0 || (o.out != null && t > o.out)) return; const s = spring(lt, 320, 16), size = o.size || 56;
  g.save(); g.font = F.ui(size, 900); const w = g.measureText(str).width + 70, h = size * 1.7;
  g.translate(x, y); g.scale(s, s); g.rotate(o.rot || 0);
  const p = new Path2D(); p.roundRect(-w / 2, -h / 2, w, h, h / 2); const tx = (o.tx ?? x) - x, ty = (o.ty ?? y + 160) - y;
  const tp = new Path2D(); tp.moveTo(-22, h / 2 - 8); tp.lineTo(tx * 0.9, ty * 0.9); tp.lineTo(22, h / 2 - 8); tp.closePath();
  g.shadowColor = 'rgba(0,0,0,0.35)'; g.shadowBlur = 20; g.fillStyle = o.bg || '#FFFFFF'; g.fill(p); g.fill(tp); g.shadowBlur = 0;
  g.lineWidth = 6; g.strokeStyle = INK; g.stroke(p); g.fillStyle = o.bg || '#FFFFFF'; g.fillRect(-20, h / 2 - 12, 40, 10);
  text(str, 0, size * 0.36, 'ui', size, o.fg || INK, { align: 'center' }); g.restore();
}
// comic starburst with a word ("!?", "BOOM")
function burst(t, tIn, x, y, r, str, col = '#FFD23D') {
  const lt = t - tIn; if (lt < 0) return; const s = spring(lt, 340, 14) * (1 + 0.04 * Math.sin(lt * 12));
  g.save(); g.translate(x, y); g.scale(s, s); g.rotate(-0.12); const p = new Path2D();
  for (let k = 0; k < 24; k++) { const a = k / 24 * 6.283, rr2 = k % 2 ? r * 0.7 : r; p.lineTo(Math.cos(a) * rr2, Math.sin(a) * rr2); } p.closePath();
  g.fillStyle = col; g.fill(p); g.lineWidth = 8; g.strokeStyle = INK; g.stroke(p);
  text(str, 0, r * 0.2, 'disp', fit(str, 'disp', r * 0.7, r * 1.3), INK, { align: 'center' }); g.restore();
}
