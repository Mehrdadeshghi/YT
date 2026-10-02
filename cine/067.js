// Wiki Roulette #067 — Melanocetus johnsonii, the black seadevil (fact-photo special)
// photo coords: rob = specimen sheet (top: whole fish v 0.02–0.49, mouth (0.07,0.36); bottom-left: head, lure (0.19,0.54), teeth (0.25,0.86))
// draw = engraving (lure bulb (0.5,0.06), body (0.6,0.46)) · before/after = museum models (fish (0.6,0.5) / (0.45,0.55))
const RW = (P, u, v, du) => Math.abs(P(u + du, v)[0] - P(u, v)[0]);
function depthGauge(t, tIn, x, y0, y1) {          // 0 … 2,000 m, band 200–1,500 m
  const lt = t - tIn; if (lt < 0) return; const a = clamp(lt / 0.3), D = (m) => lerp(y0, y1, m / 2000);
  g.save(); g.globalAlpha = a; panel(x - 30, y0 - 60, 300, y1 - y0 + 110, 0.75);
  const gr = g.createLinearGradient(0, y0, 0, y1); gr.addColorStop(0, '#2C6E8F'); gr.addColorStop(0.15, '#0D2A3A'); gr.addColorStop(1, '#000'); g.fillStyle = gr; g.fillRect(x, y0, 40, y1 - y0);
  [0, 500, 1000, 1500, 2000].forEach((m) => { g.fillStyle = 'rgba(255,255,255,0.6)'; g.fillRect(x + 40, D(m) - 1, 16, 3); text(m.toLocaleString('en-US') + ' M', x + 66, D(m) + 10, 'mono', 26, '#C9C1B4'); });
  const p = easeOut((lt - 0.3) / 0.7); if (p > 0) { g.strokeStyle = GOLD; g.lineWidth = 6; g.strokeRect(x - 6, D(200), 52, (D(1500) - D(200)) * p); }
  if (lt > 1.0) text('IT LIVES HERE', x - 4, D(200) - 18, 'mono', 26, GOLD, { alpha: clamp((lt - 1) * 4) });
  g.restore();
}
VIS.open = (K) => { K(0.15, 'hit', 1.3); K(0.2, 'mute', 1, 0.4); K(1.8, 'thump', 0.8);
  return (t) => { atmosphere(t); const P = shot(t, 'rob', { box: [40, 820, 1000, 620], a: [0.45, 0.26, 1.0], b: [0.42, 0.27, 1.12], dur: 2.5 }); if (!P) noPhoto(t);
    tag(t); hook(t, EP.hook, 480); realBadge(t, 0.3, 'REAL SPECIMEN', 790); }; };
VIS[0] = (K) => { K(0.5, 'riser', 0.4, 1); K(1.0, 'hit', 1); K(1.4, 'sonar', 0.6);
  return (t) => { const P = shot(t, 'draw', { a: [0.55, 0.45, 1.0], b: [0.58, 0.45, 1.12], dur: 5.5, anchor: [400, 940] }); if (!P) noPhoto(t);
    tag(t, 0, 5); realBadge(t, 0.4, 'ENGRAVING');
    fact(t, 1.0, '200–1,500 M', 'DOWN. NO SUNLIGHT REACHES IT.'); depthGauge(t, 1.4, 760, 760, 1160); }; };
VIS[1] = (K) => { K(0.5, 'whoosh', 0.6); K(1.0, 'hit', 1); K(1.8, 'zap', 0.5);
  return (t) => { atmosphere(t); const P = shot(t, 'rob', { box: [40, 700, 1000, 520], a: [0.2, 0.66, 2.0], b: [0.19, 0.6, 2.3], dur: 4.5 }); if (!P) noPhoto(t);
    tag(t, 1, 5); realBadge(t, 0.4, 'REAL SPECIMEN', 360);
    if (P) { const [x, y] = P(0.19, 0.545), r = RW(P, 0.19, 0.545, 0.035); g.save(); g.globalCompositeOperation = 'lighter'; glowDot(x, y, 90 * (t > 1.8) * (0.8 + 0.2 * Math.sin(t * 8)), '120,220,255', 0.9); g.restore();
      ring(t, 1.0, x, y, r, { spot: false }); callout(t, 1.8, [x + r, y], 640, y - 40, 'THE LURE'); }
    fact2(t, 0.6, 'GLOWING', 'BACTERIA.', null, { y: 470, size: 110 }); }; };
VIS[2] = (K) => { K(0.5, 'whoosh', 0.6); K(0.9, 'pop', 0.7); K(2.0, 'hit', 1.3); K(2.05, 'crack', 0.7);
  return (t) => { const after = t > 2.0, P = after ? shot(t, 'after', { a: [0.42, 0.55, 1.05], b: [0.45, 0.55, 1.15], dur: 2.5, t0: 2.0, anchor: [540, 960] })
      : shot(t, 'before', { a: [0.55, 0.52, 1.0], b: [0.6, 0.5, 1.1], dur: 2.5, anchor: [540, 960] }); if (!P) noPhoto(t);
    flash(t, 2.0, 0.5, 0.12); tag(t, 2, 5); realBadge(t, 0.4, 'MUSEUM MODEL');
    chip(after ? 'AFTER A MEAL' : 'BEFORE A MEAL', 540, 1140, t, after ? 2.0 : 0.9, { size: 40, bg: after ? RED : GOLD, fg: after ? TXT : BG });
    fact2(t, after ? 2.0 : 99, 'HEAVIER', 'THAN ITSELF.', 'ITS STOMACH STRETCHES'); }; };
VIS[3] = (K) => { K(0.5, 'whoosh', 0.6); K(1.0, 'hit', 1); K(1.5, 'tick', 0.8); K(2.3, 'tick', 0.8); K(3.0, 'pop', 0.7);
  return (t) => { const P = shot(t, 'nhm', { a: [0.5, 0.45, 1.0], b: [0.55, 0.45, 1.1], dur: 4.5, anchor: [540, 860] }); if (!P) noPhoto(t);
    tag(t, 3, 5); realBadge(t, 0.4, 'MUSEUM MODEL'); fact(t, 0.8, 'TO SCALE', null, { color: TXT, size: 130 });
    const X = 120, CM = 50; panel(60, 700, 960, 440, 0.82);       // 1 cm = 50 px
    const bar = (y, mm, col, name, tIn) => { const lt = t - tIn; if (lt < 0) return; const w = mm / 10 * CM * easeOut(lt / 0.5);
      g.fillStyle = col; rrect(X, y, Math.max(w, 6), 44, 10); g.fill(); text(name, X, y - 16, 'mono', 28, col); };
    bar(790, 153, GOLD, 'FEMALE · 15 CM', 1.5); bar(920, 28, RED, 'MALE · UNDER 3 CM', 2.3);
    const lt = t - 3.0; if (lt > 0) { const w = 14.7 * CM * easeOut(lt / 0.5); g.strokeStyle = 'rgba(255,255,255,0.7)'; g.lineWidth = 4; rrect(X, 1050, Math.max(w, 6), 50, 14); g.stroke();
      text('A PHONE · ≈15 CM', X, 1034, 'mono', 28, '#C9C1B4'); } }; };
VIS[4] = (K) => { K(0.5, 'riser', 0.5, 1); K(1.2, 'hit', 1.2); K(1.25, 'splash', 0.8); K(2.0, 'pop', 0.7);
  return (t) => { const sky = g.createLinearGradient(0, 0, 0, H); sky.addColorStop(0, '#0B3A57'); sky.addColorStop(0.5, '#0E5F86'); sky.addColorStop(1, '#06202F'); g.fillStyle = sky; g.fillRect(0, 0, W, H);
    g.save(); g.globalCompositeOperation = 'lighter'; for (let k = 0; k < 7; k++) { const x = 140 + k * 140 + Math.sin(t * 0.8 + k) * 40; const gr = g.createLinearGradient(x, 0, x + 120, H); gr.addColorStop(0, 'rgba(255,240,200,0.22)'); gr.addColorStop(1, 'rgba(255,240,200,0)');
      g.fillStyle = gr; g.beginPath(); g.moveTo(x - 30, 0); g.lineTo(x + 30, 0); g.lineTo(x + 200, H); g.lineTo(x + 60, H); g.fill(); } g.restore();
    const P = shot(t, 'rob', { box: [40, 760, 1000, 480], a: [0.45, 0.26, 1.0], b: [0.45, 0.26, 1.1], dur: 11, backdrop: false });
    tag(t, 4, 5); fact2(t, 1.2, 'FEB 5, 2025:', 'DAYLIGHT.', 'FILMED ALIVE AT THE SURFACE · TENERIFE'); if (P) chip('SAME SPECIES · NOT THE 2025 FISH', 540, 1200, t, 2.0, { size: 26, bg: 'rgba(12,11,10,0.8)', fg: TXT }); }; };
