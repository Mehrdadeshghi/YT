// Wiki Roulette #112 — HOW IT WORKS #4: contactless payment (your card has no battery). Motion graphics (tech.js kit).
// Retention: frame-1 paradox (no battery, still pays) → X-ray reveals the hidden coil → terminal field flipping 13.56 M×/s →
// induced current wakes the chip → 4 cm limit (card powers on/off as it moves) → one-time code (copy = REJECTED) → payoff + card-or-cash.
const N = 6, CW = 600, CH = 378;
const cEase = (x) => 1 - Math.pow(1 - clamp(x), 3);
// coil = 4 nested rounded-rectangle loops near the card edge, as one polyline
const COIL = (() => { const pts = []; for (let l = 0; l < 4; l++) { const ins = 18 + l * 11, x0 = -CW / 2 + ins, y0 = -CH / 2 + ins, x1 = CW / 2 - ins, y1 = CH / 2 - ins;
    [[x0, y0], [x1, y0], [x1, y1], [x0, y1], [x0, y0 + 11]].forEach((p) => pts.push(p)); } return pts; })();
const COILLEN = COIL.reduce((s, p, i) => i ? s + Math.hypot(p[0] - COIL[i - 1][0], p[1] - COIL[i - 1][1]) : 0, 0);
function coilPt(u) { let d = u * COILLEN; for (let i = 1; i < COIL.length; i++) { const a = COIL[i - 1], b = COIL[i], L = Math.hypot(b[0] - a[0], b[1] - a[1]); if (d <= L) return [lerp(a[0], b[0], d / L), lerp(a[1], b[1], d / L)]; d -= L; } return COIL[COIL.length - 1]; }
function nfcIcon(x, y, s, col, a = 1) { g.save(); g.globalAlpha *= a; g.strokeStyle = col; g.lineWidth = 5 * s; g.lineCap = 'round'; for (let k = 0; k < 4; k++) { g.beginPath(); g.arc(x - 16 * s, y, (12 + k * 13) * s, -0.75, 0.75); g.stroke(); } g.restore(); }
// the bank card. o: { xray 0..1, coil 0..1 (trace progress), flow (current dots), chipOn 0..1, flip (0..1 3D turn), dim }
function bankCard(x, y, s, rot, t, o = {}) { g.save(); g.translate(x, y); g.rotate(rot); g.scale(s * (o.flip != null ? Math.cos(o.flip * Math.PI) : 1), s);
  const xr = o.xray || 0; g.shadowColor = 'rgba(0,0,0,0.6)'; g.shadowBlur = 50; rrect(-CW / 2, -CH / 2, CW, CH, 30);
  const gr = g.createLinearGradient(-CW / 2, -CH / 2, CW / 2, CH / 2); gr.addColorStop(0, `rgba(30,60,140,${1 - 0.8 * xr})`); gr.addColorStop(1, `rgba(10,20,60,${1 - 0.8 * xr})`); g.fillStyle = gr; g.fill(); g.shadowBlur = 0;
  g.lineWidth = 3; g.strokeStyle = xr > 0 ? `rgba(62,230,255,${0.3 + 0.6 * xr})` : 'rgba(255,255,255,0.25)'; g.stroke();
  if (xr < 1) { g.save(); g.globalAlpha = 1 - xr; g.fillStyle = 'rgba(255,255,255,0.08)'; g.beginPath(); g.ellipse(160, -120, 260, 140, -0.4, 0, 6.283); g.fill();
    text('WIKI BANK', -CW / 2 + 40, -CH / 2 + 70, 'disp', 40, '#FFFFFF'); text('••••  ••••  ••••  4242', -CW / 2 + 40, 90, 'mono', 38, '#DDE6F7'); text('M. READER', -CW / 2 + 40, 150, 'mono', 26, '#B9C6E2'); nfcIcon(CW / 2 - 70, -CH / 2 + 60, 1, '#FFFFFF'); g.restore(); }
  if (o.coil > 0) { const n = Math.max(2, Math.floor(o.coil * 200)), pts = []; for (let i = 0; i <= n; i++) pts.push(coilPt(i / 200)); glowLine(pts, '#E8A33D', 5, 0.95); }
  if (o.flow > 0) for (let k = 0; k < 18; k++) { const [px, py] = coilPt(((t * 0.35 + k / 18) % 1)); glowDot(px, py, 7, CY, o.flow); }
  const on = o.chipOn || 0; g.save(); g.translate(-CW / 2 + 110, -20); if (on > 0) { g.shadowColor = LIME; g.shadowBlur = 50 * on; }
  rrect(-50, -38, 100, 76, 12); const cg = g.createLinearGradient(-50, -38, 50, 38); cg.addColorStop(0, '#F5D77A'); cg.addColorStop(1, '#B8892E'); g.fillStyle = cg; g.fill(); g.shadowBlur = 0;
  g.strokeStyle = 'rgba(90,60,10,0.7)'; g.lineWidth = 2.5; g.beginPath(); g.moveTo(-50, -12); g.lineTo(-15, -12); g.lineTo(-15, -38); g.moveTo(50, -12); g.lineTo(15, -12); g.lineTo(15, -38); g.moveTo(-50, 14); g.lineTo(-15, 14); g.lineTo(-15, 38); g.moveTo(50, 14); g.lineTo(15, 14); g.lineTo(15, 38); g.stroke();
  if (on > 0) { g.fillStyle = `rgba(182,255,62,${0.5 * on})`; rrect(-50, -38, 100, 76, 12); g.fill(); } g.restore();
  if (o.dim) { g.fillStyle = `rgba(0,0,0,${o.dim})`; rrect(-CW / 2, -CH / 2, CW, CH, 30); g.fill(); } g.restore(); }
// payment terminal seen from the front
function terminal(x, y, s, t, o = {}) { g.save(); g.translate(x, y); g.scale(s, s); g.shadowColor = 'rgba(0,0,0,0.7)'; g.shadowBlur = 50;
  rrect(-210, -300, 420, 600, 50); g.fillStyle = '#1A1E26'; g.fill(); g.shadowBlur = 0; g.lineWidth = 4; g.strokeStyle = '#3A4252'; g.stroke();
  rrect(-170, -260, 340, 230, 20); g.fillStyle = o.ok ? '#0E3B1E' : '#0A1830'; g.fill();
  if (o.ok) { g.strokeStyle = LIME; g.lineWidth = 16; g.lineCap = 'round'; g.beginPath(); g.moveTo(-60, -150); g.lineTo(-15, -100); g.lineTo(70, -190); g.stroke(); }
  else { text(o.amount || '€ 4.20', 0, -160, 'disp', 64, '#FFFFFF', { align: 'center' }); text('TAP TO PAY', 0, -85, 'mono', 26, CY, { align: 'center' }); }
  nfcIcon(16, 90, 1.6, o.ok ? LIME : '#FFFFFF', 0.9); for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) { rrect(-110 + c * 80, 170 + r * 40, 60, 28, 8); g.fillStyle = '#2B3240'; g.fill(); } g.restore(); }
function readerPad(x, y, t, ok) { g.save(); g.translate(x, y); g.shadowColor = 'rgba(0,0,0,0.7)'; g.shadowBlur = 40; rrect(-300, -40, 600, 90, 22); g.fillStyle = '#1A1E26'; g.fill(); g.shadowBlur = 0; g.lineWidth = 4; g.strokeStyle = '#3A4252'; g.stroke();
  g.fillStyle = ok ? LIME : CY; g.shadowColor = g.fillStyle; g.shadowBlur = 20; rrect(-120, -40, 240, 8, 4); g.fill(); g.restore(); nfcIcon(x + 16, y + 6, 0.9, ok ? LIME : '#FFFFFF', 0.9); text(ok ? 'APPROVED ✓' : 'TERMINAL', x + 290, y + 88, 'mono', 26, ok ? LIME : '#9FB3CF', { align: 'right' }); }
// magnetic field loops above a point, polarity flipping (colour swap) with the AC field
function field(x, y, t, a = 1, h = 1, hz = 6) { const ph = Math.sin(t * hz * 6.283) > 0; for (let k = 1; k <= 5; k++) { const wk = 70 + k * 70, hk = (90 + k * 85) * h;
    [-1, 1].forEach((sd) => { g.save(); g.globalAlpha = a * (1 - k * 0.12); g.strokeStyle = (ph ^ (sd > 0)) ? CY : MG; g.lineWidth = 4; g.shadowColor = g.strokeStyle; g.shadowBlur = 16; g.setLineDash([18, 12]); g.lineDashOffset = (ph ? 1 : -1) * t * 90;
      g.beginPath(); g.moveTo(x, y); g.bezierCurveTo(x, y - hk * 1.35, x + sd * wk * 1.6, y - hk * 1.1, x + sd * wk * 1.2, y + 20); g.stroke(); g.restore(); }); } }
function banknote(x, y, s, rot) { g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s); g.shadowColor = 'rgba(0,0,0,0.5)'; g.shadowBlur = 30; rrect(-300, -150, 600, 300, 20); g.fillStyle = '#5E9E6E'; g.fill(); g.shadowBlur = 0;
  g.strokeStyle = 'rgba(255,255,255,0.5)'; g.lineWidth = 4; rrect(-270, -120, 540, 240, 14); g.stroke(); g.beginPath(); g.arc(0, 0, 80, 0, 6.283); g.stroke(); text('20', 0, 30, 'disp', 90, '#FFFFFF', { align: 'center' }); g.restore(); }

// ---------- scenes ----------
VIS.open = (K) => { const pa = sw('pay', 2.6); K(0.05, 'hit', 1.3); K(0.4, 'wrong', 1); ks(K, drop(pa, 0.35)); K(pa + 0.15, 'ding', 1.1);
  return (t) => { techBg(t, '#04070F', '#0D1F3A'); const fl = t < pa ? (t * 0.25) % 1 : 0, mv = cEase((t - pa + 0.3) / 0.4);
    if (t > pa - 0.3) { readerPad(540, 1150, t, t > pa); if (t > pa) { field(540, 1110, t, 0.7, 0.8); shock(540, 1110, t, pa, 380, LIME); } }
    bankCard(540, lerp(900, 930, mv), lerp(1.25, 0.85, mv), lerp(-0.12, -0.05, mv), t, { flip: t < pa ? Math.sin(t * 1.4) * 0.12 : 0, chipOn: t > pa ? 1 : 0 });
    if (t < pa) { g.save(); g.translate(820, 760); g.globalAlpha = clamp((t - 0.3) / 0.3); rrect(-90, -45, 170, 90, 14); g.lineWidth = 7; g.strokeStyle = RED2; g.stroke(); g.fillStyle = RED2; g.fillRect(84, -18, 14, 36);
      g.fillStyle = 'rgba(255,59,78,0.25)'; g.fillRect(-80, -35, 18, 70); text('0%', -5, 16, 'disp', 44, RED2, { align: 'center' }); g.restore(); }
    tag(t); hook(t, EP.hook, 400); if (EP.series) chip(EP.series, 80, 300, t, -0.3, { size: 26, align: 'left', bg: GOLD, fg: BG }); if (t > pa) lot(t, pa + 0.1, 'mindblown', 900, 760, 130); }; };

VIS[0] = S(() => { const hi = sw('hidden', 0.3), co = sw('coil', 1.2), ed = sw('edge', 2.6);
  return (K) => { ks(K, [[hi, 'glitch', 0.8], [co, 'zap', 0.8], [co + 0.6, 'swish', 0.6], [ed, 'pop', 0.8, 700]]);
    return (t) => { techBg(t, '#030810', '#0A1A30'); tag(t, 0, N); const xr = clamp((t - hi) / 0.5);
      if (xr > 0) { g.save(); g.strokeStyle = `rgba(62,230,255,${0.25 * xr})`; g.lineWidth = 2; for (let k = 0; k < 14; k++) { const yy = 620 + ((t * 180 + k * 60) % 840); g.beginPath(); g.moveTo(140, yy); g.lineTo(940, yy); g.stroke(); } g.restore(); }
      bankCard(540, 900, 1.25, 0, t, { xray: xr, coil: clamp((t - co) / 1.2) });
      if (t > hi) rgbText('X-RAY', 540, 470, 120, t, hi, { color: CY, jitter: true });
      if (t > co + 0.4) chip('ANTENNA COIL · 4 LOOPS (SIMPLIFIED)', 540, 560, t, co + 0.4, { size: 28, bg: GOLD, fg: BG });
      if (t > ed) { framed(t, 'antenna', 120, 1130, 420, { b: [0.5, 0.5, 1.08], backdrop: false }); realBadge(t, ed, 'REAL PHOTO · CONTACTLESS CARD OPENED, ANTENNA VISIBLE', 1100); } }; }; });

VIS[1] = S(() => { const te = sw('terminal', 0.6), ma = sw('magnetic', 1.3), fl = sw('flips', 2.6), th = sw('thirteen', 3.0);
  return (K) => { ks(K, [[te, 'pop', 0.8, 600], [ma, 'zap', 0.9], [fl, 'glitch', 0.7], ...drop(th, 0.35)]); for (let k = 0; k < 8; k++) K(ma + 0.2 + k * 0.18, 'tick', 0.4);
    return (t) => { techBg(t, '#06040F', '#1A0B2E'); tag(t, 1, N); terminal(540, 1160, 0.95, t);
      if (t > ma) field(540, 1060, t, clamp((t - ma) / 0.4), 1, t > fl ? 14 : 3);
      if (t > ma && t < th) rgbText('MAGNETIC FIELD', 540, 470, 96, t, ma, { color: MG });
      if (t > th) { const v = Math.round(13560000 * cEase((t - th) / 0.7)); rgbText(v.toLocaleString('en-US'), 540, 470, 112, t, th, { color: CY, jitter: true }); chip('FLIPS PER SECOND · 13.56 MHz', 540, 560, t, th + 0.2, { size: 30, bg: CY, fg: BG }); } }; }; });

VIS[2] = S(() => { const cu = sw('current', 1.1), co = sw('coil', 1.8), wa = sw('wakes', 2.6), ch = sw('chip', 3.0);
  return (K) => { ks(K, [[0.2, 'whoosh', 0.7], [cu, 'zap', 0.9], [wa, 'mute', 1, 0.3], [ch, 'boom', 1], [ch + 0.02, 'ding', 1.1]]);
    return (t) => { techBg(t, '#030810', '#0A1A30'); tag(t, 2, N); readerPad(540, 1150, t, t > ch); field(540, 1110, t, 0.85, 0.9, 6);
      const dn = cEase((t - 0.1) / 0.6); bankCard(540, lerp(560, 830, dn), 1.0, -0.04, t, { xray: 0.85, coil: 1, flow: t > cu ? clamp((t - cu) / 0.4) : 0, chipOn: t > ch ? 1 : 0 });
      if (t > cu && t < ch) chip('INDUCED CURRENT', 540, 470, t, cu, { size: 40, bg: CY, fg: BG });
      if (t > ch) { rgbText('CHIP: ON', 540, 470, 120, t, ch, { color: LIME }); shock(540 - 110, 810, t, ch, 260, LIME); flash(t, ch, 0.35, 0.1, '#D8FFB0'); } }; }; });

VIS[3] = S(() => { const fo = sw('four', 0.9), ta = sw('tap', 2.6);
  return (K) => { ks(K, [[0.3, 'swish', 0.6], ...drop(fo, 0.35), [ta, 'pop', 0.9, 600]]);
    return (t) => { if (t > ta) { const P = shot(t, 'tapcard', { a: [0.5, 0.5, 1.1], b: [0.5, 0.5, 1.25], dur: 2, t0: ta }); if (!P) noPhoto(t); tag(t, 3, N); realBadge(t, ta + 0.05, 'REAL PHOTO · CONTACTLESS CARD PAYMENT'); return; }
      techBg(t, '#030810', '#0A1A30'); tag(t, 3, N); const base = 1150, cm = 70, d = 1.2 + 5.5 * (0.5 + 0.5 * Math.cos(t * 2.4)), y = base - d * cm, on = d < 4;
      g.save(); rrect(260, base, 560, 70, 16); g.fillStyle = '#1A1E26'; g.fill(); g.lineWidth = 4; g.strokeStyle = '#3A4252'; g.stroke(); g.restore(); text('TERMINAL', 540, base + 48, 'mono', 26, '#9FB3CF', { align: 'center' });
      field(540, base, t, 0.6, 0.85, 5);
      g.save(); g.strokeStyle = 'rgba(255,255,255,0.55)'; g.lineWidth = 3; g.beginPath(); g.moveTo(880, base); g.lineTo(880, base - 8 * cm); g.stroke(); for (let k = 0; k <= 8; k++) { g.beginPath(); g.moveTo(870, base - k * cm); g.lineTo(890, base - k * cm); g.stroke(); text(`${k}`, 905, base - k * cm + 9, 'mono', 24, 'rgba(255,255,255,0.7)'); } g.restore();
      g.save(); g.setLineDash([12, 10]); g.strokeStyle = LIME; g.lineWidth = 3; g.beginPath(); g.moveTo(240, base - 4 * cm); g.lineTo(860, base - 4 * cm); g.stroke(); g.restore(); text('4 CM', 250, base - 4 * cm - 14, 'mono', 28, LIME);
      g.save(); g.translate(540, y); rrect(-260, -12, 520, 24, 10); g.fillStyle = on ? '#2B66C8' : '#1B2B4A'; g.shadowColor = on ? LIME : 'transparent'; g.shadowBlur = on ? 30 : 0; g.fill(); g.restore();
      glowDot(420, y, 12, on ? LIME : '#3A4252', 1); text(on ? 'POWER ✓' : 'NO POWER', 540, y - 40, 'mono', 34, on ? LIME : RED2, { align: 'center' });
      if (t > fo) rgbText('~4 CM', 540, 470, 140, t, fo, { color: LIME }); }; }; });

VIS[4] = S(() => { const ev = sw('every', 0.3), on = sw('one', 1.6), co = sw('copy', 2.8), us = sw('useless', 3.4);
  return (K) => { ks(K, [[ev, 'type', 0.9], [on, 'ding', 0.9], [co, 'swish', 0.8], [us, 'wrong', 1.1], [us + 0.02, 'glitch', 0.9]]);
    return (t) => { techBg(t, '#04060E', '#0D1730'); tag(t, 4, N); const rows = Math.min(5, 1 + Math.floor(Math.max(0, t - ev) / 0.45)), r = rng(Math.floor(t * 20));
      for (let i = 0; i < rows; i++) { const y = 640 + i * 105, live = i === rows - 1, code = Array.from({ length: 8 }, (_, k) => '0123456789ABCDEF'[(i * 7 + k * 5 + (live && t - ev - i * 0.45 < 0.3 ? Math.floor(r() * 16) : 3)) % 16]).join('');
        g.save(); rrect(140, y - 50, 800, 90, 18); g.fillStyle = 'rgba(8,16,30,0.9)'; g.fill(); g.lineWidth = 3; g.strokeStyle = live ? GOLD : 'rgba(255,255,255,0.15)'; g.stroke(); g.restore();
        text(`PAYMENT ${i + 1}`, 175, y + 10, 'mono', 30, '#9FB3CF'); text(code.slice(0, 4) + '-' + code.slice(4), 905, y + 14, 'mono', 44, live ? GOLD : '#FFFFFF', { align: 'right' }); }
      if (t > on && t < co) rgbText('NEW CODE EVERY TIME', 540, 470, 80, t, on, { color: GOLD });
      if (t > co) { const p = cEase((t - co) / 0.5); g.save(); g.globalAlpha = 0.9; g.translate(lerp(540, 540, p), lerp(640 + (rows - 1) * 105, 1260, p)); rrect(-300, -50, 600, 90, 18); g.fillStyle = 'rgba(255,59,78,0.2)'; g.fill(); g.setLineDash([10, 8]); g.lineWidth = 3; g.strokeStyle = RED2; g.stroke(); text('COPIED CODE', 0, 12, 'mono', 34, RED2, { align: 'center' }); g.restore(); }
      if (t > us) { rgbText('REJECTED', 540, 470, 130, t, us, { color: RED2, jitter: true }); g.save(); g.strokeStyle = RED2; g.lineWidth = 14; g.lineCap = 'round'; g.shadowColor = RED2; g.shadowBlur = 24; g.beginPath(); g.moveTo(830, 1200); g.lineTo(910, 1280); g.moveTo(910, 1200); g.lineTo(830, 1280); g.stroke(); g.restore(); } }; }; });

VIS[5] = S(() => { const ne = sw('never', 0.6), le = sw('lends', 2.0), ca = sw('card', 4.6, 1), cs = sw('cash', 5.0);
  return (K) => { ks(K, [[ne, 'swish', 0.7], ...drop(le, 0.4), [ca, 'pop', 0.9, 600], [cs, 'pop', 0.9, 800]]);
    return (t) => { techBg(t, '#04070F', '#0D1F3A'); tag(t, 5, N); readerPad(540, 1150, t, t > le); field(540, 1110, t, 0.8, 0.9, 6);
      if (t < ca) { bankCard(540, 830, 1.0, -0.04, t, { xray: t > le ? 0.6 : 0, coil: t > le ? 1 : 0, flow: t > le ? 1 : 0, chipOn: t > le ? 1 : 0 });
        if (t > le) { for (let k = 0; k < 4; k++) tsBoltLite(470 + k * 50, 1110, 430 + k * 60, 900, t, k); rgbText('BORROWED POWER', 540, 470, 96, t, le, { color: CY, jitter: true }); } }
      else { bankCard(330, 860, 0.62, -0.12, t, { chipOn: 1 }); banknote(760, 860, 0.62, 0.1); chip('CARD', 330, 1060, t, ca, { size: 40, bg: CY, fg: BG }); if (t > cs) chip('CASH', 760, 1060, t, cs, { size: 40, bg: LIME, fg: BG }); lot(t, ca, 'think', 540, 620, 130); } }; }; });
function tsBoltLite(x1, y1, x2, y2, t, seed) { const r = rng(Math.floor(t * 16) * 13 + seed), pts = []; for (let i = 0; i <= 8; i++) { const u = i / 8, off = (i && i < 8) ? (r() - 0.5) * 60 * Math.sin(Math.PI * u) : 0; pts.push([lerp(x1, x2, u) + off, lerp(y1, y2, u)]); } glowLine(pts, CY, 8, 0.5); glowLine(pts, '#FFFFFF', 3, 0.9); }
