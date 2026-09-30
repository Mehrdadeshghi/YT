// Wiki Roulette #027 — Violet Jessop: survived the Olympic collision, the Titanic and the Britannic
const SHIPS = ['OLYMPIC', 'TITANIC', 'BRITANNIC'];
function shipRow(t, y, tIn, checks = -1) {
  SHIPS.forEach((n, i) => { const s = spring(t - tIn - i * 0.15, 260, 20); if (s <= 0) return; const x = 200 + i * 340;
    g.save(); g.translate(x, y); g.scale(s, s); liner(0, 0, 0.42, { hospital: i === 2, hull: i === 2 ? '#E9E6DE' : undefined });
    text(n, 0, 70, 'mono', 26, i === 1 ? GOLD : TXT, { align: 'center', ls: 4 });
    if (checks >= i) checkMark(0, -120, 1.3); g.restore(); });
}
// ---- OPEN
VIS.open = (K) => {
  K(2.4, 'pop', 0.7, 500); K(2.55, 'pop', 0.7, 650); K(2.7, 'pop', 0.7, 800);
  return (t) => {
    nightSea(t, 1180); waterOver(t, 1180);
    if (!hookPhoto(t, 'lead', { y: 790, h: 420, focus: [0.5, 0.25] })) liner(560, 1150, 1.1, {});
    shipRow(t, 1330, 2.4);
    tag(t); hook(t, EP.hook, 500);
  };
};
// ---- 0: 1911, Olympic hits HMS Hawke
VIS[0] = (K) => {
  K(0.5, 'pop', 0.7, 500); K(3.55, 'hit', 1.1); K(3.6, 'crack', 0.7);
  return (t) => {
    const hit = 3.55, sh = shake(t, hit, 22);
    g.save(); g.translate(sh, 0);
    nightSea(t, 1000, { hor: '#2A3440', top: '#101820' });
    liner(lerp(380, 470, clamp(t / hit)), 985, 1.05, {});
    const wx = t < hit ? lerp(1250, 800, ease((t - 1.2) / (hit - 1.2))) : 800 + (t - hit) * 20;
    g.save(); g.translate(wx, 1000); g.rotate(-0.25); g.fillStyle = '#4A5159'; g.beginPath(); g.moveTo(-160, -10); g.lineTo(150, -10); g.lineTo(190, -30); g.lineTo(160, 22); g.lineTo(-150, 22); g.closePath(); g.fill();
    g.fillRect(-60, -60, 110, 50); g.fillRect(-20, -100, 26, 40); g.restore();
    if (t > hit) { const r = rng(4), lt = t - hit; for (let i = 0; i < 24; i++) { const a = -Math.PI * r(), v = 200 + r() * 400; g.fillStyle = 'rgba(230,240,245,0.8)';
        g.beginPath(); g.arc(700 + Math.cos(a) * v * lt, 980 + Math.sin(a) * v * lt + 900 * lt * lt, 3 + r() * 4, 0, 6.283); g.fill(); } }
    waterOver(t, 1000); g.restore(); flash(t, hit, 0.3);
    tag(t, 0, 5); popNum('1911', 80, 520, 200, TXT, t, 0.45); label('RMS OLYMPIC · SHE WAS A STEWARDESS', 84, 580, t, 0.9);
    if (t > hit) chip('HMS HAWKE · COLLISION', 80, 670, t, hit + 0.1, { size: 28, align: 'left', bg: RED, fg: TXT });
  };
};
// ---- 1: seven months later — the Titanic
VIS[1] = (K) => {
  for (let i = 0; i < 7; i++) K(0.6 + i * 0.16, 'tick', 0.6); K(2.9, 'hit', 0.9);
  return (t) => {
    nightSea(t, 1040, { seed: 11 }); const x = lerp(260, 620, clamp((t - 2.6) / 3));
    if (t > 2.7) liner(x, 1030, 1.1, {});
    g.fillStyle = 'rgba(220,235,245,0.9)'; g.beginPath(); g.moveTo(1000, 1040); g.lineTo(1040, 960); g.lineTo(1080, 1040); g.fill();
    waterOver(t, 1040); tag(t, 1, 5);
    const m = Math.min(7, Math.floor(clamp((tq(t) - 0.6) / 1.1) * 7 + 1e-6));
    popNum(`+${m} MONTHS`, 80, 520, 130, TXT, t, 0.5); label('SEPT 1911 → APRIL 1912', 84, 580, t, 0.9, { color: DIM });
    if (t > 2.9) { rise('TITANIC', 80, 780, 'disp', fit('TITANIC', 'disp', 200, 920), GOLD, t, 2.9); label('THE OLYMPIC\'S SISTER SHIP', 84, 850, t, 3.3); }
  };
};
// ---- 2: lifeboat 16, a baby
VIS[2] = (K) => {
  K(0.6, 'whoosh', 0.5); K(2.9, 'pop', 0.9, 900); K(3.0, 'land', 0.6);
  return (t) => {
    nightSea(t, 900, { seed: 3 });
    liner(560, 905 + t * 8, 1.1, { tilt: 0.22 + t * 0.01 });
    waterOver(t, 900);
    const bx = 540, by = 1110 + Math.sin(t * 1.5) * 6;
    g.save(); g.translate(bx, by); g.rotate(Math.sin(t * 1.2) * 0.04);
    g.fillStyle = '#E6DED0'; g.beginPath(); g.moveTo(-220, -30); g.lineTo(220, -30); g.quadraticCurveTo(200, 40, 0, 44); g.quadraticCurveTo(-200, 40, -220, -30); g.fill();
    g.fillStyle = '#9C8E78'; g.fillRect(-220, -34, 440, 8); text('16', 0, 20, 'disp', 54, PINK, { align: 'center' });
    for (let i = 0; i < 7; i++) person(-170 + i * 56, -34, 1.1, '#2E3440');
    const b = spring(t - 2.9, 260, 16); if (b > 0) { g.save(); g.translate(-2, -60); g.scale(b, b); g.fillStyle = GOLD; g.beginPath(); g.ellipse(0, 0, 18, 12, 0, 0, 6.283); g.fill();
      g.fillStyle = '#F4E3C8'; g.beginPath(); g.arc(14, -4, 8, 0, 6.283); g.fill(); g.restore(); }
    g.restore();
    tag(t, 2, 5); popNum('LIFEBOAT 16', 80, 520, fit('LIFEBOAT 16', 'disp', 150, 920), TXT, t, 0.45);
    if (t > 3.1) chip('AN OFFICER HANDED HER A BABY', 80, 610, t, 3.1, { size: 28, align: 'left' });
  };
};
// ---- 3: 1916, Britannic — the propellers
VIS[3] = (K) => {
  K(0.5, 'pop', 0.8, 500); K(2.6, 'riser', 0.6, 1.8); K(4.5, 'splash', 0.9); for (let i = 0; i < 10; i++) K(5.6 + i * 0.3, 'thump', 0.35); K(6.6, 'whoosh', 0.8); K(7.0, 'splash', 0.7);
  return (t) => {
    const sink = clamp((t - 2.6) / 2.6), WL = 1000;
    nightSea(t, WL, { top: '#0A0E14', hor: '#35414E' });
    liner(560, WL - 20 + sink * 60, 1.15, { hospital: true, hull: '#E9E6DE', tilt: -0.35 * sink });
    if (sink > 0.5) { const px = 560 - 330 * 1.15 * Math.cos(0.35 * sink), py = WL - 20 + sink * 60 - 1.15 * 330 * Math.sin(0.35 * sink) + 20;   // lifted stern propellers
      for (let k = 0; k < 3; k++) { g.save(); g.translate(px + 14, py + k * 16); g.rotate(t * 14 + k); g.fillStyle = '#B08A4A'; for (let b = 0; b < 3; b++) { g.rotate(2.094); g.beginPath(); g.ellipse(0, 12, 6, 14, 0, 0, 6.283); g.fill(); } g.restore(); } }
    for (let i = 0; i < 3; i++) { const lx = 170 + i * 110 + Math.sin(t + i) * 6, ly = WL + 8; g.fillStyle = '#D9CFBE'; g.beginPath(); g.ellipse(lx, ly, 46, 12, 0, 0, Math.PI); g.fill(); }
    if (t > 6.6) { const jt = t - 6.6, jx = 330 + jt * 60, jy = WL - 60 + jt * jt * 400; if (jy < WL + 30) person(jx, jy, 1.4, GOLD); else { const r = rng(2); for (let i = 0; i < 12; i++) { g.fillStyle = 'rgba(230,240,245,0.7)'; g.beginPath(); g.arc(360 + (r() - 0.5) * 80, WL - r() * 60 * clamp(1 - (jt - 0.5)), 4, 0, 6.283); g.fill(); } } }
    waterOver(t, WL, { c1: '#123040' });
    tag(t, 3, 5); popNum('1916', 80, 520, 200, TXT, t, 0.45); rise('BRITANNIC', 80, 650, 'disp', 110, '#7FD19A', t, 0.9);
    label('HOSPITAL SHIP · THE THIRD SISTER', 84, 710, t, 1.3);
    if (t > 5.6) chip('THE PROPELLERS', 80, 790, t, 5.6, { size: 30, align: 'left', bg: RED, fg: TXT });
  };
};
// ---- 4: survived all three, lived to 83
VIS[4] = (K) => {
  [0.6, 0.85, 1.1].forEach((a) => K(a, 'pop', 0.9, 700)); for (let i = 0; i < 12; i++) K(1.4 + i * 0.07, 'tick', 0.4); K(2.3, 'land', 0.8);
  return (t) => {
    atmosphere(t, { x: 540, y: 900, r: 800, c: 'rgba(255,194,61,0.10)' }); tag(t, 4, 5);
    shipRow(t, 1080, 0.3, t > 1.1 ? 2 : t > 0.85 ? 1 : t > 0.6 ? 0 : -1);
    const age = Math.round(countTo(t, 1.4, 0.9, 83, 0.7, 24));
    popNum(String(age), 80, 640, 260, age >= 83 ? GOLD : TXT, t, 1.3); label('SHE LIVED TO 83 (1887–1971)', 84, 710, t, 2.3);
  };
};
