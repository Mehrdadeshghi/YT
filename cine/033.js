// Wiki Roulette #033 — Cadaver Synod (897)
const ROBE = '#6E1A1A', STONE = '#2A2622';
function candles(t, xs, y) { xs.forEach((x, i) => { g.fillStyle = '#E8DCC0'; g.fillRect(x - 8, y - 70, 16, 70); const f = 1 + 0.15 * Math.sin(t * 13 + i * 2);
  const gr = g.createRadialGradient(x, y - 84, 0, x, y - 84, 90 * f); gr.addColorStop(0, 'rgba(255,190,90,0.45)'); gr.addColorStop(1, 'rgba(255,190,90,0)'); g.fillStyle = gr; g.fillRect(x - 100, y - 190, 200, 200);
  g.fillStyle = '#FFD27A'; g.beginPath(); g.ellipse(x, y - 84, 6, 14 * f, 0, 0, 6.283); g.fill(); }); }
function hall(t) { const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, '#0B0908'); gr.addColorStop(1, '#1E1712'); g.fillStyle = gr; g.fillRect(0, 0, W, H);
  g.fillStyle = STONE; for (let i = 0; i < 4; i++) { const x = 60 + i * 300; g.fillRect(x, 300, 70, 900); g.beginPath(); g.arc(x + 185, 420, 115, Math.PI, 0); g.lineTo(x + 300, 300); g.lineTo(x + 70, 300); g.fill(); }
  g.fillStyle = '#151210'; g.fillRect(0, 1180, W, H - 1180); }
function throne(x, y, s, t, o = {}) {
  g.save(); g.translate(x, y); g.scale(s, s);
  g.fillStyle = '#5A4424'; g.fillRect(-120, -360, 240, 360); g.fillStyle = '#8A6A3A'; g.fillRect(-100, -340, 200, 30); g.fillRect(-150, -120, 300, 40);
  g.fillStyle = GOLD; g.beginPath(); g.moveTo(-120, -360); g.lineTo(0, -430); g.lineTo(120, -360); g.fill();
  if (o.corpse !== false) {
    g.fillStyle = ROBE; g.beginPath(); g.moveTo(-80, -90); g.lineTo(80, -90); g.lineTo(100, 0); g.lineTo(-100, 0); g.closePath(); g.fill(); g.beginPath(); g.ellipse(0, -170, 70, 90, 0, 0, 6.283); g.fill();
    g.fillStyle = '#E8DCC0'; g.fillRect(-8, -250, 16, 140); g.fillRect(-40, -210, 80, 14);
    g.fillStyle = '#D8CDB5'; g.beginPath(); g.arc(0, -280, 40, 0, 6.283); g.fill(); g.fillStyle = '#1A140F'; g.beginPath(); g.arc(-14, -284, 9, 0, 6.283); g.arc(14, -284, 9, 0, 6.283); g.fill(); g.fillRect(-12, -258, 24, 6);
    g.fillStyle = '#EDE6D8'; g.beginPath(); g.moveTo(-34, -310); g.lineTo(0, -390); g.lineTo(34, -310); g.closePath(); g.fill(); g.fillStyle = GOLD; g.fillRect(-4, -380, 8, 60);
  }
  g.restore();
}
// ---- OPEN
VIS.open = (K) => { K(3.2, 'thump', 0.9);
  return (t) => { hall(t); candles(t, [160, 920], 1330); throne(540, 1330, 1.1, t);
    hookPhoto(t, 'lead', { y: 790, h: 470, focus: [0.5, 0.4] }); tag(t); hook(t, EP.hook, 500); }; };
// ---- 0: dead nine months — dug up
VIS[0] = (K) => { for (let i = 0; i < 9; i++) K(0.8 + i * 0.13, 'tick', 0.6); K(3.4, 'riser', 0.5, 1); K(4.4, 'thump', 1);
  return (t) => { hall(t); candles(t, [140, 940], 1180); tag(t, 0, 5);
    popNum(`${Math.min(9, Math.floor(countTo(t, 0.8, 1.2, 9, 1) + 1e-6))} MONTHS`, 80, 520, 150, TXT, t, 0.6); label('POPE FORMOSUS · DEAD', 84, 580, t, 0.9);
    const up = spring(t - 3.4, 60, 12); g.save(); g.beginPath(); g.rect(0, 0, W, 1180); g.clip();
    g.translate(540, 1180 + 300 * (1 - up)); g.fillStyle = '#4A3520'; g.beginPath(); g.moveTo(-90, -300); g.lineTo(90, -300); g.lineTo(120, -200); g.lineTo(80, 0); g.lineTo(-80, 0); g.lineTo(-120, -200); g.closePath(); g.fill();
    g.strokeStyle = '#7A5A30'; g.lineWidth = 6; g.stroke(); g.fillStyle = GOLD; g.fillRect(-6, -250, 12, 150); g.fillRect(-40, -210, 80, 12); g.restore();
    label('ORDER OF POPE STEPHEN VI', 84, 660, t, 3.6, { color: GOLD });
  }; };
// ---- 1: on the throne; a deacon answers for him
VIS[1] = (K) => { K(0.6, 'thump', 0.7); K(2.6, 'pop', 0.7, 500);
  return (t) => { hall(t); candles(t, [140, 940], 1180); throne(440, 1180, 1.2, t);
    person(800, 1180, 5, '#4A4038'); g.fillStyle = '#EDE6D8'; g.fillRect(780, 1000, 40, 12);
    const b = spring(t - 2.6, 260, 18); if (b > 0) { g.save(); g.translate(820, 780); g.scale(b, b); rrect(-150, -60, 300, 110, 30); g.fillStyle = TXT; g.fill(); g.beginPath(); g.moveTo(-20, 50); g.lineTo(-50, 90); g.lineTo(20, 50); g.fill();
      text('…', 0, 15, 'serif', 60, PINK, { align: 'center' }); g.restore(); }
    tag(t, 1, 5); label('THE CORPSE, IN PAPAL ROBES', 80, 440, t, 0.6, { color: GOLD }); label('A DEACON ANSWERED FOR HIM', 80, 490, t, 2.6);
  }; };
// ---- 2: guilty — papacy void
VIS[2] = (K) => { K(1.0, 'scratch'); K(1.02, 'hit', 1); for (let i = 0; i < 18; i++) K(2.4 + i * 0.05, 'type', 0.4);
  return (t) => { hall(t); candles(t, [140, 940], 1180); tag(t, 2, 5);
    const s = spring(t - 0.45, 170, 20); if (s > 0) { g.save(); g.translate(0, (1 - s) * 400); paper(540, 820, 820, 460, 0.02);
      text('VERDICT', 0, -150, 'mono', 30, '#7A7266', { align: 'center', ls: 8 }); typed('Papacy: null and void', -330, 60, 'serif', 60, PINK, t, 2.4, 0.9); g.restore(); }
    stampText('GUILTY', 540, 700, t, 1.0, { size: 120, rot: -0.1 }); flash(t, 1.0, 0.25);
  }; };
// ---- 3: three fingers, then the Tiber
VIS[3] = (K) => { [0.9, 1.1, 1.3].forEach((a) => K(a, 'thump', 0.7)); K(2.9, 'whoosh', 0.8); K(3.3, 'splash', 1.1);
  return (t) => {
    const sky = g.createLinearGradient(0, 0, 0, 1000); sky.addColorStop(0, '#080A10'); sky.addColorStop(1, '#1E2838'); g.fillStyle = sky; g.fillRect(0, 0, W, H);
    tag(t, 3, 5); popNum('3', 80, 640, 300, RED, t, 0.8); label('FINGERS CUT OFF', 300, 560, t, 1.3, { size: 34 });
    const fall = clamp((t - 2.9) / 0.4); if (t > 2.9 && fall < 1) { g.fillStyle = '#E8DCC0'; g.beginPath(); g.ellipse(540, lerp(700, 1060, fall * fall), 120, 36, 0.2, 0, 6.283); g.fill(); }
    waterOver(t, 1060, { c1: '#18324A' });
    if (t > 3.3) { const r = rng(6), lt = t - 3.3; for (let i = 0; i < 30; i++) { const a = -Math.PI * r(), v = 200 + r() * 500, x = 540 + Math.cos(a) * v * lt, y = 1060 + Math.sin(a) * v * lt + 900 * lt * lt; if (y > 1060) continue; g.fillStyle = 'rgba(220,235,245,0.8)'; g.beginPath(); g.arc(x, y, 4 + r() * 4, 0, 6.283); g.fill(); } }
    if (t > 3.3) popNum('THE TIBER', 80, 860, 110, '#6FB7E8', t, 3.3);
  }; };
// ---- 4: Rome turns on Stephen
VIS[4] = (K) => { for (let i = 0; i < 12; i++) K(0.5 + i * 0.12, 'thump', 0.35); K(2.9, 'mute', 1, 0.6); K(3.0, 'hit', 1);
  return (t) => { hall(t); tag(t, 4, 5);
    const n = Math.floor(clamp((t - 0.4) / 1.6) * 26); const r = rng(33); for (let i = 0; i < 26; i++) { const x = 60 + r() * 960, y = 1180 + r() * 30; if (i < n) person(x, y, 3 + r() * 1.5, '#0E0C0A'); }
    popNum('ROME TURNED', 80, 520, fit('ROME TURNED', 'disp', 140, 920), TXT, t, 0.45); popNum('ON STEPHEN VI', 80, 660, fit('ON STEPHEN VI', 'disp', 120, 920), GOLD, t, 0.9);
    stampText('STRANGLED IN PRISON · 897', 540, 900, t, 3.0, { size: 52, rot: -0.07 });
  }; };
