// Wiki Roulette #037 — Anglo-Zanzibar War (27 Aug 1896): ~38 minutes
const ZAN = [39.19, -6.16];
function gunboat(x, y, s, t, fire = -1) { g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = '#6A7480'; g.beginPath(); g.moveTo(-160, 0); g.lineTo(170, 0); g.lineTo(140, 36); g.lineTo(-140, 36); g.closePath(); g.fill();
  g.fillRect(-60, -40, 110, 40); g.fillRect(-20, -90, 26, 50); g.fillRect(60, -14, 90, 10);
  if (fire >= 0 && t > fire) { const lt = (t - fire) % 0.6; if (lt < 0.2) { g.fillStyle = `rgba(255,200,90,${1 - lt * 5})`; g.beginPath(); g.arc(160, -10, 30 * (1 - lt * 3), 0, 6.283); g.fill(); } } g.restore(); }
function palace(x, y, s, burn = 0, t = 0) { g.save(); g.translate(x, y); g.scale(s, s); g.fillStyle = '#D9CFB8'; g.fillRect(-160, -200, 320, 200); g.fillRect(-60, -260, 120, 60);
  g.fillStyle = '#6A5A44'; for (let r = 0; r < 3; r++) for (let c = 0; c < 6; c++) g.fillRect(-140 + c * 50, -180 + r * 60, 26, 36);
  if (burn > 0) { for (let i = 0; i < 12; i++) { const fx = -150 + i * 27, fh = (60 + 40 * Math.sin(t * 9 + i)) * burn; const gr = g.createLinearGradient(0, -200 - fh, 0, -120); gr.addColorStop(0, 'rgba(255,90,40,0)'); gr.addColorStop(1, 'rgba(255,150,50,0.85)'); g.fillStyle = gr; g.beginPath(); g.ellipse(fx, -200, 18, fh, 0, 0, 6.283); g.fill(); }
    g.fillStyle = `rgba(40,30,25,${0.5 * burn})`; for (let i = 0; i < 5; i++) { g.beginPath(); g.arc(-80 + i * 40 + Math.sin(t + i) * 20, -300 - (t * 60 + i * 50) % 300, 40 + i * 6, 0, 6.283); g.fill(); } }
  g.restore(); }
VIS.open = (K) => { for (let i = 0; i < 12; i++) K(0.2 + i * 0.25, 'tick', 0.5); K(3.1, 'hit', 0.8);
  return (t) => { atmosphere(t, { x: 540, y: 1050, r: 800, c: 'rgba(255,90,40,0.12)' });
    const m = Math.min(38, countTo(t, 0.1, 3.0, 38, 1)); clockFace(540, 1070, 230, 9, m, { arcFrom: 0 });
    popNum(`${Math.floor(m)} MIN`, 540, 1400, 80, m >= 38 ? RED : TXT, t, -1, { align: 'center' });
    hookPhoto(t, 'lead', { y: 800, h: 460 }); tag(t); hook(t, EP.hook, 500); }; };
VIS[0] = (K) => { K(1.2, 'land', 0.6); K(3.4, 'swish', 0.6); K(5.2, 'scratch'); K(5.22, 'thump', 1);
  return (t) => { atmosphere(t); const cam = camLerp(t, 0.2, 28, 11, [30, 0, 45], [39.3, -6.1, 5], 900); darkMap(cam);
    const [x, y] = cam.P(...ZAN); pinAt(x, y, t, 1.2, 'ZANZIBAR', { size: 64 }); tag(t, 0, 4);
    popNum('AUGUST 1896', 80, 520, fit('AUGUST 1896', 'disp', 140, 920), TXT, t, 0.45);
    doc(540, 1000, 700, 300, -0.03, t, 3.4, () => { text('BRITISH ULTIMATUM', 0, -80, 'mono', 26, '#7A7266', { align: 'center', ls: 4 }); text('Leave the palace by', 0, 0, 'serif', 46, PINK, { align: 'center' }); text('09:00', 0, 90, 'disp', 90, RED, { align: 'center' }); });
    stampText('IGNORED', 760, 1120, t, 5.2, { size: 60, rot: -0.14 }); }; };
VIS[1] = (K) => { for (let i = 0; i < 10; i++) K(1.1 + i * 0.3, 'thump', 0.7); K(1.1, 'hit', 1); K(3.6, 'land', 0.8);
  return (t) => { const sky = g.createLinearGradient(0, 0, 0, 1050); sky.addColorStop(0, '#1A1410'); sky.addColorStop(1, '#6A4A30'); g.fillStyle = sky; g.fillRect(0, 0, W, H);
    g.save(); g.translate(shake(t, 1.1, 14), 0); palace(300, 1050, 1.0, clamp((t - 1.4) / 1.5), t); gunboat(820, 1060, 1.1, t, 1.1); g.restore(); waterOver(t, 1060);
    tag(t, 1, 4); const mm = t < 1.1 ? 0 : Math.min(40, countTo(t, 1.1, 2.5, 40, 1)); clockFace(880, 560, 120, 9, mm, { arcFrom: 0 });
    popNum(`09:${String(Math.floor(mm)).padStart(2, '0')}`, 80, 560, 170, mm >= 40 ? GOLD : TXT, t, 0.45);
    if (t > 3.6) chip('OVER.', 80, 660, t, 3.6, { size: 40, align: 'left', bg: RED, fg: TXT }); }; };
VIS[2] = (K) => { for (let i = 0; i < 12; i++) K(0.5 + i * 0.07, 'tick', 0.4); K(1.4, 'thump', 1); K(3.1, 'pop', 0.9, 900);
  return (t) => { atmosphere(t); tag(t, 2, 4);
    popNum(`~${Math.round(countTo(t, 0.5, 0.9, 500, 0.7))}`, 80, 620, 220, RED, t, 0.45); label('ZANZIBARI CASUALTIES', 90, 690, t, 1.0);
    popNum('1', 80, 960, 220, GOLD, t, 3.0); label('BRITISH SAILOR WOUNDED', 240, 900, t, 3.2);
    iconGrid(Math.floor(clamp((t - 0.5) / 0.9) * 50), 10, 560, 780, 44, 44, (x, y) => person(x, y, 0.8, 'rgba(255,59,48,0.7)')); }; };
VIS[3] = (K) => { K(0.5, 'swish', 0.6); K(1.9, 'scratch'); K(1.92, 'thump', 1.1);
  return (t) => { atmosphere(t); tag(t, 3, 4);
    doc(540, 840, 760, 520, 0.02, t, 0.45, () => { text('INVOICE', 0, -180, 'mono', 30, '#7A7266', { align: 'center', ls: 8 }); text('Shells fired & damages', 0, -90, 'serif', 46, PINK, { align: 'center' });
      g.fillStyle = '#CFC6B5'; g.fillRect(-300, -50, 600, 3); text('300,000', 0, 60, 'disp', 110, PINK, { align: 'center' }); text('RUPEES', 0, 120, 'mono', 32, '#7A7266', { align: 'center', ls: 6 }); });
    stampText('PAY UP', 760, 1030, t, 1.9, { size: 70, rot: -0.12 }); }; };
