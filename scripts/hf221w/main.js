// #221 world entry: builds every set once, then renders any t on demand (window.__render, called from the hf-seek bridge in index.html).
import { THREE, EV, DUR, W, H, R, scene, cam, hemi, key, sky, clamp, lerp, ss, up, eo, ei, bk, hash, grp, mat, SETS, CAM, ZONES, SHAKE, canvasTex } from './core.js';
export function start() {
CAM.sort((a, b) => a.t - b.t); ZONES.sort((a, b) => a.t - b.t);
// cubic Hermite through time-stamped keys with finite-difference tangents: the camera never stops, never cuts
const hermite = (t, get) => { const n = CAM.length; let i = 0; while (i < n - 2 && t > CAM[i + 1].t) i++; const a = CAM[i], b = CAM[i + 1], u = clamp((t - a.t) / Math.max(.001, b.t - a.t)), o = [0, 0, 0];
  const tan = (j) => { const A = CAM[Math.max(0, j - 1)], B = CAM[Math.min(n - 1, j + 1)]; return get(B).map((v, k) => (v - get(A)[k]) / Math.max(.001, B.t - A.t)); }, ta = tan(i), tb = tan(i + 1), d = b.t - a.t, pa = get(a), pb = get(b);
  const h00 = 2 * u ** 3 - 3 * u ** 2 + 1, h10 = u ** 3 - 2 * u ** 2 + u, h01 = -2 * u ** 3 + 3 * u ** 2, h11 = u ** 3 - u ** 2; for (let k = 0; k < 3; k++) o[k] = h00 * pa[k] + h10 * d * ta[k] + h01 * pb[k] + h11 * d * tb[k]; return o; };
const ca = new THREE.Color(), cb = new THREE.Color();
const css = (c) => new THREE.Color(c);
function zones(t) { let i = 0; while (i < ZONES.length - 1 && t >= ZONES[i + 1].t) i++; const A = ZONES[i], B = ZONES[Math.min(i + 1, ZONES.length - 1)], u = A === B ? 1 : ss(0, 1, (t - A.t) / Math.min(.7, B.t - A.t) - ((B.t - A.t) / Math.min(.7, B.t - A.t) - 1));
  sky.material.uniforms.a.value.copy(css(A.a)).lerp(css(B.a), u); sky.material.uniforms.b.value.copy(css(A.b)).lerp(css(B.b), u);
  scene.fog.color.copy(sky.material.uniforms.a.value).lerp(sky.material.uniforms.b.value, .5); scene.fog.near = lerp(A.f0, B.f0, u); scene.fog.far = lerp(A.f1, B.f1, u);
  hemi.intensity = lerp(A.hemi, B.hemi, u); hemi.groundColor.copy(css(A.gnd)).lerp(css(B.gnd), u); key.color.copy(css(A.key)).lerp(css(B.key), u); key.intensity = lerp(A.ki, B.ki, u); }
// far blocks: a silhouette city around the shaft, tinted by the fog; they rise past the camera on every drop
(() => { const n = 340, im = new THREE.InstancedMesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial({ color: 0x4A5A78, roughness: .8, envMapIntensity: .1 }), n), o = new THREE.Object3D(); im.frustumCulled = false;
  for (let i = 0; i < n; i++) { const y = 15 - hash(i * 1.1) * 300, ax = y > -118 ? 0 : -44, sd = hash(i * 1.7) > .5 ? 1 : -1; o.position.set(sd * (7 + hash(i * 2.3) * 46), y, ax - 16 - hash(i * 3.1) * 46); o.scale.set(2 + hash(i * 4.3) * 9, 1 + hash(i * 5.7) * 13, 2 + hash(i * 6.1) * 9); o.updateMatrix(); im.setMatrixAt(i, o.matrix); } scene.add(im); })();
// motes: parallax dust around the camera, so depth shows even in a slow move
const motes = (() => { const n = 260, a = new Float32Array(n * 3), g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(a, 3)); const tx = canvasTex(32, 32, (x) => { const q = x.createRadialGradient(16, 16, 1, 16, 16, 16); q.addColorStop(0, 'rgba(255,255,255,.9)'); q.addColorStop(1, 'rgba(255,255,255,0)'); x.fillStyle = q; x.fillRect(0, 0, 32, 32); }); const m = new THREE.Points(g, new THREE.PointsMaterial({ map: tx, size: .1, transparent: true, depthWrite: false, opacity: .65, blending: THREE.AdditiveBlending, fog: false, color: 0xFFF2DC })); m.frustumCulled = false; scene.add(m); return { a, g, n }; })();
const SZ = 26;
function updMotes(t) { const { a, g, n } = motes; const mod = (v, c) => { const s = SZ * 2, r = (v - c + SZ) % s; return (r < 0 ? r + s : r) - SZ + c; }; for (let i = 0; i < n; i++) { a[i * 3] = mod(hash(i) * 200 + Math.sin(t * .4 + i) * .4, cam.position.x); a[i * 3 + 1] = mod(hash(i * 2) * 200 + t * .25, cam.position.y); a[i * 3 + 2] = mod(hash(i * 3) * 200, cam.position.z); } g.attributes.position.needsUpdate = true; }

window.__render = (t) => {
  for (const s of SETS) { s.g.visible = t >= s.t0 && t <= s.t1; }
  for (const s of SETS) if (s.g.visible) s.update(t);
  zones(t);
  const p = hermite(t, (k) => k.p), l = hermite(t, (k) => k.l);
  let sx = 0, sy = 0; for (const [t0, a, d] of SHAKE) { const u = (t - t0) / d; if (u > 0 && u < 1) { const f = Math.floor(t * 30), e = a * (1 - u) ** 2; sx += (hash(f * 1.3 + t0) - .5) * e * 2; sy += (hash(f * 2.1 + t0) - .5) * e * 2; } }
  cam.position.set(p[0] + sx, p[1] + sy, p[2]); cam.lookAt(l[0] + sx * .6, l[1] + sy * .6, l[2]);
  sky.position.copy(cam.position);
  key.position.set(l[0] - 9, l[1] + 16, l[2] + 12); key.target.position.set(l[0], l[1], l[2]); key.target.updateMatrixWorld();
  updMotes(t);
  window.__chain?.update?.(t, cam.position.y);
  window.__overlay?.(t);
  R.render(scene, cam);
};
window.__render(window.__lastT || 0);   // a seek to 0 may have fired before the world existed: frame 0 must not stay black
window.__hfReady?.();
}
