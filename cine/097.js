// Wiki Roulette #097 — Koh-i-Noor (figures style)
const N = 7, BRIT = A(CAST.official, { shirt: '#8B1E1E', tie: '#F2C230', hat: 'helmet', hatCol: '#1E1E1E', seed: 1 }), BOY = A(CAST.kid, { shirt: '#F28C28', hat: 'beanie', hatCol: '#F28C28', skin: '#C9905A', seed: 2 }), ALB = A(CAST.man, { shirt: '#1F2A44', beard: '#5A3A20', seed: 3 }), Q = A(CAST.queen, { seed: 4 });
const NAT = (shirt, sign, more) => A(CAST.man, Object.assign({ shirt, skin: '#C9905A', hair: '#1E1410', armR: 'out', item: 'sign:' + sign, face: 'angry' }, more || {}));
VIS.open = fscene(null, N, { bg: 'replica', a: [0.5, 0.5, 1.0], b: [0.5, 0.5, 1.1], dim: 0.3, hook: true, k: [[0.15, 'hit', 1.3], [0.9, 'pop', 0.8]],
  figs: [[0.2, 540, 1240, 0.7, A(Q, { face: 'smug', armR: 'hold', item: 'gem' })]], bub: [[0.9, 820, 760, 'MINE.', { tx: 600, ty: 860 }]] });
VIS[0] = fscene(0, N, { bg: 'ranjit', a: [0.5, 0.35, 1.0], dim: 0.4, badge: 'PAINTING · MAHARAJA RANJIT SINGH', k: [[0.9, 'hit', 1.1]],
  figs: [[0.2, 300, 1250, 0.68, A(BRIT, { face: 'smug', armR: 'hold', item: 'paper' })], [0.35, 800, 1250, 0.6, A(BOY, { face: 'sad', armL: 'hold', itemL: 'gem', flip: true })]], bst: [[0.9, 540, 760, 100, '1849']], f: ['TAKEN BY TREATY', 'AFTER A WAR WITH THE SIKH EMPIRE', 0.5, { size: 110 }] });
VIS[1] = fscene(1, N, { bg: 'ranjit', a: [0.5, 0.6, 1.3], dim: 0.5, k: [[0.8, 'thump', 0.9]],
  figs: [[0.2, 540, 1250, 0.66, A(BOY, { face: 'cry', armR: 'out', item: 'gem' })]], f: ['A CHILD KING', 'HAD TO HAND IT OVER', 0.4] });
VIS[2] = fscene(2, N, { bg: 'old', a: [0.5, 0.5, 1.0], b: [0.5, 0.5, 1.1], dim: 0.3, badge: 'REAL PHOTO · ITS ORIGINAL SETTING', k: [[0.9, 'scratch', 1]],
  figs: [[0.2, 380, 1250, 0.7, A(ALB, { face: 'smug', armR: 'hold', item: 'gem' })]], bst: [[0.9, 820, 780, 100, '1852']], f: ['RECUT', 'PRINCE ALBERT WANTED MORE SPARKLE'] });
VIS[3] = fscene(3, N, { bg: 'replica', a: [0.5, 0.5, 1.3], dim: 0.4, chip: 'REPLICA', k: [[0.7, 'crack', 1], [0.72, 'hit', 1.1]],
  figs: [[0.2, 760, 1250, 0.68, A(ALB, { face: 'shock', flip: true })]], bst: [[0.7, 300, 800, 120, '-45%']], f: ['191 → 105 CT', 'ABOUT 45% OF ITS WEIGHT GONE', 0.4] });
VIS[4] = fscene(4, N, { bg: 'victoria', a: [0.5, 0.35, 1.0], dim: 0.4, badge: 'PAINTING · QUEEN VICTORIA WEARING IT', k: [[0.9, 'pop', 0.8]],
  figs: [[0.2, 300, 1250, 0.66, A(CAST.king, { face: 'shock', armR: 'up', armL: 'up' })], [0.35, 800, 1250, 0.68, A(Q, { face: 'smug', armL: 'hold', itemL: 'gem', flip: true })]], bub: [[0.9, 320, 760, 'NOT FOR ME!', { tx: 300, ty: 860 }]], f: ['THE LEGEND:', 'BAD LUCK FOR MEN'] });
VIS[5] = fscene(5, N, { bg: 'crown', a: [0.5, 0.5, 1.0], b: [0.5, 0.5, 1.1], badge: 'REPLICA · THE QUEEN MOTHER\'S CROWN', k: [[0.8, 'pop', 0.8]],
  figs: [[0.2, 820, 1250, 0.62, A(CAST.police, { face: 'smug', flip: true, hat: 'helmet', hatCol: '#1E1E1E', shirt: '#8B1E1E' })]], f: ['TOWER OF LONDON', 'IN A ROYAL CROWN', 0.4, { size: 110 }] });
VIS[6] = fscene(6, N, { bg: 'jewel', a: [0.5, 0.5, 1.0], b: [0.5, 0.5, 1.1], dim: 0.4, badge: 'REAL PHOTO · JEWEL HOUSE VAULT', k: [[0.5, 'pop', 0.7], [0.7, 'pop', 0.7], [0.9, 'pop', 0.7], [1.1, 'pop', 0.7]],
  figs: [[0.3, 150, 1250, 0.5, NAT('#FF9933', 'INDIA')], [0.45, 400, 1250, 0.5, NAT('#01411C', 'PAKISTAN')], [0.6, 660, 1250, 0.5, NAT('#1E1E1E', 'AFGHANISTAN')], [0.75, 920, 1250, 0.5, NAT('#239F40', 'IRAN', { flip: true })]],
  f: ['4 COUNTRIES', 'HAVE CLAIMED IT'] });
