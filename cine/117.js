// Wiki Roulette #117 — HOW IT WORKS #9: phone night mode (one photo = many photos). Motion graphics (tech.js kit).
// Retention: frame-1 claim (your night photo is 15 photos) → one quick shot = grain → burst while you hold still → align, reject blur,
// merge → noise averages away (before/after slider) → Night Sight numbers (15 frames ≈ 5 s) → value tip (brace the phone) → CTA.
const N = 6;
const nmE = (x) => 1 - Math.pow(1 - clamp(x), 3);
const SKY = (() => { const r = rng(117), b = []; let x = 0; while (x < 1080) { const w = 70 + r() * 110, h = 180 + r() * 420; b.push([x, w, h, Array.from({ length: 40 }, () => r())]); x += w + 6; } return b; })();
// a night city scene in box (x,y,w,h). o: { noise 0..1, blur px, dx, dy, bright }
function nightScene(x, y, w, h, t, o = {}) { g.save(); rrect(x, y, w, h, 22); g.clip(); g.translate(x + (o.dx || 0), y + (o.dy || 0)); const sx = w / 1080, sy = h / 900; g.scale(sx, sy);
  if (o.blur) g.filter = `blur(${o.blur}px)`; const br = o.bright ?? 1;
  const gr = g.createLinearGradient(0, 0, 0, 900); gr.addColorStop(0, `rgb(${8 * br},${14 * br},${40 * br})`); gr.addColorStop(1, `rgb(${30 * br},${24 * br},${60 * br})`); g.fillStyle = gr; g.fillRect(-60, -60, 1200, 1020);
  g.fillStyle = `rgba(255,248,220,${0.9 * br})`; g.beginPath(); g.arc(820, 170, 60, 0, 6.283); g.fill();
  SKY.forEach(([bx, bw, bh, win]) => { g.fillStyle = `rgb(${12 * br + 6},${14 * br + 6},${26 * br + 8})`; g.fillRect(bx, 900 - bh, bw, bh + 40);
    let k = 0; for (let yy = 900 - bh + 20; yy < 880; yy += 34) for (let xx = bx + 10; xx < bx + bw - 14; xx += 26) { if (win[k++ % 40] > 0.55) { g.fillStyle = `rgba(255,${190 + (k % 40)},110,${0.85 * br})`; g.fillRect(xx, yy, 12, 16); } } });
  g.filter = 'none'; g.restore();
  if (o.noise > 0) { const r = rng(Math.floor(t * 24) + 3), n = Math.floor(2600 * o.noise); g.save(); rrect(x, y, w, h, 22); g.clip();
    for (let i = 0; i < n; i++) { const v = r(); g.fillStyle = v < 0.33 ? `rgba(255,60,90,${0.55 * o.noise})` : v < 0.66 ? `rgba(60,255,140,${0.5 * o.noise})` : `rgba(90,140,255,${0.6 * o.noise})`; g.fillRect(x + r() * w, y + r() * h, 5, 5); }
    g.fillStyle = `rgba(0,0,0,${0.35 * o.noise})`; g.fillRect(x, y, w, h); g.restore(); }
  g.save(); g.lineWidth = 4; g.strokeStyle = 'rgba(255,255,255,0.25)'; rrect(x, y, w, h, 22); g.stroke(); g.restore(); }
function ring2(x, y, r, p, col) { g.save(); g.lineWidth = 14; g.strokeStyle = 'rgba(255,255,255,0.15)'; g.beginPath(); g.arc(x, y, r, 0, 6.283); g.stroke(); g.strokeStyle = col; g.shadowColor = col; g.shadowBlur = 20; g.lineCap = 'round'; g.beginPath(); g.arc(x, y, r, -Math.PI / 2, -Math.PI / 2 + 6.283 * clamp(p)); g.stroke(); g.restore(); }

// ---------- scenes ----------
VIS.open = (K) => { const on = sw('one', 0.8), fi = sw('fifteen', 2.4); K(0.05, 'hit', 1.3); for (let k = 0; k < 15; k++) K(on + 0.1 + k * 0.08, 'tick', 0.4); ks(K, drop(fi, 0.35));
  return (t) => { techBg(t, '#04050C', '#0E1028'); const fan = t > on ? nmE((t - on) / 1.2) : 0;
    for (let k = 14; k >= 0; k--) { const a = (k - 7) * 0.07 * fan, ox = (k - 7) * 22 * fan, oy = -k * 6 * fan; g.save(); g.translate(540 + ox, 1000 + oy); g.rotate(a); nightScene(-330, -250, 660, 500, t + k, { bright: 0.8, noise: 0.35 * fan }); g.restore(); }
    if (t > on) { const n = Math.min(15, 1 + Math.floor((t - on) / 0.08)); chip(`${n} PHOTOS`, 540, 1300, t, on, { size: 40, bg: GOLD, fg: BG }); }
    if (t > fi) rgbText('= 1 NIGHT PHOTO', 540, 700, 96, t, fi, { color: GOLD });
    tag(t); hook(t, EP.hook, 400); if (EP.series) chip(EP.series, 80, 300, t, -0.3, { size: 26, align: 'left', bg: GOLD, fg: BG }); }; };

VIS[0] = S(() => { const da = sw('dark', 0.4), qu = sw('quick', 1.0), no = sw('noise', 2.4);
  return (K) => { ks(K, [[qu, 'tick', 1], ...drop(no, 0.35)]);
    return (t) => { techBg(t, '#04050C', '#0E1028'); tag(t, 0, N); const nz = t > qu ? clamp((t - qu) / 0.4) : 0;
      nightScene(80, 560, 920, 700, t, { bright: 0.55, noise: nz }); if (t > no) { g.save(); g.strokeStyle = GOLD; g.lineWidth = 6; g.beginPath(); g.arc(640, 900, 120, 0, 6.283); g.stroke(); g.restore(); }
      rgbText(t > no ? 'GRAINY NOISE' : '1 QUICK SHOT', 540, 450, 110, t, t > no ? no : qu, { color: t > no ? RED2 : '#FFFFFF', jitter: t > no }); }; }; });

VIS[1] = S(() => { const bu = sw('burst', 0.8), ho = sw('hold', 2.4), se = sw('seconds', 3.6);
  return (K) => { ks(K, [[bu, 'whoosh', 0.7], [ho, 'pop', 0.8, 600]]); for (let k = 0; k < 15; k++) K(bu + 0.15 + k * 0.2, 'tick', 0.45);
    return (t) => { techBg(t, '#04050C', '#0E1028'); tag(t, 1, N); const n = t > bu ? Math.min(15, 1 + Math.floor((t - bu) / 0.2)) : 0;
      phoneFrame(540, 900, 1.0, () => { nightScene(-188, -376, 376, 600, t, { bright: 0.7, noise: 0.5 }); ring2(0, 300, 46, n / 15, GOLD); text(t > ho ? 'Hold still' : '', 0, 200, 'ui', 30, '#FFFFFF', { align: 'center' }); });
      for (let k = 0; k < n; k++) { g.save(); g.translate(880 + (k % 3) * 0, 560 + k * 40); g.rotate(0.05); rrect(-80, -24, 160, 40, 6); g.fillStyle = '#1D2440'; g.fill(); g.lineWidth = 2; g.strokeStyle = GOLD; g.stroke(); text(`#${k + 1}`, 0, 8, 'mono', 22, GOLD, { align: 'center' }); g.restore(); }
      rgbText(t > ho ? 'HOLD STILL…' : 'BURST MODE', 540, 400, 100, t, t > ho ? ho : bu, { color: GOLD }); }; }; });

VIS[2] = S(() => { const li = sw('lines', 0.4), th = sw('throws', 1.2), bl = sw('blurry', 2.0), me = sw('merges', 3.0);
  return (K) => { ks(K, [[li, 'swish', 0.8], [bl, 'wrong', 1], [me, 'boom', 0.9], [me + 0.02, 'ding', 1]]);
    return (t) => { techBg(t, '#04050C', '#0E1028'); tag(t, 2, N); const al = t > li ? nmE((t - li) / 0.8) : 0, mg = t > me ? nmE((t - me) / 0.6) : 0;
      [[-60, -40], [50, 30], [-30, 60], [70, -50]].forEach(([dx, dy], k) => { const isBlur = k === 2, gone = isBlur && t > bl ? nmE((t - bl) / 0.5) : 0;
        g.save(); g.globalAlpha = (1 - gone) * (mg > 0 ? 1 - mg * 0.75 : 0.85); nightScene(130 + dx * (1 - al) + gone * 900, 580 + dy * (1 - al) + k * 10 * (1 - mg), 820, 620, t + k, { bright: 0.75, noise: 0.45, blur: isBlur ? 10 : 0 }); g.restore();
        if (isBlur && t > bl && gone < 1) { g.save(); g.strokeStyle = RED2; g.lineWidth = 14; g.shadowColor = RED2; g.shadowBlur = 24; const cx = 540 + gone * 900, cy = 900; g.beginPath(); g.moveTo(cx - 80, cy - 80); g.lineTo(cx + 80, cy + 80); g.moveTo(cx + 80, cy - 80); g.lineTo(cx - 80, cy + 80); g.stroke(); g.restore(); } });
      if (mg > 0) nightScene(130, 580, 820, 620, t, { bright: 1, noise: 0.45 * (1 - mg) });
      const lab = t > me ? 'MERGED' : t > bl ? 'BLURRY? DELETED' : t > li ? 'ALIGNING' : ''; if (lab) rgbText(lab, 540, 450, 104, t, t > me ? me : t > bl ? bl : li, { color: t > me ? LIME : t > bl ? RED2 : CY }); }; }; });

VIS[3] = S(() => { const ra = sw('random', 0.6), av = sw('averages', 1.4), de = sw('details', 2.8);
  return (K) => { ks(K, [[ra, 'glitch', 0.8], [av, 'swish', 0.9], ...drop(de, 0.35)]);
    return (t) => { techBg(t, '#04050C', '#0E1028'); tag(t, 3, N); const sl = t > av ? lerp(950, 130, nmE((t - av) / 1.2)) : 950;
      nightScene(130, 580, 820, 620, t, { bright: 0.55, noise: 0.95 }); g.save(); g.beginPath(); g.rect(sl, 560, 1000, 660); g.clip(); nightScene(130, 580, 820, 620, t, { bright: 1, noise: 0.05 }); g.restore();
      g.save(); g.fillStyle = '#FFFFFF'; g.fillRect(sl - 3, 560, 6, 660); g.beginPath(); g.arc(sl, 890, 30, 0, 6.283); g.fill(); g.restore(); text('1 SHOT', 150, 620, 'mono', 26, RED2); text('15 MERGED', 930, 620, 'mono', 26, LIME, { align: 'right' });
      if (t > av && t < de) chip('NOISE SHRINKS WITH √(EXPOSURE)', 540, 520, t, av, { size: 30, bg: CY, fg: BG });
      rgbText(t > de ? 'DETAILS STAY' : 'RANDOM NOISE', 540, 430, 110, t, t > de ? de : ra, { color: t > de ? LIME : RED2 }); }; }; });

VIS[4] = S(() => { const go = sw('google', 0.3), fi = sw('fifteen', 1.6), fv = sw('five', 2.8);
  return (K) => { ks(K, [[go, 'pop', 0.8, 600], ...drop(fi, 0.35), [fv, 'ding', 1]]);
    return (t) => { const P = shot(t, 'night', { a: [0.5, 0.4, 1.15], b: [0.5, 0.4, 1.35], dur: 4 }); if (!P) techBg(t); g.fillStyle = 'rgba(3,4,12,0.55)'; g.fillRect(0, 0, W, H); tag(t, 4, N); realBadge(t, 0.1, 'REAL PHOTO · LONG EXPOSURE: LIGHT COLLECTED OVER TIME');
      if (t > fi) { const n = Math.min(15, Math.round(15 * nmE((t - fi) / 0.6))); rgbText(`${n} FRAMES`, 540, 560, 150, t, fi, { color: GOLD }); }
      if (t > go && t < fi) chip('GOOGLE NIGHT SIGHT', 540, 560, t, go, { size: 44, bg: '#FFFFFF', fg: BG });
      if (t > fv) { const p = nmE((t - fv) / 1.0); g.save(); rrect(140, 700, 800, 70, 35); g.fillStyle = 'rgba(8,16,30,0.9)'; g.fill(); rrect(140, 700, 800 * p, 70, 35); g.fillStyle = GOLD; g.fill(); g.restore();
        for (let k = 1; k < 15; k++) { g.fillStyle = 'rgba(0,0,0,0.5)'; g.fillRect(140 + k * 800 / 15, 700, 3, 70); } chip(`15 × 0.33 s ≈ ${(5 * p).toFixed(1)} s OF LIGHT`, 540, 830, t, fv, { size: 34, bg: GOLD, fg: BG }); } }; }; });

VIS[5] = S(() => { const ti = sw('tip', 0.2), br = sw('brace', 0.6), st = sw('steadier', 1.8), lo = sw('longer', 2.8);
  return (K) => { ks(K, [[ti, 'pop', 0.8, 700], [br, 'swish', 0.8], [lo, 'ding', 1]]);
    return (t) => { if (t < br + 0.2) { const P = shot(t, 'blurdog', { a: [0.5, 0.5, 1.1], b: [0.5, 0.5, 1.2], dur: 1 }); if (!P) noPhoto(t); tag(t, 5, N); realBadge(t, 0.05, 'REAL PHOTO · SLOW SHUTTER + MOVEMENT = BLUR'); rgbText('TIP', 540, 520, 140, t, ti, { color: GOLD }); return; }
      techBg(t, '#04050C', '#0E1028'); tag(t, 5, N); const steady = t > st ? nmE((t - st) / 0.5) : 0, sh = (1 - steady) * 14;
      g.save(); g.fillStyle = '#5A4630'; g.fillRect(560, 1150, 460, 30); g.fillStyle = '#8A6A44'; g.fillRect(820, 980, 120, 170); g.restore(); text('CUP / WALL / TABLE', 790, 1215, 'mono', 22, '#B9A07A', { align: 'center' });
      g.save(); g.translate(lerp(380, 700, steady) + Math.sin(t * 30) * sh, lerp(900, 980, steady) + Math.cos(t * 27) * sh); g.rotate(lerp(0, 0.18, steady)); phoneFrame(0, 0, 0.42, () => nightScene(-188, -376, 376, 752, t, { bright: lerp(0.6, 1, steady), blur: sh * 0.4 })); g.restore();
      const ex = lerp(0.33, 1.0, steady); g.save(); rrect(140, 620, 800, 60, 30); g.fillStyle = 'rgba(8,16,30,0.9)'; g.fill(); rrect(140, 620, 800 * ex, 60, 30); g.fillStyle = steady > 0.5 ? LIME : GOLD; g.fill(); g.restore();
      text(`EXPOSURE PER FRAME: ${ex.toFixed(2)} s`, 540, 730, 'mono', 30, '#FFFFFF', { align: 'center' }); rgbText(t > st ? 'BRACE IT!' : 'HANDHELD', 540, 450, 120, t, t > st ? st : br, { color: t > st ? LIME : '#FFFFFF' }); }; }; });
