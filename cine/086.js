// Wiki Roulette #086 — Elgin Marbles: stolen or saved? (debate Short, real footage + photos)
const N = 10, GRK = '#3D8BFF', UK = '#FF3B30';
const dim = (a) => { g.fillStyle = `rgba(8,8,10,${a})`; g.fillRect(0, 0, W, H); };
// a paper document that springs in; fn draws on it (origin = centre of the sheet)
function sheet(t, tIn, x, y, w, h, rot, fn) { const s = spring(t - tIn, 200, 18); if (s <= 0.001) return;
  g.save(); g.translate(x, y + (1 - s) * 300); g.rotate(rot * s + (1 - s) * 0.4); g.globalAlpha = clamp(s * 2);
  g.shadowColor = 'rgba(0,0,0,0.55)'; g.shadowBlur = 40; g.shadowOffsetY = 12; rrect(-w / 2, -h / 2, w, h, 12); g.fillStyle = PAPER; g.fill(); g.shadowBlur = 0; g.shadowOffsetY = 0;
  fn(); g.restore(); }
const lines = (x0, y0, w, n, dy, col = 'rgba(26,23,20,0.35)') => { for (let i = 0; i < n; i++) { g.fillStyle = col; g.fillRect(x0, y0 + i * dy, w * (0.6 + 0.4 * ((i * 37) % 10) / 10), 7); } };
// poll bars
function bar(t, tIn, y, pct, col, name) { const lt = t - tIn; if (lt < 0) return; const p = easeOut(clamp(lt / 0.7)), w = 820 * pct / 100 * p;
  text(name, 100, y - 18, 'mono', 30, TXT, { ls: 3 }); g.fillStyle = 'rgba(255,255,255,0.08)'; rrect(100, y, 820, 70, 14); g.fill();
  g.fillStyle = col; rrect(100, y, Math.max(28, w), 70, 14); g.fill(); text(Math.round(pct * p) + '%', 100 + Math.max(28, w) - 20, y + 52, 'disp', 50, '#FFFFFF', { align: 'right' }); }

VIS.open = vopen({ clip: 'pedi', a: [0.42, 0.55, 1.0], b: [0.5, 0.55, 1.1], foot: 'REAL FOOTAGE · BRITISH MUSEUM' });

VIS[0] = vscene(0, N, { ph: 'removal', a: [0.42, 0.5, 1.0], b: [0.45, 0.4, 1.25], badge: 'PAINTING · EDWARD DODWELL, 1801',
  co: [[0.45, 0.33, 330, 1180, 'SCULPTURES COMING DOWN', 1.6]], f2: ['ABOUT HALF', 'REMOVED.', '1801–1812', 0.6], k: [[0.6, 'hit', 1], [1.6, 'pop', 0.7]] });

VIS[1] = (K) => { K(0.5, 'whoosh', 0.5); K(0.8, 'thump', 0.9); K(1.6, 'crack', 1); K(1.62, 'hit', 1.3);
  return (t) => { atmosphere(t); shot(t, 'room1819', { a: [0.5, 0.5, 1.1], b: [0.5, 0.5, 1.15], dur: 4 }); dim(0.75);
    const P = framed(t, 'elgin', 90, 640, 330, { a: [0.5, 0.5, 1.0], b: [0.5, 0.42, 1.12], dur: 4 }); if (!P) noPhoto(t);
    tag(t, 1, N); realBadge(t, 0.3, 'LORD ELGIN · PORTRAIT, c. 1788');
    sheet(t, 0.6, 700, 900, 420, 520, 0.06, () => { text('FIRMAN', 0, -170, 'serif', 64, '#1A1714', { align: 'center' }); text('JULY 1801', 0, -120, 'mono', 26, '#5A5249', { align: 'center' }); lines(-160, -70, 320, 8, 34); });
    g.save(); g.translate(shake(t, 1.6, 14), 0); stampText('ORIGINAL NOT FOUND', 700, 960, t, 1.6, { size: 54, rot: -0.14 }); g.restore();
    fact(t, 0.6, 'THE PERMIT?', null, { y: 520, size: 130 }); }; };

VIS[2] = (K) => { K(0.5, 'whoosh', 0.5); K(0.8, 'hit', 1.1); K(1.5, 'crack', 0.9);
  return (t) => { atmosphere(t); const P = clip(t, 'a1921', { a: [0.5, 0.45, 1.0], b: [0.5, 0.45, 1.1] }); if (!P) noPhoto(t); dim(0.4);
    tag(t, 2, N); footBadge(t, 0.3, 'REAL FOOTAGE · ACROPOLIS, 1921');
    fact2(t, 0.6, 'TURKEY, 2024:', '"NO RECORD."', 'OF ANY SUCH OTTOMAN DOCUMENT', { size: 120, c2: GOLD }); }; };

VIS[3] = vscene(3, N, { ph: 'room1819', a: [0.5, 0.5, 1.0], b: [0.45, 0.5, 1.15], badge: 'PAINTING · THE ELGIN ROOM, 1819',
  f2: ['£35,000', 'SOLD, 1816.', 'PARLIAMENT VOTE: 82–30', 0.7], k: [[0.7, 'coin', 1], [0.9, 'hit', 1]] });

VIS[4] = (K) => { K(0.5, 'whoosh', 0.5); K(0.8, 'hit', 1); [1.2, 1.45, 1.7, 1.95, 2.2].forEach((x) => K(x, 'scratch', 0.6));
  return (t) => { atmosphere(t); const P = shot(t, 'horse', { a: [0.55, 0.5, 1.0], b: [0.55, 0.45, 1.2], dur: 5, anchor: [540, 900] }); if (!P) noPhoto(t);
    tag(t, 4, N); realBadge(t, 0.3, 'REAL PHOTO · HORSE OF SELENE, BRITISH MUSEUM');
    // scraping strokes across the marble
    for (let k = 0; k < 5; k++) { const lt = t - 1.2 - k * 0.25; if (lt < 0) continue; const p = easeOut(clamp(lt / 0.25)), y = 860 + k * 70, x0 = 160 + (k % 2) * 80;
      g.save(); g.strokeStyle = 'rgba(255,255,255,0.85)'; g.lineWidth = 6; g.shadowColor = 'rgba(0,0,0,0.6)'; g.shadowBlur = 8; g.beginPath(); g.moveTo(x0, y); g.lineTo(x0 + 700 * p, y - 120 * p); g.stroke(); g.restore(); }
    fact(t, 0.7, 'SCRAPED.', 'CHISELS + CARBORUNDUM · 1937–38', {});
    if (t > 2.4) chip('UP TO 2.5 MM OF SURFACE GONE', 540, 1180, t, 2.4, { size: 28, bg: RED, fg: TXT }); }; };

VIS[5] = vscene(5, N, { clip: 'acro4k', a: [0.62, 0.5, 1.0], b: [0.62, 0.48, 1.1], foot: 'REAL FOOTAGE · ATHENS',
  f2: ['GREECE ASKS', 'SINCE 1983.', 'OFFICIAL RETURN REQUEST', 0.6, { c2: GRK }] });

VIS[6] = vscene(6, N, { ph: 'cast', a: [0.45, 0.5, 1.0], b: [0.45, 0.5, 1.12], badge: 'REAL PHOTO · ACROPOLIS MUSEUM, ATHENS',
  co: [[0.45, 0.45, 520, 1180, 'PLASTER COPY', 1.6]], f2: ['WHITE CASTS', 'FOR THE GAPS.', "WHERE LONDON'S PIECES BELONG", 0.6], k: [[0.6, 'hit', 1], [1.6, 'pop', 0.7]] });

VIS[7] = (K) => { K(0.5, 'whoosh', 0.5); K(0.8, 'hit', 1); K(1.5, 'tick', 0.7); K(1.9, 'tick', 0.7);
  return (t) => { atmosphere(t); const P = clip(t, 'bm', { a: [0.5, 0.5, 1.0], b: [0.5, 0.5, 1.08] }); if (!P) noPhoto(t); dim(0.35);
    tag(t, 7, N); footBadge(t, 0.3, 'REAL FOOTAGE · BRITISH MUSEUM');
    fact2(t, 0.6, 'MUSEUM:', '"LEGAL."', null, { size: 130, c2: UK });
    const c = Math.min(6, (t - 1.4) * 6); if (t > 1.4) { panel(80, 860, 920, 260, 0.8); popNum((c >= 6 ? '6' : c.toFixed(1)) + ' MILLION', 120, 980, 96, GOLD, t, 1.4); label('VISITORS A YEAR · ATHENS MUSEUM: 1.5 M', 124, 1060, t, 1.6, { size: 26 }); } }; };

VIS[8] = (K) => { K(0.5, 'whoosh', 0.5); K(0.8, 'thump', 1); K(1.5, 'crack', 1); K(1.52, 'hit', 1.3);
  return (t) => { atmosphere(t); const P = shot(t, 'duveen', { a: [0.45, 0.5, 1.0], b: [0.45, 0.5, 1.12], dur: 5 }); if (!P) noPhoto(t); dim(0.5);
    tag(t, 8, N); realBadge(t, 0.3, 'REAL PHOTO · DUVEEN GALLERY, LONDON');
    sheet(t, 0.5, 540, 900, 560, 520, -0.04, () => { text('BRITISH MUSEUM', 0, -175, 'serif', 46, '#1A1714', { align: 'center' }); text('ACT 1963', 0, -115, 'serif', 60, '#1A1714', { align: 'center' }); lines(-210, -60, 420, 7, 36); });
    g.save(); g.translate(shake(t, 1.5, 14), 0); stampText("CAN'T GIVE AWAY", 540, 960, t, 1.5, { size: 72, rot: -0.12 }); g.restore();
    fact(t, 0.6, 'THE LAW', null, { y: 520, size: 130 }); }; };

VIS[9] = (K) => { K(0.5, 'whoosh', 0.5); K(0.8, 'hit', 1); K(1.0, 'riser', 0.4, 0.8); K(1.8, 'hit', 1.2);
  return (t) => { atmosphere(t); const P = shot(t, 'pediment', { a: [0.5, 0.5, 1.0], b: [0.52, 0.48, 1.15], dur: 6 }); if (!P) noPhoto(t); dim(0.55);
    tag(t, 9, N); chip('POLL · YOUGOV 2021 · BRITISH ADULTS', 80, 360, t, 0.3, { size: 22, align: 'left', bg: 'rgba(12,11,10,0.78)', fg: GOLD });
    fact(t, 0.6, 'BRITS SAY:', null, { y: 560, size: 130 });
    if (t > 0.9) { g.save(); g.globalAlpha = clamp((t - 0.9) / 0.2); panel(70, 660, 940, 360, 0.8); g.restore(); } bar(t, 1.0, 740, 59, GRK, 'BELONG IN GREECE'); bar(t, 1.3, 900, 18, UK, 'BELONG IN BRITAIN'); }; };
