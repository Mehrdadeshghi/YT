// Wiki Roulette #182 — OCEAN: mimic octopus (Thaumoctopus mimicus). Frame 1 = real close-up + "one octopus, 18 disguises" with the disguises
// flicking through → real photo, Lembeh Strait (Sulawesi), discovered 1998 → lionfish vs. octopus with arms spread (two real photos) →
// sea snake: real banded sea krait + drawn burrow where 6 arms hide, 2 stay out and the damselfish flee (illustration) →
// real footage of it swimming with all 8 arms trailed behind, ~500 flatfish disguises in 5 days → question.
const N182 = 4, SAND182 = '#C8A86B', DAMSEL182 = '#FFD23F';

const lab182 = (str, y = 1590) => text(str, 1000, y, 'mono', 22, 'rgba(255,255,255,0.55)', { ls: 3, align: 'right' });
function shade182(y0, y1, a) { const gr = g.createLinearGradient(0, y0, 0, y1); gr.addColorStop(0, `rgba(0,0,0,${a})`); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(0, y0, W, y1 - y0); }
function boxTag182(str, x, y, col = TXT) { g.save(); g.font = '600 30px "JetBrains Mono", monospace'; const w = g.measureText(str).width + 36;
  g.fillStyle = 'rgba(6,10,14,0.78)'; rrect(x, y - 34, w, 50, 12); g.fill(); g.restore(); text(str, x + 18, y, 'mono', 30, col, { ls: 2 }); }
// a banded arm (white with dark rings) from (x0,y0) along angle a, length L, wiggling like a snake
function arm182(t, x0, y0, a, L, wig, wd = 30) { const n = 40, pts = [];
  for (let k = 0; k <= n; k++) { const s = k / n, off = Math.sin(t * 5 - s * 7) * wig * s; pts.push([x0 + Math.cos(a) * L * s - Math.sin(a) * off, y0 + Math.sin(a) * L * s + Math.cos(a) * off]); }
  g.save(); g.lineCap = 'round';
  for (let k = 0; k < n; k++) { g.strokeStyle = Math.floor(k / 3) % 2 ? '#1A1410' : '#F1E9DA'; g.lineWidth = wd * (1 - 0.6 * k / n);
    g.beginPath(); g.moveTo(...pts[k]); g.lineTo(...pts[k + 1]); g.stroke(); }
  g.restore(); }
function fish182(x, y, dir, s = 1) { g.save(); g.translate(x, y); g.scale(dir * s, s); g.fillStyle = DAMSEL182;
  g.beginPath(); g.ellipse(0, 0, 34, 20, 0, 0, 6.283); g.fill(); g.beginPath(); g.moveTo(-28, 0); g.lineTo(-56, -18); g.lineTo(-56, 18); g.closePath(); g.fill();
  g.fillStyle = '#1A2A5A'; g.beginPath(); g.arc(18, -5, 5, 0, 6.283); g.fill(); g.restore(); }
// drawn burrow panel: 8 arms → 6 slide into the hole, 2 stay out and wiggle; damselfish come in, then flee
function burrow182(t, box, tHide, tFish, tPred) { const [bx, by, bw, bh] = box; g.save(); rrect(bx, by, bw, bh, 30); g.clip();
  const gr = g.createLinearGradient(0, by, 0, by + bh); gr.addColorStop(0, '#163A4A'); gr.addColorStop(1, '#0A1E28'); g.fillStyle = gr; g.fillRect(bx, by, bw, bh);
  const sy = by + bh * 0.62; g.fillStyle = SAND182; g.beginPath(); g.moveTo(bx, sy); for (let x = bx; x <= bx + bw; x += 40) g.lineTo(x, sy + Math.sin(x * 0.02) * 8); g.lineTo(bx + bw, by + bh); g.lineTo(bx, by + bh); g.fill();
  const hx = bx + bw / 2, hy = sy + 4; g.fillStyle = '#2A1D10'; g.beginPath(); g.ellipse(hx, hy, 70, 22, 0, 0, 6.283); g.fill();
  const hide = easeOut(clamp((t - tHide) / 0.8)), wig = 18 + 30 * clamp((t - tPred) / 0.4);
  for (let k = 0; k < 8; k++) { const keep = k === 0 || k === 4, a = Math.PI + (k / 7) * Math.PI * -1 + (k > 3 ? 0 : 0), L = keep ? 400 : 240 * (1 - hide);
    const ang = keep ? (k === 0 ? Math.PI + 0.22 : -0.22) : -0.3 - (k / 8) * 2.5; if (L > 4) arm182(t, hx, hy - 6, ang, L, keep ? wig : 8, keep ? 32 : 24); }
  if (t > tFish) { const flee = clamp((t - tPred) / 0.9); for (let i = 0; i < 4; i++) { const dir = i % 2 ? -1 : 1, ent = easeOut(clamp((t - tFish - i * 0.15) / 0.8));
    const x = hx + dir * (520 - 300 * ent + 700 * flee * flee), y = by + 70 + i * 34 + Math.sin(t * 6 + i) * 6; fish182(x, y, flee > 0 ? dir : -dir, 0.9); } }
  g.restore(); g.lineWidth = 3; g.strokeStyle = 'rgba(255,255,255,0.16)'; rrect(bx, by, bw, bh, 30); g.stroke(); }

// ---------- scenes ----------
VIS.open = (K) => { const ei = sw('octopus', 1.6); K(0.15, 'hit', 1.2); K(0.2, 'mute', 1, 0.4); K(ei, 'boom', 0.9);
  const LIST = ['🦁 LIONFISH', '🐍 SEA SNAKE', '🐟 FLATFISH', '🪼 JELLYFISH', '🦀 CRAB', '🐙 ?'];
  return (t) => { atmosphere(t); shot(t, 'face', { a: [0.42, 0.4, 1.0], b: [0.42, 0.38, 1.1], dur: 3, anchor: [540, 1050] });
    shade182(0, 760, 0.85); tag(t); hook(t, EP.hook, 440);
    if (t > ei) { const k = Math.min(LIST.length - 1, Math.floor((t - ei) / 0.3)); chip(LIST[k], 540, 1420, t, ei + k * 0.3, { size: 44, bg: GOLD, fg: BG }); }
    realBadge(t, 0.3, 'REAL PHOTO · MIMIC OCTOPUS', 1500); }; };

VIS[0] = S(() => { const mi = sw('mimic', 0.3), ni = sw('nineteen', 1.8), su = sw('sulawesi', 3.6);
  return vscene(0, N182, { ph: 'lembeh', o: { box: [40, 720, 1000, 720] }, a: [0.45, 0.5, 1.0], b: [0.45, 0.5, 1.1], dur: 5, badge: 'REAL PHOTO · LEMBEH STRAIT, SULAWESI',
    f2: ['MIMIC', 'OCTOPUS', null, mi, { y: 520, size: 100 }], k: [[mi, 'hit', 1.1], [ni, 'boom', 0.9], [su, 'ding', 0.9]],
    x: (t) => { if (t > ni) chip('DISCOVERED 1998', 540, 1390, t, ni, { size: 40, bg: RED, fg: '#FFF' });
      if (t > su) chip('📍 SULAWESI, INDONESIA', 540, 1310, t, su, { size: 34, bg: GOLD, fg: BG }); } }); });

VIS[1] = S(() => { const li = sw('lionfish', 0.3), sp = sw('spreads', 1.2), pi = sw('spines', 3.0);
  return (K) => { ks(K, [[0.1, 'whoosh', 0.8], [li, 'hit', 1], [sp, 'pop', 0.9], [pi, 'ding', 1]]);
    return (t) => { atmosphere(t);
      shot(t, 'lion', { box: [40, 720, 1000, 345], a: [0.5, 0.45, 1.0], b: [0.5, 0.45, 1.08], dur: 5 }); boxTag182('LIONFISH', 70, 780);
      tag(t, 1, N182); realBadge(t, 0.3, 'REAL PHOTOS', 360);
      fact2(t, li, 'ARMS OUT', '= SPINES', null, { y: 520, size: 100 });
      if (t > sp) { g.save(); g.globalAlpha = clamp((t - sp) / 0.3); shot(t - sp, 'spread', { box: [40, 1085, 1000, 345], a: [0.5, 0.5, 1.0], b: [0.5, 0.5, 1.08], dur: 5, backdrop: false }); g.restore();
        boxTag182('MIMIC OCTOPUS', 70, 1145, GOLD); } }; }; });

VIS[2] = S(() => { const se = sw('sea', 0.3), hi = sw('hides', 1.0), da = sw('damselfish', 2.8), pr = sw('predator', 4.2), ba = sw('banded', 4.9);
  return (K) => { ks(K, [[0.1, 'whoosh', 0.8], [se, 'hit', 1], [hi, 'swish', 0.9], [da, 'pop', 0.8], [pr, 'boom', 1], [ba, 'ding', 0.9]]);
    return (t) => { atmosphere(t);
      shot(t, 'krait', { box: [40, 720, 1000, 345], a: [0.6, 0.5, 1.0], b: [0.62, 0.5, 1.08], dur: 6 }); boxTag182('REAL · BANDED SEA KRAIT', 70, 780);
      tag(t, 2, N182); fact2(t, se, 'SEA', 'SNAKE', null, { y: 520, size: 100 });
      burrow182(t, [40, 1085, 1000, 345], hi + 0.3, da, pr); boxTag182('ILLUSTRATION', 70, 1145);
      if (t > hi && t < pr) chip('6 ARMS HIDDEN · 2 OUT', 540, 1390, t, hi + 0.4, { size: 34, bg: GOLD, fg: BG });
      if (t > pr) chip('🐍 DAMSELFISH FLEE', 540, 1390, t, pr, { size: 36, bg: RED, fg: '#FFF' }); }; }; });

VIS[3] = S(() => { const fl = sw('flat', 1.0), fv = sw('five', 2.4), da = sw('days', 3.6);
  return (K) => { ks(K, [[0.1, 'whoosh', 0.8], [fl, 'hit', 1], [fv, 'boom', 1], [da, 'ding', 0.9]]);
    return (t) => { atmosphere(t); clip(t, 'swim', { box: [40, 720, 1000, 720], a: [0.5, 0.5, 1.0], b: [0.5, 0.5, 1.08], dur: 6 });
      tag(t, 3, N182); footBadge(t, 0.3, 'REAL FOOTAGE · BALI', 360);
      fact2(t, fl, 'FAVORITE:', 'FLATFISH', null, { y: 520, size: 100 });
      if (t > fl + 0.5 && t < fv) chip('ALL 8 ARMS TRAILED BEHIND', 540, 1390, t, fl + 0.5, { size: 34, bg: GOLD, fg: BG });
      if (t > fv - 0.2) { g.save(); g.globalAlpha = clamp((t - fv + 0.2) / 0.3); g.fillStyle = 'rgba(6,10,14,0.7)'; rrect(40, 720, 1000, 720, 30); g.fill(); g.restore();
        const n = Math.round(500 * easeOut(clamp((t - fv) / 1.1)));
        text('NEARLY', 540, 900, 'mono', 44, TXT, { ls: 8, align: 'center' }); text(`${n}×`, 540, 1130, 'disp', 230, GOLD, { align: 'center' });
        if (t > da) chip('IN JUST 5 DAYS', 540, 1300, t, da, { size: 44, bg: RED, fg: '#FFF' }); } }; }; });
