// Wiki Roulette #046 — Tanganyika laughter epidemic (1962)
function haBurst(t, x, y, t0, s = 1, col = GOLD) { const lt = t - t0; if (lt < 0 || lt > 1.2) return; g.save(); g.globalAlpha = clamp(1 - (lt - 0.8) / 0.4); text('HA', x + Math.sin(lt * 9) * 8, y - lt * 70, 'disp', 40 * s, col, { align: 'center' }); g.restore(); }
function school(x, y, s, closed = 0) { g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = '#D9CFB8'; g.fillRect(-90, -80, 180, 80); g.fillStyle = '#8A3A2A'; g.beginPath(); g.moveTo(-105, -80); g.lineTo(0, -140); g.lineTo(105, -80); g.fill();
  g.fillStyle = '#5A4A3A'; g.fillRect(-15, -50, 30, 50); if (closed > 0) { g.strokeStyle = RED; g.lineWidth = 12; g.globalAlpha = closed; g.beginPath(); g.moveTo(-80, -120); g.lineTo(80, 0); g.moveTo(80, -120); g.lineTo(-80, 0); g.stroke(); } g.restore(); }
VIS.open = (K) => { for (let i = 0; i < 10; i++) K(0.3 + i * 0.35, 'pop', 0.5, 700 + (i % 3) * 120);
  return (t) => { atmosphere(t, { x: 540, y: 1050, r: 800, c: 'rgba(255,194,61,0.10)' }); const r = rng(46);
    for (let i = 0; i < 40; i++) haBurst(t, 100 + r() * 880, 900 + r() * 450, (r() * 4) % 4 - 0.4, 0.8 + r() * 0.8, i % 3 ? GOLD : TXT);
    iconGrid(14, 7, 140, 1180, 135, 160, (x, y, i) => school(x, y, 0.55, clamp((t - 2.5 - i * 0.08) / 0.2)));
    hookPhoto(t, 'lead', { y: 800, h: 480 }); tag(t); hook(t, EP.hook, 500); }; };
VIS[0] = (K) => { K(1.0, 'land', 0.6); K(2.8, 'pop', 0.8, 700);
  return (t) => { atmosphere(t); const cam = camLerp(t, 0.2, 28, 11, [30, -5, 40], [31.8, -1.6, 9], 950); darkMap(cam); const [x, y] = cam.P(31.81, -1.33); pinAt(x, y, t, 1.0, 'KASHASHA', { size: 56 });
    tag(t, 0, 4); popNum('JANUARY 1962', 80, 520, fit('JANUARY 1962', 'disp', 140, 920), TXT, t, 0.45); label("A GIRLS' BOARDING SCHOOL · TANGANYIKA", 84, 580, t, 1.2, { size: 24, color: GOLD }); }; };
VIS[1] = (K) => { for (let i = 0; i < 20; i++) K(0.8 + i * 0.12, 'pop', 0.35, 700 + (i % 4) * 100); K(3.4, 'thump', 0.8);
  return (t) => { atmosphere(t); tag(t, 1, 4); const k = Math.floor(countTo(t, 0.8, 2.4, 95, 0.8));
    iconGrid(159, 16, 110, 720, 56, 60, (x, y, i) => { const on = ((i * 37) % 159) < k; person(x, y, 1.05, on ? GOLD : '#4A453E'); if (on && (i % 7 === 0)) haBurst(t, x, y - 40, 0.8 + (i % 11) * 0.2, 0.6); });
    popNum(`${k} OF 159`, 80, 560, fit('95 OF 159', 'disp', 170, 920), k >= 95 ? GOLD : TXT, t, 0.45); }; };
VIS[2] = (K) => { K(0.6, 'whoosh', 0.7); for (let i = 0; i < 14; i++) K(2.4 + i * 0.12, 'thump', 0.4);
  return (t) => { atmosphere(t); tag(t, 2, 4); const cam = mapCam(31.8, -1.6, 9, 950); darkMap(cam); const [x, y] = cam.P(31.81, -1.33);
    for (let r = 0; r < 3; r++) { const p = clamp((t - 0.4) * 0.5 - r * 0.15); if (p <= 0) continue; g.strokeStyle = GOLD; g.globalAlpha = (1 - p) * 0.7; g.lineWidth = 6; g.beginPath(); g.arc(x, y, 40 + p * 500, 0, 6.283); g.stroke(); } g.globalAlpha = 1;
    popNum(`~${fmt(countTo(t, 0.6, 1.6, 1000, 0.7))}`, 80, 540, 150, TXT, t, 0.45); label('PEOPLE AFFECTED', 84, 600, t, 0.9);
    iconGrid(14, 7, 140, 1180, 135, 150, (sx, sy, i) => { if (t > 2.3 + i * 0.12) school(sx, sy, 0.5, clamp((t - 2.4 - i * 0.12) / 0.2)); }); }; };
VIS[3] = (K) => { for (let i = 0; i < 18; i++) K(0.5 + i * 0.1, 'tick', 0.4); K(2.6, 'land', 0.8);
  return (t) => { atmosphere(t); tag(t, 3, 4); popNum(`${Math.round(countTo(t, 0.5, 1.8, 18, 0.8))} MONTHS`, 80, 600, fit('18 MONTHS', 'disp', 180, 920), TXT, t, 0.45);
    doc(540, 960, 820, 300, -0.02, t, 2.4, () => { text('DIAGNOSIS', 0, -80, 'mono', 26, '#7A7266', { align: 'center', ls: 6 }); text('Mass psychogenic', 0, 0, 'serif', 56, PINK, { align: 'center' }); text('illness', 0, 70, 'serif', 56, PINK, { align: 'center' }); }); }; };
