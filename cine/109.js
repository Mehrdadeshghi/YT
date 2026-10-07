// Wiki Roulette #109 — HOW IT WORKS #1: how the internet works (packets, IP, routers, submarine cables, light in glass).
// Motion-graphics episode: everything is animated in code (phone, packets, route, 3D globe with glowing cable routes,
// fibre with bouncing light, router mesh), plus a few real photos/footage labelled honestly. Narrator + word-synced hits.
// Retention: frame-1 contradiction ("not in the sky — on the sea floor") → step-by-step journey of ONE message →
// big number (99 %) → speed shock (5x around Earth per second) → payoff (message arrives) → binary comment question.
const N = 7, CY = '#3EE6FF', MG = '#FF4FD8', LIME = '#B6FF3E', PK = [GOLD, CY, MG, LIME, '#FF8A3D', '#8AA4FF', GOLD, CY];
const S = (f) => (K, Sc) => f()(K, Sc);
const big = (t, at, s, o = {}) => { if (t < at) return; g.save(); g.translate(shake(t, at, o.sh ?? 10), 0); stampText(s, 540, o.y ?? 1060, t, at, { size: o.size ?? 100, rot: o.rot ?? -0.06 }); g.restore(); };
const drop = (at, len = 0.45) => [[Math.max(0.05, at - len), 'mute', 1, len], [at, 'boom', 1.1], [at + 0.02, 'hit', 1.2]];
// ---------- motion-graphics kit ----------
function grid(t, a = 0.08) { g.save(); g.strokeStyle = `rgba(62,230,255,${a})`; g.lineWidth = 2; const o = (t * 40) % 80;
  for (let x = -80 + o; x < W + 80; x += 80) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, H); g.stroke(); } for (let y = -80 + o; y < H + 80; y += 80) { g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke(); } g.restore(); }
function techBg(t, c1 = '#05101E', c2 = '#0B2A46') { const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, c1); gr.addColorStop(1, c2); g.fillStyle = gr; g.fillRect(0, 0, W, H); grid(t); }
function glowDot(x, y, r, col, a = 1) { g.save(); g.globalAlpha *= a; g.shadowColor = col; g.shadowBlur = r * 3; g.fillStyle = col; g.beginPath(); g.arc(x, y, r, 0, 6.283); g.fill(); g.restore(); }
function packet(x, y, s, col, label, rot = 0, a = 1) { g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s); g.globalAlpha *= a; g.shadowColor = col; g.shadowBlur = 26;
  rrect(-44, -44, 88, 88, 18); g.fillStyle = 'rgba(8,18,32,0.92)'; g.fill(); g.lineWidth = 5; g.strokeStyle = col; g.stroke(); g.shadowBlur = 0;
  if (label) text(label, 0, 12, 'mono', 30, col, { align: 'center' }); g.restore(); }
function phone(t, x, y, s, msg, o = {}) { g.save(); g.translate(x, y); g.scale(s, s);
  g.shadowColor = 'rgba(0,0,0,0.6)'; g.shadowBlur = 40; rrect(-210, -400, 420, 800, 56); g.fillStyle = '#0D0F14'; g.fill(); g.shadowBlur = 0; g.lineWidth = 6; g.strokeStyle = '#3A4252'; g.stroke();
  rrect(-188, -378, 376, 756, 42); const gr = g.createLinearGradient(0, -378, 0, 378); gr.addColorStop(0, '#162238'); gr.addColorStop(1, '#0E1626'); g.fillStyle = gr; g.fill();
  rrect(-60, -366, 120, 26, 13); g.fillStyle = '#05070A'; g.fill();
  text(o.title || 'ALEX', 0, -300, 'ui', 30, '#DDE6F5', { align: 'center' });
  if (msg && o.msgA !== 0) { g.save(); g.globalAlpha *= o.msgA ?? 1; g.font = F.ui(34); const w = Math.min(320, g.measureText(msg).width + 50); rrect(150 - w, 60, w, 120, 30); g.fillStyle = o.recv ? '#2A3448' : '#2F7BFF'; g.fill();
    wrapText(msg, 150 - w + 25, 108, w - 50, 34); g.restore(); }
  rrect(-170, 300, 270, 60, 30); g.fillStyle = '#1C2638'; g.fill(); text(o.typing || 'Message', -150, 340, 'ui', 26, '#7C8AA3');
  g.beginPath(); g.arc(140, 330, 32, 0, 6.283); g.fillStyle = '#2F7BFF'; g.fill(); g.fillStyle = '#FFF'; g.beginPath(); g.moveTo(126, 316); g.lineTo(158, 330); g.lineTo(126, 344); g.lineTo(132, 330); g.fill();
  if (o.tap != null && t > o.tap && t < o.tap + 0.5) { const u = (t - o.tap) / 0.5; g.strokeStyle = `rgba(255,255,255,${1 - u})`; g.lineWidth = 6; g.beginPath(); g.arc(140, 330, 32 + u * 70, 0, 6.283); g.stroke(); }
  g.restore(); }
function wrapText(str, x, y, w, size) { g.font = F.ui(size); const words = str.split(' '); let line = '', yy = y;
  words.forEach((wd) => { const tl = line ? line + ' ' + wd : wd; if (g.measureText(tl).width > w && line) { text(line, x, yy, 'ui', size, '#FFF'); line = wd; yy += size * 1.25; } else line = tl; }); text(line, x, yy, 'ui', size, '#FFF'); }
function icon(kind, x, y, s, t, on, label) { g.save(); g.translate(x, y); g.scale(s, s); const col = on ? CY : '#5C6B85';
  g.shadowColor = on ? CY : 'transparent'; g.shadowBlur = on ? 30 : 0; rrect(-80, -80, 160, 160, 32); g.fillStyle = on ? 'rgba(20,60,90,0.95)' : 'rgba(18,26,40,0.95)'; g.fill(); g.lineWidth = 5; g.strokeStyle = col; g.stroke(); g.shadowBlur = 0;
  g.strokeStyle = col; g.fillStyle = col; g.lineWidth = 7; g.lineCap = 'round';
  if (kind === 'phone') { rrect(-28, -48, 56, 96, 12); g.stroke(); }
  if (kind === 'router') { rrect(-48, 0, 96, 32, 8); g.stroke(); [18, 32, 46].forEach((r) => { g.beginPath(); g.arc(0, -4, r, Math.PI * 1.2, Math.PI * 1.8); g.stroke(); }); }
  if (kind === 'isp') { [-34, 0, 34].forEach((dx, k) => { g.strokeRect(dx - 14, -40 + (k % 2) * 16, 28, 80 - (k % 2) * 16); }); }
  if (kind === 'sea') { for (let k = 0; k < 3; k++) { g.beginPath(); for (let xx = -50; xx <= 50; xx += 5) g.lineTo(xx, -20 + k * 22 + Math.sin(xx / 10 + t * 4) * 6); g.stroke(); } }
  if (kind === 'server') { [-30, 0, 30].forEach((dy) => { g.strokeRect(-46, dy - 11, 92, 22); g.beginPath(); g.arc(30, dy, 4, 0, 6.283); g.fill(); }); }
  g.restore(); if (label) text(label, x, y + 80 * s + 48, 'mono', 26, on ? CY : '#7C8AA3', { align: 'center' }); }
// the sea floor: dark water, sand, one cable with light pulses running through it
function seabed(t, tIn) { const a = clamp((t - tIn) / 0.4); g.save(); g.globalAlpha = a; const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, '#031424'); gr.addColorStop(0.7, '#02101C'); gr.addColorStop(1, '#0A1A22'); g.fillStyle = gr; g.fillRect(0, 0, W, H);
  for (let k = 0; k < 40; k++) { const x = (k * 97 + t * 12) % W, y = (k * 211 + t * 30 * (1 + k % 3)) % 1300; g.fillStyle = 'rgba(160,210,255,0.18)'; g.beginPath(); g.arc(x, 1300 - y, 2 + k % 3, 0, 6.283); g.fill(); }
  const sb = new Path2D(); sb.moveTo(0, 1180); for (let x = 0; x <= W; x += 40) sb.lineTo(x, 1180 + Math.sin(x / 140) * 26); sb.lineTo(W, H); sb.lineTo(0, H); sb.closePath(); g.fillStyle = '#2A2A24'; g.fill(sb);
  g.strokeStyle = '#11151C'; g.lineWidth = 26; g.lineCap = 'round'; g.beginPath(); for (let x = -40; x <= W + 40; x += 20) { const y = 1150 + Math.sin(x / 140) * 22; x === -40 ? g.moveTo(x, y) : g.lineTo(x, y); } g.stroke();
  g.strokeStyle = 'rgba(62,230,255,0.5)'; g.lineWidth = 4; g.stroke();
  for (let k = 0; k < 6; k++) { const x = ((t - tIn) * 700 + k * 200) % (W + 100) - 50; glowDot(x, 1150 + Math.sin(x / 140) * 22, 11, '#FFFFFF'); }
  g.restore(); }
// great-circle point (for light pulses running along cables on the globe)
function gc(A, B, u, lift = 0.012) { const a = MAP.V3(...A), b = MAP.V3(...B), om = Math.acos(clamp(a[0] * b[0] + a[1] * b[1] + a[2] * b[2], -1, 1)), s = Math.sin(om) || 1;
  const k1 = Math.sin((1 - u) * om) / s, k2 = Math.sin(u * om) / s, l = 1 + lift * Math.sin(Math.PI * u); return MAP.PV([(a[0] * k1 + b[0] * k2) * l, (a[1] * k1 + b[1] * k2) * l, (a[2] * k1 + b[2] * k2) * l]); }
// simplified routes of real cable systems (landing points approximate)
const CABLES = [[[-75.98, 36.85], [-2.93, 43.26]], [[-72.9, 40.8], [-4.55, 50.83]], [[-80.08, 26.36], [-38.5, -3.72]], [[-8.87, 37.95], [-38.5, -3.72]],
  [[-118.4, 33.9], [139.95, 34.95]], [[-123.9, 45.2], [140.0, 35.0]], [[5.37, 43.3], [29.9, 31.2]], [[43.1, 11.6], [72.8, 19.0]], [[103.8, 1.3], [115.8, -31.9]],
  [[18.4, -33.9], [3.4, 6.45]], [[-157.9, 21.3], [-118.4, 33.9]], [[151.2, -33.9], [174.8, -36.8]], [[72.8, 19.0], [103.8, 1.3]]];
function cables(t, tIn, n = CABLES.length, o = {}) { CABLES.slice(0, n).forEach(([A, B], k) => { const p = clamp((t - tIn - k * (o.stagger ?? 0.08)) / 0.6); if (p <= 0) return;
  arc3d(A, B, p, k % 3 === 0 ? CY : k % 3 === 1 ? GOLD : MG, { w: 4, lift: 0.012, a: 0.9 });
  if (p >= 1) for (let q = 0; q < 3; q++) { const u = ((t * 0.45 + q / 3 + k * 0.13) % 1), [x, y, v] = gc(A, B, u); if (v) glowDot(x, y, 7, '#FFFFFF'); } }); }

// ---------- scenes ----------
VIS.open = (K) => { K(0.05, 'hit', 1.3); K(0.3, 'wrong', 1); K(sw('ocean', 2.6), 'boom', 1); K(sw('ocean', 2.6) + 0.02, 'hit', 1);
  return (t) => { earth(t, camPath(t, [[0, -40, 30, 2.6, 0, 0], [1.5, -40, 30, 1.9, 20, 0]], { k: 3, d: 3 })); cables(t, -0.5, CABLES.length, { stagger: 0.04 });
    g.fillStyle = 'rgba(2,6,14,0.35)'; g.fillRect(0, 0, W, H); tag(t); hook(t, EP.hook, 400); if (EP.series) chip(EP.series, 80, 630, t, -0.3, { size: 26, align: 'left', bg: GOLD, fg: BG });
    if (t > sw('ocean', 2.6)) big(t, sw('ocean', 2.6), "IT'S ON THE SEA FLOOR", { size: 76, y: 1080 }); lot(t, 0.3, 'eyes', 900, 760, 130); }; };

VIS[0] = S(() => { const tap = sw('send', 0.4), ch = sw('chopped', 1.4), pk = sw('packets', 2.6);
  return (K) => { K(tap, 'click', 1); K(ch, 'crack', 1); K(ch + 0.02, 'whoosh', 0.7); for (let k = 0; k < 8; k++) K(ch + 0.1 + k * 0.06, 'pop', 0.5, 600 + k * 60); K(pk, 'ding', 0.9);
    return (t) => { techBg(t); tag(t, 0, N); const msg = 'Hey! Did you see the game last night?';
      const split = clamp((t - ch) / 0.6); phone(t, 540, 860, 0.95, msg, { tap, msgA: t < ch ? 1 : 1 - split, typing: t < tap ? msg.slice(0, Math.floor(clamp(t / Math.max(0.3, tap - 0.1)) * msg.length)) + '|' : 'Message' });
      if (t > ch) for (let k = 0; k < 8; k++) { const e = ease(clamp((t - ch - k * 0.04) / 0.7)), a0 = -2.4 + k * 0.62, r = 120 + e * 260;
        packet(540 + 20 + Math.cos(a0) * r * e, 860 + 120 + Math.sin(a0) * r * e * 0.9 - e * 120, 0.8 + 0.2 * e, PK[k], String(k + 1), Math.sin(t * 2 + k) * 0.1 * e); }
      if (t > pk) chip('PACKETS', 540, 470, t, pk, { size: 46, bg: CY, fg: BG }); }; }; });

VIS[1] = S(() => { const lab = sw('address', 0.8), ip = sw('ip', 1.8), let1 = sw('letter', 2.8);
  return (K) => { K(lab, 'stamp', 1); K(ip, 'type', 1); K(let1, 'paper', 0.9);
    return (t) => { techBg(t); tag(t, 1, N); const s = spring(t - 0.2, 220, 18);
      g.save(); g.translate(540, 840); g.scale(s, s); g.shadowColor = GOLD; g.shadowBlur = 40; rrect(-380, -260, 760, 520, 40); g.fillStyle = 'rgba(8,18,32,0.95)'; g.fill(); g.lineWidth = 6; g.strokeStyle = GOLD; g.stroke(); g.shadowBlur = 0;
      text('PACKET 3 / 8', -330, -180, 'mono', 34, GOLD);
      if (t > lab) { const p = spring(t - lab, 300, 16); g.save(); g.translate(0, -60); g.scale(p, p); rrect(-330, -70, 660, 150, 20); g.fillStyle = '#F2EDE2'; g.fill();
        text('TO:   142.250.185.78', -300, -12, 'mono', 40, BG); text('FROM: 192.168.0.23', -300, 50, 'mono', 40, BG); g.restore(); }
      text('…did you see the…', -330, 150, 'mono', 34, '#7C8AA3'); g.restore();
      if (t > ip) { const q = spring(t - ip, 260, 14); g.save(); g.shadowColor = CY; g.shadowBlur = 30; g.strokeStyle = CY; g.lineWidth = 8; rrect(540 - 345 * q, 700, 690 * q, 170, 24); g.stroke(); g.restore(); chip('IP ADDRESS', 540, 470, t, ip, { size: 46, bg: CY, fg: BG }); }
      if (t > let1) lot(t, let1, 'check', 880, 1150, 140); }; }; });

VIS[2] = S(() => { const ro = sw('router', 0.6), pr = sw('provider', 1.6), dn = sw('down', 2.6), fl = sw('floor', 3.4);
  return (K) => { K(ro, 'pop', 0.9, 700); K(pr, 'pop', 0.9, 800); K(dn, 'whoosh', 0.9); (drop(fl, 0.5)).forEach(([a, b, c, d]) => K(a, b, c, d));
    return (t) => { const dive = clamp((t - dn) / 0.8); techBg(t, '#05101E', dive > 0 ? `rgb(${Math.round(11 - 8 * dive)},${Math.round(42 - 20 * dive)},${Math.round(70 - 20 * dive)})` : '#0B2A46');
      if (t > fl - 0.1) seabed(t, fl - 0.1);
      tag(t, 2, N); const ys = 780 - dive * 0, pts = [[180, ys], [400, ys], [620, ys], [860, ys], [860, ys + 380]];
      g.save(); g.strokeStyle = 'rgba(62,230,255,0.35)'; g.lineWidth = 6; g.setLineDash([14, 12]); g.lineDashOffset = -t * 60; g.beginPath(); pts.forEach(([x, y], k) => k ? g.lineTo(x, y) : g.moveTo(x, y)); g.stroke(); g.restore();
      if (t < fl) { icon('phone', 180, ys, 1, t, true, 'YOU'); icon('router', 400, ys, 1, t, t > ro, 'WI-FI'); icon('isp', 620, ys, 1, t, t > pr, 'PROVIDER'); icon('sea', 860, ys, 1, t, t > dn, 'SEA'); }
      const prog = clamp(t / Math.max(1, fl)), L = [0.2, 0.45, 0.7, 1.0];
      for (let k = 0; k < 6; k++) { const u = clamp(prog * 1.05 - k * 0.04); let seg = 0; while (seg < 3 && u > L[seg + 1] - 0.0001) seg++; const a0 = seg === 0 ? 0 : L[seg], a1 = L[Math.min(3, seg + 1)];
        const f = clamp((u - (seg === 0 ? 0 : L[seg])) / ((a1 - a0) || 1)), P0 = pts[Math.min(seg, 3)], P1 = pts[Math.min(seg + 1, 4)];
        if (t < fl) packet(lerp(P0[0], P1[0], f), lerp(P0[1], P1[1], f) - 150, 0.55, PK[k], null); }
      if (t > fl) big(t, fl, 'SEA FLOOR', { size: 84, y: 1020 }); }; }; });

VIS[3] = S(() => { const ho = sw('hose', 1.4), nn = sw('ninety', 2.6), ct = sw('continents', 3.6);
  return (K) => { K(ho, 'thump', 1); (drop(nn, 0.45)).forEach(([a, b, c, d]) => K(a, b, c, d)); K(ct, 'zap', 0.8);
    return (t) => { if (t < ho - 0.15) { const P = shot(t, 'ship', { a: [0.45, 0.6, 1.4], b: [0.45, 0.6, 1.6], dur: 3 }); if (!P) noPhoto(t); g.fillStyle = 'rgba(2,6,14,0.25)'; g.fillRect(0, 0, W, H);
        realBadge(t, 0.2, 'REAL PHOTO · CABLE-LAYING SHIP "CABLE INNOVATOR"'); }
      else if (t < nn) { const P = shot(t - ho, 'subopt', { a: [0.5, 0.5, 1.15], b: [0.5, 0.5, 1.35], dur: 3 }); if (!P) noPhoto(t); g.fillStyle = 'rgba(2,6,14,0.3)'; g.fillRect(0, 0, W, H); flash(t, ho - 0.15, 0.4, 0.1);
        realBadge(t, ho, 'REAL PHOTO · SUBMARINE FIBRE-OPTIC CABLES'); if (t > ho) chip('17–20 MM ≈ A GARDEN HOSE', 540, 820, t, ho, { size: 40, bg: GOLD, fg: BG }); }
      else { earth(t, camPath(t, [[nn, -20, 25, 2.4, 0, 0], [nn + 0.1, 10, 20, 2.0, 15, 0]], { k: 3, d: 3 })); cables(t, nn, CABLES.length, { stagger: 0.05 }); g.fillStyle = 'rgba(2,6,14,0.25)'; g.fillRect(0, 0, W, H);
        const v = Math.round(99 * ease(clamp((t - nn) / 0.8))); text(`${v}%`, 540, 820, 'disp', 230, GOLD, { align: 'center', shadow: true });
        if (t > ct) chip('OF DATA BETWEEN CONTINENTS', 540, 900, t, ct, { size: 36, bg: CY, fg: BG }); chip('SIMPLIFIED CABLE ROUTES', 540, 1600, t, nn, { size: 22, bg: 'rgba(12,11,10,0.7)', fg: '#AFC2DD' }); }
      tag(t, 3, N); }; }; });

VIS[4] = S(() => { const gl = sw('glass', 0.9), li = sw('light', 2.2), two = sw('two', 3.0);
  return (K) => { K(gl, 'ding', 0.8); K(li, 'zap', 1); (drop(two, 0.4)).forEach(([a, b, c, d]) => K(a, b, c, d));
    return (t) => { if (t < li) { const P = shot(t, 'dark', { a: [0.62, 0.55, 1.25], b: [0.62, 0.55, 1.5], dur: 3 }); if (!P) noPhoto(t); g.fillStyle = 'rgba(2,6,14,0.2)'; g.fillRect(0, 0, W, H); realBadge(t, 0.2, 'REAL PHOTO · OPTICAL FIBRES CARRYING LIGHT');
        if (t > gl) chip('HAIR-THIN GLASS', 540, 820, t, gl, { size: 44, bg: CY, fg: BG }); }
      else { techBg(t, '#02060E', '#061428'); // fibre: light bouncing inside the glass (total internal reflection)
        const y0 = 700, y1 = 900; g.save(); const gr = g.createLinearGradient(0, y0, 0, y1); gr.addColorStop(0, 'rgba(120,200,255,0.25)'); gr.addColorStop(0.5, 'rgba(120,200,255,0.08)'); gr.addColorStop(1, 'rgba(120,200,255,0.25)');
        g.fillStyle = gr; g.fillRect(0, y0, W, y1 - y0); g.strokeStyle = 'rgba(160,220,255,0.7)'; g.lineWidth = 4; g.beginPath(); g.moveTo(0, y0); g.lineTo(W, y0); g.moveTo(0, y1); g.lineTo(W, y1); g.stroke();
        g.shadowColor = CY; g.shadowBlur = 30; g.strokeStyle = CY; g.lineWidth = 8; g.beginPath(); const sp = (t - li) * 1400;
        for (let x = -200; x < W + 200; x += 6) { const ph = ((x + sp) / 160) % 2, yy = ph < 1 ? lerp(y0 + 6, y1 - 6, ph) : lerp(y1 - 6, y0 + 6, ph - 1); if (x + sp < 0) continue; x === -200 ? g.moveTo(x, yy) : g.lineTo(x, yy); } g.stroke(); g.restore();
        for (let k = 0; k < 8; k++) { const x = ((t - li) * 1400 + k * 170) % (W + 200) - 100; glowDot(x, lerp(y0, y1, 0.5 + 0.4 * Math.sin(x / 50)), 10, '#FFFFFF'); }
        if (t > two) { const v = Math.round(200000 * ease(clamp((t - two) / 0.6))); text(`${v.toLocaleString('en-US')} KM/S`, 540, 600, 'disp', 96, GOLD, { align: 'center', shadow: true });
          chip('≈ 5× AROUND THE EARTH — EVERY SECOND', 540, 1060, t, two + 0.3, { size: 32, bg: CY, fg: BG }); lot(t, two + 0.2, 'rocket', 900, 1180, 130); } }
      tag(t, 4, N); }; }; });

VIS[5] = S(() => { const ro = sw('routers', 0.4), h1 = sw('hop', 1.4), h2 = sw('hop', 1.8, 1), dif = sw('different', 2.6);
  const NODES = [[140, 860], [330, 640], [330, 1080], [540, 760], [540, 980], [750, 620], [750, 1100], [940, 860]], EDGES = [[0, 1], [0, 2], [1, 3], [2, 4], [1, 5], [3, 5], [3, 4], [4, 6], [5, 7], [6, 7], [3, 6], [2, 6]];
  const ROUTES = [[0, 1, 5, 7], [0, 2, 6, 7], [0, 1, 3, 4, 6, 7], [0, 2, 4, 3, 5, 7]];
  return (K) => { K(ro, 'pop', 0.8, 700); K(h1, 'tick', 1); K(h2, 'tick', 1); K(dif, 'ding', 0.9);
    return (t) => { if (t < ro + 0.6) { const P = shot(t, 'decix', { a: [0.5, 0.5, 1.2], b: [0.5, 0.5, 1.35], dur: 2 }); if (!P) noPhoto(t); g.fillStyle = 'rgba(2,6,14,0.3)'; g.fillRect(0, 0, W, H); realBadge(t, 0.1, 'REAL PHOTO · DE-CIX INTERNET EXCHANGE, FRANKFURT'); }
      else { techBg(t);
        EDGES.forEach(([a, b]) => { g.strokeStyle = 'rgba(62,230,255,0.25)'; g.lineWidth = 5; g.beginPath(); g.moveTo(...NODES[a]); g.lineTo(...NODES[b]); g.stroke(); });
        const nr = t > dif ? ROUTES.length : 1;
        ROUTES.slice(0, nr).forEach((r, k) => { const st2 = (k === 0 ? ro + 0.6 : dif) + k * 0.15, u = clamp((t - st2) / 1.6) * (r.length - 1), i = Math.min(r.length - 2, Math.floor(u)), f = u - i;
          if (t < st2) return; const [x0, y0] = NODES[r[i]], [x1, y1] = NODES[r[i + 1]];
          g.strokeStyle = PK[k]; g.lineWidth = 6; g.shadowColor = PK[k]; g.shadowBlur = 20; g.beginPath(); g.moveTo(...NODES[r[0]]); for (let j = 1; j <= i; j++) g.lineTo(...NODES[r[j]]); g.lineTo(lerp(x0, x1, f), lerp(y0, y1, f)); g.stroke(); g.shadowBlur = 0;
          packet(lerp(x0, x1, f), lerp(y0, y1, f), 0.42, PK[k], String(k + 1)); });
        NODES.forEach(([x, y], k) => { g.save(); g.shadowColor = CY; g.shadowBlur = 20; g.beginPath(); g.arc(x, y, 34, 0, 6.283); g.fillStyle = '#0D2238'; g.fill(); g.lineWidth = 5; g.strokeStyle = CY; g.stroke(); g.restore();
          g.strokeStyle = CY; g.lineWidth = 4; g.beginPath(); g.moveTo(x - 14, y); g.lineTo(x + 14, y); g.moveTo(x, y - 14); g.lineTo(x, y + 14); g.stroke(); });
        const hops = Math.min(9, Math.floor(clamp((t - h1) / 1.6) * 9) + (t > h1 ? 1 : 0)); if (t > h1) chip(`HOPS: ${hops}`, 540, 470, t, h1, { size: 44, bg: CY, fg: BG });
        if (t > dif) chip('DIFFERENT ROADS — SAME DESTINATION', 540, 1260, t, dif, { size: 30, bg: GOLD, fg: BG }); }
      tag(t, 5, N); }; }; });

VIS[6] = S(() => { const sn = sw('snap', 1.2), fr = sw('fraction', 2.2);
  return (K) => { K(0.2, 'whoosh', 0.7); for (let k = 0; k < 8; k++) K(sn - 0.3 + k * 0.05, 'pop', 0.5, 900 - k * 30); K(sn + 0.15, 'ding', 1); K(fr, 'stamp', 1);
    return (t) => { techBg(t); tag(t, 6, N); const done = t > sn + 0.15;
      phone(t, 540, 860, 0.95, 'Hey! Did you see the game last night?', { title: 'YOU', recv: true, msgA: done ? clamp((t - sn - 0.15) / 0.2) : 0 });
      if (!done) for (let k = 0; k < 8; k++) { const e = ease(clamp((t - 0.2 - k * 0.05) / Math.max(0.4, sn - 0.2))), a0 = -2.4 + k * 0.62, r = 420 * (1 - e);
        packet(540 + 20 + Math.cos(a0) * r, 860 + 120 + Math.sin(a0) * r, 0.9 - 0.3 * e, PK[k], String(k + 1)); }
      if (t > fr) { chip('ARRIVED IN A FRACTION OF A SECOND', 540, 470, t, fr, { size: 34, bg: LIME, fg: BG }); lot(t, fr, 'mindblown', 900, 1160, 140); } }; }; });
