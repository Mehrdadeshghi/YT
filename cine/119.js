// Body Facts #1 (#119) — CPR: the song that can save a life. Motion graphics (tech.js + med.js).
const N = 6, BPM = 104;
function vinyl(x, y, r, t, a = 1) { g.save(); g.globalAlpha *= a; g.translate(x, y); g.rotate(t * 3.5); g.fillStyle = '#111'; g.beginPath(); g.arc(0, 0, r, 0, 6.283); g.fill();
  g.strokeStyle = 'rgba(255,255,255,0.08)'; g.lineWidth = 2; for (let k = 0.4; k < 1; k += 0.06) { g.beginPath(); g.arc(0, 0, r * k, 0, 6.283); g.stroke(); }
  g.fillStyle = GOLD; g.beginPath(); g.arc(0, 0, r * 0.3, 0, 6.283); g.fill(); g.fillStyle = '#111'; g.beginPath(); g.arc(0, 0, r * 0.04, 0, 6.283); g.fill();
  g.fillStyle = 'rgba(255,255,255,0.12)'; g.beginPath(); g.moveTo(0, 0); g.arc(0, 0, r, -0.4, 0.1); g.closePath(); g.fill(); g.restore(); }
function disco(t, a = 1) { for (let k = 0; k < 10; k++) { const an = t * 0.8 + k * 0.63; g.save(); g.globalAlpha = a * 0.16; g.fillStyle = [MG, CY, GOLD, LIME][k % 4];
  g.beginPath(); g.moveTo(540, -50); g.lineTo(540 + Math.cos(an) * 1400, 1400); g.lineTo(540 + Math.cos(an + 0.12) * 1400, 1400); g.closePath(); g.fill(); g.restore(); } }
function beatTicks(K, t0, t1, bpm = BPM, g0 = 0.35) { for (let t = t0; t < t1; t += 60 / bpm) K(t, 'tick', g0); }

VIS.open = (K) => { const sa = sw('save', 1.6); K(0.05, 'hit', 1.2); beatTicks(K, 0.2, 3.0); ks(K, drop(sa, 0.35));
  return (t) => { bodyBg(t, '#120614', '#2A0A2E'); disco(t, 0.9); vinyl(540, 1010, 260, t); heart(540, 1010, 1.05, beatAt(t, BPM));
    ecgTrace(80, 1000, 1230, t, BPM, LIME, 60);
    if (t > sa) rgbText('SAVE A LIFE', 540, 760, 120, t, sa, { color: MRED });
    tag(t); hook(t, EP.hook, 400); if (EP.series) chip(EP.series, 80, 300, t, -0.3, { size: 26, align: 'left', bg: MRED, fg: '#FFF' }); }; };

VIS[0] = S(() => { const st = sw('stops', 0.9), mi = sw('minute', 1.9), su = sw('survive', 5.0);
  return (K) => { beatTicks(K, 0.1, st); ks(K, [[st, 'wrong', 1.1], [mi, 'tick', 1], [su, 'stamp', 1]]);
    return (t) => { bodyBg(t, '#08060C', '#1E0A14'); tag(t, 0, N); const dead = t > st;
      heart(540, 820, 1.1, dead ? 0 : beatAt(t, 72), dead ? '#5A3A44' : MRED, dead ? 0.2 : 1); ecgTrace(80, 1000, 1120, t, 72, dead ? RED2 : LIME, 80, dead ? clamp((t - st) / 0.3) : 0);
      if (dead && Math.floor(t * 3) % 2) { g.fillStyle = 'rgba(255,40,60,0.10)'; g.fillRect(0, 0, W, H); }
      if (t > mi) { const sec = Math.floor((t - mi) * 12) % 60; rgbText(`00:${String(sec).padStart(2, '0')}`, 540, 470, 120, t, mi, { color: '#FFFFFF' }); chip('EVERY MINUTE COUNTS', 540, 560, t, mi, { size: 32, bg: RED2, fg: '#FFF' }); }
      if (t > su) chip('USA: ONLY ~1 IN 10 SURVIVES OUTSIDE A HOSPITAL', 540, 650, t, su, { size: 26, bg: 'rgba(255,255,255,0.9)', fg: BG }); }; }; });

VIS[1] = S(() => { const cp = sw('cpr', 0.5), dbl = sw('double', 1.4), tr = sw('triple', 2.2);
  return (K) => { ks(K, [[cp, 'whoosh', 0.8], [dbl, 'pop', 0.9, 600], ...drop(tr, 0.35)]);
    return (t) => { bodyBg(t); tag(t, 1, N); const bars = [['NO CPR', 1, 0.1], ['CPR', 2, dbl], ['CPR', 3, tr]];
      bars.forEach(([lab, v, at], k) => { if (t < at) return; const p = mE((t - at) / 0.5), h = 150 * v * p, x = 240 + k * 300;
        g.save(); g.fillStyle = k ? LIME : '#6F7E99'; g.shadowColor = g.fillStyle; g.shadowBlur = k ? 30 : 0; rrect(x - 90, 1100 - h, 180, h, 16); g.fill(); g.restore();
        text(k ? `×${v}` : '×1', x, 1080 - h, 'disp', 70, k ? LIME : '#9FB3CF', { align: 'center' }); text(lab, x, 1150, 'mono', 26, '#9FB3CF', { align: 'center' }); });
      rgbText(t > tr ? 'UP TO 3× THE CHANCE' : 'CPR RIGHT AWAY', 540, 470, 96, t, t > tr ? tr : cp, { color: t > tr ? LIME : '#FFFFFF' }); chip('SOURCE: AMERICAN HEART ASSOCIATION', 540, 560, t, cp + 0.2, { size: 24, bg: 'rgba(255,255,255,0.85)', fg: BG }); }; }; });

VIS[2] = S(() => { const ca = sw('call', 0.7), em = sw('emergency', 1.0), mi = sw('middle', 3.2);
  return (K) => { ks(K, [[ca, 'beep', 1], [ca + 0.25, 'beep', 1], [mi, 'ding', 1]]);
    return (t) => { if (t > mi + 0.7) { const P = shot(t, 'cpr', { a: [0.5, 0.45, 1.1], b: [0.5, 0.45, 1.25], dur: 2, t0: mi + 0.7 }); if (!P) noPhoto(t); tag(t, 2, N); realBadge(t, mi + 0.75, 'REAL PHOTO · CPR TRAINING ON A MANIKIN'); return; }
      bodyBg(t, '#06101E', '#102A46'); tag(t, 2, N); lyingBody(560, 1150, 1.0);
      if (t > ca && t < mi) { phoneFrame(860, 720, 0.42, () => { g.fillStyle = '#0B2A1A'; g.fillRect(-190, -380, 380, 760); text('112 · 911', 0, -40, 'disp', 64, LIME, { align: 'center' }); text('calling…', 0, 40, 'ui', 34, '#FFFFFF', { align: 'center' }); }); rgbText('1. CALL FOR HELP', 540, 450, 96, t, ca, { color: LIME }); }
      if (t > mi) { const p = 0.5 + 0.5 * Math.sin(t * 8); g.save(); g.strokeStyle = GOLD; g.lineWidth = 8; g.shadowColor = GOLD; g.shadowBlur = 30; g.beginPath(); g.arc(500, 1040, 70 + p * 20, 0, 6.283); g.stroke(); g.restore();
        cprArms(500, 1040, 1.0, 0); rgbText('2. MIDDLE OF THE CHEST', 540, 450, 86, t, mi, { color: GOLD }); } }; }; });

VIS[3] = S(() => { const ha = sw('hard', 0.4), fi = sw('five', 1.2), fa = sw('fast', 2.2), hu = sw('hundred', 2.6);
  return (K) => { ks(K, [[ha, 'boom', 0.7], [fi, 'ding', 0.8]]); beatTicks(K, fa, fa + 4, 110, 0.45);
    return (t) => { bodyBg(t); tag(t, 3, N); const ph = t > fa ? (t * 110 / 60) % 1 : (t * 0.7) % 1, p = ph < 0.5 ? mE(ph * 2) : 1 - mE((ph - 0.5) * 2);
      lyingBody(560, 1150, 1.0); cprArms(500, 1040, 1.0, p);
      if (t > fi) { g.save(); g.strokeStyle = LIME; g.lineWidth = 5; g.beginPath(); g.moveTo(660, 980); g.lineTo(660, 1040); g.moveTo(640, 980); g.lineTo(680, 980); g.moveTo(640, 1040); g.lineTo(680, 1040); g.stroke(); g.restore(); text('~5 CM', 700, 1025, 'disp', 44, LIME); }
      if (t > hu) { const v = Math.round(100 + 20 * (0.5 + 0.5 * Math.sin(t * 3))); rgbText('100–120 / MIN', 540, 470, 110, t, hu, { color: GOLD }); chip(`PUSHES PER MINUTE · ${v}`, 540, 560, t, hu + 0.2, { size: 30, bg: GOLD, fg: BG }); }
      else if (t > ha) rgbText('PUSH HARD', 540, 470, 120, t, ha, { color: '#FFFFFF' }); }; }; });

VIS[4] = S(() => { const st = sw('stayin', 0.6), bg = sw('bee', 1.4), hu = sw('hundred', 2.6);
  return (K) => { ks(K, [...drop(st, 0.35)]); beatTicks(K, st, st + 4.5, BPM, 0.5);
    return (t) => { bodyBg(t, '#120614', '#2A0A2E'); disco(t, 1); tag(t, 4, N); vinyl(780, 1020, 170, t); heart(780, 1020, 0.55, beatAt(t, BPM));
      if (t > bg) { framed(t, 'beegees', 90, 760, 380, { b: [0.5, 0.4, 1.05], backdrop: false }); realBadge(t, bg, 'REAL PHOTO · THE BEE GEES, 1977', 720); }
      if (t > st) rgbText("STAYIN' ALIVE", 540, 470, 110, t, st, { color: MG, jitter: true });
      if (t > hu) { const b = beatAt(t, BPM); g.save(); g.translate(540, 600); g.scale(1 + 0.08 * b, 1 + 0.08 * b); chip('≈ 104 BEATS PER MINUTE', 0, 0, t, hu, { size: 40, bg: LIME, fg: BG }); g.restore(); } }; }; });

VIS[5] = S(() => { const ke = sw('keep', 0.3), he = sw('help', 1.6), co = sw('course', 4.0);
  return (K) => { beatTicks(K, ke, he + 1.5, 110, 0.4); ks(K, [[he, 'whoosh', 0.8], [co, 'ding', 1]]);
    return (t) => { if (t > co) { const P = shot(t, 'iss', { a: [0.5, 0.4, 1.1], b: [0.5, 0.4, 1.2], dur: 2, t0: co }); if (!P) noPhoto(t); tag(t, 5, N); realBadge(t, co + 0.05, 'REAL PHOTO · EVEN ASTRONAUTS TRAIN CPR (ISS, 2018)'); rgbText('LEARN IT', 540, 560, 120, t, co, { color: LIME }); medNote(t, co + 0.4, 650); return; }
      bodyBg(t); tag(t, 5, N); const ph = (t * 110 / 60) % 1, p = ph < 0.5 ? mE(ph * 2) : 1 - mE((ph - 0.5) * 2); lyingBody(560, 1150, 1.0); cprArms(500, 1040, 1.0, p);
      if (t > he) { const f = Math.floor(t * 4) % 2; g.fillStyle = f ? 'rgba(62,123,255,0.18)' : 'rgba(255,59,78,0.18)'; g.fillRect(0, 0, W, H); chip('HELP IS COMING', 540, 560, t, he, { size: 36, bg: '#3E7BFF', fg: '#FFF' }); }
      rgbText("DON'T STOP", 540, 470, 120, t, ke, { color: GOLD }); }; }; });
