// Wiki Roulette #022 — Lake Nyos disaster: bespoke CINE visuals
const LAKE_B = '#2F6FA6', LAKE_R = '#8E1B14', GAS = [168, 186, 150];
const lakeCol = (u) => { const a = [47, 111, 166], b = [142, 27, 20]; return `rgb(${a.map((v, i) => Math.round(lerp(v, b[i], u))).join(',')})`; };

// dusk landscape: crater rim and the lake, seen from the side
function landscape(t, o = {}) {
  const sky = g.createLinearGradient(0, 0, 0, 1300); sky.addColorStop(0, '#07090F'); sky.addColorStop(1, '#1B2330'); g.fillStyle = sky; g.fillRect(0, 0, W, H);
  { const mg = g.createRadialGradient(830, 800, 0, 830, 800, 260); mg.addColorStop(0, 'rgba(230,225,210,0.25)'); mg.addColorStop(1, 'rgba(230,225,210,0)'); g.fillStyle = mg; g.fillRect(570, 540, 520, 520);
    g.fillStyle = '#E6E1D2'; g.beginPath(); g.arc(830, 800, 46, 0, 6.283); g.fill(); }
  g.fillStyle = '#10151C'; g.beginPath(); g.moveTo(0, 1010); for (let x = 0; x <= W; x += 40) g.lineTo(x, 960 + Math.sin(x / 140) * 40 + Math.sin(x / 57) * 12); g.lineTo(W, H); g.lineTo(0, H); g.fill();
  g.fillStyle = '#0A0D11'; g.beginPath(); g.moveTo(0, 1180); g.lineTo(120, 1080); g.lineTo(260, 1110); g.lineTo(820, 1110); g.lineTo(960, 1070); g.lineTo(W, 1150); g.lineTo(W, H); g.lineTo(0, H); g.fill();
  g.save(); g.beginPath(); g.ellipse(540, 1112, 300, 26, 0, 0, 6.283); g.fillStyle = lakeCol(o.red || 0); g.fill(); g.clip();
  g.strokeStyle = 'rgba(255,255,255,0.18)'; g.lineWidth = 2; for (let i = 0; i < 6; i++) { const x = 300 + ((i * 97 + t * 30) % 480); g.beginPath(); g.moveTo(x, 1108 + (i % 3) * 6); g.lineTo(x + 50, 1108 + (i % 3) * 6); g.stroke(); }
  g.restore();
  g.fillStyle = 'rgba(200,210,220,0.05)'; for (let i = 0; i < 5; i++) { g.beginPath(); g.ellipse(300 + i * 130 + Math.sin(t * 0.3 + i) * 30, 1085, 160, 18, 0, 0, 6.283); g.fill(); }
}
// cross-section of the crater lake; co2 = 0..1 fill of dissolved gas at the bottom
const SEC = { x0: 140, x1: 940, top: 760, bot: 1150 };
const CO2 = []; { const r = rng(221); for (let i = 0; i < 700; i++) CO2.push({ u: r(), v: Math.pow(r(), 0.6), s: 1.5 + r() * 2.5, ph: r() * 6 }); }
function basinY(x) { const u = (x - SEC.x0) / (SEC.x1 - SEC.x0); return SEC.top + (SEC.bot - SEC.top) * Math.sin(Math.PI * clamp(u)) ** 0.7; }
function section(t, o = {}) {
  atmosphere(t, { x: 540, y: 950, r: 800, c: 'rgba(67,150,217,0.08)' });
  g.fillStyle = '#231E19'; g.beginPath(); g.moveTo(0, 700); g.lineTo(SEC.x0 - 40, 690); for (let x = SEC.x0; x <= SEC.x1; x += 10) g.lineTo(x, basinY(x)); g.lineTo(SEC.x1 + 40, 690); g.lineTo(W, 700); g.lineTo(W, 1300); g.lineTo(0, 1300); g.fill();
  g.strokeStyle = '#4A3F33'; g.lineWidth = 4; g.beginPath(); for (let x = SEC.x0; x <= SEC.x1; x += 10) x === SEC.x0 ? g.moveTo(x, basinY(x)) : g.lineTo(x, basinY(x)); g.stroke();
  const bulge = o.bulge || 0;
  g.save(); g.beginPath(); g.moveTo(SEC.x0, SEC.top); for (let x = SEC.x0; x <= SEC.x1; x += 10) g.lineTo(x, SEC.top - bulge * 40 * Math.sin(Math.PI * (x - SEC.x0) / (SEC.x1 - SEC.x0)) ** 4);
  for (let x = SEC.x1; x >= SEC.x0; x -= 10) g.lineTo(x, basinY(x)); g.closePath();
  const wg = g.createLinearGradient(0, SEC.top, 0, SEC.bot); wg.addColorStop(0, lakeCol(o.red || 0)); wg.addColorStop(1, '#0B1A26'); g.fillStyle = wg; g.fill(); g.clip();
  const rise = o.rise || 0;
  for (const p of CO2) { if (p.u > (o.co2 ?? 1)) continue; const x = lerp(SEC.x0 + 30, SEC.x1 - 30, (p.u * 7.31) % 1);
    const yb = lerp(basinY(x) - 10, SEC.top + 140, 1 - p.v), y = yb - rise * (yb - SEC.top + 60) * (0.6 + 0.4 * p.v) - Math.sin(t * 2 + p.ph) * 2;
    g.fillStyle = `rgba(215,230,200,${0.55 * (1 - rise * 0.6)})`; g.beginPath(); g.arc(x, y, p.s, 0, 6.283); g.fill(); }
  g.restore();
}
function gasCloud(t, front, y0, o = {}) {          // a low cloud that has flowed down the slope up to x = front
  const r = rng(o.seed || 3);
  for (let i = 0; i < 90; i++) { const u = r(), x = lerp(o.x0 ?? 150, front, u) + Math.sin(t * 0.8 + i) * 12, y = (o.slope ? o.slope(x) : y0) - r() * 70 - 10;
    const rr = 50 + r() * 60; g.fillStyle = `rgba(${GAS.join(',')},${0.07 + 0.05 * r()})`; g.beginPath(); g.ellipse(x, y, rr * 1.6, rr * 0.6, 0, 0, 6.283); g.fill(); }
}

// ---- OPEN
VIS.open = (K) => {
  K(3.5, 'thump', 0.6); K(4.2, 'thump', 0.6);
  return (t) => {
    landscape(t); photo(t, 'lake', 80, 860, 920, 500, { zoom: [1, 1.08], dur: 5.5 }); tag(t); hook(t, EP.hook, 500);
    chip('NO FLOOD', 80, 820, t, 3.5, { size: 30, align: 'left', bg: '#2B2A28', fg: TXT });
    chip('NO FIRE', 330, 820, t, 4.2, { size: 30, align: 'left', bg: '#2B2A28', fg: TXT });
  };
};
// ---- 0: where + the gas inside
VIS[0] = (K) => {
  K(1.3, 'land', 0.6); K(3.35, 'whoosh', 0.6); K(4.3, 'riser', 0.4, 1.8);
  return (t) => {
    const sw = spring(t - 3.3, 180, 26);
    if (sw < 0.999) { g.save(); g.globalAlpha = clamp(1 - sw);
      atmosphere(t); const cam = camLerp(t, 0.2, 28, 11, [15, 3, 40], [10.3, 6.3, 5], 900); darkMap(cam);
      const [x, y] = cam.P(10.30, 6.44); pinAt(x, y, t, 1.3, 'LAKE NYOS', { size: 64, left: false });
      label('CAMEROON · WEST AFRICA', 80, 760, t, 1.6, { color: GOLD });
      tag(t, 0, 6); rise('AN OLD', 80, 520, 'disp', 150, TXT, t, 0.5); rise('VOLCANO', 80, 670, 'disp', 150, GOLD, t, 0.6);
      g.restore(); }
    if (sw > 0.001) { g.save(); g.globalAlpha = clamp(sw); g.translate(0, 200 * (1 - sw));
      section(t, { co2: clamp((t - 3.6) / 2) }); tag(t, 0, 6);
      rise('DEEP DOWN:', 80, 500, 'disp', 110, TXT, t, 3.4); popNum('CO₂', 80, 640, 150, GOLD, t, 4.6);
      label('DISSOLVED IN THE WATER', 84, 700, t, 4.9); g.restore(); }
  };
};
// ---- 1: August 21, 1986 — it all came up
VIS[1] = (K) => {
  K(0.5, 'pop', 0.7, 500); K(2.3, 'riser', 0.7, 1.3); K(3.4, 'hit', 1); K(4.5, 'whoosh', 0.9); K(4.6, 'splash', 0.9);
  return (t) => {
    const upw = clamp((t - 2.4) / 1.4) ** 2, bulge = clamp((t - 3.1) / 0.5) * (1 - clamp((t - 4.4) / 0.6)), col = spring(t - 4.5, 60, 9);
    g.save(); g.translate(shake(t, 3.4, 18), 0);
    section(t, { co2: 1, rise: upw, bulge });
    if (col > 0.001) {                     // the foam column: ruler says 100 m
      const hgt = 250 * col, r = rng(8);
      for (let i = 0; i < 60; i++) { const u = r(), y = SEC.top - hgt * u, w = 30 + 70 * (1 - u) + Math.sin(t * 9 + i) * 8;
        g.fillStyle = `rgba(235,242,245,${0.12 + 0.15 * r()})`; g.beginPath(); g.ellipse(540 + (r() - 0.5) * w, y, w * 0.6, 26, 0, 0, 6.283); g.fill(); }
      g.strokeStyle = GOLD; g.lineWidth = 4; g.beginPath(); g.moveTo(820, SEC.top); g.lineTo(820, SEC.top - hgt); g.moveTo(800, SEC.top - hgt); g.lineTo(840, SEC.top - hgt); g.stroke();
      text('100 M', 850, SEC.top - hgt + 70, 'disp', 64, GOLD, { alpha: col * 2 - 1 }); }
    g.restore();
    tag(t, 1, 6); rise('AUGUST 21, 1986', 80, 440, 'disp', fit('AUGUST 21, 1986', 'disp', 120, 920), TXT, t, 0.5);
    flash(t, 3.4, 0.3);
  };
};
// ---- 2: the gas rolls downhill
const SLOPE = (x) => 720 + (x / W) ** 1.4 * 430 + Math.sin(x / 70) * 8;
VIS[2] = (K) => {
  K(0.6, 'pop', 0.8, 600); K(1.8, 'whoosh', 0.8); K(3.0, 'riser', 0.5, 1.2); K(3.4, 'thump', 0.8);
  return (t) => {
    atmosphere(t, { x: 300, y: 800, r: 700, c: 'rgba(168,186,150,0.06)' });
    g.fillStyle = '#17150F'; g.beginPath(); g.moveTo(0, SLOPE(0)); for (let x = 0; x <= W; x += 20) g.lineTo(x, SLOPE(x)); g.lineTo(W, H); g.lineTo(0, H); g.fill();
    g.fillStyle = LAKE_B; g.beginPath(); g.ellipse(120, SLOPE(120) - 4, 110, 14, 0.12, 0, 6.283); g.fill();
    for (let i = 0; i < 6; i++) { const x = 760 + i * 50, y = SLOPE(x); g.fillStyle = '#3A342B'; g.fillRect(x - 16, y - 36, 32, 30); g.beginPath(); g.moveTo(x - 22, y - 36); g.lineTo(x, y - 56); g.lineTo(x + 22, y - 36); g.fill(); }
    const front = lerp(150, 1060, ease((t - 1.8) / 3.2));
    if (t > 1.6) gasCloud(t, front, 0, { slope: SLOPE, x0: 60, seed: 5 });
    tag(t, 2, 6);
    popNum(fmt(countTo(t, 0.55, 1.1, 300000, 0.6)), 80, 540, 150, GOLD, t, 0.5);
    label('TONS OF CO₂ · UP TO', 84, 600, t, 0.7);
    chip('HEAVIER THAN AIR ↓', 80, 690, t, 2.4, { size: 30, align: 'left' });
    chip('20–50 KM/H', 80, 780, t, 3.4, { size: 30, align: 'left', bg: '#2B2A28', fg: TXT });
  };
};
// ---- 3: 25 km — the villages
VIS[3] = (K) => {
  K(0.6, 'sonar', 0.6); K(2.2, 'pop', 0.7, 700); for (let i = 0; i < 12; i++) K(3.8 + i * 0.18, 'tick', 0.35); K(6.0, 'thump', 0.6);
  return (t) => {
    atmosphere(t); tag(t, 3, 6);
    const cx = 540, cy = 720, R = 300 * spring(t - 0.5, 90, 16);
    const r = rng(12); g.save(); g.beginPath(); g.arc(cx, cy, Math.max(1, R), 0, 6.283); g.clip();
    for (let i = 0; i < 70; i++) { const a = r() * 6.283, d = Math.sqrt(r()) * 300 * clamp((t - 0.6) / 2.4), x = cx + Math.cos(a) * d, y = cy + Math.sin(a) * d * 0.9;
      g.fillStyle = `rgba(${GAS.join(',')},0.10)`; g.beginPath(); g.arc(x, y, 50 + r() * 40, 0, 6.283); g.fill(); } g.restore();
    g.strokeStyle = GOLD; g.lineWidth = 4; g.setLineDash([14, 12]); g.beginPath(); g.arc(cx, cy, Math.max(1, R), 0, 6.283); g.stroke(); g.setLineDash([]);
    g.fillStyle = LAKE_B; g.beginPath(); g.ellipse(cx, cy, 34, 22, 0, 0, 6.283); g.fill();
    if (R > 10) { g.strokeStyle = GOLD; g.beginPath(); g.moveTo(cx, cy); g.lineTo(cx + R, cy); g.stroke(); popNum('25 KM', cx + R / 2, cy - 20, 64, GOLD, t, 1.9, { align: 'center' }); }
    ['NYOS', 'KAM', 'CHA', 'SUBUM'].forEach((n, i) => chip(n, 80 + i * 225, 420, t, 2.2 + i * 0.12, { size: 30, align: 'left', bg: '#2B2A28', fg: TXT }));
    for (let i = 0; i < 12; i++) { const x = 130 + i * 74, y = 1140, off = t > 3.8 + i * 0.18;
      g.fillStyle = '#2A251E'; g.fillRect(x - 26, y - 44, 52, 44); g.beginPath(); g.moveTo(x - 32, y - 44); g.lineTo(x, y - 72); g.lineTo(x + 32, y - 44); g.fill();
      g.fillStyle = off ? '#141210' : '#FFC23D'; g.fillRect(x - 9, y - 32, 18, 16);
      if (!off) { const gr = g.createRadialGradient(x, y - 24, 0, x, y - 24, 60); gr.addColorStop(0, 'rgba(255,194,61,0.25)'); gr.addColorStop(1, 'rgba(255,194,61,0)'); g.fillStyle = gr; g.fillRect(x - 60, y - 84, 120, 120); } }
  };
};
// ---- 4: the toll, and the lake turns red
VIS[4] = (K) => {
  for (let i = 0; i < 10; i++) K(0.5 + i * 0.1, 'tick', 0.4); K(1.55, 'thump', 1); K(2.6, 'thump', 0.8); K(3.9, 'mute', 1, 0.8); K(4.3, 'riser', 0.5, 0.9); K(5.2, 'hit', 0.8);
  return (t) => {
    const red = clamp((t - 4.3) / 1.0), up = spring(t - 3.9, 160, 24);
    atmosphere(t, { x: 540, y: 950, r: 800, c: `rgba(142,27,20,${0.2 * red})` }); tag(t, 4, 6);
    g.save(); g.translate(0, -60 * up); const sc = lerp(1, 0.75, up);
    g.save(); g.translate(80, 560); g.scale(sc, sc); popNum(fmt(countTo(t, 0.5, 1.05, 1746, 0.7)), 0, 0, 210, TXT, t, 0.45); label('PEOPLE', 6, 64, t, 1.5, { size: 36 }); g.restore();
    g.save(); g.translate(80, 780 - 80 * up); g.scale(sc, sc); popNum(fmt(countTo(t, 1.7, 0.5, 3500, 0.7)), 0, 0, 130, DIM, t, 1.65); label('ANIMALS', 6, 54, t, 2.5, { size: 32, color: DIM }); g.restore();
    g.restore();
    const lk = spring(t - 3.9, 150, 20); if (lk > 0.001) {
      g.save(); g.translate(540, 1000); g.scale(lk, lk);
      const gr = g.createRadialGradient(0, 0, 0, 0, 0, 420); gr.addColorStop(0, lakeCol(red)); gr.addColorStop(1, lakeCol(red * 0.8)); g.fillStyle = gr;
      g.beginPath(); for (let i = 0; i <= 60; i++) { const a = i / 60 * 6.283, rr = 380 + Math.sin(a * 3) * 22 + Math.sin(a * 5 + 1) * 14; g.lineTo(Math.cos(a) * rr, Math.sin(a) * rr * 0.42); } g.fill();
      g.strokeStyle = '#3A342B'; g.lineWidth = 6; g.stroke(); g.restore();
      chip(red > 0.6 ? 'DEEP RED' : 'BLUE', 540, 1000, t, 4.1, { size: 34, bg: red > 0.6 ? RED : LAKE_B, fg: TXT }); }
  };
};
// ---- 5: the pipes
VIS[5] = (K) => {
  K(0.5, 'pop', 0.8, 700); K(1.6, 'thump', 0.7); K(2.2, 'bubble', 0.8); K(3.2, 'pop', 0.6, 900); K(4.2, 'bubble', 0.6);
  return (t) => {
    const flow = clamp((t - 2.0) / 3.5);
    section(t, { co2: 1 - 0.75 * flow });
    const ps = spring(t - 1.5, 160, 20);
    if (ps > 0) { const yb = basinY(540) - 20, yt = SEC.top - 80, y = lerp(yb, yt, ps);
      g.fillStyle = '#B9B2A5'; g.fillRect(528, y, 24, yb - y); g.fillStyle = '#8B8478'; g.fillRect(528, y, 6, yb - y);
      if (t > 2.0) { const r = rng(4); for (let i = 0; i < 30; i++) { const ph = wrap(t * 0.9 + r()), yy = yb - ph * (yb - yt);
          g.fillStyle = 'rgba(215,230,200,0.8)'; g.beginPath(); g.arc(540 + (r() - 0.5) * 10, yy, 3 + r() * 3, 0, 6.283); g.fill(); }
        for (let i = 0; i < 18; i++) { const ph = wrap(t * 1.3 + i / 18), a = -Math.PI / 2 + (i % 2 ? 0.3 : -0.3) * ph;
          g.fillStyle = `rgba(230,240,245,${0.7 * (1 - ph)})`; g.beginPath(); g.arc(540 + Math.cos(a) * ph * 90 * (i % 3 - 1), yt - Math.sin(-a) * ph * 160 + ph * ph * 120, 5, 0, 6.283); g.fill(); } } }
    tag(t, 5, 6);
    popNum('SINCE 2001', 80, 520, fit('SINCE 2001', 'disp', 150, 920), GOLD, t, 0.5);
    label('PIPES VENT THE GAS FROM THE BOTTOM', 84, 590, t, 1.0);
    chip('+2 MORE PIPES IN 2011', 80, 670, t, 3.2, { size: 28, align: 'left', bg: '#2B2A28', fg: TXT });
  };
};
