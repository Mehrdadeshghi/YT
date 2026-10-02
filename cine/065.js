// Wiki Roulette #065 — Cymothoa exigua, the tongue-eating louse (fact-photo special)
// photo coords (u,v) read off the real files: clown mouth (0.41,0.68) · back louse (0.5,0.33) · mouth louse (0.51,0.52)
// lead mouth (0.58,0.55) · hand louse (0.52,0.27) · spoon louse (0.45,0.47)
const RW = (P, u, v, du) => Math.abs(P(u + du, v)[0] - P(u, v)[0]);      // photo width fraction → screen px
VIS.open = (K) => { K(0.15, 'hit', 1.3); K(0.2, 'mute', 1, 0.4); K(1.6, 'thump', 0.8);
  return (t) => { const P = shot(t, 'clown', { a: [0.42, 0.66, 1.0], b: [0.41, 0.68, 1.12], dur: 2.5, anchor: [540, 1120] }); if (!P) noPhoto(t);
    tag(t); hook(t, EP.hook, 480); if (P && t > 1.2) ring(t, 1.2, ...P(0.41, 0.69), RW(P, 0.41, 0.69, 0.1), { spot: false }); }; };
VIS[0] = (K) => { K(0.5, 'riser', 0.4, 0.8); K(1.3, 'hit', 1.1); K(2.4, 'pop', 0.7);
  return (t) => { const P = shot(t, 'clown', { a: [0.41, 0.68, 1.25], b: [0.41, 0.69, 1.75], dur: 4.5, anchor: [540, 900] }); if (!P) noPhoto(t);
    tag(t, 0, 6); realBadge(t, 0.4);
    if (P) { const [x, y] = P(0.41, 0.69); ring(t, 1.3, x, y, RW(P, 0.41, 0.69, 0.11)); callout(t, 2.4, [x + RW(P, 0.41, 0.69, 0.11), y], 700, 1130, 'PARASITE'); }
    fact(t, 1.3, 'NOT A TONGUE.', 'IT SITS WHERE THE TONGUE WAS', { color: TXT, color2: GOLD }); }; };
VIS[1] = (K) => { K(0.5, 'whoosh', 0.6); K(1.0, 'hit', 1); K(2.0, 'pop', 0.7);
  return (t) => { const P = shot(t, 'back', { a: [0.42, 0.4, 1.0], b: [0.5, 0.34, 1.08], dur: 4, anchor: [540, 960] }); if (!P) noPhoto(t);
    tag(t, 1, 6); realBadge(t, 0.4);
    if (P) { const [x, y] = P(0.5, 0.33); ring(t, 1.0, x, y, RW(P, 0.5, 0.33, 0.09)); callout(t, 2.0, [x, y + RW(P, 0.5, 0.33, 0.09)], 540, 1140, 'THE LOUSE'); }
    fact2(t, 1.0, 'IN THROUGH', 'THE GILLS', 'AS A JUVENILE. THEN IT GRABS THE TONGUE.'); }; };
VIS[2] = (K) => { K(0.5, 'riser', 0.5, 1.2); K(1.7, 'crack', 0.9); K(1.75, 'hit', 1.1);
  return (t) => { const P = shot(t, 'mouth', { a: [0.5, 0.5, 1.0], b: [0.51, 0.52, 1.45], dur: 4, anchor: [540, 900] }); if (!P) noPhoto(t);
    tag(t, 2, 6); realBadge(t, 0.4);
    if (P) { const [x, y] = P(0.51, 0.53); ring(t, 1.7, x, y, RW(P, 0.51, 0.53, 0.12), { color: RED }); }
    fact2(t, 0.6, 'NO BLOOD.', 'NO TONGUE.', null, { c2: RED }); }; };
VIS[3] = (K) => { K(0.5, 'whoosh', 0.6); K(1.2, 'hit', 1.1); K(2.2, 'pop', 0.7);
  return (t) => { const P = shot(t, 'lead', { a: [0.55, 0.5, 1.0], b: [0.58, 0.55, 1.35], dur: 4, anchor: [540, 900] }); if (!P) noPhoto(t);
    tag(t, 3, 6); realBadge(t, 0.4);
    if (P) { const [x, y] = P(0.58, 0.56); ring(t, 1.2, x, y, RW(P, 0.58, 0.56, 0.1)); callout(t, 2.2, [x, y + RW(P, 0.58, 0.56, 0.1)], 540, 1140, 'ITS NEW "TONGUE"'); }
    fact2(t, 1.2, 'IT BECOMES', 'THE TONGUE.', 'A LIVING PROSTHETIC ORGAN'); }; };
VIS[4] = (K) => { K(0.5, 'whoosh', 0.6); K(1.0, 'hit', 1); K(1.6, 'tick', 0.8);
  return (t) => { const P = shot(t, 'hand', { a: [0.5, 0.35, 1.0], b: [0.52, 0.28, 1.3], dur: 4, anchor: [540, 900] }); if (!P) noPhoto(t);
    tag(t, 4, 6); realBadge(t, 0.4);
    if (P) { const [x, y] = P(0.52, 0.27), r = RW(P, 0.52, 0.27, 0.12); ring(t, 1.0, x, y, r); callout(t, 1.6, [x + r * 0.7, y + r * 0.7], 560, 1130, 'FINGERTIPS FOR SCALE'); }
    fact(t, 1.0, '1–3 CM', 'FEMALES: 8–29 MM. MALES: SMALLER.'); }; };
VIS[5] = (K) => { K(0.5, 'whoosh', 0.6); K(1.0, 'hit', 1.1); K(1.8, 'pop', 0.7);
  return (t) => { const P = shot(t, 'louse', { a: [0.42, 0.47, 1.0], b: [0.45, 0.47, 1.1], dur: 9, anchor: [540, 960] }); if (!P) noPhoto(t);
    tag(t, 5, 6); realBadge(t, 0.4);
    if (P && t < 4.2) ring(t, 1.8, ...P(0.45, 0.47), RW(P, 0.45, 0.47, 0.11), { spot: false });
    fact(t, 1.0, '2005 · UK', 'FOUND IN A RED SNAPPER'); }; };
