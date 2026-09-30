// Wiki Roulette #023 — Monowi, Nebraska: bespoke CINE visuals
const SIGN = '#1F5C3A', WARM = '#FFB547';
function nightSky(t) {
  const sky = g.createLinearGradient(0, 0, 0, H); sky.addColorStop(0, '#05070C'); sky.addColorStop(0.6, '#121827'); sky.addColorStop(1, '#0A0B0D'); g.fillStyle = sky; g.fillRect(0, 0, W, H);
  const r = rng(23); for (let i = 0; i < 110; i++) { const x = r() * W, y = r() * 1000, tw = 0.4 + 0.6 * Math.abs(Math.sin(t * (0.5 + r()) + i));
    g.fillStyle = `rgba(255,250,235,${0.5 * tw * r()})`; g.fillRect(x, y, 2, 2); }
  g.fillStyle = '#0B0C0B'; g.beginPath(); g.moveTo(0, 1180); for (let x = 0; x <= W; x += 60) g.lineTo(x, 1170 + Math.sin(x / 200) * 10); g.lineTo(W, H); g.lineTo(0, H); g.fill();
}
function streetlight(x, y, on, t) {
  g.strokeStyle = '#2E2C28'; g.lineWidth = 8; g.beginPath(); g.moveTo(x, y); g.lineTo(x, y - 300); g.quadraticCurveTo(x, y - 330, x + 50, y - 330); g.stroke();
  g.fillStyle = on > 0 ? `rgba(255,190,90,${0.3 + 0.7 * on})` : '#3A3630'; g.fillRect(x + 40, y - 336, 34, 12);
  if (on > 0) { const gr = g.createRadialGradient(x + 57, y - 320, 0, x + 57, y - 320, 330); gr.addColorStop(0, `rgba(255,181,71,${0.35 * on})`); gr.addColorStop(1, 'rgba(255,181,71,0)');
    g.fillStyle = gr; g.beginPath(); g.moveTo(x + 40, y - 324); g.lineTo(x + 74, y - 324); g.lineTo(x + 230, y + 10); g.lineTo(x - 120, y + 10); g.closePath(); g.fill();
    const gl = g.createRadialGradient(x + 57, y - 326, 0, x + 57, y - 326, 60); gl.addColorStop(0, `rgba(255,220,150,${0.6 * on})`); gl.addColorStop(1, 'rgba(255,220,150,0)'); g.fillStyle = gl; g.fillRect(x - 10, y - 390, 140, 130); }
}
function roadSign(x, y, s) {
  g.save(); g.translate(x, y); g.scale(s, s);
  g.fillStyle = '#6B6A66'; g.fillRect(-150, 60, 12, 260); g.fillRect(138, 60, 12, 260);
  rrect(-250, -130, 500, 230, 18); g.fillStyle = SIGN; g.fill(); g.lineWidth = 8; g.strokeStyle = '#E9E5DA'; rrect(-238, -118, 476, 206, 12); g.stroke();
  text('MONOWI', 0, -20, 'ui', 84, '#F2F0E8', { align: 'center' }); text('POP. 1', 0, 62, 'ui', 64, '#F2F0E8', { align: 'center' });
  g.restore();
}
// ---- OPEN
VIS.open = (K) => {
  K(3.0, 'thump', 0.5);
  return (t) => {
    nightSky(t); streetlight(760, 1180, 1, t); roadSign(420, 930 + Math.sin(t * 0.8) * 2, 1.15); photo(t, 'sign', 80, 840, 920, 500, { zoom: [1, 1.08], dur: 5 });
    tag(t); hook(t, EP.hook, 500);
  };
};
// ---- 0: where, and how many there were
VIS[0] = (K) => {
  K(1.3, 'land', 0.6); K(3.0, 'riser', 0.3, 1); for (let i = 0; i < 15; i++) K(3.1 + i * 0.1, 'tick', 0.35); K(4.7, 'pop', 0.9, 700);
  return (t) => {
    atmosphere(t); const cam = camLerp(t, 0.2, 26, 10.5, [-97, 39, 36], [-98.8, 41.5, 22], 820); darkMap(cam);
    const [x, y] = cam.P(-98.33, 42.83); pinAt(x, y, t, 1.3, 'MONOWI', { size: 66 });
    tag(t, 0, 6); label('NEBRASKA · USA', 80, 420, t, 0.6, { color: GOLD });
    const n = Math.floor(countTo(t, 3.1, 1.5, 150, 0.8));
    for (let i = 0; i < 150; i++) { if (i >= n) break; const c = i % 25, r = Math.floor(i / 25); person(130 + c * 34.5, 980 + r * 44, 0.9, i < n ? TXT : '#333'); }
    popNum(fmt(n), 80, 600, 170, n >= 150 ? GOLD : TXT, t, 3.0); label('PEOPLE · 1930s', 84, 660, t, 3.2);
  };
};
// ---- 1: they left, one by one. Then Rudy.
VIS[1] = (K) => {
  for (let i = 0; i < 20; i++) K(0.55 + i * 0.08, 'tick', 0.4); K(2.1, 'pop', 0.6, 400); K(3.3, 'mute', 1, 0.8); K(3.4, 'thump', 0.8); K(4.8, 'land', 0.5);
  return (t) => {
    atmosphere(t); tag(t, 1, 6);
    const left = Math.round(countTo(t, 0.5, 1.6, 2, 0.7, 150)), grid = spring(t - 2.1, 150, 22);
    if (grid < 0.999) { g.save(); g.globalAlpha = clamp(1 - grid);
      for (let i = 0; i < 150; i++) { const alive = i < 2 || (i * 97 % 150) < left - 2;
        person(110 + (i % 15) * 61, 660 + Math.floor(i / 15) * 50, 1.1, alive ? TXT : 'rgba(255,255,255,0.06)'); }
      g.restore(); }
    popNum(String(left > 2 ? left : t < 3.4 ? 2 : 1), 80, 570, 150, left > 2 ? TXT : GOLD, t, 0.5);
    if (grid > 0.001) { g.save(); g.globalAlpha = clamp(grid);
      const rudy = clamp((t - 3.4) / 0.9);
      person(400, 900, 6, WARM); g.save(); g.globalAlpha *= 1 - rudy; g.translate(0, -60 * rudy); person(700, 900, 6, TXT); g.restore();
      label('ELSIE', 400, 1070, t, 4.8, { align: 'center', color: GOLD });
      if (t > 3.4) label('RUDY · 2004', 720, 1070, t, 3.4, { align: 'center', color: DIM });
      g.restore(); }
  };
};
// ---- 2: every job in town
VIS[2] = (K) => {
  const JOBS = [['MAYOR', 1.0], ['CLERK', 1.65], ['TREASURER', 2.25], ['LIBRARIAN', 3.1]];
  JOBS.forEach(([, at], i) => { K(at, 'thump', 0.7 + i * 0.1); K(at, 'pop', 0.6, 600 + i * 150); });
  return (t) => {
    atmosphere(t, { x: 300, y: 900, r: 700, c: 'rgba(255,181,71,0.10)' }); tag(t, 2, 6);
    person(270, 950, 7.5, WARM); label('ELSIE EILER', 270, 1150, t, 0.5, { align: 'center', color: GOLD });
    JOBS.forEach(([job, at], i) => { const s = spring(t - at, 300, 18); if (s <= 0) return;
      g.save(); g.translate(720, 460 + i * 150); g.rotate((i % 2 ? 1 : -1) * 0.03); g.scale(s, s);
      rrect(-230, -60, 460, 120, 16); g.fillStyle = PAPER; g.fill(); g.fillStyle = RED; g.fillRect(-230, -60, 460, 26);
      text('HELLO, I AM THE', 0, -40, 'mono', 18, '#fff', { align: 'center', ls: 3 }); text(job, 0, 40, 'disp', job.length > 7 ? 58 : 72, PINK, { align: 'center' });
      g.restore(); });
  };
};
// ---- 3: she issued herself a liquor license
VIS[3] = (K) => {
  K(0.5, 'swish', 0.6); K(1.4, 'type', 0.8); K(2.2, 'type', 0.8); K(2.95, 'scratch'); K(2.97, 'thump', 1.2); K(3.6, 'pop', 0.8, 800);
  return (t) => {
    atmosphere(t); tag(t, 3, 6);
    const s = spring(t - 0.45, 160, 20); if (s <= 0) return;
    g.save(); g.translate(0, (1 - s) * 400); paper(540, 820, 820, 700, -0.02);
    text('STATE OF NEBRASKA', 0, -270, 'mono', 26, '#7A7266', { align: 'center', ls: 5 }); text('LIQUOR LICENSE', 0, -200, 'serif', 70, PINK, { align: 'center' });
    g.fillStyle = '#CFC6B5'; g.fillRect(-340, -160, 680, 3);
    text('ISSUED TO:', -340, -70, 'mono', 26, '#7A7266', { ls: 3 }); typed('ELSIE EILER', -340, -20, 'ui', 56, PINK, t, 1.3, 0.5);
    text('ISSUED BY:', -340, 80, 'mono', 26, '#7A7266', { ls: 3 }); typed('ELSIE EILER, MAYOR', -340, 130, 'ui', 56, PINK, t, 2.1, 0.6);
    if (t > 2.7) { g.fillStyle = 'rgba(255,194,61,0.45)'; g.fillRect(-350, 88, 590 * clamp((t - 2.7) / 0.25), 58); typed('ELSIE EILER, MAYOR', -340, 130, 'ui', 56, PINK, t, 2.1, 0.6); }
    g.restore();
    stampText('APPROVED', 700, 1040, t, 2.95, { size: 80, rot: -0.14 });
    shake(t, 2.95); chip('MONOWI TAVERN · THE ONLY BAR', 540, 440, t, 3.6, { size: 28 });
  };
};
// ---- 4: 5,000 books for Rudy
VIS[4] = (K) => {
  for (let i = 0; i < 20; i++) K(0.9 + i * 0.08, 'tick', 0.35); K(2.6, 'land', 0.7); K(3.3, 'pop', 0.7, 500);
  const BOOKS = []; { const r = rng(44); for (let sh = 0; sh < 4; sh++) { let x = 110; while (x < 960) { const w = 16 + r() * 22; BOOKS.push({ sh, x, w, h: 90 + r() * 45, c: ['#7A2E2A', '#2F4A6A', '#3E5A3A', '#8A6A2E', '#5A3E6A', '#9A8A70'][Math.floor(r() * 6)], o: r() }); x += w + 3; } } }
  return (t) => {
    atmosphere(t, { x: 540, y: 850, r: 700, c: 'rgba(255,181,71,0.10)' }); tag(t, 4, 6);
    const fill = clamp((t - 0.8) / 1.8);
    for (let sh = 0; sh < 4; sh++) { const y = 700 + sh * 150; g.fillStyle = '#3A2A1C'; g.fillRect(90, y, 900, 16); }
    for (const b of BOOKS) { if (b.o > fill * 1.02) continue; const y = 700 + b.sh * 150; g.fillStyle = b.c; g.fillRect(b.x, y - b.h, b.w, b.h); g.fillStyle = 'rgba(255,255,255,0.15)'; g.fillRect(b.x + 3, y - b.h + 10, b.w - 6, 4); }
    popNum(fmt(Math.round(countTo(t, 0.8, 1.8, 5000, 0.8) / 10) * 10), 80, 520, 160, fill >= 1 ? GOLD : TXT, t, 0.7); label('BOOKS · APPROX.', 84, 580, t, 1.0);
    const s = spring(t - 3.3, 260, 18); if (s > 0) { g.save(); g.translate(540, 1060); g.scale(s, s); rrect(-280, -52, 560, 104, 12); g.fillStyle = '#2A1E14'; g.fill(); g.strokeStyle = WARM; g.lineWidth = 4; g.stroke();
      text("RUDY'S LIBRARY", 0, 20, 'serif', 54, WARM, { align: 'center' }); g.restore(); }
  };
};
// ---- 5: the road plan keeps the lights on
VIS[5] = (K) => {
  K(0.6, 'type', 0.7); K(0.9, 'type', 0.7); K(1.4, 'scratch', 0.8); for (let i = 0; i < 5; i++) K(2.8 + i * 0.22, 'pop', 0.7, 500 + i * 120);
  return (t) => {
    nightSky(t);
    for (let i = 0; i < 5; i++) { const on = spring(t - (2.8 + i * 0.22), 200, 14); streetlight(120 + i * 200, 1180 - i * 0, clamp(on), t); }
    tag(t, 5, 6);
    const f = spring(t - 0.5, 200, 22); if (f > 0 && t < 2.9) { g.save(); g.globalAlpha = clamp(f) * (1 - clamp((t - 2.5) / 0.4)); paper(540, 600, 700, 360, 0.02);
      text('ANNUAL MUNICIPAL', 0, -90, 'mono', 26, '#7A7266', { align: 'center', ls: 5 }); text('ROAD PLAN', 0, -20, 'serif', 76, PINK, { align: 'center' });
      text('FILED BY: ELSIE EILER', 0, 80, 'mono', 28, PINK, { align: 'center', ls: 2 }); g.restore(); stampText('FILED', 790, 720, t, 1.4, { size: 60, rot: -0.12, color: '#2F7A4A' }); }
    if (t > 3.0) { rise('THE LIGHTS', 80, 520, 'disp', 140, TXT, t, 3.0); rise('STAY ON.', 80, 670, 'disp', 140, WARM, t, 3.15); }
  };
};
