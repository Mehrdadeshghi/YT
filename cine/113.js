// Wiki Roulette #113 — HOW IT WORKS #5: Apple Pay / Google Pay (the shop never sees your card number). Motion graphics (tech.js kit).
// Retention: frame-1 claim (shop never sees your number) → card number morphs into a TOKEN → face/finger/code check →
// token + one-time code fly to the till → only the bank vault turns it back → shop hacked: nothing to steal → lost phone tip → CTA.
const N = 7, REAL = '4242 4242 4242 4242', TOKEN = '5300 1928 7781 0442';
const pEase = (x) => 1 - Math.pow(1 - clamp(x), 3);
function morphNum(a, b, p, t) { const r = rng(Math.floor(t * 24)); return a.split('').map((c, i) => c === ' ' ? ' ' : (i / a.length < p - 0.15 ? b[i] : i / a.length < p ? '0123456789'[Math.floor(r() * 10)] : c)).join(''); }
function miniCard(x, y, s, rot, num, o = {}) { g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s); g.shadowColor = 'rgba(0,0,0,0.6)'; g.shadowBlur = 40; rrect(-300, -189, 600, 378, 28);
  const gr = g.createLinearGradient(-300, -189, 300, 189); gr.addColorStop(0, o.c1 || '#24418C'); gr.addColorStop(1, o.c2 || '#0B1636'); g.fillStyle = gr; g.fill(); g.shadowBlur = 0; g.lineWidth = 3; g.strokeStyle = o.edge || 'rgba(255,255,255,0.25)'; g.stroke();
  text(o.label || 'WIKI BANK', -260, -120, 'disp', 38, '#FFFFFF'); rrect(-260, -60, 90, 68, 10); g.fillStyle = '#D9B45A'; g.fill(); text(num, -260, 90, 'mono', 40, o.numCol || '#E6ECF8'); if (o.sub) text(o.sub, -260, 145, 'mono', 26, o.subCol || GOLD); g.restore(); }
function packet(x, y, label, val, col, s = 1) { g.save(); g.translate(x, y); g.scale(s, s); g.shadowColor = col; g.shadowBlur = 30; rrect(-250, -55, 500, 110, 22); g.fillStyle = 'rgba(8,16,30,0.95)'; g.fill(); g.lineWidth = 4; g.strokeStyle = col; g.stroke(); g.shadowBlur = 0;
  text(label, -220, -10, 'mono', 24, col); text(val, -220, 32, 'mono', 34, '#FFFFFF'); g.restore(); }
function lockIcon(x, y, s, col, open = 0) { g.save(); g.translate(x, y); g.scale(s, s); g.strokeStyle = col; g.lineWidth = 12; g.beginPath(); g.arc(0, -40 - open * 30, 40, Math.PI, 0); g.lineTo(40, -40 + 0 - open * 30); g.stroke(); rrect(-60, -40, 120, 100, 16); g.fillStyle = col; g.fill(); g.fillStyle = '#05101E'; g.beginPath(); g.arc(0, 0, 12, 0, 6.283); g.fill(); g.fillRect(-5, 0, 10, 30); g.restore(); }
function bankHouse(x, y, s, col = GOLD) { g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = col; g.shadowColor = col; g.shadowBlur = 30; g.beginPath(); g.moveTo(-160, -60); g.lineTo(0, -150); g.lineTo(160, -60); g.closePath(); g.fill();
  for (let k = 0; k < 4; k++) g.fillRect(-130 + k * 80, -40, 30, 140); g.fillRect(-170, 110, 340, 30); g.restore(); text('BANK', x, y + 200 * s, 'disp', 50 * s, col, { align: 'center' }); }
function till(x, y, s, t, label = 'SHOP') { g.save(); g.translate(x, y); g.scale(s, s); g.shadowColor = 'rgba(0,0,0,0.6)'; g.shadowBlur = 40; rrect(-200, -150, 400, 300, 30); g.fillStyle = '#1A1E26'; g.fill(); g.shadowBlur = 0; g.lineWidth = 4; g.strokeStyle = '#3A4252'; g.stroke();
  rrect(-170, -120, 340, 150, 16); g.fillStyle = '#0A1830'; g.fill(); text(label, 0, -30, 'disp', 50, '#FFFFFF', { align: 'center' }); g.restore(); }
function faceScan(t, cx, cy, p) { g.save(); g.strokeStyle = CY; g.lineWidth = 6; g.shadowColor = CY; g.shadowBlur = 20; g.beginPath(); g.ellipse(cx, cy, 120, 160, 0, 0, 6.283); g.stroke();
  for (let i = 0; i < 90; i++) { const a = i * 2.39996, r = Math.sqrt(i / 90), x = cx + Math.cos(a) * r * 110, y = cy + Math.sin(a) * r * 150; if ((i / 90) < p) glowDot(x, y, 3.5, '#FFFFFF', 0.9); }
  const sy = cy - 160 + ((t * 300) % 320); g.strokeStyle = LIME; g.beginPath(); g.moveTo(cx - 140, sy); g.lineTo(cx + 140, sy); g.stroke(); g.restore(); }
function fingerprint(cx, cy, s, col) { g.save(); g.strokeStyle = col; g.lineWidth = 5; g.lineCap = 'round'; for (let k = 1; k < 8; k++) { g.beginPath(); g.ellipse(cx, cy, k * 14 * s, k * 19 * s, 0, Math.PI * (1.1 + k * 0.02), Math.PI * (1.9 + k * 0.03) + (k % 2) * 0.6); g.stroke(); } g.restore(); }
function walletPhone(x, y, s, t, num, o = {}) { phoneFrame(x, y, s, () => { const gr = g.createLinearGradient(0, -378, 0, 378); gr.addColorStop(0, '#0B1428'); gr.addColorStop(1, '#030710'); g.fillStyle = gr; g.fillRect(-190, -380, 380, 760);
  text('Wallet', -160, -300, 'disp', 40, '#FFFFFF'); miniCard(0, -100, 0.56, 0, num, o.card || {}); if (o.inner) o.inner(); }); }

// ---------- scenes ----------
VIS.open = (K) => { const pa = sw('pay', 0.8), ne = sw('never', 2.4), nu = sw('number', 3.2); K(0.05, 'hit', 1.3); ks(K, [[pa, 'whoosh', 0.8], ...drop(ne, 0.35), [nu, 'glitch', 0.9]]);
  return (t) => { techBg(t, '#04070F', '#0D1F3A'); walletPhone(300, 1040, 0.62, t, t > ne ? TOKEN : REAL); till(820, 1060, 0.85, t, t > nu ? '????' : '€ 4.20');
    if (t > pa) { const u = ((t - pa) * 0.9) % 1; for (let k = 0; k < 6; k++) { const q = clamp(u - k * 0.04); glowDot(lerp(420, 700, q), lerp(980, 1020, q) - Math.sin(q * Math.PI) * 90, 9 - k, t > ne ? GOLD : '#FFFFFF', 1 - k * 0.15); } }
    if (t > nu) { rgbText('NEVER SEEN', 540, 820, 110, t, nu, { color: GOLD, jitter: true }); g.save(); g.strokeStyle = RED2; g.lineWidth = 10; g.beginPath(); g.moveTo(660, 940); g.lineTo(980, 1100); g.stroke(); g.restore(); }
    tag(t); hook(t, EP.hook, 400); if (EP.series) chip(EP.series, 80, 300, t, -0.3, { size: 26, align: 'left', bg: GOLD, fg: BG }); }; };

VIS[0] = S(() => { const ad = sw('add', 0.4), ba = sw('bank', 1.4), st = sw('stand', 2.0), to = sw('token', 4.2);
  return (K) => { ks(K, [[ad, 'swish', 0.8], [ba, 'ding', 0.8], [st, 'type', 1], ...drop(to, 0.35)]);
    return (t) => { techBg(t); tag(t, 0, N); const p = pEase((t - st) / Math.max(0.6, to - st - 0.2)), num = t > st ? morphNum(REAL, TOKEN, p, t) : REAL;
      if (t > ba) bankHouse(220, 640, 0.6); if (t > ba) { glowLine([[330, 640], [540, 860]], GOLD, 4, 0.5); }
      miniCard(540, 960, 1.15, 0, num, t > to ? { c1: '#5A3A0E', c2: '#2A1A05', edge: GOLD, numCol: GOLD, sub: 'TOKEN · ONLY FOR THIS PHONE', subCol: GOLD } : { sub: t > st ? 'REAL CARD NUMBER' : '', subCol: '#9FB3CF' });
      if (t > to) { rgbText('TOKEN', 540, 470, 150, t, to, { color: GOLD }); shock(540, 960, t, to, 420, GOLD); } else if (t > st) rgbText('STAND-IN NUMBER', 540, 470, 86, t, st, { color: '#FFFFFF' }); }; }; });

VIS[1] = S(() => { const fa = sw('face', 1.6), fi = sw('fingerprint', 2.2), co = sw('code', 3.0), re = sw('really', 1.0);
  return (K) => { ks(K, [[re, 'beep', 0.8], [fa, 'beep', 0.9], [fi, 'beep', 0.9], [co, 'ding', 1.1]]);
    return (t) => { techBg(t, '#03070F', '#0A1B33'); tag(t, 1, N);
      phoneFrame(540, 900, 0.95, () => { g.fillStyle = '#05101E'; g.fillRect(-190, -380, 380, 760); const ok = t > co + 0.2;
        if (t < fi) faceScan(t, 0, -40, clamp((t - 0.2) / 1.2)); else if (t < co) fingerprint(0, -40, 1.6, CY); else { for (let r = 0; r < 4; r++) for (let c = 0; c < 3; c++) { g.beginPath(); g.arc(-100 + c * 100, -150 + r * 100, 36, 0, 6.283); g.fillStyle = '#1D2A44'; g.fill(); text(String(r * 3 + c + 1 === 11 ? 0 : (r * 3 + c + 1) % 11), -100 + c * 100, -138 + r * 100, 'disp', 34, '#FFFFFF', { align: 'center' }); } }
        if (ok) { g.fillStyle = 'rgba(5,16,30,0.75)'; g.fillRect(-190, -380, 380, 760); g.strokeStyle = LIME; g.lineWidth = 18; g.lineCap = 'round'; g.beginPath(); g.moveTo(-70, -40); g.lineTo(-20, 10); g.lineTo(80, -100); g.stroke(); } });
      const lab = t > co ? 'CODE' : t > fi ? 'FINGERPRINT' : t > fa ? 'FACE' : 'IS IT REALLY YOU?'; rgbText(lab, 540, 420, t > fa ? 120 : 84, t, t > co ? co : t > fi ? fi : t > fa ? fa : re, { color: t > fa ? CY : '#FFFFFF' }); }; }; });

VIS[2] = S(() => { const se = sw('sends', 0.6), to = sw('token', 1.0), on = sw('one', 2.0), pa = sw('payment', 3.2);
  return (K) => { ks(K, [[se, 'whoosh', 0.8], [to, 'pop', 0.8, 600], [on, 'pop', 0.8, 800], [pa, 'ding', 1]]);
    return (t) => { if (t > pa + 0.25) { const P = shot(t, 'applesq', { a: [0.5, 0.5, 1.1], b: [0.5, 0.5, 1.25], dur: 2, t0: pa }); if (!P) noPhoto(t); tag(t, 2, N); realBadge(t, pa + 0.3, 'REAL PHOTO · PAYING WITH A PHONE'); return; }
      techBg(t); tag(t, 2, N); walletPhone(250, 1050, 0.55, t, TOKEN, { card: { c1: '#5A3A0E', c2: '#2A1A05', edge: GOLD, numCol: GOLD } }); till(840, 1080, 0.8, t, '€ 4.20');
      if (t > to) { const p = pEase((t - to) / 0.7); packet(lerp(330, 540, p), lerp(900, 640, p), 'TOKEN', TOKEN, GOLD, 0.9); }
      if (t > on) { const p = pEase((t - on) / 0.7), r = rng(Math.floor(t * 20)), code = t < on + 0.5 ? Array.from({ length: 9 }, (_, i) => i === 4 ? '-' : 'ABCDEF0123456789'[Math.floor(r() * 16)]).join('') : '7F2A-91C3'; packet(lerp(330, 540, p), lerp(1000, 800, p), 'ONE-TIME CODE', code, MG, 0.9); }
      if (t > on + 0.3) chip('ONLY VALID FOR THIS PAYMENT', 540, 470, t, on + 0.3, { size: 34, bg: MG, fg: '#FFF' }); }; }; });

VIS[3] = S(() => { const ba = sw('bank', 0.8), tu = sw('turn', 1.6), re = sw('real', 2.6);
  return (K) => { ks(K, [[0.2, 'whoosh', 0.7], [ba, 'ding', 0.9], [tu, 'type', 0.9], ...drop(re, 0.35)]);
    return (t) => { techBg(t, '#050A06', '#0F2412'); tag(t, 3, N); bankHouse(540, 780, 0.9); lockIcon(540, 1010, 0.8, GOLD, t > re ? 1 : 0);
      const p = pEase((t - 0.1) / 0.6); packet(lerp(-200, 540, p), 1165, 'TOKEN IN', TOKEN, GOLD, 0.95);
      if (t > re) { packet(540, 520, 'ONLY NETWORK + BANK SEE', REAL, LIME, 0.95); shock(540, 1010, t, re, 300, LIME); } }; }; });

VIS[4] = S(() => { const sh = sw('shop', 0.4), ha = sw('hacked', 1.0), re = sw('real', 1.8), st = sw('steal', 3.0);
  return (K) => { ks(K, [[ha, 'glitch', 1], [ha + 0.02, 'wrong', 0.9], ...drop(st, 0.35)]);
    return (t) => { techBg(t, '#0E0408', '#22070F'); tag(t, 4, N); const hk = t > ha;
      g.save(); rrect(120, 560, 840, 620, 26); g.fillStyle = 'rgba(8,10,18,0.95)'; g.fill(); g.lineWidth = 4; g.strokeStyle = hk ? RED2 : '#3A4252'; g.stroke(); g.restore();
      text('SHOP DATABASE', 160, 620, 'mono', 30, hk ? RED2 : '#9FB3CF');
      for (let i = 0; i < 6; i++) { const y = 700 + i * 80, r = rng(i * 7 + 3), tok = `${Math.floor(1000 + r() * 8999)} •••• •••• ${Math.floor(1000 + r() * 8999)}`, gl = hk ? Math.sin(t * 50 + i) * 6 : 0;
        text(`#${1040 + i}`, 160 + gl, y, 'mono', 30, '#6F7E99'); text(t > re ? 'TOKEN ' + tok : '••••  ••••  ••••', 330 + gl, y, 'mono', 30, t > re ? GOLD : '#C9D4E8'); }
      if (hk) { if (Math.floor(t * 6) % 2) { g.fillStyle = 'rgba(255,40,60,0.10)'; g.fillRect(0, 0, W, H); } chip('⚠ HACKED', 540, 470, t, ha, { size: 50, bg: RED2, fg: '#FFF' }); lot(t, ha, 'skull', 900, 600, 110); }
      if (t > st) { rgbText('NOTHING TO STEAL', 540, 470, 92, t, st, { color: LIME, jitter: true }); } }; }; });

VIS[5] = S(() => { const lo = sw('lost', 0.3), ma = sw('mark', 1.0), st = sw('stops', 2.2), ca = sw('card', 3.2);
  return (K) => { ks(K, [[lo, 'wrong', 0.8], [ma, 'pop', 0.9, 600], [st, 'stamp', 1], [ca, 'ding', 1]]);
    return (t) => { techBg(t); tag(t, 5, N); const fr = t > st;
      walletPhone(330, 960, 0.75, t, TOKEN, { card: { c1: fr ? '#3A4252' : '#5A3A0E', c2: fr ? '#1A1E26' : '#2A1A05', edge: fr ? '#9FB3CF' : GOLD, numCol: fr ? '#9FB3CF' : GOLD }, inner: () => {
        if (t > ma) { rrect(-150, 150, 300, 80, 40); g.fillStyle = t > st ? RED2 : 'rgba(255,59,78,0.8)'; g.fill(); text('MARK AS LOST', 0, 202, 'disp', 30, '#FFFFFF', { align: 'center' }); }
        if (fr) { g.fillStyle = 'rgba(160,200,255,0.18)'; g.fillRect(-190, -380, 380, 760); } } });
      if (fr) { lockIcon(330, 780, 0.8, RED2); chip('PHONE PAYMENTS: OFF', 330, 1330, t, st, { size: 30, bg: RED2, fg: '#FFF' }); }
      if (t > ca) { miniCard(790, 900, 0.48, 0.08, REAL.slice(0, 4) + ' •••• •••• 4242'); chip('✓ CARD STILL WORKS', 790, 1060, t, ca, { size: 30, bg: LIME, fg: BG }); }
      if (t > lo && t < st) rgbText('PHONE LOST?', 540, 470, 110, t, lo, { color: RED2 }); if (t > st) rgbText('FROZEN', 540, 470, 130, t, st, { color: '#BFE4FF' }); }; }; });

VIS[6] = S(() => { const pa = sw('pays', 0.4), sh = sw('showing', 1.4), ph = sw('phone', 3.6, 1);
  return (K) => { ks(K, [[0.1, 'pop', 0.8, 700], ...drop(sh, 0.35), [ph, 'pop', 0.9, 600]]);
    return (t) => { if (t < pa + 0.2) { const P = shot(t, 'rossmann', { a: [0.5, 0.45, 1.1], b: [0.5, 0.45, 1.25], dur: 1.5 }); if (!P) noPhoto(t); tag(t, 6, N); realBadge(t, 0.05, 'REAL PHOTO · APPLE PAY & GOOGLE PAY AT A TILL, GERMANY'); return; }
      techBg(t); tag(t, 6, N); walletPhone(540, 940, 0.9, t, TOKEN, { card: { c1: '#5A3A0E', c2: '#2A1A05', edge: GOLD, numCol: GOLD } });
      if (t > sh) { rgbText('CARD NUMBER: HIDDEN', 540, 430, 80, t, sh, { color: GOLD }); lot(t, sh, 'eyes', 900, 600, 110); } }; }; });
