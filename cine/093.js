// Wiki Roulette #093 — Mona Lisa theft (figures style)
const N = 7, PER = A(CAST.man, { shirt: '#F4F4F4', pants: '#3A3A3A', hat: 'hair', hair: '#1E1410', beard: '#1E1410', seed: 1 }), GUARD = A(CAST.police, { seed: 2 }), PIC = A(CAST.man, { shirt: '#1F2A44', hat: 'beret', hatCol: '#1E1E1E', seed: 3 });
VIS.open = fscene(null, N, { bg: 'mona', a: [0.5, 0.35, 1.0], b: [0.5, 0.35, 1.1], dim: 0.2, hook: true, k: [[0.15, 'hit', 1.3], [0.9, 'swish', 0.8]],
  figs: [[0.3, 540, 1250, 0.7, (t) => A(PER, { face: 'smug', armR: 'hold', item: 'frame', walk: t > 0.9, dx: (tt) => Math.max(0, tt - 0.9) * 260 })]] });
VIS[0] = fscene(0, N, { bg: 'salon', a: [0.5, 0.5, 1.0], b: [0.5, 0.5, 1.1], badge: 'PAINTING · THE SALON CARRÉ, LOUVRE', k: [[1.0, 'hit', 1]],
  figs: [[0.2, 0, 1250, 0.68, (t) => A(PER, { walk: t < 1.2, face: 'smug', dx: (tt) => lerp(-100, 440, ease(clamp(tt / 1.2))) })]], bst: [[1.0, 820, 760, 110, '21.08.1911']], f: ['THE LOUVRE', 'VINCENZO PERUGGIA WALKS IN'] });
VIS[1] = fscene(1, N, { bg: 'peru', a: [0.5, 0.4, 1.0], dim: 0.5, badge: 'REAL PHOTO · PERUGGIA\'S MUGSHOT', k: [[0.8, 'pop', 0.8]],
  figs: [[0.2, 300, 1250, 0.68, A(PER, { face: 'happy', armL: 'wave' })], [0.3, 820, 1250, 0.64, A(GUARD, { face: 'sleep', flip: true })]], bub: [[0.8, 320, 760, 'JUST A WORKER!', { tx: 300, ty: 860 }]], f: ['WHITE SMOCK.', 'NOBODY STOPPED HIM'] });
VIS[2] = fscene(2, N, { bg: 'salon', a: [0.3, 0.5, 1.3], dim: 0.4, k: [[0.6, 'swish', 0.9]],
  figs: [[0.1, 540, 1250, 0.72, (t) => A(PER, { face: 'evil', armR: 'hold', item: 'frame', walk: true, dx: (tt) => tt * 300 })]], f: ['OFF THE WALL.', 'OUT THE DOOR.', 0.4] });
VIS[3] = fscene(3, N, { bg: 'salon', a: [0.7, 0.5, 1.3], dim: 0.5, k: [[0.9, 'crack', 1], [0.92, 'hit', 1.2]],
  figs: [[0.2, 300, 1250, 0.66, A(GUARD, { face: 'angry', armR: 'point' })], [0.4, 800, 1250, 0.66, A(PIC, { face: 'shock', armL: 'up', armR: 'up', flip: true })]], bst: [[0.9, 800, 760, 100, 'ME?!']], f: ['SUSPECT: PICASSO', 'POLICE QUESTIONED HIM'] });
VIS[4] = fscene(4, N, { bg: 'empty', a: [0.5, 0.45, 1.0], b: [0.5, 0.45, 1.1], dim: 0.25, badge: 'REAL PHOTO · THE EMPTY WALL, 1911', k: [[0.7, 'pop', 0.8]],
  figs: [[0.2, 220, 1250, 0.58, A(CAST.man, { face: 'wow' })], [0.3, 540, 1250, 0.58, A(CAST.woman, { face: 'wow' })], [0.4, 860, 1250, 0.58, A(CAST.kid, { face: 'shock', flip: true })]], f: ['CROWDS CAME', 'TO SEE... NOTHING', 0.4] });
VIS[5] = fscene(5, N, { bg: 'uffizi', a: [0.5, 0.45, 1.0], b: [0.5, 0.45, 1.1], dim: 0.3, badge: 'REAL PHOTO · RECOVERED, FLORENCE 1913', k: [[0.9, 'hit', 1.1]],
  figs: [[0.2, 280, 1250, 0.66, A(PER, { face: 'shock', armR: 'up', armL: 'up' })], [0.4, 800, 1250, 0.66, A(GUARD, { face: 'smug', flip: true, armL: 'point' })]], bst: [[0.9, 540, 760, 110, 'CAUGHT!']], f: ['1913, FLORENCE', 'HE TRIED TO SELL IT'] });
VIS[6] = fscene(6, N, { bg: 'mona', a: [0.5, 0.4, 1.2], dim: 0.45, k: [[0.8, 'pop', 0.8]],
  figs: [[0.2, 540, 1250, 0.72, A(PER, { face: 'happy', armR: 'out', item: 'sign:ITALIA!' })]], bst: [[0.8, 850, 760, 100, '7 MONTHS']], f: ['HIS MOTIVE:', '"IT BELONGS TO ITALY"'] });
