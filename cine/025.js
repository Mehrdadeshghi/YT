// Wiki Roulette #025 — Bloop: bespoke CINE visuals
const ICE = '#DDEBF2', ICE2 = '#9CC3D6';
const SRC = [-100, -50], SENS = [[-130, 5], [-110, -8], [-88, -2]];
function soundWave(t, y, amp, o = {}) {        // a rising "bloop" trace
  g.save(); g.lineJoin = 'round';
  for (const [lw, a] of [[14, 0.15], [4, 1]]) { g.strokeStyle = o.color || TEAL; g.globalAlpha = a * (o.alpha ?? 1); g.lineWidth = lw; g.beginPath();
    for (let x = 60; x <= 1020; x += 3) { const u = (x - 60) / 960, env = Math.sin(Math.PI * u) ** 1.5, f = 0.02 + 0.05 * u;
      const v = Math.sin(x * f - t * 8) * env * amp * (0.6 + 0.4 * Math.sin(t * 2 + u * 3)); x === 60 ? g.moveTo(x, y + v) : g.lineTo(x, y + v); } g.stroke(); }
  g.restore();
}
function ringsFrom(x, y, t, t0, speed, max, col = TEAL) {
  for (let r = 0; r < 4; r++) { const lt = t - t0 - r * 0.35; if (lt <= 0) continue; const rad = lt * speed; if (rad > max) continue;
    g.strokeStyle = col; g.globalAlpha = 0.6 * (1 - rad / max); g.lineWidth = 4; g.beginPath(); g.arc(x, y, rad, 0, 6.283); g.stroke(); }
  g.globalAlpha = 1;
}
function giant(t, a, x = 560, y = 900) {       // the imagined monster: an enormous shadow with one eye
  if (a <= 0.01) return; g.save(); g.globalAlpha = clamp(a);
  whale(x + Math.sin(t * 0.4) * 20, y, 3.4, -0.05, '#0A141A', { rim: 'rgba(67,198,217,0.25)' });
  const eo = 0.5 + 0.5 * Math.sin(t * 0.7); g.fillStyle = `rgba(255,194,61,${0.5 + 0.5 * eo})`; g.beginPath(); g.ellipse(x + 700, y + 20, 18, 12 * (0.3 + 0.7 * eo), 0, 0, 6.283); g.fill();
  g.restore();
}
function iceShelf(t, crack, fall, o = {}) {
  const WL = 1000;
  g.fillStyle = '#081a26'; g.fillRect(0, WL, W, H - WL); sea('rgba(0,0,0,0)', 'rgba(0,0,0,0)');
  const shelf = [[380, 560], [470, 540], [1080, 520], [1080, 1180], [360, 1180], [400, 1000], [370, 780]];
  g.fillStyle = ICE; g.beginPath(); shelf.forEach(([x, y], i) => i ? g.lineTo(x, y) : g.moveTo(x, y)); g.closePath(); g.fill();
  g.fillStyle = ICE2; g.beginPath(); g.moveTo(380, 560); g.lineTo(470, 540); g.lineTo(520, 1000); g.lineTo(400, 1000); g.lineTo(370, 780); g.closePath(); g.fill();
  if (crack > 0) { const r = rng(12); g.strokeStyle = '#2B4E63'; g.lineWidth = 5; g.lineCap = 'round';
    for (let k = 0; k < 3; k++) { let x = 560 + k * 40, y = 540; g.beginPath(); g.moveTo(x, y); const n = Math.floor(12 * crack);
      for (let i = 0; i < n; i++) { x += (r() - 0.45) * 50; y += 38; g.lineTo(x, y); } g.stroke(); } }
  if (fall < 1) {                                  // the chunk that breaks off
    const p = ease(fall), ang = -0.9 * p, dy = 380 * p * p;
    g.save(); g.translate(470, 1000 + dy * 0.2); g.rotate(ang); g.translate(-470, -1000);
    g.fillStyle = '#EAF3F8'; g.beginPath(); g.moveTo(380, 560); g.lineTo(560, 540); g.lineTo(600, 1000); g.lineTo(400, 1000); g.lineTo(370, 780); g.closePath(); g.fill(); g.restore(); }
  g.fillStyle = 'rgba(8,26,38,0.55)'; g.fillRect(0, WL, W, H - WL);
  g.strokeStyle = 'rgba(160,220,240,0.5)'; g.lineWidth = 3; g.beginPath(); for (let x = 0; x <= W; x += 20) g.lineTo(x, WL + Math.sin(x / 40 + t * 2) * 4); g.stroke();
}
// ---- OPEN
VIS.open = (K) => {
  K(0.3, 'bloop', 0.9); K(3.2, 'bloop', 0.6);
  return (t) => {
    sea('#07192A', '#020406'); marineSnow(t, 12, 0.6); lightRays(t, 0.25);
    giant(t, 0.35, 420, 1250);
    soundWave(t, 1000, 120);
    tag(t); hook(t, EP.hook, 500);
    label('RECORDED 1997', 80, 820, t, -1, { color: TEAL });
  };
};
// ---- 0: where
VIS[0] = (K) => {
  K(0.6, 'sonar', 0.7); K(1.6, 'land', 0.6); K(2.2, 'bloop', 0.6);
  return (t) => {
    atmosphere(t, { x: 540, y: 1000, r: 800, c: 'rgba(67,198,217,0.07)' });
    const cam = camLerp(t, 0.2, 26, 10.5, [-80, -10, 200], [-88, -38, 72], 880); darkMap(cam, { glow: 'rgba(67,198,217,0.10)' });
    const [sx, sy] = cam.P(...SRC); ringsFrom(sx, sy, t, 2.0, 160, 420); pinAt(sx, sy, t, 1.6, null, { color: TEAL });
    label('≈ 50°S · 100°W', sx + 40, sy + 60, t, 1.9, { color: TEAL, size: 26 });
    const [ax, ay] = cam.P(-66, -20); label('SOUTH AMERICA', ax, ay, t, 1.2, { size: 24, color: DIM, align: 'center' });
    tag(t, 0, 5); rise('SOUTH', 80, 520, 'disp', 150, TXT, t, 0.9); rise('PACIFIC', 80, 670, 'disp', 150, TEAL, t, 1.0);
    chip('NOAA · UNDERWATER MICROPHONES', 80, 760, t, 0.5, { size: 26, align: 'left', bg: '#2B2A28', fg: TXT });
  };
};
// ---- 1: sensors thousands of km apart all heard it
VIS[1] = (K) => {
  K(0.5, 'bloop', 0.8); SENS.forEach((s, i) => K(1.5 + i * 0.35, 'beep', 0.8)); K(2.8, 'pop', 0.8, 700);
  return (t) => {
    atmosphere(t); const cam = mapCam(-108, -22, 120, 820); darkMap(cam, { glow: 'rgba(67,198,217,0.10)' });
    const [sx, sy] = cam.P(...SRC); ringsFrom(sx, sy, t, 0.5, 420, 900);
    g.fillStyle = TEAL; g.beginPath(); g.arc(sx, sy, 12, 0, 6.283); g.fill();
    SENS.forEach(([lo, la], i) => { const [x, y] = cam.P(lo, la), on = t > 1.5 + i * 0.35, p = on ? spring(t - 1.5 - i * 0.35, 300, 14) : 0;
      g.fillStyle = on ? GOLD : '#555'; g.beginPath(); g.moveTo(x, y - 18 - 8 * p); g.lineTo(x + 14, y + 10); g.lineTo(x - 14, y + 10); g.closePath(); g.fill();
      if (on) { g.strokeStyle = GOLD; g.globalAlpha = clamp(1 - (t - 1.5 - i * 0.35)); g.lineWidth = 3; g.beginPath(); g.arc(x, y, 20 + 60 * (t - 1.5 - i * 0.35), 0, 6.283); g.stroke(); g.globalAlpha = 1; } });
    const [ax, ay] = cam.P(...SENS[0]), [bx, by] = cam.P(...SENS[2]), d = spring(t - 2.7, 120, 20);
    if (d > 0) { g.strokeStyle = GOLD; g.lineWidth = 4; g.setLineDash([12, 10]); g.beginPath(); g.moveTo(ax, ay - 50); g.lineTo(lerp(ax, bx, d), lerp(ay, by, d) - 50); g.stroke(); g.setLineDash([]);
      popNum('4,800 KM', (ax + bx) / 2, Math.min(ay, by) - 70, 96, GOLD, t, 2.9, { align: 'center' }); }
    tag(t, 1, 5); label('ALL SENSORS HEARD IT', 80, 1120, t, 3.2, { color: GOLD });
  };
};
// ---- 2: "the Bloop" — something bigger than any whale?
VIS[2] = (K) => {
  K(0.45, 'bloop', 1); K(0.6, 'thump', 0.8); K(1.8, 'riser', 0.6, 2); K(3.6, 'hit', 0.7);
  return (t) => {
    sea('#07192A', '#020406'); marineSnow(t, 10, 0.6); tag(t, 2, 5);
    const mon = spring(t - 1.8, 30, 10);
    giant(t, mon * 0.95, lerp(900, 480, mon), 900);
    if (t > 2.2) { const a = spring(t - 2.2, 200, 20); whale(250, 1150, 0.35, 0, 'rgba(0,0,0,0)', { rim: `rgba(255,194,61,${a})` }); label('BLUE WHALE', 250, 1230, t, 2.4, { align: 'center', size: 22, color: GOLD }); }
    const bw = spring(t - 0.45, 300, 16), out = spring(t - 1.8, 200, 26);
    if (out < 0.999) { g.save(); g.globalAlpha = clamp(1 - out); g.translate(540, 700); g.scale(bw, bw); text('BLOOP', 0, 0, 'disp', 250, TEAL, { align: 'center', shadow: true }); g.restore(); soundWave(t, 850, 80, { alpha: 1 - out }); }
    if (t > 3.4) popNum('?', 900, 560, 220, GOLD, t, 3.6, { align: 'center' });
  };
};
// ---- 3: 2012 — it was ice
VIS[3] = (K) => {
  K(0.5, 'pop', 0.8, 600); K(2.2, 'mute', 1, 0.6); K(2.3, 'thump', 1); K(3.6, 'whoosh', 0.8); K(4.5, 'crack', 1); K(5.1, 'crack', 0.9); K(5.7, 'crack', 1.1); K(6.4, 'splash', 1.2);
  return (t) => {
    const sw = spring(t - 3.6, 180, 26);
    if (sw < 0.5) { sea('#07192A', '#020406'); }
    if (sw < 0.999) { g.save(); g.globalAlpha = clamp(1 - sw);
      sea('#07192A', '#020406'); marineSnow(t, 10, 0.6); giant(t, 0.9 * (1 - clamp((t - 2.3) / 0.8)), 480, 900);
      tag(t, 3, 5); popNum('2012', 80, 560, 220, TXT, t, 0.45);
      if (t > 2.3) stampText('NOT ALIVE', 540, 900, t, 2.3, { size: 100, rot: -0.08 });
      g.restore(); }
    if (sw > 0.001) { g.save(); g.globalAlpha = clamp(sw);
      const sky = g.createLinearGradient(0, 0, 0, 1000); sky.addColorStop(0, '#0B1622'); sky.addColorStop(1, '#23384A'); g.fillStyle = sky; g.fillRect(0, 0, W, H);
      g.save(); g.translate(shake(t, 5.7, 14) + shake(t, 6.4, 10), 0);
      g.translate(0, 100); iceShelf(t, clamp((t - 4.4) / 1.4), clamp((t - 5.8) / 0.7)); g.restore();
      if (t > 6.4) { const r = rng(3), lt = t - 6.4; for (let i = 0; i < 40; i++) { const a = -Math.PI * r(), sp = 200 + r() * 500, x = 380 + Math.cos(a) * sp * lt, y = 1100 + Math.sin(a) * sp * lt + 900 * lt * lt;
          if (y > 1100) continue; g.fillStyle = 'rgba(220,240,250,0.8)'; g.beginPath(); g.arc(x, y, 4 + r() * 5, 0, 6.283); g.fill(); } }
      tag(t, 3, 5); rise('ICEQUAKE', 80, 520, 'disp', fit('ICEQUAKE', 'disp', 170, 920), ICE, t, 3.8);
      label('ANTARCTIC ICE, CRACKING APART', 84, 590, t, 4.4, { color: TEAL });
      g.restore(); }
    flash(t, 5.7, 0.25); flash(t, 6.4, 0.2);
  };
};
// ---- 4: the monster was ice
VIS[4] = (K) => {
  K(0.5, 'bloop', 0.7); K(1.9, 'land', 0.7);
  return (t) => {
    sea('#0B1A26', '#020406'); marineSnow(t, 10, 0.6); tag(t, 4, 5);
    const WL = 840, bob = Math.sin(t * 1.2) * 8, m = clamp((t - 0.6) / 1.2);
    giant(t, 0.7 * (1 - m), 480, 1000);
    g.save(); g.globalAlpha = m; g.translate(640, WL + bob);
    g.fillStyle = ICE; g.beginPath(); g.moveTo(-160, 0); g.lineTo(-90, -130); g.lineTo(-20, -110); g.lineTo(40, -190); g.lineTo(150, 0); g.closePath(); g.fill();
    g.fillStyle = 'rgba(156,195,214,0.55)'; g.beginPath(); g.moveTo(-160, 0); g.lineTo(150, 0); g.lineTo(300, 180); g.lineTo(220, 420); g.lineTo(-60, 520); g.lineTo(-280, 330); g.lineTo(-300, 120); g.closePath(); g.fill();
    g.restore();
    g.strokeStyle = 'rgba(160,220,240,0.5)'; g.lineWidth = 3; g.beginPath(); for (let x = 0; x <= W; x += 20) g.lineTo(x, WL + Math.sin(x / 40 + t * 2) * 4); g.stroke();
    rise('THE MONSTER?', 80, 520, 'disp', fit('THE MONSTER?', 'disp', 140, 920), TXT, t, 0.45);
    popNum('ICE.', 80, 680, 170, ICE, t, 1.9);
  };
};
