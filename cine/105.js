// Wiki Roulette #105 — Champions League final 2012, Munich (Chelsea 2012 · Part 2 of 2). Real photos from the final + real footage.
// Retention plan: frame-1 paradox (corners 20–1) → stakes (Bayern at home, Chelsea without 4) → late twist (first corner = goal) →
// hero turns villain (Drogba's foul) → keeper saves → hero again (last kick) → peak end (trophy, world leaders) → binary comment question.
const N = 7, T = ['BAYERN', 'CHELSEA'], TC = { c1: '#FF4D5A', c2: '#5A8DFF' };
// shoot-out tracker: Lahm ✓, Mata ✗, Gómez ✓, Luiz ✓, Neuer ✓, Lampard ✓, Olić ✗, Cole ✓, Schweinsteiger ✗, Drogba ✓
const KICKS = [['B', 1], ['C', 0], ['B', 1], ['C', 1], ['B', 1], ['C', 1], ['B', 0], ['C', 1], ['B', 0], ['C', 1]];
function shootout(t, tIn, y, step) {
  const lt = t - tIn; if (lt < 0) return; const n = Math.min(KICKS.length, Math.floor(lt / step) + 1);
  g.save(); g.globalAlpha *= clamp(lt / 0.2); rrect(80, y, 920, 230, 26); g.fillStyle = 'rgba(14,15,18,0.92)'; g.fill();
  text('BAYERN', 120, y + 88, 'ui', 40, '#FF4D5A'); text('CHELSEA', 120, y + 190, 'ui', 40, '#5A8DFF');
  let bi = 0, ci = 0;
  KICKS.slice(0, n).forEach(([tm, ok], k) => { const col = tm === 'B' ? bi++ : ci++, x = 430 + col * 110, yy = tm === 'B' ? y + 72 : y + 174, a = clamp((lt - k * step) / 0.15);
    g.save(); g.globalAlpha *= a; g.beginPath(); g.arc(x, yy, 34, 0, 6.283); g.fillStyle = ok ? '#2EBD5F' : '#E3101E'; g.fill();
    text(ok ? '✓' : '✗', x, yy + 16, 'ui', 44, '#FFF', { align: 'center' }); g.restore(); });
  g.restore(); }

VIS.open = (K) => { K(0.05, 'hit', 1.3); K(0.3, 'wrong', 1); K(0.8, 'tick', 0.8); K(1.3, 'tick', 0.8);
  return (t) => { atmosphere(t); const P = shot(t, 'allianz1', { a: [0.45, 0.5, 1.2], b: [0.45, 0.5, 1.35], dur: 3 }); if (!P) noPhoto(t); dimAll(0.45); tag(t);
    hook(t, EP.hook, 400); if (EP.series) chip(EP.series, 80, 630, t, -0.3, { size: 26, align: 'left', bg: GOLD, fg: BG });
    board(t, -0.3, 790, 'CORNERS', T, '20–1', null, TC); lot(t, 0.4, 'think', 900, 1150, 170); }; };

VIS[0] = pscene(0, N, { dim: 0.15, k: [[1.4, 'hit', 1], [1.6, 'pop', 0.8, 800]],
  parts: [{ from: 0, clip: 'munich', a: [0.5, 0.5, 1.4], b: [0.5, 0.5, 1.5], badge: 'REAL FOOTAGE · MUNICH (TIMELAPSE)' },
          { from: 1.4, ph: 'arena', a: [0.5, 0.5, 1.15], b: [0.5, 0.5, 1.25], badge: 'REAL PHOTO · ALLIANZ ARENA, 2012 FINAL', flash: true }],
  x: (t) => { if (t > 1.6) chip('“FINALE DAHOAM” = FINAL AT HOME', 540, 600, t, 1.6, { size: 34, bg: '#FF4D5A', fg: '#FFF' }); } });

VIS[1] = pscene(1, N, { ph: 'stimmung', a: [0.5, 0.5, 1.1], b: [0.5, 0.5, 1.2], dim: 0.3, badge: 'REAL PHOTO · MUNICH ON FINAL DAY, 19 MAY 2012', k: [[0.7, 'stamp', 1], [1.0, 'stamp', 0.9], [1.3, 'stamp', 0.9], [1.6, 'stamp', 0.9]],
  x: (t) => { ['TERRY', 'IVANOVIĆ', 'MEIRELES', 'RAMIRES'].forEach((nm, k) => { if (t > 0.7 + k * 0.3) { redCard(t, 0.7 + k * 0.3, 190 + k * 233, 760, 0.55); chip(nm, 190 + k * 233, 900, t, 0.75 + k * 0.3, { size: 24, bg: 'rgba(12,11,10,0.85)', fg: '#FFF' }); } });
    fact(t, 0.3, '4 SUSPENDED', null, { y: 600, size: 110 }); } });

VIS[2] = pscene(2, N, { dim: 0.2, k: [[0.5, 'tick', 0.7], [0.8, 'tick', 0.7], [1.4, 'boom', 1], [1.42, 'hit', 1.2]],
  parts: [{ from: 0, ph: 'robbenfk', a: [0.6, 0.5, 1.2], b: [0.6, 0.5, 1.35], badge: 'REAL PHOTO · ROBBEN FREE KICK, 2012 FINAL' },
          { from: 1.4, ph: 'robben', a: [0.6, 0.4, 1.15], b: [0.62, 0.4, 1.3], badge: 'REAL PHOTO · ROBBEN, 2012 FINAL', flash: true }],
  x: (t) => { board(t, 0.1, 520, "83'", T, t > 1.4 ? '1–0' : '0–0', 1.4, Object.assign({ label: 'MÜLLER' }, TC)); chip(`CORNERS ${Math.min(20, 12 + Math.floor(t * 6))}–0`, 540, 820, t, 0.2, { size: 30, bg: 'rgba(12,11,10,0.85)', fg: '#FFF' }); } });

VIS[3] = pscene(3, N, { dim: 0.2, k: [[0.5, 'ding', 0.7], [1.0, 'mute', 1, 0.5], [1.5, 'boom', 1.2], [1.52, 'hit', 1.4]],
  parts: [{ from: 0, ph: 'lampard', a: [0.5, 0.5, 1.2], b: [0.5, 0.45, 1.35], badge: 'REAL PHOTO · CHELSEA ATTACK, 2012 FINAL' },
          { from: 1.5, ph: 'didi', a: [0.5, 0.3, 1.0], b: [0.5, 0.3, 1.12], badge: 'REAL PHOTO · DIDIER DROGBA, 2012 FINAL', flash: true }],
  x: (t) => { board(t, 0.1, 520, "88'", T, t > 1.5 ? '1–1' : '1–0', 1.5, Object.assign({ label: t > 1.5 ? 'DROGBA' : 'CHELSEA CORNER' }, TC));
    chip(t < 0.5 ? 'CORNERS 20–0' : 'CORNERS 20–1', 540, 820, t, 0.1, { size: 30, bg: t < 0.5 ? 'rgba(12,11,10,0.85)' : GOLD, fg: t < 0.5 ? '#FFF' : BG });
    if (t > 1.5) { g.save(); g.translate(shake(t, 1.5, 14), 0); stampText('HEADER!', 540, 1120, t, 1.5, { size: 110, rot: -0.08 }); g.restore(); lot(t, 1.6, 'mindblown', 900, 900, 150); } } });

VIS[4] = pscene(4, N, { ph: 'extra', a: [0.5, 0.5, 1.2], b: [0.47, 0.5, 1.35], dim: 0.25, badge: 'REAL PHOTO · EXTRA TIME, 2012 FINAL', k: [[0.6, 'beep', 1], [1.3, 'mute', 1, 0.4], [1.7, 'thump', 1.2], [1.72, 'hit', 1.2]],
  x: (t) => { board(t, 0.1, 520, 'EXTRA TIME', T, '1–1', null, Object.assign({ label: 'PENALTY: ROBBEN' }, TC));
    if (t > 0.6) chip('DROGBA FOULS RIBÉRY', 540, 820, t, 0.6, { size: 32, bg: '#E3101E', fg: '#FFF' });
    if (t > 1.7) { flash(t, 1.7, 0.4, 0.1); g.save(); g.translate(shake(t, 1.7, 14), 0); stampText('SAVED BY ČECH!', 540, 1120, t, 1.7, { size: 96, rot: -0.08 }); g.restore(); lot(t, 1.8, 'scream', 900, 960, 150); } } });

VIS[5] = pscene(5, N, { dim: 0.25, k: [...Array.from({ length: 10 }, (_, k) => [0.4 + k * 0.22, KICKS[k][1] ? 'pop' : 'wrong', 0.8, 700 + k * 40]), [2.6, 'boom', 1.2], [2.62, 'hit', 1.4]],
  parts: [{ from: 0, ph: 'mata', a: [0.5, 0.5, 1.3], b: [0.5, 0.5, 1.45], badge: 'REAL PHOTO · SHOOT-OUT, 2012 FINAL' },
          { from: 2.6, ph: 'lastpen', a: [0.5, 0.5, 1.3], b: [0.5, 0.5, 1.45], badge: "REAL PHOTO · DROGBA'S LAST PENALTY", flash: true }],
  x: (t) => { shootout(t, 0.4, 520, 0.22); if (t > 2.6) { g.save(); g.translate(shake(t, 2.6, 14), 0); stampText('DROGBA!', 540, 1080, t, 2.6, { size: 120, rot: -0.08 }); g.restore(); } } });

VIS[6] = pscene(6, N, { dim: 0.15, k: [[1.0, 'boom', 1], [1.02, 'hit', 1.2], [1.3, 'ding', 0.9], [2.4, 'pop', 0.8, 900]],
  parts: [{ from: 0, clip: 'cfans21', a: [0.5, 0.5, 1.15], b: [0.5, 0.5, 1.2], badge: 'REAL FOOTAGE · CHELSEA FANS (CL FINAL 2021)' },
          { from: 1.0, ph: 'cup', a: [0.5, 0.35, 1.0], b: [0.5, 0.35, 1.12], badge: 'REAL PHOTO · DROGBA WITH THE TROPHY, MUNICH 2012', flash: true },
          { from: 2.4, ph: 'g8', a: [0.45, 0.4, 1.0], b: [0.45, 0.4, 1.1], badge: 'REAL PHOTO · G8 LEADERS WATCH THE SHOOT-OUT, CAMP DAVID', flash: true }],
  x: (t) => { board(t, 0.1, 520, 'PENALTIES', T, '3–4', null, TC); if (t > 1.1 && t < 2.4) lot(t, 1.1, 'trophy', 880, 960, 160);
    if (t > 2.5) chip('OBAMA · MERKEL · CAMERON', 540, 820, t, 2.5, { size: 32, bg: GOLD, fg: BG }); } });
