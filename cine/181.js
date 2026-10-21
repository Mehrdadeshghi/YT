// Wiki Roulette #181 — OCEAN: coelacanth. Frame 1 = a real live coelacanth (Henderson, 2019) + "extinct for 65 million years" →
// real 1938 photo of Marjorie Courtenay-Latimer with the fish from the trawler's catch, 5 ft → the same fish today (holotype, East London
// Museum): fins on stalks like little legs → embryo with yolk sac + bars: up to 5 years vs the frilled shark's 3.5 (GRAPHIC) →
// the Indonesian species (1997 fish market, honeymoon couple) → question.
const N181 = 4, BLUE181 = '#7FC8FF';

// two horizontal bars: coelacanth up to 5 years vs frilled shark 3.5 years (p 0 … 1)
function bars181(t, t0, t1) { const y = 1210, x0 = 90, full = 820, p0 = easeOut((t - t0) / 0.7), p1 = easeOut((t - t1) / 0.7); if (p0 <= 0) return;
  panel(60, y - 70, 960, 300, 0.78);
  text('COELACANTH', x0, y - 20, 'mono', 26, TXT, { ls: 2 }); g.fillStyle = GOLD; rrect(x0, y, full * p0, 56, 14); g.fill();
  if (p0 > 0.9) text('UP TO 5 YRS', x0 + full - 16, y + 40, 'disp', 34, BG, { align: 'right' });
  if (p1 > 0) { text('FRILLED SHARK · OLD RECORD', x0, y + 110, 'mono', 26, 'rgba(255,255,255,0.75)', { ls: 2 });
    g.fillStyle = 'rgba(200,205,215,0.85)'; rrect(x0, y + 130, full * 0.7 * p1, 56, 14); g.fill();
    if (p1 > 0.9) text('3.5 YRS', x0 + full * 0.7 - 16, y + 170, 'disp', 34, BG, { align: 'right' }); }
  text('GRAPHIC', 1000, y + 215, 'mono', 20, 'rgba(255,255,255,0.5)', { ls: 3, align: 'right' }); }

// ---------- scenes ----------
VIS.open = (K) => { const sx = sw('sixty', 1.0), ca = sw('caught', 3.6); K(0.15, 'hit', 1.2); K(0.2, 'mute', 1, 0.4); K(sx, 'boom', 1); K(ca, 'ding', 1);
  return (t) => { atmosphere(t); const P = shot(t, 'live', { box: [40, 640, 1000, 640], a: [0.5, 0.5, 1.0], b: [0.5, 0.5, 1.08], dur: 4.5 });
    tag(t); hook(t, EP.hook, 440);
    if (P && t > ca) { const [x, y] = P(0.22, 0.35); ring(t, ca, x, y, 150, { color: BLUE181, spot: false }); chip('STILL ALIVE', 540, 1430, t, ca, { size: 52, bg: BLUE181, fg: BG }); }
    realBadge(t, 0.3, 'REAL PHOTO · LIVE COELACANTH, SOUTH AFRICA', 600); }; };

VIS[0] = S(() => { const tr = sw('trawler', 2.6), fi = sw('Five', 4.0);
  return vscene(0, N181, { ph: 'marj', o: { box: [40, 720, 1000, 660] }, a: [0.5, 0.5, 1.0], b: [0.5, 0.52, 1.04], dur: 6, badge: 'REAL PHOTO · MARJORIE COURTENAY-LATIMER',
    k: [[0.3, 'whoosh', 0.7], [tr, 'pop', 0.9], [fi, 'hit', 1.1]],
    f2: ['SOUTH AFRICA', '1938', null, 0.3, { y: 470, size: 120, c2: GOLD }],
    x: (t, P) => { if (t > tr && t < fi) chip('🎣 IN A TRAWLER’S CATCH', 540, 1430, t, tr, { size: 38, bg: '#FFF', fg: BG });
      if (P && t > fi) { const [xa] = P(0.1, 0.9), [xb] = P(0.99, 0.9); ruler(t, fi, Math.max(xa, 70), 1340, Math.min(xb, 1010) - Math.max(xa, 70), '5 FT'); } } }); });

VIS[1] = S(() => { const st = sw('stalks', 1.4), le = sw('legs', 2.4), tu = sw('tuna', 4.2);
  return vscene(1, N181, { ph: 'holo', o: { box: [40, 720, 1000, 660], credit: 'Photo: Bernard Dupont / CC BY-SA 2.0' }, a: [0.5, 0.55, 1.0], b: [0.52, 0.58, 1.08], dur: 5,
    badge: 'REAL PHOTO · THE 1938 FISH, STILL IN ITS MUSEUM', k: [[0.3, 'whoosh', 0.7], [st, 'pop', 1], [le, 'pop', 1], [tu, 'hit', 1.1]],
    x: (t, P) => { if (t < tu) fact2(t, 0.3, 'FINS ON', 'STALKS', null, { y: 470, size: 130, c2: BLUE181 });
      else fact2(t, tu, 'CLOSER TO YOU', 'THAN TO A TUNA', null, { y: 470, size: 110, c2: GOLD });
      if (P && t > st) { const [x, y] = P(0.66, 0.84); ring(t, st, x, y, 90, { color: BLUE181, spot: false }); }
      if (P && t > le) { const [x, y] = P(0.47, 0.86); ring(t, le, x, y, 80, { color: BLUE181, spot: false }); chip('🦵 LIKE LITTLE LEGS', 540, 1430, t, le, { size: 38, bg: BLUE181, fg: BG }); } } }); });

VIS[2] = S(() => { const fv = sw('five', 1.2), fr = sw('frilled', 2.6);
  return vscene(2, N181, { ph: 'emb', o: { box: [40, 640, 1000, 520], credit: 'Photo: Citron / CC BY-SA 3.0' }, a: [0.5, 0.5, 1.0], b: [0.5, 0.5, 1.08], dur: 5, badge: 'REAL PHOTO · COELACANTH EMBRYO',
    k: [[0.3, 'whoosh', 0.7], [fv, 'boom', 1], [fr, 'pop', 0.9]],
    f2: ['PREGNANT FOR', 'UP TO 5 YEARS', null, 0.3, { y: 420, size: 110, c2: GOLD }],
    x: (t) => bars181(t, fv, fr) }); });

VIS[3] = S(() => { const ni = sw('Nineteen', 0.3), ma = sw('market', 2.6), ho = sw('honeymoon', 4.0);
  return vscene(3, N181, { ph: 'indo', o: { box: [40, 720, 1000, 660], credit: 'Photo: OpenCage / CC BY-SA 2.5' }, a: [0.5, 0.45, 1.0], b: [0.5, 0.5, 1.12], dur: 6, badge: 'REAL PHOTO · INDONESIAN SPECIES, PRESERVED',
    k: [[0.3, 'whoosh', 0.7], [ma, 'pop', 1], [ho, 'ding', 0.9]],
    f2: ['1997:', 'SPECIES #2', null, ni, { y: 470, size: 130, c2: BLUE181 }],
    x: (t) => { if (t > ma && t < ho) chip('🐟 IN A FISH MARKET', 540, 1430, t, ma, { size: 38, bg: '#FFF', fg: BG });
      if (t > ho) chip('💍 SPOTTED ON A HONEYMOON', 540, 1430, t, ho, { size: 38, bg: GOLD, fg: BG }); } }); });
