// Wiki Roulette #192 — WHY? #7: why is the sky blue? (series kit: cine/why.js)
// Frame 1 = WHY? badge + question over two real photos: Apollo 11 on the Moon (black sky) vs a clear blue sky →
// REASON 1 air (real photo: white light split by a prism → GRAPHIC: air molecules scatter short blue waves everywhere, long red
// waves pass) → REASON 2 your eyes (GRAPHIC: spectrum 380–740 nm with scattering ~ 1/λ⁴, violet highest; blue + violet mix =
// sky blue) → REASON 3 sunset (real photo: Mojave Desert sunset; GRAPHIC: short noon path vs long sunset path) → comment card.
const N192 = 3;
const gfx192 = (x, y) => text('GRAPHIC', x, y, 'mono', 22, 'rgba(255,255,255,0.6)', { ls: 3, align: 'right' });

// a travelling sine wave from (x0,y0) to (x1,y1); lam = wavelength px; drawn up to fraction p
function wave192(t, x0, y0, x1, y1, lam, amp, col, p = 1, lw = 6) {
  const L = Math.hypot(x1 - x0, y1 - y0) * clamp(p), ux = (x1 - x0) / Math.hypot(x1 - x0, y1 - y0), uy = (y1 - y0) / Math.hypot(x1 - x0, y1 - y0);
  if (L < 2) return; g.save(); g.strokeStyle = col; g.lineWidth = lw; g.lineCap = 'round'; g.shadowColor = col; g.shadowBlur = 14; g.beginPath();
  for (let s = 0; s <= L; s += 3) { const o = Math.sin((s / lam - t * 2.2) * 6.283) * amp; const x = x0 + ux * s - uy * o, y = y0 + uy * s + ux * o; s ? g.lineTo(x, y) : g.moveTo(x, y); }
  g.stroke(); g.restore(); }

// GRAPHIC: sunlight enters from the left; a molecule scatters blue in all directions, red passes straight through
function scatter192(t, t0, tB, tR, y0 = 690, h = 760) {
  const a = clamp((t - t0) / 0.3); if (a <= 0) return; g.save(); g.globalAlpha = a;
  const gr = g.createLinearGradient(0, y0, 0, y0 + h); gr.addColorStop(0, '#0B1E3A'); gr.addColorStop(1, '#13325C');
  rrect(40, y0, 1000, h, 30); g.fillStyle = gr; g.fill(); g.lineWidth = 3; g.strokeStyle = 'rgba(255,255,255,0.16)'; g.stroke(); g.restore();
  g.save(); rrect(40, y0, 1000, h, 30); g.clip(); g.globalAlpha = a;
  const cy = y0 + h * 0.56, mx = 470;
  // the sun + incoming white light
  glowDot(40, cy, 150, '255,240,200', 0.9);
  const pin = clamp((t - t0) / 0.6);
  wave192(t, 80, cy, mx, cy, 150, 14, '#FFFFFF', pin, 5);
  // molecules (air)
  const r = rng(7); for (let i = 0; i < 26; i++) { const x = 120 + r() * 900, y = y0 + 40 + r() * (h - 80); g.fillStyle = 'rgba(200,225,255,0.35)'; g.beginPath(); g.arc(x, y, 7, 0, 6.283); g.fill(); }
  g.fillStyle = '#CFE3FF'; g.beginPath(); g.arc(mx, cy, 22, 0, 6.283); g.fill();
  // red passes straight
  if (t > tR) wave192(t, mx + 30, cy + 6, 1040, cy + 6, 150, 16, '#FF5A4A', clamp((t - tR) / 0.6), 6);
  // blue scattered everywhere
  if (t > tB) { const p = clamp((t - tB) / 0.7); for (let k = 0; k < 9; k++) { const an = -2.6 + k * 0.62 + (k > 4 ? 0.5 : 0);
      wave192(t, mx + Math.cos(an) * 30, cy + Math.sin(an) * 30, mx + Math.cos(an) * 520, cy + Math.sin(an) * 520, 46, 9, '#4FA3FF', p, 5); } }
  g.restore();
  label('AIR MOLECULE', mx, cy + 70, t, t0 + 0.3, { size: 24, align: 'center', color: '#CFE3FF', ls: 3 });
  if (t > tB) chip('BLUE: SCATTERED EVERYWHERE', 540, y0 + 70, t, tB, { size: 30, bg: '#4FA3FF', fg: BG });
  if (t > tR) chip('RED: PASSES', 840, cy + 90, t, tR, { size: 30, bg: '#FF5A4A', fg: '#FFF' });
  gfx192(1010, y0 + h - 22);
}

// GRAPHIC: visible spectrum (Color vision ranges) with scattering strength ~ 1/λ⁴
const BANDS192 = [[380, 450, '#8B4FE0', 'VIOLET'], [450, 485, '#3D7BFF', 'BLUE'], [485, 500, '#2FC6D8', ''], [500, 565, '#3DCB5A', 'GREEN'],
                  [565, 590, '#F2D23A', ''], [590, 625, '#FF9A2E', ''], [625, 740, '#FF4A3A', 'RED']];
function spectrum192(t, t0, tV, x, y, w, h) {
  if (t < t0) return; panel(x, y, w, h, 0.85); const bx = x + 40, bw = w - 80, base = y + h - 70, px = (l) => bx + (l - 380) / 360 * bw;
  const p = easeOut((t - t0) / 0.8);
  for (let l = 380; l < 740; l += 6) { const band = BANDS192.find((b) => l >= b[0] && l < b[1]), s = Math.pow(380 / l, 4), bh = (h - 150) * s * p;
    g.fillStyle = band[2]; g.globalAlpha = 0.95; g.fillRect(px(l), base - bh, bw / 60 - 2, bh); }
  g.globalAlpha = 1; BANDS192.forEach(([a, b, c, n]) => { g.fillStyle = c; g.fillRect(px(a), base + 8, px(b) - px(a), 14); if (n) label(n, (px(a) + px(b)) / 2, base + 50, t, t0 + 0.3, { size: 22, align: 'center', color: TXT, ls: 2 }); });
  label('HOW MUCH AIR SCATTERS EACH COLOR', x + 40, y + 46, t, t0 + 0.2, { size: 24, color: TXT, ls: 3 });
  if (t > tV) { ring(t, tV, px(400), base - (h - 150) * 0.85, 60, { spot: false, lw: 6 }); }
  gfx192(x + w - 30, y + 46);
}

// ---------- scenes ----------
VIS.open = (K) => { K(0.15, 'hit', 1.3); K(0.2, 'mute', 1, 0.4); const mo = sw('moon', 0.5), he = sw('here', 2.4), wh = sw('why', 3.2);
  K(he, 'pop', 1); K(wh, 'thump', 1);
  return (t) => { atmosphere(t);
    whyPair(t, { id: 'moon', label: 'THE MOON: BLACK', at: mo, a: [0.45, 0.25, 1.0], b: [0.45, 0.25, 1.08] },
               { id: 'blue', label: 'EARTH: BLUE', at: he, a: [0.5, 0.5, 1.0], b: [0.5, 0.45, 1.08] }, 790, 1570, { cols: true }); tag(t);
    whyBadge(t, -0.4, 80, 345); whyQ(t, -0.5, EP_RAW.why.q, 625, { size: 112 }); }; };

VIS[0] = S(() => { const ev = sw('every', 1.4), sc = sw('scatters', 2.6), bl = sw('blue', 3.0), re = sw('red', 3.8), al = sw('all', 5.0);
  return (K) => { ks(K, [[0.1, 'whoosh', 0.8], [ev, 'ding', 0.9], [sc, 'whoosh', 0.6], [bl, 'hit', 1], [re, 'tick', 1], [al, 'pop', 0.9]]);
    return (t) => { atmosphere(t);
      if (t < sc) { const P = shot(t, 'prism', { box: [40, 690, 1000, 760], a: [0.5, 0.5, 1.0], b: [0.55, 0.5, 1.12], dur: 4 }); if (!P) noPhoto(t);
        realBadge(t, 0.3, 'REAL PHOTO · WHITE LIGHT SPLIT BY A PRISM');
        if (t > ev) chip('SUNLIGHT = EVERY COLOR', 540, 1380, t, ev, { size: 38, bg: GOLD, fg: BG }); }
      else scatter192(t, sc, bl, re);
      if (t > al) chip('→ BLUE FROM ALL OVER THE SKY', 540, 1380, t, al, { size: 32, bg: GOLD, fg: BG });
      tag(t, 0, N192); whyReason(t, 0.1, 1, 'AIR.'); }; }; });

VIS[1] = S(() => { const vi = sw('violet', 1.4), mx = sw('mix', 3.4), sk = sw('sky', 3.8);
  return (K) => { ks(K, [[0.1, 'whoosh', 0.8], [vi, 'hit', 1], [mx, 'tick', 1], [sk, 'ding', 1]]);
    return (t) => { atmosphere(t);
      const P = shot(t, 'blue2', { box: [40, 690, 1000, 330], a: [0.5, 0.5, 1.0], b: [0.5, 0.5, 1.08], dur: 5 }); if (!P) noPhoto(t);
      spectrum192(t, 0.3, vi, 40, 1040, 1000, 410);
      if (t > vi) chip('VIOLET: EVEN MORE', 640, 1180, t, vi, { size: 30, bg: '#8B4FE0', fg: '#FFF' });
      if (t > mx) { const s = spring(t - mx, 260, 18); g.save(); g.translate(540, 855); g.scale(s, s);
        [['#8B4FE0', -300], ['#3D7BFF', -110]].forEach(([c, x]) => { g.fillStyle = c; g.beginPath(); g.arc(x, 0, 62, 0, 6.283); g.fill(); });
        text('+', -205, 22, 'disp', 64, TXT, { align: 'center' }); text('=', 0, 22, 'disp', 64, TXT, { align: 'center' });
        if (t > sk) { g.fillStyle = '#8FC3FF'; rrect(70, -62, 250, 124, 62); g.fill(); text('SKY BLUE', 195, 12, 'mono', 30, BG, { align: 'center', ls: 2 }); }
        g.restore(); }
      tag(t, 1, N192); whyReason(t, 0.1, 2, 'YOUR EYES.'); }; }; });

VIS[2] = S(() => { const su = sw('sunset', 0.9), mo = sw('more', 2.0), bl = sw('blue', 2.8), or = sw('orange', 4.0), nx = sw('next', 8.2);
  return (K) => { ks(K, [[0.1, 'whoosh', 0.8], [mo, 'hit', 1], [bl, 'tick', 1], [or, 'ding', 1], [nx, 'pop', 0.9]]);
    return (t) => { atmosphere(t);
      const P = shot(t, 'sunset3', { box: [40, 690, 1000, 400], a: [0.5, 0.3, 1.0], b: [0.5, 0.32, 1.1], dur: 8 }); if (!P) noPhoto(t);
      text('● REAL PHOTO · SUNSET, MOJAVE DESERT, CALIFORNIA', 70, 740, 'mono', 22, 'rgba(255,255,255,0.9)', { ls: 2, shadow: true });
      // GRAPHIC: the same atmosphere, short path at noon vs long path at sunset
      if (t > su) { const y0 = 1105, h = 200, a = clamp((t - su) / 0.3); g.save(); g.globalAlpha = a; panel(40, y0, 1000, h, 0.88);
        g.save(); rrect(40, y0, 1000, h, 30); g.clip();
        g.fillStyle = 'rgba(79,163,255,0.22)'; g.fillRect(40, y0 + 40, 1000, 110); g.fillStyle = '#2A2620'; g.fillRect(40, y0 + 150, 1000, 60);
        g.restore();
        g.strokeStyle = '#FFFFFF'; g.lineWidth = 6; g.setLineDash([14, 10]); g.beginPath(); g.moveTo(250, y0 + 20); g.lineTo(250, y0 + 150); g.stroke();
        const pl = clamp((t - mo) / 0.8); g.strokeStyle = '#FF8A3A'; g.beginPath(); g.moveTo(1000, y0 + 45); g.lineTo(lerp(1000, 420, pl), lerp(y0 + 45, y0 + 150, pl)); g.stroke(); g.setLineDash([]);
        g.restore();
        label('NOON: SHORT PATH', 270, y0 + 185, t, su, { size: 22, color: TXT, ls: 2 });
        label('SUNSET: LONG PATH', 1000, y0 + 185, t, mo, { size: 22, color: '#FF8A3A', ls: 2, align: 'right' });
        text('GRAPHIC', 1010, y0 + 30, 'mono', 20, 'rgba(255,255,255,0.55)', { ls: 3, align: 'right' }); }
      if (t > bl && t < nx) chip('BLUE + GREEN: SCATTERED OUT', 540, 1000, t, bl, { size: 30, bg: '#4FA3FF', fg: BG });
      if (t > or && t < nx) chip('ORANGE + RED: LEFT', 540, 1060, t, or, { size: 30, bg: '#FF8A3A', fg: BG });
      tag(t, 2, N192); whyReason(t, 0.1, 3, 'SUNSET.');
      whyNext(t, nx, undefined, 1340); }; }; });
