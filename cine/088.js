// Wiki Roulette #088 — Hawaiian pizza (figures style)
const N = 7, SAM = A(CAST.chef, { skin: '#E8B98E', seed: 1 }), GUY = A(CAST.man, { seed: 2 }), GIRL = A(CAST.woman, { seed: 3 });
VIS.open = fscene(null, N, { bg: 'pizza', a: [0.5, 0.5, 1.1], b: [0.5, 0.5, 1.2], hook: true, k: [[0.15, 'hit', 1.3], [0.7, 'pop', 0.8], [1.1, 'pop', 0.8]],
  figs: [[0.2, 540, 1240, 0.7, A(SAM, { face: 'smug', armR: 'hold', item: 'pizza' })], [0.5, 200, 1250, 0.62, A(GUY, { face: 'angry', armR: 'point' })], [0.6, 880, 1250, 0.62, A(GIRL, { face: 'happy', armL: 'up', flip: true })]],
  bub: [[0.7, 220, 760, 'EWW!', { tx: 200, ty: 860 }], [1.1, 860, 740, 'YUM!', { tx: 880, ty: 860 }]] });
VIS[0] = fscene(0, N, { bg: 'wind', a: [0.5, 0.5, 1.0], b: [0.55, 0.5, 1.1], badge: 'REAL PHOTO · CHATHAM-KENT, ONTARIO',
  figs: [[0.3, 540, 1240, 0.72, (t) => A(SAM, { face: t > 0.9 ? 'happy' : 'talk', armR: 'out', item: 'sign:CANADA', armL: 'hold', itemL: 'pizza' })]],
  bst: [[0.9, 840, 760, 100, '1962']], f: ['CANADA.', 'NOT HAWAII. NOT ITALY.'] });
VIS[1] = fscene(1, N, { bg: 'pizza', a: [0.3, 0.5, 1.2], b: [0.35, 0.5, 1.3], dim: 0.35, badge: 'REAL PHOTO · HAWAIIAN PIZZA',
  figs: [[0.3, 540, 1240, 0.75, A(SAM, { face: 'happy', armL: 'wave', armR: 'hold', item: 'pizza' })]],
  bub: [[0.9, 790, 760, 'HI, ONTARIO!', { tx: 640, ty: 860 }]], f: ['SAM PANOPOULOS', 'BORN IN GREECE · COOK IN CANADA', 0.6, { size: 110 }] });
VIS[2] = fscene(2, N, { bg: 'pizza', a: [0.7, 0.5, 1.3], b: [0.72, 0.5, 1.4], dim: 0.4, k: [[0.9, 'pop', 0.9], [1.2, 'hit', 1]],
  figs: [[0.2, 380, 1240, 0.72, (t) => A(SAM, { face: t > 1.2 ? 'wow' : 'smug', armR: 'up', item: 'pineapple', look: [1, -1] })]],
  bst: [[1.1, 790, 790, 120, 'IDEA!']], f: ['SWEET + SOUR', 'INSPIRED BY CHINESE DISHES IN CANADA'] });
VIS[3] = fscene(3, N, { bg: 'pizza', a: [0.5, 0.5, 1.1], b: [0.5, 0.5, 1.2], dim: 0.35, k: [[1.0, 'hit', 1.1]],
  figs: [[0.2, 380, 1240, 0.72, A(SAM, { face: 'happy', armR: 'out', item: 'sign:HAWAIIAN', armL: 'hold', itemL: 'pineapple' })], [0.4, 820, 1250, 0.62, A(GUY, { face: 'shock', flip: true })]],
  bst: [[1.0, 820, 760, 100, 'A CAN?!']], f: ['THE NAME?', 'FROM A BRAND OF CANNED PINEAPPLE'] });
VIS[4] = fscene(4, N, { bg: 'wind', a: [0.3, 0.5, 1.1], dim: 0.3, k: [[0.8, 'thump', 0.9]],
  figs: [[0.2, 220, 1250, 0.62, A(GUY, { face: 'angry', armR: 'out' })], [0.3, 520, 1250, 0.62, A(GIRL, { face: 'sad' })], [0.4, 860, 1240, 0.66, A(SAM, { face: 'cry', armR: 'hold', item: 'pizza', flip: true })]],
  bub: [[0.7, 240, 760, 'NO THANKS.', { tx: 220, ty: 860 }]], f: ['FLOP.', 'CUSTOMERS DIDN\'T LIKE IT AT FIRST', 0.5] });
VIS[5] = fscene(5, N, { bg: 'pizza', a: [0.5, 0.4, 1.0], dim: 0.3, k: [[0.7, 'coin', 1]],
  figs: [[0.2, 380, 1240, 0.7, A(GUY, { face: 'greedy', armR: 'out', item: 'sign:No. 1', armL: 'hold', itemL: 'pizza', shirt: '#F2B705', pants: '#1F7A3A' })]],
  bst: [[0.7, 820, 790, 110, '15%']], f: ['1999: AUSTRALIA', 'MOST POPULAR PIZZA · 15% OF SALES', 0.4] });
VIS[6] = fscene(6, N, { bg: 'pizza', a: [0.2, 0.6, 1.2], dim: 0.45, k: [[0.8, 'hit', 1], [1.8, 'pop', 0.8]],
  figs: [[0.2, 400, 1240, 0.72, (t) => A(CAST.official, { face: t > 1.8 ? 'happy' : 'angry', armR: 'out', item: 'sign:BAN IT!', shirt: '#003897' })]],
  bub: [[1.8, 820, 820, 'JUST KIDDING!', { tx: 520, ty: 860 }]], f: ['ICELAND\'S PRESIDENT', 'JOKED ABOUT A BAN · 2017', 0.5, { size: 100 }] });
VIS[7] = fscene(7, N, { bg: 'pizza', a: [0.5, 0.5, 1.0], b: [0.5, 0.5, 1.1], dim: 0.3, k: [[0.8, 'pop', 0.8], [1.4, 'pop', 0.8]],
  figs: [[0.2, 260, 1250, 0.66, A(GIRL, { face: 'greedy', armR: 'hold', item: 'pizza' })], [0.35, 820, 1250, 0.66, A(GUY, { face: 'angry', armL: 'fist', flip: true })]],
  bub: [[0.8, 260, 760, '12% LOVE IT', { tx: 260, ty: 860, bg: '#3DDC84' }], [1.4, 820, 760, '24% HATE IT', { tx: 820, ty: 860, bg: '#FF5A4A', fg: '#FFFFFF' }]], f: ['USA TODAY:', 'PIZZA EATERS, 2019 POLL'] });
