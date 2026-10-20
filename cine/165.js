// Wiki Roulette #165 — OCEAN: box jellyfish. Frame 1 = real footage of a swimming box jellyfish + "24 EYES. NO BRAIN." →
// real photo (Tripedalia): 6 eyes × 4 sides = 24, ring on an eye cluster (lens + retina) → drawn: the upper eye looks out of the water at the
// mangrove trees (illustration) → real footage: it hunts, speed dial to 4.6 mph → real photo (Chironex sp.): 170+ toxic proteins →
// real photo: a vinegar holder on an Australian beach → binary question.
const N165 = 4, SEA165 = ['#0A3550', '#03101C'], JELLY165 = 'rgba(200,235,255,', MANG165 = '#1F4A2A';
const SNOW165 = (() => { const r = rng(165), s = []; for (let i = 0; i < 60; i++) s.push([r() * 1080, 900 + r() * 1020, 1 + r() * 2.5, 0.2 + r() * 0.6]); return s; })();
const ill165 = (t, y = 1440) => text('ILLUSTRATION', 1000, y, 'mono', 22, 'rgba(255,255,255,0.55)', { ls: 3, align: 'right' });

// a drawn box jellyfish (bell = rounded box, tentacles from the 4 corners); eyeY = where the eye cluster sits
function jelly165(x, y, s, t) { g.save(); g.translate(x, y); g.scale(s, s);
  g.strokeStyle = JELLY165 + '0.55)'; g.lineWidth = 6; g.lineCap = 'round';
  for (const dx of [-80, -30, 30, 80]) { g.beginPath(); g.moveTo(dx, 110); for (let k = 1; k <= 8; k++) g.lineTo(dx + Math.sin(t * 2 + k * 0.7 + dx) * 10, 110 + k * 38); g.stroke(); }
  g.fillStyle = JELLY165 + '0.22)'; g.strokeStyle = JELLY165 + '0.8)'; g.lineWidth = 5; rrect(-110, -110, 220, 220, 60); g.fill(); g.stroke();
  g.fillStyle = JELLY165 + '0.18)'; rrect(-80, -80, 160, 120, 40); g.fill();
  g.fillStyle = '#1A1A1A'; for (const ex of [-112, 112]) { g.beginPath(); g.arc(ex, 50, 10, 0, 6.283); g.fill(); }
  g.restore(); return [x + 112 * s, y + 50 * s]; }

// mangrove canopy above the water line (wl)
function mangrove165(t, wl) { const sk = g.createLinearGradient(0, 0, 0, wl); sk.addColorStop(0, '#5E8FB8'); sk.addColorStop(1, '#BCD8E8'); g.fillStyle = sk; g.fillRect(0, 0, W, wl);
  g.strokeStyle = '#3A2A1C'; g.lineWidth = 10; for (const bx of [140, 330, 760, 940]) for (const dx of [-40, 0, 40]) { g.beginPath(); g.moveTo(bx, 470); g.quadraticCurveTo(bx + dx * 0.5, wl - 60, bx + dx, wl + 40); g.stroke(); }
  g.fillStyle = MANG165; for (const [cx, cy, r] of [[140, 380, 170], [330, 330, 190], [540, 300, 150], [760, 340, 200], [950, 390, 170]]) { g.beginPath(); g.arc(cx + Math.sin(t + cx) * 4, cy, r, 0, 6.283); g.fill(); }
  g.fillStyle = 'rgba(255,255,255,0.08)'; for (const [cx, cy, r] of [[300, 260, 90], [720, 280, 110]]) { g.beginPath(); g.arc(cx, cy, r, 0, 6.283); g.fill(); } }
function water165(t, wl) { const gr = g.createLinearGradient(0, wl, 0, H); gr.addColorStop(0, SEA165[0]); gr.addColorStop(1, SEA165[1]); g.fillStyle = gr; g.fillRect(0, wl, W, H - wl);
  g.strokeStyle = 'rgba(255,255,255,0.6)'; g.lineWidth = 5; g.beginPath(); for (let x = 0; x <= W; x += 20) g.lineTo(x, wl + Math.sin(x * 0.03 + t * 2) * 6); g.stroke();
  g.save(); SNOW165.forEach(([x, y, r, a]) => { g.globalAlpha = a * 0.35; g.fillStyle = '#CFE8FF'; g.beginPath(); g.arc(x + Math.sin(t * 0.3 + y) * 8, Math.max(wl + 10, (y + t * 10 * r) % 1920), r, 0, 6.283); g.fill(); }); g.restore(); }

// ---------- scenes ----------
VIS.open = vopen({ clip: 'swim', a: [0.47, 0.42, 1.0], b: [0.47, 0.42, 1.12], foot: 'REAL FOOTAGE · BOX JELLYFISH',
  x: (t) => { const br = sw('brain', 1.3); if (t > br) stampText('?!', 900, 760, t, br, { size: 120, rot: 0.12, color: GOLD }); } });

VIS[0] = S(() => { const si = sw('six', 0.9), fo = sw('four', 1.6), le = sw('lens', 3.2);
  return vscene(0, N165, { ph: 'trip', o: { box: [40, 690, 1000, 760], shade: false }, a: [0.55, 0.3, 1.25], b: [0.56, 0.29, 1.7], badge: 'REAL PHOTO · BOX JELLYFISH (TRIPEDALIA)',
    k: [[si, 'pop', 0.9], [fo, 'pop', 0.9], [fo + 0.5, 'hit', 1.1], [le, 'ding', 1.1]],
    x: (t, P) => {
      // the counter: 6 × 4 = 24
      panel(80, 400, 920, 260);
      if (t > si) text('6 EYES', 130, 500, 'disp', 72, TXT);
      if (t > fo) text('× 4 SIDES', 445, 500, 'disp', 72, TXT);
      if (t > fo + 0.5) rgbPop('= 24 EYES', 130, 615, 96, GOLD, t, fo + 0.5);
      if (P) { const [x1, y1] = P(0.525, 0.295), [x2, y2] = P(0.625, 0.234); ring(t, si, x1, y1, 70, { spot: false }); ring(t, si + 0.15, x2, y2, 70, { spot: false });
        if (t > le) callout(t, le, [x1, y1 + 60], 300, 1360, 'LENS + RETINA', { bg: GOLD }); } } }); });

VIS[1] = S(() => { const up = sw('up', 0.9), tr = sw('trees', 2.6);
  return (K) => { ks(K, [[0.1, 'whoosh', 0.8], [up, 'swish', 1], [tr, 'ding', 1.1]]);
    return (t) => { const wl = 820; mangrove165(t, wl); water165(t, wl);
      const [ex, ey] = jelly165(500, 1080 + Math.sin(t * 1.5) * 12, 1.1, t);
      if (t > up) { const p = easeOut(clamp((t - up) / 0.6)), top = lerp(ey, 300, p);
        g.save(); g.globalAlpha = 0.35; const cg = g.createLinearGradient(0, ey, 0, top); cg.addColorStop(0, 'rgba(255,240,150,0.9)'); cg.addColorStop(1, 'rgba(255,240,150,0)'); g.fillStyle = cg;
        g.beginPath(); g.moveTo(ex, ey); g.lineTo(ex - 260 * p, top); g.lineTo(ex + 260 * p, top); g.closePath(); g.fill(); g.restore();
        g.save(); g.fillStyle = GOLD; g.shadowColor = GOLD; g.shadowBlur = 20; g.beginPath(); g.arc(ex, ey, 12, 0, 6.283); g.fill(); g.restore(); }
      tag(t, 1, N165);
      if (t > up) chip('↑ ITS UPPER EYE LOOKS OUT OF THE WATER', 540, 900, t, up, { size: 34, bg: GOLD, fg: BG });
      if (t > tr) chip('STEERS BY THE TREES', 540, 580, t, tr, { size: 40, bg: '#57E38A', fg: BG });
      ill165(t); }; }; });

VIS[2] = S(() => { const hu = sw('hunts', 1.2), fo = sw('four', 2.0);
  return vscene(2, N165, { clip: 'swim2', o: { box: [40, 690, 1000, 760] }, a: [0.62, 0.45, 1.0], b: [0.5, 0.45, 1.1], foot: 'REAL FOOTAGE · BOX JELLYFISH',
    k: [[hu, 'hit', 1.1], [fo, 'whoosh', 1], [fo + 0.6, 'hit', 1]],
    x: (t) => { fact2(t, 0.2, "IT DOESN'T DRIFT.", 'IT HUNTS.', null, { y: 470, size: 110 });
      if (t > fo) { const v = 4.6 * easeOut(clamp((t - fo) / 0.6)); panel(560, 1250, 420, 170); text(`${v.toFixed(1)} MPH`, 770, 1360, 'disp', 84, v > 4.55 ? GOLD : TXT, { align: 'center' }); } } }); });

VIS[3] = S(() => { const se = sw('seventy', 1.4), vi = sw('vinegar', 3.6);
  return (K) => { ks(K, [[0.1, 'whoosh', 0.8], [se, 'hit', 1.1], [vi - 0.05, 'whoosh', 1], [vi + 0.2, 'ding', 1]]);
    return (t) => { atmosphere(t); tag(t, 3, N165);
      if (t < vi) { const P = shot(t, 'avispa', { box: [40, 690, 1000, 760], a: [0.5, 0.52, 1.0], b: [0.5, 0.56, 1.12], dur: 4 }); if (!P) noPhoto(t);
        realBadge(t, 0.3, 'REAL PHOTO · BOX JELLYFISH (CHIRONEX), AQUARIUM');
        if (t > se) fact2(t, se, '170+', 'TOXIC PROTEINS', null, { y: 470, size: 84, maxW: 800 }); }
      else { const P = shot(t, 'vinegar', { box: [40, 470, 1000, 1000], a: [0.6, 0.62, 1.05], b: [0.7, 0.68, 1.2], dur: 2.5, t0: vi }); if (!P) noPhoto(t);
        realBadge(t, vi, 'REAL PHOTO · STINGER SIGNS, AUSTRALIA', 410);
        if (P) { const [x, y] = P(0.89, 0.865); ring(t, vi + 0.2, x, y, 110, { spot: false }); callout(t, vi + 0.4, [x - 90, y - 60], 300, 1000, 'VINEGAR FOR FIRST AID', { bg: GOLD }); } } }; }; });
