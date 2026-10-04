// Wiki Roulette #089 — Pluto (figures style)
const N = 7, PL = { shirt: '#D9B48F', pants: '#8A6A4A', hat: 'none', skin: '#E8D2B5', seed: 1 }, AST = A(CAST.sci, { seed: 2 });
// Pluto as a figure: round tan body = planet head
const PLUTO = (face, more) => A(PL, Object.assign({ face, hat: 'hair', hair: '#C8A27A' }, more || {}));
VIS.open = fscene(null, N, { bg: 'pluto', a: [0.5, 0.5, 1.0], b: [0.5, 0.5, 1.12], dim: 0.25, hook: true, k: [[0.15, 'hit', 1.3], [0.9, 'crack', 1]],
  figs: [[0.3, 330, 1240, 0.7, A(CAST.official, { face: 'angry', armR: 'point', item: 'paper' })], [0.5, 800, 1250, 0.66, PLUTO('cry', { flip: true, item: 'planet', armR: 'hold' })]],
  bub: [[0.8, 330, 760, 'YOU\'RE FIRED!', { tx: 330, ty: 860 }]] });
VIS[0] = fscene(0, N, { bg: 'lowell', a: [0.5, 0.5, 1.0], b: [0.5, 0.5, 1.1], badge: 'REAL PHOTO · LOWELL OBSERVATORY', k: [[0.9, 'hit', 1.1]],
  figs: [[0.2, 380, 1240, 0.72, (t) => A(AST, { face: t > 0.9 ? 'wow' : 'talk', armR: 'out', item: 'telescope' })]], bst: [[0.9, 820, 780, 110, '1930']], f: ['DISCOVERED.', 'BY CLYDE TOMBAUGH, ARIZONA'] });
VIS[1] = fscene(1, N, { bg: 'tomb', a: [0.5, 0.35, 1.0], dim: 0.55, badge: 'REAL PHOTO · CLYDE TOMBAUGH', k: [[0.9, 'pop', 0.9]],
  figs: [[0.2, 540, 1250, 0.66, A(CAST.kid, { face: 'happy', armR: 'out', item: 'sign:PLUTO!' })]], bub: [[0.9, 820, 760, 'I\'M 11!', { tx: 620, ty: 860 }]], f: ['THE NAME?', 'FROM AN 11-YEAR-OLD GIRL IN ENGLAND'] });
VIS[2] = fscene(2, N, { bg: 'vote', a: [0.5, 0.5, 1.0], b: [0.5, 0.5, 1.1], badge: 'REAL PHOTO · THE VOTE, PRAGUE 2006', k: [[0.8, 'crack', 1], [0.82, 'hit', 1.2]],
  figs: [[0.2, 260, 1250, 0.62, A(AST, { face: 'evil', armR: 'up' })], [0.3, 540, 1250, 0.62, A(CAST.man, { face: 'smug', armR: 'up', hat: 'lab' })], [0.5, 840, 1250, 0.62, PLUTO('shock', { flip: true })]],
  f: ['2006:', 'ASTRONOMERS VOTE · PLUTO DEMOTED'] });
VIS[3] = fscene(3, N, { bg: 'vote', a: [0.3, 0.5, 1.2], dim: 0.55, k: [[0.8, 'tick', 0.8], [1.3, 'hit', 1]],
  figs: [[0.2, 820, 1250, 0.62, PLUTO('angry', { flip: true, armL: 'fist' })]],
  x: (t) => { if (t > 0.6) { panel(70, 700, 620, 330, 0.85); popNum('424', 110, 840, 130, GOLD, t, 0.7); label('VOTED', 114, 890, t, 0.8, { size: 28 }); popNum('~9,000', 110, 990, 70, TXT, t, 1.1); label('MEMBERS IN TOTAL', 114, 1020, t, 1.2, { size: 22 }); } },
  f: ['ONLY 424 VOTED.', 'LESS THAN 5% OF ALL MEMBERS', 0.5, { size: 110 }] });
VIS[4] = fscene(4, N, { bg: 'pluto', a: [0.5, 0.5, 0.9], dim: 0.35, chip: 'REAL PHOTO · PLUTO, NEW HORIZONS 2015', k: [[1.0, 'pop', 0.8]],
  figs: [[0.2, 360, 1250, 0.66, A(AST, { face: 'talk', armR: 'point', item: 'paper' })], [0.4, 820, 1250, 0.6, PLUTO('sad', { flip: true })]],
  bst: [[1.0, 820, 760, 100, 'RULE 3']], f: ['THE REASON?', 'IT HASN\'T CLEARED ITS ORBIT'] });
VIS[5] = fscene(5, N, { bg: 'size', a: [0.6, 0.5, 1.0], b: [0.62, 0.5, 1.08], badge: 'REAL PHOTO · PLUTO VS EARTH VS MOON', k: [[0.6, 'pop', 0.9]],
  figs: [[0.2, 820, 1250, 0.5, PLUTO('cry', { flip: true })]], f: ['TINY.', 'SMALLER THAN OUR MOON', 0.4] });
VIS[6] = fscene(6, N, { bg: 'pluto', a: [0.5, 0.5, 1.0], b: [0.5, 0.5, 1.12], dim: 0.35, k: [[0.8, 'pop', 0.8], [1.2, 'hit', 1]],
  figs: [[0.2, 260, 1250, 0.62, PLUTO('smug', {})], [0.4, 820, 1250, 0.62, PLUTO('angry', { flip: true, hair: '#B08860', armL: 'fist' })]],
  bst: [[1.2, 540, 760, 120, '248 YRS']], f: ['1 LAP = 248 YEARS', 'NO FULL ORBIT SINCE 1930'] });
