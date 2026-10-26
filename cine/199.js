// Wiki Roulette #199 — REEL v2 (E8): the hidden Hall of Records behind Lincoln's head (Mount Rushmore).
// Frame 1 = hook "A ROOM BEHIND / LINCOLN'S HEAD" over the real faces, ring on Lincoln → OFF-LIMITS →
// Borglum (real photo) → Declaration + Constitution (real scans) → the plan: stairway + vault (graphic on a real photo) →
// the real unfinished tunnel, 70 FT → 1939 construction photo, WORK STOPPED → view from the top, NO TRAIL →
// 1998: capstone + box at the tunnel mouth (real photo) → one of the 16 enamel panels (real photo) → the vault stack (graphic) →
// comment card over the tunnel opening. Safe zone: everything between y 230 and 1440, nothing key right of x 850 below y 900.
const N199 = 3, BOX199 = [40, 400, 1000, 700];

function hook199(t, tIn) {   // the on-screen hook, complete on frame 1 (tIn < 0)
  const s = Math.min(fit('A ROOM BEHIND', 'disp', 118, 920), fit("LINCOLN'S HEAD", 'disp', 118, 920));
  rgbPop('A ROOM BEHIND', 80, 520, s, TXT, t, tIn); rgbPop("LINCOLN'S HEAD", 80, 520 + s * 1.04, s, GOLD, t, tIn + 0.08);
}
function graphicBadge199(t, tIn, str, y = 360) { chip('◆ ' + str, 80, y, t, tIn, { size: 24, align: 'left', bg: 'rgba(62,140,255,0.92)', fg: TXT }); }
// the vault "stack" (graphic): capstone over titanium vault over teakwood box with 16 panels
function stack199(t, tIn, x, y) {
  const rows = [['GRANITE CAPSTONE', '#6E6A66', TXT], ['TITANIUM VAULT', '#B8C2CC', BG], ['TEAKWOOD BOX', '#9C6233', TXT], ['16 ENAMEL PANELS', GOLD, BG]];
  rows.forEach(([s, bg, fg], i) => { const lt = t - tIn - i * 0.18; if (lt < 0) return; const p = spring(lt, 260, 20), w = 640 - i * 70;
    g.save(); g.translate(x, y + i * 112 + (1 - p) * 60); g.globalAlpha = clamp(p * 2); rrect(-w / 2, 0, w, 96, 18); g.fillStyle = bg; g.fill();
    g.lineWidth = 3; g.strokeStyle = 'rgba(0,0,0,0.35)'; g.stroke(); text(s, 0, 60, 'mono', 32, fg, { align: 'center', ls: 3 }); g.restore(); });
}

// ---------- open: hook + stake ----------
VIS.open = (K) => { K(0.1, 'hit', 1.2); const li = sw('lincoln', 1.7), al = sw('allowed', 3.2);
  K(li, 'tick', 1); K(al, 'thump', 1.1);
  return (t) => { atmosphere(t);
    const P = shot(t, 'rush', { box: [40, 700, 1000, 440], a: [0.7, 0.6, 1.05], b: [0.82, 0.62, 1.35], dur: 4.2 }); if (!P) noPhoto(t);
    if (P) { const [x, y] = P(0.86, 0.62); ring(t, -0.3, x, y, 115, { spot: false }); }
    realBadge(t, -0.5, 'REAL PHOTO · MOUNT RUSHMORE');
    tag(t); hook199(t, -0.6);
    if (t > al) stampText('OFF-LIMITS', 470, 930, t, al, { size: 96, rot: -0.08 }); }; };

// ---------- scene 1: Borglum's plan ----------
VIS[0] = S(() => { const ha = sw('hall', 1.8), de = sw('declaration', 3.9), co = sw('constitution', 5.6), st = sw('stairways', 7.1);
  return (K) => { ks(K, [[0.1, 'whoosh', 0.8], [ha, 'hit', 1], [de, 'whoosh', 0.7], [co, 'tick', 1], [st, 'whoosh', 0.8]]);
    return (t) => { atmosphere(t);
      if (t < de) { const P = shot(t, 'borglum', { box: BOX199, a: [0.55, 0.3, 1.0], b: [0.5, 0.28, 1.12], dur: 4 }); if (!P) noPhoto(t);
        realBadge(t, 0.2, 'REAL PHOTO · GUTZON BORGLUM, SCULPTOR');
        if (t > ha) { panel(60, 960, 760, 120, 0.86); rgbPop('HALL OF RECORDS', 90, 1045, fit('HALL OF RECORDS', 'disp', 72, 700), GOLD, t, ha); } }
      else if (t < st) { const A = shot(t, 'decl', { box: [40, 400, 490, 700], a: [0.5, 0.2, 1.0], b: [0.5, 0.22, 1.1], dur: 4, t0: de });
        const B = t > co ? shot(t, 'const', { box: [550, 400, 490, 700], a: [0.3, 0.12, 1.2], b: [0.3, 0.14, 1.3], dur: 4, t0: co, backdrop: false }) : null;
        if (!A) noPhoto(t); realBadge(t, de, 'REAL SCANS · NATIONAL ARCHIVES');
        chip('DECLARATION', 285, 1050, t, de, { size: 30, bg: GOLD, fg: BG }); if (t > co) chip('CONSTITUTION', 700, 1050, t, co, { size: 30, bg: GOLD, fg: BG }); }
      else { const P = shot(t, 'rushw', { box: BOX199, a: [0.7, 0.4, 1.15], b: [0.72, 0.36, 1.25], dur: 4, t0: st }); if (!P) noPhoto(t);
        graphicBadge199(t, st, 'GRAPHIC ON A REAL PHOTO · THE PLAN');
        { const pts = [[800, 1090], [760, 1010], [830, 940], [870, 840], [810, 760], [900, 650]], p = easeOut((t - st) / 0.9);
          g.save(); g.setLineDash([18, 14]); const n = Math.max(1, Math.floor(p * (pts.length - 1)) + 1); glowLine(pts.slice(0, n + 1), GOLD, 8); g.restore();
          if (p > 0.95) { const [vx, vy] = pts.at(-1); g.save(); rrect(vx - 34, vy - 30, 68, 60, 10); g.fillStyle = GOLD; g.fill(); g.restore();
            callout(t, st + 0.9, [vx, vy], 560, 520, 'VAULT', { size: 34 }); } }
        chip('STAIRWAYS UP', 300, 1040, t, st + 0.3, { size: 34, bg: TXT, fg: BG }); }
      tag(t, 0, N199); }; }; });

// ---------- scene 2: 70 feet, 1939, no trail ----------
VIS[1] = S(() => { const se = sw('seventy', 0.6), th = sw('then', 2.3), ni = sw('nineteen', 2.7), stp = sw('stopped', 4.1), no = sw('no', 5.8), tr = sw('trail', 6.0);
  return (K) => { ks(K, [[0.1, 'whoosh', 0.8], [se, 'hit', 1.1], [th, 'whoosh', 0.7], [stp, 'thump', 1], [no, 'whoosh', 0.7], [tr, 'hit', 1]]);
    return (t) => { atmosphere(t);
      if (t < th) { const P = shot(t, 'hall', { box: BOX199, a: [0.45, 0.62, 1.0], b: [0.45, 0.42, 1.35], dur: 3 }); if (!P) noPhoto(t);
        realBadge(t, 0.2, 'REAL PHOTO · THE UNFINISHED HALL');
        ruler(t, se, 140, 1040, 520, '70 FEET', { v: true, size: 40 }); }
      else if (t < no) { const P = shot(t, 'build', { box: BOX199, a: [0.5, 0.4, 1.0], b: [0.45, 0.5, 1.12], dur: 4, t0: th }); if (!P) noPhoto(t);
        realBadge(t, th, 'REAL PHOTO · CARVING MOUNT RUSHMORE');
        if (t > ni) panel(56, 920, 400, 170, 0.8); rgbPop('1939', 80, 1060, 170, GOLD, t, ni); if (t > stp) chip('WORK STOPPED', 470, 1010, t, stp, { size: 38, bg: RED, fg: TXT, align: 'left' }); }
      else { const P = shot(t, 'top', { box: BOX199, a: [0.5, 0.5, 1.0], b: [0.5, 0.55, 1.1], dur: 3, t0: no }); if (!P) noPhoto(t);
        realBadge(t, no, 'REAL PHOTO · THE VIEW FROM THE TOP');
        if (t > tr) stampText('NO TRAIL', 470, 760, t, tr, { size: 110, rot: -0.07 }); }
      tag(t, 1, N199); }; }; });

// ---------- scene 3: 1998 + the ONE ask ----------
VIS[2] = S(() => { const ni = sw('nineteen', 0.2), fi = sw('filled', 1.7), si = sw('sixteen', 2.7), se = sw('sealed', 4.9), ti = sw('titanium', 5.4), sh = sw('should', 6.6);
  return (K) => { ks(K, [[0.1, 'whoosh', 0.8], [ni, 'hit', 1], [si, 'whoosh', 0.7], [se, 'whoosh', 0.6], [ti, 'hit', 1], [sh, 'whoosh', 0.6]]);
    return (t) => { atmosphere(t);
      if (t < si) { const P = shot(t, 'hall', { box: BOX199, a: [0.5, 0.8, 1.0], b: [0.55, 0.86, 1.2], dur: 2.6 }); if (!P) noPhoto(t);
        realBadge(t, 0.2, 'REAL PHOTO · THE TUNNEL MOUTH TODAY');
        rgbPop('1998', 80, 640, 170, GOLD, t, ni); if (P && t > fi) { const [x, y] = P(0.56, 0.89); ring(t, fi, x, y, 170, { spot: false }); } }
      else if (t < se) { const P = shot(t, 'panel', { box: BOX199, a: [0.5, 0.35, 1.0], b: [0.5, 0.45, 1.15], dur: 3, t0: si }); if (!P) noPhoto(t);
        realBadge(t, si, 'REAL PHOTO · ONE OF THE 16 PANELS');
        rgbPop('×16', 80, 1060, 160, GOLD, t, si + 0.1); }
      else if (t < sh) { graphicBadge199(t, se, 'GRAPHIC · WHAT LIES IN THE ROCK');
        stack199(t, se, 470, 520); }
      else { const P = shot(t, 'hallop', { box: [40, 400, 1000, 700], a: [0.45, 0.4, 1.0], b: [0.45, 0.45, 1.12], dur: 4, t0: sh }); if (!P) noPhoto(t);
        realBadge(t, sh, 'REAL PHOTO · BEHIND THE FACES');
        rgbPop("LINCOLN'S ROOM", 80, 560, fit("LINCOLN'S ROOM", 'disp', 100, 900), TXT, t, sh + 0.1); }
      tag(t, 2, N199); }; }; });
