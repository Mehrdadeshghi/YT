// Look test: offline accumulation renderer on plain WebGL. Each frame averages N jittered renders:
// lens jitter = real depth of field, light jitter = true soft shadows, time jitter = motion blur. Every frame is a pure function of t.
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

const q = new URLSearchParams(location.search);
const W = +(q.get('w') || 540), H = +(q.get('h') || 960), N = +(q.get('n') || 12);
const cv = document.getElementById('gl'), ov = document.getElementById('ov');
ov.width = 1080; ov.height = 1920;
for (const c of [cv, ov]) { c.style.width = W + 'px'; c.style.height = H + 'px'; }
const R = new THREE.WebGLRenderer({ canvas: cv, antialias: false, preserveDrawingBuffer: true });
R.setSize(W, H, false);
R.shadowMap.enabled = true; R.shadowMap.type = THREE.PCFSoftShadowMap;
R.outputColorSpace = THREE.LinearSRGBColorSpace; R.toneMapping = THREE.NoToneMapping;
const scene = new THREE.Scene();
const cam = new THREE.PerspectiveCamera(38, W / H, .1, 3000);

// deterministic random
let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
const halton = (i, b) => { let f = 1, r = 0; while (i > 0) { f /= b; r += f * (i % b); i = Math.floor(i / b); } return r; };
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const ss = (a, b, x) => { const u = clamp((x - a) / (b - a)); return u * u * (3 - 2 * u); };

// sky + image-based light
const skyTop = new THREE.Color('#3f86d8'), skyLow = new THREE.Color('#f4d9b8');
const skyMat = new THREE.ShaderMaterial({ side: THREE.BackSide, depthWrite: false, fog: false,
  uniforms: { a: { value: skyLow }, b: { value: skyTop } },
  vertexShader: 'varying vec3 d;void main(){d=normalize(position);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
  fragmentShader: `varying vec3 d;uniform vec3 a,b;
float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);float A=fract(sin(dot(i,vec2(127.1,311.7)))*43758.5),B=fract(sin(dot(i+vec2(1,0),vec2(127.1,311.7)))*43758.5),C=fract(sin(dot(i+vec2(0,1),vec2(127.1,311.7)))*43758.5),D=fract(sin(dot(i+vec2(1,1),vec2(127.1,311.7)))*43758.5);return mix(mix(A,B,f.x),mix(C,D,f.x),f.y);}
float fbm(vec2 p){float v=0.,w=.5;for(int i=0;i<5;i++){v+=w*n(p);p*=2.03;w*=.5;}return v;}
void main(){vec3 u=normalize(d);float h=clamp(u.y,0.,1.);vec3 c=mix(a,b,pow(h*2.2,.5)*.9);c=mix(c,b,smoothstep(.0,.5,h));
vec2 p=u.xz/(u.y+.14)*1.5;float cl=smoothstep(.5,.78,fbm(p+3.))*smoothstep(.01,.12,u.y);c=mix(c,vec3(1.35,1.27,1.18),cl*.9);
float s=max(dot(u,normalize(vec3(.62,.34,-.7))),0.);c+=vec3(1.,.74,.48)*(pow(s,14.)*.5+pow(s,300.)*5.);gl_FragColor=vec4(c,1.);}` });
const sky = new THREE.Mesh(new THREE.SphereGeometry(1500, 32, 16), skyMat); scene.add(sky);
{ const es = new THREE.Scene(); es.add(new THREE.Mesh(new THREE.SphereGeometry(100, 32, 16), skyMat.clone()));
  const g = new THREE.Mesh(new THREE.CircleGeometry(100, 32), new THREE.MeshBasicMaterial({ color: '#7f8a6a' })); g.rotation.x = -Math.PI / 2; g.position.y = -1; es.add(g);
  const pm = new THREE.PMREMGenerator(R); scene.environment = pm.fromScene(es, 0.02).texture; pm.dispose(); }
scene.fog = new THREE.Fog('#f0d9bd', 350, 1500);

const sun = new THREE.DirectionalLight('#ffdcae', 4.6), fill = new THREE.DirectionalLight('#bcd6ff', .55);
for (const l of [sun, fill]) { l.castShadow = true; l.shadow.mapSize.set(2048, 2048); l.shadow.bias = -.0004; l.shadow.normalBias = .02; scene.add(l, l.target); }

// materials
const std = (color, rough = .6, metal = 0, extra = {}) => new THREE.MeshStandardMaterial({ color, roughness: rough, metalness: metal, ...extra });
const tex = (w, h, draw, rep) => { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.wrapS = t.wrapT = THREE.RepeatWrapping; if (rep) t.repeat.set(...rep); t.anisotropy = 8; return t; };
const speck = (a, b, n) => (g, w, h) => { g.fillStyle = a; g.fillRect(0, 0, w, h); for (let i = 0; i < n; i++) { g.fillStyle = b[(rnd() * b.length) | 0]; g.globalAlpha = .12 + rnd() * .3; const s = 1 + rnd() * 2.2; g.fillRect(rnd() * w, rnd() * h, s, s); } g.globalAlpha = 1; };

// road (runs along z, traffic drives towards +z, the jam is at z≈0)
const asphalt = std(0xffffff, .92, 0, { map: tex(512, 512, speck('#3f4249', ['#2f3238', '#5c5f66', '#35383e'], 30000), [24, 1200]) });
const road = new THREE.Mesh(new THREE.PlaneGeometry(14, 2800), asphalt); road.rotation.x = -Math.PI / 2; road.position.set(0, 0, -1000); road.receiveShadow = true; scene.add(road);
const road2 = road.clone(); road2.position.x = 19; scene.add(road2);
const grassM = std(0xffffff, 1, 0, { map: tex(512, 512, speck('#6f9a3f', ['#5d8a33', '#86ae4f', '#4e7a2a'], 26000), [90, 160]) });
for (const [a, b] of [[-900, -7], [7, 12], [26, 900]]) { const g = new THREE.Mesh(new THREE.PlaneGeometry(b - a, 2800), grassM); g.rotation.x = -Math.PI / 2; g.position.set((a + b) / 2, -.002, -1000); g.receiveShadow = true; scene.add(g); }
const white = std('#f6f4ee', .55);
const addBoxes = (geo, mat, list, shadow = true) => { const m = new THREE.InstancedMesh(geo, mat, list.length); const d = new THREE.Object3D(); list.forEach((p, i) => { d.position.set(p[0], p[1], p[2]); d.rotation.set(0, p[4] || 0, 0); d.scale.setScalar(p[3] || 1); d.updateMatrix(); m.setMatrixAt(i, d.matrix); }); m.castShadow = shadow; m.receiveShadow = true; m.frustumCulled = false; scene.add(m); return m; };
{ const dash = [], edge = [], post = [], rail = [];
  for (let z = 80; z > -2300; z -= 12) dash.push([0, .012, z]);
  addBoxes(new THREE.BoxGeometry(.16, .01, 5), white, dash, false);
  for (const x of [-6.6, 6.6]) { const e = new THREE.Mesh(new THREE.BoxGeometry(.2, .01, 2800), white); e.position.set(x, .012, -1000); e.receiveShadow = true; scene.add(e); }
  for (let z = 80; z > -2300; z -= 4) post.push([-8, .38, z]);
  addBoxes(new THREE.BoxGeometry(.09, .76, .09), std('#a9adb2', .45, .8), post);
  const r = new THREE.Mesh(new RoundedBoxGeometry(.05, .3, 2800, 2, .02), std('#c4c8cc', .3, .9)); r.position.set(-8, .68, -1000); r.castShadow = true; scene.add(r);
  // central rail + trees
  const r2 = r.clone(); r2.position.x = 9; scene.add(r2);
  const crowns = [], trunks = [];
  for (let i = 0; i < 520; i++) { const side = rnd() < .5 ? -1 : 1; const x = side * (15 + rnd() * rnd() * 150) + (side > 0 ? 22 : 0), z = 90 - rnd() * 2300, s = 3 + rnd() * 3.4; crowns.push([x, s * 1.45, z, s]); trunks.push([x, s * .5, z, s]); }
  const crownGeo = new THREE.SphereGeometry(1, 28, 20);
  const pos = crownGeo.attributes.position; for (let i = 0; i < pos.count; i++) { const v = new THREE.Vector3().fromBufferAttribute(pos, i), k = 1 + .09 * Math.sin(v.x * 5 + v.y * 3) * Math.cos(v.z * 4); pos.setXYZ(i, v.x * k, v.y * k * 1.15, v.z * k); } crownGeo.computeVertexNormals();
  const cm = addBoxes(crownGeo, std(0xffffff, .95), crowns);
  const col = new THREE.Color(), pal = ['#5f8a43', '#6f9a4c', '#4f7a3c', '#86a653', '#a0b159'];
  crowns.forEach((_, i) => cm.setColorAt(i, col.set(pal[(rnd() * pal.length) | 0])));
  addBoxes(new THREE.CylinderGeometry(.09, .13, 1, 8), std('#6d5745', .95), trunks);
  // soft hills on the horizon
  for (let i = 0; i < 24; i++) { const h = new THREE.Mesh(new THREE.SphereGeometry(1, 24, 12), std('#7f9f72', 1)); const side = i % 2 ? 1 : -1; h.position.set(side * (520 + rnd() * 300), 0, 200 - i * 110); h.scale.set(170 + rnd() * 90, 26 + rnd() * 40, 150); scene.add(h); }
}

// ------- car (original stylised hatchback) -------
// lofted soft body: station along length, superellipse cross-section (one smooth skin, no box corners)
const lerpTab = (tab, u) => { let i = 0; while (i < tab.length - 2 && u > tab[i + 1][0]) i++; const [a, x] = tab[i], [b, y] = tab[i + 1], k = clamp((u - a) / (b - a)), e = k * k * (3 - 2 * k); return x + (y - x) * e; };
function loft(L, wTab, topTab, lowTab, ex, ny = 56, nt = 48, z0 = 0) {
  const P = [], I = [];
  for (let i = 0; i <= ny; i++) { const a = i / ny, u = .5 - .5 * Math.cos(a * Math.PI); const w = lerpTab(wTab, u), top = lerpTab(topTab, u), low = lerpTab(lowTab, u), cy = (top + low) / 2, hh = (top - low) / 2;
    for (let j = 0; j <= nt; j++) { const th = j / nt * Math.PI * 2, c = Math.cos(th), s = Math.sin(th); P.push(Math.sign(c) * Math.abs(c) ** (2 / ex) * w / 2, cy + Math.sign(s) * Math.abs(s) ** (2 / ex) * hh, z0 + (u - .5) * L); } }
  for (let i = 0; i < ny; i++) for (let j = 0; j < nt; j++) { const a = i * (nt + 1) + j, b = a + nt + 1; I.push(a, a + 1, b, b, a + 1, b + 1); }
  const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(P, 3)); g.setIndex(I); g.computeVertexNormals(); return g;
}
// back (u=0) to front (u=1)
const bodyG = loft(4.1, [[0, .05], [.05, 1.66], [.16, 1.88], [.82, 1.88], [.95, 1.64], [1, .05]], [[0, .62], [.05, .92], [.14, 1.12], [.62, 1.1], [.8, 1.02], [.96, .84], [1, .58]], [[0, .5], [.05, .25], [.95, .25], [1, .45]], 4.6);
const glassG = loft(2.95, [[0, .1], [.08, 1.5], [.82, 1.56], [1, .1]], [[0, 1.14], [.1, 1.5], [.22, 1.6], [.62, 1.6], [.86, 1.34], [1, 1.04]], [[0, 1.02], [1, 1.0]], 4.2, 40, 40, -.1);
const roofG = loft(1.62, [[0, .1], [.1, 1.3], [.9, 1.34], [1, .1]], [[0, 1.58], [.14, 1.645], [.86, 1.645], [1, 1.57]], [[0, 1.55], [1, 1.54]], 3, 24, 32, -.38);
const finS = new THREE.Shape(); finS.moveTo(-.24, 0); finS.quadraticCurveTo(-.22, .15, -.13, .19); finS.quadraticCurveTo(.02, .16, .25, 0); finS.closePath();
const finG = new THREE.ExtrudeGeometry(finS, { depth: .05, bevelEnabled: true, bevelSize: .035, bevelThickness: .035, bevelSegments: 8, curveSegments: 20 }); finG.translate(0, 0, -.025); finG.rotateY(-Math.PI / 2); finG.translate(0, 1.625, -.95);
const archG = new THREE.CylinderGeometry(.47, .47, .08, 32); archG.rotateZ(Math.PI / 2);
const tyreG = new THREE.CylinderGeometry(.385, .385, .26, 32); tyreG.rotateZ(Math.PI / 2);
const hubG = new THREE.CylinderGeometry(.215, .215, .27, 24); hubG.rotateZ(Math.PI / 2);
const tyreM = std('#1d1e21', .86), hubM = std('#c9ccd0', .28, .9), glassM = std('#141a22', .07, .3), trimM = std('#23252a', .6);
const finM = std('#23252a', .35);
const lampBack = new RoundedBoxGeometry(.5, .13, .06, 3, .025), lampFront = new RoundedBoxGeometry(.42, .12, .06, 3, .025);
const headM = std('#fff8e6', .2, 0, { emissive: '#fff2cf', emissiveIntensity: .7 });
const cars = [];
function car(color, x, zf, opts = {}) {
  const G = new THREE.Group(), add = (g, m, sh = true) => { const o = new THREE.Mesh(g, m); o.castShadow = sh; o.receiveShadow = true; G.add(o); return o; };
  const paint = std(color, .3, .1, { envMapIntensity: 1.25 });
  add(bodyG, paint); const gl = add(glassG, opts.glass || glassM); const rf = add(roofG, paint); const fin = add(finG, finM); for (const s of [-1, 1]) { const bp = add(new THREE.BoxGeometry(.05, .56, .12), paint); bp.position.set(s * .76, 1.32, -.42); bp.rotation.z = s * .1; }
  const wheels = [];
  for (const [wx, wz] of [[-.8, 1.3], [.8, 1.3], [-.8, -1.3], [.8, -1.3]]) { const W = new THREE.Group(); W.position.set(wx, .385, wz); const arch = new THREE.Mesh(archG, trimM); arch.position.set(wx + Math.sign(wx) * .1, .42, wz); G.add(arch); const t = new THREE.Mesh(tyreG, tyreM); t.castShadow = true; const h = new THREE.Mesh(hubG, hubM); W.add(t, h); for (let i = 0; i < 5; i++) { const sp = new THREE.Mesh(new THREE.BoxGeometry(.27, .03, .05), trimM); sp.rotation.x = i * 1.257; sp.position.set(0, 0, 0); W.add(sp); } G.add(W); wheels.push(W); }
  const brakeM = std('#7a1712', .25, 0, { emissive: '#ff0800', emissiveIntensity: 0 });
  for (const s of [-1, 1]) { const b = add(lampBack, brakeM, false); b.position.set(s * .58, .86, -1.86); const f = add(lampFront, headM, false); f.position.set(s * .58, .76, 1.86); }
    G.position.set(x, 0, zf); scene.add(G);
  const ext = [...G.children]; const c = { G, wheels, brakeM, gl, rf, fin, x, ext, ...opts }; cars.push(c); return c;
}

// ======= the film: everything below is timed on the spoken words (hf/222/ev.json from scripts/hf222.py) =======
const D = await (await fetch(q.get('ev') || '/hf/222/ev.json')).json(), EV = D.ev, END = D.dur;
const hop = (a, b, n) => Array.from({ length: n }, (_, i) => a + (b - a) * (i + 1) / (n + 1));

// jam: the queue ends at z≈-34; car 1 rolls in and brakes on the spoken word
const pal = ['#d7dce0', '#f0efe9', '#2e5e8f', '#b23a32', '#3c4047', '#e0b84d', '#6f8fa6', '#f2f0ea', '#5c8a78', '#8e8f94'];
const lanes = [-3.4, 3.4];
const jam = [];
for (let i = 0; i < 26; i++) jam.push(car(pal[i % pal.length], lanes[i % 2] + (rnd() - .5) * .3, 60 - (i >> 1) * 7.2 - (i % 2) * 2.6));
const car1 = jam.findLast(c => c.x > 0); car1.stop = car1.G.position.z;

// a car whose z is free cruising, easing into a stop line behind the queue
const queueZ = (free, stop) => { const m = 45; return free < stop - m ? free : stop - m + m * (1 - Math.exp(-(free - (stop - m)) / m)); };
const flow = [], STEP = 130;
const hopT = [EV.h_next - .2, ...hop(EV.h_next - .2, EV.a_warning - .3, 5), EV.a_warning - .3];
const relays = [];
for (let i = 1; i <= 5; i++) { const v = 27 + rnd() * 3, tz = -34 - i * STEP, r = car(pal[(i * 3 + 2) % pal.length], 3.4, 0, { v, z0: tz - v * hopT[i], stop: -34 - 16 - i * 8 }); relays.push(r); flow.push(r); }
for (let i = 0; i < 14; i++) { const v = 25 + rnd() * 5; flow.push(car(pal[(i * 7 + 1) % pal.length], -3.4 + (rnd() - .5) * .3, 0, { v, z0: -260 - i * 62 - v * 12, stop: -28 - i * 7.2 })); }

// car 2: 80 mph until the driver reacts on "slow"
const V0 = 35.76, V1 = 15.65, BR = 2.3, Z2 = -34 - 6 * STEP;
const z2vel = t => t < EV.a_slow ? V0 : Math.max(V1, V0 - (V0 - V1) * (t - EV.a_slow) / BR);
const z2 = t => { const b = EV.a_slow, base = Z2 + V0 * (b - hopT[6]); if (t < b) return Z2 + V0 * (t - hopT[6]); const d = Math.min(t - b, BR); return base + V0 * d - .5 * (V0 - V1) / BR * d * d + V1 * Math.max(0, t - b - BR); };
const car2 = car('#e8552c', 3.4, 0, {}); car2.brakeK = t => ss(EV.a_slow - .1, EV.a_slow + .15, t);
// traffic riding with car 2. Behind it: one radio, then cars without one; the warning dies there
const riders = [[3.4, 30, 1], [-3.4, 12, 1], [-3.4, 48, 0], [3.4, -22, 1], [-3.4, -34, 0], [3.4, -52, 0], [-3.4, -70, 0], [3.4, -84, 0], [-3.4, -104, 0], [3.4, -122, 1]].map(([x, off, radio], i) => { const c = car(pal[(i * 3 + 1) % pal.length], x, 0, { off, radio: !!radio }); c.fin.visible = !!radio; return c; });
const catchA = riders[3], catchB = riders[5];

function carZ(c, t) {
  if (c === car2) return z2(t);
  if (c === car1) return c.stop - 150 * (1 - clamp(t / (EV.b_brakes + .5))) ** 2;
  if (c.off !== undefined) return z2(t) + c.off;
  if (c.v) return queueZ(c.z0 + c.v * t, c.stop);
  return c.G.position.z;
}

// ---- car 2 interior (seen from behind the wheel) ----
let headliner; const cabin = new THREE.Group(); car2.G.add(cabin); cabin.visible = false;
{ const dashM = std('#2a2c31', .72), paint = std('#e8552c', .3, .1), add = (g, m, x, y, z) => { const o = new THREE.Mesh(g, m); o.position.set(x, y, z); o.castShadow = o.receiveShadow = true; cabin.add(o); return o; };
  add(new RoundedBoxGeometry(1.74, .26, .62, 5, .11), dashM, 0, 1.0, .82);
  add(new RoundedBoxGeometry(1.74, .62, .12, 3, .05), std('#32343a', .85), 0, .72, .56);
  const hood = add(new RoundedBoxGeometry(1.84, .14, 2.0, 5, .07), paint, 0, .92, 2.05); hood.rotation.x = .05;
  add(new RoundedBoxGeometry(.6, .1, .14, 4, .04), dashM, -.36, 1.205, .46);
  const wheel = add(new THREE.TorusGeometry(.2, .024, 18, 64), std('#17181b', .45), -.36, .8, .26); wheel.rotation.x = .3;
  for (const a of [Math.PI / 2 + 1.1, Math.PI / 2 - 1.1, -Math.PI / 2]) { const sp = add(new RoundedBoxGeometry(.2, .03, .016, 2, .007), std('#1d1e22', .5), -.36 + Math.cos(a) * .1, .8 + Math.sin(a) * .095, .26); sp.rotation.set(.3, 0, a); }
  add(new RoundedBoxGeometry(.11, .09, .05, 3, .02), std('#1d1e22', .5), -.36, .8, .25).rotation.x = .3;
  for (const sx of [-1, 1]) { const pil = add(new RoundedBoxGeometry(.09, .9, .09, 3, .03), std('#3b3d44', .75), sx * .86, 1.32, .72); pil.rotation.x = -.72; pil.rotation.z = sx * .1; add(new RoundedBoxGeometry(.12, .72, 2.3, 3, .05), std('#35373d', .85), sx * .95, .98, -.3); }
  headliner = add(new RoundedBoxGeometry(1.84, .07, 1.25, 3, .03), std('#26282d', .9), 0, 1.68, -.36);
  add(new RoundedBoxGeometry(.22, .07, .03, 3, .012), std('#18191c', .3), 0, 1.54, .32);
}
const scrC = document.createElement('canvas'); scrC.width = 512; scrC.height = 256;
const scrT = new THREE.CanvasTexture(scrC); scrT.colorSpace = THREE.SRGBColorSpace; scrT.anisotropy = 8;
const scr = new THREE.Group();
{ const back = new THREE.Mesh(new RoundedBoxGeometry(.45, .24, .012, 3, .005), std('#101114', .4)); back.position.z = .007; const face = new THREE.Mesh(new THREE.PlaneGeometry(.42, .21), new THREE.MeshBasicMaterial({ map: scrT, toneMapped: false })); face.rotation.y = Math.PI; face.material.color.setScalar(1.6); scr.add(back, face); }
scr.position.set(-.36, 1.09, .47); scr.rotation.x = .16; cabin.add(scr);
function drawScreen(t) {
  const g = scrC.getContext('2d'), w = 512, h = 256; g.fillStyle = '#080a10'; g.fillRect(0, 0, w, h);
  const on = ss(EV.a_warning - .05, EV.a_warning + .12, t), v = Math.round(z2vel(t) * 2.2369);
  g.fillStyle = '#fff'; g.font = '700 110px Inter'; g.textAlign = 'center'; g.fillText(v, 120, 150); g.fillStyle = '#8c95a5'; g.font = '500 26px Mono'; g.fillText('mph', 120, 192);
  g.globalAlpha = on; const p = 1 + .08 * Math.sin(t * 9);
  g.save(); g.translate(350, 92); g.scale(p, p); g.fillStyle = '#ffb020'; g.beginPath(); g.moveTo(0, -48); g.lineTo(52, 40); g.lineTo(-52, 40); g.closePath(); g.lineJoin = 'round'; g.lineWidth = 12; g.strokeStyle = '#ffb020'; g.stroke(); g.fill(); g.fillStyle = '#16120a'; g.font = '700 62px Inter'; g.fillText('!', 0, 28); g.restore();
  g.fillStyle = '#fff'; g.font = '500 25px Mono'; g.fillText('JAM AHEAD', 350, 176); g.fillStyle = '#ffb020'; g.globalAlpha = on * ss(EV.a_slow - .1, EV.a_slow + .05, t); g.fillText('SLOW DOWN', 350, 212); g.globalAlpha = 1;
  scrT.needsUpdate = true;
}

// ---- message: soft glowing sprites and ripples ----
const glowT = (() => { const c = document.createElement('canvas'); c.width = c.height = 128; const g = c.getContext('2d'), r = g.createRadialGradient(64, 64, 0, 64, 64, 64); r.addColorStop(0, 'rgba(255,255,255,1)'); r.addColorStop(.18, 'rgba(255,255,255,.75)'); r.addColorStop(.45, 'rgba(255,255,255,.16)'); r.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = r; g.fillRect(0, 0, 128, 128); return new THREE.CanvasTexture(c); })();
const glowM = c => new THREE.MeshBasicMaterial({ color: c, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false, fog: false });
const spr = c => { const m = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowT, color: c, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false })); scene.add(m); return m; };
const packet = spr(new THREE.Color(5, 9, 14)), halo = spr(new THREE.Color(.5, 1.2, 2.6));
const trail = Array.from({ length: 16 }, () => spr(new THREE.Color(1.1, 2.4, 4.6)));
const rings = Array.from({ length: 16 }, () => { const m = new THREE.Mesh(new THREE.TorusGeometry(1, .03, 8, 96), glowM(new THREE.Color(.8, 2.2, 4))); m.rotation.x = Math.PI / 2; m.visible = false; scene.add(m); return m; });
const finOf = (c, t) => new THREE.Vector3(c.x, 1.84, carZ(c, t) - .98);
const hops = [car1, ...relays, car2].map((c, i) => ({ c, t0: hopT[i] }));
function packetAt(t) {
  if (t <= hops[0].t0) return finOf(car1, t);
  for (let i = 0; i < hops.length - 1; i++) { const a = hops[i], b = hops[i + 1]; if (t < b.t0) { const u = (t - a.t0) / (b.t0 - a.t0), e = u * .75 + .25 * u * u * (3 - 2 * u), A = finOf(a.c, t), B = finOf(b.c, t), P = A.lerp(B, e); P.y += Math.sin(e * Math.PI) * 4; return P; } }
  return finOf(car2, t);
}
// the catch: the warning goes on from car 2 to the next radio, then hits a car with none and fades
const catchT = [EV.c_catch + .15, EV.c_other, EV.c_too - .05];
function packet2At(t) { const A = finOf(car2, t), B = finOf(catchA, t), C = new THREE.Vector3(catchB.x, 1.5, carZ(catchB, t)); if (t < catchT[1]) { const u = ss(catchT[0], catchT[1], t); const P = A.clone().lerp(B, u); P.y += Math.sin(u * Math.PI) * 1.6; return P; } const u = ss(catchT[1], catchT[2], t); const P = B.clone().lerp(C, u); P.y += Math.sin(u * Math.PI) * 1.6; return P; }
// range bubble: a glowing ring on the ground, one hop wide
const rangeM = new THREE.Mesh(new THREE.RingGeometry(.985, 1, 128), glowM(new THREE.Color(.8, 2.1, 3.8))); rangeM.rotation.x = -Math.PI / 2; rangeM.position.y = .06; scene.add(rangeM);
const rangeF = new THREE.Mesh(new THREE.CircleGeometry(1, 96), glowM(new THREE.Color(.05, .16, .32))); rangeF.rotation.x = -Math.PI / 2; rangeF.position.y = .05; scene.add(rangeF);
// cell tower on the roadside that stays dark
{ const g = new THREE.Group(), M = std('#b9bdc2', .4, .7); const body = new THREE.Mesh(new THREE.CylinderGeometry(.22, .6, 32, 10), M); body.position.y = 16; body.castShadow = true; g.add(body); for (const a of [0, 2.1, 4.2]) { const p = new THREE.Mesh(new RoundedBoxGeometry(.5, 2.6, .25, 3, .08), std('#e5e7ea', .5)); p.position.set(Math.cos(a) * .55, 30.4, Math.sin(a) * .55); p.rotation.y = -a; p.castShadow = true; g.add(p); } g.position.set(-13, 0, -72); scene.add(g); }

// spectrum strip: 75 slabs on the median; 45 fly off to a giant router on "Wi-Fi"
let ZR = 0; { const z = z2(EV.y_2020); ZR = z + 18; }
const slabG = new RoundedBoxGeometry(.78, .16, .78, 2, .05), slabM = new THREE.MeshBasicMaterial({ color: 0xffffff, fog: false }), slabs = new THREE.InstancedMesh(slabG, slabM, 75); slabs.frustumCulled = false; slabs.visible = false; scene.add(slabs);
const NEAR = new THREE.Color(.25, 1.7, 2.6), WIFI = new THREE.Color(3.2, 1.7, .25), router = new THREE.Group();
{ const b = new THREE.Mesh(new RoundedBoxGeometry(14, 3.2, 8, 5, 1.1), std('#eef0f2', .35)); b.position.y = 1.6; b.castShadow = true; router.add(b); for (const x of [-5, 0, 5]) { const a = new THREE.Mesh(new RoundedBoxGeometry(.7, 9, .7, 3, .3), std('#23252a', .4)); a.position.set(x, 7, -1); a.castShadow = true; router.add(a); }
  for (const x of [-4, -2, 0, 2, 4]) { const l = new THREE.Mesh(new THREE.SphereGeometry(.22, 12, 8), glowM(new THREE.Color(.4, 3.6, 1))); l.position.set(x, 1.8, 4.05); router.add(l); } router.position.set(24, 0, ZR + 6); router.rotation.y = -.6; scene.add(router); }
const dS = new THREE.Object3D(), cS = new THREE.Color();
function strip(t) {
  slabs.visible = t > EV.y_2016 - .3 && t < EV.e_would + .6; router.visible = t > EV.y_2020 - .4 && t < EV.e_would + .6;
  router.scale.setScalar(Math.max(.001, ss(EV.y_2020 - .35, EV.y_fcc - .2, t) * (1 - ss(EV.e_would, EV.e_would + .5, t))));
  if (!slabs.visible) return;
  const end = 1 - ss(EV.e_would, EV.e_would + .5, t);
  for (let i = 0; i < 75; i++) { const x0 = 9.5, z0 = ZR - 37 * 1.05 + i * 1.05, rise = ss(EV.y_2016 - .3 + i * .012, EV.y_2016 + i * .012, t); dS.position.set(x0, .14 + (1 - rise) * -.3, z0); dS.scale.setScalar(Math.max(.001, rise * end)); dS.rotation.set(0, 0, 0); cS.copy(NEAR);
    if (i < 45) { const u = ss(EV.y_fcc + i * .022, EV.y_fcc + i * .022 + .9, t); if (u > 0) { cS.lerp(WIFI, ss(0, .25, u)); dS.position.x = x0 + (router.position.x - x0) * u; dS.position.y += Math.sin(u * Math.PI) * 10 + u * 1.5; dS.position.z = z0 + (router.position.z - z0) * u; dS.rotation.y = u * 4; dS.scale.multiplyScalar(u > .95 ? 0.001 : 1); } }
    else { const pulse = ss(EV.y_rest - .05, EV.y_rest + .2, t) * (1 - ss(EV.y_rest + .2, EV.y_rest + .7, t)); cS.multiplyScalar(1 + pulse * 1.8); }
    dS.updateMatrix(); slabs.setMatrixAt(i, dS.matrix); slabs.setColorAt(i, cS); }
  slabs.instanceMatrix.needsUpdate = true; slabs.instanceColor.needsUpdate = true;
}
// the web for the final question: lines between every fin that has a radio
const web = Array.from({ length: 6 }, () => { const m = new THREE.Mesh(new THREE.CylinderGeometry(.035, .035, 1, 8), glowM(new THREE.Color(.8, 2.2, 3.8))); scene.add(m); return m; });
const webPairs = [[car2, riders[0]], [car2, riders[1]], [riders[0], riders[2]], [riders[1], riders[2]], [car2, riders[3]], [riders[1], riders[3]]];
function webAt(t) { const a = ss(EV.e_stranger - .4, EV.e_stranger + .3, t); web.forEach((m, i) => { m.visible = a > 0; if (!a) return; const A = finOf(webPairs[i][0], t), B = finOf(webPairs[i][1], t), d = B.clone().sub(A), L = d.length(); m.position.copy(A).addScaledVector(d, .5); m.scale.set(1, L * a, 1); m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize()); m.material.opacity = (.55 + .25 * Math.sin(t * 7 + i)) * a; }); }

// ---- camera: keys timed on words; each key is in world space or rides along (ref) ----
const pz = t => { let z = 0; for (let i = -3; i <= 3; i++) z += packetAt(t + i * .16).z; return z / 7; };
const KEY = (t, p, l, r) => [t, p, l, r];
const E2 = EV.a_warning + .22, E3 = E2 + .28, E4 = E3 + .32;
const CK = [ // ref 0 world, 1 car 1, 2 car 2, 3 the message, 4 where car 1 stops, 5 spectrum strip
  KEY(0, [1.5, 1.45, -9.5], [3.0, 1.2, 8], 1), KEY(EV.o_jump, [.9, 1.5, -11], [2.9, 1.25, 8], 1), KEY(EV.b_jam, [1.3, 1.6, -9.5], [3.1, 1.25, 6], 1),
  KEY(EV.b_brakes + .1, [2.3, 1.75, -7], [3.4, 1.35, -1.5], 4), KEY(EV.b_radio - .1, [4.1, 2.12, -3.1], [3.4, 1.8, -.98], 4), KEY(EV.b_broadcast, [5.0, 2.28, -1.7], [3.4, 1.82, -.98], 4),
  KEY(EV.b_phone, [5.8, 3.4, .6], [0, 5, -18], 4), KEY(EV.b_cell, [5.6, 5.0, 5], [-11, 12, -38], 4), KEY(EV.b_cell + .9, [5.6, 5.0, 4], [-10, 11, -36], 4), KEY(EV.d_times + .3, [5.6, 2.9, .6], [3.4, 1.9, -1], 4),
  KEY(EV.d_where, [5.3, 2.5, -.1], [3.4, 1.86, -.98], 4), KEY(EV.d_way, [4.6, 2.6, -3.4], [3.4, 1.86, -.98], 4), KEY(EV.h_one, [5.5, 4.5, 5], [3.4, 1.6, -18], 4),
  KEY(EV.h_thousand, [16, 42, 66], [3.4, 0, -82], 4), KEY(EV.h_next - .5, [14, 34, 42], [3.4, 0, -100], 4), KEY(EV.h_next + 1, [7.5, 11, 20], [3.4, 2.4, -26], 3), KEY(EV.a_behind - .2, [6.8, 8, 15], [3.4, 2.4, -24], 3),
  KEY(EV.a_warning - .75, [6.3, 3.1, 12], [3.4, 1.3, 0], 2), KEY(EV.a_warning - .1, [4.2, 2.65, 1.2], [3.4, 1.78, -.98], 2), KEY(E2, [3.2, 1.86, -.6], [3.08, 1.3, .6], 2),
  KEY(E3, [3.04, 1.44, -.62], [3.04, 1.2, .9], 2), KEY(E4 + .3, [3.04, 1.42, -.5], [3.04, 1.14, .47], 2), KEY(EV.a_slow, [3.04, 1.33, -.2], [3.04, 1.09, .47], 2), KEY(EV.a_sight - .15, [3.04, 1.33, -.2], [3.04, 1.11, .47], 2),
  KEY(EV.a_sight + .3, [3.04, 1.5, -.5], [3.04, 1.42, 1.5], 2), KEY(EV.c_catch - .1, [3.1, 3.2, -1.2], [3.3, 1.8, 8], 2), KEY(EV.c_catch + .55, [5.5, 6.5, 6], [3.3, 1.6, -22], 2), KEY(EV.c_other, [7, 8.5, -6], [3.2, 1.4, -38], 2), KEY(EV.c_too, [7.5, 7.5, -24], [3.0, 1.3, -60], 2), KEY(EV.c_too + .4, [7.5, 7.2, -26], [3.0, 1.3, -60], 2),
  KEY(EV.y_2016 + .9, [-14, 17, -56], [10, 0, 0], 5), KEY(EV.y_2020 - .1, [-12, 13, -46], [11, .5, 2], 5), KEY(EV.y_wifi, [-7, 10, -34], [15, 3, 6], 5), KEY(EV.y_rest, [-9, 13, -44], [12, 2, 4], 5),
  KEY(EV.e_would + .5, [10.5, 8.5, 38], [1.5, 1.4, 4], 2), KEY(EV.e_yes, [11, 7.5, 28], [1.2, 1.3, 2], 2), KEY(END + .1, [10.5, 7, 24], [1.2, 1.3, 2], 2),
];
for (let i = 1; i < CK.length; i++) CK[i][0] = Math.max(CK[i][0], CK[i - 1][0] + .1);
function camAt(t) {
  const pzv = pz(t), z2v = z2(t);
  const P = CK.map(k => { const off = k[3] === 1 ? carZ(car1, t) : k[3] === 2 ? z2v : k[3] === 3 ? pzv : k[3] === 4 ? car1.stop : k[3] === 5 ? ZR : 0; return { t: k[0], p: new THREE.Vector3(k[1][0], k[1][1], k[1][2] + off), l: new THREE.Vector3(k[2][0], k[2][1], k[2][2] + off) }; });
  let i = 0; while (i < P.length - 2 && t > P[i + 1].t) i++;
  const b = P[i], c = P[i + 1], h = c.t - b.t, u = clamp((t - b.t) / h), u2 = u * u, u3 = u2 * u, ax = ['x', 'y', 'z'];
  // monotone cubic: keys are hit exactly and the camera never overshoots, even after a big swing
  const slope = (j, f, a) => { const prev = P[j - 1], next = P[j + 1]; if (!prev || !next) return 0; const d0 = (f(P[j])[a] - f(prev)[a]) / (P[j].t - prev.t), d1 = (f(next)[a] - f(P[j])[a]) / (next.t - P[j].t); if (d0 * d1 <= 0) return 0; const h0 = P[j].t - prev.t, h1 = next.t - P[j].t; return 3 * (h0 + h1) / ((2 * h1 + h0) / d0 + (h1 + 2 * h0) / d1); };
  const cr = f => { const o = new THREE.Vector3(); for (const a of ax) { const y0 = f(b)[a], y1 = f(c)[a]; o[a] = (2 * u3 - 3 * u2 + 1) * y0 + (u3 - 2 * u2 + u) * h * slope(i, f, a) + (-2 * u3 + 3 * u2) * y1 + (u3 - u2) * h * slope(i + 1, f, a); } return o; };
  return { p: cr(k => k.p), l: cr(k => k.l) };
}

const inCar = t => t > E2 - .12 && t < EV.a_sight + .55;
function setWorld(t) {
  for (const c of cars) { const moving = c.v || c === car1 || c === car2 || c.off !== undefined; if (moving) c.G.position.z = carZ(c, t); const z = c.G.position.z; c.wheels.forEach(W => W.rotation.x = z / .385);
    if (c === car2) continue; const braking = c === car1 ? 1 + 5 * ss(EV.b_brakes - .05, EV.b_brakes + .1, t) : !c.v && c.off === undefined ? 4.5 : c.v ? 5 * ss(c.stop - 60, c.stop - 42, c.z0 + c.v * t) : c.off !== undefined ? 3 * car2.brakeK(t) * (1 - ss(EV.a_slow + BR, EV.a_slow + BR + .4, t)) : 0; c.brakeM.emissiveIntensity = braking; }
  car2.brakeM.emissiveIntensity = 6 * car2.brakeK(t) * (1 - ss(EV.a_slow + BR, EV.a_slow + BR + .4, t));
  const inside = inCar(t); car2.ext.forEach(o => o.visible = !inside); cabin.visible = inside; headliner.visible = t > E2 + .2 && t < EV.a_sight + .15;
  cam.fov = 38 + 22 * ss(E2 - .15, E2 + .2, t) * (1 - ss(EV.a_sight + .05, EV.a_sight + .5, t));
  // packet: first run car 1 → car 2 (rapid pulses before it), second run dies at the car without a radio
  let P, live = false, faded = 1;
  if (t >= hopT[0] - .05 && t < hopT[6] + .1) { P = packetAt(t); live = true; }
  else if (t >= catchT[0] && t < catchT[2] + .35) { P = packet2At(t); live = true; faded = 1 - ss(catchT[2] - .02, catchT[2] + .32, t); }
  packet.visible = halo.visible = live;
  if (live) { const sz = (1 + .1 * Math.sin(t * 30)) * clamp(cam.position.distanceTo(P) * .05, .45, 1.8); packet.position.copy(P); halo.position.copy(P); packet.scale.setScalar(sz * 1.1); halo.scale.setScalar(sz * 4.2 * (1 + (1 - faded) * 2)); packet.material.opacity = faded; halo.material.opacity = .5 * faded; const red = t > catchT[2] - .1; packet.material.color.setRGB(red ? 10 : 5, red ? 2.5 : 9, red ? 1.5 : 14); halo.material.color.setRGB(red ? 2.6 : .5, red ? .5 : 1.2, red ? .3 : 2.6);
    const at = t < hopT[6] + .1 ? packetAt : packet2At; trail.forEach((m, i) => { const tt = t - (i + 1) * .014; m.visible = faded > .4; m.position.copy(at(tt)); m.scale.setScalar(sz * .7 * (1 - i * .045)); m.material.opacity = (.8 - i * .045) * faded; }); }
  else trail.forEach(m => m.visible = false);
  // ripples: a burst at car 1 on "broadcast", ten a second while the data line is spoken, one per hop
  let k = 0; const emit = (c, t0, big, dim = 1) => { const m = rings[k++]; if (!m) return; const dt = t - t0, on = dt > 0 && dt < .9 && !inside; m.visible = on; if (on) { m.position.copy(finOf(c, t)); m.position.y += .02; m.scale.setScalar(.15 + dt * big); m.material.opacity = (1 - dt / .9) ** 2 * dim; } };
  const tenOn = t > EV.b_broadcast - .05 && t < EV.h_one; const tenK = Math.floor((t - EV.b_broadcast) * 10);
  for (let i = 0; i < 9; i++) emit(car1, tenOn ? EV.b_broadcast + (tenK - i) / 10 : -9, 1.6, .4);
  for (const h of hops.slice(1)) emit(h.c, h.t0, 7);
  while (k < rings.length) rings[k++].visible = false;
  // one-hop range ring around car 1
  const R0 = ss(EV.h_one - .1, EV.h_thousand + .2, t) * (1 - ss(EV.h_next + .2, EV.h_next + .7, t)); rangeM.visible = rangeF.visible = R0 > 0; if (R0 > 0) { const rad = STEP * 1.02 * ss(0, .6, R0); for (const m of [rangeM, rangeF]) { m.position.x = car1.x; m.position.z = car1.stop; m.scale.setScalar(Math.max(.01, rad)); m.material.opacity = R0; } rangeF.material.opacity = .9 * R0; }
  strip(t); webAt(t);
}

// ---- type: title, labels, word-synced captions, stamps, CTA ----
const o = ov.getContext('2d');
const ARCH = 'AB', LBL = [
  { from: EV.o_jam - .1, to: EV.o_jump - .1, txt: 'TRAFFIC JAM', sub: 'CARS HAVE STOPPED', at: t => new THREE.Vector3(3.4, 2.1, car1.stop + 16) },
  { from: EV.b_radio, to: EV.b_phone - .05, txt: 'RADIO', sub: 'DIRECT, CAR TO CAR', at: t => finOf(car1, t) },
  { from: EV.b_cell - .15, to: EV.d_times - .45, txt: 'CELL TOWER', sub: 'NOT NEEDED', at: t => new THREE.Vector3(-13, 29, -72) },
  { from: EV.h_thousand - .1, to: EV.h_next - .1, txt: '≈1,000 FT', sub: 'ONE BROADCAST', at: t => new THREE.Vector3(car1.x - STEP, .1, car1.stop - 10), noClampY: 1 },
  { from: EV.h_next + .1, to: EV.a_behind + .1, txt: 'NEXT CAR PASSES IT ON', sub: 'HOP BY HOP', at: t => packetAt(t) },
  { from: EV.a_behind + .15, to: EV.a_warning - .1, txt: '80 MPH', sub: 'JAM NOT IN SIGHT', at: t => finOf(car2, t) },
  { from: EV.c_other - .1, to: EV.y_2016 - .3, txt: 'NO RADIO', sub: 'THE WARNING STOPS HERE', at: t => new THREE.Vector3(catchB.x, 1.5, carZ(catchB, t)) },
];
// on-screen stamps over the 3D picture
const STAMPS = [
  { t0: EV.y_2016 - .05, t1: EV.y_2020 - .1, big: '2016', sub: 'U.S. PROPOSES REQUIRING IT', y: 330 },
  { t0: EV.y_2020 - .05, t1: EV.y_kept - .05, big: '2020', sub: 'FCC: 45 OF 75 MHz GO TO WI-FI', y: 330 },
  { t0: EV.y_kept - .05, t1: EV.e_would - .05, big: '30 MHz', sub: 'LEFT FOR CARS', y: 330 },
];
const POINTS = [[EV.d_where, 'WHERE', 'LOCATION'], [EV.d_fast, 'HOW FAST', 'SPEED'], [EV.d_way, 'WHICH WAY', 'HEADING']];
const CAPS = D.caps.flat(), LINES = []; { let cur = []; for (const w of CAPS) { cur.push(w); if (cur.length >= 4 || /[.,?:]$/.test(w.w)) { LINES.push(cur); cur = []; } } if (cur.length) LINES.push(cur); }
function fit(txt, x, y) { o.fillText(txt, x, y); }
function drawOverlay(t) {
  o.clearRect(0, 0, 1080, 1920); o.textBaseline = 'alphabetic'; o.shadowBlur = 0;
  o.font = '500 22px Mono'; o.fillStyle = 'rgba(255,255,255,.72)'; o.textAlign = 'right'; o.fillText('ILLUSTRATION', 1030, 128);
  // title holds the hook, as words so it never covers the caption
  const tA = (1 - ss(EV.o_jump - .4, EV.o_jump - .05, t)); if (tA > 0) { o.globalAlpha = tA; o.textAlign = 'center'; o.shadowColor = 'rgba(0,0,0,.6)'; o.shadowBlur = 22; o.font = '84px AB'; o.fillStyle = '#fff'; o.fillText('CARS THAT WARN', 540, 330); o.fillStyle = '#ffc85a'; o.fillText('EACH OTHER', 540, 430); o.shadowBlur = 0; o.globalAlpha = 1; }
  const v = new THREE.Vector3();
  for (const L of LBL) { const a = ss(L.from, L.from + .22, t) * (1 - ss(L.to - .2, L.to, t)); if (a <= 0) continue; v.copy(L.at(t)).project(cam); if (v.z > 1) continue; const x = clamp((v.x + 1) * 540, 110, 970), y = clamp((1 - v.y) * 960, 210, 1320);
    const right = x < 540, tx = x + (right ? 80 : -80), ty = y - 112; o.globalAlpha = a; o.strokeStyle = '#fff'; o.lineWidth = 2.5; o.beginPath(); o.moveTo(x, y - 8); o.lineTo(tx, ty); o.stroke(); o.fillStyle = '#fff'; o.beginPath(); o.arc(x, y - 8, 6, 0, 7); o.fill();
    o.textAlign = right ? 'left' : 'right'; const dx = right ? 8 : -8; o.shadowColor = 'rgba(0,0,0,.7)'; o.shadowBlur = 14; o.font = '700 40px Inter'; o.fillStyle = '#ffc85a'; o.fillText(L.txt, tx + dx, ty - 28); o.font = '500 25px Mono'; o.fillStyle = '#fff'; o.fillText(L.sub, tx + dx, ty + 4); o.shadowBlur = 0; o.globalAlpha = 1; }
  // "up to 10 times a second", then the three things stack up
  const pA = ss(EV.d_times - .05, EV.d_times + .15, t) * (1 - ss(EV.h_one - .35, EV.h_one - .05, t)); if (pA > 0) { o.globalAlpha = pA; o.textAlign = 'center'; o.shadowColor = 'rgba(0,0,0,.6)'; o.shadowBlur = 18; o.font = '82px AB'; o.fillStyle = '#ffc85a'; o.fillText('UP TO 10× / SEC', 540, 360); o.shadowBlur = 0; o.globalAlpha = pA; POINTS.forEach(([ts, a, b], i) => { const u = ss(ts - .02, ts + .18, t); if (u <= 0) return; const y = 430 + i * 84, x = 540; o.globalAlpha = pA * u; o.fillStyle = 'rgba(8,12,20,.72)'; o.beginPath(); o.roundRect(x - 245, y, 490, 68, 34); o.fill(); o.fillStyle = '#fff'; o.font = '700 37px Inter'; o.textAlign = 'center'; o.fillText(a, x, y + 47); }); o.globalAlpha = 1; }
  for (const s of STAMPS) { const a = ss(s.t0, s.t0 + .14, t) * (1 - ss(s.t1 - .16, s.t1, t)); if (a <= 0) continue; const k = 1.3 - .3 * ss(s.t0, s.t0 + .16, t); o.save(); o.translate(540, s.y); o.scale(k, k); o.globalAlpha = a; o.textAlign = 'center'; o.shadowColor = 'rgba(0,0,0,.65)'; o.shadowBlur = 20; o.font = '116px AB'; o.fillStyle = '#ffc85a'; o.fillText(s.big, 0, 0); o.font = '700 38px Inter'; const sw = o.measureText(s.sub).width; o.shadowBlur = 0; o.fillStyle = 'rgba(6,9,16,.62)'; o.beginPath(); o.roundRect(-sw / 2 - 22, 28, sw + 44, 60, 18); o.fill(); o.fillStyle = '#fff'; o.fillText(s.sub, 0, 72); o.restore(); o.shadowBlur = 0; o.globalAlpha = 1; }
  // end card
  const eA = ss(EV.e_would - .1, EV.e_would + .2, t); if (eA > 0) { o.globalAlpha = eA; o.textAlign = 'center'; o.shadowColor = 'rgba(0,0,0,.65)'; o.shadowBlur = 20; o.font = '72px AB'; o.fillStyle = '#fff'; o.fillText('TALK TO EVERY', 540, 310); o.fillStyle = '#ffc85a'; o.fillText('STRANGER?', 540, 396); o.shadowBlur = 0;
    for (const [lbl, ts, x, c] of [['YES', EV.e_yes, 340, '#39c98a'], ['NO', EV.e_no, 740, '#ef5a4c']]) { const u = ss(ts - .05, ts + .12, t), k = u > 0 ? 1 + .22 * (1 - u) : .92; o.save(); o.translate(x, 500); o.scale(k, k); o.globalAlpha = eA * (u > 0 ? 1 : .45); o.fillStyle = u > 0 ? c : 'rgba(10,14,22,.65)'; o.beginPath(); o.roundRect(-140, -56, 280, 112, 56); o.fill(); o.fillStyle = '#fff'; o.font = '56px AB'; o.fillText(lbl, 0, 20); o.restore(); }
    o.globalAlpha = eA * ss(EV.e_subscribe - .05, EV.e_subscribe + .15, t); o.fillStyle = '#ef2b2b'; o.beginPath(); o.roundRect(350, 620, 380, 84, 42); o.fill(); o.fillStyle = '#fff'; o.font = '700 38px Inter'; o.fillText('SUBSCRIBE', 540, 676); o.globalAlpha = 1; }
  // captions: 4 words at a time, spoken word bright, keywords amber
  const line = LINES.find(l => t >= l[0].s - .05 && t <= l[l.length - 1].e + .18);
  if (line) { o.font = '700 50px Inter'; o.textAlign = 'left'; const sp = 14, ws = line.map(w => o.measureText(w.w).width), tot = ws.reduce((a, b) => a + b, 0) + sp * (line.length - 1); let x = 540 - tot / 2; const Y = 1490;
    o.fillStyle = 'rgba(6,9,16,.66)'; o.beginPath(); o.roundRect(540 - tot / 2 - 28, Y - 56, tot + 56, 80, 22); o.fill();
    line.forEach((w, i) => { const said = t >= w.s - .02; o.fillStyle = w.k ? (said ? '#ffc85a' : 'rgba(255,200,90,.5)') : (said ? '#fff' : 'rgba(255,255,255,.5)'); o.fillText(w.w, x, Y); x += ws[i] + sp; }); }
}
scene.traverse(m => { if (m.material && m.material.isMeshStandardMaterial && m.material.envMapIntensity === 1) m.material.envMapIntensity = .55; });

// ---- accumulation + finishing ----
const rtOpts = { type: THREE.HalfFloatType, minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, depthBuffer: true };
const one = new THREE.WebGLRenderTarget(W, H, rtOpts), acc = new THREE.WebGLRenderTarget(W, H, { ...rtOpts, depthBuffer: false });
const b1 = new THREE.WebGLRenderTarget(W >> 2, H >> 2, { ...rtOpts, depthBuffer: false }), b2 = b1.clone(), b3 = new THREE.WebGLRenderTarget(W >> 4, H >> 4, { ...rtOpts, depthBuffer: false }), b4 = b3.clone();
const fsCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1), fsG = new THREE.PlaneGeometry(2, 2);
const fs = (fragmentShader, uniforms = {}, extra = {}) => { const m = new THREE.ShaderMaterial({ depthTest: false, depthWrite: false, uniforms, vertexShader: 'varying vec2 v;void main(){v=uv;gl_Position=vec4(position.xy,0.,1.);}', fragmentShader, ...extra }); const s = new THREE.Scene(); s.add(new THREE.Mesh(fsG, m)); s.m = m; return s; };
const addS = fs('varying vec2 v;uniform sampler2D t;uniform float a;void main(){gl_FragColor=vec4(texture2D(t,v).rgb*a,1.);}', { t: { value: null }, a: { value: 1 } }, { blending: THREE.CustomBlending, blendSrc: THREE.OneFactor, blendDst: THREE.OneFactor, blendEquation: THREE.AddEquation, transparent: true });
const brightS = fs('varying vec2 v;uniform sampler2D t;void main(){vec3 c=texture2D(t,v).rgb;float l=max(c.r,max(c.g,c.b));gl_FragColor=vec4(c*smoothstep(1.1,2.6,l),1.);}', { t: { value: null } });
const blurS = fs('varying vec2 v;uniform sampler2D t;uniform vec2 d;void main(){vec3 c=texture2D(t,v).rgb*.227;c+=(texture2D(t,v+d*1.38).rgb+texture2D(t,v-d*1.38).rgb)*.316;c+=(texture2D(t,v+d*3.23).rgb+texture2D(t,v-d*3.23).rgb)*.07;gl_FragColor=vec4(c,1.);}', { t: { value: null }, d: { value: new THREE.Vector2() } });
const finalS = fs(`varying vec2 v;uniform sampler2D t,b,bb;uniform float seed,fade;
vec3 aces(vec3 x){return clamp((x*(2.51*x+.03))/(x*(2.43*x+.59)+.14),0.,1.);}
float h(vec2 p){return fract(sin(dot(p,vec2(12.9898,78.233))+seed)*43758.5453);}
void main(){vec3 c=texture2D(t,v).rgb+texture2D(b,v).rgb*.55+texture2D(bb,v).rgb*.45;c=aces(c*.82);
c=pow(c,vec3(1./2.2));vec2 q=v-.5;c*=1.-dot(q,q)*.32;c=mix(vec3(dot(c,vec3(.3,.59,.11))),c,1.06);c+=(h(v*vec2(1080.,1920.))-.5)*.016;gl_FragColor=vec4(c*fade,1.);}`, { t: { value: acc.texture }, b: { value: b2.texture }, bb: { value: b4.texture }, seed: { value: 0 }, fade: { value: 1 } });
const pass = (s, rt) => { R.setRenderTarget(rt); R.render(s, fsCam); };

const SHUTTER = .3 / 30;
window.seek = async function (t) {
  drawScreen(t);
  R.setRenderTarget(acc); R.setClearColor(0, 0); R.clear(); R.autoClear = true;
  for (let i = 0; i < N; i++) {
    const j1 = halton(i + 1, 2), j2 = halton(i + 1, 3), j3 = halton(i + 1, 5), j4 = halton(i + 1, 7), j5 = halton(i + 1, 11), j6 = halton(i + 1, 13);
    const ts = t + (j3 - .5) * SHUTTER; setWorld(ts);
    const { p, l } = camAt(ts);
    cam.position.copy(p); cam.up.set(0, 1, 0); cam.lookAt(l); cam.updateProjectionMatrix(); cam.updateMatrixWorld();
    const focus = p.distanceTo(l), ap = THREE.MathUtils.clamp(focus * .0055, .0012, .05);
    const ang = j1 * 6.2832, rad = Math.sqrt(j2) * ap, dx = Math.cos(ang) * rad, dy = Math.sin(ang) * rad;
    cam.translateX(dx); cam.translateY(dy); cam.updateMatrixWorld();
    const P = cam.projectionMatrix.elements; P[8] = -P[0] * dx / focus - 2 * (j4 - .5) / W; P[9] = -P[5] * dy / focus - 2 * (j5 - .5) / H; cam.projectionMatrixInverse.copy(cam.projectionMatrix).invert();
    const span = THREE.MathUtils.clamp(focus * 1.6, 5, 190), tgt = l;
    const sd = new THREE.Vector3(.62, .42, -.68).normalize(), s1 = new THREE.Vector3(1, 0, 0).cross(sd).normalize(), s2 = sd.clone().cross(s1), sa = j6 * 6.2832, sr = Math.sqrt(j1) * .1;
    const sdir = sd.clone().addScaledVector(s1, Math.cos(sa) * sr).addScaledVector(s2, Math.sin(sa) * sr).normalize();
    const az = j2 * 6.2832, el = Math.acos(Math.sqrt(j4)), fdir = new THREE.Vector3(Math.cos(az) * Math.sin(el), Math.cos(el) + .05, Math.sin(az) * Math.sin(el)).normalize();
    for (const [L, d] of [[sun, sdir], [fill, fdir]]) { L.target.position.copy(tgt); L.position.copy(tgt).addScaledVector(d, span * 2.2); const c = L.shadow.camera; c.left = c.bottom = -span; c.right = c.top = span; c.near = .1; c.far = span * 5; c.updateProjectionMatrix(); L.target.updateMatrixWorld(); L.updateMatrixWorld(); }
    sky.position.copy(p);
    R.setRenderTarget(one); R.setClearColor(0, 1); R.clear(); R.render(scene, cam);
    addS.m.uniforms.t.value = one.texture; addS.m.uniforms.a.value = 1 / N;
    R.autoClear = false; pass(addS, acc); R.autoClear = true;
  }
  brightS.m.uniforms.t.value = acc.texture; pass(brightS, b1);
  blurS.m.uniforms.t.value = b1.texture; blurS.m.uniforms.d.value.set(4 / W, 0); pass(blurS, b2);
  blurS.m.uniforms.t.value = b2.texture; blurS.m.uniforms.d.value.set(0, 4 / H); pass(blurS, b1);
  blurS.m.uniforms.t.value = b1.texture; blurS.m.uniforms.d.value.set(16 / W, 0); pass(blurS, b4);
  blurS.m.uniforms.t.value = b4.texture; blurS.m.uniforms.d.value.set(0, 16 / H); pass(blurS, b3);
  blurS.m.uniforms.t.value = b3.texture; blurS.m.uniforms.d.value.set(8 / W, 0); pass(blurS, b4);
  blurS.m.uniforms.t.value = b1.texture; blurS.m.uniforms.d.value.set(4 / W, 0); pass(blurS, b2);
  finalS.m.uniforms.seed.value = t * 13.37; finalS.m.uniforms.fade.value = ss(0, .12, t) * (1 - ss(END - .15, END, t));
  R.setRenderTarget(null); R.render(finalS, fsCam);
  drawOverlay(t);
};
window.END = END;
await Promise.all(['700 37px Inter', '500 23px Mono', '84px AB'].map(f => document.fonts.load(f)));
window.ready = true;
