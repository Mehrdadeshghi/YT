// Wiki Roulette #160 — OCEAN: mantis shrimp. Frame 1 = real footage of a peacock mantis shrimp + "ONE PUNCH. TWO HITS." →
// real photo: its club, speed dial to 51 mph → drawn strike: HIT 1, vapor bubbles, they collapse → HIT 2 (illustration) →
// a miss still stuns the fish, the bubbles flash with light (illustration) → real photo of its eyes: 16 receptor types vs your 4 → binary question.
const N160 = 4, SEA160 = ['#062238', '#020A14'], BUB160 = '#BFF4FF', SHELL160 = '#E8C79A', CLUB160 = '#F08A4B';
const SNOW160 = (() => { const r = rng(160), s = []; for (let i = 0; i < 70; i++) s.push([r() * 1080, r() * 1920, 1 + r() * 2.5, 0.2 + r() * 0.6]); return s; })();
const BUBS160 = (() => { const r = rng(1160), s = []; for (let i = 0; i < 26; i++) s.push([(r() - 0.5) * 120, (r() - 0.5) * 220, 6 + r() * 16, r()]); return s; })();

function sea160(t) { const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, SEA160[0]); gr.addColorStop(1, SEA160[1]); g.fillStyle = gr; g.fillRect(0, 0, W, H);
  g.save(); SNOW160.forEach(([x, y, r, a]) => { g.globalAlpha = a * 0.4; g.fillStyle = '#CFE8FF'; g.beginPath(); g.arc(x + Math.sin(t * 0.3 + y) * 8, (y + t * 12 * r) % 1920, r, 0, 6.283); g.fill(); }); g.restore();
  g.fillStyle = '#1A2630'; g.beginPath(); g.moveTo(0, 1330); g.quadraticCurveTo(540, 1290, 1080, 1340); g.lineTo(1080, 1920); g.lineTo(0, 1920); g.fill(); }
const ill160 = (t, y = 1440) => text('ILLUSTRATION', 1000, y, 'mono', 22, 'rgba(255,255,255,0.55)', { ls: 3, align: 'right' });

// the drawn club arm, pivoting at (px,py); ang 0 = folded up, 1 = fully struck out to the right
function arm160(px, py, ang) { const a = lerp(-1.9, 0, ang); g.save(); g.translate(px, py);
  g.fillStyle = '#3FAE7A'; g.beginPath(); g.ellipse(-120, 40, 150, 90, 0.2, 0, 6.283); g.fill();                      // body hint
  g.strokeStyle = '#3FAE7A'; g.lineWidth = 14; for (const dx of [-30, 10]) { g.beginPath(); g.moveTo(dx - 40, -30); g.lineTo(dx - 20, -110); g.stroke(); g.fillStyle = '#E9A7C9'; g.beginPath(); g.ellipse(dx - 20, -125, 22, 28, 0, 0, 6.283); g.fill(); g.fillStyle = '#222'; g.fillRect(dx - 36, -128, 32, 6); }
  g.rotate(a); g.strokeStyle = '#2E8F63'; g.lineWidth = 46; g.lineCap = 'round'; g.beginPath(); g.moveTo(0, 0); g.lineTo(190, 0); g.stroke();
  g.translate(190, 0); g.rotate(-a * 0.5); g.fillStyle = CLUB160; g.beginPath(); g.ellipse(70, 0, 80, 46, 0, 0, 6.283); g.fill();
  g.fillStyle = 'rgba(255,255,255,0.25)'; g.beginPath(); g.ellipse(60, -14, 44, 14, 0, 0, 6.283); g.fill(); g.restore(); }
// the snail shell target (right)
function shell160(x, y, cracked) { g.save(); g.translate(x, y); g.fillStyle = SHELL160; g.beginPath(); g.arc(0, 0, 90, 0, 6.283); g.fill();
  g.strokeStyle = '#9C7A50'; g.lineWidth = 7; g.beginPath(); for (let k = 0; k < 60; k++) { const a = k * 0.25, r = 80 - k * 1.25; g.lineTo(Math.cos(a) * r, Math.sin(a) * r); } g.stroke();
  if (cracked > 0) { g.strokeStyle = '#1A0E05'; g.lineWidth = 6; g.globalAlpha = clamp(cracked); for (const [a, l] of [[2.6, 85], [3.4, 70], [2.1, 60], [4.0, 55]]) { g.beginPath(); g.moveTo(-88, 0); g.lineTo(-88 + Math.cos(a + 3.14) * l, Math.sin(a + 3.14) * l * 0.8); g.stroke(); } }
  g.restore(); }
// a small drawn fish (right), stunned = 0..1 (tilts, X eye)
function fish160(x, y, st, t) { g.save(); g.translate(x + Math.sin(t * 2) * 6 * (1 - st), y + st * 60); g.rotate(st * 2.6);
  g.fillStyle = '#FFC93E'; g.beginPath(); g.ellipse(0, 0, 90, 48, 0, 0, 6.283); g.fill(); g.beginPath(); g.moveTo(80, 0); g.lineTo(150, -45); g.lineTo(150, 45); g.fill();
  g.strokeStyle = '#111'; g.lineWidth = 6; if (st > 0.3) { g.beginPath(); g.moveTo(-60, -22); g.lineTo(-38, 0); g.moveTo(-38, -22); g.lineTo(-60, 0); g.stroke(); } else { g.fillStyle = '#111'; g.beginPath(); g.arc(-48, -10, 10, 0, 6.283); g.fill(); }
  g.restore(); }
function bubbles160(cx, cy, grow, shrink, t) { g.save(); BUBS160.forEach(([dx, dy, r, ph]) => { const rr = r * clamp(grow - ph * 0.3) * (1 - clamp(shrink)); if (rr <= 0.5) return;
  g.strokeStyle = BUB160; g.lineWidth = 3; g.globalAlpha = 0.85; g.beginPath(); g.arc(cx + dx, cy + dy + Math.sin(t * 5 + ph * 6) * 3, rr, 0, 6.283); g.stroke();
  g.globalAlpha = 0.25; g.fillStyle = BUB160; g.fill(); }); g.restore(); }
function wave160(cx, cy, t, t0, col = BUB160) { const lt = t - t0; if (lt < 0 || lt > 0.9) return; for (let k = 0; k < 3; k++) { const p = clamp((lt - k * 0.12) / 0.6); if (p <= 0) continue;
  g.save(); g.globalAlpha = 0.8 * (1 - p); g.strokeStyle = col; g.lineWidth = 8; g.beginPath(); g.arc(cx, cy, 30 + p * 330, 0, 6.283); g.stroke(); g.restore(); } }

// ---------- scenes ----------
VIS.open = (K) => { const tw = sw('twice', 1.6); K(0.15, 'hit', 1.3); K(0.2, 'mute', 1, 0.4); K(tw, 'hit', 1.1); K(tw + 0.18, 'hit', 1.1);
  return (t) => { atmosphere(t); const P = clip(t, 'swim', { box: [40, 760, 1000, 760], a: [0.36, 0.42, 1.0], b: [0.38, 0.42, 1.1], dur: 3 });
    if (!P) noPhoto(t); tag(t); hook(t, EP.hook, 440); footBadge(t, 0.2, 'REAL FOOTAGE · PEACOCK MANTIS SHRIMP', 1580);
    flash(t, tw, 0.5, 0.12); flash(t, tw + 0.18, 0.5, 0.12); }; };

VIS[0] = S(() => { const fi = sw('fifty', 1.0), st = sw('standing', 2.8);
  return vscene(0, N160, { ph: 'club', o: { box: [40, 790, 1000, 620] }, a: [0.44, 0.34, 1.0], b: [0.43, 0.36, 1.12], badge: 'REAL PHOTO · PEACOCK MANTIS SHRIMP', k: [[fi, 'whoosh', 1], [fi + 0.6, 'hit', 1.1], [st, 'pop', 0.8]],
    x: (t, P) => { if (!P) return;
      { const [x, y] = P(0.33, 0.6); ring(t, 0.35, x, y, 120, { color: GOLD, spot: false }); callout(t, 0.5, [x - 60, y + 100], 250, 1340, 'ITS CLUB', { bg: CLUB160 }); }
      // speed dial
      const cx = 540, cy = 640, R = 170, v = 51 * easeOut(clamp((t - fi) / 0.6)); panel(cx - 230, cy - 230, 460, 330, 0.75);
      g.save(); g.lineCap = 'round'; g.lineWidth = 16; g.strokeStyle = 'rgba(255,255,255,0.15)'; g.beginPath(); g.arc(cx, cy, R, Math.PI, 2 * Math.PI); g.stroke();
      g.strokeStyle = CLUB160; g.beginPath(); g.arc(cx, cy, R, Math.PI, Math.PI + Math.PI * v / 60); g.stroke();
      const a = Math.PI + Math.PI * v / 60; g.strokeStyle = TXT; g.lineWidth = 8; g.beginPath(); g.moveTo(cx, cy); g.lineTo(cx + Math.cos(a) * (R - 30), cy + Math.sin(a) * (R - 30)); g.stroke(); g.restore();
      text(`${Math.round(v)} MPH`, cx, cy + 70, 'disp', 74, v > 50 ? GOLD : TXT, { align: 'center' });
      if (t > st) chip('FROM A STANDING START', 600, 1460, t, st, { size: 40, bg: GOLD, fg: BG }); } }); });

VIS[1] = S(() => { const fa = sw('fast', 0.5), bu = sw('bubbles', 1.6), co = sw('collapse', 2.8), se = sw('second', 3.8);
  return (K) => { ks(K, [[fa - 0.05, 'whoosh', 1], [fa, 'hit', 1.2], [bu, 'bubble', 1], [co, 'pop', 1], [co + 0.05, 'boom', 1], [se, 'hit', 1]]);
    return (t) => { sea160(t); const sx = 800, sy = 1000, hitX = sx - 90;
      const sw1 = easeOut(clamp((t - fa + 0.12) / 0.12)); g.save(); g.translate(shake(t, fa, 14) + shake(t, co, 18), 0);
      shell160(sx, sy, t > co ? (t - co) * 4 : 0); arm160(260, 1040, sw1);
      bubbles160(hitX - 30, sy, (t - bu + 0.4) / 0.5, (t - co) / 0.25, t); wave160(hitX - 30, sy, t, co); g.restore();
      tag(t, 1, N160); fact2(t, 0.2, 'ONE STRIKE.', 'TWO HITS.', null, { y: 470 });
      if (t > fa) stampText('HIT 1', 420, 820, t, fa, { size: 70, rot: -0.12, color: CLUB160 });
      if (t > bu && t < co + 0.1) chip('VAPOR BUBBLES', hitX - 30, 1210, t, bu, { size: 38, bg: BUB160, fg: BG });
      if (t > co) stampText('HIT 2', 760, 820, t, co, { size: 70, rot: 0.1, color: RED });
      flash(t, co, 0.35, 0.1); ill160(t); }; }; });

VIS[2] = S(() => { const mi = sw('misses', 0.7), sh = sw('shock', 1.3), ki = sw('kill', 2.0), fl = sw('flash', 3.4);
  return (K) => { ks(K, [[mi - 0.05, 'whoosh', 1], [sh, 'boom', 1.1], [ki, 'thump', 0.9], [fl, 'ding', 1.1], [fl + 0.02, 'pop', 0.8]]);
    return (t) => { sea160(t); const fx = 820, fy = 960, bx = 640, by = 1010;
      const sw1 = easeOut(clamp((t - mi + 0.1) / 0.15)), stun = easeOut(clamp((t - sh - 0.1) / 0.5));
      g.save(); g.translate(shake(t, sh, 14), 0); fish160(fx, fy, stun, t); arm160(260, 1120, sw1 * 0.82);
      bubbles160(bx, by, (t - mi) / 0.3, (t - sh) / 0.25, t); wave160(bx, by, t, sh);
      if (t > fl) { const p = clamp((t - fl) / 1.2), r0 = rng(77); for (let k = 0; k < 9; k++) { const x = bx + (r0() - 0.5) * 260, y = by + (r0() - 0.5) * 220, ph = (t * 3 + k * 0.7) % 1;
        g.save(); g.globalAlpha = (1 - ph) * (0.6 + 0.4 * (1 - p)); g.shadowColor = '#FFF7C2'; g.shadowBlur = 60; g.fillStyle = '#FFF7C2'; g.beginPath(); g.arc(x, y, 10 + ph * 26, 0, 6.283); g.fill(); g.restore(); } }
      g.restore();
      tag(t, 2, N160); fact2(t, 0.2, 'IT MISSED.', 'STILL STUNNED.', null, { y: 470 });
      if (t > mi && t < sh + 0.1) chip('MISS', 700, 820, t, mi, { size: 44, bg: TXT, fg: BG });
      if (t > sh) chip('SHOCK WAVE', 540, 1240, t, sh, { size: 40, bg: BUB160, fg: BG });
      if (t > fl) { flash(t, fl, 0.5, 0.15, '#FFF7C2'); chip('⚡ THE BUBBLES GIVE OFF LIGHT', 540, 1240, t, fl, { size: 38, bg: GOLD, fg: BG }); }
      ill160(t); }; }; });

VIS[3] = S(() => { const si = sw('sixteen', 1.4), fo = sw('four', 3.0);
  return vscene(3, N160, { ph: 'eyes2', o: { box: [40, 390, 1000, 600] }, a: [0.5, 0.45, 1.0], b: [0.5, 0.42, 1.08], badge: 'REAL PHOTO · ITS EYES', k: [[si, 'hit', 1.1], [fo, 'thump', 0.9]],
    x: (t, P) => { if (P) { const [x1, y1] = P(0.33, 0.38), [x2, y2] = P(0.71, 0.42); ring(t, 0.4, x1, y1, 130, { spot: false }); ring(t, 0.55, x2, y2, 125, { spot: false }); }
      if (t > si) { panel(60, 1040, 460, 280); text('16', 290, 1210, 'disp', 170, GOLD, { align: 'center' }); text('MANTIS SHRIMP', 290, 1290, 'mono', 26, TXT, { align: 'center', ls: 3 }); }
      if (t > fo) { panel(560, 1040, 460, 280); text('4', 790, 1210, 'disp', 170, TXT, { align: 'center' }); text('YOU', 790, 1290, 'mono', 26, TXT, { align: 'center', ls: 3 }); }
      if (t > si) text('LIGHT RECEPTOR TYPES', 540, 1025, 'mono', 26, 'rgba(255,255,255,0.8)', { align: 'center', ls: 3 }); } }); });
