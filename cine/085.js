// Wiki Roulette #085 — The 100-year calendar: winter 2026/27 (English, real footage + calendar graphics)
const N = 11, ICE = '#9ED8FF', RAIN = '#5AA9FF';
const KMON = ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'];
// ---- icons ----
function flake(x, y, r, col = '#FFFFFF', rot = 0) {
  g.save(); g.translate(x, y); g.rotate(rot); g.strokeStyle = col; g.lineWidth = Math.max(2, r * 0.13); g.lineCap = 'round';
  for (let k = 0; k < 6; k++) { g.rotate(Math.PI / 3); g.beginPath(); g.moveTo(0, 0); g.lineTo(0, -r);
    g.moveTo(0, -r * 0.55); g.lineTo(-r * 0.25, -r * 0.78); g.moveTo(0, -r * 0.55); g.lineTo(r * 0.25, -r * 0.78); g.stroke(); }
  g.restore();
}
function drop(x, y, r, col = RAIN) { g.save(); g.translate(x, y); g.fillStyle = col; g.beginPath(); g.moveTo(0, -r * 1.25); g.bezierCurveTo(r * 0.9, -r * 0.1, r * 0.9, r, 0, r); g.bezierCurveTo(-r * 0.9, r, -r * 0.9, -r * 0.1, 0, -r * 1.25); g.fill(); g.restore(); }
// ---- tear-off calendar page: springs in; icon 'snow' | 'rain' | 'ice' | null ----
function calPage(t, tIn, x, y, s, day, month, icon, o = {}) {
  const sp = spring(t - tIn, 200, 16); if (sp <= 0.001) return;
  const w = 400 * s, h = 470 * s;
  g.save(); g.translate(x, y + (1 - sp) * 260); g.rotate((o.rot ?? -0.05) * sp + (1 - sp) * 0.5); g.globalAlpha = clamp(sp * 2);
  g.shadowColor = 'rgba(0,0,0,0.55)'; g.shadowBlur = 40; g.shadowOffsetY = 14; rrect(-w / 2, -h / 2, w, h, 26 * s); g.fillStyle = PAPER; g.fill(); g.shadowBlur = 0; g.shadowOffsetY = 0;
  g.save(); rrect(-w / 2, -h / 2, w, h, 26 * s); g.clip(); g.fillStyle = o.band || RED; g.fillRect(-w / 2, -h / 2, w, 110 * s); g.restore();
  text(month, 0, -h / 2 + 76 * s, 'ui', fit(month, 'ui', 54 * s, w - 50 * s), '#FFFFFF', { align: 'center' });
  for (const bx of [-w * 0.28, w * 0.28]) { g.fillStyle = '#2B2A28'; rrect(bx - 11 * s, -h / 2 - 26 * s, 22 * s, 56 * s, 11 * s); g.fill(); }
  const ds = icon ? 210 : 250; text(day, 0, icon ? 95 * s : 120 * s, 'disp', fit(day, 'disp', ds * s, w - 40 * s), '#1A1714', { align: 'center' });
  if (icon === 'snow' || icon === 'ice') flake(0, 165 * s, 38 * s, icon === 'ice' ? '#3A8FD0' : '#3A8FD0', t * 0.6);
  if (icon === 'rain') { drop(-50 * s, 165 * s, 22 * s); drop(0, 175 * s, 22 * s); drop(50 * s, 165 * s, 22 * s); }
  g.restore();
}
// ---- December 2026 month grid (1 Dec 2026 = Tuesday); marks: {day: ['snow'|'rain', tIn]} ----
function decGrid(t, tIn, marks, o = {}) {
  const lt = t - tIn; if (lt < 0) return; const a = clamp(lt / 0.3), x0 = 85, y0 = o.y ?? 780, cw = 130, ch = 82;
  g.save(); g.globalAlpha = a; g.translate(0, (1 - easeOut(clamp(lt / 0.4))) * 60);
  panel(x0 - 20, y0 - 80, 7 * cw + 40, 6 * ch + 70, 0.82);
  text('DECEMBER 2026', x0, y0 - 30, 'mono', 30, GOLD, { ls: 5 });
  text('100-YEAR CALENDAR', x0 + 7 * cw, y0 - 30, 'mono', 22, DIM, { ls: 3, align: 'right' });
  KMON.forEach((d, i) => text(d, x0 + i * cw + cw / 2, y0 + 22, 'mono', 24, DIM, { align: 'center' }));
  for (let d = 1; d <= 31; d++) {
    const idx = d + 0, col = idx % 7, row = Math.floor(idx / 7), cx = x0 + col * cw + cw / 2, cy = y0 + 40 + row * ch + ch / 2;
    const m = marks[d], on = m && t >= m[1], ms = m ? spring(t - m[1], 300, 16) : 0;
    if (on) { g.save(); g.translate(cx, cy); g.scale(ms, ms); rrect(-cw / 2 + 6, -ch / 2 + 5, cw - 12, ch - 10, 16); g.fillStyle = m[0] === 'rain' ? 'rgba(90,169,255,0.28)' : 'rgba(255,255,255,0.22)'; g.fill();
      g.lineWidth = 3; g.strokeStyle = m[0] === 'rain' ? RAIN : '#FFFFFF'; g.stroke(); g.restore(); }
    text(String(d), cx - (on ? 26 : 0), cy + 13, 'ui', 36, d === 24 || d === 31 ? GOLD : TXT, { align: 'center' });
    if (on && m[0] === 'snow') flake(cx + 30, cy, 18 * ms, '#FFFFFF', t);
    if (on && m[0] === 'rain') drop(cx + 30, cy + 4, 12 * ms);
  }
  g.restore();
}
// "Prognose" chip: makes clear these are the calendar's predictions, not a weather service forecast
const prog = (t) => chip('FORECAST · 100-YEAR CALENDAR', 80, 440, t, 0.35, { size: 22, align: 'left', bg: 'rgba(12,11,10,0.78)', fg: GOLD });
const dim = (a) => { g.fillStyle = `rgba(8,8,10,${a})`; g.fillRect(0, 0, W, H); };
const icyEdge = (t, a = 1) => { const gr = g.createRadialGradient(W / 2, H / 2, H * 0.25, W / 2, H / 2, H * 0.62); gr.addColorStop(0, 'rgba(158,216,255,0)'); gr.addColorStop(1, `rgba(158,216,255,${0.35 * a})`); g.fillStyle = gr; g.fillRect(0, 0, W, H); };
// ---- planet wheel (cycle order of the calendar) ----
const PLAN = ['SATURN', 'JUPITER', 'MARS', 'SUN', 'VENUS', 'MERCURY', 'MOON'];
const PCOL = ['#D9B77A', '#E8A16B', '#FF5A3C', '#FFC23D', '#F2E3B5', '#B8C4D0', '#E9E9F0'];
function wheel(t, tIn, cx, cy, R, rot, hi) {
  const lt = t - tIn; if (lt < 0) return; const sp = spring(lt, 200, 18);
  g.save(); g.translate(cx, cy); g.scale(sp, sp);
  g.beginPath(); g.arc(0, 0, R, 0, 6.283); g.fillStyle = 'rgba(12,11,10,0.72)'; g.fill(); g.lineWidth = 3; g.strokeStyle = 'rgba(255,194,61,0.45)'; g.stroke();
  g.setLineDash([8, 12]); g.beginPath(); g.arc(0, 0, R * 0.62, 0, 6.283); g.strokeStyle = 'rgba(255,255,255,0.18)'; g.stroke(); g.setLineDash([]);
  PLAN.forEach((p, i) => { const a = rot + i / 7 * 6.283 - Math.PI / 2, x = Math.cos(a) * R * 0.78, y = Math.sin(a) * R * 0.78, isHi = hi === i;
    const r = isHi ? 46 : 32; if (isHi) glowDot(x, y, 120, '255,194,61', 0.6);
    g.beginPath(); g.arc(x, y, r, 0, 6.283); g.fillStyle = PCOL[i]; g.fill();
    if (p === 'SATURN') { g.save(); g.translate(x, y); g.rotate(-0.4); g.beginPath(); g.ellipse(0, 0, r * 1.7, r * 0.45, 0, 0, 6.283); g.lineWidth = 5; g.strokeStyle = '#F2E3B5'; g.stroke(); g.restore(); }
    text(p, x, y + r + 34, 'mono', isHi ? 30 : 22, isHi ? GOLD : TXT, { align: 'center', ls: 2 }); });
  text('7', 0, 40, 'disp', 120, GOLD, { align: 'center' }); text('YEARS', 0, 80, 'mono', 24, TXT, { align: 'center', ls: 4 });
  g.restore();
}

// ---------------- scenes ----------------
VIS.open = (K) => { K(0.15, 'hit', 1.3); K(0.2, 'mute', 1, 0.4); K(0.9, 'whoosh', 0.6); K(1.15, 'thump', 1); K(1.8, 'pop', 0.7);
  return (t) => { atmosphere(t); const P = clip(t, 'snow', { a: [0.5, 0.5, 1.0], b: [0.5, 0.5, 1.12], dur: 4 }); if (!P) noPhoto(t); dim(0.25);
    snowfall(t, 140, 0.8, 85); tag(t); hook(t, EP.hook, 480);
    calPage(t, 0.9, 540, 1080, 1.05, '1', 'DECEMBER', 'snow', { rot: -0.06 }); }; };

VIS[0] = (K) => { K(0.5, 'whoosh', 0.5); K(0.8, 'hit', 1);
  return (t) => { atmosphere(t); const P = shot(t, 'rhoen', { a: [0.66, 0.5, 1.0], b: [0.69, 0.47, 1.15], dur: 5, anchor: [540, 900] }); if (!P) noPhoto(t); dim(0.15); icyEdge(t);
    tag(t, 0, N); realBadge(t, 0.3, 'REAL PHOTO · HOARFROST, GERMANY'); prog(t); fact(t, 0.8, 'FROST', 'FROM NOVEMBER 16', { color: ICE });
    calPage(t, 1.1, 780, 1000, 0.6, '16', 'NOVEMBER', 'ice', { rot: 0.07, band: '#3A8FD0' }); }; };

VIS[1] = (K) => { K(0.5, 'whoosh', 0.5); K(0.8, 'hit', 1); K(1.1, 'pop', 0.6); K(1.5, 'pop', 0.8);
  return (t) => { atmosphere(t); const P = clip(t, 'styria', { a: [0.5, 0.5, 1.0], b: [0.5, 0.5, 1.1] }); if (!P) noPhoto(t); dim(0.3); snowfall(t, 80, 0.5, 7);
    tag(t, 1, N); footBadge(t, 0.3, 'ILLUSTRATIVE FOOTAGE'); prog(t); fact(t, 0.8, 'DECEMBER 5', 'SNOW AGAIN');
    decGrid(t, 0.5, { 1: ['snow', 1.1], 5: ['snow', 1.5] }); }; };

VIS[2] = (K) => { K(0.5, 'whoosh', 0.5); K(0.7, 'pop', 0.7); K(1.3, 'crack', 0.9); K(1.32, 'hit', 1.2);
  return (t) => { atmosphere(t); const P = clip(t, 'rain2', { a: [0.5, 0.5, 1.0], b: [0.5, 0.5, 1.1] }); if (!P) noPhoto(t); dim(0.3);
    tag(t, 2, N); footBadge(t, 0.3, 'ILLUSTRATIVE FOOTAGE'); prog(t);
    rgbPop('WHITE', 80, 600, 150, TXT, t, 0.3); rgbPop('CHRISTMAS?', 80, 740, fit('CHRISTMAS?', 'disp', 150, 920), GOLD, t, 0.45);
    calPage(t, 0.7, 540, 1050, 0.75, '24', 'DECEMBER', 'rain', { rot: 0.04 });
    g.save(); g.translate(shake(t, 1.3, 14), 0); stampText('PROBABLY NOT', 560, 1080, t, 1.3, { size: 96, rot: -0.12 }); g.restore(); }; };

VIS[3] = (K) => { K(0.5, 'whoosh', 0.5); K(0.8, 'hit', 1); for (let d = 20; d <= 28; d++) K(1.0 + (d - 20) * 0.13, 'tick', 0.6);
  return (t) => { atmosphere(t); const P = clip(t, 'rain3', { a: [0.5, 0.5, 1.0], b: [0.5, 0.5, 1.1] }); if (!P) noPhoto(t); dim(0.3);
    tag(t, 3, N); footBadge(t, 0.3, 'ILLUSTRATIVE FOOTAGE'); prog(t); fact(t, 0.8, 'DEC 20–28', 'MOSTLY RAIN · SNOW ONLY UP HIGH', { color: RAIN });
    const m = { 1: ['snow', -1], 5: ['snow', -1] }; for (let d = 20; d <= 28; d++) m[d] = ['rain', 1.0 + (d - 20) * 0.13];
    decGrid(t, 0.0, m); }; };

VIS[4] = (K) => { K(0.5, 'whoosh', 0.5); K(0.8, 'hit', 1.1); K(1.0, 'pop', 0.7); K(1.15, 'pop', 0.7); K(1.3, 'pop', 0.8); K(2.6, 'crack', 0.9); K(2.62, 'thump', 1);
  return (t) => { atmosphere(t); const fire = RT != null && RT - PRE > 2.5;
    const P = fire ? clip(t, 'fire', { a: [0.5, 0.5, 1.0], b: [0.5, 0.5, 1.05], t0: 2.5 }) : clip(t, 'bliz', { a: [0.5, 0.5, 1.0], b: [0.5, 0.5, 1.1] }); if (!P) noPhoto(t);
    dim(0.3); if (!fire) snowfall(t, 200, 0.9, 29); icyEdge(t, 0.8); if (fire) flash(RT - PRE, 2.5, 0.5, 0.1);
    tag(t, 4, N); footBadge(t, 0.3, 'ILLUSTRATIVE FOOTAGE'); prog(t); fact(t, 0.8, 'DEC 29–31', 'HEAVY SNOW · ICY COLD', { color: '#FFFFFF' });
    if (!fire) { const m = { 1: ['snow', -1], 5: ['snow', -1], 29: ['snow', 1.0], 30: ['snow', 1.15], 31: ['snow', 1.3] }; for (let d = 20; d <= 28; d++) m[d] = ['rain', -1]; decGrid(t, 0.0, m); } }; };

VIS[5] = (K) => { K(0.5, 'whoosh', 0.5); K(0.8, 'hit', 1); K(1.2, 'thump', 0.8);
  return (t) => { atmosphere(t); const P = clip(t, 'berlin', { a: [0.6, 0.5, 1.0], b: [0.6, 0.5, 1.1] }); if (!P) noPhoto(t); dim(0.2); icyEdge(t, 1.2); snowfall(t, 60, 0.4, 3);
    tag(t, 5, N); footBadge(t, 0.3, 'ILLUSTRATIVE FOOTAGE'); prog(t); fact(t, 0.8, 'JANUARY', 'ALMOST ALL MONTH: BITTER COLD', { color: ICE });
    calPage(t, 1.1, 540, 1030, 0.75, '1–29', 'JANUARY 2027', 'ice', { band: '#3A8FD0', rot: -0.04 }); }; };

VIS[6] = (K) => { K(0.4, 'riser', 0.5, 1); K(0.8, 'hit', 1.1);
  return (t) => { atmosphere(t); shot(t, 'knauer', { a: [0.5, 0.3, 1.0], b: [0.5, 0.3, 1.0], o: {}, dur: 3, box: [0, 0, W, H] }) && dim(0.75);
    const bx = [290, 690, 500, 470], P = shot(t, 'knauer', { box: bx, a: [0.5, 0.36, 1.25], b: [0.5, 0.34, 1.38], dur: 4 }); if (!P) noPhoto(t);
    g.save(); g.lineWidth = 6; g.strokeStyle = GOLD; g.shadowColor = 'rgba(0,0,0,0.6)'; g.shadowBlur = 20; g.strokeRect(bx[0], bx[1], bx[2], bx[3]); g.restore();
    tag(t, 6, N); realBadge(t, 0.3, 'REAL PORTRAIT · ENGRAVING');
    rgbPop('ABBOT MAURITIUS', 80, 520, fit('ABBOT MAURITIUS', 'disp', 120, 920), TXT, t, 0.6); rgbPop('KNAUER', 80, 620, 110, GOLD, t, 0.8);
    label('LIVED 1613–1664', 294, 1200, t, 1.2, { size: 28, color: TXT }); }; };

VIS[7] = (K) => { K(0.5, 'whoosh', 0.5); K(0.8, 'hit', 1); K(1.6, 'tick', 0.7); K(2.4, 'tick', 0.7);
  return (t) => { atmosphere(t); shot(t, 'kloster', { a: [0.5, 0.5, 1.0], b: [0.5, 0.5, 1.1], dur: 6 }) && dim(0.6);
    const P = framed(t, 'langheim', 130, 710, 820, { a: [0.5, 0.5, 1.0], b: [0.45, 0.5, 1.12], dur: 6 }); if (!P) noPhoto(t);
    tag(t, 7, N); realBadge(t, 0.3, 'LANGHEIM ABBEY, GERMANY · DRAWING, 1800');
    fact2(t, 0.6, '7 YEARS', 'WEATHER DIARY', null, { y: 520, size: 120 });
    const lt = t - 1.4; if (lt > 0) { const yr = Math.min(1658, 1652 + Math.floor(lt * 5)); g.save(); g.fillStyle = 'rgba(12,11,10,0.8)'; rrect(650, 730, 290, 120, 20); g.fill(); g.restore(); popNum(String(yr), 920, 825, 96, GOLD, t, 1.4, { align: 'right' }); } }; };

VIS[8] = (K) => { K(0.5, 'whoosh', 0.5); K(0.8, 'hit', 1); K(1.2, 'riser', 0.4, 1);
  return (t) => { atmosphere(t); const P = shot(t, 'kal', { a: [0.5, 0.3, 1.0], b: [0.5, 0.32, 1.12], dur: 5 }); if (!P) noPhoto(t); dim(0.5);
    tag(t, 8, N); realBadge(t, 0.3, 'REAL PRINT · "HUNDERTJÄHRIGER KALENDER", 1924');
    fact2(t, 0.6, '7 PLANETS.', '1 YEAR EACH.', null, { y: 540, size: 120 });
    wheel(t, 0.8, 540, 1020, 330, -t * 0.9, -1); }; };

VIS[9] = (K) => { K(0.3, 'whoosh', 0.5); K(1.1, 'hit', 1.2); K(1.12, 'crack', 0.7);
  return (t) => { atmosphere(t); const P = shot(t, 'kal', { a: [0.5, 0.32, 1.12], b: [0.5, 0.35, 1.25], dur: 5 }); if (!P) noPhoto(t); dim(0.62);
    // keep spinning, then land with MERCURY (index 5) at the top
    const target = -5 / 7 * 6.283, p = easeOut(clamp(t / 1.1)), rot = lerp(target + 3.2, target, p);
    tag(t, 9, N); wheel(t, -1, 540, 1020, 330, rot, t > 1.0 ? 5 : -1);
    popNum('2026', 80, 600, 150, TXT, t, 0.2); rgbPop('MERCURY YEAR', 80, 740, fit('MERCURY YEAR', 'disp', 140, 920), GOLD, t, 1.1);
    if (t > 1.0) { const s = spring(t - 1.0, 260, 18), y = 1020 - 330 - 20; g.save(); g.translate(540, y); g.scale(s, s); g.fillStyle = GOLD; g.beginPath(); g.moveTo(-26, -34); g.lineTo(26, -34); g.lineTo(0, 6); g.fill(); g.restore(); }
    label('"MORE COLD THAN WARM"', 84, 1470, t, 1.5, { size: 32, color: ICE }); }; };

VIS[10] = (K) => { K(0.5, 'whoosh', 0.5); K(0.8, 'hit', 1); K(1.6, 'crack', 1); K(1.62, 'hit', 1.3);
  return (t) => { atmosphere(t); const P = clip(t, 'sat', { a: [0.5, 0.5, 1.0], b: [0.5, 0.5, 1.08] }); if (!P) noPhoto(t); dim(0.35);
    tag(t, 10, N); footBadge(t, 0.3, 'REAL SATELLITE IMAGERY · NOAA');
    fact(t, 0.8, 'METEOROLOGISTS:', 'ANY HITS ARE PURE CHANCE', { color: TXT, size: 120 });
    g.save(); g.translate(shake(t, 1.6, 16), 0); stampText("DOESN'T HOLD UP", 540, 900, t, 1.6, { size: 100, rot: -0.1 }); g.restore(); }; };
