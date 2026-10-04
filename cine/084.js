// Wiki Roulette #084 — How Instagram's ranking works (motion-graphics explainer; facts from Instagram's own
// "Instagram Ranking Explained" and Adam Mosseri, Jan 2025). No Instagram logos or UI screenshots: generic drawings only.
const IG = ['#F58529', '#DD2A7B', '#8134AF', '#515BD4'];
function igGrad(x0, y0, x1, y1) { const gr = g.createLinearGradient(x0, y0, x1, y1); IG.forEach((c, i) => gr.addColorStop(i / 3, c)); return gr; }
function bgDark(t) { atmosphere(t, { x: 540, y: 900, r: 1000, c: 'rgba(129,52,175,0.22)' }); }
function source(t, tIn, str) { label('SOURCE: ' + str, 84, 1585, t, tIn, { color: '#9A948A', size: 22 }); }
// a generic phone with an endless feed of placeholder posts
function phone(x, y, w, h, t, speed = 300, o = {}) {
  g.save(); rrect(x - 14, y - 14, w + 28, h + 28, 64); g.fillStyle = '#0E0D0C'; g.fill(); g.lineWidth = 4; g.strokeStyle = 'rgba(255,255,255,0.18)'; g.stroke();
  rrect(x, y, w, h, 52); g.clip(); g.fillStyle = '#151413'; g.fillRect(x, y, w, h);
  const ch = w * 1.25, off = (t * speed) % ch, r = rng(84);
  for (let k = -1; k < h / ch + 2; k++) { const cy = y + k * ch - off, seed = Math.floor((t * speed) / ch) + k, rr = rng(84 + seed * 7);
    g.fillStyle = IG[Math.floor(rr() * 4)]; g.globalAlpha = 0.85; g.beginPath(); g.arc(x + 46, cy + 40, 20, 0, 6.283); g.fill(); g.globalAlpha = 1;
    g.fillStyle = 'rgba(255,255,255,0.25)'; g.fillRect(x + 78, cy + 30, w * 0.4, 12);
    const hue = Math.floor(rr() * 360); g.fillStyle = `hsl(${hue},45%,35%)`; g.fillRect(x, cy + 76, w, ch - 170);
    g.fillStyle = `hsl(${(hue + 40) % 360},55%,55%)`; g.beginPath(); g.arc(x + w * (0.3 + rr() * 0.4), cy + 76 + (ch - 170) * 0.5, w * 0.16, 0, 6.283); g.fill();
    g.fillStyle = 'rgba(255,255,255,0.3)'; g.fillRect(x + 24, cy + ch - 80, w * 0.6, 10); g.fillRect(x + 24, cy + ch - 58, w * 0.35, 10); }
  g.restore();
}
// simple icons (centred at x,y, size s)
function heart(x, y, s, col = '#FF3B5C') { g.save(); g.translate(x, y); g.scale(s / 40, s / 40); g.fillStyle = col; g.beginPath(); g.moveTo(0, 14);
  g.bezierCurveTo(-26, -4, -16, -26, 0, -12); g.bezierCurveTo(16, -26, 26, -4, 0, 14); g.fill(); g.restore(); }
function plane(x, y, s, col = TXT) { g.save(); g.translate(x, y); g.scale(s / 40, s / 40); g.fillStyle = col; g.beginPath(); g.moveTo(-18, -2); g.lineTo(20, -16); g.lineTo(6, 18); g.lineTo(0, 4); g.closePath(); g.fill(); g.restore(); }
function eye(x, y, s, col = TXT) { g.save(); g.translate(x, y); g.scale(s / 40, s / 40); g.strokeStyle = col; g.lineWidth = 4; g.beginPath(); g.moveTo(-20, 0);
  g.quadraticCurveTo(0, -18, 20, 0); g.quadraticCurveTo(0, 18, -20, 0); g.stroke(); g.fillStyle = col; g.beginPath(); g.arc(0, 0, 6, 0, 6.283); g.fill(); g.restore(); }
function bookmark(x, y, s, col = TXT) { g.save(); g.translate(x, y); g.scale(s / 40, s / 40); g.fillStyle = col; g.beginPath(); g.moveTo(-12, -18); g.lineTo(12, -18); g.lineTo(12, 18); g.lineTo(0, 8); g.lineTo(-12, 18); g.closePath(); g.fill(); g.restore(); }
function dude(x, y, s, col) { g.fillStyle = col; g.beginPath(); g.arc(x, y - s * 0.55, s * 0.32, 0, 6.283); g.fill(); g.beginPath(); g.arc(x, y + s * 0.35, s * 0.55, Math.PI, 0); g.fill(); }
function cardPost(x, y, w, h, hue, o = {}) { g.save(); rrect(x, y, w, h, 22); g.fillStyle = `hsl(${hue},40%,${o.grey ? 25 : 34}%)`; g.fill();
  if (o.grey) { g.globalAlpha = 0.6; } g.fillStyle = `hsl(${(hue + 40) % 360},50%,${o.grey ? 40 : 58}%)`; g.beginPath(); g.arc(x + w / 2, y + h * 0.45, w * 0.2, 0, 6.283); g.fill(); g.restore(); }

VIS.open = (K) => { K(0.1, 'hit', 1.2); K(0.15, 'whoosh', 0.8);
  return (t) => { bgDark(t); phone(300, 780, 480, 900, t, 900); tag(t); hook(t, EP.hook, 480); }; };

VIS[0] = (K) => { [1.0, 1.25, 1.5, 1.75].forEach((x) => K(x, 'pop', 0.7));
  return (t) => { bgDark(t); tag(t, 0, 8);
    ['FEED', 'STORIES', 'EXPLORE', 'REELS'].forEach((n, i) => { const s = spring(t - 1.0 - i * 0.25, 260, 20); if (s <= 0) return;
      const x = 80 + (i % 2) * 470, y = 800 + Math.floor(i / 2) * 240; g.save(); g.translate(x + 215, y + 110); g.scale(s, s); g.translate(-x - 215, -y - 110);
      rrect(x, y, 430, 220, 30); g.fillStyle = 'rgba(20,19,18,0.92)'; g.fill(); g.lineWidth = 4; g.strokeStyle = igGrad(x, y, x + 430, y + 220); g.stroke();
      g.save(); g.translate(x + 215, y + 85); g.rotate(t * (1.5 + i * 0.4)); g.strokeStyle = IG[i]; g.lineWidth = 10; for (let k = 0; k < 8; k++) { g.rotate(Math.PI / 4); g.beginPath(); g.moveTo(0, 34); g.lineTo(0, 48); g.stroke(); }
      g.beginPath(); g.arc(0, 0, 34, 0, 6.283); g.stroke(); g.restore(); text(n, x + 215, y + 190, 'disp', 40, TXT, { align: 'center' }); g.restore(); });
    fact2(t, 0.6, 'NO SINGLE', 'ALGORITHM.', 'EACH PART OF THE APP RANKS ITS OWN WAY'); source(t, 1.5, 'INSTAGRAM, "RANKING EXPLAINED"'); }; };

VIS[1] = (K) => { K(0.6, 'riser', 0.5, 1); K(1.8, 'hit', 1);
  return (t) => { bgDark(t); tag(t, 1, 8); const cx = 540, cy = 1000, r = rng(11);
    g.save(); g.globalCompositeOperation = 'lighter'; for (let i = 0; i < 420; i++) { const a = r() * 6.283, d0 = 300 + r() * 500, sp = 0.4 + r() * 0.8, p = ((t * sp + r()) % 1);
      const d = d0 * (1 - p); g.fillStyle = IG[i % 4]; g.globalAlpha = 0.25 + 0.6 * p; g.fillRect(cx + Math.cos(a) * d, cy + Math.sin(a) * d * 0.8, 4, 4); } g.restore();
    glowDot(cx, cy, 120 + 12 * Math.sin(t * 6), '221,42,123', 0.9); g.fillStyle = '#0E0D0C'; g.beginPath(); g.arc(cx, cy, 70, 0, 6.283); g.fill();
    text('AI', cx, cy + 22, 'disp', 64, TXT, { align: 'center' });
    fact(t, 0.6, 'THOUSANDS', 'OF SIGNALS, WEIGHED FOR EVERY POST', { size: 160 }); source(t, 1.2, 'INSTAGRAM'); }; };

VIS[2] = (K) => { [1.0, 1.4, 1.8, 2.2].forEach((x) => K(x, 'tick', 0.8));
  return (t) => { bgDark(t); tag(t, 2, 8); cardPost(90, 700, 340, 420, 210);
    const rows = [['WATCH', 0.72, eye], ['LIKE', 0.31, heart], ['SHARE', 0.12, plane], ['SAVE', 0.09, bookmark]];
    rows.forEach(([n, v, ic], i) => { const lt = t - 1.0 - i * 0.4; if (lt < 0) return; const y = 730 + i * 100, w = 420 * v * easeOut(lt / 0.6);
      ic(500, y + 22, 44, i === 1 ? '#FF3B5C' : TXT); text(n, 540, y + 36, 'mono', 30, TXT); g.fillStyle = 'rgba(255,255,255,0.12)'; g.fillRect(660, y + 10, 330, 30);
      g.fillStyle = igGrad(660, 0, 990, 0); g.fillRect(660, y + 10, Math.min(330, w * 0.79), 30); text(Math.round(v * 100 * easeOut(lt / 0.6)) + '%', 1000, y + 36, 'mono', 26, GOLD, { align: 'right' }); });
    label('EXAMPLE PREDICTION · ILLUSTRATION', 92, 1160, t, 1.0, { color: '#9A948A', size: 22 });
    fact2(t, 0.6, 'IT PREDICTS', 'YOUR NEXT MOVE.', null); source(t, 1.2, 'INSTAGRAM, "RANKING EXPLAINED"'); }; };

VIS[3] = (K) => { K(1.2, 'pop', 0.7); K(1.6, 'pop', 0.7); K(2.0, 'hit', 1.1);
  return (t) => { const P = shot(t, 'boss', { a: [0.5, 0.3, 1.0], b: [0.5, 0.28, 1.08], dur: 5, anchor: [540, 760] }); if (!P) bgDark(t);
    tag(t, 3, 8); realBadge(t, 0.3, 'REAL PHOTO · ADAM MOSSERI, HEAD OF INSTAGRAM');
    [['1', 'WATCH TIME', eye], ['2', 'LIKES', heart], ['3', 'SENDS', plane]].forEach(([n, s, ic], i) => { const tIn = 1.2 + i * 0.4, sp = spring(t - tIn, 280, 20); if (sp <= 0) return;
      const y = 900 + i * 115; g.save(); g.translate(80, y); g.scale(sp, sp); rrect(0, -48, 620, 96, 48); g.fillStyle = i === 2 ? GOLD : 'rgba(14,13,12,0.88)'; g.fill();
      text(n, 48, 22, 'disp', 54, i === 2 ? BG : GOLD, { align: 'center' }); text(s, 110, 20, 'disp', 50, i === 2 ? BG : TXT); ic(560, 0, 52, i === 2 ? BG : (i === 1 ? '#FF3B5C' : TXT)); g.restore(); });
    fact(t, 0.6, 'TOP 3 SIGNALS', null, { size: 140 }); source(t, 1.2, 'MOSSERI, JAN 2025'); }; };

VIS[4] = (K) => { K(0.8, 'whoosh', 0.6); K(1.6, 'whoosh', 0.8); K(2.0, 'hit', 1);
  return (t) => { bgDark(t); tag(t, 4, 8);
    const grp = (cx, col, n, seed) => { const r = rng(seed); for (let i = 0; i < n; i++) dude(cx + (r() - 0.5) * 300, 1050 + (r() - 0.5) * 220, 40, col); };
    grp(270, 'rgba(255,255,255,0.55)', 14, 3); grp(810, 'rgba(255,194,61,0.8)', 22, 5);
    text('FOLLOWERS', 270, 1230, 'mono', 30, TXT, { align: 'center' }); text('STRANGERS', 810, 1230, 'mono', 30, GOLD, { align: 'center' });
    for (let k = 0; k < 6; k++) { const p = ((t * 0.7 + k / 6) % 1); if (t > 0.8) heart(540 - 200 * p, 860 - 60 * Math.sin(p * 3.14), 34 + 6 * (1 - p)); if (t > 1.6) plane(540 + 260 * p, 860 - 90 * Math.sin(p * 3.14), 40 + 10 * (1 - p), GOLD); }
    fact2(t, 0.6, 'SENDS REACH', 'STRANGERS.', 'LIKES COUNT MORE WITH YOUR FOLLOWERS'); source(t, 1.2, 'MOSSERI, JAN 2025'); }; };

VIS[5] = (K) => { K(1.0, 'pop', 0.7); K(1.6, 'scratch', 0.8); K(1.62, 'thump', 1);
  return (t) => { bgDark(t); tag(t, 5, 8);
    cardPost(110, 720, 380, 460, 30); chip('ORIGINAL', 300, 1230, t, 1.0, { size: 32 }); cardPost(590, 720, 380, 460, 30, { grey: true });
    if (t > 1.6) { const p = easeOut((t - 1.6) / 0.3); g.strokeStyle = RED; g.lineWidth = 14; g.beginPath(); g.moveTo(610, 740); g.lineTo(610 + 340 * p, 740 + 420 * p); g.stroke(); }
    chip('REPOST', 780, 1230, t, 1.0, { size: 32, bg: '#3A3631', fg: TXT });
    const bar = (x, v, col, tIn) => { const p = easeOut((t - tIn) / 0.6); if (p <= 0) return; g.fillStyle = col; g.fillRect(x, 700 - 160 * v * p, 60, 160 * v * p); };
    fact2(t, 0.6, 'REPOSTS GET', 'LESS REACH.', 'SINCE 2022 · ORIGINALS GET THE CREDIT'); source(t, 1.2, 'INSTAGRAM, APRIL 2022'); }; };

VIS[6] = (K) => { [1.0, 1.4, 1.8].forEach((x) => K(x, 'thump', 0.8));
  return (t) => { bgDark(t); tag(t, 6, 8);
    const items = [['WATERMARK', 0], ['LOW-RES', 1], ['MOSTLY TEXT', 2]];
    items.forEach(([n, k], i) => { const s = spring(t - 1.0 - i * 0.4, 260, 20); if (s <= 0) return; const x = 70 + i * 320, y = 760;
      g.save(); g.translate(x + 140, y + 200); g.scale(s, s); g.translate(-x - 140, -y - 200); cardPost(x, y, 280, 360, 200 + i * 50);
      if (k === 0) { rrect(x + 150, y + 300, 116, 44, 10); g.fillStyle = 'rgba(255,255,255,0.85)'; g.fill(); text('@other', x + 208, y + 330, 'mono', 22, BG, { align: 'center' }); }
      if (k === 1) { for (let px = 0; px < 280; px += 35) for (let py = 0; py < 360; py += 35) { g.fillStyle = `hsla(${200 + ((px + py) % 90)},40%,${30 + ((px * py) % 30)}%,0.9)`; g.fillRect(x + px, y + py, 35, 35); } }
      if (k === 2) { g.fillStyle = 'rgba(255,255,255,0.8)'; for (let l = 0; l < 9; l++) g.fillRect(x + 24, y + 40 + l * 34, 232 - (l % 3) * 40, 14); }
      text(n, x + 140, y + 410, 'mono', 26, TXT, { align: 'center' }); g.fillStyle = RED; g.beginPath(); g.moveTo(x + 120, y + 440); g.lineTo(x + 160, y + 440); g.lineTo(x + 140, y + 476); g.fill(); g.restore(); });
    fact2(t, 0.6, 'LESS REACH', 'FOR THESE.', null, { c2: RED }); source(t, 1.2, 'INSTAGRAM, "RANKING EXPLAINED"'); }; };

VIS[7] = (K) => { K(1.0, 'pop', 0.7); K(1.8, 'whoosh', 0.7); K(2.6, 'tick', 0.8);
  return (t) => { bgDark(t); tag(t, 7, 8); cardPost(400, 760, 280, 360, 300); chip('TRIAL', 540, 740, t, 0.8, { size: 30, bg: GOLD });
    const r = rng(21); for (let i = 0; i < 16; i++) { const a = -0.3 + r() * 3.7, d = 380 + r() * 80, x = 540 + Math.cos(a) * d, y = 940 + Math.sin(a) * d * 0.7;
      const p = clamp((t - 1.0 - i * 0.05) / 0.5); if (p > 0) { g.strokeStyle = 'rgba(255,194,61,0.35)'; g.lineWidth = 3; g.beginPath(); g.moveTo(540, 940); g.lineTo(lerp(540, x, p), lerp(940, y, p)); g.stroke(); dude(x, y, 30, 'rgba(255,194,61,0.85)'); } }
    if (t > 2.6) chip('AFTER 24 H: SEE THE RESULTS', 540, 1240, t, 2.6, { size: 28, bg: 'rgba(14,13,12,0.9)', fg: TXT });
    fact2(t, 0.6, 'TRIAL REELS:', 'STRANGERS FIRST.', null); source(t, 1.2, 'INSTAGRAM, DEC 2024');
    const e = t - 4.7; if (e > 0) {                         // the CTA: "send this to a friend" — the very signal the video is about
      g.save(); g.globalAlpha = clamp(e / 0.3); bgDark(t); phone(300, 520, 480, 820, t, 260); g.restore();
      for (let k = 0; k < 7; k++) { const p = ((e * 0.8 + k / 7) % 1); plane(540 + Math.cos(k * 0.9) * 420 * p, 930 - 520 * p + Math.sin(k) * 80 * p, 60 * (1 - p * 0.5), GOLD); }
      rgbPop('SEND THIS', 80, 420, 130, TXT, t, 4.8); rgbPop('TO A FRIEND.', 80, 540, 130, GOLD, t, 5.0); } }; };
