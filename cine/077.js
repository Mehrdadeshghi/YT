// Wiki Roulette #077 — DEEP SEA: the giant oarfish, "the doomsday fish" (experiment E3: question hook vs #076's number hook).
// No free footage of a live oarfish exists → real photos only: U.S. Navy 1996 (PD), a beached one in Australia, a head in New Zealand;
// the self-amputation is a drawn, clearly labelled ILLUSTRATION.
// Retention: frame 1 = two dozen men holding one fish + the question → 23-ft ruler → washed up before Japan 2011 (photo shakes) →
// "no real link" stamp over the eye → the real weird part: it cuts off its own tail (pieces fall away, organs glow near the head) → binary question.
const N077 = 4, RED077 = '#FF3B30', ORG077 = '#FF9F45', DEEP077 = ['#06223A', '#020814'];
const BOX077 = [40, 720, 1000, 700];

// the Navy photo: camera glides along the fish from tail (left) to head (right)
function navy077(t, t0, a, b, dur) { return shot(t, 'navy', { box: BOX077, a, b, dur, t0 }); }

// ---------- illustration: a ribbon-shaped oarfish, tail to the left; s = 0 tail tip … 1 snout ----------
function deep077(t) { const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, DEEP077[0]); gr.addColorStop(1, DEEP077[1]); g.fillStyle = gr; g.fillRect(0, 0, W, H); }
const rib077 = (s, t) => [lerp(30, 940, s), 1030 + Math.sin(s * 13 - t * 3) * 70 * (1 - s * 0.8)];
const half077 = (s) => s > 0.95 ? 58 * Math.sqrt(clamp((1 - s) / 0.05)) : 12 + 46 * Math.sqrt(s / 0.95);
function ribbon077(t, s0, s1, o = {}) {
  const top = [], bot = []; for (let k = 0; k <= 60; k++) { const s = lerp(s0, s1, k / 60), [x, y] = rib077(s, t), h = half077(s); top.push([x, y - h]); bot.push([x, y + h]); }
  g.save(); g.globalAlpha = o.a ?? 1; g.translate(o.dx || 0, o.dy || 0); if (o.rot) { const [cx, cy] = rib077((s0 + s1) / 2, t); g.translate(cx, cy); g.rotate(o.rot); g.translate(-cx, -cy); }
  // red dorsal fin along the whole back
  g.fillStyle = 'rgba(220,60,50,0.85)'; g.beginPath(); top.forEach(([x, y], k) => k ? g.lineTo(x, y - 26 - 6 * Math.sin(k + t * 6)) : g.moveTo(x, y - 26)); top.slice().reverse().forEach(([x, y]) => g.lineTo(x, y)); g.closePath(); g.fill();
  // silver body with dark spots
  const gr = g.createLinearGradient(0, 960, 0, 1160); gr.addColorStop(0, '#E8F0F8'); gr.addColorStop(0.6, '#AFC2D6'); gr.addColorStop(1, '#6E8296');
  g.fillStyle = gr; g.beginPath(); top.forEach(([x, y], k) => k ? g.lineTo(x, y) : g.moveTo(x, y)); bot.slice().reverse().forEach(([x, y]) => g.lineTo(x, y)); g.closePath(); g.fill();
  g.fillStyle = 'rgba(40,50,70,0.55)'; for (let k = 2; k < 58; k += 3) { const s = lerp(s0, s1, k / 60); if (s > 0.9) continue; const [x, y] = rib77pt(s, t, (k % 2) ? -0.35 : 0.3); g.beginPath(); g.ellipse(x, y, 9, 5, 0, 0, 6.283); g.fill(); }
  if (o.cutL) { const [x, y] = rib077(s0, t), h = half077(s0); g.strokeStyle = RED077; g.lineWidth = 5; g.beginPath(); g.moveTo(x, y - h); g.lineTo(x, y + h); g.stroke(); }
  g.restore();
}
const rib77pt = (s, t, f) => { const [x, y] = rib077(s, t); return [x, y + f * half077(s)]; };
function head077(t, o = {}) {   // red crest, eye, small mouth at the snout
  const [x, y] = rib077(0.96, t); g.save(); g.globalAlpha = o.a ?? 1;
  g.strokeStyle = 'rgba(235,70,60,0.95)'; g.lineWidth = 6; g.lineCap = 'round'; for (let k = 0; k < 6; k++) { const bx = x - 40 + k * 12; g.beginPath(); g.moveTo(bx, y - 60); g.quadraticCurveTo(bx - 30, y - 150 - k * 8, bx - 70 - k * 6 + Math.sin(t * 3 + k) * 8, y - 190 - k * 10); g.stroke(); }
  g.fillStyle = '#FFF'; g.beginPath(); g.arc(x + 4, y - 8, 17, 0, 6.283); g.fill(); g.fillStyle = '#111'; g.beginPath(); g.arc(x + 7, y - 8, 9, 0, 6.283); g.fill();
  g.strokeStyle = '#333'; g.lineWidth = 4; g.beginPath(); g.moveTo(x + 40, y + 20); g.lineTo(x + 62, y + 14); g.stroke(); g.restore();
}

// ---------- scenes ----------
VIS.open = (K) => { K(0.15, 'hit', 1.3); K(0.2, 'mute', 1, 0.4); K(1.8, 'thump', 0.8);
  return (t) => { atmosphere(t); navy077(t, 0, [0.3, 0.5, 1.0], [0.42, 0.5, 1.0], 3.0); tag(t); hook(t, EP.hook, 440);
    realBadge(t, 0.2, 'REAL PHOTO · U.S. NAVY · SAN DIEGO 1996', 1455); }; };

VIS[0] = S(() => { const tw = sw('twenty', 2.6), lo = sw('longest', 1.0);
  return (K) => { ks(K, [[0.1, 'whoosh', 0.7], [lo, 'ding', 0.9], [tw - 0.3, 'mute', 1, 0.3], [tw, 'boom', 1.1], [tw + 0.02, 'hit', 1.2]]);
    return (t) => { atmosphere(t);
      if (t < tw) navy077(t, 0, [0.42, 0.5, 1.0], [0.8, 0.55, 1.0], 2.6);
      else { flash(t, tw, 0.3, 0.1); const P = framed(t, 'navy', 40, 860, 1000); if (P) { const [x0] = P(0.02, 0.86), [x1] = P(0.98, 0.86); ruler(t, tw, x0, 1300, x1 - x0, '23 FEET', { size: 46 }); } }
      tag(t, 0, N077); fact2(t, lo, 'LONGEST', 'BONY FISH', 'ON EARTH', { y: 430 });
      realBadge(t, 0.3, 'REAL PHOTO · U.S. NAVY · SAN DIEGO 1996', 1455); }; }; });

VIS[1] = S(() => { const jp = sw('japan', 2.0), eq = sw('earthquake', 3.0);
  return (K) => { ks(K, [[0.1, 'whoosh', 0.8], [jp, 'ding', 1], [eq, 'boom', 1.1], [eq + 0.05, 'crack', 0.8]]);
    return (t) => { atmosphere(t); const sx = shake(t, eq, 26, 0.7), sy = shake(t, eq + 0.05, 18, 0.7);
      g.save(); g.translate(sx, sy); const P = shot(t, 'beach', { box: BOX077, a: [0.4, 0.55, 1.15], b: [0.55, 0.4, 1.0], dur: 3.2 }); g.restore();
      tag(t, 1, N077); realBadge(t, 0.3, 'REAL PHOTO · WASHED UP IN AUSTRALIA', 1455);
      fact2(t, 0.3, 'RARELY SEEN', 'ALIVE.', null, { y: 430 });
      if (t > jp) chip('JAPAN · 2011: MANY WASHED UP', 540, 800, t, jp, { size: 40, bg: GOLD, fg: BG });
      if (t > eq) chip('… THEN THE EARTHQUAKE + TSUNAMI', 540, 1340, t, eq, { size: 36, bg: RED077, fg: '#FFF' }); }; }; });

VIS[2] = S(() => { const pr = sw('predict', 0.8), no = sw('no', 2.0), li = sw('link', 2.8);
  return (K) => { ks(K, [[0.1, 'whoosh', 0.8], [pr, 'swish', 0.7], [no - 0.3, 'mute', 1, 0.3], [no, 'wrong', 1.1], [li, 'hit', 1]]);
    return (t) => { atmosphere(t); const P = shot(t, 'head', { box: BOX077, a: [0.45, 0.5, 1.0], b: [0.42, 0.45, 1.35], dur: 3 });
      tag(t, 2, N077); realBadge(t, 0.3, 'REAL PHOTO · NEW ZEALAND', 1455);
      fact2(t, pr, 'PREDICTS', 'EARTHQUAKES?', null, { y: 430 });
      if (P && t > no) { const [x, y] = P(0.41, 0.44); ring(t, no, x, y, 120, { color: RED077 }); }
      if (t > li) stampText('NO REAL LINK', 540, 1300, t, li, { size: 96, rot: -0.07, color: RED077 }); }; }; });

VIS[3] = S(() => { const cu = sw('cuts', 1.4), ag = sw('again', 2.2, 1), og = sw('organs', 3.0), sv = sw('survives', 4.0);
  return (K) => { ks(K, [[0.1, 'whoosh', 0.8], [cu, 'crack', 1.1], [cu + 0.05, 'hit', 1], [ag, 'crack', 1.1], [og, 'ding', 1], [sv, 'pop', 0.8]]);
    return (t) => { deep077(t); const c1 = 0.2, c2 = 0.36, s0 = t > ag ? c2 : t > cu ? c1 : 0;
      const fall = (tc, a, b) => { if (t <= tc) return; const lt = t - tc; ribbon077(t, a, b, { dy: 240 * lt * lt + 40 * lt, dx: -30 * lt, rot: -0.25 * lt, a: clamp(1 - lt / 1.6) }); };
      fall(cu, 0, c1); fall(ag, c1, c2); if (t < cu) ribbon077(t, 0, 1); else ribbon077(t, s0, 1, { cutL: true }); head077(t);
      if (t > cu) { const [x, y] = rib077(c1, t); flash(t, cu, 0.25, 0.08); chip('SNAP', x, y - 150, t, cu, { size: 40, bg: RED077, fg: '#FFF' }); }
      if (t > ag) { const [x, y] = rib077(c2, t); chip('SNAP', x, y + 150, t, ag, { size: 40, bg: RED077, fg: '#FFF' }); }
      if (t > og) { const lt = t - og, [x, y] = rib077(0.84, t); g.save(); g.globalCompositeOperation = 'lighter'; g.globalAlpha = clamp(lt / 0.4) * (0.75 + 0.25 * Math.sin(lt * 6));
        const gr = g.createRadialGradient(x, y, 10, x, y, 150); gr.addColorStop(0, 'rgba(255,159,69,0.9)'); gr.addColorStop(1, 'rgba(255,159,69,0)'); g.fillStyle = gr; g.fillRect(x - 160, y - 160, 320, 320); g.restore();
        callout(t, og, [x, y], 700, 1330, 'ORGANS: NEAR THE HEAD', { bg: ORG077 }); }
      tag(t, 3, N077); fact2(t, 0.3, 'IT CUTS OFF', 'ITS OWN TAIL.', null, { y: 430, c2: RED077 });
      text('ILLUSTRATION', 1000, 680, 'mono', 22, 'rgba(255,255,255,0.55)', { ls: 3, align: 'right' }); }; }; });
