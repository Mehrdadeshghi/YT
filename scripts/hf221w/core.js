// #221 world: shared kit. Everything is a pure function of the timeline time t (seeded hashes, no clocks): frames render out of order.
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
export { THREE };
export const EV = window.EV, DUR = window.EV_DUR;
export const W = 1080, H = 1920;
export const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v)), lerp = (a, b, u) => a + (b - a) * u;
export const ss = (a, b, x) => { const u = clamp((x - a) / (b - a)); return u * u * (3 - 2 * u); };
export const up = (t, t0, d) => clamp((t - t0) / d);
export const eo = (u) => 1 - (1 - u) ** 3, ei = (u) => u * u * u;
export const bk = (u, c = 1.9) => { const v = u - 1; return 1 + (c + 1) * v * v * v + c * v * v; };   // overshoot
export const hash = (n) => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
export const pop = (t, t0, d = .28) => t < t0 ? 0 : bk(up(t, t0, d));
// fall from height h to 0 over d seconds, one small bounce after
export function drop(t, t0, d, h, b = .1) { if (t < t0) return h; const u = (t - t0) / d; if (u < 1) return h * (1 - u * u); const v = (t - t0 - d) / (d * .7); return v < 1 ? h * b * 4 * v * (1 - v) : 0; }
// squash amount after an impact
export const sq = (t, t0, d = .3) => { const u = (t - t0) / d; return u <= 0 || u >= 1 ? 0 : Math.sin(u * Math.PI) * (1 - u); };

// ------------------------------------------------------------------ renderer + scene
const cv = document.getElementById('gl');
export const R = new THREE.WebGLRenderer({ canvas: cv, antialias: true, preserveDrawingBuffer: true });
R.setPixelRatio(1); R.setSize(W, H, false);
R.outputColorSpace = THREE.SRGBColorSpace; R.toneMapping = THREE.ACESFilmicToneMapping; R.toneMappingExposure = 1.0;
R.shadowMap.enabled = true; R.shadowMap.type = THREE.PCFSoftShadowMap;
export const scene = new THREE.Scene();
const pm = new THREE.PMREMGenerator(R); scene.environment = pm.fromScene(new RoomEnvironment(), .04).texture; pm.dispose();
export const cam = new THREE.PerspectiveCamera(50, W / H, .05, 400);
export const hemi = new THREE.HemisphereLight(0xffffff, 0x404060, 1); scene.add(hemi);
export const key = new THREE.DirectionalLight(0xffffff, 2.6); key.castShadow = true;
key.shadow.mapSize.set(1536, 1536); key.shadow.bias = -.0005; key.shadow.normalBias = .03; key.shadow.radius = 3;
Object.assign(key.shadow.camera, { left: -16, right: 16, top: 16, bottom: -16, near: 1, far: 80 });
scene.add(key, key.target);
export const pl1 = new THREE.PointLight(0xffffff, 0, 40, 1.6), pl2 = new THREE.PointLight(0xffffff, 0, 40, 1.6); scene.add(pl1, pl2);
scene.fog = new THREE.Fog(0x000000, 18, 90);
// full-frame sky: vertical gradient, follows the camera
const skyU = { a: { value: new THREE.Color() }, b: { value: new THREE.Color() } };
export const sky = new THREE.Mesh(new THREE.SphereGeometry(200, 24, 16), new THREE.ShaderMaterial({ side: THREE.BackSide, depthWrite: false, fog: false, uniforms: skyU, toneMapped: false,
  vertexShader: 'varying vec3 p; void main(){ p = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.); }',
  fragmentShader: 'varying vec3 p; uniform vec3 a,b; void main(){ float u = smoothstep(-.75,.75,p.y); gl_FragColor = vec4(mix(b,a,u),1.);\n#include <colorspace_fragment>\n }' }));
scene.add(sky);

// ------------------------------------------------------------------ builders
export const mat = (color, o = {}) => new THREE.MeshStandardMaterial({ color, roughness: o.r ?? .55, metalness: o.m ?? .05, emissive: o.e ?? 0, emissiveIntensity: o.ei ?? 1,
  transparent: o.a !== undefined, opacity: o.a ?? 1, depthWrite: o.dw ?? (o.a === undefined), side: o.side ?? THREE.FrontSide, envMapIntensity: o.env ?? .45 });
const gc = new Map();
const ggeo = (k, f) => { if (!gc.has(k)) gc.set(k, f()); return gc.get(k); };
export function add(parent, geo, m, x = 0, y = 0, z = 0, cast = true) { const o = new THREE.Mesh(geo, m); o.position.set(x, y, z); o.castShadow = cast; o.receiveShadow = true; parent.add(o); return o; }
export const rbox = (p, w, h, d, m, x, y, z, r = .06) => add(p, ggeo(`r${w},${h},${d},${r}`, () => new RoundedBoxGeometry(w, h, d, 3, Math.min(r, Math.min(w, h, d) * .49))), m, x, y, z);
export const cyl = (p, r0, r1, h, m, x, y, z, n = 32) => add(p, ggeo(`c${r0},${r1},${h},${n}`, () => new THREE.CylinderGeometry(r0, r1, h, n)), m, x, y, z);
export const sph = (p, r, m, x, y, z, n = 24) => add(p, ggeo(`s${r},${n}`, () => new THREE.SphereGeometry(r, n, Math.round(n * .7))), m, x, y, z);
export const tor = (p, r, t, m, x, y, z) => add(p, ggeo(`t${r},${t}`, () => new THREE.TorusGeometry(r, t, 14, 44)), m, x, y, z);
export const grp = (p, x = 0, y = 0, z = 0) => { const g = new THREE.Group(); g.position.set(x, y, z); p.add(g); return g; };

// text on a transparent plane (in-world labels)
export const FONT = '"AB"';
export function canvasTex(w, h, draw) { const c = document.createElement('canvas'); c.width = w; c.height = h; const x = c.getContext('2d'); draw(x, w, h);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t; }
export function label(p, text, o = {}) {
  const px = o.px ?? 96, c0 = document.createElement('canvas').getContext('2d'); c0.font = `${px}px ${FONT}`;
  const tw = Math.ceil(c0.measureText(text).width) + px, th = Math.ceil(px * 1.5);
  const tx = canvasTex(tw, th, (x, w, h) => { if (o.bg) { x.fillStyle = o.bg; x.beginPath(); x.roundRect(2, 2, w - 4, h - 4, px * .25); x.fill(); }
    x.font = `${px}px ${FONT}`; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillStyle = o.color ?? '#fff'; x.fillText(text, w / 2, h / 2 + px * .05); });
  const hh = o.h ?? .4, m = new THREE.Mesh(new THREE.PlaneGeometry(hh * tw / th, hh), new THREE.MeshBasicMaterial({ map: tx, transparent: true, depthWrite: false, toneMapped: false, fog: false, side: THREE.DoubleSide }));
  m.position.set(o.x ?? 0, o.y ?? 0, o.z ?? 0); p.add(m); return m;
}
const glowTex = canvasTex(128, 128, (x) => { const g = x.createRadialGradient(64, 64, 2, 64, 64, 64); g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(.25, 'rgba(255,255,255,.55)'); g.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = g; x.fillRect(0, 0, 128, 128); });
export function glow(p, color, s, x = 0, y = 0, z = 0, op = 1) { const m = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false, opacity: op, fog: false, toneMapped: false })); m.scale.setScalar(s); m.position.set(x, y, z); p.add(m); return m; }

// particle burst: seeded, closed-form; update(t) for its own time window
export class Burst {
  constructor(p, N, color, size, o = {}) { this.N = N; this.o = o; this.seed = o.seed ?? 1; const g = new THREE.BufferGeometry(); this.a = new Float32Array(N * 3); g.setAttribute('position', new THREE.BufferAttribute(this.a, 3));
    this.m = new THREE.PointsMaterial({ map: glowTex, color, size, transparent: true, depthWrite: false, blending: o.normal ? THREE.NormalBlending : THREE.AdditiveBlending, fog: false, toneMapped: false, sizeAttenuation: true });
    this.pts = new THREE.Points(g, this.m); this.pts.frustumCulled = false; p.add(this.pts); }
  update(t, t0, x = 0, y = 0, z = 0) { const o = this.o, life = o.life ?? .8, u = (t - t0) / life; this.pts.visible = u > 0 && u < 1; if (!this.pts.visible) return;
    const sp = o.speed ?? 3, gr = o.grav ?? 4, T = t - t0, dy = o.dy ?? .4;
    for (let i = 0; i < this.N; i++) { const a = hash(i + this.seed) * 6.283, c = hash(i * 1.7 + this.seed) * 2 - 1, r = sp * (.35 + .65 * hash(i * 2.3 + this.seed)), s = Math.sqrt(1 - c * c);
      this.a[i * 3] = x + Math.cos(a) * s * r * T; this.a[i * 3 + 1] = y + (c * .6 + dy) * r * T - gr * T * T; this.a[i * 3 + 2] = z + Math.sin(a) * s * r * T; }
    this.pts.geometry.attributes.position.needsUpdate = true; this.m.opacity = (1 - u) ** 1.3; }
}

// ------------------------------------------------------------------ coins
const COIN = { gold: ['#F5B73A', '$', '#9A5B08'], x: ['#62B0FF', 'X', '#0B3F8F'], s: ['#C9A2FF', 'S', '#5A28B8'], o: ['#FF8B7C', 'O', '#B52418'], b: ['#FFA63D', 'B', '#A44E00'], g: ['#7CFFD8', 'E', '#0D8A68'] };
const coinMats = {};
export function coinMat(k) { if (coinMats[k]) return coinMats[k]; const [c, l, d] = COIN[k];
  const tx = canvasTex(128, 128, (x) => { x.fillStyle = c; x.fillRect(0, 0, 128, 128); x.strokeStyle = d; x.lineWidth = 7; x.beginPath(); x.arc(64, 64, 52, 0, 7); x.stroke(); x.font = `66px ${FONT}`; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillStyle = d; x.fillText(l, 64, 68); });
  const k_ = k === 'g'; const face = new THREE.MeshStandardMaterial({ map: tx, metalness: .55, roughness: .3, envMapIntensity: 1.2, emissive: c, emissiveIntensity: k_ ? .9 : .28, emissiveMap: tx });
  const side = new THREE.MeshStandardMaterial({ color: c, metalness: .7, roughness: .28, envMapIntensity: 1.1, emissive: c, emissiveIntensity: k_ ? .9 : .22 });
  return (coinMats[k] = [side, face, face]); }
const unitCoin = new THREE.CylinderGeometry(1, 1, .22, 14);
export function coins(p, N, k = 'gold') { const im = new THREE.InstancedMesh(unitCoin, coinMat(k), N); im.frustumCulled = false; im.castShadow = false; p.add(im); return im; }
const D = new THREE.Object3D();
export function setI(im, i, x, y, z, rx, ry, rz, s) { D.position.set(x, y, z); D.rotation.set(rx, ry, rz); D.scale.setScalar(s); D.updateMatrix(); im.setMatrixAt(i, D.matrix); }
export function setIs(im, i, x, y, z, rx, ry, rz, sx, sy, sz) { D.position.set(x, y, z); D.rotation.set(rx, ry, rz); D.scale.set(sx, sy, sz); D.updateMatrix(); im.setMatrixAt(i, D.matrix); }

// coins flowing along a curve; head = first coin leaves the start at t0, tail = last coin leaves at t1
export class Stream {
  constructor(p, curve, N, k, o = {}) { this.c = curve; this.N = N; this.o = o; this.pts = curve.getSpacedPoints(300); this.L = curve.getLength(); this.im = coins(p, N, k); this.sp = o.speed ?? 12; this.rad = o.rad ?? .3; this.size = o.size ?? .16; this.seed = o.seed ?? 3; }
  update(t, t0, t1 = 1e9) { const { N, L, pts, sp, rad, size, seed } = this, head = (t - t0) * sp, tail = Math.max(0, (t - t1) * sp), n = pts.length - 1;
    for (let i = 0; i < N; i++) { const a = ((i / N) * L + Math.max(0, head)) % L, vis = a <= head && a >= tail && head > 0;
      if (!vis) { setI(this.im, i, 0, -1e4, 0, 0, 0, 0, 0); continue; }
      const u = a / L * n, j = Math.min(n - 1, Math.floor(u)), f = u - j, A = pts[j], B = pts[j + 1], ha = hash(i + seed) * 6.283, hr = Math.sqrt(hash(i * 3.1 + seed)) * rad, sp2 = t * (3 + 5 * hash(i * .7 + seed));
      setI(this.im, i, lerp(A.x, B.x, f) + Math.cos(ha) * hr, lerp(A.y, B.y, f) + Math.sin(ha) * hr * .7, lerp(A.z, B.z, f) + Math.sin(ha) * hr, sp2, hash(i) * 6, sp2 * .7, size * (.8 + .4 * hash(i * 5.3))); }
    this.im.instanceMatrix.needsUpdate = true; }
}
export const curve = (pts, tension = .5) => new THREE.CatmullRomCurve3(pts.map((a) => new THREE.Vector3(...a)), false, 'catmullrom', tension);
export function pipe(p, c, r, m, seg = 120) { return add(p, new THREE.TubeGeometry(c, seg, r, 20), m, 0, 0, 0, false); }

// ------------------------------------------------------------------ little people
const skin = mat(0xF2C9A5, { r: .5 });
export function pawn(p, color, x = 0, y = 0, z = 0, s = 1) { const g = grp(p, x, y, z); g.scale.setScalar(s); const m = mat(color, { r: .45 });
  const body = add(g, ggeo('pb', () => new THREE.CapsuleGeometry(.26, .42, 6, 18)), m, 0, .52, 0); const head = sph(g, .23, skin, 0, 1.18, 0);
  const eye = mat(0x1a1a22, { r: .3 }); sph(g, .032, eye, -.08, 1.2, .205, 10); sph(g, .032, eye, .08, 1.2, .205, 10); g.body = body; g.bm = m; g.head = head; return g; }

// ------------------------------------------------------------------ canvas screens (redrawn per frame while visible)
export class Scr { constructor(w, h) { this.c = document.createElement('canvas'); this.c.width = w; this.c.height = h; this.x = this.c.getContext('2d'); this.t = new THREE.CanvasTexture(this.c); this.t.colorSpace = THREE.SRGBColorSpace; this.t.anisotropy = 4; this.w = w; this.h = h; }
  mat() { return new THREE.MeshBasicMaterial({ map: this.t, toneMapped: false, fog: false }); } }
export function bust(x, cx, cy, s, body, opts = {}) { // friendly talking head on a call
  x.fillStyle = body; x.beginPath(); x.ellipse(cx, cy + s * 1.35, s * 1.15, s * .95, 0, Math.PI, 0); x.fill();
  if (opts.noHead) return; x.fillStyle = opts.skin ?? '#F2C9A5'; x.beginPath(); x.arc(cx, cy, s * .62, 0, 7); x.fill();
  x.fillStyle = '#1b1b24'; const b = opts.blink ? .12 : 1; for (const d of [-1, 1]) { x.beginPath(); x.ellipse(cx + d * s * .24, cy - s * .08, s * .07, s * .09 * b, 0, 0, 7); x.fill(); }
  x.strokeStyle = '#1b1b24'; x.lineWidth = s * .055; x.lineCap = 'round'; x.beginPath(); x.arc(cx, cy + s * .1, s * .28, .35, Math.PI - .35); x.stroke(); }

// ------------------------------------------------------------------ desks (the floating office islands)
const wood = mat(0xE2A15F, { r: .6 }), woodD = mat(0xB5763E, { r: .7 }), steel = mat(0xDDE3EA, { r: .32, m: .55 }), keyb = mat(0x2B3140, { r: .6 }), pot = mat(0xE86A4A, { r: .6 }), leaf = mat(0x3FB66B, { r: .6 }), mug = mat(0xF4F0E6, { r: .35 }), bk1 = mat(0x3D7BD9, { r: .6 }), bk2 = mat(0xE9C24B, { r: .6 });
const plankTx = canvasTex(1024, 1024, (x) => { x.fillStyle = '#C98A4B'; x.fillRect(0, 0, 1024, 1024); for (let i = 0; i < 9; i++) { const y = i * 114; x.fillStyle = `hsl(${28 + hash(i) * 6},${50 + hash(i * 2) * 12}%,${44 + hash(i * 3) * 12}%)`; x.fillRect(0, y, 1024, 112); for (let j = 0; j < 26; j++) { x.strokeStyle = `rgba(90,50,20,${.08 + hash(j + i) * .16})`; x.lineWidth = 1 + hash(j) * 2; x.beginPath(); const yy = y + hash(j * 3 + i) * 110; x.moveTo(0, yy); x.bezierCurveTo(300, yy + 8 * hash(j), 700, yy - 8 * hash(j + 1), 1024, yy); x.stroke(); } x.fillStyle = 'rgba(60,30,10,.55)'; x.fillRect(0, y + 110, 1024, 4); } });
const deskTop = new THREE.MeshStandardMaterial({ map: plankTx, roughness: .5, envMapIntensity: .5 });
const notes = [0xFFE066, 0xFF8FAB, 0x8FD3FF], pen = mat(0xE5383B, { r: .3 }), pen2 = mat(0x3D7BD9, { r: .3 }), matM = mat(0x263248, { r: .8 }), phoneM = mat(0x1B1F2B, { r: .25, m: .4 }), phS = mat(0x3D7BD9, { e: 0x2F6FD0, ei: .9, r: .2 });
export function deskIsland(p) { const g = grp(p);
  add(g, new THREE.BoxGeometry(16, .5, 14), [woodD, woodD, deskTop, woodD, woodD, woodD], 0, -.25, 0);
  rbox(g, 5.2, .03, 3.5, matM, 0, .015, .35, .02);                 // desk mat under the laptop
  // foreground clutter: fills the bottom of the frame
  rbox(g, .85, .05, 1.65, phoneM, -1.9, .03, 3.5, .03).rotation.y = .35; rbox(g, .7, .01, 1.4, phS, -1.9, .06, 3.5, .005).rotation.y = .35;
  for (let i = 0; i < 3; i++) { const q = rbox(g, .85, .02, .85, mat(notes[i], { r: .7 }), 1.7 + i * .12, .012 + i * .022, 3.7 + i * .08, .005); q.rotation.y = -.25 + i * .22; }
  for (const [x, z, r, m] of [[.2, 4.4, .55, pen], [.45, 4.75, .2, pen2]]) { const q = cyl(g, .045, .045, 1.5, m, x, .05, z, 10); q.rotation.set(0, r, Math.PI / 2); }
 rbox(g, 15, 1.1, 13, woodD, 0, -1, 0, .3);
  // desk clutter: mug, plant, books, far enough from the laptop
  cyl(g, .3, .28, .55, mug, -3.1, .27, 1.7); tor(g, .16, .05, mug, -3.42, .27, 1.7);
  cyl(g, .42, .3, .6, pot, 3.2, .3, -.3); for (let i = 0; i < 7; i++) { const l = sph(g, .34, leaf, 3.2 + Math.cos(i * 2.4) * .34, 1 + hash(i) * .6, -.3 + Math.sin(i * 2.4) * .34, 12); l.scale.set(1, 1.5, .5); l.rotation.set(hash(i + 3) - .5, i, hash(i + 5) - .5); }
  rbox(g, 1.5, .22, 1.1, bk1, -3, .11, -.6, .04); rbox(g, 1.3, .2, 1, bk2, -2.95, .32, -.62, .04);
  return g; }
export function laptop(p, scr, o = {}) { const g = grp(p, o.x ?? 0, 0, o.z ?? 0), body = o.m ?? steel;
  rbox(g, 3.5, .13, 2.4, body, 0, .065, 0, .05); rbox(g, 3.1, .02, 1.25, keyb, 0, .135, -.25, .01); rbox(g, .9, .015, .5, keyb, 0, .135, .75, .01);
  const lid = grp(g, 0, .12, -1.18); lid.rotation.x = -.2; rbox(lid, 3.5, 2.3, .08, body, 0, 1.15, 0, .035);
  g.screen = add(lid, new THREE.PlaneGeometry(3.28, 2.08), scr.mat(), 0, 1.15, .045, false); g.lid = lid; return g; }

// ------------------------------------------------------------------ the arcade claw (June: lifts the laptop; Oct 29: lowers the container)
export function claw(p) { const g = grp(p), m = mat(0xF2B632, { r: .35, m: .5 }), dark = mat(0x333845, { r: .4, m: .6 });
  cyl(g, .13, .13, 30, dark, 0, 15.3, 0, 14); rbox(g, 1, .55, 1, m, 0, .3, 0, .14); g.f = [];
  for (const d of [-1, 1]) { const h = grp(g, d * .42, .05, 0); rbox(h, .16, .85, .34, m, 0, -.4, 0, .06); const q = rbox(h, .16, .4, .34, m, -d * .12, -.92, 0, .06); q.rotation.z = -d * .55; g.f.push(h); }
  g.grip = (u) => { g.f[0].rotation.z = lerp(-.55, .1, u); g.f[1].rotation.z = lerp(.55, -.1, u); }; return g; }

export const SETS = [], CAM = [], ZONES = [], SHAKE = [];
export function set(g, t0, t1, update) { SETS.push({ g, t0, t1, update }); }
