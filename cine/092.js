// Wiki Roulette #092 — Nefertiti Bust (figures style)
const N = 7, ARCH = A(CAST.man, { shirt: '#C9B48A', pants: '#7A6A4A', hat: 'cap', hatCol: '#C9B48A', beard: '#6B4A2B', seed: 1 }), EGY = A(CAST.official, { shirt: '#FFFFFF', tie: '#C8102E', skin: '#C9905A', hair: '#1E1410', seed: 2 }), GER = A(CAST.official, { shirt: '#2B2B2B', tie: '#F2B705', seed: 3 });
VIS.open = fscene(null, N, { bg: 'bust', a: [0.5, 0.3, 1.0], b: [0.5, 0.3, 1.1], dim: 0.25, hook: true, k: [[0.15, 'hit', 1.3], [0.8, 'pop', 0.8], [1.2, 'pop', 0.8]],
  figs: [[0.3, 230, 1250, 0.64, A(EGY, { face: 'angry', armR: 'point' })], [0.4, 850, 1250, 0.64, A(GER, { face: 'smug', armL: 'hold', itemL: 'bust', flip: true })]],
  bub: [[0.8, 250, 760, 'GIVE HER BACK!', { tx: 230, ty: 860 }], [1.2, 830, 760, 'NEIN.', { tx: 850, ty: 860 }]] });
VIS[0] = fscene(0, N, { bg: 'altar', a: [0.5, 0.5, 1.0], dim: 0.35, badge: 'REAL PHOTO · ART FROM AMARNA', k: [[1.0, 'hit', 1.1]],
  figs: [[0.2, 380, 1240, 0.72, (t) => A(ARCH, { face: t > 1.0 ? 'wow' : 'talk', armR: 'hold', item: 'bust' })]], bst: [[1.0, 820, 760, 110, '1912']], f: ['FOUND IN EGYPT', 'BY A GERMAN DIG AT AMARNA'] });
VIS[1] = fscene(1, N, { bg: 'altar', a: [0.3, 0.5, 1.2], dim: 0.5, k: [[0.8, 'swish', 0.8]],
  figs: [[0.2, 260, 1250, 0.64, A(EGY, { face: 'talk', armR: 'hold', item: 'paper' })], [0.3, 820, 1240, 0.66, (t) => A(ARCH, { face: 'smug', armR: 'hold', item: 'bust', flip: true, walk: t > 1.0 })]],
  f: ['1913: THE SPLIT', 'THE BUST GOES TO GERMANY'] });
VIS[2] = fscene(2, N, { bg: 'bust2', a: [0.5, 0.35, 1.0], dim: 0.55, chip: 'EGYPT\'S CLAIM', k: [[0.9, 'crack', 1], [0.92, 'hit', 1.2]],
  figs: [[0.2, 760, 1240, 0.7, A(ARCH, { face: 'evil', armR: 'hold', item: 'paper', flip: true })]], bst: [[0.9, 300, 780, 100, 'HIDDEN?']], f: ['VALUE HIDDEN?', 'EGYPT: THE TEAM DISGUISED IT'] });
VIS[3] = fscene(3, N, { bg: 'museum', a: [0.5, 0.5, 1.0], b: [0.5, 0.5, 1.1], dim: 0.35, badge: 'REAL PHOTO · NEUES MUSEUM, BERLIN', k: [[0.8, 'pop', 0.8]],
  figs: [[0.2, 540, 1240, 0.72, A(GER, { face: 'smug', armR: 'hold', item: 'bust' })]], bst: [[0.8, 840, 760, 100, '1924']], f: ['SECRET', 'UNTIL 1924', 0.4] });
VIS[4] = fscene(4, N, { bg: 'museum', a: [0.3, 0.5, 1.2], dim: 0.45, k: [[0.6, 'pop', 0.8], [1.0, 'pop', 0.8]],
  figs: [[0.2, 280, 1250, 0.66, A(EGY, { face: 'angry', armR: 'fist' })], [0.3, 820, 1250, 0.62, A(GER, { face: 'sleep', flip: true })]],
  bub: [[0.6, 300, 760, 'BACK!', { tx: 280, ty: 860 }], [1.0, 810, 780, 'zzz', { tx: 820, ty: 860 }]], f: ['SINCE 1924', 'EGYPT KEEPS ASKING'] });
VIS[5] = fscene(5, N, { bg: 'bust', a: [0.5, 0.25, 1.2], dim: 0.6, chip: 'HISTORY · 1933', k: [[0.8, 'thump', 1]],
  x: (t) => { if (t > 0.6) { sheetText(t); } }, f: ['EVEN HITLER', 'REFUSED TO RETURN IT', 0.4] });
function sheetText(t) { const s = spring(t - 0.6, 200, 18); g.save(); g.translate(540, 980); g.scale(s, s); g.rotate(-0.04); rrect(-400, -170, 800, 340, 20); g.fillStyle = PAPER; g.fill();
  text('"I WILL NEVER', 0, -40, 'serif', 64, '#1A1714', { align: 'center' }); text('RELINQUISH THE HEAD', 0, 40, 'serif', 56, '#1A1714', { align: 'center' }); text('OF THE QUEEN."', 0, 115, 'serif', 56, '#1A1714', { align: 'center' }); g.restore(); }
VIS[6] = fscene(6, N, { bg: 'room', a: [0.5, 0.5, 1.0], b: [0.5, 0.5, 1.1], badge: 'REAL PHOTO · HER ROOM IN BERLIN', k: [[0.8, 'pop', 0.8]],
  figs: [[0.2, 220, 1250, 0.6, A(CAST.man, { face: 'wow' })], [0.3, 500, 1250, 0.6, A(CAST.woman, { face: 'happy', armR: 'up' })], [0.4, 820, 1250, 0.6, A(CAST.kid, { face: 'wow', flip: true })]],
  bst: [[0.8, 760, 760, 110, '500,000']], f: ['EVERY YEAR', 'VISITORS IN BERLIN'] });
