// Wiki Roulette #166 — DEEP SEA: yeti crab (Kiwa). Frame 1 = the real hairy specimen (Ifremer photo) + "it grows its food on its arms" →
// real black smoker with a depth gauge to 7,200 ft (found 2005) → close-up of the hairy claw: bacteria = its main food →
// real footage of K. puravida "dancing" to feed its bacteria (WHOI watermark cropped out) → the eyeless front: probably blind → binary question.
const N166 = 4, CR166 = 'Photo: Alexis Fifis (Ifremer) / CC BY 4.0';
const MOTES166 = (() => { const r = rng(166), s = []; for (let i = 0; i < 70; i++) s.push([r(), r(), 2 + r() * 4, r() * 6.283]); return s; })();

function deep166(t) { const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, '#06223A'); gr.addColorStop(1, '#020814'); g.fillStyle = gr; g.fillRect(0, 0, W, H); }
// glowing "bacteria" motes over a region of the hair (graphic emphasis on top of the real photo)
function motes166(t, tIn, x0, y0, w, h) { const a = clamp((t - tIn) / 0.5); if (a <= 0) return; g.save(); g.shadowColor = '#9CFFB0'; g.shadowBlur = 16;
  MOTES166.forEach(([u, v, r, ph]) => { g.globalAlpha = a * (0.45 + 0.4 * Math.sin(t * 3 + ph)); g.fillStyle = '#B8FFC8';
    g.beginPath(); g.arc(x0 + u * w + Math.sin(t * 1.3 + ph) * 6, y0 + v * h + Math.cos(t * 1.1 + ph) * 6, r, 0, 6.283); g.fill(); }); g.restore(); }

// ---------- scenes ----------
VIS.open = (K) => { const ar = sw('arms', 1.8); K(0.15, 'hit', 1.2); K(0.2, 'mute', 1, 0.4); K(ar, 'pop', 1);
  return (t) => { deep166(t); const P = shot(t, 'yeti2', { box: [20, 860, 1040, 683], a: [0.5, 0.5, 1.0], b: [0.5, 0.5, 1.08], dur: 3, credit: CR166 });
    tag(t); hook(t, EP.hook, 470); realBadge(t, 0.3, 'REAL PHOTO · YETI CRAB (KIWA HIRSUTA)', 1580);
    if (P && t > ar) { const [x1, y1] = P(0.55, 0.22), [x2, y2] = P(0.55, 0.8); ring(t, ar, x1, y1, 120, { color: GOLD, spot: false }); ring(t, ar + 0.1, x2, y2, 120, { color: GOLD, spot: false }); } }; };

VIS[0] = S(() => { const fo = sw('Found', 1.0), fe = sw('feet', 2.6), ve = sw('vents', 3.6);
  return vscene(0, N166, { ph: 'smoker', a: [0.5, 0.45, 1.0], b: [0.5, 0.5, 1.12], badge: 'REAL PHOTO · A HYDROTHERMAL VENT', k: [[fo, 'ding', 0.9], [fe, 'sonar', 0.9], [ve, 'boom', 0.8]],
    x: (t, P) => { const gx = 110, gy0 = 470, gy1 = 1360, d = clamp((t - fo) / Math.max(0.6, fe - fo + 0.2)), my = lerp(gy0, gy1, d);
      g.save(); g.strokeStyle = 'rgba(255,255,255,0.4)'; g.lineWidth = 4; g.beginPath(); g.moveTo(gx, gy0); g.lineTo(gx, gy1); g.stroke();
      for (let k = 0; k <= 4; k++) { const y = lerp(gy0, gy1, k / 4); g.beginPath(); g.moveTo(gx - 14, y); g.lineTo(gx + 14, y); g.stroke(); text(`${(k * 1800).toLocaleString('en-US')} ft`, gx + 26, y + 9, 'mono', 24, 'rgba(255,255,255,0.7)'); }
      g.fillStyle = GOLD; g.beginPath(); g.moveTo(gx - 34, my - 18); g.lineTo(gx - 6, my); g.lineTo(gx - 34, my + 18); g.fill(); g.restore();
      if (t > fo) chip('FOUND 2005', 640, 520, t, fo, { size: 54, bg: GOLD, fg: BG });
      if (t > fe) chip(`${Math.round(7200 * d).toLocaleString('en-US')} FT DOWN`, 640, 640, t, fe, { size: 48, bg: '#9ED8FF', fg: BG });
      if (t > ve) chip('🔥 HOT VENTS · SOUTH PACIFIC', 540, 1430, t, ve, { size: 38, bg: RED, fg: '#FFF' }); } }); });

VIS[1] = S(() => { const ba = sw('bacteria', 1.6), fo = sw('food', 3.4);
  return vscene(1, N166, { ph: 'yeti3', o: { credit: CR166 }, a: [0.62, 0.5, 1.0], b: [0.7, 0.5, 1.15], badge: 'REAL PHOTO · ITS HAIRY CLAW', k: [[0.6, 'swish', 0.8], [ba, 'bubble', 1], [fo, 'hit', 1]],
    x: (t, P) => { if (!P) return; const [x0, y0] = P(0.72, 0.0), [x1, y1] = P(1.0, 0.75); motes166(t, ba, x0, Math.max(330, y0), x1 - x0, Math.min(1450, y1) - Math.max(330, y0));
      if (t > ba) chip('🦠 BACTERIA ON THE HAIR', 540, 1300, t, ba, { size: 42, bg: '#9CFFB0', fg: BG });
      if (t > fo) chip('= ITS MAIN FOOD', 540, 1420, t, fo, { size: 50, bg: GOLD, fg: BG }); } }); });

VIS[2] = S(() => { const da = sw('dance', 1.2), ch = sw('chemicals', 3.2);
  return vscene(2, N166, { clip: 'dance', o: { box: [0, 330, 1080, 1150] }, a: [0.33, 0.35, 1.15], b: [0.33, 0.35, 1.22], foot: 'REAL FOOTAGE · YETI CRABS, COSTA RICA', k: [[da, 'pop', 1], [ch, 'swish', 0.9]],
    x: (t, P) => { if (t > da) chip('💃 THE DANCE', 540, 520, t, da, { size: 56, bg: GOLD, fg: BG });
      if (t > ch) chip('WAVING CLAWS = FEEDING THE FARM', 540, 1400, t, ch, { size: 36, bg: '#9CFFB0', fg: BG }); } }); });

VIS[3] = S(() => { const bl = sw('blind', 1.4);
  return vscene(3, N166, { ph: 'yeti2', o: { credit: CR166 }, a: [0.2, 0.5, 1.0], b: [0.14, 0.5, 1.18], badge: 'REAL PHOTO · KIWA HIRSUTA', k: [[bl, 'wrong', 1]],
    x: (t, P) => { if (!P) return; if (t > bl) { const [x, y] = P(0.1, 0.5); ring(t, bl, x, y, 150, { color: RED }); chip('EYES: NO PIGMENT · PROBABLY BLIND', 540, 560, t, bl + 0.1, { size: 34, bg: RED, fg: '#FFF' }); } } }); });
