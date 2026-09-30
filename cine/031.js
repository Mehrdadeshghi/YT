// Wiki Roulette #031 — Great Molasses Flood (Boston, 1919)
const MOL = '#5A2E0E', MOL2 = '#8A4A16';
function street(t, o = {}) {
  const sky = g.createLinearGradient(0, 0, 0, 1100); sky.addColorStop(0, o.sky1 || '#1A2230'); sky.addColorStop(1, o.sky2 || '#55606A'); g.fillStyle = sky; g.fillRect(0, 0, W, 1100);
  const r = rng(31); for (let i = 0; i < 9; i++) { const x = i * 130 - 20, h = 220 + r() * 260, w = 120 + r() * 30; g.fillStyle = i % 2 ? '#2B2D33' : '#34363C'; g.fillRect(x, 1100 - h, w, h);
    g.fillStyle = 'rgba(255,210,140,0.35)'; for (let yy = 1100 - h + 30; yy < 1070; yy += 50) for (let xx = x + 16; xx < x + w - 20; xx += 34) if (r() > 0.4) g.fillRect(xx, yy, 14, 22); }
  g.fillStyle = '#1F1B18'; g.fillRect(0, 1100, W, H - 1100);
  g.fillStyle = '#3A3530'; g.fillRect(0, 880, W, 16); for (let x = 20; x < W; x += 140) g.fillRect(x, 896, 14, 204);   // elevated railway
}
function wave(t, front, hgt, o = {}) {               // molasses surge up to x = front, crest height hgt px
  if (front <= -50) return; const base = 1100, glossy = o.glossy ?? 1;
  g.save(); const gr = g.createLinearGradient(0, base - hgt, 0, base); gr.addColorStop(0, MOL2); gr.addColorStop(1, MOL); g.fillStyle = gr;
  g.beginPath(); g.moveTo(-10, H); g.lineTo(-10, base - hgt * 0.55);
  for (let x = -10; x <= front; x += 12) { const u = clamp((front - x) / 260), y = base - hgt * (0.55 + 0.45 * Math.sin(Math.PI * clamp(u * 0.9))) + Math.sin(x / 40 + t * 3) * 6; g.lineTo(x, y); }
  g.quadraticCurveTo(front + 60, base - hgt * 0.3, front + 90, base); g.lineTo(front + 90, H); g.closePath(); g.fill();
  if (glossy > 0) { g.strokeStyle = `rgba(255,200,140,${0.35 * glossy})`; g.lineWidth = 4; g.beginPath(); for (let x = 0; x <= front - 40; x += 12) { const y = base - hgt * 0.8 + Math.sin(x / 30 + t * 4) * 8; x ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke(); }
  g.restore();
}
function tank(x, y, fill, burst = 0, t = 0) {
  g.save(); g.translate(x, y); const w = 360, h = 420;
  if (burst > 0) { g.rotate(0); }
  g.fillStyle = '#4A4E54'; g.fillRect(-w / 2, -h, w, h); g.beginPath(); g.ellipse(0, -h, w / 2, 30, 0, 0, 6.283); g.fill();
  g.fillStyle = 'rgba(0,0,0,0.25)'; for (let yy = -h + 30; yy < 0; yy += 60) for (let xx = -w / 2 + 16; xx < w / 2; xx += 40) g.fillRect(xx, yy, 6, 6);
  g.save(); g.beginPath(); g.rect(-w / 2 + 12, -h, w - 24, h); g.clip(); g.fillStyle = 'rgba(138,74,22,0.55)'; g.fillRect(-w / 2, -h * fill, w, h * fill); g.restore();
  if (burst > 0) { g.strokeStyle = '#111'; g.lineWidth = 6; const r = rng(4); for (let k = 0; k < 4; k++) { let cx = (r() - 0.5) * w * 0.6, cy = -h * 0.6; g.beginPath(); g.moveTo(cx, cy); for (let i = 0; i < 8 * burst; i++) { cx += (r() - 0.5) * 50; cy += 30; g.lineTo(cx, cy); } g.stroke(); } }
  g.restore();
}
// ---- OPEN
VIS.open = (K) => {
  K(0.3, 'splash', 0.8);
  return (t) => {
    street(t); wave(t, lerp(760, 1150, clamp(t / 4)), 380);
    hookPhoto(t, 'lead', { y: 790, h: 460 });
    tag(t); hook(t, EP.hook, 500);
  };
};
// ---- 0: one tank, 8.7 million liters
VIS[0] = (K) => { K(0.5, 'thump', 0.8); for (let i = 0; i < 16; i++) K(1.0 + i * 0.1, 'tick', 0.4); K(2.7, 'land', 0.7);
  return (t) => {
    street(t); tank(700, 1100, 0.15 + 0.8 * ease((t - 0.8) / 1.8), 0, t); tag(t, 0, 5);
    popNum('JAN 15, 1919', 80, 440, fit('JAN 15, 1919', 'disp', 110, 600), TXT, t, 0.45);
    popNum((countTo(t, 1.0, 1.7, 8.7, 0.7)).toFixed(1), 80, 610, 170, GOLD, t, 0.9); label('MILLION LITERS OF MOLASSES', 84, 670, t, 1.3);
  }; };
// ---- 1: it burst — 8 m, 56 km/h
VIS[1] = (K) => { K(0.9, 'mute', 1, 0.4); K(1.0, 'crack', 1.2); K(1.1, 'hit', 1.1); K(1.4, 'splash', 1.2); for (let i = 0; i < 14; i++) K(3.6 + i * 0.06, 'tick', 0.4);
  return (t) => {
    const b = clamp((t - 1.0) / 0.3), front = t < 1.2 ? -100 : lerp(500, 1300, ease((t - 1.2) / 2.8));
    g.save(); g.translate(shake(t, 1.0, 22), 0);
    street(t); if (t < 1.6) tank(700, 1100, 0.95, b, t);
    wave(t, t < 1.2 ? -100 : front, 330 * clamp((t - 1.1) / 0.5));
    g.restore(); flash(t, 1.0, 0.3);
    tag(t, 1, 5);
    if (t > 2.2) { g.strokeStyle = GOLD; g.lineWidth = 5; g.beginPath(); g.moveTo(80, 1100); g.lineTo(80, 770); g.moveTo(64, 770); g.lineTo(96, 770); g.stroke(); popNum('UP TO 8 M', 110, 790, 64, GOLD, t, 2.3); }
    popNum(`${Math.round(countTo(t, 3.6, 0.9, 56, 0.7))} KM/H`, 80, 560, 170, TXT, t, 3.5);
  }; };
// ---- 2: in the cold it thickened — like glue
VIS[2] = (K) => { K(0.5, 'swish', 0.5); K(2.4, 'riser', 0.4, 1.2); K(3.8, 'thump', 0.9);
  return (t) => {
    const cold = clamp((t - 2.0) / 1.6);
    street(t, { sky1: '#141B26', sky2: '#3E4A58' }); wave(t * (1 - cold * 0.95), 1300, 260, { glossy: 1 - cold });
    for (let i = 0; i < 3; i++) { const x = 300 + i * 220, sink = 30 + cold * 40; g.save(); g.beginPath(); g.rect(0, 0, W, 1100 - 260 * 0.45 + 40); g.clip(); person(x, 1100 - 260 * 0.55 + sink, 3, '#2B2622'); g.restore(); }
    const temp = Math.round(lerp(6, -1, cold));
    g.save(); g.translate(900, 560); rrect(-26, -180, 52, 240, 26); g.fillStyle = '#EDE6D8'; g.fill(); const lvl = lerp(160, 60, cold);
    g.fillStyle = cold > 0.5 ? '#6FB7E8' : RED; g.fillRect(-12, 40 - lvl, 24, lvl); g.beginPath(); g.arc(0, 60, 34, 0, 6.283); g.fill(); g.restore();
    tag(t, 2, 5); popNum(`${temp}°C`, 80, 540, 150, cold > 0.5 ? '#6FB7E8' : TXT, t, 0.45);
    if (t > 3.8) chip('THICK AS GLUE', 80, 640, t, 3.8, { size: 32, align: 'left', bg: RED, fg: TXT });
  }; };
// ---- 3: the toll
VIS[3] = (K) => { K(0.5, 'thump', 1); K(1.8, 'thump', 0.8);
  return (t) => {
    atmosphere(t); tag(t, 3, 5);
    popNum(String(Math.round(countTo(t, 0.5, 0.6, 21, 0.7))), 80, 700, 300, TXT, t, 0.45); label('DEAD', 90, 770, t, 0.9, { size: 36 });
    popNum(String(Math.round(countTo(t, 1.8, 0.6, 150, 0.7))), 520, 700, 220, DIM, t, 1.75); label('INJURED', 530, 770, t, 2.1, { size: 36, color: DIM });
  }; };
// ---- 4: the smell stayed for decades
VIS[4] = (K) => { K(0.5, 'swish', 0.5); K(2.5, 'pop', 0.8, 700);
  return (t) => {
    street(t, { sky1: '#E09A4A', sky2: '#F2D08A' });
    g.fillStyle = '#FFF1C8'; g.beginPath(); g.arc(820, 420, 70, 0, 6.283); g.fill();
    g.strokeStyle = 'rgba(138,74,22,0.55)'; g.lineWidth = 6; g.lineCap = 'round';
    for (let i = 0; i < 7; i++) { const x0 = 120 + i * 140, ph = t * 1.5 + i; g.beginPath(); for (let k = 0; k <= 20; k++) { const y = 1090 - k * 16 - ((t * 40) % 60), x = x0 + Math.sin(k * 0.6 + ph) * 18; k ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke(); }
    { const gr = g.createLinearGradient(0, 250, 0, 850); gr.addColorStop(0, 'rgba(20,12,6,0.75)'); gr.addColorStop(1, 'rgba(20,12,6,0)'); g.fillStyle = gr; g.fillRect(0, 0, W, 850); }
    tag(t, 4, 5); rise('FOR', 80, 540, 'disp', 150, GOLD, t, 0.45); rise('DECADES.', 80, 690, 'disp', fit('DECADES.', 'disp', 150, 920), TXT, t, 0.6);
    chip('IT STILL SMELLED OF MOLASSES', 80, 790, t, 2.5, { size: 28, align: 'left', bg: MOL, fg: TXT });
  }; };
