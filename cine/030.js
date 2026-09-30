// Wiki Roulette #030 — Tsutomu Yamaguchi: survived both atomic bombings (told with care: map, dates, facts)
const HIRO = [132.46, 34.39], NAGA = [129.88, 32.75];
function japan(t, cam) { darkMap(cam); }
function blastRing(x, y, t, t0, col = '#FFE7B0', max = 600) {
  const lt = t - t0; if (lt < 0) return; for (let r = 0; r < 3; r++) { const p = clamp(lt * 0.6 - r * 0.15); if (p <= 0 || p >= 1) continue;
    g.strokeStyle = col; g.globalAlpha = (1 - p) * 0.8; g.lineWidth = 6; g.beginPath(); g.arc(x, y, 30 + p * max, 0, 6.283); g.stroke(); } g.globalAlpha = 1;
}
// ---- OPEN
VIS.open = (K) => {
  K(0.2, 'sonar', 0.6); K(2.3, 'sonar', 0.8);
  return (t) => {
    atmosphere(t); const cam = mapCam(131.5, 33.8, 9, 1050); darkMap(cam);
    const [hx, hy] = cam.P(...HIRO), [nx, ny] = cam.P(...NAGA);
    pinAt(hx, hy, t, -1, null); pinAt(nx, ny, t, 2.3, null, { color: RED });
    label('HIROSHIMA · AUG 6', hx + 30, hy + 60, t, -1, { size: 24, color: GOLD }); label('NAGASAKI · AUG 9', nx - 20, ny + 60, t, 2.4, { size: 24, color: RED, align: 'center' });
    hookPhoto(t, 'lead', { y: 800, h: 460, focus: [0.5, 0.3] });
    tag(t); hook(t, EP.hook, 500);
  };
};
// ---- 0: Hiroshima, business trip
VIS[0] = (K) => { K(1.2, 'land', 0.6); K(3.6, 'pop', 0.6, 600);
  return (t) => {
    atmosphere(t); const cam = camLerp(t, 0.2, 28, 11, [136, 36, 20], [132.4, 34.2, 4], 920); darkMap(cam);
    const [x, y] = cam.P(...HIRO); pinAt(x, y, t, 1.2, 'HIROSHIMA', { size: 60 });
    tag(t, 0, 5); popNum('AUG 6, 1945', 80, 520, fit('AUG 6, 1945', 'disp', 150, 920), TXT, t, 0.45); label('8:15 AM', 84, 580, t, 0.8, { color: GOLD });
    chip('BUSINESS TRIP · MITSUBISHI', 80, 660, t, 3.6, { size: 26, align: 'left', bg: '#2B2A28', fg: TXT });
  }; };
// ---- 1: 3 km away
VIS[1] = (K) => { K(0.5, 'mute', 1, 0.6); K(0.55, 'hit', 1.2); K(2.6, 'thump', 0.7); K(3.4, 'thump', 0.7);
  return (t) => {
    atmosphere(t, { x: 540, y: 950, r: 800, c: `rgba(255,200,120,${0.25 * Math.exp(-(t - 0.55) * 1.5) * (t > 0.55)})` });
    const cx = 540, cy = 950, R = 330 * spring(t - 1.0, 90, 16);
    blastRing(cx, cy, t, 0.55);
    g.strokeStyle = GOLD; g.setLineDash([12, 10]); g.lineWidth = 4; g.beginPath(); g.arc(cx, cy, Math.max(1, R), 0, 6.283); g.stroke(); g.setLineDash([]);
    if (R > 10) { g.beginPath(); g.moveTo(cx, cy); g.lineTo(cx + R, cy); g.stroke(); person(cx + R, cy - 4, 1.6, TXT); popNum('3 KM', cx + R / 2, cy - 30, 64, GOLD, t, 1.4, { align: 'center' }); }
    g.fillStyle = '#FFE7B0'; g.beginPath(); g.arc(cx, cy, 14, 0, 6.283); g.fill();
    flash(t, 0.55, 0.85, 0.5, '#FFF4DE');
    tag(t, 1, 5); chip('EARDRUMS BURST', 80, 460, t, 2.6, { size: 28, align: 'left', bg: RED, fg: TXT }); chip('SERIOUS BURNS', 80, 540, t, 3.4, { size: 28, align: 'left', bg: RED, fg: TXT });
  }; };
// ---- 2: the next day he goes home — to Nagasaki
VIS[2] = (K) => { K(0.6, 'whoosh', 0.7); K(2.0, 'land', 0.8);
  return (t) => {
    atmosphere(t); const cam = mapCam(131.2, 33.6, 6, 920); darkMap(cam);
    const [hx, hy] = cam.P(...HIRO), [nx, ny] = cam.P(...NAGA), p = ease((t - 0.6) / 1.4);
    g.strokeStyle = GOLD; g.lineWidth = 6; g.setLineDash([16, 12]); g.beginPath(); g.moveTo(hx, hy); g.quadraticCurveTo((hx + nx) / 2, hy - 120, lerp(hx, nx, p), lerp(hy, ny, p) - 120 * 4 * p * (1 - p) * 0.5); g.stroke(); g.setLineDash([]);
    pinAt(hx, hy, t, -1, null); if (p >= 1) pinAt(nx, ny, t, 2.0, 'NAGASAKI', { size: 60, color: RED, left: true });
    tag(t, 2, 5); popNum('AUG 7', 80, 520, 150, TXT, t, 0.45); label('HE TRAVELS HOME', 84, 580, t, 0.8);
  }; };
// ---- 3: August 9 — telling his boss
VIS[3] = (K) => { for (let i = 0; i < 20; i++) K(0.9 + i * 0.12, 'type', 0.3); K(4.2, 'mute', 1, 0.6); K(4.25, 'hit', 1.2);
  return (t) => {
    atmosphere(t); tag(t, 3, 5); popNum('AUG 9, 1945', 80, 520, fit('AUG 9, 1945', 'disp', 150, 920), TXT, t, 0.45); label('11:00 AM · NAGASAKI', 84, 580, t, 0.8, { color: RED });
    const s = spring(t - 0.8, 170, 20); if (s > 0 && t < 4.3) { g.save(); g.translate(0, (1 - s) * 300); paper(540, 880, 800, 360, 0.02);
      text('OFFICE · MITSUBISHI', 0, -110, 'mono', 24, '#7A7266', { align: 'center', ls: 3 });
      typed('"In Hiroshima, one bomb…"', -340, 10, 'serif', 52, PINK, t, 1.0, 2.2); g.restore(); }
    if (t > 4.25) { const cx = 540, cy = 900; blastRing(cx, cy, t, 4.25, '#FFE7B0', 700); }
    flash(t, 4.25, 0.85, 0.5, '#FFF4DE');
  }; };
// ---- 4: double survivor, lived to 93
VIS[4] = (K) => { K(0.9, 'hit', 0.9); K(3.2, 'scratch'); K(3.22, 'thump', 1); for (let i = 0; i < 12; i++) K(5.0 + i * 0.07, 'tick', 0.4); K(6.0, 'land', 0.7);
  return (t) => {
    atmosphere(t, { x: 540, y: 850, r: 800, c: 'rgba(255,194,61,0.10)' }); tag(t, 4, 5);
    popNum('×2', 80, 640, 300, GOLD, t, 0.9);
    stampText('DOUBLE SURVIVOR · 2009', 540, 840, t, 3.2, { size: 58, rot: -0.06, color: GOLD });
    const age = Math.round(countTo(t, 5.0, 0.9, 93, 0.7, 29)); if (t > 4.9) { popNum(String(age), 80, 1110, 170, TXT, t, 4.9); label('HE LIVED TO 93', 330, 1080, t, 5.4); }
  }; };
