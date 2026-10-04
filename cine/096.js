// Wiki Roulette #096 — De Beers / A Diamond Is Forever (figures style)
const N = 6, ADW = A(CAST.woman, { shirt: '#2B2B2B', hair: '#1E1410', glasses: true, seed: 1 }), BOSS = A(CAST.rich, { seed: 2 }), BRIDE = A(CAST.woman, { shirt: '#FFFFFF', pants: '#EDEDED', hair: '#C98A3B', seed: 3 }), GROOM = A(CAST.man, { shirt: '#1E1E1E', tie: '#C8102E', seed: 4 });
VIS.open = fscene(null, N, { bg: 'ring', a: [0.5, 0.5, 1.0], b: [0.5, 0.5, 1.1], dim: 0.3, hook: true, k: [[0.15, 'hit', 1.3], [0.9, 'coin', 1]],
  figs: [[0.2, 280, 1250, 0.66, A(GROOM, { face: 'shock', armR: 'hold', item: 'ring' })], [0.4, 820, 1250, 0.68, A(BOSS, { face: 'greedy', armL: 'hold', itemL: 'money', flip: true })]] });
VIS[0] = fscene(0, N, { bg: 'store', a: [0.5, 0.5, 1.0], b: [0.5, 0.5, 1.1], badge: 'REAL PHOTO · DE BEERS STORE', k: [[0.9, 'pop', 0.9]],
  figs: [[0.2, 540, 1250, 0.72, A(ADW, { face: 'talk', armR: 'hold', item: 'paper' })]], bst: [[0.9, 850, 760, 100, '1947']], f: ['FRANCES GERETY', 'COPYWRITER, FOR DE BEERS', 0.5, { size: 110 }] });
VIS[1] = fscene(1, N, { bg: 'ring', a: [0.5, 0.45, 1.3], dim: 0.45, k: [[0.3, 'hit', 1.2]],
  x: (t) => { const s = spring(t - 0.2, 220, 16); if (s > 0) { g.save(); g.translate(540, 900); g.scale(s, s); text('"A DIAMOND', 0, -30, 'serif', 96, '#FFFFFF', { align: 'center', shadow: true }); text('IS FOREVER."', 0, 70, 'serif', 96, GOLD, { align: 'center', shadow: true }); g.restore(); } } });
VIS[2] = fscene(2, N, { bg: 'store', a: [0.4, 0.5, 1.2], dim: 0.45, k: [[0.9, 'coin', 1]],
  figs: [[0.2, 540, 1250, 0.72, A(ADW, { face: 'greedy', armR: 'out', item: 'sign:No. 1' })]], f: ['SLOGAN OF', 'THE 20TH CENTURY · AD AGE, 2000', 0.5, { size: 120 }] });
VIS[3] = fscene(3, N, { bg: 'hole', a: [0.5, 0.5, 1.0], b: [0.5, 0.5, 1.1], badge: 'REAL PHOTO · THE BIG HOLE, KIMBERLEY', k: [[0.9, 'hit', 1.1]],
  figs: [[0.2, 380, 1250, 0.72, A(BOSS, { face: 'evil', armR: 'hold', item: 'gem' })]], bst: [[0.9, 820, 780, 110, '~90%']], f: ['DE BEERS', 'CONTROLLED ~90% OF PRODUCTION'] });
VIS[4] = fscene(4, N, { bg: 'hole', a: [0.3, 0.6, 1.3], dim: 0.45, k: [[0.6, 'pop', 0.7], [0.9, 'pop', 0.7], [1.2, 'pop', 0.7]],
  figs: [[0.2, 540, 1250, 0.72, A(BOSS, { face: 'smug', armR: 'hold', item: 'box', armL: 'hold', itemL: 'gem' })]], f: ['STOCKPILED.', 'TO KEEP DIAMONDS SCARCE', 0.4] });
VIS[5] = fscene(5, N, { bg: 'lab', a: [0.5, 0.5, 1.0], b: [0.5, 0.5, 1.1], dim: 0.3, badge: 'REAL PHOTO · LAB-GROWN DIAMOND CRYSTAL', k: [[0.9, 'hit', 1]],
  figs: [[0.2, 280, 1250, 0.66, A(CAST.sci, { face: 'happy', armR: 'up', item: 'gem' })], [0.35, 820, 1250, 0.64, A(BOSS, { face: 'shock', flip: true })]], bst: [[0.9, 560, 760, 100, '-90%']], f: ['LAB-GROWN', 'ABOUT 90% CHEAPER TODAY'] });
VIS[6] = fscene(6, N, { bg: 'ring', a: [0.6, 0.5, 1.2], dim: 0.4, k: [[0.8, 'thump', 0.9]],
  figs: [[0.2, 280, 1250, 0.66, A(BRIDE, { face: 'happy', armR: 'up', item: 'ring' })], [0.35, 820, 1250, 0.66, A(BOSS, { face: 'cry', flip: true })]], f: ['2025:', 'DE BEERS DROPS ITS LAB BRAND'] });
