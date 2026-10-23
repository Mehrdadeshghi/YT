// Wiki Roulette — "WHY?" series kit (everyday why-questions). ep.scripts: ["tech.js", "why.js"], ep.facts: true.
// Frame 1 = WHY? badge + the question (+ usually a real-photo comparison); every answer scene = "REASON n" chip + one big title line;
// the CTA scene adds "your next why" (viewers comment the next question → series engagement loop). All names start with "why".

// the gold WHY? badge (top left by default); s = scale. Springs in at tIn, then breathes slightly
function whyBadge(t, tIn, x = 80, y = 350, s = 1) {
  const lt = t - tIn, k = spring(lt, 320, 16); if (k <= 0.001) return;
  const w = 330 * s, h = 150 * s, wob = Math.sin(lt * 2.4) * 0.02 * (lt > 0.4);
  g.save(); g.translate(x + w / 2, y + h / 2); g.rotate(-0.05 + wob); g.scale(k, k);
  g.shadowColor = 'rgba(0,0,0,0.55)'; g.shadowBlur = 30; rrect(-w / 2, -h / 2, w, h, 26 * s); g.fillStyle = GOLD; g.fill(); g.shadowBlur = 0;
  const fs = fit('WHY?', 'disp', 116 * s, w - 56 * s); text('WHY?', 0, fs * 0.36, 'disp', fs, BG, { align: 'center' }); g.restore();
}
// the question, stacked big (last line gold); words rise in. Returns the y of the last baseline
function whyQ(t, tIn, lines, y = 640, o = {}) {
  const sz = Math.min(...lines.map((l) => fit(l, 'disp', o.size || 112, o.maxW || 920)));
  lines.forEach((l, i) => rise(l, 80, y + i * sz * 1.05, 'disp', sz, i === lines.length - 1 ? GOLD : TXT, t, tIn + i * 0.12, { stagger: 0.04 }));
  return y + (lines.length - 1) * sz * 1.05;
}
// answer header: "REASON n" chip, then the reason as one big line (gold). n = null → title only
function whyReason(t, tIn, n, title, o = {}) {
  const y = o.y ?? 440;
  if (n != null) chip(`REASON ${n}`, 80, y, t, tIn, { size: 34, align: 'left', bg: TXT, fg: BG });
  const sz = fit(title, 'disp', o.size || 120, o.maxW || 920);
  rgbPop(title, 80, y + (n != null ? 140 : 80), sz, o.color || GOLD, t, tIn + 0.15);
}
// two real photos as a comparison: A = {id, label, at, a, b, clip, credit}, same for B. Stacked rows filling y0..y1,
// or o.cols: two columns side by side (the "this vs this" hook frame). Returns [PA, PB]
function whyPair(t, A, B, y0 = 690, y1 = 1450, o = {}) {
  const gap = o.gap ?? 20, cols = !!o.cols, h = cols ? y1 - y0 : (y1 - y0 - gap) / 2, w = cols ? (1000 - gap) / 2 : 1000;
  return [[A, 0], [B, 1]].map(([s, k]) => {
    const x = cols ? 40 + k * (w + gap) : 40, y = cols ? y0 : y0 + k * (h + gap), cr = s.credit ?? (CREDITS[s.id] || '').slice(0, cols ? 40 : 64);
    const opt = { box: [x, y, w, h], a: s.a || [0.5, 0.5, 1.0], b: s.b || s.a || [0.5, 0.5, 1.08], dur: s.dur || 5, backdrop: s.backdrop ?? (k === 0), credit: cr };
    const P = s.clip ? clip(t, s.id, opt) : shot(t, s.id, opt);
    if (!P) { g.save(); rrect(x, y, w, h, 30); g.fillStyle = 'rgba(255,255,255,0.06)'; g.fill(); g.restore(); }
    if (s.label && t > (s.at ?? 0)) chip(s.label, x + 30, y + 46, t, s.at ?? 0, { size: 28, align: 'left', bg: s.bg || GOLD, fg: s.fg || BG });
    if (s.real !== false) text(s.clip ? '▶ REAL FOOTAGE' : '● REAL PHOTO', x + w - 30, cols ? y + h - 56 : y + 50, 'mono', 22, 'rgba(255,255,255,0.85)', { ls: 2, align: 'right', shadow: true });
    return P; });
}
// end of the CTA: invite the next why-question (sits just above the comment card)
function whyNext(t, tIn, str = (EP_RAW.why && EP_RAW.why.next) || 'YOUR NEXT WHY? COMMENT IT', y = 1330) {
  if (t < tIn) return; const p = 1 + 0.04 * Math.sin((t - tIn) * 5) * (t - tIn > 0.5);
  g.save(); g.translate(540, y); g.scale(p, p); chip(str, 0, 0, t, tIn, { size: 30, bg: GOLD, fg: BG }); g.restore();
}
