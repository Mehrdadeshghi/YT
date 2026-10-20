// Wiki Roulette #159 — CURIOSITY: the June 1962 Alcatraz escape (experiment E6: curiosity done fairly, real public-domain FBI photos).
// Retention: frame 1 = the real dummy head + "these heads fooled the guards all night" → what they were made of (FBI photo, callouts) →
// six months of digging (the dug-out vent) → the raft into the freezing bay (Alcatraz, March 1962; raft drawn, labelled) →
// 7 a.m.: the head falls on the floor (photo drops) → three real mugshots, NEVER FOUND → binary question.
const N159 = 4, RED159 = '#FF3B30', ICE159 = '#9ED8FF';
const BOX159 = [40, 720, 1000, 750];
const ill159 = (x, y) => text('ILLUSTRATION', x, y, 'mono', 22, 'rgba(255,255,255,0.6)', { ls: 3, align: 'right' });

// the drawn raft: rubber pontoons + three small figures, bobbing (x, y = centre on screen)
function raft159(t, x, y, s = 1) {
  g.save(); g.translate(x, y + Math.sin(t * 2.2) * 5); g.rotate(Math.sin(t * 1.7) * 0.04); g.scale(s, s);
  g.fillStyle = 'rgba(0,0,0,0.35)'; g.beginPath(); g.ellipse(0, 26, 150, 18, 0, 0, 6.283); g.fill();
  g.fillStyle = '#3A3F44'; rrect(-140, -18, 280, 40, 20); g.fill(); g.strokeStyle = '#6B737B'; g.lineWidth = 3; g.stroke();
  for (const fx of [-70, 0, 70]) { g.fillStyle = '#20262B'; rrect(fx - 16, -62, 32, 46, 10); g.fill(); g.beginPath(); g.arc(fx, -74, 15, 0, 6.283); g.fill(); }
  g.strokeStyle = '#8B6B45'; g.lineWidth = 6; g.lineCap = 'round'; const a = Math.sin(t * 3) * 0.4;
  g.beginPath(); g.moveTo(-70, -40); g.lineTo(-70 - 70 * Math.cos(0.9 + a), -40 + 70 * Math.sin(0.9 + a)); g.stroke();
  g.beginPath(); g.moveTo(70, -40); g.lineTo(70 + 70 * Math.cos(0.9 - a), -40 + 70 * Math.sin(0.9 - a)); g.stroke();
  g.restore();
}

// ---------- scenes ----------
VIS.open = (K) => { K(0.15, 'hit', 1.3); K(0.2, 'mute', 1, 0.4); K(1.8, 'thump', 0.8);
  return (t) => { atmosphere(t); shot(t, 'head', { box: [90, 610, 900, 954], a: [0.5, 0.5, 1.0], b: [0.45, 0.5, 1.1], dur: 3 }); tag(t); hook(t, EP.hook, 440);
    realBadge(t, 0.2, 'REAL PHOTO · FBI · FOUND IN A CELL, 1962', 1610); }; };

VIS[0] = S(() => { const so = sw('soap', 2.2), tp = sw('toilet', 2.6), ha = sw('hair', 3.4);
  return (K) => { ks(K, [[0.1, 'whoosh', 0.8], [so, 'pop', 0.9], [tp, 'pop', 0.9], [ha, 'ding', 1.0]]);
    return (t) => { atmosphere(t); const P = shot(t, 'heads', { box: [40, 760, 1000, 580], a: [0.5, 0.5, 1.0], b: [0.45, 0.5, 1.12], dur: 4 });
      tag(t, 0, N159); fact2(t, 0.3, 'ALCATRAZ,', '1962.', null, { y: 430 }); realBadge(t, 0.3, 'REAL PHOTO · FBI · THE DUMMY HEADS', 1385);
      if (P) { if (t > so) callout(t, so, P(0.36, 0.5), 230, 1480, 'SOAP');
        if (t > tp) callout(t, tp, P(0.63, 0.55), 640, 1480, 'TOILET PAPER');
        if (t > ha) callout(t, ha, P(0.58, 0.28), 760, 700, 'REAL HAIR', { bg: ICE159 }); } }; }; });

VIS[1] = S(() => { const sx = sw('six', 0.8), sp = sw('spoons', 3.0), dr = sw('drill', 3.6);
  return (K) => { ks(K, [[0.1, 'whoosh', 0.8], [sx, 'hit', 1.0], [sp, 'coin', 0.8], [dr, 'crack', 0.8]]);
    return (t) => { atmosphere(t); const P = shot(t, 'vent', { box: BOX159, a: [0.5, 0.45, 1.0], b: [0.5, 0.45, 1.35], dur: 4.5 });
      tag(t, 1, N159); fact2(t, sx, '6 MONTHS', 'OF DIGGING.', null, { y: 430 }); realBadge(t, 0.3, 'REAL PHOTO · A DUG-OUT CELL VENT, ALCATRAZ', 1515);
      if (P) { const [x, y] = P(0.5, 0.43); if (t > sx) ring(t, sx, x, y, 150, { color: RED159 });
        if (t > sp) chip('WITH SPOONS', 540, 1270, t, sp, { size: 44, bg: GOLD, fg: BG });
        if (t > dr) chip('+ A DRILL FROM A VACUUM CLEANER', 540, 1180, t, dr, { size: 34, bg: RED159, fg: '#FFF' }); } }; }; });

VIS[2] = S(() => { const fr = sw('freezing', 1.2), ra = sw('raft', 2.4), ft = sw('fourteen', 3.0);
  return (K) => { ks(K, [[0.1, 'whoosh', 0.8], [fr, 'swish', 0.8], [ra, 'pop', 0.9], [ft, 'ding', 1.0]]);
    return (t) => { atmosphere(t); shot(t, 'isle', { box: [0, 640, 1080, 900], a: [0.53, 0.3, 1.0], b: [0.53, 0.3, 1.15], dur: 4, r: 0 });
      tag(t, 2, N159); fact2(t, 0.3, 'INTO THE', 'FREEZING BAY.', null, { y: 430, c2: ICE159 }); realBadge(t, 0.3, 'REAL PHOTO · ALCATRAZ, MARCH 1962', 600);
      if (t > ra) { const rx = lerp(260, 620, clamp((t - ra) / 3)); raft159(t, rx, 1330, 0.9); ill159(1050, 1530); }
      if (t > fr) chip('FREEZING WATER', 790, 1120, t, fr, { size: 36, bg: ICE159, fg: BG });
      if (t > ft) { const rx = lerp(260, 620, clamp((t - ra) / 3)); ruler(t, ft, rx - 126, 1395, 252, '', { size: 30 }); chip('6 × 14 FT RAFT', rx, 1460, t, ft + 0.2, { size: 32 }); } }; }; });

VIS[3] = S(() => { const sv = sw('seven', 0.8), fl = sw('floor', 2.6), bo = sw('bodies', 3.8);
  return (K) => { ks(K, [[0.1, 'whoosh', 0.8], [sv, 'ding', 0.9], [fl - 0.25, 'mute', 1, 0.3], [fl, 'boom', 1.1], [fl + 0.02, 'crack', 0.9], [bo + 0.5, 'stamp', 1.0], [bo, 'hit', 1.1]]);
    return (t) => { atmosphere(t); tag(t, 3, N159);
      if (t < bo) {   // the dummy head on the pillow → it falls
        const lt = Math.max(0, t - fl), dy = 900 * lt * lt, rot = 1.4 * lt;
        g.save(); g.translate(540, 1100 + dy); g.rotate(rot); g.translate(-540, -1100); g.globalAlpha = clamp(1 - lt / 0.9);
        shot(t, 'head', { box: [190, 760, 700, 700], a: [0.45, 0.5, 1.0], b: [0.45, 0.5, 1.08], dur: 3 }); g.restore();
        fact2(t, sv, '7:00 AM.', 'WAKE-UP CALL.', null, { y: 430 });
        if (t > fl) { flash(t, fl, 0.35, 0.12); stampText('IT WAS FAKE', 540, 1150, t, fl, { size: 96, rot: -0.07, color: RED159 }); }
        realBadge(t, 0.3, 'REAL PHOTO · FBI · THE DUMMY HEAD', 1500);
      } else {        // the three real mugshots
        [['morris', 'FRANK MORRIS'], ['john', 'JOHN ANGLIN'], ['clar', 'CLARENCE ANGLIN']].forEach(([id, nm], k) => {
          const x = 40 + k * 340, tk = bo + k * 0.12; if (t < tk) return; g.save(); g.globalAlpha = clamp((t - tk) / 0.25);
          shot(t, id, { box: [x, 760, 320, 440], a: [0.5, 0.35, 1.0], b: [0.5, 0.35, 1.06], dur: 3, credit: '', backdrop: false }); g.restore();
          text(nm, x + 160, 1250, 'mono', 24, TXT, { align: 'center', ls: 2 }); });
        fact2(t, bo, 'NO BODIES.', 'EVER.', null, { y: 430, c2: RED159 });
        stampText('NEVER FOUND', 540, 1160, t, bo + 0.5, { size: 90, rot: -0.07, color: RED159 });
        realBadge(t, bo, 'REAL PHOTOS · ALCATRAZ MUGSHOTS', 1330);
      } }; }; });
