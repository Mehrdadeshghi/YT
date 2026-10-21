// Wiki Roulette #185 — OCEAN: Portuguese man o' war. Frame 1 = real photo + "NOT A JELLYFISH. NOT ONE ANIMAL." →
// real close-up: a colony of clones from one egg, chips HUNT / EAT / BREED → real side view: the float is a sail, gas gauge up to 13% CO →
// drawn to scale: float ~1 ft, tentacles usually 30 ft, some over 100 ft → drawn map: left- and right-handed floats drift to opposite
// sides of the wind, at most half reach the coast → real photo, washed up in Boca Raton (Florida): dead, still stings → binary question.
const N185 = 5, SEA185 = ['#0B3A55', '#020B14'], BLUE185 = '#7FB8FF', PINK185 = '#C58CFF';

function sea185(t) { const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, SEA185[0]); gr.addColorStop(1, SEA185[1]); g.fillStyle = gr; g.fillRect(0, 0, W, H);
  g.save(); g.globalAlpha = 0.07; g.fillStyle = '#BFE6FF'; for (let k = 0; k < 5; k++) { g.beginPath(); g.moveTo(150 + k * 220 + Math.sin(t + k) * 30, 0); g.lineTo(220 + k * 220, 0); g.lineTo(80 + k * 260, H); g.lineTo(-40 + k * 260, H); g.fill(); } g.restore(); }

// a man o' war float (bladder with crest) at (x, y), size s; lean = -1 (crest to the left) … 1 (to the right)
function float185(x, y, s, lean, t) { g.save(); g.translate(x, y + Math.sin(t * 2.2 + x) * 4); g.scale(lean < 0 ? -1 : 1, 1);
  const bg = g.createLinearGradient(0, -s, 0, s * 0.4); bg.addColorStop(0, '#E6D4FF'); bg.addColorStop(0.5, BLUE185); bg.addColorStop(1, PINK185);
  g.fillStyle = bg; g.globalAlpha = 0.92; g.beginPath(); g.ellipse(0, 0, s, s * 0.42, -0.12, 0, 6.283); g.fill();
  g.fillStyle = 'rgba(240,200,255,0.85)'; g.beginPath(); g.moveTo(-s * 0.7, -s * 0.2); g.quadraticCurveTo(-s * 0.1, -s * 1.05, s * 0.75, -s * 0.32); g.closePath(); g.fill();
  g.restore(); }
// tentacles hanging from (x, y) down to y + len (grow p 0..1)
function strands185(x, y, len, p, t, n = 9) { g.save(); g.lineCap = 'round';
  for (let i = 0; i < n; i++) { const dx = (i - (n - 1) / 2) * 7, L = len * p * (i % 3 === 0 ? 1 : 0.55 + 0.1 * (i % 4));
    g.strokeStyle = i % 3 === 0 ? 'rgba(170,150,255,0.85)' : 'rgba(170,150,255,0.45)'; g.lineWidth = i % 3 === 0 ? 4 : 2.5; g.beginPath(); g.moveTo(x + dx, y);
    for (let k = 1; k <= 30; k++) { const u = k / 30; g.lineTo(x + dx + Math.sin(t * 1.5 + i + u * 9) * (4 + 16 * u), y + L * u); } g.stroke(); }
  g.restore(); }
const ill185 = (str = 'ILLUSTRATION', y = 1490) => text(str, 1000, y, 'mono', 22, 'rgba(255,255,255,0.55)', { ls: 3, align: 'right' });

// ---------- scenes ----------
VIS.open = vopen({ ph: 'float', a: [0.5, 0.42, 1.0], b: [0.5, 0.45, 1.1],
  x: (t) => realBadge(t, 0.2, 'REAL PHOTO · PORTUGUESE MAN O\' WAR', 1500) });

VIS[0] = S(() => { const co = sw('colony', 0.5), eg = sw('egg', 1.6), hu = sw('hunt', 2.4), ea = sw('eat', 2.9), br = sw('breed', 3.4);
  return (K) => { ks(K, [[0.1, 'whoosh', 0.8], [co, 'hit', 1], [eg, 'pop', 0.9], [hu, 'tick', 1], [ea, 'tick', 1], [br, 'ding', 1]]);
    return (t) => { atmosphere(t);
      const P = shot(t, 'close', { box: [40, 690, 1000, 760], a: [0.5, 0.5, 1.0], b: [0.55, 0.55, 1.3], dur: 5 }); if (!P) noPhoto(t); tag(t, 0, N185);
      realBadge(t, 0.3, 'REAL PHOTO · THE COLONY UNDER THE FLOAT');
      fact2(t, co, 'ONE COLONY.', 'ALL CLONES.', null, { y: 470, size: 100 });
      if (t > eg) chip('FROM ONE SINGLE EGG', 540, 1290, t, eg, { size: 34, bg: TXT, fg: BG });
      [['HUNT', hu, 230], ['EAT', ea, 540], ['BREED', br, 850]].forEach(([s, tt, x]) => { if (t > tt) chip(s, x, 1385, t, tt, { size: 40, bg: GOLD, fg: BG }); }); }; }; });

VIS[1] = S(() => { const sa = sw('sail', 1.2), th = sw('thirteen', 2.4), cm = sw('monoxide', 3.6);
  return (K) => { ks(K, [[0.1, 'whoosh', 0.8], [sa, 'whoosh', 1], [th, 'hit', 1.1], [cm, 'thump', 1]]);
    return (t) => { atmosphere(t);
      const P = shot(t, 'side', { box: [40, 690, 1000, 760], a: [0.5, 0.3, 1.0], b: [0.5, 0.25, 1.1], dur: 5 }); if (!P) noPhoto(t); tag(t, 1, N185);
      realBadge(t, 0.3, 'REAL PHOTO · SIDE VIEW, FLOAT ABOVE THE WATER');
      fact2(t, 0.25, 'THE FLOAT', 'IS A SAIL.', null, { y: 470, size: 110 });
      if (P && t > sa) callout(t, sa, P(0.5, 0.07), 760, 1180, 'SAIL', { size: 38 });
      if (t > th) { const p = easeOut(clamp((t - th) / 0.8)), x0 = 90, w = 900, y0 = 1330;   // gas gauge: 13% carbon monoxide
        panel(60, y0 - 70, 960, 150); g.fillStyle = 'rgba(255,255,255,0.14)'; rrect(x0, y0 - 18, w, 36, 18); g.fill();
        g.fillStyle = RED; rrect(x0, y0 - 18, Math.max(36, w * 0.13 * p), 36, 18); g.fill();
        text(`UP TO ${Math.round(13 * p)}%`, x0 + w * 0.13 + 30, y0 + 13, 'disp', 40, TXT);
        if (t > cm) text('CARBON MONOXIDE · MADE BY THE ANIMAL', x0, y0 + 60, 'mono', 24, GOLD, { ls: 2 }); } }; }; });

VIS[2] = S(() => { const th = sw('thirty', 1.4), hu = sw('reach', 2.6);
  return (K) => { ks(K, [[0.1, 'whoosh', 0.8], [th, 'hit', 1], [hu - 0.1, 'whoosh', 1], [hu + 0.2, 'hit', 1.2]]);
    return (t) => { sea185(t); tag(t, 2, N185); const top = 470, px = 950 / 100, x = 200;          // 950 px = 100 ft
      g.fillStyle = 'rgba(191,230,255,0.25)'; g.fillRect(0, top - 2, W, 4);                       // water line
      const L = t < th ? 30 * px * easeOut(clamp(t / Math.max(0.5, th))) : t < hu ? 30 * px : lerp(30, 100, easeOut(clamp((t - hu) / 0.6))) * px;
      strands185(x, top + 6, L, 1, t, 11); float185(x, top - 6, 46, 1, t);
      chip('FLOAT: ~1 FT', x + 70, top - 60, t, 0.2, { size: 30, align: 'left', bg: BLUE185, fg: BG });
      if (t > th) { ruler(t, th, 330, top + 30 * px, 30 * px, '30 FT', { v: true, size: 32 }); }
      if (t > hu + 0.2) { ruler(t, hu + 0.2, 640, top + 100 * px, 100 * px, 'OVER 100 FT', { v: true, size: 36, color: RED }); }
      ill185('DRAWN TO SCALE · ILLUSTRATION', 1480); }; }; });

VIS[3] = S(() => { const le = sw('left', 0.8), ri = sw('right', 1.8), ha = sw('half', 3.4);
  return (K) => { ks(K, [[0.1, 'whoosh', 0.8], [le, 'swish', 1], [ri, 'swish', 1], [ha, 'hit', 1.1]]);
    return (t) => { sea185(t); tag(t, 3, N185);
      const cy = 1290; g.fillStyle = '#D9C08A'; g.beginPath(); g.moveTo(0, cy); for (let x = 0; x <= W; x += 40) g.lineTo(x, cy + Math.sin(x * 0.01) * 14); g.lineTo(W, H); g.lineTo(0, H); g.fill();
      text('COAST', 540, cy + 90, 'disp', 44, 'rgba(12,11,10,0.7)', { align: 'center' });
      // the wind blows along the coast, left → right
      const wa = clamp(t / 0.5); g.save(); g.globalAlpha = wa; g.strokeStyle = TXT; g.lineWidth = 8; g.lineCap = 'round';
      for (let k = 0; k < 3; k++) { const y = 560 + k * 60, o = ((t * 220 + k * 140) % 300); g.beginPath(); g.moveTo(80 + o, y); g.lineTo(380 + o, y); g.stroke();
        g.beginPath(); g.moveTo(380 + o, y); g.lineTo(355 + o, y - 18); g.moveTo(380 + o, y); g.lineTo(355 + o, y + 18); g.stroke(); }
      g.restore(); text('WIND', 80, 520, 'mono', 30, TXT, { ls: 4, alpha: wa });
      // left-handed: drifts right of the wind → towards the coast; right-handed: left of the wind → out to sea
      const d = (tt) => easeOut(clamp((t - tt) / 2.6));
      if (t > le) { const p = d(le), x = lerp(200, 760, p), y = lerp(880, 1180, p); float185(x, y, 52, -1, t);
        chip('LEFT-HANDED', x, y - 80, t, le, { size: 30, bg: BLUE185, fg: BG }); }
      if (t > ri) { const p = d(ri), x = lerp(200, 760, p), y = lerp(880, 700, p); float185(x, y, 52, 1, t);
        chip('RIGHT-HANDED', x, y - 80, t, ri, { size: 30, bg: PINK185, fg: BG }); }
      if (t > ha) chip('AT MOST HALF REACH THE COAST', 540, 430, t, ha, { size: 34, bg: GOLD, fg: BG });
      ill185('ILLUSTRATION', 1480); }; }; });

VIS[4] = S(() => { const st = sw('sting', 1.2), ho = sw('hours', 1.9), da = sw('days', 2.6);
  return (K) => { ks(K, [[0.1, 'whoosh', 0.8], [st, 'hit', 1.1], [ho, 'tick', 1], [da, 'thump', 1]]);
    return (t) => { atmosphere(t);
      const P = shot(t, 'beach', { box: [40, 690, 1000, 760], a: [0.45, 0.55, 1.0], b: [0.35, 0.58, 1.25], dur: 6 }); if (!P) noPhoto(t); tag(t, 4, N185);
      realBadge(t, 0.3, 'REAL PHOTO · WASHED UP, BOCA RATON, FLORIDA');
      fact2(t, 0.25, 'DEAD.', 'STILL STINGS.', null, { y: 470, size: 110 });
      if (t > ho) chip('HOURS', 360, 1250, t, ho, { size: 40, bg: TXT, fg: BG });
      if (t > da) chip('EVEN DAYS', 680, 1250, t, da, { size: 40, bg: RED, fg: '#FFF' }); }; }; });
