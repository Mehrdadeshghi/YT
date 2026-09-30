// Wiki Roulette #026 — Dord: bespoke CINE visuals
const INKD = '#1A1714', GREYL = '#CFC6B5', PEN = '#C2362B';
function dictPage(t, hl = 1, o = {}) {           // a dictionary page with "dord" highlighted
  const words = [['dorado', 0], ['Dorcas', 0], ['dord', 1], ['dore', 0], ['dorhawk', 0]];
  words.forEach(([w, isD], i) => { const y = -170 + i * 80;
    if (isD && hl > 0) { g.fillStyle = `rgba(255,194,61,${0.55 * hl})`; g.fillRect(-340, y - 40, 250 * clamp(hl * 1.5), 54); }
    text(w, -330, y, 'serif', 42, INKD); g.fillStyle = GREYL; g.fillRect(-150, y - 18, 480 - (i % 3) * 70, 9); g.fillRect(-330, y + 12, 600 - (i % 2) * 120, 9); });
}
// ---- OPEN
VIS.open = (K) => {
  K(2.6, 'swish', 0.5);
  return (t) => {
    atmosphere(t, { x: 540, y: 1100, r: 800, c: 'rgba(255,194,61,0.12)' }); tag(t); hook(t, EP.hook, 500);
    g.save(); paper(540, 1080 + Math.sin(t * 0.9) * 5, 800, 480, -0.035 + Math.sin(t * 0.6) * 0.005);
    text("WEBSTER'S NEW INTERNATIONAL DICTIONARY · 2ND ED.", 0, -206, 'mono', 16, '#7A7266', { align: 'center', ls: 2 });
    dictPage(t, 1); g.restore();
  };
};
// ---- 0: the word and its meaning
VIS[0] = (K) => {
  K(0.5, 'thump', 0.8); for (let i = 0; i < 24; i++) K(1.6 + i * 0.035, 'type', 0.35);
  return (t) => {
    atmosphere(t, { x: 540, y: 800, r: 800, c: 'rgba(255,194,61,0.10)' }); tag(t, 0, 5);
    popNum('dord', 540, 800, 330, GOLD, t, 0.45, { fam: 'serif', align: 'center' });
    label('(dôrd), n.', 540, 900, t, 0.9, { align: 'center', size: 40, ls: 2, color: DIM });
    typed('Physics & Chem. Density.', 170, 1040, 'serif', 64, TXT, t, 1.6, 0.85);
  };
};
// ---- 1: the 1931 slip
VIS[1] = (K) => {
  K(0.5, 'pop', 0.7, 500); K(1.3, 'swish', 0.6); for (let i = 0; i < 21; i++) K(2.8 + i * 0.07, 'type', 0.5); K(4.4, 'scratch', 0.6);
  return (t) => {
    atmosphere(t); tag(t, 1, 5);
    popNum('1931', 80, 540, 200, TXT, t, 0.45); label('JULY 31 · A NOTE FROM AUSTIN M. PATTERSON', 84, 600, t, 1.0, { size: 24, ls: 3, color: DIM });
    const s = spring(t - 1.3, 170, 20); if (s <= 0) return;
    g.save(); g.translate(0, (1 - s) * 500); paper(540, 900, 860, 420, 0.02, '#F3EEE2');
    g.strokeStyle = 'rgba(80,120,200,0.35)'; g.lineWidth = 2; for (let y = -120; y <= 180; y += 60) { g.beginPath(); g.moveTo(-420, y); g.lineTo(420, y); g.stroke(); }
    g.strokeStyle = 'rgba(200,60,60,0.5)'; g.beginPath(); g.moveTo(-340, -210); g.lineTo(-340, 210); g.stroke();
    typed('D or d, cont./density', -310, 20, 'mono', 50, INKD, t, 2.8, 1.5);
    const c = clamp((t - 4.4) / 0.4); if (c > 0) { g.strokeStyle = GOLD; g.lineWidth = 7; g.beginPath(); g.ellipse(-218, 0, 125, 52, -0.04, -1.2, -1.2 + 6.283 * c); g.stroke(); }
    g.restore();
  };
};
// ---- 2: headwords were typed with spaces
VIS[2] = (K) => {
  for (let i = 0; i < 7; i++) K(1.2 + i * 0.16, 'type', 0.5); [3.35, 3.7, 4.05, 4.4].forEach((a) => { K(a, 'type', 1.2); K(a, 'thump', 0.4); });
  return (t) => {
    atmosphere(t); tag(t, 2, 5);
    rise('HEADWORDS WERE TYPED', 80, 480, 'mono', 40, TXT, t, 0.5, { stagger: 0.04 }); rise('WITH SPACES:', 80, 540, 'mono', 40, GOLD, t, 0.7, { stagger: 0.04 });
    const ex = 'd e n s i t y'; typed(ex, 80, 680, 'mono', 64, DIM, t, 1.2, 1.1);
    ['D', 'o', 'r', 'd'].forEach((ch, i) => { const at = 3.35 + i * 0.35, s = spring(t - at, 500, 22); if (s <= 0) return;
      g.save(); g.translate(170 + i * 220, 1010 + (1 - s) * -60); g.scale(s, s); text(ch, 0, 0, 'mono', 230, TXT, { align: 'center', shadow: true }); g.restore(); });
  };
};
// ---- 3: "D or d" becomes "dord"
VIS[3] = (K) => {
  K(1.0, 'swish', 0.7); K(1.85, 'pop', 1, 900); K(2.9, 'scratch'); K(2.92, 'thump', 1.2);
  return (t) => {
    atmosphere(t, { x: 540, y: 800, r: 800, c: 'rgba(255,194,61,0.10)' }); tag(t, 3, 5);
    const p = ease((t - 1.0) / 0.8), low = spring(t - 1.85, 300, 18);
    const glyphs = [['D', 0], [' ', 1], ['o', 2], ['r', 3], [' ', 4], ['d', 5]], S = 190;
    g.save(); g.font = F.serif(S); const sp = g.measureText(' ').width, wD = g.measureText('D').width;
    let x = 540 - (g.measureText('D or d').width * (1 - p) + g.measureText(low > 0.5 ? 'dord' : 'Dord').width * p) / 2;
    glyphs.forEach(([ch]) => { if (ch === ' ') { x += sp * (1 - p); return; }
      const c = ch === 'D' && low > 0.5 ? 'd' : ch; text(c, x, 820, 'serif', S, low > 0.5 ? GOLD : TXT, { shadow: true }); g.font = F.serif(S); x += g.measureText(c).width; });
    g.restore();
    label('"D or d"  →  "dord"', 540, 920, t, 2.0, { align: 'center', size: 34, ls: 2, color: DIM });
    stampText('PRINTED · 1934', 540, 1120, t, 2.9, { size: 76, rot: -0.07, color: GOLD });
  };
};
// ---- 4: 1939, no origin — struck out by 1947
VIS[4] = (K) => {
  K(0.5, 'pop', 0.8, 600); K(1.8, 'riser', 0.4, 1.2); K(3.2, 'scratch'); K(3.22, 'thump', 1.1); K(4.8, 'scratch', 0.9); K(5.1, 'pop', 0.8, 700); K(6.4, 'whoosh', 0.6);
  return (t) => {
    atmosphere(t); tag(t, 4, 5);
    const yr = t < 4.7 ? '1939' : '1947';
    popNum(yr, 80, 520, 200, t < 4.7 ? TXT : RED, t, t < 4.7 ? 0.45 : 4.8);
    const fade = 1 - clamp((t - 6.05) / 0.35), s = spring(t - 0.6, 170, 20);
    if (s > 0 && fade > 0) { g.save(); g.globalAlpha = fade; g.translate(0, (1 - s) * 400); paper(540, 860, 860, 420, -0.02);
      text('dord', -360, -60, 'serif', 110, INKD); text('(dôrd), n. Physics & Chem. Density.', -360, 20, 'serif', 36, INKD);
      text('ORIGIN:', -360, 120, 'mono', 34, '#7A7266', { ls: 4 }); if (t > 1.8) text('— ? —', -170, 120, 'mono', 40, RED, { alpha: (t - 1.8) * 3 });
      const k = clamp((t - 4.8) / 0.4); if (k > 0) { g.strokeStyle = PEN; g.lineWidth = 12; g.lineCap = 'round'; g.beginPath(); g.moveTo(-380, -90); g.lineTo(-380 + 760 * k, -90 + 150 * k * 0.3); g.stroke(); }
      g.restore(); }
    if (fade > 0) { g.save(); g.globalAlpha = fade; stampText('NO ORIGIN', 760, 1100, t, 3.2, { size: 70, rot: -0.12 }); g.restore(); }
    if (t > 6.4) { rise('THE WORD', 80, 820, 'disp', 150, TXT, t, 6.4); rise('THAT NEVER', 80, 970, 'disp', fit('THAT NEVER', 'disp', 150, 920), TXT, t, 6.55); rise('WAS.', 80, 1120, 'disp', 150, GOLD, t, 6.7); }
  };
};
