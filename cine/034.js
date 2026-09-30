// Wiki Roulette #034 — Anatoli Bugorski: a proton beam through the head (1978)
const BEAM = '#7FE8FF';
function head(x, y, s, o = {}) {        // side profile facing right
  g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = o.col || '#E3C9A8';
  g.beginPath(); g.moveTo(-90, 120); g.bezierCurveTo(-130, 40, -140, -120, -20, -150); g.bezierCurveTo(80, -170, 130, -90, 120, -30);
  g.lineTo(150, 20); g.lineTo(122, 30); g.lineTo(130, 60); g.bezierCurveTo(110, 80, 90, 100, 60, 100); g.lineTo(50, 150); g.lineTo(-60, 160); g.closePath(); g.fill();
  if (o.half) { g.save(); g.clip(); g.fillStyle = 'rgba(40,60,90,0.45)'; g.fillRect(-160, -200, 400, 200 + o.half * 0); g.restore(); }
  g.fillStyle = '#3A2A1E'; g.beginPath(); g.moveTo(-100, 0); g.bezierCurveTo(-140, -120, -40, -170, 60, -150); g.bezierCurveTo(0, -120, -60, -90, -80, 10); g.closePath(); g.fill();
  g.fillStyle = o.ear || '#C9A884'; g.beginPath(); g.ellipse(-20, -10, 18, 28, 0, 0, 6.283); g.fill();
  g.fillStyle = '#1A120C'; g.beginPath(); g.arc(80, -50, 6, 0, 6.283); g.fill();
  g.restore();
}
function beam(t, x0, y0, x1, y1, a = 1) { if (a <= 0) return; g.save(); g.globalCompositeOperation = 'lighter';
  for (const [w, al] of [[40, 0.12], [16, 0.35], [5, 1]]) { g.strokeStyle = `rgba(127,232,255,${al * a})`; g.lineWidth = w; g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.stroke(); }
  const r = rng(Math.floor(t * 30)); for (let i = 0; i < 20; i++) { const u = r(); g.fillStyle = `rgba(255,255,255,${a})`; g.fillRect(lerp(x0, x1, u), lerp(y0, y1, u) + (r() - 0.5) * 10, 3, 3); } g.restore(); }
function ring(t, cx, cy, R, a = 1) { g.save(); g.globalAlpha = a; g.strokeStyle = '#3A4550'; g.lineWidth = 34; g.beginPath(); g.arc(cx, cy, R, 0, 6.283); g.stroke();
  g.strokeStyle = BEAM; g.lineWidth = 4; g.beginPath(); g.arc(cx, cy, R, 0, 6.283); g.stroke();
  for (let i = 0; i < 12; i++) { const an = t * 4 + i * 0.52; g.fillStyle = '#fff'; g.beginPath(); g.arc(cx + Math.cos(an) * R, cy + Math.sin(an) * R, 6, 0, 6.283); g.fill(); }
  for (let i = 0; i < 16; i++) { const an = i / 16 * 6.283; g.fillStyle = '#5A6570'; g.fillRect(cx + Math.cos(an) * R - 14, cy + Math.sin(an) * R - 14, 28, 28); } g.restore(); }
// ---- OPEN
VIS.open = (K) => { K(0.3, 'zap', 0.6); K(3.0, 'hit', 0.9);
  return (t) => { atmosphere(t, { x: 540, y: 1050, r: 800, c: 'rgba(127,232,255,0.10)' });
    head(560, 1080, 1.5, {}); beam(t, 0, 1030, 1080, 1030, t < 2.9 ? 0.5 : 1);
    hookPhoto(t, 'lead', { y: 800, h: 460, focus: [0.5, 0.3] }); tag(t); hook(t, EP.hook, 500);
    flash(t, 3.0, 0.4, 0.2, '#DFF8FF'); }; };
// ---- 0: the U-70 synchrotron
VIS[0] = (K) => { K(0.5, 'pop', 0.7, 500); K(2.0, 'riser', 0.4, 2); K(4.8, 'pop', 0.8, 700);
  return (t) => { atmosphere(t, { x: 540, y: 950, r: 800, c: 'rgba(127,232,255,0.08)' }); tag(t, 0, 5);
    ring(t, 540, 960, 280 * spring(t - 0.8, 120, 18));
    popNum('JUNE 3, 1978', 80, 520, fit('JUNE 3, 1978', 'disp', 140, 920), TXT, t, 0.45); label('U-70 SYNCHROTRON · PROTVINO, USSR', 84, 580, t, 1.5, { color: BEAM });
    if (t > 4.8) chip('FAULTY EQUIPMENT', 540, 960, t, 4.8, { size: 30, bg: RED, fg: TXT });
  }; };
// ---- 1: the beam goes through his head — a thousand suns
VIS[1] = (K) => { K(0.8, 'zap', 1); K(2.9, 'mute', 1, 0.7); K(3.0, 'hit', 1.2);
  return (t) => { atmosphere(t); tag(t, 1, 5);
    head(540, 1000, 1.7, {}); const bx = lerp(0, 1080, clamp((t - 0.8) / 0.25)); beam(t, 0, 960, bx, 960, t > 0.8 ? 1 : 0);
    if (t > 3.0) { const lt = t - 3.0, gr = g.createRadialGradient(560, 960, 0, 560, 960, 900); gr.addColorStop(0, `rgba(255,255,240,${0.9 * Math.exp(-lt * 1.2)})`); gr.addColorStop(1, 'rgba(255,255,240,0)'); g.fillStyle = gr; g.fillRect(0, 0, W, H); }
    popNum('PROTON BEAM', 80, 520, fit('PROTON BEAM', 'disp', 140, 920), BEAM, t, 0.8);
    if (t > 3.2) chip('"BRIGHTER THAN A THOUSAND SUNS"', 540, 660, t, 3.2, { size: 28 });
  }; };
// ---- 2: no pain — a dose far beyond survivable
VIS[2] = (K) => { K(0.6, 'pop', 0.7, 500); for (let i = 0; i < 20; i++) K(2.0 + i * 0.08, 'tick', 0.5); K(3.8, 'hit', 1);
  return (t) => { atmosphere(t); tag(t, 2, 5);
    chip('NO PAIN', 80, 440, t, 0.6, { size: 40, align: 'left', bg: '#2B2A28', fg: TXT });
    const cx = 540, cy = 1080, R = 330; g.lineWidth = 40; g.strokeStyle = '#2B3A2E'; g.beginPath(); g.arc(cx, cy, R, Math.PI, Math.PI * 1.35); g.stroke();
    g.strokeStyle = '#6A4A1E'; g.beginPath(); g.arc(cx, cy, R, Math.PI * 1.35, Math.PI * 1.6); g.stroke(); g.strokeStyle = RED; g.beginPath(); g.arc(cx, cy, R, Math.PI * 1.6, Math.PI * 2); g.stroke();
    text('SURVIVABLE', cx - R + 10, cy + 60, 'mono', 22, '#7FE0A0', { ls: 2 }); text('BEYOND', cx + R - 100, cy + 60, 'mono', 22, RED, { ls: 2 });
    const a = Math.PI + Math.PI * clamp(ease((t - 2.0) / 1.6) * 1.08, 0, 1.02) + (t > 3.6 ? Math.sin(t * 40) * 0.01 : 0);
    g.strokeStyle = TXT; g.lineWidth = 8; g.lineCap = 'round'; g.beginPath(); g.moveTo(cx, cy); g.lineTo(cx + Math.cos(a) * (R - 40), cy + Math.sin(a) * (R - 40)); g.stroke();
    popNum('2,000–3,000 Sv', 80, 600, fit('2,000–3,000 Sv', 'disp', 130, 920), RED, t, 3.8); label('LOCAL DOSE, AS REPORTED', 84, 655, t, 4.1);
  }; };
// ---- 3: half his face paralyzed, left ear deaf
VIS[3] = (K) => { K(0.6, 'thump', 0.8); K(2.6, 'mute', 1, 0.8); K(2.7, 'beep', 0.8);
  return (t) => { atmosphere(t); tag(t, 3, 5);
    const cx = 540, cy = 900; g.fillStyle = '#E3C9A8'; g.beginPath(); g.ellipse(cx, cy, 210, 270, 0, 0, 6.283); g.fill();
    g.fillStyle = '#1A120C'; g.beginPath(); g.arc(cx - 80, cy - 40, 14, 0, 6.283); g.arc(cx + 80, cy - 40, 14, 0, 6.283); g.fill();
    g.strokeStyle = '#8A5A40'; g.lineWidth = 8; g.beginPath(); g.moveTo(cx - 90, cy + 120); g.quadraticCurveTo(cx, cy + 160, cx + 90, cy + 110); g.stroke();
    const p = clamp((t - 0.6) / 0.8); g.save(); g.beginPath(); g.rect(cx + 230 - 230 * p, cy - 300, 230 * p, 600); g.clip(); /* his left = viewer's right */ g.fillStyle = 'rgba(40,60,90,0.5)'; g.beginPath(); g.ellipse(cx, cy, 212, 272, 0, 0, 6.283); g.fill(); g.restore();
    g.fillStyle = '#C9A884'; g.beginPath(); g.ellipse(cx - 220, cy, 26, 54, 0, 0, 6.283); g.fill(); g.beginPath(); g.ellipse(cx + 220, cy, 26, 54, 0, 0, 6.283); g.fill();
    if (t > 2.6) { g.strokeStyle = RED; g.lineWidth = 8; g.beginPath(); g.moveTo(cx + 180, cy - 50); g.lineTo(cx + 260, cy + 50); g.moveTo(cx + 260, cy - 50); g.lineTo(cx + 180, cy + 50); g.stroke(); }
    chip('LEFT SIDE PARALYZED', 80, 440, t, 1.0, { size: 30, align: 'left', bg: RED, fg: TXT }); chip('LEFT EAR: DEAF', 80, 530, t, 2.6, { size: 30, align: 'left', bg: RED, fg: TXT });
  }; };
// ---- 4: mind intact — he finished his PhD
VIS[4] = (K) => { K(0.5, 'pop', 0.8, 700); K(2.6, 'scratch'); K(2.62, 'thump', 1); K(3.4, 'land', 0.8);
  return (t) => { atmosphere(t, { x: 540, y: 900, r: 800, c: 'rgba(255,194,61,0.10)' }); tag(t, 4, 5);
    popNum('MIND: INTACT', 80, 520, fit('MIND: INTACT', 'disp', 140, 920), GOLD, t, 0.45);
    const s = spring(t - 1.8, 170, 20); if (s > 0) { g.save(); g.translate(0, (1 - s) * 400); paper(540, 880, 760, 440, -0.03);
      text('DOCTOR OF PHILOSOPHY', 0, -110, 'mono', 26, '#7A7266', { align: 'center', ls: 4 }); text('PhD', 0, 40, 'serif', 150, PINK, { align: 'center' }); text('ANATOLI BUGORSKI', 0, 130, 'mono', 28, PINK, { align: 'center', ls: 3 }); g.restore(); }
    if (t > 2.6) { g.save(); g.translate(820, 1040); checkMark(0, 0, 2.2 * spring(t - 2.6, 300, 14), '#2F7A4A'); g.restore(); }
    label('HE KEPT WORKING AS A PHYSICIST', 84, 600, t, 3.4);
  }; };
