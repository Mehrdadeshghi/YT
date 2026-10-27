// Wiki Roulette #203 — REEL v2 (E8): the black box (flight recorder) survives 3,400 g and isn't black.
// open: REAL PHOTO orange FDR + CVR, hook "3,400 G / NOT EVEN BLACK" → REAL PHOTO NTSB recovery "BRIGHT ORANGE" →
// GRAPHIC airliner, tail glows "SAFEST SPOT" → GRAPHIC impact 310 MPH → REAL PHOTO burnt wreckage + 1,830 °F →
// REAL PHOTO underwater locator beacon, sonar pings, 30 DAYS → GRAPHIC sinking to 20,000 FT → GRAPHIC orange plane "TOO HEAVY TO FLY" →
// comment card over the NTSB lab photo; loop line "never black" over the opening photo.

// ---------- GRAPHIC: airliner side view (nose right), centred at (x,y), length 900*s ----------
function plane203(x, y, s, o = {}) {
  g.save(); g.translate(x, y); g.rotate(o.rot || 0); g.scale(s, s);
  const body = o.fill || '#DCE3EA', dark = o.dark || '#8E9AA6';
  g.fillStyle = dark; g.beginPath(); g.moveTo(-60, 10); g.lineTo(80, 10); g.lineTo(-40, 120); g.lineTo(-110, 120); g.closePath(); g.fill();        // wing
  g.fillStyle = body; g.beginPath(); g.moveTo(-420, -30); g.lineTo(330, -40); g.quadraticCurveTo(450, -38, 460, 5); g.quadraticCurveTo(450, 40, 330, 40); g.lineTo(-380, 30); g.closePath(); g.fill(); // fuselage
  g.beginPath(); g.moveTo(-300, -30); g.lineTo(-400, -190); g.lineTo(-450, -190); g.lineTo(-420, -30); g.closePath(); g.fill();                // tail fin
  g.beginPath(); g.moveTo(-330, 0); g.lineTo(-470, 30); g.lineTo(-440, 40); g.lineTo(-320, 20); g.closePath(); g.fill();                      // stabiliser
  g.fillStyle = dark; for (let i = 0; i < 16; i++) { g.fillRect(-260 + i * 36, -18, 16, 14); }                                              // windows
  g.fillStyle = '#26303A'; g.beginPath(); g.moveTo(400, -22); g.lineTo(440, -18); g.lineTo(430, -4); g.lineTo(398, -6); g.closePath(); g.fill(); // cockpit
  if (o.tail) { g.save(); g.globalAlpha = clamp(o.tail); g.shadowColor = '#FF7A1A'; g.shadowBlur = 40; rrect(-405, -22, 60, 34, 6); g.fillStyle = '#FF7A1A'; g.fill(); g.restore(); }
  g.restore();
}
// sonar rings from (x,y)
function pings203(t, t0, x, y, col = CY, period = 0.9, reach = 380) { if (t < t0) return; g.save();
  for (let k = 0; k < 4; k++) { const u = (t - t0) / period - k * 0.25; if (u < 0) continue; const f = u % 1;
    g.globalAlpha = 0.8 * (1 - f); g.strokeStyle = col; g.lineWidth = 6; g.shadowColor = col; g.shadowBlur = 14; g.beginPath(); g.arc(x, y, 20 + f * reach, 0, 6.283); g.stroke(); }
  g.restore(); }
const ORANGE203 = '#FF7A1A';
const N203 = 5;

// ---------- open: hook ----------
VIS.open = (K) => { K(0.15, 'hit', 1.3); K(0.2, 'mute', 1, 0.4); const bl = sw('black', 2.6, 1); K(bl, 'thump', 1);
  return (t) => { atmosphere(t); r2photo(t, 'pair', { a: [0.55, 0.62, 1.0], b: [0.55, 0.64, 1.1], dur: 4, dim: 0.45 }); tag(t);
    r2band(430, 780, 0.75); r2real(t, -0.5, 'REAL PHOTO · FLIGHT RECORDERS (NTSB)'); r2hook(t, EP.hook, 600, { size: 160, c2: ORANGE203 }); }; };

// ---------- 0: bright orange; it sits in the tail ----------
VIS[0] = S(() => { const or = sw('orange', 0.6), fi = sw('find', 1.8), ta = sw('tail', 3.0), sa = sw('safest', 3.8);
  return (K) => { ks(K, [[0.1, 'whoosh', 0.8], [or, 'hit', 1], [fi, 'tick', 1], [ta - 0.4, 'whoosh', 0.8], [ta, 'pop', 1], [sa, 'hit', 1]]);
    return (t) => { atmosphere(t);
      if (t < ta - 0.4) { r2photo(t, 'potomac', { a: [0.5, 0.62, 1.0], b: [0.5, 0.66, 1.15], dim: 0.1 }); r2real(t, 0.1, 'REAL PHOTO · NTSB RECOVERS A RECORDER, 2025');
        r2band(980, 1130, 0.6); r2big(t, or, 'BRIGHT ORANGE', 1090, { size: 110, color: ORANGE203 });
        if (t > fi) chip('EASY TO FIND IN WRECKAGE', 80, 500, t, fi, { size: 32, align: 'left', bg: TXT, fg: BG }); }
      else { techBg(t); r2graphic(t, ta - 0.4, 'GRAPHIC · WHERE IT SITS');
        const s = spring(t - ta + 0.4, 220, 20); plane203(560, 760, 1.0 * s, { tail: (t - ta) * 2 });
        if (t > ta) { const [x, y] = [560 - 375, 760 - 5]; ring(t, ta, x, y, 70, { spot: false, color: ORANGE203 }); }
        if (t > sa) r2big(t, sa, 'THE TAIL: SAFEST SPOT', 1060, { size: 84, color: ORANGE203 }); }
      tag(t, 0, N203); }; }; });

// ---------- 1: 310 mph impact; fire over 1,830 °F ----------
VIS[1] = S(() => { const hi = sw('hitting', 0.3), gr = sw('ground', 0.8), mp = sw('miles', 2.0), th = sw('then', 2.8), fi = sw('fire', 3.1), de = sw('degrees', 4.6);
  return (K) => { ks(K, [[0.05, 'riser', 0.6], [mp, 'crack', 1.3], [th, 'whoosh', 0.8], [fi, 'hit', 1], [de, 'thump', 1]]);
    return (t) => { atmosphere(t);
      if (t < th) { techBg(t); r2graphic(t, 0, 'GRAPHIC · THE CRASH TEST IT MUST PASS');
        const p = clamp(t / Math.max(0.6, mp)), ang = 0.55; g.save(); g.translate(shake(t, mp, 22), shake(t + 0.13, mp, 14));
        g.fillStyle = '#2A3440'; g.fillRect(0, 1020, W, 12); plane203(lerp(300, 640, p), lerp(640, 930, p), 0.55, { rot: ang });
        if (t > mp) { g.save(); g.globalAlpha = clamp(1 - (t - mp) / 0.5); g.fillStyle = '#FFF'; g.fillRect(0, 0, W, H); g.restore(); }
        g.restore(); r2count(t, 0.05, Math.max(0.6, mp), 310, 80, 640, 160, GOLD, undefined, ' MPH');
        if (t > mp) r2line(t, mp, 'THAT IS WHAT 3,400 G FEELS LIKE', 700, { size: 30 }); }
      else { r2photo(t, 'carry', { a: [0.62, 0.62, 1.0], b: [0.6, 0.66, 1.12], t0: th, dim: 0.15 }); r2real(t, th, 'REAL PHOTO · RECORDER IN BURNT WRECKAGE (NTSB)');
        g.save(); g.globalCompositeOperation = 'lighter'; g.globalAlpha = 0.3 * clamp((t - fi) / 0.5); const hg = g.createLinearGradient(0, H, 0, 400);
        hg.addColorStop(0, 'rgba(255,90,10,1)'); hg.addColorStop(1, 'rgba(255,90,10,0)'); g.fillStyle = hg; g.fillRect(0, 0, W, H); g.restore();
        r2band(560, 900, 0.6); if (t > fi) r2count(t, fi, Math.max(0.6, de - fi), 1830, 80, 760, 170, ORANGE203, undefined, ' °F');
        if (t > de) r2line(t, de, 'OVER 1,000 °C', 830, { size: 32 }); }
      tag(t, 1, N203); }; }; });

// ---------- 2: beacon pings 30 days, 20,000 ft down ----------
VIS[2] = S(() => { const si = sw('sinks', 0.4), be = sw('beacon', 1.0), da = sw('days', 2.0), ev = sw('even', 2.6), fe = sw('feet', 3.6);
  return (K) => { ks(K, [[0.1, 'whoosh', 0.8], [si, 'splash', 0.9], [be, 'sonar', 1], [da, 'hit', 1], [ev, 'bubble', 0.8], [fe, 'sonar', 1]]);
    return (t) => { atmosphere(t);
      if (t < ev) { r2photo(t, 'ulb', { a: [0.55, 0.45, 1.0], b: [0.55, 0.45, 1.12], dim: 0.15 }); r2real(t, 0.1, 'REAL PHOTO · UNDERWATER LOCATOR BEACON');
        pings203(t, be, 600, 700); if (t > be) { r2band(980, 1130, 0.6); r2big(t, be, 'PING… PING…', 1090, { size: 110, color: CY }); }
        if (t > da) chip('FOR 30 DAYS', 80, 500, t, da, { size: 40, align: 'left', bg: CY, fg: BG }); }
      else { const d = easeOut((t - ev) / Math.max(0.8, fe - ev + 0.4));
        sea(`rgb(${lerp(20, 2, d)},${lerp(80, 8, d)},${lerp(120, 18, d)})`, `rgb(${lerp(6, 0, d)},${lerp(30, 2, d)},${lerp(60, 6, d)})`); marineSnow(t, 25, 0.4 + 0.6 * d);
        r2graphic(t, ev, 'GRAPHIC · STILL HEARD FROM THE DEEP');
        const by = lerp(480, 1000, d); rrect(520, by - 30, 80, 60, 10); g.fillStyle = ORANGE203; g.fill(); pings203(t, ev, 560, by, CY, 0.8, 300);
        r2count(t, ev, Math.max(0.8, fe - ev + 0.4), 20000, 80, 640, 140, TXT, undefined, ' FT');
        if (t > fe) r2line(t, fe, 'ABOUT 6,000 M DOWN', 700, { size: 30 }); }
      tag(t, 2, N203); }; }; });

// ---------- 3: why not build the whole plane out of it? too heavy to fly ----------
VIS[3] = S(() => { const wh = sw('whole', 0.9), he = sw('heavy', 2.4), fl = sw('fly', 3.0);
  return (K) => { ks(K, [[0.1, 'whoosh', 0.8], [wh, 'pop', 1], [he, 'thump', 1.3], [fl, 'land', 1.2]]);
    return (t) => { techBg(t); r2graphic(t, 0, 'GRAPHIC · A PLANE BUILT LIKE A BLACK BOX?');
      const o = clamp((t - wh) / 0.6), drop = easeOut((t - he) / 0.8) * 220;
      plane203(560, 720 + drop, 0.95, { fill: o > 0 ? `rgb(${lerp(220, 255, o)},${lerp(227, 122, o)},${lerp(234, 26, o)})` : undefined, dark: o > 0.5 ? '#B24F0C' : undefined, rot: 0.08 * clamp((t - he) / 0.8) });
      if (t > wh) chip('WHOLE PLANE = RECORDER ARMOR', 80, 480, t, wh, { size: 30, align: 'left', bg: ORANGE203, fg: BG });
      if (t > he) { g.save(); g.translate(shake(t, he, 14), 0); r2big(t, he, 'TOO HEAVY TO FLY', 1110, { size: 100, color: RED2 }); g.restore(); }
      tag(t, 3, N203); }; }; });

// ---------- 4: comment card + loop line ----------
VIS[4] = S(() => { const th = sw('the', 3.2), ne = sw('never', 3.8);
  return (K) => { ks(K, [[0.1, 'whoosh', 0.8], [th, 'whoosh', 0.6], [ne, 'thump', 1]]);
    return (t) => { atmosphere(t);
      if (t < th) { r2photo(t, 'lab', { a: [0.5, 0.45, 1.0], b: [0.5, 0.45, 1.08], dim: 0.25 }); r2real(t, 0.1, 'REAL PHOTO · NTSB RECORDER LAB'); }
      else { r2photo(t, 'pair', { a: [0.55, 0.64, 1.1], b: [0.55, 0.62, 1.0], t0: th, dim: 0.45 }); r2real(t, th, 'REAL PHOTO · FLIGHT RECORDERS (NTSB)');
        r2band(470, 760, 0.75); r2big(t, ne, 'NEVER BLACK.', 640, { size: 150, color: ORANGE203 }); }
      tag(t, 4, N203); }; }; });
