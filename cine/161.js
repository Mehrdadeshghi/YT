// Wiki Roulette #161 — DEEP SEA: blobfish. Frame 1 = real NOAA photo of blobfish hauled onto a ship (swollen) + "this is NOT what it looks like" →
// the famous "ugliest animal 2013" face (drawn, the meme photo is not free) → pulled up from 3,000+ ft: depth gauge rises, the fish swells,
// cells rupture (illustration) → real photo of a live blobfish at 4,300 ft: a normal fish → jelly body floats, food drifts in → binary question.
const N161 = 4, SKIN161 = '#9C8E94', PINK161 = '#E7A9B4', SAND161 = '#3A3226';
const SNOW161 = (() => { const r = rng(161), s = []; for (let i = 0; i < 80; i++) s.push([r() * 1080, r() * 1920, 1 + r() * 2.5, 0.2 + r() * 0.6]); return s; })();

function deep161(t, top = '#06223A', bot = '#020814') { const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, top); gr.addColorStop(1, bot); g.fillStyle = gr; g.fillRect(0, 0, W, H);
  g.save(); SNOW161.forEach(([x, y, r, a]) => { g.globalAlpha = a * 0.45; g.fillStyle = '#CFE8FF'; g.beginPath(); g.arc(x + Math.sin(t * 0.3 + y) * 8, (y + t * 14 * r) % 1920, r, 0, 6.283); g.fill(); }); g.restore(); }
const ill161 = (t, y = 1590) => text('ILLUSTRATION', 1000, y, 'mono', 22, 'rgba(255,255,255,0.55)', { ls: 3, align: 'right' });
function shade161(y0, y1, a) { const gr = g.createLinearGradient(0, y0, 0, y1); gr.addColorStop(0, `rgba(0,0,0,${a})`); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(0, y0, W, y1 - y0); }
const mix161 = (a, b, p) => { const h = (c) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16)), A = h(a), B = h(b); return `rgb(${A.map((v, i) => Math.round(lerp(v, B[i], p))).join(',')})`; };

// the blobfish, side view facing left. sw = 0: tadpole-shaped fish at depth; sw = 1: the swollen, drooping "blob" at the surface
function fish161(x, y, s, sw, t) { g.save(); g.translate(x, y); g.scale(s, s); const col = mix161(SKIN161, PINK161, sw);
  // tail (shrinks a little when swollen)
  g.fillStyle = mix161('#7E7076', '#C98D99', sw); g.beginPath(); g.moveTo(40, -40 + sw * 20); g.quadraticCurveTo(170, -20, 240, Math.sin(t * 2) * 10 - 30);
  g.lineTo(250, Math.sin(t * 2) * 10 + 30); g.quadraticCurveTo(170, 20, 40, 45 + sw * 25); g.closePath(); g.fill();
  // head/body: a big rounded head; swelling makes it rounder and saggier
  g.fillStyle = col; g.beginPath(); g.ellipse(-20, sw * 25, 120 + sw * 45, 85 + sw * 55, 0, 0, 6.283); g.fill();
  // pectoral fin
  g.fillStyle = mix161('#B3A7AC', '#F0C3CB', sw); g.globalAlpha *= 0.8; g.beginPath(); g.ellipse(20, 40 + sw * 50, 50, 26, 0.6, 0, 6.283); g.fill(); g.globalAlpha /= 0.8;
  // the nose: hardly there at depth, a big droopy lump when swollen
  g.fillStyle = mix161('#8E8086', '#F2B3BE', sw); g.beginPath(); g.ellipse(-125 - sw * 40, 5 + sw * 45, 18 + sw * 42, 14 + sw * 48, 0.2, 0, 6.283); g.fill();
  // mouth: a straight line → a sad frown
  g.strokeStyle = 'rgba(40,20,25,0.8)'; g.lineWidth = 6; g.lineCap = 'round'; g.beginPath(); g.moveTo(-135 - sw * 30, 45 + sw * 85); g.quadraticCurveTo(-90, 40 + sw * 70, -50, 50 + sw * 105); g.stroke();
  // eye
  g.fillStyle = '#1A1418'; g.beginPath(); g.arc(-70 - sw * 10, -25 - sw * 5, 11 - sw * 3, 0, 6.283); g.fill(); g.fillStyle = 'rgba(255,255,255,0.7)'; g.beginPath(); g.arc(-73 - sw * 10, -28 - sw * 5, 3, 0, 6.283); g.fill();
  // speckles
  g.fillStyle = 'rgba(255,255,255,0.35)'; const r = rng(61); for (let k = 0; k < 26; k++) { const a = r() * 6.283, d = r(); g.beginPath(); g.arc(-20 + Math.cos(a) * (110 + sw * 40) * d, sw * 25 + Math.sin(a) * (75 + sw * 50) * d, 2.5, 0, 6.283); g.fill(); }
  g.restore(); }

// ---------- scenes ----------
VIS.open = (K) => { const no = sw('not', 0.8); K(0.15, 'hit', 1.2); K(0.2, 'mute', 1, 0.4); K(no, 'wrong', 1);
  return (t) => { atmosphere(t); const P = shot(t, 'deck', { a: [0.43, 0.7, 1.15], b: [0.43, 0.7, 1.3], dur: 3, anchor: [540, 1130] });
    shade161(0, 1000, 0.85); tag(t); hook(t, EP.hook, 440);
    if (P && t > no) { const [x, y] = P(0.42, 0.7); ring(t, no, x, y, 230, { color: RED, spot: false }); }
    realBadge(t, 0.3, 'REAL PHOTO · BLOBFISH HAULED ONTO A SHIP', 1500); }; };

VIS[0] = S(() => { const ug = sw('ugliest', 1.4), wo = sw('world', 2.4);
  return (K) => { ks(K, [[0.1, 'whoosh', 0.8], [ug, 'boom', 1], [wo, 'ding', 0.9]]);
    return (t) => { deep161(t, '#1A0F14', '#05030A'); g.save(); g.fillStyle = 'rgba(255,190,200,0.10)'; g.beginPath(); g.arc(540, 1000, 520, 0, 6.283); g.fill(); g.restore();
      fish161(530, 960, 1.95 + 0.08 * ease(clamp(t / 3)), 1, t);
      tag(t, 0, N161); fact2(t, 0.3, 'VOTED', 'UGLIEST ANIMAL', null, { y: 470 });
      if (t > ug) stampText('#1 UGLIEST', 540, 1490, t, ug, { size: 84, rot: -0.08 });
      if (t > wo) chip('🏆 WORLD · 2013', 540, 1350, t, wo, { size: 40, bg: GOLD, fg: BG });
      ill161(t); }; }; });

VIS[1] = S(() => { const pu = sw('pulled', 0.6), th = sw('thousand', 1.4), pr = sw('pressure', 2.6), ru = sw('ruptured', 3.4);
  return (K) => { ks(K, [[pu, 'whoosh', 0.9], [th, 'sonar', 0.9], [pr, 'swish', 0.8], [ru, 'crack', 1.1]]);
    return (t) => { const up = clamp((t - pu) / Math.max(0.8, ru - pu)), swl = ease(clamp((t - pu - 0.2) / Math.max(0.8, ru - pu)));
      deep161(t, mix161('#06223A', '#2A7AB0', up), mix161('#020814', '#0A2A44', up));
      // depth gauge (left): the marker climbs from 3,300 ft to the surface
      const gx = 130, gy0 = 420, gy1 = 1320, my = lerp(gy1, gy0, up);
      g.save(); g.strokeStyle = 'rgba(255,255,255,0.35)'; g.lineWidth = 4; g.beginPath(); g.moveTo(gx, gy0); g.lineTo(gx, gy1); g.stroke();
      for (let k = 0; k <= 3; k++) { const y = lerp(gy0, gy1, k / 3); g.beginPath(); g.moveTo(gx - 14, y); g.lineTo(gx + 14, y); g.stroke(); text(`${(k * 1100).toLocaleString('en-US')} ft`, gx + 28, y + 10, 'mono', 24, 'rgba(255,255,255,0.6)'); }
      g.restore(); g.save(); g.fillStyle = GOLD; g.beginPath(); g.moveTo(gx - 34, my - 18); g.lineTo(gx - 6, my); g.lineTo(gx - 34, my + 18); g.fill(); g.restore();
      chip(`${Math.round(3300 * (1 - up)).toLocaleString('en-US')} FT`, 560, 420, t, Math.min(th, pu + 0.2), { size: 56, bg: GOLD, fg: BG });
      // the fish rides up with the net line and swells
      g.save(); g.strokeStyle = 'rgba(255,255,255,0.4)'; g.lineWidth = 3; g.beginPath(); g.moveTo(620, 0); g.lineTo(620, lerp(1050, 820, up) - 140); g.stroke(); g.restore();
      const fy = lerp(1050, 820, up), jit = t > ru ? Math.sin(t * 40) * 4 * clamp(1 - (t - ru)) : 0; fish161(640 + jit, fy, 1.9, swl, t);
      if (t > pr) chip('PRESSURE ↓ FAST', 640, fy + 330, t, pr, { size: 40, bg: '#9ED8FF', fg: BG });
      if (t > ru) { const r = rng(7); g.save(); g.strokeStyle = 'rgba(255,80,80,0.85)'; g.lineWidth = 4; for (let k = 0; k < 9; k++) { const a = r() * 6.283, d = 60 + r() * 120, x = 610 + Math.cos(a) * d, y = fy + 40 + Math.sin(a) * d * 0.7, p = clamp((t - ru) / 0.3);
          g.beginPath(); g.moveTo(x, y); g.lineTo(x + 18 * p, y - 12 * p); g.lineTo(x + 30 * p, y + 6 * p); g.stroke(); } g.restore();
        stampText('CELLS RUPTURE', 640, fy + 470, t, ru, { size: 72, rot: -0.06 }); }
      tag(t, 1, N161); ill161(t, 1620); }; }; });

VIS[2] = S(() => { const hu = sw('hundred', 1.2), li = sw('this', 3.6, 0);
  return vscene(2, N161, { ph: 'live', o: { box: [40, 660, 1000, 826] }, a: [0.5, 0.5, 1.0], b: [0.4, 0.62, 1.15], dur: 4.5, badge: 'REAL PHOTO · ALIVE AT 4,300 FT (NOAA/MBARI)',
    f2: ['120×', 'THE PRESSURE', null, hu, { y: 490, size: 115 }], k: [[hu, 'boom', 1], [li, 'ding', 1]],
    x: (t, P) => { if (P && t > li) { const [x, y] = P(0.29, 0.83); ring(t, li, x, y, 170, { color: '#57E38A' }); chip('THE REAL BLOBFISH', 540, 1560, t, li + 0.1, { size: 44, bg: '#57E38A', fg: BG }); } } }); });

VIS[3] = S(() => { const fl = sw('floats', 1.0), dr = sw('drift', 3.0);
  return (K) => { ks(K, [[0.1, 'whoosh', 0.8], [fl, 'bubble', 0.9], [dr, 'pop', 0.9]]);
    return (t) => { deep161(t, '#04182A', '#010409');
      g.save(); g.fillStyle = SAND161; g.beginPath(); g.moveTo(0, 1300); g.quadraticCurveTo(540, 1260, 1080, 1310); g.lineTo(1080, 1920); g.lineTo(0, 1920); g.fill(); g.restore();
      const hy = 950 + Math.sin(t * 1.6) * 18; fish161(600, hy, 1.7, 0, t);
      // hover gap to the seafloor
      g.save(); g.setLineDash([12, 10]); g.strokeStyle = 'rgba(255,255,255,0.45)'; g.lineWidth = 3; g.beginPath(); g.moveTo(560, hy + 160); g.lineTo(560, 1285); g.stroke(); g.restore();
      // food: little crustaceans drifting in from the left into the mouth
      if (t > dr - 0.8) for (let k = 0; k < 4; k++) { const p = clamp((t - dr + 0.8 - k * 0.35) / 1.4); if (p <= 0 || p >= 1) continue; const x = lerp(-40, 380, p), y = hy + 60 + Math.sin(p * 6 + k) * 30 - k * 20;
        g.save(); g.globalAlpha = 1 - p * 0.6; g.fillStyle = '#FFB27A'; g.beginPath(); g.ellipse(x, y, 16, 8, 0.3, 0, 6.283); g.fill(); g.strokeStyle = '#FFB27A'; g.lineWidth = 2; g.beginPath(); g.moveTo(x - 14, y); g.lineTo(x - 30, y - 10); g.stroke(); g.restore(); }
      tag(t, 3, N161); fact2(t, 0.3, 'NO SWIMMING.', 'IT JUST FLOATS.', null, { y: 470 });
      if (t > fl) chip('JELLY BODY · LIGHTER THAN WATER', 540, 760, t, fl, { size: 34, bg: '#9ED8FF', fg: BG });
      if (t > dr) chip('FOOD DRIFTS IN', 300, 1420, t, dr, { size: 40, bg: GOLD, fg: BG });
      ill161(t, 1620); }; }; });
