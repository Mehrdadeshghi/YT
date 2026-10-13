// Wiki Roulette #143 — MATCHDAY · PREDICT IT: tonight's three big Champions League games (13 Oct 2026).
// New broadcast look: split match cards in club colours (patterns only, no crests), venue photo texture, animated win-probability
// bar (Sportradar model, 13 Oct), last-result pills, big % stamp on the word. Ends on a score-prediction grid → comments.
PRO.acc = '#FFD23F';
const KO = '21:00 CEST';
const M = [
  { h: 'ATLÉTICO', a: 'MAN UNITED', city: 'MADRID', ph: 'metro', p: [49, 25, 26],
    hc: ['#CB3524', '#F4F4F4', 'stripes'], ac: ['#141414', '#DA291C', 'diag'], hb: '#E8423F', ab: '#F2C94C',
    hf: 'LAST: L 1–2 AT LIVERPOOL', af: 'LAST: W 4–0 v SABAH', stamp: [0, '49%'] },
  { h: 'GALATASARAY', a: 'BARCELONA', city: 'ISTANBUL', ph: 'rams', p: [12, 13, 75],
    hc: ['#FDB912', '#A90432', 'halves'], ac: ['#A50044', '#004D98', 'stripes'], hb: '#FDB912', ab: '#3D6FD8',
    hf: 'LAST: L 1–3 AT SPORTING', af: 'LAST: W 5–1 v FEYENOORD', stamp: [1, '75%'] },
  { h: 'VIKING', a: 'BAYERN', city: 'STAVANGER', ph: null, p: [4, 7, 89],
    hc: ['#0B2A5B', '#2C5EA8', 'chev'], ac: ['#DC052D', '#FFFFFF', 'diag'], hb: '#4F86D9', ab: '#DC052D',
    hf: 'LAST: L 1–3 AT STUTTGART', af: 'LAST: W 5–0 v BODØ/GLIMT', stamp: [0, '4%'] },
];
const HOME = [[40, 300], [1040, 300], [1040, 770], [40, 900]], AWAY = [[40, 950], [1040, 820], [1040, 1420], [40, 1420]];
const poly = (P) => { g.beginPath(); P.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); g.closePath(); };

function bg(t) { const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, '#070B1A'); gr.addColorStop(1, '#0D1631'); g.fillStyle = gr; g.fillRect(0, 0, W, H);
  g.save(); g.globalCompositeOperation = 'lighter'; [[120, 90], [960, 90]].forEach(([x, y], i) => { const r = 520 + 40 * Math.sin(t * 1.3 + i * 2);
    const rg = g.createRadialGradient(x, y, 0, x, y, r); rg.addColorStop(0, 'rgba(160,190,255,0.16)'); rg.addColorStop(1, 'rgba(160,190,255,0)'); g.fillStyle = rg; g.fillRect(0, 0, W, H); });
  g.restore(); }
function pattern(kind, c2, x0, y0, w, h) { g.save(); g.fillStyle = c2;
  if (kind === 'stripes') { g.globalAlpha = 0.9; for (let x = x0 + 50; x < x0 + w; x += 140) g.fillRect(x, y0, 70, h); }
  if (kind === 'halves') { g.beginPath(); g.moveTo(x0 + w * 0.55, y0); g.lineTo(x0 + w, y0); g.lineTo(x0 + w, y0 + h); g.lineTo(x0 + w * 0.25, y0 + h); g.fill(); }
  if (kind === 'diag') { g.globalAlpha = 0.35; for (let x = x0 - h; x < x0 + w; x += 120) { g.beginPath(); g.moveTo(x, y0 + h); g.lineTo(x + 40, y0 + h); g.lineTo(x + 40 + h, y0); g.lineTo(x + h, y0); g.fill(); } }
  if (kind === 'chev') { g.globalAlpha = 0.45; g.lineWidth = 34; g.strokeStyle = c2; for (let y = y0 - 100; y < y0 + h + 200; y += 150) { g.beginPath(); g.moveTo(x0, y); g.lineTo(x0 + w / 2, y - 120); g.lineTo(x0 + w, y); g.stroke(); } }
  g.restore(); }
function panel(t, at, P, cols, side, photo) { const s = spring(t - at, 210, 20); if (s <= 0.001) return; const dx = (1 - s) * (side ? 1100 : -1100);
  g.save(); g.translate(dx, 0); g.shadowColor = 'rgba(0,0,0,0.55)'; g.shadowBlur = 40; poly(P); g.fillStyle = cols[0]; g.fill(); g.shadowBlur = 0; poly(P); g.clip();
  const ys = P.map((p) => p[1]), y0 = Math.min(...ys), h = Math.max(...ys) - y0; pattern(cols[2], cols[1], 40, y0, 1000, h);
  if (photo && PHOTOS[photo]) { const im = PHOTOS[photo], sc = Math.max(1000 / im.width, h / im.height) * (1.08 + 0.04 * Math.sin(t * 0.4));
    g.globalAlpha = 0.5; g.globalCompositeOperation = 'luminosity'; g.drawImage(im, 540 - im.width * sc / 2, y0 + h / 2 - im.height * sc / 2, im.width * sc, im.height * sc);
    g.globalCompositeOperation = 'source-over'; g.globalAlpha = 1; }
  const gr = g.createLinearGradient(0, y0, 0, y0 + h); gr.addColorStop(0, side ? 'rgba(0,0,0,0.35)' : 'rgba(0,0,0,0)'); gr.addColorStop(1, side ? 'rgba(0,0,0,0)' : 'rgba(0,0,0,0.4)'); g.fillStyle = gr; g.fillRect(0, y0, W, h);
  g.restore(); return dx; }
function name(str, x, y, align, dx, at, t) { if (t < at) return; const a = clamp((t - at) / 0.25), sz = fit(str, 'disp', 150, 680);
  g.save(); g.translate(dx, 0); g.globalAlpha = a; g.shadowColor = 'rgba(0,0,0,0.6)'; g.shadowBlur = 24; g.shadowOffsetY = 6;
  text(str, x, y + (1 - a) * 30, 'disp', sz, '#FFFFFF', { align }); g.restore(); }
function pillTxt(str, x, y, t, at, align = 'left', o = {}) { const s = spring(t - at, 300, 18); if (s <= 0.001) return; g.save(); g.font = F.mono(o.size || 26);
  const w = g.measureText(str).width + 44, h = (o.size || 26) * 1.9, x0 = align === 'right' ? x - w : align === 'center' ? x - w / 2 : x;
  g.translate(x0 + w / 2, y); g.scale(s, s); rrect(-w / 2, -h / 2, w, h, h / 2); g.fillStyle = o.bg || 'rgba(7,11,26,0.82)'; g.fill();
  if (o.stroke) { g.lineWidth = 2; g.strokeStyle = o.stroke; g.stroke(); } g.fillStyle = o.fg || '#FFFFFF'; g.textAlign = 'center'; g.fillText(str, 0, (o.size || 26) * 0.36); g.restore(); }
function vs(t, at) { const s = spring(t - at, 320, 12); if (s <= 0.001) return; const pul = 1 + 0.06 * Math.max(0, Math.sin((t - at) * 5)) * Math.exp(-(t - at));
  g.save(); g.translate(540, 862); g.scale(s * pul, s * pul); g.shadowColor = 'rgba(0,0,0,0.6)'; g.shadowBlur = 30; g.beginPath(); g.arc(0, 0, 84, 0, 6.283); g.fillStyle = '#FFFFFF'; g.fill(); g.shadowBlur = 0;
  g.lineWidth = 8; g.strokeStyle = '#070B1A'; g.stroke(); text('VS', 0, 28, 'disp', 72, '#070B1A', { align: 'center' }); g.restore(); }
function probBar(t, at, m) { if (t < at) return; const p = 1 - Math.pow(1 - clamp((t - at) / 0.9), 3), x0 = 90, w = 900, y = 1530, hh = 58, cols = [m.hb, 'rgba(255,255,255,0.55)', m.ab];
  text('WIN PROBABILITY', 540, 1474, 'mono', 24, 'rgba(255,255,255,0.7)', { align: 'center', ls: 4 });
  g.save(); rrect(x0, y, w, hh, hh / 2); g.fillStyle = 'rgba(255,255,255,0.08)'; g.fill(); rrect(x0, y, w, hh, hh / 2); g.clip(); let x = x0;
  m.p.forEach((v, i) => { const ww = w * v / 100 * p; g.fillStyle = cols[i]; g.fillRect(x, y, ww, hh); if (i < 2) { g.fillStyle = '#070B1A'; g.fillRect(x + ww - 2, y, 4, hh); } x += ww; }); g.restore();
  const n = (v) => `${Math.round(v * p)}%`, xs = [x0 + 6, x0 + w * (m.p[0] + m.p[1] / 2) / 100, x0 + w - 6];
  text(n(m.p[0]), xs[0], y + hh + 52, 'disp', 44, m.hb, { align: 'left' }); text('DRAW ' + n(m.p[1]), 540, y + hh + 46, 'mono', 24, 'rgba(255,255,255,0.75)', { align: 'center' });
  text(n(m.p[2]), xs[2], y + hh + 52, 'disp', 44, m.ab, { align: 'right' }); }
function stampPct(t, at, m) { if (t < at) return; const s = spring(t - at, 340, 11), [side, str] = m.stamp, x = side ? 190 : 900, y = side ? 1100 : 560, col = side ? m.ab : m.hb;
  g.save(); g.translate(x, y); g.rotate(-0.12); g.scale(s, s); g.shadowColor = 'rgba(0,0,0,0.6)'; g.shadowBlur = 30; g.beginPath(); g.arc(0, 0, 110, 0, 6.283); g.fillStyle = '#FFFFFF'; g.fill(); g.shadowBlur = 0;
  g.lineWidth = 10; g.strokeStyle = col === '#FFFFFF' ? '#070B1A' : col; g.stroke(); text(str, 0, 32, 'disp', fit(str, 'disp', 84, 180), col === '#FFFFFF' || col === '#FDB912' ? '#070B1A' : col, { align: 'center' }); g.restore(); }
function header(t, k) { text('MATCHDAY · TONIGHT', 60, 200, 'mono', 26, 'rgba(255,255,255,0.75)', { ls: 5 });
  [0, 1, 2].forEach((i) => { g.beginPath(); g.arc(900 + i * 44, 192, i === k ? 12 : 8, 0, 6.283); g.fillStyle = i === k ? PRO.acc : 'rgba(255,255,255,0.3)'; g.fill(); }); }
// one match: panels slide in, VS pops, names, kickoff, last results on the words, probability bar, % stamp
function match(k, o) { const m = M[k];
  return S(() => (K, Sc) => { const fh = sw(o.fh[0], o.fh[1]), fa = sw(o.fa[0], o.fa[1]), bar = sw(o.bar[0], o.bar[1]), st = sw(o.st[0], o.st[1], o.st[2] || 0);
    K(0.05, 'swish', 0.7); K(0.2, 'swish', 0.6); K(0.38, 'boom', 0.9); K(fh, 'pop', 0.8); K(fa, 'pop', 0.8); K(bar, 'riser', 0.5); K(st, 'stamp', 1.1); K(st + 0.02, 'hit', 0.9);
    if (o.k) o.k(K);
    return (t) => { bg(t); header(t, k); const d1 = panel(t, 0.05, HOME, m.hc, 0, m.ph), d2 = panel(t, 0.2, AWAY, m.ac, 1, null);
      name(m.h, 80, 640, 'left', d1 ?? 0, 0.3, t); name(m.a, 1000, 1240, 'right', d2 ?? 0, 0.45, t);
      pillTxt(`${KO} · ${m.city}`, 80, 360, t, 0.5, 'left', { bg: PRO.acc, fg: '#070B1A', size: 26 });
      pillTxt(m.hf, 80, 740, t, fh, 'left'); pillTxt(m.af, 1000, 1370, t, fa, 'right');
      vs(t, 0.38); probBar(t, bar, m); stampPct(t, st, m); if (o.x) o.x(t); }; }); }

VIS.open = (K) => { K(0.05, 'hit', 1.1); K(0.25, 'swish', 0.6); K(0.45, 'swish', 0.6); K(0.65, 'swish', 0.6); K(sw('predict', 2.2), 'stamp', 1.1);
  return (t) => { bg(t); const im = PHOTOS.ultras; if (im) { const sc = Math.max(W / im.width, H / im.height) * (1.15 + 0.05 * t); g.save(); g.globalAlpha = 0.28;
      g.drawImage(im, 540 - im.width * sc / 2, 960 - im.height * sc / 2, im.width * sc, im.height * sc); g.restore(); }
    const a = clamp(t / 0.25); g.save(); g.globalAlpha = a; text('TONIGHT · ' + KO, 540, 330, 'mono', 34, PRO.acc, { align: 'center', ls: 6 });
    text('PREDICT', 540, 500, 'disp', 170, '#FFFFFF', { align: 'center' }); text('ALL 3', 540, 660, 'disp', 170, PRO.acc, { align: 'center' }); g.restore();
    M.forEach((m, i) => { const at = 0.25 + i * 0.2, s = spring(t - at, 260, 18); if (s <= 0.001) return; const y = 830 + i * 170, dx = (1 - s) * (i % 2 ? 1100 : -1100);
      g.save(); g.translate(dx, 0); rrect(70, y, 940, 130, 30); g.fillStyle = 'rgba(7,11,26,0.85)'; g.fill(); g.save(); rrect(70, y, 940, 130, 30); g.clip();
      g.fillStyle = m.hc[0]; g.fillRect(70, y, 20, 130); g.fillStyle = m.ac[0] === '#141414' ? m.ac[1] : m.ac[0]; g.fillRect(990, y, 20, 130); g.restore();
      text(m.h, 120, y + 84, 'disp', fit(m.h, 'disp', 50, 330), '#FFFFFF'); text(m.a, 960, y + 84, 'disp', fit(m.a, 'disp', 50, 330), '#FFFFFF', { align: 'right' });
      text('? – ?', 540, y + 84, 'disp', 50, PRO.acc, { align: 'center' }); g.restore(); }); }; };

VIS[0] = match(0, { fh: ['lost', 2.0], fa: ['beat', 3.4], bar: ['data', 4.6], st: ['forty', 5.2] });
VIS[1] = match(1, { fh: ['anything', 4.0], fa: ['five', 2.4], bar: ['barcelona', 5.0, 1], st: ['seventy', 5.4],
  x: (t) => {} });
VIS[2] = match(2, { fh: ['chance', 3.6], fa: ['five', 2.4], bar: ['chance', 3.6], st: ['four', 4.2], k: (K) => K(sw('upset', 5.2), 'boom', 1),
  x: (t) => { const up = sw('upset', 5.2); if (t > up) pillTxt('UPSET OF THE YEAR?', 540, 862, t, up, 'center', { bg: '#E3101E', fg: '#FFFFFF', size: 40 }); } });

// final: the prediction grid — score boxes with a blinking cursor, "comment your 3 scores"
VIS[3] = S(() => (K, Sc) => { const co = sw('comment', 0.5), to = sw('tomorrow', 2.0);
  K(0.1, 'swish', 0.6); K(co, 'stamp', 1); K(to, 'ding', 0.9);
  return (t) => { bg(t); text('YOUR PREDICTION', 540, 330, 'mono', 32, PRO.acc, { align: 'center', ls: 6 });
    M.forEach((m, i) => { const at = 0.1 + i * 0.15, s = spring(t - at, 260, 18); if (s <= 0.001) return; const y = 420 + i * 250;
      g.save(); g.translate(0, (1 - s) * 60); g.globalAlpha = clamp(s * 1.4); rrect(60, y, 960, 200, 34); g.fillStyle = 'rgba(255,255,255,0.06)'; g.fill(); g.lineWidth = 2; g.strokeStyle = 'rgba(255,255,255,0.14)'; g.stroke();
      g.fillStyle = m.hc[0]; rrect(90, y + 30, 14, 140, 7); g.fill(); g.fillStyle = m.ac[0] === '#141414' ? m.ac[1] : m.ac[0]; rrect(976, y + 30, 14, 140, 7); g.fill();
      text(m.h, 130, y + 72, 'disp', fit(m.h, 'disp', 44, 380), '#FFFFFF'); text(m.a, 950, y + 72, 'disp', fit(m.a, 'disp', 44, 380), '#FFFFFF', { align: 'right' });
      [480, 600].forEach((bx, j) => { rrect(bx - 44, y + 96, 88, 88, 18); g.fillStyle = '#FFFFFF'; g.fill(); const blink = Math.floor((t + i * 0.3 + j * 0.15) * 2) % 2;
        text(blink ? '?' : '', bx, y + 162, 'disp', 56, '#070B1A', { align: 'center' }); }); text('–', 540, y + 156, 'disp', 50, '#FFFFFF', { align: 'center' }); g.restore(); });
    if (t > co) pillTxt('COMMENT YOUR 3 SCORES 👇', 540, 1230, t, co, 'center', { bg: PRO.acc, fg: '#070B1A', size: 38 });
    if (t > to) pillTxt('TOMORROW: WHO WAS RIGHT?', 540, 1350, t, to, 'center', { bg: '#E3101E', fg: '#FFFFFF', size: 34 }); }; });
