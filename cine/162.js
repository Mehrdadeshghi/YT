// Wiki Roulette #162 — DEEP SEA: Japanese spider crab. Frame 1 = real footage of a live giant (Shedd Aquarium) + "this crab is 12 feet wide" →
// drawn scale: 12-ft span vs a 6-ft person (illustration) → real archive photo: a man holding the 12.5-ft museum specimen →
// real photo, 42 lb + sponge disguise → drawn molt: it backs out of its own shell, legs last, ~100 minutes → binary question.
const N162 = 4, SHELL162 = '#E0703A', SPOT162 = '#FFE9D6', PALE162 = 'rgba(240,226,206,';

function deep162(t) { const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, '#062038'); gr.addColorStop(1, '#020812'); g.fillStyle = gr; g.fillRect(0, 0, W, H); atmosphereDust162(t); }
function atmosphereDust162(t) { g.save(); for (const d of DUST) { const y = ((d.y - t * 18 * d.z) % H + H) % H; g.globalAlpha = 0.06 + 0.14 * d.z; g.fillStyle = '#CFE8FF';
  g.beginPath(); g.arc(d.x + Math.sin(t * 0.6 + d.ph) * 10, y, 1 + 2 * d.z, 0, 6.283); g.fill(); } g.restore(); }

// top view of a spider crab (front = up). u = leg-length unit in px; legP 0..1 scales the legs (molt), col/alpha for the old shell
function crab162(cx, cy, u, t, o = {}) {
  const lp = o.legP ?? 1, col = o.col || SHELL162, a0 = o.alpha ?? 1; g.save(); g.globalAlpha *= a0; g.lineCap = 'round'; g.lineJoin = 'round';
  const leg = (sd, k) => { const a = -0.55 + k * 0.42, rx = cx + sd * u * 0.32, ry = cy - u * 0.2 + k * u * 0.17,
      wob = Math.sin(t * 1.6 + k + sd) * 0.04, L1 = u * 1.25 * lp, L2 = u * 1.45 * lp,
      kx = rx + sd * L1 * Math.cos(a + wob), ky = ry + L1 * Math.sin(a + wob) - u * 0.35 * lp,
      tx = kx + sd * L2 * Math.cos(a + 0.75 + wob), ty = ky + L2 * Math.sin(a + 0.75 + wob);
    g.strokeStyle = col; g.lineWidth = u * 0.075; g.beginPath(); g.moveTo(rx, ry); g.lineTo(kx, ky); g.stroke();
    g.lineWidth = u * 0.055; g.beginPath(); g.moveTo(kx, ky); g.lineTo(tx, ty); g.stroke();
    if (!o.flat) { g.fillStyle = SPOT162; for (const f of [0.35, 0.7]) { g.beginPath(); g.arc(lerp(rx, kx, f), lerp(ry, ky, f), u * 0.022, 0, 6.283); g.fill(); g.beginPath(); g.arc(lerp(kx, tx, f), lerp(ky, ty, f), u * 0.018, 0, 6.283); g.fill(); } }
    return [tx, ty]; };
  const tips = []; for (const sd of [-1, 1]) for (let k = 0; k < 4; k++) tips.push(leg(sd, k));
  // claws (chelipeds), forward
  for (const sd of [-1, 1]) { const rx = cx + sd * u * 0.18, ry = cy - u * 0.42, kx = rx + sd * u * 0.55 * lp, ky = ry - u * 0.7 * lp, tx = kx + sd * u * 0.25 * lp, ty = ky - u * 0.75 * lp;
    g.strokeStyle = col; g.lineWidth = u * 0.07; g.beginPath(); g.moveTo(rx, ry); g.lineTo(kx, ky); g.lineTo(tx, ty); g.stroke(); tips.push([tx, ty]); }
  // pear-shaped carapace with bumps
  g.fillStyle = col; g.beginPath(); g.moveTo(cx, cy - u * 0.55); g.bezierCurveTo(cx + u * 0.5, cy - u * 0.45, cx + u * 0.48, cy + u * 0.42, cx, cy + u * 0.45);
  g.bezierCurveTo(cx - u * 0.48, cy + u * 0.42, cx - u * 0.5, cy - u * 0.45, cx, cy - u * 0.55); g.fill();
  if (!o.flat) { g.fillStyle = 'rgba(120,40,20,0.45)'; const r = rng(162); for (let i = 0; i < 26; i++) { const x = cx + (r() - 0.5) * u * 0.6, y = cy + (r() - 0.5) * u * 0.75; g.beginPath(); g.arc(x, y, u * (0.015 + r() * 0.025), 0, 6.283); g.fill(); } }
  g.restore(); return tips;
}
// a simple person silhouette standing on (x, yFeet), h px tall
function person162(x, yF, h, a = 1) { g.save(); g.globalAlpha *= a; g.fillStyle = 'rgba(244,238,227,0.92)'; const hd = h * 0.13;
  g.beginPath(); g.arc(x, yF - h + hd / 2, hd / 2, 0, 6.283); g.fill(); rrect(x - h * 0.11, yF - h + hd * 1.05, h * 0.22, h * 0.42, h * 0.06); g.fill();
  rrect(x - h * 0.1, yF - h * 0.47, h * 0.085, h * 0.47, h * 0.03); g.fill(); rrect(x + h * 0.015, yF - h * 0.47, h * 0.085, h * 0.47, h * 0.03); g.fill();
  rrect(x - h * 0.17, yF - h + hd * 1.15, h * 0.055, h * 0.36, h * 0.03); g.fill(); rrect(x + h * 0.115, yF - h + hd * 1.15, h * 0.055, h * 0.36, h * 0.03); g.fill(); g.restore(); }
const ill162 = (t, y = 1590) => text('ILLUSTRATION', 1000, y, 'mono', 22, 'rgba(255,255,255,0.55)', { ls: 3, align: 'right' });

// ---------- scenes ----------
VIS.open = vopen({ clip: 'swim', a: [0.47, 0.5, 1.0], b: [0.47, 0.5, 1.12], foot: 'REAL FOOTAGE · LIVE CRAB, SHEDD AQUARIUM' });

VIS[0] = S(() => { const bg = sw('biggest', 1.0), ar = sw('arthropod', 2.4), cl = sw('claw', 3.6);
  return (K) => { ks(K, [[0.1, 'whoosh', 0.8], [bg, 'hit', 1], [ar, 'pop', 0.8], [cl, 'swish', 0.9]]);
    return (t) => { deep162(t); const grow = easeOut(clamp(t / 0.9));
      // seafloor
      g.fillStyle = '#132430'; g.fillRect(0, 1330, W, 400);
      const tips = crab162(500, 1010, 132 * grow + 1, t);
      person162(900, 1330, 400, clamp((t - 0.6) / 0.4));
      if (t > 0.9) chip('6 FT', 900, 1380, t, 0.9, { size: 30, bg: TXT, fg: BG });
      const xs = tips.map((p) => p[0]), x0 = Math.min(...xs), x1 = Math.max(...xs);
      ruler(t, cl - 0.2, x0, 780, x1 - x0, 'UP TO 12 FT', { size: 40 });
      tag(t, 0, N162); fact2(t, 0.3, 'BIGGEST', 'LEG SPAN', null, { y: 470, size: 120 });
      if (t > ar) chip('#1 OF ALL ARTHROPODS', 540, 1460, t, ar, { size: 38, bg: GOLD, fg: BG });
      ill162(t, 1590); }; }; });

VIS[1] = S(() => { const tw = sw('twelve', 1.6), ac = sw('across', 2.6);
  return vscene(1, N162, { ph: 'amnh', o: { box: [110, 400, 860, 887], a: [0.5, 0.5, 1.0], b: [0.5, 0.45, 1.08], dur: 4 }, badge: 'REAL PHOTO · MUSEUM SPECIMEN, NEW YORK', k: [[tw, 'hit', 1.1], [ac, 'swish', 0.8]],
    x: (t, P) => { if (!P) return; const [hx, hy] = P(0.63, 0.06); callout(t, 0.7, [hx, hy], 800, 470, 'A MAN', { bg: TXT, size: 32, align: 'center' });
      if (t > tw) { const [x0] = P(0.0, 0.5), [x1] = P(1.0, 0.5); ruler(t, tw, x0 + 10, 1410, x1 - x0 - 20, '12.5 FT ACROSS', { size: 44 }); } } }); });

VIS[2] = S(() => { const pd = sw('pounds', 1.4), sp = sw('sponges', 3.0), dg = sw('disguise', 4.4);
  return vscene(2, N162, { ph: 'sapporo', a: [0.46, 0.45, 1.0], b: [0.47, 0.42, 1.18], dur: 5, badge: 'REAL PHOTO · SUNPIAZZA AQUARIUM, JAPAN', k: [[pd, 'thump', 1], [sp, 'pop', 0.9], [dg, 'ding', 0.9]],
    x: (t, P) => { if (P) { const [x, y] = P(0.47, 0.42); ring(t, pd, x + 30, y + 185, 210, { spot: false }); }
      if (t > pd) chip('UP TO 42 LB', 540, 470, t, pd, { size: 56, bg: GOLD, fg: BG });
      if (t > sp) chip('🧽 WEARS SPONGES', 540, 1250, t, sp, { size: 40, bg: TXT, fg: BG });
      if (t > dg) chip('= CAMOUFLAGE', 540, 1350, t, dg, { size: 40, bg: '#57E38A', fg: BG }); } }); });

VIS[3] = S(() => { const cl = sw('climbs', 1.0), hu = sw('hundred', 2.8), la = sw('last', 4.6);
  return (K) => { ks(K, [[0.1, 'whoosh', 0.8], [cl, 'swish', 0.9], [hu, 'pop', 0.9], [la, 'crack', 1]]);
    return (t) => { deep162(t); g.fillStyle = '#132430'; g.fillRect(0, 1330, W, 400);
      const p = clamp((t - cl + 0.2) / (la + 0.4 - cl)), bodyP = easeOut(clamp(p / 0.55)), legP = 0.25 + 0.75 * easeOut(clamp((p - 0.55) / 0.45));
      crab162(540, 900, 150, t, { col: PALE162 + '0.55)', flat: true });                    // the old, empty shell stays behind
      crab162(540, 900 + bodyP * 300, 150, t, { legP: p < 0.55 ? 0.25 : legP, alpha: clamp(t / 0.3) });   // the new crab backs out, legs last
      tag(t, 3, N162); fact2(t, 0.3, 'IT LEAVES', 'ITS OWN SHELL', null, { y: 470, size: 110 });
      if (t > cl) chip('OLD SHELL', 300, 640, t, cl + 0.3, { size: 32, bg: PALE162 + '0.9)', fg: BG });
      if (t > hu) chip(`⏱ ${Math.round(100 * clamp((t - hu) / 1.6))} MIN`, 780, 640, t, hu, { size: 40, bg: GOLD, fg: BG });
      if (t > la) chip('LEGS COME OUT LAST', 540, 1440, t, la, { size: 38, bg: RED, fg: '#FFF' });
      ill162(t, 1300); }; }; });
