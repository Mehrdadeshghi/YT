// Body Facts #9 (#127) — stroke: every minute counts (FAST). Motion graphics (tech.js + med.js).
const N = 6;
function fastRow(t, act, y = 640) { 'FAST'.split('').forEach((c, k) => { const on = k === act, x = 225 + k * 210; g.save(); g.fillStyle = on ? GOLD : 'rgba(255,255,255,0.08)'; g.shadowColor = on ? GOLD : 'transparent'; g.shadowBlur = on ? 40 : 0;
  rrect(x - 85, y - 85, 170, 170, 30); g.fill(); g.restore(); text(c, x, y + 42, 'disp', 120, on ? BG : 'rgba(255,255,255,0.35)', { align: 'center' }); }); }
function face(x, y, s, droop, t) { g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = SKIN; g.beginPath(); g.ellipse(0, 0, 200, 250, 0, 0, 6.283); g.fill();
  g.fillStyle = '#3B2A20'; g.beginPath(); g.ellipse(0, -170, 210, 110, 0, Math.PI, 0); g.fill(); g.fillStyle = '#222';
  g.beginPath(); g.ellipse(-75, -40, 22, 16, 0, 0, 6.283); g.fill(); g.beginPath(); g.ellipse(75, -40 + 14 * droop, 22, 16 * (1 - 0.5 * droop), 0.2 * droop, 0, 6.283); g.fill();
  g.strokeStyle = '#8E3A3A'; g.lineWidth = 14; g.lineCap = 'round'; g.beginPath(); g.moveTo(-80, 110); g.quadraticCurveTo(0, 150 - 20 * droop, 80, 110 + 50 * droop); g.stroke();
  if (droop > 0.3) { g.strokeStyle = `rgba(255,59,78,${0.5 + 0.5 * Math.sin(t * 8)})`; g.lineWidth = 6; g.setLineDash([14, 10]); g.beginPath(); g.ellipse(85, 40, 110, 180, 0, 0, 6.283); g.stroke(); g.setLineDash([]); } g.restore(); }
function armsFig(x, y, s, t, drift) { g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = '#3A4C6E'; g.beginPath(); g.arc(0, -230, 70, 0, 6.283); g.fill(); rrect(-100, -150, 200, 330, 50); g.fill();
  const arm = (side, ang) => { g.save(); g.translate(side * 90, -120); g.rotate(ang); g.fillStyle = '#4A5E86'; rrect(-30, -20, 60, 260, 30); g.fill(); g.restore(); };
  arm(-1, Math.PI * 0.5); arm(1, -Math.PI * 0.5 + drift); g.restore(); }
function phone112(x, y, s) { phoneFrame(x, y, s, () => { g.fillStyle = '#0B2A1A'; g.fillRect(-190, -380, 380, 760); text('112 · 911', 0, -40, 'disp', 64, LIME, { align: 'center' }); text('calling…', 0, 40, 'ui', 34, '#FFFFFF', { align: 'center' }); }); }

VIS.open = (K) => { const mi = sw('million', 3.0), ev = sw('every', 4.2); K(0.05, 'hit', 1.1); for (let k = 0; k < 14; k++) K(0.3 + k * 0.3, 'tick', 0.4); ks(K, [[ev, 'boom', 0.8]]);
  return (t) => { bodyBg(t, '#08060C', '#1E0A14'); brain(540, 1060, 1.1, t, { hx: 60, hy: -40, hr: 60 + 100 * clamp(t / 4), alarm: true });
    const n = Math.floor(31667 * Math.max(0, t - 0.3)); rgbText(n.toLocaleString('en-US'), 540, 700, 110, t, 0.3, { color: RED2 }); text('NERVE CELLS LOST', 540, 770, 'mono', 30, '#FFFFFF', { align: 'center' });
    if (t > ev) chip('≈ 1.9 MILLION PER MINUTE', 540, 1250, t, ev, { size: 36, bg: RED2, fg: '#FFF' });
    tag(t); hook(t, EP.hook, 400); if (EP.series) chip(EP.series, 80, 300, t, -0.3, { size: 26, align: 'left', bg: MRED, fg: '#FFF' }); }; };

VIS[0] = S(() => { const bl = sw('blood', 1.0), re = sw('reach', 1.6), pa = sw('part', 2.2);
  return (K) => { ks(K, [[bl, 'whoosh', 0.6], [re, 'wrong', 1], [pa, 'thump', 0.8]]);
    return (t) => { bodyBg(t, '#08060C', '#1E0A14'); tag(t, 0, N); const dk = t > pa ? clamp((t - pa) / 0.8) : 0; brain(540, 860, 1.4, t, dk ? { hx: 80, hy: -60, hr: 150, dark: dk, alarm: true } : {});
      const pts = [[540, 1300], [600, 1150], [620, 1000], [660, 830]]; glowLine(pts, '#B0303C', 22, 0.9); const cl = t > re;
      for (let k = 0; k < 10; k++) { let u = ((t * 0.5 + k / 10) % 1); if (cl) u = Math.min(u, 0.72 - (k % 3) * 0.03); const i = Math.min(2, Math.floor(u * 3)), f = u * 3 - i, [x0, y0] = pts[i], [x1, y1] = pts[i + 1]; glowDot(x0 + (x1 - x0) * f, y0 + (y1 - y0) * f, 9, MRED); }
      if (cl) { g.fillStyle = '#5A1A20'; g.beginPath(); g.arc(631, 960, 26, 0, 6.283); g.fill(); shock(631, 960, t, re, 140, RED2); chip('CLOT', 760, 1080, t, re, { size: 34, bg: RED2, fg: '#FFF' }); }
      rgbText(t > re ? "BLOOD CAN'T GET THROUGH" : 'WHAT IS A STROKE?', 540, 470, 92, t, t > re ? re : 0.1, { color: t > re ? RED2 : '#FFFFFF' }); }; }; });

VIS[1] = S(() => { const ox = sw('oxygen', 0.6), dy = sw('dying', 1.6), ti = sw('time', 3.4);
  return (K) => { ks(K, [[ox, 'whoosh', 0.7], [dy, 'thump', 0.8], [ti, 'stamp', 1]]);
    return (t) => { if (t < ti) { bodyBg(t, '#08060C', '#1E0A14'); const P = framed(t, 'ct', 40, 660, 1000, { b: [0.5, 0.5, 1.06] }); if (!P) noPhoto(t); tag(t, 1, N); realBadge(t, 0.1, 'REAL CT SCAN · STROKE (MIDDLE CEREBRAL ARTERY)');
        rgbText(t > dy ? 'NERVE CELLS DIE FAST' : 'NO OXYGEN', 540, 560, 100, t, t > dy ? dy : ox, { color: RED2 }); return; }
      bodyBg(t, '#08060C', '#1E0A14'); tag(t, 1, N); g.save(); g.translate(540, 880); g.strokeStyle = '#FFFFFF'; g.lineWidth = 14; g.beginPath(); g.arc(0, 0, 220, 0, 6.283); g.stroke();
      g.strokeStyle = GOLD; g.lineCap = 'round'; g.lineWidth = 16; const a = (t - ti) * 6; g.beginPath(); g.moveTo(0, 0); g.lineTo(Math.sin(a) * 170, -Math.cos(a) * 170); g.stroke(); g.lineWidth = 20; g.beginPath(); g.moveTo(0, 0); g.lineTo(Math.sin(a / 12) * 110, -Math.cos(a / 12) * 110); g.stroke(); g.restore();
      stampText('TIME IS BRAIN', 540, 1200, t, ti, { size: 80, color: GOLD }); rgbText("DOCTORS SAY:", 540, 470, 100, t, ti, { color: '#FFFFFF' }); }; }; });

VIS[2] = S(() => { const fa = sw('fast', 0.5), fc = sw('face', 1.4), dr = sw('drooping', 2.8);
  return (K) => { ks(K, [...drop(fa, 0.3), [fc, 'pop', 0.9, 600], [dr, 'wrong', 0.9]]);
    return (t) => { bodyBg(t, '#06101E', '#102A46'); tag(t, 2, N); rgbText('REMEMBER: FAST', 540, 470, 110, t, fa, { color: GOLD }); fastRow(t, t > fc ? 0 : -1);
      if (t > fc) { face(540, 1000, 0.75, t > dr ? mE((t - dr) / 0.8) : 0, t); chip(t > dr ? 'ONE SIDE DROOPING?' : 'F = FACE', 540, 1260, t, t > dr ? dr : fc, { size: 38, bg: t > dr ? RED2 : GOLD, fg: t > dr ? '#FFF' : BG }); } }; }; });

VIS[3] = S(() => { const ar = sw('arms', 0.4), ra = sw('raise', 1.2), sp = sw('speech', 2.8), sl = sw('slurred', 3.8);
  return (K) => { ks(K, [[ar, 'pop', 0.9, 600], [ra, 'whoosh', 0.6], [sp, 'pop', 0.9, 800], [sl, 'glitch', 0.8]]);
    return (t) => { bodyBg(t, '#06101E', '#102A46'); tag(t, 3, N); const S2 = t > sp; fastRow(t, S2 ? 2 : 1);
      if (!S2) { const d = t > ra + 0.8 ? mE((t - ra - 0.8) / 1.2) * 0.8 : 0; armsFig(540, 1040, 0.85, t, d); chip(t > ra ? 'CAN THEY RAISE BOTH ARMS?' : 'A = ARMS', 540, 1260, t, t > ra ? ra : ar, { size: 34, bg: GOLD, fg: BG }); if (d > 0.3) text('↓', 760, 980, 'disp', 90, RED2, { align: 'center' }); }
      else { g.save(); g.translate(540, 980); g.fillStyle = '#FFFFFF'; rrect(-330, -150, 660, 260, 60); g.fill(); g.beginPath(); g.moveTo(-160, 100); g.lineTo(-220, 190); g.lineTo(-80, 100); g.fill();
        const gl = t > sl; for (let x = -280; x <= 280; x += 8) { const v = Math.sin(x * 0.05 + t * 8) * Math.sin(x * 0.013) * 70 * (gl ? (0.4 + 0.6 * Math.abs(Math.sin(x * 0.11 + t * 3))) : 1); g.fillStyle = gl ? RED2 : BG; g.fillRect(x, -20 - Math.abs(v), 5, Math.abs(v) * 2 + 4); } g.restore();
        chip(t > sl ? 'SLURRED OR STRANGE?' : 'S = SPEECH', 540, 1260, t, t > sl ? sl : sp, { size: 36, bg: t > sl ? RED2 : GOLD, fg: t > sl ? '#FFF' : BG }); }
      rgbText('FAST', 540, 470, 120, t, 0.1, { color: GOLD }); }; }; });

VIS[4] = S(() => { const ti = sw('time', 0.3), ca = sw('call', 1.2), wa = sw('wait', 3.0);
  return (K) => { ks(K, [[ti, 'pop', 0.9, 900], [ca, 'beep', 1], [ca + 0.3, 'beep', 1], [wa, 'stamp', 1]]);
    return (t) => { bodyBg(t, '#1A0610', '#3A0D1E'); tag(t, 4, N); fastRow(t, 3); if (t > ca && Math.floor(t * 4) % 2) { g.fillStyle = 'rgba(62,123,255,0.12)'; g.fillRect(0, 0, W, H); }
      if (t > ca) phone112(540, 1040, 0.45); if (t > wa) stampText("DON'T WAIT", 540, 1230, t, wa, { size: 80, color: RED2 });
      rgbText(t > ca ? 'CALL EMERGENCY NOW' : 'T = TIME', 540, 470, 100, t, t > ca ? ca : ti, { color: t > ca ? LIME : GOLD }); }; }; });

VIS[5] = S(() => { const no = sw('note', 0.4), st = sw('started', 1.8), dc = sw('doctors', 2.6);
  return (K) => { ks(K, [[no, 'pen', 0.8], [st, 'pop', 0.8, 600], [dc, 'ding', 0.9]]);
    return (t) => { bodyBg(t, '#06101E', '#102A46'); tag(t, 5, N); g.save(); g.translate(540, 900); g.rotate(-0.05); g.fillStyle = '#FFF6C8'; g.shadowColor = 'rgba(0,0,0,0.5)'; g.shadowBlur = 30; rrect(-260, -200, 520, 400, 16); g.fill(); g.restore();
      text('SYMPTOMS STARTED:', 540, 800, 'mono', 34, BG, { align: 'center' }); if (t > st) { const s = '14:32'.slice(0, Math.min(5, Math.floor((t - st) * 8))); text(s, 540, 960, 'disp', 150, RED2, { align: 'center' }); }
      rgbText('NOTE THE TIME', 540, 470, 120, t, no, { color: GOLD }); if (t > dc) chip('DOCTORS NEED TO KNOW IT', 540, 1180, t, dc, { size: 36, bg: LIME, fg: BG }); medNote(t, dc + 0.3, 560); }; }; });
