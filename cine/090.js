// Wiki Roulette #090 — Victor Lustig (figures style)
const N = 7, LUS = A(CAST.conman, { seed: 1 }), POI = A(CAST.man, { shirt: '#7A5634', hat: 'beret', hatCol: '#3A2A1E', seed: 2 }), DEAL2 = A(CAST.worker, { hat: 'cap', hatCol: '#3A4A5A', seed: 3 });
VIS.open = fscene(null, N, { bg: 'eiffel', a: [0.5, 0.45, 1.0], b: [0.5, 0.4, 1.1], hook: true, k: [[0.15, 'hit', 1.3], [0.8, 'coin', 1]],
  figs: [[0.2, 330, 1240, 0.72, A(LUS, { face: 'smug', armR: 'point', armL: 'hold', itemL: 'paper' })], [0.4, 820, 1250, 0.66, A(POI, { face: 'greedy', armR: 'hold', item: 'money', flip: true })]],
  bub: [[0.8, 330, 760, 'SOLD!', { tx: 330, ty: 860 }]] });
VIS[0] = fscene(0, N, { bg: 'eiffel', a: [0.5, 0.6, 1.2], b: [0.5, 0.6, 1.3], dim: 0.3, badge: 'REAL PHOTO · EIFFEL TOWER, 1925', k: [[1.0, 'pop', 0.8]],
  figs: [[0.2, 540, 1240, 0.75, (t) => A(LUS, { face: t > 1.0 ? 'smug' : 'talk', armR: 'out', item: 'sign:GOVERNMENT', hat: 'top' })]],
  f: ['1925, PARIS.', 'VICTOR LUSTIG POSES AS AN OFFICIAL'] });
VIS[1] = fscene(1, N, { bg: 'eiffel2', a: [0.5, 0.4, 1.0], dim: 0.3, badge: 'REAL PHOTO · EIFFEL TOWER, 1925', k: [[0.9, 'hit', 1]],
  figs: [[0.2, 260, 1250, 0.62, A(LUS, { face: 'talk', armR: 'point' })], [0.3, 560, 1250, 0.6, A(POI, { face: 'wow' })], [0.4, 850, 1250, 0.6, A(DEAL2, { face: 'wow', flip: true })]],
  bst: [[0.9, 700, 760, 100, 'SCRAP?!']], f: ['FOR SCRAP?', 'HE PITCHED IT TO SCRAP DEALERS'] });
VIS[2] = fscene(2, N, { bg: 'eiffel', a: [0.5, 0.3, 1.1], dim: 0.35, k: [[0.7, 'coin', 1]],
  figs: [[0.2, 300, 1240, 0.7, A(POI, { face: 'happy', armR: 'out', item: 'money' })], [0.3, 800, 1240, 0.7, A(LUS, { face: 'greedy', armL: 'out', flip: true })]],
  f: ['ANDRÉ POISSON', 'PAID FOR THE TOWER', 0.4, { size: 110 }] });
VIS[3] = fscene(3, N, { bg: 'eiffel2', a: [0.5, 0.6, 1.2], dim: 0.4, k: [[0.8, 'thump', 0.9]],
  figs: [[0.2, 300, 1250, 0.7, A(POI, { face: 'cry' })], [0.4, 820, 1250, 0.64, A(CAST.police, { face: 'happy', flip: true })]],
  bub: [[0.7, 330, 760, '...NOTHING.', { tx: 300, ty: 860 }]], f: ['TOO EMBARRASSED', 'TO TELL THE POLICE', 0.4, { size: 110 }] });
VIS[4] = fscene(4, N, { bg: 'eiffel', a: [0.5, 0.5, 1.0], b: [0.5, 0.5, 1.1], dim: 0.3, k: [[0.8, 'pop', 0.8]],
  figs: [[0.2, 540, 1240, 0.74, A(LUS, { face: 'evil', armR: 'out', item: 'sign:FOR SALE', armL: 'wave' })]], bst: [[0.8, 850, 760, 100, 'AGAIN!']], f: ['ROUND TWO.', 'HE TRIED TO SELL IT AGAIN', 0.4] });
VIS[5] = fscene(5, N, { bg: 'eiffel2', a: [0.4, 0.7, 1.3], dim: 0.55, chip: 'ILLUSTRATION', k: [[0.8, 'tick', 0.8], [1.2, 'pop', 0.9]],
  figs: [[0.2, 320, 1240, 0.72, A(LUS, { face: 'smug', armR: 'hold', item: 'box' })], [0.4, 820, 1250, 0.64, A(DEAL2, { face: 'greedy', flip: true })]],
  bst: [[1.2, 820, 760, 100, '$$$?']], f: ['THE MONEY BOX', 'IT "PRINTED" MONEY · IT DIDN\'T', 0.4] });
VIS[6] = fscene(6, N, { bg: 'alcatraz', a: [0.5, 0.5, 1.0], b: [0.5, 0.5, 1.08], badge: 'REAL PHOTO · ALCATRAZ, WHERE HE WAS HELD', k: [[0.8, 'hit', 1.1]],
  figs: [[0.2, 300, 1250, 0.66, A(CAST.man, { shirt: '#2B2B2B', hat: 'hair', hair: '#1E1E1E', face: 'angry', armR: 'fist', beard: '#1E1E1E' })], [0.3, 800, 1240, 0.7, A(LUS, { face: 'greedy', armR: 'hold', item: 'money', flip: true })]],
  f: ['AL CAPONE', 'EVEN HE GOT CONNED', 0.4] });
