// Wiki Roulette #202 — REEL v2 (E8): the electric eel, 860 volts, and it is not an eel (a knifefish).
// open: REAL PHOTO face-on eel + lightning, hook "860 VOLTS / NOT EVEN AN EEL", 7× a U.S. outlet → REAL PHOTO "ELECTRIC EEL",
// knifefish chip → REAL PHOTO rising eel "BREATHES AIR" + 2-minute timer → ANIMATION (ZDF Terra X) electrocyte stacks "≈ 6,000 CELLS" →
// GRAPHIC battery stack counting to 860 V → ANIMATION glowing eel → REAL FOOTAGE lab strike (red flash = high-voltage shock) →
// ILLUSTRATION Humboldt's horses, 1800, 2 HORSES DROWNED → comment card over the aquarium photo; loop line "860 volts" over the opening photo.

// ---------- lightning: a jagged bolt from a to b that flickers ----------
function bolt202(t, x0, y0, x1, y1, seed, o = {}) {
  const k = Math.floor(t * 18) + seed, r = rng(k * 7919 + seed), n = 9, pts = [[x0, y0]];
  for (let i = 1; i < n; i++) { const f = i / n, j = (r() - 0.5) * (o.jit || 70); pts.push([lerp(x0, x1, f) + j, lerp(y0, y1, f) + (r() - 0.5) * 30]); }
  pts.push([x1, y1]); g.save(); g.globalAlpha *= o.a ?? 1; g.lineJoin = 'round'; g.lineCap = 'round';
  g.beginPath(); pts.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y));
  g.shadowColor = '#7FE9FF'; g.shadowBlur = 30; g.strokeStyle = 'rgba(127,233,255,0.55)'; g.lineWidth = o.w || 14; g.stroke();
  g.shadowBlur = 10; g.strokeStyle = '#F2FDFF'; g.lineWidth = (o.w || 14) * 0.35; g.stroke(); g.restore();
}
// a burst of bolts around a point (flicker on/off)
function zaps202(t, cx, cy, R, a = 1, n = 5) { if (a <= 0) return; for (let i = 0; i < n; i++) { if (Math.sin(t * 23 + i * 2.1) < -0.2) continue;
  const an = i * 6.283 / n + Math.sin(t * 3 + i) * 0.4; bolt202(t, cx + Math.cos(an) * R * 0.35, cy + Math.sin(an) * R * 0.35, cx + Math.cos(an) * R, cy + Math.sin(an) * R, i * 31, { a, w: 10, jit: 50 }); } }
// ---------- GRAPHIC: cells stacked in a row like batteries, filling left → right, volts counting up ----------
function stack202(t, t0, t1, y = 640) {
  const n = 12, cw = 64, gap = 8, x0 = 80, p = clamp((t - t0) / Math.max(0.5, t1 - t0));
  for (let i = 0; i < n; i++) { const x = x0 + i * (cw + gap), on = p * n > i, s = spring(t - t0 - i * 0.05, 260, 20); if (s <= 0.001) continue;
    g.save(); g.translate(x + cw / 2, y); g.scale(s, s);
    rrect(-cw / 2, -110, cw, 220, 14); g.fillStyle = on ? '#2B3A12' : '#1A1E22'; g.fill(); g.lineWidth = 4; g.strokeStyle = on ? LIME : 'rgba(255,255,255,0.25)'; g.stroke();
    rrect(-14, -126, 28, 16, 4); g.fillStyle = on ? LIME : '#555'; g.fill();
    if (on) { g.shadowColor = LIME; g.shadowBlur = 20; rrect(-cw / 2 + 8, -100, cw - 16, 200 * 0.92, 8); g.fillStyle = 'rgba(182,255,62,0.35)'; g.fill(); }
    text('+', 0, -60, 'disp', 40, on ? BG : '#777', { align: 'center' }); text('−', 0, 90, 'disp', 40, on ? BG : '#777', { align: 'center' }); g.restore(); }
  if (p > 0) { g.save(); g.strokeStyle = LIME; g.lineWidth = 6; g.shadowColor = LIME; g.shadowBlur = 16; g.beginPath(); g.moveTo(x0, y + 150); g.lineTo(x0 + (n * (cw + gap) - gap) * p, y + 150); g.stroke(); g.restore(); }
  return p;
}
const N202 = 4;

// ---------- open: hook ----------
VIS.open = (K) => { K(0.15, 'zap', 1.2); K(0.2, 'mute', 1, 0.4); const se = sw('seven', 1.4), ee = sw('eel', 2.8); K(se, 'hit', 1); K(ee, 'thump', 1);
  return (t) => { atmosphere(t); const P = r2photo(t, 'pits', { a: [0.5, 0.62, 1.0], b: [0.5, 0.64, 1.1], dur: 4, dim: 0.12 }); tag(t);
    if (P) { const [hx, hy] = P(0.45, 0.62); zaps202(t, hx, hy, 330, 0.9 * clamp(1 - (t - 3.5) / 0.6)); }
    r2real(t, -0.5, 'REAL PHOTO · ELECTRIC EEL'); r2hook(t, EP.hook, 600, { size: 150 });
    if (t > se) chip('7× A U.S. WALL OUTLET (120 V)', 80, 830, t, se, { size: 30, align: 'left', bg: CY, fg: BG }); }; };

// ---------- 0: electric eel = knifefish; breathes air every ~2 minutes ----------
VIS[0] = S(() => { const el = sw('electric', 0.4), kn = sw('knifefish', 1.6), br = sw('breathes', 2.6), mi = sw('minutes', 3.8);
  return (K) => { ks(K, [[0.1, 'whoosh', 0.8], [el, 'zap', 0.8], [kn, 'hit', 1], [br, 'whoosh', 0.8], [br + 0.3, 'bubble', 1], [mi, 'tick', 1]]);
    return (t) => { atmosphere(t);
      if (t < br) { r2photo(t, 'gdynia', { a: [0.32, 0.55, 1.0], b: [0.3, 0.55, 1.12], dim: 0.1 }); r2real(t, 0.1, 'REAL PHOTO · ELECTRIC EEL, AQUARIUM');
        r2band(980, 1130, 0.6); r2big(t, el, 'ELECTRIC EEL', 1090, { size: 110, color: TXT });
        if (t > kn) { chip('NOT AN EEL → A KNIFEFISH', 80, 500, t, kn, { size: 34, align: 'left', bg: GOLD, fg: BG });
          const p = easeOut((t - kn - 0.2) / 0.3); if (p > 0) { const sz = fit('ELECTRIC EEL', 'disp', 110, R2.maxWlow); g.font = F.disp(sz);
            const x0 = 80 + g.measureText('ELECTRIC ').width - 10, x1 = 80 + g.measureText('ELECTRIC EEL').width + 10;
            g.save(); g.strokeStyle = RED2; g.lineWidth = 12; g.beginPath(); g.moveTo(x0, 1090 - sz * 0.36); g.lineTo(lerp(x0, x1, p), 1090 - sz * 0.36); g.stroke(); g.restore(); } } }
      else { r2photo(t, 'cas', { a: [0.62, 0.3, 1.0], b: [0.62, 0.25, 1.12], t0: br, dim: 0.15 }); r2real(t, br, 'REAL PHOTO · EEL RISING TO THE SURFACE');
        r2band(560, 880, 0.6); r2big(t, br + 0.1, 'BREATHES AIR', 720, { size: 120 });
        if (t > mi - 0.4) { const cx = 180, cy = 950, R = 70, p = ((t - mi + 0.4) / 2) % 1; g.save(); g.lineWidth = 12; g.strokeStyle = 'rgba(255,255,255,0.25)'; g.beginPath(); g.arc(cx, cy, R, 0, 6.283); g.stroke();
          g.strokeStyle = CY; g.beginPath(); g.arc(cx, cy, R, -1.571, -1.571 + 6.283 * p); g.stroke(); g.restore(); chip('EVERY ~2 MINUTES', 280, 950, t, mi - 0.4, { size: 34, align: 'left', bg: CY, fg: BG }); } }
      tag(t, 0, N202); }; }; });

// ---------- 1: ~6,000 cells stacked like batteries → the voltage ----------
VIS[1] = S(() => { const ce = sw('cells', 1.2), ba = sw('batteries', 2.6), vo = sw('voltage', 4.2);
  return (K) => { const ticks = []; for (let q = ba; q < vo - 0.1; q += 0.14) ticks.push([q, 'tick', 0.6]);
    ks(K, [[0.1, 'whoosh', 0.8], [ce, 'hit', 1], [ba, 'whoosh', 0.7], ...ticks, [vo, 'zap', 1.3]]);
    return (t) => { atmosphere(t);
      if (t < ba) { r2clip(t, 'cstack', { box: [40, 470, 1000, 563], a: [0.5, 0.45, 1.4], b: [0.5, 0.45, 1.5] }); r2graphic(t, 0.1, 'ANIMATION · ZDF TERRA X: THE CELLS INSIDE');
        if (t > ce) { r2band(980, 1130, 0.7); r2big(t, ce, '≈ 6,000 CELLS', 1090, { size: 110 }); } }
      else if (t < vo) { techBg(t); r2graphic(t, ba, 'GRAPHIC · CELLS IN A ROW = BATTERIES');
        const p = stack202(t, ba, vo, 680); r2count(t, ba, Math.max(0.5, vo - ba), 860, 80, 1000, 150, LIME, undefined, ' V'); }
      else { r2clip(t, 'cglow', { box: [40, 470, 1000, 563], a: [0.5, 0.45, 1.4], b: [0.5, 0.45, 1.5], t0: vo }); r2graphic(t, vo, 'ANIMATION · ZDF TERRA X');
        zaps202(t, 540, 750, 300, 0.7); r2big(t, vo, 'UP TO 860 V', 1120, { size: 120, color: LIME, maxW: 700 }); }
      tag(t, 1, N202); }; }; });

// ---------- 2: leaps out to shock; Humboldt 1800, horses; two drowned ----------
VIS[2] = S(() => { const le = sw('leaps', 0.7), sh = sw('shock', 1.8), in1 = sw('in', 2.4), hu = sw('humboldt', 3.6), ho = sw('horses', 4.6), tw = sw('two', 5.4);
  return (K) => { ks(K, [[0.1, 'whoosh', 0.8], [le, 'splash', 1], [sh, 'zap', 1.3], [in1, 'whoosh', 0.8], [hu, 'tick', 1], [ho, 'hit', 1], [tw, 'thump', 1.2]]);
    return (t) => { atmosphere(t);
      if (t < in1) { r2clip(t, 'cstrike', { a: [0.5, 0.45, 1.0], b: [0.5, 0.45, 1.08], dim: 0.1 }); r2foot(t, 0.1, 'REAL FOOTAGE · EEL STRIKE, LAB TEST (SLOW MOTION)');
        chip('RED FLASH = HIGH-VOLTAGE SHOCK', 80, 460, t, 0.4, { size: 26, align: 'left', bg: RED2, fg: TXT });
        if (t > le) { r2band(980, 1130, 0.7); r2big(t, le, 'IT LEAPS + SHOCKS', 1090, { size: 100 }); } }
      else { r2photo(t, 'humboldt', { a: [0.5, 0.62, 1.05], b: [0.5, 0.64, 1.25], t0: in1, dim: 0.12 }); r2graphic(t, in1, 'ILLUSTRATION · HUMBOLDT\'S ACCOUNT, 1800s ENGRAVING');
        r2band(480, 700, 0.65); r2big(t, in1 + 0.15, '1800', 640, { size: 150 });
        if (t > hu) r2line(t, hu, 'EXPLORER ALEXANDER VON HUMBOLDT', 700, { size: 30 });
        if (t > tw) { r2band(980, 1140, 0.75); g.save(); g.translate(shake(t, tw, 12), 0); r2big(t, tw, '2 HORSES DROWNED', 1090, { size: 96, color: RED2 }); g.restore(); } }
      tag(t, 2, N202); }; }; });

// ---------- 3: comment card + loop line ----------
VIS[3] = S(() => { const no = sw('not', 3.4), ei = sw('eight', 3.8);
  return (K) => { ks(K, [[0.1, 'whoosh', 0.8], [no, 'whoosh', 0.6], [ei, 'zap', 1.2]]);
    return (t) => { atmosphere(t);
      if (t < no) { r2photo(t, 'boston', { a: [0.7, 0.62, 1.0], b: [0.7, 0.62, 1.08], dim: 0.25 }); r2real(t, 0.1, 'REAL PHOTO · ELECTRIC EEL'); }
      else { const P = r2photo(t, 'pits', { a: [0.5, 0.64, 1.1], b: [0.5, 0.62, 1.0], t0: no, dim: 0.12 }); r2real(t, no, 'REAL PHOTO · ELECTRIC EEL');
        if (P) { const [hx, hy] = P(0.45, 0.62); zaps202(t, hx, hy, 330, 0.9); } r2big(t, ei, '860 VOLTS', 640, { size: 150 }); }
      tag(t, 3, N202); }; }; });
