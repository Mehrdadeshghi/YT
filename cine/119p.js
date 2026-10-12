// #119 CPR in the PRO look (prototype): same voice-over as #119, calm cards instead of glitch/neon.
const N = 6, BPM = 104;
const bt = (t, bpm) => { const ph = (t * bpm / 60) % 1; return Math.exp(-ph * 8); };
function beats(K, t0, t1, bpm = BPM, g0 = 0.22) { for (let t = t0; t < t1; t += 60 / bpm) K(t, 'tick', g0); }
function record(x, y, r, t) { g.save(); g.translate(x, y); g.rotate(t * 2.2); g.fillStyle = '#05090B'; g.beginPath(); g.arc(0, 0, r, 0, 6.283); g.fill();
  g.strokeStyle = 'rgba(170,230,240,0.07)'; g.lineWidth = 2; for (let k = 0.42; k < 0.98; k += 0.05) { g.beginPath(); g.arc(0, 0, r * k, 0, 6.283); g.stroke(); }
  g.fillStyle = 'rgba(255,255,255,0.06)'; g.beginPath(); g.moveTo(0, 0); g.arc(0, 0, r, -0.5, 0.15); g.closePath(); g.fill();
  g.fillStyle = PRO.card2; g.beginPath(); g.arc(0, 0, r * 0.34, 0, 6.283); g.fill(); g.lineWidth = 2; g.strokeStyle = PRO.line; g.stroke(); g.restore(); }
function ecg(x0, x1, y, t, bpm, col, amp, flat = 0) { const pts = [], per = 60 / bpm;
  for (let x = x0; x <= x1; x += 3) { const tt = t - (x1 - x) / 300, ph = ((tt % per) + per) % per / per; let v = 0;
    if (ph > 0.10 && ph < 0.14) v = 0.15 * Math.sin((ph - 0.10) / 0.04 * Math.PI); if (ph > 0.18 && ph < 0.20) v = -0.25; if (ph >= 0.20 && ph < 0.23) v = 1; if (ph >= 0.23 && ph < 0.25) v = -0.4;
    if (ph > 0.36 && ph < 0.46) v = 0.25 * Math.sin((ph - 0.36) / 0.10 * Math.PI); pts.push([x, y - v * amp * (1 - flat)]); }
  pline(pts, col, 5); }

VIS.open = (K) => { const sa = sw('save', 1.4); beats(K, 0.15, 3.0, BPM, 0.25); K(sa, 'ding', 0.6);
  return (t) => { proBg(t, { y: 980 }); proTitle(t, EP.titlePro || 'This disco song can *save a life*', 250, 72);
    card(t, 0.05, 190, 600, 700, 700, (lt, w, h) => { record(350, 350, 290, lt); heartIcon(350, 350, 4.2, PRO.hi, bt(lt, BPM)); }, { r: 350, fill: '#08141A' });
    card(t, 0.35, 140, 1240, 800, 150, (lt) => { kicker('Beat', 36, 52); ptext('104 BPM', 36, 112, 52, PRO.txt, { w: 800 }); ecg(330, 770, 95, lt, BPM, PRO.acc, 42); }); }; };

VIS[0] = S(() => { const st = sw('stops', 0.9), mi = sw('minute', 1.9), su = sw('survive', 5.0);
  return (K) => { beats(K, 0.1, st, 72, 0.2); ks(K, [[st, 'flat', 0.5], [su, 'pop', 0.6, 500]]);
    return (t) => { proBg(t); const dead = t > st, gone = su;
      card(t, 0.0, 120, 560, 840, 380, (lt, w) => { kicker('Heart rate', 40, 62); const hr = dead ? 0 : 72;
        ptext(String(hr), w - 40, 92, 72, dead ? PRO.hi : PRO.txt, { align: 'right', w: 800 }); ptext('bpm', w - 40, 130, 26, PRO.mute, { align: 'right' });
        ecg(40, w - 40, 270, t, 72, dead ? PRO.hi : PRO.acc, 90, dead ? clamp((t - st) / 0.35) : 0); }, { out: gone - 0.05 });
      card(t, mi, 120, 980, 840, 260, (lt, w) => { kicker('Time without a heartbeat', 40, 62); const s = Math.min(59, Math.floor(lt * 7));
        ptext(`00:${String(s).padStart(2, '0')}`, 40, 190, 120, PRO.txt, { w: 800 }); pbar(470, 150, w - 510, lt / 4, PRO.hi); }, { out: gone - 0.05 });
      card(t, gone, 120, 600, 840, 640, (lt, w) => { kicker('Cardiac arrest outside a hospital', 40, 62, PRO.mute);
        for (let i = 0; i < 10; i++) { const x = 130 + (i % 5) * 145, y = 210 + Math.floor(i / 5) * 190, a = inA(lt, 0.05 * i, 0.3), on = i === 4;
          g.save(); g.globalAlpha *= a; personIcon(x, y, 1.6, on ? PRO.acc : PRO.dim); g.restore(); }
        rich('Only about *1 in 10* survives', w / 2, 590, 46, { alpha: inA(lt, 0.6) }); });
      if (t > gone) pill('USA · American Heart Association', 540, 1290, t, gone + 0.4); }; }; });

VIS[1] = S(() => { const cp = sw('cpr', 0.5), dbl = sw('double', 1.4), tr = sw('triple', 2.2);
  return (K) => { ks(K, [[dbl, 'pop', 0.6, 600], [tr, 'ding', 0.7]]);
    return (t) => { proBg(t);
      card(t, 0.0, 120, 520, 840, 760, (lt, w, h) => { kicker('Chance of survival', 40, 62); rich(t > cp ? 'With *CPR* right away' : 'Without help', 40, 130, 44, { align: 'left' });
        [['No CPR', 1, 0.15], ['CPR', 2, dbl], ['CPR', 3, tr]].forEach(([lab, v, at], k) => { const p = eO((t - at) / 0.5); if (p <= 0) return;
          const bx = 110 + k * 240, bh = 130 * v * p, base = h - 120, col = k === 2 ? PRO.acc : k === 1 ? 'rgba(56,224,123,0.55)' : PRO.dim;
          rrect(bx, base - bh, 150, bh, 18); g.fillStyle = col; g.fill(); ptext(`×${v}`, bx + 75, base - bh - 24, 56, k ? PRO.txt : PRO.mute, { align: 'center', w: 800 });
          ptext(lab, bx + 75, base + 50, 28, PRO.mute, { align: 'center' }); }); });
      pill('Source: American Heart Association', 540, 1330, t, cp + 0.3); }; }; });

VIS[2] = S(() => { const ca = sw('call', 0.7), mi = sw('middle', 3.2);
  return (K) => { ks(K, [[ca, 'beep', 0.5], [ca + 0.25, 'beep', 0.5], [mi, 'pop', 0.6, 500]]);
    return (t) => { proBg(t); const ph = mi + 1.3;
      card(t, 0.0, 300, 470, 480, 820, (lt, w, h) => { g.fillStyle = '#0A171D'; g.fillRect(0, 0, w, h); kicker('Emergency call', w / 2, 120, PRO.mute, { align: 'center' });
        ptext('112 · 911', w / 2, 300, 84, PRO.txt, { align: 'center', w: 800 }); ptext(t > ca ? 'Calling…' : 'Ready', w / 2, 370, 34, PRO.mute, { align: 'center' });
        const p = 0.5 + 0.5 * Math.sin(lt * 5); g.fillStyle = `rgba(56,224,123,${0.15 + 0.15 * p})`; g.beginPath(); g.arc(w / 2, 640, 80 + 14 * p, 0, 6.283); g.fill();
        g.fillStyle = PRO.acc; g.beginPath(); g.arc(w / 2, 640, 66, 0, 6.283); g.fill(); ptext('✆', w / 2, 664, 64, PRO.bg0, { align: 'center' }); }, { r: 60, out: mi - 0.1 });
      card(t, mi, 120, 500, 840, 780, (lt, w, h) => { kicker('Where to push', 40, 62);
        g.fillStyle = PRO.dim; g.beginPath(); g.arc(w / 2, 210, 70, 0, 6.283); g.fill(); rrect(w / 2 - 230, 300, 460, 430, 120); g.fill();
        g.strokeStyle = 'rgba(170,230,240,0.25)'; g.lineWidth = 4; g.setLineDash([10, 12]); g.beginPath(); g.moveTo(w / 2, 320); g.lineTo(w / 2, 600); g.stroke(); g.setLineDash([]);
        marker(w / 2, 470, 58, lt, 0.2); }, { out: ph - 0.05 });
      photoCard(t, ph, 'cpr', 120, 500, 840, 780, { label: 'Real photo · CPR training', focus: [0.5, 0.45] }); }; }; });

VIS[3] = S(() => { const ha = sw('hard', 0.4), fi = sw('five', 1.2), fa = sw('fast', 2.2), hu = sw('hundred', 2.6);
  return (K) => { ks(K, [[fi, 'pop', 0.5, 500]]); beats(K, fa, fa + 4, 110, 0.3);
    return (t) => { proBg(t); const ph = t > fa ? (t * 110 / 60) % 1 : (t * 0.8) % 1, p = ph < 0.5 ? eO(ph * 2) : 1 - eO((ph - 0.5) * 2);
      card(t, 0.0, 120, 470, 840, 470, (lt, w) => { kicker('Push hard', 40, 62); const cy = 300 + p * 40;
        rrect(110, 330, 520, 70, 35); g.fillStyle = PRO.dim; g.fill();                       // chest
        rrect(300, cy - 150, 150, 120, 30); g.fillStyle = PRO.card2; g.fill(); g.lineWidth = 3; g.strokeStyle = PRO.acc; g.stroke(); // hands
        g.fillStyle = PRO.acc; g.fillRect(360, cy - 330, 30, 180);
        if (t > fi) { g.strokeStyle = PRO.hi; g.lineWidth = 5; g.beginPath(); g.moveTo(690, 300); g.lineTo(690, 360); g.moveTo(670, 300); g.lineTo(710, 300); g.moveTo(670, 360); g.lineTo(710, 360); g.stroke();
          ptext('≈ 5 cm', 730, 344, 46, PRO.hi, { w: 800, alpha: inA(t, fi) }); } });
      card(t, hu - 0.05, 120, 980, 840, 300, (lt, w) => { kicker('And fast', 40, 62); ptext('100–120', 40, 200, 110, PRO.txt, { w: 800 }); ptext('per minute', 40, 250, 30, PRO.mute);
        for (let i = 0; i < 8; i++) { const on = Math.floor(t * 110 / 60) % 8 === i; g.fillStyle = on ? PRO.acc : PRO.dim; g.beginPath(); g.arc(560 + (i % 4) * 62, 120 + Math.floor(i / 4) * 70, 20, 0, 6.283); g.fill(); } }); }; }; });

VIS[4] = S(() => { const st = sw('stayin', 0.6), bg = sw('bee', 1.4), hu = sw('hundred', 2.6);
  return (K) => { beats(K, st, st + 4.5, BPM, 0.3); ks(K, [[hu, 'ding', 0.6]]);
    return (t) => { proBg(t);
      card(t, 0.0, 150, 440, 780, 760, (lt, w, h) => { const im = PHOTOS.beegees;
        g.save(); rrect(40, 40, w - 80, 440, 24); g.clip(); if (im) { const sc = Math.max((w - 80) / im.width, 440 / im.height) * 1.08; g.drawImage(im, w / 2 - im.width * sc / 2, 260 - im.height * sc * 0.42, im.width * sc, im.height * sc); }
        else { g.fillStyle = PRO.dim; g.fillRect(40, 40, w - 80, 440); } g.restore();
        pill('Real photo · Bee Gees, 1977', 60, 82, lt, 0.3, { size: 20, bg: 'rgba(6,16,21,0.75)', color: PRO.txt, align: 'left' });
        ptext("Stayin' Alive", 40, 560, 54, PRO.txt, { w: 800 }); ptext('Bee Gees · 1977', 40, 606, 30, PRO.mute);
        pbar(40, 650, w - 80, 0.18 + lt * 0.03, PRO.acc); ptext('0:4' + Math.min(9, Math.floor(lt)), 40, 700, 22, PRO.mute); ptext('4:45', w - 40, 700, 22, PRO.mute, { align: 'right' });
        for (let i = 0; i < 18; i++) { const b = bt(lt + i * 0.03, BPM), hh = 14 + 46 * b * (0.4 + 0.6 * Math.abs(Math.sin(i * 1.7))); rrect(w - 40 - 18 * 22 + i * 22, 560 - hh, 12, hh, 6); g.fillStyle = PRO.acc; g.fill(); } });
      card(t, hu - 0.05, 150, 1240, 780, 150, (lt, w) => { const x0 = 40, x1 = w - 40, X = (v) => lerp(x0, x1, (v - 90) / 40);
        kicker('Target 100–120 / min', 40, 44); rrect(x0, 82, x1 - x0, 16, 8); g.fillStyle = PRO.dim; g.fill(); rrect(X(100), 82, X(120) - X(100), 16, 8); g.fillStyle = 'rgba(56,224,123,0.6)'; g.fill();
        const mx = X(104); g.fillStyle = PRO.hi; g.beginPath(); g.arc(mx, 90, 15, 0, 6.283); g.fill(); ptext('104', mx, 136, 28, PRO.hi, { align: 'center', w: 800 }); }); }; }; });

VIS[5] = S(() => { const ke = sw('keep', 0.3), he = sw('help', 1.6), co = sw('course', 4.0);
  return (K) => { beats(K, ke, he + 1.5, 110, 0.22); ks(K, [[co, 'ding', 0.6]]);
    return (t) => { proBg(t); CAPY = null;
      card(t, 0.0, 120, 560, 840, 330, (lt, w) => { kicker('Until help arrives', 40, 62); rich("*Don't stop* pushing", 40, 150, 56, { align: 'left' });
        const p = clamp(lt / 6); pbar(40, 210, w - 80, p, PRO.acc); const d = 0.5 + 0.5 * Math.sin(lt * 6); g.fillStyle = PRO.acc; g.globalAlpha *= 0.5 + 0.5 * d; g.beginPath(); g.arc(40 + (w - 80) * p, 215, 13, 0, 6.283); g.fill(); g.globalAlpha = 1;
        ptext('Ambulance on the way', 40, 285, 28, PRO.mute); }, { out: co - 0.05 });
      card(t, co, 120, 470, 840, 640, (lt, w) => { kicker('Remember', 40, 62);
        ['Call 112 / 911', 'Middle of the chest', 'Push hard, ≈ 5 cm', '100–120 per minute', "Don't stop"].forEach((s, i) => { const a = inA(lt, 0.12 * i + 0.1, 0.3); if (a <= 0) return;
          g.save(); g.globalAlpha *= a; checkIcon(64, 140 + i * 100, 1.05); ptext(s, 110, 154 + i * 100, 40, PRO.txt); g.restore(); }); });
      if (t > co) ptext('Not medical advice · learn CPR in a certified first-aid course', 540, 1160, 24, PRO.mute, { align: 'center', alpha: inA(t, co + 0.6) }); }; }; });
