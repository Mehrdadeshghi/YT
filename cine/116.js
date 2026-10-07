// Wiki Roulette #116 — HOW IT WORKS #8: what Incognito mode really hides. Motion graphics (tech.js kit).
// Retention: frame-1 riddle (hides you from ONE person) → answer: the next person at your device (history wiped) → websites still see →
// employer / school / provider eyes light up along the network path → 2024 settlement (billions of records) → value (gifts yes, hiding no) → CTA.
const N = 6;
const iEase = (x) => 1 - Math.pow(1 - clamp(x), 3);
function eye(x, y, s, open, col = '#FFFFFF', t = 0) { g.save(); g.translate(x, y); g.scale(s, s); const o = clamp(open); g.strokeStyle = col; g.lineWidth = 8; g.shadowColor = col; g.shadowBlur = 20;
  g.beginPath(); g.moveTo(-70, 0); g.quadraticCurveTo(0, -70 * o - 2, 70, 0); g.quadraticCurveTo(0, 70 * o + 2, -70, 0); g.stroke();
  if (o > 0.3) { g.fillStyle = col; g.beginPath(); g.arc(Math.sin(t * 2) * 10, 0, 24 * o, 0, 6.283); g.fill(); g.fillStyle = '#05101E'; g.beginPath(); g.arc(Math.sin(t * 2) * 10, 0, 10 * o, 0, 6.283); g.fill(); } g.restore(); }
function agent(x, y, s, col, a = 1) { g.save(); g.globalAlpha *= a; g.translate(x, y); g.scale(s, s); g.fillStyle = col; g.beginPath(); g.arc(0, -120, 60, 0, 6.283); g.fill(); g.beginPath(); g.moveTo(-110, 60); g.quadraticCurveTo(-100, -50, 0, -50); g.quadraticCurveTo(100, -50, 110, 60); g.closePath(); g.fill(); g.restore(); }
function spy(x, y, s, col = '#DDE6F7') { g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = col; g.beginPath(); g.ellipse(0, -20, 110, 22, 0, 0, 6.283); g.fill(); g.beginPath(); g.moveTo(-60, -20); g.lineTo(-45, -90); g.lineTo(45, -90); g.lineTo(60, -20); g.closePath(); g.fill();
  g.lineWidth = 10; g.strokeStyle = col; g.beginPath(); g.arc(-40, 40, 28, 0, 6.283); g.stroke(); g.beginPath(); g.arc(40, 40, 28, 0, 6.283); g.stroke(); g.beginPath(); g.moveTo(-12, 40); g.lineTo(12, 40); g.stroke(); g.restore(); }
function browser(x, y, w, h, t, o = {}) { g.save(); g.translate(x, y); g.shadowColor = 'rgba(0,0,0,0.6)'; g.shadowBlur = 40; rrect(-w / 2, -h / 2, w, h, 24); g.fillStyle = '#1E1530'; g.fill(); g.shadowBlur = 0;
  g.fillStyle = '#2A1F44'; rrect(-w / 2, -h / 2, w, 70, 24); g.fill(); [0, 1, 2].forEach((k) => { g.fillStyle = ['#FF5F57', '#FEBC2E', '#28C840'][k]; g.beginPath(); g.arc(-w / 2 + 34 + k * 30, -h / 2 + 35, 9, 0, 6.283); g.fill(); });
  rrect(-w / 2 + 130, -h / 2 + 16, w - 160, 38, 19); g.fillStyle = '#120C20'; g.fill(); text(o.url || 'private window', -w / 2 + 150, -h / 2 + 44, 'mono', 22, '#B9A8E8'); if (o.inner) o.inner(); g.restore(); }
function building(x, y, s, kind, col) { g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = col; g.shadowColor = col; g.shadowBlur = 20;
  if (kind === 'tower') { g.lineWidth = 10; g.strokeStyle = col; g.beginPath(); g.moveTo(-60, 100); g.lineTo(0, -110); g.lineTo(60, 100); g.moveTo(-35, 20); g.lineTo(35, 20); g.stroke(); for (let k = 1; k <= 2; k++) { g.beginPath(); g.arc(0, -110, k * 30, -2.4, -0.7); g.stroke(); } }
  else { g.fillRect(-90, -60, 180, 160); g.fillStyle = '#05101E'; for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) g.fillRect(-70 + c * 52, -40 + r * 45, 30, 28); g.fillStyle = col;
    if (kind === 'school') { g.beginPath(); g.moveTo(-110, -60); g.lineTo(0, -130); g.lineTo(110, -60); g.closePath(); g.fill(); g.fillRect(-4, -200, 8, 70); g.fillRect(4, -200, 50, 30); } else g.fillRect(-90, -80, 180, 20); }
  g.restore(); }

// ---------- scenes ----------
VIS.open = (K) => { const hi = sw('hides', 0.6), on = sw('one', 2.0); K(0.05, 'hit', 1.3); ks(K, [[hi, 'swish', 0.8], ...drop(on, 0.4)]);
  return (t) => { techBg(t, '#07040F', '#1A0E30'); browser(540, 1000, 820, 520, t, { inner: () => spy(0, 30, 1.3) });
    const ey = [[160, 700], [920, 700], [130, 1290], [950, 1290]]; ey.forEach(([x, y], k) => eye(x, y, 0.8, t > on ? 1 : 0.15 + 0.1 * Math.sin(t * 3 + k), RED2, t));
    if (t > on) { rgbText('JUST 1 PERSON', 540, 650, 110, t, on, { color: GOLD }); }
    tag(t); hook(t, EP.hook, 400); if (EP.series) chip(EP.series, 80, 300, t, -0.3, { size: 26, align: 'left', bg: GOLD, fg: BG }); }; };

VIS[0] = S(() => { const ne = sw('next', 0.8), hi = sw('history', 1.6), wi = sw('wiped', 3.0);
  return (K) => { ks(K, [[0.2, 'pop', 0.8, 600], [ne, 'whoosh', 0.7], [wi, 'swish', 1], [wi + 0.05, 'ding', 1]]);
    return (t) => { techBg(t, '#07040F', '#1A0E30'); tag(t, 0, N); const items = ['gift ideas for mom', 'cheap flights lisbon', 'how to tie a tie', 'birthday cake recipe', 'sneakers size 43'];
      browser(540, 850, 820, 620, t, { url: 'history', inner: () => items.forEach((s, k) => { const y = -170 + k * 90, wp = t > wi ? iEase((t - wi - k * 0.07) / 0.4) : 0;
        g.save(); g.globalAlpha = 1 - wp; g.translate(wp * 500, 0); text('◷  ' + s, -360, y, 'ui', 38, '#DDE6F7'); g.restore(); }) });
      if (t > ne) agent(880, 1200, 0.8, '#8AA4FF', clamp((t - ne) / 0.4)); if (t > ne) text('NEXT PERSON', 880, 1300, 'mono', 26, '#8AA4FF', { align: 'center' });
      if (t > wi) { rgbText('WIPED', 540, 450, 140, t, wi, { color: LIME }); chip('HISTORY · COOKIES · SITE DATA', 540, 540, t, wi + 0.2, { size: 30, bg: LIME, fg: BG }); } else if (t > hi) rgbText('YOUR HISTORY', 540, 450, 110, t, hi, { color: '#FFFFFF' }); }; }; });

VIS[1] = S(() => { const we = sw('websites', 0.6), se = sw('see', 1.6);
  return (K) => { ks(K, [[we, 'whoosh', 0.7], ...drop(se, 0.35)]);
    return (t) => { techBg(t, '#07040F', '#1A0E30'); tag(t, 1, N); browser(300, 900, 420, 320, t, { inner: () => spy(0, 30, 0.7) });
      g.save(); g.translate(800, 900); g.shadowColor = 'rgba(0,0,0,0.6)'; g.shadowBlur = 30; rrect(-130, -200, 260, 400, 20); g.fillStyle = '#1A1E26'; g.fill(); g.shadowBlur = 0; for (let k = 0; k < 4; k++) { rrect(-100, -170 + k * 90, 200, 60, 10); g.fillStyle = '#2B3240'; g.fill(); glowDot(70, -140 + k * 90, 8, LIME, 0.5 + 0.5 * Math.sin(t * 6 + k)); } g.restore(); text('WEBSITE', 800, 1150, 'mono', 28, '#9FB3CF', { align: 'center' });
      if (t > we) { const u = ((t - we) * 1.2) % 1; for (let k = 0; k < 5; k++) glowDot(lerp(510, 670, clamp(u - k * 0.05)), 900, 9 - k, CY, 1 - k * 0.18); }
      if (t > se) { eye(800, 640, 1.1, iEase((t - se) / 0.3), RED2, t); rgbText('STILL SEES YOU', 540, 450, 92, t, se, { color: RED2 }); } }; }; });

VIS[2] = S(() => { const em = sw('employer', 0.4), sc = sw('school', 1.2), pr = sw('provider', 2.2), ac = sw('activity', 3.2);
  return (K) => { ks(K, [[em, 'pop', 0.9, 500], [sc, 'pop', 0.9, 650], [pr, 'pop', 0.9, 800], [ac, 'wrong', 0.9]]);
    return (t) => { techBg(t, '#07040F', '#1A0E30'); tag(t, 2, N); const nodes = [[160, 1050, 'laptop'], [400, 1050, 'office', em, 'EMPLOYER'], [660, 1050, 'school', sc, 'SCHOOL'], [920, 1050, 'tower', pr, 'PROVIDER']];
      glowLine([[160, 1050], [920, 1050]], 'rgba(62,230,255,0.6)', 4, 0.6); const u = (t * 0.6) % 1; for (let k = 0; k < 6; k++) glowDot(lerp(160, 920, clamp(u - k * 0.03)), 1050, 9 - k, CY, 1 - k * 0.15);
      nodes.forEach(([x, y, kind, at, lab], k) => { if (kind === 'laptop') { g.save(); g.translate(x, y); rrect(-90, -70, 180, 110, 10); g.fillStyle = '#2A1F44'; g.fill(); g.fillStyle = '#3A4252'; g.fillRect(-110, 40, 220, 16); g.restore(); spy(x, y - 15, 0.45); return; }
        const on = t > at; building(x, y, 0.75, kind, on ? RED2 : '#3A4252'); if (on) { eye(x, y - 210, 0.6, iEase((t - at) / 0.3), RED2, t); text(lab, x, y + 130, 'mono', 26, RED2, { align: 'center' }); } });
      if (t > ac) rgbText('THEY CAN SEE IT', 540, 450, 110, t, ac, { color: RED2 }); else if (t > em) rgbText('INCOGNITO ≠ HIDDEN', 540, 450, 96, t, em, { color: '#FFFFFF' }); }; }; });

VIS[3] = S(() => { const tw = sw('twenty', 0.4), go = sw('google', 1.4), bi = sw('billions', 3.0), la = sw('lawsuit', 4.6);
  return (K) => { ks(K, [[tw, 'whoosh', 0.8], [go, 'pop', 0.8, 600], ...drop(bi, 0.4), [la, 'stamp', 1]]);
    return (t) => { const P = shot(t, 'dc', { a: [0.5, 0.5, 1.1], b: [0.45, 0.5, 1.35], dur: 5 }); if (!P) techBg(t); g.fillStyle = 'rgba(5,4,12,0.72)'; g.fillRect(0, 0, W, H); tag(t, 3, N); realBadge(t, 0.1, 'REAL PHOTO · DATA CENTER (SYMBOL IMAGE)');
      if (t > tw && t < bi) { rgbText('2024', 540, 520, 180, t, tw, { color: GOLD }); if (t > go) chip('GOOGLE · INCOGNITO LAWSUIT SETTLEMENT', 540, 620, t, go, { size: 30, bg: GOLD, fg: BG }); }
      if (t > bi) { const v = Math.round(1e9 * iEase((t - bi) / 0.8)); rgbText(v >= 1e9 ? 'BILLIONS' : v.toLocaleString('en-US'), 540, 520, 150, t, bi, { color: RED2, jitter: true }); chip('OF RECORDS TO DELETE OR ANONYMIZE', 540, 620, t, bi + 0.2, { size: 30, bg: RED2, fg: '#FFF' });
        for (let k = 0; k < 8; k++) { const y = 720 + k * 50, p = iEase((t - bi - k * 0.08) / 0.4); g.save(); g.globalAlpha = 1 - p; text(`record_${(91827 + k * 377).toString(16)}  ip 203.0.•.•  visited ••••`, 90 + p * 700, y, 'mono', 26, '#C9D4E8'); g.restore(); } }
      if (t > la) chip('APRIL 2024 · NO DAMAGES PAID', 540, 1150, t, la, { size: 26, bg: 'rgba(255,255,255,0.9)', fg: BG }); }; }; });

VIS[4] = S(() => { const gi = sw('gifts', 1.4), sh = sw('shared', 2.0), hi = sw('hiding', 3.2);
  return (K) => { ks(K, [[gi, 'ding', 1], [sh, 'pop', 0.7, 700], [hi, 'wrong', 1]]);
    return (t) => { techBg(t, '#07040F', '#1A0E30'); tag(t, 4, N);
      g.save(); g.translate(330, 900); const b = t > gi ? 1 + 0.05 * Math.sin(t * 6) : 1; g.scale(b, b); g.fillStyle = MG; g.shadowColor = MG; g.shadowBlur = 30; g.fillRect(-140, -80, 280, 220); g.fillStyle = '#C23BA8'; g.fillRect(-160, -130, 320, 70);
      g.fillStyle = GOLD; g.fillRect(-20, -130, 40, 270); g.beginPath(); g.ellipse(-50, -150, 50, 28, -0.4, 0, 6.283); g.fill(); g.beginPath(); g.ellipse(50, -150, 50, 28, 0.4, 0, 6.283); g.fill(); g.restore();
      if (t > gi) chip('✓ SURPRISE GIFTS', 330, 1120, t, gi, { size: 34, bg: LIME, fg: BG });
      if (t > hi) { spy(760, 880, 1.2, '#6F7E99'); g.save(); g.strokeStyle = RED2; g.lineWidth = 16; g.lineCap = 'round'; g.shadowColor = RED2; g.shadowBlur = 24; g.beginPath(); g.moveTo(640, 760); g.lineTo(880, 1000); g.moveTo(880, 760); g.lineTo(640, 1000); g.stroke(); g.restore(); chip('✗ HIDING', 760, 1120, t, hi, { size: 34, bg: RED2, fg: '#FFF' }); }
      rgbText(t > hi ? 'NOT FOR HIDING' : 'PERFECT FOR…', 540, 450, 104, t, t > hi ? hi : 0.1, { color: t > hi ? RED2 : GOLD }); }; }; });

VIS[5] = S(() => { const pr = sw('private', 0.2), inv = sw('invisible', 1.2), cm = sw('comment', 3.6);
  return (K) => { ks(K, [[pr, 'pop', 0.8, 700], ...drop(inv, 0.4)]);
    return (t) => { techBg(t, '#07040F', '#1A0E30'); tag(t, 5, N); const fade = t > inv ? 0.45 + 0.1 * Math.sin(t * 5) : 1; agent(540, 1000, 1.4, '#8AA4FF', fade);
      if (t > inv) [[200, 700], [880, 700], [200, 1150], [880, 1150]].forEach(([x, y], k) => eye(x, y, 0.7, iEase((t - inv - k * 0.1) / 0.3), RED2, t));
      rgbText(t > inv ? 'NOT INVISIBLE' : 'PRIVATE…', 540, 450, 120, t, t > inv ? inv : pr, { color: t > inv ? RED2 : '#B9A8E8', jitter: t > inv }); if (t > inv) lot(t, inv + 0.1, 'eyes', 540, 620, 110); }; }; });
