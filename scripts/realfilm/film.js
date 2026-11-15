// Real-footage Short (house style since 9.11.2026, first used on #225): free real footage (hf/<ep>/clip.webm from scripts/realclip.py) as the
// picture, cropped to a 4:5 window over a blurred copy, with title, test-camera clock, stamps, pointer labels, captions and the YES/NO end card on top.
// Everything is data in episodes/<ep>.json → "real" (see docs in scripts/realclip.py and scripts/hf_real.py). Every frame is a pure function of t.
const q = new URLSearchParams(location.search), W = +(q.get('w') || 540), H = +(q.get('h') || 960);
const evPath = q.get('ev'), base = evPath.replace(/ev\.json$/, '');
const cv = document.getElementById('cv'), o = cv.getContext('2d'), vid = document.getElementById('v');
cv.width = 1080; cv.height = 1920; cv.style.width = W + 'px'; cv.style.height = H + 'px';
const D = await (await fetch(evPath)).json(), EV = D.ev, END = D.dur, R = D.real, CLIP = await (await fetch(base + 'clip.json')).json();
vid.src = base + 'clip.webm';
await new Promise((r, j) => { vid.addEventListener('loadedmetadata', r, { once: true }); vid.addEventListener('error', () => j(new Error('clip.webm failed to load')), { once: true }); });
const VW = vid.videoWidth, VH = vid.videoHeight, CB = R.crop_bottom || 0;
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x)), ss = (a, b, x) => { const u = clamp((x - a) / (b - a)); return u * u * (3 - 2 * u); };
// time expressions: a number, "end", or "<event>±seconds"
const T = x => { if (typeof x === 'number') return x; if (x === 'end') return END; const m = /^([a-z0-9_]+)([+-][\d.]+)?$/i.exec(x); if (!m || EV[m[1]] === undefined) throw new Error('unknown time ' + x); return EV[m[1]] + (+m[2] || 0); };
const SHOTS = R.shots.map(s => ({ ...s, t0: T(s.from), t1: T(s.to) }));
for (let i = 0; i < SHOTS.length; i++) { if (i) SHOTS[i].t0 = SHOTS[i - 1].t1; } SHOTS[SHOTS.length - 1].t1 = END + .3;
const clipT = (s, t) => { const u = clamp((t - s.t0) / (s.t1 - s.t0)); return CLIP.starts[s.span] + s.at[0] + (s.at[1] - s.at[0]) * u; };
async function frameAt(ct) { if (Math.abs(vid.currentTime - ct) < 1e-4 && vid.readyState >= 2) return; await new Promise(r => { vid.addEventListener('seeked', r, { once: true }); vid.currentTime = ct; }); if (vid.requestVideoFrameCallback) await new Promise(r => { let done = false; vid.requestVideoFrameCallback(() => { done = true; r(); }); setTimeout(() => { if (!done) r(); }, 120); }); }
const FY = 285, FW = 1080, FH = 1350;
function drawFootage(s, t, a) {
  const u = clamp((t - s.t0) / (s.t1 - s.t0)), z = (s.zoom || [1, 1.08])[0] + ((s.zoom || [1, 1.08])[1] - (s.zoom || [1, 1.08])[0]) * u, cxs = s.cx || [VW / 2, VW / 2], cx = cxs[0] + (cxs[1] - cxs[0]) * u;
  const avail = VH - CB, sh = avail / z, sw = Math.min(VW, sh * FW / FH), sx = clamp(cx - sw / 2, 0, VW - sw), sy = (avail - sh) / 2;
  o.globalAlpha = a; o.imageSmoothingQuality = 'high';
  o.save(); o.filter = 'blur(38px) brightness(.42) saturate(1.2)'; o.drawImage(vid, sx, sy, sw, sh, -120, -120, 1320, 2160); o.restore();
  o.drawImage(vid, sx, sy, sw, sh, 0, FY, FW, FH); o.globalAlpha = 1;
}
const CAPS = D.caps.flat(), LINES = []; { let cur = []; for (const w of CAPS) { cur.push(w); if (cur.length >= 4 || /[.,?:]$/.test(w.w)) { LINES.push(cur); cur = []; } } if (cur.length) LINES.push(cur); }
function stamp(txt, sub, a, k, col, y, size) { if (a <= 0) return; o.save(); o.translate(540, y); o.scale(k, k); o.globalAlpha = a; o.textAlign = 'center'; o.shadowColor = 'rgba(0,0,0,.8)'; o.shadowBlur = 24; o.font = size + 'px AB'; o.fillStyle = col; o.fillText(txt, 0, 0); o.shadowBlur = 0; if (sub) { o.font = '700 38px Inter'; const w = o.measureText(sub).width; o.fillStyle = 'rgba(6,9,16,.72)'; o.beginPath(); o.roundRect(-w / 2 - 22, 36, w + 44, 60, 18); o.fill(); o.fillStyle = '#fff'; o.fillText(sub, 0, 80); } o.restore(); o.globalAlpha = 1; }
function label(x, y, txt, sub, a, right) { if (a <= 0) return; const tx = x + (right ? 70 : -70), ty = y - 110; o.globalAlpha = a; o.strokeStyle = '#fff'; o.lineWidth = 3; o.beginPath(); o.moveTo(x, y); o.lineTo(tx, ty); o.stroke(); o.fillStyle = '#fff'; o.beginPath(); o.arc(x, y, 7, 0, 7); o.fill(); o.strokeStyle = '#ffc85a'; o.beginPath(); o.arc(x, y, 20, 0, 7); o.stroke(); o.textAlign = right ? 'left' : 'right'; const dx = right ? 8 : -8; o.shadowColor = 'rgba(0,0,0,.9)'; o.shadowBlur = 14; o.font = '700 42px Inter'; o.fillStyle = '#ffc85a'; o.fillText(txt, tx + dx, ty - 28); if (sub) { o.font = '500 26px Mono'; o.fillStyle = '#fff'; o.fillText(sub, tx + dx, ty + 6); } o.shadowBlur = 0; o.globalAlpha = 1; }
const win = (f, t, fi = .15, fo = .2) => { const a = T(f.from), b = T(f.to); return ss(a - .03, a + fi, t) * (1 - ss(b - fo, b, t)); };
window.seek = async function (t) {
  let i = SHOTS.findIndex(s => t >= s.t0 && t < s.t1); if (i < 0) i = SHOTS.length - 1; const s = SHOTS[i];
  o.filter = 'none'; o.globalAlpha = 1; o.fillStyle = '#000'; o.fillRect(0, 0, 1080, 1920);
  const prev = SHOTS[i - 1], fadeIn = i > 0 ? ss(s.t0, s.t0 + .18, t) : 1;
  if (prev && fadeIn < 1) { await frameAt(clipT(prev, s.t0 - .001)); drawFootage(prev, s.t0 - .001, 1); }
  await frameAt(clipT(s, t)); drawFootage(s, t, fadeIn);
  for (const [y0, y1] of [[FY - 2, FY + 140], [FY + FH + 2, FY + FH - 140]]) { const g = o.createLinearGradient(0, y0, 0, y1); g.addColorStop(0, 'rgba(0,0,0,.55)'); g.addColorStop(1, 'rgba(0,0,0,0)'); o.fillStyle = g; o.fillRect(0, Math.min(y0, y1), 1080, Math.abs(y1 - y0)); }
  o.font = '500 22px Mono'; o.fillStyle = 'rgba(255,255,255,.85)'; o.textAlign = 'right'; o.fillText(R.tag || 'REAL FOOTAGE', 1030, 128);
  // optional clock from the source camera's own time stamps: "clock": {"label": "TEST CAMERA · 1,000 FPS", "ms_per_s": 38, "zero": <clip seconds into the span where 0 ms is>}
  if (s.clock) { const ms = (clipT(s, t) - CLIP.starts[s.span] - s.clock.zero) * s.clock.ms_per_s, a = ss(s.t0, s.t0 + .2, t); o.globalAlpha = a; o.fillStyle = 'rgba(6,10,18,.78)'; o.beginPath(); o.roundRect(50, 150, 420, 128, 26); o.fill(); o.textAlign = 'left'; o.fillStyle = '#7fd3ff'; o.font = '500 22px Mono'; o.fillText(s.clock.label || 'TIME', 74, 190); o.fillStyle = '#fff'; o.font = '70px AB'; o.fillText((ms < 0 ? '−' : '') + Math.abs(Math.round(ms)) + ' ' + (s.clock.unit || 'ms'), 74, 258); o.globalAlpha = 1; }
  const hk = D.hook || []; const tA = 1 - ss(T(R.title_until || 'cta') - .3, T(R.title_until || 'cta'), t); if (hk.length && tA > 0) { o.globalAlpha = tA; o.textAlign = 'center'; o.shadowColor = 'rgba(0,0,0,.8)'; o.shadowBlur = 26; o.font = (R.title_size || 96) + 'px AB'; o.fillStyle = '#ffc85a'; o.fillText(hk[0], 540, 330); o.fillStyle = '#fff'; if (hk[1]) o.fillText(hk[1], 540, 330 + (R.title_size || 96) * 1.12); o.shadowBlur = 0; o.globalAlpha = 1; }
  for (const st of R.stamps || []) { const a = win(st, t, .1, .25); if (a > 0) stamp(st.big, st.sub, a, st.pop === false ? 1 : 1.3 - .3 * ss(T(st.from) - .03, T(st.from) + .15, t), st.color || '#ffc85a', st.y || 420, st.size || 120); }
  for (const L of R.labels || []) label(L.x, L.y, L.txt, L.sub, win(L, t), L.side !== 'left');
  // end card
  const cta = D.cta || {}, fA = ss(EV.cta - .15, EV.cta + .15, t); if (fA > 0) { const qq = (cta.q || '').toUpperCase(), cut = qq.lastIndexOf(' ', Math.ceil(qq.length / 2) + 4), l1 = cut > 0 ? qq.slice(0, cut) : qq, l2 = cut > 0 ? qq.slice(cut + 1) : ''; o.globalAlpha = fA; o.textAlign = 'center'; o.shadowColor = 'rgba(0,0,0,.8)'; o.shadowBlur = 24; o.font = '74px AB'; o.fillStyle = '#fff'; o.fillText(l1, 540, 330); o.fillStyle = '#ffc85a'; o.fillText(l2, 540, 420); o.shadowBlur = 0;
    for (const [lbl, ts, x, c] of [[(cta.a || 'YES').toUpperCase(), EV.cta_a, 340, '#39c98a'], [(cta.b || 'NO').toUpperCase(), EV.cta_b, 740, '#ef5a4c']]) { const u = ss(ts - .05, ts + .12, t), k = u > 0 ? 1 + .22 * (1 - u) : .92; o.save(); o.translate(x, 530); o.scale(k, k); o.globalAlpha = fA * (u > 0 ? 1 : .6); o.fillStyle = u > 0 ? c : 'rgba(10,14,22,.78)'; o.beginPath(); o.roundRect(-150, -56, 300, 112, 56); o.fill(); o.fillStyle = '#fff'; o.font = (lbl.length > 6 ? 44 : 56) + 'px AB'; o.fillText(lbl, 0, 20); o.restore(); }
    o.globalAlpha = fA * ss(EV.cta_sub - .05, EV.cta_sub + .15, t); o.fillStyle = '#ef2b2b'; o.beginPath(); o.roundRect(350, 645, 380, 84, 42); o.fill(); o.fillStyle = '#fff'; o.font = '700 38px Inter'; o.fillText('SUBSCRIBE', 540, 701); o.globalAlpha = 1; }
  const line = LINES.find(l => t >= l[0].s - .05 && t <= l[l.length - 1].e + .18);
  if (line) { o.font = '700 50px Inter'; o.textAlign = 'left'; const sp = 14, ws = line.map(w => o.measureText(w.w).width), tot = ws.reduce((a, b) => a + b, 0) + sp * (line.length - 1); let x = 540 - tot / 2; const Y = 1720; o.fillStyle = 'rgba(6,9,16,.74)'; o.beginPath(); o.roundRect(540 - tot / 2 - 28, Y - 56, tot + 56, 80, 22); o.fill(); line.forEach((w, k) => { const said = t >= w.s - .02; o.fillStyle = w.k ? (said ? '#ffc85a' : 'rgba(255,200,90,.5)') : (said ? '#fff' : 'rgba(255,255,255,.5)'); o.fillText(w.w, x, Y); x += ws[k] + sp; }); }
  const fade = ss(0, .12, t) * (1 - ss(END - .15, END, t)); if (fade < 1) { o.fillStyle = `rgba(0,0,0,${1 - fade})`; o.fillRect(0, 0, 1080, 1920); }
};
window.END = END;
await Promise.all(['700 37px Inter', '500 23px Mono', '84px AB'].map(f => document.fonts.load(f)));
window.ready = true;
