// Wiki Roulette #188 — WHY? #3: why do zebras have stripes? (series kit: cine/why.js)
// Frame 1 = WHY? badge + question over a plain horse vs a zebra (real photos) → IDEA 1 camouflage? zebras graze in the open, lions
// can't see the stripes from far away → BUSTED (real photos: herd on open plain, lioness near zebras) → IDEA 2 keeping cool? the barrel
// test: water barrels in horse / zebra / cow hide, no difference (illustration) → BEST EVIDENCE: biting flies (real photo: horse fly
// biting a horse; horse in a zebra coat) → comment card + "your next why".
const N188 = 3;

// "IDEA n" / "BEST EVIDENCE" chip + one big title line (same layout as whyReason, own chip text)
function idea188(t, tIn, chipStr, title, o = {}) {
  chip(chipStr, 80, 440, t, tIn, { size: 34, align: 'left', bg: o.bg || TXT, fg: o.fg || BG });
  rgbPop(title, 80, 580, fit(title, 'disp', 120, 920), o.color || GOLD, t, tIn + 0.15);
}
const ill188 = (str, y) => text(str, 1010, y, 'mono', 22, 'rgba(255,255,255,0.6)', { ls: 3, align: 'right' });

// one water barrel wrapped in a hide (k: 0 horse brown, 1 zebra stripes, 2 cow patches) with a thermometer; pops in at tIn
function barrel188(t, tIn, cx, cy, k, lvl, name) {
  const s = spring(t - tIn, 260, 16); if (s <= 0.001) return; const w = 200, h = 250;
  g.save(); g.translate(cx, cy); g.scale(s, s);
  g.save(); rrect(-w / 2, -h / 2, w, h, 26); g.clip();
  g.fillStyle = k === 0 ? '#7A4A2A' : '#F2EFE8'; g.fillRect(-w / 2, -h / 2, w, h);
  g.fillStyle = '#141311';
  if (k === 1) for (let i = -6; i < 7; i++) { g.beginPath(); g.moveTo(-w / 2 + i * 34, -h / 2); g.lineTo(-w / 2 + i * 34 + 16, -h / 2);
    g.lineTo(-w / 2 + i * 34 + 46, h / 2); g.lineTo(-w / 2 + i * 34 + 30, h / 2); g.fill(); }
  if (k === 2) [[-50, -60, 44], [40, 10, 52], [-30, 80, 34], [70, -90, 28]].forEach(([x, y, r]) => { g.beginPath(); g.ellipse(x, y, r, r * 0.75, 0.4, 0, 6.283); g.fill(); });
  g.fillStyle = 'rgba(255,255,255,0.12)'; [-h / 4, h / 4].forEach((y) => g.fillRect(-w / 2, y - 7, w, 14));   // metal hoops
  g.restore(); g.lineWidth = 4; g.strokeStyle = 'rgba(255,255,255,0.35)'; rrect(-w / 2, -h / 2, w, h, 26); g.stroke();
  // thermometer: all three end at the same level
  const tx = w / 2 + 26, th = 200, f = lvl * easeOut((t - tIn - 0.3) / 1.2);
  g.fillStyle = 'rgba(255,255,255,0.18)'; rrect(tx - 9, -th / 2, 18, th, 9); g.fill();
  g.fillStyle = RED; rrect(tx - 6, th / 2 - th * f, 12, th * f, 6); g.fill(); g.beginPath(); g.arc(tx, th / 2 + 8, 16, 0, 6.283); g.fill();
  g.restore();
  label(name, cx, cy + h / 2 + 52, t, tIn + 0.2, { size: 28, align: 'center', color: TXT, ls: 4 });
}

// ---------- scenes ----------
VIS.open = (K) => { K(0.15, 'hit', 1.3); K(0.2, 'mute', 1, 0.4); const ho = sw('horses', 0.3), ze = sw('zebras', 1.1), wh = sw('why', 2.0);
  K(ze, 'pop', 1); K(wh, 'thump', 1);
  return (t) => { atmosphere(t);
    whyPair(t, { id: 'horse', label: 'HORSE', at: ho, a: [0.5, 0.5, 1.0], b: [0.5, 0.5, 1.06] },
               { id: 'zebra', label: 'ZEBRA', at: ze, a: [0.5, 0.45, 1.0], b: [0.5, 0.42, 1.12] }, 790, 1570, { cols: true }); tag(t);
    whyBadge(t, -0.4, 80, 345); whyQ(t, -0.5, EP_RAW.why.q, 625, { size: 104 }); }; };   // badge + question fully drawn on frame 1

VIS[0] = S(() => { const op = sw('open', 2.0), li = sw('lions', 2.8), fa = sw('far', 4.0);
  return (K) => { ks(K, [[0.1, 'whoosh', 0.8], [0.4, 'tick', 1], [sw('but', 1.6), 'thump', 0.9], [op, 'tick', 1], [li, 'hit', 1], [fa, 'hit', 1.2]]);
    return (t) => { atmosphere(t);
      whyPair(t, { id: 'open2', label: 'OPEN PLAINS, MAASAI MARA', at: op, a: [0.7, 0.72, 1.0], b: [0.74, 0.74, 1.12] },
                 { id: 'lion', label: 'LIONESS ON THE HUNT', at: li, a: [0.55, 0.6, 1.0], b: [0.57, 0.62, 1.12] }); tag(t, 0, N188);
      idea188(t, 0.1, 'IDEA 1', 'CAMOUFLAGE?');
      if (t > fa) stampText('BUSTED', 540, 1070, t, fa, { size: 110, rot: -0.12 }); }; }; });

VIS[1] = S(() => { const ba = 0.3, sk = Math.min(sw('zebra', 2.2), 0.6), di = sw('difference', 3.6);
  return (K) => { ks(K, [[0.1, 'whoosh', 0.8], [0.4, 'tick', 1], [ba, 'pop', 1], [ba + 0.15, 'pop', 1], [ba + 0.3, 'pop', 1], [di, 'hit', 1.2]]);
    return (t) => { atmosphere(t);
      const P = shot(t, 'zclose', { box: [40, 690, 1000, 300], a: [0.5, 0.5, 1.0], b: [0.55, 0.5, 1.12], dur: 5 }); if (!P) noPhoto(t); tag(t, 1, N188);
      text('● REAL PHOTO', 1010, 740, 'mono', 22, 'rgba(255,255,255,0.85)', { ls: 2, align: 'right', shadow: true });
      panel(40, 1010, 1000, 470, 0.82);
      barrel188(t, ba, 230, 1190, 0, 0.62, 'HORSE');
      barrel188(t, sk, 520, 1190, 1, 0.62, 'ZEBRA');
      barrel188(t, ba + 0.3, 810, 1190, 2, 0.62, 'COW');
      ill188('ILLUSTRATION · THE 2018 BARREL TEST', 1460);
      idea188(t, 0.1, 'IDEA 2', 'KEEPING COOL?');
      if (t > di) stampText('NO DIFFERENCE', 540, 850, t, di, { size: 80, rot: -0.1 }); }; }; });

VIS[2] = S(() => { const bi = sw('biting', 1.0), de = sw('deadly', 2.2), co = sw('coat', 3.6), st = sw('stop', 4.4), gu = sw('guess', 6.0), nx = sw('next', 7.2);
  return (K) => { ks(K, [[0.1, 'whoosh', 0.8], [bi, 'hit', 1.2], [de, 'thump', 1], [co, 'pop', 1], [st, 'ding', 1.1], [nx, 'pop', 0.9]]);
    return (t) => { atmosphere(t);
      whyPair(t, { id: 'flyhorse', label: 'HORSE FLY BITING A HORSE', at: bi, a: [0.6, 0.72, 1.0], b: [0.62, 0.72, 1.15] },
                 { id: 'coat', label: 'HORSE IN A ZEBRA COAT', at: co, a: [0.55, 0.38, 1.0], b: [0.6, 0.38, 1.1] }); tag(t, 2, N188);
      idea188(t, 0.1, 'BEST EVIDENCE', 'BITING FLIES.', { bg: GOLD, fg: BG });
      if (t > de && t < co) chip('DEADLY HORSE DISEASES', 540, 1060, t, de, { size: 36, bg: RED, fg: '#FFF' });
      if (t > st && t < gu) stampText('FLIES STOP LANDING', 540, 1300, t, st, { size: 70, rot: -0.08, color: GOLD });
      whyNext(t, nx, undefined, 1340); }; }; });
