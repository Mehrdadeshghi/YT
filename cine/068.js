// Wiki Roulette #068 — Colossal squid (fact-photo special)
// photo coords: lead/tepapa = Te Papa specimen seen from above (mantle (0.5,0.2), body (0.47,0.45)) · club hooks (0.42,0.55)
// beak (0.35,0.62) · human = illustration, eye (0.38,0.52), diver (0.75,0.2)
const RW = (P, u, v, du) => Math.abs(P(u + du, v)[0] - P(u, v)[0]);
function eyeBall(x, y, r) { const gr = g.createRadialGradient(x - r * 0.3, y - r * 0.3, r * 0.1, x, y, r); gr.addColorStop(0, '#5A6B78'); gr.addColorStop(1, '#0B1014');
  g.fillStyle = gr; g.beginPath(); g.arc(x, y, r, 0, 6.283); g.fill(); g.fillStyle = '#000'; g.beginPath(); g.arc(x, y, r * 0.45, 0, 6.283); g.fill();
  g.fillStyle = 'rgba(255,255,255,0.7)'; g.beginPath(); g.arc(x - r * 0.25, y - r * 0.3, r * 0.1, 0, 6.283); g.fill(); }
function ball(x, y, r) { g.fillStyle = '#F2F0EA'; g.beginPath(); g.arc(x, y, r, 0, 6.283); g.fill(); g.fillStyle = '#16181A';
  const pent = (cx, cy, s) => { g.beginPath(); for (let k = 0; k < 5; k++) { const a = -1.571 + k * 1.2566; g.lineTo(cx + Math.cos(a) * s, cy + Math.sin(a) * s); } g.fill(); };
  pent(x, y, r * 0.28); for (let k = 0; k < 5; k++) { const a = -1.571 + k * 1.2566 + 0.63; g.save(); g.beginPath(); g.arc(x, y, r, 0, 6.283); g.clip(); pent(x + Math.cos(a) * r * 0.8, y + Math.sin(a) * r * 0.8, r * 0.26); g.restore(); } }
VIS.open = (K) => { K(0.15, 'hit', 1.3); K(0.2, 'mute', 1, 0.4); K(1.8, 'thump', 0.8);
  return (t) => { const P = shot(t, 'lead', { a: [0.47, 0.42, 1.0], b: [0.47, 0.4, 1.1], dur: 2.5, anchor: [540, 1080] }); if (!P) noPhoto(t);
    tag(t); hook(t, EP.hook, 480); }; };
VIS[0] = (K) => { K(0.5, 'whoosh', 0.6); K(1.0, 'hit', 1.1); K(1.8, 'pop', 0.7); K(2.6, 'pop', 0.6);
  return (t) => { if (PHOTOS.tepapa) g.drawImage(blurOf('tepapa'), 0, 0, W, H); else noPhoto(t);
    tag(t, 0, 5); fact(t, 0.6, '27–30 CM', 'ACROSS. EACH EYE.'); const CM = 15, y = 1000;
    panel(50, 690, 980, 500, 0.7); text('TO SCALE', 80, 740, 'mono', 26, DIM, { ls: 4 });
    const s1 = spring(t - 1.0, 200, 22), s2 = spring(t - 1.8, 200, 22), s3 = spring(t - 2.6, 200, 22);
    if (s1 > 0) { g.save(); g.translate(290, y); g.scale(s1, s1); eyeBall(0, 0, 30 * CM / 2); g.restore(); text('COLOSSAL SQUID', 290, 1165, 'mono', 28, GOLD, { align: 'center' }); }
    if (s2 > 0) { g.save(); g.translate(720, y + 60); g.scale(s2, s2); ball(0, 0, 22 * CM / 2); g.restore(); text('FOOTBALL · 22 CM', 720, 1165, 'mono', 28, TXT, { align: 'center' }); }
    if (s3 > 0) { g.save(); g.translate(960, y + 190); g.scale(s3, s3); eyeBall(0, 0, 2.4 * CM / 2); g.restore(); text('YOUR EYE', 960, y + 150, 'mono', 24, TXT, { align: 'center' }); } }; };
VIS[1] = (K) => { K(0.5, 'whoosh', 0.6); K(1.0, 'hit', 1.2); K(2.0, 'pop', 0.7);
  return (t) => { const P = shot(t, 'tepapa', { a: [0.5, 0.35, 1.0], b: [0.5, 0.3, 1.12], dur: 5, anchor: [540, 900] }); if (!P) noPhoto(t);
    tag(t, 1, 5); realBadge(t, 0.4, 'REAL PHOTO · TE PAPA, NEW ZEALAND');
    if (P) callout(t, 2.0, P(0.52, 0.26), 540, 1140, 'THIS ONE · CAUGHT 2007');
    fact(t, 1.0, '495 KG', 'THE HEAVIEST EVER CAUGHT'); }; };
VIS[2] = (K) => { K(0.5, 'whoosh', 0.6); K(1.0, 'hit', 1); K(1.8, 'scratch', 0.6);
  return (t) => { const P = shot(t, 'club', { a: [0.45, 0.5, 1.0], b: [0.42, 0.55, 1.35], dur: 4, anchor: [540, 920] }); if (!P) noPhoto(t);
    tag(t, 2, 5); realBadge(t, 0.4, 'REAL SPECIMEN · LONDON');
    if (P) { const [x, y] = P(0.42, 0.55); ring(t, 1.0, x, y, RW(P, 0.42, 0.55, 0.14)); callout(t, 1.8, [x, y + RW(P, 0.42, 0.55, 0.14)], 300, 1150, 'HOOKS'); }
    fact2(t, 0.8, 'HOOKS.', 'SOME SWIVEL.'); }; };
VIS[3] = (K) => { K(0.5, 'whoosh', 0.6); K(1.0, 'hit', 1.1); K(2.0, 'pop', 0.7);
  return (t) => { const P = shot(t, 'beak', { a: [0.35, 0.6, 1.0], b: [0.35, 0.62, 1.4], dur: 5, anchor: [540, 940] }); if (!P) noPhoto(t);
    tag(t, 3, 5); realBadge(t, 0.4, 'REAL SPECIMEN · LONDON');
    if (P) { const [x, y] = P(0.35, 0.62); ring(t, 1.4, x, y, RW(P, 0.35, 0.62, 0.11)); callout(t, 2.2, [x + RW(P, 0.35, 0.62, 0.11), y], 640, 1150, 'ITS BEAK'); }
    fact(t, 1.0, '14%', 'OF SQUID BEAKS IN SPERM WHALES'); }; };
VIS[4] = (K) => { K(0.5, 'whoosh', 0.6); K(1.0, 'hit', 1.2); K(2.2, 'pop', 0.7);
  return (t) => { const P = shot(t, 'human', { box: [40, 720, 1000, 620], a: [0.5, 0.3, 1.0], b: [0.5, 0.3, 1.06], dur: 12 }); if (!P) noPhoto(t);
    tag(t, 4, 5); realBadge(t, 0.4, 'ILLUSTRATION · TO SCALE');
    if (P && t < 6) callout(t, 2.2, P(0.72, 0.24), 640, 1000, 'A HUMAN DIVER');
    fact2(t, 1.0, 'FIRST FILMED', 'ALIVE: 2025.', 'A 30 CM BABY · 600 M DEEP'); }; };
