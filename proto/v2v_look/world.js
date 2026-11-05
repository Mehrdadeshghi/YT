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
  add(bodyG, paint); const gl = add(glassG, opts.glass || glassM); const rf = add(roofG, paint); add(finG, finM); for (const s of [-1, 1]) { const bp = add(new THREE.BoxGeometry(.05, .56, .12), paint); bp.position.set(s * .76, 1.32, -.42); bp.rotation.z = s * .1; }
  const wheels = [];
  for (const [wx, wz] of [[-.8, 1.3], [.8, 1.3], [-.8, -1.3], [.8, -1.3]]) { const W = new THREE.Group(); W.position.set(wx, .385, wz); const arch = new THREE.Mesh(archG, trimM); arch.position.set(wx + Math.sign(wx) * .1, .42, wz); G.add(arch); const t = new THREE.Mesh(tyreG, tyreM); t.castShadow = true; const h = new THREE.Mesh(hubG, hubM); W.add(t, h); for (let i = 0; i < 5; i++) { const sp = new THREE.Mesh(new THREE.BoxGeometry(.27, .03, .05), trimM); sp.rotation.x = i * 1.257; sp.position.set(0, 0, 0); W.add(sp); } G.add(W); wheels.push(W); }
  const brakeM = std('#7a1712', .25, 0, { emissive: '#ff0800', emissiveIntensity: 0 });
  for (const s of [-1, 1]) { const b = add(lampBack, brakeM, false); b.position.set(s * .58, .86, -1.86); const f = add(lampFront, headM, false); f.position.set(s * .58, .76, 1.86); }
    G.position.set(x, 0, zf); scene.add(G);
  const ext = [...G.children]; const c = { G, wheels, brakeM, gl, rf, x, ext, ...opts }; cars.push(c); return c;
}

// the jam
const pal = ['#d7dce0', '#f0efe9', '#2e5e8f', '#b23a32', '#3c4047', '#e0b84d', '#6f8fa6', '#f2f0ea', '#5c8a78', '#8e8f94'];
const lanes = [-3.4, 3.4];
const jam = [];
for (let i = 0; i < 26; i++) { const lane = lanes[i % 2], row = i >> 1; jam.push(car(pal[i % pal.length], lane + (rnd() - .5) * .3, 60 - row * 7.2 - (i % 2) * 2.6)); }
const car1 = jam.findLast(c => c.x > 0); car1.z0 = car1.G.position.z; // last car in the right lane = "Car 1", arrives and brakes

// flowing traffic and relays behind the jam
const flow = []; for (let i = 0; i < 16; i++) flow.push(car(pal[(i * 3 + 2) % pal.length], lanes[i % 2] + (rnd() - .5) * .3, 0, { z0: -130 - i * 44 - rnd() * 18, v: 24 + rnd() * 5 }));
const relayA = flow[0], relayB = flow[3], relayC = flow[6];
const car2 = car('#e8552c', 3.4, 0, { z0: -640, v: 36 });
const END = 9.0;
const z2 = t => { const b = 6.7, v0 = 36, v1 = 16; if (t < b) return car2.z0 + v0 * t; const d = Math.min(t - b, 1.6), k = (v0 - v1) / 1.6; return car2.z0 + v0 * b + v0 * d - .5 * k * d * d + v1 * Math.max(0, t - b - 1.6); };
car2.brakeK = t => ss(6.65, 6.85, t);

// ---- car 2 interior (seen from behind the wheel) ----
let headliner; const cabin = new THREE.Group(); car2.G.add(cabin); cabin.visible = false;
{ const dashM = std('#2a2c31', .72), paint = std('#e8552c', .3, .1), add = (g, m, x, y, z) => { const o = new THREE.Mesh(g, m); o.position.set(x, y, z); o.castShadow = o.receiveShadow = true; cabin.add(o); return o; };
  add(new RoundedBoxGeometry(1.74, .26, .62, 5, .11), dashM, 0, 1.0, .82); // dash top
  add(new RoundedBoxGeometry(1.74, .62, .12, 3, .05), std('#32343a', .85), 0, .72, .56);
  const hood = add(new RoundedBoxGeometry(1.84, .14, 2.0, 5, .07), paint, 0, .92, 2.05); hood.rotation.x = .05;
  const hump = add(new RoundedBoxGeometry(.6, .1, .14, 4, .04), dashM, -.36, 1.205, .46); // cluster hood
  const wheel = add(new THREE.TorusGeometry(.2, .024, 18, 64), std('#17181b', .45), -.36, .8, .26); wheel.rotation.x = .3;
  for (const a of [Math.PI / 2 + 1.1, Math.PI / 2 - 1.1, -Math.PI / 2]) { const sp = add(new RoundedBoxGeometry(.2, .03, .016, 2, .007), std('#1d1e22', .5), -.36 + Math.cos(a) * .1, .8 + Math.sin(a) * .095, .26); sp.rotation.set(.3, 0, a); }
  const hub = add(new RoundedBoxGeometry(.11, .09, .05, 3, .02), std('#1d1e22', .5), -.36, .8, .25); hub.rotation.x = .3;
  for (const sx of [-1, 1]) { const pil = add(new RoundedBoxGeometry(.09, .9, .09, 3, .03), std('#3b3d44', .75), sx * .86, 1.32, .72); pil.rotation.x = -.72; pil.rotation.z = sx * .1;
    add(new RoundedBoxGeometry(.12, .72, 2.3, 3, .05), std('#35373d', .85), sx * .95, .98, -.3); }
  headliner = add(new RoundedBoxGeometry(1.84, .07, 1.25, 3, .03), std('#26282d', .9), 0, 1.68, -.36);
  const mirror = add(new RoundedBoxGeometry(.22, .07, .03, 3, .012), std('#18191c', .3), 0, 1.54, .32);
}
const scrC = document.createElement('canvas'); scrC.width = 512; scrC.height = 256;
const scrT = new THREE.CanvasTexture(scrC); scrT.colorSpace = THREE.SRGBColorSpace; scrT.anisotropy = 8;
const scr = new THREE.Group();
{ const back = new THREE.Mesh(new RoundedBoxGeometry(.45, .24, .012, 3, .005), std('#101114', .4)); back.position.z = .007; const face = new THREE.Mesh(new THREE.PlaneGeometry(.42, .21), new THREE.MeshBasicMaterial({ map: scrT, toneMapped: false })); face.rotation.y = Math.PI; face.material.color.setScalar(1.6); scr.add(back, face); }
scr.position.set(-.36, 1.09, .47); scr.rotation.x = .16; cabin.add(scr);
function drawScreen(t) {
  const g = scrC.getContext('2d'), w = 512, h = 256; g.fillStyle = '#080a10'; g.fillRect(0, 0, w, h);
  const on = ss(6.45, 6.62, t), v = Math.round(z2vel(t) * 3.6);
  g.fillStyle = '#fff'; g.font = '700 110px Inter'; g.textAlign = 'center'; g.fillText(v, 120, 150); g.fillStyle = '#8c95a5'; g.font = '500 26px Mono'; g.fillText('km/h', 120, 192);
  g.globalAlpha = on; const p = 1 + .1 * Math.sin(t * 9);
  g.save(); g.translate(350, 92); g.scale(p, p); g.fillStyle = '#ffb020'; g.beginPath(); g.moveTo(0, -48); g.lineTo(52, 40); g.lineTo(-52, 40); g.closePath(); g.lineJoin = 'round'; g.lineWidth = 12; g.strokeStyle = '#ffb020'; g.stroke(); g.fill(); g.fillStyle = '#16120a'; g.font = '700 62px Inter'; g.fillText('!', 0, 28); g.restore();
  g.fillStyle = '#fff'; g.font = '500 25px Mono'; g.fillText('JAM AHEAD', 350, 176); g.fillStyle = '#ffb020'; g.fillText('SLOW DOWN', 350, 212); g.globalAlpha = 1;
  scrT.needsUpdate = true;
}
const z2vel = t => { const b = 6.7; return t < b ? 36 : Math.max(16, 36 - 12.5 * (t - b)); };

// ---- message: glowing packets and ripples ----
const glowT = (() => { const c = document.createElement('canvas'); c.width = c.height = 128; const g = c.getContext('2d'), r = g.createRadialGradient(64, 64, 0, 64, 64, 64); r.addColorStop(0, 'rgba(255,255,255,1)'); r.addColorStop(.18, 'rgba(255,255,255,.75)'); r.addColorStop(.45, 'rgba(255,255,255,.16)'); r.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = r; g.fillRect(0, 0, 128, 128); return new THREE.CanvasTexture(c); })();
const glowM = c => new THREE.MeshBasicMaterial({ color: c, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, toneMapped: false, fog: false });
const spr = c => { const m = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowT, color: c, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, fog: false })); scene.add(m); return m; };
const packet = spr(new THREE.Color(5, 9, 14)), halo = spr(new THREE.Color(.5, 1.2, 2.6));
const trail = Array.from({ length: 16 }, () => spr(new THREE.Color(1.1, 2.4, 4.6)));
const rings = Array.from({ length: 12 }, () => { const m = new THREE.Mesh(new THREE.TorusGeometry(1, .03, 8, 96), glowM(new THREE.Color(.8, 2.2, 4))); m.rotation.x = Math.PI / 2; m.visible = false; scene.add(m); return m; });
const finOf = (c, t) => new THREE.Vector3(c.x, 1.84, carZ(c, t) - .98);
function carZ(c, t) { if (c === car2) return z2(t); if (c === car1) return c.z0 - 22 * (1 - ss(0, 1.5, t)); if (c.v) return c.z0 + c.v * t; return c.G.position.z; }
const hops = [ { c: car1, t0: 2.05 }, { c: relayA, t0: 3.05 }, { c: relayB, t0: 3.85 }, { c: relayC, t0: 4.65 }, { c: car2, t0: 5.75 } ];
function packetAt(t) {
  if (t <= hops[0].t0) return finOf(car1, t);
  for (let i = 0; i < hops.length - 1; i++) { const a = hops[i], b = hops[i + 1]; if (t < b.t0) { const u = (t - a.t0) / (b.t0 - a.t0), e = u * .75 + .25 * u * u * (3 - 2 * u), A = finOf(a.c, t), B = finOf(b.c, t), P = A.lerp(B, e); P.y += Math.sin(e * Math.PI) * 2.6; return P; } }
  return finOf(car2, t);
}

// ---- camera: keys in world space, or riding along with car 2 ----
const pz = t => { let z = 0; for (let i = -3; i <= 3; i++) z += packetAt(t + i * .16).z; return z / 7; };
const CK = [ // t, position, look, ref (0 world, 1 car 1, 2 car 2, 3 message, 4 where car 1 stops)
  [0.0, [.55, 1.35, -16], [2.3, 1.25, 12], 4],
  [1.0, [.8, 1.45, -13], [2.5, 1.3, 12], 4],
  [1.65, [2.3, 1.85, -6.6], [3.4, 1.45, -.4], 4],
  [2.1, [4.0, 2.12, -3.1], [3.4, 1.8, -.98], 4],
  [2.4, [5.3, 2.35, -1.3], [3.4, 1.82, -.98], 4],
  [2.7, [4.5, 2.5, .9], [3.4, 1.85, -1.4], 4],
  [3.0, [4.3, 3.0, 2.4], [3.4, 2.0, -9], 4],
  [3.45, [6.2, 6.0, 12], [3.4, 2.3, -22], 3],
  [4.0, [6.5, 6.8, 13], [3.4, 2.6, -22], 3],
  [4.85, [6.5, 6.8, 13], [3.4, 2.6, -22], 3],
  [5.4, [6.3, 3.1, 12], [3.4, 1.3, 0], 2],
  [5.85, [4.2, 2.65, 1.2], [3.4, 1.78, -.98], 2],
  [6.2, [3.2, 1.86, -.6], [3.08, 1.3, .6], 2],
  [6.6, [3.04, 1.44, -.62], [3.04, 1.2, .9], 2],
  [7.4, [3.04, 1.42, -.5], [3.04, 1.14, .47], 2],
  [8.3, [3.04, 1.33, -.2], [3.04, 1.09, .47], 2],
  [9.1, [3.04, 1.31, -.15], [3.04, 1.09, .47], 2],
];
const vp = [], vl = [];
function camAt(t) {
  const pzv = pz(t);
  const pts = CK.map(k => { const off = k[3] === 1 ? carZ(car1, t) : k[3] === 2 ? z2(t) : k[3] === 3 ? pzv : k[3] === 4 ? car1.z0 : 0; return { t: k[0], p: new THREE.Vector3(k[1][0], k[1][1], k[1][2] + off), l: new THREE.Vector3(k[2][0], k[2][1], k[2][2] + off) }; });
  let i = 0; while (i < pts.length - 2 && t > pts[i + 1].t) i++;
  const a = pts[Math.max(i - 1, 0)], b = pts[i], c = pts[i + 1], d = pts[Math.min(i + 2, pts.length - 1)], u = clamp((t - b.t) / (c.t - b.t));
  const cr = (A, B, C, D) => { // centripetal-ish tangents scaled by key spacing keep speed from overshooting
    const m1 = C.clone().sub(A).multiplyScalar((c.t - b.t) / Math.max(c.t - a.t, .001)), m2 = D.clone().sub(B).multiplyScalar((c.t - b.t) / Math.max(d.t - b.t, .001));
    const u2 = u * u, u3 = u2 * u; return B.clone().multiplyScalar(2 * u3 - 3 * u2 + 1).add(m1.multiplyScalar(u3 - 2 * u2 + u)).add(C.clone().multiplyScalar(-2 * u3 + 3 * u2)).add(m2.multiplyScalar(u3 - u2)); };
  return { p: cr(a.p, b.p, c.p, d.p), l: cr(a.l, b.l, c.l, d.l) };
}

function setWorld(t) {
  for (const c of cars) { const z = carZ(c, t); c.G.position.z = (c.v || c === car1 || c === car2) ? z : c.G.position.z; const sp = c === car2 ? z2vel(t) : c.v || 0; c.wheels.forEach(W => W.rotation.x = z / .385); if (!c.v && c !== car2) c.brakeM.emissiveIntensity = c === car1 ? 1 + 5 * ss(.1, .5, t) : 4.5; }
  relayA.brakeM.emissiveIntensity = relayB.brakeM.emissiveIntensity = relayC.brakeM.emissiveIntensity = 0;
  car2.brakeM.emissiveIntensity = 6 * car2.brakeK(t);
  const inside = t > 6.1; headliner.visible = t > 6.34; car2.ext.forEach(o => o.visible = !inside); cabin.visible = inside;
  cam.fov = 38 + 22 * ss(6.05, 6.45, t);
  // packet
  const P = packetAt(t), live = t >= hops[0].t0 - .05 && t < 6.05;
  const sz = (1 + .1 * Math.sin(t * 30)) * clamp(cam.position.distanceTo(P) * .05, .45, 1.6); packet.visible = halo.visible = live; packet.position.copy(P); halo.position.copy(P); packet.scale.setScalar(sz * 1.1); halo.scale.setScalar(sz * 4.2); halo.material.opacity = .5;
  trail.forEach((m, i) => { const tt = t - (i + 1) * .014; m.visible = live && tt > hops[0].t0; m.position.copy(packetAt(tt)); m.scale.setScalar(sz * .7 * (1 - i * .045)); m.material.opacity = .8 - i * .045; });
  // ripples leave each antenna
  let k = 0; for (const h of hops) for (let r = 0; r < 2; r++) { const m = rings[k++]; if (!m) continue; const dt = t - h.t0 - r * .16, on = dt > 0 && dt < .9 && t < 6.1; m.visible = on; if (on) { m.position.copy(finOf(h.c, t)); m.position.y += .02; m.scale.setScalar(.15 + dt * (h.c === car1 ? 2.6 : 7)); m.material.opacity = (1 - dt / .9) ** 2 * (h.c === car1 ? .55 : 1); } }
}

scene.traverse(o => { if (o.material && o.material.isMeshStandardMaterial && o.material.envMapIntensity === 1) o.material.envMapIntensity = .55; });

// ---- 2D labels, anchored to 3D points ----
const LBL = [
  { from: .45, to: 1.75, txt: 'TRAFFIC JAM', sub: 'CARS HAVE STOPPED', at: t => new THREE.Vector3(3.4, 2.1, carZ(car1, t) + 12) },
  { from: 2.0, to: 2.95, txt: 'ROOF ANTENNA', sub: 'SENDS THE WARNING', at: t => finOf(car1, t) },
  { from: 3.4, to: 4.9, txt: 'NEXT CAR PASSES IT ON', sub: 'HOP BY HOP', at: t => packetAt(t) },
  { from: 5.3, to: 5.9, txt: 'CAR 2', sub: 'STILL AT FULL SPEED', at: t => finOf(car2, t) },
];
const o = ov.getContext('2d');
const cl = v => v;
function drawOverlay(t) {
  o.clearRect(0, 0, 1080, 1920);
  o.font = '500 22px Mono'; o.fillStyle = 'rgba(255,255,255,.72)'; o.textAlign = 'right'; o.fillText('ILLUSTRATION', 1030, 128);
  const v = new THREE.Vector3();
  for (const L of LBL) { const a = ss(L.from, L.from + .22, t) * (1 - ss(L.to - .2, L.to, t)); if (a <= 0) continue; v.copy(L.at(t)).project(cam); if (v.z > 1) continue; const x = clamp((v.x + 1) * 540, 90, 990), y = clamp((1 - v.y) * 960, 200, 1500);
    const right = x < 540, tx = x + (right ? 80 : -80), ty = y - 112; o.globalAlpha = a; o.strokeStyle = '#fff'; o.lineWidth = 2.5; o.beginPath(); o.moveTo(x, y - 8); o.lineTo(tx, ty); o.stroke(); o.fillStyle = '#fff'; o.beginPath(); o.arc(x, y - 8, 6, 0, 7); o.fill();
    o.textAlign = right ? 'left' : 'right'; const dx = right ? 8 : -8; o.shadowColor = 'rgba(0,0,0,.65)'; o.shadowBlur = 12; o.font = '700 37px Inter'; o.fillStyle = '#ffc85a'; o.fillText(L.txt, tx + dx, ty - 28); o.font = '500 23px Mono'; o.fillStyle = '#fff'; o.fillText(L.sub, tx + dx, ty + 4); o.shadowBlur = 0; o.globalAlpha = 1; }
}

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
    // focus on the look target; aperture shrinks when the camera is far (keeps the wide shots readable)
    const focus = p.distanceTo(l), ap = THREE.MathUtils.clamp(focus * .0055, .0012, .05);
    const ang = j1 * 6.2832, rad = Math.sqrt(j2) * ap, dx = Math.cos(ang) * rad, dy = Math.sin(ang) * rad;
    cam.translateX(dx); cam.translateY(dy); cam.updateMatrixWorld();
    const P = cam.projectionMatrix.elements; P[8] = -P[0] * dx / focus - 2 * (j4 - .5) / W; P[9] = -P[5] * dy / focus - 2 * (j5 - .5) / H; cam.projectionMatrixInverse.copy(cam.projectionMatrix).invert();
    // sun disc + moving sky light; shadow frustum hugs what the camera looks at
    const span = THREE.MathUtils.clamp(focus * 1.6, 5, 190); const tgt = l;
    const sd = new THREE.Vector3(.62, .42, -.68).normalize(); const s1 = new THREE.Vector3(1, 0, 0).cross(sd).normalize(), s2 = sd.clone().cross(s1); const sa = j6 * 6.2832, sr = Math.sqrt(j1) * .1;
    const sdir = sd.clone().addScaledVector(s1, Math.cos(sa) * sr).addScaledVector(s2, Math.sin(sa) * sr).normalize();
    const az = j2 * 6.2832, el = Math.acos(Math.sqrt(j4)); const fdir = new THREE.Vector3(Math.cos(az) * Math.sin(el), Math.cos(el) + .05, Math.sin(az) * Math.sin(el)).normalize();
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
  finalS.m.uniforms.seed.value = t * 13.37; finalS.m.uniforms.fade.value = ss(0, .18, t) * (1 - ss(END - .2, END, t));
  R.setRenderTarget(null); R.render(finalS, fsCam);
  drawOverlay(t);
};
window.END = END;
await document.fonts.load('700 37px Inter'); await document.fonts.load('500 23px Mono');
window.ready = true;
