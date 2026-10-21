// Wiki Roulette #184 — HOW IT WORKS #13: why airplane windows are round (the Comet "square window" myth).
// Retention: frame-1 myth claim over a real 1952 Comet photo → 1954, 56 lives, real G-ALYP wreckage →
// twist: the windows already had rounded corners; the crack started at a rivet hole by the roof ADF cut-out (1955 report photo) →
// every flight inflates the cabin: pressure-cycle counter to 3,057 → burst (real tank-test photo) →
// sharp vs round corner stress glow → today's round window → binary question.
const N184 = 4, C184R = '#FF3B30', C184OK = '#7FE3A0', C184B = '#8FD8FF';
const gfx184 = (y = 1345) => text('GRAPHIC', 1000, y, 'mono', 22, 'rgba(255,255,255,0.55)', { ls: 3, align: 'right' });
const bg184 = (t) => techBg(t, '#06101C', '#10263C');
// window outline with corner radius r (0 = sharp), centred at (x,y)
function win184(x, y, w, h, r, col, lw = 10) { g.save(); g.strokeStyle = col; g.lineWidth = lw; g.fillStyle = 'rgba(143,216,255,0.10)';
  rrect(x - w / 2, y - h / 2, w, h, r); g.fill(); g.stroke(); g.restore(); }
// stress glow at a point (heat 0..1: green → gold → red)
function heat184(x, y, r, k, t) { const col = k > 0.66 ? '255,59,48' : k > 0.33 ? '255,200,60' : '127,227,160', p = 0.85 + 0.15 * Math.sin(t * 9);
  const gr = g.createRadialGradient(x, y, 0, x, y, r * p); gr.addColorStop(0, `rgba(${col},${0.9 * clamp(k + 0.2)})`); gr.addColorStop(1, `rgba(${col},0)`);
  g.save(); g.globalCompositeOperation = 'lighter'; g.fillStyle = gr; g.beginPath(); g.arc(x, y, r * p, 0, 6.283); g.fill(); g.restore(); }

// ---------- scenes ----------
VIS.open = (K) => { const my = sw('myth', 2.2); K(0.15, 'hit', 1.3); K(my, 'crack', 1.0); K(my + 0.02, 'boom', 0.9);
  return (t) => { atmosphere(t); const P = shot(t, 'comet', { a: [0.62, 0.5, 1.0], b: [0.66, 0.5, 1.12], dur: 3, anchor: [540, 1050] }); if (!P) noPhoto(t);
    tag(t); hook(t, EP.hook.slice(0, 2), 470);
    if (t > my) stampText('A MYTH.', 540, 1230, t, my, { size: 150, rot: -0.07, color: GOLD });
    flash(t, my, 0.3, 0.12); realBadge(t, 0.3, 'REAL PHOTO · COMET 1, 1952', 1500); }; };

VIS[0] = S(() => { const yr = sw('nineteen', 0.4), br = sw('broke', 1.6), sx = sw('people', 3.6) - 0.35;
  return (K) => { ks(K, [[0.1, 'whoosh', 0.8], [br, 'hit', 0.9], [sx, 'boom', 0.7]]);
    return (t) => { atmosphere(t); const P = shot(t, 'wreck', { a: [0.42, 0.45, 1.0], b: [0.38, 0.45, 1.15], dur: 5, anchor: [540, 1000] }); if (!P) noPhoto(t);
      tag(t, 0, N184); fact2(t, yr, '1954.', 'TWO JETS LOST.', null, { y: 470, c2: TXT });
      if (t > sx - 0.1) chip('56 LIVES', 540, 1300, t, sx - 0.1, { size: 46, bg: 'rgba(255,255,255,0.92)', fg: BG });
      realBadge(t, 0.3, 'REAL PHOTO · RECOVERED WRECKAGE, G-ALYP', 1430); }; }; });

VIS[1] = S(() => { const rc = sw('rounded', 0.5), ck = sw('crack', 1.6), rv = sw('rivet', 2.4), rf = sw('roof', 3.6);
  return (K) => { ks(K, [[0.1, 'whoosh', 0.8], [rc + 0.2, 'ding', 0.9], [ck, 'swish', 0.9], [rv, 'hit', 1.1], [rf, 'pop', 0.8]]);
    return (t) => { atmosphere(t); tag(t, 1, N184);
      if (t < ck) { // the real Comet 1 passenger windows (museum airframe): rounded corners
        const P = shot(t, 'win', { a: [0.475, 0.42, 1.0], b: [0.475, 0.42, 1.12], dur: 2.5, anchor: [540, 1000] }); if (!P) noPhoto(t);
        fact2(t, 0.2, 'NOT EVEN', 'SQUARE.', null, { y: 470 });
        if (P) { const [x, y] = P(0.505, 0.375); ring(t, rc + 0.1, x, y, 50, { spot: false }); callout(t, rc + 0.3, [x, y], 540, 1320, 'ROUNDED CORNERS'); }
        realBadge(t, 0.3, 'REAL PHOTO · COMET 1 WINDOWS', 1430);
      } else {      // 1955 accident report: the ADF cut-outs in the roof
        const P = shot(t, 'adf', { a: [0.42, 0.42, 1.25], b: [0.42, 0.42, 1.45], dur: 3, t0: ck, anchor: [540, 1000] }); if (!P) noPhoto(t);
        fact2(t, ck, 'A TINY', 'RIVET HOLE.', null, { y: 470, c2: C184R });
        if (P) { const [x, y] = P(0.44, 0.395); ring(t, rv, x, y, 60, { color: C184R }); if (t > rf) callout(t, rf, [x, y], 540, 1320, 'ROOF CUT-OUT', { bg: C184R, fg: '#FFF', color: C184R }); }
        realBadge(t, ck + 0.1, 'REAL PHOTO · 1955 ACCIDENT REPORT', 1430);
      } }; }; });

VIS[2] = S(() => { const pm = sw('pumps', 0.8), wt = sw('water', 2.6), bu = sw('burst', 4.0), th = sw('after', 4.3);
  return (K) => { ks(K, [[0.1, 'whoosh', 0.8], [pm, 'riser', 0.5], [wt, 'swish', 0.8], [bu, 'crack', 1.1], [bu + 0.02, 'boom', 1]]);
    return (t) => { tag(t, 2, N184);
      if (t < bu) { bg184(t); fact2(t, 0.2, 'EVERY FLIGHT:', 'PUMPED UP.', null, { y: 470, c2: C184B });
        // fuselage cross-section breathing with each pressure cycle
        const cyc = clamp((t - pm) / 0.6), s = 1 + 0.06 * Math.max(0, Math.sin(t * 7)) * cyc, cx = 540, cy = 1060, r = 250 * s;
        g.save(); g.strokeStyle = '#D8E2EE'; g.lineWidth = 16; g.shadowColor = C184B; g.shadowBlur = 20 * s; g.beginPath(); g.arc(cx, cy, r, 0, 6.283); g.stroke(); g.restore();
        g.fillStyle = `rgba(143,216,255,${0.10 + 0.12 * (s - 1) / 0.06})`; g.beginPath(); g.arc(cx, cy, r - 8, 0, 6.283); g.fill();
        if (cyc > 0) for (let k = 0; k < 8; k++) { const a = k * Math.PI / 4, d = r - 60 + 30 * (s - 1) / 0.06;
          glowLine([[cx + Math.cos(a) * (d - 50), cy + Math.sin(a) * (d - 50)], [cx + Math.cos(a) * d, cy + Math.sin(a) * d]], C184B, 6, cyc); }
        text('CABIN PRESSURE', cx, cy - 290, 'mono', 30, TXT, { ls: 3, align: 'center' });
        if (t > wt) { const n = Math.round(3057 * Math.pow(clamp((t - wt) / Math.max(0.4, th - wt + 0.6)), 1.6));
          panel(290, 1360, 500, 120, 0.82); text(n.toLocaleString('en-US'), 540, 1440, 'disp', 80, GOLD, { align: 'center' });
          text('PRESSURE CYCLES', 540, 1352, 'mono', 22, TXT, { ls: 3, align: 'center' }); }
        gfx184(1300);
      } else {        // the real test fuselage G-ALYU after it burst in the water tank
        atmosphere(t); const P = framed(t, 'hatch', 140, 690, 800, { t0: bu }); if (!P) noPhoto(t);
        fact2(t, bu, '3,057 CYCLES.', 'BURST.', null, { y: 470, c2: C184R });
        realBadge(t, bu + 0.1, 'REAL PHOTO · TANK TEST, G-ALYU', 1430); flash(t, bu, 0.35, 0.12);
      } }; }; });

VIS[3] = S(() => { const sp = sw('sharpest', 1.4), td = sw('today', 2.6), rd = sw('round', 3.4);
  return (K) => { ks(K, [[0.1, 'whoosh', 0.8], [sp, 'hit', 1.1], [td, 'swish', 0.8], [rd, 'ding', 1]]);
    return (t) => { tag(t, 3, N184);
      if (t < td) { bg184(t); fact2(t, 0.2, 'SHARP CORNER', '= STRESS.', null, { y: 470, c2: C184R, size: 130 });
        const hk = ease(clamp((t - sp + 0.3) / 0.6));
        // left: sharp corners (stress piles up), right: round corners (stress spreads out)
        win184(300, 1040, 300, 400, 0, '#D8E2EE'); win184(780, 1040, 300, 400, 120, '#D8E2EE');
        for (const [dx, dy] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) { heat184(300 + dx * 150, 1040 + dy * 200, 90, 0.3 + 0.7 * hk, t); heat184(780 + dx * 110, 1040 + dy * 160, 110, 0.15, t); }
        chip('SHARP', 300, 1330, t, 0.4, { size: 32, bg: C184R, fg: '#FFF' }); chip('ROUND', 780, 1330, t, 0.6, { size: 32, bg: C184OK, fg: BG });
        if (t > sp) stampText('STRESS!', 300, 760, t, sp, { size: 70, rot: -0.08, color: C184R });
        gfx184(1420);
      } else { atmosphere(t); const P = framed(t, 'modern2', 60, 660, 960, { t0: td }); if (!P) noPhoto(t);
        fact2(t, td, 'TODAY:', 'ROUND CORNERS.', null, { y: 470, c2: C184OK });
        realBadge(t, td + 0.1, 'REAL PHOTO · CABIN WINDOW', 1430); } }; }; });
