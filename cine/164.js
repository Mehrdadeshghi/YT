// Wiki Roulette #164 — DEEP SEA: frilled shark. Frame 1 = the first photo of a live frilled shark in its habitat (NOAA, 2004, 2,866 ft)
// under "pregnant for 3.5 years" → the frilly gills (real specimen photo) → the open mouth, 300 teeth (real photo) + a drawn trident tooth →
// drawn: prey more than half its size, swallowed whole → Garman's 1884 plate, LIVING FOSSIL → pregnancy timeline 3.5 years vs a human's 9 months.
const N164 = 4, FRILL164 = '#F2A7B5';
const ill164 = (t, y = 1590, s = 'ILLUSTRATION') => text(s, 1000, y, 'mono', 22, 'rgba(255,255,255,0.55)', { ls: 3, align: 'right' });
function deep164(t) { const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, '#06223A'); gr.addColorStop(1, '#020814'); g.fillStyle = gr; g.fillRect(0, 0, W, H); marineSnow(t, 20, 0.6); }
// one trident-shaped tooth (cusp + two cusplets), centred at x,y, height h
function tooth164(x, y, h, a = 1) { g.save(); g.globalAlpha *= a; g.translate(x, y); g.fillStyle = '#F4EFE3'; g.strokeStyle = 'rgba(0,0,0,0.5)'; g.lineWidth = 3;
  g.beginPath(); g.moveTo(-h * 0.42, h * 0.5); g.lineTo(h * 0.42, h * 0.5); g.lineTo(h * 0.3, h * 0.2);
  g.lineTo(h * 0.36, -h * 0.25); g.lineTo(h * 0.16, h * 0.05); g.lineTo(0, -h * 0.5); g.lineTo(-h * 0.16, h * 0.05); g.lineTo(-h * 0.36, -h * 0.25); g.lineTo(-h * 0.3, h * 0.2);
  g.closePath(); g.fill(); g.stroke(); g.restore(); }
// a squid silhouette pointing left, body length L
function squid164(x, y, L, t, a = 1) { g.save(); g.globalAlpha *= a; g.translate(x, y); g.fillStyle = '#E58A6B';
  g.beginPath(); g.moveTo(-L * 0.1, 0); g.quadraticCurveTo(L * 0.2, -L * 0.13, L * 0.55, -L * 0.04); g.lineTo(L * 0.62, -L * 0.12); g.lineTo(L * 0.62, L * 0.12); g.lineTo(L * 0.55, L * 0.04); g.quadraticCurveTo(L * 0.2, L * 0.13, -L * 0.1, 0); g.fill();
  g.strokeStyle = '#E58A6B'; g.lineWidth = L * 0.02; g.lineCap = 'round'; for (let k = -3; k <= 3; k++) { g.beginPath(); g.moveTo(-L * 0.08, k * L * 0.01); g.quadraticCurveTo(-L * 0.25, k * L * 0.03 + Math.sin(t * 4 + k) * L * 0.02, -L * 0.38, k * L * 0.045); g.stroke(); }
  g.fillStyle = '#111'; g.beginPath(); g.arc(L * 0.02, -L * 0.03, L * 0.025, 0, 6.283); g.fill(); g.restore(); }

// ---------- scenes ----------
VIS.open = vopen({ ph: 'wild', a: [0.84, 0.45, 1.0], b: [0.8, 0.45, 1.1], o: { anchor: [640, 1000] },
  x: (t, P) => { realBadge(t, 0.3, 'REAL PHOTO · NOAA · 2,866 FT DEEP', 1500); } });

VIS[0] = S(() => { const fr = sw('frilly', 2.0), si = sw('six', 3.4);
  return vscene(0, N164, { ph: 'side', o: { box: [40, 600, 1000, 720], backdrop: false }, a: [0.2, 0.3, 1.9], b: [0.22, 0.3, 2.3], badge: 'ILLUSTRATION · R. MINTERN',
    k: [[fr, 'ding', 1], [si, 'pop', 0.9]], f2: ['THE FRILLED', 'SHARK', null, 0.3, { y: 470, size: 110 }],
    x: (t, P) => { if (!P) return; if (t > fr) { const [x, y] = P(0.225, 0.27); ring(t, fr, x, y, 150, { color: FRILL164, spot: false }); callout(t, fr + 0.1, [x, y + 90], 380, 1420, 'FRILLY GILLS', { bg: FRILL164 }); }
      if (t > si) chip('6 PAIRS', 800, 1420, t, si, { size: 44, bg: GOLD, fg: BG }); } }); });

VIS[1] = S(() => { const hu = sw('hundred', 1.4), tr = sw('trident', 3.6);
  return vscene(1, N164, { ph: 'mouth', a: [0.5, 0.45, 1.05], b: [0.5, 0.5, 1.3], badge: 'REAL PHOTO · SHIN-ENOSHIMA AQUARIUM', k: [[hu, 'hit', 1.1], [tr, 'swish', 0.9]],
    x: (t, P) => { if (!P) return; if (t > hu) { popNum('300 TEETH', 540, 470, 120, GOLD, t, hu, { align: 'center' }); }
      if (t > tr) { const a = clamp((t - tr) / 0.3); g.save(); g.globalAlpha = a; rrect(700, 1120, 300, 330, 28); g.fillStyle = 'rgba(8,10,14,0.85)'; g.fill(); g.strokeStyle = GOLD; g.lineWidth = 4; g.stroke(); g.restore();
        tooth164(850, 1265, 210 * (0.6 + 0.4 * easeOut((t - tr) / 0.4)), a); text('TRIDENT', 850, 1430, 'mono', 26, GOLD, { ls: 4, align: 'center' }); text('GRAPHIC', 850, 1150, 'mono', 18, 'rgba(255,255,255,0.55)', { ls: 3, align: 'center' }); } } }); });

VIS[2] = S(() => { const ha = sw('half', 1.4), wh = sw('Whole', 2.6);
  return (K) => { ks(K, [[0.1, 'whoosh', 0.8], [ha, 'pop', 0.9], [wh, 'hit', 1.2], [wh + 0.05, 'thump', 0.9]]);
    return (t) => { deep164(t); tag(t, 2, N164);
      // the shark (real-plate silhouette) on the left, the squid swims in from the right; on "whole" it slides into the mouth
      const im = PHOTOS.side, sx = 40, sy = 880, sw2 = 1000; if (im) { g.save(); g.globalAlpha = 0.95; g.filter = 'invert(0.9) brightness(0.9)'; g.globalCompositeOperation = 'lighten'; g.drawImage(im, sx, sy, sw2, sw2 * im.height / im.width); g.restore(); }
      const L = sw2 * 0.55, gulp = clamp((t - wh) / 0.5), mx = sx + 0.03 * sw2, my = sy + 0.21 * sw2 * im.height / im.width;
      const qx = lerp(lerp(1300, 560, easeOut(t / 1.0)), mx, ease(gulp)), qy = lerp(sy - 200, my, ease(gulp));
      if (gulp < 1) squid164(qx, qy, L * (1 - 0.6 * gulp), t, 1 - gulp);
      if (t > ha && gulp <= 0) { g.save(); g.strokeStyle = GOLD; g.lineWidth = 6; g.setLineDash([16, 12]); g.beginPath(); g.moveTo(sx, sy + 330); g.lineTo(sx + sw2, sy + 330); g.stroke();
        g.beginPath(); g.moveTo(560 - L * 0.38, sy - 90); g.lineTo(560 + L * 0.62, sy - 90); g.stroke(); g.restore();
        chip('PREY > ½ ITS SIZE', 540, 1380, t, ha, { size: 44, bg: GOLD, fg: BG }); }
      if (t > wh) { stampText('WHOLE.', 540, 560, t, wh, { size: 120 }); }
      fact2(t, 0.2, 'ONE BITE.', '', null, { y: 330, size: 100 });
      ill164(t); }; }; });

VIS[3] = S(() => { const fo = sw('fossil', 1.6), sl = sw('slowly', 3.4), ye = sw('years', 5.2);
  return (K) => { ks(K, [[0.1, 'whoosh', 0.8], [fo, 'crack', 1], [sl, 'swish', 0.8], [ye, 'hit', 1.1]]);
    return (t) => { deep164(t); tag(t, 3, N164);
      const tl = clamp((t - sl + 0.2) / 0.4);
      if (tl < 1) { g.save(); g.globalAlpha = 1 - tl; framed(t, 'garman', 60, 520, 960, { credit: '', backdrop: false }); stampText('LIVING FOSSIL', 540, 1300, t, fo, { size: 92 }); ill164(t, 1500, 'ILLUSTRATION · S. GARMAN, 1884'); g.restore(); }
      if (tl > 0) { g.save(); g.globalAlpha = tl;
        text('PREGNANCY', 80, 520, 'disp', 72, TXT); const bx = 80, bw = 920;
        // frilled shark bar: fills to 3.5 years, human bar: 9 months
        const p = clamp((t - sl) / (ye - sl + 0.3)), ys = 700, yh = 1000;
        for (const [y, frac, col, lab] of [[ys, p, FRILL164, 'FRILLED SHARK'], [yh, Math.min(p, 0.75 / 3.5) / 1, '#9ED8FF', 'HUMAN']]) {
          text(lab, bx, y - 24, 'mono', 30, col, { ls: 4 }); rrect(bx, y, bw, 70, 35); g.fillStyle = 'rgba(255,255,255,0.1)'; g.fill();
          rrect(bx, y, Math.max(70, bw * frac), 70, 35); g.fillStyle = col; g.fill(); }
        text(`${(3.5 * p).toFixed(1)} YEARS`, bx + bw, ys + 140, 'disp', 64, FRILL164, { align: 'right' });
        text('9 MONTHS', bx + bw * 0.75 / 3.5 + 20, yh + 52, 'mono', 32, '#9ED8FF');
        ill164(t, 1120, 'GRAPHIC'); g.restore(); } }; }; });
