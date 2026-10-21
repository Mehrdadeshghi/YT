// Wiki Roulette #183 — FOOTBALL: Denmark win Euro 1992 after getting in ten days before the tournament.
// Real photos: Nya Ullevi (venue of the semi-final and the final; photos 2013/2019), Malmö Stadion (Denmark v England and v France),
// Marco van Basten 1989 and Peter Schmeichel July 1991 (era photos, not from the tournament — labelled with their year).
// Qualifying table, group results, scoreboards = GRAPHIC.
// Retention: frame-1 "10 days before: not even in it" → Yugoslavia out, Denmark in, 9 days → draw, loss, beat France →
// Netherlands 2–2, Schmeichel saves van Basten, 5–4 → final v Germany 2–0 (Jensen 18', Vilfort 78') → CHAMPIONS → question.
const N183 = 4, DEN183 = '#C8102E', GRN183 = '#3DDC84';
const sw183 = (qs, d, k = 0) => { for (const q of qs) { const v = sw(q, -99, k); if (v !== -99) return v; } return d; };
const gfx183 = (y = 1470) => text('GRAPHIC', 1000, y, 'mono', 22, 'rgba(255,255,255,0.55)', { ls: 3, align: 'right' });
const bg183 = (id, a = 0.35) => { if (PHOTOS[id]) g.drawImage(blurOf(id), 0, 0, W, H); dimAll(a); };
// Danish flag (red field, white Nordic cross) — a plain graphic, no federation crest
function flagDK183(x, y, w) { const h = w * 28 / 37; g.save(); rrect(x, y, w, h, 8); g.clip(); g.fillStyle = DEN183; g.fillRect(x, y, w, h);
  g.fillStyle = '#FFF'; g.fillRect(x + w * 12 / 37, y, w * 4 / 37, h); g.fillRect(x, y + h * 12 / 28, w, h * 4 / 28); g.restore(); }

VIS.open = (K) => { K(0.15, 'hit', 1.3); K(0.2, 'mute', 1, 0.4); const wo = sw183(['won'], 2.4); K(wo, 'boom', 1.1);
  return (t) => { atmosphere(t); shot(t, 'stad', { box: [40, 840, 1000, 600], a: [0.5, 0.55, 1.15], b: [0.5, 0.55, 1.35], dur: 3 });
    tag(t); hook(t, EP.hook, 480); realBadge(t, 0.3, 'REAL PHOTO · NYA ULLEVI, GOTHENBURG · FINAL VENUE', 1490);
    if (t > wo) stampText('CHAMPIONS', 540, 1360, t, wo, { size: 100, rot: -0.06, color: GOLD }); }; };

// Yugoslavia qualified, thrown out because of the war → Denmark (2nd in the group) get the spot, nine days to prepare
VIS[0] = S(() => { const yu = sw183(['yugoslavia'], 0.1), th = sw183(['thrown'], 2.6), dk = sw183(['denmark'], th + 0.8), ni = sw183(['nine'], dk + 1.8);
  return (K) => { ks(K, [[0.2, 'whoosh', 0.8], [yu, 'hit', 0.9], [th, 'wrong', 1.1], [th + 0.05, 'hit', 1], [dk, 'whoosh', 1], [ni, 'boom', 1.1]]);
    return (t) => { atmosphere(t); bg183('air'); tag(t, 0, N183);
      chip('31 MAY 1992 · 10 DAYS BEFORE KICK-OFF', 540, 470, t, yu, { size: 34, bg: GOLD, fg: BG });
      panel(90, 560, 900, 400, 0.9); text('EURO 1992 QUALIFYING GROUP', 540, 625, 'mono', 30, 'rgba(255,255,255,0.6)', { align: 'center', ls: 4 });
      // two rows; after "thrown" Yugoslavia is struck out and Denmark slides up into the qualifying spot
      const sw2 = t > dk ? easeOut((t - dk) / 0.5) : 0;
      [['1', 'YUGOSLAVIA', 0], ['2', 'DENMARK', 1]].forEach(([pos, nm, k]) => { const s = spring(t - (yu + 0.1 * k), 260, 18); if (s <= 0) return;
        const out = k === 0 && t > th, y = 680 + k * 110 + (k === 1 ? -110 * sw2 : 110 * sw2);
        g.save(); g.globalAlpha *= clamp(s * 1.5) * (out ? 1 - 0.55 * sw2 : 1); rrect(130, y, 820, 90, 16);
        g.fillStyle = k === 1 && t > dk ? DEN183 : out ? 'rgba(255,59,48,0.25)' : 'rgba(255,255,255,0.08)'; g.fill();
        text(k === 1 && t > dk ? '✓' : pos, 175, y + 60, 'mono', 40, '#FFF'); text(nm, 250, y + 62, 'ui', 50, '#FFF');
        if (k === 1) { g.save(); rrect(826, y + 14, 80, 62, 10); g.fillStyle = '#FFF'; g.fill(); g.restore(); flagDK183(830, y + 18, 72); }
        if (out) { g.lineWidth = 8; g.strokeStyle = RED; g.beginPath(); g.moveTo(240, y + 46); g.lineTo(240 + 480 * clamp((t - th) / 0.3), y + 46); g.stroke(); }
        g.restore(); });
      if (t > th && t < dk) stampText('OUT', 760, 735, t, th, { size: 80, rot: -0.1, color: RED });
      if (t > dk) chip('DENMARK ARE IN', 540, 905, t, dk + 0.15, { size: 34, bg: 'rgba(14,15,18,0.92)', fg: '#FFF' });
      // nine-day countdown strip
      if (t > ni) { panel(90, 1030, 900, 260, 0.9); for (let k = 0; k < 9; k++) { const at = ni + k * 0.06, x = 140 + k * 92;
          if (t < at) continue; const s = spring(t - at, 320, 16); g.save(); g.translate(x + 40, 1110); g.scale(s, s);
          rrect(-38, -38, 76, 76, 12); g.fillStyle = 'rgba(255,255,255,0.12)'; g.fill(); text(`${k + 1}`, 0, 14, 'ui', 40, '#FFF', { align: 'center' }); g.restore(); }
        text('DAYS TO PREPARE', 540, 1240, 'ui', 44, GOLD, { align: 'center' }); stampText('9 DAYS', 540, 1390, t, ni + 0.4, { size: 100, rot: -0.05, color: GOLD }); }
      gfx183(); }; }; });

// group stage: 0–0 England, 0–1 Sweden, 2–1 France → semi-final
VIS[1] = S(() => { const dr = sw183(['draw'], 0.1), lo = sw183(['loss'], 1.0), fr = sw183(['france'], 2.2), se = fr + 0.7;
  return (K) => { ks(K, [[0.2, 'whoosh', 0.8], [dr, 'tick', 1], [lo, 'wrong', 1], [fr, 'hit', 1.1], [se, 'boom', 1.1]]);
    return (t) => { atmosphere(t); shot(t, 'malmo', { box: [40, 1040, 1000, 420], a: [0.5, 0.5, 1.1], b: [0.5, 0.5, 1.25], dur: 4 }); tag(t, 1, N183);
      realBadge(t, 0.3, 'REAL PHOTO · MALMÖ STADION · GROUP GAMES', 1490);
      chip('GROUP STAGE · JUNE 1992', 540, 470, t, dr, { size: 36, bg: GOLD, fg: BG });
      const R = [[dr, 'ENGLAND', '0 – 0', 'rgba(255,255,255,0.35)', 'D'], [lo, 'SWEDEN', '0 – 1', RED, 'L'], [fr, 'FRANCE', '2 – 1', GRN183, 'W']];
      R.forEach(([at, nm, sc, col, wl], k) => { const s = spring(t - at, 260, 18); if (s <= 0) return; const y = 560 + k * 140;
        g.save(); g.translate((1 - s) * -600, 0); g.globalAlpha *= clamp(s * 1.5); rrect(90, y, 900, 115, 20); g.fillStyle = 'rgba(14,15,18,0.92)'; g.fill();
        rrect(110, y + 20, 75, 75, 14); g.fillStyle = col; g.fill(); text(wl, 147, y + 74, 'ui', 46, wl === 'D' ? '#FFF' : BG, { align: 'center' });
        text('DENMARK', 220, y + 76, 'ui', 42, '#FFF'); text(sc, 600, y + 80, 'disp', 64, '#FFF', { align: 'center' }); text(nm, 970, y + 76, 'ui', 42, '#FFF', { align: 'right' }); g.restore(); });
      if (t > se) stampText('SEMI-FINAL!', 540, 1000, t, se, { size: 90, rot: -0.05, color: GOLD });
      gfx183(990); }; }; });

// semi-final v the Netherlands (reigning European champions): 2–2, Schmeichel saves van Basten, 5–4 on penalties
VIS[2] = S(() => { const ne = sw183(['netherlands'], 0.3), tw = sw183(['two'], 1.6), pe = sw183(['penalties'], tw + 0.6), sc = sw183(['shmy-kel', 'shmy', 'schmeichel'], pe + 0.6), sv = sw183(['saved'], sc + 0.4), vb = sw183(['basten'], sv + 0.4);
  return (K) => { ks(K, [[0.2, 'whoosh', 0.8], [ne, 'hit', 0.9], [tw, 'tick', 1], [pe, 'whoosh', 0.9], [sv, 'boom', 1.2], [vb + 0.3, 'ding', 1]]);
    return (t) => { atmosphere(t); tag(t, 2, N183);
      if (t < sc) { bg183('stad', 0.3);
        chip('SEMI-FINAL · 22 JUNE 1992', 540, 470, t, ne - 0.1, { size: 36, bg: GOLD, fg: BG });
        if (t > ne) chip('REIGNING EUROPEAN CHAMPIONS', 540, 560, t, ne + 0.1, { size: 32, bg: 'rgba(14,15,18,0.92)', fg: '#FFF' });
        board(t, ne, 660, t > pe ? 'PENALTIES' : 'AFTER EXTRA TIME', ['NETHERLANDS', 'DENMARK'], '2 – 2', tw);
        if (t > pe) { for (let k = 0; k < 5; k++) { const x = 290 + k * 125; g.save(); g.lineWidth = 4; g.strokeStyle = 'rgba(255,255,255,0.4)';
            g.beginPath(); g.arc(x, 1010, 40, 0, 6.283); g.stroke(); g.restore(); text('?', x, 1026, 'ui', 44, 'rgba(255,255,255,0.5)', { align: 'center' }); } }
        gfx183(); return; }
      // Schmeichel (left) vs van Basten (right): the save
      shot(t - sc, 'schm', { box: [40, 600, 490, 640], a: [0.5, 0.35, 1.1], b: [0.5, 0.35, 1.2], dur: 3 });
      if (t > vb - 0.15) shot(t - vb, 'vb', { box: [550, 600, 490, 640], a: [0.5, 0.3, 1.1], b: [0.5, 0.3, 1.2], dur: 3, backdrop: false });
      text('SCHMEICHEL · 1991', 285, 1290, 'mono', 26, '#FFF', { align: 'center', ls: 2 });
      if (t > vb - 0.15) text('VAN BASTEN · 1989', 795, 1290, 'mono', 26, '#FFF', { align: 'center', ls: 2 });
      realBadge(t, sc + 0.1, 'REAL PHOTOS · NOT FROM THIS GAME', 1340);
      chip('PENALTY SHOOT-OUT', 540, 470, t, sc, { size: 38, bg: GOLD, fg: BG });
      if (t > sv) stampText('SAVED!', 285, 1170, t, sv, { size: 90, rot: -0.06, color: GRN183 });
      if (t > vb + 0.5) stampText('5 – 4 · DENMARK THROUGH', 540, 1450, t, vb + 0.5, { size: 56, rot: -0.04, color: GOLD }); }; }; });

// final v world champions Germany, 26 June 1992, Nya Ullevi: 2–0 (Jensen 18', Vilfort 78')
VIS[3] = S(() => { const ge = sw183(['germany'], 0.4), je = sw183(['jensen'], 1.4), vi = sw183(['vil-fort', 'vil', 'vilfort'], je + 1.0), tn = sw183(['two-nil', 'two', 'nil'], vi + 0.8), ch = sw183(['champions'], tn + 1.0, 1);
  return (K) => { ks(K, [[0.2, 'whoosh', 0.8], [ge, 'hit', 1], [je, 'boom', 1], [vi, 'boom', 1.1], [ch, 'boom', 1.2], [ch + 0.05, 'ding', 1]]);
    return (t) => { atmosphere(t); tag(t, 3, N183);
      if (t < ch) { bg183('stad', 0.3);
        chip('FINAL · 26 JUNE 1992 · GOTHENBURG', 540, 470, t, 0.1, { size: 34, bg: GOLD, fg: BG });
        if (t > ge) chip('v WORLD CHAMPIONS', 540, 560, t, ge, { size: 32, bg: 'rgba(14,15,18,0.92)', fg: '#FFF' });
        const sc = t > vi ? '2 – 0' : t > je ? '1 – 0' : '0 – 0';
        board(t, ge - 0.1, 660, t > vi ? "78'" : t > je ? "18'" : 'KICK-OFF', ['DENMARK', 'GERMANY'], sc, t > vi ? vi : je);
        if (t > je) chip("⚽ 18'  JOHN JENSEN", 540, 960, t, je, { size: 36, bg: DEN183, fg: '#FFF' });
        if (t > vi) chip("⚽ 78'  KIM VILFORT", 540, 1050, t, vi, { size: 36, bg: DEN183, fg: '#FFF' });
        if (t > tn) stampText('FULL TIME', 540, 1230, t, tn, { size: 80, rot: -0.05, color: '#FFF' });
        gfx183(); return; }
      shot(t - ch, 'stad', { box: [40, 760, 1000, 640], a: [0.5, 0.5, 1.1], b: [0.5, 0.5, 1.3], dur: 4 });
      realBadge(t, ch + 0.1, 'REAL PHOTO · NYA ULLEVI, WHERE IT HAPPENED', 1460);
      flagDK183(430, 470, 220);
      stampText('CHAMPIONS OF EUROPE', 540, 700, t, ch, { size: 64, rot: -0.05, color: GOLD }); flash(t, ch, 0.35); }; }; });
