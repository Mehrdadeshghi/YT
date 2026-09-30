// Wiki Roulette #032 — Wojtek, the soldier bear
const FUR = '#7A5230', FUR2 = '#5E3E22', OLIVE = '#4E5A34';
function bear(x, y, s, t, o = {}) {          // standing bear, facing right; o.walk, o.carry ('crate'|'shell'), o.col
  const w = o.walk ? t * 6 : 0, bob = o.walk ? Math.abs(Math.sin(w)) * 6 : Math.sin(t * 2) * 2;
  g.save(); g.translate(x, y - bob * s); g.scale(s * (o.dir || 1), s); const C = o.col || FUR;
  g.fillStyle = FUR2; [[-22, 1], [22, -1]].forEach(([lx, k]) => { const a = o.walk ? Math.sin(w) * 0.4 * k : 0; g.save(); g.translate(lx, 40); g.rotate(a); rrect(-16, 0, 32, 70, 14); g.fill(); g.restore(); });
  g.fillStyle = C; g.beginPath(); g.ellipse(0, 0, 58, 72, 0, 0, 6.283); g.fill();
  g.fillStyle = 'rgba(255,230,190,0.18)'; g.beginPath(); g.ellipse(10, 6, 30, 44, 0, 0, 6.283); g.fill();
  g.fillStyle = C; g.beginPath(); g.arc(6, -92, 38, 0, 6.283); g.fill(); [[-22, -122], [28, -120]].forEach(([ex, ey]) => { g.beginPath(); g.arc(ex, ey, 13, 0, 6.283); g.fill(); });
  g.fillStyle = '#C8A07A'; g.beginPath(); g.ellipse(34, -84, 20, 14, 0, 0, 6.283); g.fill(); g.fillStyle = '#1A120C'; g.beginPath(); g.arc(50, -88, 6, 0, 6.283); g.fill(); g.beginPath(); g.arc(18, -102, 4, 0, 6.283); g.fill();
  g.fillStyle = FUR2;
  if (o.carry) { g.save(); g.translate(0, -150); if (o.carry === 'crate') { g.fillStyle = '#8A6A3A'; g.fillRect(-60, -44, 120, 60); g.strokeStyle = '#5A4424'; g.lineWidth = 4; g.strokeRect(-60, -44, 120, 60); g.beginPath(); g.moveTo(-60, -44); g.lineTo(60, 16); g.stroke(); }
    else { g.rotate(-0.2); g.fillStyle = '#C9A15A'; rrect(-18, -70, 36, 90, 8); g.fill(); g.beginPath(); g.moveTo(-18, -70); g.quadraticCurveTo(0, -110, 18, -70); g.fill(); } g.restore();
    g.fillStyle = FUR2; [[-34, -1], [34, 1]].forEach(([ax]) => { g.save(); g.translate(ax, -40); g.rotate(ax < 0 ? 0.3 : -0.3); rrect(-12, -110, 24, 110, 12); g.fill(); g.restore(); }); }
  else { [[-40, 0.5], [42, -0.6]].forEach(([ax, r]) => { g.save(); g.translate(ax, -30); g.rotate(r + (o.walk ? Math.sin(w + 1) * 0.3 : 0)); rrect(-12, 0, 24, 80, 12); g.fill(); g.restore(); }); }
  if (o.cap) { g.fillStyle = OLIVE; g.beginPath(); g.ellipse(4, -124, 34, 12, 0, 0, 6.283); g.fill(); rrect(-24, -140, 56, 22, 8); g.fill(); }
  g.restore();
}
function chevrons(x, y, s, n = 2) { g.save(); g.translate(x, y); g.scale(s, s); g.strokeStyle = GOLD; g.lineWidth = 12; g.lineJoin = 'round';
  for (let i = 0; i < n; i++) { g.beginPath(); g.moveTo(-50, -10 + i * 30); g.lineTo(0, -40 + i * 30); g.lineTo(50, -10 + i * 30); g.stroke(); } g.restore(); }
// ---- OPEN
VIS.open = (K) => { K(1.9, 'pop', 0.9, 800);
  return (t) => {
    atmosphere(t, { x: 540, y: 1050, r: 800, c: 'rgba(122,82,48,0.25)' });
    bear(560, 1330, 1.75, t, { carry: 'shell', cap: true });
    hookPhoto(t, 'lead', { y: 800, h: 480, focus: [0.5, 0.3] });
    tag(t); hook(t, EP.hook, 500);
    if (t > 1.8) chevrons(900, 820, 1.1 * spring(t - 1.9, 300, 16), 2);
  }; };
// ---- 0: 1942, Iran — a cub named Wojtek
VIS[0] = (K) => { K(1.0, 'land', 0.6); K(3.2, 'pop', 0.8, 900); K(4.9, 'pop', 0.8, 700);
  return (t) => {
    atmosphere(t); const cam = camLerp(t, 0.2, 28, 11, [45, 36, 40], [48.5, 34.8, 14], 820); darkMap(cam);
    const [x, y] = cam.P(48.5, 34.8); pinAt(x, y, t, 1.0, 'IRAN', { size: 60 });
    tag(t, 0, 5); popNum('1942', 80, 520, 200, TXT, t, 0.45); label('POLISH SOLDIERS ADOPT A CUB', 84, 580, t, 0.9);
    const c = spring(t - 3.2, 200, 14); if (c > 0) { g.save(); g.translate(540, 1150); g.scale(c, c); bear(0, 0, 0.9, t, {}); g.restore(); }
    if (t > 4.8) popNum('WOJTEK', 540, 980, 110, GOLD, t, 4.9, { align: 'center' });
  }; };
// ---- 1: beer, two legs, sleeping next to the soldiers
VIS[1] = (K) => { [0.9, 1.9, 3.1].forEach((a) => K(a, 'pop', 0.9, 600)); K(2.0, 'swish', 0.4);
  return (t) => {
    atmosphere(t, { x: 540, y: 1000, r: 800, c: 'rgba(122,82,48,0.15)' }); tag(t, 1, 5);
    bear(lerp(-120, 700, clamp((t - 0.3) / 4)), 1120, 1.6, t, { walk: true });
    chip('BEER', 80, 470, t, 0.9, { size: 34, align: 'left' }); chip('WALKS ON 2 LEGS', 80, 560, t, 1.9, { size: 34, align: 'left' }); chip('SLEPT NEXT TO THE SOLDIERS', 80, 650, t, 3.1, { size: 34, align: 'left' });
  }; };
// ---- 2: enlisted as a private
VIS[2] = (K) => { K(0.5, 'swish', 0.6); for (let i = 0; i < 10; i++) K(1.2 + i * 0.06, 'type', 0.5); K(3.1, 'scratch'); K(3.12, 'thump', 1.1);
  return (t) => {
    atmosphere(t); tag(t, 2, 5); const s = spring(t - 0.45, 170, 20); if (s <= 0) return;
    g.save(); g.translate(0, (1 - s) * 400); paper(540, 820, 860, 560, -0.02);
    text('POLISH II CORPS', 0, -210, 'mono', 26, '#7A7266', { align: 'center', ls: 4 }); text('22nd Artillery Supply Company', 0, -150, 'serif', 42, PINK, { align: 'center' });
    g.fillStyle = '#CFC6B5'; g.fillRect(-380, -115, 760, 3);
    text('NAME:', -360, -40, 'mono', 28, '#7A7266', { ls: 3 }); typed('WOJTEK', -160, -40, 'disp', 64, PINK, t, 1.2, 0.5);
    text('RANK:', -360, 60, 'mono', 28, '#7A7266', { ls: 3 }); typed('PRIVATE', -160, 60, 'disp', 64, PINK, t, 1.9, 0.5);
    text('SPECIES:', -360, 150, 'mono', 28, '#7A7266', { ls: 3 }); text('Syrian brown bear', -160, 150, 'serif', 40, PINK, { alpha: (t - 2.4) * 3 });
    g.restore(); stampText('ENLISTED', 760, 1060, t, 3.1, { size: 70, rot: -0.12, color: '#2F7A4A' });
  }; };
// ---- 3: Monte Cassino — 45 kg crates, never dropped one
VIS[3] = (K) => { K(0.5, 'hit', 0.7); for (let i = 0; i < 8; i++) K(1.8 + i * 0.5, 'thump', 0.5); K(3.2, 'land', 0.7); K(5.6, 'pop', 1, 900);
  return (t) => {
    const sky = g.createLinearGradient(0, 0, 0, 1150); sky.addColorStop(0, '#1A1612'); sky.addColorStop(1, '#5A4630'); g.fillStyle = sky; g.fillRect(0, 0, W, 1150);
    g.fillStyle = '#2A2118'; g.beginPath(); g.moveTo(0, 1000); g.lineTo(300, 760); g.lineTo(520, 900); g.lineTo(760, 700); g.lineTo(1080, 950); g.lineTo(1080, H); g.lineTo(0, H); g.fill();
    g.fillStyle = '#3B2E20'; g.fillRect(0, 1150, W, H - 1150);
    bear(lerp(-150, 820, clamp((t - 1.2) / 5)), 1140, 1.5, t, { walk: true, carry: 'crate', cap: true });
    tag(t, 3, 5); popNum('MONTE CASSINO', 80, 460, fit('MONTE CASSINO', 'disp', 110, 920), TXT, t, 0.45); label('ITALY · 1944', 84, 510, t, 0.8, { color: DIM });
    popNum(`${Math.round(countTo(t, 3.2, 0.7, 45, 0.7))} KG`, 80, 660, 150, GOLD, t, 3.1); label('PER CRATE OF SHELLS', 84, 715, t, 3.5);
    if (t > 5.6) chip('DROPPED: 0', 80, 800, t, 5.6, { size: 40, align: 'left' });
  }; };
// ---- 4: promoted to corporal; the unit emblem
VIS[4] = (K) => { K(0.9, 'pop', 1, 800); K(1.1, 'pop', 1, 1000); K(3.2, 'hit', 0.9);
  return (t) => {
    atmosphere(t, { x: 540, y: 900, r: 800, c: 'rgba(255,194,61,0.12)' }); tag(t, 4, 5);
    popNum('CORPORAL', 80, 520, fit('CORPORAL', 'disp', 160, 700), GOLD, t, 0.8); chevrons(880, 470, 1.2 * spring(t - 1.0, 300, 14), 2);
    const e = spring(t - 3.2, 220, 16); if (e > 0) { g.save(); g.translate(540, 900); g.scale(e, e);
      g.fillStyle = '#EDE6D8'; g.beginPath(); g.arc(0, 0, 230, 0, 6.283); g.fill(); g.strokeStyle = '#2B2A28'; g.lineWidth = 12; g.stroke();
      bear(-10, 90, 1.05, 0, { carry: 'shell', col: '#2B2622' }); g.restore();
      label('THE UNIT\'S EMBLEM', 540, 1180, t, 3.6, { align: 'center' }); }
  }; };
