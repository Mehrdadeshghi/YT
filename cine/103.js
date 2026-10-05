// Wiki Roulette #103 — 1974 World Cup final: 0–1 before Germany touched the ball (real photos + real crowd footage, Football's Craziest Moments #5)
// Hook technique: an "impossible" scoreline in frame 1 — 0–1 with a German ball-touch counter at 0.
const N = 5, GOLDC = '#F2C230';
const dim = (a) => { g.fillStyle = `rgba(8,8,10,${a})`; g.fillRect(0, 0, W, H); };
function board(t, tIn, y, clock, score, hitAt) {
  const lt = t - tIn; if (lt < 0) return; const s = spring(lt, 260, 16), w = 900, h = 200;
  g.save(); g.translate(540, y + (1 - s) * -200); g.globalAlpha *= clamp(s * 1.5);
  g.shadowColor = 'rgba(0,0,0,0.6)'; g.shadowBlur = 30; rrect(-w / 2, 0, w, h, 26); g.fillStyle = 'rgba(14,15,18,0.92)'; g.fill(); g.shadowBlur = 0;
  const cw = clock.length > 4 ? 330 : 220; rrect(-cw / 2, -32, cw, 70, 18); g.fillStyle = '#FF3B30'; g.fill(); text(clock, 0, 18, 'mono', 48, '#FFFFFF', { align: 'center' });
  const fl = hitAt != null && t > hitAt && t < hitAt + 0.9 ? Math.floor((t - hitAt) * 8) % 2 : 0;
  text('GERMANY', -410, 134, 'ui', 38, '#E6E8EC'); text('NETHERLANDS', 410, 134, 'ui', 38, '#FF9A3C', { align: 'right' });
  text(score, 0, 152, 'disp', 84, fl ? GOLDC : '#FFFFFF', { align: 'center' }); g.restore(); }
function touches(t, tIn, y, n) { const lt = t - tIn; if (lt < 0) return; const blink = Math.sin(t * 9) > 0;
  chip(`GERMAN TOUCHES: ${n}`, 540, y, t, tIn, { size: 34, bg: blink ? '#E3101E' : '#8A0A12', fg: '#FFFFFF' }); }

VIS.open = (K) => { K(0.1, 'hit', 1.3); K(0.3, 'wrong', 1); K(0.9, 'tick', 0.8); K(1.4, 'tick', 0.8);
  return (t) => { atmosphere(t); const P = shot(t, 'a74', { a: [0.6, 0.5, 1.15], b: [0.6, 0.5, 1.3], dur: 3 }); if (!P) noPhoto(t); dim(0.4); tag(t);
    hook(t, EP.hook, 400); if (EP.series) chip(EP.series, 80, 630, t, -0.3, { size: 26, align: 'left', bg: GOLD, fg: BG });
    board(t, -0.3, 760, "1'", '0–1'); touches(t, -0.3, 1060, 0); lot(t, 0.4, 'mindblown', 930, 1180, 150); }; };

VIS[0] = vscene(0, N, { ph: 'cruyffoff', a: [0.5, 0.3, 1.0], b: [0.5, 0.3, 1.1], badge: 'REAL PHOTO · JOHAN CRUYFF, MUNICH, 7 JULY 1974', k: [[0.8, 'hit', 1], [1.3, 'pop', 0.8, 800]],
  f: ['TOTAL FOOTBALL', 'THE NETHERLANDS OF 1974'], x: (t) => lot(t, 1.3, 'fire', 920, 1000, 150) });

VIS[1] = (K) => { K(0.5, 'whoosh', 0.5); [0.7, 0.95, 1.2, 1.45].forEach((x) => K(x, 'tick', 0.7)); K(1.8, 'beep', 1); K(2.0, 'hit', 1.1);
  return (t) => { atmosphere(t); const P = shot(t, 'ba14', { a: [0.5, 0.5, 1.1], b: [0.47, 0.5, 1.3], dur: 4 }); if (!P) noPhoto(t); dim(0.2);
    tag(t, 1, N); realBadge(t, 0.3, 'REAL PHOTO · THE 1974 FINAL, MUNICH'); board(t, 0.2, 520, "1'", '0–0'); touches(t, 0.4, 820, 0);
    if (t > 2.0) { flash(t, 2.0, 0.4, 0.1); g.save(); g.translate(shake(t, 2.0, 14), 0); stampText('PENALTY!', 540, 1100, t, 2.0, { size: 110, rot: -0.1 }); g.restore(); } }; };

VIS[2] = (K) => { K(0.5, 'whoosh', 0.5); K(0.9, 'mute', 1, 0.4); K(1.3, 'boom', 1.1); K(1.32, 'hit', 1.3);
  return (t) => { atmosphere(t); const P = shot(t, 'a74', { a: [0.55, 0.5, 1.0], b: [0.6, 0.5, 1.15], dur: 3 }); if (!P) noPhoto(t); dim(0.2);
    tag(t, 2, N); realBadge(t, 0.3, 'REAL PHOTO · A PENALTY IN THE 1974 FINAL'); board(t, 0.2, 520, "2'", t > 1.3 ? '0–1' : '0–0', 1.3); touches(t, 0.4, 820, 0);
    if (t > 1.3) { flash(t, 1.3, 0.5, 0.12); lot(t, 1.4, 'scream', 900, 1060, 160); } }; };

VIS[3] = (K) => { K(0.5, 'whoosh', 0.5); K(1.1, 'boom', 1); K(1.12, 'hit', 1.2);
  return (t) => { atmosphere(t); const P = shot(t, 'breitner', { a: [0.4, 0.55, 1.0], b: [0.35, 0.6, 1.15], dur: 3 }); if (!P) noPhoto(t); dim(0.2);
    tag(t, 3, N); realBadge(t, 0.3, "REAL PHOTO · BREITNER'S PENALTY, 25'"); board(t, 0.2, 520, "25'", t > 1.1 ? '1–1' : '0–1', 1.1);
    if (t > 1.1) { flash(t, 1.1, 0.4, 0.1); lot(t, 1.2, 'fire', 900, 1060, 150); } }; };

VIS[4] = (K) => { K(0.5, 'whoosh', 0.5); K(1.4, 'boom', 1.2); K(1.42, 'hit', 1.4); K(2.0, 'ding', 0.9);
  return (t) => { atmosphere(t);
    if (t < 1.4) { const P = clip(t, 'goal', { a: [0.5, 0.5, 1.15], b: [0.5, 0.5, 1.2] }); if (!P) noPhoto(t); tag(t, 4, N); footBadge(t, 0.3, 'REAL FOOTAGE · FANS, BUDAPEST 2019'); board(t, 0.2, 520, "43'", '1–1'); }
    else { const P = shot(t, 'mullercup', { a: [0.5, 0.3, 1.0], b: [0.5, 0.3, 1.1], dur: 4 }); if (!P) noPhoto(t); flash(t, 1.4, 0.5, 0.12); dim(0.15);
      tag(t, 4, N); realBadge(t, 1.4, 'REAL PHOTO · GERD MÜLLER WITH THE WORLD CUP, 1974'); board(t, 1.4, 520, 'FULL TIME', '2–1', 1.4); lot(t, 2.0, 'trophy', 900, 1000, 160); } }; };
