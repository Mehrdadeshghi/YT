// Wiki Roulette #173 — MYSTERY: the sailing stones of Racetrack Playa, Death Valley. Frame 1 = real NPS photo of a rock with its trail + "nobody pushed
// these rocks" → a stone as heavy as a person, trails up to 330 ft → nearly a century: nobody saw one move (year counter) → GPS hidden in a rock (real
// PLOS ONE photo), Dec 20 2013: 60+ rocks moved (real photo of fresh trails) → payoff: ICE (real photo of windowpane ice over a rock, then a drawn
// top-down playa: thin ice panels pushed by wind shove the rocks, trails behind) → binary question.
const N173 = 4, MUD173 = '#6E6152', WATER173 = 'rgba(120,170,200,', ICE173 = 'rgba(225,245,255,';
const ill173 = (t, y = 1590) => text('ILLUSTRATION', 1000, y, 'mono', 22, 'rgba(255,255,255,0.55)', { ls: 3, align: 'right' });
function shade173(y0, y1, a) { const gr = g.createLinearGradient(0, y0, 0, y1); gr.addColorStop(0, `rgba(0,0,0,${a})`); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(0, y0, W, y1 - y0); }

// top-down playa: a thin film of water; ice panels drift with the wind (+x) and shove the rocks; each rock leaves a groove behind it
const ROCKS173 = (() => { const r = rng(173), s = []; for (let i = 0; i < 7; i++) s.push({ x0: 90 + r() * 360, y: 640 + i * 130 + r() * 40, s: 22 + r() * 18, wob: r() * 6 }); return s; })();
function playa173(t, push) {
  g.fillStyle = MUD173; g.fillRect(0, 0, W, H);
  const r = rng(17); g.save(); g.strokeStyle = 'rgba(40,32,24,0.35)'; g.lineWidth = 2;
  for (let k = 0; k < 140; k++) { const x = r() * W, y = r() * H, a = r() * 6.283; g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a) * 60, y + Math.sin(a) * 60); g.stroke(); } g.restore();
  g.fillStyle = WATER173 + '0.28)'; g.fillRect(0, 0, W, H);                                   // the shallow winter pond
  const d = push * 430;                                                                      // how far the ice (and the rocks) have moved
  ROCKS173.forEach((k) => { const x = k.x0 + d, y = k.y + Math.sin(k.wob + push * 3) * 12 * push;
    g.save(); g.strokeStyle = 'rgba(235,225,205,0.7)'; g.lineWidth = k.s * 0.9; g.lineCap = 'round'; g.beginPath(); g.moveTo(k.x0, k.y);
    for (let p = 0; p <= 1.001; p += 0.1) g.lineTo(k.x0 + d * p, k.y + Math.sin(k.wob + push * p * 3) * 12 * push * p); g.stroke(); g.restore();
    g.save(); g.fillStyle = '#2B2622'; g.shadowColor = 'rgba(0,0,0,0.6)'; g.shadowBlur = 12; g.beginPath(); g.ellipse(x, y, k.s, k.s * 0.8, k.wob, 0, 6.283); g.fill(); g.restore(); });
  // ice panels: big, thin, translucent plates with bright cracked edges, moving with the rocks
  const panels = [[-260, 560, 560, 420], [-200, 1000, 620, 380], [-300, 1400, 560, 360]];
  panels.forEach(([x, y, w, h], i) => { const px = x + d + Math.sin(t * 0.8 + i) * 6; g.save(); g.fillStyle = ICE173 + '0.22)'; g.strokeStyle = ICE173 + '0.85)'; g.lineWidth = 4;
    g.beginPath(); g.moveTo(px, y); g.lineTo(px + w, y + 30); g.lineTo(px + w - 40, y + h * 0.5); g.lineTo(px + w + 10, y + h); g.lineTo(px + 20, y + h - 20); g.closePath(); g.fill(); g.stroke();
    g.strokeStyle = ICE173 + '0.4)'; g.lineWidth = 2; g.beginPath(); g.moveTo(px + w * 0.3, y + 10); g.lineTo(px + w * 0.45, y + h * 0.6); g.lineTo(px + w * 0.7, y + h - 30); g.stroke(); g.restore(); });
}
function wind173(t, a) { if (a <= 0) return; g.save(); g.globalAlpha = a; g.strokeStyle = 'rgba(255,255,255,0.8)'; g.fillStyle = 'rgba(255,255,255,0.8)'; g.lineWidth = 6; g.lineCap = 'round';
  for (let k = 0; k < 5; k++) { const y = 600 + k * 200, x = ((t * 420 + k * 260) % 1300) - 200; g.beginPath(); g.moveTo(x, y); g.lineTo(x + 150, y); g.stroke();
    g.beginPath(); g.moveTo(x + 170, y); g.lineTo(x + 140, y - 18); g.lineTo(x + 140, y + 18); g.fill(); } g.restore(); }

// ---------- scenes ----------
VIS.open = (K) => { const pu = sw('pushed', 0.9); K(0.15, 'hit', 1.2); K(0.2, 'mute', 1, 0.4); K(pu, 'wrong', 1);
  return (t) => { atmosphere(t); const P = shot(t, 'trail', { a: [0.53, 0.66, 1.0], b: [0.54, 0.68, 1.12], dur: 3, anchor: [540, 1150] });
    shade173(0, 1000, 0.85); tag(t); hook(t, EP.hook, 440);
    if (P && t > pu) { const [x, y] = P(0.545, 0.69); ring(t, pu, x, y, Math.abs(P(0.615, 0.69)[0] - x), { color: RED, spot: false }); }
    realBadge(t, 0.3, 'REAL PHOTO · RACETRACK PLAYA, DEATH VALLEY', 1530); }; };

VIS[0] = S(() => { const he = sw('heavy', 0.9), tr = sw('trails', 3.6);
  return vscene(0, N173, { ph: 'visitor', a: [0.86, 0.74, 1.35], b: [0.87, 0.75, 1.5], dur: 5, badge: 'REAL PHOTO · RACETRACK PLAYA (NPS)', k: [[he, 'thump', 1], [tr, 'boom', 1]],
    x: (t, P) => { if (P && t > he) callout(t, he, P(0.86, 0.73), 540, 1180, 'AS HEAVY AS A PERSON', { size: 40, align: 'center' });
      if (t > tr) fact2(t, tr, 'TRAILS UP TO', '330 FT', null, { y: 520 }); } }); });

VIS[1] = S(() => { const ce = sw('century', 1.0), mo = sw('move', 2.2);
  return vscene(1, N173, { ph: 'lone', a: [0.55, 0.7, 1.0], b: [0.72, 0.7, 1.2], dur: 4, badge: 'REAL PHOTO · ROCK AND ITS TRAIL (NPS)', k: [[ce, 'swish', 0.9], [mo, 'wrong', 1]],
    x: (t, P) => { const yr = Math.round(lerp(1915, 2013, ease(clamp((t - ce) / Math.max(0.6, mo - ce)))));
      if (t > ce) { rgbPop(String(yr), 80, 600, 190, GOLD, t, ce); label('FIRST REPORT: 1915', 84, 680, t, ce + 0.2, { size: 32 }); }
      if (P && t > mo) { const [x, y] = P(0.745, 0.70); ring(t, mo, x, y, 120, { color: RED }); stampText('NEVER SEEN MOVING', 540, 1420, t, mo, { size: 70, rot: -0.06 }); } } }); });

VIS[2] = S(() => { const gp = sw('GPS', 0.8), de = sw('December', 2.6), sx = sw('sixty', 4.2);
  return (K) => { ks(K, [[0.1, 'whoosh', 0.8], [gp, 'ding', 1], [de, 'whoosh', 0.9], [sx, 'boom', 1.1]]);
    return (t) => { atmosphere(t); const sw2 = clamp((t - de + 0.15) / 0.35);
      if (sw2 < 1) { const P = shot(t, 'gps', { a: [0.5, 0.72, 1.0], b: [0.53, 0.77, 1.3], dur: 3, anchor: [540, 1000] });
        if (P && t > gp) { const [x, y] = P(0.535, 0.765); ring(t, gp, x, y, 90, { color: '#57E38A' }); chip('GPS INSIDE THE ROCK', 540, 520, t, gp + 0.1, { size: 44, bg: '#57E38A', fg: BG }); } }
      if (sw2 > 0) { g.save(); g.globalAlpha = sw2; shot(t, 'dec20', { a: [0.55, 0.45, 1.0], b: [0.62, 0.5, 1.12], dur: 3, t0: de }); g.restore(); }
      tag(t, 2, N173); realBadge(t, 0.3, sw2 < 0.5 ? 'REAL PHOTO · GPS ROCK (PLOS ONE, 2014)' : 'REAL PHOTO · FRESH TRAILS (NORRIS ET AL.)');
      if (t > de) chip('DEC 20, 2013', 540, 470, t, de, { size: 52, bg: GOLD, fg: BG });
      if (t > sx) stampText('60+ ROCKS MOVED', 540, 1380, t, sx, { size: 84, rot: -0.07 }); }; }; });

VIS[3] = S(() => { const ic = sw('Ice', 0.5), mm = sw('millimeters', 1.6), pu = sw('pushed', 2.6), sx = sw('sixteen', 4.2);
  return (K) => { ks(K, [[ic, 'boom', 1.1], [mm, 'crack', 0.9], [pu, 'whoosh', 1], [sx, 'ding', 1]]);
    return (t) => { const ill = clamp((t - pu + 0.1) / 0.35);
      if (ill < 1) { atmosphere(t); const P = shot(t, 'ice', { box: [40, 700, 1000, 760], a: [0.245, 0.23, 2.0], b: [0.27, 0.26, 2.2], dur: 3 });
        if (P && t > mm) { const [x, y] = P(0.29, 0.27); ring(t, mm, x, y, 140, { color: '#9ED8FF', spot: false }); }
        realBadge(t, 0.2, 'REAL PHOTO · THIN ICE OVER A ROCK, JAN 2014', 650); }
      if (ill > 0) { g.save(); g.globalAlpha = ill; playa173(t, ease(clamp((t - pu) / 4))); wind173(t, clamp((t - pu) / 0.4)); g.restore();
        if (t > pu) { chip('WIND →', 200, 760, t, pu, { size: 44, bg: '#9ED8FF', fg: BG }); ill173(t); } }
      tag(t, 3, N173); if (t > ic) rgbPop('ICE.', 80, 560, 170, '#9ED8FF', t, ic);
      if (t > mm) chip('A FEW MM THIN', 760, 500, t, mm, { size: 40, bg: '#E8F6FF', fg: BG });
      if (t > sx) chip('≈ 16 FT A MINUTE', 540, 1260, t, sx, { size: 52, bg: GOLD, fg: BG }); }; }; });
