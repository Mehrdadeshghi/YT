// Wiki Roulette #098 — Pickles, the dog who found the stolen World Cup (figures style, Football Stories #1)
const N = 6, THIEF = A(CAST.conman, { seed: 3 }), FA = A(CAST.official, { seed: 4 }), OWNER = A(CAST.man, { shirt: '#2F6B3A', hat: 'cap', hatCol: '#1F2A44', seed: 5 });
const GOLDC = '#F2C230';
// original cartoon collie (black + white), sticker look like the cast; feet at (x, y), faces right (o.flip = left)
// o: { face: happy|sniff|wow|proud, walk, medal, bow }
function dogBody(o, t) {
  const sniff = o.face === 'sniff', wag = Math.sin(t * 14) * 22, bob = Math.sin(t * 6) * 4, step = o.walk ? Math.sin(t * 12) * 18 : 0;
  const K = '#24211E', Wt = '#F6F2EA';
  limb(-128, -150, -190, -235 + wag, K, 26, -185, -160);                                   // tail
  sh(ell(-196, -238 + wag, 16, 14), Wt);                                                     // white tail tip
  [[-95, -110, -98 - step], [-62, -110, -60 + step], [78, -110, 80 + step], [110, -110, 112 - step]].forEach(([x0, y0, x1]) => {
    limb(x0, y0, x1, -14, K, 30); sh(ell(x1 + 8, -10, 24, 13), Wt); });                      // legs + white paws
  sh(ell(0, -145 + bob, 150, 72), K);                                                        // body
  sh(ell(112, -132 + bob, 46, 56), Wt);                                                      // white chest
  const hx = sniff ? 190 : 150, hy = (sniff ? -95 : -238) + bob;
  if (!SK) { g.fillStyle = '#C8102E'; g.save(); g.translate(sniff ? 160 : 128, sniff ? -120 : -186); g.rotate(sniff ? 0.9 : 0.35); g.fillRect(-34, -9, 68, 18); g.restore(); }  // collar
  if (o.medal && !SK) { const mx = sniff ? 170 : 132, my = (sniff ? -100 : -160) + bob; g.strokeStyle = INK; g.lineWidth = 4; g.beginPath(); g.moveTo(mx, my - 22); g.lineTo(mx, my); g.stroke();
    g.fillStyle = GOLDC; g.beginPath(); g.arc(mx, my + 14, 20, 0, 6.283); g.fill(); g.stroke(); g.fillStyle = '#FFF3B0'; g.beginPath(); g.arc(mx - 6, my + 8, 6, 0, 6.283); g.fill(); }
  // ears
  for (const [ex, ey, r] of [[-38, -40, -0.5], [10, -52, 0.15]]) { const p = new Path2D(); p.moveTo(hx + ex - 26, hy + ey + 26); p.lineTo(hx + ex, hy + ey - 34); p.lineTo(hx + ex + 26, hy + ey + 22); p.closePath(); sh(p, K); }
  sh(ell(hx, hy, 72, 62), K);                                                                // head
  sh(ell(hx + 8, hy - 22, 13, 36, 0.15), Wt);                                                // white blaze
  sh(ell(hx + 58, hy + 18, 48, 30), Wt);                                                     // muzzle
  if (SK) return;
  g.fillStyle = INK; g.beginPath(); g.ellipse(hx + 102, hy + 6, 15, 12, 0, 0, 6.283); g.fill();        // nose
  if (o.face === 'happy' || o.face === 'proud') { g.fillStyle = '#FF7C9C'; g.beginPath(); g.ellipse(hx + 66, hy + 50, 15, 22 + Math.sin(t * 10) * 3, 0, 0, 6.283); g.fill(); g.lineWidth = 4; g.strokeStyle = INK; g.stroke(); }
  g.strokeStyle = INK; g.lineWidth = 5; g.beginPath(); g.moveTo(hx + 40, hy + 34); g.quadraticCurveTo(hx + 66, hy + 46, hx + 92, hy + 30); g.stroke();   // mouth
  const blink = Math.sin(t * 1.7) > 0.985;
  if (sniff || blink) { g.beginPath(); g.arc(hx + 26, hy - 10, 14, 3.4, 6.0); g.stroke(); }
  else { const big = o.face === 'wow'; g.fillStyle = '#FFF'; g.beginPath(); g.ellipse(hx + 26, hy - 12, big ? 22 : 17, big ? 26 : 20, 0, 0, 6.283); g.fill(); g.stroke();
    g.fillStyle = INK; g.beginPath(); g.arc(hx + 31, hy - 10, big ? 8 : 9, 0, 6.283); g.fill(); g.fillStyle = '#FFF'; g.beginPath(); g.arc(hx + 34, hy - 14, 3, 0, 6.283); g.fill(); }
  if (sniff) { g.strokeStyle = 'rgba(255,255,255,0.85)'; g.lineWidth = 5; for (let k = 0; k < 3; k++) { const ph = (t * 2 + k / 3) % 1; g.globalAlpha = 1 - ph;
    g.beginPath(); g.arc(hx + 130 + ph * 40, hy - 10 - ph * 30, 10 + k * 6, -0.8, 0.8); g.stroke(); } g.globalAlpha = 1; }
  if (o.bow) { g.fillStyle = '#1E1E1E'; g.beginPath(); g.moveTo(118, -178 + bob); g.lineTo(92, -194 + bob); g.lineTo(92, -160 + bob); g.closePath(); g.moveTo(118, -178 + bob); g.lineTo(144, -194 + bob); g.lineTo(144, -160 + bob); g.closePath(); g.fill(); }
}
function dog(t, tIn, x, y, s, o = {}) {
  const lt = t - tIn; if (lt < 0) return; const sp = spring(lt, 260, 15), sc = s * sp;
  g.save(); g.translate(x, y); g.rotate((1 - Math.min(1, sp)) * 0.3); g.scale(sc * (o.flip ? -1 : 1), sc);
  g.save(); g.translate(12, 12); g.globalAlpha = 0.25; SK = 1; dogBody(o, t); g.restore();
  g.globalAlpha = 1; g.save(); SK = 1; dogBody(o, t); g.restore(); g.save(); SK = 0; dogBody(o, t); g.restore(); g.restore();
}
// generic golden cup (cartoon), base at (x, y)
function cupBody() {
  const p = new Path2D(); p.moveTo(-70, 0); p.lineTo(70, 0); p.lineTo(55, -40); p.lineTo(-55, -40); p.closePath(); sh(p, '#6B4A1E');      // base
  sh(rr(-22, -110, 44, 72, 10), GOLDC);                                                                                    // stem
  const b = new Path2D(); b.moveTo(-95, -250); b.lineTo(95, -250); b.quadraticCurveTo(90, -120, 0, -105); b.quadraticCurveTo(-90, -120, -95, -250); b.closePath(); sh(b, GOLDC);
  for (const sx of [-1, 1]) { const h = new Path2D(); h.moveTo(sx * 88, -225); h.bezierCurveTo(sx * 150, -230, sx * 140, -150, sx * 60, -140);
    g.lineCap = 'round'; if (SK) { g.lineWidth = 46; g.strokeStyle = '#FFF'; g.stroke(h); } else { g.lineWidth = 30; g.strokeStyle = INK; g.stroke(h); g.lineWidth = 18; g.strokeStyle = GOLDC; g.stroke(h); } }
  if (!SK) { g.fillStyle = 'rgba(255,255,255,0.55)'; g.beginPath(); g.ellipse(-45, -200, 14, 36, 0.2, 0, 6.283); g.fill(); }
}
function cup(t, tIn, x, y, s, o = {}) { const lt = t - tIn; if (lt < 0) return; const sp = spring(lt, 300, 14), sc = s * sp;
  g.save(); g.translate(x, y + Math.sin(t * 3) * 6); g.rotate((o.rot || 0) + (1 - Math.min(1, sp)) * 0.4); g.scale(sc, sc);
  g.save(); SK = 1; cupBody(); g.restore(); g.save(); SK = 0; cupBody(); g.restore(); g.restore(); }
// newspaper parcel tied with string; opens (two flaps fly off) at o.open
function parcel(t, tIn, x, y, s, o = {}) { const lt = t - tIn; if (lt < 0) return; const sp = spring(lt, 280, 15), op = o.open != null ? clamp((t - o.open) / 0.35) : 0;
  g.save(); g.translate(x, y); g.scale(s * sp, s * sp);
  if (op < 1) for (const side of [-1, 1]) { g.save(); g.translate(side * op * 160, -op * 120); g.rotate(side * op * 0.9); g.globalAlpha = 1 - op;
    const p = rr(side < 0 ? -110 : 0, -120, 110, 120, 10); SK = 1; sh(p, '#FFF'); SK = 0; sh(p, '#E9E2D2');
    g.fillStyle = 'rgba(40,36,30,0.45)'; for (let k = 0; k < 6; k++) g.fillRect((side < 0 ? -96 : 14) , -104 + k * 17, 80 * (0.6 + 0.4 * ((k * 7) % 5) / 5), 6);
    if (side < 0) { g.font = F.serif(20); g.fillStyle = INK; g.fillText('NEWS', -96, -108 + 2); }
    g.restore(); }
  if (op < 0.4) { g.strokeStyle = '#7A5A2E'; g.lineWidth = 6; g.globalAlpha = 1 - op * 2.5; g.beginPath(); g.moveTo(-110, -60); g.lineTo(110, -60); g.moveTo(0, -120); g.lineTo(0, 0); g.stroke(); g.globalAlpha = 1; }
  g.restore(); }

VIS.open = fscene(null, N, { bg: 'cup', a: [0.5, 0.42, 1.05], b: [0.5, 0.4, 1.2], dim: 0.25, hook: true, k: [[0.15, 'hit', 1.3], [0.45, 'pop', 0.8, 900]],
  x: (t) => { dog(t, -0.3, 330, 1250, 1.0, { face: 'proud' }); cup(t, -0.3, 800, 1250, 1.0); lot(t, -0.3, 'trophy', 900, 270, 200, { rot: 0.1 }); } });

VIS[0] = fscene(0, N, { bg: 'replica', a: [0.5, 0.45, 1.0], b: [0.5, 0.4, 1.15], dim: 0.3, badge: 'REAL PHOTO · REPLICA OF THE TROPHY', k: [[0.6, 'glitch', 1], [0.75, 'swish', 0.9], [0.9, 'hit', 1]],
  x: (t) => { const run = clamp((t - 0.6) / 1.4), xx = lerp(330, 760, ease(run));
    fig(t, 0.2, xx, 1120, 0.66 * FIGSCALE, A(THIEF, { face: 'evil', armR: 'up', armL: 'out', walk: t > 0.6 && t < 2.0 }));
    cup(t, 0.2, xx + 100 * 0.66 * FIGSCALE, 1120 - 480 * 0.66 * FIGSCALE, 0.55, { rot: 0.15 });
    lot(t, 0.9, 'siren', 260, 760, 170); },
  f: ['STOLEN.', 'MARCH 20, 1966 · LONDON'] });

VIS[1] = fscene(1, N, { bg: 'wembley', a: [0.5, 0.5, 1.0], b: [0.5, 0.5, 1.1], dim: 0.35, badge: 'REAL PHOTO · OLD WEMBLEY STADIUM', k: [[0.7, 'coin', 1], [0.9, 'pop', 0.8, 700]],
  figs: [[0.1, 260, 1140, 0.62, A(THIEF, { face: 'greedy', armL: 'point', item: 'money' })], [0.3, 820, 1140, 0.62, A(FA, { face: 'shock', armL: 'up', armR: 'up', flip: true })]],
  bub: [[0.7, 330, 800, '£15,000!', { tx: 280, ty: 900, size: 60 }]],
  x: (t) => { lot(t, 1.0, 'moneyfly', 560, 1000, 170); }, f: ['RANSOM:', '£15,000 IN £1 AND £5 NOTES'] });

VIS[2] = fscene(2, N, { bg: 'beulah', a: [0.5, 0.5, 1.0], b: [0.55, 0.5, 1.1], dim: 0.2, badge: 'REAL PHOTO · BEULAH HILL, LONDON', k: [[0.5, 'pop', 0.7, 600], [1.1, 'paper', 0.9], [1.3, 'pop', 0.8, 900]],
  figs: [[0.1, 200, 1140, 0.6, A(OWNER, { face: 'happy', armR: 'hold' })]],
  x: (t) => { dog(t, 0.2, 560, 1140, 0.8, { face: t > 0.9 ? 'sniff' : 'happy', walk: t < 0.9 }); parcel(t, 0.5, 860, 1135, 0.9);
    lot(t, 1.3, 'eyes', 860, 980, 150); }, f: ['PICKLES', 'A 4-YEAR-OLD COLLIE MIX'] });

VIS[3] = fscene(3, N, { bg: 'plaque', a: [0.5, 0.4, 1.0], b: [0.5, 0.42, 1.12], dim: 0.4, badge: 'REAL PHOTO · PICKLES PLAQUE, BEULAH HILL', k: [[0.45, 'paper', 1], [0.6, 'ding', 0.9], [0.62, 'hit', 1]],
  figs: [[0.1, 230, 1140, 0.6, A(OWNER, { face: 'wow', armL: 'up', armR: 'up' })]],
  x: (t) => { if (t > 0.6) flash(t, 0.6, 0.4, 0.12); dog(t, 0.1, 520, 1140, 0.75, { face: 'wow' }); parcel(t, 0.1, 820, 1135, 0.95, { open: 0.45 });
    if (t > 0.55) { cup(t, 0.55, 820, 1135, 0.95); lot(t, 0.6, 'sparkles', 820, 860, 230); } lot(t, 0.9, 'starstruck', 520, 860, 150); },
  f: ['FOUND!', 'WRAPPED IN NEWSPAPER'] });

VIS[4] = fscene(4, N, { bg: 'final', a: [0.5, 0.5, 1.0], b: [0.45, 0.5, 1.12], dim: 0.3, badge: 'REAL PHOTO · 1966 FINAL, WEMBLEY', k: [[0.6, 'hit', 1.1], [0.9, 'pop', 0.8, 800], [1.2, 'ding', 0.7]],
  x: (t) => { dog(t, 0.1, 380, 1140, 0.85, { face: 'happy', bow: true }); cup(t, 0.6, 800, 1140, 0.85); lot(t, 0.9, 'party', 820, 820, 190); lot(t, 1.2, 'trophy', 250, 860, 150); },
  f: ['ENGLAND WON.', 'PICKLES: INVITED TO THE BANQUET'] });

VIS[5] = fscene(5, N, { bg: 'collar', a: [0.5, 0.4, 1.0], b: [0.5, 0.45, 1.12], dim: 0.35, badge: "REAL PHOTO · PICKLES' COLLAR + MEDAL", k: [[0.5, 'coin', 0.8], [0.6, 'pop', 0.8, 900], [1.1, 'ding', 0.8]],
  x: (t) => { dog(t, 0.1, 400, 1140, 0.9, { face: 'proud', medal: true }); lot(t, 0.6, 'starstruck', 820, 840, 170); lot(t, 1.1, 'clap', 840, 1120, 150); },
  f: ['A MEDAL + A MOVIE', '"THE SPY WITH A COLD NOSE", 1966'] });
