// Wiki Roulette #040 — Stanislav Petrov (26 Sept 1983)
function crt(t, x, y, w, h, fn) { g.save(); rrect(x - 20, y - 20, w + 40, h + 40, 30); g.fillStyle = '#2A2A26'; g.fill(); rrect(x, y, w, h, 20); g.fillStyle = '#0A140C'; g.fill(); g.clip();
  fn(); g.fillStyle = 'rgba(0,0,0,0.25)'; for (let yy = y; yy < y + h; yy += 6) g.fillRect(x, yy, w, 2); g.restore(); }
function mapUS(t, cx, cy, sc) { const cam = mapCam(-60, 52, 210, cy); darkMap(cam, { land: '#10200F', edge: '#2E5A2A', glow: 'rgba(80,255,120,0.08)' }); return cam; }
VIS.open = (K) => { K(0.3, 'beep', 0.8); K(0.7, 'beep', 0.8); K(1.1, 'beep', 0.8); K(1.7, 'thump', 0.8);
  return (t) => { atmosphere(t, { x: 540, y: 1050, r: 700, c: `rgba(255,59,48,${0.1 + 0.08 * (Math.floor(t * 3) % 2)})` });
    crt(t, 160, 840, 760, 440, () => { if (Math.floor(t * 3) % 2 === 0) text('LAUNCH', 540, 1100, 'disp', 140, RED, { align: 'center' }); text('ОКО · EARLY WARNING', 540, 900, 'mono', 26, '#5AE07A', { align: 'center', ls: 3 }); });
    hookPhoto(t, 'lead', { y: 800, h: 480, focus: [0.5, 0.3] }); tag(t); hook(t, EP.hook, 500); }; };
VIS[0] = (K) => { K(0.5, 'pop', 0.7, 500); K(3.0, 'swish', 0.5);
  return (t) => { atmosphere(t); tag(t, 0, 4); popNum('SEPT 26, 1983', 80, 520, fit('SEPT 26, 1983', 'disp', 140, 920), TXT, t, 0.45); label('STANISLAV PETROV · DUTY OFFICER', 84, 580, t, 1.2, { color: GOLD });
    crt(t, 160, 720, 760, 480, () => { mapUS(t, 540, 960, 1); text('OKO SATELLITE SYSTEM', 540, 1170, 'mono', 24, '#5AE07A', { align: 'center', ls: 3, alpha: (t - 3) * 3 }); }); }; };
VIS[1] = (K) => { for (let i = 0; i < 5; i++) { K(0.5 + i * 0.6, 'beep', 1); K(0.5 + i * 0.6 + 0.2, 'beep', 0.8); } K(0.5, 'hit', 0.8);
  return (t) => { atmosphere(t, { x: 540, y: 960, r: 800, c: `rgba(255,59,48,${0.15 * (Math.floor(t * 4) % 2)})` }); tag(t, 1, 4);
    const n = Math.min(5, Math.floor(clamp((t - 0.5) / 2.6) * 5) + (t > 0.5 ? 1 : 0));
    crt(t, 160, 720, 760, 480, () => { const cam = mapUS(t, 540, 960, 1); for (let i = 0; i < n; i++) { const [x, y] = cam.P(-100 + i * 3, 45 - i); g.fillStyle = RED; g.beginPath(); g.arc(x, y, 10, 0, 6.283); g.fill(); }
      if (Math.floor(t * 4) % 2 === 0) text('LAUNCH', 540, 1150, 'disp', 80, RED, { align: 'center' }); });
    popNum(`MISSILES: ${n}`, 80, 560, fit('MISSILES: 5', 'disp', 140, 920), RED, t, 0.5); }; };
VIS[2] = (K) => { K(0.6, 'thump', 0.8); K(2.6, 'mute', 1, 0.8); K(2.7, 'pop', 1, 900);
  return (t) => { atmosphere(t); tag(t, 2, 4); popNum('PROTOCOL:', 80, 520, 140, TXT, t, 0.45); label('REPORT IT UP THE CHAIN', 84, 580, t, 0.9);
    const pick = t > 2.7; [['REPORT', 300, RED], ['FALSE ALARM', 780, '#5AE07A']].forEach(([lbl, x, c], i) => { const s = spring(t - 1.0 - i * 0.15, 260, 18); if (s <= 0) return;
      g.save(); g.translate(x, 900); g.scale(s * (pick && i === 1 ? 1.12 : 1), s * (pick && i === 1 ? 1.12 : 1)); g.globalAlpha *= pick && i === 0 ? 0.3 : 1;
      g.fillStyle = c; g.beginPath(); g.arc(0, 0, 150, 0, 6.283); g.fill(); g.fillStyle = 'rgba(0,0,0,0.25)'; g.beginPath(); g.arc(0, 12, 150, 0, Math.PI); g.fill();
      text(lbl, 0, 14, 'disp', lbl.length > 7 ? 33 : 54, BG, { align: 'center' }); g.restore(); });
    if (pick) chip('HIS CALL', 780, 1100, t, 2.8, { size: 34 }); }; };
VIS[3] = (K) => { K(0.6, 'land', 0.8); K(2.0, 'swish', 0.5); K(3.5, 'scratch'); K(3.52, 'thump', 1);
  return (t) => { atmosphere(t, { x: 820, y: 700, r: 700, c: 'rgba(255,220,140,0.15)' }); tag(t, 3, 4);
    popNum('HE WAS RIGHT.', 80, 520, fit('HE WAS RIGHT.', 'disp', 140, 920), '#5AE07A', t, 0.45);
    const r = rng(4); for (let i = 0; i < 6; i++) { const x = 160 + i * 150, y = 820 + r() * 60; g.fillStyle = 'rgba(230,236,245,0.85)'; g.beginPath(); g.ellipse(x, y, 110, 34, 0, 0, 6.283); g.fill(); }
    g.strokeStyle = 'rgba(255,220,140,0.6)'; g.lineWidth = 6; for (let i = 0; i < 5; i++) { g.beginPath(); g.moveTo(980, 600); g.lineTo(200 + i * 160, 820); g.stroke(); }
    label('SUNLIGHT ON CLOUDS · NOT MISSILES', 84, 600, t, 1.8, { size: 26 });
    stampText('REPRIMANDED', 540, 1060, t, 3.5, { size: 80, rot: -0.08 }); if (t > 4.1) label('(PAPERWORK)', 540, 1160, t, 4.1, { align: 'center' }); }; };
