// Wiki Roulette SPECIAL — "The Article About You": a pure subscribe Short.
// The viewer gets an (empty) encyclopedia article as "Subscriber No. 3". It fills, asks for one citation (you), then empties again → loop.
const PX = 50, PY = 290, PW = 980, PH = 880;                 // page viewport on screen
const INK = '#1E1B17', MUTE = '#6E675D', RULE = '#C9C0B0', LINK = '#2F5FD0', PG = '#F2ECE0', BAR = '#DDD4C4', IBX = '#E9E1D2';
const at = (S, i) => S.vo[i].at, endOf = (S, i) => S.vo[i].end;

function wrapL(str, fam, size, maxW) { g.font = F[fam](size); const out = []; let line = '';
  for (const w of str.split(' ')) { const tst = line ? line + ' ' + w : w; if (g.measureText(tst).width > maxW && line) { out.push(line); line = w; } else line = tst; }
  if (line) out.push(line); return out; }
function typeLines(lines, x, y, lh, fam, size, color, t, t0, dur) {         // paragraph typed across several lines
  const tot = lines.reduce((a, l) => a + l.length, 0); let n = Math.floor(tot * clamp((tq(t) - t0) / dur));
  lines.forEach((l, i) => { if (n <= 0) return; const s = l.slice(0, n); n -= l.length; text(s, x, y + i * lh, fam, size, color); }); }
const shown = (t, t0) => t0 != null && t >= t0;

// ---------------------------------------------------------------- the article page (page coords 0..980 × 0..880)
// S: reveal times in the scene's clock (null = not shown, negative = already there); S.erase: time the page empties again
function article(t, S) {
  const e = S.erase != null ? clamp((t - S.erase) / 0.9) : 0, on = (k) => shown(t, S[k]) ? 1 - e : 0;
  const gold = S.gold != null ? clamp((t - S.gold) * 3) * (1 - e) : 0;
  g.save(); g.shadowColor = 'rgba(0,0,0,0.55)'; g.shadowBlur = 40; g.shadowOffsetY = 14; rrect(0, 0, PW, PH, 26); g.fillStyle = PG; g.fill(); g.restore();
  if (gold > 0) { g.save(); rrect(0, 0, PW, PH, 26); g.lineWidth = 10; g.strokeStyle = GOLD; g.globalAlpha = gold; g.shadowColor = GOLD; g.shadowBlur = 40; g.stroke(); g.restore(); }
  text('WIKI ROULETTE · THE FREE ENCYCLOPEDIA OF STRANGE THINGS', 40, 58, 'mono', 19, MUTE, { ls: 2 });
  text('Subscriber No. 3', 40, 150, 'serif', 82, INK);
  g.fillStyle = RULE; g.fillRect(40, 176, 900, 3);
  text('From Wiki Roulette, the free encyclopedia', 40, 216, 'ui', 24, MUTE);
  // ---- infobox
  const bx = 600, by = 250, bw = 340, bh = 590;
  g.fillStyle = IBX; g.fillRect(bx, by, bw, bh); g.strokeStyle = RULE; g.lineWidth = 3; g.strokeRect(bx, by, bw, bh);
  g.fillStyle = gold > 0.5 ? GOLD : '#CFC3AC'; g.fillRect(bx, by, bw, 56); text('Subscriber No. 3', bx + bw / 2, by + 38, 'ui', 26, INK, { align: 'center' });
  const ax = bx + 20, ay = by + 74, aw = bw - 40, ah = 220;                 // avatar
  g.fillStyle = '#D6CCBA'; g.fillRect(ax, ay, aw, ah);
  g.save(); g.beginPath(); g.rect(ax, ay, aw, ah); g.clip(); g.fillStyle = gold > 0 ? `rgba(255,194,61,${0.35 + 0.65 * gold})` : '#B9AD97';
  g.beginPath(); g.arc(ax + aw / 2, ay + 92, 52, 0, 6.283); g.fill(); g.beginPath(); g.ellipse(ax + aw / 2, ay + ah + 30, 120, 105, 0, 0, 6.283); g.fill(); g.restore();
  if (gold > 0.5) text('YOU', ax + aw / 2, ay + 112, 'disp', 52, INK, { align: 'center' });
  else text('?', ax + aw / 2, ay + 122, 'disp', 84, '#F2ECE0', { align: 'center' });
  const rows = [['Born', 'Today', 'born'], ['Known for', 'Being early', 'known'], ['Status', 'Legend', 'status'], ['Name', null, 'cite']];
  rows.forEach(([lab, val, k], i) => {
    const y = by + 350 + i * 64;
    g.fillStyle = RULE; g.fillRect(bx + 16, y - 40, bw - 32, 2);
    text(lab, bx + 20, y, 'ui', 23, INK);
    const a = on(k), lt = t - (S[k] ?? 1e9);
    if (a > 0 && lt < 0.6) { g.save(); g.globalAlpha = (1 - lt / 0.6) * 0.8; g.fillStyle = GOLD; g.fillRect(bx + 8, y - 36, bw - 16, 56); g.restore(); }
    if (a < 1) { g.globalAlpha = 1 - a; rrect(bx + 160, y - 20, 150, 18, 9); g.fillStyle = BAR; g.fill(); g.globalAlpha = 1; }
    if (a <= 0) return;
    g.save(); g.globalAlpha = a;
    if (k === 'cite') {
      if (shown(t, S.you)) { const p = spring(t - S.you, 320, 16); g.translate(bx + 160, y); g.scale(p, p); text('YOU', 0, 4, 'disp', 34, gold > 0.5 ? '#B07800' : INK); }
      else { const pulse = 0.55 + 0.45 * Math.sin((t - S.cite) * 9); text('[citation needed]', bx + 160, y, 'ui', 21, `rgba(210,40,30,${pulse})`); }
    } else {
      const n = Math.max(1, Math.floor(val.length * clamp(lt / 0.35))); text(val.slice(0, n), bx + 160, y, 'ui', 24, INK);
      if (k === 'status' && lt > 0.5) { text('(pending', bx + 160, y + 28, 'ui', 20, MUTE); for (let d = 0; d < 3; d++) { g.globalAlpha = a * (0.25 + 0.75 * ((Math.floor(t * 4) - d) % 3 === 0)); text('.', bx + 254 + d * 7, y + 28, 'ui', 20, MUTE); } g.globalAlpha = a; text(')', bx + 277, y + 28, 'ui', 20, MUTE); }
    }
    g.restore(); });
  // ---- left column: empty skeleton, or the History section
  const hist = on('hist');
  if (hist < 1) { g.globalAlpha = 1 - hist; [500, 470, 520, 380, 0, 510, 440, 495, 300].forEach((w, i) => { if (!w) return; rrect(40, 262 + i * 40, w, 20, 10); g.fillStyle = BAR; g.fill(); }); g.globalAlpha = 1; }
  if (hist > 0) { g.save(); g.globalAlpha = hist;
    text('History', 40, 296, 'serif', 46, INK); g.fillStyle = RULE; g.fillRect(40, 314, 520, 2);
    const L = wrapL('In 2026, this channel had exactly two subscribers. Historians still argue about who they were.', 'ui', 29, 510);
    typeLines(L, 40, 368, 42, 'ui', 29, INK, t, S.hist, S.histDur || 2.5); g.restore(); }
  // the first two subscribers (unknown), and an outline waiting for No. 3
  const ppl = on('ppl');
  if (ppl > 0) { [[120, 'No. 1'], [290, 'No. 2'], [460, 'No. 3']].forEach(([x, lab], i) => {
    const p = spring(t - S.ppl - i * 0.15, 300, 16); if (p <= 0.001) return; g.save(); g.globalAlpha = ppl; g.translate(x, 640); g.scale(p, p);
    const three = i === 2, filled = three && gold > 0.5;
    g.fillStyle = three ? (filled ? GOLD : 'rgba(255,194,61,0.12)') : '#9C9180';
    g.beginPath(); g.arc(0, -40, 30, 0, 6.283); g.fill(); g.beginPath(); g.ellipse(0, 36, 58, 46, 0, Math.PI, 0); g.fill();
    if (three && !filled) { g.setLineDash([10, 8]); g.lineWidth = 4; g.strokeStyle = GOLD; g.globalAlpha = ppl * (0.6 + 0.4 * Math.sin(t * 6));
      g.beginPath(); g.arc(0, -40, 30, 0, 6.283); g.stroke(); g.beginPath(); g.ellipse(0, 36, 58, 46, 0, Math.PI, 0); g.closePath(); g.stroke(); g.setLineDash([]); g.globalAlpha = ppl; }
    text(filled ? 'YOU' : '?', 0, -26, 'disp', filled ? 22 : 40, filled ? INK : three ? GOLD : '#F2ECE0', { align: 'center' });
    text(lab, 0, 80, 'mono', 22, three ? '#B07800' : MUTE, { align: 'center', ls: 2 }); g.restore(); }); }
  // stub notice → references
  const stub = on('stub') * (shown(t, S.ref) ? clamp(1 - (t - S.ref) * 4) : 1);
  if (stub > 0) { const p = spring(t - S.stub, 260, 18); g.save(); g.globalAlpha = stub; g.translate(300, 780); g.scale(p, p); g.translate(-300, -780);
    rrect(40, 728, 520, 110, 14); g.fillStyle = '#FFF4D6'; g.fill(); g.lineWidth = 3; g.strokeStyle = GOLD; g.stroke();
    text('This article is a stub.', 70, 772, 'ui', 26, INK); text('You can help by', 70, 812, 'ui', 24, MUTE);
    g.font = F.ui(24); const w0 = g.measureText('You can help by ').width; text('subscribing.', 70 + w0, 812, 'ui', 24, LINK);
    g.fillStyle = LINK; g.fillRect(70 + w0, 818, g.measureText('subscribing').width, 3); g.restore(); }
  const ref = on('ref');
  if (ref > 0) { g.save(); g.globalAlpha = ref; text('References', 40, 760, 'serif', 36, INK); g.fillStyle = RULE; g.fillRect(40, 774, 520, 2);
    typed('1. ^ You (2026). Subscriber No. 3.', 40, 816, 'ui', 25, INK, t, S.ref + 0.2, 0.9); g.restore(); }
}
function page(t, S, cam = [490, 440, 1]) {                   // draws the article through a camera (focus x, y, zoom)
  g.save(); if (cam[2] > 1.001) { rrect(PX, PY, PW, PH, 26); g.clip(); } g.translate(PX + PW / 2, PY + PH / 2); g.scale(cam[2], cam[2]); g.translate(-cam[0], -cam[1]); article(t, S); g.restore();
}
const camMix = (t, t0, d, A, B) => { const p = spring(t - t0, 90, 19); return A.map((a, i) => lerp(a, B[i], clamp(p, 0, 1.1))); };
function chrome(t) {
  text('WIKI ROULETTE', 80, 238, 'mono', 28, DIM, { ls: 5 }); g.font = F.mono(28); g.letterSpacing = '5px'; const w = g.measureText('WIKI ROULETTE').width; g.letterSpacing = '0px';
  rrect(80 + w + 22, 209, 150, 40, 20); g.fillStyle = GOLD; g.fill(); text('SPECIAL', 80 + w + 40, 238, 'mono', 26, BG, { ls: 3 });
}
function stage(t, glow) { atmosphere(t, glow || { x: 540, y: 760, r: 900, c: 'rgba(255,194,61,0.10)' }); chrome(t); }

// ---------------------------------------------------------------- subscribe button, confetti
function subButton(t, tIn, tPress, o = {}) {
  const ls = t - tIn; if (ls < 0) return; const out = o.out != null ? clamp((t - o.out) / 0.5) : 0;
  const s = spring(ls, 240, 17), y = 1540 + (1 - s) * 520 + ease(out) * 600, on = t >= tPress;
  g.save(); g.translate(540, y);
  const pp = on ? 1 + 0.12 * Math.exp(-(t - tPress) * 6) * Math.sin((t - tPress) * 25) : 1; g.scale(pp, pp);
  const w = 640, h = 128; g.shadowColor = on ? 'rgba(255,194,61,0.6)' : 'rgba(255,0,51,0.55)'; g.shadowBlur = 50; rrect(-w / 2, -h / 2, w, h, h / 2);
  g.fillStyle = on ? '#2B2A28' : '#FF0033'; g.fill(); g.shadowBlur = 0;
  if (on) { g.lineWidth = 5; g.strokeStyle = GOLD; g.stroke(); text('SUBSCRIBED', -40, 20, 'ui', 58, TXT, { align: 'center' }); bell(200, -4, 1.3, Math.sin((t - tPress) * 30) * 0.45 * Math.exp(-(t - tPress) * 3)); }
  else text('SUBSCRIBE', 0, 20, 'ui', 60, TXT, { align: 'center' });
  // cursor glides in and taps
  if (t < tPress + 0.9) { const k = ease((t - (tPress - 0.75)) / 0.6), cx = lerp(420, 70, k), cy = lerp(330, 6, k); cursorHand(cx, cy, Math.abs(t - tPress) < 0.12 ? 1 : 0); }
  g.restore();
  // counter under the button
  const n = on ? 3 : 2, cs = on ? spring(t - tPress, 360, 14) : 1, cy = y + 120;
  g.save(); g.globalAlpha = s * (1 - out); g.translate(540, cy); g.scale(cs, cs); text(`${n} SUBSCRIBERS`, 0, 0, 'mono', 34, on ? GOLD : DIM, { align: 'center', ls: 4 }); g.restore();
}
const CONF = []; { const r = rng(77); for (let i = 0; i < 90; i++) CONF.push({ a: -Math.PI / 2 + (r() - 0.5) * 2.6, v: 900 + r() * 1300, s: 10 + r() * 14, w: r() * 20 - 10, c: [GOLD, '#FF3B30', '#F4EEE3', '#43C6D9'][i % 4] }); }
function confetti(t, t0, x = 540, y = 1540) { const lt = t - t0; if (lt < 0 || lt > 2.6) return;
  for (const p of CONF) { const px = x + Math.cos(p.a) * p.v * lt * Math.exp(-lt * 1.2), py = y + Math.sin(p.a) * p.v * lt * Math.exp(-lt * 1.2) + 900 * lt * lt * 0.5;
    g.save(); g.translate(px, py); g.rotate(p.w * lt); g.globalAlpha = clamp(2.6 - lt); g.fillStyle = p.c; g.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2); g.restore(); } }

// ---------------------------------------------------------------- open: the empty article + the hook
const EMPTY = {};
VIS.open = (K) => { K(0.05, 'hit', 0.9); K(0.3, 'type', 0.7);
  return (t) => { stage(t); page(t, EMPTY, [490, 440, 1 + 0.02 * t]);
    const s = fit(EP.hook[0], 'disp', 120, 920); EP.hook.forEach((l, i) => text(l, 540, 1370 + i * s * 1.05, 'disp', s, i ? GOLD : TXT, { align: 'center', shadow: true })); }; };

// ---------------------------------------------------------------- 0: the infobox fills itself
VIS[0] = (K, { vo }) => { const S = { vo }; K(at(S, 0), 'thump', 1); [1, 2, 3].forEach((i) => { K(at(S, i) + 0.05, 'type', 0.8); K(at(S, i) + 0.35, 'pop', 0.6, 700 + i * 120); });
  const st = { born: at(S, 1) + 0.35, known: at(S, 2) + 0.45, status: at(S, 3) + 0.35 };
  return (t) => { stage(t); const cam = camMix(t, 0.5, 1, [490, 440, 1], [770, 560, 1.45]); page(t, st, cam);
    stampText('EMPTY', 300, 600, t, at(S, 0), { size: 90, rot: -0.12 }); }; };

// ---------------------------------------------------------------- 1: History — two subscribers, identities unknown
VIS[1] = (K, { vo }) => { const S = { vo }; K(at(S, 0), 'type', 0.9); K(at(S, 1), 'pop', 0.8, 500); K(at(S, 1) + 0.15, 'pop', 0.8, 650); K(at(S, 1) + 0.3, 'pop', 1, 900);
  const st = { born: -9, known: -9, status: -9, hist: at(S, 0), histDur: endOf(S, 1) - at(S, 0) - 0.3, ppl: at(S, 1) };
  return (t) => { stage(t); const cam = camMix(t, 0.5, 1, [770, 560, 1.45], [300, 470, 1.4]); page(t, st, cam);
  }; };

// ---------------------------------------------------------------- 2: what the channel is — 8 a day, three past episodes as cards
function emu(t) { g.fillStyle = '#6B4A2E'; g.beginPath(); g.ellipse(-30, 30, 170, 110, -0.1, 0, 6.283); g.fill();          // body
  g.strokeStyle = '#6B4A2E'; g.lineWidth = 34; g.lineCap = 'round'; g.beginPath(); g.moveTo(90, -20); g.quadraticCurveTo(150, -120, 120, -230); g.stroke();
  g.fillStyle = '#4E3420'; g.beginPath(); g.ellipse(132, -248, 42, 32, 0.2, 0, 6.283); g.fill(); g.fillStyle = '#C9A46A'; g.beginPath(); g.moveTo(168, -250); g.lineTo(212, -238); g.lineTo(168, -232); g.fill();
  g.fillStyle = '#FFF'; g.beginPath(); g.arc(140, -256, 8, 0, 6.283); g.fill(); g.fillStyle = '#000'; g.beginPath(); g.arc(142, -256, 4, 0, 6.283); g.fill();
  g.strokeStyle = '#4E3420'; g.lineWidth = 14; const k = Math.sin(t * 14) * 30; g.beginPath(); g.moveTo(-40, 120); g.lineTo(-40 + k, 260); g.moveTo(10, 120); g.lineTo(10 - k, 260); g.stroke(); }
function chicken(t) { const bob = Math.sin(t * 9) * 8; g.translate(0, bob);
  g.fillStyle = '#F1E7D6'; g.beginPath(); g.ellipse(0, 40, 170, 130, 0, 0, 6.283); g.fill();
  g.fillStyle = '#E2D3BB'; g.beginPath(); g.moveTo(-150, 0); g.quadraticCurveTo(-260, -90, -210, 30); g.quadraticCurveTo(-200, 60, -150, 60); g.fill();
  g.fillStyle = '#F1E7D6'; g.fillRect(80, -110, 70, 120); g.fillStyle = '#C0392B'; g.beginPath(); g.ellipse(115, -110, 35, 12, 0, 0, 6.283); g.fill();   // neck stump
  g.setLineDash([12, 10]); g.strokeStyle = GOLD; g.lineWidth = 5; g.beginPath(); g.arc(115, -190, 58, 0, 6.283); g.stroke(); g.setLineDash([]);
  text('?', 115, -164, 'disp', 70, GOLD, { align: 'center' });
  g.strokeStyle = '#E8A33C'; g.lineWidth = 12; g.beginPath(); g.moveTo(-30, 160); g.lineTo(-40, 260); g.moveTo(40, 160); g.lineTo(50, 260); g.stroke(); }
const PCV = document.createElement('canvas'); PCV.width = 800; PCV.height = 500; const pg = PCV.getContext('2d');
function plane(t) { pg.clearRect(0, 0, 800, 500); pg.save(); pg.translate(400, 250); pg.rotate(-0.08); pg.scale(1.15, 1.15); pg.fillStyle = '#DCE3EA';
  pg.beginPath(); pg.ellipse(0, 0, 300, 52, 0, 0, 6.283); pg.fill(); pg.fillRect(-60, -170, 110, 340); pg.beginPath(); pg.moveTo(-250, 0); pg.lineTo(-320, -110); pg.lineTo(-270, -110); pg.lineTo(-200, -10); pg.fill();
  pg.fillStyle = '#3B6EA8'; pg.fillRect(-60, -170, 110, 26); pg.fillStyle = '#5A7A99'; pg.beginPath(); pg.ellipse(140, -10, 60, 22, 0, 0, 6.283); pg.fill();
  pg.globalCompositeOperation = 'destination-out'; const bites = Math.floor(clamp(t / 0.25, 0, 4)); [[-300, -100, 46], [-310, -40, 40], [-60, 175, 50], [50, -170, 48]].slice(0, bites).forEach(([x, y, r]) => { pg.beginPath(); pg.arc(x, y, r, 0, 6.283); pg.fill(); });
  pg.restore(); g.drawImage(PCV, -400, -250); }
function epCard(t, tIn, tOut, num, title, sub, art, accent) {
  const s = spring(t - tIn, 220, 22); if (s <= 0.001) return; const o = tOut != null ? spring(t - tOut, 220, 24) : 0;
  g.save(); g.translate(540 + (1 - s) * 900 - o * 1000, 720 + o * 80); g.scale(0.92, 0.92); g.rotate((1 - s) * 0.25 - o * 0.2 + 0.03 * Math.sin(t * 2));
  g.shadowColor = 'rgba(0,0,0,0.6)'; g.shadowBlur = 50; rrect(-420, -420, 840, 840, 30); g.fillStyle = PANEL; g.fill(); g.shadowBlur = 0; g.lineWidth = 4; g.strokeStyle = EDGE; g.stroke();
  g.save(); rrect(-390, -390, 780, 560, 20); g.clip(); const sky = g.createLinearGradient(0, -390, 0, 170); sky.addColorStop(0, accent[0]); sky.addColorStop(1, accent[1]); g.fillStyle = sky; g.fillRect(-390, -390, 780, 560);
  g.translate(0, -90); g.scale(0.95, 0.95); art(t - tIn); g.restore();
  rrect(-390, -390, 150, 50, 25); g.fillStyle = GOLD; g.fill(); text('#' + num, -315, -355, 'mono', 28, BG, { align: 'center' });
  text(title, -390, 260, 'disp', fit(title, 'disp', 68, 780), TXT); text(sub, -390, 320, 'mono', 28, GOLD, { ls: 3 });
  g.restore(); }
VIS[2] = (K, { vo }) => { const S = { vo }; K(at(S, 0), 'hit', 0.9); for (let i = 0; i < 8; i++) K(at(S, 0) + 0.2 + i * 0.12, 'tick', 0.9);
  [1, 2, 3].forEach((i) => K(at(S, i) - 0.12, 'whoosh', 0.8)); K(at(S, 3) + 0.2, 'crack', 0.7); K(at(S, 3) + 0.45, 'crack', 0.6); K(at(S, 3) + 0.7, 'crack', 0.6);
  return (t) => { stage(t, { x: 540, y: 820, r: 900, c: 'rgba(255,194,61,0.12)' });
    const intro = at(S, 1) - 0.15, io = clamp((t - intro) * 4);
    if (io < 1) { g.save(); g.globalAlpha = 1 - io; const cx = 540, cy = 700;          // 8 a day: a dial that lights 8 times
      g.strokeStyle = '#2C2925'; g.lineWidth = 6; g.beginPath(); g.arc(cx, cy, 300, 0, 6.283); g.stroke();
      for (let i = 0; i < 8; i++) { const a = -Math.PI / 2 + i * Math.PI / 4, lit = t > at(S, 0) + 0.2 + i * 0.12, p = lit ? spring(t - at(S, 0) - 0.2 - i * 0.12, 400, 16) : 0;
        g.fillStyle = lit ? GOLD : '#3A3631'; g.beginPath(); g.arc(cx + Math.cos(a) * 300, cy + Math.sin(a) * 300, 26 + 10 * p, 0, 6.283); g.fill(); }
      rgbPop('8', cx, cy + 110, 330, TXT, t, at(S, 0), { align: 'center' }); label('NEW STORIES / DAY', cx, cy + 400, t, at(S, 0) + 0.3, { align: 'center', color: GOLD });
      g.restore(); }
    epCard(t, at(S, 1) - 0.1, at(S, 2) - 0.1, '028', 'THE EMU WAR', 'AUSTRALIA · 1932', (lt) => emu(lt), ['#E9B872', '#B0703A']);
    epCard(t, at(S, 2) - 0.1, at(S, 3) - 0.1, '009', 'MIKE THE HEADLESS CHICKEN', 'LIVED 18 MONTHS', (lt) => chicken(lt), ['#7FB2D6', '#3E6F96']);
    epCard(t, at(S, 3) - 0.1, null, '047', 'MICHEL LOTITO', 'ATE A WHOLE CESSNA 150', (lt) => plane(lt), ['#9AA7B4', '#4A5866']); }; };

// ---------------------------------------------------------------- 3: [citation needed] → you → subscribe
VIS[3] = (K, { vo }) => { const S = { vo }; const press = at(S, 2) + (endOf(S, 2) - at(S, 2)) * 0.55;
  K(at(S, 0), 'hit', 0.9); K(at(S, 0) + 0.5, 'pop', 0.7, 500); K(at(S, 1), 'thump', 1.1); K(at(S, 2) - 0.1, 'whoosh', 0.8); K(at(S, 2) + 0.2, 'riser', 0.6);
  K(press, 'click', 1); K(press + 0.02, 'coin', 1); K(press + 0.05, 'pop', 1, 900);
  const st = { born: -9, known: -9, status: -9, hist: -9, histDur: 0.01, ppl: -9, cite: 0, stub: at(S, 0) + 0.5, you: at(S, 1), gold: press };
  return (t) => { stage(t, { x: 540, y: 760, r: 1000, c: `rgba(255,194,61,${0.10 + 0.25 * clamp((t - press) * 2) * Math.exp(-(t - press) * 0.4)})` });
    let cam = camMix(t, 0.5, 1, [300, 470, 1.4], [770, 620, 1.5]); if (t > at(S, 1) + 0.5) cam = camMix(t, at(S, 1) + 0.5, 1, cam, [490, 440, 1]);
    page(t, st, cam);
    subButton(t, at(S, 2) - 0.1, press); confetti(t, press); flash(t, press, 0.35, 0.12, '#FFE6A8'); }; };

// ---------------------------------------------------------------- 4: a footnote, then the page empties again (→ loop to the hook)
VIS[4] = (K, { vo }) => { const S = { vo }; K(at(S, 0) + 0.2, 'type', 0.8); K(at(S, 0) + 0.25, 'pen', 0.8); K(at(S, 1), 'scratch', 0.8); K(at(S, 1) + 0.1, 'swish', 0.8);
  const st = { born: -9, known: -9, status: -9, hist: -9, histDur: 0.01, ppl: -9, cite: -9, stub: -9, you: -9, gold: -9, ref: at(S, 0), erase: at(S, 1) + 0.2 };
  return (t) => { const e = clamp((t - st.erase) / 0.9);
    stage(t, { x: 540, y: 760, r: 1000, c: `rgba(255,194,61,${0.10 + 0.08 * (1 - e)})` });
    const lift = 0; const cam = camMix(t, 0.5, 1, [490, 440, 1], [300, 600, 1.3]); const back = camMix(t, st.erase, 1, cam, [490, 440, 1]);
    g.save(); g.translate(0, lift); page(t, st, t > st.erase ? back : cam); g.restore();
    subButton(t, -9, -9, { out: st.erase }); }; };
