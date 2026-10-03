// Wiki Roulette — fact-photo toolkit (episodes with "facts": true).
// Real photos fill the frame; the camera glides into the detail that proves the fact, circles it, and names the number.
// Photo coordinates are fractions of the photo (u = 0 left … 1 right, v = 0 top … 1 bottom), read off the real files.

const BLUR = {};
function blurOf(id) {                       // small, blurred, darkened copy: backdrop behind framed photos
  if (BLUR[id]) return BLUR[id]; const im = PHOTOS[id], cv = document.createElement('canvas'); cv.width = 270; cv.height = 480;
  const x = cv.getContext('2d'), s = Math.max(270 / im.width, 480 / im.height); x.filter = 'blur(9px) brightness(0.42) saturate(1.15)';
  x.drawImage(im, (270 - im.width * s) / 2, (480 - im.height * s) / 2, im.width * s, im.height * s); return BLUR[id] = cv;
}
const easeOut = (x) => 1 - Math.pow(1 - clamp(x), 3);

// shot(t, id, {a:[u,v,zoom], b:[u,v,zoom], dur, t0, box:[x,y,w,h], anchor:[x,y], r, shade, credit})
// The photo covers the box (default: whole frame). The camera moves from a to b (focus point pinned at the anchor).
// Returns P(u,v) → [x,y] on screen, or null if the photo is missing (caller draws a fallback).
function shot(t, id, o = {}) {
  const im = o.img || PHOTOS[id]; if (!im) return null;
  const [bx, by, bw, bh] = o.box || [0, 0, W, H], A = o.a || [0.5, 0.5, 1], B = o.b || A;
  const p = ease((t - (o.t0 ?? 0)) / (o.dur || 5)), u = lerp(A[0], B[0], p), v = lerp(A[1], B[1], p), z = lerp(A[2] ?? 1, B[2] ?? 1, p);
  const sc = Math.max(bw / im.width, bh / im.height) * z, dw = im.width * sc, dh = im.height * sc;
  const [ax, ay] = o.anchor || (WIDE && !o.box ? [bw * 0.64, bh * 0.46] : [bx + bw / 2, by + bh * 0.46]);
  const dx = clamp(ax - u * dw, bx + bw - dw, bx), dy = clamp(ay - v * dh, by + bh - dh, by);
  g.save();
  if (o.box) { if (o.backdrop !== false) g.drawImage(blurOf(id), 0, 0, W, H); rrect(bx, by, bw, bh, o.r ?? 30); g.save(); g.clip(); }
  g.drawImage(im, dx, dy, dw, dh);
  if (o.box) { g.restore(); g.lineWidth = 3; g.strokeStyle = 'rgba(255,255,255,0.16)'; rrect(bx, by, bw, bh, o.r ?? 30); g.stroke(); }
  else if (o.shade !== false && WIDE) {     // 16:9: dark left third (text) and bottom (captions)
    const gl = g.createLinearGradient(0, 0, W, 0); gl.addColorStop(0, 'rgba(8,8,10,0.88)'); gl.addColorStop(0.3, 'rgba(8,8,10,0.6)'); gl.addColorStop(0.55, 'rgba(8,8,10,0.05)'); gl.addColorStop(1, 'rgba(8,8,10,0)');
    g.fillStyle = gl; g.fillRect(0, 0, W, H); const gb = g.createLinearGradient(0, 0, 0, H); gb.addColorStop(0, 'rgba(8,8,10,0.45)'); gb.addColorStop(0.16, 'rgba(8,8,10,0)'); gb.addColorStop(0.72, 'rgba(8,8,10,0)'); gb.addColorStop(1, 'rgba(8,8,10,0.85)');
    g.fillStyle = gb; g.fillRect(0, 0, W, H); }
  else if (o.shade !== false) {             // dark top (titles) and bottom (captions); the middle stays clean
    const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, 'rgba(8,8,10,0.86)'); gr.addColorStop(0.22, 'rgba(8,8,10,0.55)');
    gr.addColorStop(0.36, 'rgba(8,8,10,0.08)'); gr.addColorStop(0.58, 'rgba(8,8,10,0.08)'); gr.addColorStop(0.7, 'rgba(8,8,10,0.6)'); gr.addColorStop(1, 'rgba(8,8,10,0.9)');
    g.fillStyle = gr; g.fillRect(0, 0, W, H); }
  const cr = o.credit ?? CREDITS[id]; if (cr) { if (WIDE && !o.box) text(cr.slice(0, 70), W - 40, H - 22, 'mono', 18, 'rgba(255,255,255,0.6)', { ls: 1, align: 'right' });
    else text(cr.slice(0, 64), o.box ? bx + 18 : 80, o.box ? by + bh - 16 : 1585, 'mono', 18, 'rgba(255,255,255,0.6)', { ls: 1 }); }
  g.restore();
  return (uu, vv) => [dx + uu * dw, dy + vv * dh];
}
// framed(): the whole photo, fitted in a box (nothing cropped) over its own blurred backdrop
function framed(t, id, x, y, w, o = {}) {
  const im = PHOTOS[id]; if (!im) return null; const h = w * im.height / im.width;
  return shot(t, id, Object.assign({ box: [x, y, w, h], a: [0.5, 0.5, 1.0], b: [0.5, 0.5, 1.04] }, o));
}

// a gold circle that draws itself around the detail, with a soft dark spotlight outside it
function ring(t, tIn, x, y, r, o = {}) {
  const lt = t - tIn; if (lt < 0) return; const p = easeOut(lt / 0.45), pulse = 1 + 0.04 * Math.sin(lt * 6) * (lt > 0.5);
  if (o.spot !== false) { g.save(); g.fillStyle = `rgba(0,0,0,${0.45 * clamp(lt / 0.4)})`; g.beginPath(); g.rect(0, 0, W, H);
    g.arc(x, y, r * 1.25 * pulse, 0, 6.283, true); g.fill('evenodd'); g.restore(); }
  g.save(); g.lineCap = 'round'; g.shadowColor = 'rgba(0,0,0,0.6)'; g.shadowBlur = 16;
  g.strokeStyle = o.color || GOLD; g.lineWidth = o.lw || 9; g.beginPath(); g.arc(x, y, r * pulse, -1.6, -1.6 + 6.283 * p); g.stroke(); g.restore();
}
// a pill label joined to a point by a line that draws on
function callout(t, tIn, pt, lx, ly, str, o = {}) {
  const lt = t - tIn; if (lt < 0 || !pt) return; const p = easeOut(lt / 0.35), [x, y] = pt, ex = lerp(x, lx, p), ey = lerp(y, ly, p);
  g.save(); g.strokeStyle = o.color || GOLD; g.lineWidth = 5; g.shadowColor = 'rgba(0,0,0,0.7)'; g.shadowBlur = 10;
  g.beginPath(); g.moveTo(x, y); g.lineTo(ex, ey); g.stroke(); g.fillStyle = o.color || GOLD; g.beginPath(); g.arc(x, y, 10, 0, 6.283); g.fill(); g.restore();
  if (lt > 0.25) chip(str, lx, ly, t, tIn + 0.25, { size: o.size || 34, align: lx > x ? 'left' : 'center', bg: o.bg || GOLD, fg: o.fg || BG, ...o });
}
// a measuring bar that draws on: from (x,y), length len px (horizontal, or vertical with o.v)
function ruler(t, tIn, x, y, len, str, o = {}) {
  const lt = t - tIn; if (lt < 0) return; const p = easeOut(lt / 0.5), L = len * p, v = !!o.v;
  g.save(); g.strokeStyle = o.color || GOLD; g.fillStyle = o.color || GOLD; g.lineWidth = 6; g.shadowColor = 'rgba(0,0,0,0.7)'; g.shadowBlur = 10; g.beginPath();
  if (v) { g.moveTo(x, y); g.lineTo(x, y - L); g.moveTo(x - 18, y); g.lineTo(x + 18, y); g.moveTo(x - 18, y - L); g.lineTo(x + 18, y - L); }
  else { g.moveTo(x, y); g.lineTo(x + L, y); g.moveTo(x, y - 18); g.lineTo(x, y + 18); g.moveTo(x + L, y - 18); g.lineTo(x + L, y + 18); }
  g.stroke(); g.restore();
  if (lt > 0.4) { if (v) chip(str, x + 36, y - len / 2, t, tIn + 0.4, { size: o.size || 34, align: 'left' }); else chip(str, x + len / 2, y - 56, t, tIn + 0.4, { size: o.size || 34 }); }
}
// a big fact: the number with an RGB split, a mono line under it
function fact(t, tIn, big, small, o = {}) {
  const y = o.y ?? (WIDE ? 330 : 560), sz = fit(big, 'disp', o.size || (WIDE ? 140 : 170), o.maxW || (WIDE ? 860 : 920));
  rgbPop(big, o.x ?? 80, y, sz, o.color || GOLD, t, tIn, { align: o.align || 'left' });
  if (small) label(small, (o.x ?? 80) + 4, y + 66, t, tIn + 0.35, { color: o.color2 || TXT, size: o.size2 || 32, align: o.align || 'left' });
}
// a light "data card": framed rounded panel for drawn comparisons
function panel(x, y, w, h, a = 0.72) { g.save(); rrect(x, y, w, h, 30); g.fillStyle = `rgba(12,11,10,${a})`; g.fill(); g.lineWidth = 2; g.strokeStyle = 'rgba(255,255,255,0.12)'; g.stroke(); g.restore(); }
// "REAL PHOTO" badge: tells the viewer this is not an illustration
function realBadge(t, tIn, str = 'REAL PHOTO', y = WIDE ? 150 : 360) { chip('● ' + str, 80, y, t, tIn, { size: 24, align: 'left', bg: 'rgba(255,59,48,0.92)', fg: TXT }); }
// fallback when a photo is missing
function noPhoto(t) { atmosphere(t, { x: W / 2, y: H * 0.47, r: 900, c: 'rgba(40,90,120,0.35)' }); }
// two stacked big lines (white, then gold) and an optional mono line
function fact2(t, tIn, l1, l2, small, o = {}) {
  const mw = o.maxW || (WIDE ? 860 : 920), sz = Math.min(fit(l1, 'disp', o.size || (WIDE ? 120 : 150), mw), fit(l2, 'disp', o.size || (WIDE ? 120 : 150), mw)), y = o.y ?? (WIDE ? 310 : 540);
  rgbPop(l1, 80, y, sz, o.c1 || TXT, t, tIn); rgbPop(l2, 80, y + sz * 1.0, sz, o.c2 || GOLD, t, tIn + 0.25);
  if (small) label(small, 84, y + sz + 66, t, tIn + 0.6, { color: o.c3 || TXT, size: 32 });
}

// real video footage: plays the clip's frames (30 fps) inside shot(); holds the last frame when the clip ends
function frameAt(id, lt, rate = 1) { const fr = CLIPS[id]; if (!fr || !fr.length) return null; return fr[Math.max(0, Math.min(fr.length - 1, Math.floor(lt * 30 * rate)))]; }
function clip(t, id, o = {}) { const im = frameAt(id, t - (o.t0 ?? 0), o.rate || 1); return shot(t, id, Object.assign({ a: [0.5, 0.5, 1.0], b: [0.5, 0.5, 1.06] }, o, im ? { img: im } : {})); }
function footBadge(t, tIn, str = 'REAL FOOTAGE', y) { const yy = y ?? (WIDE ? 150 : 360), s = spring(t - tIn, 300, 20); if (s <= 0) return;
  chip('▶ ' + str, 80, yy, t, tIn, { size: 24, align: 'left', bg: 'rgba(255,59,48,0.92)', fg: TXT });
  if (Math.sin(t * 6) > 0) { g.fillStyle = RED; g.beginPath(); g.arc(W - 90, yy, 12, 0, 6.283); g.fill(); text('REC', W - 160, yy + 9, 'mono', 24, TXT); } }
// generic Shorts scene from a spec: { ph | clip, a, b, o, side, ring:[u,v,du,tIn,col], co:[[u,v,lx,ly,str,tIn]], f:[big,small,tIn], f2:[l1,l2,small,tIn,o],
//   badge (photo badge text) / foot (footage badge text), k:[[t,type,gain,p]], pre(t,P), x(t,P), dur }
function vscene(i, n, s) {
  return (K) => { K(0.5, 'whoosh', 0.5); (s.k || [[1.0, 'hit', 1]]).forEach(([a, b, c, d]) => K(a, b, c, d));
    return (t) => { atmosphere(t); const id = s.clip || s.ph, opt = Object.assign({ a: s.a || [0.5, 0.5, 1.0], b: s.b || s.a || [0.5, 0.5, 1.1], dur: s.dur || 5, anchor: [540, 900] }, s.o || {});
      const P = s.clip ? clip(t, id, opt) : shot(t, id, opt); if (!P) noPhoto(t); if (s.pre) s.pre(t, P);
      tag(t, i, n); if (s.clip) footBadge(t, 0.3, s.foot || 'REAL FOOTAGE'); else if (s.badge !== false) realBadge(t, 0.4, s.badge || 'REAL PHOTO');
      if (P && s.ring) { const [u, v, du, tIn, col] = s.ring, [x, y] = P(u, v); ring(t, tIn ?? 1.0, x, y, Math.abs(P(u + du, v)[0] - x), { color: col, spot: !(s.o && s.o.box) }); }
      if (P && s.co) s.co.forEach(([u, v, lx, ly, str, tIn]) => callout(t, tIn ?? 1.8, P(u, v), lx, ly, str));
      if (s.f) fact(t, s.f[2] ?? 0.8, s.f[0], s.f[1], s.fo || {});
      if (s.f2) fact2(t, s.f2[3] ?? 0.8, s.f2[0], s.f2[1], s.f2[2], s.f2[4] || {});
      if (s.x) s.x(t, P); }; };
}
function vopen(s) {     // hook frame: clip or photo under the stacked hook
  return (K) => { K(0.15, 'hit', 1.3); K(0.2, 'mute', 1, 0.4); K(1.8, 'thump', 0.8);
    return (t) => { atmosphere(t); const opt = Object.assign({ a: s.a || [0.5, 0.5, 1.0], b: s.b || s.a || [0.5, 0.5, 1.1], dur: 2.5, anchor: [540, 1100] }, s.o || {});
      const P = s.clip ? clip(t, s.clip, opt) : shot(t, s.ph, opt); if (!P) noPhoto(t); tag(t); hook(t, EP.hook, 480);
      if (s.clip) footBadge(t, 0.2, s.foot || 'REAL FOOTAGE', 1500); if (s.x) s.x(t, P); }; };
}
