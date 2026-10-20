// Wiki Roulette #171 — OCEAN: cone snail. Frame 1 = real NOAA photo of a cone snail swallowing a fish + "this snail hunts fish" →
// diagram of the venom apparatus with a drawn harpoon firing out of the mouth → real live geography cone + speed dial to 56 mph →
// textile cone: ~30 people killed, harpoon goes through a wetsuit → geography cone: insulin as a weapon → magician cone shell: painkiller (FDA 2004) → question.
const N171 = 5, VEN171 = '#7CF29A', SHELL171 = '#E9C58A';

const ill171 = (t, y = 1590, str = 'ILLUSTRATION') => text(str, 1000, y, 'mono', 22, 'rgba(255,255,255,0.55)', { ls: 3, align: 'right' });
function shade171(y0, y1, a) { const gr = g.createLinearGradient(0, y0, 0, y1); gr.addColorStop(0, `rgba(0,0,0,${a})`); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(0, y0, W, y1 - y0); }
// a barbed, venom-tipped harpoon flying from (x0,y0) to the right by d px (drawn)
function harpoon171(x0, y0, d, glow) { g.save(); g.translate(x0, y0); g.shadowColor = VEN171; g.shadowBlur = 24 * glow;
  g.strokeStyle = '#F4EEDC'; g.lineWidth = 10; g.lineCap = 'round'; g.beginPath(); g.moveTo(0, 0); g.lineTo(d, 0); g.stroke();
  g.fillStyle = '#F4EEDC'; g.beginPath(); g.moveTo(d + 46, 0); g.lineTo(d - 6, -20); g.lineTo(d + 4, 0); g.lineTo(d - 6, 20); g.closePath(); g.fill();
  g.strokeStyle = '#F4EEDC'; g.lineWidth = 6; for (const s of [-1, 1]) { g.beginPath(); g.moveTo(d - 30, 0); g.lineTo(d - 54, s * 22); g.stroke(); }
  g.fillStyle = VEN171; for (let k = 0; k < 4; k++) { g.globalAlpha = 0.7 * glow; g.beginPath(); g.arc(d + 50 + k * 14, Math.sin(k * 2) * 8, 6 - k, 0, 6.283); g.fill(); }
  g.restore(); }
// speed dial 0 … 60 mph (p = 0 … 1 of 56)
function dial171(x, y, r, p) { g.save(); g.fillStyle = 'rgba(8,8,10,0.8)'; g.beginPath(); g.arc(x, y, r + 24, 0, 6.283); g.fill();
  const a0 = Math.PI * 0.75, span = Math.PI * 1.5, v = 56 * clamp(p);
  g.strokeStyle = 'rgba(255,255,255,0.18)'; g.lineWidth = 18; g.beginPath(); g.arc(x, y, r, a0, a0 + span); g.stroke();
  g.strokeStyle = RED; g.lineCap = 'round'; g.beginPath(); g.arc(x, y, r, a0, a0 + span * v / 60); g.stroke();
  const a = a0 + span * v / 60; g.strokeStyle = TXT; g.lineWidth = 9; g.beginPath(); g.moveTo(x, y); g.lineTo(x + Math.cos(a) * r * 0.78, y + Math.sin(a) * r * 0.78); g.stroke();
  g.restore(); text(`${Math.round(v)}`, x, y + 30, 'disp', 96, TXT, { align: 'center' }); text('MPH', x, y + r - 6, 'mono', 30, TXT, { align: 'center', ls: 4 }); }

// ---------- scenes ----------
VIS.open = (K) => { const hp = sw('harpoon', 1.6); K(0.15, 'hit', 1.2); K(0.2, 'mute', 1, 0.4); K(hp, 'whoosh', 1); K(hp + 0.1, 'hit', 1);
  return (t) => { atmosphere(t); const P = shot(t, 'eat', { box: [40, 720, 1000, 720], a: [0.42, 0.5, 1.0], b: [0.38, 0.52, 1.1], dur: 3 });
    shade171(0, 760, 0.85); tag(t); hook(t, EP.hook, 440);
    if (P && t > 0.9) { const [x, y] = P(0.2, 0.55); ring(t, 0.9, x, y, 150, { color: RED, spot: false }); chip('A FISH, BEING SWALLOWED', 540, 1340, t, 0.95, { size: 38, bg: RED, fg: '#FFF' }); }
    if (t > hp) chip('🎯 WITH A HARPOON', 540, 1495, t, hp, { size: 40, bg: GOLD, fg: BG });
    realBadge(t, 0.3, 'REAL PHOTO · NOAA', 1570); }; };

VIS[0] = S(() => { const to = sw('tooth', 0.8), ba = sw('barbed', 1.6), ve = sw('venom', 2.6), fi = sw('fired', 3.4);
  return (K) => { ks(K, [[0.1, 'whoosh', 0.8], [to, 'pop', 0.9], [ve, 'ding', 0.9], [fi, 'whoosh', 1.1], [fi + 0.25, 'hit', 1]]);
    return (t) => { atmosphere(t); g.save(); g.fillStyle = '#F7F4EC'; rrect(40, 700, 1000, 760, 28); g.fill(); g.restore();
      const P = shot(t, 'appar', { box: [60, 720, 960, 720], a: [0.55, 0.45, 1.0], b: [0.6, 0.45, 1.08], dur: 4 });
      tag(t, 0, N171); fact2(t, 0.3, 'A TOOTH', 'TURNED HARPOON', null, { y: 520, size: 96 });
      if (P) { const [tx, ty] = P(0.88, 0.47), [gx, gy] = P(0.27, 0.6);
        if (t > to) ring(t, to, tx, ty, 90, { color: RED, spot: false });
        if (t > ve) callout(t, ve, [gx, gy], 230, 1560, 'VENOM GLAND', { bg: VEN171 });
        if (t > fi) { const p = easeOut(clamp((t - fi) / 0.3)); g.save(); g.beginPath(); g.rect(40, 700, 1000, 760); g.clip(); harpoon171(tx - 40, ty, 40 + p * 900, 1); g.restore(); } }
      if (t > ba) chip('HOLLOW · BARBED', 830, 1560, t, ba, { size: 34, bg: RED, fg: '#FFF' });
      text('DIAGRAM · CIRCA24, CC BY-SA 3.0', 1000, 1490, 'mono', 20, 'rgba(255,255,255,0.55)', { ls: 2, align: 'right' }); }; }; });

VIS[1] = S(() => { const fi = sw('fifty', 1.2), fa = sw('fastest', 3.0);
  return vscene(1, N171, { ph: 'live', o: { box: [40, 720, 1000, 720] }, a: [0.5, 0.45, 1.1], b: [0.52, 0.45, 1.35], dur: 4, badge: 'REAL PHOTO · GEOGRAPHY CONE, SOLOMON ISLANDS',
    f2: ['UP TO', '56 MPH', null, fi, { y: 520, size: 110 }], k: [[fi, 'boom', 1], [fa, 'hit', 1]],
    x: (t, P) => { if (t > fi) dial171(800, 1200, 140, (t - fi) / 0.9);
      if (t > fa) chip('⚡ ONE OF THE FASTEST ANIMAL MOVES', 540, 1500, t, fa, { size: 36, bg: GOLD, fg: BG }); } }); });

VIS[2] = S(() => { const hu = sw('killed', 0.9), th = sw('thirty', 1.4), we = sw('wetsuit', 3.0);
  return vscene(2, N171, { ph: 'textile', o: { box: [40, 720, 1000, 720] }, a: [0.55, 0.6, 1.0], b: [0.55, 0.6, 1.15], dur: 4, badge: 'REAL PHOTO · TEXTILE CONE',
    f2: ['ABOUT 30 PEOPLE', 'KILLED', null, th, { y: 520, size: 104 }], k: [[hu, 'thump', 0.9], [th, 'boom', 1], [we, 'crack', 1]],
    x: (t, P) => { if (t > we) chip('⚠ STINGS THROUGH A WETSUIT', 540, 1480, t, we, { size: 38, bg: RED, fg: '#FFF' }); } }); });

VIS[3] = S(() => { const ins = sw('insulin', 0.3), ge = sw('geography', 1.6), sh = sw('shock', 3.4);
  return vscene(3, N171, { ph: 'redsea', o: { box: [40, 720, 1000, 720] }, a: [0.45, 0.55, 1.0], b: [0.45, 0.55, 1.15], dur: 4, badge: 'REAL PHOTO · GEOGRAPHY CONE, RED SEA',
    f2: ['INSULIN', 'AS A WEAPON', null, ins, { y: 520, size: 110 }], k: [[ins, 'hit', 1], [ge, 'pop', 0.9], [sh, 'boom', 1]],
    x: (t, P) => { if (!P) return; if (t > ge) { const [x, y] = P(0.45, 0.55); ring(t, ge, x, y, 260, { color: VEN171, spot: false }); chip('GEOGRAPHY CONE', 540, 1360, t, ge + 0.1, { size: 40, bg: VEN171, fg: BG }); }
      if (t > sh) chip('🐟 NEARBY FISH → SHOCK', 540, 1460, t, sh, { size: 40, bg: RED, fg: '#FFF' }); } }); });

VIS[4] = S(() => { const pa = sw('painkiller', 1.8), ap = sw('approved', 2.6);
  return vscene(4, N171, { ph: 'magus', o: { box: [200, 700, 680, 860] }, a: [0.5, 0.5, 0.95], b: [0.5, 0.48, 1.05], dur: 4, badge: 'REAL PHOTO · MAGICIAN CONE SHELL',
    f2: ['VENOM →', 'PAINKILLER', null, pa, { y: 520, size: 110 }], k: [[pa, 'ding', 1.1], [ap, 'hit', 1]],
    x: (t, P) => { if (t > ap) chip('💊 FDA APPROVED · 2004', 540, 1470, t, ap, { size: 40, bg: GOLD, fg: BG }); } }); });
