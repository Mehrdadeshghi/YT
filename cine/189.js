// Wiki Roulette #189 — WHY? why do onions make you cry? (series kit: cine/why.js)
// Frame 1 = WHY? badge + question over two real photos side by side: whole red onions (HARMLESS) vs a chopped red onion (TEARS) →
// REASON 1 a trap (real photo: onion cells under a microscope; a knife slash, ENZYMES burst out, DEFENSE vs hungry animals) →
// REASON 2 tear gas (real photo: chopped onion and knife; GRAPHIC chain cell → enzyme 1 → enzyme 2 → gas, wisps drift up into an eye) →
// REASON 3 your eyes fight back (real photo: tears; up to 100× more tears) → the fix (running water, keep the root) + comment card
// + "your next why".
const N189 = 4;
const gfx189 = (str = 'GRAPHIC', x = 1000, y = 1430) => text(str, x, y, 'mono', 22, 'rgba(255,255,255,0.55)', { ls: 3, align: 'right' });

// rising gas wisps inside a box (x, y, w, h) from tIn, drifting up and to the right
function gas189(t, tIn, x, y, w, h, n = 22) { if (t < tIn) return; const lt = t - tIn;
  g.save(); rrect(x, y, w, h, 30); g.clip();
  for (let i = 0; i < n; i++) { const ph = (i * 0.618) % 1, sp = 0.35 + 0.25 * ((i * 0.37) % 1), life = ((lt * sp + ph) % 1);
    const px = x + w * (0.12 + 0.76 * ((i * 0.41) % 1)) + Math.sin(lt * 1.7 + i) * 26 + life * 60, py = y + h - life * h * 1.05, r = 14 + 36 * life;
    const a = clamp(lt / 0.5) * (1 - life) * 0.55; const gr = g.createRadialGradient(px, py, 0, px, py, r);
    gr.addColorStop(0, `rgba(214,236,160,${a})`); gr.addColorStop(1, 'rgba(214,236,160,0)'); g.fillStyle = gr; g.beginPath(); g.arc(px, py, r, 0, 6.283); g.fill(); }
  g.restore(); }

// the chemical chain as 4 pills in a row, each popping in at its time; arrows between
function chain189(t, ts, y = 1250) { const L = ['CELL BREAKS', 'ENZYME 1', 'ENZYME 2', 'TEAR GAS'], xs = [175, 405, 650, 890];
  L.forEach((s, i) => { if (t < ts[i]) return; chip(s, xs[i], y, t, ts[i], { size: 26, bg: i === 3 ? RED : i ? GOLD : TXT, fg: i === 3 ? '#FFF' : BG });
    if (i) { const a = clamp((t - ts[i]) / 0.25); text('→', (xs[i - 1] + xs[i]) / 2 + 8, y + 12, 'disp', 34, `rgba(255,255,255,${0.8 * a})`, { align: 'center' }); } }); }

// a knife slash across a box at tIn (white streak that fades)
function slash189(t, tIn, x, y, w, h) { const lt = t - tIn; if (lt < 0 || lt > 0.9) return; const p = clamp(lt / 0.18), a = 1 - clamp((lt - 0.3) / 0.6);
  g.save(); g.globalAlpha = a; g.strokeStyle = '#FFFFFF'; g.lineWidth = 10; g.shadowColor = '#FFF'; g.shadowBlur = 30; g.lineCap = 'round';
  g.beginPath(); g.moveTo(x + w * 0.1, y + h * 0.8); g.lineTo(x + w * (0.1 + 0.8 * p), y + h * (0.8 - 0.6 * p)); g.stroke(); g.restore(); }

// ---------- scenes ----------
VIS.open = (K) => { K(0.15, 'hit', 1.3); K(0.2, 'mute', 1, 0.4); const wh0 = sw('whole', 0.3), cu = sw('cut', 1.4), cr = sw('cry', 1.9), wh = sw('why', 2.4);
  K(cu, 'whoosh', 0.9); K(cr, 'pop', 1); K(wh, 'thump', 1);
  return (t) => { atmosphere(t);
    whyPair(t, { id: 'whole', label: 'WHOLE: HARMLESS', at: wh0, a: [0.5, 0.5, 1.0], b: [0.5, 0.5, 1.06] },
               { id: 'chopped', label: 'CUT: TEARS', at: cr, bg: RED, fg: '#FFF', a: [0.5, 0.5, 1.0], b: [0.5, 0.5, 1.12] }, 790, 1570, { cols: true }); tag(t);
    whyBadge(t, -0.4, 80, 345); whyQ(t, -0.5, EP_RAW.why.q, 625, { size: 112 }); }; };   // badge + question fully drawn on frame 1

VIS[0] = S(() => { const ce = sw('cells', 1.2), en = sw('enzymes', 1.8), cu = sw('cut', 2.6), bu = sw('burst', 3.2), an = sw('animals', 4.4);
  return (K) => { ks(K, [[0.1, 'whoosh', 0.8], [en, 'tick', 1], [cu, 'whoosh', 1], [bu, 'hit', 1.1], [an, 'thump', 1]]);
    return (t) => { atmosphere(t);
      const P = shot(t, 'cells2', { box: [40, 690, 1000, 760], a: [0.5, 0.5, 1.0], b: [0.52, 0.5, 1.12], dur: 6 }); if (!P) noPhoto(t); tag(t, 0, N189);
      realBadge(t, 0.3, 'REAL PHOTO · ONION CELLS, MICROSCOPE');
      whyReason(t, 0.1, 1, "IT'S A TRAP.");
      if (t > en && t < cu) chip('ENZYMES LOCKED INSIDE', 540, 1060, t, en, { size: 40, bg: GOLD, fg: BG });
      slash189(t, cu, 40, 690, 1000, 760);
      if (t > bu) { gas189(t, bu, 40, 690, 1000, 760, 14); chip('💥 THEY BURST OUT', 540, 1060, t, bu, { size: 44, bg: RED, fg: '#FFF' }); }
      if (t > an) chip('DEFENSE vs HUNGRY ANIMALS', 540, 1360, t, an, { size: 36, bg: TXT, fg: BG }); }; }; });

VIS[1] = S(() => { const tg = sw('gas', 0.9), se = sw('second', 1.6), gs = sw('gas', 2.6, 1), ey = sw('eyes', 3.6);
  return (K) => { ks(K, [[0.1, 'whoosh', 0.8], [tg, 'hit', 1.1], [se, 'tick', 1], [gs, 'pop', 1], [ey, 'thump', 1]]);
    return (t) => { atmosphere(t);
      const P = shot(t, 'chopped2', { box: [40, 690, 1000, 470], a: [0.5, 0.35, 1.0], b: [0.5, 0.4, 1.12], dur: 6 }); if (!P) noPhoto(t); tag(t, 1, N189);
      realBadge(t, 0.3, 'REAL PHOTO · CHOPPED ONION');
      whyReason(t, 0.1, 2, 'TEAR GAS.');
      gas189(t, gs, 40, 690, 1000, 470);
      panel(40, 1180, 1000, 270, 0.8 * clamp((t - 0.3) / 0.3));
      chain189(t, [0.4, Math.max(0.6, se - 0.6), se, gs], 1250);
      if (t > gs) text('syn-propanethial-S-oxide', 540, 1345, 'mono', 26, 'rgba(255,255,255,0.75)', { ls: 2, align: 'center' });
      if (t > ey) chip('👁 → STRAIGHT INTO YOUR EYES', 540, 1400, t, ey, { size: 32, bg: GOLD, fg: BG });
      gfx189('GRAPHIC', 1010, 1215); }; }; });

VIS[2] = S(() => { const ne = sw('nerves', 1.2), fl = sw('flood', 2.0), hu = sw('hundred', 2.8);
  return (K) => { ks(K, [[0.1, 'whoosh', 0.8], [ne, 'tick', 1], [fl, 'hit', 1], [hu, 'boom', 1]]);
    return (t) => { atmosphere(t);
      const P = shot(t, 'eye2', { box: [40, 690, 1000, 760], a: [0.5, 0.55, 1.0], b: [0.45, 0.55, 1.15], dur: 6 }); if (!P) noPhoto(t); tag(t, 2, N189);
      realBadge(t, 0.3, 'REAL PHOTO · TEARS');
      whyReason(t, 0.1, 3, 'YOUR EYES FIGHT BACK.', { size: 96 });
      if (t > ne && t < hu - 0.2) chip('⚡ NERVES FIRE', 540, 780, t, ne, { size: 40, bg: TXT, fg: BG });
      if (t > fl && t < hu - 0.2) chip('💧 TEARS FLUSH IT OUT', 540, 1360, t, fl, { size: 40, bg: GOLD, fg: BG });
      if (t > hu - 0.2) { g.save(); g.globalAlpha = clamp((t - hu + 0.2) / 0.3); g.fillStyle = 'rgba(6,10,14,0.72)'; rrect(40, 690, 1000, 760, 30); g.fill(); g.restore();
        const n = Math.round(100 * easeOut(clamp((t - hu) / 1.0)));
        text('UP TO', 540, 880, 'mono', 44, TXT, { ls: 8, align: 'center' }); text(`${n}×`, 540, 1120, 'disp', 240, GOLD, { align: 'center' });
        chip('MORE TEARS', 540, 1290, t, hu + 0.3, { size: 46, bg: RED, fg: '#FFF' }); } }; }; });

VIS[3] = S(() => { const ru = sw('running', 1.0), ro = sw('root', 2.4), cr = sw('cry', 3.6), nx = sw('next', 5.4);
  return (K) => { ks(K, [[0.1, 'whoosh', 0.8], [ru, 'ding', 1], [ro, 'ding', 1], [nx, 'pop', 0.9]]);
    return (t) => { atmosphere(t);
      const P = shot(t, 'cross', { box: [40, 690, 1000, 760], a: [0.5, 0.62, 1.0], b: [0.5, 0.7, 1.1], dur: 6 }); if (!P) noPhoto(t); tag(t, 3, N189);
      realBadge(t, 0.3, 'REAL PHOTO · ONION, CROSS SECTION');
      whyReason(t, 0.1, null, 'QUICK FIX.');
      if (t > ru && t < cr) chip('💧 CUT UNDER RUNNING WATER', 540, 790, t, ru, { size: 38, bg: GOLD, fg: BG });
      if (t > ro && t < cr) chip('KEEP THE ROOT ON ✓', 540, 1380, t, ro, { size: 38, bg: TXT, fg: BG });
      whyNext(t, nx, undefined, 1340); }; }; });
