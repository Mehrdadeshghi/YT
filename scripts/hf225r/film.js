// #225, real-footage version: NHTSA crash-test film (public domain, via Wikimedia Commons) as the picture, our animated
// diagrams, labels and a crash clock on top. The clock shows the test camera's own time stamps (1,000 fps cameras).
const q = new URLSearchParams(location.search), W = +(q.get('w') || 540), H = +(q.get('h') || 960);
const cv = document.getElementById('cv'), o = cv.getContext('2d'), vid = document.getElementById('v');
cv.width = 1080; cv.height = 1920; cv.style.width = W + 'px'; cv.style.height = H + 'px';
const D = await (await fetch(q.get('ev') || '/hf/225/ev.json')).json(), EV = D.ev, END = D.dur;
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x)), ss = (a, b, x) => { const u = clamp((x - a) / (b - a)); return u * u * (3 - 2 * u); };
await new Promise(r => vid.readyState >= 1 ? r() : vid.addEventListener('loadedmetadata', r, { once: true }));
// clip offsets in nhtsa.webm (source seconds in the Commons file → concatenated): see scripts/mk225.py
// [t0, t1, clipAt(t0), clipAt(t1), crop centre x0, x1, zoom0, zoom1, src0 (Commons file second at clip start), ms/s of that camera, ms zero second]
const SEG = [
 [0, EV.s_hits + .8, 1.8, 1.8 + EV.s_hits + .8, 560, 520, 1.0, 1.08, 4, 0, 0],
 [EV.s_hits + .8, EV.f_fires - .3, 11, 19, 760, 640, 1.02, 1.12, 29.5, 38, 30.53],
 [EV.f_fires - .3, EV.v_rock, 19.79, 26.63, 860, 860, 1.05, 1.16, 19.79, 19, 20.316],   // this camera is slowed 2x more (interpolated): 19 ms per second
 [EV.v_rock, EV.d_dust - .2, 36.4, 45.8, 820, 800, 1.05, 1.12, 86.6, 39, 87.59],
 [EV.d_dust - .2, EV.u_wall - .5, 45.8, 55.8, 830, 830, 1.02, 1.1, 77, 37.5, 78.2],
 [EV.u_wall - .5, EV.e_fast - .3, 60.3, 67.3, 660, 620, 1.04, 1.12, 130.5, 0, 0],
 [EV.e_fast - .3, END + .2, 67.8, 73.2, 640, 640, 1.0, 1.06, 143, 0, 0],
];
const segAt = t => SEG.findIndex(s => t >= s[0] && t < s[1]);
const clipT = (s, t) => s[2] + (s[3] - s[2]) * clamp((t - s[0]) / (s[1] - s[0]));
async function frameAt(ct) { if (Math.abs(vid.currentTime - ct) < 1e-4 && vid.readyState >= 2) return; await new Promise(r => { vid.addEventListener('seeked', r, { once: true }); vid.currentTime = ct; }); if (vid.requestVideoFrameCallback) await new Promise(r => { let done = false; vid.requestVideoFrameCallback(() => { done = true; r(); }); setTimeout(() => { if (!done) r(); }, 120); }); }
const FX = 0, FY = 285, FW = 1080, FH = 1350;               // footage window (4:5)
function drawFootage(s, t, a = 1) {
  const u = clamp((t - s[0]) / (s[1] - s[0])), z = s[6] + (s[7] - s[6]) * u, cx = s[4] + (s[5] - s[4]) * u, sh = 662 / z, sw = sh * FW / FH, sx = clamp(cx - sw / 2, 0, 1280 - sw), sy = (662 - sh) / 2;   // bottom 58 px hold a burnt-in uploader caption: cropped off
  o.globalAlpha = a; o.imageSmoothingQuality = 'high';
  o.save(); o.filter = 'blur(38px) brightness(.42) saturate(1.2)'; o.drawImage(vid, sx, sy, sw, sh, -120, -120, 1320, 2160); o.restore();
  o.drawImage(vid, sx, sy, sw, sh, FX, FY, FW, FH); o.globalAlpha = 1;
}
const gradEdge = () => { for (const [y0, y1] of [[FY - 2, FY + 140], [FY + FH + 2, FY + FH - 140]]) { const g = o.createLinearGradient(0, y0, 0, y1); g.addColorStop(0, 'rgba(0,0,0,.55)'); g.addColorStop(1, 'rgba(0,0,0,0)'); o.fillStyle = g; o.fillRect(0, Math.min(y0, y1), 1080, Math.abs(y1 - y0)); } };
// ---- type helpers ----
const CAPS = D.caps.flat(), LINES = []; { let cur = []; for (const w of CAPS) { cur.push(w); if (cur.length >= 4 || /[.,?:]$/.test(w.w)) { LINES.push(cur); cur = []; } } if (cur.length) LINES.push(cur); }
function stamp(txt, sub, a, k, col = '#ffc85a', y = 380, size = 120) { if (a <= 0) return; o.save(); o.translate(540, y); o.scale(k, k); o.globalAlpha = a; o.textAlign = 'center'; o.shadowColor = 'rgba(0,0,0,.8)'; o.shadowBlur = 24; o.font = size + 'px AB'; o.fillStyle = col; o.fillText(txt, 0, 0); o.shadowBlur = 0; if (sub) { o.font = '700 38px Inter'; const w = o.measureText(sub).width; o.fillStyle = 'rgba(6,9,16,.72)'; o.beginPath(); o.roundRect(-w / 2 - 22, 36, w + 44, 60, 18); o.fill(); o.fillStyle = '#fff'; o.fillText(sub, 0, 80); } o.restore(); o.globalAlpha = 1; }
function label(x, y, txt, sub, a, right = true) { if (a <= 0) return; const tx = x + (right ? 70 : -70), ty = y - 110; o.globalAlpha = a; o.strokeStyle = '#fff'; o.lineWidth = 3; o.beginPath(); o.moveTo(x, y); o.lineTo(tx, ty); o.stroke(); o.fillStyle = '#fff'; o.beginPath(); o.arc(x, y, 7, 0, 7); o.fill(); o.strokeStyle = '#ffc85a'; o.lineWidth = 3; o.beginPath(); o.arc(x, y, 18 + 6 * Math.sin(Date.now() * 0), 0, 7); o.stroke(); o.textAlign = right ? 'left' : 'right'; const dx = right ? 8 : -8; o.shadowColor = 'rgba(0,0,0,.9)'; o.shadowBlur = 14; o.font = '700 42px Inter'; o.fillStyle = '#ffc85a'; o.fillText(txt, tx + dx, ty - 28); o.font = '500 26px Mono'; o.fillStyle = '#fff'; o.fillText(sub, tx + dx, ty + 6); o.shadowBlur = 0; o.globalAlpha = 1; }
function panel(x, y, w, h, a) { o.globalAlpha = a; o.fillStyle = 'rgba(8,12,20,.82)'; o.beginPath(); o.roundRect(x, y, w, h, 28); o.fill(); o.strokeStyle = 'rgba(255,255,255,.22)'; o.lineWidth = 2; o.stroke(); }
// ---- animated diagrams (drawn, crisp) ----
function diagSensor(t, a) { o.save(); o.translate(540, 300); o.scale(1.08, 1.08); o.translate(-560, -330); diagSensor_(t, a); o.restore(); }
function diagSensor_(t, a) { const X = 560, Y = 330, Wd = 470, Hd = 330; panel(X, Y, Wd, Hd, a); o.font = '500 24px Mono'; o.fillStyle = '#7fd3ff'; o.textAlign = 'left'; o.fillText('ACCELERATION SENSOR', X + 24, Y + 42);
  const hit = ss(EV.s_hits + .6, EV.s_stop, t), sw = Math.sin(clamp((t - EV.s_hits - .6) / 1.2) * Math.PI * 1.5) * hit * (1 - ss(EV.s_unit + 1, EV.f_fires, t));
  const bx = X + 40, by = Y + 80, bw = 190, bh = 150; o.strokeStyle = '#cfd3d8'; o.lineWidth = 4; o.strokeRect(bx, by, bw, bh); const mx = bx + bw / 2 + sw * 55; o.strokeStyle = '#9aa3ad'; o.lineWidth = 3; o.beginPath(); for (let i = 0; i <= 12; i++) { const xx = bx + (mx - 26 - bx) * i / 12, yy = by + bh / 2 + (i % 2 ? -10 : 10) * (i > 0 && i < 12); i ? o.lineTo(xx, yy) : o.moveTo(xx, yy); } o.stroke(); o.fillStyle = sw > .4 ? '#ff6a2a' : '#e8eaed'; o.fillRect(mx - 26, by + bh / 2 - 26, 52, 52); o.fillStyle = '#fff'; o.font = '500 20px Mono'; o.fillText('MASS', bx + 4, by + bh + 30);
  // deceleration trace and threshold
  const gx = X + 260, gy = Y + 80, gw = 185, gh = 150; o.strokeStyle = 'rgba(255,255,255,.3)'; o.lineWidth = 2; o.strokeRect(gx, gy, gw, gh); o.setLineDash([8, 7]); o.strokeStyle = '#ff5a4c'; o.beginPath(); o.moveTo(gx, gy + 50); o.lineTo(gx + gw, gy + 50); o.stroke(); o.setLineDash([]); o.fillStyle = '#ff5a4c'; o.font = '500 18px Mono'; o.fillText('FIRE LEVEL', gx + 6, gy + 42);
  const prog = ss(EV.s_hits + .6, EV.s_unit + .3, t); o.strokeStyle = '#7fd3ff'; o.lineWidth = 4; o.beginPath(); for (let i = 0; i <= 60 * prog; i++) { const f = i / 60, v = Math.exp(-(((f - .45) / .16) ** 2)) * 1.25 + .05 * Math.sin(f * 40); const xx = gx + f * gw, yy = gy + gh - v * (gh - 20); i ? o.lineTo(xx, yy) : o.moveTo(xx, yy); } o.stroke();
  if (t > EV.s_unit) { o.fillStyle = '#ff5a4c'; o.font = '30px AB'; o.fillText('FIRE!', gx + 50, gy + gh + 34); } o.globalAlpha = 1; }
function diagFire(t, a) { o.save(); o.translate(540, 300); o.scale(1.08, 1.08); o.translate(-560, -330); diagFire_(t, a); o.restore(); }
function diagFire_(t, a) { const X = 560, Y = 330, Wd = 470, Hd = 360; panel(X, Y, Wd, Hd, a); o.font = '500 24px Mono'; o.fillStyle = '#7fd3ff'; o.textAlign = 'left'; o.fillText('INSIDE THE STEERING WHEEL', X + 24, Y + 42);
  const cx = X + 120, cy = Y + 210, ign = ss(EV.f_ign - .1, EV.f_ign + .2, t), fill = ss(EV.f_nitro - .3, EV.f_fills + .3, t);
  o.fillStyle = '#9ea2a6'; o.fillRect(cx - 55, cy - 40, 110, 80); o.fillStyle = '#5a5e63'; o.fillRect(cx - 55, cy - 40, 110, 12); o.fillStyle = '#fff'; o.font = '500 19px Mono'; o.textAlign = 'center'; o.fillText('INFLATOR', cx, cy + 70);
  if (ign > 0) { const g = o.createRadialGradient(cx, cy, 2, cx, cy, 60 * ign); g.addColorStop(0, 'rgba(255,240,180,1)'); g.addColorStop(.4, 'rgba(255,120,30,.9)'); g.addColorStop(1, 'rgba(255,60,0,0)'); o.fillStyle = g; o.beginPath(); o.arc(cx, cy, 60 * ign, 0, 7); o.fill(); }
  // bag grows to the right, gas arrows inside
  const r = 30 + 150 * fill; o.fillStyle = 'rgba(236,233,225,.92)'; o.beginPath(); o.ellipse(cx + 60 + r * .55, cy, r * .6, r * .8, 0, 0, 7); o.fill(); o.strokeStyle = '#c8c3b8'; o.lineWidth = 3; o.stroke();
  if (t > EV.f_nitro - .3) { o.strokeStyle = '#4fb8ff'; o.fillStyle = '#4fb8ff'; o.lineWidth = 4; for (let i = 0; i < 4; i++) { const ph = ((t * 1.6 + i / 4) % 1), y0 = cy + (i - 1.5) * 26, x0 = cx + 40, x1 = x0 + 40 + r * .9 * ph; o.globalAlpha = a * (1 - ph * .6); o.beginPath(); o.moveTo(x0, y0); o.lineTo(x1, y0 + (i - 1.5) * 18 * ph); o.stroke(); } o.globalAlpha = a; o.fillStyle = '#4fb8ff'; o.font = '30px AB'; o.textAlign = 'left'; o.fillText('N₂', cx + 70, cy - r * .55 - 8); }
  o.globalAlpha = 1; }
function diagVent(t, a) { o.save(); o.translate(540, 300); o.scale(1.08, 1.08); o.translate(-560, -330); diagVent_(t, a); o.restore(); }
function diagVent_(t, a) { const X = 560, Y = 330, Wd = 470, Hd = 330; panel(X, Y, Wd, Hd, a); o.font = '500 24px Mono'; o.fillStyle = '#7fd3ff'; o.textAlign = 'left'; o.fillText('VENTS', X + 24, Y + 42);
  const cx = X + 220, cy = Y + 190, soft = ss(EV.v_vents, EV.v_sink + .5, t), r = 120 - 22 * soft; o.fillStyle = 'rgba(236,233,225,.92)'; o.beginPath(); o.ellipse(cx, cy, r * .8 + 10 * soft, r * .85, 0, 0, 7); o.fill();
  // head pressing in from the left
  const hx = X + 30 + 70 * soft; o.fillStyle = '#ffb020'; o.beginPath(); o.arc(hx, cy - 10, 42, 0, 7); o.fill(); o.fillStyle = 'rgba(8,12,20,.82)';
  for (const s of [-1, 1]) { const vx = cx + 20, vy = cy + s * (r * .85 - 6); o.fillStyle = '#3c4048'; o.beginPath(); o.arc(vx, vy, 12, 0, 7); o.fill(); if (t > EV.v_vents - .1) { for (let i = 0; i < 3; i++) { const ph = ((t * 1.3 + i / 3) % 1); o.globalAlpha = a * (1 - ph) * .9; o.fillStyle = '#cfd6de'; o.beginPath(); o.arc(vx + 30 * ph, vy + s * 70 * ph, 10 + 22 * ph, 0, 7); o.fill(); } o.globalAlpha = a; } }
  o.globalAlpha = 1; }
let flashUntil = -1;
window.seek = async function (t) {
  const i = segAt(t), s = SEG[Math.max(0, i)];
  o.filter = 'none'; o.globalAlpha = 1; o.fillStyle = '#000'; o.fillRect(0, 0, 1080, 1920);
  // crossfade 0.18 s into each new shot
  const prev = SEG[i - 1], fadeIn = i > 0 ? ss(s[0], s[0] + .18, t) : 1;
  if (prev && fadeIn < 1) { await frameAt(clipT(prev, s[0] - .001)); drawFootage(prev, s[0] - .001, 1); }
  await frameAt(clipT(s, t)); drawFootage(s, t, fadeIn);
  gradEdge();
  // grain
  const fade = ss(0, .12, t) * (1 - ss(END - .15, END, t));
  // crash clock from the test camera's own time stamps
  const ms = s[9] ? (s[8] + (clipT(s, t) - s[2]) - s[10]) * s[9] : null;
  o.font = '500 22px Mono'; o.fillStyle = 'rgba(255,255,255,.85)'; o.textAlign = 'right'; o.fillText('REAL CRASH TEST · NHTSA', 1030, 128);
  if (ms !== null) { const a = ss(s[0], s[0] + .2, t); o.globalAlpha = a; o.fillStyle = 'rgba(6,10,18,.78)'; o.beginPath(); o.roundRect(50, 150, 400, 128, 26); o.fill(); o.textAlign = 'left'; o.fillStyle = '#7fd3ff'; o.font = '500 22px Mono'; o.fillText('TEST CAMERA · 1,000 FPS', 74, 190); o.fillStyle = '#fff'; o.font = '70px AB'; o.fillText((ms < 0 ? '−' : '') + Math.abs(Math.round(ms)) + ' ms', 74, 258); o.globalAlpha = 1; }
  // hook title
  const tA = 1 - ss(EV.o_time - .2, EV.s_hits - .1, t); if (tA > 0) { o.globalAlpha = tA; o.textAlign = 'center'; o.shadowColor = 'rgba(0,0,0,.8)'; o.shadowBlur = 26; o.font = '98px AB'; o.fillStyle = '#ffc85a'; o.fillText('0.04 SECONDS', 540, 330); o.fillStyle = '#fff'; o.fillText('TO SAVE YOU', 540, 440); o.shadowBlur = 0; o.globalAlpha = 1; }
  // diagrams per beat
  const dS = ss(EV.s_sens - .2, EV.s_sens + .1, t) * (1 - ss(EV.f_fires - .5, EV.f_fires - .25, t)); if (dS > 0) diagSensor(t, dS);
  const dF = ss(EV.f_ign - .25, EV.f_ign, t) * (1 - ss(EV.v_rock - .4, EV.v_rock - .1, t)); if (dF > 0) diagFire(t, dF);
  const dV = ss(EV.v_vents - .25, EV.v_vents, t) * (1 - ss(EV.d_dust - .5, EV.d_dust - .2, t)); if (dV > 0) diagVent(t, dV);
  stamp('FIRE?', 'THE CONTROL UNIT DECIDES', ss(EV.s_fire - .05, EV.s_fire + .1, t) * (1 - ss(EV.f_fires - .35, EV.f_fires - .15, t)), 1, '#ff5a4c', 830, 110);
  stamp('20–30 ms', 'TO FILL THE BAG', ss(EV.f_ms - .05, EV.f_ms + .1, t) * (1 - ss(EV.v_rock - .35, EV.v_rock - .1, t)), 1.3 - .3 * ss(EV.f_ms - .05, EV.f_ms + .15, t), '#ffc85a', 830, 120);
  stamp('POWDER', 'CORNSTARCH OR TALC', ss(EV.d_corn - .1, EV.d_corn + .1, t) * (1 - ss(EV.u_wall - .8, EV.u_wall - .55, t)), 1, '#ffffff', 420, 110);
  stamp('14 MPH', 'WALL CRASH: FRONT AIRBAGS MUST FIRE', ss(EV.u_14 - .05, EV.u_14 + .1, t) * (1 - ss(EV.u_never - .3, EV.u_never - .05, t)), 1.3 - .3 * ss(EV.u_14 - .05, EV.u_14 + .15, t), '#ffc85a', 420, 140);
  stamp('NEVER', 'A REAR-FACING CHILD SEAT IN FRONT OF AN AIRBAG', ss(EV.u_never - .05, EV.u_never + .1, t) * (1 - ss(EV.e_fast - .45, EV.e_fast - .2, t)), 1.3 - .3 * ss(EV.u_never - .05, EV.u_never + .15, t), '#ff5a4c', 420, 140);
  // labels on the real footage (hand-placed on the frames)
  label(760, 980, 'AIRBAG', 'FILLING WITH GAS', ss(EV.f_fills - .1, EV.f_fills + .1, t) * (1 - ss(EV.f_ms - .3, EV.f_ms - .05, t)), false);
  label(700, 980, 'DUST', 'POWDER FROM THE BAG', ss(EV.d_dust - .05, EV.d_dust + .15, t) * (1 - ss(EV.d_corn - .2, EV.d_corn, t)), false);
  const fA = ss(EV.e_fast - .15, EV.e_fast + .15, t); if (fA > 0) { o.globalAlpha = fA; o.textAlign = 'center'; o.shadowColor = 'rgba(0,0,0,.8)'; o.shadowBlur = 24; o.font = '76px AB'; o.fillStyle = '#fff'; o.fillText('KNEW IT WAS', 540, 330); o.fillStyle = '#ffc85a'; o.fillText('THIS FAST?', 540, 420); o.shadowBlur = 0;
    for (const [lbl, ts, x, c] of [['YES', EV.e_yes, 340, '#39c98a'], ['NO', EV.e_no, 740, '#ef5a4c']]) { const u = ss(ts - .05, ts + .12, t), k = u > 0 ? 1 + .22 * (1 - u) : .92; o.save(); o.translate(x, 530); o.scale(k, k); o.globalAlpha = fA * (u > 0 ? 1 : .6); o.fillStyle = u > 0 ? c : 'rgba(10,14,22,.78)'; o.beginPath(); o.roundRect(-140, -56, 280, 112, 56); o.fill(); o.fillStyle = '#fff'; o.font = '56px AB'; o.fillText(lbl, 0, 20); o.restore(); }
    o.globalAlpha = fA * ss(EV.e_sub - .05, EV.e_sub + .15, t); o.fillStyle = '#ef2b2b'; o.beginPath(); o.roundRect(350, 645, 380, 84, 42); o.fill(); o.fillStyle = '#fff'; o.font = '700 38px Inter'; o.fillText('SUBSCRIBE', 540, 701); o.globalAlpha = 1; }
  const line = LINES.find(l => t >= l[0].s - .05 && t <= l[l.length - 1].e + .18);
  if (line) { o.font = '700 50px Inter'; o.textAlign = 'left'; const sp = 14, ws = line.map(w => o.measureText(w.w).width), tot = ws.reduce((a, b) => a + b, 0) + sp * (line.length - 1); let x = 540 - tot / 2; const Y = 1720; o.fillStyle = 'rgba(6,9,16,.74)'; o.beginPath(); o.roundRect(540 - tot / 2 - 28, Y - 56, tot + 56, 80, 22); o.fill(); line.forEach((w, i) => { const said = t >= w.s - .02; o.fillStyle = w.k ? (said ? '#ffc85a' : 'rgba(255,200,90,.5)') : (said ? '#fff' : 'rgba(255,255,255,.5)'); o.fillText(w.w, x, Y); x += ws[i] + sp; }); }
  // light film grain + fade
  if (fade < 1) { o.fillStyle = `rgba(0,0,0,${1 - fade})`; o.fillRect(0, 0, 1080, 1920); }
};
window.END = END;
await Promise.all(['700 37px Inter', '500 23px Mono', '84px AB'].map(f => document.fonts.load(f)));
window.ready = true;
