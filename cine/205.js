// Wiki Roulette #205 — REEL v2 (E8): 1969, the U.S. Army Corps of Engineers switched off the American Falls of Niagara.
// open: REAL FOOTAGE American Falls today, hook "NIAGARA FALLS / SWITCHED OFF" → REAL PHOTO the dry falls, 1969 →
// GRAPHIC map: rock-and-earth dam across the American channel (JUNE 1969) → REAL PHOTO dry falls "DRY." →
// REAL FOOTAGE Horseshoe Falls takes all the water → REAL PHOTO 1969 rock pile at the base → REAL PHOTO dry crest "BOLTED" →
// 1969 photo "2 BODIES FOUND" → GRAPHIC dam blown up (NOVEMBER) → REAL FOOTAGE water back → comment card over the talus photo;
// loop line "switch Niagara off again" over the opening footage.

// ---------- GRAPHIC: top-down map of the river splitting around Goat Island ----------
// dam: 0..1 (bar drawn across the American channel), am: flow over the American Falls 0..1, boom: time of the blast (or null)
function map205(t, dam, am, boom) {
  techBg(t, '#04121C', '#06263A'); g.save(); g.translate(0, 170);
  const river = (path, w, col) => { g.save(); g.lineCap = 'round'; g.lineJoin = 'round'; g.strokeStyle = col; g.lineWidth = w; g.stroke(path); g.restore(); };
  const main = new Path2D(); main.moveTo(620, 380); main.lineTo(600, 560);
  const left = new Path2D(); left.moveTo(600, 560); left.quadraticCurveTo(380, 650, 300, 860);
  const right = new Path2D(); right.moveTo(600, 560); right.quadraticCurveTo(760, 680, 760, 860);
  river(main, 170, '#1E6A8C'); river(right, 150, '#1E6A8C'); river(left, 90, am > 0.02 ? `rgba(30,106,140,${0.25 + 0.75 * am})` : '#3A2F25');
  // flowing dashes
  const flow = (p, w, a) => { if (a <= 0.02) return; g.save(); g.setLineDash([26, 30]); g.lineDashOffset = -t * 220; g.strokeStyle = `rgba(190,240,255,${0.7 * a})`; g.lineWidth = w; g.stroke(p); g.restore(); };
  flow(main, 8, 1); flow(right, 8, 1); flow(left, 6, am);
  // Goat Island
  g.fillStyle = '#2E5A2A'; g.beginPath(); g.ellipse(560, 760, 120, 90, -0.3, 0, 6.283); g.fill(); text('GOAT ISLAND', 560, 768, 'mono', 22, '#CFE8C8', { align: 'center', ls: 2 });
  // falls edges
  g.save(); g.lineWidth = 12; g.strokeStyle = am > 0.02 ? '#E8F7FF' : '#8B7B66'; g.beginPath(); g.moveTo(230, 880); g.lineTo(380, 860); g.stroke();
  g.strokeStyle = '#E8F7FF'; g.beginPath(); g.arc(760, 900, 90, Math.PI * 1.1, Math.PI * 1.9); g.stroke(); g.restore();
  if (dam > 0) { g.save(); g.translate(470, 640); g.rotate(-0.5); g.fillStyle = '#9C8466'; rrect(-90 * dam, -22, 180 * dam, 44, 10); g.fill(); g.restore(); }
  if (boom != null && t > boom && t < boom + 0.7) { const p = (t - boom) / 0.7; g.save(); g.globalAlpha = 1 - p; const gr = g.createRadialGradient(470, 640, 0, 470, 640, 80 + 400 * p);
    gr.addColorStop(0, '#FFF6D0'); gr.addColorStop(0.4, '#FFB23D'); gr.addColorStop(1, 'rgba(255,90,20,0)'); g.fillStyle = gr; g.fillRect(0, 0, W, H); g.restore(); }
  g.restore(); label('AMERICAN FALLS', 110, 1110, t, -1, { size: 26 }); label('HORSESHOE FALLS', 580, 1180, t, -1, { size: 22 });
}
const N205 = 5;

// ---------- open: hook ----------
VIS.open = (K) => { K(0.15, 'hit', 1.3); K(0.2, 'mute', 1, 0.4); const sv = sw('switched', 1.4), ni = sw('nineteen', 2.4); K(sv, 'click', 1.4); K(ni, 'thump', 1);
  return (t) => { atmosphere(t);
    if (t < ni) { r2clip(t, 'camerican', { a: [0.45, 0.5, 1.0], b: [0.45, 0.5, 1.06], dim: 0.15 }); r2foot(t, -0.5, 'REAL FOOTAGE · AMERICAN FALLS TODAY'); }
    else { r2photo(t, 'dry3', { a: [0.5, 0.75, 1.0], b: [0.5, 0.75, 1.08], t0: ni, dim: 0.1 }); r2real(t, ni, 'REAL PHOTO · THE DRY AMERICAN FALLS, 1969'); }
    tag(t); r2band(430, 800, 0.55); r2hook(t, EP.hook, 600, { size: 150 }); if (t > ni) r2line(t, ni, '1969', 830, { size: 40, color: GOLD }); }; };

// ---------- 0: June, temporary dam of rock and earth; the American Falls went dry ----------
VIS[0] = S(() => { const ju = sw('june', 0.3), da = sw('dam', 2.0), ro = sw('rock', 2.4), am = sw('american', 3.4), dr = sw('dry', 4.2);
  return (K) => { ks(K, [[0.1, 'whoosh', 0.8], [ju, 'tick', 1], [da, 'thump', 1.2], [ro, 'crack', 0.8], [am, 'whoosh', 0.8], [dr, 'hit', 1.2]]);
    return (t) => { atmosphere(t);
      if (t < am) { const d = easeOut((t - da) / 0.6); map205(t, d, 1 - d); r2graphic(t, 0, 'GRAPHIC · THE RIVER AT THE FALLS');
        if (t > ju) chip('JUNE 1969 · U.S. ARMY CORPS OF ENGINEERS', 80, 470, t, ju, { size: 26, align: 'left', bg: TXT, fg: BG });
        if (t > ro) chip('TEMPORARY DAM: ROCK + EARTH', 80, 545, t, ro, { size: 30, align: 'left', bg: '#C9A877', fg: BG }); }
      else { r2photo(t, 'dry3', { a: [0.45, 0.75, 1.1], b: [0.45, 0.75, 1.25], t0: am, dim: 0.1 }); r2real(t, am, 'REAL PHOTO · AMERICAN FALLS, 1969');
        r2band(980, 1130, 0.6); r2big(t, dr, 'DRY.', 1090, { size: 150 }); }
      tag(t, 0, N205); }; }; });

// ---------- 1: all the water over the Horseshoe Falls ----------
VIS[1] = S(() => { const ho = sw('horseshoe', 1.2);
  return (K) => { ks(K, [[0.1, 'whoosh', 0.8], [0.2, 'splash', 0.8], [ho, 'hit', 1]]);
    return (t) => { atmosphere(t); r2clip(t, 'chorse', { a: [0.55, 0.5, 1.0], b: [0.55, 0.5, 1.08], dim: 0.1 }); r2foot(t, 0.1, 'REAL FOOTAGE · HORSESHOE FALLS TODAY');
      chip('ALL THE WATER', 80, 500, t, 0.3, { size: 36, align: 'left', bg: CY, fg: BG });
      if (t > ho) { r2band(980, 1130, 0.6); r2big(t, ho, 'HORSESHOE FALLS', 1090, { size: 100 }); }
      tag(t, 1, N205); }; }; });

// ---------- 2: why? rock pile from rockfalls; engineers bolted weak spots ----------
VIS[2] = S(() => { const ro = sw('rockfalls', 0.5), mo = sw('mound', 1.6), en = sw('engineers', 2.8), bo = sw('bolted', 4.0);
  return (K) => { ks(K, [[0.1, 'whoosh', 0.8], [ro, 'crack', 1], [mo, 'thump', 1], [en, 'whoosh', 0.8], [bo, 'click', 1.2], [bo + 0.2, 'click', 1.2], [bo + 0.4, 'click', 1.2]]);
    return (t) => { atmosphere(t);
      if (t < en) { const P = r2photo(t, 'dry', { a: [0.45, 0.58, 1.3], b: [0.45, 0.6, 1.45], dim: 0.05 }); r2real(t, 0.1, 'REAL PHOTO · THE DRY FALLS, 1969');
        if (P && t > mo) { const [x, y] = P(0.42, 0.6); ring(t, mo, x, y, 170); }
        chip('WHY?', 80, 500, t, 0.1, { size: 44, align: 'left', bg: GOLD, fg: BG });
        if (t > mo) { r2band(980, 1130, 0.65); r2big(t, mo, 'A HUGE ROCK PILE', 1090, { size: 100 }); } }
      else { r2photo(t, 'dry2', { a: [0.4, 0.4, 1.0], b: [0.4, 0.45, 1.12], t0: en, dim: 0.1 }); r2real(t, en, 'REAL PHOTO · THE DRY CREST, 1969');
        if (t > bo) { r2band(980, 1130, 0.65); r2big(t, bo, 'WEAK SPOTS BOLTED', 1090, { size: 90 }); } }
      tag(t, 2, N205); }; }; });

// ---------- 3: two bodies; November: the dam blown up, the falls came back ----------
VIS[3] = S(() => { const bd = sw('bodies', 1.6), no = sw('november', 2.6), bl = sw('blew', 3.2), ca = sw('came', 4.4);
  return (K) => { ks(K, [[0.1, 'whoosh', 0.6], [bd, 'thump', 1], [no, 'tick', 1], [bl, 'hit', 1.5], [bl + 0.05, 'crack', 1.2], [ca, 'splash', 1.2]]);
    return (t) => { atmosphere(t);
      if (t < no) { r2photo(t, 'dry', { a: [0.6, 0.6, 1.2], b: [0.6, 0.6, 1.3], dim: 0.35 }); r2real(t, 0.1, 'REAL PHOTO · UNDER THE DRY FALLS, 1969');
        if (t > bd) { r2band(980, 1130, 0.65); r2big(t, bd, '2 BODIES FOUND', 1090, { size: 100, color: TXT }); } }
      else if (t < ca) { map205(t, t < bl ? 1 : 0, t < bl ? 0 : easeOut((t - bl) / 0.8), bl); r2graphic(t, no, 'GRAPHIC · THE DAM IS BLOWN UP');
        chip('NOVEMBER 1969', 80, 470, t, no, { size: 32, align: 'left', bg: TXT, fg: BG }); if (t > bl) { g.save(); g.translate(shake(t, bl, 20), 0); r2big(t, bl, 'BOOM.', 640, { size: 150, color: GOLD }); g.restore(); } }
      else { r2clip(t, 'ccrest', { a: [0.75, 0.5, 1.0], b: [0.75, 0.5, 1.08], t0: ca, dim: 0.1 }); r2foot(t, ca, 'REAL FOOTAGE · AMERICAN FALLS TODAY');
        r2band(980, 1130, 0.6); r2big(t, ca, 'BACK ON.', 1090, { size: 140, color: CY }); }
      tag(t, 3, N205); }; }; });

// ---------- 4: comment card + loop line ----------
VIS[4] = S(() => { const be = sw('before', 3.2), of = sw('off', 3.8);
  return (K) => { ks(K, [[0.1, 'whoosh', 0.8], [be, 'whoosh', 0.6], [of, 'click', 1.4]]);
    return (t) => { atmosphere(t);
      if (t < be) { r2photo(t, 'talus', { a: [0.5, 0.6, 1.0], b: [0.5, 0.6, 1.08], dim: 0.25 }); r2real(t, 0.1, 'REAL PHOTO · THE ROCK PILE TODAY'); }
      else { r2clip(t, 'camerican', { a: [0.45, 0.5, 1.06], b: [0.45, 0.5, 1.0], t0: be, dim: 0.15 }); r2foot(t, be, 'REAL FOOTAGE · AMERICAN FALLS TODAY');
        r2band(430, 800, 0.55); r2big(t, of, 'SWITCHED OFF?', 640, { size: 140 }); }
      tag(t, 4, N205); }; }; });
