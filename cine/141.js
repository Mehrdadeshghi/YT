// Wiki Roulette #141 — "Welcome to Hell": Galatasaray v Manchester United, 1993 Champions League (3–3, 0–0, out on away goals).
// UCL matchday special for Galatasaray v Barcelona (13 Oct 2026). Real photos: Old Trafford 1992, Ali Sami Yen, Galatasaray fans.
// Retention: frame-1 banner quote → stakes (English champions) → 2–0 then 3–3 twist → airport banner → the stadium → out →
// red card + chaos → tonight Barça in Istanbul → binary comment question.
const N = 7, TC = { c1: '#E6E8EC', c2: '#F2A900' };
const big = (t, at, s, o = {}) => { if (t < at) return; g.save(); g.translate(shake(t, at, o.sh ?? 14), 0); stampText(s, 540, o.y ?? 1020, t, at, { size: o.size ?? 110, rot: o.rot ?? -0.08 }); g.restore(); };
const drop = (at, len = 0.45) => [[Math.max(0.05, at - len), 'mute', 1, len], [at, 'boom', 1.2], [at + 0.02, 'hit', 1.3]];
const S = (f) => (K, Sc) => f()(K, Sc);
const redTint = (a) => { g.save(); g.globalAlpha = a; g.globalCompositeOperation = 'multiply'; g.fillStyle = '#FF5040'; g.fillRect(0, 0, W, H); g.restore(); };
// the banner's words on a cloth strip (a graphic, labelled as such)
function banner(t, tIn, y) { const lt = t - tIn; if (lt < 0) return; const s = spring(lt, 240, 14), wob = Math.sin(lt * 3) * 0.02;
  g.save(); g.translate(540, y); g.rotate(-0.05 + wob); g.scale(s, s); g.shadowColor = 'rgba(0,0,0,0.6)'; g.shadowBlur = 30;
  g.fillStyle = '#F4F1EA'; g.beginPath(); g.moveTo(-430, -90); for (let x = -430; x <= 430; x += 20) g.lineTo(x, -90 + Math.sin(x * 0.03 + lt * 4) * 6);
  for (let x = 430; x >= -430; x -= 20) g.lineTo(x, 90 + Math.sin(x * 0.03 + lt * 4 + 1) * 6); g.closePath(); g.fill(); g.shadowBlur = 0;
  text('WELCOME TO HELL', 0, 32, 'disp', 96, '#C8102E', { align: 'center' }); g.restore();
  chip('THE BANNER AT THE AIRPORT (GRAPHIC)', 540, y + 150, t, tIn + 0.2, { size: 22, bg: 'rgba(12,11,10,0.85)', fg: '#FFF' }); }

VIS.open = (K) => { K(0.05, 'hit', 1.3); K(0.3, 'boom', 1); K(sw('welcome', 1.8), 'stamp', 1.2);
  return (t) => { atmosphere(t); const P = shot(t, 'ultras', { a: [0.5, 0.5, 1.3], b: [0.5, 0.5, 1.5], dur: 3 }); if (!P) noPhoto(t); dimAll(0.4); redTint(0.25); tag(t);
    hook(t, EP.hook, 470); if (EP.series) chip(EP.series, 80, 710, t, -0.3, { size: 24, align: 'left', bg: GOLD, fg: BG });
    chip('ISTANBUL · 1993', 540, 870, t, 0.4, { size: 34, bg: '#C8102E', fg: '#FFF' }); lot(t, 0.5, 'fire', 900, 1130, 150); }; };

VIS[0] = S(() => { const ch = sw('champions', 1.0), ga = sw('galatasaray', 2.4);
  return pscene(0, N, { dim: 0.2, k: [[ch, 'whoosh', 0.6], [ga, 'stamp', 1]],
    parts: [{ from: 0, ph: 'strend', a: [0.5, 0.5, 1.3], b: [0.5, 0.5, 1.5], badge: 'REAL PHOTO · OLD TRAFFORD, 1992' },
            { from: ga, ph: 'gsfans', a: [0.5, 0.5, 1.3], b: [0.5, 0.5, 1.5], badge: 'REAL PHOTO · GALATASARAY FANS', flash: true }],
    x: (t) => { chip('CHAMPIONS LEAGUE · 1993', 540, 620, t, 0.3, { size: 32, bg: GOLD, fg: BG });
      if (t > ch && t < ga) chip('ENGLISH CHAMPIONS', 540, 820, t, ch, { size: 36, bg: '#C8102E', fg: '#FFF' }); } }); });

VIS[1] = S(() => { const two = sw('two', 1.0), three = sw('three', 2.0), ca = sw('cantona', 2.6), dr = sw('three', 3.3, 1);
  return pscene(1, N, { dim: 0.25, k: [[two, 'boom', 0.9], [three, 'boom', 1.1], [three + 0.02, 'hit', 1.2], ...drop(dr, 0.4)],
    parts: [{ from: 0, ph: 'ot92', a: [0.5, 0.5, 1.25], b: [0.5, 0.5, 1.45], badge: 'REAL PHOTO · OLD TRAFFORD, 1992' },
            { from: three, ph: 'strend', a: [0.4, 0.5, 1.5], b: [0.4, 0.5, 1.7], badge: 'REAL PHOTO · OLD TRAFFORD, 1992', flash: true },
            { from: ca, ph: 'cantona', a: [0.5, 0.35, 1.3], b: [0.5, 0.3, 1.5], badge: 'REAL PHOTO · ERIC CANTONA AT OLD TRAFFORD (2011)', flash: true }],
    x: (t) => { board(t, 0.1, 520, 'FIRST LEG', ['MAN UTD', 'GALATASARAY'], t > dr ? '3–3' : t > three ? '2–3' : t > two ? '2–0' : '0–0', t > dr ? dr : t > three ? three : t > two ? two : null, Object.assign({ label: 'OLD TRAFFORD' }, TC));
      if (t > three && t < ca) lot(t, three + 0.05, 'mindblown', 880, 1130, 140); if (t > dr) chip("CANTONA 81'", 540, 820, t, dr, { size: 36, bg: GOLD, fg: BG }); } }); });

VIS[2] = S(() => { const air = sw('airport', 1.0), wel = sw('welcome', 2.0);
  return pscene(2, N, { dim: 0.35, k: [[air, 'whoosh', 0.6], ...drop(wel, 0.5)],
    parts: [{ from: 0, ph: 'ultras', a: [0.5, 0.5, 1.4], b: [0.5, 0.5, 1.6], badge: 'REAL PHOTO · GALATASARAY FANS (ULTRASLAN)' }],
    x: (t) => { if (t > air && t < wel) chip('HUNDREDS OF FANS AT THE AIRPORT', 540, 640, t, air, { size: 30, bg: GOLD, fg: BG });
      if (t > wel) { redTint(0.25 * clamp((t - wel) / 0.3)); banner(t, wel, 860); lot(t, wel + 0.2, 'scream', 900, 1150, 140); } } }); });

VIS[3] = S(() => { const to = sw('torches', 0.6), dr = sw('drums', 1.0), sm = sw('smoke', 1.4), he = sw('hell', 2.4);
  return pscene(3, N, { dim: 0.2, k: [[to, 'thump', 1], [dr, 'thump', 1.1], [sm, 'thump', 1.2], ...drop(he, 0.45)],
    parts: [{ from: 0, ph: 'asy06', a: [0.5, 0.5, 1.3], b: [0.5, 0.5, 1.5], badge: 'REAL PHOTO · ALI SAMI YEN STADIUM, 2006' },
            { from: sm, ph: 'sahne', a: [0.5, 0.5, 1.2], b: [0.5, 0.5, 1.4], badge: 'REAL PHOTO · ALI SAMI YEN STADIUM, 2007', flash: true },
            { from: he, ph: 'hell', a: [0.5, 0.5, 1.2], b: [0.5, 0.5, 1.4], badge: 'REAL PHOTO · ALI SAMI YEN — "HELL"', flash: true }],
    x: (t) => { [[to, 'TORCHES'], [dr, 'DRUMS'], [sm, 'SMOKE']].forEach(([a, s], k) => { if (t > a && t < he) chip(s, 540, 640 + k * 90, t, a, { size: 40, bg: k === 2 ? '#C8102E' : GOLD, fg: k === 2 ? '#FFF' : BG }); });
      if (t > he) { redTint(0.3 * clamp((t - he) / 0.3)); big(t, he, 'HELL', { size: 190, y: 900 }); lot(t, he + 0.1, 'fire', 880, 1130, 150); } } }); });

VIS[4] = S(() => { const aw = sw('away', 1.2), out = sw('out', 2.2);
  return pscene(4, N, { dim: 0.25, k: [[0.3, 'tick', 1], [aw, 'stamp', 1], ...drop(out, 0.4)],
    parts: [{ from: 0, ph: 'gsfb', a: [0.5, 0.5, 1.6], b: [0.45, 0.5, 1.9], badge: 'REAL PHOTO · GALATASARAY FANS' }],
    x: (t) => { board(t, 0.1, 520, 'FULL TIME', ['GALATASARAY', 'MAN UTD'], '0–0', null, Object.assign({ label: 'ISTANBUL · SECOND LEG' }, { c1: '#F2A900', c2: '#E6E8EC' }));
      if (t > aw) chip('3–3 ON AGGREGATE · AWAY GOALS', 540, 800, t, aw, { size: 30, bg: GOLD, fg: BG });
      if (t > out) { big(t, out, 'UNITED OUT!', { size: 110, y: 960 }); lot(t, out + 0.1, 'flushed', 880, 1150, 140); } } }); });

VIS[5] = S(() => { const se = sw('sent', 1.0), ro = sw('robson', 2.6), sh = sw('shield', 3.4);
  return pscene(5, N, { dim: 0.25, k: [[se, 'whoosh', 0.5], [se + 0.1, 'stamp', 1.1], [ro, 'whoosh', 0.5], [sh, 'crack', 1.1], [sh + 0.02, 'thump', 1.1]],
    parts: [{ from: 0, ph: 'cantona', a: [0.5, 0.35, 1.4], b: [0.5, 0.3, 1.6], badge: 'REAL PHOTO · ERIC CANTONA (2011)' },
            { from: ro, ph: 'asy06', a: [0.5, 0.5, 1.5], b: [0.5, 0.5, 1.7], badge: 'REAL PHOTO · ALI SAMI YEN STADIUM, 2006', flash: true }],
    x: (t) => { if (t > se && t < ro) { redCard(t, se, 820, 760, 0.8); big(t, se + 0.05, 'SENT OFF!', { size: 110, y: 980 }); }
      if (t > ro) { framed(t - ro, 'robson', 300, 560, 300, { b: [0.5, 0.4, 1.06] }); chip('BRYAN ROBSON (1992)', 450, 1150, t, ro + 0.1, { size: 22, bg: GOLD, fg: BG }); }
      if (t > sh) { chip('HIT BY A POLICE RIOT SHIELD', 540, 1260, t, sh, { size: 30, bg: '#C8102E', fg: '#FFF' }); lot(t, sh + 0.1, 'skull', 860, 760, 150); } } }); });

VIS[6] = S(() => { const ba = sw('barcelona', 0.6);
  return pscene(6, N, { dim: 0.2, k: [[ba, 'stamp', 1.1], [ba + 0.05, 'ding', 0.9]],
    parts: [{ from: 0, ph: 'rams', a: [0.5, 0.5, 1.3], b: [0.5, 0.5, 1.45], badge: "REAL PHOTO · GALATASARAY'S STADIUM TODAY (2022)" }],
    x: (t) => { chip('TONIGHT', 540, 640, t, 0.2, { size: 36, bg: '#C8102E', fg: '#FFF' }); if (t > ba) big(t, ba, 'GALATASARAY v BARÇA', { size: 72, y: 780, sh: 6 }); } }); });
