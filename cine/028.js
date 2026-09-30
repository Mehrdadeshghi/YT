// Wiki Roulette #028 — Emu War (1932)
function emu(x, y, s, t, ph = 0, o = {}) {
  const run = t * (o.speed ?? 9) + ph, b = Math.abs(Math.sin(run)) * 6;
  g.save(); g.translate(x, y - b * s); g.scale(s * (o.dir || 1), s);
  g.strokeStyle = '#3B342C'; g.lineWidth = 5; g.lineCap = 'round';
  for (const k of [0, Math.PI]) { const a = Math.sin(run + k) * 0.6; g.beginPath(); g.moveTo(0, 10); g.lineTo(Math.sin(a) * 30, 60); g.lineTo(Math.sin(a) * 30 + 12, 62); g.stroke(); }
  g.fillStyle = o.col || '#5A4E42'; g.beginPath(); g.ellipse(0, 0, 44, 30, -0.15, 0, 6.283); g.fill();
  g.fillStyle = 'rgba(0,0,0,0.25)'; for (let i = 0; i < 6; i++) { g.beginPath(); g.ellipse(-30 + i * 10, 12 + (i % 2) * 4, 6, 12, 0.4, 0, 6.283); g.fill(); }
  g.strokeStyle = o.col || '#5A4E42'; g.lineWidth = 9; g.beginPath(); g.moveTo(28, -14); g.quadraticCurveTo(44, -50, 40, -78); g.stroke();
  g.fillStyle = '#3B342C'; g.beginPath(); g.ellipse(46, -82, 11, 8, 0.2, 0, 6.283); g.fill(); g.fillStyle = '#C9B28A'; g.beginPath(); g.moveTo(55, -84); g.lineTo(68, -80); g.lineTo(55, -78); g.fill();
  g.fillStyle = '#E8B84A'; g.beginPath(); g.arc(48, -85, 2.5, 0, 6.283); g.fill();
  g.restore();
}
function field(t, hz = 1000) {
  const sky = g.createLinearGradient(0, 0, 0, hz); sky.addColorStop(0, '#2A1C12'); sky.addColorStop(1, '#8A5A2E'); g.fillStyle = sky; g.fillRect(0, 0, W, hz);
  const gr = g.createLinearGradient(0, hz, 0, H); gr.addColorStop(0, '#6E5A2E'); gr.addColorStop(1, '#1E170C'); g.fillStyle = gr; g.fillRect(0, hz, W, H - hz);
  g.strokeStyle = 'rgba(230,200,120,0.25)'; g.lineWidth = 3; for (let i = 0; i < 40; i++) { const x = (i * 97) % W, y = hz + 20 + (i * 53) % 500; g.beginPath(); g.moveTo(x, y); g.lineTo(x + 4, y - 18); g.stroke(); }
}
function lewisGun(x, y, s) {
  g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = '#23262A';
  g.fillRect(-120, -14, 240, 26); g.fillRect(120, -6, 80, 10); g.beginPath(); g.ellipse(-20, -30, 44, 16, 0, 0, 6.283); g.fill();
  g.fillRect(-160, -8, 44, 34); g.strokeStyle = '#23262A'; g.lineWidth = 8; g.beginPath(); g.moveTo(60, 10); g.lineTo(30, 70); g.moveTo(60, 10); g.lineTo(100, 70); g.stroke(); g.restore();
}
const FLOCK = []; { const r = rng(28); for (let i = 0; i < 26; i++) FLOCK.push({ x: r() * 1300 - 100, y: 1060 + r() * 300, s: 0.5 + r() * 0.8, ph: r() * 6, v: 60 + r() * 120 }); }
FLOCK.sort((a, b) => a.y - b.y);
function flock(t, n = 26, o = {}) { for (let i = 0; i < Math.min(n, FLOCK.length); i++) { const e = FLOCK[i]; const x = ((e.x + t * e.v * (o.dir || 1)) % 1400 + 1400) % 1400 - 160; emu(x, e.y, e.s * (o.scale || 1), t, e.ph, { dir: o.dir || 1 }); } }
// ---- OPEN
VIS.open = (K) => {
  K(2.3, 'thump', 0.7); K(2.35, 'pop', 0.8, 600);
  return (t) => {
    field(t, 1000); flock(t * 0.8); lewisGun(820, 1330, 1.1);
    hookPhoto(t, 'lead', { y: 790, h: 440 });
    tag(t); hook(t, EP.hook, 500);
    if (t > 2.3) stampText('EMUS WIN', 780, 760, t, 2.3, { size: 60, rot: -0.12 });
  };
};
// ---- 0: 20,000 emus in Western Australia
VIS[0] = (K) => {
  K(1.0, 'land', 0.6); for (let i = 0; i < 18; i++) K(1.9 + i * 0.1, 'tick', 0.35); K(3.8, 'pop', 0.9, 700);
  return (t) => {
    atmosphere(t); const cam = camLerp(t, 0.2, 30, 11, [133, -26, 55], [121, -30, 22], 820); darkMap(cam);
    const [x, y] = cam.P(118.3, -31.1); pinAt(x, y, t, 1.0, null);
    label('WESTERN AUSTRALIA · 1932', 80, 420, t, 0.6, { color: GOLD });
    const n = countTo(t, 1.9, 1.8, 20000, 0.8), dots = Math.floor(n / 20000 * 700), r = rng(9);
    for (let i = 0; i < 700; i++) { const dx = x + (r() - 0.5) * 520, dy = y + (r() - 0.3) * 340; if (i >= dots) continue; g.fillStyle = i % 7 ? '#A88A60' : GOLD; g.fillRect(dx, dy, 4, 4); }
    tag(t, 0, 5); popNum(fmt(Math.round(n / 100) * 100), 80, 580, 170, n >= 20000 ? GOLD : TXT, t, 1.8); label('EMUS · APPROX.', 84, 640, t, 2.2);
    chip('EATING THE CROPS', 80, 720, t, 3.8, { size: 28, align: 'left', bg: RED, fg: TXT });
  };
};
// ---- 1: two machine guns, 10,000 rounds
VIS[1] = (K) => {
  K(0.9, 'thump', 0.9); K(1.5, 'thump', 0.9); for (let i = 0; i < 20; i++) K(2.4 + i * 0.06, 'click', 0.5); K(3.8, 'land', 0.6);
  return (t) => {
    field(t, 1150); tag(t, 1, 5);
    [[300, 0.9], [760, 1.5]].forEach(([x, at]) => { const s = spring(t - at, 260, 16); if (s > 0) { g.save(); g.translate(x, 1120); g.scale(s, s); lewisGun(0, 0, 1.3); g.restore(); } });
    popNum('2', 80, 560, 220, GOLD, t, 0.8); label('LEWIS MACHINE GUNS', 250, 520, t, 1.0, { size: 30 });
    const n = countTo(t, 2.4, 1.3, 10000, 0.7);
    popNum(fmt(n), 80, 760, 150, TXT, t, 2.3); label('ROUNDS OF AMMUNITION', 84, 820, t, 2.6);
    const r = rng(3); for (let i = 0; i < Math.floor(n / 250); i++) { g.fillStyle = '#C9A15A'; g.fillRect(80 + (i % 20) * 46, 880 + Math.floor(i / 20) * 26 + r() * 2, 30, 10); }
    chip('MAJOR MEREDITH + 2 SOLDIERS', 80, 440, t, 3.8, { size: 26, align: 'left', bg: '#2B2A28', fg: TXT });
  };
};
// ---- 2: 9,860 rounds, 986 claimed kills
VIS[2] = (K) => {
  for (let i = 0; i < 16; i++) K(0.6 + i * 0.1, 'click', 0.5); K(2.9, 'thump', 0.8); K(4.3, 'hit', 0.9);
  return (t) => {
    field(t, 1150); flock(t, 14, { scale: 0.9 }); tag(t, 2, 5);
    popNum(fmt(countTo(t, 0.5, 1.6, 9860, 0.7)), 80, 540, 170, TXT, t, 0.45); label('ROUNDS FIRED', 84, 600, t, 0.8);
    popNum(fmt(countTo(t, 2.8, 0.8, 986, 0.7)), 80, 780, 170, GOLD, t, 2.75); label('KILLS · HIS OWN CLAIM', 84, 840, t, 3.0);
    const s = spring(t - 4.3, 260, 16); if (s > 0) { g.save(); g.translate(540, 960); g.scale(s, s); rrect(-420, -60, 840, 120, 20); g.fillStyle = RED; g.fill();
      text('10 BULLETS PER BIRD', 0, 22, 'disp', 64, TXT, { align: 'center' }); g.restore(); }
  };
};
// ---- 3: "the invulnerability of tanks"
VIS[3] = (K) => {
  K(0.5, 'swish', 0.5); for (let i = 0; i < 40; i++) K(0.9 + i * 0.07, 'type', 0.35); K(3.6, 'thump', 0.9);
  return (t) => {
    field(t, 1150);
    g.save(); const ex = lerp(-200, 560, ease((t - 0.3) / 3)); emu(ex, 1250, 2.4, t, 0, {});
    g.fillStyle = '#2F3A2A'; rrect(ex - 120, 1360, 240, 50, 25); g.fill(); g.fillStyle = '#1C231A'; for (let i = 0; i < 6; i++) { g.beginPath(); g.arc(ex - 95 + i * 38, 1385, 14, 0, 6.283); g.fill(); } g.restore();
    tag(t, 3, 5);
    rrect(80, 380, 920, 520, 30); g.fillStyle = 'rgba(12,11,10,0.85)'; g.fill();
    text('“', 110, 560, 'serif', 200, GOLD);
    const q = 'They can face machine guns with the invulnerability of tanks.'; const n = Math.floor(q.length * clamp((tq(t) - 0.9) / 2.8)), words = q.slice(0, n).split(' ');
    g.font = F.serif(70); let line = '', y = 600; const lines = [];
    words.forEach((w) => { if (g.measureText(line + w).width > 800) { lines.push(line); line = ''; } line += w + ' '; }); lines.push(line);
    lines.forEach((l, i) => text(l, 130, y + i * 84, 'serif', 70, i >= 2 ? GOLD : TXT));
    label('— MAJOR G. P. W. MEREDITH', 130, 870, t, 3.6, { size: 24, color: DIM });
  };
};
// ---- 4: retreat; three more requests, always denied
VIS[4] = (K) => {
  K(0.6, 'whoosh', 0.7); [2.2, 2.7, 3.2].forEach((a) => { K(a, 'scratch', 0.8); K(a + 0.02, 'thump', 0.9); }); K(4.4, 'hit', 1);
  return (t) => {
    atmosphere(t); tag(t, 4, 5);
    popNum('RETREAT.', 80, 520, fit('RETREAT.', 'disp', 170, 920), TXT, t, 0.45);
    ['1934', '1943', '1948'].forEach((y, i) => { const at = 1.6 + i * 0.45, s = spring(t - at, 200, 22); if (s <= 0) return;
      g.save(); g.translate(0, (1 - s) * 300); paper(210 + i * 330, 850, 270, 330, (i - 1) * 0.05);
      text('REQUEST', 0, -100, 'mono', 22, '#7A7266', { align: 'center', ls: 3 }); text('ARMY HELP', 0, -60, 'serif', 34, PINK, { align: 'center' });
      text(y, 0, 10, 'disp', 64, PINK, { align: 'center' }); g.restore();
      stampText('DENIED', 210 + i * 330, 900, t, 2.2 + i * 0.5, { size: 44, rot: -0.2 }); });
    popNum('NO.', 540, 1180, 150, RED, t, 4.4, { align: 'center' });
  };
};
