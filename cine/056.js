// Wiki Roulette #056 — The Elephant's Foot (Chernobyl)
const CH = [30.1, 51.39], TOX = '200,230,120';
function basement(t) { const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, '#07080A'); gr.addColorStop(1, '#16150F'); g.fillStyle = gr; g.fillRect(0, 0, W, H);
  g.fillStyle = '#1C1B16'; g.fillRect(0, 1150, W, H - 1150); g.strokeStyle = '#2A2820'; g.lineWidth = 26; g.beginPath(); g.moveTo(0, 820); g.lineTo(W, 760); g.moveTo(0, 900); g.lineTo(W, 840); g.stroke();
  g.fillStyle = 'rgba(0,0,0,0.5)'; for (let x = 0; x < W; x += 180) g.fillRect(x, 900, 4, 250); }
function blob(t, x, y, s, glow = 1) { g.save(); g.translate(x, y); g.scale(s, s);
  g.save(); g.globalCompositeOperation = 'lighter'; glowDot(0, -140, 440, TOX, 0.16 * glow * (0.85 + 0.15 * Math.sin(t * 3))); g.restore();
  const pts = [[-270, 0], [-262, -90], [-236, -170], [-190, -228], [-140, -250], [-90, -282], [-30, -290], [30, -300], [90, -276], [140, -262], [200, -214], [240, -150], [262, -70], [272, 0]];
  const body = g.createLinearGradient(0, -300, 0, 0); body.addColorStop(0, '#4A3B28'); body.addColorStop(0.5, '#2A2016'); body.addColorStop(1, '#120D08'); g.fillStyle = body;
  g.beginPath(); g.moveTo(...pts[0]); for (let i = 1; i < pts.length; i++) { const [x0, y0] = pts[i - 1], [x1, y1] = pts[i]; g.quadraticCurveTo(x0 + (x1 - x0) * 0.5 + (i % 2 ? 6 : -6), Math.min(y0, y1) - 14, x1, y1); } g.closePath(); g.fill();
  g.save(); g.clip(); for (let k = -12; k <= 12; k++) { const x0 = k * 22, sh = Math.sin(k * 1.7) * 18; g.strokeStyle = k % 2 ? 'rgba(90,70,45,0.22)' : 'rgba(0,0,0,0.28)'; g.lineWidth = 16; g.beginPath(); g.moveTo(x0 * 0.7, -300); g.bezierCurveTo(x0 * 0.85 + sh, -200, x0 + sh, -100, x0 * 1.08, 0); g.stroke(); }
  const lr = rng(56); for (let k = 0; k < 26; k++) { const lx = (lr() - 0.5) * 460, ly = -lr() * 260, rr = 14 + lr() * 30, gg = g.createRadialGradient(lx - rr * 0.3, ly - rr * 0.3, 1, lx, ly, rr); gg.addColorStop(0, 'rgba(110,90,60,0.5)'); gg.addColorStop(1, 'rgba(20,14,8,0)'); g.fillStyle = gg; g.beginPath(); g.arc(lx, ly, rr, 0, 6.283); g.fill(); }
  g.fillStyle = 'rgba(0,0,0,0.35)'; for (let k = 0; k < 7; k++) { g.beginPath(); g.ellipse(-220 + k * 74, -6, 30, 16, 0, 0, 6.283); g.fill(); } g.restore();
  g.fillStyle = `rgba(${TOX},0.25)`; for (let k = 0; k < 6; k++) g.fillRect(-160 + k * 60, -250 + (k % 3) * 14, 18, 4); g.restore(); }
function radNoise(t, n = 160, a = 1) { const r = rng(Math.floor(t * 30) + 7); for (let i = 0; i < n; i++) { g.fillStyle = `rgba(255,255,255,${(0.3 + 0.7 * r()) * a})`; g.fillRect(r() * W, r() * H, 2 + r() * 3, 2 + r() * 3); } }
VIS.open = (K) => { K(0, 'geiger', 0.7, 4); K(2.8, 'thump', 0.9);
  return (t) => { if (!photoBG(t, 'lead', { zoom: [1.05, 1.25], dur: 4, focus: [0.5, 0.6], tint: 'rgba(60,80,20,0.12)' })) { basement(t); blob(t, 540, 1150, 1.5); }
    radNoise(t, 120, 0.7); tag(t); hook(t, EP.hook, 480); }; };
VIS[0] = (K) => { K(0.5, 'whoosh', 0.7); K(1.6, 'land', 0.7); [2.6, 3.2, 3.8].forEach((a) => K(a, 'pop', 0.8, 500)); K(1.8, 'geiger', 0.4, 3);
  return (t) => { atmosphere(t); stars(t, 100); const c = globeCam(t, [[0, 0, 45, 430], [0.3, CH[0], CH[1], 430], [1.3, CH[0], CH[1], 1100]]);
    const P = globe(t, 540, 1220, c.R, c.lon, c.lat, { land: '#3B4A2E' }); const [x, y] = P(...CH); pinAt(x, y, t, 1.6, 'CHERNOBYL', { size: 44, color: '#C8F07A' });
    tag(t, 0, 5); rgbPop('THE ELEPHANT\'S FOOT', 80, 540, fit('THE ELEPHANT\'S FOOT', 'disp', 120, 920), TXT, t, 0.45);
    chip('MELTED FUEL', 80, 610, t, 2.6, { size: 30, align: 'left', bg: '#C8F07A', fg: BG }); chip('SAND', 380, 610, t, 3.2, { size: 30, align: 'left', bg: '#2B2A28', fg: TXT }); chip('CONCRETE', 560, 610, t, 3.8, { size: 30, align: 'left', bg: '#2B2A28', fg: TXT }); }; };
VIS[1] = (K) => { const MO = ['APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC']; MO.forEach((m, i) => K(0.6 + i * 0.25, 'flat', 0.4)); K(2.8, 'hit', 1); K(3.0, 'geiger', 0.6, 2.5);
  return (t) => { MO.length; atmosphere(t); const i = Math.min(8, Math.floor(clamp((t - 0.6) / 2.2) * 9)), m = ['APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'][i];
    const s = spring(t - 0.3, 200, 18); if (s > 0) { g.save(); g.translate(540, 960); g.scale(s, s); paper(0, 0, 440, 400, -0.03); g.fillStyle = i === 8 ? RED : '#3A3630'; g.fillRect(-220, -200, 440, 110); text(m, 0, -122, 'disp', 70, TXT, { align: 'center' });
      text('1986', 0, 90, 'disp', 150, PINK, { align: 'center' }); g.restore(); }
    tag(t, 1, 5); if (t > 2.8) rgbPop('8 MONTHS LATER', 80, 560, fit('8 MONTHS LATER', 'disp', 140, 920), GOLD, t, 2.8); label('APRIL 1986 → DISCOVERED', 84, 625, t, 0.6, { color: DIM }); }; };
VIS[2] = (K) => { K(0.5, 'geiger', 0.3, 1.2); K(1.7, 'geiger', 1, 3.5); K(2.7, 'beep', 0.9); K(3.0, 'riser', 0.5, 1.5);
  return (t) => { basement(t); blob(t, 540, 1150, 1.0, 1.4); radNoise(t, Math.round(ramp(t, 0.5, 2.2, 20, 260)), 0.8); g.fillStyle = 'rgba(0,0,0,0.35)'; g.fillRect(0, 0, W, H); tag(t, 2, 5);
    const v = ramp(t, 0.5, 2.2, 0, 10000); g.save(); g.translate(730, 1000); g.fillStyle = '#D9A441'; rrect(-150, -170, 300, 330, 30); g.fill(); g.fillStyle = '#0E1A0E'; rrect(-120, -140, 240, 120, 14); g.fill();
    text(fmt(v), 100, -60, 'mono', 54, v >= 10000 ? RED : '#9CFF7A', { align: 'right' }); text('R/H', 100, -28, 'mono', 20, '#9CFF7A', { align: 'right' }); g.fillStyle = '#2B2A28'; g.beginPath(); g.arc(0, 70, 56, 0, 6.283); g.fill();
    g.strokeStyle = '#9C7A2E'; g.lineWidth = 6; for (let k = -2; k <= 2; k++) { g.beginPath(); g.moveTo(-36, 70 + k * 16); g.lineTo(36, 70 + k * 16); g.stroke(); } g.restore();
    rgbPop('10,000', 80, 560, 200, RED, t, 2.6); label('ROENTGENS PER HOUR', 84, 625, t, 2.7);
    if (t > 3.2) { const cl = clamp((t - 3.2) / 1.8); g.save(); g.translate(270, 1000); g.lineWidth = 18; g.strokeStyle = '#2B2A28'; g.beginPath(); g.arc(0, 0, 110, 0, 6.283); g.stroke(); g.strokeStyle = RED; g.beginPath(); g.arc(0, 0, 110, -Math.PI / 2, -Math.PI / 2 + 6.283 * (1 - cl)); g.stroke();
      const sec = Math.ceil(180 * (1 - cl)); text(`${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, '0')}`, 0, 18, 'mono', 52, TXT, { align: 'center' }); g.restore(); label('LETHAL DOSE IN', 270, 840, t, 3.2, { size: 24, align: 'center', color: RED }); } }; };
VIS[3] = (K) => { K(0.5, 'pop', 0.8, 500); K(1.5, 'click', 1); K(2.2, 'zap', 0.6); K(2.25, 'click', 1); K(2.8, 'swish', 0.6);
  return (t) => { basement(t); blob(t, 540, 1150, 1.0); g.fillStyle = 'rgba(0,0,0,0.5)'; g.fillRect(0, 0, W, H); tag(t, 3, 5);
    g.save(); g.translate(880, 1040); g.strokeStyle = '#8C857A'; g.lineWidth = 6; g.beginPath(); g.moveTo(0, 0); g.lineTo(-50, 200); g.moveTo(0, 0); g.lineTo(50, 200); g.moveTo(0, 0); g.lineTo(0, 200); g.stroke();
    g.fillStyle = '#2B2A28'; rrect(-80, -90, 160, 100, 14); g.fill(); g.fillStyle = '#111'; g.beginPath(); g.arc(-40, -40, 36, 0, 6.283); g.fill(); g.fillStyle = (t > 1.3 && t < 2.2 && Math.floor(t * 8) % 2) ? RED : '#4A2020'; g.beginPath(); g.arc(50, -70, 9, 0, 6.283); g.fill(); g.restore();
    flash(t, 2.2, 0.85, 0.2, '#FFFFFF');
    const s = spring(t - 2.6, 200, 18); if (s > 0) { g.save(); g.translate(540, 930); g.rotate(-0.06); g.scale(s, s); g.fillStyle = '#EDE6D8'; g.fillRect(-250, -210, 500, 470);
      g.save(); g.beginPath(); g.rect(-220, -180, 440, 360); g.clip(); g.fillStyle = '#0A0A08'; g.fillRect(-220, -180, 440, 360); g.save(); g.globalCompositeOperation = 'lighter'; glowDot(-60, -40, 260, '255,255,230', 0.25); g.restore(); blob(t, 0, 150, 0.6); g.restore();
      text('1996', -220, 230, 'mono', 26, PINK, { ls: 3 }); g.restore(); }
    rgbPop('AUTOMATIC CAMERA', 80, 540, fit('AUTOMATIC CAMERA', 'disp', 120, 920), TXT, t, 0.45); label('ARTUR KORNEYEV · 1996', 84, 605, t, 1.0, { color: GOLD }); }; };
VIS[4] = (K) => { K(0.4, 'geiger', 0.5, 3.4); K(2.0, 'scratch'); K(2.02, 'thump', 1.1);
  return (t) => { basement(t); blob(t, 540, 1150, 1.3, lerp(1.4, 0.7, ease(t / 2))); radNoise(t, 60, 0.5); tag(t, 4, 5);
    const lv = lerp(1, 0.55, ease((t - 0.4) / 1.4)); g.fillStyle = '#2B2A28'; rrect(80, 680, 920, 40, 20); g.fill(); g.fillStyle = RED; rrect(80, 680, 920 * lv, 40, 20); g.fill(); label('RADIATION', 84, 660, t, 0.4, { size: 24, color: DIM });
    rgbPop('WEAKER TODAY.', 80, 560, fit('WEAKER TODAY.', 'disp', 140, 920), TXT, t, 0.45); stampText('STILL DANGEROUS', 540, 880, t, 2.0, { size: 80, rot: -0.07 }); }; };
