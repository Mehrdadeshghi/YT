// Comic mini-series look test ("SENT TOMORROW"): flat colours, thick ink lines, halftone shading, panels, phone glow. Pure function of t.
const q = new URLSearchParams(location.search), W = +(q.get('w') || 540), H = +(q.get('h') || 960);
const cv = document.getElementById('cv'), o = cv.getContext('2d'); cv.width = 1080; cv.height = 1920; cv.style.width = W + 'px'; cv.style.height = H + 'px';
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x)), ss = (a, b, x) => { const u = clamp((x - a) / (b - a)); return u * u * (3 - 2 * u); };
const INK = '#120e1a';
// halftone dot pattern for shadows
const dots = (() => { const c = document.createElement('canvas'); c.width = c.height = 14; const g = c.getContext('2d'); g.fillStyle = 'rgba(10,6,20,.55)'; g.beginPath(); g.arc(7, 7, 3.2, 0, 7); g.fill(); return o.createPattern(c, 'repeat'); })();
const path = (pts, close = true) => { o.beginPath(); pts.forEach((p, i) => i ? o.lineTo(p[0], p[1]) : o.moveTo(p[0], p[1])); if (close) o.closePath(); };
const ink = (w = 7) => { o.lineWidth = w; o.strokeStyle = INK; o.lineJoin = 'round'; o.lineCap = 'round'; o.stroke(); };
const fillInk = (c, w = 7) => { o.fillStyle = c; o.fill(); ink(w); };
const blob = (cx, cy, rx, ry, rot = 0) => { o.beginPath(); o.ellipse(cx, cy, rx, ry, rot, 0, 7); };
function shade(fn) { o.save(); fn(); o.clip(); o.fillStyle = dots; o.fillRect(0, 0, 1080, 1920); o.restore(); }
function panel(x, y, w, h, draw, tilt = 0) { o.save(); o.translate(x + w / 2, y + h / 2); o.rotate(tilt); o.translate(-w / 2, -h / 2); o.beginPath(); o.rect(0, 0, w, h); o.save(); o.clip(); draw(w, h); o.restore(); o.lineWidth = 12; o.strokeStyle = INK; o.strokeRect(0, 0, w, h); o.restore(); }
function caption(x, y, txt, w = 760) { o.font = '700 40px Inter'; const lines = []; let cur = ''; for (const word of txt.split(' ')) { const t2 = cur ? cur + ' ' + word : word; if (o.measureText(t2).width > w - 60) { lines.push(cur); cur = word; } else cur = t2; } lines.push(cur); const h = lines.length * 52 + 34; o.fillStyle = '#ffe66b'; o.fillRect(x, y, w, h); o.lineWidth = 7; o.strokeStyle = INK; o.strokeRect(x, y, w, h); o.fillStyle = INK; o.textAlign = 'left'; lines.forEach((l, i) => o.fillText(l, x + 30, y + 58 + i * 52)); }
// --- Maya in bed, lit only by her phone ---
function bedroom(w, h, t) {
  const g = o.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#1b1840'); g.addColorStop(1, '#2c2257'); o.fillStyle = g; o.fillRect(0, 0, w, h);
  // window with city lights + rain
  path([[w * .58, 90], [w * .95, 90], [w * .95, 470], [w * .58, 470]]); fillInk('#0c1230'); for (let i = 0; i < 16; i++) { o.fillStyle = i % 3 ? '#f7c948' : '#59e0ff'; o.fillRect(w * .6 + (i * 37) % (w * .33), 300 + (i * 53) % 150, 14, 22); } o.strokeStyle = 'rgba(160,190,255,.35)'; o.lineWidth = 2; for (let i = 0; i < 30; i++) { const x = w * .58 + ((i * 47 + t * 400) % (w * .37)), y = 90 + ((i * 91 + t * 900) % 380); o.beginPath(); o.moveTo(x, y); o.lineTo(x - 6, y + 26); o.stroke(); } path([[w * .765, 90], [w * .765, 470]], false); ink(6); path([[w * .58, 280], [w * .95, 280]], false); ink(6);
  // bed + blanket
  path([[0, h * .62], [w, h * .55], [w, h], [0, h]]); fillInk('#4b3b8f'); shade(() => path([[0, h * .78], [w, h * .7], [w, h], [0, h]]));
  // Maya: hoodie, hair, face lit from below by the phone
  const cx = w * .42, cy = h * .5, glow = .85 + .15 * Math.sin(t * 9);
  const lg = o.createRadialGradient(cx + 60, cy + 120, 10, cx + 60, cy + 120, 420); lg.addColorStop(0, `rgba(120,220,255,${.55 * glow})`); lg.addColorStop(1, 'rgba(120,220,255,0)'); o.fillStyle = lg; o.fillRect(0, 0, w, h);
  path([[cx - 190, cy + 330], [cx - 150, cy + 130], [cx - 40, cy + 70], [cx + 110, cy + 80], [cx + 200, cy + 190], [cx + 230, cy + 340]]); fillInk('#e2455c'); shade(() => path([[cx - 190, cy + 330], [cx - 150, cy + 130], [cx - 60, cy + 90], [cx - 90, cy + 330]]));
  blob(cx, cy - 20, 118, 138); fillInk('#f2c9a6'); shade(() => { o.beginPath(); o.ellipse(cx, cy - 20, 118, 138, 0, Math.PI * .95, Math.PI * 1.75); o.lineTo(cx, cy - 20); o.closePath(); });
  // hair
  path([[cx - 128, cy - 10], [cx - 135, cy - 120], [cx - 60, cy - 180], [cx + 60, cy - 175], [cx + 135, cy - 100], [cx + 128, cy + 10], [cx + 95, cy - 70], [cx + 20, cy - 110], [cx - 70, cy - 90], [cx - 110, cy - 30]]); fillInk('#1a1426');
  // eyes wide, looking down at the phone
  for (const s of [-1, 1]) { blob(cx + s * 44, cy - 5, 22, 26); fillInk('#ffffff', 5); blob(cx + s * 44 + 4, cy + 6, 10, 12); o.fillStyle = INK; o.fill(); o.fillStyle = '#7fe8ff'; o.beginPath(); o.arc(cx + s * 44 + 7, cy + 2, 3, 0, 7); o.fill(); path([[cx + s * 22, cy - 46], [cx + s * 68, cy - 58]], false); ink(6); }
  blob(cx, cy + 70, 16, 10); fillInk('#5b2230', 5);
  // hands + phone
  const px = cx + 40, py = cy + 150; o.save(); o.translate(px, py); o.rotate(-.18); path([[-62, -100], [62, -100], [62, 100], [-62, 100]]); fillInk('#14121c', 7); path([[-50, -86], [50, -86], [50, 86], [-50, 86]]); o.fillStyle = '#7fe8ff'; o.fill(); o.restore();
  for (const s of [-1, 1]) { blob(px + s * 70, py + 50, 42, 30, s * .4); fillInk('#f2c9a6', 6); }
}
// --- phone close-up: a text from her own number, sent tomorrow ---
function phone(w, h, t) {
  o.fillStyle = '#0b0a14'; o.fillRect(0, 0, w, h); const g = o.createRadialGradient(w / 2, h / 2, 50, w / 2, h / 2, h * .7); g.addColorStop(0, 'rgba(90,200,255,.35)'); g.addColorStop(1, 'rgba(90,200,255,0)'); o.fillStyle = g; o.fillRect(0, 0, w, h);
  o.save(); o.translate(w / 2, h / 2 + 40); o.rotate(.04); const PW = 600, PH = 980; o.beginPath(); o.roundRect(-PW / 2, -PH / 2, PW, PH, 70); fillInk('#17151f', 12); o.beginPath(); o.roundRect(-PW / 2 + 26, -PH / 2 + 26, PW - 52, PH - 52, 50); o.fillStyle = '#f4f6fb'; o.fill();
  o.fillStyle = '#1b1b24'; o.font = '700 40px Inter'; o.textAlign = 'center'; o.fillText('Me', 0, -PH / 2 + 130); o.font = '500 26px Mono'; o.fillStyle = '#8a8fa0'; o.fillText('(your number)', 0, -PH / 2 + 172);
  const a = ss(.3, .6, t); o.globalAlpha = a; o.font = '500 26px Mono'; o.fillStyle = '#ff4d6a'; o.fillText('SENT: TOMORROW, 11:58 PM', 0, -60);
  const k = .8 + .2 * ss(.3, .55, t); o.save(); o.translate(-40, 40); o.scale(k, k); o.beginPath(); o.roundRect(-210, -60, 420, 120, 46); o.fillStyle = '#e4e6ee'; o.fill(); o.lineWidth = 5; o.strokeStyle = INK; o.stroke(); o.fillStyle = '#111'; o.font = '700 44px Inter'; o.textAlign = 'center'; o.fillText('Don’t open the door.', 0, 16); o.restore(); o.globalAlpha = 1; o.restore();
  // speed lines
  o.strokeStyle = 'rgba(255,255,255,.18)'; o.lineWidth = 4; for (let i = 0; i < 40; i++) { const an = i / 40 * 6.283, r0 = 560, r1 = 900; o.beginPath(); o.moveTo(w / 2 + Math.cos(an) * r0, h / 2 + Math.sin(an) * r0); o.lineTo(w / 2 + Math.cos(an) * r1, h / 2 + Math.sin(an) * r1); o.stroke(); }
}
// --- the door: light under it, shadow of two feet, KNOCK KNOCK ---
function door(w, h, t) {
  o.fillStyle = '#211b3d'; o.fillRect(0, 0, w, h); path([[w * .18, h * .08], [w * .82, h * .08], [w * .82, h * .9], [w * .18, h * .9]]); fillInk('#5a3f2e', 10); shade(() => path([[w * .18, h * .08], [w * .4, h * .08], [w * .4, h * .9], [w * .18, h * .9]]));
  for (const [y0, y1] of [[.14, .45], [.52, .84]]) { path([[w * .26, h * y0], [w * .74, h * y0], [w * .74, h * y1], [w * .26, h * y1]]); ink(6); }
  blob(w * .74, h * .5, 22, 22); fillInk('#e8c35a', 6);
  // light line under the door with two foot shadows
  o.fillStyle = '#ffe9a8'; o.fillRect(w * .18, h * .9, w * .64, 18); o.fillStyle = INK; o.fillRect(w * .38, h * .9, 70, 18); o.fillRect(w * .55, h * .9, 70, 18);
  path([[0, h * .9 + 18], [w, h * .9 + 18]], false); ink(8);
  // KNOCK lettering, shaking
  const kn = [[.25, 'KNOCK'], [.55, 'KNOCK']]; for (const [t0, txt] of kn) { const a = ss(t0, t0 + .06, t), sh = (1 - ss(t0, t0 + .3, t)) * 14; if (!a) continue; o.save(); o.translate(w * (t0 < .4 ? .34 : .62) + Math.sin(t * 80) * sh, h * (t0 < .4 ? .3 : .46)); o.rotate(t0 < .4 ? -.12 : .1); o.font = '120px AB'; o.textAlign = 'center'; o.lineWidth = 16; o.strokeStyle = INK; o.strokeText(txt, 0, 0); o.fillStyle = '#ffd23f'; o.fillText(txt, 0, 0); o.restore(); }
}
window.seek = async function (t) {
  o.fillStyle = '#0d0b16'; o.fillRect(0, 0, 1080, 1920);
  const scene = q.get('scene') || 'all';
  if (scene === 'all' || scene === 'a') { panel(40, 120, 1000, 1180, (w, h) => bedroom(w, h, t), -.012); caption(70, 1340, 'At 11:58 pm, I got a text from my own number.', 940); }
  if (scene === 'b') { panel(40, 120, 1000, 1500, (w, h) => phone(w, h, t), .01); caption(70, 1660, 'Sent… tomorrow.', 600); }
  if (scene === 'c') { panel(40, 120, 1000, 1500, (w, h) => door(w, h, t), -.01); caption(70, 1660, 'Then someone knocked.', 700); }
  o.font = '500 22px Mono'; o.fillStyle = 'rgba(255,255,255,.6)'; o.textAlign = 'right'; o.fillText('SENT TOMORROW · EP 1', 1030, 80);
};
window.END = 3;
await Promise.all(['700 37px Inter', '500 23px Mono', '84px AB'].map(f => document.fonts.load(f)));
window.ready = true;
