// Wiki Roulette #140 — Atlético's cursed finals: 1974 (last-minute equaliser, replay 0–4), 2014 (Ramos 90+3), 2016 (penalties).
// UCL matchday special for Atlético v Man United (13 Oct 2026). Real photos (Anefo 1973/74, Lisbon 2014, Milan, Metropolitano).
// Retention: frame-1 "1 minute from glory. Twice." → 1974 lead + last-minute shock → replay rout → 2014 lead → 93rd-minute header →
// 2016 post → twist: this season's final is in their own stadium → binary comment question.
const N = 7, TC = { c1: '#E8303A', c2: '#E6E8EC' };
const big = (t, at, s, o = {}) => { if (t < at) return; g.save(); g.translate(shake(t, at, o.sh ?? 14), 0); stampText(s, 540, o.y ?? 1020, t, at, { size: o.size ?? 110, rot: o.rot ?? -0.08 }); g.restore(); };
const drop = (at, len = 0.45) => [[Math.max(0.05, at - len), 'mute', 1, len], [at, 'boom', 1.2], [at + 0.02, 'hit', 1.3]];
const S = (f) => (K, Sc) => f()(K, Sc);
const gray = (a = 1) => { g.save(); g.globalAlpha *= a; g.globalCompositeOperation = 'saturation'; g.fillStyle = '#000'; g.fillRect(0, 0, W, H); g.restore(); };

VIS.open = (K) => { K(0.05, 'hit', 1.3); K(0.3, 'wrong', 1); K(sw('twice', 1.4), 'stamp', 1.1);
  return (t) => { atmosphere(t); const P = shot(t, 'fin14', { a: [0.5, 0.45, 1.25], b: [0.5, 0.45, 1.45], dur: 3 }); if (!P) noPhoto(t); dimAll(0.45); tag(t);
    hook(t, EP.hook, 400); if (EP.series) chip(EP.series, 80, 630, t, -0.3, { size: 24, align: 'left', bg: GOLD, fg: BG });
    board(t, -0.3, 790, "90+3'", ['REAL', 'ATLÉTICO'], '1–1', 0.2, Object.assign({ label: 'LISBON 2014 · FINAL' }, TC)); lot(t, 0.4, 'skull', 900, 1130, 150); }; };

VIS[0] = S(() => { const ex = sw('extra', 1.2), ar = sw('arra', 1.8), one = sw('one', 2.6);
  return pscene(0, N, { dim: 0.2, k: [[ex, 'tick', 1], [ar, 'whoosh', 0.6], [one, 'boom', 1.1], [one + 0.02, 'hit', 1.2]],
    parts: [{ from: 0, ph: 'ajbay', a: [0.5, 0.45, 1.25], b: [0.5, 0.45, 1.45], badge: 'REAL PHOTO · BAYERN IN THE EUROPEAN CUP, 1973' },
            { from: ar, ph: 'garate', a: [0.5, 0.4, 1.3], b: [0.5, 0.4, 1.5], badge: 'REAL PHOTO · ATLÉTICO PLAYERS GÁRATE & IRURETA, 1973', flash: true }],
    x: (t) => { board(t, 0.1, 520, t > one ? "114'" : t > ex ? 'EXTRA TIME' : "90'", ['ATLÉTICO', 'BAYERN'], t > one ? '1–0' : '0–0', t > one ? one : null, Object.assign({ label: t > one ? 'ARAGONÉS · FREE-KICK' : 'EUROPEAN CUP FINAL 1974' }, TC));
      if (t > one) { big(t, one, 'GOAL!', { size: 130, y: 920 }); lot(t, one + 0.1, 'party', 880, 1130, 140); } } }); });

VIS[1] = S(() => { const sev = sw('seven', 0.6), last = sw('last', 2.2), sh = sw('shvarts', 2.8), one = sw('one', 3.6);
  return pscene(1, N, { dim: 0.25, k: [[sev, 'tick', 1], [last, 'beep', 0.9], ...drop(one, 0.5)],
    parts: [{ from: 0, ph: 'garate', a: [0.6, 0.4, 1.4], b: [0.6, 0.4, 1.6], badge: 'REAL PHOTO · ATLÉTICO PLAYERS, 1973' },
            { from: sh, ph: 'schwarz', a: [0.5, 0.35, 1.05], b: [0.5, 0.3, 1.25], badge: 'REAL PHOTO · HANS-GEORG SCHWARZENBECK, 1974', flash: true }],
    x: (t) => { board(t, 0.1, 520, t > one ? "120'" : t > last ? "119'" : "113'", ['ATLÉTICO', 'BAYERN'], t > one ? '1–1' : '1–0', t > one ? one : null, Object.assign({ label: t > one ? 'SCHWARZENBECK · 25 YARDS' : 'EXTRA TIME' }, TC));
      if (t > sev && t < sh) chip('7 MINUTES FROM THE TITLE', 540, 820, t, sev, { size: 36, bg: '#E3101E', fg: '#FFF' });
      if (t > one) { big(t, one, 'LAST MINUTE!', { size: 110, y: 920 }); lot(t, one + 0.1, 'scream', 880, 1130, 140); } } }); });

VIS[2] = S(() => { const rep = sw('replayed', 1.2), four = sw('four', 2.4);
  return pscene(2, N, { dim: 0.3, k: [[rep, 'whoosh', 0.6], [rep + 0.05, 'stamp', 1], ...drop(four, 0.4)],
    parts: [{ from: 0, ph: 'bayarr', a: [0.5, 0.45, 1.3], b: [0.5, 0.45, 1.5], badge: 'REAL PHOTO · BAYERN SQUAD ARRIVES IN AMSTERDAM, 1973' },
            { from: four, ph: 'ajbay', a: [0.4, 0.45, 1.5], b: [0.4, 0.45, 1.7], badge: 'REAL PHOTO · BAYERN IN THE EUROPEAN CUP, 1973', flash: true }],
    x: (t) => { if (t > rep) chip('THE ONLY EUROPEAN CUP FINAL EVER REPLAYED', 540, 620, t, rep, { size: 28, bg: GOLD, fg: BG });
      if (t > four) { board(t, four, 760, 'REPLAY', ['ATLÉTICO', 'BAYERN'], '0–4', four, Object.assign({ label: '17 MAY 1974' }, TC)); gray(clamp((t - four) / 0.5) * 0.8); lot(t, four + 0.1, 'cry', 880, 1150, 140); } } }); });

VIS[3] = S(() => { const fo = sw('forty', 0.3), li = sw('lisbon', 1.0), he = sw('heads', 2.4);
  return pscene(3, N, { dim: 0.2, k: [[li, 'whoosh', 0.6], [he, 'boom', 1.1], [he + 0.02, 'hit', 1.2]],
    parts: [{ from: 0, ph: 'liga14', a: [0.5, 0.5, 1.3], b: [0.5, 0.5, 1.45], badge: 'REAL PHOTO · ATLÉTICO FANS, MAY 2014' },
            { from: li, ph: 'lis14', a: [0.5, 0.5, 1.4], b: [0.5, 0.5, 1.6], badge: 'REAL PHOTO · 2014 FINAL, ESTÁDIO DA LUZ, LISBON', flash: true },
            { from: he, ph: 'lis14', a: [0.35, 0.6, 1.9], b: [0.35, 0.6, 2.1], badge: 'REAL PHOTO · 2014 FINAL, ESTÁDIO DA LUZ, LISBON', flash: true }],
    x: (t) => { if (t > fo && t < he) chip('40 YEARS LATER', 540, 620, t, fo, { size: 40, bg: GOLD, fg: BG });
      if (t > he) { board(t, he, 520, "36'", ['REAL', 'ATLÉTICO'], '0–1', he, Object.assign({ label: 'GODÍN · HEADER' }, TC)); lot(t, he + 0.1, 'fire', 880, 1130, 140); } } }); });

VIS[4] = S(() => { const ra = sw('ramos', 0.9), hd = sw('header', 1.5), real = sw('real', 2.4);
  return pscene(4, N, { dim: 0.2, k: [[0.3, 'tick', 1], [ra, 'whoosh', 0.6], ...drop(hd, 0.5), [real, 'thump', 1]],
    parts: [{ from: 0, ph: 'lis14', a: [0.65, 0.55, 1.6], b: [0.65, 0.55, 1.8], badge: 'REAL PHOTO · 2014 FINAL, LISBON' },
            { from: ra, ph: 'ramos', a: [0.42, 0.4, 1.3], b: [0.42, 0.35, 1.5], badge: 'REAL PHOTO · SERGIO RAMOS (2010)', flash: true },
            { from: real, ph: 'fin14', a: [0.5, 0.5, 1.2], b: [0.5, 0.5, 1.35], badge: 'REAL PHOTO · REAL MADRID CELEBRATE, LISBON 2014', flash: true }],
    x: (t) => { board(t, 0.1, 520, t > real ? 'AFTER EXTRA TIME' : t > hd ? "90+3'" : "90+2'", ['REAL', 'ATLÉTICO'], t > real ? '4–1' : t > hd ? '1–1' : '0–1', t > hd ? hd : null, Object.assign({ label: t > real ? 'BALE · MARCELO · RONALDO' : t > hd ? 'RAMOS · HEADER' : 'STOPPAGE TIME' }, TC));
      if (t > hd && t < real) { big(t, hd, '93RD MINUTE!', { size: 104, y: 920 }); lot(t, hd + 0.1, 'mindblown', 880, 1130, 140); }
      if (t > real) { gray(clamp((t - real) / 0.5) * 0.7); lot(t, real + 0.1, 'cry', 880, 1130, 140); } } }); });

VIS[5] = S(() => { const mi = sw('milan', 0.6), pen = sw('penalties', 1.6), post = sw('post', 2.6), win = sw('win', 3.4);
  return pscene(5, N, { dim: 0.25, k: [[mi, 'whoosh', 0.6], [pen, 'tick', 1], [post, 'crack', 1.1], [post + 0.02, 'thump', 1], [win, 'stamp', 1]],
    parts: [{ from: 0, ph: 'sansiro', a: [0.5, 0.5, 1.3], b: [0.5, 0.5, 1.5], badge: 'REAL PHOTO · SAN SIRO, MILAN — 2016 FINAL VENUE' },
            { from: win, ph: 'ramos16', a: [0.5, 0.35, 1.05], b: [0.5, 0.3, 1.2], badge: "REAL PHOTO · RAMOS WITH REAL'S 11TH EUROPEAN CUP, 2016", flash: true }],
    x: (t) => { board(t, 0.1, 520, t > pen ? 'PENALTIES' : "120'", ['REAL', 'ATLÉTICO'], t > win ? '5–3' : '1–1', t > win ? win : null, Object.assign({ label: '2016 FINAL · MILAN' }, TC));
      if (t > post && t < win) { big(t, post, 'POST!', { size: 140, y: 920 }); chip('JUANFRAN MISSES', 540, 1060, t, post + 0.1, { size: 32, bg: '#E3101E', fg: '#FFF' }); }
      if (t > win) lot(t, win + 0.1, 'skull', 880, 1130, 140); } }); });

VIS[6] = S(() => { const ze = sw('zero', 0.9), st = sw('stadium', 2.4), to = sw('tonight', 3.2);
  return pscene(6, N, { dim: 0.2, k: [[ze, 'stamp', 1.1], [st, 'ding', 1], [to, 'whoosh', 0.6]],
    parts: [{ from: 0, ph: 'metro', a: [0.5, 0.5, 1.6], b: [0.45, 0.5, 1.8], badge: "REAL PHOTO · METROPOLITANO, ATLÉTICO'S STADIUM" },
            { from: to, ph: 'fans', a: [0.5, 0.5, 1.3], b: [0.5, 0.5, 1.45], badge: 'REAL PHOTO · ATLÉTICO FANS', flash: true }],
    x: (t) => { if (t > ze && t < to) big(t, ze, '3 FINALS · 0 TITLES', { size: 84, y: 760, sh: 8 });
      if (t > st && t < to) chip('2027 FINAL: METROPOLITANO, MADRID', 540, 900, t, st, { size: 30, bg: GOLD, fg: BG });
      if (t > to) { chip('TONIGHT', 540, 640, t, to, { size: 36, bg: '#E3101E', fg: '#FFF' }); big(t, to + 0.1, 'ATLÉTICO v MAN UTD', { size: 76, y: 780, sh: 6 }); } } }); });
