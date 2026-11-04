// #221 world: the floating office islands. Hook (the fake call), June (the box and the claw), September (job board, masks, the assignment).
import { THREE, EV, scene, clamp, lerp, ss, up, eo, ei, bk, hash, pop, drop, sq, mat, add, rbox, cyl, sph, tor, grp, label, glow, Burst, coins, setI, setIs, pawn, Scr, bust, deskIsland, laptop, claw, canvasTex, pl1, pl2, set, CAM, ZONES, SHAKE, curve } from './core.js';
const K = (P, t, p, l) => CAM.push({ t, p: [P[0] + p[0], P[1] + p[1], P[2] + p[2]], l: [P[0] + l[0], P[1] + l[1], P[2] + l[2]] });
const lp = (l, P, x, y, z, c, i) => { l.position.set(P[0] + x, P[1] + y, P[2] + z); l.color.set(c); l.intensity = i; };

// ================================================================== HOOK
export function hook(P) {
  const g = grp(scene, ...P); deskIsland(g);
  const scr = new Scr(640, 420), lap = laptop(g, scr, { z: -.4 });
  const { six, steal, attack, june } = { six: EV.h_six, steal: EV.h_steal, attack: EV.h_attack, june: EV.j_june };
  // coins erupt out of the screen, land on the desk, some fall off the front
  const N = 720, im = coins(g, N, 'gold'), landed = new Float32Array(N);
  const spray = new Burst(g, 90, '#FFE9A8', .34, { speed: 7, grav: 5, life: .9, seed: 9, dy: .9 });
  const G = 17;
  const coin = (i) => { const ti = six + hash(i) * hash(i * 1.9) * 2.1, a = hash(i * 2.7) * 2 - 1, b = hash(i * 3.3);
    return { ti, x0: (a) * 1.2, y0: 1.1 + hash(i * 1.3) * 1.3, z0: -.9, vx: a * 3 + (hash(i * 7.1) - .5) * 2.4, vy: 2 + b * 6, vz: 1.5 + hash(i * 4.1) * 5.5, spin: 5 + hash(i * 5) * 14, s: .13 + hash(i * 6.1) * .1 }; };
  const C = Array.from({ length: N }, (_, i) => coin(i));
  const update = (t) => {
    const tt = t < steal ? 0 : up(t, steal, Math.max(.2, six - steal));   // 0..1 the face turns
    const x = scr.x; x.fillStyle = '#1F3F66'; x.fillRect(0, 0, 640, 420);
    const gr = x.createLinearGradient(0, 0, 0, 420); gr.addColorStop(0, '#2F6FA8'); gr.addColorStop(1, '#183455'); x.fillStyle = gr; x.fillRect(0, 0, 640, 420);
    // plant + shelf behind the interviewer (a friendly home office)
    x.fillStyle = '#D9A066'; x.fillRect(430, 110, 170, 12); x.fillStyle = '#E8C547'; x.fillRect(455, 70, 30, 40); x.fillStyle = '#EB6B4A'; x.fillRect(490, 80, 26, 30); x.fillStyle = '#4BB57C'; x.beginPath(); x.arc(70, 340, 60, 0, 7); x.fill();
    const nod = Math.sin(t * 7) * 4 * (1 - tt);
    bust(x, 320, 165 + nod, 105, '#EDF1F7', { blink: (t * 4 % 7) < .4 });
    if (tt > 0) { x.fillStyle = '#ff2a4d'; for (const d of [-1, 1]) { x.beginPath(); x.arc(320 + d * 25, 157 + nod, 7 + tt * 6, 0, 7); x.fill(); } }
    x.fillStyle = 'rgba(0,0,0,.55)'; x.fillRect(0, 360, 640, 60); x.fillStyle = '#ff4a4a'; x.beginPath(); x.arc(320, 390, 20, 0, 7); x.fill(); x.fillStyle = '#fff'; x.font = '24px "AB"'; x.textAlign = 'left'; x.fillText('JOB INTERVIEW', 22, 398);
    if (tt > 0) { for (let i = 0; i < 9; i++) { const y = Math.floor(hash(i + Math.floor(t * 30) * 13) * 400), h = 8 + hash(i * 2 + Math.floor(t * 30)) * 30, dx = (hash(i * 3 + Math.floor(t * 30)) - .5) * 200 * tt; x.drawImage(scr.c, 0, y, 640, h, dx, y, 640, h); } x.fillStyle = `rgba(255,20,80,${.28 * tt})`; x.fillRect(0, 0, 640, 420); }
    if (t > six) { const f = clamp((t - six) / .4); x.fillStyle = `rgba(255,214,110,${.9 * (1 - f * .3)})`; x.beginPath(); x.arc(320, 200, 90 + f * 500, 0, 7); x.fill(); }
    scr.t.needsUpdate = true;
    for (let i = 0; i < N; i++) { const c = C[i], T = t - c.ti; if (T <= 0) { setI(im, i, 0, -999, 0, 0, 0, 0, 0); continue; }
      const px = c.x0 + c.vx * T, pz = c.z0 + c.vz * T; let py = c.y0 + c.vy * T - .5 * G * T * T;
      const tl0 = (c.vy + Math.sqrt(c.vy * c.vy + 2 * G * c.y0)) / G, lx = c.x0 + c.vx * tl0, lz = c.z0 + c.vz * tl0, onDesk = Math.abs(lx) < 7.8 && Math.abs(lz) < 6.8;
      const ry = .06 + hash(i * 8) * 1.1 * ss(5, 0, Math.hypot(lx, lz - 1)), tl = (c.vy + Math.sqrt(c.vy * c.vy + 2 * G * Math.max(0, c.y0 - ry))) / G;   // heap height near the laptop
      let rx = T * c.spin, rz = T * c.spin * .6, X = px, Z = pz;
      if (onDesk && T >= tl) { X = c.x0 + c.vx * tl; Z = c.z0 + c.vz * tl; py = ry; rx = (hash(i) - .5) * .5; rz = (hash(i * 2) - .5) * .5; }
      setI(im, i, X, py, Z, rx, hash(i) * 6, rz, c.s); }
    im.instanceMatrix.needsUpdate = true;
    spray.update(t, six, 0, 1.3, -.8);
    lp(pl1, P, 0, 2.2, 1, tt > 0 || t > six ? '#ffcc66' : '#8fc7ff', t > six ? 60 : 14 + tt * 20); lp(pl2, P, 3, 4, 4, '#ffb060', 18);
  };
  set(g, -1, june + .8, update);
  K(P, 0, [.3, 3.2, 6.6], [0, 1.2, -1]);
  K(P, steal, [.05, 2.6, 5.2], [0, 1.25, -1]);
  K(P, six + .05, [0, 2.4, 4.8], [0, 1.2, -1]);
  K(P, six + .6, [0, 4.6, 8.4], [0, .9, 0]);
  K(P, attack - .15, [-.3, 5.6, 9.6], [-.3, .9, 1]);
  K(P, attack + .55, [-.9, 3.6, 8.0], [-1.2, 1.2, 3.0]);
  K(P, june - .55, [-1.2, 3.2, 8.2], [-1.6, -.5, 4.5]);
  SHAKE.push([six, .22, .7], [attack + .12, .12, .4]);
  ZONES.push({ t: 0, a: '#3A77B8', b: '#F2B27A', hemi: .7, gnd: '#7a6a70', key: '#FFE3BE', ki: 3.0, f0: 16, f1: 70 });
}

// ================================================================== JUNE
export function june(P) {
  const g = grp(scene, ...P); deskIsland(g);
  const scr = new Scr(640, 420), lap = laptop(g, scr, { z: -.4 }), scr2 = new Scr(320, 210), lap2 = laptop(g, scr2, { z: -.4 });
  const T0 = EV.j_june, tDl = EV.j_downloads, tTm = EV.j_tampered, tCa = EV.j_caught, tHk = EV.j_hackers, tKn = EV.j_know, tRu = EV.j_runs, tWa = EV.j_wallets, next = EV.s_sept;
  const eng = pawn(g, 0x5BA8E6, -2.2, 0, .9, 1.3); label(eng, 'A', { h: .32, y: .62, z: .28, color: '#fff', px: 80 });
  // the box
  const bxM = mat(0xC98F52, { r: .75 }), box = grp(g, 2.15, 0, .95); rbox(box, 1.4, 1.05, 1.15, bxM, 0, .525, 0, .06); rbox(box, .22, .012, 1.16, mat(0xE9D7A8, { r: .5 }), 0, 1.052, 0, .004);
  const lidL = grp(box, -.7, 1.05, 0), lidR = grp(box, .7, 1.05, 0); rbox(lidL, .7, .05, 1.15, bxM, .35, 0, 0, .02); rbox(lidR, .7, .05, 1.15, bxM, -.35, 0, 0, .02);
  label(box, 'INSTALLER', { h: .24, y: .5, z: .59, color: '#3B2412', px: 64 });
  const leak = glow(box, '#B04CFF', 2.6, 0, 1.1, 0, 0);
  const dust = new Burst(g, 60, '#E9D9BE', .22, { speed: 4, grav: 2, life: .6, seed: 4, dy: .25, normal: true });
  // the tiny spy eye
  const eye = grp(g); eye.scale.setScalar(1.7); const ball = sph(eye, .26, mat(0xF6F2FF, { r: .2 }), 0, 0, 0), iris = sph(eye, .15, mat(0x7A1CFF, { e: 0xB04CFF, ei: 1.6, r: .3 }), 0, 0, .15), egl = glow(eye, '#C060FF', 1.6);
  // beam + org chart: the wallet team
  const org = grp(g, 0, 1.6, -4.6); rbox(org, 8.4, 6.4, .25, mat(0x223A5E, { r: .6 }), 0, 3.4, 0, .12); label(org, 'WALLET TEAM', { h: .62, y: 5.9, z: .2, color: '#FFD36A', px: 110 });
  const team = [[0, 4.1], [-2.2, 1.6], [0, 1.6], [2.2, 1.6]].map(([x, y], i) => { const q = pawn(org, 0x8FA6C2, x, y, .3, 1.2); q.tag = rbox(q, .46, .2, .04, mat(0xffffff, { e: 0xFFC24A, ei: 0 }), 0, .58, .27, .03); return q; });
  const wire = mat(0x9FB6D6, { r: .4 }); rbox(org, 4.6, .06, .06, wire, 0, 3.5, .15, .02); rbox(org, .06, .6, .06, wire, 0, 3.8, .15, .02); for (const x of [-2.2, 0, 2.2]) rbox(org, .06, .5, .06, wire, x, 3.25, .15, .02);
  const beam = add(g, new THREE.ConeGeometry(1, 1, 20, 1, true), new THREE.MeshBasicMaterial({ color: 0xC77DFF, transparent: true, opacity: .22, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, fog: false }), 0, 0, 0, false);
  // alarm beacon + claw
  const bea = grp(g, -1.5, 2.62, -2.1); cyl(bea, .06, .06, 2.7, mat(0x3a3f4a), 0, -1.3, 0, 10); cyl(bea, .35, .42, .25, mat(0x3a3f4a), 0, .125, 0); const beaM = mat(0xff3030, { e: 0xff2020, ei: 0, r: .3 }); sph(bea, .32, beaM, 0, .38, 0); const beaG = glow(bea, '#ff3030', 4, 0, .4, 0, 0);
  const cone1 = add(bea, new THREE.ConeGeometry(2.2, 9, 20, 1, true), new THREE.MeshBasicMaterial({ color: 0xff3a3a, transparent: true, opacity: .16, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, fog: false }), 0, .4, 0, false); cone1.rotation.z = Math.PI / 2; cone1.geometry.translate(0, -4.5, 0);
  const cl = claw(g);
  const update = (t) => {
    // the box falls on "downloads", rocks on "tampered"
    const y = drop(t, tDl - .42, .42, 13); box.position.y = y; box.visible = t > tDl - .42;
    const s = sq(t, tDl, .32); box.scale.set(1 + s * .3, 1 - s * .35, 1 + s * .3);
    const rock = t > tTm && t < tCa + .3 ? Math.sin((t - tTm) * 26) * .1 * clamp((t - tTm) * 3) : 0; box.rotation.z = rock * .35; box.rotation.x = rock * .15;
    const lid = t > tTm ? ss(tTm, tTm + .3, t) * .75 + Math.abs(Math.sin((t - tTm) * 20)) * .25 : 0; lidL.rotation.z = lid; lidR.rotation.z = -lid; leak.material.opacity = lid * .9;
    dust.update(t, tDl, 2.15, .1, .95);
    // the eye: pops out of the box, hops to the wall of the org chart
    const out = tTm + .25, tEsc = tCa + .05; eye.visible = t > out;
    let ex, ey, ez; if (t < tEsc) { const u = ss(out, out + .25, t); ex = 2.15; ey = lerp(.6, 1.65, u) + Math.sin(t * 9) * .05; ez = .95; } else { const u = ss(tEsc, tEsc + .55, t); ex = lerp(2.15, 3.2, u); ey = lerp(1.65, 2.4, u) + Math.sin(u * 3.14) * 1.5; ez = lerp(.95, -.6, u); }
    if (t > tHk - .25) { const u = eo(up(t, tHk - .25, .55)); ex = lerp(ex, 1.6, u); ey = lerp(ey, 3.4, u); ez = lerp(ez, -1.2, u); }
    eye.position.set(ex, ey, ez); const scan = t > tKn ? Math.sin((t - tKn) * 3.6) : 0, lookX = -scan * 2.2 - (ex - 0);
    eye.lookAt(P[0] + ex + lookX * .2, P[1] + ey + (t > tHk ? .4 : -.3), P[2] + ez + (t > tHk ? -4 : 4)); egl.material.opacity = .7;
    // org chart rises on "hackers"; tags light one by one on "know ... wallets"
    const r = eo(up(t, tHk - .3, .5)); org.position.y = lerp(-8, 1.6, r); org.visible = r > 0;
    const on = (i) => lerp(tKn, tWa, i / 3);
    team.forEach((q, i) => { const u = up(t, on(i), .15), b = bk(u); q.bm.color.set(u > 0 ? 0xFFB23E : 0x8FA6C2); q.bm.emissive.set(0xFF8A1E); q.bm.emissiveIntensity = u * .5; q.tag.material.emissiveIntensity = u * 2; q.scale.setScalar(1.2 * (1 + (b - u) * .3 + (u > 0 && u < 1 ? .1 : 0))); });
    const bOn = t > tHk + .2; beam.visible = bOn; if (bOn) { const ti = clamp((t - tKn) / Math.max(.2, tWa - tKn)) * 3, tg = team[Math.min(3, Math.round(ti))]; const tx = tg.position.x, ty = tg.position.y + 2.4, tz = -4.3; const d = Math.hypot(tx - ex, ty - ey, tz - ez);
      beam.position.set((tx + ex) / 2, (ty + ey) / 2, (tz + ez) / 2); beam.scale.set(1.1, d, 1.1); beam.lookAt(P[0] + tx, P[1] + ty, P[2] + tz); beam.rotateX(Math.PI / 2); }
    // alarm on "caught"
    const al = t > tCa - .02 && t < tHk + .6 ? 1 : 0, spin = (t - tCa) * 9; bea.visible = t > tCa - .15; bea.scale.setScalar(bk(up(t, tCa - .15, .2))); beaM.emissiveIntensity = al * (3 + Math.sin(t * 40)); beaG.material.opacity = al * .9; cone1.visible = !!al; cone1.rotation.y = spin; 
    // the claw comes down, grips the laptop, lifts it away; a clean laptop slides in
    const cD = tCa + .02, cG = cD + .22, cU = cG + .06; const down = eo(up(t, cD, .22)), upv = ei(up(t, cU, .4)); const cy = lerp(16, 2.55, down) + upv * 16; cl.position.set(0, cy, -.7); cl.grip(ss(cG - .1, cG, t)); cl.visible = t > cD && t < cU + .45;
    const gone = t > cG; lap.visible = !(gone && upv >= 1); lap.position.y = gone ? upv * 16 : 0; box.position.x = 2.15; if (gone) { box.visible = t < cU; }
    lap2.position.set(lerp(-11, 0, eo(up(t, cU + .2, .3))), 0, -.4); lap2.visible = t > cU + .2;
    const x2 = scr2.x; x2.fillStyle = '#EAF2FA'; x2.fillRect(0, 0, 320, 210); x2.fillStyle = '#38B27A'; x2.font = '30px "AB"'; x2.textAlign = 'center'; x2.fillText('NEW DEVICE', 160, 112); scr2.t.needsUpdate = t > cU + .2;
    // screen: installer progress, red on caught
    const x = scr.x, pr = up(t, tDl, Math.max(.5, tCa - tDl) * .96), red = t > tCa; x.fillStyle = red ? '#D3202A' : '#E7EEF7'; x.fillRect(0, 0, 640, 420);
    x.textAlign = 'center'; x.font = '42px "AB"'; x.fillStyle = red ? '#fff' : '#1D2B44'; x.fillText(red ? 'ANOMALY' : pr > 0 ? 'INSTALLING' : 'SEARCH', 320, 150);
    x.fillStyle = red ? 'rgba(255,255,255,.3)' : '#C5D3E4'; x.fillRect(90, 210, 460, 44); x.fillStyle = red ? '#fff' : '#2E86EA'; x.fillRect(90, 210, 460 * pr, 44); if (pr > .4 && !red) { x.fillStyle = '#9B3CFF'; x.fillRect(90 + 460 * pr - 30, 210, 30, 44); }
    scr.t.needsUpdate = true;
    const blink = al ? (Math.sin(t * 22) > 0 ? 1 : .35) : 0;
    lp(pl1, P, -1, 3.5, 2.5, al ? '#ff3232' : '#FFD9A0', al ? 90 * blink : 16); lp(pl2, P, 2.2, 3, 2, t > tTm && !al ? '#B44CFF' : '#7FC6FF', t > tTm && !al ? 45 : 14);
  };
  set(g, T0 - 1.2, next + .8, update);
  K(P, T0 - .1, [-1.2, 4.6, 9.2], [-.6, .7, 0]);
  K(P, EV.j_engineer, [-.8, 3.2, 7.2], [-.8, 1.1, 0]);
  K(P, tDl - .1, [.2, 3.8, 8.2], [.5, 1, 0]);
  K(P, tTm, [1.5, 3.1, 6.6], [1.6, 1.1, .3]);
  K(P, tCa, [.5, 4.2, 8.4], [.1, 1.5, 0]);
  K(P, tCa + .55, [.2, 5.2, 9], [.1, 3, -.3]);
  K(P, tHk, [.9, 5.4, 6.6], [.6, 5, -3]);
  K(P, tWa, [.1, 5.3, 6.4], [0, 4.7, -3.2]);
  K(P, next - .45, [-.6, 3.0, 7.2], [-.8, -1.5, 3.5]);
  ZONES.push({ t: T0, a: '#2F6AAD', b: '#E9A070', hemi: .7, gnd: '#6a5a70', key: '#FFE3BE', ki: 2.9, f0: 16, f1: 70 });
  SHAKE.push([tDl, .1, .3], [tCa + .24, .05, .25]);
}

// ================================================================== SEPTEMBER
export function september(P) {
  const g = grp(scene, ...P); deskIsland(g);
  const scr = new Scr(640, 420), lap = laptop(g, scr, { z: -.2 });
  const T0 = EV.s_sept, tJob = EV.s_job, tB = EV.s_b, tTwo = EV.s_two, tInt = EV.s_interviews, tFake = EV.s_fake, tCeo = EV.s_ceo, tAs = EV.s_assignment, tUn = EV.s_undetected, tMal = EV.s_malware, next = EV.n_oct;
  // job board: a wall of cards flipping on, one hooked
  const board = grp(g, 0, 0, -4.6); rbox(board, 9.4, 9.2, .3, mat(0x2C4A73, { r: .6 }), 0, 4.7, 0, .12); 
  const cardTx = canvasTex(256, 180, (x) => { x.fillStyle = '#fff'; x.fillRect(0, 0, 256, 180); x.fillStyle = '#9fb2c9'; x.beginPath(); x.arc(54, 60, 32, 0, 7); x.fill(); x.fillRect(100, 40, 130, 16); x.fillRect(100, 70, 96, 14); x.fillRect(24, 118, 206, 12); x.fillRect(24, 142, 150, 12); });
  const cg = new THREE.PlaneGeometry(1.5, 1.05), cm = new THREE.MeshStandardMaterial({ map: cardTx, roughness: .6, side: THREE.DoubleSide }), nC = 42, cards = new THREE.InstancedMesh(cg, cm, nC), pal = ['#FFB86B', '#7FC8FF', '#FF9CC2', '#7FE39A', '#FFE066', '#BFA2FF']; cards.frustumCulled = false;
  const col = new THREE.Color(); for (let i = 0; i < nC; i++) { cards.setColorAt(i, col.set(pal[i % 6])); } board.add(cards);
  const cardPos = (i) => [-3.4 + (i % 6) * 1.36 * 1.0, 1.0 + Math.floor(i / 6) * 1.1, .2];
  const hi = 20;                                    // the card of engineer B
  const cardB = grp(g); const cbM = new THREE.MeshStandardMaterial({ map: canvasTex(256, 180, (x) => { x.fillStyle = '#FFE08A'; x.fillRect(0, 0, 256, 180); x.fillStyle = '#E8590C'; x.beginPath(); x.arc(64, 90, 48, 0, 7); x.fill(); x.fillStyle = '#fff'; x.font = '64px "AB"'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('B', 64, 94); x.fillStyle = '#7a5a10'; x.fillRect(130, 56, 106, 16); x.fillRect(130, 86, 80, 14); x.fillRect(130, 116, 96, 14); }), roughness: .5, side: THREE.DoubleSide, emissive: 0xFFB020, emissiveIntensity: 0 });
  const cb = add(cardB, cg, cbM, 0, 0, 0); const cbGlow = glow(cardB, '#FFC040', 3.4, 0, 0, -.05, 0);
  const hookG = grp(g), hookM = mat(0xE5E9F0, { r: .25, m: .9 }); cyl(hookG, .022, .022, 26, mat(0xEEEEEE), 0, 13.5, 0, 8); const ht = add(hookG, new THREE.TorusGeometry(.28, .05, 10, 28, 4.4), hookM, 0, .1, 0); ht.rotation.z = -2.1; cyl(hookG, .05, .05, .5, hookM, 0, .5, 0, 10);
  // call windows
  const mkWin = (w, h, c) => { const q = grp(g), s = new Scr(512, 340); rbox(q, w + .2, h + .28, .1, mat(c, { r: .4 }), 0, -.04, 0, .05); for (const [i, cc] of [[0, 0xff5f56], [1, 0xffbd2e], [2, 0x27c93f]]) sph(q, .05, mat(cc), -w / 2 + .12 + i * .15, h / 2 + .03, .055, 10); q.s = s; add(q, new THREE.PlaneGeometry(w, h), s.mat(), 0, -.08, .06, false); return q; };
  const w1 = mkWin(3.1, 2.05, 0xF4F7FB), w2 = mkWin(3.1, 2.05, 0xF4F7FB);
  // assignment folder + dark tendrils
  const fM = mat(0xF5C33B, { r: .5 }), fold = grp(g, 1.1, 0, 2.1); rbox(fold, 2.1, .09, 1.5, fM, 0, .05, 0, .03); const flap = grp(fold, -1.05, .1, 0); rbox(flap, 2.1, .05, 1.5, mat(0xFFD65C, { r: .5 }), 1.05, 0, 0, .02); const lab = label(flap, 'ASSIGNMENT', { h: .28, x: 1.05, y: .035, color: '#5A3C00', px: 72 }); lab.rotation.x = -Math.PI / 2;
  const inner = glow(fold, '#8A2BFF', 2.2, 0, .25, 0, 0);
  const tM = new THREE.MeshStandardMaterial({ color: 0x1B0730, emissive: 0x7A1BEF, emissiveIntensity: .4, roughness: .35, transparent: true, opacity: 1 });
  const tendP = [[[1.1, .12, 2.1], [.6, .25, 1.4], [.3, .24, .6], [-.2, .2, .1], [-.6, .25, -.7]], [[1.1, .12, 2.1], [1.5, .2, 1.3], [1.2, .22, .5], [.9, .4, -.7], [1, 1.2, -1.1], [.7, 2, -1.05]],
    [[1.1, .12, 2.1], [.8, .22, 1.5], [.0, .22, 1], [-.9, .22, .5], [-1.4, .4, -.8], [-1.2, 1.4, -1.1]], [[1.1, .12, 2.1], [1.1, .24, 1.2], [.4, .22, .2], [.2, .6, -.9], [-.2, 1.6, -1.05], [-.4, 2.2, -1.1]],
    [[1.1, .12, 2.1], [1.6, .15, 3], [1.5, .05, 5], [1.2, -.3, 7.2], [.8, -3, 7.8], [.2, -14, 6], [0, -30, 2.5]]];
  const tends = tendP.map((pts, i) => { const c = curve(pts), geo = new THREE.TubeGeometry(c, i === 4 ? 160 : 60, i === 4 ? .075 : .05, 8), m = add(g, geo, tM, 0, 0, 0, false); m.n = geo.index.count; geo.setDrawRange(0, 0); m.frustumCulled = false; return m; });
  // scanner: a green sheet of light sweeping the desk, finds nothing
  const scanTx = canvasTex(64, 8, (x) => { const q = x.createLinearGradient(0, 0, 64, 0); q.addColorStop(0, 'rgba(60,255,160,0)'); q.addColorStop(.5, 'rgba(120,255,190,.95)'); q.addColorStop(1, 'rgba(60,255,160,0)'); x.fillStyle = q; x.fillRect(0, 0, 64, 8); });
  const sc = add(g, new THREE.PlaneGeometry(1.8, 8), new THREE.MeshBasicMaterial({ map: scanTx, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, fog: false, toneMapped: false, opacity: .5 }), 0, 2, 0, false);
  const check = grp(g, 0, 3.1, -.4), ck = canvasTex(256, 256, (x) => { x.fillStyle = '#28C76F'; x.beginPath(); x.arc(128, 128, 122, 0, 7); x.fill(); x.strokeStyle = '#fff'; x.lineWidth = 30; x.lineCap = 'round'; x.lineJoin = 'round'; x.beginPath(); x.moveTo(70, 134); x.lineTo(112, 176); x.lineTo(190, 86); x.stroke(); });
  add(check, new THREE.PlaneGeometry(1.5, 1.5), new THREE.MeshBasicMaterial({ map: ck, transparent: true, toneMapped: false, fog: false }), 0, 0, 0, false);
  const dust = new Burst(g, 40, '#FFE9A0', .2, { speed: 3.4, grav: 2, life: .5, seed: 8, dy: .2 });
  const update = (t) => {
    // cards flip in: waterfall on "job"
    const c0 = T0 - .3;
    for (let i = 0; i < nC; i++) { const [x, y, z] = cardPos(i), d = hash(i * 1.3) * .5, u = bk(up(t, c0 + d, .3)), fade = i === hi ? 0 : u; setIs(cards, i, x, y, z, (1 - u) * 1.6, 0, (hash(i) - .5) * .04, fade, fade, fade); }
    cards.instanceMatrix.needsUpdate = true;
    // card B glows on "B", the hook takes it on the way to the interviews
    const [bx, by] = cardPos(hi), tHk = tB - .34, tY = Math.min(tTwo - .18, tB + .35), pu = eo(up(t, tY, .42));
    cbM.emissiveIntensity = ss(tB - .1, tB + .05, t) * .5; cbGlow.material.opacity = ss(tB - .1, tB + .05, t) * (1 - pu);
    const base = [bx, by, -4.2], end = [-2.4, .12, 1.9], arc = Math.sin(pu * Math.PI) * 2.2;
    cardB.position.set(lerp(base[0], end[0], pu), lerp(base[1], end[1], pu) + arc, lerp(base[2], end[2], pu)); cardB.rotation.x = -pu * Math.PI / 2; cardB.rotation.z = pu * 6.283; const s0 = bk(up(t, c0 + .2, .3)); const zoom = 1 + sq(t, tB, .4) * .8 + ss(tB - .1, tB + .05, t) * .35 * (1 - pu); cardB.scale.setScalar(s0 * zoom * (1 - pu * .35));
    const hy = drop(t, tHk, .34, 15, 0) + by + .9 + (t > tY ? (t - tY) * 30 : 0); hookG.position.set(bx, hy, -3.9); hookG.visible = t > tHk && t < tY + .55;
    // windows: round 1 on "two", round 2 on "interviews", then the mask falls
    const u1 = pop(t, tTwo - .02, .24), u2 = pop(t, tInt - .02, .24), leave1 = eo(up(t, tFake - .25, .3)), gr2 = eo(up(t, tFake - .2, .35)), leave2 = ei(up(t, tAs + .25, .35));
    w1.visible = u1 > 0 && leave1 < 1; w1.scale.setScalar(u1 * 1.05); w1.position.set(-.1, lerp(5.9, 5.9, 0) + leave1 * 8, -.5 - leave1 * 3); w1.rotation.z = -.03;
    w2.visible = u2 > 0 && leave2 < 1; w2.scale.setScalar(u2 * lerp(1.05, 1.3, gr2)); w2.position.set(lerp(.1, 0, gr2), lerp(3.45, 4.3, gr2) + leave2 * 11, lerp(-.3, .3, gr2)); w2.rotation.z = .03 * (1 - gr2);
    let x = w1.s.x; if (w1.visible) { x.fillStyle = '#7CC6F2'; x.fillRect(0, 0, 512, 340); bust(x, 256, 130 + Math.sin(t * 8) * 3, 88, '#E86A9A', { blink: (t * 3 % 5) < .3 }); x.fillStyle = 'rgba(0,0,0,.55)'; x.fillRect(0, 288, 512, 52); x.fillStyle = '#fff'; x.font = '30px "AB"'; x.textAlign = 'center'; x.fillText('ROUND 1', 256, 326); w1.s.t.needsUpdate = true; }
    if (w2.visible) { x = w2.s.x; x.fillStyle = '#5A6E91'; x.fillRect(0, 0, 512, 340); x.fillStyle = '#6E83A8'; x.fillRect(40, 30, 90, 180); x.fillRect(380, 30, 90, 180);
      const tm = tCeo - .02, fall = t > tm ? t - tm : 0, hollow = fall > 0;
      bust(x, 256, 130, 88, '#1F2840', { noHead: true }); x.fillStyle = '#fff'; x.beginPath(); x.moveTo(256, 190); x.lineTo(232, 225); x.lineTo(280, 225); x.fill(); x.fillStyle = '#C8102E'; x.beginPath(); x.moveTo(256, 205); x.lineTo(244, 280); x.lineTo(256, 300); x.lineTo(268, 280); x.fill();
      if (hollow) { x.fillStyle = '#0B0814'; x.beginPath(); x.arc(256, 130, 55, 0, 7); x.fill(); x.fillStyle = `rgba(255,50,80,${.5 + .5 * Math.sin(t * 16)})`; x.beginPath(); x.arc(238, 124, 5, 0, 7); x.arc(274, 124, 5, 0, 7); x.fill(); }
      const my = 130 + 500 * fall * fall, mr = fall * 7; x.save(); x.translate(256, my); x.rotate(mr); x.fillStyle = '#F7F1E3'; x.beginPath(); x.ellipse(0, 0, 56, 66, 0, 0, 7); x.fill(); x.fillStyle = '#222'; x.beginPath(); x.ellipse(-20, -10, 9, 7, 0, 0, 7); x.ellipse(20, -10, 9, 7, 0, 0, 7); x.fill(); x.strokeStyle = '#C8102E'; x.lineWidth = 5; x.beginPath(); x.arc(0, 12, 24, .3, 2.84); x.stroke(); x.restore();
      x.fillStyle = 'rgba(0,0,0,.55)'; x.fillRect(0, 288, 512, 52); x.fillStyle = '#fff'; x.font = '30px "AB"'; x.textAlign = 'center'; x.fillText(gr2 > 0 ? '"CEO"' : 'ROUND 2', 256, 326);
      if (t > tCeo + .12) { const b = bk(up(t, tCeo + .12, .2)); x.save(); x.translate(345, 72); x.rotate(-.22); x.scale(b, b); x.strokeStyle = '#ff2a4d'; x.lineWidth = 8; x.strokeRect(-92, -40, 184, 80); x.fillStyle = '#ff2a4d'; x.font = '56px "AB"'; x.fillText('FAKE', 0, 21); x.restore(); }
      w2.s.t.needsUpdate = true; }
    // folder falls out of the call on "assignment"
    fold.position.y = drop(t, tAs - .38, .38, 6, .08); fold.visible = t > tAs - .38; const fq = sq(t, tAs, .25); fold.scale.set(1 + fq * .2, 1 - fq * .5, 1 + fq * .2); flap.rotation.z = ss(tAs + .12, tAs + .42, t) * 3.0; inner.material.opacity = ss(tAs + .12, tAs + .42, t) * .6;
    dust.update(t, tAs, 1.1, .12, 2.1);
    // tendrils crawl; the scanner passes and they hide; then they come back
    const g0 = tAs + .3, g1 = Math.max(g0 + .45, tUn + .05), S0 = tUn, S1 = Math.min(next - .3, Math.max(tMal + .35, tUn + .9)), ug = eo(up(t, g0, g1 - g0));
    tends.forEach((m, i) => { const late = i === 4 ? ss(S1 - .1, next + .1, t) : ug; m.geometry.setDrawRange(0, Math.floor(m.n * late / 6) * 6); });
    const sx = lerp(-5, 5, up(t, S0, S1 - S0 - .05)), scanning = t > S0 && t < S1; sc.visible = scanning; sc.position.set(sx, 2.2, .6); sc.rotation.y = .25;
    const hide = ss(S0, S0 + .16, t) * (1 - ss(S1 - .05, S1 + .2, t)); tM.opacity = 1 - hide * .95; tM.emissiveIntensity = lerp(.4, .06, hide) + ss(S1, S1 + .2, t) * .6;
    check.scale.setScalar(pop(t, tMal - .08, .22) * (1 - ss(S1 + .05, S1 + .35, t) * .0)); check.visible = t > tMal - .08; check.position.y = 3.2;
    // screen
    x = scr.x; const ch = t > tUn; const gr = x.createLinearGradient(0, 0, 0, 420); gr.addColorStop(0, ch ? '#0E7A52' : '#EAF2FA'); gr.addColorStop(1, ch ? '#0A5A3C' : '#CFE0F2'); x.fillStyle = gr; x.fillRect(0, 0, 640, 420);
    x.fillStyle = ch ? '#D7FFE9' : '#6683A6'; x.textAlign = 'center'; x.font = '44px "AB"'; x.fillText(ch ? 'ALL CLEAR' : 'MY PROFILE', 320, ch ? 220 : 90); if (!ch) { x.fillRect(120, 130, 400, 22); x.fillRect(120, 170, 300, 22); x.fillRect(120, 210, 360, 22); }
    if (t > S1) { const u = clamp((t - S1) * 2.4); for (let i = 0; i < 26; i++) { x.fillStyle = 'rgba(40,0,80,.85)'; const a = hash(i) * 6.28, r = 360 * (1 - u * hash(i * 2)); x.beginPath(); x.arc(320 + Math.cos(a) * r * 1.3, 210 + Math.sin(a) * r, 18 + hash(i * 3) * 40, 0, 7); x.fill(); } }
    scr.t.needsUpdate = true;
    lp(pl1, P, 0, 5, 3, '#FFE0B0', 16); lp(pl2, P, sc.visible ? sx : 1.1, 2.2, 2.2, sc.visible ? '#40FFA0' : (t > tAs ? '#A040FF' : '#6FB8FF'), sc.visible ? 40 : t > tAs ? 12 : 8);
  };
  set(g, T0 - 1.2, next + .8, update);
  K(P, T0 - .1, [-.8, 7, 11], [-.3, 4.4, -2]);
  K(P, tJob, [-.2, 6.6, 10], [0, 4.4, -3]);
  K(P, tB, [.1, 5.5, 5.0], [.1, 4.2, -3.8]);
  K(P, tTwo, [.2, 5, 8.6], [0, 3.6, -1]);
  K(P, tFake, [0, 4.7, 7.8], [0, 3.8, -.5]);
  K(P, tCeo + .4, [0, 4.5, 8.4], [0, 4.1, 0]);
  K(P, tAs, [.5, 3.6, 7.8], [.4, 1.1, 1.0]);
  K(P, tUn, [.3, 2.9, 6.2], [.2, .9, .2]);
  K(P, Math.min(next - .3, Math.max(tMal + .35, tUn + .9)), [-.2, 3.4, 7], [0, 1.2, 0]);
  K(P, next - .12, [.8, .4, 9], [1, -6, 6.5]);
  ZONES.push({ t: T0, a: '#2B5F9F', b: '#D88A6E', hemi: .7, gnd: '#5a4a70', key: '#FFE3BE', ki: 2.9, f0: 16, f1: 70 });
  SHAKE.push([tAs, .07, .25]);
}
