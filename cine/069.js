// Wiki Roulette #069 — Pistol shrimp / Alpheidae (fact-photo special)
// photo coords: pink = Synalpheus pinkfloydi top view (claw (0.15,0.42)) · red = Alpheus with big claw (0.8,0.55)
// claw = diagram, jet in panel 4 (0.86,0.86) · lead = shrimp in crevice, claw (0.27,0.77) · goby = goby (0.25,0.55) + shrimp (0.68,0.45)
const RW = (P, u, v, du) => Math.abs(P(u + du, v)[0] - P(u, v)[0]);
function jet(t, t0, x, y, dir = 1, n = 22) {        // a burst of bubbles shooting out of the claw
  const lt = t - t0; if (lt < 0 || lt > 1.6) return; const r = rng(69);
  for (let i = 0; i < n; i++) { const sp = 600 + r() * 900, d = lt * sp * Math.exp(-lt * 1.2), a = (r() - 0.5) * 0.35, rad = 4 + r() * 14;
    g.globalAlpha = clamp(1 - lt / 1.6) * 0.85; g.strokeStyle = '#E8F7FF'; g.lineWidth = 3; g.beginPath(); g.arc(x + Math.cos(a) * d * dir, y + Math.sin(a) * d, rad, 0, 6.283); g.stroke(); }
  g.globalAlpha = 1;
}
VIS.open = (K) => { K(0.15, 'crack', 1.2); K(0.17, 'hit', 1.3); K(0.2, 'mute', 1, 0.4); K(1.8, 'thump', 0.8);
  return (t) => { const P = shot(t, 'pink', { a: [0.24, 0.44, 1.4], b: [0.22, 0.43, 1.5], dur: 2.5, anchor: [540, 1100] }); if (!P) noPhoto(t);
    if (P) { const [x, y] = P(0.06, 0.42); jet(t, 0.15, x, y, -1); } flash(t, 0.15, 0.6, 0.12, '#E8F7FF'); tag(t); hook(t, EP.hook, 480); }; };
VIS[0] = (K) => { K(0.5, 'whoosh', 0.6); K(1.4, 'crack', 1.2); K(1.42, 'hit', 1.2); K(2.2, 'pop', 0.7);
  return (t) => { const P = shot(t, 'red', { a: [0.65, 0.5, 1.0], b: [0.78, 0.55, 1.15], dur: 5, anchor: [480, 920] }); if (!P) noPhoto(t);
    tag(t, 0, 6); realBadge(t, 0.4);
    if (P) { const [x, y] = P(0.8, 0.55); ring(t, 0.8, x, y, RW(P, 0.8, 0.55, 0.09), { spot: t < 1.4 }); const [jx, jy] = P(0.98, 0.6); jet(t, 1.4, jx, jy, 1); callout(t, 2.2, [x, y + RW(P, 0.8, 0.55, 0.09)], 300, 1150, 'THE SNAPPING CLAW'); }
    flash(t, 1.4, 0.5, 0.1, '#E8F7FF'); fact(t, 1.4, '90 KM/H', 'THE BUBBLE IT FIRES'); }; };
VIS[1] = (K) => { K(0.5, 'whoosh', 0.6); K(1.0, 'crack', 1.3); K(1.02, 'hit', 1.4); K(1.05, 'mute', 1, 0.3);
  return (t) => { const P = framed(t, 'claw', 40, 700, 1000); if (!P) noPhoto(t); else if (t < 0.1) {}
    tag(t, 1, 6); realBadge(t, 0.4, 'DIAGRAM: HOW THE CLAW SNAPS');
    if (P) { const [x, y] = P(0.86, 0.86); ring(t, 1.0, x, y, 70, { spot: false }); shockRing(x, y, t, 1.0, 600, '232,247,255', 3); }
    flash(t, 1.0, 0.45, 0.1, '#E8F7FF'); g.save(); g.translate(shake(t, 1.0, 16), 0); fact(t, 1.0, '218 dB', 'ENOUGH TO STUN FISH'); g.restore(); }; };
VIS[2] = (K) => { K(0.5, 'riser', 0.5, 1); K(1.4, 'zap', 1); K(1.42, 'hit', 1.2); K(3.0, 'tick', 0.8); K(4.0, 'tick', 0.8);
  return (t) => { const P = shot(t, 'lead', { a: [0.45, 0.72, 1.0], b: [0.3, 0.76, 1.2], dur: 8, anchor: [540, 900] }); if (!P) noPhoto(t);
    g.fillStyle = `rgba(0,0,0,${0.35 + 0.3 * clamp((t - 1) / 0.4)})`; g.fillRect(0, 0, W, H);
    if (P) { const [x, y] = P(0.22, 0.77), f = Math.exp(-Math.max(0, t - 1.4) * 2.5) * (t > 1.4); g.save(); g.globalCompositeOperation = 'lighter'; glowDot(x, y, 380 * f + 30, '200,235,255', 0.9 * f + 0.15); g.restore(); }
    tag(t, 2, 6); realBadge(t, 0.4); fact(t, 1.4, 'A FLASH', 'OF LIGHT FROM THE COLLAPSING BUBBLE', { color: TXT });
    const bar = (y, k, col, name, tIn) => { const lt = t - tIn; if (lt < 0) return; const w = 820 * k * easeOut(lt / 0.6); g.fillStyle = col; rrect(130, y, w, 40, 10); g.fill(); text(name, 130, y - 14, 'mono', 30, col); };
    if (t > 2.6) panel(80, 960, 920, 240, 0.8); bar(1040, 5000 / 5772, '#9ED8FF', 'SHRIMP FLASH · 5,000+ K', 3.0); bar(1140, 1, GOLD, "SUN'S SURFACE · 5,772 K", 4.0); }; };
VIS[3] = (K) => { K(0.5, 'whoosh', 0.6); K(1.0, 'sonar', 0.9); K(2.0, 'crack', 0.4); K(2.15, 'crack', 0.35); K(2.3, 'crack', 0.4); K(2.45, 'crack', 0.3); K(2.6, 'crack', 0.4);
  return (t) => { const P = shot(t, 'goby2', { a: [0.45, 0.5, 1.0], b: [0.45, 0.52, 1.1], dur: 4, anchor: [540, 900] }); if (!P) noPhoto(t);
    tag(t, 3, 6); realBadge(t, 0.4);
    for (let k = 0; k < 9; k++) shockRing(150 + (k * 137) % 800, 760 + (k * 211) % 420, t, 1.8 + k * 0.12, 260, '120,220,255', 1);
    const sw = (t * 0.9) % 1; g.strokeStyle = `rgba(120,255,170,${0.6 * (1 - sw)})`; g.lineWidth = 4; g.beginPath(); g.arc(540, 960, 60 + sw * 420, -2.4, -0.7); g.stroke();
    fact2(t, 1.0, 'COLONIES', 'JAM SONAR.', 'WHEN A WHOLE COLONY SNAPS'); }; };
VIS[4] = (K) => { K(0.5, 'whoosh', 0.6); K(1.0, 'hit', 1); K(1.8, 'pop', 0.7); K(2.8, 'pop', 0.7);
  return (t) => { const P = shot(t, 'goby', { a: [0.45, 0.5, 1.0], b: [0.47, 0.5, 1.08], dur: 5, anchor: [540, 900] }); if (!P) noPhoto(t);
    tag(t, 4, 6); realBadge(t, 0.4);
    if (P) { callout(t, 1.8, P(0.2, 0.56), 120, 1150, 'GOBY · LOOKOUT', { align: 'left' }); callout(t, 2.8, P(0.66, 0.42), 600, 720, 'THE SHRIMP'); }
    fact(t, 1.0, 'ROOMMATES.', 'THEY SHARE ONE BURROW'); }; };
VIS[5] = (K) => { K(0.5, 'whoosh', 0.6); K(1.0, 'hit', 1.1); K(1.8, 'pop', 0.7);
  return (t) => { const P = shot(t, 'pink', { a: [0.3, 0.45, 1.35], b: [0.24, 0.43, 1.5], dur: 10, anchor: [540, 1000] }); if (!P) noPhoto(t);
    tag(t, 5, 6); realBadge(t, 0.4);
    if (P && t < 4.3) { const [x, y] = P(0.15, 0.42); ring(t, 1.8, x, y, RW(P, 0.15, 0.42, 0.11), { color: '#FF5A8A' }); }
    fact2(t, 1.0, 'NAMED AFTER', 'PINK FLOYD.', 'SYNALPHEUS PINKFLOYDI · 2017', { c2: '#FF5A8A' }); }; };
