// Wiki Roulette #193 — WHY? #8: why does the Moon look huge near the horizon? (series kit: cine/why.js)
// Frame 1 = WHY? badge + question over two real photos: a huge-looking rising Moon vs the Moon high in the night sky →
// REASON 1 not bigger (GRAPHIC: the same real Moon photo at the same size twice, "1.5% FARTHER" at the horizon) →
// pebble test (GRAPHIC: a 0.33 in pebble at 25 in covers the Moon, high and low) → REASON 2 your brain, the textbook idea
// (real footage: Moon rising over Joshua trees; terrain → "seems far" → looks ~50% bigger) → twist: still argued, even Aristotle
// (real photo: bust of Aristotle) → comment card + "your next why".
const N193 = 4;
const gfx193 = (x, y) => text('GRAPHIC', x, y, 'mono', 22, 'rgba(255,255,255,0.6)', { ls: 3, align: 'right' });

// the real Moon photo cut into a disc (falls back to a drawn disc)
function moon193(x, y, r, a = 1) { const im = PHOTOS.full; g.save(); g.globalAlpha *= a; g.beginPath(); g.arc(x, y, r, 0, 6.283); g.clip();
  if (im) { const s = (2 * r) / (Math.min(im.width, im.height) * 0.86); g.drawImage(im, x - im.width * s / 2, y - im.height * s / 2, im.width * s, im.height * s); }
  else { g.fillStyle = '#E8E4D8'; g.fill(); } g.restore(); }
function pebble193(x, y, r, s) { if (s <= 0.001) return; g.save(); g.translate(x, y); g.scale(s, s); g.shadowColor = 'rgba(0,0,0,0.6)'; g.shadowBlur = 18;
  const gr = g.createRadialGradient(-r * 0.3, -r * 0.35, 3, 0, 0, r * 1.2); gr.addColorStop(0, '#9A948A'); gr.addColorStop(1, '#4A4640');
  g.fillStyle = gr; g.beginPath(); g.ellipse(0, 0, r * 1.08, r, 0.3, 0, 6.283); g.fill(); g.restore(); }
// night scene panel: sky gradient + dark hills; returns nothing
function night193(y0, h) { const gr = g.createLinearGradient(0, y0, 0, y0 + h); gr.addColorStop(0, '#05070F'); gr.addColorStop(1, '#1A2236');
  g.save(); rrect(40, y0, 1000, h, 30); g.fillStyle = gr; g.fill(); g.clip(); stars(0, 60, 9);
  g.fillStyle = '#0B0C10'; g.beginPath(); g.moveTo(40, y0 + h); for (let x = 40; x <= 1040; x += 20) g.lineTo(x, y0 + h - 70 - 30 * Math.sin(x / 90) - 18 * Math.sin(x / 37)); g.lineTo(1040, y0 + h); g.fill();
  g.restore(); g.save(); g.lineWidth = 3; g.strokeStyle = 'rgba(255,255,255,0.16)'; rrect(40, y0, 1000, h, 30); g.stroke(); g.restore(); }

// ---------- scenes ----------
VIS.open = (K) => { K(0.15, 'hit', 1.3); K(0.2, 'mute', 1, 0.4); const hu = sw('huge', 1.4), ti = sw('tiny', 2.6), wh = sw('why', 3.2);
  K(hu, 'pop', 1); K(ti, 'tick', 1); K(wh, 'thump', 1);
  return (t) => { atmosphere(t);
    whyPair(t, { id: 'nyc', label: 'LOW: HUGE', at: hu, a: [0.42, 0.3, 1.0], b: [0.42, 0.3, 1.1] },
               { id: 'bartlett', label: 'HIGH: TINY', at: ti, a: [0.75, 0.3, 1.0], b: [0.75, 0.3, 1.08] }, 790, 1570, { cols: true }); tag(t);
    whyBadge(t, -0.4, 80, 345); whyQ(t, -0.5, EP_RAW.why.q, 625, { size: 104 }); }; };

VIS[0] = S(() => { const ph = sw('photos', 1.4), sa = sw('same', 2.0), fa = sw('farther', 4.2);
  return (K) => { ks(K, [[0.1, 'whoosh', 0.8], [ph, 'tick', 1], [sa, 'hit', 1.1], [fa, 'ding', 1]]);
    return (t) => { atmosphere(t); night193(690, 760);
      const a = clamp((t - ph) / 0.3), R = 105;
      moon193(780, 860, R, a); moon193(300, 1250, R, a);
      if (t > ph) { label('HIGH', 780, 1010, t, ph, { size: 26, align: 'center', color: TXT, ls: 4 }); label('AT THE HORIZON', 300, 1120, t, ph, { size: 26, align: 'center', color: TXT, ls: 4 }); }
      if (t > sa) { ruler(t, sa, 780 - R, 735, 2 * R, 'SAME SIZE', { size: 28 }); ruler(t, sa + 0.15, 300 - R, 1395, 2 * R, 'SAME SIZE', { size: 28 }); }
      if (t > fa) chip('≈1.5% FARTHER AWAY', 640, 1250, t, fa, { size: 32, align: 'left', bg: GOLD, fg: BG });
      gfx193(1010, 1430);
      tag(t, 0, N193); whyReason(t, 0.1, 1, 'NOT BIGGER.'); }; }; });

VIS[1] = S(() => { const pe = sw('pebble', 0.9), ar = sw('arm', 1.6), hi = sw('high', 3.0), lo = sw('low', 3.6);
  return (K) => { ks(K, [[0.1, 'whoosh', 0.8], [pe, 'pop', 1], [hi, 'hit', 1], [lo, 'hit', 1]]);
    return (t) => { atmosphere(t); night193(690, 760); const R = 105;
      moon193(780, 860, R); moon193(300, 1250, R);
      pebble193(780, 860, R * 1.05, spring(t - hi, 300, 18)); pebble193(300, 1250, R * 1.05, spring(t - lo, 300, 18));
      if (t > hi) chip('COVERED ✓', 780, 1010, t, hi, { size: 30, bg: GOLD, fg: BG });
      if (t > lo) chip('COVERED ✓', 300, 1120, t, lo, { size: 30, bg: GOLD, fg: BG });
      if (t > pe) { panel(80, 470, 920, 170, 0.0); rgbPop('PEBBLE TEST', 80, 560, 110, GOLD, t, pe); }
      if (t > ar) label('0.33 INCH PEBBLE · 25 INCHES FROM YOUR EYE', 84, 625, t, ar, { size: 26, color: TXT, ls: 2 });
      gfx193(1010, 1430); tag(t, 1, N193); }; }; });

VIS[2] = S(() => { const la = sw('land', 2.2), fa = sw('far', 3.0), br = sw('brain', 3.8), fi = sw('fifty', 5.4);
  return (K) => { ks(K, [[0.1, 'whoosh', 0.8], [la, 'tick', 1], [fa, 'tick', 1], [br, 'hit', 1.1], [fi, 'ding', 1]]);
    return (t) => { atmosphere(t);
      const P = clip(t, 'mclip', { box: [40, 690, 1000, 760], a: [0.72, 0.5, 1.0], b: [0.72, 0.5, 1.08], dur: 8, rate: 1.6 }); if (!P) noPhoto(t);
      realBadge(t, 0.3, 'REAL FOOTAGE · MOONRISE, JOSHUA TREE, CALIFORNIA');
      if (t > la) chip('TREES + LAND', 260, 1300, t, la, { size: 32, bg: TXT, fg: BG });
      if (t > fa) chip('→ "IT\'S FAR AWAY"', 640, 1300, t, fa, { size: 32, bg: TXT, fg: BG });
      if (t > br) chip('BRAIN: "SO IT MUST BE HUGE"', 540, 1380, t, br, { size: 32, bg: GOLD, fg: BG });
      if (t > fi) { panel(560, 760, 440, 150, 0.85); rgbPop('≈ +50%', 590, 850, 80, GOLD, t, fi); label('LOOKS THIS MUCH WIDER', 594, 892, t, fi + 0.2, { size: 20, color: TXT, ls: 2 }); }
      tag(t, 2, N193); whyReason(t, 0.1, 2, 'YOUR BRAIN.'); label('THE TEXTBOOK IDEA', 84, 650, t, 0.6, { size: 26, color: TXT, ls: 4 }); }; }; });

VIS[3] = S(() => { const ar = sw('argue', 1.4), ari = sw('aristotle', 2.4), pb = sw('pebble', 4.6), nx = sw('next', 6.4);
  return (K) => { ks(K, [[0.1, 'whoosh', 0.8], [ar, 'hit', 1], [ari, 'ding', 1], [nx, 'pop', 0.9]]);
    return (t) => { atmosphere(t);
      const P = shot(t, 'aristotle', { box: [40, 690, 1000, 600], a: [0.5, 0.3, 1.0], b: [0.5, 0.28, 1.1], dur: 6 }); if (!P) noPhoto(t);
      realBadge(t, 0.3, 'REAL PHOTO · BUST OF ARISTOTLE, ROME');
      if (t > ar) chip('NO SINGLE THEORY HAS WON', 540, 760, t, ar, { size: 32, bg: TXT, fg: BG });
      if (t > ari) chip('ARISTOTLE · ~330 BC', 540, 1230, t, ari, { size: 34, bg: GOLD, fg: BG });
      tag(t, 3, N193); whyReason(t, 0.1, null, 'STILL A MYSTERY.');
      whyNext(t, nx, undefined, 1340); }; }; });
