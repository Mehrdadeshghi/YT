// Wiki Roulette #091 — The Landlord's Game / Monopoly (figures style)
const N = 7, LIZ = A(CAST.woman, { shirt: '#5B2A86', hair: '#5A3A20', seed: 1 }), DAR = A(CAST.man, { shirt: '#3B4A6B', tie: '#C8102E', seed: 2 }), LORD = A(CAST.rich, { seed: 3 }), TEN = A(CAST.man, { shirt: '#8A8A8A', pants: '#5A5A5A', seed: 4 });
VIS.open = fscene(null, N, { bg: 'board', a: [0.5, 0.5, 1.0], b: [0.5, 0.5, 1.1], dim: 0.3, hook: true, k: [[0.15, 'hit', 1.3], [0.9, 'coin', 1]],
  figs: [[0.2, 280, 1250, 0.68, A(LIZ, { face: 'angry', armR: 'point', armL: 'hold', itemL: 'board' })], [0.4, 820, 1240, 0.7, A(DAR, { face: 'greedy', armR: 'hold', item: 'money', flip: true })]],
  bub: [[0.9, 300, 760, 'MY IDEA!', { tx: 280, ty: 860 }]] });
VIS[0] = fscene(0, N, { bg: 'patent', a: [0.5, 0.35, 1.0], b: [0.5, 0.4, 1.1], badge: 'REAL DOCUMENT · PATENT DRAWING, 1904', k: [[0.9, 'hit', 1]],
  figs: [[0.2, 760, 1250, 0.7, A(LIZ, { face: 'happy', armL: 'wave', armR: 'hold', item: 'paper', flip: true })]], bst: [[0.9, 300, 780, 100, '1904']], f: ['LIZZIE MAGIE', 'PATENTS "THE LANDLORD\'S GAME"', 0.5, { size: 110 }] });
VIS[1] = fscene(1, N, { bg: 'board', a: [0.5, 0.5, 1.2], dim: 0.4, chip: 'REAL BOARD DESIGN · 1924 PATENT', k: [[0.8, 'coin', 0.9], [1.1, 'thump', 0.8]],
  figs: [[0.2, 280, 1240, 0.72, A(LORD, { face: 'greedy', armR: 'hold', item: 'money' })], [0.3, 800, 1250, 0.64, A(TEN, { face: 'cry', flip: true })]],
  f: ['THE LESSON:', 'LANDLORDS GET RICH · TENANTS GET POOR'] });
VIS[2] = fscene(2, N, { bg: 'game1906', a: [0.5, 0.5, 1.0], dim: 0.35, badge: 'REAL PHOTO · THE GAME, 1906', k: [[0.8, 'pop', 0.9]],
  figs: [[0.2, 260, 1250, 0.62, A(LORD, { face: 'happy', armR: 'up' })], [0.3, 540, 1250, 0.62, A(TEN, { face: 'happy', armL: 'up' })], [0.4, 820, 1250, 0.62, A(LIZ, { face: 'smug', armR: 'wave', flip: true })]],
  bst: [[0.8, 540, 760, 110, 'ALL WIN']], f: ['RULES #2:', 'A VERSION WHERE EVERYONE WINS'] });
VIS[3] = fscene(3, N, { bg: 'board', a: [0.3, 0.3, 1.3], dim: 0.45, k: [[1.0, 'crack', 0.9], [1.02, 'hit', 1.1]],
  figs: [[0.2, 300, 1240, 0.72, (t) => A(DAR, { face: t > 1.0 ? 'evil' : 'talk', armR: 'out', item: 'sign:MY GAME!' })], [0.4, 820, 1250, 0.64, A(LIZ, { face: 'angry', armL: 'fist', flip: true })]],
  bst: [[1.0, 800, 760, 100, '1935']], f: ['CHARLES DARROW', 'SOLD "MONOPOLY" AS HIS OWN', 0.5, { size: 110 }] });
VIS[4] = fscene(4, N, { bg: 'board', a: [0.7, 0.7, 1.3], dim: 0.4, k: [[0.7, 'coin', 1], [0.75, 'hit', 1]],
  figs: [[0.2, 540, 1240, 0.78, A(DAR, { face: 'greedy', armR: 'up', item: 'money', armL: 'hold', itemL: 'money' })]], bst: [[0.7, 840, 760, 110, '$1,000,000']], f: ['MILLIONAIRE.', 'THE FIRST GAME DESIGNER TO GET RICH'] });
VIS[5] = fscene(5, N, { bg: 'magie', a: [0.5, 0.35, 1.0], dim: 0.45, badge: 'REAL PHOTO · LIZZIE MAGIE', k: [[0.9, 'coin', 0.6]],
  figs: [[0.2, 780, 1250, 0.66, A(LIZ, { face: 'sad', armR: 'hold', item: 'money', flip: true })]], bst: [[0.9, 300, 800, 100, '$500']], f: ['HER PATENT?', 'SOLD TO PARKER BROTHERS FOR $500'] });
VIS[6] = fscene(6, N, { bg: 'board', a: [0.5, 0.5, 1.0], b: [0.5, 0.5, 1.12], dim: 0.35, k: [[0.6, 'pop', 0.8], [0.9, 'pop', 0.8], [1.2, 'pop', 0.8]],
  figs: [[0.2, 280, 1250, 0.66, A(DAR, { face: 'greedy', armR: 'up', item: 'board' })], [0.3, 800, 1250, 0.64, A(LIZ, { face: 'angry', flip: true, armL: 'fist' })]],
  bst: [[0.9, 540, 760, 120, '20,000/WK']], f: ['20,000 SETS', 'EVERY WEEK, WITHIN A YEAR'] });
