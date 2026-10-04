// Wiki Roulette #087 — Ötzi: two countries, one frozen man (figures style: real photo backgrounds + original cartoon cast)
const N = 8;
// cast
const OTZI = { skin: '#C99A6B', shirt: '#7A5634', pants: '#6B4A2B', shoes: '#4A3020', hat: 'fur', beard: '#3A2A1E', fur: true, seed: 1 };
const HELMUT = { shirt: '#D9442B', pants: '#3A4A5A', hat: 'cap', hatCol: '#2F7FD1', item: 'pole', seed: 2 };
const ERIKA = { shirt: '#2F7FD1', pants: '#3A4A5A', hat: 'bun', hair: '#B5813F', seed: 3 };
const AUT = { shirt: '#C8102E', pants: '#2B2B2B', hat: 'tyrol', seed: 4 };
const ITA = { shirt: '#009246', pants: '#1F2A44', hat: 'hair', hair: '#2A1A10', beard: '#2A1A10', seed: 5 };
const WORKER = { shirt: '#F28C28', pants: '#2E3A59', hat: 'hardhat', seed: 6 };
const SCI = { shirt: '#F4F4F4', pants: '#4A4A4A', hat: 'lab', seed: 7 };
const SURV = { shirt: '#2E7D32', pants: '#3A3A3A', hat: 'cap', hatCol: '#F2B705', seed: 8 };
const JUDGE = { shirt: '#1E1E1E', pants: '#1E1E1E', hat: 'hair', hair: '#BDBDBD', seed: 9 };
const OFFICIAL = { shirt: '#3B4A6B', pants: '#2B2B2B', hat: 'hair', hair: '#5A3A20', tie: '#C8102E', seed: 10 };
const figS = (t, tIn, x, y, sc, o) => fig(t, tIn, x, y - 30, sc * 1.22, o);
const A = (base, more) => Object.assign({}, base, more);
// bright photo background with a soft blur + bottom fade for captions
function bg(t, id, a, b, badge) { const P = shot(t, id, { a, b: b || a, dur: 6, anchor: [540, 900] }); if (!P) noPhoto(t);
  const gr = g.createLinearGradient(0, 1050, 0, H); gr.addColorStop(0, 'rgba(8,8,10,0)'); gr.addColorStop(1, 'rgba(8,8,10,0.55)'); g.fillStyle = gr; g.fillRect(0, 1050, W, H - 1050);
  if (badge) realBadge(t, 0.3, badge); return P; }
const dim = (a) => { g.fillStyle = `rgba(8,8,10,${a})`; g.fillRect(0, 0, W, H); };
const walkIn = (t, x0, x1, t0 = 0, d = 0.8) => lerp(x0, x1, ease(clamp((t - t0) / d)));

VIS.open = (K) => { K(0.15, 'hit', 1.3); K(0.6, 'pop', 0.8); K(1.1, 'pop', 0.8); K(1.6, 'thump', 0.8);
  return (t) => { atmosphere(t); bg(t, 'hut', [0.5, 0.5, 1.0], [0.5, 0.48, 1.08]);
    const pull = Math.sin(t * 7) * 12;
    figS(t, 0.25, 540, 1230, 0.72, A(OTZI, { frozen: true, face: 'shock', look: [0, -0.5] }));
    figS(t, 0.4, 215 + pull, 1240, 0.72, A(AUT, { face: 'angry', armR: 'out', armL: 'up', itemL: 'flagAT', tilt: -0.08 }));
    figS(t, 0.55, 865 - pull, 1240, 0.72, A(ITA, { face: 'angry', armR: 'out', armL: 'up', itemL: 'flagIT', flip: true, tilt: 0.08 }));
    bubble(t, 0.6, 260, 720, 'MINE!', { tx: 230, ty: 820, rot: -0.06 }); bubble(t, 1.1, 800, 700, 'NO, MINE!', { tx: 860, ty: 810, rot: 0.05 });
    tag(t); hook(t, EP.hook, 400); }; };

VIS[0] = (K) => { K(0.3, 'swish', 0.5); K(1.15, 'hit', 1.2); K(1.2, 'pop', 0.8);
  return (t) => { atmosphere(t); bg(t, 'glacier', [0.45, 0.5, 1.0], [0.5, 0.5, 1.1], 'REAL PHOTO · ÖTZTAL ALPS'); tag(t, 0, N);
    const shock = t > 1.15, w = t < 0.9;
    figS(t, 0, walkIn(t, -150, 190), 1240, 0.62, A(HELMUT, { walk: w, face: shock ? 'shock' : 'happy', armR: shock ? 'up' : 'down', look: [1, 0] }));
    figS(t, 0, walkIn(t, -300, 400, 0.1), 1240, 0.6, A(ERIKA, { walk: w, face: shock ? 'shock' : 'happy', armL: shock ? 'up' : 'down', armR: shock ? 'up' : 'down', look: [1, 0] }));
    figS(t, 1.1, 820, 1240, 0.66, A(OTZI, { frozen: true, face: 'sleep' }));
    burst(t, 1.2, 830, 700, 110, '!?');
    fact(t, 0.6, '1991', 'ÖTZTAL ALPS · 3,210 M UP', {}); }; };

VIS[1] = (K) => { K(0.5, 'whoosh', 0.5); for (let k = 0; k < 10; k++) K(0.8 + k * 0.09, 'tick', 0.8); K(1.6, 'crack', 1.2); K(1.62, 'hit', 1.3);
  return (t) => { atmosphere(t); bg(t, 'obelisk', [0.6, 0.5, 1.1], [0.62, 0.5, 1.2], 'REAL PHOTO · NEAR THE FIND SITE'); tag(t, 1, N);
    g.save(); g.translate(t > 0.8 && t < 1.8 ? shake(t, 0.8, 8, 1.0) : 0, 0);
    figS(t, 0.2, 320, 1240, 0.72, A(WORKER, { face: t > 1.6 ? 'shock' : 'smug', armR: 'hold', armL: 'hold', item: 'jackhammer' }));
    figS(t, 0.35, 780, 1240, 0.7, A(OTZI, { frozen: t < 1.6, face: t > 1.6 ? 'cry' : 'shock', tilt: t > 1.6 ? 0.12 : 0 }));
    g.restore(); burst(t, 1.6, 760, 720, 110, 'CRACK!', '#FF6B4A');
    fact(t, 0.6, 'JACKHAMMER.', 'HIP DAMAGED · BOW BROKEN', {}); }; };

VIS[2] = (K) => { K(0.5, 'whoosh', 0.5); K(1.0, 'riser', 0.5, 0.6); K(1.6, 'hit', 1.3);
  return (t) => { atmosphere(t); bg(t, 'museum', [0.5, 0.5, 1.15], [0.5, 0.5, 1.2]); dim(0.45);
    const P = framed(t, 'recon', 70, 700, 380, { a: [0.5, 0.3, 1.0], b: [0.5, 0.28, 1.1], dur: 5 }); tag(t, 2, N); realBadge(t, 0.3, 'REAL PHOTO · RECONSTRUCTION, MUSEUM');
    figS(t, 0.4, 760, 1240, 0.72, A(SCI, { face: t > 1.6 ? 'wow' : 'talk', armR: 'hold', item: 'magnifier', look: [-1, 0], flip: true }));
    burst(t, 1.6, 700, 720, 170, '5,300 YRS');
    fact(t, 0.6, 'STONE AGE.', 'DIED AROUND 3,250 BC', {}); }; };

VIS[3] = (K) => { K(0.5, 'whoosh', 0.5); K(0.8, 'swish', 0.6); K(1.5, 'hit', 1.2); K(1.6, 'pop', 0.8);
  return (t) => { atmosphere(t); bg(t, 'obelisk', [0.5, 0.5, 1.0], [0.5, 0.5, 1.08], 'REAL PHOTO · MARKER AT THE SITE'); tag(t, 3, N);
    // border line
    const lt = t - 0.6; if (lt > 0) { const p = easeOut(clamp(lt / 0.5)); g.save(); g.setLineDash([26, 18]); g.lineWidth = 10; g.strokeStyle = '#FFFFFF'; g.shadowColor = 'rgba(0,0,0,0.6)'; g.shadowBlur = 12;
      g.beginPath(); g.moveTo(430, 700); g.lineTo(430, 700 + 560 * p); g.stroke(); g.restore();
      chip('AUSTRIA', 250, 740, t, 0.7, { size: 30, bg: '#ED2939', fg: '#FFFFFF' }); chip('ITALY', 640, 740, t, 0.8, { size: 30, bg: '#009246', fg: '#FFFFFF' }); }
    figS(t, 0.3, 220, 1240, 0.62, A(SURV, { face: t > 1.5 ? 'shock' : 'talk', armR: 'hold', item: 'tape' }));
    figS(t, 0.4, 820, 1240, 0.6, A(OTZI, { frozen: true, face: 'smug' }));
    ruler(t, 1.5, 430, 880, 330, '92.56 M', {});
    fact(t, 0.6, '92 M', 'INSIDE ITALY', { color: '#3DDC84' }); }; };

VIS[4] = (K) => { K(0.5, 'whoosh', 0.5); K(0.9, 'pop', 0.7); K(1.4, 'coin', 0.8);
  return (t) => { atmosphere(t); bg(t, 'museum', [0.5, 0.5, 1.0], [0.5, 0.5, 1.1], 'REAL PHOTO · MUSEUM, BOLZANO'); tag(t, 4, N);
    figS(t, 0.3, 210, 1240, 0.66, A(AUT, { face: 'cry', armL: 'down', armR: 'down' }));
    figS(t, 0.5, 540, 1230, 0.6, A(OTZI, { frozen: true, face: 'happy', dx: (tt) => -Math.max(0, 1 - (tt - 0.5) / 0.8) * 200 }));
    figS(t, 0.7, 870, 1240, 0.66, A(ITA, { face: 'happy', armL: 'wave', itemL: 'flagIT', armR: 'hips', flip: true }));
    bubble(t, 1.2, 830, 720, 'GRAZIE!', { tx: 860, ty: 820 });
    fact(t, 0.6, 'BOLZANO.', 'SOUTH TYROL MUSEUM OF ARCHAEOLOGY', {}); }; };

VIS[5] = (K) => { K(0.5, 'whoosh', 0.5); K(1.0, 'swish', 0.9); K(1.35, 'hit', 1.3); K(1.37, 'crack', 0.8);
  return (t) => { atmosphere(t); bg(t, 'glacier', [0.7, 0.5, 1.05], [0.72, 0.5, 1.12]); dim(0.35); tag(t, 5, N); chip('ILLUSTRATION', 80, 360, t, 0.3, { size: 22, align: 'left', bg: 'rgba(12,11,10,0.78)', fg: GOLD });
    figS(t, 0.3, 200, 1240, 0.64, A(OTZI, { shirt: '#3A2A1E', beard: '#1E1410', face: 'evil', armL: 'out', item: 'bow', armR: 'hold', seed: 11 }));
    const hit = t > 1.35; fig(t, 0.4, 820, 1240, 0.66, A(OTZI, { face: hit ? 'shock' : 'happy', flip: true, tilt: hit ? -0.1 : 0 }));
    const al = t - 1.0; if (al > 0 && al < 0.35) { g.save(); g.translate(lerp(300, 760, al / 0.35), 960); SK = 1; item('arrow', 0, 0, t); SK = 0; item('arrow', 0, 0, t); g.restore(); }
    if (hit) { g.save(); g.translate(790, 960); g.rotate(0.15); SK = 1; item('arrow', 0, 0, t); SK = 0; item('arrow', 0, 0, t); g.restore(); }
    fact(t, 0.6, 'MURDERED.', 'ARROWHEAD IN HIS LEFT SHOULDER · FOUND 2001', { color: '#FF5A4A' }); }; };

VIS[6] = (K) => { K(0.5, 'whoosh', 0.5); for (let k = 0; k < 6; k++) K(1.0 + k * 0.2, 'tick', 0.7); K(2.3, 'hit', 1);
  return (t) => { atmosphere(t); bg(t, 'hut', [0.5, 0.5, 1.0], [0.5, 0.5, 1.08], 'REAL PHOTO · SIMILAUN HUT ON THE BORDER'); tag(t, 6, N);
    figS(t, 0.3, 240, 1240, 0.66, A(ERIKA, { face: 'angry', armR: 'fist', armL: 'hold', itemL: 'paper' }));
    figS(t, 0.45, 830, 1240, 0.66, A(JUDGE, { face: 'sleep', armR: 'hold', item: 'gavel', flip: true }));
    const yr = Math.min(2008, 1991 + Math.floor(Math.max(0, t - 0.9) * 14)); if (t > 0.9) popNum(String(yr), 540, 880, 120, yr === 2008 ? GOLD : TXT, t, 0.9, { align: 'center' });
    fact(t, 0.6, '17 YEARS', 'FIGHTING FOR A FINDER\'S REWARD', {}); }; };

VIS[7] = (K) => { K(0.5, 'whoosh', 0.5); K(0.8, 'pop', 0.8); K(1.6, 'thump', 0.9); K(4.5, 'coin', 1); K(4.55, 'hit', 1.2);
  return (t) => { atmosphere(t); bg(t, 'museum', [0.4, 0.5, 1.0], [0.42, 0.5, 1.1]); dim(0.2); tag(t, 7, N);
    const rich = t > 4.5;
    figS(t, 0.3, 790, 1240, 0.66, A(OFFICIAL, { face: rich ? 'sad' : 'smug', armR: 'hold', item: rich ? null : 'money', flip: true }));
    figS(t, 0.4, 260, 1240, 0.66, A(ERIKA, { face: rich ? 'greedy' : (t > 2.3 ? 'angry' : 'shock'), armL: rich ? 'up' : 'down', armR: rich ? 'hold' : 'down', item: rich ? 'money' : null }));
    bubble(t, 1.2, 780, 720, '€5,200?', { tx: 800, ty: 830, out: 4.4 });
    bubble(t, 2.3, 260, 720, 'NO!', { tx: 260, ty: 880, out: 4.4, bg: '#FF3B30', fg: '#FFFFFF' });
    burst(t, 4.5, 540, 760, 150, '€150,000', '#3DDC84');
    fact(t, 0.6, '2008:', 'SETTLED AFTER 17 YEARS', {}); }; };
