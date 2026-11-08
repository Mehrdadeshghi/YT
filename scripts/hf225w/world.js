// #225 world: real-photo environment (Poly Haven "Derelict Highway (Midday)" by Dimitrios Savva, Jarod Guest, CC0) + modelled objects, same offline accumulation renderer as #222.
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
  const wheels = []; for (const [wx, wz] of [[-.82, 1.42], [.82, 1.42], [-.82, -1.36], [.82, -1.36]]) { const W = new THREE.Group(); W.position.set(wx, .345, wz); W.add(new THREE.Mesh(tyreG, tyreM)); W.children[0].castShadow = true; W.add(new THREE.Mesh(rimG, rimD)); for (let i = 0; i < 5; i++) { const sp = new THREE.Mesh(new THREE.BoxGeometry(.262, .2, .055), rimM); sp.geometry.translate(0, .1, 0); sp.rotation.x = i * 1.2566; W.add(sp); } G.add(W); wheels.push(W); const ar = a(archG, blackT, false); ar.position.set(wx + Math.sign(wx) * .1, .39, wz); }
  const brake = new THREE.MeshStandardMaterial({ color: '#4a0a08', emissive: '#ff0800', emissiveIntensity: .2, roughness: .25 }); const tail = new RoundedBoxGeometry(.42, .09, .05, 3, .02), head = new RoundedBoxGeometry(.4, .075, .05, 3, .02); const headM = new THREE.MeshStandardMaterial({ color: '#dfe6ea', emissive: '#fff4d8', emissiveIntensity: .8, roughness: .1 });
  for (const s of [-1, 1]) { const t = a(tail, brake, false); t.position.set(s * .58, .88, -2.2); t.rotation.y = s * -.22; const h = a(head, headM, false); h.position.set(s * .58, .74, 2.12); h.rotation.y = s * -.3; }
  const grille = a(new RoundedBoxGeometry(.78, .11, .05, 2, .03), std('#0c0d0f', .35), false); grille.position.set(0, .5, 2.28); const pl = a(new RoundedBoxGeometry(.5, .11, .02, 1, .006), std('#d9dbdc', .5), false); pl.position.set(0, .58, -2.38);
  return { G, wheels, brake, paintM, ...ex };
}
// ======= film: timed on the spoken words (hf/225/ev.json). Slow motion: a millisecond clock (crash time) runs far slower than the film =======
const D = await (await fetch(q.get('ev') || '/hf/225/ev.json')).json(), EV = D.ev, END = D.dur;
const HX = 1.85, V0 = 15.6;              // test run at 35 mph into a barrier
const hero = sedan('#8e1f22');
// crash clock: 0 ms on "hits"; ~30 ms by "fire"; inflated by "fills"; venting, dust; real time again at the end
const MS = [[0, -2600], [EV.s_hits, 0], [EV.s_fire + .2, 28], [EV.f_fills + .3, 58], [EV.v_sink + .4, 95], [EV.d_unfold + .5, 140], [EV.u_wall, 160], [END, 160]];
const msAt = t => { for (let i = 1; i < MS.length; i++) if (t <= MS[i][0]) { const [a, x] = MS[i - 1], [b, y] = MS[i], u = clamp((t - a) / (b - a)); return x + (y - x) * u; } return 160; };
// distance to the barrier: the car drives in at 35 mph until 0 ms, crushes 0.45 m in the first 60 ms
const zCar = t => { const ms = msAt(t); if (ms < 0) return ms / 1000 * V0; return .3 * (1 - Math.exp(-ms / 22)); };
const BARRIER = 2.36 + .3 + .28;                // barrier face in front of the bumper at 0 ms
const barrier = new THREE.Group(); scene.add(barrier);
{ const cM = std('#c7c2b6', .92, 0, { envMapIntensity: .6, roughnessMap: asphR, normalMap: asphN }); for (const s of [-1, 0, 1]) { const b = new THREE.Mesh(new RoundedBoxGeometry(1.6, .95, .55, 4, .06), cM); b.position.set(HX + s * 1.62, .475, 0); b.castShadow = b.receiveShadow = true; barrier.add(b); } const stripe = new THREE.MeshStandardMaterial({ color: '#f0c419', roughness: .5 }); for (let i = 0; i < 5; i++) { const s2 = new THREE.Mesh(new THREE.BoxGeometry(.22, .1, .01), stripe); s2.position.set(HX - 1.6 + i * .8, .78, -.285); s2.rotation.z = .5; barrier.add(s2); } }
const crumple = t => clamp(msAt(t) / 60);
// cockpit (from #224) + the airbag module in the hub
let headliner; const cabin = new THREE.Group(); hero.G.add(cabin); cabin.visible = false; const wheelG = new THREE.Group();
const add2 = (g, m, x, y, z, par = cabin) => { const o = new THREE.Mesh(g, m); o.position.set(x, y, z); o.castShadow = o.receiveShadow = true; par.add(o); return o; };
{ const dashM = std('#25272c', .7), softM = std('#34363c', .85), trim = std('#1b1c20', .35, .3);
  add2(new RoundedBoxGeometry(1.72, .3, .85, 6, .13), dashM, 0, .88, .95); add2(new RoundedBoxGeometry(1.72, .08, .1, 3, .03), trim, 0, .78, .5);
  const hood = add2(new RoundedBoxGeometry(1.78, .1, 1.6, 6, .05), hero.paintM, 0, .92, 2.12); hood.rotation.x = .05; add2(new RoundedBoxGeometry(.56, .08, .15, 4, .03), dashM, -.36, 1.15, .52);
  for (const sx of [-1, 1]) { const p = add2(new RoundedBoxGeometry(.11, 1.05, .1, 3, .03), softM, sx * .76, 1.24, .9); p.rotation.x = -.75; p.rotation.z = sx * .09; add2(new RoundedBoxGeometry(.14, .68, 2.6, 3, .05), softM, sx * .86, .83, -.3); const seat = add2(new RoundedBoxGeometry(.5, .72, .16, 5, .07), std('#2a2c31', .92), sx * .37, .92, -.72); seat.rotation.x = -.14; add2(new RoundedBoxGeometry(.5, .15, .56, 5, .07), std('#2a2c31', .92), sx * .37, .52, -.42); }
  headliner = add2(new RoundedBoxGeometry(1.5, .05, 1.5, 3, .02), std('#6d6a64', .92), 0, 1.42, -.25);
  wheelG.position.set(-.36, .86, .24); wheelG.rotation.x = .38; cabin.add(wheelG); const tor = new THREE.Mesh(new THREE.TorusGeometry(.19, .022, 18, 64), std('#141518', .5)); tor.castShadow = true; wheelG.add(tor); for (const a of [2.67, .47, -1.57]) { const sp = new THREE.Mesh(new RoundedBoxGeometry(.18, .032, .014, 2, .006), std('#1f2024', .45)); sp.position.set(Math.cos(a) * .095, Math.sin(a) * .095, 0); sp.rotation.z = a; wheelG.add(sp); }
}
// hub: two cover flaps, the inflator can with its igniter, the folded/inflating bag
const flapM = std('#1b1c20', .5), flaps = [-1, 1].map(s => { const g = new THREE.Group(); g.position.set(0, s * .05, -.01); wheelG.add(g); const f = new THREE.Mesh(new RoundedBoxGeometry(.13, .05, .02, 3, .01), flapM); f.position.set(0, s * .025, -.012); f.castShadow = true; g.add(f); g.userData.s = s; return g; });
const can = new THREE.Mesh(new THREE.CylinderGeometry(.04, .04, .03, 32), std('#9ea2a6', .3, .9)); can.rotation.x = Math.PI / 2; can.position.set(0, 0, .03); wheelG.add(can);
const igniteM = new THREE.MeshBasicMaterial({ color: new THREE.Color(6, 2.2, .4), transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false }); const ign = new THREE.Mesh(new THREE.SphereGeometry(.03, 16, 12), igniteM); ign.position.set(0, 0, .0); wheelG.add(ign);
const bagG = new THREE.SphereGeometry(1, 96, 64); { const p = bagG.attributes.position; for (let i = 0; i < p.count; i++) { const x = p.getX(i), y = p.getY(i), z = p.getZ(i); const fold = .035 * Math.sin(x * 9 + y * 4) * Math.cos(y * 11 - z * 3) + .02 * Math.sin(Math.atan2(y, x) * 14) * (1 - Math.abs(z)); const k = 1 + fold; p.setXYZ(i, x * k, y * k, z * k); } bagG.computeVertexNormals(); }
const bagM = new THREE.MeshPhysicalMaterial({ color: '#e9e6df', roughness: .82, sheen: 1, sheenRoughness: .6, sheenColor: new THREE.Color('#ffffff'), envMapIntensity: .8 });
const bag = new THREE.Mesh(bagG, bagM); bag.castShadow = true; bag.receiveShadow = true; wheelG.add(bag); bag.visible = false;
// gas inside (seen through a cut), vents, dust
const glowT = (() => { const c = document.createElement('canvas'); c.width = c.height = 128; const g = c.getContext('2d'), r = g.createRadialGradient(64, 64, 0, 64, 64, 64); r.addColorStop(0, 'rgba(255,255,255,1)'); r.addColorStop(.35, 'rgba(255,255,255,.45)'); r.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = r; g.fillRect(0, 0, 128, 128); return new THREE.CanvasTexture(c); })();
const puffs = Array.from({ length: 70 }, (_, i) => { const m = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowT, color: new THREE.Color(1, 1, 1), transparent: true, depthWrite: false, opacity: 0 })); m.visible = false; scene.add(m); m.userData = { a: rnd() * 6.28, b: rnd() - .5, r: rnd(), s: .4 + rnd() * .8 }; return m; });
const gas = Array.from({ length: 30 }, () => { const m = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowT, color: new THREE.Color(.7, 1.4, 2.6), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0 })); m.visible = false; scene.add(m); m.userData = { a: rnd() * 6.28, r: rnd(), z: rnd() }; return m; });
// control unit under the console: a box with a chip whose proof mass swings on the impact
const acu = new THREE.Group(); hero.G.add(acu); acu.position.set(0, .45, .2);
{ add2(new RoundedBoxGeometry(.16, .045, .12, 3, .01), std('#2c2f35', .45, .6), 0, 0, 0, acu); add2(new RoundedBoxGeometry(.13, .006, .09, 2, .002), std('#1d5a3a', .5), 0, .026, 0, acu); add2(new RoundedBoxGeometry(.03, .006, .03, 2, .002), std('#111214', .3), .02, .032, .01, acu); }
const massM = new THREE.MeshStandardMaterial({ color: '#c9ccd0', roughness: .3, metalness: .9, emissive: '#ff6a2a', emissiveIntensity: 0 }); const mass = add2(new RoundedBoxGeometry(.012, .004, .012, 2, .001), massM, .02, .038, .01, acu);
const KEY = (t, p, l, r) => [t, p, l, r];
const CK = [
 KEY(0, [3.6, 1.0, -6.5], [0, .7, 3], 1), KEY(EV.o_time - .4, [3.2, .95, -2.4], [0, .6, 4], 1), KEY(EV.s_hits, [3.4, .95, .4], [0, .6, 2.6], 1), KEY(EV.s_sens - .3, [2.6, 1.1, 1.2], [0, .55, 2], 1),
 KEY(EV.s_stop, [.2, .62, .52], [0, .46, .2], 1), KEY(EV.s_unit, [.12, .55, .34], [0, .47, .2], 1), KEY(EV.s_fire, [.1, .54, .3], [.01, .47, .21], 1),
 KEY(EV.f_fires - .1, [-.36, 1.18, -.5], [-.36, .9, .3], 1), KEY(EV.f_ign, [.12, 1.06, -.05], [-.36, .86, .24], 1), KEY(EV.f_wheel, [.18, 1.08, -.1], [-.36, .86, .2], 1), KEY(EV.f_nitro, [.32, 1.14, .02], [-.4, .9, .1], 1), KEY(EV.f_ms + .4, [.36, 1.16, -.05], [-.4, .92, .08], 1),
 KEY(EV.v_rock, [.36, 1.16, -.05], [-.4, .92, .08], 1), KEY(EV.v_vents, [.28, .98, .3], [-.36, .86, .1], 1), KEY(EV.v_sink, [.34, 1.18, -.2], [-.4, .92, .08], 1),
 KEY(EV.d_dust, [-.1, 1.28, -.5], [-.36, .95, .15], 1), KEY(EV.d_unfold, [.05, 1.3, -.52], [-.36, .97, .15], 1),
 KEY(EV.u_wall - .6, [4.2, 1.6, -1.5], [0, .55, 2.4], 1), KEY(EV.u_14, [4.6, 1.8, -2.8], [0, .55, 2.4], 1), KEY(EV.u_child, [4.8, 2, -3.3], [0, .6, 2.2], 1), KEY(END + .1, [5.2, 2.3, -4], [0, .65, 2], 1),
];
for (let i = 1; i < CK.length; i++) CK[i][0] = Math.max(CK[i][0], CK[i - 1][0] + .08);
const inCar = t => t > EV.f_fires - .25 && t < EV.u_wall - .7;
const camAt = t => {
  const P = CK.map(k => { const f = v => new THREE.Vector3(v[0] + HX, v[1], v[2] + hero.G.position.z); return { t: k[0], p: f(k[1]), l: f(k[2]) }; });
  let i = 0; while (i < P.length - 2 && t > P[i + 1].t) i++;
  const b = P[i], c = P[i + 1], h = c.t - b.t, u = clamp((t - b.t) / h), u2 = u * u, u3 = u2 * u, ax = ['x', 'y', 'z'];
  const slope = (j, f, a) => { const pv = P[j - 1], nx = P[j + 1]; if (!pv || !nx) return 0; const d0 = (f(P[j])[a] - f(pv)[a]) / (P[j].t - pv.t), d1 = (f(nx)[a] - f(P[j])[a]) / (nx.t - P[j].t); if (d0 * d1 <= 0) return 0; const h0 = P[j].t - pv.t, h1 = nx.t - P[j].t; return 3 * (h0 + h1) / ((2 * h1 + h0) / d0 + (h1 + 2 * h0) / d1); };
  const cr = f => { const o = new THREE.Vector3(); for (const a of ax) o[a] = (2 * u3 - 3 * u2 + 1) * f(b)[a] + (u3 - 2 * u2 + u) * h * slope(i, f, a) + (-2 * u3 + 3 * u2) * f(c)[a] + (u3 - u2) * h * slope(i + 1, f, a); return o; };
  return { p: cr(k => k.p), l: cr(k => k.l) };
};
const bagScale = ms => { const f = ss(30, 58, ms), d = 1 - .22 * ss(62, 140, ms); return f * d; };
function setWorld(t) {
  const ms = msAt(t), zc = zCar(t); scrollRoad(0); hero.G.position.set(HX, 0, zc); barrier.position.z = BARRIER; hero.wheels.forEach(W => W.rotation.x = zc / .345);
  hero.G.rotation.x = -.025 * Math.sin(clamp(ms / 70) * Math.PI); // nose dips on impact
  hero.brake.emissiveIntensity = ms > -900 ? 6 : .2;
  const ins = inCar(t); hero.G.children.forEach(o => { if (o !== cabin && o !== acu) o.visible = !ins; }); cabin.visible = ins; acu.visible = !ins || true; headliner.visible = true;
  cam.fov = 34 + 26 * ss(EV.f_fires - .3, EV.f_fires, t) * (1 - ss(EV.u_wall - .8, EV.u_wall - .5, t));
  // sensor: proof mass swings forward on impact, glows when the unit decides
  mass.position.z = .01 + .006 * Math.sin(clamp(ms / 12) * Math.PI / 2) * (1 - clamp((ms - 40) / 40)); massM.emissiveIntensity = 4 * ss(EV.s_unit - .1, EV.s_unit + .2, t) * (1 - ss(EV.f_fires, EV.f_fires + .6, t));
  // igniter flash, flaps open, bag grows toward the driver
  igniteM.opacity = ss(26, 29, ms) * (1 - ss(31, 40, ms)) * 1; const open = ss(30, 36, ms); flaps.forEach(g => { g.rotation.x = g.userData.s * open * 1.5; });
  const sc = bagScale(ms); bag.visible = sc > .01; if (bag.visible) { const swell = 1 + .025 * Math.sin(ms * .4) * (1 - ss(60, 100, ms)); bag.scale.set(.31 * sc * swell, .3 * sc * swell, .2 * sc); bag.position.set(0, 0, -.2 * sc); bag.rotation.z = .2; }
  // gas: blue glow pouring out of the can into the bag
  const W = new THREE.Vector3(); wheelG.updateWorldMatrix(true, false); const gOn = ms > 28 && ms < 75 && t > EV.f_nitro - .4; gas.forEach(m => { m.visible = gOn; if (!gOn) return; const u = ((ms * .05 + m.userData.z) % 1); W.set(Math.cos(m.userData.a) * .25 * u * sc, Math.sin(m.userData.a) * .22 * u * sc, -.04 - .3 * u * sc).applyMatrix4(wheelG.matrixWorld); m.position.copy(W); m.scale.setScalar(.03 + .05 * u); m.material.opacity = (1 - u) * .55; });
  // vents puffing grey, then the white dust cloud
  const vOn = ms > 55, dOn = t > EV.v_vents - .6; puffs.forEach((m, i) => { const ud = m.userData, isDust = i > 18; const on = isDust ? dOn && ms > 60 : vOn && t > EV.v_vents - .3; m.visible = on; if (!on) return; const life = isDust ? clamp((ms - 60) / 100) : ((ms * .02 + ud.r) % 1); W.set(isDust ? Math.cos(ud.a) * (.12 + .5 * life) * ud.s : (ud.b > 0 ? .2 : -.2) * (1 + life), isDust ? Math.sin(ud.a) * (.1 + .3 * life) * ud.s + .05 * life : -.06 + ud.b * .08, isDust ? -.2 - .35 * life * ud.r : .05 + .18 * life).applyMatrix4(wheelG.matrixWorld); m.position.copy(W); m.scale.setScalar((isDust ? .06 : .05) + (isDust ? .22 : .16) * life); m.material.opacity = (isDust ? .38 * (1 - life * .6) : .35 * (1 - life)); m.material.color.setScalar(isDust ? 1.5 : 1.1); });
}
const drawScreen = () => {};
// ---- type ----
const o = ov.getContext('2d');
const LBL = [
 { from: EV.s_sens - .1, to: EV.s_unit - .1, txt: 'ACCELERATION SENSOR', sub: 'A TINY MASS SWINGS FORWARD', at: () => new THREE.Vector3().setFromMatrixPosition(mass.matrixWorld) },
 { from: EV.s_unit, to: EV.f_fires - .3, txt: 'CONTROL UNIT', sub: 'FIRE OR DON’T?', at: () => new THREE.Vector3().setFromMatrixPosition(acu.matrixWorld) },
 { from: EV.f_ign, to: EV.f_nitro - .1, txt: 'IGNITER + CHARGE', sub: 'INSIDE THE STEERING WHEEL', at: () => new THREE.Vector3().setFromMatrixPosition(can.matrixWorld) },
 { from: EV.f_nitro, to: EV.f_fills, txt: 'NITROGEN GAS', sub: 'FILLS THE BAG', at: () => new THREE.Vector3().setFromMatrixPosition(bag.matrixWorld) },
 { from: EV.v_vents - .05, to: EV.v_sink + .2, txt: 'VENTS', sub: 'GAS ESCAPES, BAG SOFTENS', at: () => new THREE.Vector3(.2, -.06, .05).applyMatrix4(wheelG.matrixWorld) },
];
const CAPS = D.caps.flat(), LINES = []; { let cur = []; for (const w of CAPS) { cur.push(w); if (cur.length >= 4 || /[.,?:]$/.test(w.w)) { LINES.push(cur); cur = []; } } if (cur.length) LINES.push(cur); }
function stamp(txt, sub, a, k, col = '#ffc85a', y = 380, size = 120) { if (a <= 0) return; o.save(); o.translate(540, y); o.scale(k, k); o.globalAlpha = a; o.textAlign = 'center'; o.shadowColor = 'rgba(0,0,0,.75)'; o.shadowBlur = 22; o.font = size + 'px AB'; o.fillStyle = col; o.fillText(txt, 0, 0); o.shadowBlur = 0; if (sub) { o.font = '700 38px Inter'; const w = o.measureText(sub).width; o.fillStyle = 'rgba(6,9,16,.68)'; o.beginPath(); o.roundRect(-w / 2 - 22, 36, w + 44, 60, 18); o.fill(); o.fillStyle = '#fff'; o.fillText(sub, 0, 80); } o.restore(); o.globalAlpha = 1; }
function drawOverlay(t) {
  o.clearRect(0, 0, 1080, 1920); o.textBaseline = 'alphabetic'; o.shadowBlur = 0;
  o.font = '500 21px Mono'; o.fillStyle = 'rgba(255,255,255,.8)'; o.textAlign = 'right'; o.fillText('ILLUSTRATION · SLOW MOTION', 1030, 128);
  const tA = 1 - ss(EV.o_time - .2, EV.s_hits - .1, t); if (tA > 0) { o.globalAlpha = tA; o.textAlign = 'center'; o.shadowColor = 'rgba(0,0,0,.7)'; o.shadowBlur = 24; o.font = '96px AB'; o.fillStyle = '#ffc85a'; o.fillText('0.04 SECONDS', 540, 340); o.fillStyle = '#fff'; o.fillText('TO SAVE YOU', 540, 452); o.shadowBlur = 0; o.globalAlpha = 1; }
  // crash clock
  const ms = msAt(t), cA = ss(EV.s_hits - .15, EV.s_hits, t) * (1 - ss(EV.u_wall - .7, EV.u_wall - .4, t)); if (cA > 0) { o.globalAlpha = cA; o.fillStyle = 'rgba(6,10,18,.72)'; o.beginPath(); o.roundRect(330, 250, 420, 128, 28); o.fill(); o.textAlign = 'center'; o.fillStyle = '#7fd3ff'; o.font = '500 24px Mono'; o.fillText('SINCE IMPACT', 540, 290); o.fillStyle = '#fff'; o.font = '74px AB'; o.fillText(Math.max(0, Math.round(ms)) + ' ms', 540, 360); o.globalAlpha = 1; }
  const v = new THREE.Vector3();
  for (const L of LBL) { const a = ss(L.from, L.from + .2, t) * (1 - ss(L.to - .18, L.to, t)); if (a <= 0) continue; v.copy(L.at(t)).project(cam); if (v.z > 1) continue; const x = clamp((v.x + 1) * 540, 110, 970), y = clamp((1 - v.y) * 960, 720, 1330), right = x < 540, tx = x + (right ? 70 : -70), ty = y - 120; o.globalAlpha = a; o.strokeStyle = '#fff'; o.lineWidth = 2.5; o.beginPath(); o.moveTo(x, y - 6); o.lineTo(tx, ty); o.stroke(); o.fillStyle = '#fff'; o.beginPath(); o.arc(x, y - 6, 6, 0, 7); o.fill(); o.textAlign = right ? 'left' : 'right'; const dx = right ? 8 : -8; o.shadowColor = 'rgba(0,0,0,.85)'; o.shadowBlur = 14; o.font = '700 40px Inter'; o.fillStyle = '#ffc85a'; o.fillText(L.txt, tx + dx, ty - 28); o.font = '500 25px Mono'; o.fillStyle = '#fff'; o.fillText(L.sub, tx + dx, ty + 4); o.shadowBlur = 0; o.globalAlpha = 1; }
  stamp('FIRE?', null, ss(EV.s_fire - .05, EV.s_fire + .1, t) * (1 - ss(EV.f_fires - .2, EV.f_fires, t)), 1, '#ff5a4c', 480, 110);
  stamp('POWDER', 'CORNSTARCH OR TALC', ss(EV.d_corn - .1, EV.d_corn + .1, t) * (1 - ss(EV.u_wall - .9, EV.u_wall - .6, t)), 1, '#ffffff', 480, 100);
  stamp('14 MPH', 'WALL CRASH: FRONT AIRBAGS MUST FIRE', ss(EV.u_14 - .05, EV.u_14 + .1, t) * (1 - ss(EV.u_never - .3, EV.u_never - .05, t)), 1.3 - .3 * ss(EV.u_14 - .05, EV.u_14 + .15, t), '#ffc85a', 380, 140);
  stamp('NEVER', 'REAR-FACING CHILD SEAT IN FRONT OF AN AIRBAG', ss(EV.u_never - .05, EV.u_never + .1, t) * (1 - ss(EV.e_fast - .4, EV.e_fast - .1, t)), 1.3 - .3 * ss(EV.u_never - .05, EV.u_never + .15, t), '#ff5a4c', 380, 140);
  const fA = ss(EV.e_fast - .15, EV.e_fast + .15, t); if (fA > 0) { o.globalAlpha = fA; o.textAlign = 'center'; o.shadowColor = 'rgba(0,0,0,.75)'; o.shadowBlur = 22; o.font = '74px AB'; o.fillStyle = '#fff'; o.fillText('KNEW IT WAS', 540, 300); o.fillStyle = '#ffc85a'; o.fillText('THIS FAST?', 540, 388); o.shadowBlur = 0;
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
const SHUTTER = .2 / 30;
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
