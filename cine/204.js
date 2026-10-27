// Wiki Roulette #204 — REEL v2 (E8): D. B. Cooper — $200,000, four parachutes, one night jump, never identified.
// open: FBI composite sketch, hook "$200,000 / NEVER FOUND" → REAL PHOTO his ticket "1971" → REAL PHOTO Northwest Orient 727 "HIJACK" + "I HAVE A BOMB" →
// GRAPHIC the swap: $200,000 in $20 bills + 4 parachutes → GRAPHIC night flight over the forest → REAL PHOTO a 727's rear stairs →
// GRAPHIC the jump into the dark "?" → REAL PHOTO the rotten bills found in 1980, $6,000 → FBI wanted poster "UNSOLVED" →
// comment card over the 727; loop line "$200,000 … never found" over the sketch.

// ---------- GRAPHIC: Boeing 727 side view (nose right): T-tail, three rear engines, rear airstair ----------
function jet204(x, y, s, o = {}) {
  g.save(); g.translate(x, y); g.rotate(o.rot || 0); g.scale(s, s); const c = o.fill || '#C9D2DA', d = o.dark || '#7E8A96';
  g.fillStyle = d; g.beginPath(); g.moveTo(-40, 12); g.lineTo(90, 12); g.lineTo(-10, 110); g.lineTo(-80, 110); g.closePath(); g.fill();
  g.fillStyle = c; g.beginPath(); g.moveTo(-400, -26); g.lineTo(320, -34); g.quadraticCurveTo(440, -32, 450, 4); g.quadraticCurveTo(440, 36, 320, 34); g.lineTo(-360, 26); g.closePath(); g.fill();
  g.beginPath(); g.moveTo(-290, -26); g.lineTo(-370, -200); g.lineTo(-420, -200); g.lineTo(-400, -26); g.closePath(); g.fill();      // fin
  g.fillRect(-470, -212, 130, 18);                                                                                                    // T-tail
  g.fillStyle = d; rrect(-330, -50, 110, 30, 14); g.fill(); rrect(-350, -20, 90, 24, 12); g.fill();                                    // engines
  for (let i = 0; i < 14; i++) g.fillRect(-200 + i * 34, -14, 14, 12);
  if (o.stair) { const p = clamp(o.stair); g.save(); g.translate(-380, 24); g.rotate(0.9 * p); g.fillStyle = GOLD; g.shadowColor = GOLD; g.shadowBlur = 20 * p; g.fillRect(-90, -6, 90, 12); g.restore(); }
  g.restore();
}
// night forest: dark sky, stars, pine silhouettes scrolling
function forest204(t, a = 1) {
  sea('#03060C', '#0A1420'); const r = rng(77); g.save(); g.globalAlpha = a;
  for (let i = 0; i < 60; i++) { const x = r() * W, y = r() * 900; g.fillStyle = `rgba(255,255,255,${0.2 + 0.5 * r() * (0.6 + 0.4 * Math.sin(t * 2 + i))})`; g.fillRect(x, y, 3, 3); }
  for (let row = 0; row < 3; row++) { const base = 1080 + row * 70, sp = 40 + row * 40, col = ['#0B1A17', '#081310', '#050C0A'][row];
    g.fillStyle = col; for (let i = -1; i < 16; i++) { const x = ((i * 90 - t * sp) % 1440 + 1440) % 1440 - 180, h = 140 + (i * 37 % 60);
      g.beginPath(); g.moveTo(x, base); g.lineTo(x + 45, base - h); g.lineTo(x + 90, base); g.fill(); } g.fillRect(0, base - 2, W, H - base); }
  g.restore();
}
// a $20-bill brick
function bill204(x, y, s = 1) { g.save(); g.translate(x, y); g.scale(s, s); rrect(-70, -32, 140, 64, 8); g.fillStyle = '#5C8A5A'; g.fill(); g.lineWidth = 3; g.strokeStyle = '#2F4F2E'; g.stroke();
  text('20', -54, 10, 'disp', 26, '#DDF0D8'); g.beginPath(); g.arc(0, 0, 18, 0, 6.283); g.fillStyle = '#7FA97C'; g.fill(); g.restore(); }
// a parachute icon
function chute204(x, y, s = 1, col = GOLD) { g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = col; g.beginPath(); g.arc(0, 0, 60, Math.PI, 0); g.closePath(); g.fill();
  g.strokeStyle = col; g.lineWidth = 4; [-60, -20, 20, 60].forEach((dx) => { g.beginPath(); g.moveTo(dx, 0); g.lineTo(0, 90); g.stroke(); }); g.fillStyle = TXT; g.beginPath(); g.arc(0, 98, 10, 0, 6.283); g.fill(); g.restore(); }
const N204 = 5;

// ---------- open: hook ----------
VIS.open = (K) => { K(0.15, 'hit', 1.3); K(0.2, 'mute', 1, 0.4); const na = sw('name', 3.4); K(na, 'thump', 1);
  return (t) => { atmosphere(t); r2photo(t, 'sketch', { a: [0.5, 0.3, 1.0], b: [0.5, 0.3, 1.08], dur: 4, dim: 0.2 }); tag(t);
    r2graphic(t, -0.5, 'SKETCH · FBI COMPOSITE OF "DAN COOPER"'); r2band(430, 800, 0.7); r2hook(t, EP.hook, 600, { size: 160 }); }; };

// ---------- 0: 1971, "Dan Cooper", hijacks a jet with a bomb ----------
VIS[0] = S(() => { const da = sw('dan', 1.2), hi = sw('hijacks', 2.2), bo = sw('bomb', 3.0);
  return (K) => { ks(K, [[0.1, 'whoosh', 0.8], [0.3, 'hit', 1], [da, 'pen', 1], [hi, 'whoosh', 0.8], [bo, 'hit', 1.3]]);
    return (t) => { atmosphere(t);
      if (t < hi) { r2photo(t, 'ticket', { a: [0.3, 0.45, 1.0], b: [0.3, 0.45, 1.12], dim: 0.15 }); r2real(t, 0.1, 'REAL PHOTO · HIS TICKET, NOV 24, 1971 (FBI)');
        r2band(520, 760, 0.65); r2big(t, 0.15, '1971', 680, { size: 170 });
        if (t > da) chip('NAME ON THE TICKET: "DAN COOPER"', 80, 800, t, da, { size: 30, align: 'left', bg: TXT, fg: BG }); }
      else { r2photo(t, 'jet', { a: [0.45, 0.55, 1.0], b: [0.45, 0.55, 1.1], t0: hi, dim: 0.15 }); r2real(t, hi, 'REAL PHOTO · A NORTHWEST ORIENT 727, 1970');
        r2band(980, 1130, 0.65); r2big(t, hi + 0.05, 'HIJACKED', 1090, { size: 120 });
        if (t > bo) { g.save(); g.translate(shake(t, bo, 12), 0); chip('"I HAVE A BOMB."', 80, 520, t, bo, { size: 44, align: 'left', bg: RED2, fg: TXT }); g.restore(); } }
      tag(t, 0, N204); }; }; });

// ---------- 1: Seattle: passengers out, $200,000 + 4 parachutes in ----------
VIS[1] = S(() => { const se = sw('seattle', 0.3), pa = sw('passengers', 1.0), ca = sw('cash', 2.0), pc = sw('parachutes', 2.8);
  return (K) => { const tk = []; for (let q = ca; q < pc; q += 0.12) tk.push([q, 'coin', 0.5]);
    ks(K, [[0.1, 'whoosh', 0.8], [pa, 'swish', 0.8], ...tk, [pc, 'pop', 1], [pc + 0.15, 'pop', 1], [pc + 0.3, 'pop', 1], [pc + 0.45, 'pop', 1]]);
    return (t) => { techBg(t); r2graphic(t, 0, 'GRAPHIC · THE SWAP IN SEATTLE');
      if (t > se) chip('SEATTLE · PASSENGERS GO FREE', 80, 480, t, se, { size: 30, align: 'left', bg: TXT, fg: BG });
      if (t > ca) { const n = Math.min(14, Math.floor((t - ca) / 0.08)); for (let i = 0; i < n; i++) bill204(200 + (i % 2) * 150, 1090 - Math.floor(i / 2) * 36, 1);
        r2count(t, ca, 0.9, 200000, 80, 680, 130, GOLD, (v) => '$' + Math.round(v).toLocaleString('en-US'));
        r2line(t, ca + 0.3, '10,000 BILLS OF $20', 740, { size: 30 }); }
      if (t > pc) for (let i = 0; i < 4; i++) { const s = spring(t - pc - i * 0.15, 300, 18); if (s > 0.01) chute204(560 + (i % 2) * 150, 850 + Math.floor(i / 2) * 170, 0.8 * s); }
      tag(t, 1, N204); }; }; });

// ---------- 2: over the forests, rear stairs, jumps into the night ----------
VIS[2] = S(() => { const fo = sw('forests', 0.6), re = sw('rear', 2.0), ju = sw('jumps', 3.2), ni = sw('night', 3.9);
  return (K) => { ks(K, [[0.1, 'whoosh', 0.8], [0.2, 'riser', 0.5], [re, 'click', 1], [ju, 'whoosh', 1.2], [ni, 'thump', 1]]);
    return (t) => { atmosphere(t);
      if (t < re) { forest204(t); r2graphic(t, 0, 'GRAPHIC · NIGHT FLIGHT OVER WASHINGTON'); jet204(620 + Math.sin(t) * 10, 640, 0.9, { fill: '#55606B', dark: '#39424B' });
        if (t > fo) r2big(t, fo, 'THE FORESTS', 1110, { size: 100, color: TXT }); }
      else if (t < ju) { const P = r2photo(t, 'stair', { a: [0.42, 0.62, 1.0], b: [0.42, 0.62, 1.15], t0: re, dim: 0.1 }); r2real(t, re, "REAL PHOTO · A NORTHWEST 727'S REAR STAIRS, 1975");
        if (P) { const [x, y] = P(0.55, 0.66); ring(t, re + 0.2, x, y, 120); } r2band(980, 1130, 0.6); r2big(t, re + 0.1, 'REAR STAIRS', 1090, { size: 110 }); }
      else { forest204(t); r2graphic(t, ju, 'GRAPHIC · THE JUMP'); jet204(760 + (t - ju) * 160, 560, 0.7, { fill: '#55606B', dark: '#39424B', stair: (t - ju) * 4 });
        const f = t - ju, fx = 480 - f * 40, fy = 600 + f * f * 140; if (fy < 1050) { g.fillStyle = TXT; g.beginPath(); g.arc(fx, fy, 10, 0, 6.283); g.fill(); g.fillRect(fx - 4, fy + 8, 8, 26); }
        if (t > ni) r2big(t, ni, '?', 900, { size: 260, color: GOLD }); }
      tag(t, 2, N204); }; }; });

// ---------- 3: 1980, $6,000 by the Columbia River; still the only unsolved hijacking ----------
VIS[3] = S(() => { const ei = sw('nineteen', 0.4), bo = sw('boy', 1.0), si = sw('six', 1.6), co = sw('columbia', 3.0), st = sw('still', 4.0), un = sw('unsolved', 4.8);
  return (K) => { ks(K, [[0.1, 'whoosh', 0.8], [si, 'coin', 1], [co, 'splash', 0.7], [st, 'whoosh', 0.8], [un, 'hit', 1.3]]);
    return (t) => { atmosphere(t);
      if (t < st) { r2photo(t, 'money', { a: [0.5, 0.5, 1.0], b: [0.5, 0.5, 1.12], dim: 0.15 }); r2real(t, 0.1, 'REAL PHOTO · THE RANSOM BILLS FOUND IN 1980 (FBI)');
        r2band(520, 800, 0.65); r2big(t, ei, '1980', 640, { size: 130, color: TXT });
        if (t > si) r2count(t, si, 0.7, 6000, 80, 780, 130, GOLD, (v) => '$' + Math.round(v).toLocaleString('en-US'));
        if (t > bo) chip('FOUND BY AN 8-YEAR-OLD', 80, 480, t, bo, { size: 30, align: 'left', bg: TXT, fg: BG });
        if (t > co) chip('COLUMBIA RIVER BANK', 80, 880, t, co, { size: 30, align: 'left', bg: CY, fg: BG }); }
      else { r2photo(t, 'poster', { a: [0.5, 0.25, 1.0], b: [0.5, 0.25, 1.08], t0: st, dim: 0.25 }); r2real(t, st, 'REAL PHOTO · FBI WANTED BULLETIN');
        if (t > un) { r2band(980, 1140, 0.75); g.save(); g.translate(shake(t, un, 12), 0); r2big(t, un, 'STILL UNSOLVED', 1090, { size: 100, color: RED2 }); g.restore(); } }
      tag(t, 3, N204); }; }; });

// ---------- 4: comment card + loop line ----------
VIS[4] = S(() => { const mo = sw('most', 3.0), ne = sw('never', 4.4);
  return (K) => { ks(K, [[0.1, 'whoosh', 0.8], [mo, 'whoosh', 0.6], [ne, 'thump', 1]]);
    return (t) => { atmosphere(t);
      if (t < mo) { forest204(t); jet204(620, 640, 0.9, { fill: '#55606B', dark: '#39424B' }); r2graphic(t, 0.1, 'GRAPHIC · NIGHT FLIGHT OVER WASHINGTON'); }
      else { r2photo(t, 'sketch', { a: [0.5, 0.3, 1.08], b: [0.5, 0.3, 1.0], t0: mo, dim: 0.2 }); r2graphic(t, mo, 'SKETCH · FBI COMPOSITE OF "DAN COOPER"');
        r2band(430, 800, 0.7); r2big(t, mo + 0.2, '$200,000', 640, { size: 160, color: TXT }); if (t > ne) r2big(t, ne, 'NEVER FOUND', 790, { size: 150 }); }
      tag(t, 4, N204); }; }; });
