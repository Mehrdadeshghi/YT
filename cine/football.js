// Shared football graphics for real-photo Shorts (ep.scripts: ["football.js"])
// board(t, tIn, y, clock, [home, away], score, hitAt, o) — stadium scoreboard; o.c1/o.c2 team colours, o.label (e.g. 'CORNERS')
function board(t, tIn, y, clock, teams, score, hitAt, o = {}) {
  const lt = t - tIn; if (lt < 0) return; const s = spring(lt, 260, 16), w = 920, h = 200;
  g.save(); g.translate(540, y + (1 - s) * -200); g.globalAlpha *= clamp(s * 1.5);
  g.shadowColor = 'rgba(0,0,0,0.6)'; g.shadowBlur = 30; rrect(-w / 2, 0, w, h, 26); g.fillStyle = 'rgba(14,15,18,0.93)'; g.fill(); g.shadowBlur = 0;
  g.font = F.mono(46); const cw = Math.max(200, g.measureText(clock).width + 60);
  rrect(-cw / 2, -32, cw, 70, 18); g.fillStyle = o.clockCol || '#FF3B30'; g.fill(); text(clock, 0, 18, 'mono', 46, '#FFFFFF', { align: 'center' });
  if (o.label) text(o.label, 0, 70, 'mono', 26, 'rgba(255,255,255,0.6)', { align: 'center', ls: 4 });
  const fl = hitAt != null && t > hitAt && t < hitAt + 0.9 ? Math.floor((t - hitAt) * 8) % 2 : 0;
  text(teams[0], -420, 138, 'ui', fit(teams[0], 'ui', 40, 230), o.c1 || '#E6E8EC'); text(teams[1], 420, 138, 'ui', fit(teams[1], 'ui', 40, 230), o.c2 || '#E6E8EC', { align: 'right' });
  text(score, 0, 156, 'disp', 84, fl ? '#F2C230' : '#FFFFFF', { align: 'center' }); g.restore(); }
const dimAll = (a) => { g.fillStyle = `rgba(8,8,10,${a})`; g.fillRect(0, 0, W, H); };
// red card that slams in
function redCard(t, tIn, x, y, s = 1) { const lt = t - tIn; if (lt < 0) return; const k = spring(lt, 340, 13) * s;
  g.save(); g.translate(x, y - (1 - Math.min(1, k)) * 200); g.rotate(-0.15); g.scale(k, k);
  g.shadowColor = 'rgba(0,0,0,0.5)'; g.shadowBlur = 24; rrect(-70, -100, 140, 200, 14); g.fillStyle = '#E3101E'; g.fill(); g.shadowBlur = 0; g.lineWidth = 8; g.strokeStyle = '#FFF'; g.stroke(); g.restore(); }
// a real photo scene: shot + optional dim, tag, badge, then extra drawing
function pscene(i, n, s) {
  return (K) => { K(0.45, 'whoosh', 0.5); (s.k || []).forEach(([a, b, c, d]) => K(a, b, c, d));
    return (t) => { atmosphere(t); let P;
      if (s.parts) { const pt = s.parts.filter((p) => t >= p.from).at(-1); P = pt.clip ? clip(t - pt.from + (pt.t0 || 0), pt.clip, { a: pt.a, b: pt.b }) : shot(t - pt.from, pt.ph, { a: pt.a || [0.5, 0.5, 1.0], b: pt.b || pt.a || [0.5, 0.5, 1.1], dur: pt.dur || 3 });
        if (!P) noPhoto(t); if (s.dim) dimAll(s.dim); if (pt.flash && t - pt.from < 0.12) flash(t, pt.from, 0.5, 0.12); tag(t, i, n);
        if (pt.clip) footBadge(t, pt.from + 0.1, pt.badge); else realBadge(t, pt.from + 0.1, pt.badge); }
      else { P = s.clip ? clip(t, s.clip, { a: s.a, b: s.b }) : shot(t, s.ph, { a: s.a || [0.5, 0.5, 1.0], b: s.b || s.a || [0.5, 0.5, 1.1], dur: s.dur || 5 });
        if (!P) noPhoto(t); if (s.dim) dimAll(s.dim); tag(t, i, n); if (s.clip) footBadge(t, 0.3, s.badge); else realBadge(t, 0.3, s.badge); }
      if (s.f) fact(t, s.f[2] ?? 0.6, s.f[0], s.f[1], s.fo || {}); if (s.x) s.x(t, P); }; };
}
