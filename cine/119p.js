// #119 CPR in the PRO look (prototype): same voice-over as #119, calm cards instead of glitch/neon.
const N = 6, BPM = 104;
const bt = (t, bpm) => { const ph = (t * bpm / 60) % 1; return Math.exp(-ph * 8); };
function beats(K, t0, t1, bpm = BPM, g0 = 0.22) { for (let t = t0; t < t1; t += 60 / bpm) K(t, 'tick', g0); }
function record(x, y, r, t) { g.save(); g.translate(x, y); g.rotate(t * 2.2); g.fillStyle = '#05090B'; g.beginPath(); g.arc(0, 0, r, 0, 6.283); g.fill();
  g.strokeStyle = 'rgba(170,230,240,0.07)'; g.lineWidth = 2; for (let k = 0.42; k < 0.98; k += 0.05) { g.beginPath(); g.arc(0, 0, r * k, 0, 6.283); g.stroke(); }
  g.fillStyle = 'rgba(255,255,255,0.06)'; g.beginPath(); g.moveTo(0, 0); g.arc(0, 0, r, -0.5, 0.15); g.closePath(); g.fill();
  g.fillStyle = PRO.card2; g.beginPath(); g.arc(0, 0, r * 0.34, 0, 6.283); g.fill(); g.lineWidth = 2; g.strokeStyle = PRO.line; g.stroke(); g.restore(); }
function ecgLine(x0, x1, y, t, bpm, col, amp, flat = 0) { const pts = [], per = 60 / bpm;
  for (let x = x0; x <= x1; x += 3) { const tt = t - (x1 - x) / 300, ph = ((tt % per) + per) % per / per; let v = 0;
    if (ph > 0.10 && ph < 0.14) v = 0.15 * Math.sin((ph - 0.10) / 0.04 * Math.PI); if (ph > 0.18 && ph < 0.20) v = -0.25; if (ph >= 0.20 && ph < 0.23) v = 1; if (ph >= 0.23 && ph < 0.25) v = -0.4;
    if (ph > 0.36 && ph < 0.46) v = 0.25 * Math.sin((ph - 0.36) / 0.10 * Math.PI); pts.push([x, y - v * amp * (1 - flat)]); }
  pline(pts, col, 5); }

VIS.open = (K) => { const sa = sw('save', 1.4); beats(K, 0.15, 3.0, BPM, 0.25); K(sa, 'ding', 0.6);
  return (t) => { proBg(t, { y: 980 }); proTitle(t, EP.titlePro || 'This disco song can *save a life*', 250, 72);
    card(t, 0.05, 190, 600, 700, 700, (lt, w, h) => { record(350, 350, 290, lt); heartIcon(350, 350, 4.2, PRO.hi, bt(lt, BPM)); }, { r: 350, fill: '#08141A' });
    card(t, 0.35, 140, 1240, 800, 150, (lt) => { kicker('Beat', 36, 52); ptext('104 BPM', 36, 112, 52, PRO.txt, { w: 800 }); ecgLine(330, 770, 95, lt, BPM, PRO.acc, 42); }); }; };

VIS[0] = S(() => (K, Sc) => { const st = sw('stops', 0.9), mi = sw('minute', 1.9), su = sw('survive', 5.0), at = Sc.vo[0].at;
  beats(K, 0.1, st, 72, 0.2); ks(K, [[st, 'flat', 0.5], [su, 'pop', 0.6, 500]]);
  return (t) => { host(t, 1, at); CAPY = 890; const dead = t > st;
    card(t, 0.15, 150, 950, 780, 300, (lt, w) => { kicker('Heart rate', 36, 56); ptext(dead ? '0' : '72', w - 36, 84, 64, dead ? PRO.hi : PRO.txt, { align: 'right', w: 800 });
      ecgLine(36, w - 36, 215, t, 72, dead ? PRO.hi : PRO.acc, 70, dead ? clamp((t - st) / 0.35) : 0); }, { out: mi - 0.05 });
    card(t, mi, 150, 950, 780, 300, (lt, w) => { kicker('Every minute counts', 36, 56); ptext(`00:${String(Math.min(59, Math.floor(lt * 7))).padStart(2, '0')}`, 36, 200, 110, PRO.txt, { w: 800 });
      pbar(420, 160, w - 456, lt / 3, PRO.hi); }, { out: su - 0.05 });
    card(t, su, 150, 950, 780, 330, (lt, w) => { for (let i = 0; i < 10; i++) { const a = inA(lt, 0.04 * i, 0.25); g.save(); g.globalAlpha *= a; personIcon(80 + i * 69, 110, 0.95, i === 4 ? PRO.acc : PRO.dim); g.restore(); }
      rich('Only about *1 in 10* survives', w / 2, 240, 42, { alpha: inA(lt, 0.4) }); ptext('Outside a hospital · USA · AHA', w / 2, 292, 24, PRO.mute, { align: 'center', alpha: inA(lt, 0.6) }); }); }; });

VIS[1] = S(() => { const cp = sw('cpr', 0.5), dbl = sw('double', 1.4), tr = sw('triple', 2.2);
  return (K) => { ks(K, [[dbl, 'pop', 0.6, 600], [tr, 'ding', 0.7]]);
    return (t) => { proBg(t);
      card(t, 0.0, 120, 520, 840, 760, (lt, w, h) => { kicker('Chance of survival', 40, 62); rich(t > cp ? 'With *CPR* right away' : 'Without help', 40, 130, 44, { align: 'left' });
        [['No CPR', 1, 0.15], ['CPR', 2, dbl], ['CPR', 3, tr]].forEach(([lab, v, at], k) => { const p = eO((t - at) / 0.5); if (p <= 0) return;
          const bx = 110 + k * 240, bh = 130 * v * p, base = h - 120, col = k === 2 ? PRO.acc : k === 1 ? 'rgba(56,224,123,0.55)' : PRO.dim;
          rrect(bx, base - bh, 150, bh, 18); g.fillStyle = col; g.fill(); ptext(`×${v}`, bx + 75, base - bh - 24, 56, k ? PRO.txt : PRO.mute, { align: 'center', w: 800 });
          ptext(lab, bx + 75, base + 50, 28, PRO.mute, { align: 'center' }); }); });
      pill('Source: American Heart Association', 540, 1330, t, cp + 0.3); }; }; });

VIS[2] = S(() => (K, Sc) => { const ca = sw('call', 0.7), mi = sw('middle', 3.2), at = Sc.vo[0].at;
  ks(K, [[ca, 'beep', 0.5], [ca + 0.25, 'beep', 0.5], [mi, 'pop', 0.6, 500]]);
  return (t) => { if (t > mi + 0.15) { proBg(t); CAPY = null;
      photoCard(t, mi + 0.15, 'cpr', 120, 470, 840, 820, { label: 'Real photo · CPR training', focus: [0.5, 0.45] }); return; }
    host(t, 3, at); CAPY = 890;
    card(t, Math.max(0.15, ca - 0.1), 230, 950, 620, 380, (lt, w) => { kicker('Step 1 · Call for help', w / 2, 60, PRO.mute, { align: 'center' }); ptext('112 · 911', w / 2, 170, 80, PRO.txt, { align: 'center', w: 800 });
      ptext('Calling…', w / 2, 225, 30, PRO.mute, { align: 'center' }); const p = 0.5 + 0.5 * Math.sin(lt * 5);
      g.fillStyle = `rgba(56,224,123,${0.15 + 0.15 * p})`; g.beginPath(); g.arc(w / 2, 305, 46 + 8 * p, 0, 6.283); g.fill(); g.fillStyle = PRO.acc; g.beginPath(); g.arc(w / 2, 305, 38, 0, 6.283); g.fill(); }); }; });

VIS[3] = S(() => { const ha = sw('hard', 0.4), fi = sw('five', 1.2), fa = sw('fast', 2.2), hu = sw('hundred', 2.6);
  return (K) => { ks(K, [[fi, 'pop', 0.5, 500]]); beats(K, fa, fa + 4, 110, 0.3);
    return (t) => { proBg(t); const ph = t > fa ? (t * 110 / 60) % 1 : (t * 0.8) % 1, p = ph < 0.5 ? eO(ph * 2) : 1 - eO((ph - 0.5) * 2);
      card(t, 0.0, 120, 470, 840, 470, (lt, w) => { kicker('Push hard', 40, 62); const base = 330;
        g.fillStyle = PRO.dim; g.beginPath(); g.moveTo(60, 420); g.lineTo(60, base + 40); g.quadraticCurveTo(200, base - 20 + p * 30, 420, base - 10 + p * 34); g.quadraticCurveTo(620, base, 640, base + 40); g.lineTo(640, 420); g.closePath(); g.fill();   // chest, pressed in
        pressHands(400, base - 6, 1.0, p, PRO.acc);
        if (t > fi) { const a = inA(t, fi); g.save(); g.globalAlpha *= a; g.strokeStyle = PRO.hi; g.lineWidth = 5; g.beginPath(); g.moveTo(560, base - 30); g.lineTo(560, base + 30); g.moveTo(540, base - 30); g.lineTo(580, base - 30); g.moveTo(540, base + 30); g.lineTo(580, base + 30); g.stroke(); g.restore();
          ptext('≈ 5 cm', 600, base + 14, 46, PRO.hi, { w: 800, alpha: a }); } });
      card(t, hu - 0.05, 120, 980, 840, 300, (lt, w) => { kicker('And fast', 40, 62); ptext('100–120', 40, 200, 110, PRO.txt, { w: 800 }); ptext('per minute', 40, 250, 30, PRO.mute);
        for (let i = 0; i < 8; i++) { const on = Math.floor(t * 110 / 60) % 8 === i; g.fillStyle = on ? PRO.acc : PRO.dim; g.beginPath(); g.arc(560 + (i % 4) * 62, 120 + Math.floor(i / 4) * 70, 20, 0, 6.283); g.fill(); } }); }; }; });

VIS[4] = S(() => (K, Sc) => { const st = sw('stayin', 0.6), hu = sw('hundred', 2.6), at = Sc.vo[0].at;
  beats(K, st, st + 4.5, BPM, 0.3); ks(K, [[hu, 'ding', 0.6]]);
  return (t) => { host(t, 5, at); CAPY = 890;
    card(t, Math.max(0.15, st - 0.1), 150, 950, 780, 250, (lt, w) => { const im = PHOTOS.beegees;
      g.save(); rrect(28, 28, 194, 194, 20); g.clip(); if (im) { const sc = Math.max(194 / im.width, 194 / im.height) * 1.6; g.drawImage(im, 125 - im.width * sc * 0.5, 125 - im.height * sc * 0.36, im.width * sc, im.height * sc); } g.restore();
      ptext("Stayin' Alive", 250, 82, 48, PRO.txt, { w: 800 }); ptext('Bee Gees · 1977', 250, 124, 28, PRO.mute); pbar(250, 160, w - 290, 0.18 + lt * 0.03, PRO.acc);
      for (let i = 0; i < 12; i++) { const b = bt(lt + i * 0.03, BPM), hh = 10 + 30 * b * (0.4 + 0.6 * Math.abs(Math.sin(i * 1.7))); rrect(250 + i * 20, 222 - hh, 10, hh, 5); g.fillStyle = PRO.acc; g.fill(); }
      ptext('Real photo', w - 36, 222, 20, PRO.mute, { align: 'right' }); }, { out: hu - 0.05 });
    card(t, hu, 150, 950, 780, 210, (lt, w) => { const x0 = 40, x1 = w - 40, X = (v) => lerp(x0, x1, (v - 90) / 40);
      kicker('Target 100–120 per minute', 40, 56); rrect(x0, 104, x1 - x0, 16, 8); g.fillStyle = PRO.dim; g.fill(); rrect(X(100), 104, X(120) - X(100), 16, 8); g.fillStyle = 'rgba(56,224,123,0.6)'; g.fill();
      const mx = X(104); g.fillStyle = PRO.hi; g.beginPath(); g.arc(mx, 112, 16, 0, 6.283); g.fill(); ptext('104 BPM', mx, 172, 32, PRO.hi, { align: 'center', w: 800 }); }); }; });

VIS[5] = S(() => (K, Sc) => { const ke = sw('keep', 0.3), he = sw('help', 1.6), co = sw('course', 4.0), cta = Sc.vo[1] ? Sc.vo[1].at : 99;
  beats(K, ke, he + 1.5, 110, 0.22); ks(K, [[co, 'ding', 0.6]]);
  return (t) => { const lt = RT ?? t;
    if (lt > cta - 0.1) { host(t, 7, cta); CAPY = 890; return; }
    proBg(t);
    card(t, 0.0, 120, 560, 840, 330, (l, w) => { kicker('Until help arrives', 40, 62); rich("*Don't stop* pushing", 40, 150, 56, { align: 'left' });
      const p = clamp(l / 6); pbar(40, 210, w - 80, p, PRO.acc); ptext('Ambulance on the way', 40, 285, 28, PRO.mute); }, { out: co - 0.05 });
    card(t, co, 120, 470, 840, 640, (l, w) => { kicker('Remember', 40, 62);
      ['Call 112 / 911', 'Middle of the chest', 'Push hard, ≈ 5 cm', '100–120 per minute', "Don't stop"].forEach((s, i) => { const a = inA(l, 0.12 * i + 0.1, 0.3); if (a <= 0) return;
        g.save(); g.globalAlpha *= a; checkIcon(64, 140 + i * 100, 1.05); ptext(s, 110, 154 + i * 100, 40, PRO.txt); g.restore(); }); });
    if (t > co) ptext('Not medical advice · learn CPR in a certified first-aid course', 540, 1160, 24, PRO.mute, { align: 'center', alpha: inA(t, co + 0.6) }); }; });
