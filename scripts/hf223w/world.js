// #223 world: real-photo environment (Poly Haven "Decor Shop" by Sergej Majboroda, CC0) + modelled objects, same offline accumulation renderer as #222.
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
const q = new URLSearchParams(location.search);
const W = +(q.get('w') || 540), H = +(q.get('h') || 960), N = +(q.get('n') || 12), ROT = +(q.get('rot') || 2.3);
const cv = document.getElementById('gl'), ov = document.getElementById('ov'); ov.width = 1080; ov.height = 1920;
for (const c of [cv, ov]) { c.style.width = W + 'px'; c.style.height = H + 'px'; }
const R = new THREE.WebGLRenderer({ canvas: cv, antialias: false, preserveDrawingBuffer: true });
R.setSize(W, H, false); R.shadowMap.enabled = true; R.shadowMap.type = THREE.PCFSoftShadowMap; R.outputColorSpace = THREE.LinearSRGBColorSpace; R.toneMapping = THREE.NoToneMapping;
const scene = new THREE.Scene(), cam = new THREE.PerspectiveCamera(38, W / H, .02, 500);
let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
const halton = (i, b) => { let f = 1, r = 0; while (i > 0) { f /= b; r += f * (i % b); i = Math.floor(i / b); } return r; };
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x)), ss = (a, b, x) => { const u = clamp((x - a) / (b - a)); return u * u * (3 - 2 * u); };
const std = (color, rough = .6, metal = 0, extra = {}) => new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: metal, ...extra });

// ---- environment: Radiance .hdr parser (adaptive RLE) for the light, 6K photo for what the camera sees ----
async function loadHDR(url) {
  const b = new Uint8Array(await (await fetch(url)).arrayBuffer()); let p = 0, line = () => { let s = ''; while (b[p] !== 10) s += String.fromCharCode(b[p++]); p++; return s; };
  let l; do { l = line(); } while (l !== ''); const m = /-Y (\d+) \+X (\d+)/.exec(line()), h = +m[1], w = +m[2], out = new Float32Array(w * h * 4), row = new Uint8Array(w * 4);
  for (let y = 0; y < h; y++) { p += 4; for (let c = 0; c < 4; c++) { let x = 0; while (x < w) { let n = b[p++]; if (n > 128) { n -= 128; const v = b[p++]; while (n--) row[c * w + x++] = v; } else while (n--) row[c * w + x++] = b[p++]; } }
    for (let x = 0; x < w; x++) { const e = row[3 * w + x], f = e ? Math.pow(2, e - 136) : 0, i = (y * w + x) * 4; out[i] = row[x] * f; out[i + 1] = row[w + x] * f; out[i + 2] = row[2 * w + x] * f; out[i + 3] = 1; } }
  const t = new THREE.DataTexture(out, w, h, THREE.RGBAFormat, THREE.FloatType); t.mapping = THREE.EquirectangularReflectionMapping; t.flipY = true; t.needsUpdate = true; t.minFilter = t.magFilter = THREE.LinearFilter; t.colorSpace = THREE.LinearSRGBColorSpace; return t;
}
const ROT_ = 0; const hdr = await loadHDR('assets/decor_shop_2k.hdr');
const pm = new THREE.PMREMGenerator(R);
{ const es = new THREE.Scene(); es.background = hdr; es.backgroundRotation = new THREE.Euler(0, ROT, 0); const rt = pm.fromEquirectangular(hdr); scene.environment = rt.texture; }
const photo = await new THREE.TextureLoader().loadAsync('assets/decor_shop.jpg'); photo.colorSpace = THREE.SRGBColorSpace; photo.minFilter = THREE.LinearMipmapLinearFilter; photo.anisotropy = 16; photo.wrapS = THREE.RepeatWrapping;
const envU = { t: { value: photo }, rot: { value: ROT }, gain: { value: 1.25 }, capH: { value: 1.45 } };
const envFrag = `varying vec3 wp;uniform sampler2D t;uniform float rot,gain,capH;
vec3 samp(vec3 d){float a=atan(d.x,-d.z)+rot;float e=asin(clamp(d.y,-1.,1.));vec2 uv=vec2(a/6.28318+.5,e/3.14159+.5);return texture2D(t,uv).rgb*gain;}
void main(){vec3 o=vec3(0.,capH,0.);gl_FragColor=vec4(samp(normalize(wp-o)),FA);}`;
const envVert = 'varying vec3 wp;void main(){vec4 w=modelMatrix*vec4(position,1.);wp=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;}';
const dome = new THREE.Mesh(new THREE.SphereGeometry(120, 64, 32), new THREE.ShaderMaterial({ side: THREE.BackSide, depthWrite: false, uniforms: envU, vertexShader: envVert, fragmentShader: envFrag.replace('FA', '1.') })); dome.renderOrder = -2; scene.add(dome);
// the photo's own floor, projected on a real plane: objects stand on it, cast shadows and reflect in it
const floor = new THREE.Mesh(new THREE.CircleGeometry(60, 64), new THREE.ShaderMaterial({ transparent: true, depthWrite: true, uniforms: envU, vertexShader: envVert, fragmentShader: envFrag.replace('FA', '.84') })); floor.rotation.x = -Math.PI / 2; floor.renderOrder = -1; scene.add(floor);
const shadow = new THREE.Mesh(new THREE.CircleGeometry(60, 64), new THREE.ShadowMaterial({ opacity: .62, color: 0x1a120c })); shadow.rotation.x = -Math.PI / 2; shadow.position.y = .001; shadow.receiveShadow = true; shadow.renderOrder = 1; scene.add(shadow);
const key = new THREE.DirectionalLight('#fff0dc', 2.4), fill = new THREE.DirectionalLight('#ffe9cf', .9);
for (const l of [key, fill]) { l.castShadow = true; l.shadow.mapSize.set(2048, 2048); l.shadow.bias = -.0003; l.shadow.normalBias = .006; scene.add(l, l.target); }

const stuff = new THREE.Group(); scene.add(stuff);
const add = (g, m, x = 0, y = 0, z = 0, par = stuff) => { const o = new THREE.Mesh(g, m); o.position.set(x, y, z); o.castShadow = o.receiveShadow = true; par.add(o); return o; };
const tube = (a, b, r, m, par) => { const A = new THREE.Vector3(...a), B = new THREE.Vector3(...b), d = B.clone().sub(A), o = add(new THREE.CylinderGeometry(r, r, d.length(), 10), m, 0, 0, 0, par); o.position.copy(A).addScaledVector(d, .5); o.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize()); return o; };

// ---- store security gates: clear acrylic panel, aluminium frame, coil antenna inside, status light on top ----
const alu = std('#c8ccd0', .32, .95), blackPl = std('#141518', .55), copper = std('#b4693a', .35, 1), acryl = new THREE.MeshPhysicalMaterial({ color: '#eef6f8', roughness: .06, metalness: 0, transparent: true, opacity: .2, envMapIntensity: 1.6, side: THREE.DoubleSide, depthWrite: false, clearcoat: 1 });
const lampM = [];
function gate(x, flip) {
  const G = new THREE.Group(); G.position.set(x, 0, 0); stuff.add(G); const Pw = .46, Ph = 1.5, y0 = .1;
  add(new RoundedBoxGeometry(Pw + .1, .1, .17, 4, .025), std('#2b2d31', .4, .6), 0, .05, 0, G);
  const pan = add(new RoundedBoxGeometry(.03, Ph, Pw, 3, .012), acryl, 0, y0 + Ph / 2, 0, G); pan.castShadow = false; pan.rotation.y = Math.PI * 0; G.rotation.y = 0;
  for (const s of [-1, 1]) add(new RoundedBoxGeometry(.05, Ph + .03, .036, 3, .012), alu, 0, y0 + Ph / 2, s * (Pw / 2 + .012), G);
  add(new RoundedBoxGeometry(.05, .04, Pw + .06, 3, .012), alu, 0, y0 + Ph + .012, 0, G);
  // antenna coil: wound copper wire loops inside the panel
  const pts = [], lw = Pw - .1, lh = Ph - .2, rc = .05; const curve = new THREE.CurvePath(); const P = (z, y) => new THREE.Vector3(0, y, z);
  const rect = (dz, dy) => { const c = new THREE.CatmullRomCurve3([P(-dz, -dy), P(dz, -dy), P(dz, dy), P(-dz, dy)], true, 'catmullrom', .04); return c; };
  for (let i = 0; i < 4; i++) { const m = new THREE.Mesh(new THREE.TubeGeometry(rect(lw / 2 - i * .006, lh / 2 - i * .006), 200, .0042, 6, true), copper); m.position.set((i - 1.5) * .0085, y0 + Ph / 2, 0); m.castShadow = true; G.add(m); }
  const led = new THREE.MeshStandardMaterial({ color: '#111', emissive: '#ff1a10', emissiveIntensity: 0, roughness: .3 }); lampM.push(led); add(new RoundedBoxGeometry(.055, .018, Pw - .06, 2, .007), led, 0, y0 + Ph + .04, 0, G);
  const logo = add(new RoundedBoxGeometry(.012, .1, .28, 2, .005), std('#d8dadd', .45), flip * .02, .35, 0, G);
  return G;
}
const gates = [gate(-.72, 1), gate(.72, -1)];

// ---- shopping cart: wire basket ----
const cart = new THREE.Group(); stuff.add(cart); const chrome = std('#d6d9dc', .16, 1), pad = std('#20242b', .5), rubber = std('#17181a', .8);
{ const Lz = .86, Wd = .52, Hb = .46, yB = .58, top = yB + Hb, flare = .05, Tc = .012;
  const cross = (a, b, r = .0032) => tube(a, b, r, chrome, cart);
  for (let i = 0; i <= 18; i++) { const u = i / 18, z = -Lz / 2 + u * Lz; cross([-Wd / 2, yB, z], [-Wd / 2 - flare, top, z]); cross([Wd / 2, yB, z], [Wd / 2 + flare, top, z]); cross([-Wd / 2, yB, z], [Wd / 2, yB, z]); }
  for (let i = 0; i <= 10; i++) { const u = i / 10, x = -Wd / 2 + u * Wd, xt = -Wd / 2 - flare + u * (Wd + 2 * flare); for (const z of [-Lz / 2, Lz / 2]) cross([x, yB, z], [xt, top, z]); cross([x, yB, -Lz / 2], [x, yB, Lz / 2]); }
  for (let h = 0; h <= 6; h++) { const y = yB + (h / 6) * Hb, f = flare * h / 6, r = h === 6 || h === 0 ? .0075 : .0032; for (const z of [-Lz / 2, Lz / 2]) cross([-Wd / 2 - f, y, z], [Wd / 2 + f, y, z], r); for (const s of [-1, 1]) cross([s * (Wd / 2 + f), y, -Lz / 2], [s * (Wd / 2 + f), y, Lz / 2], r); }
  // frame, handle, castors
  for (const s of [-1, 1]) { tube([s * .22, .15, .42], [s * .25, yB - .02, .4], .012, chrome, cart); tube([s * .16, .15, -.42], [s * .24, yB - .02, -.4], .012, chrome, cart); tube([s * .22, .15, .42], [s * .16, .15, -.42], .012, chrome, cart); tube([s * .28, top + .02, -.43], [s * .26, top + .17, -.58], .011, chrome, cart); }
  tube([-.28, .15, .3], [.28, .15, .3], .01, chrome, cart); tube([-.2, .15, -.3], [.2, .15, -.3], .01, chrome, cart);
  const hn = tube([-.28, top + .17, -.58], [.28, top + .17, -.58], .018, pad, cart);
  const tyre = new THREE.CylinderGeometry(.055, .055, .03, 24); tyre.rotateZ(Math.PI / 2);
  for (const [x, z] of [[-.23, .4], [.23, .4], [-.17, -.4], [.17, -.4]]) { add(tyre, rubber, x, .055, z, cart); add(new RoundedBoxGeometry(.042, .1, .05, 2, .008), chrome, x, .11, z, cart); }
}
// shoe box with the tag; the printed side is plain, no brand
const boxT = (() => { const c = document.createElement('canvas'); c.width = 1024; c.height = 512; const g = c.getContext('2d'); g.fillStyle = '#2d4f6f'; g.fillRect(0, 0, 1024, 512); g.fillStyle = '#ffffff22'; for (let i = 0; i < 6000; i++) g.fillRect(Math.random() * 1024, Math.random() * 512, 1, 1); g.fillStyle = '#e8e4d9'; g.fillRect(0, 410, 1024, 102); g.fillStyle = '#23272d'; g.font = '700 46px Inter'; g.fillText('MEN’S TRAIL · SIZE 10', 40, 478); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t; })();
const lidT = (() => { const c = document.createElement('canvas'); c.width = c.height = 1024; const g = c.getContext('2d'); g.fillStyle = '#2f5473'; g.fillRect(0, 0, 1024, 1024); for (let i = 0; i < 90000; i++) { const v = Math.random(); g.fillStyle = v > .5 ? 'rgba(255,255,255,.035)' : 'rgba(0,0,0,.05)'; g.fillRect(Math.random() * 1024, Math.random() * 1024, 1 + Math.random() * 7, 1); } g.strokeStyle = 'rgba(232,228,217,.55)'; g.lineWidth = 7; g.strokeRect(46, 46, 932, 932); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 16; return t; })();
const lidM = new THREE.MeshStandardMaterial({ map: lidT, roughness: .68 });
const box = add(new RoundedBoxGeometry(.34, .13, .2, 3, .006), [std('#2d4f6f', .62), std('#2d4f6f', .62), lidM, std('#233d56', .6), new THREE.MeshStandardMaterial({ map: boxT, roughness: .6 }), std('#2d4f6f', .62)], .02, .665, .1, cart); box.rotation.y = -.25;
const box2 = add(new RoundedBoxGeometry(.3, .2, .24, 3, .008), std('#9a7b56', .9), -.05, .7, -.2, cart); box2.rotation.y = .3;
// acousto-magnetic label: a thin ridged white plastic case on the box lid (45 × 10 mm)
const tag = new THREE.Group(); box.add(tag); tag.position.set(0.06, .068, 0.02); tag.rotation.y = .1;

// the label, opened: tray, lifting lid, loose vibrating metal strip, magnet strip below
const stripM = std('#d8dde2', .22, 1), magnetM = new THREE.MeshStandardMaterial({ color: '#4a4f57', roughness: .42, metalness: .75, emissive: '#ff5a1a', emissiveIntensity: 0 });
function makeTag(par) {
  const g = new THREE.Group(); par.add(g);
  add(new RoundedBoxGeometry(.045, .0012, .0105, 3, .0004), std('#f3f1ea', .42), 0, -.0006, 0, g);
  const lid = add(new RoundedBoxGeometry(.045, .0014, .0105, 3, .0005), new THREE.MeshStandardMaterial({ color: '#f5f3ec', roughness: .42, transparent: true, opacity: 1 }), 0, .0022, 0, g);
  const mag = add(new RoundedBoxGeometry(.036, .0006, .0066, 2, .0002), magnetM.clone(), 0, .0002, 0, g); mag.castShadow = false;
  const sg = new THREE.PlaneGeometry(.037, .0062, 48, 1); sg.rotateX(-Math.PI / 2); const strip = new THREE.Mesh(sg, stripM); strip.position.y = .0012; strip.castShadow = true; strip.receiveShadow = true; g.add(strip);
  const P0 = sg.attributes.position.array.slice();
  return { g, lid, mag, strip, set(open, amp, t) { lid.position.y = .0022 + open * .012; lid.rotation.x = -open * .22; lid.material.opacity = 1 - open * .92; lid.visible = open < .995; const p = sg.attributes.position; for (let i = 0; i < p.count; i++) { const x = P0[i * 3], k = Math.cos(x / .037 * Math.PI); p.setY(i, P0[i * 3 + 1] + amp * .00085 * k * Math.sin(t * 58)); } p.needsUpdate = true; sg.computeVertexNormals(); } };
}
const tagA = makeTag(tag);
// checkout counter with a demagnetizing pad, and the same box on it
const counter = new THREE.Group(); counter.position.set(3.1, 0, -2.5); counter.rotation.y = -.55; stuff.add(counter);
add(new RoundedBoxGeometry(1.7, .88, .66, 4, .02), std('#d6d2c8', .55), 0, .44, 0, counter);
add(new RoundedBoxGeometry(1.8, .04, .72, 4, .012), std('#2a2b2e', .2, .1), 0, .9, 0, counter);
const padTop = add(new RoundedBoxGeometry(.42, .012, .32, 3, .005), std('#0d0e11', .08, .1), -.15, .926, .04, counter);
const padGlow = new THREE.MeshStandardMaterial({ color: '#0b1414', emissive: '#30ff9a', emissiveIntensity: .6, roughness: .3 }); add(new RoundedBoxGeometry(.39, .002, .012, 1, .0008), padGlow, -.15, .933, -.09, counter); add(new RoundedBoxGeometry(.39, .002, .012, 1, .0008), padGlow, -.15, .933, .17, counter);
const box3 = add(box.geometry, box.material, -.15, .998, .04, counter); box3.rotation.y = .12; const tag3 = new THREE.Group(); box3.add(tag3); tag3.position.copy(tag.position); tag3.rotation.y = .1; const tagB = makeTag(tag3);
// a shopper's bag in the second pass: a stray tag from another store
const bagM = std('#e9e2d2', .9); const bag = add(new RoundedBoxGeometry(.3, .27, .12, 4, .02), bagM, .03, .72, -.2, cart); bag.rotation.y = .18; bag.visible = false;
for (const s of [-1, 1]) { const h = add(new THREE.TorusGeometry(.06, .004, 8, 28, Math.PI), bagM, s * .07, .85, 0, bag); h.position.set(s * .07, .13, 0); }
const strayTagGroup = new THREE.Group(); bag.add(strayTagGroup); strayTagGroup.position.set(0, .06, .062); strayTagGroup.rotation.x = Math.PI / 2; const stray = add(new RoundedBoxGeometry(.05, .004, .012, 2, .001), std('#f4f2ea', .42), 0, 0, 0, strayTagGroup);

// mirrored copy under the floor = a real polished-tile reflection (floor is 84 % opaque)
const mirror = stuff.clone(); mirror.scale.y = -1; scene.add(mirror); mirror.traverse(o => { if (o.isMesh) { o.castShadow = false; o.receiveShadow = false; } });
const syncMirror = () => { mirror.children.forEach((c, i) => c.position.copy(stuff.children[i].position)); };

const clampRough = (m, v) => m;
scene.traverse(m => { if (m.material && m.material.isMeshStandardMaterial && m.material.envMapIntensity === 1) m.material.envMapIntensity = 1; });

// ======= film: everything timed on the spoken words (hf/223/ev.json from scripts/hf223.py) =======
const D = await (await fetch(q.get('ev') || '/hf/223/ev.json')).json(), EV = D.ev, END = D.dur;
const inPay = t => t > EV.p_pay - .4 && t < EV.f_miss - .35;
const secondPass = t => t >= EV.f_miss - .35;
const cartZ = t => { if (!secondPass(t)) return -.55 + .4 * ss(0, EV.o_ring, t) + .15 * ss(EV.o_ring, EV.l_alarm, t); return -2.4 + 2.5 * ss(EV.f_miss - .35, EV.f_beep - .1, t) + .5 * ss(EV.f_beep, END, t); };
// bursts: on for .3 s in every .55 s, from "bursts" until "stops"; the strip rings on after each
const burstOn = t => t > EV.b_burst - .1 && t < EV.l_stops && ((t - EV.b_burst) % .55 + .55) % .55 < .3;
const ampA = t => { const a = ss(EV.b_pitch - .9, EV.b_vib, t); if (t < EV.l_stops) return .35 + .65 * a * (t > EV.b_burst ? 1 : 0); return Math.max(.3, 1 - (t - EV.l_stops) * .05); };
const ampB = t => { const r = 1 - ss(EV.p_dem + .1, EV.p_tune + .15, t); return .9 * r; };
const alarmed = t => (t > .1 && t < 1.6) || (t > EV.l_alarm && t < EV.p_pay - .55) || (t > EV.f_beep && t < EV.e_beep + 1);
const flash = t => alarmed(t) && Math.sin(t * 15) > -.1;
const redFlash = () => 0;

const fieldT = (() => { const c = document.createElement('canvas'); c.width = 64; c.height = 256; const g = c.getContext('2d'); const r = g.createLinearGradient(0, 0, 0, 256); r.addColorStop(0, 'rgba(255,255,255,0)'); r.addColorStop(.5, 'rgba(255,255,255,1)'); r.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = r; g.fillRect(0, 0, 64, 256); return new THREE.CanvasTexture(c); })();
const field = Array.from({ length: 12 }, () => { const m = new THREE.Mesh(new THREE.PlaneGeometry(.9, 1.5), new THREE.MeshBasicMaterial({ map: fieldT, color: new THREE.Color(.45, 1.5, 3.2), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, opacity: 0, fog: false })); m.rotation.y = Math.PI / 2; m.position.y = .82; m.visible = false; scene.add(m); return m; });
const glowT = (() => { const c = document.createElement('canvas'); c.width = c.height = 128; const g = c.getContext('2d'), r = g.createRadialGradient(64, 64, 0, 64, 64, 64); r.addColorStop(0, 'rgba(255,255,255,1)'); r.addColorStop(.25, 'rgba(255,255,255,.55)'); r.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = r; g.fillRect(0, 0, 128, 128); return new THREE.CanvasTexture(c); })();
const spr = (c, s) => { const m = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowT, color: c, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false })); m.scale.setScalar(s); m.visible = false; scene.add(m); return m; };
const redGlow = [spr(new THREE.Color(5, .45, .25), 1.1), spr(new THREE.Color(5, .45, .25), 1.1)]; redGlow[0].position.set(-.72, 1.66, 0); redGlow[1].position.set(.72, 1.66, 0);
const signal = Array.from({ length: 14 }, () => spr(new THREE.Color(3.2, 1.8, .5), .035));
copper.emissive = new THREE.Color('#ff9a4a'); copper.emissiveIntensity = 0;
const ringGeo = new THREE.TorusGeometry(1, .03, 8, 72); const rings = Array.from({ length: 5 }, () => { const m = new THREE.Mesh(ringGeo, new THREE.MeshBasicMaterial({ color: new THREE.Color(3.2, 1.9, .7), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false })); m.rotation.x = Math.PI / 2; m.visible = false; scene.add(m); return m; });

const TA = () => { tag.updateWorldMatrix(true, false); return new THREE.Vector3().setFromMatrixPosition(tag.matrixWorld); };
const TB = () => { tag3.updateWorldMatrix(true, false); return new THREE.Vector3().setFromMatrixPosition(tag3.matrixWorld); };
const GATE = new THREE.Vector3(.72, .95, 0);
const CTR = new THREE.Vector3(2.75, 1.05, -2.4);
const KEY = (t, p, l, r) => [t, p, l, r];
const CK = [ // ref 0 world, 1 tag in the cart, 2 tag on the pad
 KEY(0, [2.15, 1.18, 1.65], [0, .85, -.15], 0), KEY(EV.o_listen, [1.8, 1.12, 1.4], [0, .83, -.15], 0), KEY(EV.o_ring, [1.15, 1.05, .85], [.02, .78, -.15], 0),
 KEY(EV.t_tag - .1, [.17, .19, .3], [0, 0, 0], 1), KEY(EV.t_strip, [.05, .055, .1], [0, 0, 0], 1), KEY(EV.t_vib, [.045, .05, .085], [.002, 0, 0], 1), KEY(EV.t_magnet, [-.04, .048, .082], [0, 0, 0], 1),
 KEY(EV.b_burst, [.15, .18, .3], [0, 0, 0], 1), KEY(EV.b_58 + .5, [.28, .3, .52], [-.06, -.02, 0], 1), KEY(EV.b_pitch, [.06, .07, .13], [0, 0, 0], 1), KEY(EV.b_fork, [.04, .046, .08], [0, 0, 0], 1),
 KEY(EV.l_trick, [.1, .11, .2], [0, 0, 0], 1), KEY(EV.l_stops, [.9, .55, .95], [.1, .05, 0], 1), KEY(EV.l_quiet, [1.05, .55, 1.1], [.1, .05, 0], 1), KEY(EV.l_ring, [.05, .055, .1], [0, 0, 0], 1),
 KEY(EV.l_sig, [.08, .08, .14], [.015, 0, 0], 1), KEY(EV.l_ant, [.42, 1.1, 1.0], [.72, .85, 0], 0), KEY(EV.l_pitch, [.44, 1.12, 1.15], [.72, .85, 0], 0), KEY(EV.l_alarm, [1.9, 1.15, 1.55], [0, .88, -.1], 0), KEY(EV.p_pay - .5, [1.9, 1.15, 1.55], [0, .88, -.1], 0),
 KEY(EV.p_pay + .15, [1.9, 1.5, -1.3], [2.72, .98, -2.32], 0), KEY(EV.p_check + .4, [2.1, 1.35, -1.75], [2.72, .98, -2.35], 0), KEY(EV.p_dem, [.1, .12, .19], [0, 0, 0], 2), KEY(EV.p_tune, [.055, .06, .1], [0, 0, 0], 2), KEY(EV.p_hear + .25, [.055, .06, .1], [0, 0, 0], 2),
 KEY(EV.f_miss - .35, [1.9, 1.2, 1.5], [0, .8, -.5], 0), KEY(EV.f_store, [1.7, 1.15, 1.35], [0, .82, -.2], 0), KEY(EV.f_beep, [1.55, 1.15, 1.25], [0, .88, 0], 0), KEY(END + .1, [2.1, 1.2, 1.7], [0, .9, .1], 0),
];
for (let i = 1; i < CK.length; i++) CK[i][0] = Math.max(CK[i][0], CK[i - 1][0] + .08);
const camAt = t => {
  const T1 = TA(), T2 = TB();
  const P = CK.map(k => { const o = k[3] === 1 ? T1 : k[3] === 2 ? T2 : null; const f = v => o ? new THREE.Vector3(v[0] + o.x, v[1] + o.y, v[2] + o.z) : new THREE.Vector3(...v); return { t: k[0], p: f(k[1]), l: f(k[2]) }; });
  let i = 0; while (i < P.length - 2 && t > P[i + 1].t) i++;
  const b = P[i], c = P[i + 1], h = c.t - b.t, u = clamp((t - b.t) / h), u2 = u * u, u3 = u2 * u, ax = ['x', 'y', 'z'];
  const slope = (j, f, a) => { const pv = P[j - 1], nx = P[j + 1]; if (!pv || !nx) return 0; const d0 = (f(P[j])[a] - f(pv)[a]) / (P[j].t - pv.t), d1 = (f(nx)[a] - f(P[j])[a]) / (nx.t - P[j].t); if (d0 * d1 <= 0) return 0; const h0 = P[j].t - pv.t, h1 = nx.t - P[j].t; return 3 * (h0 + h1) / ((2 * h1 + h0) / d0 + (h1 + 2 * h0) / d1); };
  const cr = f => { const o = new THREE.Vector3(); for (const a of ax) o[a] = (2 * u3 - 3 * u2 + 1) * f(b)[a] + (u3 - 2 * u2 + u) * h * slope(i, f, a) + (-2 * u3 + 3 * u2) * f(c)[a] + (u3 - u2) * h * slope(i + 1, f, a); return o; };
  return { p: cr(k => k.p), l: cr(k => k.l) };
};
function setWorld(t) {
  cart.position.set(0, 0, cartZ(t)); const pay = inPay(t), sec = secondPass(t); box.visible = !sec; box2.visible = !sec; bag.visible = sec; syncMirror(); cart.updateMatrixWorld(true);
  const on = flash(t); lampM.forEach(m => { m.emissive.set(on ? '#ff1a10' : '#29e07a'); m.emissiveIntensity = on ? 9 : alarmed(t) ? .6 : 1.4; }); redGlow.forEach(s => { s.visible = on; });
  tagA.set(ss(EV.t_tag, EV.t_strip, t), ampA(t), t); tagB.set(1, ampB(t), t);
  tagB.mag.material.emissiveIntensity = 3.5 * ss(EV.p_dem - .1, EV.p_dem + .1, t) * (1 - ss(EV.p_dem + .35, EV.p_dem + 1.1, t));
  padGlow.emissiveIntensity = .6 + 7 * ss(EV.p_dem - .1, EV.p_dem + .05, t) * (1 - ss(EV.p_dem + .3, EV.p_dem + .9, t));
  field.forEach((m, i) => { const ph = ((t * 2.3 + i / field.length) % 1), act = burstOn(t) ? 1 : 0; m.visible = act > 0; if (act) { m.position.x = -.72 + 1.44 * ph; m.position.z = 0; m.material.opacity = .055 * Math.sin(ph * Math.PI); } });
  const T = TA(); rings.forEach((m, i) => { const phase = (t * 1.6 + i / 5) % 1, onR = t > EV.l_ring - .1 && t < EV.l_ant + .4 && !sec; m.visible = onR; if (onR) { m.position.copy(T); m.position.y += .005; m.scale.setScalar(.012 + phase * .09); m.material.opacity = (1 - phase) ** 2 * .9; } });
  signal.forEach((s, i) => { const a = t > EV.l_sig - .1 && t < EV.l_pitch + .2 && !sec; s.visible = a; if (a) { const u = ((t - EV.l_sig) * .9 + i / signal.length) % 1; s.position.copy(T).lerp(GATE, u); s.position.y += Math.sin(u * Math.PI) * .18 + Math.sin(u * 40 - t * 12) * .012; const sc = .008 + .022 * u; s.scale.setScalar(sc); s.material.opacity = Math.sin(u * Math.PI) * .95; } });
  copper.emissiveIntensity = 5 * ss(EV.l_sig, EV.l_ant, t) * (1 - ss(EV.l_pitch + .25, EV.l_alarm + .1, t));
}

// ---- type: title, labels, caption, scope, end card ----
const o = ov.getContext('2d');
const LBL = [
 { from: EV.t_strip - .1, to: EV.t_magnet - .05, txt: 'METAL STRIP', sub: 'LOOSE ENOUGH TO VIBRATE', at: () => TA().add(new THREE.Vector3(.008, .0015, 0)) },
 { from: EV.t_magnet - .05, to: EV.b_burst - .2, txt: 'MAGNET', sub: 'SITS RIGHT BESIDE IT', at: () => TA().add(new THREE.Vector3(-.012, .0004, 0)) },
 { from: EV.l_ant - .25, to: EV.l_pitch + .1, txt: 'ANTENNA COIL', sub: 'HEARS THE TINY SIGNAL', at: () => new THREE.Vector3(.72, .5, .2) },
 { from: EV.p_pay + .1, to: EV.p_dem - .15, txt: 'CHECKOUT PAD', sub: 'DEMAGNETIZER', at: () => new THREE.Vector3(2.8, .93, -2.3) },
 { from: EV.p_dem + .35, to: EV.p_tune - .05, txt: 'MAGNET', sub: 'NOW DEMAGNETIZED', at: () => TB().add(new THREE.Vector3(-.012, .0004, 0)) },
 { from: EV.f_store - .1, to: EV.e_beep - .1, txt: 'TAG FROM ANOTHER STORE', sub: 'NOBODY DEACTIVATED IT', at: t => { strayTagGroup.updateWorldMatrix(true, false); return new THREE.Vector3().setFromMatrixPosition(strayTagGroup.matrixWorld); } },
];
const CAPS = D.caps.flat(), LINES = []; { let cur = []; for (const w of CAPS) { cur.push(w); if (cur.length >= 4 || /[.,?:]$/.test(w.w)) { LINES.push(cur); cur = []; } } if (cur.length) LINES.push(cur); }
const scopeOn = t => ss(EV.b_burst - .2, EV.b_burst + .05, t) * (1 - ss(EV.l_alarm - .05, EV.l_alarm + .15, t)) + ss(EV.p_tune - .05, EV.p_tune + .1, t) * (1 - ss(EV.f_miss - .55, EV.f_miss - .35, t));
const envAmp = t => t < EV.b_burst - .1 ? 0 : t < EV.p_tune - .1 ? (t < EV.l_stops ? (burstOn(t) ? 1 : .4 * Math.exp(-(((t - EV.b_burst) % .55) - .3) * 2.2)) : .4 * Math.exp(-(t - EV.l_stops) * .35)) : .012;
function drawScope(t, a) {
  const X = 90, Y = 300, Wd = 900, Hg = 210; o.globalAlpha = a; o.fillStyle = 'rgba(6,10,18,.74)'; o.beginPath(); o.roundRect(X, Y, Wd, Hg, 24); o.fill(); o.strokeStyle = 'rgba(255,255,255,.18)'; o.lineWidth = 2; o.stroke();
  const pay = t > EV.p_pay; const quiet = t > EV.l_stops, lab = pay ? 'OUT OF TUNE: NOTHING TO HEAR' : quiet ? 'GATE SILENT, STRIP STILL RINGING' : 'GATE BURST · 58,000 CYCLES/SEC';
  o.font = '500 28px Mono'; o.textAlign = 'left'; o.fillStyle = quiet && !pay ? '#ffc85a' : pay ? '#ffffff' : '#7fd3ff'; o.fillText(lab, X + 26, Y + 44);
  o.beginPath(); o.lineWidth = 3.4; const span = 1.3, cy = Y + 128; for (let i = 0; i <= 420; i++) { const f = i / 420, tt = t - span * (1 - f), A = envAmp(tt), v = Math.sin(tt * 92) * A * 62, x = X + 26 + f * (Wd - 52), y = cy - v; i ? o.lineTo(x, y) : o.moveTo(x, y); } o.strokeStyle = quiet && !pay ? '#ffc85a' : pay ? '#8c95a5' : '#7fd3ff'; o.stroke(); o.globalAlpha = 1;
}
function drawOverlay(t) {
  o.clearRect(0, 0, 1080, 1920); o.textBaseline = 'alphabetic'; o.shadowBlur = 0;
  const rd = alarmed(t) && flash(t) ? 1 : 0; if (rd) { const g = o.createRadialGradient(540, 960, 500, 540, 960, 1150); g.addColorStop(0, 'rgba(255,20,10,0)'); g.addColorStop(1, 'rgba(255,20,10,.16)'); o.fillStyle = g; o.fillRect(0, 0, 1080, 1920); }
  o.font = '500 21px Mono'; o.fillStyle = 'rgba(255,255,255,.78)'; o.textAlign = 'right'; o.fillText('ILLUSTRATION · ONE COMMON TYPE OF GATE', 1030, 128);
  const tA = 1 - ss(EV.o_ring + .1, EV.t_tag - .25, t); if (tA > 0) { o.globalAlpha = tA; o.textAlign = 'center'; o.shadowColor = 'rgba(0,0,0,.7)'; o.shadowBlur = 24; o.font = '96px AB'; o.fillStyle = '#fff'; o.fillText('THE GATE IS', 540, 340); o.fillStyle = '#ffc85a'; o.fillText('LISTENING', 540, 452); o.shadowBlur = 0; o.globalAlpha = 1; }
  const v = new THREE.Vector3();
  for (const L of LBL) { const a = ss(L.from, L.from + .2, t) * (1 - ss(L.to - .18, L.to, t)); if (a <= 0) continue; v.copy(L.at(t)).project(cam); if (v.z > 1) continue; const x = clamp((v.x + 1) * 540, 110, 970), y = clamp((1 - v.y) * 960, 720, 1330), right = x < 540, tx = x + (right ? 70 : -70), ty = y - 120; o.globalAlpha = a; o.strokeStyle = '#fff'; o.lineWidth = 2.5; o.beginPath(); o.moveTo(x, y - 6); o.lineTo(tx, ty); o.stroke(); o.fillStyle = '#fff'; o.beginPath(); o.arc(x, y - 6, 6, 0, 7); o.fill(); o.textAlign = right ? 'left' : 'right'; const dx = right ? 8 : -8; o.shadowColor = 'rgba(0,0,0,.8)'; o.shadowBlur = 14; o.font = '700 40px Inter'; o.fillStyle = '#ffc85a'; o.fillText(L.txt, tx + dx, ty - 28); o.font = '500 25px Mono'; o.fillStyle = '#fff'; o.fillText(L.sub, tx + dx, ty + 4); o.shadowBlur = 0; o.globalAlpha = 1; }
  const sc = scopeOn(t); if (sc > 0) drawScope(t, clamp(sc));
  const fA = ss(EV.b_fork - .05, EV.b_fork + .15, t) * (1 - ss(EV.l_trick - .3, EV.l_trick - .05, t)); if (fA > 0) { o.globalAlpha = fA; o.textAlign = 'center'; o.shadowColor = 'rgba(0,0,0,.7)'; o.shadowBlur = 18; o.font = '66px AB'; o.fillStyle = '#ffc85a'; o.fillText('LIKE A TUNING FORK', 540, 590); o.shadowBlur = 0; o.globalAlpha = 1; }
  const aA = ss(EV.l_alarm - .03, EV.l_alarm + .1, t) * (1 - ss(EV.p_pay - .75, EV.p_pay - .5, t)); if (aA > 0) { o.save(); o.translate(540, 410); const k = 1.25 - .25 * ss(EV.l_alarm - .03, EV.l_alarm + .15, t); o.scale(k, k); o.globalAlpha = aA; o.textAlign = 'center'; o.shadowColor = 'rgba(0,0,0,.7)'; o.shadowBlur = 22; o.font = '124px AB'; o.fillStyle = '#ff5a4c'; o.fillText('ALARM', 0, 0); o.restore(); o.shadowBlur = 0; o.globalAlpha = 1; }
  const eA = ss(EV.e_beep - .15, EV.e_beep + .15, t); if (eA > 0) { o.globalAlpha = eA; o.textAlign = 'center'; o.shadowColor = 'rgba(0,0,0,.75)'; o.shadowBlur = 22; o.font = '74px AB'; o.fillStyle = '#fff'; o.fillText('BEEPED FOR', 540, 300); o.fillStyle = '#ffc85a'; o.fillText('NOTHING?', 540, 388); o.shadowBlur = 0;
    for (const [lbl, ts, x, c] of [['YES', EV.e_yes, 340, '#39c98a'], ['NO', EV.e_no, 740, '#ef5a4c']]) { const u = ss(ts - .05, ts + .12, t), k = u > 0 ? 1 + .22 * (1 - u) : .92; o.save(); o.translate(x, 495); o.scale(k, k); o.globalAlpha = eA * (u > 0 ? 1 : .55); o.fillStyle = u > 0 ? c : 'rgba(10,14,22,.72)'; o.beginPath(); o.roundRect(-140, -56, 280, 112, 56); o.fill(); o.fillStyle = '#fff'; o.font = '56px AB'; o.fillText(lbl, 0, 20); o.restore(); }
    o.globalAlpha = eA * ss(EV.e_sub - .05, EV.e_sub + .15, t); o.fillStyle = '#ef2b2b'; o.beginPath(); o.roundRect(350, 612, 380, 84, 42); o.fill(); o.fillStyle = '#fff'; o.font = '700 38px Inter'; o.fillText('SUBSCRIBE', 540, 668); o.globalAlpha = 1; }
  const line = LINES.find(l => t >= l[0].s - .05 && t <= l[l.length - 1].e + .18);
  if (line) { o.font = '700 50px Inter'; o.textAlign = 'left'; const sp = 14, ws = line.map(w => o.measureText(w.w).width), tot = ws.reduce((a, b) => a + b, 0) + sp * (line.length - 1); let x = 540 - tot / 2; const Y = 1490; o.fillStyle = 'rgba(6,9,16,.68)'; o.beginPath(); o.roundRect(540 - tot / 2 - 28, Y - 56, tot + 56, 80, 22); o.fill(); line.forEach((w, i) => { const said = t >= w.s - .02; o.fillStyle = w.k ? (said ? '#ffc85a' : 'rgba(255,200,90,.5)') : (said ? '#fff' : 'rgba(255,255,255,.5)'); o.fillText(w.w, x, Y); x += ws[i] + sp; }); }
}

// ---- finishing: same accumulation and film pass as #222 ----
const rtOpts = { type: THREE.HalfFloatType, minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, depthBuffer: true };
const one = new THREE.WebGLRenderTarget(W, H, rtOpts), acc = new THREE.WebGLRenderTarget(W, H, { ...rtOpts, depthBuffer: false });
const b1 = new THREE.WebGLRenderTarget(W >> 2, H >> 2, { ...rtOpts, depthBuffer: false }), b2 = b1.clone(), b3 = new THREE.WebGLRenderTarget(W >> 4, H >> 4, { ...rtOpts, depthBuffer: false }), b4 = b3.clone();
const fsCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1), fsG = new THREE.PlaneGeometry(2, 2);
const fs = (fragmentShader, uniforms = {}, extra = {}) => { const m = new THREE.ShaderMaterial({ depthTest: false, depthWrite: false, uniforms, vertexShader: 'varying vec2 v;void main(){v=uv;gl_Position=vec4(position.xy,0.,1.);}', fragmentShader, ...extra }); const s = new THREE.Scene(); s.add(new THREE.Mesh(fsG, m)); s.m = m; return s; };
const addS = fs('varying vec2 v;uniform sampler2D t;uniform float a;void main(){gl_FragColor=vec4(texture2D(t,v).rgb*a,1.);}', { t: { value: null }, a: { value: 1 } }, { blending: THREE.CustomBlending, blendSrc: THREE.OneFactor, blendDst: THREE.OneFactor, blendEquation: THREE.AddEquation, transparent: true });
const brightS = fs('varying vec2 v;uniform sampler2D t;void main(){vec3 c=texture2D(t,v).rgb;float l=max(c.r,max(c.g,c.b));gl_FragColor=vec4(c*smoothstep(1.4,3.,l),1.);}', { t: { value: null } });
const blurS = fs('varying vec2 v;uniform sampler2D t;uniform vec2 d;void main(){vec3 c=texture2D(t,v).rgb*.227;c+=(texture2D(t,v+d*1.38).rgb+texture2D(t,v-d*1.38).rgb)*.316;c+=(texture2D(t,v+d*3.23).rgb+texture2D(t,v-d*3.23).rgb)*.07;gl_FragColor=vec4(c,1.);}', { t: { value: null }, d: { value: new THREE.Vector2() } });
const finalS = fs(`varying vec2 v;uniform sampler2D t,b,bb;uniform float seed,fade;
vec3 aces(vec3 x){return clamp((x*(2.51*x+.03))/(x*(2.43*x+.59)+.14),0.,1.);}
float h(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233))+seed)*43758.5453);}
void main(){vec3 c=texture2D(t,v).rgb+texture2D(b,v).rgb*.45+texture2D(bb,v).rgb*.35;c=aces(c*.8);c=pow(c,vec3(1./2.2));vec2 q=v-.5;c*=1.-dot(q,q)*.45;c+=(h(v*vec2(1080.,1920.))-.5)*.018;gl_FragColor=vec4(c*fade,1.);}`, { t: { value: acc.texture }, b: { value: b2.texture }, bb: { value: b4.texture }, seed: { value: 0 }, fade: { value: 1 } });
const pass = (s, rt) => { R.setRenderTarget(rt); R.render(s, fsCam); };
const SHUTTER = .3 / 30;
window.seek = async function (t) {
  R.setRenderTarget(acc); R.setClearColor(0, 0); R.clear(); R.autoClear = true;
  for (let i = 0; i < N; i++) {
    const j1 = halton(i + 1, 2), j2 = halton(i + 1, 3), j3 = halton(i + 1, 5), j4 = halton(i + 1, 7), j5 = halton(i + 1, 11), j6 = halton(i + 1, 13);
    const ts = t + (j3 - .5) * SHUTTER; setWorld(ts); const { p, l } = camAt(ts);
    cam.position.copy(p); cam.up.set(0, 1, 0); cam.lookAt(l); cam.updateProjectionMatrix(); cam.updateMatrixWorld();
    const focus = p.distanceTo(l), ap = THREE.MathUtils.clamp(focus * .0042, .0006, .02), ang = j1 * 6.2832, rad = Math.sqrt(j2) * ap, dx = Math.cos(ang) * rad, dy = Math.sin(ang) * rad;
    cam.translateX(dx); cam.translateY(dy); cam.updateMatrixWorld();
    const P = cam.projectionMatrix.elements; P[8] = -P[0] * dx / focus - 2 * (j4 - .5) / W; P[9] = -P[5] * dy / focus - 2 * (j5 - .5) / H; cam.projectionMatrixInverse.copy(cam.projectionMatrix).invert();
    const span = THREE.MathUtils.clamp(focus * 1.4, 1.2, 8), sa = j6 * 6.2832, sr = Math.sqrt(j1) * .45;
    const sdir = new THREE.Vector3(.2 + Math.cos(sa) * sr, 1, .1 + Math.sin(sa) * sr).normalize(), az = j2 * 6.2832, el = Math.acos(Math.sqrt(j4)), fdir = new THREE.Vector3(Math.cos(az) * Math.sin(el), Math.cos(el) + .05, Math.sin(az) * Math.sin(el)).normalize();
    for (const [L, d] of [[key, sdir], [fill, fdir]]) { L.target.position.copy(l); L.position.copy(l).addScaledVector(d, span * 2.2); const c = L.shadow.camera; c.left = c.bottom = -span; c.right = c.top = span; c.near = .05; c.far = span * 5; c.updateProjectionMatrix(); L.target.updateMatrixWorld(); L.updateMatrixWorld(); }
    R.setRenderTarget(one); R.setClearColor(0, 1); R.clear(); R.render(scene, cam);
    addS.m.uniforms.t.value = one.texture; addS.m.uniforms.a.value = 1 / N; R.autoClear = false; pass(addS, acc); R.autoClear = true;
  }
  brightS.m.uniforms.t.value = acc.texture; pass(brightS, b1);
  blurS.m.uniforms.t.value = b1.texture; blurS.m.uniforms.d.value.set(4 / W, 0); pass(blurS, b2);
  blurS.m.uniforms.t.value = b2.texture; blurS.m.uniforms.d.value.set(0, 4 / H); pass(blurS, b1);
  blurS.m.uniforms.t.value = b1.texture; blurS.m.uniforms.d.value.set(16 / W, 0); pass(blurS, b4);
  blurS.m.uniforms.t.value = b4.texture; blurS.m.uniforms.d.value.set(0, 16 / H); pass(blurS, b3);
  blurS.m.uniforms.t.value = b3.texture; blurS.m.uniforms.d.value.set(8 / W, 0); pass(blurS, b4);
  blurS.m.uniforms.t.value = b1.texture; blurS.m.uniforms.d.value.set(4 / W, 0); pass(blurS, b2);
  finalS.m.uniforms.seed.value = t * 13.37; finalS.m.uniforms.fade.value = ss(0, .1, t) * (1 - ss(END - .15, END, t)); R.setRenderTarget(null); R.render(finalS, fsCam);
  drawOverlay(t);
};
window.END = END;
await Promise.all(['700 37px Inter', '500 23px Mono', '84px AB'].map(f => document.fonts.load(f)));
window.ready = true;
