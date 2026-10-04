// Wiki Roulette #095 — Tulip mania (figures style)
const N = 7, TRA = A(CAST.man, { shirt: '#1E1E1E', pants: '#1E1E1E', hat: 'top', hatCol: '#1E1E1E', tie: '#FFFFFF', seed: 1 }), BUY = A(CAST.man, { shirt: '#8B1E1E', hat: 'beret', hatCol: '#1E1E1E', beard: '#6B4A2B', seed: 2 }), HIS = A(CAST.woman, { shirt: '#2E7D32', glasses: true, seed: 3 });
VIS.open = fscene(null, N, { bg: 'semper', a: [0.5, 0.4, 1.0], b: [0.5, 0.4, 1.1], dim: 0.25, hook: true, k: [[0.15, 'hit', 1.3], [0.9, 'coin', 1]],
  figs: [[0.2, 280, 1250, 0.68, A(TRA, { face: 'smug', armR: 'hold', item: 'tulip' })], [0.4, 820, 1250, 0.66, A(BUY, { face: 'greedy', armL: 'hold', itemL: 'money', flip: true })]] });
VIS[0] = fscene(0, N, { bg: 'satire', a: [0.5, 0.5, 1.0], b: [0.5, 0.5, 1.1], badge: 'PAINTING · SATIRE ON TULIP MANIA, c. 1640', k: [[0.9, 'pop', 0.9]],
  figs: [[0.2, 540, 1250, 0.7, A(TRA, { face: 'greedy', armR: 'up', item: 'tulip', armL: 'hold', itemL: 'money' })]], f: ['1634–1637', 'TULIP MANIA · DUTCH REPUBLIC'] });
VIS[1] = fscene(1, N, { bg: 'semper', a: [0.5, 0.3, 1.0], b: [0.5, 0.3, 1.1], dim: 0.2, badge: 'REAL DRAWING · SEMPER AUGUSTUS', k: [[1.0, 'coin', 1], [1.05, 'hit', 1]],
  figs: [[0.2, 820, 1250, 0.66, A(BUY, { face: 'wow', flip: true })]], bst: [[1.0, 300, 800, 120, 'ƒ10,000']], f: ['ONE BULB:', '10,000 GUILDERS'] });
VIS[2] = fscene(2, N, { bg: 'fields', a: [0.5, 0.5, 1.0], b: [0.5, 0.5, 1.1], badge: 'REAL PHOTO · DUTCH TULIP FIELD', k: [[0.6, 'coin', 1]],
  figs: [[0.2, 540, 1250, 0.7, A(BUY, { face: 'shock', armR: 'up', armL: 'up' })]], bst: [[0.6, 840, 760, 110, '€130,000']], f: ['TODAY THAT\'S', 'ABOUT €130,000', 0.3] });
VIS[3] = fscene(3, N, { bg: 'semper', a: [0.5, 0.25, 1.4], dim: 0.35, k: [[0.7, 'hit', 1]],
  figs: [[0.2, 760, 1250, 0.68, A(CAST.sci, { face: 'wow', armR: 'hold', item: 'magnifier', flip: true })]], bst: [[0.7, 300, 800, 100, 'VIRUS!']], f: ['THE STRIPES?', 'A TULIP VIRUS', 0.3] });
VIS[4] = fscene(4, N, { bg: 'wagon', a: [0.5, 0.5, 1.0], b: [0.5, 0.5, 1.1], badge: 'PAINTING · FLORA\'S WAGON OF FOOLS, c. 1637', k: [[1.0, 'crack', 1], [1.02, 'hit', 1.2]],
  figs: [[0.2, 300, 1250, 0.68, (t) => A(TRA, { face: t > 1.0 ? 'cry' : 'greedy', armR: 'hold', item: 'tulip' })], [0.3, 820, 1250, 0.64, (t) => A(BUY, { face: 'smug', flip: true, walk: t > 1.0, dx: (tt) => Math.max(0, tt - 1.0) * 400 })]],
  bst: [[1.0, 540, 760, 110, 'CRASH!', '#FF6B4A']], f: ['FEB 1637:', 'BUYERS VANISH · PRICES COLLAPSE'] });
VIS[5] = fscene(5, N, { bg: 'gerome', a: [0.5, 0.5, 1.0], b: [0.5, 0.5, 1.1], badge: 'PAINTING · THE TULIP FOLLY, GÉRÔME', k: [[0.8, 'pop', 0.8]],
  figs: [[0.2, 540, 1250, 0.7, A(HIS, { face: 'talk', armR: 'hold', item: 'paper' })]], bub: [[0.8, 820, 760, 'NOT SO WILD!', { tx: 600, ty: 860 }]], f: ['BUT HISTORIANS:', 'ONLY A SMALL GROUP TOOK PART'] });
VIS[6] = fscene(6, N, { bg: 'satire', a: [0.4, 0.5, 1.3], dim: 0.45, k: [[0.8, 'hit', 1]],
  figs: [[0.2, 300, 1250, 0.66, A(HIS, { face: 'smug', armR: 'point' })], [0.3, 800, 1250, 0.64, A(TRA, { face: 'shock', flip: true })]], bst: [[0.8, 560, 760, 110, '< 6']], f: ['FEWER THAN 6', 'FOUND IN MONEY TROUBLE'] });
