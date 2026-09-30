// Wiki Roulette #029 — Frank Hayes: won his first race after he had died
function horse(x, y, s, t, o = {}) {           // galloping horse + jockey, facing right
  const ph = t * (o.speed ?? 11), bob = Math.sin(ph * 2) * 5;
  g.save(); g.translate(x, y + bob * s); g.scale(s, s);
  const C = o.col || '#8A5A36';
  g.strokeStyle = C; g.lineCap = 'round';
  const legs = [[-55, 0], [-40, 1.2], [45, 2.4], [60, 3.6]];
  legs.forEach(([lx, off]) => { const a = Math.sin(ph + off) * 0.7; g.lineWidth = 11; g.beginPath(); g.moveTo(lx, 20); const kx = lx + Math.sin(a) * 30, ky = 60; g.lineTo(kx, ky); g.lineTo(kx + Math.sin(a + 0.8) * 22, 100); g.stroke(); });
  g.fillStyle = C; g.beginPath(); g.ellipse(0, 0, 85, 40, 0, 0, 6.283); g.fill(); g.fillStyle = 'rgba(255,220,180,0.18)'; g.beginPath(); g.ellipse(-5, -18, 70, 14, 0, 0, 6.283); g.fill(); g.fillStyle = C;
  g.beginPath(); g.moveTo(55, -20); g.quadraticCurveTo(90, -70, 110, -86); g.lineTo(150, -62); g.lineTo(140, -48); g.lineTo(100, -50); g.quadraticCurveTo(90, -10, 70, 10); g.closePath(); g.fill();
  g.lineWidth = 8; g.beginPath(); g.moveTo(-82, -8); g.quadraticCurveTo(-120, 0 + Math.sin(ph) * 10, -130, 40); g.stroke();
  // jockey (slumps when o.slump > 0)
  g.save(); g.translate(0, -44); g.rotate(0.25 + (o.slump || 0) * 0.5);
  g.fillStyle = o.silk || GOLD; g.beginPath(); g.ellipse(0, -18, 16, 26, 0.9, 0, 6.283); g.fill();
  g.fillStyle = '#F2D9B8'; g.beginPath(); g.arc(22, -40, 11, 0, 6.283); g.fill(); g.fillStyle = o.silk || GOLD; g.beginPath(); g.arc(22, -44, 11, Math.PI, 0); g.fill();
  g.strokeStyle = '#EDE6D8'; g.lineWidth = 7; g.beginPath(); g.moveTo(-4, 0); g.lineTo(10, 18); g.lineTo(-6, 26); g.stroke();
  g.restore(); g.restore();
}
function track(t, y = 1000) {
  const sky = g.createLinearGradient(0, 0, 0, y); sky.addColorStop(0, '#0D1116'); sky.addColorStop(1, '#3A3024'); g.fillStyle = sky; g.fillRect(0, 0, W, y);
  g.fillStyle = '#2D2217'; g.fillRect(0, y, W, H - y); g.fillStyle = '#E8E1D0';
  for (let i = -1; i < 12; i++) { const x = ((i * 110 - t * 600) % 1320 + 1320) % 1320 - 120; g.fillRect(x, y - 70, 8, 70); } g.fillRect(0, y - 70, W, 6);
}
function flatline(t, y, flatAt, o = {}) {
  g.save(); g.lineWidth = 5; g.lineJoin = 'round';
  g.strokeStyle = t > flatAt ? RED : (o.col || '#7FE0A0'); g.beginPath();
  for (let x = 80; x <= 1000; x += 4) { const tt = t - (1000 - x) / 400, dead = tt > flatAt, ph = ((tt / 0.8) % 1 + 1) % 1;
    const v = dead ? 0 : Math.exp(-(((ph - 0.4) / 0.02) ** 2)) * 60 - Math.exp(-(((ph - 0.44) / 0.02) ** 2)) * 18; x === 80 ? g.moveTo(x, y - v) : g.lineTo(x, y - v); }
  g.stroke(); g.restore();
}
// ---- OPEN
VIS.open = (K) => {
  K(2.3, 'flat', 0.9, 1.4); K(2.25, 'mute', 1, 1);
  return (t) => {
    track(t); horse(560, 1010, 2.2, t, { slump: 0.6 });
    hookPhoto(t, 'lead', { y: 760, h: 420, focus: [0.5, 0.3] });
    flatline(t, 1330, 2.3);
    tag(t); hook(t, EP.hook, 500);
  };
};
// ---- 0: the race card
VIS[0] = (K) => {
  K(0.5, 'swish', 0.6); for (let i = 0; i < 14; i++) K(2.3 + i * 0.05, 'type', 0.4); K(4.2, 'pop', 0.8, 700);
  return (t) => {
    track(t); horse(lerp(-200, 1300, clamp((t - 3.2) / 3)), 1010, 1.8, t);
    tag(t, 0, 5);
    const s = spring(t - 0.45, 170, 20); if (s <= 0) return;
    g.save(); g.translate(0, (1 - s) * 400); paper(540, 720, 860, 520, -0.02);
    text('BELMONT PARK · NEW YORK', 0, -190, 'mono', 26, '#7A7266', { align: 'center', ls: 4 });
    text('JUNE 4, 1923', 0, -120, 'serif', 64, PINK, { align: 'center' }); g.fillStyle = '#CFC6B5'; g.fillRect(-380, -90, 760, 3);
    typed('SWEET KISS', -360, -10, 'disp', 64, PINK, t, 2.3, 0.6); typed('Jockey: Frank Hayes, 22', -360, 60, 'serif', 42, PINK, t, 3.0, 0.9);
    g.restore();
  };
};
// ---- 1: 20-to-1, zero wins
VIS[1] = (K) => {
  K(0.5, 'thump', 1); K(2.6, 'pop', 0.8, 400);
  return (t) => {
    track(t, 1250); tag(t, 1, 5);
    const s = spring(t - 0.45, 260, 16); if (s > 0) { g.save(); g.translate(540, 760); g.scale(s, s); rrect(-380, -210, 760, 330, 24); g.fillStyle = '#0E0D0C'; g.fill(); g.strokeStyle = GOLD; g.lineWidth = 6; g.stroke();
      text('ODDS', 0, -140, 'mono', 32, DIM, { align: 'center', ls: 8 }); text('20 : 1', 0, 60, 'disp', 190, GOLD, { align: 'center' }); g.restore(); }
    popNum('WINS BEFORE: 0', 540, 1080, 70, TXT, t, 2.6, { align: 'center' });
  };
};
// ---- 2: the heart attack — still in the saddle
VIS[2] = (K) => {
  K(1.6, 'mute', 1, 1.2); K(1.65, 'flat', 1, 1.2); K(2.9, 'thump', 0.8);
  return (t) => {
    const slump = clamp((t - 1.7) / 0.8);
    track(t); horse(540, 1010, 2.2, t, { slump }); tag(t, 2, 5);
    flatline(t, 560, 1.65);
    label('FRANK HAYES · HEART', 80, 440, t, 0.4, { color: '#7FE0A0' });
    if (t > 2.8) chip('STILL IN THE SADDLE', 540, 760, t, 2.8, { size: 34, bg: RED, fg: TXT });
  };
};
// ---- 3: first across the line
VIS[3] = (K) => {
  K(1.3, 'hit', 1); K(1.35, 'land', 0.7); K(3.4, 'riser', 0.4, 1.2); K(4.5, 'thump', 1);
  return (t) => {
    const fin = 700, hx = lerp(-150, 900, clamp((t - 0.2) / 2.4));
    track(t, 1000); g.fillStyle = '#EDE6D8'; for (let i = 0; i < 14; i++) g.fillRect(fin, 1000 + i * 40, 20, 20); g.fillRect(fin, 640, 10, 360);
    horse(hx, 1010, 1.8, t, { slump: 1, speed: t > 2.6 ? 4 : 11 });
    if (t > 1.3 && t < 1.45) flash(t, 1.3, 0.5);
    tag(t, 3, 5); popNum('1ST', 80, 560, 220, GOLD, t, 1.3);
    if (t > 4.4) stampText('NOBODY KNEW', 540, 880, t, 4.5, { size: 80, rot: -0.1 });
  };
};
// ---- 4: Sweet Kiss of Death
VIS[4] = (K) => {
  K(0.5, 'swish', 0.5); K(2.2, 'hit', 0.9);
  return (t) => {
    atmosphere(t, { x: 540, y: 900, r: 800, c: 'rgba(255,59,48,0.10)' }); tag(t, 4, 5);
    const s = spring(t - 0.5, 200, 20); if (s > 0) { g.save(); g.translate(540, 1000); g.scale(s, s); g.strokeStyle = '#B9B2A5'; g.lineWidth = 26; g.lineCap = 'round';
      g.beginPath(); g.arc(0, 0, 110, Math.PI * 0.95, Math.PI * 2.05, false); g.stroke(); g.restore(); }
    label('NEVER RACED AGAIN', 80, 520, t, 0.6);
    rise('SWEET KISS', 80, 700, 'serif', 130, TXT, t, 2.2); rise('OF DEATH.', 80, 850, 'serif', 130, RED, t, 2.45);
  };
};
