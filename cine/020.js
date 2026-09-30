// Wiki Roulette #020 — Jeanne Calment: bespoke CINE visuals (loaded by cine.html)
// ---- OPEN: the hook on frame 0 + the contract being signed
const SIG = (seed, w) => { const r = rng(seed), pts = []; let x = 0;
  for (let i = 0; i < 9; i++) { x += w / 9; pts.push([x - w / 18 + (r() - 0.5) * 20, (r() - 0.5) * 60, x, (r() - 0.5) * 16]); } return pts; };
const SIG1 = SIG(7, 250), SIG2 = SIG(19, 250);
function drawSig(pts, x, y, p) {
  if (p <= 0) return; g.save(); g.translate(x, y); g.strokeStyle = '#1F3A8A'; g.lineWidth = 4; g.lineCap = 'round';
  g.beginPath(); g.moveTo(0, 0); const n = pts.length * clamp(p);
  for (let i = 0; i < Math.ceil(n); i++) { const [cx, cy, ex, ey] = pts[i], f = Math.min(1, n - i);
    const px = i ? pts[i - 1][2] : 0, py = i ? pts[i - 1][3] : 0;
    g.quadraticCurveTo(lerp(px, cx, f), lerp(py, cy, f), lerp(px, ex, f), lerp(py, ey, f)); }
  g.stroke(); g.restore();
}
VIS.open = (K) => {
  K(1.35, 'pen', 0.8); K(2.3, 'pen', 0.8); K(4.2, 'hit', 0.8);
  return (t) => {
    atmosphere(t, { x: 540, y: 1180, r: 900, c: 'rgba(255,170,60,0.16)' });
    tag(t);
    const L1 = 'HE BET ON', L2 = 'HER DEATH.', L3 = 'BIG MISTAKE.';
    const s = Math.min(fit(L2, 'disp', 150, 920), fit(L3, 'disp', 150, 920));
    const mk = t - 4.2, shake = mk > 0 && mk < 0.5 ? Math.sin(mk * 60) * (1 - mk / 0.5) * 14 : 0, pop = mk > 0 ? 1 + 0.08 * Math.exp(-mk * 6) * Math.sin(Math.min(mk * 14, 3.14)) : 1;
    text(L1, 80, 500, 'disp', s, TXT, { shadow: true }); text(L2, 80, 500 + s * 1.02, 'disp', s, TXT, { shadow: true });
    g.save(); g.translate(80 + shake, 500 + s * 2.04); g.scale(pop, pop); text(L3, 0, 0, 'disp', s, GOLD, { shadow: true });
    if (mk > 0) { g.font = F.disp(s); const w = g.measureText(L3).width, p = ease(mk / 0.35);   // red scribble underline
      g.strokeStyle = RED; g.lineWidth = 12; g.lineCap = 'round'; g.beginPath();
      for (let x = 0; x <= w * p; x += 12) { const y = 30 + Math.sin(x / 38) * 7; x ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke(); }
    g.restore();
    // the contract
    g.save(); g.translate(540, 1170 + Math.sin(t * 0.9) * 6); g.rotate(-0.045 + Math.sin(t * 0.6) * 0.006);
    rrect(-372, -222, 760, 470, 10); g.fillStyle = 'rgba(0,0,0,0.5)'; g.fill();
    rrect(-380, -235, 760, 470, 10); g.fillStyle = PAPER; g.fill();
    text('CONTRAT DE VIAGER', -330, -160, 'serif', 46, PINK); text('ARLES · 1965', -330, -118, 'mono', 24, '#7A7266', { ls: 3 });
    g.fillStyle = '#CFC6B5'; [[-80, 620], [-52, 560], [-24, 640], [4, 420]].forEach(([y, w]) => g.fillRect(-330, y, w, 10));
    text('Rente : 2 500 F / mois', -330, 68, 'serif', 34, PINK);
    g.fillStyle = '#9C9384'; g.fillRect(-330, 170, 290, 3); g.fillRect(40, 170, 290, 3);
    text('A.-F. RAFFRAY, NOTAIRE', -330, 204, 'mono', 18, '#7A7266', { ls: 1 }); text('JEANNE CALMENT, 90 ANS', 40, 204, 'mono', 18, '#7A7266', { ls: 1 });
    drawSig(SIG1, -320, 150, (t - 1.35) / 0.7); drawSig(SIG2, 50, 150, (t - 2.3) / 0.7);
    g.restore();
  };
};
// ---- 1: who & where
VIS[0] = (K) => {
  K(1.2, 'pop', 0.7, 500); K(1.5, 'land', 0.7);
  return (t) => {
    atmosphere(t);
    const p = spring(t - 0.25, 26, 10.5), span = Math.exp(lerp(Math.log(30), Math.log(3.3), p));
    const cam = mapCam(lerp(6, 4.9, p), lerp(46.5, 43.55, p), span, 980);
    g.save(); cam.apply(); g.fillStyle = '#1C1A17'; g.fill(MAPPATH);
    g.lineJoin = 'round'; g.strokeStyle = 'rgba(255,194,61,0.10)'; g.lineWidth = 8 / cam.k; g.stroke(MAPPATH);
    g.strokeStyle = '#4A433A'; g.lineWidth = 2 / cam.k; g.stroke(MAPPATH); g.restore();
    const gr = g.createLinearGradient(0, 200, 0, 820); gr.addColorStop(0, 'rgba(12,11,10,0.95)'); gr.addColorStop(1, 'rgba(12,11,10,0)'); g.fillStyle = gr; g.fillRect(0, 0, W, 820);
    const [sx, sy] = cam.P(5.0, 42.95); text('MEDITERRANEAN SEA', sx, sy, 'mono', 26, DIM, { ls: 6, align: 'center', alpha: (t - 1.3) * 3 });
    const [mx, my] = cam.P(5.37, 43.3), ms = spring(t - 1.4, 300, 22);
    if (ms > 0) { g.fillStyle = DIM; g.beginPath(); g.arc(mx, my, 9 * ms, 0, 6.283); g.fill(); text('Marseille', mx + 22, my + 10, 'ui', 34, DIM, { alpha: ms }); }
    const [ax, ay] = cam.P(4.63, 43.68), as = spring(t - 1.5, 260, 16);
    if (as > 0) { for (let r = 0; r < 3; r++) { const ph = ((t - 1.5) * 0.8 + r / 3) % 1;
        g.strokeStyle = GOLD; g.globalAlpha = (1 - ph) * 0.7; g.lineWidth = 4; g.beginPath(); g.arc(ax, ay, 20 + ph * 140, 0, 6.283); g.stroke(); }
      g.globalAlpha = 1; g.fillStyle = GOLD; g.beginPath(); g.arc(ax, ay, 16 * as, 0, 6.283); g.fill();
      g.fillStyle = BG; g.beginPath(); g.arc(ax, ay, 6 * as, 0, 6.283); g.fill();
      rise('ARLES', ax + 44, ay - 22, 'disp', 84, TXT, t, 1.55); }
    tag(t, 0, 7);
    rise('JEANNE', 80, 520, 'disp', 170, TXT, t, 0.45);
    rise('CALMENT', 80, 690, 'disp', fit('CALMENT', 'disp', 170, 920), GOLD, t, 0.55);
    rise('BORN 1875 · SOUTHERN FRANCE', 84, 770, 'mono', 32, DIM, t, 0.9, { stagger: 0.04 });
    photo(t, 'lead', 600, 820, 400, 420, { tIn: 1.8, focus: [0.5, 0.2], zoom: [1, 1.08], dur: 3 });
  };
};
// ---- 2: the deal
const NOTES = []; { const r = rng(5); for (let i = 0; i < 30; i++) NOTES.push({ x: 60 + r() * 960, t0: 0.7 + i * 0.1 + r() * 0.08, sp: 700 + r() * 500, rot: r() * 6, w: r() * 5 + 2, z: 0.5 + r() * 0.5 }); }
VIS[1] = (K) => {
  K(0.6, 'riser', 0.3, 0.8); for (let i = 0; i < 8; i++) K(0.7 + i * 0.1, 'tick', 0.5);
  K(1.45, 'coin', 1); K(2.8, 'swish', 0.6); K(3.45, 'pop', 0.9, 800); K(3.95, 'click', 0.8);
  return (t) => {
    atmosphere(t, { x: 540, y: 520, r: 700, c: 'rgba(255,194,61,0.12)' });
    for (const n of NOTES) { const lt = t - n.t0; if (lt < 0) continue; const y = -120 + lt * n.sp * n.z; if (y > H + 100) continue;
      g.save(); g.translate(n.x + Math.sin(lt * n.w) * 40, y); g.rotate(n.rot + lt * 1.5); g.scale(n.z, Math.cos(lt * n.w) * n.z);
      g.globalAlpha = 0.55; rrect(-110, -55, 220, 110, 8); g.fillStyle = '#4C5A3A'; g.fill(); g.strokeStyle = '#8E9B6A'; g.lineWidth = 4; g.stroke();
      g.fillStyle = '#C9D29A'; g.font = F.disp(46); g.textAlign = 'center'; g.fillText('F', 0, 16); g.restore(); }
    tag(t, 1, 7);
    const up = spring(t - 2.75, 170, 24), cy = lerp(620, 470, up), cs = lerp(1, 0.62, up);
    const v = 2500 * ease((tq(t) - 0.6) / 0.85), s0 = spring(t - 0.45, 260, 22);
    if (s0 > 0) { g.save(); g.translate(540, cy); g.scale(cs * (0.7 + 0.3 * s0), cs * (0.7 + 0.3 * s0)); g.globalAlpha = clamp(s0 * 2);
      text(fmt(v) + ' F', 0, 0, 'disp', 230, GOLD, { align: 'center', shadow: true });
      text('EVERY SINGLE MONTH', 0, 84, 'mono', 36, TXT, { align: 'center', ls: 6 }); g.restore(); }
    // the building: drawn line by line, then her flat lights up
    const bp = clamp((t - 2.8) / 0.6); if (bp <= 0) return;
    const bx = 250, by = 700, bw = 580, bh = 460;
    g.save(); g.fillStyle = 'rgba(12,11,10,0.85)'; g.fillRect(bx, by, bw, bh);
    g.strokeStyle = TXT; g.lineWidth = 5; g.lineJoin = 'round';
    const per = 2 * (bw + bh) + 60; g.setLineDash([per * ease(bp), per]);
    g.beginPath(); g.moveTo(bx - 30, by); g.lineTo(bx + bw + 30, by); g.lineTo(bx + bw, by + bh); g.lineTo(bx, by + bh); g.closePath(); g.stroke(); g.setLineDash([]);
    for (let f = 0; f < 4; f++) for (let wv = 0; wv < 4; wv++) { const wp = clamp((t - 2.95 - (f * 4 + wv) * 0.02) / 0.2); if (wp <= 0) continue;
      const x = bx + 50 + wv * 130, y = by + 40 + f * 105, lit = f === 1 && wv === 2, lp = lit ? spring(t - 3.45, 200, 18) : 0;
      g.globalAlpha = wp; rrect(x, y, 90, 70, 6); g.fillStyle = lp > 0 ? `rgba(255,194,61,${0.2 + 0.8 * clamp(lp)})` : '#1F1D1A'; g.fill();
      g.strokeStyle = lit && lp > 0 ? GOLD : '#5A544B'; g.lineWidth = 3; g.stroke(); g.globalAlpha = 1;
      if (lit && lp > 0) { const gr = g.createRadialGradient(x + 45, y + 35, 0, x + 45, y + 35, 260); gr.addColorStop(0, `rgba(255,194,61,${0.35 * clamp(lp)})`); gr.addColorStop(1, 'rgba(255,194,61,0)');
        g.fillStyle = gr; g.fillRect(x - 220, y - 220, 530, 510); } }
    g.restore();
    chip('HER FLAT', 605, 775, t, 3.6, { size: 28 });
  };
};
// ---- 3 + 4: two heartbeats, thirty years, one flatline
function yearRoll(v, x, y, size) {       // odometer: the ones digit rolls, tens carry when ones pass 9
  g.save(); g.font = F.disp(size); g.textAlign = 'center'; g.fillStyle = TXT;
  const dw = size * 0.72, ones = v % 10, tens = Math.floor(v / 10) % 10 + Math.max(0, ones - 9), digits = [1, 9, tens, ones];
  digits.forEach((d, i) => { const cx = x + (i - 1.5) * dw; g.save(); g.beginPath(); g.rect(cx - dw / 2 - 4, y - size * 0.9, dw + 8, size * 1.05); g.clip();
    const n = Math.floor(d), f = i < 2 ? 0 : d - n;
    g.fillText(String(n % 10), cx, y - f * size); g.fillText(String((n + 1) % 10), cx, y + (1 - f) * size); g.restore(); });
  g.restore();
}
const YEAR_S3 = (t) => 30 * Math.pow(clamp((t - 0.95) / 2.1), 1.15);
VIS[2] = (K) => {
  for (let y = 1; y <= 30; y++) K(0.95 + 2.1 * Math.pow(y / 30, 1 / 1.15), 'tick', y % 5 ? 0.4 : 1);
  return (t) => {
    atmosphere(t, { x: 540, y: 700, r: 800, c: 'rgba(255,194,61,0.07)' }); tag(t, 2, 7);
    const yv = YEAR_S3(tq(t)), n = Math.floor(yv + 1e-6), T = t;
    yearRoll(1965 + yv, 540, 560, 230);
    monitor(T, 650, 'HER', 'AGE ' + (90 + n), GOLD, 0.95, null);
    monitor(T + 0.37, 930, 'THE NOTARY', fmt(n * 12), TXT, 0.8, null, { subLabel: 'MONTHS PAID' });
  };
};
VIS[3] = (K, S) => {
  const FLAT = 2.3, STAMP = 2.62;
  for (let k = 0; k < 3; k++) K(0.55 + k * 0.8, 'beep', 0.5);
  K(FLAT, 'flat', 1, 1.6); K(FLAT - 0.05, 'mute', 1, 1.1); K(STAMP, 'scratch'); K(STAMP + 0.02, 'thump', 1.3);
  K(3.3, 'land', 0.6); K(4.55, 'swish', 0.5); K(5.0, 'pop', 0.8, 500); K(5.55, 'hit', 0.7);
  return (t) => {
    const lt = t - STAMP, shake = lt > 0 && lt < 0.5 ? Math.sin(lt * 70) * (1 - lt / 0.5) * 20 : 0;
    g.save(); g.translate(shake, shake * 0.4);
    atmosphere(t, { x: 540, y: 700, r: 800, c: t > FLAT ? 'rgba(255,59,48,0.10)' : 'rgba(255,194,61,0.07)' }); tag(t, 3, 7);
    const out = spring(t - 4.45, 200, 26), T = t + 50;
    if (out < 0.999) { g.save(); g.globalAlpha = clamp(1 - out); g.translate(0, -120 * out);
      yearRoll(1995, 540, 560, 230);
      const alive = spring(t - 3.25, 200, 14);
      monitor(T, 650, 'HER', 'AGE 120', GOLD, 0.95, null, { edge: alive > 0 ? GOLD : EDGE });
      monitor(T + 0.37, 930, 'THE NOTARY', t > FLAT ? '0' : '360', TXT, 0.8, 50.37 + FLAT, { subLabel: t > FLAT ? 'DIED 25 DEC 1995' : 'MONTHS PAID' });
      if (alive > 0) chip('STILL ALIVE', 820, 650, t, 3.25, { size: 30 });
      if (lt > 0) { const p = spring(lt, 320, 20), sc = lerp(2.6, 1, p);
        g.save(); g.translate(540, 1060); g.rotate(-0.1); g.scale(sc, sc); g.globalAlpha *= clamp(p * 3);
        g.font = F.disp(110); const w = g.measureText('HE DIED FIRST').width + 80;
        rrect(-w / 2, -86, w, 160, 18); g.fillStyle = 'rgba(12,11,10,0.55)'; g.fill(); g.lineWidth = 12; g.strokeStyle = RED; g.stroke();
        g.fillStyle = RED; g.textAlign = 'center'; g.fillText('HE DIED FIRST', 0, 38); g.restore(); }
      g.restore(); }
    if (lt > 0 && lt < 0.1) { g.fillStyle = '#fff'; g.globalAlpha = 0.35 * (1 - lt / 0.1); g.fillRect(-50, -50, W + 100, H + 100); g.globalAlpha = 1; }
    if (out > 0.001) {   // she was paid more than double the flat's value
      g.save(); g.globalAlpha = clamp(out * 1.5);
      rise('BY THEN, SHE HAD BEEN PAID', 80, 520, 'mono', 34, GOLD, t, 4.5, { stagger: 0.03 });
      const b1 = spring(t - 4.7, 120, 20), b2 = spring(t - 5.0, 90, 13);
      text("THE FLAT'S VALUE", 80, 640, 'ui', 44, DIM); rrect(80, 670, Math.max(1, 380 * b1), 130, 18); g.fillStyle = '#4A453E'; g.fill();
      text('PAID TO HER', 80, 900, 'ui', 44, TXT); rrect(80, 930, Math.max(1, 880 * b2), 130, 18); g.fillStyle = GOLD; g.fill();
      g.strokeStyle = 'rgba(12,11,10,0.5)'; g.lineWidth = 4; g.setLineDash([12, 12]); g.beginPath(); g.moveTo(80 + 380, 920); g.lineTo(80 + 380, 1070); g.moveTo(80 + 760, 920); g.lineTo(80 + 760, 1070); g.stroke(); g.setLineDash([]);
      const ls = spring(t - 5.55, 300, 16); if (ls > 0) { g.save(); g.translate(880, 1020); g.scale(ls, ls); text('>2×', 0, 0, 'disp', 96, BG, { align: 'right' }); g.restore(); }
      g.restore(); }
    g.restore();
  };
};
// ---- 5: 122
VIS[4] = (K) => {
  for (let a = 91; a <= 122; a++) K(0.5 + 1.45 * Math.pow((a - 90) / 32, 1 / 1.6), 'tick', 0.45);
  K(1.95, 'hit', 1); K(2.5, 'pop', 0.8, 900);
  return (t) => {
    const land = t - 1.95, glow = land > 0 ? 0.1 + 0.25 * Math.exp(-land * 2) : 0.08;
    atmosphere(t, { x: 540, y: 780, r: 760, c: `rgba(255,194,61,${glow})` }); tag(t, 4, 7);
    const u = Math.pow(clamp((tq(t) - 0.5) / 1.45), 1.6), age = Math.floor(90 + 32 * u + 1e-6), s0 = spring(t - 0.3, 200, 22);
    const cx = 540, cy = 790, R = 390;
    g.save(); g.globalAlpha = clamp(s0 * 2);
    for (let i = 0; i < 122; i++) { const a = -Math.PI / 2 + i / 122 * Math.PI * 2, on = i < age, big = i % 10 === 9;
      g.strokeStyle = on ? GOLD : '#34302A'; g.lineWidth = big ? 7 : 4; const r0 = R - (big ? 44 : 28);
      g.beginPath(); g.moveTo(cx + Math.cos(a) * r0, cy + Math.sin(a) * r0); g.lineTo(cx + Math.cos(a) * R, cy + Math.sin(a) * R); g.stroke(); }
    const pop = land > 0 ? 1 + 0.12 * Math.exp(-land * 5) * Math.cos(land * 18) : 1;
    g.save(); g.translate(cx, cy + 110); g.scale(pop, pop); text(String(age), 0, 0, 'disp', 300, land > 0 ? GOLD : TXT, { align: 'center', shadow: true }); g.restore();
    text('YEARS · 164 DAYS', cx, cy + 190, 'mono', 34, TXT, { align: 'center', ls: 5, alpha: land * 3 });
    g.restore();
    chip('OLDEST VERIFIED HUMAN EVER', 540, 580 - 30, t, 2.5, { size: 28 });
    if (land > 0) for (let r = 0; r < 2; r++) { const ph = clamp(land * 1.1 - r * 0.25); if (ph <= 0 || ph >= 1) continue;
      g.strokeStyle = GOLD; g.globalAlpha = (1 - ph) * 0.6; g.lineWidth = 6; g.beginPath(); g.arc(cx, cy, R + ph * 300, 0, 6.283); g.stroke(); g.globalAlpha = 1; }
  };
};
// ---- 6: Van Gogh, one star
const STROKES = []; { const r = rng(88); for (let i = 0; i < 1100; i++) STROKES.push({ x: r() * W, y: 200 + r() * 1500, l: 18 + r() * 34, c: r(), ph: r() * 6.28 }); }
const flow = (x, y, t) => Math.sin(x / 170 + t * 0.35) * 1.6 + Math.cos(y / 140 - t * 0.25) * 1.3 + Math.atan2(y - 520, x - 760) * 0.9;
function star(x, y, r, fill) { g.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.45 : r; g.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); } g.closePath(); g.fillStyle = fill; g.fill(); }
VIS[5] = (K) => {
  K(0.9, 'pop', 0.6, 600); K(1.6, 'swish', 0.6); K(2.95, 'whoosh', 0.7);
  for (let i = 0; i < 5; i++) K(3.2 + i * 0.09, i ? 'tick' : 'pop', i ? 0.6 : 0.9, 1100); K(3.85, 'thump', 0.7);
  return (t) => {
    atmosphere(t);
    const on = spring(t - 0.2, 60, 14);
    g.save(); g.lineCap = 'round'; g.lineWidth = 11;
    for (const s of STROKES) { const a = flow(s.x, s.y, t), hue = s.c;
      g.strokeStyle = hue < 0.55 ? '#1E3A7A' : hue < 0.8 ? '#3563C9' : hue < 0.93 ? '#7EA1E8' : '#E8B93A'; g.globalAlpha = 0.55 * on;
      const l = s.l * (0.8 + 0.2 * Math.sin(t * 2 + s.ph)); g.beginPath(); g.moveTo(s.x - Math.cos(a) * l / 2, s.y - Math.sin(a) * l / 2); g.lineTo(s.x + Math.cos(a) * l / 2, s.y + Math.sin(a) * l / 2); g.stroke(); }
    g.restore(); g.globalAlpha = 1;
    g.fillStyle = 'rgba(12,11,10,0.45)'; g.fillRect(0, 0, W, H);
    tag(t, 5, 7);
    const card = spring(t - 2.95, 170, 20);
    g.save(); g.globalAlpha = clamp(1 - card); g.translate(0, -140 * card);
    chip('ARLES, 1888 · SHE WAS 13', 80, 420, t, 0.85, { size: 30, align: 'left' });
    rise('VINCENT', 80, 640, 'disp', 170, TXT, t, 1.55); rise('VAN GOGH', 80, 810, 'disp', fit('VAN GOGH', 'disp', 170, 920), GOLD, t, 1.7);
    g.restore();
    if (card > 0.001) { g.save(); g.translate(0, (1 - card) * 900);
      rrect(100, 470, 880, 660, 36); g.fillStyle = TXT; g.fill();
      g.fillStyle = '#E8B93A'; g.beginPath(); g.arc(200, 580, 58, 0, 6.283); g.fill(); text('V', 200, 603, 'disp', 64, PINK, { align: 'center' });
      text('Vincent van Gogh', 290, 572, 'ui', 50, PINK); text('Painter · Arles', 290, 620, 'ui', 32, '#8A8174', { });
      for (let i = 0; i < 5; i++) { const s = spring(t - 3.2 - i * 0.09, 380, 16); if (s <= 0) continue;
        g.save(); g.translate(190 + i * 100, 750); g.scale(s, s); star(0, 0, 40, i === 0 ? '#F5A623' : '#D6CEBF'); g.restore(); }
      const q = '“Very disagreeable.”', n = Math.floor(q.length * clamp((tq(t) - 3.85) / 0.9));
      text(q.slice(0, n), 150, 910, 'serif', 84, PINK);
      text('REVIEWED BY JEANNE, AGE 13', 150, 1060, 'mono', 24, '#8A8174', { ls: 3, alpha: (t - 4.5) * 3 });
      g.restore(); }
  };
};
// ---- 7: her verdict, typed in sync with the voice, then back to the hook (loop)
VIS[6] = (K, S) => {
  K(0.5, 'swish', 0.4); K(4.0, 'land', 0.5);
  const words = 'In life, one sometimes makes bad deals.'.split(' '), pl = S.vo[0];
  const hw = 5, tot = 'Her verdict on the deal? In life, one sometimes makes bad deals.'.split(' ').length;
  const tw = (i) => pl.at + 0.04 + (pl.end - pl.at) * (0.1 + 0.88 * (hw + i) / tot);   // rough word times
  return (t) => {
    atmosphere(t, { x: 540, y: 820, r: 820, c: 'rgba(255,194,61,0.09)' }); tag(t, 6, 7);
    rise('HER VERDICT ON THE DEAL:', 80, 540, 'mono', 36, GOLD, t, 0.5, { stagger: 0.05 });
    const lines = [[0, 1], [2, 3], [4, 5, 6]]; g.font = F.serif(124);
    lines.forEach((ln, li) => { let x = 80; const y = 740 + li * 150;
      ln.forEach((wi) => { const w = words[wi], ww = g.measureText(w + ' ').width, p = spring(t - tw(wi), 300, 24);
        if (p > 0.001) { g.save(); g.globalAlpha = clamp(p * 1.5); g.translate(x, y + (1 - p) * 40);
          text(w, 0, 0, 'serif', 124, wi >= 5 ? GOLD : TXT, { shadow: true }); g.restore(); }
        x += ww; }); });
    const a = spring(t - 3.9, 200, 24); if (a > 0) { g.fillStyle = GOLD; g.fillRect(84, 1130, 160 * a, 6); text('JEANNE CALMENT, 1875–1997', 84, 1190, 'mono', 30, TXT, { ls: 4, alpha: a }); }
  };
};

