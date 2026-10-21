// Wiki Roulette #179 — FOOTBALL: Leicester City win the 2015–16 Premier League at 5000–1.
// Real photos from that season (trophy lift 7 May 2016, Vardy on the opening day, Leicester v West Ham April 2016, title party);
// the sponsor boards and banners in them are blurred out. Table months, odds slip, 11-game streak, W/D/L strip = GRAPHIC.
// Retention: frame-1 "5000 to 1. They won." → bottom for 4½ months the season before → 5000/1 slip → Vardy 11 in a row →
// 23 W / 3 L / 81 pts → 2 May 2016: Chelsea 2–2 Tottenham → CHAMPIONS → question.
const N179 = 4, LEI179 = '#2E6BE6', GRN179 = '#3DDC84';
const sw179 = (qs, d, k = 0) => { for (const q of qs) { const v = sw(q, -99, k); if (v !== -99) return v; } return d; };
const gfx179 = () => text('GRAPHIC', 1000, 1470, 'mono', 22, 'rgba(255,255,255,0.55)', { ls: 3, align: 'right' });
// photo in a rounded box; rects [u0,v0,u1,v1] (fractions of the photo) are blurred away (boards, crests, kit sponsors)
function pic179(t, id, box, a, b, rects, dur = 4) {
  const P = shot(t, id, { box, a, b, dur }); if (!P || !rects) return P; const im = PHOTOS[id], [ix, iy] = P(0, 0), [jx, jy] = P(1, 1);
  g.save(); rrect(box[0], box[1], box[2], box[3], 30); g.clip();
  for (const [u0, v0, u1, v1] of rects) { const [x0, y0] = P(u0, v0), [x1, y1] = P(u1, v1);
    g.save(); g.beginPath(); g.rect(x0, y0, x1 - x0, y1 - y0); g.clip(); g.filter = 'blur(22px)'; g.drawImage(im, ix, iy, jx - ix, jy - iy); g.filter = 'none';
    g.fillStyle = 'rgba(8,8,10,0.3)'; g.fillRect(x0, y0, x1 - x0, y1 - y0); g.restore(); }
  g.restore(); return P; }
const TROPH179 = [[0, 0.09, 0.72, 0.34], [0.71, 0.09, 1, 0.23], [0, 0.66, 1, 0.9], [0.6, 0.58, 0.68, 0.78]];
const WHU179 = [[0, 0.39, 1, 0.53], [0.8, 0.13, 1, 0.31], [0, 0.17, 0.2, 0.3]];
const CELEB179 = [[0.33, 0.82, 0.47, 1]];

VIS.open = (K) => { K(0.15, 'hit', 1.3); K(0.2, 'mute', 1, 0.4); const wo = sw179(['won'], 1.6); K(wo, 'boom', 1.1);
  return (t) => { atmosphere(t); pic179(t, 'troph', [40, 840, 1000, 600], [0.57, 0.4, 1.25], [0.57, 0.4, 1.45], TROPH179, 3);
    tag(t); hook(t, EP.hook, 480); realBadge(t, 0.3, 'REAL PHOTO · LEICESTER LIFT THE TROPHY · 2016', 1490);
    if (t > wo) stampText('CHAMPIONS', 540, 1360, t, wo, { size: 100, rot: -0.06, color: GOLD }); }; };

// the season before (2014–15): last place for four and a half months, late November → mid-April
VIS[0] = S(() => { const bo = sw179(['bottom'], 2.0), mo = sw179(['months'], 1.4), le = sw179(['lester', 'leicester'], 0.1);
  return (K) => { ks(K, [[0.2, 'whoosh', 0.8], [le, 'hit', 0.9], [mo, 'tick', 1], [bo, 'wrong', 1.1], [bo + 0.05, 'hit', 1]]);
    return (t) => { atmosphere(t); if (PHOTOS.stad) g.drawImage(blurOf('stad'), 0, 0, W, H); dimAll(0.35); tag(t, 0, N179);
      chip('THE SEASON BEFORE · 2014–15', 540, 470, t, le, { size: 36, bg: GOLD, fg: BG });
      // table: the bottom four rows, Leicester last
      panel(90, 560, 900, 470, 0.9); text('PREMIER LEAGUE TABLE', 540, 625, 'mono', 30, 'rgba(255,255,255,0.6)', { align: 'center', ls: 4 });
      [17, 18, 19, 20].forEach((pos, k) => { const y = 680 + k * 85, me = pos === 20, s = spring(t - (le + 0.08 * k), 260, 18);
        if (s <= 0) return; g.save(); g.globalAlpha *= clamp(s * 1.5); rrect(130, y, 820, 70, 14); g.fillStyle = me ? (t > bo && Math.floor((t - bo) * 6) % 2 ? RED : 'rgba(255,59,48,0.75)') : 'rgba(255,255,255,0.06)'; g.fill();
        text(`${pos}`, 170, y + 48, 'mono', 36, me ? '#FFF' : 'rgba(255,255,255,0.45)'); text(me ? 'LEICESTER CITY' : '· · ·', 260, y + 50, 'ui', 40, me ? '#FFF' : 'rgba(255,255,255,0.3)'); g.restore(); });
      // months bar: late Nov → mid-April, red
      const M = ['NOV', 'DEC', 'JAN', 'FEB', 'MAR', 'APR'], x0 = 120, mw = 140, y = 1130; panel(90, 1060, 900, 230, 0.9);
      M.forEach((m, k) => text(m, x0 + 70 + k * mw, y + 120, 'mono', 30, 'rgba(255,255,255,0.65)', { align: 'center' }));
      if (t > mo) { const p = easeOut((t - mo) / 0.9); rrect(x0 + 100, y, (4.5 * mw) * p, 50, 14); g.fillStyle = RED; g.fill();
        if (p > 0.8) text('BOTTOM · 4½ MONTHS', 540, y + 36, 'ui', 34, '#FFF', { align: 'center' }); }
      if (t > bo) stampText('LAST PLACE', 540, 1380, t, bo, { size: 70, rot: -0.05, color: RED });
      gfx179(); }; }; });

// 5000/1 slip, then Vardy: a goal in 11 games in a row (Premier League record)
VIS[1] = S(() => { const bk = sw179(['bookmakers'], 0.1), on = sw179(['one'], 1.6), va = sw179(['vardy'], 2.4), el = sw179(['eleven'], va + 1.0), rc = sw179(['record'], el + 1.2);
  return (K) => { ks(K, [[0.2, 'whoosh', 0.8], [on, 'boom', 1.1], [va, 'whoosh', 0.9], ...Array.from({ length: 11 }, (_, k) => [lerp(va + 0.2, el + 0.15, k / 10), 'pop', 0.55]), [rc, 'hit', 1.2]]);
    return (t) => { atmosphere(t); tag(t, 1, N179);
      if (t < va) { if (PHOTOS.stad) g.drawImage(blurOf('stad'), 0, 0, W, H); dimAll(0.3);
        const s = spring(t - bk, 220, 18); g.save(); g.translate(540, 900 + (1 - s) * 400); g.rotate(-0.04); g.globalAlpha *= clamp(s * 2);
        rrect(-400, -330, 800, 660, 24); g.fillStyle = '#F3EFE4'; g.fill(); g.lineWidth = 4; g.setLineDash([14, 10]); g.strokeStyle = 'rgba(0,0,0,0.25)'; rrect(-370, -300, 740, 600, 16); g.stroke(); g.setLineDash([]);
        text('BET SLIP · AUGUST 2015', 0, -220, 'mono', 32, 'rgba(20,20,20,0.6)', { align: 'center', ls: 4 });
        text('LEICESTER CITY', 0, -120, 'disp', 74, '#1A1A1A', { align: 'center' }); text('TO WIN THE PREMIER LEAGUE', 0, -50, 'ui', 40, '#333', { align: 'center' });
        text('ODDS', 0, 60, 'mono', 34, 'rgba(20,20,20,0.6)', { align: 'center', ls: 6 }); g.restore();
        if (t > on) stampText('5000 / 1', 540, 1010, t, on, { size: 130, rot: -0.07, color: RED });
        gfx179(); return; }
      pic179(t - va, 'vardy', [140, 700, 800, 620], [0.47, 0.2, 1.35], [0.47, 0.18, 1.5], null, 3);
      realBadge(t, va + 0.1, 'REAL PHOTO · JAMIE VARDY · AUG 2015', 1340);
      chip('GOAL IN 11 GAMES IN A ROW', 540, 470, t, va + 0.1, { size: 40, bg: GOLD, fg: BG });
      for (let k = 0; k < 11; k++) { const at = lerp(va + 0.2, el + 0.15, k / 10), x = 540 + (k - 5) * 82, y = 590;
        g.save(); g.lineWidth = 4; g.strokeStyle = 'rgba(255,255,255,0.35)'; g.beginPath(); g.arc(x, y, 32, 0, 6.283); g.stroke(); g.restore();
        if (t > at) { const s = spring(t - at, 320, 16); g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = GRN179; g.beginPath(); g.arc(0, 0, 30, 0, 6.283); g.fill();
          text(`${k + 1}`, 0, 12, 'ui', 32, BG, { align: 'center' }); g.restore(); } }
      if (t > rc) stampText('RECORD!', 540, 1200, t, rc, { size: 110, rot: -0.06, color: GOLD }); }; }; });

// 2015–16: 23 wins, 12 draws, 3 defeats, 81 points
VIS[2] = S(() => { const tw = sw179(['twenty'], 0.1), th = sw179(['only'], 1.6), ei = sw179(['eighty'], 3.0);
  return (K) => { ks(K, [[0.2, 'whoosh', 0.8], [tw, 'hit', 1], [th, 'wrong', 1], [ei, 'boom', 1.1]]);
    return (t) => { atmosphere(t); pic179(t, 'whu', [40, 820, 1000, 640], [0.5, 0.7, 1.15], [0.5, 0.7, 1.3], WHU179, 4); dimAll(0.2); tag(t, 2, N179);
      realBadge(t, 0.3, 'REAL PHOTO · LEICESTER v WEST HAM · APRIL 2016', 1480);
      panel(60, 400, 960, 380, 0.9); text('2015–16 · 38 GAMES', 540, 465, 'mono', 32, 'rgba(255,255,255,0.65)', { align: 'center', ls: 4 });
      // 38 cells: 23 W, 12 D, 3 L
      for (let k = 0; k < 38; k++) { const c = k % 19, r = Math.floor(k / 19), x = 110 + c * 46, y = 500 + r * 56, kind = k < 23 ? 0 : k < 35 ? 1 : 2;
        const at = kind === 0 ? tw + k * 0.03 : kind === 1 ? lerp(tw + 0.75, th - 0.2, (k - 23) / 11) : th + (k - 35) * 0.12; if (t < at) continue;
        rrect(x, y, 38, 44, 8); g.fillStyle = [GRN179, 'rgba(255,255,255,0.35)', RED][kind]; g.fill(); }
      const wins = t > tw ? Math.min(23, Math.floor((t - tw) / 0.03) + 1) : 0;
      if (t > tw) text(`${wins} W`, 200, 720, 'disp', 64, GRN179, { align: 'center' });
      if (t > th - 0.2) text('12 D', 540, 720, 'disp', 64, 'rgba(255,255,255,0.75)', { align: 'center' });
      if (t > th) text('3 L', 880, 720, 'disp', 64, RED, { align: 'center' });
      if (t > ei) stampText('81 POINTS', 540, 1160, t, ei, { size: 110, rot: -0.06, color: GOLD }); }; }; });

// 2 May 2016: Chelsea 2–2 Tottenham at Stamford Bridge → Leicester champions
VIS[3] = S(() => { const ma = sw179(['may'], 0.1), to = sw179(['tottenham'], 1.4), dr = sw179(['drew'], to + 0.5), ch = sw179(['champions'], 3.4);
  return (K) => { ks(K, [[0.2, 'whoosh', 0.8], [ma, 'tick', 1], [dr, 'hit', 1.1], [ch, 'boom', 1.2], [ch + 0.05, 'ding', 1]]);
    return (t) => { atmosphere(t); tag(t, 3, N179);
      if (t < ch) { if (PHOTOS.stad) g.drawImage(blurOf('stad'), 0, 0, W, H); dimAll(0.3);
        chip('2 MAY 2016 · STAMFORD BRIDGE', 540, 470, t, ma, { size: 38, bg: GOLD, fg: BG });
        board(t, to - 0.1, 620, 'FULL TIME', ['CHELSEA', 'TOTTENHAM'], '2 – 2', dr);
        if (t > dr) chip('TOTTENHAM CAN NO LONGER CATCH LEICESTER', 540, 960, t, dr + 0.1, { size: 32, bg: 'rgba(14,15,18,0.92)', fg: '#FFF' });
        gfx179(); return; }
      pic179(t - ch, 'celeb', [40, 760, 1000, 680], [0.5, 0.5, 1.1], [0.52, 0.55, 1.25], CELEB179, 4);
      realBadge(t, ch + 0.1, 'REAL PHOTO · TITLE PARTY, 7 MAY 2016', 1460);
      stampText('CHAMPIONS OF ENGLAND', 540, 560, t, ch, { size: 58, rot: -0.05, color: GOLD }); flash(t, ch, 0.35); }; }; });
