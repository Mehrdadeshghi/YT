// Wiki Roulette #115 — HOW IT WORKS #7: noise-cancelling headphones (noise against noise). Motion graphics (tech.js kit).
// Retention: frame-1 paradox (make noise to make silence) → microphones listen → wave + inverted wave = flat line (wow) →
// best on deep hum (plane/train/AC) → voices slip through (residual wave) → 1936 patent → value tip (ear-tip seal) → CTA.
const N = 6;
const nEase = (x) => 1 - Math.pow(1 - clamp(x), 3);
function phones(x, y, s, t, o = {}) { g.save(); g.translate(x, y); g.scale(s, s); g.lineCap = 'round';
  g.strokeStyle = '#2A2F3A'; g.lineWidth = 46; g.beginPath(); g.arc(0, 40, 300, Math.PI * 1.08, Math.PI * 1.92); g.stroke(); g.strokeStyle = '#4A5264'; g.lineWidth = 14; g.beginPath(); g.arc(0, 40, 300, Math.PI * 1.1, Math.PI * 1.9); g.stroke();
  [-1, 1].forEach((sd) => { g.save(); g.translate(sd * 290, 120); g.shadowColor = 'rgba(0,0,0,0.6)'; g.shadowBlur = 40; rrect(-80, -150, 160, 300, 70); const gr = g.createLinearGradient(-80, 0, 80, 0); gr.addColorStop(0, '#1C2029'); gr.addColorStop(0.5, '#3A4252'); gr.addColorStop(1, '#14171E'); g.fillStyle = gr; g.fill(); g.shadowBlur = 0;
    rrect(sd > 0 ? -95 : 55, -120, 40, 240, 20); g.fillStyle = '#0D0F14'; g.fill();
    if (o.mics) { glowDot(sd * 40, -90, 12, CY, o.mics); glowDot(sd * 40, 90, 12, CY, o.mics); } if (o.glow) { g.strokeStyle = o.glowCol || CY; g.globalAlpha = o.glow; g.lineWidth = 6; g.shadowColor = g.strokeStyle; g.shadowBlur = 30; rrect(-80, -150, 160, 300, 70); g.stroke(); } g.restore(); });
  g.restore(); }
// plot a wave between x0..x1 at baseline y; f(u) returns -1..1
function wave(x0, x1, y, amp, f, col, w = 6, a = 1) { const pts = []; for (let i = 0; i <= 160; i++) { const u = i / 160; pts.push([lerp(x0, x1, u), y - f(u) * amp]); } glowLine(pts, col, w, a); }
const noiseF = (t, k = 1) => (u) => Math.sin(u * 6.283 * 3 * k - t * 6) * 0.8 + Math.sin(u * 6.283 * 7.3 * k - t * 9) * 0.2;
function arcsFrom(x, y, t, col, n = 5, dir = 1, a = 1) { for (let k = 0; k < n; k++) { const u = ((t * 0.8 + k / n) % 1); g.save(); g.globalAlpha = a * (1 - u); g.strokeStyle = col; g.lineWidth = 6; g.shadowColor = col; g.shadowBlur = 16;
    g.beginPath(); g.arc(x, y, 40 + u * 360, dir > 0 ? -0.6 : Math.PI - 0.6, dir > 0 ? 0.6 : Math.PI + 0.6); g.stroke(); g.restore(); } }

// ---------- scenes ----------
VIS.open = (K) => { const no = sw('noise', 1.0), si = sw('silence', 2.2); K(0.05, 'hit', 1.3); for (let k = 0; k < 6; k++) K(0.15 + k * 0.12, 'glitch', 0.35); ks(K, [[no, 'zap', 0.9], ...drop(si, 0.5)]);
  return (t) => { techBg(t, '#06040A', '#1A0B1E'); const cancel = t > si ? nEase((t - si) / 0.5) : 0;
    wave(60, 1020, 760, 100 * (1 - cancel), noiseF(t), RED2, 7);
    if (t > no) wave(60, 1020, 900, 100 * (1 - cancel), (u) => -noiseF(t)(u), CY, 7, clamp((t - no) / 0.3));
    phones(540, 1080, 0.7, t, { glow: t > si ? 1 : 0, glowCol: LIME });
    if (t > si) { glowLine([[60, 830], [1020, 830]], LIME, 6); rgbText('SILENCE', 540, 680, 130, t, si, { color: LIME }); flash(t, si, 0.3, 0.12, '#E8FFE0'); }
    tag(t); hook(t, EP.hook, 400); if (EP.series) chip(EP.series, 80, 300, t, -0.3, { size: 26, align: 'left', bg: GOLD, fg: BG }); }; };

VIS[0] = S(() => { const mi = sw('microphones', 0.6), li = sw('listen', 2.0), so = sw('sound', 2.8);
  return (K) => { ks(K, [[mi, 'pop', 0.8, 800], [mi + 0.15, 'pop', 0.8, 900], [li, 'whoosh', 0.7]]);
    return (t) => { techBg(t); tag(t, 0, N); phones(540, 930, 1.05, t, { mics: t > mi ? clamp((t - mi) / 0.3) : 0 });
      if (t > li) { arcsFrom(80, 1060, t, RED2, 5, 1, 0.9); arcsFrom(1000, 1060, t + 0.4, RED2, 5, -1, 0.9); }
      if (t > mi) chip('MICROPHONES', 300, 600, t, mi, { size: 44, bg: CY, fg: BG });
      if (t > so) { framed(t, 'sony', 600, 520, 380, { b: [0.5, 0.5, 1.06], backdrop: false }); realBadge(t, so, 'REAL PHOTO · NOISE-CANCELLING HEADPHONES', 490); } }; }; });

VIS[1] = S(() => { const op = sw('opposite', 1.0), pe = sw('peak', 2.2), va = sw('valley', 2.6), ca = sw('cancel', 3.6);
  return (K) => { ks(K, [[op, 'zap', 0.9], [pe, 'pop', 0.8, 700], [va, 'pop', 0.8, 500], ...drop(ca, 0.4)]);
    return (t) => { techBg(t, '#03070F', '#0A1B33'); tag(t, 1, N); const f = (u) => Math.sin(u * 6.283 * 2.5 - t * 3), c = t > ca ? nEase((t - ca) / 0.6) : 0;
      text('NOISE', 80, 560, 'mono', 30, RED2); wave(80, 1000, 660, 110, f, RED2, 7);
      if (t > op) { text('ANTI-NOISE', 80, 800, 'mono', 30, CY); wave(80, 1000, 900, 110, (u) => -f(u), CY, 7, clamp((t - op) / 0.3)); }
      if (t > pe) { const u0 = ((0.25 + t * 3 / 6.283) / 2.5) % 0.4 + 0.1, x = lerp(80, 1000, u0); g.save(); g.setLineDash([10, 8]); g.strokeStyle = GOLD; g.lineWidth = 4; g.beginPath(); g.moveTo(x, 520); g.lineTo(x, 1030); g.stroke(); g.restore();
        glowDot(x, 660 - f(u0) * 110, 14, GOLD); if (t > va) glowDot(x, 900 + f(u0) * 110, 14, GOLD); }
      text('YOU HEAR', 80, 1040, 'mono', 30, LIME); wave(80, 1000, 1110, 60 * (1 - c), (u) => t > op ? f(u) * (1 - clamp((t - op) / 0.4)) : f(u), LIME, 7);
      if (t > ca) rgbText('CANCELLED!', 540, 430, 130, t, ca, { color: LIME }); else if (t > op) rgbText('OPPOSITE WAVE', 540, 430, 96, t, op, { color: CY }); }; }; });

VIS[2] = S(() => { const st = sw('steady', 0.5), de = sw('deep', 1.2), pl = sw('plane', 2.2), tr = sw('trains', 3.0), ai = sw('air', 3.6);
  return (K) => { ks(K, [[de, 'boom', 0.6], [pl, 'pop', 0.8, 500], [tr, 'pop', 0.8, 600], [ai, 'pop', 0.8, 700]]);
    return (t) => { if (t > pl && t < tr) { const P = shot(t, 'cabin', { a: [0.5, 0.5, 1.1], b: [0.5, 0.5, 1.2], dur: 1.5, t0: pl }); if (!P) noPhoto(t); tag(t, 2, N); realBadge(t, pl, 'REAL PHOTO · AIRPLANE CABIN'); rgbText('PLANE ENGINES', 540, 470, 96, t, pl, { color: LIME }); return; }
      techBg(t, '#030A06', '#0C2414'); tag(t, 2, N); const bars = 16;
      for (let i = 0; i < bars; i++) { const low = i < 6, hz = Math.round(50 * Math.pow(2, i * 0.55)), h0 = 300 + 120 * Math.sin(t * 5 + i), red = low && t > de ? 1 - 0.85 * nEase((t - de) / 0.6) : 1, h = h0 * red * (low ? 1 : 0.55), x = 110 + i * 54;
        g.save(); g.fillStyle = low ? (t > de ? LIME : RED2) : '#6F7E99'; g.shadowColor = g.fillStyle; g.shadowBlur = 18; g.fillRect(x, 1180 - h, 38, h); g.restore(); if (i % 3 === 0) text(hz >= 1000 ? (hz / 1000).toFixed(1) + 'k' : String(hz), x + 19, 1220, 'mono', 22, '#9FB3CF', { align: 'center' }); }
      text('Hz (ILLUSTRATION)', 940, 1220, 'mono', 20, '#6F7E99', { align: 'right' });
      if (t > de && t < pl) rgbText('DEEP HUM: GONE', 540, 470, 100, t, de, { color: LIME });
      if (t > tr) { const lab = t > ai ? 'AIR CONDITIONING' : 'TRAINS'; rgbText(lab, 540, 470, 96, t, t > ai ? ai : tr, { color: LIME }); } }; }; });

VIS[3] = S(() => { const vo = sw('voices', 0.3), sh = sw('shorter', 1.6), fa = sw('fast', 2.6);
  return (K) => { ks(K, [[vo, 'pop', 0.9, 900], [sh, 'zap', 0.7], [fa, 'wrong', 1]]);
    return (t) => { techBg(t, '#0E0408', '#22070F'); tag(t, 3, N); const f = (u) => Math.sin(u * 6.283 * 9 - t * 14) * 0.7 + Math.sin(u * 6.283 * 17 - t * 23) * 0.3, lag = 0.04;
      text('VOICE', 80, 560, 'mono', 30, MG); wave(80, 1000, 660, 100, f, MG, 5);
      text('ANTI-NOISE (TOO LATE)', 80, 800, 'mono', 30, CY); wave(80, 1000, 900, 100, (u) => -f(u + lag), CY, 5, 0.8);
      text('YOU STILL HEAR', 80, 1040, 'mono', 30, RED2); wave(80, 1000, 1110, 70, (u) => (f(u) - f(u + lag)) * 0.9, RED2, 5);
      if (t > vo) rgbText('VOICES GET THROUGH', 540, 430, 72, t, vo, { color: MG, jitter: t > fa }); }; }; });

VIS[4] = S(() => { const ol = sw('old', 0.4), ge = sw('german', 1.0), ni = sw('nineteen', 2.2);
  return (K) => { ks(K, [[ol, 'whoosh', 0.7], [ge, 'pop', 0.8, 600], ...drop(ni, 0.35)]);
    return (t) => { techBg(t, '#0E0A04', '#2A1E0A'); tag(t, 4, N);
      g.save(); g.translate(540, 980); g.rotate(-0.04); g.shadowColor = 'rgba(0,0,0,0.6)'; g.shadowBlur = 40; g.fillStyle = '#E9DDBF'; g.fillRect(-330, -380, 660, 760); g.shadowBlur = 0;
      text('PATENT', 0, -300, 'disp', 60, '#5A4630', { align: 'center' }); g.strokeStyle = 'rgba(90,70,48,0.5)'; g.lineWidth = 3; for (let k = 0; k < 6; k++) { g.beginPath(); g.moveTo(-270, -220 + k * 40); g.lineTo(270, -220 + k * 40); g.stroke(); }
      const p = clamp((t - ol) / 1.2); [[RED2, 1], ['#2E5A9E', -1]].forEach(([c, sg], k) => { const pts = []; for (let i = 0; i <= 80 * p; i++) { const u = i / 80; pts.push([-260 + u * 520, 60 + k * 150 - sg * Math.sin(u * 6.283 * 2) * 50]); } if (pts.length > 1) { g.strokeStyle = c; g.lineWidth = 5; g.beginPath(); pts.forEach(([x, y], j) => j ? g.lineTo(x, y) : g.moveTo(x, y)); g.stroke(); } });
      text('fig. 1  (illustration)', 0, 340, 'mono', 24, '#5A4630', { align: 'center' }); g.restore();
      if (t > ni) { const y = Math.round(lerp(2026, 1936, nEase((t - ni) / 0.6))); rgbText(String(y), 540, 470, 180, t, ni, { color: GOLD }); chip('PAUL LUEG · GERMAN PHYSICIST', 540, 560, t, ni + 0.3, { size: 32, bg: GOLD, fg: BG }); } }; }; });

VIS[5] = S(() => { const ti = sw('tip', 0.2), se = sw('seal', 1.6), bi = sw('larger', 2.6);
  return (K) => { ks(K, [[ti, 'pop', 0.9, 700], [se, 'zap', 0.8], [bi, 'ding', 1]]);
    return (t) => { techBg(t); tag(t, 5, N);
      ['S', 'M', 'L'].forEach((sz, k) => { const x = 270 + k * 270, r = 70 + k * 22, act = t > bi && k === 2; g.save(); g.translate(x, 900); g.shadowColor = act ? LIME : 'rgba(0,0,0,0.5)'; g.shadowBlur = act ? 40 : 20;
        g.fillStyle = '#3A4252'; g.beginPath(); g.ellipse(0, 0, r, r * 0.8, 0, 0, 6.283); g.fill(); g.fillStyle = '#0D0F14'; g.beginPath(); g.ellipse(0, 0, r * 0.35, r * 0.28, 0, 0, 6.283); g.fill(); g.restore();
        text(sz, x, 1050, 'disp', 60, act ? LIME : '#9FB3CF', { align: 'center' }); });
      if (t > se) { for (let k = 0; k < 4; k++) { const u = ((t * 1.2 + k / 4) % 1), x = lerp(80, 760, u); glowDot(x, 760 + k * 25, 8, RED2, t > bi && x > 640 ? 0 : 0.9); } if (t > bi) { g.save(); g.strokeStyle = LIME; g.lineWidth = 10; g.shadowColor = LIME; g.shadowBlur = 30; g.beginPath(); g.moveTo(690, 740); g.lineTo(690, 860); g.stroke(); g.restore(); } }
      rgbText(t > bi ? 'BETTER SEAL' : 'TIP', 540, 470, 120, t, t > bi ? bi : ti, { color: t > bi ? LIME : GOLD }); if (t > se) chip('BLOCKS HIGH SOUNDS PASSIVELY', 540, 560, t, se, { size: 30, bg: CY, fg: BG }); }; }; });
