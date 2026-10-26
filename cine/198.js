// Wiki Roulette #198 — REEL v2 (E8): why the Golden Gate Bridge is "International Orange" (38 painters, Navy wanted stripes).
// open: REAL PHOTO tower + hook "38 PAINTERS / NEVER STOP" + 38 dots → salt spray + fog vs steel (maintenance platform) →
// the colour isn't red: International Orange swatch → GRAPHIC bridge in Navy black/yellow stripes → REAL PHOTO Navy cruiser →
// Morrow repaints it orange (GRAPHIC) → REAL PHOTOS hills + fog → GRAPHIC swatches standard vs Golden Gate (lighter) →
// REAL FOOTAGE ship crossing, "TO BE SEEN" → comment card over a half-orange/half-striped bridge; loop line over the tower photo.
const IO198 = '#F04A00', ENG198 = '#BA160C';
let STRIPE198 = null;
function stripes198() { if (STRIPE198) return STRIPE198; const cv = document.createElement('canvas'); cv.width = 48; cv.height = 48; const x = cv.getContext('2d');
  x.fillStyle = '#F2C200'; x.fillRect(0, 0, 48, 48); x.fillStyle = '#111'; x.beginPath(); x.moveTo(0, 0); x.lineTo(24, 0); x.lineTo(0, 24); x.closePath(); x.fill();
  x.beginPath(); x.moveTo(48, 0); x.lineTo(48, 24); x.lineTo(24, 48); x.lineTo(0, 48); x.closePath(); x.fill(); return STRIPE198 = g.createPattern(cv, 'repeat'); }
// GRAPHIC bridge: paint = colour string | 'stripes'; split = x where the right part switches to stripes (optional)
function bridge198(t, tIn, paint, o = {}) {
  const s = spring(t - tIn, 200, 20); if (s <= 0.001) return; g.save(); g.globalAlpha = clamp(s * 1.5); g.translate(0, (1 - s) * 60);
  const T = [270, 650], top = 520, deck = 880, base = 990, L = 70, R = 840;
  const fill = (x) => (paint === 'stripes' || (o.split != null && x > o.split)) ? stripes198() : paint;
  // water
  const wg = g.createLinearGradient(0, base, 0, base + 160); wg.addColorStop(0, 'rgba(40,90,120,0.6)'); wg.addColorStop(1, 'rgba(40,90,120,0)'); g.fillStyle = wg; g.fillRect(0, base, W, 160);
  const seg = (x0, x1, draw) => { g.save(); g.beginPath(); g.rect(x0, 0, x1 - x0, H); g.clip(); draw(); g.restore(); };
  const paintAll = (pf) => { // cables
    g.lineWidth = 9; g.strokeStyle = pf; g.beginPath(); g.moveTo(L, deck - 10); g.quadraticCurveTo((L + T[0]) / 2, deck - 120, T[0], top + 20);
    g.quadraticCurveTo((T[0] + T[1]) / 2, deck + 140, T[1], top + 20); g.quadraticCurveTo((T[1] + R) / 2, deck - 120, R, deck - 10); g.stroke();
    // hangers
    g.lineWidth = 3; for (let x = L + 20; x < R; x += 26) { const y = x < T[0] ? lerp(deck - 10, top + 20, ((x - L) / (T[0] - L)) ** 2) : x < T[1] ? (() => { const u = (x - T[0]) / (T[1] - T[0]); return (1 - u) ** 2 * (top + 20) + 2 * u * (1 - u) * (deck + 140) + u * u * (top + 20); })() : lerp(top + 20, deck - 10, 1 - ((R - x) / (R - T[1])) ** 2);
      g.beginPath(); g.moveTo(x, y); g.lineTo(x, deck); g.stroke(); }
    // deck
    g.fillStyle = pf; g.fillRect(L - 20, deck, R - L + 40, 26);
    // towers
    T.forEach((x) => { g.fillRect(x - 34, top, 18, base - top); g.fillRect(x + 16, top, 18, base - top); [top + 30, top + 140, top + 250].forEach((y) => g.fillRect(x - 34, y, 68, 22)); }); };
  if (o.split != null) { seg(0, o.split, () => paintAll(paint)); seg(o.split, W, () => paintAll(stripes198())); }
  else paintAll(fill(0));
  g.restore();
}
function swatch198(t, tIn, x, y, w, h, col, l1, l2) { const s = spring(t - tIn, 260, 18); if (s <= 0.001) return; g.save(); g.translate(x + w / 2, y + h / 2); g.scale(s, s); g.translate(-(x + w / 2), -(y + h / 2));
  g.shadowColor = 'rgba(0,0,0,0.5)'; g.shadowBlur = 30; rrect(x, y, w, h, 26); g.fillStyle = col; g.fill(); g.shadowBlur = 0; g.restore();
  if (t > tIn + 0.2) { label(l1, x + 24, y + h - 64, t, tIn + 0.2, { size: 28, color: '#fff', ls: 3 }); label(l2, x + 24, y + h - 26, t, tIn + 0.3, { size: 24, color: 'rgba(255,255,255,0.8)', ls: 3 }); } }
const N198 = 6;

// ---------- open: hook + 38 painters ----------
VIS.open = (K) => { K(0.15, 'hit', 1.3); K(0.2, 'mute', 1, 0.4); const ne = sw('never', 1.0); K(ne, 'thump', 1);
  return (t) => { atmosphere(t); r2photo(t, 'pillar', { a: [0.55, 0.45, 1.0], b: [0.55, 0.45, 1.1], dim: 0.15 }); tag(t);
    r2real(t, -0.5, 'REAL PHOTO · GOLDEN GATE BRIDGE TOWER'); r2hook(t, EP.hook, 600, { size: 150 });
    for (let k = 0; k < 38; k++) { const p = spring(t - 0.3 - k * 0.04, 300, 16); if (p <= 0.01) continue; const x = 100 + (k % 19) * 38, y = 860 + Math.floor(k / 19) * 46;
      g.save(); g.translate(x, y); g.scale(p, p); g.fillStyle = k % 2 ? IO198 : '#FFFFFF'; g.beginPath(); g.arc(0, -12, 9, 0, 6.283); g.fill(); g.fillRect(-8, 0, 16, 16); g.restore(); }
    if (t > 1.6) r2line(t, 1.6, 'THE PAINTING NEVER ENDS', 970, { size: 28 }); }; };

// ---------- 0: salt spray + fog attack the steel ----------
VIS[0] = S(() => { const sa = sw('salt', 0.4), fo = sw('fog', 1.2), st = sw('steel', 2.4);
  return (K) => { ks(K, [[0.1, 'whoosh', 0.8], [sa, 'splash', 0.8], [fo, 'swish', 0.8], [st, 'hit', 1.1]]);
    return (t) => { atmosphere(t); r2photo(t, 'platform', { a: [0.5, 0.5, 1.0], b: [0.5, 0.55, 1.12], dim: 0.15 }); r2real(t, 0.1, 'REAL PHOTO · ON THE GOLDEN GATE BRIDGE');
      if (t > sa) chip('SALT SPRAY', 80, 520, t, sa, { size: 40, align: 'left', bg: TXT, fg: BG });
      if (t > fo) chip('FOG', 420, 520, t, fo, { size: 40, align: 'left', bg: TXT, fg: BG });
      if (t > st) { r2band(980, 1130, 0.6); r2big(t, st, 'STEEL → RUST', 1090, { size: 120, color: GOLD }); }
      tag(t, 0, N198); }; }; });

// ---------- 1: not red, International Orange ----------
VIS[1] = S(() => { const re = sw('red', 1.0), io = sw('international', 1.8);
  return (K) => { ks(K, [[0.1, 'whoosh', 0.8], [re, 'wrong', 0.9], [io, 'ding', 1.1]]);
    return (t) => { atmosphere(t); r2photo(t, 'battery', { a: [0.5, 0.45, 1.0], b: [0.5, 0.45, 1.1], dim: 0.1 }); r2real(t, 0.1, 'REAL PHOTO · GOLDEN GATE BRIDGE');
      if (t > re && t < io) { r2band(560, 760, 0.6); r2big(t, re, 'RED?', 700, { size: 150, color: TXT }); const p = easeOut((t - re - 0.25) / 0.3);
        if (p > 0) { g.save(); g.strokeStyle = RED2; g.lineWidth = 16; g.beginPath(); g.moveTo(70, 650); g.lineTo(70 + 420 * p, 650); g.stroke(); g.restore(); } }
      if (t > io) swatch198(t, io, 80, 500, 700, 380, IO198, 'INTERNATIONAL ORANGE', 'GOLDEN GATE · HEX F04A00');
      tag(t, 1, N198); }; }; });

// ---------- 2: Navy wanted black + yellow stripes, so ships could see it ----------
VIS[2] = S(() => { const na = sw('navy', 0.6), bl = sw('black', 1.2), sh = sw('ships', 2.8);
  return (K) => { ks(K, [[0.1, 'whoosh', 0.8], [na, 'stamp', 1], [bl, 'swish', 0.9], [sh, 'whoosh', 0.7]]);
    return (t) => { atmosphere(t);
      if (t < sh) { techBg(t, '#0A1622', '#16314A'); r2graphic(t, 0, "GRAPHIC · THE NAVY'S IDEA"); bridge198(t, bl - 0.2, 'stripes');
        if (t > na) chip('U.S. NAVY PROPOSAL', 80, 470, t, na, { size: 32, align: 'left', bg: '#F2C200', fg: '#111' }); }
      else { r2photo(t, 'navy', { a: [0.33, 0.62, 1.25], b: [0.33, 0.62, 1.4], t0: sh, dim: 0.1 }); r2real(t, sh, 'REAL PHOTO · U.S. NAVY CRUISER, GOLDEN GATE');
        r2band(980, 1130, 0.6); r2big(t, sh, 'SO SHIPS SEE IT', 1090, { size: 110 }); }
      tag(t, 2, N198); }; }; });

// ---------- 3: Morrow picked orange; fits the hills; stands out in fog ----------
VIS[3] = S(() => { const mo = sw('morrow', 0.8), or = sw('orange', 1.6), hi = sw('hills', 2.6), sto = sw('stands', 3.6);
  return (K) => { ks(K, [[0.1, 'whoosh', 0.8], [mo, 'pop', 0.9], [or, 'ding', 1.1], [hi, 'whoosh', 0.7], [sto, 'whoosh', 0.7]]);
    return (t) => { atmosphere(t);
      if (t < hi) { techBg(t, '#0A1622', '#16314A'); r2graphic(t, 0, 'GRAPHIC · THE ARCHITECT SAYS NO');
        const sp = t < or ? -1 : lerp(-1, W, easeOut((t - or) / 0.7)); bridge198(t, -1, IO198, { split: Math.max(0, sp) });
        if (t > mo) chip('IRVING MORROW · ARCHITECT', 80, 470, t, mo, { size: 32, align: 'left', bg: IO198, fg: '#fff' }); }
      else if (t < sto) { r2photo(t, 'hills', { a: [0.5, 0.5, 1.0], b: [0.5, 0.48, 1.1], t0: hi, dim: 0.05 }); r2real(t, hi, 'REAL PHOTO · ABOVE THE FOG, MARIN HEADLANDS');
        r2band(980, 1130, 0.6); r2big(t, hi, 'FITS THE HILLS', 1090, { size: 110 }); }
      else { r2photo(t, 'fogtower', { a: [0.5, 0.45, 1.0], b: [0.5, 0.45, 1.1], t0: sto, dim: 0.05 }); r2real(t, sto, 'REAL PHOTO · TOWER IN FOG, 2022');
        r2band(980, 1130, 0.6); r2big(t, sto, 'POPS IN FOG', 1090, { size: 120 }); }
      tag(t, 3, N198); }; }; });

// ---------- 4: a bit lighter than standard; not decoration; to be seen ----------
VIS[4] = S(() => { const li = sw('lighter', 1.0), de = sw('decoration', 3.2), se = sw('seen', 4.8);
  return (K) => { ks(K, [[0.1, 'whoosh', 0.8], [li, 'ding', 1], [de, 'whoosh', 0.7], [se, 'hit', 1.2]]);
    return (t) => { atmosphere(t);
      if (t < de - 0.6) { techBg(t, '#0A1622', '#16314A'); r2graphic(t, 0, 'GRAPHIC · TWO SHADES OF ONE NAME');
        swatch198(t, 0.2, 80, 480, 360, 420, ENG198, 'STANDARD', 'HEX BA160C'); swatch198(t, li, 470, 480, 360, 420, IO198, 'GOLDEN GATE', 'HEX F04A00');
        if (t > li) r2big(t, li + 0.2, 'LIGHTER = SEEN', 1030, { size: 100 }); }
      else { r2clip(t, 'ship', { a: [0.47, 0.48, 1.0], b: [0.47, 0.48, 1.06], dim: 0.05 }); r2foot(t, de - 0.6, 'REAL FOOTAGE · SHIP CROSSING THE GOLDEN GATE');
        if (t > de) { r2band(560, 760, 0.6); r2big(t, de, 'NOT DECORATION', 700, { size: 110, color: TXT }); }
        if (t > se) { r2band(980, 1130, 0.6); r2big(t, se, 'TO BE SEEN.', 1090, { size: 130 }); } }
      tag(t, 4, N198); }; }; });

// ---------- 5: comment card + loop line ----------
VIS[5] = S(() => { const ei = sw('either', 3.0), pa = sw('painters', 3.8);
  return (K) => { ks(K, [[0.1, 'whoosh', 0.8], [ei, 'whoosh', 0.6], [pa, 'thump', 1]]);
    return (t) => { atmosphere(t);
      if (t < ei) { techBg(t, '#0A1622', '#16314A'); r2graphic(t, 0, 'GRAPHIC · ORANGE OR STRIPES?'); bridge198(t, 0, IO198, { split: 455 + 40 * Math.sin(t * 1.5) }); }
      else { r2photo(t, 'pillar', { a: [0.55, 0.45, 1.1], b: [0.55, 0.45, 1.0], t0: ei, dim: 0.15 }); r2real(t, ei, 'REAL PHOTO · GOLDEN GATE BRIDGE TOWER');
        r2big(t, pa, '38 PAINTERS', 640, { size: 140, color: TXT }); }
      tag(t, 5, N198); }; }; });
