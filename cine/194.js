// Wiki Roulette #194 — WHY? why do knuckles crack? (series kit: cine/why.js)
// Frame 1 = WHY? badge + question over two real photos side by side: 1st pull CRACK! vs 2nd pull NOTHING →
// REASON 1 a gas bubble (GRAPHIC: a joint opens, pressure drops, a gas bubble appears in the joint fluid) →
// the debate (real scan from the 2015 study: bubble still there after the crack; FORMS? vs BURSTS? → STILL DEBATED) →
// REASON 2 the reload (≈20 MIN timer ring, NO CRACK until it is full) → arthritis myth: the doctor who cracked only his left hand
// for 50+ years (real X-ray of a normal hand, LEFT/RIGHT chips, NO ARTHRITIS ✓✓, Ig Nobel ceremony photo) + comment card + next why.
const N194 = 4;
const gfx194 = (str = 'GRAPHIC', x = 1000, y = 1430) => text(str, x, y, 'mono', 22, 'rgba(255,255,255,0.55)', { ls: 3, align: 'right' });

// a finger joint as a graphic inside box (x, y, w, h): two bone ends, a capsule of joint fluid; the gap opens at tPull,
// a gas bubble pops into the gap at tBub (ring flash)
function joint194(t, tPull, tBub, x, y, w, h) {
  const cx = x + w / 2, cy = y + h / 2, op = 46 * easeOut(clamp((t - tPull) / 0.5)), bw = 300, bh = h * 0.36;
  g.save(); rrect(x, y, w, h, 30); g.fillStyle = 'rgba(14,20,28,0.92)'; g.fill(); g.clip();
  // capsule + fluid
  g.beginPath(); g.ellipse(cx, cy, 270, 150 + op * 0.6, 0, 0, 6.283); g.fillStyle = 'rgba(90,170,230,0.20)'; g.fill();
  g.lineWidth = 6; g.strokeStyle = 'rgba(120,190,240,0.75)'; g.stroke();
  // fluid sparkle = dissolved gas (tiny dots)
  for (let i = 0; i < 26; i++) { const a = (i * 2.399) % 6.283, r = 60 + ((i * 37) % 170), px = cx + Math.cos(a) * r, py = cy + Math.sin(a) * r * 0.45 + Math.sin(t * 2 + i) * 4;
    const fade = t > tBub ? 1 - clamp((t - tBub) / 0.4) : 1; g.fillStyle = `rgba(200,235,255,${0.55 * fade})`; g.beginPath(); g.arc(px, py, 4, 0, 6.283); g.fill(); }
  // bones (upper from the top, lower from the bottom), rounded heads
  const bone = (y0, y1, head, up) => { const gr = g.createLinearGradient(cx - bw / 2, 0, cx + bw / 2, 0); gr.addColorStop(0, '#CDBFA4'); gr.addColorStop(0.5, '#F4ECDC'); gr.addColorStop(1, '#BFB096'); g.fillStyle = gr;
    g.beginPath(); if (up) { g.moveTo(cx - bw / 2 + 30, y0); g.lineTo(cx - bw / 2, head - 40); g.quadraticCurveTo(cx, head + 40, cx + bw / 2, head - 40); g.lineTo(cx + bw / 2 - 30, y0); }
    else { g.moveTo(cx - bw / 2 + 30, y1); g.lineTo(cx - bw / 2, head + 40); g.quadraticCurveTo(cx, head - 40, cx + bw / 2, head + 40); g.lineTo(cx + bw / 2 - 30, y1); }
    g.closePath(); g.fill(); };
  bone(y - 10, 0, cy - 26 - op / 2, true); bone(0, y + h + 10, cy + 26 + op / 2, false);
  // the bubble
  if (t > tBub) { const lt = t - tBub, s = spring(lt, 300, 12), R = 44 * s;
    g.beginPath(); g.arc(cx, cy, Math.max(0, R), 0, 6.283); const bg = g.createRadialGradient(cx - R * 0.35, cy - R * 0.35, 2, cx, cy, Math.max(1, R));
    bg.addColorStop(0, 'rgba(255,255,255,0.95)'); bg.addColorStop(1, 'rgba(160,215,255,0.35)'); g.fillStyle = bg; g.fill();
    g.lineWidth = 3; g.strokeStyle = 'rgba(255,255,255,0.9)'; g.stroke();
    if (lt < 0.6) { g.lineWidth = 8 * (1 - lt / 0.6); g.strokeStyle = `rgba(255,215,90,${1 - lt / 0.6})`; g.beginPath(); g.arc(cx, cy, 50 + lt * 420, 0, 6.283); g.stroke(); } }
  // pull arrows
  if (t > tPull) { const a = clamp((t - tPull) / 0.3); g.globalAlpha = a; g.fillStyle = GOLD;
    [[cy - 250, -1], [cy + 250, 1]].forEach(([ay, d]) => { g.beginPath(); g.moveTo(cx + 230, ay + d * 40); g.lineTo(cx + 200, ay); g.lineTo(cx + 260, ay); g.closePath(); g.fill(); g.fillRect(cx + 222, ay - (d < 0 ? 0 : 60), 16, 60); });
    g.globalAlpha = 1; }
  g.restore(); g.lineWidth = 3; g.strokeStyle = 'rgba(255,255,255,0.16)'; rrect(x, y, w, h, 30); g.stroke();
}

// a timer ring (0..1 full) with a label in the middle
function timer194(t, tIn, x, y, R, p, big, small) { const a = clamp((t - tIn) / 0.3); if (a <= 0) return;
  g.save(); g.globalAlpha = a; g.lineWidth = 26; g.strokeStyle = 'rgba(255,255,255,0.14)'; g.beginPath(); g.arc(x, y, R, 0, 6.283); g.stroke();
  g.strokeStyle = GOLD; g.lineCap = 'round'; g.beginPath(); g.arc(x, y, R, -Math.PI / 2, -Math.PI / 2 + 6.283 * Math.max(0.001, p)); g.stroke(); g.restore();
  text(big, x, y + 40, 'disp', 130, TXT, { align: 'center', alpha: a }); text(small, x, y + 100, 'mono', 28, GOLD, { ls: 5, align: 'center', alpha: a }); }

// ---------- scenes ----------
VIS.open = (K) => { K(0.15, 'hit', 1.3); K(0.2, 'mute', 1, 0.4); const cr = sw('crack', 1.0), no = sw('nothing', 2.2), wh = sw('why', 2.6);
  K(cr, 'boom', 1); K(no, 'tick', 1); K(wh, 'thump', 1);
  return (t) => { atmosphere(t);
    whyPair(t, { id: 'crack', label: '1ST PULL: CRACK!', at: cr, a: [0.5, 0.5, 1.0], b: [0.5, 0.5, 1.08] },
               { id: 'bend', label: '2ND PULL: NOTHING', at: no, bg: RED, fg: '#FFF', a: [0.5, 0.5, 1.0], b: [0.5, 0.5, 1.06] }, 790, 1570, { cols: true }); tag(t);
    whyBadge(t, -0.4, 80, 345); whyQ(t, -0.5, EP_RAW.why.q, 625, { size: 112 }); }; };   // badge + question fully drawn on frame 1

VIS[0] = S(() => { const pu = sw('pull', 1.0), pr = sw('pressure', 1.6), fl = sw('fluid', 2.6), bu = sw('bubble', 3.2, 1);
  return (K) => { ks(K, [[0.1, 'whoosh', 0.8], [pu, 'whoosh', 1], [pr, 'tick', 1], [bu, 'pop', 1.2]]);
    return (t) => { atmosphere(t); tag(t, 0, N194);
      joint194(t, pu, bu, 40, 690, 1000, 760); gfx194('GRAPHIC', 1010, 1430);
      whyReason(t, 0.1, 1, 'A GAS BUBBLE.');
      if (t > pr) chip('PRESSURE DROPS ↓', 80, 760, t, pr, { size: 34, align: 'left', bg: TXT, fg: BG });
      if (t > fl && t < bu) chip('GAS DISSOLVED IN JOINT FLUID', 540, 1380, t, fl, { size: 30, bg: GOLD, fg: BG });
      if (t > bu) chip('→ A BUBBLE FORMS', 540, 1380, t, bu, { size: 38, bg: GOLD, fg: BG }); }; }; });

VIS[1] = S(() => { const fo = sw('forms', 0.6), bu = sw('bursts', 1.4), st = sw('study', 2.6), sl = sw('still', 3.4), de = sw('debated', 5.0);
  return (K) => { ks(K, [[0.1, 'whoosh', 0.8], [fo, 'tick', 1], [bu, 'tick', 1], [st, 'hit', 1], [de, 'thump', 1.1]]);
    return (t) => { atmosphere(t);
      const P = shot(t, 'scan', { box: [40, 690, 1000, 640], a: [0.5, 0.5, 1.0], b: [0.5, 0.5, 1.06], dur: 6 }); if (!P) noPhoto(t); tag(t, 1, N194);
      realBadge(t, 0.3, 'REAL SCAN · 2015 STUDY, A HAND JOINT');
      rgbPop('POP WHEN IT…', 80, 560, 96, TXT, t, 0.15);
      if (t > fo) chip('FORMS?', 300, 1400, t, fo, { size: 44, bg: GOLD, fg: BG });
      if (t > bu) chip('BURSTS?', 780, 1400, t, bu, { size: 44, bg: TXT, fg: BG });
      if (t > sl && t < de) chip('BUBBLE STILL THERE AFTER THE CRACK', 540, 780, t, sl, { size: 30, bg: RED, fg: '#FFF' });
      if (t > de) { g.save(); const s = spring(t - de, 300, 14); g.translate(540, 1010); g.rotate(-0.08); g.scale(s, s);
        chip('STILL DEBATED', 0, 0, t, de, { size: 70, bg: GOLD, fg: BG }); g.restore(); } }; }; });

VIS[2] = S(() => { const tw = sw('twenty', 1.6), di = sw('dissolve', 2.6), un = sw('until', 3.2), nc = sw('crack', 3.8);
  return (K) => { ks(K, [[0.1, 'whoosh', 0.8], [tw, 'hit', 1.1], [un, 'tick', 1], [nc, 'thump', 1]]);
    return (t) => { atmosphere(t);
      const P = shot(t, 'crack', { box: [40, 690, 1000, 760], a: [0.5, 0.5, 1.1], b: [0.5, 0.5, 1.2], dur: 6 }); if (!P) noPhoto(t); tag(t, 2, N194);
      g.save(); g.globalAlpha = 0.7 * clamp((t - tw + 0.3) / 0.4); g.fillStyle = 'rgba(6,10,14,1)'; rrect(40, 690, 1000, 760, 30); g.fill(); g.restore();
      realBadge(t, 0.3, 'REAL PHOTO · CRACKING KNUCKLES');
      whyReason(t, 0.1, 2, 'THE RELOAD.');
      const p = easeOut(clamp((t - tw) / 2.2));
      timer194(t, tw, 540, 1050, 210, p, `${Math.round(20 * p)}`, 'MINUTES');
      if (t > di && t < un) chip('GAS DISSOLVES BACK', 540, 1350, t, di, { size: 34, bg: TXT, fg: BG });
      if (t > un) chip('UNTIL THEN: NO CRACK ✕', 540, 1350, t, un, { size: 36, bg: RED, fg: '#FFF' }); }; }; });

VIS[3] = S(() => { const le = sw('left', 1.4), fi = sw('fifty', 2.4), ne = sw('neither', 3.2), ig = sw('ig', 4.6), nx = sw('next', 7.6);
  return (K) => { ks(K, [[0.1, 'whoosh', 0.8], [le, 'tick', 1], [fi, 'hit', 1], [ne, 'ding', 1.1], [ig, 'boom', 1], [nx, 'pop', 0.9]]);
    return (t) => { atmosphere(t);
      const P = t < ig - 0.15 ? shot(t, 'xray', { box: [40, 690, 1000, 760], a: [0.5, 0.45, 1.0], b: [0.5, 0.42, 1.1], dur: 6 })
                             : shot(t, 'ig4', { box: [40, 690, 1000, 760], a: [0.5, 0.5, 1.0], b: [0.5, 0.5, 1.08], dur: 6, t0: ig }); if (!P) noPhoto(t); tag(t, 3, N194);
      if (t < ig - 0.15) realBadge(t, 0.3, 'REAL X-RAY · A NORMAL HAND'); else realBadge(t, ig, 'REAL PHOTO · IG NOBEL CEREMONY, 2026');
      whyReason(t, 0.1, null, 'ARTHRITIS?');
      if (t > le && t < ig - 0.15) { chip('LEFT: CRACKED DAILY', 300, 760, t, le, { size: 30, bg: GOLD, fg: BG }); chip('RIGHT: NEVER', 790, 760, t, le + 0.2, { size: 30, bg: TXT, fg: BG }); }
      if (t > fi && t < ig - 0.15) chip('50+ YEARS', 540, 900, t, fi, { size: 52, bg: RED, fg: '#FFF' });
      if (t > ne && t < ig - 0.15) chip('NO ARTHRITIS IN EITHER HAND ✓', 540, 1380, t, ne, { size: 34, bg: GOLD, fg: BG });
      if (t > ig) { chip('🏆 IG NOBEL PRIZE · MEDICINE 2009', 540, 770, t, ig, { size: 34, bg: GOLD, fg: BG }); }
      whyNext(t, nx, undefined, 1340); }; }; });
