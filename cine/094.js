// Wiki Roulette #094 — Liebeck v. McDonald's (figures style; no logos)
const N = 7, STELLA = A(CAST.grandma, { seed: 1 }), CORP = A(CAST.rich, { seed: 2, hat: 'hair', hair: '#2A1A10' }), LAW = A(CAST.official, { shirt: '#2E3A59', tie: '#F2B705', seed: 3 }), JUD = A(CAST.judge, { seed: 4 });
VIS.open = fscene(null, N, { bg: 'coffee', a: [0.5, 0.5, 1.0], b: [0.5, 0.5, 1.1], dim: 0.35, hook: true, k: [[0.15, 'hit', 1.3], [0.8, 'pop', 0.8]],
  figs: [[0.2, 280, 1250, 0.66, A(CAST.man, { face: 'happy', armR: 'point' })], [0.4, 800, 1250, 0.66, A(CAST.woman, { face: 'happy', armL: 'point', flip: true })]],
  bub: [[0.8, 300, 760, 'HAHA!', { tx: 280, ty: 860 }], [1.0, 790, 760, 'LOL!', { tx: 800, ty: 860 }]] });
VIS[0] = fscene(0, N, { bg: 'abq', a: [0.5, 0.5, 1.0], b: [0.5, 0.5, 1.1], badge: 'REAL PHOTO · ALBUQUERQUE, NEW MEXICO', k: [[1.2, 'splash', 1], [1.25, 'hit', 1]],
  figs: [[0.2, 540, 1250, 0.74, (t) => A(STELLA, { face: t > 1.2 ? 'shock' : 'happy', armR: t > 1.2 ? 'up' : 'hold', item: t > 1.2 ? null : 'coffee' })]], bst: [[1.2, 850, 760, 100, 'OUCH!']], f: ['1992:', 'STELLA LIEBECK, AGE 79'] });
VIS[1] = fscene(1, N, { bg: 'abq2', a: [0.5, 0.5, 1.0], dim: 0.45, chip: 'ILLUSTRATION', k: [[0.8, 'thump', 0.9]],
  figs: [[0.2, 540, 1250, 0.72, A(STELLA, { face: 'cry' })]], f: ['3RD-DEGREE BURNS', 'SKIN GRAFTS · 8 DAYS IN HOSPITAL', 0.4, { size: 110, color: '#FF5A4A' }] });
VIS[2] = fscene(2, N, { bg: 'coffee', a: [0.5, 0.3, 1.2], dim: 0.4, badge: 'REAL PHOTO · COFFEE (GENERIC)', k: [[0.8, 'hit', 1.1]],
  figs: [[0.2, 380, 1250, 0.72, A(CAST.sci, { face: 'shock', armR: 'hold', item: 'coffee' })]],
  x: (t) => { if (t > 0.6) { const v = Math.min(88, Math.round((t - 0.6) * 140)); popNum(v + ' °C', 980, 900, 120, v > 80 ? '#FF5A4A' : GOLD, t, 0.6, { align: 'right' }); label('UP TO 190 °F', 760, 960, t, 0.8, { size: 26 }); } },
  f: ['THAT HOT.', 'COMPANY RULE: 82–88 °C'] });
VIS[3] = fscene(3, N, { bg: 'abq', a: [0.3, 0.5, 1.2], dim: 0.45, k: [[0.8, 'pop', 0.8], [1.6, 'coin', 0.6]],
  figs: [[0.2, 260, 1250, 0.66, A(STELLA, { face: 'talk', armR: 'hold', item: 'paper' })], [0.3, 820, 1250, 0.68, A(CORP, { face: 'smug', armL: 'hold', itemL: 'money', flip: true })]],
  bub: [[0.8, 280, 760, '$20,000?', { tx: 260, ty: 860 }], [1.6, 800, 760, '$800.', { tx: 820, ty: 860 }]], f: ['HER ASK:', 'COVER THE MEDICAL BILLS'] });
VIS[4] = fscene(4, N, { bg: 'abq2', a: [0.5, 0.5, 1.2], dim: 0.5, k: [[0.8, 'crack', 1], [0.82, 'hit', 1.2]],
  figs: [[0.2, 280, 1250, 0.68, A(LAW, { face: 'angry', armR: 'hold', item: 'paper' })], [0.4, 820, 1250, 0.66, A(CORP, { face: 'shock', flip: true })]], bst: [[0.8, 540, 760, 120, '700+']], f: ['IN COURT:', '700+ EARLIER BURN REPORTS'] });
VIS[5] = fscene(5, N, { bg: 'abq', a: [0.6, 0.5, 1.2], dim: 0.45, k: [[0.8, 'hit', 1.1], [0.9, 'coin', 1]],
  figs: [[0.2, 760, 1250, 0.7, A(JUD, { face: 'angry', armR: 'hold', item: 'gavel', flip: true })]], bst: [[0.8, 300, 790, 130, '$2.7M']], f: ['THE JURY:', 'PUNITIVE DAMAGES · ≈ 2 DAYS OF COFFEE SALES'] });
VIS[6] = fscene(6, N, { bg: 'abq2', a: [0.4, 0.5, 1.0], dim: 0.4, k: [[0.9, 'hit', 1]],
  figs: [[0.2, 260, 1250, 0.66, A(JUD, { face: 'talk', armR: 'hold', item: 'gavel' })], [0.4, 820, 1250, 0.66, A(STELLA, { face: 'sad', flip: true })]], bst: [[0.9, 540, 760, 110, '$480K']], f: ['CUT DOWN.', 'THEN A SECRET SETTLEMENT'] });
