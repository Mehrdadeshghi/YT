// Wiki Roulette #196 — REEL v2 (E8): Hoover Dam was poured in blocks with cooling pipes (one pour = 125 years to cool).
// open: aerial REAL PHOTO + hook "125 YEARS / CUT TO 2" → pour photo, then GRAPHIC one-pour dam glows hot and cracks →
// REAL FOOTAGE of the block forms (5 FT) → GRAPHIC block cutaway with 1-inch pipes → river water, then ice-cold water cools it →
// REAL PHOTO cooling pipes on the dam face + 582 MILES counter → GRAPHIC pipes filled with grout → REAL PHOTO May 1935, 125 YEARS → 2 →
// comment card over the pour footage; loop line over the aerial photo ("125 years") cross-fades into the hook frame.

// ---------- GRAPHIC: concrete block cutaway with a serpentine pipe ----------
const BK196 = { x: 120, y: 520, w: 660, h: 420 };
function pipePath196() { const { x, y, w, h } = BK196, n = 5, p = []; for (let i = 0; i < n; i++) { const yy = y + 70 + i * (h - 140) / (n - 1);
  if (i % 2 === 0) { p.push([x + 70, yy], [x + w - 70, yy]); } else { p.push([x + w - 70, yy], [x + 70, yy]); } } return p; }
const PIPE196 = pipePath196();
// heat 0..1 (1 = glowing hot), flow: null | 'river' | 'ice', grout 0..1 (pipes filled grey from start to end)
function block196(t, tIn, heat, flow, grout = 0) {
  const s = spring(t - tIn, 220, 20); if (s <= 0.001) return; const { x, y, w, h } = BK196;
  g.save(); g.translate(x + w / 2, y + h / 2); g.scale(0.9 + 0.1 * s, 0.9 + 0.1 * s); g.translate(-(x + w / 2), -(y + h / 2)); g.globalAlpha = clamp(s * 1.5);
  // top + side faces (simple isometric hint)
  g.fillStyle = '#5E5A55'; g.beginPath(); g.moveTo(x, y); g.lineTo(x + 50, y - 50); g.lineTo(x + w + 50, y - 50); g.lineTo(x + w, y); g.closePath(); g.fill();
  g.fillStyle = '#3F3C38'; g.beginPath(); g.moveTo(x + w, y); g.lineTo(x + w + 50, y - 50); g.lineTo(x + w + 50, y + h - 50); g.lineTo(x + w, y + h); g.closePath(); g.fill();
  const gr = g.createLinearGradient(0, y, 0, y + h); gr.addColorStop(0, '#8C877F'); gr.addColorStop(1, '#6B6660'); g.fillStyle = gr; g.fillRect(x, y, w, h);
  if (heat > 0) { const hg = g.createRadialGradient(x + w / 2, y + h / 2, 30, x + w / 2, y + h / 2, w * 0.7);
    hg.addColorStop(0, `rgba(255,120,30,${0.85 * heat})`); hg.addColorStop(1, `rgba(200,40,10,${0.35 * heat})`); g.fillStyle = hg; g.fillRect(x, y, w, h); }
  g.lineWidth = 3; g.strokeStyle = 'rgba(255,255,255,0.25)'; g.strokeRect(x, y, w, h);
  // pipe
  g.lineCap = 'round'; g.lineJoin = 'round'; g.beginPath(); PIPE196.forEach(([px, py], k) => k ? g.lineTo(px, py) : g.moveTo(px, py));
  g.lineWidth = 22; g.strokeStyle = '#2A2826'; g.stroke(); g.lineWidth = 14; g.strokeStyle = '#B9C2C9'; g.stroke();
  if (flow) { const col = flow === 'ice' ? '#E6FBFF' : CY; g.save(); g.setLineDash([26, 22]); g.lineDashOffset = -t * 260; g.lineWidth = 9; g.strokeStyle = col;
    g.shadowColor = col; g.shadowBlur = 18; g.stroke(); g.restore(); }
  if (grout > 0) { let L = 0; const segs = PIPE196.slice(1).map((q, k) => { const a = PIPE196[k], d = Math.hypot(q[0] - a[0], q[1] - a[1]); L += d; return d; });
    let left = L * clamp(grout); g.beginPath(); g.moveTo(...PIPE196[0]);
    for (let k = 0; k < segs.length && left > 0; k++) { const a = PIPE196[k], b = PIPE196[k + 1], f = Math.min(1, left / segs[k]); g.lineTo(lerp(a[0], b[0], f), lerp(a[1], b[1], f)); left -= segs[k]; }
    g.lineWidth = 16; g.strokeStyle = '#6E6A64'; g.stroke(); }
  g.restore();
}
// GRAPHIC: one solid dam (trapezoid) glowing hot, crack draws in at tc
function oneDam196(t, tIn, tc) {
  const s = spring(t - tIn, 220, 20); if (s <= 0.001) return; g.save(); g.globalAlpha = clamp(s * 1.5);
  const x0 = 120, y0 = 470, y1 = 1010; g.beginPath(); g.moveTo(x0 + 250, y0); g.lineTo(x0 + 450, y0); g.lineTo(x0 + 700, y1); g.lineTo(x0, y1); g.closePath();
  const gr = g.createLinearGradient(0, y0, 0, y1); gr.addColorStop(0, '#FF9A3D'); gr.addColorStop(1, '#C2330F'); g.fillStyle = gr;
  g.shadowColor = 'rgba(255,110,30,0.8)'; g.shadowBlur = 50 + 20 * Math.sin(t * 5); g.fill(); g.shadowBlur = 0;
  const p = easeOut((t - tc) / 0.5); if (t > tc) { const pts = [[x0 + 350, y0], [x0 + 330, y0 + 90], [x0 + 380, y0 + 170], [x0 + 320, y0 + 260], [x0 + 390, y0 + 350], [x0 + 340, y0 + 440], [x0 + 370, y1]];
    const n = Math.max(1, Math.floor(p * (pts.length - 1))); g.beginPath(); pts.slice(0, n + 1).forEach(([a, b], k) => k ? g.lineTo(a, b) : g.moveTo(a, b));
    g.lineWidth = 12; g.strokeStyle = '#120E0B'; g.lineJoin = 'miter'; g.stroke(); }
  g.restore();
}
const N196 = 5;

// ---------- open: hook ----------
VIS.open = (K) => { K(0.15, 'hit', 1.3); K(0.2, 'mute', 1, 0.4); const ne = sw('never', 2.0); K(ne, 'thump', 1);
  return (t) => { atmosphere(t); r2photo(t, 'aerial', { a: [0.72, 0.6, 1.0], b: [0.72, 0.6, 1.1], dur: 4, dim: 0.15 }); tag(t);
    r2real(t, -0.5, 'REAL PHOTO · HOOVER DAM'); r2hook(t, EP.hook, 600, { size: 160 }); }; };

// ---------- 0: concrete heats up / one pour would crack ----------
VIS[0] = S(() => { const he = sw('heats', 0.8), on = sw('one', 1.8), cr = sw('crack', 2.8);
  return (K) => { ks(K, [[0.1, 'whoosh', 0.8], [he, 'tick', 1], [on, 'whoosh', 0.7], [cr, 'hit', 1.3]]);
    return (t) => { atmosphere(t);
      if (t < on) { r2photo(t, 'pour', { a: [0.5, 0.45, 1.0], b: [0.5, 0.5, 1.12], dim: 0.1 }); r2real(t, 0.1, 'REAL PHOTO · POURING HOOVER DAM, 1930s');
        if (t > he) { g.save(); g.globalCompositeOperation = 'lighter'; g.globalAlpha = 0.35 * clamp((t - he) / 0.5); const hg = g.createRadialGradient(480, 760, 50, 480, 760, 700);
          hg.addColorStop(0, 'rgba(255,110,20,1)'); hg.addColorStop(1, 'rgba(255,60,0,0)'); g.fillStyle = hg; g.fillRect(0, 0, W, H); g.restore();
          r2band(990, 1130, 0.6); r2big(t, he, 'IT GETS HOT', 1090, { size: 96 }); } }
      else { techBg(t); r2graphic(t, on, 'GRAPHIC · ONE SINGLE POUR'); oneDam196(t, on, cr);
        if (t > cr) { g.save(); g.translate(shake(t, cr, 14), 0); r2big(t, cr, 'CRACK.', 1120, { size: 150, color: RED2 }); g.restore(); } }
      tag(t, 0, N196); }; }; });

// ---------- 1: blocks 5 ft high, 1-inch steel pipes ----------
VIS[1] = S(() => { const bl = sw('blocks', 1.4), fi = sw('five', 2.0), ins = sw('inside', 3.0), pi = sw('pipes', 4.2);
  return (K) => { ks(K, [[0.1, 'whoosh', 0.8], [bl, 'tick', 1], [fi, 'hit', 1], [ins, 'whoosh', 0.7], [pi, 'ding', 1]]);
    return (t) => { atmosphere(t);
      if (t < ins) { r2clip(t, 'cblocks', { a: [0.5, 0.5, 1.0], b: [0.5, 0.5, 1.08], dim: 0.1 }); r2foot(t, 0.1, 'REAL FOOTAGE · THE BLOCK FORMS, 1930s');
        if (t > bl) { r2band(990, 1130, 0.6); r2big(t, bl, 'BLOCKS', 1090, { size: 110 }); }
        if (t > fi) chip('5 FT HIGH · UP TO 50 FT SQUARE', 80, 500, t, fi, { size: 30, align: 'left', bg: GOLD, fg: BG }); }
      else { techBg(t); r2graphic(t, ins, 'GRAPHIC · ONE BLOCK, CUT OPEN'); block196(t, ins, 0.55, null);
        if (t > pi) { r2big(t, pi, '1-INCH STEEL PIPES', 1110, { size: 84 }); } }
      tag(t, 1, N196); }; }; });

// ---------- 2: river water, then ice-cold water; 582 miles ----------
VIS[2] = S(() => { const ri = sw('river', 0.5), ic = sw('ice', 1.6), pl = sw('plant', 2.6), ov = sw('over', 3.6), mi = sw('miles', 4.6), hi = sw('hidden', 5.4);
  return (K) => { ks(K, [[0.1, 'whoosh', 0.8], [ri, 'swish', 0.8], [ic, 'ding', 1], [ov, 'whoosh', 0.8], [mi, 'hit', 1.2]]);
    return (t) => { atmosphere(t);
      if (t < ov) { techBg(t); r2graphic(t, 0, 'GRAPHIC · COOLING THE BLOCK');
        const heat = 0.55 - 0.25 * clamp((t - ri) / (ic - ri)) - 0.3 * clamp((t - ic) / 1.2); block196(t, -1, Math.max(0, heat), t < ic ? (t > ri ? 'river' : null) : 'ice');
        if (t > ri) chip('RIVER WATER', 80, 1080, t, ri, { size: 36, align: 'left', bg: CY, fg: BG });
        if (t > ic) chip('ICE-COLD WATER', 420, 1080, t, ic, { size: 36, align: 'left', bg: '#E6FBFF', fg: BG }); }
      else { r2photo(t, 'pipes', { a: [0.45, 0.5, 1.0], b: [0.45, 0.55, 1.12], t0: ov, dim: 0.15 }); r2real(t, ov, 'REAL PHOTO · COOLING PIPES ON THE DAM FACE');
        r2band(930, 1150, 0.65); if (t > ov + 0.1) r2count(t, ov + 0.1, Math.max(0.6, mi - ov), 582, 80, 1060, 170, GOLD);
        if (t > mi) r2line(t, mi, 'MILES OF PIPE', 1120, { size: 34 }); }
      tag(t, 2, N196); }; }; });

// ---------- 3: grout; about 2 years, not 125 ----------
VIS[3] = S(() => { const gr = sw('grout', 2.6), ab = sw('about', 3.8), tw = sw('two', 4.2), nt = sw('not', 5.2), co = sw('cooling', 6.6);
  return (K) => { ks(K, [[0.1, 'whoosh', 0.8], [gr, 'thump', 1], [ab, 'whoosh', 0.8], [tw, 'hit', 1.2], [nt, 'tick', 1]]);
    return (t) => { atmosphere(t);
      if (t < ab) { techBg(t); r2graphic(t, 0, 'GRAPHIC · DONE: PIPES SEALED'); block196(t, -1, 0, null, clamp((t - gr + 0.3) / 0.9));
        if (t > gr) chip('PIPES → GROUT', 80, 1080, t, gr, { size: 36, align: 'left', bg: TXT, fg: BG }); }
      else { r2photo(t, 'upstream', { a: [0.45, 0.45, 1.0], b: [0.45, 0.45, 1.1], t0: ab, dim: 0.2 }); r2real(t, ab, 'REAL PHOTO · HOOVER DAM, MAY 1935');
        r2band(560, 1000, 0.7);
        if (t > nt) { r2big(t, nt, '125 YEARS', 680, { size: 120, color: TXT }); const p = easeOut((t - nt - 0.25) / 0.3);
          if (p > 0) { g.save(); g.strokeStyle = RED2; g.lineWidth = 14; g.beginPath(); g.moveTo(70, 640); g.lineTo(70 + 760 * p, 640); g.stroke(); g.restore(); } }
        r2big(t, tw, '≈ 2 YEARS', 860, { size: 150 }); r2line(t, tw + 0.3, 'JUNE 1933 → MAY 1935', 930, { size: 32 }); }
      tag(t, 3, N196); }; }; });

// ---------- 4: comment card + loop line ----------
VIS[4] = S(() => { const be = sw('because', 3.4), y125 = sw('hundred', 4.4);
  return (K) => { ks(K, [[0.1, 'whoosh', 0.8], [be, 'whoosh', 0.6], [y125, 'thump', 1]]);
    return (t) => { atmosphere(t);
      if (t < be) { r2clip(t, 'cbucket', { a: [0.5, 0.4, 1.0], b: [0.5, 0.4, 1.08], dim: 0.25 }); r2foot(t, 0.1, 'REAL FOOTAGE · POURING A BLOCK'); }
      else { r2photo(t, 'aerial', { a: [0.72, 0.6, 1.1], b: [0.72, 0.6, 1.0], t0: be, dim: 0.15 }); r2real(t, be, 'REAL PHOTO · HOOVER DAM');
        r2big(t, y125, 'OR 125 YEARS.', 600, { size: 120 }); }
      tag(t, 4, N196); }; }; });
