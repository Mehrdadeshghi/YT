// Wiki Roulette #038 — Hachikō
function akita(x, y, s, o = {}) {          // sitting Akita, facing right
  g.save(); g.translate(x, y); g.scale(s * (o.dir || 1), s); const C = o.col || '#E8D2B0', D = o.shade || '#C9AE88';
  g.fillStyle = D; g.beginPath(); g.ellipse(-50, -40, 30, 34, 0, 0, 6.283); g.fill();
  g.fillStyle = C; g.beginPath(); g.moveTo(-70, 0); g.quadraticCurveTo(-80, -110, 0, -140); g.quadraticCurveTo(50, -130, 40, 0); g.closePath(); g.fill();
  g.fillRect(10, -60, 22, 60); g.fillRect(-10, -50, 20, 50);
  g.beginPath(); g.ellipse(30, -170, 46, 40, 0, 0, 6.283); g.fill(); g.beginPath(); g.moveTo(60, -180); g.lineTo(100, -160); g.lineTo(62, -148); g.fill();
  g.fillStyle = D; g.beginPath(); g.moveTo(0, -196); g.lineTo(10, -236); g.lineTo(30, -204); g.fill(); g.beginPath(); g.moveTo(34, -206); g.lineTo(50, -244); g.lineTo(62, -198); g.fill();
  g.fillStyle = '#1A120C'; g.beginPath(); g.arc(52, -178, 5, 0, 6.283); g.fill(); g.beginPath(); g.arc(98, -160, 6, 0, 6.283); g.fill();
  g.strokeStyle = D; g.lineWidth = 14; g.lineCap = 'round'; g.beginPath(); g.arc(-70, -60, 26, 0.5, 4.2); g.stroke();
  g.restore();
}
function station(t, o = {}) {
  const sky = g.createLinearGradient(0, 0, 0, 1200); sky.addColorStop(0, o.sky1 || '#151821'); sky.addColorStop(1, o.sky2 || '#3A3C48'); g.fillStyle = sky; g.fillRect(0, 0, W, H);
  g.fillStyle = '#26262C'; g.fillRect(0, 760, W, 300); g.fillStyle = '#1C1C21'; for (let i = 0; i < 6; i++) g.fillRect(40 + i * 180, 800, 120, 220);
  g.fillStyle = '#EDE6D8'; rrect(330, 780, 420, 60, 8); g.fill(); text('SHIBUYA', 540, 825, 'ui', 42, PINK, { align: 'center' });
  g.fillStyle = '#2E2B26'; g.fillRect(0, 1060, W, H - 1060);
}
VIS.open = (K) => { K(1.5, 'pop', 0.6, 500);
  return (t) => { station(t); akita(560, 1180, 1.6, {}); hookPhoto(t, 'lead', { y: 800, h: 470, focus: [0.5, 0.35] }); tag(t); hook(t, EP.hook, 500); }; };
VIS[0] = (K) => { K(1.0, 'swish', 0.5); K(3.0, 'pop', 0.8, 700);
  return (t) => { station(t); akita(380, 1180, 1.4, {}); const mx = lerp(1150, 560, ease((t - 1.0) / 2)); person(mx, 1180, 6.5, '#5A5A66');
    tag(t, 0, 4); popNum('EVERY DAY', 80, 520, fit('EVERY DAY', 'disp', 150, 920), TXT, t, 0.45); label('PROFESSOR UENO + HACHIKŌ', 84, 580, t, 1.0, { color: GOLD });
    if (t > 3.0) { const h = spring(t - 3.0, 300, 14); g.save(); g.translate(470, 900); g.scale(h, h); g.fillStyle = RED; g.beginPath(); g.moveTo(0, 12); g.bezierCurveTo(-30, -14, -18, -40, 0, -22); g.bezierCurveTo(18, -40, 30, -14, 0, 12); g.fill(); g.restore(); } }; };
VIS[1] = (K) => { K(0.5, 'pop', 0.7, 500); K(2.2, 'whoosh', 0.7); K(3.4, 'mute', 1, 1.2);
  return (t) => { station(t, { sky1: '#0E1016', sky2: '#22242C' }); akita(380, 1180, 1.4, {});
    const tx = lerp(-1200, 0, ease((t - 1.6) / 1.2)) + (t > 3.6 ? (t - 3.6) * 900 : 0); g.fillStyle = '#5A6A4A'; g.fillRect(tx, 860, 1100, 170); g.fillStyle = '#CFE0C0'; for (let i = 0; i < 8; i++) g.fillRect(tx + 40 + i * 130, 890, 80, 50);
    tag(t, 1, 4); popNum('MAY 1925', 80, 520, 150, TXT, t, 0.45); if (t > 3.4) chip('HE NEVER CAME BACK', 80, 610, t, 3.4, { size: 32, align: 'left', bg: RED, fg: TXT }); }; };
VIS[2] = (K) => { for (let i = 0; i < 9; i++) K(0.6 + i * 0.35, 'tick', 0.7); K(3.9, 'land', 0.8);
  return (t) => { const y = Math.floor(countTo(t, 0.6, 3.2, 9, 1)), season = Math.floor(t * 1.4) % 4;
    station(t, { sky1: ['#1A2030', '#232018', '#151821', '#2A2A30'][season], sky2: ['#5A6A80', '#7A5A30', '#3A3C48', '#8A8A90'][season] });
    if (season === 3 || season === 2) snowfall(t, 90, 0.8); akita(560, 1180, 1.6, {});
    tag(t, 2, 4); popNum(`${y} YEARS`, 80, 540, 150, y >= 9 ? GOLD : TXT, t, 0.45); if (t > 3.9) popNum('+ 9 MONTHS', 80, 680, 100, TXT, t, 3.9);
    label('ALMOST EVERY DAY', 84, 740, t, 4.2); }; };
VIS[3] = (K) => { K(0.6, 'hit', 0.8); K(3.0, 'pop', 0.8, 800);
  return (t) => { station(t, { sky1: '#2A1E14', sky2: '#8A6A40' });
    const s = spring(t - 0.6, 160, 18); g.save(); g.translate(0, (1 - s) * 300); g.fillStyle = '#5A5048'; g.fillRect(520, 1000, 260, 180); akita(640, 1000, 1.1, { col: '#8A6A3A', shade: '#6A4E28' }); g.restore();
    akita(330, 1180, 1.2, {});
    tag(t, 3, 4); popNum('1934', 80, 520, 200, TXT, t, 0.45); label('A BRONZE STATUE AT SHIBUYA', 84, 580, t, 1.0);
    if (t > 3.0) chip('HE WAS STILL ALIVE', 80, 670, t, 3.0, { size: 34, align: 'left' }); }; };
