// Shared drawings for the BODY FACTS (medicine) series. Load after tech.js: ep.scripts ["tech.js", "med.js"].
const MRED = '#FF4D5E', SKIN = '#E9B48F';
const mE = (x) => 1 - Math.pow(1 - clamp(x), 3);
// stylised heart; beat 0..1 pulses the size
function heart(x, y, s, beat = 0, col = MRED, glow = 1) { g.save(); g.translate(x, y); const k = s * (1 + 0.12 * beat); g.scale(k, k);
  g.shadowColor = col; g.shadowBlur = 40 * glow; g.beginPath(); for (let i = 0; i <= 80; i++) { const u = i / 80 * 6.283, hx = 16 * Math.pow(Math.sin(u), 3) * 6.5, hy = -(13 * Math.cos(u) - 5 * Math.cos(2 * u) - 2 * Math.cos(3 * u) - Math.cos(4 * u)) * 6.5; i ? g.lineTo(hx, hy) : g.moveTo(hx, hy); } g.closePath();
  const gr = g.createRadialGradient(-30, -50, 10, 0, 0, 140); gr.addColorStop(0, '#FF8A96'); gr.addColorStop(1, col); g.fillStyle = gr; g.fill(); g.shadowBlur = 0;
  g.strokeStyle = 'rgba(255,255,255,0.35)'; g.lineWidth = 5; g.beginPath(); g.arc(-40, -55, 22, Math.PI * 1.1, Math.PI * 1.6); g.stroke(); g.restore(); }
// beat value for a heartbeat at bpm (sharp spike, slow decay)
const beatAt = (t, bpm) => { const ph = (t * bpm / 60) % 1; return Math.exp(-ph * 9); };
// scrolling ECG trace; flat = 0..1 flattens it
function ecgTrace(x0, x1, y, t, bpm = 75, col = LIME, amp = 90, flat = 0) { const pts = [], per = 60 / bpm, speed = 260;
  for (let x = x0; x <= x1; x += 3) { const tt = (t * speed - (x1 - x)) / speed, ph = ((tt % per) + per) % per / per; let v = 0;
    if (ph > 0.10 && ph < 0.14) v = 0.15 * Math.sin((ph - 0.10) / 0.04 * Math.PI);
    if (ph > 0.18 && ph < 0.20) v = -0.25; if (ph >= 0.20 && ph < 0.23) v = 1; if (ph >= 0.23 && ph < 0.25) v = -0.4;
    if (ph > 0.36 && ph < 0.46) v = 0.25 * Math.sin((ph - 0.36) / 0.10 * Math.PI); pts.push([x, y - v * amp * (1 - flat)]); }
  glowLine(pts, col, 5); glowDot(pts[pts.length - 1][0], pts[pts.length - 1][1], 9, '#FFFFFF'); }
// person silhouette (head + shoulders), lying (rot) or standing
function torso(x, y, s, col = '#33445E', rot = 0, a = 1) { g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s); g.globalAlpha *= a; g.fillStyle = col;
  g.beginPath(); g.arc(0, -170, 70, 0, 6.283); g.fill(); g.beginPath(); g.moveTo(-170, 160); g.quadraticCurveTo(-180, -70, 0, -80); g.quadraticCurveTo(180, -70, 170, 160); g.closePath(); g.fill(); g.restore(); }
// two stacked hands (CPR), pressed by p 0..1
function cprHands(x, y, s, p = 0) { g.save(); g.translate(x, y + p * 26 * s); g.scale(s, s); g.fillStyle = SKIN; g.strokeStyle = '#B97E5E'; g.lineWidth = 4;
  rrect(-70, -40, 140, 70, 30); g.fill(); g.stroke(); rrect(-60, -75, 120, 60, 26); g.fill(); g.stroke(); g.fillStyle = '#C98A66'; g.fillRect(-30, -260, 60, 200); g.fillRect(10, -250, 50, 190); g.restore(); }
// brain (side view) with optional highlighted region (hx, hy, hr) and a wave front (wave 0..1 across)
function brain(x, y, s, t, o = {}) { g.save(); g.translate(x, y); g.scale(s, s);
  g.beginPath(); g.moveTo(-230, 40); g.bezierCurveTo(-260, -120, -120, -210, 10, -200); g.bezierCurveTo(170, -200, 260, -100, 240, 10); g.bezierCurveTo(230, 90, 150, 120, 60, 110);
  g.bezierCurveTo(40, 150, -10, 150, -30, 120); g.bezierCurveTo(-140, 140, -220, 110, -230, 40); g.closePath(); g.save(); g.clip();
  const gr = g.createLinearGradient(0, -200, 0, 140); gr.addColorStop(0, '#F3B7C2'); gr.addColorStop(1, '#D98C9C'); g.fillStyle = gr; g.fillRect(-300, -250, 600, 450);
  g.strokeStyle = 'rgba(150,60,80,0.45)'; g.lineWidth = 6; const r = rng(4); for (let k = 0; k < 14; k++) { const sx = -220 + r() * 440, sy = -180 + r() * 280; g.beginPath(); g.moveTo(sx, sy); for (let j = 0; j < 4; j++) g.quadraticCurveTo(sx + (j + 0.5) * 30, sy + (j % 2 ? -30 : 30), sx + (j + 1) * 30, sy); g.stroke(); }
  if (o.hr) { const p = 0.6 + 0.4 * Math.sin(t * 6); const hg = g.createRadialGradient(o.hx, o.hy, 0, o.hx, o.hy, o.hr); hg.addColorStop(0, `rgba(30,30,40,${0.85 * (o.dark ?? 1)})`); hg.addColorStop(1, 'rgba(30,30,40,0)'); g.fillStyle = hg; g.fillRect(-300, -250, 600, 450);
    if (o.alarm) { g.strokeStyle = `rgba(255,59,78,${p})`; g.lineWidth = 8; g.beginPath(); g.arc(o.hx, o.hy, o.hr * 0.7, 0, 6.283); g.stroke(); } }
  if (o.wave != null) { const wx = -240 + 480 * o.wave; g.strokeStyle = CY; g.lineWidth = 14; g.shadowColor = CY; g.shadowBlur = 30; g.beginPath(); g.moveTo(wx, -220); g.quadraticCurveTo(wx + 40, -40, wx - 10, 150); g.stroke();
    g.fillStyle = 'rgba(62,230,255,0.12)'; g.fillRect(-300, -250, wx + 300, 450); }
  g.restore(); g.strokeStyle = '#8E4458'; g.lineWidth = 6; g.stroke(); g.fillStyle = '#C47A8A'; g.beginPath(); g.ellipse(60, 150, 70, 40, 0.3, 0, 6.283); g.fill(); g.restore(); }
function kidney(x, y, s, col = '#B5464F') { g.save(); g.translate(x, y); g.scale(s, s); g.shadowColor = 'rgba(0,0,0,0.5)'; g.shadowBlur = 30;
  g.beginPath(); g.moveTo(0, -200); g.bezierCurveTo(170, -210, 190, 210, 0, 200); g.bezierCurveTo(-90, 195, -110, 90, -40, 40); g.bezierCurveTo(-10, 15, -10, -15, -40, -40); g.bezierCurveTo(-110, -90, -90, -195, 0, -200); g.closePath();
  const gr = g.createLinearGradient(-100, 0, 160, 0); gr.addColorStop(0, '#7E2A33'); gr.addColorStop(0.5, col); gr.addColorStop(1, '#6A2028'); g.fillStyle = gr; g.fill(); g.shadowBlur = 0;
  g.fillStyle = 'rgba(255,220,200,0.18)'; g.beginPath(); g.ellipse(60, -60, 40, 90, 0.2, 0, 6.283); g.fill(); g.restore(); }
function stone(x, y, r, rot = 0, col = '#E8C77A') { g.save(); g.translate(x, y); g.rotate(rot); g.fillStyle = col; g.strokeStyle = '#8A6A2E'; g.lineWidth = 3; g.beginPath();
  for (let k = 0; k < 9; k++) { const a = k / 9 * 6.283, rr = r * (0.75 + 0.25 * Math.sin(k * 2.7)); k ? g.lineTo(Math.cos(a) * rr, Math.sin(a) * rr) : g.moveTo(Math.cos(a) * rr, Math.sin(a) * rr); } g.closePath(); g.fill(); g.stroke(); g.restore(); }
function virus(x, y, r, t, col = MG, a = 1) { g.save(); g.globalAlpha *= a; g.translate(x, y); g.rotate(t * 0.4); g.strokeStyle = col; g.fillStyle = col; g.lineWidth = r * 0.12;
  for (let k = 0; k < 12; k++) { const an = k / 12 * 6.283; g.beginPath(); g.moveTo(Math.cos(an) * r, Math.sin(an) * r); g.lineTo(Math.cos(an) * r * 1.35, Math.sin(an) * r * 1.35); g.stroke(); g.beginPath(); g.arc(Math.cos(an) * r * 1.4, Math.sin(an) * r * 1.4, r * 0.12, 0, 6.283); g.fill(); }
  g.shadowColor = col; g.shadowBlur = 20; g.beginPath(); g.arc(0, 0, r, 0, 6.283); g.fill(); g.restore(); }
function bacterium(x, y, w, ang, t, col = LIME, a = 1) { g.save(); g.globalAlpha *= a; g.translate(x, y); g.rotate(ang); g.strokeStyle = col; g.lineWidth = 3;
  for (let k = -1; k <= 1; k += 2) { g.beginPath(); for (let i = 0; i <= 20; i++) { const xx = k * (w / 2 + i * 4); i ? g.lineTo(xx, Math.sin(i * 0.8 + t * 8) * 8) : g.moveTo(xx, 0); } g.stroke(); }
  g.fillStyle = col; g.shadowColor = col; g.shadowBlur = 18; rrect(-w / 2, -w * 0.22, w, w * 0.44, w * 0.22); g.fill(); g.restore(); }
// ear canal cross-section: o.wax 0..1 amount, o.flow (wax moving out), o.swab 0..1 (swab pushes in), o.drum flash
function earSection(x, y, s, t, o = {}) { g.save(); g.translate(x, y); g.scale(s, s);
  g.fillStyle = SKIN; g.beginPath(); g.moveTo(-420, -300); g.quadraticCurveTo(-520, 0, -420, 300); g.lineTo(-300, 300); g.quadraticCurveTo(-360, 0, -300, -300); g.closePath(); g.fill();
  g.fillStyle = '#D9A07E'; g.fillRect(-300, -300, 700, 600); g.fillStyle = '#2A1A14'; rrect(-320, -70, 640, 140, 70); g.fill();
  g.strokeStyle = '#F5D9C8'; g.lineWidth = 10; g.beginPath(); g.ellipse(320, 0, 16, 80, 0, 0, 6.283); g.stroke(); if (o.drum) { g.strokeStyle = RED2; g.shadowColor = RED2; g.shadowBlur = 30; g.stroke(); g.shadowBlur = 0; }
  text('EARDRUM', 320, -110, 'mono', 26, '#FFFFFF', { align: 'center' });
  const n = Math.round(14 * (o.wax ?? 1)), r = rng(12); for (let k = 0; k < n; k++) { const base = -200 + r() * 420, dx = o.flow ? -((t * 40 + k * 30) % 140) : 0, sw = o.swab ? o.swab * 220 : 0;
    glowDot(Math.min(300, base + dx + sw * (base < 60 ? 1 : 0.3)), -40 + r() * 80, 12 + r() * 8, '#E2A33D', 0.95); }
  if (o.swab) { const sx = -560 + o.swab * 380; g.fillStyle = '#FFFFFF'; g.fillRect(sx - 360, -8, 360, 16); g.beginPath(); g.ellipse(sx, 0, 40, 26, 0, 0, 6.283); g.fill(); }
  g.restore(); }
function sun(x, y, r, t, col = '#FFC53D', a = 1) { g.save(); g.globalAlpha *= a; g.translate(x, y); g.rotate(t * 0.2); g.strokeStyle = col; g.lineWidth = r * 0.12; g.lineCap = 'round';
  for (let k = 0; k < 12; k++) { const an = k / 12 * 6.283; g.beginPath(); g.moveTo(Math.cos(an) * r * 1.3, Math.sin(an) * r * 1.3); g.lineTo(Math.cos(an) * r * 1.75, Math.sin(an) * r * 1.75); g.stroke(); }
  g.shadowColor = col; g.shadowBlur = 50; g.fillStyle = col; g.beginPath(); g.arc(0, 0, r, 0, 6.283); g.fill(); g.restore(); }
function medNote(t, t0, y = 1190) { if (t > t0) chip('ⓘ GENERAL INFO · NOT MEDICAL ADVICE', 540, y, t, t0, { size: 24, bg: 'rgba(255,255,255,0.88)', fg: BG }); }
function bodyBg(t, c1 = '#1A0610', c2 = '#3A0D1E') { techBg(t, c1, c2); }
// side view: person lying on the floor (head left); chest point = (x - 60 s, y - 70 s)
function lyingBody(x, y, s, col = '#3A4C6E') { g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = 'rgba(255,255,255,0.12)'; g.fillRect(-520, 40, 1040, 6);
  g.fillStyle = col; g.beginPath(); g.arc(-360, -40, 60, 0, 6.283); g.fill(); rrect(-290, -110, 380, 150, 70); g.fill(); rrect(60, -70, 400, 100, 50); g.fill(); g.restore(); }
// rescuer's straight arms from above, hands on the chest at (x, y); p = press 0..1
function cprArms(x, y, s, p = 0) { const yy = y + p * 26 * s; g.save(); g.fillStyle = '#C98A66'; g.strokeStyle = '#8E5A40'; g.lineWidth = 3;
  [[-22, 0], [22, 0]].forEach(([dx]) => { g.beginPath(); g.moveTo(x + dx * s - 22 * s, yy - 40 * s); g.lineTo(x + dx * s * 1.6 - 26 * s, yy - 520 * s); g.lineTo(x + dx * s * 1.6 + 26 * s, yy - 520 * s); g.lineTo(x + dx * s + 22 * s, yy - 40 * s); g.closePath(); g.fill(); g.stroke(); });
  g.fillStyle = SKIN; rrect(x - 60 * s, yy - 50 * s, 120 * s, 56 * s, 26 * s); g.fill(); g.stroke(); g.restore(); if (p > 0.7) shock(x, y + 10, p * 10, 7, 120, GOLD, 3); }
