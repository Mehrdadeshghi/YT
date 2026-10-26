// Wiki Roulette #197 — REEL v2 (E8): the sperm whale, loudest animal on Earth (236 dB), hunts by sound in the dark.
// open: REAL PHOTO mother + calf, click rings from the head, hook "236 DECIBELS / LOUDEST ANIMAL" → diving fluke → total darkness →
// GRAPHIC dive to 7,380 FT / 2 HOURS → REAL FOOTAGE the eye, "SEES WITH SOUND" → GRAPHIC head = 1/3 of the body, clicks out,
// echoes back into the lower jaw → REAL PHOTO pod, recycled air → GRAPHIC hunts upside down → REAL PHOTO giant squid sucker scars →
// payoff 236 dB → comment card over the freediver photo; loop line "236 decibels" over the opening photo.

// GRAPHIC sperm whale silhouette (boxy head at +355, flukes at -380); head third = x > 115
function spermPath197() { const p = new Path2D();
  p.moveTo(-300, -10); p.bezierCurveTo(-120, -88, 100, -98, 320, -86); p.quadraticCurveTo(356, -82, 356, -50); p.lineTo(356, 36);
  p.quadraticCurveTo(354, 62, 318, 64); p.lineTo(130, 78); p.bezierCurveTo(0, 88, -160, 60, -300, 12);
  p.lineTo(-336, 42); p.lineTo(-388, 74); p.lineTo(-364, 0); p.lineTo(-388, -74); p.lineTo(-336, -42); p.closePath(); return p; }
const SPERM197 = spermPath197();
function sperm197(x, y, s, rot, o = {}) { g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s);
  g.fillStyle = o.fill || '#3D4E5C'; g.fill(SPERM197); g.lineWidth = 3 / s; g.strokeStyle = 'rgba(180,220,235,0.45)'; g.stroke(SPERM197);
  if (o.head) { g.save(); g.clip(SPERM197); g.globalAlpha = clamp(o.head); g.fillStyle = GOLD; g.fillRect(115, -120, 260, 240); g.restore(); }
  if (o.jaw) { g.save(); g.globalAlpha = clamp(o.jaw); g.strokeStyle = CY; g.lineWidth = 12 / s; g.lineCap = 'round'; g.beginPath(); g.moveTo(320, 62); g.lineTo(140, 76); g.stroke(); g.restore(); }
  g.fillStyle = 'rgba(0,0,0,0.7)'; g.beginPath(); g.arc(150, 30, 6, 0, 6.283); g.fill(); g.restore(); }
// clicks: arcs travelling away from (x,y) to the right (dir 1) or back towards it (dir -1)
function clicks197(t, t0, x, y, dir = 1, col = '#BDF4FF', period = 0.45, reach = 360) { if (t < t0) return; g.save(); g.lineCap = 'round';
  for (let k = 0; k < 6; k++) { const u = ((t - t0) / period - k * 0.33); if (u < 0) continue; const f = u % 1, r = dir > 0 ? 30 + f * reach : 30 + (1 - f) * reach;
    g.globalAlpha = 0.85 * (1 - f) * (dir > 0 ? 1 : 0.8); g.strokeStyle = col; g.lineWidth = 7; g.shadowColor = col; g.shadowBlur = 14;
    g.beginPath(); g.arc(x, y, r, -0.55, 0.55); g.stroke(); } g.restore(); }
function deepBg197(d) { sea(`rgb(${lerp(20, 2, d)},${lerp(70, 6, d)},${lerp(110, 12, d)})`, `rgb(${lerp(8, 0, d)},${lerp(30, 2, d)},${lerp(55, 6, d)})`); }
const N197 = 6;

// ---------- open: hook ----------
VIS.open = (K) => { K(0.15, 'hit', 1.3); K(0.2, 'mute', 1, 0.4); K(0.3, 'sonar', 0.9); const ne = sw('never', 1.8); K(ne, 'thump', 1);
  return (t) => { atmosphere(t); const P = r2photo(t, 'mom', { a: [0.24, 0.62, 1.0], b: [0.24, 0.62, 1.08], dim: 0.1 }); tag(t);
    if (P) { const [hx, hy] = P(0.13, 0.62); clicks197(t, 0, Math.min(hx, 300), hy, 1, '#BDF4FF', 0.5, 420); }
    r2real(t, -0.5, 'REAL PHOTO · SPERM WHALE + CALF'); r2hook(t, EP.hook, 600, { size: 150 }); }; };

// ---------- 0: sperm whale, total darkness ----------
VIS[0] = S(() => { const sp = sw('sperm', 0.6), to = sw('total', 1.8), da = sw('darkness', 2.2);
  return (K) => { ks(K, [[0.1, 'whoosh', 0.8], [sp, 'hit', 1], [to, 'mute', 1, 0.3], [da, 'thump', 1]]);
    return (t) => { atmosphere(t); r2photo(t, 'dive', { a: [0.4, 0.45, 1.0], b: [0.4, 0.5, 1.15], dim: 0.05 }); r2real(t, 0.1, 'REAL PHOTO · SPERM WHALE DIVING');
      if (t > sp) { r2band(980, 1130, 0.6); r2big(t, sp, 'SPERM WHALE', 1090, { size: 110, color: TXT }); }
      if (t > to) { g.save(); g.globalAlpha = clamp((t - to) / 0.6) * 0.92; g.fillStyle = '#000'; g.fillRect(0, 0, W, H); g.restore(); marineSnow(t, 20, clamp((t - to) / 0.6));
        r2big(t, da, 'TOTAL DARKNESS', 760, { size: 110, color: TXT }); }
      tag(t, 0, N197); }; }; });

// ---------- 1: 7,380 ft, 2 hours ----------
VIS[1] = S(() => { const di = sw('dives', 0.5), fe = sw('feet', 2.0), ho = sw('hours', 3.2);
  return (K) => { ks(K, [[0.1, 'whoosh', 0.8], [di, 'swish', 0.8], [fe, 'hit', 1.2], [ho, 'ding', 1]]);
    return (t) => { const d = easeOut((t - di) / Math.max(0.8, fe - di + 0.3)); deepBg197(d); marineSnow(t, 25, 0.3 + d * 0.7); r2graphic(t, 0, 'GRAPHIC · THE DIVE');
      // depth ruler on the left
      g.save(); g.strokeStyle = 'rgba(255,255,255,0.35)'; g.lineWidth = 3; g.beginPath(); g.moveTo(110, 470); g.lineTo(110, 1080); g.stroke();
      for (let k = 0; k <= 6; k++) { g.beginPath(); g.moveTo(96, 470 + k * 100); g.lineTo(124, 470 + k * 100); g.stroke(); } g.restore();
      const wy = 500 + 560 * d; glowDot(110, wy, 12, GOLD); sperm197(470, wy, 0.75, 0.5 * (1 - clamp((t - fe) / 0.6)) + 0.12, { fill: '#2F3E4A' });
      r2count(t, di, Math.max(0.8, fe - di + 0.3), 7380, 160, 600, 130, GOLD, undefined, ' FT');
      if (t > fe) r2line(t, fe, 'UP TO 2,250 M DOWN', 650, { size: 30 });
      if (t > ho) chip('UP TO 2 HOURS', 160, 760, t, ho, { size: 44, align: 'left', bg: TXT, fg: BG });
      tag(t, 1, N197); }; }; });

// ---------- 2: sees with sound; head 1/3; echoes into the lower jaw ----------
VIS[2] = S(() => { const so = sw('sound', 1.0), cl = sw('clicks', 1.6), th = sw('third', 2.6), ec = sw('echoes', 3.6), ja = sw('jaw', 4.8);
  return (K) => { ks(K, [[0.1, 'whoosh', 0.8], [so, 'sonar', 1], [cl, 'whoosh', 0.6], [th, 'hit', 1], [ec, 'sonar', 0.8], [ja, 'ding', 1]]);
    return (t) => { atmosphere(t);
      if (t < cl) { r2clip(t, 'eye', { a: [0.55, 0.4, 1.0], b: [0.55, 0.4, 1.1], dim: 0.1 }); r2foot(t, 0.1, 'REAL FOOTAGE · SPERM WHALE EYE');
        if (t > so) { r2band(980, 1130, 0.6); r2big(t, so, 'SEES WITH SOUND', 1090, { size: 100 }); } }
      else { deepBg197(0.6); marineSnow(t, 18, 0.6); r2graphic(t, cl, 'GRAPHIC · HOW IT CLICKS');
        const s = 0.95, wx = 400, wy = 720; sperm197(wx, wy, s, 0, { head: (t - th) * 3, jaw: t > ec ? (t - ec) * 3 : 0 });
        clicks197(t, cl, wx + 356 * s, wy - 20, 1, '#BDF4FF', 0.45, 260);
        if (t > ec) clicks197(t, ec, wx + 340 * s, wy + 62, -1, CY, 0.45, 260);
        if (t > th) { chip('HEAD = UP TO 1/3 OF ITS LENGTH', 80, 520, t, th, { size: 30, align: 'left', bg: GOLD, fg: BG }); }
        if (t > ja) r2big(t, ja, 'EARS? THE LOWER JAW', 1010, { size: 80, color: CY }); }
      tag(t, 2, N197); }; }; });

// ---------- 3: recycles air, 2-hour dive; upside down; giant squid ----------
VIS[3] = S(() => { const re = sw('recycles', 0.5), tw = sw('two', 2.4), ta = sw('tags', 3.4), up = sw('upside', 4.2), gi = sw('giant', 5.8);
  return (K) => { const ticks = []; for (let q = re; q < ta - 0.1; q += 0.16) ticks.push([q, 'tick', 0.7]);
    ks(K, [[0.1, 'whoosh', 0.8], ...ticks, [ta, 'whoosh', 0.7], [up, 'swish', 1], [gi, 'hit', 1.2]]);
    return (t) => { atmosphere(t);
      if (t < ta) { r2photo(t, 'pod2', { a: [0.55, 0.45, 1.0], b: [0.5, 0.45, 1.1], dim: 0.15 }); r2real(t, 0.1, 'REAL PHOTO · SPERM WHALES UNDERWATER');
        clicks197(t, re, 300, 700, 1, '#BDF4FF', 0.16, 220);
        if (t > re) chip('SAME AIR, RECYCLED', 80, 500, t, re, { size: 32, align: 'left', bg: TXT, fg: BG });
        if (t > tw) { r2band(980, 1130, 0.6); r2big(t, tw, 'CLICKS FOR 2 HOURS', 1090, { size: 96 }); } }
      else if (t < gi) { deepBg197(1); marineSnow(t, 15, 1); r2graphic(t, ta, 'GRAPHIC · TAGGED WHALES');
        const fl = easeOut((t - up) / 0.7); sperm197(470, 740, 0.85, Math.PI * fl, { fill: '#33434F' });
        if (t > up) r2big(t, up + 0.3, 'UPSIDE DOWN', 1060, { size: 120 }); }
      else { r2photo(t, 'scars', { a: [0.5, 0.45, 1.0], b: [0.5, 0.5, 1.15], t0: gi, dim: 0.1 }); r2real(t, gi, 'REAL PHOTO · GIANT SQUID SUCKER SCARS ON ITS SKIN', R2.badgeY);
        r2band(980, 1130, 0.65); r2big(t, gi, 'GIANT SQUID', 1090, { size: 120 }); }
      tag(t, 3, N197); }; }; });

// ---------- 4: payoff ----------
VIS[4] = S(() => { const lo = sw('loudest', 0.6), se = sw('see', 2.4);
  return (K) => { ks(K, [[0.1, 'whoosh', 0.8], [lo, 'hit', 1.3], [se, 'sonar', 1]]);
    return (t) => { atmosphere(t); r2photo(t, 'mom2', { a: [0.3, 0.55, 1.0], b: [0.3, 0.55, 1.1], dim: 0.15 }); r2real(t, 0.1, 'REAL PHOTO · SPERM WHALES');
      r2band(520, 900, 0.6); r2big(t, lo, '236 dB', 720, { size: 210 }); r2line(t, lo + 0.3, 'LOUDEST ANIMAL ON EARTH', 800, { size: 34 });
      if (t > se) chip('IT USES IT TO SEE', 80, 880, t, se, { size: 34, align: 'left', bg: CY, fg: BG });
      tag(t, 4, N197); }; }; });

// ---------- 5: comment card + loop line ----------
VIS[5] = S(() => { const ju = sw('just', 3.2), dc = sw('decibels', 4.4);
  return (K) => { ks(K, [[0.1, 'whoosh', 0.8], [ju, 'whoosh', 0.6], [dc, 'sonar', 1]]);
    return (t) => { atmosphere(t);
      if (t < ju) { r2photo(t, 'diver', { a: [0.6, 0.5, 1.0], b: [0.6, 0.5, 1.1], dim: 0.15 }); r2real(t, 0.1, 'REAL PHOTO · FREEDIVER + SPERM WHALE'); }
      else { const P = r2photo(t, 'mom', { a: [0.3, 0.62, 1.08], b: [0.3, 0.62, 1.0], t0: ju, dim: 0.1 }); r2real(t, ju, 'REAL PHOTO · SPERM WHALE + CALF');
        if (P) { const [hx, hy] = P(0.13, 0.62); clicks197(t, ju, Math.min(hx, 300), hy, 1, '#BDF4FF', 0.5, 420); }
        r2big(t, dc, '236 DECIBELS', 640, { size: 130 }); }
      tag(t, 5, N197); }; }; });
