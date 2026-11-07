// #224 world: real-photo environment (Poly Haven "Derelict Highway (Midday)" by Dimitrios Savva, Jarod Guest, CC0) + modelled objects, same offline accumulation renderer as #222.
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
// ======= film: timed on the spoken words (hf/224/ev.json from scripts/hf224.py). Cars stay near the origin, the road scrolls under them =======
const D = await (await fetch(q.get('ev') || '/hf/224/ev.json')).json(), EV = D.ev, END = D.dur;
const HX = 1.85, V0 = 31.3, V1 = 26.8;                     // 70 mph set speed, 60 mph behind the slowing car
const hero = sedan('#1f3a56'), lead = sedan('#b7babe'), dummy = sedan('#8d9094');
dummy.G.visible = false;
for (const [i, s] of [[0, -1], [1, 1]]) { dummy['haz' + i] = new THREE.MeshBasicMaterial({ color: new THREE.Color(5, 2.6, .3), transparent: true, opacity: 0 }); const h = new THREE.Mesh(new THREE.SphereGeometry(.09, 12, 8), dummy['haz' + i]); h.position.set(s * .75, .9, -2.3); dummy.G.add(h); }
// speed + gap: speed drops on "slows", back to set on "up"; freeze just before the broken-down car
const freeze = t => 1 - ss(EV.x_66 - .35, EV.x_66 - .02, t) * (1 - ss(EV.e_hands - .5, EV.e_hands - .1, t));
const heroV = t => { const a = ss(EV.g_slow + .1, EV.g_brake + .3, t), b = ss(EV.g_up - .1, EV.g_set + .1, t); return (V0 + (V1 - V0) * a * (1 - b)); };
const gapAt = t => { const a = ss(EV.g_slow - .1, EV.g_gap - .2, t), b = ss(EV.g_gap - .1, EV.g_set + .1, t); return 36 - 16 * a * (1 - b); };
const TS = []; { let z = 0; const dt = 1 / 120; for (let t = 0; t < END + 1; t += dt) { TS.push(z); z += heroV(t) * freeze(t) * dt; } }
const zAt = t => { const i = Math.max(0, t) * 120, k = Math.floor(i), f = i - k; return TS[k] + (TS[Math.min(k + 1, TS.length - 1)] - TS[k]) * f; };
const driftX = t => HX + 1.08 * ss(EV.d_drift - .1, EV.d_force - .05, t) * (1 - ss(EV.d_force + .05, EV.d_back + .35, t));
const steerA = t => -.34 * ss(EV.d_force - .15, EV.d_force + .15, t) * (1 - ss(EV.d_force + .3, EV.d_back + .1, t));
const dummyGap = t => { const zEnd = zAt(EV.x_66), zStart = zAt(EV.x_aaa); return 7.5 + (zEnd - zAt(Math.min(t, EV.x_66))); };
// interior
let headliner; const cabin = new THREE.Group(); hero.G.add(cabin); cabin.visible = false; const motorGlow = new THREE.MeshStandardMaterial({ color: '#111', emissive: '#ffb020', emissiveIntensity: 0 }), wheelG = new THREE.Group();
{ const dashM = std('#25272c', .7), softM = std('#34363c', .85), wood = std('#1b1c20', .35, .3), add2 = (g, m, x, y, z, par = cabin) => { const o = new THREE.Mesh(g, m); o.position.set(x, y, z); o.castShadow = o.receiveShadow = true; par.add(o); return o; };
  add2(new RoundedBoxGeometry(1.72, .3, .85, 6, .13), dashM, 0, .88, .95); add2(new RoundedBoxGeometry(1.72, .08, .1, 3, .03), wood, 0, .78, .5); add2(new RoundedBoxGeometry(.3, .14, .03, 3, .012), std('#0b0c10', .15), 0, .9, .49);
  const hood = add2(new RoundedBoxGeometry(1.78, .1, 1.6, 6, .05), hero.paintM, 0, .92, 2.12); hood.rotation.x = .05; add2(new RoundedBoxGeometry(.56, .08, .15, 4, .03), dashM, -.36, 1.15, .52);
  for (const sx of [-1, 1]) { const p = add2(new RoundedBoxGeometry(.11, 1.05, .1, 3, .03), softM, sx * .76, 1.24, .9); p.rotation.x = -.75; p.rotation.z = sx * .09; add2(new RoundedBoxGeometry(.14, .68, 2.6, 3, .05), softM, sx * .86, .83, -.3); const seat = add2(new RoundedBoxGeometry(.5, .72, .16, 5, .07), std('#2a2c31', .92), sx * .37, .92, -.72); seat.rotation.x = -.14; const low = add2(new RoundedBoxGeometry(.5, .15, .56, 5, .07), std('#2a2c31', .92), sx * .37, .52, -.42); }
  headliner = add2(new RoundedBoxGeometry(1.5, .05, 1.5, 3, .02), std('#6d6a64', .92), 0, 1.42, -.25);
  add2(new RoundedBoxGeometry(.25, .08, .025, 3, .012), std('#121316', .2, .3), 0, 1.3, .33);
  wheelG.position.set(-.36, .82, .22); wheelG.rotation.x = .3; cabin.add(wheelG); const tor = new THREE.Mesh(new THREE.TorusGeometry(.19, .022, 18, 64), std('#141518', .5)); tor.castShadow = true; wheelG.add(tor); for (const a of [2.67, .47, -1.57]) { const sp = new THREE.Mesh(new RoundedBoxGeometry(.18, .032, .014, 2, .006), std('#1f2024', .45)); sp.position.set(Math.cos(a) * .095, Math.sin(a) * .095, 0); sp.rotation.z = a; wheelG.add(sp); } wheelG.add(new THREE.Mesh(new RoundedBoxGeometry(.13, .1, .05, 3, .02), std('#1b1c20', .45)));
  add2(new THREE.CylinderGeometry(.03, .04, .34, 16), std('#26282d', .5), -.36, .74, .36).rotation.x = -1.2; add2(new RoundedBoxGeometry(.13, .1, .13, 3, .025), motorGlow, -.36, .64, .5);
}
// the camera module behind the windshield, the radar behind the bumper, a "set speed" display on the cluster
const camBox = new THREE.Group(); hero.G.add(camBox); camBox.position.set(0, 1.27, .42); { const b = new THREE.Mesh(new RoundedBoxGeometry(.14, .07, .1, 4, .018), std('#121316', .55)); b.castShadow = true; camBox.add(b); const l = new THREE.Mesh(new THREE.CylinderGeometry(.018, .018, .02, 24), std('#050608', .08, .2)); l.rotation.x = Math.PI / 2; l.position.set(0, -.008, .056); camBox.add(l); const r = new THREE.Mesh(new THREE.TorusGeometry(.019, .002, 8, 28), std('#6a6c70', .3, .9)); r.position.set(0, -.008, .066); camBox.add(r); }
const radarBox = new THREE.Group(); hero.G.add(radarBox); radarBox.position.set(0, .5, 2.365); { const b = new THREE.Mesh(new RoundedBoxGeometry(.13, .11, .03, 3, .01), std('#191b1f', .3)); radarBox.add(b); radarBox.userData.glow = new THREE.MeshBasicMaterial({ color: new THREE.Color(.5, 1.6, 3.2), transparent: true, opacity: 0 }); const g = new THREE.Mesh(new THREE.CircleGeometry(.038, 24), radarBox.userData.glow); g.position.z = .017; radarBox.add(g); }
const scrC = document.createElement('canvas'); scrC.width = 512; scrC.height = 256; const scrT = new THREE.CanvasTexture(scrC); scrT.colorSpace = THREE.SRGBColorSpace; scrT.anisotropy = 8;
{ const face = new THREE.Mesh(new THREE.PlaneGeometry(.4, .2), new THREE.MeshBasicMaterial({ map: scrT, toneMapped: false })); face.rotation.set(.12, Math.PI, 0); face.position.set(-.36, 1.0, .48); face.material.color.setScalar(1.5); cabin.add(face); }
function drawScreen(t) { const g = scrC.getContext('2d'); g.fillStyle = '#07090f'; g.fillRect(0, 0, 512, 256); const v = Math.round(heroV(t) * 2.2369 * freeze(t)); g.fillStyle = '#fff'; g.textAlign = 'center'; g.font = '700 110px Inter'; g.fillText(v, 130, 150); g.fillStyle = '#8c95a5'; g.font = '500 25px Mono'; g.fillText('mph', 130, 192); g.fillStyle = '#7fd3ff'; g.fillText('SET 70', 130, 228);
  const dr = t > EV.d_drift && t < EV.d_back + .3, on = t < EV.x_faded; g.strokeStyle = dr ? '#ffb020' : on ? '#44e08a' : '#555a63'; g.lineWidth = 8; g.beginPath(); g.moveTo(300, 210); g.lineTo(345, 60); g.moveTo(470, 210); g.lineTo(425, 60); g.stroke(); g.fillStyle = '#fff'; g.font = '500 22px Mono'; g.fillText(on ? 'LANE' : 'NO LANE', 385, 240); scrT.needsUpdate = true; }
// lines fading, snow on the road
paint.transparent = true; const snowT = (() => { const c = document.createElement('canvas'); c.width = c.height = 1024; const g = c.getContext('2d'); g.clearRect(0, 0, 1024, 1024); for (let i = 0; i < 1800; i++) { const a = rnd() * .5; g.fillStyle = `rgba(240,244,248,${a})`; g.beginPath(); g.ellipse(rnd() * 1024, rnd() * 1024, 6 + rnd() * 40, 3 + rnd() * 22, rnd() * 3, 0, 7); g.fill(); } const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(2, 60); return t; })();
const snow = new THREE.Mesh(new THREE.PlaneGeometry(HALF * 2 + 6, ROADLEN), new THREE.MeshStandardMaterial({ map: snowT, color: '#f4f7fa', transparent: true, opacity: 0, roughness: .8, depthWrite: false })); snow.rotation.x = -Math.PI / 2; snow.position.y = .009; snow.visible = false; snow.receiveShadow = true; scene.add(snow);
// radar arcs: out in blue, back in amber
const arcG = new THREE.RingGeometry(1, 1.0035, 48, 1, -.2, .4); arcG.rotateX(-Math.PI / 2); arcG.rotateY(Math.PI / 2 + Math.PI); const mkArc = c => { const m = new THREE.Mesh(arcG, new THREE.MeshBasicMaterial({ color: c, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide, fog: false })); m.visible = false; scene.add(m); return m; };
const arcsOut = Array.from({ length: 5 }, () => mkArc(new THREE.Color(.8, 2.6, 5))), arcsBack = Array.from({ length: 5 }, () => mkArc(new THREE.Color(5, 2.6, .6)));
const gapBar = mkArc(new THREE.Color(1, 1, 1));
const KEY = (t, p, l, r) => [t, p, l, r];
const CK = [ // relative to the hero car
 KEY(0, [2.6, 1.15, -7.6], [-.3, .85, 3], 1), KEY(EV.o_radar, [2.8, 1.2, -6.8], [-.3, .9, 4], 1), KEY(EV.o_cam, [2.1, .85, 4.6], [0, .55, 2.2], 1), KEY(EV.r_bump, [.9, .62, 3.15], [0, .5, 2.35], 1),
 KEY(EV.r_wave + .25, [.85, .66, 3.3], [0, .5, 2.3], 1), KEY(EV.r_wave + .95, [.72, .7, 3.9], [0, .55, 9], 1), KEY(EV.r_bounce, [.9, 7, -9], [0, .4, 17], 1), KEY(EV.r_time, [1, 7.6, -10], [0, .4, 17], 1), KEY(EV.r_500, [1.1, 8, -10.5], [0, .4, 17], 1),
 KEY(EV.g_slow, [1, 7.2, -9.5], [0, .4, 15], 1), KEY(EV.g_gap, [1, 6.6, -8.6], [0, .4, 12], 1), KEY(EV.g_set, [1, 7.4, -10], [0, .4, 16], 1),
 KEY(EV.c_lane - .25, [.8, 1.15, -1.8], [0, 1.22, .6], 1), KEY(EV.c_lane + .9, [-.12, 1.15, -.9], [0, 1.26, .42], 1), KEY(EV.c_wind, [-.05, 1.24, .05], [0, 1.26, .42], 1), KEY(EV.c_edge - .2, [0, 1.26, .46], [0, .6, 12], 1), KEY(EV.d_drift - .25, [0, 1.26, .46], [0, .55, 18], 1),
 KEY(EV.d_force - .1, [-.36, 1.27, -.5], [-.36, 1.04, .6], 1), KEY(EV.d_back, [-.36, 1.25, -.34], [-.36, 1.02, .6], 1), KEY(EV.x_see - .1, [-.36, 1.25, -.25], [-.36, 1.05, .6], 1), KEY(EV.x_faded - .1, [0, 1.26, .46], [0, .55, 18], 1), KEY(EV.x_snow + 1.1, [0, 1.26, .46], [0, .55, 18], 1),
 KEY(EV.x_aaa, [.9, 3.2, -8.5], [0, .7, 16], 1), KEY(EV.x_broken, [.9, 3.3, -8], [0, .7, 14], 1), KEY(EV.x_66, [1, 3.6, -7.2], [0, .7, 9], 1), KEY(EV.x_time + .3, [1.05, 3.7, -7.4], [0, .7, 9], 1),
 KEY(EV.e_hands - .05, [-.36, 1.27, -.5], [-.36, 1.02, .6], 1), KEY(EV.e_trust, [-.36, 1.28, -.55], [-.36, 1.02, .6], 1), KEY(END + .1, [-.36, 1.3, -.62], [-.36, 1.05, .6], 1),
];
for (let i = 1; i < CK.length; i++) CK[i][0] = Math.max(CK[i][0], CK[i - 1][0] + .08);
const inCar = t => (t > EV.d_force - .22 && t < EV.x_faded - .15) || (t > EV.c_wind - .25 && t < EV.x_aaa - .35) || t > EV.e_hands - .15;
const camAt = t => {
  const P = CK.map(k => { const dx = driftX(t), f = v => new THREE.Vector3(v[0] + dx, v[1], v[2]); return { t: k[0], p: f(k[1]), l: f(k[2]) }; });
  let i = 0; while (i < P.length - 2 && t > P[i + 1].t) i++;
  const b = P[i], c = P[i + 1], h = c.t - b.t, u = clamp((t - b.t) / h), u2 = u * u, u3 = u2 * u, ax = ['x', 'y', 'z'];
  const slope = (j, f, a) => { const pv = P[j - 1], nx = P[j + 1]; if (!pv || !nx) return 0; const d0 = (f(P[j])[a] - f(pv)[a]) / (P[j].t - pv.t), d1 = (f(nx)[a] - f(P[j])[a]) / (nx.t - P[j].t); if (d0 * d1 <= 0) return 0; const h0 = P[j].t - pv.t, h1 = nx.t - P[j].t; return 3 * (h0 + h1) / ((2 * h1 + h0) / d0 + (h1 + 2 * h0) / d1); };
  const cr = f => { const o = new THREE.Vector3(); for (const a of ax) o[a] = (2 * u3 - 3 * u2 + 1) * f(b)[a] + (u3 - 2 * u2 + u) * h * slope(i, f, a) + (-2 * u3 + 3 * u2) * f(c)[a] + (u3 - u2) * h * slope(i + 1, f, a); return o; };
  return { p: cr(k => k.p), l: cr(k => k.l) };
};
function setWorld(t) {
  const z = zAt(t), dx = driftX(t); scrollRoad(z); hero.G.position.set(dx, 0, 0); hero.G.rotation.y = .03 * (dx > HX + .01 ? (t < EV.d_force ? 1 : -1) : 0); hero.wheels.forEach(W => W.rotation.x = z / .345);
  const hg = gapAt(t); lead.G.position.set(HX, 0, hg); lead.wheels.forEach(W => W.rotation.x = z / .345); lead.G.visible = t < EV.x_aaa - .6; lead.brake.emissiveIntensity = .2 + 7 * ss(EV.g_slow - .05, EV.g_slow + .1, t) * (1 - ss(EV.g_brake + .25, EV.g_gap, t));
  hero.brake.emissiveIntensity = .2 + 7 * ss(EV.g_brake - .15, EV.g_brake + .05, t) * (1 - ss(EV.g_gap - .3, EV.g_gap, t));
  const ins = inCar(t); hero.G.children.forEach(o => { if (o !== cabin && o !== camBox && o !== radarBox) o.visible = !ins; }); cabin.visible = ins; radarBox.visible = !ins; headliner.visible = t > EV.c_wind + .2 ? true : t < EV.c_lane; wheelG.rotation.z = steerA(t); motorGlow.emissiveIntensity = 8 * ss(EV.d_force - .1, EV.d_force + .1, t) * (1 - ss(EV.d_force + .4, EV.d_back, t));
  cam.fov = 34 + 24 * (ins ? 1 : ss(EV.c_lane, EV.c_lane + .8, t) * (t < EV.x_aaa ? 1 : 0)); 
  radarBox.userData.glow.opacity = ss(EV.r_bump - .1, EV.r_bump + .3, t) * (1 - ss(EV.c_lane - .4, EV.c_lane - .2, t)) * (.65 + .35 * Math.sin(t * 16));
  // radar pulses: out from the bumper, back from the car ahead
  const pulsesOn = t > EV.r_wave - .05 && t < EV.g_set + .1, per = 1.05, L = hg - 4.6; arcsOut.forEach((m, i) => { const ph = ((t - EV.r_wave) / per + i / arcsOut.length) % 1, on = pulsesOn; m.visible = on; if (on) { const r = ph * L + .3; m.position.set(HX, .55, 2.3); m.scale.set(r, 1, r); m.material.opacity = Math.max(0, .85 - ph * .5); } }); arcsBack.forEach((m, i) => { const ph = ((t - EV.r_bounce) / per + i / arcsBack.length) % 1, on = pulsesOn && t > EV.r_bounce - .1; m.visible = on; if (on) { const r = ph * L + .3; m.position.set(HX, .55, hg - 2.3); m.rotation.y = Math.PI; m.scale.set(r, 1, r); m.material.opacity = Math.max(0, .8 - ph * .55); } });
  // faded paint and snow
  const fd = ss(EV.x_faded - .1, EV.x_snow, t) * (1 - ss(EV.x_aaa - .55, EV.x_aaa - .2, t)); paint.opacity = 1 - .93 * fd; const sn = ss(EV.x_snow - .15, EV.x_snow + .35, t) * (1 - ss(EV.x_aaa - .55, EV.x_aaa - .2, t)); snow.visible = sn > 0; snow.material.opacity = sn * .7; snowT.offset.y = z / (ROADLEN / 60);
  // broken-down car, hazards
  const dOn = t > EV.x_aaa - .4 && t < EV.e_hands - .25; dummy.G.visible = dOn; if (dOn) { dummy.G.position.set(HX, 0, dummyGap(t)); const f = (Math.sin(t * 7) > 0) ? 1 : .08; dummy.haz0.opacity = f; dummy.haz1.opacity = f; }
}
// ---- type ----
const o = ov.getContext('2d');
const LBL = [
 { from: EV.r_bump - .1, to: EV.r_wave + .4, txt: 'RADAR', sub: 'BEHIND THE BUMPER', at: t => new THREE.Vector3(driftX(t), .55, 2.38) },
 { from: EV.r_bounce, to: EV.r_time - .1, txt: 'ECHO', sub: 'BOUNCES OFF THE CAR AHEAD', at: t => new THREE.Vector3(HX, 1, gapAt(t) - 2.4) },
 { from: EV.c_wind - .05, to: EV.c_edge - .35, txt: 'CAMERA', sub: 'BEHIND THE WINDSHIELD', at: t => new THREE.Vector3(driftX(t), 1.27, .46) },
 { from: EV.d_force, to: EV.d_back + .15, txt: 'STEERING FORCE', sub: 'TURNS YOU BACK', at: () => new THREE.Vector3(driftX(EV.d_force) - .36, .64, .5) },
 { from: EV.x_aaa + .3, to: EV.x_66 - .25, txt: 'SIMULATED BROKEN-DOWN CAR', sub: 'STANDING IN THE LANE', at: t => new THREE.Vector3(HX, 1.15, dummyGap(t)) },
];
const CAPS = D.caps.flat(), LINES = []; { let cur = []; for (const w of CAPS) { cur.push(w); if (cur.length >= 4 || /[.,?:]$/.test(w.w)) { LINES.push(cur); cur = []; } } if (cur.length) LINES.push(cur); }
const v3 = new THREE.Vector3();
function laneLine(x, a, c) { o.beginPath(); let first = true; for (let z = 2.5; z < 90; z += z < 12 ? .5 : 3) { v3.set(x, .01, z).project(cam); if (v3.z > 1) continue; const px = (v3.x + 1) * 540, py = (1 - v3.y) * 960; first ? o.moveTo(px, py) : o.lineTo(px, py); first = false; } o.globalAlpha = a; o.strokeStyle = c; o.lineWidth = 7; o.shadowColor = c; o.shadowBlur = 18; o.stroke(); o.shadowBlur = 0; o.globalAlpha = 1; }
function drawOverlay(t) {
  o.clearRect(0, 0, 1080, 1920); o.textBaseline = 'alphabetic'; o.shadowBlur = 0;
  o.font = '500 21px Mono'; o.fillStyle = 'rgba(255,255,255,.8)'; o.textAlign = 'right'; o.fillText('ILLUSTRATION', 1030, 128);
  const tA = 1 - ss(EV.o_cam + .25, EV.r_bump - .2, t); if (tA > 0) { o.globalAlpha = tA; o.textAlign = 'center'; o.shadowColor = 'rgba(0,0,0,.7)'; o.shadowBlur = 24; o.font = '92px AB'; o.fillStyle = ss(EV.o_radar - .05, EV.o_radar + .1, t) > .5 ? '#ffc85a' : '#fff'; o.fillText('ONE RADAR.', 540, 340); o.fillStyle = ss(EV.o_cam - .05, EV.o_cam + .1, t) > .5 ? '#ffc85a' : '#fff'; o.fillText('ONE CAMERA.', 540, 450); o.shadowBlur = 0; o.globalAlpha = 1; }
  // lane lines the camera finds, drawn on the real road geometry
  const lA = ss(EV.c_edge - .1, EV.c_edge + .15, t) * (1 - ss(EV.d_force - .3, EV.d_force - .15, t)) + (t > EV.x_see - .3 && t < EV.x_faded + .2 ? 1 : 0) * (1 - ss(EV.x_faded + .05, EV.x_snow - .1, t)); if (lA > 0) { const dr = t > EV.d_drift - .05 && t < EV.d_force; const c = dr ? '#ff5a4c' : '#5dff9f'; laneLine(0, lA * (t > EV.x_faded ? (Math.sin(t * 34) > 0 ? .8 : .2) : .95), c); laneLine(HALF + .35, lA * (t > EV.x_faded ? (Math.sin(t * 29) > 0 ? .8 : .2) : .95), c); }
  const v = new THREE.Vector3();
  for (const L of LBL) { const a = ss(L.from, L.from + .2, t) * (1 - ss(L.to - .18, L.to, t)); if (a <= 0) continue; v.copy(L.at(t)).project(cam); if (v.z > 1) continue; const x = clamp((v.x + 1) * 540, 110, 970), y = clamp((1 - v.y) * 960, 720, 1330), right = x < 540, tx = x + (right ? 70 : -70), ty = y - 120; o.globalAlpha = a; o.strokeStyle = '#fff'; o.lineWidth = 2.5; o.beginPath(); o.moveTo(x, y - 6); o.lineTo(tx, ty); o.stroke(); o.fillStyle = '#fff'; o.beginPath(); o.arc(x, y - 6, 6, 0, 7); o.fill(); o.textAlign = right ? 'left' : 'right'; const dx = right ? 8 : -8; o.shadowColor = 'rgba(0,0,0,.85)'; o.shadowBlur = 14; o.font = '700 40px Inter'; o.fillStyle = '#ffc85a'; o.fillText(L.txt, tx + dx, ty - 28); o.font = '500 25px Mono'; o.fillStyle = '#fff'; o.fillText(L.sub, tx + dx, ty + 4); o.shadowBlur = 0; o.globalAlpha = 1; }
  // gap and speed readout
  const gA = ss(EV.r_time - .1, EV.r_time + .15, t) * (1 - ss(EV.g_set + .15, EV.c_lane - .25, t)); if (gA > 0) { const ft = Math.round(gapAt(t) * 3.281), mph = Math.round(heroV(t) * 2.2369); o.globalAlpha = gA; o.fillStyle = 'rgba(6,10,18,.72)'; o.beginPath(); o.roundRect(190, 250, 700, 150, 28); o.fill(); o.textAlign = 'center'; o.fillStyle = '#7fd3ff'; o.font = '500 26px Mono'; o.fillText('GAP', 370, 296); o.fillText('SPEED', 710, 296); o.fillStyle = '#fff'; o.font = '76px AB'; o.fillText(ft + ' FT', 370, 374); o.fillText(mph + ' MPH', 710, 374); o.globalAlpha = 1; }
  const rA = ss(EV.r_500 - .05, EV.r_500 + .12, t) * (1 - ss(EV.g_slow - .3, EV.g_slow - .05, t)); if (rA > 0) { o.globalAlpha = rA; o.textAlign = 'center'; o.shadowColor = 'rgba(0,0,0,.75)'; o.shadowBlur = 18; o.font = '700 46px Inter'; o.fillStyle = '#ffc85a'; o.fillText('SEES ABOUT 500 FT AHEAD', 540, 470); o.shadowBlur = 0; o.globalAlpha = 1; }
  const eA = ss(EV.c_edge - .1, EV.c_edge + .15, t) * (1 - ss(EV.c_lines + .35, EV.d_drift - .1, t)); if (eA > 0) { o.globalAlpha = eA; o.textAlign = 'center'; o.shadowColor = 'rgba(0,0,0,.75)'; o.shadowBlur = 18; o.font = '500 34px Mono'; o.fillStyle = '#5dff9f'; o.fillText('LOOKING FOR LINE EDGES', 540, 360); o.shadowBlur = 0; o.globalAlpha = 1; }
  const xA = ss(EV.x_faded + .25, EV.x_faded + .5, t) * (1 - ss(EV.x_aaa - .55, EV.x_aaa - .2, t)); if (xA > 0) { o.globalAlpha = xA; o.textAlign = 'center'; o.shadowColor = 'rgba(0,0,0,.75)'; o.shadowBlur = 18; o.font = '78px AB'; o.fillStyle = '#ff5a4c'; o.fillText('LANE LOST', 540, 370); o.shadowBlur = 0; o.globalAlpha = 1; }
  const dA = t > EV.d_drift && t < EV.d_force + .1 ? ss(EV.d_drift, EV.d_drift + .1, t) : 0; if (dA > 0) { o.globalAlpha = dA; o.textAlign = 'center'; o.shadowColor = 'rgba(0,0,0,.75)'; o.shadowBlur = 18; o.font = '70px AB'; o.fillStyle = '#ff5a4c'; o.fillText('DRIFTING', 540, 370); o.shadowBlur = 0; o.globalAlpha = 1; }
  const sA = ss(EV.x_66 - .02, EV.x_66 + .1, t) * (1 - ss(EV.e_hands - .4, EV.e_hands - .1, t)); if (sA > 0) { const k = 1.3 - .3 * ss(EV.x_66 - .02, EV.x_66 + .16, t); o.save(); o.translate(540, 400); o.scale(k, k); o.globalAlpha = sA; o.textAlign = 'center'; o.shadowColor = 'rgba(0,0,0,.7)'; o.shadowBlur = 22; o.font = '170px AB'; o.fillStyle = '#ff5a4c'; o.fillText('66%', 0, 0); o.shadowBlur = 0; o.font = '700 38px Inter'; const sub = 'HIT IT · AAA TEST · AVERAGE 25 MPH', w = o.measureText(sub).width; o.fillStyle = 'rgba(6,9,16,.68)'; o.beginPath(); o.roundRect(-w / 2 - 22, 36, w + 44, 60, 18); o.fill(); o.fillStyle = '#fff'; o.fillText(sub, 0, 80); o.restore(); o.globalAlpha = 1; }
  const hA = ss(EV.e_hands - .1, EV.e_hands + .1, t) * (1 - ss(EV.e_trust - .35, EV.e_trust - .1, t)); if (hA > 0) { o.globalAlpha = hA; o.textAlign = 'center'; o.shadowColor = 'rgba(0,0,0,.75)'; o.shadowBlur = 20; o.font = '82px AB'; o.fillStyle = '#ffc85a'; o.fillText('HANDS ON', 540, 340); o.fillStyle = '#fff'; o.fillText('THE WHEEL', 540, 435); o.shadowBlur = 0; o.globalAlpha = 1; }
  const fA = ss(EV.e_trust - .15, EV.e_trust + .15, t); if (fA > 0) { o.globalAlpha = fA; o.textAlign = 'center'; o.shadowColor = 'rgba(0,0,0,.75)'; o.shadowBlur = 22; o.font = '74px AB'; o.fillStyle = '#fff'; o.fillText('TRUST IT ON', 540, 300); o.fillStyle = '#ffc85a'; o.fillText('A LONG DRIVE?', 540, 388); o.shadowBlur = 0;
    for (const [lbl, ts, x, c] of [['YES', EV.e_yes, 340, '#39c98a'], ['NO', EV.e_no, 740, '#ef5a4c']]) { const u = ss(ts - .05, ts + .12, t), k = u > 0 ? 1 + .22 * (1 - u) : .92; o.save(); o.translate(x, 495); o.scale(k, k); o.globalAlpha = fA * (u > 0 ? 1 : .55); o.fillStyle = u > 0 ? c : 'rgba(10,14,22,.72)'; o.beginPath(); o.roundRect(-140, -56, 280, 112, 56); o.fill(); o.fillStyle = '#fff'; o.font = '56px AB'; o.fillText(lbl, 0, 20); o.restore(); }
    o.globalAlpha = fA * ss(EV.e_sub - .05, EV.e_sub + .15, t); o.fillStyle = '#ef2b2b'; o.beginPath(); o.roundRect(350, 612, 380, 84, 42); o.fill(); o.fillStyle = '#fff'; o.font = '700 38px Inter'; o.fillText('SUBSCRIBE', 540, 668); o.globalAlpha = 1; }
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
