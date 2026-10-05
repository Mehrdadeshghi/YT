// Wiki Roulette #102 — the Maracanazo, 1950 (real photos + real crowd footage, Football's Craziest Moments #4)
// Hook technique: something already "final" — a newspaper declaring Brazil world champions before kick-off.
const N = 6, GOLDC = '#F2C230';
// reconstructed front page (labelled as reconstruction on screen)
function paper(t, tIn, x, y, w, rot) { const s = spring(t - tIn, 220, 16); if (s <= 0.001) return; const h = w * 1.3;
  g.save(); g.translate(x, y + (1 - s) * 500); g.rotate(rot * s + (1 - s) * 0.5); g.globalAlpha *= clamp(s * 2);
  g.shadowColor = 'rgba(0,0,0,0.6)'; g.shadowBlur = 50; g.shadowOffsetY = 16; g.fillStyle = '#EDE6D2'; g.fillRect(-w / 2, -h / 2, w, h); g.shadowBlur = 0; g.shadowOffsetY = 0;
  text('O MUNDO', 0, -h / 2 + 96, 'serif', w * 0.17, '#1A1714', { align: 'center' });
  g.fillStyle = '#1A1714'; g.fillRect(-w / 2 + 30, -h / 2 + 118, w - 60, 5); g.fillRect(-w / 2 + 30, -h / 2 + 130, w - 60, 2);
  text('RIO DE JANEIRO · 16 JULY 1950', 0, -h / 2 + 162, 'mono', w * 0.035, '#5A5249', { align: 'center' });
  text('THESE ARE THE', 0, -h / 2 + 250, 'disp', w * 0.1, '#1A1714', { align: 'center' }); text('WORLD CHAMPIONS', 0, -h / 2 + 330, 'disp', w * 0.1, '#1A1714', { align: 'center' });
  g.fillStyle = '#9A9284'; g.fillRect(-w / 2 + 40, -h / 2 + 370, w - 80, h * 0.36);                          // photo block
  for (let i = 0; i < 7; i++) { g.fillStyle = 'rgba(26,23,20,0.35)'; g.fillRect(-w / 2 + 40, -h / 2 + 400 + h * 0.36 + i * 26, (w - 80) * (0.55 + 0.45 * ((i * 37) % 10) / 10), 9); }
  g.restore(); }
const dim = (a) => { g.fillStyle = `rgba(8,8,10,${a})`; g.fillRect(0, 0, W, H); };

VIS.open = (K) => { K(0.1, 'hit', 1.3); K(0.25, 'paper', 1); K(0.5, 'stamp', 0.9);
  return (t) => { atmosphere(t); const P = shot(t, 'stadium50', { a: [0.5, 0.5, 1.15], b: [0.5, 0.5, 1.25], dur: 3 }); if (!P) noPhoto(t); dim(0.45); tag(t);
    hook(t, EP.hook, 400); if (EP.series) chip(EP.series, 80, 630, t, -0.3, { size: 26, align: 'left', bg: GOLD, fg: BG });
    paper(t, -0.3, 560, 1150, 620, -0.06); chip('RECONSTRUCTION · FRONT PAGE BEFORE KICK-OFF', 540, 1600, t, 0.2, { size: 22, bg: 'rgba(12,11,10,0.8)', fg: GOLD });
    lot(t, 0.4, 'eyes', 930, 760, 140); }; };

VIS[0] = vscene(0, N, { ph: 'stadium50', a: [0.5, 0.5, 1.0], b: [0.5, 0.5, 1.12], badge: 'REAL PHOTO · MARACANÃ, 1950', k: [[0.8, 'hit', 1]],
  f: ['A DRAW', 'WAS ENOUGH FOR BRAZIL'] });

VIS[1] = vscene(1, N, { ph: 'ticket', a: [0.5, 0.5, 1.0], b: [0.5, 0.5, 1.1], badge: 'REAL TICKET · BRAZIL V URUGUAY, 16 JULY 1950', k: [[0.8, 'coin', 1], [1.4, 'ding', 0.8]],
  f: ['MEDALS READY.', "EVERY PLAYER'S NAME ENGRAVED"], x: (t) => lot(t, 1.4, 'trophy', 900, 980, 160) });

VIS[2] = (K) => { K(0.5, 'whoosh', 0.5); K(1.6, 'boom', 1); K(1.62, 'hit', 1.2);
  return (t) => { atmosphere(t); if (t < 1.6) { const P = clip(t, 'fans', { a: [0.5, 0.5, 1.0], b: [0.5, 0.5, 1.05] }); if (!P) noPhoto(t); tag(t, 2, N); footBadge(t, 0.3, 'REAL FOOTAGE · A FOOTBALL CROWD TODAY (TEHRAN, 2022)'); fact(t, 0.4, '173,850', 'OFFICIAL CROWD, MARACANÃ 1950', {}); }
    else { const P = shot(t, 'friaca', { a: [0.5, 0.5, 1.0], b: [0.5, 0.5, 1.1], dur: 3 }); if (!P) noPhoto(t); flash(t, 1.6, 0.5, 0.12); tag(t, 2, N); realBadge(t, 1.6, "REAL PHOTO · FRIAÇA SCORES, 47'"); fact(t, 1.7, '1–0 BRAZIL', null, {}); lot(t, 1.8, 'fire', 900, 980, 150); } }; };

VIS[3] = (K) => { K(0.5, 'whoosh', 0.5); K(0.8, 'hit', 1); K(1.5, 'mute', 1, 0.45); K(1.95, 'boom', 1.2); K(1.97, 'crack', 1);
  return (t) => { atmosphere(t); const id = t < 1.5 ? 'schiaffino' : 'ghiggia'; const P = shot(t, id, { a: [0.5, 0.5, 1.0], b: [0.5, 0.5, 1.12], dur: 3 }); if (!P) noPhoto(t);
    tag(t, 3, N); realBadge(t, t < 1.5 ? 0.3 : 1.95, t < 1.5 ? "REAL PHOTO · SCHIAFFINO, 66'  1–1" : "REAL PHOTO · GHIGGIA, 79'  1–2");
    if (t > 1.95) { flash(t, 1.95, 0.6, 0.15); fact(t, 1.95, "1–2", 'URUGUAY LEADS', { color: '#5AA9FF' }); lot(t, 2.1, 'scream', 900, 980, 160); } else fact(t, 0.6, '1–1', null, {}); }; };

VIS[4] = (K) => { K(0.3, 'mute', 1, 1.6);
  return (t) => { atmosphere(t); const P = shot(t, 'radio', { a: [0.5, 0.5, 1.05], b: [0.5, 0.5, 1.2], dur: 4 }); if (!P) noPhoto(t);
    g.save(); g.globalCompositeOperation = 'saturation'; g.fillStyle = '#000'; g.fillRect(0, 0, W, H); g.restore(); dim(0.35);
    tag(t, 4, N); realBadge(t, 0.3, 'REAL PHOTO · FANS AT THE MARACANÃ'); fact(t, 0.6, 'SILENCE.', '“DISTURBING AND TRAUMATIC”', {}); lot(t, 1.0, 'skull', 900, 980, 140); }; };

VIS[5] = vscene(5, N, { ph: 'shirt', a: [0.5, 0.5, 1.0], b: [0.5, 0.5, 1.1], badge: "REAL PHOTO · BRAZIL'S 1950 WHITE SHIRT", k: [[0.8, 'hit', 1], [1.5, 'pop', 0.8, 900]],
  f2: ['WHITE: DROPPED.', 'YELLOW: BORN.', 'NEW SHIRT CHOSEN IN A 1953 CONTEST', 0.6] });
