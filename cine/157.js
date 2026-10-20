// Wiki Roulette #157 — DEEP SEA: sea pig (Scotoplanes). Frame 1 = the real live sea pig (MBARI photo) + "it breathes through its butt" →
// scientific plate of the underside: mouth, BREATHES HERE, water-pumped legs → real photo: baby crab hiding under it →
// drawn whale fall it smells → depth gauge to 16,400 ft with a herd of 600 → brought up, it falls apart (illustration) → binary question.
const N157 = 4, PINK157 = '#F2B8C6', SAND157 = '#3A3226';
const SNOW157 = (() => { const r = rng(157), s = []; for (let i = 0; i < 80; i++) s.push([r() * 1080, r() * 1920, 1 + r() * 2.5, 0.2 + r() * 0.6]); return s; })();
const HERD157 = (() => { const r = rng(1157), s = []; for (let i = 0; i < 600; i++) s.push([r(), r(), r()]); return s; })();

function deep157(t, top = '#06223A', bot = '#020814') { const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, top); gr.addColorStop(1, bot); g.fillStyle = gr; g.fillRect(0, 0, W, H);
  g.save(); SNOW157.forEach(([x, y, r, a]) => { g.globalAlpha = a * 0.45; g.fillStyle = '#CFE8FF'; g.beginPath(); g.arc(x + Math.sin(t * 0.3 + y) * 8, (y + t * 14 * r) % 1920, r, 0, 6.283); g.fill(); }); g.restore(); }
// a little drawn sea pig (side view, facing left), s = scale
function pig157(x, y, s, t, a = 1) { g.save(); g.globalAlpha *= a; g.translate(x, y); g.scale(s, s);
  g.fillStyle = 'rgba(242,184,198,0.85)'; g.strokeStyle = 'rgba(255,230,236,0.9)'; g.lineWidth = 3;
  for (let k = 0; k < 4; k++) { const ph = Math.sin(t * 4 + k * 1.3) * 6; g.beginPath(); g.ellipse(-40 + k * 28, 30 + Math.abs(ph) * 0.3, 9, 18, ph * 0.03, 0, 6.283); g.fill(); }
  g.beginPath(); g.ellipse(0, 0, 70, 36, 0, 0, 6.283); g.fill(); g.stroke();
  g.lineCap = 'round'; g.lineWidth = 8; g.strokeStyle = 'rgba(242,184,198,0.9)'; for (const [bx, dx] of [[10, -14], [30, 6]]) { g.beginPath(); g.moveTo(bx, -30); g.quadraticCurveTo(bx + dx, -70, bx + dx * 2, -80 + Math.sin(t * 2 + bx) * 4); g.stroke(); }
  g.restore(); }
const ill157 = (t, y = 1590) => text('ILLUSTRATION', 1000, y, 'mono', 22, 'rgba(255,255,255,0.55)', { ls: 3, align: 'right' });
function shade157(y0, y1, a) { const gr = g.createLinearGradient(0, y0, 0, y1); gr.addColorStop(0, `rgba(0,0,0,${a})`); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(0, y0, W, y1 - y0); }

// ---------- scenes ----------
VIS.open = (K) => { const bu = sw('butt', 1.4); K(0.15, 'hit', 1.2); K(0.2, 'mute', 1, 0.4); K(bu, 'pop', 1);
  return (t) => { atmosphere(t); shot(t, 'crab', { a: [0.5, 0.42, 1.0], b: [0.55, 0.42, 1.12], dur: 3, anchor: [540, 1120] });
    shade157(0, 1000, 0.8); tag(t); hook(t, EP.hook, 440); realBadge(t, 0.3, 'REAL PHOTO · LIVE SEA PIG, 4,200 FT', 1500); }; };

VIS[0] = S(() => { const cu = sw('cucumber', 1.2), lg = sw('legs', 3.2), wa = sw('water', 3.8);
  return vscene(0, N157, { ph: 'pig', o: { box: [40, 330, 1000, 1150] }, a: [0.75, 0.56, 1.0], b: [0.75, 0.6, 1.12], badge: 'SCIENTIFIC ILLUSTRATION', k: [[0.6, 'ding', 0.9], [cu, 'pop', 0.8], [lg, 'swish', 0.9], [wa, 'bubble', 0.8]],
    x: (t, P) => { if (!P) return;
      { const [x, y] = P(0.755, 0.875); ring(t, 0.5, x, y, 70, { color: RED, spot: false }); chip('BREATHES HERE', 270, 1250, t, 0.6, { size: 40, bg: RED, fg: '#FFF' }); }
      { const [x, y] = P(0.755, 0.27); callout(t, 0.9, [x, y], 230, 640, 'MOUTH', { bg: '#9ED8FF' }); }
      if (t > cu) chip('SEA CUCUMBER · 4–6 IN', 540, 1430, t, cu, { size: 40, bg: GOLD, fg: BG });
      if (t > lg) { const [x1, y1] = P(0.88, 0.67), [x2, y2] = P(0.61, 0.5); callout(t, lg, [x1, y1], 760, 520, 'WATER-PUMPED', { bg: PINK157 }); callout(t, lg + 0.15, [x2, y2], 190, 900, 'LEGS', { bg: PINK157 }); } } }); });

VIS[1] = S(() => { const cr = sw('crabs', 0.8), pr = sw('predators', 2.4);
  return vscene(1, N157, { ph: 'crab', o: { box: [0, 330, 1080, 1150] }, a: [0.5, 0.5, 1.0], b: [0.6, 0.52, 1.35], badge: 'REAL PHOTO · NOAA/MBARI', k: [[cr, 'hit', 1], [pr, 'thump', 0.8]],
    x: (t, P) => { if (!P) return; const [x, y] = P(0.62, 0.53); ring(t, cr, x, y, 190, { color: RED, spot: false });
      if (t > cr) chip('BABY CRAB', x, y - 260, t, cr + 0.1, { size: 44, bg: RED, fg: '#FFF' });
      if (t > pr) chip('🛡 SAFE FROM PREDATORS', 540, 1430, t, pr, { size: 38, bg: GOLD, fg: BG }); } }); });

VIS[2] = S(() => { const sm = sw('smell', 1.4), wh = sw('whale', 2.4);
  return (K) => { ks(K, [[0.1, 'whoosh', 0.8], [sm, 'swish', 0.8], [wh, 'boom', 0.9]]);
    return (t) => { deep157(t, '#04182A', '#010409');
      g.save(); g.translate(0, -180); g.fillStyle = SAND157; g.beginPath(); g.moveTo(0, 1250); g.quadraticCurveTo(540, 1200, 1080, 1260); g.lineTo(1080, 2200); g.lineTo(0, 2200); g.fill();
      // the whale fall: spine + ribs on the seafloor, right side
      const wa = clamp((t - wh + 0.6) / 0.6); g.save(); g.globalAlpha = 0.35 + 0.65 * wa; g.strokeStyle = '#E8E0D0'; g.lineCap = 'round';
      g.lineWidth = 14; g.beginPath(); g.moveTo(560, 1225); g.quadraticCurveTo(820, 1180, 1080, 1215); g.stroke();
      g.lineWidth = 9; for (let k = 0; k < 9; k++) { const x = 600 + k * 52; g.beginPath(); g.moveTo(x, 1215 - k * 2); g.quadraticCurveTo(x - 30, 1120 - Math.sin(k / 8 * 3.14) * 40, x + 10, 1240); g.stroke(); }
      g.beginPath(); g.ellipse(560, 1215, 60, 30, -0.2, 0, 6.283); g.stroke(); g.restore();
      // smell: wavy scent lines drifting left from the whale
      if (t > sm) { g.save(); g.strokeStyle = 'rgba(180,255,200,0.55)'; g.lineWidth = 4; for (let k = 0; k < 5; k++) { const ph = ((t - sm) * 0.5 + k / 5) % 1;
        g.globalAlpha = 0.7 * (1 - ph); g.beginPath(); for (let x = 0; x < 260; x += 10) { const X = 700 - ph * 500 - x, Y = 1120 - k * 40 + Math.sin(x / 30 + t * 3) * 10; x ? g.lineTo(X, Y) : g.moveTo(X, Y); } g.stroke(); } g.restore(); }
      // three sea pigs walking towards it
      const walk = clamp(t / 4); for (const [x0, y0, s] of [[60, 1250, 1.3], [240, 1300, 1.0], [-80, 1330, 0.9]]) pig157(x0 + walk * 200, y0 - 40 * s, s, t); g.restore();
      tag(t, 2, N157); fact2(t, 0.3, 'IT SMELLS', 'ITS FOOD.', null, { y: 540 });
      if (t > wh) chip('🐋 DEAD WHALE = FEAST', 760, 830, t, wh, { size: 40, bg: GOLD, fg: BG });
      ill157(t); }; }; });

VIS[3] = S(() => { const hu = sw('hundred', 1.2), si = sw('sixteen', 2.2), su = sw('surface', 4.6), ap = sw('apart', 5.4);
  return (K) => { ks(K, [[0.1, 'whoosh', 0.8], [hu, 'pop', 0.9], [si, 'sonar', 0.9], [su, 'swish', 0.9], [ap, 'crack', 1.1]]);
    return (t) => { const up = clamp((t - su) / 0.8), dark = 1 - up;
      deep157(t, up > 0 ? `rgb(${lerp(6, 40, up)},${lerp(34, 120, up)},${lerp(58, 170, up)})` : '#06223A', '#010409');
      // depth gauge (left)
      const gx = 130, gy0 = 380, gy1 = 1300, d = (t < su ? clamp((t - si + 0.3) / 1.0) : 1 - up), my = lerp(gy0, gy1, d);
      g.save(); g.strokeStyle = 'rgba(255,255,255,0.35)'; g.lineWidth = 4; g.beginPath(); g.moveTo(gx, gy0); g.lineTo(gx, gy1); g.stroke();
      for (let k = 0; k <= 4; k++) { const y = lerp(gy0, gy1, k / 4); g.beginPath(); g.moveTo(gx - 14, y); g.lineTo(gx + 14, y); g.stroke(); text(`${(k * 4100).toLocaleString('en-US')} ft`, gx + 28, y + 10, 'mono', 24, 'rgba(255,255,255,0.6)'); }
      g.restore(); g.save(); g.fillStyle = GOLD; g.beginPath(); g.moveTo(gx - 34, my - 18); g.lineTo(gx - 6, my); g.lineTo(gx - 34, my + 18); g.fill(); g.restore();
      if (t > si && t < su + 0.5) chip(`${Math.round(16400 * d).toLocaleString('en-US')} FT`, 560, 420, t, si, { size: 56, bg: GOLD, fg: BG });
      // the herd: 600 dots that pop in on "hundred"
      if (t < su + 0.4) { const n = Math.round(600 * clamp((t - hu + 0.3) / 0.9)); g.save(); g.globalAlpha = 0.9 * (1 - clamp((t - su) / 0.4));
        for (let i = 0; i < n; i++) { const [u, v, w] = HERD157[i]; g.fillStyle = PINK157; g.beginPath(); g.ellipse(330 + u * 680, 620 + v * 560, 9 + w * 5, 5 + w * 3, 0, 0, 6.283); g.fill(); } g.restore();
        if (t > hu) chip('HERDS OF UP TO 600', 670, 1260, t, hu, { size: 38, bg: PINK157, fg: BG }); }
      // brought up: one big pig falls apart into drifting pieces
      if (t > su) { const pa = clamp((t - ap) / 1.4), cx = 640, cy = 900;
        if (pa <= 0) pig157(cx, cy, 3.2, t, clamp((t - su) / 0.3));
        else { const r = rng(57); for (let k = 0; k < 40; k++) { const an = r() * 6.283, sp = 80 + r() * 260, x = cx + (r() - 0.5) * 360 + Math.cos(an) * sp * pa, y = cy + (r() - 0.5) * 160 + Math.sin(an) * sp * pa + pa * pa * 120;
          g.save(); g.globalAlpha = 0.85 * (1 - pa * 0.6); g.fillStyle = PINK157; g.translate(x, y); g.rotate(an + pa * 3); g.beginPath(); g.ellipse(0, 0, 10 + r() * 22, 6 + r() * 12, 0, 0, 6.283); g.fill(); g.restore(); }
          chip('FALLS APART', 640, 1260, t, ap, { size: 50, bg: RED, fg: '#FFF' }); }
        ill157(t, 1350); }
      tag(t, 3, N157); }; }; });
