// Wiki Roulette #036 — Vesna Vulović: survived a 10,160 m fall without a parachute
function sky(t, shift = 0) {
  const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, '#0A1A33'); gr.addColorStop(1, '#3E6A96'); g.fillStyle = gr; g.fillRect(0, 0, W, H);
  const r = rng(36); for (let i = 0; i < 16; i++) { const x = r() * W, y = ((r() * 2400 - shift) % 2400 + 2400) % 2400 - 240, s = 80 + r() * 160;
    g.fillStyle = `rgba(230,240,250,${0.10 + 0.12 * r()})`; for (let k = 0; k < 4; k++) { g.beginPath(); g.ellipse(x + k * s * 0.5, y + Math.sin(k) * 10, s * 0.6, s * 0.28, 0, 0, 6.283); g.fill(); } }
}
function jet(x, y, s, o = {}) {
  g.save(); g.translate(x, y); g.scale(s, s); g.rotate(o.rot || 0); g.fillStyle = '#E8EDF2';
  const half = o.split || 0;
  g.save(); g.translate(-half * 40, half * 20); g.rotate(-half * 0.3);
  g.beginPath(); g.moveTo(-220, -18); g.lineTo(0, -22); g.lineTo(0, 22); g.lineTo(-200, 18); g.lineTo(-240, -60); g.lineTo(-210, -60); g.closePath(); g.fill(); g.fillRect(-190, -38, 50, 16); g.restore();
  g.save(); g.translate(half * 40, -half * 10); g.rotate(half * 0.25);
  g.beginPath(); g.moveTo(0, -22); g.lineTo(200, -18); g.quadraticCurveTo(250, 0, 200, 20); g.lineTo(0, 22); g.closePath(); g.fill();
  g.fillStyle = '#C9D2DA'; g.beginPath(); g.moveTo(20, 10); g.lineTo(-40, 90); g.lineTo(-10, 90); g.lineTo(80, 10); g.fill();
  g.fillStyle = '#34495E'; for (let i = 0; i < 8; i++) g.fillRect(30 + i * 20, -8, 10, 8); g.restore();
  g.restore();
}
// ---- OPEN
VIS.open = (K) => { K(2.4, 'thump', 0.9);
  return (t) => { sky(t, t * 300); person(560 + Math.sin(t * 2) * 30, 1100, 3, TXT);
    hookPhoto(t, 'lead', { y: 800, h: 460, focus: [0.5, 0.3] }); tag(t); hook(t, EP.hook, 500);
    popNum('10,160 M', 80, 870, 90, GOLD, t, -1); }; };
// ---- 0: 1972, flight attendant, 22
VIS[0] = (K) => { K(0.5, 'pop', 0.7, 500); K(2.2, 'swish', 0.5);
  return (t) => { sky(t, t * 20); jet(lerp(-300, 700, clamp(t / 6)), 1020, 1.6, {}); tag(t, 0, 5);
    popNum('1972', 80, 520, 200, TXT, t, 0.45); rise('VESNA VULOVIĆ, 22', 84, 620, 'disp', fit('VESNA VULOVIĆ, 22', 'disp', 80, 920), GOLD, t, 1.2);
    chip('FLIGHT ATTENDANT', 80, 700, t, 3.0, { size: 30, align: 'left', bg: '#2B2A28', fg: TXT }); }; };
// ---- 1: a bomb — the plane breaks apart
VIS[1] = (K) => { K(1.0, 'mute', 1, 0.6); K(1.05, 'hit', 1.3); K(1.1, 'crack', 1);
  return (t) => { const b = 1.05, sp = clamp((t - b) / 1.5);
    g.save(); g.translate(shake(t, b, 26), 0); sky(t, t * 30);
    jet(540, 1000 + sp * 200, 1.8, { split: sp * 3, rot: sp * 0.4 });
    if (t > b) { const lt = t - b, gr = g.createRadialGradient(540, 1000, 0, 540, 1000, 300 * clamp(lt * 3)); gr.addColorStop(0, `rgba(255,200,80,${Math.exp(-lt * 2)})`); gr.addColorStop(1, 'rgba(255,120,40,0)'); g.fillStyle = gr; g.fillRect(0, 600, W, 800); }
    g.restore(); flash(t, b, 0.5, 0.15); tag(t, 1, 5);
    popNum('A BOMB', 80, 540, 180, RED, t, 1.0); label('IN THE BAGGAGE HOLD', 84, 600, t, 1.4); }; };
// ---- 2: she fell 10,160 m
VIS[2] = (K) => { K(0.5, 'whoosh', 1); for (let i = 0; i < 26; i++) K(0.5 + i * 0.1, 'tick', 0.4); K(3.2, 'thump', 1.2);
  return (t) => { const u = clamp((tq(t) - 0.5) / 2.7); sky(t, u * 4000); g.fillStyle = `rgba(20,40,20,${u * 0.6})`; g.fillRect(0, 1300 - u * 200, W, H);
    person(540 + Math.sin(t * 3) * 20, 1000, 3.2, TXT); tag(t, 2, 5);
    popNum(`${fmt(Math.round(10160 * (1 - u) / 10) * 10)} M`, 80, 560, fit('10,160 M', 'disp', 190, 920), u >= 1 ? GOLD : TXT, t, 0.4); label('ALTITUDE', 84, 620, t, 0.6);
    if (t > 3.2) chip('NO PARACHUTE', 540, 760, t, 3.2, { size: 36, bg: RED, fg: TXT }); }; };
// ---- 3: the injuries — the only survivor of 28
VIS[3] = (K) => { [0.6, 1.3, 2.0].forEach((a) => K(a, 'thump', 0.7)); for (let i = 0; i < 28; i++) K(3.2 + i * 0.03, 'tick', 0.25); K(4.3, 'hit', 0.9);
  return (t) => { atmosphere(t); tag(t, 3, 5);
    chip('FRACTURED SKULL', 80, 440, t, 0.6, { size: 28, align: 'left', bg: '#2B2A28', fg: TXT }); chip('BROKEN LEGS', 80, 520, t, 1.3, { size: 28, align: 'left', bg: '#2B2A28', fg: TXT }); chip('BROKEN VERTEBRAE', 80, 600, t, 2.0, { size: 28, align: 'left', bg: '#2B2A28', fg: TXT });
    for (let i = 0; i < 28; i++) { if (t < 3.2 + i * 0.03) continue; const x = 150 + (i % 7) * 130, y = 800 + Math.floor(i / 7) * 110, me = i === 13;
      person(x, y, 1.9, me && t > 4.3 ? GOLD : t > 4.3 ? 'rgba(255,255,255,0.12)' : '#8C857A'); }
    if (t > 4.3) popNum('1 OF 28', 1000, 560, 110, GOLD, t, 4.3, { align: 'right' }); }; };
// ---- 4: Guinness record
VIS[4] = (K) => { K(0.6, 'hit', 0.9); K(2.3, 'pop', 0.8, 800);
  return (t) => { atmosphere(t, { x: 540, y: 900, r: 800, c: 'rgba(255,194,61,0.12)' }); tag(t, 4, 5);
    const s = spring(t - 0.6, 220, 16); if (s > 0) { g.save(); g.translate(540, 880); g.scale(s, s); g.fillStyle = GOLD; g.beginPath(); for (let i = 0; i < 24; i++) { const a = i / 24 * 6.283, r = i % 2 ? 220 : 250; g.lineTo(Math.cos(a) * r, Math.sin(a) * r); } g.fill();
      g.fillStyle = BG; g.beginPath(); g.arc(0, 0, 190, 0, 6.283); g.fill(); text('WORLD', 0, -40, 'disp', 64, GOLD, { align: 'center' }); text('RECORD', 0, 40, 'disp', 64, GOLD, { align: 'center' }); text('10,160 M', 0, 110, 'mono', 30, TXT, { align: 'center', ls: 3 }); g.restore(); }
    popNum('GUINNESS', 80, 520, 150, TXT, t, 0.45); label('HIGHEST FALL SURVIVED WITHOUT A PARACHUTE', 84, 580, t, 2.3, { size: 22 }); }; };
