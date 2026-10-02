// Wiki Roulette #066 — Greenland shark (fact-photo special)
// photo coords: lead eye+parasite (0.58,0.47), snout (0.76,0.57) · eye closeup parasite (0.55,0.39) · deep: body (0.5,0.35)
// ice: shark head/mouth (0.5,0.45) · expl: shark (0.4,0.22)
const RW = (P, u, v, du) => Math.abs(P(u + du, v)[0] - P(u, v)[0]);
// 392 ± 120 years, dated in 2016 → born between ~1504 and ~1744; the USA was founded in 1776
function lifeline(t, tIn, y) {
  const lt = t - tIn; if (lt < 0) return; const a = clamp(lt / 0.3), X0 = 100, X1 = 980, Y0 = 1480, Y1 = 2030, X = (yr) => lerp(X0, X1, (yr - Y0) / (Y1 - Y0));
  g.save(); g.globalAlpha = a; panel(50, y - 150, 980, 290, 0.8);
  g.strokeStyle = 'rgba(255,255,255,0.35)'; g.lineWidth = 4; g.beginPath(); g.moveTo(X0, y); g.lineTo(X1, y); g.stroke();
  [1500, 1600, 1700, 1800, 1900, 2000].forEach((yr) => { g.fillStyle = 'rgba(255,255,255,0.5)'; g.fillRect(X(yr) - 1, y - 10, 3, 20); text(String(yr), X(yr), y + 56, 'mono', 28, '#B8B0A4', { align: 'center' }); });
  const p = easeOut((lt - 0.2) / 0.7); if (p > 0) { g.fillStyle = 'rgba(255,194,61,0.35)'; g.fillRect(X(1504), y - 22, (X(1744) - X(1504)) * p, 44); g.strokeStyle = GOLD; g.lineWidth = 3; g.strokeRect(X(1504), y - 22, (X(1744) - X(1504)) * p, 44); }
  if (lt > 0.8) text('BORN IN HERE', (X(1504) + X(1744)) / 2, y - 50, 'mono', 32, GOLD, { align: 'center', alpha: clamp((lt - 0.8) * 4) });
  if (lt > 1.2) { const k = clamp((lt - 1.2) * 4); g.globalAlpha = a * k; g.fillStyle = RED; g.fillRect(X(1776) - 3, y - 50, 6, 100); text('USA', X(1776) + 14, y - 62, 'mono', 32, RED); text('1776', X(1776) + 14, y - 28, 'mono', 26, RED); }
  if (lt > 0.4) { g.globalAlpha = a; g.fillStyle = TXT; g.beginPath(); g.arc(X(2016), y, 9, 0, 6.283); g.fill(); text('2016', X(2016), y - 50, 'mono', 30, TXT, { align: 'center' }); }
  g.restore();
}
VIS.open = (K) => { K(0.15, 'hit', 1.3); K(0.2, 'mute', 1, 0.4); K(1.8, 'thump', 0.8);
  return (t) => { const P = shot(t, 'lead', { a: [0.62, 0.5, 1.0], b: [0.64, 0.52, 1.1], dur: 2.5, anchor: [540, 1080] }); if (!P) noPhoto(t);
    tag(t); hook(t, EP.hook, 480); }; };
VIS[0] = (K) => { K(0.6, 'hit', 1.1); K(1.2, 'pop', 0.6); K(3.0, 'whoosh', 0.5); K(4.2, 'tick', 0.9);
  return (t) => { const P = shot(t, 'lead', { a: [0.6, 0.5, 1.05], b: [0.58, 0.47, 1.5], dur: 6, anchor: [540, 860] }); if (!P) noPhoto(t);
    tag(t, 0, 6); realBadge(t, 0.4);
    if (P && t < 3.0) { const [x, y] = P(0.58, 0.47); ring(t, 1.2, x, y, RW(P, 0.58, 0.47, 0.05)); callout(t, 1.8, [x, y + RW(P, 0.58, 0.47, 0.05)], 540, 1120, 'AGE READ FROM THE EYE LENS'); }
    fact(t, 0.6, '392 YEARS', 'GIVE OR TAKE 120 · CARBON-DATED'); lifeline(t, 3.0, 1000); }; };
VIS[1] = (K) => { K(0.5, 'whoosh', 0.6); K(1.0, 'hit', 1); K(2.2, 'tick', 0.8);
  return (t) => { const P = framed(t, 'deep', 40, 780, 1000, { a: [0.5, 0.4, 1.0], b: [0.5, 0.4, 1.06], dur: 5 }); if (!P) noPhoto(t);
    tag(t, 1, 6); realBadge(t, 0.4, 'REAL PHOTO · NOAA');
    fact2(t, 1.0, '1 CM', 'A YEAR.', 'ADULT AT AROUND 150 YEARS OLD'); }; };
VIS[2] = (K) => { K(0.5, 'whoosh', 0.6); K(1.0, 'hit', 1.2); K(2.0, 'pop', 0.7);
  return (t) => { const P = shot(t, 'ice', { a: [0.5, 0.5, 1.0], b: [0.47, 0.5, 1.12], dur: 4.5, anchor: [540, 930] }); if (!P) noPhoto(t);
    tag(t, 2, 6); realBadge(t, 0.4);
    if (P) callout(t, 2.0, P(0.45, 0.58), 540, 1140, 'THIS ONE: ABOUT 4 M');
    fact(t, 1.0, 'UP TO 6.4 M', 'AND OVER 1,000 KG'); }; };
VIS[3] = (K) => { K(0.5, 'whoosh', 0.6); K(1.0, 'hit', 1); K(1.8, 'pop', 0.7);
  return (t) => { const P = shot(t, 'eye', { a: [0.5, 0.42, 1.0], b: [0.55, 0.39, 1.25], dur: 4, anchor: [540, 900] }); if (!P) noPhoto(t);
    tag(t, 3, 6); realBadge(t, 0.4);
    if (P) { const [x, y] = P(0.55, 0.39); ring(t, 1.0, x, y, RW(P, 0.55, 0.39, 0.06)); callout(t, 1.8, [x, y + RW(P, 0.55, 0.39, 0.06)], 540, 1130, 'A PARASITE ON ITS EYE'); }
    fact2(t, 0.8, 'ALMOST', 'BLIND.'); }; };
VIS[4] = (K) => { K(0.5, 'whoosh', 0.6); K(1.0, 'hit', 0.9); K(1.6, 'pop', 0.8); K(2.1, 'pop', 0.8); K(2.6, 'hit', 1.1);
  return (t) => { const P = framed(t, 'expl', 40, 640, 1000, { a: [0.45, 0.4, 1.0], b: [0.42, 0.3, 1.18], dur: 4 }); if (!P) noPhoto(t);
    tag(t, 4, 6); realBadge(t, 0.4, 'REAL PHOTO · NOAA');
    fact(t, 0.6, 'IN ITS STOMACH:', null, { color: TXT, size: 120 });
    chip('REINDEER', 80, 1060, t, 1.6, { size: 44, align: 'left' }); chip('MOOSE', 450, 1060, t, 2.1, { size: 44, align: 'left' }); chip('POLAR BEAR', 80, 1160, t, 2.6, { size: 44, align: 'left', bg: RED, fg: TXT }); }; };
VIS[5] = (K) => { K(0.5, 'whoosh', 0.6); K(1.0, 'hit', 1.1); K(2.0, 'pop', 0.7);
  return (t) => { const P = shot(t, 'hakarl', { a: [0.5, 0.45, 1.0], b: [0.55, 0.45, 1.12], dur: 9, anchor: [540, 900] }); if (!P) noPhoto(t);
    tag(t, 5, 6); realBadge(t, 0.4, 'REAL PHOTO · ICELAND');
    fact2(t, 1.0, 'TOXIC MEAT.', 'HÁKARL.', 'FERMENTED, THEN HUNG TO DRY'); }; };
