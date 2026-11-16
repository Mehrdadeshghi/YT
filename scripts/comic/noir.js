// "Neon noir" look test for the mini-series SENT TOMORROW: silhouettes with rim light, parallax layers, rain, phone glow, glitch. Pure function of t.
const q = new URLSearchParams(location.search), W = +(q.get('w') || 540), H = +(q.get('h') || 960);
const cv = document.getElementById('cv'), o = cv.getContext('2d'); cv.width = 1080; cv.height = 1920; cv.style.width = W + 'px'; cv.style.height = H + 'px';
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x)), ss = (a, b, x) => { const u = clamp((x - a) / (b - a)); return u * u * (3 - 2 * u); }, lerp = (a, b, u) => a + (b - a) * u;
const hash = n => { const x = Math.sin(n * 127.1) * 43758.5453; return x - Math.floor(x); };
const P = (pts) => { o.beginPath(); pts.forEach((p, i) => i ? o.lineTo(p[0], p[1]) : o.moveTo(p[0], p[1])); o.closePath(); };
const SIL = document.createElement('canvas'); SIL.width = 1080; SIL.height = 1920;
const CY = '#5ef0ff', PK = '#ff3d8b', AMB = '#ffb347';
// smooth closed shape through points (for silhouettes)
function curve(pts) { o.beginPath(); const n = pts.length; for (let i = 0; i < n; i++) { const a = pts[i], b = pts[(i + 1) % n], m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]; if (!i) { const z = pts[n - 1], mz = [(z[0] + a[0]) / 2, (z[1] + a[1]) / 2]; o.moveTo(mz[0], mz[1]); } o.quadraticCurveTo(a[0], a[1], m[0], m[1]); } o.closePath(); }
function rim(col, blur = 26, w = 5) { o.save(); o.shadowColor = col; o.shadowBlur = blur; o.strokeStyle = col; o.lineWidth = w; o.stroke(); o.restore(); }
// --- SHOT 1: city at night through a rain-streaked window, Maya on her bed, phone lights up ---
function shot1(t, u) {
  const cam = { x: lerp(0, -60, u), y: lerp(0, -40, u), z: lerp(1, 1.22, ss(0, 1, u)) };
  const L = (d, fn) => { o.save(); o.translate(540, 960); o.scale(lerp(1, cam.z, d), lerp(1, cam.z, d)); o.translate(-540 + cam.x * d, -960 + cam.y * d); fn(); o.restore(); };
  // sky
  const g = o.createLinearGradient(0, 0, 0, 1920); g.addColorStop(0, '#07051a'); g.addColorStop(.55, '#2a0f45'); g.addColorStop(1, '#5a1a4a'); o.fillStyle = g; o.fillRect(0, 0, 1080, 1920);
  // far skyline with lit windows
  L(.2, () => { for (let i = 0; i < 26; i++) { const x = -200 + i * 62, h = 300 + hash(i) * 520, y = 1150 - h; o.fillStyle = '#120a2c'; o.fillRect(x, y, 58, h + 400); for (let k = 0; k < 40; k++) if (hash(i * 50 + k) > .72) { const on = hash(i * 50 + k + Math.floor(t * .7 + hash(k) * 9)) > .15; o.fillStyle = on ? (hash(k) > .7 ? CY : AMB) : '#1d1240'; o.globalAlpha = .75; o.fillRect(x + 8 + (k % 3) * 16, y + 20 + Math.floor(k / 3) * 34, 9, 14); o.globalAlpha = 1; } } });
  // the window: frame silhouette + rain drops on glass
  L(.55, () => {
    o.save(); o.beginPath(); o.rect(150, 260, 780, 900); o.clip();
    for (let i = 0; i < 70; i++) { const x = 150 + hash(i) * 780, sp = 120 + hash(i + 9) * 260, y = 260 + ((hash(i + 3) * 900 + t * sp) % 900), len = 30 + hash(i + 5) * 70; const gg = o.createLinearGradient(x, y, x, y + len); gg.addColorStop(0, 'rgba(180,220,255,0)'); gg.addColorStop(1, 'rgba(180,220,255,.55)'); o.strokeStyle = gg; o.lineWidth = 2.5; o.beginPath(); o.moveTo(x, y); o.lineTo(x - 4, y + len); o.stroke(); o.fillStyle = 'rgba(200,235,255,.6)'; o.beginPath(); o.arc(x - 4, y + len, 3.5, 0, 7); o.fill(); }
    o.restore();
    o.fillStyle = '#05030c'; o.fillRect(100, 210, 880, 50); o.fillRect(100, 1160, 880, 60); o.fillRect(100, 210, 50, 1010); o.fillRect(930, 210, 50, 1010); o.fillRect(520, 210, 40, 1000); o.fillRect(100, 690, 880, 34);
  });
  // room wall around the window, blinds light stripes on the wall
  L(.8, () => { o.fillStyle = '#0a0612'; o.beginPath(); o.rect(-300, -300, 1700, 2600); o.rect(980, 210, -880, 1010); o.fill('evenodd'); });
  // bed + Maya silhouette (sitting, knees up, looking at phone) with phone rim light
  L(1, () => {
    o.fillStyle = '#05030a'; P([[-200, 1500], [1300, 1430], [1300, 2200], [-200, 2200]]); o.fill(); rim('rgba(255,61,139,.55)', 18, 3);
    // Maya in profile, knees up, phone in both hands: drawn black into a layer, then lit by the phone (cyan) and the city (pink)
    const glow = .75 + .25 * Math.sin(t * 7) * Math.sin(t * 3.1);
    const L2 = SIL.getContext('2d'); L2.clearRect(0, 0, 1080, 1920); L2.fillStyle = '#020106'; L2.strokeStyle = '#020106'; L2.lineJoin = L2.lineCap = 'round';
    const lp = pts => { L2.beginPath(); pts.forEach((p, k) => k ? L2.lineTo(p[0], p[1]) : L2.moveTo(p[0], p[1])); L2.closePath(); L2.fill(); };
    const cp = pts => { L2.beginPath(); const n = pts.length; for (let k = 0; k < n; k++) { const a = pts[k], b = pts[(k + 1) % n], m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]; if (!k) { const z = pts[n - 1]; L2.moveTo((z[0] + a[0]) / 2, (z[1] + a[1]) / 2); } L2.quadraticCurveTo(a[0], a[1], m[0], m[1]); } L2.closePath(); L2.fill(); };
    const bob = Math.sin(t * 1.3) * 3;
    L2.save(); L2.translate(0, bob);
    lp([[420, 890], [455, 862], [500, 858], [535, 875], [552, 905], [556, 935], [568, 958], [584, 978], [567, 987], [570, 998], [561, 1006], [567, 1015], [556, 1024], [553, 1041], [531, 1058], [500, 1063], [492, 1086], [440, 1080], [416, 1032], [404, 980], [407, 926]]);
    cp([[425, 905], [360, 930], [312, 1010], [300, 1090], [338, 1060], [372, 1000], [410, 960]]);
    L2.restore();
    cp([[452, 1070], [372, 1110], [332, 1250], [322, 1400], [352, 1480], [560, 1505], [700, 1330], [745, 1290], [790, 1330], [812, 1495], [600, 1530], [330, 1530], [290, 1420], [300, 1230], [345, 1120], [430, 1060], [505, 1085], [540, 1180], [560, 1240]]);
    L2.lineWidth = 64; L2.beginPath(); L2.moveTo(440, 1130); L2.lineTo(570, 1250); L2.lineTo(650, 1140); L2.stroke();
    L2.lineWidth = 56; L2.beginPath(); L2.moveTo(470, 1150); L2.lineTo(600, 1235); L2.lineTo(668, 1150); L2.stroke();
    o.save(); o.filter = `drop-shadow(9px -2px 6px rgba(94,240,255,${.95 * glow})) drop-shadow(14px 0 30px rgba(94,240,255,${.6 * glow})) drop-shadow(-6px 0 18px rgba(255,61,139,.55))`; o.drawImage(SIL, 0, 0); o.restore();
    // phone + light onto her face
    const px = 668, py = 1112; o.save(); const lg = o.createRadialGradient(px, py, 5, px, py, 420); lg.addColorStop(0, `rgba(94,240,255,${.5 * glow})`); lg.addColorStop(1, 'rgba(94,240,255,0)'); o.globalCompositeOperation = 'lighter'; o.fillStyle = lg; o.fillRect(px - 450, py - 450, 900, 900); o.restore();
    o.save(); o.translate(px, py); o.rotate(-.75); o.fillStyle = '#e8fdff'; o.shadowColor = CY; o.shadowBlur = 50; o.beginPath(); o.roundRect(-24, -44, 48, 88, 8); o.fill(); o.restore();
  });
  // lightning flash at 1.6 s
  const fl = Math.max(0, 1 - Math.abs(t - 1.6) * 8) + Math.max(0, .6 - Math.abs(t - 1.75) * 10); if (fl > 0) { o.fillStyle = `rgba(200,220,255,${fl * .45})`; o.fillRect(0, 0, 1080, 1920); }
}
// --- SHOT 2: the message, glitching in ---
function shot2(t, u) {
  o.fillStyle = '#04030b'; o.fillRect(0, 0, 1080, 1920);
  const z = lerp(1.05, 1.18, u); o.save(); o.translate(540, 960); o.scale(z, z); o.rotate(lerp(-.03, .02, u)); o.translate(-540, -960);
  o.save(); o.shadowColor = CY; o.shadowBlur = 120; o.fillStyle = '#0f1424'; o.beginPath(); o.roundRect(240, 380, 600, 1160, 80); o.fill(); o.restore();
  o.fillStyle = '#e9f6ff'; o.beginPath(); o.roundRect(266, 406, 548, 1108, 60); o.fill();
  o.fillStyle = '#10131c'; o.textAlign = 'center'; o.font = '700 44px Inter'; o.fillText('Me', 540, 540); o.font = '500 26px Mono'; o.fillStyle = '#7d8496'; o.fillText('your number', 540, 584);
  const a = ss(.15, .3, u);
  if (a > 0) { const gl = u < .45 ? (hash(Math.floor(t * 30)) - .5) * 30 * (1 - u / .45) : 0; for (const [dx, col] of [[-6 + gl, 'rgba(255,61,139,.7)'], [6 - gl, 'rgba(94,240,255,.7)'], [0, '#12141c']]) { o.save(); o.globalAlpha = a; o.translate(dx, 0); o.fillStyle = col === '#12141c' ? '#dfe3ec' : 'rgba(0,0,0,0)'; o.beginPath(); o.roundRect(330, 880, 420, 130, 50); o.fill(); o.fillStyle = col; o.font = '700 46px Inter'; o.fillText('Don’t open', 540, 935); o.fillText('the door.', 540, 990); o.restore(); } }
  const b = ss(.45, .6, u); if (b > 0) { o.globalAlpha = b; o.font = '700 30px Mono'; o.fillStyle = PK; o.fillText('SENT: TOMORROW 11:58 PM', 540, 840); o.globalAlpha = 1; }
  o.restore();
  // scanline glitch bars
  for (let i = 0; i < 6; i++) { if (hash(Math.floor(t * 24) + i) > .7 && u < .5) { const y = hash(i * 7 + Math.floor(t * 24)) * 1920; o.drawImage(cv, 0, y, 1080, 30, (hash(i) - .5) * 60, y, 1080, 30); } }
}
// --- SHOT 3: the door, light under it, two feet stop, KNOCK ---
function shot3(t, u) {
  const knock = [.35, .55], shake = knock.reduce((s, k) => s + Math.max(0, 1 - Math.abs(u - k) * 18), 0);
  const sx = Math.sin(t * 90) * 10 * shake, z = lerp(1, 1.12, u);
  o.save(); o.translate(540 + sx, 960); o.scale(z, z); o.translate(-540, -960);
  const g = o.createLinearGradient(0, 0, 0, 1920); g.addColorStop(0, '#05030b'); g.addColorStop(1, '#170a22'); o.fillStyle = g; o.fillRect(-100, -100, 1300, 2200);
  // door silhouette with frame
  o.fillStyle = '#0d0716'; o.fillRect(240, 260, 600, 1340); o.strokeStyle = '#1d1030'; o.lineWidth = 30; o.strokeRect(225, 245, 630, 1370);
  rim('rgba(255,61,139,.35)', 30, 3);
  // light gap under the door + two foot shadows that slide in and stop
  const gapY = 1600, lg = o.createLinearGradient(0, gapY, 0, gapY + 420); lg.addColorStop(0, 'rgba(255,190,110,.9)'); lg.addColorStop(1, 'rgba(255,190,110,0)'); o.fillStyle = lg; P([[240, gapY], [840, gapY], [1100, gapY + 420], [-20, gapY + 420]]); o.fill();
  o.fillStyle = '#ffd59a'; o.fillRect(240, gapY - 6, 600, 14);
  const fx = lerp(-160, 0, ss(0, .25, u)); o.fillStyle = '#05030b'; for (const x of [420, 580]) { o.fillRect(x + fx, gapY - 6, 80, 14); P([[x + fx, gapY + 8], [x + fx + 80, gapY + 8], [x + fx + 120, gapY + 420], [x + fx - 40, gapY + 420]]); o.globalAlpha = .65; o.fill(); o.globalAlpha = 1; }
  // knob glint
  o.save(); o.shadowColor = AMB; o.shadowBlur = 30; o.fillStyle = '#ffcc80'; o.beginPath(); o.arc(780, 960, 16, 0, 7); o.fill(); o.restore();
  o.restore();
  for (const [k, x, y, r] of [[knock[0], 330, 700, -.12], [knock[1], 700, 1000, .1]]) { const a = ss(k - .01, k + .03, u) * (1 - ss(k + .25, k + .4, u)); if (a <= 0) continue; const s = 1 + .25 * (1 - ss(k, k + .08, u)); o.save(); o.globalAlpha = a; o.translate(x, y); o.rotate(r); o.scale(s, s); o.font = '150px AB'; o.textAlign = 'center'; o.shadowColor = PK; o.shadowBlur = 40; o.fillStyle = '#fff'; o.fillText('KNOCK', 0, 0); o.restore(); }
}
function grade(t) {
  // vignette + film grain
  const v = o.createRadialGradient(540, 960, 500, 540, 960, 1250); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,.7)'); o.fillStyle = v; o.fillRect(0, 0, 1080, 1920);
  const n = Math.floor(t * 24); for (let i = 0; i < 2600; i++) { o.fillStyle = hash(i + n * 3.1) > .5 ? 'rgba(255,255,255,.05)' : 'rgba(0,0,0,.08)'; o.fillRect(hash(i * 1.7 + n) * 1080, hash(i * 2.3 + n) * 1920, 2, 2); }
}
function caption(t, txt, t0, t1) { const a = ss(t0, t0 + .15, t) * (1 - ss(t1 - .15, t1, t)); if (a <= 0) return; o.globalAlpha = a; o.font = '700 52px Inter'; o.textAlign = 'center'; const w = o.measureText(txt).width; o.fillStyle = 'rgba(6,4,14,.75)'; o.beginPath(); o.roundRect(540 - w / 2 - 30, 1660, w + 60, 86, 22); o.fill(); o.fillStyle = '#fff'; o.fillText(txt, 540, 1720); o.globalAlpha = 1; }
const S = [[0, 3.2, shot1], [3.2, 5.2, shot2], [5.2, 7.4, shot3]];
window.seek = async function (t) {
  o.globalAlpha = 1; o.globalCompositeOperation = 'source-over';
  const i = S.findIndex(s => t < s[1]), s = S[i < 0 ? 2 : i]; s[2](t, clamp((t - s[0]) / (s[1] - s[0])));
  // quick flash-cut between shots
  for (const c of [3.2, 5.2]) { const f = Math.max(0, 1 - Math.abs(t - c) * 14); if (f > 0) { o.fillStyle = `rgba(255,255,255,${f * .8})`; o.fillRect(0, 0, 1080, 1920); } }
  grade(t);
  caption(t, 'At 11:58 pm my phone buzzed.', .2, 3.1); caption(t, 'A text. From my own number.', 3.3, 5.1); caption(t, 'Then someone knocked.', 5.4, 7.3);
  o.font = '500 24px Mono'; o.fillStyle = 'rgba(255,255,255,.7)'; o.textAlign = 'left'; o.fillText('SENT TOMORROW · EP 1', 60, 110);
};
window.END = 7.4;
await Promise.all(['700 37px Inter', '500 23px Mono', '84px AB'].map(f => document.fonts.load(f)));
window.ready = true;
