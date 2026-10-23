// Wiki Roulette #195 — WHY? why do we get goosebumps? (series kit: cine/why.js)
// Frame 1 = WHY? badge + question over two real photos side by side: a scared cat with raised fur vs goosebumps on a human arm →
// REASON 1 tiny muscles (GRAPHIC: skin cross-section, a hair muscle contracts, the hair stands up, a bump rises; FIGHT OR FLIGHT) →
// REASON 2 a warm coat (GRAPHIC: fur lying flat → raised, air pockets between the hairs, cold stays out, HEAT stays in) →
// REASON 3 look bigger (real photos: angry cat, then a crested porcupine with raised quills; QUILLS = HAIRS) → leftover reflex: music, horror movies
// (real photo: concert audience) + comment card + "your next why".
const N195 = 4;
const gfx195 = (str = 'GRAPHIC', x = 1000, y = 1430) => text(str, x, y, 'mono', 22, 'rgba(255,255,255,0.55)', { ls: 3, align: 'right' });

// skin cross-section graphic in box (x, y, w, h): 3 hairs with their arrector muscles; at tUp the muscles contract, hairs stand up,
// bumps rise on the surface
function skin195(t, tUp, x, y, w, h) {
  const k = easeOut(clamp((t - tUp) / 0.6)), sy = y + h * 0.38;
  g.save(); rrect(x, y, w, h, 30); g.fillStyle = 'rgba(14,20,28,0.95)'; g.fill(); g.clip();
  // dermis
  const dg = g.createLinearGradient(0, sy, 0, y + h); dg.addColorStop(0, '#E9B79A'); dg.addColorStop(1, '#B9786A'); g.fillStyle = dg;
  const hx = [x + w * 0.2, x + w * 0.5, x + w * 0.8];
  g.beginPath(); g.moveTo(x, y + h); g.lineTo(x, sy);
  for (let px = x; px <= x + w; px += 10) { let b = 0; hx.forEach((c) => { b += 26 * k * Math.exp(-((px - c) ** 2) / (2 * 38 * 38)); }); g.lineTo(px, sy - b); }
  g.lineTo(x + w, y + h); g.closePath(); g.fill();
  g.fillStyle = 'rgba(255,240,230,0.35)'; g.fillRect(x, sy + 2, w, 6);
  hx.forEach((c, i) => {
    const fx = c, fy = sy + 230, ang = lerp(0.95, 0.05, k) * (i === 1 ? 1 : 1);       // follicle tilted, then upright
    // follicle
    g.save(); g.translate(fx, fy); g.rotate(ang * 0.5);
    g.fillStyle = 'rgba(120,60,50,0.55)'; rrect(-22, -230, 44, 250, 22); g.fill();
    g.fillStyle = '#5A3A2A'; g.beginPath(); g.ellipse(0, 6, 26, 30, 0, 0, 6.283); g.fill(); g.restore();
    // hair shaft out of the skin
    const tipA = -Math.PI / 2 + lerp(1.05, 0.08, k), L = 250;
    g.strokeStyle = '#3A2418'; g.lineWidth = 10; g.lineCap = 'round'; g.beginPath(); g.moveTo(fx, sy - 6 - 26 * k); g.lineTo(fx + Math.cos(tipA) * L, sy - 6 - 26 * k + Math.sin(tipA) * L); g.stroke();
    // arrector pili muscle: from follicle side to the skin surface; thicker + shorter when contracted
    const mx0 = fx + 18, my0 = fy - 120, mx1 = fx + 120 - 30 * k, my1 = sy + 30;
    g.strokeStyle = k > 0.05 ? '#E0434F' : '#C26A6A'; g.lineWidth = 18 + 10 * k; g.beginPath(); g.moveTo(mx0, my0); g.quadraticCurveTo(mx0 + 60, (my0 + my1) / 2 + 20 * (1 - k), mx1, my1); g.stroke();
    if (k > 0 && k < 1) { g.strokeStyle = `rgba(255,215,90,${1 - k})`; g.lineWidth = 4; g.beginPath(); g.arc((mx0 + mx1) / 2 + 20, (my0 + my1) / 2, 40 + 40 * k, 0, 6.283); g.stroke(); }
  });
  g.restore(); g.lineWidth = 3; g.strokeStyle = 'rgba(255,255,255,0.16)'; rrect(x, y, w, h, 30); g.stroke();
}

// fur as a graphic: a skin band with 34 hairs, lying flat → raised at tUp; air pockets fill the gaps at tAir; cold arrows from above
// bounce off, warm glow stays under the fur from tHeat
function fur195(t, tUp, tAir, tHeat, x, y, w, h) {
  const k = easeOut(clamp((t - tUp) / 0.6)), sy = y + h * 0.72;
  g.save(); rrect(x, y, w, h, 30); g.fillStyle = 'rgba(14,20,28,0.95)'; g.fill(); g.clip();
  if (t > tHeat) { const a = clamp((t - tHeat) / 0.5) * (0.75 + 0.15 * Math.sin(t * 4)); const gr = g.createLinearGradient(0, sy - 260, 0, sy);
    gr.addColorStop(0, 'rgba(255,140,40,0)'); gr.addColorStop(1, `rgba(255,140,40,${0.55 * a})`); g.fillStyle = gr; g.fillRect(x, sy - 260, w, 260); }
  // cold arrows
  for (let i = 0; i < 5; i++) { const ax = x + 120 + i * 190, ph = ((t * 0.7 + i * 0.29) % 1), stop = sy - 40 - 230 * k, ay = y + 60 + ph * (stop - y - 60);
    g.globalAlpha = 0.8 * (1 - ph * 0.6); g.strokeStyle = '#8FD3FF'; g.lineWidth = 6; g.beginPath(); g.moveTo(ax, ay - 50); g.lineTo(ax, ay); g.stroke();
    g.fillStyle = '#8FD3FF'; g.beginPath(); g.moveTo(ax - 14, ay - 6); g.lineTo(ax + 14, ay - 6); g.lineTo(ax, ay + 14); g.closePath(); g.fill(); g.globalAlpha = 1; }
  text('COLD', x + w - 40, y + 60, 'mono', 26, '#8FD3FF', { ls: 4, align: 'right' });
  // air pockets
  if (t > tAir) { const a = clamp((t - tAir) / 0.5); for (let i = 0; i < 16; i++) { const px = x + 40 + (i + 0.5) * (w - 80) / 16, py = sy - 70 - 130 * ((i * 0.37) % 1) + Math.sin(t * 1.5 + i) * 8;
    g.strokeStyle = `rgba(255,215,140,${0.8 * a})`; g.lineWidth = 3; g.beginPath(); g.arc(px, py, 18 + (i % 3) * 5, 0, 6.283); g.stroke(); } }
  // hairs
  g.strokeStyle = '#6B4A33'; g.lineWidth = 9; g.lineCap = 'round';
  for (let i = 0; i < 34; i++) { const hx = x + 30 + i * (w - 60) / 33, ang = -Math.PI / 2 + lerp(1.25, 0.12 * Math.sin(i * 1.7), k), L = 250;
    g.beginPath(); g.moveTo(hx, sy); g.quadraticCurveTo(hx + Math.cos(ang) * L * 0.5 + 10, sy + Math.sin(ang) * L * 0.5, hx + Math.cos(ang) * L, sy + Math.sin(ang) * L); g.stroke(); }
  // skin
  const dg = g.createLinearGradient(0, sy, 0, y + h); dg.addColorStop(0, '#E9B79A'); dg.addColorStop(1, '#B9786A'); g.fillStyle = dg; g.fillRect(x, sy, w, y + h - sy);
  text('SKIN', x + 40, sy + 70, 'mono', 26, 'rgba(60,30,20,0.8)', { ls: 4 });
  g.restore(); g.lineWidth = 3; g.strokeStyle = 'rgba(255,255,255,0.16)'; rrect(x, y, w, h, 30); g.stroke();
}

// ---------- scenes ----------
VIS.open = (K) => { K(0.15, 'hit', 1.3); K(0.2, 'mute', 1, 0.4); const ca = sw('cat', 0.4), go = sw('goosebumps', 1.4), sa = sw('same', 2.2), wh = sw('why', 2.8);
  K(go, 'pop', 1); K(sa, 'tick', 1); K(wh, 'thump', 1);
  return (t) => { atmosphere(t);
    whyPair(t, { id: 'cat3', label: 'SCARED CAT', at: ca, a: [0.5, 0.45, 1.0], b: [0.5, 0.45, 1.06] },
               { id: 'arm', label: 'YOU', at: go, a: [0.5, 0.5, 1.0], b: [0.5, 0.5, 1.12] }, 790, 1570, { cols: true }); tag(t);
    if (t > sa) chip('SAME REFLEX', 540, 1180, t, sa, { size: 44, bg: RED, fg: '#FFF' });
    whyBadge(t, -0.4, 80, 345); whyQ(t, -0.5, EP_RAW.why.q, 625, { size: 112 }); }; };   // badge + question fully drawn on frame 1

VIS[0] = S(() => { const mu = sw('muscles', 0.8), fi = sw('fight', 2.2), up = sw('straight', 3.4);
  return (K) => { ks(K, [[0.1, 'whoosh', 0.8], [mu, 'tick', 1], [fi, 'hit', 1], [up, 'pop', 1.1]]);
    return (t) => { atmosphere(t); tag(t, 0, N195);
      skin195(t, Math.min(up, fi + 0.8), 40, 690, 1000, 760); gfx195('GRAPHIC', 1010, 1430);
      whyReason(t, 0.1, 1, 'TINY MUSCLES.');
      if (t > mu) chip('ONE AT EVERY HAIR', 80, 760, t, mu, { size: 30, align: 'left', bg: TXT, fg: BG });
      if (t > fi) chip('⚡ FIGHT-OR-FLIGHT NERVES', 540, 1380, t, fi, { size: 34, bg: GOLD, fg: BG }); }; }; });

VIS[1] = S(() => { const fu = sw('furry', 1.2), ra = sw('raised', 1.8), tr = sw('traps', 2.2), he = sw('heat', 3.0);
  return (K) => { ks(K, [[0.1, 'whoosh', 0.8], [fu, 'tick', 1], [ra, 'pop', 1], [he, 'ding', 1]]);
    return (t) => { atmosphere(t); tag(t, 1, N195);
      fur195(t, ra, tr, he, 40, 690, 1000, 760); gfx195('GRAPHIC', 1010, 1430);
      whyReason(t, 0.1, 2, 'A WARM COAT.');
      if (t > fu && t < ra) chip('FUR LYING FLAT', 540, 760, t, fu, { size: 34, bg: TXT, fg: BG });
      if (t > ra) chip('FUR RAISED', 540, 760, t, ra, { size: 34, bg: GOLD, fg: BG });
      if (t > tr) chip('AIR TRAPPED BETWEEN HAIRS', 540, 1300, t, tr, { size: 32, bg: TXT, fg: BG });
      if (t > he) chip('🔥 HEAT STAYS IN', 540, 1385, t, he, { size: 38, bg: GOLD, fg: BG }); }; }; });

VIS[2] = S(() => { const sc = sw('scared', 1.0), po = sw('porcupine', 1.8), qu = sw('quills', 2.6), ha = sw('hairs', 3.6);
  return (K) => { ks(K, [[0.1, 'whoosh', 0.8], [sc, 'tick', 1], [po, 'hit', 1], [ha, 'ding', 1]]);
    return (t) => { atmosphere(t);
      const P = t < po - 0.1 ? shot(t, 'cat2', { box: [40, 690, 1000, 760], a: [0.5, 0.4, 1.0], b: [0.5, 0.4, 1.08], dur: 4 })
                             : shot(t, 'porc2', { box: [40, 690, 1000, 760], a: [0.45, 0.5, 1.0], b: [0.45, 0.5, 1.1], dur: 5, t0: po }); if (!P) noPhoto(t); tag(t, 2, N195);
      if (t < po - 0.1) realBadge(t, 0.3, 'REAL PHOTO · AN ANGRY CAT'); else realBadge(t, po, 'REAL PHOTO · CRESTED PORCUPINE, QUILLS UP');
      whyReason(t, 0.1, 3, 'LOOK BIGGER.');
      if (t > sc && t < po - 0.1) chip('PUFF UP = LOOK BIGGER', 540, 1380, t, sc, { size: 36, bg: TXT, fg: BG });
      if (t > qu && t < ha) chip('QUILLS UP', 540, 1380, t, qu, { size: 40, bg: GOLD, fg: BG });
      if (t > ha) chip('QUILLS = HAIRS, TOO', 540, 1380, t, ha, { size: 40, bg: RED, fg: '#FFF' }); }; }; });

VIS[3] = S(() => { const le = sw('leftover', 0.8), mu = sw('music', 2.0), ho = sw('horror', 2.8), nx = sw('next', 6.4);
  return (K) => { ks(K, [[0.1, 'whoosh', 0.8], [le, 'tick', 1], [mu, 'ding', 1], [ho, 'thump', 1], [nx, 'pop', 0.9]]);
    return (t) => { atmosphere(t);
      const P = shot(t, 'crowd', { box: [40, 690, 1000, 760], a: [0.5, 0.5, 1.0], b: [0.5, 0.45, 1.1], dur: 7 }); if (!P) noPhoto(t); tag(t, 3, N195);
      realBadge(t, 0.3, 'REAL PHOTO · CONCERT AUDIENCE');
      whyReason(t, 0.1, null, 'A LEFTOVER REFLEX.', { size: 100 });
      if (t > mu) chip('🎵 MUSIC', 300, 780, t, mu, { size: 40, bg: GOLD, fg: BG });
      if (t > ho) chip('🎬 HORROR MOVIES', 720, 780, t, ho, { size: 40, bg: TXT, fg: BG });
      whyNext(t, nx, undefined, 1340); }; }; });
