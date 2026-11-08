// #227 world: real-photo environment (Poly Haven "Derelict Highway (Midday)" by Dimitrios Savva, Jarod Guest, CC0) + modelled objects, same offline accumulation renderer as #222.
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
const q = new URLSearchParams(location.search);
const W = +(q.get('w') || 540), H = +(q.get('h') || 960), N = +(q.get('n') || 12), ROT = +(q.get('rot') || -1.32);
const cv = document.getElementById('gl'), ov = document.getElementById('ov'); ov.width = 1080; ov.height = 1920;
for (const c of [cv, ov]) { c.style.width = W + 'px'; c.style.height = H + 'px'; }
const R = new THREE.WebGLRenderer({ canvas: cv, antialias: false, preserveDrawingBuffer: true });
R.setSize(W, H, false); R.shadowMap.enabled = true; R.shadowMap.type = THREE.PCFSoftShadowMap; R.outputColorSpace = THREE.LinearSRGBColorSpace; R.toneMapping = THREE.NoToneMapping;
const scene = new THREE.Scene(), cam = new THREE.PerspectiveCamera(34, W / H, .04, 1600);
let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
const halton = (i, b) => { let f = 1, r = 0; while (i > 0) { f /= b; r += f * (i % b); i = Math.floor(i / b); } return r; };
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x)), ss = (a, b, x) => { const u = clamp((x - a) / (b - a)); return u * u * (3 - 2 * u); };
const std = (color, rough = .6, metal = 0, extra = {}) => new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: metal, ...extra });

// ---- environment: Radiance .hdr parser (adaptive RLE) for the light, 6K photo for what the camera sees ----
async function loadHDR(url) {
  const b = new Uint8Array(await (await fetch(url)).arrayBuffer()); let p = 0, line = () => { let s = ''; while (b[p] !== 10) s += String.fromCharCode(b[p++]); p++; return s; };
  let l; do { l = line(); } while (l !== ''); const m = /-Y (\d+) \+X (\d+)/.exec(line()), h = +m[1], w = +m[2], out = new Float32Array(w * h * 4), row = new Uint8Array(w * 4);
  for (let y = 0; y < h; y++) { p += 4; for (let c = 0; c < 4; c++) { let x = 0; while (x < w) { let n = b[p++]; if (n > 128) { n -= 128; const v = b[p++]; while (n--) row[c * w + x++] = v; } else while (n--) row[c * w + x++] = b[p++]; } }
    for (let x = 0; x < w; x++) { const e = row[3 * w + x], f = e ? Math.pow(2, e - 136) : 0, i = (y * w + x) * 4; out[i] = Math.min(row[x] * f, 60); out[i + 1] = Math.min(row[w + x] * f, 60); out[i + 2] = Math.min(row[2 * w + x] * f, 60); out[i + 3] = 1; } }
  const t = new THREE.DataTexture(out, w, h, THREE.RGBAFormat, THREE.FloatType); t.mapping = THREE.EquirectangularReflectionMapping; t.flipY = true; t.needsUpdate = true; t.minFilter = t.magFilter = THREE.LinearFilter; t.colorSpace = THREE.LinearSRGBColorSpace; return t;
}
const ROT_ = 0; const hdr = await loadHDR('assets/highway_2k.hdr');
const pm = new THREE.PMREMGenerator(R);
{ const es = new THREE.Scene(); es.background = hdr; es.backgroundRotation = new THREE.Euler(0, ROT, 0); const rt = pm.fromEquirectangular(hdr); scene.environment = rt.texture; }
const photo = await new THREE.TextureLoader().loadAsync('assets/highway.jpg'); photo.colorSpace = THREE.SRGBColorSpace; photo.minFilter = THREE.LinearMipmapLinearFilter; photo.anisotropy = 16; photo.wrapS = THREE.RepeatWrapping;
const envU = { t: { value: photo }, rot: { value: ROT }, gain: { value: 1.15 }, capH: { value: 1.45 } };
const envFrag = `varying vec3 wp;uniform sampler2D t;uniform float rot,gain,capH;
vec3 samp(vec3 d){float a=atan(d.x,-d.z)+rot;float e=asin(clamp(d.y,-1.,1.));vec2 uv=vec2(a/6.28318+.5,e/3.14159+.5);return texture2D(t,uv).rgb*gain;}
void main(){vec3 o=vec3(0.,capH,0.);gl_FragColor=vec4(samp(normalize(wp-o)),FA);}`;
const envVert = 'varying vec3 wp;void main(){vec4 w=modelMatrix*vec4(position,1.);wp=w.xyz;gl_Position=projectionMatrix*viewMatrix*w;}';
const dome = new THREE.Mesh(new THREE.SphereGeometry(1400, 64, 32), new THREE.ShaderMaterial({ side: THREE.BackSide, depthWrite: false, uniforms: envU, vertexShader: envVert, fragmentShader: envFrag.replace('FA', '1.') })); dome.renderOrder = -2; scene.add(dome);
const key = new THREE.DirectionalLight('#fff4e4', 3.6), fill = new THREE.DirectionalLight('#cfe0ff', .4);
for (const l of [key, fill]) { l.castShadow = true; l.shadow.mapSize.set(2048, 2048); l.shadow.bias = -.0003; l.shadow.normalBias = .006; scene.add(l, l.target); }

const SUN = [.66, .707, .26];
// ---- road: one big painted tile (real asphalt photo, lane lines, shoulder, grass), scrolled along z: the car stays near the origin ----
const loadT = async (u, srgb) => { const t = await new THREE.TextureLoader().loadAsync(u); if (srgb) t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 16; return t; };
const asphD = await loadT('assets/asphalt_diff.jpg', true), asphN = await loadT('assets/asphalt_nor_gl.jpg'), asphR = await loadT('assets/asphalt_rough.jpg');
const LANE = 3.7, HALF = LANE;  // two lanes, centre dashed line at x=0
asphD.repeat.set(5, 60); asphN.repeat.set(5, 60); asphR.repeat.set(5, 60);
const roadM = std(0xffffff, 1, 0, { map: asphD, normalMap: asphN, roughnessMap: asphR, envMapIntensity: .5 }); roadM.normalScale.set(.8, .8);
const ROADLEN = 2000, road = new THREE.Mesh(new THREE.PlaneGeometry(HALF * 2 + 6, ROADLEN), roadM); road.rotation.x = -Math.PI / 2; road.position.z = 0; road.receiveShadow = true; scene.add(road);
const paint = std('#e8e6df', .62, 0, { envMapIntensity: .6 }), rs = [];
const dashG = new THREE.BoxGeometry(.14, .005, 3), edgeG = new THREE.BoxGeometry(.15, .005, ROADLEN);
const dashes = new THREE.InstancedMesh(dashG, paint, 170); dashes.receiveShadow = true; dashes.frustumCulled = false; scene.add(dashes);
for (const x of [-HALF - .35, HALF + .35]) { const e = new THREE.Mesh(edgeG, paint); e.position.set(x, .004, 0); e.receiveShadow = true; scene.add(e); }
const grassT = await (async () => { const c = document.createElement('canvas'); c.width = c.height = 1024; const g = c.getContext('2d'); g.fillStyle = '#7f7a4c'; g.fillRect(0, 0, 1024, 1024); for (let i = 0; i < 90; i++) { const r = g.createRadialGradient(0, 0, 0, 0, 0, 1); r.addColorStop(0, rnd() > .5 ? 'rgba(150,125,70,.42)' : 'rgba(70,75,38,.42)'); r.addColorStop(1, 'rgba(0,0,0,0)'); g.save(); g.translate(rnd() * 1024, rnd() * 1024); g.scale(60 + rnd() * 140, 30 + rnd() * 90); g.fillStyle = r; g.fillRect(-1, -1, 2, 2); g.restore(); } for (let i = 0; i < 60000; i++) { const v = rnd(); g.fillStyle = v > .6 ? 'rgba(170,150,90,.35)' : v > .3 ? 'rgba(80,90,45,.35)' : 'rgba(55,50,30,.3)'; g.fillRect(rnd() * 1024, rnd() * 1024, 2 + rnd() * 7, 1 + rnd() * 4); } const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 16; t.repeat.set(30, 300); return t; })();
const grassM = std(0xffffff, 1, 0, { map: grassT, envMapIntensity: .4 });
for (const s of [-1, 1]) { const g = new THREE.Mesh(new THREE.PlaneGeometry(300, ROADLEN), grassM); g.rotation.x = -Math.PI / 2; g.position.set(s * (150 + HALF + 3), -.02, 0); g.receiveShadow = true; scene.add(g); }
const postM = std('#d9d6cc', .5), railM = std('#b8bcc0', .32, .85);
const posts = new THREE.InstancedMesh(new RoundedBoxGeometry(.11, .95, .16, 2, .03), postM, 160); posts.frustumCulled = false; posts.castShadow = true; posts.receiveShadow = true; scene.add(posts);
const rail = new THREE.Mesh(new RoundedBoxGeometry(.05, .32, ROADLEN, 2, .02), railM); rail.position.set(-HALF - 3.6, .72, 0); rail.castShadow = true; scene.add(rail); const rail2 = rail.clone(); rail2.position.x = HALF + 3.6; scene.add(rail2);
const d0 = new THREE.Object3D();
function scrollRoad(z) { const pos = ((z % 120) + 120) % 120; for (let i = 0; i < 170; i++) { d0.position.set(0, .004, -780 + i * 12 - (z % 12)); d0.updateMatrix(); dashes.setMatrixAt(i, d0.matrix); } dashes.instanceMatrix.needsUpdate = true;
  for (let i = 0; i < 160; i++) { const k = i % 2 ? 1 : -1; d0.position.set(k * (HALF + 3.6), .47, -640 + (i >> 1) * 16 - (z % 16)); d0.updateMatrix(); posts.setMatrixAt(i, d0.matrix); } posts.instanceMatrix.needsUpdate = true;
  for (const T of [asphD, asphN, asphR]) T.offset.y = z / (ROADLEN / 60); grassT.offset.y = z / (ROADLEN / 300); }

// ---- sedan: proper proportions, soft loft body, clear-coated paint, separate glass, pillars, alloys, lights, door lines ----
const lerpTab = (tab, u) => { let i = 0; while (i < tab.length - 2 && u > tab[i + 1][0]) i++; const [a, x] = tab[i], [b, y] = tab[i + 1], k = clamp((u - a) / (b - a)), e = k * k * (3 - 2 * k); return x + (y - x) * e; };
function loft(L, wTab, topTab, lowTab, ex, ny = 90, nt = 64, z0 = 0) { const P = [], I = []; for (let i = 0; i <= ny; i++) { const a = i / ny, u = .5 - .5 * Math.cos(a * Math.PI), w = lerpTab(wTab, u), top = lerpTab(topTab, u), low = lerpTab(lowTab, u), cy = (top + low) / 2, hh = (top - low) / 2; for (let j = 0; j <= nt; j++) { const th = j / nt * Math.PI * 2, c = Math.cos(th), s = Math.sin(th); P.push(Math.sign(c) * Math.abs(c) ** (2 / ex) * w / 2, cy + Math.sign(s) * Math.abs(s) ** (2 / ex) * hh, z0 + (u - .5) * L); } } for (let i = 0; i < ny; i++) for (let j = 0; j < nt; j++) { const a = i * (nt + 1) + j, b = a + nt + 1; I.push(a, a + 1, b, b, a + 1, b + 1); } const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(P, 3)); g.setIndex(I); g.computeVertexNormals(); return g; }
const bodyG = loft(4.72, [[0, .05], [.03, 1.5], [.1, 1.82], [.3, 1.86], [.75, 1.86], [.92, 1.72], [.985, 1.3], [1, .05]], [[0, .72], [.03, .92], [.09, 1.02], [.26, 1.04], [.62, .98], [.8, .9], [.94, .8], [1, .58]], [[0, .46], [.04, .26], [.96, .26], [1, .42]], 5.2);
const glassG = loft(2.95, [[0, .1], [.1, 1.42], [.5, 1.46], [.8, 1.46], [1, .1]], [[0, .98], [.12, 1.22], [.3, 1.4], [.55, 1.43], [.72, 1.3], [.9, 1.05], [1, .92]], [[0, .9], [1, .86]], 5, 60, 48, -.28);
const roofG = loft(1.86, [[0, .08], [.1, 1.22], [.9, 1.26], [1, .08]], [[0, 1.38], [.12, 1.44], [.6, 1.455], [.88, 1.42], [1, 1.34]], [[0, 1.35], [1, 1.33]], 3.2, 40, 36, -.34);
const tyreG = new THREE.CylinderGeometry(.345, .345, .24, 40); tyreG.rotateZ(Math.PI / 2); const rimG = new THREE.CylinderGeometry(.235, .235, .25, 40); rimG.rotateZ(Math.PI / 2); const archG = new THREE.CylinderGeometry(.41, .41, .06, 40); archG.rotateZ(Math.PI / 2);
const tyreM = std('#17181a', .82), rimM = std('#c6c9cd', .24, .95), rimD = std('#191a1d', .5), glassM = new THREE.MeshPhysicalMaterial({ color: '#0b0f14', roughness: .04, metalness: .15, clearcoat: 1, envMapIntensity: 1.5 }), blackT = std('#14161a', .55);
function sedan(color, ex = {}) {
  const G = new THREE.Group(); scene.add(G); const a = (g, m, sh = true, par = G) => { const o = new THREE.Mesh(g, m); o.castShadow = sh; o.receiveShadow = true; par.add(o); return o; };
  const paintM = new THREE.MeshPhysicalMaterial({ color, roughness: .32, metalness: .35, clearcoat: 1, clearcoatRoughness: .04, envMapIntensity: 1.25 });
  a(bodyG, paintM); a(glassG, glassM); a(roofG, paintM);
  for (const s of [-1, 1]) { const c = a(new RoundedBoxGeometry(.055, .46, .1, 2, .02), paintM); c.position.set(s * .71, 1.17, -.32); c.rotation.z = s * .1; const fr = a(new RoundedBoxGeometry(.05, .55, .07, 2, .02), paintM); fr.position.set(s * .62, 1.17, .62); fr.rotation.set(-.9, 0, s * .12); const bk = a(new RoundedBoxGeometry(.05, .5, .08, 2, .02), paintM); bk.position.set(s * .64, 1.2, -1.32); bk.rotation.set(.75, 0, s * .1);
    const door = a(new RoundedBoxGeometry(.006, .46, .012, 1, .002), blackT, false); door.position.set(s * .925, .66, -.26); const door2 = door.clone(); door2.position.z = .68; G.add(door2); const h = a(new RoundedBoxGeometry(.03, .025, .17, 2, .008), paintM, false); h.position.set(s * .935, .86, -.1); const h2 = h.clone(); h2.position.z = -1.0; G.add(h2);
    const mir = a(new RoundedBoxGeometry(.2, .1, .1, 3, .03), paintM); mir.position.set(s * 1.0, 1.0, .72); const sk = a(new RoundedBoxGeometry(.012, .1, 3.15, 1, .004), blackT, false); sk.position.set(s * .9, .3, 0); }
  const wheels = []; for (const [wx, wz] of [[-.82, 1.42], [.82, 1.42], [-.82, -1.36], [.82, -1.36]]) { const W = new THREE.Group(); W.position.set(wx, .345, wz); W.add(new THREE.Mesh(tyreG, tyreM)); W.children[0].castShadow = true; W.add(new THREE.Mesh(rimG, rimD)); for (let i = 0; i < 5; i++) { const sp = new THREE.Mesh(new THREE.BoxGeometry(.262, .36, .03), rimM); sp.rotation.x = i * 1.2566; W.add(sp); } G.add(W); wheels.push(W); const ar = a(archG, blackT, false); ar.position.set(wx + Math.sign(wx) * .1, .39, wz); }
  const brake = new THREE.MeshStandardMaterial({ color: '#4a0a08', emissive: '#ff0800', emissiveIntensity: .2, roughness: .25 }); const tail = new RoundedBoxGeometry(.42, .09, .05, 3, .02), head = new RoundedBoxGeometry(.4, .075, .05, 3, .02); const headM = new THREE.MeshStandardMaterial({ color: '#dfe6ea', emissive: '#fff4d8', emissiveIntensity: .8, roughness: .1 });
  for (const s of [-1, 1]) { const t = a(tail, brake, false); t.position.set(s * .58, .88, -2.2); t.rotation.y = s * -.22; const h = a(head, headM, false); h.position.set(s * .58, .74, 2.12); h.rotation.y = s * -.3; }
  const grille = a(new RoundedBoxGeometry(.78, .11, .05, 2, .03), std('#0c0d0f', .35), false); grille.position.set(0, .5, 2.28); const pl = a(new RoundedBoxGeometry(.5, .11, .02, 1, .006), std('#d9dbdc', .5), false); pl.position.set(0, .58, -2.38);
  return { G, wheels, brake, paintM, ...ex };
}
// ======= film: timed on the spoken words (hf/227/ev.json from scripts/hf227.py). The car stays near the origin, the road and roadside scroll under it =======
const D = await (await fetch(q.get('ev') || '/hf/227/ev.json')).json(), EV = D.ev, END = D.dur;
const HX = 1.85, PX = 6.1;
// slow motion while the radar works (the readout still says 72 mph), real speed for the two-point timing
const heroV = t => 4 + 26 * ss(EV.a_favor - .2, EV.v_comp + .4, t);
const TS = []; { let z = 0; const dt = 1 / 120; for (let t = 0; t < END + 1; t += dt) { TS.push(z); z += heroV(t) * dt; } }
const zAt = t => { const i = Math.max(0, t) * 120, k = Math.floor(i), f = i - k; return TS[k] + (TS[Math.min(k + 1, TS.length - 1)] - TS[k]) * f; };
const P0 = 26 + zAt(EV.f_flash);                       // the pole is 26 m ahead when it flashes
const poleZ = t => P0 - zAt(t);
const GA0 = zAt(EV.v_time) + 30, GB0 = GA0 + 260;       // gantries A and B (the mile is compressed)
const gaZ = t => GA0 - zAt(t), gbZ = t => GB0 - zAt(t);
function drawScreen() {}
const hero = sedan('#8a1f22');
// generic front plate
const plateT = (() => { const c = document.createElement('canvas'); c.width = 512; c.height = 256; const g = c.getContext('2d'); g.fillStyle = '#f2f1ea'; g.fillRect(0, 0, 512, 256); g.strokeStyle = '#1d2a44'; g.lineWidth = 14; g.strokeRect(10, 10, 492, 236); g.fillStyle = '#1d2a44'; g.font = '700 100px Inter'; g.textAlign = 'center'; g.fillText('SAMPLE', 256, 162); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; return t; })();
{ const p = new THREE.Mesh(new RoundedBoxGeometry(.52, .12, .012, 2, .004), [0, 0, 0, 0, 0, 0].map((_, i) => i === 4 ? new THREE.MeshStandardMaterial({ map: plateT, roughness: .4 }) : std('#ddd', .4))); p.position.set(0, .36, 2.36); hero.G.add(p); }
// roadside speed camera: pole, housing, lens, flash panel; calibration lines on the road in front of it
const pole = new THREE.Group(); scene.add(pole);
{ const a = (g, m, x, y, z) => { const o = new THREE.Mesh(g, m); o.position.set(x, y, z); o.castShadow = o.receiveShadow = true; pole.add(o); return o; };
  const grey = std('#9ea3a8', .45, .7), body = std('#d9dcd5', .45, .1), dark = std('#121316', .3);
  a(new THREE.CylinderGeometry(.08, .1, 3.4, 20), grey, 0, 1.7, 0); a(new RoundedBoxGeometry(.6, .1, .6, 2, .02), std('#6f7378', .7), 0, .05, 0);
  a(new RoundedBoxGeometry(.6, .58, .7, 5, .05), body, -.05, 3.5, 0); a(new RoundedBoxGeometry(.58, .08, .82, 3, .03), std('#3b3f45', .5), -.05, 3.82, 0);
  const lens = a(new THREE.CylinderGeometry(.075, .075, .05, 28), dark, -.12, 3.55, -.36); lens.rotation.x = Math.PI / 2; a(new THREE.TorusGeometry(.08, .012, 10, 32), std('#5b5f64', .3, .9), -.12, 3.55, -.385);
  a(new RoundedBoxGeometry(.22, .14, .02, 2, .01), std('#8a8d91', .3, .4), .12, 3.62, -.36); a(new RoundedBoxGeometry(.12, .1, .02, 2, .008), dark, .12, 3.42, -.36);
  pole.userData.flash = new THREE.MeshBasicMaterial({ color: new THREE.Color(9, 9, 8.5), transparent: true, opacity: 0 }); a(new RoundedBoxGeometry(.21, .13, .01, 2, .01), pole.userData.flash, .12, 3.62, -.372);
  pole.rotation.y = .18; }
const pole2 = pole.clone(); scene.add(pole2); pole2.rotation.y = .18; const P2Z = 20 + zAt(EV.a_angle); const pole2Z = t => P2Z - zAt(t);
const calib = new THREE.InstancedMesh(new THREE.BoxGeometry(3.2, .006, .2), paint, 6); calib.receiveShadow = true; calib.frustumCulled = false; scene.add(calib);
// gantries for the two-point timing
const gantry = () => { const g = new THREE.Group(), m = std('#a7acb1', .4, .75); scene.add(g); const a = (geo, x, y, z) => { const o = new THREE.Mesh(geo, m); o.position.set(x, y, z); o.castShadow = true; g.add(o); return o; }; a(new THREE.CylinderGeometry(.14, .16, 6.4, 16), -HALF - 2.4, 3.2, 0); a(new THREE.CylinderGeometry(.14, .16, 6.4, 16), HALF + 2.4, 3.2, 0); a(new RoundedBoxGeometry(HALF * 2 + 5.2, .4, .4, 2, .05), 0, 6.2, 0); for (const x of [-HALF / 2, HALF / 2]) { const c = new THREE.Mesh(new RoundedBoxGeometry(.32, .26, .5, 3, .04), std('#d8dbd6', .45)); c.position.set(x, 5.85, -.1); c.castShadow = true; g.add(c); } return g; };
const gA = gantry(), gB = gantry();
const glowT = (() => { const c = document.createElement('canvas'); c.width = c.height = 128; const g = c.getContext('2d'), r = g.createRadialGradient(64, 64, 0, 64, 64, 64); r.addColorStop(0, 'rgba(255,255,255,1)'); r.addColorStop(.25, 'rgba(255,255,255,.5)'); r.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = r; g.fillRect(0, 0, 128, 128); return new THREE.CanvasTexture(c); })();
const flashSpr = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowT, color: new THREE.Color(9, 9, 8), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false })); flashSpr.scale.setScalar(4); flashSpr.visible = false; scene.add(flashSpr);
const flashA = t => { const u = t - EV.f_flash; return u > -.02 && u < .5 ? Math.exp(-u * 9) : 0; };
const lensW = t => new THREE.Vector3(PX - .12 - .07, 3.55, poleZ(t) - .36);
const lens2W = t => new THREE.Vector3(PX - .19, 3.55, pole2Z(t) - .36);
const KEY = (t, p, l, r) => [t, p, l, r];
const CK = [ // ref 1 hero, 2 pole, 3 gantry A
 KEY(0, [3.6, 1.15, -7.8], [1.5, 1.1, 18], 1), KEY(EV.o_72, [3.9, 1.3, -6.4], [3, 1.6, 26], 1), KEY(EV.b_beam - .3, [-1.7, 3.95, -1.5], [0, 3.5, 0], 2), KEY(EV.b_beam + 1.2, [-1.9, 3.9, -1.8], [0, 3.5, 0], 2), KEY(EV.b_bounce + .3, [3.2, 7, -15], [3.6, 1.4, 16], 1), KEY(EV.b_echo, [3.3, 7.3, -15.5], [3.6, 1.4, 15], 1),
 KEY(EV.d_toward, [3.4, 7.5, -16], [3.6, 1.4, 14], 1), KEY(EV.d_shift, [3.6, 8, -13], [3.8, 1.6, 15], 1), KEY(EV.d_siren, [3.8, 8.2, -11], [3.8, 1.6, 14], 1),
 KEY(EV.f_limit, [1.15, 1.2, 7.5], [1.85, .6, 2.2], 1), KEY(EV.f_flash, [1.1, 1.15, 6.8], [1.85, .55, 2.3], 1), KEY(EV.f_plate + .6, [1.3, 1.0, 6.2], [1.85, .45, 2.3], 1), KEY(EV.f_lines + .2, [-1.4, 4.6, 10], [.9, 0, 5], 1),
 KEY(EV.a_twist, [3.6, 40, 9.5], [3.6, 0, 10], 1), KEY(EV.a_favor, [3.6, 41, 9.8], [3.6, 0, 10.3], 1),
 KEY(EV.v_comp, [1, 4.2, -9.5], [1.85, 0, 14], 1), KEY(EV.v_points, [.9, 4.6, -10.5], [1.85, 0, 15], 1), KEY(EV.v_72, [.8, 5, -11.5], [1.85, 0, 16], 1),
 KEY(EV.e_hw, [0, 6.5, -13], [1.8, 0, 16], 1), KEY(END + .1, [-.1, 7, -14], [1.8, 0, 17], 1),
];
for (let i = 1; i < CK.length; i++) CK[i][0] = Math.max(CK[i][0], CK[i - 1][0] + .08);
const camAt = t => {
  const pz = poleZ(t), gz = gaZ(t);
  const P = CK.map(k => { const o = k[3] === 2 ? [PX, 0, pz] : k[3] === 3 ? [0, 0, gz] : [0, 0, 0]; const f = v => new THREE.Vector3(v[0] + o[0], v[1] + o[1], v[2] + o[2]); return { t: k[0], p: f(k[1]), l: f(k[2]) }; });
  let i = 0; while (i < P.length - 2 && t > P[i + 1].t) i++;
  const b = P[i], c = P[i + 1], h = c.t - b.t, u = clamp((t - b.t) / h), u2 = u * u, u3 = u2 * u, ax = ['x', 'y', 'z'];
  const slope = (j, f, a) => { const pv = P[j - 1], nx = P[j + 1]; if (!pv || !nx) return 0; const d0 = (f(P[j])[a] - f(pv)[a]) / (P[j].t - pv.t), d1 = (f(nx)[a] - f(P[j])[a]) / (nx.t - P[j].t); if (d0 * d1 <= 0) return 0; const h0 = P[j].t - pv.t, h1 = nx.t - P[j].t; return 3 * (h0 + h1) / ((2 * h1 + h0) / d0 + (h1 + 2 * h0) / d1); };
  const cr = f => { const o = new THREE.Vector3(); for (const a of ax) o[a] = (2 * u3 - 3 * u2 + 1) * f(b)[a] + (u3 - 2 * u2 + u) * h * slope(i, f, a) + (-2 * u3 + 3 * u2) * f(c)[a] + (u3 - u2) * h * slope(i + 1, f, a); return o; };
  return { p: cr(k => k.p), l: cr(k => k.l) };
};
const d1 = new THREE.Object3D();
function setWorld(t) {
  const z = zAt(t); scrollRoad(z); hero.G.position.set(HX, 0, 0); hero.wheels.forEach(W => W.rotation.x = z / .345);
  const pz = poleZ(t); pole.position.set(PX, 0, pz); pole.visible = pz > -60 && pz < 400; const p2 = pole2Z(t); pole2.position.set(PX, 0, p2); pole2.visible = t > EV.f_lines + .6 && p2 > -40;
  for (let i = 0; i < 6; i++) { d1.position.set(HX, .005, pz - 6 - i * 1.6); d1.updateMatrix(); calib.setMatrixAt(i, d1.matrix); } calib.instanceMatrix.needsUpdate = true;
  const fa = flashA(t); pole.userData.flash.opacity = fa; flashSpr.visible = fa > .01; flashSpr.position.copy(lensW(t)).add(new THREE.Vector3(.25, .07, 0)); flashSpr.material.opacity = fa;
  gA.position.set(0, 0, gaZ(t)); gB.position.set(0, 0, gbZ(t)); gA.visible = t > EV.v_comp - .6; gB.visible = gA.visible;
  cam.fov = 34;
}
// ---- type ----
const o = ov.getContext('2d');
const P2 = v => { const p = v.clone().project(cam); return { x: (p.x + 1) * 540, y: (1 - p.y) * 960, ok: p.z < 1 }; };
function wave(A, B, lam, amp, phase, color, off) { const dx = B.x - A.x, dy = B.y - A.y, L = Math.hypot(dx, dy); if (L < 10) return; const ux = dx / L, uy = dy / L, nx = -uy, ny = ux; o.beginPath(); for (let s = 0; s <= L; s += 3) { const w = Math.sin((s / lam) * 6.2832 - phase) * amp, x = A.x + ux * s + nx * (w + off), y = A.y + uy * s + ny * (w + off); s ? o.lineTo(x, y) : o.moveTo(x, y); } o.strokeStyle = color; o.lineWidth = 5; o.shadowColor = color; o.shadowBlur = 14; o.stroke(); o.shadowBlur = 0; }
const LBL = [
 { from: EV.b_beam - .1, to: EV.b_bounce - .1, txt: 'SPEED CAMERA', sub: 'RADAR + PHOTO', at: t => lensW(t) },
 { from: EV.f_plate - .1, to: EV.f_lines - .1, txt: 'PLATE', sub: 'LIT BY THE FLASH', at: () => new THREE.Vector3(HX, .36, 2.37) },
 { from: EV.f_lines - .05, to: EV.a_twist - .25, txt: 'CALIBRATION LINES', sub: 'PAINTED ON THE ROAD', at: t => new THREE.Vector3(HX + 1.6, .01, poleZ(t) - 10) },
 { from: EV.v_time - .1, to: EV.v_mile - .1, txt: 'POINT A', sub: 'CLOCK STARTS', at: t => new THREE.Vector3(HALF / 2, 6, gaZ(t)) },
];
const CAPS = D.caps.flat(), LINES = []; { let cur = []; for (const w of CAPS) { cur.push(w); if (cur.length >= 4 || /[.,?:]$/.test(w.w)) { LINES.push(cur); cur = []; } } if (cur.length) LINES.push(cur); }
const big = (txt, y, size, color, a) => { o.globalAlpha = a; o.textAlign = 'center'; o.shadowColor = 'rgba(0,0,0,.75)'; o.shadowBlur = 20; o.font = `${size}px AB`; o.fillStyle = color; o.fillText(txt, 540, y); o.shadowBlur = 0; o.globalAlpha = 1; };
const pill = (txt, y, a) => { o.globalAlpha = a; o.font = '700 38px Inter'; o.textAlign = 'center'; const w = o.measureText(txt).width; o.fillStyle = 'rgba(6,9,16,.7)'; o.beginPath(); o.roundRect(540 - w / 2 - 22, y - 44, w + 44, 62, 18); o.fill(); o.fillStyle = '#fff'; o.fillText(txt, 540, y); o.globalAlpha = 1; };
const win = (t, a, b, f = .15) => ss(a - .05, a + f, t) * (1 - ss(b - f, b, t));
function drawOverlay(t) {
  // camera photo: a grey still of the frame, held after the flash
  const ph = win(t, EV.f_plate - .2, EV.f_lines - .05);
  const fa = flashA(t); o.clearRect(0, 0, 1080, 1920); o.textBaseline = 'alphabetic';
  if (ph > 0) { o.globalAlpha = ph; o.save(); o.translate(560, 300); o.rotate(-.03); o.fillStyle = '#f4f3ee'; o.fillRect(-300, -40, 600, 470); o.filter = 'grayscale(1) contrast(1.25) brightness(1.1)'; const pp = P2(new THREE.Vector3(HX, .45, 2.37)), cw = cv.width * .62, chh = cw * 355 / 560, sx = clamp(pp.x / 1080 * cv.width - cw / 2, 0, cv.width - cw), sy = clamp(pp.y / 1920 * cv.height - chh * .6, 0, cv.height - chh); o.drawImage(cv, sx, sy, cw, chh, -280, -20, 560, 355); o.filter = 'none'; o.fillStyle = '#1a1c20'; o.font = '500 26px Mono'; o.textAlign = 'left'; o.fillText('72 MPH · LIMIT 65', -270, 380); o.fillText('LANE 2 · 14:32:07', -270, 414); o.restore(); o.globalAlpha = 1; }
  if (fa > 0) { o.fillStyle = `rgba(255,255,250,${fa * .6})`; o.fillRect(0, 0, 1080, 1920); }
  o.font = '500 21px Mono'; o.fillStyle = 'rgba(255,255,255,.8)'; o.textAlign = 'right'; o.fillText('ILLUSTRATION', 1030, 128);
  const tA = 1 - ss(EV.o_72 + .4, EV.b_beam - .1, t); if (tA > 0) { big("IT CAN'T SEE", 330, 88, '#fff', tA); big('YOUR SPEEDOMETER', 430, 70, '#ffc85a', tA); }
  // radar beam out (blue) and the echo back (amber, squeezed), drawn between the lens and the car's nose
  const wA = win(t, EV.b_beam, EV.f_limit + .2); if (wA > 0) { const A = P2(lensW(t)), B = P2(new THREE.Vector3(HX, .6, 2.35)); if (A.ok && B.ok) { o.globalAlpha = wA; wave(A, B, 46, 9, t * 9, '#7fd3ff', -12); if (t > EV.b_bounce - .1) { const sq = 46 - 14 * ss(EV.d_squeeze - .2, EV.d_squeeze + .5, t) - 6 * ss(EV.d_faster, EV.d_shift + .2, t); o.globalAlpha = wA * ss(EV.b_bounce - .1, EV.b_bounce + .2, t); wave(B, A, sq, 9, t * 11, '#ffc85a', -12); } o.globalAlpha = 1; } }
  const sA = win(t, EV.d_freq - .1, EV.f_limit - .1); if (sA > 0) { o.globalAlpha = sA; o.fillStyle = 'rgba(6,10,18,.74)'; o.beginPath(); o.roundRect(150, 250, 780, 200, 28); o.fill(); o.textAlign = 'left'; o.font = '500 28px Mono'; o.fillStyle = '#7fd3ff'; o.fillText('SENT', 190, 300); o.fillStyle = '#ffc85a'; o.fillText('ECHO: HIGHER', 190, 380); const sq = 46 - 14 * ss(EV.d_squeeze - .2, EV.d_squeeze + .5, t) - 6 * ss(EV.d_faster, EV.d_shift + .2, t); for (const [y, lam, c] of [[318, 46, '#7fd3ff'], [398, sq, '#ffc85a']]) { o.beginPath(); for (let x = 0; x <= 520; x += 2) { const v = Math.sin((x / lam) * 6.2832 - t * 9) * 16; x ? o.lineTo(390 + x, y + v) : o.moveTo(390 + x, y + v); } o.strokeStyle = c; o.lineWidth = 4; o.stroke(); } const mph = Math.round(72 * ss(EV.d_faster - .3, EV.d_shift, t)); if (mph > 0) { o.textAlign = 'right'; o.font = '64px AB'; o.fillStyle = '#fff'; o.fillText(mph + ' MPH', 900, 545); } o.globalAlpha = 1; }
  const v = new THREE.Vector3();
  for (const L of LBL) { const a = win(t, L.from, L.to); if (a <= 0) continue; v.copy(L.at(t)).project(cam); if (v.z > 1) continue; const x = clamp((v.x + 1) * 540, 110, 970), y = clamp((1 - v.y) * 960, 720, 1330), right = x < 540, tx = x + (right ? 70 : -70), ty = y - 120; o.globalAlpha = a; o.strokeStyle = '#fff'; o.lineWidth = 2.5; o.beginPath(); o.moveTo(x, y - 6); o.lineTo(tx, ty); o.stroke(); o.fillStyle = '#fff'; o.beginPath(); o.arc(x, y - 6, 6, 0, 7); o.fill(); o.textAlign = right ? 'left' : 'right'; const dx = right ? 8 : -8; o.shadowColor = 'rgba(0,0,0,.85)'; o.shadowBlur = 14; o.font = '700 40px Inter'; o.fillStyle = '#ffc85a'; o.fillText(L.txt, tx + dx, ty - 28); o.font = '500 25px Mono'; o.fillStyle = '#fff'; o.fillText(L.sub, tx + dx, ty + 4); o.shadowBlur = 0; o.globalAlpha = 1; }
  // the angle: beam line, driving line, readout lower than true
  const aA = win(t, EV.a_angle - .1, EV.v_comp - .3); if (aA > 0) { const A = P2(lens2W(t)), B = P2(new THREE.Vector3(HX, .6, 2.35)), C = P2(new THREE.Vector3(HX, .6, 30)); if (A.ok && B.ok) { o.globalAlpha = aA; o.setLineDash([18, 12]); o.strokeStyle = '#7fd3ff'; o.lineWidth = 5; o.beginPath(); o.moveTo(B.x, B.y); o.lineTo(A.x, A.y); o.stroke(); o.setLineDash([]); o.strokeStyle = '#fff'; o.beginPath(); o.moveTo(B.x, B.y); o.lineTo(C.x, C.y); o.stroke(); o.globalAlpha = 1; } const r = win(t, EV.a_slower - .1, EV.v_comp - .3); if (r > 0) { pill('ACTUAL 72 MPH', 300, r); big('READS ABOUT 70', 420, 72, '#ffc85a', r); } const fv = win(t, EV.a_favor - .1, EV.v_comp - .3); if (fv > 0) pill("ALWAYS IN THE DRIVER'S FAVOR", 520, fv); }
  // two-point timing
  const vA = win(t, EV.v_time - .1, EV.e_hw - .2); if (vA > 0) { const run = clamp((t - EV.v_time) / Math.max(.5, EV.v_72 - EV.v_time)), secs = Math.round(50 * run); o.globalAlpha = vA; o.fillStyle = 'rgba(6,10,18,.74)'; o.beginPath(); o.roundRect(190, 250, 700, 160, 28); o.fill(); o.textAlign = 'center'; o.font = '500 26px Mono'; o.fillStyle = '#7fd3ff'; o.fillText('A → B', 370, 296); o.fillText('TIME', 710, 296); o.fillStyle = '#fff'; o.font = '70px AB'; o.fillText('1 MILE', 370, 374); o.fillText(secs + ' S', 710, 374); o.globalAlpha = 1; const r = win(t, EV.v_72 - .05, EV.e_hw - .2); if (r > 0) big('= 72 MPH', 520, 100, '#ffc85a', r); }
  const eA = ss(EV.e_hw - .15, EV.e_hw + .15, t); if (eA > 0) { big('ON EVERY', 300, 80, '#fff', eA); big('HIGHWAY?', 392, 80, '#ffc85a', eA);
    for (const [lbl, ts, x, c] of [['YES', EV.e_yes, 340, '#39c98a'], ['NO', EV.e_no, 740, '#ef5a4c']]) { const u = ss(ts - .05, ts + .12, t), k = u > 0 ? 1 + .22 * (1 - u) : .92; o.save(); o.translate(x, 500); o.scale(k, k); o.globalAlpha = eA * (u > 0 ? 1 : .55); o.fillStyle = u > 0 ? c : 'rgba(10,14,22,.72)'; o.beginPath(); o.roundRect(-140, -56, 280, 112, 56); o.fill(); o.fillStyle = '#fff'; o.font = '56px AB'; o.textAlign = 'center'; o.fillText(lbl, 0, 20); o.restore(); }
    o.globalAlpha = eA * ss(EV.e_sub - .05, EV.e_sub + .15, t); o.fillStyle = '#ef2b2b'; o.beginPath(); o.roundRect(350, 618, 380, 84, 42); o.fill(); o.fillStyle = '#fff'; o.font = '700 38px Inter'; o.textAlign = 'center'; o.fillText('SUBSCRIBE', 540, 674); o.globalAlpha = 1; }
  const line = LINES.find(l => t >= l[0].s - .05 && t <= l[l.length - 1].e + .18);
  if (line) { o.font = '700 50px Inter'; o.textAlign = 'left'; const sp = 14, ws = line.map(w => o.measureText(w.w).width), tot = ws.reduce((a, b) => a + b, 0) + sp * (line.length - 1); let x = 540 - tot / 2; const Y = 1490; o.fillStyle = 'rgba(6,9,16,.68)'; o.beginPath(); o.roundRect(540 - tot / 2 - 28, Y - 56, tot + 56, 80, 22); o.fill(); line.forEach((w, i) => { const said = t >= w.s - .02; o.fillStyle = w.k ? (said ? '#ffc85a' : 'rgba(255,200,90,.5)') : (said ? '#fff' : 'rgba(255,255,255,.5)'); o.fillText(w.w, x, Y); x += ws[i] + sp; }); }
}

// ---- finishing: same accumulation and film pass as #222 ----
const rtOpts = { type: THREE.HalfFloatType, minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, depthBuffer: true };
const one = new THREE.WebGLRenderTarget(W, H, rtOpts), acc = new THREE.WebGLRenderTarget(W, H, { ...rtOpts, depthBuffer: false });
const b1 = new THREE.WebGLRenderTarget(W >> 2, H >> 2, { ...rtOpts, depthBuffer: false }), b2 = b1.clone(), b3 = new THREE.WebGLRenderTarget(W >> 4, H >> 4, { ...rtOpts, depthBuffer: false }), b4 = b3.clone();
const fsCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1), fsG = new THREE.PlaneGeometry(2, 2);
const fs = (fragmentShader, uniforms = {}, extra = {}) => { const m = new THREE.ShaderMaterial({ depthTest: false, depthWrite: false, uniforms, vertexShader: 'varying vec2 v;void main(){v=uv;gl_Position=vec4(position.xy,0.,1.);}', fragmentShader, ...extra }); const s = new THREE.Scene(); s.add(new THREE.Mesh(fsG, m)); s.m = m; return s; };
const addS = fs('varying vec2 v;uniform sampler2D t;uniform float a;void main(){vec3 c=texture2D(t,v).rgb;if(!(c.r==c.r&&c.g==c.g&&c.b==c.b))c=vec3(0.);gl_FragColor=vec4(min(c,vec3(30.))*a,1.);}', { t: { value: null }, a: { value: 1 } }, { blending: THREE.CustomBlending, blendSrc: THREE.OneFactor, blendDst: THREE.OneFactor, blendEquation: THREE.AddEquation, transparent: true });
const brightS = fs('varying vec2 v;uniform sampler2D t;void main(){vec3 c=texture2D(t,v).rgb;float l=max(c.r,max(c.g,c.b));gl_FragColor=vec4(c*smoothstep(1.6,3.5,l),1.);}', { t: { value: null } });
const blurS = fs('varying vec2 v;uniform sampler2D t;uniform vec2 d;void main(){vec3 c=texture2D(t,v).rgb*.227;c+=(texture2D(t,v+d*1.38).rgb+texture2D(t,v-d*1.38).rgb)*.316;c+=(texture2D(t,v+d*3.23).rgb+texture2D(t,v-d*3.23).rgb)*.07;gl_FragColor=vec4(c,1.);}', { t: { value: null }, d: { value: new THREE.Vector2() } });
const finalS = fs(`varying vec2 v;uniform sampler2D t,b,bb;uniform float seed,fade;
vec3 aces(vec3 x){return clamp((x*(2.51*x+.03))/(x*(2.43*x+.59)+.14),0.,1.);}
float h(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233))+seed)*43758.5453);}
void main(){vec3 c=texture2D(t,v).rgb+texture2D(b,v).rgb*.45+texture2D(bb,v).rgb*.35;c=aces(c*.8);c=pow(c,vec3(1./2.2));vec2 q=v-.5;c*=1.-dot(q,q)*.45;c+=(h(v*vec2(1080.,1920.))-.5)*.018;gl_FragColor=vec4(c*fade,1.);}`, { t: { value: acc.texture }, b: { value: b2.texture }, bb: { value: b4.texture }, seed: { value: 0 }, fade: { value: 1 } });
const pass = (s, rt) => { R.setRenderTarget(rt); R.render(s, fsCam); };
const SHUTTER = .3 / 30;
window.seek = async function (t) {
  drawScreen(t);
  R.setRenderTarget(acc); R.setClearColor(0, 0); R.clear(); R.autoClear = true;
  for (let i = 0; i < N; i++) {
    const j1 = halton(i + 1, 2), j2 = halton(i + 1, 3), j3 = halton(i + 1, 5), j4 = halton(i + 1, 7), j5 = halton(i + 1, 11), j6 = halton(i + 1, 13);
    const ts = t + (j3 - .5) * SHUTTER; setWorld(ts); const { p, l } = camAt(ts);
    cam.position.copy(p); cam.up.set(0, 1, 0); cam.lookAt(l); cam.updateProjectionMatrix(); cam.updateMatrixWorld();
    const focus = p.distanceTo(l), ap = THREE.MathUtils.clamp(focus * .0032, .0006, .03), ang = j1 * 6.2832, rad = Math.sqrt(j2) * ap, dx = Math.cos(ang) * rad, dy = Math.sin(ang) * rad;
    cam.translateX(dx); cam.translateY(dy); cam.updateMatrixWorld();
    const P = cam.projectionMatrix.elements; P[8] = -P[0] * dx / focus - 2 * (j4 - .5) / W; P[9] = -P[5] * dy / focus - 2 * (j5 - .5) / H; cam.projectionMatrixInverse.copy(cam.projectionMatrix).invert();
    const span = THREE.MathUtils.clamp(focus * 2.5, 3, 30), sa = j6 * 6.2832, sr = Math.sqrt(j1) * .45;
    const sdir = new THREE.Vector3(SUN[0] + Math.cos(sa) * .035, SUN[1], SUN[2] + Math.sin(sa) * .035).normalize(), az = j2 * 6.2832, el = Math.acos(Math.sqrt(j4)), fdir = new THREE.Vector3(Math.cos(az) * Math.sin(el), Math.cos(el) + .05, Math.sin(az) * Math.sin(el)).normalize();
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
