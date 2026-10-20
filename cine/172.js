// Wiki Roulette #172 — OCEAN: sarcastic fringehead (Neoclinus blanchardi), California coast. Frame 1 = the real flared mouth + "opens 4× bigger" →
// real photo La Jolla: it lives in a plastic tube (shells, bottles, soda cans) → real aquarium face, 6–10 in, then the real flared gape (PD) →
// drawn mouth-to-mouth wrestling (ILLUSTRATION), loser loses its home → real photo peeking from its shelter: damages divers' wetsuits → question.
const N172 = 4, YEL172 = '#F5D33B', SEA172 = '#0E3B52';

const ill172 = (t, y = 1590) => text('ILLUSTRATION', 1000, y, 'mono', 22, 'rgba(255,255,255,0.55)', { ls: 3, align: 'right' });
function shade172(y0, y1, a) { const gr = g.createLinearGradient(0, y0, 0, y1); gr.addColorStop(0, `rgba(0,0,0,${a})`); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(0, y0, W, y1 - y0); }

// one cartoon fringehead seen from the side, facing right (dir 1) or left (dir -1); gape 0 … 1 flares the jaws open
function fish172(x, y, dir, gape, s = 1) { g.save(); g.translate(x, y); g.scale(dir * s, s);
  g.fillStyle = '#6B5240'; g.beginPath(); g.ellipse(-150, 0, 190, 62, 0, 0, 6.283); g.fill();                         // body
  g.beginPath(); g.moveTo(-320, 0); g.lineTo(-400, -55); g.lineTo(-390, 55); g.closePath(); g.fill();                    // tail
  g.fillStyle = '#8A6A50'; g.beginPath(); g.ellipse(-170, -58, 150, 22, 0, Math.PI, 0); g.fill();                          // dorsal fin
  g.fillStyle = '#3B82F6'; g.beginPath(); g.arc(-110, -62, 9, 0, 6.283); g.fill();                                          // blue eye-spot on the fin
  g.fillStyle = '#7C5E47'; g.beginPath(); g.ellipse(10, 0, 70, 56, 0, 0, 6.283); g.fill();                                  // head
  g.fillStyle = '#FFF'; g.beginPath(); g.arc(20, -28, 15, 0, 6.283); g.fill(); g.fillStyle = '#111'; g.beginPath(); g.arc(24, -28, 8, 0, 6.283); g.fill();
  const L = 50 + 110 * gape, Hh = 26 + 130 * gape;                                                                          // the flared jaws: an open trumpet
  const mg = g.createLinearGradient(50, 0, 50 + L, 0); mg.addColorStop(0, '#C2410C'); mg.addColorStop(1, YEL172);
  g.fillStyle = mg; g.beginPath(); g.moveTo(45, -22); g.lineTo(45 + L, -Hh); g.quadraticCurveTo(45 + L + 18, 0, 45 + L, Hh); g.lineTo(45, 22); g.closePath(); g.fill();
  g.strokeStyle = '#3A2A1E'; g.lineWidth = 8; g.beginPath(); g.moveTo(45, -22); g.lineTo(45 + L, -Hh); g.moveTo(45, 22); g.lineTo(45 + L, Hh); g.stroke();
  g.fillStyle = '#FFF'; for (let k = 0; k < 6; k++) { const q = 0.25 + k * 0.13; for (const sg of [-1, 1]) { g.beginPath(); g.arc(45 + L * q, sg * (22 + (Hh - 22) * q - 6), 4, 0, 6.283); g.fill(); } }
  g.restore(); }

// ---------- scenes ----------
VIS.open = (K) => { const fo = sw('four', 1.3); K(0.15, 'hit', 1.2); K(0.2, 'mute', 1, 0.4); K(fo, 'boom', 1);
  return (t) => { atmosphere(t); const P = shot(t, 'hand', { a: [0.6, 0.42, 1.0], b: [0.62, 0.42, 1.12], dur: 3, anchor: [540, 1050] });
    shade172(0, 760, 0.85); tag(t); hook(t, EP.hook, 440);
    if (P && t > fo) { const [x, y] = P(0.74, 0.45); ring(t, fo, x, y, 190, { color: YEL172, spot: false }); chip('4×', x - 40, y + 260, t, fo + 0.1, { size: 70, bg: YEL172, fg: BG }); }
    realBadge(t, 0.3, 'REAL PHOTO · SARCASTIC FRINGEHEAD', 1500); }; };

VIS[0] = S(() => { const ca = sw('California', 1.6), sh = sw('shells', 3.0), bo = sw('bottles', 3.4), so = sw('soda', 3.9);
  return vscene(0, N172, { ph: 'tube', o: { box: [40, 720, 1000, 640], credit: 'Photo: Magnus Kjaergaard / CC BY-SA 2.5' }, a: [0.5, 0.3, 1.0], b: [0.5, 0.33, 1.1], dur: 4,
    badge: 'REAL PHOTO · LA JOLLA, CALIFORNIA', k: [[0.3, 'whoosh', 0.7], [ca, 'ding', 0.9], [sh, 'pop', 0.8], [bo, 'pop', 0.9], [so, 'hit', 1.1]],
    f2: ['SARCASTIC', 'FRINGEHEAD', null, 0.5, { y: 500, size: 110 }],
    x: (t, P) => { [[sh, '🐚 SHELLS', 70], [bo, '🍾 BOTTLES', 390], [so, '🥫 SODA CANS', 730]].forEach(([at, s, x]) => { if (t > at) chip(s, x, 1430, t, at, { size: 30, align: 'left', bg: at === so ? YEL172 : 'rgba(8,8,10,0.85)', fg: at === so ? BG : TXT }); });
    } }); });

VIS[1] = S(() => { const si = sw('six', 0.5), fl = sw('flares', 3.2), co = sw('colored', 3.9);
  return (K) => { ks(K, [[0.1, 'whoosh', 0.8], [si, 'hit', 1], [fl, 'boom', 1.1], [co, 'ding', 0.9]]);
    return (t) => { atmosphere(t);
      if (t < fl) { shot(t, 'face', { box: [40, 720, 1000, 720], a: [0.5, 0.45, 1.0], b: [0.45, 0.5, 1.15], dur: 3 }); realBadge(t, 0.3, 'REAL PHOTO · MONTEREY BAY AQUARIUM'); }
      else { const P = shot(t, 'gape', { box: [40, 720, 1000, 760], a: [0.72, 0.62, 1.0], b: [0.74, 0.66, 1.12], dur: 2.5, t0: fl });
        realBadge(t, fl, 'REAL PHOTO · MOUTH FLARED');
        if (P) { const [x, y] = P(0.78, 0.74); ring(t, fl + 0.1, x, y, 170, { color: YEL172, spot: false }); } }
      tag(t, 1, N172);
      if (t < fl) fact2(t, si, '6–10', 'INCHES', null, { y: 520, size: 120 });
      else fact2(t, fl, 'GET CLOSE', 'AND IT FLARES', null, { y: 520, size: 100, c2: YEL172 });
      if (t > co) chip('BRIGHT COLORS INSIDE', 540, 1420, t, co, { size: 38, bg: YEL172, fg: BG }); }; }; });

VIS[2] = S(() => { const pr = sw('pressing', 1.4), bi = sw('bites', 3.0), lo = sw('loses', 4.2);
  return (K) => { ks(K, [[0.1, 'whoosh', 0.8], [pr, 'thump', 1], [bi, 'crack', 1.1], [lo, 'swish', 0.9]]);
    return (t) => { const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, '#0A2C40'); gr.addColorStop(1, '#03121C'); g.fillStyle = gr; g.fillRect(0, 0, W, H);
      g.fillStyle = '#5E4B36'; g.fillRect(0, 1260, W, 340); g.fillStyle = '#7A6448'; for (let k = 0; k < 40; k++) { g.beginPath(); g.arc((k * 97) % W, 1270 + (k * 37) % 300, 4 + k % 5, 0, 6.283); g.fill(); }
      const gape = clamp((t - 0.4) / 0.6), push = t > pr ? Math.sin((t - pr) * 9) * 10 * (t < bi ? 1 : 0) : 0;
      const gap = lerp(420, 300, clamp((t - pr) / 0.6));
      const away = t > lo ? easeOut((t - lo) / 1.0) : 0;
      fish172(540 - gap + push - away * 900, 1030 + away * 40, 1, gape * (1 - away), 1.5);
      fish172(540 + gap - push, 1030, -1, gape, 1.5);
      if (t > bi && t < bi + 0.15) { g.fillStyle = 'rgba(255,255,255,0.35)'; g.fillRect(0, 0, W, H); }
      tag(t, 2, N172); ill172(t);
      fact2(t, 0.3, 'MOUTH TO', 'MOUTH FIGHT', null, { y: 470, size: 110, c2: YEL172 });
      if (t > bi) chip('BITE!', 540, 870, t, bi, { size: 56, bg: RED, fg: '#FFF' });
      if (t > lo) chip('🐚 LOSER LOSES ITS HOME', 540, 1420, t, lo, { size: 38, bg: YEL172, fg: BG }); }; }; });

VIS[3] = S(() => { const we = sw('wetsuits', 2.0);
  return vscene(3, N172, { ph: 'rock', o: { box: [40, 720, 1000, 740] }, a: [0.47, 0.45, 1.0], b: [0.47, 0.48, 1.25], dur: 5, badge: 'REAL PHOTO · HIDING IN ITS SHELTER',
    f2: ['TINY FISH.', 'HUGE TEMPER.', null, 0.4, { y: 520, size: 110, c2: YEL172 }], k: [[0.3, 'whoosh', 0.7], [we, 'hit', 1.1]],
    x: (t, P) => { if (!P) return; const [x, y] = P(0.47, 0.42); ring(t, 0.6, x, y, 150, { color: YEL172, spot: false });
      if (t > we) chip('🤿 DAMAGES WETSUITS', 540, 1420, t, we, { size: 40, bg: RED, fg: '#FFF' }); } }); });
