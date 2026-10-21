// Wiki Roulette #177 — OCEAN: hagfish. Frame 1 = the real purple hagfish (NOAA/OOI) + "slime grows 10,000× in 0.4 s" →
// real photos of a seal shark biting a hagfish (Zintzen et al.): the slime clogs its gills, it lets go → real lab footage: the hagfish ties
// itself in a knot to strip off its own slime → drawn Highway 101 spill, 7,500 lb (ILLUSTRATION) → real photo of a fisherman with a handful of
// black hagfish: "eel skin" wallets are hagfish → question.
const N177 = 4, SLIME177 = '#DDF3E4', ROAD177 = '#2A2D33';

const ill177 = (t, y = 1590) => text('ILLUSTRATION', 1000, y, 'mono', 22, 'rgba(255,255,255,0.55)', { ls: 3, align: 'right' });

// a slime cloud that swells from a point (p 0 … 1)
function slime177(x, y, r, p, a = 0.8) { if (p <= 0) return; g.save(); g.globalAlpha = a;
  for (let k = 0; k < 9; k++) { const ang = k * 0.7, rr = r * p * (0.55 + 0.25 * Math.sin(k * 2.3));
    const gr = g.createRadialGradient(x + Math.cos(ang) * rr * 0.5, y + Math.sin(ang) * rr * 0.4, 0, x + Math.cos(ang) * rr * 0.5, y + Math.sin(ang) * rr * 0.4, rr);
    gr.addColorStop(0, 'rgba(235,250,240,0.75)'); gr.addColorStop(1, 'rgba(220,243,228,0)'); g.fillStyle = gr;
    g.beginPath(); g.arc(x + Math.cos(ang) * rr * 0.5, y + Math.sin(ang) * rr * 0.4, rr, 0, 6.283); g.fill(); }
  g.restore(); }

// glossy slime puddle spreading along the road from the truck (p 0 … 1), and a coat over the car
function goo177(t, p) { if (p <= 0) return; g.save(); g.fillStyle = 'rgba(214,240,222,0.82)'; g.beginPath(); const x0 = 240, L = 640 * p;
  g.moveTo(x0, 1150); for (let k = 0; k <= 20; k++) { const x = x0 + L * k / 20; g.lineTo(x, 1150 - 18 - 14 * Math.sin(k * 1.7 + t * 2)); }
  for (let k = 20; k >= 0; k--) { const x = x0 + L * k / 20; g.lineTo(x, 1250 + 26 * Math.sin(k * 1.3 + t * 1.5) + 40 * Math.sin(k / 20 * 3.14)); } g.closePath(); g.fill();
  g.fillStyle = 'rgba(255,255,255,0.5)'; for (let k = 0; k < 6; k++) { g.beginPath(); g.ellipse(x0 + L * (0.1 + k * 0.15), 1180 + (k % 2) * 30, 30 * p, 7, 0, 0, 6.283); g.fill(); }
  g.restore(); }
function goo177car(t, p) { g.save(); g.fillStyle = 'rgba(214,240,222,0.85)'; g.beginPath(); g.moveTo(740, 1215); g.quadraticCurveTo(760, 1090 - 30 * p, 865, 1080 - 20 * p);
  g.quadraticCurveTo(980, 1090 - 30 * p, 990, 1215); g.closePath(); g.globalAlpha = p; g.fill();
  g.fillStyle = 'rgba(214,240,222,0.85)'; for (const dx of [770, 830, 900, 960]) { g.beginPath(); g.ellipse(dx, 1215, 12, 26 * p, 0, 0, 6.283); g.fill(); } g.restore(); }

// a side-view truck (facing right) with an open, tipped tank
function truck177(x, y, tilt) { g.save(); g.translate(x, y); g.rotate(tilt);
  g.fillStyle = '#C9CED6'; rrect(-260, -150, 330, 130, 16); g.fill();                      // trailer box
  g.fillStyle = '#E2E6EC'; rrect(80, -120, 130, 100, 14); g.fill();                         // cab
  g.fillStyle = '#7FB4E0'; rrect(150, -105, 48, 40, 6); g.fill();                           // window
  g.fillStyle = '#111'; for (const wx of [-200, -40, 150]) { g.beginPath(); g.arc(wx, -10, 34, 0, 6.283); g.fill(); }
  g.fillStyle = '#666'; for (const wx of [-200, -40, 150]) { g.beginPath(); g.arc(wx, -10, 13, 0, 6.283); g.fill(); }
  g.restore(); }

// ---------- scenes ----------
VIS.open = (K) => { const te = sw('ten', 0.9), ha = sw('half', 2.6); K(0.15, 'hit', 1.2); K(0.2, 'mute', 1, 0.4); K(te, 'boom', 1); K(ha, 'ding', 0.9);
  return (t) => { atmosphere(t); const P = shot(t, 'sea', { a: [0.79, 0.82, 1.0], b: [0.8, 0.82, 1.12], dur: 3.5, anchor: [480, 1300] });
    tag(t); hook(t, EP.hook, 440);
    if (P) { const [x, y] = P(0.845, 0.83); slime177(x, y, 240, easeOut((t - te) / 0.4)); }
    if (t > te) { const n = Math.round(Math.pow(10, 4 * clamp((t - te) / 0.4))); chip('×' + n.toLocaleString('en-US'), 540, 960, t, te, { size: 64, bg: SLIME177, fg: BG }); }
    if (t > ha) chip('⏱ 0.4 SECONDS', 540, 1080, t, ha, { size: 38, bg: RED, fg: '#FFF' });
    realBadge(t, 0.3, 'REAL PHOTO · HAGFISH, ~2,600 FT DOWN', 1180); }; };

VIS[0] = S(() => { const jw = sw('jaws', 1.0), sh = sw('shark', 1.8), cl = sw('clogs', 2.6), go = sw('go', 4.0);
  return (K) => { ks(K, [[0.1, 'whoosh', 0.8], [jw, 'pop', 0.8], [sh, 'hit', 1.1], [cl, 'swish', 0.9], [go, 'whoosh', 1]]);
    return (t) => { atmosphere(t);
      const late = t > go, P = late ? shot(t, 'det', { box: [40, 720, 1000, 640], a: [0.87, 0.75, 2.6], b: [0.87, 0.75, 2.75], dur: 2, t0: go })
                                    : shot(t, 'det', { box: [40, 720, 1000, 640], a: [0.87, 0.25, 2.6], b: [0.87, 0.27, 2.75], dur: Math.max(1, cl), credit: 'Photos: Zintzen et al. / CC BY-SA 2.5' });
      tag(t, 0, N177); realBadge(t, 0.3, late ? 'REAL PHOTO · WRECKFISH SPITS IT OUT' : 'REAL PHOTO · SEAL SHARK BITES A HAGFISH');
      if (t < jw) fact2(t, 0.3, 'MEET THE', 'HAGFISH', null, { y: 470, size: 120, c2: SLIME177 });
      else fact2(t, jw, 'NO JAWS.', 'JUST SLIME.', null, { y: 470, size: 120, c2: SLIME177 });
      if (P && t > cl && !late) { const [x, y] = P(0.8, 0.34); ring(t, cl, x, y, 130, { color: SLIME177, spot: false }); chip('SLIME CLOGS ITS GILLS', 540, 1430, t, cl + 0.1, { size: 38, bg: SLIME177, fg: BG }); }
      if (late) chip('IT LETS GO', 540, 1430, t, go + 0.1, { size: 44, bg: GOLD, fg: BG }); }; }; });

VIS[1] = S(() => { const kn = sw('knot', 1.8), sc = sw('scrape', 3.8);
  return vscene(1, N177, { clip: 'knot', o: { box: [40, 720, 1000, 640], credit: 'Video: Böni et al., Sci. Rep. 2016 / CC BY 4.0' }, a: [0.6, 0.45, 1.25], b: [0.62, 0.45, 1.35], dur: 6,
    foot: 'REAL FOOTAGE · HAGFISH IN A LAB TANK', k: [[0.3, 'whoosh', 0.7], [kn, 'pop', 1], [sc, 'swish', 1]],
    f2: ['IT TIES', 'ITSELF IN A KNOT', null, kn, { y: 470, size: 110, c2: SLIME177 }],
    x: (t) => { if (t > sc) chip('🧽 SCRAPES THE SLIME OFF', 540, 1430, t, sc, { size: 38, bg: SLIME177, fg: BG }); } }); });

VIS[2] = S(() => { const sp = sw('spilled', 1.8), hw = sw('Highway', 3.2), ca = sw('car', 4.8);
  return (K) => { ks(K, [[0.1, 'whoosh', 0.8], [sp, 'crack', 1.1], [hw, 'hit', 0.9], [ca, 'thump', 1]]);
    return (t) => { const sky = g.createLinearGradient(0, 0, 0, H); sky.addColorStop(0, '#1B2A3A'); sky.addColorStop(1, '#0A1018'); g.fillStyle = sky; g.fillRect(0, 0, W, H);
      g.fillStyle = '#16301E'; g.fillRect(0, 980, W, 600);                                                      // grass verge
      g.fillStyle = ROAD177; g.fillRect(0, 1060, W, 300); g.fillStyle = '#E8C547'; for (let k = 0; k < 8; k++) g.fillRect(k * 150 + 20, 1205, 90, 12);
      const tilt = t > sp ? -0.22 * easeOut((t - sp) / 0.4) : 0; truck177(330, 1150, tilt);
      const sl = clamp((t - sp) / 2.2);                                                                        // slime flows over the road
      goo177(t, sl);
      g.fillStyle = '#B33A3A'; rrect(760, 1130, 210, 70, 18); g.fill(); g.fillStyle = '#7FB4E0'; rrect(800, 1100, 120, 40, 10); g.fill();   // the car
      g.fillStyle = '#111'; for (const wx of [800, 930]) { g.beginPath(); g.arc(wx, 1200, 22, 0, 6.283); g.fill(); }
      if (t > ca) goo177car(t, easeOut((t - ca) / 0.6));
      tag(t, 2, N177); ill177(t);
      fact2(t, 0.3, '2017:', '7,500 LB', null, { y: 470, size: 130, c2: SLIME177 });
      if (t > hw) chip('🛣 U.S. HIGHWAY 101', 540, 860, t, hw, { size: 40, bg: '#FFF', fg: BG });
      if (t > ca) chip('SLIME COVERED A CAR', 540, 1430, t, ca, { size: 40, bg: SLIME177, fg: BG }); }; }; });

VIS[3] = S(() => { const ee = sw('eel', 1.0), wa = sw('wallet', 1.6), ha = sw('hagfish', 3.4);
  return vscene(3, N177, { ph: 'held', o: { box: [40, 720, 1000, 740] }, a: [0.5, 0.45, 1.0], b: [0.5, 0.5, 1.15], dur: 5, badge: 'REAL PHOTO · BLACK HAGFISH, AKA "SLIME EELS"',
    k: [[0.3, 'whoosh', 0.7], [wa, 'pop', 1], [ha, 'hit', 1.1]],
    x: (t, P) => { if (t < ha) fact2(t, ee, '"EEL SKIN"', 'WALLET?', null, { y: 490, size: 110, c2: GOLD });
      else fact2(t, ha, 'IT’S USUALLY', 'HAGFISH.', null, { y: 490, size: 110, c2: SLIME177 });
      if (P && t > ha) { const [x, y] = P(0.48, 0.55); ring(t, ha, x, y, 190, { color: SLIME177, spot: false }); }
      if (t > wa) chip('👛 "EEL SKIN" LEATHER', 540, 1430, t, wa, { size: 38, bg: GOLD, fg: BG }); } }); });
