// Wiki Roulette #167 — OCEAN: stonefish (Synanceia). Frame 1 = a real reef photo with a stonefish hidden in it + "find the deadly fish" →
// the reveal (ring around it): most venomous fish known, looks like a rock → real footage: 13 spines × 2 venom sacs, a spine through a boot
// sole (illustration) → real photo + 24 h clock: survives out of water, stings on the beach → real market photo: eaten raw as sashimi → question.
const N167 = 4, ROCK167 = '#B9A27A';

const ill167 = (t, y = 1590) => text('ILLUSTRATION', 1000, y, 'mono', 22, 'rgba(255,255,255,0.55)', { ls: 3, align: 'right' });
function shade167(y0, y1, a) { const gr = g.createLinearGradient(0, y0, 0, y1); gr.addColorStop(0, `rgba(0,0,0,${a})`); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(0, y0, W, y1 - y0); }
// a boot sole seen from the side with a spine pushing up through it (p = 0 … 1)
function boot167(t, x, y, p) { g.save(); g.translate(x, y);
  g.fillStyle = '#6A5D52'; rrect(-300, -40, 600, 80, 34); g.fill(); g.fillStyle = '#8C7C6E'; for (let k = 0; k < 9; k++) { rrect(-270 + k * 62, 30, 40, 22, 8); g.fill(); }
  g.fillStyle = '#9A8676'; rrect(-300, -110, 330, 74, 30); g.fill();
  const h = 210 * easeOut(p); g.fillStyle = '#E8DCC4'; g.shadowColor = RED; g.shadowBlur = 20 * p;
  g.beginPath(); g.moveTo(-14, 150); g.lineTo(0, 150 - h); g.lineTo(14, 150); g.closePath(); g.fill(); g.restore(); }
// a clock face that fills once around (p = 0 … 1)
function clock167(x, y, r, p, str) { g.save(); g.fillStyle = 'rgba(8,8,10,0.75)'; g.beginPath(); g.arc(x, y, r + 16, 0, 6.283); g.fill();
  g.strokeStyle = 'rgba(255,255,255,0.18)'; g.lineWidth = 16; g.beginPath(); g.arc(x, y, r, 0, 6.283); g.stroke();
  g.strokeStyle = GOLD; g.lineCap = 'round'; g.beginPath(); g.arc(x, y, r, -Math.PI / 2, -Math.PI / 2 + 6.283 * clamp(p)); g.stroke();
  const a = -Math.PI / 2 + 6.283 * clamp(p); g.strokeStyle = TXT; g.lineWidth = 8; g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a) * r * 0.7, y + Math.sin(a) * r * 0.7); g.stroke();
  g.restore(); text(str, x, y + r + 70, 'mono', 34, TXT, { align: 'center', ls: 3 }); }

// ---------- scenes ----------
VIS.open = (K) => { const fi = sw('find', 1.6); K(0.15, 'hit', 1.2); K(0.2, 'mute', 1, 0.4); K(fi, 'sonar', 0.9);
  return (t) => { atmosphere(t); shot(t, 'hide', { a: [0.46, 0.5, 1.0], b: [0.46, 0.5, 1.06], dur: 3, anchor: [540, 1000] });
    shade167(0, 760, 0.85); tag(t); hook(t, EP.hook, 440);
    if (t > fi) chip('🔍 CAN YOU SPOT IT?', 540, 1420, t, fi, { size: 40, bg: GOLD, fg: BG });
    realBadge(t, 0.3, 'REAL PHOTO · SEA OF OMAN', 1500); }; };

VIS[0] = S(() => { const th = sw('there', 0.4), ve = sw('venomous', 1.6), ro = sw('rock', 3.6);
  return vscene(0, N167, { ph: 'hide', o: { box: [40, 720, 1000, 720] }, a: [0.46, 0.49, 1.0], b: [0.46, 0.5, 1.12], dur: 3, badge: 'REAL PHOTO · SEA OF OMAN',
    f2: ['MOST VENOMOUS', 'FISH KNOWN', null, ve, { y: 520, size: 100 }], k: [[th, 'hit', 1.1], [ve, 'boom', 0.9], [ro, 'thump', 0.9]],
    x: (t, P) => { if (!P) return; const [x, y] = P(0.46, 0.49), r = Math.min(300, 0.85 * Math.abs(P(0.7, 0.49)[0] - x)); ring(t, th, x, y, r, { color: RED, spot: false });
      if (t > th) chip('STONEFISH', x, y + r + 10 > 1400 ? 1400 : y + r + 10, t, th + 0.1, { size: 44, bg: RED, fg: '#FFF' });
      if (t > ro) chip('🪨 LOOKS LIKE A ROCK', 540, 1480, t, ro, { size: 40, bg: ROCK167, fg: BG }); } }); });

VIS[1] = S(() => { const th = sw('thirteen', 0.5), ve = sw('venom', 2.0), bo = sw('boot', 3.8);
  return (K) => { ks(K, [[0.1, 'whoosh', 0.8], [th, 'hit', 1], [ve, 'pop', 0.9], [bo, 'crack', 1.1]]);
    return (t) => { atmosphere(t); clip(t, 'swim', { box: [40, 720, 1000, 540], a: [0.45, 0.4, 1.0], b: [0.45, 0.35, 1.12], dur: 4 });
      tag(t, 1, N167); footBadge(t, 0.3, 'REAL FOOTAGE · REEF STONEFISH', 360);
      fact2(t, th, '13 SPINES', '× 2 VENOM SACS', null, { y: 520, size: 100 });
      if (t > bo - 0.3) { boot167(t, 540, 1400, clamp((t - bo) / 0.35)); ill167(t, 1560); }
      if (t > bo + 0.2) chip('PIERCES BOOT SOLES', 540, 1300, t, bo + 0.2, { size: 38, bg: RED, fg: '#FFF' }); }; }; });

VIS[2] = S(() => { const tw = sw('twenty', 1.6), be = sw('beach', 3.8);
  return vscene(2, N167, { ph: 'noaa1', o: { box: [40, 720, 1000, 700] }, a: [0.42, 0.5, 1.0], b: [0.45, 0.5, 1.15], dur: 4, badge: 'REAL PHOTO · NOAA, GUAM',
    f2: ['OUT OF WATER', 'UP TO 24 HOURS', null, tw, { y: 520, size: 100 }], k: [[0.3, 'whoosh', 0.7], [tw, 'ding', 1], [be, 'hit', 1]],
    x: (t, P) => { if (t > tw) clock167(860, 1250, 80, (t - tw) / 1.4, '24 H');
      if (t > be) chip('⚠ STINGS ON THE BEACH', 540, 1480, t, be, { size: 40, bg: RED, fg: '#FFF' }); } }); });

VIS[3] = S(() => { const ea = sw('eat', 1.0), ra = sw('raw', 1.8), fi = sw('fin', 3.4), ha = sw('harmless', 3.9);
  return vscene(3, N167, { ph: 'market', o: { box: [40, 720, 1000, 720] }, a: [0.62, 0.48, 1.0], b: [0.64, 0.52, 1.15], dur: 4, badge: 'REAL PHOTO · FISH MARKET, HONG KONG',
    f2: ['EATEN RAW', 'AS SASHIMI', null, ra, { y: 520, size: 100 }], k: [[ea, 'pop', 0.9], [ra, 'hit', 1], [fi, 'swish', 1], [ha, 'ding', 1]],
    x: (t, P) => { if (!P) return; if (t > ea) callout(t, ea, P(0.6, 0.45), 300, 800, 'STONEFISH FOR SALE', { bg: ROCK167 });
      if (t > fi) chip('✂ SPINY FIN OFF = HARMLESS', 540, 1350, t, fi, { size: 38, bg: GOLD, fg: BG }); } }); });
