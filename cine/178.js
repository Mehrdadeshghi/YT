// Wiki Roulette #178 — OCEAN: leafy seadragon (Phycodurus eques). Frame 1 = a real photo of "seaweed" + "this is not seaweed" →
// the reveal on a clear real photo: a fish, cousin of the seahorse, the leaves are skin, camouflage only → real footage: almost invisible fins,
// it drifts like seaweed → drawn dad's tail filling with up to 250 pink eggs (illustration) → 9 weeks, 100 dots, only ~5 survive (graphic) → question.
const N178 = 4, PINK178 = '#FF7FB0', KELP178 = '#C9D86A';

const lab178 = (str, y = 1590) => text(str, 1000, y, 'mono', 22, 'rgba(255,255,255,0.55)', { ls: 3, align: 'right' });
function shade178(y0, y1, a) { const gr = g.createLinearGradient(0, y0, 0, y1); gr.addColorStop(0, `rgba(0,0,0,${a})`); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(0, y0, W, y1 - y0); }
// dad's curled tail (drawn), eggs appear along its underside: n = eggs shown (0 … 250)
function tail178(t, n) { g.save(); g.lineCap = 'round';
  const pts = []; for (let k = 0; k <= 80; k++) { const s = k / 80, a = Math.PI * 1.05 - s * Math.PI * 2.3, r = 380 * (1 - 0.72 * s);
    pts.push([600 + Math.cos(a) * r, 1060 - Math.sin(a) * r * 0.8 + Math.sin(t * 1.2 + s * 3) * 5]); }
  for (let k = 0; k < pts.length - 1; k++) { const s = k / 80; g.strokeStyle = KELP178; g.lineWidth = 64 * (1 - s * 0.8); g.beginPath(); g.moveTo(...pts[k]); g.lineTo(...pts[k + 1]); g.stroke(); }
  g.strokeStyle = 'rgba(120,90,30,0.55)'; g.lineWidth = 4; for (let k = 2; k < 50; k += 3) { const [x, y] = pts[k], [x2, y2] = pts[k + 1], nx = -(y2 - y), ny = x2 - x, L = Math.hypot(nx, ny), w = 28 * (1 - k / 100);
    g.beginPath(); g.moveTo(x - nx / L * w, y - ny / L * w); g.lineTo(x + nx / L * w, y + ny / L * w); g.stroke(); }
  for (let k = 0; k < 6; k++) { const [x, y] = pts[3 + k * 8]; g.fillStyle = 'rgba(201,216,106,0.8)'; g.beginPath(); g.ellipse(x, y - 80, 22, 58, -0.4 + Math.sin(t + k) * 0.1, 0, 6.283); g.fill(); }
  const eg = rng(178); for (let i = 0; i < n; i++) { const s = 0.04 + 0.5 * eg(), k = Math.floor(s * 80), [x, y] = pts[k], [x2, y2] = pts[k + 1], nx = -(y2 - y), ny = x2 - x, L = Math.hypot(nx, ny), d = 26 * (1 - s * 0.8) + 8 + eg() * 22;
    g.fillStyle = PINK178; g.shadowColor = PINK178; g.shadowBlur = 8; g.beginPath(); g.arc(x - nx / L * d + (eg() - 0.5) * 10, y - ny / L * d + (eg() - 0.5) * 10, 6 + eg() * 3, 0, 6.283); g.fill(); }
  g.restore(); }
// 100 eggs as dots: after tIn all but 5 fade out
function dots178(t, tIn, x0, y0) { for (let i = 0; i < 100; i++) { const c = i % 10, r = Math.floor(i / 10), keep = [7, 23, 48, 66, 91].includes(i), f = keep ? 1 : 1 - 0.85 * clamp((t - tIn - i * 0.004) / 0.5);
  g.save(); g.globalAlpha = f; g.fillStyle = keep && t > tIn ? PINK178 : '#E9D9E0'; if (keep && t > tIn) { g.shadowColor = PINK178; g.shadowBlur = 24; }
  g.beginPath(); g.arc(x0 + c * 70, y0 + r * 46, keep && t > tIn ? 20 : 15, 0, 6.283); g.fill(); g.restore(); } }

// ---------- scenes ----------
VIS.open = (K) => { const ag = sw('again', 1.4); K(0.15, 'hit', 1.2); K(0.2, 'mute', 1, 0.4); K(ag, 'sonar', 0.9);
  return (t) => { atmosphere(t); shot(t, 'hide', { a: [0.5, 0.5, 1.0], b: [0.55, 0.5, 1.08], dur: 3, anchor: [540, 1000] });
    shade178(0, 760, 0.85); tag(t); hook(t, EP.hook, 440);
    if (t > ag) chip('🔍 LOOK AGAIN', 540, 1420, t, ag, { size: 40, bg: GOLD, fg: BG });
    realBadge(t, 0.3, 'REAL PHOTO · LEAFY SEADRAGON', 1500); }; };

VIS[0] = S(() => { const fi = sw('fish', 0.3), se = sw('seahorse', 1.8), sk = sw('skin', 3.2), ca = sw('camouflage', 4.2);
  return vscene(0, N178, { ph: 'leafy', o: { box: [40, 720, 1000, 720] }, a: [0.45, 0.5, 1.0], b: [0.45, 0.5, 1.1], dur: 5, badge: 'REAL PHOTO · KANGAROO ISLAND, AUSTRALIA',
    f2: ['A FISH.', 'LEAFY SEADRAGON', null, fi, { y: 520, size: 100 }], k: [[fi, 'hit', 1.1], [se, 'pop', 0.8], [sk, 'boom', 0.9], [ca, 'ding', 0.9]],
    x: (t, P) => { if (!P) return; if (t > se && t < ca) chip('🐴 COUSIN OF THE SEAHORSE', 540, 1390, t, se, { size: 38, bg: GOLD, fg: BG });
      if (t > sk) callout(t, sk, P(0.52, 0.18), 560, 800, 'LEAVES = SKIN', { bg: KELP178 });
      if (t > ca) chip('CAMOUFLAGE ONLY', 540, 1390, t, ca, { size: 38, bg: RED, fg: '#FFF' }); } }); });

VIS[1] = S(() => { const ti = sw('tiny', 0.3), se = sw('see', 1.4), dr = sw('drifts', 3.0);
  return (K) => { ks(K, [[0.1, 'whoosh', 0.8], [se, 'ding', 1], [dr, 'swish', 0.9]]);
    return (t) => { atmosphere(t); clip(t, 'swim', { box: [40, 720, 1000, 720], a: [0.5, 0.5, 1.25], b: [0.52, 0.5, 1.35], dur: 5 });
      tag(t, 1, N178); footBadge(t, 0.3, 'REAL FOOTAGE · LONG BEACH, CALIFORNIA', 360);
      fact2(t, ti, 'FINS ALMOST', 'INVISIBLE', null, { y: 520, size: 100 });
      if (t > dr) chip('🌿 DRIFTS LIKE SEAWEED', 540, 1390, t, dr, { size: 40, bg: KELP178, fg: BG }); }; }; });

VIS[2] = S(() => { const da = sw('dads', 0.3), tw = sw('two', 2.0), pi = sw('pink', 3.0), ta = sw('tail', 4.0);
  return (K) => { ks(K, [[0.1, 'whoosh', 0.8], [da, 'hit', 1], [tw, 'pop', 0.8], [ta, 'ding', 1]]);
    return (t) => { noPhoto(t); tag(t, 2, N178);
      fact2(t, da, 'DAD CARRIES', 'THE EGGS', null, { y: 520, size: 100, c2: PINK178 });
      const n = Math.round(250 * easeOut((t - tw) / 2.2)); tail178(t, t > tw ? n : 0);
      if (t > tw) text(`${n} EGGS`, 540, 1330, 'disp', 90, PINK178, { align: 'center' });
      if (t > ta) chip('ON DAD\'S TAIL', 540, 1420, t, ta, { size: 38, bg: PINK178, fg: BG });
      lab178('ILLUSTRATION'); }; }; });

VIS[3] = S(() => { const ni = sw('nine', 0.3), fv = sw('five', 2.4);
  return vscene(3, N178, { ph: 'reef', o: { box: [40, 720, 1000, 720] }, a: [0.5, 0.5, 1.0], b: [0.52, 0.5, 1.1], dur: 5, badge: 'REAL PHOTO · LEAFY SEADRAGON',
    f2: ['9 WEEKS', 'TO HATCH', null, ni, { y: 520, size: 100 }], k: [[ni, 'hit', 1], [fv, 'boom', 1]],
    x: (t, P) => { if (t < fv - 0.6) return; g.save(); g.globalAlpha = clamp((t - fv + 0.6) / 0.4); g.fillStyle = 'rgba(6,10,14,0.82)'; rrect(40, 720, 1000, 720, 30); g.fill(); g.restore();
      dots178(t, fv, 225, 820); if (t > fv) text('ONLY ~5 % SURVIVE', 540, 1340, 'disp', 70, PINK178, { align: 'center' }); lab178('GRAPHIC', 1420); } }); });
