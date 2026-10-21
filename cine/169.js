// #169 "A Journey Down to the Titanic" — 16:9 long-form, no presenter (built like #139). Real 1912 photos + newsreel, real NOAA
// wreck photos (2003/2004), deep-sea footage on the way down, drawn graphics labelled GRAPHIC / ILLUSTRATION.
// A depth meter in FEET on the right follows the bow's fall from the surface to the wreck at ~12,500 ft.
const MAXD169 = 13000, FR169 = WIDE ? { x: 60, y: 60, w: 1520, h: 880 } : { x: 40, y: 300, w: 1000, h: 1040 };
const ZONES169 = [[0, 650, 'SUNLIGHT', '#2E8FB8'], [650, 3300, 'TWILIGHT', '#1D5E86'], [3300, 13000, 'MIDNIGHT', '#0E2C44']];
const RUST169 = '#C2622D', ICE169 = '#BFE6FF';
const dY169 = (d) => 120 + 800 * Math.sqrt(Math.max(0, d) / MAXD169);
function depth169(i, lt) { const S0 = EP_RAW.scenes, k = Math.max(0, S0.findIndex((s, j) => (s.vis ?? j) === i)), to = S0[k].depth, from = k > 0 ? S0[k - 1].depth : (EP_RAW.depth_open ?? 0);
  return from - to > 5000 ? to : lerp(from, to, eO((lt - 0.2) / 2.2)); }
const ft169 = (d) => Math.round(d).toLocaleString('en-US') + ' ft';

function sea169(t, d) { const k = clamp(Math.sqrt(d / 4000)); const top = `rgb(${lerp(14, 2, k) | 0},${lerp(58, 8, k) | 0},${lerp(85, 14, k) | 0})`, bot = `rgb(${lerp(6, 1, k) | 0},${lerp(26, 4, k) | 0},${lerp(40, 7, k) | 0})`;
  const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, top); gr.addColorStop(1, bot); g.fillStyle = gr; g.fillRect(0, 0, W, H); }
const SNOW169 = []; { const r = rng(169); for (let i = 0; i < 150; i++) SNOW169.push([r() * W, r() * H, 0.3 + r() * 0.7, r() * 6.28]); }
function snow169(t, a = 1) { g.save(); for (const [x0, y0, z, ph] of SNOW169) { const y = (y0 + t * 22 * z) % H, x = x0 + Math.sin(t * 0.5 + ph) * 12 * z;
    g.globalAlpha = a * (0.08 + 0.22 * z); g.fillStyle = '#DDEBF2'; g.beginPath(); g.arc(x, y, 1 + 2.2 * z, 0, 6.283); g.fill(); } g.restore(); }
function meter169(t, d) { if (!WIDE) return meterTall169(t, d); const x = 1732, y = dY169(d); g.save();
  ZONES169.forEach(([a, b, n, c]) => { g.fillStyle = c; g.fillRect(x - 6, dY169(a), 12, dY169(b) - dY169(a)); ptext(n, x + 22, (dY169(a) + dY169(b)) / 2 + 6, 16, d >= a && d < b ? PRO.txt : 'rgba(243,247,248,0.35)', { ls: 2, w: 400 }); });
  [0, 3300, 6500, 13000].forEach((m) => { g.fillStyle = 'rgba(243,247,248,0.4)'; g.fillRect(x - 16, dY169(m) - 1, 10, 2); if (Math.abs(dY169(m) - y) > 34) ptext(m ? m.toLocaleString('en-US') : '0', x - 24, dY169(m) + 6, 16, 'rgba(243,247,248,0.5)', { align: 'right' }); });
  const yw = dY169(12500); g.strokeStyle = RUST169; g.lineWidth = 3; g.beginPath(); g.moveTo(x + 10, yw); g.lineTo(x + 34, yw); g.stroke(); ptext('TITANIC', x + 40, yw + 6, 16, RUST169, { ls: 2, w: 800 });
  g.fillStyle = PRO.acc; g.shadowColor = PRO.acc; g.shadowBlur = 14; g.beginPath(); g.moveTo(x - 10, y); g.lineTo(x - 26, y - 10); g.lineTo(x - 26, y + 10); g.fill(); g.shadowBlur = 0;
  ptext(ft169(d), x - 34, y + 10, 28, PRO.txt, { align: 'right', w: 800 }); g.restore(); }
function meterTall169(t, d) { const x0 = 90, x1 = 990, y = 1440, X = (m) => x0 + (x1 - x0) * Math.sqrt(Math.max(0, m) / MAXD169); g.save();
  ptext('DEPTH', FR169.x + 6, 168, 26, 'rgba(243,247,248,0.6)', { ls: 6 }); ptext(ft169(d), FR169.x, 262, 92, PRO.txt, { w: 700 });
  ZONES169.forEach(([a, b, n, c]) => { g.fillStyle = c; g.fillRect(X(a), y - 7, X(b) - X(a), 14); });
  const xm = X(d); g.fillStyle = PRO.acc; g.beginPath(); g.moveTo(xm, y - 10); g.lineTo(xm - 12, y - 30); g.lineTo(xm + 12, y - 30); g.fill(); g.restore(); }

// main frame: photo/footage (cover or contain), optional drawing on top, label pill top-left
function media169(t, id, o = {}) { const lt = RT ?? t, isClip = !!CLIPN[id];
  const im = id ? (isClip ? vidImg(id, Math.floor(Math.max(0, lt - 0.5) * 30 * (o.rate ?? 1))) : PHOTOS[id]) : null;
  g.save(); rrect(FR169.x, FR169.y, FR169.w, FR169.h, 22); g.fillStyle = o.bg || '#03080B'; g.fill(); g.clip();
  if (im) { const z = lerp(o.z0 ?? 1.03, o.z1 ?? 1.1, clamp(lt / (o.dur || 9))), fit = o.fit === 'contain' ? Math.min : Math.max;
    const c = o.crop || [0, 0, 1, 1], sx = c[0] * im.width, sy = c[1] * im.height, iw = (c[2] - c[0]) * im.width, ih = (c[3] - c[1]) * im.height;
    const s = fit(FR169.w / iw, FR169.h / ih) * z, dw = iw * s, dh = ih * s, f = (!WIDE && o.tfocus) || o.focus || [0.5, 0.5];
    const x = o.fit === 'contain' ? FR169.x + (FR169.w - dw) / 2 : clamp(FR169.x + FR169.w / 2 - dw * f[0], FR169.x + FR169.w - dw, FR169.x), y = o.fit === 'contain' ? FR169.y + (FR169.h - dh) / 2 : clamp(FR169.y + FR169.h / 2 - dh * f[1], FR169.y + FR169.h - dh, FR169.y);
    if (o.filter) g.filter = o.filter; g.drawImage(im, sx, sy, iw, ih, x, y, dw, dh); g.filter = 'none';
    if (o.dark) { g.fillStyle = `rgba(3,8,11,${o.dark})`; g.fillRect(FR169.x, FR169.y, FR169.w, FR169.h); } }
  const gr = g.createLinearGradient(0, FR169.y, 0, FR169.y + FR169.h); gr.addColorStop(0, 'rgba(3,8,11,0.35)'); gr.addColorStop(0.2, 'rgba(3,8,11,0)'); gr.addColorStop(0.8, 'rgba(3,8,11,0)'); gr.addColorStop(1, 'rgba(3,8,11,0.45)'); g.fillStyle = gr; g.fillRect(FR169.x, FR169.y, FR169.w, FR169.h);
  if (o.draw) o.draw(lt);
  g.restore(); g.save(); rrect(FR169.x, FR169.y, FR169.w, FR169.h, 22); g.lineWidth = 2; g.strokeStyle = PRO.line; g.stroke(); g.restore();
  if (o.label) pill(o.label, FR169.x + 24, FR169.y + 40, lt, 0.4, { size: 22, bg: 'rgba(3,8,11,0.75)', color: PRO.txt, align: 'left' }); }
function zoneTitle169(t, name, range) { const a = inA(t, 0.3, 0.6) * (1 - inA(t, 3.6, 0.6)); if (a <= 0) return; g.save(); g.globalAlpha = a; g.fillStyle = 'rgba(3,8,11,0.55)'; g.fillRect(FR169.x, FR169.y, FR169.w, FR169.h);
  ptext(name, FR169.x + FR169.w / 2, FR169.y + FR169.h / 2 + 10, 110, PRO.txt, { align: 'center', w: 800, ls: 6 }); if (range) ptext(range, FR169.x + FR169.w / 2, FR169.y + FR169.h / 2 + 80, 40, PRO.acc, { align: 'center', ls: 4 }); g.restore(); }
function chips169(t, list, y0 = FR169.y + FR169.h - 60) { list.forEach(([at, s, col], i) => { if (t > at) pill(s, FR169.x + 30, y0 - (list.length - 1 - i) * 66, t, at, { size: 30, bg: 'rgba(3,8,11,0.85)', color: col || PRO.txt, align: 'left' }); }); }
// chapter card: dark fade with the chapter name for the first seconds of a chapter's first scene
function chapter169(t, n, name) { if (EP_RAW.from_long) return; const a = inA(t, 0.15, 0.5) * (1 - inA(t, 3.0, 0.6)); if (a <= 0) return; g.save(); g.globalAlpha = a; g.fillStyle = 'rgba(3,8,11,0.72)'; g.fillRect(FR169.x, FR169.y, FR169.w, FR169.h);
  ptext('CHAPTER ' + n, FR169.x + FR169.w / 2, FR169.y + FR169.h / 2 - 50, 30, PRO.acc, { align: 'center', ls: 8 }); ptext(name.toUpperCase(), FR169.x + FR169.w / 2, FR169.y + FR169.h / 2 + 40, 92, PRO.txt, { align: 'center', w: 800, ls: 4 }); g.restore(); }
function scene169(i, m, o = {}) { return S(() => (K, Sc) => { const tm = o.at ? Object.fromEntries(Object.entries(o.at).map(([k, [w, f]]) => [k, sw(w, f)])) : {}; if (o.sfx) o.sfx(K, tm);
  return (t) => { const lt = RT ?? t, d = depth169(i, lt); sea169(t, d); snow169(t, 0.6);
    media169(t, m, Object.assign({}, o, { draw: o.draw ? (l) => o.draw(t, l, tm) : null })); if (o.over) o.over(lt, tm); if (o.zone) zoneTitle169(lt, o.zone[0], o.zone[1]); if (o.ch) chapter169(lt, o.ch[0], o.ch[1]); meter169(t, d); }; }); }
const CX169 = FR169.x + FR169.w / 2, CY169 = FR169.y + FR169.h / 2;
function dark169() { g.fillStyle = '#04111B'; g.fillRect(FR169.x, FR169.y, FR169.w, FR169.h); }

// ---- drawn ship parts (side view, bow to the right). hull(x, y, len, o): o.part = 'all' | 'bow' | 'stern'
function hull169(x, y, L, o = {}) { const h = L * 0.075, part = o.part || 'all', brk = 0.58; g.save(); g.translate(x, y); if (o.rot) g.rotate(o.rot);
  const x0 = part === 'bow' ? L * brk : 0, x1 = part === 'stern' ? L * brk : L;
  g.beginPath(); g.moveTo(x0, 0); g.lineTo(x1, 0); if (x1 === L) { g.lineTo(L + h * 0.25, -h * 0.05); g.lineTo(L, h); } else g.lineTo(x1, h);
  if (x0 === 0) { g.lineTo(h * 0.6, h); g.quadraticCurveTo(-h * 0.4, h * 0.6, -h * 0.2, 0); } else g.lineTo(x0, h); g.closePath();
  g.fillStyle = o.fill || '#14191C'; g.fill(); g.strokeStyle = o.stroke || 'rgba(243,247,248,0.55)'; g.lineWidth = 2; g.stroke();
  g.fillStyle = '#E9E4D8'; g.fillRect(Math.max(x0, L * 0.06), -h * 0.32, Math.min(x1, L * 0.92) - Math.max(x0, L * 0.06), h * 0.32);    // superstructure
  if (!o.noFunnels) [0.25, 0.42, 0.59, 0.76].forEach((f, k) => { const fx = L * f; if (fx < x0 || fx > x1 || (o.lost && o.lost[k])) return; g.save(); g.translate(fx, -h * 0.32); g.rotate(-0.12);
    g.fillStyle = '#E8A33C'; g.fillRect(-h * 0.22, -h * 1.05, h * 0.44, h * 1.05); g.fillStyle = '#111'; g.fillRect(-h * 0.22, -h * 1.05, h * 0.44, h * 0.28); g.restore(); });
  if (o.compartments) { const n = 16; for (let k = 0; k < n; k++) { const cx = L * (k + 0.5) / n * 0.96 + L * 0.02, w = L * 0.96 / n; const flooded = n - 1 - k < o.compartments;
      g.fillStyle = flooded ? `rgba(255,90,78,${0.35 + 0.35 * (o.pulse ?? 1)})` : 'rgba(243,247,248,0.06)'; g.fillRect(cx - w / 2 + 2, h * 0.15, w - 4, h * 0.75); } }
  g.restore(); }

// ---- opener: the bow photo in the dark, title, depth counting down to the wreck
VIS.open = (K) => { K(0.05, 'swish', 0.4); const ho = EP_RAW.hookOpen;
  if (ho) { K(0.3, 'boom', 0.8); return (t) => { const d = EP_RAW.depth_open ?? 12500; sea169(t, d); snow169(t, 0.7);     // 9:16 cut-downs #174–#176: hook over a real photo
      media169(t, ho.m, Object.assign({ z0: 1.05, z1: 1.2, dur: 4 }, ho, { draw: () => { g.fillStyle = 'rgba(3,8,11,0.4)'; g.fillRect(FR169.x, FR169.y, FR169.w, FR169.h); } }));
      const a = inA(t, 0.1, 0.3); g.save(); g.globalAlpha = a; (EP.hook || []).forEach((ln, i) => rich(ln, CX169, FR169.y + 200 + i * 104, 88, { align: 'center' })); g.restore(); meter169(t, d); }; }
  K(1.2, 'boom', 0.6);
  return (t) => { const d = 12500; sea169(t, d); snow169(t, 0.7);
    media169(t, 'bow', { focus: [0.5, 0.5], z0: 1.18, z1: 1.04, dur: 9, dark: 0.35 + 0.3 * (1 - inA(t, 0.2, 2.5)), label: 'Real photo · the bow of the Titanic, 2004 · NOAA / Institute for Exploration / URI' });
    g.save(); g.globalAlpha = inA(t, 0.4, 0.8); ptext('A JOURNEY DOWN TO THE', CX169, FR169.y + 170, 44, 'rgba(243,247,248,0.92)', { align: 'center', ls: 10 }); rich('*Titanic*', CX169, FR169.y + 290, 130, { align: 'center' }); g.restore();
    if (t > 1.2) bigText(t, 1.2, `*${Math.round(12500 * eO((t - 1.2) / 2.5)).toLocaleString('en-US')} ft* down`, CX169, FR169.y + FR169.h - 80, 64);
    meter169(t, 12500 * eO((t - 1.2) / 2.5)); }; };
VIS.thumb = (K) => (t) => { sea169(0, 12500); media169(9, 'bow', { focus: [0.5, 0.5], z0: 1.1, z1: 1.1, dark: 0.15 });
  g.save(); g.fillStyle = 'rgba(3,8,11,0.55)'; g.fillRect(FR169.x, FR169.y + FR169.h - 300, FR169.w, 300); g.restore();
  rich('*12,500 FT* DOWN', CX169, FR169.y + 150, 120, { align: 'center' }); rich("And it's *disappearing.*", CX169, FR169.y + FR169.h - 110, 96, { align: 'center', acc: PRO.hi }); meter169(0, 12500); };

// ---- scenes (key = "vis" of the scene in episodes/169.json) -------------------------------------------------------------
VIS.eat = scene169('eat', 'rust', { focus: [0.5, 0.5], z0: 1.0, z1: 1.2, dark: 0.15, label: 'Real photo · rusticles on the Titanic, 2003 · NOAA', over: (t, tm) => { if (t > tm.ea) bigText(t, tm.ea, 'What is *eating* it?', CX169, FR169.y + FR169.h - 90, 72); }, at: { ea: ['eating', 2.4] } });
// chapter 1 — the last night
VIS.soton = scene169('soton', 'soton', { focus: [0.5, 0.5], z0: 1.0, z1: 1.12, ch: [1, 'The last night'], label: 'Real photo · Titanic leaves Southampton, April 10, 1912',
  over: (t, tm) => chips169(t, [[tm.la, 'Largest ship afloat'], [tm.ei, '882 ft long', PRO.acc]]), at: { la: ['largest', 5.6], ei: ['eight', 7.0] } });
VIS.dock = scene169('dock', 'dock', { label: 'Real footage · 1911–12 newsreel (British Pathé / Gaumont)', over: (t, tm) => chips169(t, [[tm.tw, '2,208 people on board', PRO.acc]]), at: { tw: ['two', 1.4] } });
VIS.ice = scene169('ice', 'ice', { label: 'Real footage · ice field and icebergs, 1912 newsreel', sfx: (K, tm) => K(tm.ic, 'hit', 0.5),
  over: (t, tm) => { if (t > tm.ic) bigText(t, tm.ic, '*11:40 PM* · April 14', CX169, FR169.y + FR169.h - 90, 76); }, at: { ic: ['iceberg', 3.0] } });
VIS.comp = scene169('comp', null, { label: 'Graphic · the 16 watertight compartments', draw: (t, lt, tm) => { dark169(); const p = lt > tm.si ? 0.5 + 0.5 * Math.sin(lt * 3) : 0;
    hull169(FR169.x + 150, CY169 - 20, 1220, { compartments: lt > tm.si ? Math.min(6, Math.floor((lt - tm.si) * 6) + 1) : 0, pulse: p, noFunnels: false });
    ptext('BOW →', FR169.x + FR169.w - 60, CY169 + 180, 26, PRO.mute, { align: 'right', ls: 3 });
    if (lt > tm.fo) { g.save(); g.strokeStyle = PRO.acc; g.lineWidth = 4; g.setLineDash([10, 8]); const xa = FR169.x + 150 + 1220 * (1 - 4 / 16 * 0.96) - 1220 * 0.02; g.beginPath(); g.moveTo(xa, CY169 - 120); g.lineTo(xa, CY169 + 130); g.stroke(); g.restore();
      ptext('Built to float with 4', xa - 20, CY169 - 140, 30, PRO.acc, { align: 'right' }); } },
  over: (t, tm) => chips169(t, [[tm.si, '6 of 16 compartments open', PRO.red]]), at: { si: ['six', 2.6], fo: ['four', 6.0] } });
VIS.boats = scene169('boats', 'boat', { focus: [0.5, 0.5], dark: 0.25, label: 'Real photo · the last lifeboat launched from the Titanic, April 15, 1912', draw: (t, lt, tm) => { if (lt < tm.ro) return; const p = eO((lt - tm.ro) / 1.4), x0 = FR169.x + 80, y = FR169.y + FR169.h - 250, sc = (FR169.w - 160) / 2208;
    g.fillStyle = 'rgba(3,8,11,0.78)'; g.fillRect(FR169.x, y - 90, FR169.w, 260);
    g.fillStyle = PRO.dim; rrect(x0, y - 30, 2208 * sc, 40, 20); g.fill(); ptext('People on board · 2,208', x0, y - 44, 28, PRO.txt, { w: 800 });
    g.fillStyle = PRO.acc; rrect(x0, y + 60, 1178 * sc * p, 40, 20); g.fill(); ptext('Lifeboat seats · 1,178', x0, y + 140, 28, PRO.acc, { w: 800 }); }, at: { ro: ['room', 2.0] } });
VIS.sink = scene169('sink', 'stower', { focus: [0.5, 0.45], z0: 1.0, z1: 1.15, label: 'Illustration · "Untergang der Titanic", Willy Stöwer, 1912', draw: (t, lt, tm) => { const cx = FR169.x + FR169.w - 220, cy = FR169.y + 220, p = clamp((lt - 0.5) / 4);
    g.fillStyle = 'rgba(3,8,11,0.78)'; g.beginPath(); g.arc(cx, cy, 150, 0, 6.283); g.fill(); g.strokeStyle = PRO.dim; g.lineWidth = 18; g.beginPath(); g.arc(cx, cy, 110, 0, 6.283); g.stroke();
    g.strokeStyle = PRO.hi; g.beginPath(); g.arc(cx, cy, 110, -Math.PI / 2, -Math.PI / 2 + 6.283 * (160 / 720) * p); g.stroke();
    const mins = Math.round(160 * p), hh = (23 + Math.floor((40 + mins) / 60)) % 24, mm = (40 + mins) % 60; ptext(`${hh % 12 || 12}:${String(mm).padStart(2, '0')}`, cx, cy + 22, 64, PRO.txt, { align: 'center', w: 800 });
    ptext(hh >= 12 && hh < 24 && hh !== 0 ? 'PM' : 'AM', cx, cy + 66, 22, PRO.mute, { align: 'center', ls: 4 }); },
  over: (t, tm) => { if (t > tm.tw) chips169(t, [[tm.tw, '2 h 40 min', PRO.hi]]); }, at: { tw: ['forty', 2.0] } });
VIS.cold = scene169('cold', 'nyt', { fit: 'contain', z0: 0.98, z1: 1.06, bg: '#E9E4D8', label: 'Real newspaper · The New York Times, April 15, 1912',
  over: (t, tm) => chips169(t, [[tm.tf, 'Water: 28 °F'], [tm.fi, '≈ 1,500 died', PRO.red]]), at: { tf: ['twenty', 0.8], fi: ['fifteen', 3.2] } });
VIS.carp = scene169('carp', 'carp', { label: 'Real footage · the Carpathia nears New York with the survivors, April 1912 (newsreel)', over: (t, tm) => chips169(t, [[tm.fo, 'Arrives around 4 AM'], [tm.se, '≈ 705–710 survivors', PRO.acc]]), at: { fo: ['four', 0.8], se: ['seven', 4.8] } });
VIS.surv = scene169('surv', 'surv', { focus: [0.5, 0.45], z0: 1.0, z1: 1.12, dark: 0.1, label: 'Real photo · survivors aboard the Carpathia, 1912',
  over: (t, tm) => { if (t > tm.on) bigText(t, tm.on, 'It did not sink in *one piece.*', CX169, FR169.y + FR169.h - 90, 70); }, at: { on: ['one', 4.0] } });
// chapter 2 — the fall
VIS.plan = scene169('plan', 'plan', { fit: 'contain', z0: 0.97, z1: 1.0, bg: '#0B1418', ch: [2, 'The fall'], label: 'Real plan · Titanic side plan (1912)', draw: (t, lt, tm) => { if (lt < tm.tw) return;
    const x = FR169.x + FR169.w * 0.51, a = clamp((lt - tm.tw) / 0.8); g.save(); g.strokeStyle = PRO.red; g.lineWidth = 6; g.setLineDash([16, 10]); g.globalAlpha = a; g.beginPath(); g.moveTo(x, CY169 - 250); g.lineTo(x - 20, CY169 + 250); g.stroke(); g.restore();
    pill('BROKE HERE', x, CY169 - 270, lt, tm.tw, { size: 28, bg: PRO.red, color: '#FFF', align: 'center' }); }, at: { tw: ['two', 2.4] } });
// the bow falling at ~45° (drawn), funnels sweeping away later
function fall169(lt, o = {}) { dark169(); const p = o.p ?? (0.1 + 0.5 * clamp(lt / 9)), L = 1150, a = 0.62, d = L * 0.79;
  const cx = FR169.x + 420 + 620 * p, cy = FR169.y + 120 + 520 * p, ox = cx - Math.cos(a) * d, oy = cy - Math.sin(a) * d;
  g.save(); g.strokeStyle = 'rgba(243,247,248,0.22)'; g.setLineDash([8, 12]); g.lineWidth = 3; g.beginPath(); g.moveTo(FR169.x + 300, FR169.y - 20); g.lineTo(FR169.x + 1300, FR169.y + 900); g.stroke(); g.restore();
  for (let k = 0; k < 14; k++) { const q = k / 14; g.fillStyle = `rgba(200,235,255,${0.25 * (1 - q)})`; g.beginPath(); g.arc(cx - 260 - k * 34 + Math.sin(lt * 3 + k) * 10, cy - 200 - k * 30, 4 + (k % 3) * 3, 0, 6.283); g.fill(); }   // bubbles trailing behind
  hull169(ox, oy, L, { part: 'bow', rot: a, lost: o.lost, fill: '#22282B' }); return [cx, cy]; }
VIS.bow45 = scene169('bow45', null, { label: 'Illustration · the bow sinking (not to scale)', draw: (t, lt, tm) => { fall169(lt);
    if (lt > tm.fo) { const cx = FR169.x + 360, cy = FR169.y + 40; g.save(); g.strokeStyle = PRO.acc; g.lineWidth = 4; g.beginPath(); g.moveTo(cx, cy); g.lineTo(cx + 260, cy); g.stroke(); g.beginPath(); g.arc(cx, cy, 200, 0, 0.74); g.stroke(); g.restore(); ptext('≈ 45°', cx + 230, cy + 110, 48, PRO.acc, { w: 800 }); }
    if (lt > tm.si) chips169(lt, [[tm.si, '1 ft forward for every 6 ft down', PRO.acc]]); }, at: { fo: ['forty', 3.0], si: ['six', 6.4] } });
VIS.light = scene169('light', 'jelly', { label: 'Real footage · NOAA Ocean Exploration', draw: (t, lt) => { const k = clamp((lt - 0.5) / 4.5);
    g.fillStyle = `rgba(3,8,11,${0.15 + 0.6 * k})`; g.fillRect(FR169.x, FR169.y, FR169.w, FR169.h);
    bigText(lt, 0.8, `Sunlight: *${Math.max(1, Math.round(100 * Math.pow(0.01, k)))}%*`, CX169, CY169, 96); } });
VIS.funnels = scene169('funnels', null, { label: 'Illustration · the bow sinking (not to scale)', draw: (t, lt, tm) => { const lost = [1, 1, lt > tm.fu, lt > tm.fu + 0.4];
    const [bx, by] = fall169(lt, { p: 0.3 + 0.2 * clamp(lt / 7), lost });
    [2, 3].forEach((k) => { if (lt < tm.fu + (k - 2) * 0.4) return; const q = lt - tm.fu - (k - 2) * 0.4; g.save(); g.translate(bx - 160 - (3 - k) * 150 - q * 50, by - 200 - q * 45 + q * q * 6); g.rotate(q * 1.2 + k);
      g.fillStyle = '#E8A33C'; g.globalAlpha = clamp(1.4 - q * 0.25); g.fillRect(-18, -50, 36, 100); g.fillStyle = '#111'; g.fillRect(-18, -50, 36, 26); g.restore(); });
    if (lt > tm.ma) chips169(lt, [[tm.fu, 'Funnels swept away'], [tm.ma, 'Foremast falls onto the bridge', PRO.hi]]); else if (lt > tm.fu) chips169(lt, [[tm.fu, 'Funnels swept away']]); }, at: { fu: ['funnels', 1.6], ma: ['foremast', 3.6] } });
VIS.midnight = scene169('midnight', 'medusa', { zone: ['THE MIDNIGHT ZONE', '3,300 – 13,000 ft'], label: 'Real footage · NOAA Ocean Exploration · Puerto Rico',
  over: (t, tm) => { if (t > 4.5) chips169(t, [[tm.an, 'The only light: animals', PRO.acc]]); }, at: { an: ['animals', 7.0] } });
VIS.stern = scene169('stern', null, { label: 'Illustration · the stern sinking (not to scale)', draw: (t, lt, tm) => { dark169(); const y = FR169.y + 240 + lt * 22;
    hull169(FR169.x + 520, y, 700, { part: 'stern', rot: -0.35, fill: '#1A1F22' });
    if (lt > tm.im) { const q = lt - tm.im, r = rng(15); g.save(); g.globalCompositeOperation = 'lighter'; for (let i = 0; i < 70; i++) { const a = r() * 6.283, s = (0.3 + r()) * 330 * eO(q / 1.2);
        const x = FR169.x + 720 + Math.cos(a) * s, yy = y + 30 + Math.sin(a) * s * 0.6; g.fillStyle = `rgba(200,235,255,${0.7 * clamp(1.5 - q / 2)})`; g.beginPath(); g.arc(x, yy, 4 + r() * 10, 0, 6.283); g.fill(); } g.restore(); } },
  sfx: (K, tm) => { K(tm.im, 'boom', 0.7); }, over: (t, tm) => chips169(t, [[tm.ai, 'Air trapped inside'], [tm.im, 'Imploded under pressure', PRO.red]]), at: { ai: ['air', 2.0], im: ['imploded', 5.0] } });
VIS.explode = scene169('explode', 'boat', { focus: [0.5, 0.55], z0: 1.15, z1: 1.25, dark: 0.35, label: 'Real photo · a lifeboat, April 15, 1912',
  over: (t, tm) => { if (t > tm.te) bigText(t, tm.te, '*~10 seconds* later: explosions', CX169, CY169, 76); }, at: { te: ['ten', 2.6] } });
VIS.spiral = scene169('spiral', null, { label: 'Illustration · the stern spiraling down (not to scale)', draw: (t, lt) => { dark169(); const p = clamp(lt / 6), cx = CX169, top = FR169.y + 120;
    g.save(); g.strokeStyle = 'rgba(243,247,248,0.2)'; g.setLineDash([6, 10]); g.lineWidth = 3; g.beginPath(); for (let k = 0; k <= 200; k++) { const q = k / 200, x = cx + Math.sin(q * 18) * 160 * (1 - q * 0.3), y = top + q * 700; k ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke(); g.restore();
    const x = cx + Math.sin(p * 18) * 160 * (1 - p * 0.3), y = top + p * 700; g.save(); g.translate(x, y); g.scale(Math.cos(p * 18), 1); g.fillStyle = '#1A1F22'; g.strokeStyle = 'rgba(243,247,248,0.6)'; g.lineWidth = 2; rrect(-150, -26, 300, 52, 10); g.fill(); g.stroke(); g.restore(); },
  over: (t, tm) => chips169(t, [[tm.he, 'Rotating like a helicopter blade', PRO.acc]]), at: { he: ['helicopter', 3.0] } });
VIS.impact = scene169('impact', null, { label: 'Graphic · the bow hits the seabed', draw: (t, lt, tm) => { dark169(); const floor = FR169.y + 560, p = eO(clamp((lt - 0.4) / 2.2));
    g.fillStyle = '#2A2620'; g.fillRect(FR169.x, floor, FR169.w, FR169.h - (floor - FR169.y)); g.fillStyle = '#3A342B'; g.fillRect(FR169.x, floor, FR169.w, 6);
    const L169 = WIDE ? 900 : 1300, hx169 = WIDE ? FR169.x + 200 : FR169.x + (FR169.w - 0.42 * L169) / 2 - 0.58 * L169;      // tall: centre the bow piece
    hull169(hx169, floor - 40 + 60 * p - 300 * (1 - p), L169, { part: 'bow', rot: 0.1 * (1 - p) + 0.02, lost: [1, 1, 1, 1], fill: '#1A1F22' });
    if (lt > tm.si) { const x = FR169.x + FR169.w - 210; g.strokeStyle = PRO.hi; g.lineWidth = 3; g.beginPath(); g.moveTo(x, floor); g.lineTo(x, floor + 130); g.stroke(); ptext('~60 ft into the mud', x - 16, floor + 180, 34, PRO.hi, { align: 'right', w: 800 }); } },
  sfx: (K) => K(2.4, 'boom', 0.8), over: (t, tm) => { if (t > tm.tw) bigText(t, tm.tw, '*23 mph*', CX169, FR169.y + 170, 110); }, at: { tw: ['twenty', 1.8], si: ['sixty', 4.4] } });
VIS.pancake = scene169('pancake', null, { label: 'Graphic · the stern decks pancaked', draw: (t, lt, tm) => { dark169(); const floor = FR169.y + FR169.h - 120, p = eO(clamp((lt - tm.co) / 1.2));
    for (let k = 0; k < 7; k++) { const y = lerp(floor - 80 - k * 80, floor - 14 - k * 16, p); g.fillStyle = k % 2 ? '#3B3F42' : '#2C3134'; g.fillRect(CX169 - 420 + k * 6, y, 840 - k * 12, lerp(60, 14, p)); }
    g.fillStyle = '#2A2620'; g.fillRect(FR169.x, floor, FR169.w, 120);
    if (lt > tm.fo) { g.strokeStyle = PRO.acc; g.lineWidth = 3; g.beginPath(); g.moveTo(CX169 + 470, floor - 16); g.lineTo(CX169 + 470, floor); g.stroke(); ptext('≤ 1 ft per deck', CX169 + 490, floor - 2, 34, PRO.acc, { w: 800 }); } },
  sfx: (K, tm) => K(tm.co, 'crack', 0.6), at: { co: ['collapsed', 2.2], fo: ['foot', 5.8] } });
VIS.years73 = scene169('years73', 'abyss', { dark: 0.45, z0: 1.2, z1: 1.24, label: 'Real footage · North Atlantic abyssal seafloor · Ifremer', over: (t, tm) => { if (t > tm.se) bigText(t, tm.se, '1912 → 1985 · *73 years*', CX169, CY169, 84); }, at: { se: ['seventy', 2.0] } });
// chapter 3 — lost for 73 years
VIS.pingpong = scene169('pingpong', null, { ch: [3, 'Lost for 73 years'], label: 'Graphic · ping-pong balls vs. the pressure', draw: (t, lt, tm) => { dark169(); const r = rng(21), cr = lt > tm.cr ? eO((lt - tm.cr) / 0.8) : 0;
    for (let i = 0; i < 90; i++) { const x = FR169.x + 120 + r() * (FR169.w - 240), y = FR169.y + 150 + r() * (FR169.h - 300), rr = 22 + r() * 6;
      g.save(); g.translate(x, y); g.scale(1, 1 - 0.75 * cr * (0.6 + 0.4 * r())); g.fillStyle = '#F4F1EA'; g.beginPath(); g.arc(0, 0, rr, 0, 6.283); g.fill(); g.restore(); }
    if (cr > 0) ptext('CRUSHED', CX169, CY169 + 30, 120, PRO.red, { align: 'center', w: 800, ls: 8, alpha: cr }); }, sfx: (K, tm) => K(tm.cr, 'crack', 0.6), at: { cr: ['crushed', 6.0] } });
VIS.nitrogen = scene169('nitrogen', 'berg', { focus: [0.5, 0.5], dark: 0.3, label: 'Real photo · an iceberg near the wreck site, April 15, 1912',
  over: (t, tm) => chips169(t, [[tm.ha, '500,000 tons of liquid nitrogen'], [tm.fl, 'Never built', PRO.hi]]), at: { ha: ['half', 3.0], fl: ['float', 6.0] } });
VIS.psi = scene169('psi', null, { label: 'Graphic · pressure at the wreck', draw: (t, lt) => { dark169(); const p = eO(lt / 3);
    for (let i = 0; i < 8; i++) { const a = i / 8 * 6.283, r = lerp(400, 260, p); g.save(); g.translate(CX169 + Math.cos(a) * r, CY169 + Math.sin(a) * r); g.rotate(a + Math.PI); g.fillStyle = PRO.hi; g.beginPath(); g.moveTo(0, 0); g.lineTo(-40, -18); g.lineTo(-40, 18); g.fill(); g.restore(); }
    bigText(lt, 0.6, '> *6,000 psi*', CX169, CY169 + 10, 110, { acc: PRO.hi }); ptext('≈ 400 × the pressure at the surface', CX169, CY169 + 90, 34, PRO.mute, { align: 'center' }); } });
VIS.monkey = scene169('monkey', null, { label: 'Graphic · the search area', draw: (t, lt, tm) => { dark169(); g.strokeStyle = 'rgba(56,224,123,0.12)'; g.lineWidth = 1; for (let x = FR169.x + 40; x < FR169.x + FR169.w; x += 80) { g.beginPath(); g.moveTo(x, FR169.y); g.lineTo(x, FR169.y + FR169.h); g.stroke(); } for (let y = FR169.y + 40; y < FR169.y + FR169.h; y += 80) { g.beginPath(); g.moveTo(FR169.x, y); g.lineTo(FR169.x + FR169.w, y); g.stroke(); }
    if (lt > tm.mo) { ptext('🐒', CX169 - 300, CY169 + 40, 150, PRO.txt, { align: 'center' }); const px = CX169 + 120 + Math.sin(lt * 2) * 120, py = CY169 - 60 + Math.cos(lt * 1.7) * 90; g.strokeStyle = PRO.hi; g.lineWidth = 4; g.beginPath(); g.arc(px, py, 26, 0, 6.283); g.stroke(); ptext('?', px, py + 14, 40, PRO.hi, { align: 'center', w: 800 }); }
    if (lt > tm.us) { g.fillStyle = 'rgba(3,8,11,0.8)'; g.fillRect(FR169.x, FR169.y + FR169.h - 200, FR169.w, 200); rich('"It\'s either *us*, or the *monkey.*"', CX169, FR169.y + FR169.h - 80, 70, { align: 'center' }); } },
  over: (t, tm) => chips169(t, [[0.6, '1980–1983 · three searches · nothing']], FR169.y + 100), at: { mo: ['monkey', 4.0], us: ['us', 8.4] } });
function trail169(lt, o = {}) { dark169(); const r = rng(24), hx = CX169 + 380, hy = CY169 + 40, p = clamp(lt / 3);
  g.fillStyle = '#2A2620'; g.fillRect(FR169.x, FR169.y, FR169.w, FR169.h); g.fillStyle = 'rgba(255,255,255,0.03)'; for (let i = 0; i < 200; i++) g.fillRect(FR169.x + r() * FR169.w, FR169.y + r() * FR169.h, 3, 3);
  for (let i = 0; i < 260 * p; i++) { const q = r(), x = hx - q * 1000, y = hy - q * 260 + (r() - 0.5) * 140 * (0.3 + q); g.fillStyle = `rgba(${200 - q * 60},${150 - q * 40},${110 - q * 30},${0.8 - q * 0.4})`; g.fillRect(x, y, 4 + r() * 6, 3 + r() * 5); }
  g.fillStyle = '#5B5246'; g.save(); g.translate(hx, hy); g.rotate(-0.25); rrect(-40, -12, 80, 24, 8); g.fill(); g.restore(); if (o.label !== false) ptext('WRECK', hx, hy + 54, 24, PRO.mute, { align: 'center', ls: 3 }); return [hx, hy]; }
VIS.ballard = scene169('ballard', 'alvin', { focus: [0.5, 0.5], z0: 1.0, z1: 1.1, dark: 0.1, label: 'Real photo · the submersible Alvin, used on the 1986 Titanic dives · NOAA', draw: (t, lt, tm) => { if (lt < tm.no) return; g.globalAlpha = clamp((lt - tm.no) / 0.6); trail169(lt - tm.no); g.globalAlpha = 1; },
  over: (t, tm) => chips169(t, [[tm.su, 'Navy mission: 2 lost nuclear submarines'], [tm.tr, 'Debris trail ≫ the ship itself', PRO.acc]]), at: { su: ['submarines', 3.4], no: ['noticed', 5.2], tr: ['trail', 7.6] } });
VIS.sonar = scene169('sonar', null, { label: 'Graphic · sonar search lanes (schematic)', draw: (t, lt, tm) => { dark169(); const n = 11, w = (FR169.w - 200) / n, p = clamp(lt / 6), hx = FR169.x + 100 + w * 0.5 + 18, hy = CY169 + 120;
    for (let k = 0; k < n; k++) { const q = clamp(p * n - k); if (q <= 0) break; const x = FR169.x + 100 + w * (k + 0.5); g.fillStyle = 'rgba(46,143,184,0.18)'; g.fillRect(x - w / 2 + 3, k % 2 ? FR169.y + FR169.h - 80 - (FR169.h - 160) * q : FR169.y + 80, w - 6, (FR169.h - 160) * q); }
    g.fillStyle = RUST169; g.beginPath(); g.arc(hx + 40, hy, 9, 0, 6.283); g.fill();
    if (lt > tm.pa) { { const q = clamp((lt - tm.pa) / 0.5); g.save(); g.strokeStyle = PRO.hi; g.lineWidth = 5; g.beginPath(); g.arc(hx + 40, hy, 70 + 10 * Math.sin(lt * 4), 0, 6.283 * q); g.stroke(); g.restore(); } ptext('TITANIC', hx + 130, hy + 10, 30, PRO.hi, { w: 800 }); ptext('passed within a few hundred yards', hx + 130, hy + 50, 26, PRO.mute); } },
  over: (t, tm) => chips169(t, [[tm.fi, '5 weeks of sonar · nothing', PRO.red]], FR169.y + 100), at: { fi: ['five', 2.6], pa: ['passed', 6.4] } });
VIS.argo = scene169('argo', null, { label: 'Graphic · towing the Argo camera sled (schematic)', draw: (t, lt) => { dark169(); const floor = FR169.y + FR169.h - 140, sx = FR169.x + 200 + ((lt * 90) % (FR169.w - 400));
    g.fillStyle = '#2A2620'; g.fillRect(FR169.x, floor, FR169.w, 140); g.strokeStyle = 'rgba(243,247,248,0.5)'; g.lineWidth = 2; g.beginPath(); g.moveTo(sx + 300, FR169.y); g.lineTo(sx, floor - 120); g.stroke();
    g.fillStyle = '#C9D3D6'; rrect(sx - 60, floor - 140, 120, 40, 8); g.fill(); g.fillStyle = 'rgba(255,240,180,0.18)'; g.beginPath(); g.moveTo(sx - 30, floor - 100); g.lineTo(sx + 30, floor - 100); g.lineTo(sx + 120, floor); g.lineTo(sx - 120, floor); g.fill();
    ptext('ARGO', sx, floor - 156, 26, PRO.txt, { align: 'center', ls: 3 }); ptext('Cameras, not sonar: they can tell debris from rocks', CX169, FR169.y + 110, 34, PRO.acc, { align: 'center' }); } });
VIS.boiler = scene169('boiler', null, { label: 'Graphic · what the Knorr crew saw (illustration)', draw: (t, lt, tm) => { dark169(); const mx = CX169 - 420, my = FR169.y + 120, mw = 840, mh = 560;
    g.fillStyle = '#0A1A10'; rrect(mx, my, mw, mh, 30); g.fill(); g.strokeStyle = '#3A4A40'; g.lineWidth = 14; g.stroke();
    g.save(); rrect(mx, my, mw, mh, 30); g.clip(); const r = rng(28); g.fillStyle = 'rgba(120,255,160,0.08)'; for (let i = 0; i < 300; i++) g.fillRect(mx + r() * mw, my + r() * mh, 2, 2);
    for (let y = my; y < my + mh; y += 6) { g.fillStyle = 'rgba(0,0,0,0.25)'; g.fillRect(mx, y, mw, 2); }
    if (lt > tm.bo) { const a = clamp((lt - tm.bo) / 1.0); g.globalAlpha = a; g.fillStyle = 'rgba(150,255,180,0.55)'; g.beginPath(); g.ellipse(mx + mw / 2, my + mh / 2 + 40, 170, 120, 0, 0, 6.283); g.fill(); g.fillStyle = 'rgba(10,26,16,0.8)'; for (let k = 0; k < 3; k++) { g.beginPath(); g.arc(mx + mw / 2 - 70 + k * 70, my + mh / 2 + 40, 26, 0, 6.283); g.fill(); } g.globalAlpha = 1; }
    g.restore(); ptext('12:48 AM · SEPT 1, 1985', mx + 40, my + 60, 30, '#8CFFB0', { ls: 3, w: 800 });
    if (lt > tm.bo) bigText(lt, tm.bo, 'A *boiler.*', CX169, FR169.y + FR169.h - 60, 84); }, sfx: (K, tm) => K(tm.bo, 'ding', 0.7), at: { bo: ['boiler', 6.4] } });
VIS.found = scene169('found', 'bow', { focus: [0.5, 0.5], z0: 1.25, z1: 1.0, dur: 7, label: 'Real photo · the bow of the Titanic, 2004 · NOAA / Institute for Exploration / URI', sfx: (K) => K(0.3, 'boom', 0.5),
  over: (t, tm) => { if (t > tm.fi) chips169(t, [[tm.fi, 'First pictures in 73 years', PRO.acc]]); }, at: { fi: ['first', 2.0] } });
// chapter 4 — the wreck today
VIS.map = scene169('map', null, { ch: [4, 'The wreck today'], label: 'Graphic · where the wreck lies (schematic, not to scale)', draw: (t, lt, tm) => { dark169(); const lx = FR169.x + 260, ly = CY169 - 80, wx = FR169.x + FR169.w - 300, wy = CY169 + 160;
    g.fillStyle = '#1E3A2E'; g.beginPath(); g.moveTo(FR169.x, FR169.y); g.lineTo(lx + 120, FR169.y); g.quadraticCurveTo(lx + 40, ly - 60, lx + 90, ly + 40); g.quadraticCurveTo(lx - 20, ly + 160, FR169.x, ly + 260); g.closePath(); g.fill();
    ptext('NEWFOUNDLAND', FR169.x + 40, ly - 120, 26, 'rgba(243,247,248,0.7)', { ls: 4 }); const p = eO(clamp((lt - tm.th) / 1.6));
    if (lt > tm.th) { g.save(); g.strokeStyle = PRO.acc; g.lineWidth = 4; g.setLineDash([14, 10]); g.beginPath(); g.moveTo(lx + 90, ly + 40); g.lineTo(lerp(lx + 90, wx, p), lerp(ly + 40, wy, p)); g.stroke(); g.restore();
      ptext('≈ 370 miles', (lx + wx) / 2, (ly + wy) / 2 - 20, 40, PRO.acc, { align: 'center', w: 800 }); }
    if (p >= 1) { g.fillStyle = RUST169; g.beginPath(); g.arc(wx - 60, wy, 10, 0, 6.283); g.fill(); g.beginPath(); g.arc(wx + 60, wy + 10, 10, 0, 6.283); g.fill(); ptext('BOW', wx + 70, wy + 54, 22, PRO.txt, { align: 'center', ls: 3 }); ptext('STERN', wx - 70, wy + 50, 22, PRO.txt, { align: 'center', ls: 3 }); } },
  over: (t, tm) => chips169(t, [[tm.tw, 'Two main pieces ≈ 2,000 ft apart', PRO.acc]]), at: { th: ['three', 1.6], tw: ['thousand', 6.4] } });
VIS.pieces = scene169('pieces', null, { label: 'Graphic · the two main pieces (lengths to scale, gap not)', draw: (t, lt, tm) => { dark169(); const sc = 1.25, floor = CY169 + 120;
    g.fillStyle = '#2A2620'; g.fillRect(FR169.x, floor + 40, FR169.w, FR169.h); const bx = FR169.x + FR169.w - 100 - 470 * sc, sx = FR169.x + 100;
    if (lt > tm.bo) { hull169(bx - 0.58 * 470 * sc / 0.42, floor - 20, 470 * sc / 0.42, { part: 'bow', lost: [1, 1, 1, 1], fill: '#2B2F31' }); ptext('BOW · ≈ 470 ft', bx + 470 * sc / 2, floor + 170, 34, PRO.acc, { align: 'center', w: 800 }); }
    if (lt > tm.st) { g.save(); g.translate(sx, floor + 10); for (let k = 0; k < 5; k++) { g.fillStyle = k % 2 ? '#3B3F42' : '#2C3134'; g.fillRect(k * 8, -k * 12, 350 * sc - k * 16, 12); } g.restore(); ptext('STERN · ≈ 350 ft', sx + 350 * sc / 2, floor + 170, 34, PRO.hi, { align: 'center', w: 800 }); } },
  at: { bo: ['bow', 0.4], st: ['stern', 3.6] } });
VIS.debris = scene169('debris', 'coal', { focus: [0.5, 0.5], z0: 1.0, z1: 1.15, label: 'Real photo · coal recovered from the wreck site in 1994, with its certificate',
  over: (t, tm) => chips169(t, [[tm.co, 'Tons of coal'], [tm.su, 'Suitcases · bathtubs'], [tm.wi, 'Wine bottles, many still corked', PRO.acc]]), at: { co: ['coal', 2.0], su: ['suitcases', 2.8], wi: ['wine', 4.0] } });
VIS.stair = scene169('stair', 'stair', { focus: [0.5, 0.45], z0: 1.0, z1: 1.12, label: 'Real photo · the same Grand Staircase design on sister ship Olympic, 1911',
  over: (t, tm) => chips169(t, [[tm.ch, '1986: chandeliers still hanging', PRO.acc]]), at: { ch: ['chandeliers', 4.6] } });
VIS.shoes = scene169('shoes', 'abyss', { dark: 0.6, z0: 1.2, z1: 1.24, rate: 0.6, label: 'Real footage · North Atlantic seafloor · Ifremer', over: (t, tm) => { if (t > tm.sh) { const a = inA(t, tm.sh, 1.0); g.save(); g.globalAlpha = a;
    ptext('Where people once lay, only their shoes remain.', CX169, CY169 + 10, 50, PRO.txt, { align: 'center', w: 700 }); g.restore(); } }, at: { sh: ['shoes', 2.0] } });
VIS.freeze = scene169('freeze', 'chimaera', { rate: 0.8, label: 'Real footage · rhinochimera, NW Atlantic · NOAA Okeanos Explorer, 2013',
  over: (t, tm) => { chips169(t, [[tm.th, '34–36 °F · no light']], FR169.y + 100); if (t > tm.wr) bigText(t, tm.wr, 'A deep freeze? *Wrong.*', CX169, FR169.y + FR169.h - 90, 80); }, at: { th: ['thirty', 1.4], wr: ['wrong', 9.0] } });
// chapter 5 — the wreck is alive
VIS.species = scene169('species', 'rattail', { focus: [0.5, 0.35], z0: 1.0, z1: 1.12, ch: [5, 'The wreck is alive'], label: 'Real photo · a rattail (grenadier) fish · NOAA Okeanos Explorer',
  over: (t, tm) => chips169(t, [[tm.tw, '1991: 28 species at the wreck'], [tm.ra, 'Rattails up to 3 ft long', PRO.acc]]), at: { tw: ['twenty', 2.4], ra: ['rattail', 7.0] } });
VIS.bacteria = scene169('bacteria', 'rust', { focus: [0.5, 0.5], z0: 1.0, z1: 1.15, label: 'Real photo · rusticles below the starboard anchor, 2003 · NOAA',
  over: (t, tm) => chips169(t, [[tm.ir, 'Bacteria eat the iron'], [tm.ru, 'and leave rust behind', RUST169]]), at: { ir: ['iron', 3.4], ru: ['rust', 4.6] } });
VIS.rusticles = scene169('rusticles', 'rust', { focus: [0.35, 0.4], z0: 1.4, z1: 1.6, label: 'Real photo · rusticles, 2003 · NOAA',
  over: (t, tm) => { chips169(t, [[tm.ru, 'Rusticles: rust + icicles'], [tm.to, 'Touch one: it falls apart', PRO.hi]]); }, at: { ru: ['rusticles', 3.6], to: ['touch', 5.4] } });
VIS.halomonas = scene169('halomonas', null, { label: 'Illustration · rod-shaped bacteria (not to scale)', draw: (t, lt, tm) => { dark169(); const r = rng(39);
    for (let i = 0; i < 46; i++) { const x = FR169.x + 80 + r() * (FR169.w - 160), y = FR169.y + 80 + r() * (FR169.h - 300), a = r() * 3 + lt * 0.2 * (r() - 0.5); g.save(); g.translate(x + Math.sin(lt + i) * 6, y); g.rotate(a);
      g.fillStyle = `rgba(${200 + r() * 40},${110 + r() * 40},60,0.8)`; rrect(-34, -11, 68, 22, 11); g.fill(); g.restore(); }
    if (lt > tm.na) { g.fillStyle = 'rgba(3,8,11,0.82)'; g.fillRect(FR169.x, FR169.y + FR169.h - 220, FR169.w, 220); ptext('Halomonas titanicae', CX169, FR169.y + FR169.h - 100, 84, PRO.txt, { align: 'center', w: 800 });
      ptext('discovered 2010 · named after the ship', CX169, FR169.y + FR169.h - 44, 30, PRO.acc, { align: 'center', ls: 2 }); } }, at: { na: ['named', 2.8] } });
VIS.lbs = scene169('lbs', 'rust', { focus: [0.6, 0.6], z0: 1.2, z1: 1.3, dark: 0.55, label: 'Real photo · rusticles, 2003 · NOAA', over: (t, tm) => { if (t < tm.fo) return; const p = clamp((t - tm.fo) / 2.5);
    bigText(t, tm.fo, `*${Math.round(400 * p)} lb*`, CX169, CY169, 150, { acc: PRO.hi }); ptext('of the hull, every day (estimate)', CX169, CY169 + 80, 36, PRO.mute, { align: 'center' }); }, at: { fo: ['four', 2.4] } });
VIS.tub = scene169('tub', 'tub', { focus: [0.5, 0.5], z0: 1.0, z1: 1.18, label: "Real photo · Captain Smith's bathtub, 2003 · NOAA",
  over: (t, tm) => chips169(t, [[tm.pi, 'Rusticles over almost every pipe', RUST169]]), at: { pi: ['pipe', 4.0] } });
// chapter 6 — will it disappear?
VIS.damage = scene169('damage', 'bow', { focus: [0.62, 0.42], z0: 1.5, z1: 1.7, ch: [6, 'Will it disappear?'], label: 'Real photo · the bow, 2004 · NOAA / IFE / URI',
  over: (t, tm) => chips169(t, [[tm.cr, "Crow's nest: gone"], [tm.ma, 'Mast: almost gone'], [tm.ra, '2024: part of the bow railing collapsed', PRO.red]]), at: { cr: ['crow', 4.4], ma: ['mast', 5.8], ra: ['railing', 9.6] } });
VIS.timeline = scene169('timeline', null, { label: 'Graphic · estimates for the wreck', draw: (t, lt, tm) => { dark169(); const y = CY169 + 20, x0 = FR169.x + 120, x1 = FR169.x + FR169.w - 120, X = (yr) => lerp(x0, x1, (yr - 1900) / (2080 - 1900));
    g.fillStyle = PRO.dim; g.fillRect(x0, y - 4, x1 - x0, 8); const now = X(2026); g.fillStyle = PRO.acc; g.fillRect(x0, y - 4, (now - x0) * eO(lt / 1.5), 8);
    [[1912, 'SANK', PRO.txt, 0], [1985, 'FOUND', PRO.txt, 0.4], [2026, 'TODAY', PRO.acc, 0.8]].forEach(([yr, s, c, d]) => { if (lt < d) return; g.fillStyle = c; g.beginPath(); g.arc(X(yr), y, 12, 0, 6.283); g.fill(); const up = yr !== 2026; ptext(String(yr), X(yr), up ? y - 34 : y + 50, 30, c, { align: 'center', w: 800 }); ptext(s, X(yr), up ? y + 50 : y + 84, 22, PRO.mute, { align: 'center', ls: 3 }); });
    if (lt > tm.tw) { g.fillStyle = PRO.red; g.beginPath(); g.arc(X(2030), y, 14, 0, 6.283); g.fill(); ptext('2030?', X(2030) + 10, y - 40, 40, PRO.red, { align: 'left', w: 800 }); ptext('one scientist', X(2030) + 10, y - 128, 22, PRO.mute, { align: 'left' }); }
    if (lt > tm.fi) { const a = X(2026), b = X(2076); g.fillStyle = 'rgba(255,159,28,0.25)'; g.fillRect(a, y - 30, (b - a) * eO((lt - tm.fi) / 1), 60); ptext('NOAA: hull may collapse within 50 years', (a + b) / 2, y + 150, 28, PRO.hi, { align: 'center' }); } },
  at: { tw: ['twenty', 3.4], fi: ['fifty', 8.4] } });
VIS.stain = scene169('stain', 'bow', { focus: [0.5, 0.5], z0: 1.05, z1: 1.0, label: 'Real photo · the bow, 2004 · NOAA / IFE / URI', draw: (t, lt) => { const k = clamp((lt - 1) / 4); g.fillStyle = `rgba(110,48,20,${0.75 * k})`; g.fillRect(FR169.x, FR169.y, FR169.w, FR169.h);
    if (k > 0.5) ptext('a rust stain', CX169, CY169 + 20, 90, `rgba(243,220,200,${(k - 0.5) * 2})`, { align: 'center', w: 800 }); } });
VIS.grave = scene169('grave', 'crowd', { label: 'Real footage · crowds awaiting news at the White Star offices, New York, 1912',
  over: (t, tm) => chips169(t, [[tm.un, 'Protected by UNESCO since 2012'], [tm.gr, 'A grave for ≈ 1,500 people', PRO.acc]]), at: { un: ['unesco', 2.4], gr: ['grave', 6.0] } });
VIS.cta = scene169('cta', 'bow', { focus: [0.5, 0.5], z0: 1.0, z1: 1.08, dark: 0.45, label: 'Real photo · the bow, 2004 · NOAA / IFE / URI' });

// ---- scenes added for length (keys from scripts/mk169.py NEW) --------------------------------------------------------
VIS.andrews = scene169('andrews', 'plan', { fit: 'contain', z0: 0.97, z1: 1.02, bg: '#0B1418', dark: 0.25, label: 'Real plan · Titanic side plan (1912)',
  over: (t, tm) => { if (t > tm.tw) bigText(t, tm.tw, 'Afloat for roughly *two hours*', CX169, FR169.y + FR169.h - 90, 70); }, at: { tw: ['two', 4.0] } });
VIS.smith = scene169('smith', 'captain', { label: 'Real footage · Captain Edward Smith, 1911–12 newsreel' });
VIS.snow = scene169('snow', 'snow', { z0: 1.16, z1: 1.22, focus: [0.5, 0.42], label: 'Real footage · marine snow · NOAA', over: (t, tm) => chips169(t, [[tm.we, 'Some flakes fall for weeks', PRO.acc]]), at: { we: ['weeks', 6.0] } });
VIS.missed = scene169('missed', null, { label: 'Graphic · a sonar pass (schematic)', draw: (t, lt) => { dark169(); const y0 = FR169.y + 160, p = clamp(lt / 4), x = lerp(FR169.x - 100, FR169.x + FR169.w + 100, p);
    g.fillStyle = '#2A2620'; g.fillRect(FR169.x, FR169.y + FR169.h - 200, FR169.w, 200); g.fillStyle = RUST169; g.beginPath(); g.arc(CX169, FR169.y + FR169.h - 200, 10, 0, 6.283); g.fill();
    g.fillStyle = 'rgba(46,143,184,0.22)'; g.beginPath(); g.moveTo(x, y0); g.lineTo(x - 260, FR169.y + FR169.h - 200); g.lineTo(x + 260, FR169.y + FR169.h - 200); g.fill();
    g.fillStyle = '#C9D3D6'; rrect(x - 50, y0 - 18, 100, 36, 8); g.fill();
    if (lt > 3) ptext('MISSED', CX169, CY169, 110, PRO.red, { align: 'center', w: 800, ls: 8, alpha: inA(lt, 3, 0.4) }); } });
VIS.bigpiece = scene169('bigpiece', null, { label: 'Graphic · the 1996 lift (depth to scale)', draw: (t, lt, tm) => { dark169(); const top = FR169.y + 90, bot = FR169.y + FR169.h - 60, Y = (ft) => lerp(top, bot, ft / 12500), x = CX169 - 200;
    g.fillStyle = 'rgba(46,143,184,0.35)'; g.fillRect(FR169.x, top - 4, FR169.w, 4); g.fillStyle = '#2A2620'; g.fillRect(FR169.x, bot, FR169.w, 60);
    ptext('SURFACE', FR169.x + 30, top - 14, 22, PRO.mute, { ls: 3 }); ptext('12,500 ft', FR169.x + 30, bot - 14, 22, PRO.mute, { ls: 3 });
    const up = clamp((lt - 1) / Math.max(1, tm.sn - 1)), down = lt > tm.sn ? clamp((lt - tm.sn) / 1.6) : 0, d = lt < tm.sn ? lerp(12500, 200, eO(up)) : lerp(200, 12500, down * down);
    g.strokeStyle = 'rgba(243,247,248,0.5)'; g.lineWidth = 2; if (lt < tm.sn) { g.beginPath(); g.moveTo(x + 60, top); g.lineTo(x + 60, Y(d)); g.stroke(); }
    g.fillStyle = '#8A7A6A'; rrect(x, Y(d), 120, 70, 6); g.fill(); g.fillStyle = 'rgba(200,235,255,0.6)'; for (let k = 0; k < 4; k++) { g.beginPath(); g.arc(x + 20 + k * 27, Y(d) + 35, 8, 0, 6.283); g.fill(); }
    if (lt > tm.tw) ptext('20 tons · 4 portholes', x + 150, Y(d) + 45, 30, PRO.txt, { w: 800 });
    if (lt > tm.sn) bigText(lt, tm.sn, 'The ropes *snapped.*', CX169 + 300, CY169, 72, { acc: PRO.red }); if (lt > tm.tr) chips169(lt, [[tm.tr, '1998: lifted on the second try', PRO.acc]], FR169.y + 120); },
  sfx: (K, tm) => { K(tm.sn, 'crack', 0.7); K(tm.sn + 1.6, 'boom', 0.6); }, at: { tw: ['twenty', 2.6], sn: ['snapped', 8.0], tr: ['again', 13.0] } });
VIS.baths = scene169('baths', 'gym', { focus: [0.5, 0.5], z0: 1.0, z1: 1.12, label: "Real photo · Titanic's first-class gymnasium, 1912 (another first-class room)",
  over: (t, tm) => chips169(t, [[tm.tu, '2005: Turkish baths in excellent condition', PRO.acc]]), at: { tu: ['turkish', 4.6] } });
VIS.growth = scene169('growth', null, { label: 'Graphic · animals counted at the wreck', draw: (t, lt, tm) => { dark169(); const base = FR169.y + FR169.h - 140, x0 = CX169 - 300, h0 = 300, p = lt > tm.se ? eO((lt - tm.se) / 1.2) : 0;
    g.fillStyle = PRO.dim; rrect(x0, base - h0, 220, h0, 12); g.fill(); g.fillStyle = PRO.acc; rrect(x0 + 380, base - h0 * (1 + 0.75 * p), 220, h0 * (1 + 0.75 * p), 12); g.fill();
    ptext('1985', x0 + 110, base + 50, 34, PRO.txt, { align: 'center', w: 800 }); ptext('1996', x0 + 490, base + 50, 34, PRO.txt, { align: 'center', w: 800 });
    if (p > 0) ptext(`+${Math.round(75 * p)}%`, x0 + 490, base - h0 * (1 + 0.75 * p) - 24, 56, PRO.acc, { align: 'center', w: 800 });
    ptext('brittle stars + sea cucumbers', CX169, FR169.y + 90, 30, PRO.mute, { align: 'center', ls: 2 }); }, at: { se: ['seventy', 3.0] } });
VIS.wood = scene169('wood', 'bow', { focus: [0.3, 0.75], z0: 1.6, z1: 1.8, label: 'Real photo · the bow deck, 2004: the wooden planks are gone · NOAA / IFE / URI',
  over: (t, tm) => chips169(t, [[tm.de, 'Decks, paneling, furniture: eaten'], [tm.tu, 'Left behind: empty tubes', PRO.acc]]), at: { de: ['decks', 1.6], tu: ['tubes', 7.0] } });
VIS.tons650 = scene169('tons650', 'tub', { focus: [0.3, 0.3], z0: 1.4, z1: 1.55, dark: 0.45, label: "Real photo · rusticles in Captain Smith's quarters, 2003 · NOAA", over: (t, tm) => { if (t < tm.si) return; const p = clamp((t - tm.si) / 2);
    bigText(t, tm.si, `*${Math.round(650 * p)} tons*`, CX169, CY169, 140, { acc: RUST169 }); ptext('of rusticles on the bow alone (estimate)', CX169, CY169 + 80, 36, PRO.mute, { align: 'center' }); }, at: { si: ['six', 3.4] } });
