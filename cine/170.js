// Wiki Roulette #170 — OCEAN: lion's mane jellyfish. Frame 1 = real footage (CC0) + "LONGER THAN A BLUE WHALE." →
// drawn to scale: blue whale (up to 98 ft) vs the 1865 record (bell 7 ft, tentacles ~120 ft; "some scientists doubt it") →
// real photo, tentacle cloud: ~1,200 tentacles → real photo: three moon jellies caught by one → real photo + day counter: a torn-off
// tentacle stings for up to 25 days → real beached specimen + 150 people icons (Rye, New Hampshire, 2010) → binary question.
const N170 = 4, SEA170 = ['#0B3A55', '#020B14'], MANE170 = '#F29A3A', WHALE170 = '#6F8FA8';
const STRANDS170 = (() => { const r = rng(170), s = []; for (let i = 0; i < 46; i++) s.push([r() * 2 - 1, r() * 6.283, 0.6 + r() * 0.5]); return s; })();
const ill170 = (t, y = 1440) => text('ILLUSTRATION', 1000, y, 'mono', 22, 'rgba(255,255,255,0.55)', { ls: 3, align: 'right' });

function sea170(t) { const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, SEA170[0]); gr.addColorStop(1, SEA170[1]); g.fillStyle = gr; g.fillRect(0, 0, W, H);
  g.save(); g.globalAlpha = 0.07; g.fillStyle = '#BFE6FF'; for (let k = 0; k < 5; k++) { g.beginPath(); g.moveTo(150 + k * 220 + Math.sin(t + k) * 30, 0); g.lineTo(220 + k * 220, 0); g.lineTo(80 + k * 260, H); g.lineTo(-40 + k * 260, H); g.fill(); } g.restore(); }

// side view of a blue whale, nose at x, length L px
function whale170(x, y, L, t) { g.save(); g.translate(x, y); const h = L * 0.085, sw = Math.sin(t * 1.4) * h * 0.25;
  g.fillStyle = WHALE170; g.beginPath(); g.moveTo(0, 0);
  g.bezierCurveTo(L * 0.05, -h, L * 0.4, -h * 1.05, L * 0.75, -h * 0.45); g.lineTo(L * 0.93, -h * 0.12 + sw * 0.3);
  g.lineTo(L, -h * 0.75 + sw); g.lineTo(L * 0.97, sw * 0.4); g.lineTo(L, h * 0.65 + sw); g.lineTo(L * 0.93, h * 0.12 + sw * 0.3);
  g.lineTo(L * 0.75, h * 0.4); g.bezierCurveTo(L * 0.4, h * 0.95, L * 0.06, h * 0.9, 0, 0); g.fill();
  g.strokeStyle = 'rgba(255,255,255,0.25)'; g.lineWidth = 3; for (let k = 0; k < 6; k++) { g.beginPath(); g.moveTo(L * 0.04 + k * 6, h * 0.3 + k * 4); g.lineTo(L * 0.3, h * 0.55 + k * 4); g.stroke(); }
  g.fillStyle = '#10202C'; g.beginPath(); g.arc(L * 0.09, -h * 0.12, 5, 0, 6.283); g.fill(); g.restore(); }

// lion's mane seen from the side: bell (radius R) at (x, y), tentacles trailing to the right over len px (grow p 0..1)
function mane170(x, y, R, len, p, t) { g.save(); g.lineCap = 'round';
  STRANDS170.forEach(([dy, ph, a]) => { g.strokeStyle = `rgba(255,214,160,${0.28 * a + 0.12})`; g.lineWidth = 2 + a * 1.5; g.beginPath(); g.moveTo(x, y + dy * R * 0.6);
    const L = len * p * (0.82 + 0.18 * a); for (let k = 1; k <= 24; k++) { const u = k / 24; g.lineTo(x + L * u, y + dy * R * 0.6 + Math.sin(t * 1.6 + ph + u * 7) * (8 + 26 * u) + dy * 40 * u); } g.stroke(); });
  const bg = g.createRadialGradient(x - R * 0.2, y - R * 0.2, 4, x, y, R); bg.addColorStop(0, '#FFC27A'); bg.addColorStop(1, MANE170);
  g.fillStyle = bg; g.beginPath(); g.ellipse(x, y, R * 0.55, R, 0, Math.PI * 0.5, Math.PI * 1.5); g.closePath(); g.fill();
  g.restore(); }

// ---------- scenes ----------
VIS.open = vopen({ clip: 'swim', a: [0.5, 0.5, 1.0], b: [0.5, 0.48, 1.12], foot: 'REAL FOOTAGE · LION\'S MANE JELLYFISH',
  x: (t) => { const wh = sw('whale', 1.6); if (t > wh) stampText('120 FT', 790, 1330, t, wh, { size: 96, rot: -0.08, color: GOLD }); } });

VIS[0] = S(() => { const rec = sw('massachusetts', 1.4), se = sw('bell', 2.6), hu = sw('tentacles', 4.0);
  return (K) => { ks(K, [[0.1, 'whoosh', 0.8], [rec, 'hit', 1], [se, 'pop', 0.9], [hu, 'whoosh', 1], [hu + 0.9, 'hit', 1.1]]);
    return (t) => { sea170(t); const px = 900 / 120, x0 = 90;                      // 900 px = 120 ft
      // the whale (98 ft) on top, drawn in from the start
      whale170(x0, 780, 98 * px * easeOut(clamp(t / 0.7)), t);
      if (t > 0.5) ruler(t, 0.5, x0, 900, 98 * px, 'BLUE WHALE: UP TO 98 FT', { size: 32, color: '#9EC9E8' });
      // the record jellyfish under it; tentacles grow to 120 ft on "hundred"
      const tp = t < hu ? 0.18 : lerp(0.18, 1, easeOut(clamp((t - hu) / 0.9)));
      mane170(x0 + 30, 1170, 70, 120 * px - 30, tp, t);
      if (t > se) chip('BELL: 7 FT', x0 + 40, 1040, t, se, { size: 32, align: 'left', bg: MANE170, fg: BG });
      if (t > hu + 0.9) ruler(t, hu + 0.9, x0, 1330, 120 * px, 'TENTACLES: ~120 FT', { size: 34 });
      tag(t, 0, N170);
      if (t > rec) { chip('RECORD · 1865 · MASSACHUSETTS', 540, 470, t, rec, { size: 38, bg: GOLD, fg: BG }); }
      if (t > hu + 1.2) text('SOME SCIENTISTS DOUBT THIS RECORD', 80, 1410, 'mono', 22, 'rgba(255,255,255,0.6)', { ls: 2 });
      text('DRAWN TO SCALE · ILLUSTRATION', 1000, 1490, 'mono', 22, 'rgba(255,255,255,0.55)', { ls: 3, align: 'right' }); }; }; });

VIS[1] = S(() => { const tw = sw('tentacles', 1.6), ot = sw('other', 3.6);
  return (K) => { ks(K, [[0.1, 'whoosh', 0.8], [tw, 'hit', 1.1], [ot - 0.05, 'whoosh', 1], [ot + 0.2, 'ding', 1]]);
    return (t) => { atmosphere(t); tag(t, 1, N170);
      if (t < ot) { const P = shot(t, 'fjord', { box: [40, 690, 1000, 760], a: [0.42, 0.5, 1.05], b: [0.5, 0.52, 1.35], dur: 4 }); if (!P) noPhoto(t);
        realBadge(t, 0.3, 'REAL PHOTO · LION\'S MANE, SWEDEN');
        if (t > tw) fact2(t, tw, '~1,200', 'TENTACLES', null, { y: 470, size: 110 });
        if (P && t > tw) { const [x, y] = P(0.55, 0.62); ring(t, tw + 0.2, x, y, 200, { spot: false }); } }
      else { const P = shot(t, 'moon', { box: [40, 690, 1000, 760], a: [0.6, 0.55, 1.0], b: [0.66, 0.6, 1.15], dur: 2.5, t0: ot }); if (!P) noPhoto(t);
        realBadge(t, ot, 'REAL PHOTO · 3 MOON JELLIES CAUGHT BY ONE');
        fact2(t, ot + 0.1, 'IT EATS', 'OTHER JELLYFISH', null, { y: 470, size: 100 });
        if (P) { const [x, y] = P(0.62, 0.72); callout(t, ot + 0.4, [x, y], 300, 1380, 'LION\'S MANE', { bg: MANE170 }); } } }; }; });

VIS[2] = S(() => { const tw = sw('days', 2.6);
  return vscene(2, N170, { ph: 'under', o: { box: [40, 690, 1000, 760] }, a: [0.5, 0.4, 1.1], b: [0.52, 0.42, 1.4], badge: 'REAL PHOTO · LION\'S MANE, SHALLOW WATER',
    k: [[0.3, 'swish', 0.8], [tw, 'hit', 1.1]],
    x: (t) => { fact2(t, 0.25, 'TORN OFF.', 'STILL STINGS.', null, { y: 470, size: 110 });
      const d = Math.round(25 * easeOut(clamp((t - 0.6) / Math.max(0.5, tw - 0.6))));
      if (t > 0.6) { panel(560, 1250, 420, 170); text(`DAY ${d}`, 770, 1362, 'disp', 84, d >= 25 ? GOLD : TXT, { align: 'center' }); } } }); });

VIS[3] = S(() => { const fi = sw('stung', 2.4), si = sw('single', 4.2);
  return (K) => { ks(K, [[0.1, 'whoosh', 0.8], [fi, 'hit', 1.1], [si, 'thump', 1]]);
    return (t) => { atmosphere(t); tag(t, 3, N170);
      const P = shot(t, 'beach', { box: [40, 690, 1000, 760], a: [0.5, 0.62, 1.05], b: [0.5, 0.66, 1.3], dur: 6 }); if (!P) noPhoto(t);
      realBadge(t, 0.3, 'REAL PHOTO · LION\'S MANE WASHED UP (DENMARK)');
      chip('RYE, NEW HAMPSHIRE · 2010', 540, 470, t, 0.3, { size: 38, bg: GOLD, fg: BG });
      // 150 people icons fill in up to "fifty"
      const n = Math.round(150 * easeOut(clamp((t - 0.5) / Math.max(0.5, fi - 0.5))));
      panel(60, 520, 960, 150); for (let i = 0; i < 150; i++) { const cx = 95 + (i % 30) * 30.5, cy = 560 + Math.floor(i / 30) * 22;
        g.fillStyle = i < n ? RED : 'rgba(255,255,255,0.18)'; g.beginPath(); g.arc(cx, cy - 5, 4, 0, 6.283); g.fill(); g.fillRect(cx - 4, cy, 8, 9); }
      if (t > fi) rgbPop('~150 STUNG', 540, 1300, 92, TXT, t, fi, { align: 'center' });
      if (P && t > si) { const [x, y] = P(0.58, 0.62); ring(t, si, x, y, 230, { spot: false, color: RED }); chip('PROBABLY ONE JELLYFISH', 540, 1400, t, si + 0.15, { size: 34, bg: RED, fg: '#FFF' }); } }; }; });
