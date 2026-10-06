// Wiki Roulette #106 — Brazil 1–7 Germany, 2014 World Cup semi-final, Belo Horizonte (Football's Craziest Moments #6).
// Real match photos (Agência Brasil, CC BY 3.0 BR) + real Mineirão footage. Narrator voice, music bed, word-synced cuts (sw()).
// Retention plan: frame-1 impossible scoreline (Brazil 0–5 after 29') → stakes (unbeaten at home since 1975, no Neymar, no captain) →
// escalation (record goal, then 4 goals in 6 minutes with a running clock) → emotional low (tears, fans leave) →
// twist (Brazil fans applaud Germany) → peak end (7–1, record) → binary comment question.
const N = 7, T = ['BRAZIL', 'GERMANY'], TC = { c1: '#F7D21E', c2: '#E6E8EC' };
const big = (t, at, s, o = {}) => { if (t < at) return; g.save(); g.translate(shake(t, at, o.sh ?? 14), 0); stampText(s, 540, o.y ?? 1020, t, at, { size: o.size ?? 110, rot: o.rot ?? -0.08 }); g.restore(); };
const drop = (at, len = 0.45) => [[Math.max(0.05, at - len), 'mute', 1, len], [at, 'boom', 1.2], [at + 0.02, 'hit', 1.3]];
const S = (f) => (K, Sc) => f()(K, Sc);
const gray = (a = 1) => { g.save(); g.globalAlpha *= a; g.globalCompositeOperation = 'saturation'; g.fillStyle = '#000'; g.fillRect(0, 0, W, H); g.restore(); };
// goal tally: one ball per German goal, lands with a bounce
function tally(t, times, y) { times.forEach((at, k) => { if (t < at) return; const s = spring(t - at, 320, 14), x = 540 + (k - (times.length - 1) / 2) * 110;
  g.save(); g.translate(x, y - (1 - Math.min(1, s)) * 160); g.scale(s, s); g.beginPath(); g.arc(0, 0, 40, 0, 6.283); g.fillStyle = '#FFF'; g.fill();
  g.lineWidth = 5; g.strokeStyle = '#111'; g.stroke(); text(String(k + 1), 0, 15, 'disp', 40, '#111', { align: 'center' }); g.restore(); }); }

VIS.open = (K) => { K(0.05, 'hit', 1.3); K(0.3, 'wrong', 1); K(sw('five', 1.2), 'stamp', 1.1); K(sw('twenty', 1.9), 'tick', 0.9);
  return (t) => { atmosphere(t); const P = shot(t, 'bg05', { a: [0.55, 0.45, 1.2], b: [0.55, 0.45, 1.4], dur: 3 }); if (!P) noPhoto(t); dimAll(0.45); tag(t);
    hook(t, EP.hook, 400); if (EP.series) chip(EP.series, 80, 630, t, -0.3, { size: 26, align: 'left', bg: GOLD, fg: BG });
    board(t, -0.3, 790, "29'", T, '0–5', null, Object.assign({ label: 'WORLD CUP SEMI-FINAL' }, TC)); lot(t, 0.4, 'skull', 900, 1130, 150); }; };

VIS[0] = S(() => { const bh = sw('bello', 0.8), br = sw('brazil', 1.6), since = sw('since', 2.4);
  return pscene(0, N, { dim: 0.2, k: [[bh, 'whoosh', 0.6], [br, 'whoosh', 0.6], [since, 'stamp', 1.1]],
    parts: [{ from: 0, clip: 'mstad', a: [0.5, 0.5, 1.4], b: [0.5, 0.5, 1.55], badge: 'REAL FOOTAGE · MINEIRÃO, BELO HORIZONTE' },
            { from: bh, ph: 'drone3', a: [0.5, 0.5, 1.35], b: [0.5, 0.5, 1.55], badge: 'REAL PHOTO · MINEIRÃO, 2014 SEMI-FINAL DAY', flash: true },
            { from: br, ph: 'bg13', a: [0.5, 0.55, 1.4], b: [0.5, 0.55, 1.6], badge: 'REAL PHOTO · BRAZIL BEFORE KICK-OFF, 8 JULY 2014', flash: true }],
    x: (t) => { if (t > since) { chip('UNBEATEN AT HOME SINCE 1975', 540, 600, t, since, { size: 36, bg: '#2E7D32', fg: '#FFF' }); big(t, since + 0.05, '62 GAMES', { size: 110, y: 860, sh: 8 }); } } }); });

VIS[1] = S(() => { const ney = sw('neymar', 0.6), vert = sw('fractured', 1.2), cap = sw('captain', 2.0), sus = sw('suspended', 2.8);
  return pscene(1, N, { dim: 0.3, k: [[ney, 'crack', 1], [vert, 'thump', 1], [cap, 'whoosh', 0.6], ...drop(sus, 0.4)],
    parts: [{ from: 0, ph: 'col14', a: [0.42, 0.45, 1.3], b: [0.42, 0.45, 1.6], badge: 'REAL PHOTO · BRAZIL V COLOMBIA, 4 JULY 2014' },
            { from: cap, ph: 'thiago', a: [0.33, 0.55, 2.0], b: [0.33, 0.55, 2.3], badge: 'REAL PHOTO · THIAGO SILVA, JULY 2014', flash: true }],
    x: (t) => { if (t > vert && t < cap) chip('NEYMAR: FRACTURED VERTEBRA', 540, 600, t, vert, { size: 34, bg: '#E3101E', fg: '#FFF' });
      if (t > ney && t < cap) big(t, ney, 'OUT!', { size: 130, y: 900 });
      if (t > sus) { redCard(t, sus, 860, 760, 0.7); big(t, sus, 'SUSPENDED!', { size: 110, y: 960 }); } } }); });

VIS[2] = S(() => { const mu = sw('muller', 0.8), kl = sw('kloza', 2.0), six = sw('sixteenth', 2.6), rec = sw('record', 3.4);
  return pscene(2, N, { dim: 0.2, k: [[mu, 'boom', 1], [mu + 0.02, 'hit', 1.1], [kl, 'boom', 1], [kl + 0.02, 'hit', 1.1], [rec, 'ding', 1], [rec + 0.02, 'stamp', 1]],
    parts: [{ from: 0, ph: 'bg09', a: [0.5, 0.5, 1.2], b: [0.5, 0.5, 1.45], badge: 'REAL PHOTO · MÜLLER (13), BRAZIL 1–7 GERMANY' },
            { from: mu, ph: 'bg01', a: [0.55, 0.45, 1.35], b: [0.55, 0.45, 1.55], badge: 'REAL PHOTO · GERMANY CELEBRATE, 8 JULY 2014', flash: true },
            { from: kl, ph: 'bg10', a: [0.62, 0.45, 1.5], b: [0.62, 0.45, 1.8], badge: 'REAL PHOTO · MIROSLAV KLOSE, BRAZIL 1–7 GERMANY', flash: true },
            { from: rec, ph: 'bg11', a: [0.6, 0.45, 1.4], b: [0.6, 0.45, 1.6], badge: 'REAL PHOTO · KLOSE & MÜLLER, 8 JULY 2014', flash: true }],
    x: (t) => { board(t, 0.1, 520, t > kl ? "23'" : "11'", T, t > kl ? '0–2' : t > mu ? '0–1' : '0–0', t > kl ? kl : mu, Object.assign({ label: t > kl ? 'KLOSE' : t > mu ? 'MÜLLER' : 'KICK-OFF' }, TC));
      if (t > six && t < rec) { big(t, six, '16 WC GOALS', { size: 100, y: 860, sh: 8 }); chip('MORE THAN RONALDO (15)', 540, 960, t, six + 0.1, { size: 30, bg: GOLD, fg: BG }); } if (t > rec) { big(t, rec, 'RECORD!', { size: 120 }); lot(t, rec + 0.1, 'trophy', 900, 1120, 130); } } }); });

VIS[3] = S(() => { const k1 = sw('kroos', 0.5), k2 = sw('kroos', 1.2, 1), six9 = sw('sixty', 1.6), kh = sw('kehdeera', 2.5), four = sw('four', 3.0);
  const goals = [k1, k2, kh], clock = (t) => t > kh ? "29'" : t > k2 ? "26'" : t > k1 ? "24'" : "23'";
  return pscene(3, N, { dim: 0.25, k: [...goals.flatMap((a) => [[a, 'boom', 1.1], [a + 0.02, 'hit', 1.2]]), [six9, 'tick', 1], [four, 'stamp', 1.2]],
    parts: [{ from: 0, ph: 'bg12', a: [0.5, 0.4, 1.25], b: [0.5, 0.4, 1.4], badge: 'REAL PHOTO · BRAZIL 1–7 GERMANY, FIRST HALF' },
            { from: k1, ph: 'bg05', a: [0.5, 0.45, 1.3], b: [0.5, 0.45, 1.45], badge: 'REAL PHOTO · GERMANY CELEBRATE, 8 JULY 2014', flash: true },
            { from: k2, ph: 'bg07', a: [0.45, 0.5, 1.35], b: [0.45, 0.5, 1.55], badge: 'REAL PHOTO · BRAZIL 1–7 GERMANY', flash: true },
            { from: kh, ph: 'bg06', a: [0.45, 0.45, 1.3], b: [0.45, 0.45, 1.5], badge: 'REAL PHOTO · KHEDIRA (6) CELEBRATES', flash: true }],
    x: (t) => { board(t, 0.1, 520, clock(t), T, t > kh ? '0–5' : t > k2 ? '0–4' : t > k1 ? '0–3' : '0–2', t > kh ? kh : t > k2 ? k2 : k1, Object.assign({ label: t > kh ? 'KHEDIRA' : t > k1 ? 'KROOS' : '' }, TC));
      tally(t, [-1, -1, k1, k2, kh], 790);
      if (t > six9 && t < kh) chip('+69 SECONDS', 540, 900, t, six9, { size: 40, bg: '#E3101E', fg: '#FFF' });
      if (t > four) { big(t, four, '4 GOALS · 6 MINUTES', { size: 84, y: 1020 }); lot(t, four + 0.1, 'mindblown', 900, 1130, 140); } } }); });

VIS[4] = S(() => { const tears = sw('tears', 1.4), home = sw('home', 2.4);
  return pscene(4, N, { dim: 0.35, k: [[0.3, 'beep', 1], [tears, 'whoosh', 0.5], [home, 'thump', 0.9], [0.05, 'mute', 1, 2.0]],
    parts: [{ from: 0, ph: 'bg04', a: [0.5, 0.45, 1.25], b: [0.5, 0.45, 1.4], badge: 'REAL PHOTO · BRAZIL 1–7 GERMANY' },
            { from: tears, ph: 'drone1', a: [0.5, 0.5, 1.5], b: [0.5, 0.5, 1.75], badge: 'REAL PHOTO · MINEIRÃO, 8 JULY 2014', flash: true }],
    x: (t) => { if (t > tears) gray(clamp((t - tears) / 0.4)); board(t, 0.1, 520, 'HALF-TIME', T, '0–5', 0.1, TC);
      if (t > tears) lot(t, tears + 0.05, 'cry', 880, 900, 160); if (t > home) chip('MANY FANS LEFT AT HALF-TIME', 540, 820, t, home, { size: 32, bg: 'rgba(12,11,10,0.85)', fg: '#FFF' }); } }); });

VIS[5] = S(() => { const s1 = sw('shoo', 0.3), s2 = sw('shoo', 1.2, 1), fans = sw('brazilian', 2.0), app = sw('applauded', 2.8);
  return pscene(5, N, { dim: 0.2, k: [[s1, 'boom', 1], [s1 + 0.02, 'hit', 1.1], [s2, 'boom', 1.1], [s2 + 0.02, 'hit', 1.2], ...drop(app, 0.5)],
    parts: [{ from: 0, ph: 'bg02', a: [0.5, 0.45, 1.25], b: [0.5, 0.45, 1.45], badge: 'REAL PHOTO · BRAZIL 1–7 GERMANY, SECOND HALF' },
            { from: s2, ph: 'bg03', a: [0.45, 0.5, 1.3], b: [0.45, 0.5, 1.5], badge: 'REAL PHOTO · BRAZIL 1–7 GERMANY, SECOND HALF', flash: true },
            { from: fans, clip: 'mcrowd', a: [0.5, 0.5, 1.3], b: [0.5, 0.5, 1.4], badge: 'REAL FOOTAGE · FANS IN THE MINEIRÃO (CLUB MATCH)', flash: true }],
    x: (t) => { board(t, 0.1, 520, t > s2 ? "79'" : "69'", T, t > s2 ? '0–7' : '0–6', t > s2 ? s2 : s1, Object.assign({ label: 'SCHÜRRLE' }, TC));
      if (t < fans) { const P = framed(t, 'schurrle', 700, 760, 300, { b: [0.5, 0.35, 1.05], backdrop: false }); if (P) chip('ANDRÉ SCHÜRRLE', 850, 760, t, 0.3, { size: 22, bg: GOLD, fg: BG }); }
      if (t > app) { big(t, app, 'STANDING OVATION', { size: 90 }); lot(t, app + 0.1, 'eyes', 900, 1130, 140); } } }); });

VIS[6] = S(() => { const big1 = sw('biggest', 1.0);
  return pscene(6, N, { dim: 0.15, k: [[0.3, 'hit', 1], [big1, 'stamp', 1.1], [big1 + 0.05, 'ding', 0.9]],
    parts: [{ from: 0, ph: 'fan', a: [0.5, 0.35, 1.15], b: [0.5, 0.35, 1.3], badge: 'REAL PHOTO · GERMANY FAN, 2014 WORLD CUP' },
            { from: big1, ph: 'champs', a: [0.5, 0.45, 1.25], b: [0.5, 0.45, 1.4], badge: '5 DAYS LATER · GERMANY WIN THE WORLD CUP (REAL PHOTO)', flash: true }],
    x: (t) => { board(t, 0.1, 520, 'FULL TIME', T, '1–7', 0.1, Object.assign({ label: "OSCAR 90'" }, TC));
      if (t > big1) chip('BIGGEST WORLD CUP SEMI-FINAL WIN EVER', 540, 820, t, big1, { size: 30, bg: GOLD, fg: BG }); } }); });
