// Wiki Roulette #163 — HOW IT WORKS #12: why your phone dies in the cold. Real photo opener (phone in snow) + motion graphics (tech.js kit).
// Retention: frame-1 contradiction (40 % → dead) → not broken, cold: thermometer falls, resistance gauge climbs →
// app opens, voltage sags under the shutdown line → screen goes black → twist 1: temporary, warm it up and the bar refills →
// twist 2: never charge below freezing (lithium grows on the anode until it shorts) → binary question.
const N163 = 4, C163I = '#8FD8FF', C163W = '#FF9A3D', C163R = '#FF3B30', C163OK = '#7FE3A0';
const SNOW163 = (() => { const r = rng(163), s = []; for (let i = 0; i < 70; i++) s.push([r() * 1080, r() * 1920, 1.5 + r() * 3, 0.3 + r() * 0.6]); return s; })();
const gfx163 = () => text('GRAPHIC', 1000, 1345, 'mono', 22, 'rgba(255,255,255,0.55)', { ls: 3, align: 'right' });

function snow163(t, a = 1) { g.save(); SNOW163.forEach(([x, y, r, al]) => { g.globalAlpha = al * a * 0.7; g.fillStyle = '#FFFFFF'; g.beginPath(); g.arc(x + Math.sin(t * 0.8 + y) * 14, (y + t * 60 * r) % 1920, r, 0, 6.283); g.fill(); }); g.restore(); }
// cold → warm background (w = 0 cold blue, 1 warm)
function bg163(t, w = 0) { const mix = (a, b) => `rgb(${a.map((v, i) => Math.round(lerp(v, b[i], w))).join(',')})`;
  techBg(t, mix([5, 16, 30], [30, 12, 6]), mix([11, 42, 70], [90, 40, 14])); }
// horizontal battery icon, lvl 0..1
function batt163(x, y, s, lvl, col, pct) { g.save(); g.translate(x, y); g.scale(s, s); g.lineWidth = 9; g.strokeStyle = '#FFFFFF'; rrect(-120, -55, 230, 110, 20); g.stroke();
  g.fillStyle = '#FFFFFF'; rrect(116, -22, 16, 44, 4); g.fill(); if (lvl > 0.005) { g.fillStyle = col; g.shadowColor = col; g.shadowBlur = 24; rrect(-106, -41, 202 * clamp(lvl), 82, 10); g.fill(); }
  g.restore(); if (pct != null) text(pct, x, y + 120 * s, 'disp', 64 * s, col, { align: 'center', shadow: true }); }
// thermometer with a °F scale; temp in °F
function thermo163(x, y0, y1, temp, t) { const f2y = (f) => lerp(y1, y0, (f + 10) / 110), col = temp < 32 ? C163I : C163W;
  g.save(); g.fillStyle = 'rgba(255,255,255,0.12)'; rrect(x - 26, y0 - 20, 52, y1 - y0 + 40, 26); g.fill(); g.strokeStyle = 'rgba(255,255,255,0.5)'; g.lineWidth = 4; g.stroke();
  for (const f of [0, 32, 50, 72, 95]) { const yy = f2y(f); g.fillStyle = 'rgba(255,255,255,0.6)'; g.fillRect(x + 30, yy - 2, 22, 4); text(`${f}°F`, x + 62, yy + 10, 'mono', 26, f === 32 ? C163I : 'rgba(255,255,255,0.75)'); }
  g.fillStyle = col; g.shadowColor = col; g.shadowBlur = 22; rrect(x - 13, f2y(temp), 26, y1 - f2y(temp) + 10, 13); g.fill(); g.beginPath(); g.arc(x, y1 + 40, 46, 0, 6.283); g.fill(); g.restore(); }
// semicircle gauge, v 0..1
function gauge163(x, y, r, v, lab) { g.save(); g.lineCap = 'round'; g.lineWidth = 26; g.strokeStyle = 'rgba(255,255,255,0.14)'; g.beginPath(); g.arc(x, y, r, Math.PI, 0); g.stroke();
  const gr = g.createLinearGradient(x - r, 0, x + r, 0); gr.addColorStop(0, C163OK); gr.addColorStop(0.55, GOLD); gr.addColorStop(1, C163R); g.strokeStyle = gr; g.beginPath(); g.arc(x, y, r, Math.PI, Math.PI + Math.PI * clamp(v)); g.stroke();
  const a = Math.PI + Math.PI * clamp(v); g.strokeStyle = '#FFFFFF'; g.lineWidth = 8; g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a) * (r - 30), y + Math.sin(a) * (r - 30)); g.stroke();
  glowDot(x, y, 14, '#FFFFFF'); g.restore(); text(lab, x, y + 70, 'mono', 30, TXT, { ls: 3, align: 'center' }); }

// ---------- scenes ----------
VIS.open = (K) => { const dd = sw('died', 1.5); K(0.15, 'hit', 1.3); K(0.2, 'mute', 1, 0.4); K(dd, 'crack', 1.1); K(dd + 0.02, 'boom', 1);
  return (t) => { atmosphere(t); const P = shot(t, 'snow', { a: [0.5, 0.5, 1.0], b: [0.5, 0.53, 1.1], dur: 2.5, anchor: [540, 1000] }); if (!P) noPhoto(t);
    snow163(t, 0.6); tag(t); hook(t, EP.hook, 470);
    const dead = t > dd, lv = dead ? lerp(0.4, 0, clamp((t - dd) / 0.25)) : 0.4, sx = shake(t, dd, 14);
    g.save(); g.translate(sx, 0); panel(300, 1050, 480, 300, 0.78); batt163(540, 1160, 1.15, lv, dead ? C163R : GOLD, dead ? '0 %' : '40 %'); g.restore();
    flash(t, dd, 0.3, 0.12); realBadge(t, 0.3, 'REAL PHOTO · PHONE IN SNOW', 1500); }; };

VIS[0] = S(() => { const cd = sw('cold', 1.4), rs = sw('resistance', 2.6), up = sw('up', 3.2);
  return (K) => { ks(K, [[0.1, 'whoosh', 0.8], [cd, 'swish', 0.9], [rs, 'riser', 0.6], [up, 'hit', 1.1]]);
    return (t) => { bg163(t, 0); snow163(t, 0.5); tag(t, 0, N163);
      fact2(t, 0.3, 'NOT BROKEN.', 'JUST COLD.', null, { y: 430, c2: C163I });
      const temp = lerp(72, 14, ease(clamp((t - cd + 0.2) / 1.2))); thermo163(200, 760, 1300, temp, t);
      if (t > cd + 0.8) chip(`${Math.round(temp)}°F`, 200, 1430, t, cd + 0.8, { size: 34, bg: C163I, fg: BG });
      gauge163(680, 1080, 230, lerp(0.15, 0.92, ease(clamp((t - rs) / 0.9))), 'RESISTANCE');
      if (t > up) stampText('↑ UP', 680, 1280, t, up, { size: 90, rot: -0.06, color: C163R });
      gfx163(t); }; }; });

VIS[1] = S(() => { const ap = sw('app', 0.8), vd = sw('drops', 1.6), sd = sw('shuts', 2.6);
  return (K) => { ks(K, [[ap, 'pop', 0.9], [vd, 'whoosh', 0.9], [sd, 'crack', 1.1], [sd + 0.02, 'boom', 1]]);
    return (t) => { bg163(t, 0); tag(t, 1, N163); const off = t > sd;
      fact2(t, 0.3, 'VOLTAGE', 'DROPS.', null, { y: 430, c2: C163R });
      // phone (left)
      phoneFrame(300, 1080, 0.8, () => { if (off) { g.fillStyle = '#000'; g.fillRect(-200, -400, 400, 800); batt163(0, 0, 0.6, 0, C163R); return; }
        const sg = g.createLinearGradient(0, -380, 0, 380); sg.addColorStop(0, '#1B3F7A'); sg.addColorStop(1, '#3A1B6A'); g.fillStyle = sg; g.fillRect(-200, -400, 400, 800);
        for (let i = 0; i < 12; i++) { g.fillStyle = PK[i % PK.length]; g.globalAlpha = 0.85; rrect(-150 + (i % 3) * 110, -280 + Math.floor(i / 3) * 120, 80, 80, 20); g.fill(); } g.globalAlpha = 1;
        if (t > ap) { const p = ease(clamp((t - ap) / 0.35)); g.fillStyle = '#F4EEE3'; rrect(lerp(-40, -188, p), lerp(-160, -378, p), lerp(80, 376, p), lerp(80, 756, p), lerp(20, 42, p)); g.fill(); } });
      if (off) stampText('SHUTDOWN', 300, 1080, t, sd, { size: 70, rot: -0.12, color: C163R });
      // voltage chart (right)
      panel(560, 760, 470, 600, 0.8); text('VOLTAGE', 590, 815, 'mono', 26, TXT, { ls: 3 });
      const yL = 1150, cy = (v) => lerp(1320, 860, v); g.save(); g.setLineDash([14, 10]); g.strokeStyle = C163R; g.lineWidth = 4; g.beginPath(); g.moveTo(590, yL); g.lineTo(1000, yL); g.stroke(); g.restore();
      text('SHUTDOWN LIMIT', 1000, yL + 40, 'mono', 22, C163R, { ls: 2, align: 'right' });
      const pts = []; const span = clamp(t / Math.max(sd + 0.2, 0.1)); for (let j = 0; j <= 60 * span; j++) { const u = j / 60, tt = u * (sd + 0.2);
        let v = 0.72 - 0.04 * Math.sin(tt * 7) * 0.3; if (tt > ap) v -= 0.22 * ease(clamp((tt - ap) / 0.4)); if (tt > vd) v -= 0.25 * ease(clamp((tt - vd) / 0.5)); pts.push([600 + u * 400, cy(v)]); }
      if (pts.length > 1) { glowLine(pts, off ? C163R : C163I, 6); const [hx, hy] = pts.at(-1); glowDot(hx, hy, 10, '#FFFFFF'); }
      if (t > vd + 0.4) shock(1000, cy(0.25), t, vd + 0.4, 120, C163R, 0.5);
      gfx163(t); }; }; });

VIS[2] = S(() => { const tm = sw('temporary', 1.0), wm = sw('warm', 1.8), bk = sw('back', 2.8);
  return (K) => { ks(K, [[tm, 'ding', 1], [wm, 'riser', 0.6], [bk, 'hit', 1]]);
    return (t) => { const w = ease(clamp((t - wm) / 1.2)); bg163(t, w); snow163(t, 1 - w); tag(t, 2, N163);
      fact2(t, tm, "IT'S ONLY", 'TEMPORARY.', null, { y: 430, c2: C163OK, size: 130 });
      thermo163(200, 760, 1300, lerp(14, 72, w), t);
      const lv = 0.4 * ease(clamp((t - wm - 0.2) / 1.0)); panel(390, 920, 600, 380, 0.75);
      batt163(690, 1060, 1.4, lv, lv > 0.3 ? C163OK : GOLD, `${Math.round(lv * 100)} %`);
      if (t > bk) chip('IT COMES BACK ✓', 690, 1400, t, bk, { size: 36, bg: C163OK, fg: BG });
      gfx163(t); }; }; });

// lithium plating: dendrites grow from the anode toward the separator, then a spark (illustration, not to scale)
const DEND163 = (() => { const r = rng(1630), d = []; for (let i = 0; i < 9; i++) { const y = 875 + i * 44 + r() * 16, segs = []; let x = 0, yy = 0; for (let k = 0; k < 8; k++) { x += 18 + r() * 12; yy += (r() - 0.5) * 22; segs.push([x, yy]); } d.push([y, segs]); } return d; })();
VIS[3] = S(() => { const bl = sw('freezing', 1.6), pl = sw('plates', 2.8), sh = sw('short', 3.8);
  return (K) => { ks(K, [[0.1, 'whoosh', 0.8], [bl, 'hit', 1.1], [pl, 'riser', 0.5], [sh, 'crack', 1.1], [sh + 0.02, 'boom', 0.9]]);
    return (t) => { bg163(t, 0); snow163(t, 0.4); tag(t, 3, N163);
      fact2(t, 0.3, "DON'T CHARGE", 'BELOW 32°F', '(0 °C)', { y: 400, c2: C163I });
      panel(60, 790, 960, 520, 0.82); const ax = 160, sx = 560, cx = 920;
      g.fillStyle = '#6E7480'; rrect(ax - 40, 850, 80, 400, 12); g.fill(); text('ANODE', ax, 1290, 'mono', 24, TXT, { ls: 3, align: 'center' });
      g.fillStyle = '#C97A4A'; rrect(cx - 40, 850, 80, 400, 12); g.fill(); text('CATHODE', cx, 1290, 'mono', 24, TXT, { ls: 3, align: 'center' });
      g.save(); g.setLineDash([12, 10]); g.strokeStyle = 'rgba(255,255,255,0.6)'; g.lineWidth = 4; g.beginPath(); g.moveTo(sx, 840); g.lineTo(sx, 1255); g.stroke(); g.restore();
      text('SEPARATOR', sx, 828, 'mono', 22, 'rgba(255,255,255,0.75)', { ls: 2, align: 'center' });
      const gp = clamp((t - pl) / Math.max(0.3, sh - pl)), reach = (sx - ax - 40) / 220;
      DEND163.forEach(([y, segs]) => { const n = Math.floor(segs.length * gp); if (n < 1) return; const pts = [[ax + 40, y], ...segs.slice(0, n).map(([x, yy]) => [ax + 40 + x * reach * 1.0, y + yy])]; glowLine(pts, '#D8E2EE', 5); });
      if (t > pl) chip('LITHIUM METAL', 360, 1215, t, pl + 0.2, { size: 28, bg: '#D8E2EE', fg: BG });
      if (t > sh) { const k = Math.floor(t * 20) % 2; glowDot(sx, 1040, 26 + 10 * k, GOLD); shock(sx, 1040, t, sh, 200, GOLD, 0.6); chip('SHORT CIRCUIT', sx, 960, t, sh + 0.1, { size: 32, bg: C163R, fg: '#FFF' }); }
      flash(t, sh, 0.35, 0.12); gfx163(t); }; }; });
