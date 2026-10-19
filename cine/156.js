// Wiki Roulette #156 — DEEP SEA: barreleye remake (experiment E1 vs #146). No free footage of a live barreleye exists
// (the famous clips are MBARI's), so the head is a drawn, clearly labelled ILLUSTRATION; the real public-domain specimen photo closes.
// Retention: frame 1 = a "face" with two eyes → "those aren't its eyes" (nostrils) → reveal the green eyes inside the clear dome →
// the eyes rotate up (prey silhouette above) then forward → payoff: 65 years before anyone saw it alive (real photo) → binary question.
const N156 = 3, DOME = 'rgba(150,220,255,', LENS = '#57E38A', DEEP1 = '#020814', DEEP2 = '#06223A';
const SNOW156 = (() => { const r = rng(156), s = []; for (let i = 0; i < 90; i++) s.push([r() * 1080, r() * 1920, 1 + r() * 2.5, 0.2 + r() * 0.6]); return s; })();

function deep156(t) { const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, DEEP2); gr.addColorStop(1, DEEP1); g.fillStyle = gr; g.fillRect(0, 0, W, H);
  g.save(); SNOW156.forEach(([x, y, r, a]) => { g.globalAlpha = a * 0.5; g.fillStyle = '#CFE8FF'; g.beginPath(); g.arc(x + Math.sin(t * 0.3 + y) * 8, (y + t * 14 * r) % 1920, r, 0, 6.283); g.fill(); }); g.restore(); }

// the barreleye, facing right; cam = [cx, cy, zoom] around the head; eyeAng: -PI/2 = looking up, 0 = forward
function fish156(t, cam, eyeAng, o = {}) {
  const [cx, cy, z] = cam; g.save(); g.translate(540, 900); g.scale(z, z); g.translate(-cx, -cy);
  // body + tail + fins
  g.fillStyle = '#16120F'; g.beginPath(); g.ellipse(470, 930, 330, 120, 0, 0, 6.283); g.fill();
  g.beginPath(); g.moveTo(160, 930); g.lineTo(40, 840 + Math.sin(t * 2) * 10); g.lineTo(70, 930); g.lineTo(40, 1020 + Math.sin(t * 2) * 10); g.closePath(); g.fill();
  g.fillStyle = 'rgba(60,45,35,0.9)'; g.beginPath(); g.ellipse(520, 1040, 120, 34, 0.35 + Math.sin(t * 1.5) * 0.08, 0, 6.283); g.fill();
  g.strokeStyle = 'rgba(120,100,80,0.35)'; g.lineWidth = 3; for (let k = 0; k < 9; k++) { g.beginPath(); g.arc(300 + k * 45, 930, 60, -1, 1); g.stroke(); }
  // face (opaque part under the dome) with the two nostrils that look like eyes
  g.fillStyle = '#2A2420'; g.beginPath(); g.moveTo(700, 840); g.quadraticCurveTo(1000, 860, 1010, 990); g.quadraticCurveTo(900, 1050, 700, 1040); g.closePath(); g.fill();
  g.fillStyle = '#050505'; for (const [nx, ny] of [[905, 935], [945, 945]]) { g.beginPath(); g.ellipse(nx, ny, 22, 16, 0.2, 0, 6.283); g.fill(); }
  g.fillStyle = 'rgba(255,255,255,0.35)'; for (const [nx, ny] of [[899, 929], [939, 939]]) { g.beginPath(); g.arc(nx, ny, 5, 0, 6.283); g.fill(); }
  g.strokeStyle = '#000'; g.lineWidth = 6; g.beginPath(); g.moveTo(985, 1000); g.quadraticCurveTo(1000, 1012, 1012, 1000); g.stroke();
  // tubular eyes inside the dome (two, slightly offset for depth)
  const da = o.domeA ?? 1;
  for (const [ox, oy, sh] of [[22, 14, 0.55], [0, 0, 1]]) { g.save(); g.translate(800 + ox, 905 + oy); g.rotate(eyeAng);
    g.globalAlpha = da; g.fillStyle = `rgba(30,40,45,${0.85 * sh})`; rrect(0, -34, 150, 68, 30); g.fill();
    g.shadowColor = LENS; g.shadowBlur = 30 * sh * (o.glow ?? 1); g.fillStyle = LENS; g.globalAlpha = da * (0.6 + 0.4 * sh); g.beginPath(); g.ellipse(150, 0, 22, 38, 0, 0, 6.283); g.fill(); g.restore(); }
  // the clear, fluid-filled dome
  g.save(); g.globalAlpha = da; const dg = g.createRadialGradient(800, 820, 40, 800, 880, 260); dg.addColorStop(0, DOME + '0.10)'); dg.addColorStop(1, DOME + '0.26)');
  g.fillStyle = dg; g.beginPath(); g.ellipse(810, 880, 240, 190, -0.08, Math.PI * 0.98, Math.PI * 2.18); g.closePath(); g.fill();
  g.strokeStyle = DOME + `${0.55 + 0.25 * (o.domeHi ?? 0)})`; g.lineWidth = 5; g.stroke();
  g.strokeStyle = 'rgba(255,255,255,0.35)'; g.lineWidth = 8; g.beginPath(); g.ellipse(790, 860, 190, 140, -0.08, Math.PI * 1.15, Math.PI * 1.45); g.stroke(); g.restore();
  g.restore();
  return (x, y) => [540 + (x - cx) * z, 900 + (y - cy) * z];   // fish coords → screen
}
const ill156 = (t) => text('ILLUSTRATION', 1000, 1590, 'mono', 22, 'rgba(255,255,255,0.55)', { ls: 3, align: 'right' });
const lerp3 = (a, b, p) => a.map((v, i) => lerp(v, b[i], p));

// ---------- scenes ----------
VIS.open = (K) => { const ns = sw('nose', 1.6); K(0.15, 'hit', 1.2); K(0.2, 'mute', 1, 0.4); K(ns, 'wrong', 1); K(ns + 0.05, 'pop', 0.8);
  return (t) => { deep156(t); const P = fish156(t, lerp3([915, 935, 2.3], [900, 930, 2.6], ease(t / 3)), -Math.PI / 2, { domeA: 0.25, glow: 0 });
    tag(t); hook(t, EP.hook, 440);
    const [x1, y1] = P(905, 935), [x2, y2] = P(945, 945); if (t > ns) { ring(t, ns, (x1 + x2) / 2, (y1 + y2) / 2, 150, { spot: false, color: RED }); chip('NOSTRILS', (x1 + x2) / 2, (y1 + y2) / 2 + 230, t, ns + 0.1, { size: 44, bg: RED, fg: '#FFF' }); }
    ill156(t); }; };

VIS[0] = S(() => { const gr = sw('green', 1.6), se = sw('see', 2.6);
  return (K) => { ks(K, [[0.1, 'whoosh', 0.8], [gr, 'ding', 1.1], [se, 'swish', 0.8]]);
    return (t) => { deep156(t); const p = ease(clamp(t / 1.2)), P = fish156(t, lerp3([900, 930, 2.6], [780, 900, 1.45], p), -Math.PI / 2, { domeA: lerp(0.25, 1, p), glow: t > gr ? 1.6 : 0.4, domeHi: t > se ? 1 : 0 });
      tag(t, 0, N156); fact2(t, 0.3, 'ITS REAL EYES', 'ARE INSIDE.', null, { y: 430 });
      if (t > gr) { const [ex, ey] = P(800, 760); callout(t, gr, [ex, ey], 300, 640, 'GREEN EYES', { bg: '#57E38A' }); }
      if (t > se) { const [dx, dy] = P(1000, 790); callout(t, se, [dx, dy], 760, 1380, 'CLEAR DOME', { bg: '#9ED8FF' }); }
      ill156(t); }; }; });

VIS[1] = S(() => { const up = sw('up', 1.2), fw = sw('forward', 2.8);
  return (K) => { ks(K, [[up, 'swish', 0.9], [fw, 'whoosh', 1], [fw + 0.4, 'hit', 0.9]]);
    return (t) => { deep156(t); const a = t < fw ? -Math.PI / 2 : lerp(-Math.PI / 2, -0.05, ease(clamp((t - fw) / 0.6)));
      const P = fish156(t, [700, 900, 1.25], a, { glow: 1.3 });
      // prey: a small glowing jelly above, later in front of the face
      const prey = t < fw ? P(830, 420 + Math.sin(t * 2) * 15) : P(lerp(830, 1150, ease(clamp((t - fw) / 0.8))), lerp(420, 880, ease(clamp((t - fw) / 0.8))));
      g.save(); g.shadowColor = '#B8F0FF'; g.shadowBlur = 30; g.fillStyle = 'rgba(184,240,255,0.85)'; g.beginPath(); g.arc(prey[0], prey[1], 28, Math.PI, 0); g.fill();
      g.strokeStyle = 'rgba(184,240,255,0.6)'; g.lineWidth = 3; for (let k = -2; k <= 2; k++) { g.beginPath(); g.moveTo(prey[0] + k * 10, prey[1]); g.lineTo(prey[0] + k * 12 + Math.sin(t * 4 + k) * 6, prey[1] + 60); g.stroke(); } g.restore();
      tag(t, 1, N156);
      if (t > up && t < fw) chip('↑ LOOKS UP: SPOTS PREY', 540, 470, t, up, { size: 42, bg: '#57E38A', fg: BG });
      if (t > fw) chip('→ TURNS FORWARD: EATS', 540, 470, t, fw, { size: 42, bg: GOLD, fg: BG });
      ill156(t); }; }; });

VIS[2] = S(() => { const sx = sw('sixty', 1.4), cr = sw('crushed', 3.6);
  return vscene(2, N156, { ph: 'fish', o: { box: [40, 760, 1000, 750] }, a: [0.3, 0.45, 1.0], b: [0.25, 0.42, 1.25], badge: 'REAL PHOTO · CAUGHT SPECIMEN, GULF OF ALASKA',
    f2: ['65 YEARS', 'BEFORE ANYONE', 'SAW IT ALIVE', sx], k: [[sx, 'hit', 1.1], [cr, 'crack', 0.9]],
    x: (t, P) => { if (P && t > cr) { const [x, y] = P(0.22, 0.42); ring(t, cr, x, y, 170, { color: RED }); chip('DOME CRUSHED IN NETS', 540, 1460, t, cr + 0.15, { size: 34, bg: RED, fg: '#FFF' }); } } }); });
