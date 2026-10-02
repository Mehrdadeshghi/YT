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
  const im = PHOTOS[id]; if (!im) return null;
  const [bx, by, bw, bh] = o.box || [0, 0, W, H], A = o.a || [0.5, 0.5, 1], B = o.b || A;
  const p = ease((t - (o.t0 ?? 0)) / (o.dur || 5)), u = lerp(A[0], B[0], p), v = lerp(A[1], B[1], p), z = lerp(A[2] ?? 1, B[2] ?? 1, p);
  const sc = Math.max(bw / im.width, bh / im.height) * z, dw = im.width * sc, dh = im.height * sc;
  const [ax, ay] = o.anchor || [bx + bw / 2, by + bh * 0.46];
  const dx = clamp(ax - u * dw, bx + bw - dw, bx), dy = clamp(ay - v * dh, by + bh - dh, by);
  g.save();
  if (o.box) { if (o.backdrop !== false) g.drawImage(blurOf(id), 0, 0, W, H); rrect(bx, by, bw, bh, o.r ?? 30); g.save(); g.clip(); }
  g.drawImage(im, dx, dy, dw, dh);
  if (o.box) { g.restore(); g.lineWidth = 3; g.strokeStyle = 'rgba(255,255,255,0.16)'; rrect(bx, by, bw, bh, o.r ?? 30); g.stroke(); }
  else if (o.shade !== false) {             // dark top (titles) and bottom (captions); the middle stays clean
    const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, 'rgba(8,8,10,0.86)'); gr.addColorStop(0.22, 'rgba(8,8,10,0.55)');
    gr.addColorStop(0.36, 'rgba(8,8,10,0.08)'); gr.addColorStop(0.58, 'rgba(8,8,10,0.08)'); gr.addColorStop(0.7, 'rgba(8,8,10,0.6)'); gr.addColorStop(1, 'rgba(8,8,10,0.9)');
    g.fillStyle = gr; g.fillRect(0, 0, W, H); }
  const cr = o.credit ?? CREDITS[id]; if (cr) text(cr.slice(0, 64), o.box ? bx + 18 : 80, o.box ? by + bh - 16 : 1585, 'mono', 18, 'rgba(255,255,255,0.6)', { ls: 1 });
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
  const y = o.y ?? 560, sz = fit(big, 'disp', o.size || 170, o.maxW || 920);
  rgbPop(big, o.x ?? 80, y, sz, o.color || GOLD, t, tIn, { align: o.align || 'left' });
  if (small) label(small, (o.x ?? 80) + 4, y + 66, t, tIn + 0.35, { color: o.color2 || TXT, size: o.size2 || 32, align: o.align || 'left' });
}
// a light "data card": framed rounded panel for drawn comparisons
function panel(x, y, w, h, a = 0.72) { g.save(); rrect(x, y, w, h, 30); g.fillStyle = `rgba(12,11,10,${a})`; g.fill(); g.lineWidth = 2; g.strokeStyle = 'rgba(255,255,255,0.12)'; g.stroke(); g.restore(); }
// "REAL PHOTO" badge: tells the viewer this is not an illustration
function realBadge(t, tIn, str = 'REAL PHOTO', y = 360) { chip('● ' + str, 80, y, t, tIn, { size: 24, align: 'left', bg: 'rgba(255,59,48,0.92)', fg: TXT }); }
// fallback when a photo is missing
function noPhoto(t) { atmosphere(t, { x: 540, y: 900, r: 900, c: 'rgba(40,90,120,0.35)' }); }
// two stacked big lines (white, then gold) and an optional mono line
function fact2(t, tIn, l1, l2, small, o = {}) {
  const sz = Math.min(fit(l1, 'disp', o.size || 150, 920), fit(l2, 'disp', o.size || 150, 920)), y = o.y ?? 540;
  rgbPop(l1, 80, y, sz, o.c1 || TXT, t, tIn); rgbPop(l2, 80, y + sz * 1.0, sz, o.c2 || GOLD, t, tIn + 0.25);
  if (small) label(small, 84, y + sz + 66, t, tIn + 0.6, { color: o.c3 || TXT, size: 32 });
}
