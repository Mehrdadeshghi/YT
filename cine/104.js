// Wiki Roulette #104 — Chelsea at Camp Nou, 2012 semi-final (Chelsea 2012 · Part 1 of 2). Real photos + real stadium footage.
// Retention plan: frame-1 contradiction (10 men, 0–2, Messi) → escalating stakes → two reversals (away goal, Messi misses) → payoff → open loop to Part 2.
const N = 5, T = ['BARÇA', 'CHELSEA'], TC = { c1: '#E9B44C', c2: '#5A8DFF' };

VIS.open = (K) => { K(0.05, 'hit', 1.3); K(0.3, 'stamp', 1); K(1.2, 'tick', 0.8); K(1.6, 'tick', 0.8);
  return (t) => { atmosphere(t); const P = shot(t, 'nou12', { a: [0.55, 0.5, 1.15], b: [0.58, 0.5, 1.3], dur: 3 }); if (!P) noPhoto(t); dimAll(0.45); tag(t);
    hook(t, EP.hook, 400); if (EP.series) chip(EP.series, 80, 630, t, -0.3, { size: 26, align: 'left', bg: GOLD, fg: BG });
    board(t, -0.3, 780, "38'", T, '2–0', null, TC); redCard(t, -0.3, 900, 1130, 0.8); chip('10 MEN', 900, 1270, t, -0.3, { size: 34, bg: '#E3101E', fg: '#FFF' });
    lot(t, 0.3, 'scream', 230, 1150, 170); }; };

VIS[0] = pscene(0, N, { dim: 0.25, k: [[1.2, 'hit', 1.1], [1.25, 'boom', 0.8]],
  parts: [{ from: 0, ph: 'bridge', a: [0.5, 0.5, 1.05], b: [0.5, 0.5, 1.15], badge: 'REAL PHOTO · STAMFORD BRIDGE, LONDON' },
          { from: 1.2, ph: 'drogba08', a: [0.5, 0.3, 1.0], b: [0.5, 0.3, 1.1], badge: 'REAL PHOTO · DIDIER DROGBA', flash: true }],
  x: (t) => { board(t, 0.2, 520, "45+2'", ['CHELSEA', 'BARÇA'], t > 1.2 ? '1–0' : '0–0', 1.2, { c1: '#5A8DFF', c2: '#E9B44C', label: 'FIRST LEG' }); if (t > 1.3) lot(t, 1.3, 'fire', 900, 1000, 150); } });

VIS[1] = pscene(1, N, { dim: 0.2, k: [[0.6, 'crack', 0.9], [1.6, 'stamp', 1.2], [1.62, 'hit', 1.2], [2.3, 'crack', 1]],
  parts: [{ from: 0, clip: 'barcagoal', a: [0.5, 0.5, 1.2], b: [0.5, 0.5, 1.3], badge: 'REAL FOOTAGE · CAMP NOU AT NIGHT' },
          { from: 1.6, ph: 'terry', a: [0.4, 0.45, 1.25], b: [0.4, 0.45, 1.4], badge: 'REAL PHOTO · JOHN TERRY (CHELSEA CAPTAIN), 2012', flash: true }],
  x: (t) => { board(t, 0.2, 520, t < 1.6 ? "35'" : t < 2.3 ? "36'" : "38'", T, t < 0.6 ? '0–0' : t < 2.3 ? '1–0' : '2–0', t < 2.3 ? 0.6 : 2.3, Object.assign({ label: 'SECOND LEG' }, TC));
    if (t > 1.6) { redCard(t, 1.6, 860, 1000); g.save(); g.translate(shake(t, 1.6, 12), 0); stampText('SENT OFF', 420, 1080, t, 1.65, { size: 92, rot: -0.1 }); g.restore(); } } });

VIS[2] = pscene(2, N, { ph: 'trio', a: [0.5, 0.45, 1.25], b: [0.48, 0.45, 1.4], dim: 0.25, badge: 'REAL PHOTO · CHELSEA, MAY 2012', k: [[0.9, 'boom', 1], [0.92, 'hit', 1.2], [1.5, 'ding', 0.8]],
  x: (t) => { board(t, 0.1, 520, "45'", T, t > 0.9 ? '2–1' : '2–0', 0.9, Object.assign({ label: 'RAMIRES' }, TC)); if (t > 0.9) flash(t, 0.9, 0.4, 0.1);
    if (t > 1.4) chip('AWAY GOAL → CHELSEA GO THROUGH', 540, 820, t, 1.4, { size: 34, bg: '#2E7D32', fg: '#FFF' }); } });

VIS[3] = pscene(3, N, { ph: 'messi', a: [0.5, 0.3, 1.0], b: [0.5, 0.28, 1.15], dim: 0.25, badge: 'REAL PHOTO · LIONEL MESSI, 2012', k: [[0.5, 'beep', 1], [0.9, 'mute', 1, 0.5], [1.4, 'land', 1.2], [1.42, 'hit', 1]],
  x: (t) => { board(t, 0.1, 520, 'PENALTY', T, '2–1', null, TC);
    if (t > 1.4) { flash(t, 1.4, 0.4, 0.1); g.save(); g.translate(shake(t, 1.4, 14), 0); stampText('CROSSBAR!', 540, 1100, t, 1.4, { size: 110, rot: -0.08 }); g.restore(); lot(t, 1.5, 'flushed', 880, 860, 150); } } });

VIS[4] = pscene(4, N, { dim: 0.2, k: [[0.9, 'mute', 1, 0.3], [1.2, 'boom', 1.2], [1.22, 'hit', 1.4], [1.8, 'ding', 0.9]],
  parts: [{ from: 0, ph: 'torres', a: [0.55, 0.5, 1.2], b: [0.6, 0.5, 1.4], badge: 'REAL PHOTO · FERNANDO TORRES, APRIL 2012' },
          { from: 1.2, clip: 'cfans', a: [0.5, 0.5, 1.15], b: [0.5, 0.5, 1.2], badge: 'REAL FOOTAGE · CHELSEA FANS (2019)', flash: true }],
  x: (t) => { board(t, 0.1, 520, "90+'", T, t > 1.2 ? '2–2' : '2–1', 1.2, Object.assign({ label: 'AGGREGATE 2–3 · TORRES' }, TC));
    if (t > 1.3) { lot(t, 1.3, 'party', 880, 900, 150); g.save(); g.translate(shake(t, 1.25, 10), 0); stampText('FINAL!', 380, 940, t, 1.25, { size: 120, rot: -0.1 }); g.restore(); }
    if (t > 2.6) { const P2 = framed(t, 'arena', 580, 1030, 420, { b: [0.5, 0.5, 1.08], backdrop: false }); chip('PART 2 → THE FINAL IN MUNICH', 790, 1010, t, 2.7, { size: 24, bg: GOLD, fg: BG }); } } });
