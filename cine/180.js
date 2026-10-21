// Wiki Roulette #180 — OCEAN: cookiecutter shark. Frame 1 = real NOAA photo of the shark, mouth wide open, under "it attacked U.S. Navy subs" →
// real U.S. Navy attack sub: 1970s bites in the sonar domes, oil leaked, back to base → the bite: suction lips (real photo), saw teeth (real jaws),
// it twists → a round plug, 2 in (real dolphin with a fresh bite) → the glowing belly with a dark collar (real photo) and how the collar works as a
// lure from below (GRAPHIC) → real elephant seal covered in round scars; off Hawaii nearly every adult spinner dolphin has them → question.
const N180 = 4, GLOW180 = '#7CFFB2', OCEAN180 = '#04121E';

const gfx180 = (t, y = 1590) => text('GRAPHIC', 1000, y, 'mono', 22, 'rgba(255,255,255,0.55)', { ls: 3, align: 'right' });

// the shark seen from below (pointing right): a glowing green cigar with a dark collar band (glow 0 … 1)
function cookie180(x, y, s, glow) { g.save(); g.translate(x, y); g.scale(s, s);
  g.shadowColor = GLOW180; g.shadowBlur = 60 * glow;
  g.fillStyle = `rgba(124,255,178,${0.25 + 0.65 * glow})`; g.beginPath(); g.ellipse(0, 0, 230, 46, 0, 0, 6.283); g.fill();             // body
  g.beginPath(); g.moveTo(-210, 0); g.lineTo(-320, -60); g.lineTo(-300, 0); g.lineTo(-320, 55); g.closePath(); g.fill();          // tail
  g.shadowBlur = 0; g.fillStyle = '#0B0F12'; g.beginPath(); g.ellipse(120, 0, 34, 47, 0, 0, 6.283); g.fill();                     // dark collar
  g.restore(); }
// a fish silhouette (pointing right), outline or filled
function fish180(x, y, s, col, fill, a = 1, flip = false) { g.save(); g.globalAlpha = a; g.translate(x, y); g.scale(flip ? -s : s, s); g.beginPath();
  g.moveTo(60, 0); g.quadraticCurveTo(10, -38, -40, -6); g.lineTo(-70, -30); g.lineTo(-62, 0); g.lineTo(-70, 30); g.lineTo(-40, 6); g.quadraticCurveTo(10, 38, 60, 0); g.closePath();
  if (fill) { g.fillStyle = col; g.fill(); } else { g.strokeStyle = col; g.lineWidth = 6 / s; g.stroke(); } g.restore(); }

// ---------- scenes ----------
VIS.open = (K) => { const nv = sw('Navy', 0.6), sh = sw('shark', 2.4), tw = sw('two', 3.3); K(0.15, 'hit', 1.2); K(0.2, 'mute', 1, 0.4); K(sh, 'boom', 1); K(tw, 'ding', 0.9);
  return (t) => { atmosphere(t); const P = shot(t, 'front', { box: [40, 690, 1000, 830], a: [0.38, 0.3, 1.0], b: [0.38, 0.28, 1.12], dur: 4, anchor: [540, 1010] });
    tag(t); hook(t, EP.hook, 440);
    if (P && t > sh) { const [x, y] = P(0.37, 0.27); ring(t, sh, x, y, 170, { color: RED, spot: false }); }
    if (t > nv && t < sh) chip('🚨 SECRET ENEMY WEAPON?', 540, 1440, t, nv, { size: 40, bg: RED, fg: '#FFF' });
    if (t > tw) chip('📏 UNDER 2 FT LONG', 540, 1440, t, tw, { size: 42, bg: GOLD, fg: BG });
    realBadge(t, 0.3, 'REAL PHOTO · COOKIECUTTER SHARK', 1180 - 470); }; };

VIS[0] = S(() => { const sv = sw('seventies', 0.6), dm = sw('domes', 2.0), oi = sw('Oil', 3.6), ba = sw('base', 5.4);
  return (K) => { ks(K, [[0.1, 'whoosh', 0.8], [dm, 'crack', 1.0], [oi, 'swish', 0.9], [ba, 'thump', 1]]);
    return (t) => { atmosphere(t); const P = shot(t, 'sub', { box: [40, 720, 1000, 640], a: [0.62, 0.5, 1.15], b: [0.72, 0.5, 1.35], dur: 6 });
      tag(t, 0, N180); realBadge(t, 0.3, 'REAL PHOTO · A U.S. NAVY ATTACK SUBMARINE');
      fact2(t, 0.3, '1970s:', 'NAVY SUBS BITTEN', null, { y: 470, size: 110, c2: GOLD });
      if (P && t > dm && t < oi) callout(t, dm, P(0.975, 0.66), 640, 1440, 'SONAR DOME · AT THE BOW, UNDERWATER', { size: 30 });
      if (t > oi && t < ba) chip('🛢 THE OIL INSIDE LEAKED', 540, 1440, t, oi, { size: 38, bg: '#FFF', fg: BG });
      if (t > ba) chip('↩ BACK TO BASE', 540, 1440, t, ba, { size: 44, bg: RED, fg: '#FFF' }); }; }; });

VIS[1] = S(() => { const li = sw('lips', 1.0), sa = sw('saw', 1.9), tw = sw('twists', 3.0), pl = sw('plug', 4.0), ii = sw('inches', 4.6);
  return (K) => { ks(K, [[0.1, 'whoosh', 0.8], [li, 'pop', 0.9], [sa, 'crack', 1], [tw, 'swish', 1], [pl, 'hit', 1.1]]);
    return (t) => { atmosphere(t); const st = t < sa ? 0 : t < pl ? 1 : 2; let P;
      if (st === 0) { P = shot(t, 'front', { box: [40, 720, 1000, 640], a: [0.37, 0.24, 2.2], b: [0.37, 0.25, 2.4], dur: 3 });
        realBadge(t, 0.3, 'REAL PHOTO · THE LIPS'); if (P && t > li) { const [x, y] = P(0.37, 0.24); ring(t, li, x, y, 260, { color: GOLD, spot: false }); } }
      else if (st === 1) { P = shot(t, 'jaws', { box: [40, 720, 1000, 640], a: [0.5, 0.75, 1.1], b: [0.5, 0.78, 1.3], dur: 3, t0: sa });
        realBadge(t, sa, 'REAL PHOTO · THE LOWER TEETH'); }
      else { P = shot(t, 'bites', { box: [40, 720, 1000, 640], a: [0.483, 0.45, 2.2], b: [0.483, 0.45, 2.6], dur: 3, t0: pl, anchor: [540, 1040] });
        realBadge(t, pl, 'REAL PHOTO · DOLPHIN WITH A FRESH BITE'); if (P) { const [x, y] = P(0.483, 0.45); ring(t, pl + 0.15, x, y, 90, { color: GOLD, spot: false }); } }
      tag(t, 1, N180);
      if (st === 0) fact2(t, 0.3, '1. SUCTION', 'LIPS GRAB ON', null, { y: 470, size: 110, c2: GOLD });
      else if (t < tw) fact2(t, sa, '2. SAW TEETH', 'SLICE IN', null, { y: 470, size: 110, c2: GOLD });
      else fact2(t, tw, '3. IT TWISTS', 'A ROUND PLUG', null, { y: 470, size: 110, c2: GOLD });
      if (st === 1 && t > tw) chip('🌀 IT SPINS ITS WHOLE BODY', 540, 1440, t, tw, { size: 38, bg: '#FFF', fg: BG });
      if (st === 2 && t > ii) chip('🍪 ~2 IN ACROSS', 540, 1440, t, ii, { size: 44, bg: GOLD, fg: BG }); }; }; });

VIS[2] = S(() => { const gr = sw('green', 0.9), co = sw('collar', 2.0), be = sw('below', 3.6), hu = sw('Hunters', 4.4), bi = sw('bite', 6.0);
  return (K) => { ks(K, [[0.1, 'whoosh', 0.8], [gr, 'ding', 0.8], [co, 'pop', 1], [be, 'whoosh', 0.9], [hu, 'swish', 0.9], [bi, 'crack', 1.1]]);
    return (t) => {
      if (t < be) { atmosphere(t); const P = shot(t, 'shark', { box: [40, 720, 1000, 640], a: [0.6, 0.5, 1.0], b: [0.6, 0.5, 1.1], dur: 4 });
        tag(t, 2, N180); realBadge(t, 0.3, 'REAL PHOTO · THE DARK COLLAR');
        fact2(t, 0.3, 'ITS BELLY', 'GLOWS GREEN', null, { y: 470, size: 110, c2: GLOW180 });
        if (P && t > co) { const [x, y] = P(0.6, 0.53); ring(t, co, x, y, 190, { color: GLOW180, spot: false }); chip('EXCEPT ONE DARK COLLAR', 540, 1440, t, co + 0.1, { size: 38, bg: GLOW180, fg: BG }); }
        return; }
      const lt = t - be, sky = g.createLinearGradient(0, 0, 0, H); sky.addColorStop(0, '#1E5A7A'); sky.addColorStop(0.45, '#0A2A40'); sky.addColorStop(1, OCEAN180);
      g.fillStyle = sky; g.fillRect(0, 0, W, H);                                                                  // looking up from below: light from the surface
      g.save(); g.globalAlpha = 0.18; g.fillStyle = '#BFE8FF'; for (let k = 0; k < 7; k++) { g.beginPath(); g.moveTo(80 + k * 150 + 40 * Math.sin(t + k), 0);
        g.lineTo(140 + k * 150, 0); g.lineTo(240 + k * 120, 1500); g.lineTo(200 + k * 120, 1500); g.closePath(); g.fill(); } g.restore();
      const glow = 0.8 + 0.2 * Math.sin(t * 3), sx = 430 + 20 * Math.sin(t * 0.8), sy = 980;
      cookie180(sx, sy, 1.2, glow);
      fish180(sx + 144, sy, 0.65, '#FFF', false, 0.4 + 0.6 * Math.abs(Math.sin(lt * 3)));                       // the collar reads as a small fish
      if (t > hu) { const p = easeOut((t - hu) / Math.max(0.6, bi - hu)), hx = lerp(1300, sx + 432, p), hy = lerp(1500, sy + 70, p);
        fish180(hx, hy, 2.6, '#8FA9B8', true, 1, true);                                                          // a hunter comes up for the "fish"
        if (t > bi) { const f = clamp((t - bi) / 0.3); g.save(); g.fillStyle = OCEAN180; g.beginPath(); g.arc(hx - 110, hy - 10, 34 * easeOut(f), 0, 6.283); g.fill();   // the round plug is gone
          g.strokeStyle = `rgba(255,255,255,${1 - f})`; g.lineWidth = 8; g.beginPath(); g.arc(hx - 110, hy - 10, 34 + 90 * f, 0, 6.283); g.stroke(); g.restore(); } }
      tag(t, 2, N180); gfx180(t);
      fact2(t, be, 'FROM BELOW,', 'A SMALL FISH?', null, { y: 470, size: 110, c2: GLOW180 });
      if (t > hu && t < bi) chip('🐟 A HUNTER COMES CLOSER', 540, 1440, t, hu, { size: 38, bg: '#FFF', fg: BG });
      if (t > bi) chip('🍪 …AND LOSES A BITE', 540, 1440, t, bi, { size: 42, bg: GOLD, fg: BG }); }; }; });

VIS[3] = S(() => { const gw = sw('whites', 1.4), sc = sw('scars', 2.2), hw = sw('Hawaii', 3.4);
  return vscene(3, N180, { ph: 'seal', o: { box: [40, 720, 1000, 640] }, a: [0.55, 0.5, 1.2], b: [0.58, 0.5, 1.4], dur: 6, badge: 'REAL PHOTO · ELEPHANT SEAL WITH COOKIECUTTER SCARS',
    k: [[0.3, 'whoosh', 0.7], [sc, 'pop', 1], [hw, 'hit', 1.1]],
    x: (t, P) => { if (t < hw) fact2(t, 0.3, 'WHALES. SEALS.', 'EVEN GREAT WHITES.', null, { y: 470, size: 100, c2: GOLD });
      else fact2(t, hw, 'OFF HAWAII:', 'NEARLY EVERY ONE', null, { y: 470, size: 110, c2: GOLD });
      if (P && t > sc) for (const [u, v, d] of [[0.53, 0.47, 0], [0.6, 0.42, 0.15], [0.46, 0.5, 0.3]]) { const [x, y] = P(u, v); ring(t, sc + d, x, y, 46, { color: GOLD, spot: false, lw: 6 }); }
      if (t > hw) chip('🐬 ADULT SPINNER DOLPHINS: ALMOST ALL SCARRED', 540, 1440, t, hw, { size: 32, bg: GOLD, fg: BG }); } }); });
