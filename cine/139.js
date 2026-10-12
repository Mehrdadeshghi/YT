// #139 "A Journey to the Bottom of the Ocean" — 16:9 long-form, no presenter. Real NOAA/Commons footage and photos,
// a depth meter on the right that follows the dive, the water getting darker with depth, marine snow drifting through.
const MAXD = 11000, FR = { x: 60, y: 60, w: 1520, h: 880 };
const ZONES = [[0, 200, 'SUNLIGHT', '#2E8FB8'], [200, 1000, 'TWILIGHT', '#1D5E86'], [1000, 4000, 'MIDNIGHT', '#123A5A'], [4000, 6000, 'ABYSS', '#0C2638'], [6000, 11000, 'HADAL', '#08161F']];
const dY = (d) => 120 + 800 * Math.sqrt(Math.max(0, d) / MAXD);
const DEP = () => EP_RAW.scenes.map((s) => s.depth);
function depthNow(i, lt) { const D = DEP(), to = D[i], from = i > 0 ? D[i - 1] : 0; return lerp(from, to, eO((lt - 0.2) / 1.8)); }
function zoneOf(d) { return ZONES.find((z) => d < z[1]) || ZONES.at(-1); }
const fmtM = (d) => Math.round(d).toLocaleString('en-US') + ' m';

function seaBg(t, d) { const k = clamp(Math.sqrt(d / 2500)); const top = `rgb(${lerp(14, 2, k) | 0},${lerp(58, 8, k) | 0},${lerp(85, 14, k) | 0})`, bot = `rgb(${lerp(6, 1, k) | 0},${lerp(26, 4, k) | 0},${lerp(40, 7, k) | 0})`;
  const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, top); gr.addColorStop(1, bot); g.fillStyle = gr; g.fillRect(0, 0, W, H);
  if (d < 400) { g.save(); g.globalCompositeOperation = 'lighter'; for (let i = 0; i < 6; i++) { const x = 300 + i * 260 + Math.sin(t * 0.3 + i) * 40; const rg = g.createLinearGradient(x, 0, x + 120, H);
      rg.addColorStop(0, `rgba(160,220,255,${0.06 * (1 - d / 400)})`); rg.addColorStop(1, 'rgba(160,220,255,0)'); g.fillStyle = rg; g.beginPath(); g.moveTo(x, 0); g.lineTo(x + 60, 0); g.lineTo(x + 260, H); g.lineTo(x + 120, H); g.fill(); } g.restore(); } }
const SNOWP = []; { const r = rng(77); for (let i = 0; i < 160; i++) SNOWP.push([r() * W, r() * H, 0.3 + r() * 0.7, r() * 6.28]); }
function snow(t, a = 1) { g.save(); for (const [x0, y0, z, ph] of SNOWP) { const y = (y0 + t * 22 * z) % H, x = x0 + Math.sin(t * 0.5 + ph) * 12 * z;
    g.globalAlpha = a * (0.08 + 0.22 * z); g.fillStyle = '#DDEBF2'; g.beginPath(); g.arc(x, y, 1 + 2.2 * z, 0, 6.283); g.fill(); } g.restore(); }
function glowDots(t, d, a = 1) { if (d < 900) return; const r = rng(5); g.save(); g.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 40; i++) { const x = r() * W, y = r() * H, f = Math.max(0, Math.sin(t * (0.6 + r()) + r() * 20)); if (f < 0.6) continue; const c = r() > 0.5 ? '90,200,255' : '80,255,180';
    const gr = g.createRadialGradient(x, y, 0, x, y, 18); gr.addColorStop(0, `rgba(${c},${0.5 * a * (f - 0.6) / 0.4})`); gr.addColorStop(1, `rgba(${c},0)`); g.fillStyle = gr; g.fillRect(x - 18, y - 18, 36, 36); } g.restore(); }
function meter(t, d) { const x = 1732, y = dY(d); g.save();
  ZONES.forEach(([a, b, n, c]) => { g.fillStyle = c; g.fillRect(x - 6, dY(a), 12, dY(b) - dY(a)); ptext(n, x + 22, (dY(a) + dY(b)) / 2 + 6, 16, d >= a && d < b ? PRO.txt : 'rgba(243,247,248,0.35)', { ls: 2, w: 400 }); });
  [0, 1000, 4000, 6000, 11000].forEach((m) => { g.fillStyle = 'rgba(243,247,248,0.4)'; g.fillRect(x - 16, dY(m) - 1, 10, 2); if (Math.abs(dY(m) - y) > 34) ptext(m ? (m / 1000) + ' km' : '0', x - 24, dY(m) + 6, 16, 'rgba(243,247,248,0.5)', { align: 'right' }); });
  g.fillStyle = PRO.acc; g.shadowColor = PRO.acc; g.shadowBlur = 14; g.beginPath(); g.moveTo(x - 10, y); g.lineTo(x - 26, y - 10); g.lineTo(x - 26, y + 10); g.fill(); g.shadowBlur = 0;
  ptext(fmtM(d), x - 34, y + 10, 28, PRO.txt, { align: 'right', w: 800 }); g.restore(); }
// media in the main frame: photo (cover/contain) or real footage (lazy frames); label pill top-left
function media(t, id, o = {}) { const lt = RT ?? t, isClip = !!CLIPN[id];
  const im = isClip ? vidImg(id, Math.floor(Math.max(0, lt - 0.5) * 30 * (o.rate ?? 1))) : PHOTOS[id];
  g.save(); rrect(FR.x, FR.y, FR.w, FR.h, 22); g.fillStyle = '#03080B'; g.fill(); g.clip();
  if (im) { const z = lerp(o.z0 ?? 1.03, o.z1 ?? 1.1, clamp(lt / (o.dur || 9))), fit = o.fit === 'contain' ? Math.min : Math.max;
    const c = o.crop || [0, 0, 1, 1], sx = c[0] * im.width, sy = c[1] * im.height, iw = (c[2] - c[0]) * im.width, ih = (c[3] - c[1]) * im.height;
    const s = fit(FR.w / iw, FR.h / ih) * z, dw = iw * s, dh = ih * s, f = o.focus || [0.5, 0.5];
    const x = o.fit === 'contain' ? FR.x + (FR.w - dw) / 2 : clamp(FR.x + FR.w / 2 - dw * f[0], FR.x + FR.w - dw, FR.x), y = o.fit === 'contain' ? FR.y + (FR.h - dh) / 2 : clamp(FR.y + FR.h / 2 - dh * f[1], FR.y + FR.h - dh, FR.y);
    g.drawImage(im, sx, sy, iw, ih, x, y, dw, dh); }
  const gr = g.createLinearGradient(0, FR.y, 0, FR.y + FR.h); gr.addColorStop(0, 'rgba(3,8,11,0.35)'); gr.addColorStop(0.2, 'rgba(3,8,11,0)'); gr.addColorStop(0.8, 'rgba(3,8,11,0)'); gr.addColorStop(1, 'rgba(3,8,11,0.45)'); g.fillStyle = gr; g.fillRect(FR.x, FR.y, FR.w, FR.h);
  if (o.draw) o.draw(lt);
  g.restore(); g.save(); rrect(FR.x, FR.y, FR.w, FR.h, 22); g.lineWidth = 2; g.strokeStyle = PRO.line; g.stroke(); g.restore();
  if (o.label) pill(o.label, FR.x + 24, FR.y + 40, lt, 0.4, { size: 22, bg: 'rgba(3,8,11,0.75)', color: PRO.txt, align: 'left' }); }
function zoneTitle(t, name, range) { const a = inA(t, 0.3, 0.6) * (1 - inA(t, 3.6, 0.6)); if (a <= 0) return; g.save(); g.globalAlpha = a; g.fillStyle = 'rgba(3,8,11,0.55)'; g.fillRect(FR.x, FR.y, FR.w, FR.h);
  ptext(name, FR.x + FR.w / 2, FR.y + FR.h / 2 + 10, 110, PRO.txt, { align: 'center', w: 800, ls: 6 }); ptext(range, FR.x + FR.w / 2, FR.y + FR.h / 2 + 80, 40, PRO.acc, { align: 'center', ls: 4 }); g.restore(); }
function chips(t, list, y0 = FR.y + FR.h - 60) { list.forEach(([at, s, col], i) => { if (t > at) pill(s, FR.x + 30, y0 - (list.length - 1 - i) * 66, t, at, { size: 30, bg: 'rgba(3,8,11,0.85)', color: col || PRO.txt, align: 'left' }); }); }
// one scene = background + media + overlays + meter
function scene(i, m, o = {}) { return S(() => (K, Sc) => { const tm = o.at ? Object.fromEntries(Object.entries(o.at).map(([k, [w, f]]) => [k, sw(w, f)])) : {}; if (o.sfx) o.sfx(K, tm);
  return (t) => { const lt = RT ?? t, d = depthNow(i, lt); seaBg(t, d); glowDots(t, d, 0.8); snow(t, 0.7);
    media(t, m, Object.assign({}, o, { draw: o.draw ? (l) => o.draw(t, l, tm) : null })); if (o.over) o.over(t, tm); if (o.zone) zoneTitle(lt, o.zone[0], o.zone[1]); meter(t, d); }; }); }
VIS.open = (K) => { K(0.05, 'swish', 0.4);
  return (t) => { seaBg(t, 0); snow(t, 0.5); media(t, 'surface', { focus: [0.5, 0.45], z0: 1.0, z1: 1.08, dur: 5, draw: () => { g.fillStyle = 'rgba(3,8,11,0.45)'; g.fillRect(FR.x, FR.y, FR.w, FR.h); } });
    const a = inA(t, 0.2, 0.6); g.save(); g.globalAlpha = a; ptext('A JOURNEY TO THE', FR.x + FR.w / 2, 430, 46, 'rgba(243,247,248,0.9)', { align: 'center', ls: 8 }); rich('Bottom of the *Ocean*', FR.x + FR.w / 2, 540, 110, { align: 'center' }); g.restore();
    if (t > 1.2) bigText(t, 1.2, '0 → *11,000 m*', FR.x + FR.w / 2, 660, 60); meter(t, Math.min(11000, Math.max(0, (t - 1.2) * 4000)) * (t < 4 ? 1 : 0)); }; };

// --- scenes (index = scene number in episodes/139.json) ---------------------------------------------------------
VIS[0] = scene(0, 'surface', { focus: [0.5, 0.6], z0: 1.1, z1: 1.25, label: 'Real photo · the surface', draw: (t, lt) => { const k = clamp((lt - 1) / 5);
  const gr = g.createLinearGradient(0, FR.y, 0, FR.y + FR.h); gr.addColorStop(0, `rgba(3,8,11,${0.2 + 0.5 * k})`); gr.addColorStop(1, `rgba(3,8,11,${0.5 + 0.48 * k})`); g.fillStyle = gr; g.fillRect(FR.x, FR.y, FR.w, FR.h);
  bigText(lt, 1.0, `Light: *${Math.max(1, Math.round(100 * Math.pow(0.01, k)))}%*`, FR.x + FR.w / 2, FR.y + FR.h / 2, 96); } });
VIS[1] = scene(1, 'jelly', { zone: ['THE TWILIGHT ZONE', '200 – 1,000 m'], label: 'Real footage · NOAA Ocean Exploration · Marianas, 2016' });
function migration(t, lt, night) { g.fillStyle = '#04111B'; g.fillRect(FR.x, FR.y, FR.w, FR.h); const r = rng(9), up = 0.5 + 0.5 * Math.sin(lt * 0.9 - 1.2);
  g.fillStyle = 'rgba(243,247,248,0.25)'; g.fillRect(FR.x, FR.y + 120, FR.w, 2); ptext('SURFACE', FR.x + 30, FR.y + 108, 22, PRO.mute, { ls: 3 }); ptext('≈ 500 m', FR.x + 30, FR.y + FR.h - 40, 22, PRO.mute, { ls: 3 });
  ptext(up > 0.5 ? '☾  NIGHT' : '☀  DAY', FR.x + FR.w - 40, FR.y + 70, 34, up > 0.5 ? '#AFC8FF' : '#FFD27A', { align: 'right', w: 800 });
  for (let i = 0; i < 260; i++) { const x = FR.x + 40 + r() * (FR.w - 80), deep = FR.y + FR.h * (0.62 + r() * 0.32), high = FR.y + 140 + r() * FR.h * 0.25, y = lerp(deep, high, ease(clamp(up * 1.2 - r() * 0.2)));
    g.fillStyle = i % 9 ? 'rgba(150,220,255,0.75)' : PRO.acc; g.beginPath(); g.arc(x, y, 3 + r() * 3, 0, 6.283); g.fill(); } }
VIS[2] = scene(2, 'chimaera', { draw: (t, lt) => migration(t, lt) });
VIS[3] = scene(3, 'chimaera', { draw: (t, lt, tm) => { migration(t, lt + 2); if (lt > tm.lg) { g.fillStyle = `rgba(4,17,27,${0.85 * clamp((lt - tm.lg) / 0.4)})`; g.fillRect(FR.x, FR.y + 340, FR.w, 130); bigText(lt, tm.lg, 'The *largest migration* on Earth', FR.x + FR.w / 2, FR.y + 430, 76); } }, at: { lg: ['largest', 1.6] } });
VIS[4] = scene(4, 'lantern', { focus: [0.5, 0.5], label: 'Real photo · lanternfish, NE Atlantic', over: (t, tm) => chips(t, [[tm.ph, 'Covered in light organs'], [tm.sx, 'Up to 65% of deep-sea fish biomass', PRO.acc]]), at: { ph: ['organs', 2.0], sx: ['sixty', 4.2] } });
VIS[5] = scene(5, 'photo', { focus: [0.5, 0.45], z0: 1.0, z1: 1.3, label: 'Real photo · the light organs of a lanternfish' });
VIS[6] = scene(6, 'hatchet', { focus: [0.5, 0.5], label: 'Real photo · hatchetfish, glowing belly', over: (t, tm) => { if (t > tm.be) chips(t, [[tm.be, 'Counter-illumination: light as camouflage', PRO.acc]]); }, at: { be: ['belly', 2.4] } });
VIS[7] = scene(7, 'barrel', { focus: [0.45, 0.5], z0: 1.0, z1: 1.2, label: 'Real photo · barreleye specimen (trawl catch)', over: (t, tm) => chips(t, [[tm.tr, 'Transparent dome over the head'], [tm.ey, 'Tube-shaped eyes look up', PRO.acc]]), at: { tr: ['transparent', 1.4], ey: ['eyes', 3.0] } });
VIS[8] = scene(8, 'barrelill', { fit: 'contain', z0: 0.95, z1: 1.0, label: 'Illustration · Macropinna microstoma', draw: (t, lt) => { const a = 0.5 + 0.5 * Math.sin(lt * 1.5); g.save(); g.strokeStyle = PRO.acc; g.lineWidth = 4; g.setLineDash([12, 10]);
  const cx = FR.x + FR.w * 0.28, cy = FR.y + FR.h * 0.42; g.beginPath(); g.arc(cx, cy, 120, -Math.PI / 2 - 0.2 - a * 1.2, -Math.PI / 2 + 0.2 - a * 1.2); g.stroke(); g.restore(); } });
VIS[9] = scene(9, 'siph', { focus: [0.5, 0.5], label: 'Real footage still · physonect siphonophore · NOAA, Puerto Rico 2015', over: (t, tm) => chips(t, [[tm.sw, 'Some parts swim'], [tm.st, 'some sting'], [tm.di, 'some digest', PRO.acc]]), at: { sw: ['swim', 5.0], st: ['sting', 5.6], di: ['digest', 6.2] } });
VIS[10] = scene(10, 'praya', { focus: [0.5, 0.5], label: 'Real photo · giant siphonophore (Praya dubia)', draw: (t, lt, tm) => { if (lt < tm.fs) return; const p = eO((lt - tm.fs) / 1.5), x0 = FR.x + 80, y = FR.y + FR.h - 200, sc = 26;
  g.fillStyle = 'rgba(3,8,11,0.7)'; g.fillRect(FR.x, y - 100, FR.w, 230); g.fillStyle = PRO.acc; rrect(x0, y - 40, 47 * sc * p, 34, 17); g.fill(); ptext('Siphonophore ring · ≈ 47 m', x0, y - 56, 28, PRO.txt, { w: 800 });
  g.fillStyle = '#5B7CFF'; rrect(x0, y + 50, 30 * sc * p, 34, 17); g.fill(); ptext('Blue whale · ≈ 30 m', x0, y + 120, 28, PRO.txt, { w: 800 }); }, at: { fs: ['forty', 3.6] } });
VIS[11] = scene(11, 'medusa', { zone: ['THE MIDNIGHT ZONE', '1,000 – 4,000 m'], label: 'Real footage · NOAA Ocean Exploration · Puerto Rico' });
VIS[12] = scene(12, 'medusa2', { label: 'Real footage · NOAA Ocean Exploration', draw: (t, lt, tm) => { if (lt < tm.tq) return; const p = eO((lt - tm.tq) / 1.2), cx = FR.x + FR.w - 300, cy = FR.y + 300;
  g.fillStyle = 'rgba(3,8,11,0.75)'; g.beginPath(); g.arc(cx, cy, 190, 0, 6.283); g.fill(); g.strokeStyle = PRO.dim; g.lineWidth = 26; g.beginPath(); g.arc(cx, cy, 140, 0, 6.283); g.stroke();
  g.strokeStyle = PRO.acc; g.beginPath(); g.arc(cx, cy, 140, -Math.PI / 2, -Math.PI / 2 + 6.283 * 0.76 * p); g.stroke(); ptext(Math.round(76 * p) + '%', cx, cy + 22, 70, PRO.txt, { align: 'center', w: 800 });
  g.fillStyle = 'rgba(3,8,11,0.85)'; rrect(cx - 170, cy + 205, 340, 54, 27); g.fill(); ptext('make their own light', cx, cy + 241, 28, PRO.txt, { align: 'center', w: 800 }); }, at: { tq: ['three', 2.4] } });
VIS[13] = scene(13, 'vamp', { fit: 'contain', z0: 0.92, z1: 1.0, label: 'Illustration · vampire squid (Carl Chun, 1911)', over: (t, tm) => chips(t, [[tm.bl, "Doesn't drink blood"], [tm.sn, 'Eats marine snow', PRO.acc]]), at: { bl: ['blood', 2.8], sn: ['snow', 4.2] } });
VIS[14] = scene(14, 'vamp2', { fit: 'contain', z0: 0.95, z1: 1.05, label: 'Illustration · vampire squid', over: (t, tm) => chips(t, [[tm.ox, 'Almost no oxygen'], [tm.ey, 'Largest eyes for its body size', PRO.acc]]), at: { ox: ['oxygen', 2.0], ey: ['eyes', 4.0] } });
VIS[15] = scene(15, 'vamp2', { fit: 'contain', z0: 1.05, z1: 1.15, label: 'Illustration · vampire squid', draw: (t, lt, tm) => { if (lt < tm.mu) return; const p = lt - tm.mu, r = rng(3); g.save(); g.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 140; i++) { const a = r() * 6.283, s = (0.3 + r()) * 260 * eO(p / 2.5), x = FR.x + FR.w * 0.62 + Math.cos(a) * s, y = FR.y + FR.h * 0.5 + Math.sin(a) * s * 0.7;
    const gr = g.createRadialGradient(x, y, 0, x, y, 14); gr.addColorStop(0, `rgba(90,190,255,${0.9 * clamp(1.6 - p / 3)})`); gr.addColorStop(1, 'rgba(90,190,255,0)'); g.fillStyle = gr; g.fillRect(x - 14, y - 14, 28, 28); } g.restore(); }, at: { mu: ['mucus', 2.4] } });
VIS[16] = scene(16, 'snow', { z0: 1.16, z1: 1.22, focus: [0.5, 0.42], label: 'Real footage · marine snow · NOAA', over: (t, tm) => chips(t, [[tm.we, 'Some flakes fall for weeks', PRO.acc]]), at: { we: ['weeks', 6.0] } });
VIS[17] = scene(17, 'chimaera', { rate: 0.8, label: 'Real footage · rhinochimera · NOAA Okeanos Explorer, 2013', draw: (t, lt) => snow(t + lt, 1) });
VIS[18] = scene(18, 'eel', { fit: 'contain', z0: 0.98, z1: 1.08, label: 'Real photo · pelican eel specimen (Smithsonian)', over: (t, tm) => chips(t, [[tm.mo, 'Mouth far larger than its head', PRO.acc]]), at: { mo: ['mouth', 4.0] } });
VIS[19] = scene(19, 'eelx', { fit: 'contain', z0: 0.95, z1: 1.05, label: 'X-ray · pelican eel (Smithsonian)', over: (t, tm) => chips(t, [[tm.sw, 'Can swallow prey larger than itself', PRO.acc]]), at: { sw: ['swallow', 2.6] } });
VIS[20] = scene(20, 'abyss', { zone: ['THE ABYSS', '4,000 – 6,000 m'], label: 'Real footage · abyssal plain · Ifremer ROV Victor 6000',
  over: (t, tm) => chips(t, [[tm.si, '≈ 60% of Earth\'s surface'], [tm.de, '2–3 °C'], [tm.pr, 'Up to ≈ 750× surface pressure', PRO.acc]]), at: { si: ['sixty', 4.6], de: ['degrees', 7.0], pr: ['pressure', 8.6] } });
VIS[21] = scene(21, 'casper', { label: 'Real footage · NOAA Okeanos Explorer · Hawaii, 2016', over: (t, tm) => chips(t, [[tm.fo, 'More than 4,000 m deep', PRO.acc]]), at: { fo: ['thousand', 4.0] } });
VIS[22] = scene(22, 'seapig', { focus: [0.5, 0.5], label: 'Real photo · sea pigs (Scotoplanes) · NOAA/MBARI' });
VIS[23] = scene(23, 'tripod', { focus: [0.5, 0.5], label: 'Real photo · tripod fish · NOAA, 1,960 m', over: (t, tm) => chips(t, [[tm.me, 'Fin rays up to ≈ 1 m'], [tm.cu, 'Faces the current', PRO.acc]]), at: { me: ['meter', 3.4], cu: ['current', 4.8] } });
VIS[24] = scene(24, 'dumbo', { focus: [0.5, 0.45], z0: 1.0, z1: 1.18, label: 'Real photo · dumbo octopus · NOAA Okeanos Explorer' });
VIS[25] = scene(25, 'dumbo2', { focus: [0.5, 0.5], label: 'Real photo · dumbo octopus · NOAA', over: (t, tm) => { if (t > tm.se) bigText(t, tm.se, 'down to *7,000 m*', FR.x + FR.w / 2, FR.y + FR.h - 90, 70); }, at: { se: ['seven', 1.0] } });
VIS[26] = scene(26, 'sponge', { focus: [0.5, 0.5], label: "Real photo · Venus' flower basket · NOAA, Gulf of Mexico", over: (t, tm) => chips(t, [[tm.gl, 'Skeleton made of glass (silica)', PRO.acc]]), at: { gl: ['glass', 2.6] } });
VIS[27] = scene(27, 'shrimp', { focus: [0.5, 0.5], z0: 1.0, z1: 1.25, label: 'Real photo · a shrimp trapped inside the sponge · NOAA', over: (t, tm) => chips(t, [[tm.jp, 'Japan: a symbol of a couple for life', PRO.acc]]), at: { jp: ['japan', 6.0] } });
function trench(t, lt) { g.fillStyle = '#050D12'; g.fillRect(FR.x, FR.y, FR.w, FR.h); const y0 = FR.y + 160, sy = (FR.h - 220) / 11000, X = (u) => FR.x + 60 + u * (FR.w - 120), p = eO(lt / 2);
  g.fillStyle = '#16303D'; g.beginPath(); g.moveTo(X(0), y0 + 4500 * sy); g.lineTo(X(0.42), y0 + 6000 * sy); g.lineTo(X(0.5), y0 + 6000 * sy + (11000 - 6000) * sy * p); g.lineTo(X(0.58), y0 + 6000 * sy); g.lineTo(X(1), y0 + 4200 * sy);
  g.lineTo(X(1), FR.y + FR.h); g.lineTo(X(0), FR.y + FR.h); g.fill(); g.fillStyle = 'rgba(46,143,184,0.25)'; g.fillRect(FR.x, y0 - 6, FR.w, 6);
  [0, 4000, 6000, 11000].forEach((m) => { g.fillStyle = 'rgba(243,247,248,0.25)'; g.fillRect(FR.x + 20, y0 + m * sy, FR.w - 40, 1); ptext(m.toLocaleString('en-US') + ' m', FR.x + 30, y0 + m * sy - 8, 22, PRO.mute); }); }
VIS[28] = scene(28, 'abyss', { zone: ['THE HADAL ZONE', '6,000 – 11,000 m'], draw: (t, lt) => { if (lt > 4) trench(t, lt - 4); },
  over: (t, tm) => chips(t, [[tm.qu, '< 0.25% of the seafloor'], [tm.fo, '> 40% of the depth range', PRO.acc]]), at: { qu: ['quarter', 6.0], fo: ['forty', 9.0] } });
VIS[29] = scene(29, 'abyss', { draw: (t, lt) => { trench(t, 3); const cx = FR.x + FR.w / 2, cy = FR.y + FR.h / 2; g.fillStyle = 'rgba(5,13,18,0.7)'; g.fillRect(FR.x, FR.y, FR.w, FR.h);
  const p = eO(lt / 3); for (let i = 0; i < 8; i++) { const a = i / 8 * 6.283, r = lerp(420, 270, p); g.save(); g.translate(cx + Math.cos(a) * r, cy + Math.sin(a) * r); g.rotate(a + Math.PI); g.fillStyle = PRO.hi; g.beginPath(); g.moveTo(0, 0); g.lineTo(-40, -18); g.lineTo(-40, 18); g.fill(); g.restore(); }
  bigText(lt, 0.6, '> *1,000×*', cx, cy + 30, 110, { acc: PRO.hi }); ptext('the pressure at the surface', cx, cy + 100, 32, PRO.mute, { align: 'center' }); } });
VIS[30] = scene(30, 'snail', { crop: [0.07, 0.75, 0.99, 0.995], fit: 'contain', z0: 0.95, z1: 1.05, label: 'Real photo · Mariana snailfish, caught at 7,966 m (Gerringer et al., 2017)', over: (t, tm) => chips(t, [[tm.ei, 'Caught at ≈ 7,966 m'], [tm.pr, 'Top predator of the trench', PRO.acc]], FR.y + 200), at: { ei: ['eight', 3.0], pr: ['predator', 6.0] } });
VIS[31] = scene(31, 'snail', { crop: [0.07, 0.31, 0.99, 0.735], focus: [0.45, 0.45], z0: 1.0, z1: 1.12, label: 'Real photo · hadal snailfish at a baited camera, Mariana Trench (Gerringer et al., 2017)', draw: (t, lt, tm) => { if (lt < tm.ei) return; g.fillStyle = 'rgba(3,8,11,0.7)'; g.fillRect(FR.x, FR.y + FR.h - 200, FR.w, 200);
  bigText(lt, tm.ei, '*8,336 m* · deepest fish ever filmed', FR.x + FR.w / 2, FR.y + FR.h - 80, 72); }, at: { ei: ['eight', 1.6] } });
VIS[32] = scene(32, 'amphi', { focus: [0.5, 0.5], label: 'Real photo · Hirondellea gigas, from 10,900 m (Mariana Trench)', over: (t, tm) => chips(t, [[tm.wo, 'Can digest sunken wood', PRO.acc]]), at: { wo: ['wood', 6.0] } });
VIS[33] = scene(33, 'duo', { label: 'Real footage · Duobrachium sparksae, a new species first seen in 2015 · NOAA' });
VIS[34] = scene(34, 'casper2', { label: 'Real footage · NOAA Okeanos Explorer · Hawaii, 2016' });
