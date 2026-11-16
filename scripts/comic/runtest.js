// Run-cycle test: 8 drawn poses (one sprite-sheet generation) at 12 fps, scrolling corridor, camera tracking, motion lines, shadow.
const q = new URLSearchParams(location.search), W = +(q.get('w') || 540), H = +(q.get('h') || 960);
const cv = document.getElementById('cv'), o = cv.getContext('2d'); cv.width = 1080; cv.height = 1920; cv.style.width = W + 'px'; cv.style.height = H + 'px';
const load = s => new Promise(r => { const i = new Image(); i.onload = () => r(i); i.src = s; });
const BG = await load('/scripts/comic/ep229/corridor.jpg'), RUN = await Promise.all([0, 1, 2, 3, 4, 5, 6, 7].map(i => load(`/scripts/comic/ep229/run_${i}.png`)));
const hash = n => { const x = Math.sin(n * 127.1) * 43758.5453; return x - Math.floor(x); };
window.seek = async function (t) {
  o.fillStyle = '#05060c'; o.fillRect(0, 0, 1080, 1920);
  // corridor band: scaled to 1920 tall? keep it as a wide strip filling the frame height via zoom
  const k = 1920 / BG.height, bw = BG.width * k, speed = 900, x = -((t * speed) % bw);
  for (let i = -1; i < 3; i++) o.drawImage(BG, x + i * bw, 0, bw, 1920);
  // runner: frame at 12 fps, bob, shadow
  const f = Math.floor(t * 12) % 8, im = RUN[f], s = 3.1, w = im.width * s, h = im.height * s, cx = 470, floor = 1640, bob = Math.abs(Math.sin(t * 12 / 8 * Math.PI * 2)) * 18;
  o.save(); o.globalAlpha = .45; o.fillStyle = '#000'; o.beginPath(); o.ellipse(cx, floor + 8, w * .3, 26, 0, 0, 7); o.fill(); o.restore();
  o.drawImage(im, cx - w / 2, floor - h - bob, w, h);
  // speed lines
  o.strokeStyle = 'rgba(255,255,255,.18)'; o.lineWidth = 4; for (let i = 0; i < 14; i++) { const y = 200 + hash(i) * 1500, len = 120 + hash(i + 3) * 260, xx = 1080 - ((t * 2400 + hash(i + 7) * 1500) % 1500); o.beginPath(); o.moveTo(xx, y); o.lineTo(xx + len, y); o.stroke(); }
  const v = o.createRadialGradient(540, 960, 520, 540, 960, 1240); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, 'rgba(0,0,0,.55)'); o.fillStyle = v; o.fillRect(0, 0, 1080, 1920);
};
window.END = 4;
window.ready = true;
