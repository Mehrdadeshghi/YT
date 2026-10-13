// Wiki Roulette #142 — Barcelona 2–8 Bayern Munich, Champions League quarter-final, Lisbon, 14 Aug 2020.
// UCL matchday special: tonight Bayern play Viking (Norway) and Barça play Galatasaray (13 Oct 2026). Real photos, honest labels.
// Retention: frame-1 impossible scoreline → empty-stadium setting → running scoreboard (1–4 at half-time) → Coutinho twist (on loan
// from Barça) → record (first 8 conceded in 74 years) → fallout → tonight both play → binary comment question.
const N = 7, TC = { c1: '#A50044', c2: '#DC052D' }, T = ['BARCELONA', 'BAYERN'];
const big = (t, at, s, o = {}) => { if (t < at) return; g.save(); g.translate(shake(t, at, o.sh ?? 14), 0); stampText(s, 540, o.y ?? 1020, t, at, { size: o.size ?? 110, rot: o.rot ?? -0.08 }); g.restore(); };
const drop = (at, len = 0.45) => [[Math.max(0.05, at - len), 'mute', 1, len], [at, 'boom', 1.2], [at + 0.02, 'hit', 1.3]];
const goal = (a) => [[a, 'boom', 1], [a + 0.02, 'hit', 1.1]];
const S = (f) => (K, Sc) => f()(K, Sc);
// one ball per Bayern goal, lands with a bounce
function tally(t, times, y) { times.forEach((at, k) => { if (t < at) return; const s = spring(t - at, 320, 14), x = 540 + (k - (times.length - 1) / 2) * 104;
  g.save(); g.translate(x, y - (1 - Math.min(1, s)) * 160); g.scale(s, s); g.beginPath(); g.arc(0, 0, 40, 0, 6.283); g.fillStyle = '#FFF'; g.fill();
  g.lineWidth = 5; g.strokeStyle = '#111'; g.stroke(); text(String(k + 1), 0, 15, 'disp', 40, '#111', { align: 'center' }); g.restore(); }); }

VIS.open = (K) => { K(0.05, 'hit', 1.3); K(0.3, 'wrong', 1); K(sw('eight', 1.6), 'stamp', 1.2);
  return (t) => { atmosphere(t); const P = shot(t, 'luz', { a: [0.5, 0.5, 1.25], b: [0.5, 0.5, 1.45], dur: 3 }); if (!P) noPhoto(t); dimAll(0.45); tag(t);
    hook(t, EP.hook, 400); if (EP.series) chip(EP.series, 80, 630, t, -0.3, { size: 24, align: 'left', bg: GOLD, fg: BG });
    board(t, -0.3, 790, 'FULL TIME', T, '2–8', 0.3, Object.assign({ label: 'CHAMPIONS LEAGUE QUARTER-FINAL' }, TC)); lot(t, 0.4, 'skull', 900, 1130, 150); }; };

VIS[0] = S(() => { const li = sw('lisbon', 0.8), one = sw('one', 1.8), em = sw('empty', 2.6);
  return pscene(0, N, { dim: 0.2, k: [[li, 'whoosh', 0.6], [one, 'tick', 1], [em, 'stamp', 1]],
    parts: [{ from: 0, ph: 'luz', a: [0.5, 0.5, 1.2], b: [0.5, 0.5, 1.4], badge: 'REAL PHOTO · ESTÁDIO DA LUZ, LISBON, 6 AUG 2020' }],
    x: (t) => { chip('14 AUGUST 2020', 540, 620, t, 0.3, { size: 34, bg: GOLD, fg: BG });
      if (t > one) chip('ONE MATCH · NO SECOND LEG', 540, 820, t, one, { size: 32, bg: 'rgba(12,11,10,0.85)', fg: '#FFF' });
      if (t > em) chip('NO FANS (COVID-19)', 540, 920, t, em, { size: 32, bg: '#E3101E', fg: '#FFF' }); } }); });

VIS[1] = S(() => { const m1 = sw('muller', 0.7), pe = sw('perisich', 1.4), gn = sw('gnabry', 1.8), m2 = sw('muller', 2.3, 1), ht = sw('half', 2.9);
  return pscene(1, N, { dim: 0.25, k: [...goal(m1), ...goal(pe), ...goal(gn), ...goal(m2), [ht, 'stamp', 1.1]],
    parts: [{ from: 0, ph: 'muller', a: [0.5, 0.3, 1.1], b: [0.5, 0.28, 1.25], badge: 'REAL PHOTO · THOMAS MÜLLER (2022)' },
            { from: pe, ph: 'baypl', a: [0.5, 0.45, 1.3], b: [0.5, 0.45, 1.5], badge: 'REAL PHOTO · BAYERN PLAYERS IN THE CHAMPIONS LEAGUE', flash: true },
            { from: m2, ph: 'muller', a: [0.5, 0.25, 1.35], b: [0.5, 0.25, 1.5], badge: 'REAL PHOTO · THOMAS MÜLLER (2022)', flash: true }],
    x: (t) => { const sc = t > m2 ? '1–4' : t > gn ? '1–3' : t > pe ? '1–2' : t > m1 ? '0–1' : '0–0', ck = t > ht ? 'HALF-TIME' : t > m2 ? "31'" : t > gn ? "27'" : t > pe ? "21'" : "4'";
      board(t, 0.1, 520, ck, T, sc, [m2, gn, pe, m1].find((a) => t > a), Object.assign({ label: t > m2 ? 'MÜLLER' : t > gn ? 'GNABRY' : t > pe ? 'PERIŠIĆ' : 'MÜLLER' }, TC));
      tally(t, [m1, pe, gn, m2], 800); if (t > ht) { big(t, ht, '1–4 AT HALF-TIME', { size: 84, y: 960, sh: 8 }); lot(t, ht + 0.1, 'mindblown', 880, 1130, 140); } } }); });

VIS[2] = S(() => { const ki = sw('kimmich', 0.7), le = sw('leh', 1.2), six = sw('six', 1.9);
  return pscene(2, N, { dim: 0.25, k: [...goal(ki), ...goal(le), [six, 'stamp', 1.1]],
    parts: [{ from: 0, ph: 'baypl', a: [0.5, 0.45, 1.5], b: [0.5, 0.45, 1.7], badge: 'REAL PHOTO · BAYERN PLAYERS IN THE CHAMPIONS LEAGUE' },
            { from: le, ph: 'lewa', a: [0.5, 0.35, 1.3], b: [0.5, 0.35, 1.5], badge: 'REAL PHOTO · ROBERT LEWANDOWSKI (2019)', flash: true }],
    x: (t) => { board(t, 0.1, 520, t > le ? "82'" : t > ki ? "63'" : "57'", T, t > le ? '2–6' : t > ki ? '2–5' : '2–4', t > le ? le : t > ki ? ki : null, Object.assign({ label: t > le ? 'LEWANDOWSKI' : t > ki ? 'KIMMICH' : 'SUÁREZ PULLS ONE BACK' }, TC));
      tally(t, [-1, -1, -1, -1, ki, le], 800); if (t > six) lot(t, six + 0.05, 'fire', 880, 1130, 140); } }); });

VIS[3] = S(() => { const co = sw('coutinho', 0.5), tw = sw('twice', 1.0), lo = sw('loan', 1.8), ba = sw('barcelona', 2.6);
  return pscene(3, N, { dim: 0.2, k: [...goal(co), ...goal(tw), [lo, 'whoosh', 0.6], ...drop(ba, 0.45)],
    parts: [{ from: 0, ph: 'cou1', a: [0.5, 0.4, 1.3], b: [0.5, 0.4, 1.5], badge: "REAL PHOTO · COUTINHO IN BARÇA'S SHIRT (2018)" },
            { from: lo, ph: 'coutb', a: [0.5, 0.3, 1.05], b: [0.5, 0.25, 1.2], badge: "REAL PHOTO · COUTINHO FOR BARÇA (2018)", flash: true }],
    x: (t) => { board(t, 0.1, 520, t > tw ? "89'" : "85'", T, t > tw ? '2–8' : '2–7', t > tw ? tw : co, Object.assign({ label: 'COUTINHO' }, TC));
      if (t > ba) { big(t, ba, 'ON LOAN FROM BARÇA!', { size: 80, y: 900 }); lot(t, ba + 0.1, 'flushed', 880, 1130, 150); } } }); });

VIS[4] = S(() => { const se = sw('seventy', 1.2);
  return pscene(4, N, { dim: 0.3, k: [[0.3, 'stamp', 1.1], ...drop(se, 0.45)],
    parts: [{ from: 0, ph: 'luz12', a: [0.5, 0.5, 1.3], b: [0.5, 0.5, 1.5], badge: 'REAL PHOTO · ESTÁDIO DA LUZ, LISBON' }],
    x: (t) => { board(t, 0.1, 520, 'FULL TIME', T, '2–8', 0.2, Object.assign({ label: 'QUARTER-FINAL · LISBON' }, TC));
      if (t > se) { big(t, se, 'FIRST TIME IN 74 YEARS', { size: 78, y: 900, sh: 8 }); chip('8 GOALS CONCEDED IN ONE GAME', 540, 1020, t, se + 0.15, { size: 30, bg: GOLD, fg: BG }); lot(t, se + 0.1, 'skull', 880, 1150, 140); } } }); });

VIS[5] = S(() => { const sa = sw('sacked', 1.2), tr = sw('trophy', 2.6);
  return pscene(5, N, { dim: 0.25, k: [[sa, 'stamp', 1.1], [tr, 'ding', 1], [tr + 0.05, 'boom', 0.8]],
    parts: [{ from: 0, ph: 'cou2', a: [0.5, 0.4, 1.4], b: [0.5, 0.4, 1.6], badge: 'REAL PHOTO · FC BARCELONA (2018)' },
            { from: tr - 0.6, ph: 'muller2', a: [0.5, 0.4, 1.2], b: [0.5, 0.4, 1.4], badge: 'REAL PHOTO · THOMAS MÜLLER, BAYERN (2017)', flash: true }],
    x: (t) => { if (t > sa && t < tr - 0.6) { redCard(t, sa, 820, 760, 0.7); big(t, sa + 0.05, 'COACH SACKED', { size: 96, y: 980 }); }
      if (t > tr) { chip('BAYERN WIN THE 2020 CHAMPIONS LEAGUE', 540, 820, t, tr, { size: 28, bg: GOLD, fg: BG }); lot(t, tr + 0.1, 'trophy', 880, 1130, 150); } } }); });

VIS[6] = S(() => { const no = sw('norway', 1.4), is = sw('istanbul', 2.4);
  return pscene(6, N, { dim: 0.25, k: [[no, 'whoosh', 0.6], [is, 'whoosh', 0.6]],
    parts: [{ from: 0, ph: 'muller2', a: [0.5, 0.4, 1.5], b: [0.5, 0.4, 1.65], badge: 'REAL PHOTO · BAYERN (2017)' },
            { from: is, ph: 'rams', a: [0.5, 0.5, 1.3], b: [0.5, 0.5, 1.45], badge: "REAL PHOTO · GALATASARAY'S STADIUM, ISTANBUL", flash: true }],
    x: (t) => { chip('TONIGHT', 540, 620, t, 0.2, { size: 36, bg: '#E3101E', fg: '#FFF' });
      if (t > no) chip('VIKING v BAYERN', 540, 760, t, no, { size: 40, bg: '#DC052D', fg: '#FFF' });
      if (t > is) chip('GALATASARAY v BARÇA', 540, 870, t, is, { size: 40, bg: '#A50044', fg: '#FFF' }); } }); });
