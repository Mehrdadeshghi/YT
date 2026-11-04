// #221 world: 20 Oct (infection travels through the node network, the token lifts out) and 29 Oct (server hall: token, gate, crane, swarm, signing press). Plus the chain.
import { THREE, EV, scene, clamp, lerp, ss, up, eo, ei, bk, hash, pop, drop, sq, mat, add, rbox, cyl, sph, tor, grp, label, glow, Burst, setI, setIs, pawn, curve, canvasTex, claw, pl1, pl2, set, CAM, ZONES, SHAKE } from './core.js';
const K = (P, t, p, l) => CAM.push({ t, p: [P[0] + p[0], P[1] + p[1], P[2] + p[2]], l: [P[0] + l[0], P[1] + l[1], P[2] + l[2]] });
const lp = (l, P, x, y, z, c, i) => { l.position.set(P[0] + x, P[1] + y, P[2] + z); l.color.set(c); l.intensity = i; };
const CY = 0x35E0FF, RD = 0xFF2E4D;

// ================================================================== the token: one object carried from 20 Oct into the hall
function makeToken() { const g = grp(scene), m = mat(0xFFC93C, { r: .25, m: .8, e: 0x7a5200, ei: .5 }); rbox(g, 1.9, 1.15, .14, m, 0, 0, 0, .06); label(g, 'TOKEN', { h: .5, z: .09, y: -.05, color: '#3a2500', px: 80 }); label(g, 'TOKEN', { h: .5, z: -.09, y: -.05, color: '#3a2500', px: 80 }).rotation.y = Math.PI; g.gl = glow(g, '#FFD060', 4.4, 0, 0, -.15, .7); g.visible = false; return g; }

export function network(P, L) {
  const g = grp(scene, ...P);
  const T0 = EV.n_oct, tI = EV.n_internal, tTool = EV.n_tool, tTake = EV.n_take, tA = EV.n_a, tC = EV.n_c, tH = EV.n_holds, tTk = EV.n_token, tCon = EV.n_containers, next = EV.l_oct, tSt = EV.l_stolen;
  const pos = { B: [-.1, 4.7, 0], X: [0, .9, 0], A: [-1.8, -3.6, .6], C: [1.8, -3.6, -.2] };
  // deep background network: fills the frame, goes red from the infected core outward
  const nB = 170, bgM = new THREE.MeshBasicMaterial({ color: 0xffffff, toneMapped: false, fog: false }), bg = new THREE.InstancedMesh(new THREE.SphereGeometry(.11, 10, 8), bgM, nB); bg.frustumCulled = false; g.add(bg);
  const Bp = Array.from({ length: nB }, (_, i) => [(hash(i) - .5) * 26, 10 - hash(i * 1.9) * 28, -5 - hash(i * 2.7) * 18]); const o = new THREE.Object3D();
  Bp.forEach((p, i) => { o.position.set(...p); o.scale.setScalar(.6 + hash(i * 3.3) * 1.2); o.updateMatrix(); bg.setMatrixAt(i, o.matrix); });
  const lpos = []; const lcol = []; Bp.forEach((p, i) => { let n = 0; for (let j = i + 1; j < nB && n < 2; j++) { const q = Bp[j], d = Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]); if (d < 6.5) { lpos.push(...p, ...q); n++; } } });
  const lg = new THREE.BufferGeometry(); lg.setAttribute('position', new THREE.Float32BufferAttribute(lpos, 3)); const lines = new THREE.LineSegments(lg, new THREE.LineBasicMaterial({ color: 0x7FD8FF, transparent: true, opacity: .4, fog: false, toneMapped: false })); g.add(lines);
  const col = new THREE.Color(), cy = new THREE.Color(CY), rd = new THREE.Color(RD);
  // main nodes: glass ball, little person inside, letter
  const mk = (x, y, z, l) => { const q = grp(g, x, y, z), ball = sph(q, 1.15, new THREE.MeshPhysicalMaterial({ color: CY, roughness: .1, transparent: true, opacity: .26, depthWrite: false, envMapIntensity: 1.2, emissive: CY, emissiveIntensity: .15 }), 0, 0, 0, 40); ball.castShadow = false; const p = pawn(q, 0x3D7BD9, 0, -.98, .05, 1.3); const gl = glow(q, '#35E0FF', 4.2, 0, 0, -.2, .55); const tag = label(q, l, { h: .7, x: 1.05, y: .95, z: .5, color: '#fff', px: 110, bg: '#14304F' }); const sh = tor(q, 1.2, .05, new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, fog: false }), 0, 0, 0); Object.assign(q, { ball, p, gl, sh, tag }); return q; };
  const nodeB = mk(...pos.B, 'B'), nodeA = mk(...pos.A, 'A'), nodeC = mk(...pos.C, 'C');
  const core = grp(g, ...pos.X), cM = mat(0x35E0FF, { r: .25, m: .3, e: 0x35E0FF, ei: 1.1 }); const ico = add(core, new THREE.IcosahedronGeometry(1.15, 1), new THREE.MeshStandardMaterial({ color: 0x12293F, roughness: .3, metalness: .6, transparent: true, opacity: .55 }), 0, 0, 0); const inner = sph(core, .68, cM, 0, 0, 0); inner.castShadow = false; const wf = add(core, new THREE.IcosahedronGeometry(1.2, 1), new THREE.MeshBasicMaterial({ color: CY, wireframe: true, fog: false, toneMapped: false }), 0, 0, 0, false);
  const r1 = tor(core, 1.75, .06, mat(0xE6F7FF, { r: .25, m: .8 }), 0, 0, 0), r2 = tor(core, 2.05, .05, mat(0xE6F7FF, { r: .25, m: .8 }), 0, 0, 0); const cgl = glow(core, '#35E0FF', 7, 0, 0, -.4, .6); label(core, 'AI TOOL', { h: .5, y: 2.3, x: .95, z: .9, color: '#fff', px: 90, bg: '#14304F' });
  // links + pulses
  const links = [['B', 'X'], ['X', 'A'], ['X', 'C']].map(([a, b]) => { const A = new THREE.Vector3(...pos[a]), B = new THREE.Vector3(...pos[b]), m = add(g, new THREE.CylinderGeometry(.075, .075, A.distanceTo(B), 12), mat(CY, { e: CY, ei: .9, r: .3 }), (A.x + B.x) / 2, (A.y + B.y) / 2, (A.z + B.z) / 2, false); m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), B.clone().sub(A).normalize()); const pu = glow(g, '#FF5A73', 2.6, 0, 0, 0, 0), ps = sph(g, .22, new THREE.MeshBasicMaterial({ color: 0xFFD2DA, fog: false, toneMapped: false }), 0, 0, 0, 14); return { A, B, m, pu, ps }; });
  const bursts = [new Burst(g, 70, '#FF5A73', .34, { speed: 6, grav: 1, life: .7, seed: 41, dy: 0 }), new Burst(g, 70, '#FF5A73', .34, { speed: 6, grav: 1, life: .7, seed: 43, dy: 0 }), new Burst(g, 70, '#FF5A73', .34, { speed: 6, grav: 1, life: .7, seed: 47, dy: 0 })];
  const tok = makeToken();
  const flip = (q, t, tf) => { const u = ss(tf - .02, tf + .1, t), c = col.copy(cy).lerp(rd, u); q.ball.material.color.copy(c); q.ball.material.emissive.copy(c); q.p.bm.color.set(u > .5 ? 0xFF2E4D : 0x3D7BD9); q.gl.material.color.copy(c); const s = sq(t, tf, .35); q.scale.setScalar(1 + s * .55); const v = up(t, tf, .5); q.sh.visible = v > 0 && v < 1; q.sh.scale.setScalar(1 + v * 3); q.sh.material.opacity = 1 - v; q.sh.material.color.copy(c); q.sh.quaternion.copy(new THREE.Quaternion()); };
  const tB0 = T0 + .15, Lhold = [lerp(pos.A[0], .1, 1), -.3, 3.9], tokDrop = next - .5, gatePos = [L[0], L[1] + 3.1, L[2] - 1.5], hov = [L[0] + .1, L[1] + 4.4, L[2] + 2];
  const lerp3 = (a, b, e) => [lerp(a[0], b[0], e), lerp(a[1], b[1], e), lerp(a[2], b[2], e)], src = [Lhold[0] + P[0], Lhold[1] + P[1], Lhold[2] + P[2]];
  // falls ahead of the camera into the hall, hovers in front of the gate, then goes into the lock
  const tokenFall = (t) => t < next ? lerp3(src, hov, ei(up(t, tokDrop, next - tokDrop)) * .35 + up(t, tokDrop, next - tokDrop) * .65) : t < tSt - .25 ? [hov[0] + Math.sin(t * 1.3) * .08, hov[1] - (t - next) * .35, hov[2] - (t - next) * .3] : lerp3([hov[0], hov[1] - (tSt - .25 - next) * .35, hov[2] - (tSt - .25 - next) * .3], gatePos, ss(tSt - .25, tSt + .2, t));
  const update = (t) => {
    const u = up(t, T0 - .55, .5), ty = lerp(9, 0, eo(u));
    const pulse = (i, t0, d) => { const l = links[i], v = up(t, t0, d), on = v > 0 && v < 1; l.pu.visible = l.ps.visible = on; if (on) { const x = lerp(l.A.x, l.B.x, v), y = lerp(l.A.y, l.B.y, v), z = lerp(l.A.z, l.B.z, v); l.pu.position.set(x, y, z); l.ps.position.set(x, y, z); l.pu.material.opacity = 1; }
      const c = col.copy(cy).lerp(rd, ss(0, 1, v)); l.m.material.color.copy(c); l.m.material.emissive.copy(c); };
    const tCoreOn = Math.max(tI + .3, tTool); pulse(0, tCoreOn - .32, .32); pulse(1, tA - .34, .34); pulse(2, tC - .34, .34);
    flip(nodeB, t, tB0); flip(nodeA, t, tA); flip(nodeC, t, tC);
    const f = ss(tCoreOn - .02, tCoreOn + .12, t), c = col.copy(cy).lerp(rd, f); cM.color.copy(c); cM.emissive.copy(c); cgl.material.color.copy(c); wf.material.color.copy(c); core.scale.setScalar(1 + sq(t, tCoreOn, .4) * .4); ico.rotation.set(t * .5, t * .8, 0); wf.rotation.copy(ico.rotation); r1.rotation.set(1.1 + t * 1.2, t * .7, 0); r2.rotation.set(-.8 + t * .9, -t * .9, 0);
    bursts[0].update(t, tCoreOn, ...pos.X); bursts[1].update(t, tA, ...pos.A); bursts[2].update(t, tC, ...pos.C);
    // background goes red outward from the core
    const R = lerp(0, 34, ss(tCoreOn, Math.max(tC + 1.4, tCoreOn + 2), t)); for (let i = 0; i < nB; i++) { const p = Bp[i], d = Math.hypot(p[0] - pos.X[0], p[1] - pos.X[1], p[2] - pos.X[2]), v = ss(R - 2, R, d); bg.setColorAt(i, col.copy(rd).lerp(cy, v).multiplyScalar(.8 + hash(i) * .5)); } bg.instanceColor.needsUpdate = true; lines.material.color.copy(col.copy(rd).lerp(new THREE.Color(0x7FD8FF), ss(.35, .9, 1 - R / 34)));
    lp(pl1, P, 0, 2.6, 3, f > .5 ? '#FF4A66' : '#6FE4FF', 34); lp(pl2, P, -1.2, -3, 3.5, t > tTk ? '#FFCF55' : (f > .5 ? '#FF4A66' : '#6FE4FF'), t > tTk ? 50 : 24);
    // token: lifts out of A on "token", hovers facing us, then falls ahead of the camera to the gate
    const a = pos.A, tr = eo(up(t, tTk - .2, .42)); let tx = lerp(a[0], Lhold[0], tr) + P[0], ty2 = lerp(a[1], Lhold[1], tr) + P[1], tz = lerp(a[2], Lhold[2], tr) + P[2];
    if (t > tokDrop) { const q = tokenFall(t); tx = q[0]; ty2 = q[1]; tz = q[2]; }
    tok.position.set(tx, ty2, tz); tok.visible = t > tTk - .2 && t < next + 3.2; const ins = t > tSt + .22; tok.rotation.set(ins ? 0 : Math.sin(t * 1.6) * .08, ins ? 0 : (1 - tr) * 6.283 + Math.sin(t * 2.2) * .25 + (t > tokDrop ? (t - tokDrop) * 4 : 0), 0); tok.scale.setScalar(tr * (1 + sq(t, tTk, .3) * .4) * 1); tok.gl.material.opacity = .55;
  };
  SETTOK.tok = tok; SETTOK.update = (t) => { };
  set(g, T0 - 1.3, next + .7, update);
  // the token stays alive after the network set hides: its parent is the scene, updated from this tiny always-on set
  set(grp(scene), next + .7, next + 3.4, (t) => { const q = tokenFall(t); tok.visible = t < tSt + .9; tok.position.set(q[0] - eo(up(t, tSt + .32, .5)) * 4.2, q[1], q[2]); tok.rotation.set(0, t < tSt - .1 ? (t - next) * 4 : 0, 0); tok.scale.setScalar(lerp(1, .62, ss(tSt - .25, tSt + .2, t))); tok.gl.material.opacity = .35; });
  K(P, T0 - .1, [.3, 8.5, 13], [0, 3.4, 0]);
  K(P, tI, [-.1, 5.2, 13.5], [0, 3.2, 0]);
  K(P, tTake, [0, 2, 14.5], [0, .8, 0]);
  K(P, tC, [0, 1, 14], [0, .2, 0]);
  K(P, tTk, [-.4, .8, 13], [-.2, -.2, 1.2]);
  K(P, tCon, [.1, .4, 11.5], [0, -.6, 3]);
  K(P, next - .55, [.2, -.3, 10.5], [0, -3, 3.4]);
  ZONES.push({ t: T0 - .15, a: '#1B1464', b: '#0F6E8F', hemi: .85, gnd: '#20204a', key: '#CFE6FF', ki: 2, f0: 30, f1: 110 });
  ZONES.push({ t: tA, a: '#3A0F5E', b: '#A81E4E', hemi: .85, gnd: '#30203a', key: '#FFD9E0', ki: 2, f0: 30, f1: 110 });
  SHAKE.push([tA, .07, .3], [tC, .07, .3]);
}
const SETTOK = {};

// ================================================================== HALL
export function hall(L) {
  const g = grp(scene, ...L);
  const T0 = EV.l_oct, tSt = EV.l_stolen, tDe = EV.l_deploy, tCo = EV.l_container, tRe = EV.l_reach, tSi = EV.l_signing, tSv = EV.l_service, next = EV.d_drain;
  // floor
  const flTx = canvasTex(512, 512, (x) => { x.fillStyle = '#1C3A73'; x.fillRect(0, 0, 512, 512); x.strokeStyle = 'rgba(120,200,255,.3)'; x.lineWidth = 4; x.strokeRect(0, 0, 512, 512); }); flTx.wrapS = flTx.wrapT = THREE.RepeatWrapping; flTx.repeat.set(10, 18);
  const fl = add(g, new THREE.PlaneGeometry(28, 56), new THREE.MeshStandardMaterial({ map: flTx, roughness: .5, metalness: .3, envMapIntensity: .6 }), 0, 0, -11, false); fl.rotation.x = -Math.PI / 2;
  // racks
  const ledTx = canvasTex(128, 512, (x) => { x.fillStyle = '#0C1630'; x.fillRect(0, 0, 128, 512); for (let r = 0; r < 18; r++) { x.fillStyle = '#16264A'; x.fillRect(6, 8 + r * 28, 116, 22); for (let c = 0; c < 8; c++) { x.fillStyle = hash(r * 9 + c) > .55 ? (hash(r + c * 3) > .5 ? '#46F0B0' : '#46C8FF') : '#203058'; x.fillRect(12 + c * 13, 15 + r * 28, 7, 7); } } });
  const rkM = new THREE.MeshStandardMaterial({ color: 0x2B3E70, roughness: .45, metalness: .5 }), rkF = new THREE.MeshStandardMaterial({ map: ledTx, emissiveMap: ledTx, emissive: 0xffffff, emissiveIntensity: .25, roughness: .4 }), nR = 92, racks = new THREE.InstancedMesh(new THREE.BoxGeometry(1.4, 8, 1.55), [rkF, rkF, rkM, rkM, rkM, rkM], nR); racks.frustumCulled = false; racks.castShadow = false; g.add(racks);
  const o = new THREE.Object3D(); for (let i = 0; i < nR; i++) { const s = i % 2 ? 1 : -1, row = i % 4 < 2 ? 0 : 1, k = Math.floor(i / 4); o.position.set(s * (4.3 + row * 3.4), 4, 8 - k * 1.75); o.scale.set(1, 1, 1); o.updateMatrix(); racks.setMatrixAt(i, o.matrix); }
  // aisle light strips come on in a run down the hall
  const nS = 24, stripM = new THREE.MeshBasicMaterial({ color: 0xFFFFFF, toneMapped: false, fog: false }), strips = new THREE.InstancedMesh(new THREE.BoxGeometry(.18, .04, 1), stripM, nS * 2); strips.frustumCulled = false; g.add(strips);
  const col = new THREE.Color();
  // gate + lock
  const gm = mat(0x9AA8C2, { r: .35, m: .75 }), gL = grp(g, 0, 0, -2), gR = grp(g, 0, 0, -2), yb = mat(0xF2B632, { r: .4 }); rbox(gL, 3.4, 7.8, .5, gm, -1.7, 3.9, 0, .1); rbox(gR, 3.4, 7.8, .5, gm, 1.7, 3.9, 0, .1); for (const [q, d] of [[gL, -1], [gR, 1]]) for (let i = 0; i < 5; i++) { const b = rbox(q, .5, 7.7, .05, yb, d * (.4 + i * .65), 3.9, .28, .02); b.rotation.z = 0; }
  const lock = grp(g, 0, 3.1, -1.72), lockM = mat(0xE5383B, { r: .3, e: 0xE5383B, ei: .4 }); rbox(lock, 2.3, 1.5, .25, mat(0x1C2438, { r: .4, m: .5 }), 0, 0, 0, .08); rbox(lock, 1.5, .95, .02, mat(0xFFC93C, { e: 0xFFC93C, ei: .25, r: .4 }), 0, -.1, .13, .01); const lamp = sph(lock, .15, lockM, 0, .5, .14, 12);
  const gSpark = new Burst(g, 80, '#FFE08A', .24, { speed: 6, grav: 7, life: .5, seed: 51 });
  // crane + container
  const cl = claw(g), cont = grp(g, 0, 0, -8), cM = mat(0xE8681E, { r: .55, m: .25 }); rbox(cont, 3, 2.5, 5, cM, 0, 1.25, 0, .08); for (let i = 0; i < 11; i++) for (const s of [-1, 1]) rbox(cont, .06, 2.1, .16, mat(0xB94F12, { r: .6 }), s * 1.52, 1.25, -2.1 + i * .42, .02); for (let i = 0; i < 7; i++) rbox(cont, .22, 2.1, .06, mat(0xB94F12, { r: .6 }), -1.1 + i * .37, 1.25, 2.52, .02);
  label(cont, 'CONTAINER', { h: .46, y: 1.5, z: 2.6, color: '#fff', px: 80 });
  const lid = grp(cont, 0, 2.5, -2.5), lidM = mat(0xF27A2E, { r: .5, m: .25 }); rbox(lid, 3, .14, 5, lidM, 0, .06, 2.5, .05); const cGlow = glow(cont, '#FF3DB4', 5, 0, 3, 0, 0), dust = new Burst(g, 80, '#CBD8F0', .3, { speed: 5, grav: 1, life: .6, seed: 53, dy: .15, normal: true });
  // swarm: little glowing scripts on a path to the press
  const cS = curve([[0, 2.7, -8], [.2, 6, -10], [-1.4, 7.2, -15], [1.2, 6.2, -21], [0, 3.1, -27]]), Sp = cS.getSpacedPoints(120), nP = 620, sa = new Float32Array(nP * 3), sg = new THREE.BufferGeometry(); sg.setAttribute('position', new THREE.BufferAttribute(sa, 3));
  const glowT = canvasTex(32, 32, (x) => { const q = x.createRadialGradient(16, 16, 1, 16, 16, 16); q.addColorStop(0, 'rgba(255,255,255,1)'); q.addColorStop(.35, 'rgba(255,255,255,.55)'); q.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = q; x.fillRect(0, 0, 32, 32); });
  const swarm = new THREE.Points(sg, new THREE.PointsMaterial({ map: glowT, color: 0xFF4FC0, size: .34, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false, toneMapped: false })); swarm.frustumCulled = false; g.add(swarm);
  // the signing press: a monster at the end of the aisle
  const press = grp(g, 0, 0, -27), pm = mat(0x3C4A6E, { r: .4, m: .7 }), pg = mat(0xF2B632, { r: .3, m: .75 }); for (const s of [-1, 1]) rbox(press, 1.5, 11, 2.6, pm, s * 3.6, 5.5, 0, .2); rbox(press, 9, 2.4, 3.2, pm, 0, 11.2, 0, .3); rbox(press, 7, .8, 3.4, mat(0x28324C, { r: .5, m: .5 }), 0, .4, 0, .12); label(press, 'WALLET SIGNING', { h: .9, y: 11.2, z: 1.64, color: '#FFD36A', px: 100 });
  const ram = grp(press, 0, 6, 0); cyl(ram, .6, .6, 7, mat(0xD3D9E3, { r: .25, m: .9 }), 0, 3.5, 0, 22); rbox(ram, 4.6, .9, 2.4, pg, 0, -.1, 0, .12); const pad = glow(press, '#FFE08A', 7, 0, 1.2, 1.6, 0); const shk = new Burst(g, 60, '#FFE9B0', .3, { speed: 8, grav: 3, life: .4, seed: 61, dy: .1 });
  // stamped approvals fly off the anvil
  const appTx = canvasTex(256, 180, (x) => { x.fillStyle = '#F7F2E2'; x.fillRect(0, 0, 256, 180); x.fillStyle = '#B7B09A'; for (let i = 0; i < 4; i++) x.fillRect(22, 24 + i * 22, 210, 8); x.save(); x.translate(128, 130); x.rotate(-.08); x.strokeStyle = '#1FA85E'; x.lineWidth = 6; x.strokeRect(-92, -24, 184, 48); x.fillStyle = '#1FA85E'; x.font = '34px "AB"'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText('SIGNED', 0, 2); x.restore(); });
  const nA = 26, apps = new THREE.InstancedMesh(new THREE.PlaneGeometry(1.5, 1.05), new THREE.MeshStandardMaterial({ map: appTx, side: THREE.DoubleSide, roughness: .7 }), nA); apps.frustumCulled = false; press.add(apps);
  const PER = .4;
  const update = (t) => {
    for (let i = 0; i < nS; i++) { const d = ss(tSt + .3 + i * .05, tSt + .4 + i * .05, t); for (const s of [0, 1]) { o.position.set(s ? 1.3 : -1.3, .02, 7 - i * 1.5); o.scale.set(1, 1, 1); o.updateMatrix(); strips.setMatrixAt(i * 2 + s, o.matrix); strips.setColorAt(i * 2 + s, col.setRGB(.18 + d * .9, .3 + d * .75, .5 + d * .7)); } } strips.instanceMatrix.needsUpdate = true; strips.instanceColor.needsUpdate = true;
    rkF.emissiveIntensity = .25 + ss(tSt + .3, tSt + 1.1, t) * .95;
    // gate slides open once the token is in
    const op = eo(up(t, tSt + .32, .5)); gL.position.x = -op * 4.2; gR.position.x = op * 4.2; lock.position.x = -op * 4.2; lockM.color.set(t > tSt + .25 ? 0x28E07C : 0xE5383B); lockM.emissive.copy(lockM.color); gSpark.update(t, tSt + .25, 0, 3.1, -1.4);
    // the crane lowers the container on "deploy", it lands on "container"
    const dn = t < tCo ? 1 - (1 - up(t, tDe - .35, Math.max(.3, tCo - tDe + .35))) ** 2 : 1, cy = lerp(11, 0, dn); cont.position.y = cy + (t > tCo ? drop(t, tCo, .001, 0) : 0); const sq0 = sq(t, tCo, .28); cont.scale.set(1 + sq0 * .12, 1 - sq0 * .2, 1 + sq0 * .12); cont.visible = t > tDe - .4;
    const rise = ei(up(t, tCo + .05, .5)); cl.position.set(0, cy + 2.5 + rise * 16, -8); cl.grip(1 - ss(tCo, tCo + .1, t)); cl.visible = t > tDe - .45 && rise < 1; dust.update(t, tCo, 0, .1, -8);
    const lO = ss(tCo + .08, tCo + .4, t); lid.rotation.x = -lO * 1.2; cGlow.material.opacity = lO * .6;
    // swarm
    const s0 = tCo + .22, s1 = Math.max(tSi, s0 + .35), T = (t - s0) / (s1 - s0), n = Sp.length - 1; swarm.visible = T > 0;
    if (T > 0) { for (let i = 0; i < nP; i++) { const d = hash(i * 1.1) * .55, u = T - d, a = hash(i * 2.2) * 6.283, r = .25 + hash(i * 3.7) * 1.05, on = u > 0; if (!on) { sa[i * 3 + 1] = -999; continue; } const f = Math.min(1, u), j = Math.min(n - 1, Math.floor(f * n)), q = f * n - j, A = Sp[j], B = Sp[j + 1], w = t * (5 + hash(i) * 4) + a, sp = f >= 1 ? 0 : r; if (f >= 1) { const aa = hash(i * 4) * 6.283, rr = 1.6 + hash(i * 5) * 2.2; sa[i * 3] = Math.cos(aa + t * 2) * rr; sa[i * 3 + 1] = 2.2 + Math.sin(aa * 2 + t * 3) * 1.4; sa[i * 3 + 2] = -27 + Math.sin(aa + t * 2) * rr * .6; continue; } sa[i * 3] = lerp(A.x, B.x, q) + Math.cos(w) * sp; sa[i * 3 + 1] = lerp(A.y, B.y, q) + Math.sin(w) * sp; sa[i * 3 + 2] = lerp(A.z, B.z, q) + Math.sin(w * 1.3) * sp; } sg.attributes.position.needsUpdate = true; swarm.material.opacity = 1; }
    // press: dead still until the swarm hits on "signing", then a stamp every PER seconds
    const k = (t - tSi) / PER, ph = k > 0 ? k - Math.floor(k) : .999, fall = ph < .18 ? ph / .18 : 1 - ss(.22, .9, ph); ram.position.y = lerp(6, 1.55, fall * fall); pad.material.opacity = k > 0 ? clamp(1 - ph * 4) : 0;
    const K0 = k > 0 ? Math.floor(k) : -1, shkT = tSi + K0 * PER + .072; shk.update(t, K0 >= 0 ? shkT : 1e9, 0, 1.2, 1);
    for (let i = 0; i < nA; i++) { const ti = tSi + i * PER + .075, T1 = t - ti; if (T1 < 0 || T1 > 1.6) { setI(apps, i, 0, -999, 0, 0, 0, 0, 0); continue; } const dx = (hash(i) - .5) * 9, dz = 5 + hash(i * 2) * 4; setI(apps, i, dx * T1, 1 + 6.5 * T1 - 5 * T1 * T1, 1 + dz * T1, T1 * (2 + hash(i * 3) * 4) - 1.2, hash(i * 4) * 2 - 1, T1 * 3 * (hash(i * 5) - .5), 1); } apps.instanceMatrix.needsUpdate = true;
    lp(pl1, L, 0, 6, lerp(2, -18, up(t, tDe, tSi - tDe)), t > tCo ? '#FF4FC0' : '#7FD2FF', t > tCo ? 60 : 36); lp(pl2, L, 0, 3.5, -23.5, '#FFD27A', t > tSi ? 40 + clamp(1 - ph * 3) * 120 : 16);
  };
  set(g, T0 - 1.5, next + .7, update);
  K(L, T0 - .1, [.2, 10, 10], [0, 4, -1]);
  K(L, tSt, [.1, 4.4, 5.6], [0, 3.2, -1.8]);
  K(L, tSt + .6, [.4, 5, 4.6], [0, 3, -5]);
  K(L, tDe, [1.8, 6.2, 2], [0, 3.2, -8]);
  K(L, tCo, [2.0, 5.2, 0], [0, 2.2, -8]);
  K(L, tRe, [2.4, 9.4, -5], [0, 4.8, -18]);
  K(L, tSi, [.3, 5.2, -14.5], [0, 4.2, -27]);
  K(L, tSv + .15, [0, 4.8, -16], [0, 4.4, -27]);
  K(L, next - .35, [0, 17, -21], [0, 8, -44]);
  ZONES.push({ t: T0 - .2, a: '#14317A', b: '#0F7F8F', hemi: .9, gnd: '#1a2a55', key: '#D8E8FF', ki: 2.4, f0: 18, f1: 62 });
  ZONES.push({ t: tCo, a: '#2A1A7E', b: '#8F1F7F', hemi: .9, gnd: '#2a1a55', key: '#FFE0F4', ki: 2.4, f0: 20, f1: 66 });
  SHAKE.push([tSt + .3, .05, .4], [tCo, .16, .4], [tSi + .07, .1, .3], [tSv + .1, .08, .3]);
}

// ================================================================== the chain: runs down the shaft, glows hot where the story has already passed
export function chain(t0link) {
  const n = 270, geo = new THREE.TorusGeometry(.2, .065, 8, 18), im = new THREE.InstancedMesh(geo, new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: .3, metalness: .85 }), n), o = new THREE.Object3D(); im.frustumCulled = false; scene.add(im);
  const X = -2.4, Z = 4.6, Y0 = 42, SP = .62, col = new THREE.Color(), hot = new THREE.Color(0xFF7A2E), cold = new THREE.Color(0xC4CCDA);
  const g = grp(scene);
  const tA = EV.h_attack, tEnd = EV.l_oct + .5;
  set(g, tA - .4, tEnd, (t) => { im.visible = true; });
  const camY = () => g.parent.__cy ?? 0;
  SETS_CHAIN.update = (t, cy) => { const vis = t > tA - .35 && t < tEnd; im.visible = vis; if (!vis) return; const drop_ = lerp(70, 0, ei(up(t, tA - .3, .42)));
    for (let i = 0; i < n; i++) { const y = Y0 - i * SP + drop_; o.position.set(X + Math.sin(i * .05) * .25 + Math.sin(t * 2.2 + i * .1) * .03, y, Z); o.rotation.set(0, i % 2 ? Math.PI / 2 : 0, Math.PI / 2 * 0); o.scale.set(1, 1.55, 1); o.updateMatrix(); im.setMatrixAt(i, o.matrix); im.setColorAt(i, col.copy(cold).lerp(hot, ss(cy - 2, cy + 4, y))); }
    im.instanceMatrix.needsUpdate = true; im.instanceColor.needsUpdate = true; };
}
export const SETS_CHAIN = {};
