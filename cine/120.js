// Body Facts #2 (#120) — sleep paralysis. Motion graphics (tech.js + med.js).
const N = 6;
function bedroom(t, dim = 1) { const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, '#05040C'); gr.addColorStop(1, '#141030'); g.fillStyle = gr; g.fillRect(0, 0, W, H);
  g.save(); g.globalAlpha = 0.5 * dim; g.fillStyle = '#1C2A50'; g.fillRect(700, 580, 240, 240); g.strokeStyle = '#3A4C7E'; g.lineWidth = 6; g.strokeRect(700, 580, 240, 240); g.beginPath(); g.moveTo(820, 580); g.lineTo(820, 820); g.moveTo(700, 700); g.lineTo(940, 700); g.stroke();
  g.fillStyle = 'rgba(200,220,255,0.6)'; g.beginPath(); g.arc(880, 630, 26, 0, 6.283); g.fill(); g.restore(); }
function sleeper(t, o = {}) { g.save(); g.translate(540, 1000);
  g.fillStyle = '#2A2240'; rrect(-420, -120, 840, 300, 30); g.fill(); g.fillStyle = '#E8E4F4'; rrect(-400, -100, 220, 130, 50); g.fill();
  g.fillStyle = SKIN; g.beginPath(); g.ellipse(-290, -40, 70, 60, 0, 0, 6.283); g.fill(); g.fillStyle = '#3B2A20'; g.beginPath(); g.ellipse(-330, -60, 50, 50, 0, 0, 6.283); g.fill();
  const eo = o.eyes ?? 0; g.fillStyle = '#FFFFFF'; g.beginPath(); g.ellipse(-265, -50, 16, 14 * eo + 1, 0, 0, 6.283); g.fill(); if (eo > 0.5) { g.fillStyle = '#111'; g.beginPath(); g.arc(-262 + Math.sin(t * 3) * 4, -50, 7, 0, 6.283); g.fill(); }
  g.fillStyle = '#5A4A9E'; rrect(-200, -110, 600, 260, 40); g.fill(); g.strokeStyle = 'rgba(255,255,255,0.15)'; g.lineWidth = 4; for (let k = 0; k < 5; k++) { g.beginPath(); g.moveTo(-180 + k * 120, -100); g.lineTo(-180 + k * 120, 140); g.stroke(); }
  if (o.press) { for (let k = 0; k < 3; k++) { const yy = -260 + ((t * 120 + k * 60) % 180); g.save(); g.strokeStyle = RED2; g.lineWidth = 8; g.globalAlpha = o.press; g.beginPath(); g.moveTo(-40 + k * 60, yy); g.lineTo(-40 + k * 60, yy + 50); g.lineTo(-60 + k * 60, yy + 30); g.moveTo(-40 + k * 60, yy + 50); g.lineTo(-20 + k * 60, yy + 30); g.stroke(); g.restore(); } }
  g.restore(); }
function shadowFig(x, y, s, t, a) { if (a <= 0) return; g.save(); g.globalAlpha = a; g.translate(x, y); g.scale(s, s); const gr = g.createRadialGradient(0, -100, 20, 0, 0, 380); gr.addColorStop(0, 'rgba(0,0,0,0.95)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = gr; g.beginPath(); g.ellipse(0, 0, 180, 380, 0, 0, 6.283); g.fill(); g.fillStyle = '#000'; g.beginPath(); g.arc(0, -260, 70, 0, 6.283); g.fill(); g.beginPath(); g.moveTo(-120, -180); g.quadraticCurveTo(0, -230, 120, -180); g.lineTo(150, 300); g.lineTo(-150, 300); g.closePath(); g.fill();
  const fl = 0.6 + 0.4 * Math.sin(t * 9); glowDot(-24, -265, 7, RED2, fl); glowDot(24, -265, 7, RED2, fl); g.restore(); }
function toggle(x, y, on, label) { g.save(); g.translate(x, y); rrect(-110, -50, 220, 100, 50); g.fillStyle = on ? LIME : '#3A4252'; g.shadowColor = on ? LIME : 'transparent'; g.shadowBlur = on ? 30 : 0; g.fill(); g.shadowBlur = 0;
  g.fillStyle = '#FFFFFF'; g.beginPath(); g.arc(on ? 55 : -55, 0, 40, 0, 6.283); g.fill(); g.restore(); text(label, x, y + 95, 'mono', 28, '#FFFFFF', { align: 'center' }); text(on ? 'ON' : 'OFF', x, y - 70, 'disp', 40, on ? LIME : RED2, { align: 'center' }); }

VIS.open = (K) => { const mo = sw('move', 1.4), fi = sw('finger', 2.6); K(0.05, 'hit', 1.1); ks(K, [[mo, 'wrong', 1], ...drop(fi, 0.35)]); for (let k = 0; k < 8; k++) K(0.4 + k * 0.42, 'tick', 0.35);
  return (t) => { bedroom(t); sleeper(t, { eyes: clamp((t - 0.3) / 0.4) }); shadowFig(860, 760, 0.8, t, clamp((t - fi) / 0.8) * 0.85);
    if (t > mo) { const sh = Math.sin(t * 60) * 4 * (t < mo + 0.5 ? 1 : 0); g.save(); g.translate(sh, 0); rgbText("CAN'T MOVE", 540, 720, 110, t, mo, { color: RED2, jitter: true }); g.restore(); }
    tag(t); hook(t, EP.hook, 400); if (EP.series) chip(EP.series, 80, 300, t, -0.3, { size: 26, align: 'left', bg: MRED, fg: '#FFF' }); }; };

VIS[0] = S(() => { const sl = sw('sleep', 0.5), dr = sw('dream', 1.2), sw2 = sw('switches', 2.2), mu = sw('muscles', 2.8);
  return (K) => { ks(K, [[sl, 'whoosh', 0.7], [sw2, 'zap', 0.9], [mu, 'glitch', 0.8]]);
    return (t) => { bodyBg(t, '#06040F', '#16103A'); tag(t, 0, N); brain(540, 760, 1.0, t); toggle(540, 1110, t < sw2, 'MUSCLES');
      if (t > dr && t < sw2) chip('REM = DREAM SLEEP', 540, 470, t, dr, { size: 40, bg: '#8AA4FF', fg: BG });
      if (t > sw2) rgbText('MUSCLES OFF', 540, 470, 120, t, sw2, { color: RED2 }); }; }; });

VIS[1] = S(() => { const wa = sw('wake', 0.7), sw2 = sw('switch', 2.0);
  return (K) => { ks(K, [[wa, 'pop', 0.9, 700], [sw2, 'wrong', 1], [sw2 + 0.02, 'glitch', 0.9]]);
    return (t) => { bodyBg(t, '#06040F', '#16103A'); tag(t, 1, N); toggle(330, 900, t > wa, 'BRAIN AWAKE'); toggle(750, 900, false, 'MUSCLES');
      if (t > sw2) { const gl = Math.sin(t * 50) * 5; g.save(); g.translate(gl, 0); rgbText('MISMATCH', 540, 470, 130, t, sw2, { color: RED2, jitter: true }); g.restore(); if (Math.floor(t * 5) % 2) { g.fillStyle = 'rgba(255,40,60,0.08)'; g.fillRect(0, 0, W, H); } }
      else if (t > wa) rgbText('YOU WAKE UP…', 540, 470, 110, t, wa, { color: '#FFFFFF' }); }; }; });

VIS[2] = S(() => { const pa = sw('paint', 1.0), sh = sw('shadow', 2.4), pr = sw('pressure', 3.4);
  return (K) => { ks(K, [[pa, 'swish', 0.6], ...drop(sh, 0.35), [pr, 'boom', 0.7]]);
    return (t) => { bedroom(t); tag(t, 2, N); shadowFig(860, 760, 0.85, t, t > sh ? clamp((t - sh) / 0.6) : 0); sleeper(t, { eyes: 1, press: t > pr ? clamp((t - pr) / 0.4) : 0 });
      const lab = t > pr ? 'PRESSURE ON YOUR CHEST' : t > sh ? 'A SHADOW…' : 'YOUR BRAIN STILL DREAMS'; rgbText(lab, 540, 450, t > pr ? 80 : 100, t, t > pr ? pr : t > sh ? sh : pa, { color: t > sh ? RED2 : '#B9A8E8' }); }; }; });

VIS[3] = S(() => { const de = sw('demons', 0.8), pa = sw('painting', 2.2), ex = sw('exactly', 3.6);
  return (K) => { ks(K, [[de, 'boom', 0.8], [pa, 'pop', 0.8, 600], [ex, 'stamp', 1]]);
    return (t) => { bodyBg(t, '#0A0604', '#20140A'); const P = framed(t, 'nightmare', 40, 640, 1000, { b: [0.5, 0.5, 1.06] }); if (!P) noPhoto(t); tag(t, 3, N); realBadge(t, 0.1, 'REAL PAINTING · "THE NIGHTMARE", HENRY FUSELI, 1781');
      if (t > de && t < pa) rgbText('"DEMONS"', 540, 560, 120, t, de, { color: RED2 });
      if (t > pa) chip('PAINTED IN 1781', 540, 560, t, pa, { size: 40, bg: GOLD, fg: BG });
      if (t > ex && P) { const [x, y] = P(0.47, 0.3); ring(t, ex, x, y, 130, { color: RED2 }); } }; }; });

VIS[4] = S(() => { const ei = sw('eight', 0.6), st = sw('students', 2.6);
  return (K) => { ks(K, [...drop(ei, 0.35), [st, 'pop', 0.9, 700]]);
    return (t) => { bodyBg(t, '#06040F', '#16103A'); tag(t, 4, N); const hi = t > st ? 28 : t > ei ? 8 : 0;
      for (let i = 0; i < 100; i++) { const x = 170 + (i % 10) * 82, y = 640 + Math.floor(i / 10) * 72, on = i < hi * clamp((t - (t > st ? st : ei)) / 0.6 + 0.01); g.fillStyle = on ? (t > st ? MG : CY) : 'rgba(255,255,255,0.15)';
        g.beginPath(); g.arc(x, y - 14, 11, 0, 6.283); g.fill(); rrect(x - 15, y, 30, 26, 10); g.fill(); }
      if (t > st) rgbText('STUDENTS: ~28%', 540, 470, 104, t, st, { color: MG }); else if (t > ei) rgbText('~8% OF PEOPLE', 540, 470, 110, t, ei, { color: CY });
      if (t > ei) chip('SHARPLESS & BARBER, 2011 (REVIEW)', 540, 560, t, ei + 0.2, { size: 24, bg: 'rgba(255,255,255,0.85)', fg: BG }); }; }; });

VIS[5] = S(() => { const ha = sw('harmless', 0.8), mi = sw('minutes', 1.8), re = sw('regular', 2.6), st = sw('stress', 3.6);
  return (K) => { ks(K, [[ha, 'ding', 1], [re, 'pop', 0.8, 600], [st, 'pop', 0.8, 800]]);
    return (t) => { bodyBg(t, '#06040F', '#16103A'); tag(t, 5, N);
      if (t > mi) { const p = clamp((t - mi) / 1.2); g.save(); g.strokeStyle = 'rgba(255,255,255,0.2)'; g.lineWidth = 14; g.beginPath(); g.arc(540, 820, 120, 0, 6.283); g.stroke(); g.strokeStyle = LIME; g.beginPath(); g.arc(540, 820, 120, -Math.PI / 2, -Math.PI / 2 + 6.283 * p); g.stroke(); g.restore(); text('MINUTES', 540, 835, 'mono', 32, '#FFFFFF', { align: 'center' }); }
      [['REGULAR SLEEP', re], ['LESS STRESS', st]].forEach(([s, at], k) => { if (t > at) chip('✓ ' + s, 540, 1020 + k * 80, t, at, { size: 34, bg: LIME, fg: BG }); });
      rgbText(t > ha ? 'SCARY, BUT HARMLESS' : '', 540, 470, 72, t, ha, { color: LIME }); medNote(t, st + 0.3, 600); }; }; });
