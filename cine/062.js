// Wiki Roulette #062 — Point Roberts: a US town reachable by land only through Canada
const PR = [-123.055, 48.985], CAC = '#D80621', USC = '#3C6BD8';
const PRP = [[-123.093, 49.0], [-123.022, 49.0], [-123.025, 48.985], [-123.035, 48.975], [-123.05, 48.967], [-123.07, 48.968], [-123.085, 48.975], [-123.093, 48.99]];
const ROUTE = densify([[-123.064, 49.0], [-123.07, 49.02], [-123.06, 49.05], [-122.98, 49.07], [-122.88, 49.08], [-122.79, 49.06], [-122.76, 49.02], [-122.756, 49.002], [-122.75, 48.985]], 12);
const P49 = densify([[-123.5, 49], [-122.3, 49]], 40);
function base(t, keys, o = {}) { earth(t, camPath(t, keys, o), { minAlt: 0.028 }); territory('Canada', CAC, 0.3, {}); territory('United States of America', USC, 0.3, {});
  territory(PRP, '#4A5A38', 1, {}); territory(PRP, USC, 0.7, { stroke: '#B0C8FF', glow: 16 }); }
function bus(x, y, s, dir = 1) { g.save(); g.translate(x, y); g.scale(s * dir, s); g.fillStyle = '#F6B40E'; rrect(-60, -30, 120, 50, 10); g.fill(); g.fillStyle = '#1A1714'; for (let i = 0; i < 4; i++) g.fillRect(-50 + i * 26, -22, 18, 16);
  g.beginPath(); g.arc(-34, 22, 11, 0, 6.283); g.arc(34, 22, 11, 0, 6.283); g.fill(); g.restore(); }
function along(p) { const i = clamp(p) * (ROUTE.length - 1), k = Math.floor(i), u = i - k, a = ROUTE[k], b = ROUTE[Math.min(k + 1, ROUTE.length - 1)]; return MAP.P(lerp(a[0], b[0], u), lerp(a[1], b[1], u)); }
const KV = [[0, -122.95, 49.03, 0.016, 32, 0]];
VIS.open = (K) => { K(0.2, 'whoosh', 0.9); K(0.8, 'pop', 0.8, 600);
  return (t) => { base(t, [[0, -100, 45, 2.8, 0, 0], [0.15, -123.0, 49.0, 0.018, 40, 0]], { k: 10, d: 6.4 }); place(...PR, 'POINT ROBERTS', t, 0.6, { color: '#B0C8FF', size: 40 });
    flag('US', 300, 1380, 220, t, { s: spring(t - 0.8, 260, 16) }); flag('CA', 780, 1380, 220, t, { s: spring(t - 1.2, 260, 16) }); tag(t); hook(t, EP.hook, 480); }; };
VIS[0] = (K) => { K(0.6, 'land', 0.8); K(2.0, 'pop', 0.8, 600);
  return (t) => { base(t, [[0, -123.0, 49.0, 0.018, 40, 0], [0.1, -123.05, 49.0, 0.008, 45, 10]], { k: 3, d: 3.4 }); flagPin(...PR, 'US', t, 2.0, { label: 'POINT ROBERTS', w: 120 });
    tag(t, 0, 4); rgbPop('WASHINGTON, USA', 80, 540, fit('WASHINGTON, USA', 'disp', 120, 920), '#B0C8FF', t, 0.45); label('CANADA ALL AROUND BY LAND', 84, 605, t, 1.0, { color: GOLD }); }; };
VIS[1] = (K) => { K(0.45, 'hit', 0.9); K(1.0, 'riser', 0.4, 1.5); K(2.6, 'scratch'); K(2.62, 'thump', 1);
  return (t) => { base(t, [[0, -123.05, 49.0, 0.008, 45, 10], [0.1, -122.95, 49.0, 0.03, 30, 0]], { k: 3, d: 3.4 }); line3d(P49, ease((t - 0.9) / 1.4), GOLD, { w: 7, dash: [18, 12], glow: 18 });
    if (t > 2.4) { const [x, y] = MAP.P(-122.5, 49.0); text('49°N', x, y - 20, 'disp', 50, GOLD, { align: 'center', shadow: true }); }
    tag(t, 1, 4); yearTag(1846, t, 0.45); label('OREGON TREATY: THE 49TH PARALLEL', 84, 625, t, 0.9, { color: GOLD }); stampText('CUT OFF', 540, 1080, t, 2.6, { size: 90, rot: -0.07 }); }; };
VIS[2] = (K) => { K(0.45, 'beep', 0.8); for (let i = 0; i < 16; i++) K(0.8 + i * 0.2, 'tick', 0.35); K(4.2, 'beep', 0.8);
  return (t) => { base(t, [[0, ...KV[0].slice(1)]], {}); const p = ease((t - 0.6) / 3.6); line3d(ROUTE, p, '#FFFFFF', { w: 7, glow: 14 }); const [x, y] = along(p); bus(x, y - 30, 0.8);
    [[-123.064, 49.0, 0.6], [-122.756, 49.002, 4.2]].forEach(([lo, la, a], i) => { if (t > a) { const [bx, by] = MAP.P(lo, la); g.fillStyle = RED; g.beginPath(); for (let k = 0; k < 8; k++) { const an = k / 8 * 6.283 + 0.39; g.lineTo(bx + Math.cos(an) * 26, by + Math.sin(an) * 26); } g.fill(); text('STOP', bx, by + 6, 'ui', 14, TXT, { align: 'center' }); } });
    tag(t, 2, 4); rgbPop(`${Math.round(ramp(t, 0.6, 3.6, 0, 40))} KM`, 80, 540, 170, TXT, t, 0.45); label('THROUGH CANADA', 84, 605, t, 0.8, { color: '#FF8A8A' });
    if (t > 4.2) chip('2 BORDER CROSSINGS', 80, 680, t, 4.2, { size: 34, align: 'left', bg: RED, fg: TXT }); }; };
VIS[3] = (K) => { [0.6, 1.9, 2.6, 3.9].forEach((a) => K(a, 'beep', 0.8));
  return (t) => { base(t, [[0, ...KV[0].slice(1)]], {}); line3d(ROUTE, 1, 'rgba(255,255,255,0.5)', { w: 5, glow: 0 }); const ph = clamp((t - 0.4) / 3.8), p = ph < 0.5 ? ease(ph * 2) : ease(2 - ph * 2), [x, y] = along(p); bus(x, y - 30, 0.9, ph < 0.5 ? 1 : -1);
    const n = [0.6, 1.9, 2.6, 3.9].filter((a) => t > a).length; tag(t, 3, 4); rgbPop(`${n}×`, 80, 560, 220, GOLD, t, 0.6); label('BORDER CROSSINGS — EVERY SCHOOL DAY', 84, 625, t, 0.8, { size: 26 });
    if (!photoCard(t, 'lead', 600, 380, 380, 250, 4.4, 'POINT ROBERTS')) {} }; };
