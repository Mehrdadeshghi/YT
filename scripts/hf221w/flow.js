// #221 world: the money. Drain (vault + four glass pipes), twist (lever, valve, ghost pipe, key shards), payoff (river, ice, map), end (two links).
import { THREE, EV, DUR, scene, clamp, lerp, ss, up, eo, ei, bk, hash, pop, drop, sq, mat, add, rbox, cyl, sph, tor, grp, label, glow, Burst, coins, setI, setIs, pawn, Stream, curve, pipe, canvasTex, pl1, pl2, set, CAM, ZONES, SHAKE } from './core.js';
const K = (P, t, p, l) => CAM.push({ t, p: [P[0] + p[0], P[1] + p[1], P[2] + p[2]], l: [P[0] + l[0], P[1] + l[1], P[2] + l[2]] });
const lp = (l, P, x, y, z, c, i) => { l.position.set(P[0] + x, P[1] + y, P[2] + z); l.color.set(c); l.intensity = i; };
const glass = (c, a = .22) => new THREE.MeshPhysicalMaterial({ color: c, roughness: .08, metalness: 0, transparent: true, opacity: a, side: THREE.DoubleSide, depthWrite: false, envMapIntensity: 1.6 });
const ringM = mat(0xC8CED8, { r: .28, m: .85 });
function collars(p, c, r, n, m = ringM) { for (let i = 1; i < n; i++) { const u = i / n, q = c.getPointAt(u), tg = c.getTangentAt(u), o = tor(p, r, r * .12, m, q.x, q.y, q.z); o.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), tg); } }

// ================================================================== DRAIN: the vault opens, four torrents of coins fall into the funnel far below
export function drain(D) {
  const g = grp(scene, ...D);
  const tDr = EV.d_drain, t233 = EV.d_233, tMin = EV.d_minutes, tSol = EV.d_solana, tOp = EV.d_optimism, tBtc = EV.d_18270, tBb = EV.d_bitcoin, next = EV.t_binance, tStop = EV.t_stops;
  const wall = mat(0x7A4F26, { r: .7 }); for (const [x, y, w, h] of [[-13, 0, 16, 24], [13, 0, 16, 24], [0, 11, 12, 6]]) rbox(g, w, h, 2, wall, x, y, -11, .3);
  rbox(g, 12, 7, 2, wall, 0, -9.2, -11, .3);
  const disc = add(g, new THREE.CircleGeometry(5.2, 48), new THREE.MeshBasicMaterial({ color: 0xFFD46A, toneMapped: false, fog: false }), 0, 0, -9.9, false);
  const hole = glow(g, '#FFB040', 20, 0, 0, -8.6, 0);
  tor(g, 5.4, .55, mat(0xC79A4E, { r: .3, m: .8 }), 0, 0, -9.8);
  // a stone lip under the mouth: the coins pour over it
  rbox(g, 9, .7, 7, mat(0xB08B4E, { r: .4, m: .5 }), 0, -5, -6.5, .2);
  const hinge = grp(g, -5.3, 0, -9.3), door = grp(hinge, 5.3, 0, 0), dm = mat(0xD7DCE6, { r: .32, m: .8 }), dk = mat(0x8E96A6, { r: .35, m: .85 });
  cyl(door, 5.05, 5.05, .9, dm, 0, 0, 0, 56).rotation.x = Math.PI / 2; tor(door, 3.6, .22, dk, 0, 0, .5);
  const wheel = grp(door, 0, 0, .7); cyl(wheel, .5, .5, .3, dk, 0, 0, 0).rotation.x = Math.PI / 2; for (let i = 0; i < 3; i++) { const s = rbox(wheel, 4, .22, .22, mat(0xF2B632, { r: .3, m: .7 }), 0, 0, .12, .08); s.rotation.z = i * Math.PI / 3; }
  for (let i = 0; i < 12; i++) { const a = i / 12 * 6.283; cyl(door, .24, .24, .3, dk, Math.cos(a) * 4.3, Math.sin(a) * 4.3, .5, 14).rotation.x = Math.PI / 2; }
  // torrents: over the lip, then free fall into the funnel at the twist
  const cX = curve([[0, 1, -8], [0, -3.2, -4.5], [0, -7, -1.5], [.1, -24, -.6], [0, -41, 0]]), cS = curve([[-1, 1, -8], [-2.5, -4.6, -4.5], [-2.6, -9, .4], [-1.9, -24, .6], [-.5, -41, 0]]),
    cO = curve([[1, 1, -8], [2.5, -4.6, -4.5], [2.6, -9, -1.6], [2, -24, -1], [.5, -41, 0]]), cB = curve([[0, 1, -8], [0, -3.5, -2], [-.3, -9, 3.2], [.2, -26, 3.4], [0, -41, 0]]);
  const sX = new Stream(g, cX, 950, 'x', { speed: 14, rad: 1.5, size: .27 }), sS = new Stream(g, cS, 560, 's', { speed: 14, rad: 1, size: .27, seed: 5 }), sO = new Stream(g, cO, 560, 'o', { speed: 14, rad: 1, size: .27, seed: 7 }), sB = new Stream(g, cB, 620, 'b', { speed: 16, rad: 1.6, size: .46, seed: 11 });
  const sheet = (x, z, c, w) => { const q = glow(g, c, 1, x, -24, z, 0); q.scale.set(w, 54, 1); return q; };
  const gX = sheet(0, -2.5, '#6FC0FF', 11), gS = sheet(-2.4, -2, '#A66BFF', 8), gO = sheet(2.4, -2.5, '#FF6B5B', 8), gB = sheet(0, 1.6, '#FFA63D', 13);
  const burst = new Burst(g, 200, '#FFE6A8', .55, { speed: 15, grav: 5, life: 1.1, seed: 13, dy: .15 });
  const update = (t) => {
    const un = eo(up(t, tDr - .12, .4)), swing = ss(tDr + .02, tDr + .5, t); wheel.rotation.z = un * 6; hinge.rotation.y = -swing * 1.95;
    hole.material.opacity = swing * .45; disc.material.color.set(0xFFC04A).multiplyScalar(lerp(.2, .95, swing));
    burst.update(t, tDr + .25, 0, 0, -6);
    const stop = tStop + .05, on = (q, s, t0, c) => { const v = t > t0; s.im.visible = v; q.material.opacity = ss(t0, t0 + .5, t) * c; if (v) s.update(t, t0, stop); };
    on(gX, sX, tDr + .22, .16); on(gS, sS, tSol - .9, .14); on(gO, sO, tOp - .9, .14); on(gB, sB, tBtc - 1.05, .18);
    lp(pl1, D, 0, -1, -4, '#FFD27A', 50 + 90 * swing); lp(pl2, D, 0, lerp(-6, -22, up(t, t233, tBb - t233)), 7, t > tBtc ? '#FFB050' : '#BFE4FF', 90);
  };
  set(g, tDr - 2.6, next + 4, update);
  K(D, tDr - .25, [.1, 3, 15.5], [0, .4, -9]);
  K(D, tDr + .4, [.3, 1.8, 13.5], [.1, -.4, -8]);
  K(D, t233, [.9, 1.4, 11], [.2, -3.5, -4]);
  K(D, tMin, [.9, -5.5, 6.4], [-.2, -12, -.4]);
  K(D, tSol, [-1, -8, 8], [-.6, -14, -.4]);
  K(D, tOp, [1.1, -11, 8.4], [.6, -17, -.4]);
  K(D, tBtc, [0, -14, 10.4], [0, -20, 1]);
  K(D, tBb, [-.5, -18, 9.6], [-.2, -25, 2]);
  K(D, next - .5, [-.6, -29, 11], [-.1, -39, 0]);
  ZONES.push({ t: tDr - .8, a: '#6E3F18', b: '#C7762A', hemi: .9, gnd: '#7a4a20', key: '#FFD9A0', ki: 2.4, f0: 24, f1: 80 });
  ZONES.push({ t: t233, a: '#0E2F6E', b: '#7A3A12', hemi: .8, gnd: '#4a3a50', key: '#FFF0D8', ki: 2.6, f0: 26, f1: 90 });
  ZONES.push({ t: tBtc, a: '#2F1266', b: '#8A4210', hemi: .8, gnd: '#5a3a50', key: '#FFF0D8', ki: 2.6, f0: 26, f1: 90 });
  SHAKE.push([tDr + .3, .14, .6], [tBtc, .14, .7]);
}

export function twist(T) {
  const g = grp(scene, ...T);
  const t0 = EV.t_binance, tS = EV.t_stops, tW = EV.t_withdrawals, tO = EV.t_outflow, tR = EV.t_running, tE = EV.t_eip, tG = EV.t_gave, tRi = EV.t_rights, tOn = EV.t_onchain, tM = EV.t_mpc, tN = EV.t_no, tK = EV.t_key, tV = EV.t_revoke, tF = EV.t_fast, next = EV.p_634;
  // manifold at the top, main pipe with the valve going straight down, a big wall behind
    const steelM = mat(0xD3D9E3, { r: .3, m: .75 }), yel = mat(0xF2B632, { r: .3, m: .6 }), redM = mat(0xE5383B, { r: .35, m: .2 });
  const man = cyl(g, 2.1, 1.3, 2.4, steelM, 0, 0, 0); man.position.set(0, 1, 0); 
  const cMain = curve([[0, 0, 0], [0, -3, 0], [0, -6.5, -.2], [0, -8.5, -3], [0, -9, -30]], .4), pMain = pipe(g, cMain, 1.05, glass(0xFFD9A0, .24), 90); pMain.material.envMapIntensity = .5;
  const sA = new Stream(g, curve([[0, 2, 0], [0, -1.9, 0]], .3), 120, 'gold', { speed: 14, rad: .78, size: .24, seed: 21 }), sB2 = new Stream(g, curve([[0, -2.2, 0], [0, -6.5, -.2], [0, -8.5, -3], [0, -9, -30]], .4), 200, 'gold', { speed: 14, rad: .78, size: .24, seed: 23 });
  // valve + wheel on the pipe, at the point the camera holds
  const vY = -2.05; cyl(g, 1.55, 1.55, 1.1, steelM, 0, vY, 0); const vW = grp(g, 0, vY, 1.9), wh = tor(vW, 1.1, .13, redM, 0, 0, 0); for (let i = 0; i < 4; i++) { const s = rbox(vW, 2.2, .12, .12, redM, 0, 0, 0, .05); s.rotation.z = i * Math.PI / 4; } cyl(vW, .22, .22, .6, redM, 0, 0, -.3).rotation.x = Math.PI / 2; cyl(g, .1, .1, 1.6, steelM, 0, vY, 1.05, 10).rotation.x = Math.PI / 2;
  const gate = rbox(g, 2.5, .22, 2.5, steelM, 0, vY, -2.5, .05);
  // the lever
  const lv = grp(g, -2.4, 3.3, 1.4); const lp0 = mat(0x233654, { r: .55 }); rbox(lv, 4.1, 3.1, .3, lp0, .9, .15, -.15, .1);
  const plaque = label(lv, 'WITHDRAWALS', { h: .46, y: 1.2, x: .9, z: .05, color: '#FFD36A', px: 90 });
  const ON = label(lv, 'ON', { h: .62, x: 2.15, y: .55, z: .05, color: '#5CF2A0', px: 96 }), OFF = label(lv, 'OFF', { h: .75, x: 2.15, y: -.45, z: .05, color: '#FF4D5E', px: 96 });
  const arm = grp(lv, .1, -.4, .1); cyl(arm, .13, .13, 2.6, steelM, 0, 1.3, 0, 16); const knob = sph(arm, .38, redM, 0, 2.7, 0); cyl(lv, .34, .34, .4, mat(0x1b2438), .1, -.4, .05, 22).rotation.x = Math.PI / 2;
  const sparks = new Burst(g, 70, '#FFD27A', .3, { speed: 7, grav: 8, life: .55, seed: 17 });
  // the ghost pipe: bypasses the valve, runs on down past the contract and the key
  const cG = curve([[.3, 2, .8], [3.2, .9, 1], [3.5, -3.5, 1.6], [1.6, -8, 1.9], [.8, -11, 1.9], [.8, -13, 1.9], [2.6, -18, 2], [-1.8, -24, 2.2], [-2.8, -31, 2], [0, -37, 0]]);
  const gM = new THREE.MeshStandardMaterial({ color: 0x0FD6A0, emissive: 0x0A8F6B, emissiveIntensity: .7, roughness: .3, transparent: true, opacity: .3, side: THREE.DoubleSide, depthWrite: false, envMapIntensity: .15 }); const ghost = pipe(g, cG, .62, gM, 240);
  const sG = new Stream(g, cG, 420, 'g', { speed: 11, rad: .44, size: .17, seed: 29 }); const gGlow = glow(g, '#4CFFD0', 9, 1.5, -3, 2, 0);
  // the contract: a slab the ghost pipe runs through
  const con = grp(g, .8, -11.5, 1.9); const slabM = mat(0x0E4A63, { r: .25, m: .5, e: 0x0C6E8A, ei: .5 });
  const slab = add(con, new THREE.CylinderGeometry(2.3, 2.3, .55, 6), slabM, 0, 0, 0); label(con, 'EIP-7702', { h: .85, y: 3, z: .6, color: '#FFFFFF', px: 110 }); const ct = label(con, 'ATTACKER’S CONTRACT', { h: .34, y: 2.3, z: .6, color: '#BFF6FF', px: 70 });
  const seal = grp(con, 0, 0, 2.2); cyl(seal, .95, .95, .18, yel, 0, 0, 0, 40).rotation.x = Math.PI / 2; label(seal, 'RIGHTS', { h: .44, z: .11, color: '#3a2500', px: 74 }); const sG2 = glow(seal, '#FFD060', 3.4, 0, 0, -.1, .7);
  const onC = label(con, 'ON-CHAIN', { h: .62, x: 1.05, y: -2.7, z: .6, color: '#04261c', px: 90, bg: '#7CFFD8' });
  const hw = grp(con, -1.3, -2.7, .9); rbox(hw, 1.7, 1.25, .9, mat(0x2E6FD9, { r: .35, m: .5, e: 0x123A80, ei: .5 }), 0, 0, 0, .12); label(hw, 'HOT WALLET', { h: .3, z: .5, color: '#fff', px: 70 });
  const spin1 = tor(con, 3, .07, mat(0x7DF9FF, { r: .25, m: .5, e: 0x35C8FF, ei: 1 }), 0, 0, 0), spin2 = tor(con, 3.25, .04, mat(0xFFE08A, { r: .25, m: .5, e: 0xFFC040, ei: 1 }), 0, 0, 0), tie = cyl(con, .05, .05, 1, new THREE.MeshBasicMaterial({ color: 0xFFD060, fog: false, toneMapped: false }), 0, 0, 0, 8);
  const shock = tor(con, 2.8, .06, new THREE.MeshBasicMaterial({ color: 0xFFE9A0, transparent: true, fog: false }), 0, 0, .6);
  // MPC: a big key cracks into shards that cannot reassemble in time
  const keyG = grp(g, 0, -26.5, 3.4), km = mat(0xFFC93C, { r: .25, m: .85, e: 0x6a4a00, ei: .6 }), Sh = [];
  const mkS = (f, dx, dy) => { const q = grp(keyG); f(q); q.home = [dx, dy]; q.position.set(dx, dy, 0); Sh.push(q); };
  mkS((q) => { const o = add(q, new THREE.TorusGeometry(1, .3, 14, 22, Math.PI), km, 0, 0, 0); }, 0, 2.2);
  mkS((q) => { const o = add(q, new THREE.TorusGeometry(1, .3, 14, 22, Math.PI), km, 0, 0, 0); o.rotation.z = Math.PI; }, 0, 2.2);
  mkS((q) => rbox(q, .46, 1.3, .46, km, 0, 0, 0, .1), 0, .55);
  mkS((q) => rbox(q, .46, 1.2, .46, km, 0, 0, 0, .1), 0, -.7);
  mkS((q) => { rbox(q, .46, .9, .46, km, 0, 0, 0, .1); rbox(q, .7, .24, .3, km, .45, -.28, 0, .05); rbox(q, .5, .24, .3, km, .35, .14, 0, .05); }, 0, -1.75);
  const kgl = glow(keyG, '#FFD060', 8, 0, 0, -.6, .45);
  const crack = new Burst(g, 90, '#FFE9A0', .32, { speed: 7, grav: 2, life: .7, seed: 31, dy: 0 });
  const shardOff = [[-1.05, .35], [1.1, .7], [-1.3, -.2], [1.35, -.5], [-.1, -1.5]];
  const prog = new THREE.TorusGeometry(3.25, .1, 8, 80, 6.283), progM = add(keyG, prog, new THREE.MeshBasicMaterial({ color: 0xFF4D5E, fog: false, toneMapped: false }), 0, .2, -.4, false); add(keyG, new THREE.TorusGeometry(3.25, .05, 8, 80), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: .25, fog: false }), 0, .2, -.42, false);
  const update = (t) => {
    const fl = bk(up(t, tS - .02, .2)); arm.rotation.z = lerp(-.55, .6, fl); arm.position.z = .1; const sqArm = sq(t, tS + .1, .3); lv.scale.setScalar(1 + sqArm * .05);
    ON.material.opacity = t > tS ? .22 : 1; OFF.material.opacity = t > tS ? 1 : .22; OFF.scale.setScalar(1 + sq(t, tS, .45) * .5);
    sparks.update(t, tS, -2.2, 5.3, 1.6);
    const closeU = ss(tS + .05, tS + .75, t); vW.rotation.z = closeU * 9; gate.position.z = lerp(-2.5, 0, closeU);
    sA.update(t, t0 - 3, 1e9); sB2.update(t, t0 - 3, tS + .75); 
    // coins above the closing valve jam and slow: the upper stream freezes in place once shut
    const m = t > tS + .75; sA.im.visible = true; if (m) sA.update(tS + .75, t0 - 3, 1e9);
    const gIn = ss(tO - .15, tO + .25, t); ghost.visible = gIn > 0; gM.opacity = .42 * gIn; gGlow.material.opacity = gIn * .5; sG.im.visible = gIn > 0; if (gIn > 0) sG.update(t, tO - .1);
    // contract
    con.scale.setScalar(pop(t, tE - .1, .3)); con.visible = t > tE - .1; slab.rotation.x = Math.PI / 2; slab.rotation.y = (t - tE) * 2.2; spin1.rotation.set((t - tE) * 2.4, (t - tE) * 1.6, 0); spin2.rotation.set(-(t - tE) * 1.9, (t - tE) * 2.3, 0);
    hw.visible = t > tG - .05; hw.scale.setScalar(pop(t, tG - .05, .22)); const tieU = eo(up(t, tG, .3)); tie.visible = tieU > 0; tie.position.set(-.65 * tieU, -1.35 * tieU, .9); tie.scale.y = 3 * tieU; tie.rotation.z = -.45;
    const su = ei(up(t, tRi - .3, .3)); seal.position.set(lerp(-1.3, 0, su), lerp(-2.7, 0, su), lerp(1.5, 1, su) + Math.sin(su * 3.14) * 1.6); seal.visible = t > tRi - .3; seal.rotation.z = (1 - su) * 3; seal.scale.setScalar(1 + sq(t, tRi, .25) * .5);
    const sku = up(t, tRi, .5); shock.visible = sku > 0 && sku < 1; shock.scale.setScalar(.5 + sku * 2); shock.material.opacity = 1 - sku;
    onC.visible = t > tOn - .05; onC.scale.setScalar(pop(t, tOn - .05, .22));
    // key
    const kIn = eo(up(t, tM - .55, .35)); keyG.visible = t > tM - .55; keyG.scale.setScalar(kIn); const sU = eo(up(t, tM + .42, .4));  // whole first, splits on the end of "MPC"
    const trying = t > tV - .1 ? clamp((t - tV) / (next - tV)) : 0;
    Sh.forEach((q, i) => { const [ox, oy] = shardOff[i], h = q.home, lunge = t > tN ? Math.abs(Math.sin((t - tN) * 3.3 + i * .35)) ** 3 * .48 : 0, r = 1 - lunge; const wob = t > tM ? Math.sin(t * 1.6 + i * 2) * .1 : 0; q.position.set(h[0] + ox * sU * r + wob, h[1] + oy * sU * r - wob, 0); q.rotation.set(sU * (i - 2) * .22, sU * (i % 2 ? .4 : -.4) + (t - tM) * .4 * (i % 2 ? 1 : -1) * sU, sU * (i - 2) * .32); });
    kgl.material.opacity = .45 + sU * .1; crack.update(t, tM + .42, 0, -24.5, 3.6);
    progM.geometry.setDrawRange(0, Math.floor(prog.index.count * lerp(.0, .16, trying) / 6) * 6); progM.rotation.z = Math.PI / 2;
    lp(pl1, T, -1, 5, 6, t > tS ? '#FF5B6E' : '#FFE3B0', t > tS ? 70 : 40); lp(pl2, T, 2, t > tO ? lerp(-3, -14, up(t, tE, tM - tE)) : -3, 7, t > tM - .5 ? '#FFD890' : '#4CFFD0', 34 * gIn);
  };
  set(g, t0 - 3.2, next + 1.5, update);
  K(T, t0 - .1, [-.8, 8.5, 14.5], [-.8, 2.8, 1]);
  K(T, tS, [-1.4, 4.4, 11.8], [-1.4, 2.0, 1]);
  K(T, tO - .1, [.2, 2.6, 13], [.9, -.8, .6]);
  K(T, tR + .2, [1.2, 1, 11], [1.8, -2.4, 1.2]);
  K(T, tE, [1.6, -6.5, 12.2], [.9, -10.2, 1.8]);
  K(T, tRi, [.9, -9.4, 11.6], [.8, -10.8, 2.2]);
  K(T, tOn + .25, [.6, -11, 11.6], [.8, -11.2, 2]);
  K(T, tOn + .75, [.5, -14, 12], [.5, -17, 2]);
  K(T, tM - .35, [-.1, -23.5, 14], [0, -25, 3.4]);
  K(T, tN, [.1, -24.4, 13.4], [0, -25.2, 3.4]);
  K(T, tF, [.1, -25, 12.6], [0, -25.4, 3.4]);
  K(T, next - .55, [-1.4, -27, 13.5], [-1.6, -34, 2]);
  ZONES.push({ t: t0 - .4, a: '#3B2A82', b: '#A63F8E', hemi: 1.15, gnd: '#3a2a60', key: '#FFF0E0', ki: 2.3, f0: 22, f1: 80 });
  ZONES.push({ t: tS, a: '#7A1E4E', b: '#3B2A82', hemi: 1.05, gnd: '#3a2a60', key: '#FFD9D0', ki: 2.1, f0: 22, f1: 80 });
  ZONES.push({ t: tE, a: '#124F7A', b: '#2B7F7A', hemi: 1.15, gnd: '#1a4a60', key: '#E0FFF6', ki: 2.2, f0: 22, f1: 80 });
  ZONES.push({ t: tM, a: '#2A2F7E', b: '#B26A1E', hemi: 1.15, gnd: '#2a2a50', key: '#FFEFD0', ki: 2.3, f0: 22, f1: 80 });
  SHAKE.push([tS, .18, .45]);
}

// ================================================================== PAYOFF: the river, ice over 45% of it (2.85 of 6.34), the users' dome, the map, the denial
const NK = [[128.37,38.62],[128.17,38.36],[127.78,38.31],[127.29,38.31],[126.94,38.18],[126.67,37.83],[126.57,37.8],[126.12,37.74],[125.7,37.96],[125.41,37.72],[125.1,37.88],[125.25,38.06],[124.91,38.11],[124.88,38.29],[125.31,38.67],[125.49,38.73],[125.16,38.87],[125.36,39.53],[124.78,39.76],[124.64,39.62],[124.35,39.91],[124.48,40.18],[124.94,40.46],[125.07,40.55],[125.54,40.74],[125.69,40.84],[125.99,40.9],[126.25,41.14],[126.49,41.36],[126.6,41.64],[126.79,41.72],[127.01,41.74],[127.14,41.55],[127.52,41.48],[128.01,41.45],[128.2,41.43],[128.26,41.66],[128.06,41.86],[128.16,42.01],[128.75,42.04],[129.08,42.14],[129.22,42.31],[129.42,42.44],[129.6,42.44],[129.75,42.6],[129.86,42.97],[130.02,42.96],[130.24,42.89],[130.36,42.63],[130.55,42.47],[130.69,42.3],[130.31,42.21],[130.01,41.99],[129.69,41.59],[129.71,41.12],[129.25,40.66],[128.7,40.32],[128.3,40.04],[127.57,39.78],[127.52,39.38],[127.39,39.21],[127.79,39.08],[128.25,38.75]];   // Natural Earth 1:50m (public domain), every 4th point
export function payoff(Rv) {
  const g = grp(scene, ...Rv);
  const t0 = EV.p_634, tF0 = EV.p_285, tF = EV.p_frozen, tB = EV.p_binance, tU = EV.p_users, tW = EV.p_wont, tFb = EV.p_fbi, tP = EV.p_points, tNo = EV.p_north, tN2 = EV.p_north2, tD = EV.p_denies, cta = EV.cta, tw0 = EV.t_binance;
  const HW = 5.6, Z0 = -46, Z1 = 16, LEN = Z1 - Z0;
  const bed = add(g, new THREE.PlaneGeometry(HW * 2 + .4, LEN), mat(0x8A5A12, { r: .4, m: .4, e: 0x7A4A08, ei: .55 }), 0, -.05, (Z0 + Z1) / 2, false); bed.rotation.x = -Math.PI / 2;
  for (const s of [-1, 1]) { rbox(g, 26, 2.6, LEN, mat(0x2E5C8F, { r: .75 }), s * (HW + 13), -.7, (Z0 + Z1) / 2, .4); rbox(g, 1, .5, LEN, mat(0xF2C14E, { r: .4, m: .5 }), s * (HW + .4), .2, (Z0 + Z1) / 2, .15); }
  // coins
  const N = 1500, im = coins(g, N, 'gold'), SP = 5.5;
  const xf = (t) => lerp(-HW, -HW + HW * 2 * (2.85 / 6.34), eo(up(t, tF0, Math.max(.8, tF + .4 - tF0))));
  const tFr = (x) => { const u = (x + HW) / (HW * 2 * (2.85 / 6.34)); if (u >= 1) return 1e9; return tF0 + Math.max(.8, tF + .4 - tF0) * (1 - Math.cbrt(1 - u)); };
  const C = Array.from({ length: N }, (_, i) => ({ x: (hash(i * 1.3) * 2 - 1) * HW, y: .12 + hash(i * 2.1) * .7, z0: hash(i * 3.7) * LEN, s: .24 + hash(i * 5.1) * .16, r: hash(i * 6.3) * 6.283 })); C.forEach((c) => { c.tf = tFr(c.x); });
  // ice sheet + crystals on the frozen part
  const nI = 200, cr = new THREE.InstancedMesh(new THREE.OctahedronGeometry(1, 0), new THREE.MeshStandardMaterial({ color: 0x8FD8FF, roughness: .15, metalness: .1, emissive: 0x2F8FDF, emissiveIntensity: .35, flatShading: true, transparent: true, opacity: .85, envMapIntensity: .9 }), nI); cr.frustumCulled = false; g.add(cr);
  const CR = Array.from({ length: nI }, (_, i) => { const x = -HW + hash(i * 1.9) * HW * 2 * (2.85 / 6.34); return { x, z: Z0 + hash(i * 2.9) * LEN, tf: tFr(x) + hash(i * 7.7) * .12, sx: .18 + hash(i * 3.3) * .4, sy: .3 + hash(i * 4.4) * .85, ry: hash(i * 5.5) * 3 }; });
  const sheet = add(g, new THREE.PlaneGeometry(1, LEN), new THREE.MeshStandardMaterial({ color: 0x79C8F5, roughness: .12, metalness: .1, transparent: true, opacity: .55, envMapIntensity: .8, emissive: 0x2F8FDF, emissiveIntensity: .25 }), 0, .9, (Z0 + Z1) / 2, false); sheet.rotation.x = -Math.PI / 2; const frontGlow = glow(g, '#CFF3FF', 1, -HW, 1.2, 4, 0); frontGlow.scale.set(3, 22, 1);
  const iceB = new Burst(g, 90, '#DFF6FF', .3, { speed: 6, grav: 4, life: .8, seed: 71 });
  // the pour from the ghost pipe + gold pour upstream
  const sP = new Stream(g, curve([[0, 9, -6], [0, 5, -8], [0, 1, -10]], .3), 100, 'g', { speed: 11, rad: .5, size: .2, seed: 33 });
  // users on an island under a falling glass dome
  const isl = grp(g, 3, 0, 5); cyl(isl, 1.9, 2.1, 1.1, mat(0x3FA36B, { r: .8 }), 0, .55, 0, 36); const pz = [[-.7, .3], [0, -.5], [.7, .2], [-.25, .65], [.5, -.6], [-.9, -.45]].map(([x, z], i) => pawn(isl, [0x5BA8E6, 0xE86A9A, 0xF2B632, 0x9B6BFF, 0x4BC48A, 0xFF7B54][i], x, 1.08, z, .62));
  const dome = add(isl, new THREE.SphereGeometry(1.9, 40, 18, 0, 6.283, 0, 1.57), new THREE.MeshPhysicalMaterial({ color: 0xBFEBFF, roughness: .05, transparent: true, opacity: .32, side: THREE.DoubleSide, depthWrite: false, envMapIntensity: 1.8, emissive: 0x63B8FF, emissiveIntensity: .25 }), 0, 1.1, 0, false); const dg = new Burst(g, 50, '#BFEBFF', .26, { speed: 4, grav: 2, life: .5, seed: 73 });
  // map
  const shape = new THREE.Shape(); const cx = 127.5, cy = 40.3, ms = .92; NK.forEach(([a, b], i) => { const x = (a - cx) * ms, y = (b - cy) * ms * 1.28; i ? shape.lineTo(x, y) : shape.moveTo(x, y); }); shape.closePath();
  const mapG = grp(g, 0, 0, -11), mp = add(mapG, new THREE.ExtrudeGeometry(shape, { depth: .7, bevelEnabled: true, bevelSize: .08, bevelThickness: .08, bevelSegments: 2 }), mat(0x38507E, { r: .4, m: .3, e: 0xFF2A40, ei: 0 }), 0, 0, 0); const mapGl = glow(mapG, '#FF4D5E', 13, 0, 0, -.5, 0); const rings = [0, 1, 2].map(() => tor(mapG, 3.2, .06, new THREE.MeshBasicMaterial({ color: 0xFF7A88, transparent: true, fog: false }), 0, 0, .6));
  const spMap = new Burst(g, 110, '#FFE6A8', .34, { speed: 9, grav: 8, life: .75, seed: 77 });
  // FBI spotlight
  const fbi = grp(g, -.95, 1, 1.5), fm = mat(0x1E2C4A, { r: .35, m: .5 }); rbox(fbi, 1.8, 1, .4, fm, 0, 2.7, 0, .1); cyl(fbi, .12, .16, 2.3, fm, 0, 1.15, 0, 12); label(fbi, 'FBI', { h: .72, y: 2.7, z: .24, color: '#fff', px: 110 }); const cone = add(g, new THREE.ConeGeometry(3.4, 1, 28, 1, true), new THREE.MeshBasicMaterial({ color: 0xFFF2B8, transparent: true, opacity: .2, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, fog: false }), 0, 0, 0, false); cone.geometry.translate(0, -.5, 0);
  // DENIES stamp
  const stG = grp(g, 0, 0, -9.5), stM = mat(0xC8102E, { r: .35 }); rbox(stG, 5.2, 1.5, 2, stM, 0, 0, 0, .12); cyl(stG, .35, .35, 3, mat(0x7A1020, { r: .4 }), 0, 2.2, 0, 16); sph(stG, .85, mat(0x7A1020, { r: .4 }), 0, 4.1, 0, 22);
  const stampMark = label(mapG, 'DENIES', { h: 1.45, z: .85, color: '#FF2A4D', px: 130, bg: 'rgba(255,255,255,.92)' }); const stB = new Burst(g, 80, '#FF7A88', .3, { speed: 8, grav: 6, life: .55, seed: 79, dy: .1 });
  const update = (t) => {
    // river: frozen coins keep the z where the ice caught them
    for (let i = 0; i < N; i++) { const c = C[i], tt = Math.min(t, c.tf), z = Z0 + ((c.z0 + tt * SP) % LEN), sp = tt * 2.4 + c.r, wob = Math.sin(tt * 3 + c.r) * .14; setI(im, i, c.x + wob, c.y + (c.tf < 1e8 && t > c.tf ? 0 : Math.sin(tt * 2 + c.r) * .08), z, sp, c.r, sp * .6, c.s); } im.instanceMatrix.needsUpdate = true;
    // ice
    const fx = xf(t), wd = fx + HW; sheet.visible = wd > .01; sheet.scale.x = Math.max(.01, wd); sheet.position.x = -HW + wd / 2; frontGlow.position.x = fx; frontGlow.material.opacity = .4 * ss(tF0, tF0 + .1, t) * (1 - ss(tF + .3, tF + 1, t));
    for (let i = 0; i < nI; i++) { const c = CR[i], u = bk(up(t, c.tf, .22)); if (u <= 0) { setIs(cr, i, 0, -99, 0, 0, 0, 0, 0, 0, 0); continue; } setIs(cr, i, c.x, .8, c.z, 0, c.ry, 0, c.sx * u, c.sy * u, c.sx * u); } cr.instanceMatrix.needsUpdate = true;
    iceB.update(t, tF0 + .2, -2.5, 1, 5);
    sP.im.visible = t < tF0; if (t < tF0) sP.update(t, tw0);
    // dome drops on "won't"
    const dy = drop(t, tW - .3, .3, 12, .05); dome.position.y = 1.1 + dy; dome.visible = t > tW - .3 && t < tFb + 1.5; dg.update(t, tW, 3, 1.3, 5); const dq = sq(t, tW, .3); isl.scale.set(1 + dq * .1, 1 - dq * .14, 1 + dq * .1); pz.forEach((q, i) => { q.position.y = 1.08 + Math.abs(Math.sin(t * 6 + i)) * (t > tW ? .14 : 0); q.rotation.y = Math.sin(t * 2 + i) * .4; });
    // map bursts up out of the river on "FBI"
    const mapU = eo(up(t, tFb - .2, .45)); mapG.position.y = lerp(-5, 5.1, mapU); mapG.visible = mapU > 0; mapG.rotation.y = Math.sin(t * .9) * .07; spMap.update(t, tFb - .15, 0, .6, -10.8);
    fbi.visible = t > tFb - .08; fbi.scale.setScalar(pop(t, tFb - .08, .2));
    const coneOn = t > tP - .02; cone.visible = coneOn; if (coneOn) { const A = new THREE.Vector3(-.95, 3.7, 1.7), B = new THREE.Vector3(Math.sin(t * 2.2) * .5, 5.1, -11), d = A.distanceTo(B); cone.position.copy(A); cone.scale.set(1, d, 1); cone.quaternion.setFromUnitVectors(new THREE.Vector3(0, -1, 0), B.clone().sub(A).normalize()); cone.material.opacity = .16 + Math.sin(t * 12) * .03; }
    const hot = coneOn ? ss(tNo - .05, tNo + .15, t) : 0; mp.material.emissiveIntensity = hot * (.5 + Math.sin((t - tNo) * 9) * .12); mapGl.material.opacity = hot * .45;
    rings.forEach((r, i) => { const v = (((t - tNo) / .8 + i / 3) % 1); r.visible = t > tNo; r.scale.setScalar(.9 + v * 1.1); r.material.opacity = (1 - v) * .85; });
    // stamp falls on "denies": block slams, lifts, the mark stays
    const sd = drop(t, tD - .24, .24, 11, 0), lift = ei(up(t, tD + .08, .28)) * 16; stG.visible = t > tD - .24 && lift < 16; stG.position.y = 5.2 + sd + lift; stampMark.visible = t > tD; stampMark.scale.setScalar(1 + sq(t, tD, .25) * .3); stB.update(t, tD, 0, 5, -9.7); mapG.scale.setScalar(1 - sq(t, tD, .25) * .15);
    const icy = ss(tF0, tF0 + .5, t); lp(pl1, Rv, -3, 5, 6, '#BFE9FF', 22 * icy + 8); lp(pl2, Rv, 2.5, 5, 6, '#FFC766', 70);
  };
  set(g, t0 - 2.2, cta + .4, update);
  K(Rv, t0 - .35, [-.6, 17, 13], [0, 0, -4]);
  K(Rv, t0 + .4, [0, 12.5, 12.6], [0, 0, -2]);
  K(Rv, tF0, [-.6, 10.5, 12.5], [-.6, 0, 0]);
  K(Rv, tF + .3, [-1.2, 9, 12.5], [-1, 0, 1]);
  K(Rv, tB, [.6, 8.5, 13.5], [1, .2, 2.5]);
  K(Rv, tW, [1.9, 5, 11.5], [2.5, 1.2, 4.4]);
  K(Rv, tFb - .25, [1.5, 7, 12.5], [.8, 3, -3]);
  K(Rv, tP, [.1, 7.2, 8.4], [-.2, 4.4, -9]);
  K(Rv, tNo, [0, 7.0, 6.4], [0, 4.8, -11]);
  K(Rv, tD, [0, 7, 7.6], [0, 4.8, -11]);
  K(Rv, cta - .22, [.1, 7.4, 8.4], [0, 3, -9]);
  ZONES.push({ t: t0 - .6, a: '#1A4F98', b: '#8A5A18', hemi: .95, gnd: '#604030', key: '#FFF0D8', ki: 2.6, f0: 26, f1: 90 });
  ZONES.push({ t: tF0, a: '#2A86C7', b: '#BFEFFF', hemi: 1, gnd: '#507088', key: '#F2FAFF', ki: 2.8, f0: 26, f1: 90 });
  ZONES.push({ t: tFb - .1, a: '#101C4A', b: '#3C3A8E', hemi: .9, gnd: '#403060', key: '#FFEFE0', ki: 2.5, f0: 26, f1: 90 });
  SHAKE.push([t0, .1, .5], [tF0, .06, .5], [tW, .08, .3], [tFb - .1, .12, .5], [tD, .3, .55]);
}

// ================================================================== END: two giant links, each lights on its spoken word
export function ending(C) {
  const g = grp(scene, ...C);
  const cta = EV.cta, tI1 = EV.c_installer, tV1 = EV.c_interview, tI2 = EV.c_installer2, tV2 = EV.c_interview2, tS = EV.c_subscribe;
  const mk = (txt, y, c) => { const q = grp(g, 0, y, 0), geo = new THREE.TorusGeometry(2.05, .5, 18, 56), m = mat(0xC9CFDB, { r: .22, m: .9, e: c, ei: 0, env: 1 }), l = add(q, geo, m, 0, 0, 0); l.scale.set(1, 1.42, 1); const pl = grp(q, 0, 0, .75), pm = mat(0x1F2A44, { r: .4, m: .3, e: c, ei: 0 }); rbox(pl, 4.9, 1.05, .22, pm, 0, 0, 0, .1); label(pl, txt, { h: 1, z: .14, color: '#fff', px: 110 }); const gl = glow(q, '#' + c.toString(16).padStart(6, '0'), 12, 0, 0, -.6, 0); Object.assign(q, { m, pm, gl }); return q; };
  const a = mk('INSTALLER', 3.3, 0xFF8A2E), b = mk('INTERVIEW', -3.05, 0x35E0FF);
  // a stub of chain above, a coin heap below: the bottom of the shaft
  const n = 14, ch = new THREE.InstancedMesh(new THREE.TorusGeometry(.4, .13, 8, 20), mat(0xC9CFDB, { r: .25, m: .9 }), n), o = new THREE.Object3D(); ch.frustumCulled = false; g.add(ch); for (let i = 0; i < n; i++) { o.position.set(0, 7.7 + i * 1.05, -.05); o.rotation.y = i % 2 ? Math.PI / 2 : 0; o.scale.set(1, 1.5, 1); o.updateMatrix(); ch.setMatrixAt(i, o.matrix); }
  const NC = 700, heap = coins(g, NC, 'gold'); for (let i = 0; i < NC; i++) { const r = Math.sqrt(hash(i * 1.1)) * 16, an = hash(i * 2.3) * 6.283, x = Math.cos(an) * r, z = Math.sin(an) * r * .8, y = -9.2 - r * .12 + hash(i * 4) * .7 * (1 - r / 18); setI(heap, i, x, y, z - 1, (hash(i * 3) - .5) * .9, hash(i * 5) * 6, (hash(i * 6) - .5) * .9, .34); } heap.instanceMatrix.needsUpdate = true;
  const sA = new Burst(g, 80, '#FFB46A', .36, { speed: 7, grav: 5, life: .55, seed: 83 }), sB = new Burst(g, 80, '#6FE6FF', .36, { speed: 7, grav: 5, life: .55, seed: 87 }), sA2 = new Burst(g, 80, '#FFB46A', .36, { speed: 7, grav: 5, life: .55, seed: 89 }), sB2 = new Burst(g, 80, '#6FE6FF', .36, { speed: 7, grav: 5, life: .55, seed: 91 });
  const kick = (t, ts) => { let s = 0; for (const x of ts) if (t > x) s += Math.sin((t - x) * 9) * Math.exp(-(t - x) * 2.6); return s; };
  const update = (t) => {
    const onA = t >= tI1 && t < tV1 || t >= tI2 && t < tV2, onB = t >= tV1 && t < tI2 || t >= tV2, sw = Math.sin((t - cta) * 1.9) * .05;
    const dropIn = lerp(22, 0, eo(up(t, cta - .1, .5)));
    a.position.y = 3 + dropIn; b.position.y = -3.35 + dropIn * 1.35;
    a.rotation.z = sw + kick(t, [tI1, tI2]) * .16; a.rotation.y = kick(t, [tI1, tI2]) * .3; b.rotation.z = -sw * 1.3 + kick(t, [tV1, tV2]) * .2 + a.rotation.z * .5; b.rotation.y = kick(t, [tV1, tV2]) * .35; b.position.x = a.rotation.z * -1.7;
    for (const [q, on] of [[a, onA], [b, onB]]) { const v = on ? 1 : 0; q.m.emissiveIntensity = v * .55; q.pm.emissiveIntensity = v * .7; q.gl.material.opacity = v * .5; q.scale.setScalar(1 + (on ? .05 : 0)); }
    a.scale.setScalar(1 + (onA ? .05 : 0) + sq(t, tI1, .3) * .12 + sq(t, tI2, .3) * .12); b.scale.setScalar(1 + (onB ? .05 : 0) + sq(t, tV1, .3) * .12 + sq(t, tV2, .3) * .12);
    sA.update(t, tI1, 0, 3.3, 1); sA2.update(t, tI2, 0, 3.3, 1); sB.update(t, tV1, 0, -3, 1); sB2.update(t, tV2, 0, -3, 1);
    lp(pl1, C, 0, 3.3, 6, onA ? '#FF9A40' : '#FFE9CC', onA ? 90 : 18); lp(pl2, C, 0, -3, 6, onB ? '#55E4FF' : '#FFE9CC', onB ? 90 : 18);
  };
  set(g, cta - .3, 1e4, update);
  K(C, cta + .22, [.3, 4.4, 22], [0, 1, 0]);
  K(C, tI1, [0, 2.6, 20.6], [0, 1.2, 0]);
  K(C, tV1, [.2, 1, 20.4], [0, .9, 0]);
  K(C, tI2, [-.2, 2.2, 20.1], [0, 1.2, 0]);
  K(C, tV2, [.2, .8, 19.8], [0, 1, 0]);
  K(C, DUR + 1, [0, 1.3, 19.2], [0, 1.1, 0]);
  ZONES.push({ t: cta - .1, a: '#6E2A8F', b: '#E8862E', hemi: 1, gnd: '#603040', key: '#FFEFD8', ki: 2.8, f0: 30, f1: 110 });
}
