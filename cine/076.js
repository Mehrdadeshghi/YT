// Wiki Roulette #076 — DEEP SEA: goblin shark (experiment E3: number hook "9.5× farther"; twin #077 oarfish opens with a question).
// Retention: frame 1 = real specimen with the jaws thrown out + the number → drawn mechanism (loaded ligaments, slingshot release)
// → the double snap no other shark does → real photo of a live one (125-million-year lineage) → payoff: aquariums, one week max → binary question.
// The jaw mechanism is a drawn ILLUSTRATION (labelled); every photo is real and labelled.
const N076 = 4, PINK076 = '#D69A98', PINKD076 = '#A86E6E', MOUTH076 = '#7A2632', SEA1_076 = '#031322', SEA2_076 = '#0A3550';

function sea076(t) { const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, SEA2_076); gr.addColorStop(1, SEA1_076); g.fillStyle = gr; g.fillRect(0, 0, W, H);
  g.save(); for (let i = 0; i < 70; i++) { const r = rng(76 + i), x = r() * 1080, y = (r() * 1920 + t * 20 * (1 + r())) % 1920; g.globalAlpha = 0.15 + r() * 0.35; g.fillStyle = '#CFE8FF'; g.beginPath(); g.arc(x + Math.sin(t + i) * 6, y, 1 + r() * 2.5, 0, 6.283); g.fill(); } g.restore(); }

// teeth along a line from (x0,y0) to (x1,y1), pointing to side dir (+1 down / -1 up)
function teeth076(x0, y0, x1, y1, n, len, dir) { g.fillStyle = '#F4EEE3';
  for (let k = 0; k < n; k++) { const u = (k + 0.5) / n, x = lerp(x0, x1, u), y = lerp(y0, y1, u), l = len * (0.6 + 0.4 * Math.sin(u * 3.1));
    g.beginPath(); g.moveTo(x - 7, y); g.lineTo(x + 7, y); g.lineTo(x + (u - 0.5) * 6, y + dir * l); g.closePath(); g.fill(); } }

// a spring (zigzag) between two points; taut = straight + glowing gold, slack = loose and grey
function spring076(x0, y0, x1, y1, taut) { const n = 12, dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy), nx = -dy / L, ny = dx / L, amp = lerp(26, 8, taut);
  g.save(); g.strokeStyle = taut > 0.5 ? GOLD : '#C8B9A0'; g.lineWidth = 7; g.lineJoin = 'round'; if (taut > 0.5) { g.shadowColor = GOLD; g.shadowBlur = 22 * taut; }
  g.beginPath(); g.moveTo(x0, y0); for (let k = 1; k < n; k++) { const u = k / n, s = (k % 2 ? 1 : -1) * amp; g.lineTo(x0 + dx * u + nx * s, y0 + dy * u + ny * s); } g.lineTo(x1, y1); g.stroke(); g.restore(); }

// side view of the head, facing left. p = how far the jaws are thrown out (0 tucked … 1 almost at the snout tip), op = mouth opening (0…1)
function head076(t, p, op, taut) {
  const bob = Math.sin(t * 1.4) * 6; g.save(); g.translate(0, bob);
  // body + head
  g.fillStyle = PINK076; g.beginPath(); g.moveTo(1120, 640); g.quadraticCurveTo(760, 620, 600, 760); g.lineTo(600, 960); g.quadraticCurveTo(800, 1120, 1120, 1180); g.closePath(); g.fill();
  // blade-like snout
  g.beginPath(); g.moveTo(640, 740); g.quadraticCurveTo(360, 780, 70, 860); g.quadraticCurveTo(60, 880, 90, 892); g.quadraticCurveTo(380, 900, 650, 950); g.closePath(); g.fill();
  g.strokeStyle = PINKD076; g.lineWidth = 4; g.stroke();
  // gills + eye
  g.strokeStyle = PINKD076; g.lineWidth = 6; for (let k = 0; k < 5; k++) { g.beginPath(); g.moveTo(930 + k * 34, 820); g.quadraticCurveTo(915 + k * 34, 900, 935 + k * 34, 990); g.stroke(); }
  g.fillStyle = '#111'; g.beginPath(); g.arc(700, 800, 20, 0, 6.283); g.fill(); g.fillStyle = 'rgba(255,255,255,0.6)'; g.beginPath(); g.arc(694, 794, 6, 0, 6.283); g.fill();
  // jaws: pivot moves forward/down with p, the lower jaw swings open with op
  const jx = lerp(720, 330, p), jy = lerp(965, 1040, p), len = 300, ang = lerp(0.05, 0.75, op);
  g.fillStyle = MOUTH076; g.beginPath(); g.moveTo(jx + len * 0.55, jy - 20); g.lineTo(jx, jy); g.lineTo(jx + Math.cos(ang) * 0 , jy); g.lineTo(jx + len * 0.55 * Math.cos(ang), jy + len * 0.55 * Math.sin(ang)); g.closePath(); g.fill();
  // upper jaw (a bar along the bottom of the head) + teeth down
  g.save(); g.fillStyle = '#C98582'; g.beginPath(); g.moveTo(jx, jy); g.lineTo(jx + len, jy - 30); g.lineTo(jx + len, jy - 60); g.lineTo(jx + 10, jy - 32); g.closePath(); g.fill(); teeth076(jx + 12, jy - 2, jx + len * 0.75, jy - 22, 9, 34, 1); g.restore();
  // lower jaw, hinged at the back end of the upper jaw, rotated by ang around the front? → hinge at the back (jx+len)
  g.save(); g.translate(jx + len, jy - 30); g.rotate(-ang * 0.6); g.fillStyle = '#C98582'; g.beginPath(); g.moveTo(0, 0); g.lineTo(-len, 30 + 70 * op); g.lineTo(-len + 6, 64 + 70 * op); g.lineTo(0, 34); g.closePath(); g.fill();
  teeth076(-len + 12, 32 + 70 * op, -len * 0.25, 22 + 20 * op, 9, 34, -1); g.restore();
  // ligaments from the skull to the jaw hinge
  spring076(860, 930, jx + len, jy - 40, taut); spring076(880, 980, jx + len, jy - 10, taut);
  g.restore();
  return [jx + len, jy - 30 + bob, jx, jy + bob];
}
const ill076 = () => text('ILLUSTRATION', 1000, 1590, 'mono', 22, 'rgba(255,255,255,0.55)', { ls: 3, align: 'right' });

// ---------- scenes ----------
VIS.open = (K) => { const nn = sw('nine', 1.4); K(0.15, 'hit', 1.2); K(0.2, 'mute', 1, 0.4); K(nn, 'boom', 1.1); K(nn + 0.02, 'hit', 1.1);
  return (t) => { atmosphere(t); const P = shot(t, 'jaws', { a: [0.62, 0.6, 1.15], b: [0.62, 0.62, 1.32], dur: 3, anchor: [540, 1130] });
    if (!P) noPhoto(t); tag(t); hook(t, EP.hook, 440); realBadge(t, 0.3, 'REAL PHOTO · MUSEUM SPECIMEN', 700);
    if (P && t > nn) { const [x, y] = P(0.66, 0.66); ring(t, nn, x, y, 260, { spot: false }); stampText('9.5×', 540, 1460, t, nn + 0.1, { size: 170, rot: -0.05, color: GOLD }); } }; };

VIS[0] = S(() => { const sl = sw('slingshot', 1.0), ca = sw('catapult', 2.4), tip = sw('tip', 3.4);
  return (K) => { ks(K, [[0.1, 'whoosh', 0.8], [sl, 'swish', 0.8], [ca, 'whoosh', 1.1], [ca + 0.15, 'hit', 1.2], [tip, 'ding', 0.9]]);
    return (t) => { sea076(t); const lt = t - ca, p = lt < 0 ? 0 : clamp(1 - Math.exp(-lt * 9) * Math.cos(lt * 14)), taut = lt < 0 ? clamp(t / 0.8) : clamp(1 - lt * 4);
      const [hx, hy, fx, fy] = head076(t, p, lt < 0 ? 0.1 : clamp(lt * 3), taut); tag(t, 0, N076);
      fact2(t, 0.3, 'LOADED', 'LIKE A SLINGSHOT', null, { y: 480, size: 110 });
      if (t > sl && t < ca) callout(t, sl, [945, 945], 760, 1300, 'ELASTIC LIGAMENTS', { bg: GOLD });
      if (t > ca) { shock(fx, fy, t, ca, 300, GOLD); chip('JAWS THROWN FORWARD', 540, 1300, t, ca + 0.1, { size: 40, bg: RED, fg: '#FFF' }); }
      if (t > tip) chip('ALMOST TO THE SNOUT TIP', 540, 1390, t, tip, { size: 34, bg: GOLD, fg: BG });
      ill076(); }; }; });

VIS[1] = S(() => { const s1 = 0.35, op = sw('opens', 1.6), s2 = sw('second', 2.4);
  return (K) => { ks(K, [[s1, 'hit', 1.1], [op, 'swish', 0.8], [s2, 'hit', 1.3], [s2 + 0.05, 'crack', 0.8]]);
    return (t) => { sea076(t);
      const o = t < s1 ? 1 - clamp(t / s1) : t < op ? 0 : t < s2 - 0.25 ? clamp((t - op) / 0.3) : t < s2 ? 1 - clamp((t - s2 + 0.25) / 0.25) : 0;
      const [, , fx, fy] = head076(t, 1, o, 0); tag(t, 1, N076);
      fact2(t, 0.2, 'SNAP… OPEN…', 'SNAP AGAIN', null, { y: 480, size: 110 });
      if (t > s1) chip('SNAP 1', 230, 1240, t, s1, { size: 40, bg: '#FFFFFF', fg: BG });
      if (t > s2) { chip('SNAP 2', 470, 1240, t, s2, { size: 40, bg: RED, fg: '#FFF' }); shock(fx, fy, t, s2, 260, RED); chip('NO OTHER SHARK DOES THIS', 540, 1340, t, s2 + 0.25, { size: 34, bg: GOLD, fg: BG }); }
      ill076(); }; }; });

VIS[2] = S(() => { const hu = sw('hundred', 1.6), pk = sw('pink', 0.6);
  return vscene(2, N076, { ph: 'live', o: { box: [30, 820, 1020, 640] }, a: [0.3, 0.68, 1.0], b: [0.22, 0.72, 1.35], badge: 'REAL PHOTO · LIVE GOBLIN SHARK',
    f2: ['125 MILLION', 'YEARS', 'LAST OF ITS FAMILY', hu, { y: 580 }], k: [[pk, 'ding', 0.9], [hu, 'hit', 1.1]],
    x: (t, P) => { if (P && t > pk) { const [x, y] = P(0.17, 0.72); ring(t, pk, x, y, 110, { spot: false }); } } }); });

VIS[3] = S(() => { const wk = sw('week', 1.8);
  return vscene(3, N076, { ph: 'front', a: [0.55, 0.62, 1.0], b: [0.55, 0.7, 1.15], badge: 'REAL PHOTO · PRESERVED SPECIMEN',
    f2: ['IN AN AQUARIUM:', 'ONE WEEK. MAX.', null, wk, { y: 580 }], k: [[wk, 'hit', 1.1]],
    x: (t, P) => { if (P && t > wk) { const [x, y] = P(0.55, 0.72); ring(t, wk, x, y, 220, { color: RED }); } } }); });
