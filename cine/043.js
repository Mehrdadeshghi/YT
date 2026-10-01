// Wiki Roulette #043 — Operation Mincemeat (1943)
const SICILY = [14.0, 37.5], GREECE = [22.0, 39.0], SARD = [9.0, 40.0], HUELVA = [-6.95, 37.26];
function arrowOn(cam, a, b, p, col, w = 10) { const [x0, y0] = cam.P(a[0], a[1]), [x1, y1] = cam.P(b[0], b[1]); const x = lerp(x0, x1, p), y = lerp(y0, y1, p);
  g.strokeStyle = col; g.lineWidth = w; g.lineCap = 'round'; g.beginPath(); g.moveTo(x0, y0); g.lineTo(x, y); g.stroke(); if (p > 0.05) { const an = Math.atan2(y1 - y0, x1 - x0); g.fillStyle = col; g.beginPath(); g.moveTo(x + Math.cos(an) * 26, y + Math.sin(an) * 26); g.lineTo(x + Math.cos(an + 2.4) * 30, y + Math.sin(an + 2.4) * 30); g.lineTo(x + Math.cos(an - 2.4) * 30, y + Math.sin(an - 2.4) * 30); g.fill(); } }
function idCard(t, tIn) { doc(540, 900, 820, 480, -0.03, t, tIn, () => { text('NAVAL IDENTITY CARD', 0, -180, 'mono', 26, '#7A7266', { align: 'center', ls: 4 });
  g.fillStyle = '#B9B0A0'; g.fillRect(-370, -130, 220, 260); person(-260, 110, 7, '#6A6258'); text('Major', -110, -60, 'serif', 40, PINK); text('William Martin', -110, 0, 'serif', 52, PINK); text('ROYAL MARINES', -110, 60, 'mono', 26, '#7A7266', { ls: 3 }); }); }
VIS.open = (K) => { K(0.4, 'thump', 0.8); K(2.0, 'pop', 0.7, 400);
  return (t) => { atmosphere(t, { x: 540, y: 1050, r: 700, c: 'rgba(67,198,217,0.08)' });
    g.save(); g.translate(540, 1080); g.fillStyle = '#4A3A28'; rrect(-260, -120, 520, 240, 20); g.fill(); g.fillStyle = '#6A5236'; g.fillRect(-60, -160, 120, 50); g.strokeStyle = '#9A9A9A'; g.lineWidth = 8; g.beginPath(); g.moveTo(260, 0); for (let i = 0; i < 8; i++) g.lineTo(300 + i * 30, (i % 2) * 20); g.stroke(); g.restore();
    stampText('TOP SECRET', 540, 1090, t, -0.2, { size: 60, rot: -0.1 }); hookPhoto(t, 'lead', { y: 800, h: 480 }); tag(t); hook(t, EP.hook, 500); }; };
VIS[0] = (K) => { K(0.6, 'swish', 0.6); for (let i = 0; i < 6; i++) K(3.6 + i * 0.12, 'type', 0.5); K(4.6, 'scratch'); K(4.62, 'thump', 1);
  return (t) => { atmosphere(t); tag(t, 0, 4); popNum('1943', 80, 520, 200, TXT, t, 0.45); label('BRITISH INTELLIGENCE', 84, 580, t, 0.8, { color: TEAL }); idCard(t, 0.9);
    stampText('FAKE', 820, 1100, t, 4.6, { size: 70, rot: -0.15 }); }; };
VIS[1] = (K) => { K(0.6, 'whoosh', 0.6); K(1.5, 'whoosh', 0.6); K(3.0, 'scratch'); K(3.02, 'thump', 1);
  return (t) => { atmosphere(t); const cam = mapCam(14, 39, 34, 950); darkMap(cam, { glow: 'rgba(67,198,217,0.1)' }); tag(t, 1, 4);
    const origin = [3, 33]; arrowOn(cam, origin, GREECE, ease((t - 0.6) / 0.8), GOLD); arrowOn(cam, origin, SARD, ease((t - 1.4) / 0.8), GOLD);
    const [sx, sy] = cam.P(...SICILY); if (t > 3.0) { g.strokeStyle = RED; g.lineWidth = 10; g.beginPath(); g.moveTo(sx - 50, sy - 50); g.lineTo(sx + 50, sy + 50); g.moveTo(sx + 50, sy - 50); g.lineTo(sx - 50, sy + 50); g.stroke(); }
    popNum('THE "PLAN"', 80, 520, 150, TXT, t, 0.45); if (t > 3.0) chip('NOT SICILY', 80, 620, t, 3.0, { size: 34, align: 'left', bg: RED, fg: TXT }); }; };
VIS[2] = (K) => { K(0.6, 'bubble', 0.8); K(1.8, 'splash', 0.7); K(3.6, 'land', 0.9);
  return (t) => { atmosphere(t); const cam = camLerp(t, 0.2, 30, 11, [5, 38, 30], [-7, 37, 8], 950); darkMap(cam, { glow: 'rgba(67,198,217,0.1)' });
    const [hx, hy] = cam.P(...HUELVA); pinAt(hx, hy, t, 1.2, 'HUELVA, SPAIN', { size: 52, color: TEAL, left: true }); tag(t, 2, 4);
    const subx = lerp(hx - 400, hx - 120, ease((t - 0.3) / 1.4)); g.fillStyle = '#5A6A7A'; g.beginPath(); g.ellipse(subx, hy + 120, 110, 22, 0, 0, 6.283); g.fill(); g.fillRect(subx - 20, hy + 84, 40, 26);
    popNum('HMS SERAPH', 80, 520, 130, TXT, t, 0.45); if (t > 3.6) chip('THE GERMANS BELIEVED IT', 80, 620, t, 3.6, { size: 32, align: 'left' }); }; };
VIS[3] = (K) => { K(0.6, 'whoosh', 0.8); K(2.6, 'hit', 1); K(2.7, 'whoosh', 1);
  return (t) => { atmosphere(t); const cam = mapCam(14, 39, 34, 950); darkMap(cam, { glow: 'rgba(67,198,217,0.1)' }); tag(t, 3, 4);
    arrowOn(cam, [14, 47], GREECE, ease((t - 0.5) / 1.0), '#8C857A', 8); arrowOn(cam, [10, 31], SICILY, ease((t - 2.6) / 0.6), RED, 16);
    popNum('HITLER → GREECE', 80, 520, fit('HITLER → GREECE', 'disp', 120, 920), DIM, t, 0.45); if (t > 2.6) popNum('JULY 9: SICILY', 80, 650, fit('JULY 9: SICILY', 'disp', 120, 920), RED, t, 2.6); }; };
