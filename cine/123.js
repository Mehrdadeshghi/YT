// Body Facts #5 (#123) — your skin makes vitamin D (but not in a German winter). Motion graphics (tech.js + med.js).
const N = 6, SUNY = '#FFC53D';
// skin cross-section block; glow 0..1 lights the inner layer
function skin(y, glow = 0) { g.save(); g.fillStyle = '#F2C6A6'; g.fillRect(0, y, W, 60); g.fillStyle = '#E4A483'; g.fillRect(0, y + 60, W, 140); g.fillStyle = '#C97B66'; g.fillRect(0, y + 200, W, 400);
  if (glow) { g.fillStyle = `rgba(255,197,61,${0.35 * glow})`; g.fillRect(0, y + 60, W, 140); } g.fillStyle = 'rgba(0,0,0,0.12)'; for (let x = 30; x < W; x += 90) { g.beginPath(); g.arc(x, y + 130, 22, 0, 6.283); g.fill(); } g.restore(); }
// wavy UV ray from (x0,y0) to (x1,y1), dashed by time
function uvRay(x0, y0, x1, y1, t, col = '#B46BFF', a = 1) { const pts = [], L = Math.hypot(x1 - x0, y1 - y0), ux = (x1 - x0) / L, uy = (y1 - y0) / L;
  for (let s = 0; s <= L; s += 6) { const w = Math.sin(s / 18 - t * 14) * 14; pts.push([x0 + ux * s - uy * w, y0 + uy * s + ux * w]); } glowLine(pts, col, 5, a); }
function molecule(x, y, s, t, col) { g.save(); g.translate(x, y); g.scale(s, s); g.strokeStyle = col; g.lineWidth = 7; g.shadowColor = col; g.shadowBlur = 16;
  [[0, 0], [78, 0], [39, -66]].forEach(([cx, cy]) => { g.beginPath(); for (let k = 0; k <= 6; k++) { const a = k / 6 * 6.283 + Math.PI / 6; k ? g.lineTo(cx + Math.cos(a) * 45, cy + Math.sin(a) * 45) : g.moveTo(cx + Math.cos(a) * 45, cy + Math.sin(a) * 45); } g.stroke(); }); g.restore(); }
function boneShape(x, y, s, fill, t) { g.save(); g.translate(x, y); g.rotate(-0.5); g.scale(s, s); g.beginPath(); g.rect(-210, -30, 420, 60);
  [[-215, -38], [-215, 38], [215, -38], [215, 38]].forEach(([cx, cy]) => { g.moveTo(cx + 46, cy); g.arc(cx, cy, 46, 0, 6.283); });
  g.fillStyle = '#EDE6D6'; g.shadowColor = fill > 0 ? LIME : 'transparent'; g.shadowBlur = 50 * fill; g.fill('nonzero'); g.restore(); }
function battery(x, y, w, h, p, col) { g.save(); g.strokeStyle = '#FFFFFF'; g.lineWidth = 8; rrect(x - w / 2, y - h / 2, w, h, 20); g.stroke(); g.fillStyle = '#FFFFFF'; rrect(x + w / 2 + 6, y - h / 5, 22, h * 0.4, 6); g.fill();
  g.fillStyle = col; g.shadowColor = col; g.shadowBlur = 24; rrect(x - w / 2 + 14, y - h / 2 + 14, (w - 28) * clamp(p), h - 28, 12); g.fill(); g.restore(); text(`${Math.round(clamp(p) * 100)}%`, x, y + 18, 'disp', 54, BG, { align: 'center' }); }
function person(x, y, s, hl) { g.save(); g.translate(x, y); g.scale(s, s); const base = '#3A4C6E', on = (k) => hl > 0 ? `rgba(255,197,61,${0.4 + 0.6 * hl})` : base;
  g.fillStyle = on(); g.beginPath(); g.arc(0, -230, 70, 0, 6.283); g.fill(); g.fillStyle = base; rrect(-95, -150, 190, 300, 50); g.fill(); rrect(-85, 140, 70, 230, 30); g.fill(); rrect(15, 140, 70, 230, 30); g.fill();
  g.fillStyle = on(); rrect(-165, -140, 60, 260, 30); g.fill(); rrect(105, -140, 60, 260, 30); g.fill(); g.restore(); }

VIS.open = (K) => { const su = sw('sunlight', 2.2); K(0.05, 'hit', 1.1); ks(K, [[su, 'ding', 1]]);
  return (t) => { bodyBg(t, '#1A1206', '#3A2A08'); sun(220, 700, 80, t); skin(1040, clamp((t - su) / 0.5)); for (let k = 0; k < 4; k++) uvRay(300 + k * 30, 760 + k * 20, 520 + k * 140, 1040, t, '#B46BFF', 0.8);
    if (t > su) [0, 1, 2].forEach((k) => { const p = mE((t - su - k * 0.15) / 0.5); if (p > 0) { g.save(); g.globalAlpha = p; text('D', 520 + k * 160, 1110 - 40 * p, 'disp', 90, SUNY, { align: 'center' }); g.restore(); } });
    tag(t); hook(t, EP.hook, 400); if (EP.series) chip(EP.series, 80, 300, t, -0.3, { size: 26, align: 'left', bg: MRED, fg: '#FFF' }); }; };

VIS[0] = S(() => { const uv = sw('uv', 0.5), ch = sw('cholesterol', 2.0), vi = sw('vitamin', 3.4);
  return (K) => { ks(K, [[uv, 'zap', 0.8], [ch, 'pop', 0.8, 500], [vi, 'ding', 1], [vi + 0.02, 'pop', 0.9, 900]]);
    return (t) => { bodyBg(t, '#120A1E', '#2A1446'); tag(t, 0, N); skin(1000, t > vi ? 1 : 0); sun(900, 640, 60, t, SUNY, 0.9);
      if (t > uv) for (let k = 0; k < 3; k++) uvRay(860 - k * 40, 700, 440 + k * 70, 1060, t, '#B46BFF', clamp((t - uv) / 0.4));
      const p = t > vi ? mE((t - vi) / 0.5) : 0; molecule(460, 1110, 0.9, t, p > 0.5 ? SUNY : '#9FB3CF'); if (p > 0) { shock(500, 1090, t, vi, 220, SUNY); text('D', 680, 1130, 'disp', 120 * p, SUNY, { align: 'center' }); }
      rgbText(t > vi ? '→ VITAMIN D' : t > ch ? 'CHOLESTEROL-LIKE MOLECULE' : 'UV-B LIGHT', 540, 470, 96, t, t > vi ? vi : t > ch ? ch : uv, { color: t > vi ? SUNY : '#C79BFF' });
      chip('INSIDE YOUR SKIN', 540, 560, t, ch, { size: 30, bg: '#FFFFFF', fg: BG }); }; }; });

VIS[1] = S(() => { const bo = sw('bones', 1.2);
  return (K) => { ks(K, [[bo, 'thump', 1], [bo + 0.05, 'ding', 0.8]]);
    return (t) => { bodyBg(t, '#06140E', '#0E3A24'); tag(t, 1, N); const p = clamp((t - bo) / 0.6); boneShape(540, 880, 1.25, p, t);
      for (let k = 0; k < 10 * p; k++) { const a = k * 0.63 + t, r = 300 + 40 * Math.sin(t * 3 + k); glowDot(540 + Math.cos(a) * r, 880 + Math.sin(a) * r * 0.6, 10, SUNY); }
      rgbText(t > bo ? 'STRONG BONES' : 'WHY YOU NEED IT', 540, 470, 120, t, t > bo ? bo : 0.1, { color: t > bo ? LIME : '#FFFFFF' }); if (t > bo) chip('VITAMIN D HELPS ABSORB CALCIUM', 540, 560, t, bo + 0.2, { size: 30, bg: LIME, fg: BG }); }; }; });

VIS[2] = S(() => { const wi = sw('winter', 0.9), lo = sw('low', 2.2), we = sw('weak', 3.0), ha = sw('halt', 4.6);
  return (K) => { ks(K, [[wi, 'whoosh', 0.8], [lo, 'pop', 0.8, 400], [ha, 'wrong', 1]]);
    return (t) => { if (t < lo) { const P = shot(t, 'winter', { a: [0.5, 0.45, 1.1], b: [0.5, 0.45, 1.2], dur: 3 }); if (!P) noPhoto(t); tag(t, 2, N); realBadge(t, 0.1, 'REAL PHOTO · WINTER SUN, GERMANY');
        if (t > wi) rgbText('WINTER IN GERMANY', 540, 560, 100, t, wi, { color: '#BFE3FF' }); return; }
      bodyBg(t, '#06101E', '#102A46'); tag(t, 2, N); const hy = 1050; g.fillStyle = '#E8F2FF'; g.fillRect(0, hy, W, 30); g.strokeStyle = 'rgba(255,255,255,0.25)'; g.setLineDash([12, 12]); g.lineWidth = 4;
      g.beginPath(); g.arc(540, hy, 420, Math.PI, 0); g.stroke(); g.beginPath(); g.ellipse(540, hy, 420, 150, 0, Math.PI, 0); g.stroke(); g.setLineDash([]);
      text('SUMMER', 540, hy - 440, 'mono', 26, '#FFFFFF', { align: 'center', alpha: 0.6 }); sun(540, hy - 420, 30, t, SUNY, 0.35);
      const sa = Math.PI * 1.5 + 0.3 * Math.sin(t * 0.4); sun(540 + Math.cos(sa) * 420 * 0, hy - 150, 46, t, '#FFD98A'); text('WINTER', 540, hy - 230, 'mono', 28, '#FFFFFF', { align: 'center' });
      if (t > we) { const f = 1 - clamp((t - we) / 1.4); for (let k = 0; k < 3; k++) uvRay(500 + k * 40, hy - 110, 300 + k * 260, hy - 110 + 100 * f, t, '#B46BFF', f); }
      if (t > ha) stampText('VITAMIN D: 0', 540, 1170, t, ha, { size: 70, color: RED2 });
      rgbText(t > we ? 'UV-B TOO WEAK' : 'THE SUN IS TOO LOW', 540, 470, 104, t, t > we ? we : lo, { color: t > we ? '#C79BFF' : '#FFD98A' });
      chip('OCTOBER – MARCH (GERMANY, BfS)', 540, 560, t, lo + 0.2, { size: 26, bg: 'rgba(255,255,255,0.85)', fg: BG }); }; }; });

VIS[3] = S(() => { const su = sw('summer', 0.3), fa = sw('face', 1.4), tw = sw('two', 2.8), fi = sw('fills', 4.0);
  return (K) => { ks(K, [[su, 'whoosh', 0.7], [fa, 'pop', 0.8, 600], [tw, 'pop', 0.8, 800], [fi, 'riser', 0.6]]);
    return (t) => { bodyBg(t, '#1A1206', '#3A2A08'); tag(t, 3, N); sun(880, 700, 54, t);
      if (t < fi) { person(380, 980, 0.95, t > fa ? clamp((t - fa) / 0.4) : 0); if (t > tw) { const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'], on = [1, 0, 0, 1, 0, 1, 0];
          days.forEach((d, k) => { const x = 660 + (k % 4) * 100, y = 900 + Math.floor(k / 4) * 110, a = clamp((t - tw - k * 0.06) / 0.2); g.save(); g.globalAlpha = a; g.fillStyle = on[k] ? SUNY : 'rgba(255,255,255,0.15)'; rrect(x - 42, y - 42, 84, 84, 16); g.fill(); g.restore(); text(d, x, y + 14, 'disp', 40, on[k] ? BG : '#FFFFFF', { align: 'center', alpha: a }); }); }
        rgbText(t > tw ? '2–3× A WEEK' : t > fa ? 'FACE · HANDS · ARMS' : 'IN SUMMER', 540, 470, 100, t, t > tw ? tw : t > fa ? fa : su, { color: SUNY }); }
      else { battery(540, 900, 520, 220, clamp((t - fi) / 1.4), LIME); rgbText('FILLS YOUR STORES', 540, 470, 100, t, fi, { color: LIME }); }
      chip('A LITTLE SUN · ABOUT HALF YOUR BURN TIME', 540, 560, t, fa + 0.2, { size: 26, bg: '#FFFFFF', fg: BG }); }; }; });

VIS[4] = S(() => { const ca = sw('carry', 1.0), sb = sw('sunburn', 2.6), mo = sw('more', 3.4);
  return (K) => { ks(K, [[ca, 'whoosh', 0.6], [sb, 'wrong', 1], [mo, 'stamp', 0.9]]);
    return (t) => { bodyBg(t, '#06101E', '#102A46'); tag(t, 4, N);
      if (t < sb) { const m = ['OCT', 'NOV', 'DEC', 'JAN', 'FEB', 'MAR'], p = clamp((t - ca) / 1.8), i = Math.min(5, Math.floor(p * 6)); battery(540, 900, 520, 220, 1 - 0.65 * p, p > 0.7 ? GOLD : LIME);
        m.forEach((s, k) => text(s, 215 + k * 130, 1120, 'mono', 30, k === i && t > ca ? '#FFFFFF' : 'rgba(255,255,255,0.3)', { align: 'center' })); rgbText('THROUGH THE WINTER', 540, 470, 104, t, 0.1, { color: '#BFE3FF' }); }
      else { const r = 0.6 + 0.4 * Math.sin(t * 7); g.save(); g.fillStyle = `rgba(255,59,78,${0.25 + 0.2 * r})`; g.beginPath(); g.arc(540, 880, 220, 0, 6.283); g.fill(); g.restore(); sun(540, 880, 90, t, '#FF7A3D');
        g.save(); g.strokeStyle = RED2; g.lineWidth = 22; g.lineCap = 'round'; const q = mE((t - sb) / 0.4); g.beginPath(); g.moveTo(380, 720); g.lineTo(380 + 320 * q, 720 + 320 * q); g.moveTo(700, 720); g.lineTo(700 - 320 * q, 720 + 320 * q); g.stroke(); g.restore();
        rgbText('SKIP THE SUNBURN', 540, 470, 104, t, sb, { color: RED2 }); if (t > mo) chip('MORE SUN ≠ MORE VITAMIN D', 540, 1180, t, mo, { size: 36, bg: GOLD, fg: BG }); } }; }; });

VIS[5] = S(() => { const fo = sw('food', 0.3), fi = sw('fish', 1.4), su = sw('supplements', 2.4), dc = sw('doctor', 3.4);
  return (K) => { ks(K, [[fi, 'splash', 0.6], [su, 'pop', 0.8, 600], [dc, 'ding', 1]]);
    return (t) => { bodyBg(t, '#120A06', '#2E1A0C'); tag(t, 5, N);
      if (t < su) { const P = framed(t, 'cod', 240, 640, 600, { b: [0.5, 0.5, 1.05] }); if (!P) noPhoto(t); realBadge(t, fi, 'REAL AD · COD LIVER OIL, 1890s'); rgbText(t > fi ? 'LIKE FATTY FISH' : 'FOOD HELPS A LITTLE', 540, 520, 100, t, t > fi ? fi : fo, { color: CY }); return; }
      g.save(); g.translate(540, 900); g.fillStyle = '#F2F2F2'; rrect(-110, -150, 220, 300, 30); g.fill(); g.fillStyle = SUNY; g.fillRect(-110, -40, 220, 110); text('D3', 0, 40, 'disp', 70, BG, { align: 'center' }); g.fillStyle = '#DDD'; rrect(-90, -200, 180, 60, 14); g.fill(); g.restore();
      if (t > dc) { g.save(); g.strokeStyle = LIME; g.lineWidth = 12; g.beginPath(); g.arc(540, 900, 230, -Math.PI / 2, -Math.PI / 2 + 6.283 * mE((t - dc) / 0.8)); g.stroke(); g.restore(); chip('🩸 CHECK YOUR LEVELS FIRST', 540, 1180, t, dc + 0.3, { size: 32, bg: LIME, fg: BG }); }
      rgbText(t > dc ? 'ASK YOUR DOCTOR' : 'SUPPLEMENTS?', 540, 470, 110, t, t > dc ? dc : su, { color: t > dc ? LIME : '#FFFFFF' }); medNote(t, dc + 0.4, 560); }; }; });
