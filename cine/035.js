// Wiki Roulette #035 — Hiroo Onoda: fought on for 28 years after the war
const JG = ['#0B1A10', '#12281A', '#1B3A24', '#24502F'];
function jungle(t, o = {}) {
  const sky = g.createLinearGradient(0, 0, 0, H); sky.addColorStop(0, '#07100A'); sky.addColorStop(1, '#0F2014'); g.fillStyle = sky; g.fillRect(0, 0, W, H);
  JG.forEach((c, L) => { const r = rng(40 + L); g.fillStyle = c; for (let i = 0; i < 14; i++) { const x = r() * W, y = 700 + L * 160 + r() * 120, s = 90 + r() * 120, sw = Math.sin(t * 0.8 + i + L) * 6;
    g.save(); g.translate(x + sw, y); for (let k = 0; k < 6; k++) { g.rotate(1.047); g.beginPath(); g.ellipse(s * 0.5, 0, s * 0.55, s * 0.14, 0, 0, 6.283); g.fill(); } g.restore(); } });
}
function soldier(x, y, s, o = {}) {
  g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = o.col || '#5E6E50';
  g.beginPath(); g.arc(0, -150, 22, 0, 6.283); g.fill(); g.beginPath(); g.ellipse(0, -168, 30, 10, 0, 0, 6.283); g.fill();
  rrect(-26, -126, 52, 90, 12); g.fill(); rrect(-24, -40, 20, 90, 8); g.fill(); rrect(4, -40, 20, 90, 8); g.fill();
  g.save(); g.translate(20, -110); g.rotate(o.rifle ?? -0.35); g.fillStyle = '#2E2418'; g.fillRect(-6, -120, 12, 170); g.restore();
  g.restore();
}
// ---- OPEN
VIS.open = (K) => { K(2.6, 'thump', 0.8); for (let i = 0; i < 29; i++) K(2.7 + i * 0.07, 'tick', 0.35); K(4.8, 'land', 0.8);
  return (t) => { jungle(t); soldier(560, 1330, 2.2, {});
    hookPhoto(t, 'lead', { y: 800, h: 460, focus: [0.5, 0.3] }); tag(t); hook(t, EP.hook, 500);
    const y = Math.floor(countTo(t, 2.7, 2.0, 1974, 0.9, 1945)); if (t > 2.6) popNum(`→ ${y}`, 80, 790, 110, y >= 1974 ? RED : TXT, t, 2.6); }; };
// ---- 0: Lubang Island
VIS[0] = (K) => { K(1.2, 'land', 0.7);
  return (t) => { atmosphere(t); const cam = camLerp(t, 0.2, 28, 11, [122, 12, 22], [120.2, 13.7, 4], 900); darkMap(cam);
    const [x, y] = cam.P(120.1, 13.8); pinAt(x, y, t, 1.2, 'LUBANG', { size: 60 }); tag(t, 0, 5);
    popNum('HIROO ONODA', 80, 520, fit('HIROO ONODA', 'disp', 140, 920), TXT, t, 0.45); label('PHILIPPINES · IN THE JUNGLE', 84, 580, t, 1.4, { color: GOLD }); }; };
// ---- 1: leaflets — "propaganda"
VIS[1] = (K) => { K(0.6, 'swish', 0.6); K(3.2, 'scratch'); K(3.22, 'thump', 1);
  const LF = []; { const r = rng(35); for (let i = 0; i < 16; i++) LF.push({ x: r() * W, t0: 0.4 + r() * 1.2, sp: 200 + r() * 150, rot: r() * 6 }); }
  return (t) => { jungle(t); soldier(820, 1300, 1.8, {}); tag(t, 1, 5);
    for (const l of LF) { const lt = t - l.t0; if (lt < 0) continue; const y = -80 + lt * l.sp; if (y > 1250) continue;
      g.save(); g.translate(l.x + Math.sin(lt * 2 + l.rot) * 40, y); g.rotate(Math.sin(lt * 3 + l.rot) * 0.5); g.fillStyle = PAPER; g.fillRect(-50, -34, 100, 68); g.fillStyle = '#9C9384'; g.fillRect(-36, -18, 72, 6); g.fillRect(-36, -4, 60, 6); g.fillRect(-36, 10, 66, 6); g.restore(); }
    popNum('THE WAR IS OVER', 80, 520, fit('THE WAR IS OVER', 'disp', 120, 920), TXT, t, 0.6); label('SAID THE LEAFLETS', 84, 580, t, 1.0);
    stampText('PROPAGANDA?', 540, 820, t, 3.2, { size: 90, rot: -0.1 }); }; };
// ---- 2: 28 years, 6 months
VIS[2] = (K) => { for (let i = 0; i < 28; i++) K(0.5 + i * 0.07, 'tick', i % 5 ? 0.35 : 0.8); K(2.5, 'hit', 1);
  return (t) => { jungle(t); g.fillStyle = 'rgba(5,10,6,0.55)'; g.fillRect(0, 0, W, H); tag(t, 2, 5);
    const y = Math.floor(countTo(t, 0.5, 2.0, 28, 0.9)); popNum(`${y} YEARS`, 80, 620, fit('28 YEARS', 'disp', 200, 920), y >= 28 ? GOLD : TXT, t, 0.45);
    if (t > 2.5) { popNum('6 MONTHS', 80, 790, 130, TXT, t, 2.5); label('10,416 DAYS IN THE JUNGLE', 84, 850, t, 2.9); } }; };
// ---- 3: 1974 — found, still refuses
VIS[3] = (K) => { K(0.5, 'pop', 0.8, 600); K(2.2, 'swish', 0.6); K(4.9, 'scratch'); K(4.92, 'thump', 1.1);
  return (t) => { jungle(t); tag(t, 3, 5);
    soldier(760, 1300, 1.8, {}); const ax = lerp(-120, 360, ease((t - 1.8) / 1.6)); g.save(); g.translate(ax, 1300); g.scale(1.8, 1.8); person(0, -30, 4.2, '#5A6A7A'); g.restore();
    popNum('1974', 80, 520, 200, TXT, t, 0.45); label('FOUND BY NORIO SUZUKI, AN ADVENTURER', 84, 580, t, 2.2, { size: 26 });
    stampText('HE REFUSED', 540, 820, t, 4.9, { size: 100, rot: -0.08 }); }; };
// ---- 4: only his old commander could end it
VIS[4] = (K) => { K(0.6, 'whoosh', 0.6); K(2.2, 'type', 0.7); K(2.5, 'type', 0.7); K(3.8, 'thump', 1); K(4.3, 'land', 0.8);
  return (t) => { jungle(t); tag(t, 4, 5);
    const lay = clamp((t - 3.8) / 0.6); soldier(760, 1300, 1.8, { rifle: lerp(-0.35, -1.57, lay) });
    const s = spring(t - 1.6, 170, 20); if (s > 0 && t < 4.6) { g.save(); g.translate(0, (1 - s) * 300); paper(380, 880, 560, 300, -0.03);
      text('ORDER', 0, -80, 'mono', 26, '#7A7266', { align: 'center', ls: 6 }); typed('Relieved of duty.', -230, 10, 'serif', 50, PINK, t, 2.2, 0.8);
      text('— MAJ. Y. TANIGUCHI', -230, 90, 'mono', 22, '#7A7266', { ls: 2 }); g.restore(); }
    popNum('HIS OLD', 80, 520, 130, TXT, t, 0.45); popNum('COMMANDER', 80, 650, fit('COMMANDER', 'disp', 130, 920), GOLD, t, 0.6);
    if (t > 4.3) popNum('9 MARCH 1974', 540, 1080, 70, TXT, t, 4.3, { align: 'center' }); }; };
