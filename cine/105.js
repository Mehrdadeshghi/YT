// Wiki Roulette #105 — Champions League final 2012, Munich (Chelsea 2012 · Part 2 of 2). Real photos from the final + real footage.
// v2 (Oct 2026): narrator voice + real music bed + WORD-SYNCED editing — every cut, card and hit lands on the spoken word
// (sw('drogba') = the moment that word is said, from Whisper word timestamps). A new picture roughly every second,
// the music drops out right before each big word (mute), then boom + flash + camera punch on the word itself.
// Retention plan: frame-1 paradox (corners 20–1) → stakes (Bayern at home, Chelsea without 4) → late twist (first corner = goal) →
// hero turns villain (Drogba's foul) → keeper saves → hero again (last kick) → peak end (trophy in Bayern's stadium) → binary comment question.
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
const big = (t, at, s, o = {}) => { if (t < at) return; g.save(); g.translate(shake(t, at, o.sh ?? 14), 0); stampText(s, 540, o.y ?? 1020, t, at, { size: o.size ?? 110, rot: o.rot ?? -0.08 }); g.restore(); };
const drop = (at, len = 0.45) => [[Math.max(0.05, at - len), 'mute', 1, len], [at, 'boom', 1.2], [at + 0.02, 'hit', 1.3]];   // music drops out, then the hit
const S = (f) => (K, Sc) => f()(K, Sc);                // scenes are built when their word clock is live

VIS.open = (K) => { K(0.05, 'hit', 1.3); K(0.3, 'wrong', 1); K(sw('one', 0.8), 'stamp', 1); K(sw('guess', 1.3), 'tick', 0.8); K(sw('final', 1.8), 'pop', 0.8, 800);
  return (t) => { atmosphere(t); const P = shot(t, 'allianz1', { a: [0.45, 0.5, 1.2], b: [0.45, 0.5, 1.4], dur: 2.5 }); if (!P) noPhoto(t); dimAll(0.45); tag(t);
    hook(t, EP.hook, 400); if (EP.series) chip(EP.series, 80, 630, t, -0.3, { size: 26, align: 'left', bg: GOLD, fg: BG });
    board(t, -0.3, 790, 'CORNERS', T, '20–1', null, TC); lot(t, 0.4, 'think', 900, 1120, 150); }; };

VIS[0] = S(() => { const fin = sw('buyurn', 1.1), own = sw('own', 2.0);
  return pscene(0, N, { dim: 0.15, k: [[fin, 'whoosh', 0.6], [own, 'boom', 0.9], [own + 0.02, 'hit', 1]],
    parts: [{ from: 0, clip: 'munich', a: [0.5, 0.5, 1.4], b: [0.5, 0.5, 1.55], badge: 'REAL FOOTAGE · MUNICH (TIMELAPSE)' },
            { from: fin, ph: 'illum', a: [0.5, 0.5, 1.3], b: [0.5, 0.5, 1.5], badge: 'REAL PHOTO · ALLIANZ ARENA, MUNICH', flash: true },
            { from: own, ph: 'celeb2', a: [0.5, 0.55, 1.35], b: [0.5, 0.55, 1.15], badge: 'REAL PHOTO · ALLIANZ ARENA, 2012 FINAL', flash: true }],
    x: (t) => { if (t > own) chip('“FINALE DAHOAM” = FINAL AT HOME', 540, 600, t, own, { size: 34, bg: '#FF4D5A', fg: '#FFF' }); } }); });

VIS[1] = S(() => { const four = sw('four', 0.9), ev = sw('even', 1.8), ter = sw('terry', 2.4), names = ['IVANOVIĆ', 'MEIRELES', 'RAMIRES', 'TERRY'];
  const at = (k) => k < 3 ? four + k * 0.16 : ter;
  return pscene(1, N, { dim: 0.4, k: [[four, 'stamp', 1], [four + 0.16, 'stamp', 0.9], [four + 0.32, 'stamp', 0.9], [ev, 'whoosh', 0.6], [ter, 'stamp', 1.2], [ter + 0.02, 'wrong', 1]],
    parts: [{ from: 0, ph: 'lampard', a: [0.45, 0.5, 1.25], b: [0.45, 0.5, 1.45], badge: 'REAL PHOTO · CHELSEA, 2012 FINAL' },
            { from: ev, ph: 'stimmung', a: [0.5, 0.45, 1.2], b: [0.5, 0.45, 1.35], badge: 'REAL PHOTO · MUNICH ON FINAL DAY, 19 MAY 2012', flash: true }],
    x: (t) => { names.forEach((nm, k) => { if (t > at(k)) { const x = 190 + k * 233; redCard(t, at(k), x, 760, k === 3 ? 0.7 : 0.55); chip(nm, x, 910, t, at(k) + 0.05, { size: k === 3 ? 30 : 24, bg: k === 3 ? '#E3101E' : 'rgba(12,11,10,0.85)', fg: '#FFF' }); } });
      fact(t, four, '4 SUSPENDED', null, { y: 600, size: 110 }); if (t > ter) lot(t, ter + 0.05, 'scream', 900, 1060, 140); } }); });

VIS[2] = S(() => { const a2 = sw('attack', 0.9, 1), a3 = sw('attack', 1.5, 2), min = sw('eighty', 2.0), mu = sw('muller', 2.6);
  return pscene(2, N, { dim: 0.2, k: [[0.3, 'tick', 0.7], [a2, 'tick', 0.8], [a3, 'tick', 0.9], [min, 'beep', 0.8], [mu, 'boom', 1], [mu + 0.02, 'hit', 1.2]],
    parts: [{ from: 0, ph: 'robbenfk', a: [0.6, 0.5, 1.25], b: [0.6, 0.5, 1.45], badge: 'REAL PHOTO · ROBBEN FREE KICK, 2012 FINAL' },
            { from: a2, ph: 'robben', a: [0.62, 0.4, 1.25], b: [0.62, 0.4, 1.45], badge: 'REAL PHOTO · ROBBEN, 2012 FINAL', flash: true },
            { from: a3, ph: 'extra', a: [0.55, 0.55, 1.3], b: [0.55, 0.55, 1.5], badge: 'REAL PHOTO · BAYERN ATTACK, 2012 FINAL', flash: true },
            { from: mu, ph: 'celeb2', a: [0.5, 0.6, 1.6], b: [0.5, 0.6, 1.3], badge: 'REAL PHOTO · ALLIANZ ARENA, 2012 FINAL', flash: true }],
    x: (t) => { board(t, 0.1, 520, t > min ? "83'" : "70'", T, t > mu ? '1–0' : '0–0', mu, Object.assign({ label: t > mu ? 'MÜLLER' : 'BAYERN ATTACK' }, TC));
      chip(`CORNERS ${t > a3 ? 20 : t > a2 ? 15 : 9}–0`, 540, 820, t, 0.2, { size: 30, bg: 'rgba(12,11,10,0.85)', fg: '#FFF' });
      if (t > mu) { big(t, mu, '1–0 BAYERN', { size: 100 }); lot(t, mu + 0.1, 'party', 900, 1150, 140); } } }); });

VIS[3] = S(() => { const first = sw('first', 1.0), mata = sw('mata', 1.9), dro = sw('drogba', 2.6);
  return pscene(3, N, { dim: 0.2, k: [[first, 'ding', 0.9], [mata, 'whoosh', 0.6], ...drop(dro, 0.5)],
    parts: [{ from: 0, ph: 'allianz1', a: [0.5, 0.5, 1.2], b: [0.5, 0.5, 1.4], badge: "REAL PHOTO · CHELSEA'S CORNER, 2012 FINAL" },
            { from: mata, ph: 'lampard', a: [0.5, 0.35, 1.3], b: [0.5, 0.3, 1.55], badge: 'REAL PHOTO · CHELSEA ATTACK, 2012 FINAL', flash: true },
            { from: dro, ph: 'didi', a: [0.5, 0.3, 1.25], b: [0.5, 0.3, 1.0], badge: 'REAL PHOTO · DIDIER DROGBA, 2012 FINAL', flash: true }],
    x: (t) => { board(t, 0.1, 520, "88'", T, t > dro ? '1–1' : '1–0', dro, Object.assign({ label: t > dro ? 'DROGBA' : 'CHELSEA CORNER' }, TC));
      chip(t < first ? 'CORNERS 20–0' : 'CORNERS 20–1', 540, 820, t, 0.1, { size: t < first ? 30 : 38, bg: t < first ? 'rgba(12,11,10,0.85)' : GOLD, fg: t < first ? '#FFF' : BG });
      if (t > dro) { big(t, dro, 'HEADER!', { size: 120 }); lot(t, dro + 0.1, 'mindblown', 900, 900, 150); } } }); });

VIS[4] = S(() => { const fo = sw('fouls', 0.9), pen = sw('penalty', 1.6), rob = sw('robben', 2.1), sv = sw('saved', 2.9);
  return pscene(4, N, { dim: 0.25, k: [[fo, 'wrong', 1], [pen, 'beep', 1], [pen + 0.02, 'stamp', 1], [rob, 'tick', 0.8], ...drop(sv, 0.55)],
    parts: [{ from: 0, ph: 'extra', a: [0.5, 0.5, 1.2], b: [0.47, 0.5, 1.4], badge: 'REAL PHOTO · EXTRA TIME, 2012 FINAL' },
            { from: rob, ph: 'robben', a: [0.66, 0.38, 1.6], b: [0.66, 0.38, 1.9], badge: 'REAL PHOTO · ARJEN ROBBEN, 2012 FINAL', flash: true },
            { from: sv, ph: 'robben', a: [0.55, 0.45, 1.05], b: [0.55, 0.45, 1.2], badge: 'REAL PHOTO · ROBBEN, 2012 FINAL', flash: true }],
    x: (t) => { board(t, 0.1, 520, 'EXTRA TIME', T, '1–1', null, Object.assign({ label: t > pen ? 'PENALTY BAYERN' : 'CHELSEA HANG ON' }, TC));
      if (t > fo) chip('DROGBA FOULS RIBÉRY', 540, 820, t, fo, { size: 34, bg: '#E3101E', fg: '#FFF' });
      if (t > pen && t < sv) { lot(t, pen, 'alarm', 900, 1000, 130); }
      if (t > sv) { flash(t, sv, 0.4, 0.1); big(t, sv, 'SAVED BY ČECH!', { size: 92 }); lot(t, sv + 0.1, 'scream', 900, 880, 140); } } }); });

VIS[5] = S(() => { const two = sw('two', 1.0), last = sw('last', 1.9), dro = sw('drogba', 2.7), step = Math.max(0.12, (last - 0.5) / 10);
  return pscene(5, N, { dim: 0.25, k: [...KICKS.map(([, ok], k) => [0.4 + k * step, ok ? 'pop' : 'wrong', 0.75, 700 + k * 40]), [last, 'whoosh', 0.6], ...drop(dro, 0.6)],
    parts: [{ from: 0, ph: 'mata', a: [0.5, 0.5, 1.3], b: [0.5, 0.5, 1.5], badge: 'REAL PHOTO · SHOOT-OUT, 2012 FINAL' },
            { from: last, ph: 'lastpen', a: [0.62, 0.62, 1.6], b: [0.62, 0.62, 2.0], badge: "REAL PHOTO · DROGBA'S LAST PENALTY", flash: true },
            { from: dro, ph: 'lastpen', a: [0.5, 0.5, 1.15], b: [0.5, 0.5, 1.3], badge: "REAL PHOTO · DROGBA'S LAST PENALTY", flash: true }],
    x: (t) => { if (t < last) shootout(t, 0.4, 520, step); else board(t, last, 520, 'PENALTIES', T, t > dro ? '3–4' : '3–3', dro, Object.assign({ label: 'LAST KICK: DROGBA' }, TC));
      if (t > two && t < last) chip('ČECH SAVES 2', 540, 820, t, two, { size: 34, bg: GOLD, fg: BG });
      if (t > dro) { big(t, dro, 'DROGBA!', { size: 130 }); lot(t, dro + 0.1, 'fire', 900, 880, 150); } } }); });

VIS[6] = S(() => { const ch = sw('champions', 1.2), by = sw('buyurn', 2.2);
  return pscene(6, N, { dim: 0.15, k: [[0.3, 'ding', 0.9], [ch, 'boom', 0.9], [by, 'stamp', 1]],
    parts: [{ from: 0, ph: 'cup', a: [0.5, 0.35, 1.25], b: [0.5, 0.35, 1.05], badge: 'REAL PHOTO · DROGBA WITH THE TROPHY, MUNICH 2012' },
            { from: ch, ph: 'cechcup', a: [0.5, 0.5, 1.3], b: [0.5, 0.5, 1.5], badge: 'REAL PHOTO · CHELSEA CELEBRATE, MUNICH 2012', flash: true },
            { from: by, ph: 'celeb', a: [0.5, 0.6, 1.3], b: [0.5, 0.6, 1.5], badge: "REAL PHOTO · CHELSEA ON BAYERN'S PITCH", flash: true }],
    x: (t) => { board(t, 0.1, 520, 'FULL TIME', T, '3–4 PENS', null, TC); if (t < by) lot(t, 0.3, 'trophy', 880, 960, 160);
      if (t > by) chip("IN BAYERN'S OWN STADIUM", 540, 820, t, by, { size: 34, bg: GOLD, fg: BG }); } }); });
